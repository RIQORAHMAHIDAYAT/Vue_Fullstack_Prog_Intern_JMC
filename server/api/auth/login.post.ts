
import { defineEventHandler, readBody, createError, getHeader } from "h3";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../../utils/db";
import { signToken } from "../../utils/jwt";
import { logActivity } from "../../utils/activity";
import { checkRateLimit, clearRateLimit } from "../../utils/rateLimiter";
import process from "node:process";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  const username = body.username;
  const password = body.password;
  const captchaToken = body.captchaToken || "";
  const captchaAnswer = body.captchaAnswer;
  const remember = body.remember === true;

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      message: "Username dan password wajib diisi",
    });
  }

  // --- RATE LIMITING ---
  const ip = getHeader(event, "x-forwarded-for") || getHeader(event, "x-real-ip") || event.node.req.socket.remoteAddress || "unknown"
  const rateKey = `login:${ip}`
  checkRateLimit(rateKey)

  // --- VALIDASI MATH CAPTCHA ---
  if (!captchaToken) {
    throw createError({ statusCode: 400, message: "Token captcha tidak ditemukan." });
  }
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw createError({ statusCode: 500, message: "Konfigurasi server tidak lengkap." });
  }
  let decoded: any;
  try {
    decoded = jwt.verify(captchaToken, jwtSecret);
  } catch {
    throw createError({ statusCode: 400, message: "Token captcha tidak valid. Silakan refresh halaman." });
  }
  if (decoded.type !== "captcha" || decoded.answer === undefined) {
    throw createError({ statusCode: 400, message: "Token captcha tidak valid. Silakan refresh halaman." });
  }
  const userAnswer = parseInt(captchaAnswer, 10);
  if (isNaN(userAnswer) || userAnswer !== decoded.answer) {
    throw createError({ statusCode: 400, message: "Jawaban captcha salah. Silakan coba lagi." });
  }

  // --- PROSES AUTHENTIKASI DATABASE ---
  const [rows]: any = await pool.query(
    `SELECT u.*, p.nama_pegawai, p.nomor_hp FROM user u 
     LEFT JOIN pegawai p ON u.id_pegawai = p.id 
     WHERE (u.username = ? OR u.email = ? OR p.nomor_hp = ?) AND u.disabled = 0`,
    [username, username, username],
  );

  if (rows.length === 0) {
    throw createError({ statusCode: 401, message: "Pengguna tidak ditemukan" });
  }

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw createError({ statusCode: 401, message: "Password salah" });
  }

  const tokenExpiry = remember ? "8h" : "3m"
  const token = signToken({
    id: user.id,
    id_role: user.id_role,
    id_pegawai: user.id_pegawai,
    username: user.username,
    nama: user.nama || user.nama_pegawai,
  }, tokenExpiry);

  await pool.execute(
    "UPDATE user SET last_login = NOW(), last_session = ? WHERE id = ?",
    [token, user.id],
  )

  const cookieMaxAge = remember ? 60 * 60 * 8 : 60 * 3
  setCookie(event, "auth_session", token, {
    secure: process.env.NODE_ENV === "production",
    maxAge: cookieMaxAge,
    path: "/",
    sameSite: "lax",
  });

  clearRateLimit(rateKey)

  const [permRows] = await pool.query(
    "SELECT modul_fitur, akses, `create`, `read`, `update`, `delete` FROM role_permission WHERE id_role = ?",
    [user.id_role],
  );

  await logActivity(event, "Login Aplikasi", `User ${user.username} login ke sistem`, user.id);

  return {
    success: true,
    token,
    user: {
      id: user.id,
      nama: user.nama || user.nama_pegawai,
      username: user.username,
      role: user.nama_role,
      id_role: user.id_role,
    },
    permissions: permRows,
  };
});
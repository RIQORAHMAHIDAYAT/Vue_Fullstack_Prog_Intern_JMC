import { defineEventHandler, createError } from "h3";
import jwt from "jsonwebtoken";
import process from "node:process";

export default defineEventHandler(() => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw createError({ statusCode: 500, message: "Konfigurasi server tidak lengkap." });
  }

  const a = Math.floor(Math.random() * 50) + 1;
  const b = Math.floor(Math.random() * 50) + 1;
  const op = Math.random() < 0.5 ? "+" : "-";
  const answer = op === "+" ? a + b : Math.max(a, b) - Math.min(a, b);
  const question = `${op === "+" ? a : Math.max(a, b)} ${op} ${op === "+" ? b : Math.min(a, b)} = ?`;

  const token = jwt.sign({ answer, type: "captcha" }, secret, { expiresIn: "5m" });

  return { question, token };
});

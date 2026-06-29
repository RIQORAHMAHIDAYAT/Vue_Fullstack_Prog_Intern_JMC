import { defineEventHandler, readBody, getRouterParam, createError } from "h3";
import pool from "../../utils/db";
import { logActivity } from "../../utils/activity";
import { enforcePermission } from "../../utils/permission";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  const auth = event.context.auth;
  await enforcePermission(event, auth.id_role);

  const [existing] = await pool.query("SELECT id FROM pegawai WHERE id = ?", [
    id,
  ]);
  if ((existing as any[]).length === 0) {
    throw createError({ statusCode: 404, message: "Pegawai tidak ditemukan" });
  }

  if (!body.nip || !body.nama_pegawai) {
    throw createError({ statusCode: 400, message: "NIP dan Nama wajib diisi" });
  }
  if (!/^\d{16,}$/.test(body.nip)) {
    throw createError({
      statusCode: 400,
      message: "NIP minimal 16 digit angka",
    });
  }
  if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    throw createError({ statusCode: 400, message: "Format email tidak valid" });
  }
  if (body.nomor_hp && !/^\+62[0-9]{6,15}$/.test(body.nomor_hp)) {
    throw createError({
      statusCode: 400,
      message: "Format nomor HP harus internasional (+62xxx)",
    });
  }
  if (body.nama_pegawai && !/^[a-zA-Z0-9\' ]+$/.test(body.nama_pegawai)) {
    throw createError({
      statusCode: 400,
      message: "Nama hanya boleh huruf, angka, petik, dan spasi",
    });
  }
  if (
    !body.jenis_kelamin ||
    !["Laki-laki", "Perempuan"].includes(body.jenis_kelamin)
  ) {
    throw createError({
      statusCode: 400,
      message: "Jenis kelamin wajib dipilih (Laki-laki/Perempuan)",
    });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.execute(
      `UPDATE pegawai SET foto_pegawai=?, nip=?, nama_pegawai=?, jenis_kelamin=?, email=?, nomor_hp=?, tempat_lahir=?,
        id_kecamatan=?, alamat_lengkap=?, jarak_rumah_kantor=?, tanggal_lahir=?, status_kawin=?,
        jumlah_anak=?, tanggal_masuk=?, id_jabatan=?, id_departemen=?, usia=?, status=?, jenis_kontrak=?
       WHERE id=?`,
      [
        body.foto_pegawai || null,
        body.nip,
        body.nama_pegawai,
        body.jenis_kelamin,
        body.email || null,
        body.nomor_hp || null,
        body.tempat_lahir || null,
        body.id_kecamatan || null,
        body.alamat_lengkap || null,
        body.jarak_rumah_kantor || null,
        body.tanggal_lahir || null,
        body.status_kawin || null,
        body.jumlah_anak || 0,
        body.tanggal_masuk || null,
        body.id_jabatan || null,
        body.id_departemen || null,
        body.usia || null,
        body.status || "Aktif",
        body.jenis_kontrak || "PKWTT",
        id,
      ],
    );

    await conn.query("DELETE FROM pegawai_pendidikan WHERE id_pegawai = ?", [
      id,
    ]);
    if (body.pendidikan && Array.isArray(body.pendidikan)) {
      for (const p of body.pendidikan) {
        if (p.tingkat_pendidikan || p.nama_sekolah) {
          await conn.execute(
            "INSERT INTO pegawai_pendidikan (id_pegawai, tingkat_pendidikan, nama_sekolah, tahun_lulus) VALUES (?, ?, ?, ?)",
            [id, p.tingkat_pendidikan, p.nama_sekolah, p.tahun_lulus || null],
          );
        }
      }
    }

    await conn.commit();

    await logActivity(
      event,
      "Ubah Pegawai",
      `Mengubah data pegawai ${body.nama_pegawai}`,
      auth?.id,
    );

    return { success: true, message: "Pegawai berhasil diupdate" };
  } catch (err: any) {
    await conn.rollback();
    if (err.code === "ER_DUP_ENTRY") {
      throw createError({
        statusCode: 409,
        message: "NIP atau Email sudah terdaftar",
      });
    }
    throw createError({ statusCode: 500, message: "Gagal mengupdate data" });
  } finally {
    conn.release();
  }
});

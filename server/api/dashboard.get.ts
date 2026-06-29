import { defineEventHandler } from "h3";
import pool from "../utils/db";

export default defineEventHandler(async (event) => {
  const auth = event.context.auth;
  if (!auth) {
    return {
      success: true,
      data: { role: "guest", greeting: "Selamat Datang" },
    };
  }

  const [rows] = (await pool.query(`
    SELECT 
      COUNT(*) as totalPegawai,
      SUM(CASE WHEN jenis_kontrak = 'PKWT' THEN 1 ELSE 0 END) as kontrak,
      SUM(CASE WHEN jenis_kontrak = 'PKWTT' THEN 1 ELSE 0 END) as tetap,
      SUM(CASE WHEN jenis_kontrak = 'Magang' THEN 1 ELSE 0 END) as magang,
      SUM(CASE WHEN jenis_kelamin = 'Laki-laki' THEN 1 ELSE 0 END) as pria,
      SUM(CASE WHEN jenis_kelamin = 'Perempuan' THEN 1 ELSE 0 END) as wanita
    FROM pegawai WHERE status = 'Aktif'
  `)) as any[];

  const stats = rows[0] || {
    totalPegawai: 0,
    kontrak: 0,
    tetap: 0,
    magang: 0,
    pria: 0,
    wanita: 0,
  };

  const perJabatan = (
    await pool.query(
      "SELECT mj.nama, COUNT(*) as total FROM pegawai p LEFT JOIN master_data mj ON p.id_jabatan = mj.id GROUP BY mj.nama",
    )
  )[0] as any[];

  const pegawaiTerbaru = (
    await pool.query(
      "SELECT p.id, p.nip, p.nama_pegawai as nama, p.tanggal_masuk, p.status, p.foto_pegawai as foto FROM pegawai p ORDER BY p.created_at DESC LIMIT 5",
    )
  )[0] as any[];

  return {
    success: true,
    data: {
      role: auth.nama_role || "User",
      greeting: `Selamat Datang ${auth.nama}`,
      user: auth,
      statistik: {
        totalPegawai: Number(stats.totalPegawai) || 0,
        kontrak: Number(stats.kontrak) || 0,
        tetap: Number(stats.tetap) || 0,
        magang: Number(stats.magang) || 0,
        pria: Number(stats.pria) || 0,
        wanita: Number(stats.wanita) || 0,
        perJabatan,
      },
      pegawaiTerbaru,
    },
  };
});

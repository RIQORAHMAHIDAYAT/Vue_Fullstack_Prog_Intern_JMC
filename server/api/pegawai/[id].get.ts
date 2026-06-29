import { defineEventHandler, getRouterParam, createError } from "h3"
import pool from "../../utils/db"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")

  const [pegawai] = await pool.query(
    `SELECT p.*, mj.nama as jabatan, md.nama as departemen,
            wk.kecamatan, wk.kabupaten, wk.provinsi
     FROM pegawai p
     LEFT JOIN master_data mj ON p.id_jabatan = mj.id
     LEFT JOIN master_data md ON p.id_departemen = md.id
     LEFT JOIN master_wilayah wk ON p.id_kecamatan = wk.id
     WHERE p.id = ?`,
    [id],
  )

  const rows = pegawai as any[]
  if (rows.length === 0) {
    throw createError({ statusCode: 404, message: "Pegawai tidak ditemukan" })
  }

  const [pendidikan] = await pool.query(
    "SELECT id, tingkat_pendidikan, nama_sekolah, tahun_lulus FROM pegawai_pendidikan WHERE id_pegawai = ? ORDER BY tahun_lulus DESC",
    [id],
  )

  return { success: true, data: { ...rows[0], pendidikan } }
})

import { defineEventHandler, getQuery, setHeader } from "h3"
import pool from "../../utils/db"
import { createRequire } from "node:module"
const require = createRequire(import.meta.url)
const XLSX = require("xlsx")
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let sql = `
    SELECT p.nip, p.nama_pegawai as nama, p.email, p.nomor_hp,
           mj.nama as jabatan, md.nama as departemen,
           p.tanggal_masuk, p.status
    FROM pegawai p
    LEFT JOIN master_data mj ON p.id_jabatan = mj.id
    LEFT JOIN master_data md ON p.id_departemen = md.id
    WHERE 1=1
  `
  const params: any[] = []

  if (query.ids) {
    const ids = String(query.ids).split(",").map(Number)
    sql += ` AND p.id IN (${ids.map(() => "?").join(",")})`
    params.push(...ids)
  }

  sql += " ORDER BY p.nama_pegawai"

  const [rows] = await pool.query(sql, params)
  const data = rows as any[]

  const wb = XLSX.utils.book_new()
  const wsData = [
    ["No", "NIP", "Nama", "Email", "No HP", "Jabatan", "Departemen", "Tanggal Masuk", "Status"],
    ...data.map((p: any, i: number) => [
      i + 1,
      p.nip || "",
      p.nama || "",
      p.email || "",
      p.nomor_hp || "",
      p.jabatan || "",
      p.departemen || "",
      p.tanggal_masuk ? new Date(p.tanggal_masuk).toLocaleDateString("id-ID") : "",
      p.status || "",
    ]),
  ]

  const ws = XLSX.utils.aoa_to_sheet(wsData)
  XLSX.utils.book_append_sheet(wb, ws, "Pegawai")

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })

  setHeader(event, "Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
  setHeader(event, "Content-Disposition", "attachment; filename=daftar-pegawai.xlsx")

  return buf
})

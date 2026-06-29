import { defineEventHandler, getQuery } from "h3"
import pool from "../../utils/db"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  let sql = "SELECT id, kecamatan, kabupaten, provinsi FROM master_wilayah"
  const params: any[] = []

  if (query.search) {
    sql += " WHERE kecamatan LIKE ?"
    params.push(`%${query.search}%`)
  }

  sql += " ORDER BY kecamatan LIMIT 50"
  const [rows] = await pool.query(sql, params)
  return { success: true, data: rows }
})

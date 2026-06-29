import { defineEventHandler } from "h3"
import pool from "../../utils/db"

export default defineEventHandler(async () => {
  const [rows] = await pool.query("SELECT id, nama FROM master_data WHERE tipe = 'jabatan' ORDER BY nama")
  return { success: true, data: rows }
})

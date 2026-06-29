import { defineEventHandler } from "h3"
import pool from "../utils/db"

export default defineEventHandler(async () => {
  const [rows] = await pool.query("SELECT id, nama_role, created_at FROM user_role ORDER BY id")
  return { success: true, data: rows }
})

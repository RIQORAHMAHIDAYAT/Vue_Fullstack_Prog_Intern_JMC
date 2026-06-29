/**
 * GET /api/tunjangan/setting
 * Mendapatkan konfigurasi tunjangan transport terbaru (base fare, min/max km, berlaku mulai).
 * Auth: JWT (required) — hanya user dengan akses `setting_tunjangan_transport`.
 * Response: { success, data: { id, base_fare, berlaku_mulai, min_km, max_km } | null }
 */
import { defineEventHandler } from "h3"
import pool from "../../utils/db"

export default defineEventHandler(async () => {
  const [rows] = await pool.query("SELECT * FROM tunjangan_setting ORDER BY id DESC LIMIT 1")
  return { success: true, data: (rows as any[])[0] || null }
})

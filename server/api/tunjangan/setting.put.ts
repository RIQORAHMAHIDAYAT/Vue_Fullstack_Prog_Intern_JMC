/**
 * PUT /api/tunjangan/setting
 * Menyimpan konfigurasi tunjangan transport (base fare, berlaku mulai, min/max km).
 * Auth: JWT (required) — hanya user dengan akses `setting_tunjangan_transport`.
 * Request body: { base_fare: number, berlaku_mulai: string (YYYY-MM-DD), min_km?: number, max_km?: number }
 * Response: { success, message }
 */
import { defineEventHandler, readBody, createError } from "h3"
import pool from "../../utils/db"
import { logActivity } from "../../utils/activity"
import { enforcePermission } from "../../utils/permission"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const auth = event.context.auth
  await enforcePermission(event, auth.id_role)

  if (!body.base_fare || !body.berlaku_mulai) {
    throw createError({ statusCode: 400, message: "Base fare dan berlaku mulai wajib diisi" })
  }

  await pool.execute(
    "INSERT INTO tunjangan_setting (base_fare, berlaku_mulai, min_km, max_km) VALUES (?, ?, ?, ?)",
    [body.base_fare, body.berlaku_mulai, body.min_km || 5, body.max_km || 25],
  )

  await logActivity(event, "Setting Tunjangan", "Mengupdate setting tunjangan transport", auth?.id)

  return { success: true, message: "Setting tunjangan berhasil disimpan" }
})

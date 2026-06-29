import { defineEventHandler, readBody, createError } from "h3"
import pool from "../../utils/db"
import { logActivity } from "../../utils/activity"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const auth = event.context.auth

  if (!body.ids || !Array.isArray(body.ids) || body.ids.length === 0) {
    throw createError({ statusCode: 400, message: "ID pegawai harus diisi" })
  }
  if (!["Aktif", "Nonaktif"].includes(body.status)) {
    throw createError({ statusCode: 400, message: "Status harus Aktif atau Nonaktif" })
  }

  const placeholders = body.ids.map(() => "?").join(",")
  await pool.execute(
    `UPDATE pegawai SET status = ? WHERE id IN (${placeholders})`,
    [body.status, ...body.ids],
  )

  await logActivity(
    event,
    `${body.status === "Aktif" ? "Aktifkan" : "Nonaktifkan"} Pegawai`,
    `${body.status === "Aktif" ? "Mengaktifkan" : "Menonaktifkan"} ${body.ids.length} pegawai`,
    auth?.id,
  )

  return { success: true, message: `Status ${body.ids.length} pegawai berhasil diupdate` }
})

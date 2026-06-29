import { defineEventHandler, readBody, getRouterParam, createError } from "h3"
import pool from "../../../utils/db"
import { logActivity } from "../../../utils/activity"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")
  const body = await readBody(event)
  const auth = event.context.auth

  if (body.disabled === undefined) {
    throw createError({ statusCode: 400, message: "Field disabled wajib diisi" })
  }

  await pool.execute("UPDATE user SET disabled = ? WHERE id = ?", [body.disabled ? 1 : 0, id])

  await logActivity(
    event,
    body.disabled ? "Nonaktifkan User" : "Aktifkan User",
    `${body.disabled ? "Menonaktifkan" : "Mengaktifkan"} user ID ${id}`,
    auth?.id,
  )

  return { success: true, message: "Status user berhasil diupdate" }
})

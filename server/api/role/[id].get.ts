import { defineEventHandler, getRouterParam, createError } from "h3"
import pool from "../../utils/db"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")

  const [role] = await pool.query("SELECT id, nama_role, created_at FROM user_role WHERE id = ?", [id])
  const roleRows = role as any[]
  if (roleRows.length === 0) {
    throw createError({ statusCode: 404, message: "Role tidak ditemukan" })
  }

  const [permissions] = await pool.query(
    "SELECT id, modul_fitur, akses, `create`, `read`, `update`, `delete` FROM role_permission WHERE id_role = ?",
    [id],
  )

  return { success: true, data: { ...roleRows[0], permissions } }
})

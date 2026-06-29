import { defineEventHandler, getRouterParam, createError } from "h3"
import pool from "../../utils/db"
import { logActivity } from "../../utils/activity"
import { enforcePermission } from "../../utils/permission"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")
  const auth = event.context.auth
  await enforcePermission(event, auth.id_role)

  const [existing] = await pool.query("SELECT nama_pegawai FROM pegawai WHERE id = ?", [id])
  const rows = existing as any[]
  if (rows.length === 0) {
    throw createError({ statusCode: 404, message: "Pegawai tidak ditemukan" })
  }

  await pool.query("DELETE FROM pegawai WHERE id = ?", [id])
  await logActivity(event, "Hapus Pegawai", `Menghapus pegawai ${rows[0].nama_pegawai}`, auth?.id)

  return { success: true, message: "Pegawai berhasil dihapus" }
})

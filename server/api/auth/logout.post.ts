import { defineEventHandler, getHeader, createError } from "h3"
import { verifyToken } from "../../utils/jwt"
import { logActivity } from "../../utils/activity"

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, "authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({ statusCode: 401, message: "Unauthorized" })
  }

  const token = authHeader.split(" ")[1]
  let decoded: any
  try {
    decoded = verifyToken(token)
  } catch {
    throw createError({ statusCode: 401, message: "Token invalid" })
  }

  await logActivity(event, "Logout", `User ${decoded.nama} logout`, decoded.id)

  return { success: true, message: "Logout berhasil" }
})

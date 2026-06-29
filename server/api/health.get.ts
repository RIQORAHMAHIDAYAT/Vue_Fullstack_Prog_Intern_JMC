import { defineEventHandler } from "h3"
import pool from "../utils/db"

export default defineEventHandler(async () => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok")
    const dbOk = (rows as any[])[0]?.ok === 1

    return {
      success: true,
      data: {
        status: dbOk ? "healthy" : "unhealthy",
        database: dbOk ? "connected" : "disconnected",
        timestamp: new Date().toISOString(),
      },
    }
  } catch {
    return {
      success: false,
      data: {
        status: "unhealthy",
        database: "disconnected",
        timestamp: new Date().toISOString(),
      },
    }
  }
})

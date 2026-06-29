import pool from "./db"
import { getClientInfo } from "./helpers"
import { H3Event } from "h3"

export async function logActivity(
  event: H3Event,
  title: string,
  content: string,
  userId: number | null = null,
) {
  try {
    const { ua, ip } = getClientInfo(event)
    const browser = ua.split(" ").slice(0, 3).join(" ") || ua
    const platform = ua.includes("Windows") ? "Windows" : ua.includes("Linux") ? "Linux" : "Unknown"

    await pool.execute(
      `INSERT INTO activities (title, content, ua, ip, url, browser, platform, created_at, updated_at, created_by, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?)`,
      [title, content, ua, ip, event.path, browser, platform, userId, userId],
    )
  } catch (err) {
    console.error("Activity log error:", err)
  }
}

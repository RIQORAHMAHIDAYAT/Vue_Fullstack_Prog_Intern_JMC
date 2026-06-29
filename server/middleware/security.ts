import { defineEventHandler, setHeader } from "h3"
import process from "node:process"

export default defineEventHandler((event) => {
  const isApi = event.node.req.url?.startsWith("/api")

  if (isApi) {
    setHeader(event, "Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "*")
    setHeader(event, "Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
    setHeader(event, "Access-Control-Allow-Headers", "Content-Type, Authorization")
    setHeader(event, "Access-Control-Allow-Credentials", "true")

    if (event.node.req.method === "OPTIONS") {
      event.node.res.statusCode = 204
      event.node.res.end()
    }
  }

  setHeader(event, "X-Content-Type-Options", "nosniff")
  setHeader(event, "X-Frame-Options", "DENY")
  setHeader(event, "X-XSS-Protection", "1; mode=block")
  setHeader(event, "Referrer-Policy", "strict-origin-when-cross-origin")
  setHeader(event, "Permissions-Policy", "geolocation=(), microphone=(), camera=()")

  if (process.env.NODE_ENV === "production") {
    setHeader(event, "Strict-Transport-Security", "max-age=31536000; includeSubDomains")
  }
})

import { H3Event, getHeader } from "h3"

export function success(data: any, message = "Berhasil") {
  return { success: true, message, data }
}

export function paginate(rows: any[], total: number, page: number, limit: number) {
  return {
    success: true,
    data: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export function getClientInfo(event: H3Event) {
  const ua = getHeader(event, "user-agent") || ""
  const ip = getHeader(event, "x-forwarded-for") || getHeader(event, "x-real-ip") || event.node.req.socket.remoteAddress || ""
  return { ua, ip }
}

export function parsePagination(query: any) {
  const page = Math.max(1, parseInt(query.page) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10))
  const offset = (page - 1) * limit
  return { page, limit, offset }
}

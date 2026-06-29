import { defineEventHandler, readMultipartFormData, createError } from "h3"
import { writeFile, mkdir, copyFile } from "node:fs/promises"
import { join } from "node:path"

const UPLOAD_DIR_DEV = join(process.cwd(), "public", "images", "pegawai")
const UPLOAD_DIR_PROD = join(process.cwd(), ".output", "public", "images", "pegawai")

export default defineEventHandler(async (event) => {
  const body = await readMultipartFormData(event)
  if (!body || body.length === 0) {
    throw createError({ statusCode: 400, message: "Tidak ada file yang diupload" })
  }

  const file = body[0]
  if (!file.filename) {
    throw createError({ statusCode: 400, message: "Nama file tidak ditemukan" })
  }

  if (file.data.length > 2 * 1024 * 1024) {
    throw createError({ statusCode: 400, message: "Ukuran file maksimal 2MB" })
  }

  const ext = file.filename.split(".").pop()?.toLowerCase()
  if (!["png", "jpg", "jpeg"].includes(ext || "")) {
    throw createError({ statusCode: 400, message: "Format file harus PNG/JPEG/JPG" })
  }

  const timestamp = Date.now()
  const safeName = `${timestamp}-${file.filename}`

  // Simpan ke public/ (dev mode)
  await mkdir(UPLOAD_DIR_DEV, { recursive: true })
  await writeFile(join(UPLOAD_DIR_DEV, safeName), file.data)

  // Simpan juga ke .output/public/ (production serve static)
  try {
    await mkdir(UPLOAD_DIR_PROD, { recursive: true })
    await writeFile(join(UPLOAD_DIR_PROD, safeName), file.data)
  } catch {
    // ignore if .output dir not available (e.g. dev mode without build)
  }

  return { success: true, data: { filename: safeName, url: `/images/pegawai/${safeName}` } }
})

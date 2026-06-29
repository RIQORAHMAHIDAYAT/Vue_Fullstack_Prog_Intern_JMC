import jwt from "jsonwebtoken";
import process from "node:process";

const EXPIRES_DEFAULT = process.env.JWT_EXPIRES_IN || "3m";

export function signToken(payload: Record<string, any>, expiresIn?: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET tidak dikonfigurasi")
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: (expiresIn || EXPIRES_DEFAULT) as any });
}

export function verifyToken(token: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET tidak dikonfigurasi")
  }
  return jwt.verify(token, process.env.JWT_SECRET);
}

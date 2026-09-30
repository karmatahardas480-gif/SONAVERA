import crypto from "crypto";

export const ADMIN_COOKIE = "sonavera_admin";

export function adminToken(password: string) {
  return crypto.createHmac("sha256", password).update("SONAVERA_ADMIN_SESSION_V1").digest("hex");
}

export function isValidAdminToken(token: string | undefined, password: string | undefined) {
  if (!token || !password) return false;
  const expected = adminToken(password);
  const a = Buffer.from(token, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

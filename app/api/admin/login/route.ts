import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken } from "@/lib/admin";

export async function POST(request: Request) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return NextResponse.json({ error: "ADMIN_PASSWORD is not configured." }, { status: 500 });

  const body = await request.json().catch(() => ({}));
  if (String(body?.password || "") !== password) return NextResponse.json({ error: "Incorrect admin password." }, { status: 401 });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, adminToken(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

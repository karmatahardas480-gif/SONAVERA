import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/admin";
import { supabaseGetOrders } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function GET() {
  const password = process.env.ADMIN_PASSWORD;
  const cookieStore = await cookies();
  if (!isValidAdminToken(cookieStore.get(ADMIN_COOKIE)?.value, password)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  try {
    const orders = await supabaseGetOrders(100);
    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Unable to load orders." }, { status: 500 });
  }
}

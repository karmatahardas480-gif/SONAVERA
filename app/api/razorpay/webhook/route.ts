import { NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook secret not configured." }, { status: 500 });

  const raw = await request.text();
  const signature = request.headers.get("x-razorpay-signature") || "";
  const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  const left = Buffer.from(expected, "utf8");
  const right = Buffer.from(signature, "utf8");
  if (!signature || left.length !== right.length || !crypto.timingSafeEqual(left, right)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  try {
    const event = JSON.parse(raw);
    // Razorpay retains payment/order state. The admin panel reads the live
    // Razorpay records, so no separate database update is necessary here.
    return NextResponse.json({ received: true, event: event?.event || "unknown" });
  } catch {
    return NextResponse.json({ error: "Invalid webhook payload." }, { status: 400 });
  }
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Razorpay from "razorpay";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/admin";

export const runtime = "nodejs";

export async function GET() {
  const password = process.env.ADMIN_PASSWORD;
  const cookieStore = await cookies();
  if (!isValidAdminToken(cookieStore.get(ADMIN_COOKIE)?.value, password)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json({ error: "Razorpay is not configured." }, { status: 500 });
  }

  try {
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const result = await razorpay.orders.all({ count: 100 });
    const rawOrders = Array.isArray((result as any)?.items) ? (result as any).items : [];

    const orders = await Promise.all(rawOrders.map(async (order: any) => {
      let payment: any = null;
      try {
        const payments = await razorpay.orders.fetchPayments(order.id);
        payment = Array.isArray((payments as any)?.items)
          ? (payments as any).items.find((p: any) => ["captured", "authorized"].includes(String(p.status))) || (payments as any).items[0]
          : null;
      } catch {
        payment = null;
      }

      const notes = order.notes || {};
      let items: any[] = [];
      try {
        items = String(notes.items || "").split(" | ").filter(Boolean).map((entry) => {
          const match = entry.match(/^(.*) x(\d+)$/);
          return match ? { name: match[1], quantity: Number(match[2]) } : { name: entry, quantity: 1 };
        });
      } catch {
        items = [];
      }

      return {
        id: order.id,
        order_id: order.id,
        razorpay_order_id: order.id,
        payment_id: payment?.id || null,
        payment_status: payment?.status === "captured" ? "paid" : payment?.status || order.status || "created",
        customer_name: notes.customer_name || "",
        customer_mobile: notes.customer_phone || "",
        customer_email: notes.customer_email || "",
        delivery_address: [notes.customer_address, notes.customer_city, notes.customer_state, notes.customer_pincode]
          .filter(Boolean).join(", "),
        items,
        amount: Number(order.amount || 0) / 100,
        currency: order.currency || "INR",
        created_at: order.created_at ? new Date(Number(order.created_at) * 1000).toISOString() : new Date().toISOString(),
      };
    }));

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error("Razorpay admin orders failed", error);
    return NextResponse.json({ error: error?.message || "Unable to load orders." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getProduct } from "@/lib/products";
import { supabaseInsertOrder } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

function clean(value: unknown, max = 120) {
  return String(value ?? "").trim().slice(0, max);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customer = body?.customer || {};
    const rawItems = Array.isArray(body?.items) ? body.items : [];

    if (!rawItems.length) return NextResponse.json({ error: "Cart is empty." }, { status: 400 });

    const items = rawItems
      .map((item: any) => ({ slug: clean(item?.slug, 100), quantity: Number(item?.quantity) }))
      .filter((item: { slug: string; quantity: number }) => item.slug && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 20);

    if (!items.length) return NextResponse.json({ error: "Invalid cart items." }, { status: 400 });

    const resolved: { item: { slug: string; quantity: number }; product: ReturnType<typeof getProduct> }[] = items.map((item: { slug: string; quantity: number }) => ({ item, product: getProduct(item.slug) }));
    if (resolved.some((row) => !row.product)) return NextResponse.json({ error: "One or more products are unavailable." }, { status: 400 });

    const total = resolved.reduce((sum: number, row: { item: { slug: string; quantity: number }; product: ReturnType<typeof getProduct> }) => sum + row.product!.price * row.item.quantity, 0);
    if (!Number.isSafeInteger(total) || total <= 0) return NextResponse.json({ error: "Invalid order total." }, { status: 400 });

    const name = clean(customer.name, 80);
    const phone = clean(customer.phone, 20);
    const email = clean(customer.email, 120);
    const address = clean(customer.address, 250);
    const city = clean(customer.city, 80);
    const state = clean(customer.state, 80);
    const pincode = clean(customer.pincode, 10);

    if (!name || !phone || !address || !city || !state || !/^\d{6}$/.test(pincode)) {
      return NextResponse.json({ error: "Please provide valid delivery details." }, { status: 400 });
    }
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, ""))) {
      return NextResponse.json({ error: "Please provide a valid 10-digit mobile number." }, { status: 400 });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel." }, { status: 500 });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: `SONA_${Date.now()}`,
      notes: {
        store: "SONAVERA JEWELS",
        customer_name: name,
        customer_phone: phone.replace(/\D/g, ""),
        customer_email: email.slice(0, 200),
        customer_city: city,
        customer_state: state,
        customer_pincode: pincode,
        items: resolved.map((row: { item: { slug: string; quantity: number }; product: ReturnType<typeof getProduct> }) => `${row.product!.name} x${row.item.quantity}`).join(" | ").slice(0, 240),
      },
    });

    try {
      await supabaseInsertOrder({
        order_id: order.id,
        razorpay_order_id: order.id,
        payment_status: "created",
        customer_name: name,
        customer_mobile: phone.replace(/\D/g, ""),
        customer_email: email || null,
        delivery_address: `${address}, ${city}, ${state} - ${pincode}`.slice(0, 500),
        items: resolved.map((row) => ({
          slug: row.product!.slug,
          name: row.product!.name,
          price: row.product!.price,
          quantity: row.item.quantity,
        })),
        amount: total,
        currency: "INR",
      });
    } catch (dbError: any) {
      console.error("Supabase order create failed", dbError);
      // Do not block a Razorpay order if the database is temporarily unavailable.
      // The verification route will attempt to save it again after successful payment.
    }

    return NextResponse.json({ id: order.id, amount: order.amount, currency: order.currency, key: keyId });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Could not create payment order." }, { status: 500 });
  }
}

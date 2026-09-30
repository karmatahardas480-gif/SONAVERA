import { NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { getProduct } from "@/lib/products";
import { supabaseInsertOrder, supabaseUpdateOrderByRazorpayOrderId } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

function safeEqualHex(a: string, b: string) {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ verified: false, error: "Missing payment details." }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    const keyId = process.env.RAZORPAY_KEY_ID;
    if (!secret || !keyId) return NextResponse.json({ verified: false, error: "Payment gateway is not configured." }, { status: 500 });

    const expected = crypto.createHmac("sha256", secret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
    if (!safeEqualHex(expected, String(razorpay_signature))) {
      return NextResponse.json({ verified: false, error: "Payment signature verification failed." }, { status: 400 });
    }

    const items = Array.isArray(body?.items) ? body.items : [];
    const total = items.reduce((sum: number, item: any) => {
      const product = getProduct(String(item?.slug || ""));
      const quantity = Number(item?.quantity);
      return product && Number.isInteger(quantity) && quantity > 0 && quantity <= 20 ? sum + product.price * quantity : sum;
    }, 0);
    if (!items.length || total <= 0) return NextResponse.json({ verified: false, error: "Invalid order items." }, { status: 400 });

    const razorpay = new Razorpay({ key_id: keyId, key_secret: secret });
    const order = await razorpay.orders.fetch(razorpay_order_id);
    if (Number(order.amount) !== total * 100 || order.currency !== "INR") {
      return NextResponse.json({ verified: false, error: "Order amount verification failed." }, { status: 400 });
    }

    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    if (payment.order_id !== razorpay_order_id) {
      return NextResponse.json({ verified: false, error: "Payment/order mismatch." }, { status: 400 });
    }
    if (!["captured", "authorized"].includes(String(payment.status))) {
      return NextResponse.json({ verified: false, error: `Payment status is ${payment.status || "unknown"}.` }, { status: 400 });
    }

    const resolvedItems = items.map((item: any) => {
      const product = getProduct(String(item?.slug || ""));
      return product ? { slug: product.slug, name: product.name, price: product.price, quantity: Number(item.quantity) } : null;
    }).filter(Boolean);
    const customer = body?.customer || {};
    const customerName = String(customer?.name || "").trim().slice(0, 80);
    const customerMobile = String(customer?.phone || "").replace(/\D/g, "").slice(0, 10);
    const customerEmail = String(customer?.email || "").trim().slice(0, 120);
    const customerAddress = [customer?.address, customer?.city, customer?.state, customer?.pincode]
      .map((v: unknown) => String(v || "").trim())
      .filter(Boolean)
      .join(", ")
      .slice(0, 500);

    try {
      const saved = await supabaseUpdateOrderByRazorpayOrderId(razorpay_order_id, {
        payment_id: razorpay_payment_id,
        payment_status: payment.status === "captured" ? "paid" : "authorized",
      });

      if (!saved) {
        await supabaseInsertOrder({
          order_id: razorpay_order_id,
          razorpay_order_id,
          payment_id: razorpay_payment_id,
          payment_status: payment.status === "captured" ? "paid" : "authorized",
          customer_name: customerName,
          customer_mobile: customerMobile,
          customer_email: customerEmail || null,
          delivery_address: customerAddress,
          items: resolvedItems,
          amount: total,
          currency: "INR",
        });
      }
    } catch (dbError: any) {
      console.error("Supabase payment save failed", dbError);
      return NextResponse.json({ verified: false, error: "Payment was verified, but order saving failed. Please contact SONAVERA support with your Payment ID." }, { status: 500 });
    }

    return NextResponse.json({ verified: true, orderId: razorpay_order_id, paymentId: razorpay_payment_id });
  } catch (error: any) {
    return NextResponse.json({ verified: false, error: error?.message || "Verification failed." }, { status: 500 });
  }
}

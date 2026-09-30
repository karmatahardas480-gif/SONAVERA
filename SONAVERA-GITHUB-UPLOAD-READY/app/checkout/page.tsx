"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useMemo, useState } from "react";
import { products } from "@/lib/products";
import { clearCart, readCart, type CartLine } from "@/lib/cart";

declare global { interface Window { Razorpay?: any; } }

type FormState = { name: string; phone: string; email: string; address: string; city: string; state: string; pincode: string };

export default function Checkout() {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [form, setForm] = useState<FormState>({ name: "", phone: "", email: "", address: "", city: "", state: "Gujarat", pincode: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [razorpayReady, setRazorpayReady] = useState(false);

  useEffect(() => {
    const refresh = () => setCart(readCart());
    refresh();
    window.addEventListener("cart-updated", refresh);
    return () => window.removeEventListener("cart-updated", refresh);
  }, []);

  const items = useMemo(() => cart.map((c) => ({ ...c, product: products.find((p) => p.slug === c.slug) })).filter((x) => x.product), [cart]);
  const total = items.reduce((sum, x) => sum + x.product!.price * x.quantity, 0);

  function update(field: keyof FormState, value: string) { setForm((prev) => ({ ...prev, [field]: value })); }

  async function pay() {
    setMessage("");
    const phone = form.phone.replace(/\D/g, "");
    if (!form.name.trim() || !phone || !form.address.trim() || !form.city.trim() || !form.state.trim() || !/^\d{6}$/.test(form.pincode.trim())) {
      setMessage("Please fill all required delivery details. Enter a valid 6-digit pincode.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) { setMessage("Please enter a valid 10-digit Indian mobile number."); return; }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) { setMessage("Please enter a valid email address."); return; }
    if (!items.length) { setMessage("Your cart is empty. Please add a product first."); return; }
    if (!razorpayReady || !window.Razorpay) { setMessage("Secure payment is still loading. Please wait a moment and try again."); return; }

    setLoading(true);
    try {
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: { ...form, phone }, items: items.map((x) => ({ slug: x.slug, quantity: x.quantity })) }),
      });
      const order = await orderRes.json().catch(() => ({}));
      if (!orderRes.ok) throw new Error(order.error || "Unable to create payment order.");

      const rzp = new window.Razorpay({
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: "SONAVERA JEWELS",
        description: "SONAVERA jewellery purchase",
        order_id: order.id,
        prefill: { name: form.name.trim(), email: form.email.trim(), contact: phone },
        notes: { customer_city: form.city.trim(), pincode: form.pincode.trim() },
        theme: { color: "#b8872e" },
        modal: { ondismiss: () => setLoading(false) },
        handler: async (response: any) => {
          try {
            setMessage("Verifying your payment securely…");
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                customer: { ...form, phone },
                items: items.map((x) => ({ slug: x.slug, quantity: x.quantity })),
              }),
            });
            const verified = await verifyRes.json().catch(() => ({}));
            if (!verifyRes.ok || !verified.verified) throw new Error(verified.error || "Payment verification failed.");
            clearCart();
            window.location.href = `/success?order=${encodeURIComponent(verified.orderId)}&payment=${encodeURIComponent(verified.paymentId)}`;
          } catch (error: any) {
            setLoading(false);
            setMessage(error?.message || "Payment verification failed. Please contact SONAVERA support with your payment ID.");
          }
        },
      });
      rzp.on("payment.failed", (response: any) => { setLoading(false); setMessage(response?.error?.description || "Payment failed. Please try again."); });
      rzp.open();
    } catch (error: any) {
      setLoading(false);
      setMessage(error?.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" onLoad={() => setRazorpayReady(true)} onError={() => setMessage("Secure payment gateway could not load. Please refresh and try again.")} />
      <main className="checkout">
        <div className="section-head"><span className="eyebrow">Secure Checkout</span><h1>Complete your order</h1><p className="muted">No payment screenshot is required. Your payment is verified automatically on the server.</p></div>
        <div className="checkout-grid">
          <section className="panel">
            <h2>Delivery Details</h2>
            <div className="field"><label htmlFor="name">Full name *</label><input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} autoComplete="name" /></div>
            <div className="field"><label htmlFor="phone">Mobile number *</label><input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} inputMode="tel" autoComplete="tel" maxLength={14} /></div>
            <div className="field"><label htmlFor="email">Email (optional)</label><input id="email" value={form.email} onChange={(e) => update("email", e.target.value)} inputMode="email" autoComplete="email" /></div>
            <div className="field"><label htmlFor="address">Full address *</label><textarea id="address" rows={3} value={form.address} onChange={(e) => update("address", e.target.value)} autoComplete="street-address" /></div>
            <div className="field"><label htmlFor="city">City *</label><input id="city" value={form.city} onChange={(e) => update("city", e.target.value)} autoComplete="address-level2" /></div>
            <div className="field"><label htmlFor="state">State *</label><input id="state" value={form.state} onChange={(e) => update("state", e.target.value)} autoComplete="address-level1" /></div>
            <div className="field"><label htmlFor="pincode">Pincode *</label><input id="pincode" value={form.pincode} onChange={(e) => update("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="postal-code" maxLength={6} /></div>
            {message && <div className="notice">{message}</div>}
            <button className="btn gold full" type="button" onClick={pay} disabled={loading || !items.length}>{loading ? "Processing securely…" : `Pay ₹${total.toLocaleString("en-IN")}`}</button>
            <Link className="btn light full" href="/cart">← Back to Cart</Link>
          </section>
          <aside className="panel">
            <h2>Your Order</h2>
            {items.length ? items.map((x) => <div className="summary-row" key={x.slug}><span>{x.product!.name} × {x.quantity}</span><strong>₹{(x.product!.price * x.quantity).toLocaleString("en-IN")}</strong></div>) : <p className="muted">Cart is empty.</p>}
            <div className="summary-row total-row"><span>Total</span><strong>₹{total.toLocaleString("en-IN")}</strong></div>
            <div className="notice">🔒 Payment is processed by Razorpay. The website verifies the payment signature and order amount on the server before confirming your order.</div>
          </aside>
        </div>
      </main>
    </>
  );
}

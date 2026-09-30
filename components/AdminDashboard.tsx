"use client";

import { useEffect, useState } from "react";
import { products } from "@/lib/products";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    setLoading(true); setError("");
    const response = await fetch("/api/admin/orders", { cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) setError(data.error || "Unable to load orders.");
    else setOrders(data.orders || []);
    setLoading(false);
  }

  useEffect(() => { loadOrders(); }, []);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <main className="checkout admin-page">
      <div className="admin-top"><div><span className="eyebrow">SONAVERA JEWELS</span><h1>Admin Dashboard</h1><p className="muted">Catalog, payment status and customer orders from Razorpay.</p></div><button className="btn light" onClick={logout}>Logout</button></div>
      <section className="panel">
        <div className="admin-section-head"><h2>Products ({products.length})</h2><span className="admin-pill">Live catalog</span></div>
        <div className="admin-products">{products.map((p) => <div className="admin-product" key={p.slug}><img src={p.images[0]} alt=""/><div><strong>{p.name}</strong><span>₹{p.price.toLocaleString("en-IN")}</span><small>{p.slug}</small></div></div>)}</div>
      </section>
      <section className="panel">
        <div className="admin-section-head"><h2>All Orders ({orders.length})</h2><button className="btn light" onClick={loadOrders}>Refresh</button></div>
        {loading ? <p className="muted">Loading orders…</p> : error ? <div className="notice">{error}</div> : !orders.length ? <p className="muted">No orders yet.</p> : <div className="admin-orders">{orders.map((o) => (
          <article className="admin-order-card" key={o.id}>
            <div className="admin-order-top">
              <div><strong>{o.razorpay_order_id || o.order_id}</strong><small>{new Date(o.created_at).toLocaleString("en-IN")}</small></div>
              <div className={`status ${o.payment_status}`}>{o.payment_status}</div>
            </div>
            <div className="admin-order-grid">
              <div><h4>Customer</h4><p><b>{o.customer_name || "—"}</b></p><p>{o.customer_mobile || "—"}</p><p>{o.customer_email || "—"}</p></div>
              <div><h4>Delivery Address</h4><p>{o.delivery_address || "—"}</p></div>
              <div><h4>Products</h4>{Array.isArray(o.items) && o.items.length ? o.items.map((i:any, idx:number) => <p key={idx}>{i.name} × {i.quantity}{i.price != null ? ` — ₹${Number(i.price).toLocaleString("en-IN")}` : ""}</p>) : <p>—</p>}</div>
              <div><h4>Payment</h4><p><b>Amount:</b> ₹{Number(o.amount).toLocaleString("en-IN")}</p><p><b>Payment ID:</b> {o.payment_id || "—"}</p><p><b>Method:</b> {o.payment_method || "—"}{o.payment_vpa ? ` (${o.payment_vpa})` : ""}</p><p><b>Razorpay Receipt:</b> {o.razorpay_receipt || "—"}</p></div>
            </div>
          </article>
        ))}</div>}
      </section>
    </main>
  );
}

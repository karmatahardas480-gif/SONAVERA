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
        <div className="admin-section-head"><h2>Recent Orders</h2><button className="btn light" onClick={loadOrders}>Refresh</button></div>
        {loading ? <p className="muted">Loading orders…</p> : error ? <div className="notice">{error}</div> : !orders.length ? <p className="muted">No orders yet.</p> : <div className="orders-table"><div className="order-head"><span>Order</span><span>Customer</span><span>Items</span><span>Amount</span><span>Status</span></div>{orders.map((o) => <div className="order-row" key={o.id}><span>{o.razorpay_order_id || o.order_id}<small>{new Date(o.created_at).toLocaleString("en-IN")}</small></span><span>{o.customer_name || "—"}<small>{o.customer_mobile || ""}</small></span><span>{Array.isArray(o.items) ? o.items.map((i:any) => `${i.name} ×${i.quantity}`).join(", ") : "—"}<small>{o.delivery_address || ""}</small></span><strong>₹{Number(o.amount).toLocaleString("en-IN")}</strong><span className={`status ${o.payment_status}`}>{o.payment_status}</span></div>)}</div>}
      </section>
    </main>
  );
}

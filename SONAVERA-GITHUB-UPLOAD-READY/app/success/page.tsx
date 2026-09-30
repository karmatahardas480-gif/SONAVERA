import Link from "next/link";

export default async function Success({ searchParams }: { searchParams: Promise<{ order?: string; payment?: string }> }) {
  const { order, payment } = await searchParams;
  return (
    <main className="success checkout">
      <div className="panel empty-cart">
        <div style={{ fontSize: 54 }}>✓</div>
        <span className="eyebrow">Payment Verified</span>
        <h1>Thank you for shopping with SONAVERA.</h1>
        <p className="muted">Your payment was verified successfully and your order has been received.</p>
        {order && <p><strong>Order ID:</strong> {order}</p>}
        {payment && <p><strong>Payment ID:</strong> {payment}</p>}
        <div className="notice">Please keep your Order ID for support or delivery follow-up.</div>
        <Link className="btn gold" href="/">Continue Shopping</Link>
      </div>
    </main>
  );
}

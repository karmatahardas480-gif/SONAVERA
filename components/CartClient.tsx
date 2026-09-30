"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { products } from "@/lib/products";
import { clearCart, readCart, removeFromCart, setCartQuantity, type CartLine } from "@/lib/cart";

export default function CartClient() {
  const [cart, setCart] = useState<CartLine[]>([]);

  const refresh = () => setCart(readCart());
  useEffect(() => {
    refresh();
    window.addEventListener("cart-updated", refresh);
    return () => window.removeEventListener("cart-updated", refresh);
  }, []);

  const items = useMemo(() => cart
    .map((line) => ({ ...line, product: products.find((p) => p.slug === line.slug) }))
    .filter((line) => line.product), [cart]);
  const total = items.reduce((sum, item) => sum + item.product!.price * item.quantity, 0);

  if (!items.length) {
    return (
      <main className="checkout empty-state">
        <div className="panel empty-cart">
          <span className="eyebrow">Your Bag</span>
          <h1>Your cart is empty.</h1>
          <p className="muted">Choose a SONAVERA piece and add it to your cart.</p>
          <Link className="btn gold" href="/#shop">Shop Collection</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout">
      <div className="section-head">
        <span className="eyebrow">Your Bag</span>
        <h1>Shopping Cart</h1>
        <p className="muted">Review your items before secure payment.</p>
      </div>
      <div className="cart-layout">
        <section className="panel cart-list">
          {items.map(({ slug, quantity, product }) => (
            <article className="cart-item" key={slug}>
              <img src={product!.images[0]} alt={product!.name} />
              <div className="cart-item-copy">
                <Link href={`/product/${slug}`}><h2>{product!.name}</h2></Link>
                <p className="muted">₹{product!.price.toLocaleString("en-IN")} each</p>
                <div className="qty-row">
                  <button type="button" onClick={() => setCartQuantity(slug, quantity - 1)} aria-label={`Decrease ${product!.name}`}>−</button>
                  <span>{quantity}</span>
                  <button type="button" onClick={() => setCartQuantity(slug, quantity + 1)} aria-label={`Increase ${product!.name}`}>+</button>
                  <button type="button" className="remove-btn" onClick={() => removeFromCart(slug)}>Remove</button>
                </div>
              </div>
              <strong>₹{(product!.price * quantity).toLocaleString("en-IN")}</strong>
            </article>
          ))}
          <button className="text-button" type="button" onClick={() => clearCart()}>Clear cart</button>
        </section>
        <aside className="panel cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row"><span>Items</span><strong>{items.reduce((n, x) => n + x.quantity, 0)}</strong></div>
          <div className="summary-row total-row"><span>Total</span><strong>₹{total.toLocaleString("en-IN")}</strong></div>
          <Link className="btn gold full" href="/checkout">Proceed to Secure Checkout</Link>
          <Link className="btn light full" href="/#shop">Continue Shopping</Link>
        </aside>
      </div>
    </main>
  );
}

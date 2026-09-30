"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readCart } from "@/lib/cart";

export default function Header() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(readCart().reduce((sum, item) => sum + item.quantity, 0));
    update();
    window.addEventListener("cart-updated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("cart-updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return (
    <header className="header">
      <Link href="/" className="brand" aria-label="SONAVERA JEWELS home">
        <img src="/brand/sonavera-logo.png" alt="SONAVERA JEWELS" className="brand-logo" />
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/">Home</Link>
        <Link href="/#shop">Shop</Link>
        <Link href="/#why">Why Sonavera</Link>
        <Link href="/cart" className="cart-link">Cart <b>{count}</b></Link>
      </nav>
    </header>
  );
}

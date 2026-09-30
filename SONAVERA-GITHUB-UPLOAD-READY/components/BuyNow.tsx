"use client";

import { useState } from "react";
import { addToCart, readCart, setCartQuantity } from "@/lib/cart";
import { useRouter } from "next/navigation";

export default function BuyNow({ slug }: { slug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function buyNow() {
    setLoading(true);
    const existing = readCart().find((item) => item.slug === slug);
    if (existing) setCartQuantity(slug, 1);
    else addToCart(slug, 1);
    router.push("/checkout?buyNow=1");
  }

  return (
    <button className="btn gold" onClick={buyNow} disabled={loading} type="button">
      {loading ? "Opening checkout…" : "Buy Now"}
    </button>
  );
}

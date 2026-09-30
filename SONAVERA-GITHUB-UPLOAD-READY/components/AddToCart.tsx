"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";

export default function AddToCart({ slug }: { slug: string }) {
  const [added, setAdded] = useState(false);

  function add() {
    addToCart(slug, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button className="btn dark" onClick={add} type="button">
      {added ? "✓ Added to Cart" : "Add to Cart"}
    </button>
  );
}

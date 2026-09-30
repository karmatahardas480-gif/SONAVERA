export type CartLine = { slug: string; quantity: number };

export const CART_KEY = "sonavera-cart";

export function readCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw
      .map((item) => ({ slug: String(item?.slug || ""), quantity: Number(item?.quantity || 0) }))
      .filter((item) => item.slug && Number.isInteger(item.quantity) && item.quantity > 0)
      .slice(0, 50);
  } catch {
    return [];
  }
}

export function writeCart(cart: CartLine[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(slug: string, quantity = 1) {
  const cart = readCart();
  const found = cart.find((item) => item.slug === slug);
  if (found) found.quantity = Math.min(20, found.quantity + quantity);
  else cart.push({ slug, quantity: Math.min(20, Math.max(1, quantity)) });
  writeCart(cart);
}

export function setCartQuantity(slug: string, quantity: number) {
  const next = readCart()
    .map((item) => item.slug === slug ? { ...item, quantity: Math.min(20, Math.max(0, quantity)) } : item)
    .filter((item) => item.quantity > 0);
  writeCart(next);
}

export function removeFromCart(slug: string) {
  writeCart(readCart().filter((item) => item.slug !== slug));
}

export function clearCart() {
  writeCart([]);
}

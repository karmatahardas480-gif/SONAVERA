import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/products";
import AddToCart from "@/components/AddToCart";
import BuyNow from "@/components/BuyNow";
import ProductGallery from "@/components/ProductGallery";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <main className="product-page">
      <Link href="/#shop" className="muted">← Back to collection</Link>
      <div className="product-grid" style={{ marginTop: 25 }}>
        <ProductGallery images={product.images} name={product.name} />
        <div>
          <span className="eyebrow">{product.badge}</span>
          <h1>{product.name}</h1>
          <div className="product-rating"><span className="stars">★★★★★</span><span className="rating-note">New collection · Leave your review after purchase</span></div>
          <p className="muted">{product.description}</p>
          <div className="product-price">₹{product.price.toLocaleString("en-IN")} <span className="old">₹{product.compareAt?.toLocaleString("en-IN")}</span></div>
          <div className="actions">
            <AddToCart slug={product.slug} />
            <BuyNow slug={product.slug} />
          </div>
          <ul className="info-list">
            <li><strong>Material:</strong> {product.material}</li>
            <li><strong>Presentation:</strong> Premium gift-style packaging</li>
            <li><strong>Payment:</strong> UPI, cards & net banking via secure gateway</li>
            <li><strong>Verification:</strong> Payment signature verified on server</li>
          </ul>
        </div>
      </div>
      <section className="review-section" aria-label="Customer reviews">
        <div className="review-head">
          <div>
            <span className="eyebrow">Customer Reviews</span>
            <h2>Love your SONAVERA piece?</h2>
          </div>
          <span className="product-rating"><span className="stars">★★★★★</span><span className="rating-note">Share your experience</span></span>
        </div>
        <div className="review-empty">
          <span className="stars">★★★★★</span>
          <p><strong>Be among the first to review.</strong><br />Your genuine feedback will appear here after purchase.</p>
          <Link href="/checkout" className="btn dark">Shop & Review</Link>
        </div>
      </section>
    </main>
  );
}

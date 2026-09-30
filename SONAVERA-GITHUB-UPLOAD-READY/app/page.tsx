import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/products";

export default function Home() {
  return (
    <>
      <section className="hero hero-premium">
        <div className="hero-copy">
          <span className="eyebrow">SONAVERA JEWELS</span>
          <h1>Jewellery that feels <em>special.</em></h1>
          <p>Elegant, gift-ready pieces with a premium finish — designed to make everyday moments feel a little more beautiful.</p>
          <div className="actions">
            <Link href="#shop" className="btn gold">Shop Collection</Link>
            <Link href="#why" className="btn light">Our Promise</Link>
          </div>
          <div className="trust">
            <span>✦ Premium Finish</span><span>♡ Gift Ready</span><span>✓ Secure Online Payment</span>
          </div>
        </div>
        <div className="hero-showcase" aria-label="SONAVERA jewellery collection">
          <div className="hero-glow" />
          <div className="hero-card hero-card-main">
            <Image src="/products/heart-box.jpg" alt="Elegant Heart Necklace" fill sizes="(max-width: 800px) 78vw, 42vw" priority />
            <span>Signature Heart</span>
          </div>
          <div className="hero-card hero-card-small">
            <Image src="/products/bow-box.jpg" alt="Elegant Bow Necklace" fill sizes="180px" />
            <span>New Arrival</span>
          </div>
          <div className="hero-price">Starting at <b>₹299</b></div>
        </div>
      </section>

      <section className="section collection-intro" id="shop">
        <div className="section-head">
          <span className="eyebrow">Our Collection</span>
          <h2>Made to be noticed.</h2>
          <p className="muted">Five signature pieces to explore the SONAVERA collection.</p>
        </div>
        <div className="products">
          {products.map((p) => (
            <article className="card" key={p.slug}>
              <Link href={`/product/${p.slug}`}>
                <div className="card-img">
                  <Image src={p.images[0]} alt={p.name} fill sizes="(max-width: 800px) 100vw, 50vw" />
                  <span className="badge">{p.badge}</span>
                </div>
              </Link>
              <div className="card-body">
                <h3>{p.name}</h3>
                <p className="muted">{p.short}</p>
                <div className="product-rating"><span className="stars">★★★★★</span><span className="rating-note">Customer reviews open after purchase</span></div>
                <div className="price">₹{p.price.toLocaleString("en-IN")} <span className="old">₹{p.compareAt?.toLocaleString("en-IN")}</span></div>
                <Link className="btn dark" href={`/product/${p.slug}`}>View Product</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial">
        <div>
          <span className="eyebrow">The SONAVERA Edit</span>
          <h2>Small details.<br /><em>Big impression.</em></h2>
          <p>Thoughtful pieces, beautiful presentation and an easy checkout experience — all in one place.</p>
          <Link href="#shop" className="text-link">Explore the collection →</Link>
        </div>
        <div className="editorial-images">
          <Image src="/products/jewellery-box-open.jpg" alt="SONAVERA jewellery presentation" fill sizes="(max-width: 800px) 90vw, 42vw" />
        </div>
      </section>

      <section className="section why" id="why">
        <div className="section-head">
          <span className="eyebrow">The SONAVERA Promise</span>
          <h2>Simple. Elegant. Giftable.</h2>
        </div>
        <div className="why-grid">
          <div className="why-item"><b>Premium Look</b><span>Luxury-inspired presentation for every product.</span></div>
          <div className="why-item"><b>Easy Styling</b><span>Lightweight designs made for everyday outfits.</span></div>
          <div className="why-item"><b>Gift Ready</b><span>Beautiful presentation for birthdays, anniversaries and special moments.</span></div>
          <div className="why-item"><b>Secure Checkout</b><span>Online payment is verified on the server before confirmation.</span></div>
        </div>
      </section>
    </>
  );
}

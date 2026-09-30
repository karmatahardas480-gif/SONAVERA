export type Product = {
  slug: string;
  name: string;
  price: number;
  compareAt?: number;
  short: string;
  description: string;
  material: string;
  badge: string;
  images: string[];
};

export const products: Product[] = [
  {
    slug: "elegant-heart-necklace",
    name: "Elegant Heart Necklace",
    price: 299,
    compareAt: 999,
    short: "A delicate heart pendant made for everyday elegance and gifting.",
    description:
      "A timeless heart necklace with a warm gold-finish look. Lightweight, elegant and designed to pair beautifully with everyday outfits or special occasions.",
    material: "Premium gold-finish alloy",
    badge: "Bestseller",
    images: [
      "/products/heart-box.jpg",
      "/products/heart-ad.jpg"
    ]
  },
  {
    slug: "elegant-bow-necklace",
    name: "Elegant Bow Necklace",
    price: 299,
    compareAt: 1099,
    short: "A graceful bow pendant with delicate bead details.",
    description:
      "A feminine bow necklace featuring a delicate chain and bead accents. A beautiful choice for daily wear, gifting and elegant styling.",
    material: "Premium gold-finish alloy",
    badge: "New Arrival",
    images: [
      "/products/bow-box.jpg",
      "/products/bow-ad.jpg"
    ]
  },
  {
    slug: "ruby-clover-hand-bracelet",
    name: "Ruby Clover Hand Bracelet",
    price: 299,
    compareAt: 799,
    short: "A delicate red-clover bracelet with a graceful gold-finish chain.",
    description:
      "A charming clover bracelet featuring rich ruby-red accents and a polished gold-finish chain. A stylish piece for everyday wear, festive looks and gifting.",
    material: "Premium gold-finish alloy with enamel-style clover accents",
    badge: "New Arrival",
    images: [
      "/products/clover-bracelet-box.jpg",
      "/products/clover-bracelet-wear.jpg"
    ]
  },
  {
    slug: "royal-swan-bangles",
    name: "Royal Swan Bangles",
    price: 399,
    compareAt: 699,
    short: "Adjustable swan-detail bangles with sparkling stone accents.",
    description:
      "A statement pair of adjustable bangles with graceful swan motifs, sparkling stone details and a rich gold-finish look. The adjustable design makes them easy to fit and comfortable for everyday or festive styling.",
    material: "Premium gold-finish alloy with stone accents",
    badge: "Bestseller",
    images: [
      "/products/swan-bangles-box.jpg",
      "/products/swan-bangles-wear.jpg"
    ]
  },
  {
    slug: "royal-heritage-jewellery-box",
    name: "Royal Heritage Jewellery Box",
    price: 399,
    compareAt: 899,
    short: "An ornate jewellery box with a luxurious heritage-inspired finish.",
    description:
      "A beautifully detailed decorative jewellery box designed for gifting and storing your favourite pieces. Its antique-inspired finish adds a premium traditional touch.",
    material: "Decorative metal-finish box with velvet-lined interior",
    badge: "Gift Favourite",
    images: [
      "/products/jewellery-box-closed.jpg",
      "/products/jewellery-box-open.jpg"
    ]
  }
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

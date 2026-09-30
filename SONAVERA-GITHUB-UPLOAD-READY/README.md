# SONAVERA JEWELS — Full Vercel Store

A complete Next.js jewellery storefront for SONAVERA JEWELS.

## Included

- Responsive premium storefront
- SONAVERA gold logo in the header + favicon
- 5 products with supplied product images
- Product pages with compact gallery + thumbnails
- Cart page with quantity controls, remove and clear cart
- Direct **Buy Now** checkout that works without requiring a previous cart visit
- Checkout with delivery details
- Razorpay online payment (UPI/cards/net banking as enabled in your Razorpay account)
- Server-side payment signature + order amount verification
- Razorpay webhook signature endpoint
- Password-protected `/admin` dashboard
- Admin dashboard shows the static product catalog and recent Razorpay orders
- No payment screenshot upload
- No external database required for basic checkout/order visibility

## Products

| Product | Price |
|---|---:|
| Elegant Heart Necklace | ₹299 |
| Elegant Bow Necklace | ₹299 |
| Ruby Clover Hand Bracelet | ₹299 |
| Royal Swan Bangles — Adjustable | ₹399 |
| Royal Heritage Jewellery Box | ₹399 |

## Deploy on Vercel

1. Extract this ZIP.
2. Upload the project files to a new GitHub repository, or import the folder into Vercel.
3. In Vercel, create/import the project. Framework should be detected as **Next.js**.
4. Add these Environment Variables in **Vercel → Project → Settings → Environment Variables**:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `ADMIN_PASSWORD`
   - `RAZORPAY_WEBHOOK_SECRET` (recommended)
   - `NEXT_PUBLIC_SITE_URL` (optional)
5. Redeploy after saving environment variables.
6. Open `/admin` and sign in with `ADMIN_PASSWORD`.

### Payment setup

Start with Razorpay **Test Mode** keys and make a test payment. When the complete flow works, replace the keys with your **Live Mode** keys and redeploy.

Webhook URL:

`https://YOUR-DOMAIN/api/razorpay/webhook`

Use the same webhook secret in Razorpay and `RAZORPAY_WEBHOOK_SECRET` in Vercel.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open `http://localhost:3000`.

## Build check

```bash
npm run build
npm start
```

## Security notes

- Never put `RAZORPAY_KEY_SECRET` or `ADMIN_PASSWORD` in client code.
- The server calculates the order amount from the product catalog instead of trusting the browser's total.
- The payment signature, Razorpay order amount, currency and payment/order relationship are checked server-side.
- Razorpay is the source of truth for the recent orders shown in the admin dashboard.
- 

## Orders & Admin

Orders are stored in Razorpay itself. Customer delivery details and cart items are saved in the Razorpay order notes, and the protected `/admin` dashboard reads the latest orders directly from Razorpay. No Supabase database is required for order storage.

Set these Vercel environment variables:

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `ADMIN_PASSWORD`
- `RAZORPAY_WEBHOOK_SECRET` (only if you configure the webhook)

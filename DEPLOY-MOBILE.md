# SONAVERA — simple deployment steps

## Option A: GitHub → Vercel

1. Extract this ZIP on your phone/computer.
2. Open your GitHub repository for SONAVERA.
3. Upload the **contents of this project folder** (not the outer folder itself if GitHub shows an extra nesting level).
4. Commit the files.
5. Open Vercel → **Add New Project** → import that GitHub repository.
6. Keep Framework Preset = **Next.js**.
7. Add Environment Variables:

   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `ADMIN_PASSWORD`
   - `RAZORPAY_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_SITE_URL`

8. Deploy.
9. After deployment open:
   - `/` — storefront
   - `/cart` — cart
   - `/checkout` — checkout
   - `/admin` — admin dashboard

## Razorpay

First use Razorpay Test Mode. Confirm the complete payment flow. Then switch the two Razorpay keys to Live Mode and redeploy.

Webhook:
`https://YOUR-DOMAIN/api/razorpay/webhook`

## Important

Never paste `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` or `ADMIN_PASSWORD` into GitHub files. Put them only in Vercel Environment Variables.

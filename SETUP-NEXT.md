# SONAVERA deployment checklist

1. GitHub repository created and project uploaded.
2. Vercel project imported from that repository.
3. Vercel environment variables added:
   - RAZORPAY_KEY_ID
   - RAZORPAY_KEY_SECRET
   - ADMIN_PASSWORD
   - RAZORPAY_WEBHOOK_SECRET
4. Redeploy.
5. Test `/`, `/shop` via homepage collection, `/cart`, product pages, `/checkout`, `/admin`.
6. Test Buy Now directly from a product page.
7. Test Add to Cart → Cart → Checkout.
8. Test Razorpay in Test Mode before switching to Live Mode.
9. Configure Razorpay webhook: `/api/razorpay/webhook`.

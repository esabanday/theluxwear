# LuxWear Co – Headless Shopify Storefront

Premium headless storefront built with Next.js (App Router), Tailwind, and the Shopify Storefront API. Hosted on DigitalOcean App Platform with Docker.

## Stack Choices
- Frontend: Next.js App Router + TypeScript + Tailwind
- Commerce: Shopify Storefront API (Cart API + checkout redirect)
- Hosting: DigitalOcean App Platform (Docker) – simplest, managed, HTTPS out of the box

## Local Setup
1. Install dependencies
   ```bash
   pnpm install
   ```
2. Copy `.env.example` to `.env.local` and fill in values.
3. Run dev server
   ```bash
   pnpm dev
   ```

## Shopify Storefront Token
1. In Shopify Admin, go to **Settings → Apps and sales channels → Develop apps**.
2. Create an app (or open existing).
3. Configure Storefront API scopes (read products, read collections, write/modify cart).
4. Install the app and copy the **Storefront access token**.
5. Set `SHOPIFY_STORE_DOMAIN` (e.g. `your-store.myshopify.com`) and `SHOPIFY_STOREFRONT_ACCESS_TOKEN`.

## Product & Collection Management
Manage products and collections in Shopify Admin. The site reads them via the Storefront API and updates automatically.

## DigitalOcean Deployment (App Platform)
1. Push this repo to GitHub.
2. In DigitalOcean App Platform, create a new app from GitHub.
3. Use **Dockerfile** build.
4. Add env vars from `.env.example` (mark secrets accordingly).
5. Deploy. App Platform will handle HTTPS and SSL.

### Optional App Spec
Edit `do-app.yaml` with your GitHub repo and use it in App Platform.

## Custom Domain
1. In App Platform, add your domain (e.g. `theluxwear.com`).
2. Update DNS at GoDaddy to point the `A` and `CNAME` records to DigitalOcean as instructed.
3. Wait for SSL to issue.

## Checkout Flow
Cart is created and managed via Shopify Cart API. Checkout button redirects to Shopify-hosted checkout.

## Newsletter
Newsletter submit posts to `NEWSLETTER_WEBHOOK_URL`. Use any email provider webhook (ConvertKit, Mailchimp, Klaviyo, etc.).

## Launch Checklist
- [ ] Storefront access token in env vars
- [ ] Products + collections in Shopify
- [ ] Shipping rates and taxes configured in Shopify
- [ ] Policies updated (shipping, returns, privacy, terms)
- [ ] Domain connected and SSL active
- [ ] Test order placed in Shopify (bogus payment)
- [ ] Analytics provider enabled (Plausible/GA4)
- [ ] Newsletter webhook configured
- [ ] Verify sitemap and robots

## Health Endpoint
`/api/health` returns `{ status: 'ok' }`.

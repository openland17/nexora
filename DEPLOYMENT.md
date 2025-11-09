# Deployment Guide

## Quick Deploy to Vercel (Recommended)

### Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/openland17/nexora.git
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Add environment variables (see below)
6. Click "Deploy"

### Step 3: Add Environment Variables in Vercel

In your Vercel project settings → Environment Variables, add:

```
DATABASE_URL=file:./dev.db
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
MUX_TOKEN_ID=...
MUX_TOKEN_SECRET=...
RESEND_API_KEY=re_...
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
PLATFORM_FEE_BPS=1500
```

**Important:** For production, you'll need a real database (not SQLite file). Use:
- Neon (PostgreSQL): https://neon.tech
- Vercel Postgres
- Supabase
- Any PostgreSQL provider

Update `DATABASE_URL` to your production database connection string.

### Step 4: Configure Webhooks

After deployment, you'll get a URL like: `https://your-app.vercel.app`

**Clerk Webhook:**
1. Go to Clerk Dashboard → Webhooks
2. Add endpoint: `https://your-app.vercel.app/api/webhooks/clerk`
3. Subscribe to: `user.created`, `user.updated`, `user.deleted`
4. Copy webhook secret to Vercel environment variables

**Stripe Webhook:**
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-app.vercel.app/api/stripe/webhook`
3. Subscribe to: `checkout.session.completed`
4. Copy webhook secret to Vercel environment variables

**Mux Webhook:**
1. Go to Mux Dashboard → Webhooks
2. Add endpoint: `https://your-app.vercel.app/api/mux/webhook`
3. Subscribe to: `video.asset.ready`, `video.upload.asset_created`

## Using Your Own Domain

### If You Buy from Squarespace:

1. **Buy Domain from Squarespace**
   - Purchase your domain (e.g., `nexora.com`)

2. **Get Vercel Domain Info**
   - In Vercel project → Settings → Domains
   - Click "Add Domain"
   - Enter your domain (e.g., `nexora.com`)
   - Vercel will show you DNS records to add

3. **Configure DNS in Squarespace**
   - Go to Squarespace → Settings → Domains → DNS Settings
   - Add these records (Vercel will provide exact values):
     ```
     Type: A
     Name: @
     Value: 76.76.21.21 (Vercel's IP - check Vercel dashboard for current IP)
     
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     ```

4. **Wait for DNS Propagation**
   - Can take 24-48 hours
   - Check status in Vercel dashboard

5. **Update Webhook URLs**
   - Update Clerk webhook: `https://nexora.com/api/webhooks/clerk`
   - Update Stripe webhook: `https://nexora.com/api/stripe/webhook`
   - Update Mux webhook: `https://nexora.com/api/mux/webhook`
   - Update `NEXT_PUBLIC_APP_URL` in Vercel environment variables

### Alternative: Buy Domain Elsewhere

You can buy from:
- **Namecheap** (recommended)
- **Google Domains**
- **Cloudflare** (cheapest, best DNS)
- **GoDaddy**

Then point DNS to Vercel the same way.

## Database for Production

SQLite won't work on Vercel. Use one of these:

### Option 1: Neon (Recommended - Free Tier)
1. Go to https://neon.tech
2. Create account and database
3. Copy connection string
4. Update `DATABASE_URL` in Vercel
5. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

### Option 2: Vercel Postgres
1. In Vercel dashboard → Storage
2. Create Postgres database
3. Copy connection string
4. Update `DATABASE_URL`

### Option 3: Supabase
1. Go to https://supabase.com
2. Create project
3. Copy connection string
4. Update `DATABASE_URL`

**Important:** After switching to PostgreSQL, update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

Then run:
```bash
npx prisma db push
npx prisma generate
```

## Summary

**You DON'T need:**
- ❌ Separate hosting (Vercel provides it)
- ❌ Server management
- ❌ SSL certificates (Vercel handles it)

**You DO need:**
- ✅ Vercel account (free)
- ✅ GitHub account (free)
- ✅ Production database (Neon/Supabase/Vercel Postgres)
- ✅ Domain (optional - Vercel provides free subdomain)

**Quick Start:**
1. Push code to GitHub
2. Deploy to Vercel
3. Use `your-app.vercel.app` for webhooks
4. Buy domain later if needed


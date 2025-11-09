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

Go to your Vercel project → Settings → Environment Variables and add ALL of these:

#### Required Environment Variables:

```
# Database (REQUIRED - Use MySQL for production, not SQLite!)
DATABASE_URL=mysql://user:password@host:3306/database

# Clerk Authentication (REQUIRED)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_... or pk_live_...
CLERK_SECRET_KEY=sk_test_... or sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...

# Stripe Payments (REQUIRED)
STRIPE_SECRET_KEY=sk_test_... or sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... or pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Mux Video (REQUIRED)
MUX_TOKEN_ID=your_mux_token_id
MUX_TOKEN_SECRET=your_mux_token_secret

# App URL (REQUIRED - Update after first deployment)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Email (Optional but recommended)
RESEND_API_KEY=re_...

# Platform Fee (Optional - defaults to 15%)
PLATFORM_FEE_BPS=1500
```

#### How to Get Each Value:

1. **DATABASE_URL**: 
   - **Option A: Railway (FREE with $5 monthly credit)**
     - Sign up at https://railway.app
     - New Project → Add MySQL database
     - Free tier includes $5/month credit (enough for small projects)
     - Copy connection string → Format: `mysql://user:password@host:3306/database`
   
   - **Option B: Render (FREE tier available)**
     - Sign up at https://render.com
     - New → PostgreSQL/MySQL → Choose MySQL
     - Free tier available (with some limitations)
     - Copy connection string
   
   - **Option C: Free MySQL.com Cloud (if available)**
     - Check https://www.mysql.com/cloud/ for free tier options
   
   - **Format:** `mysql://user:password@host:3306/database`

2. **Clerk Keys**:
   - Go to https://dashboard.clerk.com
   - Create/select your application
   - Copy `Publishable Key` → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Copy `Secret Key` → `CLERK_SECRET_KEY`
   - Create webhook → Copy secret → `CLERK_WEBHOOK_SECRET`

3. **Stripe Keys**:
   - Go to https://dashboard.stripe.com
   - Developers → API keys
   - Copy `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Copy `Secret key` → `STRIPE_SECRET_KEY`
   - Webhooks → Add endpoint → Copy signing secret → `STRIPE_WEBHOOK_SECRET`

4. **Mux Credentials**:
   - Go to https://dashboard.mux.com
   - Settings → API Access Tokens
   - Create token → Copy `Token ID` and `Token Secret`

5. **NEXT_PUBLIC_APP_URL**:
   - After first deployment, Vercel gives you a URL
   - Update this variable with your actual deployment URL
   - Example: `https://nexora-abc123.vercel.app`

6. **RESEND_API_KEY** (Optional):
   - Go to https://resend.com
   - Create API key → Copy to `RESEND_API_KEY`

**Important Notes:**
- Use **MySQL** for production (SQLite won't work on Vercel)
- Set all variables for **Production**, **Preview**, and **Development** environments
- After setting variables, **redeploy** your project

### Step 3.5: Database Setup

**IMPORTANT:** Your `prisma/schema.prisma` is configured for MySQL. Make sure your production database is MySQL.

**Recommended FREE Providers:**
- **Railway** (https://railway.app) - $5/month free credit, easy MySQL setup
- **Render** (https://render.com) - Free tier available for MySQL
- **Note:** For production, you may need to upgrade later, but these free tiers work for getting started

**Note:** You can keep SQLite for local development by using a different `.env` file locally, but the schema in the repo should be MySQL for Vercel.

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

SQLite won't work on Vercel. Use one of these **FREE** MySQL options:

### Option 1: Railway MySQL (FREE - $5 Monthly Credit)
1. Go to https://railway.app
2. Sign up (free with $5/month credit)
3. Create new project → Add MySQL database
4. Copy connection string from database settings
5. Update `DATABASE_URL` in Vercel
6. Run migrations after first deployment:
   ```bash
   npx prisma db push
   ```

### Option 2: Render MySQL (FREE Tier)
1. Go to https://render.com
2. Sign up (free tier available)
3. New → Database → MySQL
4. Create free MySQL database
5. Copy connection string
6. Update `DATABASE_URL` in Vercel

**Note:** Free tiers have limitations but are perfect for getting started. Upgrade later if needed.

**Important:** Your `prisma/schema.prisma` is already configured for MySQL:
```prisma
datasource db {
  provider = "mysql"  // Already configured
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
- ✅ Production database (Railway/Render MySQL - FREE tiers available)
- ✅ Domain (optional - Vercel provides free subdomain)

**Quick Start:**
1. Push code to GitHub
2. Deploy to Vercel
3. Use `your-app.vercel.app` for webhooks
4. Buy domain later if needed


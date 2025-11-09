# Next Steps - Deploy to Vercel

Follow these steps in order:

## Step 0: Fix Package Lock File (Already Done!)

✅ The `package-lock.json` has been updated and committed. This ensures Railway and Vercel can build correctly.

---

## Step 1: Set Up Free MySQL Database (5 minutes)

Choose ONE option:

### Option A: Render (FREE Tier Available - Recommended)
1. Go to https://render.com
2. Sign up (free tier available)
3. Click "New" → "Database"
4. Choose "MySQL"
5. Name it (e.g., "nexora-db")
6. Select "Free" plan (if available) or "Starter" plan
7. Click "Create Database"
8. Wait for it to provision (takes a few minutes)
9. Once ready, go to the database dashboard
10. Copy the "Internal Database URL" (looks like: `mysql://user:password@host:3306/database`)
11. **Important:** Use "Internal Database URL" for Vercel deployment

**Save this DATABASE_URL - you'll need it in Step 3!**

---

## Step 2: Deploy to Vercel (2 minutes)

1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "Add New Project"
4. Import your repository: `openland17/nexora`
5. Vercel will auto-detect Next.js settings
6. **DON'T click Deploy yet!** We need to add environment variables first.

---

## Step 3: Add Environment Variables in Vercel (10 minutes)

In your Vercel project (before deploying), go to **Settings → Environment Variables**

Add these variables one by one:

### Required Variables:

1. **DATABASE_URL**
   - Paste the MySQL connection string from Step 1
   - Format: `mysql://user:password@host:3306/database`
   - Select: Production, Preview, Development

2. **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**
   - Go to https://dashboard.clerk.com
   - Create/select your app
   - Copy "Publishable Key" (starts with `pk_test_` or `pk_live_`)
   - Select: Production, Preview, Development

3. **CLERK_SECRET_KEY**
   - Same Clerk dashboard
   - Copy "Secret Key" (starts with `sk_test_` or `sk_live_`)
   - Select: Production, Preview, Development

4. **CLERK_WEBHOOK_SECRET**
   - We'll set this up after first deployment (Step 5)
   - For now, you can skip or use a placeholder

5. **STRIPE_SECRET_KEY**
   - Go to https://dashboard.stripe.com
   - Developers → API keys
   - Copy "Secret key" (starts with `sk_test_` or `sk_live_`)
   - Select: Production, Preview, Development

6. **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**
   - Same Stripe dashboard
   - Copy "Publishable key" (starts with `pk_test_` or `pk_live_`)
   - Select: Production, Preview, Development

7. **STRIPE_WEBHOOK_SECRET**
   - We'll set this up after first deployment (Step 5)
   - For now, you can skip or use a placeholder

8. **MUX_TOKEN_ID**
   - Go to https://dashboard.mux.com
   - Settings → API Access Tokens
   - Create new token
   - Copy "Token ID"
   - Select: Production, Preview, Development

9. **MUX_TOKEN_SECRET**
   - Same Mux token you just created
   - Copy "Token Secret"
   - Select: Production, Preview, Development

10. **NEXT_PUBLIC_APP_URL**
    - **Leave this for now** - we'll update it after first deployment
    - Use placeholder: `https://your-app.vercel.app`
    - We'll update it in Step 4

11. **RESEND_API_KEY** (Optional but recommended)
    - Go to https://resend.com
    - Create API key
    - Copy the key (starts with `re_`)
    - Select: Production, Preview, Development

12. **PLATFORM_FEE_BPS** (Optional)
    - Value: `1500` (this means 15% platform fee)
    - Select: Production, Preview, Development

---

## Step 4: Deploy! (2 minutes)

1. Go back to your Vercel project
2. Click "Deploy" button
3. Wait for build to complete (2-5 minutes)
4. Once deployed, you'll get a URL like: `https://nexora-abc123.vercel.app`
5. **Copy this URL!**

---

## Step 5: Update NEXT_PUBLIC_APP_URL (1 minute)

1. In Vercel → Settings → Environment Variables
2. Find `NEXT_PUBLIC_APP_URL`
3. Update it to your actual deployment URL (from Step 4)
4. Click "Save"
5. Go to "Deployments" tab
6. Click the 3 dots on latest deployment → "Redeploy"

---

## Step 6: Set Up Database Schema (2 minutes)

After first deployment, run this command locally:

```bash
npx prisma db push
```

Or if you have Prisma Studio installed:
```bash
npx prisma generate
npx prisma db push
```

This will create all the tables in your MySQL database.

---

## Step 7: Configure Webhooks (10 minutes)

After deployment, configure webhooks using your Vercel URL:

### Clerk Webhook:
1. Go to https://dashboard.clerk.com → Your App → Webhooks
2. Click "Add Endpoint"
3. URL: `https://your-app.vercel.app/api/webhooks/clerk`
4. Subscribe to: `user.created`, `user.updated`, `user.deleted`
5. Copy the "Signing Secret"
6. Go to Vercel → Environment Variables
7. Update `CLERK_WEBHOOK_SECRET` with the signing secret
8. Redeploy

### Stripe Webhook:
1. Go to https://dashboard.stripe.com → Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://your-app.vercel.app/api/stripe/webhook`
4. Subscribe to: `checkout.session.completed`
5. Copy the "Signing secret"
6. Go to Vercel → Environment Variables
7. Update `STRIPE_WEBHOOK_SECRET` with the signing secret
8. Redeploy

### Mux Webhook:
1. Go to https://dashboard.mux.com → Settings → Webhooks
2. Click "Add Webhook"
3. URL: `https://your-app.vercel.app/api/mux/webhook`
4. Subscribe to: `video.asset.ready`, `video.upload.asset_created`
5. Save

---

## Step 8: Create Your First Admin User

1. Visit your deployed site: `https://your-app.vercel.app`
2. Sign up through Clerk
3. Note your email address
4. Connect to your MySQL database (via Railway/Render dashboard or Prisma Studio)
5. Run this SQL query:
   ```sql
   UPDATE User SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```
6. Refresh your site - you should now have admin access!

---

## ✅ You're Done!

Your marketplace should now be live at `https://your-app.vercel.app`

**Quick Checklist:**
- [ ] MySQL database created and connected
- [ ] Vercel deployment successful
- [ ] All environment variables set
- [ ] Database schema pushed
- [ ] Webhooks configured
- [ ] Admin user created

**Need Help?**
- Check the full `DEPLOYMENT.md` for detailed instructions
- Check Vercel build logs if deployment fails
- Make sure all environment variables are set correctly


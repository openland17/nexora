# Setup Guide

## Prerequisites

1. Node.js 18+ installed
2. Accounts for:
   - Clerk (authentication)
   - Stripe (payments)
   - Mux (video hosting)
   - Resend (email - optional)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory with the following:

```env
# Database (SQLite)
DATABASE_URL="file:./dev.db"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Mux
MUX_TOKEN_ID=...
MUX_TOKEN_SECRET=...

# Resend (Optional)
RESEND_API_KEY=re_...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
PLATFORM_FEE_BPS=1500
```

### 3. Database Setup

```bash
# Push schema to database
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

### 4. Clerk Setup

1. Create a Clerk account at https://clerk.com
2. Create a new application
3. Copy the publishable key and secret key
4. Set up webhook endpoint: `https://yourdomain.com/api/webhooks/clerk`
5. Add webhook secret to `.env`

### 5. Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Enable Connect Express accounts
3. Copy API keys to `.env`
4. Set up webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
5. Subscribe to `checkout.session.completed` event
6. Add webhook signing secret to `.env`

### 6. Mux Setup

1. Create a Mux account at https://mux.com
2. Generate API token
3. Copy token ID and secret to `.env`
4. Set up webhook endpoint: `https://yourdomain.com/api/mux/webhook`
5. Subscribe to `video.asset.ready` event

### 7. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Creating Your First Admin User

1. Sign up through Clerk
2. In your database, update the user:
   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

## Video Upload Process

When creating a lesson, the system creates a Mux asset. To upload videos:

1. Use Mux's Direct Upload API
2. Upload to the asset ID returned when creating a lesson
3. Mux webhook will update the lesson with playback ID when ready

Example using Mux SDK:
```javascript
const upload = await mux.video.directUploads.create({
  new_asset_settings: {
    playback_policy: 'public'
  }
})
```

## Deployment

### Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy

### Database Migrations

For production:
```bash
npx prisma migrate deploy
```

Note: SQLite is great for development. For production, consider PostgreSQL for better performance and concurrent access.

## Testing Checklist

- [ ] User can sign up and sign in
- [ ] Creator can apply (admin approval required)
- [ ] Creator can set up Stripe Connect
- [ ] Creator can create courses
- [ ] Creator can add modules and lessons
- [ ] Admin can approve creators
- [ ] Admin can approve courses
- [ ] Learner can browse courses
- [ ] Learner can purchase course
- [ ] Learner can access enrolled content
- [ ] Free preview lessons work
- [ ] Refunds remove access
- [ ] Payouts process correctly

## Common Issues

### Database Connection

If you see connection errors:
- Check DATABASE_URL format
- Ensure database file is writable

### Stripe Webhooks

- Use Stripe CLI for local testing: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Verify webhook secret matches

### Mux Uploads

- Ensure Mux webhook is configured
- Check asset status in Mux dashboard
- Verify playback IDs are set after upload


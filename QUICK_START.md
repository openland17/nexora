# Quick Start Guide

Get your Nexora marketplace up and running quickly with this guide.

## Prerequisites

- Node.js 20.9.0 or higher
- npm 9.0.0 or higher
- Accounts for: Clerk, Stripe, Mux (and optionally Resend)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment Variables

1. Copy the environment template:
   ```bash
   cp env.template .env
   ```

2. Edit `.env` and fill in your service keys:
   - Get Clerk keys from https://dashboard.clerk.com
   - Get Stripe keys from https://dashboard.stripe.com (use test keys initially)
   - Get Mux credentials from https://dashboard.mux.com
   - Get Resend API key from https://resend.com (optional)

3. Verify your environment variables are set correctly:
   ```bash
   npm run verify:env
   ```
   This will check if all required variables are present and provide helpful guidance.

## Step 3: Set Up Database

For local development with SQLite:
```bash
npm run db:setup
```

For production with MySQL, set `DATABASE_URL` to your MySQL connection string first, then run:
```bash
npm run db:setup
```

## Step 4: Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Step 5: Create Your First Admin User

1. Sign up through Clerk at http://localhost:3000/sign-up
2. Note your email address
3. Run the admin creation script:
   ```bash
   npm run admin:create your-email@example.com
   ```
4. Refresh the page - you should now have admin access!

## Next Steps

- **For local development:** You're all set! Start creating courses and testing functionality.
- **For production deployment:** Follow the detailed guide in `production-launch-plan.plan.md` or `DEPLOYMENT.md`

## Useful Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:studio` - Open Prisma Studio to view/edit database
- `npm run db:push` - Push schema changes to database
- `npm run admin:create <email>` - Make a user an admin

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is set correctly
- For SQLite, ensure the `prisma` directory exists and is writable
- For MySQL, verify connection string format: `mysql://user:password@host:3306/database`

### Clerk Authentication Issues
- Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are set
- Check that Clerk webhook is configured (for production)

### Stripe Payment Issues
- Use test mode keys initially (`sk_test_...` and `pk_test_...`)
- Verify Stripe webhook is configured (for production)
- Test with Stripe test cards: https://stripe.com/docs/testing

### Mux Video Issues
- Verify `MUX_TOKEN_ID` and `MUX_TOKEN_SECRET` are set
- Check Mux webhook is configured (for production)
- Ensure CORS settings allow your domain

## Getting Help

- Check `DEPLOYMENT.md` for detailed deployment instructions
- Check `NEXT_STEPS.md` for step-by-step Vercel deployment
- Check `SETUP.md` for detailed setup information
- Review `scripts/deployment-checklist.md` before going live


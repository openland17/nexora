# Nexora - AI Course Marketplace

A production-ready marketplace for AI courses built with Next.js 14, TypeScript, Prisma, Stripe, and Mux.

## Features

- **Public Marketplace**: Browse courses with search and filters
- **Creator Tools**: Apply, create courses, upload videos, receive payouts
- **Payment Processing**: Stripe Checkout with 15% platform fee
- **Video Streaming**: Mux integration for course content
- **Admin Dashboard**: Approve creators/courses, manage refunds
- **Role-based Access**: Learners, Creators, and Admins

## Tech Stack

- **Framework**: Next.js 14 App Router
- **Database**: Prisma + SQLite
- **Auth**: Clerk
- **Payments**: Stripe + Connect Express
- **Video**: Mux
- **Email**: Resend
- **UI**: Tailwind CSS + shadcn/ui

## Quick Start

For a quick setup guide, see **[QUICK_START.md](./QUICK_START.md)**

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy `env.template` to `.env` and fill in all values:
   - Database URL (SQLite for dev: `file:./prisma/dev.db`, MySQL for production)
   - Clerk keys (from https://dashboard.clerk.com)
   - Stripe keys (from https://dashboard.stripe.com)
   - Mux credentials (from https://dashboard.mux.com)
   - Resend API key (optional, from https://resend.com)

3. **Set up database**:
   ```bash
   npm run db:setup
   ```
   Or manually:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

5. **Create your first admin user**:
   - Sign up at http://localhost:3000/sign-up
   - Run: `npm run admin:create your-email@example.com`

## Environment Variables

```env
DATABASE_URL=file:./dev.db
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
PLATFORM_FEE_BPS=1500
```

## Key Routes

### Public
- `/` - Homepage
- `/courses` - Course catalog
- `/courses/[slug]` - Course detail page
- `/roles/[slug]` - SEO role pages

### Protected
- `/learn/[courseId]` - Video player (enrollment-gated)
- `/creator/apply` - Creator application
- `/creator/dashboard` - Course management
- `/admin` - Admin approvals

### API
- `/api/stripe/checkout` - Create checkout session
- `/api/stripe/webhook` - Handle Stripe webhooks
- `/api/creator/*` - Creator endpoints
- `/api/courses/*` - Course CRUD
- `/api/admin/*` - Admin operations

## Deployment

For detailed deployment instructions, see:
- **[production-launch-plan.plan.md](./production-launch-plan.plan.md)** - Complete production launch plan
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Detailed deployment guide
- **[NEXT_STEPS.md](./NEXT_STEPS.md)** - Quick Vercel deployment steps
- **[scripts/deployment-checklist.md](./scripts/deployment-checklist.md)** - Pre-launch checklist

Quick steps:
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

## Notes

- Stripe Connect onboarding required for creators
- Admin approval required for creators and courses
- 15% platform fee on all sales
- Automated payouts run weekly (cron job)


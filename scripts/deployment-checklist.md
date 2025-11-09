# Deployment Checklist

Use this checklist to ensure all steps are completed before going live.

## Pre-Deployment

### Service Accounts
- [ ] Clerk account created and application set up
- [ ] Stripe account created and verified (business info complete)
- [ ] Stripe Connect Express enabled
- [ ] Mux account created and API token generated
- [ ] Resend account created (optional but recommended)

### Local Testing
- [ ] All dependencies installed (`npm install`)
- [ ] Environment variables configured locally
- [ ] Database schema pushed (`npx prisma db push`)
- [ ] Local development server runs without errors
- [ ] Core functionality tested locally:
  - [ ] User sign up/login
  - [ ] Creator application
  - [ ] Course creation
  - [ ] Video upload
  - [ ] Payment checkout (test mode)

## Database Setup

- [ ] Production MySQL database created (Render/Aiven/etc.)
- [ ] Database connection string copied
- [ ] Database credentials saved securely

## Vercel Deployment

- [ ] Code pushed to GitHub repository
- [ ] Vercel account created and connected to GitHub
- [ ] Project imported in Vercel
- [ ] All environment variables added to Vercel:
  - [ ] DATABASE_URL
  - [ ] NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  - [ ] CLERK_SECRET_KEY
  - [ ] CLERK_WEBHOOK_SECRET (set after first deployment)
  - [ ] STRIPE_SECRET_KEY
  - [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  - [ ] STRIPE_WEBHOOK_SECRET (set after first deployment)
  - [ ] MUX_TOKEN_ID
  - [ ] MUX_TOKEN_SECRET
  - [ ] NEXT_PUBLIC_APP_URL
  - [ ] RESEND_API_KEY (optional)
  - [ ] PLATFORM_FEE_BPS
- [ ] Initial deployment successful
- [ ] Deployment URL noted
- [ ] NEXT_PUBLIC_APP_URL updated with actual URL
- [ ] Redeployed after URL update

## Database Schema

- [ ] Database schema pushed to production database
- [ ] Tables created successfully
- [ ] Can connect to database and verify schema

## Webhooks Configuration

- [ ] Clerk webhook configured:
  - [ ] Endpoint URL set
  - [ ] Events subscribed (user.created, user.updated, user.deleted)
  - [ ] Signing secret copied to Vercel
  - [ ] Redeployed after adding secret
- [ ] Stripe webhook configured:
  - [ ] Endpoint URL set
  - [ ] Event subscribed (checkout.session.completed)
  - [ ] Signing secret copied to Vercel
  - [ ] Redeployed after adding secret
- [ ] Mux webhook configured:
  - [ ] Endpoint URL set
  - [ ] Events subscribed (video.asset.ready, video.upload.asset_created)

## Admin Setup

- [ ] First user signed up through Clerk
- [ ] User email noted
- [ ] Admin role assigned in database
- [ ] Admin access verified

## Production Testing

- [ ] Homepage loads correctly
- [ ] Sign up/login works
- [ ] Creator application form works
- [ ] Admin can approve creators
- [ ] Creators can create courses
- [ ] Video upload works
- [ ] Course purchase flow works (test mode)
- [ ] Enrollment grants access to course content
- [ ] Video player loads and plays

## Production Readiness

### Payment Configuration
- [ ] Switched to live Stripe keys (if going live)
- [ ] Stripe account fully verified
- [ ] Test payments work correctly

### Authentication
- [ ] Switched to live Clerk keys (if going live)
- [ ] Production application configured

### Domain (Optional)
- [ ] Custom domain purchased
- [ ] DNS records configured
- [ ] Domain verified in Vercel
- [ ] SSL certificate active
- [ ] Webhook URLs updated to custom domain
- [ ] NEXT_PUBLIC_APP_URL updated

### Email
- [ ] Resend domain verified (if using)
- [ ] Email sending tested

### Security
- [ ] All environment variables set
- [ ] No sensitive data in client-side code
- [ ] API routes have proper authentication
- [ ] Admin routes protected
- [ ] HTTPS enabled (automatic on Vercel)

### Performance
- [ ] Page load times acceptable
- [ ] Images optimized
- [ ] Database queries performant

## Legal & Compliance

- [ ] Terms of Service page created
- [ ] Privacy Policy page created
- [ ] Refund Policy page created
- [ ] Creator Agreement created (if applicable)
- [ ] GDPR compliance considered (if serving EU)

## Monitoring & Analytics

- [ ] Vercel Analytics enabled
- [ ] Error tracking set up (optional)
- [ ] Uptime monitoring configured (optional)
- [ ] Google Analytics or similar configured (optional)

## Pre-Launch

- [ ] All tests pass
- [ ] All environment variables are production keys
- [ ] Custom domain configured (if using)
- [ ] SSL certificate active
- [ ] Database backups configured
- [ ] Monitoring active
- [ ] Support email set up
- [ ] Support process documented

## Launch

- [ ] Final pre-launch check complete
- [ ] Ready to announce launch
- [ ] Monitoring active for first 24 hours
- [ ] Support team ready to respond


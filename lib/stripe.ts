import Stripe from "stripe"

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
      typescript: true,
    })
  : (null as unknown as Stripe)

export const PLATFORM_FEE_BPS = parseInt(process.env.PLATFORM_FEE_BPS || "1500")

export function calculateFees(amountCents: number) {
  const platformFeeCents = Math.round((amountCents * PLATFORM_FEE_BPS) / 10000)
  const creatorPayoutCents = amountCents - platformFeeCents
  return {
    platformFeeCents,
    creatorPayoutCents,
  }
}


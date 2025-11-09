import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"
import { calculateFees } from "@/lib/stripe"
import Stripe from "stripe"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "No signature" },
      { status: 400 }
    )
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret missing" }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    )
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    if (session.mode === "payment" && session.payment_status === "paid") {
      const userId = session.metadata?.userId
      const courseId = session.metadata?.courseId

      if (!userId || !courseId) {
        return NextResponse.json({ error: "Missing metadata" }, { status: 400 })
      }

      const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: { creator: true },
      })

      if (!course) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 })
      }

      const amountCents = session.amount_total || 0
      const { platformFeeCents, creatorPayoutCents } = calculateFees(amountCents)

      // Create order
      const order = await prisma.order.create({
        data: {
          userId,
          courseId,
          stripeSessionId: session.id,
          stripePaymentId: session.payment_intent as string,
          amountCents,
          platformFeeCents,
          creatorPayoutCents,
          status: "COMPLETED",
        },
      })

      // Create enrollment
      await prisma.enrollment.create({
        data: {
          userId,
          courseId,
          orderId: order.id,
        },
      })
    }
  }

  return NextResponse.json({ received: true })
}

export const runtime = "edge"


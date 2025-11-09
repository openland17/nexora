import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "STRIPE_SECRET_KEY is required" },
        { status: 500 }
      )
    }

    const authHeader = req.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const orders = await prisma.order.findMany({
      where: { status: "COMPLETED", createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      include: { course: { include: { creator: true } } },
    })
    const payouts = new Map<string, number>()
    for (const order of orders) {
      const id = order.course.creatorId
      payouts.set(id, (payouts.get(id) || 0) + order.creatorPayoutCents)
    }
    for (const [creatorId, amountCents] of payouts.entries()) {
      const creator = orders.find((o) => o.course.creatorId === creatorId)?.course.creator
      if (!creator?.stripeAccountId || amountCents < 100) continue
      try {
        const payout = await stripe.transfers.create({ amount: amountCents, currency: "usd", destination: creator.stripeAccountId })
        await prisma.payout.create({ data: { creatorId, amountCents, stripePayoutId: payout.id, status: "processing" } })
      } catch (error) {
        console.error(`Payout failed for creator ${creatorId}:`, error)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Payout run error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


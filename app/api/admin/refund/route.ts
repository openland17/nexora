import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
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

    await requireAdmin()
    const { orderId } = await req.json()

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { enrollments: true },
    })

    if (!order || order.status === "REFUNDED") {
      return NextResponse.json({ error: "Invalid order" }, { status: 400 })
    }
    if (order.stripePaymentId) {
      await stripe.refunds.create({ payment_intent: order.stripePaymentId, amount: order.amountCents })
    }
    await prisma.order.update({ where: { id: orderId }, data: { status: "REFUNDED" } })
    await prisma.enrollment.deleteMany({ where: { orderId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Refund error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { stripe, calculateFees } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "STRIPE_SECRET_KEY is required" },
        { status: 500 }
      )
    }

    const user = await requireAuth()
    const { courseId } = await req.json()

    if (!courseId) {
      return NextResponse.json({ error: "Course ID required" }, { status: 400 })
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { creator: true },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    if (course.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Course not available" }, { status: 400 })
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    })

    if (existingEnrollment) {
      return NextResponse.json({ error: "Already enrolled" }, { status: 400 })
    }
    if (!course.creator.stripeAccountId) {
      return NextResponse.json({ error: "Creator not set up" }, { status: 400 })
    }

    const { platformFeeCents, creatorPayoutCents } = calculateFees(
      course.priceCents
    )

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
              description: course.description.substring(0, 500),
            },
            unit_amount: course.priceCents,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: platformFeeCents,
        transfer_data: {
          destination: course.creator.stripeAccountId,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/learn/${course.id}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        courseId: course.id,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


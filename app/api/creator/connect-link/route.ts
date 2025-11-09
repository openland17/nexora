import { NextRequest, NextResponse } from "next/server"
import { requireCreator } from "@/lib/auth"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  try {
    const user = await requireCreator()

    if (user.stripeAccountId) {
      const accountLink = await stripe.accountLinks.create({
        account: user.stripeAccountId,
        refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/creator/dashboard?refresh=true`,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/creator/dashboard?success=true`,
        type: "account_onboarding",
      })
      return NextResponse.json({ url: accountLink.url })
    }
    const account = await stripe.accounts.create({
      type: "express",
      country: "US",
      email: user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    })

    // Update user with account ID
    const { prisma } = await import("@/lib/db")
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeAccountId: account.id },
    })

    // Create account link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/creator/dashboard?refresh=true`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/creator/dashboard?success=true`,
      type: "account_onboarding",
    })

    return NextResponse.json({ url: accountLink.url })
  } catch (error) {
    console.error("Connect link error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


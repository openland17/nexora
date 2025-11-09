import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth()
    if (user.role !== "LEARNER") {
      return NextResponse.json({ error: "Already a creator or admin" }, { status: 400 })
    }

    const { bio, reason, socialLinks } = await req.json()

    if (!bio || !reason) {
      return NextResponse.json({ error: "Bio and reason required" }, { status: 400 })
    }
    const existing = await prisma.creatorApplication.findUnique({ where: { userId: user.id } })
    if (existing) {
      return NextResponse.json({ error: "Application already submitted" }, { status: 400 })
    }

    await prisma.creatorApplication.create({
      data: {
        userId: user.id,
        bio,
        reason,
        socialLinks: socialLinks ? JSON.stringify(socialLinks) : null,
        status: "PENDING",
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Application error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


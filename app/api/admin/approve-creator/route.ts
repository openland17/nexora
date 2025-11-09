import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin()
    const { userId, approved } = await req.json()
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }
    const status = approved ? "APPROVED" : "REJECTED"
    await prisma.user.update({
      where: { id: userId },
      data: { role: approved ? "CREATOR" : "LEARNER", creatorStatus: status },
    })

    await prisma.creatorApplication.update({
      where: { userId },
      data: {
        status,
        reviewedAt: new Date(),
        reviewedBy: admin.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Approval error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


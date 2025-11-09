import { NextRequest, NextResponse } from "next/server"
import { requireCreator } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireCreator()
    const { id } = await params
    const course = await prisma.course.findUnique({ where: { id } })
    if (!course || course.creatorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    if (course.status !== "DRAFT") {
      return NextResponse.json({ error: "Course must be in draft" }, { status: 400 })
    }
    const updated = await prisma.course.update({ where: { id }, data: { status: "SUBMITTED" } })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Course submit error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


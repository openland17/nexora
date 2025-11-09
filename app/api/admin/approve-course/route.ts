import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const { courseId, approved } = await req.json()
    if (!courseId) {
      return NextResponse.json({ error: "Course ID required" }, { status: 400 })
    }
    const status = approved ? "PUBLISHED" : "REJECTED"

    const course = await prisma.course.update({
      where: { id: courseId },
      data: {
        status,
        publishedAt: approved ? new Date() : null,
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error("Course approval error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


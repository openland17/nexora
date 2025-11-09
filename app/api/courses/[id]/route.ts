import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true,
          },
        },
        modules: {
          include: {
            lessons: {
              orderBy: { order: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
      },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error("Course fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { requireCreator } = await import("@/lib/auth")
    const user = await requireCreator()
    const { id } = await params
    const course = await prisma.course.findUnique({
      where: { id },
    })
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }
    if (course.creatorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    const data = await req.json()
    const updated = await prisma.course.update({
      where: { id },
      data,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Course update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


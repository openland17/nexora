import { NextRequest, NextResponse } from "next/server"
import { requireCreator } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireCreator()

    const course = await prisma.course.findUnique({
      where: { id: params.id },
    })

    if (!course || course.creatorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { title, description, order } = await req.json()

    if (!title) {
      return NextResponse.json({ error: "Title required" }, { status: 400 })
    }

    const module = await prisma.module.create({
      data: {
        courseId: params.id,
        title,
        description: description || null,
        order: order || 0,
      },
    })

    return NextResponse.json(module)
  } catch (error) {
    console.error("Module creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireCreator()

    const { id, title, description, order } = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: "Module ID required" },
        { status: 400 }
      )
    }

    const module = await prisma.module.findUnique({
      where: { id },
      include: { course: true },
    })

    if (!module || module.course.creatorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const updated = await prisma.module.update({ where: { id }, data: { title, description, order } })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Module update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

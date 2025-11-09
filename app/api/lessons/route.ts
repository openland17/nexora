import { NextRequest, NextResponse } from "next/server"
import { requireCreator } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { mux } from "@/lib/mux"

export async function POST(req: NextRequest) {
  try {
    const user = await requireCreator()

    const { moduleId, title, description, order, freePreview } = await req.json()

    if (!moduleId || !title) {
      return NextResponse.json({ error: "Module ID and title required" }, { status: 400 })
    }
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { course: true },
    })

    if (!module || module.course.creatorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const upload = await mux.video.uploads.create({
      cors_origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      new_asset_settings: { playback_policy: ["public"] as const },
    })
    const lesson = await prisma.lesson.create({
      data: {
        moduleId,
        title,
        description: description || null,
        order: order || 0,
        muxAssetId: upload.id,
        freePreview: freePreview || false,
      },
    })
    return NextResponse.json({ lesson, uploadUrl: upload.url, uploadId: upload.id })
  } catch (error) {
    console.error("Lesson creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireCreator()

    const { id, ...data } = await req.json()

    if (!id) {
      return NextResponse.json({ error: "Lesson ID required" }, { status: 400 })
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        module: {
          include: { course: true },
        },
      },
    })

    if (!lesson || lesson.module.course.creatorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(await prisma.lesson.update({ where: { id }, data }))
  } catch (error) {
    console.error("Lesson update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (body.type === "video.asset.ready") {
      const assetId = body.data.id
      const playbackId = body.data.playback_ids?.[0]?.id
      const duration = body.data.duration

      const lesson = await prisma.lesson.findFirst({ where: { muxAssetId: assetId } })
      if (lesson && playbackId) {
        await prisma.lesson.update({
          where: { id: lesson.id },
          data: { muxAssetId: assetId, muxPlaybackId: playbackId, duration: duration ? Math.round(duration) : null },
        })
      }
    }
    if (body.type === "video.upload.asset_created") {
      const lesson = await prisma.lesson.findFirst({ where: { muxAssetId: body.data.id } })
      if (lesson) {
        await prisma.lesson.update({ where: { id: lesson.id }, data: { muxAssetId: body.data.asset_id } })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Mux webhook error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export const runtime = "edge"


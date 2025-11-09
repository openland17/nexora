"use client"

import MuxPlayer from "@mux/mux-player-react"

export function VideoPlayer({
  playbackId,
  lessonId,
}: {
  playbackId: string | null
  lessonId: string
}) {
  if (!playbackId) {
    return (
      <div className="aspect-video bg-card border border-border rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Video not available</p>
      </div>
    )
  }

  return (
    <div className="aspect-video">
      <MuxPlayer
        playbackId={playbackId}
        metadata={{
          video_id: lessonId,
          video_title: "Lesson",
        }}
        streamType="on-demand"
      />
    </div>
  )
}


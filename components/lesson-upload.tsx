"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function LessonUpload({ lesson }: { lesson: any }) {
  const [uploading, setUploading] = useState(false)
  const [uploadUrl, setUploadUrl] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !uploadUrl) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      })

      if (res.ok) {
        alert("Video uploaded! Processing will begin shortly.")
      } else {
        alert("Upload failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Upload failed")
    } finally {
      setUploading(false)
    }
  }

  if (lesson.muxPlaybackId) {
    return (
      <div className="text-sm text-green-400">✓ Video uploaded and ready</div>
    )
  }

  if (!uploadUrl) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={async () => {
          // Get upload URL from lesson creation
          // This should be stored when lesson is created
          const res = await fetch(`/api/lessons/${lesson.id}/upload-url`)
          if (res.ok) {
            const { url } = await res.json()
            setUploadUrl(url)
          }
        }}
      >
        Get Upload URL
      </Button>
    )
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="video/*"
        onChange={handleUpload}
        disabled={uploading}
        className="text-sm"
      />
      {uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
    </div>
  )
}


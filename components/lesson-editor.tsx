"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function LessonEditor({
  lesson,
  onUpdate,
}: {
  lesson: any
  onUpdate: (lesson: any) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(lesson.title)
  const [description, setDescription] = useState(lesson.description || "")
  const [freePreview, setFreePreview] = useState(lesson.freePreview)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/lessons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: lesson.id,
          title,
          description,
          freePreview,
        }),
      })

      if (res.ok) {
        const updated = await res.json()
        onUpdate(updated)
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Lesson update error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border border-border rounded p-3">
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-card border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 bg-card border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={freePreview}
              onChange={(e) => setFreePreview(e.target.checked)}
            />
            Free Preview
          </label>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={loading} size="sm">
              Save
            </Button>
            <Button
              onClick={() => {
                setIsEditing(false)
                setTitle(lesson.title)
                setDescription(lesson.description || "")
                setFreePreview(lesson.freePreview)
              }}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
          </div>
          {lesson.muxAssetId && !lesson.muxPlaybackId && (
            <p className="text-xs text-muted-foreground">
              Video upload pending. Use Mux upload URL to upload video.
            </p>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <span className="text-sm">
              {lesson.order}. {lesson.title}
            </span>
            {lesson.freePreview && (
              <span className="ml-2 text-xs text-primary">(Free Preview)</span>
            )}
            {lesson.muxPlaybackId && (
              <span className="ml-2 text-xs text-green-400">✓ Video Ready</span>
            )}
          </div>
          <Button
            onClick={() => setIsEditing(true)}
            size="sm"
            variant="ghost"
          >
            Edit
          </Button>
        </div>
      )}
    </div>
  )
}


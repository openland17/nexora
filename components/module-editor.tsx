"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LessonEditor } from "@/components/lesson-editor"

export function ModuleEditor({
  module,
  courseId,
  onUpdate,
}: {
  module: any
  courseId: string
  onUpdate: (module: any) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(module.title)
  const [description, setDescription] = useState(module.description || "")
  const [lessons, setLessons] = useState(module.lessons)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/courses/${courseId}/modules`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: module.id,
          title,
          description,
          order: module.order,
        }),
      })

      if (res.ok) {
        const updated = await res.json()
        onUpdate(updated)
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Module update error:", error)
    } finally {
      setLoading(false)
    }
  }

  const addLesson = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId: module.id,
          title: "New Lesson",
          order: lessons.length,
        }),
      })

      if (res.ok) {
        const { lesson } = await res.json()
        setLessons([...lessons, lesson])
      }
    } catch (error) {
      console.error("Lesson creation error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border border-border rounded-lg p-6">
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={loading} size="sm">
              Save
            </Button>
            <Button
              onClick={() => {
                setIsEditing(false)
                setTitle(module.title)
                setDescription(module.description || "")
              }}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold">{module.title}</h3>
              {module.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {module.description}
                </p>
              )}
            </div>
            <Button onClick={() => setIsEditing(true)} size="sm" variant="outline">
              Edit
            </Button>
          </div>

          <div className="space-y-2 mb-4">
            {lessons.map((lesson: any) => (
              <LessonEditor
                key={lesson.id}
                lesson={lesson}
                onUpdate={(updated) => {
                  setLessons(
                    lessons.map((l: any) => (l.id === updated.id ? updated : l))
                  )
                }}
              />
            ))}
          </div>

          <Button onClick={addLesson} disabled={loading} size="sm" variant="outline">
            Add Lesson
          </Button>
        </div>
      )}
    </div>
  )
}


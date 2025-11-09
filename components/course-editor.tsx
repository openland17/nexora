"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ModuleEditor } from "@/components/module-editor"

export function CourseEditor({ course }: { course: any }) {
  const [modules, setModules] = useState(course.modules)
  const [loading, setLoading] = useState(false)

  const addModule = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/courses/${course.id}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "New Module",
          order: modules.length,
        }),
      })

      if (res.ok) {
        const newModule = await res.json()
        setModules([...modules, newModule])
      }
    } catch (error) {
      console.error("Module creation error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Course Modules</h2>
        <Button onClick={addModule} disabled={loading}>
          Add Module
        </Button>
      </div>

      <div className="space-y-4">
        {modules.map((module: any) => (
          <ModuleEditor
            key={module.id}
            module={module}
            courseId={course.id}
            onUpdate={(updated) => {
              setModules(
                modules.map((m: any) => (m.id === updated.id ? updated : m))
              )
            }}
          />
        ))}
      </div>

      {modules.length === 0 && (
        <div className="text-center py-12 border border-border rounded-lg">
          <p className="text-muted-foreground mb-4">
            No modules yet. Add your first module to get started.
          </p>
          <Button onClick={addModule} disabled={loading}>
            Add Module
          </Button>
        </div>
      )}
    </div>
  )
}


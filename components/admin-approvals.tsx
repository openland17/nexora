"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function AdminApprovals({
  applications,
  courses,
}: {
  applications: any[]
  courses: any[]
}) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleApproveCreator = async (userId: string, approved: boolean) => {
    setLoading(`creator-${userId}`)
    try {
      const res = await fetch("/api/admin/approve-creator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, approved }),
      })

      if (res.ok) {
        window.location.reload()
      } else {
        alert("Failed to update application")
      }
    } catch (error) {
      console.error("Approval error:", error)
      alert("Failed to update application")
    } finally {
      setLoading(null)
    }
  }

  const handleApproveCourse = async (courseId: string, approved: boolean) => {
    setLoading(`course-${courseId}`)
    try {
      const res = await fetch("/api/admin/approve-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, approved }),
      })

      if (res.ok) {
        window.location.reload()
      } else {
        alert("Failed to update course")
      }
    } catch (error) {
      console.error("Course approval error:", error)
      alert("Failed to update course")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">
          Creator Applications ({applications.length})
        </h2>
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="border border-border rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {app.user.name || app.user.email}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {app.user.email}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleApproveCreator(app.userId, false)}
                    disabled={loading === `creator-${app.userId}`}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApproveCreator(app.userId, true)}
                    disabled={loading === `creator-${app.userId}`}
                  >
                    Approve
                  </Button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Bio:</span>
                  <p className="text-muted-foreground">{app.bio}</p>
                </div>
                <div>
                  <span className="font-medium">Reason:</span>
                  <p className="text-muted-foreground">{app.reason}</p>
                </div>
              </div>
            </div>
          ))}
          {applications.length === 0 && (
            <p className="text-muted-foreground">No pending applications</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">
          Course Submissions ({courses.length})
        </h2>
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    by {course.creator.name || course.creator.email}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleApproveCourse(course.id, false)}
                    disabled={loading === `course-${course.id}`}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApproveCourse(course.id, true)}
                    disabled={loading === `course-${course.id}`}
                  >
                    Approve
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {course.description}
              </p>
            </div>
          ))}
          {courses.length === 0 && (
            <p className="text-muted-foreground">No pending courses</p>
          )}
        </div>
      </div>
    </div>
  )
}


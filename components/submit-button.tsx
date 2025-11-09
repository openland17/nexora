"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function SubmitButton({ courseId }: { courseId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/courses/${courseId}/submit`, {
        method: "POST",
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert("Failed to submit course")
      }
    } catch (error) {
      console.error("Submit error:", error)
      alert("Failed to submit course")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleSubmit} disabled={loading}>
      Submit for Review
    </Button>
  )
}


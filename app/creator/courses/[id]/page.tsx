import { redirect } from "next/navigation"
import { requireCreator } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CourseEditor } from "@/components/course-editor"
import { SubmitButton } from "@/components/submit-button"

async function getCourse(courseId: string, userId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  })

  if (!course || course.creatorId !== userId) {
    return null
  }

  return course
}

export default async function CourseEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await requireCreator()
  const { id } = await params
  const course = await getCourse(id, user.id)

  if (!course) {
    redirect("/creator/dashboard")
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Nexora
          </Link>
          <Link href="/creator/dashboard">
            <Button variant="ghost">Back to Dashboard</Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <div className="flex gap-2">
            {course.status === "DRAFT" && (
              <SubmitButton courseId={course.id} />
            )}
            <span
              className={`px-3 py-1 rounded text-sm ${
                course.status === "PUBLISHED"
                  ? "bg-green-500/20 text-green-400"
                  : course.status === "DRAFT"
                  ? "bg-gray-500/20 text-gray-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {course.status}
            </span>
          </div>
        </div>

        <CourseEditor course={course} />
      </div>
    </div>
  )
}


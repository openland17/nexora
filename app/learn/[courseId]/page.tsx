import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { VideoPlayer } from "@/components/video-player"

async function getCourse(courseId: string) {
  return prisma.course.findUnique({
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
}

export default async function LearnPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/sign-in")
  }
  const { courseId } = await params
  const course = await getCourse(courseId)
  if (!course) {
    redirect("/courses")
  }

  // Check enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id,
      },
    },
  })

  // Allow access to free preview lessons even without enrollment
  const allLessons = course.modules.flatMap((m) => m.lessons)
  const hasFreePreview = allLessons.some((l) => l.freePreview)

  if (!enrollment && !hasFreePreview) {
    redirect(`/courses/${course.slug}`)
  }

  const firstLesson = allLessons.find((l) => l.muxPlaybackId) || allLessons[0]

  return (
    <div className="min-h-screen flex">
      <div className="flex-1">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          {firstLesson && (
            <VideoPlayer
              playbackId={firstLesson.muxPlaybackId}
              lessonId={firstLesson.id}
            />
          )}
        </div>
      </div>

      <div className="w-80 border-l border-border overflow-y-auto">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Course Content</h2>
          <div className="space-y-4">
            {course.modules.map((module) => (
              <div key={module.id}>
                <h3 className="font-semibold mb-2">{module.title}</h3>
                <div className="space-y-1">
                  {module.lessons.map((lesson) => {
                    const canAccess =
                      enrollment || lesson.freePreview || false

                    return (
                      <div
                        key={lesson.id}
                        className={`p-2 rounded ${
                          canAccess
                            ? "hover:bg-accent cursor-pointer"
                            : "opacity-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm">
                            {lesson.order}. {lesson.title}
                          </span>
                          {lesson.freePreview && (
                            <span className="text-xs text-primary">
                              Free
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


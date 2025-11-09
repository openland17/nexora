import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { CheckoutButton } from "@/components/checkout-button"

async function getCourse(slug: string) {
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      modules: {
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: {
        select: {
          enrollments: true,
          reviews: true,
        },
      },
    },
  })

  return course
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const course = await getCourse(slug)

  if (!course || course.status !== "PUBLISHED") {
    notFound()
  }

  const user = await getCurrentUser()
  let isEnrolled = false

  if (user) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    })
    isEnrolled = !!enrollment
  }

  const freeLessons = course.modules.flatMap((m) =>
    m.lessons.filter((l) => l.freePreview)
  )

  return (
    <div className="min-h-screen">
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Nexora
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/courses">
              <Button variant="ghost">Browse</Button>
            </Link>
            {user ? (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            ) : (
              <Link href="/sign-in">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-muted-foreground mb-6">{course.description}</p>

            {course.thumbnailUrl && (
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-full rounded-lg mb-8"
              />
            )}

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
              <div className="space-y-4">
                {course.modules.map((module) => (
                  <div key={module.id} className="border border-border rounded-lg p-4">
                    <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                    {module.description && (
                      <p className="text-muted-foreground text-sm mb-3">
                        {module.description}
                      </p>
                    )}
                    <div className="space-y-2">
                      {module.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-2 hover:bg-accent rounded"
                        >
                          <span className="text-sm">
                            {lesson.order}. {lesson.title}
                            {lesson.freePreview && (
                              <span className="ml-2 text-xs text-primary">
                                (Free Preview)
                              </span>
                            )}
                          </span>
                          {lesson.duration && (
                            <span className="text-xs text-muted-foreground">
                              {Math.floor(lesson.duration / 60)}m
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
              <div className="space-y-4">
                {course.reviews.map((review) => (
                  <div key={review.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {review.user.image && (
                        <img
                          src={review.user.image}
                          alt={review.user.name || "User"}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <span className="font-semibold">
                        {review.user.name || "Anonymous"}
                      </span>
                      <span className="text-yellow-400">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-muted-foreground">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
              {course.reviews.length === 0 && (
                <p className="text-muted-foreground">No reviews yet</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-4 border border-border rounded-lg p-6 bg-card">
              <div className="text-3xl font-bold mb-4">
                {formatPrice(course.priceCents)}
              </div>

              {isEnrolled ? (
                <Link href={`/learn/${course.id}`}>
                  <Button className="w-full" size="lg">
                    Continue Learning
                  </Button>
                </Link>
              ) : (
                <CheckoutButton courseId={course.id} />
              )}

              <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Students</span>
                  <span>{course._count.enrollments}</span>
                </div>
                <div className="flex justify-between">
                  <span>Reviews</span>
                  <span>{course._count.reviews}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lessons</span>
                  <span>
                    {course.modules.reduce(
                      (acc, m) => acc + m.lessons.length,
                      0
                    )}
                  </span>
                </div>
              </div>

              {course.creator && (
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Instructor</p>
                  <div className="flex items-center gap-2">
                    {course.creator.image && (
                      <img
                        src={course.creator.image}
                        alt={course.creator.name || "Creator"}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <span className="font-semibold">
                      {course.creator.name || "Creator"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


import { redirect } from "next/navigation"
import { getCurrentUser, requireCreator } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { ConnectSetup } from "@/components/connect-setup"

async function getCreatorData(userId: string) {
  const [courses, application] = await Promise.all([
    prisma.course.findMany({
      where: { creatorId: userId },
      include: {
        _count: {
          select: {
            enrollments: true,
            orders: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.creatorApplication.findUnique({
      where: { userId },
    }),
  ])

  return { courses, application }
}

export default async function CreatorDashboardPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/sign-in")
  }

  let creatorData = null
  let isCreator = false

  try {
    await requireCreator()
    isCreator = true
    creatorData = await getCreatorData(user.id)
  } catch {
    // Not a creator yet
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Nexora
          </Link>
          <Link href="/courses">
            <Button variant="ghost">Browse Courses</Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Creator Dashboard</h1>

        {!isCreator && (
          <div className="border border-border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Get Started</h2>
            {creatorData?.application ? (
              <div>
                <p className="text-muted-foreground mb-4">
                  Your application is{" "}
                  {creatorData.application.status === "PENDING"
                    ? "pending review"
                    : creatorData.application.status.toLowerCase()}
                  .
                </p>
                {creatorData.application.status === "PENDING" && (
                  <p className="text-sm text-muted-foreground">
                    We'll notify you once your application is reviewed.
                  </p>
                )}
              </div>
            ) : (
              <Link href="/creator/apply">
                <Button>Apply to Become a Creator</Button>
              </Link>
            )}
          </div>
        )}

        {isCreator && creatorData && (
          <>
            <ConnectSetup user={user} />

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Your Courses</h2>
                <Link href="/creator/courses/new">
                  <Button>Create New Course</Button>
                </Link>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {creatorData.courses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/creator/courses/${course.id}`}
                    className="block"
                  >
                    <div className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors">
                      <h3 className="text-xl font-semibold mb-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-primary font-semibold">
                          {formatPrice(course.priceCents)}
                        </span>
                        <span className="text-muted-foreground">
                          {course._count.enrollments} students
                        </span>
                      </div>
                      <div className="mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
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
                  </Link>
                ))}
              </div>

              {creatorData.courses.length === 0 && (
                <div className="text-center py-12 border border-border rounded-lg">
                  <p className="text-muted-foreground mb-4">
                    You haven't created any courses yet
                  </p>
                  <Link href="/creator/courses/new">
                    <Button>Create Your First Course</Button>
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}


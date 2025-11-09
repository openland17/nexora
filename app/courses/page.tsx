import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { Search } from "lucide-react"
import { prisma } from "@/lib/db"

async function getCourses(search?: string, category?: string) {
  const where: any = { status: "PUBLISHED" }
  if (category) where.category = category
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ]
  }
  return prisma.course.findMany({
    where,
    include: {
      creator: { select: { id: true, name: true, image: true } },
      _count: { select: { enrollments: true, reviews: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  })
}

export const dynamic = 'force-dynamic'

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: { search?: string; category?: string }
}) {
  const courses = await getCourses(searchParams.search, searchParams.category)

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
            <Link href="/sign-in">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">All Courses</h1>

        <div className="mb-6">
          <form action="/courses" method="get" className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                name="search"
                placeholder="Search courses..."
                defaultValue={searchParams.search}
                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses && courses.length > 0 ? courses.map((course: any) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="block"
            >
              <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-colors">
                {course.thumbnailUrl && (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      {formatPrice(course.priceCents)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {course._count.enrollments} students
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )) : null}
        </div>

        {(!courses || courses.length === 0) && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No courses found</p>
          </div>
        )}
      </div>
    </div>
  )
}


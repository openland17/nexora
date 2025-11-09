import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AdminApprovals } from "@/components/admin-approvals"

async function getAdminData() {
  const [applications, courses] = await Promise.all([
    prisma.creatorApplication.findMany({
      where: { status: "PENDING" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.course.findMany({
      where: { status: "SUBMITTED" },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ])

  return { applications, courses }
}

export default async function AdminPage() {
  try {
    await requireAdmin()
  } catch {
    redirect("/")
  }

  const data = await getAdminData()

  return (
    <div className="min-h-screen">
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Nexora Admin
          </Link>
          <Link href="/">
            <Button variant="ghost">Back to Site</Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <AdminApprovals
          applications={data.applications}
          courses={data.courses}
        />
      </div>
    </div>
  )
}


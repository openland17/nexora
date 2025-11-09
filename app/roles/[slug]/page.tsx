import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Generate 20 role pages
const roles = [
  "ai-engineer",
  "machine-learning-engineer",
  "data-scientist",
  "nlp-engineer",
  "computer-vision-engineer",
  "ai-researcher",
  "ml-ops-engineer",
  "ai-product-manager",
  "deep-learning-engineer",
  "ai-consultant",
  "robotics-engineer",
  "ai-architect",
  "data-engineer",
  "ai-ethicist",
  "prompt-engineer",
  "ai-trainer",
  "ml-engineer",
  "ai-developer",
  "automation-engineer",
  "ai-analyst",
]

export async function generateStaticParams() {
  return roles.map((slug) => ({ slug }))
}

export default async function RolePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!roles.includes(slug)) {
    notFound()
  }
  const roleName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

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

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">
          Learn {roleName} Skills
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Discover courses designed to help you become a {roleName}. Learn from
          industry experts and build real-world projects.
        </p>
        <Link href="/courses">
          <Button size="lg">Explore Courses</Button>
        </Link>
      </div>
    </div>
  )
}


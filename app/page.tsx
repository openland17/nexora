import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, TrendingUp, Users, Award } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Nexora
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/courses">
              <Button variant="ghost">Browse Courses</Button>
            </Link>
            <Link href="/creator/apply">
              <Button variant="outline">Become a Creator</Button>
            </Link>
            <Link href="/sign-in">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Master AI with Expert-Led Courses
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Learn from industry leaders and build real-world AI skills. 
          Join thousands of learners advancing their careers.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/courses">
            <Button size="lg">Explore Courses</Button>
          </Link>
          <Link href="/creator/apply">
            <Button size="lg" variant="outline">Teach on Nexora</Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Expert Instructors</h3>
            <p className="text-muted-foreground">
              Learn from creators who work at top tech companies
            </p>
          </div>
          <div className="text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Active Community</h3>
            <p className="text-muted-foreground">
              Join discussions and get support from peers
            </p>
          </div>
          <div className="text-center">
            <Award className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Practical Skills</h3>
            <p className="text-muted-foreground">
              Build real projects you can add to your portfolio
            </p>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </section>
    </div>
  )
}


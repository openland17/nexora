import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const status = searchParams.get("status") || "PUBLISHED"

    const where: any = {
      status: status as any,
    }

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error("Courses fetch error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { requireCreator } = await import("@/lib/auth")
    const user = await requireCreator()

    const { title, description, priceCents, category, tags, thumbnailUrl } =
      await req.json()

    if (!title || !description || !priceCents) {
      return NextResponse.json(
        { error: "Title, description, and price required" },
        { status: 400 }
      )
    }

    const { slugify } = await import("@/lib/utils")
    const baseSlug = slugify(title)
    let slug = baseSlug
    let counter = 1

    // Ensure unique slug
    while (await prisma.course.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        priceCents: parseInt(priceCents),
        category: category || null,
        tags: tags ? JSON.stringify(tags) : "[]",
        thumbnailUrl: thumbnailUrl || null,
        slug,
        creatorId: user.id,
        status: "DRAFT",
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error("Course creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


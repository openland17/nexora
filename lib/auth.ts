import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/db"

export async function getCurrentUser() {
  const { userId } = await auth()
  if (!userId) return null
  const user = await currentUser()
  if (!user) return null
  return prisma.user.findUnique({ where: { clerkId: userId } })
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")
  return user
}

export async function requireRole(role: string) {
  const user = await requireAuth()
  if (user.role !== role) throw new Error("Forbidden")
  return user
}

export async function requireCreator() {
  const user = await requireAuth()
  if (user.role !== "CREATOR" || user.creatorStatus !== "APPROVED") throw new Error("Forbidden")
  return user
}

export async function requireAdmin() {
  return requireRole("ADMIN")
}


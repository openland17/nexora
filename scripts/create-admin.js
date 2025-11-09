/**
 * Script to create an admin user in the database
 * 
 * Usage:
 *   node scripts/create-admin.js <email>
 * 
 * Example:
 *   node scripts/create-admin.js admin@example.com
 * 
 * Make sure DATABASE_URL is set in your environment or .env file
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function createAdmin(email) {
  if (!email) {
    console.error('Error: Email is required')
    console.log('Usage: node scripts/create-admin.js <email>')
    process.exit(1)
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.error(`Error: User with email ${email} not found`)
      console.log('Please sign up through Clerk first, then run this script.')
      process.exit(1)
    }

    if (user.role === 'ADMIN') {
      console.log(`User ${email} is already an admin.`)
      process.exit(0)
    }

    await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    })

    console.log(`✅ Successfully set ${email} as admin!`)
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

const email = process.argv[2]
createAdmin(email)


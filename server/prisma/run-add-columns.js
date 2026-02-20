/**
 * Adds missing columns (pitchDeckUrl, message) to the database.
 * Run from server folder: node prisma/run-add-columns.js
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "Startup" ADD COLUMN IF NOT EXISTS "pitchDeckUrl" TEXT;
  `)
  console.log('Added Startup.pitchDeckUrl (if missing)')
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "ConnectionRequest" ADD COLUMN IF NOT EXISTS "message" TEXT;
  `)
  console.log('Added ConnectionRequest.message (if missing)')
}

main()
  .then(() => {
    console.log('Done.')
    process.exit(0)
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

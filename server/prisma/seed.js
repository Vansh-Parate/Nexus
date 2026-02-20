import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashed = await bcrypt.hash('password123', 10)

  const s1 = await prisma.user.upsert({
    where: { email: 'founder@startup.io' },
    update: {},
    create: {
      email: 'founder@startup.io',
      password: hashed,
      role: 'startup',
      name: 'Priya Founder',
    },
  })
  await prisma.startup.upsert({
    where: { userId: s1.id },
    update: {},
    create: {
      userId: s1.id,
      startupName: 'EduFlow',
      founderName: 'Priya Founder',
      sector: 'EdTech',
      stage: 'Early Revenue',
      fundingSought: 100,
      pitch: 'AI-powered learning paths for K-12.',
      location: 'Karnataka',
    },
  })

  const i1 = await prisma.user.upsert({
    where: { email: 'raj@angel.in' },
    update: {},
    create: {
      email: 'raj@angel.in',
      password: hashed,
      role: 'investor',
      name: 'Raj Angel',
    },
  })
  await prisma.investor.upsert({
    where: { userId: i1.id },
    update: {},
    create: {
      userId: i1.id,
      fullName: 'Raj Angel',
      firmName: 'Angel Fund',
      investorType: 'Angel',
      preferredSectors: ['EdTech', 'FinTech'],
      ticketMin: 25,
      ticketMax: 200,
      preferredStages: ['MVP', 'Early Revenue'],
    },
  })

  console.log('Seed done')
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })

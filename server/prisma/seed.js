import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const prisma = new PrismaClient()

const SERVER_DIR = path.join(path.dirname(path.dirname(fileURLToPath(import.meta.url))))

function parseCsv(filePath) {
  const fullPath = path.join(SERVER_DIR, filePath)
  const raw = fs.readFileSync(fullPath, 'utf8').trim()
  const lines = raw.split(/\r?\n/)
  if (lines.length < 2) return []
  const headers = lines[0].split(',')
  return lines.slice(1).map((line) => {
    const values = line.split(',')
    const row = {}
    headers.forEach((h, i) => { row[h.trim()] = values[i]?.trim() ?? '' })
    return row
  })
}

async function seedFromCsv() {
  const investors = parseCsv('investors.csv')
  const startups = parseCsv('startups.csv')
  const interactionsRaw = parseCsv('interactions.csv')

  const interactionOrder = { contacted: 3, shortlisted: 2, viewed: 1 }
  const best = new Map()
  for (const r of interactionsRaw) {
    const key = `${r.startup_id}-${r.investor_id}`
    const current = best.get(key)
    const score = interactionOrder[r.interaction_type] ?? 0
    if (!current || score > interactionOrder[current.interaction_type])
      best.set(key, { startup_id: r.startup_id, investor_id: r.investor_id, interaction_type: r.interaction_type })
  }
  const interactions = [...best.values()]

  const investorData = (r) => ({
    investorName: r.investor_name,
    preferredIndustry: r.preferred_industry,
    preferredStage: r.preferred_stage,
    geographyFocus: r.geography_focus,
    ticketMinLakhs: parseInt(r.ticket_min_lakhs, 10) || 0,
    ticketMaxLakhs: parseInt(r.ticket_max_lakhs, 10) || 0,
    thesis: r.thesis || null,
  })
  for (const r of investors) {
    if (!r.investor_id) continue
    await prisma.investorCatalog.upsert({
      where: { investorId: r.investor_id },
      update: investorData(r),
      create: { investorId: r.investor_id, ...investorData(r) },
    })
  }
  console.log('Seeded', investors.length, 'investors')

  const startupData = (r) => ({
    startupName: r.startup_name,
    industry: r.industry,
    stage: r.stage,
    location: r.location,
    fundingRequiredLakhs: parseInt(r.funding_required_lakhs, 10) || 0,
    description: r.description || null,
  })
  for (const r of startups) {
    if (!r.startup_id) continue
    await prisma.startupCatalog.upsert({
      where: { startupId: r.startup_id },
      update: startupData(r),
      create: { startupId: r.startup_id, ...startupData(r) },
    })
  }
  console.log('Seeded', startups.length, 'startups')

  const startupIdToDbId = new Map(
    (await prisma.startupCatalog.findMany({ select: { id: true, startupId: true } })).map((s) => [s.startupId, s.id])
  )
  const investorIdToDbId = new Map(
    (await prisma.investorCatalog.findMany({ select: { id: true, investorId: true } })).map((i) => [i.investorId, i.id])
  )

  for (const r of interactions) {
    if (!r.startup_id || !r.investor_id) continue
    const startupCatalogId = startupIdToDbId.get(r.startup_id)
    const investorCatalogId = investorIdToDbId.get(r.investor_id)
    if (!startupCatalogId || !investorCatalogId) continue
    await prisma.interaction.upsert({
      where: {
        startupCatalogId_investorCatalogId: { startupCatalogId, investorCatalogId },
      },
      update: { interactionType: r.interaction_type },
      create: {
        startupCatalogId,
        investorCatalogId,
        interactionType: r.interaction_type,
      },
    })
  }
  console.log('Seeded', interactions.length, 'interactions')
}

// Map catalog stage to app stage (Idea | MVP | Early Revenue | Scaling)
function appStage(catalogStage) {
  const s = (catalogStage || '').toLowerCase()
  if (s.includes('pre-seed') || s === 'idea') return 'MVP'
  if (s === 'seed') return 'Early Revenue'
  if (s.includes('series a')) return 'Early Revenue'
  if (s.includes('series b') || s === 'scaling') return 'Scaling'
  return 'Early Revenue'
}

async function seedDemoAppStartups() {
  const startups = parseCsv('startups.csv').filter((r) => r.startup_id)
  const hashed = await bcrypt.hash('password123', 10)
  const demoCount = Math.min(25, startups.length)
  const founderNames = [
    'Priya Sharma', 'Arun Patel', 'Meera Krishnan', 'Vikram Singh', 'Anita Reddy',
    'Rahul Nair', 'Kavita Desai', 'Suresh Iyer', 'Deepa Menon', 'Rajesh Kumar',
    'Lakshmi Rao', 'Aditya Verma', 'Pooja Gupta', 'Karan Mehta', 'Neha Joshi',
    'Sanjay Pillai', 'Divya Nair', 'Amit Shah', 'Riya Chopra', 'Nikhil Rao',
    'Shreya Bhat', 'Varun Kapoor', 'Anjali Menon', 'Rohan Desai', 'Kriti Singh',
  ]
  for (let i = 0; i < demoCount; i++) {
    const r = startups[i]
    const email = `demo-startup-${i + 1}@vega.demo`
    const name = founderNames[i] || `Demo Founder ${i + 1}`
    const user = await prisma.user.upsert({
      where: { email },
      update: { name },
      create: {
        email,
        password: hashed,
        role: 'startup',
        name,
      },
    })
    await prisma.startup.upsert({
      where: { userId: user.id },
      update: {
        startupName: r.startup_name,
        founderName: name,
        sector: r.industry,
        stage: appStage(r.stage),
        fundingSought: parseInt(r.funding_required_lakhs, 10) || 0,
        pitch: r.description || null,
        location: r.location || null,
        description: r.description || null,
      },
      create: {
        userId: user.id,
        startupName: r.startup_name,
        founderName: name,
        sector: r.industry,
        stage: appStage(r.stage),
        fundingSought: parseInt(r.funding_required_lakhs, 10) || 0,
        pitch: r.description || null,
        location: r.location || null,
        description: r.description || null,
      },
    })
  }
  console.log('Seeded', demoCount, 'demo app startups (login: demo-startup-N@vega.demo / password123)')
}

async function seedDemoAppInvestors() {
  const investors = parseCsv('investors.csv').filter((r) => r.investor_id)
  const hashed = await bcrypt.hash('password123', 10)
  const demoCount = Math.min(15, investors.length)
  for (let i = 0; i < demoCount; i++) {
    const r = investors[i]
    const email = `demo-investor-${i + 1}@vega.demo`
    const user = await prisma.user.upsert({
      where: { email },
      update: { name: r.investor_name },
      create: {
        email,
        password: hashed,
        role: 'investor',
        name: r.investor_name,
      },
    })
    const stage = (r.preferred_stage || '').trim()
    const appStageArr = stage.includes('Pre-Seed') ? ['MVP'] : stage.includes('Seed') ? ['Early Revenue'] : stage.includes('Series A') ? ['Early Revenue'] : ['Scaling']
    await prisma.investor.upsert({
      where: { userId: user.id },
      update: {
        fullName: r.investor_name,
        firmName: r.investor_name,
        investorType: 'VC',
        preferredSectors: [r.preferred_industry],
        ticketMin: parseInt(r.ticket_min_lakhs, 10) || 0,
        ticketMax: parseInt(r.ticket_max_lakhs, 10) || 500,
        preferredStages: appStageArr,
        thesis: r.thesis || null,
      },
      create: {
        userId: user.id,
        fullName: r.investor_name,
        firmName: r.investor_name,
        investorType: 'VC',
        preferredSectors: [r.preferred_industry],
        ticketMin: parseInt(r.ticket_min_lakhs, 10) || 0,
        ticketMax: parseInt(r.ticket_max_lakhs, 10) || 500,
        preferredStages: appStageArr,
        thesis: r.thesis || null,
      },
    })
  }
  console.log('Seeded', demoCount, 'demo app investors (login: demo-investor-N@vega.demo / password123)')
}

async function main() {
  await seedFromCsv()

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
      description: 'AI-powered learning paths for K-12.',
      location: 'Karnataka',
    },
  })

  await seedDemoAppStartups()

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

  await seedDemoAppInvestors()

  console.log('Seed done')
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })

-- Add columns required by current Prisma schema (run this if db push fails or you prefer manual migration).
-- Run in Neon SQL Editor or: psql $DATABASE_URL -f prisma/add-missing-columns.sql

-- Startup.pitchDeckUrl (optional, for PDF pitch deck link)
ALTER TABLE "Startup" ADD COLUMN IF NOT EXISTS "pitchDeckUrl" TEXT;

-- ConnectionRequest.message (optional, for personal note when sending pitch)
ALTER TABLE "ConnectionRequest" ADD COLUMN IF NOT EXISTS "message" TEXT;

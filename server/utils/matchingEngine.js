/**
 * Match score for startup ↔ investor (0–100)
 * Sector 40, Stage 30, Ticket size 30
 */
export function computeMatchScore(startup, investor) {
  let score = 0

  const sectorMatch = investor.preferredSectors && investor.preferredSectors.includes(startup.sector)
  if (sectorMatch) score += 40

  const stageMatch = investor.preferredStages && investor.preferredStages.includes(startup.stage)
  if (stageMatch) score += 30

  const sought = startup.fundingSought || 0
  const min = investor.ticketMin || 0
  const max = investor.ticketMax || 1000
  if (sought >= min && sought <= max) score += 30
  else if (sought >= min * 0.7 && sought <= max * 1.3) score += 15

  return score
}

/**
 * Rank investors for a startup (by match score desc)
 */
export function rankInvestorsForStartup(startup, investors) {
  return investors
    .map((inv) => ({
      ...inv,
      matchScore: computeMatchScore(startup, inv),
    }))
    .filter((inv) => inv.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
}

/**
 * Rank startups for an investor (by match score desc)
 */
export function rankStartupsForInvestor(investor, startups) {
  return startups
    .map((s) => ({
      ...s,
      matchScore: computeMatchScore(s, investor),
    }))
    .filter((s) => s.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
}

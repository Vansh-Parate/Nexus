/**
 * ML-powered matching engine with contributions model
 * Uses Python ML model for intelligent ranking and provides detailed explanations
 */
import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PYTHON = process.env.PYTHON || 'python'
const PREDICT_SCRIPT = path.join(__dirname, '..', 'scripts', 'predict_score.py')
const EXPLAIN_SCRIPT = path.join(__dirname, '..', 'scripts', 'explain_match.py')

// Simple in-memory caches to avoid repeated expensive Python calls
// Keyed by a stable representation of startup + investor
const SCORE_CACHE = new Map()
const EXPLAIN_CACHE = new Map()
const CACHE_TTL_MS = 60 * 60 * 1000 // 60 minutes

function makeCacheKey(startup, investor) {
  return JSON.stringify({
    sId: startup.id || startup.userId || null,
    iId: investor.id || investor.userId || null,
    sSector: startup.sector || '',
    sStage: startup.stage || '',
    sFunding: startup.fundingSought || 0,
    iSectors: investor.preferredSectors || [],
    iStages: investor.preferredStages || [],
    iMin: investor.ticketMin || 0,
    iMax: investor.ticketMax || 0,
  })
}

function getFromCache(map, key) {
  const entry = map.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    map.delete(key)
    return null
  }
  return entry.value
}

function setInCache(map, key, value) {
  map.set(key, { value, timestamp: Date.now() })
}

/**
 * Call Python ML model to get match score
 */
function callMLModel(startup, investor) {
  return new Promise((resolve, reject) => {
    const cacheKey = makeCacheKey(startup, investor)
    const cached = getFromCache(SCORE_CACHE, cacheKey)
    if (cached != null) {
      resolve(cached)
      return
    }

    const startupPayload = {
      industry: startup.sector || '',
      stage: startup.stage || '',
      funding_required: startup.fundingSought || 0,
      description: startup.description || startup.pitch || '',
    }
    
    const investorPayload = {
      preferred_industry: Array.isArray(investor.preferredSectors) 
        ? investor.preferredSectors[0] || ''
        : investor.preferredSectors || '',
      preferred_stage: Array.isArray(investor.preferredStages)
        ? investor.preferredStages[0] || ''
        : investor.preferredStages || '',
      ticket_min: investor.ticketMin || 0,
      ticket_max: investor.ticketMax || 1000,
      description: investor.thesis || investor.description || '',
    }

    const input = JSON.stringify({ startup: startupPayload, investor: investorPayload })
    const proc = spawn(PYTHON, [PREDICT_SCRIPT], {
      cwd: path.join(__dirname, '..'),
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''
    proc.stdout.on('data', (d) => { stdout += d.toString() })
    proc.stderr.on('data', (d) => { stderr += d.toString() })
    proc.stdin.write(input)
    proc.stdin.end()

    proc.on('close', (code) => {
      if (code !== 0) {
        try {
          const err = JSON.parse(stderr.trim())
          reject(new Error(err.error || 'Model prediction failed'))
        } catch (_) {
          // Check for Windows DLL errors in stderr
          const errorText = stderr || 'Model prediction failed'
          if (errorText.includes('DLL') || errorText.includes('paging file') || errorText.includes('ImportError')) {
            reject(new Error('ML_MODEL_UNAVAILABLE: Windows DLL loading issue. See ML_TROUBLESHOOTING.md'))
          } else {
            reject(new Error(errorText))
          }
        }
        return
      }
      try {
        const out = JSON.parse(stdout.trim())
        const score = out.score || 0
        setInCache(SCORE_CACHE, cacheKey, score)
        resolve(score)
      } catch (_) {
        reject(new Error('Invalid prediction output'))
      }
    })

    proc.on('error', (err) => {
      reject(new Error(`Python not available: ${err.message}`))
    })
  })
}

/**
 * Get detailed match explanation with contributions
 */
export function explainMatch(startup, investor) {
  return new Promise((resolve, reject) => {
    const cacheKey = makeCacheKey(startup, investor)
    const cached = getFromCache(EXPLAIN_CACHE, cacheKey)
    if (cached) {
      resolve(cached)
      return
    }

    const startupPayload = {
      industry: startup.sector || '',
      stage: startup.stage || '',
      funding_required: startup.fundingSought || 0,
      description: startup.description || startup.pitch || '',
    }
    
    const investorPayload = {
      preferred_industry: Array.isArray(investor.preferredSectors) 
        ? investor.preferredSectors[0] || ''
        : investor.preferredSectors || '',
      preferred_stage: Array.isArray(investor.preferredStages)
        ? investor.preferredStages[0] || ''
        : investor.preferredStages || '',
      ticket_min: investor.ticketMin || 0,
      ticket_max: investor.ticketMax || 1000,
      description: investor.thesis || investor.description || '',
    }

    const input = JSON.stringify({ startup: startupPayload, investor: investorPayload })
    const proc = spawn(PYTHON, [EXPLAIN_SCRIPT], {
      cwd: path.join(__dirname, '..'),
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''
    proc.stdout.on('data', (d) => { stdout += d.toString() })
    proc.stderr.on('data', (d) => { stderr += d.toString() })
    proc.stdin.write(input)
    proc.stdin.end()

    proc.on('close', (code) => {
      if (code !== 0) {
        // If ML explanation fails, fall back to rule-based explanation
        const errorText = stderr || ''
        console.warn('ML explain failed, using rule-based explanation instead:', errorText)
        const fallback = buildRuleBasedExplanation(startup, investor)
        setInCache(EXPLAIN_CACHE, cacheKey, fallback)
        resolve(fallback)
        return
      }
      try {
        const out = JSON.parse(stdout.trim())
        setInCache(EXPLAIN_CACHE, cacheKey, out)
        resolve(out)
      } catch (_) {
        // If parsing fails, still provide a rule-based explanation
        const fallback = buildRuleBasedExplanation(startup, investor)
        setInCache(EXPLAIN_CACHE, cacheKey, fallback)
        resolve(fallback)
      }
    })

    proc.on('error', (err) => {
      console.warn('Python not available for explanation, using rule-based explanation instead:', err.message)
      const fallback = buildRuleBasedExplanation(startup, investor)
      setInCache(EXPLAIN_CACHE, cacheKey, fallback)
      resolve(fallback)
    })
  })
}

/**
 * Rank investors for a startup using ML model
 * Falls back to simple scoring if ML model unavailable
 * Uses batching to reduce memory pressure on Windows
 */
export async function rankInvestorsForStartupML(startup, investors) {
  // Check if ML is available by testing one prediction first
  let mlAvailable = false
  if (investors.length > 0) {
    try {
      await callMLModel(startup, investors[0])
      mlAvailable = true
    } catch (err) {
      const errorMsg = err.message || ''
      // Check for common Windows DLL errors
      if (errorMsg.includes('DLL') || errorMsg.includes('paging file') || errorMsg.includes('ImportError') || errorMsg.includes('ML_MODEL_UNAVAILABLE')) {
        console.warn('⚠️  ML model unavailable due to Windows DLL/system issues.')
        console.warn('   The system will use fallback rule-based scoring.')
        console.warn('   See server/ML_TROUBLESHOOTING.md for solutions.')
        console.warn('   Quick fix: Increase Windows page file size or reinstall scipy/sklearn')
      } else {
        console.warn('ML model unavailable:', errorMsg)
      }
      mlAvailable = false
    }
  }

  // If ML not available, use fallback for all
  if (!mlAvailable) {
    return investors
      .map((inv) => ({
        ...inv,
        matchScore: computeFallbackScore(startup, inv),
        scoreSource: 'fallback',
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
  }

  // Process in smaller batches to reduce memory pressure
  const BATCH_SIZE = 10
  const results = []
  
  for (let i = 0; i < investors.length; i += BATCH_SIZE) {
    const batch = investors.slice(i, i + BATCH_SIZE)
    const batchResults = await Promise.allSettled(
      batch.map(async (inv) => {
        try {
          const score = await callMLModel(startup, inv)
          return { ...inv, matchScore: Math.round(score), scoreSource: 'ml' }
        } catch (err) {
          // Fallback to simple scoring for this investor
          console.warn(`ML prediction failed for investor ${inv.id}, using fallback:`, err.message)
          const fallbackScore = computeFallbackScore(startup, inv)
          return { ...inv, matchScore: fallbackScore, scoreSource: 'fallback' }
        }
      })
    )
    results.push(...batchResults)
  }

  return results
    .map((result) => (result.status === 'fulfilled' ? result.value : null))
    .filter(Boolean)
    .sort((a, b) => b.matchScore - a.matchScore)
}

/**
 * Rank startups for an investor using ML model
 * Falls back to simple scoring if ML model unavailable
 */
export async function rankStartupsForInvestorML(investor, startups) {
  // Check if ML is available by testing one prediction first
  let mlAvailable = false
  if (startups.length > 0) {
    try {
      await callMLModel(startups[0], investor)
      mlAvailable = true
    } catch (err) {
      const errorMsg = err.message || ''
      // Check for common Windows DLL errors
      if (errorMsg.includes('DLL') || errorMsg.includes('paging file') || errorMsg.includes('ImportError') || errorMsg.includes('ML_MODEL_UNAVAILABLE')) {
        console.warn('⚠️  ML model unavailable due to Windows DLL/system issues.')
        console.warn('   The system will use fallback rule-based scoring.')
        console.warn('   See server/ML_TROUBLESHOOTING.md for solutions.')
        console.warn('   Quick fix: Increase Windows page file size or reinstall scipy/sklearn')
      } else {
        console.warn('ML model unavailable:', errorMsg)
      }
      mlAvailable = false
    }
  }

  // If ML not available, use fallback for all
  if (!mlAvailable) {
    return startups
      .map((s) => ({
        ...s,
        matchScore: computeFallbackScore(s, investor),
        scoreSource: 'fallback',
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
  }

  // Process in smaller batches to reduce memory pressure
  const BATCH_SIZE = 10
  const results = []
  
  for (let i = 0; i < startups.length; i += BATCH_SIZE) {
    const batch = startups.slice(i, i + BATCH_SIZE)
    const batchResults = await Promise.allSettled(
      batch.map(async (s) => {
        try {
          const score = await callMLModel(s, investor)
          return { ...s, matchScore: Math.round(score), scoreSource: 'ml' }
        } catch (err) {
          // Fallback to simple scoring for this startup
          console.warn(`ML prediction failed for startup ${s.id}, using fallback:`, err.message)
          const fallbackScore = computeFallbackScore(s, investor)
          return { ...s, matchScore: fallbackScore, scoreSource: 'fallback' }
        }
      })
    )
    results.push(...batchResults)
  }

  return results
    .map((result) => (result.status === 'fulfilled' ? result.value : null))
    .filter(Boolean)
    .sort((a, b) => b.matchScore - a.matchScore)
}

/**
 * Fallback scoring when ML model unavailable
 */
function computeFallbackScore(startup, investor) {
  let score = 0

  // Sector match (40 points)
  const startupSector = startup.sector || ''
  const investorSectors = investor.preferredSectors || []
  const sectorMatch = Array.isArray(investorSectors) 
    ? investorSectors.length === 0 || investorSectors.includes(startupSector)
    : investorSectors === startupSector || investorSectors === ''
  
  if (sectorMatch && startupSector) score += 40

  // Stage match (30 points)
  const startupStage = startup.stage || ''
  const investorStages = investor.preferredStages || []
  const stageMatch = Array.isArray(investorStages)
    ? investorStages.length === 0 || investorStages.includes(startupStage)
    : investorStages === startupStage || investorStages === ''
  
  if (stageMatch && startupStage) score += 30

  // Ticket size match (30 points)
  const sought = startup.fundingSought || 0
  const min = investor.ticketMin || 0
  const max = investor.ticketMax || 1000
  
  if (sought > 0) {
    if (sought >= min && sought <= max) {
      score += 30
    } else if (min > 0 && max > 0) {
      // Partial match if within 30% range
      const range = max - min
      const lowerBound = min * 0.7
      const upperBound = max * 1.3
      if (sought >= lowerBound && sought <= upperBound) {
        score += 15
      }
    }
  }

  // Ensure minimum score of 10 if investor has any preferences set
  if (score === 0 && (investorSectors.length > 0 || investorStages.length > 0 || min > 0)) {
    score = 10 // Base compatibility score
  }

  // Add a small deterministic jitter so fallback scores aren't all identical
  const key = `${startup.id || startup.userId || ''}-${investor.id || investor.userId || ''}`
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  }
  // noise in [-8, +8]
  const noise = (hash % 17) - 8
  const jittered = score + noise

  return Math.max(0, Math.min(100, jittered))
}

/**
 * Build a rule-based explanation object that mirrors the ML explain output shape.
 * This is used when the Python model is unavailable or fails.
 */
function buildRuleBasedExplanation(startup, investor) {
  const startupSector = startup.sector || ''
  const investorSectors = investor.preferredSectors || []
  const primaryInvestorSector = Array.isArray(investorSectors) ? (investorSectors[0] || '') : investorSectors

  const startupStage = startup.stage || ''
  const investorStages = investor.preferredStages || []
  const primaryInvestorStage = Array.isArray(investorStages) ? (investorStages[0] || '') : investorStages

  const sought = startup.fundingSought || 0
  const min = investor.ticketMin || 0
  const max = investor.ticketMax || 1000

  const sectorMatch = primaryInvestorSector && startupSector
    ? primaryInvestorSector === startupSector
    : true // treat empty preference as match

  const stageMatch = primaryInvestorStage && startupStage
    ? primaryInvestorStage === startupStage
    : true

  let fundingFit = false
  let fundingPartial = false
  if (sought > 0 && min > 0 && max > 0) {
    if (sought >= min && sought <= max) {
      fundingFit = true
    } else {
      const lowerBound = min * 0.7
      const upperBound = max * 1.3
      if (sought >= lowerBound && sought <= upperBound) {
        fundingPartial = true
      }
    }
  }

  const baseScore = computeFallbackScore(startup, investor)

  // Approximate contributions by mapping rule weights into points
  const sectorContribution = sectorMatch && startupSector ? 40 : 0
  const stageContribution = stageMatch && startupStage ? 30 : 0
  let fundingContribution = 0
  if (fundingFit) fundingContribution = 30
  else if (fundingPartial) fundingContribution = 15

  // Whatever is left goes into "idea similarity" bucket for visualization purposes
  const used = sectorContribution + stageContribution + fundingContribution
  const ideaContribution = Math.max(0, baseScore - used)

  const strengths = []
  const weaknesses = []

  if (sectorMatch && startupSector) strengths.push('Strong sector alignment')
  else if (startupSector && primaryInvestorSector) weaknesses.push('Sector mismatch')

  if (stageMatch && startupStage) strengths.push('Stage fits investor thesis')
  else if (startupStage && primaryInvestorStage) weaknesses.push('Stage may not match investor focus')

  if (fundingFit) strengths.push('Funding ask is within investor ticket size')
  else if (fundingPartial) weaknesses.push('Funding ask is slightly outside preferred range')
  else if (sought > 0 && min > 0 && max > 0) weaknesses.push('Funding ask is far from investor ticket range')

  const explanation = {
    score: baseScore,
    contributions: {
      sector: {
        match: !!sectorMatch,
        contribution: Number(sectorContribution.toFixed(1)),
        startup: startupSector || 'Not specified',
        investor: primaryInvestorSector || 'Any',
      },
      stage: {
        match: !!stageMatch,
        contribution: Number(stageContribution.toFixed(1)),
        startup: startupStage || 'Not specified',
        investor: primaryInvestorStage || 'Any',
      },
      funding: {
        fit: !!fundingFit,
        contribution: Number(fundingContribution.toFixed(1)),
        startup_ask: sought,
        investor_range: [min, max],
      },
      idea_similarity: {
        score: 0,
        contribution: Number(ideaContribution.toFixed(1)),
        description: 'Semantic similarity not computed (ML model unavailable)',
      },
    },
    breakdown: {
      total_score: baseScore,
      factors: [],
      strengths,
      weaknesses,
    },
  }

  return explanation
}

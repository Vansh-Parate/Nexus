import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'
import { motion } from 'motion/react'

interface MatchScoreRingProps {
  score: number
  size?: number
  className?: string
}

export function MatchScoreRing({ score, size = 120, className = '' }: MatchScoreRingProps) {
  const clampedScore = Math.min(100, Math.max(0, score))
  const data = [{ name: 'score', value: clampedScore, fill: 'var(--color-terracotta)' }]
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar background dataKey="value" cornerRadius={0} max={100} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="font-display text-2xl font-bold text-forest-ink"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {clampedScore}%
        </motion.span>
      </div>
    </div>
  )
}

import type { ReactNode } from 'react'
import { NeoButton } from './NeoButton'

interface EmptyStateProps {
  illustration?: ReactNode
  message: string
  ctaLabel?: string
  ctaTo?: string
}

export function EmptyState({ illustration, message, ctaLabel, ctaTo }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {illustration && (
        <div className="mb-6 w-48 h-48 text-forest-ink/30 [&_svg]:w-full [&_svg]:h-full">
          {illustration}
        </div>
      )}
      <p className="font-display text-xl text-forest-ink max-w-md mb-6">{message}</p>
      {ctaLabel && ctaTo && (
        <NeoButton variant="primary" onClick={() => (window.location.href = ctaTo)}>
          {ctaLabel}
        </NeoButton>
      )}
    </div>
  )
}

import { forwardRef } from 'react'

type Variant = 'primary' | 'outline' | 'ghost'

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-terracotta text-chalk-white border border-terracotta/20 shadow-sm hover:bg-terracotta/90 hover:shadow transition-all duration-200',
  outline:
    'bg-transparent text-forest-ink border border-border hover:bg-warm-sand/60 transition-colors duration-200',
  ghost:
    'bg-transparent text-forest-ink border-transparent hover:bg-warm-sand/40 transition-colors duration-200',
}

export const NeoButton = forwardRef<HTMLButtonElement, NeoButtonProps>(
  ({ variant = 'primary', children, className = '', ...props }, ref) => (
    <button
      ref={ref}
      className={`font-body inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
)
NeoButton.displayName = 'NeoButton'

const STEPS = [
  'Account',
  'Startup Info',
  'Business Details',
  'Funding',
  'Documents',
  'Review',
  'Submit',
]

interface ProfileProgressBarProps {
  currentStep: number
  completedSteps: Set<number>
  onStepClick?: (step: number) => void
  disabled?: boolean
}

export function ProfileProgressBar({ currentStep, completedSteps, onStepClick, disabled }: ProfileProgressBarProps) {
  const canClick = !disabled && onStepClick
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center gap-0 min-w-max">
        {STEPS.map((label, i) => {
          const isCompleted = completedSteps.has(i)
          const isCurrent = i === currentStep
          const isPast = i < currentStep
          const canNavigate = !disabled && (i <= currentStep || (i === currentStep + 1 && completedSteps.has(currentStep)))
          return (
            <div key={i} className="flex items-center shrink-0">
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => canNavigate && onStepClick?.(i)}
                  disabled={!canClick || !canNavigate}
                  className={`
                    flex items-center justify-center h-9 min-w-9 px-2 rounded-lg font-body text-sm font-medium
                    transition-colors duration-200
                    ${disabled ? 'cursor-default opacity-80' : canClick && canNavigate ? 'cursor-pointer hover:opacity-90' : 'cursor-default'}
                    ${isCompleted ? 'bg-green-600 text-white' : ''}
                    ${isCurrent ? 'bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2' : ''}
                    ${!isCompleted && !isCurrent ? 'bg-warm-sand text-forest-ink/70' : ''}
                  `}
                >
                  {i + 1}
                </button>
                <span
                  className={`font-body text-xs mt-1 max-w-[72px] text-center truncate ${
                    isCurrent ? 'text-blue-600 font-medium' : isCompleted ? 'text-green-600' : 'text-forest-ink/60'
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-4 sm:w-8 mx-0.5 shrink-0 ${
                    isPast || isCompleted ? 'bg-green-600' : 'bg-border'
                  }`}
                  aria-hidden
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

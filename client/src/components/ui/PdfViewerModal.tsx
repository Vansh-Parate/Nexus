import { useEffect } from 'react'

interface PdfViewerModalProps {
  /** Relative URL e.g. /api/uploads/pitch-123.pdf */
  src: string
  onClose: () => void
}

export function PdfViewerModal({ src, onClose }: PdfViewerModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const fullSrc = src.startsWith('http') ? src : `${window.location.origin}${src}`

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="View PDF"
    >
      <div
        className="relative flex h-[90vh] w-full max-w-4xl flex-col rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <span className="font-body text-sm font-medium text-forest-ink">Pitch deck</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-forest-ink/70 hover:bg-warm-sand hover:text-forest-ink"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <iframe
          title="Pitch deck PDF"
          src={fullSrc}
          className="flex-1 w-full rounded-b-lg"
        />
      </div>
    </div>
  )
}

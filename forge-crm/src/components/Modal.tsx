import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
}

export default function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <div
        className="relative w-full max-w-[900px] max-h-[85vh] mx-4 bg-white rounded-xl shadow-xl border border-forge-border flex flex-col animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-forge-border flex-shrink-0">
          <h2 className="text-base font-semibold text-forge-text">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-forge-text-muted hover:bg-forge-bg hover:text-forge-text transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-forge-border flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  glow?: boolean
  noPadding?: boolean
}

export default function Card({ title, action, children, className = '', glow, noPadding }: CardProps) {
  return (
    <div
      className={`bg-forge-card rounded-2xl border border-forge-border overflow-hidden transition-all duration-200 ${glow ? 'card-glow' : ''} ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-forge-border">
          <h3 className="font-heading text-base font-bold text-forge-text">
            {title}
          </h3>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>{children}</div>
    </div>
  )
}

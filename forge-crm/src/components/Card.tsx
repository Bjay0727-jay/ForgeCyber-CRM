import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  noPadding?: boolean
}

export default function Card({ title, action, children, className = '', noPadding }: CardProps) {
  return (
    <div className={`bg-white rounded-xl border border-forge-border shadow-sm ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-forge-border">
          <h3 className="text-sm font-semibold text-forge-text">{title}</h3>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  )
}

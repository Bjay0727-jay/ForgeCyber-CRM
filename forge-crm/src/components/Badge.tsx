import type { ReactNode } from 'react'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'teal' | 'navy'

interface BadgeProps {
  variant: BadgeVariant
  children: ReactNode
  dot?: boolean
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-forge-success/8 text-forge-success border-forge-success/15',
  warning: 'bg-forge-warning/8 text-forge-warning border-forge-warning/15',
  danger: 'bg-forge-danger/8 text-forge-danger border-forge-danger/15',
  info: 'bg-forge-info/8 text-forge-info border-forge-info/15',
  teal: 'bg-forge-teal-subtle text-forge-teal border-forge-teal/15',
  navy: 'bg-forge-navy/6 text-forge-navy border-forge-navy/10',
}

export default function Badge({ variant, children, dot }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${variantClasses[variant]}`}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
      )}
      {children}
    </span>
  )
}

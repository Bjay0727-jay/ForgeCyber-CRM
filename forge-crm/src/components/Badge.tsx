import type { ReactNode } from 'react'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'teal' | 'navy'

interface BadgeProps {
  variant: BadgeVariant
  children: ReactNode
  dot?: boolean
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-forge-success/10 text-forge-success border-forge-success/20',
  warning: 'bg-forge-warning/10 text-forge-warning border-forge-warning/20',
  danger: 'bg-forge-danger/10 text-forge-danger border-forge-danger/20',
  info: 'bg-forge-info/10 text-forge-info border-forge-info/20',
  teal: 'bg-forge-teal-glow text-forge-teal border-forge-teal/20',
  navy: 'bg-forge-navy/10 text-forge-navy border-forge-navy/20',
}

export default function Badge({ variant, children, dot }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${variantClasses[variant]}`}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0"
        />
      )}
      {children}
    </span>
  )
}

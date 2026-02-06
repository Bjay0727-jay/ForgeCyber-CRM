import type { ReactNode } from 'react'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'teal' | 'navy'

interface BadgeProps {
  variant: BadgeVariant
  children: ReactNode
  dot?: boolean
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-forge-success/10 text-forge-success',
  warning: 'bg-forge-warning/10 text-forge-warning',
  danger: 'bg-forge-danger/10 text-forge-danger',
  info: 'bg-forge-info/10 text-forge-info',
  teal: 'bg-forge-teal-glow text-forge-teal',
  navy: 'bg-forge-navy/10 text-forge-navy',
}

export default function Badge({ variant, children, dot }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${variantClasses[variant]}`}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
      )}
      {children}
    </span>
  )
}

import {
  ClipboardCheck,
  FileText,
  ShieldCheck,
  AlertTriangle,
  UserPlus,
  Settings,
  Layers,
  BarChart3,
} from 'lucide-react'
import { templates } from '../data/mockData'

const iconConfig: Record<string, { icon: React.ReactNode; gradient: string }> = {
  assess: {
    icon: <ClipboardCheck size={26} className="text-white" />,
    gradient: 'bg-gradient-to-br from-forge-teal to-forge-teal-light',
  },
  report: {
    icon: <FileText size={26} className="text-white" />,
    gradient: 'bg-gradient-to-br from-forge-navy to-forge-navy-light',
  },
  compliance: {
    icon: <ShieldCheck size={26} className="text-white" />,
    gradient: 'bg-gradient-to-br from-forge-purple to-forge-purple/70',
  },
  incident: {
    icon: <AlertTriangle size={26} className="text-white" />,
    gradient: 'bg-gradient-to-br from-forge-danger to-forge-danger/70',
  },
  onboard: {
    icon: <UserPlus size={26} className="text-white" />,
    gradient: 'bg-gradient-to-br from-forge-success to-forge-success/70',
  },
  ops: {
    icon: <Settings size={26} className="text-white" />,
    gradient: 'bg-gradient-to-br from-forge-warning to-forge-warning/70',
  },
}

export default function Templates() {
  return (
    <div className="grid grid-cols-3 gap-6 stagger-children">
      {templates.map((template) => {
        const config = iconConfig[template.iconType]
        return (
          <div
            key={template.name}
            className="group bg-forge-card rounded-2xl border border-forge-border overflow-hidden card-glow cursor-pointer animate-slideUp"
          >
            {/* Accent Bar */}
            <div
              className="h-1 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(to right, var(--color-forge-teal), var(--color-forge-teal-light))',
              }}
            />

            {/* Content */}
            <div className="p-6">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${config.gradient}`}>
                {config.icon}
              </div>
              <h3 className="font-heading font-bold text-base text-forge-text mb-2">
                {template.name}
              </h3>
              <p className="text-[13px] text-forge-text-muted leading-relaxed mb-5">
                {template.desc}
              </p>
            </div>

            {/* Meta Footer */}
            <div className="px-6 py-4 border-t border-forge-border flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-forge-text-muted">
                <Layers size={14} />
                {template.sections > 0
                  ? `${template.sections} sections`
                  : template.domains}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-forge-text-muted">
                <BarChart3 size={14} />
                {template.usageCount} uses
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

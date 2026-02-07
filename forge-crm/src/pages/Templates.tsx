import {
  ClipboardCheck, FileText, ShieldCheck, AlertTriangle,
  UserPlus, Settings, Layers, BarChart3, Download,
} from 'lucide-react'
import { templates } from '../data/mockData'

const iconConfig: Record<string, { icon: React.ReactNode; bgClass: string }> = {
  assess: { icon: <ClipboardCheck size={22} className="text-forge-teal" />, bgClass: 'bg-forge-teal-subtle' },
  report: { icon: <FileText size={22} className="text-forge-info" />, bgClass: 'bg-forge-info/8' },
  compliance: { icon: <ShieldCheck size={22} className="text-forge-purple" />, bgClass: 'bg-forge-purple/8' },
  incident: { icon: <AlertTriangle size={22} className="text-forge-danger" />, bgClass: 'bg-forge-danger/8' },
  onboard: { icon: <UserPlus size={22} className="text-forge-success" />, bgClass: 'bg-forge-success/8' },
  ops: { icon: <Settings size={22} className="text-forge-warning" />, bgClass: 'bg-forge-warning/8' },
}

export default function Templates() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {templates.map((template) => {
        const config = iconConfig[template.iconType]
        return (
          <div
            key={template.name}
            className="group bg-white rounded-xl border border-forge-border shadow-sm hover:border-forge-teal/20 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="p-5">
              <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-3.5 ${config.bgClass}`}>
                {config.icon}
              </div>
              <h3 className="text-sm font-semibold text-forge-text mb-1.5">{template.name}</h3>
              <p className="text-xs text-forge-text-muted leading-relaxed mb-4">{template.desc}</p>
            </div>
            <div className="px-5 py-3 border-t border-forge-border bg-forge-bg/30 rounded-b-xl flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs text-forge-text-faint">
                <Layers size={12} />
                {template.sections > 0 ? `${template.sections} sections` : template.domains}
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-forge-text-faint">
                  <BarChart3 size={12} />
                  {template.usageCount} uses
                </span>
                <Download size={14} className="text-forge-text-faint opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

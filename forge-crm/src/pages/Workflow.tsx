import { CheckCircle2, Clock, Circle } from 'lucide-react'
import { workflowPhases, workflowTrackers } from '../data/mockData'
import Card from '../components/Card'

const statusConfig: Record<string, { icon: React.ReactNode; dotClass: string }> = {
  completed: { icon: <CheckCircle2 size={18} />, dotClass: 'bg-forge-success text-white' },
  active: { icon: <Clock size={18} />, dotClass: 'bg-forge-teal text-white' },
  pending: { icon: <Circle size={18} />, dotClass: 'bg-forge-bg text-forge-text-faint border border-forge-border' },
}

function getTrackerColor(progress: number): string {
  if (progress < 40) return 'bg-forge-warning'
  if (progress <= 70) return 'bg-forge-teal'
  return 'bg-forge-success'
}

export default function Workflow() {
  return (
    <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 340px' }}>
      <Card title="Consulting Engagement Workflow">
        <div className="relative pl-10">
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-forge-border" />
          <div className="space-y-6">
            {workflowPhases.map((phase, idx) => {
              const config = statusConfig[phase.status]
              return (
                <div key={idx} className="relative">
                  <div
                    className={`absolute w-7 h-7 rounded-full flex items-center justify-center ${config.dotClass}`}
                    style={{ left: '-25px', top: '2px' }}
                  >
                    {config.icon}
                  </div>
                  <div className="p-4 rounded-lg border border-forge-border hover:border-forge-teal/20 transition-colors bg-white">
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="text-sm font-medium text-forge-text">{phase.title}</h4>
                      <span className="text-xs text-forge-text-faint bg-forge-bg px-2 py-0.5 rounded">{phase.duration}</span>
                    </div>
                    <p className="text-sm text-forge-text-muted mb-3 leading-relaxed">{phase.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {phase.deliverables.map((d) => (
                        <span key={d} className="px-2 py-0.5 bg-forge-teal-subtle text-forge-teal text-xs font-medium rounded border border-forge-teal/10">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        <Card title="Active Tracker">
          <div className="space-y-4">
            {workflowTrackers.map((tracker) => (
              <div key={tracker.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-medium text-forge-text">{tracker.name}</p>
                  <span className="text-xs text-forge-text-faint">{tracker.phase}</span>
                </div>
                <div className="h-1.5 bg-forge-bg rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${getTrackerColor(tracker.progress)}`} style={{ width: `${tracker.progress}%` }} />
                </div>
                <p className="text-xs text-forge-text-faint mt-1 text-right">{tracker.progress}%</p>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Overview">
          <div className="space-y-3">
            {[
              { label: 'Total Duration', value: '13-24 Days' },
              { label: 'Key Deliverables', value: '20+ Documents' },
              { label: 'Active Phases', value: '5 Phases' },
              { label: 'Security Domains', value: '7 Domains' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2.5 border-b border-forge-border last:border-0">
                <span className="text-sm text-forge-text-muted">{item.label}</span>
                <span className="text-sm font-medium text-forge-text">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

import { CheckCircle2, Clock, Circle } from 'lucide-react';
import { workflowPhases, workflowTrackers } from '../data/mockData';
import Card from '../components/Card';

const statusConfig: Record<string, { icon: React.ReactNode; dotClass: string; lineClass: string }> = {
  completed: {
    icon: <CheckCircle2 size={20} />,
    dotClass: 'bg-forge-success text-white',
    lineClass: 'border-forge-success',
  },
  active: {
    icon: <Clock size={20} />,
    dotClass: 'bg-forge-warning text-white animate-pulse-dot',
    lineClass: 'border-forge-warning',
  },
  pending: {
    icon: <Circle size={20} />,
    dotClass: 'bg-forge-teal/20 text-forge-teal',
    lineClass: 'border-forge-border',
  },
};

function getTrackerColor(progress: number): string {
  if (progress < 40) return 'bg-forge-warning';
  if (progress <= 70) return 'bg-forge-teal';
  return 'bg-forge-success';
}

export default function Workflow() {
  return (
    <div className="grid gap-6" style={{ gridTemplateColumns: '2fr 1fr' }}>
      {/* Left Column: Workflow Timeline */}
      <Card title="Forge Consulting Engagement Workflow">
        <div className="relative pl-10">
          {/* Vertical Line */}
          <div
            className="absolute left-[15px] top-2 bottom-2 w-0.5"
            style={{
              background: 'linear-gradient(to bottom, var(--color-forge-teal), var(--color-forge-navy))',
            }}
          />

          <div className="space-y-8">
            {workflowPhases.map((phase, idx) => {
              const config = statusConfig[phase.status];
              return (
                <div key={idx} className="relative">
                  {/* Status Dot */}
                  <div
                    className={`absolute -left-10 top-1 w-8 h-8 rounded-full flex items-center justify-center ${config.dotClass}`}
                    style={{ transform: 'translateX(-50%)', left: '15px' }}
                  >
                    {config.icon}
                  </div>

                  {/* Phase Card */}
                  <div className="p-5 rounded-xl border border-forge-border hover:border-forge-teal/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-heading text-sm font-bold text-forge-navy">
                        {phase.title}
                      </h4>
                      <span className="text-xs text-forge-text-muted bg-forge-bg px-3 py-1 rounded-full">
                        {phase.duration}
                      </span>
                    </div>
                    <p className="text-sm text-forge-text-muted mb-4 leading-relaxed">
                      {phase.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {phase.deliverables.map((d) => (
                        <span
                          key={d}
                          className="px-3 py-1 bg-forge-teal-glow text-forge-teal text-xs font-medium rounded-full"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Active Workflow Tracker */}
        <Card title="Active Workflow Tracker">
          <div className="space-y-5">
            {workflowTrackers.map((tracker) => (
              <div key={tracker.name}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-forge-navy">
                    {tracker.name}
                  </p>
                  <span className="text-xs text-forge-text-muted">
                    {tracker.phase}
                  </span>
                </div>
                <div className="h-2 bg-forge-bg rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getTrackerColor(tracker.progress)}`}
                    style={{ width: `${tracker.progress}%` }}
                  />
                </div>
                <p className="text-xs text-forge-text-muted mt-1 text-right">
                  {tracker.progress}%
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Workflow Overview */}
        <Card title="Workflow Overview">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-forge-border">
              <span className="text-sm text-forge-text-muted">Total Duration</span>
              <span className="font-heading text-sm font-bold text-forge-navy">13-24 Days</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-forge-border">
              <span className="text-sm text-forge-text-muted">Key Deliverables</span>
              <span className="font-heading text-sm font-bold text-forge-navy">20+ Documents</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-forge-border">
              <span className="text-sm text-forge-text-muted">Active Phases</span>
              <span className="font-heading text-sm font-bold text-forge-navy">5 Phases</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-forge-text-muted">Security Domains</span>
              <span className="font-heading text-sm font-bold text-forge-navy">7 Domains</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

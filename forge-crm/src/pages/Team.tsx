import { teamMembers } from '../data/mockData'
import Badge from '../components/Badge'
import { Plus } from 'lucide-react'

function utilizationColor(pct: number) {
  if (pct >= 90) return 'bg-forge-danger'
  if (pct >= 75) return 'bg-forge-warning'
  return 'bg-forge-teal'
}

export default function Team() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-forge-text-muted">{teamMembers.length} team members</p>
        <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-forge-teal text-white text-sm font-medium hover:bg-forge-teal/90 transition-colors">
          <Plus size={15} />
          Add Member
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {teamMembers.map((member) => (
          <div key={member.name} className="bg-white rounded-xl border border-forge-border shadow-sm p-5">
            <div className="flex items-start gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-forge-navy flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                {member.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-forge-text">{member.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${member.status === 'available' ? 'bg-forge-success' : 'bg-forge-warning'}`} />
                    <span className="text-xs text-forge-text-faint capitalize">{member.status}</span>
                  </div>
                </div>
                <p className="text-xs text-forge-text-muted mt-0.5">{member.role}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {member.specializations.map((spec) => (
                <Badge key={spec} variant="teal">{spec}</Badge>
              ))}
            </div>

            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-forge-text-muted">Utilization</span>
                  <span className="font-medium text-forge-text">{member.utilization}%</span>
                </div>
                <div className="h-1.5 bg-forge-bg rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${utilizationColor(member.utilization)}`} style={{ width: `${member.utilization}%` }} />
                </div>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-forge-border">
                <span className="text-forge-text-muted">Active Engagements</span>
                <span className="font-semibold text-forge-text">{member.activeEngagements}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

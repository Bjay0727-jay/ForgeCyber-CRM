import { teamMembers } from '../data/mockData'
import Badge from '../components/Badge'

function utilizationColor(pct: number) {
  if (pct >= 90) return 'bg-forge-danger'
  if (pct >= 75) return 'bg-forge-warning'
  return 'bg-forge-teal'
}

export default function Team() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-forge-text-muted text-sm">{teamMembers.length} team members</p>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-gradient-to-br from-forge-teal to-forge-teal-light text-white shadow-[0_4px_12px_rgba(13,148,136,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(13,148,136,0.4)] transition-all">
          Add Team Member
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {teamMembers.map((member) => (
          <div key={member.name} className="bg-white rounded-2xl border border-forge-border p-6 hover:shadow-lg hover:border-forge-teal transition-all">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-forge-teal to-forge-navy-light flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                {member.initials}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-forge-navy">{member.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${member.status === 'available' ? 'bg-forge-success' : 'bg-forge-warning'}`} />
                    <span className="text-xs text-forge-text-muted capitalize">{member.status}</span>
                  </div>
                </div>
                <p className="text-sm text-forge-text-muted">{member.role}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {member.specializations.map((spec) => (
                <Badge key={spec} variant="teal">{spec}</Badge>
              ))}
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-forge-text-muted font-medium">Utilization</span>
                  <span className="font-semibold text-forge-navy">{member.utilization}%</span>
                </div>
                <div className="h-2 bg-forge-bg rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${utilizationColor(member.utilization)}`} style={{ width: `${member.utilization}%` }} />
                </div>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-forge-border">
                <span className="text-forge-text-muted">Active Engagements</span>
                <span className="font-heading font-bold text-forge-navy">{member.activeEngagements}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

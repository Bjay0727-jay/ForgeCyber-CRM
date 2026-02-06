import { operationsEngagements } from '../data/mockData'
import Card from '../components/Card'
import Badge from '../components/Badge'
import { Activity, DollarSign, Clock, Users } from 'lucide-react'

const summaryStats = [
  { label: 'Total Engagements', value: '8', icon: Activity, color: 'bg-forge-teal-glow text-forge-teal' },
  { label: 'Total Hours', value: '485 / 700', icon: Clock, color: 'bg-forge-navy/10 text-forge-navy' },
  { label: 'Revenue', value: '$393K', icon: DollarSign, color: 'bg-forge-success/10 text-forge-success' },
  { label: 'Avg Utilization', value: '74%', icon: Users, color: 'bg-forge-warning/10 text-forge-warning' },
]

function progressColor(used: number, budget: number) {
  const pct = (used / budget) * 100
  if (pct >= 95) return 'bg-forge-danger'
  if (pct >= 80) return 'bg-forge-warning'
  return 'bg-forge-teal'
}

function statusVariant(status: string) {
  if (status === 'On Track') return 'success' as const
  if (status === 'At Risk') return 'warning' as const
  return 'danger' as const
}

export default function Operations() {
  return (
    <div>
      <div className="grid grid-cols-4 gap-6 mb-8">
        {summaryStats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-forge-border p-6 hover:shadow-lg hover:-translate-y-1 hover:border-forge-teal transition-all">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div className="text-[13px] text-forge-text-muted font-medium mb-2">{stat.label}</div>
            <div className="font-heading text-[32px] font-bold text-forge-navy">{stat.value}</div>
          </div>
        ))}
      </div>

      <Card title="Active Engagements" action={<button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-forge-border bg-white text-forge-navy hover:bg-forge-bg hover:border-forge-teal transition-all">Export Report</button>}>
        <div className="p-6">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-forge-text-muted uppercase tracking-wide border-b border-forge-border bg-forge-bg">Customer</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-forge-text-muted uppercase tracking-wide border-b border-forge-border bg-forge-bg">Type</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-forge-text-muted uppercase tracking-wide border-b border-forge-border bg-forge-bg">Consultant</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-forge-text-muted uppercase tracking-wide border-b border-forge-border bg-forge-bg">Hours Used</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-forge-text-muted uppercase tracking-wide border-b border-forge-border bg-forge-bg">Status</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-forge-text-muted uppercase tracking-wide border-b border-forge-border bg-forge-bg">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {operationsEngagements.map((eng, i) => (
                <tr key={i} className="hover:bg-forge-teal/[0.03]">
                  <td className="py-4 px-4 border-b border-forge-border text-sm font-semibold text-forge-navy">{eng.customer}</td>
                  <td className="py-4 px-4 border-b border-forge-border text-sm">{eng.type}</td>
                  <td className="py-4 px-4 border-b border-forge-border text-sm">{eng.consultant}</td>
                  <td className="py-4 px-4 border-b border-forge-border text-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-forge-bg rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${progressColor(eng.hoursUsed, eng.hoursBudget)}`} style={{ width: `${Math.min((eng.hoursUsed / eng.hoursBudget) * 100, 100)}%` }} />
                      </div>
                      <span className="text-xs font-semibold whitespace-nowrap">{eng.hoursUsed}/{eng.hoursBudget}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 border-b border-forge-border text-sm">
                    <Badge variant={statusVariant(eng.status)} dot>{eng.status}</Badge>
                  </td>
                  <td className="py-4 px-4 border-b border-forge-border text-sm font-heading font-bold text-forge-teal">{eng.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

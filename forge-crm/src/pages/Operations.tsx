import { operationsEngagements } from '../data/mockData'
import Card from '../components/Card'
import Badge from '../components/Badge'
import { Activity, DollarSign, Clock, Users } from 'lucide-react'

const summaryStats = [
  { label: 'Total Engagements', value: '8', icon: Activity, color: 'bg-forge-teal-subtle text-forge-teal' },
  { label: 'Total Hours', value: '485 / 700', icon: Clock, color: 'bg-forge-info/8 text-forge-info' },
  { label: 'Revenue', value: '$393K', icon: DollarSign, color: 'bg-forge-success/8 text-forge-success' },
  { label: 'Avg Utilization', value: '74%', icon: Users, color: 'bg-forge-warning/8 text-forge-warning' },
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
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {summaryStats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-forge-border shadow-sm p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <p className="text-xs text-forge-text-muted mb-1">{stat.label}</p>
            <p className="text-xl font-semibold text-forge-text">{stat.value}</p>
          </div>
        ))}
      </div>

      <Card
        title="Active Engagements"
        noPadding
        action={
          <button className="px-3.5 py-1.5 rounded-lg border border-forge-border text-sm font-medium text-forge-text hover:bg-forge-bg transition-colors">
            Export Report
          </button>
        }
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-forge-border bg-forge-bg/50">
              <th className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Customer</th>
              <th className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Type</th>
              <th className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Consultant</th>
              <th className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Hours</th>
              <th className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Status</th>
              <th className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {operationsEngagements.map((eng, i) => (
              <tr key={i} className="border-b border-forge-border/60 last:border-0 hover:bg-forge-bg/30 transition-colors">
                <td className="py-3 px-4 text-sm font-medium text-forge-text">{eng.customer}</td>
                <td className="py-3 px-4 text-sm text-forge-text-muted">{eng.type}</td>
                <td className="py-3 px-4 text-sm text-forge-text-muted">{eng.consultant}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-forge-bg rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${progressColor(eng.hoursUsed, eng.hoursBudget)}`} style={{ width: `${Math.min((eng.hoursUsed / eng.hoursBudget) * 100, 100)}%` }} />
                    </div>
                    <span className="text-xs font-medium text-forge-text-muted whitespace-nowrap">{eng.hoursUsed}/{eng.hoursBudget}</span>
                  </div>
                </td>
                <td className="py-3 px-4"><Badge variant={statusVariant(eng.status)} dot>{eng.status}</Badge></td>
                <td className="py-3 px-4 text-sm font-semibold text-forge-teal">{eng.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

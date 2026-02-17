import { useMemo, useState } from 'react'
import { getEngagements } from '../lib/api'
import Card from '../components/Card'
import Badge from '../components/Badge'
import SearchFilterBar from '../components/SearchFilterBar'
import { Activity, DollarSign, Clock, Users } from 'lucide-react'

function progressColor(used: number, budget: number) {
  const pct = (used / budget) * 100
  if (pct >= 95) return 'bg-forge-danger'
  if (pct >= 80) return 'bg-forge-warning'
  return 'bg-forge-teal'
}

function statusVariant(status: string) {
  switch (status) {
    case 'on_track': return 'success' as const
    case 'at_risk': return 'warning' as const
    case 'blocked': return 'danger' as const
    case 'completed': return 'success' as const
    default: return 'info' as const
  }
}

function statusLabel(status: string) {
  switch (status) {
    case 'on_track': return 'On Track'
    case 'at_risk': return 'At Risk'
    case 'blocked': return 'Blocked'
    case 'completed': return 'Completed'
    default: return status
  }
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1000) return `$${Math.round(value / 1000)}K`
  return `$${value}`
}

const engagementFilters = [
  { key: 'all', label: 'All' },
  { key: 'on_track', label: 'On Track' },
  { key: 'at_risk', label: 'At Risk' },
  { key: 'blocked', label: 'Blocked' },
  { key: 'completed', label: 'Completed' },
]

export default function Operations() {
  const engagements = useMemo(() => getEngagements(), [])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredEngagements = useMemo(() => {
    return engagements.filter((eng) => {
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        eng.organizationName.toLowerCase().includes(q) ||
        eng.type.toLowerCase().includes(q) ||
        eng.consultant.toLowerCase().includes(q)
      const matchesStatus = statusFilter === 'all' || eng.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [engagements, search, statusFilter])

  const summaryStats = useMemo(() => {
    const totalHoursUsed = engagements.reduce((s, e) => s + e.hoursUsed, 0)
    const totalHoursBudget = engagements.reduce((s, e) => s + e.hoursBudget, 0)
    const totalRevenue = engagements.reduce((s, e) => s + e.revenue, 0)
    const avgUtil = totalHoursBudget > 0 ? Math.round((totalHoursUsed / totalHoursBudget) * 100) : 0

    return [
      { label: 'Total Engagements', value: String(engagements.length), icon: Activity, color: 'bg-forge-teal-subtle text-forge-teal' },
      { label: 'Total Hours', value: `${totalHoursUsed} / ${totalHoursBudget}`, icon: Clock, color: 'bg-forge-info/8 text-forge-info' },
      { label: 'Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'bg-forge-success/8 text-forge-success' },
      { label: 'Avg Utilization', value: `${avgUtil}%`, icon: Users, color: 'bg-forge-warning/8 text-forge-warning' },
    ]
  }, [engagements])

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

      <SearchFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search engagements..."
        filters={engagementFilters}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

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
              <th scope="col" className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Customer</th>
              <th scope="col" className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Type</th>
              <th scope="col" className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Consultant</th>
              <th scope="col" className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Hours</th>
              <th scope="col" className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Status</th>
              <th scope="col" className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {filteredEngagements.map((eng) => (
              <tr key={eng.id} className="border-b border-forge-border/60 last:border-0 hover:bg-forge-bg/30 transition-colors">
                <td className="py-3 px-4 text-sm font-medium text-forge-text">{eng.organizationName}</td>
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
                <td className="py-3 px-4"><Badge variant={statusVariant(eng.status)} dot>{statusLabel(eng.status)}</Badge></td>
                <td className="py-3 px-4 text-sm font-semibold text-forge-teal">{formatCurrency(eng.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

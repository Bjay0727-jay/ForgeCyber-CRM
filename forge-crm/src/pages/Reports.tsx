import { BarChart3, TrendingUp, PieChart, FileText } from 'lucide-react'
import Card from '../components/Card'

const metrics = [
  { label: 'Assessments Completed', value: '142', change: '+18% YoY', icon: BarChart3, color: 'bg-forge-teal-subtle text-forge-teal' },
  { label: 'Avg Engagement Time', value: '18 days', change: '-12% improvement', icon: TrendingUp, color: 'bg-forge-success/8 text-forge-success' },
  { label: 'Client Retention', value: '94%', change: '+3% from last quarter', icon: PieChart, color: 'bg-forge-info/8 text-forge-info' },
  { label: 'Reports Generated', value: '397', change: '+24% this quarter', icon: FileText, color: 'bg-forge-warning/8 text-forge-warning' },
]

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-white rounded-xl border border-forge-border shadow-sm p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${metric.color}`}>
              <metric.icon size={20} />
            </div>
            <p className="text-xs text-forge-text-muted mb-1">{metric.label}</p>
            <p className="text-xl font-semibold text-forge-text">{metric.value}</p>
            <p className="text-xs text-forge-success mt-1.5">{metric.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card title="Revenue by Service Type">
          <div className="space-y-4">
            {[
              { name: 'Security Assessments', value: '$485K', pct: 38 },
              { name: 'CMMC Compliance', value: '$320K', pct: 25 },
              { name: 'Penetration Testing', value: '$245K', pct: 19 },
              { name: 'Managed Services', value: '$180K', pct: 14 },
              { name: 'Training & Advisory', value: '$52K', pct: 4 },
            ].map((item) => (
              <div key={item.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-forge-text">{item.name}</span>
                  <span className="text-forge-text-muted">{item.value} ({item.pct}%)</span>
                </div>
                <div className="h-1.5 bg-forge-bg rounded-full overflow-hidden">
                  <div className="h-full bg-forge-teal rounded-full" style={{ width: `${item.pct * 2.5}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Assessment Pipeline">
          <div className="space-y-3.5">
            {[
              { name: 'Completed', count: 142, color: 'bg-forge-success' },
              { name: 'In Progress', count: 8, color: 'bg-forge-teal' },
              { name: 'Scheduled', count: 12, color: 'bg-forge-info' },
              { name: 'Pending Review', count: 6, color: 'bg-forge-warning' },
              { name: 'Blocked', count: 2, color: 'bg-forge-danger' },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                <span className="flex-1 text-sm text-forge-text">{item.name}</span>
                <span className="text-sm font-semibold text-forge-text">{item.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-forge-border text-center">
            <span className="text-xs text-forge-text-faint">Charts and analytics dashboard coming in v2.0</span>
          </div>
        </Card>
      </div>
    </div>
  )
}

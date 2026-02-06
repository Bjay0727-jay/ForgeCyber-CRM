import { BarChart3, TrendingUp, PieChart, FileText } from 'lucide-react'

const metrics = [
  { label: 'Assessments Completed', value: '142', change: '+18% YoY', icon: BarChart3, color: 'bg-forge-teal-glow text-forge-teal' },
  { label: 'Avg. Engagement Time', value: '18 days', change: '-12% improvement', icon: TrendingUp, color: 'bg-forge-success/10 text-forge-success' },
  { label: 'Client Retention', value: '94%', change: '+3% from last quarter', icon: PieChart, color: 'bg-forge-info/10 text-forge-info' },
  { label: 'Reports Generated', value: '397', change: '+24% this quarter', icon: FileText, color: 'bg-forge-warning/10 text-forge-warning' },
]

export default function Reports() {
  return (
    <div>
      <div className="grid grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-white rounded-2xl border border-forge-border p-6 hover:shadow-lg hover:-translate-y-1 hover:border-forge-teal transition-all">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${metric.color}`}>
              <metric.icon size={24} />
            </div>
            <div className="text-[13px] text-forge-text-muted font-medium mb-2">{metric.label}</div>
            <div className="font-heading text-[32px] font-bold text-forge-navy">{metric.value}</div>
            <div className="text-[13px] text-forge-success flex items-center gap-1 mt-2">{metric.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-forge-border overflow-hidden">
          <div className="px-6 py-5 border-b border-forge-border flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-forge-navy">Revenue by Service Type</h3>
          </div>
          <div className="p-6">
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
                    <span className="font-medium text-forge-navy">{item.name}</span>
                    <span className="text-forge-text-muted">{item.value} ({item.pct}%)</span>
                  </div>
                  <div className="h-2 bg-forge-bg rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-forge-teal to-forge-teal-light rounded-full" style={{ width: `${item.pct * 2.5}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-forge-border overflow-hidden">
          <div className="px-6 py-5 border-b border-forge-border flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-forge-navy">Assessment Pipeline</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { name: 'Completed', count: 142, color: 'bg-forge-success' },
                { name: 'In Progress', count: 8, color: 'bg-forge-teal' },
                { name: 'Scheduled', count: 12, color: 'bg-forge-info' },
                { name: 'Pending Review', count: 6, color: 'bg-forge-warning' },
                { name: 'Blocked', count: 2, color: 'bg-forge-danger' },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="flex-1 text-sm font-medium text-forge-navy">{item.name}</span>
                  <span className="text-sm font-heading font-bold text-forge-navy">{item.count}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-forge-border text-center">
              <span className="text-[13px] text-forge-text-muted">Full analytics dashboard with charts coming in v2.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

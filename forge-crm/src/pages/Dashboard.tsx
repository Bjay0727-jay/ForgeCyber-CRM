import {
  Users,
  ClipboardCheck,
  FileText,
  DollarSign,
  CheckCircle2,
  PlusCircle,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react'
import { dashboardStats, engagements, activities } from '../data/mockData'
import Badge from '../components/Badge'
import Card from '../components/Card'

const iconMap: Record<string, React.ReactNode> = {
  users: <Users size={24} />,
  'clipboard-check': <ClipboardCheck size={24} />,
  'file-text': <FileText size={24} />,
  'dollar-sign': <DollarSign size={24} />,
}

const iconColorMap: Record<string, string> = {
  users: 'bg-forge-teal-glow text-forge-teal',
  'clipboard-check': 'bg-forge-teal-glow text-forge-teal',
  'file-text': 'bg-forge-bg text-forge-navy',
  'dollar-sign': 'bg-forge-bg text-forge-navy',
}

const activityIcons: Record<string, { icon: React.ReactNode; color: string }> = {
  complete: { icon: <CheckCircle2 size={18} />, color: 'text-forge-teal bg-forge-teal-glow' },
  create: { icon: <PlusCircle size={18} />, color: 'text-forge-success bg-forge-success/10' },
  update: { icon: <RefreshCw size={18} />, color: 'text-forge-info bg-forge-info/10' },
  alert: { icon: <AlertTriangle size={18} />, color: 'text-forge-danger bg-forge-danger/10' },
}

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {dashboardStats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl p-6 border ${
              stat.highlight
                ? 'bg-forge-navy text-white border-forge-navy'
                : 'bg-white border-forge-border hover:shadow-lg hover:-translate-y-1 hover:border-forge-teal transition-all'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                stat.highlight
                  ? 'bg-white/15'
                  : iconColorMap[stat.icon] || 'bg-forge-bg text-forge-navy'
              }`}
            >
              {iconMap[stat.icon]}
            </div>
            <p className={`text-sm font-medium mb-1 ${stat.highlight ? 'text-white/80' : 'text-forge-text-muted'}`}>
              {stat.label}
            </p>
            <p className="font-heading text-[32px] font-bold leading-tight">
              {stat.value}
            </p>
            <p className={`text-sm mt-2 ${
              stat.highlight
                ? 'text-white/70'
                : stat.positive
                  ? 'text-forge-success'
                  : stat.positive === false
                    ? 'text-forge-danger'
                    : 'text-forge-text-muted'
            }`}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6" style={{ gridTemplateColumns: '2fr 1fr' }}>
        {/* Active Engagements */}
        <Card
          title="Active Engagements"
          noPadding
          action={
            <button className="px-4 py-2 rounded-xl text-sm font-semibold border border-forge-border text-forge-navy hover:bg-forge-bg transition-colors">
              View All
            </button>
          }
        >
          <table className="w-full">
            <thead>
              <tr className="bg-forge-bg">
                <th className="text-left uppercase text-[11px] font-semibold text-forge-text-muted py-3 px-5 tracking-wider">Customer</th>
                <th className="text-left uppercase text-[11px] font-semibold text-forge-text-muted py-3 px-5 tracking-wider">Engagement Type</th>
                <th className="text-left uppercase text-[11px] font-semibold text-forge-text-muted py-3 px-5 tracking-wider">Status</th>
                <th className="text-left uppercase text-[11px] font-semibold text-forge-text-muted py-3 px-5 tracking-wider">Consultant</th>
                <th className="text-left uppercase text-[11px] font-semibold text-forge-text-muted py-3 px-5 tracking-wider">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {engagements.map((eng) => (
                <tr key={eng.customer} className="border-b border-forge-border hover:bg-forge-teal/[0.03] transition-colors">
                  <td className="py-4 px-5 font-semibold text-forge-navy text-sm">{eng.customer}</td>
                  <td className="py-4 px-5 text-sm text-forge-text-muted">{eng.type}</td>
                  <td className="py-4 px-5"><Badge variant={eng.statusType} dot>{eng.status}</Badge></td>
                  <td className="py-4 px-5 text-sm text-forge-text-muted">{eng.consultant}</td>
                  <td className="py-4 px-5 text-sm text-forge-text-muted">{eng.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Recent Activity */}
        <Card title="Recent Activity">
          <div className="space-y-5">
            {activities.map((activity, idx) => {
              const style = activityIcons[activity.type]
              return (
                <div key={idx} className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${style.color}`}>
                    {style.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-forge-navy leading-relaxed" dangerouslySetInnerHTML={{ __html: activity.text }} />
                    <p className="text-xs text-forge-text-muted mt-1">{activity.time}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import {
  Users,
  ClipboardCheck,
  FileText,
  DollarSign,
  CheckCircle2,
  PlusCircle,
  RefreshCw,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
} from 'lucide-react'
import { dashboardStats, engagements, activities } from '../data/mockData'
import Badge from '../components/Badge'
import Card from '../components/Card'

const iconMap: Record<string, React.ReactNode> = {
  users: <Users size={20} />,
  'clipboard-check': <ClipboardCheck size={20} />,
  'file-text': <FileText size={20} />,
  'dollar-sign': <DollarSign size={20} />,
}

const iconBgMap: Record<string, string> = {
  users: 'bg-forge-teal-subtle text-forge-teal',
  'clipboard-check': 'bg-forge-info/8 text-forge-info',
  'file-text': 'bg-forge-warning/8 text-forge-warning',
  'dollar-sign': 'bg-forge-success/8 text-forge-success',
}

const cardAccent: Record<string, string> = {
  users: 'from-teal-500 via-emerald-400 to-transparent',
  'clipboard-check': 'from-blue-500 via-indigo-400 to-transparent',
  'file-text': 'from-amber-500 via-orange-400 to-transparent',
  'dollar-sign': 'from-emerald-500 via-green-400 to-transparent',
}

const activityIcons: Record<string, { icon: React.ReactNode; color: string }> = {
  complete: { icon: <CheckCircle2 size={16} />, color: 'text-forge-teal bg-forge-teal-subtle' },
  create: { icon: <PlusCircle size={16} />, color: 'text-forge-success bg-forge-success/8' },
  update: { icon: <RefreshCw size={16} />, color: 'text-forge-info bg-forge-info/8' },
  alert: { icon: <AlertTriangle size={16} />, color: 'text-forge-danger bg-forge-danger/8' },
}

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {dashboardStats.map((stat) => (
          <button
            key={stat.label}
            onClick={() => stat.link && navigate(stat.link)}
            className="group bg-white rounded-xl border border-forge-border shadow-sm overflow-hidden text-left hover:shadow-lg hover:-translate-y-0.5 hover:border-forge-teal/20 transition-all duration-200 cursor-pointer"
          >
            <div className={`h-1 bg-gradient-to-r ${cardAccent[stat.icon] || 'from-forge-border to-transparent'}`} />
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${iconBgMap[stat.icon] || 'bg-forge-bg text-forge-text-muted'}`}>
                  {iconMap[stat.icon]}
                </div>
                <div className="flex items-center gap-2">
                  {stat.positive !== null && (
                    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${stat.positive ? 'text-forge-success' : 'text-forge-danger'}`}>
                      {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {stat.change}
                    </span>
                  )}
                  <ChevronRight size={14} className="text-forge-text-faint opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
              <p className="text-2xl font-bold text-forge-text tracking-tight group-hover:text-forge-teal transition-colors">{stat.value}</p>
              <p className="text-xs text-forge-text-muted mt-1 font-medium">{stat.label}</p>
              {stat.positive === null && (
                <p className="text-xs text-forge-text-faint mt-1">{stat.change}</p>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 380px' }}>
        {/* Active Engagements */}
        <Card
          title="Active Engagements"
          noPadding
          action={
            <button
              onClick={() => navigate('/workflow')}
              className="text-xs font-medium text-forge-teal hover:text-forge-teal/80 transition-colors inline-flex items-center gap-1"
            >
              View All
              <ChevronRight size={12} />
            </button>
          }
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-forge-border bg-forge-bg/50">
                <th className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-5">Customer</th>
                <th className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-5">Type</th>
                <th className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-5">Status</th>
                <th className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-5">Consultant</th>
                <th className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-5">Due</th>
              </tr>
            </thead>
            <tbody>
              {engagements.map((eng) => (
                <tr key={eng.customer} className="border-b border-forge-border/60 last:border-0 hover:bg-forge-bg/30 transition-colors cursor-pointer">
                  <td className="py-3 px-5 text-sm font-medium text-forge-text">{eng.customer}</td>
                  <td className="py-3 px-5 text-sm text-forge-text-muted">{eng.type}</td>
                  <td className="py-3 px-5"><Badge variant={eng.statusType} dot>{eng.status}</Badge></td>
                  <td className="py-3 px-5 text-sm text-forge-text-muted">{eng.consultant}</td>
                  <td className="py-3 px-5 text-sm text-forge-text-muted">{eng.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Recent Activity */}
        <Card title="Recent Activity">
          <div className="space-y-4">
            {activities.map((activity, idx) => {
              const style = activityIcons[activity.type]
              return (
                <div key={idx} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${style.color}`}>
                    {style.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-forge-text leading-relaxed" dangerouslySetInnerHTML={{ __html: activity.text }} />
                    <p className="text-xs text-forge-text-faint mt-0.5">{activity.time}</p>
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

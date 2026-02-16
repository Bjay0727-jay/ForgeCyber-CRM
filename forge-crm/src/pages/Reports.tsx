import { useMemo } from 'react'
import { BarChart3, TrendingUp, PieChart, FileText } from 'lucide-react'
import { getAssessments } from '../lib/api'
import PipelineChart from '../components/charts/PipelineChart'
import RevenueByServiceChart from '../components/charts/RevenueByServiceChart'
import AssessmentProgressChart from '../components/charts/AssessmentProgressChart'
import TeamUtilizationChart from '../components/charts/TeamUtilizationChart'

export default function Reports() {
  const assessmentsCompleted = useMemo(() => {
    return getAssessments().filter((a) => a.status === 'completed').length
  }, [])

  const metrics = useMemo(
    () => [
      {
        label: 'Assessments Completed',
        value: String(assessmentsCompleted),
        change: '+18% YoY',
        icon: BarChart3,
        color: 'bg-forge-teal-subtle text-forge-teal',
      },
      {
        label: 'Avg Engagement Time',
        value: '18 days',
        change: '-12% improvement',
        icon: TrendingUp,
        color: 'bg-forge-success/8 text-forge-success',
      },
      {
        label: 'Client Retention',
        value: '94%',
        change: '+3% from last quarter',
        icon: PieChart,
        color: 'bg-forge-info/8 text-forge-info',
      },
      {
        label: 'Reports Generated',
        value: '397',
        change: '+24% this quarter',
        icon: FileText,
        color: 'bg-forge-warning/8 text-forge-warning',
      },
    ],
    [assessmentsCompleted]
  )

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-white rounded-xl border border-forge-border shadow-sm p-5"
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${metric.color}`}
            >
              <metric.icon size={20} />
            </div>
            <p className="text-xs text-forge-text-muted mb-1">{metric.label}</p>
            <p className="text-xl font-semibold text-forge-text">
              {metric.value}
            </p>
            <p className="text-xs text-forge-success mt-1.5">{metric.change}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        <PipelineChart />
        <RevenueByServiceChart />
        <AssessmentProgressChart />
        <TeamUtilizationChart />
      </div>
    </div>
  )
}

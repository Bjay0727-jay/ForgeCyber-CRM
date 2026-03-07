import { useMemo } from 'react'
import { BarChart3, TrendingUp, PieChart, FileText, AlertTriangle } from 'lucide-react'
import { getAssessments, getEngagements } from '../lib/api'
import PipelineChart from '../components/charts/PipelineChart'
import RevenueByServiceChart from '../components/charts/RevenueByServiceChart'
import AssessmentProgressChart from '../components/charts/AssessmentProgressChart'
import TeamUtilizationChart from '../components/charts/TeamUtilizationChart'

export default function Reports() {
  const assessmentsCompleted = useMemo(() => {
    return getAssessments().filter((a) => a.status === 'completed').length
  }, [])

  const totalAssessments = useMemo(() => getAssessments().length, [])

  const avgEngagementDays = useMemo(() => {
    const engagements = getEngagements()
    if (engagements.length === 0) return 'N/A'
    const totalHours = engagements.reduce((sum, e) => sum + e.hoursUsed, 0)
    const avgDays = Math.round(totalHours / engagements.length / 8)
    return `${avgDays} days`
  }, [])

  const metrics = useMemo(
    () => [
      {
        label: 'Assessments Completed',
        value: String(assessmentsCompleted),
        change: `${totalAssessments} total`,
        icon: BarChart3,
        color: 'bg-forge-teal-subtle text-forge-teal',
        isDemo: false,
      },
      {
        label: 'Avg Engagement Time',
        value: avgEngagementDays,
        change: 'based on hours logged',
        icon: TrendingUp,
        color: 'bg-forge-success/8 text-forge-success',
        isDemo: false,
      },
      {
        label: 'Client Retention',
        value: '94%',
        change: 'Demo data',
        icon: PieChart,
        color: 'bg-forge-info/8 text-forge-info',
        isDemo: true,
      },
      {
        label: 'Reports Generated',
        value: String(assessmentsCompleted),
        change: 'from completed assessments',
        icon: FileText,
        color: 'bg-forge-warning/8 text-forge-warning',
        isDemo: false,
      },
    ],
    [assessmentsCompleted, totalAssessments, avgEngagementDays]
  )

  return (
    <div className="space-y-6">
      {/* Demo Data Banner */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg">
        <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
        <p className="text-sm text-amber-800">
          Some metrics are based on seed data. Connect a backend data source for production-accurate reporting.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PipelineChart />
        <RevenueByServiceChart />
        <AssessmentProgressChart />
        <TeamUtilizationChart />
      </div>
    </div>
  )
}

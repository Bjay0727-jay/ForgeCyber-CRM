import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import Card from '../Card'
import { getAssessments } from '../../lib/api'

interface AssessmentData {
  name: string
  progress: number
  color: string
}

function getBarColor(progress: number): string {
  if (progress > 80) return '#059669' // green
  if (progress >= 40) return '#0D9488' // teal
  return '#D97706' // amber
}

interface TooltipPayloadEntry {
  payload: AssessmentData
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: TooltipPayloadEntry[]
}) {
  if (!active || !payload || payload.length === 0) return null
  const data = payload[0].payload
  return (
    <div className="bg-white border border-forge-border rounded-lg shadow-lg px-3 py-2 text-sm">
      <p className="font-semibold text-forge-text">{data.name}</p>
      <p className="text-forge-text-muted">
        Progress:{' '}
        <span className="font-medium text-forge-text">{data.progress}%</span>
      </p>
    </div>
  )
}

export default function AssessmentProgressChart() {
  const data = useMemo<AssessmentData[]>(() => {
    const assessments = getAssessments()
    return assessments.map((a) => ({
      name: a.organizationName,
      progress: a.progress,
      color: getBarColor(a.progress),
    }))
  }, [])

  return (
    <Card title="Assessment Progress">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 24, left: 8, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              horizontal={false}
            />
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(v: number) => `${v}%`}
              tick={{ fontSize: 12, fill: '#64748B' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={140}
              tick={{ fontSize: 11, fill: '#64748B' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="progress" radius={[0, 4, 4, 0]} maxBarSize={28}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

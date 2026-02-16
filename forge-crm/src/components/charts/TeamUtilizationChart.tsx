import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts'
import Card from '../Card'
import { getTeamMembers } from '../../lib/api'

interface MemberData {
  name: string
  utilization: number
  color: string
}

function getBarColor(utilization: number): string {
  if (utilization > 90) return '#DC2626' // red
  if (utilization >= 75) return '#D97706' // amber
  return '#0D9488' // teal
}

interface TooltipPayloadEntry {
  payload: MemberData
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
        Utilization:{' '}
        <span className="font-medium text-forge-text">{data.utilization}%</span>
      </p>
    </div>
  )
}

export default function TeamUtilizationChart() {
  const data = useMemo<MemberData[]>(() => {
    const members = getTeamMembers()
    return members.map((m) => ({
      name: m.name.split(' ')[0], // first name only for compact X-axis
      utilization: m.utilization,
      color: getBarColor(m.utilization),
    }))
  }, [])

  return (
    <Card title="Team Utilization">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 16, left: 8, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: '#64748B' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 110]}
              tickFormatter={(v: number) => `${v}%`}
              tick={{ fontSize: 12, fill: '#64748B' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={100}
              stroke="#DC2626"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: '100%',
                position: 'right',
                fill: '#DC2626',
                fontSize: 11,
              }}
            />
            <Bar dataKey="utilization" radius={[4, 4, 0, 0]} maxBarSize={40}>
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

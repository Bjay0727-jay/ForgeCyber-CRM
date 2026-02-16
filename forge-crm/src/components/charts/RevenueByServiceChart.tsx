import { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import Card from '../Card'
import { getEngagements } from '../../lib/api'

interface ServiceData {
  name: string
  value: number
}

const COLORS = ['#0D9488', '#2563EB', '#D97706', '#7C3AED', '#059669', '#DC2626', '#F59E0B', '#6366F1']

const formatCurrency = (value: number): string => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`
  return `$${value}`
}

interface TooltipPayloadEntry {
  name: string
  value: number
  payload: ServiceData & { fill: string }
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: TooltipPayloadEntry[]
}) {
  if (!active || !payload || payload.length === 0) return null
  const entry = payload[0]
  return (
    <div className="bg-white border border-forge-border rounded-lg shadow-lg px-3 py-2 text-sm">
      <p className="font-semibold text-forge-text">{entry.name}</p>
      <p className="text-forge-text-muted">
        Revenue:{' '}
        <span className="font-medium text-forge-text">
          {formatCurrency(entry.value)}
        </span>
      </p>
    </div>
  )
}

export default function RevenueByServiceChart() {
  const data = useMemo<ServiceData[]>(() => {
    const engagements = getEngagements()
    const grouped = new Map<string, number>()

    for (const eng of engagements) {
      const current = grouped.get(eng.type) ?? 0
      grouped.set(eng.type, current + eng.revenue)
    }

    return Array.from(grouped.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [])

  return (
    <Card title="Revenue by Service Type">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={90}
              dataKey="value"
              nameKey="name"
              paddingAngle={2}
              stroke="none"
            >
              {data.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              formatter={(value: string) => (
                <span className="text-xs text-forge-text-muted">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

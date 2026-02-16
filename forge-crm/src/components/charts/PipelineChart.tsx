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
import { getOpportunities } from '../../lib/api'
import type { Opportunity } from '../../types'

interface StageData {
  stage: string
  label: string
  count: number
  value: number
  color: string
}

const STAGE_CONFIG: Record<
  Opportunity['stage'],
  { label: string; color: string; order: number }
> = {
  lead: { label: 'Lead', color: '#0D9488', order: 0 },
  assessment: { label: 'Assessment', color: '#2563EB', order: 1 },
  proposal: { label: 'Proposal', color: '#D97706', order: 2 },
  negotiation: { label: 'Negotiation', color: '#7C3AED', order: 3 },
  closed_won: { label: 'Closed Won', color: '#059669', order: 4 },
  closed_lost: { label: 'Closed Lost', color: '#94A3B8', order: 5 },
}

const formatCurrency = (value: number): string => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`
  return `$${value}`
}

interface TooltipPayloadEntry {
  payload: StageData
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
      <p className="font-semibold text-forge-text">{data.label}</p>
      <p className="text-forge-text-muted">
        Count: <span className="font-medium text-forge-text">{data.count}</span>
      </p>
      <p className="text-forge-text-muted">
        Value:{' '}
        <span className="font-medium text-forge-text">
          {formatCurrency(data.value)}
        </span>
      </p>
    </div>
  )
}

export default function PipelineChart() {
  const data = useMemo<StageData[]>(() => {
    const opportunities = getOpportunities()
    const grouped = new Map<
      string,
      { count: number; value: number; label: string; color: string; order: number }
    >()

    // Initialize all displayed stages
    for (const [stage, config] of Object.entries(STAGE_CONFIG)) {
      if (stage === 'closed_lost') continue // skip closed_lost from chart
      grouped.set(stage, {
        count: 0,
        value: 0,
        label: config.label,
        color: config.color,
        order: config.order,
      })
    }

    for (const opp of opportunities) {
      const entry = grouped.get(opp.stage)
      if (entry) {
        entry.count += 1
        entry.value += opp.value
      }
    }

    return Array.from(grouped.entries())
      .map(([stage, entry]) => ({
        stage,
        label: entry.label,
        count: entry.count,
        value: entry.value,
        color: entry.color,
      }))
      .sort((a, b) => {
        const orderA = STAGE_CONFIG[a.stage as Opportunity['stage']]?.order ?? 99
        const orderB = STAGE_CONFIG[b.stage as Opportunity['stage']]?.order ?? 99
        return orderA - orderB
      })
  }, [])

  return (
    <Card title="Pipeline by Stage">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 16, left: 8, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: '#64748B' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12, fill: '#64748B' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={48}>
              {data.map((entry) => (
                <Cell key={entry.stage} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

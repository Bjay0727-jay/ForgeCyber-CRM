import { useState, useMemo } from 'react'
import { Plus, Filter, GripVertical } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core'
import type { DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { getOpportunities, getOrganizations, updateOpportunityStage } from '../lib/api'
import type { Opportunity } from '../types'
import Badge from '../components/Badge'
import Card from '../components/Card'

// ─── Shared Types ────────────────────────────────────────────────────────────

interface PipelineCard {
  id: string
  name: string
  meta: string
  value: string
}

interface PipelineColumn {
  id: string
  title: string
  colorClass: string
  cards: PipelineCard[]
}

type Tab = 'pipeline' | 'customers' | 'opportunities'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'teal' | 'navy'

// ─── Constants ───────────────────────────────────────────────────────────────

const STAGE_DISPLAY: Record<string, string> = {
  lead: 'Lead',
  assessment: 'Assessment',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  closed_won: 'Closed Won',
  closed_lost: 'Closed Lost',
}

const COLUMN_ORDER: Opportunity['stage'][] = [
  'lead',
  'assessment',
  'proposal',
  'negotiation',
  'closed_won',
]

const COLUMN_COLOR: Record<string, string> = {
  lead: 'border-forge-info',
  assessment: 'border-forge-warning',
  proposal: 'border-forge-teal',
  negotiation: 'border-forge-purple',
  closed_won: 'border-forge-success',
}

const columnAccent: Record<string, string> = {
  Lead: 'bg-forge-info',
  Assessment: 'bg-forge-warning',
  Proposal: 'bg-forge-teal',
  Negotiation: 'bg-forge-purple',
  'Closed Won': 'bg-forge-success',
}

const STAGE_BADGE_VARIANT: Record<string, BadgeVariant> = {
  lead: 'info',
  assessment: 'warning',
  proposal: 'teal',
  negotiation: 'navy',
  closed_won: 'success',
  closed_lost: 'danger',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    const m = value / 1_000_000
    return `$${Number.isInteger(m) ? m : m.toFixed(1)}M`
  }
  if (value >= 1_000) {
    const k = value / 1_000
    return `$${Number.isInteger(k) ? k : Math.round(k)}K`
  }
  return `$${value}`
}

function formatDate(iso: string): string {
  if (!iso) return ''
  const date = new Date(iso)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function buildInitialColumns(): PipelineColumn[] {
  const opportunities = getOpportunities()
  const grouped: Record<string, Opportunity[]> = {}

  for (const stage of COLUMN_ORDER) {
    grouped[stage] = []
  }

  for (const opp of opportunities) {
    if (grouped[opp.stage]) {
      grouped[opp.stage].push(opp)
    }
  }

  return COLUMN_ORDER.map((stage) => ({
    id: stage,
    title: STAGE_DISPLAY[stage],
    colorClass: COLUMN_COLOR[stage],
    cards: (grouped[stage] ?? []).map((opp) => ({
      id: opp.id,
      name: opp.organizationName,
      meta: [opp.sector, opp.description].filter(Boolean).join(' \u2022 '),
      value: formatCurrency(opp.value),
    })),
  }))
}

// ─── Sortable Card ───────────────────────────────────────────────────────────

interface SortableCardProps {
  card: PipelineCard
  isDragOverlay?: boolean
}

function SortableCard({ card, isDragOverlay }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        bg-white rounded-lg border border-forge-border p-3 cursor-grab transition-shadow
        ${isDragging ? 'opacity-40 shadow-md' : 'hover:shadow-sm'}
        ${isDragOverlay ? 'shadow-lg rotate-1' : ''}
      `}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start gap-2">
        <GripVertical size={14} className="text-forge-text-faint mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-forge-text mb-0.5">{card.name}</p>
          <p className="text-xs text-forge-text-muted mb-2">{card.meta}</p>
          <p className="text-sm font-semibold text-forge-teal">{card.value}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Droppable Column ────────────────────────────────────────────────────────

interface DroppableColumnProps {
  column: PipelineColumn
  isOverColumn: boolean
}

function DroppableColumn({ column, isOverColumn }: DroppableColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id })
  const cardIds = column.cards.map((c) => c.id)

  return (
    <div className="min-w-[240px] space-y-2">
      <div className="bg-white rounded-lg border border-forge-border shadow-sm p-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${columnAccent[column.title] ?? 'bg-forge-info'}`} />
          <h3 className="text-sm font-medium text-forge-text flex-1">{column.title}</h3>
          <span className="text-xs font-medium text-forge-text-faint bg-forge-bg px-2 py-0.5 rounded">
            {column.cards.length}
          </span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`bg-forge-bg/60 rounded-lg p-2 min-h-[80px] space-y-2 transition-colors ${
          isOverColumn ? 'bg-forge-teal-subtle ring-1 ring-forge-teal/20' : ''
        }`}
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {column.cards.map((card) => (
            <SortableCard key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function CRM() {
  const [activeTab, setActiveTab] = useState<Tab>('pipeline')
  const [sectorFilter, setSectorFilter] = useState('all')
  const [columns, setColumns] = useState<PipelineColumn[]>(buildInitialColumns)
  const [activeCard, setActiveCard] = useState<PipelineCard | null>(null)
  const [overColumnId, setOverColumnId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const tabs: { key: Tab; label: string }[] = [
    { key: 'pipeline', label: 'Pipeline' },
    { key: 'customers', label: 'Customers' },
    { key: 'opportunities', label: 'Opportunities' },
  ]

  // ─── Customers data derived from API ─────────────────────────────────────

  const organizations = useMemo(() => getOrganizations(), [])
  const allOpportunities = useMemo(() => getOpportunities(), [])

  const customerRows = useMemo(() => {
    return organizations.map((org) => {
      const orgOpps = allOpportunities.filter((o) => o.organizationId === org.id)
      const primaryOpp = orgOpps[0]
      const stage = primaryOpp?.stage ?? 'lead'

      return {
        id: org.id,
        initials: org.name.slice(0, 2).toUpperCase(),
        name: org.name,
        detail: [org.sector, org.cityStateZip].filter(Boolean).join(' \u2022 '),
        stage: STAGE_DISPLAY[stage] ?? 'Lead',
        stageType: STAGE_BADGE_VARIANT[stage] ?? ('info' as BadgeVariant),
        lastContact: formatDate(org.createdAt),
      }
    })
  }, [organizations, allOpportunities])

  const sectors = useMemo(() => {
    const unique = new Set(organizations.map((o) => o.sector).filter(Boolean))
    return Array.from(unique).sort()
  }, [organizations])

  const filteredCustomers =
    sectorFilter === 'all'
      ? customerRows
      : customerRows.filter((c) =>
          c.detail.toLowerCase().includes(sectorFilter.toLowerCase())
        )

  // ─── DnD helpers ─────────────────────────────────────────────────────────

  function findColumnByCardId(cardId: string): PipelineColumn | undefined {
    return columns.find((col) => col.cards.some((c) => c.id === cardId))
  }

  function findCardById(cardId: string): PipelineCard | undefined {
    for (const col of columns) {
      const card = col.cards.find((c) => c.id === cardId)
      if (card) return card
    }
    return undefined
  }

  function isColumnId(id: string): boolean {
    return columns.some((col) => col.id === id)
  }

  function handleDragStart(event: DragStartEvent) {
    const card = findCardById(event.active.id as string)
    if (card) setActiveCard(card)
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) { setOverColumnId(null); return }

    const activeId = active.id as string
    const overId = over.id as string
    const sourceColumn = findColumnByCardId(activeId)
    if (!sourceColumn) return

    let destColumn: PipelineColumn | undefined
    if (isColumnId(overId)) {
      destColumn = columns.find((col) => col.id === overId)
    } else {
      destColumn = findColumnByCardId(overId)
    }

    if (!destColumn) { setOverColumnId(null); return }
    setOverColumnId(destColumn.id)
    if (sourceColumn.id === destColumn.id) return

    setColumns((prev) => {
      const newColumns = prev.map((col) => ({ ...col, cards: [...col.cards] }))
      const srcCol = newColumns.find((c) => c.id === sourceColumn.id)!
      const dstCol = newColumns.find((c) => c.id === destColumn.id)!
      const srcIndex = srcCol.cards.findIndex((c) => c.id === activeId)
      if (srcIndex === -1) return prev
      const [movedCard] = srcCol.cards.splice(srcIndex, 1)
      if (isColumnId(overId)) {
        dstCol.cards.push(movedCard)
      } else {
        const overIndex = dstCol.cards.findIndex((c) => c.id === overId)
        if (overIndex === -1) dstCol.cards.push(movedCard)
        else dstCol.cards.splice(overIndex, 0, movedCard)
      }
      return newColumns
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveCard(null)
    setOverColumnId(null)
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string
    const sourceColumn = findColumnByCardId(activeId)
    if (!sourceColumn) return

    let destColumn: PipelineColumn | undefined
    if (isColumnId(overId)) {
      destColumn = columns.find((col) => col.id === overId)
    } else {
      destColumn = findColumnByCardId(overId)
    }
    if (!destColumn) return

    // Persist stage change via API
    if (sourceColumn.id !== destColumn.id) {
      updateOpportunityStage(activeId, destColumn.id as Opportunity['stage'])
    }

    if (sourceColumn.id === destColumn.id && !isColumnId(overId)) {
      const oldIndex = sourceColumn.cards.findIndex((c) => c.id === activeId)
      const newIndex = sourceColumn.cards.findIndex((c) => c.id === overId)
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        setColumns((prev) =>
          prev.map((col) => {
            if (col.id !== sourceColumn.id) return col
            return { ...col, cards: arrayMove(col.cards, oldIndex, newIndex) }
          })
        )
      }
    }
  }

  // ─── Opportunities table data ────────────────────────────────────────────

  const opportunityRows = useMemo(() => {
    return getOpportunities().map((opp) => ({
      id: opp.id,
      organization: opp.organizationName,
      stage: STAGE_DISPLAY[opp.stage] ?? opp.stage,
      stageBadge: STAGE_BADGE_VARIANT[opp.stage] ?? ('info' as BadgeVariant),
      value: formatCurrency(opp.value),
      description: opp.description,
      lastUpdated: formatDate(opp.updatedAt),
    }))
  }, [])

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* Tab Bar */}
      <div className="flex gap-1 border-b border-forge-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.key
                ? 'border-forge-teal text-forge-teal'
                : 'border-transparent text-forge-text-muted hover:text-forge-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Pipeline View */}
      {activeTab === 'pipeline' && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-5 gap-3">
            {columns.map((col) => (
              <DroppableColumn
                key={col.id}
                column={col}
                isOverColumn={overColumnId === col.id}
              />
            ))}
          </div>

          <DragOverlay>
            {activeCard ? (
              <div className="w-[230px]">
                <SortableCard card={activeCard} isDragOverlay />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Customer List */}
      {activeTab === 'customers' && (
        <Card
          title="All Customers"
          action={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-forge-text-faint" />
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-forge-border text-sm text-forge-text bg-white focus:outline-none focus:border-forge-teal appearance-none cursor-pointer"
                >
                  <option value="all">All Sectors</option>
                  {sectors.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
              </div>
              <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-forge-teal text-white text-sm font-medium hover:bg-forge-teal/90 transition-colors">
                <Plus size={15} />
                Add Customer
              </button>
            </div>
          }
        >
          <div className="space-y-2">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center gap-4 p-3.5 rounded-lg border border-forge-border hover:bg-forge-bg/50 hover:border-forge-teal/20 transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-forge-navy flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                  {customer.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-forge-text">{customer.name}</p>
                  <p className="text-xs text-forge-text-muted mt-0.5 truncate">{customer.detail}</p>
                </div>
                <Badge variant={customer.stageType}>{customer.stage}</Badge>
                <p className="text-xs text-forge-text-faint whitespace-nowrap">{customer.lastContact}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Opportunities Table */}
      {activeTab === 'opportunities' && (
        <Card title="All Opportunities">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-forge-border">
                  <th className="text-left py-2.5 px-3 font-medium text-forge-text-muted">Organization</th>
                  <th className="text-left py-2.5 px-3 font-medium text-forge-text-muted">Stage</th>
                  <th className="text-right py-2.5 px-3 font-medium text-forge-text-muted">Value</th>
                  <th className="text-left py-2.5 px-3 font-medium text-forge-text-muted">Description</th>
                  <th className="text-left py-2.5 px-3 font-medium text-forge-text-muted">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {opportunityRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-forge-border/50 hover:bg-forge-bg/50 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-medium text-forge-text">{row.organization}</td>
                    <td className="py-2.5 px-3">
                      <Badge variant={row.stageBadge}>{row.stage}</Badge>
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-forge-teal">{row.value}</td>
                    <td className="py-2.5 px-3 text-forge-text-muted truncate max-w-[260px]">{row.description}</td>
                    <td className="py-2.5 px-3 text-forge-text-faint whitespace-nowrap">{row.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

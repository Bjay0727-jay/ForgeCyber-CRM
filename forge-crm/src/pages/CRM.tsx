import { useState } from 'react'
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
import { pipelineColumns as initialPipelineColumns, customers } from '../data/mockData'
import Badge from '../components/Badge'
import Card from '../components/Card'

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

const columnAccent: Record<string, string> = {
  Lead: 'bg-forge-info',
  Assessment: 'bg-forge-warning',
  Proposal: 'bg-forge-teal',
  Negotiation: 'bg-forge-purple',
  'Closed Won': 'bg-forge-success',
}

function buildInitialColumns(): PipelineColumn[] {
  return initialPipelineColumns.map((col) => ({
    id: col.title.toLowerCase().replace(/\s+/g, '-'),
    title: col.title,
    colorClass: col.colorClass,
    cards: col.cards.map((card) => ({
      ...card,
      id: card.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    })),
  }))
}

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

  const filteredCustomers =
    sectorFilter === 'all'
      ? customers
      : customers.filter((c) =>
          c.detail.toLowerCase().includes(sectorFilter.toLowerCase())
        )

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
                  <option value="defense">Defense</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="financial">Financial</option>
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
                key={customer.name}
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

      {/* Opportunities */}
      {activeTab === 'opportunities' && (
        <Card>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-lg bg-forge-teal-subtle flex items-center justify-center mb-4">
              <Filter size={22} className="text-forge-teal" />
            </div>
            <h3 className="text-base font-semibold text-forge-text mb-1">Opportunities Coming Soon</h3>
            <p className="text-sm text-forge-text-muted max-w-md">
              Track and manage sales opportunities with pipeline analytics, win/loss tracking, and forecasting.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}

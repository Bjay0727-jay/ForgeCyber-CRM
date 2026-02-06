import { useState } from 'react';
import { Plus, Filter, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { pipelineColumns as initialPipelineColumns, customers } from '../data/mockData';
import Badge from '../components/Badge';
import Card from '../components/Card';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PipelineCard {
  id: string;
  name: string;
  meta: string;
  value: string;
}

interface PipelineColumn {
  id: string;
  title: string;
  colorClass: string;
  cards: PipelineCard[];
}

type Tab = 'pipeline' | 'customers' | 'opportunities';

// ---------------------------------------------------------------------------
// Column color mapping for top border
// ---------------------------------------------------------------------------

const columnBorderColor: Record<string, string> = {
  Lead: 'border-t-forge-info',
  Assessment: 'border-t-forge-warning',
  Proposal: 'border-t-forge-teal',
  Negotiation: 'border-t-forge-purple',
  'Closed Won': 'border-t-forge-success',
};

// ---------------------------------------------------------------------------
// Helper: build initial state from mock data, assigning unique ids
// ---------------------------------------------------------------------------

function buildInitialColumns(): PipelineColumn[] {
  return initialPipelineColumns.map((col) => ({
    id: col.title.toLowerCase().replace(/\s+/g, '-'),
    title: col.title,
    colorClass: col.colorClass,
    cards: col.cards.map((card) => ({
      ...card,
      id: card.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    })),
  }));
}

// ---------------------------------------------------------------------------
// SortableCard component
// ---------------------------------------------------------------------------

interface SortableCardProps {
  card: PipelineCard;
  isDragOverlay?: boolean;
}

function SortableCard({ card, isDragOverlay }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        bg-white rounded-xl border border-forge-border p-3.5
        transition-all duration-200 cursor-grab
        ${isDragging ? 'opacity-50 ring-2 ring-forge-teal shadow-lg' : 'hover:shadow-md hover:border-forge-teal/40'}
        ${isDragOverlay ? 'shadow-xl ring-2 ring-forge-teal rotate-[2deg]' : ''}
      `}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start gap-2">
        {/* Drag handle indicator */}
        <div className="flex-shrink-0 mt-0.5 text-forge-text-muted/40">
          <GripVertical size={14} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-forge-navy mb-1">
            {card.name}
          </p>
          <p className="text-xs text-forge-text-muted mb-3">
            {card.meta}
          </p>
          <p className="font-heading font-bold text-forge-teal">
            {card.value}
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DroppableColumn component
// ---------------------------------------------------------------------------

interface DroppableColumnProps {
  column: PipelineColumn;
  isOverColumn: boolean;
}

function DroppableColumn({ column, isOverColumn }: DroppableColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const cardIds = column.cards.map((c) => c.id);

  return (
    <div className="min-w-[260px] space-y-3">
      {/* Column Header */}
      <div
        className={`bg-white rounded-xl border border-forge-border border-t-4 ${columnBorderColor[column.title] ?? 'border-t-forge-info'} p-4`}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold text-forge-navy">
            {column.title}
          </h3>
          <span className="min-w-[24px] h-6 flex items-center justify-center rounded-full bg-forge-bg text-xs font-bold text-forge-text-muted">
            {column.cards.length}
          </span>
        </div>
      </div>

      {/* Droppable zone */}
      <div
        ref={setNodeRef}
        className={`
          bg-forge-bg rounded-xl p-2 min-h-[80px] space-y-2 transition-colors duration-200
          ${isOverColumn ? 'bg-forge-teal/5 ring-1 ring-forge-teal/20' : ''}
        `}
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {column.cards.map((card) => (
            <SortableCard key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main CRM component
// ---------------------------------------------------------------------------

export default function CRM() {
  const [activeTab, setActiveTab] = useState<Tab>('pipeline');
  const [sectorFilter, setSectorFilter] = useState('all');

  // Pipeline state
  const [columns, setColumns] = useState<PipelineColumn[]>(buildInitialColumns);
  const [activeCard, setActiveCard] = useState<PipelineCard | null>(null);
  const [overColumnId, setOverColumnId] = useState<string | null>(null);

  // Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const tabs: { key: Tab; label: string }[] = [
    { key: 'pipeline', label: 'Pipeline View' },
    { key: 'customers', label: 'Customer List' },
    { key: 'opportunities', label: 'Opportunities' },
  ];

  const filteredCustomers =
    sectorFilter === 'all'
      ? customers
      : customers.filter((c) =>
          c.detail.toLowerCase().includes(sectorFilter.toLowerCase())
        );

  // ---------------------------------------------------------------------------
  // Helpers to find column/card by id
  // ---------------------------------------------------------------------------

  function findColumnByCardId(cardId: string): PipelineColumn | undefined {
    return columns.find((col) => col.cards.some((c) => c.id === cardId));
  }

  function findCardById(cardId: string): PipelineCard | undefined {
    for (const col of columns) {
      const card = col.cards.find((c) => c.id === cardId);
      if (card) return card;
    }
    return undefined;
  }

  function isColumnId(id: string): boolean {
    return columns.some((col) => col.id === id);
  }

  // ---------------------------------------------------------------------------
  // Drag handlers
  // ---------------------------------------------------------------------------

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const card = findCardById(active.id as string);
    if (card) {
      setActiveCard(card);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) {
      setOverColumnId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Determine source column
    const sourceColumn = findColumnByCardId(activeId);
    if (!sourceColumn) return;

    // Determine destination: if overId is a column id, target that column;
    // otherwise find the column containing the overId card
    let destColumn: PipelineColumn | undefined;
    if (isColumnId(overId)) {
      destColumn = columns.find((col) => col.id === overId);
    } else {
      destColumn = findColumnByCardId(overId);
    }

    if (!destColumn) {
      setOverColumnId(null);
      return;
    }

    setOverColumnId(destColumn.id);

    // Only process cross-column moves
    if (sourceColumn.id === destColumn.id) return;

    setColumns((prev) => {
      const newColumns = prev.map((col) => ({
        ...col,
        cards: [...col.cards],
      }));

      const srcCol = newColumns.find((c) => c.id === sourceColumn.id)!;
      const dstCol = newColumns.find((c) => c.id === destColumn.id)!;

      // Remove from source
      const srcIndex = srcCol.cards.findIndex((c) => c.id === activeId);
      if (srcIndex === -1) return prev;
      const [movedCard] = srcCol.cards.splice(srcIndex, 1);

      // Insert into destination
      if (isColumnId(overId)) {
        // Dropped on column itself: append to end
        dstCol.cards.push(movedCard);
      } else {
        // Dropped on a specific card: insert at that position
        const overIndex = dstCol.cards.findIndex((c) => c.id === overId);
        if (overIndex === -1) {
          dstCol.cards.push(movedCard);
        } else {
          dstCol.cards.splice(overIndex, 0, movedCard);
        }
      }

      return newColumns;
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveCard(null);
    setOverColumnId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // If dropped on the same column, handle reordering within column
    const sourceColumn = findColumnByCardId(activeId);
    if (!sourceColumn) return;

    let destColumn: PipelineColumn | undefined;
    if (isColumnId(overId)) {
      destColumn = columns.find((col) => col.id === overId);
    } else {
      destColumn = findColumnByCardId(overId);
    }

    if (!destColumn) return;

    // Same column reorder
    if (sourceColumn.id === destColumn.id && !isColumnId(overId)) {
      const oldIndex = sourceColumn.cards.findIndex((c) => c.id === activeId);
      const newIndex = sourceColumn.cards.findIndex((c) => c.id === overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        setColumns((prev) =>
          prev.map((col) => {
            if (col.id !== sourceColumn.id) return col;
            return {
              ...col,
              cards: arrayMove(col.cards, oldIndex, newIndex),
            };
          })
        );
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Tab Bar */}
      <div className="flex gap-1 bg-forge-bg p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-white shadow-sm text-forge-teal'
                : 'text-forge-text-muted hover:text-forge-text'
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
          <div className="grid grid-cols-5 gap-4">
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
              <div className="w-[240px]">
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
            <div className="flex items-center gap-3">
              <div className="relative">
                <Filter
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-forge-text-muted"
                />
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-lg border border-forge-border text-sm text-forge-text bg-white focus:outline-none focus:border-forge-teal appearance-none cursor-pointer"
                >
                  <option value="all">All Sectors</option>
                  <option value="defense">Defense</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="financial">Financial</option>
                </select>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-forge-teal to-forge-teal-light text-white text-sm font-semibold shadow-lg shadow-forge-teal/25 hover:-translate-y-0.5 transition-all duration-200">
                <Plus size={16} />
                Add Customer
              </button>
            </div>
          }
        >
          <div className="space-y-3">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.name}
                className="flex items-center gap-4 p-4 rounded-xl border border-forge-border hover:bg-forge-bg/50 hover:border-forge-teal/30 transition-all cursor-pointer"
              >
                {/* Avatar */}
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-forge-navy to-forge-navy-light flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {customer.initials}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-forge-navy text-sm">
                    {customer.name}
                  </p>
                  <p className="text-xs text-forge-text-muted mt-0.5 truncate">
                    {customer.detail}
                  </p>
                </div>

                {/* Stage Badge */}
                <Badge variant={customer.stageType}>
                  {customer.stage}
                </Badge>

                {/* Last Contact */}
                <p className="text-xs text-forge-text-muted whitespace-nowrap">
                  {customer.lastContact}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Opportunities */}
      {activeTab === 'opportunities' && (
        <Card>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-forge-teal-glow flex items-center justify-center mb-4">
              <Filter size={28} className="text-forge-teal" />
            </div>
            <h3 className="font-heading text-lg font-bold text-forge-navy mb-2">
              Opportunities View Coming Soon
            </h3>
            <p className="text-sm text-forge-text-muted max-w-md">
              Track and manage sales opportunities with advanced pipeline analytics, win/loss tracking, and forecasting capabilities.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

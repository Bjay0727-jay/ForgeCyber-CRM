import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, LayoutDashboard, Users, UserPlus, ClipboardCheck,
  GitBranch, FileText, Briefcase, BarChart3, UsersRound,
  Settings, ArrowRight, Hash, Building2, FileCheck,
} from 'lucide-react'
import { customers, templates, activeAssessments } from '../data/mockData'

interface CommandItem {
  id: string
  label: string
  secondaryLabel?: string
  icon: React.ReactNode
  category: 'page' | 'customer' | 'template' | 'assessment'
  action: () => void
}

const categoryLabels: Record<string, string> = {
  page: 'Pages',
  customer: 'Customers',
  template: 'Templates',
  assessment: 'Assessments',
}

const categoryColors: Record<string, string> = {
  page: 'text-forge-teal',
  customer: 'text-blue-400',
  template: 'text-purple-400',
  assessment: 'text-amber-400',
}

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Build searchable items
  const allItems = useMemo<CommandItem[]>(() => {
    const pages: CommandItem[] = [
      { id: 'p-dash', label: 'Dashboard', icon: <LayoutDashboard size={16} />, category: 'page', action: () => navigate('/dashboard') },
      { id: 'p-crm', label: 'CRM / Pipeline', icon: <Users size={16} />, category: 'page', action: () => navigate('/crm') },
      { id: 'p-intake', label: 'New Customer Intake', icon: <UserPlus size={16} />, category: 'page', action: () => navigate('/intake') },
      { id: 'p-assess', label: 'Assessments', icon: <ClipboardCheck size={16} />, category: 'page', action: () => navigate('/assessments') },
      { id: 'p-work', label: 'Workflow', icon: <GitBranch size={16} />, category: 'page', action: () => navigate('/workflow') },
      { id: 'p-tmpl', label: 'Templates', icon: <FileText size={16} />, category: 'page', action: () => navigate('/templates') },
      { id: 'p-ops', label: 'Operations', icon: <Briefcase size={16} />, category: 'page', action: () => navigate('/operations') },
      { id: 'p-reports', label: 'Reports', icon: <BarChart3 size={16} />, category: 'page', action: () => navigate('/reports') },
      { id: 'p-team', label: 'Team', icon: <UsersRound size={16} />, category: 'page', action: () => navigate('/team') },
      { id: 'p-settings', label: 'Settings', icon: <Settings size={16} />, category: 'page', action: () => navigate('/settings') },
    ]

    const customerItems: CommandItem[] = customers.map(c => ({
      id: `c-${c.name}`,
      label: c.name,
      secondaryLabel: c.detail.split(' \u2022 ')[0],
      icon: <Building2 size={16} />,
      category: 'customer',
      action: () => navigate('/crm'),
    }))

    const templateItems: CommandItem[] = templates.map(t => ({
      id: `t-${t.name}`,
      label: t.name,
      secondaryLabel: `${t.sections} sections`,
      icon: <FileCheck size={16} />,
      category: 'template',
      action: () => navigate('/templates'),
    }))

    const assessmentItems: CommandItem[] = activeAssessments.map(a => ({
      id: `a-${a.customer}`,
      label: `${a.type} — ${a.customer}`,
      secondaryLabel: `${a.progress}% complete`,
      icon: <Hash size={16} />,
      category: 'assessment',
      action: () => navigate('/assessments'),
    }))

    return [...pages, ...customerItems, ...templateItems, ...assessmentItems]
  }, [navigate])

  const filtered = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 8) // show top items when empty
    const q = query.toLowerCase()
    return allItems.filter(
      item => item.label.toLowerCase().includes(q) || item.secondaryLabel?.toLowerCase().includes(q)
    ).slice(0, 12)
  }, [query, allItems])

  // Group by category
  const grouped = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {}
    for (const item of filtered) {
      if (!groups[item.category]) groups[item.category] = []
      groups[item.category].push(item)
    }
    return groups
  }, [filtered])

  // Flatten for keyboard navigation
  const flatItems = useMemo(() => filtered, [filtered])

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, flatItems.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && flatItems[selectedIndex]) {
      e.preventDefault()
      flatItems[selectedIndex].action()
      onClose()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!open) return null

  let itemIndex = 0

  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-forge-border overflow-hidden animate-scaleIn"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-forge-border">
          <Search size={18} className="text-forge-text-faint flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, customers, templates, assessments..."
            className="flex-1 text-sm text-forge-text outline-none placeholder:text-forge-text-faint bg-transparent"
          />
          <kbd className="px-2 py-0.5 rounded-md bg-forge-bg border border-forge-border text-[10px] text-forge-text-faint font-mono">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[360px] overflow-y-auto py-2">
          {flatItems.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <Search size={28} className="mx-auto text-forge-text-faint mb-2" />
              <p className="text-sm text-forge-text-muted">No results for &ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <p className={`px-5 py-1.5 text-[10px] font-bold uppercase tracking-wider ${categoryColors[category] || 'text-forge-text-faint'}`}>
                  {categoryLabels[category]}
                </p>
                {items.map((item) => {
                  const idx = itemIndex++
                  const isSelected = idx === selectedIndex
                  return (
                    <button
                      key={item.id}
                      data-index={idx}
                      onClick={() => { item.action(); onClose() }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors ${
                        isSelected ? 'bg-forge-teal/8' : 'hover:bg-forge-bg'
                      }`}
                    >
                      <span className={`flex-shrink-0 ${isSelected ? 'text-forge-teal' : 'text-forge-text-faint'}`}>
                        {item.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm font-medium truncate block ${isSelected ? 'text-forge-teal' : 'text-forge-text'}`}>
                          {item.label}
                        </span>
                        {item.secondaryLabel && (
                          <span className="text-[11px] text-forge-text-faint truncate block">
                            {item.secondaryLabel}
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <ArrowRight size={14} className="text-forge-teal flex-shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer hints */}
        <div className="flex items-center gap-4 px-5 py-2.5 border-t border-forge-border bg-forge-bg/50">
          <span className="flex items-center gap-1.5 text-[10px] text-forge-text-faint">
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-forge-border font-mono text-[9px]">&uarr;&darr;</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-forge-text-faint">
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-forge-border font-mono text-[9px]">&crarr;</kbd>
            Open
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-forge-text-faint">
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-forge-border font-mono text-[9px]">ESC</kbd>
            Close
          </span>
        </div>
      </div>
    </div>
  )
}

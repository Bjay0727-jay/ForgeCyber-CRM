import { useState, useMemo } from 'react'
import {
  ClipboardCheck, FileText, ShieldCheck, AlertTriangle,
  UserPlus, Settings, Layers, BarChart3, Download,
  Search, Plus, X, Calendar, User, Eye,
} from 'lucide-react'
import { templates } from '../data/mockData'
import Modal from '../components/Modal'
import Badge from '../components/Badge'

const iconConfig: Record<string, { icon: React.ReactNode; bgClass: string; label: string }> = {
  assess: { icon: <ClipboardCheck size={22} className="text-forge-teal" />, bgClass: 'bg-forge-teal-subtle', label: 'Assessment' },
  report: { icon: <FileText size={22} className="text-forge-info" />, bgClass: 'bg-forge-info/8', label: 'Report' },
  compliance: { icon: <ShieldCheck size={22} className="text-forge-purple" />, bgClass: 'bg-forge-purple/8', label: 'Compliance' },
  incident: { icon: <AlertTriangle size={22} className="text-forge-danger" />, bgClass: 'bg-forge-danger/8', label: 'Incident Response' },
  onboard: { icon: <UserPlus size={22} className="text-forge-success" />, bgClass: 'bg-forge-success/8', label: 'Onboarding' },
  ops: { icon: <Settings size={22} className="text-forge-warning" />, bgClass: 'bg-forge-warning/8', label: 'Operations' },
}

const categories = [
  { key: 'all', label: 'All Templates' },
  { key: 'assess', label: 'Assessment' },
  { key: 'report', label: 'Report' },
  { key: 'compliance', label: 'Compliance' },
  { key: 'incident', label: 'Incident' },
  { key: 'onboard', label: 'Onboarding' },
  { key: 'ops', label: 'Operations' },
]

export default function Templates() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[number] | null>(null)

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const matchesCategory = activeCategory === 'all' || t.iconType === activeCategory
      const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, search])

  const config = selectedTemplate ? iconConfig[selectedTemplate.iconType] : null

  return (
    <div className="space-y-5">
      {/* Header with search and create button */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-forge-text-faint" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border border-forge-border rounded-lg text-sm focus:ring-2 focus:ring-forge-teal/20 focus:border-forge-teal outline-none transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-forge-text-faint hover:text-forge-text">
              <X size={14} />
            </button>
          )}
        </div>
        <button className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-forge-teal text-white text-sm font-medium hover:bg-forge-teal/90 transition-colors">
          <Plus size={15} />
          Create Template
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 border-b border-forge-border">
        {categories.map((cat) => {
          const count = cat.key === 'all' ? templates.length : templates.filter(t => t.iconType === cat.key).length
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3.5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeCategory === cat.key
                  ? 'border-forge-teal text-forge-teal'
                  : 'border-transparent text-forge-text-muted hover:text-forge-text hover:border-forge-border'
              }`}
            >
              {cat.label}
              <span className={`ml-1.5 text-xs ${activeCategory === cat.key ? 'text-forge-teal/70' : 'text-forge-text-faint'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Results count */}
      {search && (
        <p className="text-xs text-forge-text-muted">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
          {activeCategory !== 'all' && ` in ${categories.find(c => c.key === activeCategory)?.label}`}
        </p>
      )}

      {/* Template grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Search size={32} className="mx-auto text-forge-text-faint mb-3" />
          <p className="text-sm text-forge-text-muted">No templates match your search</p>
          <button
            onClick={() => { setSearch(''); setActiveCategory('all') }}
            className="mt-2 text-sm text-forge-teal hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((template) => {
            const cfg = iconConfig[template.iconType]
            return (
              <div
                key={template.name}
                onClick={() => setSelectedTemplate(template)}
                className="group bg-white rounded-xl border border-forge-border shadow-sm hover:border-forge-teal/20 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3.5">
                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${cfg.bgClass}`}>
                      {cfg.icon}
                    </div>
                    <Badge variant="teal">{cfg.label}</Badge>
                  </div>
                  <h3 className="text-sm font-semibold text-forge-text mb-1.5">{template.name}</h3>
                  <p className="text-xs text-forge-text-muted leading-relaxed">{template.desc}</p>
                </div>
                <div className="px-5 py-3 border-t border-forge-border bg-forge-bg/30 rounded-b-xl flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-forge-text-faint">
                    <Layers size={12} />
                    {template.sections > 0 ? `${template.sections} sections` : template.domains}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-forge-text-faint">
                      <BarChart3 size={12} />
                      {template.usageCount} uses
                    </span>
                    <Eye size={14} className="text-forge-text-faint opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Template preview modal */}
      <Modal
        isOpen={!!selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
        title={selectedTemplate?.name ?? ''}
        footer={
          <>
            <button
              onClick={() => setSelectedTemplate(null)}
              className="px-4 py-2 text-sm font-medium border border-forge-border rounded-lg text-forge-text hover:bg-forge-bg transition-colors"
            >
              Close
            </button>
            <button className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-forge-teal text-white hover:bg-forge-teal/90 transition-colors">
              <Download size={14} />
              Use Template
            </button>
          </>
        }
      >
        {selectedTemplate && config && (
          <div className="space-y-6">
            {/* Template header */}
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bgClass}`}>
                {config.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="teal">{config.label}</Badge>
                </div>
                <p className="text-sm text-forge-text-muted leading-relaxed mt-2">{selectedTemplate.desc}</p>
              </div>
            </div>

            {/* Metadata grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-forge-bg/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-forge-text-muted mb-1">
                  <Layers size={14} />
                  <span className="text-xs font-medium">Sections</span>
                </div>
                <p className="text-lg font-semibold text-forge-text">
                  {selectedTemplate.sections > 0 ? selectedTemplate.sections : '—'}
                </p>
              </div>
              <div className="bg-forge-bg/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-forge-text-muted mb-1">
                  <BarChart3 size={14} />
                  <span className="text-xs font-medium">Total Uses</span>
                </div>
                <p className="text-lg font-semibold text-forge-text">{selectedTemplate.usageCount}</p>
              </div>
              <div className="bg-forge-bg/50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-forge-text-muted mb-1">
                  <Calendar size={14} />
                  <span className="text-xs font-medium">Last Updated</span>
                </div>
                <p className="text-lg font-semibold text-forge-text">Jan 2026</p>
              </div>
            </div>

            {/* Scope / Coverage */}
            <div>
              <h4 className="text-sm font-semibold text-forge-text mb-3">Coverage</h4>
              <div className="flex items-center gap-2 text-sm text-forge-text-muted">
                <ShieldCheck size={15} className="text-forge-teal" />
                {selectedTemplate.domains}
              </div>
            </div>

            {/* Template info */}
            <div>
              <h4 className="text-sm font-semibold text-forge-text mb-3">Details</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <User size={15} className="text-forge-text-faint flex-shrink-0" />
                  <span className="text-forge-text-muted">Created by</span>
                  <span className="font-medium text-forge-text ml-auto">Forge Cyber Defense</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FileText size={15} className="text-forge-text-faint flex-shrink-0" />
                  <span className="text-forge-text-muted">Format</span>
                  <span className="font-medium text-forge-text ml-auto">PDF / DOCX</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Download size={15} className="text-forge-text-faint flex-shrink-0" />
                  <span className="text-forge-text-muted">License</span>
                  <span className="font-medium text-forge-text ml-auto">Internal Use Only</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

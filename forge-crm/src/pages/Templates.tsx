import { useState, useMemo } from 'react'
import {
  ClipboardCheck, FileText, ShieldCheck, AlertTriangle,
  UserPlus, Settings, Layers, BarChart3, Download,
  Search, Plus, X, Calendar, User, Eye, ArrowUpDown,
  TrendingUp, FolderOpen,
} from 'lucide-react'
import { templates as defaultTemplates } from '../data/mockData'
import Modal from '../components/Modal'
import Badge from '../components/Badge'

type IconType = 'assess' | 'report' | 'compliance' | 'incident' | 'onboard' | 'ops'

interface Template {
  name: string
  desc: string
  iconType: IconType
  sections: number
  domains: string
  usageCount: number
}

const iconConfig: Record<IconType, { icon: React.ReactNode; bgClass: string; label: string }> = {
  assess: { icon: <ClipboardCheck size={22} className="text-forge-teal" />, bgClass: 'bg-forge-teal-subtle', label: 'Assessment' },
  report: { icon: <FileText size={22} className="text-forge-info" />, bgClass: 'bg-forge-info/8', label: 'Report' },
  compliance: { icon: <ShieldCheck size={22} className="text-forge-purple" />, bgClass: 'bg-forge-purple/8', label: 'Compliance' },
  incident: { icon: <AlertTriangle size={22} className="text-forge-danger" />, bgClass: 'bg-forge-danger/8', label: 'Incident Response' },
  onboard: { icon: <UserPlus size={22} className="text-forge-success" />, bgClass: 'bg-forge-success/8', label: 'Onboarding' },
  ops: { icon: <Settings size={22} className="text-forge-warning" />, bgClass: 'bg-forge-warning/8', label: 'Operations' },
}

const categories = [
  { key: 'all', label: 'All' },
  { key: 'assess', label: 'Assessment' },
  { key: 'report', label: 'Report' },
  { key: 'compliance', label: 'Compliance' },
  { key: 'incident', label: 'Incident' },
  { key: 'onboard', label: 'Onboarding' },
  { key: 'ops', label: 'Operations' },
]

const iconTypeOptions: { value: IconType; label: string }[] = [
  { value: 'assess', label: 'Assessment' },
  { value: 'report', label: 'Report' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'incident', label: 'Incident Response' },
  { value: 'onboard', label: 'Onboarding' },
  { value: 'ops', label: 'Operations' },
]

type SortKey = 'name' | 'usage' | 'sections'

const emptyForm = { name: '', desc: '', iconType: 'assess' as IconType, sections: '', domains: '' }

export default function Templates() {
  const [templateList, setTemplateList] = useState<Template[]>(defaultTemplates as Template[])
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('usage')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')

  const totalUsage = useMemo(() => templateList.reduce((sum, t) => sum + t.usageCount, 0), [templateList])
  const categoryCount = useMemo(() => new Set(templateList.map(t => t.iconType)).size, [templateList])

  const filtered = useMemo(() => {
    const list = templateList.filter((t) => {
      const matchesCategory = activeCategory === 'all' || t.iconType === activeCategory
      const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })

    return [...list].sort((a, b) => {
      if (sortBy === 'usage') return b.usageCount - a.usageCount
      if (sortBy === 'sections') return b.sections - a.sections
      return a.name.localeCompare(b.name)
    })
  }, [templateList, activeCategory, search, sortBy])

  const config = selectedTemplate ? iconConfig[selectedTemplate.iconType] : null

  const inputClass = 'w-full py-2.5 px-3.5 border border-forge-border rounded-lg text-sm focus:ring-2 focus:ring-forge-teal/20 focus:border-forge-teal outline-none transition-colors'

  function handleCreate() {
    if (!form.name.trim()) {
      setFormError('Template name is required')
      return
    }
    if (!form.desc.trim()) {
      setFormError('Description is required')
      return
    }
    if (templateList.some(t => t.name.toLowerCase() === form.name.trim().toLowerCase())) {
      setFormError('A template with this name already exists')
      return
    }

    const newTemplate: Template = {
      name: form.name.trim(),
      desc: form.desc.trim(),
      iconType: form.iconType,
      sections: form.sections ? parseInt(form.sections, 10) : 0,
      domains: form.domains.trim() || '—',
      usageCount: 0,
    }

    setTemplateList(prev => [newTemplate, ...prev])
    setForm(emptyForm)
    setFormError('')
    setShowCreate(false)
  }

  function handleCloseCreate() {
    setShowCreate(false)
    setForm(emptyForm)
    setFormError('')
  }

  return (
    <div className="space-y-5">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-forge-border shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-forge-teal-subtle flex items-center justify-center">
            <Layers size={18} className="text-forge-teal" />
          </div>
          <div>
            <p className="text-lg font-semibold text-forge-text">{templateList.length}</p>
            <p className="text-xs text-forge-text-muted">Total Templates</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-forge-border shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-forge-info/8 flex items-center justify-center">
            <TrendingUp size={18} className="text-forge-info" />
          </div>
          <div>
            <p className="text-lg font-semibold text-forge-text">{totalUsage}</p>
            <p className="text-xs text-forge-text-muted">Total Uses</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-forge-border shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-forge-purple/8 flex items-center justify-center">
            <FolderOpen size={18} className="text-forge-purple" />
          </div>
          <div>
            <p className="text-lg font-semibold text-forge-text">{categoryCount}</p>
            <p className="text-xs text-forge-text-muted">Categories</p>
          </div>
        </div>
      </div>

      {/* Search, sort, and create */}
      <div className="flex items-center gap-3">
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
        <div className="flex items-center gap-1.5 text-xs text-forge-text-muted">
          <ArrowUpDown size={13} />
          <span>Sort:</span>
        </div>
        {(['usage', 'name', 'sections'] as SortKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setSortBy(key)}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              sortBy === key
                ? 'bg-forge-teal/8 text-forge-teal border-forge-teal/20'
                : 'text-forge-text-muted border-forge-border hover:border-forge-text-faint'
            }`}
          >
            {key === 'usage' ? 'Most Used' : key === 'name' ? 'Name' : 'Sections'}
          </button>
        ))}
        <div className="flex-1" />
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-forge-teal text-white text-sm font-medium hover:bg-forge-teal/90 transition-colors"
        >
          <Plus size={15} />
          Create Template
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 border-b border-forge-border overflow-x-auto">
        {categories.map((cat) => {
          const count = cat.key === 'all' ? templateList.length : templateList.filter(t => t.iconType === cat.key).length
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3.5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
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
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
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
            const isPopular = template.usageCount >= 50
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
                    <div className="flex items-center gap-1.5">
                      {isPopular && <Badge variant="warning">Popular</Badge>}
                      <Badge variant="teal">{cfg.label}</Badge>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-forge-text mb-1.5">{template.name}</h3>
                  <p className="text-xs text-forge-text-muted leading-relaxed line-clamp-2">{template.desc}</p>
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
                  {selectedTemplate.usageCount >= 50 && <Badge variant="warning">Popular</Badge>}
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

      {/* Create Template modal */}
      <Modal
        isOpen={showCreate}
        onClose={handleCloseCreate}
        title="Create New Template"
        footer={
          <>
            <button
              onClick={handleCloseCreate}
              className="px-4 py-2 text-sm font-medium border border-forge-border rounded-lg text-forge-text hover:bg-forge-bg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-forge-teal text-white hover:bg-forge-teal/90 transition-colors"
            >
              <Plus size={14} />
              Create Template
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {formError && (
            <div className="px-3.5 py-2.5 rounded-lg bg-forge-danger/8 border border-forge-danger/15 text-sm text-forge-danger">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-forge-text mb-1.5">
              Template Name <span className="text-forge-danger">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => { setForm(f => ({ ...f, name: e.target.value })); setFormError('') }}
              placeholder="e.g. FedRAMP Readiness Assessment"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-forge-text mb-1.5">
              Description <span className="text-forge-danger">*</span>
            </label>
            <textarea
              value={form.desc}
              onChange={(e) => { setForm(f => ({ ...f, desc: e.target.value })); setFormError('') }}
              placeholder="Brief description of the template purpose and contents..."
              rows={3}
              className={inputClass + ' resize-none'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-forge-text mb-1.5">Category</label>
            <select
              value={form.iconType}
              onChange={(e) => setForm(f => ({ ...f, iconType: e.target.value as IconType }))}
              className={inputClass}
            >
              {iconTypeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-forge-text mb-1.5">Sections</label>
              <input
                type="number"
                min="0"
                value={form.sections}
                onChange={(e) => setForm(f => ({ ...f, sections: e.target.value }))}
                placeholder="e.g. 24"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-forge-text mb-1.5">Coverage / Domains</label>
              <input
                type="text"
                value={form.domains}
                onChange={(e) => setForm(f => ({ ...f, domains: e.target.value }))}
                placeholder="e.g. 7 domains"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

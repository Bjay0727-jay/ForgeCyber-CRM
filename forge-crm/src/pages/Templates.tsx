import { useState, useMemo } from 'react'
import {
  ClipboardCheck, FileText, ShieldCheck, AlertTriangle,
  UserPlus, Settings, Layers, BarChart3,
  Search, Plus, X, ArrowUpDown,
  FileEdit, Trash2, Clock,
} from 'lucide-react'
import { templates as defaultTemplates } from '../data/mockData'
import { templateStructures } from '../data/templateStructures'
import Badge from '../components/Badge'
import TemplateEditor from '../components/TemplateEditor'

type IconType = 'assess' | 'report' | 'compliance' | 'incident' | 'onboard' | 'ops'

interface Template {
  name: string
  desc: string
  iconType: IconType
  sections: number
  domains: string
  usageCount: number
}

interface SavedDocument {
  id: string
  name: string
  templateName: string
  iconType: IconType
  savedAt: string
  data: Record<string, string | string[]>
}

const iconConfig: Record<IconType, { icon: React.ReactNode; iconSm: React.ReactNode; bgClass: string; label: string }> = {
  assess: { icon: <ClipboardCheck size={22} className="text-forge-teal" />, iconSm: <ClipboardCheck size={14} className="text-forge-teal" />, bgClass: 'bg-forge-teal-subtle', label: 'Assessment' },
  report: { icon: <FileText size={22} className="text-forge-info" />, iconSm: <FileText size={14} className="text-forge-info" />, bgClass: 'bg-forge-info/8', label: 'Report' },
  compliance: { icon: <ShieldCheck size={22} className="text-forge-purple" />, iconSm: <ShieldCheck size={14} className="text-forge-purple" />, bgClass: 'bg-forge-purple/8', label: 'Compliance' },
  incident: { icon: <AlertTriangle size={22} className="text-forge-danger" />, iconSm: <AlertTriangle size={14} className="text-forge-danger" />, bgClass: 'bg-forge-danger/8', label: 'Incident Response' },
  onboard: { icon: <UserPlus size={22} className="text-forge-success" />, iconSm: <UserPlus size={14} className="text-forge-success" />, bgClass: 'bg-forge-success/8', label: 'Onboarding' },
  ops: { icon: <Settings size={22} className="text-forge-warning" />, iconSm: <Settings size={14} className="text-forge-warning" />, bgClass: 'bg-forge-warning/8', label: 'Operations' },
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
const fmtInputClass = 'w-full py-2.5 px-3.5 border border-forge-border rounded-lg text-sm focus:ring-2 focus:ring-forge-teal/20 focus:border-forge-teal outline-none transition-colors'

export default function Templates() {
  const [templateList, setTemplateList] = useState<Template[]>(defaultTemplates as Template[])
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('usage')
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')

  // Editor state
  const [editorTemplate, setEditorTemplate] = useState<Template | null>(null)
  const [editorInitialData, setEditorInitialData] = useState<Record<string, string | string[]> | null>(null)
  const [editingDocId, setEditingDocId] = useState<string | null>(null)

  // Saved documents
  const [savedDocs, setSavedDocs] = useState<SavedDocument[]>([])

  const totalUsage = useMemo(() => templateList.reduce((sum, t) => sum + t.usageCount, 0), [templateList])

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

  function handleCreate() {
    if (!form.name.trim()) { setFormError('Template name is required'); return }
    if (!form.desc.trim()) { setFormError('Description is required'); return }
    if (templateList.some(t => t.name.toLowerCase() === form.name.trim().toLowerCase())) { setFormError('A template with this name already exists'); return }

    setTemplateList(prev => [{
      name: form.name.trim(), desc: form.desc.trim(), iconType: form.iconType,
      sections: form.sections ? parseInt(form.sections, 10) : 0, domains: form.domains.trim() || '—', usageCount: 0,
    }, ...prev])
    setForm(emptyForm); setFormError(''); setShowCreate(false)
  }

  function openEditor(template: Template, initialData?: Record<string, string | string[]>, docId?: string) {
    setEditorTemplate(template)
    setEditorInitialData(initialData ?? null)
    setEditingDocId(docId ?? null)
  }

  function handleEditorSave(docName: string, data: Record<string, string | string[]>) {
    if (!editorTemplate) return

    if (editingDocId) {
      setSavedDocs(prev => prev.map(d => d.id === editingDocId ? {
        ...d, name: docName, data, savedAt: new Date().toLocaleString(),
      } : d))
    } else {
      setSavedDocs(prev => [{
        id: crypto.randomUUID(), name: docName, templateName: editorTemplate.name,
        iconType: editorTemplate.iconType, savedAt: new Date().toLocaleString(), data,
      }, ...prev])
    }

    setEditorTemplate(null); setEditorInitialData(null); setEditingDocId(null)
  }

  function handleEditDoc(doc: SavedDocument) {
    const template = templateList.find(t => t.name === doc.templateName)
    if (template) openEditor(template, doc.data, doc.id)
  }

  // Editor view — renders inline within the page (sidebar stays visible)
  if (editorTemplate) {
    const structure = templateStructures[editorTemplate.name]
    if (structure) {
      return (
        <TemplateEditor
          structure={structure}
          templateCategory={iconConfig[editorTemplate.iconType].label}
          initialData={editorInitialData ?? undefined}
          onClose={() => { setEditorTemplate(null); setEditorInitialData(null); setEditingDocId(null) }}
          onSave={handleEditorSave}
        />
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-forge-border shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-forge-teal-subtle flex items-center justify-center">
            <Layers size={20} className="text-forge-teal" />
          </div>
          <div>
            <p className="text-2xl font-bold text-forge-text">{templateList.length}</p>
            <p className="text-xs text-forge-text-muted">Templates</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-forge-border shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-forge-info/8 flex items-center justify-center">
            <BarChart3 size={20} className="text-forge-info" />
          </div>
          <div>
            <p className="text-2xl font-bold text-forge-text">{totalUsage}</p>
            <p className="text-xs text-forge-text-muted">Total Uses</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-forge-border shadow-sm p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-lg bg-forge-success/8 flex items-center justify-center">
            <FileEdit size={20} className="text-forge-success" />
          </div>
          <div>
            <p className="text-2xl font-bold text-forge-text">{savedDocs.length}</p>
            <p className="text-xs text-forge-text-muted">Documents</p>
          </div>
        </div>
      </div>

      {/* Recent documents — always visible when docs exist */}
      {savedDocs.length > 0 && (
        <div className="bg-white rounded-xl border border-forge-border shadow-sm">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-forge-border">
            <h3 className="text-sm font-semibold text-forge-text flex items-center gap-2">
              <Clock size={14} className="text-forge-text-faint" />
              Recent Documents
            </h3>
            <span className="text-xs text-forge-text-faint">{savedDocs.length} saved</span>
          </div>
          <div className="divide-y divide-forge-border">
            {savedDocs.slice(0, 5).map((doc) => {
              const cfg = iconConfig[doc.iconType]
              return (
                <div key={doc.id} className="flex items-center gap-3 px-5 py-3 hover:bg-forge-bg/40 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bgClass}`}>
                    {cfg.iconSm}
                  </div>
                  <div className="flex-1 min-w-0">
                    <button onClick={() => handleEditDoc(doc)} className="text-sm font-medium text-forge-text hover:text-forge-teal transition-colors truncate block">
                      {doc.name}
                    </button>
                    <p className="text-xs text-forge-text-faint">{doc.templateName}</p>
                  </div>
                  <span className="text-xs text-forge-text-faint flex-shrink-0">{doc.savedAt}</span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => handleEditDoc(doc)} className="p-1.5 rounded-md text-forge-text-faint hover:bg-forge-bg hover:text-forge-teal transition-colors" title="Edit">
                      <FileEdit size={13} />
                    </button>
                    <button onClick={() => setSavedDocs(prev => prev.filter(d => d.id !== doc.id))} className="p-1.5 rounded-md text-forge-text-faint hover:bg-forge-danger/8 hover:text-forge-danger transition-colors" title="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Search + sort + create */}
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
          New Template
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

      {search && (
        <p className="text-xs text-forge-text-muted">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
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
            const hasStructure = !!templateStructures[template.name]
            return (
              <div
                key={template.name}
                className="group bg-white rounded-xl border border-forge-border shadow-sm hover:shadow-md hover:border-forge-teal/25 transition-all"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${cfg.bgClass}`}>
                      {cfg.icon}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {isPopular && <Badge variant="warning">Popular</Badge>}
                      <Badge variant="teal">{cfg.label}</Badge>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-forge-text mb-1">{template.name}</h3>
                  <p className="text-xs text-forge-text-muted leading-relaxed line-clamp-2 mb-4">{template.desc}</p>
                  <div className="flex items-center gap-2 text-xs text-forge-text-faint mb-4">
                    <span className="flex items-center gap-1">
                      <Layers size={11} />
                      {template.sections > 0 ? `${template.sections} sections` : template.domains}
                    </span>
                    <span className="text-forge-border">&middot;</span>
                    <span className="flex items-center gap-1">
                      <BarChart3 size={11} />
                      {template.usageCount} uses
                    </span>
                  </div>
                  {hasStructure ? (
                    <button
                      onClick={() => openEditor(template)}
                      className="w-full py-2.5 text-sm font-medium rounded-lg bg-forge-teal text-white hover:bg-forge-teal/90 transition-colors"
                    >
                      Use Template
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2.5 text-sm font-medium rounded-lg border border-forge-border text-forge-text-faint cursor-not-allowed"
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create Template modal */}
      {showCreate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={() => { setShowCreate(false); setForm(emptyForm); setFormError('') }}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="relative bg-white rounded-xl shadow-xl border border-forge-border w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-forge-border">
              <h3 className="text-base font-semibold text-forge-text">Create New Template</h3>
            </div>
            <div className="p-6 space-y-4">
              {formError && (
                <div className="px-3.5 py-2.5 rounded-lg bg-forge-danger/8 border border-forge-danger/15 text-sm text-forge-danger">{formError}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-forge-text mb-1.5">Template Name <span className="text-forge-danger text-xs">*</span></label>
                <input type="text" value={form.name} onChange={(e) => { setForm(f => ({ ...f, name: e.target.value })); setFormError('') }} placeholder="e.g. FedRAMP Readiness Assessment" className={fmtInputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-1.5">Description <span className="text-forge-danger text-xs">*</span></label>
                <textarea value={form.desc} onChange={(e) => { setForm(f => ({ ...f, desc: e.target.value })); setFormError('') }} placeholder="Brief description..." rows={3} className={fmtInputClass + ' resize-none'} />
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-1.5">Category</label>
                <select value={form.iconType} onChange={(e) => setForm(f => ({ ...f, iconType: e.target.value as IconType }))} className={fmtInputClass}>
                  {iconTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-forge-text mb-1.5">Sections</label>
                  <input type="number" min="0" value={form.sections} onChange={(e) => setForm(f => ({ ...f, sections: e.target.value }))} placeholder="e.g. 24" className={fmtInputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forge-text mb-1.5">Coverage</label>
                  <input type="text" value={form.domains} onChange={(e) => setForm(f => ({ ...f, domains: e.target.value }))} placeholder="e.g. 7 domains" className={fmtInputClass} />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-forge-border flex justify-end gap-3">
              <button onClick={() => { setShowCreate(false); setForm(emptyForm); setFormError('') }} className="px-4 py-2 text-sm font-medium border border-forge-border rounded-lg text-forge-text hover:bg-forge-bg transition-colors">Cancel</button>
              <button onClick={handleCreate} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-forge-teal text-white hover:bg-forge-teal/90 transition-colors">
                <Plus size={14} />
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

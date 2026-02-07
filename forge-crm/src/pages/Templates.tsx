import { useState, useMemo } from 'react'
import {
  ClipboardCheck, FileText, ShieldCheck, AlertTriangle,
  UserPlus, Settings, Layers, BarChart3, Download,
  Search, Plus, X, Calendar, User, Eye, ArrowUpDown,
  TrendingUp, FolderOpen, FileEdit, Trash2,
} from 'lucide-react'
import { templates as defaultTemplates } from '../data/mockData'
import { templateStructures } from '../data/templateStructures'
import Modal from '../components/Modal'
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
type PageView = 'library' | 'documents'

const emptyForm = { name: '', desc: '', iconType: 'assess' as IconType, sections: '', domains: '' }
const fmtInputClass = 'w-full py-2.5 px-3.5 border border-forge-border rounded-lg text-sm focus:ring-2 focus:ring-forge-teal/20 focus:border-forge-teal outline-none transition-colors'

export default function Templates() {
  const [templateList, setTemplateList] = useState<Template[]>(defaultTemplates as Template[])
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('usage')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [pageView, setPageView] = useState<PageView>('library')

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

  const config = selectedTemplate ? iconConfig[selectedTemplate.iconType] : null

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

  function handleCloseCreate() { setShowCreate(false); setForm(emptyForm); setFormError('') }

  function openEditor(template: Template, initialData?: Record<string, string | string[]>, docId?: string) {
    setEditorTemplate(template)
    setEditorInitialData(initialData ?? null)
    setEditingDocId(docId ?? null)
    setSelectedTemplate(null)
  }

  function handleEditorSave(docName: string, data: Record<string, string | string[]>) {
    if (!editorTemplate) return

    if (editingDocId) {
      // Update existing document
      setSavedDocs(prev => prev.map(d => d.id === editingDocId ? {
        ...d, name: docName, data, savedAt: new Date().toLocaleString(),
      } : d))
    } else {
      // Create new document
      const doc: SavedDocument = {
        id: crypto.randomUUID(),
        name: docName,
        templateName: editorTemplate.name,
        iconType: editorTemplate.iconType,
        savedAt: new Date().toLocaleString(),
        data,
      }
      setSavedDocs(prev => [doc, ...prev])
    }

    setEditorTemplate(null)
    setEditorInitialData(null)
    setEditingDocId(null)
    setPageView('documents')
  }

  function handleDeleteDoc(id: string) {
    setSavedDocs(prev => prev.filter(d => d.id !== id))
  }

  function handleEditDoc(doc: SavedDocument) {
    const template = templateList.find(t => t.name === doc.templateName)
    if (template) openEditor(template, doc.data, doc.id)
  }

  // If editor is open, render it full-screen
  if (editorTemplate) {
    const structure = templateStructures[editorTemplate.name]
    if (structure) {
      return (
        <TemplateEditor
          structure={structure}
          initialData={editorInitialData ?? undefined}
          onClose={() => { setEditorTemplate(null); setEditorInitialData(null); setEditingDocId(null) }}
          onSave={handleEditorSave}
        />
      )
    }
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
            <p className="text-xs text-forge-text-muted">Templates</p>
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
            <p className="text-lg font-semibold text-forge-text">{savedDocs.length}</p>
            <p className="text-xs text-forge-text-muted">Saved Documents</p>
          </div>
        </div>
      </div>

      {/* View toggle: Library vs Saved Documents */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-forge-bg rounded-lg p-0.5">
          <button
            onClick={() => setPageView('library')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              pageView === 'library' ? 'bg-white shadow-sm text-forge-text' : 'text-forge-text-muted hover:text-forge-text'
            }`}
          >
            Template Library
          </button>
          <button
            onClick={() => setPageView('documents')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              pageView === 'documents' ? 'bg-white shadow-sm text-forge-text' : 'text-forge-text-muted hover:text-forge-text'
            }`}
          >
            Saved Documents
            {savedDocs.length > 0 && (
              <span className="ml-1.5 text-xs text-forge-teal">{savedDocs.length}</span>
            )}
          </button>
        </div>
        {pageView === 'library' && (
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-forge-teal text-white text-sm font-medium hover:bg-forge-teal/90 transition-colors"
          >
            <Plus size={15} />
            Create Template
          </button>
        )}
      </div>

      {/* ─── Saved Documents View ─── */}
      {pageView === 'documents' && (
        <>
          {savedDocs.length === 0 ? (
            <div className="text-center py-16">
              <FileText size={32} className="mx-auto text-forge-text-faint mb-3" />
              <p className="text-sm text-forge-text-muted mb-1">No saved documents yet</p>
              <p className="text-xs text-forge-text-faint mb-4">Use a template to create your first document</p>
              <button
                onClick={() => setPageView('library')}
                className="text-sm text-forge-teal hover:underline"
              >
                Go to Template Library
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-forge-border shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-forge-border">
                    <th className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4 bg-forge-bg/50">Document Name</th>
                    <th className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4 bg-forge-bg/50">Template</th>
                    <th className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4 bg-forge-bg/50">Category</th>
                    <th className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4 bg-forge-bg/50">Saved</th>
                    <th className="text-right text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4 bg-forge-bg/50">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {savedDocs.map((doc) => {
                    const cfg = iconConfig[doc.iconType]
                    return (
                      <tr key={doc.id} className="border-b border-forge-border last:border-0 hover:bg-forge-bg/30">
                        <td className="px-4 py-3">
                          <button onClick={() => handleEditDoc(doc)} className="text-sm font-medium text-forge-text hover:text-forge-teal transition-colors text-left">
                            {doc.name}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-sm text-forge-text-muted">{doc.templateName}</td>
                        <td className="px-4 py-3">
                          <Badge variant="teal">{cfg.label}</Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-forge-text-faint">{doc.savedAt}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditDoc(doc)}
                              className="p-1.5 rounded-md text-forge-text-muted hover:bg-forge-bg hover:text-forge-teal transition-colors"
                              title="Edit"
                            >
                              <FileEdit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteDoc(doc.id)}
                              className="p-1.5 rounded-md text-forge-text-muted hover:bg-forge-danger/8 hover:text-forge-danger transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ─── Template Library View ─── */}
      {pageView === 'library' && (
        <>
          {/* Search and sort */}
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
                const hasStructure = !!templateStructures[template.name]
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
                        {hasStructure && (
                          <Eye size={14} className="text-forge-text-faint opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
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
            {selectedTemplate && templateStructures[selectedTemplate.name] && (
              <button
                onClick={() => openEditor(selectedTemplate!)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-forge-teal text-white hover:bg-forge-teal/90 transition-colors"
              >
                <FileEdit size={14} />
                Use Template
              </button>
            )}
          </>
        }
      >
        {selectedTemplate && config && (
          <div className="space-y-6">
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

            <div>
              <h4 className="text-sm font-semibold text-forge-text mb-3">Coverage</h4>
              <div className="flex items-center gap-2 text-sm text-forge-text-muted">
                <ShieldCheck size={15} className="text-forge-teal" />
                {selectedTemplate.domains}
              </div>
            </div>

            {/* Show sections preview if structure exists */}
            {templateStructures[selectedTemplate.name] && (
              <div>
                <h4 className="text-sm font-semibold text-forge-text mb-3">Template Sections</h4>
                <div className="space-y-1.5">
                  {templateStructures[selectedTemplate.name].sections.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-2 text-sm text-forge-text-muted">
                      <span className="w-5 h-5 rounded-full bg-forge-bg flex items-center justify-center text-xs font-medium text-forge-text-faint">{i + 1}</span>
                      {s.title}
                      <span className="text-xs text-forge-text-faint ml-auto">{s.fields.length} fields</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
            <button onClick={handleCloseCreate} className="px-4 py-2 text-sm font-medium border border-forge-border rounded-lg text-forge-text hover:bg-forge-bg transition-colors">Cancel</button>
            <button onClick={handleCreate} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-forge-teal text-white hover:bg-forge-teal/90 transition-colors">
              <Plus size={14} />
              Create Template
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {formError && (
            <div className="px-3.5 py-2.5 rounded-lg bg-forge-danger/8 border border-forge-danger/15 text-sm text-forge-danger">{formError}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-forge-text mb-1.5">Template Name <span className="text-forge-danger">*</span></label>
            <input type="text" value={form.name} onChange={(e) => { setForm(f => ({ ...f, name: e.target.value })); setFormError('') }} placeholder="e.g. FedRAMP Readiness Assessment" className={fmtInputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-forge-text mb-1.5">Description <span className="text-forge-danger">*</span></label>
            <textarea value={form.desc} onChange={(e) => { setForm(f => ({ ...f, desc: e.target.value })); setFormError('') }} placeholder="Brief description of the template purpose and contents..." rows={3} className={fmtInputClass + ' resize-none'} />
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
              <label className="block text-sm font-medium text-forge-text mb-1.5">Coverage / Domains</label>
              <input type="text" value={form.domains} onChange={(e) => setForm(f => ({ ...f, domains: e.target.value }))} placeholder="e.g. 7 domains" className={fmtInputClass} />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

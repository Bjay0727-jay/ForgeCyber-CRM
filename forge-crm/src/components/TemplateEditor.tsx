import { useState, useRef } from 'react'
import {
  ArrowLeft, Save, Download, ChevronRight, ChevronLeft,
  CheckCircle2, AlertCircle, FileText, Sparkles,
} from 'lucide-react'
import type { TemplateStructure, TemplateField, TemplateSection } from '../data/templateStructures'

interface TemplateEditorProps {
  structure: TemplateStructure
  templateCategory: string
  initialData?: Record<string, string | string[]>
  onClose: () => void
  onSave: (name: string, data: Record<string, string | string[]>) => void
}

const inputClass =
  'w-full py-2.5 px-3.5 border border-forge-border rounded-lg text-sm focus:ring-2 focus:ring-forge-teal/30 focus:border-forge-teal focus:shadow-[0_0_0_3px_rgba(13,148,136,0.08)] outline-none transition-all bg-white hover:border-forge-text-faint'

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: TemplateField
  value: string | string[]
  onChange: (val: string | string[]) => void
}) {
  switch (field.type) {
    case 'text':
    case 'date':
    case 'number':
      return (
        <input
          type={field.type}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={inputClass}
        />
      )

    case 'textarea':
      return (
        <textarea
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
          className={inputClass + ' resize-y min-h-[80px]'}
        />
      )

    case 'select':
      return (
        <select
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        >
          <option value="">Select...</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )

    case 'rating':
      return (
        <div className="flex flex-wrap gap-2">
          {field.options?.map((opt) => {
            const selected = value === opt
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(opt)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg border-2 transition-all ${
                  selected
                    ? 'bg-gradient-to-b from-forge-teal to-forge-teal/90 text-white border-forge-teal shadow-md shadow-forge-teal/20 scale-105'
                    : 'bg-white text-forge-text-muted border-forge-border hover:border-forge-teal/40 hover:bg-forge-teal-subtle hover:shadow-sm'
                }`}
              >
                {opt}
              </button>
            )
          })}
        </div>
      )

    case 'checklist': {
      const checked = Array.isArray(value) ? value : []
      return (
        <div className="space-y-1.5">
          {field.options?.map((opt) => {
            const isChecked = checked.includes(opt)
            return (
              <label
                key={opt}
                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
                  isChecked
                    ? 'bg-gradient-to-r from-forge-teal-subtle to-forge-teal/5 border-forge-teal/20 shadow-sm'
                    : 'border-transparent hover:bg-forge-bg hover:border-forge-border/50'
                }`}
              >
                <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                  isChecked
                    ? 'bg-forge-teal border-forge-teal'
                    : 'border-forge-border bg-white'
                }`}>
                  {isChecked && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm leading-snug ${isChecked ? 'text-forge-text font-medium' : 'text-forge-text-muted'}`}>
                  {opt}
                </span>
              </label>
            )
          })}
        </div>
      )
    }

    case 'heading':
      return <p className="text-sm text-forge-text-muted">{field.placeholder}</p>

    default:
      return null
  }
}

function SectionFields({
  section,
  data,
  onChange,
}: {
  section: TemplateSection
  data: Record<string, string | string[]>
  onChange: (fieldId: string, value: string | string[]) => void
}) {
  return (
    <div className="space-y-5">
      {section.description && (
        <div className="flex gap-3 rounded-lg px-4 py-3.5 bg-gradient-to-r from-forge-info/5 to-forge-info/2 border border-forge-info/15">
          <Sparkles size={16} className="text-forge-info flex-shrink-0 mt-0.5" />
          <p className="text-sm text-forge-info/80 leading-relaxed">{section.description}</p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-x-5 gap-y-5">
        {section.fields.map((field) => {
          const colSpan = field.half ? 'col-span-1' : 'col-span-2'
          return (
            <div key={field.id} className={colSpan}>
              <label className="flex items-center gap-1.5 text-sm font-medium text-forge-text mb-1.5">
                {field.label}
                {field.required && <span className="text-forge-danger text-xs font-bold">*</span>}
              </label>
              {field.helpText && (
                <p className="text-xs text-forge-text-faint mb-2 pl-0.5">{field.helpText}</p>
              )}
              <FieldRenderer
                field={field}
                value={data[field.id] ?? (field.type === 'checklist' ? [] : '')}
                onChange={(val) => onChange(field.id, val)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function getSectionProgress(section: TemplateSection, data: Record<string, string | string[]>): 'empty' | 'partial' | 'complete' {
  const fields = section.fields.filter((f) => f.type !== 'heading')
  if (fields.length === 0) return 'complete'

  let filled = 0
  for (const field of fields) {
    const val = data[field.id]
    if (field.type === 'checklist') {
      if (Array.isArray(val) && val.length > 0) filled++
    } else if (val && String(val).trim()) {
      filled++
    }
  }

  if (filled === 0) return 'empty'
  if (filled >= fields.length) return 'complete'
  return 'partial'
}

export default function TemplateEditor({ structure, templateCategory, initialData, onClose, onSave }: TemplateEditorProps) {
  const [activeSection, setActiveSection] = useState(0)
  const [data, setData] = useState<Record<string, string | string[]>>(initialData ?? {})
  const [documentName, setDocumentName] = useState('')
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const section = structure.sections[activeSection]

  function handleFieldChange(fieldId: string, value: string | string[]) {
    setData((prev) => ({ ...prev, [fieldId]: value }))
  }

  function handleSave() {
    if (!documentName.trim()) {
      setShowSaveConfirm(true)
      return
    }
    onSave(documentName.trim(), data)
  }

  function confirmSave() {
    onSave(documentName.trim() || `${structure.templateName} - ${new Date().toLocaleDateString()}`, data)
    setShowSaveConfirm(false)
  }

  const totalFields = structure.sections.reduce((sum, s) => sum + s.fields.filter(f => f.type !== 'heading').length, 0)
  const filledFields = structure.sections.reduce((sum, s) => {
    return sum + s.fields.filter((f) => {
      if (f.type === 'heading') return false
      const val = data[f.id]
      if (f.type === 'checklist') return Array.isArray(val) && val.length > 0
      return val && String(val).trim() !== ''
    }).length
  }, 0)
  const progressPct = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0
  const completedSections = structure.sections.filter(s => getSectionProgress(s, data) === 'complete').length

  // Color mapping for category
  const categoryColors: Record<string, { gradient: string; accent: string; ring: string }> = {
    'Assessment': { gradient: 'from-forge-teal/90 to-emerald-600', accent: 'text-emerald-100', ring: '#0D9488' },
    'Report': { gradient: 'from-forge-info to-blue-600', accent: 'text-blue-100', ring: '#2563EB' },
    'Compliance': { gradient: 'from-forge-purple to-purple-600', accent: 'text-purple-100', ring: '#7C3AED' },
    'Incident Response': { gradient: 'from-red-500 to-rose-600', accent: 'text-rose-100', ring: '#DC2626' },
    'Onboarding': { gradient: 'from-forge-success to-green-600', accent: 'text-green-100', ring: '#059669' },
    'Operations': { gradient: 'from-forge-warning to-amber-600', accent: 'text-amber-100', ring: '#D97706' },
  }
  const colors = categoryColors[templateCategory] ?? categoryColors['Assessment']

  return (
    <div className="space-y-0 -m-6">
      {/* Editor header — rich gradient */}
      <div className={`bg-gradient-to-r ${colors.gradient} px-6 py-5 relative overflow-hidden`}>
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/20 -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-white/10 translate-y-1/2" />
        </div>

        <div className="relative flex items-center justify-between mb-4">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Templates
          </button>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium border border-white/25 rounded-lg text-white/90 hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              <Save size={14} />
              Save Draft
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg bg-white text-forge-text hover:bg-white/90 transition-colors shadow-lg shadow-black/10"
            >
              <Download size={14} />
              Save & Export
            </button>
          </div>
        </div>

        <div className="relative flex items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/10">
              <FileText size={22} className="text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <h1 className="text-lg font-bold text-white truncate">{structure.templateName}</h1>
                <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-white/15 text-white/90 backdrop-blur-sm border border-white/10">
                  {templateCategory}
                </span>
              </div>
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Name this document..."
                className={`mt-1 text-sm bg-transparent border-none outline-none w-72 placeholder:text-white/40 ${colors.accent}`}
              />
            </div>
          </div>

          {/* Progress ring */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right">
              <p className="text-xs text-white/50">{completedSections} of {structure.sections.length} sections</p>
              <p className="text-sm font-bold text-white">{progressPct}% complete</p>
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
                <circle cx="32" cy="32" r="28" fill="none" stroke="white" strokeWidth="4"
                  strokeDasharray={`${progressPct * 1.76} 176`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                  style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.3))' }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">{progressPct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section stepper — colored numbered steps */}
      <div className="bg-white border-b border-forge-border px-6 shadow-sm">
        <div className="flex gap-0 overflow-x-auto">
          {structure.sections.map((s, i) => {
            const progress = getSectionProgress(s, data)
            const isActive = i === activeSection
            return (
              <button
                key={s.id}
                onClick={() => { setActiveSection(i); contentRef.current?.scrollTo(0, 0) }}
                className={`flex items-center gap-2.5 px-4 py-3.5 text-xs font-medium border-b-[3px] -mb-px transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-current text-forge-teal'
                    : progress === 'complete'
                    ? 'border-transparent text-forge-success hover:bg-forge-success/5'
                    : 'border-transparent text-forge-text-muted hover:text-forge-text hover:bg-forge-bg/50'
                }`}
                style={isActive ? { borderColor: colors.ring } : undefined}
              >
                {progress === 'complete' ? (
                  <CheckCircle2 size={16} className="text-forge-success flex-shrink-0" />
                ) : progress === 'partial' ? (
                  <div className="w-5 h-5 rounded-full bg-forge-warning/10 border-2 border-forge-warning flex items-center justify-center flex-shrink-0">
                    <AlertCircle size={10} className="text-forge-warning" />
                  </div>
                ) : (
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold transition-all ${
                    isActive
                      ? 'text-white shadow-md'
                      : 'bg-forge-bg border border-forge-border text-forge-text-faint'
                  }`}
                  style={isActive ? { backgroundColor: colors.ring, boxShadow: `0 2px 8px ${colors.ring}40` } : undefined}
                  >
                    {i + 1}
                  </div>
                )}
                <span className="hidden lg:inline">{s.title}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Form content */}
      <div ref={contentRef} className="px-6 py-6 overflow-y-auto bg-forge-bg" style={{ maxHeight: 'calc(100vh - 300px)' }}>
        <div className="max-w-3xl">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-md"
              style={{ backgroundColor: colors.ring, boxShadow: `0 4px 12px ${colors.ring}30` }}
            >
              {activeSection + 1}
            </div>
            <div>
              <h2 className="text-lg font-bold text-forge-text">{section.title}</h2>
              <p className="text-xs text-forge-text-faint">
                Section {activeSection + 1} of {structure.sections.length}
                {' '}&middot;{' '}
                {section.fields.filter(f => f.type !== 'heading').length} fields
              </p>
            </div>
          </div>

          {/* Form card with colored top accent */}
          <div className="bg-white rounded-xl border border-forge-border shadow-sm overflow-hidden">
            <div className="h-1" style={{ background: `linear-gradient(90deg, ${colors.ring}, ${colors.ring}80, transparent)` }} />
            <div className="p-6">
              <SectionFields section={section} data={data} onChange={handleFieldChange} />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pb-4">
            <button
              onClick={() => { if (activeSection > 0) { setActiveSection(activeSection - 1); contentRef.current?.scrollTo(0, 0) } }}
              disabled={activeSection === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border border-forge-border rounded-lg text-forge-text bg-white hover:bg-forge-bg transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
            >
              <ChevronLeft size={14} />
              Previous
            </button>

            {/* Section dots with color */}
            <div className="flex items-center gap-2">
              {structure.sections.map((s, i) => {
                const p = getSectionProgress(s, data)
                return (
                  <button
                    key={s.id}
                    onClick={() => { setActiveSection(i); contentRef.current?.scrollTo(0, 0) }}
                    className={`rounded-full transition-all ${
                      i === activeSection
                        ? 'w-8 h-3 shadow-md'
                        : p === 'complete'
                        ? 'w-3 h-3 bg-forge-success shadow-sm'
                        : p === 'partial'
                        ? 'w-3 h-3 bg-forge-warning'
                        : 'w-3 h-3 bg-forge-border'
                    }`}
                    style={i === activeSection ? { backgroundColor: colors.ring, boxShadow: `0 2px 8px ${colors.ring}40` } : undefined}
                    title={s.title}
                  />
                )
              })}
            </div>

            {activeSection < structure.sections.length - 1 ? (
              <button
                onClick={() => { setActiveSection(activeSection + 1); contentRef.current?.scrollTo(0, 0) }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-lg text-white transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: colors.ring, boxShadow: `0 4px 12px ${colors.ring}30` }}
              >
                Next Section
                <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-lg text-white transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: colors.ring, boxShadow: `0 4px 12px ${colors.ring}30` }}
              >
                <Save size={14} />
                Save & Finish
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Save name prompt */}
      {showSaveConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" onClick={() => setShowSaveConfirm(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="relative bg-white rounded-xl shadow-2xl border border-forge-border p-6 w-full max-w-md mx-4 animate-scaleIn" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ backgroundColor: colors.ring }}>
              <Save size={20} className="text-white" />
            </div>
            <h3 className="text-base font-bold text-forge-text text-center mb-1">Save Document</h3>
            <p className="text-sm text-forge-text-muted text-center mb-4">Give this document a name to save it.</p>
            <input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder={`${structure.templateName} - ${new Date().toLocaleDateString()}`}
              className={inputClass + ' mb-4'}
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSaveConfirm(false)}
                className="px-4 py-2.5 text-sm font-medium border border-forge-border rounded-lg text-forge-text hover:bg-forge-bg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSave}
                className="px-5 py-2.5 text-sm font-semibold rounded-lg text-white transition-all shadow-md hover:shadow-lg"
                style={{ backgroundColor: colors.ring }}
              >
                Save Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

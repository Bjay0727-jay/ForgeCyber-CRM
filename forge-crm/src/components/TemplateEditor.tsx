import { useState, useRef } from 'react'
import {
  ArrowLeft, Save, Download, ChevronRight, CheckCircle2, Circle,
  AlertCircle,
} from 'lucide-react'
import type { TemplateStructure, TemplateField, TemplateSection } from '../data/templateStructures'

interface TemplateEditorProps {
  structure: TemplateStructure
  initialData?: Record<string, string | string[]>
  onClose: () => void
  onSave: (name: string, data: Record<string, string | string[]>) => void
}

const inputClass = 'w-full py-2.5 px-3.5 border border-forge-border rounded-lg text-sm focus:ring-2 focus:ring-forge-teal/20 focus:border-forge-teal outline-none transition-colors bg-white'

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
          min={field.type === 'number' ? undefined : undefined}
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
                className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                  selected
                    ? 'bg-forge-teal text-white border-forge-teal'
                    : 'bg-white text-forge-text-muted border-forge-border hover:border-forge-teal/30'
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
        <div className="space-y-2">
          {field.options?.map((opt) => {
            const isChecked = checked.includes(opt)
            return (
              <label key={opt} className="flex items-start gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {
                    const next = isChecked ? checked.filter((c) => c !== opt) : [...checked, opt]
                    onChange(next)
                  }}
                  className="mt-0.5 w-4 h-4 rounded border-forge-border text-forge-teal focus:ring-forge-teal/20"
                />
                <span className={`text-sm leading-tight ${isChecked ? 'text-forge-text' : 'text-forge-text-muted group-hover:text-forge-text'}`}>
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
        <p className="text-sm text-forge-text-muted">{section.description}</p>
      )}
      <div className="grid grid-cols-2 gap-x-4 gap-y-5">
        {section.fields.map((field) => {
          const colSpan = field.half ? 'col-span-1' : 'col-span-2'
          return (
            <div key={field.id} className={colSpan}>
              <label className="flex items-center gap-1 text-sm font-medium text-forge-text mb-1.5">
                {field.label}
                {field.required && <span className="text-forge-danger">*</span>}
              </label>
              {field.helpText && (
                <p className="text-xs text-forge-text-faint mb-1.5">{field.helpText}</p>
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

export default function TemplateEditor({ structure, initialData, onClose, onSave }: TemplateEditorProps) {
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

  return (
    <div className="fixed inset-0 z-[100] bg-forge-bg flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 h-14 bg-white border-b border-forge-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-sm text-forge-text-muted hover:text-forge-text transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Templates
          </button>
          <span className="text-forge-border">|</span>
          <h1 className="text-sm font-semibold text-forge-text">{structure.templateName}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-forge-text-muted mr-2">
            <div className="w-24 h-1.5 bg-forge-border rounded-full overflow-hidden">
              <div
                className="h-full bg-forge-teal rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            {progressPct}% complete
          </div>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium border border-forge-border rounded-lg text-forge-text hover:bg-forge-bg transition-colors"
          >
            <Save size={14} />
            Save Draft
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg bg-forge-teal text-white hover:bg-forge-teal/90 transition-colors"
          >
            <Download size={14} />
            Save & Export
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Section sidebar */}
        <div className="w-[260px] bg-white border-r border-forge-border overflow-y-auto flex-shrink-0 py-4">
          <div className="px-4 mb-4">
            <input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="Document name..."
              className="w-full py-2 px-3 border border-forge-border rounded-lg text-sm focus:ring-2 focus:ring-forge-teal/20 focus:border-forge-teal outline-none"
            />
          </div>
          <nav className="space-y-0.5">
            {structure.sections.map((s, i) => {
              const progress = getSectionProgress(s, data)
              const isActive = i === activeSection
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSection(i)
                    contentRef.current?.scrollTo(0, 0)
                  }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors ${
                    isActive
                      ? 'bg-forge-teal-subtle text-forge-teal font-medium'
                      : 'text-forge-text-muted hover:bg-forge-bg hover:text-forge-text'
                  }`}
                >
                  {progress === 'complete' ? (
                    <CheckCircle2 size={15} className="text-forge-success flex-shrink-0" />
                  ) : progress === 'partial' ? (
                    <AlertCircle size={15} className="text-forge-warning flex-shrink-0" />
                  ) : (
                    <Circle size={15} className="text-forge-text-faint flex-shrink-0" />
                  )}
                  <span className="truncate">{s.title}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Form area */}
        <div ref={contentRef} className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 py-6">
            <div className="flex items-center gap-2 text-xs text-forge-text-faint mb-1">
              <span>Section {activeSection + 1} of {structure.sections.length}</span>
            </div>
            <h2 className="text-lg font-semibold text-forge-text mb-5">{section.title}</h2>

            <div className="bg-white rounded-xl border border-forge-border shadow-sm p-6">
              <SectionFields
                section={section}
                data={data}
                onChange={handleFieldChange}
              />
            </div>

            {/* Section navigation */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => {
                  if (activeSection > 0) {
                    setActiveSection(activeSection - 1)
                    contentRef.current?.scrollTo(0, 0)
                  }
                }}
                disabled={activeSection === 0}
                className="px-4 py-2 text-sm font-medium border border-forge-border rounded-lg text-forge-text hover:bg-forge-bg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {activeSection < structure.sections.length - 1 ? (
                <button
                  onClick={() => {
                    setActiveSection(activeSection + 1)
                    contentRef.current?.scrollTo(0, 0)
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-forge-teal text-white hover:bg-forge-teal/90 transition-colors"
                >
                  Next Section
                  <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-forge-teal text-white hover:bg-forge-teal/90 transition-colors"
                >
                  <Save size={14} />
                  Save & Finish
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save name prompt */}
      {showSaveConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" onClick={() => setShowSaveConfirm(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="relative bg-white rounded-xl shadow-xl border border-forge-border p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-forge-text mb-3">Save Document</h3>
            <p className="text-sm text-forge-text-muted mb-4">Give this document a name to save it.</p>
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
                className="px-4 py-2 text-sm font-medium border border-forge-border rounded-lg text-forge-text hover:bg-forge-bg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSave}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-forge-teal text-white hover:bg-forge-teal/90 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

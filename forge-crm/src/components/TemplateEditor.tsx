import { useState, useRef } from 'react'
import {
  ArrowLeft, Save, Download, ChevronRight, ChevronLeft,
  CheckCircle2, Circle, AlertCircle, FileText,
} from 'lucide-react'
import type { TemplateStructure, TemplateField, TemplateSection } from '../data/templateStructures'
import Badge from './Badge'

interface TemplateEditorProps {
  structure: TemplateStructure
  templateCategory: string
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
                className={`px-3.5 py-2 text-xs font-medium rounded-lg border-2 transition-all ${
                  selected
                    ? 'bg-forge-teal text-white border-forge-teal shadow-sm'
                    : 'bg-white text-forge-text-muted border-forge-border hover:border-forge-teal/40 hover:bg-forge-teal-subtle'
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
        <div className="space-y-1">
          {field.options?.map((opt) => {
            const isChecked = checked.includes(opt)
            return (
              <label
                key={opt}
                className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                  isChecked ? 'bg-forge-teal-subtle' : 'hover:bg-forge-bg'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {
                    const next = isChecked ? checked.filter((c) => c !== opt) : [...checked, opt]
                    onChange(next)
                  }}
                  className="mt-0.5 w-4 h-4 rounded border-forge-border text-forge-teal focus:ring-forge-teal/20"
                />
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
        <p className="text-sm text-forge-text-muted bg-forge-bg/60 rounded-lg px-4 py-3 border border-forge-border/50">
          {section.description}
        </p>
      )}
      <div className="grid grid-cols-2 gap-x-5 gap-y-5">
        {section.fields.map((field) => {
          const colSpan = field.half ? 'col-span-1' : 'col-span-2'
          return (
            <div key={field.id} className={colSpan}>
              <label className="flex items-center gap-1 text-sm font-medium text-forge-text mb-1.5">
                {field.label}
                {field.required && <span className="text-forge-danger text-xs">*</span>}
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

  return (
    <div className="space-y-0 -m-6">
      {/* Editor header — sits inside normal page flow */}
      <div className="bg-white border-b border-forge-border px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-sm text-forge-text-muted hover:text-forge-text transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Templates
          </button>
          <div className="flex items-center gap-2.5">
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

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-forge-teal-subtle flex items-center justify-center flex-shrink-0">
              <FileText size={18} className="text-forge-teal" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold text-forge-text truncate">{structure.templateName}</h1>
                <Badge variant="teal">{templateCategory}</Badge>
              </div>
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Name this document..."
                className="mt-0.5 text-sm text-forge-text-muted bg-transparent border-none outline-none w-64 placeholder:text-forge-text-faint"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right">
              <p className="text-xs text-forge-text-faint">{completedSections} of {structure.sections.length} sections</p>
              <p className="text-sm font-semibold text-forge-text">{progressPct}%</p>
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#E5E7EB" strokeWidth="4" />
                <circle cx="32" cy="32" r="28" fill="none" stroke="#0D9488" strokeWidth="4"
                  strokeDasharray={`${progressPct * 1.76} 176`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-forge-text">{progressPct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section stepper — horizontal steps bar */}
      <div className="bg-white border-b border-forge-border px-6">
        <div className="flex gap-0 overflow-x-auto">
          {structure.sections.map((s, i) => {
            const progress = getSectionProgress(s, data)
            const isActive = i === activeSection
            return (
              <button
                key={s.id}
                onClick={() => { setActiveSection(i); contentRef.current?.scrollTo(0, 0) }}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-forge-teal text-forge-teal'
                    : 'border-transparent text-forge-text-muted hover:text-forge-text hover:border-forge-border'
                }`}
              >
                {progress === 'complete' ? (
                  <CheckCircle2 size={13} className="text-forge-success flex-shrink-0" />
                ) : progress === 'partial' ? (
                  <AlertCircle size={13} className="text-forge-warning flex-shrink-0" />
                ) : (
                  <Circle size={13} className={`flex-shrink-0 ${isActive ? 'text-forge-teal' : 'text-forge-text-faint'}`} />
                )}
                <span className="hidden lg:inline">{s.title}</span>
                <span className="lg:hidden">{i + 1}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Form content */}
      <div ref={contentRef} className="px-6 py-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
        <div className="max-w-3xl">
          <h2 className="text-lg font-semibold text-forge-text mb-1">{section.title}</h2>
          <p className="text-xs text-forge-text-faint mb-5">
            Section {activeSection + 1} of {structure.sections.length}
            {' '}&middot;{' '}
            {section.fields.length} fields
          </p>

          <div className="bg-white rounded-xl border border-forge-border shadow-sm">
            <div className="p-6">
              <SectionFields section={section} data={data} onChange={handleFieldChange} />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pb-4">
            <button
              onClick={() => { if (activeSection > 0) { setActiveSection(activeSection - 1); contentRef.current?.scrollTo(0, 0) } }}
              disabled={activeSection === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border border-forge-border rounded-lg text-forge-text hover:bg-forge-bg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
              Previous
            </button>

            <div className="flex items-center gap-1.5">
              {structure.sections.map((s, i) => {
                const p = getSectionProgress(s, data)
                return (
                  <button
                    key={s.id}
                    onClick={() => { setActiveSection(i); contentRef.current?.scrollTo(0, 0) }}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === activeSection
                        ? 'bg-forge-teal scale-125'
                        : p === 'complete'
                        ? 'bg-forge-success'
                        : p === 'partial'
                        ? 'bg-forge-warning'
                        : 'bg-forge-border'
                    }`}
                    title={s.title}
                  />
                )
              })}
            </div>

            {activeSection < structure.sections.length - 1 ? (
              <button
                onClick={() => { setActiveSection(activeSection + 1); contentRef.current?.scrollTo(0, 0) }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-lg bg-forge-teal text-white hover:bg-forge-teal/90 transition-colors"
              >
                Next Section
                <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-lg bg-forge-teal text-white hover:bg-forge-teal/90 transition-colors"
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
          <div className="relative bg-white rounded-xl shadow-xl border border-forge-border p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-forge-text mb-1">Save Document</h3>
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

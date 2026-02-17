import { useState, useMemo, useCallback } from 'react'
import { Play, Plus, Calendar, User, FileText, CheckCircle } from 'lucide-react'
import { securityDomains } from '../data/mockData'
import {
  getAssessments,
  getAssessment,
  createAssessment,
  updateAssessmentRatings,
  getOrganizations,
  getOrganization,
} from '../lib/api'
import Badge from '../components/Badge'
import Card from '../components/Card'
import Modal from '../components/Modal'

type Tab = 'active' | 'new' | 'completed'
type ModalTab = 'org' | 'domains' | 'findings' | 'recommendations' | 'report'

const ratingLabels = ['Critical', 'Developing', 'Defined', 'Managed', 'Mature']
const ratingColors = [
  'bg-forge-danger text-white',
  'bg-forge-warning text-white',
  'bg-forge-info text-white',
  'bg-forge-teal text-white',
  'bg-forge-success text-white',
]

const severityColors: Record<string, string> = {
  critical: 'bg-red-500/8 text-red-600 border border-red-200',
  high: 'bg-orange-500/8 text-orange-600 border border-orange-200',
  medium: 'bg-forge-warning/8 text-forge-warning border border-forge-warning/20',
  low: 'bg-forge-info/8 text-forge-info border border-forge-info/20',
}

function getProgressColor(progress: number): string {
  if (progress < 40) return 'bg-forge-warning'
  if (progress <= 80) return 'bg-forge-teal'
  return 'bg-forge-success'
}

/** Map assessment type string to a Badge variant color */
function getTypeVariant(type: string): 'navy' | 'teal' | 'info' | 'warning' | 'success' | 'danger' {
  const lower = type.toLowerCase()
  if (lower.includes('cmmc')) return 'navy'
  if (lower.includes('security posture') || lower.includes('security assessment')) return 'teal'
  if (lower.includes('gap')) return 'info'
  if (lower.includes('hipaa')) return 'warning'
  if (lower.includes('penetration') || lower.includes('pentest')) return 'danger'
  if (lower.includes('rmf')) return 'navy'
  return 'info'
}

const inputClasses =
  'w-full py-2.5 px-3.5 border border-forge-border rounded-lg text-sm text-forge-text bg-white focus:outline-none focus:ring-2 focus:ring-forge-teal/20 focus:border-forge-teal transition-colors'

export default function Assessments() {
  const [activeTab, setActiveTab] = useState<Tab>('active')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTab, setModalTab] = useState<ModalTab>('org')
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null)
  const [ratings, setRatings] = useState<Record<string, number>>({})

  // New Assessment form state
  const [formCustomerId, setFormCustomerId] = useState('')
  const [formType, setFormType] = useState('')
  const [formConsultant, setFormConsultant] = useState('')
  const [formStartDate, setFormStartDate] = useState('')
  const [formSuccess, setFormSuccess] = useState(false)

  const [allAssessments, setAllAssessments] = useState(() => getAssessments())
  const [organizations, setOrganizations] = useState(() => getOrganizations())

  const refresh = useCallback(() => {
    setAllAssessments(getAssessments())
    setOrganizations(getOrganizations())
  }, [])

  const activeAssessments = useMemo(() => allAssessments.filter((a) => a.status !== 'completed'), [allAssessments])
  const completedAssessments = useMemo(() => allAssessments.filter((a) => a.status === 'completed'), [allAssessments])

  const selectedAssessment = useMemo(
    () => (selectedAssessmentId ? allAssessments.find((a) => a.id === selectedAssessmentId) : undefined),
    [selectedAssessmentId, allAssessments]
  )

  const selectedOrg = useMemo(
    () => (selectedAssessment ? getOrganization(selectedAssessment.organizationId) : undefined),
    [selectedAssessment]
  )

  const tabs: { key: Tab; label: string }[] = [
    { key: 'active', label: 'Active' },
    { key: 'new', label: 'New Assessment' },
    { key: 'completed', label: 'Completed' },
  ]

  const modalTabs: { key: ModalTab; label: string }[] = [
    { key: 'org', label: 'Organization' },
    { key: 'domains', label: 'Domains' },
    { key: 'findings', label: 'Findings' },
    { key: 'recommendations', label: 'Actions' },
    { key: 'report', label: 'Report' },
  ]

  const openAssessment = (assessmentId: string) => {
    const assessment = getAssessment(assessmentId)
    setSelectedAssessmentId(assessmentId)
    setRatings(assessment?.domainRatings ?? {})
    setModalTab('org')
    setModalOpen(true)
  }

  const setDomainRating = (domain: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [domain]: rating }))
  }

  const handleSaveProgress = () => {
    if (selectedAssessmentId) {
      updateAssessmentRatings(selectedAssessmentId, ratings)
      refresh()
    }
    setModalOpen(false)
  }

  const handleCreateAssessment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formCustomerId || !formType || !formConsultant) return

    createAssessment({
      customerId: formCustomerId,
      type: formType,
      consultant: formConsultant,
      targetDate: formStartDate,
    })

    // Reset form
    setFormCustomerId('')
    setFormType('')
    setFormConsultant('')
    setFormStartDate('')
    setFormSuccess(true)
    refresh()

    // Switch to active tab after a brief delay so user sees the success message
    setTimeout(() => {
      setFormSuccess(false)
      setActiveTab('active')
    }, 1500)
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

      {/* Active Assessments */}
      {activeTab === 'active' && (
        <Card title="Active Assessments" noPadding>
          <table className="w-full">
            <thead>
              <tr className="border-b border-forge-border bg-forge-bg/50">
                <th scope="col" className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Customer</th>
                <th scope="col" className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Type</th>
                <th scope="col" className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Started</th>
                <th scope="col" className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Progress</th>
                <th scope="col" className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Consultant</th>
                <th scope="col" className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {activeAssessments.map((assessment) => (
                <tr key={assessment.id} className="border-b border-forge-border/60 last:border-0 hover:bg-forge-bg/30 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-forge-text">{assessment.organizationName}</td>
                  <td className="py-3 px-4"><Badge variant={getTypeVariant(assessment.type)}>{assessment.type}</Badge></td>
                  <td className="py-3 px-4 text-sm text-forge-text-muted">{assessment.startedAt}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-forge-bg rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${getProgressColor(assessment.progress)}`} style={{ width: `${assessment.progress}%` }} />
                      </div>
                      <span className="text-xs font-medium text-forge-text-muted w-8">{assessment.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-forge-text-muted">{assessment.consultant}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => openAssessment(assessment.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-forge-teal/30 text-forge-teal text-xs font-medium hover:bg-forge-teal-subtle transition-colors"
                    >
                      <Play size={12} />
                      Continue
                    </button>
                  </td>
                </tr>
              ))}
              {activeAssessments.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-forge-text-muted">
                    No active assessments. Create one from the "New Assessment" tab.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      )}

      {/* New Assessment */}
      {activeTab === 'new' && (
        <Card title="Create New Assessment">
          {formSuccess && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-forge-success/8 border border-forge-success/20 px-4 py-3 text-sm text-forge-success">
              <CheckCircle size={16} />
              Assessment created successfully! Redirecting to Active tab...
            </div>
          )}
          <form className="space-y-4 max-w-2xl" onSubmit={handleCreateAssessment}>
            <div>
              <label className="block text-sm font-medium text-forge-text mb-1.5">
                <User size={13} className="inline mr-1" />Customer
              </label>
              <select
                className={inputClasses}
                value={formCustomerId}
                onChange={(e) => setFormCustomerId(e.target.value)}
                required
              >
                <option value="">Select customer...</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-forge-text mb-1.5">
                <FileText size={13} className="inline mr-1" />Assessment Type
              </label>
              <select
                className={inputClasses}
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                required
              >
                <option value="">Select type...</option>
                <option value="Security Posture Assessment">Security Posture Assessment</option>
                <option value="CMMC 2.0 Gap Analysis">CMMC 2.0 Gap Analysis</option>
                <option value="HIPAA Gap Analysis">HIPAA Gap Analysis</option>
                <option value="Penetration Test">Penetration Test</option>
                <option value="RMF Assessment">RMF Assessment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-forge-text mb-1.5">
                <User size={13} className="inline mr-1" />Assigned Consultant
              </label>
              <select
                className={inputClasses}
                value={formConsultant}
                onChange={(e) => setFormConsultant(e.target.value)}
                required
              >
                <option value="">Select consultant...</option>
                <option value="Michael Torres">Michael Torres</option>
                <option value="Sarah Mitchell">Sarah Mitchell</option>
                <option value="James Wilson">James Wilson</option>
                <option value="Emily Chen">Emily Chen</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-forge-text mb-1.5">
                <Calendar size={13} className="inline mr-1" />Start Date
              </label>
              <input
                type="date"
                className={inputClasses}
                value={formStartDate}
                onChange={(e) => setFormStartDate(e.target.value)}
              />
            </div>
            <div className="pt-3">
              <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-forge-teal text-white text-sm font-medium hover:bg-forge-teal/90 transition-colors">
                <Plus size={16} />
                Create Assessment
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Completed */}
      {activeTab === 'completed' && (
        <>
          {completedAssessments.length > 0 ? (
            <Card title="Completed Assessments" noPadding>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-forge-border bg-forge-bg/50">
                    <th scope="col" className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Customer</th>
                    <th scope="col" className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Type</th>
                    <th scope="col" className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Started</th>
                    <th scope="col" className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Completed</th>
                    <th scope="col" className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Consultant</th>
                    <th scope="col" className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {completedAssessments.map((assessment) => (
                    <tr key={assessment.id} className="border-b border-forge-border/60 last:border-0 hover:bg-forge-bg/30 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium text-forge-text">{assessment.organizationName}</td>
                      <td className="py-3 px-4"><Badge variant={getTypeVariant(assessment.type)}>{assessment.type}</Badge></td>
                      <td className="py-3 px-4 text-sm text-forge-text-muted">{assessment.startedAt}</td>
                      <td className="py-3 px-4 text-sm text-forge-text-muted">{assessment.completedAt ?? '—'}</td>
                      <td className="py-3 px-4 text-sm text-forge-text-muted">{assessment.consultant}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => openAssessment(assessment.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-forge-teal/30 text-forge-teal text-xs font-medium hover:bg-forge-teal-subtle transition-colors"
                        >
                          <FileText size={12} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          ) : (
            <Card>
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-12 h-12 rounded-lg bg-forge-success/8 flex items-center justify-center mb-4">
                  <FileText size={22} className="text-forge-success" />
                </div>
                <h3 className="text-base font-semibold text-forge-text mb-1">Completed Assessments</h3>
                <p className="text-sm text-forge-text-muted max-w-md">Historical assessment records and archived reports will appear here.</p>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Assessment Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Assessment — ${selectedAssessment?.organizationName ?? ''}`}
        footer={
          <div className="flex gap-2">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-forge-border text-sm font-medium text-forge-text-muted hover:bg-forge-bg transition-colors">
              Close
            </button>
            <button
              onClick={handleSaveProgress}
              className="px-4 py-2 rounded-lg bg-forge-teal text-white text-sm font-medium hover:bg-forge-teal/90 transition-colors"
            >
              Save Progress
            </button>
          </div>
        }
      >
        {/* Modal Tab Bar */}
        <div className="flex gap-1 border-b border-forge-border mb-5">
          {modalTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setModalTab(tab.key)}
              className={`px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px ${
                modalTab === tab.key
                  ? 'border-forge-teal text-forge-teal'
                  : 'border-transparent text-forge-text-muted hover:text-forge-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Organization Info */}
        {modalTab === 'org' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-forge-bg rounded-lg">
                <p className="text-[11px] text-forge-text-muted uppercase tracking-wide mb-1">Organization</p>
                <p className="text-sm font-medium text-forge-text">{selectedAssessment?.organizationName ?? '—'}</p>
              </div>
              <div className="p-3.5 bg-forge-bg rounded-lg">
                <p className="text-[11px] text-forge-text-muted uppercase tracking-wide mb-1">Industry</p>
                <p className="text-sm font-medium text-forge-text">{selectedOrg?.sector || '—'}</p>
              </div>
              <div className="p-3.5 bg-forge-bg rounded-lg">
                <p className="text-[11px] text-forge-text-muted uppercase tracking-wide mb-1">Location</p>
                <p className="text-sm font-medium text-forge-text">{selectedOrg?.cityStateZip || '—'}</p>
              </div>
              <div className="p-3.5 bg-forge-bg rounded-lg">
                <p className="text-[11px] text-forge-text-muted uppercase tracking-wide mb-1">Framework</p>
                <p className="text-sm font-medium text-forge-text">{selectedAssessment?.type ?? '—'}</p>
              </div>
            </div>
            <div className="p-3.5 bg-forge-bg rounded-lg">
              <p className="text-[11px] text-forge-text-muted uppercase tracking-wide mb-1">Scope Notes</p>
              <p className="text-sm text-forge-text">
                Full enterprise assessment covering all CUI-handling systems. Includes 3 data centers and 12 remote offices. Approximately 2,500 endpoints in scope.
              </p>
            </div>
          </div>
        )}

        {/* Domain Ratings */}
        {modalTab === 'domains' && (
          <div className="grid grid-cols-2 gap-3">
            {securityDomains.map((domain) => (
              <div key={domain} className="p-3.5 rounded-lg border border-forge-border">
                <p className="text-sm font-medium text-forge-text mb-2.5">{domain}</p>
                <div className="flex gap-1.5">
                  {ratingLabels.map((label, idx) => {
                    const ratingValue = idx + 1
                    const isSelected = ratings[domain] === ratingValue
                    return (
                      <button
                        key={label}
                        onClick={() => setDomainRating(domain, ratingValue)}
                        className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${
                          isSelected ? ratingColors[idx] : 'bg-forge-bg text-forge-text-muted hover:bg-forge-bg-hover'
                        }`}
                        title={label}
                      >
                        {ratingValue}
                      </button>
                    )
                  })}
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] text-forge-text-faint">Critical</span>
                  <span className="text-[10px] text-forge-text-faint">Mature</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Findings */}
        {modalTab === 'findings' && (
          <div className="space-y-3">
            {selectedAssessment && selectedAssessment.findings.length > 0 ? (
              selectedAssessment.findings.map((finding) => (
                <div key={finding.id} className="p-3.5 rounded-lg border border-forge-border">
                  <div className="flex items-start justify-between mb-1.5">
                    <h4 className="text-sm font-medium text-forge-text">{finding.title}</h4>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium capitalize ${severityColors[finding.severity]}`}>
                      {finding.severity}
                    </span>
                  </div>
                  <p className="text-sm text-forge-text-muted">{finding.description}</p>
                  {finding.nistControl && (
                    <p className="text-xs text-forge-text-faint mt-1">NIST Control: {finding.nistControl}</p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-sm text-forge-text-muted">
                No findings recorded for this assessment yet.
              </div>
            )}
          </div>
        )}

        {/* Recommendations */}
        {modalTab === 'recommendations' && (
          <div className="space-y-3">
            {[
              { num: 1, priority: 'danger', title: 'Immediate: Patch Domain Controllers', desc: 'Apply latest security patches to all domain controllers. Schedule emergency maintenance window within 72 hours.' },
              { num: 2, priority: 'warning', title: 'High: Strengthen Password Policy', desc: 'Implement 16-character minimum password policy with complexity requirements. Deploy MFA for all privileged accounts within 30 days.' },
              { num: 3, priority: 'info', title: 'Medium: Expand SIEM Coverage', desc: 'Deploy log forwarding agents to remaining 30% of endpoints. Configure unified audit policy across all systems.' },
            ].map((rec) => (
              <div key={rec.num} className="p-3.5 rounded-lg border border-forge-border">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-semibold bg-forge-${rec.priority}/8 text-forge-${rec.priority}`}>{rec.num}</span>
                  <h4 className="text-sm font-medium text-forge-text">{rec.title}</h4>
                </div>
                <p className="text-sm text-forge-text-muted ml-7">{rec.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Generate Report */}
        {modalTab === 'report' && (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-lg bg-forge-teal-subtle flex items-center justify-center mx-auto mb-4">
              <FileText size={22} className="text-forge-teal" />
            </div>
            <h3 className="text-base font-semibold text-forge-text mb-1">Generate Report</h3>
            <p className="text-sm text-forge-text-muted max-w-md mx-auto mb-5">
              Compile all domain ratings, findings, and recommendations into a comprehensive document.
            </p>
            <div className="flex justify-center gap-2">
              <button className="px-4 py-2 rounded-lg border border-forge-border text-sm font-medium text-forge-text-muted hover:bg-forge-bg transition-colors">
                Preview Draft
              </button>
              <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-forge-teal text-white text-sm font-medium hover:bg-forge-teal/90 transition-colors">
                <FileText size={15} />
                Generate PDF
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

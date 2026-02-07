import { useState } from 'react'
import { Play, Plus, Calendar, User, FileText } from 'lucide-react'
import { activeAssessments, customers, securityDomains, sampleFindings } from '../data/mockData'
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

const inputClasses =
  'w-full py-2.5 px-3.5 border border-forge-border rounded-lg text-sm text-forge-text bg-white focus:outline-none focus:ring-2 focus:ring-forge-teal/20 focus:border-forge-teal transition-colors'

export default function Assessments() {
  const [activeTab, setActiveTab] = useState<Tab>('active')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTab, setModalTab] = useState<ModalTab>('org')
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null)
  const [ratings, setRatings] = useState<Record<string, number>>({})

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

  const openAssessment = (customer: string) => {
    setSelectedAssessment(customer)
    setModalTab('org')
    setModalOpen(true)
  }

  const setDomainRating = (domain: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [domain]: rating }))
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
                <th className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Customer</th>
                <th className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Type</th>
                <th className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Started</th>
                <th className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Progress</th>
                <th className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Consultant</th>
                <th className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-2.5 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {activeAssessments.map((assessment) => (
                <tr key={assessment.customer} className="border-b border-forge-border/60 last:border-0 hover:bg-forge-bg/30 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-forge-text">{assessment.customer}</td>
                  <td className="py-3 px-4"><Badge variant={assessment.typeClass}>{assessment.type}</Badge></td>
                  <td className="py-3 px-4 text-sm text-forge-text-muted">{assessment.started}</td>
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
                      onClick={() => openAssessment(assessment.customer)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-forge-teal/30 text-forge-teal text-xs font-medium hover:bg-forge-teal-subtle transition-colors"
                    >
                      <Play size={12} />
                      Continue
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* New Assessment */}
      {activeTab === 'new' && (
        <Card title="Create New Assessment">
          <form className="space-y-4 max-w-2xl" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-forge-text mb-1.5">
                <User size={13} className="inline mr-1" />Customer
              </label>
              <select className={inputClasses}>
                <option value="">Select customer...</option>
                {customers.map((c) => (<option key={c.name} value={c.name}>{c.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-forge-text mb-1.5">
                <FileText size={13} className="inline mr-1" />Assessment Type
              </label>
              <select className={inputClasses}>
                <option value="">Select type...</option>
                <option value="spa">Security Posture Assessment</option>
                <option value="cmmc">CMMC 2.0 Gap Analysis</option>
                <option value="hipaa">HIPAA Gap Analysis</option>
                <option value="pentest">Penetration Test</option>
                <option value="rmf">RMF Assessment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-forge-text mb-1.5">
                <User size={13} className="inline mr-1" />Assigned Consultant
              </label>
              <select className={inputClasses}>
                <option value="">Select consultant...</option>
                <option value="mt">Michael Torres</option>
                <option value="sm">Sarah Mitchell</option>
                <option value="jw">James Wilson</option>
                <option value="ec">Emily Chen</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-forge-text mb-1.5">
                <Calendar size={13} className="inline mr-1" />Start Date
              </label>
              <input type="date" className={inputClasses} />
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

      {/* Assessment Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Assessment — ${selectedAssessment || ''}`}
        footer={
          <div className="flex gap-2">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-forge-border text-sm font-medium text-forge-text-muted hover:bg-forge-bg transition-colors">
              Close
            </button>
            <button className="px-4 py-2 rounded-lg bg-forge-teal text-white text-sm font-medium hover:bg-forge-teal/90 transition-colors">
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
                <p className="text-sm font-medium text-forge-text">{selectedAssessment}</p>
              </div>
              <div className="p-3.5 bg-forge-bg rounded-lg">
                <p className="text-[11px] text-forge-text-muted uppercase tracking-wide mb-1">Industry</p>
                <p className="text-sm font-medium text-forge-text">Defense Contractor</p>
              </div>
              <div className="p-3.5 bg-forge-bg rounded-lg">
                <p className="text-[11px] text-forge-text-muted uppercase tracking-wide mb-1">Primary Contact</p>
                <p className="text-sm font-medium text-forge-text">John Smith, CISO</p>
              </div>
              <div className="p-3.5 bg-forge-bg rounded-lg">
                <p className="text-[11px] text-forge-text-muted uppercase tracking-wide mb-1">Framework</p>
                <p className="text-sm font-medium text-forge-text">CMMC 2.0 Level 2</p>
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
            {sampleFindings.map((finding) => (
              <div key={finding.title} className="p-3.5 rounded-lg border border-forge-border">
                <div className="flex items-start justify-between mb-1.5">
                  <h4 className="text-sm font-medium text-forge-text">{finding.title}</h4>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium capitalize ${severityColors[finding.severity]}`}>
                    {finding.severity}
                  </span>
                </div>
                <p className="text-sm text-forge-text-muted">{finding.desc}</p>
              </div>
            ))}
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

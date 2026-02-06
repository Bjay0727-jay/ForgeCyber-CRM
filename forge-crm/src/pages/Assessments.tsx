import { useState } from 'react';
import { Play, Plus, Calendar, User, FileText } from 'lucide-react';
import { activeAssessments, customers, securityDomains, sampleFindings } from '../data/mockData';
import Badge from '../components/Badge';
import Card from '../components/Card';
import Modal from '../components/Modal';

type Tab = 'active' | 'new' | 'completed';
type ModalTab = 'org' | 'domains' | 'findings' | 'recommendations' | 'report';

const ratingLabels = ['Critical', 'Developing', 'Defined', 'Managed', 'Mature'];
const ratingColors = [
  'bg-forge-danger text-white',
  'bg-forge-warning text-white',
  'bg-forge-info text-white',
  'bg-forge-teal text-white',
  'bg-forge-success text-white',
];

const severityColors: Record<string, string> = {
  critical: 'bg-red-500/10 text-red-600 border border-red-200',
  high: 'bg-orange-500/10 text-orange-600 border border-orange-200',
  medium: 'bg-forge-warning/10 text-forge-warning border border-forge-warning/20',
  low: 'bg-forge-info/10 text-forge-info border border-forge-info/20',
};

function getProgressColor(progress: number): string {
  if (progress < 40) return 'bg-forge-warning';
  if (progress <= 80) return 'bg-forge-teal';
  return 'bg-forge-success';
}

export default function Assessments() {
  const [activeTab, setActiveTab] = useState<Tab>('active');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<ModalTab>('org');
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const tabs: { key: Tab; label: string }[] = [
    { key: 'active', label: 'Active Assessments' },
    { key: 'new', label: 'New Assessment' },
    { key: 'completed', label: 'Completed' },
  ];

  const modalTabs: { key: ModalTab; label: string }[] = [
    { key: 'org', label: 'Organization Info' },
    { key: 'domains', label: 'Domain Ratings' },
    { key: 'findings', label: 'Findings' },
    { key: 'recommendations', label: 'Recommendations' },
    { key: 'report', label: 'Generate Report' },
  ];

  const openAssessment = (customer: string) => {
    setSelectedAssessment(customer);
    setModalTab('org');
    setModalOpen(true);
  };

  const setDomainRating = (domain: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [domain]: rating }));
  };

  const inputClasses =
    'w-full py-3 px-4 border border-forge-border rounded-xl text-sm focus:outline-none focus:border-forge-teal focus:ring-3 focus:ring-forge-teal-glow transition-all';

  return (
    <div className="space-y-6">
      {/* Tab Bar */}
      <div className="flex gap-1 bg-forge-bg p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-white shadow-sm text-forge-teal'
                : 'text-forge-text-muted hover:text-forge-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Assessments */}
      {activeTab === 'active' && (
        <Card title="Active Assessments">
          <div className="-m-6">
            <table className="w-full">
              <thead>
                <tr className="bg-forge-bg">
                  <th className="text-left uppercase text-xs font-semibold text-forge-text-muted py-3 px-4">
                    Customer
                  </th>
                  <th className="text-left uppercase text-xs font-semibold text-forge-text-muted py-3 px-4">
                    Assessment Type
                  </th>
                  <th className="text-left uppercase text-xs font-semibold text-forge-text-muted py-3 px-4">
                    Started
                  </th>
                  <th className="text-left uppercase text-xs font-semibold text-forge-text-muted py-3 px-4">
                    Progress
                  </th>
                  <th className="text-left uppercase text-xs font-semibold text-forge-text-muted py-3 px-4">
                    Consultant
                  </th>
                  <th className="text-left uppercase text-xs font-semibold text-forge-text-muted py-3 px-4">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeAssessments.map((assessment) => (
                  <tr
                    key={assessment.customer}
                    className="border-b border-forge-border hover:bg-forge-teal/[0.03] transition-colors"
                  >
                    <td className="py-4 px-4 font-semibold text-forge-navy text-sm">
                      {assessment.customer}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={assessment.typeClass}>
                        {assessment.type}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-forge-text-muted">
                      {assessment.started}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-forge-bg rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${getProgressColor(assessment.progress)}`}
                            style={{ width: `${assessment.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-forge-text-muted min-w-[36px]">
                          {assessment.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-forge-text-muted">
                      {assessment.consultant}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => openAssessment(assessment.customer)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-forge-teal text-forge-teal text-sm font-semibold hover:bg-forge-teal-glow transition-colors"
                      >
                        <Play size={14} />
                        Continue
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* New Assessment */}
      {activeTab === 'new' && (
        <Card title="Create New Assessment">
          <form className="space-y-5 max-w-2xl" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-forge-text mb-2">
                <User size={14} className="inline mr-1.5" />
                Customer
              </label>
              <select className={inputClasses}>
                <option value="">Select customer...</option>
                {customers.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-forge-text mb-2">
                <FileText size={14} className="inline mr-1.5" />
                Assessment Type
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
              <label className="block text-sm font-medium text-forge-text mb-2">
                <User size={14} className="inline mr-1.5" />
                Assigned Consultant
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
              <label className="block text-sm font-medium text-forge-text mb-2">
                <Calendar size={14} className="inline mr-1.5" />
                Start Date
              </label>
              <input type="date" className={inputClasses} />
            </div>
            <div className="pt-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-forge-teal to-forge-teal-light text-white text-sm font-semibold shadow-lg shadow-forge-teal/25 hover:-translate-y-0.5 transition-all duration-200"
              >
                <Plus size={18} />
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
            <div className="w-16 h-16 rounded-2xl bg-forge-success/10 flex items-center justify-center mb-4">
              <FileText size={28} className="text-forge-success" />
            </div>
            <h3 className="font-heading text-lg font-bold text-forge-navy mb-2">
              Completed Assessments
            </h3>
            <p className="text-sm text-forge-text-muted max-w-md">
              Historical assessment records and archived reports will appear here.
            </p>
          </div>
        </Card>
      )}

      {/* Assessment Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Assessment \u2014 ${selectedAssessment || ''}`}
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => setModalOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-forge-border text-sm font-semibold text-forge-text-muted hover:bg-forge-bg transition-colors"
            >
              Close
            </button>
            <button className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-forge-teal to-forge-teal-light text-white text-sm font-semibold shadow-lg shadow-forge-teal/25 hover:-translate-y-0.5 transition-all duration-200">
              Save Progress
            </button>
          </div>
        }
      >
        {/* Modal Tab Bar */}
        <div className="flex gap-1 bg-forge-bg p-1 rounded-xl mb-6">
          {modalTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setModalTab(tab.key)}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                modalTab === tab.key
                  ? 'bg-white shadow-sm text-forge-teal'
                  : 'text-forge-text-muted hover:text-forge-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Organization Info */}
        {modalTab === 'org' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-forge-bg rounded-xl">
                <p className="text-xs text-forge-text-muted mb-1">Organization</p>
                <p className="font-semibold text-forge-navy">{selectedAssessment}</p>
              </div>
              <div className="p-4 bg-forge-bg rounded-xl">
                <p className="text-xs text-forge-text-muted mb-1">Industry</p>
                <p className="font-semibold text-forge-navy">Defense Contractor</p>
              </div>
              <div className="p-4 bg-forge-bg rounded-xl">
                <p className="text-xs text-forge-text-muted mb-1">Primary Contact</p>
                <p className="font-semibold text-forge-navy">John Smith, CISO</p>
              </div>
              <div className="p-4 bg-forge-bg rounded-xl">
                <p className="text-xs text-forge-text-muted mb-1">Framework</p>
                <p className="font-semibold text-forge-navy">CMMC 2.0 Level 2</p>
              </div>
            </div>
            <div className="p-4 bg-forge-bg rounded-xl">
              <p className="text-xs text-forge-text-muted mb-1">Scope Notes</p>
              <p className="text-sm text-forge-text">
                Full enterprise assessment covering all CUI-handling systems. Includes 3 data centers and 12 remote offices. Approximately 2,500 endpoints in scope.
              </p>
            </div>
          </div>
        )}

        {/* Domain Ratings */}
        {modalTab === 'domains' && (
          <div className="grid grid-cols-2 gap-4">
            {securityDomains.map((domain) => (
              <div
                key={domain}
                className="p-4 rounded-xl border border-forge-border"
              >
                <p className="font-semibold text-sm text-forge-navy mb-3">
                  {domain}
                </p>
                <div className="flex gap-2">
                  {ratingLabels.map((label, idx) => {
                    const ratingValue = idx + 1;
                    const isSelected = ratings[domain] === ratingValue;
                    return (
                      <button
                        key={label}
                        onClick={() => setDomainRating(domain, ratingValue)}
                        className={`flex-1 py-2 px-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                          isSelected
                            ? ratingColors[idx]
                            : 'bg-forge-bg text-forge-text-muted hover:bg-forge-border'
                        }`}
                        title={label}
                      >
                        {ratingValue}
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] text-forge-text-muted">Critical</span>
                  <span className="text-[10px] text-forge-text-muted">Mature</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Findings */}
        {modalTab === 'findings' && (
          <div className="space-y-4">
            {sampleFindings.map((finding) => (
              <div
                key={finding.title}
                className="p-4 rounded-xl border border-forge-border"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm text-forge-navy">
                    {finding.title}
                  </h4>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${severityColors[finding.severity]}`}
                  >
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
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-forge-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-forge-danger/10 text-forge-danger flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <h4 className="font-semibold text-sm text-forge-navy">
                  Immediate: Patch Domain Controllers
                </h4>
              </div>
              <p className="text-sm text-forge-text-muted ml-8">
                Apply latest security patches to all domain controllers. Schedule emergency maintenance window within 72 hours. Test patches in staging environment first.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-forge-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-forge-warning/10 text-forge-warning flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <h4 className="font-semibold text-sm text-forge-navy">
                  High Priority: Strengthen Password Policy
                </h4>
              </div>
              <p className="text-sm text-forge-text-muted ml-8">
                Implement 16-character minimum password policy with complexity requirements. Deploy MFA for all privileged accounts within 30 days. Consider passwordless authentication.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-forge-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-forge-info/10 text-forge-info flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <h4 className="font-semibold text-sm text-forge-navy">
                  Medium: Expand SIEM Coverage
                </h4>
              </div>
              <p className="text-sm text-forge-text-muted ml-8">
                Deploy log forwarding agents to remaining 30% of endpoints. Configure unified audit policy across all systems. Establish 90-day log retention minimum.
              </p>
            </div>
          </div>
        )}

        {/* Generate Report */}
        {modalTab === 'report' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-forge-teal-glow flex items-center justify-center mx-auto mb-4">
              <FileText size={28} className="text-forge-teal" />
            </div>
            <h3 className="font-heading text-lg font-bold text-forge-navy mb-2">
              Generate Assessment Report
            </h3>
            <p className="text-sm text-forge-text-muted max-w-md mx-auto mb-6">
              Compile all domain ratings, findings, and recommendations into a comprehensive report document.
            </p>
            <div className="flex justify-center gap-3">
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-forge-border text-sm font-semibold text-forge-text-muted hover:bg-forge-bg transition-colors">
                Preview Draft
              </button>
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-forge-teal to-forge-teal-light text-white text-sm font-semibold shadow-lg shadow-forge-teal/25 hover:-translate-y-0.5 transition-all duration-200">
                <FileText size={16} />
                Generate PDF Report
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

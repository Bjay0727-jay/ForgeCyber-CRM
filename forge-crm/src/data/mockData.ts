export const dashboardStats = [
  { label: 'Active Customers', value: '0', change: 'No data yet', positive: null, icon: 'users', highlight: true, link: '/crm' },
  { label: 'Assessments In Progress', value: '0', change: 'No assessments', positive: null, icon: 'clipboard-check', link: '/assessments' },
  { label: 'Reports Pending', value: '0', change: 'None pending', positive: null, icon: 'file-text', link: '/reports' },
  { label: 'Pipeline Value', value: '$0', change: 'No pipeline data', positive: null, icon: 'dollar-sign', link: '/crm' },
]

export const engagements: { customer: string; type: string; status: string; statusType: 'warning' | 'success' | 'info' | 'danger'; consultant: string; dueDate: string }[] = []

export const activities: { type: 'complete' | 'create' | 'update' | 'alert'; text: string; time: string }[] = []

export const pipelineColumns = [
  { title: 'Lead', count: 0, colorClass: 'border-forge-info', cards: [] as { name: string; meta: string; value: string }[] },
  { title: 'Assessment', count: 0, colorClass: 'border-forge-warning', cards: [] as { name: string; meta: string; value: string }[] },
  { title: 'Proposal', count: 0, colorClass: 'border-forge-teal', cards: [] as { name: string; meta: string; value: string }[] },
  { title: 'Negotiation', count: 0, colorClass: 'border-forge-purple', cards: [] as { name: string; meta: string; value: string }[] },
  { title: 'Closed Won', count: 0, colorClass: 'border-forge-success', cards: [] as { name: string; meta: string; value: string }[] },
]

export const customers: { initials: string; name: string; detail: string; stage: string; stageType: 'warning' | 'success' | 'info' | 'danger'; lastContact: string }[] = []

export const activeAssessments: { customer: string; type: string; typeClass: 'navy' | 'teal' | 'info'; started: string; progress: number; consultant: string }[] = []

export const workflowPhases = [
  {
    title: 'Phase 1: Initial Discovery & Intake', duration: '1-2 Days', status: 'pending' as const,
    desc: 'Customer intake, stakeholder identification, scope definition, and preliminary documentation review. Establish communication channels and project timeline.',
    deliverables: ['Customer Intake Form', 'Engagement Letter', 'NDA', 'Kickoff Meeting'],
  },
  {
    title: 'Phase 2: Technical Discovery & Scanning', duration: '3-5 Days', status: 'pending' as const,
    desc: 'Deploy ForgeScan 360 for network discovery and vulnerability scanning. Conduct stakeholder interviews, review existing documentation, and map current security architecture.',
    deliverables: ['ForgeScan 360 Deployment', 'Asset Inventory', 'Interview Notes', 'Network Topology'],
  },
  {
    title: 'Phase 3: Security Posture Assessment', duration: '5-10 Days', status: 'pending' as const,
    desc: 'Comprehensive evaluation across 7 security domains. Document maturity ratings, identify control gaps, and map findings to applicable compliance frameworks.',
    deliverables: ['Domain Maturity Ratings', 'Control Gap Analysis', 'Findings Register', 'Risk Scoring'],
  },
  {
    title: 'Phase 4: Report & Recommendations', duration: '3-5 Days', status: 'pending' as const,
    desc: 'Compile comprehensive assessment report with executive summary, detailed findings, prioritized remediation roadmap, and Forge service tier recommendations.',
    deliverables: ['Executive Summary', 'Technical Report', 'Remediation Roadmap', 'Service Proposal'],
  },
  {
    title: 'Phase 5: Presentation & Transition', duration: '1-2 Days', status: 'pending' as const,
    desc: 'Present findings to stakeholders, discuss recommendations, and transition to managed services engagement if approved. Begin ForgeComply 360 onboarding.',
    deliverables: ['Executive Presentation', 'Q&A Session', 'SOW for Services', 'Onboarding Plan'],
  },
]

export const workflowTrackers: { name: string; phase: string; progress: number }[] = []

export const templates = [
  { name: 'Security Posture Assessment', desc: 'Comprehensive 7-domain security maturity evaluation with executive summary and detailed findings.', iconType: 'assess' as const, sections: 24, domains: '7 domains', usageCount: 0 },
  { name: 'Executive Summary Report', desc: 'High-level overview for C-suite stakeholders with risk scoring and prioritized recommendations.', iconType: 'report' as const, sections: 8, domains: '2-3 pages', usageCount: 0 },
  { name: 'CMMC 2.0 Gap Analysis', desc: 'Control-by-control assessment against CMMC 2.0 maturity levels with remediation guidance.', iconType: 'compliance' as const, sections: 110, domains: '14 domains', usageCount: 0 },
  { name: 'Vulnerability Assessment Report', desc: 'Technical vulnerability findings with CVSS scoring, affected assets, and remediation steps.', iconType: 'assess' as const, sections: 12, domains: 'CVSS integration', usageCount: 0 },
  { name: 'Incident Response Plan', desc: 'Customizable IR playbooks covering detection, containment, eradication, and recovery phases.', iconType: 'incident' as const, sections: 6, domains: '18 checklists', usageCount: 0 },
  { name: 'Customer Onboarding Package', desc: 'Complete onboarding documentation set including welcome kit, access setup, and training schedule.', iconType: 'onboard' as const, sections: 5, domains: 'Checklist', usageCount: 0 },
  { name: 'HIPAA Gap Analysis', desc: 'Administrative, physical, and technical safeguard assessment mapped to HIPAA Security Rule.', iconType: 'compliance' as const, sections: 75, domains: '3 safeguard areas', usageCount: 0 },
  { name: 'Monthly Security Report', desc: 'Recurring managed services report with KPI tracking, incident summary, and trend analysis.', iconType: 'report' as const, sections: 10, domains: 'KPI tracking', usageCount: 0 },
  { name: 'POA&M Template', desc: 'Plan of Action and Milestones tracker with timeline calculator and resource allocation.', iconType: 'ops' as const, sections: 0, domains: 'Timeline calculator', usageCount: 0 },
  { name: 'Penetration Test Report', desc: 'Structured findings report for network, web app, and API penetration tests with attack narratives and proof-of-concept details.', iconType: 'assess' as const, sections: 15, domains: 'OWASP Top 10', usageCount: 0 },
  { name: 'Third-Party Risk Assessment', desc: 'Vendor and supply chain security evaluation covering data handling, access controls, and contractual obligations.', iconType: 'assess' as const, sections: 18, domains: '5 risk categories', usageCount: 0 },
  { name: 'Board Cybersecurity Brief', desc: 'Concise board-level presentation template with risk posture summary, key metrics, and strategic recommendations.', iconType: 'report' as const, sections: 6, domains: '8-10 slides', usageCount: 0 },
  { name: 'Quarterly Business Review', desc: 'QBR template for managed services clients with SLA performance, incident trends, and roadmap updates.', iconType: 'report' as const, sections: 12, domains: 'SLA metrics', usageCount: 0 },
  { name: 'NIST 800-171 Self-Assessment', desc: 'Full 110-control assessment against NIST SP 800-171 Rev 2 for CUI protection with SPRS scoring calculator.', iconType: 'compliance' as const, sections: 110, domains: '14 families', usageCount: 0 },
  { name: 'SOC 2 Readiness Assessment', desc: 'Trust Services Criteria evaluation covering security, availability, processing integrity, confidentiality, and privacy.', iconType: 'compliance' as const, sections: 64, domains: '5 TSC categories', usageCount: 0 },
  { name: 'PCI-DSS v4.0 Gap Analysis', desc: 'Payment card industry compliance assessment mapped to all 12 PCI-DSS requirements with compensating controls guidance.', iconType: 'compliance' as const, sections: 78, domains: '12 requirements', usageCount: 0 },
  { name: 'Incident Post-Mortem Report', desc: 'After-action report template with timeline reconstruction, root cause analysis, lessons learned, and remediation tracking.', iconType: 'incident' as const, sections: 8, domains: '5 phases', usageCount: 0 },
  { name: 'Tabletop Exercise Guide', desc: 'Facilitation guide for cybersecurity tabletop exercises with scenario scripts, injects, and participant evaluation forms.', iconType: 'incident' as const, sections: 10, domains: '6 scenarios', usageCount: 0 },
  { name: 'Service Transition Runbook', desc: 'Step-by-step operational handoff guide for transitioning clients from assessment phase to managed security services.', iconType: 'onboard' as const, sections: 14, domains: 'Checklist', usageCount: 0 },
  { name: 'Statement of Work', desc: 'Customizable SOW template with scope definition, deliverables matrix, milestones, pricing, and terms for security engagements.', iconType: 'ops' as const, sections: 9, domains: 'Legal review', usageCount: 0 },
  { name: 'Change Management Request', desc: 'Structured change request form with risk assessment, rollback plan, approval workflow, and implementation checklist.', iconType: 'ops' as const, sections: 7, domains: 'ITIL aligned', usageCount: 0 },
]

export const operationsEngagements: { customer: string; type: string; consultant: string; hoursUsed: number; hoursBudget: number; status: 'On Track' | 'At Risk' | 'Blocked'; revenue: string }[] = []

export const teamMembers: { initials: string; name: string; role: string; specializations: string[]; utilization: number; activeEngagements: number; status: 'available' | 'busy' }[] = []

export const securityDomains = [
  'Governance & Risk Management',
  'Access Control & Identity',
  'Detection & Monitoring',
  'Incident Response',
  'Compliance & Audit',
  'Security Awareness',
  'Data Protection',
]

export type UserRole = 'admin' | 'consultant' | 'sales' | 'analyst'

export interface Notification {
  id: string
  type: 'incident' | 'deadline' | 'sla' | 'client' | 'system'
  title: string
  body: string
  time: string
  read: boolean
  link?: string
  severity?: 'critical' | 'warning' | 'info'
}

export const notifications: Notification[] = []

// Role-based navigation access
export const roleAccess: Record<UserRole, string[]> = {
  admin: ['/dashboard', '/crm', '/intake', '/assessments', '/workflow', '/templates', '/operations', '/reports', '/team', '/settings', '/audit-log'],
  consultant: ['/dashboard', '/assessments', '/workflow', '/templates', '/operations', '/reports'],
  sales: ['/dashboard', '/crm', '/intake', '/reports'],
  analyst: ['/dashboard', '/assessments', '/templates', '/reports'],
}

export const roleLabels: Record<UserRole, string> = {
  admin: 'Administrator',
  consultant: 'Consultant',
  sales: 'Sales',
  analyst: 'Analyst',
}

// Multi-tenant workspaces
export interface Tenant {
  id: string
  name: string
  industry: string
  initials: string
  color: string
}

export const tenants: Tenant[] = [
  { id: 'forge-internal', name: 'Forge Cyber (Internal)', industry: 'MSSP', initials: 'FC', color: '#0D9488' },
]

// Audit log entries
export interface AuditEntry {
  id: string
  action: 'create' | 'update' | 'delete' | 'access' | 'login' | 'export' | 'config'
  user: string
  target: string
  detail: string
  timestamp: string
  ip?: string
}

export const auditLog: AuditEntry[] = []

export const sampleFindings = [
  { severity: 'critical' as const, title: 'Unpatched Domain Controllers', desc: 'Two domain controllers running outdated OS versions with known CVEs. NIST Control: SI-2', nist: 'SI-2' },
  { severity: 'high' as const, title: 'Weak Password Policy', desc: 'Current policy allows 8-char passwords with no complexity. NIST Control: IA-5', nist: 'IA-5' },
  { severity: 'medium' as const, title: 'Incomplete Audit Logging', desc: 'Security events not forwarded to central SIEM for 30% of endpoints. NIST Control: AU-6', nist: 'AU-6' },
  { severity: 'low' as const, title: 'Missing Security Banners', desc: 'Login banners not displayed on 15 network devices. NIST Control: AC-8', nist: 'AC-8' },
]

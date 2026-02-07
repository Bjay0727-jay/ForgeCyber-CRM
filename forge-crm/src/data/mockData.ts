export const dashboardStats = [
  { label: 'Active Customers', value: '24', change: '12% from last month', positive: true, icon: 'users', highlight: true, link: '/crm' },
  { label: 'Assessments In Progress', value: '8', change: '4 due this week', positive: null, icon: 'clipboard-check', link: '/assessments' },
  { label: 'Reports Pending', value: '6', change: '2 overdue', positive: false, icon: 'file-text', link: '/reports' },
  { label: 'Pipeline Value', value: '$1.2M', change: '18% growth', positive: true, icon: 'dollar-sign', link: '/crm' },
]

export const engagements = [
  { customer: 'Raytheon Intelligence', type: 'CMMC 2.0 Assessment', status: 'In Progress', statusType: 'warning' as const, consultant: 'Michael Torres', dueDate: 'Jan 15, 2026' },
  { customer: 'Texas Health Resources', type: 'HIPAA Gap Analysis', status: 'On Track', statusType: 'success' as const, consultant: 'Sarah Mitchell', dueDate: 'Jan 22, 2026' },
  { customer: 'First National Bank', type: 'Penetration Test', status: 'Testing', statusType: 'info' as const, consultant: 'James Wilson', dueDate: 'Jan 18, 2026' },
  { customer: 'DOD Contractor Alpha', type: 'RMF Assessment', status: 'Blocked', statusType: 'danger' as const, consultant: 'Emily Chen', dueDate: 'Jan 12, 2026' },
]

export const activities = [
  { type: 'complete' as const, text: '<strong>Security Posture Assessment</strong> completed for Texas Health', time: '2 hours ago' },
  { type: 'create' as const, text: 'New customer <strong>Lockheed Martin</strong> added to pipeline', time: '4 hours ago' },
  { type: 'update' as const, text: '<strong>POA&M Report</strong> updated for Raytheon', time: 'Yesterday at 3:45 PM' },
  { type: 'alert' as const, text: '<strong>3 Critical Findings</strong> identified in First National pen test', time: 'Yesterday at 11:20 AM' },
]

export const pipelineColumns = [
  {
    title: 'Lead', count: 4, colorClass: 'border-forge-info',
    cards: [
      { name: 'Northrop Grumman', meta: 'Defense Contractor \u2022 Initial Contact', value: '$150,000' },
      { name: 'MD Anderson Cancer', meta: 'Healthcare \u2022 Referral', value: '$85,000' },
      { name: 'Capital One', meta: 'Financial \u2022 Website Inquiry', value: '$120,000' },
    ]
  },
  {
    title: 'Assessment', count: 3, colorClass: 'border-forge-warning',
    cards: [
      { name: 'Lockheed Martin', meta: 'Defense \u2022 CMMC Gap Assessment', value: '$275,000' },
      { name: 'Baylor Scott & White', meta: 'Healthcare \u2022 Security Assessment', value: '$95,000' },
    ]
  },
  {
    title: 'Proposal', count: 2, colorClass: 'border-forge-teal',
    cards: [
      { name: 'General Dynamics IT', meta: 'Defense \u2022 ForgeSOC + Comply', value: '$420,000' },
      { name: 'Parkland Health', meta: 'Healthcare \u2022 Full Platform', value: '$185,000' },
    ]
  },
  {
    title: 'Negotiation', count: 2, colorClass: 'border-forge-purple',
    cards: [
      { name: 'Raytheon Intelligence', meta: 'Defense \u2022 Enterprise License', value: '$580,000' },
    ]
  },
  {
    title: 'Closed Won', count: 5, colorClass: 'border-forge-success',
    cards: [
      { name: 'Texas Health Resources', meta: 'Healthcare \u2022 3-Year Contract', value: '$245,000' },
      { name: 'First National Bank', meta: 'Financial \u2022 Annual Retainer', value: '$165,000' },
    ]
  },
]

export const customers = [
  { initials: 'RT', name: 'Raytheon Intelligence', detail: 'Defense Contractor \u2022 Arlington, VA \u2022 CMMC Level 2', stage: 'Negotiation', stageType: 'warning' as const, lastContact: 'Jan 8, 2026' },
  { initials: 'TH', name: 'Texas Health Resources', detail: 'Healthcare \u2022 Dallas, TX \u2022 HIPAA Compliance', stage: 'Active Client', stageType: 'success' as const, lastContact: 'Jan 9, 2026' },
  { initials: 'LM', name: 'Lockheed Martin', detail: 'Defense Contractor \u2022 Fort Worth, TX \u2022 NIST 800-171', stage: 'Assessment', stageType: 'info' as const, lastContact: 'Jan 7, 2026' },
  { initials: 'FN', name: 'First National Bank', detail: 'Financial Services \u2022 Houston, TX \u2022 SOX/PCI-DSS', stage: 'Active Client', stageType: 'success' as const, lastContact: 'Jan 6, 2026' },
]

export const activeAssessments = [
  { customer: 'Raytheon Intelligence', type: 'CMMC 2.0 Assessment', typeClass: 'navy' as const, started: 'Jan 3, 2026', progress: 65, consultant: 'Michael Torres' },
  { customer: 'Texas Health Resources', type: 'Security Posture Assessment', typeClass: 'teal' as const, started: 'Jan 5, 2026', progress: 90, consultant: 'Sarah Mitchell' },
  { customer: 'Lockheed Martin', type: 'Gap Analysis', typeClass: 'info' as const, started: 'Jan 7, 2026', progress: 25, consultant: 'Emily Chen' },
]

export const workflowPhases = [
  {
    title: 'Phase 1: Initial Discovery & Intake', duration: '1-2 Days', status: 'completed' as const,
    desc: 'Customer intake, stakeholder identification, scope definition, and preliminary documentation review. Establish communication channels and project timeline.',
    deliverables: ['Customer Intake Form', 'Engagement Letter', 'NDA', 'Kickoff Meeting'],
  },
  {
    title: 'Phase 2: Technical Discovery & Scanning', duration: '3-5 Days', status: 'completed' as const,
    desc: 'Deploy ForgeScan 360 for network discovery and vulnerability scanning. Conduct stakeholder interviews, review existing documentation, and map current security architecture.',
    deliverables: ['ForgeScan 360 Deployment', 'Asset Inventory', 'Interview Notes', 'Network Topology'],
  },
  {
    title: 'Phase 3: Security Posture Assessment', duration: '5-10 Days', status: 'active' as const,
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

export const workflowTrackers = [
  { name: 'Raytheon Intelligence', phase: 'Phase 3', progress: 55 },
  { name: 'Texas Health Resources', phase: 'Phase 4', progress: 80 },
  { name: 'Lockheed Martin', phase: 'Phase 2', progress: 30 },
]

export const templates = [
  { name: 'Security Posture Assessment', desc: 'Comprehensive 7-domain security maturity evaluation with executive summary and detailed findings.', iconType: 'assess' as const, sections: 24, domains: '7 domains', usageCount: 47 },
  { name: 'Executive Summary Report', desc: 'High-level overview for C-suite stakeholders with risk scoring and prioritized recommendations.', iconType: 'report' as const, sections: 8, domains: '2-3 pages', usageCount: 32 },
  { name: 'CMMC 2.0 Gap Analysis', desc: 'Control-by-control assessment against CMMC 2.0 maturity levels with remediation guidance.', iconType: 'compliance' as const, sections: 110, domains: '14 domains', usageCount: 28 },
  { name: 'Vulnerability Assessment Report', desc: 'Technical vulnerability findings with CVSS scoring, affected assets, and remediation steps.', iconType: 'assess' as const, sections: 12, domains: 'CVSS integration', usageCount: 56 },
  { name: 'Incident Response Plan', desc: 'Customizable IR playbooks covering detection, containment, eradication, and recovery phases.', iconType: 'incident' as const, sections: 6, domains: '18 checklists', usageCount: 19 },
  { name: 'Customer Onboarding Package', desc: 'Complete onboarding documentation set including welcome kit, access setup, and training schedule.', iconType: 'onboard' as const, sections: 5, domains: 'Checklist', usageCount: 24 },
  { name: 'HIPAA Gap Analysis', desc: 'Administrative, physical, and technical safeguard assessment mapped to HIPAA Security Rule.', iconType: 'compliance' as const, sections: 75, domains: '3 safeguard areas', usageCount: 35 },
  { name: 'Monthly Security Report', desc: 'Recurring managed services report with KPI tracking, incident summary, and trend analysis.', iconType: 'report' as const, sections: 10, domains: 'KPI tracking', usageCount: 89 },
  { name: 'POA&M Template', desc: 'Plan of Action and Milestones tracker with timeline calculator and resource allocation.', iconType: 'ops' as const, sections: 0, domains: 'Timeline calculator', usageCount: 67 },
  // Assessment
  { name: 'Penetration Test Report', desc: 'Structured findings report for network, web app, and API penetration tests with attack narratives and proof-of-concept details.', iconType: 'assess' as const, sections: 15, domains: 'OWASP Top 10', usageCount: 41 },
  { name: 'Third-Party Risk Assessment', desc: 'Vendor and supply chain security evaluation covering data handling, access controls, and contractual obligations.', iconType: 'assess' as const, sections: 18, domains: '5 risk categories', usageCount: 22 },
  // Report
  { name: 'Board Cybersecurity Brief', desc: 'Concise board-level presentation template with risk posture summary, key metrics, and strategic recommendations.', iconType: 'report' as const, sections: 6, domains: '8-10 slides', usageCount: 15 },
  { name: 'Quarterly Business Review', desc: 'QBR template for managed services clients with SLA performance, incident trends, and roadmap updates.', iconType: 'report' as const, sections: 12, domains: 'SLA metrics', usageCount: 38 },
  // Compliance
  { name: 'NIST 800-171 Self-Assessment', desc: 'Full 110-control assessment against NIST SP 800-171 Rev 2 for CUI protection with SPRS scoring calculator.', iconType: 'compliance' as const, sections: 110, domains: '14 families', usageCount: 31 },
  { name: 'SOC 2 Readiness Assessment', desc: 'Trust Services Criteria evaluation covering security, availability, processing integrity, confidentiality, and privacy.', iconType: 'compliance' as const, sections: 64, domains: '5 TSC categories', usageCount: 18 },
  { name: 'PCI-DSS v4.0 Gap Analysis', desc: 'Payment card industry compliance assessment mapped to all 12 PCI-DSS requirements with compensating controls guidance.', iconType: 'compliance' as const, sections: 78, domains: '12 requirements', usageCount: 26 },
  // Incident Response
  { name: 'Incident Post-Mortem Report', desc: 'After-action report template with timeline reconstruction, root cause analysis, lessons learned, and remediation tracking.', iconType: 'incident' as const, sections: 8, domains: '5 phases', usageCount: 14 },
  { name: 'Tabletop Exercise Guide', desc: 'Facilitation guide for cybersecurity tabletop exercises with scenario scripts, injects, and participant evaluation forms.', iconType: 'incident' as const, sections: 10, domains: '6 scenarios', usageCount: 11 },
  // Onboarding
  { name: 'Service Transition Runbook', desc: 'Step-by-step operational handoff guide for transitioning clients from assessment phase to managed security services.', iconType: 'onboard' as const, sections: 14, domains: 'Checklist', usageCount: 20 },
  // Operations
  { name: 'Statement of Work', desc: 'Customizable SOW template with scope definition, deliverables matrix, milestones, pricing, and terms for security engagements.', iconType: 'ops' as const, sections: 9, domains: 'Legal review', usageCount: 53 },
  { name: 'Change Management Request', desc: 'Structured change request form with risk assessment, rollback plan, approval workflow, and implementation checklist.', iconType: 'ops' as const, sections: 7, domains: 'ITIL aligned', usageCount: 34 },
]

export const operationsEngagements = [
  { customer: 'Raytheon Intelligence', type: 'CMMC 2.0 Assessment', consultant: 'Michael Torres', hoursUsed: 85, hoursBudget: 120, status: 'On Track' as const, revenue: '$45,000' },
  { customer: 'Texas Health Resources', type: 'HIPAA Compliance', consultant: 'Sarah Mitchell', hoursUsed: 142, hoursBudget: 160, status: 'On Track' as const, revenue: '$62,000' },
  { customer: 'First National Bank', type: 'Penetration Test', consultant: 'James Wilson', hoursUsed: 38, hoursBudget: 40, status: 'At Risk' as const, revenue: '$28,000' },
  { customer: 'DOD Contractor Alpha', type: 'RMF Assessment', consultant: 'Emily Chen', hoursUsed: 60, hoursBudget: 60, status: 'Blocked' as const, revenue: '$35,000' },
  { customer: 'Lockheed Martin', type: 'Gap Analysis', consultant: 'Michael Torres', hoursUsed: 20, hoursBudget: 80, status: 'On Track' as const, revenue: '$55,000' },
  { customer: 'General Dynamics IT', type: 'ForgeSOC Setup', consultant: 'James Wilson', hoursUsed: 35, hoursBudget: 100, status: 'On Track' as const, revenue: '$82,000' },
  { customer: 'Parkland Health', type: 'Security Assessment', consultant: 'Sarah Mitchell', hoursUsed: 90, hoursBudget: 80, status: 'At Risk' as const, revenue: '$48,000' },
  { customer: 'Baylor Scott & White', type: 'HIPAA Gap Analysis', consultant: 'Emily Chen', hoursUsed: 15, hoursBudget: 60, status: 'On Track' as const, revenue: '$38,000' },
]

export const teamMembers = [
  { initials: 'MT', name: 'Michael Torres', role: 'Senior Security Consultant', specializations: ['CMMC', 'NIST 800-171', 'RMF'], utilization: 85, activeEngagements: 3, status: 'available' as const },
  { initials: 'SM', name: 'Sarah Mitchell', role: 'Healthcare Security Lead', specializations: ['HIPAA', 'HITRUST', 'SOC 2'], utilization: 92, activeEngagements: 4, status: 'busy' as const },
  { initials: 'JW', name: 'James Wilson', role: 'Penetration Test Lead', specializations: ['OSCP', 'Red Team', 'Web App'], utilization: 78, activeEngagements: 2, status: 'available' as const },
  { initials: 'EC', name: 'Emily Chen', role: 'GRC Analyst', specializations: ['RMF', 'FedRAMP', 'NIST 800-53'], utilization: 70, activeEngagements: 2, status: 'available' as const },
  { initials: 'DK', name: 'David Kim', role: 'SOC Manager', specializations: ['SIEM', 'IR', 'Threat Intel'], utilization: 95, activeEngagements: 5, status: 'busy' as const },
  { initials: 'AP', name: 'Amanda Patel', role: 'Junior Consultant', specializations: ['VA', 'Compliance', 'Documentation'], utilization: 60, activeEngagements: 2, status: 'available' as const },
]

export const securityDomains = [
  'Governance & Risk Management',
  'Access Control & Identity',
  'Detection & Monitoring',
  'Incident Response',
  'Compliance & Audit',
  'Security Awareness',
  'Data Protection',
]

export const sampleFindings = [
  { severity: 'critical' as const, title: 'Unpatched Domain Controllers', desc: 'Two domain controllers running outdated OS versions with known CVEs. NIST Control: SI-2', nist: 'SI-2' },
  { severity: 'high' as const, title: 'Weak Password Policy', desc: 'Current policy allows 8-char passwords with no complexity. NIST Control: IA-5', nist: 'IA-5' },
  { severity: 'medium' as const, title: 'Incomplete Audit Logging', desc: 'Security events not forwarded to central SIEM for 30% of endpoints. NIST Control: AU-6', nist: 'AU-6' },
  { severity: 'low' as const, title: 'Missing Security Banners', desc: 'Login banners not displayed on 15 network devices. NIST Control: AC-8', nist: 'AC-8' },
]

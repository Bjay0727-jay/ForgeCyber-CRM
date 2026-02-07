// Template field types and structures for the template editor

export type FieldType = 'text' | 'textarea' | 'select' | 'date' | 'number' | 'rating' | 'checklist' | 'heading'

export interface TemplateField {
  id: string
  label: string
  type: FieldType
  placeholder?: string
  options?: string[]
  required?: boolean
  helpText?: string
  half?: boolean // render at half-width in a 2-col grid
}

export interface TemplateSection {
  id: string
  title: string
  description?: string
  fields: TemplateField[]
}

export interface TemplateStructure {
  templateName: string
  sections: TemplateSection[]
}

// ─── Security Posture Assessment ────────────────────────────────────
const securityPostureAssessment: TemplateStructure = {
  templateName: 'Security Posture Assessment',
  sections: [
    {
      id: 'engagement-info',
      title: 'Engagement Information',
      fields: [
        { id: 'client-name', label: 'Client Organization', type: 'text', placeholder: 'e.g. Raytheon Intelligence', required: true },
        { id: 'assessment-date', label: 'Assessment Date', type: 'date', required: true, half: true },
        { id: 'report-date', label: 'Report Date', type: 'date', half: true },
        { id: 'lead-assessor', label: 'Lead Assessor', type: 'text', placeholder: 'Consultant name', required: true, half: true },
        { id: 'reviewer', label: 'Reviewer', type: 'text', placeholder: 'QA reviewer name', half: true },
        { id: 'scope', label: 'Assessment Scope', type: 'textarea', placeholder: 'Define the systems, networks, and processes included in this assessment...', required: true },
        { id: 'methodology', label: 'Methodology', type: 'select', options: ['NIST CSF', 'NIST 800-53', 'CIS Controls v8', 'ISO 27001', 'Custom Framework'] },
      ],
    },
    {
      id: 'exec-summary',
      title: 'Executive Summary',
      description: 'High-level findings for leadership stakeholders',
      fields: [
        { id: 'overall-rating', label: 'Overall Security Maturity Rating', type: 'rating', options: ['1 - Initial', '2 - Developing', '3 - Defined', '4 - Managed', '5 - Optimizing'], required: true },
        { id: 'exec-overview', label: 'Executive Overview', type: 'textarea', placeholder: 'Summarize the overall security posture, key strengths, and primary areas of concern...' },
        { id: 'critical-findings-count', label: 'Critical Findings', type: 'number', placeholder: '0', half: true },
        { id: 'high-findings-count', label: 'High Findings', type: 'number', placeholder: '0', half: true },
        { id: 'medium-findings-count', label: 'Medium Findings', type: 'number', placeholder: '0', half: true },
        { id: 'low-findings-count', label: 'Low Findings', type: 'number', placeholder: '0', half: true },
        { id: 'key-recommendations', label: 'Key Recommendations', type: 'textarea', placeholder: 'Top 3-5 prioritized recommendations...' },
      ],
    },
    {
      id: 'governance',
      title: 'Domain 1: Governance & Risk Management',
      fields: [
        { id: 'gov-rating', label: 'Domain Maturity Rating', type: 'rating', options: ['1 - Initial', '2 - Developing', '3 - Defined', '4 - Managed', '5 - Optimizing'], required: true },
        { id: 'gov-policies', label: 'Security Policies Review', type: 'textarea', placeholder: 'Document the state of security policies, standards, and procedures...' },
        { id: 'gov-risk-mgmt', label: 'Risk Management Process', type: 'textarea', placeholder: 'Describe the risk assessment and management approach...' },
        { id: 'gov-checklist', label: 'Control Assessment', type: 'checklist', options: ['Security policy documented and approved', 'Risk assessment conducted within 12 months', 'Risk register maintained and reviewed', 'Security roles and responsibilities defined', 'Board/executive oversight established', 'Third-party risk program in place'] },
        { id: 'gov-findings', label: 'Findings & Gaps', type: 'textarea', placeholder: 'Document specific findings, gaps, and evidence...' },
      ],
    },
    {
      id: 'access-control',
      title: 'Domain 2: Access Control & Identity',
      fields: [
        { id: 'ac-rating', label: 'Domain Maturity Rating', type: 'rating', options: ['1 - Initial', '2 - Developing', '3 - Defined', '4 - Managed', '5 - Optimizing'], required: true },
        { id: 'ac-iam', label: 'Identity & Access Management', type: 'textarea', placeholder: 'Describe IAM tools, processes, and architecture...' },
        { id: 'ac-checklist', label: 'Control Assessment', type: 'checklist', options: ['MFA enforced for all privileged accounts', 'MFA enforced for remote access', 'Least privilege principle implemented', 'Access reviews conducted quarterly', 'Service accounts inventoried and managed', 'Password policy meets NIST guidelines', 'Privileged access management (PAM) in place'] },
        { id: 'ac-findings', label: 'Findings & Gaps', type: 'textarea', placeholder: 'Document specific findings...' },
      ],
    },
    {
      id: 'detection',
      title: 'Domain 3: Detection & Monitoring',
      fields: [
        { id: 'det-rating', label: 'Domain Maturity Rating', type: 'rating', options: ['1 - Initial', '2 - Developing', '3 - Defined', '4 - Managed', '5 - Optimizing'], required: true },
        { id: 'det-siem', label: 'SIEM / Logging Architecture', type: 'textarea', placeholder: 'Describe SIEM deployment, log sources, and retention...' },
        { id: 'det-checklist', label: 'Control Assessment', type: 'checklist', options: ['Centralized log management deployed', 'Security event monitoring 24/7', 'Endpoint detection and response (EDR) deployed', 'Network intrusion detection in place', 'Alerting thresholds and escalation defined', 'Log retention meets compliance requirements'] },
        { id: 'det-findings', label: 'Findings & Gaps', type: 'textarea', placeholder: 'Document specific findings...' },
      ],
    },
    {
      id: 'incident-response',
      title: 'Domain 4: Incident Response',
      fields: [
        { id: 'ir-rating', label: 'Domain Maturity Rating', type: 'rating', options: ['1 - Initial', '2 - Developing', '3 - Defined', '4 - Managed', '5 - Optimizing'], required: true },
        { id: 'ir-plan', label: 'IR Plan Assessment', type: 'textarea', placeholder: 'Review and document the incident response plan, team structure, and escalation procedures...' },
        { id: 'ir-checklist', label: 'Control Assessment', type: 'checklist', options: ['IR plan documented and tested', 'IR team roles assigned', 'Tabletop exercises conducted annually', 'Communication plan established', 'Forensics capability available', 'Lessons learned process in place'] },
        { id: 'ir-findings', label: 'Findings & Gaps', type: 'textarea', placeholder: 'Document specific findings...' },
      ],
    },
    {
      id: 'compliance-audit',
      title: 'Domain 5: Compliance & Audit',
      fields: [
        { id: 'comp-rating', label: 'Domain Maturity Rating', type: 'rating', options: ['1 - Initial', '2 - Developing', '3 - Defined', '4 - Managed', '5 - Optimizing'], required: true },
        { id: 'comp-frameworks', label: 'Applicable Frameworks', type: 'checklist', options: ['NIST 800-171', 'CMMC 2.0', 'HIPAA', 'PCI-DSS', 'SOC 2', 'SOX', 'FedRAMP', 'ISO 27001'] },
        { id: 'comp-assessment', label: 'Compliance Posture', type: 'textarea', placeholder: 'Assess current compliance state against applicable frameworks...' },
        { id: 'comp-findings', label: 'Findings & Gaps', type: 'textarea', placeholder: 'Document specific compliance gaps...' },
      ],
    },
    {
      id: 'awareness',
      title: 'Domain 6: Security Awareness',
      fields: [
        { id: 'aware-rating', label: 'Domain Maturity Rating', type: 'rating', options: ['1 - Initial', '2 - Developing', '3 - Defined', '4 - Managed', '5 - Optimizing'], required: true },
        { id: 'aware-program', label: 'Awareness Program Assessment', type: 'textarea', placeholder: 'Describe security awareness training program, frequency, and coverage...' },
        { id: 'aware-checklist', label: 'Control Assessment', type: 'checklist', options: ['Security awareness training mandatory', 'Phishing simulations conducted', 'Training completion tracked', 'Role-based training for privileged users', 'New hire security onboarding'] },
        { id: 'aware-findings', label: 'Findings & Gaps', type: 'textarea', placeholder: 'Document specific findings...' },
      ],
    },
    {
      id: 'data-protection',
      title: 'Domain 7: Data Protection',
      fields: [
        { id: 'dp-rating', label: 'Domain Maturity Rating', type: 'rating', options: ['1 - Initial', '2 - Developing', '3 - Defined', '4 - Managed', '5 - Optimizing'], required: true },
        { id: 'dp-classification', label: 'Data Classification & Handling', type: 'textarea', placeholder: 'Describe data classification scheme, handling procedures, and DLP controls...' },
        { id: 'dp-checklist', label: 'Control Assessment', type: 'checklist', options: ['Data classification policy defined', 'Encryption at rest implemented', 'Encryption in transit enforced', 'DLP controls deployed', 'Backup and recovery tested', 'Data retention policy enforced', 'Media sanitization procedures defined'] },
        { id: 'dp-findings', label: 'Findings & Gaps', type: 'textarea', placeholder: 'Document specific findings...' },
      ],
    },
    {
      id: 'remediation',
      title: 'Remediation Roadmap',
      description: 'Prioritized action plan',
      fields: [
        { id: 'immediate-actions', label: 'Immediate (0-30 days)', type: 'textarea', placeholder: 'Critical items requiring immediate attention...', required: true },
        { id: 'short-term', label: 'Short-Term (30-90 days)', type: 'textarea', placeholder: 'High-priority remediation items...' },
        { id: 'medium-term', label: 'Medium-Term (90-180 days)', type: 'textarea', placeholder: 'Medium-priority improvements...' },
        { id: 'long-term', label: 'Long-Term (180+ days)', type: 'textarea', placeholder: 'Strategic initiatives and maturity improvements...' },
        { id: 'estimated-investment', label: 'Estimated Investment', type: 'text', placeholder: 'e.g. $50,000 - $150,000' },
      ],
    },
  ],
}

// ─── Executive Summary Report ───────────────────────────────────────
const executiveSummaryReport: TemplateStructure = {
  templateName: 'Executive Summary Report',
  sections: [
    {
      id: 'report-info',
      title: 'Report Information',
      fields: [
        { id: 'client-name', label: 'Client Organization', type: 'text', required: true },
        { id: 'report-date', label: 'Report Date', type: 'date', required: true, half: true },
        { id: 'prepared-by', label: 'Prepared By', type: 'text', half: true },
        { id: 'classification', label: 'Classification', type: 'select', options: ['Confidential', 'Internal Only', 'Restricted', 'Public'], required: true },
      ],
    },
    {
      id: 'exec-overview',
      title: 'Executive Overview',
      fields: [
        { id: 'purpose', label: 'Engagement Purpose', type: 'textarea', placeholder: 'Describe the purpose and scope of this engagement...' },
        { id: 'overall-risk', label: 'Overall Risk Level', type: 'select', options: ['Critical', 'High', 'Moderate', 'Low', 'Minimal'], required: true },
        { id: 'summary', label: 'Summary of Findings', type: 'textarea', placeholder: 'Provide a concise overview of key findings and their business impact...', required: true },
      ],
    },
    {
      id: 'risk-scoring',
      title: 'Risk Scoring',
      fields: [
        { id: 'risk-score', label: 'Composite Risk Score (1-100)', type: 'number', placeholder: '0' },
        { id: 'risk-breakdown', label: 'Risk Breakdown by Category', type: 'textarea', placeholder: 'Technical Risk: X/100\nOperational Risk: X/100\nCompliance Risk: X/100\nStrategic Risk: X/100' },
        { id: 'trend', label: 'Risk Trend', type: 'select', options: ['Improving', 'Stable', 'Declining'] },
      ],
    },
    {
      id: 'key-findings',
      title: 'Key Findings',
      fields: [
        { id: 'critical-findings', label: 'Critical Findings', type: 'textarea', placeholder: 'List critical findings that require immediate action...' },
        { id: 'notable-strengths', label: 'Notable Strengths', type: 'textarea', placeholder: 'Highlight areas where the organization excels...' },
      ],
    },
    {
      id: 'recommendations',
      title: 'Recommendations',
      fields: [
        { id: 'priority-actions', label: 'Priority Actions', type: 'textarea', placeholder: '1. ...\n2. ...\n3. ...', required: true },
        { id: 'investment-estimate', label: 'Estimated Investment', type: 'text', placeholder: 'e.g. $75,000 - $200,000' },
        { id: 'forge-services', label: 'Recommended Forge Services', type: 'checklist', options: ['ForgeShield (Managed Security)', 'ForgeSOC 360 (24/7 Monitoring)', 'ForgeComply (Compliance Management)', 'ForgeScan 360 (Vulnerability Management)', 'Incident Response Retainer', 'Security Awareness Training'] },
      ],
    },
    {
      id: 'next-steps',
      title: 'Next Steps',
      fields: [
        { id: 'next-steps', label: 'Proposed Next Steps', type: 'textarea', placeholder: 'Outline the recommended follow-up actions and timeline...' },
        { id: 'follow-up-date', label: 'Follow-Up Meeting Date', type: 'date' },
      ],
    },
  ],
}

// ─── Vulnerability Assessment Report ────────────────────────────────
const vulnerabilityAssessment: TemplateStructure = {
  templateName: 'Vulnerability Assessment Report',
  sections: [
    {
      id: 'scan-info',
      title: 'Scan Information',
      fields: [
        { id: 'client-name', label: 'Client Organization', type: 'text', required: true },
        { id: 'scan-date', label: 'Scan Date', type: 'date', required: true, half: true },
        { id: 'scan-tool', label: 'Scan Tool', type: 'select', options: ['ForgeScan 360', 'Nessus', 'Qualys', 'Rapid7 InsightVM', 'OpenVAS', 'Other'], half: true },
        { id: 'scope', label: 'Scan Scope (IP Ranges / Hosts)', type: 'textarea', placeholder: '10.0.0.0/24\n192.168.1.0/24\n...', required: true },
        { id: 'scan-type', label: 'Scan Type', type: 'select', options: ['Authenticated', 'Unauthenticated', 'Agent-Based', 'Mixed'] },
        { id: 'total-hosts', label: 'Total Hosts Scanned', type: 'number', placeholder: '0', half: true },
        { id: 'responsive-hosts', label: 'Responsive Hosts', type: 'number', placeholder: '0', half: true },
      ],
    },
    {
      id: 'summary',
      title: 'Vulnerability Summary',
      fields: [
        { id: 'critical-count', label: 'Critical (CVSS 9.0-10.0)', type: 'number', placeholder: '0', half: true },
        { id: 'high-count', label: 'High (CVSS 7.0-8.9)', type: 'number', placeholder: '0', half: true },
        { id: 'medium-count', label: 'Medium (CVSS 4.0-6.9)', type: 'number', placeholder: '0', half: true },
        { id: 'low-count', label: 'Low (CVSS 0.1-3.9)', type: 'number', placeholder: '0', half: true },
        { id: 'info-count', label: 'Informational', type: 'number', placeholder: '0', half: true },
        { id: 'total-unique', label: 'Total Unique Vulnerabilities', type: 'number', placeholder: '0', half: true },
        { id: 'exec-summary', label: 'Executive Summary', type: 'textarea', placeholder: 'Summarize the overall vulnerability posture...' },
      ],
    },
    {
      id: 'critical-findings',
      title: 'Critical & High Findings',
      description: 'Detail each critical and high vulnerability',
      fields: [
        { id: 'finding-1-title', label: 'Finding 1 - Title', type: 'text', placeholder: 'e.g. Unpatched Domain Controllers (CVE-XXXX-XXXXX)' },
        { id: 'finding-1-cvss', label: 'CVSS Score', type: 'number', placeholder: '9.8', half: true },
        { id: 'finding-1-affected', label: 'Affected Assets', type: 'text', placeholder: 'e.g. DC01, DC02', half: true },
        { id: 'finding-1-desc', label: 'Description & Impact', type: 'textarea', placeholder: 'Describe the vulnerability, exploitation path, and business impact...' },
        { id: 'finding-1-remediation', label: 'Remediation', type: 'textarea', placeholder: 'Steps to remediate this vulnerability...' },
        { id: 'finding-2-title', label: 'Finding 2 - Title', type: 'text', placeholder: 'e.g. SQL Injection in Web Application' },
        { id: 'finding-2-cvss', label: 'CVSS Score', type: 'number', placeholder: '8.6', half: true },
        { id: 'finding-2-affected', label: 'Affected Assets', type: 'text', placeholder: 'e.g. app.example.com', half: true },
        { id: 'finding-2-desc', label: 'Description & Impact', type: 'textarea', placeholder: 'Describe the vulnerability...' },
        { id: 'finding-2-remediation', label: 'Remediation', type: 'textarea', placeholder: 'Steps to remediate...' },
        { id: 'finding-3-title', label: 'Finding 3 - Title', type: 'text' },
        { id: 'finding-3-cvss', label: 'CVSS Score', type: 'number', half: true },
        { id: 'finding-3-affected', label: 'Affected Assets', type: 'text', half: true },
        { id: 'finding-3-desc', label: 'Description & Impact', type: 'textarea' },
        { id: 'finding-3-remediation', label: 'Remediation', type: 'textarea' },
      ],
    },
    {
      id: 'remediation-plan',
      title: 'Remediation Plan',
      fields: [
        { id: 'immediate', label: 'Immediate Actions (0-7 days)', type: 'textarea', placeholder: 'Patch critical vulnerabilities, disable vulnerable services...' },
        { id: 'short-term', label: 'Short-Term (7-30 days)', type: 'textarea', placeholder: 'Address high-severity findings...' },
        { id: 'ongoing', label: 'Ongoing Improvements', type: 'textarea', placeholder: 'Vulnerability management program enhancements...' },
        { id: 'rescan-date', label: 'Recommended Rescan Date', type: 'date' },
      ],
    },
  ],
}

// ─── CMMC 2.0 Gap Analysis ──────────────────────────────────────────
const cmmcGapAnalysis: TemplateStructure = {
  templateName: 'CMMC 2.0 Gap Analysis',
  sections: [
    {
      id: 'org-info',
      title: 'Organization Information',
      fields: [
        { id: 'org-name', label: 'Organization Name', type: 'text', required: true },
        { id: 'cage-code', label: 'CAGE Code', type: 'text', placeholder: 'e.g. 1ABC2', half: true },
        { id: 'duns', label: 'DUNS / UEI Number', type: 'text', half: true },
        { id: 'target-level', label: 'Target CMMC Level', type: 'select', options: ['Level 1 - Foundational', 'Level 2 - Advanced', 'Level 3 - Expert'], required: true },
        { id: 'assessment-date', label: 'Assessment Date', type: 'date', required: true, half: true },
        { id: 'assessor', label: 'Lead Assessor', type: 'text', half: true },
        { id: 'cui-scope', label: 'CUI Scope Description', type: 'textarea', placeholder: 'Describe the systems, networks, and personnel that handle CUI...', required: true },
      ],
    },
    {
      id: 'sprs-score',
      title: 'SPRS Score Calculation',
      fields: [
        { id: 'current-score', label: 'Current SPRS Score', type: 'number', placeholder: '-203 to 110', half: true },
        { id: 'target-score', label: 'Target SPRS Score', type: 'number', placeholder: '110', half: true },
        { id: 'controls-met', label: 'Controls Fully Met', type: 'number', placeholder: '0', half: true },
        { id: 'controls-partial', label: 'Controls Partially Met', type: 'number', placeholder: '0', half: true },
        { id: 'controls-not-met', label: 'Controls Not Met', type: 'number', placeholder: '0', half: true },
        { id: 'controls-na', label: 'Controls N/A', type: 'number', placeholder: '0', half: true },
      ],
    },
    {
      id: 'ac-family',
      title: 'Access Control (AC) Family',
      description: '22 controls covering account management, access enforcement, and information flow',
      fields: [
        { id: 'ac-status', label: 'Family Status', type: 'select', options: ['Fully Compliant', 'Partially Compliant', 'Non-Compliant', 'Not Assessed'] },
        { id: 'ac-checklist', label: 'Key Controls', type: 'checklist', options: ['AC.L2-3.1.1 Authorized access control', 'AC.L2-3.1.2 Transaction & function control', 'AC.L2-3.1.3 CUI flow control', 'AC.L2-3.1.5 Least privilege', 'AC.L2-3.1.7 Privileged functions', 'AC.L2-3.1.12 Remote access monitoring', 'AC.L2-3.1.22 Publicly accessible content'] },
        { id: 'ac-gaps', label: 'Gaps & Findings', type: 'textarea', placeholder: 'Document gaps in access control implementation...' },
        { id: 'ac-remediation', label: 'Remediation Actions', type: 'textarea', placeholder: 'Required actions to close gaps...' },
      ],
    },
    {
      id: 'ia-family',
      title: 'Identification & Authentication (IA) Family',
      fields: [
        { id: 'ia-status', label: 'Family Status', type: 'select', options: ['Fully Compliant', 'Partially Compliant', 'Non-Compliant', 'Not Assessed'] },
        { id: 'ia-checklist', label: 'Key Controls', type: 'checklist', options: ['IA.L2-3.5.1 Identify system users', 'IA.L2-3.5.2 Authenticate users/devices', 'IA.L2-3.5.3 MFA for privileged access', 'IA.L2-3.5.4 Replay-resistant authentication', 'IA.L2-3.5.10 Cryptographic key management', 'IA.L2-3.5.11 Obscure authentication feedback'] },
        { id: 'ia-gaps', label: 'Gaps & Findings', type: 'textarea' },
        { id: 'ia-remediation', label: 'Remediation Actions', type: 'textarea' },
      ],
    },
    {
      id: 'sc-family',
      title: 'System & Communications Protection (SC) Family',
      fields: [
        { id: 'sc-status', label: 'Family Status', type: 'select', options: ['Fully Compliant', 'Partially Compliant', 'Non-Compliant', 'Not Assessed'] },
        { id: 'sc-checklist', label: 'Key Controls', type: 'checklist', options: ['SC.L2-3.13.1 Boundary protection', 'SC.L2-3.13.2 Architectural designs', 'SC.L2-3.13.5 Public-access system separation', 'SC.L2-3.13.8 CUI encryption in transit', 'SC.L2-3.13.11 CUI encryption at rest', 'SC.L2-3.13.16 CUI at rest on mobile'] },
        { id: 'sc-gaps', label: 'Gaps & Findings', type: 'textarea' },
        { id: 'sc-remediation', label: 'Remediation Actions', type: 'textarea' },
      ],
    },
    {
      id: 'poam',
      title: 'POA&M Summary',
      fields: [
        { id: 'poam-items', label: 'Total POA&M Items', type: 'number', placeholder: '0', half: true },
        { id: 'estimated-completion', label: 'Estimated Completion Date', type: 'date', half: true },
        { id: 'poam-details', label: 'POA&M Details', type: 'textarea', placeholder: 'Summarize the plan of action and milestones for achieving compliance...' },
        { id: 'budget-estimate', label: 'Estimated Remediation Budget', type: 'text', placeholder: 'e.g. $100,000 - $500,000' },
      ],
    },
  ],
}

// ─── Incident Response Plan ─────────────────────────────────────────
const incidentResponsePlan: TemplateStructure = {
  templateName: 'Incident Response Plan',
  sections: [
    {
      id: 'plan-info',
      title: 'Plan Information',
      fields: [
        { id: 'org-name', label: 'Organization Name', type: 'text', required: true },
        { id: 'effective-date', label: 'Effective Date', type: 'date', required: true, half: true },
        { id: 'review-date', label: 'Next Review Date', type: 'date', half: true },
        { id: 'plan-owner', label: 'Plan Owner', type: 'text', placeholder: 'CISO / Security Director name' },
        { id: 'version', label: 'Version', type: 'text', placeholder: 'e.g. 2.1', half: true },
        { id: 'classification', label: 'Classification', type: 'select', options: ['Confidential', 'Internal Only', 'Restricted'], half: true },
      ],
    },
    {
      id: 'ir-team',
      title: 'Incident Response Team',
      fields: [
        { id: 'ir-lead', label: 'IR Team Lead', type: 'text', placeholder: 'Name, title, contact info' },
        { id: 'ir-members', label: 'Team Members & Roles', type: 'textarea', placeholder: 'Name | Role | Phone | Email\n---|---|---|---\nJohn Doe | Forensics Lead | 555-0100 | john@...' },
        { id: 'external-contacts', label: 'External Contacts', type: 'textarea', placeholder: 'Legal Counsel: ...\nLaw Enforcement: ...\nCyber Insurance: ...\nForge Cyber Defense: ...' },
        { id: 'escalation-path', label: 'Escalation Path', type: 'textarea', placeholder: 'Define the escalation path from detection to executive notification...' },
      ],
    },
    {
      id: 'detection',
      title: 'Phase 1: Detection & Analysis',
      fields: [
        { id: 'detection-sources', label: 'Detection Sources', type: 'checklist', options: ['SIEM alerts', 'EDR alerts', 'User reports', 'Threat intelligence feeds', 'Vulnerability scans', 'External notification', 'Law enforcement notification'] },
        { id: 'severity-levels', label: 'Incident Severity Classification', type: 'textarea', placeholder: 'SEV-1 (Critical): ...\nSEV-2 (High): ...\nSEV-3 (Medium): ...\nSEV-4 (Low): ...' },
        { id: 'initial-triage', label: 'Initial Triage Procedure', type: 'textarea', placeholder: 'Step-by-step triage process...' },
      ],
    },
    {
      id: 'containment',
      title: 'Phase 2: Containment',
      fields: [
        { id: 'short-term', label: 'Short-Term Containment Actions', type: 'textarea', placeholder: 'Isolate affected systems, block malicious IPs, disable compromised accounts...' },
        { id: 'long-term', label: 'Long-Term Containment Actions', type: 'textarea', placeholder: 'Apply patches, update firewall rules, implement additional monitoring...' },
        { id: 'evidence-preservation', label: 'Evidence Preservation Procedures', type: 'textarea', placeholder: 'Memory capture, disk imaging, log preservation procedures...' },
      ],
    },
    {
      id: 'eradication',
      title: 'Phase 3: Eradication & Recovery',
      fields: [
        { id: 'eradication-steps', label: 'Eradication Procedures', type: 'textarea', placeholder: 'Remove malware, close vulnerabilities, reset credentials...' },
        { id: 'recovery-steps', label: 'Recovery Procedures', type: 'textarea', placeholder: 'Restore from backups, rebuild systems, validate integrity...' },
        { id: 'recovery-checklist', label: 'Recovery Verification', type: 'checklist', options: ['Systems restored and operational', 'Vulnerability that led to incident patched', 'All compromised credentials reset', 'Monitoring enhanced for recurrence', 'Business operations confirmed normal'] },
      ],
    },
    {
      id: 'post-incident',
      title: 'Phase 4: Post-Incident',
      fields: [
        { id: 'lessons-learned', label: 'Lessons Learned Template', type: 'textarea', placeholder: 'What happened?\nHow was it detected?\nWhat went well?\nWhat needs improvement?\nAction items...' },
        { id: 'reporting-requirements', label: 'Reporting Requirements', type: 'checklist', options: ['Internal executive report', 'Board notification (if material)', 'Regulatory notification (72-hour rule)', 'Law enforcement notification', 'Customer/partner notification', 'Cyber insurance claim'] },
        { id: 'plan-updates', label: 'Plan Update Actions', type: 'textarea', placeholder: 'Changes to make to IR plan based on lessons learned...' },
      ],
    },
  ],
}

// ─── HIPAA Gap Analysis ─────────────────────────────────────────────
const hipaaGapAnalysis: TemplateStructure = {
  templateName: 'HIPAA Gap Analysis',
  sections: [
    {
      id: 'org-info',
      title: 'Organization Information',
      fields: [
        { id: 'org-name', label: 'Covered Entity / Business Associate', type: 'text', required: true },
        { id: 'org-type', label: 'Organization Type', type: 'select', options: ['Covered Entity - Health Plan', 'Covered Entity - Healthcare Provider', 'Covered Entity - Healthcare Clearinghouse', 'Business Associate'], required: true },
        { id: 'assessment-date', label: 'Assessment Date', type: 'date', required: true, half: true },
        { id: 'assessor', label: 'Lead Assessor', type: 'text', half: true },
        { id: 'phi-scope', label: 'PHI Scope Description', type: 'textarea', placeholder: 'Describe the systems, applications, and processes that create, receive, maintain, or transmit ePHI...', required: true },
      ],
    },
    {
      id: 'admin-safeguards',
      title: 'Administrative Safeguards (§164.308)',
      fields: [
        { id: 'admin-status', label: 'Overall Status', type: 'select', options: ['Compliant', 'Partially Compliant', 'Non-Compliant', 'Not Assessed'] },
        { id: 'admin-checklist', label: 'Control Assessment', type: 'checklist', options: ['Security Management Process (§164.308(a)(1))', 'Assigned Security Responsibility (§164.308(a)(2))', 'Workforce Security (§164.308(a)(3))', 'Information Access Management (§164.308(a)(4))', 'Security Awareness and Training (§164.308(a)(5))', 'Security Incident Procedures (§164.308(a)(6))', 'Contingency Plan (§164.308(a)(7))', 'Evaluation (§164.308(a)(8))', 'BA Agreements (§164.308(b)(1))'] },
        { id: 'admin-gaps', label: 'Gaps & Findings', type: 'textarea', placeholder: 'Document specific gaps in administrative safeguards...' },
      ],
    },
    {
      id: 'physical-safeguards',
      title: 'Physical Safeguards (§164.310)',
      fields: [
        { id: 'phys-status', label: 'Overall Status', type: 'select', options: ['Compliant', 'Partially Compliant', 'Non-Compliant', 'Not Assessed'] },
        { id: 'phys-checklist', label: 'Control Assessment', type: 'checklist', options: ['Facility Access Controls (§164.310(a))', 'Workstation Use (§164.310(b))', 'Workstation Security (§164.310(c))', 'Device and Media Controls (§164.310(d))'] },
        { id: 'phys-gaps', label: 'Gaps & Findings', type: 'textarea' },
      ],
    },
    {
      id: 'technical-safeguards',
      title: 'Technical Safeguards (§164.312)',
      fields: [
        { id: 'tech-status', label: 'Overall Status', type: 'select', options: ['Compliant', 'Partially Compliant', 'Non-Compliant', 'Not Assessed'] },
        { id: 'tech-checklist', label: 'Control Assessment', type: 'checklist', options: ['Access Control (§164.312(a))', 'Audit Controls (§164.312(b))', 'Integrity (§164.312(c))', 'Person or Entity Authentication (§164.312(d))', 'Transmission Security (§164.312(e))'] },
        { id: 'tech-gaps', label: 'Gaps & Findings', type: 'textarea' },
      ],
    },
    {
      id: 'risk-assessment',
      title: 'Risk Assessment Summary',
      fields: [
        { id: 'risk-level', label: 'Overall ePHI Risk Level', type: 'select', options: ['Critical', 'High', 'Moderate', 'Low'], required: true },
        { id: 'top-risks', label: 'Top Risks to ePHI', type: 'textarea', placeholder: 'List and describe the top risks to the confidentiality, integrity, and availability of ePHI...' },
        { id: 'remediation', label: 'Remediation Plan', type: 'textarea', placeholder: 'Prioritized remediation actions...' },
      ],
    },
  ],
}

// ─── Customer Onboarding Package ────────────────────────────────────
const customerOnboarding: TemplateStructure = {
  templateName: 'Customer Onboarding Package',
  sections: [
    {
      id: 'client-info',
      title: 'Client Information',
      fields: [
        { id: 'company-name', label: 'Company Name', type: 'text', required: true },
        { id: 'primary-contact', label: 'Primary Contact Name', type: 'text', required: true, half: true },
        { id: 'contact-email', label: 'Contact Email', type: 'text', half: true },
        { id: 'contact-phone', label: 'Contact Phone', type: 'text', half: true },
        { id: 'industry', label: 'Industry', type: 'select', options: ['Defense / DoD', 'Healthcare', 'Financial Services', 'Energy', 'Technology', 'Government', 'Manufacturing', 'Other'], half: true },
        { id: 'engagement-type', label: 'Engagement Type', type: 'select', options: ['Assessment Only', 'Managed Security Services', 'Compliance Program', 'Incident Response Retainer', 'Full Platform'], required: true },
        { id: 'start-date', label: 'Engagement Start Date', type: 'date', required: true },
      ],
    },
    {
      id: 'access-setup',
      title: 'Access & Environment Setup',
      fields: [
        { id: 'access-checklist', label: 'Access Provisioning', type: 'checklist', options: ['Forge Portal account created', 'VPN credentials issued', 'Secure file transfer setup', 'Communication channel established (Teams/Slack)', 'SIEM/log forwarding configured', 'ForgeScan 360 agent deployed', 'Documentation repository shared'] },
        { id: 'technical-poc', label: 'Client Technical POC', type: 'text', placeholder: 'Name and contact for technical coordination' },
        { id: 'environment-notes', label: 'Environment Notes', type: 'textarea', placeholder: 'Key details about client environment, VPN requirements, access restrictions...' },
      ],
    },
    {
      id: 'kickoff',
      title: 'Kickoff Meeting',
      fields: [
        { id: 'kickoff-date', label: 'Kickoff Date', type: 'date', half: true },
        { id: 'kickoff-attendees', label: 'Attendees', type: 'textarea', placeholder: 'List all attendees and their roles...' },
        { id: 'kickoff-agenda', label: 'Agenda Items', type: 'checklist', options: ['Introductions and roles', 'Engagement scope review', 'Timeline and milestones', 'Communication plan', 'Technical requirements', 'Access and logistics', 'Q&A and next steps'] },
        { id: 'kickoff-notes', label: 'Meeting Notes', type: 'textarea' },
      ],
    },
    {
      id: 'documentation',
      title: 'Documentation Collection',
      fields: [
        { id: 'docs-checklist', label: 'Requested Documents', type: 'checklist', options: ['Network architecture diagrams', 'Asset inventory', 'Security policies and procedures', 'Previous assessment reports', 'Compliance certifications', 'Incident response plan', 'Business continuity plan', 'Vendor/third-party list', 'Org chart (IT/Security)'] },
        { id: 'docs-notes', label: 'Documentation Notes', type: 'textarea', placeholder: 'Status of document collection, missing items, follow-ups needed...' },
      ],
    },
    {
      id: 'schedule',
      title: 'Engagement Schedule',
      fields: [
        { id: 'milestone-1', label: 'Milestone 1 - Discovery Complete', type: 'date', half: true },
        { id: 'milestone-2', label: 'Milestone 2 - Assessment Complete', type: 'date', half: true },
        { id: 'milestone-3', label: 'Milestone 3 - Report Delivered', type: 'date', half: true },
        { id: 'milestone-4', label: 'Milestone 4 - Final Presentation', type: 'date', half: true },
        { id: 'meeting-cadence', label: 'Meeting Cadence', type: 'select', options: ['Daily standup', 'Twice weekly', 'Weekly', 'Bi-weekly'] },
        { id: 'schedule-notes', label: 'Schedule Notes', type: 'textarea', placeholder: 'Blackout dates, holidays, constraints...' },
      ],
    },
  ],
}

// ─── Monthly Security Report ────────────────────────────────────────
const monthlySecurityReport: TemplateStructure = {
  templateName: 'Monthly Security Report',
  sections: [
    {
      id: 'report-period',
      title: 'Report Period',
      fields: [
        { id: 'client-name', label: 'Client Organization', type: 'text', required: true },
        { id: 'report-month', label: 'Reporting Month', type: 'text', placeholder: 'e.g. January 2026', required: true, half: true },
        { id: 'prepared-by', label: 'Prepared By', type: 'text', half: true },
      ],
    },
    {
      id: 'kpis',
      title: 'Security KPIs',
      fields: [
        { id: 'incidents-total', label: 'Total Security Incidents', type: 'number', placeholder: '0', half: true },
        { id: 'incidents-critical', label: 'Critical Incidents', type: 'number', placeholder: '0', half: true },
        { id: 'mttr', label: 'Mean Time to Respond (hours)', type: 'number', placeholder: '0', half: true },
        { id: 'mttd', label: 'Mean Time to Detect (hours)', type: 'number', placeholder: '0', half: true },
        { id: 'vulns-open', label: 'Open Vulnerabilities', type: 'number', placeholder: '0', half: true },
        { id: 'vulns-closed', label: 'Vulnerabilities Remediated', type: 'number', placeholder: '0', half: true },
        { id: 'sla-compliance', label: 'SLA Compliance %', type: 'number', placeholder: '99.5', half: true },
        { id: 'uptime', label: 'Service Uptime %', type: 'number', placeholder: '99.9', half: true },
      ],
    },
    {
      id: 'incidents',
      title: 'Incident Summary',
      fields: [
        { id: 'incident-summary', label: 'Incident Overview', type: 'textarea', placeholder: 'Summarize security incidents for the reporting period...' },
        { id: 'notable-incidents', label: 'Notable Incidents', type: 'textarea', placeholder: 'Detail any significant incidents, response actions, and outcomes...' },
        { id: 'incident-trends', label: 'Trends & Patterns', type: 'textarea', placeholder: 'Identify trends in incident types, sources, or targets...' },
      ],
    },
    {
      id: 'vulnerability-mgmt',
      title: 'Vulnerability Management',
      fields: [
        { id: 'scan-summary', label: 'Scan Summary', type: 'textarea', placeholder: 'Summary of vulnerability scans conducted this month...' },
        { id: 'new-critical', label: 'New Critical Vulnerabilities', type: 'number', placeholder: '0', half: true },
        { id: 'patch-compliance', label: 'Patch Compliance %', type: 'number', placeholder: '0', half: true },
        { id: 'remediation-progress', label: 'Remediation Progress', type: 'textarea', placeholder: 'Status of vulnerability remediation efforts...' },
      ],
    },
    {
      id: 'recommendations',
      title: 'Recommendations & Next Month',
      fields: [
        { id: 'recommendations', label: 'Recommendations', type: 'textarea', placeholder: 'Recommendations for improving security posture...' },
        { id: 'planned-activities', label: 'Planned Activities for Next Month', type: 'textarea', placeholder: 'Upcoming scans, assessments, changes...' },
      ],
    },
  ],
}

// ─── POA&M Template ─────────────────────────────────────────────────
const poamTemplate: TemplateStructure = {
  templateName: 'POA&M Template',
  sections: [
    {
      id: 'poam-info',
      title: 'POA&M Information',
      fields: [
        { id: 'org-name', label: 'Organization Name', type: 'text', required: true },
        { id: 'system-name', label: 'System / Enclave Name', type: 'text', required: true },
        { id: 'prepared-date', label: 'Date Prepared', type: 'date', required: true, half: true },
        { id: 'prepared-by', label: 'Prepared By', type: 'text', half: true },
        { id: 'framework', label: 'Applicable Framework', type: 'select', options: ['NIST 800-171', 'CMMC 2.0', 'NIST 800-53', 'HIPAA', 'PCI-DSS', 'FedRAMP'] },
      ],
    },
    {
      id: 'item-1',
      title: 'POA&M Item 1',
      fields: [
        { id: 'item-1-weakness', label: 'Weakness / Finding', type: 'text', placeholder: 'Describe the control weakness', required: true },
        { id: 'item-1-control', label: 'Control ID', type: 'text', placeholder: 'e.g. AC-2, 3.1.1', half: true },
        { id: 'item-1-severity', label: 'Severity', type: 'select', options: ['Critical', 'High', 'Moderate', 'Low'], half: true },
        { id: 'item-1-status', label: 'Status', type: 'select', options: ['Open', 'In Progress', 'Completed', 'Delayed', 'Accepted Risk'], half: true },
        { id: 'item-1-responsible', label: 'Responsible Party', type: 'text', half: true },
        { id: 'item-1-resources', label: 'Resources Required', type: 'text', placeholder: 'Budget, personnel, tools needed' },
        { id: 'item-1-milestone', label: 'Milestones & Timeline', type: 'textarea', placeholder: 'Define milestones with target dates...' },
        { id: 'item-1-target', label: 'Target Completion Date', type: 'date', half: true },
        { id: 'item-1-actual', label: 'Actual Completion Date', type: 'date', half: true },
        { id: 'item-1-comments', label: 'Comments / Progress Notes', type: 'textarea' },
      ],
    },
    {
      id: 'item-2',
      title: 'POA&M Item 2',
      fields: [
        { id: 'item-2-weakness', label: 'Weakness / Finding', type: 'text' },
        { id: 'item-2-control', label: 'Control ID', type: 'text', half: true },
        { id: 'item-2-severity', label: 'Severity', type: 'select', options: ['Critical', 'High', 'Moderate', 'Low'], half: true },
        { id: 'item-2-status', label: 'Status', type: 'select', options: ['Open', 'In Progress', 'Completed', 'Delayed', 'Accepted Risk'], half: true },
        { id: 'item-2-responsible', label: 'Responsible Party', type: 'text', half: true },
        { id: 'item-2-resources', label: 'Resources Required', type: 'text' },
        { id: 'item-2-milestone', label: 'Milestones & Timeline', type: 'textarea' },
        { id: 'item-2-target', label: 'Target Completion Date', type: 'date', half: true },
        { id: 'item-2-actual', label: 'Actual Completion Date', type: 'date', half: true },
        { id: 'item-2-comments', label: 'Comments / Progress Notes', type: 'textarea' },
      ],
    },
    {
      id: 'item-3',
      title: 'POA&M Item 3',
      fields: [
        { id: 'item-3-weakness', label: 'Weakness / Finding', type: 'text' },
        { id: 'item-3-control', label: 'Control ID', type: 'text', half: true },
        { id: 'item-3-severity', label: 'Severity', type: 'select', options: ['Critical', 'High', 'Moderate', 'Low'], half: true },
        { id: 'item-3-status', label: 'Status', type: 'select', options: ['Open', 'In Progress', 'Completed', 'Delayed', 'Accepted Risk'], half: true },
        { id: 'item-3-responsible', label: 'Responsible Party', type: 'text', half: true },
        { id: 'item-3-resources', label: 'Resources Required', type: 'text' },
        { id: 'item-3-milestone', label: 'Milestones & Timeline', type: 'textarea' },
        { id: 'item-3-target', label: 'Target Completion Date', type: 'date', half: true },
        { id: 'item-3-actual', label: 'Actual Completion Date', type: 'date', half: true },
        { id: 'item-3-comments', label: 'Comments / Progress Notes', type: 'textarea' },
      ],
    },
  ],
}

// ─── Penetration Test Report ────────────────────────────────────────
const penTestReport: TemplateStructure = {
  templateName: 'Penetration Test Report',
  sections: [
    {
      id: 'engagement',
      title: 'Engagement Details',
      fields: [
        { id: 'client-name', label: 'Client Organization', type: 'text', required: true },
        { id: 'test-type', label: 'Test Type', type: 'select', options: ['External Network', 'Internal Network', 'Web Application', 'API', 'Wireless', 'Social Engineering', 'Red Team'], required: true },
        { id: 'start-date', label: 'Test Start Date', type: 'date', required: true, half: true },
        { id: 'end-date', label: 'Test End Date', type: 'date', required: true, half: true },
        { id: 'tester', label: 'Penetration Tester', type: 'text', required: true },
        { id: 'scope', label: 'Scope / Targets', type: 'textarea', placeholder: 'IP ranges, URLs, applications in scope...' },
        { id: 'roa', label: 'Rules of Engagement', type: 'textarea', placeholder: 'Testing windows, out-of-scope items, restrictions...' },
      ],
    },
    {
      id: 'exec-summary',
      title: 'Executive Summary',
      fields: [
        { id: 'overall-risk', label: 'Overall Risk Rating', type: 'select', options: ['Critical', 'High', 'Medium', 'Low', 'Informational'], required: true },
        { id: 'summary', label: 'Summary', type: 'textarea', placeholder: 'Summarize the overall findings, attack paths discovered, and business risk...' },
        { id: 'critical-count', label: 'Critical Findings', type: 'number', placeholder: '0', half: true },
        { id: 'high-count', label: 'High Findings', type: 'number', placeholder: '0', half: true },
        { id: 'medium-count', label: 'Medium Findings', type: 'number', placeholder: '0', half: true },
        { id: 'low-count', label: 'Low/Info Findings', type: 'number', placeholder: '0', half: true },
      ],
    },
    {
      id: 'finding-1',
      title: 'Finding 1',
      fields: [
        { id: 'f1-title', label: 'Finding Title', type: 'text', placeholder: 'e.g. SQL Injection in Login Form' },
        { id: 'f1-severity', label: 'Severity', type: 'select', options: ['Critical', 'High', 'Medium', 'Low', 'Informational'], half: true },
        { id: 'f1-cvss', label: 'CVSS Score', type: 'number', placeholder: '0.0', half: true },
        { id: 'f1-affected', label: 'Affected System(s)', type: 'text' },
        { id: 'f1-description', label: 'Description', type: 'textarea', placeholder: 'Technical description of the vulnerability...' },
        { id: 'f1-attack-narrative', label: 'Attack Narrative', type: 'textarea', placeholder: 'Step-by-step description of how the vulnerability was exploited...' },
        { id: 'f1-impact', label: 'Business Impact', type: 'textarea', placeholder: 'What could an attacker achieve by exploiting this vulnerability...' },
        { id: 'f1-remediation', label: 'Remediation', type: 'textarea', placeholder: 'Recommended fix...' },
        { id: 'f1-references', label: 'References (CVE, CWE, OWASP)', type: 'text' },
      ],
    },
    {
      id: 'finding-2',
      title: 'Finding 2',
      fields: [
        { id: 'f2-title', label: 'Finding Title', type: 'text' },
        { id: 'f2-severity', label: 'Severity', type: 'select', options: ['Critical', 'High', 'Medium', 'Low', 'Informational'], half: true },
        { id: 'f2-cvss', label: 'CVSS Score', type: 'number', half: true },
        { id: 'f2-affected', label: 'Affected System(s)', type: 'text' },
        { id: 'f2-description', label: 'Description', type: 'textarea' },
        { id: 'f2-attack-narrative', label: 'Attack Narrative', type: 'textarea' },
        { id: 'f2-impact', label: 'Business Impact', type: 'textarea' },
        { id: 'f2-remediation', label: 'Remediation', type: 'textarea' },
        { id: 'f2-references', label: 'References', type: 'text' },
      ],
    },
    {
      id: 'recommendations',
      title: 'Recommendations',
      fields: [
        { id: 'immediate', label: 'Immediate Actions', type: 'textarea', placeholder: 'Actions to take within 48 hours...' },
        { id: 'short-term', label: 'Short-Term (30 days)', type: 'textarea' },
        { id: 'long-term', label: 'Long-Term Improvements', type: 'textarea' },
        { id: 'retest-date', label: 'Recommended Retest Date', type: 'date' },
      ],
    },
  ],
}

// ─── Statement of Work ──────────────────────────────────────────────
const statementOfWork: TemplateStructure = {
  templateName: 'Statement of Work',
  sections: [
    {
      id: 'parties',
      title: 'Parties & Agreement',
      fields: [
        { id: 'client-name', label: 'Client Organization', type: 'text', required: true },
        { id: 'client-contact', label: 'Client Contact', type: 'text', required: true, half: true },
        { id: 'client-email', label: 'Client Email', type: 'text', half: true },
        { id: 'effective-date', label: 'Effective Date', type: 'date', required: true, half: true },
        { id: 'end-date', label: 'Estimated End Date', type: 'date', half: true },
        { id: 'sow-number', label: 'SOW Number', type: 'text', placeholder: 'e.g. SOW-2026-001', half: true },
        { id: 'contract-ref', label: 'Master Agreement Reference', type: 'text', half: true },
      ],
    },
    {
      id: 'scope',
      title: 'Scope of Work',
      fields: [
        { id: 'overview', label: 'Engagement Overview', type: 'textarea', placeholder: 'Describe the overall engagement purpose and objectives...', required: true },
        { id: 'in-scope', label: 'In Scope', type: 'textarea', placeholder: 'Detailed list of services, systems, and activities included...', required: true },
        { id: 'out-of-scope', label: 'Out of Scope', type: 'textarea', placeholder: 'Explicitly excluded items...', required: true },
        { id: 'assumptions', label: 'Assumptions', type: 'textarea', placeholder: 'Key assumptions this SOW is based on...' },
      ],
    },
    {
      id: 'deliverables',
      title: 'Deliverables',
      fields: [
        { id: 'deliverable-1', label: 'Deliverable 1', type: 'text', placeholder: 'e.g. Security Posture Assessment Report' },
        { id: 'deliverable-1-desc', label: 'Description', type: 'textarea', placeholder: 'Detailed description of this deliverable...' },
        { id: 'deliverable-1-date', label: 'Due Date', type: 'date' },
        { id: 'deliverable-2', label: 'Deliverable 2', type: 'text' },
        { id: 'deliverable-2-desc', label: 'Description', type: 'textarea' },
        { id: 'deliverable-2-date', label: 'Due Date', type: 'date' },
        { id: 'deliverable-3', label: 'Deliverable 3', type: 'text' },
        { id: 'deliverable-3-desc', label: 'Description', type: 'textarea' },
        { id: 'deliverable-3-date', label: 'Due Date', type: 'date' },
      ],
    },
    {
      id: 'pricing',
      title: 'Pricing & Payment',
      fields: [
        { id: 'pricing-model', label: 'Pricing Model', type: 'select', options: ['Fixed Price', 'Time & Materials', 'Monthly Retainer', 'Milestone-Based'], required: true },
        { id: 'total-value', label: 'Total Engagement Value', type: 'text', placeholder: 'e.g. $85,000', required: true },
        { id: 'payment-schedule', label: 'Payment Schedule', type: 'textarea', placeholder: '50% upon execution, 25% at midpoint, 25% upon completion...' },
        { id: 'hourly-rate', label: 'Hourly Rate (if T&M)', type: 'text', placeholder: 'e.g. $275/hr' },
        { id: 'estimated-hours', label: 'Estimated Hours', type: 'number', placeholder: '0' },
        { id: 'expenses', label: 'Expense Policy', type: 'textarea', placeholder: 'Travel, tools, and other reimbursable expenses...' },
      ],
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      fields: [
        { id: 'change-control', label: 'Change Control Process', type: 'textarea', placeholder: 'Describe the process for scope changes and change orders...' },
        { id: 'acceptance', label: 'Acceptance Criteria', type: 'textarea', placeholder: 'Define the criteria for deliverable acceptance...' },
        { id: 'confidentiality', label: 'Confidentiality Requirements', type: 'textarea', placeholder: 'NDA reference, data handling requirements...' },
        { id: 'termination', label: 'Termination Clause', type: 'textarea', placeholder: 'Conditions under which either party may terminate...' },
      ],
    },
  ],
}

// ─── Shorter templates with focused structures ──────────────────────

const thirdPartyRisk: TemplateStructure = {
  templateName: 'Third-Party Risk Assessment',
  sections: [
    { id: 'vendor-info', title: 'Vendor Information', fields: [
      { id: 'vendor-name', label: 'Vendor Name', type: 'text', required: true },
      { id: 'vendor-contact', label: 'Vendor Contact', type: 'text', half: true },
      { id: 'vendor-website', label: 'Website', type: 'text', half: true },
      { id: 'service-description', label: 'Service / Product Description', type: 'textarea', required: true },
      { id: 'data-access', label: 'Data Access Level', type: 'select', options: ['No Data Access', 'Non-Sensitive Only', 'Sensitive / PII', 'Regulated (PHI/CUI)', 'Full System Access'], required: true },
      { id: 'criticality', label: 'Business Criticality', type: 'select', options: ['Critical', 'High', 'Medium', 'Low'] },
    ]},
    { id: 'security-assessment', title: 'Security Assessment', fields: [
      { id: 'security-checklist', label: 'Security Controls', type: 'checklist', options: ['SOC 2 report available', 'Encryption at rest and in transit', 'MFA enforced', 'Annual penetration testing', 'Incident response plan documented', 'Business continuity plan tested', 'Employee security training', 'Background checks performed', 'Data retention/deletion policy', 'Sub-processor management'] },
      { id: 'certifications', label: 'Certifications & Compliance', type: 'checklist', options: ['SOC 2 Type II', 'ISO 27001', 'FedRAMP', 'HITRUST', 'PCI-DSS', 'StateRAMP'] },
      { id: 'security-notes', label: 'Assessment Notes', type: 'textarea' },
    ]},
    { id: 'risk-rating', title: 'Risk Rating & Decision', fields: [
      { id: 'risk-level', label: 'Overall Risk Level', type: 'select', options: ['Critical', 'High', 'Medium', 'Low', 'Minimal'], required: true },
      { id: 'risk-justification', label: 'Risk Justification', type: 'textarea' },
      { id: 'decision', label: 'Decision', type: 'select', options: ['Approved', 'Approved with Conditions', 'Denied', 'Requires Further Review'] },
      { id: 'conditions', label: 'Conditions / Mitigations', type: 'textarea' },
      { id: 'review-date', label: 'Next Review Date', type: 'date' },
    ]},
  ],
}

const boardBrief: TemplateStructure = {
  templateName: 'Board Cybersecurity Brief',
  sections: [
    { id: 'brief-info', title: 'Brief Information', fields: [
      { id: 'org-name', label: 'Organization', type: 'text', required: true },
      { id: 'brief-date', label: 'Presentation Date', type: 'date', required: true, half: true },
      { id: 'presenter', label: 'Presenter', type: 'text', half: true },
      { id: 'period', label: 'Reporting Period', type: 'text', placeholder: 'e.g. Q1 2026' },
    ]},
    { id: 'risk-posture', title: 'Risk Posture Summary', fields: [
      { id: 'overall-risk', label: 'Overall Cyber Risk Level', type: 'select', options: ['Critical', 'High', 'Moderate', 'Low'], required: true },
      { id: 'risk-trend', label: 'Risk Trend', type: 'select', options: ['Increasing', 'Stable', 'Decreasing'] },
      { id: 'key-risks', label: 'Top 3 Cyber Risks', type: 'textarea', placeholder: '1. ...\n2. ...\n3. ...', required: true },
      { id: 'risk-appetite', label: 'Risk Appetite Alignment', type: 'textarea', placeholder: 'How current risk compares to board-approved risk appetite...' },
    ]},
    { id: 'metrics', title: 'Key Metrics', fields: [
      { id: 'incidents', label: 'Security Incidents (this quarter)', type: 'number', half: true },
      { id: 'compliance-score', label: 'Compliance Score (%)', type: 'number', half: true },
      { id: 'vuln-remediation', label: 'Vulnerability Remediation Rate (%)', type: 'number', half: true },
      { id: 'training-completion', label: 'Training Completion (%)', type: 'number', half: true },
      { id: 'metrics-narrative', label: 'Metrics Commentary', type: 'textarea' },
    ]},
    { id: 'investments', title: 'Security Investments & Roadmap', fields: [
      { id: 'current-spend', label: 'Current Security Budget', type: 'text', placeholder: 'e.g. $1.2M annually' },
      { id: 'requested-budget', label: 'Requested Additional Investment', type: 'text' },
      { id: 'roadmap', label: 'Strategic Roadmap Items', type: 'textarea', placeholder: 'Key initiatives planned for next 12 months...' },
      { id: 'board-asks', label: 'Board Action Items / Approvals Needed', type: 'textarea' },
    ]},
  ],
}

const qbr: TemplateStructure = {
  templateName: 'Quarterly Business Review',
  sections: [
    { id: 'qbr-info', title: 'QBR Information', fields: [
      { id: 'client-name', label: 'Client Organization', type: 'text', required: true },
      { id: 'quarter', label: 'Quarter', type: 'select', options: ['Q1', 'Q2', 'Q3', 'Q4'], required: true, half: true },
      { id: 'year', label: 'Year', type: 'text', placeholder: '2026', half: true },
      { id: 'account-manager', label: 'Account Manager', type: 'text' },
    ]},
    { id: 'sla-performance', title: 'SLA Performance', fields: [
      { id: 'sla-uptime', label: 'Uptime SLA Achievement (%)', type: 'number', half: true },
      { id: 'sla-response', label: 'Response Time SLA (%)', type: 'number', half: true },
      { id: 'sla-resolution', label: 'Resolution Time SLA (%)', type: 'number', half: true },
      { id: 'sla-overall', label: 'Overall SLA Compliance (%)', type: 'number', half: true },
      { id: 'sla-notes', label: 'SLA Commentary', type: 'textarea', placeholder: 'Explain any SLA misses and corrective actions...' },
    ]},
    { id: 'service-summary', title: 'Service Delivery Summary', fields: [
      { id: 'hours-delivered', label: 'Hours Delivered', type: 'number', half: true },
      { id: 'hours-budgeted', label: 'Hours Budgeted', type: 'number', half: true },
      { id: 'tickets-opened', label: 'Tickets Opened', type: 'number', half: true },
      { id: 'tickets-closed', label: 'Tickets Resolved', type: 'number', half: true },
      { id: 'highlights', label: 'Key Accomplishments', type: 'textarea', placeholder: 'Major milestones, completed projects...' },
      { id: 'challenges', label: 'Challenges & Issues', type: 'textarea' },
    ]},
    { id: 'next-quarter', title: 'Next Quarter Plan', fields: [
      { id: 'planned-work', label: 'Planned Activities', type: 'textarea', placeholder: 'Upcoming assessments, projects, renewals...' },
      { id: 'budget-forecast', label: 'Budget Forecast', type: 'text' },
      { id: 'action-items', label: 'Action Items', type: 'textarea', placeholder: 'Owner | Action | Due Date\n---|---|---' },
    ]},
  ],
}

const nist171: TemplateStructure = {
  templateName: 'NIST 800-171 Self-Assessment',
  sections: [
    { id: 'org-info', title: 'Organization Information', fields: [
      { id: 'org-name', label: 'Organization Name', type: 'text', required: true },
      { id: 'cage-code', label: 'CAGE Code', type: 'text', half: true },
      { id: 'assessment-date', label: 'Assessment Date', type: 'date', required: true, half: true },
      { id: 'sprs-score', label: 'Current SPRS Score', type: 'number', placeholder: '-203 to 110' },
      { id: 'cui-boundary', label: 'CUI Boundary Description', type: 'textarea', required: true },
    ]},
    { id: 'ac', title: 'Access Control (3.1)', fields: [
      { id: 'ac-checklist', label: 'Controls', type: 'checklist', options: ['3.1.1 Limit system access', '3.1.2 Limit transaction types', '3.1.3 Control CUI flow', '3.1.5 Least privilege', '3.1.6 Non-privileged accounts for non-security', '3.1.7 Prevent non-privileged from executing privileged', '3.1.8 Limit unsuccessful login attempts', '3.1.12 Monitor remote access', '3.1.20 Verify external connections', '3.1.22 Control publicly accessible content'] },
      { id: 'ac-notes', label: 'Notes & Evidence', type: 'textarea' },
    ]},
    { id: 'ia', title: 'Identification & Authentication (3.5)', fields: [
      { id: 'ia-checklist', label: 'Controls', type: 'checklist', options: ['3.5.1 Identify system users and processes', '3.5.2 Authenticate users and processes', '3.5.3 Use MFA for local and network access', '3.5.4 Replay-resistant mechanisms', '3.5.7 Enforce minimum password complexity', '3.5.8 Prohibit password reuse', '3.5.10 Store and transmit cryptographically protected passwords'] },
      { id: 'ia-notes', label: 'Notes & Evidence', type: 'textarea' },
    ]},
    { id: 'sc', title: 'System & Communications Protection (3.13)', fields: [
      { id: 'sc-checklist', label: 'Controls', type: 'checklist', options: ['3.13.1 Monitor at system boundaries', '3.13.2 Employ architectural designs', '3.13.5 Public-access system separation', '3.13.8 Implement cryptographic mechanisms (transit)', '3.13.11 Employ FIPS-validated cryptography (rest)', '3.13.15 Protect communication authenticity'] },
      { id: 'sc-notes', label: 'Notes & Evidence', type: 'textarea' },
    ]},
    { id: 'summary', title: 'Assessment Summary', fields: [
      { id: 'calculated-score', label: 'Calculated SPRS Score', type: 'number' },
      { id: 'gaps-summary', label: 'Key Gaps Summary', type: 'textarea' },
      { id: 'remediation-plan', label: 'Remediation Plan', type: 'textarea' },
      { id: 'target-date', label: 'Target Full Compliance Date', type: 'date' },
    ]},
  ],
}

const soc2Readiness: TemplateStructure = {
  templateName: 'SOC 2 Readiness Assessment',
  sections: [
    { id: 'org-info', title: 'Organization Information', fields: [
      { id: 'org-name', label: 'Organization Name', type: 'text', required: true },
      { id: 'assessment-date', label: 'Assessment Date', type: 'date', required: true, half: true },
      { id: 'target-audit', label: 'Target Audit Date', type: 'date', half: true },
      { id: 'tsc-scope', label: 'TSC Categories in Scope', type: 'checklist', options: ['Security (required)', 'Availability', 'Processing Integrity', 'Confidentiality', 'Privacy'] },
      { id: 'system-desc', label: 'System Description', type: 'textarea', required: true },
    ]},
    { id: 'security', title: 'Security (CC Series)', fields: [
      { id: 'security-checklist', label: 'Common Criteria', type: 'checklist', options: ['CC1: Control environment', 'CC2: Communication and information', 'CC3: Risk assessment', 'CC4: Monitoring activities', 'CC5: Control activities', 'CC6: Logical and physical access', 'CC7: System operations', 'CC8: Change management', 'CC9: Risk mitigation'] },
      { id: 'security-gaps', label: 'Gaps & Remediation Needed', type: 'textarea' },
    ]},
    { id: 'readiness', title: 'Readiness Assessment', fields: [
      { id: 'readiness-level', label: 'Overall Readiness', type: 'select', options: ['Audit Ready', 'Minor Gaps (1-3 months)', 'Significant Gaps (3-6 months)', 'Major Gaps (6+ months)'], required: true },
      { id: 'remediation-items', label: 'Remediation Action Items', type: 'textarea', placeholder: 'Prioritized list of items to address before audit...' },
      { id: 'evidence-gaps', label: 'Missing Evidence / Documentation', type: 'textarea' },
      { id: 'estimated-cost', label: 'Estimated Remediation Cost', type: 'text' },
    ]},
  ],
}

const pciDss: TemplateStructure = {
  templateName: 'PCI-DSS v4.0 Gap Analysis',
  sections: [
    { id: 'org-info', title: 'Organization Information', fields: [
      { id: 'org-name', label: 'Merchant / Service Provider', type: 'text', required: true },
      { id: 'saq-type', label: 'SAQ Type', type: 'select', options: ['SAQ A', 'SAQ A-EP', 'SAQ B', 'SAQ B-IP', 'SAQ C', 'SAQ C-VT', 'SAQ D - Merchant', 'SAQ D - Service Provider', 'ROC'], required: true },
      { id: 'assessment-date', label: 'Assessment Date', type: 'date', required: true },
      { id: 'cde-description', label: 'Cardholder Data Environment (CDE) Description', type: 'textarea', required: true },
    ]},
    { id: 'requirements', title: 'Requirements Assessment', fields: [
      { id: 'req-checklist', label: 'PCI-DSS Requirements', type: 'checklist', options: ['Req 1: Network security controls', 'Req 2: Secure configurations', 'Req 3: Protect stored account data', 'Req 4: Protect data in transit', 'Req 5: Protect from malicious software', 'Req 6: Develop secure systems', 'Req 7: Restrict access by business need', 'Req 8: Identify users and authenticate', 'Req 9: Restrict physical access', 'Req 10: Log and monitor all access', 'Req 11: Test security regularly', 'Req 12: Support security with policies'] },
      { id: 'gap-details', label: 'Gap Details', type: 'textarea', placeholder: 'Document gaps per requirement...' },
    ]},
    { id: 'remediation', title: 'Remediation Plan', fields: [
      { id: 'remediation-plan', label: 'Remediation Actions', type: 'textarea', required: true },
      { id: 'compensating-controls', label: 'Compensating Controls', type: 'textarea' },
      { id: 'target-compliance', label: 'Target Compliance Date', type: 'date' },
    ]},
  ],
}

const incidentPostMortem: TemplateStructure = {
  templateName: 'Incident Post-Mortem Report',
  sections: [
    { id: 'incident-info', title: 'Incident Information', fields: [
      { id: 'incident-id', label: 'Incident ID', type: 'text', required: true, half: true },
      { id: 'severity', label: 'Severity', type: 'select', options: ['SEV-1 Critical', 'SEV-2 High', 'SEV-3 Medium', 'SEV-4 Low'], required: true, half: true },
      { id: 'incident-type', label: 'Incident Type', type: 'select', options: ['Malware / Ransomware', 'Phishing', 'Data Breach', 'DDoS', 'Insider Threat', 'Unauthorized Access', 'System Outage', 'Other'] },
      { id: 'detected-date', label: 'Date Detected', type: 'date', required: true, half: true },
      { id: 'resolved-date', label: 'Date Resolved', type: 'date', half: true },
      { id: 'affected-systems', label: 'Affected Systems', type: 'textarea', required: true },
      { id: 'incident-lead', label: 'Incident Commander', type: 'text' },
    ]},
    { id: 'timeline', title: 'Incident Timeline', fields: [
      { id: 'timeline', label: 'Timeline of Events', type: 'textarea', placeholder: 'Time | Event | Action Taken\n---|---|---\n14:30 | Alert triggered | SOC began investigation\n14:45 | Confirmed malicious activity | Escalated to IR team\n...', required: true },
    ]},
    { id: 'rca', title: 'Root Cause Analysis', fields: [
      { id: 'root-cause', label: 'Root Cause', type: 'textarea', placeholder: 'What was the fundamental cause of this incident?', required: true },
      { id: 'contributing-factors', label: 'Contributing Factors', type: 'textarea' },
      { id: 'attack-vector', label: 'Attack Vector', type: 'text' },
    ]},
    { id: 'impact', title: 'Impact Assessment', fields: [
      { id: 'business-impact', label: 'Business Impact', type: 'textarea', required: true },
      { id: 'data-impact', label: 'Data Impact', type: 'select', options: ['No data exposed', 'Internal data exposed', 'Customer PII exposed', 'Regulated data exposed (PHI/CUI)', 'Unknown'] },
      { id: 'financial-impact', label: 'Estimated Financial Impact', type: 'text' },
      { id: 'downtime', label: 'Total Downtime', type: 'text', placeholder: 'e.g. 4 hours 23 minutes' },
    ]},
    { id: 'lessons', title: 'Lessons Learned & Action Items', fields: [
      { id: 'what-went-well', label: 'What Went Well', type: 'textarea' },
      { id: 'what-needs-improvement', label: 'What Needs Improvement', type: 'textarea' },
      { id: 'action-items', label: 'Action Items', type: 'textarea', placeholder: 'Action | Owner | Due Date | Status\n---|---|---|---' },
    ]},
  ],
}

const tabletopExercise: TemplateStructure = {
  templateName: 'Tabletop Exercise Guide',
  sections: [
    { id: 'exercise-info', title: 'Exercise Information', fields: [
      { id: 'org-name', label: 'Organization', type: 'text', required: true },
      { id: 'exercise-date', label: 'Exercise Date', type: 'date', required: true, half: true },
      { id: 'facilitator', label: 'Facilitator', type: 'text', required: true, half: true },
      { id: 'scenario-type', label: 'Scenario Type', type: 'select', options: ['Ransomware Attack', 'Data Breach', 'Insider Threat', 'DDoS / Availability', 'Phishing Campaign', 'Supply Chain Compromise', 'Custom'] },
      { id: 'participants', label: 'Participants', type: 'textarea', placeholder: 'Name | Role | Department\n---|---|---' },
      { id: 'objectives', label: 'Exercise Objectives', type: 'textarea', placeholder: 'What this exercise aims to test and validate...' },
    ]},
    { id: 'scenario', title: 'Scenario Script', fields: [
      { id: 'scenario-background', label: 'Scenario Background', type: 'textarea', placeholder: 'Set the scene for participants...' },
      { id: 'inject-1', label: 'Inject 1 - Initial Alert', type: 'textarea', placeholder: 'Describe the initial incident trigger...' },
      { id: 'inject-1-questions', label: 'Discussion Questions', type: 'textarea', placeholder: 'Questions to ask participants after Inject 1...' },
      { id: 'inject-2', label: 'Inject 2 - Escalation', type: 'textarea', placeholder: 'The situation escalates...' },
      { id: 'inject-2-questions', label: 'Discussion Questions', type: 'textarea' },
      { id: 'inject-3', label: 'Inject 3 - Resolution Phase', type: 'textarea', placeholder: 'Resolution and recovery decisions...' },
      { id: 'inject-3-questions', label: 'Discussion Questions', type: 'textarea' },
    ]},
    { id: 'evaluation', title: 'Evaluation & Findings', fields: [
      { id: 'performance-areas', label: 'Performance Assessment', type: 'checklist', options: ['Detection & initial response adequate', 'Escalation procedures followed', 'Communication plan executed', 'Technical response appropriate', 'Executive decision-making timely', 'External communications handled', 'Recovery procedures understood'] },
      { id: 'gaps-identified', label: 'Gaps Identified', type: 'textarea' },
      { id: 'action-items', label: 'Improvement Action Items', type: 'textarea' },
    ]},
  ],
}

const serviceTransition: TemplateStructure = {
  templateName: 'Service Transition Runbook',
  sections: [
    { id: 'transition-info', title: 'Transition Information', fields: [
      { id: 'client-name', label: 'Client Organization', type: 'text', required: true },
      { id: 'from-phase', label: 'Transitioning From', type: 'select', options: ['Assessment', 'Gap Analysis', 'Pen Test', 'Incident Response'], half: true },
      { id: 'to-services', label: 'Transitioning To', type: 'select', options: ['ForgeShield (Managed Security)', 'ForgeSOC 360', 'ForgeComply', 'Full Platform'], half: true },
      { id: 'transition-date', label: 'Target Transition Date', type: 'date', required: true },
      { id: 'account-manager', label: 'Account Manager', type: 'text' },
    ]},
    { id: 'pre-transition', title: 'Pre-Transition Checklist', fields: [
      { id: 'pre-checklist', label: 'Pre-Transition Tasks', type: 'checklist', options: ['Assessment report delivered and accepted', 'Service proposal reviewed and signed', 'SOW executed', 'Technical requirements documented', 'Environment access confirmed', 'Licensing and subscriptions provisioned', 'Transition meeting scheduled'] },
      { id: 'pre-notes', label: 'Notes', type: 'textarea' },
    ]},
    { id: 'deployment', title: 'Deployment Tasks', fields: [
      { id: 'deploy-checklist', label: 'Deployment Checklist', type: 'checklist', options: ['Agent deployment completed', 'SIEM integration configured', 'Log forwarding validated', 'Alert rules configured', 'Compliance policies applied', 'Dashboards and reporting setup', 'Runbooks customized for client', 'Knowledge base articles created'] },
      { id: 'deploy-notes', label: 'Deployment Notes', type: 'textarea' },
    ]},
    { id: 'validation', title: 'Validation & Handoff', fields: [
      { id: 'validation-checklist', label: 'Validation', type: 'checklist', options: ['All services operational', 'Alerting tested and verified', 'Client team trained', 'Escalation paths confirmed', 'Documentation handed off', 'Steady-state meeting cadence set', 'Client satisfaction confirmed'] },
      { id: 'handoff-notes', label: 'Handoff Notes', type: 'textarea' },
      { id: 'first-review-date', label: 'First Service Review Date', type: 'date' },
    ]},
  ],
}

const changeManagement: TemplateStructure = {
  templateName: 'Change Management Request',
  sections: [
    { id: 'change-info', title: 'Change Request Information', fields: [
      { id: 'change-id', label: 'Change Request ID', type: 'text', required: true, half: true },
      { id: 'request-date', label: 'Request Date', type: 'date', required: true, half: true },
      { id: 'requestor', label: 'Requested By', type: 'text', required: true, half: true },
      { id: 'priority', label: 'Priority', type: 'select', options: ['Emergency', 'High', 'Normal', 'Low'], required: true, half: true },
      { id: 'change-type', label: 'Change Type', type: 'select', options: ['Standard', 'Normal', 'Emergency'], required: true },
      { id: 'description', label: 'Change Description', type: 'textarea', required: true },
      { id: 'justification', label: 'Business Justification', type: 'textarea', required: true },
    ]},
    { id: 'impact', title: 'Impact & Risk Assessment', fields: [
      { id: 'affected-systems', label: 'Affected Systems', type: 'textarea' },
      { id: 'risk-level', label: 'Risk Level', type: 'select', options: ['High', 'Medium', 'Low'] },
      { id: 'impact-assessment', label: 'Impact Assessment', type: 'textarea', placeholder: 'Describe potential impact on services, users, and security...' },
      { id: 'rollback-plan', label: 'Rollback Plan', type: 'textarea', placeholder: 'Steps to revert the change if issues occur...', required: true },
    ]},
    { id: 'implementation', title: 'Implementation Plan', fields: [
      { id: 'scheduled-date', label: 'Scheduled Date/Time', type: 'date', required: true, half: true },
      { id: 'maintenance-window', label: 'Maintenance Window', type: 'text', placeholder: 'e.g. 02:00-06:00 EST', half: true },
      { id: 'implementation-steps', label: 'Implementation Steps', type: 'textarea', placeholder: 'Step-by-step implementation plan...', required: true },
      { id: 'testing-plan', label: 'Testing / Validation Plan', type: 'textarea' },
      { id: 'communication', label: 'Communication Plan', type: 'textarea', placeholder: 'Who needs to be notified before, during, and after...' },
    ]},
    { id: 'approval', title: 'Approval', fields: [
      { id: 'approver', label: 'Approver', type: 'text' },
      { id: 'approval-status', label: 'Status', type: 'select', options: ['Pending', 'Approved', 'Rejected', 'Deferred'] },
      { id: 'approval-notes', label: 'Approval Notes', type: 'textarea' },
      { id: 'post-impl-review', label: 'Post-Implementation Review', type: 'textarea', placeholder: 'Document the outcome after the change is implemented...' },
    ]},
  ],
}

// ─── Export all structures mapped by template name ───────────────────
export const templateStructures: Record<string, TemplateStructure> = {
  'Security Posture Assessment': securityPostureAssessment,
  'Executive Summary Report': executiveSummaryReport,
  'CMMC 2.0 Gap Analysis': cmmcGapAnalysis,
  'Vulnerability Assessment Report': vulnerabilityAssessment,
  'Incident Response Plan': incidentResponsePlan,
  'Customer Onboarding Package': customerOnboarding,
  'HIPAA Gap Analysis': hipaaGapAnalysis,
  'Monthly Security Report': monthlySecurityReport,
  'POA&M Template': poamTemplate,
  'Penetration Test Report': penTestReport,
  'Third-Party Risk Assessment': thirdPartyRisk,
  'Board Cybersecurity Brief': boardBrief,
  'Quarterly Business Review': qbr,
  'NIST 800-171 Self-Assessment': nist171,
  'SOC 2 Readiness Assessment': soc2Readiness,
  'PCI-DSS v4.0 Gap Analysis': pciDss,
  'Incident Post-Mortem Report': incidentPostMortem,
  'Tabletop Exercise Guide': tabletopExercise,
  'Service Transition Runbook': serviceTransition,
  'Statement of Work': statementOfWork,
  'Change Management Request': changeManagement,
}

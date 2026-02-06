// ─── Core Entity Types ──────────────────────────────────────────────────────

export interface Organization {
  id: string
  name: string
  sector: string
  address: string
  cityStateZip: string
  website: string
  employeeCount: string
  createdAt: string
}

export interface Contact {
  id: string
  organizationId: string
  name: string
  title: string
  email: string
  phone: string
  preferredContact: string
}

export interface Opportunity {
  id: string
  organizationId: string
  organizationName: string
  sector: string
  stage: 'lead' | 'assessment' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
  value: number
  description: string
  source: string
  createdAt: string
  updatedAt: string
}

export interface Engagement {
  id: string
  organizationId: string
  organizationName: string
  type: string
  consultant: string
  status: 'on_track' | 'at_risk' | 'blocked' | 'completed'
  hoursUsed: number
  hoursBudget: number
  revenue: number
  dueDate: string
  createdAt: string
}

export interface Assessment {
  id: string
  organizationId: string
  organizationName: string
  type: string
  consultant: string
  progress: number
  status: 'in_progress' | 'completed' | 'pending'
  domainRatings: Record<string, number>
  findings: Finding[]
  startedAt: string
  completedAt?: string
}

export interface Finding {
  id: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  nistControl: string
}

export interface TeamMember {
  id: string
  initials: string
  name: string
  role: string
  specializations: string[]
  utilization: number
  activeEngagements: number
  status: 'available' | 'busy' | 'out'
}

// ─── Form Data Types ────────────────────────────────────────────────────────

export interface IntakeFormData {
  organization: {
    name: string
    sector: string
    address: string
    cityStateZip: string
    website: string
    employeeCount: string
  }
  contact: {
    name: string
    title: string
    email: string
    phone: string
    preferredContact: string
  }
  compliance: string[]
  securityTools: string
  securityChallenges: string
  services: string[]
  timeline: string
  budget: string
  notes: string
}

export interface NewAssessmentFormData {
  customerId: string
  type: string
  consultant: string
  targetDate: string
}

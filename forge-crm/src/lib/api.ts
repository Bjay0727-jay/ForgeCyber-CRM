import {
  customers,
  pipelineColumns,
  operationsEngagements,
  activeAssessments,
  teamMembers as teamMembersData,
  securityDomains,
  sampleFindings,
} from '../data/mockData'

import type {
  Organization,
  Contact,
  Opportunity,
  Engagement,
  Assessment,
  Finding,
  TeamMember,
  IntakeFormData,
  NewAssessmentFormData,
} from '../types'

// ─── LocalStorage Store ─────────────────────────────────────────────────────

const STORAGE_PREFIX = 'forge_crm_'
const SEED_VERSION_KEY = `${STORAGE_PREFIX}seed_version`
const CURRENT_SEED_VERSION = '1'

const store = {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`)
      return raw ? (JSON.parse(raw) as T) : null
    } catch {
      return null
    }
  },

  set<T>(key: string, value: T): void {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value))
  },

  remove(key: string): void {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`)
  },
}

// ─── Seed Data Conversion ───────────────────────────────────────────────────

/** Parse sector from the customer detail string like "Defense Contractor - Arlington, VA - CMMC Level 2" */
function parseSector(detail: string): string {
  return detail.split('\u2022')[0]?.trim() ?? ''
}

/** Parse city/state from customer detail */
function parseCityState(detail: string): string {
  const parts = detail.split('\u2022')
  return parts[1]?.trim() ?? ''
}

/** Map the mock pipeline stage title to a typed stage value */
function normalizeStage(title: string): Opportunity['stage'] {
  const map: Record<string, Opportunity['stage']> = {
    'Lead': 'lead',
    'Assessment': 'assessment',
    'Proposal': 'proposal',
    'Negotiation': 'negotiation',
    'Closed Won': 'closed_won',
    'Closed Lost': 'closed_lost',
  }
  return map[title] ?? 'lead'
}

/** Parse dollar value string like "$150,000" to a number */
function parseCurrency(val: string): number {
  return Number(val.replace(/[$,]/g, '')) || 0
}

/** Map mock engagement status string to typed status */
function normalizeEngagementStatus(status: string): Engagement['status'] {
  const s = status.toLowerCase().replace(/\s+/g, '_')
  if (s === 'on_track') return 'on_track'
  if (s === 'at_risk') return 'at_risk'
  if (s === 'blocked') return 'blocked'
  if (s === 'completed') return 'completed'
  // "In Progress" and "Testing" map to on_track
  return 'on_track'
}

/** Extract the sector portion from a pipeline card meta like "Defense Contractor - Initial Contact" */
function parsePipelineSector(meta: string): string {
  return meta.split('\u2022')[0]?.trim() ?? ''
}

/** Extract the description portion from a pipeline card meta */
function parsePipelineDescription(meta: string): string {
  return meta.split('\u2022')[1]?.trim() ?? ''
}

function buildSeedOrganizations(): Organization[] {
  const now = new Date().toISOString()
  return customers.map((c) => ({
    id: crypto.randomUUID(),
    name: c.name,
    sector: parseSector(c.detail),
    address: '',
    cityStateZip: parseCityState(c.detail),
    website: '',
    employeeCount: '',
    createdAt: now,
  }))
}

function buildSeedContacts(orgs: Organization[]): Contact[] {
  // No contact details in mock data, so create empty placeholders per org
  return orgs.map((org) => ({
    id: crypto.randomUUID(),
    organizationId: org.id,
    name: '',
    title: '',
    email: '',
    phone: '',
    preferredContact: 'email',
  }))
}

function buildSeedOpportunities(orgs: Organization[]): Opportunity[] {
  const now = new Date().toISOString()
  const opportunities: Opportunity[] = []

  for (const col of pipelineColumns) {
    const stage = normalizeStage(col.title)
    for (const card of col.cards) {
      // Try to find a matching organization by name
      const matchedOrg = orgs.find((o) => o.name === card.name)
      opportunities.push({
        id: crypto.randomUUID(),
        organizationId: matchedOrg?.id ?? '',
        organizationName: card.name,
        sector: parsePipelineSector(card.meta),
        stage,
        value: parseCurrency(card.value),
        description: parsePipelineDescription(card.meta),
        source: '',
        createdAt: now,
        updatedAt: now,
      })
    }
  }

  return opportunities
}

function buildSeedEngagements(orgs: Organization[]): Engagement[] {
  const now = new Date().toISOString()
  return operationsEngagements.map((e) => {
    const matchedOrg = orgs.find((o) => o.name === e.customer)
    return {
      id: crypto.randomUUID(),
      organizationId: matchedOrg?.id ?? '',
      organizationName: e.customer,
      type: e.type,
      consultant: e.consultant,
      status: normalizeEngagementStatus(e.status),
      hoursUsed: e.hoursUsed,
      hoursBudget: e.hoursBudget,
      revenue: parseCurrency(e.revenue),
      dueDate: '',
      createdAt: now,
    }
  })
}

function buildSeedAssessments(orgs: Organization[]): Assessment[] {
  return activeAssessments.map((a) => {
    const matchedOrg = orgs.find((o) => o.name === a.customer)

    // Build default domain ratings (0 for each domain)
    const domainRatings: Record<string, number> = {}
    for (const domain of securityDomains) {
      domainRatings[domain] = 0
    }

    // Attach sample findings to the first assessment
    const findings: Finding[] = sampleFindings.map((f) => ({
      id: crypto.randomUUID(),
      severity: f.severity,
      title: f.title,
      description: f.desc,
      nistControl: f.nist,
    }))

    return {
      id: crypto.randomUUID(),
      organizationId: matchedOrg?.id ?? '',
      organizationName: a.customer,
      type: a.type,
      consultant: a.consultant,
      progress: a.progress,
      status: a.progress >= 100 ? 'completed' : 'in_progress',
      domainRatings,
      findings,
      startedAt: a.started,
    }
  })
}

function buildSeedTeamMembers(): TeamMember[] {
  return teamMembersData.map((t) => ({
    id: crypto.randomUUID(),
    initials: t.initials,
    name: t.name,
    role: t.role,
    specializations: t.specializations,
    utilization: t.utilization,
    activeEngagements: t.activeEngagements,
    status: t.status,
  }))
}

// ─── Seed Initialization ────────────────────────────────────────────────────

function seedIfNeeded(): void {
  const existingVersion = localStorage.getItem(SEED_VERSION_KEY)
  if (existingVersion === CURRENT_SEED_VERSION) return

  const orgs = buildSeedOrganizations()
  const contacts = buildSeedContacts(orgs)
  const opportunities = buildSeedOpportunities(orgs)
  const engagements = buildSeedEngagements(orgs)
  const assessments = buildSeedAssessments(orgs)
  const team = buildSeedTeamMembers()

  store.set('organizations', orgs)
  store.set('contacts', contacts)
  store.set('opportunities', opportunities)
  store.set('engagements', engagements)
  store.set('assessments', assessments)
  store.set('teamMembers', team)

  localStorage.setItem(SEED_VERSION_KEY, CURRENT_SEED_VERSION)
}

// Run seed check on module load
seedIfNeeded()

// ─── Organizations ──────────────────────────────────────────────────────────

export function getOrganizations(): Organization[] {
  return store.get<Organization[]>('organizations') ?? []
}

export function getOrganization(id: string): Organization | undefined {
  const orgs = getOrganizations()
  return orgs.find((o) => o.id === id)
}

export function createOrganization(data: IntakeFormData): Organization {
  const orgs = getOrganizations()
  const contacts = store.get<Contact[]>('contacts') ?? []

  const newOrg: Organization = {
    id: crypto.randomUUID(),
    name: data.organization.name,
    sector: data.organization.sector,
    address: data.organization.address,
    cityStateZip: data.organization.cityStateZip,
    website: data.organization.website,
    employeeCount: data.organization.employeeCount,
    createdAt: new Date().toISOString(),
  }

  const newContact: Contact = {
    id: crypto.randomUUID(),
    organizationId: newOrg.id,
    name: data.contact.name,
    title: data.contact.title,
    email: data.contact.email,
    phone: data.contact.phone,
    preferredContact: data.contact.preferredContact,
  }

  // Also create a lead opportunity if budget was provided
  if (data.budget) {
    const opportunities = getOpportunities()
    const newOpp: Opportunity = {
      id: crypto.randomUUID(),
      organizationId: newOrg.id,
      organizationName: newOrg.name,
      sector: newOrg.sector,
      stage: 'lead',
      value: parseCurrency(data.budget),
      description: data.services.join(', '),
      source: 'Intake Form',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    store.set('opportunities', [...opportunities, newOpp])
  }

  store.set('organizations', [...orgs, newOrg])
  store.set('contacts', [...contacts, newContact])

  return newOrg
}

// ─── Contacts ───────────────────────────────────────────────────────────────

export function getContacts(): Contact[] {
  return store.get<Contact[]>('contacts') ?? []
}

export function getContactsByOrganization(organizationId: string): Contact[] {
  return getContacts().filter((c) => c.organizationId === organizationId)
}

// ─── Opportunities ──────────────────────────────────────────────────────────

export function getOpportunities(): Opportunity[] {
  return store.get<Opportunity[]>('opportunities') ?? []
}

export function updateOpportunityStage(id: string, stage: Opportunity['stage']): Opportunity {
  const opportunities = getOpportunities()
  const idx = opportunities.findIndex((o) => o.id === id)
  if (idx === -1) throw new Error(`Opportunity not found: ${id}`)

  opportunities[idx] = {
    ...opportunities[idx],
    stage,
    updatedAt: new Date().toISOString(),
  }

  store.set('opportunities', opportunities)
  return opportunities[idx]
}

// ─── Assessments ────────────────────────────────────────────────────────────

export function getAssessments(): Assessment[] {
  return store.get<Assessment[]>('assessments') ?? []
}

export function getAssessment(id: string): Assessment | undefined {
  return getAssessments().find((a) => a.id === id)
}

export function createAssessment(data: NewAssessmentFormData): Assessment {
  const assessments = getAssessments()
  const org = getOrganization(data.customerId)

  const domainRatings: Record<string, number> = {}
  for (const domain of securityDomains) {
    domainRatings[domain] = 0
  }

  const newAssessment: Assessment = {
    id: crypto.randomUUID(),
    organizationId: data.customerId,
    organizationName: org?.name ?? 'Unknown',
    type: data.type,
    consultant: data.consultant,
    progress: 0,
    status: 'pending',
    domainRatings,
    findings: [],
    startedAt: new Date().toISOString(),
  }

  store.set('assessments', [...assessments, newAssessment])
  return newAssessment
}

export function updateAssessmentRatings(
  id: string,
  ratings: Record<string, number>
): Assessment {
  const assessments = getAssessments()
  const idx = assessments.findIndex((a) => a.id === id)
  if (idx === -1) throw new Error(`Assessment not found: ${id}`)

  assessments[idx] = {
    ...assessments[idx],
    domainRatings: { ...assessments[idx].domainRatings, ...ratings },
    status: 'in_progress',
  }

  store.set('assessments', assessments)
  return assessments[idx]
}

export function updateAssessmentProgress(id: string, progress: number): Assessment {
  const assessments = getAssessments()
  const idx = assessments.findIndex((a) => a.id === id)
  if (idx === -1) throw new Error(`Assessment not found: ${id}`)

  const clamped = Math.max(0, Math.min(100, progress))
  assessments[idx] = {
    ...assessments[idx],
    progress: clamped,
    status: clamped >= 100 ? 'completed' : 'in_progress',
    ...(clamped >= 100 ? { completedAt: new Date().toISOString() } : {}),
  }

  store.set('assessments', assessments)
  return assessments[idx]
}

export function addAssessmentFinding(id: string, finding: Omit<Finding, 'id'>): Assessment {
  const assessments = getAssessments()
  const idx = assessments.findIndex((a) => a.id === id)
  if (idx === -1) throw new Error(`Assessment not found: ${id}`)

  const newFinding: Finding = {
    id: crypto.randomUUID(),
    ...finding,
  }

  assessments[idx] = {
    ...assessments[idx],
    findings: [...assessments[idx].findings, newFinding],
  }

  store.set('assessments', assessments)
  return assessments[idx]
}

// ─── Engagements ────────────────────────────────────────────────────────────

export function getEngagements(): Engagement[] {
  return store.get<Engagement[]>('engagements') ?? []
}

export function getEngagement(id: string): Engagement | undefined {
  return getEngagements().find((e) => e.id === id)
}

// ─── Team Members ───────────────────────────────────────────────────────────

export function getTeamMembers(): TeamMember[] {
  return store.get<TeamMember[]>('teamMembers') ?? []
}

export function getTeamMember(id: string): TeamMember | undefined {
  return getTeamMembers().find((t) => t.id === id)
}

// ─── Search ─────────────────────────────────────────────────────────────────

export function searchAll(query: string): {
  organizations: Organization[]
  assessments: Assessment[]
  engagements: Engagement[]
} {
  const q = query.toLowerCase().trim()
  if (!q) {
    return { organizations: [], assessments: [], engagements: [] }
  }

  const organizations = getOrganizations().filter(
    (o) =>
      o.name.toLowerCase().includes(q) ||
      o.sector.toLowerCase().includes(q) ||
      o.cityStateZip.toLowerCase().includes(q)
  )

  const assessments = getAssessments().filter(
    (a) =>
      a.organizationName.toLowerCase().includes(q) ||
      a.type.toLowerCase().includes(q) ||
      a.consultant.toLowerCase().includes(q)
  )

  const engagements = getEngagements().filter(
    (e) =>
      e.organizationName.toLowerCase().includes(q) ||
      e.type.toLowerCase().includes(q) ||
      e.consultant.toLowerCase().includes(q)
  )

  return { organizations, assessments, engagements }
}

// ─── Utility: Reset all data (useful for development) ───────────────────────

export function resetAllData(): void {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith(STORAGE_PREFIX))
  for (const key of keys) {
    localStorage.removeItem(key)
  }
  seedIfNeeded()
}

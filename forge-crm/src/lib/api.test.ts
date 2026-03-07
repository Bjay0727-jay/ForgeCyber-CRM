import { describe, it, expect, beforeEach } from 'vitest'
import {
  getOrganizations,
  getOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getContacts,
  getContactsByOrganization,
  createContact,
  updateContact,
  deleteContact,
  getOpportunities,
  updateOpportunityStage,
  updateOpportunity,
  deleteOpportunity,
  getAssessments,
  getAssessment,
  createAssessment,
  updateAssessmentRatings,
  updateAssessmentProgress,
  addAssessmentFinding,
  deleteAssessment,
  getEngagements,
  createEngagement,
  updateEngagement,
  deleteEngagement,
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  searchAll,
  resetAllData,
} from './api'
import type { IntakeFormData, NewAssessmentFormData } from '../types'

// Clear localStorage before each test to ensure isolation
beforeEach(() => {
  localStorage.clear()
  // Re-seed by resetting
  resetAllData()
})

/** Helper to create a test organization via the intake form */
function createTestOrg(name = 'Test Corp', budget = '$50,000'): ReturnType<typeof createOrganization> {
  const formData: IntakeFormData = {
    organization: {
      name,
      sector: 'Technology',
      address: '123 Main St',
      cityStateZip: 'Austin, TX 78701',
      website: 'https://test.com',
      employeeCount: '100',
    },
    contact: {
      name: 'John Doe',
      title: 'CISO',
      email: 'john@test.com',
      phone: '555-0100',
      preferredContact: 'email',
    },
    compliance: ['NIST'],
    securityTools: 'Splunk',
    securityChallenges: 'Visibility',
    services: ['Assessment'],
    timeline: '30 days',
    budget,
    notes: 'Test notes',
  }
  return createOrganization(formData)
}

describe('Organizations', () => {
  it('starts with empty organizations', () => {
    const orgs = getOrganizations()
    expect(orgs).toEqual([])
  })

  it('getOrganization returns undefined for unknown ID', () => {
    expect(getOrganization('nonexistent-id')).toBeUndefined()
  })

  it('createOrganization adds a new org and contact', () => {
    const before = getOrganizations().length
    const contactsBefore = getContacts().length

    const newOrg = createTestOrg()
    expect(newOrg.name).toBe('Test Corp')
    expect(newOrg.sector).toBe('Technology')
    expect(newOrg.id).toBeTruthy()

    expect(getOrganizations().length).toBe(before + 1)
    expect(getContacts().length).toBe(contactsBefore + 1)
  })

  it('getOrganization returns the created org by ID', () => {
    const org = createTestOrg()
    const found = getOrganization(org.id)
    expect(found).toBeDefined()
    expect(found?.name).toBe(org.name)
  })

  it('createOrganization creates a lead opportunity when budget is provided', () => {
    const oppsBefore = getOpportunities().length

    createTestOrg('Budget Corp', '$100,000')

    const oppsAfter = getOpportunities()
    expect(oppsAfter.length).toBe(oppsBefore + 1)

    const newOpp = oppsAfter[oppsAfter.length - 1]
    expect(newOpp.stage).toBe('lead')
    expect(newOpp.value).toBe(100000)
  })
})

describe('Opportunities', () => {
  it('updateOpportunityStage changes stage and timestamp', () => {
    createTestOrg()
    const opps = getOpportunities()
    expect(opps.length).toBeGreaterThan(0)

    const opp = opps[0]
    const updated = updateOpportunityStage(opp.id, 'proposal')
    expect(updated.stage).toBe('proposal')
    expect(updated.updatedAt).toBeDefined()
    expect(new Date(updated.updatedAt).getTime()).toBeGreaterThanOrEqual(new Date(opp.updatedAt).getTime())
  })

  it('updateOpportunityStage throws for unknown ID', () => {
    expect(() => updateOpportunityStage('bad-id', 'lead')).toThrow()
  })
})

describe('Assessments', () => {
  it('starts with empty assessments', () => {
    const assessments = getAssessments()
    expect(assessments).toEqual([])
  })

  it('createAssessment adds a new assessment', () => {
    const org = createTestOrg()
    const before = getAssessments().length

    const data: NewAssessmentFormData = {
      customerId: org.id,
      type: 'CMMC 2.0 Assessment',
      consultant: 'Michael Torres',
      targetDate: '2026-02-20',
    }

    const created = createAssessment(data)
    expect(created.organizationName).toBe(org.name)
    expect(created.progress).toBe(0)
    expect(created.status).toBe('pending')
    expect(created.findings).toEqual([])
    expect(getAssessments().length).toBe(before + 1)
  })

  it('getAssessment finds by ID', () => {
    const org = createTestOrg()
    const created = createAssessment({
      customerId: org.id,
      type: 'Gap Analysis',
      consultant: 'Test',
      targetDate: '2026-03-01',
    })
    const found = getAssessment(created.id)
    expect(found?.id).toBe(created.id)
  })

  it('updateAssessmentRatings merges ratings', () => {
    const org = createTestOrg()
    const created = createAssessment({
      customerId: org.id,
      type: 'Assessment',
      consultant: 'Test',
      targetDate: '2026-03-01',
    })

    const ratings = { 'Governance & Risk Management': 3, 'Access Control & Identity': 4 }
    const updated = updateAssessmentRatings(created.id, ratings)
    expect(updated.domainRatings['Governance & Risk Management']).toBe(3)
    expect(updated.domainRatings['Access Control & Identity']).toBe(4)
    expect(updated.status).toBe('in_progress')
  })

  it('updateAssessmentProgress clamps 0-100 and sets completed', () => {
    const org = createTestOrg()
    const created = createAssessment({
      customerId: org.id,
      type: 'Assessment',
      consultant: 'Test',
      targetDate: '2026-03-01',
    })

    const partial = updateAssessmentProgress(created.id, 50)
    expect(partial.progress).toBe(50)
    expect(partial.status).toBe('in_progress')

    const completed = updateAssessmentProgress(created.id, 100)
    expect(completed.progress).toBe(100)
    expect(completed.status).toBe('completed')
    expect(completed.completedAt).toBeDefined()

    // Clamp over 100
    const over = updateAssessmentProgress(created.id, 150)
    expect(over.progress).toBe(100)
  })

  it('addAssessmentFinding appends a finding', () => {
    const org = createTestOrg()
    const created = createAssessment({
      customerId: org.id,
      type: 'Assessment',
      consultant: 'Test',
      targetDate: '2026-03-01',
    })

    const updated = addAssessmentFinding(created.id, {
      severity: 'high',
      title: 'Test Finding',
      description: 'A test finding',
      nistControl: 'AC-1',
    })

    expect(updated.findings.length).toBe(1)
    expect(updated.findings[0].title).toBe('Test Finding')
    expect(updated.findings[0].id).toBeTruthy()
  })
})

describe('Engagements', () => {
  it('starts with empty engagements', () => {
    const engs = getEngagements()
    expect(engs).toEqual([])
  })
})

describe('Team Members', () => {
  it('starts with empty team members', () => {
    const members = getTeamMembers()
    expect(members).toEqual([])
  })
})

describe('searchAll', () => {
  it('returns empty for empty query', () => {
    const result = searchAll('')
    expect(result.organizations).toHaveLength(0)
    expect(result.assessments).toHaveLength(0)
    expect(result.engagements).toHaveLength(0)
  })

  it('finds organizations by name', () => {
    createTestOrg('Acme Security')
    const result = searchAll('Acme')
    expect(result.organizations.length).toBeGreaterThan(0)
  })

  it('finds assessments by type', () => {
    const org = createTestOrg()
    createAssessment({
      customerId: org.id,
      type: 'CMMC 2.0 Assessment',
      consultant: 'Test',
      targetDate: '2026-03-01',
    })
    const result = searchAll('CMMC')
    expect(result.assessments.length).toBeGreaterThan(0)
  })
})

describe('resetAllData', () => {
  it('clears all data back to clean state', () => {
    // Create something
    createTestOrg('Temp Corp')
    expect(getOrganizations().length).toBe(1)

    resetAllData()

    expect(getOrganizations().length).toBe(0)
  })
})

describe('Contacts', () => {
  it('getContactsByOrganization filters correctly', () => {
    const org = createTestOrg()
    const contacts = getContactsByOrganization(org.id)
    expect(contacts.length).toBe(1)
    for (const c of contacts) {
      expect(c.organizationId).toBe(org.id)
    }
  })

  it('createContact adds a new contact', () => {
    const org = createTestOrg()
    const before = getContacts().length
    const contact = createContact({
      organizationId: org.id,
      name: 'New Contact',
      title: 'Engineer',
      email: 'new@test.com',
      phone: '555-0001',
      preferredContact: 'email',
    })
    expect(contact.id).toBeTruthy()
    expect(contact.name).toBe('New Contact')
    expect(getContacts().length).toBe(before + 1)
  })

  it('updateContact merges data', () => {
    createTestOrg()
    const contacts = getContacts()
    const updated = updateContact(contacts[0].id, { title: 'Updated Title' })
    expect(updated.title).toBe('Updated Title')
    expect(updated.name).toBe(contacts[0].name)
  })

  it('deleteContact removes the contact', () => {
    createTestOrg()
    const contacts = getContacts()
    const before = contacts.length
    deleteContact(contacts[0].id)
    expect(getContacts().length).toBe(before - 1)
  })
})

describe('Organization CRUD', () => {
  it('updateOrganization merges fields', () => {
    const org = createTestOrg()
    const updated = updateOrganization(org.id, { sector: 'Updated Sector' })
    expect(updated.sector).toBe('Updated Sector')
    expect(updated.name).toBe(org.name)
  })

  it('deleteOrganization cascade deletes contacts and opportunities', () => {
    const org = createTestOrg()
    const contactsBefore = getContacts().length
    const orgContacts = getContactsByOrganization(org.id).length

    deleteOrganization(org.id)

    expect(getOrganization(org.id)).toBeUndefined()
    expect(getContacts().length).toBe(contactsBefore - orgContacts)
  })
})

describe('Opportunity CRUD', () => {
  it('updateOpportunity merges fields', () => {
    createTestOrg()
    const opps = getOpportunities()
    const updated = updateOpportunity(opps[0].id, { value: 999999 })
    expect(updated.value).toBe(999999)
    expect(updated.organizationName).toBe(opps[0].organizationName)
  })

  it('deleteOpportunity removes the opportunity', () => {
    createTestOrg()
    const before = getOpportunities().length
    const opps = getOpportunities()
    deleteOpportunity(opps[0].id)
    expect(getOpportunities().length).toBe(before - 1)
  })
})

describe('Assessment CRUD', () => {
  it('deleteAssessment removes the assessment', () => {
    const org = createTestOrg()
    createAssessment({
      customerId: org.id,
      type: 'Test Assessment',
      consultant: 'Test',
      targetDate: '2026-03-01',
    })
    const before = getAssessments().length
    const assessments = getAssessments()
    deleteAssessment(assessments[0].id)
    expect(getAssessments().length).toBe(before - 1)
  })
})

describe('Engagement CRUD', () => {
  it('createEngagement adds a new engagement', () => {
    const before = getEngagements().length
    const eng = createEngagement({
      organizationId: 'org-1',
      organizationName: 'Test Org',
      type: 'Pen Test',
      consultant: 'Jane Doe',
      status: 'on_track',
      hoursUsed: 10,
      hoursBudget: 40,
      revenue: 5000,
      dueDate: '2026-03-01',
      createdAt: '2026-01-01',
    })
    expect(eng.id).toBeTruthy()
    expect(eng.type).toBe('Pen Test')
    expect(getEngagements().length).toBe(before + 1)
  })

  it('updateEngagement merges fields', () => {
    createEngagement({
      organizationId: 'org-1',
      organizationName: 'Test Org',
      type: 'Pen Test',
      consultant: 'Jane Doe',
      status: 'on_track',
      hoursUsed: 10,
      hoursBudget: 40,
      revenue: 5000,
      dueDate: '2026-03-01',
      createdAt: '2026-01-01',
    })
    const engs = getEngagements()
    const updated = updateEngagement(engs[0].id, { hoursUsed: 99 })
    expect(updated.hoursUsed).toBe(99)
    expect(updated.organizationName).toBe(engs[0].organizationName)
  })

  it('deleteEngagement removes the engagement', () => {
    createEngagement({
      organizationId: 'org-1',
      organizationName: 'Test Org',
      type: 'Pen Test',
      consultant: 'Jane Doe',
      status: 'on_track',
      hoursUsed: 10,
      hoursBudget: 40,
      revenue: 5000,
      dueDate: '2026-03-01',
      createdAt: '2026-01-01',
    })
    const before = getEngagements().length
    const engs = getEngagements()
    deleteEngagement(engs[0].id)
    expect(getEngagements().length).toBe(before - 1)
  })
})

describe('TeamMember CRUD', () => {
  it('createTeamMember adds a new member', () => {
    const before = getTeamMembers().length
    const member = createTeamMember({
      initials: 'TM',
      name: 'Test Member',
      role: 'Analyst',
      status: 'available',
      specializations: ['NIST', 'CMMC'],
      utilization: 50,
      activeEngagements: 2,
    })
    expect(member.id).toBeTruthy()
    expect(member.name).toBe('Test Member')
    expect(getTeamMembers().length).toBe(before + 1)
  })

  it('updateTeamMember merges fields', () => {
    createTeamMember({
      initials: 'TM',
      name: 'Test Member',
      role: 'Analyst',
      status: 'available',
      specializations: ['NIST'],
      utilization: 50,
      activeEngagements: 1,
    })
    const members = getTeamMembers()
    const updated = updateTeamMember(members[0].id, { utilization: 80 })
    expect(updated.utilization).toBe(80)
    expect(updated.name).toBe(members[0].name)
  })

  it('deleteTeamMember removes the member', () => {
    createTeamMember({
      initials: 'TM',
      name: 'Test Member',
      role: 'Analyst',
      status: 'available',
      specializations: ['NIST'],
      utilization: 50,
      activeEngagements: 1,
    })
    const before = getTeamMembers().length
    const members = getTeamMembers()
    deleteTeamMember(members[0].id)
    expect(getTeamMembers().length).toBe(before - 1)
  })
})

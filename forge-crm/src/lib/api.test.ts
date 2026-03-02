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

describe('Organizations', () => {
  it('returns seeded organizations', () => {
    const orgs = getOrganizations()
    expect(orgs.length).toBeGreaterThan(0)
    expect(orgs[0]).toHaveProperty('id')
    expect(orgs[0]).toHaveProperty('name')
    expect(orgs[0]).toHaveProperty('sector')
  })

  it('getOrganization returns a single org by ID', () => {
    const orgs = getOrganizations()
    const found = getOrganization(orgs[0].id)
    expect(found).toBeDefined()
    expect(found?.name).toBe(orgs[0].name)
  })

  it('getOrganization returns undefined for unknown ID', () => {
    expect(getOrganization('nonexistent-id')).toBeUndefined()
  })

  it('createOrganization adds a new org and contact', () => {
    const before = getOrganizations().length
    const contactsBefore = getContacts().length

    const formData: IntakeFormData = {
      organization: {
        name: 'Test Corp',
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
      budget: '$50,000',
      notes: 'Test notes',
    }

    const newOrg = createOrganization(formData)
    expect(newOrg.name).toBe('Test Corp')
    expect(newOrg.sector).toBe('Technology')
    expect(newOrg.id).toBeTruthy()

    expect(getOrganizations().length).toBe(before + 1)
    expect(getContacts().length).toBe(contactsBefore + 1)
  })

  it('createOrganization creates a lead opportunity when budget is provided', () => {
    const oppsBefore = getOpportunities().length

    const formData: IntakeFormData = {
      organization: { name: 'Budget Corp', sector: 'Finance', address: '', cityStateZip: '', website: '', employeeCount: '' },
      contact: { name: 'Jane', title: '', email: 'j@b.com', phone: '', preferredContact: 'email' },
      compliance: [],
      securityTools: '',
      securityChallenges: '',
      services: ['Pentest'],
      timeline: '',
      budget: '$100,000',
      notes: '',
    }

    createOrganization(formData)
    const oppsAfter = getOpportunities()
    expect(oppsAfter.length).toBe(oppsBefore + 1)

    const newOpp = oppsAfter[oppsAfter.length - 1]
    expect(newOpp.stage).toBe('lead')
    expect(newOpp.value).toBe(100000)
  })
})

describe('Opportunities', () => {
  it('returns seeded opportunities', () => {
    const opps = getOpportunities()
    expect(opps.length).toBeGreaterThan(0)
    expect(opps[0]).toHaveProperty('stage')
    expect(opps[0]).toHaveProperty('value')
  })

  it('updateOpportunityStage changes stage and timestamp', () => {
    const opps = getOpportunities()
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
  it('returns seeded assessments', () => {
    const assessments = getAssessments()
    expect(assessments.length).toBeGreaterThan(0)
    expect(assessments[0]).toHaveProperty('domainRatings')
    expect(assessments[0]).toHaveProperty('findings')
  })

  it('getAssessment finds by ID', () => {
    const all = getAssessments()
    const found = getAssessment(all[0].id)
    expect(found?.id).toBe(all[0].id)
  })

  it('createAssessment adds a new assessment', () => {
    const orgs = getOrganizations()
    const before = getAssessments().length

    const data: NewAssessmentFormData = {
      customerId: orgs[0].id,
      type: 'CMMC 2.0 Assessment',
      consultant: 'Michael Torres',
      targetDate: '2026-02-20',
    }

    const created = createAssessment(data)
    expect(created.organizationName).toBe(orgs[0].name)
    expect(created.progress).toBe(0)
    expect(created.status).toBe('pending')
    expect(created.findings).toEqual([])
    expect(getAssessments().length).toBe(before + 1)
  })

  it('updateAssessmentRatings merges ratings', () => {
    const all = getAssessments()
    const id = all[0].id

    const ratings = { 'Governance & Risk Management': 3, 'Access Control & Identity': 4 }
    const updated = updateAssessmentRatings(id, ratings)
    expect(updated.domainRatings['Governance & Risk Management']).toBe(3)
    expect(updated.domainRatings['Access Control & Identity']).toBe(4)
    expect(updated.status).toBe('in_progress')
  })

  it('updateAssessmentProgress clamps 0-100 and sets completed', () => {
    const all = getAssessments()
    const id = all[0].id

    const partial = updateAssessmentProgress(id, 50)
    expect(partial.progress).toBe(50)
    expect(partial.status).toBe('in_progress')

    const completed = updateAssessmentProgress(id, 100)
    expect(completed.progress).toBe(100)
    expect(completed.status).toBe('completed')
    expect(completed.completedAt).toBeDefined()

    // Clamp over 100
    const over = updateAssessmentProgress(id, 150)
    expect(over.progress).toBe(100)
  })

  it('addAssessmentFinding appends a finding', () => {
    const all = getAssessments()
    const id = all[0].id
    const beforeCount = all[0].findings.length

    const updated = addAssessmentFinding(id, {
      severity: 'high',
      title: 'Test Finding',
      description: 'A test finding',
      nistControl: 'AC-1',
    })

    expect(updated.findings.length).toBe(beforeCount + 1)
    expect(updated.findings[updated.findings.length - 1].title).toBe('Test Finding')
    expect(updated.findings[updated.findings.length - 1].id).toBeTruthy()
  })
})

describe('Engagements', () => {
  it('returns seeded engagements', () => {
    const engs = getEngagements()
    expect(engs.length).toBeGreaterThan(0)
    expect(engs[0]).toHaveProperty('hoursUsed')
    expect(engs[0]).toHaveProperty('revenue')
  })
})

describe('Team Members', () => {
  it('returns seeded team members', () => {
    const members = getTeamMembers()
    expect(members.length).toBeGreaterThan(0)
    expect(members[0]).toHaveProperty('specializations')
    expect(members[0]).toHaveProperty('utilization')
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
    const orgs = getOrganizations()
    const firstName = orgs[0].name.split(' ')[0]
    const result = searchAll(firstName)
    expect(result.organizations.length).toBeGreaterThan(0)
  })

  it('finds assessments by type', () => {
    const assessments = getAssessments()
    const type = assessments[0].type.split(' ')[0]
    const result = searchAll(type)
    expect(result.assessments.length).toBeGreaterThan(0)
  })
})

describe('resetAllData', () => {
  it('clears and re-seeds data', () => {
    // Create something new
    createOrganization({
      organization: { name: 'Temp Corp', sector: 'Temp', address: '', cityStateZip: '', website: '', employeeCount: '' },
      contact: { name: 'X', title: '', email: 'x@x.com', phone: '', preferredContact: 'email' },
      compliance: [],
      securityTools: '',
      securityChallenges: '',
      services: [],
      timeline: '',
      budget: '',
      notes: '',
    })

    const beforeReset = getOrganizations().length

    resetAllData()

    const afterReset = getOrganizations().length
    expect(afterReset).toBeLessThan(beforeReset)
    expect(afterReset).toBeGreaterThan(0) // re-seeded
  })
})

describe('Contacts', () => {
  it('getContactsByOrganization filters correctly', () => {
    const orgs = getOrganizations()
    const contacts = getContactsByOrganization(orgs[0].id)
    expect(contacts.length).toBeGreaterThanOrEqual(0)
    for (const c of contacts) {
      expect(c.organizationId).toBe(orgs[0].id)
    }
  })

  it('createContact adds a new contact', () => {
    const orgs = getOrganizations()
    const before = getContacts().length
    const contact = createContact({
      organizationId: orgs[0].id,
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
    const contacts = getContacts()
    const updated = updateContact(contacts[0].id, { title: 'Updated Title' })
    expect(updated.title).toBe('Updated Title')
    expect(updated.name).toBe(contacts[0].name)
  })

  it('deleteContact removes the contact', () => {
    const contacts = getContacts()
    const before = contacts.length
    deleteContact(contacts[0].id)
    expect(getContacts().length).toBe(before - 1)
  })
})

describe('Organization CRUD', () => {
  it('updateOrganization merges fields', () => {
    const orgs = getOrganizations()
    const updated = updateOrganization(orgs[0].id, { sector: 'Updated Sector' })
    expect(updated.sector).toBe('Updated Sector')
    expect(updated.name).toBe(orgs[0].name)
  })

  it('deleteOrganization cascade deletes contacts and opportunities', () => {
    const orgs = getOrganizations()
    const orgId = orgs[0].id
    const contactsBefore = getContacts().length
    const orgContacts = getContactsByOrganization(orgId).length

    deleteOrganization(orgId)

    expect(getOrganization(orgId)).toBeUndefined()
    expect(getContacts().length).toBe(contactsBefore - orgContacts)
  })
})

describe('Opportunity CRUD', () => {
  it('updateOpportunity merges fields', () => {
    const opps = getOpportunities()
    const updated = updateOpportunity(opps[0].id, { value: 999999 })
    expect(updated.value).toBe(999999)
    expect(updated.organizationName).toBe(opps[0].organizationName)
  })

  it('deleteOpportunity removes the opportunity', () => {
    const before = getOpportunities().length
    const opps = getOpportunities()
    deleteOpportunity(opps[0].id)
    expect(getOpportunities().length).toBe(before - 1)
  })
})

describe('Assessment CRUD', () => {
  it('deleteAssessment removes the assessment', () => {
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
    const engs = getEngagements()
    const updated = updateEngagement(engs[0].id, { hoursUsed: 99 })
    expect(updated.hoursUsed).toBe(99)
    expect(updated.organizationName).toBe(engs[0].organizationName)
  })

  it('deleteEngagement removes the engagement', () => {
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
    const members = getTeamMembers()
    const updated = updateTeamMember(members[0].id, { utilization: 80 })
    expect(updated.utilization).toBe(80)
    expect(updated.name).toBe(members[0].name)
  })

  it('deleteTeamMember removes the member', () => {
    const before = getTeamMembers().length
    const members = getTeamMembers()
    deleteTeamMember(members[0].id)
    expect(getTeamMembers().length).toBe(before - 1)
  })
})

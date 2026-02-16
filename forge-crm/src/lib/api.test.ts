import { describe, it, expect, beforeEach } from 'vitest'
import {
  getOrganizations,
  getOrganization,
  createOrganization,
  getContacts,
  getContactsByOrganization,
  getOpportunities,
  updateOpportunityStage,
  getAssessments,
  getAssessment,
  createAssessment,
  updateAssessmentRatings,
  updateAssessmentProgress,
  addAssessmentFinding,
  getEngagements,
  getTeamMembers,
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
})

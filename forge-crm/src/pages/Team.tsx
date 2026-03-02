import { useMemo, useState } from 'react'
import { getTeamMembers, createTeamMember } from '../lib/api'
import type { TeamMember } from '../types'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import SearchFilterBar from '../components/SearchFilterBar'
import { useToast } from '../components/Toast'
import { Plus } from 'lucide-react'

function utilizationColor(pct: number) {
  if (pct >= 90) return 'bg-forge-danger'
  if (pct >= 75) return 'bg-forge-warning'
  return 'bg-forge-teal'
}

const teamFilters = [
  { key: 'all', label: 'All' },
  { key: 'available', label: 'Available' },
  { key: 'busy', label: 'Busy' },
  { key: 'out', label: 'Out' },
]

export default function Team() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => getTeamMembers())
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [showAddModal, setShowAddModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newStatus, setNewStatus] = useState<TeamMember['status']>('available')
  const [newSpecializations, setNewSpecializations] = useState('')
  const { toast } = useToast()

  const inputClass = 'w-full py-2.5 px-3.5 border border-forge-border rounded-lg text-sm text-forge-text bg-white focus:outline-none focus:ring-2 focus:ring-forge-teal/20 focus:border-forge-teal transition-colors'

  function resetForm() {
    setNewName('')
    setNewRole('')
    setNewStatus('available')
    setNewSpecializations('')
  }

  function handleAddMember() {
    if (!newName.trim() || !newRole.trim()) {
      toast('error', 'Name and role are required.')
      return
    }

    try {
      const specializations = newSpecializations
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const initials = newName
        .trim()
        .split(/\s+/)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join('')
        .slice(0, 2)

      createTeamMember({
        initials,
        name: newName.trim(),
        role: newRole.trim(),
        status: newStatus,
        specializations,
        utilization: 0,
        activeEngagements: 0,
      })

      setTeamMembers(getTeamMembers())
      resetForm()
      setShowAddModal(false)
      toast('success', `${newName.trim()} has been added to the team.`)
    } catch (err) {
      toast('error', err instanceof Error ? err.message : 'Failed to add team member.')
    }
  }

  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        member.name.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q) ||
        member.specializations.some((s) => s.toLowerCase().includes(q))
      const matchesStatus = statusFilter === 'all' || member.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [teamMembers, search, statusFilter])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-forge-text-muted">{teamMembers.length} team members</p>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-forge-teal text-white text-sm font-medium hover:bg-forge-teal/90 transition-colors"
        >
          <Plus size={15} />
          Add Member
        </button>
      </div>

      <SearchFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search members..."
        filters={teamFilters}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMembers.map((member) => (
          <div key={member.name} className="bg-white rounded-xl border border-forge-border shadow-sm p-5">
            <div className="flex items-start gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-forge-navy flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                {member.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-forge-text">{member.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${member.status === 'available' ? 'bg-forge-success' : 'bg-forge-warning'}`} />
                    <span className="text-xs text-forge-text-faint capitalize">{member.status}</span>
                  </div>
                </div>
                <p className="text-xs text-forge-text-muted mt-0.5">{member.role}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {member.specializations.map((spec) => (
                <Badge key={spec} variant="teal">{spec}</Badge>
              ))}
            </div>

            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-forge-text-muted">Utilization</span>
                  <span className="font-medium text-forge-text">{member.utilization}%</span>
                </div>
                <div className="h-1.5 bg-forge-bg rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${utilizationColor(member.utilization)}`} style={{ width: `${member.utilization}%` }} />
                </div>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-forge-border">
                <span className="text-forge-text-muted">Active Engagements</span>
                <span className="font-semibold text-forge-text">{member.activeEngagements}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => { resetForm(); setShowAddModal(false) }}
        title="Add Team Member"
        footer={
          <>
            <button
              onClick={() => { resetForm(); setShowAddModal(false) }}
              className="px-4 py-2 text-sm font-medium text-forge-text-muted hover:text-forge-text transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddMember}
              className="px-4 py-2 rounded-lg bg-forge-teal text-white text-sm font-medium hover:bg-forge-teal/90 transition-colors"
            >
              Add Member
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-forge-text mb-1.5">Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Full name"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-forge-text mb-1.5">Role</label>
            <input
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="e.g. Security Analyst"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-forge-text mb-1.5">Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as TeamMember['status'])}
              className={inputClass}
            >
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="out">Out</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-forge-text mb-1.5">Specializations</label>
            <input
              type="text"
              value={newSpecializations}
              onChange={(e) => setNewSpecializations(e.target.value)}
              placeholder="Comma-separated, e.g. NIST, Incident Response"
              className={inputClass}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

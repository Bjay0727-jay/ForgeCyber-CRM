import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, UserPlus, ClipboardCheck, GitBranch,
  FileText, Briefcase, BarChart3, UsersRound, Settings, Shield,
  Search, Bell, ChevronDown, LogOut, HelpCircle, Moon,
  Zap, ChevronRight, ExternalLink,
} from 'lucide-react'
import type { ReactNode } from 'react'

interface NavItem { label: string; icon: ReactNode; to: string; badge?: number; badgeColor?: string }
interface NavGroup { heading: string; items: NavItem[] }

const navGroups: NavGroup[] = [
  { heading: 'Main', items: [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, to: '/dashboard' },
  ]},
  { heading: 'Customer Management', items: [
    { label: 'CRM / Pipeline', icon: <Users size={18} />, to: '/crm', badge: 12, badgeColor: 'teal' },
    { label: 'New Customer Intake', icon: <UserPlus size={18} />, to: '/intake' },
  ]},
  { heading: 'Consulting', items: [
    { label: 'Assessments', icon: <ClipboardCheck size={18} />, to: '/assessments', badge: 4, badgeColor: 'blue' },
    { label: 'Workflow', icon: <GitBranch size={18} />, to: '/workflow' },
    { label: 'Templates', icon: <FileText size={18} />, to: '/templates' },
  ]},
  { heading: 'Operations', items: [
    { label: 'Engagements', icon: <Briefcase size={18} />, to: '/operations', badge: 8, badgeColor: 'amber' },
    { label: 'Reports', icon: <BarChart3 size={18} />, to: '/reports' },
  ]},
  { heading: 'Admin', items: [
    { label: 'Team', icon: <UsersRound size={18} />, to: '/team' },
    { label: 'Settings', icon: <Settings size={18} />, to: '/settings' },
  ]},
]

const badgeStyles: Record<string, string> = {
  teal: 'bg-forge-teal/20 text-forge-teal',
  blue: 'bg-blue-500/20 text-blue-400',
  amber: 'bg-amber-500/20 text-amber-400',
  red: 'bg-red-500/20 text-red-400',
}

export default function Sidebar() {
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifications] = useState(3)

  // Quick search through nav items
  const searchResults = searchQuery.trim()
    ? navGroups.flatMap(g => g.items).filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  function handleSearchNav(to: string) {
    navigate(to)
    setSearchQuery('')
    setSearchOpen(false)
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-50 w-[260px] flex flex-col bg-gradient-to-b from-[#0C1220] via-forge-sidebar to-[#0C1220] overflow-hidden">
      {/* Brand */}
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forge-teal to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-forge-teal/20">
            <Shield size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white tracking-tight">Forge Cyber</p>
            <p className="text-[11px] text-forge-teal font-medium">Service Delivery</p>
          </div>
        </div>
      </div>

      {/* Quick Search */}
      <div className="px-3 pt-3 pb-1">
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/30 text-xs hover:bg-white/[0.07] hover:text-white/40 hover:border-white/[0.1] transition-all"
        >
          <Search size={14} />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px] text-white/20 font-mono">⌘K</kbd>
        </button>
        {searchOpen && (
          <div className="mt-2 animate-slideDown">
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pages..."
              className="w-full px-3 py-2 rounded-lg bg-white/[0.06] border border-white/[0.1] text-sm text-white placeholder:text-white/25 outline-none focus:border-forge-teal/40 focus:bg-white/[0.08] transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery('') }
                if (e.key === 'Enter' && searchResults.length > 0) handleSearchNav(searchResults[0].to)
              }}
            />
            {searchResults.length > 0 && (
              <div className="mt-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] py-1">
                {searchResults.map((item) => (
                  <button
                    key={item.to}
                    onClick={() => handleSearchNav(item.to)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    <ChevronRight size={12} className="ml-auto text-white/20" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-1.5 px-3 py-2">
        <button
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-forge-teal/10 text-forge-teal text-[11px] font-medium hover:bg-forge-teal/15 transition-colors"
          onClick={() => navigate('/intake')}
        >
          <Zap size={12} />
          New Client
        </button>
        <button
          className="relative w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/40 hover:bg-white/[0.08] hover:text-white/60 transition-colors"
          title="Notifications"
        >
          <Bell size={14} />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center shadow-lg shadow-red-500/30">
              {notifications}
            </span>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-5 overflow-y-auto scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.heading}>
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/20 flex items-center gap-2">
              <span className="w-3 h-px bg-white/10" />
              {group.heading}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 relative overflow-hidden ${
                        isActive
                          ? 'bg-gradient-to-r from-forge-teal/15 to-forge-teal/5 text-white shadow-sm'
                          : 'text-white/45 hover:bg-white/[0.04] hover:text-white/70'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-gradient-to-b from-forge-teal to-emerald-400 shadow-sm shadow-forge-teal/40" />
                        )}
                        <span className={`flex-shrink-0 transition-all duration-200 ${
                          isActive ? 'text-forge-teal' : 'group-hover:text-white/60'
                        }`}>
                          {item.icon}
                        </span>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge !== undefined && (
                          <span className={`min-w-[22px] h-[22px] flex items-center justify-center rounded-md text-[10px] font-bold ${
                            badgeStyles[item.badgeColor || 'teal']
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Environment indicator */}
      <div className="mx-3 mb-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/8 border border-emerald-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse" />
          <span className="text-[10px] font-medium text-emerald-400/70">Production Environment</span>
        </div>
      </div>

      {/* User Footer */}
      <div className="border-t border-white/[0.06] relative">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.03] transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-forge-teal/30 to-emerald-500/20 flex items-center justify-center text-forge-teal text-xs font-bold border border-forge-teal/20 flex-shrink-0">
            BJ
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-semibold text-white/80 truncate">Brandon Jay</p>
            <p className="text-[10px] text-white/30 truncate">Admin &middot; CISO</p>
          </div>
          <ChevronDown size={14} className={`text-white/25 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Profile dropdown */}
        {profileOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-1 bg-[#1A2332] rounded-xl border border-white/[0.08] shadow-2xl shadow-black/40 py-1.5 animate-slideDown">
            <button className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-colors">
              <Settings size={14} />
              Account Settings
              <ExternalLink size={10} className="ml-auto text-white/20" />
            </button>
            <button className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-colors">
              <Moon size={14} />
              Dark Mode
              <span className="ml-auto w-7 h-4 rounded-full bg-forge-teal/30 flex items-center justify-end px-0.5">
                <span className="w-3 h-3 rounded-full bg-forge-teal shadow-sm" />
              </span>
            </button>
            <button className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-colors">
              <HelpCircle size={14} />
              Help & Support
            </button>
            <div className="my-1.5 border-t border-white/[0.06]" />
            <button className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-colors">
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

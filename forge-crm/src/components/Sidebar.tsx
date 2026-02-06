import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, UserPlus, ClipboardCheck, GitBranch,
  FileText, Briefcase, BarChart3, UsersRound, Settings, Shield,
} from 'lucide-react'
import type { ReactNode } from 'react'

interface NavItem { label: string; icon: ReactNode; to: string; badge?: string }
interface NavGroup { heading: string; items: NavItem[] }

const navGroups: NavGroup[] = [
  { heading: 'Main', items: [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, to: '/dashboard' },
  ]},
  { heading: 'Customer Management', items: [
    { label: 'CRM / Pipeline', icon: <Users size={20} />, to: '/crm', badge: '12' },
    { label: 'New Customer Intake', icon: <UserPlus size={20} />, to: '/intake' },
  ]},
  { heading: 'Consulting Services', items: [
    { label: 'Assessments', icon: <ClipboardCheck size={20} />, to: '/assessments', badge: '4' },
    { label: 'Consulting Workflow', icon: <GitBranch size={20} />, to: '/workflow' },
    { label: 'Document Templates', icon: <FileText size={20} />, to: '/templates' },
  ]},
  { heading: 'Operations', items: [
    { label: 'Active Engagements', icon: <Briefcase size={20} />, to: '/operations', badge: '8' },
    { label: 'Reports & Analytics', icon: <BarChart3 size={20} />, to: '/reports' },
  ]},
  { heading: 'Admin', items: [
    { label: 'Team Management', icon: <UsersRound size={20} />, to: '/team' },
    { label: 'Settings', icon: <Settings size={20} />, to: '/settings' },
  ]},
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 z-50 w-[280px] flex flex-col bg-forge-navy-deep overflow-y-auto">
      {/* Logo */}
      <div className="flex flex-col items-center py-6 px-4">
        <div className="w-[90px] h-[90px] rounded-2xl bg-gradient-to-br from-forge-teal to-forge-cyan flex items-center justify-center mb-3">
          <Shield size={44} className="text-white" />
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-forge-teal text-center">
          Service Delivery Portal
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-5">
        {navGroups.map((group) => (
          <div key={group.heading}>
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">
              {group.heading}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-forge-teal text-white'
                          : 'text-white/60 hover:bg-white/5 hover:text-white/80'
                      }`
                    }
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="min-w-[22px] h-[22px] flex items-center justify-center rounded-full bg-forge-danger text-white text-[10px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}

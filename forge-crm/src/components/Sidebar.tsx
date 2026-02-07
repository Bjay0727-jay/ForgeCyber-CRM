import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, UserPlus, ClipboardCheck, GitBranch,
  FileText, Briefcase, BarChart3, UsersRound, Settings, Shield,
} from 'lucide-react'
import type { ReactNode } from 'react'

interface NavItem { label: string; icon: ReactNode; to: string; badge?: number }
interface NavGroup { heading: string; items: NavItem[] }

const navGroups: NavGroup[] = [
  { heading: 'Main', items: [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, to: '/dashboard' },
  ]},
  { heading: 'Customer Management', items: [
    { label: 'CRM / Pipeline', icon: <Users size={18} />, to: '/crm', badge: 12 },
    { label: 'New Customer Intake', icon: <UserPlus size={18} />, to: '/intake' },
  ]},
  { heading: 'Consulting', items: [
    { label: 'Assessments', icon: <ClipboardCheck size={18} />, to: '/assessments', badge: 4 },
    { label: 'Workflow', icon: <GitBranch size={18} />, to: '/workflow' },
    { label: 'Templates', icon: <FileText size={18} />, to: '/templates' },
  ]},
  { heading: 'Operations', items: [
    { label: 'Engagements', icon: <Briefcase size={18} />, to: '/operations', badge: 8 },
    { label: 'Reports', icon: <BarChart3 size={18} />, to: '/reports' },
  ]},
  { heading: 'Admin', items: [
    { label: 'Team', icon: <UsersRound size={18} />, to: '/team' },
    { label: 'Settings', icon: <Settings size={18} />, to: '/settings' },
  ]},
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 z-50 w-[260px] flex flex-col bg-forge-sidebar overflow-y-auto">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">
        <div className="w-9 h-9 rounded-lg bg-forge-teal flex items-center justify-center flex-shrink-0">
          <Shield size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white tracking-tight">Forge Cyber</p>
          <p className="text-[11px] text-forge-teal font-medium">Service Delivery</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.heading}>
            <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/25">
              {group.heading}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors relative ${
                        isActive
                          ? 'bg-forge-sidebar-active text-white'
                          : 'text-white/50 hover:bg-forge-sidebar-hover hover:text-white/70'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-forge-teal" />
                        )}
                        <span className="flex-shrink-0">{item.icon}</span>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge !== undefined && (
                          <span className="min-w-[20px] h-5 flex items-center justify-center rounded-md bg-white/10 text-[10px] font-semibold text-white/60">
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

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-forge-teal/20 flex items-center justify-center text-forge-teal text-xs font-semibold">
            BJ
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white/70 truncate">Admin User</p>
            <p className="text-[10px] text-white/30 truncate">admin@forgecyber.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

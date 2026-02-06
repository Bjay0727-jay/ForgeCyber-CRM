import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, UserPlus, ClipboardCheck, GitBranch,
  FileText, Briefcase, BarChart3, UsersRound, Settings, Shield,
  ChevronLeft, ChevronRight,
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

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside className={`fixed left-0 top-0 bottom-0 z-50 flex flex-col transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-[272px]'}`}
      style={{ background: 'linear-gradient(180deg, #061525 0%, #0F2A4A 50%, #132f52 100%)' }}>

      {/* Logo */}
      <div className="relative px-4 py-5 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forge-teal to-forge-cyan flex items-center justify-center shadow-lg shadow-forge-teal/30 flex-shrink-0">
            <Shield size={20} className="text-white" />
          </div>
          {!collapsed && (
            <div className="animate-fadeIn overflow-hidden">
              <h1 className="font-heading text-[13px] font-bold text-white tracking-wider leading-tight whitespace-nowrap">FORGE CYBER DEFENSE</h1>
              <p className="text-[10px] text-white/40 mt-0.5 font-medium">Service Delivery Portal</p>
            </div>
          )}
        </div>
        <button onClick={onToggle} className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-forge-navy border-2 border-forge-border flex items-center justify-center text-white/60 hover:text-white hover:bg-forge-teal transition-all shadow-md z-10">
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {navGroups.map((group) => (
          <div key={group.heading}>
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">{group.heading}</p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-xl cursor-pointer transition-all duration-200 relative ${collapsed ? 'px-0 py-2.5 justify-center' : 'px-3 py-2.5'} ${
                        isActive
                          ? 'bg-gradient-to-r from-forge-teal/20 to-forge-teal/5 text-white shadow-[inset_0_0_0_1px_rgba(13,148,136,0.3)]'
                          : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                      }`
                    }>
                    {({ isActive }) => (
                      <>
                        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-forge-teal" />}
                        <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-forge-teal' : ''}`}>{item.icon}</span>
                        {!collapsed && <span className="text-[13px] font-medium flex-1 whitespace-nowrap">{item.label}</span>}
                        {!collapsed && item.badge && (
                          <span className={`min-w-[20px] h-5 flex items-center justify-center rounded-md text-[10px] font-bold ${isActive ? 'bg-forge-teal/30 text-forge-teal-light' : 'bg-white/10 text-white/50'}`}>
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

      {/* User Profile */}
      <div className="px-3 py-3 border-t border-white/8">
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors ${collapsed ? 'justify-center px-0' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forge-teal to-forge-cyan flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
            SC
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 animate-fadeIn">
              <p className="text-[13px] font-semibold text-white truncate">Stan Chen</p>
              <p className="text-[10px] text-white/40 truncate">Senior Consultant</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

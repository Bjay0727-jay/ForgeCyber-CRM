import { useState, useEffect, useCallback } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, UserPlus, ClipboardCheck, GitBranch,
  FileText, Briefcase, BarChart3, UsersRound, Settings, Shield,
  Search, Bell, ChevronDown, LogOut, HelpCircle, Moon,
  Zap, ChevronRight, ExternalLink, PanelLeftClose, PanelLeftOpen,
  Star, StarOff,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { notifications as defaultNotifications, roleAccess, roleLabels } from '../data/mockData'
import type { UserRole, Notification } from '../data/mockData'
import CommandPalette from './CommandPalette'
import NotificationPanel from './NotificationPanel'

interface NavItem { label: string; icon: ReactNode; to: string; badge?: number; badgeColor?: string }
interface NavGroup { heading: string; items: NavItem[] }

const allNavGroups: NavGroup[] = [
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

// Load favorites from localStorage
function loadFavorites(): string[] {
  try {
    const stored = localStorage.getItem('forge-favorites')
    return stored ? JSON.parse(stored) : []
  } catch { return [] }
}

function saveFavorites(favs: string[]) {
  localStorage.setItem('forge-favorites', JSON.stringify(favs))
}

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [notifPanelOpen, setNotifPanelOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications)
  const [role, setRole] = useState<UserRole>('admin')
  const [favorites, setFavorites] = useState<string[]>(loadFavorites)

  const unreadCount = notifications.filter(n => !n.read).length

  // Filter nav groups based on role
  const navGroups = allNavGroups
    .map(group => ({
      ...group,
      items: group.items.filter(item => roleAccess[role].includes(item.to)),
    }))
    .filter(group => group.items.length > 0)

  // Favorite items
  const favoriteItems = allNavGroups
    .flatMap(g => g.items)
    .filter(item => favorites.includes(item.to) && roleAccess[role].includes(item.to))

  function toggleFavorite(to: string) {
    setFavorites(prev => {
      const next = prev.includes(to) ? prev.filter(f => f !== to) : [...prev, to]
      saveFavorites(next)
      return next
    })
  }

  // Global Ctrl+K / Cmd+K
  const handleGlobalKey = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setCommandPaletteOpen(prev => !prev)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleGlobalKey)
    return () => window.removeEventListener('keydown', handleGlobalKey)
  }, [handleGlobalKey])

  function handleMarkRead(id: string) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  function handleMarkAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const sidebarWidth = collapsed ? 'w-[68px]' : 'w-[260px]'

  return (
    <>
      <aside className={`fixed left-0 top-0 bottom-0 z-50 ${sidebarWidth} flex flex-col bg-gradient-to-b from-[#0C1220] via-forge-sidebar to-[#0C1220] overflow-hidden transition-all duration-300`}>
        {/* Brand */}
        <div className={`flex items-center gap-3 ${collapsed ? 'px-3 justify-center' : 'px-5'} py-4 border-b border-white/[0.06]`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forge-teal to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-forge-teal/20">
            <Shield size={20} className="text-white" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white tracking-tight">Forge Cyber</p>
              <p className="text-[11px] text-forge-teal font-medium">Service Delivery</p>
            </div>
          )}
        </div>

        {/* Search trigger + Quick actions */}
        {!collapsed ? (
          <>
            <div className="px-3 pt-3 pb-1">
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/30 text-xs hover:bg-white/[0.07] hover:text-white/40 hover:border-white/[0.1] transition-all"
              >
                <Search size={14} />
                <span className="flex-1 text-left">Search...</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px] text-white/20 font-mono">⌘K</kbd>
              </button>
            </div>

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
                onClick={() => setNotifPanelOpen(true)}
              >
                <Bell size={14} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center shadow-lg shadow-red-500/30">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1.5 px-2 py-2">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="w-10 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/40 hover:bg-white/[0.08] hover:text-white/60 transition-colors"
              title="Search (⌘K)"
            >
              <Search size={14} />
            </button>
            <button
              className="relative w-10 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/40 hover:bg-white/[0.08] hover:text-white/60 transition-colors"
              title="Notifications"
              onClick={() => setNotifPanelOpen(true)}
            >
              <Bell size={14} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center shadow-lg shadow-red-500/30">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className={`flex-1 ${collapsed ? 'px-2' : 'px-3'} py-2 space-y-4 overflow-y-auto`}>
          {/* Favorites section */}
          {favoriteItems.length > 0 && (
            <div>
              {!collapsed && (
                <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-amber-400/40 flex items-center gap-2">
                  <Star size={8} className="fill-amber-400/40" />
                  Favorites
                </p>
              )}
              <ul className="space-y-0.5">
                {favoriteItems.map((item) => (
                  <li key={`fav-${item.to}`}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `group flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 relative overflow-hidden ${
                          isActive
                            ? 'bg-gradient-to-r from-amber-500/15 to-amber-500/5 text-white'
                            : 'text-white/45 hover:bg-white/[0.04] hover:text-white/70'
                        }`
                      }
                      title={collapsed ? item.label : undefined}
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-gradient-to-b from-amber-400 to-amber-500" />
                          )}
                          <span className={`flex-shrink-0 ${isActive ? 'text-amber-400' : ''}`}>{item.icon}</span>
                          {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
              {!collapsed && <div className="my-2 mx-3 border-t border-white/[0.04]" />}
            </div>
          )}

          {/* Regular nav groups */}
          {navGroups.map((group) => (
            <div key={group.heading}>
              {!collapsed && (
                <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/20 flex items-center gap-2">
                  <span className="w-3 h-px bg-white/10" />
                  {group.heading}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.to} className="group/item relative">
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `group flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 relative overflow-hidden ${
                          isActive
                            ? 'bg-gradient-to-r from-forge-teal/15 to-forge-teal/5 text-white shadow-sm'
                            : 'text-white/45 hover:bg-white/[0.04] hover:text-white/70'
                        }`
                      }
                      title={collapsed ? item.label : undefined}
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
                          {!collapsed && (
                            <>
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
                        </>
                      )}
                    </NavLink>

                    {/* Favorite toggle — shown on hover (expanded mode only) */}
                    {!collapsed && (
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(item.to) }}
                        className={`absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded transition-all ${
                          favorites.includes(item.to)
                            ? 'text-amber-400 opacity-100'
                            : 'text-white/15 opacity-0 group-hover/item:opacity-100 hover:text-amber-400'
                        }`}
                        title={favorites.includes(item.to) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        {favorites.includes(item.to) ? <Star size={12} className="fill-amber-400" /> : <StarOff size={12} />}
                      </button>
                    )}

                    {/* Collapsed tooltip */}
                    {collapsed && (
                      <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 rounded-lg bg-[#1A2332] border border-white/[0.08] text-xs text-white whitespace-nowrap opacity-0 group-hover/item:opacity-100 transition-opacity shadow-xl z-50">
                        {item.label}
                        {item.badge !== undefined && (
                          <span className={`ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold ${badgeStyles[item.badgeColor || 'teal']}`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className={`px-3 py-1.5 ${collapsed ? 'flex justify-center' : ''}`}>
          <button
            onClick={onToggle}
            className={`flex items-center ${collapsed ? 'justify-center w-10' : 'gap-2 w-full px-3'} py-2 rounded-lg text-white/25 hover:text-white/50 hover:bg-white/[0.04] transition-colors text-xs`}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <><PanelLeftClose size={14} /><span>Collapse</span></>}
          </button>
        </div>

        {/* Environment indicator */}
        <div className={`${collapsed ? 'px-2' : 'mx-3'} mb-2`}>
          <div className={`flex items-center gap-2 ${collapsed ? 'justify-center' : 'px-3'} py-2 rounded-lg bg-emerald-500/8 border border-emerald-500/10`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse flex-shrink-0" />
            {!collapsed && <span className="text-[10px] font-medium text-emerald-400/70">Production</span>}
          </div>
        </div>

        {/* User Footer */}
        <div className="border-t border-white/[0.06] relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className={`w-full flex items-center gap-3 ${collapsed ? 'justify-center px-2' : 'px-4'} py-3.5 hover:bg-white/[0.03] transition-colors`}
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-forge-teal/30 to-emerald-500/20 flex items-center justify-center text-forge-teal text-xs font-bold border border-forge-teal/20 flex-shrink-0">
              BJ
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs font-semibold text-white/80 truncate">Brandon Jay</p>
                  <p className="text-[10px] text-white/30 truncate">{roleLabels[role]}</p>
                </div>
                <ChevronDown size={14} className={`text-white/25 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>

          {/* Profile dropdown */}
          {profileOpen && (
            <div
              className={`absolute bottom-full ${collapsed ? 'left-1 w-56' : 'left-3 right-3'} mb-1 bg-[#1A2332] rounded-xl border border-white/[0.08] shadow-2xl shadow-black/40 py-1.5 animate-slideDown`}
            >
              {/* Role switcher */}
              <div className="px-3.5 py-2">
                <p className="text-[10px] text-white/25 uppercase tracking-wider font-semibold mb-1.5">Switch Role</p>
                <div className="grid grid-cols-2 gap-1">
                  {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => { setRole(r); setProfileOpen(false) }}
                      className={`px-2 py-1.5 text-[11px] rounded-md font-medium transition-colors ${
                        role === r
                          ? 'bg-forge-teal/15 text-forge-teal'
                          : 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]'
                      }`}
                    >
                      {roleLabels[r]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="my-1.5 border-t border-white/[0.06]" />

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

      {/* Command Palette (Ctrl+K) */}
      <CommandPalette open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />

      {/* Notification Panel */}
      <NotificationPanel
        open={notifPanelOpen}
        onClose={() => setNotifPanelOpen(false)}
        notifications={notifications}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
      />
    </>
  )
}

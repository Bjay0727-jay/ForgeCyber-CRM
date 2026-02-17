import { useState, useRef, useEffect } from 'react'
import { Search, Bell, Plus, Moon, Sun, Building2, ClipboardCheck, Briefcase } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { searchAll } from '../lib/api'
import { useTheme } from '../context/ThemeContext'

interface TopBarProps {
  title: string
  breadcrumb: string
}

export default function TopBar({ title, breadcrumb }: TopBarProps) {
  const navigate = useNavigate()
  const { theme, toggle: toggleTheme } = useTheme()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const results = query.trim().length >= 2 ? searchAll(query) : null
  const hasResults = results && (results.organizations.length + results.assessments.length + results.engagements.length) > 0

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (path: string) => {
    setQuery('')
    setOpen(false)
    navigate(path)
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-forge-card/80 backdrop-blur-sm border-b border-forge-border">
      <div className="flex items-center justify-between px-8 h-16">
        {/* Left: Title & Breadcrumb */}
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs text-forge-text-muted mb-0.5">{breadcrumb}</p>
            <h1 className="text-base font-semibold text-forge-text leading-tight">{title}</h1>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative" ref={wrapperRef}>
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-forge-text-faint" />
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
              onFocus={() => setOpen(true)}
              className="w-56 pl-9 pr-3 py-2 rounded-lg bg-forge-bg border border-forge-border text-sm text-forge-text placeholder:text-forge-text-faint focus:outline-none focus:ring-2 focus:ring-forge-teal/20 focus:border-forge-teal transition-colors"
            />

            {/* Search results dropdown */}
            {open && query.trim().length >= 2 && (
              <div className="absolute top-full mt-1 left-0 w-80 bg-forge-card border border-forge-border rounded-xl shadow-xl overflow-hidden z-50">
                {hasResults ? (
                  <div className="max-h-72 overflow-y-auto">
                    {results.organizations.length > 0 && (
                      <div>
                        <p className="px-3 py-1.5 text-[10px] font-semibold text-forge-text-faint uppercase tracking-wider bg-forge-bg">Organizations</p>
                        {results.organizations.slice(0, 4).map((org) => (
                          <button
                            key={org.id}
                            onClick={() => handleSelect('/crm')}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-forge-text hover:bg-forge-bg transition-colors text-left"
                          >
                            <Building2 size={14} className="text-forge-teal flex-shrink-0" />
                            <span className="truncate">{org.name}</span>
                            <span className="ml-auto text-[10px] text-forge-text-faint">{org.sector}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {results.assessments.length > 0 && (
                      <div>
                        <p className="px-3 py-1.5 text-[10px] font-semibold text-forge-text-faint uppercase tracking-wider bg-forge-bg">Assessments</p>
                        {results.assessments.slice(0, 4).map((a) => (
                          <button
                            key={a.id}
                            onClick={() => handleSelect('/assessments')}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-forge-text hover:bg-forge-bg transition-colors text-left"
                          >
                            <ClipboardCheck size={14} className="text-forge-info flex-shrink-0" />
                            <span className="truncate">{a.organizationName}</span>
                            <span className="ml-auto text-[10px] text-forge-text-faint">{a.type}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {results.engagements.length > 0 && (
                      <div>
                        <p className="px-3 py-1.5 text-[10px] font-semibold text-forge-text-faint uppercase tracking-wider bg-forge-bg">Engagements</p>
                        {results.engagements.slice(0, 4).map((e) => (
                          <button
                            key={e.id}
                            onClick={() => handleSelect('/operations')}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-forge-text hover:bg-forge-bg transition-colors text-left"
                          >
                            <Briefcase size={14} className="text-forge-warning flex-shrink-0" />
                            <span className="truncate">{e.organizationName}</span>
                            <span className="ml-auto text-[10px] text-forge-text-faint">{e.type}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="px-4 py-6 text-center text-sm text-forge-text-muted">
                    No results for &ldquo;{query}&rdquo;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-forge-text-muted hover:bg-forge-bg transition-colors"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-forge-text-muted hover:bg-forge-bg transition-colors">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-forge-danger ring-2 ring-white" />
          </button>

          {/* New Customer */}
          <button
            onClick={() => navigate('/intake')}
            className="inline-flex items-center gap-1.5 ml-2 px-3.5 py-2 rounded-lg bg-forge-teal text-white text-sm font-medium hover:bg-forge-teal/90 transition-colors"
          >
            <Plus size={15} />
            <span>New Customer</span>
          </button>
        </div>
      </div>
    </header>
  )
}

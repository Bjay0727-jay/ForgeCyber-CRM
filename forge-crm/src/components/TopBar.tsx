import { Search, Bell, Plus, Moon, Sun } from 'lucide-react'
import { useTheme } from '../lib/ThemeContext'
import { useNavigate } from 'react-router-dom'

interface TopBarProps {
  title: string
  breadcrumb: string
}

export default function TopBar({ title, breadcrumb }: TopBarProps) {
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 glass border-b border-forge-border/50">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Left: Title and Breadcrumb */}
        <div>
          <h1 className="font-heading text-2xl font-bold text-forge-text">
            {title}
          </h1>
          <p className="text-[13px] text-forge-text-muted mt-0.5">
            {breadcrumb}
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-forge-text-muted"
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-[280px] pl-10 pr-4 py-2.5 rounded-xl bg-forge-bg-subtle border border-forge-border text-sm text-forge-text placeholder:text-forge-text-muted focus:outline-none focus:ring-2 focus:ring-forge-teal/30 focus:border-forge-teal transition-all"
            />
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggle}
            className="p-2.5 rounded-xl hover:bg-forge-bg-subtle border border-transparent hover:border-forge-border transition-all"
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? (
              <Sun size={20} className="text-forge-warning" />
            ) : (
              <Moon size={20} className="text-forge-text-muted" />
            )}
          </button>

          {/* Notification Bell */}
          <button className="relative p-2.5 rounded-xl hover:bg-forge-bg-subtle border border-transparent hover:border-forge-border transition-all">
            <Bell size={20} className="text-forge-text-muted" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-forge-danger animate-pulse" />
          </button>

          {/* New Customer Button */}
          <button
            onClick={() => navigate('/intake')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-forge-teal to-forge-teal-light text-white text-sm font-semibold shadow-lg shadow-forge-teal/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-forge-teal/30 transition-all duration-200"
          >
            <Plus size={18} />
            New Customer
          </button>
        </div>
      </div>
    </header>
  )
}

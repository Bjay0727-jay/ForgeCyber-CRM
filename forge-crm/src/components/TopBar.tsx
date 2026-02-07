import { Search, Bell, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface TopBarProps {
  title: string
  breadcrumb: string
}

export default function TopBar({ title, breadcrumb }: TopBarProps) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-forge-border">
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
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-forge-text-faint" />
            <input
              type="text"
              placeholder="Search..."
              className="w-56 pl-9 pr-3 py-2 rounded-lg bg-forge-bg border border-forge-border text-sm placeholder:text-forge-text-faint focus:outline-none focus:ring-2 focus:ring-forge-teal/20 focus:border-forge-teal transition-colors"
            />
          </div>

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

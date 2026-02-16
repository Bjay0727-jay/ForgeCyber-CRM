import { Search } from 'lucide-react'

interface SearchFilterBarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  placeholder?: string
  filters: { key: string; label: string }[]
  activeFilter: string
  onFilterChange: (key: string) => void
}

export default function SearchFilterBar({
  searchValue,
  onSearchChange,
  placeholder = 'Search...',
  filters,
  activeFilter,
  onFilterChange,
}: SearchFilterBarProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="relative w-full max-w-xs">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-forge-text-faint pointer-events-none"
        />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-forge-border bg-white text-sm text-forge-text placeholder:text-forge-text-faint focus:outline-none focus:border-forge-teal/50 focus:ring-1 focus:ring-forge-teal/20 transition-colors"
        />
      </div>

      <div className="flex items-center gap-2">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeFilter === filter.key
                ? 'bg-forge-teal text-white'
                : 'bg-white border border-forge-border text-forge-text-muted hover:border-forge-teal/30'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  )
}

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  total: number
  page: number
  perPage: number
  onPageChange: (page: number) => void
}

export default function Pagination({ total, page, perPage, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(total / perPage)
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-forge-border bg-forge-bg/30">
      <span className="text-xs text-forge-text-faint">
        Showing {page * perPage + 1}&ndash;{Math.min((page + 1) * perPage, total)} of {total}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(Math.max(page - 1, 0))}
          disabled={page === 0}
          className="p-1.5 rounded-md border border-forge-border text-forge-text-muted hover:bg-white transition-colors disabled:opacity-30"
        >
          <ChevronLeft size={14} />
        </button>
        <button
          onClick={() => onPageChange(Math.min(page + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
          className="p-1.5 rounded-md border border-forge-border text-forge-text-muted hover:bg-white transition-colors disabled:opacity-30"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

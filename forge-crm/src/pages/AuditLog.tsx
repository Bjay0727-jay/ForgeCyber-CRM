import { useState } from 'react'
import {
  Search, Filter, LogIn, FilePlus, FileEdit, Trash2,
  Eye, Download, Settings, Shield, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { auditLog } from '../data/mockData'
import type { AuditEntry } from '../data/mockData'

const actionConfig: Record<string, { icon: React.ReactNode; color: string; bgColor: string; label: string }> = {
  create: { icon: <FilePlus size={14} />, color: 'text-emerald-600', bgColor: 'bg-emerald-500/8', label: 'Create' },
  update: { icon: <FileEdit size={14} />, color: 'text-blue-600', bgColor: 'bg-blue-500/8', label: 'Update' },
  delete: { icon: <Trash2 size={14} />, color: 'text-red-600', bgColor: 'bg-red-500/8', label: 'Delete' },
  access: { icon: <Eye size={14} />, color: 'text-amber-600', bgColor: 'bg-amber-500/8', label: 'Access' },
  login: { icon: <LogIn size={14} />, color: 'text-forge-text-muted', bgColor: 'bg-forge-bg', label: 'Login' },
  export: { icon: <Download size={14} />, color: 'text-purple-600', bgColor: 'bg-purple-500/8', label: 'Export' },
  config: { icon: <Settings size={14} />, color: 'text-forge-teal', bgColor: 'bg-forge-teal/8', label: 'Config' },
}

type FilterType = 'all' | AuditEntry['action']

const filterOptions: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All Actions' },
  { key: 'create', label: 'Create' },
  { key: 'update', label: 'Update' },
  { key: 'delete', label: 'Delete' },
  { key: 'access', label: 'Access' },
  { key: 'login', label: 'Login' },
  { key: 'export', label: 'Export' },
  { key: 'config', label: 'Config' },
]

export default function AuditLog() {
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState<FilterType>('all')
  const [page, setPage] = useState(0)
  const perPage = 8

  const filtered = auditLog.filter(entry => {
    const matchesSearch = !search ||
      entry.user.toLowerCase().includes(search.toLowerCase()) ||
      entry.detail.toLowerCase().includes(search.toLowerCase()) ||
      entry.target.toLowerCase().includes(search.toLowerCase())
    const matchesAction = actionFilter === 'all' || entry.action === actionFilter
    return matchesSearch && matchesAction
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice(page * perPage, (page + 1) * perPage)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forge-navy/10 to-forge-navy/5 flex items-center justify-center border border-forge-navy/10">
          <Shield size={20} className="text-forge-navy" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-forge-text">Audit Log</h2>
          <p className="text-xs text-forge-text-muted">Track all user actions for SOC 2, CMMC, and compliance requirements</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-forge-text-faint" />
          <input
            type="text"
            placeholder="Search user, action, or detail..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
            className="w-full pl-9 pr-3 py-2.5 border border-forge-border rounded-lg text-sm focus:ring-2 focus:ring-forge-teal/20 focus:border-forge-teal outline-none transition-colors bg-white"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter size={13} className="text-forge-text-faint" />
          {filterOptions.map(opt => (
            <button
              key={opt.key}
              onClick={() => { setActionFilter(opt.key); setPage(0) }}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                actionFilter === opt.key
                  ? 'bg-forge-teal/8 text-forge-teal border-forge-teal/20'
                  : 'text-forge-text-muted border-forge-border hover:border-forge-text-faint'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-forge-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-forge-border bg-forge-bg/50">
              <th scope="col" className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-3 px-5">Action</th>
              <th scope="col" className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-3 px-5">User</th>
              <th scope="col" className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-3 px-5">Target</th>
              <th scope="col" className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-3 px-5">Detail</th>
              <th scope="col" className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-3 px-5">Timestamp</th>
              <th scope="col" className="text-left text-[11px] font-medium text-forge-text-muted uppercase tracking-wide py-3 px-5">IP</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(entry => {
              const config = actionConfig[entry.action]
              return (
                <tr key={entry.id} className="border-b border-forge-border/60 last:border-0 hover:bg-forge-bg/30 transition-colors">
                  <td className="py-3 px-5">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-semibold ${config.bgColor} ${config.color}`}>
                      {config.icon}
                      {config.label}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-sm font-medium text-forge-text">{entry.user}</td>
                  <td className="py-3 px-5">
                    <span className="px-2 py-0.5 rounded-md bg-forge-bg text-xs text-forge-text-muted font-medium">{entry.target}</span>
                  </td>
                  <td className="py-3 px-5 text-xs text-forge-text-muted max-w-[300px] truncate">{entry.detail}</td>
                  <td className="py-3 px-5 text-xs text-forge-text-faint whitespace-nowrap">{entry.timestamp}</td>
                  <td className="py-3 px-5 text-xs text-forge-text-faint font-mono">{entry.ip || '—'}</td>
                </tr>
              )
            })}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-sm text-forge-text-muted">No audit entries match your filters</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-forge-border bg-forge-bg/30">
            <span className="text-xs text-forge-text-faint">
              Showing {page * perPage + 1}–{Math.min((page + 1) * perPage, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(p - 1, 0))}
                disabled={page === 0}
                className="p-1.5 rounded-md border border-forge-border text-forge-text-muted hover:bg-white transition-colors disabled:opacity-30"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))}
                disabled={page >= totalPages - 1}
                className="p-1.5 rounded-md border border-forge-border text-forge-text-muted hover:bg-white transition-colors disabled:opacity-30"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

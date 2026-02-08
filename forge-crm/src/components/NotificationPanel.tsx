import { useNavigate } from 'react-router-dom'
import {
  X, AlertTriangle, Clock, ShieldAlert, Building2, Server,
  CheckCircle2, ChevronRight,
} from 'lucide-react'
import type { Notification } from '../data/mockData'

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bgColor: string }> = {
  incident: { icon: <ShieldAlert size={16} />, color: 'text-red-400', bgColor: 'bg-red-500/10' },
  deadline: { icon: <Clock size={16} />, color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
  sla: { icon: <AlertTriangle size={16} />, color: 'text-orange-400', bgColor: 'bg-orange-500/10' },
  client: { icon: <Building2 size={16} />, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
  system: { icon: <Server size={16} />, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
}

const severityDot: Record<string, string> = {
  critical: 'bg-red-500 shadow-red-500/40',
  warning: 'bg-amber-500 shadow-amber-500/40',
  info: 'bg-blue-500 shadow-blue-500/40',
}

interface NotificationPanelProps {
  open: boolean
  onClose: () => void
  notifications: Notification[]
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
}

export default function NotificationPanel({ open, onClose, notifications, onMarkRead, onMarkAllRead }: NotificationPanelProps) {
  const navigate = useNavigate()
  const unreadCount = notifications.filter(n => !n.read).length

  function handleClick(notif: Notification) {
    onMarkRead(notif.id)
    if (notif.link) {
      navigate(notif.link)
      onClose()
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[250]" onClick={onClose}>
      {/* Transparent backdrop */}
      <div className="absolute inset-0" />

      {/* Panel positioned near sidebar */}
      <div
        className="absolute left-[268px] top-[120px] w-[380px] bg-white rounded-xl shadow-2xl border border-forge-border overflow-hidden animate-scaleIn"
        style={{ transformOrigin: 'top left' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-forge-border bg-gradient-to-r from-forge-bg/50 to-transparent">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-forge-text">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="flex items-center gap-1 text-[11px] text-forge-teal hover:text-forge-teal/80 font-medium transition-colors"
              >
                <CheckCircle2 size={12} />
                Mark all read
              </button>
            )}
            <button onClick={onClose} className="p-1 rounded-md text-forge-text-faint hover:bg-forge-bg hover:text-forge-text transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Notification list */}
        <div className="max-h-[400px] overflow-y-auto divide-y divide-forge-border">
          {notifications.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <CheckCircle2 size={28} className="mx-auto text-forge-success mb-2" />
              <p className="text-sm text-forge-text-muted">All caught up!</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const config = typeConfig[notif.type] || typeConfig.system
              return (
                <button
                  key={notif.id}
                  onClick={() => handleClick(notif)}
                  className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-forge-bg/50 ${
                    !notif.read ? 'bg-forge-teal-subtle/30' : ''
                  }`}
                >
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${config.bgColor}`}>
                    <span className={config.color}>{config.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      {!notif.read && (
                        <span className={`w-1.5 h-1.5 rounded-full shadow-sm flex-shrink-0 ${
                          severityDot[notif.severity || 'info']
                        }`} />
                      )}
                      <p className={`text-xs font-semibold truncate ${notif.read ? 'text-forge-text-muted' : 'text-forge-text'}`}>
                        {notif.title}
                      </p>
                    </div>
                    <p className="text-[11px] text-forge-text-faint leading-relaxed line-clamp-2">
                      {notif.body}
                    </p>
                    <p className="text-[10px] text-forge-text-faint mt-1">{notif.time}</p>
                  </div>

                  {/* Navigate arrow */}
                  {notif.link && (
                    <ChevronRight size={14} className="text-forge-text-faint flex-shrink-0 mt-1" />
                  )}
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

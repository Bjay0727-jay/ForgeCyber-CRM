import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X, AlertTriangle, Clock, ShieldAlert, Building2, Server,
  CheckCircle2, ChevronRight, Activity, Bell,
  PlusCircle, RefreshCw, FileText, LogIn,
} from 'lucide-react'
import type { Notification } from '../data/mockData'
import { activities } from '../data/mockData'

type Tab = 'notifications' | 'activity'

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

const activityIcons: Record<string, { icon: React.ReactNode; color: string; bgColor: string }> = {
  complete: { icon: <CheckCircle2 size={14} />, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
  create: { icon: <PlusCircle size={14} />, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  update: { icon: <RefreshCw size={14} />, color: 'text-forge-teal', bgColor: 'bg-forge-teal/10' },
  alert: { icon: <AlertTriangle size={14} />, color: 'text-red-400', bgColor: 'bg-red-500/10' },
  export: { icon: <FileText size={14} />, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
  login: { icon: <LogIn size={14} />, color: 'text-forge-text-faint', bgColor: 'bg-forge-bg' },
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
  const [tab, setTab] = useState<Tab>('notifications')
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
      <div className="absolute inset-0" />

      <div
        className="absolute left-[268px] top-[120px] w-[400px] bg-white rounded-xl shadow-2xl border border-forge-border overflow-hidden animate-scaleIn"
        style={{ transformOrigin: 'top left' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header with tabs */}
        <div className="border-b border-forge-border">
          <div className="flex items-center justify-between px-4 pt-3 pb-0">
            <div className="flex items-center gap-0">
              <button
                onClick={() => setTab('notifications')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors ${
                  tab === 'notifications'
                    ? 'border-forge-teal text-forge-teal'
                    : 'border-transparent text-forge-text-muted hover:text-forge-text'
                }`}
              >
                <Bell size={13} />
                Notifications
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[9px] font-bold">{unreadCount}</span>
                )}
              </button>
              <button
                onClick={() => setTab('activity')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 -mb-px transition-colors ${
                  tab === 'activity'
                    ? 'border-forge-teal text-forge-teal'
                    : 'border-transparent text-forge-text-muted hover:text-forge-text'
                }`}
              >
                <Activity size={13} />
                Activity Feed
              </button>
            </div>
            <div className="flex items-center gap-2 pb-2">
              {tab === 'notifications' && unreadCount > 0 && (
                <button onClick={onMarkAllRead} className="text-[10px] text-forge-teal hover:text-forge-teal/80 font-medium transition-colors">
                  Mark all read
                </button>
              )}
              <button onClick={onClose} className="p-1 rounded-md text-forge-text-faint hover:bg-forge-bg hover:text-forge-text transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[420px] overflow-y-auto">
          {tab === 'notifications' ? (
            <div className="divide-y divide-forge-border">
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
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${config.bgColor}`}>
                        <span className={config.color}>{config.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          {!notif.read && (
                            <span className={`w-1.5 h-1.5 rounded-full shadow-sm flex-shrink-0 ${severityDot[notif.severity || 'info']}`} />
                          )}
                          <p className={`text-xs font-semibold truncate ${notif.read ? 'text-forge-text-muted' : 'text-forge-text'}`}>
                            {notif.title}
                          </p>
                        </div>
                        <p className="text-[11px] text-forge-text-faint leading-relaxed line-clamp-2">{notif.body}</p>
                        <p className="text-[10px] text-forge-text-faint mt-1">{notif.time}</p>
                      </div>
                      {notif.link && <ChevronRight size={14} className="text-forge-text-faint flex-shrink-0 mt-1" />}
                    </button>
                  )
                })
              )}
            </div>
          ) : (
            /* Activity Feed */
            <div className="divide-y divide-forge-border/50">
              {activities.map((activity, idx) => {
                const style = activityIcons[activity.type] || activityIcons.update
                return (
                  <div key={idx} className="flex items-start gap-3 px-4 py-3 hover:bg-forge-bg/30 transition-colors">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${style.bgColor}`}>
                      <span className={style.color}>{style.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-forge-text leading-relaxed" dangerouslySetInnerHTML={{ __html: activity.text }} />
                      <p className="text-[10px] text-forge-text-faint mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
              {/* Extra activity items for a richer feed */}
              <div className="flex items-start gap-3 px-4 py-3 hover:bg-forge-bg/30 transition-colors">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 bg-purple-500/10">
                  <FileText size={14} className="text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-forge-text leading-relaxed"><strong>SOC 2 Readiness</strong> template exported by Emily Chen</p>
                  <p className="text-[10px] text-forge-text-faint mt-0.5">Yesterday at 5:30 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3 px-4 py-3 hover:bg-forge-bg/30 transition-colors">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 bg-forge-bg">
                  <LogIn size={14} className="text-forge-text-faint" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-forge-text leading-relaxed"><strong>David Kim</strong> logged in from mobile device</p>
                  <p className="text-[10px] text-forge-text-faint mt-0.5">Yesterday at 8:15 AM</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

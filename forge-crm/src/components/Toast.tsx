import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'warning' | 'error' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
}

interface ToastContextType {
  toast: (type: ToastType, message: string) => void
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} })

const icons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
}

const colors = {
  success: 'bg-forge-success/10 border-forge-success/30 text-forge-success',
  warning: 'bg-forge-warning/10 border-forge-warning/30 text-forge-warning',
  error: 'bg-forge-danger/10 border-forge-danger/30 text-forge-danger',
  info: 'bg-forge-info/10 border-forge-info/30 text-forge-info',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }, [])

  const removeToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id))

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => {
          const Icon = icons[t.type]
          return (
            <div key={t.id} className={`toast-enter pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-xl border shadow-lg ${colors[t.type]}`}>
              <Icon size={18} />
              <span className="text-sm font-medium flex-1">{t.message}</span>
              <button onClick={() => removeToast(t.id)} className="opacity-60 hover:opacity-100 transition-opacity">
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)

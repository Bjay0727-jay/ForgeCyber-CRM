import { useState, useEffect, useCallback } from 'react'
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react'

interface TourStep {
  target: string // CSS selector or data attribute
  title: string
  body: string
  position: 'right' | 'bottom'
}

const tourSteps: TourStep[] = [
  {
    target: '[data-tour="brand"]',
    title: 'Welcome to Forge Cyber',
    body: 'Your MSSP service delivery platform. Everything you need to manage clients, assessments, and compliance — all in one place.',
    position: 'right',
  },
  {
    target: '[data-tour="tenant"]',
    title: 'Workspace Switcher',
    body: 'Switch between client workspaces instantly. Each workspace has its own data context for assessments, reports, and operations.',
    position: 'right',
  },
  {
    target: '[data-tour="search"]',
    title: 'Global Search (⌘K)',
    body: 'Search across pages, customers, templates, and assessments. Press Ctrl+K or ⌘K from anywhere to open the command palette.',
    position: 'right',
  },
  {
    target: '[data-tour="notifications"]',
    title: 'Notifications & Activity',
    body: 'Real-time alerts for incidents, SLA breaches, deadlines, and system events. Switch to the Activity tab for a full event feed.',
    position: 'right',
  },
  {
    target: '[data-tour="nav"]',
    title: 'Navigation & Favorites',
    body: 'Browse sections or hover over any item and click the star to pin it. Use arrow keys for keyboard navigation. Items are filtered by your role.',
    position: 'right',
  },
  {
    target: '[data-tour="integrations"]',
    title: 'Integration Status',
    body: 'Monitor the health of your connected tools — vulnerability scanners, SIEM, ticketing systems, and cloud platforms — at a glance.',
    position: 'right',
  },
  {
    target: '[data-tour="profile"]',
    title: 'Profile & Settings',
    body: 'Switch roles, toggle dark/light mode, access account settings, or sign out. Your role determines which sections are visible.',
    position: 'right',
  },
]

interface OnboardingTourProps {
  active: boolean
  onFinish: () => void
}

export default function OnboardingTour({ active, onFinish }: OnboardingTourProps) {
  const [step, setStep] = useState(0)
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 })

  const positionTooltip = useCallback(() => {
    if (!active) return
    const current = tourSteps[step]
    const el = document.querySelector(current.target)
    if (!el) return

    const rect = el.getBoundingClientRect()
    if (current.position === 'right') {
      setTooltipPos({
        top: rect.top + rect.height / 2 - 60,
        left: rect.right + 16,
      })
    } else {
      setTooltipPos({
        top: rect.bottom + 12,
        left: rect.left,
      })
    }
  }, [active, step])

  useEffect(() => {
    if (!active) return
    positionTooltip()
    window.addEventListener('resize', positionTooltip)
    return () => window.removeEventListener('resize', positionTooltip)
  }, [active, positionTooltip])

  // Highlight the target element
  useEffect(() => {
    if (!active) return
    const current = tourSteps[step]
    const el = document.querySelector(current.target) as HTMLElement
    if (el) {
      el.style.position = 'relative'
      el.style.zIndex = '301'
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
    return () => {
      if (el) {
        el.style.zIndex = ''
      }
    }
  }, [active, step])

  if (!active) return null

  const current = tourSteps[step]
  const isLast = step === tourSteps.length - 1

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[300] bg-black/40 backdrop-blur-[1px]" />

      {/* Tooltip */}
      <div
        className="fixed z-[302] w-[320px] bg-white rounded-xl shadow-2xl border border-forge-border overflow-hidden animate-scaleIn"
        style={{ top: tooltipPos.top, left: tooltipPos.left }}
      >
        {/* Progress bar */}
        <div className="h-1 bg-forge-bg">
          <div
            className="h-full bg-gradient-to-r from-forge-teal to-emerald-400 transition-all duration-300"
            style={{ width: `${((step + 1) / tourSteps.length) * 100}%` }}
          />
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-forge-teal to-emerald-500 flex items-center justify-center flex-shrink-0">
                <Sparkles size={12} className="text-white" />
              </div>
              <h3 className="text-sm font-bold text-forge-text">{current.title}</h3>
            </div>
            <button
              onClick={onFinish}
              className="p-1 rounded-md text-forge-text-faint hover:text-forge-text hover:bg-forge-bg transition-colors"
            >
              <X size={14} />
            </button>
          </div>
          <p className="text-xs text-forge-text-muted leading-relaxed mb-4">{current.body}</p>

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-forge-text-faint font-medium">
              {step + 1} of {tourSteps.length}
            </span>
            <div className="flex items-center gap-2">
              {step > 0 && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-forge-text-muted border border-forge-border rounded-lg hover:bg-forge-bg transition-colors"
                >
                  <ChevronLeft size={12} />
                  Back
                </button>
              )}
              {isLast ? (
                <button
                  onClick={onFinish}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-forge-teal to-emerald-500 rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  Get Started
                </button>
              ) : (
                <button
                  onClick={() => setStep(s => s + 1)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-forge-teal to-emerald-500 rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  Next
                  <ChevronRight size={12} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

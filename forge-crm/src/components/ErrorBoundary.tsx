import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-forge-danger/10 flex items-center justify-center mb-5">
            <AlertTriangle size={28} className="text-forge-danger" />
          </div>
          <h2 className="text-lg font-semibold text-forge-text mb-2">Something went wrong</h2>
          <p className="text-sm text-forge-text-muted max-w-md mb-6">
            An unexpected error occurred. Try refreshing the page to continue.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-forge-teal text-white text-sm font-medium hover:bg-forge-teal/90 transition-colors"
          >
            <RefreshCw size={15} />
            Refresh Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

import { Link } from 'react-router-dom'
import { Home, AlertCircle } from 'lucide-react'
import Card from '../components/Card'

export default function NotFound() {
  return (
    <Card>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-forge-warning/10 flex items-center justify-center mb-5">
          <AlertCircle size={28} className="text-forge-warning" />
        </div>
        <h2 className="text-lg font-semibold text-forge-text mb-2">Page Not Found</h2>
        <p className="text-sm text-forge-text-muted max-w-md mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-forge-teal text-white text-sm font-medium hover:bg-forge-teal/90 transition-colors"
        >
          <Home size={15} />
          Back to Dashboard
        </Link>
      </div>
    </Card>
  )
}

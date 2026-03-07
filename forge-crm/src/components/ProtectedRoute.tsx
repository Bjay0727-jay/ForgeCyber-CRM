import { useAuth } from '../context/AuthContext'
import type { Role } from '../context/AuthContext'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: Role
}

const ROLE_LEVEL: Record<Role, number> = {
  viewer: 0,
  consultant: 1,
  admin: 2,
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-forge-teal/30 border-t-forge-teal rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-xl font-semibold text-forge-text mb-2">Authentication Required</h2>
        <p className="text-sm text-forge-text-muted">
          Please sign in through your organization's identity provider to access this portal.
        </p>
      </div>
    )
  }

  if (requiredRole && ROLE_LEVEL[user.role] < ROLE_LEVEL[requiredRole]) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-xl font-semibold text-forge-text mb-2">Access Denied</h2>
        <p className="text-sm text-forge-text-muted">
          You do not have the required permissions to view this page.
        </p>
      </div>
    )
  }

  return <>{children}</>
}

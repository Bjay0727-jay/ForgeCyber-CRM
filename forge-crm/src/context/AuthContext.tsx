import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

export type Role = 'admin' | 'consultant' | 'viewer'

export interface AuthUser {
  email: string
  name: string
  role: Role
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
})

/** Default user when Cloudflare Access is not yet configured */
const DEFAULT_USER: AuthUser = { email: 'user@forgecyber.com', name: 'Forge User', role: 'admin' }

/**
 * Reads the Cloudflare Access JWT identity from the /cdn-cgi/access/get-identity endpoint.
 * Falls back to a default user when Cloudflare Access is not configured (404 response).
 * Once Cloudflare Access is enabled, remove the DEFAULT_USER fallback to enforce SSO.
 */
async function fetchIdentity(): Promise<AuthUser> {
  try {
    const res = await fetch('/cdn-cgi/access/get-identity', { credentials: 'same-origin' })
    if (!res.ok) {
      // Cloudflare Access not configured yet — allow access with default user
      return DEFAULT_USER
    }
    const data = await res.json()
    const email: string = data.email ?? ''
    const name: string = data.name ?? email.split('@')[0] ?? ''

    // Map groups/email to role. Customize these rules per your Cloudflare Access config.
    const groups: string[] = data.groups ?? []
    let role: Role = 'viewer'
    if (groups.includes('admin') || email.endsWith('@forgecyber.com') || email.endsWith('@forgecyberdefense.com')) {
      role = 'admin'
    } else if (groups.includes('consultant')) {
      role = 'consultant'
    }

    return { email, name, role }
  } catch {
    // Network error or local development — allow access with default user
    return DEFAULT_USER
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchIdentity().then((identity) => {
      setUser(identity)
      setIsLoading(false)
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}

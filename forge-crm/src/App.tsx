import { useState, lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const CRM = lazy(() => import('./pages/CRM'))
const Intake = lazy(() => import('./pages/Intake'))
const Assessments = lazy(() => import('./pages/Assessments'))
const Workflow = lazy(() => import('./pages/Workflow'))
const Templates = lazy(() => import('./pages/Templates'))
const Operations = lazy(() => import('./pages/Operations'))
const Reports = lazy(() => import('./pages/Reports'))
const Team = lazy(() => import('./pages/Team'))
const AuditLog = lazy(() => import('./pages/AuditLog'))
const NotFound = lazy(() => import('./pages/NotFound'))

const pages: Record<string, { title: string; breadcrumb: string }> = {
  '/dashboard': { title: 'Service Delivery Dashboard', breadcrumb: 'Home / Dashboard' },
  '/crm': { title: 'CRM / Pipeline Management', breadcrumb: 'Home / CRM' },
  '/intake': { title: 'New Customer Intake', breadcrumb: 'Home / Customer Management / Intake' },
  '/assessments': { title: 'Security Assessments', breadcrumb: 'Home / Consulting / Assessments' },
  '/workflow': { title: 'Consulting Workflow', breadcrumb: 'Home / Consulting / Workflow' },
  '/templates': { title: 'Document Templates', breadcrumb: 'Home / Consulting / Templates' },
  '/operations': { title: 'Operations Management', breadcrumb: 'Home / Operations' },
  '/reports': { title: 'Reports & Analytics', breadcrumb: 'Home / Reports' },
  '/team': { title: 'Team Management', breadcrumb: 'Home / Admin / Team' },
  '/audit-log': { title: 'Audit Log', breadcrumb: 'Home / Admin / Audit Log' },
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-2 border-forge-teal/30 border-t-forge-teal rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const page = pages[location.pathname] || pages['/dashboard']
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-forge-bg">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[999] focus:px-4 focus:py-2 focus:bg-forge-teal focus:text-white focus:rounded-lg focus:text-sm focus:font-medium">
        Skip to main content
      </a>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(prev => !prev)} />
      <main id="main-content" className={`flex-1 min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'ml-[68px]' : 'ml-[260px]'}`}>
        <TopBar title={page.title} breadcrumb={page.breadcrumb} />
        <div className="p-6" key={location.pathname}>
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/crm" element={<ProtectedRoute><CRM /></ProtectedRoute>} />
                <Route path="/intake" element={<ProtectedRoute><Intake /></ProtectedRoute>} />
                <Route path="/assessments" element={<ProtectedRoute><Assessments /></ProtectedRoute>} />
                <Route path="/workflow" element={<ProtectedRoute><Workflow /></ProtectedRoute>} />
                <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
                <Route path="/operations" element={<ProtectedRoute><Operations /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                <Route path="/team" element={<ProtectedRoute requiredRole="admin"><Team /></ProtectedRoute>} />
                <Route path="/audit-log" element={<ProtectedRoute requiredRole="admin"><AuditLog /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  )
}

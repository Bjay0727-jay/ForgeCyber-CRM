import { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Dashboard from './pages/Dashboard'
import CRM from './pages/CRM'
import Intake from './pages/Intake'
import Assessments from './pages/Assessments'
import Workflow from './pages/Workflow'
import Templates from './pages/Templates'
import Operations from './pages/Operations'
import Reports from './pages/Reports'
import Team from './pages/Team'
import AuditLog from './pages/AuditLog'

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
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/crm" element={<CRM />} />
            <Route path="/intake" element={<Intake />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/workflow" element={<Workflow />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/operations" element={<Operations />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/team" element={<Team />} />
            <Route path="/audit-log" element={<AuditLog />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

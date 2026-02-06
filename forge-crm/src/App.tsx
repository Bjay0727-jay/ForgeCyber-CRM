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
}

export default function App() {
  const location = useLocation()
  const page = pages[location.pathname] || pages['/dashboard']
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-forge-bg">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <main className={`flex-1 transition-all duration-300 min-h-screen ${collapsed ? 'ml-[72px]' : 'ml-[272px]'}`}>
        <TopBar title={page.title} breadcrumb={page.breadcrumb} />
        <div className="p-6 lg:p-8 animate-fadeIn" key={location.pathname}>
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
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

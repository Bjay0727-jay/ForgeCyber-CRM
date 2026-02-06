import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  ClipboardCheck,
  GitBranch,
  FileText,
  Briefcase,
  BarChart3,
  UsersRound,
  Settings,
  Shield,
} from 'lucide-react';
import type { ReactNode } from 'react';

interface NavItem {
  label: string;
  icon: ReactNode;
  to: string;
  badge?: string;
}

interface NavGroup {
  heading: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    heading: 'Main',
    items: [
      { label: 'Dashboard', icon: <LayoutDashboard size={20} />, to: '/dashboard' },
    ],
  },
  {
    heading: 'Customer Management',
    items: [
      { label: 'CRM / Pipeline', icon: <Users size={20} />, to: '/crm', badge: '12' },
      { label: 'New Customer Intake', icon: <UserPlus size={20} />, to: '/intake' },
    ],
  },
  {
    heading: 'Consulting Services',
    items: [
      { label: 'Assessments', icon: <ClipboardCheck size={20} />, to: '/assessments', badge: '4' },
      { label: 'Consulting Workflow', icon: <GitBranch size={20} />, to: '/workflow' },
      { label: 'Document Templates', icon: <FileText size={20} />, to: '/templates' },
    ],
  },
  {
    heading: 'Operations',
    items: [
      { label: 'Active Engagements', icon: <Briefcase size={20} />, to: '/operations', badge: '8' },
      { label: 'Reports & Analytics', icon: <BarChart3 size={20} />, to: '/reports' },
    ],
  },
  {
    heading: 'Admin',
    items: [
      { label: 'Team Management', icon: <UsersRound size={20} />, to: '/team' },
      { label: 'Settings', icon: <Settings size={20} />, to: '/settings' },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[280px] bg-linear-to-b from-forge-navy-deep to-forge-navy flex flex-col z-50">
      {/* Logo Area */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forge-teal to-forge-teal-light flex items-center justify-center shadow-lg">
            <Shield size={22} className="text-white" />
          </div>
          <div>
            <h1 className="font-heading text-sm font-bold text-white tracking-wider leading-tight">
              FORGE CYBER DEFENSE
            </h1>
            <p className="text-[11px] text-white/50 font-body mt-0.5">
              Service Delivery Portal
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {navGroups.map((group) => (
          <div key={group.heading}>
            <p className="px-3.5 mb-2 text-[11px] font-semibold uppercase tracking-widest text-white/40">
              {group.heading}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-br from-forge-teal to-forge-teal/80 text-white shadow-lg'
                          : 'text-white/70 hover:bg-white/6 hover:text-white'
                      }`
                    }
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="min-w-[22px] h-[22px] flex items-center justify-center rounded-full bg-white/15 text-[11px] font-semibold text-white">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl hover:bg-white/6 cursor-pointer transition-colors">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-forge-teal to-forge-teal-light flex items-center justify-center text-white text-xs font-bold">
            SC
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Stan Chen</p>
            <p className="text-[11px] text-white/50 truncate">Senior Consultant</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

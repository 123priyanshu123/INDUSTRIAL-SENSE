import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  LineChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Layers,
  Activity,
  BrainCircuit,
  Bell,
  FileText,
  FileSpreadsheet,
  Cpu,
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const activeAlerts = useAppStore(state => state.activeAlerts);
  const unackCount = activeAlerts.filter(a => !a.acknowledged).length;

  const navItems: NavItem[] = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/machines', label: 'Fleet Catalogue', icon: Cpu },
    { to: '/analytics', label: 'Analytics', icon: LineChart },
    { to: '/monitoring', label: 'Live Telemetry', icon: Activity },
    { to: '/manual-testing', label: 'Manual Testing', icon: FileSpreadsheet },
    { to: '/machine-registration', label: 'Register Machine', icon: Layers },
    { to: '/profile', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 bg-[#16171a] border-r border-[#2a2b30] transition-all duration-300 flex flex-col justify-between ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col py-4 px-3 gap-2 overflow-y-auto">
        {/* Brand Header */}
        <Link
          to="/"
          className={`flex items-center gap-3 px-3 py-3 mb-2 border-b border-[#2a2b30] hover:bg-[#202126] rounded-xl transition-all cursor-pointer group ${
            collapsed ? 'justify-center' : ''
          }`}
          title="INDUSTRIALSENSE - Return to Landing Page"
        >
          <span className="w-3.5 h-3.5 rounded-full bg-red-600 flex-shrink-0 group-hover:scale-110 transition-transform" />
          {!collapsed && (
            <span className="font-mono font-bold text-base tracking-wider uppercase text-zinc-100 truncate group-hover:text-white transition-colors">
              INDUSTRIALSENSE
            </span>
          )}
        </Link>

        {/* System Tag */}
        {!collapsed && (
          <div className="px-3.5 py-2 mb-2 bg-[#1d1e23] rounded-xl border border-[#2a2b30] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono font-semibold text-zinc-300">SCADA BUS - ACTIVE</span>
            </div>
            <span className="text-xs font-mono text-zinc-400">v4.2</span>
          </div>
        )}

        {/* Navigation Items */}
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 rounded-xl font-mono text-sm font-semibold transition-all relative group ${
                  isActive
                    ? 'bg-red-700 text-white shadow-sm'
                    : 'text-zinc-400 hover:bg-[#202126] hover:text-zinc-200'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {item.badge !== undefined && (
                <span
                  className={`ml-auto px-2 py-0.5 rounded-full text-xs font-bold ${
                    collapsed
                      ? 'absolute top-1 right-1 bg-red-600 text-white'
                      : 'bg-[#18191d] text-red-300 border border-red-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-3 border-t border-[#2a2b30] bg-[#16171a]">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#202126] text-zinc-400 hover:text-white hover:bg-[#282a30] transition-all text-sm font-mono"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>COLLAPSE</span></>}
        </button>
      </div>
    </aside>
  );
};

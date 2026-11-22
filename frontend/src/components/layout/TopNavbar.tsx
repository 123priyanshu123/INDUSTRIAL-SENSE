import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  User,
  UserPlus,
} from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export const TopNavbar: React.FC = () => {
  const location = useLocation();
  const { currentUser } = useAppStore();
  const [showNavMenu, setShowNavMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navLinks = [
    { to: '/dashboard', label: 'DASHBOARD' },
    { to: '/machines', label: 'FLEET' },
    { to: '/analytics', label: 'ANALYTICS' },
    { to: '/monitoring', label: 'TELEMETRY' },
    { to: '/manual-testing', label: 'MANUAL TESTING' },
    { to: '/profile', label: 'SETTINGS' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#121315] border-b border-[#292a2c] shadow-md select-none">
      <div className="h-16 w-full max-w-[1920px] mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link to="/" title="Return to Landing Page" className="flex items-center gap-2.5 group cursor-pointer">
            <span className="w-3.5 h-3.5 rounded-full bg-red-600 inline-block group-hover:scale-110 transition-transform" />
            <span className="font-ndot-57 font-bold text-base md:text-lg lg:text-xl tracking-tight text-[#e3e2e5] group-hover:text-white transition-colors">
              INDUSTRIALSENSE
            </span>
          </Link>
          <span className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-ntype-mono font-semibold bg-[#1b1c1e] text-zinc-300 border border-zinc-700 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            SCADA BUS - ACTIVE
          </span>
        </div>

        {/* Core Navigation Pills */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-[#1b1c1e] p-1 rounded-xl border border-[#292a2c] font-ntype-mono text-sm">
          {navLinks.map((item) => {
            const isActive =
              location.pathname === item.to ||
              (item.to === '/analytics' && location.pathname.startsWith('/analytics')) ||
              (item.to === '/profile' && (location.pathname === '/settings' || location.pathname === '/profile'));

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all font-semibold ${
                  isActive
                    ? 'bg-red-700 text-white shadow-sm'
                    : 'text-[#c6c6c7] hover:text-white hover:bg-[#292a2c]'
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-bold uppercase transition-all border border-zinc-700"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>LIVE TELEMETRY</span>
          </Link>

          {/* Quick Menu Button & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNavMenu(!showNavMenu)}
              className="px-3.5 py-1.5 rounded-lg bg-[#1b1c1e] border border-[#292a2c] hover:border-zinc-500 text-white font-mono text-xs font-bold uppercase flex items-center gap-2 transition-all"
            >
              <span>MENU</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {showNavMenu && (
              <div
                className="absolute right-0 mt-2 w-72 rounded-xl bg-[#0d0e10] border border-[#292a2c] shadow-2xl p-2.5 z-50 space-y-1 font-mono text-xs"
                onClick={() => setShowNavMenu(false)}
              >
                <div className="px-3 py-2 border-b border-zinc-800 text-xs text-zinc-400 tracking-wider uppercase flex items-center justify-between">
                  <span>SCADA NAVIGATION BUS</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    ONLINE
                  </span>
                </div>

                <Link
                  to="/"
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-[#c6c6c7] hover:text-white hover:bg-[#1f2022]"
                >
                  <span className="flex items-center gap-2">
                    <span>⌂</span>
                    <span>Landing Page (Overview)</span>
                  </span>
                  <span className="text-xs text-zinc-500">HOME</span>
                </Link>

                <Link
                  to="/dashboard"
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-[#c6c6c7] hover:text-white hover:bg-[#1f2022]"
                >
                  <span className="flex items-center gap-2">
                    <span>◈</span>
                    <span>Dashboard (SCADA Cockpit)</span>
                  </span>
                  <span className="text-xs text-zinc-500">MAP</span>
                </Link>

                <Link
                  to="/machines"
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-[#c6c6c7] hover:text-white hover:bg-[#1f2022]"
                >
                  <span className="flex items-center gap-2">
                    <span>▦</span>
                    <span>Fleet Equipment Catalogue</span>
                  </span>
                  <span className="text-xs text-zinc-500">15 FAMILIES</span>
                </Link>

                <Link
                  to="/analytics"
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-[#c6c6c7] hover:text-white hover:bg-[#1f2022]"
                >
                  <span className="flex items-center gap-2">
                    <span>▤</span>
                    <span>Machine Deep Analytics</span>
                  </span>
                  <span className="text-xs text-zinc-500">CAD</span>
                </Link>

                <Link
                  to="/monitoring"
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-[#c6c6c7] hover:text-white hover:bg-[#1f2022]"
                >
                  <span className="flex items-center gap-2">
                    <span>⚡</span>
                    <span>Live Telemetry & Sensor Bus</span>
                  </span>
                  <span className="text-xs text-zinc-500">REAL-TIME</span>
                </Link>

                <Link
                  to="/manual-testing"
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-[#c6c6c7] hover:text-white hover:bg-[#1f2022]"
                >
                  <span className="flex items-center gap-2">
                    <span>📄</span>
                    <span>Manual CSV Testing</span>
                  </span>
                  <span className="text-xs text-zinc-500">TEST</span>
                </Link>

                <Link
                  to="/machine-registration"
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-[#c6c6c7] hover:text-white hover:bg-[#1f2022]"
                >
                  <span className="flex items-center gap-2">
                    <span>⚙</span>
                    <span>Machine Provisioning</span>
                  </span>
                  <span className="text-xs text-zinc-500">ADD</span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-[#c6c6c7] hover:text-white hover:bg-[#1f2022]"
                >
                  <span className="flex items-center gap-2">
                    <span>👤</span>
                    <span>Profile & Sensor Thresholds</span>
                  </span>
                  <span className="text-xs text-zinc-500">CONFIG</span>
                </Link>
              </div>
            )}
          </div>

          {/* User Profile Avatar Pill */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg bg-[#1b1c1e] hover:bg-[#292a2c] border border-[#292a2c] transition-all"
            >
              <div className="w-7 h-7 rounded-md bg-[#292a2c] flex items-center justify-center font-mono font-bold text-xs text-zinc-200 border border-zinc-700">
                {currentUser?.name ? currentUser.name.charAt(0) : 'U'}
              </div>
              <span className="hidden xl:inline text-xs font-mono font-bold text-white">
                {currentUser?.name ? currentUser.name.split(' ')[0] : 'Operator'}
              </span>
            </button>

            {showUserMenu && (
              <div
                className="absolute right-0 mt-2 w-56 bg-[#1b1c1e] border border-[#38393b] rounded-xl shadow-2xl p-2 z-50 font-mono text-xs"
                onClick={() => setShowUserMenu(false)}
              >
                <div className="p-2 border-b border-[#292a2c]">
                  <div className="font-bold text-white">{currentUser?.name || 'Operator'}</div>
                  <div className="text-xs text-[#a1a1aa] mt-0.5">{currentUser?.role?.toUpperCase() || 'ADMIN'} • AUTHORIZED</div>
                  <div className="text-xs text-zinc-400 mt-1">{currentUser?.shift || 'Shift Alpha'}</div>
                </div>
                <div className="pt-2 flex flex-col gap-1">
                  <Link
                    to="/profile"
                    className="px-2.5 py-1.5 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-[#292a2c] flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>User Profile & Settings</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

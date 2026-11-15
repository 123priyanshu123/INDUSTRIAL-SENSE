import React from 'react';
import { Shield, Check, X } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { UserRole } from '../../types/api';

export const PermissionsMatrix: React.FC = () => {
  const { currentUser, setUserRole } = useAppStore();

  const permissions = [
    { feature: 'View SCADA Cockpit & Live Telemetry', admin: true, engineer: true, viewer: true },
    { feature: 'Inspect 2D/3D Machine Twins & Animations', admin: true, engineer: true, viewer: true },
    { feature: 'Export Shift PDF/CSV Telemetry Reports', admin: true, engineer: true, viewer: true },
    { feature: 'Acknowledge Machine Anomaly Incidents', admin: true, engineer: true, viewer: false },
    { feature: 'Adjust Warning / Critical Thresholds', admin: true, engineer: true, viewer: false },
    { feature: 'Commission / Register New Machines', admin: true, engineer: false, viewer: false },
    { feature: 'Manage User Roles & Access RBAC', admin: true, engineer: false, viewer: false },
  ];

  return (
    <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-6 font-mono">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#ffb4ab]" />
          <h3 className="text-base font-bold text-white uppercase tracking-wider">
            ROLE-BASED ACCESS CONTROL (RBAC) MATRIX
          </h3>
        </div>
        <span className="text-xs text-[#a1a1aa]">
          Current Role: <strong className="text-white uppercase">{currentUser.role}</strong>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#121315] border-b border-[#292a2c] text-[#a1a1aa] uppercase text-[10px]">
              <th className="py-3 px-4">System Operation / Capability</th>
              <th className="py-3 px-4 text-center">Admin</th>
              <th className="py-3 px-4 text-center">Engineer</th>
              <th className="py-3 px-4 text-center">Viewer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#292a2c]">
            {permissions.map((p, idx) => (
              <tr key={idx} className="hover:bg-[#292a2c]/30">
                <td className="py-3 px-4 text-[#e3e2e5] font-sans">{p.feature}</td>
                <td className="py-3 px-4 text-center">
                  {p.admin ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-zinc-600 mx-auto" />}
                </td>
                <td className="py-3 px-4 text-center">
                  {p.engineer ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-zinc-600 mx-auto" />}
                </td>
                <td className="py-3 px-4 text-center">
                  {p.viewer ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-zinc-600 mx-auto" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-3 border-t border-[#292a2c] flex items-center justify-between text-[11px] text-[#a1a1aa]">
        <span>Simulate switching roles in real time:</span>
        <div className="flex gap-2">
          {(['admin', 'engineer', 'viewer'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => setUserRole(r)}
              className={`px-3 py-1 rounded-lg uppercase font-bold text-[10px] transition-all ${
                currentUser.role === r ? 'bg-[#d71920] text-white' : 'bg-[#121315] text-[#a1a1aa] hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { DashboardOverview } from '../../types/api';
import { Cpu, Play, Clock, AlertTriangle, AlertOctagon, PowerOff } from 'lucide-react';

interface MachineSummaryProps {
  stats: DashboardOverview['machineStats'];
}

export const MachineSummary: React.FC<MachineSummaryProps> = ({ stats }) => {
  const cards = [
    { label: 'REGISTERED FLEET', val: stats.total, icon: Cpu, color: 'text-white', bg: 'border-[#38393b]' },
    { label: 'RUNNING NOMINAL', val: stats.running, icon: Play, color: 'text-emerald-400', bg: 'border-emerald-500/30' },
    { label: 'STANDBY / IDLE', val: stats.idle, icon: Clock, color: 'text-cyan-400', bg: 'border-cyan-500/30' },
    { label: 'DEGRADED WARNING', val: stats.warning, icon: AlertTriangle, color: 'text-amber-400', bg: 'border-amber-500/40' },
    { label: 'CRITICAL ALERT', val: stats.critical, icon: AlertOctagon, color: 'text-rose-400', bg: 'border-rose-500/50' },
    { label: 'DISCONNECTED', val: stats.offline, icon: PowerOff, color: 'text-zinc-500', bg: 'border-zinc-700/30' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`bg-[#1b1c1e] border ${card.bg} rounded-2xl p-4 flex flex-col justify-between font-mono`}
          >
            <div className="flex items-center justify-between text-[#a1a1aa] mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">{card.label}</span>
              <Icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <div className={`text-3xl font-bold ${card.color}`}>{card.val}</div>
          </div>
        );
      })}
    </div>
  );
};

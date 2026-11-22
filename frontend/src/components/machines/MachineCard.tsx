import React from 'react';
import { Link } from 'react-router-dom';
import { Machine } from '../../types/machine';
import { Eye, ArrowRight, Gauge, Clock } from 'lucide-react';

interface MachineCardProps {
  machine: Machine;
}

export const MachineCard: React.FC<MachineCardProps> = ({ machine }) => {
  // Gradient border based on alert status matching project theme
  const getGradientBorder = (status: Machine['status']) => {
    switch (status) {
      case 'critical':
        return 'from-rose-500 via-rose-950/40 to-transparent hover:from-rose-400 hover:via-rose-900/60 shadow-[0_0_15px_rgba(244,63,94,0.15)]';
      case 'warning':
        return 'from-amber-500 via-amber-950/40 to-transparent hover:from-amber-400 hover:via-amber-900/60 shadow-[0_0_15px_rgba(245,158,11,0.15)]';
      case 'running':
        return 'from-emerald-500 via-emerald-950/40 to-transparent hover:from-emerald-400 hover:via-emerald-900/60 shadow-[0_0_15px_rgba(16,185,129,0.15)]';
      default:
        return 'from-zinc-500 via-zinc-900/40 to-transparent hover:from-zinc-400';
    }
  };

  const statusGradient = getGradientBorder(machine.status);

  // Clean name without machine codes
  const cleanName = machine.name.replace(/\s*\([A-Z0-9-]+\)\s*/gi, '').trim();

  return (
    <div className={`rounded-2xl p-[1px] bg-gradient-to-br ${statusGradient} transition-all duration-300 group`}>
      <div className="bg-[#151619] rounded-[15px] p-4 flex flex-col justify-between h-full gap-3">
        {/* Name & Status Indicator */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-mono text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
            {cleanName}
          </h3>
          <span
            className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
              machine.status === 'critical'
                ? 'bg-rose-500 animate-ping'
                : machine.status === 'warning'
                ? 'bg-amber-400'
                : machine.status === 'running'
                ? 'bg-emerald-400'
                : 'bg-zinc-500'
            }`}
          />
        </div>

        {/* Health Index & Runtime Hours */}
        <div className="grid grid-cols-2 gap-2 bg-[#0f1012] p-2.5 rounded-xl border border-zinc-800/80 font-mono text-xs">
          <div>
            <span className="text-[9px] text-zinc-500 block uppercase font-bold flex items-center gap-1">
              <Gauge className="w-2.5 h-2.5 text-cyan-400" />
              HEALTH INDEX
            </span>
            <span
              className={`text-sm font-bold mt-0.5 block ${
                machine.healthScore < 70
                  ? 'text-rose-400'
                  : machine.healthScore < 85
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {machine.healthScore}%
            </span>
          </div>

          <div>
            <span className="text-[9px] text-zinc-500 block uppercase font-bold flex items-center gap-1">
              <Clock className="w-2.5 h-2.5 text-zinc-400" />
              RUNTIME
            </span>
            <span className="text-sm font-bold text-zinc-200 mt-0.5 block">
              {machine.runtimeHours.toLocaleString()} hrs
            </span>
          </div>
        </div>

        {/* Action Link: Inspect Twin */}
        <Link
          to={`/machines/${machine.id}`}
          className="inline-flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800 hover:border-cyan-500/50 font-mono text-xs font-bold transition-all shadow-sm group/btn"
        >
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-cyan-400 group-hover/btn:scale-110 transition-transform" />
            <span>INSPECT TWIN</span>
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover/btn:translate-x-1 group-hover/btn:text-cyan-400 transition-all" />
        </Link>
      </div>
    </div>
  );
};

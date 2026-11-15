import React from 'react';
import { ShieldCheck, TrendingDown, CheckCircle2, AlertTriangle } from 'lucide-react';

interface HealthOverviewProps {
  healthScore: number;
  delta: number;
}

export const HealthOverview: React.FC<HealthOverviewProps> = ({ healthScore, delta }) => {
  return (
    <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-5 flex flex-col justify-between font-mono">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] text-[#ffb4ab] uppercase font-bold tracking-wider">
            PLANT OVERALL HEALTH INDEX
          </span>
          <h3 className="text-sm font-bold text-white mt-0.5">FLEET RELIABILITY COEFFICIENT</h3>
        </div>
        <div className="p-2 rounded-xl bg-[#121315] border border-[#292a2c]">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
        </div>
      </div>

      <div className="my-4 flex items-baseline gap-3">
        <span className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
          {healthScore.toFixed(1)}%
        </span>
        <span
          className={`flex items-center text-xs font-bold ${
            delta < 0 ? 'text-rose-400' : 'text-emerald-400'
          }`}
        >
          {delta < 0 ? <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> : '+'}
          {delta}% vs last shift
        </span>
      </div>

      {/* Progress Arc / Bar */}
      <div className="w-full bg-[#121315] h-2.5 rounded-full overflow-hidden border border-[#292a2c]">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-[#d71920]"
          style={{ width: `${healthScore}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-[#a1a1aa]">
        <span className="flex items-center gap-1 text-emerald-400">
          <CheckCircle2 className="w-3 h-3" /> 9 Units Within Bounds
        </span>
        <span className="flex items-center gap-1 text-rose-400">
          <AlertTriangle className="w-3 h-3" /> 3 Units Under Stress
        </span>
      </div>
    </div>
  );
};

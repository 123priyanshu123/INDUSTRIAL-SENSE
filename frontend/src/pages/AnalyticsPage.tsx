import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { HistoricalTrendChart } from '../components/analytics/HistoricalTrendChart';
import { GENERATE_SERIES_DATA } from '../data/mockData';
import { MACHINE_REGISTRY } from '../data/machineRegistry';
import { LineChart, BarChart3, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const trendData = GENERATE_SERIES_DATA(40);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="ADVANCED TELEMETRY ANALYTICS & TRENDS"
        description="Historical cross-correlation of acoustic vibrations, thermal gradients, and line pressure excursions."
        badge="HISTORICAL LOG"
      />

      {/* Main Multi-Metric Correlation Trend */}
      <HistoricalTrendChart data={trendData} />

      {/* Fleet Comparison & Availability Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono">
        {/* Availability & Uptime Bar */}
        <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#ffb4ab]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                FLEET UPTIME & RELIABILITY AVAILABILITY
              </h3>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              98.2% MEAN AVAILABILITY
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {MACHINE_REGISTRY.slice(0, 5).map((m) => (
              <div key={m.id} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-bold">{m.name}</span>
                  <span className={m.healthScore < 80 ? 'text-amber-400' : 'text-emerald-400'}>
                    {m.healthScore}% Availability
                  </span>
                </div>
                <div className="w-full bg-[#121315] h-2 rounded-full overflow-hidden border border-[#292a2c]">
                  <div
                    className={`h-full ${m.healthScore < 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${m.healthScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Anomaly Distribution by Category */}
        <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  ANOMALY DISTRIBUTION BY SENSOR
                </h3>
              </div>
              <span className="text-[10px] text-[#a1a1aa]">30-DAY WINDOW</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center my-4">
              <div className="bg-[#121315] p-3 rounded-xl border border-cyan-500/30">
                <span className="text-2xl font-bold text-cyan-400 block">58%</span>
                <span className="text-[10px] text-[#a1a1aa] uppercase mt-1 block">Acoustic / Sound</span>
                <span className="text-[9px] text-zinc-500">Cavitation & Fluting</span>
              </div>
              <div className="bg-[#121315] p-3 rounded-xl border border-rose-500/30">
                <span className="text-2xl font-bold text-rose-400 block">29%</span>
                <span className="text-[10px] text-[#a1a1aa] uppercase mt-1 block">Thermal / RTD</span>
                <span className="text-[9px] text-zinc-500">Bearing Friction</span>
              </div>
              <div className="bg-[#121315] p-3 rounded-xl border border-amber-500/30">
                <span className="text-2xl font-bold text-amber-400 block">13%</span>
                <span className="text-[10px] text-[#a1a1aa] uppercase mt-1 block">Pressure</span>
                <span className="text-[9px] text-zinc-500">Line Blockages</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#292a2c] text-xs text-[#a1a1aa] font-sans">
            Acoustic micro-vibrations precede thermal runaway excursions by an average of 14 operating hours.
          </div>
        </div>
      </div>
    </div>
  );
};

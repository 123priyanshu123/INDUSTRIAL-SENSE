import React from 'react';
import { Volume2, Thermometer, Gauge, CheckCircle2, AlertTriangle } from 'lucide-react';
import { DashboardOverview } from '../../types/api';

interface SensorOverviewProps {
  stats: DashboardOverview['sensorStats'];
}

export const SensorOverview: React.FC<SensorOverviewProps> = ({ stats }) => {
  const sensorGroups = [
    {
      title: 'SOUND & ACOUSTICS',
      icon: Volume2,
      color: 'text-cyan-400',
      data: stats.sound,
      desc: 'Piezoelectric microphones',
    },
    {
      title: 'TEMPERATURE & THERMAL',
      icon: Thermometer,
      color: 'text-rose-400',
      data: stats.temperature,
      desc: 'PT100 RTD resistance probes',
    },
    {
      title: 'PRESSURE & TRANSDUCERS',
      icon: Gauge,
      color: 'text-amber-400',
      data: stats.pressure,
      desc: 'Ceramic piezoresistive cells',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
      {sensorGroups.map((grp, idx) => {
        const Icon = grp.icon;
        return (
          <div
            key={idx}
            className="bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-4 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${grp.color}`} />
                <h4 className="text-xs font-bold text-white uppercase">{grp.title}</h4>
              </div>
              <span className="text-[10px] text-[#22c55e] font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                {grp.data.online} ONLINE
              </span>
            </div>

            <p className="text-[11px] text-[#a1a1aa] font-sans my-2">{grp.desc}</p>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-[#292a2c]">
              <span className="text-amber-400 font-bold">{grp.data.warning} Warnings</span>
              <span className="text-rose-400 font-bold">{grp.data.critical} Critical</span>
              <span className="text-zinc-500 font-bold">{grp.data.offline} Offline</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

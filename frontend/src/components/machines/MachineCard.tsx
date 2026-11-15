import React from 'react';
import { Link } from 'react-router-dom';
import { Machine } from '../../types/machine';
import { getStatusColor } from '../../utils/machineStatus';
import { Volume2, Thermometer, Gauge, ChevronRight, PlayCircle, ShieldCheck } from 'lucide-react';

interface MachineCardProps {
  machine: Machine;
}

export const MachineCard: React.FC<MachineCardProps> = ({ machine }) => {
  const statusConfig = getStatusColor(machine.status);

  return (
    <div className="bg-[#1b1c1e] border border-[#292a2c] hover:border-[#d71920]/60 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_4px_24px_rgba(0,0,0,0.6)] group">
      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
              <span className="font-mono text-[11px] font-bold text-[#ffb4ab]">
                {machine.code}
              </span>
            </div>
            <h3 className="font-mono text-base font-bold text-white group-hover:text-[#ffdad6] transition-colors mt-1 line-clamp-1">
              {machine.name}
            </h3>
          </div>

          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
            {machine.status.toUpperCase()}
          </span>
        </div>

        {/* Sector and Category Tag */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          <span className="px-2 py-0.5 rounded bg-[#121315] border border-[#292a2c] text-[10px] font-mono text-[#a1a1aa]">
            {machine.category}
          </span>
          <span className="px-2 py-0.5 rounded bg-[#121315] border border-[#292a2c] text-[10px] font-mono text-[#a1a1aa]">
            {machine.industry.split('&')[0]}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-[#a1a1aa] line-clamp-2 mb-4 font-sans">
          {machine.description}
        </p>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 gap-2 bg-[#121315] p-2.5 rounded-xl border border-[#292a2c] mb-4 font-mono text-xs">
          <div>
            <span className="text-[9px] text-[#a1a1aa] block uppercase">HEALTH INDEX</span>
            <div className="flex items-center gap-1.5 font-bold mt-0.5">
              <span className={machine.healthScore < 70 ? 'text-rose-400' : machine.healthScore < 85 ? 'text-amber-400' : 'text-emerald-400'}>
                {machine.healthScore}%
              </span>
              <div className="flex-1 bg-[#292a2c] h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    machine.healthScore < 70 ? 'bg-rose-500' : machine.healthScore < 85 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${machine.healthScore}%` }}
                />
              </div>
            </div>
          </div>

          <div>
            <span className="text-[9px] text-[#a1a1aa] block uppercase">RUNTIME</span>
            <span className="font-bold text-white mt-0.5 block">{machine.runtimeHours.toLocaleString()} hrs</span>
          </div>
        </div>
      </div>

      {/* Footer: Supported Sensor Icons & Action Button */}
      <div className="pt-3 border-t border-[#292a2c] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-[#a1a1aa] mr-1">SENSORS:</span>
          {machine.supportedSensors.includes('sound') && (
            <span className="p-1 rounded bg-[#121315] border border-[#292a2c] text-cyan-400" title="Sound Mic Installed">
              <Volume2 className="w-3.5 h-3.5" />
            </span>
          )}
          {machine.supportedSensors.includes('temperature') && (
            <span className="p-1 rounded bg-[#121315] border border-[#292a2c] text-rose-400" title="Temperature RTD Installed">
              <Thermometer className="w-3.5 h-3.5" />
            </span>
          )}
          {machine.supportedSensors.includes('pressure') && (
            <span className="p-1 rounded bg-[#121315] border border-[#292a2c] text-amber-400" title="Pressure Transducer Installed">
              <Gauge className="w-3.5 h-3.5" />
            </span>
          )}
        </div>

        <Link
          to={`/machines/${machine.id}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#292a2c] hover:bg-[#d71920] text-white font-mono text-xs font-bold transition-all group-hover:shadow-md"
        >
          <span>INSPECT TWIN</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

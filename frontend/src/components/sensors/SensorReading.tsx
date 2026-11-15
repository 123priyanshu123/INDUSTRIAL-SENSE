import React from 'react';
import { SensorState, SensorType } from '../../types/sensor';
import { getSensorStateBadge } from '../../utils/sensorThresholds';
import { formatReading } from '../../utils/formatReading';
import { formatTimestamp } from '../../utils/dateUtils';
import { Volume2, Thermometer, Gauge, Clock } from 'lucide-react';

interface SensorReadingProps {
  type: SensorType;
  value: number | null | undefined;
  unit: string;
  timestamp: string;
  state: SensorState;
  label?: string;
  subtext?: string;
}

export const SensorReading: React.FC<SensorReadingProps> = ({
  type,
  value,
  unit,
  timestamp,
  state,
  label,
  subtext,
}) => {
  const badge = getSensorStateBadge(state);

  const getIcon = () => {
    switch (type) {
      case 'sound':
        return <Volume2 className="w-5 h-5 text-cyan-400" />;
      case 'temperature':
        return <Thermometer className="w-5 h-5 text-rose-400" />;
      case 'pressure':
        return <Gauge className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-xl p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#121315] border border-[#292a2c]">
            {getIcon()}
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold text-[#e3e2e5] uppercase tracking-wider">
              {label || `${type.toUpperCase()} SENSOR`}
            </h4>
            <div className="flex items-center gap-1 text-[10px] text-[#a1a1aa] font-mono mt-0.5">
              <Clock className="w-2.5 h-2.5" />
              <span>{formatTimestamp(timestamp)}</span>
            </div>
          </div>
        </div>

        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${badge.color}`}>
          {badge.label}
        </span>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-mono font-bold text-white tracking-tight">
            {formatReading(value, '', type === 'pressure' ? 2 : 1)}
          </span>
          <span className="text-sm font-mono text-[#a1a1aa] font-semibold">{unit}</span>
        </div>
        {subtext && <span className="text-xs font-mono text-[#ffdad6]">{subtext}</span>}
      </div>
    </div>
  );
};

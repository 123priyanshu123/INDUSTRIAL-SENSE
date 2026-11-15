import React from 'react';
import { SensorReading as SensorReadingType, SensorThresholds } from '../../types/sensor';
import { SensorReading } from './SensorReading';
import { SensorThreshold } from './SensorThreshold';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Gauge, CheckCircle2, AlertCircle } from 'lucide-react';

interface PressureSensorPanelProps {
  reading: SensorReadingType | null;
  historyData: any[];
  thresholds: SensorThresholds;
}

export const PressureSensorPanel: React.FC<PressureSensorPanelProps> = ({
  reading,
  historyData,
  thresholds,
}) => {
  const currentValue = reading?.value ?? 4.75;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SensorReading
          type="pressure"
          value={currentValue}
          unit={reading?.unit || 'bar'}
          timestamp={reading?.timestamp || new Date().toISOString()}
          state={reading?.state || 'online'}
          label="DISCHARGE LINE PIEZORESISTIVE TRANSDUCER"
          subtext="TARGET: 4.80 bar ±0.3"
        />

        <SensorThreshold
          currentValue={currentValue}
          thresholds={thresholds}
          unit={reading?.unit || 'bar'}
        />
      </div>

      {/* Hydraulic / Pneumatic Differential Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
        <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-xl p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#a1a1aa] uppercase">DIFFERENTIAL HEAD PRESSURE</span>
            <div className="text-xl font-bold text-white mt-0.5">3.42 bar (ΔP)</div>
          </div>
          <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
            NOMINAL
          </span>
        </div>

        <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-xl p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#a1a1aa] uppercase">SUCTION NET POSITIVE HEAD (NPSHa)</span>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">6.8 meters</div>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>
      </div>

      {/* Historical Pressure Curve */}
      <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-xl p-4 font-mono">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              LINE PRESSURE DYNAMICS (BAR)
            </h4>
          </div>
          <span className="text-[10px] text-[#a1a1aa]">RELIEF VALVE SETTING: 10.5 bar</span>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData}>
              <defs>
                <linearGradient id="pressureGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#5d3f3c" tick={{ fill: '#a1a1aa', fontSize: 10 }} />
              <YAxis stroke="#5d3f3c" tick={{ fill: '#a1a1aa', fontSize: 10 }} domain={['dataMin - 0.5', 'dataMax + 0.5']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#121315', borderColor: '#38393b', borderRadius: '8px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="pressure" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#pressureGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

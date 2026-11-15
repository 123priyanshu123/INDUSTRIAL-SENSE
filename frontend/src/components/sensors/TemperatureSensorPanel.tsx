import React from 'react';
import { SensorReading as SensorReadingType, SensorThresholds } from '../../types/sensor';
import { SensorReading } from './SensorReading';
import { SensorThreshold } from './SensorThreshold';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { Thermometer, TrendingUp, ShieldAlert } from 'lucide-react';

interface TemperatureSensorPanelProps {
  reading: SensorReadingType | null;
  historyData: any[];
  thresholds: SensorThresholds;
}

export const TemperatureSensorPanel: React.FC<TemperatureSensorPanelProps> = ({
  reading,
  historyData,
  thresholds,
}) => {
  const currentValue = reading?.value ?? 58.2;
  const rateOfChange = reading?.rateOfChange ?? 0.15; // °C/min

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SensorReading
          type="temperature"
          value={currentValue}
          unit={reading?.unit || '°C'}
          timestamp={reading?.timestamp || new Date().toISOString()}
          state={reading?.state || 'online'}
          label="THRUST BEARING RTD SENSOR"
          subtext={`GRADIENT: +${rateOfChange} °C/min`}
        />

        <SensorThreshold
          currentValue={currentValue}
          thresholds={thresholds}
          unit={reading?.unit || '°C'}
        />
      </div>

      {/* Thermal Gradient & Safety Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
        <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-xl p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#a1a1aa] uppercase">THERMAL GRADIENT</span>
            <div className="text-lg font-bold text-white flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>+{rateOfChange} °C/min</span>
            </div>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">STABLE</span>
        </div>

        <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-xl p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#a1a1aa] uppercase">CRITICAL TRIP MARGIN</span>
            <div className="text-lg font-bold text-white mt-0.5">
              {(thresholds.criticalHigh - currentValue).toFixed(1)} °C
            </div>
          </div>
          <Thermometer className="w-5 h-5 text-rose-400" />
        </div>

        <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-xl p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#a1a1aa] uppercase">LUBE VISCOSITY INDEX</span>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">94.2% OPTIMAL</div>
          </div>
          <ShieldAlert className="w-5 h-5 text-emerald-400" />
        </div>
      </div>

      {/* Historical Temperature Curve */}
      <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-xl p-4 font-mono">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-[#ffb4ab]" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              TEMPERATURE THERMAL HISTORY (°C)
            </h4>
          </div>
          <span className="text-[10px] text-[#a1a1aa]">TRIP LIMIT: {thresholds.criticalHigh} °C</span>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyData}>
              <XAxis dataKey="time" stroke="#5d3f3c" tick={{ fill: '#a1a1aa', fontSize: 10 }} />
              <YAxis stroke="#5d3f3c" tick={{ fill: '#a1a1aa', fontSize: 10 }} domain={['dataMin - 4', 'dataMax + 4']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#121315', borderColor: '#38393b', borderRadius: '8px', color: '#fff' }}
              />
              <Line type="monotone" dataKey="temperature" stroke="#ffb4ab" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

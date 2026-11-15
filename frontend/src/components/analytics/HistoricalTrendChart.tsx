import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { Activity, Calendar, Download } from 'lucide-react';

interface HistoricalTrendChartProps {
  data: any[];
}

export const HistoricalTrendChart: React.FC<HistoricalTrendChartProps> = ({ data }) => {
  const [selectedMetrics, setSelectedMetrics] = useState({
    sound: true,
    temperature: true,
    pressure: true,
    health: false,
  });

  const toggleMetric = (key: keyof typeof selectedMetrics) => {
    setSelectedMetrics(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-5 font-mono">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#d71920]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              MULTI-SENSOR TELEMETRY CORRELATION
            </h3>
          </div>
          <p className="text-xs text-[#a1a1aa] font-sans mt-0.5">
            Cross-referenced acoustic dB, thermal °C, and pressure dynamics.
          </p>
        </div>

        {/* Metric Visibility Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => toggleMetric('sound')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
              selectedMetrics.sound
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                : 'bg-[#121315] text-[#a1a1aa] border-[#292a2c]'
            }`}
          >
            SOUND (dB)
          </button>
          <button
            onClick={() => toggleMetric('temperature')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
              selectedMetrics.temperature
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/50'
                : 'bg-[#121315] text-[#a1a1aa] border-[#292a2c]'
            }`}
          >
            TEMPERATURE (°C)
          </button>
          <button
            onClick={() => toggleMetric('pressure')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
              selectedMetrics.pressure
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                : 'bg-[#121315] text-[#a1a1aa] border-[#292a2c]'
            }`}
          >
            PRESSURE (bar)
          </button>
          <button
            onClick={() => toggleMetric('health')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
              selectedMetrics.health
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                : 'bg-[#121315] text-[#a1a1aa] border-[#292a2c]'
            }`}
          >
            HEALTH INDEX (%)
          </button>
        </div>
      </div>

      {/* Main Multi-Axis Chart */}
      <div className="h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid stroke="#292a2c" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" stroke="#5d3f3c" tick={{ fill: '#a1a1aa', fontSize: 10 }} />
            <YAxis yAxisId="left" stroke="#5d3f3c" tick={{ fill: '#a1a1aa', fontSize: 10 }} />
            <YAxis yAxisId="right" orientation="right" stroke="#5d3f3c" tick={{ fill: '#a1a1aa', fontSize: 10 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#121315', borderColor: '#38393b', borderRadius: '8px', color: '#fff' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Space Mono' }} />

            {selectedMetrics.sound && (
              <Line yAxisId="left" type="monotone" dataKey="sound" stroke="#06b6d4" strokeWidth={2} name="Sound Level (dB)" dot={false} />
            )}
            {selectedMetrics.temperature && (
              <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#ffb4ab" strokeWidth={2} name="Temperature (°C)" dot={false} />
            )}
            {selectedMetrics.pressure && (
              <Line yAxisId="right" type="monotone" dataKey="pressure" stroke="#f59e0b" strokeWidth={2} name="Pressure (bar)" dot={false} />
            )}
            {selectedMetrics.health && (
              <Bar yAxisId="left" dataKey="healthIndex" fill="#22c55e" opacity={0.3} name="Health Score (%)" />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

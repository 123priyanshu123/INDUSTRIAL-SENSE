import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { AIInsightPanel } from '../components/ai-insights/AIInsightPanel';
import { MOCK_ANOMALIES } from '../data/mockData';
import { BrainCircuit, ShieldAlert, Sparkles, Filter, CheckCircle2 } from 'lucide-react';

export const AIInsightsPage: React.FC = () => {
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'warning' | 'critical'>('ALL');
  const [sensorFilter, setSensorFilter] = useState<string>('ALL');

  const filteredAnomalies = MOCK_ANOMALIES.filter((a) => {
    const matchesSev = severityFilter === 'ALL' || a.severity === severityFilter;
    const matchesSensor = sensorFilter === 'ALL' || a.sensorType === sensorFilter;
    return matchesSev && matchesSensor;
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="AI ANOMALY INTELLIGENCE & RUL PROGNOSTICS"
        description="Edge autoencoder and spectral decomposition models evaluating operational signatures against baseline mechanical models."
        badge="EDGE AI v4.2"
      />

      {/* RUL Overview Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#ffb4ab] uppercase font-bold">CRITICAL TRIP RISK</span>
            <div className="text-2xl font-bold text-rose-400 mt-1">MCH-MTR-01 (48h RUL)</div>
            <p className="text-xs text-[#a1a1aa] font-sans mt-0.5">Rapid bearing thermal degradation</p>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#ffb4ab] uppercase font-bold">MODELS IN INFERENCE</span>
            <div className="text-2xl font-bold text-white mt-1">4 Neural Architectures</div>
            <p className="text-xs text-[#a1a1aa] font-sans mt-0.5">Spectral FFT + Wavelet + Autoencoder</p>
          </div>
          <div className="p-3 rounded-xl bg-[#121315] border border-[#292a2c] text-[#06b6d4]">
            <BrainCircuit className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#ffb4ab] uppercase font-bold">PROGNOSTIC PRECISION</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">94.8% F1 Score</div>
            <p className="text-xs text-[#a1a1aa] font-sans mt-0.5">Zero false negative bearing trips</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-4 flex items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#a1a1aa]" />
          <span className="text-[10px] text-[#a1a1aa] uppercase font-bold">FILTER ANOMALIES:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Severity Pills */}
          <div className="flex items-center bg-[#121315] p-1 rounded-xl border border-[#292a2c]">
            {(['ALL', 'critical', 'warning'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1 rounded-lg uppercase font-bold transition-all ${
                  severityFilter === sev
                    ? 'bg-[#343537] text-white shadow-sm'
                    : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Sensor Dropdown */}
          <select
            value={sensorFilter}
            onChange={(e) => setSensorFilter(e.target.value)}
            className="bg-[#121315] border border-[#292a2c] text-white font-bold rounded-xl px-3 py-1.5 outline-none cursor-pointer text-xs"
          >
            <option value="ALL" className="bg-[#1b1c1e]">All Sensors</option>
            <option value="sound" className="bg-[#1b1c1e]">Sound (dB)</option>
            <option value="temperature" className="bg-[#1b1c1e]">Temperature (°C)</option>
            <option value="pressure" className="bg-[#1b1c1e]">Pressure (bar)</option>
          </select>
        </div>
      </div>

      {/* Anomaly Records Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAnomalies.map((anomaly) => (
          <AIInsightPanel key={anomaly.id} anomaly={anomaly} />
        ))}
      </div>
    </div>
  );
};

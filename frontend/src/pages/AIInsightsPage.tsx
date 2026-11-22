import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { AIInsightPanel } from '../components/ai-insights/AIInsightPanel';
import { ModelDiagnosticDashboard } from '../components/ai-insights/ModelDiagnosticDashboard';
import { MOCK_ANOMALIES } from '../data/mockData';
import { MAFAULDA_MODEL_METADATA } from '../data/modelMetadata';
import { BrainCircuit, ShieldAlert, Sparkles, Filter, CheckCircle2, Award, Zap } from 'lucide-react';

export const AIInsightsPage: React.FC = () => {
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'warning' | 'critical'>('ALL');
  const [sensorFilter, setSensorFilter] = useState<string>('ALL');

  const filteredAnomalies = MOCK_ANOMALIES.filter((a) => {
    const matchesSev = severityFilter === 'ALL' || a.severity === severityFilter;
    const matchesSensor = sensorFilter === 'ALL' || a.sensorType === sensorFilter;
    return matchesSev && matchesSensor;
  });

  const { metrics, anomaly_threshold_mse } = MAFAULDA_MODEL_METADATA;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="AI ANOMALY INTELLIGENCE & RUL PROGNOSTICS"
        description="Edge autoencoder and multimodal spectral decomposition models evaluating real-time operational signatures against baseline mechanical models."
        badge={`EDGE AI ${MAFAULDA_MODEL_METADATA.model_version}`}
      />

      {/* RUL Overview Stats Banner (Calibrated with MAFAULDA Model Metadata) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#ffb4ab] uppercase font-bold">CRITICAL TRIP RISK</span>
            <div className="text-xl font-bold text-rose-400 mt-1">5-Axis CNC Milling (18h RUL)</div>
            <p className="text-[11px] text-[#a1a1aa] font-sans mt-0.5">sample_imbalance.csv (13.5% Health)</p>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-cyan-400 uppercase font-bold">MODEL ROC-AUC</span>
            <div className="text-xl font-bold text-cyan-300 mt-1">{metrics.roc_auc} AUC</div>
            <p className="text-[11px] text-[#a1a1aa] font-sans mt-0.5">MAFAULDA 42-Dim Autoencoder</p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#121315] border border-[#292a2c] text-[#06b6d4]">
            <BrainCircuit className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-emerald-400 uppercase font-bold">FAULT RECALL (SENSITIVITY)</span>
            <div className="text-xl font-bold text-emerald-400 mt-1">{(metrics.recall * 100).toFixed(1)}% Recall</div>
            <p className="text-[11px] text-[#a1a1aa] font-sans mt-0.5">0 False Negatives on Test Set</p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-amber-400 uppercase font-bold">CALIBRATED THRESHOLD</span>
            <div className="text-xl font-bold text-amber-300 mt-1">{anomaly_threshold_mse.toFixed(4)} MSE</div>
            <p className="text-[11px] text-[#a1a1aa] font-sans mt-0.5">F1-Score: {(metrics.f1_score * 100).toFixed(2)}%</p>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Interactive Model Diagnostic Dashboard (Inspection + 3 Evaluation Plots + 42 Features) */}
      <ModelDiagnosticDashboard />

      {/* Filter Bar */}
      <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-4 flex items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#a1a1aa]" />
          <span className="text-[10px] text-[#a1a1aa] uppercase font-bold">FLEET ANOMALY FEED:</span>
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
            <option value="sound" className="bg-[#1b1c1e]">Sound / Acoustic (MFCC)</option>
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

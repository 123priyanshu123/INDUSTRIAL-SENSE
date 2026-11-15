import React from 'react';
import { AnomalyRecord } from '../../types/alert';
import { BrainCircuit, Cpu, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatTimestamp } from '../../utils/dateUtils';
import { Link } from 'react-router-dom';

interface AIInsightPanelProps {
  anomaly: AnomalyRecord;
}

export const AIInsightPanel: React.FC<AIInsightPanelProps> = ({ anomaly }) => {
  const isCrit = anomaly.severity === 'critical';

  return (
    <div
      className={`bg-[#1b1c1e] border rounded-2xl p-5 font-mono flex flex-col justify-between transition-all ${
        isCrit ? 'border-rose-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)]' : 'border-amber-500/40'
      }`}
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#121315] border border-[#292a2c]">
              <BrainCircuit className="w-5 h-5 text-[#ffb4ab]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{anomaly.machineCode}</span>
                <span className="text-xs text-[#a1a1aa]">•</span>
                <span className="text-[10px] text-[#ffdad6] uppercase">{anomaly.sensorType} SENSOR</span>
              </div>
              <h3 className="text-sm font-bold text-white font-sans mt-0.5">{anomaly.machineName}</h3>
            </div>
          </div>

          <span
            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase border ${
              isCrit ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
            }`}
          >
            {anomaly.severity} • SCORE: {anomaly.anomalyScore.toFixed(2)}
          </span>
        </div>

        {/* Confidence & Model Header */}
        <div className="grid grid-cols-3 gap-2 bg-[#121315] p-3 rounded-xl border border-[#292a2c] mb-4 text-xs">
          <div>
            <span className="text-[9px] text-[#a1a1aa] block uppercase">MODEL CONFIDENCE</span>
            <span className="text-emerald-400 font-bold mt-0.5 block">{anomaly.confidence}%</span>
          </div>
          <div>
            <span className="text-[9px] text-[#a1a1aa] block uppercase">ESTIMATED RUL</span>
            <span className="text-white font-bold mt-0.5 block">{anomaly.rulEstimateHours} Hours</span>
          </div>
          <div>
            <span className="text-[9px] text-[#a1a1aa] block uppercase">DETECTION MODEL</span>
            <span className="text-[#06b6d4] font-bold mt-0.5 block truncate">{anomaly.modelVersion}</span>
          </div>
        </div>

        {/* Explanation Evidence */}
        <div className="mb-3">
          <span className="text-[10px] text-[#a1a1aa] uppercase font-bold block mb-1">
            ANOMALY EVIDENCE & TELEMETRY SIGNATURE:
          </span>
          <p className="text-xs text-[#e3e2e5] font-sans leading-relaxed bg-[#121315]/60 p-3 rounded-lg border border-[#292a2c]">
            {anomaly.explanation}
          </p>
        </div>

        {/* Maintenance Recommendation */}
        <div className="mb-4">
          <span className="text-[10px] text-[#ffb4ab] uppercase font-bold block mb-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            RECOMMENDED FIELD ACTION:
          </span>
          <p className="text-xs text-white font-sans leading-relaxed bg-[#292a2c]/50 p-3 rounded-lg border border-[#5d3f3c]">
            {anomaly.recommendation}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-[#292a2c] flex items-center justify-between text-[11px] text-[#a1a1aa]">
        <span>Detected: {formatTimestamp(anomaly.detectionTime)}</span>
        <Link
          to={`/machines/${anomaly.machineId}`}
          className="inline-flex items-center gap-1 text-[#ffb4ab] hover:text-white font-bold"
        >
          <span>INSPECT TWIN</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

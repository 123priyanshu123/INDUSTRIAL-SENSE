import React, { useState } from 'react';
import {
  MAFAULDA_MODEL_METADATA,
  SAMPLE_IMBALANCE_INFERENCE,
  SAMPLE_HEALTHY_INFERENCE,
  SampleInference,
} from '../../data/modelMetadata';
import {
  BrainCircuit,
  Activity,
  Layers,
  BarChart2,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Gauge,
  Sliders,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const ModelDiagnosticDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inference' | 'evaluation' | 'features'>('inference');
  const [selectedSample, setSelectedSample] = useState<SampleInference>(SAMPLE_IMBALANCE_INFERENCE);

  const { metrics, confusion_matrix, fault_distributions, anomaly_threshold_mse } = MAFAULDA_MODEL_METADATA;

  return (
    <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-5 font-mono flex flex-col gap-5">
      {/* Top Banner with Model Version & Key Badges */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#292a2c]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {MAFAULDA_MODEL_METADATA.model_name}
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                {MAFAULDA_MODEL_METADATA.model_version}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#121315] text-zinc-400 border border-zinc-700 text-[10px]">
                MAFAULDA DATASET
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              42-Dimensional Multimodal Signal Processing + PyTorch Deep Autoencoder [42 &rarr; 12 &rarr; 42]
            </p>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-1.5 bg-[#121315] p-1 rounded-xl border border-[#292a2c] text-xs">
          <button
            onClick={() => setActiveTab('inference')}
            className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-all flex items-center gap-1.5 ${
              activeTab === 'inference'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Live Inference Sample</span>
          </button>
          <button
            onClick={() => setActiveTab('evaluation')}
            className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-all flex items-center gap-1.5 ${
              activeTab === 'evaluation'
                ? 'bg-[#343537] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Benchmark Diagnostics</span>
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-all flex items-center gap-1.5 ${
              activeTab === 'features'
                ? 'bg-[#343537] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>42-Feature Space</span>
          </button>
        </div>
      </div>

      {/* TAB 1: LIVE INFERENCE SAMPLE (sample_imbalance.csv) */}
      {activeTab === 'inference' && (
        <div className="flex flex-col gap-4">
          {/* Sample Selector Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#121315] p-3 rounded-xl border border-[#292a2c] text-xs">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
              <span className="text-zinc-400 font-bold uppercase text-[10px]">RECORDING INGESTION:</span>
              <span className="text-white font-bold">{selectedSample.filename}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500 uppercase">LOAD PRESET:</span>
              <button
                onClick={() => setSelectedSample(SAMPLE_IMBALANCE_INFERENCE)}
                className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase border transition-all ${
                  selectedSample.filename === 'sample_imbalance.csv'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
                }`}
              >
                sample_imbalance.csv (Anomaly)
              </button>
              <button
                onClick={() => setSelectedSample(SAMPLE_HEALTHY_INFERENCE)}
                className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase border transition-all ${
                  selectedSample.filename === 'normal_sample_1s.csv'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
                }`}
              >
                normal_sample_1s.csv (Healthy)
              </button>
            </div>
          </div>

          {/* Inference Telemetry Highlights (4 Key Metrics) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Status */}
            <div className={`p-4 rounded-xl border ${
              selectedSample.is_anomaly
                ? 'bg-rose-950/20 border-rose-500/40'
                : 'bg-emerald-950/20 border-emerald-500/40'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-zinc-400 uppercase font-bold">STATUS</span>
                <span className={`w-2 h-2 rounded-full animate-ping ${
                  selectedSample.is_anomaly ? 'bg-rose-500' : 'bg-emerald-500'
                }`} />
              </div>
              <div className={`text-base md:text-lg font-bold mt-1 ${
                selectedSample.is_anomaly ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {selectedSample.status}
              </div>
              <p className="text-[10px] text-zinc-400 font-sans mt-0.5">{selectedSample.fault_type}</p>
            </div>

            {/* Health Index */}
            <div className="bg-[#121315] p-4 rounded-xl border border-[#292a2c]">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-zinc-400 uppercase font-bold">HEALTH INDEX</span>
                <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className={`text-xl md:text-2xl font-bold mt-1 ${
                selectedSample.health_index < 25
                  ? 'text-rose-400'
                  : selectedSample.health_index < 70
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}>
                {selectedSample.health_index.toFixed(1)} <span className="text-xs text-zinc-500 font-normal">/ 100</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div
                  className={`h-full ${
                    selectedSample.health_index < 25
                      ? 'bg-rose-500'
                      : selectedSample.health_index < 70
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${selectedSample.health_index}%` }}
                />
              </div>
            </div>

            {/* Reconstruction MSE Score vs Threshold */}
            <div className="bg-[#121315] p-4 rounded-xl border border-[#292a2c]">
              <span className="text-[9px] text-zinc-400 uppercase font-bold block">RECONSTRUCTION MSE</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className={`text-xl md:text-2xl font-bold ${
                  selectedSample.anomaly_score > selectedSample.threshold ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {selectedSample.anomaly_score.toFixed(4)}
                </span>
                <span className="text-[10px] text-zinc-500">vs {selectedSample.threshold}</span>
              </div>
              <span className="text-[10px] text-zinc-400 mt-1 block">
                {selectedSample.anomaly_score > selectedSample.threshold
                  ? `${((selectedSample.anomaly_score / selectedSample.threshold) * 100 - 100).toFixed(0)}% OVER THRESHOLD`
                  : 'BELOW BASELINE (OK)'}
              </span>
            </div>

            {/* Estimated RPM */}
            <div className="bg-[#121315] p-4 rounded-xl border border-[#292a2c]">
              <span className="text-[9px] text-zinc-400 uppercase font-bold block">ESTIMATED ROTOR RPM</span>
              <div className="text-xl md:text-2xl font-bold text-cyan-400 mt-1">
                {selectedSample.estimated_rpm.toFixed(1)} <span className="text-xs text-zinc-500">RPM</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-sans mt-0.5 block">
                Derived via tachometer pulse zero-crossing
              </span>
            </div>
          </div>

          {/* Dual Panel: Top Contributing Features & Window Score Progression */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Contributing Features */}
            <div className="bg-[#121315] p-4 rounded-xl border border-[#292a2c]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-white font-bold uppercase flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  TOP CONTRIBUTING ERROR FEATURES
                </span>
                <span className="text-[10px] text-zinc-400">MSE RESIDUAL</span>
              </div>

              <div className="flex flex-col gap-2.5">
                {selectedSample.top_contributing_features.map((item, idx) => {
                  const maxErr = selectedSample.top_contributing_features[0].error || 1;
                  const pct = Math.min(100, Math.round((item.error / maxErr) * 100));
                  return (
                    <div key={idx} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-300 font-bold">{item.feature}</span>
                        <span className={item.error > 0.5 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                          +{item.error.toFixed(3)}
                        </span>
                      </div>
                      <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            item.error > 0.5
                              ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-[11px] text-zinc-400 font-sans mt-3 pt-2 border-t border-zinc-800 leading-relaxed">
                <strong className="text-white">Physical Interpretation:</strong> Elevated{' '}
                <code className="text-cyan-300">vib_x_rms</code> combined with impulsive{' '}
                <code className="text-cyan-300">vib_y_kurtosis</code> and acoustic{' '}
                <code className="text-cyan-300">aud_mfcc_1</code> confirms dynamic centrifugal mass imbalance on the
                primary horizontal axis.
              </p>
            </div>

            {/* Sliding Window Reconstruction Progression */}
            <div className="bg-[#121315] p-4 rounded-xl border border-[#292a2c] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-white font-bold uppercase flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                    SLIDING WINDOW TEMPORAL PROGRESSION
                  </span>
                  <span className="text-[10px] text-zinc-400">1.0s WINDOW / 50% HOP</span>
                </div>

                {/* Window Bar visualization */}
                <div className="grid grid-cols-4 gap-2 my-4">
                  {selectedSample.window_scores.map((score, wIdx) => {
                    const isExcursion = score > selectedSample.threshold;
                    return (
                      <div
                        key={wIdx}
                        className={`p-3 rounded-xl border flex flex-col items-center text-center ${
                          isExcursion
                            ? 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                            : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                        }`}
                      >
                        <span className="text-[9px] text-zinc-400 uppercase font-bold">WINDOW {wIdx + 1}</span>
                        <span className="text-base font-bold my-1">{score.toFixed(3)}</span>
                        <span className={`text-[8px] uppercase font-bold px-1.5 py-0.5 rounded ${
                          isExcursion ? 'bg-rose-500/30 text-rose-300' : 'bg-emerald-500/30 text-emerald-300'
                        }`}>
                          {isExcursion ? 'TRIP' : 'NORMAL'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-zinc-900/80 p-3 rounded-lg border border-zinc-800 text-[11px] text-zinc-400 font-sans leading-relaxed">
                <span className="text-white font-bold block mb-1">Health Index Formulation (React SCADA Contract):</span>
                <div className="bg-zinc-950 p-2 rounded border border-zinc-800 font-mono text-cyan-300 text-xs my-1.5 text-center">
                  Health Index = 100 &times; exp(-0.5 &times; (MSE / Threshold))
                </div>
                With calibrated baseline threshold &tau; = {selectedSample.threshold}, reconstruction error {selectedSample.anomaly_score.toFixed(4)} maps
                to Health Index <span className="text-white font-bold">{selectedSample.health_index}%</span>.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BENCHMARK DIAGNOSTICS & EVALUATION SUMMARY (Matching Uploaded Figures) */}
      {activeTab === 'evaluation' && (
        <div className="flex flex-col gap-4">
          {/* Key Metric Highlights Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="bg-[#121315] p-3.5 rounded-xl border border-cyan-500/30">
              <span className="text-[10px] text-zinc-400 uppercase block font-bold">ROC-AUC SCORE</span>
              <span className="text-2xl font-bold text-cyan-400 mt-0.5 block">{metrics.roc_auc}</span>
              <span className="text-[9px] text-zinc-500">Area Under Curve</span>
            </div>
            <div className="bg-[#121315] p-3.5 rounded-xl border border-emerald-500/30">
              <span className="text-[10px] text-zinc-400 uppercase block font-bold">RECALL (SENSITIVITY)</span>
              <span className="text-2xl font-bold text-emerald-400 mt-0.5 block">
                {(metrics.recall * 100).toFixed(1)}%
              </span>
              <span className="text-[9px] text-emerald-500 font-bold">0 False Negatives!</span>
            </div>
            <div className="bg-[#121315] p-3.5 rounded-xl border border-cyan-500/30">
              <span className="text-[10px] text-zinc-400 uppercase block font-bold">PRECISION</span>
              <span className="text-2xl font-bold text-white mt-0.5 block">
                {(metrics.precision * 100).toFixed(2)}%
              </span>
              <span className="text-[9px] text-zinc-500">21 False Positives / 2133</span>
            </div>
            <div className="bg-[#121315] p-3.5 rounded-xl border border-rose-500/30">
              <span className="text-[10px] text-zinc-400 uppercase block font-bold">CALIBRATED THRESHOLD</span>
              <span className="text-2xl font-bold text-rose-400 mt-0.5 block">
                {anomaly_threshold_mse.toFixed(4)}
              </span>
              <span className="text-[9px] text-zinc-500">95th Percentile Baseline</span>
            </div>
          </div>

          {/* Three Evaluation Subplots Matching the Research Paper / Notebook */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Subplot 1: Reconstruction Error by Fault Class (Boxplot Summary) */}
            <div className="bg-[#121315] p-4 rounded-xl border border-[#292a2c] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white uppercase">1. Reconstruction Error by Class</span>
                  <span className="text-[9px] text-rose-400 font-bold">Threshold: 0.1222</span>
                </div>
                <p className="text-[10px] text-zinc-400 font-sans mb-3">
                  Log-scale separation between healthy baselines and fault modes:
                </p>

                <div className="flex flex-col gap-2 font-mono text-xs">
                  {fault_distributions.map((item) => (
                    <div key={item.faultClass} className="flex flex-col gap-0.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-zinc-300 font-sans">{item.label}</span>
                        <span className={item.isAnomaly ? 'text-cyan-400 font-bold' : 'text-emerald-400 font-bold'}>
                          ~{item.median} MSE
                        </span>
                      </div>
                      <div className="relative w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                        {/* Red threshold marker at ~2% of log range */}
                        <div className="absolute top-0 bottom-0 left-[8%] w-0.5 bg-rose-500 z-10" />
                        <div
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: item.color,
                            width: `${Math.min(100, Math.log10(Math.max(item.median, 0.01) * 100) * 22)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-zinc-800 text-[10px] text-zinc-400 font-sans">
                Notice clean separation: Healthy data stays below 0.1222, while bearing faults exceed 1,000+ MSE.
              </div>
            </div>

            {/* Subplot 2: ROC Curve */}
            <div className="bg-[#121315] p-4 rounded-xl border border-[#292a2c] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white uppercase">2. Unsupervised ROC Curve</span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    AUC = {metrics.roc_auc}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 font-sans mb-3">
                  Near-vertical ascent to 1.0 True Positive Rate with minimal False Positives:
                </p>

                {/* SVG Visualized ROC Curve */}
                <div className="w-full aspect-[4/3] bg-zinc-950 rounded-xl border border-zinc-800 p-3 relative flex items-center justify-center">
                  <svg viewBox="0 0 200 160" className="w-full h-full">
                    {/* Grid Lines */}
                    <line x1="30" y1="20" x2="190" y2="20" stroke="#27272a" strokeWidth="0.5" strokeDasharray="2,2" />
                    <line x1="30" y1="60" x2="190" y2="60" stroke="#27272a" strokeWidth="0.5" strokeDasharray="2,2" />
                    <line x1="30" y1="100" x2="190" y2="100" stroke="#27272a" strokeWidth="0.5" strokeDasharray="2,2" />
                    <line x1="30" y1="140" x2="190" y2="140" stroke="#52525b" strokeWidth="1" />
                    <line x1="30" y1="20" x2="30" y2="140" stroke="#52525b" strokeWidth="1" />

                    {/* Diagonal Chance Line */}
                    <line x1="30" y1="140" x2="190" y2="20" stroke="#71717a" strokeWidth="1" strokeDasharray="3,3" />

                    {/* ROC Curve: Sharp near-vertical spike to 1.0 */}
                    <path
                      d="M 30 140 L 33 22 L 190 20"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2.5"
                    />

                    {/* Labels */}
                    <text x="18" y="24" fill="#a1a1aa" fontSize="8" fontFamily="Space Mono">1.0</text>
                    <text x="18" y="80" fill="#a1a1aa" fontSize="8" fontFamily="Space Mono">0.5</text>
                    <text x="18" y="140" fill="#a1a1aa" fontSize="8" fontFamily="Space Mono">0.0</text>
                    <text x="30" y="152" fill="#a1a1aa" fontSize="8" fontFamily="Space Mono">0.0</text>
                    <text x="105" y="152" fill="#a1a1aa" fontSize="8" fontFamily="Space Mono">FPR</text>
                    <text x="180" y="152" fill="#a1a1aa" fontSize="8" fontFamily="Space Mono">1.0</text>
                  </svg>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-zinc-800 text-[10px] text-zinc-400 font-sans">
                True Positive Rate achieves 100% with FPR &lt; 0.0103 across MAFAULDA cross-validation split.
              </div>
            </div>

            {/* Subplot 3: Confusion Matrix (Test Set) */}
            <div className="bg-[#121315] p-4 rounded-xl border border-[#292a2c] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white uppercase">3. Confusion Matrix (Test Set)</span>
                  <span className="text-[10px] text-zinc-400">N = {confusion_matrix.total}</span>
                </div>
                <p className="text-[10px] text-zinc-400 font-sans mb-3">
                  Ground truth vs unsupervised threshold predictions:
                </p>

                {/* Confusion Matrix 2x2 Grid */}
                <div className="grid grid-cols-2 gap-2 text-center font-mono my-2">
                  {/* Top Left: True Healthy */}
                  <div className="bg-sky-950/40 border border-sky-500/30 p-3 rounded-lg flex flex-col justify-center">
                    <span className="text-[9px] text-zinc-400 uppercase font-bold">TRUE HEALTHY (TN)</span>
                    <span className="text-xl font-bold text-sky-300 mt-1">{confusion_matrix.trueHealthy}</span>
                    <span className="text-[8px] text-zinc-500">Correct Normal</span>
                  </div>

                  {/* Top Right: False Anomaly */}
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg flex flex-col justify-center">
                    <span className="text-[9px] text-zinc-400 uppercase font-bold">FALSE ALARM (FP)</span>
                    <span className="text-xl font-bold text-amber-400 mt-1">{confusion_matrix.falseAnomaly}</span>
                    <span className="text-[8px] text-zinc-500">0.98% of tests</span>
                  </div>

                  {/* Bottom Left: False Healthy */}
                  <div className="bg-emerald-950/40 border border-emerald-500/40 p-3 rounded-lg flex flex-col justify-center">
                    <span className="text-[9px] text-zinc-400 uppercase font-bold">MISSED ANOMALY (FN)</span>
                    <span className="text-xl font-bold text-emerald-400 mt-1">{confusion_matrix.falseHealthy}</span>
                    <span className="text-[8px] text-emerald-400 font-bold">ZERO MISSED!</span>
                  </div>

                  {/* Bottom Right: True Anomaly */}
                  <div className="bg-blue-900/40 border border-blue-500/40 p-3 rounded-lg flex flex-col justify-center">
                    <span className="text-[9px] text-zinc-400 uppercase font-bold">TRUE ANOMALY (TP)</span>
                    <span className="text-xl font-bold text-blue-300 mt-1">{confusion_matrix.trueAnomaly}</span>
                    <span className="text-[8px] text-zinc-500">100% Detected</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-zinc-800 text-[10px] text-zinc-400 font-sans">
                Zero false negatives ensure catastrophic mechanical failures are never missed by the edge autoencoder.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 42-FEATURE MULTIMODAL FEATURE SPACE */}
      {activeTab === 'features' && (
        <div className="flex flex-col gap-4">
          <div className="bg-[#121315] p-4 rounded-xl border border-[#292a2c] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white uppercase">
                42-DIMENSIONAL DIGITAL SIGNAL PROCESSING FEATURE MAP
              </span>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                Signals extracted from 50 kHz raw recordings via MafauldaDSP (Resampling, 4th-Order Butterworth Bandpass, STFT, MFCCs):
              </p>
            </div>
            <span className="text-xs text-cyan-400 font-bold bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/30">
              42 TOTAL FEATURES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Vibration X, Y, Z features */}
            {(['vibration_x', 'vibration_y', 'vibration_z'] as const).map((axis) => {
              const label = axis.replace('_', ' ').toUpperCase();
              const feats = MAFAULDA_MODEL_METADATA.feature_domains[axis];
              return (
                <div key={axis} className="bg-[#121315] p-3.5 rounded-xl border border-[#292a2c]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white uppercase">{label} (9 FEATS)</span>
                    <span className="text-[10px] text-cyan-400">10 kHz Filtered</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {feats.map((f) => (
                      <span
                        key={f}
                        className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px]"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Acoustic MFCCs */}
            <div className="bg-[#121315] p-3.5 rounded-xl border border-[#292a2c] md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white uppercase">
                  ACOUSTIC LOG-MEL / MFCC FREQUENCIES (13 FEATS + RMS)
                </span>
                <span className="text-[10px] text-cyan-400">16 kHz Resampled</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {MAFAULDA_MODEL_METADATA.feature_domains.acoustic_mfcc.map((f) => (
                  <span
                    key={f}
                    className="px-2 py-0.5 rounded bg-cyan-950/30 text-cyan-300 border border-cyan-500/30 text-[10px]"
                  >
                    {f}
                  </span>
                ))}
                <span className="px-2 py-0.5 rounded bg-rose-950/30 text-rose-300 border border-rose-500/30 text-[10px]">
                  aud_rms
                </span>
              </div>
            </div>

            {/* Tachometer RPM */}
            <div className="bg-[#121315] p-3.5 rounded-xl border border-[#292a2c]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white uppercase">TACHOMETER</span>
                <span className="text-[10px] text-emerald-400">Pulse Edge</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-950/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                rpm (Estimated Operational Speed)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

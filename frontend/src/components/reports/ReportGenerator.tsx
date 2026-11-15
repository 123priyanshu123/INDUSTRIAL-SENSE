import React, { useState } from 'react';
import { FileSpreadsheet, Download, CheckCircle, FileText, Loader2 } from 'lucide-react';
import { MACHINE_REGISTRY } from '../../data/machineRegistry';
import { useAppStore } from '../../store/appStore';

export const ReportGenerator: React.FC = () => {
  const { addNotification } = useAppStore();
  const [selectedMachine, setSelectedMachine] = useState(MACHINE_REGISTRY[0].id);
  const [period, setPeriod] = useState('7d');
  const [includeSound, setIncludeSound] = useState(true);
  const [includeTemp, setIncludeTemp] = useState(true);
  const [includePressure, setIncludePressure] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<any>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      const targetMachine = MACHINE_REGISTRY.find(m => m.id === selectedMachine);
      setGeneratedReport({
        id: `RPT-${Math.floor(Math.random() * 90000 + 10000)}`,
        machine: targetMachine,
        generatedAt: new Date().toISOString(),
        period,
        sensors: { sound: includeSound, temperature: includeTemp, pressure: includePressure },
        anomaliesCount: targetMachine?.activeAlertCount || 0,
        averageHealth: targetMachine?.healthScore || 90,
      });
      addNotification('success', `Industrial telemetry report compiled for ${targetMachine?.code}`);
    }, 1200);
  };

  const handleDownload = (format: 'PDF' | 'CSV') => {
    addNotification('info', `Downloading ${format} export: ${generatedReport?.id}.${format.toLowerCase()}`);
  };

  return (
    <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-6 font-mono">
      <div className="flex items-center gap-2 mb-4">
        <FileSpreadsheet className="w-5 h-5 text-[#d71920]" />
        <h3 className="text-base font-bold text-white uppercase tracking-wider">
          GENERATE COMPREHENSIVE SHIFT AUDIT REPORT
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Machine Picker */}
        <div>
          <label className="block text-[10px] text-[#a1a1aa] uppercase font-bold mb-1.5">
            SELECT INDUSTRIAL MACHINE:
          </label>
          <select
            value={selectedMachine}
            onChange={(e) => setSelectedMachine(e.target.value)}
            className="w-full bg-[#121315] border border-[#292a2c] focus:border-[#d71920] rounded-xl px-3 py-2 text-xs text-white outline-none"
          >
            {MACHINE_REGISTRY.map((m) => (
              <option key={m.id} value={m.id} className="bg-[#1b1c1e]">
                {m.code} • {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Time Period */}
        <div>
          <label className="block text-[10px] text-[#a1a1aa] uppercase font-bold mb-1.5">
            REPORTING WINDOW:
          </label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full bg-[#121315] border border-[#292a2c] focus:border-[#d71920] rounded-xl px-3 py-2 text-xs text-white outline-none"
          >
            <option value="24h" className="bg-[#1b1c1e]">Last 24 Hours (Current Shift Cycle)</option>
            <option value="7d" className="bg-[#1b1c1e]">Last 7 Days (Weekly Maintenance Review)</option>
            <option value="30d" className="bg-[#1b1c1e]">Last 30 Days (Monthly Reliability Audit)</option>
            <option value="quarter" className="bg-[#1b1c1e]">Quarterly RUL Prognostics</option>
          </select>
        </div>

        {/* Sensor Channels Inclusion */}
        <div>
          <label className="block text-[10px] text-[#a1a1aa] uppercase font-bold mb-1.5">
            SENSOR CHANNELS:
          </label>
          <div className="flex items-center gap-3 pt-1 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-cyan-400">
              <input
                type="checkbox"
                checked={includeSound}
                onChange={(e) => setIncludeSound(e.target.checked)}
                className="rounded accent-[#d71920]"
              />
              <span>Sound</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-rose-400">
              <input
                type="checkbox"
                checked={includeTemp}
                onChange={(e) => setIncludeTemp(e.target.checked)}
                className="rounded accent-[#d71920]"
              />
              <span>Temp</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-amber-400">
              <input
                type="checkbox"
                checked={includePressure}
                onChange={(e) => setIncludePressure(e.target.checked)}
                className="rounded accent-[#d71920]"
              />
              <span>Pressure</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#292a2c]">
        <span className="text-xs text-[#a1a1aa]">
          Includes acoustic spectral logs, thermal runaway gradients, and maintenance recommendations.
        </span>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-5 py-2.5 rounded-xl bg-[#d71920] hover:bg-[#c00014] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(215,25,32,0.4)] disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>COMPILING TELEMETRY...</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              <span>COMPILE REPORT</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Report Preview Card */}
      {generatedReport && (
        <div className="mt-6 bg-[#121315] border border-[#38393b] rounded-xl p-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#292a2c]">
            <div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                REPORT READY • ID: {generatedReport.id}
              </span>
              <h4 className="text-base font-bold text-white mt-0.5">
                {generatedReport.machine?.name} ({generatedReport.machine?.code})
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDownload('PDF')}
                className="px-3 py-1.5 rounded-lg bg-[#292a2c] hover:bg-[#343537] text-white text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-[#ffb4ab]" />
                <span>PDF EXPORT</span>
              </button>
              <button
                onClick={() => handleDownload('CSV')}
                className="px-3 py-1.5 rounded-lg bg-[#292a2c] hover:bg-[#343537] text-white text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>CSV RAW DATA</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-4 text-xs">
            <div>
              <span className="text-[10px] text-[#a1a1aa] uppercase block">AVERAGE HEALTH</span>
              <span className="text-white font-bold text-sm">{generatedReport.averageHealth}%</span>
            </div>
            <div>
              <span className="text-[10px] text-[#a1a1aa] uppercase block">ANOMALIES RECORDED</span>
              <span className="text-amber-400 font-bold text-sm">{generatedReport.anomaliesCount}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#a1a1aa] uppercase block">CHANNELS LOGGED</span>
              <span className="text-cyan-400 font-bold text-sm">
                {[
                  generatedReport.sensors.sound && 'Sound',
                  generatedReport.sensors.temperature && 'Temp',
                  generatedReport.sensors.pressure && 'Pressure',
                ]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#a1a1aa] uppercase block">COMPLIANCE SIGN-OFF</span>
              <span className="text-emerald-400 font-bold text-sm">ISO 10816 CLASS II</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

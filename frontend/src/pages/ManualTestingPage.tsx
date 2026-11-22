import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Upload,
  FileText,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Compass,
  Play,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  ChevronRight,
  Cpu,
  Power,
} from 'lucide-react';
import { MACHINE_REGISTRY } from '../data/machineRegistry';
import { useAppStore } from '../store/appStore';

interface MachineAlertItem {
  id: string;
  name: string;
  zone: string;
  status: 'STOP_REQ' | 'WARNING' | 'NOMINAL';
  alertTitle: string;
  healthScore: number;
  stopped?: boolean;
}

const DEFAULT_MACHINE_ALERTS: MachineAlertItem[] = [
  {
    id: 'mch-pmp-01',
    name: 'Centrifugal Slurry & Cooling Pump',
    zone: 'Zone C (Cooling Yard)',
    status: 'STOP_REQ',
    alertTitle: 'CRITICAL ALERT: Severe vibration and acoustic cavitation. Immediate motor stop required.',
    healthScore: 13.5,
    stopped: false,
  },
  {
    id: 'mch-cnc-01',
    name: '5-Axis CNC Milling Machine',
    zone: 'Zone A (Machining Bay)',
    status: 'WARNING',
    alertTitle: 'WARNING ALERT: Spindle bearing vibration and heat elevation detected.',
    healthScore: 78.0,
    stopped: false,
  },
  {
    id: 'mch-hyd-01',
    name: '600-Tonne Hydraulic Deep-Draw Press',
    zone: 'Zone A (Press Bay)',
    status: 'STOP_REQ',
    alertTitle: 'CRITICAL ALERT: Cylinder pressure anomaly exceeding safety limits.',
    healthScore: 28.0,
    stopped: false,
  },
  {
    id: 'mch-cnc-02',
    name: 'Twin-Spindle Lathe Unit',
    zone: 'Zone A (Precision Lathes)',
    status: 'NOMINAL',
    alertTitle: 'NOMINAL STATUS: Operating safely within normal parameters.',
    healthScore: 96.0,
    stopped: false,
  },
  {
    id: 'mch-asrs-19',
    name: 'Automated High-Bay Storage & Retrieval System',
    zone: 'Zone B (Logistics Bay)',
    status: 'NOMINAL',
    alertTitle: 'NOMINAL STATUS: Operating safely within normal parameters.',
    healthScore: 94.0,
    stopped: false,
  },
  {
    id: 'mch-cmp-02',
    name: 'Reciprocating Air Compressor',
    zone: 'Zone C (Utilities)',
    status: 'NOMINAL',
    alertTitle: 'NOMINAL STATUS: Operating safely within normal parameters.',
    healthScore: 98.0,
    stopped: false,
  },
];

export const ManualTestingPage: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'STOP_REQ' | 'WARNING' | 'NOMINAL'>('ALL');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [machineAlerts, setMachineAlerts] = useState<MachineAlertItem[]>(DEFAULT_MACHINE_ALERTS);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processCsvFile = (fileName: string, content: string) => {
    setIsAnalyzing(true);
    setUploadedFileName(fileName);

    setTimeout(() => {
      const lower = fileName.toLowerCase();
      let updatedAlerts: MachineAlertItem[];

      if (lower.includes('normal') || lower.includes('healthy')) {
        updatedAlerts = DEFAULT_MACHINE_ALERTS.map((m) => ({
          ...m,
          status: 'NOMINAL',
          alertTitle: 'NOMINAL STATUS: Operating safely within normal parameters.',
          healthScore: Math.min(99, Math.round(92 + Math.random() * 6)),
          stopped: false,
        }));
        addNotification('info', `File ${fileName} analyzed: All machines operating nominally.`);
      } else if (lower.includes('bearing') || lower.includes('cnc')) {
        updatedAlerts = DEFAULT_MACHINE_ALERTS.map((m) => {
          if (m.id === 'mch-cnc-01') {
            return {
              ...m,
              status: 'STOP_REQ',
              alertTitle: 'CRITICAL ALERT: Spindle bearing harmonic failure. Immediate stop required.',
              healthScore: 16.0,
              stopped: false,
            };
          }
          if (m.id === 'mch-pmp-01') {
            return {
              ...m,
              status: 'WARNING',
              alertTitle: 'WARNING ALERT: Flow fluctuation detected.',
              healthScore: 74.0,
              stopped: false,
            };
          }
          return { ...m, stopped: false };
        });
        addNotification('error', `CRITICAL ALERT: Stop required for 5-Axis CNC Milling Machine.`);
      } else {
        // Default / Imbalance preset
        updatedAlerts = DEFAULT_MACHINE_ALERTS.map((m) => ({ ...m, stopped: false }));
        addNotification('error', `CRITICAL ALERT: Stop required for Centrifugal Slurry & Cooling Pump.`);
      }

      setMachineAlerts(updatedAlerts);
      setIsAnalyzing(false);
    }, 400);
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || '';
      processCsvFile(file.name, text);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleStopMachine = (id: string, name: string) => {
    setMachineAlerts((prev) =>
      prev.map((m) => (m.id === id ? { ...m, stopped: true } : m))
    );
    addNotification('error', `EMERGENCY STOP EXECUTED FOR ${name.toUpperCase()}. Motor decelerating to 0 RPM.`);
  };

  const filteredAlerts = machineAlerts.filter((m) => {
    if (activeFilter === 'ALL') return true;
    return m.status === activeFilter;
  });

  const stopCount = machineAlerts.filter((m) => m.status === 'STOP_REQ').length;
  const warnCount = machineAlerts.filter((m) => m.status === 'WARNING').length;
  const nominalCount = machineAlerts.filter((m) => m.status === 'NOMINAL').length;

  return (
    <div className="flex flex-col gap-6 font-mono text-xs select-none">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
            <h1 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-white">
              MANUAL TESTING
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1b1c1e] text-cyan-300 border border-cyan-500/40 uppercase">
              CSV SENSOR UPLOAD
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Upload sensor data to inspect machine-wise alerts, track physical units, and run digital twin simulations.
          </p>
        </div>

        {/* Global Alert Summary Badges */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>{stopCount} STOP REQUIRED</span>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-950/50 border border-amber-800/50 text-amber-300 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>{warnCount} ATTENTION</span>
          </span>
        </div>
      </div>

      {/* CSV File Upload Section */}
      <div className="bg-[#121218] border border-[#2a2a34] rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <Upload className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              UPLOAD SENSOR DATA (.CSV)
            </span>
          </div>
          {uploadedFileName && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-emerald-400 font-bold">
                CURRENT FILE: {uploadedFileName}
              </span>
              <button
                onClick={() => {
                  setUploadedFileName(null);
                  setMachineAlerts(DEFAULT_MACHINE_ALERTS);
                }}
                className="text-zinc-500 hover:text-white"
                title="Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`lg:col-span-7 border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                : 'border-zinc-700 hover:border-zinc-500 bg-black/40 hover:bg-black/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-300">
              <FileText className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">
                {isAnalyzing ? 'Evaluating Data Across Machines...' : 'Click or Drag & Drop Sensor .CSV File Here'}
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5 font-sans">
                Upload vibration or sound records to generate machine-wise alerts.
              </div>
            </div>
          </div>

          {/* Quick 1-Click Test Presets */}
          <div className="lg:col-span-5 bg-black/60 rounded-2xl p-4 border border-zinc-800 flex flex-col justify-between gap-2.5">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
              ONE-CLICK TEST DATASETS:
            </span>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => processCsvFile('sample_imbalance.csv', 'imbalance')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-700/60 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <div>
                    <div className="text-white font-bold text-xs group-hover:text-red-200">
                      sample_imbalance.csv
                    </div>
                    <div className="text-[10px] text-red-400">
                      Critical Impeller Fault • Centrifugal Pump Stop
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => processCsvFile('sample_bearing_wear.csv', 'bearing')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-amber-950/30 hover:bg-amber-900/50 border border-amber-700/60 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div>
                    <div className="text-white font-bold text-xs group-hover:text-amber-200">
                      sample_bearing_wear.csv
                    </div>
                    <div className="text-[10px] text-amber-400">
                      Spindle Resonance Fault • CNC Mill Stop
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => processCsvFile('sample_normal.csv', 'normal')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-950/30 hover:bg-emerald-900/50 border border-emerald-700/60 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <div>
                    <div className="text-white font-bold text-xs group-hover:text-emerald-200">
                      sample_normal.csv
                    </div>
                    <div className="text-[10px] text-emerald-400">
                      Normal Operating Flow • All Units Nominal
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Machine-Wise Alerts Section */}
      <div>
        {/* Section Header & Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-red-500" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              MACHINE-WISE ALERTS &amp; ACTIONS
            </h2>
          </div>

          <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeFilter === 'ALL'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              ALL ({machineAlerts.length})
            </button>
            <button
              onClick={() => setActiveFilter('STOP_REQ')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeFilter === 'STOP_REQ'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-red-400 hover:text-red-300'
              }`}
            >
              <span>STOP REQUIRED</span>
              <span className="px-1.5 py-0.2 rounded-full bg-red-950 text-white text-[10px]">
                {stopCount}
              </span>
            </button>
            <button
              onClick={() => setActiveFilter('WARNING')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeFilter === 'WARNING'
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <span>ATTENTION</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-950 text-amber-300 text-[10px]">
                {warnCount}
              </span>
            </button>
            <button
              onClick={() => setActiveFilter('NOMINAL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeFilter === 'NOMINAL'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              NOMINAL ({nominalCount})
            </button>
          </div>
        </div>

        {/* Machine Alert Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAlerts.map((item) => {
            const isStop = item.status === 'STOP_REQ';
            const isWarn = item.status === 'WARNING';
            const isNominal = item.status === 'NOMINAL';

            return (
              <div
                key={item.id}
                className={`rounded-2xl p-5 flex flex-col justify-between transition-all relative overflow-hidden ${
                  isStop
                    ? 'border-2 border-red-500 bg-gradient-to-br from-red-950/80 via-[#18080a] to-[#121218] shadow-[0_0_25px_rgba(239,68,68,0.25)]'
                    : isWarn
                    ? 'border border-amber-500/80 bg-gradient-to-br from-amber-950/40 via-[#16140c] to-[#121218]'
                    : 'border border-zinc-800 bg-[#121218]'
                }`}
              >
                <div>
                  {/* Top Header: Badge & Health */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                        isStop
                          ? 'bg-red-600 text-white shadow-[0_0_10px_#dc2626]'
                          : isWarn
                          ? 'bg-amber-500 text-black'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {isStop && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
                      <span>
                        {item.stopped
                          ? 'SHUT DOWN SAFELY'
                          : isStop
                          ? 'STOP REQUIRED'
                          : isWarn
                          ? 'ATTENTION'
                          : 'NOMINAL'}
                      </span>
                    </span>

                    <span
                      className={`text-xs font-bold ${
                        isStop ? 'text-red-400' : isWarn ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {item.healthScore}% Health
                    </span>
                  </div>

                  {/* Machine Name & Zone */}
                  <div className="mb-3">
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {item.name}
                    </h3>
                    <div className="text-[11px] text-zinc-400 mt-0.5">{item.zone}</div>
                  </div>

                  {/* Pure Alert Message (No Technical Jargon) */}
                  <div
                    className={`p-3 rounded-xl mb-4 font-sans text-xs font-semibold leading-relaxed ${
                      isStop
                        ? 'bg-red-950/60 border border-red-800/80 text-red-200'
                        : isWarn
                        ? 'bg-amber-950/40 border border-amber-800/60 text-amber-200'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-300'
                    }`}
                  >
                    {item.stopped ? 'System has been isolated and powered down safely.' : item.alertTitle}
                  </div>
                </div>

                {/* Machine-Wise Action Buttons: Track & Simulation */}
                <div className="flex flex-col gap-2 pt-3 border-t border-zinc-800/80">
                  {/* Emergency Stop Button if Stop Required */}
                  {isStop && !item.stopped && (
                    <button
                      onClick={() => handleStopMachine(item.id, item.name)}
                      className="w-full py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_#dc2626] transition-all cursor-pointer"
                    >
                      <Power className="w-4 h-4" />
                      <span>STOP MACHINE NOW</span>
                    </button>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    {/* Track Button */}
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      title="Track spatial position on factory map"
                    >
                      <Compass className="w-3.5 h-3.5 text-cyan-400" />
                      <span>TRACK</span>
                    </button>

                    {/* Simulation Button */}
                    <Link
                      to={`/analytics/${item.id}`}
                      className="py-2 px-3 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center shadow-sm"
                      title="Open Kinematic Twin & CAD Simulation"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>SIMULATION</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

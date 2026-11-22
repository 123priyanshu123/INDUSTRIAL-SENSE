import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Plus,
  Radio,
  Search,
  Shield,
  Clock,
  ChevronDown,
} from 'lucide-react';

interface MachineInspectorData {
  id: string;
  name: string;
  zone: string;
  metric: string;
  status: 'STOP_REQ' | 'CRITICAL' | 'MAINT_DUE' | 'NOMINAL';
  note: string;
  cavitation: string;
  temp: string;
  vibration: string;
  pressure: string;
}

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Active Map Inspector Machine
  const [selectedMachine, setSelectedMachine] = useState<MachineInspectorData>({
    id: 'MCH-PMP-01',
    name: 'Centrifugal Slurry & Cooling Pump',
    zone: 'ZONE C',
    metric: '96.4 dB • 88.1°C',
    status: 'STOP_REQ',
    note: 'Severe Acoustic Cavitation & Impeller Vane Stall',
    cavitation: '96.4 dB',
    temp: '88.1°C',
    vibration: '4.8 mm/s',
    pressure: '316 bar',
  });

  // Zone filter & Dynamic Zoom ViewBoxes
  const [activeZone, setActiveZone] = useState<string>('all');

  const ZONE_VIEWBOXES: Record<string, string> = {
    all: '0 0 860 520',
    'zone-a': '15 20 395 245',
    'zone-b': '395 20 450 315',
    'zone-c': '15 260 395 235',
    'zone-d': '395 340 450 155',
  };

  // Alert category filter
  const [alertFilter, setAlertFilter] = useState<'ALL' | 'STOP_REQ' | 'MAINT'>('ALL');

  // Crane carriage animated coordinate
  const [craneY, setCraneY] = useState<number>(140);
  const [craneDirection, setCraneDirection] = useState<number>(1);

  // Live clock
  const [liveClock, setLiveClock] = useState<string>('00:00:00');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newMachineId, setNewMachineId] = useState<string>('');
  const [newMachineName, setNewMachineName] = useState<string>('');
  const [newHardwareId, setNewHardwareId] = useState<string>('');
  const [newZone, setNewZone] = useState<string>('ZONE A');

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cockpit menu toggle
  const [showNavMenu, setShowNavMenu] = useState<boolean>(false);

  // Backend integration (MVP vertical slice)
  const [backendHealth, setBackendHealth] = useState<any>(null);
  const [backendOverview, setBackendOverview] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    const loadBackend = async () => {
      try {
        const [hRes, oRes] = await Promise.all([
          fetch('/api/v1/health'),
          fetch('/api/v1/analytics/overview'),
        ]);
        if (!hRes.ok) return;
        const h = await hRes.json();
        const o = oRes.ok ? await oRes.json() : null;
        if (!cancelled) {
          setBackendHealth(h);
          setBackendOverview(o);
        }
      } catch {
        // backend may be offline; keep existing UI functional
      }
    };
    loadBackend();
    const id = window.setInterval(loadBackend, 10000);
    return () => { cancelled = true; window.clearInterval(id); };
  }, []);

  // Clock effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      setLiveClock(`${hrs}:${mins}:${secs}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Crane animation effect
  useEffect(() => {
    const craneInterval = setInterval(() => {
      setCraneY((prev) => {
        let next = prev + 0.8 * craneDirection;
        if (next > 260) setCraneDirection(-1);
        if (next < 110) setCraneDirection(1);
        return next;
      });
    }, 100);
    return () => clearInterval(craneInterval);
  }, [craneDirection]);

  const handleSelectMachine = (machine: MachineInspectorData) => {
    setSelectedMachine(machine);
  };

  const [eStopMachine, setEStopMachine] = useState<string | null>(null);

  const handleTriggerEStop = (id: string) => {
    setEStopMachine(id);
    setToastMessage(`[!] CRITICAL SAFETY INTERLOCK: EMERGENCY STOP ACTIVATED FOR ${id}. VFD decelerating to 0 RPM.`);
    setTimeout(() => setToastMessage(null), 8000);
  };

  const handleResetEStop = () => {
    setEStopMachine(null);
    setToastMessage(`[✓] E-STOP INTERLOCK RESET. System cleared for normal SCADA operation.`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMachineId || !newMachineName) return;
    setIsModalOpen(false);
    setToastMessage(`Node ${newMachineId} (${newMachineName}) provisioned to ${newZone} bus.`);
    setTimeout(() => setToastMessage(null), 5000);
    setNewMachineId('');
    setNewMachineName('');
    setNewHardwareId('');
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-[#E4E4E7] font-sans select-none overflow-x-hidden p-2 md:p-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-black/95 backdrop-blur-md border border-emerald-500/60 p-4 rounded-xl shadow-2xl font-mono text-xs flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping shadow-[0_0_10px_#10B981]" />
          <div>
            <div className="text-white font-bold tracking-wider flex items-center gap-2">
              <span>SCADA SYSTEM EVENT</span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-1.5 py-0.2 rounded border border-emerald-500/40">
                ACTIVE
              </span>
            </div>
            <div className="text-zinc-400 text-[11px] mt-0.5">{toastMessage}</div>
          </div>
        </div>
      )}

      {/* E-STOP Active Safety Banner */}
      {eStopMachine && (
        <div className="mb-4 bg-red-950/80 border-2 border-red-600 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono shadow-[0_0_30px_rgba(220,38,38,0.5)]">
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-red-500 animate-ping shrink-0" />
            <div>
              <div className="text-white font-bold text-sm tracking-wider flex items-center gap-2">
                <span>[!] CAT-4 SAFETY INTERLOCK ENGAGED: EMERGENCY STOP ACTIVE</span>
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">HALTED</span>
              </div>
              <div className="text-red-200 text-xs mt-0.5">Machine {eStopMachine} VFD zeroed. High-pressure line isolated. Power bus locked.</div>
            </div>
          </div>
          <button
            onClick={handleResetEStop}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg border border-red-400 shrink-0"
          >
            RESET E-STOP INTERLOCK
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-[1920px] mx-auto flex flex-col gap-6">
        {backendHealth && (
          <div className="bg-[#101014] border border-[#2a2a34] rounded-lg p-3 font-mono text-xs text-zinc-300">
            <div className="flex flex-wrap items-center gap-3 justify-between">
              <div className="flex flex-wrap gap-4">
                <span><span className="text-zinc-500">BACKEND</span> {backendHealth.ok ? 'CONNECTED' : 'OFFLINE'}</span>
                <span><span className="text-zinc-500">PIPELINE</span> {backendHealth.status?.ready ? 'READY' : 'PENDING_DATA'}</span>
                <span><span className="text-zinc-500">SIGNALS</span> {backendHealth.status?.signalsLoaded ?? 0}</span>
                <span><span className="text-zinc-500">MACHINES</span> {backendOverview?.machineStats?.total ?? backendHealth.status?.machines ?? 0}</span>
                <span><span className="text-zinc-500">ANOMALY</span> {String(backendHealth.status?.anomalyDetection ?? 'unavailable').toUpperCase()}</span>
              </div>
              <a href="/api/v1/inspection" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">/api/v1/inspection</a>
            </div>
            {Array.isArray(backendHealth.status?.notes) && backendHealth.status.notes.length > 0 && (
              <div className="mt-2 text-[11px] text-amber-300/90 truncate" title={backendHealth.status.notes.join(' | ')}>
                {backendHealth.status.notes[0]}
              </div>
            )}
          </div>
        )}
        {/* TopBar with Navigation Tabs & System Status */}
        <header className="bg-[#121218] rounded-2xl px-6 py-4 flex flex-wrap items-center justify-between border border-[#2a2a34] shadow-md relative z-40 gap-4">
          <div className="flex items-baseline gap-4">
            <Link
              to="/"
              title="Return to Landing Page"
              className="font-ndot-57 text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-white uppercase select-none flex items-center gap-3 hover:text-red-400 transition-colors cursor-pointer group"
            >
              <span className="w-3.5 h-3.5 rounded-full bg-red-600 inline-block group-hover:scale-110 transition-transform" />
              <span className="group-hover:text-white">INDUSTRIALSENSE - SCADA COCKPIT</span>
            </Link>
            <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-ntype-mono font-bold bg-[#1b1c1e] text-zinc-300 border border-zinc-700">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{liveClock} UTC</span>
            </span>
          </div>

          <div className="flex items-center gap-3 relative">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-mono text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4 font-bold" />
              <span>REGISTER MACHINE</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowNavMenu(!showNavMenu)}
                className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-white font-mono text-xs font-bold tracking-widest uppercase flex items-center gap-2 transition-all shadow"
              >
                <span>BUS MENU</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {showNavMenu && (
                <div
                  className="absolute right-0 mt-2 w-72 rounded-xl bg-[#0d0e10] border border-zinc-700 shadow-2xl p-2.5 z-50 space-y-1 font-mono text-xs"
                  onClick={() => setShowNavMenu(false)}
                >
                  <div className="px-3 py-2 border-b border-zinc-800 text-xs text-zinc-400 tracking-wider uppercase flex items-center justify-between">
                    <span>SCADA NAVIGATION BUS</span>
                    <span className="text-emerald-400 font-bold">ONLINE</span>
                  </div>
                  <Link
                    to="/"
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                  >
                    <span>◈ Project Landing Page</span>
                    <span className="text-xs text-zinc-400">HOME</span>
                  </Link>
                  <Link
                    to="/dashboard"
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-zinc-800 text-white font-bold shadow-sm"
                  >
                    <span>Dashboard (Active)</span>
                    <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">Active</span>
                  </Link>
                  <Link
                    to="/analytics"
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors"
                  >
                    <span>Machine Deep Analytics</span>
                    <span className="text-xs bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">PMP-01 →</span>
                  </Link>
                  <Link
                    to="/machine-registration"
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors"
                  >
                    <span>Machine Registration</span>
                    <span className="text-xs text-zinc-500">FORM</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors"
                  >
                    <span>Profile & Settings</span>
                    <span className="text-xs text-zinc-500">VERIFIED</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* SCADA Status Ribbon for Factory Plant Floor */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div className="bg-[#121218] rounded-xl p-4 flex items-center justify-between border border-[#2a2a34] shadow-sm">
            <div>
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block font-semibold">
                FACILITY STATUS
              </span>
              <span className="text-base font-mono font-bold text-white flex items-center gap-2 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> ALL ZONES ACTIVE
              </span>
            </div>
            <span className="text-xs font-mono bg-zinc-900 border border-zinc-700 text-zinc-300 px-2.5 py-1 rounded">
              ONLINE
            </span>
          </div>

          <div className="bg-[#121218] rounded-xl p-4 flex items-center justify-between border border-[#2a2a34] shadow-sm">
            <div>
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block font-semibold">
                ACTIVE ALERTS
              </span>
              <span className="text-base font-mono font-bold text-red-400 flex items-center gap-2 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" /> 3 ALERTS LOGGED
              </span>
            </div>
            <span className="text-xs font-mono bg-red-950/60 border border-red-800/60 text-red-300 px-2.5 py-1 rounded font-bold">
              ATTENTION
            </span>
          </div>

          <div className="bg-[#121218] rounded-xl p-4 flex items-center justify-between border border-[#2a2a34] shadow-sm">
            <div>
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block font-semibold">
                MAINTENANCE SCHEDULE
              </span>
              <span className="text-base font-mono font-bold text-amber-400 flex items-center gap-2 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 7 SCHEDULED
              </span>
            </div>
            <span className="text-xs font-mono bg-amber-950/50 border border-amber-800/50 text-amber-300 px-2.5 py-1 rounded font-bold">
              UPCOMING
            </span>
          </div>

          <div className="bg-[#121218] rounded-xl p-4 flex items-center justify-between border border-[#2a2a34] shadow-sm">
            <div>
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block font-semibold">
                MONITORED MACHINES
              </span>
              <span className="text-base font-mono font-bold text-white flex items-center gap-2 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> ALL ONLINE
              </span>
            </div>
            <span className="text-xs font-mono bg-zinc-900 border border-zinc-700 text-zinc-300 px-2.5 py-1 rounded font-bold">
              CONNECTED
            </span>
          </div>
        </div>

        {/* MAIN WORKSPACE: TWO CORE DOMINANT PANELS (MAP + ALERT CENTER) */}
        <main className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* PANEL A: FACTORY / PLANT SPATIAL MAP (7 Cols) */}
          <section className="xl:col-span-7 bg-[#121218] rounded-2xl p-6 border border-[#2a2a34] flex flex-col justify-between shadow-md">
            <div>
              {/* Floor Plan Top Bar */}
              <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-zinc-800 gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base text-white font-bold tracking-wider">
                    FACTORY SPATIAL MAP & TELEMETRY NODES
                  </span>
                  <span className="text-xs font-mono text-zinc-400 font-semibold">• 2D TOPOLOGY SCHEMATIC v2.5</span>
                </div>

                {/* Zone Filter Selector Pills */}
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  {['all', 'zone-a', 'zone-b', 'zone-c', 'zone-d'].map((z) => (
                    <button
                      key={z}
                      onClick={() => setActiveZone(z)}
                      className={`px-2.5 py-1 rounded-lg uppercase transition-all ${
                        activeZone === z
                          ? 'bg-white text-black font-bold shadow'
                          : 'bg-black/60 border border-zinc-700 text-zinc-300 hover:text-white font-semibold'
                      }`}
                    >
                      {z === 'all' ? 'ALL ZONES' : z.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Map Floor Canvas */}
              <div className="relative w-full h-[540px] rounded-xl bg-black/90 border border-zinc-800 overflow-hidden shadow-inner flex items-center justify-center">
                {/* Background coordinate grid */}
                <div
                  className="absolute inset-0 opacity-30 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 1px, transparent 1px)',
                    backgroundSize: '12px 12px',
                  }}
                />

                {/* Compass HUD Rose & Zone Status */}
                <div className="absolute top-3 left-3 z-10 font-mono text-[10px] text-zinc-500 flex flex-col items-start bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded border border-zinc-800">
                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-bold">▲ N 004°</span>
                    <span className="text-zinc-600">|</span>
                    <span className="text-zinc-300">SEC-09</span>
                  </div>
                  <span className="text-xs text-zinc-400 font-mono mt-0.5">GRID: 120.4, 385.2</span>
                  {activeZone !== 'all' && (
                    <div className="mt-1 pt-1 border-t border-zinc-800 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="text-cyan-300 font-bold uppercase tracking-wider text-[9px]">
                        ZOOMED: {activeZone.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Quick Interactive Inspect Legend */}
                <div className="absolute top-3 right-3 z-10 flex flex-wrap gap-3 items-center bg-[#0d0e10]/95 px-3.5 py-1.5 rounded-lg border border-zinc-700 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> NOMINAL
                  </span>
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> WARN / MAINT
                  </span>
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />{' '}
                    CRITICAL E-STOP
                  </span>
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <span className="w-2 h-0.5 bg-sky-400" /> AGV / EGRESS
                  </span>
                </div>

                {/* SVG Architectural SCADA Plant Map */}
                <svg
                  className="w-full h-full p-2 relative z-0 select-none transition-all duration-500 ease-in-out"
                  viewBox={ZONE_VIEWBOXES[activeZone] || '0 0 860 520'}
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <pattern
                      id="rackHatch"
                      width="8"
                      height="8"
                      patternTransform="rotate(45 0 0)"
                      patternUnits="userSpaceOnUse"
                    >
                      <line x1="0" y1="0" x2="0" y2="8" stroke="#252533" strokeWidth="1.5" />
                    </pattern>
                    <pattern
                      id="egressStripe"
                      width="6"
                      height="6"
                      patternTransform="rotate(-45 0 0)"
                      patternUnits="userSpaceOnUse"
                    >
                      <line x1="0" y1="0" x2="0" y2="6" stroke="#1f2937" strokeWidth="1" />
                    </pattern>
                    <linearGradient id="heatCavitation" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#dc2626" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#dc2626" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="pressStressGlow" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#dc2626" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#dc2626" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* EMERGENCY EGRESS & AUXILIARY AISLE ROUTES */}
                  <rect x="30" y="254" width="360" height="16" rx="2" fill="url(#egressStripe)" opacity="0.7" />
                  <text x="110" y="265" fill="#4b5563" fontFamily="Space Mono" fontSize="8" fontWeight="bold" letterSpacing="1.5">
                    SAFETY AISLE 02 - CLEAR PASSAGE
                  </text>
                  <rect x="405" y="338" width="430" height="16" rx="2" fill="url(#egressStripe)" opacity="0.7" />
                  <text x="470" y="349" fill="#4b5563" fontFamily="Space Mono" fontSize="8" fontWeight="bold" letterSpacing="1.5">
                    SAFETY AISLE 03 - EMERGENCY EGRESS
                  </text>

                  {/* ZONE A: CNC & Heavy Machining */}
                  <g
                    className="cursor-pointer transition-opacity"
                    opacity={activeZone === 'all' || activeZone === 'zone-a' ? 1 : 0.25}
                    onClick={() => setActiveZone(activeZone === 'zone-a' ? 'all' : 'zone-a')}
                  >
                    <rect
                      x="30"
                      y="35"
                      width="360"
                      height="215"
                      rx="8"
                      fill="#0d0d12"
                      stroke={activeZone === 'zone-a' ? '#D71920' : '#2a2a38'}
                      strokeWidth={activeZone === 'zone-a' ? 2 : 1.5}
                      strokeDasharray="4 4"
                    />
                    <text x="45" y="56" fill="#a1a1aa" fontFamily="Space Mono" fontSize="11" fontWeight="700" letterSpacing="1">
                      ZONE A - CNC &amp; MACHINING
                    </text>
                    <text x="45" y="70" fill="#71717a" fontFamily="Space Mono" fontSize="9">
                      PRESS BAY &amp; MILLING
                    </text>
                  </g>

                  {/* ZONE B: ASRS Automated Logistics */}
                  <g
                    className="cursor-pointer transition-opacity"
                    opacity={activeZone === 'all' || activeZone === 'zone-b' ? 1 : 0.25}
                    onClick={() => setActiveZone(activeZone === 'zone-b' ? 'all' : 'zone-b')}
                  >
                    <rect
                      x="405"
                      y="35"
                      width="430"
                      height="295"
                      rx="8"
                      fill="#0d0d12"
                      stroke={activeZone === 'zone-b' ? '#D71920' : '#2a2a38'}
                      strokeWidth={activeZone === 'zone-b' ? 2 : 1.5}
                      strokeDasharray="4 4"
                    />
                    <text x="420" y="56" fill="#a1a1aa" fontFamily="Space Mono" fontSize="11" fontWeight="700" letterSpacing="1">
                      ZONE B - AUTOMATED STORAGE
                    </text>
                    <text x="420" y="70" fill="#71717a" fontFamily="Space Mono" fontSize="9">
                      LOGISTICS &amp; WAREHOUSE
                    </text>
                  </g>

                  {/* ZONE C: Slurry, Pumps & Coolant Utilities */}
                  <g
                    className="cursor-pointer transition-opacity"
                    opacity={activeZone === 'all' || activeZone === 'zone-c' ? 1 : 0.25}
                    onClick={() => setActiveZone(activeZone === 'zone-c' ? 'all' : 'zone-c')}
                  >
                    <rect
                      x="30"
                      y="275"
                      width="360"
                      height="210"
                      rx="8"
                      fill="#0d0d12"
                      stroke={activeZone === 'zone-c' ? '#D71920' : '#2a2a38'}
                      strokeWidth={activeZone === 'zone-c' ? 2 : 1.5}
                      strokeDasharray="4 4"
                    />
                    <text x="45" y="296" fill="#a1a1aa" fontFamily="Space Mono" fontSize="11" fontWeight="700" letterSpacing="1">
                      ZONE C - PUMPS &amp; UTILITIES
                    </text>
                    <text x="45" y="310" fill="#71717a" fontFamily="Space Mono" fontSize="9">
                      COOLING &amp; SLURRY SYSTEMS
                    </text>
                  </g>

                  {/* ZONE D: Quality & Inspection Lab */}
                  <g
                    className="cursor-pointer transition-opacity"
                    opacity={activeZone === 'all' || activeZone === 'zone-d' ? 1 : 0.25}
                    onClick={() => setActiveZone(activeZone === 'zone-d' ? 'all' : 'zone-d')}
                  >
                    <rect
                      x="405"
                      y="355"
                      width="430"
                      height="130"
                      rx="8"
                      fill="#0e1014"
                      stroke={activeZone === 'zone-d' ? '#D71920' : '#2a2a38'}
                      strokeWidth={activeZone === 'zone-d' ? 2 : 1.5}
                      strokeDasharray="4 4"
                    />
                    <text x="420" y="374" fill="#a1a1aa" fontFamily="Space Mono" fontSize="11" fontWeight="700" letterSpacing="1">
                      ZONE D - QUALITY &amp; INSPECTION
                    </text>
                    <text x="420" y="388" fill="#71717a" fontFamily="Space Mono" fontSize="9">
                      TESTING LAB
                    </text>
                  </g>

                  {/* PIPING & ISOLATION VALVES */}
                  <path d="M 48,460 L 372,460" stroke="#3b82f6" strokeWidth="3.5" strokeLinecap="round" opacity="0.5" />
                  <text x="130" y="474" fill="#60a5fa" fontFamily="Space Mono" fontSize="8">
                    CHILLED WATER PRIMARY LOOP [6.2 BAR]
                  </text>
                  <g transform="translate(195, 455)">
                    <polygon points="-6,-5 6,5 -6,5 6,-5" fill="#60a5fa" />
                    <circle cx="0" cy="0" r="2" fill="#1e3a8a" />
                    <text x="-8" y="-8" fill="#93c5fd" fontFamily="Space Mono" fontSize="7">
                      V-102
                    </text>
                  </g>

                  {/* AGV DUAL HIGH-PRECISION CORRIDORS */}
                  <path
                    d="M 45,262 L 375,262 L 390,262 L 390,346 L 415,346 L 820,346"
                    fill="none"
                    stroke="#00E5FF"
                    strokeWidth="1.8"
                    strokeDasharray="6 6"
                    opacity="0.85"
                  />
                  <path
                    d="M 618,78 L 618,335 L 795,335"
                    fill="none"
                    stroke="#00E5FF"
                    strokeWidth="1.8"
                    strokeDasharray="6 6"
                    opacity="0.6"
                  />

                  {/* AGV Active Mobile Platforms */}
                  <g transform="translate(250, 262)">
                    <rect x="-11" y="-7" width="22" height="14" rx="2" fill="#00E5FF" opacity="0.95" />
                    <circle cx="-7" cy="0" r="1.5" fill="#000" />
                    <circle cx="7" cy="0" r="1.5" fill="#000" />
                    <text x="0" y="3" fill="#000" fontFamily="Space Mono" fontSize="7" fontWeight="bold" textAnchor="middle">
                      AGV1
                    </text>
                  </g>
                  <g transform="translate(618, 230)">
                    <rect x="-7" y="-10" width="14" height="20" rx="2" fill="#00E5FF" opacity="0.95" />
                    <text x="0" y="3" fill="#000" fontFamily="Space Mono" fontSize="7" fontWeight="bold" textAnchor="middle">
                      AGV2
                    </text>
                  </g>

                  {/* ================= MACHINES IN ZONE A ================= */}
                  {/* 1. MCH-CNC-01 */}
                  <g
                    className="cursor-pointer hover:opacity-90"
                    onClick={() =>
                      handleSelectMachine({
                        id: 'MCH-CNC-01',
                        name: '5-Axis CNC Milling Machine',
                        zone: 'ZONE A',
                        metric: '68.4°C • 2.85G',
                        status: 'MAINT_DUE',
                        note: 'Spindle Bearing Outer-Race Harmonics',
                        cavitation: '74.2 dB',
                        temp: '68.4°C',
                        vibration: '2.85 G',
                        pressure: '0.04 mm',
                      })
                    }
                  >
                    <rect
                      x="48"
                      y="80"
                      width="130"
                      height="65"
                      rx="5"
                      fill="#161622"
                      stroke={selectedMachine.id === 'MCH-CNC-01' ? '#FFFFFF' : '#F59E0B'}
                      strokeWidth={selectedMachine.id === 'MCH-CNC-01' ? 2.5 : 1.5}
                    />
                    <text x="58" y="105" fill="#FFFFFF" fontFamily="Space Mono" fontSize="11" fontWeight="700">
                      CNC Mill
                    </text>
                    <circle cx="162" cy="100" r="5" fill="#F59E0B" />
                    <text x="58" y="128" fill="#A1A1AA" fontFamily="Space Mono" fontSize="8">
                      68.4°C • ATTENTION
                    </text>
                  </g>

                  {/* 2. MCH-CNC-02 */}
                  <g
                    className="cursor-pointer hover:opacity-90"
                    onClick={() =>
                      handleSelectMachine({
                        id: 'MCH-CNC-02',
                        name: 'Twin-Spindle Lathe',
                        zone: 'ZONE A',
                        metric: '41.2°C • 0.82G',
                        status: 'NOMINAL',
                        note: 'Healthy operating envelope',
                        cavitation: '62.0 dB',
                        temp: '41.2°C',
                        vibration: '0.82 G',
                        pressure: 'NOMINAL',
                      })
                    }
                  >
                    <rect
                      x="212"
                      y="80"
                      width="130"
                      height="65"
                      rx="5"
                      fill="#12131a"
                      stroke={selectedMachine.id === 'MCH-CNC-02' ? '#FFFFFF' : '#2a2a3a'}
                      strokeWidth={selectedMachine.id === 'MCH-CNC-02' ? 2 : 1.2}
                    />
                    <text x="222" y="105" fill="#FFFFFF" fontFamily="Space Mono" fontSize="11" fontWeight="700">
                      Twin Lathe
                    </text>
                    <circle cx="326" cy="100" r="4.5" fill="#10B981" />
                    <text x="222" y="128" fill="#10B981" fontFamily="Space Mono" fontSize="8">
                      NOMINAL • 41°C
                    </text>
                  </g>

                  {/* 3. MCH-HYD-01 */}
                  <circle cx="210" cy="180" r="65" fill="url(#pressStressGlow)" />
                  <g
                    className="cursor-pointer hover:opacity-90"
                    onClick={() =>
                      handleSelectMachine({
                        id: 'MCH-HYD-01',
                        name: 'Hydraulic Press',
                        zone: 'ZONE A',
                        metric: '318 bar • 74.2°C',
                        status: 'CRITICAL',
                        note: 'Hydraulic Cylinder Gland Blowby Over-Pressure',
                        cavitation: '82.5 dB',
                        temp: '74.2°C',
                        vibration: '4.8 mm/s',
                        pressure: '318 bar',
                      })
                    }
                  >
                    <rect
                      x="48"
                      y="160"
                      width="294"
                      height="75"
                      rx="6"
                      fill="#1e1114"
                      stroke={selectedMachine.id === 'MCH-HYD-01' ? '#FFFFFF' : '#dc2626'}
                      strokeWidth={selectedMachine.id === 'MCH-HYD-01' ? 3 : 2}
                    />
                    <text x="60" y="190" fill="#FFFFFF" fontFamily="Space Mono" fontSize="11" fontWeight="700">
                      Hydraulic Press
                    </text>
                    <circle cx="326" cy="185" r="5.5" fill="#dc2626" />
                    <text x="60" y="215" fill="#ef4444" fontFamily="Space Mono" fontSize="8" fontWeight="bold">
                      PRESSURE ALERT
                    </text>
                    <text x="240" y="215" fill="#fca5a5" fontFamily="Space Mono" fontSize="8">
                      318 BAR
                    </text>
                  </g>

                  {/* ================= MACHINES IN ZONE B (ASRS) ================= */}
                  <rect x="425" y="80" width="160" height="225" rx="4" fill="url(#rackHatch)" stroke="#2d2d3d" strokeWidth="1.2" />
                  <text x="435" y="100" fill="#D4D4D8" fontFamily="Space Mono" fontSize="9" fontWeight="bold">
                    RACK-BAY 01 (1,200 PALLETS)
                  </text>
                  <text x="435" y="112" fill="#71717a" fontFamily="Space Mono" fontSize="7">
                    OCCUPANCY: 94.2%
                  </text>

                  <rect x="655" y="80" width="160" height="225" rx="4" fill="url(#rackHatch)" stroke="#2d2d3d" strokeWidth="1.2" />
                  <text x="665" y="100" fill="#D4D4D8" fontFamily="Space Mono" fontSize="9" fontWeight="bold">
                    RACK-BAY 02 (1,200 PALLETS)
                  </text>
                  <text x="665" y="112" fill="#71717a" fontFamily="Space Mono" fontSize="7">
                    OCCUPANCY: 88.5%
                  </text>

                  {/* Central Crane Runway Track */}
                  <line x1="605" y1="75" x2="605" y2="315" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="2 3" opacity="0.55" />

                  {/* Animated Crane Carriage Assembly (MCH-ASRS-19) */}
                  <g
                    className="cursor-pointer"
                    transform={`translate(605, ${craneY.toFixed(1)})`}
                    onClick={() =>
                      handleSelectMachine({
                        id: 'MCH-ASRS-19',
                        name: 'Automated High-Bay Storage & Retrieval System',
                        zone: 'ZONE B',
                        metric: '8,400 RPM • 42.5°C',
                        status: 'NOMINAL',
                        note: 'High-Bay Stacker in Nominal Motion',
                        cavitation: '58.0 dB',
                        temp: '42.5°C',
                        vibration: '0.42 G',
                        pressure: '92% RUL',
                      })
                    }
                  >
                    <rect
                      x="-18"
                      y="-22"
                      width="36"
                      height="44"
                      rx="4"
                      fill="#0d0d14"
                      stroke={selectedMachine.id === 'MCH-ASRS-19' ? '#dc2626' : '#FFFFFF'}
                      strokeWidth="2"
                    />
                    <line x1="-14" y1="0" x2="14" y2="0" stroke="#dc2626" strokeWidth="2" />
                    <circle cx="0" cy="0" r="4" fill="#10B981" />
                    <text x="22" y="4" fill="#FFFFFF" fontFamily="Space Mono" fontSize="10" fontWeight="bold">
                      Storage Crane
                    </text>
                    <text x="22" y="18" fill="#10B981" fontFamily="Space Mono" fontSize="8">
                      OPERATING
                    </text>
                  </g>

                  {/* ================= MACHINES IN ZONE C ================= */}
                  <circle cx="120" cy="375" r="60" fill="url(#heatCavitation)" />
                  {/* Centrifugal Pump (Cavitation Pump) */}
                  <g
                    className="cursor-pointer"
                    onClick={() =>
                      handleSelectMachine({
                        id: 'MCH-PMP-01',
                        name: 'Centrifugal Slurry & Cooling Pump',
                        zone: 'ZONE C',
                        metric: '96.4 dB • 88.1°C',
                        status: 'STOP_REQ',
                        note: 'Elevated acoustic cavitation on suction inlet',
                        cavitation: '96.4 dB',
                        temp: '88.1°C',
                        vibration: '4.8 mm/s',
                        pressure: '316 bar',
                      })
                    }
                  >
                    <rect
                      x="48"
                      y="325"
                      width="145"
                      height="95"
                      rx="6"
                      fill="#2a0a0d"
                      stroke={selectedMachine.id === 'MCH-PMP-01' ? '#FFFFFF' : '#dc2626'}
                      strokeWidth="2.5"
                    />
                    <text x="58" y="358" fill="#FFFFFF" fontFamily="Space Mono" fontSize="11" fontWeight="700">
                      Centrifugal Pump
                    </text>
                    <circle cx="175" cy="354" r="6" fill="#dc2626" className="animate-pulse" />
                    <text x="58" y="388" fill="#ef4444" fontFamily="Space Mono" fontSize="9" fontWeight="bold">
                      96.4 dB CAVITATION
                    </text>
                    <text x="58" y="404" fill="#FFFFFF" fontFamily="Space Mono" fontSize="8" fontWeight="bold">
                      HIGH NOISE ALERT
                    </text>
                  </g>

                  {/* Chiller Compressor */}
                  <g
                    className="cursor-pointer"
                    onClick={() =>
                      handleSelectMachine({
                        id: 'MCH-CMP-02',
                        name: 'Screw Ammonia Chiller',
                        zone: 'ZONE C',
                        metric: '6.2 bar • 4.1°C',
                        status: 'NOMINAL',
                        note: 'Stable Thermal Delta & Nominal COP',
                        cavitation: '64.1 dB',
                        temp: '4.1°C',
                        vibration: '1.1 mm/s',
                        pressure: '6.2 bar',
                      })
                    }
                  >
                    <rect
                      x="220"
                      y="325"
                      width="140"
                      height="95"
                      rx="6"
                      fill="#12131c"
                      stroke={selectedMachine.id === 'MCH-CMP-02' ? '#FFFFFF' : '#2e2e40'}
                      strokeWidth={selectedMachine.id === 'MCH-CMP-02' ? 2 : 1.2}
                    />
                    <text x="232" y="358" fill="#FFFFFF" fontFamily="Space Mono" fontSize="11" fontWeight="700">
                      Air Chiller
                    </text>
                    <circle cx="342" cy="354" r="4.5" fill="#10B981" />
                    <text x="232" y="388" fill="#10B981" fontFamily="Space Mono" fontSize="8">
                      NOMINAL • 4.1°C
                    </text>
                    <text x="232" y="404" fill="#71717A" fontFamily="Space Mono" fontSize="8">
                      STABLE
                    </text>
                  </g>

                  {/* ================= MACHINES IN ZONE D ================= */}
                  {/* ROB-CELL-04 */}
                  <g
                    className="cursor-pointer"
                    onClick={() =>
                      handleSelectMachine({
                        id: 'ROB-CELL-04',
                        name: '6-Axis Depalletizing Gantry',
                        zone: 'ZONE D',
                        metric: '0.45 G • 38.2°C',
                        status: 'NOMINAL',
                        note: 'Carton Infeed Nominal Operating Cycle',
                        cavitation: '52.0 dB',
                        temp: '38.2°C',
                        vibration: '0.45 G',
                        pressure: '0.02 mm',
                      })
                    }
                  >
                    <circle cx="480" cy="425" r="26" fill="#14141e" stroke="#333346" strokeWidth="1.5" />
                    <text x="480" y="426" fill="#FFFFFF" fontFamily="Space Mono" fontSize="8" fontWeight="bold" textAnchor="middle">
                      ROBOT-04
                    </text>
                    <circle cx="480" cy="438" r="3.5" fill="#10B981" />
                  </g>

                  {/* CMM-INS-01 */}
                  <g
                    className="cursor-pointer"
                    onClick={() =>
                      handleSelectMachine({
                        id: 'CMM-INS-01',
                        name: 'High-Precision Bridge CMM',
                        zone: 'ZONE D',
                        metric: '20.0°C ISO • 0.002mm',
                        status: 'NOMINAL',
                        note: 'Calibration verified; Metrology enclosure sealed',
                        cavitation: '44.0 dB',
                        temp: '20.0°C',
                        vibration: '0.002 mm',
                        pressure: '99.8% ACC',
                      })
                    }
                  >
                    <rect x="545" y="400" width="135" height="55" rx="4" fill="#12131e" stroke="#2a2a3e" strokeWidth="1.2" />
                    <text x="556" y="424" fill="#FFFFFF" fontFamily="Space Mono" fontSize="10" fontWeight="700">
                      Bridge CMM
                    </text>
                    <circle cx="665" cy="420" r="4" fill="#10B981" />
                    <text x="556" y="444" fill="#10B981" fontFamily="Space Mono" fontSize="7.5">
                      TOL: ±0.002mm PASS
                    </text>
                  </g>

                  {/* QC-SCAN-02 */}
                  <g
                    className="cursor-pointer"
                    onClick={() =>
                      handleSelectMachine({
                        id: 'QC-SCAN-02',
                        name: 'Laser Profile Thickness Scanner',
                        zone: 'ZONE D',
                        metric: '240 scans/min',
                        status: 'NOMINAL',
                        note: 'Zero defect envelope across lot #844',
                        cavitation: '48.0 dB',
                        temp: '22.4°C',
                        vibration: '240 rpm',
                        pressure: '99.98% OK',
                      })
                    }
                  >
                    <rect x="695" y="400" width="120" height="55" rx="4" fill="#12131e" stroke="#2a2a3e" strokeWidth="1.2" />
                    <text x="705" y="424" fill="#FFFFFF" fontFamily="Space Mono" fontSize="10" fontWeight="700">
                      Laser Scanner
                    </text>
                    <circle cx="800" cy="420" r="4" fill="#10B981" />
                    <text x="705" y="444" fill="#10B981" fontFamily="Space Mono" fontSize="7.5">
                      INLINE 100% OK
                    </text>
                  </g>
                </svg>

                {/* Interactive Machine Inspector Flyout Overlay at Bottom of Map */}
                <div className="absolute bottom-3 inset-x-3 bg-black/95 backdrop-blur-md rounded-xl p-3 border border-zinc-700 shadow-2xl flex flex-wrap items-center justify-between gap-3 z-20">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3.5 h-3.5 rounded-full ${
                        selectedMachine.status === 'STOP_REQ' || selectedMachine.status === 'CRITICAL'
                          ? 'bg-[#D71920] shadow-[0_0_10px_#D71920] animate-pulse'
                          : selectedMachine.status === 'MAINT_DUE'
                          ? 'bg-amber-400 shadow-[0_0_10px_#F59E0B]'
                          : 'bg-emerald-400 shadow-[0_0_10px_#10B981]'
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-white tracking-wider">
                          {selectedMachine.name}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-1.5 rounded">
                          {selectedMachine.zone}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                            selectedMachine.status === 'STOP_REQ'
                              ? 'text-[#D71920] bg-[#D71920]/20 border-[#D71920]/50'
                              : selectedMachine.status === 'CRITICAL'
                              ? 'text-red-400 bg-red-950/70 border-red-800/60'
                              : selectedMachine.status === 'MAINT_DUE'
                              ? 'text-amber-400 bg-amber-500/20 border-amber-500/50'
                              : 'text-emerald-400 bg-emerald-500/20 border-emerald-500/50'
                          }`}
                        >
                          {selectedMachine.status === 'STOP_REQ'
                            ? 'STOP REQUIRED'
                            : selectedMachine.status === 'CRITICAL'
                            ? 'CRITICAL FAULT'
                            : selectedMachine.status === 'MAINT_DUE'
                            ? 'MAINTENANCE DUE'
                            : 'NOMINAL RUNNING'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Real-Time Telemetry Live Metric Pills */}
                  <div className="hidden md:flex items-center gap-2 font-mono text-xs">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-center">
                      <span className="text-[9px] text-zinc-400 uppercase block font-semibold">Cavitation</span>
                      <span className="text-white font-bold text-[11px]">{selectedMachine.cavitation}</span>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-center">
                      <span className="text-[9px] text-zinc-400 uppercase block font-semibold">Temp</span>
                      <span className="text-amber-400 font-bold text-[11px]">{selectedMachine.temp}</span>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-center">
                      <span className="text-[9px] text-zinc-400 uppercase block font-semibold">Vibration</span>
                      <span className="text-[#D71920] font-bold text-[11px]">{selectedMachine.vibration}</span>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 text-center">
                      <span className="text-[9px] text-zinc-400 uppercase block font-semibold">Pressure</span>
                      <span className="text-zinc-200 font-bold text-[11px]">{selectedMachine.pressure}</span>
                    </div>
                  </div>

                  {/* Deep Analytics Link */}
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/analytics/${selectedMachine.id}`}
                      className="px-3.5 py-1.5 rounded-lg bg-[#D71920] hover:bg-red-700 text-white font-mono text-xs font-bold tracking-tight shadow flex items-center gap-1.5 transition-all"
                    >
                      <span>VIEW MACHINE ANALYTICS</span>
                      <span className="text-white font-bold text-sm leading-none">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Footer Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t border-zinc-800 text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="text-zinc-400 font-medium">COORDINATES:</span>
                <span className="text-white font-bold">X: 120.4, Y: 385.2</span>
                <span className="text-zinc-600">|</span>
                <span className="text-zinc-400">
                  AGV CADENCE: <strong className="text-emerald-400">OPTIMAL (2.1 m/s)</strong>
                </span>
              </div>
              <span className="text-[11px] text-zinc-400">Click any machine node to inspect telemetry envelope</span>
            </div>
          </section>

          {/* PANEL B: ALERT & MAINTENANCE COMMAND CENTER (5 Cols) */}
          <section className="xl:col-span-5 bg-[#121218]/90 backdrop-blur-md rounded-2xl p-5 flex flex-col justify-between border border-[#2a2a34]">
            <div>
              {/* Alert Center Header */}
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  <h2 className="font-mono text-base text-white font-bold tracking-wide">
                    ALERT & MAINTENANCE COMMAND
                  </h2>
                </div>
                <span className="text-xs font-mono text-zinc-400 uppercase font-semibold">
                  QUEUE: 10 ACTIVE DISPATCHES
                </span>
              </div>

              {/* Filter tabs for alerts */}
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setAlertFilter('ALL')}
                  className={`px-3.5 py-1 rounded-full font-mono text-xs font-bold tracking-tight shadow transition-all ${
                    alertFilter === 'ALL'
                      ? 'bg-white text-black'
                      : 'bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white'
                  }`}
                >
                  ALL (10)
                </button>
                <button
                  onClick={() => setAlertFilter('STOP_REQ')}
                  className={`px-3.5 py-1 rounded-full font-mono text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    alertFilter === 'STOP_REQ'
                      ? 'bg-[#D71920] text-white shadow-[0_0_10px_#D71920]'
                      : 'bg-[#D71920]/10 border border-[#D71920]/60 text-white hover:bg-[#D71920]/25'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D71920] shadow-[0_0_5px_#D71920]" />
                  STOP REQ (3)
                </button>
                <button
                  onClick={() => setAlertFilter('MAINT')}
                  className={`px-3.5 py-1 rounded-full font-mono text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    alertFilter === 'MAINT'
                      ? 'bg-amber-500 text-black font-bold'
                      : 'bg-amber-500/10 border border-amber-500/60 text-amber-300 hover:bg-amber-500/25'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  MAINT (7)
                </button>
              </div>

              {/* Scrollable Incident Queue */}
              <div className="space-y-3 max-h-[515px] overflow-y-auto pr-1">
                {/* Critical Incident 1: E-STOP Centrifugal Pump */}
                {(alertFilter === 'ALL' || alertFilter === 'STOP_REQ') && (
                  <article className="p-4 rounded-xl bg-[#D71920]/10 border-2 border-[#D71920]/80 relative">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="text-white font-bold tracking-wider">Cooling System</span>
                          <span className="text-zinc-400 font-medium">• Zone C (Cooling Yard)</span>
                        </div>
                        <h3 className="text-sm font-bold text-white mt-1 font-mono tracking-tight">
                          Centrifugal Slurry & Cooling Pump
                        </h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-[#D71920] text-white flex items-center gap-1.5 shadow-[0_0_8px_#D71920] uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                        STOP REQ
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 p-2.5 rounded-lg bg-black/80 border border-[#D71920]/40 font-mono text-xs">
                      <div>
                        <div className="text-red-400 text-[10px] uppercase tracking-wider font-bold">
                          Trigger Acoustic Peak
                        </div>
                        <div className="text-white font-bold mt-0.5 text-xs">96.4 dB (PEAK)</div>
                      </div>
                      <div>
                        <div className="text-zinc-400 text-[10px] uppercase tracking-wider font-semibold">
                          Acoustic Safety Limit
                        </div>
                        <div className="text-zinc-300 font-semibold mt-0.5 text-xs">82.0 dB</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-[#D71920]/40">
                      <button
                        onClick={() => handleTriggerEStop('MCH-PMP-01')}
                        className="flex-1 py-2 px-3 rounded-lg bg-[#D71920] hover:bg-red-700 text-white font-mono text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-lg"
                      >
                        EMERGENCY STOP
                      </button>
                      <button
                        onClick={() =>
                          handleSelectMachine({
                            id: 'MCH-PMP-01',
                            name: 'Centrifugal Slurry & Cooling Pump',
                            zone: 'ZONE C',
                            metric: '96.4 dB • 88.1°C',
                            status: 'STOP_REQ',
                            note: 'Severe Acoustic Cavitation',
                            cavitation: '96.4 dB',
                            temp: '88.1°C',
                            vibration: '4.8 mm/s',
                            pressure: '316 bar',
                          })
                        }
                        className="px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-mono font-semibold text-zinc-200 hover:text-white transition-colors uppercase tracking-wider"
                      >
                        LOCATE
                      </button>
                    </div>
                  </article>
                )}

                {/* Critical Incident 2: Hydraulic Press Over-Pressure */}
                {(alertFilter === 'ALL' || alertFilter === 'STOP_REQ') && (
                  <article className="p-3.5 rounded-xl bg-[#16161c]/95 border border-zinc-800 hover:border-zinc-700 transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="text-white font-bold tracking-wider">Hydraulic System</span>
                          <span className="text-zinc-400 font-medium">• Zone A (Press Bay)</span>
                        </div>
                        <h3 className="text-sm font-bold text-white mt-1 font-mono tracking-tight">
                          600-Tonne Hydraulic Deep-Draw Press
                        </h3>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950/70 text-red-300 border border-red-800/60 uppercase tracking-wider">
                        CRITICAL STOP
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2.5 p-2 rounded-lg bg-black/60 border border-zinc-800 font-mono text-xs">
                      <div>
                        <div className="text-zinc-400 text-[10px] uppercase font-semibold">Telemetry</div>
                        <div className="text-red-400 font-bold text-xs">318 bar • 74.2°C</div>
                      </div>
                      <div>
                        <div className="text-zinc-400 text-[10px] uppercase font-semibold">Safety Limit</div>
                        <div className="text-zinc-300 font-semibold text-xs">280 bar • 60.0°C</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-zinc-800">
                      <button
                        onClick={() => alert('Maintenance Ticket Created for Hydraulic Press')}
                        className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono font-semibold transition-colors border border-zinc-700 uppercase tracking-wider"
                      >
                        DISPATCH TECH TEAM
                      </button>
                      <button
                        onClick={() =>
                          handleSelectMachine({
                            id: 'MCH-HYD-01',
                            name: '600-Tonne Hydraulic Deep-Draw Press',
                            zone: 'ZONE A',
                            metric: '318 bar • 74.2°C',
                            status: 'CRITICAL',
                            note: 'Gland Blowby Over-Pressure',
                            cavitation: '82.5 dB',
                            temp: '74.2°C',
                            vibration: '4.8 mm/s',
                            pressure: '318 bar',
                          })
                        }
                        className="text-xs font-mono font-semibold text-zinc-300 hover:text-white flex items-center gap-1 uppercase tracking-wider"
                      >
                        <span>LOCATE ON MAP</span>
                        <span>→</span>
                      </button>
                    </div>
                  </article>
                )}

                {/* Maintenance Incident 3: 5-Axis CNC Bearing Resonance */}
                {(alertFilter === 'ALL' || alertFilter === 'MAINT') && (
                  <article className="p-3.5 rounded-xl bg-[#16161c]/95 border border-zinc-800 hover:border-zinc-700 transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="text-white font-bold tracking-wider">Machining Center</span>
                          <span className="text-zinc-400 font-medium">• Zone A (Machining)</span>
                        </div>
                        <h3 className="text-sm font-bold text-white mt-1 font-mono tracking-tight">
                          5-Axis CNC Milling Machine
                        </h3>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/40 flex items-center gap-1 uppercase tracking-wider">
                        DUE SOON
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2.5 p-2 rounded-lg bg-black/70 border border-zinc-800 font-mono text-xs">
                      <div>
                        <div className="text-zinc-400 text-[10px] uppercase font-semibold">Trigger Telemetry</div>
                        <div className="text-amber-400 font-bold text-xs">68.4°C • 2.85 G</div>
                      </div>
                      <div>
                        <div className="text-zinc-400 text-[10px] uppercase font-semibold">Safety Limit</div>
                        <div className="text-zinc-300 font-semibold text-xs">65.0°C • 2.0 G</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-zinc-800">
                      <button
                        onClick={() => alert('Work Order Dispatched to Station')}
                        className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono font-semibold transition-colors border border-zinc-700 uppercase tracking-wider"
                      >
                        DISPATCH WORK ORDER
                      </button>
                      <button
                        onClick={() =>
                          handleSelectMachine({
                            id: 'MCH-CNC-01',
                            name: '5-Axis CNC Milling Machine',
                            zone: 'ZONE A',
                            metric: '68.4°C • 2.85G',
                            status: 'MAINT_DUE',
                            note: 'Spindle Bearing Outer-Race Harmonics',
                            cavitation: '74.2 dB',
                            temp: '68.4°C',
                            vibration: '2.85 G',
                            pressure: '0.04 mm',
                          })
                        }
                        className="text-xs font-mono font-semibold text-zinc-300 hover:text-white flex items-center gap-1 uppercase tracking-wider"
                      >
                        <span>LOCATE ON MAP</span>
                        <span>→</span>
                      </button>
                    </div>
                  </article>
                )}

                {/* Maintenance Incident 4: ASRS Optical Calibration */}
                {(alertFilter === 'ALL' || alertFilter === 'MAINT') && (
                  <article className="p-3.5 rounded-xl bg-[#16161c]/95 border border-zinc-800 hover:border-zinc-700 transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="text-white font-bold tracking-wider">Logistics Bay</span>
                          <span className="text-zinc-400 font-medium">• Zone B (High-Bay)</span>
                        </div>
                        <h3 className="text-sm font-bold text-white mt-1 font-mono tracking-tight">
                          Unit-Load Stacker Crane
                        </h3>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase tracking-wider">
                        ROUTINE
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800 text-xs font-mono">
                      <button
                        onClick={() =>
                          handleSelectMachine({
                            id: 'MCH-ASRS-19',
                            name: 'Automated High-Bay Storage & Retrieval System',
                            zone: 'ZONE B',
                            metric: '8,400 RPM • 42.5°C',
                            status: 'NOMINAL',
                            note: 'High-Bay Stacker in Nominal Motion',
                            cavitation: '58.0 dB',
                            temp: '42.5°C',
                            vibration: '0.42 G',
                            pressure: '92% RUL',
                          })
                        }
                        className="text-zinc-300 hover:text-white font-semibold flex items-center gap-1 uppercase tracking-wider"
                      >
                        <span>LOCATE ON MAP</span>
                        <span>→</span>
                      </button>
                    </div>
                  </article>
                )}
              </div>
            </div>

            {/* Alert Center Footer Interlock Safety Status */}
            <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#10B981]" />
                <span className="text-zinc-400 font-medium">SAFETY INTERLOCK:</span>
                <span className="text-white font-bold">AUTOMATED SYSTEM ACTIVE</span>
              </div>
              <Link
                to="/analytics"
                className="text-zinc-300 hover:text-white font-bold flex items-center gap-1 uppercase tracking-wider"
              >
                <span>ALL MACHINE METRICS</span>
                <span className="text-[#D71920] font-bold text-sm leading-none">→</span>
              </Link>
            </div>
          </section>
        </main>

        {/* Machine Registration Modal Dialog */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#121218] rounded-2xl w-full max-w-lg border border-zinc-700 p-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 mb-5 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  <h3 className="font-mono text-sm text-white font-bold tracking-wider">[ + REGISTER MACHINE NODE ]</h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-zinc-400 hover:text-white font-mono text-sm px-2.5 py-1 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4 font-mono text-xs">
                <div className="space-y-1.5">
                  <label className="block text-zinc-300 font-semibold tracking-wider text-xs uppercase">
                    MACHINE IDENTIFIER <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newMachineId}
                    onChange={(e) => setNewMachineId(e.target.value)}
                    placeholder="e.g. Mill Unit 01, Pump Unit 02"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3.5 py-2.5 text-white placeholder-zinc-500 font-mono text-xs focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-zinc-300 font-semibold tracking-wider text-xs uppercase">
                    MACHINE NAME / DESIGNATION <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newMachineName}
                    onChange={(e) => setNewMachineName(e.target.value)}
                    placeholder="e.g. Precision 5-Axis Milling Center"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3.5 py-2.5 text-white placeholder-zinc-500 font-mono text-xs focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-zinc-300 font-semibold tracking-wider text-xs uppercase">
                    HARDWARE DEVICE ID / TELEMETRY MAC <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newHardwareId}
                    onChange={(e) => setNewHardwareId(e.target.value)}
                    placeholder="e.g. ESP32-NODE-88A4, 7C:2F:80:A1"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3.5 py-2.5 text-white placeholder-zinc-500 font-mono text-xs focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all uppercase"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-zinc-300 font-semibold tracking-wider text-xs uppercase">
                    FACILITY ALLOCATION ZONE
                  </label>
                  <select
                    value={newZone}
                    onChange={(e) => setNewZone(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3.5 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                  >
                    <option value="ZONE A">ZONE A - CNC & HEAVY MACHINING</option>
                    <option value="ZONE B">ZONE B - ASRS AUTOMATED LOGISTICS</option>
                    <option value="ZONE C">ZONE C - SLURRY, PUMPS & COOLANT UTILITIES</option>
                    <option value="ZONE D">ZONE D - QUALITY, METROLOGY & INSPECTION LAB</option>
                  </select>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-zinc-800 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-mono text-xs font-semibold tracking-wider uppercase transition-all"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-mono text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center gap-2"
                  >
                    <span>CONFIRM & REGISTER NODE</span>
                    <span className="text-sm leading-none">→</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

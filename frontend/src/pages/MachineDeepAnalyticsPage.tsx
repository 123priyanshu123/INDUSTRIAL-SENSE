import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Volume2,
  Gauge,
  Thermometer,
  RotateCw,
  AlertTriangle,
  Activity,
  Layers,
  ArrowLeft,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import { MACHINE_REGISTRY } from '../data/machineRegistry';
import { BlueprintSchematicView } from '../components/machine-animations/BlueprintSchematicView';

export const MachineDeepAnalyticsPage: React.FC = () => {
  const { machineId } = useParams<{ machineId?: string }>();
  const navigate = useNavigate();

  const selectedMachine =
    MACHINE_REGISTRY.find(
      (m) =>
        m.id.toLowerCase() === machineId?.toLowerCase() ||
        m.code.toLowerCase() === machineId?.toLowerCase()
    ) || MACHINE_REGISTRY[0];

  // Canvas Ref for Temperature Live Sparkline
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live Telemetry Simulated State
  const [baseTemp, setBaseTemp] = useState<number>(selectedMachine.status === 'critical' ? 89.2 : 68.5);
  const [pressureDisc, setPressureDisc] = useState<number>(8.64);
  const [pressureSuct, setPressureSuct] = useState<number>(1.21);
  const [soundDb, setSoundDb] = useState<number>(selectedMachine.status === 'critical' ? 96.2 : 74.2);
  const [vfdRpm, setVfdRpm] = useState<number>(selectedMachine.rpm || 2950);
  const [impactsRate, setImpactsRate] = useState<number>(1246);

  // Update telemetry baselines when machine changes
  useEffect(() => {
    setBaseTemp(selectedMachine.status === 'critical' ? 89.2 : 68.5);
    setSoundDb(selectedMachine.status === 'critical' ? 96.2 : 74.2);
    setVfdRpm(selectedMachine.rpm || 2950);
  }, [selectedMachine.id]);

  // Equalizer heights array (14 bars)
  const [eqHeights, setEqHeights] = useState<number[]>([
    15, 14, 13, 20, 28, 31, 34, 46, 52, 36, 24, 18, 15, 9,
  ]);

  // Buffer points for sparkline
  const tempPointsRef = useRef<number[]>([]);

  // Initialize buffer
  useEffect(() => {
    const initialPoints = [];
    for (let i = 0; i < 50; i++) {
      initialPoints.push(88.1 + (Math.random() - 0.5) * 0.8);
    }
    tempPointsRef.current = initialPoints;
  }, []);

  // Telemetry simulation loop (70ms tick)
  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      frame++;

      // 1. Organic Temperature Jitter
      const tempJitter = (Math.random() - 0.48) * 0.22;
      setBaseTemp((prev) => {
        const next = Math.min(91.2, Math.max(88.0, prev + tempJitter));
        if (tempPointsRef.current.length >= 50) {
          tempPointsRef.current.shift();
        }
        tempPointsRef.current.push(next);
        return next;
      });

      // 2. Pressure Fluctuation
      const pD = 8.62 + (Math.random() - 0.5) * 0.08;
      const pS = 1.20 + (Math.random() - 0.5) * 0.04;
      setPressureDisc(parseFloat(pD.toFixed(2)));
      setPressureSuct(parseFloat(pS.toFixed(2)));

      // 3. Audio Equalizer Dancing (Concentrated in 10-14 kHz bars)
      const baseHeights = [12, 16, 14, 22, 28, 34, 32, 42, 48, 40, 26, 20, 16, 10];
      const newHeights = baseHeights.map((h, idx) => {
        const boost = idx >= 6 && idx <= 9 ? Math.random() * 12 - 4 : Math.random() * 8 - 4;
        return Math.max(6, Math.min(52, h + boost));
      });
      setEqHeights(newHeights);

      // 4. Occasional Sound dB & VFD Jitter
      if (frame % 4 === 0) {
        setSoundDb(parseFloat((96.4 + (Math.random() - 0.5) * 0.6).toFixed(1)));
        setImpactsRate(Math.floor(1230 + Math.random() * 25));
        setVfdRpm(Math.floor(3418 + Math.random() * 6));
      }

      // 5. Draw Canvas Sparkline
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const w = canvas.width;
          const h = canvas.height;
          ctx.clearRect(0, 0, w, h);

          // Grid line
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, h * 0.5);
          ctx.lineTo(w, h * 0.5);
          ctx.stroke();

          // Smooth gradient area fill
          const grad = ctx.createLinearGradient(0, 0, 0, h);
          grad.addColorStop(0, 'rgba(245, 158, 11, 0.4)');
          grad.addColorStop(1, 'rgba(245, 158, 11, 0.0)');

          ctx.beginPath();
          const points = tempPointsRef.current;
          const step = w / (points.length - 1 || 1);
          const minT = 85.0;
          const maxT = 92.0;

          for (let i = 0; i < points.length; i++) {
            const val = points[i];
            const y = h - ((val - minT) / (maxT - minT)) * (h - 8) - 4;
            const x = i * step;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }

          ctx.strokeStyle = '#F59E0B';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          ctx.lineTo(w, h);
          ctx.lineTo(0, h);
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.fill();
        }
      }
    }, 70);

    return () => clearInterval(interval);
  }, []);

  const handleEStop = () => {
    alert(
      `EMERGENCY STOP INITIATED FOR ${selectedMachine.name}.\nMotor powering down safely. Machine isolation triggered.`
    );
  };

  const deltaPressure = (pressureDisc - pressureSuct).toFixed(2);

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#08080a] text-[#E4E4E7] font-sans select-none p-2.5 xl:p-3 flex flex-col justify-between gap-2.5 overflow-hidden">
      <div className="max-w-[1920px] mx-auto w-full flex flex-col justify-between h-full gap-2.5">
        {/* Top Header */}
        <header className="bg-[#121218] rounded-xl px-4 py-2 flex flex-wrap items-center justify-between border border-[#2a2a34] shadow relative z-40 gap-2">
          <div className="flex items-center gap-2.5">
            <Link
              to="/dashboard"
              className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 transition-all flex items-center gap-1.5 font-mono text-xs font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>DASHBOARD</span>
            </Link>
            <Link
              to="/"
              title="Return to Landing Page"
              className="font-ndot-57 text-sm sm:text-base font-bold tracking-tight text-white uppercase flex items-center gap-2 hover:text-red-400 transition-colors cursor-pointer group"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block group-hover:scale-110 transition-transform" />
              <span>MACHINE TWIN &amp; ANALYTICS — {selectedMachine.name}</span>
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 bg-black/60 px-3 py-1 rounded-lg border border-zinc-800 font-mono text-xs">
              <span className="text-zinc-400 font-semibold hidden md:inline text-[11px]">SELECT MACHINE:</span>
              <select
                value={selectedMachine.id}
                onChange={(e) => navigate(`/analytics/${e.target.value}`)}
                className="bg-transparent text-white font-mono text-xs font-bold focus:outline-none cursor-pointer"
              >
                {MACHINE_REGISTRY.map((m) => (
                  <option key={m.id} value={m.id} className="bg-[#121218] text-white">
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleEStop}
              className="flex items-center gap-1.5 bg-red-700 hover:bg-red-800 text-white font-mono text-xs font-bold uppercase px-3 py-1.5 rounded-lg transition-all shadow-sm"
            >
              <span>EMERGENCY STOP</span>
            </button>
          </div>
        </header>

        {/* Quick Compact Status Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          <div className="bg-[#121218] rounded-xl px-3 py-2 flex items-center justify-between border border-[#2a2a34] shadow-sm">
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-semibold">
                FACILITY STATUS
              </span>
              <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> 3 ZONES ONLINE
              </span>
            </div>
            <span className="text-[10px] font-mono bg-zinc-900 border border-zinc-700 text-zinc-300 px-2 py-0.5 rounded">
              ALL ONLINE
            </span>
          </div>

          <div className="bg-[#121218] rounded-xl px-3 py-2 flex items-center justify-between border border-[#2a2a34] shadow-sm">
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-semibold">
                ACTIVE ALERTS
              </span>
              <span className="text-xs font-mono font-bold text-red-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" /> {selectedMachine.activeAlertCount} ALERTS LOGGED
              </span>
            </div>
            <span className="text-[10px] font-mono bg-red-950/60 border border-red-800/60 text-red-300 px-2 py-0.5 rounded font-bold">
              {selectedMachine.status === 'critical' ? 'ATTENTION REQ' : 'MONITORING'}
            </span>
          </div>

          <div className="bg-[#121218] rounded-xl px-3 py-2 flex items-center justify-between border border-[#2a2a34] shadow-sm">
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-semibold">
                MACHINE STATUS
              </span>
              <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 mt-0.5 truncate max-w-[150px]">
                <span className={`w-2 h-2 shrink-0 rounded-full ${selectedMachine.status === 'critical' ? 'bg-red-600 animate-pulse' : selectedMachine.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                <span className="truncate">{selectedMachine.name}</span>
              </span>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${selectedMachine.status === 'critical' ? 'bg-red-950/60 border border-red-800/60 text-red-300' : selectedMachine.status === 'warning' ? 'bg-amber-950/60 border border-amber-800/60 text-amber-300' : 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-300'}`}>
              {selectedMachine.status === 'critical' ? 'STOP REQ' : selectedMachine.status === 'warning' ? 'MAINT' : 'NOMINAL'}
            </span>
          </div>

          <div className="bg-[#121218] rounded-xl px-3 py-2 flex items-center justify-between border border-[#2a2a34] shadow-sm">
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block font-semibold">
                LIVE TELEMETRY
              </span>
              <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-sky-400" /> 60 FPS • MODBUS 0x07F4
              </span>
            </div>
            <span className="text-[10px] font-mono bg-zinc-900 border border-zinc-700 text-emerald-400 px-2 py-0.5 rounded font-bold">
              REAL-TIME
            </span>
          </div>
        </div>

        {/* Top Row: Dynamic Blueprint CAD Schematic (8 cols) + Condition Score (4 cols) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-2.5">
          {/* Dynamic Machine Blueprint CAD Line Art Stage */}
          <BlueprintSchematicView
            machine={selectedMachine}
            soundDb={soundDb}
            baseTemp={baseTemp}
            pressureDisc={pressureDisc}
            pressureSuct={pressureSuct}
            vfdRpm={vfdRpm}
          />

          {/* Right Side: Condition & Performance Radial Gauge */}
          <div className="xl:col-span-4 bg-[#121218]/90 backdrop-blur-md rounded-xl p-3 flex flex-col justify-between border border-zinc-800 shadow-md">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2">
                <span className="font-mono text-xs font-bold text-white tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-zinc-400" />
                  MACHINE CONDITION SCORE
                </span>
                <span className="text-zinc-400 font-mono text-[10px]">{selectedMachine.category}</span>
              </div>

              {/* Radial Gauge with Dashed Arc Track */}
              <div className="relative flex flex-col items-center justify-center my-1">
                <svg className="w-44 h-24 select-none" viewBox="0 0 200 115">
                  <path
                    d="M 20 105 A 80 80 0 0 1 180 105"
                    fill="none"
                    stroke="#26262d"
                    strokeWidth="12"
                    strokeDasharray="3.5 3"
                  />
                  <path
                    d="M 20 105 A 80 80 0 0 1 156 48"
                    fill="none"
                    stroke={selectedMachine.healthScore < 70 ? '#D71920' : selectedMachine.healthScore < 85 ? '#F59E0B' : '#10B981'}
                    strokeWidth="12"
                    strokeDasharray="3.5 3"
                  />
                </svg>
                <div className="absolute bottom-1 flex flex-col items-center">
                  <div className="text-3xl font-mono font-bold text-white tracking-tight flex items-baseline leading-none">
                    {selectedMachine.healthScore}<span className="text-lg text-[#D71920] font-semibold">%</span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 mt-0.5 uppercase tracking-wider font-semibold">
                    Overall Condition
                  </div>
                </div>
              </div>

              {/* Operating Metrics List */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-800 text-[11px] font-mono">
                <div className="flex items-center justify-between py-1 border-b border-zinc-900">
                  <span className="text-zinc-400">Operating Mode</span>
                  <span className="text-white font-bold">Automatic [VFD]</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-zinc-900">
                  <span className="text-zinc-400">Acoustic Spike</span>
                  <span className="text-[#D71920] font-bold">+14.4 dB [CRIT]</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-zinc-900">
                  <span className="text-zinc-400">Thermal Index</span>
                  <span className="text-amber-400 font-bold">
                    {baseTemp.toFixed(1)} °C (+{(baseTemp - 75).toFixed(1)}°)
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-zinc-900">
                  <span className="text-zinc-400">Active Pressure</span>
                  <span className="text-cyan-400 font-bold">
                    {pressureDisc.toFixed(2)} / {pressureSuct.toFixed(2)} bar
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-zinc-400">Predictive RUL</span>
                  <span className="text-white font-bold">04.2 Hours</span>
                </div>
              </div>
            </div>

            {/* Hazard Alert Bar */}
            <div className="mt-2 pt-2 border-t border-zinc-800">
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                <div className="bg-[#D71920] h-full rounded-full w-[78%] animate-pulse" />
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 mt-1 uppercase tracking-wider">
                <span className="text-zinc-300">HAZARD: CAVITATION</span>
                <span className="text-[#D71920] font-bold">STOP DISPATCH REQ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: 3 STRICT LIVE ANIMATED MOTION ANALYTICS MODULES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* MODULE 1: Live Animated Temperature Analytics */}
          <div className="bg-[#121218]/90 backdrop-blur-md rounded-xl p-3 border-l-4 border-l-amber-500 border border-zinc-800 shadow-md flex flex-col justify-between min-h-[160px] max-h-[175px]">
            <div>
              <div className="flex items-center justify-between text-xs font-mono pb-1.5 border-b border-zinc-800">
                <div className="flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-white font-bold uppercase tracking-wider text-[11px]">Temperature Analytics</span>
                </div>
                <span className="text-[9px] text-amber-400 font-bold px-1.5 py-0.2 rounded bg-amber-500/15 border border-amber-500/40">
                  +13.1°C WARN
                </span>
              </div>

              <div className="my-1.5 flex items-baseline justify-between">
                <div>
                  <div className="font-mono text-2xl font-bold text-amber-400 tracking-tight leading-none">
                    {baseTemp.toFixed(1)}
                    <span className="text-xs text-zinc-400 font-normal"> °C</span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 mt-0.5">Bearing &amp; Seal Skin Temp</div>
                </div>
                <div className="text-right text-[10px] font-mono">
                  <div className="text-zinc-500">Limit: 75.0 °C</div>
                  <div className="text-amber-400 font-semibold flex items-center justify-end gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    <span>OVERHEATING</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Live Canvas Streaming Sparkline Curve */}
              <div className="relative w-full h-10 bg-black/80 rounded-md p-1 overflow-hidden border border-zinc-800 my-1">
                <canvas ref={canvasRef} width={340} height={40} className="w-full h-full block" />
                <div className="absolute top-0.5 right-1.5 text-[8px] font-mono text-zinc-500">LIVE TICK</div>
              </div>
            </div>

            <div>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (baseTemp / 100) * 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 mt-1">
                <span>Cooling Jacket: 42 L/min</span>
                <span className="text-amber-300 font-semibold">Stress: High</span>
              </div>
            </div>
          </div>

          {/* MODULE 2: Live Animated Pressure Analytics */}
          <div className="bg-[#121218]/90 backdrop-blur-md rounded-xl p-3 border-l-4 border-l-cyan-400 border border-zinc-800 shadow-md flex flex-col justify-between min-h-[160px] max-h-[175px]">
            <div>
              <div className="flex items-center justify-between text-xs font-mono pb-1.5 border-b border-zinc-800">
                <div className="flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-white font-bold uppercase tracking-wider text-[11px]">Pressure Analytics</span>
                </div>
                <span className="text-[9px] text-cyan-400 font-bold px-1.5 py-0.2 rounded bg-cyan-400/10 border border-cyan-400/40">
                  HEAD DEFICIT
                </span>
              </div>

              <div className="my-1.5 flex items-baseline justify-between">
                <div>
                  <div className="font-mono text-2xl font-bold text-white tracking-tight leading-none">
                    <span className="text-cyan-400">{pressureDisc.toFixed(2)}</span>
                    <span className="text-zinc-500 font-normal text-base"> / </span>
                    <span className="text-amber-400 text-xl">{pressureSuct.toFixed(2)}</span>{' '}
                    <span className="text-[10px] text-zinc-400 font-normal">bar</span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 mt-0.5">Discharge vs Suction Head</div>
                </div>
                <div className="text-right text-[10px] font-mono">
                  <div className="text-zinc-400">
                    ΔP: <span className="text-white font-bold">{deltaPressure} bar</span>
                  </div>
                  <div className="text-[#D71920] font-semibold">NPSHa &lt; 3.0m</div>
                </div>
              </div>

              {/* Live Undulating Safety Differential Stream Graphic */}
              <div className="relative w-full h-10 bg-black/80 rounded-md p-1.5 overflow-hidden border border-zinc-800 my-1 flex flex-col justify-center gap-1">
                <div className="flex justify-between text-[8px] font-mono text-zinc-400 leading-none">
                  <span>Suct: {pressureSuct.toFixed(2)} bar</span>
                  <span>Disc: {pressureDisc.toFixed(2)} bar</span>
                </div>
                <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden flex border border-zinc-800">
                  <div
                    className="bg-amber-400 h-full transition-all duration-150"
                    style={{ width: `${(pressureSuct / 4) * 50}%` }}
                  />
                  <div className="bg-transparent h-full" style={{ width: '25%' }} />
                  <div
                    className="bg-cyan-400 h-full transition-all duration-150"
                    style={{ width: `${(pressureDisc / 10) * 55}%` }}
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                <div className="bg-cyan-400 h-full rounded-full transition-all duration-200" style={{ width: '65%' }} />
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 mt-1">
                <span>Margin NPSH</span>
                <span className="text-[#D71920] font-bold">-0.9m Critical</span>
              </div>
            </div>
          </div>

          {/* MODULE 3: Live Animated Sound Analytics (Equalizer) */}
          <div className="bg-[#121218]/90 backdrop-blur-md rounded-xl p-3 border-l-4 border-l-[#D71920] border border-zinc-800 shadow-md flex flex-col justify-between min-h-[160px] max-h-[175px]">
            <div>
              <div className="flex items-center justify-between text-xs font-mono pb-1.5 border-b border-zinc-800">
                <div className="flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-[#D71920]" />
                  <span className="text-white font-bold uppercase tracking-wider text-[11px]">Sound Analytics</span>
                </div>
                <span className="text-[9px] text-[#D71920] font-bold px-1.5 py-0.2 rounded bg-[#D71920]/20 border border-[#D71920]/50">
                  PEAK 12.4 kHz
                </span>
              </div>

              <div className="my-1.5 flex items-baseline justify-between">
                <div>
                  <div className="font-mono text-2xl font-bold text-[#D71920] tracking-tight leading-none">
                    {soundDb.toFixed(1)}
                    <span className="text-xs text-zinc-400 font-normal"> dB</span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 mt-0.5">Cavitation Shock Hiss</div>
                </div>
                <div className="text-right text-[10px] font-mono">
                  <div className="text-zinc-500">Base: 68.2 dB</div>
                  <div className="text-[#D71920] font-semibold flex items-center justify-end gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D71920] animate-ping" />
                    <span>HIGH HAZARD</span>
                  </div>
                </div>
              </div>

              {/* Real-Time Dancing Frequency Equalizer Bars */}
              <div className="relative w-full h-10 bg-black/80 rounded-md p-1.5 overflow-hidden border border-zinc-800 my-1 flex items-end justify-between gap-1">
                {eqHeights.map((h, i) => {
                  let barColor = 'bg-zinc-700';
                  if (i >= 4 && i <= 6) barColor = 'bg-zinc-500';
                  if (i === 6 || i === 10) barColor = 'bg-amber-400';
                  if (i >= 7 && i <= 9) barColor = 'bg-[#D71920]';

                  return (
                    <div
                      key={i}
                      className={`${barColor} w-1.5 rounded-t transition-all duration-75`}
                      style={{ height: `${Math.min(32, Math.max(4, h * 0.65))}px` }}
                    />
                  );
                })}
              </div>
            </div>

            <div>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                <div className="bg-[#D71920] h-full rounded-full w-[94%] animate-pulse" />
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400 mt-1">
                <span>Velocity: 1,482 m/s</span>
                <span className="text-white font-semibold">{impactsRate} Impacts/s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex flex-wrap items-center justify-between text-[10px] font-mono text-zinc-500 py-1 px-1 border-t border-zinc-800/80">
          <div className="flex items-center gap-2">
            <Link to="/" title="Return to Landing Page" className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer group">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-zinc-300 group-hover:text-white">SCADA 2.5</span>
            </Link>
            <span className="text-zinc-700">•</span>
            <span>{selectedMachine.name} DIGITAL TWIN</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> MODBUS LIVE
            </span>
            <span className="text-zinc-400">LATENCY: 4ms</span>
            <span className="text-zinc-600">|</span>
            <Link to="/dashboard" className="text-zinc-300 hover:text-white transition-colors">
              ← RETURN TO FACTORY MAP
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

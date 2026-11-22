import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Upload,
  ArrowRight,
  Cpu,
} from 'lucide-react';
import { machineService } from '../services/machineService';
import { MACHINE_REGISTRY } from '../data/machineRegistry';

export const MachineRegistrationPage: React.FC = () => {
  const navigate = useNavigate();

  // Form input states
  const [machineId, setMachineId] = useState<string>('ROBOTIC-01');
  const [machineName, setMachineName] = useState<string>('Laser Deposition Welder & Annealer');
  const [hardwareMac, setHardwareMac] = useState<string>('HW-ETH-00:1B:44:11:3A:B7');
  const [machineType, setMachineType] = useState<string>('robotic-arm');
  const [protocol, setProtocol] = useState<string>('opcua');
  const [zone, setZone] = useState<string>('Zone B - Robotics & Stamping');
  const [silLevel, setSilLevel] = useState<string>('Dual Relay Emergency Stop');
  const [samplingFreq, setSamplingFreq] = useState<string>('500 Hz');
  const [baselineRpm, setBaselineRpm] = useState<number>(3000);

  // Toast state
  const [registeredId, setRegisteredId] = useState<string | null>(null);

  const generateAutoMac = () => {
    const randomHex = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0')
        .toUpperCase()
    ).join(':');
    setHardwareMac(`HW-ETH-${randomHex}`);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!machineId || !machineName) return;

    const formattedCode = machineId.toUpperCase();
    const formattedId = formattedCode.toLowerCase();

    let category = 'Rotating Machinery';
    let animationProfile = machineType;
    if (machineType === 'pump') {
      category = 'Fluid Movement & Pumping';
      animationProfile = 'centrifugal-pump';
    } else if (machineType === 'cnc') {
      category = 'Machine Tools & Machining';
      animationProfile = 'cnc-milling';
    } else if (machineType === 'lathe') {
      category = 'Machine Tools & Turning';
      animationProfile = 'lathe-machine';
    } else if (machineType === 'press') {
      category = 'Heavy Forming & Stamping';
      animationProfile = 'hydraulic-press';
    } else if (machineType === 'asrs') {
      category = 'High-Bay Logistics & Robotics';
      animationProfile = 'asrs-system';
    } else if (machineType === 'compressor') {
      category = 'Air & Gas Compression';
      animationProfile = 'industrial-compressor';
    } else if (machineType === 'fan') {
      category = 'HVAC & Industrial Ventilation';
      animationProfile = 'industrial-fan';
    } else if (machineType === 'motor') {
      category = 'Rotating Equipment';
      animationProfile = 'industrial-motor';
    } else if (machineType === 'conveyor') {
      category = 'Material Handling & Conveyance';
      animationProfile = 'belt-conveyor';
    }

    const newMachine = {
      id: formattedId,
      code: formattedCode,
      name: machineName,
      category,
      industry: zone,
      description: `Hardware Asset registered on ${protocol.toUpperCase()} industrial bus with ${silLevel}.`,
      manufacturer: 'SCADA Certified Automation',
      model: hardwareMac,
      installationDate: new Date().toISOString().split('T')[0],
      status: 'running' as const,
      healthScore: 98,
      rpm: baselineRpm,
      runtimeHours: 0,
      animationProfile,
      animationAvailable: true,
      activeAlertCount: 0,
      lastUpdated: 'Just now',
      supportedSensors: ['sound', 'temperature', 'pressure'] as Array<'sound' | 'temperature' | 'pressure'>,
      components: [],
      sensorLocations: [],
    };

    const existingIdx = MACHINE_REGISTRY.findIndex(
      (m) => m.id === formattedId || m.code === formattedCode
    );
    if (existingIdx >= 0) {
      MACHINE_REGISTRY[existingIdx] = newMachine;
    } else {
      MACHINE_REGISTRY.unshift(newMachine);
    }

    await machineService.registerMachine(newMachine);
    setRegisteredId(formattedCode);
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#08080a] text-[#E4E4E7] font-sans select-none flex items-center justify-center p-3">
      {/* Toast Notification */}
      {registeredId && (
        <div className="fixed bottom-6 right-6 z-50 bg-black/95 backdrop-blur-md border border-emerald-500/60 p-4 rounded-2xl shadow-2xl font-mono text-xs flex items-center gap-4">
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping shadow-[0_0_10px_#10B981]" />
          <div>
            <div className="text-white font-bold tracking-wider flex items-center gap-2">
              <span>MACHINE NODE PROVISIONED</span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40">
                SUCCESS
              </span>
            </div>
            <div className="text-zinc-400 text-xs mt-0.5">
              Unit {registeredId} is now online on the SCADA telemetry bus.
            </div>
          </div>
          <button
            onClick={() => navigate(`/analytics/${registeredId}`)}
            className="px-3.5 py-1.5 rounded-xl bg-[#D71920] hover:bg-red-700 text-white font-mono text-xs font-bold uppercase transition-all shadow-md ml-2 cursor-pointer"
          >
            VIEW DEEP ANALYTICS →
          </button>
        </div>
      )}

      {/* Compact Machine Registration Form Designed for Desktop Fit */}
      <div className="w-full max-w-4xl bg-[#121218]/95 backdrop-blur-xl rounded-2xl p-5 border border-[#2a2a34] shadow-2xl relative font-mono text-xs flex flex-col gap-3.5">
        {/* Form Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <Link to="/" title="Return to Landing Page" className="flex items-center gap-2 group cursor-pointer">
              <span className="w-3 h-3 rounded-full bg-[#D71920] shadow-[0_0_8px_#D71920] animate-pulse group-hover:scale-110 transition-transform" />
              <span className="font-ndot-57 text-sm font-bold uppercase text-white tracking-widest group-hover:text-red-400 transition-colors">
                MACHINE PROVISIONING &amp; REGISTRATION
              </span>
            </Link>
            <span className="text-zinc-500 text-[11px] hidden sm:inline">
              • SCADA Asset Onboarding Gateway
            </span>
          </div>
          <span className="font-ntype-mono text-[10px] text-[#ffb4ab] uppercase font-bold bg-[#1b1c1e] px-2 py-0.5 rounded-full border border-[#d71920]/40">
            [ASSET ONBOARDING]
          </span>
        </div>

        {/* Form Fields in Balanced Desktop 3-Column Grid */}
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
          {/* Row 1: ID, Name, Classification */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
            <div className="md:col-span-3 flex flex-col gap-1">
              <label className="text-zinc-400 uppercase text-[10px] font-bold">Machine ID</label>
              <input
                type="text"
                required
                value={machineId}
                onChange={(e) => setMachineId(e.target.value)}
                placeholder="e.g. ROBOTIC-01"
                className="bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-lg text-white focus:outline-none focus:border-[#D71920] uppercase text-xs font-mono font-bold"
              />
            </div>
            <div className="md:col-span-5 flex flex-col gap-1">
              <label className="text-zinc-400 uppercase text-[10px] font-bold">Machine Designation / Name</label>
              <input
                type="text"
                required
                value={machineName}
                onChange={(e) => setMachineName(e.target.value)}
                placeholder="e.g. Laser Deposition Welder & Annealer"
                className="bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-lg text-white focus:outline-none focus:border-[#D71920] text-xs font-mono"
              />
            </div>
            <div className="md:col-span-4 flex flex-col gap-1">
              <label className="text-zinc-400 uppercase text-[10px] font-bold">Classification</label>
              <select
                value={machineType}
                onChange={(e) => setMachineType(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-lg text-white focus:outline-none focus:border-[#D71920] text-xs cursor-pointer font-mono"
              >
                <option value="pump">Centrifugal Slurry &amp; Cooling Pump</option>
                <option value="cnc">CNC 5-Axis Milling Machine</option>
                <option value="lathe">Heavy Duty CNC Lathe Machine</option>
                <option value="motor">3-Phase Induction Motor</option>
                <option value="conveyor">Industrial Heavy Belt Conveyor</option>
                <option value="fan">High-Volume Industrial Fan</option>
                <option value="compressor">Reciprocating Air Compressor</option>
                <option value="press">600-Tonne Hydraulic Deep-Draw Press</option>
                <option value="robotic-arm">6-Axis Articulated Welding Robot</option>
                <option value="asrs">High-Bay Storage &amp; Retrieval (ASRS)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Hardware Device MAC, Bus Protocol, Factory Zone */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
            <div className="md:col-span-4 flex flex-col gap-1">
              <div className="flex items-center justify-between text-[10px]">
                <label className="text-zinc-400 uppercase font-bold">Device MAC Address</label>
                <button
                  type="button"
                  onClick={generateAutoMac}
                  className="text-[#D71920] hover:underline uppercase font-bold text-[9px] cursor-pointer"
                >
                  + AUTO MAC
                </button>
              </div>
              <input
                type="text"
                required
                value={hardwareMac}
                onChange={(e) => setHardwareMac(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-lg text-white focus:outline-none focus:border-[#D71920] text-xs font-mono font-bold"
              />
            </div>
            <div className="md:col-span-4 flex flex-col gap-1">
              <label className="text-zinc-400 uppercase text-[10px] font-bold">Bus Protocol</label>
              <select
                value={protocol}
                onChange={(e) => setProtocol(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-lg text-white focus:outline-none focus:border-[#D71920] text-xs cursor-pointer font-mono"
              >
                <option value="opcua">OPC-UA (IEC 62541 Native)</option>
                <option value="canbus">CAN-Bus 2.0B / CANopen</option>
                <option value="modbus">Modbus-TCP / Industrial RTU</option>
                <option value="ethercat">EtherCAT High-Speed Bus</option>
              </select>
            </div>
            <div className="md:col-span-4 flex flex-col gap-1">
              <label className="text-zinc-400 uppercase text-[10px] font-bold">Factory Zone Deployment</label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-lg text-white focus:outline-none focus:border-[#D71920] text-xs cursor-pointer font-mono"
              >
                <option value="Zone A - Precision Fabrication">Zone A - Precision Fabrication</option>
                <option value="Zone B - Robotics & Stamping">Zone B - Robotics &amp; Stamping</option>
                <option value="Zone C - Heavy Utility & Fleet">Zone C - Heavy Utility &amp; Fleet</option>
                <option value="Zone D - Metrology Lab">Zone D - Metrology Lab</option>
              </select>
            </div>
          </div>

          {/* Row 3: Safety Interlock, Baseline RPM, Sampling Frequency */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
            <div className="md:col-span-4 flex flex-col gap-1">
              <label className="text-zinc-400 uppercase text-[10px] font-bold">Safety Interlock Level</label>
              <select
                value={silLevel}
                onChange={(e) => setSilLevel(e.target.value)}
                className="bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-lg text-white focus:outline-none focus:border-[#D71920] text-xs cursor-pointer font-mono"
              >
                <option value="Dual Relay Emergency Stop">Dual Relay Emergency Stop</option>
                <option value="Fail-Safe Monitored">Fail-Safe Monitored</option>
                <option value="Standard Optical Curtain">Standard Optical Curtain</option>
              </select>
            </div>
            <div className="md:col-span-3 flex flex-col gap-1">
              <label className="text-zinc-400 uppercase text-[10px] font-bold">Rated Cycle / Speed (RPM)</label>
              <input
                type="number"
                value={baselineRpm}
                onChange={(e) => setBaselineRpm(Number(e.target.value))}
                placeholder="e.g. 3000"
                className="bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-lg text-white focus:outline-none focus:border-[#D71920] text-xs font-mono font-bold"
              />
            </div>
            <div className="md:col-span-5 flex flex-col gap-1">
              <div className="flex items-center justify-between text-[10px]">
                <label className="text-zinc-400 uppercase font-bold">Sampling Ingest Rate</label>
                <span className="text-cyan-400 font-bold">{samplingFreq}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {['100 Hz', '500 Hz', '1,000 Hz Surge'].map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setSamplingFreq(freq)}
                    className={`py-1.5 rounded-lg text-[11px] font-mono transition-all font-bold cursor-pointer ${
                      samplingFreq === freq
                        ? 'bg-[#d71920] text-white border border-[#d71920] shadow-[0_0_8px_rgba(215,25,32,0.4)]'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 4: Vector Blueprint CAD Dropzone (Compact Horizontal Strip) */}
          <div
            onClick={() => alert('CAD Blueprint dropzone ready. Supported formats: .DXF, .SVG, .STEP, .DWG')}
            className="p-3 rounded-xl bg-black/50 border border-dashed border-zinc-700 hover:border-zinc-500 flex items-center justify-between px-4 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5 text-[#ffb4ab] shrink-0" />
              <div>
                <p className="text-white text-xs font-bold uppercase">CAD Vector Schematic / Blueprint Attachment</p>
                <p className="text-[10px] text-zinc-500">Drop DXF, SVG, or STEP engineering package (Optional)</p>
              </div>
            </div>
            <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-1 rounded border border-zinc-700 uppercase font-bold">
              BROWSE
            </span>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="mt-1 w-full py-2.5 px-4 rounded-xl bg-[#D71920] hover:bg-red-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(215,25,32,0.4)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Cpu className="w-4 h-4 text-white" />
            <span>PROVISION MACHINE TO SCADA BUS</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};

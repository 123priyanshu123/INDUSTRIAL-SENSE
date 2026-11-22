import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Shield,
  Sliders,
  Bell,
  Key,
  Wifi,
  Usb,
  Fingerprint,
  Save,
  CheckCircle2,
  Clock,
  History,
  AlertTriangle,
} from 'lucide-react';
import { useAppStore } from '../store/appStore';

export const UserProfileSettingsPage: React.FC = () => {
  const { currentUser, addNotification } = useAppStore();

  // Profile Form State
  const [operatorName, setOperatorName] = useState<string>(currentUser?.name || 'Dr. Elena Rostova');
  const [callsign, setCallsign] = useState<string>('TECH_04 - ENG-9821');
  const [department, setDepartment] = useState<string>(currentUser?.department || 'Autonomous Robotics & SCADA');
  const [shift, setShift] = useState<string>(currentUser?.shift || 'Shift Alpha (06:00 - 14:00 UTC)');

  // Sensor Thresholds
  const [cavitationLimit, setCavitationLimit] = useState<number>(82.0);
  const [tempLimit, setTempLimit] = useState<number>(75.0);
  const [pressureLimit, setPressureLimit] = useState<number>(280);
  const [vibrationLimit, setVibrationLimit] = useState<number>(2.0);

  // Dispatch Toggles
  const [audibleKlaxon, setAudibleKlaxon] = useState<boolean>(true);
  const [autoDispatch, setAutoDispatch] = useState<boolean>(true);
  const [remoteEStop, setRemoteEStop] = useState<boolean>(true);
  const [autoReport, setAutoReport] = useState<boolean>(false);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMsg('Profile calibrations and sensor safety limits saved to hardware enclave.');
    addNotification('success', 'SCADA profile configuration updated successfully.');
    setTimeout(() => setToastMsg(null), 4500);
  };

  const auditLogs = [
    { time: '14:28:12 UTC', event: 'EMERGENCY STOP ARMED FOR COOLING PUMP', status: 'CRITICAL', user: 'ENG-9821' },
    { time: '14:20:05 UTC', event: 'CALIBRATED DISCHARGE PRESSURE THRESHOLD (280 bar)', status: 'OK', user: 'ENG-9821' },
    { time: '14:05:40 UTC', event: 'NFC BADGE VERIFIED AT GATEWAY ZONE-B', status: 'AUTH', user: 'SYSTEM' },
    { time: '13:58:22 UTC', event: 'OPC-UA TELEMETRY RE-SYNC COMPLETE', status: 'INFO', user: 'DAEMON' },
    { time: '13:30:11 UTC', event: 'DISPATCH WORK ORDER #4881 TO TECHNICIAN CART 04', status: 'MAINT', user: 'ENG-9821' },
  ];

  return (
    <div className="min-h-screen bg-[#08080a] text-[#E4E4E7] font-sans select-none overflow-x-hidden p-3 md:p-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0d0e10] border border-emerald-500/60 p-4 rounded-xl shadow-2xl font-mono text-xs flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <div>
            <div className="text-white font-bold tracking-wider flex items-center gap-2">
              <span>CONFIGURATION APPLIED</span>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40">
                SAVED
              </span>
            </div>
            <div className="text-zinc-400 text-xs mt-0.5">{toastMsg}</div>
          </div>
        </div>
      )}

      <div className="max-w-[1920px] mx-auto flex flex-col gap-6">
        {/* Header Banner */}
        <div className="bg-[#121218] rounded-2xl p-6 border border-[#2a2a34] flex flex-wrap items-center justify-between gap-4 shadow-md">
          <div className="flex flex-col">
            <Link to="/" title="Return to Landing Page" className="flex items-center gap-2 mb-1 group cursor-pointer">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 group-hover:scale-110 transition-transform" />
              <span className="font-ndot-55 text-xs text-zinc-400 group-hover:text-white uppercase tracking-widest font-semibold transition-colors">
                [OPERATOR CREDENTIALS & SECURITY PROTOCOLS]
              </span>
            </Link>
            <h1 className="font-ndot-57 text-2xl md:text-3xl font-bold uppercase text-white tracking-tight">
              USER PROFILE <span className="text-zinc-500">&</span> SYSTEM CALIBRATION
            </h1>
            <p className="font-ntype-mono text-xs sm:text-sm text-zinc-400 max-w-4xl mt-1">
              Manage operator callsign, assigned shift context, sensor alarm envelope calibrations, and cryptographic hardware
              authenticator bindings.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="px-3.5 py-1.5 rounded-full bg-[#1b1c1e] border border-[#292a2c] flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-white font-bold">STATION: US-EAST-FAB-19</span>
            </div>
          </div>
        </div>

        {/* 2-Column Working Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Operator Profile & Hardware Tokens (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Operator Card */}
            <div className="bg-[#121218]/90 backdrop-blur-md rounded-2xl p-5 border border-[#2a2a34] flex flex-col gap-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-[#D71920]" />
                  <span className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                    OPERATOR CREDENTIALS
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/40">
                  SECURITY ACTIVE
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border-2 border-[#D71920] flex items-center justify-center font-mono text-2xl font-bold text-[#ffb4ab] shadow-[0_0_12px_rgba(215,25,32,0.3)]">
                  {operatorName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-mono text-lg font-bold text-white">{operatorName}</h3>
                  <div className="text-xs font-mono text-[#D71920] font-bold mt-0.5">{callsign}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">{department}</div>
                </div>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-3 font-mono text-xs pt-2">
                <div className="flex flex-col gap-1">
                  <label className="text-zinc-400 uppercase text-[10px]">Operator Full Name</label>
                  <input
                    type="text"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-white focus:outline-none focus:border-white text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-zinc-400 uppercase text-[10px]">Callsign / UID</label>
                  <input
                    type="text"
                    value={callsign}
                    onChange={(e) => setCallsign(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-white focus:outline-none focus:border-white text-xs uppercase"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-zinc-400 uppercase text-[10px]">Assigned Shift Context</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 px-3 py-2 rounded text-white focus:outline-none focus:border-white text-xs cursor-pointer"
                  >
                    <option value="Shift Alpha (06:00 - 14:00 UTC)">Shift Alpha (06:00 - 14:00 UTC)</option>
                    <option value="Shift Bravo (14:00 - 22:00 UTC)">Shift Bravo (14:00 - 22:00 UTC)</option>
                    <option value="Shift Charlie (22:00 - 06:00 UTC)">Shift Charlie (22:00 - 06:00 UTC)</option>
                  </select>
                </div>
              </form>
            </div>

            {/* Hardware Authenticator Tokens */}
            <div className="bg-[#121218]/90 backdrop-blur-md rounded-2xl p-5 border border-[#2a2a34] flex flex-col gap-3 font-mono text-xs shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-white uppercase tracking-wider">HARDWARE 2FA CHANNELS</span>
                </div>
                <span className="text-[10px] text-zinc-500">TPM 2.0</span>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Wifi className="w-4 h-4 text-zinc-400" />
                    <div>
                      <div className="text-white font-bold text-xs">RFID/NFC BADGE</div>
                      <div className="text-[10px] text-zinc-500">UID: 04:A2:8B:19:9C:F0:01</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    BOUND
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Usb className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="text-white font-bold text-xs">FIDO2 / YUBIKEY</div>
                      <div className="text-[10px] text-zinc-500">SER: YUBI-5C-NFC-9941</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                    INSERTED
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Fingerprint className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-white font-bold text-xs">BIOMETRIC VAULT</div>
                      <div className="text-[10px] text-zinc-500">CALIBRATED: THUMB + RETINA</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    VALID
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sensor Calibrations & Security Audit (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Sensor Alarm Calibrations */}
            <div className="bg-[#121218]/90 backdrop-blur-md rounded-2xl p-5 border border-[#2a2a34] flex flex-col gap-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                    SENSOR TELEMETRY ALARM CALIBRATION
                  </span>
                </div>
                <span className="text-zinc-500 font-mono text-[10px]">IEC 60034-14</span>
              </div>

              <div className="space-y-4 font-mono text-xs">
                {/* Acoustic Limit */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-zinc-300">Acoustic Cavitation Alarm Limit</span>
                    <span className="text-[#D71920] font-bold text-sm">{cavitationLimit.toFixed(1)} dB</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="110"
                    step="0.5"
                    value={cavitationLimit}
                    onChange={(e) => setCavitationLimit(parseFloat(e.target.value))}
                    className="w-full accent-[#D71920] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 mt-0.5">
                    <span>60.0 dB (Quiet)</span>
                    <span>Nominal: 82.0 dB</span>
                    <span>110.0 dB (Severe)</span>
                  </div>
                </div>

                {/* Temperature Limit */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-zinc-300">Bearing Temperature Overheat Limit</span>
                    <span className="text-amber-400 font-bold text-sm">{tempLimit.toFixed(1)} °C</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="120"
                    step="0.5"
                    value={tempLimit}
                    onChange={(e) => setTempLimit(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 mt-0.5">
                    <span>50.0 °C (Ambient)</span>
                    <span>Threshold: 75.0 °C</span>
                    <span>120.0 °C (Hazard)</span>
                  </div>
                </div>

                {/* Pressure Limit */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-zinc-300">Hydraulic Pressure Safety Cutoff</span>
                    <span className="text-cyan-400 font-bold text-sm">{pressureLimit} bar</span>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="400"
                    step="5"
                    value={pressureLimit}
                    onChange={(e) => setPressureLimit(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 mt-0.5">
                    <span>150 bar</span>
                    <span>Rated Max: 280 bar</span>
                    <span>400 bar</span>
                  </div>
                </div>

                {/* Vibration Limit */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-zinc-300">Vibration Harmonic Cutoff (ISO 10816)</span>
                    <span className="text-[#ffb4ab] font-bold text-sm">{vibrationLimit.toFixed(1)} G</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="6.0"
                    step="0.1"
                    value={vibrationLimit}
                    onChange={(e) => setVibrationLimit(parseFloat(e.target.value))}
                    className="w-full accent-red-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 mt-0.5">
                    <span>0.5 G (Smooth)</span>
                    <span>Warning: 2.0 G</span>
                    <span>6.0 G (Critical)</span>
                  </div>
                </div>
              </div>

              {/* Dispatch & Escalation Toggles */}
              <div className="pt-3 border-t border-zinc-800 space-y-2 font-mono text-xs">
                <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider mb-2">
                  SAFETY ESCALATION MATRIX
                </div>

                <label className="flex items-center justify-between p-2 rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer">
                  <span className="text-zinc-300">Audible Plant Floor Klaxon on E-STOP</span>
                  <input
                    type="checkbox"
                    checked={audibleKlaxon}
                    onChange={(e) => setAudibleKlaxon(e.target.checked)}
                    className="w-4 h-4 accent-[#D71920]"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer">
                  <span className="text-zinc-300">Automate Work Order Dispatch to Technician Carts</span>
                  <input
                    type="checkbox"
                    checked={autoDispatch}
                    onChange={(e) => setAutoDispatch(e.target.checked)}
                    className="w-4 h-4 accent-[#D71920]"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer">
                  <span className="text-zinc-300">Enable Hardware Remote Emergency Stop Override</span>
                  <input
                    type="checkbox"
                    checked={remoteEStop}
                    onChange={(e) => setRemoteEStop(e.target.checked)}
                    className="w-4 h-4 accent-[#D71920]"
                  />
                </label>
              </div>

              <button
                onClick={handleSaveSettings}
                className="w-full py-2.5 px-4 rounded-xl bg-[#D71920] hover:bg-red-700 text-white font-mono font-bold uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>SAVE CONFIGURATION</span>
              </button>
            </div>

            {/* Cryptographic Security Audit Log */}
            <div className="bg-[#121218]/90 backdrop-blur-md rounded-2xl p-5 border border-[#2a2a34] flex flex-col gap-3 font-mono text-xs shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white uppercase tracking-wider">
                    SYSTEM AUDIT TRAIL & LOGS
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500">SHA-256 SIGNED</span>
              </div>

              <div className="space-y-1.5 overflow-x-auto">
                {auditLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-black/60 border border-zinc-800/80 flex items-center justify-between text-[11px]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500">{log.time}</span>
                      <span className="text-zinc-300 font-medium">{log.event}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          log.status === 'CRITICAL'
                            ? 'bg-[#D71920]/20 text-[#D71920]'
                            : log.status === 'AUTH'
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {log.status}
                      </span>
                      <span className="text-zinc-500 text-[10px]">{log.user}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

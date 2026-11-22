import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  Key,
  ShieldCheck,
  UserPlus,
  Cpu,
  BadgeAlert,
  ArrowRight,
  Fingerprint,
  Usb,
  Wifi,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';
import { useAppStore } from '../store/appStore';

export const UserRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, addNotification } = useAppStore();

  const [authMode, setAuthMode] = useState<'signin' | 'enroll'>('enroll');
  const [operatorId, setOperatorId] = useState<string>('TECH_04 - ENG-9821');
  const [passphrase, setPassphrase] = useState<string>('SIG4_8819_ALPHA_KEY');
  const [showPass, setShowPass] = useState<boolean>(false);
  const [sector, setSector] = useState<string>('b');

  // Enrollment fields
  const [badgeSerial, setBadgeSerial] = useState<string>('04:A2:8B:19:9C:F0:01');
  const [sectorCode, setSectorCode] = useState<string>('SEC-ZONE-B4');
  const [operationalRole, setOperationalRole] = useState<string>('scada');
  const [supervisorKey, setSupervisorKey] = useState<string>('SUPV-OCT-9901-OVERRIDE');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      login('admin');
      if (authMode === 'enroll') {
        addNotification('success', `Personnel ${badgeSerial} provisioned with ${operationalRole.toUpperCase()} clearance.`);
      } else {
        addNotification('success', `Session authorized for ${operatorId}.`);
      }
      navigate('/dashboard');
    }, 700);
  };

  const handleGuestAccess = () => {
    login('viewer');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#08080a] text-[#E4E4E7] font-sans flex flex-col items-center justify-center p-3 relative overflow-hidden select-none">
      {/* Background radial gradient mesh */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-[#D71920]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-zinc-800/30 rounded-full blur-3xl pointer-events-none" />

      {/* Gateway Coordinate Bar */}
      <div className="w-full max-w-2xl flex items-center justify-between py-1.5 px-4 mb-3 bg-[#0d0e10] text-zinc-400 font-mono text-xs rounded-xl border border-zinc-800 shadow-sm relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span>LOC: ZONE-B - GATEWAY_SYS_01</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="hidden sm:inline">TPM_STATE: LOCKED_ENCLAVE</span>
          <span className="text-zinc-200">SYS.VER: 4.19.8-LTS</span>
        </div>
      </div>

      {/* Main Unified Chassis */}
      <div className="w-full max-w-2xl bg-[#121218]/95 backdrop-blur-xl rounded-2xl shadow-2xl relative z-10 overflow-hidden border border-zinc-800">
        {/* Top Hazard Ribbon Bar */}
        <div className="w-full h-1.5 bg-gradient-to-r from-[#D71920] via-zinc-700 to-[#D71920]" />

        <div className="p-5 sm:p-7 flex flex-col gap-5">
          {/* Brand & Mode Switcher Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
            <Link
              to="/"
              title="Return to Landing Page"
              className="flex items-center gap-3 group cursor-pointer hover:opacity-90 transition-opacity"
            >
              <div className="w-9 h-9 rounded-xl bg-[#D71920] flex items-center justify-center text-white shadow-[0_0_10px_#D71920] group-hover:scale-105 transition-transform">
                <Lock className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-xs tracking-wider text-zinc-400 group-hover:text-zinc-300 transition-colors">INDUSTRIALSENSE SCADA</span>
                <span className="font-mono text-lg font-bold text-white tracking-tight group-hover:text-red-400 transition-colors">SECURITY GATEWAY</span>
              </div>
            </Link>

            {/* Mode Toggle Segmented Control */}
            <div className="flex items-center bg-[#0d0e10] p-1 rounded-xl border border-zinc-800 self-start sm:self-auto font-mono text-xs">
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  authMode === 'signin'
                    ? 'bg-zinc-800 text-white font-bold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                [ OPERATOR SIGN-IN ]
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('enroll')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  authMode === 'enroll'
                    ? 'bg-zinc-800 text-white font-bold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                [ NEW ENROLLMENT ]
              </button>
            </div>
          </div>

          {/* Clearance Notice Banner */}
          <div className="bg-[#1b1b22] p-3.5 rounded-xl flex items-start gap-3 border border-zinc-800 font-mono text-xs">
            <ShieldCheck className="w-5 h-5 text-[#D71920] shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-bold text-[#ffb4ab]">FACILITY CLEARANCE MANDATE: LEVEL-4</span>
              <p className="text-zinc-400 text-[11px] mt-0.5 leading-relaxed font-sans">
                Cryptographic operator authorization required. Access logged to plant audit registry.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-mono text-xs">
            {authMode === 'signin' ? (
              /* ================= SIGN IN MODE ================= */
              <>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <label className="text-zinc-400">OPERATOR CALLSIGN / UID</label>
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-[#ffb4ab] text-[10px] font-bold">
                      [VERIFIED CACHE]
                    </span>
                  </div>
                  <div className="flex items-center bg-[#0d0e10] rounded-xl px-3.5 py-2.5 border border-zinc-800 focus-within:border-zinc-500">
                    <span className="text-zinc-500 mr-2 font-mono text-xs">•</span>
                    <input
                      type="text"
                      required
                      value={operatorId}
                      onChange={(e) => setOperatorId(e.target.value)}
                      className="w-full bg-transparent text-white outline-none text-xs"
                    />
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-2" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <label className="text-zinc-400">AUTHENTICATION PASSPHRASE</label>
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="text-zinc-400 hover:text-white"
                    >
                      {showPass ? '[ CONCEAL KEY ]' : '[ REVEAL KEY ]'}
                    </button>
                  </div>
                  <div className="flex items-center bg-[#0d0e10] rounded-xl px-3 py-2 border border-zinc-800 focus-within:border-zinc-500">
                    <Key className="w-4 h-4 text-zinc-500 mr-2" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      value={passphrase}
                      onChange={(e) => setPassphrase(e.target.value)}
                      className="w-full bg-transparent text-white outline-none text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-zinc-400 text-[11px]">TARGET WORKSPACE SECTOR</label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full bg-[#0d0e10] border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none text-xs cursor-pointer"
                  >
                    <option value="b">ZONE B: AUTOMATION CELLS & KUKA ROBOTICS [ACTIVE]</option>
                    <option value="a">ZONE A: HYDRAULIC PRESS ARRAYS & COLD STAMPING</option>
                    <option value="c">ZONE C: CRYOGENIC STORAGE & COMPRESSOR TANKS</option>
                    <option value="all">FACILITY-WIDE OVERRIDE (CHIEF SAFETY COMMISSION)</option>
                  </select>
                </div>

                {/* Hardware 2FA Channels */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <span className="text-zinc-400 text-[10px]">HARDWARE 2FA VERIFICATION CHANNELS</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-xl bg-[#0d0e10] border border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4 text-zinc-400" />
                        <span className="text-white text-[11px]">NFC BADGE</span>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-[#D71920] animate-ping" />
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#1b1c1e] border border-zinc-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Usb className="w-4 h-4 text-cyan-400" />
                        <span className="text-white text-[11px]">FIDO2 TOKEN</span>
                      </div>
                      <span className="text-cyan-400 text-[10px] font-bold">[INSERTED]</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0d0e10] border border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Fingerprint className="w-4 h-4 text-zinc-400" />
                        <span className="text-white text-[11px]">BIOMETRIC</span>
                      </div>
                      <span className="text-emerald-400 text-[10px]">READY</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* ================= NEW ENROLLMENT MODE ================= */
              <>
                <div className="bg-[#0d0e10] p-3 rounded-xl border border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold block">PROVISION NEW FIELD PERSONNEL</span>
                    <span className="text-zinc-400 text-[11px]">
                      Requires supervisor authorization key and physical RFID badge issuance.
                    </span>
                  </div>
                  <UserPlus className="w-6 h-6 text-[#D71920]" />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <label className="text-zinc-400">HARDWARE BADGE SERIAL NUMBER</label>
                    <span className="text-zinc-500 text-[10px]">16-BYTE UID</span>
                  </div>
                  <div className="flex items-center bg-[#0d0e10] rounded-xl px-3 py-2 border border-zinc-800">
                    <Wifi className="w-4 h-4 text-zinc-500 mr-2" />
                    <input
                      type="text"
                      required
                      value={badgeSerial}
                      onChange={(e) => setBadgeSerial(e.target.value)}
                      placeholder="e.g. 04:A2:8B:19:9C:F0:01"
                      className="w-full bg-transparent text-white outline-none text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-zinc-400 text-[11px]">PLANT SECTOR CODE</label>
                    <input
                      type="text"
                      required
                      value={sectorCode}
                      onChange={(e) => setSectorCode(e.target.value)}
                      className="bg-[#0d0e10] border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none text-xs uppercase"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-zinc-400 text-[11px]">OPERATIONAL ROLE</label>
                    <select
                      value={operationalRole}
                      onChange={(e) => setOperationalRole(e.target.value)}
                      className="bg-[#0d0e10] border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none text-xs cursor-pointer"
                    >
                      <option value="field">FIELD MAINTENANCE TECH</option>
                      <option value="lead">ROBOTICS AUTOMATION ENG</option>
                      <option value="scada">CENTRAL SCADA SUPERVISOR</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <label className="text-zinc-400">SUPERVISOR AUTHORIZATION CODE (SIL-3+)</label>
                    <span className="px-2 py-0.2 rounded bg-[#D71920]/20 text-[#ffb4ab] text-[10px] font-bold">
                      MANDATORY
                    </span>
                  </div>
                  <div className="flex items-center bg-[#0d0e10] rounded-xl px-3 py-2 border border-zinc-800">
                    <Key className="w-4 h-4 text-zinc-500 mr-2" />
                    <input
                      type="password"
                      required
                      value={supervisorKey}
                      onChange={(e) => setSupervisorKey(e.target.value)}
                      className="w-full bg-transparent text-white outline-none text-xs"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-xl bg-[#D71920] hover:bg-red-700 text-white font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-[0_0_12px_rgba(215,25,32,0.4)]"
              >
                {isSubmitting ? (
                  <span>AUTHENTICATING HARDWARE ENCLAVE...</span>
                ) : authMode === 'signin' ? (
                  <>
                    <span>AUTHENTICATE & ENTER SCADA COCKPIT</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>SUBMIT CREDENTIALS FOR ENROLLMENT</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleGuestAccess}
                className="w-full py-2.5 px-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white font-mono text-xs flex items-center justify-center gap-2 transition-all"
              >
                <span>EMERGENCY DISPATCH GUEST ACCESS (TELEMETRY READ-ONLY)</span>
              </button>
            </div>
          </form>

          {/* Telemetry Signature Footer */}
          <div className="pt-3 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-zinc-500 font-mono text-[10px] gap-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-zinc-300" />
              <span>AES-256-GCM • HARDWARE TPM 2.0 VALIDATED</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-zinc-300">GATEWAY LATENCY: 2ms</span>
              <span>NODE: US-EAST-FAB-19</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fail-Safe Mode Notice */}
      <div className="w-full max-w-2xl mt-3 flex flex-col sm:flex-row items-center justify-between px-4 py-2 bg-[#0d0e10] rounded-xl text-zinc-500 font-mono text-[11px] gap-2 border border-zinc-800/80">
        <div className="flex items-center gap-2">
          <BadgeAlert className="w-4 h-4 text-[#D71920]" />
          <span>FAIL-SAFE MODE: ACTIVE IN ALL CHASSIS</span>
        </div>
        <div className="flex items-center gap-2">
          <span>REMOTE E-STOP OVERRIDE: ENABLED</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D71920]" />
        </div>
      </div>
    </div>
  );
};

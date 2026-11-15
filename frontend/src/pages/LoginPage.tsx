import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, User, Key, ArrowRight, CheckCircle, Radio } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { UserRole } from '../types/api';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, setUserRole } = useAppStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [email, setEmail] = useState('e.rostova@industrialsense.io');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'admin') {
      setEmail('e.rostova@industrialsense.io');
    } else if (role === 'engineer') {
      setEmail('m.vance@industrialsense.io');
    } else {
      setEmail('a.chen@industrialsense.io');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(selectedRole);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#121315] text-[#e3e2e5] font-mono flex items-center justify-center p-4 scada-grid-bg">
      <div className="w-full max-w-md bg-[#1b1c1e] border border-[#292a2c] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#292a2c]">
          <Link to="/" title="Return to Landing Page" className="flex items-center gap-2 group cursor-pointer">
            <span className="w-3 h-3 rounded-full bg-[#d71920] shadow-[0_0_10px_#d71920] animate-pulse group-hover:scale-110 transition-transform" />
            <span className="font-bold text-white tracking-tight group-hover:text-red-400 transition-colors">INDUSTRIALSENSE</span>
          </Link>
          <span className="text-[10px] text-[#ffb4ab] uppercase font-bold flex items-center gap-1 bg-[#121315] px-2 py-0.5 rounded border border-[#292a2c]">
            <Radio className="w-2.5 h-2.5 text-[#22c55e]" />
            SECURE SCADA GATEWAY
          </span>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-white uppercase">OPERATOR ACCESS TERMINAL</h2>
          <p className="text-xs text-[#a1a1aa] font-sans mt-1">
            Authenticate using certified industrial role credentials.
          </p>
        </div>

        {/* Quick Demo Role Selector */}
        <div className="mb-6">
          <span className="block text-[10px] text-[#a1a1aa] uppercase font-bold mb-2">
            PRE-CONFIGURED TEST ROLES (CLICK TO AUTO-FILL):
          </span>
          <div className="grid grid-cols-3 gap-2">
            {(['admin', 'engineer', 'viewer'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleSelect(r)}
                className={`py-2 px-1 rounded-xl text-xs font-bold uppercase border transition-all text-center ${
                  selectedRole === r
                    ? 'bg-[#d71920] text-white border-[#d71920] shadow-[0_0_12px_rgba(215,25,32,0.4)]'
                    : 'bg-[#121315] text-[#a1a1aa] border-[#292a2c] hover:text-white hover:bg-[#292a2c]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[10px] text-[#a1a1aa] uppercase font-bold mb-1">
              OPERATOR ID / EMAIL:
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-[#a1a1aa] absolute left-3 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#121315] border border-[#292a2c] focus:border-[#d71920] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-[#a1a1aa] uppercase font-bold mb-1">
              ACCESS KEY / PIN:
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-[#a1a1aa] absolute left-3 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#121315] border border-[#292a2c] focus:border-[#d71920] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full py-3 rounded-xl bg-[#d71920] hover:bg-[#c00014] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(215,25,32,0.4)] disabled:opacity-50"
          >
            {isLoading ? (
              <span>VERIFYING CRYPTOGRAPHIC TOKEN...</span>
            ) : (
              <>
                <span>INITIALIZE TERMINAL SESSION</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#292a2c] flex items-center justify-between text-[11px] text-[#a1a1aa]">
          <Link to="/" className="hover:text-white transition-colors">
            &larr; Back to Public Overview
          </Link>
          <span className="text-emerald-400 flex items-center gap-1">
            <Shield className="w-3 h-3" /> TLS 1.3 256-bit
          </span>
        </div>
      </div>
    </div>
  );
};

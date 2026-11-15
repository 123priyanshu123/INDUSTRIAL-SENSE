import React from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#121315] text-[#e3e2e5] font-mono flex flex-col items-center justify-center p-4 text-center scada-grid-bg">
      <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
          <AlertOctagon className="w-8 h-8" />
        </div>

        <span className="text-4xl font-bold text-white tracking-tight">404 - NOT FOUND</span>
        <h2 className="text-sm font-bold text-[#ffdad6] uppercase">
          SCADA ROUTE DOES NOT EXIST
        </h2>
        <p className="text-xs text-[#a1a1aa] font-sans">
          The requested endpoint or machine telemetry stream is not registered in this field gateway.
        </p>

        <div className="flex gap-3 pt-4">
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-[#d71920] hover:bg-[#c00014] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-[0_0_12px_rgba(215,25,32,0.4)]"
          >
            <Home className="w-4 h-4" />
            <span>RETURN TO COCKPIT</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

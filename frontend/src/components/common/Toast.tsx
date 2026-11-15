import React from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export const ToastContainer: React.FC = () => {
  const { notifications, dismissNotification } = useAppStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="pointer-events-auto bg-[#1b1c1e]/95 backdrop-blur-md border border-[#38393b] rounded-xl p-3 shadow-2xl flex items-start gap-3 animate-slide-up font-mono text-xs"
        >
          {n.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
          {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
          {n.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
          {n.type === 'info' && <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />}

          <div className="flex-1">
            <p className="text-white font-sans">{n.message}</p>
            <span className="text-[10px] text-[#a1a1aa] mt-1 block">{n.timestamp}</span>
          </div>

          <button
            onClick={() => dismissNotification(n.id)}
            className="text-[#a1a1aa] hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

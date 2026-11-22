import React from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '../../types/alert';
import { AlertTriangle, AlertOctagon, CheckCircle, ChevronRight, Volume2, Thermometer, Gauge } from 'lucide-react';
import { formatTimeAgo } from '../../utils/dateUtils';
import { useAppStore } from '../../store/appStore';

interface RecentAlertsProps {
  alerts: Alert[];
}

export const RecentAlerts: React.FC<RecentAlertsProps> = ({ alerts }) => {
  const { acknowledgeAlert, currentUser } = useAppStore();

  return (
    <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-5 font-mono">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-[#d71920]" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            ACTIVE ANOMALIES & INCIDENTS
          </h3>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {alerts.slice(0, 4).map((alert) => {
          const isCrit = alert.severity === 'critical';
          return (
            <div
              key={alert.id}
              className={`p-3.5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all ${
                alert.acknowledged
                  ? 'bg-[#121315]/60 border-[#292a2c] opacity-75'
                  : isCrit
                  ? 'bg-rose-500/10 border-rose-500/40'
                  : 'bg-amber-500/10 border-amber-500/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#121315] border border-[#292a2c] mt-0.5">
                  {alert.sensorType === 'sound' && <Volume2 className="w-4 h-4 text-cyan-400" />}
                  {alert.sensorType === 'temperature' && <Thermometer className="w-4 h-4 text-rose-400" />}
                  {alert.sensorType === 'pressure' && <Gauge className="w-4 h-4 text-amber-400" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{alert.machineName || alert.machineCode}</span>
                    <span className="text-xs text-[#a1a1aa]">•</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        isCrit ? 'bg-rose-500 text-white' : 'bg-amber-500 text-black'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-[10px] text-[#a1a1aa]">{formatTimeAgo(alert.timestamp)}</span>
                  </div>

                  <h4 className="text-xs font-bold text-white mt-1 font-sans">{alert.title}</h4>
                  <p className="text-[11px] text-[#a1a1aa] font-sans mt-0.5">{alert.message}</p>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center gap-2 self-end md:self-center">
                {alert.acknowledged ? (
                  <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    ACKNOWLEDGED ({alert.acknowledgedBy})
                  </span>
                ) : (
                  <button
                    onClick={() => acknowledgeAlert(alert.id, currentUser.name)}
                    className="px-3 py-1.5 rounded-lg bg-[#292a2c] hover:bg-[#d71920] text-white text-xs font-bold transition-all shadow-sm"
                  >
                    ACKNOWLEDGE
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

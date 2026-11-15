import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { useAppStore } from '../store/appStore';
import { Alert, AlertSeverity } from '../types/alert';
import {
  Bell,
  CheckCircle,
  AlertOctagon,
  AlertTriangle,
  Volume2,
  Thermometer,
  Gauge,
  ExternalLink,
  ShieldCheck,
  Check,
  Filter,
} from 'lucide-react';
import { formatTimestamp, formatTimeAgo } from '../utils/dateUtils';
import { Link } from 'react-router-dom';

export const AlertsPage: React.FC = () => {
  const { activeAlerts, acknowledgeAlert, currentUser } = useAppStore();
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [acknowledgedFilter, setAcknowledgedFilter] = useState<'ALL' | 'UNACK' | 'ACK'>('ALL');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const filteredAlerts = activeAlerts.filter((a) => {
    const matchSev = severityFilter === 'ALL' || a.severity === severityFilter;
    const matchAck =
      acknowledgedFilter === 'ALL' ||
      (acknowledgedFilter === 'UNACK' && !a.acknowledged) ||
      (acknowledgedFilter === 'ACK' && a.acknowledged);
    return matchSev && matchAck;
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="INCIDENT COMMAND & ALERT MANAGEMENT"
        description="Centralized audit log of threshold excursions, acoustic fluting, and thermal trip alarms."
        badge={`${activeAlerts.filter(a => !a.acknowledged).length} PENDING REVIEW`}
      />

      {/* Filter Toolbar */}
      <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#a1a1aa]" />
          <span className="text-[10px] text-[#a1a1aa] uppercase font-bold">ALERT FILTERS:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center bg-[#121315] p-1 rounded-xl border border-[#292a2c]">
            {(['ALL', 'UNACK', 'ACK'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setAcknowledgedFilter(tab)}
                className={`px-3 py-1 rounded-lg uppercase font-bold transition-all ${
                  acknowledgedFilter === tab
                    ? 'bg-[#343537] text-white shadow-sm'
                    : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                {tab === 'UNACK' ? 'Unacknowledged' : tab === 'ACK' ? 'Acknowledged' : 'All Incidents'}
              </button>
            ))}
          </div>

          {/* Severity Dropdown */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-[#121315] border border-[#292a2c] text-white font-bold rounded-xl px-3 py-1.5 outline-none cursor-pointer text-xs"
          >
            <option value="ALL" className="bg-[#1b1c1e]">All Severities</option>
            <option value="critical" className="bg-[#1b1c1e]">Critical (Trip)</option>
            <option value="warning" className="bg-[#1b1c1e]">Warning (Degraded)</option>
            <option value="info" className="bg-[#1b1c1e]">Informational</option>
          </select>
        </div>
      </div>

      {/* Alert Cards List */}
      <div className="flex flex-col gap-3 font-mono">
        {filteredAlerts.map((alert) => {
          const isCrit = alert.severity === 'critical';
          return (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border transition-all ${
                alert.acknowledged
                  ? 'bg-[#1b1c1e]/60 border-[#292a2c]'
                  : isCrit
                  ? 'bg-[#1b1c1e] border-rose-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                  : 'bg-[#1b1c1e] border-amber-500/40'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-[#121315] border border-[#292a2c] mt-0.5">
                    {alert.sensorType === 'sound' && <Volume2 className="w-5 h-5 text-cyan-400" />}
                    {alert.sensorType === 'temperature' && <Thermometer className="w-5 h-5 text-rose-400" />}
                    {alert.sensorType === 'pressure' && <Gauge className="w-5 h-5 text-amber-400" />}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-white text-xs">{alert.machineCode}</span>
                      <span className="text-xs text-[#a1a1aa]">•</span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                          isCrit
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-[10px] text-[#a1a1aa]">
                        {formatTimestamp(alert.timestamp)} ({formatTimeAgo(alert.timestamp)})
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white font-sans">{alert.title}</h4>
                    <p className="text-xs text-[#a1a1aa] font-sans mt-1 max-w-3xl leading-relaxed">
                      {alert.message}
                    </p>

                    <div className="mt-2 text-[11px] text-[#ffdad6] font-sans flex items-center gap-1.5 bg-[#121315] p-2 rounded-lg border border-[#292a2c] w-fit">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#ffb4ab]" />
                      <span>Prescribed Action: {alert.actionRequired}</span>
                    </div>
                  </div>
                </div>

                {/* Actions & Status */}
                <div className="flex items-center gap-3 self-end lg:self-center shrink-0">
                  <Link
                    to={`/machines/${alert.machineId}`}
                    className="px-3 py-1.5 rounded-xl bg-[#121315] hover:bg-[#292a2c] text-[#a1a1aa] hover:text-white border border-[#292a2c] text-xs font-bold transition-all"
                  >
                    INSPECT MACHINE
                  </Link>

                  {alert.acknowledged ? (
                    <div className="text-right">
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        ACKNOWLEDGED
                      </span>
                      <span className="text-[9px] text-[#a1a1aa] block">
                        By {alert.acknowledgedBy} at {formatTimestamp(alert.acknowledgedAt || '')}
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => acknowledgeAlert(alert.id, currentUser.name)}
                      className="px-4 py-2 rounded-xl bg-[#d71920] hover:bg-[#c00014] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(215,25,32,0.4)]"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>SIGN ACKNOWLEDGEMENT</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import { SensorState, SensorThresholds } from '../types/sensor';

export function evaluateSensorState(value: number, thresholds: SensorThresholds): SensorState {
  if (value === undefined || value === null || isNaN(value)) {
    return 'no_data';
  }

  // Critical thresholds
  if (
    (thresholds.criticalHigh !== undefined && value >= thresholds.criticalHigh) ||
    (thresholds.criticalLow !== undefined && value <= thresholds.criticalLow)
  ) {
    return 'critical';
  }

  // Warning thresholds
  if (
    (thresholds.warningHigh !== undefined && value >= thresholds.warningHigh) ||
    (thresholds.warningLow !== undefined && value <= thresholds.warningLow)
  ) {
    return 'warning';
  }

  return 'online';
}

export function getSensorStateBadge(state: SensorState) {
  switch (state) {
    case 'online':
      return { label: 'ONLINE', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    case 'warning':
      return { label: 'WARNING', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    case 'critical':
      return { label: 'CRITICAL', color: 'text-rose-400 bg-rose-500/20 border-rose-500/40' };
    case 'stale':
      return { label: 'STALE', color: 'text-yellow-600 bg-yellow-500/10 border-yellow-500/30' };
    case 'invalid':
      return { label: 'INVALID', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
    case 'not_installed':
      return { label: 'NOT INSTALLED', color: 'text-zinc-600 bg-zinc-800/40 border-zinc-700/30' };
    case 'offline':
    default:
      return { label: 'OFFLINE', color: 'text-zinc-500 bg-zinc-800/40 border-zinc-700/30' };
  }
}

import { MachineOperatingState } from '../types/machine';

export function getStatusColor(status: MachineOperatingState): {
  bg: string;
  text: string;
  border: string;
  dot: string;
  label: string;
} {
  switch (status) {
    case 'running':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        dot: 'bg-emerald-500',
        label: 'OPERATIONAL - RUNNING',
      };
    case 'warning':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        dot: 'bg-amber-500',
        label: 'DEGRADED - WARNING',
      };
    case 'critical':
      return {
        bg: 'bg-rose-500/20',
        text: 'text-rose-400',
        border: 'border-rose-500/40',
        dot: 'bg-rose-500 animate-pulse',
        label: 'CRITICAL - TRIP IMMINENT',
      };
    case 'idle':
      return {
        bg: 'bg-sky-500/10',
        text: 'text-sky-400',
        border: 'border-sky-500/30',
        dot: 'bg-sky-400',
        label: 'STANDBY - IDLE',
      };
    case 'stopped':
      return {
        bg: 'bg-zinc-500/10',
        text: 'text-zinc-400',
        border: 'border-zinc-500/30',
        dot: 'bg-zinc-400',
        label: 'SHUTDOWN - STOPPED',
      };
    case 'offline':
    default:
      return {
        bg: 'bg-zinc-800/40',
        text: 'text-zinc-500',
        border: 'border-zinc-700/30',
        dot: 'bg-zinc-600',
        label: 'DISCONNECTED - OFFLINE',
      };
  }
}

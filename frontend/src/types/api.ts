import { Alert, AnomalyRecord } from './alert';
import { Machine } from './machine';
import { SensorState } from './sensor';

export type UserRole = 'admin' | 'engineer' | 'viewer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department: string;
  shift: string;
  lastLogin: string;
}

export interface DashboardOverview {
  machineStats: {
    total: number;
    running: number;
    idle: number;
    warning: number;
    critical: number;
    offline: number;
  };
  overallHealthScore: number;
  healthDelta: number; // e.g. -2.4%
  sensorStats: {
    sound: { online: number; warning: number; critical: number; offline: number };
    temperature: { online: number; warning: number; critical: number; offline: number };
    pressure: { online: number; warning: number; critical: number; offline: number };
  };
  recentAlerts: Alert[];
  recentAnomalies: AnomalyRecord[];
  topAttentionMachines: Machine[];
}

export interface AnalyticsTrendPoint {
  timestamp: string;
  soundAvg: number;
  tempAvg: number;
  pressureAvg: number;
  healthIndex: number;
  anomalyRate: number;
}

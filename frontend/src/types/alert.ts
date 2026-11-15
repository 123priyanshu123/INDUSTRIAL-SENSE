import { SensorType } from './sensor';

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface Alert {
  id: string;
  machineId: string;
  machineName: string;
  machineCode: string;
  sensorType: SensorType;
  severity: AlertSeverity;
  title: string;
  message: string;
  value: number;
  threshold: number;
  unit: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  actionRequired: string;
}

export interface AnomalyRecord {
  id: string;
  machineId: string;
  machineName: string;
  machineCode: string;
  sensorType: SensorType;
  anomalyScore: number; // 0.00 to 1.00
  severity: 'warning' | 'critical';
  confidence: number; // e.g. 96.4%
  detectionTime: string;
  explanation: string;
  recommendation: string;
  modelVersion: string; // e.g. "EdgeAcoustic-v4.2.1"
  rulEstimateHours: number; // Remaining Useful Life
  status: 'active' | 'investigating' | 'resolved';
}

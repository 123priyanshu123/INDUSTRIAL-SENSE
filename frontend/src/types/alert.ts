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

export interface FeatureContribution {
  feature: string;
  error: number;
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
  // Multimodal Autoencoder Inference contract (from MAFAULDA pipeline)
  filename?: string;
  anomalyStatus?: string;
  isAnomaly?: boolean;
  threshold?: number;
  healthIndex?: number; // 0 - 100% normalized health index: 100 * exp(-0.5 * score / threshold)
  estimatedRpm?: number;
  topContributingFeatures?: FeatureContribution[];
  windowScores?: number[];
  faultClass?: string;
}

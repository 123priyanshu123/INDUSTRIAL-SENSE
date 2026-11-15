export type SensorType = 'sound' | 'temperature' | 'pressure';

export type SensorState = 
  | 'online' 
  | 'offline' 
  | 'not_installed' 
  | 'no_data' 
  | 'stale' 
  | 'invalid' 
  | 'warning' 
  | 'critical';

export interface SensorThresholds {
  warningLow?: number;
  warningHigh: number;
  criticalLow?: number;
  criticalHigh: number;
}

export interface SensorReading {
  id: string;
  sensorId: string;
  machineId: string;
  sensorType: SensorType;
  value: number;
  unit: string;
  timestamp: string;
  state: SensorState;
  frequencyData?: number[]; // For sound FFT acoustic frequency bands
  rateOfChange?: number; // For temperature rate of change °C/min
  flowCorrelation?: number; // For pressure
}

export interface SensorConfig {
  sensorId: string;
  machineId: string;
  sensorType: SensorType;
  componentLocation: string;
  unit: string;
  normalRangeMin: number;
  normalRangeMax: number;
  warningThreshold: number;
  criticalThreshold: number;
  reportingIntervalSec: number;
  state: SensorState;
}

import { SensorConfig, SensorThresholds } from '../types/sensor';

export const DEFAULT_SENSOR_THRESHOLDS: Record<'sound' | 'temperature' | 'pressure', SensorThresholds> = {
  sound: {
    warningHigh: 75.0,
    criticalHigh: 85.0,
  },
  temperature: {
    warningHigh: 65.0,
    criticalHigh: 80.0,
  },
  pressure: {
    warningLow: 1.5,
    warningHigh: 8.0,
    criticalLow: 0.8,
    criticalHigh: 10.5,
  },
};

export const SENSOR_UNITS = {
  sound: ['dB', 'dB(A)'],
  temperature: ['°C', '°F'],
  pressure: ['bar', 'psi', 'kPa'],
} as const;

export const SENSOR_DETAILS = {
  sound: {
    name: 'Acoustic & Vibration Sensor',
    description: 'High-frequency piezoelectric microphone detecting mechanical chatter, cavitation, bearing fluting, and friction harmonics.',
    defaultUnit: 'dB',
    icon: 'Volume2',
  },
  temperature: {
    name: 'Thermal & RTD Probe',
    description: 'Class A PT100 resistance temperature detector monitoring bearing temperature, motor winding heat, and lubricant degradation.',
    defaultUnit: '°C',
    icon: 'Thermometer',
  },
  pressure: {
    name: 'Piezoresistive Pressure Transducer',
    description: 'Ceramic diaphragm pressure transmitter measuring suction vacuum, line discharge, hydraulic pressure, and pneumatic supply.',
    defaultUnit: 'bar',
    icon: 'Gauge',
  },
} as const;

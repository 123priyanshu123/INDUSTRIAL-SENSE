import { apiClient } from './api';
import { SensorReading, SensorType } from '../types/sensor';
import { GENERATE_SERIES_DATA } from '../data/mockData';

export const sensorService = {
  async getLatestReadings(machineId: string): Promise<Record<SensorType, SensorReading | null>> {
    try {
      const res = await apiClient.get<Record<SensorType, SensorReading>>(`/machines/${machineId}/readings`);
      return res.data;
    } catch {
      const now = new Date().toISOString();
      return {
        sound: {
          id: `snd-${Date.now()}`,
          sensorId: `SNS-${machineId.toUpperCase()}-SND`,
          machineId,
          sensorType: 'sound',
          value: Number((65 + Math.random() * 8).toFixed(1)),
          unit: 'dB',
          timestamp: now,
          state: 'online',
          frequencyData: [12, 28, 45, 78, 62, 41, 23, 15],
        },
        temperature: {
          id: `tmp-${Date.now()}`,
          sensorId: `SNS-${machineId.toUpperCase()}-TMP`,
          machineId,
          sensorType: 'temperature',
          value: Number((52 + Math.random() * 4).toFixed(1)),
          unit: '°C',
          timestamp: now,
          state: 'online',
          rateOfChange: 0.12,
        },
        pressure: {
          id: `prs-${Date.now()}`,
          sensorId: `SNS-${machineId.toUpperCase()}-PRS`,
          machineId,
          sensorType: 'pressure',
          value: Number((4.6 + Math.random() * 0.4).toFixed(2)),
          unit: 'bar',
          timestamp: now,
          state: 'online',
        },
      };
    }
  },

  async getHistoricalSeries(machineId: string, _range = '24h') {
    try {
      const res = await apiClient.get(`/machines/${machineId}/history?range=${_range}`);
      return res.data;
    } catch {
      return GENERATE_SERIES_DATA(30);
    }
  },
};

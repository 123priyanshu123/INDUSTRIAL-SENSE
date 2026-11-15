import { apiClient } from './api';
import { Alert } from '../types/alert';
import { MOCK_ALERTS } from '../data/mockData';

export const alertService = {
  async getAlerts(): Promise<Alert[]> {
    try {
      const res = await apiClient.get<Alert[]>('/alerts');
      return res.data;
    } catch {
      return [...MOCK_ALERTS];
    }
  },

  async acknowledgeAlert(alertId: string, reviewer: string): Promise<Alert> {
    try {
      const res = await apiClient.patch<Alert>(`/alerts/${alertId}/acknowledge`, { reviewer });
      return res.data;
    } catch {
      const alert = MOCK_ALERTS.find(a => a.id === alertId);
      if (!alert) throw new Error('Alert not found');
      alert.acknowledged = true;
      alert.acknowledgedBy = reviewer;
      alert.acknowledgedAt = new Date().toISOString();
      return { ...alert };
    }
  },
};

import { apiClient } from './api';
import { Machine } from '../types/machine';
import { MACHINE_REGISTRY } from '../data/machineRegistry';

export const machineService = {
  async getMachines(): Promise<Machine[]> {
    try {
      const res = await apiClient.get<Machine[]>('/machines');
      return res.data;
    } catch {
      return [...MACHINE_REGISTRY];
    }
  },

  async getMachineById(id: string): Promise<Machine | undefined> {
    try {
      const res = await apiClient.get<Machine>(`/machines/${id}`);
      return res.data;
    } catch {
      return MACHINE_REGISTRY.find(m => m.id === id);
    }
  },

  async updateMachine(id: string, updates: Partial<Machine>): Promise<Machine> {
    try {
      const res = await apiClient.patch<Machine>(`/machines/${id}`, updates);
      return res.data;
    } catch {
      const existing = MACHINE_REGISTRY.find(m => m.id === id);
      if (!existing) throw new Error('Machine not found');
      return { ...existing, ...updates };
    }
  },

  async registerMachine(machine: Partial<Machine>): Promise<Machine> {
    try {
      const res = await apiClient.post<Machine>('/machines', machine);
      return res.data;
    } catch {
      const newMachine: Machine = {
        id: `mch-${Date.now()}`,
        code: machine.code || `MCH-NEW-${Math.floor(Math.random() * 900 + 100)}`,
        name: machine.name || 'Newly Registered Unit',
        category: machine.category || 'Rotating Equipment',
        industry: machine.industry || 'General Industry',
        description: machine.description || 'Newly configured machine in SCADA network.',
        manufacturer: machine.manufacturer || 'Standard Industrial',
        model: machine.model || 'GEN-2026',
        installationDate: new Date().toISOString().split('T')[0],
        status: 'idle',
        healthScore: 98,
        runtimeHours: 0,
        components: machine.components || [],
        supportedSensors: machine.supportedSensors || ['sound', 'temperature'],
        sensorLocations: machine.sensorLocations || [],
        animationProfile: machine.animationProfile || 'industrial-motor',
        animationAvailable: true,
        activeAlertCount: 0,
        lastUpdated: 'Just now',
      };
      MACHINE_REGISTRY.unshift(newMachine);
      return newMachine;
    }
  },
};

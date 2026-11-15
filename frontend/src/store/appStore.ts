import { create } from 'zustand';
import { UserProfile, UserRole } from '../types/api';
import { Alert } from '../types/alert';
import { MOCK_ALERTS, MOCK_USERS } from '../data/mockData';

interface AppNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: string;
}

interface AppState {
  currentUser: UserProfile;
  isAuthenticated: boolean;
  selectedMachineId: string;
  activeAlerts: Alert[];
  notifications: AppNotification[];
  isLiveStreaming: boolean;
  speedMultiplier: number;

  // Actions
  login: (role?: UserRole) => void;
  logout: () => void;
  setUserRole: (role: UserRole) => void;
  setSelectedMachineId: (id: string) => void;
  acknowledgeAlert: (alertId: string, reviewerName: string) => void;
  toggleLiveStreaming: () => void;
  addNotification: (type: AppNotification['type'], message: string) => void;
  dismissNotification: (id: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: MOCK_USERS.admin,
  isAuthenticated: true, // Default to authenticated for direct evaluation
  selectedMachineId: 'mch-pmp-01',
  activeAlerts: MOCK_ALERTS,
  notifications: [
    {
      id: 'notif-1',
      type: 'warning',
      message: 'MCH-MTR-01 temperature critical alert active (89.2 °C)',
      timestamp: '1 min ago',
    },
  ],
  isLiveStreaming: true,
  speedMultiplier: 1,

  login: (role = 'admin') => {
    set({
      currentUser: MOCK_USERS[role] || MOCK_USERS.admin,
      isAuthenticated: true,
    });
  },

  logout: () => {
    set({ isAuthenticated: false });
  },

  setUserRole: (role: UserRole) => {
    set({
      currentUser: {
        ...get().currentUser,
        role,
      },
    });
  },

  setSelectedMachineId: (id: string) => {
    set({ selectedMachineId: id });
  },

  acknowledgeAlert: (alertId: string, reviewerName: string) => {
    set(state => ({
      activeAlerts: state.activeAlerts.map(alt =>
        alt.id === alertId
          ? {
              ...alt,
              acknowledged: true,
              acknowledgedBy: reviewerName,
              acknowledgedAt: new Date().toISOString(),
            }
          : alt
      ),
      notifications: [
        {
          id: `ack-${Date.now()}`,
          type: 'success',
          message: `Alert ${alertId} acknowledged by ${reviewerName}`,
          timestamp: 'Just now',
        },
        ...state.notifications,
      ],
    }));
  },

  toggleLiveStreaming: () => {
    set(state => ({ isLiveStreaming: !state.isLiveStreaming }));
  },

  addNotification: (type, message) => {
    set(state => ({
      notifications: [
        { id: `ntf-${Date.now()}`, type, message, timestamp: 'Just now' },
        ...state.notifications.slice(0, 9),
      ],
    }));
  },

  dismissNotification: (id: string) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id),
    }));
  },
}));

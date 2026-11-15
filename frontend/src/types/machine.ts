export type MachineOperatingState = 'running' | 'idle' | 'stopped' | 'offline' | 'warning' | 'critical';

export interface MechanicalComponent {
  id: string;
  name: string;
  role: string;
  status: 'normal' | 'stressed' | 'faulty';
  sensorAttached?: string;
  specs?: string;
}

export interface SensorMarkerLocation {
  id: string;
  type: 'sound' | 'temperature' | 'pressure';
  xPercent: number; // For SVG overlay positioning
  yPercent: number;
  label: string;
  readingSnippet?: string;
}

export interface Machine {
  id: string;
  code: string; // e.g. MCH-PMP-01
  name: string;
  category: string;
  industry: string;
  description: string;
  manufacturer: string;
  model: string;
  installationDate: string;
  status: MachineOperatingState;
  healthScore: number; // 0 - 100
  rpm?: number;
  runtimeHours: number;
  components: MechanicalComponent[];
  supportedSensors: Array<'sound' | 'temperature' | 'pressure'>;
  sensorLocations: SensorMarkerLocation[];
  animationProfile: string; // matches animation registry key
  animationAvailable: boolean;
  activeAlertCount: number;
  lastUpdated: string;
}

export interface MachineCategory {
  id: string;
  name: string;
  description: string;
  iconName: string;
  machineCount: number;
}

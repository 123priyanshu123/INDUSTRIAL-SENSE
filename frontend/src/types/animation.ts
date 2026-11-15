import { MachineOperatingState, MechanicalComponent, SensorMarkerLocation } from './machine';

export type AnimationMode = 'instructional' | 'live';
export type AnimationSpeed = 0.5 | 1 | 2;

export interface MachineAnimationProps {
  machineId: string;
  state: MachineOperatingState;
  speed: AnimationSpeed;
  isPlaying: boolean;
  mode: AnimationMode;
  components: MechanicalComponent[];
  sensorMarkers?: SensorMarkerLocation[];
  selectedComponentId?: string | null;
  onSelectComponent?: (component: MechanicalComponent) => void;
  showLabels?: boolean;
  showSensors?: boolean;
}

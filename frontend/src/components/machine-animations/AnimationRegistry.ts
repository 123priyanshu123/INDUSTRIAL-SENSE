import React from 'react';
import { MachineAnimationProps } from '../../types/animation';
import { CentrifugalPumpAnimation } from './CentrifugalPumpAnimation';
import { CncMillingAnimation } from './CncMillingAnimation';
import { LatheAnimation } from './LatheAnimation';
import { IndustrialMotorAnimation } from './IndustrialMotorAnimation';
import { BeltConveyorAnimation } from './BeltConveyorAnimation';
import { IndustrialFanAnimation } from './IndustrialFanAnimation';
import { CompressorAnimation } from './CompressorAnimation';
import { HydraulicPressAnimation } from './HydraulicPressAnimation';
import { RoboticArmAnimation } from './RoboticArmAnimation';
import { IndustrialTurbineAnimation } from './IndustrialTurbineAnimation';
import { IndustrialMixerAnimation } from './IndustrialMixerAnimation';
import { GearboxAnimation } from './GearboxAnimation';

export const ANIMATION_REGISTRY: Record<string, React.FC<MachineAnimationProps>> = {
  'centrifugal-pump': CentrifugalPumpAnimation,
  'cnc-milling': CncMillingAnimation,
  'lathe-machine': LatheAnimation,
  'industrial-motor': IndustrialMotorAnimation,
  'belt-conveyor': BeltConveyorAnimation,
  'industrial-fan': IndustrialFanAnimation,
  'industrial-compressor': CompressorAnimation,
  'hydraulic-press': HydraulicPressAnimation,
  'robotic-arm': RoboticArmAnimation,
  'industrial-turbine': IndustrialTurbineAnimation,
  'industrial-mixer': IndustrialMixerAnimation,
  'industrial-gearbox': GearboxAnimation,
};

export function getAnimationComponent(profile: string): React.FC<MachineAnimationProps> {
  return ANIMATION_REGISTRY[profile] || IndustrialMotorAnimation;
}

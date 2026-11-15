import React from 'react';
import { MachineAnimationProps } from '../../types/animation';

export const HydraulicPressAnimation: React.FC<MachineAnimationProps> = ({
  state,
  speed,
  isPlaying,
  components,
  selectedComponentId,
  onSelectComponent,
}) => {
  const isRunning = isPlaying && (state === 'running' || state === 'warning' || state === 'critical');
  const duration = 2.8 / speed;

  const getComponent = (id: string) => components.find(c => c.id === id);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <svg
        viewBox="0 0 600 400"
        className="w-full max-h-[380px] drop-shadow-2xl select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Massive 4-Column Tie Rod Press Frame */}
        {/* Top Crown Bridge */}
        <rect x="120" y="30" width="360" height="55" rx="4" fill="#1b1c1e" stroke="#38393b" strokeWidth="2.5" />
        <text x="300" y="58" fill="#e3e2e5" fontSize="12" fontFamily="Space Mono" fontWeight="bold" textAnchor="middle">500 TON HYDRAULIC</text>

        {/* Heavy Tie Rod Columns */}
        <rect x="140" y="80" width="28" height="230" fill="#292a2c" stroke="#38393b" />
        <rect x="432" y="80" width="28" height="230" fill="#292a2c" stroke="#38393b" />

        {/* Stationary Bottom Bolster Bed */}
        <rect x="100" y="300" width="400" height="55" rx="4" fill="#1b1c1e" stroke="#38393b" strokeWidth="2.5" />
        <rect x="220" y="275" width="160" height="25" fill="#292a2c" stroke="#5d3f3c" />
        <text x="300" y="292" fill="#a1a1aa" fontSize="9" fontFamily="Space Mono" textAnchor="middle">LOWER DIE BOLSTER</text>

        {/* Hydraulic Cylinder Barrel (Center Crown) */}
        <g
          className={`cursor-pointer ${
            selectedComponentId === 'cmp-piston-seal' ? 'filter drop-shadow-[0_0_12px_#06b6d4]' : ''
          }`}
          onClick={() => {
            const c = getComponent('cmp-piston-seal');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          <rect x="240" y="70" width="120" height="90" rx="3" fill="#1f2022" stroke="#d71920" strokeWidth="2" />
          {/* Hydraulic Fluid Ports */}
          <circle cx="255" cy="95" r="5" fill="#06b6d4" />
          <circle cx="255" cy="135" r="5" fill="#06b6d4" />
        </g>

        {/* Moving Hydraulic Ram & Upper Stamping Platen */}
        <g
          className={`cursor-pointer ${
            isRunning ? 'animate-hydraulic' : ''
          } ${selectedComponentId === 'cmp-hydraulic-ram' ? 'filter drop-shadow-[0_0_15px_#d71920]' : ''}`}
          style={{ animationDuration: `${duration}s` }}
          onClick={() => {
            const c = getComponent('cmp-hydraulic-ram');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          {/* Chrome Piston Rod */}
          <rect x="280" y="150" width="40" height="60" fill="#c6c6c7" stroke="#121315" strokeWidth="1.5" />

          {/* Upper Slide Platen */}
          <rect x="180" y="200" width="240" height="35" rx="3" fill="#292a2c" stroke="#ffdad6" strokeWidth="2" />
          {/* Upper Forging Tool Die */}
          <polygon points="240,235 360,235 340,255 260,255" fill="#d71920" stroke="#ffdad6" strokeWidth="1.5" />
        </g>

        {/* Stamping Pressure Shockwave Waves */}
        {isRunning && (
          <g className="animate-pulse" opacity="0.8">
            <line x1="200" y1="270" x2="400" y2="270" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 4" />
            <circle cx="300" cy="265" r="8" fill="#d71920" />
          </g>
        )}
      </svg>
    </div>
  );
};

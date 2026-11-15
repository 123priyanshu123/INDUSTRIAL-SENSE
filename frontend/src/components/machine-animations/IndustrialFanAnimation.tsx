import React from 'react';
import { MachineAnimationProps } from '../../types/animation';

export const IndustrialFanAnimation: React.FC<MachineAnimationProps> = ({
  state,
  speed,
  isPlaying,
  components,
  selectedComponentId,
  onSelectComponent,
}) => {
  const isRunning = isPlaying && (state === 'running' || state === 'warning' || state === 'critical');
  const duration = 1.0 / speed;

  const getComponent = (id: string) => components.find(c => c.id === id);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <svg
        viewBox="0 0 600 400"
        className="w-full max-h-[380px] drop-shadow-2xl select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Support Base Pedestal */}
        <polygon points="260,280 340,280 370,350 230,350" fill="#1b1c1e" stroke="#38393b" strokeWidth="2" />
        <rect x="210" y="340" width="180" height="15" rx="3" fill="#292a2c" stroke="#5d3f3c" />

        {/* Outer Circular Duct Shroud / Casing */}
        <g
          className={`cursor-pointer ${
            selectedComponentId === 'cmp-inlet-duct' ? 'filter drop-shadow-[0_0_12px_#06b6d4]' : ''
          }`}
          onClick={() => {
            const c = getComponent('cmp-inlet-duct');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          <circle cx="300" cy="180" r="130" fill="#121315" stroke="#38393b" strokeWidth="12" />
          <circle cx="300" cy="180" r="122" fill="#1f2022" stroke="#292a2c" strokeWidth="2" />
          
          {/* Wire Finger Guard Ring Grid */}
          <circle cx="300" cy="180" r="95" fill="none" stroke="#292a2c" strokeWidth="1.5" strokeDasharray="6 4" />
          <circle cx="300" cy="180" r="60" fill="none" stroke="#292a2c" strokeWidth="1.5" strokeDasharray="4 4" />
        </g>

        {/* Rotating 4-Blade Impeller Fan Assembly */}
        <g
          className={`cursor-pointer origin-[300px_180px] ${
            isRunning ? 'animate-spin-cw' : ''
          } ${selectedComponentId === 'cmp-fan-blades' ? 'filter drop-shadow-[0_0_15px_#d71920]' : ''}`}
          style={{ animationDuration: `${duration}s` }}
          onClick={() => {
            const c = getComponent('cmp-fan-blades');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          {/* 4 Aerodynamic Curved Fan Blades */}
          {[0, 90, 180, 270].map((deg) => (
            <g key={deg} transform={`rotate(${deg} 300 180)`}>
              <path
                d="M 300 180 C 330 140, 360 110, 390 85 C 400 95, 380 130, 345 165 Z"
                fill={state === 'critical' ? '#ef4444' : '#ffb4ab'}
                stroke="#690006"
                strokeWidth="1.5"
                opacity="0.9"
              />
              <line x1="300" y1="180" x2="385" y2="95" stroke="#d71920" strokeWidth="2" />
            </g>
          ))}

          {/* Central Nose Cone Hub */}
          <circle cx="300" cy="180" r="32" fill="#d71920" stroke="#ffdad6" strokeWidth="2" />
          <circle cx="300" cy="180" r="10" fill="#121315" />
        </g>

        {/* High Velocity Air Flow Wavefronts */}
        {isRunning && (
          <g className="animate-pulse" opacity="0.6">
            <path d="M 440 130 C 470 150, 470 210, 440 230" stroke="#06b6d4" strokeWidth="3" fill="none" />
            <path d="M 465 110 C 505 140, 505 220, 465 250" stroke="#06b6d4" strokeWidth="2" strokeDasharray="6 6" fill="none" />
          </g>
        )}
      </svg>
    </div>
  );
};

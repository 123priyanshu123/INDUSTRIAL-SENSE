import React from 'react';
import { MachineAnimationProps } from '../../types/animation';

export const IndustrialMixerAnimation: React.FC<MachineAnimationProps> = ({
  state,
  speed,
  isPlaying,
  components,
  selectedComponentId,
  onSelectComponent,
}) => {
  const isRunning = isPlaying && (state === 'running' || state === 'warning' || state === 'critical');
  const duration = 2.0 / speed;

  const getComponent = (id: string) => components.find(c => c.id === id);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <svg
        viewBox="0 0 600 400"
        className="w-full max-h-[380px] drop-shadow-2xl select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top Motor & Gearbox Drive Unit */}
        <rect x="250" y="30" width="100" height="60" rx="4" fill="#1f2022" stroke="#38393b" strokeWidth="2" />
        <rect x="270" y="20" width="60" height="15" rx="2" fill="#292a2c" />
        <text x="300" y="65" fill="#a1a1aa" fontSize="9" fontFamily="Space Mono" textAnchor="middle">TOP DRIVE 140 RPM</text>

        {/* Jacketed Mixing Vessel Wall (Transparent Glass / Stainless Profile) */}
        <path
          d="M 180 90 L 420 90 L 420 280 C 420 330, 180 330, 180 280 Z"
          fill="#121315"
          stroke="#38393b"
          strokeWidth="3"
        />

        {/* Sanitary Mechanical Seal (Vessel Neck) */}
        <g
          className={`cursor-pointer ${
            selectedComponentId === 'cmp-mechanical-seal' ? 'filter drop-shadow-[0_0_10px_#06b6d4]' : ''
          }`}
          onClick={() => {
            const c = getComponent('cmp-mechanical-seal');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          <rect x="275" y="85" width="50" height="20" fill="#292a2c" stroke="#5d3f3c" strokeWidth="1.5" />
          <circle cx="300" cy="95" r="4" fill="#06b6d4" />
        </g>

        {/* Central Agitator Shaft */}
        <g
          className={`cursor-pointer ${
            selectedComponentId === 'cmp-agitator-shaft' ? 'filter drop-shadow-[0_0_10px_#c6c6c7]' : ''
          }`}
          onClick={() => {
            const c = getComponent('cmp-agitator-shaft');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          <rect x="294" y="90" width="12" height="190" fill="#c6c6c7" stroke="#121315" />
        </g>

        {/* Fluid Level Fill in Vessel */}
        <path
          d="M 185 150 L 415 150 L 415 280 C 415 325, 185 325, 185 280 Z"
          fill="#06b6d4"
          fillOpacity="0.15"
        />
        <line x1="185" y1="150" x2="415" y2="150" stroke="#06b6d4" strokeWidth="2" strokeDasharray="6 4" />

        {/* Upper Hydrofoil Agitator Blade */}
        <g
          className={`cursor-pointer origin-[300px_190px] ${
            isRunning ? 'animate-spin-cw' : ''
          }`}
          style={{ animationDuration: `${duration}s` }}
        >
          <polygon points="230,185 370,185 360,195 240,195" fill="#ffb4ab" stroke="#690006" strokeWidth="1.5" />
          <circle cx="300" cy="190" r="10" fill="#d71920" />
        </g>

        {/* Lower High-Shear Mixing Impeller Blades */}
        <g
          className={`cursor-pointer origin-[300px_260px] ${
            isRunning ? 'animate-spin-cw' : ''
          } ${selectedComponentId === 'cmp-mixing-blades' ? 'filter drop-shadow-[0_0_15px_#d71920]' : ''}`}
          style={{ animationDuration: `${duration}s` }}
          onClick={() => {
            const c = getComponent('cmp-mixing-blades');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          {/* 4 Pitch Blades */}
          <polygon points="200,250 400,250 380,270 220,270" fill="#d71920" stroke="#ffdad6" strokeWidth="2" />
          <circle cx="300" cy="260" r="16" fill="#1b1c1e" stroke="#ffdad6" strokeWidth="2" />
        </g>

        {/* Vortex Recirculation Flow Lines */}
        {isRunning && (
          <g className="animate-pulse" opacity="0.6">
            <path d="M 220 220 Q 300 240, 380 220" stroke="#06b6d4" strokeWidth="2" fill="none" />
            <path d="M 230 280 Q 300 305, 370 280" stroke="#06b6d4" strokeWidth="2" fill="none" />
          </g>
        )}
      </svg>
    </div>
  );
};

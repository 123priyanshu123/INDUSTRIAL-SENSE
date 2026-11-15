import React from 'react';
import { MachineAnimationProps } from '../../types/animation';

export const IndustrialTurbineAnimation: React.FC<MachineAnimationProps> = ({
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
        {/* Steam Expansion Conical Casing (Expanding Left to Right) */}
        <polygon
          points="100,140 480,80 480,320 100,260"
          fill="#1b1c1e"
          stroke="#38393b"
          strokeWidth="3"
        />

        {/* Central High-Pressure Rotor Shaft */}
        <g
          className={`cursor-pointer ${
            selectedComponentId === 'cmp-turbine-rotor' ? 'filter drop-shadow-[0_0_12px_#d71920]' : ''
          }`}
          onClick={() => {
            const c = getComponent('cmp-turbine-rotor');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          <rect x="60" y="190" width="480" height="20" fill="#c6c6c7" stroke="#121315" strokeWidth="1.5" />
          
          {/* Bearings */}
          <rect x="70" y="175" width="30" height="50" rx="3" fill="#292a2c" stroke="#5d3f3c" />
          <rect x="490" y="175" width="30" height="50" rx="3" fill="#292a2c" stroke="#5d3f3c" />
        </g>

        {/* Multi-Stage Blade Discs (Expanding Diameters) */}
        <g
          className={`cursor-pointer ${
            selectedComponentId === 'cmp-turbine-blades' ? 'filter drop-shadow-[0_0_15px_#ffb4ab]' : ''
          }`}
          onClick={() => {
            const c = getComponent('cmp-turbine-blades');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          {/* Stage 1 (High Pressure - Small) */}
          <g className={`origin-[180px_200px] ${isRunning ? 'animate-spin-cw' : ''}`} style={{ animationDuration: `${duration}s` }}>
            <rect x="175" y="150" width="10" height="100" rx="2" fill="#d71920" />
            <circle cx="180" cy="200" r="14" fill="#ffdad6" />
          </g>

          {/* Stage 2 (Intermediate) */}
          <g className={`origin-[260px_200px] ${isRunning ? 'animate-spin-cw' : ''}`} style={{ animationDuration: `${duration}s` }}>
            <rect x="254" y="130" width="12" height="140" rx="2" fill="#ffb4ab" />
            <circle cx="260" cy="200" r="18" fill="#121315" stroke="#d71920" />
          </g>

          {/* Stage 3 (Intermediate-High) */}
          <g className={`origin-[340px_200px] ${isRunning ? 'animate-spin-cw' : ''}`} style={{ animationDuration: `${duration}s` }}>
            <rect x="333" y="110" width="14" height="180" rx="2" fill="#c6c6c7" />
            <circle cx="340" cy="200" r="22" fill="#d71920" />
          </g>

          {/* Stage 4 (Low Pressure - Huge Titanium Aerofoils) */}
          <g className={`origin-[420px_200px] ${isRunning ? 'animate-spin-cw' : ''}`} style={{ animationDuration: `${duration}s` }}>
            <rect x="412" y="90" width="16" height="220" rx="2" fill="#ffdad6" />
            <circle cx="420" cy="200" r="26" fill="#1f2022" stroke="#ffdad6" />
          </g>
        </g>

        {/* Supercritical High-Enthalpy Steam Flow Rays */}
        {isRunning && (
          <g opacity="0.7">
            <line x1="120" y1="160" x2="460" y2="100" stroke="#06b6d4" strokeWidth="2.5" strokeDasharray="8 6" className="animate-pulse" />
            <line x1="120" y1="240" x2="460" y2="300" stroke="#06b6d4" strokeWidth="2.5" strokeDasharray="8 6" className="animate-pulse" />
          </g>
        )}
      </svg>
    </div>
  );
};

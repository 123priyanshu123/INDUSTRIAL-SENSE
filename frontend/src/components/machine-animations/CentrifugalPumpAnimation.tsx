import React from 'react';
import { MachineAnimationProps } from '../../types/animation';

export const CentrifugalPumpAnimation: React.FC<MachineAnimationProps> = ({
  state,
  speed,
  isPlaying,
  components,
  selectedComponentId,
  onSelectComponent,
}) => {
  const isRunning = isPlaying && (state === 'running' || state === 'warning' || state === 'critical');
  const duration = 2.4 / speed;

  const getComponent = (id: string) => components.find(c => c.id === id);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <svg
        viewBox="0 0 600 400"
        className="w-full max-h-[380px] drop-shadow-2xl select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="casingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#292a2c" />
            <stop offset="50%" stopColor="#1f2022" />
            <stop offset="100%" stopColor="#121315" />
          </linearGradient>
          <linearGradient id="fluidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Foundation & Baseplate */}
        <rect x="80" y="330" width="440" height="24" rx="4" fill="#1b1c1e" stroke="#38393b" strokeWidth="2" />
        <line x1="80" y1="354" x2="520" y2="354" stroke="#d71920" strokeWidth="2" strokeDasharray="6 4" />

        {/* Suction Inlet Flange (Left) */}
        <g 
          className="cursor-pointer group"
          onClick={() => {
            const c = getComponent('cmp-volute');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          <rect x="50" y="180" width="80" height="70" rx="3" fill="#292a2c" stroke="#38393b" strokeWidth="2" />
          <rect x="38" y="170" width="16" height="90" rx="2" fill="#38393b" />
          <circle cx="46" cy="185" r="4" fill="#0d0e10" />
          <circle cx="46" cy="245" r="4" fill="#0d0e10" />
          <text x="56" y="220" fill="#a1a1aa" fontSize="10" fontFamily="Space Mono">SUCTION</text>
        </g>

        {/* Volute Spiral Casing (Center) */}
        <g
          className={`cursor-pointer transition-all duration-300 ${selectedComponentId === 'cmp-volute' ? 'filter drop-shadow-[0_0_12px_#d71920]' : ''}`}
          onClick={() => {
            const c = getComponent('cmp-volute');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          <path
            d="M 160 215 C 160 120, 260 90, 340 100 C 420 110, 440 210, 400 280 C 350 340, 210 330, 160 215 Z"
            fill="url(#casingGrad)"
            stroke={state === 'critical' ? '#ef4444' : state === 'warning' ? '#f59e0b' : '#38393b'}
            strokeWidth="3"
          />
          <circle cx="280" cy="215" r="95" fill="#121315" stroke="#292a2c" strokeWidth="2" />
        </g>

        {/* Discharge Outlet (Top) */}
        <rect x="290" y="30" width="60" height="80" fill="#292a2c" stroke="#38393b" strokeWidth="2" />
        <rect x="280" y="20" width="80" height="16" rx="2" fill="#38393b" />
        <text x="320" y="65" fill="#a1a1aa" fontSize="10" fontFamily="Space Mono" textAnchor="middle">DISCHARGE</text>

        {/* Bearing Bracket & Drive Shaft Housing (Right) */}
        <g
          className={`cursor-pointer ${selectedComponentId === 'cmp-bearing' ? 'filter drop-shadow-[0_0_10px_#f59e0b]' : ''}`}
          onClick={() => {
            const c = getComponent('cmp-bearing');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          <rect x="360" y="195" width="120" height="40" fill="#1f2022" stroke="#38393b" strokeWidth="2" />
          <rect x="420" y="185" width="40" height="60" rx="3" fill="#292a2c" stroke="#5d3f3c" strokeWidth="1.5" />
          <text x="440" y="218" fill="#e6bdb8" fontSize="8" fontFamily="Space Mono" textAnchor="middle">BEARING</text>
        </g>

        {/* Rotating Shaft */}
        <rect x="270" y="210" width="260" height="10" fill="#c6c6c7" stroke="#38393b" />

        {/* Rotating Impeller Assembly */}
        <g
          className={`cursor-pointer origin-[280px_215px] ${isRunning ? 'animate-spin-cw' : ''}`}
          style={{ animationDuration: `${duration}s` }}
          onClick={() => {
            const c = getComponent('cmp-impeller');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          {/* Central Impeller Hub */}
          <circle cx="280" cy="215" r="28" fill="#d71920" stroke="#ffdad6" strokeWidth="2" />
          <circle cx="280" cy="215" r="10" fill="#121315" />

          {/* Curved Impeller Vanes (6 Curved Vanes) */}
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <path
              key={deg}
              d="M 280 215 Q 310 180, 350 175"
              stroke="#ffb4ab"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              transform={`rotate(${deg} 280 215)`}
            />
          ))}

          {/* Secondary micro-blades */}
          {[30, 90, 150, 210, 270, 330].map((deg) => (
            <path
              key={deg}
              d="M 280 215 Q 295 195, 320 190"
              stroke="#d71920"
              strokeWidth="2.5"
              strokeDasharray="2 2"
              fill="none"
              transform={`rotate(${deg} 280 215)`}
            />
          ))}
        </g>

        {/* Dynamic Fluid Flow Vectors when running */}
        {isRunning && (
          <g opacity="0.6">
            <circle cx="280" cy="215" r="70" fill="none" stroke="url(#fluidGrad)" strokeWidth="3" strokeDasharray="16 12" className="animate-spin-cw" style={{ animationDuration: `${duration * 0.8}s` }} />
            <path d="M 320 100 L 320 35" stroke="#06b6d4" strokeWidth="3" strokeDasharray="6 4" className="animate-pulse" />
          </g>
        )}

        {/* Component Label Pin */}
        <g transform="translate(280, 285)">
          <rect x="-55" y="-12" width="110" height="24" rx="4" fill="#0d0e10" stroke="#ad8884" strokeWidth="1" />
          <text x="0" y="4" fill="#e3e2e5" fontSize="10" fontFamily="Space Mono" textAnchor="middle">
            RADIAL IMPELLER
          </text>
        </g>
      </svg>
    </div>
  );
};

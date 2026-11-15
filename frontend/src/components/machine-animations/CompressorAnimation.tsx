import React from 'react';
import { MachineAnimationProps } from '../../types/animation';

export const CompressorAnimation: React.FC<MachineAnimationProps> = ({
  state,
  speed,
  isPlaying,
  components,
  selectedComponentId,
  onSelectComponent,
}) => {
  const isRunning = isPlaying && (state === 'running' || state === 'warning' || state === 'critical');
  const duration = 1.2 / speed;

  const getComponent = (id: string) => components.find(c => c.id === id);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <svg
        viewBox="0 0 600 400"
        className="w-full max-h-[380px] drop-shadow-2xl select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cast Iron Crankcase Lower Body */}
        <path d="M 200 240 L 400 240 L 380 340 L 220 340 Z" fill="#1b1c1e" stroke="#38393b" strokeWidth="2" />

        {/* Cylinder Bore Wall (Vertical Chamber) */}
        <g
          className={`cursor-pointer ${
            selectedComponentId === 'cmp-piston' ? 'filter drop-shadow-[0_0_12px_#d71920]' : ''
          }`}
          onClick={() => {
            const c = getComponent('cmp-piston');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          {/* Cylinder Block */}
          <rect x="230" y="60" width="140" height="180" fill="#1f2022" stroke="#38393b" strokeWidth="2" />
          
          {/* Cylinder Cooling Fins */}
          {[80, 100, 120, 140, 160, 180, 200].map((y) => (
            <line key={y} x1="215" y1={y} x2="385" y2={y} stroke="#343537" strokeWidth="3" />
          ))}

          {/* Cylinder Bore Cavity */}
          <rect x="245" y="70" width="110" height="160" fill="#121315" stroke="#292a2c" />

          {/* Reciprocating Piston Head */}
          <g className={isRunning ? 'animate-piston' : ''} style={{ animationDuration: `${duration}s` }}>
            <rect x="250" y="110" width="100" height="50" rx="3" fill="#292a2c" stroke="#d71920" strokeWidth="2" />
            {/* Piston Compression Rings */}
            <line x1="250" y1="120" x2="350" y2="120" stroke="#ffdad6" strokeWidth="2" />
            <line x1="250" y1="130" x2="350" y2="130" stroke="#ffdad6" strokeWidth="2" />
            {/* Wrist Pin */}
            <circle cx="300" cy="140" r="8" fill="#c6c6c7" stroke="#121315" />
            {/* Connecting Rod */}
            <line x1="300" y1="140" x2="300" y2="270" stroke="#c6c6c7" strokeWidth="8" strokeLinecap="round" />
          </g>
        </g>

        {/* Cylinder Head & Valve Plate (Top) */}
        <g
          className={`cursor-pointer ${
            selectedComponentId === 'cmp-reed-valve' ? 'filter drop-shadow-[0_0_10px_#06b6d4]' : ''
          }`}
          onClick={() => {
            const c = getComponent('cmp-reed-valve');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          <rect x="220" y="40" width="160" height="25" rx="3" fill="#292a2c" stroke="#5d3f3c" strokeWidth="2" />
          {/* Suction Reed Valve */}
          <circle cx="270" cy="52" r="5" fill="#06b6d4" className={isRunning ? 'animate-pulse' : ''} />
          {/* Discharge Reed Valve */}
          <circle cx="330" cy="52" r="5" fill="#d71920" className={isRunning ? 'animate-pulse' : ''} />
          <text x="300" y="30" fill="#a1a1aa" fontSize="9" fontFamily="Space Mono" textAnchor="middle">DUAL REED VALVES</text>
        </g>

        {/* Rotating Crankshaft Flywheel (Bottom Center) */}
        <g
          className={`cursor-pointer origin-[300px_275px] ${
            isRunning ? 'animate-spin-cw' : ''
          } ${selectedComponentId === 'cmp-crankshaft' ? 'filter drop-shadow-[0_0_10px_#f59e0b]' : ''}`}
          style={{ animationDuration: `${duration}s` }}
          onClick={() => {
            const c = getComponent('cmp-crankshaft');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          <circle cx="300" cy="275" r="45" fill="#121315" stroke="#38393b" strokeWidth="2" />
          {/* Crank Counterweight */}
          <path d="M 270 275 A 45 45 0 0 0 330 275 Z" fill="#5d3f3c" />
          {/* Crankpin Offset */}
          <circle cx="300" cy="250" r="10" fill="#d71920" stroke="#ffdad6" />
        </g>
      </svg>
    </div>
  );
};

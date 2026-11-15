import React from 'react';
import { MachineAnimationProps } from '../../types/animation';

export const GearboxAnimation: React.FC<MachineAnimationProps> = ({
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
        {/* Cast Iron Heavy Gearbox Casing Frame */}
        <rect x="70" y="50" width="460" height="290" rx="14" fill="#1b1c1e" stroke={state === 'warning' ? '#f59e0b' : '#38393b'} strokeWidth="3" />
        <rect x="90" y="70" width="420" height="250" rx="10" fill="#121315" stroke="#292a2c" />

        {/* Lube Oil Sump Level at Bottom */}
        <rect x="90" y="275" width="420" height="45" fill="#f59e0b" fillOpacity="0.15" />
        <line x1="90" y1="275" x2="510" y2="275" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6 4" />
        <text x="110" y="295" fill="#f59e0b" fontSize="8" fontFamily="Space Mono">ISO VG 320 OIL SUMP</text>

        {/* Left Small Input High-Speed Pinion Gear (Rotates Clockwise) */}
        <g
          className={`cursor-pointer ${
            selectedComponentId === 'cmp-pinion' ? 'filter drop-shadow-[0_0_15px_#d71920]' : ''
          }`}
          onClick={() => {
            const c = getComponent('cmp-pinion');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          <g
            className={`origin-[210px_180px] ${isRunning ? 'animate-spin-cw' : ''}`}
            style={{ animationDuration: `${duration * 0.4}s` }}
          >
            {/* Gear Body Circle */}
            <circle cx="210" cy="180" r="50" fill="#1f2022" stroke="#d71920" strokeWidth="2.5" />
            
            {/* 12 Involute Gear Teeth */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <polygon
                key={deg}
                points="206,124 214,124 216,134 204,134"
                fill="#ffb4ab"
                stroke="#690006"
                transform={`rotate(${deg} 210 180)`}
              />
            ))}

            {/* Shaft & Keyway */}
            <circle cx="210" cy="180" r="16" fill="#292a2c" stroke="#ffdad6" />
            <circle cx="210" cy="180" r="6" fill="#121315" />
          </g>
          <text x="210" y="110" fill="#a1a1aa" fontSize="9" fontFamily="Space Mono" textAnchor="middle">INPUT PINION (1450 RPM)</text>
        </g>

        {/* Right Large Driven Bull Gear (Rotates Counter-Clockwise, Meshing Perfectly at x=256) */}
        <g
          className={`cursor-pointer ${
            selectedComponentId === 'cmp-bull-gear' ? 'filter drop-shadow-[0_0_15px_#06b6d4]' : ''
          }`}
          onClick={() => {
            const c = getComponent('cmp-bull-gear');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          <g
            className={`origin-[350px_180px] ${isRunning ? 'animate-spin-ccw' : ''}`}
            style={{ animationDuration: `${duration}s` }}
          >
            {/* Bull Gear Pitch Circle */}
            <circle cx="350" cy="180" r="95" fill="#1f2022" stroke="#38393b" strokeWidth="2.5" />

            {/* 24 Helical Gear Teeth */}
            {Array.from({ length: 24 }).map((_, idx) => {
              const deg = idx * 15;
              return (
                <polygon
                  key={deg}
                  points="346,78 354,78 356,90 344,90"
                  fill="#c6c6c7"
                  stroke="#121315"
                  transform={`rotate(${deg} 350 180)`}
                />
              );
            })}

            {/* Bull Gear Spokes / Webbing */}
            <circle cx="350" cy="180" r="70" fill="none" stroke="#292a2c" strokeWidth="4" />
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <line
                key={deg}
                x1="350"
                y1="180"
                x2="350"
                y2="110"
                stroke="#343537"
                strokeWidth="5"
                transform={`rotate(${deg} 350 180)`}
              />
            ))}

            {/* Bull Gear Hub */}
            <circle cx="350" cy="180" r="28" fill="#d71920" stroke="#ffdad6" strokeWidth="2" />
            <circle cx="350" cy="180" r="10" fill="#121315" />
          </g>
          <text x="350" y="70" fill="#a1a1aa" fontSize="9" fontFamily="Space Mono" textAnchor="middle">OUTPUT BULL GEAR (360 RPM)</text>
        </g>

        {/* Meshing Contact Zone Micro-Friction Spark */}
        {isRunning && (
          <g className="animate-pulse">
            <circle cx="258" cy="180" r="4" fill="#f59e0b" />
            <circle cx="258" cy="180" r="10" fill="#d71920" opacity="0.3" />
          </g>
        )}
      </svg>
    </div>
  );
};

import React from 'react';
import { MachineAnimationProps } from '../../types/animation';

export const IndustrialMotorAnimation: React.FC<MachineAnimationProps> = ({
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
        {/* Foot Mounting Base Pads */}
        <rect x="150" y="315" width="80" height="25" rx="3" fill="#1b1c1e" stroke="#38393b" strokeWidth="2" />
        <rect x="370" y="315" width="80" height="25" rx="3" fill="#1b1c1e" stroke="#38393b" strokeWidth="2" />

        {/* Ribbed Cast Iron Motor Stator Frame */}
        <g
          className={`cursor-pointer ${
            selectedComponentId === 'cmp-stator-windings' ? 'filter drop-shadow-[0_0_12px_#d71920]' : ''
          }`}
          onClick={() => {
            const c = getComponent('cmp-stator-windings');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          {/* Main Body Cylindrical Stator */}
          <rect x="140" y="110" width="320" height="205" rx="12" fill="#1f2022" stroke={state === 'critical' ? '#ef4444' : '#38393b'} strokeWidth="3" />
          
          {/* Stator Cooling Fins / Ribs */}
          {[130, 150, 170, 190, 210, 230, 250, 270, 290].map((y) => (
            <line key={y} x1="140" y1={y} x2="460" y2={y} stroke="#343537" strokeWidth="3" />
          ))}

          {/* Terminal Box (Top Junction) */}
          <rect x="250" y="70" width="100" height="40" rx="4" fill="#292a2c" stroke="#5d3f3c" strokeWidth="2" />
          <circle cx="300" cy="90" r="5" fill="#f59e0b" />
          <text x="300" y="60" fill="#a1a1aa" fontSize="9" fontFamily="Space Mono" textAnchor="middle">415V 3-PHASE JUNCTION</text>
        </g>

        {/* End Bell Shields */}
        <rect x="120" y="130" width="20" height="165" rx="4" fill="#292a2c" stroke="#38393b" />
        <rect x="460" y="130" width="20" height="165" rx="4" fill="#292a2c" stroke="#38393b" />

        {/* Motor Output Shaft (Drive-End Right) */}
        <g
          className={`cursor-pointer ${
            selectedComponentId === 'cmp-rotor' ? 'filter drop-shadow-[0_0_10px_#ffb4ab]' : ''
          }`}
          onClick={() => {
            const c = getComponent('cmp-rotor');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          <rect x="480" y="195" width="80" height="35" rx="2" fill="#c6c6c7" stroke="#38393b" strokeWidth="2" />
          {/* Keyway Slot */}
          <rect x="500" y="198" width="40" height="6" fill="#121315" />
        </g>

        {/* Non-Drive End External Cooling Fan Cowl & Rotating Fan (Left) */}
        <g
          className={`cursor-pointer ${
            selectedComponentId === 'cmp-cooling-fan' ? 'filter drop-shadow-[0_0_12px_#06b6d4]' : ''
          }`}
          onClick={() => {
            const c = getComponent('cmp-cooling-fan');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          {/* Cowl Shroud */}
          <path d="M 60 135 L 120 125 L 120 300 L 60 290 Z" fill="#1b1c1e" stroke="#38393b" strokeWidth="2" />
          {/* Cowl Louver Slots */}
          {[160, 180, 200, 220, 240, 260].map((y) => (
            <line key={y} x1="75" y1={y} x2="105" y2={y} stroke="#121315" strokeWidth="4" />
          ))}

          {/* Internal Cooling Fan Impeller Visible inside Cowl */}
          <g
            className={`origin-[90px_212px] ${isRunning ? 'animate-spin-cw' : ''}`}
            style={{ animationDuration: `${duration * 0.7}s` }}
          >
            <circle cx="90" cy="212" r="14" fill="#d71920" />
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <line
                key={deg}
                x1="90"
                y1="212"
                x2="90"
                y2="175"
                stroke="#ffdad6"
                strokeWidth="4"
                transform={`rotate(${deg} 90 212)`}
              />
            ))}
          </g>
        </g>

        {/* Dynamic Electromagnetic Field Flux Indicators when running */}
        {isRunning && (
          <g opacity="0.7">
            <line x1="160" y1="212" x2="440" y2="212" stroke="#d71920" strokeWidth="3" strokeDasharray="8 6" className="animate-pulse" />
            <circle cx="300" cy="212" r="60" fill="none" stroke="#ffb4ab" strokeWidth="2" strokeDasharray="6 12" className="animate-spin-cw" style={{ animationDuration: `${duration * 2}s` }} />
          </g>
        )}
      </svg>
    </div>
  );
};

import React from 'react';
import { MachineAnimationProps } from '../../types/animation';

export const BeltConveyorAnimation: React.FC<MachineAnimationProps> = ({
  state,
  speed,
  isPlaying,
  components,
  selectedComponentId,
  onSelectComponent,
}) => {
  const isRunning = isPlaying && (state === 'running' || state === 'warning' || state === 'critical');
  const duration = 1.6 / speed;

  const getComponent = (id: string) => components.find(c => c.id === id);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <svg
        viewBox="0 0 600 400"
        className="w-full max-h-[380px] drop-shadow-2xl select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Truss Frame Legs */}
        <polygon points="110,240 130,240 145,340 100,340" fill="#1f2022" stroke="#38393b" />
        <polygon points="460,240 480,240 495,340 450,340" fill="#1f2022" stroke="#38393b" />
        <line x1="80" y1="340" x2="520" y2="340" stroke="#292a2c" strokeWidth="4" />

        {/* Structural Truss Channel */}
        <rect x="80" y="210" width="440" height="25" fill="#292a2c" stroke="#38393b" strokeWidth="2" />

        {/* Left Idler / Return Tail Pulley */}
        <g
          className={`cursor-pointer ${
            selectedComponentId === 'cmp-idlers' ? 'filter drop-shadow-[0_0_10px_#06b6d4]' : ''
          }`}
          onClick={() => {
            const c = getComponent('cmp-idlers');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          <circle cx="120" cy="200" r="35" fill="#1f2022" stroke="#5d3f3c" strokeWidth="2" />
          <g className={`origin-[120px_200px] ${isRunning ? 'animate-spin-cw' : ''}`} style={{ animationDuration: `${duration}s` }}>
            <line x1="120" y1="170" x2="120" y2="230" stroke="#ad8884" strokeWidth="3" />
            <line x1="90" y1="200" x2="150" y2="200" stroke="#ad8884" strokeWidth="3" />
          </g>
          <circle cx="120" cy="200" r="10" fill="#0d0e10" />
        </g>

        {/* Right Motorized Drive Head Pulley */}
        <g
          className={`cursor-pointer ${
            selectedComponentId === 'cmp-drive-roller' ? 'filter drop-shadow-[0_0_12px_#d71920]' : ''
          }`}
          onClick={() => {
            const c = getComponent('cmp-drive-roller');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          <circle cx="480" cy="200" r="35" fill="#1f2022" stroke="#d71920" strokeWidth="2.5" />
          <g className={`origin-[480px_200px] ${isRunning ? 'animate-spin-cw' : ''}`} style={{ animationDuration: `${duration}s` }}>
            <line x1="480" y1="170" x2="480" y2="230" stroke="#ffdad6" strokeWidth="3" />
            <line x1="450" y1="200" x2="510" y2="200" stroke="#ffdad6" strokeWidth="3" />
          </g>
          <circle cx="480" cy="200" r="12" fill="#d71920" />
        </g>

        {/* Support Idlers (Middle) */}
        {[200, 280, 360, 420].map((cx) => (
          <g key={cx} className={`origin-[${cx}px_195px] ${isRunning ? 'animate-spin-cw' : ''}`} style={{ animationDuration: `${duration * 0.5}s` }}>
            <circle cx={cx} cy="195" r="16" fill="#1b1c1e" stroke="#38393b" strokeWidth="1.5" />
            <circle cx={cx} cy="195" r="4" fill="#5d3f3c" />
          </g>
        ))}

        {/* Endless Conveyor Belt */}
        <g
          className={`cursor-pointer ${
            selectedComponentId === 'cmp-belt' ? 'filter drop-shadow-[0_0_10px_#f59e0b]' : ''
          }`}
          onClick={() => {
            const c = getComponent('cmp-belt');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          {/* Top Running Strand */}
          <line x1="120" y1="165" x2="480" y2="165" stroke="#121315" strokeWidth="10" strokeLinecap="round" />
          <line
            x1="120"
            y1="165"
            x2="480"
            y2="165"
            stroke="#ffb4ab"
            strokeWidth="3"
            strokeDasharray="16 16"
            className={isRunning ? 'animate-conveyor' : ''}
          />

          {/* Bottom Return Strand */}
          <line x1="120" y1="235" x2="480" y2="235" stroke="#121315" strokeWidth="8" />
        </g>

        {/* Transported Industrial Ore Packages */}
        {isRunning && (
          <g className="animate-conveyor">
            <rect x="180" y="130" width="34" height="30" rx="3" fill="#d71920" stroke="#ffdad6" strokeWidth="1.5" />
            <rect x="290" y="130" width="34" height="30" rx="3" fill="#38393b" stroke="#ad8884" strokeWidth="1.5" />
            <rect x="400" y="130" width="34" height="30" rx="3" fill="#d71920" stroke="#ffdad6" strokeWidth="1.5" />
          </g>
        )}
      </svg>
    </div>
  );
};

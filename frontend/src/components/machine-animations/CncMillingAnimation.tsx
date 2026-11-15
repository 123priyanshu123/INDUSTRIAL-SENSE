import React from 'react';
import { MachineAnimationProps } from '../../types/animation';

export const CncMillingAnimation: React.FC<MachineAnimationProps> = ({
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
        <defs>
          <linearGradient id="cncGantryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38393b" />
            <stop offset="100%" stopColor="#1b1c1e" />
          </linearGradient>
        </defs>

        {/* Machine Enclosure Columns */}
        <rect x="70" y="40" width="36" height="300" fill="url(#cncGantryGrad)" stroke="#38393b" />
        <rect x="494" y="40" width="36" height="300" fill="url(#cncGantryGrad)" stroke="#38393b" />
        <rect x="70" y="30" width="460" height="30" fill="#292a2c" stroke="#38393b" />

        {/* Cast Iron Base Bed */}
        <rect x="50" y="330" width="500" height="30" rx="4" fill="#1b1c1e" stroke="#38393b" strokeWidth="2" />

        {/* Sliding Worktable (X-Axis) */}
        <g
          className={`cursor-pointer transition-transform duration-500 ${
            isRunning ? 'animate-pulse' : ''
          } ${selectedComponentId === 'cmp-worktable' ? 'filter drop-shadow-[0_0_10px_#06b6d4]' : ''}`}
          onClick={() => {
            const c = getComponent('cmp-worktable');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          <rect x="180" y="290" width="240" height="35" rx="3" fill="#292a2c" stroke="#5d3f3c" strokeWidth="1.5" />
          {/* T-Slots */}
          <line x1="200" y1="302" x2="400" y2="302" stroke="#121315" strokeWidth="4" />
          <line x1="200" y1="314" x2="400" y2="314" stroke="#121315" strokeWidth="4" />
          {/* Raw Machining Stock Material Block */}
          <rect x="260" y="250" width="80" height="40" fill="#ad8884" stroke="#ffdad6" strokeWidth="1.5" />
          <text x="300" y="275" fill="#121315" fontSize="9" fontFamily="Space Mono" fontWeight="bold" textAnchor="middle">TITANIUM</text>
        </g>

        {/* Vertical Spindle Head Housing (Z-Axis) */}
        <g
          className={`cursor-pointer ${
            selectedComponentId === 'cmp-spindle' ? 'filter drop-shadow-[0_0_12px_#d71920]' : ''
          }`}
          onClick={() => {
            const c = getComponent('cmp-spindle');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          {/* Gantry Cross Carriage */}
          <rect x="230" y="55" width="140" height="60" rx="4" fill="#1f2022" stroke="#38393b" strokeWidth="2" />
          <text x="300" y="80" fill="#a1a1aa" fontSize="9" fontFamily="Space Mono" textAnchor="middle">Z-AXIS CARRIAGE</text>

          {/* Electro-Spindle Barrel */}
          <rect x="270" y="105" width="60" height="95" rx="3" fill="#292a2c" stroke="#d71920" strokeWidth="2" />
          
          {/* Spindle Collet Chuck */}
          <polygon points="280,200 320,200 312,225 288,225" fill="#c6c6c7" stroke="#121315" />

          {/* End-Mill Cutting Tool with High-Speed Spin Motion */}
          <g className={isRunning ? 'animate-spin-cw origin-[300px_235px]' : ''} style={{ animationDuration: `${duration * 0.4}s` }}>
            <rect x="296" y="225" width="8" height="26" fill="#ffb4ab" stroke="#690006" />
            {/* Flute Spiral Markings */}
            <line x1="296" y1="230" x2="304" y2="234" stroke="#121315" strokeWidth="1.5" />
            <line x1="296" y1="238" x2="304" y2="242" stroke="#121315" strokeWidth="1.5" />
            <line x1="296" y1="246" x2="304" y2="250" stroke="#121315" strokeWidth="1.5" />
          </g>
        </g>

        {/* Machining Spark / Chip Ejection when Running */}
        {isRunning && (
          <g className="animate-pulse">
            <circle cx="308" cy="252" r="2" fill="#f59e0b" />
            <circle cx="292" cy="254" r="2.5" fill="#f59e0b" />
            <circle cx="316" cy="260" r="1.5" fill="#ffb4ab" />
            <line x1="300" y1="250" x2="320" y2="242" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
          </g>
        )}

        {/* Coordinates HUD Overlay */}
        <g transform="translate(420, 75)">
          <rect x="0" y="0" width="100" height="48" rx="4" fill="#0d0e10" stroke="#292a2c" />
          <text x="10" y="16" fill="#06b6d4" fontSize="8" fontFamily="Space Mono">X: +142.08 mm</text>
          <text x="10" y="28" fill="#06b6d4" fontSize="8" fontFamily="Space Mono">Y: -084.22 mm</text>
          <text x="10" y="40" fill="#22c55e" fontSize="8" fontFamily="Space Mono">Z: -012.50 mm</text>
        </g>
      </svg>
    </div>
  );
};

import React from 'react';
import { MachineAnimationProps } from '../../types/animation';

export const LatheAnimation: React.FC<MachineAnimationProps> = ({
  state,
  speed,
  isPlaying,
  components,
  selectedComponentId,
  onSelectComponent,
}) => {
  const isRunning = isPlaying && (state === 'running' || state === 'warning' || state === 'critical');
  const duration = 1.4 / speed;

  const getComponent = (id: string) => components.find(c => c.id === id);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <svg
        viewBox="0 0 600 400"
        className="w-full max-h-[380px] drop-shadow-2xl select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Lathe Bed Guide Ways */}
        <rect x="60" y="310" width="480" height="35" rx="4" fill="#1b1c1e" stroke="#38393b" strokeWidth="2" />
        <line x1="80" y1="325" x2="520" y2="325" stroke="#5d3f3c" strokeWidth="3" strokeDasharray="12 4" />

        {/* Headstock Housing (Left) */}
        <rect x="60" y="120" width="120" height="190" rx="4" fill="#1f2022" stroke="#38393b" strokeWidth="2" />
        <rect x="75" y="140" width="90" height="40" fill="#121315" stroke="#292a2c" />
        <text x="120" y="165" fill="#a1a1aa" fontSize="9" fontFamily="Space Mono" textAnchor="middle">HEADSTOCK</text>

        {/* 3-Jaw Chuck Assembly */}
        <g
          className={`cursor-pointer ${
            selectedComponentId === 'cmp-chuck' ? 'filter drop-shadow-[0_0_12px_#d71920]' : ''
          }`}
          onClick={() => {
            const c = getComponent('cmp-chuck');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          <rect x="180" y="150" width="35" height="130" rx="3" fill="#292a2c" stroke="#38393b" strokeWidth="2" />
          {/* Top Chuck Jaw */}
          <rect x="205" y="160" width="22" height="28" fill="#c6c6c7" stroke="#121315" />
          {/* Bottom Chuck Jaw */}
          <rect x="205" y="242" width="22" height="28" fill="#c6c6c7" stroke="#121315" />
        </g>

        {/* Clamped Cylindrical Workpiece Rotating */}
        <g
          className={`cursor-pointer ${
            selectedComponentId === 'cmp-workpiece' ? 'filter drop-shadow-[0_0_10px_#06b6d4]' : ''
          }`}
          onClick={() => {
            const c = getComponent('cmp-workpiece');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          {/* Stock Billett Bar */}
          <rect x="215" y="195" width="235" height="40" fill="#38393b" stroke="#ad8884" strokeWidth="1.5" />
          {/* Machined Turned Section (Step Cut) */}
          <rect x="280" y="202" width="130" height="26" fill="#c6c6c7" stroke="#d71920" strokeWidth="1.5" />
          
          {/* Longitudinal Surface Lines giving rotation effect */}
          {isRunning && (
            <g className="animate-pulse">
              <line x1="285" y1="208" x2="405" y2="208" stroke="#121315" strokeWidth="2" strokeDasharray="14 10" />
              <line x1="285" y1="222" x2="405" y2="222" stroke="#121315" strokeWidth="2" strokeDasharray="18 12" />
            </g>
          )}
        </g>

        {/* Tailstock Assembly (Right) */}
        <g>
          <polygon points="450,185 520,185 540,310 460,310" fill="#1f2022" stroke="#38393b" strokeWidth="2" />
          {/* Live Center Cone */}
          <polygon points="450,215 425,215 450,205 450,225" fill="#c6c6c7" stroke="#121315" />
          <text x="500" y="250" fill="#a1a1aa" fontSize="9" fontFamily="Space Mono" textAnchor="middle">TAILSTOCK</text>
        </g>

        {/* Tool Post Carriage with Carbide Insert (Feeding in) */}
        <g
          className={`cursor-pointer transition-transform ${
            selectedComponentId === 'cmp-tool-post' ? 'filter drop-shadow-[0_0_12px_#d71920]' : ''
          }`}
          onClick={() => {
            const c = getComponent('cmp-tool-post');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          {/* Carriage Saddle */}
          <rect x="330" y="240" width="85" height="70" rx="3" fill="#292a2c" stroke="#5d3f3c" strokeWidth="2" />
          {/* Tool Shank */}
          <rect x="345" y="215" width="24" height="35" fill="#1b1c1e" stroke="#38393b" />
          {/* Golden TiN Carbide Insert Tool Tip */}
          <polygon points="345,215 330,215 338,202" fill="#f59e0b" stroke="#121315" strokeWidth="1" />
        </g>

        {/* Swarf Metal Chips Ejection */}
        {isRunning && (
          <g className="animate-spin-cw origin-[335px_210px]" style={{ animationDuration: `${duration}s` }}>
            <path d="M 334 210 Q 320 195, 310 205" stroke="#ffdad6" strokeWidth="2" fill="none" />
            <path d="M 336 212 Q 325 225, 315 220" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
          </g>
        )}
      </svg>
    </div>
  );
};

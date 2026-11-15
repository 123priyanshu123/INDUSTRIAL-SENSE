import React from 'react';
import { MachineAnimationProps } from '../../types/animation';

export const RoboticArmAnimation: React.FC<MachineAnimationProps> = ({
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
        {/* Robot Floor Pedestal Base */}
        <polygon points="120,340 220,340 200,300 140,300" fill="#1b1c1e" stroke="#38393b" strokeWidth="2" />
        <rect x="110" y="340" width="120" height="15" rx="3" fill="#292a2c" stroke="#5d3f3c" />

        {/* Base Turntable Joint J1 */}
        <g
          className={`cursor-pointer ${
            selectedComponentId === 'cmp-joint-j1-j3' ? 'filter drop-shadow-[0_0_12px_#d71920]' : ''
          }`}
          onClick={() => {
            const c = getComponent('cmp-joint-j1-j3');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          <rect x="145" y="270" width="50" height="30" rx="3" fill="#292a2c" stroke="#d71920" strokeWidth="2" />
          <circle cx="170" cy="270" r="16" fill="#1f2022" stroke="#ffdad6" strokeWidth="2" />
        </g>

        {/* Articulated Lower Arm (Shoulder Link J2) */}
        <g className={isRunning ? 'animate-pulse' : ''} style={{ animationDuration: `${duration}s` }}>
          {/* Link Tube */}
          <line x1="170" y1="270" x2="250" y2="150" stroke="#ffb4ab" strokeWidth="18" strokeLinecap="round" />
          <line x1="170" y1="270" x2="250" y2="150" stroke="#d71920" strokeWidth="6" strokeLinecap="round" />
          
          {/* Elbow Joint J3 */}
          <circle cx="250" cy="150" r="22" fill="#1f2022" stroke="#38393b" strokeWidth="2.5" />
          <circle cx="250" cy="150" r="8" fill="#d71920" />
        </g>

        {/* Forearm Linkage (Elbow to Wrist J4/J5) */}
        <g>
          <line x1="250" y1="150" x2="390" y2="170" stroke="#c6c6c7" strokeWidth="14" strokeLinecap="round" />
          <line x1="250" y1="150" x2="390" y2="170" stroke="#38393b" strokeWidth="4" strokeLinecap="round" />
          
          {/* Harmonic Wrist Joint J5 */}
          <g
            className={`cursor-pointer ${
              selectedComponentId === 'cmp-wrist' ? 'filter drop-shadow-[0_0_12px_#06b6d4]' : ''
            }`}
            onClick={() => {
              const c = getComponent('cmp-wrist');
              if (c && onSelectComponent) onSelectComponent(c);
            }}
          >
            <circle cx="390" cy="170" r="16" fill="#292a2c" stroke="#06b6d4" strokeWidth="2" />
            <circle cx="390" cy="170" r="6" fill="#121315" />
          </g>
        </g>

        {/* Laser Seam Welding End Effector */}
        <g
          className={`cursor-pointer ${
            selectedComponentId === 'cmp-gripper' ? 'filter drop-shadow-[0_0_12px_#f59e0b]' : ''
          }`}
          onClick={() => {
            const c = getComponent('cmp-gripper');
            if (c && onSelectComponent) onSelectComponent(c);
          }}
        >
          {/* Tool Bracket */}
          <polygon points="390,170 420,185 410,215 380,200" fill="#292a2c" stroke="#5d3f3c" />
          {/* Copper Welding Nozzle */}
          <polygon points="415,200 450,250 440,255 405,205" fill="#f59e0b" stroke="#121315" />

          {/* High Energy Blue Laser Beam / Arc */}
          {isRunning && (
            <g className="animate-pulse">
              <line x1="445" y1="252" x2="475" y2="300" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />
              <circle cx="475" cy="300" r="4" fill="#ffffff" />
              <circle cx="475" cy="300" r="12" fill="#06b6d4" opacity="0.4" />
              {/* Hot Sparks */}
              <circle cx="482" cy="292" r="1.5" fill="#f59e0b" />
              <circle cx="468" cy="308" r="1.5" fill="#f59e0b" />
            </g>
          )}
        </g>

        {/* Ground Target Workpiece */}
        <rect x="420" y="300" width="120" height="20" rx="2" fill="#292a2c" stroke="#38393b" />
      </svg>
    </div>
  );
};

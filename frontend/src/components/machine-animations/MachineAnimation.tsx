import React, { useState } from 'react';
import { Machine, MechanicalComponent } from '../../types/machine';
import { AnimationMode, AnimationSpeed } from '../../types/animation';
import { getAnimationComponent } from './AnimationRegistry';
import { AnimationController } from './AnimationController';
import { getStatusColor } from '../../utils/machineStatus';
import { Volume2, Thermometer, Gauge, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface MachineAnimationProps {
  machine: Machine;
  onSelectComponent?: (component: MechanicalComponent) => void;
}

export const MachineAnimation: React.FC<MachineAnimationProps> = ({
  machine,
  onSelectComponent,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<AnimationSpeed>(1);
  const [mode, setMode] = useState<AnimationMode>('live');
  const [stateOverride, setStateOverride] = useState(machine.status);
  const [showLabels, setShowLabels] = useState(true);
  const [showSensors, setShowSensors] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState<MechanicalComponent | null>(null);

  const AnimationComponent = getAnimationComponent(machine.animationProfile);
  const activeStatus = mode === 'live' ? stateOverride : 'running';
  const statusConfig = getStatusColor(activeStatus);

  const handleComponentClick = (comp: MechanicalComponent) => {
    setSelectedComponent(comp);
    if (onSelectComponent) onSelectComponent(comp);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Top HUD Status Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#1b1c1e] border border-[#292a2c] rounded-xl text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${statusConfig.dot}`} />
          <span className="font-bold text-[#e3e2e5]">{machine.name}</span>
          <span className="text-[#a1a1aa]">•</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
            {statusConfig.label}
          </span>
        </div>

        {mode === 'instructional' ? (
          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-bold flex items-center gap-1">
            <Info className="w-3 h-3" />
            INSTRUCTIONAL PREVIEW (NOT LIVE SENSING)
          </span>
        ) : (
          <span className="text-[#22c55e] text-[10px] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping" />
            LIVE TELEMETRY STREAM
          </span>
        )}
      </div>

      {/* Main Animation Viewport Stage */}
      <div className="relative w-full h-[380px] bg-[#121315] border border-[#292a2c] rounded-2xl overflow-hidden flex items-center justify-center scada-grid-bg">
        {/* Machine SVG Mechanical Motion */}
        <AnimationComponent
          machineId={machine.id}
          state={activeStatus}
          speed={speed}
          isPlaying={isPlaying}
          mode={mode}
          components={machine.components}
          selectedComponentId={selectedComponent?.id}
          onSelectComponent={handleComponentClick}
          showLabels={showLabels}
          showSensors={showSensors}
        />

        {/* Sensor Hotspot Overlays */}
        {showSensors &&
          machine.sensorLocations.map((marker) => {
            const isWarn = activeStatus === 'warning';
            const isCrit = activeStatus === 'critical';
            return (
              <div
                key={marker.id}
                style={{ top: `${marker.yPercent}%`, left: `${marker.xPercent}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
              >
                {/* Hotspot Ring Pulse */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border shadow-lg transition-transform group-hover:scale-125 ${
                    isCrit
                      ? 'bg-rose-500/30 border-rose-500 text-rose-400 animate-ping'
                      : isWarn
                      ? 'bg-amber-500/30 border-amber-500 text-amber-400'
                      : 'bg-cyan-500/30 border-cyan-400 text-cyan-300'
                  }`}
                >
                  {marker.type === 'sound' && <Volume2 className="w-3 h-3" />}
                  {marker.type === 'temperature' && <Thermometer className="w-3 h-3" />}
                  {marker.type === 'pressure' && <Gauge className="w-3 h-3" />}
                </div>

                {/* Floating Telemetry Callout Card */}
                <div className="hidden group-hover:flex flex-col absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#0d0e10]/95 backdrop-blur-md border border-[#292a2c] rounded-lg p-2 min-w-[140px] text-left pointer-events-none shadow-xl z-30">
                  <span className="text-[9px] font-mono text-[#a1a1aa] uppercase">{marker.label}</span>
                  <span className="text-xs font-mono font-bold text-white mt-0.5">{marker.readingSnippet || 'Online'}</span>
                </div>
              </div>
            );
          })}

        {/* Selected Component Inspection Popover Drawer */}
        {selectedComponent && (
          <div className="absolute bottom-3 left-3 right-3 bg-[#1b1c1e]/95 backdrop-blur-md border border-[#38393b] rounded-xl p-3 flex items-start justify-between gap-4 z-30 shadow-2xl animate-fade-in font-mono">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#ffb4ab] font-bold uppercase tracking-wider">MECHANICAL COMPONENT:</span>
                <span className="text-xs font-bold text-white">{selectedComponent.name}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                    selectedComponent.status === 'faulty'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : selectedComponent.status === 'stressed'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {selectedComponent.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-[#a1a1aa] mt-1 font-sans">{selectedComponent.role}</p>
              {selectedComponent.specs && (
                <div className="text-[10px] text-[#e6bdb8] mt-1">Specs: {selectedComponent.specs}</div>
              )}
            </div>

            <button
              onClick={() => setSelectedComponent(null)}
              className="px-2 py-1 bg-[#292a2c] hover:bg-[#343537] text-white rounded text-[10px] font-bold"
            >
              DISMISS
            </button>
          </div>
        )}
      </div>

      {/* Animation Controller Panel */}
      <AnimationController
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onRestart={() => {
          setIsPlaying(false);
          setTimeout(() => setIsPlaying(true), 50);
        }}
        speed={speed}
        onChangeSpeed={setSpeed}
        mode={mode}
        onToggleMode={() => setMode(mode === 'live' ? 'instructional' : 'live')}
        currentState={stateOverride}
        onChangeState={setStateOverride}
        showLabels={showLabels}
        onToggleLabels={() => setShowLabels(!showLabels)}
        showSensors={showSensors}
        onToggleSensors={() => setShowSensors(!showSensors)}
      />
    </div>
  );
};

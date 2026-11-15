import React from 'react';
import { Play, Pause, RotateCcw, Gauge, Eye, Tag, Radio } from 'lucide-react';
import { AnimationMode, AnimationSpeed } from '../../types/animation';
import { MachineOperatingState } from '../../types/machine';

interface AnimationControllerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onRestart: () => void;
  speed: AnimationSpeed;
  onChangeSpeed: (speed: AnimationSpeed) => void;
  mode: AnimationMode;
  onToggleMode: () => void;
  currentState: MachineOperatingState;
  onChangeState: (state: MachineOperatingState) => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  showSensors: boolean;
  onToggleSensors: () => void;
}

export const AnimationController: React.FC<AnimationControllerProps> = ({
  isPlaying,
  onTogglePlay,
  onRestart,
  speed,
  onChangeSpeed,
  mode,
  onToggleMode,
  currentState,
  onChangeState,
  showLabels,
  onToggleLabels,
  showSensors,
  onToggleSensors,
}) => {
  return (
    <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
      {/* Primary Play/Pause/Restart Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onTogglePlay}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all ${
            isPlaying
              ? 'bg-[#d71920] text-white shadow-[0_0_10px_rgba(215,25,32,0.4)]'
              : 'bg-[#292a2c] text-[#e3e2e5] hover:bg-[#343537]'
          }`}
          title={isPlaying ? 'Pause Animation' : 'Start Animation'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
        </button>

        <button
          onClick={onRestart}
          className="p-1.5 rounded-lg bg-[#292a2c] text-[#a1a1aa] hover:text-white hover:bg-[#343537] transition-all"
          title="Restart Cycle"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Speed Multiplier Segmented Buttons */}
        <div className="flex items-center bg-[#121315] p-0.5 rounded-lg border border-[#292a2c]">
          {([0.5, 1, 2] as AnimationSpeed[]).map((s) => (
            <button
              key={s}
              onClick={() => onChangeSpeed(s)}
              className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                speed === s
                  ? 'bg-[#343537] text-white shadow-sm'
                  : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Mode Toggle: Instructional vs Live Operating State */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-[#121315] p-0.5 rounded-lg border border-[#292a2c]">
          <button
            onClick={() => mode !== 'live' && onToggleMode()}
            className={`px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1.5 transition-all ${
              mode === 'live'
                ? 'bg-[#d71920]/20 text-[#ffb4ab] border border-[#d71920]/50'
                : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            <Radio className="w-3 h-3 text-[#22c55e] animate-pulse" />
            <span>LIVE TELEMETRY</span>
          </button>
          <button
            onClick={() => mode !== 'instructional' && onToggleMode()}
            className={`px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1.5 transition-all ${
              mode === 'instructional'
                ? 'bg-[#343537] text-white'
                : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>INSTRUCTIONAL DEMO</span>
          </button>
        </div>

        {/* State Override Dropdown for Live Testing */}
        <div className="flex items-center gap-1.5 bg-[#121315] px-2 py-1 rounded-lg border border-[#292a2c]">
          <span className="text-[10px] text-[#a1a1aa]">STATE:</span>
          <select
            value={currentState}
            onChange={(e) => onChangeState(e.target.value as MachineOperatingState)}
            className="bg-transparent text-[11px] font-bold text-[#e3e2e5] outline-none cursor-pointer"
          >
            <option value="running" className="bg-[#1b1c1e]">RUNNING</option>
            <option value="idle" className="bg-[#1b1c1e]">IDLE</option>
            <option value="warning" className="bg-[#1b1c1e]">WARNING</option>
            <option value="critical" className="bg-[#1b1c1e]">CRITICAL</option>
            <option value="stopped" className="bg-[#1b1c1e]">STOPPED</option>
            <option value="offline" className="bg-[#1b1c1e]">OFFLINE</option>
          </select>
        </div>
      </div>

      {/* Layer Toggles: Labels & Sensor Markers */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleLabels}
          className={`px-2.5 py-1 rounded-lg border text-[11px] flex items-center gap-1.5 transition-all ${
            showLabels
              ? 'bg-[#292a2c] text-white border-[#5d3f3c]'
              : 'bg-transparent text-[#a1a1aa] border-transparent hover:text-white'
          }`}
          title="Toggle Component Labels"
        >
          <Tag className="w-3 h-3" />
          <span>PARTS</span>
        </button>

        <button
          onClick={onToggleSensors}
          className={`px-2.5 py-1 rounded-lg border text-[11px] flex items-center gap-1.5 transition-all ${
            showSensors
              ? 'bg-[#292a2c] text-[#06b6d4] border-[#06b6d4]/40'
              : 'bg-transparent text-[#a1a1aa] border-transparent hover:text-white'
          }`}
          title="Toggle Sensor Hotspots"
        >
          <Gauge className="w-3 h-3" />
          <span>SENSORS</span>
        </button>
      </div>
    </div>
  );
};

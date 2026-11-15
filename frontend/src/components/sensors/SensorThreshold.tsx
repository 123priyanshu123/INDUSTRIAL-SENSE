import React from 'react';
import { SensorThresholds } from '../../types/sensor';

interface SensorThresholdProps {
  currentValue: number;
  thresholds: SensorThresholds;
  unit: string;
}

export const SensorThreshold: React.FC<SensorThresholdProps> = ({
  currentValue,
  thresholds,
  unit,
}) => {
  const maxScale = (thresholds.criticalHigh || 100) * 1.2;
  const currentPercent = Math.min(100, Math.max(0, (currentValue / maxScale) * 100));
  const warnPercent = Math.min(100, ((thresholds.warningHigh || 70) / maxScale) * 100);
  const critPercent = Math.min(100, ((thresholds.criticalHigh || 85) / maxScale) * 100);

  return (
    <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-xl p-4 font-mono">
      <div className="flex items-center justify-between text-xs text-[#a1a1aa] mb-2">
        <span className="font-bold uppercase tracking-wider text-[#e3e2e5]">OPERATING THRESHOLD CALIBRATION</span>
        <span>SCALE: 0 - {maxScale.toFixed(0)} {unit}</span>
      </div>

      {/* Threshold Meter Bar */}
      <div className="relative w-full h-4 bg-[#121315] rounded-full overflow-hidden border border-[#292a2c]">
        {/* Normal Zone */}
        <div
          className="absolute top-0 bottom-0 left-0 bg-emerald-500/20"
          style={{ width: `${warnPercent}%` }}
        />
        {/* Warning Zone */}
        <div
          className="absolute top-0 bottom-0 bg-amber-500/30"
          style={{ left: `${warnPercent}%`, width: `${critPercent - warnPercent}%` }}
        />
        {/* Critical Zone */}
        <div
          className="absolute top-0 bottom-0 right-0 bg-rose-500/40"
          style={{ left: `${critPercent}%` }}
        />

        {/* Current Value Needle / Indicator */}
        <div
          className="absolute top-0 bottom-0 w-1.5 bg-white shadow-[0_0_8px_white] transition-all duration-300"
          style={{ left: `${currentPercent}%` }}
        />
      </div>

      {/* Threshold Markers Legend */}
      <div className="flex items-center justify-between text-[10px] mt-2 text-[#a1a1aa]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>NORMAL: &lt; {thresholds.warningHigh} {unit}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>WARN: &ge; {thresholds.warningHigh} {unit}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>CRIT: &ge; {thresholds.criticalHigh} {unit}</span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { SensorReading as SensorReadingType, SensorThresholds } from '../../types/sensor';
import { SensorReading } from './SensorReading';
import { SensorThreshold } from './SensorThreshold';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Activity, Radio, AlertOctagon } from 'lucide-react';

interface SoundSensorPanelProps {
  reading: SensorReadingType | null;
  historyData: any[];
  thresholds: SensorThresholds;
}

export const SoundSensorPanel: React.FC<SoundSensorPanelProps> = ({
  reading,
  historyData,
  thresholds,
}) => {
  const currentValue = reading?.value ?? 68.4;
  const fftData = [
    { freq: '125Hz', power: 34 },
    { freq: '250Hz', power: 42 },
    { freq: '500Hz', power: 58 },
    { freq: '1kHz', power: 65 },
    { freq: '2kHz', power: 78 },
    { freq: '4kHz', power: 84 },
    { freq: '8kHz', power: 72 },
    { freq: '16kHz', power: 48 },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Top Value & Threshold Meters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SensorReading
          type="sound"
          value={currentValue}
          unit={reading?.unit || 'dB'}
          timestamp={reading?.timestamp || new Date().toISOString()}
          state={reading?.state || 'online'}
          label="ACOUSTIC EMISSION • CAVITATION MIC"
          subtext="PEAK: 4.2 kHz HARMONIC"
        />

        <SensorThreshold
          currentValue={currentValue}
          thresholds={thresholds}
          unit={reading?.unit || 'dB'}
        />
      </div>

      {/* Acoustic Frequency Spectrum (FFT Analysis) */}
      <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-xl p-4 font-mono">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#06b6d4] animate-pulse" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              REAL-TIME FFT 1/3 OCTAVE ACOUSTIC SPECTRUM
            </h4>
          </div>
          <span className="text-[10px] text-[#a1a1aa]">SAMPLING: 48.0 kS/s</span>
        </div>

        {/* FFT Bar Equalizer Visualization */}
        <div className="grid grid-cols-8 gap-2 h-32 items-end pt-4 border-b border-[#292a2c] pb-2">
          {fftData.map((band, idx) => {
            const isHigh = band.power > 75;
            return (
              <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[9px] text-[#a1a1aa]">{band.power}</span>
                <div className="w-full bg-[#121315] rounded-t overflow-hidden h-24 flex items-end">
                  <div
                    style={{ height: `${band.power}%` }}
                    className={`w-full transition-all duration-300 rounded-t ${
                      isHigh
                        ? 'bg-rose-500 shadow-[0_0_8px_#ef4444]'
                        : band.power > 60
                        ? 'bg-amber-500'
                        : 'bg-cyan-500'
                    }`}
                  />
                </div>
                <span className="text-[9px] text-[#a1a1aa] font-bold">{band.freq}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-[#a1a1aa]">
          <span>Dominant Peak: 4 kHz (Bearing Cage / Air Gap Whine)</span>
          <span className="text-amber-400 flex items-center gap-1">
            <AlertOctagon className="w-3 h-3" />
            Possible micro-cavitation in suction
          </span>
        </div>
      </div>

      {/* Historical Sound Trend Chart */}
      <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-xl p-4 font-mono">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#d71920]" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              SOUND LEVEL TREND HISTORY (dB)
            </h4>
          </div>
          <span className="text-[10px] text-[#a1a1aa]">WINDOW: 30 MIN</span>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData}>
              <defs>
                <linearGradient id="soundGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d71920" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#d71920" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#5d3f3c" tick={{ fill: '#a1a1aa', fontSize: 10 }} />
              <YAxis stroke="#5d3f3c" tick={{ fill: '#a1a1aa', fontSize: 10 }} domain={['dataMin - 5', 'dataMax + 5']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#121315', borderColor: '#38393b', borderRadius: '8px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="sound" stroke="#d71920" strokeWidth={2} fillOpacity={1} fill="url(#soundGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

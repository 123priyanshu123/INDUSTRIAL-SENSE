import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { SoundSensorPanel } from '../components/sensors/SoundSensorPanel';
import { TemperatureSensorPanel } from '../components/sensors/TemperatureSensorPanel';
import { PressureSensorPanel } from '../components/sensors/PressureSensorPanel';
import { MACHINE_REGISTRY } from '../data/machineRegistry';
import { DEFAULT_SENSOR_THRESHOLDS } from '../data/sensorProfiles';
import { GENERATE_SERIES_DATA } from '../data/mockData';
import { useSensorReadings } from '../hooks/useSensorReadings';
import { useLiveUpdates } from '../hooks/useLiveUpdates';
import { Volume2, Thermometer, Gauge, Activity, Radio, Cpu, RefreshCw } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export const LiveMonitoringPage: React.FC = () => {
  const { isLiveStreaming, toggleLiveStreaming } = useAppStore();
  const [selectedMachineId, setSelectedMachineId] = useState(MACHINE_REGISTRY[0].id);
  const [activeModality, setActiveModality] = useState<'sound' | 'temperature' | 'pressure'>('sound');

  const currentMachine =
    MACHINE_REGISTRY.find(m => m.id === selectedMachineId) || MACHINE_REGISTRY[0];

  const { data: readings, refetch } = useSensorReadings(currentMachine.id);
  const { isConnected } = useLiveUpdates();
  const seriesData = GENERATE_SERIES_DATA(30);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="LIVE TELEMETRY & PHYSICAL SENSOR BUS"
        description="High-frequency telemetry stream capturing acoustic emissions, RTD temperatures, and piezoresistive line pressures."
        badge={isConnected ? 'BUS: CONNECTED' : 'BUS: OFFLINE'}
        actions={
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={toggleLiveStreaming}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                isLiveStreaming
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'bg-[#1b1c1e] text-[#a1a1aa] border border-[#292a2c]'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${isLiveStreaming ? 'animate-pulse text-emerald-400' : ''}`} />
              <span>{isLiveStreaming ? 'STREAMING LIVE (2s)' : 'PAUSED'}</span>
            </button>

            <button
              onClick={() => refetch()}
              className="p-1.5 rounded-xl bg-[#1b1c1e] text-[#a1a1aa] hover:text-white border border-[#292a2c]"
              title="Manual Poll"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* Machine & Modality Selector Bar */}
      <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
        {/* Machine Picker */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Cpu className="w-4 h-4 text-[#ffb4ab]" />
          <span className="text-[#a1a1aa] text-[10px]">MONITORED UNIT:</span>
          <select
            value={selectedMachineId}
            onChange={(e) => setSelectedMachineId(e.target.value)}
            className="bg-[#121315] border border-[#292a2c] text-white font-bold rounded-xl px-3 py-1.5 outline-none cursor-pointer"
          >
            {MACHINE_REGISTRY.map((m) => (
              <option key={m.id} value={m.id} className="bg-[#1b1c1e]">
                {m.code} • {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* 3 Modality Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => setActiveModality('sound')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 border transition-all ${
              activeModality === 'sound'
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500 shadow-md'
                : 'bg-[#121315] text-[#a1a1aa] border-[#292a2c]'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>SOUND (dB)</span>
          </button>

          <button
            onClick={() => setActiveModality('temperature')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 border transition-all ${
              activeModality === 'temperature'
                ? 'bg-rose-500/20 text-rose-400 border-rose-500 shadow-md'
                : 'bg-[#121315] text-[#a1a1aa] border-[#292a2c]'
            }`}
          >
            <Thermometer className="w-4 h-4" />
            <span>TEMPERATURE (°C)</span>
          </button>

          <button
            onClick={() => setActiveModality('pressure')}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 border transition-all ${
              activeModality === 'pressure'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500 shadow-md'
                : 'bg-[#121315] text-[#a1a1aa] border-[#292a2c]'
            }`}
          >
            <Gauge className="w-4 h-4" />
            <span>PRESSURE (bar)</span>
          </button>
        </div>
      </div>

      {/* Main Monitoring Panels */}
      {activeModality === 'sound' && (
        <SoundSensorPanel
          reading={readings?.sound ?? null}
          historyData={seriesData}
          thresholds={DEFAULT_SENSOR_THRESHOLDS.sound}
        />
      )}

      {activeModality === 'temperature' && (
        <TemperatureSensorPanel
          reading={readings?.temperature ?? null}
          historyData={seriesData}
          thresholds={DEFAULT_SENSOR_THRESHOLDS.temperature}
        />
      )}

      {activeModality === 'pressure' && (
        <PressureSensorPanel
          reading={readings?.pressure ?? null}
          historyData={seriesData}
          thresholds={DEFAULT_SENSOR_THRESHOLDS.pressure}
        />
      )}
    </div>
  );
};

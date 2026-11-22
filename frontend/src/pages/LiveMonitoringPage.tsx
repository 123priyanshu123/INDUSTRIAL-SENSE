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
import { Radio, Cpu, RefreshCw, Upload } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { CsvManualTelemetryUpload } from '../components/telemetry/CsvManualTelemetryUpload';

export const LiveMonitoringPage: React.FC = () => {
  const { isLiveStreaming, toggleLiveStreaming, addNotification } = useAppStore();
  const [selectedMachineId, setSelectedMachineId] = useState(MACHINE_REGISTRY[0].id);
  const [showCsvUpload, setShowCsvUpload] = useState(false);

  const currentMachine =
    MACHINE_REGISTRY.find(m => m.id === selectedMachineId) || MACHINE_REGISTRY[0];

  const { data: readings, refetch } = useSensorReadings(currentMachine.id);
  const { isConnected } = useLiveUpdates();
  const seriesData = GENERATE_SERIES_DATA(30);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="LIVE TELEMETRY MONITORING"
        description="Unified real-time acoustic sound, operating temperature, and line pressure monitoring."
        badge={isConnected ? 'CONNECTED' : 'OFFLINE'}
        actions={
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setShowCsvUpload(!showCsvUpload)}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                showCsvUpload
                  ? 'bg-cyan-500 text-black shadow-sm'
                  : 'bg-[#1b1c1e] text-cyan-300 border border-cyan-500/40 hover:bg-cyan-950/40'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{showCsvUpload ? 'HIDE CSV UPLOAD' : 'UPLOAD CSV DATA'}</span>
            </button>

            <button
              onClick={toggleLiveStreaming}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                isLiveStreaming
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'bg-[#1b1c1e] text-[#a1a1aa] border border-[#292a2c]'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${isLiveStreaming ? 'animate-pulse text-emerald-400' : ''}`} />
              <span>{isLiveStreaming ? 'STREAMING LIVE' : 'PAUSED'}</span>
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

      {/* Manual CSV File Upload & Red Alert Analyzer */}
      {showCsvUpload && (
        <CsvManualTelemetryUpload
          onTriggerStop={(sys) =>
            addNotification('error', `EMERGENCY STOP EXECUTED FOR ${sys}. Motor decelerating to 0 RPM.`)
          }
        />
      )}

      {/* Machine Selector Bar */}
      <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span className="text-[#a1a1aa] text-[10px] uppercase font-bold">SELECT MACHINE:</span>
          <select
            value={selectedMachineId}
            onChange={(e) => setSelectedMachineId(e.target.value)}
            className="bg-[#121315] border border-[#292a2c] text-white font-bold rounded-xl px-3 py-1.5 outline-none cursor-pointer"
          >
            {MACHINE_REGISTRY.map((m) => {
              const cleanName = m.name.replace(/\s*\([A-Z0-9-]+\)\s*/gi, '').trim();
              return (
                <option key={m.id} value={m.id} className="bg-[#1b1c1e]">
                  {cleanName}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Sound</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>Temperature</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Pressure</span>
          </span>
        </div>
      </div>

      {/* All 3 Modalities Rendered Visible on One Page */}
      <div className="flex flex-col gap-6">
        {/* 1. Sound Sensor Panel */}
        <div>
          <div className="flex items-center gap-2 mb-3 font-mono text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <h2 className="text-white font-bold uppercase tracking-wider">SOUND TELEMETRY</h2>
          </div>
          <SoundSensorPanel
            reading={readings?.sound ?? null}
            historyData={seriesData}
            thresholds={DEFAULT_SENSOR_THRESHOLDS.sound}
          />
        </div>

        {/* 2. Temperature Sensor Panel */}
        <div>
          <div className="flex items-center gap-2 mb-3 font-mono text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <h2 className="text-white font-bold uppercase tracking-wider">TEMPERATURE TELEMETRY</h2>
          </div>
          <TemperatureSensorPanel
            reading={readings?.temperature ?? null}
            historyData={seriesData}
            thresholds={DEFAULT_SENSOR_THRESHOLDS.temperature}
          />
        </div>

        {/* 3. Pressure Sensor Panel */}
        <div>
          <div className="flex items-center gap-2 mb-3 font-mono text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <h2 className="text-white font-bold uppercase tracking-wider">PRESSURE TELEMETRY</h2>
          </div>
          <PressureSensorPanel
            reading={readings?.pressure ?? null}
            historyData={seriesData}
            thresholds={DEFAULT_SENSOR_THRESHOLDS.pressure}
          />
        </div>
      </div>
    </div>
  );
};

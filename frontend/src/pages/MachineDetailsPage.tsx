import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { MachineAnimation } from '../components/machine-animations/MachineAnimation';
import { SoundSensorPanel } from '../components/sensors/SoundSensorPanel';
import { TemperatureSensorPanel } from '../components/sensors/TemperatureSensorPanel';
import { PressureSensorPanel } from '../components/sensors/PressureSensorPanel';
import { MACHINE_REGISTRY } from '../data/machineRegistry';
import { DEFAULT_SENSOR_THRESHOLDS } from '../data/sensorProfiles';
import { GENERATE_SERIES_DATA } from '../data/mockData';
import { useSensorReadings } from '../hooks/useSensorReadings';
import { MechanicalComponent } from '../types/machine';
import { SensorType } from '../types/sensor';
import { Volume2, Thermometer, Gauge, Activity, ArrowRight, BrainCircuit, ShieldAlert, Cpu } from 'lucide-react';

export const MachineDetailsPage: React.FC = () => {
  const { machineId } = useParams<{ machineId: string }>();
  const machine =
    MACHINE_REGISTRY.find(m => m.id === machineId) || MACHINE_REGISTRY[0];

  const { data: readings } = useSensorReadings(machine.id);
  const [activeTab, setActiveTab] = useState<SensorType>('sound');
  const [selectedComponent, setSelectedComponent] = useState<MechanicalComponent | null>(null);

  const seriesData = GENERATE_SERIES_DATA(25);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={machine.name}
        badge={`HEALTH SCORE: ${machine.healthScore}%`}
        breadcrumbs={[
          { label: 'Catalogue', href: '/machines' },
          { label: machine.name },
        ]}
        actions={
          <div className="flex items-center gap-2 font-mono text-xs">
            <Link
              to="/monitoring"
              className="px-3.5 py-1.5 rounded-xl bg-[#292a2c] hover:bg-[#343537] text-white font-bold flex items-center gap-1.5 transition-all"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>LIVE TELEMETRY</span>
            </Link>
            <Link
              to={`/analytics/${machine.id}`}
              className="px-3.5 py-1.5 rounded-xl bg-[#d71920] hover:bg-[#c00014] text-white font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>MACHINE ANALYTICS</span>
            </Link>
          </div>
        }
      />

      {/* Main Grid: Left Animation Twin, Right Component Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Mechanical Animation Stage */}
        <div className="lg:col-span-2 bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-5 flex flex-col justify-between">
          <MachineAnimation
            machine={machine}
            onSelectComponent={setSelectedComponent}
          />
        </div>

        {/* Right 1 Col: Mechanical Components Breakdown */}
        <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-5 flex flex-col justify-between font-mono">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#ffb4ab]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  COMPONENT INVENTORY ({machine.components.length})
                </h3>
              </div>
              <span className="text-[10px] text-[#a1a1aa]">CLICK TO INSPECT</span>
            </div>

            <div className="flex flex-col gap-2">
              {machine.components.map((c) => {
                const isSelected = selectedComponent?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedComponent(c)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#292a2c] border-[#d71920] shadow-md'
                        : 'bg-[#121315] border-[#292a2c] hover:border-[#38393b]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white text-xs">{c.name}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          c.status === 'faulty'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : c.status === 'stressed'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#a1a1aa] font-sans line-clamp-2">{c.role}</p>
                    {c.sensorAttached && (
                      <span className="text-[9px] text-[#06b6d4] mt-1.5 block">
                        Sensor: {c.sensorAttached}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Machine Specs Snippet */}
          <div className="mt-4 pt-3 border-t border-[#292a2c] grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[9px] text-[#a1a1aa] uppercase block">RATED SPEED</span>
              <span className="text-white font-bold">{machine.rpm ? `${machine.rpm} RPM` : 'Variable'}</span>
            </div>
            <div>
              <span className="text-[9px] text-[#a1a1aa] uppercase block">RUNTIME</span>
              <span className="text-white font-bold">{machine.runtimeHours.toLocaleString()} hrs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sensor Monitoring Tabs */}
      <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-[#292a2c] pb-4 font-mono">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              TELEMETRY SENSOR PANELS FOR {machine.name}
            </h3>
          </div>

          {/* Modality Tabs */}
          <div className="flex items-center gap-1.5 bg-[#121315] p-1 rounded-xl border border-[#292a2c]">
            {machine.supportedSensors.includes('sound') && (
              <button
                onClick={() => setActiveTab('sound')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'sound'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                    : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>SOUND</span>
              </button>
            )}

            {machine.supportedSensors.includes('temperature') && (
              <button
                onClick={() => setActiveTab('temperature')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'temperature'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm'
                    : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                <Thermometer className="w-3.5 h-3.5" />
                <span>TEMPERATURE</span>
              </button>
            )}

            {machine.supportedSensors.includes('pressure') && (
              <button
                onClick={() => setActiveTab('pressure')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'pressure'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm'
                    : 'text-[#a1a1aa] hover:text-white'
                }`}
              >
                <Gauge className="w-3.5 h-3.5" />
                <span>PRESSURE</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab View */}
        {activeTab === 'sound' && (
          <SoundSensorPanel
            reading={readings?.sound ?? null}
            historyData={seriesData}
            thresholds={DEFAULT_SENSOR_THRESHOLDS.sound}
          />
        )}
        {activeTab === 'temperature' && (
          <TemperatureSensorPanel
            reading={readings?.temperature ?? null}
            historyData={seriesData}
            thresholds={DEFAULT_SENSOR_THRESHOLDS.temperature}
          />
        )}
        {activeTab === 'pressure' && (
          <PressureSensorPanel
            reading={readings?.pressure ?? null}
            historyData={seriesData}
            thresholds={DEFAULT_SENSOR_THRESHOLDS.pressure}
          />
        )}
      </div>
    </div>
  );
};

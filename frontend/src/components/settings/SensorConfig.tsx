import React, { useState } from 'react';
import { Gauge, Volume2, Thermometer, Save, CheckCircle } from 'lucide-react';
import { MACHINE_REGISTRY } from '../../data/machineRegistry';
import { SensorType } from '../../types/sensor';
import { useAppStore } from '../../store/appStore';

export const SensorConfig: React.FC = () => {
  const { addNotification } = useAppStore();
  const [sensorId, setSensorId] = useState('SNS-PMP-01-SND');
  const [machineId, setMachineId] = useState('mch-pmp-01');
  const [sensorType, setSensorType] = useState<SensorType>('sound');
  const [location, setLocation] = useState('Radial Impeller Eye Flange');
  const [unit, setUnit] = useState('dB');
  const [rangeMin, setRangeMin] = useState(20);
  const [rangeMax, setRangeMax] = useState(110);
  const [warningThreshold, setWarningThreshold] = useState(75.0);
  const [criticalThreshold, setCriticalThreshold] = useState(85.0);
  const [interval, setInterval] = useState(1.0); // seconds

  const handleTypeChange = (type: SensorType) => {
    setSensorType(type);
    if (type === 'sound') {
      setUnit('dB');
      setRangeMin(20);
      setRangeMax(120);
      setWarningThreshold(75.0);
      setCriticalThreshold(85.0);
    } else if (type === 'temperature') {
      setUnit('°C');
      setRangeMin(0);
      setRangeMax(150);
      setWarningThreshold(65.0);
      setCriticalThreshold(80.0);
    } else {
      setUnit('bar');
      setRangeMin(0);
      setRangeMax(25);
      setWarningThreshold(8.0);
      setCriticalThreshold(10.5);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addNotification('success', `Sensor ${sensorId} calibrated & parameters deployed`);
  };

  return (
    <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-6 font-mono">
      <div className="flex items-center gap-2 mb-4">
        <Gauge className="w-5 h-5 text-cyan-400" />
        <h3 className="text-base font-bold text-white uppercase tracking-wider">
          SENSOR CALIBRATION & THRESHOLD BUS
        </h3>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        {/* Sensor Type Segmented Control (Strictly 3 types only) */}
        <div>
          <label className="block text-[10px] text-[#a1a1aa] uppercase font-bold mb-1.5">
            SENSOR INSTRUMENTATION TYPE (RESTRICTED TO 3 SUPPORTED MODALITIES):
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleTypeChange('sound')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                sensorType === 'sound'
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500 shadow-md'
                  : 'bg-[#121315] text-[#a1a1aa] border-[#292a2c]'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>SOUND (dB)</span>
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('temperature')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                sensorType === 'temperature'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500 shadow-md'
                  : 'bg-[#121315] text-[#a1a1aa] border-[#292a2c]'
              }`}
            >
              <Thermometer className="w-4 h-4" />
              <span>TEMPERATURE (°C)</span>
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange('pressure')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                sensorType === 'pressure'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500 shadow-md'
                  : 'bg-[#121315] text-[#a1a1aa] border-[#292a2c]'
              }`}
            >
              <Gauge className="w-4 h-4" />
              <span>PRESSURE (bar)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] text-[#a1a1aa] uppercase font-bold mb-1">
              UNIQUE SENSOR IDENTIFIER:
            </label>
            <input
              type="text"
              value={sensorId}
              onChange={(e) => setSensorId(e.target.value)}
              className="w-full bg-[#121315] border border-[#292a2c] focus:border-[#d71920] rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] text-[#a1a1aa] uppercase font-bold mb-1">
              HOST MACHINE ASSOCIATION:
            </label>
            <select
              value={machineId}
              onChange={(e) => setMachineId(e.target.value)}
              className="w-full bg-[#121315] border border-[#292a2c] focus:border-[#d71920] rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              {MACHINE_REGISTRY.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#1b1c1e]">
                  {m.code} • {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-[#a1a1aa] uppercase font-bold mb-1">
              INSTALLATION COMPONENT LOCATION:
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[#121315] border border-[#292a2c] focus:border-[#d71920] rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] text-[#a1a1aa] uppercase font-bold mb-1">
              MEASUREMENT UNIT:
            </label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full bg-[#121315] border border-[#292a2c] focus:border-[#d71920] rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] text-[#a1a1aa] uppercase font-bold mb-1">
              WARNING THRESHOLD ({unit}):
            </label>
            <input
              type="number"
              step="0.1"
              value={warningThreshold}
              onChange={(e) => setWarningThreshold(Number(e.target.value))}
              className="w-full bg-[#121315] border border-amber-500/50 rounded-xl px-3 py-2 text-xs text-amber-400 font-bold outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] text-[#a1a1aa] uppercase font-bold mb-1">
              CRITICAL EMERGENCY TRIP THRESHOLD ({unit}):
            </label>
            <input
              type="number"
              step="0.1"
              value={criticalThreshold}
              onChange={(e) => setCriticalThreshold(Number(e.target.value))}
              className="w-full bg-[#121315] border border-rose-500/50 rounded-xl px-3 py-2 text-xs text-rose-400 font-bold outline-none"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-[#292a2c] flex items-center justify-between">
          <span className="text-[11px] text-[#a1a1aa]">
            Heartbeat ping interval: 1000ms. Changes sync automatically across field SCADA gateways.
          </span>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#292a2c] hover:bg-[#d71920] text-white font-bold text-xs flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>DEPLOY THRESHOLDS</span>
          </button>
        </div>
      </form>
    </div>
  );
};

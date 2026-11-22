import React, { useState } from 'react';
import { Cpu, Plus, Check } from 'lucide-react';
import { MACHINE_CATEGORIES } from '../../data/machineCategories';
import { machineService } from '../../services/machineService';
import { useAppStore } from '../../store/appStore';

export const MachineConfig: React.FC = () => {
  const { addNotification } = useAppStore();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState(MACHINE_CATEGORIES[0].name);
  const [industry, setIndustry] = useState('Heavy Manufacturing & Metallurgy');
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [hasSound, setHasSound] = useState(true);
  const [hasTemp, setHasTemp] = useState(true);
  const [hasPressure, setHasPressure] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    const supportedSensors: Array<'sound' | 'temperature' | 'pressure'> = [];
    if (hasSound) supportedSensors.push('sound');
    if (hasTemp) supportedSensors.push('temperature');
    if (hasPressure) supportedSensors.push('pressure');

    await machineService.registerMachine({
      name,
      code,
      category,
      industry,
      manufacturer,
      model,
      supportedSensors,
    });

    addNotification('success', `Machine ${code} successfully commissioned into SCADA network`);
    setName('');
    setCode('');
    setManufacturer('');
    setModel('');
  };

  return (
    <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-6 font-mono">
      <div className="flex items-center gap-2 mb-4">
        <Cpu className="w-5 h-5 text-[#ffb4ab]" />
        <h3 className="text-base font-bold text-white uppercase tracking-wider">
          REGISTER & COMMISSION INDUSTRIAL ASSET
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] text-[#a1a1aa] uppercase font-bold mb-1">
              ASSET IDENTIFIER / TAG:
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. PUMP-UNIT-01"
              className="w-full bg-[#121315] border border-[#292a2c] focus:border-[#d71920] rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] text-[#a1a1aa] uppercase font-bold mb-1">
              EQUIPMENT NAME:
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Multi-Stage Centrifugal Booster Pump"
              className="w-full bg-[#121315] border border-[#292a2c] focus:border-[#d71920] rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] text-[#a1a1aa] uppercase font-bold mb-1">
              INDUSTRIAL CATEGORY (15 UNIVERSAL FAMILIES):
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#121315] border border-[#292a2c] focus:border-[#d71920] rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              {MACHINE_CATEGORIES.map((c) => (
                <option key={c.id} value={c.name} className="bg-[#1b1c1e]">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-[#a1a1aa] uppercase font-bold mb-1">
              MANUFACTURER & MODEL:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                placeholder="Siemens / Flowserve"
                className="w-1/2 bg-[#121315] border border-[#292a2c] rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Series 4000"
                className="w-1/2 bg-[#121315] border border-[#292a2c] rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Installed Sensors Selection */}
        <div>
          <label className="block text-[10px] text-[#a1a1aa] uppercase font-bold mb-1.5">
            SUPPORTED SENSORS (ONLY 3 APPROVED TYPES):
          </label>
          <div className="flex items-center gap-4 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-cyan-400">
              <input
                type="checkbox"
                checked={hasSound}
                onChange={(e) => setHasSound(e.target.checked)}
                className="rounded accent-[#d71920]"
              />
              <span>Acoustic / Sound (dB)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-rose-400">
              <input
                type="checkbox"
                checked={hasTemp}
                onChange={(e) => setHasTemp(e.target.checked)}
                className="rounded accent-[#d71920]"
              />
              <span>Thermal / RTD (°C)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-amber-400">
              <input
                type="checkbox"
                checked={hasPressure}
                onChange={(e) => setHasPressure(e.target.checked)}
                className="rounded accent-[#d71920]"
              />
              <span>Pressure Transducer (bar)</span>
            </label>
          </div>
        </div>

        <div className="pt-3 border-t border-[#292a2c] flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#d71920] hover:bg-[#c00014] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(215,25,32,0.4)]"
          >
            <Plus className="w-4 h-4" />
            <span>COMMISSION ASSET</span>
          </button>
        </div>
      </form>
    </div>
  );
};

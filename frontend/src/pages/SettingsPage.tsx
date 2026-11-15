import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { UserProfileSettings } from '../components/settings/UserProfileSettings';
import { MachineConfig } from '../components/settings/MachineConfig';
import { SensorConfig } from '../components/settings/SensorConfig';
import { PermissionsMatrix } from '../components/settings/PermissionsMatrix';
import { User, Cpu, Gauge, Shield } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'machine' | 'sensor' | 'rbac'>('machine');

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="SCADA CONFIGURATION & SYSTEM SETTINGS"
        description="Configure plant operators, commission industrial assets, calibrate sensor thresholds, and review access control permissions."
        badge="SYS-ADMIN GATEWAY"
      />

      {/* Settings Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-[#1b1c1e] p-1.5 rounded-2xl border border-[#292a2c] font-mono text-xs">
        <button
          onClick={() => setActiveTab('machine')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
            activeTab === 'machine'
              ? 'bg-[#d71920] text-white shadow-[0_0_15px_rgba(215,25,32,0.4)]'
              : 'text-[#a1a1aa] hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>MACHINE COMMISSIONING</span>
        </button>

        <button
          onClick={() => setActiveTab('sensor')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
            activeTab === 'sensor'
              ? 'bg-[#d71920] text-white shadow-[0_0_15px_rgba(215,25,32,0.4)]'
              : 'text-[#a1a1aa] hover:text-white'
          }`}
        >
          <Gauge className="w-4 h-4" />
          <span>SENSOR CALIBRATION</span>
        </button>

        <button
          onClick={() => setActiveTab('rbac')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
            activeTab === 'rbac'
              ? 'bg-[#d71920] text-white shadow-[0_0_15px_rgba(215,25,32,0.4)]'
              : 'text-[#a1a1aa] hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>PERMISSIONS MATRIX</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
            activeTab === 'profile'
              ? 'bg-[#d71920] text-white shadow-[0_0_15px_rgba(215,25,32,0.4)]'
              : 'text-[#a1a1aa] hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>OPERATOR PROFILE</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'machine' && <MachineConfig />}
      {activeTab === 'sensor' && <SensorConfig />}
      {activeTab === 'rbac' && <PermissionsMatrix />}
      {activeTab === 'profile' && <UserProfileSettings />}
    </div>
  );
};

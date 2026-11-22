import React, { useState, useMemo } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { SearchBar } from '../components/common/SearchBar';
import { MachineCard } from '../components/machines/MachineCard';
import { MachineTable } from '../components/machines/MachineTable';
import { MACHINE_REGISTRY } from '../data/machineRegistry';
import { MACHINE_CATEGORIES } from '../data/machineCategories';
import { LayoutGrid, List, Filter, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MachineCataloguePage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredMachines = useMemo(() => {
    return MACHINE_REGISTRY.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.code.toLowerCase().includes(search.toLowerCase()) ||
        m.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === 'ALL' || m.category === selectedCategory;

      const matchesStatus =
        selectedStatus === 'ALL' || m.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, selectedCategory, selectedStatus]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="UNIVERSAL INDUSTRIAL MACHINE CATALOGUE"
        description="Comprehensive repository covering 15 equipment families, physics-based 2D motion engines, and tri-modal sensor instrumentation."
        badge={`${filteredMachines.length} ASSETS ONLINE`}
        actions={
          <Link
            to="/settings"
            className="px-4 py-2 rounded-xl bg-[#d71920] hover:bg-[#c00014] text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(215,25,32,0.4)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>COMMISSION ASSET</span>
          </Link>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-xs">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Filter by machine name or category..."
          className="w-full md:w-96"
        />

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#121315] px-3 py-2 rounded-xl border border-[#292a2c]">
            <span className="text-[#a1a1aa] text-[10px]">CATEGORY:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs"
            >
              <option value="ALL" className="bg-[#1b1c1e]">All 15 Categories</option>
              {MACHINE_CATEGORIES.map((c) => (
                <option key={c.id} value={c.name} className="bg-[#1b1c1e]">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-[#121315] px-3 py-2 rounded-xl border border-[#292a2c]">
            <span className="text-[#a1a1aa] text-[10px]">STATUS:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs"
            >
              <option value="ALL" className="bg-[#1b1c1e]">All Operating States</option>
              <option value="running" className="bg-[#1b1c1e]">Running (Nominal)</option>
              <option value="idle" className="bg-[#1b1c1e]">Standby (Idle)</option>
              <option value="warning" className="bg-[#1b1c1e]">Warning (Degraded)</option>
              <option value="critical" className="bg-[#1b1c1e]">Critical (Trip)</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#121315] p-1 rounded-xl border border-[#292a2c]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-[#343537] text-white shadow-sm' : 'text-[#a1a1aa] hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-[#343537] text-white shadow-sm' : 'text-[#a1a1aa] hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Machine Results View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMachines.map((machine) => (
            <MachineCard key={machine.id} machine={machine} />
          ))}
        </div>
      ) : (
        <MachineTable machines={filteredMachines} />
      )}

      {filteredMachines.length === 0 && (
        <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-12 text-center font-mono">
          <p className="text-sm text-[#a1a1aa]">No machines matched your active query filter criteria.</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('ALL');
              setSelectedStatus('ALL');
            }}
            className="mt-3 px-4 py-2 bg-[#292a2c] text-white text-xs font-bold rounded-xl"
          >
            RESET FILTERS
          </button>
        </div>
      )}
    </div>
  );
};

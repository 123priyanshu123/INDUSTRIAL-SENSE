import React from 'react';
import { Link } from 'react-router-dom';
import { Machine } from '../../types/machine';
import { getStatusColor } from '../../utils/machineStatus';
import { Volume2, Thermometer, Gauge, ChevronRight, Activity } from 'lucide-react';

interface MachineTableProps {
  machines: Machine[];
}

export const MachineTable: React.FC<MachineTableProps> = ({ machines }) => {
  return (
    <div className="w-full bg-[#1b1c1e] border border-[#292a2c] rounded-2xl overflow-hidden font-mono text-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#121315] border-b border-[#292a2c] text-[#a1a1aa] uppercase text-[10px]">
              <th className="py-3 px-4">Asset ID • Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Operating State</th>
              <th className="py-3 px-4">Health Index</th>
              <th className="py-3 px-4">Sensors</th>
              <th className="py-3 px-4">Runtime</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#292a2c]">
            {machines.map((m) => {
              const status = getStatusColor(m.status);
              return (
                <tr key={m.id} className="hover:bg-[#292a2c]/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                      <span>{m.code}</span>
                    </div>
                    <div className="text-[11px] text-[#a1a1aa] font-sans truncate max-w-xs">{m.name}</div>
                  </td>

                  <td className="py-3.5 px-4 text-[#a1a1aa]">{m.category}</td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${status.bg} ${status.text} ${status.border}`}>
                      {m.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${m.healthScore < 70 ? 'text-rose-400' : m.healthScore < 85 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {m.healthScore}%
                      </span>
                      <div className="w-16 bg-[#121315] h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${m.healthScore < 70 ? 'bg-rose-500' : m.healthScore < 85 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${m.healthScore}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1">
                      {m.supportedSensors.includes('sound') && <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
                      {m.supportedSensors.includes('temperature') && <Thermometer className="w-3.5 h-3.5 text-rose-400" />}
                      {m.supportedSensors.includes('pressure') && <Gauge className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-[#a1a1aa]">{m.runtimeHours.toLocaleString()} h</td>

                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/machines/${m.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#292a2c] hover:bg-[#d71920] text-white transition-all text-[11px] font-bold"
                    >
                      <span>INSPECT</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

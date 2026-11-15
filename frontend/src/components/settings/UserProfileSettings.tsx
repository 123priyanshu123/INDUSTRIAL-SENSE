import React, { useState } from 'react';
import { User, Lock, Mail, Building, Clock, Save } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export const UserProfileSettings: React.FC = () => {
  const { currentUser, addNotification } = useAppStore();
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [department, setDepartment] = useState(currentUser.department);
  const [shift, setShift] = useState(currentUser.shift);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addNotification('success', 'User profile credentials saved');
  };

  return (
    <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-6 font-mono">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-[#ffb4ab]" />
        <h3 className="text-base font-bold text-white uppercase tracking-wider">
          OPERATOR CREDENTIALS & SHIFT CONTEXT
        </h3>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] text-[#a1a1aa] uppercase font-bold mb-1">
              FULL NAME:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#121315] border border-[#292a2c] focus:border-[#d71920] rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] text-[#a1a1aa] uppercase font-bold mb-1">
              CORPORATE SCADA EMAIL:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#121315] border border-[#292a2c] focus:border-[#d71920] rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] text-[#a1a1aa] uppercase font-bold mb-1">
              DEPARTMENT / FIELD UNIT:
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-[#121315] border border-[#292a2c] focus:border-[#d71920] rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] text-[#a1a1aa] uppercase font-bold mb-1">
              ASSIGNED SHIFT SCHEDULE:
            </label>
            <input
              type="text"
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className="w-full bg-[#121315] border border-[#292a2c] focus:border-[#d71920] rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-[#292a2c] flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#292a2c] hover:bg-[#d71920] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>UPDATE PROFILE</span>
          </button>
        </div>
      </form>
    </div>
  );
};

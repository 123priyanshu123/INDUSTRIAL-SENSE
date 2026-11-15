import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#121315] text-[#e3e2e5] flex antialiased selection:bg-[#d71920] selection:text-white">
      {/* Collapsible Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Dynamic Route Content */}
      <main
        className={`flex-1 transition-all duration-300 p-4 md:p-6 lg:p-8 min-h-screen overflow-x-hidden ${
          collapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <div className="max-w-[1920px] mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

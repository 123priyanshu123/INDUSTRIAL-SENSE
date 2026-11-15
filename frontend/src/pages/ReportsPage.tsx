import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { ReportGenerator } from '../components/reports/ReportGenerator';
import { FileText, Download, CheckCircle, Clock } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const previousReports = [
    { id: 'RPT-84920', machine: 'MCH-PMP-01 (Centrifugal Pump)', period: 'Weekly Shift Audit', date: '2026-11-13', size: '2.4 MB PDF' },
    { id: 'RPT-84811', machine: 'MCH-MTR-01 (Induction Motor)', period: 'Thermal Incident Report', date: '2026-11-12', size: '1.8 MB PDF' },
    { id: 'RPT-84690', machine: 'MCH-CNC-01 (5-Axis Milling)', period: 'Monthly Precision Log', date: '2026-11-08', size: '4.1 MB PDF' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="INDUSTRIAL SHIFT AUDIT & TELEMETRY REPORTS"
        description="Compile authenticated compliance reports, RUL estimates, and sensor raw CSV time series."
        badge="ISO 10816 CLASS II"
      />

      {/* Main Interactive Report Generator Form */}
      <ReportGenerator />

      {/* Historical Report Repository */}
      <div className="bg-[#1b1c1e] border border-[#292a2c] rounded-2xl p-6 font-mono">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-[#a1a1aa]" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            RECENTLY ARCHIVED SHIFT REPORTS
          </h3>
        </div>

        <div className="flex flex-col gap-2.5">
          {previousReports.map((rpt) => (
            <div
              key={rpt.id}
              className="bg-[#121315] border border-[#292a2c] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-[#ffb4ab]" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{rpt.id}</span>
                    <span className="text-xs text-[#a1a1aa]">•</span>
                    <span className="text-[#a1a1aa]">{rpt.period}</span>
                  </div>
                  <span className="text-[11px] text-[#a1a1aa] font-sans mt-0.5 block">{rpt.machine}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[#a1a1aa] self-end sm:self-center">
                <span>{rpt.date} ({rpt.size})</span>
                <button
                  onClick={() => alert(`Simulating download of ${rpt.id}`)}
                  className="px-3 py-1.5 rounded-lg bg-[#292a2c] hover:bg-[#343537] text-white font-bold flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>DOWNLOAD</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

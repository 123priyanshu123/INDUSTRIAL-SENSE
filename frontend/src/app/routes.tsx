import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { LandingPage } from '../pages/LandingPage';
import { DashboardPage } from '../pages/DashboardPage';
import { MachineDeepAnalyticsPage } from '../pages/MachineDeepAnalyticsPage';
import { MachineRegistrationPage } from '../pages/MachineRegistrationPage';
import { UserRegistrationPage } from '../pages/UserRegistrationPage';
import { UserProfileSettingsPage } from '../pages/UserProfileSettingsPage';
import { MachineCataloguePage } from '../pages/MachineCataloguePage';
import { MachineDetailsPage } from '../pages/MachineDetailsPage';
import { LiveMonitoringPage } from '../pages/LiveMonitoringPage';
import { AIInsightsPage } from '../pages/AIInsightsPage';
import { AlertsPage } from '../pages/AlertsPage';
import { ReportsPage } from '../pages/ReportsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Landing Page (Full-screen Technical Kinematics & Thesis) */}
      <Route path="/" element={<LandingPage />} />

      {/* Security Gateway & Portal */}
      <Route path="/register" element={<UserRegistrationPage />} />
      <Route path="/login" element={<UserRegistrationPage />} />
      <Route path="/portal" element={<UserRegistrationPage />} />

      {/* Authenticated SCADA Workspace with Unified TopNavbar & Sidebar */}
      <Route element={<AppLayout />}>
        {/* Core SCADA Cockpit */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Machine Fleet & Catalogue */}
        <Route path="/machines" element={<MachineCataloguePage />} />
        <Route path="/machines/:machineId" element={<MachineDetailsPage />} />

        {/* Machine Deep Analytics */}
        <Route path="/analytics" element={<MachineDeepAnalyticsPage />} />
        <Route path="/analytics/:machineId" element={<MachineDeepAnalyticsPage />} />

        {/* Live Telemetry Monitoring */}
        <Route path="/monitoring" element={<LiveMonitoringPage />} />

        {/* AI Diagnostics & Anomaly Intelligence */}
        <Route path="/ai-insights" element={<AIInsightsPage />} />

        {/* Incident Command & Alert Management */}
        <Route path="/alerts" element={<AlertsPage />} />

        {/* Machine Registration */}
        <Route path="/machine-registration" element={<MachineRegistrationPage />} />
        <Route path="/machines/register" element={<MachineRegistrationPage />} />

        {/* Shift Audit & Compliance Reports */}
        <Route path="/reports" element={<ReportsPage />} />

        {/* User Profile & Safety Threshold Settings */}
        <Route path="/profile" element={<UserProfileSettingsPage />} />
        <Route path="/settings" element={<UserProfileSettingsPage />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { LandingPage } from '../pages/LandingPage';
import { DashboardPage } from '../pages/DashboardPage';
import { MachineDeepAnalyticsPage } from '../pages/MachineDeepAnalyticsPage';
import { MachineRegistrationPage } from '../pages/MachineRegistrationPage';
import { UserRegistrationPage } from '../pages/UserRegistrationPage';
import { UserProfileSettingsPage } from '../pages/UserProfileSettingsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. Landing Page (Full-screen Technical Kinematics & Thesis) */}
      <Route path="/" element={<LandingPage />} />

      {/* 5. User Registration & Security Gateway (Can be accessed directly or in cockpit) */}
      <Route path="/register" element={<UserRegistrationPage />} />
      <Route path="/login" element={<UserRegistrationPage />} />
      <Route path="/portal" element={<UserRegistrationPage />} />

      {/* Authenticated SCADA Workspace with Unified TopNavbar & Sidebar */}
      <Route element={<AppLayout />}>
        {/* 2. Dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* 3. Machine Deep Analytics */}
        <Route path="/analytics" element={<MachineDeepAnalyticsPage />} />
        <Route path="/analytics/:machineId" element={<MachineDeepAnalyticsPage />} />

        {/* 4. Machine Registration */}
        <Route path="/machine-registration" element={<MachineRegistrationPage />} />
        <Route path="/machines/register" element={<MachineRegistrationPage />} />

        {/* 6. User Profile & Settings */}
        <Route path="/profile" element={<UserProfileSettingsPage />} />
        <Route path="/settings" element={<UserProfileSettingsPage />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

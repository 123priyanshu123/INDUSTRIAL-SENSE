# IndustrialSense // AI-Powered Autonomous SCADA & Telemetry

> **Codesprint 2026 Release**  
> An autonomous industrial SCADA platform providing physics-based 2D digital twin animations, multi-modal sensor monitoring (Sound, Temperature, Pressure), and edge AI predictive diagnostics.

---

## 1. Project Architecture

```
IndustrialSense/
│
├── UI/                   # UI design mockups and Stitch visual reference exports
│
├── docs/                 # Engineering documentation & Page/Asset inventory
│   └── PAGE_INVENTORY.md # Phase 1 audit & component mapping
│
├── frontend/             # Complete React 18 + TypeScript + Vite production application
│   ├── public/           # Static public assets
│   ├── src/
│   │   ├── app/          # App root, React Router routes, TanStack Query providers
│   │   ├── components/   # Modular SCADA components
│   │   │   ├── layout/   # AppLayout, TopNavbar, Sidebar, PageHeader, Breadcrumbs
│   │   │   ├── common/   # SearchBar, Modal, Toast, ConfirmDialog
│   │   │   ├── machines/ # MachineCard, MachineTable, ComponentLabel, SensorMarker
│   │   │   ├── machine-animations/ # 12 Dedicated SVG mechanical animation engines
│   │   │   ├── sensors/  # SoundSensorPanel, TemperatureSensorPanel, PressureSensorPanel
│   │   │   ├── dashboard/# MachineSummary, HealthOverview, SensorOverview, RecentAlerts
│   │   │   ├── ai-insights/ # AnomalyCard, AIInsightPanel, RUL gauges
│   │   │   ├── analytics/# HistoricalTrendChart, multi-sensor correlation
│   │   │   ├── reports/  # ReportGenerator, PDF/CSV export simulation
│   │   │   └── settings/ # UserProfile, MachineConfig, SensorConfig, RBACMatrix
│   │   ├── data/         # 15 Machine categories, 12 Priority machines, sensor profiles, mock telemetry
│   │   ├── hooks/        # React Query hooks (useMachines, useSensorReadings, useAlerts, useLiveUpdates)
│   │   ├── services/     # Axios client, REST services, WebSocket simulation service
│   │   ├── store/        # Zustand appStore (Auth, active machine context, notifications, alert state)
│   │   ├── types/        # Strict TypeScript interfaces for telemetry, machines, sensors, alerts
│   │   └── utils/        # Unit formatting, status badges, threshold evaluations, date formatting
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
└── backend/              # API and WebSocket server staging
```

---

## 2. Core 6-Page Application Architecture

As specified in the production requirements, the application is streamlined to **strictly 6 core pages**:

| # | Page Name | Route | Highlights & Features |
| :-: | :--- | :--- | :--- |
| **1** | **Landing Page** | `/` | 60 FPS HTML5 Canvas mechanical simulation engine (impeller, 3 spur gears, slider-crank piston, 180 particles), 5 hanging swaying machinery cards, research thesis and live lab telemetry statistics |
| **2** | **Dashboard** | `/dashboard` | Nothing OS Industrial SCADA Cockpit with Factory Spatial Map (SVG, Zones A-D, AGV tracks, interactive machine nodes, bottom inspector flyout card), SCADA Quick Filter Ribbon, and Alert & Maintenance Command Center with instant E-STOP |
| **3** | **Machine Deep Analytics** | `/analytics` | Technical 2.5D CAD line art schematic of Centrifugal Pump (MCH-PMP-01), 4 high-contrast callout badges, condition score radial gauge (78%), and 3 live telemetry modules (Canvas temperature sparkline, pressure differential bars, 14-bar dancing FFT equalizer) |
| **4** | **Machine Registration** | `/machine-registration` | Hardware Register & Asset Provisioning Directory, 4 SVG Vector CAD schematics (PMP-01, CNC-01, HYD-01, ASRS-19), interactive onboarding form, CAD file dropzone, sampling frequency selector |
| **5** | **User Registration** | `/register` | Security Gateway [SIL-4 Authentication] with Operator Sign-In and New Personnel Enrollment mode toggle, 16-byte RFID/NFC badge UID input, supervisor key validation, 2FA channels (NFC, FIDO2, Biometric) |
| **6** | **User Profile & Settings** | `/profile` | Operator credentials card, assigned shift context, sensor alarm threshold sliders (Cavitation, Temp, Pressure, Vibration), Safety escalation matrix toggles, and immutable SIL-4 audit trail |

---

## 3. Technology Stack

| Technology | Purpose in IndustrialSense |
| :--- | :--- |
| **React 18 & TypeScript** | Component-driven UI with end-to-end type safety |
| **Vite** | Blazing-fast development server and optimized rollup bundling |
| **Tailwind CSS** | Industrial Nothing OS SCADA aesthetic (`#121315`, `#d71920`, `#ffb4ab`) |
| **React Router v6** | Declarative client-side routing across 11 designated routes |
| **SVG & CSS Keyframes** | Physics-based mechanical kinematic animations for 12 industrial machines |
| **Framer Motion** | Interface transitions, drawer animations, and interactive feedback |
| **Recharts** | Real-time multi-axis sensor telemetry trends, FFT spectrum equalizers, line curves |
| **Axios** | REST communication with JWT interceptors and offline SCADA gateway fallbacks |
| **TanStack Query** | Server state caching, background polling, and optimistic mutations |
| **Zustand** | Centralized client state for active machine selection, role switching, and alert acknowledgement |
| **Lucide React** | Industrial telemetry, sensor, and mechanical icons |

---

## 3. Dedicated 12-Machine Mechanical Animation Engines

Unlike generic rotating icons, each machine features a mechanical kinematic illustration:
1. **Centrifugal Pump** (`mch-pmp-01`): Spiral volute casing, suction/discharge flanges, 6-vane radial impeller, dynamic fluid vectors.
2. **CNC 5-Axis Milling** (`mch-cnc-01`): Gantry columns, sliding T-slot worktable, rotating high-speed electro-spindle with titanium chip sparks.
3. **CNC Heavy Lathe** (`mch-lth-01`): Cast headstock, 3-jaw chuck, rotating workpiece billet with step cuts, traversing tool turret with TiN carbide tip.
4. **3-Phase Induction Motor** (`mch-mtr-01`): Ribbed cooling fins, terminal box, drive-end shaft, external cowl fan with rotating blades.
5. **Heavy Belt Conveyor** (`mch-cnv-01`): Truss framework, motorized head pulley, tension idlers, textured rubber belt with moving ore packages.
6. **Industrial Exhaust Fan** (`mch-fan-01`): Circular duct shroud, safety wire guard, 4 aerodynamic curved blades, draft velocity wavefronts.
7. **Reciprocating Air Compressor** (`mch-cmp-01`): Cast crankcase, finned cylinder bore, dual reed valves, reciprocating piston with connecting rod and counterbalanced crankshaft.
8. **500-Ton Hydraulic Press** (`mch-prs-01`): Tie rod columns, crown cylinder, chrome ram rod, downward forging stroke shockwaves.
9. **6-Axis Articulated Welding Robot** (`mch-rob-01`): Pedestal base, shoulder/elbow articulated links, harmonic wrist, laser seam welding torch with blue arc and hot sparks.
10. **Steam Turbine** (`mch-trb-01`): Conical expansion casing, central rotor shaft, 4 multi-stage expanding blade aerofoil discs with steam stream rays.
11. **Industrial Batch Agitator/Mixer** (`mch-mix-01`): Top-entry drive, sanitary seal, suspended shaft, dual hydrofoil mixing blades with vessel fluid vortex swirl.
12. **Heavy Helical Gearbox** (`mch-gbx-01`): Case-hardened housing, lube oil sump, input high-speed 12-tooth pinion gear meshing counter-clockwise with a 24-tooth low-speed bull gear.

Each animation includes an interactive controller:
- **Play / Pause / Restart**
- **Speed Multiplier** (0.5x, 1x, 2x)
- **Live State vs. Instructional Demo Mode**
- **Click-to-Inspect Mechanical Components**
- **Sensor Hotspot Markers** (Sound, Temperature, Pressure)

---

## 4. The 3 Supported Sensor Modalities

IndustrialSense strictly standardizes on the 3 fundamental industrial sensor types:
- **Sound & Acoustic Mic (dB / dB(A))**: Real-time 1/3-octave FFT frequency spectrum, cavitation detection, bearing fluting harmonics.
- **Temperature & Thermal RTD (°C)**: Thermal gradient rate-of-change (°C/min), critical trip margins, lube oil viscosity alerts.
- **Pressure Transducers (bar / PSI)**: Piezoresistive line pressure, differential head pressure (ΔP), suction NPSHa safety margins.

---

## 5. Quick Start Instructions

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Run the development server
npm run dev

# 3. Build for production release
npm run build
```

Open `http://localhost:5173` in your browser.
- Public Landing Page: `/`
- Operator Login (pre-filled roles: Admin, Engineer, Viewer): `/login`
- SCADA Cockpit Dashboard: `/dashboard`
- Machine Catalogue (15 Categories): `/machines`
- Machine Digital Twin Inspector: `/machines/mch-pmp-01`
- Live Telemetry Stream: `/monitoring`
- AI Anomaly Insights: `/ai-insights`
- Alert Command: `/alerts`
- Analytics Trends: `/analytics`
- Shift Reports: `/reports`
- System Configuration: `/settings`

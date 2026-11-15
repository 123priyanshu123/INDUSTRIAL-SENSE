# IndustrialSense Frontend Page & Asset Inventory
**Phase 1: Stitch Export Analysis & 6-Page Streamlined Architecture**
**Version:** 2.0.0 (Strict 6-Page Streamlined Release)

---

## 1. System Overview
- **Design System:** Nothing OS Industrial SCADA Cockpit (`#08080a`, `#101014`, `#131318`, `#1b1b22`, `#2a2a34`, signal crimson `#d71920`, electric cyan `#00E5FF`, warning amber `#F59E0B`, emerald `#10B981`).
- **Typography:** Space Mono (Telemetry, metrics, headers, status tags, bus identifiers) & Inter (Descriptions, labels, form controls).
- **Architecture:** Streamlined to strictly **6 core application pages**, with unified top header and sidebar navigation bus.

---

## 2. Strict 6-Page Inventory

| # | Page Name | Route | Source Files / Prototype | Primary Components & Features | Buttons & User Actions | Real-Time Telemetry & Animations |
| :-: | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Landing Page** | `/` | `index.html`, `UI/landing_page` | 2D HTML5 Canvas kinematics simulation engine, 5 hanging machinery tool cards, gear trains, particle vectors, capstone thesis and research highlights | "INSPECT 3D SCADA TWIN", "VIEW PROJECT THESIS", "OPEN SCADA COCKPIT", "OPERATOR LOGIN" | 60 FPS HTML5 Canvas mechanical engine (impeller, 3 spur gears, slider-crank piston, 180 particles, dual dials), 5 CSS tool sway pendulums (`sway-tool-1`..`5`) |
| **2** | **Dashboard** | `/dashboard` | `dashboard.html`, `UI/dashboard` | SCADA Quick Filter Ribbon (4 KPI status cards), Factory Spatial Map (SVG 860x520, Zones A-D, AGV corridors, interactive machine nodes, bottom inspector flyout card), Alert & Maintenance Command Center queue, Machine Registration Modal | "REGISTER MACHINE", "ALL/STOP REQ/MAINT filters", "[!] TRIGGER E-STOP NOW", "LOCATE ON MAP", "OPEN MACHINE DEEP ANALYTICS →" | Animated dashed AGV corridors with moving platforms, Zone B crane carriage vertical glide (100ms interval), pulsing LED rings, live interactive node selection |
| **3** | **Machine Deep Analytics** | `/analytics`, `/analytics/:machineId` | `analytics.html`, `UI/machine_deep_analytics` | Centrifugal Pump (MCH-PMP-01) Blueprint Digital Twin CAD line art schematic, 4 overlay callout badges, Machine Condition Score radial gauge (78%), 3 live motion telemetry modules | "PMP-01/PMP-02 switcher", "E-STOP [CAT 4]", "RETURN TO FACTORY MAP" | 1. Live temperature canvas gradient sparkline with organic wander (88.1°C-91.2°C); 2. Live undulating pressure differential safety bar; 3. Real-time dancing 14-bar FFT audio equalizer loop (70ms tick) |
| **4** | **Machine Registration** | `/machine-registration`, `/machines/register` | `registration.html`, `UI/machine_registration_line_diagram_directory` | Hardware Register & Asset Provisioning Directory, 4 SVG Vector CAD schematics (PMP-01, CNC-01, HYD-01, ASRS-19), Interactive onboarding form, CAD file dropzone, sampling frequency selector | "AUTO-GENERATE MAC", "EXPORT DXF", "VIEW TWIN", "PROVISION MACHINE NODE", "RESCAN BUS" | Dynamic CAD dropzone, live node registration feedback toast, dynamic schematic preview |
| **5** | **User Registration** | `/register`, `/login`, `/portal` | `portal.html`, `UI/industrialsense_n_os_scada_secure_access_portal_login_register` | Security Gateway [SIL-4 Authentication], Mode toggle ([OPERATOR SIGN-IN] vs [NEW ENROLLMENT]), 16-byte RFID/NFC badge UID input, supervisor key validation, 2FA channels (NFC, FIDO2, Biometric) | "AUTHENTICATE & ENTER SCADA COCKPIT", "SUBMIT CREDENTIALS FOR ENROLLMENT", "EMERGENCY DISPATCH GUEST ACCESS", "[REVEAL KEY]" | Hardware 2FA pulsing beacons, biometric scan states, simulated token cryptographic validation |
| **6** | **User Profile & Settings** | `/profile`, `/settings` | `portal.html`, `UI/nothing_os_scada_cockpit_factory_map_machine_registration` | Operator profile credentials card, assigned shift context, sensor alarm threshold sliders (Cavitation, Temp, Pressure, Vibration), Safety escalation matrix toggles, Immutable SIL-4 audit trail | "SAVE CONFIGURATION TO HARDWARE ENCLAVE", threshold range sliders, alarm toggles | Range slider value updates, real-time threshold feedback, cryptographic SHA-256 audit log stream |

---

## 3. Technology Stack Alignment
- **Framework:** React 18 with TypeScript & Vite
- **Styling:** Tailwind CSS with Nothing OS Industrial palette (`#08080a`, `#101014`, `#131318`, `#d71920`, `#ffb4ab`, etc.)
- **Icons:** `lucide-react`
- **Telemetry Visualizers:** HTML5 Canvas, SVG 2D kinematics, CSS keyframe transformations, Recharts
- **State Management:** `zustand` (`appStore.ts`)
- **Routing:** `react-router-dom` v6 with unified 6-page navigation bus

---
name: Industrial Carbon SCADA
colors:
  surface: '#121315'
  surface-dim: '#121315'
  surface-bright: '#38393b'
  surface-container-lowest: '#0d0e10'
  surface-container-low: '#1b1c1e'
  surface-container: '#1f2022'
  surface-container-high: '#292a2c'
  surface-container-highest: '#343537'
  on-surface: '#e3e2e5'
  on-surface-variant: '#e6bdb8'
  inverse-surface: '#e3e2e5'
  inverse-on-surface: '#303033'
  outline: '#ad8884'
  outline-variant: '#5d3f3c'
  surface-tint: '#ffb4ab'
  primary: '#ffb4ab'
  on-primary: '#690006'
  primary-container: '#d71920'
  on-primary-container: '#ffece9'
  inverse-primary: '#c00014'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#c6c5cf'
  on-tertiary: '#2f3038'
  tertiary-container: '#6c6c75'
  on-tertiary-container: '#f0eef9'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ab'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#93000d'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e3e1ec'
  tertiary-fixed-dim: '#c6c5cf'
  on-tertiary-fixed: '#1a1b22'
  on-tertiary-fixed-variant: '#46464e'
  background: '#121315'
  on-background: '#e3e2e5'
  surface-variant: '#343537'
typography:
  display-lg:
    fontFamily: Space Mono
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Space Mono
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.03em
  headline-xl:
    fontFamily: Space Mono
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Space Mono
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Mono
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Mono
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: 0em
  metric-display:
    fontFamily: Space Mono
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: 0.02em
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-mono-lg:
    fontFamily: Space Mono
    fontSize: 13px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.08em
  label-mono-md:
    fontFamily: Space Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.1em
  label-mono-sm:
    fontFamily: Space Mono
    fontSize: 9px
    fontWeight: '400'
    lineHeight: 12px
    letterSpacing: 0.12em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-dense: 0.5rem
  margin: 1.5rem
  margin-mobile: 0.75rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system translates the raw, utilitarian minimalism of modern hardware operating systems into mission-critical industrial automation and SCADA environments. Designed for engineers, operations managers, and plant supervisors monitoring heavy machinery, robotics, and facility telemetry, the system balances extreme operational clarity with a tactile, technical aesthetic.

The design movement combines **Industrial Brutalism** and **Tactile Precision Glass**:
- **Utilitarian Rawness:** Structural borders, micro-grid demarcations, and mechanical labeling prioritize instant information parsing over decorative flourish.
- **Deep Carbon Matte:** Light-absorbing background surfaces eliminate glare in high-stress control rooms while creating depth through layered, low-reflectance tones.
- **Critical Signal Contrasts:** Monochromatic foundations ensure that alert states, machine telemetry spikes, and active operations achieve immediate ocular priority using precise signal red accents.
- **Hardware-Inspired Physicality:** Toggle pills, segmented switches, and recessed dials reflect tangible hardware controls engineered for error-free interaction under pressure.

## Colors

The palette is engineered around high optical contrast on low-emission surfaces, reducing eye strain over 12-hour monitoring shifts while elevating critical anomalies.

### Palette Architecture
- **Base Surfaces (Neutral):** Deep carbon matte (`#0B0C0E`) anchors the global canvas. Secondary panels and module chassis step up subtly to `#121316` and `#18191D`, establishing spatial separation without chromatic distraction.
- **Primary Signal (Telemetry & Alert):** `#D71920` (Industrial Red) is reserved exclusively for real-time telemetry pulses, limit violations, E-stop triggers, and active system-critical indicators. It must never be diluted for decorative or non-essential states.
- **Information Architecture (Secondary & Tertiary):** Stark, high-readability metric readouts utilize `#EEEEEE` for pure legibility. Sub-labels, inactive states, unit measures, and chassis dividers are mapped to cold technical slates (`#71717A`, `#52525B`, `#3F3F46`).
- **Telemetry State Accents (Functional Additions):** 
  - *Nominal Operations:* `#22C55E` (Emerald telemetry ping).
  - *Advisory / Warning:* `#F59E0B` (Amber status caution).
  - *Standby / Unpowered:* `#27272A` (Smoked zinc).

## Typography

The typographic hierarchy enforces a strict division between data presentation and narrative context:

- **Space Mono (Telemetry, Readouts, System Status, Labels):** Fixed-width geometry guarantees column stability during rapid data fluctuations (preventing numeric shifting in live feeds). All technical tags, unit descriptors, timestamps, coordinates, and industrial readouts must render in Space Mono, uppercase where indicated by label tokens.
- **Inter (Instructional Copy, Logs, System Dialogues, Metadata):** Clean, neo-grotesque sans-serif providing high text density and legibility for maintenance procedures, incident narratives, and settings configurations.
- **Punctuation & Delimiters:** Monospace brackets, colons, and slash marks (`[`, `]`, `//`, `::`) function as structural syntax throughout the system to mimic machine communication protocols.

## Layout & Spacing

The layout model is anchored by a high-density, mathematical 12-column responsive fluid grid designed for multi-display operations consoles, rugged tablets, and control center wall arrays.

### Grid & Density Principles
- **Grid Layout:** 12-column system with standard `1rem` gutters for dashboards; `0.5rem` dense gutters for real-time telemetry matrices and bus line visualization.
- **Edge Boundaries:** Fixed outer margins of `1.5rem` on desktop and display arrays; compressed to `0.75rem` on mobile field terminals to maximize functional data area.
- **Component Padding Matrix:**
  - Micro chips & badge tags: `space-xs` (0.25rem) vertical, `space-sm` (0.5rem) horizontal.
  - Interactive cells & input fields: `space-sm` (0.5rem) vertical, `space-md` (1rem) horizontal.
  - Telemetry card enclosures: `space-md` (1rem) internal padding.
  - Section chassis clusters: `space-lg` (1.5rem) separation.
  - Macro workflow divisions: `space-xl` (2.5rem) outer margin spacing.
- **Viewport Adaptation:**
  - **Large Console (>1440px):** 12 columns, persistent left diagnostics bar (280px), multi-panel canvas.
  - **Terminal / Tablet (768px - 1439px):** 8 columns, collapsible navigation drawer, dynamic split-pane data cards.
  - **Handheld Field Device (<767px):** 4 columns, single-column stack, metrics prioritize single primary value with horizontal secondary parameter scroll.

## Elevation & Depth

To prevent atmospheric muddying and preserve battery and thermal performance on field hardware, this design system abandons soft, diffused drop shadows. Depth is communicated strictly through structural layering, border illumination, and translucent smoked glass planes.

### Surface Hierarchy
1. **Machine Bed (`#0B0C0E`):** The zero-plane canvas. Infinite, non-reflective carbon matte.
2. **Component Chassis (`#121316`):** Modular units resting upon the bed, bounded by subtle smoked borders.
3. **Elevated Tray / Floating Panel (`#18191D` with 80% opacity and 12px backdrop-blur):** Toolbars, contextual overlays, and transient inspection drawers.
4. **Interactive Focus Tier (`#202227`):** Active card segments, highlighted toggle tracks, and hovered data rows.

### Smoked Glass & Outline Technique
- **Base Inactive Border:** Solid 1px stroke using `#27272A`.
- **Active Structural Border:** Solid 1px stroke using `#3F3F46`.
- **Focused / Critical Stroke:** 1px solid stroke with `#D71920` or `#EEEEEE`.
- **Dot-Matrix Overlay:** Complex chassis panels may employ an ultra-faint dot-matrix SVG background (`#27272A` at 15% opacity, 8px grid) to evoke circuit substrate and reinforce spatial boundaries without elevating luminance.

## Shapes

The shape architecture relies on the stark juxtaposition of rigid, rectilinear architectural containers paired with ultra-smooth pill-shaped control nodes:

- **Enclosures & Canvases:** Main application windows, dashboard panels, telemetry cards, and data table containers feature tight, disciplined corner geometry (4px to 6px maximum) to maintain structural density and optimize space.
- **Tactile Pills (`roundedness: 3`):** All interactive triggers, status badges, toggle switches, parameter selectors, and alert pills utilize complete capsule geometry (`9999px` / full pill radius). This creates an immediate visual signature: if an element is fully rounded, it represents an actionable mechanical switch, filter chip, or localized sensor readout.
- **Dot Indicators:** Circular 6px and 8px telemetry pings sit embedded within pill borders to communicate active live polling without consuming layout area.

## Components

### Buttons & Interactive Triggers
- **Primary Action (Execute / Confirm):** High-contrast stark white capsule (`#EEEEEE`) with solid jet black text (`#0B0C0E`) in Space Mono Bold. Hover state shifts to `#FFFFFF` with an active inset indicator ring.
- **Emergency / Critical (E-Stop / Kill Switch / Override):** Signature Nothing Red capsule (`#D71920`) with white text (`#FFFFFF`). Border: 1px solid `#FF454D`. Pulse state emits an acute 2px ring ping during active interlock.
- **Secondary / Utilitarian:** Matte chassis pill (`#121316`) enclosed by a 1px smoked glass border (`#27272A`), text in `#EEEEEE`. Hover prompts border transition to `#3F3F46` and background to `#1E2024`.
- **Segmented Machine Controls:** Pill-shaped grouped enclosures where the active option occupies an internal pill container in `#EEEEEE` with dark text, and inactive options remain transparent slate.

### Chips & Sensor Badges
- Encapsulated pills featuring `label-mono-sm` typography.
- **Telemetry Live Tag:** Deep dark pill (`#121316`) bordered with `#27272A`. Contains a 4px blinking status dot on the left: `#D71920` (Critical), `#22C55E` (Nominal), or `#71717A` (Offline).

### Data Lists & Telemetry Tables
- Borderless cell walls; rows separated by a hairline 1px divider in `#1E2024`.
- Row height: 40px fixed for high-density scanning.
- Alternating hover state: background transitions instantly to `#18191D` with a 2px left border accent in `#D71920` or `#EEEEEE`.
- Numeric values rendered right-aligned in `Space Mono`, units rendered in `Inter` body-sm with `#71717A`.

### Checkboxes & Radio Selectors
- **Checkbox:** Square 16x16px frame with sharp 2px corners, 1px border in `#3F3F46`. Checked state: solid `#D71920` background with a precise white check glyph.
- **Radio Pill / Toggle Node:** Elongated tactile pill housing a mechanical slide switch. Track: `#18191D` with `#27272A` border. Thumb: stark white circular node (`#EEEEEE`) that shifts with snap-action spring physics.

### Input Fields & Parameter Steppers
- Low-profile containers with `#121316` background and `#27272A` perimeter stroke.
- Text: `Space Mono` 14px in `#EEEEEE`. Placeholder text: `#52525B`.
- Integrated numeric steppers: Monospace plus/minus triggers housed in pill-capsule end-caps with tactile press response.
- Active focus state: Smoked border transitions to `#EEEEEE` with zero blur glow.

### Telemetry Cards & Machine Enclosures
- Flat matte surface (`#121316`) framed by a 1px smoked border (`#27272A`).
- Top header band includes uppercase monospace module identifier (e.g., `[SYS_ZONE_04 // PUMP_PRESSURE]`) in `label-mono-sm`, accompanied by a right-aligned pill status chip.
- Primary visual payload: Massive metric readouts (`metric-display`) alongside micro sparklines rendered in `#D71920` or `#EEEEEE` with 1px hairline path weight.
- Card corners optionally feature subtle crosshair alignment marks (`+`) at panel intersections.

### Additional Industrial SCADA Modules
- **Emergency Status Ribbon:** Top-docked, 32px banner with diagonal hazard stripes (`#D71920` / `#0B0C0E`) visible strictly during system interlocks or unacknowledged fail states.
- **Actuator Gauge Dial:** Semi-circular mechanical line gauge rendered with segmented ticks, active values highlighted in stark white or signal red.
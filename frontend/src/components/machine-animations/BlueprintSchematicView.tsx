import React from 'react';
import { Volume2, Gauge, Thermometer, RotateCw, Activity, Cpu } from 'lucide-react';
import { Machine } from '../../types/machine';

interface BlueprintSchematicViewProps {
  machine: Machine;
  soundDb: number;
  baseTemp: number;
  pressureDisc: number;
  pressureSuct: number;
  vfdRpm: number;
}

export const BlueprintSchematicView: React.FC<BlueprintSchematicViewProps> = ({
  machine,
  soundDb,
  baseTemp,
  pressureDisc,
  pressureSuct,
  vfdRpm,
}) => {
  const profile = machine.animationProfile || 'centrifugal-pump';

  // Render the distinctive CAD technical blueprint schematic based on machine profile
  const renderSchematicLineArt = () => {
    switch (profile) {
      case 'cnc-milling':
        return (
          <g>
            {/* Machine Enclosure & Base Bed */}
            <rect x="90" y="275" width="580" height="16" rx="2" fill="#15161c" stroke="#FFFFFF" strokeWidth="3" />
            <rect x="120" y="291" width="50" height="16" fill="#1b1c24" stroke="#D4D4D8" strokeWidth="2.5" />
            <rect x="600" y="291" width="50" height="16" fill="#1b1c24" stroke="#D4D4D8" strokeWidth="2.5" />
            <circle cx="145" cy="299" r="4" fill="#272732" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="625" cy="299" r="4" fill="#272732" stroke="#FFFFFF" strokeWidth="2" />

            {/* Twin Gantry Vertical Columns */}
            <rect x="140" y="60" width="60" height="215" rx="3" fill="#181922" stroke="#FFFFFF" strokeWidth="3" />
            <rect x="560" y="60" width="60" height="215" rx="3" fill="#181922" stroke="#FFFFFF" strokeWidth="3" />
            {/* Horizontal Bridge / Cross Gantry */}
            <rect x="130" y="50" width="500" height="42" rx="3" fill="#1f202b" stroke="#FFFFFF" strokeWidth="3.5" />
            <line x1="140" y1="72" x2="620" y2="72" stroke="#00E5FF" strokeWidth="2" strokeDasharray="6 4" />

            {/* Sliding Worktable (X-Y Axis) */}
            <rect x="220" y="240" width="320" height="35" rx="3" fill="#1e1f2b" stroke="#FFFFFF" strokeWidth="3" />
            <line x1="240" y1="250" x2="520" y2="250" stroke="#71717a" strokeWidth="2" />
            <line x1="240" y1="262" x2="520" y2="262" stroke="#71717a" strokeWidth="2" />
            {/* Machining Workpiece (Titanium Billet) */}
            <rect x="330" y="195" width="100" height="45" fill="#2c2d3d" stroke="#D4D4D8" strokeWidth="2" />
            <text x="380" y="222" fill="#E4E4E7" fontSize="10" fontFamily="Space Mono" fontWeight="bold" textAnchor="middle">
              TITANIUM BLANK
            </text>

            {/* Vertical Ceramic Spindle Head (Z-Axis) */}
            <rect x="335" y="68" width="90" height="95" rx="4" fill="#161720" stroke="#FFFFFF" strokeWidth="3.5" />
            <line x1="345" y1="85" x2="415" y2="85" stroke="#71717a" strokeWidth="2" />
            <line x1="345" y1="100" x2="415" y2="100" stroke="#71717a" strokeWidth="2" />
            <line x1="345" y1="115" x2="415" y2="115" stroke="#71717a" strokeWidth="2" />

            {/* Ceramic Spindle Collet Chuck & High-Speed Cutting Tool */}
            <polygon points="360,163 400,163 392,185 368,185" fill="#2e2f3d" stroke="#FFFFFF" strokeWidth="2.5" />
            <rect x="376" y="185" width="8" height="28" fill="#D71920" stroke="#FFFFFF" strokeWidth="2" />
            {/* Tool Rotation Arcs */}
            <path d="M 364 200 A 16 8 0 0 1 396 200" fill="none" stroke="#00E5FF" strokeWidth="2" strokeDasharray="3 2" />

            {/* Spindle Chatter Resonance Critical Focal Zone */}
            <circle cx="380" cy="198" r="14" fill="#4a0b0e" stroke="#D71920" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="380" cy="198" r="5" fill="#D71920" stroke="#ffffff" strokeWidth="1.5" />

            {/* Callout Leader Lines */}
            <polyline points="380,198 320,110 148,110" fill="none" stroke="#D71920" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="148" cy="110" r="4.5" fill="#D71920" stroke="#ffffff" strokeWidth="1.5" />

            <polyline points="280,250 280,240 180,240" fill="none" stroke="#00E5FF" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="180" cy="240" r="4.5" fill="#00E5FF" stroke="#000000" strokeWidth="2" />

            <polyline points="425,110 490,90 560,90" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="560" cy="90" r="4.5" fill="#F59E0B" stroke="#000000" strokeWidth="2" />

            <polyline points="400,163 460,200 580,200" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="580" cy="200" r="4.5" fill="#FFFFFF" stroke="#D71920" strokeWidth="1.5" />
          </g>
        );

      case 'lathe-machine':
        return (
          <g>
            {/* Slant Bed Frame */}
            <rect x="80" y="270" width="600" height="18" rx="2" fill="#15161c" stroke="#FFFFFF" strokeWidth="3" />
            <rect x="110" y="288" width="55" height="16" fill="#1b1c24" stroke="#D4D4D8" strokeWidth="2.5" />
            <rect x="600" y="288" width="55" height="16" fill="#1b1c24" stroke="#D4D4D8" strokeWidth="2.5" />

            {/* Headstock Spindle Casing (Left) */}
            <rect x="110" y="100" width="130" height="170" rx="4" fill="#181922" stroke="#FFFFFF" strokeWidth="3.5" />
            <line x1="125" y1="130" x2="225" y2="130" stroke="#71717a" strokeWidth="2" />
            <line x1="125" y1="160" x2="225" y2="160" stroke="#71717a" strokeWidth="2" />
            <line x1="125" y1="190" x2="225" y2="190" stroke="#71717a" strokeWidth="2" />

            {/* 3-Jaw Hydraulic Chuck */}
            <rect x="240" y="115" width="45" height="140" rx="3" fill="#252633" stroke="#FFFFFF" strokeWidth="3" />
            {/* Clamping Jaws */}
            <rect x="285" y="130" width="22" height="30" fill="#2e2f3d" stroke="#FFFFFF" strokeWidth="2.5" />
            <rect x="285" y="210" width="22" height="30" fill="#2e2f3d" stroke="#FFFFFF" strokeWidth="2.5" />

            {/* Workpiece Cylindrical Shaft */}
            <rect x="307" y="160" width="190" height="50" fill="#2c2d3d" stroke="#D4D4D8" strokeWidth="2.5" />
            <line x1="307" y1="185" x2="497" y2="185" stroke="#71717a" strokeWidth="2" strokeDasharray="6 4" />

            {/* Tailstock Assembly (Right) */}
            <polygon points="497,185 530,165 530,205" fill="#2e2f3d" stroke="#FFFFFF" strokeWidth="2.5" />
            <rect x="530" y="130" width="100" height="140" rx="3" fill="#181922" stroke="#FFFFFF" strokeWidth="3.5" />
            <rect x="520" y="155" width="20" height="60" fill="#252633" stroke="#FFFFFF" strokeWidth="2.5" />

            {/* Tool Turret & Carriage (Center Foreground) */}
            <rect x="340" y="210" width="80" height="60" rx="3" fill="#1f202b" stroke="#FFFFFF" strokeWidth="3" />
            {/* Carbide Cutting Tool Holder */}
            <polygon points="370,210 385,185 395,185 385,210" fill="#D71920" stroke="#FFFFFF" strokeWidth="2" />

            {/* Turning Focal Zone Hotspot */}
            <circle cx="388" cy="185" r="14" fill="#4a0b0e" stroke="#D71920" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="388" cy="185" r="5" fill="#D71920" stroke="#ffffff" strokeWidth="1.5" />

            {/* Callouts */}
            <polyline points="240,140 180,85 148,85" fill="none" stroke="#D71920" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="148" cy="85" r="4.5" fill="#D71920" stroke="#ffffff" strokeWidth="1.5" />

            <polyline points="295,145 295,245 230,245" fill="none" stroke="#00E5FF" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="230" cy="245" r="4.5" fill="#00E5FF" stroke="#000000" strokeWidth="2" />

            <polyline points="400,230 460,110 560,110" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="560" cy="110" r="4.5" fill="#F59E0B" stroke="#000000" strokeWidth="2" />

            <polyline points="240,185 240,240 580,240" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="580" cy="240" r="4.5" fill="#FFFFFF" stroke="#D71920" strokeWidth="1.5" />
          </g>
        );

      case 'industrial-motor':
        return (
          <g>
            {/* Foundation Skid */}
            <rect x="90" y="270" width="580" height="18" rx="2" fill="#15161c" stroke="#FFFFFF" strokeWidth="3" />
            <polygon points="170,225 155,270 205,270 195,225" fill="#1f202b" stroke="#FFFFFF" strokeWidth="3" />
            <polygon points="460,225 450,270 500,270 485,225" fill="#1f202b" stroke="#FFFFFF" strokeWidth="3" />

            {/* Stator Casing with Ribbed Cooling Fins */}
            <rect x="180" y="90" width="310" height="145" rx="5" fill="#181922" stroke="#FFFFFF" strokeWidth="3.5" />
            {/* Heat Dissipation Fins */}
            {[105, 120, 135, 150, 165, 180, 195, 210].map((y, idx) => (
              <line key={idx} x1="200" y1={y} x2="470" y2={y} stroke="#8a8a9a" strokeWidth="3" />
            ))}

            {/* Terminal Conduit Box on Top */}
            <rect x="290" y="60" width="90" height="30" rx="3" fill="#252633" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="315" cy="75" r="4" fill="none" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="345" cy="75" r="4" fill="none" stroke="#FFFFFF" strokeWidth="2" />

            {/* Internal Rotor & Shaft Projection */}
            <rect x="100" y="145" width="80" height="35" rx="2" fill="#2e2f3d" stroke="#FFFFFF" strokeWidth="3" />
            <rect x="110" y="152" width="20" height="6" fill="#D71920" />
            <rect x="490" y="100" width="40" height="125" rx="3" fill="#14151c" stroke="#FFFFFF" strokeWidth="3" />
            {/* Cowl Vent Slots */}
            <line x1="505" y1="115" x2="505" y2="210" stroke="#71717a" strokeWidth="2.5" />
            <line x1="518" y1="115" x2="518" y2="210" stroke="#71717a" strokeWidth="2.5" />

            {/* Air Gap Hotspot */}
            <circle cx="215" cy="162" r="14" fill="#4a0b0e" stroke="#D71920" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="215" cy="162" r="5" fill="#D71920" stroke="#ffffff" strokeWidth="1.5" />

            {/* Callouts */}
            <polyline points="215,162 170,90 148,90" fill="none" stroke="#D71920" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="148" cy="90" r="4.5" fill="#D71920" stroke="#ffffff" strokeWidth="1.5" />

            <polyline points="290,75 220,75 190,230" fill="none" stroke="#00E5FF" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="190" cy="230" r="4.5" fill="#00E5FF" stroke="#000000" strokeWidth="2" />

            <polyline points="470,140 510,80 560,80" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="560" cy="80" r="4.5" fill="#F59E0B" stroke="#000000" strokeWidth="2" />

            <polyline points="140,162 140,240 580,240" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="580" cy="240" r="4.5" fill="#FFFFFF" stroke="#D71920" strokeWidth="1.5" />
          </g>
        );

      case 'belt-conveyor':
        return (
          <g>
            {/* Conveyor Truss Base Frame */}
            <line x1="80" y1="280" x2="680" y2="280" stroke="#FFFFFF" strokeWidth="3.5" />
            <line x1="120" y1="280" x2="160" y2="230" stroke="#71717a" strokeWidth="2.5" />
            <line x1="240" y1="280" x2="280" y2="230" stroke="#71717a" strokeWidth="2.5" />
            <line x1="360" y1="280" x2="400" y2="230" stroke="#71717a" strokeWidth="2.5" />
            <line x1="480" y1="280" x2="520" y2="230" stroke="#71717a" strokeWidth="2.5" />
            <line x1="600" y1="280" x2="640" y2="230" stroke="#71717a" strokeWidth="2.5" />

            {/* Head Drive Pulley (Right) */}
            <circle cx="580" cy="180" r="50" fill="#252633" stroke="#FFFFFF" strokeWidth="3.5" />
            <circle cx="580" cy="180" r="20" fill="#161720" stroke="#FFFFFF" strokeWidth="2.5" />

            {/* Tail Pulley (Left) */}
            <circle cx="160" cy="180" r="45" fill="#252633" stroke="#FFFFFF" strokeWidth="3" />
            <circle cx="160" cy="180" r="18" fill="#161720" stroke="#FFFFFF" strokeWidth="2.5" />

            {/* Troughing Idler Rollers (Intermediate) */}
            {[260, 360, 460].map((cx, idx) => (
              <g key={idx}>
                <circle cx={cx} cy="145" r="14" fill="#2e2f3d" stroke="#D4D4D8" strokeWidth="2" />
                <circle cx={cx} cy="215" r="12" fill="#2e2f3d" stroke="#D4D4D8" strokeWidth="2" />
              </g>
            ))}

            {/* Continuous Rubber Conveyor Belt Loop */}
            <path
              d="M 160 135 L 580 130 C 635 130, 635 230, 580 230 L 160 225 C 110 225, 110 135, 160 135 Z"
              fill="none"
              stroke="#D4D4D8"
              strokeWidth="5"
            />
            {/* Belt Motion Direction Vector */}
            <path d="M 320 120 L 380 120 M 370 114 L 380 120 L 370 126" stroke="#00E5FF" strokeWidth="2" />

            {/* Head Pulley Bearing Hotspot */}
            <circle cx="580" cy="180" r="16" fill="#4a0b0e" stroke="#D71920" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="580" cy="180" r="5" fill="#D71920" stroke="#ffffff" strokeWidth="1.5" />

            {/* Callouts */}
            <polyline points="580,180 500,85 148,85" fill="none" stroke="#D71920" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="148" cy="85" r="4.5" fill="#D71920" stroke="#ffffff" strokeWidth="1.5" />

            <polyline points="360,132 360,240 180,240" fill="none" stroke="#00E5FF" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="180" cy="240" r="4.5" fill="#00E5FF" stroke="#000000" strokeWidth="2" />

            <polyline points="580,135 620,80 660,80" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="660" cy="80" r="4.5" fill="#F59E0B" stroke="#000000" strokeWidth="2" />

            <polyline points="580,230 620,240 660,240" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="660" cy="240" r="4.5" fill="#FFFFFF" stroke="#D71920" strokeWidth="1.5" />
          </g>
        );

      case 'industrial-fan':
        return (
          <g>
            {/* Fan Base & Mounting Skid */}
            <rect x="90" y="270" width="580" height="18" rx="2" fill="#15161c" stroke="#FFFFFF" strokeWidth="3" />

            {/* Scroll Casing (Centrifugal Fan) */}
            <path
              d="M 160 270 C 120 180, 160 80, 260 60 C 370 40, 440 100, 440 200 L 440 270 Z"
              fill="#181922"
              stroke="#FFFFFF"
              strokeWidth="3.5"
            />
            {/* Backward-Curved Impeller Wheel */}
            <circle cx="280" cy="180" r="85" fill="#1e1f2b" stroke="#71717a" strokeWidth="2" strokeDasharray="6 4" />
            <circle cx="280" cy="180" r="28" fill="#2e2f3d" stroke="#FFFFFF" strokeWidth="3" />
            <circle cx="280" cy="180" r="10" fill="#D71920" stroke="#ffffff" strokeWidth="2" />
            {/* Blades */}
            <path d="M 280 152 C 300 145 320 125 330 105" stroke="#E4E4E7" strokeWidth="3" fill="none" />
            <path d="M 308 180 C 330 185 350 175 365 155" stroke="#E4E4E7" strokeWidth="3" fill="none" />
            <path d="M 280 208 C 260 225 240 235 220 240" stroke="#E4E4E7" strokeWidth="3" fill="none" />
            <path d="M 252 180 C 235 170 215 160 200 140" stroke="#E4E4E7" strokeWidth="3" fill="none" />

            {/* Discharge Duct (Vertical) */}
            <rect x="360" y="30" width="80" height="70" fill="#1f202b" stroke="#FFFFFF" strokeWidth="3" />
            <rect x="350" y="22" width="100" height="12" fill="#252633" stroke="#FFFFFF" strokeWidth="2.5" />

            {/* Shaft & Dual Pillow Block Bearings to Right */}
            <line x1="280" y1="180" x2="590" y2="180" stroke="#FFFFFF" strokeWidth="6" />
            <rect x="440" y="165" width="35" height="45" fill="#252633" stroke="#FFFFFF" strokeWidth="2.5" />
            <rect x="520" y="165" width="35" height="45" fill="#252633" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="590" cy="180" r="25" fill="#181922" stroke="#FFFFFF" strokeWidth="3" />

            {/* Blade Pass Hotspot */}
            <circle cx="330" cy="120" r="14" fill="#4a0b0e" stroke="#D71920" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="330" cy="120" r="5" fill="#D71920" stroke="#ffffff" strokeWidth="1.5" />

            {/* Callouts */}
            <polyline points="330,120 260,85 148,85" fill="none" stroke="#D71920" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="148" cy="85" r="4.5" fill="#D71920" stroke="#ffffff" strokeWidth="1.5" />

            <polyline points="400,60 400,240 200,240" fill="none" stroke="#00E5FF" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="200" cy="240" r="4.5" fill="#00E5FF" stroke="#000000" strokeWidth="2" />

            <polyline points="455,165 490,80 560,80" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="560" cy="80" r="4.5" fill="#F59E0B" stroke="#000000" strokeWidth="2" />

            <polyline points="590,180 590,240 610,240" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="610" cy="240" r="4.5" fill="#FFFFFF" stroke="#D71920" strokeWidth="1.5" />
          </g>
        );

      case 'industrial-compressor':
        return (
          <g>
            {/* Heavy Baseplate */}
            <rect x="80" y="270" width="600" height="18" rx="2" fill="#15161c" stroke="#FFFFFF" strokeWidth="3" />

            {/* Cast Crankcase (Bottom Center) */}
            <polygon points="260,270 230,190 390,190 360,270" fill="#181922" stroke="#FFFFFF" strokeWidth="3.5" />
            <circle cx="310" cy="225" r="30" fill="#252633" stroke="#FFFFFF" strokeWidth="3" />
            <circle cx="325" cy="220" r="12" fill="#D71920" stroke="#ffffff" strokeWidth="2" />

            {/* Connecting Rod */}
            <line x1="325" y1="220" x2="310" y2="135" stroke="#FFFFFF" strokeWidth="5" />

            {/* Cylinder Block with Cooling Ribs */}
            <rect x="260" y="90" width="100" height="100" fill="#1e1f2b" stroke="#FFFFFF" strokeWidth="3" />
            {[105, 120, 135, 150, 165, 180].map((y, idx) => (
              <line key={idx} x1="250" y1={y} x2="370" y2={y} stroke="#71717a" strokeWidth="3" />
            ))}

            {/* Reciprocating Piston inside Cylinder */}
            <rect x="270" y="115" width="80" height="35" rx="3" fill="#2e2f3d" stroke="#D4D4D8" strokeWidth="2.5" />
            <line x1="272" y1="122" x2="348" y2="122" stroke="#D71920" strokeWidth="2" />

            {/* Cylinder Head with Reed Valve Chamber */}
            <rect x="250" y="55" width="120" height="35" rx="3" fill="#252633" stroke="#FFFFFF" strokeWidth="3.5" />
            {/* Air Receiver Tank (Right) */}
            <rect x="440" y="90" width="170" height="180" rx="25" fill="#181922" stroke="#FFFFFF" strokeWidth="3.5" />
            {/* Connecting Delivery Pipe */}
            <polyline points="370,72 410,72 410,140 440,140" fill="none" stroke="#00E5FF" strokeWidth="3" strokeDasharray="6 3" />

            {/* Valve Flutter Hotspot */}
            <circle cx="310" cy="65" r="14" fill="#4a0b0e" stroke="#D71920" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="310" cy="65" r="5" fill="#D71920" stroke="#ffffff" strokeWidth="1.5" />

            {/* Callouts */}
            <polyline points="310,65 240,85 148,85" fill="none" stroke="#D71920" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="148" cy="85" r="4.5" fill="#D71920" stroke="#ffffff" strokeWidth="1.5" />

            <polyline points="480,180 480,240 220,240" fill="none" stroke="#00E5FF" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="220" cy="240" r="4.5" fill="#00E5FF" stroke="#000000" strokeWidth="2" />

            <polyline points="350,70 410,70 560,70" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="560" cy="70" r="4.5" fill="#F59E0B" stroke="#000000" strokeWidth="2" />

            <polyline points="310,225 310,245 580,245" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="580" cy="245" r="4.5" fill="#FFFFFF" stroke="#D71920" strokeWidth="1.5" />
          </g>
        );

      case 'hydraulic-press':
        return (
          <g>
            {/* Press Base & Bed Bolster */}
            <rect x="140" y="270" width="480" height="20" rx="3" fill="#15161c" stroke="#FFFFFF" strokeWidth="3" />
            <rect x="220" y="240" width="320" height="30" fill="#252633" stroke="#D4D4D8" strokeWidth="2.5" />
            {/* Lower Die Cushion */}
            <rect x="270" y="215" width="220" height="25" fill="#1e1f2b" stroke="#00E5FF" strokeWidth="2" />

            {/* 4 Heavy Vertical Guide Tie-Rod Columns */}
            <rect x="160" y="40" width="32" height="230" fill="#181922" stroke="#FFFFFF" strokeWidth="3" />
            <rect x="568" y="40" width="32" height="230" fill="#181922" stroke="#FFFFFF" strokeWidth="3" />
            <line x1="176" y1="40" x2="176" y2="270" stroke="#71717a" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="584" y1="40" x2="584" y2="270" stroke="#71717a" strokeWidth="2" strokeDasharray="6 4" />

            {/* Heavy Upper Crown Casting */}
            <rect x="140" y="30" width="480" height="45" rx="4" fill="#181922" stroke="#FFFFFF" strokeWidth="3.5" />

            {/* Central Hydraulic Cylinder Housing */}
            <rect x="310" y="45" width="140" height="70" rx="3" fill="#252633" stroke="#FFFFFF" strokeWidth="3" />
            <line x1="380" y1="45" x2="380" y2="115" stroke="#D71920" strokeWidth="2" strokeDasharray="4 2" />

            {/* Piston Rod & Reciprocating Stamping Ram */}
            <rect x="355" y="115" width="50" height="40" fill="#D4D4D8" stroke="#FFFFFF" strokeWidth="2.5" />
            <rect x="250" y="155" width="260" height="45" rx="3" fill="#1f202b" stroke="#FFFFFF" strokeWidth="3.5" />
            {/* Upper Forging Tool Die */}
            <polygon points="270,200 490,200 460,215 300,215" fill="#D71920" stroke="#FFFFFF" strokeWidth="2" />

            {/* High Pressure Cylinder Gland Blowby Focal Hotspot */}
            <circle cx="380" cy="115" r="15" fill="#4a0b0e" stroke="#D71920" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="380" cy="115" r="5" fill="#D71920" stroke="#ffffff" strokeWidth="1.5" />

            {/* Callouts */}
            <polyline points="380,115 310,75 148,75" fill="none" stroke="#D71920" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="148" cy="75" r="4.5" fill="#D71920" stroke="#ffffff" strokeWidth="1.5" />

            <polyline points="310,80 230,80 180,240" fill="none" stroke="#00E5FF" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="180" cy="240" r="4.5" fill="#00E5FF" stroke="#000000" strokeWidth="2" />

            <polyline points="450,80 500,80 560,80" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="560" cy="80" r="4.5" fill="#F59E0B" stroke="#000000" strokeWidth="2" />

            <polyline points="405,175 480,240 580,240" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="580" cy="240" r="4.5" fill="#FFFFFF" stroke="#D71920" strokeWidth="1.5" />
          </g>
        );

      case 'asrs-system':
        return (
          <g>
            {/* High-Bay Storage Racks Left & Right */}
            {/* Left Rack Frame */}
            <rect x="80" y="40" width="180" height="240" rx="3" fill="#14151c" stroke="#2e2f3d" strokeWidth="2" />
            {[75, 115, 155, 195, 235].map((y, idx) => (
              <line key={`lr-${idx}`} x1="80" y1={y} x2="260" y2={y} stroke="#71717a" strokeWidth="1.5" />
            ))}
            {[140, 200].map((x, idx) => (
              <line key={`lc-${idx}`} x1={x} y1="40" x2={x} y2="280" stroke="#71717a" strokeWidth="1.5" />
            ))}

            {/* Right Rack Frame */}
            <rect x="500" y="40" width="180" height="240" rx="3" fill="#14151c" stroke="#2e2f3d" strokeWidth="2" />
            {[75, 115, 155, 195, 235].map((y, idx) => (
              <line key={`rr-${idx}`} x1="500" y1={y} x2="680" y2={y} stroke="#71717a" strokeWidth="1.5" />
            ))}
            {[560, 620].map((x, idx) => (
              <line key={`rc-${idx}`} x1={x} y1="40" x2={x} y2="280" stroke="#71717a" strokeWidth="1.5" />
            ))}

            {/* Center Crane Runway Rails */}
            <line x1="380" y1="30" x2="380" y2="290" stroke="#FFFFFF" strokeWidth="4" />
            <line x1="370" y1="30" x2="370" y2="290" stroke="#71717a" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="390" y1="30" x2="390" y2="290" stroke="#71717a" strokeWidth="2" strokeDasharray="4 4" />

            {/* Animated Stacker Carriage Assembly (Center) */}
            <rect x="330" y="130" width="100" height="60" rx="4" fill="#1f202b" stroke="#D71920" strokeWidth="3" />
            <line x1="340" y1="160" x2="420" y2="160" stroke="#00E5FF" strokeWidth="3" />
            <circle cx="380" cy="160" r="8" fill="#10B981" />
            {/* Telescopic Forks */}
            <rect x="290" y="152" width="40" height="12" rx="2" fill="#D4D4D8" stroke="#FFFFFF" strokeWidth="1.5" />
            <rect x="430" y="152" width="40" height="12" rx="2" fill="#D4D4D8" stroke="#FFFFFF" strokeWidth="1.5" />

            {/* Hotspot */}
            <circle cx="380" cy="160" r="14" fill="#4a0b0e" stroke="#D71920" strokeWidth="2" strokeDasharray="4 3" />

            {/* Callouts */}
            <polyline points="380,130 320,80 148,80" fill="none" stroke="#D71920" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="148" cy="80" r="4.5" fill="#D71920" stroke="#ffffff" strokeWidth="1.5" />

            <polyline points="290,158 240,158 200,240" fill="none" stroke="#00E5FF" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="200" cy="240" r="4.5" fill="#00E5FF" stroke="#000000" strokeWidth="2" />

            <polyline points="430,140 480,90 560,90" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="560" cy="90" r="4.5" fill="#F59E0B" stroke="#000000" strokeWidth="2" />

            <polyline points="430,170 480,240 580,240" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="580" cy="240" r="4.5" fill="#FFFFFF" stroke="#D71920" strokeWidth="1.5" />
          </g>
        );

      default:
        // Default: Centrifugal Pump Volute Casing & Electric Drive Motor
        return (
          <g>
            {/* Skid Base */}
            <rect x="70" y="270" width="620" height="16" rx="2" fill="#15161c" stroke="#FFFFFF" strokeWidth="3" />
            <rect x="100" y="286" width="45" height="18" fill="#1b1c24" stroke="#D4D4D8" strokeWidth="2.5" />
            <rect x="250" y="286" width="50" height="18" fill="#1b1c24" stroke="#D4D4D8" strokeWidth="2.5" />
            <rect x="450" y="286" width="50" height="18" fill="#1b1c24" stroke="#D4D4D8" strokeWidth="2.5" />
            <rect x="630" y="286" width="45" height="18" fill="#1b1c24" stroke="#D4D4D8" strokeWidth="2.5" />

            {/* Foundation Bolts */}
            <circle cx="122" cy="295" r="4.5" fill="#272732" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="275" cy="295" r="4.5" fill="#272732" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="475" cy="295" r="4.5" fill="#272732" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="652" cy="295" r="4.5" fill="#272732" stroke="#FFFFFF" strokeWidth="2.5" />

            {/* Centrifugal Volute Casing & Pump Body */}
            <path
              d="M 140 270 L 140 236 L 180 200 L 180 135 C 180 65 240 38 300 38 C 380 38 425 90 425 165 C 425 230 375 270 300 270 Z"
              fill="#161720"
              stroke="#FFFFFF"
              strokeWidth="3.5"
            />
            {/* Outer Volute Ring */}
            <circle cx="300" cy="165" r="88" fill="none" stroke="#71717a" strokeWidth="2.5" strokeDasharray="10 5" />
            <circle cx="300" cy="165" r="74" fill="#1b1c24" stroke="#FFFFFF" strokeWidth="3" />

            {/* Impeller Hub & Vanes */}
            <circle cx="300" cy="165" r="28" fill="#252633" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="300" cy="165" r="10" fill="#D71920" stroke="#ffffff" strokeWidth="2.5" />
            <path d="M 300 137 C 318 132 334 114 345 92" fill="none" stroke="#E4E4E7" strokeWidth="3" />
            <path d="M 324 151 C 342 155 364 150 376 134" fill="none" stroke="#E4E4E7" strokeWidth="3" />
            <path d="M 324 179 C 340 195 354 212 360 234" fill="none" stroke="#E4E4E7" strokeWidth="3" />
            <path d="M 300 193 C 288 215 270 230 250 236" fill="none" stroke="#E4E4E7" strokeWidth="3" />
            <path d="M 276 179 C 255 183 235 176 224 160" fill="none" stroke="#E4E4E7" strokeWidth="3" />
            <path d="M 276 151 C 265 133 252 120 234 108" fill="none" stroke="#E4E4E7" strokeWidth="3" />

            {/* Discharge Port (Top Vertical) */}
            <rect x="272" y="16" width="56" height="28" fill="#1b1c24" stroke="#FFFFFF" strokeWidth="3" />
            <rect x="260" y="10" width="80" height="10" fill="#252633" stroke="#FFFFFF" strokeWidth="3" />
            <circle cx="272" cy="15" r="2.5" fill="#ffffff" />
            <circle cx="328" cy="15" r="2.5" fill="#ffffff" />
            <line x1="300" y1="10" x2="300" y2="45" stroke="#D71920" strokeWidth="2.5" strokeDasharray="4 3" />

            {/* Suction Flange & Intake Piping (Left) */}
            <rect x="75" y="138" width="70" height="54" fill="#1b1c24" stroke="#FFFFFF" strokeWidth="3" />
            <rect x="64" y="130" width="14" height="70" fill="#252633" stroke="#FFFFFF" strokeWidth="3" />
            <line x1="75" y1="165" x2="145" y2="165" stroke="#00E5FF" strokeWidth="2.5" strokeDasharray="5 3" />

            {/* Coupling & Stuffing Box */}
            <rect x="420" y="132" width="50" height="66" fill="#1f202b" stroke="#FFFFFF" strokeWidth="3" />
            <rect x="470" y="142" width="36" height="46" rx="2" fill="#161720" stroke="#FFFFFF" strokeWidth="3" />

            {/* Drive Motor with Fins & Terminal Box */}
            <rect x="506" y="110" width="180" height="110" rx="4" fill="#181922" stroke="#FFFFFF" strokeWidth="3.5" />
            <rect x="686" y="118" width="25" height="94" rx="3" fill="#14151c" stroke="#FFFFFF" strokeWidth="3" />
            <line x1="524" y1="124" x2="672" y2="124" stroke="#8a8a9a" strokeWidth="3" />
            <line x1="524" y1="140" x2="672" y2="140" stroke="#8a8a9a" strokeWidth="3" />
            <line x1="524" y1="156" x2="672" y2="156" stroke="#8a8a9a" strokeWidth="3" />
            <line x1="524" y1="172" x2="672" y2="172" stroke="#8a8a9a" strokeWidth="3" />
            <line x1="524" y1="188" x2="672" y2="188" stroke="#8a8a9a" strokeWidth="3" />
            <rect x="555" y="90" width="56" height="20" rx="2" fill="#252633" stroke="#FFFFFF" strokeWidth="2.5" />

            {/* Pedestals */}
            <polygon points="536,220 524,270 564,270 558,220" fill="#1f202b" stroke="#FFFFFF" strokeWidth="3" />
            <polygon points="636,220 630,270 670,270 660,220" fill="#1f202b" stroke="#FFFFFF" strokeWidth="3" />

            {/* Cavitation Focal Zone */}
            <circle cx="258" cy="154" r="16" fill="#4a0b0e" stroke="#D71920" strokeWidth="3" strokeDasharray="4 3" />
            <circle cx="258" cy="154" r="6" fill="#D71920" stroke="#ffffff" strokeWidth="2" />

            {/* Leader Lines */}
            <polyline points="258,154 210,90 148,90" fill="none" stroke="#D71920" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="148" cy="90" r="4.5" fill="#D71920" stroke="#ffffff" strokeWidth="1.5" />

            <polyline points="108,165 108,230 156,242" fill="none" stroke="#00E5FF" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="108" cy="165" r="5" fill="#00E5FF" stroke="#000000" strokeWidth="2" />

            <polyline points="445,132 445,72 555,72" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="445" cy="132" r="5" fill="#F59E0B" stroke="#000000" strokeWidth="2" />

            <polyline points="585,210 585,248 605,248" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="4 3" />
            <circle cx="605" cy="248" r="4.5" fill="#FFFFFF" stroke="#D71920" strokeWidth="1.5" />
          </g>
        );
    }
  };

  // Get specific labels and units tailored to machine
  const getCalloutConfigs = () => {
    switch (profile) {
      case 'cnc-milling':
        return {
          c1Title: 'SPINDLE CHATTER & VIB',
          c1Icon: Volume2,
          c1Val: `${soundDb.toFixed(1)}`,
          c1Unit: 'dB(SPL)',
          c1Sub: 'Harmonic Peak: 3.82 kHz',
          c1Color: '#D71920',
          c2Title: '5-AXIS FEED & TRAVEL',
          c2Icon: Gauge,
          c2Val: '1,250',
          c2Unit: 'mm/min',
          c2Sub: 'XYZ Travel [120, 45, -82]',
          c2Color: '#00E5FF',
          c3Title: 'CERAMIC SPINDLE TEMP',
          c3Icon: Thermometer,
          c3Val: `${baseTemp.toFixed(1)}`,
          c3Unit: '°C',
          c3Sub: 'Spindle Limit 65°C [PT100]',
          c3Color: '#F59E0B',
          c4Title: 'ELECTRO-SPINDLE SPEED',
          c4Icon: RotateCw,
          c4Val: `${Math.floor(vfdRpm * 4.2).toLocaleString()}`,
          c4Unit: 'RPM',
          c4Sub: 'Ceramic Bearings 15k Rating',
          footerL: 'SPINDLE RUNOUT: 0.002mm | FEED: 1,250 mm/min',
          footerR: 'CHIP LOAD: 0.08mm/TOOTH • 5-AXIS PATH IN TOLERANCE',
        };

      case 'lathe-machine':
        return {
          c1Title: 'HEADSTOCK ACOUSTIC',
          c1Icon: Volume2,
          c1Val: `${soundDb.toFixed(1)}`,
          c1Unit: 'dB(SPL)',
          c1Sub: 'Carbide Billet Shear Peak',
          c1Color: '#D71920',
          c2Title: 'HYDRAULIC CHUCK CLAMP',
          c2Icon: Gauge,
          c2Val: '48.5',
          c2Unit: 'bar / 32 kN',
          c2Sub: 'Centrifugal Grip Locked',
          c2Color: '#00E5FF',
          c3Title: 'CARRIAGE FRICTION TEMP',
          c3Icon: Thermometer,
          c3Val: `${baseTemp.toFixed(1)}`,
          c3Unit: '°C',
          c3Sub: 'Slide Guide Friction Limit 60°C',
          c3Color: '#F59E0B',
          c4Title: 'TURNING SPINDLE SPEED',
          c4Icon: RotateCw,
          c4Val: `${vfdRpm.toLocaleString()}`,
          c4Unit: 'RPM',
          c4Sub: 'Constant Surface Speed 240 m/min',
          footerL: 'TURNING Ø: 120.4mm | CUT DEPTH: 1.8mm',
          footerR: 'SURFACE FINISH: Ra 0.8µm • HYDRO-CHUCK LOCKED',
        };

      case 'industrial-motor':
        return {
          c1Title: 'AIR-GAP ACOUSTIC WHINE',
          c1Icon: Volume2,
          c1Val: `${soundDb.toFixed(1)}`,
          c1Unit: 'dB(SPL)',
          c1Sub: 'Flux Dynamic Harmonic 120Hz',
          c1Color: '#D71920',
          c2Title: 'PHASE CURRENT & TORQUE',
          c2Icon: Gauge,
          c2Val: '142.8',
          c2Unit: 'A / 890 Nm',
          c2Sub: '3-Phase 415V Balance: 99.4%',
          c2Color: '#00E5FF',
          c3Title: 'STATOR WINDING TEMP',
          c3Icon: Thermometer,
          c3Val: `${baseTemp.toFixed(1)}`,
          c3Unit: '°C',
          c3Sub: 'Class H Thermal Limit 180°C',
          c3Color: '#F59E0B',
          c4Title: 'ROTOR DRIVE SPEED',
          c4Icon: RotateCw,
          c4Val: `${Math.floor(vfdRpm * 0.43).toLocaleString()}`,
          c4Unit: 'RPM',
          c4Sub: 'Rotor Slip 1.8% • 4-Pole 50Hz',
          footerL: 'POWER FACTOR: 0.88 | LOAD FACTOR: 92.4%',
          footerR: 'AIR GAP RUNOUT: ±0.03mm • CLASS H INSULATION NOMINAL',
        };

      case 'belt-conveyor':
        return {
          c1Title: 'HEAD PULLEY BEARING MIC',
          c1Icon: Volume2,
          c1Val: `${soundDb.toFixed(1)}`,
          c1Unit: 'dB(SPL)',
          c1Sub: 'Idler Roller Squeal Alert',
          c1Color: '#D71920',
          c2Title: 'BELT TENSION LOAD',
          c2Icon: Gauge,
          c2Val: '42.6',
          c2Unit: 'kN / 850 T/H',
          c2Sub: 'Counterweight Take-up Balanced',
          c2Color: '#00E5FF',
          c3Title: 'DRIVE PULLEY THERMAL',
          c3Icon: Thermometer,
          c3Val: `${baseTemp.toFixed(1)}`,
          c3Unit: '°C',
          c3Sub: 'Rubber Lagging Limit 80°C',
          c3Color: '#F59E0B',
          c4Title: 'HEAD PULLEY RPM',
          c4Icon: RotateCw,
          c4Val: `${Math.floor(vfdRpm * 0.08).toLocaleString()}`,
          c4Unit: 'RPM',
          c4Sub: 'Belt Linear Speed: 2.85 m/s',
          footerL: 'BELT SPEED: 2.85 m/s | THROUGHPUT: 850 T/H',
          footerR: 'TRACKING BIAS: 0.8mm • ZERO SLIP VERIFIED',
        };

      case 'industrial-fan':
        return {
          c1Title: 'BLADE PASS FREQUENCY',
          c1Icon: Volume2,
          c1Val: `${soundDb.toFixed(1)}`,
          c1Unit: 'dB(SPL)',
          c1Sub: 'BPF Fundamental Peak 196 Hz',
          c1Color: '#D71920',
          c2Title: 'STATIC DRAFT PRESSURE',
          c2Icon: Gauge,
          c2Val: '1.42',
          c2Unit: 'kPa / -850 Pa',
          c2Sub: 'Baghouse Negative Draft',
          c2Color: '#00E5FF',
          c3Title: 'PLUMMER BLOCK BEARING',
          c3Icon: Thermometer,
          c3Val: `${baseTemp.toFixed(1)}`,
          c3Unit: '°C',
          c3Sub: 'Spherical Roller RTD: Normal',
          c3Color: '#F59E0B',
          c4Title: 'EXHAUST FAN SPEED',
          c4Icon: RotateCw,
          c4Val: `${Math.floor(vfdRpm * 0.35).toLocaleString()}`,
          c4Unit: 'RPM',
          c4Sub: 'Air Volume 45,000 CFM',
          footerL: 'AIRFLOW: 45,000 CFM | STATIC HEAD: 1,420 Pa',
          footerR: 'BLADE PASS HARMONIC: 196 Hz • NEGATIVE DRAFT LOCKED',
        };

      case 'industrial-compressor':
        return {
          c1Title: 'VALVE CLICKING ACOUSTIC',
          c1Icon: Volume2,
          c1Val: `${soundDb.toFixed(1)}`,
          c1Unit: 'dB(SPL)',
          c1Sub: 'Reed Valve Flutter Detection',
          c1Color: '#D71920',
          c2Title: 'RECEIVER AIR PRESSURE',
          c2Icon: Gauge,
          c2Val: `${pressureDisc.toFixed(2)}`,
          c2Unit: 'bar / 122 psi',
          c2Sub: 'Dual Stage Compression 7.2:1',
          c2Color: '#00E5FF',
          c3Title: 'CYLINDER HEAD TEMP',
          c3Icon: Thermometer,
          c3Val: `${baseTemp.toFixed(1)}`,
          c3Unit: '°C',
          c3Sub: 'Intercooler Heat Rejection 32°C',
          c3Color: '#F59E0B',
          c4Title: 'COMPRESSOR STROKE RATE',
          c4Icon: RotateCw,
          c4Val: `${Math.floor(vfdRpm * 0.28).toLocaleString()}`,
          c4Unit: 'RPM',
          c4Sub: 'Mean Piston Speed 4.8 m/s',
          footerL: 'DISCHARGE FLOW: 18.5 m³/min | RECEIVER: 8.45 BAR',
          footerR: 'COMPRESSION RATIO: 7.2:1 • VALVES SYNCHRONIZED',
        };

      case 'hydraulic-press':
        return {
          c1Title: 'SERVO MANIFOLD ACOUSTIC',
          c1Icon: Volume2,
          c1Val: `${soundDb.toFixed(1)}`,
          c1Unit: 'dB(SPL)',
          c1Sub: 'Gland Blowby Noise Detected',
          c1Color: '#D71920',
          c2Title: 'MAIN CYLINDER PRESSURE',
          c2Icon: Gauge,
          c2Val: '318.0',
          c2Unit: 'bar (MAX 280)',
          c2Sub: 'Tonnage Clamping: 600 Tonnes',
          c2Color: '#00E5FF',
          c3Title: 'HYDRAULIC OIL TEMP',
          c3Icon: Thermometer,
          c3Val: `${baseTemp.toFixed(1)}`,
          c3Unit: '°C',
          c3Sub: 'Reservoir Fluid Limit: 70°C',
          c3Color: '#F59E0B',
          c4Title: 'PRESS CYCLE RATE',
          c4Icon: RotateCw,
          c4Val: '18',
          c4Unit: 'Strokes/min',
          c4Sub: 'Ram Travel: 450mm Stroke',
          footerL: 'RAM TONNAGE: 600 TONS | STROKE: 450mm',
          footerR: 'HYDRAULIC PRESSURE: 318 BAR • GLAND SEAL LEAKAGE WARNING',
        };

      case 'asrs-system':
        return {
          c1Title: 'HOIST ACOUSTIC SENSOR',
          c1Icon: Volume2,
          c1Val: `${soundDb.toFixed(1)}`,
          c1Unit: 'dB(SPL)',
          c1Sub: 'Mast Cable Tension Harmonic',
          c1Color: '#D71920',
          c2Title: 'HOIST TRAVEL VELOCITY',
          c2Icon: Gauge,
          c2Val: '4.50',
          c2Unit: 'm/s',
          c2Sub: 'Optical Barcode Track Synced',
          c2Color: '#00E5FF',
          c3Title: 'STACKER DRIVE TEMP',
          c3Icon: Thermometer,
          c3Val: `${baseTemp.toFixed(1)}`,
          c3Unit: '°C',
          c3Sub: 'Servo Drive Inverter: Nominal',
          c3Color: '#F59E0B',
          c4Title: 'STACKER HOIST SPEED',
          c4Icon: RotateCw,
          c4Val: `${vfdRpm.toLocaleString()}`,
          c4Unit: 'RPM',
          c4Sub: 'Position Repeatability: ±0.5mm',
          footerL: 'BAY OCCUPANCY: 94.2% | HOIST TRAVEL: 4.5 m/s',
          footerR: 'STACKER STATUS: NOMINAL • HIGH-BAY INTERLOCK VERIFIED',
        };

      default:
        // Centrifugal Pump
        return {
          c1Title: 'ACOUSTIC CAVITATION',
          c1Icon: Volume2,
          c1Val: `${soundDb.toFixed(1)}`,
          c1Unit: 'dB(SPL)',
          c1Sub: '+14.4 dB Critical Spike',
          c1Color: '#D71920',
          c2Title: 'HYDRAULIC PRESSURE',
          c2Icon: Gauge,
          c2Val: `${pressureDisc.toFixed(2)} bar`,
          c2Unit: `/ ${pressureSuct.toFixed(2)} bar`,
          c2Sub: 'Discharge vs Suction Head',
          c2Color: '#00E5FF',
          c3Title: 'BEARING THERMAL',
          c3Icon: Thermometer,
          c3Val: `${baseTemp.toFixed(1)}`,
          c3Unit: '°C',
          c3Sub: 'Overheating Limit 75°C',
          c3Color: '#F59E0B',
          c4Title: 'VFD CYCLE RATE',
          c4Icon: RotateCw,
          c4Val: `${vfdRpm.toLocaleString()}`,
          c4Unit: 'RPM',
          c4Sub: 'Drive Speed 100% Tip Vel.',
          footerL: `NET HEAD: ${(pressureDisc - pressureSuct).toFixed(2)} BAR | NPSHa: 2.1m (REQ: 3.0m)`,
          footerR: 'DEFICIT: -0.9m BELOW FLASH BOILING POINT',
        };
    }
  };

  const cfg = getCalloutConfigs();
  const Icon1 = cfg.c1Icon;
  const Icon2 = cfg.c2Icon;
  const Icon3 = cfg.c3Icon;
  const Icon4 = cfg.c4Icon;

  return (
    <div className="xl:col-span-8 bg-[#121218] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between border border-zinc-800 min-h-[500px] shadow-lg">
      {/* Stage Top Bar */}
      <div className="relative z-10 flex items-center justify-between pb-4 border-b border-zinc-800 font-mono text-sm">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold tracking-wider uppercase text-sm md:text-base">
            BLUEPRINT DIGITAL TWIN - KINEMATIC SCHEMATIC ({machine.name})
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        </div>
        <div className="flex items-center gap-2 text-zinc-400 text-xs">
          <span className="px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium">
            ISO VIEW • 2.5D CAD
          </span>
          <span className="px-3 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-emerald-400 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> 60 FPS LIVE
          </span>
        </div>
      </div>

      {/* Interactive Blueprint Graphic with Bold Line Art & Callout Badges */}
      <div className="relative w-full h-[370px] my-auto flex items-center justify-center p-2">
        <svg className="w-full h-full max-h-[360px] select-none" fill="none" viewBox="0 0 780 350">
          <defs>
            <pattern id="tech-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#252530" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="780" height="350" fill="url(#tech-grid)" opacity="0.65" />

          {/* Machine-Specific CAD Line Art */}
          {renderSchematicLineArt()}
        </svg>

        {/* 4 Overlay Callout Badges with High-Contrast Hardware Borders */}
        {/* 1. Top-Left Acoustic / Dynamic Sensor Badge */}
        <div className="absolute top-2 left-2 bg-[#0c0d10] border border-red-900/60 rounded-xl p-3.5 shadow-lg backdrop-blur-md max-w-[230px] z-20">
          <div className="flex items-center justify-between gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">
            <span>{cfg.c1Title}</span>
            <Icon1 className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-mono font-bold text-red-500 tracking-tight mt-1">
            <span>{cfg.c1Val}</span> <span className="text-sm text-zinc-400 font-normal">{cfg.c1Unit}</span>
          </div>
          <div className="text-xs font-mono text-zinc-300 mt-1.5 flex items-center gap-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-red-400">{cfg.c1Sub}</span>
          </div>
        </div>

        {/* 2. Bottom-Left Pressure / Load / Feed Badge */}
        <div className="absolute bottom-2 left-2 bg-[#0c0d10] border border-sky-900/60 rounded-xl p-3.5 shadow-lg backdrop-blur-md max-w-[240px] z-20">
          <div className="flex items-center justify-between gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">
            <span>{cfg.c2Title}</span>
            <Icon2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-base font-mono font-bold text-white tracking-tight mt-1.5">
            <span className="text-sky-400 text-xl">{cfg.c2Val}</span>{' '}
            <span className="text-amber-400 text-base">{cfg.c2Unit}</span>
          </div>
          <div className="text-xs font-mono text-zinc-400 mt-1">{cfg.c2Sub}</div>
        </div>

        {/* 3. Top-Right Thermal / Temperature Badge */}
        <div className="absolute top-2 right-2 bg-[#0c0d10] border border-amber-900/60 rounded-xl p-3.5 shadow-lg backdrop-blur-md max-w-[230px] z-20">
          <div className="flex items-center justify-between gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">
            <span>{cfg.c3Title}</span>
            <Icon3 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-mono font-bold text-amber-500 tracking-tight mt-1">
            <span>{cfg.c3Val}</span> <span className="text-sm text-zinc-400 font-normal">{cfg.c3Unit}</span>
          </div>
          <div className="text-xs font-mono text-amber-400 mt-1.5 flex items-center gap-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>{cfg.c3Sub}</span>
          </div>
        </div>

        {/* 4. Bottom-Right Cycle / RPM / Speed Badge */}
        <div className="absolute bottom-2 right-2 bg-[#0c0d10] border border-zinc-700 rounded-xl p-3.5 shadow-lg backdrop-blur-md max-w-[230px] z-20">
          <div className="flex items-center justify-between gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">
            <span>{cfg.c4Title}</span>
            <Icon4 className="w-4 h-4 text-white" />
          </div>
          <div className="text-2xl font-mono font-bold text-white tracking-tight mt-1">
            <span>{cfg.c4Val}</span> <span className="text-sm text-zinc-400 font-normal">{cfg.c4Unit}</span>
          </div>
          <div className="text-xs font-mono text-zinc-400 mt-1">{cfg.c4Sub}</div>
        </div>
      </div>

      {/* Stage Bottom Status Strip */}
      <div className="relative z-10 pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between text-sm font-mono gap-3">
        <div className="flex items-center gap-3">
          <span className="text-zinc-300 font-semibold">{cfg.footerL}</span>
        </div>
        <div className="text-amber-400 font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>{cfg.footerR}</span>
        </div>
      </div>
    </div>
  );
};

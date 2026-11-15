import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Volume2,
  Thermometer,
  Gauge,
  Cpu,
  Layers,
  ExternalLink,
  Code2,
  Shield,
  Radio,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const container = canvas?.parentElement;
      width = container ? container.clientWidth : window.innerWidth;
      height = container ? container.clientHeight : 580;
      if (canvas && ctx) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    }

    window.addEventListener('resize', resize);
    resize();

    // Particle system for dynamic fluid flow vectors
    const particleCount = 180;
    const particles = Array.from({ length: particleCount }).map(() => ({
      progress: Math.random(),
      speed: 0.002 + Math.random() * 0.0035,
      lane: (Math.random() - 0.5) * 24,
      size: 1 + Math.random() * 2,
      alpha: 0.2 + Math.random() * 0.7,
      type: Math.random() > 0.4 ? 'flow' : 'spark',
    }));

    let angleShaft = 0;
    let time = 0;

    function drawGrid(cx: number, cy: number, scale: number) {
      if (!ctx) return;
      ctx.save();
      ctx.strokeStyle = 'rgba(52, 53, 55, 0.35)';
      ctx.lineWidth = 1;

      const gridSize = 40 * scale;
      const startX = (cx % gridSize) - gridSize;
      const startY = (cy % gridSize) - gridSize;

      ctx.beginPath();
      for (let x = startX; x < width + gridSize; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = startY; y < height + gridSize; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Subtle reticle points at intersections near center
      ctx.fillStyle = 'rgba(215, 25, 32, 0.4)';
      const range = 4;
      for (let ix = -range; ix <= range; ix++) {
        for (let iy = -range; iy <= range; iy++) {
          if ((ix + iy) % 2 === 0) {
            const px = cx + ix * gridSize;
            const py = cy + iy * gridSize;
            ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
          }
        }
      }
      ctx.restore();
    }

    function drawSpurGear(
      cx: number,
      cy: number,
      radius: number,
      teeth: number,
      toothDepth: number,
      currentAngle: number,
      color: string,
      fillColor: string,
      holeRadius: number
    ) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(currentAngle);

      ctx.beginPath();
      const step = (Math.PI * 2) / teeth;
      const rOuter = radius + toothDepth;
      const rInner = radius - toothDepth;

      for (let i = 0; i < teeth; i++) {
        const a1 = i * step;
        const a2 = a1 + step * 0.25;
        const a3 = a1 + step * 0.5;
        const a4 = a1 + step * 0.75;
        const aNext = (i + 1) * step;

        const x1 = Math.cos(a1) * rInner;
        const y1 = Math.sin(a1) * rInner;
        const x2 = Math.cos(a2) * rOuter;
        const y2 = Math.sin(a2) * rOuter;
        const x3 = Math.cos(a3) * rOuter;
        const y3 = Math.sin(a3) * rOuter;
        const x4 = Math.cos(a4) * rInner;
        const y4 = Math.sin(a4) * rInner;

        if (i === 0) ctx.moveTo(x1, y1);
        else ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.lineTo(x4, y4);
        ctx.lineTo(Math.cos(aNext) * rInner, Math.sin(aNext) * rInner);
      }
      ctx.closePath();

      if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Pitch line circle
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 180, 171, 0.4)';
      ctx.stroke();
      ctx.setLineDash([]);

      // Gear Cutout Spokes / Lightening holes
      const spokeHoles = 5;
      const spokeDist = (radius + holeRadius) * 0.5;
      const holeSize = (radius - holeRadius) * 0.26;
      ctx.fillStyle = '#121315';
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;

      for (let h = 0; h < spokeHoles; h++) {
        const ha = (h * Math.PI * 2) / spokeHoles;
        const hx = Math.cos(ha) * spokeDist;
        const hy = Math.sin(ha) * spokeDist;
        ctx.beginPath();
        ctx.arc(hx, hy, holeSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Center Bore and Keyway
      ctx.beginPath();
      ctx.arc(0, 0, holeRadius, 0, Math.PI * 2);
      ctx.rect(-holeRadius * 0.25, -holeRadius * 1.3, holeRadius * 0.5, holeRadius * 0.7);
      ctx.fillStyle = '#121315';
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Center Hub Pin
      ctx.beginPath();
      ctx.arc(0, 0, holeRadius * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(215, 25, 32, 0.85)';
      ctx.fill();
      ctx.strokeStyle = '#ffece9';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();
    }

    function drawTurbineHousing(cx: number, cy: number, rOuter: number, rVolute: number, scale: number) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(cx, cy);

      ctx.beginPath();
      ctx.arc(0, 0, rOuter + 22 * scale, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(18, 19, 21, 0.9)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(93, 63, 60, 0.8)';
      ctx.lineWidth = 4 * scale;
      ctx.stroke();

      // Outer Flange Bolts Ring
      const boltCount = 18;
      const boltRadius = rOuter + 14 * scale;
      for (let b = 0; b < boltCount; b++) {
        const ba = (b * Math.PI * 2) / boltCount;
        const bx = Math.cos(ba) * boltRadius;
        const by = Math.sin(ba) * boltRadius;

        ctx.beginPath();
        ctx.arc(bx, by, 3 * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#292a2c';
        ctx.fill();
        ctx.strokeStyle = '#ad8884';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Volute Spiral Flow Inner Wall
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2; a += 0.05) {
        const radiusExp = rVolute + ((a / (Math.PI * 2)) * 32 * scale);
        const vx = Math.cos(a) * radiusExp;
        const vy = Math.sin(a) * radiusExp;
        if (a === 0) ctx.moveTo(vx, vy);
        else ctx.lineTo(vx, vy);
      }
      ctx.strokeStyle = '#d71920';
      ctx.lineWidth = 2.5 * scale;
      ctx.stroke();

      // Measurement Tick Arc Rings
      ctx.beginPath();
      ctx.setLineDash([2, 5]);
      ctx.arc(0, 0, rVolute - 10 * scale, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 180, 171, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.restore();
    }

    function drawCentrifugalImpeller(cx: number, cy: number, radius: number, blades: number, rotAngle: number, scale: number) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotAngle);

      const grad = ctx.createRadialGradient(0, 0, radius * 0.1, 0, 0, radius);
      grad.addColorStop(0, 'rgba(215, 25, 32, 0.25)');
      grad.addColorStop(0.7, 'rgba(69, 71, 71, 0.15)');
      grad.addColorStop(1, 'rgba(18, 19, 21, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();

      // Backward-curved Impeller Blades
      const step = (Math.PI * 2) / blades;
      for (let i = 0; i < blades; i++) {
        const baseA = i * step;

        ctx.save();
        ctx.rotate(baseA);

        ctx.beginPath();
        ctx.moveTo(radius * 0.28, 0);
        ctx.bezierCurveTo(
          radius * 0.45, radius * 0.22,
          radius * 0.72, radius * 0.42,
          radius * 0.98, radius * 0.2
        );
        ctx.bezierCurveTo(
          radius * 0.75, radius * 0.48,
          radius * 0.42, radius * 0.28,
          radius * 0.28, 0
        );
        ctx.fillStyle = 'rgba(255, 180, 171, 0.15)';
        ctx.fill();
        ctx.strokeStyle = '#ffb4ab';
        ctx.lineWidth = 2 * scale;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(radius * 0.98, radius * 0.2, 2.5 * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#d71920';
        ctx.fill();

        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.28, 0, Math.PI * 2);
      ctx.fillStyle = '#1f2022';
      ctx.fill();
      ctx.strokeStyle = '#ffb4ab';
      ctx.lineWidth = 2 * scale;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.14, 0, Math.PI * 2);
      ctx.fillStyle = '#d71920';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();
    }

    function drawPipeSystem(cx: number, cy: number, scale: number) {
      if (!ctx) return;
      ctx.save();
      ctx.lineWidth = 3 * scale;
      ctx.strokeStyle = 'rgba(198, 198, 199, 0.6)';

      const inX = cx - 260 * scale;
      const inY = cy;
      ctx.strokeRect(inX - 20 * scale, inY - 45 * scale, 20 * scale, 90 * scale);
      ctx.beginPath();
      ctx.moveTo(inX, inY - 35 * scale);
      ctx.lineTo(cx - 95 * scale, inY - 35 * scale);
      ctx.moveTo(inX, inY + 35 * scale);
      ctx.lineTo(cx - 95 * scale, inY + 35 * scale);
      ctx.stroke();

      const outX = cx + 80 * scale;
      const outY = cy - 230 * scale;
      ctx.strokeRect(outX - 45 * scale, outY - 20 * scale, 90 * scale, 20 * scale);
      ctx.beginPath();
      ctx.moveTo(outX - 35 * scale, outY);
      ctx.lineTo(outX - 35 * scale, cy - 85 * scale);
      ctx.moveTo(outX + 35 * scale, outY);
      ctx.lineTo(outX + 35 * scale, cy - 85 * scale);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(215, 25, 32, 0.4)';
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(inX, inY);
      ctx.lineTo(cx - 95 * scale, inY);
      ctx.moveTo(outX, outY);
      ctx.lineTo(outX, cy - 85 * scale);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.restore();
    }

    function drawFluidVectors(cx: number, cy: number, scale: number) {
      if (!ctx) return;
      ctx.save();
      for (const p of particles) {
        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;

        let px: number, py: number;
        if (p.progress < 0.45) {
          const norm = p.progress / 0.45;
          px = cx - 260 * scale + norm * (165 * scale);
          py = cy + p.lane * scale;
        } else if (p.progress < 0.8) {
          const norm = (p.progress - 0.45) / 0.35;
          const vortexRadius = (45 + norm * 85) * scale;
          const vortexAngle = norm * Math.PI * 3 + p.lane * 0.1;
          px = cx + Math.cos(vortexAngle) * vortexRadius;
          py = cy + Math.sin(vortexAngle) * vortexRadius;
        } else {
          const norm = (p.progress - 0.8) / 0.2;
          px = cx + (80 + p.lane * 0.8) * scale;
          py = cy - 85 * scale - norm * (145 * scale);
        }

        ctx.beginPath();
        if (p.type === 'spark') {
          ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 180, 171, ${p.alpha})`;
          ctx.fill();
        } else {
          ctx.arc(px, py, (p.size + 0.5) * scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(215, 25, 32, ${p.alpha * 0.9})`;
          ctx.fill();
        }
      }
      ctx.restore();
    }

    function drawPistonDriveLinkage(px: number, py: number, crankAngle: number, scale: number) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(px, py);

      const crankR = 52 * scale;
      const crankPinX = Math.cos(crankAngle) * crankR;
      const crankPinY = Math.sin(crankAngle) * crankR;

      ctx.beginPath();
      ctx.arc(0, 0, crankR + 10 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#1b1c1e';
      ctx.fill();
      ctx.strokeStyle = '#5d3f3c';
      ctx.lineWidth = 3 * scale;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, crankR + 6 * scale, crankAngle + Math.PI * 0.5, crankAngle + Math.PI * 1.5);
      ctx.fillStyle = 'rgba(215, 25, 32, 0.2)';
      ctx.fill();

      const conRodLength = 160 * scale;
      const sliderX = crankPinX + Math.sqrt(conRodLength * conRodLength - crankPinY * crankPinY);
      const sliderY = 0;

      ctx.beginPath();
      ctx.moveTo(crankPinX, crankPinY);
      ctx.lineTo(sliderX, sliderY);
      ctx.strokeStyle = '#e3e2e5';
      ctx.lineWidth = 5 * scale;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(crankPinX, crankPinY);
      ctx.lineTo(sliderX, sliderY);
      ctx.strokeStyle = '#d71920';
      ctx.lineWidth = 2 * scale;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(crankPinX, crankPinY, 6 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#ffb4ab';
      ctx.fill();

      ctx.fillStyle = '#292a2c';
      ctx.strokeStyle = '#ffb4ab';
      ctx.lineWidth = 2 * scale;
      ctx.fillRect(sliderX - 20 * scale, sliderY - 26 * scale, 45 * scale, 52 * scale);
      ctx.strokeRect(sliderX - 20 * scale, sliderY - 26 * scale, 45 * scale, 52 * scale);

      ctx.fillStyle = '#d71920';
      ctx.fillRect(sliderX + 2 * scale, sliderY - 26 * scale, 3 * scale, 52 * scale);
      ctx.fillRect(sliderX + 12 * scale, sliderY - 26 * scale, 3 * scale, 52 * scale);

      ctx.beginPath();
      ctx.moveTo(sliderX - 80 * scale, sliderY - 32 * scale);
      ctx.lineTo(sliderX + 90 * scale, sliderY - 32 * scale);
      ctx.moveTo(sliderX - 80 * scale, sliderY + 32 * scale);
      ctx.lineTo(sliderX + 90 * scale, sliderY + 32 * scale);
      ctx.strokeStyle = '#5d3f3c';
      ctx.lineWidth = 2 * scale;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(sliderX, sliderY, 5 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.restore();
    }

    function drawDialInstrument(cx: number, cy: number, radius: number, valueNorm: number, scale: number) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(cx, cy);

      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#1b1c1e';
      ctx.fill();
      ctx.strokeStyle = '#454747';
      ctx.lineWidth = 3 * scale;
      ctx.stroke();

      const startAngle = Math.PI * 0.75;
      const endAngle = Math.PI * 2.25;
      const totalTicks = 20;

      for (let i = 0; i <= totalTicks; i++) {
        const ta = startAngle + (i / totalTicks) * (endAngle - startAngle);
        const innerR = i % 5 === 0 ? radius - 10 * scale : radius - 6 * scale;
        const outerR = radius - 3 * scale;

        ctx.beginPath();
        ctx.moveTo(Math.cos(ta) * innerR, Math.sin(ta) * innerR);
        ctx.lineTo(Math.cos(ta) * outerR, Math.sin(ta) * outerR);
        ctx.strokeStyle = i > 15 ? '#d71920' : '#c6c6c7';
        ctx.lineWidth = i % 5 === 0 ? 2 : 1;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(0, 0, radius - 8 * scale, startAngle + (endAngle - startAngle) * 0.75, endAngle);
      ctx.strokeStyle = 'rgba(215, 25, 32, 0.7)';
      ctx.lineWidth = 3 * scale;
      ctx.stroke();

      const needleAngle = startAngle + valueNorm * (endAngle - startAngle);
      ctx.save();
      ctx.rotate(needleAngle);
      ctx.beginPath();
      ctx.moveTo(-radius * 0.15, 0);
      ctx.lineTo(0, -2 * scale);
      ctx.lineTo(radius * 0.78, 0);
      ctx.lineTo(0, 2 * scale);
      ctx.closePath();
      ctx.fillStyle = '#ffb4ab';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, 4 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#d71920';
      ctx.fill();
      ctx.restore();

      ctx.restore();
    }

    function render() {
      if (!ctx) return;
      time += 0.016;
      angleShaft += 0.038;

      const minDimension = Math.min(width, height);
      const scale = Math.max(minDimension / 620, 0.55);

      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.46;
      const cy = height * 0.52;

      drawGrid(cx, cy, scale);
      drawPipeSystem(cx, cy, scale);
      drawFluidVectors(cx, cy, scale);

      const impellerR = 110 * scale;
      drawTurbineHousing(cx, cy, impellerR * 1.25, impellerR * 0.95, scale);
      drawCentrifugalImpeller(cx, cy, impellerR, 8, angleShaft, scale);

      const gear1R = 64 * scale;
      const gear1X = cx + 180 * scale;
      const gear1Y = cy + 45 * scale;
      const gear1Teeth = 20;

      const gear2R = 40 * scale;
      const gear2X = gear1X + (gear1R + gear2R) * Math.cos(-Math.PI * 0.28);
      const gear2Y = gear1Y + (gear1R + gear2R) * Math.sin(-Math.PI * 0.28);
      const gear2Teeth = 13;

      const gear3R = 76 * scale;
      const gear3X = gear1X;
      const gear3Y = gear1Y + (gear1R + gear3R) * 0.92;
      const gear3Teeth = 24;

      drawSpurGear(gear1X, gear1Y, gear1R, gear1Teeth, 7 * scale, -angleShaft * 1.2, '#c6c6c7', '#1f2022', 18 * scale);
      const angleGear2 = (angleShaft * 1.2 * gear1Teeth) / gear2Teeth;
      drawSpurGear(gear2X, gear2Y, gear2R, gear2Teeth, 5 * scale, angleGear2 + 0.15, '#ffb4ab', '#292a2c', 12 * scale);
      const angleGear3 = (angleShaft * 1.2 * gear1Teeth) / gear3Teeth;
      drawSpurGear(gear3X, gear3Y, gear3R, gear3Teeth, 8 * scale, angleGear3 + 0.3, '#ad8884', '#1b1c1e', 22 * scale);

      const crankX = cx - 210 * scale;
      const crankY = cy + 180 * scale;
      drawPistonDriveLinkage(crankX, crankY, angleShaft * 1.5, scale);

      const dial1X = cx - 180 * scale;
      const dial1Y = cy - 170 * scale;
      const dial1Val = 0.58 + Math.sin(time * 3.2) * 0.18;
      drawDialInstrument(dial1X, dial1Y, 32 * scale, dial1Val, scale);

      const dial2X = cx + 220 * scale;
      const dial2Y = cy - 160 * scale;
      const dial2Val = 0.72 + Math.cos(time * 2.4) * 0.12;
      drawDialInstrument(dial2X, dial2Y, 26 * scale, dial2Val, scale);

      animFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div className="bg-[#121315] font-sans text-[#e3e2e5] antialiased selection:bg-[#d71920] selection:text-[#ffece9]">
      {/* GLOBAL HEADER */}
      <header className="fixed top-0 w-full z-50 bg-[#0d0e10]/95 backdrop-blur-xl border-b border-[#292a2c]/60 shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
        <div className="h-16 w-full px-4 sm:px-6 md:px-8 max-w-[1700px] mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d71920] shadow-[0_0_8px_#d71920] animate-pulse"></span>
            <span className="font-mono text-[18px] md:text-[20px] font-bold tracking-wider uppercase text-[#e3e2e5] select-none group-hover:text-white transition-colors">
              INDUSTRIALSENSE SCADA
            </span>
          </Link>

          <div className="flex items-center gap-3 font-mono text-xs">
            <Link
              to="/dashboard"
              className="px-4 py-1.5 rounded-xl bg-[#d71920] hover:bg-[#c00014] text-white font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(215,25,32,0.4)]"
            >
              <span>LAUNCH COCKPIT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="w-full pt-16 bg-[#121315] min-h-screen">
        <div className="flex flex-col w-full text-[#e3e2e5]">
          {/* HERO SECTION */}
          <section className="relative w-full px-4 sm:px-6 md:px-8 pt-12 pb-8 overflow-hidden">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-gradient-to-b from-[#d71920]/10 via-transparent to-transparent blur-3xl pointer-events-none -z-10"></div>
            <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
              {/* Hero Headline */}
              <h1 className="font-ndot-57 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-[#e3e2e5] max-w-5xl mb-4 leading-tight">
                AUTONOMOUS INDUSTRIAL TELEMETRY &amp; <span className="text-[#ffb4ab]">DIGITAL TWIN SCADA</span>.
              </h1>

              {/* Subheading */}
              <p className="font-ntype-mono text-sm sm:text-base md:text-lg text-[#c6c6c7] max-w-3xl mb-8 leading-relaxed">
                Autonomous edge telemetry, real-time kinematics, and physics-driven digital twin cockpits. High-speed acoustic cavitation diagnostics, multi-modal sensor streams, and SIL-4 safety interlocks.
              </p>

              {/* CTA Group */}
              <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-xs">
                <a
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#d71920] text-[#ffece9] uppercase hover:bg-[#c00014] transition-all duration-200 shadow-md font-bold"
                  href="#cockpit"
                >
                  <span>INSPECT 2D SCADA TWIN</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1b1c1e] border border-[#d71920]/40 text-[#ffb4ab] uppercase hover:bg-[#292a2c] transition-all duration-200 shadow-sm font-bold"
                >
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>OPEN SCADA COCKPIT</span>
                </Link>
                <Link
                  to="/analytics"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#292a2c] text-[#e3e2e5] uppercase hover:bg-[#38393b] transition-all duration-200 shadow-sm font-bold"
                >
                  <span>DEEP ANALYTICS</span>
                </Link>
              </div>
            </div>
          </section>

          {/* 2D TECHNICAL MACHINE ANIMATION VIEWPORT */}
          <section className="w-full px-4 sm:px-6 md:px-8 pb-12" id="cockpit">
            <div className="max-w-7xl mx-auto relative rounded-3xl bg-[#1b1c1e] shadow-2xl overflow-hidden p-3 border border-[#292a2c]">
              <div
                className="relative w-full h-[580px] rounded-2xl bg-[#121315] flex items-center justify-center overflow-hidden border border-[#343537]/60 shadow-2xl select-none"
                id="canvas-container"
              >
                <canvas ref={canvasRef} className="w-full h-full block" id="stage"></canvas>
              </div>
            </div>
          </section>

          {/* PLATFORM CAPABILITIES GRID (3 HIGH-TECH BENTO CARDS) */}
          <section className="w-full px-4 sm:px-6 md:px-8 py-16 bg-[#0d0e10]">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
              {/* Section Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="font-ndot-55 text-xs uppercase text-[#ffb4ab] tracking-widest font-bold block mb-1">
                    [SCADA ARCHITECTURE PILLARS]
                  </span>
                  <h2 className="font-ntype text-2xl md:text-3xl font-bold uppercase text-[#e3e2e5] tracking-tight">
                    HIGH-FIDELITY TELEMETRY &amp; DIGITAL TWIN
                  </h2>
                </div>
                <p className="font-ntype-mono text-xs md:text-sm text-[#c6c6c7] max-w-md leading-relaxed">
                  Enterprise-grade machine intelligence combining high-frequency acoustic analysis, mathematical twin kinematics, and SIL-4 safety interlocks.
                </p>
              </div>

              {/* Bento Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
                {/* CARD 1: ACOUSTIC FFT & ULTRASONIC RUL */}
                <div className="w-full rounded-3xl bg-[#1f2022] p-6 flex flex-col justify-between shadow-md relative group hover:bg-[#292a2c] transition-colors duration-200 border border-[#292a2c]">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2.5 py-1 rounded-full bg-[#343537] text-[#c6c6c7] text-xs uppercase font-bold">
                        MODALITY 01 - FFT SPECTRUM
                      </span>
                      <Volume2 className="text-[#ffb4ab] w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-[#e3e2e5] uppercase mb-2 leading-tight">
                      HIGH-FREQUENCY ACOUSTIC FFT &amp; ULTRASONIC RUL
                    </h3>
                    <p className="text-xs text-[#c6c6c7] mb-4 font-sans leading-relaxed">
                      Acoustic spectrum analysis identifying cavitation collapse micro-bursts before impeller destruction with 4.2h predictive lead time tested on lab water loop.
                    </p>
                  </div>

                  {/* Inline FFT Chart Mockup */}
                  <div className="w-full rounded-2xl bg-[#0d0e10] p-4 flex flex-col gap-2 border border-[#292a2c]">
                    <div className="flex justify-between items-center text-[#c6c6c7] text-[10px]">
                      <span>FREQUENCY HARMONICS (100kHz)</span>
                      <span className="text-[#ffb4ab] font-bold">LAB ANOMALY CONFIRMED</span>
                    </div>
                    <svg className="w-full h-16 text-[#d71920] stroke-current fill-none" preserveAspectRatio="none" viewBox="0 0 320 64">
                      <path d="M0,45 L20,44 L40,46 L60,42 L80,48 L100,30 L110,12 L115,58 L120,4 L125,52 L130,22 L140,44 L160,43 L180,45 L200,43 L220,45 L240,40 L260,46 L280,44 L300,45 L320,44" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                    <div className="flex justify-between items-center text-[10px] text-[#c6c6c7] pt-1">
                      <span>PREDICTIVE LEAD-TIME: <strong className="text-[#e3e2e5]">4.2 HOURS</strong></span>
                      <span>MODEL ACCURACY: <strong className="text-[#e3e2e5]">99.4%</strong></span>
                    </div>
                  </div>
                </div>

                {/* CARD 2: ASRS DIGITAL TWIN & REAL-TIME KINEMATICS */}
                <div className="w-full rounded-3xl bg-[#1f2022] p-6 flex flex-col justify-between shadow-md relative group hover:bg-[#292a2c] transition-colors duration-200 border border-[#292a2c]">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2.5 py-1 rounded-full bg-[#343537] text-[#c6c6c7] text-xs uppercase font-bold">
                        RESEARCH_02 - KINEMATICS
                      </span>
                      <Cpu className="text-[#e3e2e5] w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-[#e3e2e5] uppercase mb-2 leading-tight">
                      ASRS DIGITAL TWIN &amp; REAL-TIME KINEMATICS
                    </h3>
                    <p className="text-xs text-[#c6c6c7] mb-4 font-sans leading-relaxed">
                      Sub-millimeter scale-model crane positioning, optical barcode alignment, and synchronized dynamic vector tracking at 60 FPS in Three.js &amp; ROS2.
                    </p>
                  </div>

                  {/* Position Vector Display */}
                  <div className="w-full rounded-2xl bg-[#0d0e10] p-4 flex flex-col gap-2 border border-[#292a2c]">
                    <div className="flex justify-between items-center text-[#c6c6c7] text-[10px]">
                      <span>SCALE VECTOR [X, Y, Z]</span>
                      <span className="text-[#22c55e] font-bold">SYNCED (0.18mm)</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 py-1 text-center text-[10px]">
                      <div className="p-2 rounded-xl bg-[#1f2022]">
                        <span className="text-[#c6c6c7] block">POS_X</span>
                        <span className="text-xs text-[#e3e2e5] font-bold">1.42m</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#1f2022]">
                        <span className="text-[#c6c6c7] block">POS_Y</span>
                        <span className="text-xs text-[#e3e2e5] font-bold">0.85m</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#1f2022]">
                        <span className="text-[#c6c6c7] block">VEL_Z</span>
                        <span className="text-xs text-[#ffb4ab] font-bold">0.32m/s</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-[#c6c6c7] pt-1">
                      <span>VISION ALIGNMENT: <strong className="text-[#e3e2e5]">LOCKED</strong></span>
                      <span>TEST CARRIAGE: <strong className="text-[#e3e2e5]">RIG-BAY-02</strong></span>
                    </div>
                  </div>
                </div>

                {/* CARD 3: SIL-4 SAFETY INTERLOCK */}
                <div className="w-full rounded-3xl bg-[#1f2022] p-6 flex flex-col justify-between shadow-md relative group hover:bg-[#292a2c] transition-colors duration-200 border border-[#292a2c]">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2.5 py-1 rounded-full bg-red-900/60 text-red-200 text-xs uppercase font-bold">
                        RESEARCH_03 - SAFETY PROTOTYPE
                      </span>
                      <Shield className="text-[#ffb4ab] w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-[#e3e2e5] uppercase mb-2 leading-tight">
                      SAFETY INTEGRITY LEVEL 4 (SIL-4 / CAT 4) INTERLOCK
                    </h3>
                    <p className="text-xs text-[#c6c6c7] mb-4 font-sans leading-relaxed">
                      Lab-built hardware emergency stop trigger with automated multi-zone pneumatic/solenoid isolation protocols operating under 12 milliseconds.
                    </p>
                  </div>

                  {/* Interlock Control Status Box */}
                  <div className="w-full rounded-2xl bg-[#0d0e10] p-4 flex flex-col gap-2 border border-[#292a2c]">
                    <div className="flex justify-between items-center text-[#c6c6c7] text-[10px]">
                      <span>LAB HARDWARE INTERLOCK</span>
                      <span className="text-[#d71920] font-bold">ARMED / TESTBED</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#1f2022]">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#d71920] animate-pulse"></span>
                        <span className="text-[10px] text-[#e3e2e5] uppercase font-bold">PNEUMATIC VALVE RIG</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#343537] text-[#c6c6c7]">
                        LAB-CERT 2025
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-[#c6c6c7] pt-1">
                      <span>TRIP LATENCY: <strong className="text-[#e3e2e5]">11.8ms</strong></span>
                      <span>FAILSAFE STATUS: <strong className="text-[#22c55e]">VERIFIED</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* BENEFITS OF THIS SYSTEM // AUTONOMOUS SCADA ADVANTAGES */}
          <section className="w-full px-4 sm:px-6 md:px-8 py-16 bg-[#121315]" id="benefits">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 font-mono">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-[#292a2c]/70 pb-4">
                <div>
                  <span className="font-ndot-55 text-xs uppercase text-[#ffb4ab] tracking-widest font-bold">[AUTONOMOUS INDUSTRIAL ARCHITECTURE]</span>
                  <h2 className="font-ntype text-xl md:text-2xl font-bold uppercase text-[#e3e2e5] tracking-tight mt-1">
                    BENEFITS OF THIS SYSTEM - AUTONOMOUS SCADA ADVANTAGES
                  </h2>
                </div>
                <span className="font-ntype-mono text-xs text-[#c6c6c7]">VERIFIED BENCHMARKS • INDUSTRIAL TELEMETRY</span>
              </div>

              {/* 4 Core Bento Industrial Benefit Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* BENEFIT 01 */}
                <div className="rounded-3xl bg-[#1b1c1e] p-6 flex flex-col justify-between shadow-lg border border-[#292a2c] relative overflow-hidden group hover:border-[#d71920] transition-all">
                  <div className="absolute -right-4 -bottom-4 text-[#343537]/30 text-[80px] font-bold select-none pointer-events-none">01</div>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-[#ffb4ab] font-bold">[ 01 ]</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#d71920] animate-ping"></span>
                    </div>
                    <h3 className="text-base text-[#e3e2e5] uppercase mb-2 leading-snug font-bold">
                      PREDICTIVE FAILURE MITIGATION
                    </h3>
                    <p className="text-xs text-[#c6c6c7] font-sans leading-relaxed mb-6">
                      Real-time ultrasonic acoustic FFT &amp; ML detect micro-fractures <strong>4.2 hours prior to catastrophic failure</strong>, completely eliminating unscheduled downtime.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#343537]/40 flex items-center justify-between text-[#c6c6c7] text-[10px]">
                    <span>LEAD TIME: <strong className="text-[#e3e2e5]">4.2H EARLY</strong></span>
                    <span className="text-[#22c55e]">FFT 100kHz</span>
                  </div>
                </div>

                {/* BENEFIT 02 */}
                <div className="rounded-3xl bg-[#1b1c1e] p-6 flex flex-col justify-between shadow-lg border border-[#292a2c] relative overflow-hidden group hover:border-[#d71920] transition-all">
                  <div className="absolute -right-4 -bottom-4 text-[#343537]/30 text-[80px] font-bold select-none pointer-events-none">02</div>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-[#ffb4ab] font-bold">[ 02 ]</span>
                      <span className="px-2 py-0.5 rounded bg-[#d71920] text-white text-[10px] font-bold">SIL-4</span>
                    </div>
                    <h3 className="text-base text-[#e3e2e5] uppercase mb-2 leading-snug font-bold">
                      SUB-5MS HARDWARE INTERLOCK
                    </h3>
                    <p className="text-xs text-[#c6c6c7] font-sans leading-relaxed mb-6">
                      Instantaneous deterministic SIL-4 / Cat-4 hardware bus disconnection prevents equipment destruction and operator injury under extreme runaway loads.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#343537]/40 flex items-center justify-between text-[#c6c6c7] text-[10px]">
                    <span>TRIP LATENCY: <strong className="text-[#e3e2e5]">&lt;4.8ms</strong></span>
                    <span className="text-[#d71920] font-bold">FAIL-SAFE</span>
                  </div>
                </div>

                {/* BENEFIT 03 */}
                <div className="rounded-3xl bg-[#1b1c1e] p-6 flex flex-col justify-between shadow-lg border border-[#292a2c] relative overflow-hidden group hover:border-[#d71920] transition-all">
                  <div className="absolute -right-4 -bottom-4 text-[#343537]/30 text-[80px] font-bold select-none pointer-events-none">03</div>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-[#ffb4ab] font-bold">[ 03 ]</span>
                      <Layers className="text-[#c6c6c7] w-5 h-5" />
                    </div>
                    <h3 className="text-base text-[#e3e2e5] uppercase mb-2 leading-snug font-bold">
                      DIGITAL TWIN FIDELITY
                    </h3>
                    <p className="text-xs text-[#c6c6c7] font-sans leading-relaxed mb-6">
                      Continuous telemetry synchronization ensures millisecond kinematic digital twin parity with actual shop-floor actuators and robotic end-effectors.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#343537]/40 flex items-center justify-between text-[#c6c6c7] text-[10px]">
                    <span>REFRESH RATE: <strong className="text-[#e3e2e5]">60 FPS WEBGL</strong></span>
                    <span className="text-[#22c55e]">±0.001mm</span>
                  </div>
                </div>

                {/* BENEFIT 04 */}
                <div className="rounded-3xl bg-[#1b1c1e] p-6 flex flex-col justify-between shadow-lg border border-[#292a2c] relative overflow-hidden group hover:border-[#d71920] transition-all">
                  <div className="absolute -right-4 -bottom-4 text-[#343537]/30 text-[80px] font-bold select-none pointer-events-none">04</div>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-[#ffb4ab] font-bold">[ 04 ]</span>
                      <Shield className="text-[#c6c6c7] w-5 h-5" />
                    </div>
                    <h3 className="text-base text-[#e3e2e5] uppercase mb-2 leading-snug font-bold">
                      100% AUDITABLE ZERO-TRUST
                    </h3>
                    <p className="text-xs text-[#c6c6c7] font-sans leading-relaxed mb-6">
                      Tamper-proof telemetry ingest bus with end-to-end cryptographic integrity verification across all distributed edge nodes and industrial PLCs.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#343537]/40 flex items-center justify-between text-[#c6c6c7] text-[10px]">
                    <span>PROTOCOL: <strong className="text-[#e3e2e5]">OPC-UA / TLS</strong></span>
                    <span className="text-[#e3e2e5]">ZERO-LOSS</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* DEVELOPERS & RESEARCH TEAM: 5 HANGING INDUSTRIAL MACHINERY TOOL CARDS */}
          <section className="w-full px-4 sm:px-6 md:px-8 py-16 bg-[#0d0e10] border-t border-[#343537]" id="dev-team">
            <div className="max-w-7xl mx-auto flex flex-col gap-10 font-mono">
              {/* Section Header with Industrial Workshop Aesthetic */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#343537] pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-ndot-55 px-2 py-0.5 rounded-full bg-[#d71920] text-[#ffece9] text-[10px] uppercase font-bold">
                      [ 05 - RESEARCH CREW ]
                    </span>
                    <span className="font-ntype-mono text-[10px] text-[#c6c6c7] uppercase">OVERHEAD RIG BALANCER RACK</span>
                  </div>
                  <h2 className="font-ntype text-xl md:text-2xl font-bold uppercase text-[#e3e2e5] tracking-tight">
                    PROJECT DEVELOPERS &amp; RESEARCH TEAM
                  </h2>
                </div>
                <p className="font-ntype-mono text-xs text-[#c6c6c7] max-w-md leading-relaxed">
                  The engineering core specializing in Embedded Systems, Machine Learning, Signal Processing, and Distributed SCADA Telemetry.
                </p>
              </div>

              {/* Overhead Heavy Steel Rigging Gantry & Tool Balancers */}
              <div className="relative w-full">
                {/* Top Heavy Structural Steel I-Beam Rail */}
                <div className="w-full h-5 rounded bg-gradient-to-r from-[#292a2c] via-[#343537] to-[#292a2c] border-y-2 border-[#5d3f3c] flex items-center justify-around px-8 shadow-2xl relative">
                  <div className="absolute inset-x-0 h-0.5 bg-[#ffb4ab]/20 top-1/2 -translate-y-1/2"></div>
                  {/* 5 Heavy Roller Trolley Mounts */}
                  <div className="w-6 h-6 rounded-md bg-[#1b1c1e] border-2 border-[#ad8884] shadow-md flex items-center justify-center z-10">
                    <div className="w-2 h-2 rounded-full bg-[#d71920]"></div>
                  </div>
                  <div className="w-6 h-6 rounded-md bg-[#1b1c1e] border-2 border-[#ad8884] shadow-md flex items-center justify-center z-10">
                    <div className="w-2 h-2 rounded-full bg-[#d71920]"></div>
                  </div>
                  <div className="w-6 h-6 rounded-md bg-[#1b1c1e] border-2 border-[#ad8884] shadow-md flex items-center justify-center z-10">
                    <div className="w-2 h-2 rounded-full bg-[#d71920]"></div>
                  </div>
                  <div className="w-6 h-6 rounded-md bg-[#1b1c1e] border-2 border-[#ad8884] shadow-md flex items-center justify-center z-10">
                    <div className="w-2 h-2 rounded-full bg-[#d71920]"></div>
                  </div>
                  <div className="w-6 h-6 rounded-md bg-[#1b1c1e] border-2 border-[#ad8884] shadow-md flex items-center justify-center z-10">
                    <div className="w-2 h-2 rounded-full bg-[#d71920]"></div>
                  </div>
                </div>

                {/* 5 Hanging Machinery Tool Shaped Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-0">
                  {/* TOOL 1: TORQUE WRENCH (Aarav Sharma) */}
                  <div className="flex flex-col items-center sway-tool-1 group cursor-pointer">
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-7 rounded-lg bg-[#343537] border border-[#ad8884] flex items-center justify-center shadow-inner mt-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#d71920]"></div>
                      </div>
                      <div className="w-0.5 h-10 border-l-2 border-dashed border-[#5d3f3c] group-hover:border-[#ffb4ab] transition-colors"></div>
                      <div className="w-4 h-6 rounded-full border-2 border-[#ad8884] bg-[#292a2c] flex items-center justify-center -mb-2 z-10 shadow-sm group-hover:border-[#ffb4ab] group-hover:bg-[#d71920] transition-all">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0d0e10]"></div>
                      </div>
                    </div>

                    <div className="w-full rounded-2xl bg-[#1f2022] border-2 border-[#343537] p-4 flex flex-col justify-between shadow-2xl relative group-hover:border-[#ffb4ab] transition-all duration-300 transform group-hover:scale-[1.02]">
                      <div className="absolute -left-1 top-10 w-1.5 h-12 bg-[#343537] rounded-r"></div>
                      <div className="absolute -right-1 top-10 w-1.5 h-12 bg-[#343537] rounded-l"></div>
                      <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-[#ad8884]"></div>
                      <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#ad8884]"></div>
                      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-[#ad8884]"></div>
                      <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-[#ad8884]"></div>

                      <div>
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#343537]/60">
                          <span className="text-[10px] text-[#ffb4ab] uppercase font-bold">[TOOL_01]</span>
                          <span className="text-xs text-[#c6c6c7] group-hover:text-[#ffb4ab] transition-colors">⚙</span>
                        </div>
                        <div className="w-full py-1 px-2 rounded-lg bg-[#0d0e10] border border-[#343537] flex items-center justify-between mb-2 text-[#e3e2e5]">
                          <span className="text-[10px] text-[#c6c6c7]">TORQUE: 240 Nm</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
                        </div>
                        <h3 className="text-sm font-bold leading-tight text-[#e3e2e5] uppercase mb-0.5">PIYUSH KUMAR PAL</h3>
                        <span className="text-[10px] text-[#ffb4ab] uppercase block mb-3 font-semibold">TEAM LEADER</span>
                      </div>

                      <div className="pt-2 border-t border-[#343537]/50">
                        <div className="text-[10px] text-[#c6c6c7] mb-2 flex items-center justify-between">
                          <span>CORE: <strong className="text-[#e3e2e5]">LEAD</strong></span>
                          <span className="px-1.5 py-0.5 rounded bg-red-900/60 text-red-200 text-[9px] font-bold">TEAM LEADER</span>
                        </div>
                        <a
                          className="w-full py-1.5 rounded-lg bg-[#1b1c1e] hover:bg-[#292a2c] text-[#e3e2e5] text-center border border-[#343537] uppercase text-[10px] flex items-center justify-center gap-1 transition-colors"
                          href="https://github.com/123priyanshu123/INDUSTRIAL-SENSE"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Code2 className="w-3 h-3" /> GITHUB REPO
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* TOOL 2: MULTIMETER (Devraj Patel) */}
                  <div className="flex flex-col items-center sway-tool-2 group cursor-pointer">
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-7 rounded-lg bg-[#343537] border border-[#ad8884] flex items-center justify-center shadow-inner mt-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#d71920]"></div>
                      </div>
                      <div className="w-0.5 h-10 border-l-2 border-dashed border-[#5d3f3c] group-hover:border-[#ffb4ab] transition-colors"></div>
                      <div className="w-4 h-6 rounded-full border-2 border-[#ad8884] bg-[#292a2c] flex items-center justify-center -mb-2 z-10 shadow-sm group-hover:border-[#ffb4ab] group-hover:bg-[#d71920] transition-all">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0d0e10]"></div>
                      </div>
                    </div>

                    <div className="w-full rounded-2xl bg-[#1f2022] border-2 border-[#343537] p-4 flex flex-col justify-between shadow-2xl relative group-hover:border-[#ffb4ab] transition-all duration-300 transform group-hover:scale-[1.02]">
                      <div className="absolute -top-1.5 left-4 flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-600 border border-black"></div>
                        <div className="w-2 h-2 rounded-full bg-neutral-800 border border-black"></div>
                      </div>
                      <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-[#ad8884]"></div>
                      <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#ad8884]"></div>
                      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-[#ad8884]"></div>
                      <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-[#ad8884]"></div>

                      <div>
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#343537]/60">
                          <span className="text-[10px] text-[#ffb4ab] uppercase font-bold">[TOOL_02]</span>
                          <span className="text-xs text-[#c6c6c7] group-hover:text-[#ffb4ab] transition-colors">⚡</span>
                        </div>
                        <div className="w-full py-1 px-2 rounded-lg bg-[#0d0e10] border border-[#343537] flex items-center justify-between mb-2 text-[#e3e2e5]">
                          <span className="text-[10px] text-[#c6c6c7]">PROBE: 24V DC MODBUS</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
                        </div>
                        <h3 className="text-sm font-bold leading-tight text-[#e3e2e5] uppercase mb-0.5">MANSI SINGH</h3>
                        <span className="text-[10px] text-[#ffb4ab] uppercase block mb-3 font-semibold">AI AUTOMATOR</span>
                      </div>

                      <div className="pt-2 border-t border-[#343537]/50">
                        <div className="text-[10px] text-[#c6c6c7] mb-2 flex items-center justify-between">
                          <span>CORE: <strong className="text-[#e3e2e5]">AI / ML</strong></span>
                          <span className="px-1.5 py-0.5 rounded bg-[#343537] text-[9px] text-[#e3e2e5]">AUTOMATION</span>
                        </div>
                        <a
                          className="w-full py-1.5 rounded-lg bg-[#1b1c1e] hover:bg-[#292a2c] text-[#e3e2e5] text-center border border-[#343537] uppercase text-[10px] flex items-center justify-center gap-1 transition-colors"
                          href="https://github.com/123priyanshu123/INDUSTRIAL-SENSE"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Code2 className="w-3 h-3" /> GITHUB REPO
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* TOOL 3: ACOUSTIC PROBE (Sanya Verma) */}
                  <div className="flex flex-col items-center sway-tool-3 group cursor-pointer">
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-7 rounded-lg bg-[#343537] border border-[#ad8884] flex items-center justify-center shadow-inner mt-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#d71920]"></div>
                      </div>
                      <div className="w-0.5 h-10 border-l-2 border-dashed border-[#5d3f3c] group-hover:border-[#ffb4ab] transition-colors"></div>
                      <div className="w-4 h-6 rounded-full border-2 border-[#ad8884] bg-[#292a2c] flex items-center justify-center -mb-2 z-10 shadow-sm group-hover:border-[#ffb4ab] group-hover:bg-[#d71920] transition-all">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0d0e10]"></div>
                      </div>
                    </div>

                    <div className="w-full rounded-2xl bg-[#1f2022] border-2 border-[#343537] p-4 flex flex-col justify-between shadow-2xl relative group-hover:border-[#ffb4ab] transition-all duration-300 transform group-hover:scale-[1.02]">
                      <div className="absolute -right-1 top-6 w-1 h-8 bg-[#ffb4ab] rounded-l"></div>
                      <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-[#ad8884]"></div>
                      <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#ad8884]"></div>
                      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-[#ad8884]"></div>
                      <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-[#ad8884]"></div>

                      <div>
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#343537]/60">
                          <span className="text-[10px] text-[#ffb4ab] uppercase font-bold">[TOOL_03]</span>
                          <span className="text-xs text-[#c6c6c7] group-hover:text-[#ffb4ab] transition-colors">📊</span>
                        </div>
                        <div className="w-full py-1 px-2 rounded-lg bg-[#0d0e10] border border-[#343537] flex items-center justify-between mb-2 text-[#e3e2e5]">
                          <span className="text-[10px] text-[#c6c6c7]">SPECTRUM: 100 kHz FFT</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#d71920] animate-ping"></span>
                        </div>
                        <h3 className="text-sm font-bold leading-tight text-[#e3e2e5] uppercase mb-0.5">PRIYANSHU SAHU</h3>
                        <span className="text-[10px] text-[#ffb4ab] uppercase block mb-3 font-semibold">FRONTEND DEVELOPER</span>
                      </div>

                      <div className="pt-2 border-t border-[#343537]/50">
                        <div className="text-[10px] text-[#c6c6c7] mb-2 flex items-center justify-between">
                          <span>CORE: <strong className="text-[#e3e2e5]">REACT/UI</strong></span>
                          <span className="px-1.5 py-0.5 rounded bg-[#343537] text-[9px] text-[#e3e2e5]">FRONTEND</span>
                        </div>
                        <a
                          className="w-full py-1.5 rounded-lg bg-[#1b1c1e] hover:bg-[#292a2c] text-[#e3e2e5] text-center border border-[#343537] uppercase text-[10px] flex items-center justify-center gap-1 transition-colors"
                          href="https://github.com/123priyanshu123/INDUSTRIAL-SENSE"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Code2 className="w-3 h-3" /> GITHUB REPO
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* TOOL 4: CALIPER (Rohan Kulkarni) */}
                  <div className="flex flex-col items-center sway-tool-4 group cursor-pointer">
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-7 rounded-lg bg-[#343537] border border-[#ad8884] flex items-center justify-center shadow-inner mt-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#d71920]"></div>
                      </div>
                      <div className="w-0.5 h-10 border-l-2 border-dashed border-[#5d3f3c] group-hover:border-[#ffb4ab] transition-colors"></div>
                      <div className="w-4 h-6 rounded-full border-2 border-[#ad8884] bg-[#292a2c] flex items-center justify-center -mb-2 z-10 shadow-sm group-hover:border-[#ffb4ab] group-hover:bg-[#d71920] transition-all">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0d0e10]"></div>
                      </div>
                    </div>

                    <div className="w-full rounded-2xl bg-[#1f2022] border-2 border-[#343537] p-4 flex flex-col justify-between shadow-2xl relative group-hover:border-[#ffb4ab] transition-all duration-300 transform group-hover:scale-[1.02]">
                      <div className="absolute -top-1 right-6 flex gap-1">
                        <div className="w-0.5 h-2 bg-[#c6c6c7]"></div>
                        <div className="w-0.5 h-3 bg-white"></div>
                        <div className="w-0.5 h-2 bg-[#c6c6c7]"></div>
                        <div className="w-0.5 h-4 bg-[#ffb4ab]"></div>
                      </div>
                      <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-[#ad8884]"></div>
                      <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#ad8884]"></div>
                      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-[#ad8884]"></div>
                      <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-[#ad8884]"></div>

                      <div>
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#343537]/60">
                          <span className="text-[10px] text-[#ffb4ab] uppercase font-bold">[TOOL_04]</span>
                          <span className="text-xs text-[#c6c6c7] group-hover:text-[#ffb4ab] transition-colors">📐</span>
                        </div>
                        <div className="w-full py-1 px-2 rounded-lg bg-[#0d0e10] border border-[#343537] flex items-center justify-between mb-2 text-[#e3e2e5]">
                          <span className="text-[10px] text-[#c6c6c7]">TOLERANCE: ±0.001mm</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
                        </div>
                        <h3 className="text-sm font-bold leading-tight text-[#e3e2e5] uppercase mb-0.5">PRAGUN SHARMA</h3>
                        <span className="text-[10px] text-[#ffb4ab] uppercase block mb-3 font-semibold">BACKEND DEVELOPER</span>
                      </div>

                      <div className="pt-2 border-t border-[#343537]/50">
                        <div className="text-[10px] text-[#c6c6c7] mb-2 flex items-center justify-between">
                          <span>CORE: <strong className="text-[#e3e2e5]">API/NODE</strong></span>
                          <span className="px-1.5 py-0.5 rounded bg-[#343537] text-[9px] text-[#e3e2e5]">BACKEND</span>
                        </div>
                        <a
                          className="w-full py-1.5 rounded-lg bg-[#1b1c1e] hover:bg-[#292a2c] text-[#e3e2e5] text-center border border-[#343537] uppercase text-[10px] flex items-center justify-center gap-1 transition-colors"
                          href="https://github.com/123priyanshu123/INDUSTRIAL-SENSE"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Code2 className="w-3 h-3" /> GITHUB REPO
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* TOOL 5: LASER PROBE (Ananya Iyer) */}
                  <div className="flex flex-col items-center sway-tool-5 group cursor-pointer">
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-7 rounded-lg bg-[#343537] border border-[#ad8884] flex items-center justify-center shadow-inner mt-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#d71920]"></div>
                      </div>
                      <div className="w-0.5 h-10 border-l-2 border-dashed border-[#5d3f3c] group-hover:border-[#ffb4ab] transition-colors"></div>
                      <div className="w-4 h-6 rounded-full border-2 border-[#ad8884] bg-[#292a2c] flex items-center justify-center -mb-2 z-10 shadow-sm group-hover:border-[#ffb4ab] group-hover:bg-[#d71920] transition-all">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0d0e10]"></div>
                      </div>
                    </div>

                    <div className="w-full rounded-2xl bg-[#1f2022] border-2 border-[#343537] p-4 flex flex-col justify-between shadow-2xl relative group-hover:border-[#ffb4ab] transition-all duration-300 transform group-hover:scale-[1.02]">
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-[#d71920] rounded-t"></div>
                      <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-[#ad8884]"></div>
                      <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#ad8884]"></div>
                      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-[#ad8884]"></div>
                      <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-[#ad8884]"></div>

                      <div>
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#343537]/60">
                          <span className="text-[10px] text-[#ffb4ab] uppercase font-bold">[TOOL_05]</span>
                          <span className="text-xs text-[#c6c6c7] group-hover:text-[#ffb4ab] transition-colors">🔒</span>
                        </div>
                        <div className="w-full py-1 px-2 rounded-lg bg-[#0d0e10] border border-[#343537] flex items-center justify-between mb-2 text-[#e3e2e5]">
                          <span className="text-[10px] text-[#c6c6c7]">BUS: OPC-UA ZERO-TRUST</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
                        </div>
                        <h3 className="text-sm font-bold leading-tight text-[#e3e2e5] uppercase mb-0.5">MANSI TYAGI</h3>
                        <span className="text-[10px] text-[#ffb4ab] uppercase block mb-3 font-semibold">FRONTEND DEVELOPER</span>
                      </div>

                      <div className="pt-2 border-t border-[#343537]/50">
                        <div className="text-[10px] text-[#c6c6c7] mb-2 flex items-center justify-between">
                          <span>CORE: <strong className="text-[#e3e2e5]">SVG/CSS</strong></span>
                          <span className="px-1.5 py-0.5 rounded bg-[#343537] text-[9px] text-[#e3e2e5]">FRONTEND</span>
                        </div>
                        <a
                          className="w-full py-1.5 rounded-lg bg-[#1b1c1e] hover:bg-[#292a2c] text-[#e3e2e5] text-center border border-[#343537] uppercase text-[10px] flex items-center justify-center gap-1 transition-colors"
                          href="https://github.com/123priyanshu123/INDUSTRIAL-SENSE"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Code2 className="w-3 h-3" /> GITHUB REPO
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#0d0e10] py-6 border-t border-[#292a2c]/50 font-mono text-xs text-[#a1a1aa]">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
            <span>INDUSTRIALSENSE SCADA</span>
          </div>
          <div className="text-zinc-500 text-xs">
            © 2026 INDUSTRIALSENSE. Autonomous Edge Telemetry &amp; Digital Twin Cockpit.
          </div>
        </div>
      </footer>
    </div>
  );
};

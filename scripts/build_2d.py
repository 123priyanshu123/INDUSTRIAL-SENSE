import os, re
from nav_helper import get_header

with open('UI/industrialsense_scada_2d_machine_animation_tool_team_view/code.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# 1. Replace existing <header>...</header> with global header
header_code = get_header('2d')
html = re.sub(r'<header[^>]*>[\s\S]*?</header>', header_code, html, count=1)

# 2. Update Breadcrumb badge
html = html.replace(
    '[DEPARTMENT OF MECHATRONICS &amp; AUTOMATION // SENIOR CAPSTONE 2025-2026]',
    '[TEAM M2P3 // CODESPRINT 2026 // 2D KINEMATICS &amp; MECHANISM SIMULATOR]'
)
html = html.replace(
    'RESEARCH PROTOTYPE',
    'INTERACTIVE VECTOR MECHANISM'
)

# 3. Update Hero Subheading
html = html.replace(
    'Final Year B.Tech / M.Tech Mechatronics &amp; Robotics Capstone Project. Engineered in the Advanced Robotics &amp; Industry 4.0 Testbed Lab, combining high-speed acoustic FFT cavitation diagnostics with real-time physical crane kinematics.',
    'Interactive 2D Technical Kinematics & Mechanism Simulator for CodeSprint 2026. High-precision vector visualization of machine linkage dynamics, rotating impellers, friction points, and acoustic wave propagation.'
)

# 4. Update CTAs in Hero
old_cta = '''<div class="flex flex-wrap items-center justify-center gap-space-md mb-space-lg">
<a class="inline-flex items-center gap-space-sm px-space-xl py-space-sm rounded-full bg-primary-container text-on-primary-container font-label-mono-lg text-label-mono-lg uppercase hover:bg-inverse-primary transition-all duration-200 shadow-md" href="#cockpit">
<span>INSPECT 3D SCADA TWIN</span>
<span class="material-symbols-outlined text-[18px]">arrow_forward</span>
</a>
<a class="inline-flex items-center gap-space-sm px-space-xl py-space-sm rounded-full bg-surface-container-high text-on-surface font-label-mono-lg text-label-mono-lg uppercase hover:bg-surface-bright transition-all duration-200 shadow-sm" href="#thesis">
<span class="material-symbols-outlined text-[18px]">terminal</span>
<span>VIEW PROJECT THESIS / REPO</span>
</a>
</div>'''

new_cta = '''<div class="flex flex-wrap items-center justify-center gap-space-md mb-space-lg">
<a class="inline-flex items-center gap-space-sm px-space-xl py-space-sm rounded-full bg-primary-container text-on-primary-container font-label-mono-lg text-label-mono-lg uppercase hover:bg-inverse-primary transition-all duration-200 shadow-[0_0_20px_rgba(215,25,32,0.4)]" href="#cockpit">
<span class="material-symbols-outlined text-[18px]">settings</span>
<span>INTERACT WITH MECHANISM BELOW</span>
</a>
<a class="inline-flex items-center gap-space-sm px-space-xl py-space-sm rounded-full bg-surface-container-high text-on-surface font-label-mono-lg text-label-mono-lg uppercase hover:bg-surface-bright transition-all duration-200 shadow-sm" href="failure-sim-3d.html">
<span class="material-symbols-outlined text-[18px]">view_in_ar</span>
<span>SWITCH TO 3D TWIN</span>
</a>
<a class="inline-flex items-center gap-space-sm px-space-xl py-space-sm rounded-full bg-surface-container-highest text-on-surface font-label-mono-lg text-label-mono-lg uppercase hover:bg-surface-bright transition-all duration-200 shadow-sm" href="dashboard.html">
<span class="material-symbols-outlined text-[18px]">grid_view</span>
<span>SCADA COCKPIT</span>
</a>
</div>'''
html = html.replace(old_cta, new_cta)

# 5. Update Team section to Team M2P3
html = html.replace('[ 05 // RESEARCH CREW ]', '[ TEAM M2P3 // PROJECT DEVELOPERS ]')
html = html.replace('AARAV SHARMA', 'MANSI TYAGI')
html = html.replace('DEVRAJ PATEL', 'PIYUSH KUMAR PAL')
html = html.replace('SANYA VERMA', 'PRAGUN SHARMA')
html = html.replace('ROHAN KULKARNI', 'PRIYANSHU SAHU')
html = html.replace('ANANYA IYER', 'MANSI SINGH')

html = html.replace('LEAD MECHATRONICS ARCHITECT', 'AI &amp; DEEP LEARNING LEAD')
html = html.replace('Designed testbed kinematics, SIL-4 safety PLC ladder integration &amp; dynamic structural finite-element verification.', 'Engineered PyTorch autoencoders, CNN anomaly detection pipelines &amp; temporal fault classification models for IndustrialSense.')

html = html.replace('EMBEDDED LINUX &amp; DSP CORE', 'SIGNAL PROCESSING SPECIALIST')
html = html.replace('Implemented DMA circular audio ring-buffers, ARM Cortex-M7 DSP kernel &amp; 100kHz ultrasonic sampling firmware.', 'Engineered Librosa/Torchaudio FFT/STFT acoustic filters, frequency binning &amp; noise suppression for machine audio signatures.')

html = html.replace('AI/ML ULTRASONIC SPECIALIST', 'FULL-STACK SCADA &amp; DISTRIBUTED ARCHITECT')
html = html.replace('Trained 1D-CNN autoencoder for cavitation spectrogram anomaly score with 99.4% ROC-AUC on lab test dataset.', 'Developed Python FastAPI telemetry ingestion backend, MQTT/WebSocket broker, PostgreSQL schema &amp; SCADA cockpit frontends.')

html = html.replace('ASRS &amp; ROS2 DIGITAL TWIN', 'DIGITAL TWIN &amp; MECHANICAL TELEMETRY')
html = html.replace('Developed high-fidelity kinematic Babylon.js model, URDF crane kinematics &amp; physics-bound virtual commissioning.', 'Modeled tri-axial vibration waveforms, thermal distribution profiles, and physical degradation kinematics across plant machinery.')

html = html.replace('TELEMETRY &amp; LAB CYBERSEC', 'EDGE AI DEPLOYMENT &amp; INFRASTRUCTURE')
html = html.replace('Authored OPC-UA low-latency broker relay, TLS mutual handshakes &amp; testbed benchmark data audit scripts.', 'Containerized real-time inference nodes with Docker, ONNX Runtime edge optimizations &amp; zero-trust industrial telemetry pipelines.')

html = html.replace('DR. R.K. NAIR (PROFESSOR, DEPT OF MECHATRONICS)', 'CODESPRINT 2026 // JURY &amp; MENTORS (ELITE CODERS)')
html = html.replace('FINAL SENIOR DEFENSE 2026', 'IDEA → MVP → OPEN SOURCE → PITCH')
html = html.replace('PROJECT: SENIOR MECHATRONICS CAPSTONE', 'PROJECT: INDUSTRIAL SENSE (M2P3)')
html = html.replace('© 2025-2026 UNIVERSITY CAPSTONE RESEARCH GROUP.', '© 2026 INDUSTRIAL SENSE • TEAM M2P3 • BUILT FOR CODESPRINT 2026')

# Ensure title tag
if '<title>' not in html:
    html = html.replace('<head>', '<head><title>INDUSTRIALSENSE SCADA // 2D TECHNICAL MECHANISM KINEMATICS</title>')

with open('mechanism-2d.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Generated mechanism-2d.html successfully. Size:", os.path.getsize('mechanism-2d.html'))

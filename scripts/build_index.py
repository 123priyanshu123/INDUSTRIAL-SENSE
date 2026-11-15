import os, re
from nav_helper import get_header

with open('UI/landing_page/code.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# 1. Replace existing <header>...</header> with global header
header_code = get_header('index')
html = re.sub(r'<header[^>]*>[\s\S]*?</header>', header_code, html, count=1)

# 2. Update Breadcrumb badge in Hero
html = html.replace(
    '[DEPARTMENT OF MECHATRONICS &amp; AUTOMATION // SENIOR CAPSTONE 2025-2026]',
    '[TEAM M2P3 // CODESPRINT 2026 // IDEA → MVP → OPEN SOURCE → PITCH]'
)
html = html.replace(
    'RESEARCH PROTOTYPE',
    'CODESPRINT 2026 FINALIST'
)

# 3. Update Hero subheading
old_sub = 'Final Year B.Tech / M.Tech Mechatronics &amp; Robotics Capstone Project. Engineered in the Advanced Robotics &amp; Industry 4.0 Testbed Lab, combining high-speed acoustic FFT cavitation diagnostics with real-time physical crane kinematics.'
new_sub = 'AI-Powered Machine Health Monitoring built for CodeSprint 2026 by Team M2P3. A unified AI platform that turns machine acoustic, vibration, and thermal signals into actionable health insights to transition from reactive maintenance to data-informed prevention.'
html = html.replace(old_sub, new_sub)

# 4. Update Hero CTA group
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
<a class="inline-flex items-center gap-space-sm px-space-xl py-space-sm rounded-full bg-primary-container text-on-primary-container font-label-mono-lg text-label-mono-lg uppercase hover:bg-inverse-primary transition-all duration-200 shadow-[0_0_20px_rgba(215,25,32,0.4)]" href="dashboard.html">
<span class="material-symbols-outlined text-[18px]">grid_view</span>
<span>LAUNCH SCADA COCKPIT</span>
</a>
<a class="inline-flex items-center gap-space-sm px-space-xl py-space-sm rounded-full bg-surface-container-high text-on-surface font-label-mono-lg text-label-mono-lg uppercase hover:bg-surface-bright transition-all duration-200 shadow-sm" href="failure-sim-3d.html">
<span class="material-symbols-outlined text-[18px]">view_in_ar</span>
<span>INSPECT 3D SCADA TWIN</span>
</a>
<a class="inline-flex items-center gap-space-sm px-space-xl py-space-sm rounded-full bg-surface-container-highest text-on-surface font-label-mono-lg text-label-mono-lg uppercase hover:bg-surface-bright transition-all duration-200 shadow-sm" href="#pitch">
<span class="material-symbols-outlined text-[18px]">terminal</span>
<span>VIEW CODESPRINT PITCH &amp; WORKFLOW</span>
</a>
</div>'''
html = html.replace(old_cta, new_cta)

# 5. Update Status pill in Hero
old_pill = '48 SENSOR NODES VALIDATED IN LAB'
new_pill = 'CODESPRINT 2026 // 48 TELEMETRY NODES ACTIVE'
html = html.replace(old_pill, new_pill)

# 6. Update Section Header of Capabilities Grid
html = html.replace(
    '[CAPSTONE RESEARCH PILLARS]',
    '[CODESPRINT 2026 // 3 CORE SIGNAL MODALITIES]'
)
html = html.replace(
    'ENGINEERED AT THE AUTOMATION LAB',
    'MULTIMODAL MACHINE HEALTH SENSING'
)
html = html.replace(
    'Experimental validation across high-frequency acoustic analysis, mathematical twin kinematics, and fail-safe safety interlocks for senior thesis evaluation.',
    'A unified AI platform that turns machine signals into actionable health insights across acoustic friction signatures, vibration irregularities, and thermal patterns.'
)

# 7. Update Team section to Team M2P3 (Mansi Tyagi, Piyush Kumar Pal, Pragun Sharma, Priyanshu Sahu, Mansi Singh)
html = html.replace(
    '[ 05 // RESEARCH CREW ]',
    '[ TEAM M2P3 // PROJECT DEVELOPERS ]'
)
html = html.replace(
    'AARAV SHARMA',
    'MANSI TYAGI'
)
html = html.replace(
    'DEVRAJ PATEL',
    'PIYUSH KUMAR PAL'
)
html = html.replace(
    'SANYA VERMA',
    'PRAGUN SHARMA'
)
html = html.replace(
    'ROHAN KULKARNI',
    'PRIYANSHU SAHU'
)
html = html.replace(
    'ANANYA IYER',
    'MANSI SINGH'
)

# Update roles and descriptions for the 5 team members based on the PDF tech stack
html = html.replace(
    'LEAD MECHATRONICS ARCHITECT',
    'AI &amp; DEEP LEARNING LEAD'
)
html = html.replace(
    'Designed testbed kinematics, SIL-4 safety PLC ladder integration &amp; dynamic structural finite-element verification.',
    'Engineered PyTorch autoencoders, CNN anomaly detection pipelines &amp; temporal fault classification models for IndustrialSense.'
)

html = html.replace(
    'EMBEDDED LINUX &amp; DSP CORE',
    'SIGNAL PROCESSING SPECIALIST'
)
html = html.replace(
    'Implemented DMA circular audio ring-buffers, ARM Cortex-M7 DSP kernel &amp; 100kHz ultrasonic sampling firmware.',
    'Engineered Librosa/Torchaudio FFT/STFT acoustic filters, frequency binning &amp; noise suppression for machine audio signatures.'
)

html = html.replace(
    'AI/ML ULTRASONIC SPECIALIST',
    'FULL-STACK SCADA &amp; DISTRIBUTED ARCHITECT'
)
html = html.replace(
    'Trained 1D-CNN autoencoder for cavitation spectrogram anomaly score with 99.4% ROC-AUC on lab test dataset.',
    'Developed Python FastAPI telemetry ingestion backend, MQTT/WebSocket broker, PostgreSQL schema &amp; SCADA cockpit frontends.'
)

html = html.replace(
    'ASRS &amp; ROS2 DIGITAL TWIN',
    'DIGITAL TWIN &amp; MECHANICAL TELEMETRY'
)
html = html.replace(
    'Developed high-fidelity kinematic Babylon.js model, URDF crane kinematics &amp; physics-bound virtual commissioning.',
    'Modeled tri-axial vibration waveforms, thermal distribution profiles, and physical degradation kinematics across plant machinery.'
)

html = html.replace(
    'TELEMETRY &amp; LAB CYBERSEC',
    'EDGE AI DEPLOYMENT &amp; INFRASTRUCTURE'
)
html = html.replace(
    'Authored OPC-UA low-latency broker relay, TLS mutual handshakes &amp; testbed benchmark data audit scripts.',
    'Containerized real-time inference nodes with Docker, ONNX Runtime edge optimizations &amp; zero-trust industrial telemetry pipelines.'
)

# Update advisor and footer
html = html.replace(
    'DR. R.K. NAIR (PROFESSOR, DEPT OF MECHATRONICS)',
    'CODESPRINT 2026 // JURY &amp; MENTORS (ELITE CODERS)'
)
html = html.replace(
    'FINAL SENIOR DEFENSE 2026',
    'IDEA → MVP → OPEN SOURCE → PITCH'
)
html = html.replace(
    'PROJECT: SENIOR MECHATRONICS CAPSTONE',
    'PROJECT: INDUSTRIAL SENSE (M2P3)'
)
html = html.replace(
    '© 2025-2026 UNIVERSITY CAPSTONE RESEARCH GROUP.',
    '© 2026 INDUSTRIAL SENSE • TEAM M2P3 • BUILT FOR CODESPRINT 2026'
)

# 8. Add the comprehensive CodeSprint 2026 Presentation Section (#pitch)
pitch_section = '''
<!-- ============================================================== -->
<!-- CODESPRINT 2026 PROJECT PITCH & ARCHITECTURE SHOWCASE          -->
<!-- ============================================================== -->
<section class="w-full px-margin py-space-xl bg-surface-container-low border-t border-surface-container-high" id="pitch">
  <div class="max-w-7xl mx-auto flex flex-col gap-space-xl">
    
    <!-- Section Title -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-space-md border-b border-surface-container-highest pb-space-md">
      <div>
        <div class="flex items-center gap-space-xs mb-space-xs">
          <span class="px-space-xs py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-mono-sm text-label-mono-sm uppercase font-bold">CODESPRINT 2026 // OFFICIAL PITCH DECK</span>
          <span class="font-label-mono-sm text-label-mono-sm text-secondary uppercase">TEAM M2P3 • ELITE CODERS</span>
        </div>
        <h2 class="font-headline-xl text-headline-xl uppercase text-on-surface tracking-tight">AI-POWERED MACHINE HEALTH MONITORING</h2>
      </div>
      <div class="flex items-center gap-2">
        <span class="px-space-sm py-1 rounded-full bg-surface-container-highest text-primary font-label-mono-sm font-bold uppercase">IDEA → MVP → OPEN SOURCE → PITCH</span>
      </div>
    </div>

    <!-- SLIDE 2: THE PROBLEM & THE GAP -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
      <div class="lg:col-span-5 rounded-3xl bg-surface-container p-space-lg flex flex-col justify-between border border-surface-container-high">
        <div>
          <div class="flex items-center justify-between mb-space-sm">
            <span class="px-space-xs py-0.5 rounded-full bg-error-container text-on-error-container font-label-mono-sm text-label-mono-sm uppercase font-bold">01 // THE PROBLEM</span>
            <span class="material-symbols-outlined text-primary text-[22px]">warning</span>
          </div>
          <h3 class="font-headline-md text-headline-md text-on-surface uppercase mb-space-sm">
            MACHINES DEVELOP FAULTS LONG BEFORE BREAKDOWN BECOMES VISIBLE.
          </h3>
          <p class="font-body-md text-body-md text-secondary mb-space-md">
            What goes wrong on the modern industrial factory floor:
          </p>
          <ul class="space-y-2.5 font-body-sm text-secondary">
            <li class="flex items-start gap-2">
              <span class="text-primary font-bold mt-0.5">•</span>
              <span><strong class="text-on-surface">Unexpected failures:</strong> Abrupt stoppages interrupt production schedules and multiply repair costs.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary font-bold mt-0.5">•</span>
              <span><strong class="text-on-surface">Blind intervals:</strong> Fixed maintenance schedules miss progressive micro-faults developing between inspections.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary font-bold mt-0.5">•</span>
              <span><strong class="text-on-surface">Expertise dependency:</strong> Manual checks are periodic, highly time-consuming, and prone to human diagnostic variance.</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-primary font-bold mt-0.5">•</span>
              <span><strong class="text-on-surface">Isolated silos:</strong> Sensor readings are monitored separately, limiting a unified holistic machine health view.</span>
            </li>
          </ul>
        </div>
        <div class="mt-space-md pt-space-sm border-t border-surface-container-highest">
          <div class="p-space-sm rounded-2xl bg-surface-container-lowest border border-primary/30">
            <span class="font-label-mono-sm text-primary uppercase font-bold block mb-1">THE GAP IN INDUSTRY:</span>
            <p class="font-body-sm text-on-surface">
              An accessible way to continuously interpret machine-condition signals and flag abnormal behaviour early before catastrophic failure.
            </p>
          </div>
        </div>
      </div>

      <!-- MAINTENANCE REGIME COMPARISON (Reactive vs Preventive vs Predictive) -->
      <div class="lg:col-span-7 rounded-3xl bg-surface-container p-space-lg flex flex-col justify-between border border-surface-container-high">
        <div>
          <span class="px-space-xs py-0.5 rounded-full bg-surface-container-highest text-secondary font-label-mono-sm text-label-mono-sm uppercase font-bold">MAINTENANCE PARADIGMS</span>
          <h3 class="font-headline-md text-headline-md text-on-surface uppercase mt-2 mb-space-md">
            FROM REACTIVE BLINDNESS TO DATA-INFORMED PRECISION
          </h3>
          <div class="space-y-space-sm">
            <!-- Reactive -->
            <div class="p-space-md rounded-2xl bg-surface-container-lowest border-l-4 border-[#d71920]">
              <div class="flex items-center justify-between mb-1">
                <span class="font-label-mono-md text-on-surface font-bold uppercase">REACTIVE MAINTENANCE</span>
                <span class="text-[10px] font-label-mono-sm text-[#ffb4ab] bg-[#93000a]/50 px-2 py-0.5 rounded">HIGH COST // UNPLANNED DOWNTIME</span>
              </div>
              <p class="font-body-sm text-secondary">
                Action begins only after equipment has already failed. Results in emergency component replacements, ruined tooling, lost production batches, and factory hazards.
              </p>
            </div>
            <!-- Preventive -->
            <div class="p-space-md rounded-2xl bg-surface-container-lowest border-l-4 border-amber-500">
              <div class="flex items-center justify-between mb-1">
                <span class="font-label-mono-md text-on-surface font-bold uppercase">PREVENTIVE MAINTENANCE</span>
                <span class="text-[10px] font-label-mono-sm text-amber-300 bg-amber-900/40 px-2 py-0.5 rounded">FIXED SCHEDULES // EXCESS COST</span>
              </div>
              <p class="font-body-sm text-secondary">
                Fixed calendar or cycle schedules cause unnecessary servicing of healthy parts, or miss accelerated early degradation occurring between scheduled rounds.
              </p>
            </div>
            <!-- Predictive (Industrial Sense) -->
            <div class="p-space-md rounded-2xl bg-surface-container-lowest border-l-4 border-[#22c55e]">
              <div class="flex items-center justify-between mb-1">
                <span class="font-label-mono-md text-on-surface font-bold uppercase text-[#22c55e]">INDUSTRIALSENSE: PREDICTIVE HEALTH INTELLIGENCE</span>
                <span class="text-[10px] font-label-mono-sm text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded font-bold">CONTINUOUS // AI-GUIDED</span>
              </div>
              <p class="font-body-sm text-secondary">
                Continuous multimodal ingestion (Acoustic + Vibration + Temperature) with deep-learning anomaly scoring. Actionable alerts and inspection suggestions delivered hours before irreversible damage.
              </p>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between font-label-mono-sm text-label-mono-sm text-secondary mt-space-md pt-space-xs border-t border-surface-container-highest">
          <span>HUMAN-IN-THE-LOOP INSPECTION:</span>
          <span class="text-on-surface font-bold">HUMAN REMAINS DECISION POINT FOR MAINTENANCE ACTION</span>
        </div>
      </div>
    </div>

    <!-- SLIDE 4: MEET THE PRODUCT - 4 CORE PILLARS -->
    <div class="w-full flex flex-col gap-space-md">
      <div class="flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <span class="font-label-mono-md text-label-mono-md uppercase text-primary tracking-widest">[MEET THE PRODUCT // 4 CORE PILLARS]</span>
          <h3 class="font-headline-lg text-headline-lg uppercase text-on-surface mt-1">ONE PLATFORM. MULTIPLE MACHINE SIGNALS.</h3>
        </div>
        <p class="font-body-md text-secondary max-w-md">
          A unified hardware and software architecture delivering a clear, continuous view of industrial equipment health.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <!-- Pillar 1 -->
        <div class="rounded-3xl bg-surface-container p-space-md border border-surface-container-high flex flex-col justify-between hover:border-primary transition-all">
          <div>
            <div class="w-10 h-10 rounded-2xl bg-surface-container-lowest border border-surface-container-highest flex items-center justify-center text-primary font-label-mono-lg font-bold mb-space-sm">
              01
            </div>
            <h4 class="font-headline-md text-[18px] text-on-surface uppercase mb-1">SENSOR INGESTION</h4>
            <p class="font-body-sm text-secondary">
              Continuously collect high-frequency audio, tri-axial vibration, and thermal readings across equipment nodes with low jitter.
            </p>
          </div>
          <div class="mt-space-md pt-2 border-t border-surface-container-highest text-secondary font-label-mono-sm">
            <span>MODALITIES: Audio • Vibration • Temp</span>
          </div>
        </div>

        <!-- Pillar 2 -->
        <div class="rounded-3xl bg-surface-container p-space-md border border-surface-container-high flex flex-col justify-between hover:border-primary transition-all">
          <div>
            <div class="w-10 h-10 rounded-2xl bg-surface-container-lowest border border-surface-container-highest flex items-center justify-center text-primary font-label-mono-lg font-bold mb-space-sm">
              02
            </div>
            <h4 class="font-headline-md text-[18px] text-on-surface uppercase mb-1">SIGNAL PROCESSING</h4>
            <p class="font-body-sm text-secondary">
              Filter industrial ambient noise and extract meaningful mathematical features via real-time FFT, STFT, and spectrogram transforms.
            </p>
          </div>
          <div class="mt-space-md pt-2 border-t border-surface-container-highest text-secondary font-label-mono-sm">
            <span>PIPELINE: Librosa • Torchaudio • SciPy</span>
          </div>
        </div>

        <!-- Pillar 3 -->
        <div class="rounded-3xl bg-surface-container p-space-md border border-surface-container-high flex flex-col justify-between hover:border-primary transition-all">
          <div>
            <div class="w-10 h-10 rounded-2xl bg-surface-container-lowest border border-surface-container-highest flex items-center justify-center text-primary font-label-mono-lg font-bold mb-space-sm">
              03
            </div>
            <h4 class="font-headline-md text-[18px] text-on-surface uppercase mb-1">AI HEALTH ENGINE</h4>
            <p class="font-body-sm text-secondary">
              Deep autoencoders and convolutional neural networks detect subtle anomalous distributions and classify supported fault signatures.
            </p>
          </div>
          <div class="mt-space-md pt-2 border-t border-surface-container-highest text-secondary font-label-mono-sm">
            <span>MODELS: CNNs • Autoencoders • PyTorch</span>
          </div>
        </div>

        <!-- Pillar 4 -->
        <div class="rounded-3xl bg-surface-container p-space-md border border-surface-container-high flex flex-col justify-between hover:border-primary transition-all">
          <div>
            <div class="w-10 h-10 rounded-2xl bg-surface-container-lowest border border-surface-container-highest flex items-center justify-center text-primary font-label-mono-lg font-bold mb-space-sm">
              04
            </div>
            <h4 class="font-headline-md text-[18px] text-on-surface uppercase mb-1">HEALTH DASHBOARD</h4>
            <p class="font-body-sm text-secondary">
              View machine status, trends, alerts, line diagrams, and automated inspection suggestions in a high-contrast SCADA cockpit.
            </p>
          </div>
          <div class="mt-space-md pt-2 border-t border-surface-container-highest text-secondary font-label-mono-sm">
            <span>OUTPUTS: Status • Trends • Suggestions</span>
          </div>
        </div>
      </div>
    </div>

    <!-- SLIDE 5: 5-STAGE WORKFLOW -->
    <div class="rounded-3xl bg-surface-container p-space-lg border border-surface-container-high flex flex-col gap-space-md">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-space-sm border-b border-surface-container-highest pb-space-sm">
        <div>
          <span class="font-label-mono-sm text-primary uppercase font-bold">[HOW IT WORKS // WORKFLOW]</span>
          <h3 class="font-headline-md text-headline-md text-on-surface uppercase mt-1">THE 5-STAGE CONTINUOUS INTELLIGENCE PIPELINE</h3>
        </div>
        <span class="font-label-mono-sm text-secondary">CLOSED-LOOP REAL-TIME CYCLE</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-sm">
        <!-- Stage 1 -->
        <div class="p-space-md rounded-2xl bg-surface-container-lowest border border-surface-container-highest flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="w-7 h-7 rounded-full bg-primary-container text-on-primary-container font-label-mono-md font-bold flex items-center justify-center">1</span>
              <span class="font-label-mono-sm text-secondary uppercase font-semibold">STAGE 01</span>
            </div>
            <h5 class="font-headline-md text-[16px] text-on-surface uppercase mb-1">ACQUIRE</h5>
            <p class="font-body-sm text-secondary">
              Continuous high-rate sampling: Audio mic, tri-axial accelerometer, RTD thermal sensor.
            </p>
          </div>
          <span class="font-label-mono-sm text-[10px] text-primary mt-2">AUDIO • VIB • TEMP</span>
        </div>

        <!-- Stage 2 -->
        <div class="p-space-md rounded-2xl bg-surface-container-lowest border border-surface-container-highest flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="w-7 h-7 rounded-full bg-primary-container text-on-primary-container font-label-mono-md font-bold flex items-center justify-center">2</span>
              <span class="font-label-mono-sm text-secondary uppercase font-semibold">STAGE 02</span>
            </div>
            <h5 class="font-headline-md text-[16px] text-on-surface uppercase mb-1">PROCESS</h5>
            <p class="font-body-sm text-secondary">
              Noise filtration, STFT time-frequency transform, FFT harmonic power spectral density.
            </p>
          </div>
          <span class="font-label-mono-sm text-[10px] text-primary mt-2">FILTER • FFT • FEATURES</span>
        </div>

        <!-- Stage 3 -->
        <div class="p-space-md rounded-2xl bg-surface-container-lowest border border-surface-container-highest flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="w-7 h-7 rounded-full bg-primary-container text-on-primary-container font-label-mono-md font-bold flex items-center justify-center">3</span>
              <span class="font-label-mono-sm text-secondary uppercase font-semibold">STAGE 03</span>
            </div>
            <h5 class="font-headline-md text-[16px] text-on-surface uppercase mb-1">ANALYZE</h5>
            <p class="font-body-sm text-secondary">
              Deep autoencoder reconstruction error scoring, CNN pattern recognition, thresholding.
            </p>
          </div>
          <span class="font-label-mono-sm text-[10px] text-primary mt-2">DEEP LEARNING • ANOMALY</span>
        </div>

        <!-- Stage 4 -->
        <div class="p-space-md rounded-2xl bg-surface-container-lowest border border-surface-container-highest flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="w-7 h-7 rounded-full bg-primary-container text-on-primary-container font-label-mono-md font-bold flex items-center justify-center">4</span>
              <span class="font-label-mono-sm text-secondary uppercase font-semibold">STAGE 04</span>
            </div>
            <h5 class="font-headline-md text-[16px] text-on-surface uppercase mb-1">ASSESS</h5>
            <p class="font-body-sm text-secondary">
              Multimodal health index calculation, anomaly severity level, and AI confidence intervals.
            </p>
          </div>
          <span class="font-label-mono-sm text-[10px] text-primary mt-2">SEVERITY • CONFIDENCE</span>
        </div>

        <!-- Stage 5 -->
        <div class="p-space-md rounded-2xl bg-surface-container-lowest border border-surface-container-highest flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="w-7 h-7 rounded-full bg-primary-container text-on-primary-container font-label-mono-md font-bold flex items-center justify-center">5</span>
              <span class="font-label-mono-sm text-secondary uppercase font-semibold">STAGE 05</span>
            </div>
            <h5 class="font-headline-md text-[16px] text-on-surface uppercase mb-1">ALERT</h5>
            <p class="font-body-sm text-secondary">
              Push notification, SCADA cockpit banner, actionable human inspection suggestion.
            </p>
          </div>
          <span class="font-label-mono-sm text-[10px] text-[#22c55e] mt-2 font-bold">DASHBOARD • ACTIONS</span>
        </div>
      </div>
    </div>

    <!-- SLIDE 6 & 7: TECH STACK & TARGET INDUSTRIES -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-space-md">
      
      <!-- Tech Stack -->
      <div class="rounded-3xl bg-surface-container p-space-lg border border-surface-container-high flex flex-col justify-between">
        <div>
          <span class="font-label-mono-sm text-primary uppercase font-bold">[BUILT WITH // TECH STACK]</span>
          <h3 class="font-headline-md text-headline-md text-on-surface uppercase mt-1 mb-space-md">MODULAR &amp; EDGE-READY ARCHITECTURE</h3>
          
          <div class="space-y-space-sm">
            <div class="p-3 rounded-xl bg-surface-container-lowest border border-surface-container-highest flex items-center justify-between">
              <div>
                <span class="font-label-mono-sm text-primary uppercase font-bold block text-[11px]">AI &amp; DEEP LEARNING</span>
                <span class="font-body-sm text-on-surface">PyTorch • CNNs • Autoencoders • Time-series models</span>
              </div>
              <span class="material-symbols-outlined text-secondary">memory</span>
            </div>

            <div class="p-3 rounded-xl bg-surface-container-lowest border border-surface-container-highest flex items-center justify-between">
              <div>
                <span class="font-label-mono-sm text-primary uppercase font-bold block text-[11px]">SIGNAL PROCESSING</span>
                <span class="font-body-sm text-on-surface">Librosa • Torchaudio • NumPy • SciPy</span>
              </div>
              <span class="material-symbols-outlined text-secondary">equalizer</span>
            </div>

            <div class="p-3 rounded-xl bg-surface-container-lowest border border-surface-container-highest flex items-center justify-between">
              <div>
                <span class="font-label-mono-sm text-primary uppercase font-bold block text-[11px]">BACKEND &amp; DATA</span>
                <span class="font-body-sm text-on-surface">Python • FastAPI • PostgreSQL</span>
              </div>
              <span class="material-symbols-outlined text-secondary">database</span>
            </div>

            <div class="p-3 rounded-xl bg-surface-container-lowest border border-surface-container-highest flex items-center justify-between">
              <div>
                <span class="font-label-mono-sm text-primary uppercase font-bold block text-[11px]">FRONTEND &amp; REAL TIME</span>
                <span class="font-body-sm text-on-surface">React • WebSockets • MQTT • Canvas/SVG SCADA</span>
              </div>
              <span class="material-symbols-outlined text-secondary">sensors</span>
            </div>

            <div class="p-3 rounded-xl bg-surface-container-lowest border border-surface-container-highest flex items-center justify-between">
              <div>
                <span class="font-label-mono-sm text-primary uppercase font-bold block text-[11px]">DEPLOYMENT</span>
                <span class="font-body-sm text-on-surface">Docker • ONNX Runtime (future optimization)</span>
              </div>
              <span class="material-symbols-outlined text-secondary">terminal</span>
            </div>
          </div>
        </div>

        <div class="mt-space-md pt-2 border-t border-surface-container-highest text-secondary font-label-mono-sm">
          <span>DEPLOYMENT TOPOLOGY: Local edge micro-controllers (ESP32/RPi) &amp; Server-based clustering</span>
        </div>
      </div>

      <!-- Target Sectors (Who Needs This?) -->
      <div class="rounded-3xl bg-surface-container p-space-lg border border-surface-container-high flex flex-col justify-between">
        <div>
          <span class="font-label-mono-sm text-primary uppercase font-bold">[WHO NEEDS THIS? // SECTORS]</span>
          <h3 class="font-headline-md text-headline-md text-on-surface uppercase mt-1 mb-space-md">DESIGNED FOR RELIABLE OPERATIONS</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
            <div class="p-3 rounded-xl bg-surface-container-lowest border border-surface-container-highest">
              <span class="font-label-mono-sm text-primary uppercase font-bold block text-[11px]">MANUFACTURING</span>
              <p class="font-body-sm text-secondary mt-1">Production motors, bearings, spindle systems, and heavy rotating machinery.</p>
            </div>

            <div class="p-3 rounded-xl bg-surface-container-lowest border border-surface-container-highest">
              <span class="font-label-mono-sm text-primary uppercase font-bold block text-[11px]">AUTOMOTIVE</span>
              <p class="font-body-sm text-secondary mt-1">Stamping presses, robotic welding cells, and continuous assembly line equipment.</p>
            </div>

            <div class="p-3 rounded-xl bg-surface-container-lowest border border-surface-container-highest">
              <span class="font-label-mono-sm text-primary uppercase font-bold block text-[11px]">ENERGY &amp; UTILITIES</span>
              <p class="font-body-sm text-secondary mt-1">Generators, cooling loop pumps, turbines, and remote critical assets.</p>
            </div>

            <div class="p-3 rounded-xl bg-surface-container-lowest border border-surface-container-highest">
              <span class="font-label-mono-sm text-primary uppercase font-bold block text-[11px]">FOOD PROCESSING</span>
              <p class="font-body-sm text-secondary mt-1">Refrigeration compressors, slurry pumps, and automated conveyor systems.</p>
            </div>

            <div class="p-3 rounded-xl bg-surface-container-lowest border border-surface-container-highest">
              <span class="font-label-mono-sm text-primary uppercase font-bold block text-[11px]">SMES &amp; SERVICE TEAMS</span>
              <p class="font-body-sm text-secondary mt-1">Affordable condition monitoring and maintenance support without high upfront costs.</p>
            </div>

            <div class="p-3 rounded-xl bg-surface-container-lowest border border-surface-container-highest">
              <span class="font-label-mono-sm text-primary uppercase font-bold block text-[11px]">EQUIPMENT MAKERS</span>
              <p class="font-body-sm text-secondary mt-1">OEM embedded health-monitoring telemetry capabilities for newly installed machines.</p>
            </div>
          </div>
        </div>

        <div class="mt-space-md pt-2 border-t border-surface-container-highest text-secondary font-label-mono-sm">
          <span>VALUE DELIVERED: Earlier visibility • Better-informed inspections • Reduced routine dependency</span>
        </div>
      </div>
    </div>

    <!-- SLIDE 8: FUTURE ROADMAP -->
    <div class="rounded-3xl bg-surface-container p-space-lg border border-surface-container-high flex flex-col gap-space-md">
      <div class="flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <span class="font-label-mono-sm text-primary uppercase font-bold">[STRATEGIC ROADMAP]</span>
          <h3 class="font-headline-md text-headline-md text-on-surface uppercase mt-1">PHASED DEVELOPMENT &amp; OPEN-SOURCE EXPANSION</h3>
        </div>
        <span class="font-label-mono-sm text-secondary">VISION: OPEN MACHINE HEALTH INTELLIGENCE LAYER</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
        <!-- Phase 1 -->
        <div class="p-space-md rounded-2xl bg-surface-container-lowest border-t-4 border-[#d71920]">
          <span class="font-label-mono-sm text-primary font-bold uppercase block mb-1">PHASE 1 | MVP</span>
          <h5 class="font-headline-md text-[16px] text-on-surface uppercase mb-2">CORE SENSING</h5>
          <p class="font-body-sm text-secondary">
            Acoustic + vibration anomaly detection; live SCADA dashboard; real-time operator alerts and acknowledge queue.
          </p>
        </div>

        <!-- Phase 2 -->
        <div class="p-space-md rounded-2xl bg-surface-container-lowest border-t-4 border-amber-500">
          <span class="font-label-mono-sm text-amber-400 font-bold uppercase block mb-1">PHASE 2 | INTELLIGENCE</span>
          <h5 class="font-headline-md text-[16px] text-on-surface uppercase mb-2">MULTIMODAL AI</h5>
          <p class="font-body-sm text-secondary">
            Temperature integration; multimodal cross-signal analysis; improved fault pattern classification and severity grading.
          </p>
        </div>

        <!-- Phase 3 -->
        <div class="p-space-md rounded-2xl bg-surface-container-lowest border-t-4 border-cyan-400">
          <span class="font-label-mono-sm text-cyan-400 font-bold uppercase block mb-1">PHASE 3 | INTEGRATION</span>
          <h5 class="font-headline-md text-[16px] text-on-surface uppercase mb-2">EDGE &amp; IOT EXPANSION</h5>
          <p class="font-body-sm text-secondary">
            IoT and edge-device connectivity; multi-machine plant support; standardized industrial APIs and ERP telemetry bridges.
          </p>
        </div>

        <!-- Phase 4 -->
        <div class="p-space-md rounded-2xl bg-surface-container-lowest border-t-4 border-[#22c55e]">
          <span class="font-label-mono-sm text-[#22c55e] font-bold uppercase block mb-1">PHASE 4 | ECOSYSTEM</span>
          <h5 class="font-headline-md text-[16px] text-on-surface uppercase mb-2">FULL DIGITAL TWINS</h5>
          <p class="font-body-sm text-secondary">
            RUL research; digital-twin integrations; automated maintenance workflow integrations; community open-source extensions.
          </p>
        </div>
      </div>
    </div>

  </div>
</section>
'''

# Insert the pitch section right before `<section class="w-full px-margin py-space-xl" id="benefits">`
html = html.replace(
    '<section class="w-full px-margin py-space-xl" id="benefits">',
    pitch_section + '\n<section class="w-full px-margin py-space-xl" id="benefits">'
)

# Also ensure title tag exists
if '<title>' not in html:
    html = html.replace('<head>', '<head><title>INDUSTRIALSENSE // AI-POWERED MACHINE HEALTH MONITORING [CODESPRINT 2026]</title>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Generated index.html successfully. Size:", os.path.getsize('index.html'))

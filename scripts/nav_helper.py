import os, re

def get_header(active_page):
    def pill_class(page):
        if page == active_page:
            return "bg-[#343537] text-white font-bold border border-[#ad8884]/40 shadow-sm"
        return "text-[#c6c6c7] hover:text-white hover:bg-[#292a2c]"

    def drop_class(page):
        if page == active_page:
            return "bg-white text-black font-bold shadow"
        return "text-[#c6c6c7] hover:text-white hover:bg-[#1f2022]"

    return f'''<!-- INDUSTRIAL SENSE SCADA GLOBAL HEADER -->
<header class="fixed top-0 inset-x-0 z-50 bg-[#121315]/95 backdrop-blur-xl border-b border-[#292a2c] shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
  <div class="h-16 w-full max-w-[1700px] mx-auto px-4 md:px-6 flex items-center justify-between">
    <!-- Brand -->
    <div class="flex items-center gap-3">
      <a href="index.html" class="flex items-center gap-3 group">
        <span class="w-3 h-3 rounded-full bg-[#d71920] shadow-[0_0_10px_#d71920] animate-pulse"></span>
        <span class="font-['Space_Mono'] font-bold text-base md:text-lg lg:text-xl tracking-tight text-[#e3e2e5] group-hover:text-white transition-colors">INDUSTRIALSENSE</span>
      </a>
      <span class="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-['Space_Mono'] font-bold bg-[#1b1c1e] text-[#ffb4ab] border border-[#d71920]/40 uppercase">
        <span class="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
        TEAM M2P3 // CODESPRINT 2026
      </span>
    </div>

    <!-- Navigation Pills -->
    <nav class="hidden xl:flex items-center gap-1 bg-[#1b1c1e] p-1 rounded-xl border border-[#292a2c] font-['Space_Mono'] text-xs">
      <a href="index.html" class="px-3 py-1.5 rounded-lg {pill_class('index')} transition-all flex items-center gap-1.5">
        <span class="material-symbols-outlined text-[15px]">info</span>
        <span>OVERVIEW</span>
      </a>
      <a href="dashboard.html" class="px-3 py-1.5 rounded-lg {pill_class('dashboard')} transition-all flex items-center gap-1.5">
        <span class="material-symbols-outlined text-[15px]">grid_view</span>
        <span>SCADA COCKPIT</span>
      </a>
      <a href="analytics.html" class="px-3 py-1.5 rounded-lg {pill_class('analytics')} transition-all flex items-center gap-1.5">
        <span class="material-symbols-outlined text-[15px]">analytics</span>
        <span>DEEP ANALYTICS</span>
      </a>
      <a href="registration.html" class="px-3 py-1.5 rounded-lg {pill_class('registration')} transition-all flex items-center gap-1.5">
        <span class="material-symbols-outlined text-[15px]">app_registration</span>
        <span>ASSET DIRECTORY</span>
      </a>
      <a href="failure-sim-3d.html" class="px-3 py-1.5 rounded-lg {pill_class('3d')} transition-all flex items-center gap-1.5">
        <span class="material-symbols-outlined text-[15px]">view_in_ar</span>
        <span>3D DIGITAL TWIN</span>
      </a>
      <a href="mechanism-2d.html" class="px-3 py-1.5 rounded-lg {pill_class('2d')} transition-all flex items-center gap-1.5">
        <span class="material-symbols-outlined text-[15px]">precision_manufacturing</span>
        <span>2D KINEMATICS</span>
      </a>
      <a href="portal.html" class="px-3 py-1.5 rounded-lg {pill_class('portal')} transition-all flex items-center gap-1.5">
        <span class="material-symbols-outlined text-[15px]">lock</span>
        <span>PORTAL</span>
      </a>
    </nav>

    <!-- Right Controls -->
    <div class="flex items-center gap-2.5">
      <a href="dashboard.html" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#d71920] hover:bg-red-700 text-white font-['Space_Mono'] text-xs font-bold uppercase transition-all shadow-[0_0_12px_rgba(215,25,32,0.35)]">
        <span class="material-symbols-outlined text-[15px]">bolt</span>
        <span>LIVE TELEMETRY</span>
      </a>
      <!-- Menu Button -->
      <div class="relative">
        <button id="global-nav-toggle-btn" onclick="toggleGlobalNavMenu()" class="px-3 py-1.5 rounded-lg bg-[#1b1c1e] border border-[#292a2c] hover:border-zinc-500 text-white font-['Space_Mono'] text-xs font-bold uppercase flex items-center gap-1.5 transition-all">
          <span class="text-zinc-400 font-mono">//</span>
          <span>MENU</span>
          <span class="material-symbols-outlined text-sm">expand_more</span>
        </button>
        <!-- Dropdown Menu -->
        <div id="global-nav-dropdown" class="hidden absolute right-0 mt-2 w-72 rounded-xl bg-[#0d0e10]/95 backdrop-blur-xl border border-[#292a2c] shadow-2xl p-2.5 z-50 space-y-1 font-['Space_Mono'] text-xs">
          <div class="px-3 py-2 border-b border-zinc-800 text-[10px] text-zinc-500 tracking-widest uppercase flex items-center justify-between">
            <span>SCADA NAVIGATION BUS</span>
            <span class="text-emerald-400 font-bold flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>ONLINE</span>
          </div>
          <a href="index.html" class="flex items-center justify-between px-3 py-2 rounded-lg {drop_class('index')}">
            <span class="flex items-center gap-2"><span>◈</span><span>Project Overview & Pitch</span></span>
            <span class="text-[9px] text-zinc-500">M2P3</span>
          </a>
          <a href="dashboard.html" class="flex items-center justify-between px-3 py-2 rounded-lg {drop_class('dashboard')}">
            <span class="flex items-center gap-2"><span>◈</span><span>Factory Map & Alerts</span></span>
            <span class="text-[9px] text-zinc-500">SCADA</span>
          </a>
          <a href="analytics.html" class="flex items-center justify-between px-3 py-2 rounded-lg {drop_class('analytics')}">
            <span class="flex items-center gap-2"><span>▤</span><span>Machine Deep Analytics</span></span>
            <span class="text-[9px] text-zinc-500">PMP-01</span>
          </a>
          <a href="registration.html" class="flex items-center justify-between px-3 py-2 rounded-lg {drop_class('registration')}">
            <span class="flex items-center gap-2"><span>⚙</span><span>Machine Registration</span></span>
            <span class="text-[9px] text-zinc-500">CAD</span>
          </a>
          <a href="failure-sim-3d.html" class="flex items-center justify-between px-3 py-2 rounded-lg {drop_class('3d')}">
            <span class="flex items-center gap-2"><span>▲</span><span>3D Machine Failure Twin</span></span>
            <span class="text-[9px] text-zinc-500">BABYLON</span>
          </a>
          <a href="mechanism-2d.html" class="flex items-center justify-between px-3 py-2 rounded-lg {drop_class('2d')}">
            <span class="flex items-center gap-2"><span>☵</span><span>2D Kinematics Simulator</span></span>
            <span class="text-[9px] text-zinc-500">SVG/CANVAS</span>
          </a>
          <a href="portal.html" class="flex items-center justify-between px-3 py-2 rounded-lg {drop_class('portal')}">
            <span class="flex items-center gap-2"><span>🔒</span><span>Access & Audit Portal</span></span>
            <span class="text-[9px] text-zinc-500">SIL-4</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</header>
<script>
  function toggleGlobalNavMenu() {{
    const d = document.getElementById('global-nav-dropdown');
    if (d) d.classList.toggle('hidden');
  }}
  document.addEventListener('click', function(e) {{
    const btn = document.getElementById('global-nav-toggle-btn');
    const d = document.getElementById('global-nav-dropdown');
    if (d && !d.classList.contains('hidden') && btn && !btn.contains(e.target) && !d.contains(e.target)) {{
      d.classList.add('hidden');
    }}
  }});
</script>
'''

print("get_header defined successfully.")

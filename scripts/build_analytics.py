import os, re
from nav_helper import get_header

with open('UI/machine_deep_analytics/code.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# 1. Replace placeholder screen references
html = html.replace('{{DATA:SCREEN:SCREEN_4}}', 'dashboard.html')
html = html.replace('#project-thesis', 'index.html#pitch')
html = html.replace('#access-logs', 'portal.html')

# 2. Add global header fixed at top
header_code = get_header('analytics')

if '<body' in html:
    html = re.sub(r'<body([^>]*)>', r'<body\1 class="pt-20">', html, count=1)
    html = re.sub(r'(<body[^>]*>)', r'\1\n' + header_code, html, count=1)
else:
    html = header_code + '\n' + html

# 3. Add link to 3D Digital Twin inspection inside the pump machine card
old_btn = '<button class="px-4 py-2 rounded-xl bg-nothing-red hover:bg-red-700 text-white font-mono text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all led-red shadow-md" onclick="openRegisterModal()">'
new_btn = '<a href="failure-sim-3d.html" class="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-cyan-300 font-mono text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all border border-cyan-500/40 shadow-sm mr-2"><span class="material-symbols-outlined text-sm">view_in_ar</span><span>3D INSPECT</span></a>' + old_btn
html = html.replace(old_btn, new_btn)

# Ensure title tag
if '<title>' not in html:
    html = html.replace('<head>', '<head><title>INDUSTRIALSENSE SCADA // MACHINE TWIN &amp; ANALYTICS (MCH-PMP-01)</title>')

with open('analytics.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Generated analytics.html successfully. Size:", os.path.getsize('analytics.html'))

import os, re
from nav_helper import get_header

with open('UI/machine_registration_line_diagram_directory/code.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# 1. Wire up buttons to analytics.html
html = html.replace('VIEW TELEMETRY TWIN →', 'VIEW TELEMETRY TWIN (MCH-PMP-01) →')
# Replace empty onclicks or make them link to analytics.html
html = re.sub(
    r'<button([^>]*>)\s*(VIEW TELEMETRY TWIN [^<]+)</button>',
    r'<a href="analytics.html" class="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-primary-container text-on-primary-container font-label-mono-sm font-bold uppercase hover:bg-inverse-primary transition-all shadow-sm">\2</a>',
    html
)

# 2. Add global header fixed at top
header_code = get_header('registration')

if '<body' in html:
    html = re.sub(r'<body([^>]*)>', r'<body\1 class="pt-20">', html, count=1)
    html = re.sub(r'(<body[^>]*>)', r'\1\n' + header_code, html, count=1)
else:
    html = header_code + '\n' + html

# Ensure title tag
if '<title>' not in html:
    html = html.replace('<head>', '<head><title>INDUSTRIALSENSE SCADA // MACHINE REGISTRATION &amp; LINE DIAGRAM DIRECTORY</title>')

with open('registration.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Generated registration.html successfully. Size:", os.path.getsize('registration.html'))

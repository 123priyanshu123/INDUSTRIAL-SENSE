import os, re
from nav_helper import get_header

with open('UI/dashboard/code.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# 1. Replace placeholder screen references
html = html.replace('{{DATA:SCREEN:SCREEN_28}}', 'analytics.html')
html = html.replace('#access-logs', 'portal.html')

# 2. Add global header fixed at top and adjust body padding
header_code = get_header('dashboard')

# Check if <body> exists
if '<body' in html:
    # Add top padding to body so fixed header does not overlap
    html = re.sub(r'<body([^>]*)>', r'<body\1 class="pt-20">', html, count=1)
    # Insert header right after <body>
    html = re.sub(r'(<body[^>]*>)', r'\1\n' + header_code, html, count=1)
else:
    html = header_code + '\n' + html

# 3. Update existing header inside dashboard to harmonize with global top header
# The existing header has the title INDUSTRIALSENSE and REGISTER MACHINE button.
# Let's ensure the dropdown links in the existing header also work properly:
html = html.replace('href="#"', 'href="dashboard.html"')
html = html.replace('>Factory Map &amp; Alerts<', '>Factory Map &amp; Alerts (Active)<')

# Ensure title tag
if '<title>' not in html:
    html = html.replace('<head>', '<head><title>INDUSTRIALSENSE // SCADA COCKPIT - FACTORY MAP &amp; ALERT CENTER</title>')

with open('dashboard.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Generated dashboard.html successfully. Size:", os.path.getsize('dashboard.html'))

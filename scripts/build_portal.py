import os, re
from nav_helper import get_header

with open('UI/industrialsense_n_os_scada_secure_access_portal_login_register/code.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# 1. Add global header fixed at top
header_code = get_header('portal')

if '<body' in html:
    html = re.sub(r'<body([^>]*)>', r'<body\1 class="pt-20">', html, count=1)
    html = re.sub(r'(<body[^>]*>)', r'\1\n' + header_code, html, count=1)
else:
    html = header_code + '\n' + html

# 2. Make login button / form submit navigate to dashboard.html
# Find the submit button: AUTHENTICATE & ENTER
html = html.replace(
    'AUTHENTICATE &amp; ENTER ',
    'AUTHENTICATE &amp; ENTER SCADA COCKPIT '
)

# Intercept form submission or add script to navigate to dashboard.html on login
login_script = '''
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const loginForms = document.querySelectorAll('form');
    loginForms.forEach(form => {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]') || form.querySelector('button');
        if (btn) {
          btn.innerHTML = '<span class="inline-block animate-spin mr-2">⟳</span> AUTHENTICATING HARDWARE TOKEN...';
          btn.style.opacity = '0.85';
        }
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 800);
      });
    });
  });
</script>
'''

html = html.replace('</body>', login_script + '\n</body>')

# Ensure title tag
if '<title>' not in html:
    html = html.replace('<head>', '<head><title>INDUSTRIALSENSE // SECURE ACCESS PORTAL [SIL-4 AUTHENTICATION]</title>')

with open('portal.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Generated portal.html successfully. Size:", os.path.getsize('portal.html'))

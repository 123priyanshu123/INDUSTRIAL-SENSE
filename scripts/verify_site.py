import os, re

pages = [
    'index.html',
    'dashboard.html',
    'analytics.html',
    'registration.html',
    'failure-sim-3d.html',
    'mechanism-2d.html',
    'portal.html'
]

print("=== VERIFYING SITE INTEGRITY ===")
for p in pages:
    assert os.path.exists(p), f"Missing {p}"
    with open(p, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Check for unreplaced placeholders
    placeholders = re.findall(r'\{\{[^}]+\}\}', content)
    
    # Check title
    title_m = re.search(r'<title>(.*?)</title>', content, re.I)
    title = title_m.group(1) if title_m else "NO TITLE"
    
    # Check header
    has_nav = 'INDUSTRIALSENSE' in content and 'SCADA NAVIGATION BUS' in content
    
    # Check script errors / syntax basic check
    script_count = len(re.findall(r'<script', content, re.I))
    
    print(f"[{p}] Size: {len(content):,} B | Title: {title[:40]} | Nav: {has_nav} | Placeholders: {placeholders} | Scripts: {script_count}")

print("\n=== VERIFYING CROSS-PAGE LINKS ===")
for p in pages:
    with open(p, 'r', encoding='utf-8', errors='ignore') as f:
        c = f.read()
    links = set(re.findall(r'href=["\']([^"\']+\.html(?:#[^"\']*)?)["\']', c))
    print(f"{p} links to: {sorted(list(links))}")

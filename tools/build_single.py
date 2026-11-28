#!/usr/bin/env python3
"""Rebuild a single, self-contained HTML file from this project.

    python3 tools/build_single.py                 -> mario-theft-auto-single.html (next to index.html)
    python3 tools/build_single.py my-game.html    -> custom output name

It inlines css/*.css, every <script src>, and the loader images (as base64), so you get ONE file that you can
send around or host anywhere. No dependencies, Python 3.6+.
(The optional loading music in assets/audio/ is referenced by path and is NOT inlined.)
"""
import base64, mimetypes, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out_name = sys.argv[1] if len(sys.argv) > 1 else 'mario-theft-auto-single.html'

def read(rel):
    with open(os.path.join(ROOT, rel), encoding='utf-8', newline='') as f:
        return f.read()

html = read('index.html')

html = re.sub(r'<link rel="stylesheet" href="([^"]+)">',
              lambda m: '<style>' + read(m.group(1)).replace('</style', '<\\/style') + '</style>', html)

def inline_script(m):
    code = read(m.group(1)).replace('</script', '<\\/script')
    return '<script>' + code + '</script>'
html = re.sub(r'<script src="([^"]+)"></script>', inline_script, html)

def inline_img(m):
    rel = m.group(2)
    mime = mimetypes.guess_type(rel)[0] or 'application/octet-stream'
    with open(os.path.join(ROOT, rel), 'rb') as f:
        b64 = base64.b64encode(f.read()).decode()
    return m.group(1) + 'src="data:%s;base64,%s"' % (mime, b64)
html = re.sub(r'(<img [^>]*?)src="(assets/img/[^"]+)"', inline_img, html)

dest = os.path.join(ROOT, out_name)
with open(dest, 'w', encoding='utf-8', newline='\n') as f:
    f.write(html)
print('wrote', dest, '(%.1f MB)' % (os.path.getsize(dest) / 1048576))

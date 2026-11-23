js=open('main.js',encoding='utf-8').read()
for k in ['chars','props','desk','joy']:
    js=js.replace('/*@%s*/'%k, open('part_%s.js'%k,encoding='utf-8').read())
html=open('head.html',encoding='utf-8').read()+'\n<script>\n'+js+'</script>\n'
open('turkey-trading.html','w',encoding='utf-8').write(html)
open('_t.html','w',encoding='utf-8').write('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0">'+html+'</body></html>')
print(len(html))

# ---- hosted copy (GitHub Pages): full document, sheet backend URL, phone landscape full screen
import os, shutil, sys
SITE = '/home/user/7myunjo_mulsan'
if os.path.isdir(SITE):
    api = open('api_url.txt').read().strip() if os.path.exists('api_url.txt') else ''
    extra_css = '''<style>
html, body { margin: 0; height: 100%; overflow: hidden; overscroll-behavior: none; }
body { padding: 0 max(0px, env(safe-area-inset-right, 0px)) 0 max(0px, env(safe-area-inset-left, 0px)) !important; min-height: 100dvh; }
#stage { width: min(100%, calc(100dvh * 16 / 9)) !important; border: 0 !important; }
#rotate { position: fixed; inset: 0; z-index: 9; background: #1b1a22; color: #f2c94c; display: none; align-items: center; justify-content: center; text-align: center; padding: 24px; font-size: 18px; line-height: 1.8; }
@media (pointer: coarse) and (orientation: portrait) { #rotate { display: flex; } }
</style>
<div id="rotate"><div>폰을 가로로 돌려 주세요<br>↻</div></div>
<script>
// On phones, go full screen and lock to landscape when the player presses start (ignored where the browser does not allow it).
document.getElementById('introform').addEventListener('submit', function () {
  try { if (!window.matchMedia('(pointer: coarse)').matches) return; var el = document.documentElement, p = (el.requestFullscreen || el.webkitRequestFullscreen || function () {}).call(el, { navigationUI: 'hide' });
    if (p && p.then) p.then(function () { try { screen.orientation.lock('landscape').catch(function () {}); } catch (e) {} }).catch(function () {}); } catch (e) {}
});
</script>
'''
    doc = ('<!doctype html>\n<html lang="ko">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">\n'
           '<meta name="robots" content="noindex">\n<script>window.TURKEY_API = %r;</script>\n</head>\n<body>\n' % api) + html + extra_css + '</body>\n</html>\n'
    open(os.path.join(SITE, 'index.html'), 'w', encoding='utf-8').write(doc)
    for f in ['Galmuri11.woff2', 'Galmuri-OFL.txt']: shutil.copy(f, SITE)
    os.makedirs(os.path.join(SITE, 'google-sheet'), exist_ok=True); shutil.copy('Code.gs', os.path.join(SITE, 'google-sheet', 'Code.gs'))
    print('site built, api =', api or '(none)')

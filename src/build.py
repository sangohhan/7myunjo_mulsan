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
body { padding: 0 !important; min-height: 100dvh; }
.overlay { padding-left: max(12px, env(safe-area-inset-left, 0px)) !important; padding-right: max(12px, env(safe-area-inset-right, 0px)) !important; }
#stage { aspect-ratio: auto !important; max-width: none !important; width: min(100vw, calc(100dvh * 512 / 216)) !important; height: min(100dvh, calc(100vw * 9 / 16)) !important; border: 0 !important; }
#pad { width: 15% !important; left: max(3%, env(safe-area-inset-left, 0px)) !important; }
.overlay { position: fixed !important; z-index: 5; }
#turnnote { color: #f2c94c; }
</style>
<script>
(function () {
  var coarse = false; try { coarse = window.matchMedia('(pointer: coarse)').matches; } catch (e) {}
  var stage = document.getElementById('stage');
  // The start screen, survey and closing screen stay upright and full screen in every mode.
  ['intro', 'survey', 'ending'].forEach(function (id) { document.body.appendChild(document.getElementById(id)); });
  function upright() {
    try { if (screen.orientation && screen.orientation.type) return screen.orientation.type.indexOf('portrait') === 0; } catch (e) {}
    if (typeof window.orientation === 'number') return window.orientation === 0 || window.orientation === 180;
    return window.innerHeight > window.innerWidth;
  }
  // Phone held upright: draw the game turned 90 degrees so it fills the screen when the phone is held sideways.
  // Nothing has to be unlocked, and it also works in in-app browsers (Instagram, KakaoTalk) that never rotate.
  function layout() {
    var rot = coarse && upright() && window.innerHeight > window.innerWidth * 0.9, st = stage.style;
    document.documentElement.classList.toggle('rot', rot);
    if (!rot) { st.cssText = ''; return; }
    var vw = window.innerWidth, vh = window.innerHeight, W = Math.min(vh, vw * 512 / 216), H = Math.min(vw, vh * 9 / 16);
    st.cssText = 'position:fixed;width:' + W + 'px !important;height:' + H + 'px !important;left:' + ((vw + H) / 2) + 'px;top:' + ((vh - W) / 2) + 'px;transform-origin:0 0;transform:rotate(90deg);';
  }
  layout(); window.addEventListener('resize', layout); window.addEventListener('orientationchange', function () { setTimeout(layout, 200); });
  try { screen.orientation.addEventListener('change', layout); } catch (e) {}
  if (coarse) {
    var note = document.createElement('p'); note.id = 'turnnote';
    note.textContent = '게임은 가로 화면으로 진행됩니다. 시작하면 폰을 가로로 돌려 잡아 주세요. 화면 회전 잠금은 풀지 않아도 됩니다.';
    var go = document.getElementById('go'); go.parentNode.insertBefore(note, go);
  }
  // Where the browser allows it, also go full screen and lock to landscape when the player presses start.
  document.getElementById('introform').addEventListener('submit', function () {
    try { if (!coarse) return; var el = document.documentElement, p = (el.requestFullscreen || el.webkitRequestFullscreen || function () {}).call(el, { navigationUI: 'hide' });
      if (p && p.then) p.then(function () { try { screen.orientation.lock('landscape').catch(function () {}); } catch (e) {} }).catch(function () {}); } catch (e) {}
  });
})();
</script>
'''
    doc = ('<!doctype html>\n<html lang="ko">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">\n'
           '<meta name="robots" content="noindex">\n<script>window.TURKEY_API = %r;</script>\n</head>\n<body>\n' % api) + html + extra_css + '</body>\n</html>\n'
    open(os.path.join(SITE, 'index.html'), 'w', encoding='utf-8').write(doc)
    for f in ['Galmuri11.woff2', 'Galmuri-OFL.txt']: shutil.copy(f, SITE)
    os.makedirs(os.path.join(SITE, 'google-sheet'), exist_ok=True); shutil.copy('Code.gs', os.path.join(SITE, 'google-sheet', 'Code.gs'))
    print('site built, api =', api or '(none)')

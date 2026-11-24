var coarse = false; try { coarse = window.matchMedia('(pointer: coarse)').matches; } catch (e) {}
var JOY = { x: 0, y: 0, id: null };
(function () {
  var pad = $('pad'), knob = $('knob');
  function set(e) {
    var r = pad.getBoundingClientRect(), rad = r.width / 2, x = (e.clientX - r.left - rad) / rad, y = (e.clientY - r.top - rad) / rad, m = Math.hypot(x, y);
    if (ROT()) { var t = x; x = y; y = -t; }   // stage drawn turned 90 degrees: screen down = game right, screen left = game down
    if (m > 1) { x /= m; y /= m; }
    JOY.x = x; JOY.y = y; knob.style.left = (28 + x * 28) + '%'; knob.style.top = (28 + y * 28) + '%';
  }
  function end() { JOY.x = 0; JOY.y = 0; JOY.id = null; knob.style.left = '28%'; knob.style.top = '28%'; }
  pad.addEventListener('pointerdown', function (e) { e.preventDefault(); JOY.id = e.pointerId; try { pad.setPointerCapture(e.pointerId); } catch (er) {} set(e); });
  pad.addEventListener('pointermove', function (e) { if (e.pointerId === JOY.id) set(e); });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (ev) { pad.addEventListener(ev, function (e) { if (e.pointerId === JOY.id) end(); }); });
  pad.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  JOY.reset = end;
})();
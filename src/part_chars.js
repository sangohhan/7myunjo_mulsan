/* ================= characters ================= */
var SKINS = ['#f5cdaa', '#e8ba96', '#fad6b8', '#d6a580'];
function drawChar(c, o, dir, f) {
  var hair = o.hair, suit = o.suit, dark = o.dark, skin = o.skin, pants = o.fem ? suit : o.pants;
  function legs(x1, x2) {
    var a = f === 1 ? 1 : 0, b = f === 2 ? 1 : 0;
    if (o.fem) { R(c, 3, 19, 10, 2, OL); R(c, 4, 19, 8, 1, suit);
      R(c, x1, 20, 3, 3 - a, OL); R(c, x2, 20, 3, 3 - b, OL); R(c, x1 + 1, 20, 1, 2 - a, skin); R(c, x2 + 1, 20, 1, 2 - b, skin);
      R(c, x1, 23 - a, 3, 1, '#1c1820'); R(c, x2, 23 - b, 3, 1, '#1c1820');
    } else { R(c, 3, 19, 10, 1, OL); R(c, x1 - 1, 19, 5, 5 - a, OL); R(c, x2 - 1, 19, 5, 5 - b, OL);
      R(c, x1, 19, 3, 4 - a, pants); R(c, x2, 19, 3, 4 - b, pants); R(c, x1, 23 - a, 3, 1, '#1c1820'); R(c, x2, 23 - b, 3, 1, '#1c1820'); }
  }
  if (dir === 'down' || dir === 'up') {
    legs(4, 9);
    R(c, 1, 11, 14, 9, OL); R(c, 2, 11, 12, 8, suit);
    R(c, 2, 12, 2, 6, dark); R(c, 12, 12, 2, 6, dark); R(c, 2, 18, 2, 1, skin); R(c, 12, 18, 2, 1, skin);
    R(c, 2, 0, 12, 1, OL); R(c, 1, 1, 14, 10, OL);
    if (dir === 'down') {
      R(c, 6, 11, 4, 3, '#f4f4f0'); R(c, 5, 11, 1, 4, dark); R(c, 10, 11, 1, 4, dark);
      if (o.fem) { R(c, 7, 12, 2, 1, o.tie); } else { R(c, 7, 11, 2, 5, o.tie); }
      R(c, 2, 1, 12, 4, hair); R(c, 3, 4, 10, 6, skin); R(c, 2, 4, 1, 3, hair); R(c, 13, 4, 1, 3, hair); R(c, 3, 4, 3, 1, hair); R(c, 9, 4, 4, 1, hair);
      if (o.long) { R(c, 1, 5, 2, 8, hair); R(c, 13, 5, 2, 8, hair); }
      R(c, 5, 6, 1, 2, OL); R(c, 10, 6, 1, 2, OL); R(c, 7, 9, 2, 1, '#c8786e');
      if (o.glasses) { R(c, 4, 6, 3, 1, OL); R(c, 9, 6, 3, 1, OL); R(c, 7, 6, 2, 1, OL); }
    } else {
      R(c, 2, 1, 12, 9, hair); R(c, 4, 2, 6, 1, o.hl);
      if (o.long) { R(c, 1, 9, 14, 5, OL); R(c, 2, 9, 12, 4, hair); }
    }
  } else { // side, facing right
    if (f === 1) legs(4, 9); else { R(c, 5, 19, 6, 5, OL); if (o.fem) { R(c, 5, 19, 6, 2, suit); R(c, 7, 21, 2, 2, skin); } else R(c, 6, 19, 4, 4, pants); R(c, 6, 23, 5, 1, '#1c1820'); }
    R(c, 4, 11, 8, 9, OL); R(c, 5, 11, 6, 8, suit); R(c, 10, 11, 1, 3, '#f4f4f0'); R(c, 7, 12, 2, 6, dark); R(c, 7, 18, 2, 1, skin);
    R(c, 3, 0, 10, 1, OL); R(c, 2, 1, 12, 10, OL); R(c, 3, 1, 10, 4, hair); R(c, 3, 4, 5, 6, hair); R(c, 8, 5, 5, 5, skin); R(c, 11, 6, 1, 2, OL);
    if (o.long) { R(c, 2, 9, 6, 5, OL); R(c, 3, 9, 4, 4, hair); }
    if (o.glasses) R(c, 10, 6, 3, 1, OL);
  }
}
function makeChar(o) {
  var fr = {};
  ['down', 'up', 'right'].forEach(function (d) {
    fr[d] = [0, 1, 2].map(function (f) { var c = mk(16, 24); drawChar(c.getContext('2d'), o, d, f); return c; });
  });
  fr.left = fr.right.map(function (src) { var c = mk(16, 24), x = c.getContext('2d'); x.translate(16, 0); x.scale(-1, 1); x.drawImage(src, 0, 0); return c; });
  return fr;
}
var LOOKS_M = [
  { hair: '#2a2830', hl: '#4a4854', suit: '#34406a', dark: '#28325a', pants: '#28325a', tie: '#c8483c' },
  { hair: '#5a3826', hl: '#7a5238', suit: '#4a4a52', dark: '#3a3a42', pants: '#3a3a42', tie: '#3c78c8' },
  { hair: '#1e1c22', hl: '#3c3a44', suit: '#2c2c34', dark: '#202028', pants: '#202028', tie: '#e0b040', glasses: true },
  { hair: '#6e4a2c', hl: '#8e6a44', suit: '#5a4638', dark: '#48382c', pants: '#48382c', tie: '#3c9a6a' }
];
var LOOKS_F = [
  { fem: true, long: true, hair: '#5a3826', hl: '#7a5238', suit: '#3c4670', dark: '#2e3860', tie: '#e0b040' },
  { fem: true, long: true, hair: '#1e1c22', hl: '#3c3a44', suit: '#5c3c50', dark: '#4a2e40', tie: '#f0f0f0' },
  { fem: true, hair: '#8a5a30', hl: '#aa7a48', suit: '#40484c', dark: '#30383c', tie: '#c8483c', glasses: true },
  { fem: true, long: true, hair: '#3a2c3c', hl: '#5a4a5c', suit: '#2c2c34', dark: '#202028', tie: '#6ab0e0' }
];
function look(base, i) { var o = {}; for (var k in base) o[k] = base[k]; o.skin = SKINS[i % SKINS.length]; return o; }
var PLAYER_M = look({ hair: '#3a2a22', hl: '#5a4636', suit: '#2e4a78', dark: '#243c64', pants: '#243c64', tie: '#d85a4a' }, 0);
var PLAYER_F = look({ fem: true, long: true, hair: '#3a2a22', hl: '#5a4636', suit: '#2e4a78', dark: '#243c64', tie: '#d85a4a' }, 2);
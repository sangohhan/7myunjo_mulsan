function propSprite(w, h, fn) { var c = mk(w, h); fn(c.getContext('2d')); return c; }
function plantSpr() { return propSprite(16, 24, function (c) {
  B(c, 3, 14, 10, 9, '#c4704c'); R(c, 4, 15, 8, 1, '#dc8c64');
  [[1, 5, 7, 9], [8, 4, 7, 10], [3, 0, 10, 10]].forEach(function (e, i) { B(c, e[0], e[1], e[2], e[3], i === 2 ? '#54a45e' : '#3c844c'); });
  R(c, 6, 2, 3, 2, '#82c878'); R(c, 3, 8, 2, 2, '#6ebe6e'); R(c, 11, 7, 2, 2, '#6ebe6e');
}); }
function coolerSpr() { return propSprite(14, 36, function (c) {
  B(c, 0, 14, 14, 22, '#eceef2'); B(c, 2, 0, 10, 15, '#96cdeb'); R(c, 4, 2, 3, 6, '#d2eefa'); R(c, 3, 22, 3, 2, '#3c6ebe'); R(c, 8, 22, 3, 2, '#c8463c'); R(c, 2, 28, 10, 5, '#c8ccd4');
}); }
function printerSpr() { return propSprite(28, 24, function (c) {
  B(c, 0, 0, 28, 24, '#ced0d6'); R(c, 2, 2, 24, 6, '#eceef2'); R(c, 4, 4, 14, 2, '#fafafa'); R(c, 20, 3, 4, 3, '#5ac878'); R(c, 2, 14, 24, 2, OL); R(c, 4, 17, 20, 5, '#b4b6be');
}); }
function sofaSpr() { return propSprite(56, 20, function (c) {
  B(c, 0, 0, 56, 20, '#be6254'); R(c, 2, 2, 52, 6, '#d67a68'); R(c, 2, 9, 25, 9, '#cc6e5e'); R(c, 29, 9, 25, 9, '#cc6e5e'); R(c, 27, 9, 2, 10, OL);
}); }
function cabinetSpr() { return propSprite(20, 28, function (c) {
  B(c, 0, 0, 20, 28, '#96a0b0'); R(c, 2, 2, 16, 11, '#acb6c6'); R(c, 2, 15, 16, 11, '#acb6c6'); R(c, 7, 6, 6, 2, OL); R(c, 7, 19, 6, 2, OL);
}); }
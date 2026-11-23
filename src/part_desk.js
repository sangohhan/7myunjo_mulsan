function drawDeskBack(c, d, seated, spr) {
  var cx = d.x + d.w / 2;
  B(c, d.x - 4, d.y - 22, d.w + 8, 12, '#7c8aa6'); R(c, d.x - 3, d.y - 21, d.w + 6, 2, '#a2b0c8');
  for (var x = d.x - 2; x < d.x + d.w + 3; x += 3) R(c, x, d.y - 17, 1, 5, '#70809c');
  B(c, cx - 9, d.y - 12, 18, 12, '#40465c'); R(c, cx - 7, d.y - 10, 14, 2, '#545c76');
  if (seated) c.drawImage(spr.down[0], 0, 0, 16, 18, cx - 8, d.y - 18, 16, 18);
}
function drawDeskFront(c, d) {
  var top = d.lead ? '#bc8054' : '#d6a068', face = d.lead ? '#8e5e3c' : '#a07046';
  c.fillStyle = 'rgba(40,30,40,.2)'; c.fillRect(d.x + 2, d.y + d.h, d.w, 3);
  B(c, d.x, d.y, d.w, d.h, top); R(c, d.x + 1, d.y + 1, d.w - 2, 1, d.lead ? '#d49c70' : '#e8b880'); R(c, d.x + 1, d.y + d.h - 6, d.w - 2, 5, face); R(c, d.x + 1, d.y + d.h - 7, d.w - 2, 1, '#785438');
  B(c, d.x - 4, d.y - 22, 4, d.h + 22, '#7c8aa6'); R(c, d.x - 3, d.y - 21, 2, 2, '#a2b0c8');
  var mx = d.x + d.w - 18;
  B(c, mx, d.y - 7, 15, 10, '#464a56'); R(c, mx + 2, d.y - 5, 11, 2, '#5c626e'); R(c, mx + 5, d.y + 3, 5, 2, OL); R(c, mx + 3, d.y + 5, 9, 1, OL);
  B(c, d.x + 4, d.y + 3, 8, 6, '#fafaf5'); R(c, d.x + 6, d.y + 5, 4, 1, '#aaaab4');
  if (d.lead) { B(c, d.x + 16, d.y + 3, 12, 5, '#f0d05a'); }
}
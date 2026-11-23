/**
 * 칠면조 물산: 구글 시트 저장용 Apps Script
 * 하는 일: (1) 이름 중복 검사 (2) 저장된 기록 기준으로 상황 1·2를 반반 배정 (3) 응답을 "응답" 시트에 한 줄씩 저장
 * 시트 탭 "응답"은 처음 실행될 때 자동으로 만들어집니다. (예전 "이름" 탭은 더 이상 쓰지 않으니 지워도 됩니다.)
 */
var COLS = ['id', '시작시각', '저장시각', '이름', '성별', '상황', '순번', '배정방식', '인사', '인사_초', '인사_시간초과',
  '서류1', '서류2', '서류3', '답장', '답장_초', '답장_시간초과', '회식따봉_초', '고른시안', '시안_초', '시안_시간초과',
  '팀원시안', '보인따봉수', '마지막선택', '마지막_초', '마지막_시간초과', '플레이_초', '터치기기',
  '설문완료', '따봉기억', '따봉갯수', '채택희망', 'MBTI', '전화번호', '원본JSON'];

function sheet_(name, header) {
  var ss = SpreadsheetApp.getActiveSpreadsheet(), sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(header); sh.setFrozenRows(1); }
  return sh;
}
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function when_(ms) { return ms ? Utilities.formatDate(new Date(ms), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss') : ''; }

function doGet() { return out_({ ok: true, msg: '칠면조 물산 저장소가 켜져 있습니다.' }); }

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var q = JSON.parse(e.postData.contents);
    if (q.a === 'start') return out_(start_(q));
    if (q.a === 'save') return out_(save_(q));
    return out_({ ok: false, msg: 'unknown action' });
  } catch (err) {
    return out_({ ok: false, msg: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function start_(q) {
  var name = String(q.name || '');
  if (!/^[가-힣]{2}$/.test(name)) return { ok: false, msg: 'bad name' };
  // 이름은 "응답" 탭에 저장된 기록하고만 비교합니다. 중간에 나가서 기록이 없는 사람의 이름은 다시 쓸 수 있습니다.
  var resp = sheet_('응답', COLS), last = resp.getLastRow();
  if (last > 1) {
    var used = resp.getRange(2, 4, last - 1, 1).getValues();
    for (var i = 0; i < used.length; i++) if (used[i][0] === name) return { ok: false, dup: true };
  }
  var id = Utilities.getUuid();
  var force = Number(q.force) || 0;
  if (force === 1 || force === 2) return { ok: true, cond: force, slot: -1, id: id };   // 테스트용 주소(#s1, #s2)는 배정에 넣지 않음
  // 저장된 기록을 기준으로 인원이 적은 쪽 상황을 배정합니다(같으면 무작위).
  // 지금 플레이 중인 사람(최근 15분 안에 시작했고 아직 저장 전)도 함께 세어서, 여러 명이 동시에 시작해도 한쪽으로 몰리지 않습니다.
  // 중간에 나간 사람은 15분 뒤 자동으로 빠지므로, 끝까지 한 사람 기준으로 반반이 맞춰집니다.
  var cnt = [0, 0, 0];
  if (last > 1) {
    var rows = resp.getRange(2, 6, last - 1, 3).getValues();   // 상황, 순번, 배정방식
    for (var k = 0; k < rows.length; k++) { var c = Number(rows[k][0]); if ((c === 1 || c === 2) && rows[k][2] !== 'hash') cnt[c]++; }
  }
  var pend = pending_(), now = Date.now();
  for (var key in pend) { if (now - pend[key][1] > PENDING_MS) delete pend[key]; else cnt[pend[key][0]]++; }
  var cond = cnt[1] < cnt[2] ? 1 : cnt[2] < cnt[1] ? 2 : (Math.random() < 0.5 ? 1 : 2);
  pend[id] = [cond, now];
  PropertiesService.getScriptProperties().setProperty('pending', JSON.stringify(pend));
  return { ok: true, cond: cond, slot: cnt[1] + cnt[2], id: id };
}

var PENDING_MS = 15 * 60 * 1000;
function pending_() {
  try { return JSON.parse(PropertiesService.getScriptProperties().getProperty('pending') || '{}') || {}; } catch (e) { return {}; }
}

function save_(q) {
  var r = q.rec || {}, id = String(q.id || r.id || '');
  if (!id) return { ok: false, msg: 'no id' };
  var pend = pending_();
  if (pend[id]) { delete pend[id]; PropertiesService.getScriptProperties().setProperty('pending', JSON.stringify(pend)); }
  var sh = sheet_('응답', COLS), g = r.greet || {}, rp = r.reply || {}, d = r.design || {}, f = r.final || {}, s = r.survey, docs = r.docs || [];
  function doc(i) { return docs[i] ? docs[i].found + '/' + docs[i].total : ''; }
  var slim = JSON.parse(JSON.stringify(r)); delete slim.events;
  var row = [id, when_(r.startedAt), when_(Date.now()), r.name || '', r.gender || '', r.cond || '', r.slot == null ? '' : r.slot, r.condSrc || '',
    g.c || '', g.rt == null ? '' : g.rt, g.to ? 'Y' : '', doc(0), doc(1), doc(2), rp.c || '', rp.rt == null ? '' : rp.rt, rp.to ? 'Y' : '',
    r.lunchLikeRt == null ? '' : r.lunchLikeRt, d.c || '', d.rt == null ? '' : d.rt, d.to ? 'Y' : '', r.mateDesign || '', r.likesShown == null ? '' : r.likesShown,
    f.c == null ? '' : f.c, f.rt == null ? '' : f.rt, f.to ? 'Y' : '', r.playSec || '', r.touch ? 'Y' : '',
    s ? 'Y' : '', s ? s.remember : '', s && s.count != null ? s.count : '', s ? s.want : '', s ? s.mbti : '', s ? "'" + s.phone : '', JSON.stringify(slim)];
  var last = sh.getLastRow();
  if (last > 1) {
    var ids = sh.getRange(2, 1, last - 1, 1).getValues();
    for (var i = 0; i < ids.length; i++) if (ids[i][0] === id) { sh.getRange(i + 2, 1, 1, row.length).setValues([row]); return { ok: true }; }
  }
  sh.appendRow(row);
  return { ok: true };
}

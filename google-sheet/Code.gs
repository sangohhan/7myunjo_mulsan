/**
 * 칠면조 물산: 구글 시트 저장용 Apps Script
 * 하는 일: (1) 이름 중복 검사 (2) 상황 1·2를 두 명씩 묶어 정확히 반반 배정 (3) 응답을 "응답" 시트에 한 줄씩 저장
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
  if (force === 1 || force === 2) return { ok: true, cond: force, slot: -1, id: id };   // 테스트용 주소(#s1, #s2)는 순번을 쓰지 않음
  // 시작 순서대로 번호를 매기고 두 명씩 묶습니다. 묶음의 첫 사람은 무작위, 둘째 사람은 그 반대 상황을 받습니다.
  var p = PropertiesService.getScriptProperties();
  var n = Number(p.getProperty('n') || 0), cond;
  if (n % 2 === 0) { cond = Math.random() < 0.5 ? 1 : 2; p.setProperty('first', String(cond)); }
  else cond = 3 - Number(p.getProperty('first') || 1);
  p.setProperty('n', String(n + 1));
  return { ok: true, cond: cond, slot: n, id: id };
}

function save_(q) {
  var r = q.rec || {}, id = String(q.id || r.id || '');
  if (!id) return { ok: false, msg: 'no id' };
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

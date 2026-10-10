// ===== helpers =====
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
function h(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function shuffledNot(a, eq) { let s; let n = 0; do { s = shuffle(a); n++; } while (n < 20 && eq(s)); return s; }
function shake(e) { e.classList.remove('shake'); void e.offsetWidth; e.classList.add('shake'); }

/**
 * Pointer-based drag (mouse + touch). opts:
 *  dropSelector: CSS selector of drop targets
 *  onOver(target|null, x, y), onDrop(target|null, x, y), onTap()
 */
function makeDrag(el, opts) {
  el.classList.add('drag');
  el.addEventListener('pointerdown', (e) => {
    if (e.button > 0) return;
    const sx = e.clientX, sy = e.clientY; let ghost = null, moved = false;
    const r = el.getBoundingClientRect(); const ox = sx - r.left, oy = sy - r.top;
    const find = (x, y) => { const t = document.elementFromPoint(x, y); return t ? t.closest(opts.dropSelector) : null; };
    const move = (ev) => {
      if (!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 6) return;
      if (!moved) {
        moved = true; ghost = el.cloneNode(true); ghost.classList.add('ghost');
        ghost.style.width = r.width + 'px'; document.body.appendChild(ghost);
        if (opts.placeholder !== false) el.classList.add('placeholder');
      }
      ev.preventDefault();
      ghost.style.left = (ev.clientX - ox) + 'px'; ghost.style.top = (ev.clientY - oy) + 'px';
      opts.onOver && opts.onOver(find(ev.clientX, ev.clientY), ev.clientX, ev.clientY);
    };
    const up = (ev) => {
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
      if (moved) { ghost.remove(); el.classList.remove('placeholder'); opts.onDrop && opts.onDrop(find(ev.clientX, ev.clientY), ev.clientX, ev.clientY); }
      else if (opts.onTap) opts.onTap();
    };
    window.addEventListener('pointermove', move, { passive: false }); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
  });
}

// ===== app state =====
const solved = new Set();
let cur = 0;
let filter = '전체';

function stars(n) { return '★'.repeat(n) + '☆'.repeat(5 - n); }
function pad(n) { return String(n).padStart(2, '0'); }

function renderTabs() {
  const t = $('#tabs'); t.innerHTML = '';
  TYPES.forEach((ty, i) => {
    const b = h('button', 'tab' + (i === cur ? ' active' : '') + (solved.has(i) ? ' solved' : '') + (ty.isNew ? ' new' : ''), 'TYPE ' + pad(i + 1));
    b.title = ty.name; b.onclick = () => go(i, true); t.appendChild(b);
  });
  const a = t.children[cur]; if (a) a.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
}
function renderFilters() {
  const mechs = ['전체', 'NEW', ...new Set(TYPES.map(t => t.mech))];
  const f = $('#filters'); f.innerHTML = '';
  mechs.forEach(m => { const c = h('button', 'chip' + (m === filter ? ' on' : ''), m === 'NEW' ? '🆕 새 유형' : m); c.onclick = () => { filter = m; renderFilters(); renderGrid(); }; f.appendChild(c); });
}
function renderGrid() {
  const g = $('#grid'); g.innerHTML = '';
  TYPES.forEach((ty, i) => {
    if (filter === 'NEW' && !ty.isNew) return;
    if (filter !== '전체' && filter !== 'NEW' && ty.mech !== filter) return;
    const c = h('button', 'gcard' + (solved.has(i) ? ' solved' : ''),
      `<div class="no">TYPE ${pad(i + 1)}</div>${ty.isNew ? '<span class="newtag">NEW</span>' : ''}<div class="ic">${ty.icon}</div><div class="nm">${ty.name}</div><div class="mc">${ty.mech} · ${ty.short}</div>`);
    c.onclick = () => go(i, true); g.appendChild(c);
  });
}
function updateCounts() {
  $('#solvedCount').textContent = solved.size; $('#solvedCount2').textContent = solved.size;
  $('#closingMsg').textContent = `${TYPES.length}개 유형 중 ${solved.size}개를 직접 해결했어요. 마음에 드는 유형의 프롬프트를 복사해 내 수업 문제로 바꿔 보세요!`;
}

function renderCase() {
  const ty = TYPES[cur]; const c = $('#case');
  $('#curNo').textContent = pad(cur + 1);
  const t = ty.tip;
  c.innerHTML = `
    <div class="case-head">
      <div class="ic">${ty.icon}</div>
      <div class="meta">
        <div class="tl">TYPE ${pad(cur + 1)} · ${ty.en}</div>
        <h3>${ty.name}</h3>
        <div class="tags">${ty.isNew ? '<span class="tag n">NEW</span>' : ''}<span class="tag">${ty.mech}</span><span class="tag">${t.unit}</span></div>
      </div>
      <div class="status ${solved.has(cur) ? 'ok' : ''}" id="status">${solved.has(cur) ? '해결' : '미해결'}</div>
    </div>
    <div class="stamp ${solved.has(cur) ? 'on' : ''}" id="stamp">해결</div>
    <div class="case-body">
      <div class="question"><span class="q">Q.</span>${ty.q}</div>
      <div class="stage" id="stage"></div>
      <div class="actions" id="actions"></div>
      <div class="success" id="success"></div>
    </div>
    <div class="panels">
      <details class="pn" open>
        <summary>🧭 수업 활용 팁 카드</summary>
        <div class="pn-body">
          <dl class="tipgrid">
            <dt>이럴 때 좋아요</dt><dd>${t.when}</dd>
            <dt>추천 단원</dt><dd>${t.unit}</dd>
            <dt>소요 시간</dt><dd>${t.time}</dd>
            <dt>제작 난이도</dt><dd><span class="stars">${stars(t.level)}</span></dd>
            <dt>평가 연결</dt><dd>${t.assess}</dd>
            <dt>응용 아이디어</dt><dd>${t.ideas}</dd>
            <dt>주의할 점</dt><dd>${t.caution}</dd>
          </dl>
        </div>
      </details>
      <details class="pn">
        <summary>💡 이 유형 제작 프롬프트 보기</summary>
        <div class="pn-body">
          <pre class="prompt-pre" id="promptText"></pre>
          <button class="btn btn-ink copy" id="copyBtn">📋 프롬프트 복사</button>
        </div>
      </details>
    </div>`;
  $('#promptText').textContent = ty.prompt.trim();
  $('#copyBtn').onclick = async () => {
    const txt = ty.prompt.trim(); let ok = false;
    try { await navigator.clipboard.writeText(txt); ok = true; } catch (e) {
      const ta = h('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select();
      try { ok = document.execCommand('copy'); } catch (_) { } ta.remove();
    }
    $('#copyBtn').textContent = ok ? '✅ 복사 완료!' : '복사 실패 — 직접 선택해 주세요';
    setTimeout(() => { const b = $('#copyBtn'); if (b) b.textContent = '📋 프롬프트 복사'; }, 1800);
  };
  mountPuzzle();
}

function mountPuzzle() {
  const ty = TYPES[cur]; const idx = cur;
  const stage = $('#stage'), actions = $('#actions'), success = $('#success');
  stage.innerHTML = ''; actions.innerHTML = ''; $$('.answer-box').forEach(e => e.remove()); success.className = 'success'; success.innerHTML = '';
  const fb = h('span', 'feedback');
  const api = {
    stage, fb,
    button(label, fn, cls = 'btn btn-ink') { const b = h('button', cls, label); b.onclick = fn; actions.insertBefore(b, fb); return b; },
    bad(msg) { fb.className = 'feedback bad'; fb.textContent = msg; shake(stage); },
    info(msg) { fb.className = 'feedback'; fb.textContent = msg; },
    solve(msg) {
      fb.className = 'feedback good'; fb.textContent = '정답입니다!';
      success.innerHTML = '🔓 <b>탈출 성공!</b> ' + (msg || ''); success.className = 'success show';
      if (!solved.has(idx)) { solved.add(idx); }
      $('#status').className = 'status ok'; $('#status').textContent = '해결'; $('#stamp').classList.add('on');
      renderTabs(); renderGrid(); updateCounts();
    },
  };
  actions.appendChild(fb);
  ty.render(api);
  api.button('↺ 다시 하기', () => mountPuzzle(), 'btn btn-line');
  if (ty.answer) {
    const box = h('div', 'answer-box', `<div class="ab-h">🔑 정답 · 해설 <small>연수용</small></div>${ty.answer}`);
    success.parentNode.insertBefore(box, success.nextSibling);
    const ab = api.button('🔑 정답', () => { const on = box.classList.toggle('show'); ab.textContent = on ? '정답 숨기기' : '🔑 정답'; }, 'btn-answer');
    actions.appendChild(ab);
  }
}

function go(i, scroll) {
  if (i >= TYPES.length) { $('#closing').scrollIntoView({ behavior: 'smooth' }); return; }
  cur = Math.max(0, i); renderTabs(); renderCase();
  if (scroll) $('#caseView').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function init() {
  $$('.tcount').forEach(e => e.textContent = TYPES.length);
  $('#startBtn').onclick = () => go(0, true);
  $('#indexBtn').onclick = () => $('#indexSec').scrollIntoView({ behavior: 'smooth' });
  $('#prevBtn').onclick = () => go(cur - 1, true);
  $('#nextBtn').onclick = () => go(cur + 1, true);
  $('#restartBtn').onclick = () => { solved.clear(); updateCounts(); renderGrid(); go(0, false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  renderFilters(); renderGrid(); updateCounts(); go(0, false);
}

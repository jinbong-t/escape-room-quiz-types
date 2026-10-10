// ================= NEW TYPES =================

// ---------- 11 논리 그리드형 ----------
TYPES.push({
  name: '논리 그리드형', en: 'LOGIC GRID', icon: '🧮', mech: '추론', short: '단서 표로 소거', isNew: true,
  q: '삼남매 민준·서연·도윤이 이번 주 집안일을 하나씩 맡았어요. 단서를 읽고 표의 칸을 눌러 <b>O / X</b>를 표시하세요. (누를 때마다 빈칸 → O → X)',
  tip: {
    when: '여러 단서를 <b>종합·소거</b>해야 하는 고차원 추론. 방탈출 중반의 “머리 쓰는 방”으로 좋아요.',
    unit: '가족 · 가사 노동 분담', time: '4~6분', level: 3,
    assess: '어떤 단서로 어떤 칸을 X 했는지 순서대로 쓰게 하면 <b>논리적 사고 과정</b>이 드러나요.',
    ideas: '가족별 식단 취향 맞히기, 세 친구의 섬유 옷 추리, 이웃 세 집의 주거 형태 추리',
    caution: '정답이 하나로 정해지는지 꼭 직접 풀어 확인하세요. 3×3은 중1, 4×4는 중2~3 수준이에요.'
  },
  prompt: `가정과 방탈출 웹앱에 [논리 그리드형] 추리 문제를 만들어 줘.

■ 상황: [삼남매가 집안일을 하나씩 맡음]
■ 인물: [민준, 서연, 도윤] / 항목: [설거지, 빨래 개기, 분리배출]
■ 단서: [민준이는 물 묻히는 일을 싫어한다 / 서연이는 분리배출하는 날 학원에 간다 / 도윤이는 빨래 개기를 맡지 않았다 / 민준이는 분리배출 담당이 아니다]
■ 정답: [민준-빨래 개기, 서연-설거지, 도윤-분리배출]
■ 조작: 3×3 표의 칸을 탭할 때마다 빈칸 → O → X 순환.
■ 판정: O 위치가 정답과 같으면 성공. 단서만으로 정답이 하나로 정해지는지 먼저 검증해 줘.` + COMMON,
  render(api) {
    const ppl = ['민준', '서연', '도윤'], jobs = ['🍽️ 설거지', '👕 빨래 개기', '♻️ 분리배출'], sol = [1, 0, 2];
    api.stage.appendChild(h('ol', 'clues', '<li>민준이는 손에 물 묻히는 일을 싫어해서 설거지는 안 한다.</li><li>서연이는 분리배출하는 날마다 학원에 가서 분리배출을 할 수 없다.</li><li>도윤이는 빨래 개기를 맡지 않았다.</li><li>민준이는 분리배출 담당이 아니다.</li>'));
    const st = ppl.map(() => [0, 0, 0]);
    const t = h('table', 'lg'); t.innerHTML = '<tr><th></th>' + jobs.map(j => `<th>${j}</th>`).join('') + '</tr>';
    ppl.forEach((p, r) => {
      const tr = h('tr'); tr.appendChild(h('th', '', p));
      jobs.forEach((j, c) => { const td = h('td'); const b = h('button', ''); b.setAttribute('aria-label', `${p} ${j}`); b.onclick = () => { st[r][c] = (st[r][c] + 1) % 3; b.textContent = ['', 'O', 'X'][st[r][c]]; b.className = ['', 'o', 'x'][st[r][c]]; }; td.appendChild(b); tr.appendChild(td); });
      t.appendChild(tr);
    });
    const w = h('div'); w.style.overflowX = 'auto'; w.appendChild(t); api.stage.appendChild(w);
    api.button('추리 확정', () => {
      const os = st.map(row => row.map((v, i) => v === 1 ? i : -1).filter(i => i >= 0));
      if (os.some(o => o.length !== 1)) return api.bad('사람마다 O를 정확히 하나씩 표시하세요.');
      if (os.every((o, r) => o[0] === sol[r])) api.solve('민준-빨래 개기, 서연-설거지, 도윤-분리배출. 단서 1·4로 민준이가 먼저 정해져요!');
      else api.bad('단서 1과 4를 함께 보면 민준이의 일이 바로 정해져요.');
    });
  }
});

// ---------- 12 오류 탐지형 ----------
TYPES.push({
  name: '오류 탐지형', en: 'SPOT THE ERROR', icon: '🕵️', mech: '탐색', short: '틀린 문장 찾기', isNew: true,
  q: '누군가 주방 위생 안내문을 조작했어요! <b>틀린 문장 3개</b>를 찾아 누르세요. (다시 누르면 취소)',
  tip: {
    when: '흔한 <b>오개념·잘못된 생활 습관</b>을 바로잡을 때. “틀린 걸 찾는” 탐정 역할이 동기를 높여요.',
    unit: '식생활 · 식품 위생과 식중독 예방', time: '3~4분', level: 1,
    assess: '찾은 문장을 올바르게 고쳐 쓰게 하면 <b>서술형 평가</b> 문항이 그대로 완성돼요.',
    ideas: '잘못된 세탁 표시 설명, 틀린 영양성분표 해석, 엉터리 가계부, 과장 광고 문구',
    caution: '틀린 문장은 “그럴듯하게” 만들어야 재미있어요. 실제로 학생들이 하는 행동에서 가져오세요.'
  },
  prompt: `가정과 방탈출 웹앱에 [오류 탐지형] 문제를 만들어 줘.

■ 상황: [조작된 주방 위생 안내문에서 틀린 문장 찾기]
■ 문장 목록(6~8개)과 정오:
  - [손은 비누로 30초 이상 씻는다] (맞음)
  - [날고기를 썰 도마는 물로만 헹군 뒤 바로 채소를 산다] (틀림 → 고친 문장: 세제로 씻거나 도마를 구분해 쓴다)
  - (같은 형식으로 계속, 틀린 문장은 [3]개)
■ 조작: 문장을 탭하면 빨간 줄 표시, 다시 탭하면 취소.
■ 판정: 정확히 틀린 문장만 골랐을 때 성공 → 각 문장 아래 '올바른 문장'을 보여 줘.` + COMMON,
  render(api) {
    const lines = [
      ['손은 비누로 30초 이상 꼼꼼히 씻는다.'],
      ['날고기를 썰 도마는 물로만 헹군 뒤 바로 채소를 산다.', '날고기용·채소용 도마를 구분하거나, 세제로 깨끗이 씻은 뒤 사용한다.'],
      ['냉장고는 5℃ 이하, 냉동고는 -18℃ 이하로 유지한다.'],
      ['남은 음식은 실온에서 하룻밤 식힌 뒤 냉장고에 넣는다.', '남은 음식은 빨리 식혀 2시간 안에 냉장 보관한다.'],
      ['조리한 음식과 날음식은 따로 담아 보관한다.'],
      ['냉동 고기는 싱크대 위 실온에 꺼내 두고 해동한다.', '냉장실이나 전자레인지에서 해동한다.'],
      ['고기는 속까지 충분히 익혀 먹는다.'],
    ];
    const n = h('div', 'notice', '<h4>📋 우리 집 주방 위생 수칙</h4>'); const ol = h('ol'); n.appendChild(ol);
    const lis = lines.map(l => { const li = h('li', '', l[0]); li.onclick = () => li.classList.toggle('mk'); ol.appendChild(li); return li; });
    api.stage.appendChild(n);
    api.button('제출하기', () => {
      const mk = lis.map(l => l.classList.contains('mk')); const err = lines.map(l => !!l[1]);
      const hit = mk.filter((m, i) => m && err[i]).length, fp = mk.filter((m, i) => m && !err[i]).length;
      if (hit === 3 && !fp) { lines.forEach((l, i) => { if (l[1]) lis[i].insertAdjacentHTML('beforeend', `<span class="fix">→ ${l[1]}</span>`); lis[i].onclick = null; }); api.solve('조작된 문장 3개를 모두 찾아냈어요. 고친 문장을 확인하세요.'); }
      else api.bad(`찾은 오류 ${hit}개${fp ? `, 맞는 문장을 틀렸다고 고른 것 ${fp}개` : ''}. 틀린 문장은 모두 3개예요.`);
    });
  }
});

// ---------- 13 색 조합 자물쇠형 ----------
TYPES.push({
  name: '색 조합 자물쇠형', en: 'COLOR LOCK', icon: '🎨', mech: '코드 입력', short: '색 순서로 잠금 해제', isNew: true,
  q: '급식 식판 자물쇠는 <b>색 4개</b>로 열려요. 아래 <b>사건 색 코드표</b>를 보고, 오늘 식판 음식이 속한 식품군 색을 순서대로 맞추세요. (동그라미를 누를 때마다 색이 바뀌어요)',
  tip: {
    when: '숫자 대신 <b>색·기호로 코드</b>를 만들고 싶을 때. 글을 읽기 어려운 학생도 참여하기 쉬워요.',
    unit: '식생활 · 식품군과 균형 잡힌 식사', time: '2~3분', level: 2,
    assess: '내 급식 식단을 색 코드로 바꿔 보게 하면 <b>실생활 적용 평가</b>로 확장돼요.',
    ideas: '분리배출 표시 색, 세탁 표시 기호 순서, 신호등 영양 표시, 친환경 인증 마크 순서',
    caution: '색약 학생을 위해 색 이름(글자)도 함께 보이게 하세요. 이 예시처럼 버튼 안에 글자를 넣으면 돼요.'
  },
  prompt: `가정과 방탈출 웹앱에 [색 조합 자물쇠형] 문제를 만들어 줘.

■ 상황: [오늘 급식 메뉴를 식품군 색 코드로 바꿔 자물쇠 열기]
■ 색 코드표: [곡류=노랑 / 고기·생선·달걀·콩류=빨강 / 채소류=초록 / 과일류=보라 / 우유·유제품류=파랑] (게임 안 약속으로 화면에 표시)
■ 메뉴(순서대로): [현미밥, 달걀말이, 시금치나물, 우유]
■ 정답: [노랑-빨강-초록-파랑]
■ 조작: 동그라미 버튼 4개, 탭할 때마다 색 순환. 버튼 안에 색 이름 글자도 표시(색약 배려).
■ 판정: '열기' → 위치까지 맞은 개수 힌트.` + COMMON,
  render(api) {
    const C = [['노랑', '#e8b72f', '곡류'], ['빨강', '#d44b3d', '고기·생선·달걀·콩류'], ['초록', '#3c9a5c', '채소류'], ['보라', '#8a55c4', '과일류'], ['파랑', '#3b74c9', '우유·유제품류']];
    api.stage.appendChild(h('div', 'legend', C.map(c => `<span><i class="sw" style="background:${c[1]}"></i><b>${c[0]}</b> ${c[2]}</span>`).join('')));
    const menu = [['🍚', '현미밥'], ['🍳', '달걀말이'], ['🥬', '시금치나물'], ['🥛', '우유']], sol = [0, 1, 2, 4];
    const st = [-1, -1, -1, -1]; const tray = h('div', 'tray');
    menu.forEach(([e, n], i) => {
      const d = h('div', 'dish', `<div class="food">${e}</div><div class="fn">${n}</div>`); const b = h('button', '', '?');
      b.onclick = () => { st[i] = (st[i] + 1) % C.length; b.style.background = C[st[i]][1]; b.textContent = C[st[i]][0]; };
      d.appendChild(b); tray.appendChild(d);
    });
    api.stage.appendChild(tray);
    api.button('🔓 열기', () => {
      if (st.includes(-1)) return api.bad('네 칸 모두 색을 골라 주세요.');
      const ok = st.filter((v, i) => v === sol[i]).length;
      if (ok === 4) api.solve('노랑-빨강-초록-파랑! 네 가지 식품군이 고루 든 균형 잡힌 식판이에요. (과일을 더하면 금상첨화)');
      else api.bad(`위치까지 맞은 색: ${ok}개`);
    });
  }
});

// ---------- 14 회전 원판형 ----------
TYPES.push({
  name: '회전 원판형', en: 'CIPHER WHEEL', icon: '🎡', mech: '코드 입력', short: '원판을 돌려 해독', isNew: true,
  q: '안쪽 숫자 원판을 돌려 단서 카드의 지시대로 맞춘 뒤, <b>세 자리 코드</b>를 입력하세요.',
  tip: {
    when: '실물 방탈출의 <b>“암호 원판”</b> 느낌을 화면으로. 조작하는 재미가 있어 집중도가 높아요.',
    unit: '소비 · 녹색 소비와 지속가능한 생활', time: '3~4분', level: 4,
    assess: '원판 위 다른 낱말(탄소중립 등)을 찾아 뜻을 쓰게 하면 <b>개념 확장 과제</b>가 돼요.',
    ideas: '식품 보관법 원판, 섬유 이름 원판, 생애주기 과업 원판, 인쇄해서 실물 원판으로 병행',
    caution: '원판 칸은 8칸이 읽기 편해요. 정답 낱말 글자가 원판에 두 번 나오지 않게 하세요.'
  },
  prompt: `가정과 방탈출 웹앱에 [회전 원판형] 암호 문제를 만들어 줘.

■ 바깥 원판(고정, 8칸): [녹, 탄, 색, 중, 소, 립, 비, 환]
■ 안쪽 원판(회전, 8칸): 숫자 1~8
■ 단서 카드: ["녹" 아래에 숫자 1이 오도록 돌린 뒤, "색"·"소"·"비" 아래 숫자를 차례로 입력하라]
■ 정답: [357]
■ 화면: SVG로 두 겹 원판 그리기, ◀ ▶ 버튼(또는 드래그)으로 안쪽 원판 45°씩 회전, 회전 애니메이션.
■ 처음 위치는 정답이 아닌 상태로 시작.` + COMMON,
  render(api) {
    const outer = ['녹', '탄', '색', '중', '소', '립', '비', '환']; let rot = 3;
    const S = 280, cx = 140, cy = 140; const ns = 'http://www.w3.org/2000/svg';
    const wrap = h('div', 'wheel-box'); const wbox = h('div', 'wheel');
    let svg = `<svg viewBox="0 0 ${S} ${S}" xmlns="${ns}"><circle cx="${cx}" cy="${cy}" r="136" fill="#2a2318"/><circle cx="${cx}" cy="${cy}" r="132" fill="#f4ead3"/>`;
    outer.forEach((s, i) => { const a = (i * 45 - 90) * Math.PI / 180; svg += `<line x1="${cx}" y1="${cy}" x2="${cx + 132 * Math.cos(a + Math.PI / 8)}" y2="${cy + 132 * Math.sin(a + Math.PI / 8)}" stroke="#c9b48a" stroke-width="1.5"/><text x="${cx + 112 * Math.cos(a)}" y="${cy + 112 * Math.sin(a)}" text-anchor="middle" dominant-baseline="central" font-size="22" font-weight="900" fill="#2a2318">${s}</text>`; });
    svg += `<g class="inner" style="transform-origin:${cx}px ${cy}px"><circle cx="${cx}" cy="${cy}" r="88" fill="#2a2318"/>`;
    for (let k = 0; k < 8; k++) { const a = (k * 45 - 90) * Math.PI / 180; svg += `<text x="${cx + 66 * Math.cos(a)}" y="${cy + 66 * Math.sin(a)}" text-anchor="middle" dominant-baseline="central" font-size="22" font-weight="700" fill="#e8b44f" font-family="Space Mono, monospace">${k + 1}</text>`; }
    svg += `<circle cx="${cx}" cy="${cy}" r="30" fill="#cf4a3c"/><text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central" font-size="18" fill="#fff">🌱</text></g></svg>`;
    wbox.innerHTML = svg;
    const ctl = h('div', 'wheel-ctl'); const l = h('button', '', '⟲'), r = h('button', '', '⟳'); ctl.append(l, r); wbox.appendChild(ctl);
    const inner = $('.inner', wbox);
    // inner number k(0-based) sits under outer index (k + rot) mod 8
    const apply = () => { inner.style.transform = `rotate(${rot * 45}deg)`; };
    l.onclick = () => { rot--; apply(); }; r.onclick = () => { rot++; apply(); };
    apply();
    const clue = h('div', 'cluecard', `<b>🗝️ 단서 카드</b><br>① 바깥 원판의 <b>“녹”</b> 아래에 숫자 <b>1</b>이 오도록 안쪽 원판을 돌려라.<br>② 그때 <b>“색” → “소” → “비”</b> 아래의 숫자를 차례로 적어라.<br><br><div class="ansrow" style="justify-content:flex-start"><input id="whl" inputmode="numeric" maxlength="3" placeholder="세 자리" style="width:130px"></div>`);
    wrap.append(wbox, clue); api.stage.appendChild(wrap);
    const check = () => {
      if ($('#whl').value.trim() === '357') api.solve('녹·색·소·비 = “녹색소비”! 원판에는 “탄소중립”도 숨어 있어요. 환경을 생각하는 소비가 다음 방의 열쇠!');
      else api.bad(((rot % 8) + 8) % 8 === 0 ? '원판 위치는 맞아요. 숫자를 다시 읽어 보세요.' : '먼저 “녹” 아래에 1이 오도록 원판을 돌려 보세요.');
    };
    $('#whl').addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
    api.button('코드 입력', check);
  }
});

// ---------- 15 경로 탐색형 ----------
TYPES.push({
  name: '경로 탐색형', en: 'PATHFINDER', icon: '🗺️', mech: '탐색', short: '조건 맞는 길 찾기', isNew: true,
  q: '마트 입구(🛒)에서 계산대(💳)까지 이동하며 장보기 목록 3가지를 모두 담으세요. <b>🍭 충동구매 칸은 지나갈 수 없어요.</b> 칸을 위·아래·옆으로 한 칸씩 이어서 누르고, 마지막 칸을 다시 누르면 되돌아가요.',
  tip: {
    when: '<b>여러 조건을 동시에 만족</b>하는 계획 세우기. 합리적 소비·동선 계획 단원과 찰떡이에요.',
    unit: '소비 · 계획적 구매와 충동구매', time: '3~5분', level: 4,
    assess: '“가장 짧은 경로”를 추가 조건으로 주고 경로 길이를 비교하면 <b>최적화 사고</b>를 평가할 수 있어요.',
    ideas: '주방 작업 삼각형 동선, 화재 시 대피 경로, 친환경 등굣길, 생애 설계 진로 지도',
    caution: '정답 경로가 최소 하나는 있는지 꼭 직접 확인하세요. 5×5 칸이 태블릿에서 누르기 적당해요.'
  },
  prompt: `가정과 방탈출 웹앱에 [경로 탐색형] 문제를 만들어 줘.

■ 상황: [마트 입구에서 계산대까지 장보기 목록을 모두 담고 충동구매 칸은 피하기]
■ 지도(5×5): 출발 (0,0), 도착 (4,4), 필수 칸 [🥛우유, 🥚달걀, 🥬채소], 금지 칸 [🍭충동구매] 여러 개
■ 조작: 출발 칸에서 시작해 상하좌우로 인접한 칸만 이어서 탭. 마지막 칸을 다시 탭하면 한 칸 되돌리기. 금지 칸을 누르면 흔들림 + 안내.
■ 화면: 지나간 칸에 순서 번호, 장보기 목록에 담은 품목 체크 표시.
■ 판정: 도착 칸에 닿았을 때 필수 칸을 모두 지났으면 성공. 정답 경로가 존재하는지 먼저 검증해 줘.` + COMMON,
  render(api) {
    const M = ['S.T..', 'M..ET', '.TT..', '..V.T', 'T...G'];
    const icon = { S: '🛒', T: '🍭', M: '🥛', E: '🥚', V: '🥬', G: '💳', '.': '' };
    const need = { M: '🥛 우유', E: '🥚 달걀', V: '🥬 채소' };
    const shop = h('div', 'shop', Object.entries(need).map(([k, v]) => `<span data-k="${k}">${v}</span>`).join(''));
    const g = h('div', 'maze'); api.stage.append(shop, g);
    const cells = []; let path = [[0, 0]];
    for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
      const t = M[r][c]; const d = h('div', 'cell' + (t === 'T' ? ' trap' : ''), icon[t]); d.dataset.r = r; d.dataset.c = c; cells.push(d); g.appendChild(d);
      d.onclick = () => click(r, c, d);
    }
    const at = (r, c) => cells[r * 5 + c];
    function draw() {
      cells.forEach(d => { d.classList.remove('on', 'tip'); const s = d.querySelector('.st'); if (s) s.remove(); });
      path.forEach(([r, c], i) => { const d = at(r, c); d.classList.add('on'); if (i) d.insertAdjacentHTML('beforeend', `<span class="st">${i}</span>`); });
      const [lr, lc] = path[path.length - 1]; at(lr, lc).classList.add('tip');
      $$('span', shop).forEach(s => s.classList.toggle('got', path.some(([r, c]) => M[r][c] === s.dataset.k)));
    }
    function click(r, c, d) {
      const [lr, lc] = path[path.length - 1];
      if (r === lr && c === lc) { if (path.length > 1) { path.pop(); draw(); } return; }
      if (path.some(([pr, pc]) => pr === r && pc === c)) return api.info('이미 지나간 칸이에요. 마지막 칸을 눌러 되돌아가세요.');
      if (Math.abs(r - lr) + Math.abs(c - lc) !== 1) { shake(d); return api.info('바로 옆(상하좌우) 칸만 갈 수 있어요.'); }
      if (M[r][c] === 'T') { shake(d); return api.bad('🍭 충동구매의 유혹! 이 칸은 피해 가세요.'); }
      path.push([r, c]); draw(); api.info('');
      if (M[r][c] === 'G') {
        const miss = Object.keys(need).filter(k => !path.some(([pr, pc]) => M[pr][pc] === k));
        if (!miss.length) api.solve(`${path.length - 1}칸 만에 장보기 완료! 목록대로 사고 충동구매를 피했어요.`);
        else api.bad(`계산대에 왔지만 ${miss.map(k => need[k]).join(', ')}을(를) 못 담았어요. 되돌아가세요.`);
      }
    }
    draw();
  }
});

// ---------- 16 분기 시나리오형 ----------
TYPES.push({
  name: '분기 시나리오형', en: 'BRANCHING STORY', icon: '🧭', mech: '선택', short: '선택에 따라 결말', isNew: true,
  q: '용돈 <b>3만 원</b>으로 일주일을 버텨야 해요! 상황마다 더 현명한 선택을 해서 <b>해피 엔딩</b>에 도착하세요.',
  tip: {
    when: '정답이 하나가 아닌 <b>의사결정·가치 판단</b> 주제. 선택의 결과를 바로 체험하게 할 때 좋아요.',
    unit: '소비 · 용돈 관리와 의사결정 / 생애설계', time: '4~6분', level: 3,
    assess: '배드 엔딩에 간 선택을 골라 “다르게 했다면?”을 쓰게 하면 <b>성찰 일지</b>가 돼요.',
    ideas: '생애 설계 갈림길, 갈등 상황 대화 선택, 식사 선택에 따른 하루 영양 결과, 이사 집 고르기',
    caution: '오답 선택지도 학생이 진짜 고를 법하게 쓰고, 배드 엔딩에서는 꾸짖기보다 이유를 알려 주세요.'
  },
  prompt: `가정과 방탈출 웹앱에 [분기 시나리오형] 문제를 만들어 줘.

■ 상황: [용돈 3만 원으로 일주일 버티기]
■ 장면(3~4개) 예시:
  - [월: 친구가 한정판 키링(1만5천 원)을 같이 사자고 함 → A 바로 산다(배드) / B 예산표를 보고 다음 주로 미룬다(진행)]
  - [수: 필요 없는 1+1 음료 → A 이득이니 산다(배드) / B 필요한 물만 산다(진행)]
  - [금: 친구 생일 선물 → A 남은 예산 안에서 고른다(해피) / B 부모님께 가불(배드)]
■ 화면: 남은 금액 표시, 지나온 선택 경로(빵부스러기), 배드 엔딩이면 이유 설명 + '이 장면 다시' 버튼.
■ 판정: 해피 엔딩 도착 시 성공.` + COMMON,
  render(api) {
    const scenes = [
      { day: 'MON', money: 30000, t: '친구가 “이 한정판 키링 같이 사자! 1만 5천 원이래!”라고 해요. 이번 주 용돈의 절반이에요.',
        c: [['바로 산다! 한정판은 지금 아니면 못 사.', '남은 1만 5천 원으로 6일을 버티다가 목요일에 교통카드 충전도 못 했어요. 사고 싶은 것과 필요한 것을 먼저 구별해야 해요.'], ['예산표를 확인하고, 꼭 갖고 싶으면 다음 주에 사기로 한다.', null, 0]] },
      { day: 'WED', money: 26000, t: '편의점에 들렀더니 음료가 1+1이에요. 지금 목은 마르지 않지만 2개에 2,400원이에요.',
        c: [['1+1이면 이득이지! 일단 산다.', '필요하지 않은 물건은 할인해도 ‘절약’이 아니라 ‘지출’이에요. 결국 음료는 가방에서 미지근해졌어요.'], ['필요한 만큼만, 마실 물 한 병(800원)만 산다.', null, 800]] },
      { day: 'FRI', money: 25200, t: '내일이 친구 생일이에요! 선물을 사야 하는데 아직 교통비 1만 원도 남겨 둬야 해요.',
        c: [['부모님께 다음 주 용돈을 미리 달라고 해서 3만 원짜리 선물을 산다.', '가불은 다음 주의 나에게 빚을 지는 것과 같아요. 다음 주 용돈이 시작부터 부족해져요.'], ['남은 돈에서 교통비를 빼고, 그 안에서 마음이 담긴 선물을 고른다.', null, 12000]] },
    ];
    const box = h('div', 'story'); api.stage.appendChild(box); let i = 0; const crumbs = [];
    function show() {
      if (i >= scenes.length) {
        box.innerHTML = `<div class="crumbs">${crumbs.map(c => `<span>${c}</span>`).join('')}</div><div class="scene"><div class="day">SUN · HAPPY ENDING</div><p>🎉 선물까지 사고도 교통비를 포함해 <b>1만 3,200원</b>이 남아 일주일을 무사히 버텐어요! 계획 → 비교 → 필요 판단, 이 세 단계가 현명한 소비의 열쇠예요.</p></div>`;
        return api.solve('탈출 코드: <b>계획소비</b>');
      }
      const s = scenes[i];
      box.innerHTML = `<div class="crumbs">${crumbs.map(c => `<span>${c}</span>`).join('')}</div><div class="scene"><span class="money">💰 ${s.money.toLocaleString()}원</span><div class="day">${s.day}</div><p>${s.t}</p></div>`;
      const sc = $('.scene', box);
      shuffle(s.c).forEach(([label, bad]) => {
        const b = h('button', 'choice', label); sc.appendChild(b);
        b.onclick = () => {
          if (bad) { $$('.choice', sc).forEach(x => x.disabled = true); const be = h('div', 'bad-end', `💥 <b>배드 엔딩</b><br>${bad}<br>`); const re = h('button', 'btn btn-ink', '이 장면 다시'); re.style.marginTop = '8px'; re.onclick = show; be.appendChild(re); sc.appendChild(be); api.info(''); }
          else { crumbs.push(s.day + ' ✔'); i++; show(); }
        };
      });
    }
    show();
  }
});

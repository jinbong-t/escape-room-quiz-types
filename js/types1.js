const COMMON = `
■ 공통 조건
- HTML·CSS·JS를 한 파일(index.html)에 담아 줘. 외부 서버나 로그인 없이 동작해야 해.
- 마우스와 태블릿·휴대폰 터치에서 모두 조작되게 해 줘(pointer 이벤트 사용).
- 중학교 1학년이 읽기 쉬운 문장으로 쓰고, 오답이면 화면을 살짝 흔들고 힌트를 한 줄 보여 줘.
- 정답이면 "탈출 성공!" 메시지와 함께 다음 방 열쇠 [예: 숫자 코드 2580]를 보여 줘.
- '다시 하기' 버튼을 넣고, 문제 항목은 코드 맨 위 배열에 모아 두어 내가 쉽게 바꿀 수 있게 해 줘.`;

const TYPES = [];

// ---------- 01 순서 배열형 ----------
TYPES.push({
  name: '순서 배열형', en: 'SEQUENCE', icon: '🔢', mech: '드래그', short: '단계를 순서대로', isNew: false,
  q: '어묵탕을 끓이려고 해요. 조리 단계 카드를 끌어서(또는 ▲▼ 버튼으로) 올바른 순서로 배열하세요.',
  tip: {
    when: '조리 과정, 세탁 순서, 응급처치 절차처럼 <b>“순서”가 핵심 지식</b>인 차시의 도입·정리',
    unit: '식생활 · 조리 실습', time: '2~3분', level: 2,
    assess: '실습 전 사전 점검으로 쓰고, 순서를 바꾼 이유를 말하게 하면 <b>사고 과정 관찰</b>이 가능해요.',
    ideas: '손 씻기 6단계, 세탁기 사용 순서, 장보기 → 보관 → 조리 흐름, 생애주기 단계 배열',
    caution: '카드는 5~6장이 적당해요. 7장이 넘으면 추론보다 시행착오로 풀게 돼요.'
  },
  prompt: `가정과 방탈출 웹앱에 [순서 배열형] 문제를 만들어 줘.

■ 주제: [어묵탕 끓이기 조리 순서]
■ 카드(정답 순서대로): [육수 끓이기 → 무 넣고 익히기 → 어묵 넣기 → 간장으로 간 맞추기 → 대파 넣고 불 끄기]
■ 조작: 카드가 섞인 채로 나오고, 끌어다 놓거나 ▲▼ 버튼으로 순서를 바꿔.
■ 판정: '정답 확인'을 누르면 전체 순서가 맞는지 확인하고, 틀리면 몇 번째 카드부터 틀렸는지 힌트를 줘.` + COMMON,
  render(api) {
    const steps = ['냄비에 물과 멸치·다시마를 넣고 육수를 끓인다', '무를 납작하게 썰어 넣고 익힌다', '어묵을 꼬치에 끼워 넣고 한소끔 끓인다', '국간장으로 간을 맞춘다', '대파를 송송 썰어 넣고 불을 끈다'];
    const order = shuffledNot(steps.map((s, i) => i), a => a.every((v, i) => v === i));
    const list = h('div', 'seq'); api.stage.appendChild(list);
    const renum = () => $$('.card', list).forEach((c, i) => c.querySelector('.num').textContent = i + 1);
    order.forEach(i => {
      const c = h('div', 'card', `<span class="num"></span><span>${steps[i]}</span><span class="ud"><button aria-label="위로">▲</button><button aria-label="아래로">▼</button></span>`);
      c.dataset.i = i;
      const [up, dn] = c.querySelectorAll('button');
      up.onpointerdown = dn.onpointerdown = e => e.stopPropagation();
      up.onclick = () => { if (c.previousElementSibling) list.insertBefore(c, c.previousElementSibling); renum(); };
      dn.onclick = () => { if (c.nextElementSibling) list.insertBefore(c.nextElementSibling, c); renum(); };
      makeDrag(c, {
        dropSelector: '.seq .card',
        onOver(t, x, y) {
          if (!t || t === c) return; const r = t.getBoundingClientRect();
          if (y < r.top + r.height / 2) list.insertBefore(c, t); else list.insertBefore(c, t.nextSibling); renum();
        }, onDrop() { renum(); }
      });
      list.appendChild(c);
    });
    renum();
    api.button('정답 확인', () => {
      const cur = $$('.card', list).map(c => +c.dataset.i);
      const wrong = cur.findIndex((v, i) => v !== i);
      if (wrong < 0) api.solve('육수 → 무 → 어묵 → 간 → 대파. 단단한 재료부터 넣는 게 조리 순서의 핵심이에요.');
      else api.bad(`${wrong + 1}번째 단계부터 다시 생각해 보세요. (익는 데 오래 걸리는 재료는?)`);
    });
  }
});

// ---------- 02 매칭 연결형 ----------
TYPES.push({
  name: '매칭 연결형', en: 'MATCHING', icon: '🔗', mech: '연결', short: '짝을 선으로', isNew: false,
  q: '5대 영양소와 그 기능을 선으로 연결하세요. 왼쪽 카드를 오른쪽 카드로 끌거나, 왼쪽 → 오른쪽 순서로 차례로 누르면 연결돼요.',
  tip: {
    when: '용어 ↔ 뜻, 원인 ↔ 결과처럼 <b>1:1 대응 관계</b>를 확인할 때',
    unit: '식생활 · 영양소', time: '2~3분', level: 3,
    assess: '형성평가로 쓰고, 연결 근거를 짝에게 설명하게 하면 <b>동료 평가</b>로 확장돼요.',
    ideas: '섬유 ↔ 특징, 주거 공간 ↔ 기능, 가족 형태 ↔ 정의, 식품 표시 마크 ↔ 의미',
    caution: '오른쪽 설명이 서로 비슷하면 혼란이 커요. 핵심 단어 하나로 구별되게 써 주세요.'
  },
  prompt: `가정과 방탈출 웹앱에 [매칭 연결형] 문제를 만들어 줘.

■ 주제: [5대 영양소와 기능]
■ 짝: [탄수화물-주된 에너지원 / 단백질-몸의 구성 / 지방-농축 에너지·체온 유지 / 무기질-뼈와 이 구성 / 비타민-몸의 기능 조절]
■ 조작: 왼쪽 카드에서 오른쪽 카드로 끌어 선을 긋거나, 왼쪽 → 오른쪽 차례로 탭해서 연결. 다시 연결하면 기존 선이 바뀜. 오른쪽은 섞어서 배치.
■ 화면: "0 / 5 연결됨" 진행 표시, SVG로 선 그리기.
■ 판정: 모두 연결 후 '정답 확인' → 틀린 개수만 알려 줘.` + COMMON,
  render(api) {
    const pairs = [['탄수화물', '뇌와 몸의 주된 에너지원'], ['단백질', '근육·혈액 등 몸을 구성'], ['지방', '농축된 에너지원, 체온 유지'], ['무기질', '뼈와 이를 단단하게 구성'], ['비타민', '적은 양으로 몸의 기능 조절']];
    const wrap = h('div', 'match'); const L = h('div', 'col'), R = h('div', 'col');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    wrap.append(L, R, svg); api.stage.appendChild(wrap);
    const prog = h('div', 'hint'); api.stage.appendChild(prog);
    const links = {}; let selL = null, temp = null;
    pairs.forEach((p, i) => { const c = h('div', 'card m-l', p[0]); c.dataset.i = i; L.appendChild(c); });
    shuffle(pairs.map((p, i) => i)).forEach(i => { const c = h('div', 'card m-r', pairs[i][1]); c.dataset.i = i; R.appendChild(c); });
    const pt = (el, side) => { const w = wrap.getBoundingClientRect(), r = el.getBoundingClientRect(); return [side === 'l' ? r.right - w.left : r.left - w.left, r.top - w.top + r.height / 2]; };
    const line = (a, b, color, dash) => { const l = document.createElementNS(svg.namespaceURI, 'line'); l.setAttribute('x1', a[0]); l.setAttribute('y1', a[1]); l.setAttribute('x2', b[0]); l.setAttribute('y2', b[1]); l.setAttribute('stroke', color); l.setAttribute('stroke-width', 3); l.setAttribute('stroke-linecap', 'round'); if (dash) l.setAttribute('stroke-dasharray', '6 5'); svg.appendChild(l); return l; };
    function draw() {
      svg.innerHTML = '';
      $$('.m-l', L).forEach(l => { const r = links[l.dataset.i]; l.classList.toggle('done', r != null); l.classList.toggle('sel', l === selL); });
      $$('.m-r', R).forEach(r => r.classList.toggle('done', Object.values(links).includes(r.dataset.i)));
      Object.entries(links).forEach(([li, ri]) => line(pt($(`.m-l[data-i="${li}"]`, L), 'l'), pt($(`.m-r[data-i="${ri}"]`, R), 'r'), '#2a2318'));
      prog.textContent = `${Object.keys(links).length} / ${pairs.length} 연결됨`;
    }
    function connect(l, r) {
      for (const k in links) if (links[k] === r.dataset.i) delete links[k];
      links[l.dataset.i] = r.dataset.i; selL = null; draw();
    }
    $$('.m-l', L).forEach(l => l.addEventListener('pointerdown', e => {
      e.preventDefault(); selL = l; draw(); const a = pt(l, 'l'); let moved = false;
      const mv = ev => { const w = wrap.getBoundingClientRect(); if (temp) temp.remove(); temp = line(a, [ev.clientX - w.left, ev.clientY - w.top], '#cf4a3c', true); moved = true; };
      const up = ev => {
        window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up);
        if (temp) { temp.remove(); temp = null; }
        const t = document.elementFromPoint(ev.clientX, ev.clientY); const r = t && t.closest('.m-r');
        if (r && moved) connect(l, r);
      };
      window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
    }));
    $$('.m-r', R).forEach(r => r.addEventListener('click', () => { if (selL) connect(selL, r); else api.info('먼저 왼쪽 영양소 카드를 고르세요.'); }));
    const ro = new ResizeObserver(draw); ro.observe(wrap);
    draw();
    api.button('정답 확인', () => {
      const n = Object.keys(links).length; if (n < pairs.length) return api.bad(`아직 ${pairs.length - n}개가 연결되지 않았어요.`);
      const wrong = Object.entries(links).filter(([a, b]) => a !== b).length;
      if (!wrong) api.solve('영양소 이름과 기능을 모두 맞게 연결했어요.'); else api.bad(`${wrong}개의 연결이 틀렸어요. ‘구성’과 ‘조절’ 영양소를 구별해 보세요.`);
    });
  }
});

// ---------- 03 다이얼 코드형 ----------
TYPES.push({
  name: '다이얼 코드형', en: 'DIAL LOCK', icon: '🔐', mech: '코드 입력', short: '계산 → 자물쇠', isNew: false,
  q: '우유 1팩은 780원이에요. 일주일 동안 매일 마시려고 6팩을 샀다면 모두 얼마일까요? 답을 4자리 자물쇠에 맞추세요.',
  tip: {
    when: '계산·추론 결과가 <b>숫자 하나</b>로 떨어지는 문제. 방탈출의 “마지막 자물쇠”로 가장 무난해요.',
    unit: '소비 · 합리적 구매', time: '2~4분', level: 1,
    assess: '풀이 과정을 활동지에 쓰게 하고 자물쇠는 결과만 확인 → <b>과정·결과 분리 평가</b>',
    ideas: '단위 가격 비교, 1일 권장 열량 계산, 가계부 잔액, 세탁 표시 숫자(물 온도)',
    caution: '답이 0으로 시작하거나 자릿수가 다르면 혼란이 생겨요. 자릿수를 문제에 꼭 밝혀 주세요.'
  },
  prompt: `가정과 방탈출 웹앱에 [다이얼 코드형] 자물쇠 문제를 만들어 줘.

■ 문제: [우유 1팩 780원, 6팩을 샀을 때 총액은?]
■ 정답: [4680] (4자리)
■ 화면: 상황을 그림 카드(이모지)로 보여 주고, 아래에 숫자 다이얼 4개(각각 ▲▼로 0~9 회전).
■ 판정: '열기' 버튼 → 맞으면 자물쇠가 열리는 애니메이션, 틀리면 "몇 자리가 맞는지"만 알려 줘.` + COMMON,
  render(api) {
    const facts = h('div', 'facts', `<div class="fact"><span class="e">🥛</span>1팩 780원</div><div class="fact"><span class="e">✖️</span>6팩</div><div class="fact"><span class="e">💰</span>총액 = ?</div>`);
    const d = h('div', 'dial'); const vals = [0, 0, 0, 0];
    vals.forEach((v, i) => {
      const col = h('div', 'dcol'); const up = h('button', '', '▲'), n = h('div', 'dnum', '0'), dn = h('button', '', '▼');
      up.onclick = () => { vals[i] = (vals[i] + 1) % 10; n.textContent = vals[i]; };
      dn.onclick = () => { vals[i] = (vals[i] + 9) % 10; n.textContent = vals[i]; };
      col.append(up, n, dn); d.appendChild(col);
    });
    api.stage.append(facts, d);
    api.button('🔓 열기', () => {
      const ans = '4680'; const s = vals.join('');
      if (s === ans) api.solve('780 × 6 = 4,680원. 자물쇠가 열렸어요!');
      else { const ok = [...s].filter((c, i) => c === ans[i]).length; api.bad(`딸깍… 열리지 않아요. 위치까지 맞은 숫자: ${ok}개`); }
    });
  }
});

// ---------- 04 분류 드래그형 ----------
TYPES.push({
  name: '분류 드래그형', en: 'SORTING', icon: '🧺', mech: '드래그', short: '바구니로 분류', isNew: false,
  q: '다음 상황은 소비자의 어떤 권리와 관련 있을까요? 카드를 알맞은 바구니로 끌어 넣으세요. (카드를 누른 뒤 바구니를 눌러도 돼요)',
  tip: {
    when: '두세 개의 <b>개념 기준</b>으로 사례를 나누는 활동. 개념 구별이 헷갈리는 단원에 효과적이에요.',
    unit: '소비 · 소비자 권리', time: '3~4분', level: 2,
    assess: '틀린 카드를 골라 “왜 그렇게 분류했는지” 쓰게 하면 <b>오개념 진단</b> 자료가 돼요.',
    ideas: '천연섬유/합성섬유, 재활용/일반쓰레기, 욕구/필요, 고정 지출/변동 지출',
    caution: '어느 쪽으로도 볼 수 있는 애매한 사례는 빼세요. 논쟁은 토의 활동으로 따로!'
  },
  prompt: `가정과 방탈출 웹앱에 [분류 드래그형] 문제를 만들어 줘.

■ 주제: [소비자의 권리 구분]
■ 바구니: [안전할 권리] / [알 권리]
■ 카드와 정답:
  - [장난감에서 유해 물질이 나와 전량 회수되었다] → 안전할 권리
  - [과자 포장에 알레르기 유발 성분이 표시되어 있다] → 알 권리
  - (같은 형식으로 4~6장)
■ 조작: 카드를 끌어 바구니에 넣기 + 카드 탭 → 바구니 탭으로도 이동. 바구니 안 카드는 다시 꺼낼 수 있게.
■ 판정: 모든 카드를 넣은 뒤 '정답 확인' → 틀린 카드만 빨간 테두리.` + COMMON,
  render(api) {
    const items = [['어린이 장난감에서 유해 물질이 나와 전량 회수되었다', 0], ['과자 포장에 알레르기 유발 성분이 표시되어 있다', 1], ['전기장판 과열로 화재 위험이 있어 사용 중지를 알렸다', 0], ['같은 제품의 가격과 성능을 비교한 정보를 받았다', 1], ['헬멧은 안전 인증을 통과해야만 판매할 수 있다', 0], ['화장품 용기에 전성분과 사용 기한이 적혀 있다', 1]];
    const pool = h('div', 'pool'); const bs = h('div', 'baskets');
    const names = ['🛡️ 안전할 권리', '📢 알 권리'];
    const baskets = names.map((n, i) => { const b = h('div', 'basket', `<h4>${n}</h4>`); b.dataset.b = i; bs.appendChild(b); return b; });
    api.stage.append(pool, bs);
    let sel = null;
    const place = (c, target) => { (target || pool).appendChild(c); c.classList.remove('sel'); c.style.outline = ''; sel = null; };
    shuffle(items).forEach(([t, a]) => {
      const c = h('div', 'card', t); c.dataset.a = a; pool.appendChild(c);
      makeDrag(c, {
        dropSelector: '.basket, .pool',
        onOver(t) { baskets.forEach(b => b.classList.toggle('over', b === t)); },
        onDrop(t) { baskets.forEach(b => b.classList.remove('over')); if (t) place(c, t.classList.contains('pool') ? pool : t); },
        onTap() { if (sel) sel.classList.remove('sel'); sel = (sel === c) ? null : c; if (sel) c.classList.add('sel'); }
      });
    });
    [...baskets, pool].forEach(b => b.addEventListener('click', e => { if (sel && !e.target.closest('.card')) place(sel, b); }));
    api.button('정답 확인', () => {
      const left = $$('.card', pool).length; if (left) return api.bad(`아직 ${left}장의 카드가 남아 있어요.`);
      let wrong = 0;
      baskets.forEach(b => $$('.card', b).forEach(c => { const ok = c.dataset.a === b.dataset.b; c.style.outline = ok ? '' : '3px solid #cf4a3c'; if (!ok) wrong++; }));
      if (!wrong) api.solve('위험으로부터 보호받는 것은 ‘안전할 권리’, 정보를 제공받는 것은 ‘알 권리’예요.'); else api.bad(`빨간 테두리 카드 ${wrong}장을 다시 생각해 보세요.`);
    });
  }
});

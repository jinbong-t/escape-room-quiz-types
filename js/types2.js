// ---------- 05 손전등 탐색형 ----------
TYPES.push({
  name: '손전등 탐색형', en: 'FLASHLIGHT', icon: '🔦', mech: '탐색', short: '어둠 속 단서 찾기', isNew: false,
  q: '정전이 된 주방! 손전등(마우스 또는 손가락)을 움직여 <b>안전사고 위험 요소 3가지</b>를 찾아 누르세요.',
  tip: {
    when: '그림 속에서 <b>위험·문제 요소를 관찰</b>해 찾는 활동. 몰입감이 커서 도입 활동으로 좋아요.',
    unit: '주생활 · 생활 안전', time: '2~3분', level: 3,
    assess: '찾은 요소마다 “어떻게 고칠까?”를 쓰게 하면 <b>문제 해결 서술형</b>으로 이어져요.',
    ideas: '욕실 미끄럼 사고, 화재 위험 거실, 식중독 위험 냉장고, 공유 주방 위생 점검',
    caution: '태블릿에서는 손가락에 가려 잘 안 보여요. 빛 반경을 조금 넉넉하게 잡으세요.'
  },
  prompt: `가정과 방탈출 웹앱에 [손전등 탐색형] 문제를 만들어 줘.

■ 상황: [정전된 주방에서 안전사고 위험 요소 찾기]
■ 위험 요소(정답): [가스레인지 옆 행주 / 개수대 속 칼 / 콘센트 주변 물기]
■ 함정(안전한 물건): [냄비 받침, 소화기, 뚜껑 닫힌 양념통]
■ 화면: 화면 전체가 어둡고, 포인터 주변만 원형으로 밝아지는 손전등 효과(CSS radial-gradient). 물건은 이모지+이름표로 배치.
■ 판정: 위험 요소를 누르면 빨간 원 표시 + "1 / 3 발견", 함정을 누르면 "안전한 물건이에요" 안내. 3개 다 찾으면 성공.` + COMMON,
  render(api) {
    const box = h('div', 'dark'); box.innerHTML = '<div class="shelf"></div>';
    const items = [
      { e: '🔥', n: '가스레인지 옆 행주', x: 20, y: 38, hz: '불이 옮겨붙을 수 있어요 → 행주는 불에서 멀리!' },
      { e: '🔪', n: '개수대 속 칼', x: 54, y: 72, hz: '물속에 잠긴 칼은 보이지 않아 손을 벨 수 있어요 → 칼은 바로 씻어 칼꽂이에!' },
      { e: '🔌', n: '콘센트 주변 물기', x: 84, y: 34, hz: '감전·누전 위험 → 물기를 닦고 젖은 손으로 만지지 않기!' },
      { e: '🧯', n: '소화기', x: 8, y: 80 }, { e: '🍲', n: '냄비 받침', x: 38, y: 32 }, { e: '🧂', n: '양념통', x: 66, y: 30 }, { e: '🧤', n: '오븐 장갑', x: 80, y: 78 }, { e: '🧊', n: '냉장고', x: 92, y: 66 },
    ];
    const cnt = h('div', 'counter2', '0 / 3 발견'); const mask = h('div', 'mask');
    let found = 0;
    items.forEach(it => {
      const d = h('div', 'it' + (it.hz ? ' hz' : ''), `${it.e}<small>${it.n}</small>`);
      d.style.left = it.x + '%'; d.style.top = it.y + '%';
      d.onclick = () => {
        if (!it.hz) return api.info(`‘${it.n}’은(는) 안전한 물건이에요.`);
        if (d.classList.contains('found')) return;
        d.classList.add('found'); found++; cnt.textContent = `${found} / 3 발견`; api.info(`발견! ${it.hz}`);
        if (found === 3) api.solve('위험 요소 3가지를 모두 찾았어요. 정전 시에는 손전등을 먼저 켜고, 가스 밸브를 잠그세요.');
      };
      box.appendChild(d);
    });
    box.append(mask, cnt);
    const mv = e => { const r = box.getBoundingClientRect(); box.style.setProperty('--x', (e.clientX - r.left) + 'px'); box.style.setProperty('--y', (e.clientY - r.top) + 'px'); mask.style.setProperty('--x', (e.clientX - r.left) + 'px'); mask.style.setProperty('--y', (e.clientY - r.top) + 'px'); };
    box.addEventListener('pointermove', mv); box.addEventListener('pointerdown', mv);
    api.stage.appendChild(box);
    api.stage.appendChild(h('div', 'hint', '💡 이름표가 붙은 물건 중 안전한 물건도 섞여 있어요.'));
  }
});

// ---------- 06 클로즈 빈칸형 ----------
TYPES.push({
  name: '클로즈 빈칸형', en: 'CLOZE', icon: '💬', mech: '선택', short: '빈칸에 낱말 채우기', isNew: false,
  q: '방을 어지럽힌 동생에게 <b>나-전달법</b>으로 말하려고 해요. 아래 낱말 카드를 눌러 빈칸을 순서대로 채우세요. (빈칸을 누르면 다시 비워져요)',
  tip: {
    when: '대화문·안내문 속 <b>핵심 표현</b>을 고르게 하는 활동. 의사소통·관계 단원에 잘 맞아요.',
    unit: '가족 · 갈등 해결과 의사소통', time: '3분', level: 2,
    assess: '완성 후 같은 상황을 짝과 역할극으로 해 보면 <b>실천 수행평가</b>로 연결돼요.',
    ideas: '거절하기 대화, 사과 메시지, 식품 표시 안내문 빈칸, 세탁 표시 설명문',
    caution: '오답 카드는 “너-전달법”처럼 학생이 실제로 자주 쓰는 표현으로 만들면 학습 효과가 커요.'
  },
  prompt: `가정과 방탈출 웹앱에 [클로즈 빈칸형] 문제를 만들어 줘.

■ 상황: [동생이 방을 어지럽혀서 나-전달법으로 말하기]
■ 화면: 메신저 대화창 모양. 상대 말풍선 1개 + 내 말풍선 안에 빈칸 3개.
■ 빈칸 정답: [① 행동(사실) ② 나의 감정·영향 ③ 바라는 점]
■ 오답 카드: [넌 맨날 게을러 / 엄마한테 이를 거야 / 너 때문에 다 망했어]
■ 조작: 카드를 탭하면 다음 빈칸에 들어가고, 빈칸을 탭하면 비워짐.
■ 판정: 모두 채우고 '정답 확인' → 틀린 빈칸만 표시.` + COMMON,
  render(api) {
    const ans = ['바닥에 옷이 그대로 있으면', '발 디딜 곳이 없어서 속상해', '저녁 먹기 전까지 같이 치우면 좋겠어'];
    const decoys = ['넌 맨날 게을러서', '엄마한테 다 이를 거야', '너 때문에 짜증 나'];
    const chat = h('div', 'chat', `<div class="who">동생</div><div class="bub them">형, 나 지금 게임 중이야 😆 왜?</div><div class="bub me" id="mine">내가 들어왔는데 <span class="blank empty" data-k="0">①</span>, 나는 <span class="blank empty" data-k="1">②</span>. 그래서 <span class="blank empty" data-k="2">③</span>.</div>`);
    const words = h('div', 'words'); api.stage.append(chat, words);
    const fill = [null, null, null]; const blanks = $$('.blank', chat);
    const sync = () => { blanks.forEach((b, i) => { b.textContent = fill[i] == null ? '①②③'[i] : fill[i].dataset.w; b.classList.toggle('empty', fill[i] == null); b.style.background = ''; }); $$('.card', words).forEach(c => c.classList.toggle('used', fill.includes(c))); };
    shuffle([...ans, ...decoys]).forEach(w => { const c = h('div', 'card', w); c.dataset.w = w; c.onclick = () => { const k = fill.indexOf(null); if (k < 0) return api.info('빈칸이 다 찼어요. 빈칸을 눌러 비울 수 있어요.'); fill[k] = c; sync(); }; words.appendChild(c); });
    blanks.forEach((b, i) => b.onclick = () => { fill[i] = null; sync(); });
    api.button('정답 확인', () => {
      if (fill.includes(null)) return api.bad('빈칸을 모두 채워 주세요.');
      let wrong = 0; fill.forEach((c, i) => { if (c.dataset.w !== ans[i]) { wrong++; blanks[i].style.background = '#ffd0c8'; } });
      if (!wrong) api.solve('행동(사실) → 나의 감정 → 바라는 점. 상대를 탓하지 않고 내 마음을 전하는 나-전달법이에요.');
      else api.bad(`${wrong}개의 빈칸이 달라요. 상대를 비난하는 말은 나-전달법이 아니에요.`);
    });
  }
});

// ---------- 07 치환 암호형 ----------
TYPES.push({
  name: '치환 암호형', en: 'CIPHER', icon: '🧩', mech: '코드 입력', short: '암호표로 해독', isNew: false,
  q: '냉장고 문에 이상한 숫자가 적혀 있어요. 열쇠 쪽지에는 <b>“각 숫자에서 3을 빼라”</b>고 적혀 있어요. 암호표를 이용해 낱말을 해독하세요.',
  tip: {
    when: '핵심 용어를 <b>“해독해서 얻는 보상”</b>으로 만들 때. 다음 방 힌트로 연결하기 좋아요.',
    unit: '식생활 · 식품 보관과 위생', time: '3~5분', level: 2,
    assess: '해독한 낱말의 뜻을 설명하는 칸을 추가하면 <b>개념 이해 확인</b>까지 한 번에 돼요.',
    ideas: '식품 보관 방법, 섬유 이름, 친환경 마크 이름, 가족 가치 낱말',
    caution: '규칙은 한 가지(빼기·더하기·역순 등)만 쓰세요. 두 단계 이상이면 중학교 1학년에게 어려워요.'
  },
  prompt: `가정과 방탈출 웹앱에 [치환 암호형] 문제를 만들어 줘.

■ 정답 낱말: [냉장보관]
■ 암호표: 숫자 1~10 ↔ 음절 (정답 음절 + 함정 음절 섞기)
■ 열쇠 규칙: [각 숫자에서 3을 뺀다]
■ 화면: 큰 글씨 암호 [4-5-6-7], 아래 암호표, 열쇠 쪽지, 입력창.
■ 판정: 띄어쓰기 무시하고 비교. 오답이면 "첫 글자가 맞았는지"만 알려 줘.` + COMMON,
  render(api) {
    const syl = ['냉', '장', '보', '관', '실', '온', '동', '해', '상', '균'];
    const tb = h('table', 'keytbl'); tb.innerHTML = '<tr><th>숫자</th>' + syl.map((s, i) => `<th>${i + 1}</th>`).join('') + '</tr><tr><th>음절</th>' + syl.map(s => `<td>${s}</td>`).join('') + '</tr>';
    const wrap = h('div', ''); wrap.style.overflowX = 'auto'; wrap.appendChild(tb);
    const code = h('div', 'codeline', '4 - 5 - 6 - 7');
    const row = h('div', 'ansrow', '<input id="cip" placeholder="해독한 낱말" autocomplete="off">');
    api.stage.append(code, wrap, row);
    const check = () => {
      const v = $('#cip').value.replace(/\s/g, '');
      if (v === '냉장보관') api.solve('4-5-6-7 → 1-2-3-4 → 냉·장·보·관. 다음 방 힌트: 냉장고 온도는 0~5℃!');
      else api.bad(v[0] === '냉' ? '첫 글자는 맞았어요! 나머지도 3씩 빼 보세요.' : '숫자에서 3을 뺀 뒤 암호표를 다시 보세요.');
    };
    $('#cip').addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
    api.button('해독 확인', check);
  }
});

// ---------- 08 슬라이더형 ----------
TYPES.push({
  name: '슬라이더형', en: 'SLIDER', icon: '🎚️', mech: '추정', short: '근삿값 맞히기', isNew: false,
  q: '탄산음료 1캔에는 각설탕(1개 = 3g)이 약 <b>9개</b> 들어 있어요. 당류는 몇 g일까요? 슬라이더를 맞추세요. (오차 ±3g 허용)',
  tip: {
    when: '정확한 값보다 <b>양감(어림)</b>을 기르고 싶을 때. 숫자가 충격적일수록 기억에 남아요.',
    unit: '식생활 · 당류 줄이기', time: '1~2분', level: 1,
    assess: '먼저 직감으로 맞춘 값 → 계산 후 값을 비교해 쓰게 하면 <b>자기 성찰 기록</b>이 돼요.',
    ideas: '라면 1봉지 나트륨, 하루 물 섭취량, 가구 적정 실내 온도, 한 달 통신비',
    caution: '허용 오차를 너무 좁히면 운에 맡기게 돼요. 정답의 10% 안팎이 적당해요.'
  },
  prompt: `가정과 방탈출 웹앱에 [슬라이더형] 어림 문제를 만들어 줘.

■ 문제: [각설탕 1개=3g, 탄산음료 1캔에 9개 → 당류는 몇 g?]
■ 정답: [27] g, 허용 오차 [±3] g, 슬라이더 범위 [0~60]
■ 화면: 큰 숫자로 현재 값 표시, 값에 따라 각설탕 이모지 개수가 늘어나게.
■ 판정: '확정' → 범위 안이면 성공, 아니면 "더 많아요/더 적어요" 힌트.` + COMMON,
  render(api) {
    const w = h('div', 'sl-wrap', `<div class="can">🥤</div><div class="sl-val"><span id="slv">0</span> g</div><div class="cubes" id="cubes"></div><input type="range" min="0" max="60" value="0" id="sl"><div class="sl-scale"><span>0g</span><span>30g</span><span>60g</span></div>`);
    api.stage.appendChild(w);
    const sl = $('#sl'); const up = () => { $('#slv').textContent = sl.value; $('#cubes').textContent = '🟫'.repeat(Math.round(sl.value / 3)); };
    sl.oninput = up; up();
    api.button('확정', () => {
      const v = +sl.value; if (Math.abs(v - 27) <= 3) api.solve(`정답은 27g (3g × 9개). 선택한 값 ${v}g — 하루 권장 첨가당의 절반을 넘는 양이에요!`);
      else api.bad(v < 27 ? '그보다 더 많아요! 3g × 9개를 계산해 보세요.' : '그보다 적어요!');
    });
  }
});

// ---------- 09 정보비대칭 협동형 ----------
TYPES.push({
  name: '정보비대칭 협동형', en: 'INFO GAP', icon: '👨‍👩‍👧‍👦', mech: '협동', short: '단서를 나눠 가짐', isNew: false,
  q: '가족회의를 하려면 온 가족이 집에 모여야 해요. 가족 카드를 하나씩 눌러 단서를 확인하고, <b>네 명이 모두 집에 있는 가장 이른 시각</b>을 고르세요.',
  tip: {
    when: '모둠원이 <b>서로 다른 단서</b>를 하나씩 가지고 말로 공유해야만 풀리는 구조. 협력·소통 역량에 최고!',
    unit: '가족 · 가족 관계와 협력', time: '5~7분 (모둠)', level: 3,
    assess: '모둠 내 발화를 관찰 체크리스트로 기록 → <b>협업 역량 관찰 평가</b>',
    ideas: '가족 식단 짜기(구성원별 알레르기·취향), 이사 집 고르기, 가족 여행 예산 맞추기',
    caution: '수업에서는 각 학생 기기에 단서 하나만 보이도록 역할을 나눠 주세요(예: 출석번호별 화면).'
  },
  prompt: `가정과 방탈출 웹앱에 [정보비대칭 협동형] 문제를 만들어 줘.

■ 상황: [온 가족이 모일 수 있는 가장 이른 시각 찾기]
■ 역할과 단서:
  - [아빠: 7시에 퇴근하고 집까지 1시간 걸린다]
  - [엄마: 6시~8시 30분 요가, 집에서 5분 거리]
  - [누나: 학원이 9시에 끝나고 학원은 집 바로 앞]
  - [나: 9시 30분부터 온라인 수업]
■ 정답: [21:00]
■ 조작: 처음 화면에서 '역할 고르기' → 고른 역할의 단서만 보임(협동 모드). 교사용 '모든 단서 보기' 버튼도 만들어 줘.
■ 정답 입력: 시·분 드롭다운.` + COMMON,
  render(api) {
    const fam = [['👨', '아빠', '나는 저녁 7시에 퇴근해. 회사에서 집까지 1시간이 걸려.'], ['👩', '엄마', '나는 6시부터 8시 30분까지 요가 수업이 있어. 요가원은 집에서 5분 거리야.'], ['👧', '누나', '내 학원은 밤 9시에 끝나. 학원은 우리 집 바로 앞이야.'], ['🧒', '나', '나는 9시 30분부터 온라인 강의를 들어야 해서 그 전에 회의를 끝내야 해.']];
    const g = h('div', 'fam');
    fam.forEach(([a, n, c]) => { const m = h('div', 'mem hid', `<div class="av">${a}</div><div class="nm">${n}</div><div class="cl">${c}</div>`); m.onclick = () => { m.classList.remove('hid'); m.classList.add('open'); }; g.appendChild(m); });
    const hh = [18, 19, 20, 21, 22].map(x => `<option>${x}</option>`).join(''), mm = ['00', '10', '20', '30', '40', '50'].map(x => `<option>${x}</option>`).join('');
    const row = h('div', 'ansrow', `<select id="hh">${hh}</select><b style="font-size:22px">:</b><select id="mm">${mm}</select>`);
    api.stage.append(g, row, h('div', 'hint', '👥 수업에서는 모둠원 4명이 카드 하나씩만 보고, 말로만 정보를 나누게 해 보세요.'));
    api.button('시각 확정', () => {
      const v = $('#hh').value + ':' + $('#mm').value;
      if (v === '21:00') api.solve('아빠 8:00, 엄마 8:35, 누나 9:00 도착 → 밤 9시에 모두 모여요. 나의 수업(9:30) 전까지 30분 회의 가능!');
      else api.bad('가장 늦게 도착하는 사람은 누구인지 따져 보세요.');
    });
  }
});

// ---------- 10 메모리 매칭형 ----------
TYPES.push({
  name: '메모리 매칭형', en: 'MEMORY', icon: '🃏', mech: '선택', short: '카드 뒤집어 짝 찾기', isNew: false,
  q: '카드를 두 장씩 뒤집어 <b>소비자 권리 용어</b>와 그 <b>뜻</b>을 짝지으세요. 4쌍을 모두 찾으면 탈출!',
  tip: {
    when: '외워야 할 용어가 있을 때 <b>반복 노출</b>을 놀이처럼. 정리 단계나 쉬는 시간 퀴즈로 좋아요.',
    unit: '소비 · 소비자 권리와 책임', time: '2~4분', level: 2,
    assess: '뒤집은 횟수를 기록해 1차 → 2차 도전 비교 → <b>향상도 확인</b>',
    ideas: '섬유 이름↔그림, 영양소↔대표 식품, 주거 용어↔뜻, 가족 형태↔예시',
    caution: '쌍은 4~6개가 적당해요. 뜻 카드는 15자 안팎으로 짧게!'
  },
  prompt: `가정과 방탈출 웹앱에 [메모리 매칭형] 카드 뒤집기 문제를 만들어 줘.

■ 짝(용어-뜻): [안전할 권리-생명·신체의 위험으로부터 보호받을 권리 / 알 권리-선택에 필요한 정보를 제공받을 권리 / 선택할 권리-자유롭게 물품을 선택할 권리 / 보상받을 권리-피해를 신속·공정하게 보상받을 권리]
■ 화면: 8장 카드 격자, 뒤집기 애니메이션(CSS 3D), 시도 횟수 표시.
■ 규칙: 두 장 뒤집어 짝이면 고정, 아니면 1초 뒤 다시 덮기. 모두 맞히면 성공.` + COMMON,
  render(api) {
    const pairs = [['안전할 권리', '생명·신체의 위험으로부터 보호받을 권리'], ['알 권리', '선택에 필요한 정보를 제공받을 권리'], ['선택할 권리', '자유로운 의사로 물품을 고를 권리'], ['보상받을 권리', '피해를 신속·공정하게 보상받을 권리']];
    const cards = shuffle(pairs.flatMap((p, i) => [{ i, t: p[0], term: true }, { i, t: p[1] }]));
    const g = h('div', 'mgrid'); const info = h('div', 'hint', '시도 0회'); api.stage.append(g, info);
    let open = [], lock = false, tries = 0, ok = 0;
    cards.forEach(c => {
      const f = h('div', 'flip', `<div class="in"><div class="f">?</div><div class="b ${c.term ? 'term' : ''}">${c.t}</div></div>`);
      f.onclick = () => {
        if (lock || f.classList.contains('up') || f.classList.contains('ok')) return;
        f.classList.add('up'); open.push([f, c]);
        if (open.length === 2) {
          tries++; info.textContent = `시도 ${tries}회`; const [[f1, c1], [f2, c2]] = open; open = [];
          if (c1.i === c2.i) { f1.classList.add('ok'); f2.classList.add('ok'); ok++; if (ok === pairs.length) api.solve(`${tries}번 만에 4쌍을 모두 찾았어요!`); }
          else { lock = true; setTimeout(() => { f1.classList.remove('up'); f2.classList.remove('up'); lock = false; }, 900); }
        }
      };
      g.appendChild(f);
    });
  }
});

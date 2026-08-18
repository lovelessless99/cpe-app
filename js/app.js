/* CPE 五題衝刺 — 應用邏輯 */
(function () {
  'use strict';

  // 兩份詳解合併：SOL = 一星 49 題，SOL2 = 歷屆考古題
  const ALLSOL = Object.assign({}, SOL,
    typeof SOL2 !== 'undefined' ? SOL2 : {},
    typeof SOL3 !== 'undefined' ? SOL3 : {},
    typeof SOL4 !== 'undefined' ? SOL4 : {},
    typeof SOL5 !== 'undefined' ? SOL5 : {},
    typeof SOL6 !== 'undefined' ? SOL6 : {},
    typeof SOL7 !== 'undefined' ? SOL7 : {},
    typeof SOL8 !== 'undefined' ? SOL8 : {},
    typeof SOL9 !== 'undefined' ? SOL9 : {},
    typeof SOL10 !== 'undefined' ? SOL10 : {},
    typeof SOL11 !== 'undefined' ? SOL11 : {},
    typeof SOL12 !== 'undefined' ? SOL12 : {},
    typeof SOL13 !== 'undefined' ? SOL13 : {},
    typeof SOL14 !== 'undefined' ? SOL14 : {},
    typeof SOL15 !== 'undefined' ? SOL15 : {},
    typeof SOL16 !== 'undefined' ? SOL16 : {},
    typeof SOL17 !== 'undefined' ? SOL17 : {},
    typeof SOL18 !== 'undefined' ? SOL18 : {},
    typeof SOL19 !== 'undefined' ? SOL19 : {},
    typeof SOL20 !== 'undefined' ? SOL20 : {},
    typeof SOL21 !== 'undefined' ? SOL21 : {},
    typeof SOL22 !== 'undefined' ? SOL22 : {},
    typeof SOL23 !== 'undefined' ? SOL23 : {},
    typeof SOL24 !== 'undefined' ? SOL24 : {},
    typeof SOL25 !== 'undefined' ? SOL25 : {},
    typeof SOL26 !== 'undefined' ? SOL26 : {},
    typeof SOL27 !== 'undefined' ? SOL27 : {},
    typeof SOL28 !== 'undefined' ? SOL28 : {},
    typeof SOL29 !== 'undefined' ? SOL29 : {},
    typeof SOL30 !== 'undefined' ? SOL30 : {},
    typeof SOL31 !== 'undefined' ? SOL31 : {},
    typeof SOL32 !== 'undefined' ? SOL32 : {},
    typeof SOL33 !== 'undefined' ? SOL33 : {},
    typeof SOL34 !== 'undefined' ? SOL34 : {},
    typeof SOL35 !== 'undefined' ? SOL35 : {},
    typeof SOL36 !== 'undefined' ? SOL36 : {},
    typeof SOL37 !== 'undefined' ? SOL37 : {},
    typeof SOL38 !== 'undefined' ? SOL38 : {},
    typeof SOL39 !== 'undefined' ? SOL39 : {},
    typeof SOL40 !== 'undefined' ? SOL40 : {},
    typeof SOL41 !== 'undefined' ? SOL41 : {},
    typeof SOL42 !== 'undefined' ? SOL42 : {},
    typeof SOL43 !== 'undefined' ? SOL43 : {},
    typeof SOL44 !== 'undefined' ? SOL44 : {},
    typeof SOL45 !== 'undefined' ? SOL45 : {});
  const stat = u => (typeof UST !== 'undefined' && UST[u]) || null;

  const S = {
    get(k, d) { try { const v = localStorage.getItem('cpe.' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('cpe.' + k, JSON.stringify(v)); } catch (e) { } }
  };
  const $ = s => document.querySelector(s);
  const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x !== undefined) e.textContent = x; return e; };
  const zjURL = z => 'https://zerojudge.tw/ShowProblem?problemid=' + z;
  const uvaURL = u => 'https://vjudge.net/problem/UVA-' + u;
  const linkFor = p => p.zj ? zjURL(p.zj) : uvaURL(p.uva);
  const iso = d => d.toISOString().slice(0, 10);
  const todayLocal = () => { const n = new Date(); n.setHours(0, 0, 0, 0); return n; };
  const parseISO = s => new Date(s + 'T00:00:00');
  const daysBetween = (a, b) => Math.round((b - a) / 864e5);
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0;[a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fmtAC = n => n >= 10000 ? (n / 1000).toFixed(0) + 'k' : n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n);

  /* 統一的程式碼區塊：語法上色 + 複製 + 自動換行切換
     手機橫向捲程式碼很難用，所以預設自動換行；要看原始排版再切掉。 */
  function codeBlock(title, src) {
    const sn = el('div', 'snip');
    const sh = el('div', 'sniphead');
    sh.appendChild(el('h3', null, title));
    const wrapOn = S.get('wrap', true);
    const wb = el('button', 'btn sm', wrapOn ? '不換行' : '自動換行');
    const cp = el('button', 'btn sm', '複製');
    sh.appendChild(wb); sh.appendChild(cp);
    sn.appendChild(sh);

    const pre = el('pre', wrapOn ? 'wrap' : '');
    const code = el('code', 'blk');
    code.innerHTML = window.highlightCpp(src);
    pre.appendChild(code); sn.appendChild(pre);

    wb.onclick = () => {
      const on = !pre.classList.contains('wrap');
      pre.classList.toggle('wrap', on);
      wb.textContent = on ? '不換行' : '自動換行';
      S.set('wrap', on);
    };
    cp.onclick = () => navigator.clipboard?.writeText(src).then(() => {
      cp.textContent = '已複製'; setTimeout(() => cp.textContent = '複製', 1400);
    }).catch(() => { });
    return sn;
  }

  /* ── 設定與倒數 ───────────────────────────────────────── */
  function defaultExam() {
    const t = todayLocal();
    for (const g of ['2026-10-14', '2026-12-09', '2027-03-24']) if (parseISO(g) > t) return g;
    return iso(new Date(t.getTime() + 60 * 864e5));
  }
  const getExam = () => S.get('exam', null) || defaultExam();
  const getStart = () => { let s = S.get('start', null); if (!s) { s = iso(todayLocal()); S.set('start', s); } return s; };

  function renderCountdown() {
    const exam = parseISO(getExam()), t = todayLocal();
    const left = daysBetween(t, exam);
    $('#cdnum').textContent = left >= 0 ? left : '—';
    $('#cdunit').textContent = left === 0 ? '就是今天' : '天';
    $('#cddate').textContent = getExam().replace(/-/g, ' / ') + '（' + '日一二三四五六'[exam.getDay()] + '）';

    const regOpen = new Date(exam.getTime() - 15 * 864e5);
    const regShut = new Date(exam.getTime() - 5 * 864e5);
    const meta = $('#cdmeta'); meta.innerHTML = '';
    const add = (cls, txt) => meta.appendChild(el('span', 'pill' + (cls ? ' ' + cls : ''), txt));
    if (left < 0) add('shut', '考試日期已過，請到設定更新');
    else if (t < regOpen) {
      add('', '報名尚未開始 · 推估 ' + iso(regOpen).slice(5).replace('-', '/') + ' 開放');
      add('', '距報名 ' + daysBetween(t, regOpen) + ' 天');
    } else if (t <= regShut) {
      add('open', '報名中 · 推估 ' + iso(regShut).slice(5).replace('-', '/') + ' 截止');
      add('open', '剩 ' + daysBetween(t, regShut) + ' 天可報名');
    } else add('shut', '報名推估已截止');

    $('#cdnote').innerHTML = S.get('exam', null)
      ? '報名區間為<b>推估值</b>（開始約 15 天前、截止約 5 天前），實際以官網公告為準。'
      : '⚠️ 這是<b>預設日期，不是官方公告</b>。2026 場次尚未公布，請到 <a href="https://cpe.cse.nsysu.edu.tw/" target="_blank" rel="noopener">官網</a> 查到日期後按右上「設定」填入。';
  }

  /* ── 今日 ─────────────────────────────────────────────── */
  const computedDay = () => Math.min(30, Math.max(1, daysBetween(parseISO(getStart()), todayLocal()) + 1));
  let viewDay = computedDay();

  function renderBoard() {
    const b = $('#board'); b.innerHTML = '';
    for (let i = 0; i < 7; i++) b.appendChild(el('div', 'cell ' + (i < 5 ? 'get' : 'drop')));
  }

  function renderStats() {
    const box = $('#stats'); box.innerHTML = '';
    const d1 = S.get('done1', []).length;
    const known = S.get('known', []).length;
    const qh = S.get('quizhist', []);
    const best = qh.length ? Math.max(...qh) : 0;
    const items = [
      ['一星進度', d1 + '/49', d1 / 49],
      ['卡片記熟', known + '/' + CARDS.length, known / CARDS.length],
      ['抽考最佳', best + '/10', best / 10]
    ];
    items.forEach(([lbl, val, pct]) => {
      const c = el('div', 'stat');
      c.appendChild(el('div', 'eyebrow', lbl));
      c.appendChild(el('div', 'statval', val));
      const p = el('div', 'prog'); const i = el('i'); i.style.width = (pct * 100) + '%';
      p.appendChild(i); c.appendChild(p);
      box.appendChild(c);
    });
  }

  function renderDay() {
    const d = PLAN.find(p => p[1] === viewDay) || PLAN[0];
    const [wk, dn, title, sub, probs] = d;
    $('#dnum').textContent = dn;
    $('#dweek').textContent = 'WEEK ' + wk;
    $('#dtitle').textContent = title;
    $('#daypill').textContent = 'DAY ' + dn;
    $('#daycard').classList.toggle('sim', title.startsWith('★'));

    const ul = $('#dtasks'); ul.innerHTML = '';
    const add = (k, node) => {
      const li = el('li'); li.appendChild(el('span', 'k', k));
      const v = el('div', 'v'); v.appendChild(node); li.appendChild(v); ul.appendChild(li);
    };
    if (sub) add('重點', el('span', null, sub));
    if (probs) {
      const box = el('div');
      probs.split(',').forEach((raw, i) => {
        if (i) box.appendChild(document.createTextNode('　'));
        const t = raw.trim();
        const a = el('a', 'pcode', t.replace(/^U/, 'UVa '));
        a.href = t[0] === 'U' ? uvaURL(t.slice(1)) : zjURL(t);
        a.target = '_blank'; a.rel = 'noopener';
        box.appendChild(a);
      });
      add('練習', box);
    }
    const cps = $('#cps'); cps.innerHTML = '';
    CPS.forEach(([day, goal, fix]) => {
      const r = el('div', 'ck' + (day === viewDay ? ' now' : ''));
      const b = el('div');
      b.appendChild(el('b', null, 'Day ' + day + '　該達到 ' + goal));
      b.appendChild(el('div', null, '沒達到就：' + fix));
      r.appendChild(b); cps.appendChild(r);
    });
    renderStats();
  }

  /* 原文渲染：STMT[uva] 是區段陣列，範例用等寬保留排版 */
  function renderStmt(secs) {
    const wrap = el('div', 'stmt');
    secs.forEach(s => {
      if (s.h) wrap.appendChild(el('div', 'stmt-h', s.h));
      if (s.pre) {
        const pre = el('pre', 'stmt-pre', s.pre);
        wrap.appendChild(pre);
      } else if (s.t) {
        s.t.split('\n').forEach(par => {
          if (par.trim()) wrap.appendChild(el('p', 'stmt-p', par));
        });
      }
    });
    return wrap;
  }

  /* ── 詳解面板 ─────────────────────────────────────────── */
  function openSheet(p) {
    const s = ALLSOL[p.uva];
    $('#shmeta').textContent = 'UVa ' + p.uva + (p.zj ? ' · ' + p.zj : '') + (p.tag ? ' · ' + p.tag : '');
    $('#shtitle').textContent = p.title;
    const b = $('#shbody'); b.innerHTML = '';

    // 官方統計：難度與格式陷阱指標
    const st = stat(p.uva);
    if (st) {
      const g = el('div', 'statrow');
      const mk = (lbl, val, cls) => {
        const d = el('div', 'ministat' + (cls ? ' ' + cls : ''));
        d.appendChild(el('div', 'eyebrow', lbl));
        d.appendChild(el('div', 'statval', val));
        return d;
      };
      g.appendChild(mk('多少人解出', fmtAC(st.d)));
      g.appendChild(mk('通過率', st.r + '%'));
      g.appendChild(mk('錯幾次才過', st.w.toFixed(1), st.w >= 1.6 ? 'bad' : ''));
      b.appendChild(g);
      const lg = el('div', 'legend');
      lg.innerHTML = '取自 UVa 官方統計。<b>解出人數</b>愈少代表愈難；' +
        '<b>錯幾次才過</b>是「平均每通過 1 次要先被判錯幾次」（WA / AC 比）。' +
        '判題代號的完整說明在「STL」分頁。';
      b.appendChild(lg);
      if (st.w >= 1.6) {
        const w = el('div', 'warn');
        w.innerHTML = '<b>格式陷阱題。</b>平均每通過 1 次就先被判錯 ' + st.w.toFixed(1) +
          ' 次，遠高於一般題目。這代表大家卡的<b>不是演算法，是輸出格式</b>——' +
          '空格、換行、大小寫、單複數。<b>送出前務必把範例貼進去跑一次，逐字比對</b>。';
        b.appendChild(w);
      }
    }

    if (!s) {
      // 沒有中文詳解時，直接把 UVa 原文攤開來（不用點連結）
      const raw0 = (typeof STMT !== 'undefined') ? STMT[p.uva] : null;
      if (raw0) {
        const f = el('div', 'field');
        f.appendChild(el('div', 'lbl', '題目原文'));
        f.appendChild(renderStmt(raw0));
        b.appendChild(f);
        const note = el('div', 'legend');
        note.innerHTML = '自 UVa 的 PDF 自動解碼取得。<b>數學式與表格排版會失真</b>（斜體變數常會消失）。' +
          '這一題<b>還沒有中文詳解</b>——目前詳解集中在歷屆考過、且我有把握的題目。';
        b.appendChild(note);
      } else {
        const d = el('div', 'card flat');
        d.appendChild(el('div', 'lead', '這一題的原文與詳解都還沒有。'));
        b.appendChild(d);
      }
    } else {
      const field = (lbl, html, cls) => {
        const f = el('div', 'field');
        f.appendChild(el('div', 'lbl', lbl));
        const t = el('div', 'txt' + (cls ? ' ' + cls : ''));
        t.innerHTML = html; f.appendChild(t);
        return f;
      };
      if (s.unsure) {
        const w = el('div', 'unsure');
        w.innerHTML = '<b>這題我沒有十足把握。</b>解法方向應該是對的，' +
          '但<b>輸入輸出的細節（格式、邊界、句型）請以判題結果為準</b>——' +
          '第一次送出若 WA，先懷疑格式而不是演算法。';
        b.appendChild(w);
      }
      // 用到的資料結構與演算法
      const tg = (typeof TAGS !== 'undefined') ? TAGS[p.uva] : null;
      if (tg && tg.length) {
        const f = el('div', 'field');
        f.appendChild(el('div', 'lbl', '用到什麼'));
        const box = el('div', 'tagrow');
        tg.forEach(x => box.appendChild(el('span', 'algotag', x)));
        f.appendChild(box);
        b.appendChild(f);
      }
      b.appendChild(field('題意', s.q));

      // 輸入輸出格式與範例：讓你不用點連結就能開始寫
      const io = [
        typeof IO !== 'undefined' ? IO : null,
        typeof IO2 !== 'undefined' ? IO2 : null,
        typeof IO3 !== 'undefined' ? IO3 : null,
        typeof IO4 !== 'undefined' ? IO4 : null,
        typeof IO5 !== 'undefined' ? IO5 : null
      ].reduce((r, m) => r || (m && m[p.uva]) || null, null);
      if (io) {
        b.appendChild(field('輸入', io.i));
        b.appendChild(field('輸出', io.o));
        if (io.s) {
          const g = el('div', 'samples');
          const mk = (lbl, txt) => {
            const d = el('div', 'sample');
            const h = el('div', 'lbl');
            h.appendChild(el('span', null, lbl));
            const cp = el('button', 'btn sm', '複製');
            cp.onclick = () => navigator.clipboard?.writeText(txt).then(() => {
              cp.textContent = '已複製'; setTimeout(() => cp.textContent = '複製', 1200);
            }).catch(() => { });
            h.appendChild(cp);
            d.appendChild(h);
            d.appendChild(el('pre', 'io', txt));
            return d;
          };
          g.appendChild(mk('測試輸入', io.s[0]));
          g.appendChild(mk('預期輸出', io.s[1]));
          b.appendChild(g);
          const n = el('div', 'legend');
          n.innerHTML = '這組測資是<b>自行整理</b>用來讓你先驗證程式的，不等同官方範例。' +
            '通過之後仍要送出去讓判題機驗。';
          b.appendChild(n);
        }
      }

      // UVa 原文（可展開）
      const raw = (typeof STMT !== 'undefined') ? STMT[p.uva] : null;
      if (raw) {
        const d = el('details', 'rawstmt');
        const sm = el('summary');
        sm.appendChild(el('span', null, '原文（English）'));
        sm.appendChild(el('span', 'rawhint', '點開'));
        d.appendChild(sm);
        const bd = el('div', 'rawbody');
        bd.appendChild(renderStmt(raw));
        const note = el('div', 'legend');
        note.innerHTML = '自 UVa 的 PDF 自動解碼取得。<b>數學式與表格排版會失真</b>' +
          '（斜體變數常會消失），語意請以上方中文題意為準。';
        bd.appendChild(note);
        d.appendChild(bd);
        b.appendChild(d);
      }

      b.appendChild(field('解法', s.h, 'idea'));
      b.appendChild(field('陷阱', s.t, 'trap'));

      b.appendChild(codeBlock('UVa ' + p.uva + '.cpp', s.c));
    }

    const links = el('div', 'plinks');
    if (p.zj) { const a = el('a', 'plink', 'ZeroJudge ' + p.zj + ' ↗'); a.href = zjURL(p.zj); a.target = '_blank'; a.rel = 'noopener'; links.appendChild(a); }
    const a2 = el('a', 'plink', 'vjudge UVa ' + p.uva + ' ↗'); a2.href = uvaURL(p.uva); a2.target = '_blank'; a2.rel = 'noopener';
    links.appendChild(a2);
    b.appendChild(links);

    const sheet = $('#sheet');
    sheet.hidden = false;
    sheet.scrollTop = 0;                       // 每次開啟從頂端看起
    requestAnimationFrame(() => sheet.classList.add('open'));
    document.body.style.overflow = 'hidden';   // 背景不要跟著捲
  }
  function closeSheet() {
    const sheet = $('#sheet');
    sheet.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { sheet.hidden = true; }, 220);
  }
  $('#sheetclose').onclick = closeSheet;
  $('#sheetbg').onclick = closeSheet;
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#sheet').hidden) closeSheet(); });

  /* ── 題庫 ─────────────────────────────────────────────── */
  let star = S.get('star', 1), query = '';
  const bank = () => (star === 1 ? P1 : star === 2 ? P2 : P3);
  const bankKey = () => 'done' + star;

  function renderList() {
    const list = bank(), done = S.get(bankKey(), []);
    const q = query.trim().toLowerCase();
    const shown = q ? list.filter(p => p.title.toLowerCase().includes(q) || String(p.uva).includes(q) || (p.zj && p.zj.includes(q))) : list;
    const box = $('#plist'); box.innerHTML = '';
    if (!shown.length) box.appendChild(el('div', 'empty', '找不到符合「' + query + '」的題目'));
    shown.forEach(p => {
      const idx = list.indexOf(p), ok = done.includes(idx);
      const row = el('div', 'p' + (ok ? ' ok' : ''));
      row.appendChild(el('span', 'num', String(idx + 1)));
      const btn = el('button', 'box', '✓');
      btn.setAttribute('aria-label', (ok ? '取消完成 ' : '標記完成 ') + p.title);
      btn.onclick = e => {
        e.stopPropagation();
        const d = S.get(bankKey(), []); const k = d.indexOf(idx);
        if (k < 0) d.push(idx); else d.splice(k, 1);
        S.set(bankKey(), d); renderList(); renderStats();
      };
      row.appendChild(btn);
      const m = el('div', 'pmeta');
      m.appendChild(el('div', 'pname', p.title));
      const st = stat(p.uva);
      let sub = 'UVa ' + p.uva + (p.zj ? ' · ' + p.zj : '') + (p.tag ? ' · ' + p.tag : '');
      if (st) sub += ' · ' + fmtAC(st.d) + ' 人 AC';
      m.appendChild(el('span', 'psub', sub));
      row.appendChild(m);
      // WA/AC 比高 = 輸出格式陷阱題，值得先警告
      if (st && st.w >= 1.6) row.appendChild(el('span', 'badge trapb', '格式'));
      if (ALLSOL[p.uva]) row.appendChild(el('span',
        'badge ' + (ALLSOL[p.uva].unsure ? 'solq' : 'hasol'),
        ALLSOL[p.uva].unsure ? '詳解?' : '詳解'));
      else if (typeof STMT !== 'undefined' && STMT[p.uva])
        row.appendChild(el('span', 'badge stmtb', '題目'));
      row.tabIndex = 0;
      row.onclick = () => openSheet(p);
      row.onkeydown = e => { if (e.key === 'Enter') openSheet(p); };
      box.appendChild(row);
    });
    $('#pcount').textContent = done.length + '/' + list.length;
    $('#pbar').style.width = (list.length ? done.length / list.length * 100 : 0) + '%';
    $('#listlead').textContent = star === 1
      ? '一顆星 49 題 — 每場至少 1 題出自這份，全部附完整詳解'
      : star === 2 ? '二顆星 284 題 — 學完資料結構後的主戰場'
        : '三顆星 328 題 — 第 6、7 題的範圍，這個月不必碰';
  }

  /* ── 翻卡 ─────────────────────────────────────────────── */
  let deck = [], cur = 0, dmode = S.get('deckmode', 'all');
  const inMode = i => {
    const t = CARDS[i][0];
    if (dmode === 'trap') return TRAPTAGS.includes(t);
    if (dmode === 'api') return !TRAPTAGS.includes(t);
    return true;
  };
  function buildDeck() {
    const known = S.get('known', []);
    deck = shuffle(CARDS.map((c, i) => i).filter(i => inMode(i) && !known.includes(i)));
    cur = 0; showCard();
  }
  function showCard() {
    const has = deck.length > 0;
    $('#deckwrap').style.display = has ? '' : 'none';
    $('#deckdone').style.display = has ? 'none' : '';
    const total = CARDS.filter((c, i) => inMode(i)).length;
    $('#dkc').textContent = has ? ('剩 ' + deck.length + ' / ' + total + ' 張') : '';
    if (!has) return;
    if (cur >= deck.length) cur = 0;
    const c = CARDS[deck[cur]];
    $('#flip').classList.remove('done');
    $('#ctag').textContent = c[0];
    $('#cq').innerHTML = c[1];
    $('#ca').innerHTML = c[2];
  }

  /* ── 抽考 ─────────────────────────────────────────────── */
  const BUDGET = [
    ['n ≤ 11', 'O(n!)', '全排列暴力 · next_permutation'],
    ['n ≤ 22', 'O(2ⁿ)', '子集列舉 · bitmask'],
    ['n ≤ 100', 'O(n³)', '三層迴圈 · Floyd · 區間 DP'],
    ['n ≤ 1000', 'O(n²·log n)', '雙層迴圈裡再帶二分'],
    ['n ≤ 5000', 'O(n²)', '雙層迴圈 · LCS · O(n²) 的 LIS'],
    ['n ≤ 10⁵', 'O(n log n)', '排序 · set/map · 二分'],
    ['n ≤ 10⁶', 'O(n)', '掃一遍 · 前綴和 · 雙指針 · 質數篩'],
    ['n ≥ 10⁷', 'O(log n) / O(1)', '快速冪 · 純數學公式']
  ];

  let quiz = [], qi = 0, score = 0, streak = 0, maxStreak = 0, wrong = [];

  function makeQuiz() {
    const items = [];
    // A. 技巧配對：給題意，選正確技巧
    // 一輪固定 10 題：技巧配對 3 + 效率預算 2 + STL 用法 3 + 陷阱回想 2
    const tagged = P1.filter(p => p.tag && ALLSOL[p.uva]);
    const allTags = [...new Set(P1.map(p => p.tag))];
    shuffle(tagged.slice()).slice(0, 3).forEach(p => {
      const opts = shuffle([p.tag, ...shuffle(allTags.filter(t => t !== p.tag)).slice(0, 3)]);
      items.push({
        type: '技巧配對', ask: ALLSOL[p.uva].q,
        sub: 'UVa ' + p.uva + ' — ' + p.title,
        opts, ans: p.tag,
        why: ALLSOL[p.uva].h
      });
    });
    // B. 效率預算：給 n，選複雜度
    shuffle(BUDGET.slice()).slice(0, 2).forEach(b => {
      const opts = shuffle([b[1], ...shuffle(BUDGET.filter(x => x[1] !== b[1])).slice(0, 3).map(x => x[1])]);
      items.push({
        type: '效率預算', ask: '題目的 n 範圍是 ' + b[0] + '，該寫什麼複雜度？',
        sub: '判題機每秒約 10⁸ 次運算', opts, ans: b[1], why: b[2]
      });
    });
    // C. STL 用法：給任務選正確寫法，干擾選項是真的有人會寫錯的版本
    shuffle(STLQ.slice()).slice(0, 3).forEach(s => {
      items.push({
        type: 'STL 用法', ask: s.task, sub: '選出正確的寫法',
        opts: shuffle([s.ans, ...s.bad]), ans: s.ans, why: s.why, code: true
      });
    });
    // D. 陷阱回想：自評
    shuffle(CARDS.map((c, i) => i)).slice(0, 2).forEach(i => {
      items.push({ type: '陷阱回想 · 自評', ask: CARDS[i][1], sub: CARDS[i][0], self: true, why: CARDS[i][2] });
    });
    return shuffle(items);
  }

  function startQuiz() {
    quiz = makeQuiz(); qi = 0; score = 0; streak = 0; maxStreak = 0; wrong = [];
    $('#quizintro').style.display = 'none';
    $('#quizdone').style.display = 'none';
    $('#quizrun').style.display = '';
    showQ();
  }

  function showQ() {
    const q = quiz[qi];
    $('#qprog').textContent = (qi + 1) + ' / ' + quiz.length;
    $('#qscore').textContent = '答對 ' + score;
    const C = 2 * Math.PI * 16;
    $('#ring').style.strokeDasharray = C;
    $('#ring').style.strokeDashoffset = C * (1 - qi / quiz.length);
    const st = $('#streak');
    st.textContent = streak >= 2 ? '🔥 ' + streak : '';
    st.className = 'streak' + (streak >= 3 ? ' hot' : '');

    $('#qtype').textContent = q.type;
    $('#qtext').innerHTML = q.ask;
    $('#qsub').textContent = q.sub || '';
    $('#qreveal').style.display = 'none';
    $('#qnext').style.display = 'none';
    const opts = $('#qopts'); opts.innerHTML = '';

    if (q.self) {
      $('#qself').style.display = '';
      $('#qself').querySelectorAll('button').forEach(b => b.disabled = false);
    } else {
      $('#qself').style.display = 'none';
      q.opts.forEach(o => {
        const b = el('button', 'opt' + (q.code ? ' code' : ''), o);
        b.dataset.val = o;
        b.onclick = () => answer(o === q.ans, b, q);
        opts.appendChild(b);
      });
    }
  }

  function answer(ok, btn, q) {
    $('#qopts').querySelectorAll('.opt').forEach(b => {
      b.disabled = true;
      if (b.dataset.val === q.ans) b.classList.add('right');
    });
    if (btn && !ok) btn.classList.add('wrong');
    finishQ(ok, q);
  }

  function finishQ(ok, q) {
    if (ok) { score++; streak++; maxStreak = Math.max(maxStreak, streak); }
    else { streak = 0; wrong.push(q); }
    $('#qscore').textContent = '答對 ' + score;
    const rv = $('#qreveal');
    rv.innerHTML = (ok ? '<b class="ok">答對</b>　' : '<b class="ng">答錯</b>　') + q.why;
    rv.style.display = '';
    $('#qself').querySelectorAll('button').forEach(b => b.disabled = true);
    $('#qnext').style.display = '';
    $('#qnext').textContent = qi + 1 < quiz.length ? '下一題 →' : '看結果 →';
  }

  $('#selfright').onclick = () => finishQ(true, quiz[qi]);
  $('#selfwrong').onclick = () => finishQ(false, quiz[qi]);
  $('#qnext').onclick = () => {
    qi++;
    if (qi < quiz.length) showQ();
    else endQuiz();
  };

  function endQuiz() {
    $('#quizrun').style.display = 'none';
    $('#quizdone').style.display = '';
    $('#finalscore').textContent = score;
    const hist = S.get('quizhist', []); hist.push(score); S.set('quizhist', hist.slice(-30));
    const msg = score >= 9 ? '這批已經熟了，換一輪或去刷題。'
      : score >= 7 ? '不錯。把下面錯的補起來就穩了。'
        : score >= 4 ? '中間地帶——錯的那幾題今天再看一次。'
          : '這些都還沒進腦子。先去「翻卡」把陷阱過一遍再回來。';
    $('#finalmsg').textContent = msg + '（最佳連對 ' + maxStreak + '）';
    const wl = $('#wronglist'); wl.innerHTML = '';
    if (wrong.length) {
      wl.appendChild(el('div', 'eyebrow', '錯的這幾題'));
      wrong.forEach(w => {
        const d = el('div', 'wrongitem');
        d.appendChild(el('div', 'wq', w.sub ? w.sub : w.type));
        const a = el('div', 'wa'); a.innerHTML = w.why; d.appendChild(a);
        wl.appendChild(d);
      });
    }
    renderStats();
  }

  $('#startquiz').onclick = startQuiz;
  $('#againquiz').onclick = startQuiz;

  function renderQStats() {
    const hist = S.get('quizhist', []);
    const box = $('#qstats'); box.innerHTML = '';
    if (!hist.length) { box.appendChild(el('div', 'lead', '還沒抽考過。')); return; }
    const avg = (hist.reduce((a, b) => a + b, 0) / hist.length).toFixed(1);
    [['已抽考', hist.length + ' 輪'], ['平均', avg + ' / 10'], ['最佳', Math.max(...hist) + ' / 10']]
      .forEach(([k, v]) => {
        const d = el('div', 'qstat');
        d.appendChild(el('div', 'eyebrow', k));
        d.appendChild(el('div', 'statval', v));
        box.appendChild(d);
      });
  }

  /* ── 技巧 ─────────────────────────────────────────────── */
  function renderSkills() {
    const box = $('#skills'); box.innerHTML = '';
    SKILLS.forEach((s, i) => {
      const d = el('details', 'skill'); if (i === 0) d.open = true;
      const h = el('summary', 'skillhead');
      h.appendChild(el('h3', null, s.name));
      h.appendChild(el('span', 'lv lv' + s.lv, s.lv === 1 ? '必修' : s.lv === 2 ? '選修' : '超綱'));
      d.appendChild(h);
      const b = el('div', 'skillbody');
      const field = (lbl, txt, cls) => {
        const f = el('div', 'field');
        f.appendChild(el('div', 'lbl', lbl));
        f.appendChild(el('div', 'txt' + (cls ? ' ' + cls : ''), txt));
        return f;
      };
      b.appendChild(field('何時用', s.when));
      b.appendChild(field('想法', s.idea, 'idea'));
      b.appendChild(codeBlock(s.name + '.cpp', s.code));
      if (s.probs && s.probs.length) {
        const f = el('div', 'field');
        f.appendChild(el('div', 'lbl', '練這幾題'));
        const links = el('div', 'plinks');
        s.probs.forEach(([uva, zj]) => {
          const a = el('a', 'plink', 'UVa ' + uva + (zj ? ' · ' + zj : ''));
          a.href = zj ? zjURL(zj) : uvaURL(uva);
          a.target = '_blank'; a.rel = 'noopener';
          links.appendChild(a);
        });
        f.appendChild(links); b.appendChild(f);
      }
      d.appendChild(b); box.appendChild(d);
    });
  }

  /* ── STL / 速查 ───────────────────────────────────────── */
  const PICK = [['一般序列、不確定用什麼', 'vector'], ['只在尾端進出', 'vector / stack'],
  ['先進先出（BFS）', 'queue'], ['兩端都要進出', 'deque'], ['每次取最小 / 最大', 'priority_queue'],
  ['判斷有沒有出現過，要有序', 'set'], ['統計次數，key 是字串', 'map<string,int>'],
  ['統計次數，key 是小整數', 'vector<int> 直接開陣列'], ['需要找前驅 / 後繼', 'set / map 的 lower_bound'],
  ['允許重複又要刪單一個', 'multiset + erase(find(x))'], ['只需合併與查連通', 'DSU']];
  const LANG = [['auto · range-for · lambda · nullptr', 'C++11', '放心用'],
  ['emplace_back · unordered_map', 'C++11', '放心用'],
  ['auto [a, b] = pair（結構化綁定）', 'C++17', '練習時段先編一次確認'],
  ['greater<>（省略型別）', 'C++14', '保險起見寫完整 greater<int>'],
  ['std::gcd / std::lcm', 'C++17', '改用 __gcd(a,b)，一直都有'],
  ['#include <bits/stdc++.h>', 'GCC 限定', '練習時段確認能不能用']];
  const LIMS = [['int', '約 ±2.1 × 10⁹', '超過就換 long long'],
  ['long long', '約 ±9.2 × 10¹⁸', ''],
  ['1000 個數相加，每個 10⁷', '10¹⁰ → 溢位', '要 long long'],
  ['n = 10⁵ 的等差總和', '約 5 × 10⁹ → 溢位', '要 long long'],
  ['兩個 10⁵ 相乘', '10¹⁰ → 溢位', '要 long long'],
  ['階乘', '13! 爆 int，21! 爆 long long', '大數或取模']];

  /* 判題結果代號。看錯代號會往完全錯的方向修，所以這是基本功。 */
  const VERDICT = [
    ['AC', 'Accepted', '<b>通過</b>。這題解決了。'],
    ['WA', 'Wrong Answer', '答案錯。程式有跑完，但輸出不對——<b>先查輸出格式與邊界</b>，不是急著改演算法。'],
    ['TLE', 'Time Limit Exceeded', '<b>超時</b>。演算法太慢，要換複雜度更低的做法。改格式沒有用。'],
    ['MLE', 'Memory Limit Exceeded', '記憶體超限。陣列開太大，或遞迴太深。'],
    ['RE', 'Runtime Error', '執行時炸了：陣列越界、除以零、遞迴爆 stack。'],
    ['PE', 'Presentation Error', '答案對但<b>排版</b>錯（多餘空格或換行）。有些系統直接判 WA。'],
    ['CE', 'Compile Error', '根本沒編譯過。考場上先確認編譯器與 <code>bits/stdc++.h</code> 能不能用。']
  ];

  function renderRef() {
    const v = $('#verdict'); v.innerHTML = '';
    VERDICT.forEach(([code, full, desc]) => {
      const tr = el('tr');
      const c1 = el('td', 'cx' + (code === 'AC' ? '' : ' slow'), code);
      c1.style.fontWeight = '700'; tr.appendChild(c1);
      tr.appendChild(el('td', 'op', full));
      const d = el('td', 'ds'); d.innerHTML = desc; tr.appendChild(d);
      v.appendChild(tr);
    });

    const b = $('#budget'); b.innerHTML = '';
    BUDGET.forEach(([n, o, how]) => {
      const tr = el('tr');
      const t1 = el('td', 'n1'); t1.innerHTML = n; tr.appendChild(t1);
      tr.appendChild(el('td', 'n2', o));
      tr.appendChild(el('td', 'n3', how));
      b.appendChild(tr);
    });
    const p = $('#pick'); p.innerHTML = '';
    PICK.forEach(([need, use]) => {
      const tr = el('tr');
      tr.appendChild(el('td', null, need));
      const u = el('td', 'usecol', use); tr.appendChild(u);
      p.appendChild(tr);
    });
    const l = $('#lang'); l.innerHTML = '';
    LANG.forEach(([f, v, note]) => {
      const tr = el('tr');
      tr.appendChild(el('td', 'op', f));
      tr.appendChild(el('td', 'cx', v));
      tr.appendChild(el('td', 'ds', note));
      l.appendChild(tr);
    });
    const li = $('#lim'); li.innerHTML = '';
    LIMS.forEach(([a, c, d]) => {
      const tr = el('tr');
      tr.appendChild(el('td', 'op', a));
      tr.appendChild(el('td', 'cx' + (/溢位|爆/.test(c) ? ' slow' : ''), c));
      tr.appendChild(el('td', 'ds', d));
      li.appendChild(tr);
    });

    // STL cheatsheet
    const box = $('#stl'); box.innerHTML = '';
    STL.forEach((c, i) => {
      const d = el('details', 'skill'); if (i === 0) d.open = true;
      const h = el('summary', 'skillhead');
      const t = el('div', null); t.style.flex = '1';
      const nm = el('h3', null, c.name); nm.style.fontFamily = 'var(--mono)';
      t.appendChild(nm);
      const tg = el('div', 'psub'); tg.innerHTML = c.tag;   // tag 內含跳脫過的 &lt;&gt;
      t.appendChild(tg);
      h.appendChild(t);
      d.appendChild(h);
      const b2 = el('div', 'skillbody');
      if (c.note) b2.appendChild(el('div', 'lead', c.note));
      c.g.forEach(([grp, rows]) => {
        const g = el('div');
        g.appendChild(el('div', 'lbl', grp));
        const tw = el('div', 'tw'); const tb = el('table', 'apitbl');
        // 標紅的是「有代價或有陷阱」的操作：線性以上、或根本不支援
        const isSlow = cx => cx === '—' || cx === 'O(n)' || cx === 'O(nm)' || cx.startsWith('O(n²');
        rows.forEach(([op, cx, ds]) => {
          const tr = el('tr');
          // op / cx / ds 都含跳脫過的 &lt;&gt; 與 <b>，一律走 innerHTML
          const o = el('td', 'op'); o.innerHTML = op; tr.appendChild(o);
          const c2 = el('td', 'cx' + (isSlow(cx) ? ' slow' : '')); c2.innerHTML = cx; tr.appendChild(c2);
          const dd = el('td', 'ds'); dd.innerHTML = ds; tr.appendChild(dd);
          tb.appendChild(tr);
        });
        tw.appendChild(tb); g.appendChild(tw); b2.appendChild(g);
      });
      if (c.code) b2.appendChild(codeBlock(c.name + ' 用法', c.code));
      if (c.trap) {
        const w = el('div', 'warn'); w.innerHTML = '<b>陷阱：</b>' + c.trap;
        b2.appendChild(w);
      }
      if (c.mine) {
        const m = el('div', 'mine'); m.innerHTML = '<span class="minelbl">我的建議</span>' + c.mine;
        b2.appendChild(m);
      }
      d.appendChild(b2); box.appendChild(d);
    });
  }

  /* ── 考古 ─────────────────────────────────────────────── */
  function renderPast() {
    // 難度階梯：每場 7 題答對率由高到低排序後，取各名次的中位數
    const withPass = EXAMS.filter(e => e.ps[0].pass !== undefined);
    const nth = [[], [], [], [], [], [], []];
    withPass.forEach(e => {
      e.ps.map(p => p.pass).sort((a, b) => b - a).forEach((v, i) => nth[i].push(v));
    });
    const med = a => { const b = [...a].sort((x, y) => x - y); return b[b.length >> 1]; };
    const lad = $('#ladder'); lad.innerHTML = '';
    nth.forEach((a, i) => {
      const tr = el('tr');
      tr.appendChild(el('td', 'n1', '解出 ' + (i + 1) + ' 題以上'));
      const v = med(a);
      const c = el('td', 'n2', v.toFixed(1) + '%');
      if (i + 1 === 5) c.style.color = 'var(--wa)';
      tr.appendChild(c);
      tr.appendChild(el('td', 'n3',
        i === 0 ? '幾乎人人拿得到' : i === 1 ? '寫得完就有' :
        i === 2 ? '穩定的目標' : i === 3 ? '要下功夫' :
        i === 4 ? '← 你的目標' : i === 5 ? '半年以上準備' : '極少數'));
      lad.appendChild(tr);
    });

    // 各題號位置的平均答對率：題號順序是不是難度順序？
    const bypos = [[], [], [], [], [], [], []];
    withPass.forEach(e => e.ps.forEach((p, i) => bypos[i].push(p.pass)));
    const avg = a => a.reduce((x, y) => x + y, 0) / a.length;
    const bp = $('#bypos'); bp.innerHTML = '';
    bypos.forEach((a, i) => {
      const tr = el('tr');
      tr.appendChild(el('td', 'n1', '第 ' + (i + 1) + ' 題'));
      tr.appendChild(el('td', 'n2', avg(a).toFixed(1) + '%'));
      tr.appendChild(el('td', 'n3',
        i < 2 ? '穩拿' : i === 2 ? '主戰場' : i === 3 ? '勝負手' : i === 4 ? '第 5 題在這' : '放棄'));
      bp.appendChild(tr);
    });

    // 交叉比對：歷屆 vs 三份選集
    const S1 = new Set(P1.map(p => p.uva)), S2 = new Set(P2.map(p => p.uva)), S3 = new Set(P3.map(p => p.uva));
    const exU = new Set(); EXAMS.forEach(e => e.ps.forEach(p => exU.add(p.uva)));
    const perExam = [0, 0, 0, 0];
    EXAMS.forEach(e => e.ps.forEach(p =>
      perExam[S1.has(p.uva) ? 0 : S2.has(p.uva) ? 1 : S3.has(p.uva) ? 2 : 3]++));
    const ov = $('#ovlap'); ov.innerHTML = '';
    const hd = el('tr');
    ['選集', '題數', '被考過', '命中率', '每場平均'].forEach(x => hd.appendChild(el('th', null, x)));
    ov.appendChild(hd);
    [['1★', P1, S1, 0], ['2★', P2, S2, 1], ['3★', P3, S3, 2]].forEach(([n, arr, st, i]) => {
      const hit = arr.filter(p => exU.has(p.uva)).length;
      const tr = el('tr');
      tr.appendChild(el('td', 'n1', n));
      tr.appendChild(el('td', 'n', String(arr.length)));
      tr.appendChild(el('td', 'n', String(hit)));
      const rate = hit / arr.length * 100;
      const c = el('td', 'n2', rate.toFixed(1) + '%');
      c.style.color = rate >= 50 ? 'var(--ac)' : rate >= 20 ? 'var(--gold-hi)' : 'var(--wa)';
      tr.appendChild(c);
      tr.appendChild(el('td', 'n', (perExam[i] / EXAMS.length).toFixed(2) + ' 題'));
      ov.appendChild(tr);
    });
    const tr9 = el('tr');
    tr9.appendChild(el('td', 'n1', '不在選集'));
    tr9.appendChild(el('td', 'n', '—'));
    tr9.appendChild(el('td', 'n', String(exU.size - [...exU].filter(u => S1.has(u) || S2.has(u) || S3.has(u)).length)));
    const c9 = el('td', 'n2', '—'); tr9.appendChild(c9);
    const t9 = el('td', 'n', (perExam[3] / EXAMS.length).toFixed(2) + ' 題');
    t9.style.color = 'var(--wa)'; t9.style.fontWeight = '700';
    tr9.appendChild(t9);
    ov.appendChild(tr9);

    // 逐題明細：三種切法
    const meta = {};                      // uva -> {title, zj, dates[]}
    EXAMS.forEach(e => e.ps.forEach(p => {
      if (!meta[p.uva]) meta[p.uva] = { title: p.title, zj: p.zj, dates: [] };
      meta[p.uva].dates.push(e.date);
    }));
    function ovList(mode) {
      const t = $('#ovlist'); t.innerHTML = '';
      let rows;
      if (mode === 'rep')
        rows = Object.keys(meta).filter(u => meta[u].dates.length > 1)
          .sort((a, b) => meta[b].dates.length - meta[a].dates.length || a - b);
      else if (mode === 's1')
        rows = [...exU].filter(u => S1.has(u)).sort((a, b) => a - b).map(String);
      else
        rows = [...exU].filter(u => !S1.has(u) && !S2.has(u) && !S3.has(u))
          .sort((a, b) => a - b).map(String);

      const hd = el('tr');
      ['題號', '題名', mode === 'rep' ? '考過' : '年份', ''].forEach(x => hd.appendChild(el('th', null, x)));
      t.appendChild(hd);
      rows.slice(0, 200).forEach(u => {
        const m = meta[u];
        const tr = el('tr');
        tr.appendChild(el('td', 'n', u + (m.zj ? ' / ' + m.zj : '')));
        const td = el('td');
        const a = el('a', 'pcode', m.title);
        a.href = m.zj ? zjURL(m.zj) : uvaURL(u);
        a.target = '_blank'; a.rel = 'noopener';
        a.style.fontFamily = 'var(--sans)';
        td.appendChild(a);
        tr.appendChild(td);
        tr.appendChild(el('td', 'n', mode === 'rep'
          ? '×' + m.dates.length
          : m.dates[0].slice(0, 4)));
        const bd = el('td');
        if (ALLSOL[u]) bd.appendChild(el('span', 'badge hasol', '詳解'));
        else if (typeof STMT !== 'undefined' && STMT[u]) bd.appendChild(el('span', 'badge stmtb', '題目'));
        tr.appendChild(bd);
        t.appendChild(tr);
      });
      if (rows.length > 200) {
        const tr = el('tr');
        const td = el('td', 'n'); td.colSpan = 4;
        td.textContent = '（共 ' + rows.length + ' 題，只顯示前 200）';
        tr.appendChild(td); t.appendChild(tr);
      }
    }
    const ovBtns = $('#ovseg').querySelectorAll('button');
    ovBtns.forEach(b => {
      b.onclick = () => {
        ovBtns.forEach(x => x.classList.remove('on'));
        b.classList.add('on'); ovList(b.dataset.o);
      };
    });
    ovList('rep');

    const freq = {};
    EXAMS.forEach(e => e.ps.forEach(p => { freq[p.uva] = (freq[p.uva] || 0) + 1; }));
    const s1 = new Set(P1.map(p => p.uva));
    const titleOf = {};
    EXAMS.forEach(e => e.ps.forEach(p => titleOf[p.uva] = p.title));
    const hot = Object.keys(freq).filter(u => freq[u] >= 2 || s1.has(+u))
      .sort((a, b) => freq[b] - freq[a] || a - b);
    const hots = $('#hots'); hots.innerHTML = '';
    hot.forEach(u => {
      const a = el('a', 'tag hot', u + ' ' + titleOf[u] + (freq[u] >= 2 ? ' ×' + freq[u] : ''));
      a.href = uvaURL(u); a.target = '_blank'; a.rel = 'noopener';
      hots.appendChild(a);
    });
    const box = $('#exams'); box.innerHTML = '';
    EXAMS.forEach((e, i) => {
      const d = el('details', 'exam'); if (i === 0) d.open = true;
      const sm = el('summary');
      sm.appendChild(el('span', 'dt', e.date));
      const hasPass = e.ps[0].pass !== undefined;
      sm.appendChild(el('span', 'mix', hasPass
        ? '最高 ' + Math.max(...e.ps.map(p => p.pass)).toFixed(0) + '% 答對'
        : '☆ × ' + e.ps.filter(p => p.st === 1).length));
      d.appendChild(sm);
      const tw = el('div', 'tw'); const t = el('table');
      const tr0 = el('tr');
      ['#', '題目', '題號', hasPass ? '考生答對率' : '難度'].forEach(x => tr0.appendChild(el('th', null, x)));
      t.appendChild(tr0);
      e.ps.forEach((p, j) => {
        const r = el('tr');
        r.appendChild(el('td', 'n', String(j + 1)));
        const td = el('td');
        const a = el('a', 'pcode', p.title);
        a.href = linkFor(p); a.target = '_blank'; a.rel = 'noopener';
        a.style.fontFamily = 'var(--sans)';
        td.appendChild(a);
        if (ALLSOL[p.uva]) td.appendChild(el('span', 'badge hasol', ' 詳解'));
        r.appendChild(td);
        r.appendChild(el('td', 'n', p.uva + (p.zj ? ' / ' + p.zj : '')));
        // 有官方答對率就顯示它，否則退回星等標註
        if (p.pass !== undefined) {
          const c = el('td', 'passcell', p.pass.toFixed(1) + '%');
          c.classList.add(p.pass >= 30 ? 'p-hi' : p.pass >= 8 ? 'p-mid' : 'p-lo');
          r.appendChild(c);
        } else {
          r.appendChild(el('td', 'stars', p.st ? '☆'.repeat(p.st) : '—'));
        }
        t.appendChild(r);
      });
      tw.appendChild(t); d.appendChild(tw); box.appendChild(d);
    });
  }

  /* ── 事件 ─────────────────────────────────────────────── */
  $('#prev').onclick = () => { viewDay = Math.max(1, viewDay - 1); renderDay(); };
  $('#next').onclick = () => { viewDay = Math.min(30, viewDay + 1); renderDay(); };
  $('#jumptoday').onclick = () => { viewDay = computedDay(); renderDay(); };

  $('#flip').onclick = () => $('#flip').classList.toggle('done');
  $('#again').onclick = () => {
    if (!deck.length) return;
    const [x] = deck.splice(cur, 1); deck.push(x);
    if (cur >= deck.length) cur = 0;
    showCard();
  };
  $('#known').onclick = () => {
    if (!deck.length) return;
    const known = S.get('known', []); known.push(deck[cur]); S.set('known', known);
    deck.splice(cur, 1);
    if (cur >= deck.length) cur = 0;
    showCard(); renderStats();
  };
  $('#shuffle').onclick = buildDeck;
  $('#resetcards').onclick = () => { S.set('known', S.get('known', []).filter(i => !inMode(i))); buildDeck(); renderStats(); };

  const segBind = (sel, key, onPick) => {
    const btns = $(sel).querySelectorAll('button');
    btns.forEach(b => {
      b.onclick = () => {
        btns.forEach(x => x.classList.remove('on'));
        b.classList.add('on'); onPick(b);
      };
    });
    return btns;
  };
  segBind('#deckseg', null, b => { dmode = b.dataset.d; S.set('deckmode', dmode); buildDeck(); });
  $('#deckseg').querySelectorAll('button').forEach(b => {
    if (b.dataset.d === dmode) { $('#deckseg').querySelectorAll('button').forEach(x => x.classList.remove('on')); b.classList.add('on'); }
  });
  segBind('#starseg', null, b => { star = +b.dataset.s; S.set('star', star); renderList(); });
  $('#starseg').querySelectorAll('button').forEach(b => {
    if (+b.dataset.s === star) { $('#starseg').querySelectorAll('button').forEach(x => x.classList.remove('on')); b.classList.add('on'); }
  });
  segBind('#modeseg', null, b => {
    const quizOn = b.dataset.m === 'quiz';
    $('#cardmode').style.display = quizOn ? 'none' : '';
    $('#quizmode').style.display = quizOn ? '' : 'none';
    $('#dkc').style.display = quizOn ? 'none' : '';
    if (quizOn) { renderQStats(); $('#quizintro').style.display = ''; $('#quizrun').style.display = 'none'; $('#quizdone').style.display = 'none'; }
  });

  let qt;
  $('#q').oninput = e => { clearTimeout(qt); qt = setTimeout(() => { query = e.target.value; renderList(); }, 140); };

  const dlg = $('#cfg');
  $('#opencfg').onclick = () => {
    $('#examdate').value = getExam();
    $('#startdate').value = getStart();
    dlg.showModal();
  };
  dlg.addEventListener('close', () => {
    if (dlg.returnValue !== 'save') return;
    const e = $('#examdate').value, s = $('#startdate').value;
    if (e) S.set('exam', e);
    if (s) S.set('start', s);
    viewDay = computedDay();
    renderCountdown(); renderDay();
  });

  document.querySelectorAll('.tab').forEach(b => {
    b.onclick = () => {
      document.querySelectorAll('.tab').forEach(x => x.classList.remove('on'));
      document.querySelectorAll('.view').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      $('#v-' + b.dataset.v).classList.add('on');
      window.scrollTo(0, 0);
      S.set('tab', b.dataset.v);
    };
  });

  /* ── init ─────────────────────────────────────────────── */
  getStart();
  renderBoard(); renderCountdown(); renderDay(); buildDeck();
  renderList(); renderSkills(); renderRef(); renderPast(); renderQStats();

  const last = S.get('tab', 'today');
  if (last !== 'today') {
    const lb = document.querySelector('.tab[data-v="' + last + '"]');
    if (lb) lb.click();
  }

  /* ── 版本顯示與更新偵測 ───────────────────────────────── */
  const BUILD = 'cpe-v55';                 // 與 sw.js 的 VERSION 同步
  const vEl = $('#buildver');
  if (vEl) vEl.textContent = BUILD + '　·　' + Object.keys(ALLSOL).length + ' 題詳解';

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').then(reg => {
        // 有新版時提示重新載入，不要讓使用者看到半新半舊的狀態
        reg.addEventListener('updatefound', () => {
          const nw = reg.installing;
          if (!nw) return;
          nw.addEventListener('statechange', () => {
            if (nw.state === 'installed' && navigator.serviceWorker.controller) showUpdateBar();
          });
        });
        // 問 SW 它實際在跑哪個版本，跟頁面預期的比對
        navigator.serviceWorker.addEventListener('message', ev => {
          if (ev.data && ev.data.version && ev.data.version !== BUILD) showUpdateBar();
        });
        if (navigator.serviceWorker.controller)
          navigator.serviceWorker.controller.postMessage('version');
      }).catch(() => { });
    });
  }

  function showUpdateBar() {
    if ($('#updbar')) return;
    const bar = el('div', 'updbar');
    bar.id = 'updbar';
    bar.appendChild(el('span', null, '有新版本'));
    const b = el('button', 'btn sm pri', '重新載入');
    b.onclick = () => location.reload();
    bar.appendChild(b);
    document.body.appendChild(bar);
  }
})();

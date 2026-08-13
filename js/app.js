/* CPE 五題衝刺 — 應用邏輯 */
(function () {
  'use strict';

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

  /* ── 設定 ─────────────────────────────────────────────── */
  function defaultExam() {
    // 2026 場次未公告。CPE 一年四場（約 3、5、10、12 月），先給一個保守預設，
    // 使用者查到官方公告後在「設定」改成正確日期。
    const t = todayLocal();
    const guesses = ['2026-10-14', '2026-12-09', '2027-03-24'];
    for (const g of guesses) if (parseISO(g) > t) return g;
    return iso(new Date(t.getTime() + 60 * 864e5));
  }
  const getExam = () => S.get('exam', null) || defaultExam();
  const getStart = () => { let s = S.get('start', null); if (!s) { s = iso(todayLocal()); S.set('start', s); } return s; };
  const isExamConfirmed = () => !!S.get('exam', null);

  /* ── 倒數 ─────────────────────────────────────────────── */
  function renderCountdown() {
    const exam = parseISO(getExam());
    const t = todayLocal();
    const left = daysBetween(t, exam);
    $('#cdnum').textContent = left >= 0 ? left : '—';
    $('#cdunit').textContent = left === 0 ? '就是今天' : '天';
    $('#cddate').textContent = getExam().replace(/-/g, ' / ') + '（' + '日一二三四五六'[exam.getDay()] + '）';

    // 報名區間推估：開始約 15 天前、截止約 5 天前
    const regOpen = new Date(exam.getTime() - 15 * 864e5);
    const regShut = new Date(exam.getTime() - 5 * 864e5);
    const meta = $('#cdmeta'); meta.innerHTML = '';
    const addPill = (cls, txt) => meta.appendChild(el('span', 'pill' + (cls ? ' ' + cls : ''), txt));

    if (left < 0) {
      addPill('shut', '考試日期已過，請到設定更新');
    } else if (t < regOpen) {
      addPill('', '報名尚未開始 · 推估 ' + iso(regOpen).slice(5).replace('-', '/') + ' 開放');
      addPill('', '距報名 ' + daysBetween(t, regOpen) + ' 天');
    } else if (t <= regShut) {
      addPill('open', '報名中 · 推估 ' + iso(regShut).slice(5).replace('-', '/') + ' 截止');
      addPill('open', '剩 ' + daysBetween(t, regShut) + ' 天可報名');
    } else {
      addPill('shut', '報名推估已截止');
    }

    $('#cdnote').innerHTML = isExamConfirmed()
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
  }

  /* ── 卡片 ─────────────────────────────────────────────── */
  let deck = [], cur = 0, mode = S.get('deckmode', 'all');
  const inMode = i => {
    const t = CARDS[i][0];
    if (mode === 'trap') return TRAPTAGS.includes(t);
    if (mode === 'api') return !TRAPTAGS.includes(t);
    return true;
  };
  function buildDeck() {
    const known = S.get('known', []);
    deck = CARDS.map((c, i) => i).filter(i => inMode(i) && !known.includes(i));
    for (let i = deck.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0;[deck[i], deck[j]] = [deck[j], deck[i]]; }
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

  /* ── 題庫 ─────────────────────────────────────────────── */
  let star = S.get('star', 1), query = '';
  const bank = () => (star === 1 ? P1 : star === 2 ? P2 : P3);
  const bankKey = () => 'done' + star;

  function renderList() {
    const list = bank();
    const done = S.get(bankKey(), []);
    const q = query.trim().toLowerCase();
    const shown = q ? list.filter(p => p.title.toLowerCase().includes(q) || String(p.uva).includes(q) || (p.zj && p.zj.includes(q))) : list;

    const box = $('#plist'); box.innerHTML = '';
    if (!shown.length) { box.appendChild(el('div', 'empty', '找不到符合「' + query + '」的題目')); }
    shown.forEach(p => {
      const idx = list.indexOf(p);
      const ok = done.includes(idx);
      const row = el('div', 'p' + (ok ? ' ok' : ''));
      row.appendChild(el('span', 'num', String(idx + 1)));
      const btn = el('button', 'box', '✓');
      btn.setAttribute('aria-label', (ok ? '取消完成 ' : '標記完成 ') + p.title);
      btn.onclick = () => {
        const d = S.get(bankKey(), []);
        const k = d.indexOf(idx);
        if (k < 0) d.push(idx); else d.splice(k, 1);
        S.set(bankKey(), d); renderList();
      };
      row.appendChild(btn);
      const m = el('div', 'pmeta');
      const a = el('a', 'pname', p.title);
      a.href = linkFor(p); a.target = '_blank'; a.rel = 'noopener';
      m.appendChild(a);
      m.appendChild(el('span', 'psub', 'UVa ' + p.uva + (p.zj ? ' · ' + p.zj : '') + (p.tag ? ' · ' + p.tag : '')));
      row.appendChild(m);
      box.appendChild(row);
    });

    $('#pcount').textContent = done.length + '/' + list.length;
    $('#pbar').style.width = (list.length ? done.length / list.length * 100 : 0) + '%';
    $('#listlead').textContent = star === 1
      ? '一顆星 49 題 — 每場考試至少 1 題出自這份'
      : star === 2 ? '二顆星 284 題 — 學完資料結構後的主戰場'
        : '三顆星 328 題 — 第 6、7 題的範圍，這個月不必碰';
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

      const sn = el('div', 'snip');
      const sh = el('div', 'sniphead');
      sh.appendChild(el('h3', null, s.name + '.cpp'));
      const cp = el('button', 'btn sm', '複製');
      cp.onclick = () => {
        navigator.clipboard?.writeText(s.code).then(() => {
          cp.textContent = '已複製'; setTimeout(() => cp.textContent = '複製', 1400);
        }).catch(() => { });
      };
      sh.appendChild(cp);
      sn.appendChild(sh);
      const pre = el('pre'); const code = el('code', 'blk');
      code.innerHTML = window.highlightCpp(s.code);
      pre.appendChild(code); sn.appendChild(pre);
      b.appendChild(sn);

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
        f.appendChild(links);
        b.appendChild(f);
      }
      d.appendChild(b);
      box.appendChild(d);
    });
  }

  /* ── 速查 ─────────────────────────────────────────────── */
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
  const APIS = [
    ['vector', [['v.push_back(x)', 'O(1)*', '均攤 O(1)'], ['v[i]', 'O(1)', ''],
    ['v.insert(v.begin()+i, x)', 'O(n)', '能避免就避免'], ['sort(v.begin(), v.end())', 'O(n log n)', ''],
    ['v.erase(unique(...), v.end())', 'O(n)', '要先 sort · 去重／離散化'],
    ['lower_bound(...) - v.begin()', 'O(log n)', '要先 sort · 第一個 ≥ x'],
    ['v.assign(n, 0)', 'O(n)', '多測資之間用這個重置']]],
    ['string', [['s.substr(pos, len)', 'O(len)', '第二參數是長度'], ['s.find("abc")', 'O(nm)', '找不到回 npos'],
    ['reverse(s.begin(), s.end())', 'O(n)', ''], ['stoi(s) / to_string(x)', 'O(n)', '']]],
    ['set / map', [['s.insert(x) / mp[k]=v', 'O(log n)', ''], ['s.count(x) / s.find(x)', 'O(log n)', '查詢用這個'],
    ['s.lower_bound(x)', 'O(log n)', '成員函式版'],
    ['std::lower_bound(s.begin(),…)', 'O(n)', '退化！絕不要對 set 用'],
    ['*s.begin() / *s.rbegin()', 'O(1)', '最小 / 最大'],
    ['ms.erase(ms.find(x))', 'O(log n)', 'multiset 只刪一個'],
    ['ms.erase(x)', 'O(log n + k)', '刪光所有等於 x 的']]],
    ['unordered_map / set', [['um[k] / um.count(k)', 'O(1)*', '平均 O(1)、最壞 O(n)'],
    ['有序遍歷 · lower_bound', '—', '不支援']]],
    ['queue / stack / deque', [['q.push / q.front / q.pop', 'O(1)', ''],
    ['st.top() 再 st.pop()', 'O(1)', 'pop 不回傳值'],
    ['dq.push_front / push_back', 'O(1)', ''], ['dq[i]', 'O(1)', 'stack/queue 沒有']]],
    ['priority_queue', [['pq.push(x) / pq.pop()', 'O(log n)', ''], ['pq.top()', 'O(1)', '預設大根堆'],
    ['修改／刪除中間元素', '—', '不支援，用懶惰刪除']]],
    ['演算法', [['max_element / count / find', 'O(n)', '線性搜尋'], ['binary_search', 'O(log n)', '要先 sort'],
    ['accumulate(b, e, 0LL)', 'O(n)', '初值一定寫 0LL'], ['next_permutation', 'O(n)', '要先 sort'],
    ['nth_element', 'O(n)', '只把第 k 小放到位'], ['__gcd(a, b)', 'O(log n)', 'GCC 內建']]]
  ];
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

  function renderRef() {
    const b = $('#budget'); b.innerHTML = '';
    BUDGET.forEach(([n, o, how]) => {
      const tr = el('tr');
      const t1 = el('td', 'n1'); t1.innerHTML = n; tr.appendChild(t1);
      tr.appendChild(el('td', 'n2', o));
      tr.appendChild(el('td', 'n3', how));
      b.appendChild(tr);
    });
    const box = $('#apis'); box.innerHTML = '';
    APIS.forEach(([name, ops]) => {
      const g = el('div');
      g.appendChild(el('div', 'eyebrow', name));
      const tw = el('div', 'tw'); const t = el('table', 'apitbl');
      ops.forEach(([op, cx, ds]) => {
        const tr = el('tr');
        tr.appendChild(el('td', 'op', op));
        tr.appendChild(el('td', 'cx' + (cx === 'O(n)' || cx === 'O(nm)' || cx === '—' ? ' slow' : ''), cx));
        tr.appendChild(el('td', 'ds', ds));
        t.appendChild(tr);
      });
      tw.appendChild(t); g.appendChild(tw); box.appendChild(g);
    });
    const p = $('#pick'); p.innerHTML = '';
    PICK.forEach(([need, use]) => {
      const tr = el('tr');
      tr.appendChild(el('td', null, need));
      const u = el('td', 'op'); u.style.color = 'var(--gold-hi)'; u.style.fontWeight = '600';
      u.style.fontFamily = 'var(--mono)'; u.textContent = use;
      tr.appendChild(u); p.appendChild(tr);
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
  }

  /* ── 考古 ─────────────────────────────────────────────── */
  function renderPast() {
    // 高頻重複題：跨場次出現 ≥2 次，或同時落在一星選集與歷屆中
    const freq = {};
    EXAMS.forEach(e => e.ps.forEach(p => { freq[p.uva] = (freq[p.uva] || 0) + 1; }));
    const s1 = new Set(P1.map(p => p.uva));
    const titleOf = {};
    EXAMS.forEach(e => e.ps.forEach(p => titleOf[p.uva] = p.title));
    const hot = Object.keys(freq)
      .filter(u => freq[u] >= 2 || s1.has(+u))
      .sort((a, b) => freq[b] - freq[a] || a - b);
    const hots = $('#hots'); hots.innerHTML = '';
    hot.forEach(u => {
      const a = el('a', 'tag hot', u + ' ' + titleOf[u] + (freq[u] >= 2 ? ' ×' + freq[u] : ''));
      a.href = uvaURL(u); a.target = '_blank'; a.rel = 'noopener';
      a.style.textDecoration = 'none';
      hots.appendChild(a);
    });

    const box = $('#exams'); box.innerHTML = '';
    EXAMS.forEach((e, i) => {
      const d = el('details', 'exam'); if (i === 0) d.open = true;
      const sm = el('summary');
      sm.appendChild(el('span', 'dt', e.date));
      const easy = e.ps.filter(p => p.st === 1).length;
      sm.appendChild(el('span', 'mix', '☆ × ' + easy));
      d.appendChild(sm);
      const tw = el('div', 'tw'); const t = el('table');
      const tr0 = el('tr');
      ['#', '題目', '題號', '難度'].forEach(x => tr0.appendChild(el('th', null, x)));
      t.appendChild(tr0);
      e.ps.forEach((p, j) => {
        const r = el('tr');
        r.appendChild(el('td', 'n', String(j + 1)));
        const td = el('td');
        const a = el('a', 'pname', p.title);
        a.href = linkFor(p); a.target = '_blank'; a.rel = 'noopener';
        td.appendChild(a); r.appendChild(td);
        r.appendChild(el('td', 'n', p.uva + (p.zj ? ' / ' + p.zj : '')));
        r.appendChild(el('td', 'stars', p.st ? '☆'.repeat(p.st) : '—'));
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
    showCard();
  };
  $('#shuffle').onclick = buildDeck;
  $('#resetcards').onclick = () => { S.set('known', S.get('known', []).filter(i => !inMode(i))); buildDeck(); };
  $('#deckseg').querySelectorAll('button').forEach(b => {
    if (b.dataset.d === mode) { $('#deckseg').querySelectorAll('button').forEach(x => x.classList.remove('on')); b.classList.add('on'); }
    b.onclick = () => {
      $('#deckseg').querySelectorAll('button').forEach(x => x.classList.remove('on'));
      b.classList.add('on'); mode = b.dataset.d; S.set('deckmode', mode); buildDeck();
    };
  });

  $('#starseg').querySelectorAll('button').forEach(b => {
    if (+b.dataset.s === star) { $('#starseg').querySelectorAll('button').forEach(x => x.classList.remove('on')); b.classList.add('on'); }
    b.onclick = () => {
      $('#starseg').querySelectorAll('button').forEach(x => x.classList.remove('on'));
      b.classList.add('on'); star = +b.dataset.s; S.set('star', star); renderList();
    };
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
  renderList(); renderSkills(); renderRef(); renderPast();

  const last = S.get('tab', 'today');
  if (last !== 'today') {
    const lb = document.querySelector('.tab[data-v="' + last + '"]');
    if (lb) lb.click();
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => { });
    });
  }
})();

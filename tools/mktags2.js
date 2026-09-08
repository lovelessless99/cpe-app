/* 從解答程式碼推導標籤 — 收緊規則，只留有鑑別度的 */
const fs = require('fs');
const R = require('path').join(__dirname,'..') + '/';
const S = ['solutions', 'solutions2', 'solutions3', 'solutions4', 'solutions5', 'solutions6', 'solutions7', 'solutions8', 'solutions9', 'solutions10', 'solutions11', 'solutions12', 'solutions13', 'solutions14', 'solutions15', 'solutions16', 'solutions17', 'solutions18', 'solutions19', 'solutions20', 'solutions21', 'solutions22', 'solutions23', 'solutions24', 'solutions25', 'solutions26', 'solutions27', 'solutions28', 'solutions29', 'solutions30', 'solutions31', 'solutions32', 'solutions33', 'solutions34', 'solutions35', 'solutions36', 'solutions37', 'solutions38', 'solutions39', 'solutions40', 'solutions41', 'solutions42', 'solutions43', 'solutions44', 'solutions45', 'solutions46', 'solutions47', 'solutions48', 'solutions49', 'solutions50', 'solutions51', 'solutions52', 'solutions53', 'solutions54', 'solutions55', 'solutions56', 'solutions57', 'solutions58', 'solutions59', 'solutions60', 'solutions61', 'solutions62', 'solutions63', 'solutions64', 'solutions65', 'solutions66', 'solutions67', 'solutions68', 'solutions69', 'solutions70', 'solutions71', 'solutions72', 'solutions73', 'solutions74', 'solutions75', 'solutions76', 'solutions77', 'solutions78', 'solutions79', 'solutions80', 'solutions81', 'solutions82', 'solutions83', 'solutions84', 'solutions85', 'solutions86', 'solutions87', 'solutions88', 'solutions89', 'solutions90', 'solutions91', 'solutions92', 'solutions93', 'solutions94', 'solutions95', 'solutions96', 'solutions97', 'solutions98', 'solutions99', 'solutions100', 'solutions101', 'solutions102', 'solutions103', 'solutions104', 'solutions105', 'solutions106', 'solutions107', 'solutions108'];
const A = new Function(S.map(f => fs.readFileSync(R + 'js/' + f + '.js', 'utf8')).join('\n') +
  ';return Object.assign({},SOL,SOL2,SOL3,SOL4,SOL5,SOL6,SOL7,SOL8,SOL9,SOL10,SOL11,SOL12,SOL13,SOL14,SOL15,SOL16,SOL17,SOL18,SOL19,SOL20,SOL21,SOL22,SOL23,SOL24,SOL25,SOL26,SOL27,SOL28,SOL29,SOL30,SOL31,SOL32,SOL33,SOL34,SOL35,SOL36,SOL37,SOL38,SOL39,SOL40,SOL41,SOL42,SOL43,SOL44,SOL45,SOL46,SOL47,SOL48,SOL49,SOL50,SOL51,SOL52,SOL53,SOL54,SOL55,SOL56,SOL57,SOL58,SOL59,SOL60,SOL61,SOL62,SOL63,SOL64,SOL65,SOL66,SOL67,SOL68,SOL69,SOL70,SOL71,SOL72,SOL73,SOL74,SOL75,SOL76,SOL77,SOL78,SOL79,SOL80,SOL81,SOL82,SOL83,SOL84,SOL85,SOL86,SOL87,SOL88,SOL89,SOL90,SOL91,SOL92,SOL93,SOL94,SOL95,SOL96,SOL97,SOL98,SOL99,SOL100,SOL101,SOL102,SOL103,SOL104,SOL105,SOL106,SOL107,SOL108);')();

const RULES = [
  // 演算法（優先顯示）
  ['BFS',          c => /queue<pair/.test(c) || /多源 BFS|網格 BFS/.test(c)],
  ['DFS',          c => /void dfs|dfs\(\d|dfs\(idx|遞迴|回溯/.test(c)],
  ['DP',           c => /\bdp\[|\bmemo\[|背包|狀態轉移/.test(c)],
  ['並查集',       c => /並查集|int find\(int x\)/.test(c)],
  ['圖',           c => /vector<vector<int>>\s*g\b|鄰接|連通/.test(c)],
  ['貪心',         c => /貪心/.test(c)],
  ['二分',         c => /二分|lower_bound|upper_bound/.test(c)],
  ['分治',         c => /merge_?[Cc]ount|合併排序|分治/.test(c)],
  ['逆序數',       c => /逆序/.test(c)],
  ['質數篩',       c => /notp\[|sieve|質數篩/.test(c)],
  ['數論',         c => /__gcd|質因數|因數和|模逆|快速冪|進位轉換/.test(c)],
  ['幾何',         c => /hypot|cross\(|acos|sqrt\(.*\*.*-|幾何|夾角|座標/.test(c)],
  ['組合列舉',     c => /next_permutation|1 << n|子集|排列/.test(c)],
  ['模擬',         c => /模擬|逐步|逐天|逐回合/.test(c)],
  ['前綴和',       c => /前綴和|差分/.test(c)],
  // 資料結構
  ['map',          c => /\bmap<|unordered_map</.test(c)],
  ['set',          c => /\bset<|multiset</.test(c)],
  ['stack',        c => /\bstack</.test(c)],
  ['queue',        c => /\bqueue<(?!pair)/.test(c)],
  ['heap',         c => /priority_queue/.test(c)],
  ['deque',        c => /\bdeque</.test(c)],
  ['二維陣列',     c => /\[\d{2,}\]\[\d{2,}\]|vector<vector<|網格|矩陣/.test(c)],
  // 實作重點
  ['自訂排序',     c => /sort\([^)]*,\s*\[|comparator/.test(c)],
  ['字串解析',     c => /stringstream|getline\(ss|切詞|token/.test(c)],
  ['格式輸出',     c => /setw|setprecision|setfill/.test(c)],
  ['大數處理',     c => /大數|上百位|string.*相加|數字串/.test(c)],
];

// 沒命中任何規則時的兜底：看題目本身在做什麼
const FALLBACK = [
  ['字串處理', c => /getline|substr|s\[i\]|string s/.test(c)],
  ['數學',     c => /公式|等差|平方|整除|%/.test(c)],
  ['模擬',     c => true],
];

const TAGS = {};
Object.keys(A).forEach(u => {
  const all = A[u].c + ' ' + A[u].h + ' ' + A[u].t + ' ' + A[u].q;
  let t = RULES.filter(([, f]) => f(all)).map(([n]) => n);
  if (!t.length) for (const [n, f] of FALLBACK) if (f(all)) { t = [n]; break; }
  TAGS[u] = t.slice(0, 5);
});

const counts = {};
Object.values(TAGS).forEach(t => t.forEach(x => counts[x] = (counts[x] || 0) + 1));
console.log('標籤分布（' + Object.keys(TAGS).length + ' 題）：');
Object.entries(counts).sort((a, b) => b[1] - a[1])
  .forEach(([k, v]) => console.log('  ' + k.padEnd(12) + String(v).padStart(3) + ' 題'));
const none = Object.keys(TAGS).filter(u => !TAGS[u].length);
console.log('無標籤:', none.length ? none.join(' ') : '0 ✓');
const avg = Object.values(TAGS).reduce((a, t) => a + t.length, 0) / Object.keys(TAGS).length;
console.log('平均每題', avg.toFixed(1), '個標籤');

fs.writeFileSync(R + 'js/tags.js',
  '/* 各題用到的資料結構與演算法（由解答程式碼與題意推導） */\nconst TAGS=' +
  JSON.stringify(TAGS) + ';\n');
console.log('tags.js:', (fs.statSync(R + 'js/tags.js').size / 1024).toFixed(1), 'KB');

/* 課表、陷阱卡、技巧導讀 — 手動維護 */

const PLAN = [
  [1, 1, "I/O 樣式與多測資", "多測資讀到 EOF、輸出格式", "c039,a012,d226"],
  [1, 2, "string 全套", "substr / find / stringstream", "c007,c045,e578,c012"],
  [1, 3, "vector + 自訂 comparator", "sort 與 lambda", "d750,a743,e507"],
  [1, 4, "二維陣列 / 網格模擬", "方向陣列", "e605,e513,c082"],
  [1, 5, "基礎數學", "GCD、質數篩、進位轉換", "c014,d255,a134,d387"],
  [1, 6, "map / set", "計數與去重，出現率極高", "c044,d492,U10815"],
  [1, 7, "★ 基準模擬考 2025/03/25", "限時 3 小時，記錄拿幾題", ""],
  [2, 8, "數字處理", "位數、進位、11 的倍數", "d672,d235,a132,c813"],
  [2, 9, "貪心", "排序後掃一遍", "e579,d189,a737"],
  [2, 10, "日期 / 時間計算", "閏年與 Zeller", "f709,U12019"],
  [2, 11, "幾何入門", "點線距離、對稱點", "e512,e516"],
  [2, 12, "大數 / 溢位", "long long 與字串加法", "d123,U10814"],
  [2, 13, "補完 49 題未打勾的", "", ""],
  [2, 14, "★ 模擬考 #2 2024/10/15", "限時 3 小時", ""],
  [3, 15, "queue + BFS 網格", "本週最重要", "c124,e699"],
  [3, 16, "DFS / Flood Fill", "連通塊計數", "c129,U10336"],
  [3, 17, "DSU（選修）", "只需合併與查連通時", "d813,U10608"],
  [3, 18, "priority_queue（選修）", "每次取最值", "d221,U908"],
  [3, 19, "逆序數", "相鄰交換次數", "a539,d542"],
  [3, 20, "二分答案 + 前綴和（選修）", "最大的最小值", "U714,a540"],
  [3, 21, "★ 模擬考 #3 2024/12/10", "限時 3 小時", ""],
  [4, 22, "DP：硬幣 / 計數", "迴圈順序決定對錯", "d133,d253"],
  [4, 23, "0/1 背包", "內層逆序", "f440,U562"],
  [4, 24, "LIS / LCS", "", "d052,c001"],
  [4, 25, "★ 模擬考 #4 2025/05/20", "限時 3 小時", ""],
  [4, 26, "檢討 · 補完模擬考沒過的題", "", ""],
  [4, 27, "★ 模擬考 #5 2023/03/21", "限時 3 小時", ""],
  [4, 28, "模板默寫測試", "不看檔案手寫 BFS / 背包 / comparator", ""],
  [4, 29, "降量 · 隨機抽 1 套考古題", "", ""],
  [4, 30, "降量 · 早睡", "", ""]
];

const CPS = [
  [7, "2–3 題", "第 2 週全部拿去刷一星 49 題，第 3 週選修全砍"],
  [14, "3–4 題", "第 3 週只做 BFS/DFS，DSU 與 priority_queue 全砍"],
  [21, "4–5 題", "第 4 週只做硬幣 DP + 背包，LIS/LCS 砍掉"],
  [25, "5 題", "已達標，只做穩定它，不要開新主題"]
];

const TRAPTAGS = ["I/O", "STL", "DP", "圖", "數學", "題目", "策略", "判題"];

const CARDS = [
  ["I/O", "多測資沒給筆數，怎麼讀？", "<code>while (cin >> a >> b)</code> 讀到 EOF。<b>忘記寫是 CPE 最大宗的 WA 來源</b>，跟演算法無關。"],
  ["I/O", "<code>cin >> n</code> 之後要 <code>getline</code>，會發生什麼？", "讀到空字串——行尾的 <code>\\n</code> 還留著。中間要補 <code>cin.ignore();</code>"],
  ["I/O", "測資之間空行、但最後一筆不空，怎麼寫？", "把換行印在<b>前面</b>而不是後面：<br><code>if (tc > 1) cout << '\\n';</code>"],
  ["I/O", "字串含空白怎麼讀？", "<code>getline(cin, s)</code>。<code>cin >> s</code> 遇到空白就停，會把一行切碎。"],
  ["I/O", "大量輸出用 <code>endl</code> 會怎樣？", "每次都 flush → <b>TLE</b>。一律用 <code>'\\n'</code>。"],
  ["STL", "<code>multiset</code> 只想刪掉一個元素？", "<code>ms.erase(ms.find(x))</code>。<br>寫 <code>ms.erase(x)</code> 會把<b>所有</b>等於 x 的一次刪光——multiset 最經典的 WA。"],
  ["STL", "只是想查 map 裡有沒有 key，能用 <code>mp[key]</code> 嗎？", "<b>不行</b>，它會插入一個新元素，map 愈查愈大、迴圈結果跟著錯。<br>用 <code>mp.count(key)</code> 或 <code>mp.find(key)</code>。"],
  ["STL", "在 <code>set</code> 上找前驅後繼，用哪個 lower_bound？", "成員函式 <code>s.lower_bound(x)</code>。<br><code>std::lower_bound(s.begin(),...)</code> 會退化成 <b>O(n)</b>，因為 set 的迭代器不能隨機跳。"],
  ["STL", "<code>priority_queue</code> 預設是大根堆還是小根堆？", "<b>大根堆</b>（top 是最大值）。要小根堆：<br><code>priority_queue&lt;int, vector&lt;int&gt;, greater&lt;int&gt;&gt; pq;</code>"],
  ["STL", "多測資之間要清空 <code>queue</code>，但它沒有 clear()？", "<code>q = queue&lt;int&gt;();</code> 直接整個換掉。"],
  ["STL", "<code>accumulate(v.begin(), v.end(), 0)</code> 有什麼問題？", "初值 <code>0</code> 是 int，<b>累加過程就已經溢位</b>，就算結果存進 long long 也來不及。<br>寫 <code>0LL</code>。"],
  ["STL", "<code>for (int i = 0; i < v.size() - 1; ++i)</code> 什麼時候爆炸？", "v 是空的時候。<code>size()</code> 是無號數，<code>0 - 1</code> 變成極大值 → 無限迴圈。"],
  ["STL", "<code>st.pop()</code> 回傳什麼？", "<b>什麼都不回傳</b>。要先 <code>top()</code> 取值再 <code>pop()</code>。"],
  ["STL", "排序後去重的兩行慣用法？", "<code>sort(v.begin(), v.end());</code><br><code>v.erase(unique(v.begin(), v.end()), v.end());</code><br>離散化就是這兩行。"],
  ["DP", "0/1 背包的一維寫法，內層迴圈方向？", "<b>逆序</b> <code>for (w = W; w >= wt[i]; --w)</code>。<br>寫成正序就變完全背包（每件可拿無限次）。"],
  ["DP", "硬幣<b>組合數</b>的兩層迴圈，誰在外層？", "<b>外層跑硬幣、內層跑金額且正序</b>。<br>對調就變成排列數，答案會大到離譜（UVa 674 的經典坑）。"],
  ["DP", "LIS 的 O(n log n) 寫法，tail 陣列是 LIS 本身嗎？", "<b>不是</b>。只有 <code>tail.size()</code> 是對的。要印出序列得另外記前驅。"],
  ["DP", "嚴格遞減的網格路徑 DP，需要 visited 嗎？", "<b>不需要</b>——嚴格遞減本身就保證無環。想通這點整類題就通了（UVa 10285）。"],
  ["圖", "大網格用遞迴 DFS 做 flood fill？", "會<b>爆 stack</b>。網格題一律優先用 BFS。"],
  ["圖", "Dijkstra 的懶惰刪除怎麼寫？", "<code>if (du > d[u]) continue;</code><br>priority_queue 不能修改既有元素，新距離直接 push，取出時跳過過期的。"],
  ["圖", "題目給 1-based 編號，怎麼處理最不會錯？", "<b>進來就統一減 1</b>，全程只用 0-based，輸出時再加回去。中途換算必出事。"],
  ["圖", "字串節點發號碼，為什麼不能寫 <code>id[s] = id.size()</code>？", "等號兩邊<b>求值順序沒有保證</b>——<code>id[s]</code> 可能先插入才算 size，全部差 1。<br>先 <code>int k = id.size();</code> 再 <code>id[s] = k;</code>"],
  ["圖", "起火點有很多個，怎麼算每格最早被燒到的時間？", "<b>多源 BFS</b>：一開始就把所有起點都 push 進 queue，距離都設 0。"],
  ["數學", "C++ 的 <code>-7 % 3</code> 是多少？", "<b>-1</b>，不是 2。取模要修正：<br><code>((a % m) + m) % m</code>"],
  ["數學", "質數篩該放哪裡？", "<b>迴圈外，只建一次</b>。放進多測資的迴圈裡重建必 TLE（UVa 543 的坑）。"],
  ["數學", "浮點數怎麼比較？", "<code>fabs(a - b) < 1e-9</code>。永遠不要用 <code>==</code>。"],
  ["數學", "lcm 怎麼寫才不溢位？", "<code>a / __gcd(a,b) * b</code>——<b>先除再乘</b>。<br>寫成 <code>a * b / gcd</code> 中間會爆。"],
  ["題目", "UVa 100 (3n+1)：輸入 i > j 怎麼辦？", "計算時交換範圍，但<b>輸出必須維持原本的 i j 順序</b>。這是本題唯一難點。"],
  ["題目", "UVa 10038 Jolly Jumpers：n = 1 的答案？", "<b>Jolly</b>。另外差值可能大於 n-1，直接當索引會越界。"],
  ["題目", "UVa 673 括號匹配：空字串的答案？", "<b>Yes</b>，空字串是合法的。<br>讀完測資數 n 之後要 <code>cin.ignore()</code>，否則第一筆被讀成空行。"],
  ["題目", "UVa 572 Oil Deposits：幾個方向？", "<b>八方向</b>，不是四方向。"],
  ["題目", "UVa 10130 SuperSale：全家共用一個背包嗎？", "<b>不是</b>，每人各自獨立挑選。跑一次背包得 dp[w]，再對每個人查 <code>dp[limit]</code> 累加。"],
  ["題目", "UVa 543 Goldbach：2 可以用嗎？", "<b>不行</b>，題目要求兩個<b>奇</b>質數，必須排除 2。"],
  ["題目", "UVa 10474：lower_bound 找到了就對了？", "不一定。找不到時它指向<b>比它大的元素</b>而非 end()。<br>必須檢查該位置的值是否真的等於 x。位置還要 +1 轉 1-based。"],
  ["題目", "UVa 573 The Snail：判定順序？", "<b>白天爬完先判是否超過井口</b>（要 &gt; H），成功立刻結束；沒成功才滑落。順序寫反全錯。"],
  ["題目", "UVa 191：判線段與矩形相交，最常漏掉什麼？", "<b>線段完全落在矩形內部</b>。<br>另外矩形兩對角點順序不保證，要先取 min/max 正規化。"],
  ["題目", "UVa 10099 Tourist Guide：每趟能載幾人？", "<code>c - 1</code>——<b>導遊本人要占一個位子</b>。這個 -1 漏掉就全錯。"],
  ["題目", "UVa 524 Prime Ring：什麼時候檢查質數？", "<b>放置的當下就檢查</b>與前一個數的和。排完整圈再驗證會 TLE。"],
  ["策略", "一題卡多久該換？", "<b>25 分鐘</b>沒思路就換題。不要有沉沒成本。"],
  ["策略", "第 6、7 題怎麼處理？", "<b>不讀</b>。除非你在 1:30 前就解完 5 題。<br>7 題全解出的人佔 0.2%——放掉它們才拿得到 5 題。"],
  ["策略", "送出之前一定要做什麼？", "把<b>樣例 copy 進去跑，肉眼逐字比對輸出</b>。大小寫、標點、空行，錯一個字就是 WA。"],
  ["策略", "模擬考該排在什麼時段？", "<b>18:40–21:40</b>，跟正式考試一樣。三小時的專注力在晚上九點半是什麼狀態，只有真的做過才知道。"],
  ["複雜度", "判題機一秒大約能跑幾次基本運算？", "<b>10<sup>8</sup> 次</b>，時限通常 1–3 秒。所有「會不會 TLE」的判斷都從這個數字推。"],
  ["複雜度", "n ≤ 5000，可以寫雙層迴圈嗎？", "<b>可以</b>。O(n²) = 2500 萬次，穩過。"],
  ["複雜度", "n = 10<sup>5</sup>，可以寫雙層迴圈嗎？", "<b>絕對不行</b>。O(n²) = 100 億次，必 TLE。<br>看到 10<sup>5</sup> 就要想 O(n log n)。"],
  ["複雜度", "n ≤ 22 的題目在暗示什麼？", "<b>子集列舉 / bitmask</b>，O(2ⁿ)。<br>n ≤ 11 則是 O(n!)，直接 next_permutation 暴力。"],
  ["複雜度", "n ≤ 100 可以寫到多慢？", "<b>O(n³)</b>，一百萬次。三層迴圈、Floyd、區間 DP 都在範圍內。"],
  ["複雜度", "DP 的複雜度怎麼估？", "<b>狀態數 × 單次轉移代價</b>。<br>狀態 10<sup>6</sup> × 轉移 O(1) 沒問題；× O(n) 就要想辦法砍一維。"],
  ["API", "vector 排序後去重，兩行？", "<code>sort(v.begin(), v.end());</code><br><code>v.erase(unique(v.begin(), v.end()), v.end());</code>"],
  ["API", "已排序的 vector，怎麼求 x 出現幾次？", "<code>upper_bound(...) - lower_bound(...)</code>，兩者都是 O(log n)。"],
  ["API", "<code>lower_bound</code> 和 <code>upper_bound</code> 差在哪？", "lower = 第一個 <b>≥ x</b><br>upper = 第一個 <b>&gt; x</b>"],
  ["API", "取得最大值的<b>位置</b>而不是值？", "<code>max_element(v.begin(), v.end()) - v.begin()</code>"],
  ["API", "DSU 的 p 陣列怎麼初始化最短？", "<code>iota(p.begin(), p.end(), 0);</code>（<code>&lt;numeric&gt;</code>）"],
  ["API", "只想知道第 k 小是誰，不用整個排序？", "<code>nth_element(v.begin(), v.begin()+k, v.end());</code><br><b>O(n)</b>，比 sort 快。"],
  ["API", "<code>next_permutation</code> 用之前要做什麼？", "<b>先 sort</b>，否則只會拿到字典序在當前之後的排列，不是全部。"],
  ["API", "二維 vector 怎麼開？", "<code>vector&lt;vector&lt;int&gt;&gt; dp(n, vector&lt;int&gt;(m, 0));</code>"],
  ["API", "字串按逗號切開？", "<code>stringstream ss(line);</code><br><code>while (getline(ss, tok, ',')) { ... }</code><br>換成 <code>ss >> tok</code> 就是按空白切。"],
  ["API", "字串轉小寫一行寫法？", "<code>transform(s.begin(), s.end(), s.begin(), ::tolower);</code>"],
  ["API", "區間加值、最後才查詢，用什麼？", "<b>差分</b>：<code>d[l] += v; d[r+1] -= v;</code> 最後前綴和還原。"],
  ["API", "pair 的預設排序規則？", "<b>先比 first，再比 second</b>。多關鍵字排序直接用 <code>pair</code> 存，連 comparator 都不用寫。"],
  ["判題", "送出後看到 <b>WA</b>，第一件事該做什麼？", "<b>檢查輸出格式，不是改演算法。</b><br>WA = Wrong Answer，程式有跑完但輸出不對。先看空格、換行、大小寫、單複數、測資間空行，再看邊界（n=0、單一元素）。"],
  ["判題", "看到 <b>TLE</b> 該怎麼辦？", "TLE = Time Limit Exceeded，<b>演算法太慢</b>。<br>要換複雜度更低的做法——調輸出格式完全沒用。先看 n 的範圍推該用什麼複雜度。"],
  ["判題", "<b>RE</b> 通常是什麼原因？", "Runtime Error：執行時炸了。<br>最常見三種：<b>陣列越界</b>、<b>除以零</b>、<b>遞迴太深爆 stack</b>（大網格用遞迴 DFS 就會這樣）。"],
  ["判題", "<b>PE</b> 跟 WA 差在哪？", "PE = Presentation Error，<b>答案是對的但排版錯</b>（多餘空格或換行）。<br>有些系統寬容地判 PE，有些直接判 WA——所以不能賭，格式要一次寫對。"],
  ["語言", "考場能用 <code>#include &lt;bits/stdc++.h&gt;</code> 嗎？", "GCC 可以。但 <b>17:40–18:30 的練習時段一定要先編一次確認</b>，連同 <code>auto [a,b]</code> 一起測。"],
  ["語言", "<code>greater&lt;&gt;</code> 和 <code>greater&lt;int&gt;</code> 該寫哪個？", "<b>寫完整的 <code>greater&lt;int&gt;</code></b>。省略型別是 C++14 的透明比較器，少打幾個字不值得在考場賭編譯器版本。"]
];

/* 技巧導讀：何時用 / 想法 / 模板 / 對應題目
   lv: 1=必修 2=選修 3=超綱（這個月不碰） */
const SKILLS = [
  {
    id: "io", name: "多測資 I/O", lv: 1, when: "每一題。CPE 幾乎所有題目都是多組測資。",
    idea: "先確認題目屬於哪一種結束條件——讀到 EOF、讀到哨兵值、還是先給筆數。這是動手前的第一個判斷，也是全場最容易失分的地方：歷屆 WA 有一半出在這裡，跟演算法完全無關。",
    code: `// (a) 讀到 EOF
while (cin >> a >> b) { ... }

// (b) 讀到 0 結束
while (cin >> n && n) { ... }

// (c) 先給筆數
int T; cin >> T;
while (T--) { ... }

// (d) 混用 >> 與 getline
int n; cin >> n;
cin.ignore();              // 吃掉行尾的 '\\n'
string line;
getline(cin, line);

// 測資之間空行、最後一筆不空
if (tc > 1) cout << '\\n';`,
    probs: [[100, "c039"], [10035, "c014"], [10008, "c044"]]
  },
  {
    id: "cmp", name: "自訂排序", lv: 1, when: "要按多個關鍵字排序，或排序規則不是預設的大小。",
    idea: "comparator 回傳 true 代表「a 應該排在 b 前面」。多關鍵字就逐層比：第一個鍵不相等時直接用它決定，相等才往下一個鍵。若鍵的優先序剛好是自然順序，直接用 pair 或 tuple 存，連 comparator 都不用寫——這是最省時間的做法。",
    code: `sort(v.begin(), v.end(), [](const P& a, const P& b) {
    if (a.score != b.score) return a.score > b.score;  // 分數大的在前
    return a.name < b.name;                            // 同分名字小的在前
});

// 字頻統計後按次數排序（高頻 pattern）
map<string,int> cnt;
for (auto& w : words) cnt[w]++;
vector<pair<string,int>> vp(cnt.begin(), cnt.end());
sort(vp.begin(), vp.end(), [](const pair<string,int>& a,
                              const pair<string,int>& b) {
    if (a.second != b.second) return a.second > b.second;
    return a.first < b.first;
});`,
    probs: [[11321, "d750"], [10420, "a743"], [10062, "c012"]]
  },
  {
    id: "grid", name: "網格模擬", lv: 1, when: "題目給一張二維圖，要數鄰居、旋轉、或逐格處理。",
    idea: "把方向寫成陣列，用一個迴圈跑完所有鄰居，不要手寫八個 if——那是錯誤的溫床。邊界檢查獨立成一個判斷，寫在迴圈最前面先 continue 掉，主邏輯才會乾淨。",
    code: `int dx[4] = {0, 0, 1, -1};
int dy[4] = {1, -1, 0, 0};
// 八方向
int ddx[8] = {-1,-1,-1, 0,0, 1,1,1};
int ddy[8] = {-1, 0, 1,-1,1,-1,0,1};

for (int d = 0; d < 4; d++) {
    int nx = x + dx[d], ny = y + dy[d];
    if (nx < 0 || nx >= n || ny < 0 || ny >= m) continue;
    // 處理 (nx, ny)
}`,
    probs: [[10189, "e605"], [11349, "e513"], [490, "c045"]]
  },
  {
    id: "mapset", name: "map / set", lv: 1, when: "計數、去重、查有沒有出現過、需要有序遍歷。",
    idea: "先問一個問題：key 是不是小範圍整數？是的話直接開 vector 陣列，比任何關聯容器都快也好寫。不是（字串、大整數、pair）才用 map / set。純查詢一律用 count 或 find，絕不要用 mp[key]——那會偷偷插入新元素。",
    code: `map<string,int> cnt;
cnt["apple"]++;                 // 不存在會自動建立並歸 0
if (cnt.count("apple")) ...     // 查詢用 count，不要用 cnt[...]
for (auto& [k, v] : cnt) ...    // 按 key 升冪

set<int> s;
s.insert(x);
auto it = s.lower_bound(x);     // 成員函式！不要用 std::lower_bound
int mn = *s.begin(), mx = *s.rbegin();

multiset<int> ms;
ms.erase(ms.find(x));           // 只刪一個
ms.erase(x);                    // 刪光所有等於 x 的`,
    probs: [[10226, "d492"], [10420, "a743"], [11063, "d123"]]
  },
  {
    id: "math", name: "基礎數論", lv: 1, when: "質數、因數、GCD、進位轉換。",
    idea: "篩表只建一次、放在迴圈外——放進多測資的迴圈裡重建是最常見的 TLE 原因。判斷單一個數是不是質數用 O(√n) 試除就夠，不必為了一次查詢建整張表。",
    code: `const int N = 1000006;
bool notp[N];
vector<int> primes;

void sieve() {                   // main 開頭呼叫一次
    notp[0] = notp[1] = true;
    for (int i = 2; i < N; i++) {
        if (notp[i]) continue;
        primes.push_back(i);
        for (ll j = (ll)i*i; j < N; j += i) notp[j] = true;
    }
}

bool isPrime(ll x) {             // 單一查詢用這個
    if (x < 2) return false;
    for (ll i = 2; i*i <= x; i++) if (x % i == 0) return false;
    return true;
}

ll g = __gcd(a, b);
ll l = a / g * b;                // 先除再乘防溢位`,
    probs: [[10235, "d387"], [11417, "d255"], [10193, "d306"]]
  },
  {
    id: "greedy", name: "貪心", lv: 1, when: "「最少需要幾個」「最大能拿多少」，且每一步的最佳選擇不影響後面。",
    idea: "九成的貪心題都是「先排序，再掃一遍」。難的不是寫，是說服自己這樣選是對的——考場上沒時間證明，就用小測資手算兩三組驗證。若手算就找到反例，代表要改用 DP。",
    code: `// 區間覆蓋：按左端點排序，每輪選右端點最遠的
sort(seg.begin(), seg.end());
double cur = 0; int cnt = 0, i = 0;
while (cur < L) {
    double far = cur;
    while (i < n && seg[i].l <= cur) far = max(far, seg[i++].r);
    if (far == cur) { cnt = -1; break; }   // 延伸不了 → 無解
    cur = far; cnt++;
}`,
    probs: [[10050, "e579"], [11150, "d189"], [10041, "a737"]]
  },
  {
    id: "bfs", name: "BFS 最短路", lv: 1, when: "網格或圖上求最少步數，且每一步代價都是 1。",
    idea: "BFS 的正確性來自「先進先出保證按距離分層」——所以只在邊權全為 1 時成立，權重不一樣就得用 Dijkstra。距離陣列同時當 visited 用（-1 代表沒走過），少開一個陣列也少一個忘記重置的機會。起點有很多個就全部先 push 進去，這就是多源 BFS。",
    code: `int dist[105][105];
int dx[4] = {0,0,1,-1}, dy[4] = {1,-1,0,0};

int bfs(int sx, int sy, int tx, int ty) {
    memset(dist, -1, sizeof(dist));
    queue<pair<int,int>> q;
    q.push({sx, sy}); dist[sx][sy] = 0;
    while (!q.empty()) {
        auto [x, y] = q.front(); q.pop();
        if (x == tx && y == ty) return dist[x][y];
        for (int d = 0; d < 4; d++) {
            int nx = x + dx[d], ny = y + dy[d];
            if (nx < 0 || nx >= n || ny < 0 || ny >= m) continue;
            if (g[nx][ny] == '#' || dist[nx][ny] != -1) continue;
            dist[nx][ny] = dist[x][y] + 1;
            q.push({nx, ny});
        }
    }
    return -1;
}`,
    probs: [[532, "c124"], [11624, "e699"], [439, "c117"]]
  },
  {
    id: "ff", name: "Flood Fill", lv: 1, when: "數連通塊、把一整片區域標記起來。",
    idea: "外面包一層雙迴圈掃全圖，遇到沒訪問過的目標就展開一次，計數加一。展開用 BFS 而不是遞迴 DFS——大網格遞迴會爆 stack，這是考場上最難 debug 的一種 RE。方向數要先看清楚題目是四還是八。",
    code: `int cnt = 0;
for (int i = 0; i < n; i++)
    for (int j = 0; j < m; j++)
        if (g[i][j] == '@' && !vis[i][j]) { bfsFill(i, j); cnt++; }`,
    probs: [[572, "c129"], [10336, ""], [10653, ""]]
  },
  {
    id: "knap", name: "0/1 背包", lv: 1, when: "n 個物品各選或不選，總重不超過 W，求最大價值。",
    idea: "一維滾動的內層必須逆序。想通這件事的關鍵：正序時 dp[w-wt] 已經是「這一輪更新過」的值，等於同一件物品被拿了第二次——那就變成完全背包了。所以逆序是為了保證每件物品只用一次。",
    code: `int dp[1005];
memset(dp, 0, sizeof(dp));
for (int i = 0; i < n; i++)
    for (int w = W; w >= wt[i]; w--)      // 逆序！
        dp[w] = max(dp[w], dp[w-wt[i]] + val[i]);`,
    probs: [[10130, "f440"], [562, ""], [12455, "a522"]]
  },
  {
    id: "coin", name: "計數 DP", lv: 1, when: "問「有幾種組合方式」而不是「最大值」。",
    idea: "外層跑硬幣、內層跑金額，算出來是組合數；兩層對調就變成排列數。差別在於：外層固定硬幣時，每種硬幣只會被「考慮」一次，所以 {1,5} 和 {5,1} 不會被算成兩種。這是計數 DP 最經典的坑，務必親手踩一次。",
    code: `ll dp[30005];
int coin[5] = {1,5,10,25,50};
dp[0] = 1;
for (int c : coin)                      // 外層跑硬幣
    for (int i = c; i <= 30000; i++)    // 內層正序
        dp[i] += dp[i-c];`,
    probs: [[674, "d253"], [357, "d133"], [147, ""]]
  },
  {
    id: "lis", name: "LIS / LCS", lv: 1, when: "最長遞增子序列、最長共同子序列。",
    idea: "LIS 的 O(n log n) 寫法在維護「長度為 i 的遞增序列，結尾最小可能是多少」。所以 tail 陣列的長度是對的，但內容不是真正的 LIS——要印出序列必須另外記前驅。嚴格遞增用 lower_bound，非嚴格用 upper_bound。",
    code: `// LIS O(n log n)
vector<int> tail;
for (int x : a) {
    auto it = lower_bound(tail.begin(), tail.end(), x);
    if (it == tail.end()) tail.push_back(x);
    else *it = x;
}
int lis = tail.size();

// LCS O(nm)
for (int i = 1; i <= n; i++)
    for (int j = 1; j <= m; j++)
        dp[i][j] = (a[i-1]==b[j-1]) ? dp[i-1][j-1]+1
                                    : max(dp[i-1][j], dp[i][j-1]);`,
    probs: [[11456, "d052"], [10405, "c001"], [231, ""]]
  },
  {
    id: "inv", name: "逆序數", lv: 2, when: "「只能交換相鄰兩個，最少要幾次才排好」。",
    idea: "相鄰交換一次，逆序對恰好減少一，所以答案就是逆序對數。n 小直接雙層迴圈數；n 大用合併排序，在 merge 的時候右邊元素先被取走，代表左邊剩下的都比它大，一次加上 mid - i。",
    code: `// n 小：O(n²)
ll inv = 0;
for (int i = 0; i < n; i++)
    for (int j = i+1; j < n; j++) if (a[i] > a[j]) inv++;

// n 大：merge sort 計數的關鍵一行
else { cnt += mid - i; tmp[k++] = a[j++]; }`,
    probs: [[10327, "a539"], [10810, "d542"], [299, "e561"]]
  },
  {
    id: "dsu", name: "並查集 DSU", lv: 2, when: "只需要「合併」與「查是否同組」，不需要拆分。",
    idea: "路徑壓縮那一行 <code>p[x] = find(p[x])</code> 讓每次查詢順手把整條路上的節點都直接指向根，之後就是近乎 O(1)。unite 回傳 false 代表本來就同一組——拿來數連通塊或判環很好用。",
    code: `int p[100005];
void init(int n) { for (int i = 0; i <= n; i++) p[i] = i; }
int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }
bool unite(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return false;      // 本來就同組
    p[a] = b; return true;
}`,
    probs: [[10583, "d813"], [10608, ""], [793, ""]]
  },
  {
    id: "pq", name: "priority_queue", lv: 2, when: "每次都要取出當前最小／最大。",
    idea: "預設是大根堆，要小根堆必須自己寫 greater。它不能修改或刪除中間元素，所以需要更新時的通用手法是「懶惰刪除」——新值直接 push，取出時判斷是不是過期的，是就跳過。",
    code: `priority_queue<int> pq;                                // 大根堆
priority_queue<int, vector<int>, greater<int>> minpq;  // 小根堆

// 懶惰刪除
while (!pq.empty()) {
    auto [du, u] = pq.top(); pq.pop();
    if (du > d[u]) continue;      // 過期，跳過
    ...
}`,
    probs: [[10954, "d221"], [908, ""], [11491, ""]]
  },
  {
    id: "bs", name: "二分答案", lv: 2, when: "問「最大的最小值」「最小的最大值」「至少要多少才夠」。",
    idea: "關鍵是判斷答案有沒有單調性：如果 x 可行就保證 x+1 也可行，那就能二分。把難題轉成一個好寫的 check(x) 判定問題，這是二分答案真正的價值——原問題可能很難直接求，但「給定 x 判斷可不可行」通常只要掃一遍。",
    code: `bool check(ll x) { /* x 可行嗎 */ }

ll lo = 下界, hi = 上界, ans = -1;
while (lo <= hi) {
    ll mid = lo + (hi - lo) / 2;      // 避免溢位
    if (check(mid)) { ans = mid; hi = mid - 1; }   // 找最小可行
    else lo = mid + 1;
}`,
    probs: [[714, ""], [11413, ""], [12190, ""]]
  },
  {
    id: "pre", name: "前綴和 / 差分", lv: 2, when: "反覆查詢區間和，或反覆對區間整段加值。",
    idea: "這兩個互為反操作。前綴和讓「查區間和」變 O(1)，但不能改；差分讓「區間加值」變 O(1)，但要最後一次還原。看到「n 個區間覆蓋、問最大重疊數」就是差分的招牌題型。",
    code: `// 前綴和
vector<ll> pre(n + 1, 0);
for (int i = 0; i < n; i++) pre[i+1] = pre[i] + a[i];
ll sum = pre[r+1] - pre[l];        // a[l..r]

// 差分：對 a[l..r] 全部加 v
d[l] += v; d[r+1] -= v;
// 還原
ll cur = 0;
for (int i = 0; i < n; i++) { cur += d[i]; a[i] = cur; }`,
    probs: [[10684, "a540"], [108, ""], [10360, ""]]
  }
];

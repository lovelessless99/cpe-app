/* STL Cheatsheet — 表格（操作 / 複雜度 / 說明）+ 可複製的程式碼範例
   cx 標紅的是「有代價或有陷阱」的操作 */
const STL = [
  {
    name: "vector", tag: "動態陣列 · 預設選擇",
    note: "沒有特殊需求時一律先用它。多測資之間用 assign 重置，不要只 clear。",
    g: [
      ["建立", [
        ["vector&lt;int&gt; v;", "—", "空的"],
        ["vector&lt;int&gt; v(n);", "O(n)", "n 個 0"],
        ["vector&lt;int&gt; v(n, -1);", "O(n)", "n 個 -1"],
        ["vector&lt;vector&lt;int&gt;&gt; g(n, vector&lt;int&gt;(m, 0));", "O(nm)", "二維"]
      ]],
      ["插入", [
        ["v.push_back(x)", "O(1)*", "均攤 O(1)"],
        ["v.emplace_back(a, b)", "O(1)*", "就地建構，pair/struct 少一次複製"],
        ["v.insert(v.begin()+i, x)", "O(n)", "能避免就避免"]
      ]],
      ["查詢", [
        ["v[i]", "O(1)", "不檢查邊界"],
        ["v.front() / v.back()", "O(1)", "空的時候是未定義行為"],
        ["find(v.begin(), v.end(), x)", "O(n)", "未排序的線性搜尋"],
        ["binary_search(...)", "O(log n)", "要先 sort"],
        ["lower_bound(...) - v.begin()", "O(log n)", "第一個 ≥ x 的<b>位置</b>"]
      ]],
      ["刪除", [
        ["v.pop_back()", "O(1)", ""],
        ["v.erase(v.begin()+i)", "O(n)", ""],
        ["v.erase(remove(b,e,x), v.end())", "O(n)", "刪掉所有等於 x 的"],
        ["v.erase(unique(b,e), v.end())", "O(n)", "要先 sort · 去重／離散化"],
        ["v.assign(n, 0)", "O(n)", "多測資之間用這個重置"]
      ]]
    ],
    code: `vector<int> v(n, 0);                    // n 個 0
vector<vector<int>> g(n, vector<int>(m));   // 二維

v.push_back(x);
sort(v.begin(), v.end());

// 排序去重（離散化就是這兩行）
sort(v.begin(), v.end());
v.erase(unique(v.begin(), v.end()), v.end());

// x 在已排序 v 中出現幾次
int cnt = upper_bound(v.begin(), v.end(), x)
        - lower_bound(v.begin(), v.end(), x);

// 刪掉所有偶數
v.erase(remove_if(v.begin(), v.end(),
        [](int a){ return a % 2 == 0; }), v.end());

// 最大值的「位置」而不是值
int idx = max_element(v.begin(), v.end()) - v.begin();

v.assign(n, 0);                         // 多測資之間重置`,
    trap: "<code>v.size()</code> 回傳<b>無號數</b>。<code>i < v.size() - 1</code> 在 v 為空時，<code>0 - 1</code> 變成極大值 → 無限迴圈或越界。要嘛先判 <code>!v.empty()</code>，要嘛寫成 <code>i + 1 < v.size()</code>。",
    mine: "考場上二維陣列我一律開全域固定大小（<code>int g[1005][1005];</code>），不用 vector。原因是全域陣列自動歸零、不用管建構成本，而且多測資時 <code>memset</code> 一行就清乾淨。vector 的彈性在 CPE 用不到，反而多打字。"
  },
  {
    name: "string", tag: "字串",
    note: "不要自己刻字元陣列。substr 的第二個參數是「長度」不是結束位置。",
    g: [
      ["查詢", [
        ["s[i] / s.size()", "O(1)", ""],
        ["s.find(\"abc\")", "O(nm)", "找不到回 string::npos"],
        ["s.substr(pos, len)", "O(len)", "第二參數是<b>長度</b>"],
        ["s1 &lt; s2", "O(n)", "字典序，直接用運算子"]
      ]],
      ["修改", [
        ["s += \"def\";", "O(m)", "最常用"],
        ["s.insert(pos, \"xy\")", "O(n)", ""],
        ["s.erase(pos, len)", "O(n)", ""],
        ["reverse(s.begin(), s.end())", "O(n)", ""]
      ]],
      ["轉換", [
        ["stoi(s) / stoll(s)", "O(n)", "字串轉數字"],
        ["to_string(x)", "O(n)", "數字轉字串"],
        ["s[i] - '0'", "O(1)", "單一 char 轉數字"],
        ["stoll(s, nullptr, 16)", "O(n)", "指定進位讀"]
      ]]
    ],
    code: `string s = "hello";
s.substr(1, 3);                 // "ell" — 第二個是長度
if (s.find("ll") != string::npos) { /* 找到了 */ }

reverse(s.begin(), s.end());
transform(s.begin(), s.end(), s.begin(), ::tolower);

int x = stoi(s);
string t = to_string(123);
int d = s[i] - '0';             // char 轉數字

// 依空白切成 token
stringstream ss(line);
string tok;
while (ss >> tok) { /* 處理 tok */ }

// 依逗號切
stringstream ss2(line);
while (getline(ss2, tok, ',')) { /* 處理 tok */ }

// 整行讀（含空白）；混用 >> 之後要先 ignore
int n; cin >> n;
cin.ignore();
string line;
getline(cin, line);`,
    trap: "<code>string::npos</code> 是很大的<b>無號數</b>。判斷找到與否一定要寫 <code>!= string::npos</code>，不要寫 <code>>= 0</code>（恆為真）也不要直接拿去做算術。",
    mine: "只要題目的一行裡含空白（人名、國名、句子），第一反應就該是 <code>getline</code> + <code>stringstream</code>。我看過最多人卡住的不是演算法，是用 <code>cin >></code> 把一行切碎之後怎麼補都不對。"
  },
  {
    name: "map / unordered_map", tag: "字典 · O(log n) / O(1)",
    note: "計數、字串當 key 的預設選擇。map 自動按 key 升冪排序。",
    g: [
      ["插入", [
        ["mp[key] = val;", "O(log n)", "key 不存在會先建立"],
        ["mp[key]++;", "O(log n)", "計數慣用法，不存在時初始為 0"],
        ["mp.insert({key, val})", "O(log n)", "key 已存在時<b>不會</b>覆蓋"]
      ]],
      ["查詢", [
        ["mp.count(key)", "O(log n)", "純查詢用這個"],
        ["mp.find(key) != mp.end()", "O(log n)", "同上，還能拿到值"],
        ["mp.at(key)", "O(log n)", "不存在時丟例外，不會偷插入"],
        ["mp[key]", "O(log n)", "<b>不存在時會插入新元素</b>"]
      ]],
      ["刪除", [
        ["mp.erase(key)", "O(log n)", ""],
        ["it = mp.erase(it)", "O(1)*", "邊遍歷邊刪要用回傳值"]
      ]]
    ],
    code: `map<string,int> cnt;
cnt["apple"]++;                          // 不存在時自動初始為 0

// 查詢：用 count 或 find，不要用 cnt[key]
if (cnt.count("apple")) { /* 有 */ }

auto it = cnt.find("apple");
if (it != cnt.end()) int v = it->second;

// 遍歷（按 key 升冪）
for (auto& [k, v] : cnt) cout << k << " " << v << "\\n";
for (auto& p : cnt) cout << p.first << " " << p.second;   // C++11

// 邊遍歷邊刪：erase 回傳下一個迭代器
for (auto it = cnt.begin(); it != cnt.end(); ) {
    if (it->second < 2) it = cnt.erase(it);   // 不可寫 ++it
    else ++it;
}

// 字頻統計後按「次數降冪、同次數字典序升冪」輸出
vector<pair<string,int>> vp(cnt.begin(), cnt.end());
sort(vp.begin(), vp.end(), [](const pair<string,int>& a,
                              const pair<string,int>& b) {
    if (a.second != b.second) return a.second > b.second;
    return a.first < b.first;
});

// 字串節點發號碼（建圖常用）
map<string,int> id;
int get_id(const string& s) {
    auto it = id.find(s);
    if (it != id.end()) return it->second;
    int k = id.size();          // 先取 size 存起來
    id[s] = k;                  // 再插入
    return k;
}`,
    trap: "<code>mp[key]</code> 在 key 不存在時會<b>插入新元素</b>。<code>if (mp[key] > 0)</code> 這種寫法會讓 map 愈查愈大、迴圈結果跟著錯。<br>另外 <code>id[s] = id.size();</code> 是未定義行為——等號兩邊求值順序沒保證，可能先插入才算 size，全部差 1。",
    mine: "考場上我幾乎不用 <code>unordered_map</code>。因為 CPE 的題目常常要求「按字典序輸出」，<code>map</code> 的排序是免費附送的；換成 unordered 反而要多寫一次排序。除非真的 TLE 了才換——而多數情況下正確的做法是「key 是小整數就直接開陣列」。"
  },
  {
    name: "set / multiset", tag: "有序集合 · O(log n)",
    note: "需要有序遍歷、找前驅後繼、或邊插入邊查最值時用。",
    g: [
      ["建立", [
        ["set&lt;int&gt; s;", "—", "自動去重、自動排序"],
        ["multiset&lt;int&gt; ms;", "—", "允許重複"],
        ["set&lt;int, greater&lt;int&gt;&gt; ds;", "—", "降冪"],
        ["set&lt;pair&lt;int,int&gt;&gt; ps;", "—", "pair 可直接當 key"]
      ]],
      ["查詢", [
        ["s.count(x) / s.find(x)", "O(log n)", ""],
        ["s.lower_bound(x)", "O(log n)", "成員函式版 · 第一個 ≥ x"],
        ["std::lower_bound(s.begin(), …)", "O(n)", "<b>退化！</b>絕不要對 set 用"],
        ["*s.begin() / *s.rbegin()", "O(1)", "最小 / 最大"]
      ]],
      ["刪除", [
        ["s.erase(x)", "O(log n)", "依值"],
        ["ms.erase(ms.find(x))", "O(log n)", "multiset <b>只刪一個</b>"],
        ["ms.erase(x)", "O(log n + k)", "multiset <b>刪光全部</b>"]
      ]]
    ],
    code: `set<int> s;
s.insert(x);
if (s.count(x)) { /* 有 */ }

// 前驅後繼：一定要用「成員函式」版本
auto it = s.lower_bound(x);        // 第一個 >= x
auto it2 = s.upper_bound(x);       // 第一個 >  x
if (it != s.begin()) { --it; }     // 往前一格 = 前驅

int mn = *s.begin();               // 最小
int mx = *s.rbegin();              // 最大

// 想知道有沒有真的插入成功
auto [pos, ok] = s.insert(x);
if (ok) { /* 這是新元素 */ }

multiset<int> ms;
ms.erase(ms.find(x));              // 只刪一個 ← 幾乎都是要這個
ms.erase(x);                       // 刪光所有等於 x 的

// 取出並刪掉最大值
int top = *ms.rbegin();
ms.erase(prev(ms.end()));`,
    trap: "multiset 的 <code>erase(value)</code> 會把<b>所有</b>等於該值的元素一次刪光，要只刪一個必須 <code>erase(find(x))</code>。<br>另外 <code>std::lower_bound(s.begin(), s.end(), x)</code> 對 set 會退化成 <b>O(n)</b>——set 的迭代器不能隨機跳，二分退化成線性走訪。一律用 <code>s.lower_bound(x)</code>。",
    mine: "set 最被低估的用途是「邊掃邊維護一個有序集合」。像是「每天結束時取出當前最大與最小」這種題，用 multiset 幾行就完成，換成排序就得每次重排。看到「動態插入 + 隨時要最值/前驅」就該想到它。"
  },
  {
    name: "queue / stack / deque", tag: "O(1) 進出",
    note: "queue 幾乎專用於 BFS；deque 用於兩端進出與單調佇列。",
    g: [
      ["queue", [
        ["q.push(x) / q.front() / q.pop()", "O(1)", "pop <b>不回傳值</b>"],
        ["q = queue&lt;int&gt;();", "O(n)", "沒有 clear()，直接整個換掉"]
      ]],
      ["stack", [
        ["st.push(x) / st.top() / st.pop()", "O(1)", "top 和 pop 是兩個動作"],
        ["遍歷 / 隨機存取", "—", "不支援，改用 vector 當堆疊"]
      ]],
      ["deque", [
        ["dq.push_front / push_back", "O(1)", "兩端插入"],
        ["dq.pop_front / pop_back", "O(1)", ""],
        ["dq[i]", "O(1)", "stack/queue 沒有這個"]
      ]]
    ],
    code: `// BFS 骨架
queue<pair<int,int>> q;
q.push({sx, sy}); dist[sx][sy] = 0;
while (!q.empty()) {
    auto [x, y] = q.front(); q.pop();   // 先 front 再 pop
    for (int d = 0; d < 4; d++) { /* 擴展 */ }
}

q = queue<pair<int,int>>();       // 沒有 clear()，整個換掉

// stack：取出並使用
stack<int> st;
while (!st.empty()) {
    int u = st.top(); st.pop();   // 兩個分開的動作
}

// 需要看堆疊內部就用 vector 代替
vector<int> st2;
st2.push_back(x);
int top = st2.back();
st2.pop_back();

// 單調佇列：滑動窗口最大值 O(n)
deque<int> dq;                     // 存索引，對應值遞減
for (int i = 0; i < n; i++) {
    while (!dq.empty() && dq.front() <= i - k) dq.pop_front();
    while (!dq.empty() && a[dq.back()] <= a[i]) dq.pop_back();
    dq.push_back(i);
    if (i >= k - 1) res.push_back(a[dq.front()]);
}`,
    trap: "<code>pop()</code> 一律<b>不回傳值</b>，要先 <code>top()</code>/<code>front()</code> 取出來。對空容器呼叫 <code>top()</code> 是未定義行為，每次都要先 <code>empty()</code> 檢查。",
    mine: "網格 BFS 我固定用 <code>queue&lt;pair&lt;int,int&gt;&gt;</code> 而不是自訂 struct——少寫十行，而且 <code>auto [x, y] = q.front();</code> 解包很直覺。要存第三個值（步數）時我也不加進 queue，改用獨立的 <code>dist</code> 陣列，因為 dist 同時兼任 visited，少一個陣列就少一個忘記重置的機會。"
  },
  {
    name: "priority_queue", tag: "堆 · 每次取最值",
    note: "Dijkstra、Prim、「每次取當前最小」的貪心、合併 k 個有序序列。",
    g: [
      ["建立", [
        ["priority_queue&lt;int&gt; pq;", "—", "<b>大根堆</b>（預設）"],
        ["priority_queue&lt;int, vector&lt;int&gt;, greater&lt;int&gt;&gt;", "—", "小根堆"]
      ]],
      ["操作", [
        ["pq.push(x) / pq.pop()", "O(log n)", ""],
        ["pq.top()", "O(1)", ""],
        ["修改 / 刪除中間元素", "—", "不支援 → 用懶惰刪除"]
      ]]
    ],
    code: `priority_queue<int> pq;                                 // 大根堆
priority_queue<int, vector<int>, greater<int>> minpq;   // 小根堆

// Dijkstra 常用：{距離, 節點}，距離小的優先
priority_queue<pair<long long,int>,
               vector<pair<long long,int>>,
               greater<pair<long long,int>>> pq2;

// 自訂比較：注意語意跟 sort 相反
// 回傳 true 代表 a 的優先度「較低」（比較晚出來）
struct Node { int cost, id; };
auto cmp = [](const Node& a, const Node& b) { return a.cost > b.cost; };
priority_queue<Node, vector<Node>, decltype(cmp)> pq3(cmp);

// 懶惰刪除：因為不能修改既有元素
while (!pq2.empty()) {
    auto [du, u] = pq2.top(); pq2.pop();
    if (du > d[u]) continue;         // 這筆是過期的舊紀錄
    // 處理 u
}

// Huffman 式貪心：每次取最小的兩個
while (minpq.size() > 1) {
    int a = minpq.top(); minpq.pop();
    int b = minpq.top(); minpq.pop();
    total += a + b;
    minpq.push(a + b);
}`,
    trap: "預設是<b>大根堆</b>，寫最短路忘了改 <code>greater</code> 是最常見的錯。<br>自訂 comparator 的語意跟 <code>sort</code> <b>相反</b>：sort 的 <code>a &lt; b</code> 是「a 排前面」，priority_queue 的 <code>a &lt; b</code> 是「a 優先度較低、比較晚出來」。",
    mine: "記憶方法：priority_queue 的 comparator 想成「排序後從<b>尾巴</b>取」。<code>less</code>（預設）排完升冪、從尾巴取 → 拿到最大 → 大根堆。這樣就不用死背了。"
  },
  {
    name: "pair / tuple", tag: "把多個值綁在一起",
    note: "多關鍵字排序時最省事的工具——比較運算子已經定義好，連 comparator 都不用寫。",
    g: [
      ["pair", [
        ["pair&lt;int,int&gt; p = {1, 2};", "—", "不必寫 make_pair"],
        ["p.first / p.second", "O(1)", ""],
        ["a &lt; b", "O(1)", "<b>先比 first，再比 second</b>"],
        ["v.emplace_back(a, b)", "O(1)*", "比 push_back({a,b}) 少一次建構"]
      ]],
      ["tuple", [
        ["tuple&lt;int,int,string&gt; t = {1, 2, \"x\"};", "—", "三個以上的值"],
        ["get&lt;0&gt;(t)", "O(1)", "取第 0 個"],
        ["tie(a, b, c) = t;", "O(1)", "解包 · C++11"],
        ["auto [a, b, c] = t;", "O(1)", "解包 · C++17"]
      ]]
    ],
    code: `// 排序：先比 first、再比 second，完全免費
vector<pair<int,string>> v;
v.emplace_back(90, "bob");
v.emplace_back(90, "amy");
sort(v.begin(), v.end());        // → (90,"amy"), (90,"bob")

// 想要「分數降冪、同分名字升冪」：把分數存負的
v.emplace_back(-score, name);
sort(v.begin(), v.end());        // 免寫 comparator

// 三個鍵也一樣
vector<tuple<int,int,string>> w;
w.emplace_back(a, b, name);
sort(w.begin(), w.end());        // 依 a → b → name

// 解包
auto [x, y] = v[0];              // C++17
int p, q; string s;
tie(p, q, s) = w[0];             // C++11

// pair 可以直接當 map / set 的 key
set<pair<int,int>> visited;
visited.insert({r, c});
if (visited.count({r, c})) { /* 走過了 */ }

// 函式回傳兩個值
pair<int,int> solve() { return {ans, cnt}; }
auto [ans, cnt] = solve();

// 網格座標壓成一個整數（要當 int key 時）
auto idx = [C](int r, int c) { return r * C + c; };
// 反解：r = k / C, c = k % C`,
    trap: "<code>tie</code> 需要變數<b>先宣告</b>，<code>auto [a,b]</code> 則是就地宣告新變數——兩者不能混用。<br>另外 <code>auto [x, y] = p;</code> 是<b>複製</b>，要改原值必須寫 <code>auto& [x, y] = p;</code>。",
    mine: "「把分數存負的來反轉排序方向」這招我很常用——比寫 lambda 快，也不會把方向搞錯。但只適用整數，浮點與字串不行。字串要降冪就老實寫 comparator。"
  },
  {
    name: "iterator", tag: "所有容器的共同介面",
    note: "迭代器就是「指向容器某個位置的東西」。理解它，STL 的函式簽名就都通了。",
    g: [
      ["取得", [
        ["v.begin() / v.end()", "O(1)", "end 指向<b>最後一個的下一格</b>"],
        ["v.rbegin() / v.rend()", "O(1)", "反向"],
        ["s.find(x)", "O(log n)", "找不到回 end()"]
      ]],
      ["使用", [
        ["*it", "O(1)", "取值"],
        ["it->first / it->second", "O(1)", "map 的 key / value"],
        ["++it / --it", "O(1)", "前後移動"],
        ["it - v.begin()", "O(1)", "轉成索引（<b>僅限 vector</b>）"],
        ["next(it) / prev(it)", "O(1)", "不改變 it 本身"]
      ]],
      ["失效", [
        ["vector push_back 後", "—", "<b>所有迭代器可能失效</b>"],
        ["map/set erase 後", "—", "只有被刪的那個失效"]
      ]]
    ],
    code: `// end() 指向「最後一個的下一格」，不是最後一個
vector<int> v{1, 2, 3};
int last = *prev(v.end());          // 3
int last2 = v.back();               // 3，比較好讀

// 迭代器轉索引：只有 vector/array 這種連續容器能做
auto it = lower_bound(v.begin(), v.end(), x);
int idx = it - v.begin();

// map 的迭代器指向 pair
map<string,int> mp;
auto mit = mp.find("key");
if (mit != mp.end()) {
    cout << mit->first << " " << mit->second;
}

// set 找前驅：先 lower_bound 再往前一格
auto sit = s.lower_bound(x);
if (sit != s.begin()) {
    --sit;                          // 現在指向 < x 的最大元素
}

// 邊遍歷邊刪除的正確寫法
for (auto it = mp.begin(); it != mp.end(); ) {
    if (bad(it->second)) it = mp.erase(it);   // erase 回傳下一個
    else ++it;                                 // 只有沒刪才 ++
}

// 錯誤示範：刪掉之後 it 已失效，++it 是未定義行為
// for (auto it = mp.begin(); it != mp.end(); ++it)
//     if (bad(it->second)) mp.erase(it);`,
    trap: "<code>end()</code> 指向<b>最後一個元素的下一格</b>，不能對它取值。<br>邊遍歷邊刪除時，<code>erase(it)</code> 後 <code>it</code> 已經失效，必須用它的<b>回傳值</b>接續，且該圈不能再 <code>++it</code>。<br><code>it - v.begin()</code> 只有 vector/array 能用，set/map 的迭代器不能相減。",
    mine: "初學時把迭代器想成「指標」就夠用了：<code>*it</code> 取值、<code>++it</code> 走下一個、<code>end()</code> 是結束哨兵。真正要小心的只有兩件事——<b>不要對 end() 取值</b>、<b>刪除後不要繼續用舊的迭代器</b>。這兩條記住，九成的迭代器 bug 就避開了。"
  },
  {
    name: "遍歷寫法", tag: "四種 for loop，各有適用時機",
    note: "選錯寫法不會編譯錯，但會讓你改不到值、或拿不到索引。",
    g: [
      ["四種寫法", [
        ["for (int x : v)", "O(n)", "唯讀，最簡潔"],
        ["for (int&amp; x : v)", "O(n)", "<b>要改值必須加 &amp;</b>"],
        ["for (int i = 0; i &lt; (int)v.size(); i++)", "O(n)", "需要索引時"],
        ["for (auto it = v.begin(); it != v.end(); ++it)", "O(n)", "需要刪除或跳步時"]
      ]],
      ["結構化綁定", [
        ["for (auto&amp; [k, v] : mp)", "O(n)", "C++17 · 要改值加 &amp;"],
        ["for (auto& p : mp) p.first", "O(n)", "C++11 保險寫法"]
      ]]
    ],
    code: `vector<int> v{1, 2, 3};

// 1. 唯讀：最常用
for (int x : v) sum += x;

// 2. 要修改：一定要加 &
for (int& x : v) x *= 2;         // 有 & → v 真的變了
for (int x : v) x *= 2;          // 沒 & → 改的是複本，v 沒變

// 3. 需要索引
for (int i = 0; i < (int)v.size(); i++)
    cout << i << ": " << v[i] << "\\n";
// 轉 (int) 是為了避免無號數比較警告，也避免 size()-1 的陷阱

// 4. 需要刪除 / 跳步 → 用迭代器
for (auto it = v.begin(); it != v.end(); ) {
    if (*it < 0) it = v.erase(it);
    else ++it;
}

// map 遍歷（按 key 升冪）
for (auto& [k, val] : mp) cout << k << " " << val;
for (const auto& [k, val] : mp) { /* 唯讀，避免複製字串 */ }

// 反向遍歷
for (auto it = v.rbegin(); it != v.rend(); ++it) cout << *it;
for (int i = (int)v.size() - 1; i >= 0; i--) cout << v[i];

// 二維
for (int i = 0; i < n; i++)
    for (int j = 0; j < m; j++)
        cout << g[i][j];

// 四方向鄰居
int dx[4] = {0, 0, 1, -1}, dy[4] = {1, -1, 0, 0};
for (int d = 0; d < 4; d++) {
    int nx = x + dx[d], ny = y + dy[d];
    if (nx < 0 || nx >= n || ny < 0 || ny >= m) continue;
    // 處理 (nx, ny)
}`,
    trap: "<code>for (int x : v) x *= 2;</code> 改的是<b>複本</b>，v 完全沒變——而且不會有任何警告。要改值一定要 <code>int&amp; x</code>。<br>map 的結構化綁定同理：<code>auto [k, v]</code> 是複製，<code>auto&amp; [k, v]</code> 才能改。",
    mine: "我的預設順序是：能用 range-for 就用（<code>for (int x : v)</code>），需要索引才退回傳統 for，需要刪除才用迭代器。另外 <code>const auto&</code> 對 <code>map&lt;string,...&gt;</code> 特別有意義——不加的話每圈都會複製一次字串，資料量大時是實打實的開銷。"
  },
  {
    name: "跨容器演算法", tag: "&lt;algorithm&gt; / &lt;numeric&gt;",
    note: "這些函式用熟，能省掉大量手寫迴圈。",
    g: [
      ["排序", [
        ["sort(v.begin(), v.end())", "O(n log n)", ""],
        ["sort(b, e, greater&lt;int&gt;())", "O(n log n)", "降冪"],
        ["stable_sort(b, e, cmp)", "O(n log²n)", "保持相等元素原順序"],
        ["nth_element(b, b+k, e)", "O(n)", "只把第 k 小放到位"]
      ]],
      ["數值", [
        ["accumulate(b, e, 0LL)", "O(n)", "初值<b>一定寫 0LL</b>"],
        ["iota(b, e, 0)", "O(n)", "填 0,1,2… · DSU 初始化"],
        ["__gcd(a, b)", "O(log n)", "GCC 內建"]
      ]],
      ["排列", [
        ["next_permutation(b, e)", "O(n)", "<b>要先 sort</b> 才拿得到全部"]
      ]]
    ],
    code: `sort(v.begin(), v.end(), greater<int>());       // 降冪

// 多關鍵字：分數降冪、同分名字升冪
sort(v.begin(), v.end(), [](const P& a, const P& b) {
    if (a.score != b.score) return a.score > b.score;
    return a.name < b.name;
});

long long s = accumulate(v.begin(), v.end(), 0LL);   // 0LL 不是 0
int mx = *max_element(v.begin(), v.end());
int idx = max_element(v.begin(), v.end()) - v.begin();

iota(p.begin(), p.end(), 0);        // DSU 初始化：0,1,2,...

// 全排列（一定要先 sort）
sort(a.begin(), a.end());
do { /* 處理 a */ } while (next_permutation(a.begin(), a.end()));

// 只要第 k 小，不用整個排序 → O(n)
nth_element(v.begin(), v.begin() + k, v.end());
int kth = v[k];`,
    trap: "<code>accumulate</code> 的<b>初值型別決定累加型別</b>。寫 <code>0</code> 就是 int 累加，即使結果存進 long long 也<b>已經溢位了</b>——這是最隱蔽的溢位來源之一。",
    mine: "<code>nth_element</code> 很少人用但很好用：題目只要中位數或第 k 小時，它是 O(n) 而 sort 是 O(n log n)。CPE 的資料量通常兩者都能過，但知道它存在，遇到 10⁶ 筆求中位數時就不會慌。"
  }
];

/* STL 用法抽考題庫：給任務，選正確寫法
   干擾選項刻意用「真的有人會寫錯的版本」，答錯本身就是學習 */
const STLQ = [
  { task: "在 <code>set&lt;int&gt; s</code> 裡找第一個 ≥ x 的元素",
    ans: "s.lower_bound(x)",
    bad: ["std::lower_bound(s.begin(), s.end(), x)", "s.find(x)", "s.upper_bound(x)"],
    why: "要用<b>成員函式</b>版。<code>std::lower_bound</code> 對 set 會退化成 O(n)，因為 set 的迭代器不能隨機跳。<code>upper_bound</code> 找的是第一個 > x。" },
  { task: "從 <code>multiset&lt;int&gt; ms</code> 裡只刪掉<b>一個</b>值為 x 的元素",
    ans: "ms.erase(ms.find(x))",
    bad: ["ms.erase(x)", "ms.remove(x)", "ms.erase(ms.lower_bound(x), ms.end())"],
    why: "<code>ms.erase(x)</code> 會把<b>所有</b>等於 x 的一次刪光——multiset 最經典的 WA。multiset 沒有 remove()。" },
  { task: "遍歷 <code>map&lt;string,int&gt; mp</code> 並把每個值加 1",
    ans: "for (auto& [k, v] : mp) v++;",
    bad: ["for (auto [k, v] : mp) v++;", "for (auto& [k, v] : mp) mp[k]++;", "for (int v : mp) v++;"],
    why: "沒有 <code>&amp;</code> 就是<b>複製</b>，改的是複本，mp 完全沒變而且不會有警告。在迴圈裡對正在遍歷的 map 做 <code>mp[k]++</code> 也很危險。" },
  { task: "檢查 map 裡有沒有某個 key（<b>不要</b>插入新元素）",
    ans: "if (mp.count(key))",
    bad: ["if (mp[key])", "if (mp[key] != 0)", "if (mp.at(key))"],
    why: "<code>mp[key]</code> 在 key 不存在時會<b>插入一個新元素</b>，map 會愈查愈大。<code>at()</code> 不會插入但 key 不存在時會丟例外。" },
  { task: "把 vector 排序後去除重複元素",
    ans: "sort(b,e); v.erase(unique(b,e), v.end());",
    bad: ["v.erase(unique(b,e), v.end());", "sort(b,e); unique(b,e);", "v.erase(remove(b,e), v.end());"],
    why: "<code>unique</code> 只把重複的移到後面並回傳新的結尾，<b>不會真的刪</b>，必須配 erase。而且它只去除<b>相鄰</b>重複，所以要先 sort。" },
  { task: "求 vector 中最大值的<b>索引</b>",
    ans: "max_element(v.begin(), v.end()) - v.begin()",
    bad: ["max_element(v.begin(), v.end())", "*max_element(v.begin(), v.end())", "v.find(max(v))"],
    why: "<code>max_element</code> 回傳的是<b>迭代器</b>。加 <code>*</code> 得到值，減 <code>v.begin()</code> 才得到索引。" },
  { task: "把 n 個元素的 vector 累加成 long long（避免溢位）",
    ans: "accumulate(v.begin(), v.end(), 0LL)",
    bad: ["accumulate(v.begin(), v.end(), 0)", "(long long)accumulate(v.begin(), v.end(), 0)", "accumulate(v.begin(), v.end(), (int)0)"],
    why: "初值的<b>型別決定累加型別</b>。寫 <code>0</code> 就是用 int 累加，事後轉 long long 已經來不及——溢位發生在累加過程中。" },
  { task: "建立一個小根堆（每次取最小值）",
    ans: "priority_queue<int, vector<int>, greater<int>> pq;",
    bad: ["priority_queue<int> pq;", "priority_queue<int, vector<int>, less<int>> pq;", "priority_queue<int, greater<int>> pq;"],
    why: "預設（以及 <code>less</code>）是<b>大根堆</b>。而且第二個模板參數必須是底層容器 <code>vector&lt;int&gt;</code>，不能直接放比較器。" },
  { task: "清空一個 <code>queue&lt;int&gt; q</code>",
    ans: "q = queue<int>();",
    bad: ["q.clear();", "q.erase(q.begin(), q.end());", "while (!q.empty()) q.front();"],
    why: "<code>queue</code> <b>沒有 clear()</b>，也沒有迭代器。最短的寫法就是指派一個新的空 queue 進去。" },
  { task: "從 stack 取出頂端的值並移除",
    ans: "int u = st.top(); st.pop();",
    bad: ["int u = st.pop();", "int u = st.back(); st.pop();", "int u = *st.top(); st.pop();"],
    why: "<code>pop()</code> <b>不回傳值</b>，是 void。必須先 <code>top()</code> 取值再 <code>pop()</code>，兩個分開的動作。" },
  { task: "把一行字串依<b>空白</b>切成多個 token",
    ans: "stringstream ss(line); while (ss >> tok)",
    bad: ["while (getline(ss, tok, ' '))", "line.split(' ')", "strtok(line, \" \")"],
    why: "<code>ss &gt;&gt; tok</code> 會自動跳過連續空白；用 <code>getline(ss, tok, ' ')</code> 遇到連續空白會產生空字串。C++ 的 string 沒有 split()。" },
  { task: "<code>cin >> n</code> 之後要 <code>getline</code> 讀整行",
    ans: "cin >> n; cin.ignore(); getline(cin, line);",
    bad: ["cin >> n; getline(cin, line);", "cin >> n; getline(cin, line); getline(cin, line);", "cin >> n >> line;"],
    why: "<code>&gt;&gt;</code> 不會吃掉行尾的換行，直接 getline 會讀到<b>空字串</b>。必須先 <code>cin.ignore()</code> 把換行吃掉。" },
  { task: "產生一個序列的<b>所有</b>排列",
    ans: "sort(b,e); do {...} while (next_permutation(b,e));",
    bad: ["do {...} while (next_permutation(b,e));", "while (next_permutation(b,e)) {...}", "for (auto p : permutations(v))"],
    why: "<code>next_permutation</code> 只產生字典序在當前之後的排列，<b>不先 sort 就拿不到全部</b>。用 while 開頭會漏掉初始那一個排列。" },
  { task: "邊遍歷 map 邊刪除符合條件的元素",
    ans: "for (auto it=mp.begin(); it!=mp.end(); ) { if (bad) it=mp.erase(it); else ++it; }",
    bad: ["for (auto it=mp.begin(); it!=mp.end(); ++it) if (bad) mp.erase(it);", "for (auto& [k,v] : mp) if (bad) mp.erase(k);", "for (auto it=mp.begin(); it!=mp.end(); ++it) if (bad) it=mp.erase(it);"],
    why: "<code>erase(it)</code> 之後 <code>it</code> 已<b>失效</b>，再 <code>++it</code> 是未定義行為。要用 erase 的<b>回傳值</b>接續，而且該圈不能再 ++。" },
  { task: "宣告一個 n×m、初值全為 0 的二維陣列",
    ans: "vector<vector<int>> g(n, vector<int>(m, 0));",
    bad: ["vector<vector<int>> g(n, m);", "vector<vector<int>> g[n][m];", "vector<int> g(n, m);"],
    why: "外層 n 個元素，每個元素是一個「長度 m、初值 0」的 vector。第二個參數是<b>每個元素的值</b>，不是第二維長度。" },
  { task: "取得 set 中的<b>最大</b>元素",
    ans: "*s.rbegin()",
    bad: ["*s.end()", "s.back()", "*max_element(s.begin(), s.end())"],
    why: "<code>end()</code> 指向最後一個的<b>下一格</b>，取值是未定義行為。set 沒有 back()。<code>max_element</code> 雖然正確但是 O(n)，而 <code>*s.rbegin()</code> 是 O(1)。" },
  { task: "求已排序 vector 中 x 出現的次數",
    ans: "upper_bound(b,e,x) - lower_bound(b,e,x)",
    bad: ["count(b, e, x)", "binary_search(b, e, x)", "lower_bound(b,e,x) - upper_bound(b,e,x)"],
    why: "<code>count</code> 雖然正確但是 O(n)；已排序就該用兩次二分達到 O(log n)。<code>binary_search</code> 只回傳有沒有。相減順序寫反會得到負數。" },
  { task: "把 <code>pair&lt;int,int&gt;</code> 的 vector 依「first 升冪、first 相同時 second 升冪」排序",
    ans: "sort(v.begin(), v.end());",
    bad: ["sort(v.begin(), v.end(), cmpFirstThenSecond);", "sort(v.begin(), v.end(), less<int>());", "sort(v.begin(), v.end(), greater<pair<int,int>>());"],
    why: "<code>pair</code> 的比較運算子<b>已經定義好</b>就是先比 first 再比 second——完全不用寫 comparator。這是 pair 最有價值的地方。" },
  { task: "DSU 的父節點陣列初始化成 p[i] = i",
    ans: "iota(p.begin(), p.end(), 0);",
    bad: ["fill(p.begin(), p.end(), 0);", "memset(p, 0, sizeof(p));", "p.assign(n, 0);"],
    why: "<code>iota</code> 填入遞增序列 0,1,2,…；其他三個都是<b>全部填 0</b>，那會讓所有節點的父親都是 0。" },
  { task: "反向遍歷 vector",
    ans: "for (auto it = v.rbegin(); it != v.rend(); ++it)",
    bad: ["for (auto it = v.end(); it != v.begin(); ++it)", "for (auto it = v.rbegin(); it != v.rend(); --it)", "for (int i = v.size(); i >= 0; i--)"],
    why: "反向迭代器用 <code>rbegin/rend</code>，而且是 <code>++it</code>（它自己會往回走）。最後一個選項還多了個越界：索引該從 <code>size()-1</code> 開始。" },
  { task: "解包一個 <code>pair</code> 並且能<b>修改</b>原本的值",
    ans: "auto& [x, y] = p;",
    bad: ["auto [x, y] = p;", "tie(x, y) = p;", "auto [&x, &y] = p;"],
    why: "<code>auto [x,y]</code> 是<b>複製</b>。要改到原值必須寫 <code>auto&amp; [x,y]</code>——<code>&amp;</code> 放在 auto 後面，不是放在變數前面。" },
  { task: "只想知道第 k 小的元素，不需要整個排序",
    ans: "nth_element(v.begin(), v.begin()+k, v.end());",
    bad: ["sort(v.begin(), v.end());", "partial_sort(v.begin(), v.begin()+k, v.end());", "v[k] 直接取"],
    why: "<code>nth_element</code> 是 <b>O(n)</b>，只保證第 k 個到位。sort 是 O(n log n)、partial_sort 是 O(n log k)，都比它慢。" },
  { task: "在 vector 中刪除所有等於 x 的元素",
    ans: "v.erase(remove(v.begin(), v.end(), x), v.end());",
    bad: ["remove(v.begin(), v.end(), x);", "v.remove(x);", "for (auto it : v) if (*it == x) v.erase(it);"],
    why: "<code>remove</code> 只把要保留的往前搬並回傳新結尾，<b>不會改變 size</b>，必須配 <code>erase</code>。vector 沒有 remove() 成員函式。" },
  { task: "把 <code>vector&lt;int&gt;</code> 用於多測資，每筆之間重置為 n 個 0",
    ans: "v.assign(n, 0);",
    bad: ["v.clear();", "memset(&v, 0, sizeof(v));", "v.resize(n);"],
    why: "<code>clear()</code> 只是清空（size 變 0），不會給你 n 個 0。<code>resize(n)</code> 在原本更大時不會把既有元素歸零。對 vector 用 memset 是嚴重錯誤。" }
];

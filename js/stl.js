/* STL Cheatsheet — 每個容器按「建立 / 插入 / 查詢 / 刪除 / 遍歷」整理
   cx 標 'slow' 的會顯示紅色，代表這個操作有陷阱或代價高 */
const STL = [
  {
    name: "vector", tag: "動態陣列 · 預設選擇",
    note: "沒有特殊需求時一律先用它。多測資之間用 assign 重置，不要只 clear。",
    g: [
      ["建立", [
        ["vector<int> v;", "—", "空的"],
        ["vector<int> v(n);", "O(n)", "n 個 0"],
        ["vector<int> v(n, -1);", "O(n)", "n 個 -1"],
        ["vector<vector<int>> g(n, vector<int>(m, 0));", "O(nm)", "二維"]
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
        ["lower_bound(...) - v.begin()", "O(log n)", "第一個 ≥ x 的位置"],
        ["upper_bound(..) - lower_bound(..)", "O(log n)", "x 出現幾次"]
      ]],
      ["刪除", [
        ["v.pop_back()", "O(1)", ""],
        ["v.erase(v.begin()+i)", "O(n)", ""],
        ["v.erase(remove(v.begin(),v.end(),x), v.end())", "O(n)", "刪掉所有等於 x 的"],
        ["v.erase(unique(v.begin(),v.end()), v.end())", "O(n)", "要先 sort · 去重／離散化"],
        ["v.assign(n, 0)", "O(n)", "多測資之間用這個重置"]
      ]],
      ["遍歷", [
        ["for (int x : v)", "O(n)", "唯讀"],
        ["for (int& x : v) x *= 2;", "O(n)", "要改值就用 reference"]
      ]]
    ],
    trap: "<code>v.size()</code> 回傳無號數。<code>i < v.size() - 1</code> 在 v 為空時變成極大值 → 無限迴圈。"
  },
  {
    name: "string", tag: "字串",
    note: "不要自己刻字元陣列。substr 的第二個參數是「長度」不是結束位置。",
    g: [
      ["建立", [
        ["string s = \"abc\";", "—", ""],
        ["string s(n, 'x');", "O(n)", "n 個 'x'"]
      ]],
      ["插入", [
        ["s += \"def\";", "O(m)", "最常用"],
        ["s.insert(pos, \"xy\")", "O(n)", ""],
        ["s.replace(pos, len, \"new\")", "O(n)", ""]
      ]],
      ["查詢", [
        ["s[i] / s.size()", "O(1)", ""],
        ["s.find(\"abc\")", "O(nm)", "找不到回 string::npos"],
        ["s.substr(pos, len)", "O(len)", "第二參數是長度"],
        ["s1 < s2", "O(n)", "字典序，直接用運算子"]
      ]],
      ["刪除", [
        ["s.erase(pos, len)", "O(n)", ""],
        ["s.pop_back()", "O(1)", ""]
      ]],
      ["轉換", [
        ["stoi(s) / stoll(s) / stod(s)", "O(n)", ""],
        ["to_string(x)", "O(n)", ""],
        ["s[i] - '0'", "O(1)", "char 轉數字"],
        ["transform(s.begin(),s.end(),s.begin(),::tolower)", "O(n)", "轉小寫"],
        ["reverse(s.begin(), s.end())", "O(n)", ""]
      ]],
      ["切字", [
        ["stringstream ss(line); while (ss >> tok)", "O(n)", "依空白切"],
        ["while (getline(ss, tok, ','))", "O(n)", "依逗號切"]
      ]]
    ],
    trap: "<code>string::npos</code> 是很大的<b>無號數</b>，拿去做算術會出事。一定要先跟 npos 比較，不要判 >= 0（恆真）。"
  },
  {
    name: "map / multimap", tag: "有序字典 · O(log n)",
    note: "計數、字串當 key 時的預設選擇。自動按 key 升冪排序。",
    g: [
      ["插入", [
        ["mp[key] = val;", "O(log n)", "key 不存在會先建立"],
        ["mp[key]++;", "O(log n)", "計數慣用法，不存在時初始為 0"],
        ["mp.insert({key, val})", "O(log n)", "key 已存在時<b>不會</b>覆蓋"]
      ]],
      ["查詢", [
        ["mp.count(key)", "O(log n)", "純查詢用這個"],
        ["mp.find(key) != mp.end()", "O(log n)", "同上"],
        ["mp.at(key)", "O(log n)", "不存在時丟例外，不會偷插入"],
        ["mp.lower_bound(key)", "O(log n)", "第一個 key 不小於它的"]
      ]],
      ["刪除", [
        ["mp.erase(key) / mp.erase(it)", "O(log n)", ""],
        ["mp.clear()", "O(n)", ""]
      ]],
      ["遍歷", [
        ["for (auto& [k, v] : mp)", "O(n)", "按 key 升冪 · C++17"],
        ["for (auto& p : mp) p.first, p.second", "O(n)", "C++11 保險寫法"]
      ]]
    ],
    trap: "<code>mp[key]</code> 在 key 不存在時會<b>插入新元素</b>。<code>if (mp[key] > 0)</code> 這種寫法會讓 map 愈查愈大、迴圈結果跟著錯。純查詢一律用 count 或 find。"
  },
  {
    name: "set / multiset", tag: "有序集合 · O(log n)",
    note: "需要有序遍歷、找前驅後繼、或邊插入邊查最值時用。",
    g: [
      ["建立", [
        ["set<int> s;", "—", "自動去重、自動排序"],
        ["multiset<int> ms;", "—", "允許重複"],
        ["set<int, greater<int>> ds;", "—", "降冪"],
        ["set<pair<int,int>> ps;", "—", "pair 可直接當 key"]
      ]],
      ["插入", [
        ["s.insert(x)", "O(log n)", "已存在則無事發生"],
        ["auto [it, ok] = s.insert(x)", "O(log n)", "ok 表示是不是新元素"]
      ]],
      ["查詢", [
        ["s.count(x) / s.find(x)", "O(log n)", ""],
        ["s.lower_bound(x)", "O(log n)", "成員函式版 · 第一個 ≥ x"],
        ["std::lower_bound(s.begin(), …)", "O(n)", "退化！絕不要對 set 用"],
        ["*s.begin() / *s.rbegin()", "O(1)", "最小 / 最大"],
        ["--it 取前驅", "O(1)", "先確認 it != s.begin()"]
      ]],
      ["刪除", [
        ["s.erase(x)", "O(log n)", "依值"],
        ["s.erase(it)", "O(1)*", "依迭代器，均攤"],
        ["ms.erase(ms.find(x))", "O(log n)", "multiset <b>只刪一個</b>"],
        ["ms.erase(x)", "O(log n + k)", "multiset <b>刪光全部</b>"]
      ]],
      ["遍歷", [
        ["for (int x : s)", "O(n)", "升冪"],
        ["for (auto it = s.rbegin(); it != s.rend(); ++it)", "O(n)", "降冪"]
      ]]
    ],
    trap: "multiset 的 <code>erase(value)</code> 會把<b>所有</b>等於該值的元素一次刪光。要只刪一個必須寫 <code>erase(find(x))</code>——這是 multiset 最經典的 WA。"
  },
  {
    name: "queue / stack / deque", tag: "O(1) 進出",
    note: "queue 幾乎專用於 BFS；deque 用於兩端進出與單調佇列。",
    g: [
      ["queue", [
        ["q.push(x)", "O(1)", "尾端插入"],
        ["q.front() / q.back()", "O(1)", ""],
        ["q.pop()", "O(1)", "<b>不回傳值</b>"],
        ["q = queue<int>();", "O(n)", "沒有 clear()，直接整個換掉"]
      ]],
      ["stack", [
        ["st.push(x)", "O(1)", ""],
        ["st.top() 再 st.pop()", "O(1)", "兩個分開的動作"],
        ["遍歷 / 隨機存取", "—", "不支援，改用 vector 當堆疊"]
      ]],
      ["deque", [
        ["dq.push_front(x) / push_back(x)", "O(1)", "兩端插入"],
        ["dq.pop_front() / pop_back()", "O(1)", ""],
        ["dq[i]", "O(1)", "stack/queue 沒有這個"]
      ]]
    ],
    trap: "<code>pop()</code> 一律<b>不回傳值</b>。對空容器呼叫 <code>top()</code> / <code>front()</code> 是未定義行為，每次都要先 <code>empty()</code> 檢查。"
  },
  {
    name: "priority_queue", tag: "堆 · 每次取最值",
    note: "Dijkstra、Prim、「每次取當前最小」的貪心、合併 k 個有序序列。",
    g: [
      ["建立", [
        ["priority_queue<int> pq;", "—", "<b>大根堆</b>（預設）"],
        ["priority_queue<int, vector<int>, greater<int>> pq;", "—", "小根堆"],
        ["priority_queue<pair<ll,int>, vector<pair<ll,int>>, greater<pair<ll,int>>>", "—", "Dijkstra 常用"]
      ]],
      ["操作", [
        ["pq.push(x) / pq.emplace(a, b)", "O(log n)", ""],
        ["pq.top()", "O(1)", ""],
        ["pq.pop()", "O(log n)", ""],
        ["修改 / 刪除中間元素", "—", "不支援 → 用懶惰刪除"]
      ]]
    ],
    trap: "預設是<b>大根堆</b>，寫最短路忘了改 <code>greater</code> 是最常見的錯。因為不能修改既有元素，Dijkstra 要用懶惰刪除：<code>if (du > d[u]) continue;</code>"
  },
  {
    name: "跨容器演算法", tag: "<algorithm> / <numeric>",
    note: "這些函式用熟，能省掉大量手寫迴圈。",
    g: [
      ["排序", [
        ["sort(v.begin(), v.end())", "O(n log n)", ""],
        ["sort(v.begin(), v.end(), greater<int>())", "O(n log n)", "降冪"],
        ["stable_sort(...)", "O(n log²n)", "保持相等元素原順序"],
        ["nth_element(v.begin(), v.begin()+k, v.end())", "O(n)", "只把第 k 小放到位"]
      ]],
      ["搜尋", [
        ["count(v.begin(), v.end(), x)", "O(n)", ""],
        ["max_element(...) - v.begin()", "O(n)", "最大值的位置"],
        ["any_of / all_of / none_of", "O(n)", "配 lambda 用"]
      ]],
      ["數值", [
        ["accumulate(b, e, 0LL)", "O(n)", "初值一定寫 0LL"],
        ["partial_sum(b, e, out)", "O(n)", "前綴和"],
        ["iota(v.begin(), v.end(), 0)", "O(n)", "填 0,1,2… · DSU 初始化"],
        ["__gcd(a, b)", "O(log n)", "GCC 內建"]
      ]],
      ["修改", [
        ["reverse(v.begin(), v.end())", "O(n)", ""],
        ["rotate(b, b+k, e)", "O(n)", "左旋 k 位"],
        ["next_permutation(...)", "O(n)", "<b>要先 sort</b> 才拿得到全部"]
      ]]
    ],
    trap: "<code>accumulate</code> 的<b>初值型別決定累加型別</b>。寫 <code>0</code> 就是 int 累加，即使結果存進 long long 也已經溢位了——這是很隱蔽的溢位來源。"
  }
];

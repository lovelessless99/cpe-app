/* 三星題庫（第四批 9 題） */
const SOL44 = {
10129: {
  q: "Play on Words：給若干單字，問能否把它們<b>全部</b>排成一列，使得<b>每個單字的首字母 = 前一個單字的尾字母</b>。",
  h: "把<b>字母當節點、單字當有向邊</b>（首字母 → 尾字母）⇒ 問題變成「這張有向圖有沒有<b>歐拉路徑</b>」。<br>有向圖存在歐拉路徑的條件：<br>① <b>所有有邊的節點在同一個連通分量</b>（用<b>無向</b>意義的連通性判斷，並查集最省事）<br>② 度數條件：<b>要嘛所有點的出入度相等</b>（歐拉迴路），<b>要嘛恰有一點出度−入度 = +1、另一點 = −1，其餘相等</b>（歐拉路徑）<br>兩條都滿足才輸出 <code>Ordering is possible.</code><br>複雜度 O(單字數 + 26)。<br>驗算：<code>acm, ibm</code> ⇒ a→m、i→m，兩條邊都指向 m，入度不匹配 ⇒ <b>cannot be opened</b> ✓。",
  t: "① <b>連通性要用「無向」意義判斷</b>（把有向邊當無向邊做並查集），只看有向連通會誤判。<br>② <b>只檢查有邊的字母</b>（出度或入度 &gt; 0），孤立字母不算。<br>③ 度數條件要<b>恰好</b>：+1 與 −1 各一個，或全部為 0；出現 ±2 就不行。<br>④ 單字數可達 10⁵ ⇒ 只需要<b>首尾字母</b>，中間可以忽略。<br>⑤ 輸出兩種句子含句號：<code>Ordering is possible.</code> / <code>The door cannot be opened.</code>",
  c: `#include <bits/stdc++.h>
using namespace std;

int par[26];
int find_(int x) { while (par[x] != x) x = par[x] = par[par[x]]; return x; }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<int> outd(26, 0), ind(26, 0);
        vector<char> used(26, 0);
        for (int i = 0; i < 26; i++) par[i] = i;

        for (int i = 0; i < n; i++) {
            string s; cin >> s;
            int a = s[0] - 'a', b = s[s.size() - 1] - 'a';
            outd[a]++; ind[b]++;
            used[a] = used[b] = 1;
            int x = find_(a), y = find_(b);
            if (x != y) par[x] = y;                     // 無向意義的連通性
        }
        bool ok = true;
        int root = -1;
        for (int i = 0; i < 26; i++) {                  // 只看有邊的字母
            if (!used[i]) continue;
            if (root < 0) root = find_(i);
            else if (find_(i) != root) ok = false;
        }
        int plus = 0, minus = 0;
        for (int i = 0; i < 26 && ok; i++) {
            int d = outd[i] - ind[i];
            if (d == 0) continue;
            if (d == 1) plus++;
            else if (d == -1) minus++;
            else ok = false;                            // 出現 ±2 就不行
        }
        if (!(plus == 0 && minus == 0) && !(plus == 1 && minus == 1)) ok = false;
        cout << (ok ? "Ordering is possible.\\n" : "The door cannot be opened.\\n");
    }
    return 0;
}`
},

10054: {
  q: "The Necklace：每顆珠子有兩種顏色（兩端各一），相鄰珠子<b>接觸端顏色必須相同</b>。問能否把所有珠子串成<b>一個環</b>；可以的話輸出串法。",
  h: "跟 10129 是同一個模型，但這裡要求<b>環</b>而且要<b>輸出方案</b>：<br>顏色是節點、珠子是<b>無向邊</b> ⇒ 問題變成「有沒有<b>歐拉迴路</b>」。<br>存在條件：<b>所有點的度數皆為偶數</b>，且<b>有邊的點連通</b>。<br>輸出方案用 <b>Hierholzer 演算法</b>：DFS 走過每條未用的邊，<b>回溯時把邊推入堆疊</b>，最後反轉輸出。<br>（跟 302 John's trip 同一招，那題還要求字典序最小。）<br>珠子數 ≤ 1000、顏色 ≤ 50 ⇒ 用鄰接矩陣記錄重邊數量最省事。<br>驗算：樣例二能串成環，輸出 5 行接龍 ✓。",
  t: "① <b>環 ⇒ 所有度數必為偶數</b>（路徑才允許兩個奇數點）。<br>② <b>Hierholzer 要在回溯時推入</b>，最後反轉；直接在遞迴進入時輸出會得到錯誤順序。<br>③ 有<b>重邊</b>（同樣兩色的珠子可能不只一顆）⇒ 用 <code>cnt[a][b]</code> 計數而非布林。<br>④ 遞迴深度可達 1000，安全。<br>⑤ 輸出格式：每行 <code>a b</code>，測資之間<b>空一行</b>；不可能時印 <code>some beads may be lost</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int cnt[55][55];
vector<pair<int, int> > path;

void hierholzer(int u) {
    for (int v = 1; v <= 50; v++) {
        if (!cnt[u][v]) continue;
        cnt[u][v]--; cnt[v][u]--;                       // 用掉這條邊
        hierholzer(v);
        path.push_back(make_pair(v, u));                // 回溯時才推入
    }
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int tc = 1; tc <= T; tc++) {
        int n; cin >> n;
        memset(cnt, 0, sizeof cnt);
        vector<int> deg(55, 0);
        int start = 0;
        for (int i = 0; i < n; i++) {
            int a, b; cin >> a >> b;
            cnt[a][b]++; cnt[b][a]++;
            deg[a]++; deg[b]++;
            start = a;
        }
        bool ok = true;
        for (int i = 1; i <= 50; i++) if (deg[i] % 2) ok = false;   // 度數須全偶

        path.clear();
        if (ok) {
            hierholzer(start);
            if ((int)path.size() != n) ok = false;      // 沒走完 -> 不連通
        }
        if (tc > 1) cout << "\\n";
        cout << "Case #" << tc << "\\n";
        if (!ok) cout << "some beads may be lost\\n";
        else {
            reverse(path.begin(), path.end());
            for (size_t i = 0; i < path.size(); i++)
                cout << path[i].first << " " << path[i].second << "\\n";
        }
    }
    return 0;
}`
},

10199: {
  q: "Tourist Guide：給城市地圖（地點名稱 + 道路），找出所有<b>割點</b>（拿掉它會讓某些地點無法互通），依<b>字典序</b>輸出名稱。",
  h: "<b>Tarjan 割點</b>（跟 315 Network 同一題，差別在這裡是字串名稱且要排序輸出）：<br>記 <code>dfn[u]</code>（造訪序）與 <code>low[u]</code>（子樹經至多一條返祖邊能回到的最小 dfn）：<br>・<b>非根</b> u 是割點 ⟺ 存在子節點 v 使 <code>low[v] ≥ dfn[u]</code><br>・<b>根</b>是割點 ⟺ 它有 <b>≥ 2 個 DFS 子樹</b><br>地點名稱用 <code>map&lt;string,int&gt;</code> 對映；輸出前把找到的名稱<b>排序</b>。<br>複雜度 O(V + E)。",
  t: "① <b>根與非根的判定條件不同</b>，這是割點最常寫錯的地方。<br>② 輸出要依<b>字典序</b>排序名稱，不是編號順序。<br>③ 圖可能<b>不連通</b> ⇒ 每個未訪問的點都要當根跑一次。<br>④ 輸入格式：先給地點數 N，接著 N 行名稱，再給道路數與道路（<b>成對的名稱</b>）。<br>⑤ 輸出格式 <code>City map #k: X camera(s) found</code>，接著每行一個名稱；測資之間<b>空一行</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int timer_;
vector<vector<int> > adj;
vector<int> dfn, low;
vector<char> cut;

void dfs(int u, int par) {
    dfn[u] = low[u] = ++timer_;
    int child = 0;
    for (size_t i = 0; i < adj[u].size(); i++) {
        int v = adj[u][i];
        if (v == par) continue;
        if (dfn[v]) { low[u] = min(low[u], dfn[v]); continue; }
        child++;
        dfs(v, u);
        low[u] = min(low[u], low[v]);
        if (par != -1 && low[v] >= dfn[u]) cut[u] = 1;  // 非根判定
    }
    if (par == -1 && child > 1) cut[u] = 1;             // 根判定
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, cs = 1;
    bool first = true;
    while (cin >> n && n) {
        vector<string> name(n);
        map<string, int> id;
        for (int i = 0; i < n; i++) { cin >> name[i]; id[name[i]] = i; }
        int m; cin >> m;
        adj.assign(n, vector<int>());
        for (int i = 0; i < m; i++) {
            string a, b; cin >> a >> b;
            adj[id[a]].push_back(id[b]);
            adj[id[b]].push_back(id[a]);
        }
        dfn.assign(n, 0); low.assign(n, 0); cut.assign(n, 0);
        timer_ = 0;
        for (int i = 0; i < n; i++) if (!dfn[i]) dfs(i, -1);   // 圖可能不連通

        vector<string> res;
        for (int i = 0; i < n; i++) if (cut[i]) res.push_back(name[i]);
        sort(res.begin(), res.end());                   // 字典序輸出

        if (!first) cout << "\\n";
        first = false;
        cout << "City map #" << cs++ << ": " << res.size() << " camera(s) found\\n";
        for (size_t i = 0; i < res.size(); i++) cout << res[i] << "\\n";
    }
    return 0;
}`
},

11151: {
  q: "Longest Palindrome：從字串中<b>刪掉零個或多個字元</b>，求能得到的<b>最長回文</b>的長度。字串長 ≤ 1000。",
  h: "「刪字元求最長回文」= <b>最長回文子序列（LPS）</b>，而它有個漂亮的等價：<br><code>LPS(s) = LCS(s, reverse(s))</code><br>所以可以直接套 LCS 模板。<br>也可以用<b>區間 DP</b> 直接做（本解採用，更省記憶體）：<br><code>dp[i][j]</code> = 區間 <code>[i, j]</code> 的最長回文子序列長度<br><code>若 s[i] == s[j] → dp[i][j] = dp[i+1][j−1] + 2</code><br><code>否則 → dp[i][j] = max(dp[i+1][j], dp[i][j−1])</code><br>依<b>區間長度由小到大</b>遞推，O(n²) = 100 萬。<br>驗算：<code>ADAM</code> ⇒ <b>3</b>（ADA）；<code>MADAM</code> ⇒ <b>5</b>（整個就是回文）。",
  t: "① 是<b>子序列</b>不是子字串（可以不連續）。<br>② 遞推順序必須是<b>區間長度由小到大</b>。<br>③ 邊界：<code>dp[i][i] = 1</code>（單字元本身是回文）；長度 2 時 <code>s[i]==s[j]</code> 給 2、否則 1。<br>④ n = 1000 ⇒ 二維 <code>int</code> 表是 4 MB，安全；若要更省可用滾動陣列。<br>⑤ 字串可能含<b>空白</b>？本題是單一 token，用 <code>cin &gt;&gt;</code> 即可。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    cin.ignore();
    while (T--) {
        string s; getline(cin, s);
        int n = s.size();
        if (n == 0) { cout << "0\\n"; continue; }

        vector<vector<int> > dp(n, vector<int>(n, 0));
        for (int i = 0; i < n; i++) dp[i][i] = 1;
        for (int len = 2; len <= n; len++)              // 區間長度由小到大
            for (int i = 0; i + len - 1 < n; i++) {
                int j = i + len - 1;
                if (s[i] == s[j])
                    dp[i][j] = (len == 2) ? 2 : dp[i + 1][j - 1] + 2;
                else
                    dp[i][j] = max(dp[i + 1][j], dp[i][j - 1]);
            }
        cout << dp[0][n - 1] << "\\n";
    }
    return 0;
}`
},

10496: {
  q: "Collecting Beepers：機器人從起點出發，要撿完所有 beeper（<b>≤ 10 個</b>）再回到起點。移動用<b>曼哈頓距離</b>，求最短總距離。",
  h: "這是<b>旅行推銷員問題（TSP）</b>，但 n ≤ 10 ⇒ 兩種寫法都行：<br><b>① 全排列</b>：<code>10! = 362 萬</code>，配上每種 O(n) 計算 ⇒ 3600 萬，勉強可過。<br><b>② 狀壓 DP</b>（本解採用，更快也更標準）：<br><code>dp[mask][i]</code> = 已撿過 mask 這些 beeper、目前站在第 i 個的最短距離<br>轉移 <code>dp[mask|1&lt;&lt;j][j] = min(…, dp[mask][i] + d[i][j])</code><br>答案 <code>= min(dp[full][i] + d[i][起點])</code><br>複雜度 <code>2¹⁰ × 10 × 10 = 10 萬</code>，瞬殺。<br>驗算：樣例的答案是 <b>24</b>。",
  t: "① 距離是<b>曼哈頓</b>（<code>|dx| + |dy|</code>）不是歐氏。<br>② <b>要回到起點</b>，最後別忘了加回程距離。<br>③ 起點<b>不算 beeper</b>，但要參與距離計算（本解把它當索引 n）。<br>④ n 可能是 <b>0</b>（沒有 beeper）⇒ 答案 0。<br>⑤ 輸出句子 <code>The shortest path has length X</code>（<b>沒有句號</b>）。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int W, H, sx, sy, n;
        cin >> W >> H >> sx >> sy >> n;
        vector<int> x(n), y(n);
        for (int i = 0; i < n; i++) cin >> x[i] >> y[i];

        if (n == 0) { cout << "The shortest path has length 0\\n"; continue; }
        // d[i][j]：beeper 之間；ds[i]：起點到第 i 個
        vector<vector<int> > d(n, vector<int>(n, 0));
        vector<int> ds(n);
        for (int i = 0; i < n; i++) {
            ds[i] = abs(x[i] - sx) + abs(y[i] - sy);    // 曼哈頓距離
            for (int j = 0; j < n; j++)
                d[i][j] = abs(x[i] - x[j]) + abs(y[i] - y[j]);
        }
        const int INF = 1000000000;
        vector<vector<int> > dp(1 << n, vector<int>(n, INF));
        for (int i = 0; i < n; i++) dp[1 << i][i] = ds[i];
        for (int mask = 1; mask < (1 << n); mask++)
            for (int i = 0; i < n; i++) {
                if (dp[mask][i] == INF || !(mask >> i & 1)) continue;
                for (int j = 0; j < n; j++) {
                    if (mask >> j & 1) continue;
                    int &t = dp[mask | 1 << j][j];
                    t = min(t, dp[mask][i] + d[i][j]);
                }
            }
        int best = INF, full = (1 << n) - 1;
        for (int i = 0; i < n; i++) best = min(best, dp[full][i] + ds[i]);   // 回程
        cout << "The shortest path has length " << best << "\\n";
    }
    return 0;
}`
},

10801: {
  q: "Lift Hopping：大樓有 100 層，<code>k ≤ 5</code> 部電梯，各有<b>不同的每層耗時</b>與<b>停靠樓層清單</b>。從 0 樓到 <code>t</code> 樓，<b>換電梯要等 60 秒</b>。求最短時間；到不了輸出 <code>IMPOSSIBLE</code>。",
  h: "把「<b>(樓層, 目前在哪部電梯)</b>」當成狀態跑 <b>Dijkstra</b>：<br>・<b>同一部電梯移動</b>：從樓層 a 到 b 花 <code>|a−b| × 該電梯每層耗時</code>（兩層都要在該電梯的清單裡）<br>・<b>換電梯</b>：同一樓層換到另一部，花 <b>60 秒</b><br>狀態數 <code>100 × 5 = 500</code>，邊數不多 ⇒ 極快。<br><b>起點的特殊處理</b>：在 0 樓上第一部電梯<b>不算換乘</b>（不收 60 秒）。<br>驗算：樣例的四筆答案是 <b>275 / 285 / 3920 / IMPOSSIBLE</b>。",
  t: "① <b>第一次上電梯不收 60 秒</b>——這是最容易多算的地方。<br>② 換電梯必須在<b>兩部都有停靠</b>的樓層。<br>③ 電梯的停靠清單<b>已排序</b>，但移動可以跨多層（不必逐層）。<br>④ 目標樓層若<b>沒有任何電梯停靠</b> ⇒ IMPOSSIBLE。<br>⑤ <code>t = 0</code> 時答案是 <b>0</b>（不用動）。<br>⑥ 每行的電梯停靠數不固定，要<b>整行讀取</b>再解析。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef pair<int, pair<int, int> > State;               // (時間, (樓層, 電梯))

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int k, t;
    while (cin >> k >> t) {
        vector<int> cost(k);
        for (int i = 0; i < k; i++) cin >> cost[i];
        cin.ignore();
        vector<vector<char> > stop(k, vector<char>(100, 0));
        for (int i = 0; i < k; i++) {
            string line; getline(cin, line);
            istringstream is(line);
            int f;
            while (is >> f) stop[i][f] = 1;
        }
        const int INF = 1000000000;
        vector<vector<int> > dist(100, vector<int>(k, INF));
        priority_queue<State, vector<State>, greater<State> > pq;
        for (int i = 0; i < k; i++)
            if (stop[i][0]) { dist[0][i] = 0; pq.push(make_pair(0, make_pair(0, i))); }

        while (!pq.empty()) {
            State cur = pq.top(); pq.pop();
            int d = cur.first, f = cur.second.first, e = cur.second.second;
            if (d > dist[f][e]) continue;
            for (int nf = 0; nf < 100; nf++) {          // 同一部電梯移動
                if (nf == f || !stop[e][nf]) continue;
                int nd = d + abs(nf - f) * cost[e];
                if (nd < dist[nf][e]) { dist[nf][e] = nd; pq.push(make_pair(nd, make_pair(nf, e))); }
            }
            for (int ne = 0; ne < k; ne++) {            // 換電梯，加 60 秒
                if (ne == e || !stop[ne][f]) continue;
                int nd = d + 60;
                if (nd < dist[f][ne]) { dist[f][ne] = nd; pq.push(make_pair(nd, make_pair(f, ne))); }
            }
        }
        int best = INF;
        for (int i = 0; i < k; i++) best = min(best, dist[t][i]);
        if (best >= INF) cout << "IMPOSSIBLE\\n";
        else cout << best << "\\n";
    }
    return 0;
}`
},

11838: {
  q: "Come and Go：城市有 n 個路口與若干街道（<b>單向或雙向</b>）。判斷是否<b>任兩個路口都能互相到達</b>（強連通），是則輸出 1、否則 0。",
  h: "<b>強連通判定</b>，最省事的作法是 <b>Kosaraju 的兩次 DFS</b>：<br>① 從任一點在<b>原圖</b>做 DFS，看是否所有點都能到達。<br>② 從同一點在<b>反向圖</b>做 DFS，看是否所有點都能到達。<br>兩次都全訪問到 ⇒ 整張圖強連通。<br>直覺：①保證「起點能到所有點」，②保證「所有點都能到起點」，兩者合起來就是任兩點互通。<br>n ≤ 2000、m 可達 200 萬 ⇒ 用<b>鄰接表</b>與<b>迭代 DFS</b>（避免爆堆疊）。<br><b>雙向街道</b>要加兩條有向邊（正反各一）。",
  t: "① <b>兩次 DFS 缺一不可</b>：只做原圖的會漏掉「回不去」的情況。<br>② 雙向街道（型別 2）要<b>兩個方向都加邊</b>。<br>③ m 可達 <code>n(n−1)/2</code> ≈ 200 萬 ⇒ 必須用鄰接表 + <code>sync_with_stdio(false)</code>。<br>④ 遞迴 DFS 深度可達 2000，其實安全，但改<b>迭代版</b>更保險。<br>⑤ <code>0 0</code> 結束；輸出只有 <code>1</code> 或 <code>0</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int n;
vector<vector<int> > g, rg;

int reachCount(const vector<vector<int> > &adj) {
    vector<char> vis(n + 1, 0);
    vector<int> st;
    st.push_back(1); vis[1] = 1;
    int cnt = 1;
    while (!st.empty()) {                               // 迭代 DFS
        int u = st.back(); st.pop_back();
        for (size_t i = 0; i < adj[u].size(); i++) {
            int v = adj[u][i];
            if (!vis[v]) { vis[v] = 1; cnt++; st.push_back(v); }
        }
    }
    return cnt;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int m;
    while (cin >> n >> m && (n || m)) {
        g.assign(n + 1, vector<int>());
        rg.assign(n + 1, vector<int>());
        for (int i = 0; i < m; i++) {
            int u, v, p; cin >> u >> v >> p;
            g[u].push_back(v);
            rg[v].push_back(u);
            if (p == 2) {                               // 雙向街道
                g[v].push_back(u);
                rg[u].push_back(v);
            }
        }
        bool ok = (reachCount(g) == n) && (reachCount(rg) == n);
        cout << (ok ? 1 : 0) << "\\n";
    }
    return 0;
}`
},

11517: {
  q: "Exact Change：買東西要付 <code>p</code> 元，手上有 n 張紙鈔／硬幣（面額不一）。要付出<b>至少 p</b> 元，且<b>付出的總額盡量小</b>；同額時<b>張數盡量少</b>。輸出付出的金額與張數。",
  h: "<b>0/1 背包的可行性 DP + 最小化張數</b>：<br><code>dp[sum]</code> = 湊出恰好 sum 元所需的<b>最少張數</b>（不可行則 INF）。<br>轉移是標準的 0/1 背包：<code>dp[sum] = min(dp[sum], dp[sum − v] + 1)</code>，<b>sum 由大到小</b>避免同一張用兩次。<br>總額上界是所有面額之和（≤ 10000 × 100）。<br>最後<b>從 p 往上找</b>第一個可行的 sum，輸出 <code>sum</code> 與 <code>dp[sum]</code>。<br>驗算：<code>p=1400</code>、手上 <code>500, 1000, 2000</code> ⇒ 最接近且 ≥ 1400 的是 <code>1500 = 500 + 1000</code>，用 <b>2</b> 張 ✓。",
  t: "① 目標是「<b>≥ p 的最小總額</b>」，不是恰好等於 p——要從 p 往上掃。<br>② 同額時<b>張數最少</b> ⇒ dp 要記張數而非只記可行性。<br>③ 0/1 背包的迴圈<b>必須由大到小</b>，否則同一張會被用多次。<br>④ 上界是<b>所有面額總和</b>，陣列要開夠。<br>⑤ 一定有解（全部付出去必定 ≥ p）。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int p, n; cin >> p >> n;
        vector<int> v(n);
        int total = 0;
        for (int i = 0; i < n; i++) { cin >> v[i]; total += v[i]; }

        const int INF = 1000000;
        vector<int> dp(total + 1, INF);
        dp[0] = 0;
        for (int i = 0; i < n; i++)
            for (int s = total; s >= v[i]; s--)         // 0/1 背包：由大到小
                if (dp[s - v[i]] + 1 < dp[s]) dp[s] = dp[s - v[i]] + 1;

        for (int s = p; s <= total; s++)                // 從 p 往上找第一個可行的
            if (dp[s] < INF) { cout << s << " " << dp[s] << "\\n"; break; }
    }
    return 0;
}`
},

10219: {
  q: "Find the ways!：求組合數 <code>C(n, m)</code> 的<b>位數</b>（十進位有幾位）。",
  h: "<code>C(n, m)</code> 可能有上千位，但只要<b>位數</b> ⇒ 取對數：<br><code>位數 = ⌊log₁₀ C(n, m)⌋ + 1</code><br>而 <code>log₁₀ C(n, m) = Σ_{i=1..n} log₁₀ i − Σ_{i=1..m} log₁₀ i − Σ_{i=1..n−m} log₁₀ i</code><br>用<b>前綴和</b>先把 <code>Σ log₁₀ i</code> 建好（到 10⁷ 或依題目上界），每筆詢問 O(1)。<br>（也可以用 <code>lgamma</code> 直接算，更快更準。）<br>驗算：<code>C(20, 5) = 15504</code> ⇒ <b>5</b> 位… 樣例給的第一個答案是 14，代表 n 更大；<code>C(100, 10) ≈ 1.73×10¹³</code> ⇒ <b>14</b> 位 ✓。",
  t: "① <b>取對數是處理「超大數位數」的標準招式</b>（跟 10916 Factstone 同一招）。<br>② 用 <code>lgamma(n+1)/log(10)</code> 比逐項累加更精準也更快。<br>③ 浮點誤差可能讓 <code>⌊⌋</code> 差 1 ⇒ 在邊界處可加一個極小的 eps（如 <code>1e-9</code>）。<br>④ <code>m = 0</code> 或 <code>m = n</code> 時 <code>C = 1</code> ⇒ 1 位。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    long long n, m;
    while (cin >> n >> m) {
        // log10(C(n,m)) = log10(n!) - log10(m!) - log10((n-m)!)
        double lg = (lgamma((double)n + 1.0) - lgamma((double)m + 1.0)
                   - lgamma((double)(n - m) + 1.0)) / log(10.0);
        long long digits = (long long)(lg + 1e-9) + 1;
        cout << digits << "\\n";
    }
    return 0;
}`
}
};

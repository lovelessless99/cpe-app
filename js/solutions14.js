/* 歷屆補完（第七批 8 題，都是低過題率的硬題） */
const SOL14 = {
11003: {
  q: "疊箱子：<code>n</code> 個箱子（尺寸相同），第 i 個重 <code>w[i]</code>、最多能承載 <code>c[i]</code> 的重量。規則：一個箱子上面最多放一個箱子；<b>編號小的不能放在編號大的上面</b>。求最多能疊幾個。",
  h: "「編號小的不能在上面」⇒ 由下往上編號<b>遞增</b>，也就是<b>順序是固定的</b>，只能決定「選哪些」。<br>核心 DP 技巧：<b>把「能否疊 k 個」轉成「疊 k 個的最小總重」</b>——上面越輕，下面的箱子越容易撐住，所以最小重量就是最優解。<br><code>f[k]</code> = 只用索引 ≥ i 的箱子疊 k 個的<b>最小總重</b>。i 由 n−1 往前掃：<br><code>若 f[k−1] ≤ c[i]，則 f[k] = min(f[k], f[k−1] + w[i])</code>（把 i 放到最底下）。<br>k 要<b>由大往小</b>跑，避免同一個箱子用兩次（0/1 背包的老規矩）。答案是最大的 <code>f[k] &lt; INF</code>。O(n²) = 10⁶。",
  t: "① 千萬別去排序！編號順序就是疊放順序，排序會直接破壞條件。<br>② 「最小重量」的交換論證是本題精華：若某個 k 箱組合可行，那最小重量的 k 箱組合也一定可行。<br>③ 承載檢查是 <code>f[k−1] ≤ c[i]</code>（<b>不含</b>自己的重量）。<br>④ k 迴圈務必倒著跑。<br>⑤ 總重最大 1000 × 3000 = 3 × 10⁶，int 夠用。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n && n) {
        vector<int> w(n), c(n);
        for (int i = 0; i < n; i++) cin >> w[i] >> c[i];

        const int INF = 1000000000;
        vector<int> f(n + 1, INF);
        f[0] = 0;                                   // 疊 0 個，重量 0
        for (int i = n - 1; i >= 0; i--)            // 由上往下，i 當最底層
            for (int k = n; k >= 1; k--)
                if (f[k - 1] != INF && f[k - 1] <= c[i])
                    f[k] = min(f[k], f[k - 1] + w[i]);

        int ans = 0;
        for (int k = n; k >= 1; k--) if (f[k] < INF) { ans = k; break; }
        cout << ans << "\\n";
    }
    return 0;
}`
},

12797: {
  q: "字母公園：<code>N × N</code>（≤ 100）的格子，每格是 a~j 或 A~J。「一致路徑」= 相鄰移動，且<b>同一個字母不能同時出現大寫與小寫</b>。求從左上到右下最短一致路徑的<b>格子數</b>；無解輸出 -1。",
  h: "限制看起來很麻煩，其實只有 <b>10 個字母</b>，每個字母只有「用大寫」或「用小寫」兩種選擇 ⇒ <b>枚舉 2¹⁰ = 1024 種大小寫組合</b>。<br>組合一旦固定，每一格就只剩「能走 / 不能走」兩種狀態，變成<b>單純的最短路 BFS</b>。<br>1024 × 10⁴ 格 = 10⁷，完全來得及。<br>這是「限制維度小 ⇒ 枚舉限制、把問題退化成裸題」的經典手法。",
  t: "① 不要把「已使用的字母集合」塞進 BFS 狀態（3¹⁰ × 10⁴ 會爆）——<b>枚舉在外面</b>才對。<br>② 起點與終點自己也必須合法，否則該組合直接跳過。<br>③ 答案是<b>格子數</b>不是步數（BFS 距離要從 1 起算，樣例 6×6 的答案 13 &gt; 曼哈頓下界 11）。<br>④ 多筆測資讀到 EOF。<br>⑤ mask 的 bit j = 1 代表第 j 個字母採用<b>大寫</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n) {
        vector<string> g(n);
        for (int i = 0; i < n; i++) cin >> g[i];

        int best = -1;
        int dx[] = {1, -1, 0, 0}, dy[] = {0, 0, 1, -1};
        vector<vector<char> > ok(n, vector<char>(n));
        for (int mask = 0; mask < 1024; mask++) {       // bit j = 1 → 字母 j 走大寫
            // 先把「這個組合下哪些格子能走」整張算出來
            for (int i = 0; i < n; i++)
                for (int j = 0; j < n; j++) {
                    char ch = g[i][j];
                    ok[i][j] = (ch >= 'A' && ch <= 'J')
                             ?  ((mask >> (ch - 'A')) & 1)
                             : !((mask >> (ch - 'a')) & 1);
                }
            if (!ok[0][0] || !ok[n - 1][n - 1]) continue;

            vector<vector<int> > d(n, vector<int>(n, -1));
            queue<pair<int, int> > q;
            d[0][0] = 1;                                // 距離 = 走過的格子數
            q.push(make_pair(0, 0));
            while (!q.empty()) {
                pair<int, int> u = q.front(); q.pop();
                for (int k = 0; k < 4; k++) {
                    int nx = u.first + dx[k], ny = u.second + dy[k];
                    if (nx < 0 || ny < 0 || nx >= n || ny >= n) continue;
                    if (d[nx][ny] != -1 || !ok[nx][ny]) continue;
                    d[nx][ny] = d[u.first][u.second] + 1;
                    q.push(make_pair(nx, ny));
                }
            }
            int v = d[n - 1][n - 1];
            if (v != -1 && (best < 0 || v < best)) best = v;
        }
        cout << best << "\\n";
    }
    return 0;
}`
},

1714: {
  q: "虛擬鍵盤打字：<code>r × c</code>（≤ 50）的網格鍵盤，同一個字元佔的格子連成一塊「鍵」。游標從左上角開始，按方向鍵會<b>跳到該方向上第一個屬於不同鍵的格子</b>（沒有就不動）。按選擇鍵輸入一個字元。求打完整段文字（含結尾 Enter <code>*</code>）的最少按鍵數。",
  h: "兩個零件：<br><b>(1) 預處理跳躍表</b> <code>nxt[r][c][4]</code>：往該方向<b>第一個字元不同</b>的格子。用遞推 O(rc) 算完：<br><code>若 g[r−1][c] ≠ g[r][c] → nxt_up = r−1，否則 = nxt_up[r−1][c]</code>（因為上一格跟自己同鍵，答案就承接上一格的）。<br><b>(2) BFS</b>：狀態 <code>(r, c, i)</code>（游標位置 + 已打幾個字）。關鍵剪枝：<b><code>best[r][c]</code> 記錄這格曾達到的最大進度 i，若新狀態的 i ≤ best 就丟掉</b>。<br>理由：BFS 逐層擴展，先到達的步數必不大於後到的；同一格<b>更早到達且進度更多</b>的狀態全面支配。有了這個剪枝，狀態數從 50×50×10000 壓回 O(rc) 等級。",
  t: "① <b>跳躍規則是「下一個不同鍵」不是「下一格」</b>——這是本題最大的坑。<br>② 卡在邊界時「游標不動」，這種移動等於白費一次按鍵，直接不入隊。<br>③ 文字結尾要<b>自己補一個 <code>*</code></b>（Enter）。<br>④ 沒有剪枝一定 TLE/MLE（文字長 10000）。<br>⑤ 起點固定在 (0,0)，且起點可能剛好就是第一個字元。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int R, C;
    while (cin >> R >> C) {
        vector<string> g(R);
        for (int i = 0; i < R; i++) cin >> g[i];
        string txt; cin >> txt; txt += '*';          // 結尾的 Enter

        // 預處理：往四個方向的「下一個不同鍵」
        vector<vector<int> > up(R, vector<int>(C)), dn(R, vector<int>(C)),
                             lf(R, vector<int>(C)), rt(R, vector<int>(C));
        for (int c = 0; c < C; c++) {
            for (int r = 0; r < R; r++)
                up[r][c] = (r == 0) ? -1 : (g[r - 1][c] != g[r][c] ? r - 1 : up[r - 1][c]);
            for (int r = R - 1; r >= 0; r--)
                dn[r][c] = (r == R - 1) ? -1 : (g[r + 1][c] != g[r][c] ? r + 1 : dn[r + 1][c]);
        }
        for (int r = 0; r < R; r++) {
            for (int c = 0; c < C; c++)
                lf[r][c] = (c == 0) ? -1 : (g[r][c - 1] != g[r][c] ? c - 1 : lf[r][c - 1]);
            for (int c = C - 1; c >= 0; c--)
                rt[r][c] = (c == C - 1) ? -1 : (g[r][c + 1] != g[r][c] ? c + 1 : rt[r][c + 1]);
        }

        int L = txt.size();
        vector<vector<int> > best(R, vector<int>(C, -1));
        queue<pair<pair<int, int>, int> > q;         // ((r, c), 已打字數)
        best[0][0] = 0;
        q.push(make_pair(make_pair(0, 0), 0));
        int step = 0, ans = -1;

        while (!q.empty() && ans < 0) {
            int sz = q.size();
            step++;                                   // 這一層是第 step 次按鍵
            for (int t = 0; t < sz && ans < 0; t++) {
                pair<pair<int, int>, int> u = q.front(); q.pop();
                int r = u.first.first, c = u.first.second, i = u.second;
                if (i > best[r][c]) continue;         // 已被更好的狀態取代

                // (a) 按選擇鍵
                if (g[r][c] == txt[i]) {
                    if (i + 1 == L) { ans = step; break; }
                    if (i + 1 > best[r][c]) {
                        best[r][c] = i + 1;
                        q.push(make_pair(make_pair(r, c), i + 1));
                    }
                }
                // (b) 按方向鍵
                int nr[4] = {up[r][c], dn[r][c], r, r};
                int nc[4] = {c, c, lf[r][c], rt[r][c]};
                for (int k = 0; k < 4; k++) {
                    if (nr[k] < 0 || nc[k] < 0) continue;         // 撞牆，不動
                    if (i > best[nr[k]][nc[k]]) {
                        best[nr[k]][nc[k]] = i;
                        q.push(make_pair(make_pair(nr[k], nc[k]), i));
                    }
                }
            }
        }
        cout << ans << "\\n";
    }
    return 0;
}`
},

315: {
  q: "電話網路：<code>N &lt; 100</code> 個地點的連通無向圖。若某地點停電，會使其他某兩個地點無法互通，就稱它是<b>關鍵點</b>。求關鍵點的個數。",
  h: "裸的<b>割點（articulation point）</b>，用 <b>Tarjan DFS</b>：<br>記 <code>dfn[u]</code>（造訪順序）與 <code>low[u]</code>（u 的子樹經<b>至多一條返祖邊</b>能回到的最小 dfn）。<br>・<b>非根</b> u 是割點 ⟺ 存在子節點 v 使 <code>low[v] ≥ dfn[u]</code>（v 的子樹繞不過 u）。<br>・<b>根</b>是割點 ⟺ 它有 <b>≥ 2 個 DFS 子樹</b>。<br>O(V + E)。",
  t: "① <b>輸入是「一行一個點 + 它的鄰居清單」，行數不定</b>，必須用 <code>getline</code> + <code>istringstream</code> 逐行讀，不能傻傻 <code>cin &gt;&gt; u &gt;&gt; v</code>。<br>② 區塊以只有一個 <code>0</code> 的行結束；<code>N = 0</code> 代表整份輸入結束。<br>③ 根節點的判定條件<b>跟其他點不一樣</b>，這是割點最常寫錯的地方。<br>④ 同一條邊可能重複出現，<code>low</code> 用 <code>dfn[v]</code> 更新（不是 <code>low[v]</code>）才正確。<br>⑤ 記得排除「回到父節點」那條樹邊。",
  c: `#include <bits/stdc++.h>
using namespace std;

int n, timer_, dfn[105], low[105];
bool cut[105];
vector<int> adj[105];

void dfs(int u, int par) {
    dfn[u] = low[u] = ++timer_;
    int child = 0;
    for (size_t i = 0; i < adj[u].size(); i++) {
        int v = adj[u][i];
        if (v == par) continue;                     // 不走回父邊
        if (dfn[v]) { low[u] = min(low[u], dfn[v]); continue; }   // 返祖邊
        child++;
        dfs(v, u);
        low[u] = min(low[u], low[v]);
        if (par != -1 && low[v] >= dfn[u]) cut[u] = true;         // 非根判定
    }
    if (par == -1 && child > 1) cut[u] = true;                    // 根判定
}

int main() {
    string line;
    while (getline(cin, line)) {
        istringstream is(line);
        if (!(is >> n) || n == 0) break;
        for (int i = 1; i <= n; i++) { adj[i].clear(); dfn[i] = low[i] = 0; cut[i] = false; }
        timer_ = 0;

        while (getline(cin, line)) {                // 每行：起點 + 一串鄰居
            istringstream s(line);
            int u; if (!(s >> u) || u == 0) break;
            int v;
            while (s >> v) { adj[u].push_back(v); adj[v].push_back(u); }
        }
        dfs(1, -1);
        int ans = 0;
        for (int i = 1; i <= n; i++) if (cut[i]) ans++;
        cout << ans << "\\n";
    }
    return 0;
}`
},

302: {
  q: "John 的旅程：小鎮有 ≤ 1995 條街（編號 1..n）連接 ≤ 44 個路口。要<b>每條街恰好走一次</b>並回到出發點（出發點 = 第 1 條街兩端<b>編號較小</b>的路口）。若有多組解，輸出<b>街道編號序列字典序最小</b>的那組；無解輸出固定訊息。",
  h: "這是<b>歐拉迴路</b>：存在 ⟺ 所有點度數皆為<b>偶數</b>且（有邊的點）<b>連通</b>。<br>字典序最小的作法：<b>Hierholzer + 每次挑編號最小的未用街道</b>，並在遞迴<b>返回時</b>把街道推入堆疊，最後<b>反序輸出</b>。<br>用「每個路口一個指標 <code>ptr</code>」掃過已排序的鄰接表，總複雜度 O(V + E)。<br>樣例驗證：從路口 1 貪心走 1→2→3→5→4→6，推入堆疊為 6,4,5,3,2,1，反轉正好是 <code>1 2 3 5 4 6</code> ✓。",
  t: "① 出發點<b>不是路口 1</b>，是「第一條輸入街道兩端較小的那個」。<br>② 允許<b>自環</b>（兩端同一路口），自環對度數貢獻 2，鄰接表只加一次。<br>③ <b>推入時機在遞迴返回後</b>，且最後要反轉——順序寫錯就不是字典序最小。<br>④ 判無解要<b>同時</b>檢查度數與連通性（也可最後檢查是否用完所有邊）。<br>⑤ 每個區塊後面要<b>空一行</b>；區塊以 <code>0 0</code> 結束，連續兩個 <code>0 0</code>（即空區塊）代表輸入結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

struct E { int s, to; };                            // 街道編號、另一端
vector<E> adj[45];
int ptr_[45], deg[45];
bool used[2005];
vector<int> order_;

void dfs(int u) {
    while (ptr_[u] < (int)adj[u].size()) {
        E e = adj[u][ptr_[u]++];
        if (used[e.s]) continue;
        used[e.s] = true;
        dfs(e.to);
        order_.push_back(e.s);                      // 返回時才推入
    }
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    while (true) {
        for (int i = 0; i < 45; i++) { adj[i].clear(); ptr_[i] = 0; deg[i] = 0; }
        memset(used, 0, sizeof used);
        order_.clear();

        int m = 0, start = -1, x, y, z;
        while (cin >> x >> y) {
            if (x == 0) break;                      // 區塊結束
            cin >> z;
            if (start < 0) start = min(x, y);       // 家 = 第一條街較小的端點
            E a; a.s = z; a.to = y; adj[x].push_back(a);
            if (x != y) { E b; b.s = z; b.to = x; adj[y].push_back(b); }
            deg[x]++; deg[y]++;
            m++;
        }
        if (m == 0) break;                          // 空區塊 → 輸入結束

        for (int i = 0; i < 45; i++) {              // 依街道編號排序 → 貪心取最小
            sort(adj[i].begin(), adj[i].end(),
                 [](const E &a, const E &b) { return a.s < b.s; });
        }
        bool ok = true;
        for (int i = 0; i < 45; i++) if (deg[i] % 2) ok = false;
        if (ok) {
            dfs(start);
            if ((int)order_.size() != m) ok = false;    // 沒走完 → 不連通
        }
        if (!ok) cout << "Round trip does not exist.\\n";
        else {
            reverse(order_.begin(), order_.end());
            for (int i = 0; i < m; i++) cout << (i ? " " : "") << order_[i];
            cout << "\\n";
        }
        cout << "\\n";
    }
    return 0;
}`
},

753: {
  q: "UNIX 插頭：房間有 <code>n</code> 個插座（各有型號），有 <code>m</code> 台設備（各需要某型號插頭），還有 <code>k</code> 種<b>轉接頭</b>（數量無限），一個轉接頭讓「插頭 u」可以插進「插座 v」。求<b>最少有幾台設備插不上</b>。",
  h: "轉接頭可以<b>串接</b>（B→X→A），所以不是單純的二分圖匹配，而是<b>最大流</b>：<br>・<code>源點 → 型號 u</code>，容量 = 需要 u 型插頭的<b>設備數</b><br>・<code>型號 u → 型號 v</code>，容量 <b>∞</b>（每種轉接頭數量無限）<br>・<code>型號 v → 匯點</code>，容量 = 該型<b>插座數</b><br>最大流 = 能插上的設備數，答案 = <code>m − maxflow</code>。<br>轉接頭的傳遞性由「流可以連續經過多條 ∞ 邊」自動處理，不必先跑遞移閉包。<br>點數 ≤ 幾百，Edmonds-Karp 綽綽有餘。",
  t: "① 型號是<b>字串</b>，用 <code>map&lt;string,int&gt;</code> 編號；設備型號與插座型號共用同一個命名空間。<br>② 轉接頭 <code>u v</code> 的方向是「<b>插頭 u 可以插進插座 v</b>」，方向搞反答案就錯。<br>③ 轉接頭容量必須是 <b>∞</b>（無限供應），設成 1 會少算。<br>④ 出現在轉接頭裡但沒有插座／設備的型號也要建節點。<br>⑤ 測資之間要<b>空一行</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;

const int MX = 605, INF = 1000000000;
int capm[MX][MX], N;

int maxflow(int s, int t) {
    int flow = 0;
    while (true) {
        vector<int> pre(N, -1); pre[s] = s;
        queue<int> q; q.push(s);
        while (!q.empty() && pre[t] < 0) {
            int u = q.front(); q.pop();
            for (int v = 0; v < N; v++)
                if (pre[v] < 0 && capm[u][v] > 0) { pre[v] = u; q.push(v); }
        }
        if (pre[t] < 0) break;
        int f = INF;
        for (int v = t; v != s; v = pre[v]) f = min(f, capm[pre[v]][v]);
        for (int v = t; v != s; v = pre[v]) { capm[pre[v]][v] -= f; capm[v][pre[v]] += f; }
        flow += f;
    }
    return flow;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        map<string, int> id;
        memset(capm, 0, sizeof capm);
        int cnt = 2;                                // 0 = 源點, 1 = 匯點
        // 取得型號編號（沒有就新建）
        #define ID(s) (id.count(s) ? id[s] : (id[s] = cnt++))

        int n; cin >> n;
        for (int i = 0; i < n; i++) {               // 插座
            string s; cin >> s;
            capm[ID(s)][1] += 1;
        }
        int m; cin >> m;
        for (int i = 0; i < m; i++) {               // 設備：名稱 + 插頭型號
            string dev, s; cin >> dev >> s;
            capm[0][ID(s)] += 1;
        }
        int k; cin >> k;
        for (int i = 0; i < k; i++) {               // 轉接頭：u 型插頭可插進 v 型插座
            string u, v; cin >> u >> v;
            int a = ID(u), b = ID(v);
            capm[a][b] = INF;                       // 數量無限
        }
        #undef ID
        N = cnt;
        cout << m - maxflow(0, 1) << "\\n";
        if (T) cout << "\\n";
    }
    return 0;
}`
},

1632: {
  q: "阿里巴巴：一條直線上有 <code>n</code> 個寶物，第 i 個在位置 <code>x[i]</code>（<b>已由小到大給定</b>），且會在時刻 <code>d[i]</code> 後消失。移動速度為 1、拿取不花時間。可從<b>任意位置出發</b>，求拿完所有寶物的最短時間；不可能則輸出 <code>No solution</code>。",
  h: "經典的<b>區間 DP</b>。關鍵觀察：任何時刻，<b>已拿走的寶物必定是一段連續區間</b>，而人一定站在這段區間的<b>左端或右端</b>（否則中間會有沒拿的）。<br><code>dp[i][j][0/1]</code> = 拿完 <code>[i, j]</code> 且人在左端 / 右端的最短時間。<br>轉移（往外擴一格，並檢查<b>新拿的那個寶物是否還沒消失</b>）：<br><code>dp[i][j][0] = min(dp[i+1][j][0] + x[i+1]−x[i], dp[i+1][j][1] + x[j]−x[i])</code>，需 <code>≤ d[i]</code><br><code>dp[i][j][1] = min(dp[i][j−1][1] + x[j]−x[j−1], dp[i][j−1][0] + x[j]−x[i])</code>，需 <code>≤ d[j]</code><br><b>記憶體技巧</b>：n 可到 10000，<code>n²</code> 的表會爆記憶體 ⇒ 按<b>區間長度</b>遞推，只留前一層，空間降到 O(n)。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll INF = (ll)4e18;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n) {
        vector<ll> x(n), d(n);
        for (int i = 0; i < n; i++) cin >> x[i] >> d[i];

        // prev[i][0/1]：長度 L-1、起點 i 的區間；cur 為長度 L
        vector<ll> pL(n, 0), pR(n, 0), cL(n, 0), cR(n, 0);
        for (int i = 0; i < n; i++) { pL[i] = 0; pR[i] = 0; }    // L = 1

        for (int L = 2; L <= n; L++) {
            for (int i = 0; i + L - 1 < n; i++) {
                int j = i + L - 1;
                // 停在左端 i：從區間 [i+1, j] 走過來，新拿的是 i
                ll a = pL[i + 1] == INF ? INF : pL[i + 1] + x[i + 1] - x[i];
                ll b = pR[i + 1] == INF ? INF : pR[i + 1] + x[j] - x[i];
                ll v = min(a, b);
                cL[i] = (v <= d[i]) ? v : INF;
                // 停在右端 j：從區間 [i, j-1] 走過來，新拿的是 j
                ll c = pR[i] == INF ? INF : pR[i] + x[j] - x[j - 1];
                ll e = pL[i] == INF ? INF : pL[i] + x[j] - x[i];
                ll u = min(c, e);
                cR[i] = (u <= d[j]) ? u : INF;
            }
            for (int i = 0; i + L - 1 < n; i++) { pL[i] = cL[i]; pR[i] = cR[i]; }
        }
        ll ans = min(pL[0], pR[0]);
        if (ans >= INF) cout << "No solution\\n";
        else cout << ans << "\\n";
    }
    return 0;
}`,
  t: "① 「已拿的是連續區間、人在端點」這個觀察是整題的地基。<br>② n 到 10000 ⇒ <b>不能開 <code>dp[10000][10000]</code></b>（400 MB），必須用長度遞推 + 滾動陣列。<br>③ 期限檢查是針對<b>新拿到的那一個</b>寶物（左擴檢查 <code>d[i]</code>、右擴檢查 <code>d[j]</code>）。<br>④ 起點任意 ⇒ 長度 1 的所有區間成本都是 0（站在該寶物上）。<br>⑤ INF 相加會溢位，轉移前要先擋掉。<br>⑥ 輸出是 <code>No solution</code>（S 小寫）。"
},

453: {
  q: "兩圓交點：每兩行給一組圓（<code>x y r</code>）。判斷兩圓的關係並輸出交點：無交點、完全重合、或 1~2 個交點（<b>先依 x 排序、x 相同再依 y</b>，格式 <code>(x.xxx,y.yyy)</code>）。",
  h: "設圓心距 <code>d = |c2 − c1|</code>：<br>・同心且同半徑 → <b>THE CIRCLES ARE THE SAME</b><br>・<code>d &gt; r1 + r2</code>（外離）或 <code>d &lt; |r1 − r2|</code>（內含）→ <b>NO INTERSECTION</b><br>・否則用<b>圓交點公式</b>：<br><code>a = (d² + r1² − r2²) / (2d)</code>（交點連線到 c1 的投影長）<br><code>h = √(r1² − a²)</code>（半弦長）<br>基準點 <code>P = c1 + a·(c2−c1)/d</code>，交點 = <code>P ± h·(法向量)</code>，法向量 = <code>(−dy, dx)/d</code>。<br><code>h ≈ 0</code>（相切）時只輸出一個點。",
  t: "① <b>浮點 eps 是本題唯一難點</b>：相切、重合都要用 <code>1e-9</code> 等級的容忍度判斷，硬用 <code>==</code> 必 WA。<br>② <code>r1² − a²</code> 可能因誤差變成微小負數 ⇒ 要 <code>max(0.0, ...)</code> 再開根號。<br>③ 輸出可能出現 <b><code>-0.000</code></b>，必須把極小值歸零。<br>④ 交點要<b>排序</b>（先 x 後 y），且兩個點<b>印在同一行、中間沒有空白</b>。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

const double EPS = 1e-9;

double fix(double v) { return fabs(v) < 5e-4 ? 0.0 : v; }   // 消掉 -0.000

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    double x1_, y1_, r1, x2_, y2_, r2;
    cout << fixed << setprecision(3);
    while (cin >> x1_ >> y1_ >> r1 >> x2_ >> y2_ >> r2) {
        double dx = x2_ - x1_, dy = y2_ - y1_;
        double d = sqrt(dx * dx + dy * dy);

        if (d < EPS && fabs(r1 - r2) < EPS) { cout << "THE CIRCLES ARE THE SAME\\n"; continue; }
        if (d > r1 + r2 + EPS || d < fabs(r1 - r2) - EPS) { cout << "NO INTERSECTION\\n"; continue; }

        double a = (d * d + r1 * r1 - r2 * r2) / (2 * d);
        double h2 = r1 * r1 - a * a;
        double h = h2 > 0 ? sqrt(h2) : 0.0;                 // 誤差保護
        double px = x1_ + a * dx / d, py = y1_ + a * dy / d;
        double ox = -dy / d * h, oy = dx / d * h;           // 法向量 × 半弦長

        vector<pair<double, double> > p;
        p.push_back(make_pair(fix(px + ox), fix(py + oy)));
        if (h > EPS) p.push_back(make_pair(fix(px - ox), fix(py - oy)));
        sort(p.begin(), p.end());                           // 先 x 後 y

        for (size_t i = 0; i < p.size(); i++)
            cout << "(" << p[i].first << "," << p[i].second << ")";
        cout << "\\n";
    }
    return 0;
}`
}
};

/* 三星題庫（第三批 9 題） */
const SOL43 = {
10911: {
  q: "Forming Quiz Teams：<code>2n</code> 位學生（n ≤ 8）各有座標，要<b>兩兩配對</b>成 n 組，使<b>所有配對的歐氏距離總和最小</b>。輸出最小總和（2 位小數）。",
  h: "<b>狀壓 DP（bitmask DP）的入門經典</b>，一定要背：<br><code>dp[mask]</code> = 把 mask 裡的人<b>全部配對完</b>的最小總距離。<br>轉移時<b>固定取「最低位的未配對者 i」</b>，再枚舉它跟誰配：<br><code>dp[mask] = min_j (dist(i, j) + dp[mask &amp; ~(1&lt;&lt;i) &amp; ~(1&lt;&lt;j)])</code><br><b>為什麼要固定 i</b>：避免同一組配對被算很多次，同時把分支數從 <code>2ⁿ</code> 降到 <code>n</code>。<br>狀態 2¹⁶ = 65536、每個狀態 16 次轉移 ⇒ 100 萬次，瞬殺。<br>用<b>記憶化搜尋</b>寫最直觀（<code>dp</code> 初值設 −1）。<br>驗算：樣例二（4 個人）答案 <b>1.41</b> = √2。",
  t: "① <b>一定要固定「最低位的未配對者」</b>，不然會重複計算導致答案偏小或 TLE。<br>② 遞迴邊界是 <code>mask == 0</code>（全部配對完）⇒ 回傳 0。<br>③ 距離先<b>預先算好</b> <code>d[i][j]</code>，別在遞迴裡反覆呼叫 <code>sqrt</code>。<br>④ 人數是 <b>2n</b>（輸入給的是 n），別讀錯。<br>⑤ 輸出格式 <code>Case k: X.XX</code>，2 位小數。<br>⑥ 名字用不到，但要正確讀掉。",
  c: `#include <bits/stdc++.h>
using namespace std;

int N;
double d[20][20];
vector<double> dp;

double go(int mask) {
    if (mask == 0) return 0;
    if (dp[mask] >= 0) return dp[mask];
    int i = 0;
    while (!(mask >> i & 1)) i++;                       // 固定取最低位的未配對者
    double best = 1e18;
    for (int j = i + 1; j < N; j++) {
        if (!(mask >> j & 1)) continue;
        best = min(best, d[i][j] + go(mask & ~(1 << i) & ~(1 << j)));
    }
    return dp[mask] = best;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cout << fixed << setprecision(2);
    int n, cs = 1;
    while (cin >> n && n) {
        N = 2 * n;                                      // 學生數是 2n
        vector<double> x(N), y(N);
        for (int i = 0; i < N; i++) {
            string name; cin >> name >> x[i] >> y[i];
        }
        for (int i = 0; i < N; i++)                     // 距離預先算好
            for (int j = 0; j < N; j++)
                d[i][j] = hypot(x[i] - x[j], y[i] - y[j]);

        dp.assign(1 << N, -1);
        cout << "Case " << cs++ << ": " << go((1 << N) - 1) << "\\n";
    }
    return 0;
}`
},

11060: {
  q: "Beverages：給若干飲料與「A 必須排在 B 之前」的限制，輸出一個合法的飲用順序。若有多解，取<b>編號（輸入順序）小的優先</b>。",
  h: "<b>拓撲排序 + 字典序最小</b>：<br>把 Kahn 演算法的<b>佇列換成小根堆</b>（<code>priority_queue&lt;int, vector&lt;int&gt;, greater&lt;int&gt; &gt;</code>），每次取出<b>編號最小</b>的入度為 0 的點。<br>這樣產生的就是「所有合法拓撲序中字典序最小」的那個。<br>（跟 10305 Ordering Tasks 是同一題，差別只在那題不要求字典序。）<br>飲料名稱用 <code>map&lt;string,int&gt;</code> 依<b>輸入順序</b>編號。<br>驗算樣例一：<code>vodka wine beer</code> 三種、限制 <code>wine→vodka</code>、<code>beer→wine</code> ⇒ 順序 <b>beer wine vodka</b> ✓。",
  t: "① <b>要字典序最小就把佇列換成小根堆</b>，這是拓撲排序最常見的變體。<br>② 「編號小的優先」指的是<b>輸入順序</b>的編號，不是名稱的字典序。<br>③ 邊的方向：<code>A B</code> 表示 A 要排在 B 之前 ⇒ 邊 <code>A → B</code>，入度加在 B。<br>④ 輸出格式很長：<code>Case #k: Dilbert should drink beverages in this order: a b c.</code>——<b>句尾有句號</b>、名稱間單一空白。<br>⑤ 讀到 EOF 結束；每筆都要清空。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, cs = 1;
    while (cin >> n) {
        vector<string> name(n);
        map<string, int> id;
        for (int i = 0; i < n; i++) { cin >> name[i]; id[name[i]] = i; }

        int m; cin >> m;
        vector<vector<int> > adj(n);
        vector<int> indeg(n, 0);
        for (int i = 0; i < m; i++) {
            string a, b; cin >> a >> b;                 // a 要排在 b 之前
            adj[id[a]].push_back(id[b]);
            indeg[id[b]]++;
        }
        priority_queue<int, vector<int>, greater<int> > pq;   // 小根堆 -> 字典序最小
        for (int i = 0; i < n; i++) if (!indeg[i]) pq.push(i);

        vector<int> ord;
        while (!pq.empty()) {
            int u = pq.top(); pq.pop();
            ord.push_back(u);
            for (size_t i = 0; i < adj[u].size(); i++)
                if (--indeg[adj[u][i]] == 0) pq.push(adj[u][i]);
        }
        cout << "Case #" << cs++ << ": Dilbert should drink beverages in this order:";
        for (size_t i = 0; i < ord.size(); i++) cout << " " << name[ord[i]];
        cout << ".\\n";
    }
    return 0;
}`
},

11504: {
  q: "Dominos：n 張骨牌與若干「推倒 a 會連帶推倒 b」的有向關係。求<b>最少要手動推倒幾張</b>，才能讓全部骨牌都倒下。",
  h: "有向圖的可達性覆蓋問題 ⇒ 答案是「<b>縮點後入度為 0 的強連通分量個數</b>」。<br>但本題有更省事的做法（因為只要<b>數量</b>不要具體集合）：<br><b>做兩次 DFS 的 Kosaraju 縮點</b>後數入度 0 的分量；或者——<br><b>更簡單的等價作法</b>：對每個尚未被訪問的節點，<b>依「反向圖的拓撲序」</b>啟動 DFS。<br>本解採用標準 <b>Tarjan SCC + 統計入度 0 的分量</b>，這是最直接對應題意的寫法。<br>n ≤ 10⁵、m ≤ 10⁵ ⇒ O(n + m)。<br>驗算樣例：<code>3 張、1→2、2→3</code> ⇒ 只要推 1 ⇒ 答案 <b>1</b>。",
  t: "① <b>不能只數「入度 0 的點」</b>——環上的點入度都不是 0，但整個環仍需要推一次。必須先<b>縮點</b>。<br>② Tarjan 遞迴深度可達 10⁵ ⇒ 有爆堆疊風險，建議改成<b>迭代版</b>或用 Kosaraju。<br>③ 縮點後統計「<b>跨分量</b>的邊」才算入度。<br>④ n、m 到 10⁵ ⇒ 用鄰接表 + <code>sync_with_stdio(false)</code>。<br>⑤ 節點編號 1-based。",
  c: `#include <bits/stdc++.h>
using namespace std;

int n, m, timer_, sccCnt;
vector<vector<int> > adj;
vector<int> dfn, low, comp;
vector<char> onstk;
stack<int> stk;

void tarjan(int u) {                                    // 遞迴版；n 大時建議改迭代
    dfn[u] = low[u] = ++timer_;
    stk.push(u); onstk[u] = 1;
    for (size_t i = 0; i < adj[u].size(); i++) {
        int v = adj[u][i];
        if (!dfn[v]) { tarjan(v); low[u] = min(low[u], low[v]); }
        else if (onstk[v]) low[u] = min(low[u], dfn[v]);
    }
    if (low[u] == dfn[u]) {
        while (true) {
            int v = stk.top(); stk.pop(); onstk[v] = 0;
            comp[v] = sccCnt;
            if (v == u) break;
        }
        sccCnt++;
    }
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        cin >> n >> m;
        adj.assign(n + 1, vector<int>());
        for (int i = 0; i < m; i++) {
            int a, b; cin >> a >> b;
            adj[a].push_back(b);
        }
        dfn.assign(n + 1, 0); low.assign(n + 1, 0);
        comp.assign(n + 1, -1); onstk.assign(n + 1, 0);
        timer_ = 0; sccCnt = 0;
        while (!stk.empty()) stk.pop();
        for (int i = 1; i <= n; i++) if (!dfn[i]) tarjan(i);

        vector<int> indeg(sccCnt, 0);
        for (int u = 1; u <= n; u++)
            for (size_t i = 0; i < adj[u].size(); i++)
                if (comp[u] != comp[adj[u][i]]) indeg[comp[adj[u][i]]]++;   // 跨分量的邊

        int ans = 0;
        for (int i = 0; i < sccCnt; i++) if (!indeg[i]) ans++;
        cout << ans << "\\n";
    }
    return 0;
}`
},

10600: {
  q: "ACM Contest and Blackout：求<b>最小生成樹</b>的成本，以及<b>次小生成樹</b>的成本。",
  h: "<b>次小生成樹</b>的標準作法：<br>① 先跑 <b>Kruskal</b> 求出 MST，並記下用到的 <code>n−1</code> 條邊。<br>② <b>逐一「禁用」MST 中的每一條邊</b>，重跑一次 Kruskal；所有結果中<b>最小的</b>就是次小生成樹。<br>正確性：次小生成樹與 MST <b>至少差一條邊</b>，而且必定可以由「拿掉 MST 的某條邊、換一條」得到。<br>複雜度 O(n × m log m)，n ≤ 100、m ≤ 10⁴ ⇒ 約 100 × 10⁴ × 14 ≈ 10⁷，可行。<br>驗算樣例：<b>110 121</b> 與 <b>37 37</b>（第二筆的次小與最小相同，代表有兩棵權重相等的 MST）✓。",
  t: "① 次小生成樹<b>可以與最小相等</b>（樣例二就是 37 37），不要寫成「嚴格大於」。<br>② 禁用某條邊後<b>可能無法連通</b> ⇒ 該次結果作廢。<br>③ 每次重跑都要<b>重置並查集</b>。<br>④ 邊要<b>先排序一次</b>，之後每次重跑直接沿用排好的順序（省下重複排序）。<br>⑤ 輸出兩個數字、空白分隔。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int n;
vector<int> par;
int find_(int x) { while (par[x] != x) x = par[x] = par[par[x]]; return x; }

// 跑 Kruskal，ban 是要禁用的邊索引（-1 表示不禁用）；回傳 -1 代表不連通
ll kruskal(const vector<pair<int, pair<int, int> > > &e, int ban, vector<int> *used) {
    par.assign(n + 1, 0);
    for (int i = 0; i <= n; i++) par[i] = i;
    ll total = 0; int cnt = 0;
    for (size_t i = 0; i < e.size(); i++) {
        if ((int)i == ban) continue;
        int a = find_(e[i].second.first), b = find_(e[i].second.second);
        if (a == b) continue;
        par[a] = b;
        total += e[i].first;
        cnt++;
        if (used) used->push_back(i);
    }
    return cnt == n - 1 ? total : -1;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int m; cin >> n >> m;
        vector<pair<int, pair<int, int> > > e(m);
        for (int i = 0; i < m; i++) {
            int u, v, w; cin >> u >> v >> w;
            e[i] = make_pair(w, make_pair(u, v));
        }
        sort(e.begin(), e.end());                       // 先排序一次

        vector<int> used;
        ll best = kruskal(e, -1, &used);
        ll second_ = LLONG_MAX;
        for (size_t i = 0; i < used.size(); i++) {      // 逐一禁用 MST 的每條邊
            ll v = kruskal(e, used[i], NULL);
            if (v >= 0) second_ = min(second_, v);
        }
        cout << best << " " << second_ << "\\n";
    }
    return 0;
}`
},

10245: {
  q: "The Closest Pair Problem：平面上 n 個點（n ≤ 10000），求<b>最近點對</b>的距離（4 位小數）。若距離 ≥ 10000 則輸出 <code>INFINITY</code>。",
  h: "n = 10000 ⇒ 暴力 O(n²) = 10⁸ 可能吃緊 ⇒ 用<b>分治法</b>求最近點對，O(n log n)：<br>① 依 x 排序後<b>從中間切開</b>，遞迴求左右兩半的最近距離 <code>d = min(dl, dr)</code>。<br>② <b>合併</b>：只有「距離中線 &lt; d」的點才可能跨越兩半形成更近的點對；把這些點<b>依 y 排序</b>後，每個點<b>只需檢查後面 y 差 &lt; d 的點</b>（可證最多 7 個）。<br>這個「<b>帶狀區域內只需比較常數個點</b>」的性質就是分治能做到 O(n log n) 的關鍵。<br>驗算：三點 <code>(0,0) (10000,10000) (20000,20000)</code> ⇒ 最近距離 ≈ 14142 ≥ 10000 ⇒ <b>INFINITY</b> ✓。",
  t: "① <b>≥ 10000 要輸出 <code>INFINITY</code></b>（全大寫），不是印數字。<br>② 帶狀區域的比較<b>要先依 y 排序</b>，並在 y 差 ≥ d 時 <code>break</code>——這是複雜度的保證。<br>③ n = 0 代表輸入結束。<br>④ n = 1 時沒有點對 ⇒ 輸出 INFINITY。<br>⑤ 座標可能是浮點；輸出固定 4 位小數。<br>⑥ 若怕分治寫錯，n ≤ 10000 時「依 x 排序後只比較 x 差 &lt; 目前最佳」的<b>剪枝暴力</b>實測也常能過。",
  c: `#include <bits/stdc++.h>
using namespace std;

struct P { double x, y; };
bool byX(const P &a, const P &b) { return a.x < b.x; }
bool byY(const P &a, const P &b) { return a.y < b.y; }

double solve(vector<P> &p, int l, int r) {
    if (r - l <= 3) {                                   // 小規模直接暴力
        double best = 1e18;
        for (int i = l; i < r; i++)
            for (int j = i + 1; j < r; j++)
                best = min(best, hypot(p[i].x - p[j].x, p[i].y - p[j].y));
        sort(p.begin() + l, p.begin() + r, byY);
        return best;
    }
    int mid = (l + r) / 2;
    double midx = p[mid].x;
    double d = min(solve(p, l, mid), solve(p, mid, r));
    inplace_merge(p.begin() + l, p.begin() + mid, p.begin() + r, byY);

    vector<P> band;                                     // 距離中線 < d 的帶狀區
    for (int i = l; i < r; i++)
        if (fabs(p[i].x - midx) < d) band.push_back(p[i]);
    for (size_t i = 0; i < band.size(); i++)
        for (size_t j = i + 1; j < band.size(); j++) {
            if (band[j].y - band[i].y >= d) break;      // y 差超過 d 就不用再比
            d = min(d, hypot(band[i].x - band[j].x, band[i].y - band[j].y));
        }
    return d;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cout << fixed << setprecision(4);
    int n;
    while (cin >> n && n) {
        vector<P> p(n);
        for (int i = 0; i < n; i++) cin >> p[i].x >> p[i].y;
        sort(p.begin(), p.end(), byX);
        double d = (n < 2) ? 1e18 : solve(p, 0, n);
        if (d >= 10000) cout << "INFINITY\\n";
        else cout << d << "\\n";
    }
    return 0;
}`
},

10465: {
  q: "Homer Simpson：吃一個漢堡要 m 分鐘、另一種要 n 分鐘，總共有 t 分鐘。求<b>最多能吃幾個漢堡</b>（時間要剛好用完）；若無法剛好用完，輸出最多個數與<b>剩餘時間</b>。",
  h: "<b>完全背包的可行性 + 最大化件數</b>：<br><code>dp[t]</code> = 用掉恰好 t 分鐘時最多能吃幾個（不可行則 −1）。<br><code>dp[0] = 0</code>，<code>dp[i] = max(dp[i−m], dp[i−n]) + 1</code>（前提是來源可行）。<br>若 <code>dp[t] ≥ 0</code> ⇒ 直接輸出。<br>否則<b>從 t 往下找</b>第一個可行的時間 <code>t'</code>，輸出 <code>dp[t']</code> 與剩餘時間 <code>t − t'</code>。<br>複雜度 O(t)。<br>驗算：<code>3 5 54</code> ⇒ 54 = 3×18 ⇒ <b>18</b> ✓；<code>3 5 55</code> ⇒ 55 = 5×11 或 3×15+5×2 ⇒ 最多 <b>17</b> 個（3×15 + 5×2 = 55，17 個）✓。",
  t: "① 要<b>最大化個數</b>不是最小化，所以取 <code>max</code>；直覺上會多吃便宜（時間短）的。<br>② <code>dp</code> 初值要能區分「不可行」與「0 個」⇒ 用 −1 表示不可行、<code>dp[0] = 0</code>。<br>③ 無法剛好用完時<b>要輸出兩個數</b>（個數與剩餘時間），格式不同。<br>④ t &lt; 10000 ⇒ 陣列開 10001。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int m, n, t;
    while (cin >> m >> n >> t) {
        vector<int> dp(t + 1, -1);                      // -1 = 不可行
        dp[0] = 0;
        for (int i = 1; i <= t; i++) {
            if (i >= m && dp[i - m] >= 0) dp[i] = max(dp[i], dp[i - m] + 1);
            if (i >= n && dp[i - n] >= 0) dp[i] = max(dp[i], dp[i - n] + 1);
        }
        if (dp[t] >= 0) cout << dp[t] << "\\n";
        else {
            int k = t;
            while (k >= 0 && dp[k] < 0) k--;            // 往下找第一個可行的
            cout << dp[k] << " " << t - k << "\\n";
        }
    }
    return 0;
}`
},

10198: {
  q: "Counting：Gustavo 只認得數字 1、2、3、4，而且<b>把 4 看成另一種寫法的 1</b>。給 n，求他能寫出<b>數字和等於 n</b> 的數有幾種。",
  h: "把它想成<b>用 1、2、3 三種積木排成總和 n 的排列數</b>，但 <b>1 有兩種寫法</b>（1 和 4）⇒<br><code>f(n) = 2·f(n−1) + f(n−2) + f(n−3)</code><br>（第一個數字是 1 或 4 ⇒ 兩種，各剩 n−1；是 2 ⇒ 剩 n−2；是 3 ⇒ 剩 n−3）<br>邊界 <code>f(0) = 1, f(負) = 0</code>。<br><b>n ≤ 1000 ⇒ 答案有數百位 ⇒ 必須用大數</b>。<br>一次遞推到 1000 全部存好，之後每筆詢問 O(1)。<br>驗算：<code>f(1) = 2</code>（寫成 1 或 4）、<code>f(2) = 5</code>（11、14、41、44、2）。",
  t: "① <b>「4 等於 1」讓係數變成 2</b>——這是本題唯一的變化，漏掉就變成普通的三階遞推。<br>② n = 1000 時答案約 <b>10²⁶⁰</b>，<code>long long</code> 差得遠，一定要大數。<br>③ 遞推邊界 <code>f(0) = 1</code>（空排列算一種）。<br>④ 要<b>預處理全部</b>再查表。<br>⑤ base 10⁹ 輸出時<b>最高組不補零、其餘補滿 9 位</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;

const int BASE = 1000000000, W = 9;
typedef vector<int> Big;

Big add(const Big &a, const Big &b) {
    Big r; int carry = 0;
    for (size_t i = 0; i < a.size() || i < b.size() || carry; i++) {
        int v = carry;
        if (i < a.size()) v += a[i];
        if (i < b.size()) v += b[i];
        r.push_back(v % BASE); carry = v / BASE;
    }
    if (r.empty()) r.push_back(0);
    return r;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const int MX = 1000;
    vector<Big> f(MX + 1);
    f[0] = Big(1, 1);
    for (int i = 1; i <= MX; i++) {
        Big s = add(f[i - 1], f[i - 1]);                // 1 有兩種寫法（1 和 4）
        if (i >= 2) s = add(s, f[i - 2]);
        if (i >= 3) s = add(s, f[i - 3]);
        f[i] = s;
    }
    int n;
    while (cin >> n) {
        const Big &v = f[n];
        cout << v.back();
        for (int i = (int)v.size() - 2; i >= 0; i--)
            cout << setw(W) << setfill('0') << v[i];
        cout << setfill(' ') << "\\n";
    }
    return 0;
}`
},

10679: {
  q: "I Love Strings!!：給一個長度 ≤ 100000 的主字串與 <code>q ≤ 1000</code> 個查詢，每個查詢問某字串是否為主字串的<b>子字串</b>，輸出 <code>y</code>／<code>n</code>。",
  h: "最直接的作法就夠：對每個查詢用 <code>string::find</code>。<br>C++ 的 <code>find</code> 雖然最壞是 O(nm)，但實作通常有優化，而查詢字串<b>總長度有限</b>（每個 ≤ 1000、共 1000 個）⇒ 實測可過。<br><b>更穩健的作法</b>：<br>・對每個查詢跑一次 <b>KMP</b>（O(n + m)）⇒ 總計 1000 × 10⁵ = 10⁸，可能吃緊<br>・或對主字串建<b>後綴自動機／後綴陣列</b>，每次查詢 O(m)——這是標準解<br>本解採用 <code>find</code>（簡潔且實測足夠），並在陷阱欄說明何時該換成後綴結構。",
  t: "① 用 <code>find</code> 的<b>前提是查詢字串不多</b>；若 q 很大或字串更長，就要換成<b>後綴自動機</b>或 <b>Aho-Corasick</b>。<br>② 主字串長 10⁵ ⇒ 用 <code>getline</code> 或 <code>cin &gt;&gt;</code> 一次讀完，別逐字元。<br>③ 輸出是單一字母 <code>y</code> / <code>n</code>（小寫）。<br>④ 每筆測資都要重讀主字串。<br>⑤ 大量輸出 ⇒ 用 <code>'\\\\n'</code> 不要 <code>endl</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        string s; cin >> s;
        int q; cin >> q;
        for (int i = 0; i < q; i++) {
            string t; cin >> t;
            cout << (s.find(t) != string::npos ? "y" : "n") << "\\n";
        }
    }
    return 0;
}`
},

10963: {
  q: "The Swallowing Ground：地面裂開成若干道縫隙，每道縫隙由左右兩個端點座標描述。若<b>所有縫隙的寬度都相同</b>，地面就能密合，輸出 <code>yes</code>，否則 <code>no</code>。",
  h: "題目說得很花俏，實際上只要：<br>① 讀入每道縫隙的<b>左右端點</b>，算出寬度 <code>right − left</code>。<br>② 檢查<b>所有寬度是否相同</b>。<br>一次掃描 O(n)。<br><b>唯一的技術點是 I/O</b>：測資之間有空行、第一行是測資數、每筆先給縫隙數再給座標對。<br>驗算樣例：兩道縫隙 <code>(0,-1)</code> 寬 −1… 依「右減左」得到的差值若一致就輸出 <b>yes</b> ✓。",
  t: "① 比較的是<b>寬度（差值）</b>，不是端點座標本身。<br>② 縫隙數可能是 <b>0 或 1</b>（此時必定 yes）。<br>③ 座標可能是<b>負數</b>。<br>④ 測資之間要<b>空一行</b>輸出。<br>⑤ 輸入格式有前導空行，用 <code>cin &gt;&gt;</code> 會自動略過所有空白，最省事。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int tc = 0; tc < T; tc++) {
        int n; cin >> n;
        bool ok = true;
        long long first = 0;
        for (int i = 0; i < n; i++) {
            long long a, b; cin >> a >> b;
            long long w = b - a;                        // 縫隙寬度
            if (i == 0) first = w;
            else if (w != first) ok = false;
        }
        if (tc) cout << "\\n";
        cout << (ok ? "yes" : "no") << "\\n";
    }
    return 0;
}`
}
};

/* 三星題庫（第六批 9 題） */
const SOL46 = {
10739: {
  q: "String to Palindrome：把字串變成回文，可以<b>插入、刪除、修改</b>任一位置的字元（每次算一步）。求<b>最少步數</b>。",
  h: "關鍵轉換：把字串 s 與 <code>reverse(s)</code> 對齊 ⇒ 答案就是<br><code>(n − LPS(s))</code>，其中 LPS 是<b>最長回文子序列</b>。<br>但這裡<b>允許修改</b>（不只插入刪除），所以更直接的作法是<b>區間 DP</b>：<br><code>dp[i][j]</code> = 把 <code>s[i..j]</code> 變成回文的最少步數<br>・<code>s[i] == s[j]</code> ⇒ <code>dp[i][j] = dp[i+1][j−1]</code>（兩端已配對）<br>・否則 ⇒ <code>dp[i][j] = 1 + min(dp[i+1][j], dp[i][j−1], dp[i+1][j−1])</code><br>　（三個選項分別對應：刪左／刪右／<b>改成一樣</b>）<br>依區間長度由小到大遞推，O(n²)。<br>驗算：<code>tanbirahmed</code>（11 字）⇒ <b>5</b> ✓；<code>shahriarmanzoor</code>（15 字）⇒ <b>7</b> ✓。",
  t: "① <b>「修改」對應的是 <code>dp[i+1][j−1] + 1</code></b>——這一項是本題與純 LPS 題（11151）最大的差別，漏掉會多算。<br>② 遞推順序是<b>區間長度由小到大</b>。<br>③ 長度為 1 的區間本身就是回文 ⇒ <code>dp[i][i] = 0</code>。<br>④ 長度為 2 時：相同 0 步、不同 1 步。<br>⑤ 輸出格式 <code>Case k: X</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int tc = 1; tc <= T; tc++) {
        string s; cin >> s;
        int n = s.size();
        vector<vector<int> > dp(n, vector<int>(n, 0));
        for (int len = 2; len <= n; len++)              // 區間長度由小到大
            for (int i = 0; i + len - 1 < n; i++) {
                int j = i + len - 1;
                if (s[i] == s[j])
                    dp[i][j] = (len == 2) ? 0 : dp[i + 1][j - 1];
                else
                    dp[i][j] = 1 + min(dp[i + 1][j],                    // 刪左
                                   min(dp[i][j - 1],                    // 刪右
                                       (len == 2) ? 0 : dp[i + 1][j - 1]));  // 改
            }
        cout << "Case " << tc << ": " << (n ? dp[0][n - 1] : 0) << "\\n";
    }
    return 0;
}`
},

10891: {
  q: "Game of Sum：陣列有 n 個數，兩人輪流<b>從左端或右端</b>取走<b>一個或多個</b>連續的數（但不能同時從兩端取）。兩人都最佳化<b>自己的總分減對手總分</b>。求先手能拿到的<b>最大差值</b>。",
  h: "經典的<b>區間博弈 DP</b>：<br><code>dp[i][j]</code> = 面對區間 <code>[i, j]</code> 時，<b>當前玩家能取得的最大「淨差值」</b>。<br>設 <code>sum(i, j)</code> 是區間總和，當前玩家可以：<br>・從左取 k 個 ⇒ 得到 <code>sum(i,j) − dp[i+k][j]</code><br>・從右取 k 個 ⇒ 得到 <code>sum(i,j) − dp[i][j−k]</code><br>（<b>取走的部分 = 總和 − 剩下給對手的部分</b>，而對手在剩下的區間又會拿走 <code>dp</code>）<br>・<b>全部取走</b> ⇒ 得到 <code>sum(i, j)</code><br>取最大值即可。用<b>前綴和</b>算 <code>sum</code>，複雜度 O(n³) = 100 萬。<br>驗算：<code>4 −10 −20 7</code> ⇒ 先手最佳是只取左邊的 4？實際答案由 DP 算出。",
  t: "① <b>「淨差值」的視角</b>是這類題的關鍵：<code>當前所得 = 區間總和 − 對手在剩餘區間的淨差</code>，這樣就不必分別追蹤兩人的分數。<br>② 別忘了<b>「全部取走」</b>這個選項（此時對手沒得取）。<br>③ 用<b>前綴和</b>，否則 O(n⁴)。<br>④ 數字<b>可能是負數</b>（樣例就有），所以初值要用 <code>INT_MIN</code> 而非 0。<br>⑤ <code>n = 0</code> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n && n) {
        vector<int> a(n + 1), pre(n + 1, 0);
        for (int i = 1; i <= n; i++) { cin >> a[i]; pre[i] = pre[i - 1] + a[i]; }

        vector<vector<int> > dp(n + 2, vector<int>(n + 2, 0));
        for (int len = 1; len <= n; len++)
            for (int i = 1; i + len - 1 <= n; i++) {
                int j = i + len - 1;
                int sum = pre[j] - pre[i - 1];
                int best = sum;                         // 全部取走
                for (int k = i; k < j; k++)             // 從左取到 k
                    best = max(best, sum - dp[k + 1][j]);
                for (int k = j; k > i; k--)             // 從右取到 k
                    best = max(best, sum - dp[i][k - 1]);
                dp[i][j] = best;
            }
        cout << dp[1][n] << "\\n";
    }
    return 0;
}`
},

10213: {
  q: "How Many Pieces of Land?：橢圓邊界上取 n 個點，<b>兩兩連線</b>，求平面被分成<b>最多幾塊</b>。",
  h: "這是經典的<b>圓內弦分割</b>問題，答案有封閉式：<br><code>L(n) = C(n,4) + C(n,2) + 1</code><br>推導用<b>歐拉公式</b> <code>V − E + F = 2</code>：<br>・頂點 <code>V = n + C(n,4)</code>（邊界點 + 內部交點，一般位置下每 4 點決定一個交點）<br>・邊 <code>E = n + C(n,2) + 2·C(n,4)</code><br>・代入得面數，扣掉外部無限面 ⇒ 上式。<br><b>n 可達 2³¹ ⇒ 答案是天文數字 ⇒ 必須用大數</b>。<br>驗算：<code>n = 1</code> ⇒ 1；<code>n = 2</code> ⇒ 2；<code>n = 3</code> ⇒ 4；<code>n = 4</code> ⇒ 8；<code>n = 5</code> ⇒ <b>16</b>；<code>n = 6</code> ⇒ <b>31</b>（<b>不是 32</b>！這是著名的「以為是 2ⁿ」陷阱）。",
  t: "① <b>不是 2ⁿ⁻¹</b>！前五項 1, 2, 4, 8, 16 會讓人以為是 2 的冪，但 n=6 時是 <b>31</b> 不是 32。<br>② n 可達 2³¹ ⇒ <code>C(n,4)</code> 有 30 幾位 ⇒ <b>必須大數</b>。<br>③ <code>C(n,4) = n(n−1)(n−2)(n−3)/24</code>——連續四個整數的乘積<b>必定被 24 整除</b>，可以先乘再除。<br>④ n 可能是 0 或 1（答案 1）。<br>⑤ 大數只需要「乘小數」與「加法」兩種運算。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef unsigned long long ull;

const int BASE = 1000000000, W = 9;
typedef vector<int> Big;

Big big(ull v) {
    Big r;
    if (v == 0) r.push_back(0);
    while (v) { r.push_back((int)(v % BASE)); v /= BASE; }
    return r;
}
Big mulSmall(const Big &a, ull k) {
    Big r; ull carry = 0;
    for (size_t i = 0; i < a.size() || carry; i++) {
        ull v = carry + (i < a.size() ? (ull)a[i] * k : 0);
        r.push_back((int)(v % BASE)); carry = v / BASE;
    }
    if (r.empty()) r.push_back(0);
    return r;
}
Big divSmall(const Big &a, ull k) {
    Big r(a.size());
    ull rem = 0;
    for (int i = (int)a.size() - 1; i >= 0; i--) {
        ull cur = rem * BASE + a[i];
        r[i] = (int)(cur / k);
        rem = cur % k;
    }
    while (r.size() > 1 && r.back() == 0) r.pop_back();
    return r;
}
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
    int T; cin >> T;
    while (T--) {
        ull n; cin >> n;
        // C(n,4) = n(n-1)(n-2)(n-3)/24
        Big c4 = big(1);
        if (n >= 4) {
            c4 = big(n);
            c4 = mulSmall(c4, n - 1);
            c4 = mulSmall(c4, n - 2);
            c4 = mulSmall(c4, n - 3);
            c4 = divSmall(c4, 24);
        } else c4 = big(0);
        // C(n,2) = n(n-1)/2
        Big c2 = (n >= 2) ? divSmall(mulSmall(big(n), n - 1), 2) : big(0);

        Big ans = add(add(c4, c2), big(1));
        cout << ans.back();
        for (int i = (int)ans.size() - 2; i >= 0; i--)
            cout << setw(W) << setfill('0') << ans[i];
        cout << setfill(' ') << "\\n";
    }
    return 0;
}`
},

10306: {
  q: "e-Coins：每種硬幣有<b>兩個值</b> <code>(x, y)</code>，可<b>無限使用</b>。要湊出 <code>√(X² + Y²) = S</code>（X、Y 分別是兩個分量的總和），求<b>最少硬幣數</b>；辦不到輸出 <code>not possible</code>。",
  h: "把 <b>(X, Y) 當成二維狀態</b>做<b>完全背包 BFS/DP</b>：<br><code>dp[x][y]</code> = 湊出分量和 (x, y) 的最少硬幣數。<br>因為 <code>√(x²+y²) ≤ S ≤ 300</code>，所以 <code>x, y ≤ 300</code> ⇒ 狀態只有 <code>301 × 301 ≈ 9 萬</code>。<br>用 <b>BFS</b>（邊權皆 1）或完全背包 DP 都行；本解用 BFS，第一次抵達即最少。<br>最後掃過所有 <code>x² + y² == S²</code> 的格子取最小值。<br>複雜度 O(301² × m)。<br>驗算：樣例二 <code>(0,2), (2,0), (2,1)</code> 要湊 <code>S=20</code> ⇒ 答案 <b>10</b> ✓。",
  t: "① 狀態是<b>二維</b>的 <code>(x, y)</code>，不是一維的距離——這是本題的核心。<br>② 上界是 <b>S 而非 S²</b>（因為 <code>x ≤ √(x²+y²) = S</code>）。<br>③ 目標是 <code>x² + y² == S²</code>（用平方比較避免浮點）。<br>④ 硬幣<b>可無限使用</b> ⇒ 完全背包（BFS 天然就是）。<br>⑤ 輸出 <code>not possible</code>（小寫、有空格）。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int m, S; cin >> m >> S;
        vector<int> cx(m), cy(m);
        for (int i = 0; i < m; i++) cin >> cx[i] >> cy[i];

        vector<vector<int> > d(S + 1, vector<int>(S + 1, -1));
        queue<pair<int, int> > q;
        d[0][0] = 0;
        q.push(make_pair(0, 0));
        while (!q.empty()) {
            pair<int, int> u = q.front(); q.pop();
            for (int i = 0; i < m; i++) {
                int nx = u.first + cx[i], ny = u.second + cy[i];
                if (nx > S || ny > S) continue;         // 上界是 S 不是 S^2
                if (d[nx][ny] != -1) continue;
                d[nx][ny] = d[u.first][u.second] + 1;
                q.push(make_pair(nx, ny));
            }
        }
        int best = -1;
        for (int x = 0; x <= S; x++)
            for (int y = 0; y <= S; y++)
                if (d[x][y] >= 0 && x * x + y * y == S * S)   // 用平方比較
                    if (best < 0 || d[x][y] < best) best = d[x][y];

        if (best < 0) cout << "not possible\\n";
        else cout << best << "\\n";
    }
    return 0;
}`
},

10080: {
  q: "Gopher II：n 隻地鼠、m 個洞，老鷹 s 秒後抵達，地鼠速度 v。地鼠若能在 s 秒內跑到某個洞就能得救（<b>一個洞只能容納一隻</b>）。求有幾隻地鼠<b>逃不掉</b>。",
  h: "「一隻地鼠配一個洞」⇒ <b>二分圖最大匹配</b>：<br>・左邊是地鼠、右邊是洞<br>・地鼠 i 與洞 j 連邊 ⟺ <code>距離(i, j) ≤ s × v</code><br>用<b>匈牙利演算法</b>求最大匹配 M ⇒ 答案是 <code>n − M</code>。<br>n、m ≤ 100 ⇒ 匈牙利的 O(V·E) = 100 × 10⁴ = 100 萬，很快。<br>比較距離時<b>用平方避免開根號</b>：<code>dx² + dy² ≤ (s·v)²</code>。<br>驗算：樣例的兩隻地鼠中，只有一隻跑得到洞 ⇒ 逃不掉 <b>1</b> 隻。",
  t: "① <b>用平方比較距離</b>，避免 <code>sqrt</code> 的浮點誤差（尤其是剛好等於的邊界）。<br>② 座標是<b>浮點數</b>，但比較仍可用浮點平方（加一點 eps 更保險）。<br>③ 答案是<b>逃不掉的數量</b> <code>n − 最大匹配</code>，不是匹配數本身。<br>④ 匈牙利每次找增廣路前要<b>重置 visited</b>。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

int n, m;
vector<vector<char> > can;
vector<int> matchR;
vector<char> used;

bool tryK(int u) {
    for (int v = 0; v < m; v++) {
        if (!can[u][v] || used[v]) continue;
        used[v] = 1;
        if (matchR[v] < 0 || tryK(matchR[v])) { matchR[v] = u; return true; }
    }
    return false;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    double s, v;
    while (cin >> n >> m >> s >> v) {
        vector<double> gx(n), gy(n), hx(m), hy(m);
        for (int i = 0; i < n; i++) cin >> gx[i] >> gy[i];
        for (int i = 0; i < m; i++) cin >> hx[i] >> hy[i];

        double lim = s * v;
        can.assign(n, vector<char>(m, 0));
        for (int i = 0; i < n; i++)
            for (int j = 0; j < m; j++) {
                double dx = gx[i] - hx[j], dy = gy[i] - hy[j];
                if (dx * dx + dy * dy <= lim * lim + 1e-9) can[i][j] = 1;   // 用平方比較
            }
        matchR.assign(m, -1);
        int cnt = 0;
        for (int i = 0; i < n; i++) {
            used.assign(m, 0);
            if (tryK(i)) cnt++;
        }
        cout << n - cnt << "\\n";                        // 逃不掉的數量
    }
    return 0;
}`
},

10147: {
  q: "Highways：給城鎮座標與<b>已建好的公路</b>，求還需要建哪些公路，才能讓所有城鎮連通且<b>新建總長最短</b>。輸出要新建的公路（城鎮編號對）。",
  h: "<b>MST 的變形</b>：已建好的公路<b>成本視為 0</b>（已經花過了）⇒<br>① 先把已建公路的兩端<b>用並查集合併</b>（等於強制加入 MST）。<br>② 再對所有<b>候選邊</b>（任兩城鎮之間，權重是歐氏距離）跑 <b>Kruskal</b>，只加入不成環的。<br>③ 輸出步驟②中<b>實際加入的邊</b>。<br>若一開始就全連通 ⇒ 輸出 <code>No new highways need</code>。<br>城鎮數 ≤ 750 ⇒ 候選邊約 28 萬條，排序可行。",
  t: "① <b>已建公路要先合併</b>（成本 0），不能當成一般邊丟進 Kruskal 排序。<br>② 輸出的是<b>新建的邊</b>，不是全部 MST 邊。<br>③ 全連通時要輸出<b>特定訊息</b>而非空白。<br>④ 距離用浮點比較即可（座標是整數，可用平方距離避免誤差）。<br>⑤ 測資之間<b>空一行</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;

vector<int> par;
int find_(int x) { while (par[x] != x) x = par[x] = par[par[x]]; return x; }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int tc = 0; tc < T; tc++) {
        int n; cin >> n;
        vector<double> x(n + 1), y(n + 1);
        for (int i = 1; i <= n; i++) cin >> x[i] >> y[i];
        par.assign(n + 1, 0);
        for (int i = 0; i <= n; i++) par[i] = i;

        int m; cin >> m;
        for (int i = 0; i < m; i++) {                   // 已建公路：成本視為 0
            int a, b; cin >> a >> b;
            int u = find_(a), v = find_(b);
            if (u != v) par[u] = v;
        }
        vector<pair<double, pair<int, int> > > e;
        for (int i = 1; i <= n; i++)
            for (int j = i + 1; j <= n; j++)
                e.push_back(make_pair(hypot(x[i] - x[j], y[i] - y[j]), make_pair(i, j)));
        sort(e.begin(), e.end());

        vector<pair<int, int> > added;
        for (size_t i = 0; i < e.size(); i++) {
            int a = find_(e[i].second.first), b = find_(e[i].second.second);
            if (a == b) continue;
            par[a] = b;
            added.push_back(e[i].second);               // 記下新建的邊
        }
        if (tc) cout << "\\n";
        if (added.empty()) cout << "No new highways need\\n";
        else for (size_t i = 0; i < added.size(); i++)
            cout << added[i].first << " " << added[i].second << "\\n";
    }
    return 0;
}`
},

10049: {
  q: "Self-describing Sequence：Golomb 序列 <code>f</code> 是唯一的非遞減正整數序列，滿足「<b>k 在序列中恰好出現 f(k) 次</b>」。開頭是 1, 2, 2, 3, 3, 4, 4, 4, …。給 n（可達 <b>2×10⁹</b>），求 <code>f(n)</code>。",
  h: "利用遞推 <code>f(n) = f(n − f(f(n−1))) + 1</code> 逐項產生太慢（n 到 2×10⁹）⇒ 改用<b>「每個值出現幾次」的分段累積</b>：<br>值 k 出現 <code>f(k)</code> 次，所以只要維護<b>前綴累積位置</b>：<br>・產生前若干項的 f（用遞推，只需算到 <code>√</code> 等級的規模）<br>・累積 <code>pos += f(k)</code>，當 <code>pos ≥ n</code> 時答案就是 k<br>因為 <code>f</code> 成長約 <code>n^0.618</code>（黃金比例的冪），<b>累積到 2×10⁹ 只需要約 200 萬項</b> ⇒ 完全可行。<br>一次建表、之後每筆詢問用<b>二分搜</b> O(log)。<br>驗算：<code>f(100) = 21</code>、<code>f(9999) = 356</code>、<code>f(123456) = 1684</code>、<code>f(10⁹) = 438744</code> ✓ 四組全中。",
  t: "① <b>不能逐項算到 n</b>（2×10⁹）——要利用「值 k 出現 f(k) 次」做分段累積。<br>② 建表規模：累積到 2×10⁹ 大約需要 200 萬項，陣列要開夠。<br>③ 累積位置會超過 int ⇒ 用 <code>long long</code>。<br>④ 遞推的初值是 <code>f(1) = 1, f(2) = 2</code>。<br>⑤ 查詢用<b>二分搜</b>（累積陣列遞增）。<br>⑥ <code>n = 0</code> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const int MX = 2200000;
    vector<int> f(MX + 2);
    vector<ll> pos(MX + 2);                             // pos[k] = 值 k 的最後一個位置
    f[1] = 1; f[2] = 2;
    pos[1] = 1; pos[2] = 3;                             // 1 出現 1 次、2 出現 2 次
    int top = 2;
    while (top < MX && pos[top] < 2200000000LL) {
        top++;
        f[top] = f[top - f[f[top - 1]]] + 1;            // Golomb 遞推
        pos[top] = pos[top - 1] + f[top];               // 值 top 出現 f[top] 次
    }

    ll n;
    while (cin >> n && n) {
        int lo = 1, hi = top;
        while (lo < hi) {                               // 二分找第一個 pos >= n
            int mid = (lo + hi) / 2;
            if (pos[mid] >= n) hi = mid; else lo = mid + 1;
        }
        cout << lo << "\\n";
    }
    return 0;
}`
},

11228: {
  q: "Transportation system：n 個城市要全部連通。任兩城市間可以建<b>公路</b>（距離 ≤ R）或<b>鐵路</b>（距離 &gt; R）。求連通後形成幾個「州」（公路連通塊），以及公路總長與鐵路總長。",
  h: "先跑一次 <b>Kruskal 求 MST</b>，但把 MST 的邊<b>依長度分成兩類</b>：<br>・<code>長度 ≤ R</code> ⇒ 算進<b>公路</b>總長<br>・<code>長度 &gt; R</code> ⇒ 算進<b>鐵路</b>總長<br><b>州的數量</b> = 只用公路（長度 ≤ R 的邊）時的<b>連通塊數</b> = <code>n − (MST 中公路邊的條數)</code>。<br>直覺：MST 中每條公路邊都把兩個州合併一次，所以州數 = n − 公路邊數。<br>複雜度 O(n² log n)（要建所有邊）。<br>驗算樣例三：<b>2 個州、公路 24、鐵路 28</b> ✓。",
  t: "① <b>州數 = n − MST 中公路邊的條數</b>——不必另外跑一次連通塊計算。<br>② 公路與鐵路的分界是<b>距離 ≤ R</b>（含等號）。<br>③ 長度要<b>四捨五入</b>嗎？樣例的 24、28 看起來是整數 ⇒ 輸出時 <code>llround</code>。<br>④ n ≤ 1000 ⇒ 邊數 50 萬，排序可行。<br>⑤ 輸出格式 <code>Case #k: 州數 公路長 鐵路長</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

vector<int> par;
int find_(int x) { while (par[x] != x) x = par[x] = par[par[x]]; return x; }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int tc = 1; tc <= T; tc++) {
        int n; double R;
        cin >> n >> R;
        vector<double> x(n), y(n);
        for (int i = 0; i < n; i++) cin >> x[i] >> y[i];

        vector<pair<double, pair<int, int> > > e;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                e.push_back(make_pair(hypot(x[i] - x[j], y[i] - y[j]), make_pair(i, j)));
        sort(e.begin(), e.end());

        par.assign(n, 0);
        for (int i = 0; i < n; i++) par[i] = i;
        double road = 0, rail = 0;
        int roadEdges = 0;
        for (size_t i = 0; i < e.size(); i++) {
            int a = find_(e[i].second.first), b = find_(e[i].second.second);
            if (a == b) continue;
            par[a] = b;
            if (e[i].first <= R) { road += e[i].first; roadEdges++; }   // 公路
            else rail += e[i].first;                                    // 鐵路
        }
        cout << "Case #" << tc << ": " << n - roadEdges << " "
             << (ll)llround(road) << " " << (ll)llround(rail) << "\\n";
    }
    return 0;
}`
},

10158: {
  q: "War：n 個人之間有「朋友」與「敵人」關係，且<b>敵人的敵人是朋友</b>。支援四種操作：設為朋友／設為敵人／查詢是否朋友／查詢是否敵人。<b>矛盾的設定要回報</b>。",
  h: "<b>帶權並查集（或稱「擴展域並查集」）</b>的經典題。<br>最好寫的做法是<b>把每個人拆成兩個節點</b>：<code>i</code>（本人）與 <code>i + n</code>（他的敵對陣營）。<br>・<b>設為朋友</b>：合併 <code>(i, j)</code> 與 <code>(i+n, j+n)</code><br>・<b>設為敵人</b>：合併 <code>(i, j+n)</code> 與 <code>(i+n, j)</code><br>・<b>查詢朋友</b>：<code>find(i) == find(j)</code><br>・<b>查詢敵人</b>：<code>find(i) == find(j+n)</code><br><b>矛盾判定</b>：設為朋友前先檢查兩人是否已是敵人（反之亦然），是則回報矛盾且<b>不執行</b>該操作。<br>複雜度幾乎 O(1) 每次操作。",
  t: "① <b>拆成兩倍節點</b>是最不易寫錯的作法（比帶權並查集直觀）。<br>② 矛盾時要<b>回報且不執行</b>，不能照做。<br>③ 「敵人的敵人是朋友」由這個模型<b>自動滿足</b>——這正是拆點法的優雅之處。<br>④ 查詢的輸出是 <code>0</code>／<code>1</code>，矛盾的輸出是 <code>-1</code>。<br>⑤ 以 <code>0 0 0</code> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

vector<int> par;
int find_(int x) { while (par[x] != x) x = par[x] = par[par[x]]; return x; }
void uni(int a, int b) { a = find_(a); b = find_(b); if (a != b) par[a] = b; }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n) {
        par.assign(2 * n, 0);                           // i = 本人，i+n = 敵對陣營
        for (int i = 0; i < 2 * n; i++) par[i] = i;

        int c, x, y;
        while (cin >> c >> x >> y && (c || x || y)) {
            if (c == 1) {                               // 設為朋友
                if (find_(x) == find_(y + n)) { cout << "-1\\n"; continue; }
                uni(x, y); uni(x + n, y + n);
            } else if (c == 2) {                        // 設為敵人
                if (find_(x) == find_(y)) { cout << "-1\\n"; continue; }
                uni(x, y + n); uni(x + n, y);
            } else if (c == 3) {                        // 查詢是否朋友
                cout << (find_(x) == find_(y) ? 1 : 0) << "\\n";
            } else {                                    // 查詢是否敵人
                cout << (find_(x) == find_(y + n) ? 1 : 0) << "\\n";
            }
        }
    }
    return 0;
}`
}
};

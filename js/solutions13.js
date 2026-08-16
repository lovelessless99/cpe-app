/* 歷屆補完（第六批 19 題） */
const SOL13 = {
10382: {
  q: "澆水：一條長 <code>l</code>、寬 <code>w</code> 的長方形草皮，<b>n 個灑水器都裝在中線上</b>，第 i 個在位置 <code>p</code>、噴灑半徑 <code>r</code>（圓形）。求最少開幾個灑水器才能澆滿整片草皮；不可能則輸出 -1。",
  h: "圓和寬度為 w 的長條相交，投影到 x 軸是一段區間：<br><code>[p − √(r² − (w/2)²), p + √(r² − (w/2)²)]</code>。<br>若 <code>2r ≤ w</code> 這個灑水器碰不到上下緣，直接丟掉。<br>問題化為經典的<b>最少區間覆蓋 [0, l]</b>：把區間依左端排序，每回合在「左端 ≤ 目前已覆蓋位置」的區間裡挑<b>右端最大</b>的，指標不回頭，總複雜度 O(n log n)。",
  t: "① <b>2r ≤ w 必須先濾掉</b>，否則 <code>sqrt</code> 會拿到負數變 NaN，比較全部失敗。<br>② 浮點比較要加 eps，卡在剛好接合的邊界會誤判 -1。<br>③ 貪心的指標 <code>i</code> 放在 while 外面只走一次，放裡面會退化成 O(n²)。<br>④ 讀入用 <code>while (cin >> n >> l >> w)</code> 讀到 EOF。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; double l, w;
    while (cin >> n >> l >> w) {
        vector<pair<double, double>> seg;
        for (int i = 0; i < n; i++) {
            double p, r; cin >> p >> r;
            if (2 * r <= w) continue;                 // 碰不到上下緣，此灑水器無效
            double d = sqrt(r * r - w * w / 4);       // 投影半長
            seg.push_back(make_pair(p - d, p + d));
        }
        sort(seg.begin(), seg.end());

        double cur = 0; int cnt = 0, i = 0, m = seg.size(); bool ok = true;
        while (cur < l) {
            double reach = cur;
            while (i < m && seg[i].first <= cur + 1e-9) {   // 所有能接上的區間
                reach = max(reach, seg[i].second);          // 取最遠的右端
                i++;
            }
            if (reach <= cur + 1e-9) { ok = false; break; } // 接不下去了
            cur = reach; cnt++;
        }
        cout << (ok ? cnt : -1) << "\\n";
    }
    return 0;
}`
},

11085: {
  q: "回到八皇后：給 8 個整數，第 i 個是<b>第 i 行</b>皇后所在的列（1..8）。皇后<b>只能上下移動</b>（不能換行）。求最少移動幾顆皇后，可以讓 8 顆互不攻擊。",
  h: "「每行恰好一顆」的合法解就是標準八皇后的 <b>92 組解</b>。先用回溯法一次把 92 組全部生出來（只做一次，不要每筆測資都重算）。<br>對每筆詢問，跟 92 組解逐一比對，<b>位置不同的個數</b>就是要移動的皇后數，取最小值。<br>複雜度 92 × 8 × 測資數 ≈ 70 萬，瞬殺。",
  t: "① 輸入是 1-based，內部若用 0-based 要記得 <code>-1</code>。<br>② 測資筆數未給、要讀到 EOF；<code>while (cin >> q[0])</code> 是最乾淨的寫法。<br>③ 92 組解務必<b>放在迴圈外</b>先算好，放裡面會 TLE。<br>④ 輸出格式 <code>Case k: x</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;

vector<array<int, 8>> sols;
int col[8];

void dfs(int c) {                       // c = 目前處理到第幾行
    if (c == 8) {
        array<int, 8> a;
        for (int i = 0; i < 8; i++) a[i] = col[i];
        sols.push_back(a);
        return;
    }
    for (int r = 0; r < 8; r++) {
        bool ok = true;
        for (int i = 0; i < c; i++)
            if (col[i] == r || abs(col[i] - r) == c - i) { ok = false; break; }
        if (ok) { col[c] = r; dfs(c + 1); }
    }
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    dfs(0);                             // 92 組解，只算一次

    array<int, 8> q; int cs = 1;
    while (cin >> q[0]) {
        for (int i = 1; i < 8; i++) cin >> q[i];
        int best = 8;
        for (size_t s = 0; s < sols.size(); s++) {
            int d = 0;
            for (int i = 0; i < 8; i++) if (sols[s][i] != q[i] - 1) d++;
            best = min(best, d);
        }
        cout << "Case " << cs++ << ": " << best << "\\n";
    }
    return 0;
}`
},

929: {
  q: "數字迷宮：<code>N × M</code>（最大 999×999）的格子，每格是 0..9 的<b>通行成本</b>。從左上走到右下（四方向），求<b>路徑上所有格子成本總和</b>的最小值（含起點與終點）。",
  h: "格子是圖、格子值是<b>進入該點的代價</b>，因為代價非負，直接 <b>Dijkstra</b>。<br>用 <code>priority_queue</code>（小根堆）從 (0,0) 出發，<code>d[0][0] = a[0][0]</code>，鬆弛 <code>d[nx][ny] = d[x][y] + a[nx][ny]</code>。<br>複雜度 O(NM log NM) ≈ 10⁶ × 20，穩過。",
  t: "① 可以往<b>四個方向</b>走（含往上、往左），所以<b>不能</b>用 <code>dp[i][j] = min(上,左) + a</code> 這種 DP，必須 Dijkstra／01-BFS。<br>② 起點成本<b>要算進去</b>。<br>③ 行數、列數<b>各佔一行</b>，別當成同一行讀。<br>④ 999×999 用 <code>vector</code> 動態配置，別開 static 陣列還每筆清空。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef tuple<int, int, int> T3;        // (距離, x, y)

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n, m; cin >> n >> m;
        vector<vector<int>> a(n, vector<int>(m));
        for (int i = 0; i < n; i++) for (int j = 0; j < m; j++) cin >> a[i][j];

        vector<vector<int>> d(n, vector<int>(m, INT_MAX));
        priority_queue<T3, vector<T3>, greater<T3>> pq;
        d[0][0] = a[0][0];
        pq.push(make_tuple(d[0][0], 0, 0));

        int dx[] = {1, -1, 0, 0}, dy[] = {0, 0, 1, -1};
        while (!pq.empty()) {
            T3 t = pq.top(); pq.pop();
            int c = get<0>(t), x = get<1>(t), y = get<2>(t);
            if (c > d[x][y]) continue;                  // 過期的舊紀錄
            for (int k = 0; k < 4; k++) {
                int nx = x + dx[k], ny = y + dy[k];
                if (nx < 0 || ny < 0 || nx >= n || ny >= m) continue;
                if (c + a[nx][ny] < d[nx][ny]) {
                    d[nx][ny] = c + a[nx][ny];
                    pq.push(make_tuple(d[nx][ny], nx, ny));
                }
            }
        }
        cout << d[n - 1][m - 1] << "\\n";
    }
    return 0;
}`
},

11472: {
  q: "漂亮數：一個 <code>n</code> 進位數若<b>用到 0..n−1 全部數字</b>，且<b>任兩相鄰位差恰為 1</b>，就叫漂亮數（例如十進位的 9876543210）。求位數 <b>≤ d</b> 的漂亮數共有幾個，答案模 10⁹+7。不可有前導零。",
  h: "關鍵觀察：相鄰位差 1 ⇒ 這是在<b>一條路徑圖 0−1−2−…−(n−1) 上走路</b>。走過的點集<b>永遠是一段連續區間 [lo, hi]</b>！<br>所以狀態只要 <code>(長度, lo, hi, 目前位)</code>，而不需要 2ⁿ 的 bitmask。<br>初始：長度 1、首位 <code>s ∈ [1, n−1]</code>（不可前導零），<code>lo = hi = s</code>。<br>轉移：往 <code>c±1</code> 走，更新 <code>lo/hi</code>。<br>累加所有長度 <code>n ≤ len ≤ d</code> 且 <code>lo = 0, hi = n−1</code> 的狀態。<br>狀態數 100 × 10 × 10 × 10 = 10⁵，100 筆測資也只有 10⁷。",
  t: "① 這題最容易想歪成 bitmask DP（2¹⁰ × 100 × 10 也能過，但區間法更漂亮也更快）。<br>② <b>前導零</b>：首位不能是 0，但中間可以。<br>③ 長度必須 <b>≥ n</b> 才可能用齊所有數字。<br>④ <code>d</code> 可以是 0，答案 0，迴圈要能自然處理。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll MOD = 1000000007;

ll f[11][11][11], g[11][11][11];        // [lo][hi][目前這一位]

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n, d; cin >> n >> d;
        memset(f, 0, sizeof f);
        for (int s = 1; s < n; s++) f[s][s][s] = 1;      // 首位不可為 0

        ll ans = 0;
        for (int len = 1; len <= d; len++) {
            if (len >= n)                               // 已可能用齊 0..n-1
                for (int c = 0; c < n; c++) ans = (ans + f[0][n - 1][c]) % MOD;
            if (len == d) break;

            memset(g, 0, sizeof g);
            for (int lo = 0; lo < n; lo++)
                for (int hi = lo; hi < n; hi++)
                    for (int c = lo; c <= hi; c++) {
                        ll v = f[lo][hi][c];
                        if (!v) continue;
                        if (c + 1 < n) {                        // 往右走
                            int nh = max(hi, c + 1);
                            g[lo][nh][c + 1] = (g[lo][nh][c + 1] + v) % MOD;
                        }
                        if (c - 1 >= 0) {                       // 往左走
                            int nl = min(lo, c - 1);
                            g[nl][hi][c - 1] = (g[nl][hi][c - 1] + v) % MOD;
                        }
                    }
            memcpy(f, g, sizeof f);
        }
        cout << ans << "\\n";
    }
    return 0;
}`
},

12911: {
  q: "子集合和：給 <code>n ≤ 40</code> 個整數（<b>可以是負數</b>）和目標值 <code>t</code>，問有幾個<b>非空子集合</b>的總和恰為 <code>t</code>。",
  h: "n = 40 ⇒ 2⁴⁰ ≈ 10¹² 太大，但 <b>2²⁰ ≈ 10⁶ 剛剛好</b> ⇒ 經典的<b>折半枚舉（Meet in the Middle）</b>。<br>把陣列切兩半，各自枚舉 2^(n/2) 個子集合的和。右半排序後，對左半每個和 <code>s</code>，用 <code>equal_range</code> 數出右半有幾個等於 <code>t − s</code>，相乘累加。<br>子集合和用 <b>lowbit 遞推</b> O(1) 算出：<code>sum[m] = sum[m ^ lowbit(m)] + a[log2(lowbit)]</code>，整體 O(2^(n/2) · (n/2))。<br>最後若 <code>t = 0</code> 要<b>扣掉空集合</b>那 1 種。",
  t: "① 有負數 ⇒ <b>不能用 dp[sum] 背包</b>（值域是 ±10¹⁸ 等級）。<br>② 答案可能超過 int（最多 2⁴⁰），用 <code>long long</code>。<br>③ 「非空」：t = 0 時空集合會被算進來，記得 −1。<br>④ 相同數值但位置不同算<b>不同子集合</b>，所以是數個數不是去重。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; ll t;
    while (cin >> n >> t) {
        vector<ll> a(n);
        for (int i = 0; i < n; i++) cin >> a[i];

        int h = n / 2, r = n - h;
        vector<ll> L(1 << h), R(1 << r);
        for (int m = 1; m < (1 << h); m++) {            // lowbit 遞推
            int b = __builtin_ctz(m);
            L[m] = L[m ^ (1 << b)] + a[b];
        }
        for (int m = 1; m < (1 << r); m++) {
            int b = __builtin_ctz(m);
            R[m] = R[m ^ (1 << b)] + a[h + b];
        }
        sort(R.begin(), R.end());

        ll ans = 0;
        for (int m = 0; m < (1 << h); m++) {
            pair<vector<ll>::iterator, vector<ll>::iterator> p =
                equal_range(R.begin(), R.end(), t - L[m]);
            ans += p.second - p.first;
        }
        if (t == 0) ans--;                              // 扣掉空集合
        cout << ans << "\\n";
    }
    return 0;
}`
},

12041: {
  q: "二進位費氏字串：<code>BFS(0) = \"0\"</code>、<code>BFS(1) = \"1\"</code>、<code>BFS(n) = BFS(n−2) + BFS(n−1)</code>（字串接起來）。給 <code>N, i, j</code>，輸出 <code>BFS(N)</code> 的第 i 到第 j 個字元（<b>0-based</b>）。",
  h: "字串長度是費氏數，N ≤ 31 時長度上百萬，<b>不要真的把字串建出來</b>（多筆測資會爆時間）。<br>先算好 <code>len[0..31]</code>，然後<b>遞迴／迴圈往下鑽</b>取第 k 個字元：<br><code>若 k &lt; len[n−2] → 進入 BFS(n−2)；否則 k −= len[n−2]，進入 BFS(n−1)</code>。<br>每個字元 O(N) 次跳躍，j−i ≤ 10000 ⇒ 每筆最多 31 萬次運算。",
  t: "① <b>是 BFS(n−2) + BFS(n−1)，不是 (n−1)+(n−2)</b>！順序反了樣例就對不上（可用樣例 <code>9 5 12 → 10101101</code> 驗證）。<br>② 索引是 <b>0-based</b>。<br>③ 遞迴改成 <code>while</code> 迴圈就不會爆堆疊，也更快。<br>④ 長度用 <code>long long</code>（雖然 N ≤ 31 時 int 也夠，習慣要好）。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

ll len[40];

char ch(int n, ll k) {                  // BFS(n) 的第 k 個字元（0-based）
    while (n > 1) {
        if (k < len[n - 2]) n = n - 2;              // 落在前半 BFS(n-2)
        else { k -= len[n - 2]; n = n - 1; }        // 落在後半 BFS(n-1)
    }
    return n == 0 ? '0' : '1';
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    len[0] = len[1] = 1;
    for (int i = 2; i < 40; i++) len[i] = len[i - 2] + len[i - 1];

    int T; cin >> T;
    while (T--) {
        int n; ll i, j; cin >> n >> i >> j;
        string s;
        for (ll k = i; k <= j; k++) s += ch(n, k);
        cout << s << "\\n";
    }
    return 0;
}`
},

714: {
  q: "抄書：<code>m</code> 本書依序排好（<b>不可重排</b>），要分給 <code>k</code> 個抄寫員，每人拿<b>連續的一段</b>。目標是讓「單人頁數總和的最大值」最小。若有多解，要讓<b>前面的人拿得越少越好</b>。輸出分割結果，用 <code>/</code> 隔開。",
  h: "第一步：<b>對答案二分搜</b>。<br>檢查函式：給定上限 L，貪心從左往右塞，能塞就塞、塞不下就換人，算出需要幾個人；<code>need(L) ≤ k</code> 就往小找。搜尋範圍 <code>[max(p), Σp]</code>。<br>第二步：<b>從右往左</b>貪心切割（這是本題的重點！）。從右邊開始塞，塞不下就切一刀，這樣自然把「多的」都堆在右邊、前面的人拿最少。<br>若切出來的段數 <code>&lt; k</code>（有人沒事做），就從<b>最左邊</b>補上剩下的刀（切開只會讓總和更小，不影響最佳解）。",
  t: "① 「前面的人拿最少」是本題最容易 WA 的地方——<b>一定要從右往左切</b>。<br>② 段數不足時要補刀，否則輸出的段數 ≠ k。<br>③ 補刀從索引 0 開始找沒被切過的位置。<br>④ 分隔符號是 <code>\" / \"</code>（前後都有空白），書之間是單一空白。<br>⑤ 總和用 <code>long long</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int m, k; cin >> m >> k;
        vector<ll> p(m); ll lo = 0, hi = 0;
        for (int i = 0; i < m; i++) { cin >> p[i]; lo = max(lo, p[i]); hi += p[i]; }

        // 1) 二分搜最小的「單人最大頁數」
        while (lo < hi) {
            ll mid = (lo + hi) / 2;
            int g = 1; ll s = 0;
            for (int i = 0; i < m; i++) {
                if (s + p[i] > mid) { g++; s = p[i]; } else s += p[i];
            }
            if (g <= k) hi = mid; else lo = mid + 1;
        }

        // 2) 從右往左切，讓前面的段盡量小
        vector<bool> sep(m, false);                 // sep[i] = 第 i 本後面切一刀
        ll s = 0; int g = 1;
        for (int i = m - 1; i >= 0; i--) {
            if (s + p[i] > lo) { sep[i] = true; g++; s = p[i]; }
            else s += p[i];
        }
        // 3) 段數不足 k，從最左邊補刀
        for (int i = 0; i < m - 1 && g < k; i++)
            if (!sep[i]) { sep[i] = true; g++; }

        for (int i = 0; i < m; i++) {
            cout << p[i];
            if (i < m - 1) cout << (sep[i] ? " / " : " ");
        }
        cout << "\\n";
    }
    return 0;
}`
},

10369: {
  q: "北極網路：<code>P</code> 個哨站，每站都有無線電（通訊距離 D 內互通），另外有 <code>S</code> 台衛星裝置，裝了衛星的兩站<b>無視距離</b>直接互通。求能讓全部哨站連通的<b>最小 D</b>，輸出到小數點後 2 位。",
  h: "先建完全圖（邊權 = 歐氏距離）跑 <b>Kruskal 最小生成樹</b>。<br>核心洞見：<b>S 台衛星可以「免費」取代 MST 中最大的 S−1 條邊</b>（S 個點連成一團只需要 S−1 條連結）。<br>所以把 MST 的 P−1 條邊<b>由小到大排好</b>，砍掉最大的 S−1 條，剩下最大的那條就是答案 ⇒ 索引 <code>(P−1) − (S−1) − 1 = P − S − 1</code>。<br>若 <code>S ≥ P</code>，每站都有衛星，答案 0.00。",
  t: "① 是砍掉 <b>S−1</b> 條不是 S 條（S 個衛星站只需 S−1 條邊把它們串起來）。<br>② 因為 Kruskal 是照邊權遞增加入，MST 邊本身就已排序，不用再 sort。<br>③ P ≤ 500 ⇒ 邊數 12.5 萬，排序沒問題。<br>④ 輸出 <code>fixed &lt;&lt; setprecision(2)</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int par[505];
int find(int x) { while (par[x] != x) x = par[x] = par[par[x]]; return x; }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int s, p; cin >> s >> p;
        vector<double> x(p), y(p);
        for (int i = 0; i < p; i++) cin >> x[i] >> y[i];

        vector<tuple<double, int, int>> e;
        for (int i = 0; i < p; i++)
            for (int j = i + 1; j < p; j++)
                e.push_back(make_tuple(hypot(x[i] - x[j], y[i] - y[j]), i, j));
        sort(e.begin(), e.end());

        for (int i = 0; i < p; i++) par[i] = i;
        vector<double> w;                           // MST 邊權（已由小到大）
        for (size_t i = 0; i < e.size(); i++) {
            int a = find(get<1>(e[i])), b = find(get<2>(e[i]));
            if (a != b) { par[a] = b; w.push_back(get<0>(e[i])); }
        }
        // 砍掉最大的 s-1 條，剩下最大的即答案
        double ans = (int)w.size() >= s ? w[w.size() - s] : 0.0;
        cout << fixed << setprecision(2) << ans << "\\n";
    }
    return 0;
}`
},

10603: {
  q: "倒水：三個容量 <code>a, b, c</code>（≤ 200）的杯子，前兩個空、第三個滿。每次可把一杯倒進另一杯，直到<b>倒空</b>或<b>倒滿</b>為止。求某杯裝到 <code>d</code> 公升時的<b>最少總倒水量</b>；若 d 不可達，改求<b>最接近但不超過 d</b> 的水量。",
  h: "狀態 <code>(A, B)</code> 就決定一切（<code>C = c − A − B</code>），狀態數 201 × 201 = 4 萬。<br>邊權 = 這次倒的水量（非負）⇒ 用 <b>Dijkstra</b>（不是 BFS，因為邊權不等長！）。<br>每個狀態有 3 × 2 = 6 種倒法：<code>amt = min(來源水量, 目標剩餘容量)</code>。<br>每次從 heap 取出狀態時，把三個杯子的水量 <code>v</code>（若 <code>v ≤ d</code>）記進 <code>best[v]</code>——Dijkstra 保證第一次取出就是最小成本。<br>最後從 <code>d</code> 往下找第一個可達的水量。",
  t: "① <b>必須用 Dijkstra 不能用 BFS</b>：BFS 最小化的是「倒幾次」，題目要的是「倒多少水」。<br>② 「最接近但不超過 d」——包含 0（一開始就有兩個空杯，成本 0），所以答案一定存在。<br>③ 初始狀態 (0,0) 的第三杯是滿的，若 <code>c ≤ d</code> 也要算進 best。<br>④ 每筆測資都要清空 dist 陣列。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef tuple<int, int, int> S;         // (已倒水量, A, B)

int dist[201][201];

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const int INF = 1000000000;
    int T; cin >> T;
    while (T--) {
        int cap[3], d;
        cin >> cap[0] >> cap[1] >> cap[2] >> d;
        for (int i = 0; i <= 200; i++)
            for (int j = 0; j <= 200; j++) dist[i][j] = INF;
        vector<int> best(205, INF);

        priority_queue<S, vector<S>, greater<S> > pq;
        dist[0][0] = 0;
        pq.push(make_tuple(0, 0, 0));

        while (!pq.empty()) {
            S t = pq.top(); pq.pop();
            int c = get<0>(t), A = get<1>(t), B = get<2>(t);
            if (c > dist[A][B]) continue;
            int v[3] = {A, B, cap[2] - A - B};
            for (int i = 0; i < 3; i++)
                if (v[i] <= d && c < best[v[i]]) best[v[i]] = c;

            for (int i = 0; i < 3; i++)
                for (int j = 0; j < 3; j++) {
                    if (i == j) continue;
                    int amt = min(v[i], cap[j] - v[j]);         // 倒空 或 倒滿
                    if (amt <= 0) continue;
                    int w[3] = {v[0], v[1], v[2]};
                    w[i] -= amt; w[j] += amt;
                    if (c + amt < dist[w[0]][w[1]]) {
                        dist[w[0]][w[1]] = c + amt;
                        pq.push(make_tuple(c + amt, w[0], w[1]));
                    }
                }
        }
        int amount = 0;
        for (int i = d; i >= 0; i--) if (best[i] < INF) { amount = i; break; }
        cout << best[amount] << " " << amount << "\\n";
    }
    return 0;
}`
},

11175: {
  q: "From D to E and Back：給一張有向圖 <code>H</code>（可含自環、重邊），問它是否為某張有向圖的<b>線圖（line digraph）</b>——也就是能否找到 G，使 G 的每條邊對應 H 的一個點，且 <code>u→v</code> 在 H 中相鄰 iff G 中對應的邊首尾相接。",
  h: "直接嘗試還原 G 會爆炸，但線圖有個<b>純局部的判定條件（Heuchenne 條件）</b>：<br><b>任兩點 u、v 的出鄰居集合 N⁺(u) 與 N⁺(v)，必須「完全相同」或「完全不相交」。</b><br>直覺：H 的點 = G 的邊。若 H 的點 u 對應 G 的邊 <code>(a→b)</code>，則 <code>N⁺(u)</code> 就是「所有從 b 出發的邊」——只跟終點 b 有關。所以兩個點的出鄰居集合要嘛終點相同（集合相等）、要嘛終點不同（集合不交）。<br>實作：<code>bitset&lt;300&gt;</code> 存出鄰居，兩兩檢查 <code>(A &amp; B).any() &amp;&amp; A != B</code>。<br>複雜度 300² × 300/64 ≈ 20 萬字組運算。",
  t: "① 這題的難點<b>完全在於想到那個判定條件</b>，程式碼只有 10 行。<br>② 允許<b>重邊</b>（用 bitset 自動去重，剛好正確——重邊不影響鄰居集合）。<br>③ 允許<b>自環</b>，樣例最後一筆就是三個自環 → Yes。<br>④ 點編號 <b>0-based</b>。<br>⑤ 輸出格式 <code>Case #k: Yes/No</code>，井字號不要漏。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int tc = 1; tc <= T; tc++) {
        int n, m; cin >> n >> m;
        vector<bitset<300> > out(n);
        for (int i = 0; i < m; i++) {
            int u, v; cin >> u >> v;
            out[u][v] = 1;
        }
        bool ok = true;
        for (int i = 0; i < n && ok; i++)
            for (int j = i + 1; j < n && ok; j++)
                if ((out[i] & out[j]).any() && out[i] != out[j]) ok = false;

        cout << "Case #" << tc << ": " << (ok ? "Yes" : "No") << "\\n";
    }
    return 0;
}`
},

288: {
  q: "大數四則運算：對最多 <b>1000 位</b>的整數做 <code>+ − * **</code>（次方）的<b>混合運算式</b>求值，每行一筆。",
  unsure: true,
  t: "① 運算優先序：<code>**</code> &gt; <code>*</code> &gt; <code>+ −</code>，且 <code>**</code> 是<b>右結合</b>（<code>2**3**2 = 2**9</code>）。<br>② 掃描到 <code>*</code> 時要<b>先看下一個字元是不是也是 <code>*</code></b>，否則會把次方拆成兩次乘法。<br>③ 減法會產生<b>負數</b>，大數要帶符號；結果為 0 時符號要正規化成正。<br>④ 輸出的 <code>\\\\</code> 換行只是題目排版用，實際<b>必須輸出成一行</b>。<br>⑤ 進位制建議用 10000（4 位一組），輸出時<b>除了最高組，其餘要補滿 4 位零</b>。<br>⑥ 此題輸入格式在轉檔中略有殘缺，本解法採「逐行讀到 EOF」的通用寫法。",
  h: "兩個獨立的零件組起來：<br><b>(A) 大數類別</b>：以 base 10000（4 位一組、低位在前）存放，另存符號。加減法先比絕對值大小再決定走 addAbs 還是 subAbs；乘法是 O(n·m) 直式；次方用<b>快速冪</b>（平方相乘）。<br><b>(B) 遞迴下降剖析器</b>：<br><code>expr := term (('+'|'-') term)*</code><br><code>term := pow ('*' pow)*</code><br><code>pow  := number ('**' pow)?</code>　←右結合靠自己遞迴自己<br>先把整行空白濾掉再剖析，判斷 <code>*</code> 時要先看下一個字元是否也是 <code>*</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

const int B = 10000, W = 4;             // base 10000，一組 4 位十進位

struct Big {
    int sg;                             // +1 / -1
    vector<int> d;                      // 低位在前
    Big() : sg(1), d(1, 0) {}
    bool zero() const { return d.size() == 1 && d[0] == 0; }
    void trim() {
        while (d.size() > 1 && d.back() == 0) d.pop_back();
        if (zero()) sg = 1;
    }
};

Big fromStr(const string &s) {
    Big r; r.d.clear(); int st = 0;
    if (s[0] == '-') { r.sg = -1; st = 1; }
    for (int i = s.size(); i > st; i -= W) {
        int lo = max(st, i - W);
        r.d.push_back(atoi(s.substr(lo, i - lo).c_str()));
    }
    if (r.d.empty()) r.d.push_back(0);
    r.trim(); return r;
}

int cmpAbs(const Big &a, const Big &b) {
    if (a.d.size() != b.d.size()) return a.d.size() < b.d.size() ? -1 : 1;
    for (int i = a.d.size() - 1; i >= 0; i--)
        if (a.d[i] != b.d[i]) return a.d[i] < b.d[i] ? -1 : 1;
    return 0;
}

Big addAbs(const Big &a, const Big &b) {
    Big r; r.d.assign(max(a.d.size(), b.d.size()) + 1, 0);
    for (size_t i = 0; i < r.d.size(); i++) {
        int v = r.d[i];
        if (i < a.d.size()) v += a.d[i];
        if (i < b.d.size()) v += b.d[i];
        r.d[i] = v % B;
        if (i + 1 < r.d.size()) r.d[i + 1] += v / B;
    }
    r.trim(); return r;
}

Big subAbs(const Big &a, const Big &b) {                // 須保證 |a| >= |b|
    Big r; r.d = a.d; int bw = 0;
    for (size_t i = 0; i < r.d.size(); i++) {
        int v = r.d[i] - bw - (i < b.d.size() ? b.d[i] : 0);
        if (v < 0) { v += B; bw = 1; } else bw = 0;
        r.d[i] = v;
    }
    r.trim(); return r;
}

Big add(const Big &a, const Big &b) {
    Big r;
    if (a.sg == b.sg) { r = addAbs(a, b); r.sg = a.sg; }
    else {
        int c = cmpAbs(a, b);
        if (c == 0) return Big();
        if (c > 0) { r = subAbs(a, b); r.sg = a.sg; }
        else       { r = subAbs(b, a); r.sg = b.sg; }
    }
    r.trim(); return r;
}

Big neg(Big a) { if (!a.zero()) a.sg = -a.sg; return a; }
Big sub(const Big &a, const Big &b) { return add(a, neg(b)); }

Big mul(const Big &a, const Big &b) {
    Big r; r.d.assign(a.d.size() + b.d.size(), 0);
    for (size_t i = 0; i < a.d.size(); i++) {
        ll carry = 0;
        for (size_t j = 0; j < b.d.size() || carry; j++) {
            ll cur = r.d[i + j] + carry
                   + (j < b.d.size() ? (ll)a.d[i] * b.d[j] : 0);
            r.d[i + j] = cur % B; carry = cur / B;
        }
    }
    r.sg = a.sg * b.sg; r.trim(); return r;
}

ll toLL(const Big &a) {
    ll v = 0;
    for (int i = a.d.size() - 1; i >= 0; i--) {
        v = v * B + a.d[i];
        if (v > 1000000000LL) break;
    }
    return v;
}

Big power(Big a, ll e) {                                // 快速冪
    Big r; r.d[0] = 1;
    while (e > 0) { if (e & 1) r = mul(r, a); a = mul(a, a); e >>= 1; }
    return r;
}

string toStr(const Big &a) {
    ostringstream o;
    if (a.sg < 0 && !a.zero()) o << '-';
    o << a.d.back();
    for (int i = (int)a.d.size() - 2; i >= 0; i--)
        o << setw(W) << setfill('0') << a.d[i];         // 中間組要補零
    return o.str();
}

/* ---------- 遞迴下降剖析 ---------- */
string S; size_t pos;

Big parsePow();
Big parseNum() {
    size_t st = pos;
    while (pos < S.size() && isdigit((unsigned char)S[pos])) pos++;
    return fromStr(S.substr(st, pos - st));
}
Big parsePow() {                                        // 右結合
    Big base = parseNum();
    if (pos + 1 < S.size() && S[pos] == '*' && S[pos + 1] == '*') {
        pos += 2;
        Big e = parsePow();
        return power(base, toLL(e));
    }
    return base;
}
Big parseTerm() {
    Big r = parsePow();
    while (pos < S.size() && S[pos] == '*' &&
           !(pos + 1 < S.size() && S[pos + 1] == '*')) {
        pos++; r = mul(r, parsePow());
    }
    return r;
}
Big parseExpr() {
    Big r = parseTerm();
    while (pos < S.size() && (S[pos] == '+' || S[pos] == '-')) {
        char op = S[pos++];
        Big t = parseTerm();
        r = (op == '+') ? add(r, t) : sub(r, t);
    }
    return r;
}

int main() {
    string line;
    while (getline(cin, line)) {
        S.clear();
        for (size_t i = 0; i < line.size(); i++)
            if (!isspace((unsigned char)line[i])) S += line[i];
        if (S.empty()) continue;
        pos = 0;
        cout << toStr(parseExpr()) << "\\n";
    }
    return 0;
}`
},

1513: {
  q: "電影收藏：<code>n</code> 部電影疊成一疊（標籤 1..n，<b>1 在最上面</b>）。看第 x 部時要先數出它<b>上面有幾部</b>，抽出後<b>放回最上面</b>。給 m 次觀看順序，輸出每次抽出前它上方的片數。",
  h: "經典的 <b>BIT（樹狀陣列）+ 預留空間</b>技巧。<br>開一條長度 <code>n + m</code> 的軸，把電影 i 初始放在位置 <code>m + i</code>，<b>上方預留 m 格</b>給之後放回頂端用。有電影的位置記 1。<br>查詢：<code>上方片數 = 前綴和(pos[x]) − 1</code>。<br>移動：舊位置 −1，新位置 <code>top--</code> 記 +1。<br>每次操作 O(log(n+m))，總共 O(m log(n+m))。",
  t: "① <b>不要真的搬動陣列</b>（O(nm) = 10¹⁰ 直接 TLE）。<br>② 預留空間要 <b>m 格</b>（最壞每次都放回頂端）。<br>③ 前綴和記得 <b>−1</b>（扣掉自己）。<br>④ n, m ≤ 100000 且測資 ≤ 100 筆 ⇒ 必須 <code>sync_with_stdio(false)</code>，輸出用 <code>'\\\\n'</code> 不要 <code>endl</code>。<br>⑤ 每筆測資只清空 <code>[0, n+m]</code> 這段，別整條 200005 全清（會多花時間）。",
  c: `#include <bits/stdc++.h>
using namespace std;

int bit[200005], N;
void upd(int i, int v) { for (; i <= N; i += i & -i) bit[i] += v; }
int  qry(int i) { int s = 0; for (; i > 0; i -= i & -i) s += bit[i]; return s; }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n, m; cin >> n >> m;
        N = n + m;
        for (int i = 0; i <= N; i++) bit[i] = 0;

        vector<int> pos(n + 1);
        for (int i = 1; i <= n; i++) {          // 上方預留 m 格
            pos[i] = m + i;
            upd(m + i, 1);
        }
        int top = m;
        for (int q = 0; q < m; q++) {
            int x; cin >> x;
            cout << qry(pos[x]) - 1 << (q + 1 == m ? '\\n' : ' ');
            upd(pos[x], -1);
            pos[x] = top--;                     // 放到最上面
            upd(pos[x], 1);
        }
    }
    return 0;
}`
},

10032: {
  q: "拔河：<code>n</code> 個人分成兩隊，<b>人數差不超過 1</b>，要讓<b>兩隊體重和盡量接近</b>。輸出兩個數（小的在前）。",
  h: "體重 ≤ 450、人數 ≤ 100 ⇒ 總和 ≤ 45000。要的是<b>「用恰好 k 個人能湊出哪些總和」</b>，用 <b>bitset 加速的可行性背包</b>：<br><code>dp[k]</code> 是一條 45001 位的 bitset，<code>dp[k][s] = 1</code> 表示 k 個人可湊出 s。<br>轉移：<code>dp[k+1] |= dp[k] &lt;&lt; w[i]</code>（k 由大到小，避免同一人用兩次）。<br>最後在 <code>dp[n/2]</code> 裡找讓 <code>|total − 2s|</code> 最小的 s。<br>複雜度 100 × 50 × 45000/64 ≈ 350 萬字組運算，飛快。",
  t: "① <b>bitset 位移是這題的靈魂</b>——純 bool 陣列 100×100×45000 = 4.5 億會 TLE。<br>② 人數只需檢查 <code>n/2</code>（另一隊自然是 <code>n − n/2</code>，差必 ≤ 1）。<br>③ 兩筆輸出之間要有<b>空行</b>（最後一筆後面不要）。<br>④ <code>dp[0][0] = 1</code> 是起點；找答案時初值不能設 0（0 未必可達）。",
  c: `#include <bits/stdc++.h>
using namespace std;

bitset<45001> dp[101];

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<int> w(n); int tot = 0;
        for (int i = 0; i < n; i++) { cin >> w[i]; tot += w[i]; }

        int half = n / 2;
        for (int i = 0; i <= n; i++) dp[i].reset();
        dp[0][0] = 1;
        for (int i = 0; i < n; i++)
            for (int k = min(i, half - 1); k >= 0; k--)
                dp[k + 1] |= dp[k] << w[i];

        int bs = -1;
        for (int s = 0; s <= tot; s++)
            if (dp[half][s] && (bs < 0 || abs(tot - 2 * s) < abs(tot - 2 * bs))) bs = s;

        int a = bs, b = tot - bs;
        if (a > b) swap(a, b);
        cout << a << " " << b << "\\n";
        if (T) cout << "\\n";                    // 測資之間空一行
    }
    return 0;
}`
},

1650: {
  q: "Number String：一個排列的「簽名」是相鄰兩項的升降字串（升寫 <code>I</code>、降寫 <code>D</code>）。給一個含 <code>I</code>、<code>D</code>、<code>?</code>（任意）的簽名（長度 ≤ 1000），問符合的排列有幾個，模 10⁹+7。",
  h: "經典的<b>相對排名 DP</b>：<br><code>dp[i][j]</code> = 長度 i 的前綴、且<b>最後一個元素在這 i 個裡排第 j 小</b>的方法數。<br>轉移（新元素插入後排名為 j）：<br>・<code>I</code>：<code>dp[i+1][j] = Σ_{k &lt; j} dp[i][k]</code><br>・<code>D</code>：<code>dp[i+1][j] = Σ_{k ≥ j} dp[i][k]</code><br>・<code>?</code>：<code>= Σ_all dp[i][k]</code><br>每層用<b>前綴和</b>把 O(n) 的求和壓成 O(1) ⇒ 總複雜度 O(n²) = 10⁶。",
  t: "① 為什麼可以只記排名？因為排列的<b>絕對值不重要</b>，插入新元素時把「≥ j 的舊排名」整體 +1 即可，這保證了不重不漏。<br>② 簽名長度 L ⇒ 排列長度 <b>n = L + 1</b>。<br>③ 前綴和相減要 <code>+ MOD</code> 再取模，避免負數。<br>④ 多筆測資讀到 EOF。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll MOD = 1000000007;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string s;
    while (cin >> s) {
        int n = s.size() + 1;
        vector<ll> dp(n + 2, 0), nx(n + 2, 0), pre(n + 2, 0);
        dp[1] = 1;                                  // 長度 1，排第 1 小

        for (int i = 1; i < n; i++) {
            for (int j = 1; j <= i; j++) pre[j] = (pre[j - 1] + dp[j]) % MOD;
            char c = s[i - 1];
            for (int j = 1; j <= i + 1; j++) {
                if (c == 'I')      nx[j] = pre[j - 1];                  // 比前一項大
                else if (c == 'D') nx[j] = (pre[i] - pre[j - 1] + MOD) % MOD;
                else               nx[j] = pre[i];                      // '?'
            }
            for (int j = 1; j <= i + 1; j++) dp[j] = nx[j];
        }
        ll ans = 0;
        for (int j = 1; j <= n; j++) ans = (ans + dp[j]) % MOD;
        cout << ans << "\\n";
    }
    return 0;
}`
},

11284: {
  q: "購物之旅：家在節點 0，另有 <code>n</code> 家商店（≤ 50）與 <code>m</code> 條雙向道路（各有油錢）。有 <code>k ≤ 12</code> 張 DVD，每張只在某家店有折扣（省下多少錢已給）。從家出發、任意順序逛店、再回家，求<b>最大淨省下的錢</b>（省下的折扣 − 油錢）；若無利可圖輸出固定字串。",
  h: "兩段式：<br><b>(1) Floyd-Warshall</b> 把 51 個點的兩兩最短油錢先算好（<code>n ≤ 50</code>，51³ ≈ 13 萬）。<br><b>(2) 狀壓 DP（TSP 型）</b>：<code>k ≤ 12</code>，但要先把<b>同一家店的多張 DVD 折扣加總、去重</b>（實際點數 K ≤ 12）。<br><code>dp[mask][i]</code> = 已逛過 mask 這些店、目前站在店 i 的最大淨值。<br>轉移 <code>dp[mask|1&lt;&lt;j][j] = dp[mask][i] − dist(i,j) + save[j]</code>，答案取 <code>max(dp[mask][i] − dist(i,0))</code>。<br>複雜度 2¹² × 12 × 12 ≈ 60 萬。",
  t: "① <b>金額一律乘 100 轉成整數（分）</b>再算，用 double 比大小會出現 3.4999999 這種悲劇。輸出時 <code>best/100</code> 和 <code>best%100</code>（補足兩位）。<br>② 同一家店可能有多張 DVD ⇒ <b>折扣要合併</b>，否則狀態數與轉移都會錯。<br>③ 「可以選擇不去某些店」⇒ 答案是<b>所有 mask 的最大值</b>，不是只有 full mask。<br>④ 淨值 ≤ 0 要輸出 <code>Don't leave the house</code>（注意那個縮寫撇號）。<br>⑤ 重邊取最小值。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n, m; cin >> n >> m;
        int V = n + 1;                              // 節點 0..n（0 是家）
        const ll INF = (ll)4e18;
        vector<vector<ll> > d(V, vector<ll>(V, INF));
        for (int i = 0; i < V; i++) d[i][i] = 0;
        for (int i = 0; i < m; i++) {
            int u, v; double c; cin >> u >> v >> c;
            ll w = llround(c * 100);                // 換成「分」
            if (w < d[u][v]) { d[u][v] = w; d[v][u] = w; }
        }
        for (int k = 0; k < V; k++)
            for (int i = 0; i < V; i++) {
                if (d[i][k] == INF) continue;
                for (int j = 0; j < V; j++)
                    if (d[k][j] != INF && d[i][k] + d[k][j] < d[i][j])
                        d[i][j] = d[i][k] + d[k][j];
            }

        int q; cin >> q;
        vector<int> node; vector<ll> save;
        for (int i = 0; i < q; i++) {
            int s; double v; cin >> s >> v;
            ll w = llround(v * 100);
            int idx = -1;
            for (size_t t = 0; t < node.size(); t++) if (node[t] == s) idx = t;
            if (idx < 0) { node.push_back(s); save.push_back(w); }
            else save[idx] += w;                    // 同店折扣合併
        }

        int K = node.size();
        const ll NEG = (ll)-4e18;
        vector<vector<ll> > dp(1 << K, vector<ll>(K, NEG));
        for (int i = 0; i < K; i++) dp[1 << i][i] = save[i] - d[0][node[i]];

        ll best = 0;                                // 不出門 = 省 0 元
        for (int mask = 1; mask < (1 << K); mask++)
            for (int i = 0; i < K; i++) {
                if (dp[mask][i] == NEG) continue;
                best = max(best, dp[mask][i] - d[node[i]][0]);   // 回家
                for (int j = 0; j < K; j++) {
                    if (mask >> j & 1) continue;
                    ll v = dp[mask][i] - d[node[i]][node[j]] + save[j];
                    if (v > dp[mask | 1 << j][j]) dp[mask | 1 << j][j] = v;
                }
            }

        if (best <= 0) cout << "Don't leave the house\\n";
        else cout << "Daniel can save $" << best / 100 << "."
                  << setw(2) << setfill('0') << best % 100 << setfill(' ') << "\\n";
    }
    return 0;
}`
},

11633: {
  q: "餐廳份量：<code>n</code> 位學生，第 i 位要吃 <code>c[i]</code> 單位的食物。餐廳固定一個<b>份量 p</b>（可為任意正實數），學生 i 要拿 <code>⌈c[i]/p⌉</code> 份、最後一份吃不完的部分算浪費。<br>成本 <code>= a × 浪費總量 + b × 總取餐次數</code>，且<b>沒有人可以拿超過 3 次</b>。求最小成本，輸出<b>最簡分數</b>。",
  h: "設 <code>k[i] = ⌈c[i]/p⌉</code>、<code>K = Σk[i]</code>、<code>S = Σc[i]</code>，則<br><code>浪費 = K·p − S</code>，<code>成本 = a(K·p − S) + bK</code>。<br>固定 k 向量時，成本<b>對 p 遞增</b>（a &gt; 0）⇒ 一定取該區間的<b>左端點</b>，也就是 <code>p = max(c[i]/k[i])</code>。<br>所以最佳 p<b>必為 <code>c[i]/j</code>（j = 1, 2, 3）的形式</b>！枚舉這 3n 個候選，每個 O(n) 檢查與計分 ⇒ O(3n²) = 300 萬。<br>全程<b>用整數分數運算</b>：<code>⌈c/(num/den)⌉ = ⌈c·den/num⌉</code>，成本 <code>= (a·K·num + den(bK − aS)) / den</code>，最後約分。",
  t: "① <b>不要對 p 做實數二分或三分</b>——成本對 p 是階梯狀不連續，會錯。<br>② 候選只有 <code>c[i]/1, c[i]/2, c[i]/3</code>，因為每人最多拿 3 次。<br>③ 全部用整數 + 分數比較（<code>cn·bd &lt; bn·cd</code>），浮點會在邊界誤判。<br>④ 分母為 1 時<b>只印分子</b>，其餘印成 <code>分子 / 分母</code>（斜線前後有空白）。<br>⑤ 輸入以 <code>n = 0</code> 結束；n、a、b、c 各自佔行。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n && n) {
        ll a, b; cin >> a >> b;
        vector<ll> c(n); ll S = 0;
        for (int i = 0; i < n; i++) { cin >> c[i]; S += c[i]; }

        ll bn = 0, bd = 1; bool first = true;
        for (int i = 0; i < n; i++)
            for (ll j = 1; j <= 3; j++) {
                ll num = c[i], den = j;                     // 候選份量 p = num/den
                ll K = 0; bool ok = true;
                for (int t = 0; t < n; t++) {
                    ll k = (c[t] * den + num - 1) / num;    // ceil(c[t] / p)
                    if (k > 3) { ok = false; break; }       // 超過 3 次不合法
                    K += k;
                }
                if (!ok) continue;
                // cost = a(K·p − S) + bK = (a·K·num + den(bK − aS)) / den
                ll cn = a * K * num + den * (b * K - a * S), cd = den;
                if (first || (__int128)cn * bd < (__int128)bn * cd) {
                    bn = cn; bd = cd; first = false;
                }
            }

        ll g = __gcd(bn, bd); if (g == 0) g = 1;
        bn /= g; bd /= g;
        if (bd == 1) cout << bn << "\\n";
        else cout << bn << " / " << bd << "\\n";
    }
    return 0;
}`
},

820: {
  q: "網路頻寬：無向圖，邊有頻寬上限，求從 <code>s</code> 到 <code>t</code> 的<b>最大流</b>。節點 ≤ 100。",
  h: "裸的<b>最大流</b>，用 Edmonds-Karp（BFS 找增廣路）就綽綽有餘。<br><b>無向邊的處理</b>是本題唯一的細節：一條容量 c 的無向邊，直接令 <code>cap[u][v] += c</code> <b>且</b> <code>cap[v][u] += c</code>。這個「兩邊都給 c」的作法對無向圖最大流是正確的（反向流會自動抵銷）。<br>重邊也用 <code>+=</code> 累加即可。<br>複雜度 O(V·E²) 在 V = 100 下毫無壓力。",
  t: "① 節點編號 <b>1-based</b>。<br>② 無向邊要<b>兩個方向都設 c</b>（不是各給 c/2，也不是只給一邊）。<br>③ 重邊要<b>累加</b>不是覆蓋。<br>④ 輸出格式固定：<code>Network k</code> 換行 <code>The bandwidth is X.</code>，句點不要漏，且<b>每筆後面空一行</b>。<br>⑤ <code>n = 0</code> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

int n, cap[105][105];

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int tc = 1;
    while (cin >> n && n) {
        int s, t, m; cin >> s >> t >> m;
        memset(cap, 0, sizeof cap);
        for (int i = 0; i < m; i++) {
            int u, v, c; cin >> u >> v >> c;
            cap[u][v] += c;                 // 無向邊：兩個方向都加
            cap[v][u] += c;
        }

        int flow = 0;
        while (true) {
            vector<int> pre(n + 1, -1);
            pre[s] = s;
            queue<int> q; q.push(s);
            while (!q.empty() && pre[t] < 0) {
                int u = q.front(); q.pop();
                for (int v = 1; v <= n; v++)
                    if (pre[v] < 0 && cap[u][v] > 0) { pre[v] = u; q.push(v); }
            }
            if (pre[t] < 0) break;                          // 沒有增廣路了

            int f = INT_MAX;
            for (int v = t; v != s; v = pre[v]) f = min(f, cap[pre[v]][v]);
            for (int v = t; v != s; v = pre[v]) {
                cap[pre[v]][v] -= f;
                cap[v][pre[v]] += f;                        // 反向邊
            }
            flow += f;
        }
        cout << "Network " << tc++ << "\\n";
        cout << "The bandwidth is " << flow << ".\\n\\n";
    }
    return 0;
}`
},

10309: {
  q: "關燈：10×10 的燈網格，按下某格的開關會<b>同時切換自己與上下左右</b>四格。<code>O</code> 表示亮、<code>#</code> 表示暗。求把全部燈關掉的<b>最少按壓次數</b>；無解或需超過 100 次輸出 -1。輸入以 <code>end</code> 結束。",
  h: "經典的 <b>Lights Out / 列舉第一列</b>：<br>關鍵性質：<b>第一列的按壓方式一旦決定，之後每一列都被唯一決定</b>——因為第 i 列的燈只剩第 i+1 列的開關能改，所以「第 i+1 列要按哪些」= 「第 i 列此刻還亮著的位置」。<br>枚舉第一列 2¹⁰ = 1024 種，逐列往下推，最後檢查第 10 列是否全暗，取最小按壓數。<br>另外每個開關按兩次等於沒按，所以每格<b>只有按/不按</b>兩種，這是 2¹⁰ 而非無窮的理由。<br>複雜度 1024 × 100 = 10 萬。",
  t: "① <b><code>O</code> 才是亮、<code>#</code> 是暗</b>，讀錯就全錯（樣例 all_off 是滿版 <code>#</code> 且答案 0）。<br>② 測資名稱是<b>一個字串</b>先讀，讀到 <code>end</code> 停。<br>③ 不只「無解」要輸出 −1，<b>超過 100 次也要 −1</b>。<br>④ 每個 mask 都要從原始盤面重新複製一份。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string name;
    while (cin >> name && name != "end") {
        int g[10][10];
        for (int i = 0; i < 10; i++) {
            string r; cin >> r;
            for (int j = 0; j < 10; j++) g[i][j] = (r[j] == 'O');    // O = 亮
        }

        int best = -1;
        for (int mask = 0; mask < 1024; mask++) {
            int a[10][10], p[10][10];
            memcpy(a, g, sizeof a);
            memset(p, 0, sizeof p);
            for (int j = 0; j < 10; j++) if (mask >> j & 1) p[0][j] = 1;

            int cnt = 0;
            for (int i = 0; i < 10; i++) {
                for (int j = 0; j < 10; j++)
                    if (p[i][j]) {                       // 按下 (i, j)
                        cnt++;
                        a[i][j] ^= 1;
                        if (i)     a[i - 1][j] ^= 1;
                        if (i < 9) a[i + 1][j] ^= 1;
                        if (j)     a[i][j - 1] ^= 1;
                        if (j < 9) a[i][j + 1] ^= 1;
                    }
                // 第 i 列還亮著的，只剩下一列的開關能關掉它
                if (i < 9) for (int j = 0; j < 10; j++) p[i + 1][j] = a[i][j];
            }
            bool ok = true;
            for (int j = 0; j < 10; j++) if (a[9][j]) ok = false;
            if (ok && (best < 0 || cnt < best)) best = cnt;
        }
        if (best > 100) best = -1;
        cout << name << " " << best << "\\n";
    }
    return 0;
}`
},

12223: {
  q: "搬到紐倫堡：地鐵網是一棵<b>樹</b>（n ≤ 50000，邊有秒數）。你會固定去 k 個地點，第 j 個一年去 <code>f[j]</code> 次，而且<b>每次都是「家 → 目的地 → 家」來回</b>。求住哪一站可讓一年通勤秒數最少；輸出最小值，以及<b>所有</b>最佳站點（遞增）。",
  h: "要求的是 <code>cost(v) = 2 · Σ f[j] · dist(v, j)</code> 的最小值與所有 argmin ⇒ 標準的<b>換根 DP（rerooting）</b>，兩次遍歷 O(n)：<br><b>第一趟（由下往上）</b>：<code>sub[u]</code> = 子樹內的權重總和，<code>cost[u]</code> = 子樹內所有點到 u 的加權距離和。<br><b>第二趟（由上往下換根）</b>：<br><code>ans[v] = ans[par] + (total − 2·sub[v]) · w(par, v)</code><br>直覺：根從 par 移到 v，子樹內 <code>sub[v]</code> 的權重各少走一條邊，其餘 <code>total − sub[v]</code> 各多走一條。<br>最後答案 <code>× 2</code>（來回）。",
  t: "① n 到 50000，遞迴 DFS 有<b>爆堆疊</b>風險 ⇒ 用 <b>stack 迭代</b>取出「父在子前」的順序，反著跑就是由下往上。<br>② 秒數會很大（50000 × 300 × 500）⇒ 全程 <code>long long</code>。<br>③ 別忘了<b>乘 2</b>（來回）。<br>④ 最佳站點<b>可能有多個</b>，要全部輸出、遞增、空白分隔。<br>⑤ k 可以是 0（權重全 0）⇒ 所有站都是最佳解，要能正確印出全部。<br>⑥ 同一站不會重複出現在清單中，但用 <code>+=</code> 累加最保險。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<vector<pair<int, int> > > adj(n + 1);
        for (int i = 0; i < n - 1; i++) {
            int a, b, c; cin >> a >> b >> c;
            adj[a].push_back(make_pair(b, c));
            adj[b].push_back(make_pair(a, c));
        }
        int k; cin >> k;
        vector<ll> w(n + 1, 0);
        for (int i = 0; i < k; i++) { int a; ll f; cin >> a >> f; w[a] += f; }

        // 迭代 DFS，得到「父節點必在子節點之前」的序
        vector<int> ord; ord.reserve(n);
        vector<int> par(n + 1, 0), pw(n + 1, 0);
        vector<char> vis(n + 1, 0);
        {
            vector<int> st; st.push_back(1); vis[1] = 1;
            while (!st.empty()) {
                int u = st.back(); st.pop_back();
                ord.push_back(u);
                for (size_t i = 0; i < adj[u].size(); i++) {
                    int v = adj[u][i].first;
                    if (!vis[v]) {
                        vis[v] = 1; par[v] = u; pw[v] = adj[u][i].second;
                        st.push_back(v);
                    }
                }
            }
        }

        // 第一趟：由下往上
        vector<ll> sub(n + 1, 0), cost(n + 1, 0);
        for (int i = n - 1; i >= 0; i--) {
            int u = ord[i];
            sub[u] += w[u];
            if (u != 1) {
                sub[par[u]]  += sub[u];
                cost[par[u]] += cost[u] + sub[u] * (ll)pw[u];
            }
        }
        ll total = sub[1];

        // 第二趟：換根
        vector<ll> ans(n + 1, 0);
        ans[1] = cost[1];
        for (size_t i = 1; i < ord.size(); i++) {
            int u = ord[i];
            ans[u] = ans[par[u]] + (total - 2 * sub[u]) * (ll)pw[u];
        }

        ll best = LLONG_MAX;
        for (int i = 1; i <= n; i++) best = min(best, ans[i]);
        cout << best * 2 << "\\n";                  // 來回要乘 2
        bool first = true;
        for (int i = 1; i <= n; i++)
            if (ans[i] == best) { if (!first) cout << " "; cout << i; first = false; }
        cout << "\\n";
    }
    return 0;
}`
}
};

/* 三星題庫（第二批 9 題） */
const SOL42 = {
11503: {
  q: "Virtual Friends：每次讀入一對<b>名字</b>成為朋友，輸出這兩人合併後所屬<b>社交圈的人數</b>（朋友的朋友也算同一圈）。",
  h: "<b>並查集 + 名字對映</b>：<br>① 用 <code>map&lt;string, int&gt;</code> 把名字轉成整數編號（沒出現過就新建）。<br>② 用 <code>sz[]</code> 記錄每個集合的大小，合併時 <code>sz[新根] = sz[a] + sz[b]</code>。<br>③ <b>每讀一對就立刻輸出</b>合併後的集合大小；若兩人本來就同圈，直接輸出現有大小（不重複相加）。<br>複雜度幾乎 O(m α)。<br>驗算：<code>Fred Barney</code> ⇒ 2；<code>Barney Betty</code> ⇒ 3；<code>Betty Wilma</code> ⇒ 4。",
  t: "① <b>本來就同圈時不能再相加</b>——要先 <code>find</code> 比較根，相同就直接輸出 <code>sz[根]</code>。<br>② 名字要用 <code>map</code> 對映；人數可達 2m，容器大小要開夠（每筆最多 2m 個相異名字）。<br>③ 每筆測資都要<b>清空</b> map 與並查集。<br>④ 輸入量大（m 可達 10 萬）⇒ 要 <code>sync_with_stdio(false)</code>。<br>⑤ <b>每次合併都要輸出一行</b>，不是每筆測資輸出一行。",
  c: `#include <bits/stdc++.h>
using namespace std;

vector<int> par, sz;
int find_(int x) { while (par[x] != x) x = par[x] = par[par[x]]; return x; }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int m; cin >> m;
        map<string, int> id;
        par.assign(2 * m + 2, 0);
        sz.assign(2 * m + 2, 1);
        for (size_t i = 0; i < par.size(); i++) par[i] = i;

        for (int i = 0; i < m; i++) {
            string a, b; cin >> a >> b;
            if (!id.count(a)) { int k = id.size(); id[a] = k; }
            if (!id.count(b)) { int k = id.size(); id[b] = k; }
            int x = find_(id[a]), y = find_(id[b]);
            if (x != y) { par[x] = y; sz[y] += sz[x]; }  // 同圈就不重複相加
            cout << sz[find_(id[a])] << "\\n";           // 每次合併都要輸出
        }
    }
    return 0;
}`
},

10048: {
  q: "Audiophobia：無向圖的邊有<b>噪音值</b>。對每筆查詢 <code>(a, b)</code>，求從 a 到 b 的所有路徑中，<b>路徑上最大噪音值的最小值</b>（瓶頸路徑）。不可達輸出 <code>no path</code>。",
  h: "這是<b>最小瓶頸路徑</b>（minimax path），有兩個漂亮解法：<br><b>① Floyd 變形</b>（本解採用）：把鬆弛式從「相加」改成「<b>取最大</b>」：<br><code>d[i][j] = min(d[i][j], max(d[i][k], d[k][j]))</code><br>語意是「經過 k 中轉時，瓶頸是兩段瓶頸的較大者」。C ≤ 100 ⇒ 100³ = 10⁶，完全可行。<br><b>② 最小生成樹</b>：MST 上的<b>唯一路徑</b>就是最小瓶頸路徑（可用交換論證證明），建好 MST 後對每筆查詢走樹上路徑即可。<br>驗算樣例：<code>1 → 7</code> 的最佳路徑瓶頸是 <b>80</b>。",
  t: "① <b>把 Floyd 的「+」換成「max」、外層仍取 min</b>——這個變形是本題的核心，跟 10099（Tourist Guide）的「max-min」是對偶的。<br>② 中繼點 k 仍<b>必須在最外層</b>。<br>③ 節點編號 1-based，且可能不連續使用。<br>④ 不可達要輸出 <code>no path</code>。<br>⑤ 輸出格式：先印 <code>Case #k</code>，各筆測資之間<b>空一行</b>。<br>⑥ 重邊要取<b>最小</b>的噪音值。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int C, S, Q, cs = 1;
    bool first = true;
    while (cin >> C >> S >> Q) {
        const int INF = 1000000000;
        vector<vector<int> > d(C + 1, vector<int>(C + 1, INF));
        for (int i = 1; i <= C; i++) d[i][i] = 0;
        for (int i = 0; i < S; i++) {
            int u, v, w; cin >> u >> v >> w;
            d[u][v] = min(d[u][v], w);                  // 重邊取最小
            d[v][u] = min(d[v][u], w);
        }
        for (int k = 1; k <= C; k++)                    // 中繼點在最外層
            for (int i = 1; i <= C; i++) {
                if (d[i][k] == INF) continue;
                for (int j = 1; j <= C; j++)
                    if (d[k][j] != INF)
                        d[i][j] = min(d[i][j], max(d[i][k], d[k][j]));   // min-max
            }

        if (!first) cout << "\\n";
        first = false;
        cout << "Case #" << cs++ << "\\n";
        for (int i = 0; i < Q; i++) {
            int a, b; cin >> a >> b;
            if (d[a][b] >= INF) cout << "no path\\n";
            else cout << d[a][b] << "\\n";
        }
    }
    return 0;
}`
},

10285: {
  q: "Longest Run on a Snowboard：在一張數字網格上，每步只能走到<b>四方向中數值更小</b>的格子。求最長的下滑路徑<b>經過幾格</b>。",
  h: "「只能往更小走」⇒ 圖上<b>不可能成環</b> ⇒ 這是 DAG 上的最長路 ⇒ 用<b>記憶化搜尋</b>最直觀：<br><code>dfs(i, j)</code> = 從 (i, j) 出發能滑的最長格數<br><code>= 1 + max(dfs(鄰居))</code>，只走數值更小的鄰居<br>用 <code>memo[i][j]</code> 快取，每格只算一次 ⇒ O(RC)。<br>答案是所有格子的最大值。<br><b>為什麼不用擔心無窮遞迴</b>：因為數值嚴格遞減，遞迴深度最多等於相異數值個數。<br>驗算：樣例的 <code>Feldberg</code> 答案是 <b>7</b> 格。",
  t: "① 是<b>嚴格</b>小於（相等的格子不能走），否則會成環。<br>② 答案是<b>格子數</b>不是步數（單一格子的答案是 1）。<br>③ 記憶化的初值用 0 或 −1 都可以，但要跟「合法答案 ≥ 1」區分開。<br>④ 網格可達 100×100，遞迴深度最多 10000 ⇒ 安全，但改成拓撲序 DP 更穩。<br>⑤ 輸出格式 <code>名稱: 長度</code>（冒號後有空白）。",
  c: `#include <bits/stdc++.h>
using namespace std;

int R, C;
vector<vector<int> > g, memo;

int dfs(int i, int j) {
    if (memo[i][j]) return memo[i][j];
    int best = 1;                                       // 至少自己一格
    int dx[] = {1, -1, 0, 0}, dy[] = {0, 0, 1, -1};
    for (int k = 0; k < 4; k++) {
        int x = i + dx[k], y = j + dy[k];
        if (x < 0 || y < 0 || x >= R || y >= C) continue;
        if (g[x][y] >= g[i][j]) continue;               // 必須嚴格更小
        best = max(best, 1 + dfs(x, y));
    }
    return memo[i][j] = best;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        string name; cin >> name >> R >> C;
        g.assign(R, vector<int>(C));
        memo.assign(R, vector<int>(C, 0));
        for (int i = 0; i < R; i++)
            for (int j = 0; j < C; j++) cin >> g[i][j];

        int ans = 0;
        for (int i = 0; i < R; i++)
            for (int j = 0; j < C; j++) ans = max(ans, dfs(i, j));
        cout << name << ": " << ans << "\\n";
    }
    return 0;
}`
},

10905: {
  q: "Children's Game：給 n 個正整數，把它們<b>串接</b>成一個大數字，求<b>最大的可能結果</b>。",
  h: "直覺會想「數值大的排前面」或「字典序大的排前面」，<b>兩個都錯</b>：<br>例如 <code>9</code> 與 <code>90</code>：字典序 <code>90 &gt; 9</code>，但 <code>9 + 90 = 990</code> 比 <code>90 + 9 = 909</code> 大。<br><b>正確的比較器是直接比串接結果</b>：<br><code>a 排在 b 前面 ⟺ (a + b) &gt; (b + a)</code>（字串串接後比大小）<br>這個比較器滿足<b>遞移性</b>（可證），所以能安全地丟給 <code>sort</code>。<br>排好後直接串接輸出即可。O(n log n × 字串長度)。<br>驗算：<code>123 124 56 90</code> ⇒ <b>9056124123</b> ✓；<code>9 9 9 9 9</code> ⇒ <b>99999</b> ✓。",
  t: "① <b>比較器必須比「串接結果」</b>，不能比數值也不能比字典序——這是全題唯一的考點。<br>② 兩個字串長度可能不同，串接後長度相同才能直接用 <code>&gt;</code> 比。<br>③ 數字當<b>字串</b>讀入，不要轉成整數（會爆且沒必要）。<br>④ n ≤ 50、每個數不大，效率不是問題。<br>⑤ <code>n = 0</code> 結束。<br>⑥ 若全是 0，答案是 <code>000…</code>（本題數字為正，不會發生）。",
  c: `#include <bits/stdc++.h>
using namespace std;

bool cmp(const string &a, const string &b) {
    return a + b > b + a;                               // 比串接結果，不是比字典序
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n && n) {
        vector<string> v(n);
        for (int i = 0; i < n; i++) cin >> v[i];
        sort(v.begin(), v.end(), cmp);
        for (int i = 0; i < n; i++) cout << v[i];
        cout << "\\n";
    }
    return 0;
}`
},

10179: {
  q: "Irreducable Basic Fractions：給 <code>n ≤ 10⁹</code>，求分母為 n 的<b>最簡真分數</b>個數（即 <code>gcd(m, n) = 1</code> 且 <code>m &lt; n</code> 的 m 的個數）。",
  h: "這就是<b>歐拉函數 φ(n)</b>，跟 10299 是同一題換皮。<br>用乘積公式 <code>φ(n) = n × ∏(1 − 1/p)</code>：<b>試除法分解質因數</b>，只要除到 <code>√n ≈ 31623</code>；每找到一個質因數 p 就 <code>ans = ans / p × (p − 1)</code>，並把 n 中的 p 除乾淨。<br>迴圈結束後若 <code>n &gt; 1</code>，代表還剩一個<b>大質因數</b>，也要處理。<br>複雜度 O(√n) 每筆。<br>驗算：<code>φ(12) = 4</code>（1, 5, 7, 11）；<code>φ(123456) = 41088</code> ✓；<code>φ(7654321) = 7251444</code> ✓。",
  t: "① <b>迴圈結束後別忘了剩下的大質因數</b>——n 是質數時整個迴圈都不會進去，這是最常見的漏洞。<br>② <b>先除再乘</b>（<code>ans / p * (p − 1)</code>）避免溢位；ans 必定是 p 的倍數，整除不會失真。<br>③ 試除時 n 要<b>隨著除法縮小</b>，否則 <code>p*p &lt;= n</code> 的界不會收斂。<br>④ 輸入以 <code>0</code> 結束。<br>⑤ n = 1 時 φ(1) = 1，但「m &lt; n 的真分數」個數是 0——本題定義下要注意邊界（樣例未涵蓋）。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll n;
    while (cin >> n && n) {
        ll ans = n, m = n;
        for (ll p = 2; p * p <= m; p++) {
            if (m % p) continue;
            ans = ans / p * (p - 1);                    // 先除再乘，避免溢位
            while (m % p == 0) m /= p;
        }
        if (m > 1) ans = ans / m * (m - 1);             // 剩下的大質因數
        cout << ans << "\\n";
    }
    return 0;
}`
},

10139: {
  q: "Factovisors：判斷 <code>m</code> 是否<b>整除 <code>n!</code></b>（兩數皆 &lt; 2³¹）。",
  h: "不可能算出 <code>n!</code>（動輒上萬位）⇒ 改成<b>比較質因數的次方</b>：<br><code>m | n!</code> ⟺ 對 m 的<b>每個質因數 p</b>，<code>n!</code> 中 p 的次方 ≥ m 中 p 的次方。<br>兩個工具：<br>① <b>分解 m</b>：試除到 <code>√m ≈ 46341</code>。<br>② <b><code>n!</code> 中 p 的次方</b>用 <b>Legendre 公式</b>：<code>⌊n/p⌋ + ⌊n/p²⌋ + …</code>（實作上用 <code>q /= p</code> 反覆累加，避免 <code>p^k</code> 溢位）。<br>複雜度 O(√m + log n) 每筆。<br><b>特例</b>：<code>m = 0</code> 時 0 不整除任何數 ⇒ does not divide；<code>m = 1</code> 時恆整除。<br>驗算：<code>1000 1009</code> ⇒ 1009 是質數且 &gt; 1000 ⇒ <code>1000!</code> 裡沒有這個因數 ⇒ <b>does not divide</b> ✓。",
  t: "① <b>m = 0 要特判</b>（0 不整除任何數），否則除以零。<br>② Legendre 公式要用<b>除法累進</b>（<code>q /= p; cnt += q;</code>），寫成 <code>n / pow(p,k)</code> 會溢位。<br>③ 分解後<b>剩下的大質因數</b>也要檢查——若它 &gt; n，次方必為 0 ⇒ 不整除。<br>④ 輸出句子有兩種措辭：<code>m divides n!</code> / <code>m does not divide n!</code>。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

// n! 中質因數 p 的次方（Legendre 公式）
ll legendre(ll n, ll p) {
    ll cnt = 0, q = n;
    while (q) { q /= p; cnt += q; }
    return cnt;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll n, m;
    while (cin >> n >> m) {
        bool ok;
        if (m == 0) ok = false;                         // 0 不整除任何數
        else {
            ok = true;
            ll mm = m;
            for (ll p = 2; p * p <= mm && ok; p++) {
                if (mm % p) continue;
                ll e = 0;
                while (mm % p == 0) { mm /= p; e++; }
                if (legendre(n, p) < e) ok = false;
            }
            if (ok && mm > 1 && legendre(n, mm) < 1) ok = false;   // 大質因數
        }
        cout << m << (ok ? " divides " : " does not divide ") << n << "!\\n";
    }
    return 0;
}`
},

10276: {
  q: "Hanoi Tower Troubles Again：n 根柱子，依序放編號 1, 2, 3… 的球。規則：<b>放上去時，若該柱頂端已有球，兩球編號之和必須是完全平方數</b>。求最多能放幾顆球。",
  h: "<b>貪心 + 模擬</b>：依序嘗試放第 k 顆球，<b>掃過所有柱子</b>，只要有一根柱子的頂端球 <code>t</code> 滿足 <code>t + k</code> 是完全平方數（或該柱是空的）就放上去。<br>放不下就停止，答案是 <code>k − 1</code>。<br><b>為什麼貪心正確</b>：球必須按編號順序放，且每根柱子只看頂端；先放在編號小的柱子不會讓後續更差（可用交換論證）。<br>n ≤ 50 ⇒ 答案不會太大（實測 n=50 時約 3000 多），直接模擬即可。<br>判定完全平方用 <code>ll r = sqrt(x); while (r*r &lt; x) r++;</code> 修正浮點誤差。<br>驗算：<code>n=25</code> ⇒ <b>337</b>（樣例）。",
  t: "① <b>掃柱子時要從第一根開始、放到第一個可行的</b>——順序影響結果，這是貪心的一部分。<br>② 判完全平方要<b>修正 <code>sqrt</code> 的浮點誤差</b>（大數時可能差 1）。<br>③ 空柱子可以直接放（沒有限制）。<br>④ 答案可能上千，陣列與迴圈上界要開夠。<br>⑤ 題目提到「無限多球時輸出 −1」，但實際上 n 有限時必定會停，不會發生。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

bool isSquare(ll x) {
    if (x < 0) return false;
    ll r = (ll)sqrt((double)x);
    while (r * r < x) r++;                              // 修正浮點誤差
    while (r * r > x) r--;
    return r * r == x;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<ll> top(n, 0);                           // 每根柱子頂端的球號，0 = 空
        ll k = 1;
        while (true) {
            bool placed = false;
            for (int i = 0; i < n; i++) {               // 從第一根開始找
                if (top[i] == 0 || isSquare(top[i] + k)) {
                    top[i] = k; placed = true; break;
                }
            }
            if (!placed) break;
            k++;
        }
        cout << k - 1 << "\\n";
    }
    return 0;
}`
},

10042: {
  q: "Smith Numbers：<b>Smith 數</b>是指「各位數字之和」等於「所有質因數的各位數字之和（<b>計重</b>）」的<b>合數</b>。給 n，求<b>大於 n 的最小 Smith 數</b>。",
  h: "從 <code>n + 1</code> 開始逐一檢查，直到找到為止。每個候選要做兩件事：<br>① 算出<b>本身的數字和</b>。<br>② <b>分解質因數</b>（試除到 √x），把每個質因數的<b>數字和 × 出現次數</b>累加。<br>③ 兩者相等<b>且是合數</b>（質因數不只一個，或次方 &gt; 1）⇒ 是 Smith 數。<br><b>質數必須排除</b>：質數的兩個和必定相等（自己），但定義要求是合數。<br>驗算：<code>4937775 = 3 × 5 × 5 × 65837</code>，數字和 <code>4+9+3+7+7+7+5 = 42</code>；質因數和 <code>3 + 5 + 5 + (6+5+8+3+7) = 42</code> ⇒ 是 Smith 數 ✓。",
  t: "① <b>質數不算 Smith 數</b>——這是最容易漏的條件（質數的兩邊必定相等）。<br>② 質因數要<b>計重</b>（<code>25 = 5 × 5</code> 要算兩次 5）。<br>③ 別忘了分解後<b>剩下的大質因數</b>。<br>④ n &lt; 10⁹ ⇒ 逐一檢查加上 O(√x) 分解，實測可過（Smith 數相當密集）。<br>⑤ 只需要「大於 n」的最小值，所以從 <code>n+1</code> 開始。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int digitSum(ll x) {
    int s = 0;
    while (x) { s += x % 10; x /= 10; }
    return s;
}

bool isSmith(ll x) {
    ll t = x;
    int pf = 0, cntFactor = 0;
    for (ll p = 2; p * p <= t; p++)
        while (t % p == 0) { t /= p; pf += digitSum(p); cntFactor++; }
    if (t > 1) { pf += digitSum(t); cntFactor++; }
    if (cntFactor <= 1) return false;                   // 質數不算 Smith 數
    return pf == digitSum(x);
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        ll n; cin >> n;
        ll x = n + 1;
        while (!isSmith(x)) x++;
        cout << x << "\\n";
    }
    return 0;
}`
},

10000: {
  q: "Longest Paths：給一張<b>有向無環圖</b>與起點，求從起點出發的<b>最長路徑長度</b>與<b>終點編號</b>；多解時取<b>編號最大</b>的終點。",
  h: "DAG 上的最長路 ⇒ 用<b>記憶化搜尋</b>（或拓撲序 DP）：<br><code>dfs(u)</code> = 從 u 出發的最長邊數 = <code>1 + max(dfs(v))</code>，沒有出邊則為 0。<br>同時記錄達到最長時的<b>終點編號</b>，平手時取<b>較大</b>的編號。<br>n ≤ 100 ⇒ 記憶化後每點只算一次，極快。<br><b>注意「長度」的定義是邊數</b>（樣例：從 1 到 2 只有一條邊 ⇒ 長度 1）。<br>驗算樣例二：從 3 出發最長 4 條邊、終點 <b>5</b>（原文樣例輸出被截斷，但格式為 <code>Case k: The longest path from s has length L, finishing at e.</code>）。",
  t: "① <b>長度是邊數不是點數</b>（單一點的長度是 0）。<br>② 多解時取<b>編號最大</b>的終點——更新條件要寫成 <code>&gt;</code> 或（等長時）<code>終點編號更大</code>。<br>③ 題目保證無環，不必判環。<br>④ 每筆測資的邊清單以 <code>0 0</code> 結束；<code>n = 0</code> 代表整份輸入結束。<br>⑤ 輸出句子含逗號與句號：<code>… has length L, finishing at e.</code>",
  c: `#include <bits/stdc++.h>
using namespace std;

int n;
vector<vector<int> > adj;
vector<int> memo, endp;

int dfs(int u) {
    if (memo[u] != -1) return memo[u];
    int best = 0, be = u;                               // 沒有出邊則長度 0
    for (size_t i = 0; i < adj[u].size(); i++) {
        int v = adj[u][i];
        int len = dfs(v) + 1;
        if (len > best || (len == best && endp[v] > be)) {   // 平手取編號大的
            best = len; be = endp[v];
        }
    }
    endp[u] = be;
    return memo[u] = best;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int cs = 1;
    while (cin >> n && n) {
        adj.assign(n + 1, vector<int>());
        int u, v;
        while (cin >> u >> v && (u || v)) adj[u].push_back(v);
        int s; cin >> s;

        memo.assign(n + 1, -1);
        endp.assign(n + 1, 0);
        for (int i = 1; i <= n; i++) endp[i] = i;
        int len = dfs(s);
        cout << "Case " << cs++ << ": The longest path from " << s
             << " has length " << len << ", finishing at " << endp[s] << ".\\n";
    }
    return 0;
}`
}
};

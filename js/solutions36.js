/* 二星題庫（第十九批 4 題） */
const SOL36 = {
10016: {
  q: "Flip-Flop the Squarelotron：<code>n × n</code> 方陣由外而內分成 <code>⌈n/2⌉</code> 個「環」。三種操作作用在指定的環上：<br><code>1</code> 上下翻轉、<code>2</code> 主對角線鏡射、<code>3</code> 副對角線鏡射。<br>依序執行所有操作後輸出方陣。",
  h: "關鍵是<b>只翻轉指定的那一環，其他格子原封不動</b>。<br>第 k 環（0 起算）佔據 <code>[k, n−1−k]</code> 這個正方形的<b>邊界</b>。三種翻轉都可以用「先算座標對映、再只套用在環上的格子」實作：<br>・上下翻轉：<code>(i, j) → (n−1−i, j)</code><br>・主對角線：<code>(i, j) → (j, i)</code><br>・副對角線：<code>(i, j) → (n−1−j, n−1−i)</code><br>這三個對映都<b>把環映到自己</b>（環對這些對稱都是不變的），所以直接對環上每個格子取新位置、寫進暫存陣列即可。",
  t: "① <b>只動指定的環</b>——把整張方陣翻轉是最常見的錯誤。<br>② 副對角線是 <code>(n−1−j, n−1−i)</code>，不是主對角線公式的簡單變形。<br>③ 環編號從 <b>1 開始</b>（輸入給的），內部要減 1。<br>④ 操作<b>依序執行</b>，每次都在前一次結果上做。<br>⑤ 必須用<b>暫存陣列</b>，就地交換會在對角線翻轉時互相覆蓋。<br>⑥ 測資之間<b>不印空行</b>（題目明說 No blank line）。",
  c: `#include <bits/stdc++.h>
using namespace std;

int n;
vector<vector<int> > g;

bool onRing(int i, int j, int k) {                      // (i,j) 是否在第 k 環（0 起算）
    int lo = k, hi = n - 1 - k;
    if (i < lo || i > hi || j < lo || j > hi) return false;
    return i == lo || i == hi || j == lo || j == hi;
}

void flip(int k, int type) {
    vector<vector<int> > t = g;                         // 暫存，避免覆蓋衝突
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++) {
            if (!onRing(i, j, k)) continue;
            int ni, nj;
            if (type == 1) { ni = n - 1 - i; nj = j; }          // 上下翻轉
            else if (type == 2) { ni = j; nj = i; }             // 主對角線
            else { ni = n - 1 - j; nj = n - 1 - i; }            // 副對角線
            t[ni][nj] = g[i][j];
        }
    g = t;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        cin >> n;
        g.assign(n, vector<int>(n));
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) cin >> g[i][j];

        int m; cin >> m;
        for (int i = 0; i < m; i++) {
            int ring, type; cin >> ring >> type;
            flip(ring - 1, type);                       // 環編號 1-based
        }
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) cout << (j ? " " : "") << g[i][j];
            cout << "\\n";
        }
    }
    return 0;
}`
},

10238: {
  q: "Throw the Dice：擲 <code>n</code> 次 <code>f</code> 面骰（面值 1..f），求點數<b>總和恰為 s</b> 的機率，輸出成 <code>分子/分母</code>。",
  h: "分母是 <code>fⁿ</code>，分子是「n 顆 f 面骰湊出 s」的<b>方法數</b>，用最直接的 DP：<br><code>dp[i][j] = Σ_{v=1..f} dp[i−1][j−v]</code>（丟了 i 顆、總和 j）<br>狀態數 50 × 2500 = 12.5 萬，直接跑。<br><b>真正的難點是數字大小</b>：<code>50⁵⁰ ≈ 10⁸⁵</code> ⇒ 分子與分母都必須用<b>大數</b>（只需要加法與乘小數兩種運算）。<br><b>而且不要約分</b>——樣例 <code>6 2 3 → 2/36</code>、<code>6 3 10 → 27/216</code> 都沒約分，直接輸出 <code>方法數/fⁿ</code> 即可。",
  t: "① <code>50⁵⁰</code> 遠超 <code>long long</code> ⇒ <b>分子分母都要大數</b>。<br>② <b>不要約分</b>！樣例的 <code>2/36</code>、<code>27/216</code> 都是未約分的形式，約分反而會 WA。<br>③ DP 邊界 <code>dp[0][0] = 1</code>，轉移時要確保 <code>j − v ≥ 0</code>。<br>④ s 若小於 n 或大於 <code>n×f</code> ⇒ 方法數 0。<br>⑤ 樣例可自驗：<code>6 2 2</code> ⇒ 只有 (1,1) ⇒ <b>1/36</b> ✓；<code>6 2 3</code> ⇒ (1,2)(2,1) ⇒ <b>2/36</b> ✓。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

const int BASE = 1000000000, W = 9;
typedef vector<int> Big;

Big big(ll v) {
    Big r;
    if (v == 0) r.push_back(0);
    while (v) { r.push_back((int)(v % BASE)); v /= BASE; }
    return r;
}
bool isZero(const Big &a) { return a.size() == 1 && a[0] == 0; }

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
Big mulSmall(const Big &a, ll k) {
    Big r; ll carry = 0;
    for (size_t i = 0; i < a.size() || carry; i++) {
        ll v = carry + (i < a.size() ? (ll)a[i] * k : 0);
        r.push_back((int)(v % BASE)); carry = v / BASE;
    }
    if (r.empty()) r.push_back(0);
    return r;
}
void printBig(const Big &v) {
    cout << v.back();
    for (int i = (int)v.size() - 2; i >= 0; i--)
        cout << setw(W) << setfill('0') << v[i];
    cout << setfill(' ');
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll f, n, s;
    while (cin >> f >> n >> s) {
        int mx = (int)(n * f);
        vector<Big> dp(mx + 1, big(0)), nx;
        dp[0] = big(1);
        for (int i = 0; i < n; i++) {                   // 丟第 i+1 顆骰子
            nx.assign(mx + 1, big(0));
            for (int j = 0; j <= mx; j++) {
                if (isZero(dp[j])) continue;
                for (int v = 1; v <= f && j + v <= mx; v++)
                    nx[j + v] = add(nx[j + v], dp[j]);
            }
            dp = nx;
        }
        Big den = big(1);
        for (int i = 0; i < n; i++) den = mulSmall(den, f);   // f^n

        Big num = (s >= 0 && s <= mx) ? dp[s] : big(0);
        printBig(num);
        cout << "/";
        printBig(den);
        cout << "\\n";                                   // 不約分
    }
    return 0;
}`
},

10040: {
  q: "Ouroboros Snake：長度 <code>2ⁿ</code> 的<b>環狀二進位串</b>，其 <code>2ⁿ</code> 個「連續 n 位視窗」<b>恰好給出 0..2ⁿ−1 每個數各一次</b>（即 <b>de Bruijn 序列</b>），且要<b>字典序最小</b>。給 n 與 k，求第 k 個視窗（0-based）代表的數值。",
  h: "字典序最小的 de Bruijn 序列由 <b>FKM 演算法（Lyndon 詞串接）</b>產生，是這類題的標準解：<br><code>db(t, p)</code>：若 <code>t &gt; n</code> 且 <code>n % p == 0</code>，就把 <code>a[1..p]</code> 接到序列尾端；否則令 <code>a[t] = a[t−p]</code> 遞迴，再把 <code>a[t]</code> 換成更大的值遞迴。<br>結果就是把所有<b>長度整除 n 的 Lyndon 詞</b>依字典序串接，恰好長 <code>2ⁿ</code>。<br><b>驗算 n=2</b>：Lyndon 詞是 <code>0</code>、<code>01</code>、<code>1</code> ⇒ 串成 <code>0011</code>；四個環狀視窗依序是 00、01、11、10 ⇒ <b>0, 1, 3, 2</b> ✓。<br>查詢時取 <code>seq[(k+i) mod 2ⁿ]</code> 組成 n 位數，O(n)。<br>遞迴深度只有 n（≤ 21），完全安全。",
  t: "① <b>單純的「優先接 0」貪心會卡住</b>：n=2 時走到 <code>0010</code> 就無路可走。必須用 FKM（或在 de Bruijn 圖上跑 Euler 迴路且每次取最小邊）。<br>② FKM 的關鍵條件是 <code>n % p == 0</code> 才輸出，這保證只取「長度整除 n」的 Lyndon 詞。<br>③ n ≤ 21 ⇒ 序列長 <code>2²¹ ≈ 200 萬</code>，用 <code>string</code> 存，記憶體 2 MB。<br>④ 同一個 n 可能被查詢多次 ⇒ 用<b>快取</b>避免重算。<br>⑤ 視窗是<b>環狀</b>的，索引要 <code>% 2ⁿ</code>；k 是 <b>0-based</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int N;
vector<int> a;
string seq;

void db(int t, int p) {                                 // FKM：產生字典序最小的 de Bruijn
    if (t > N) {
        if (N % p == 0)
            for (int i = 1; i <= p; i++) seq += char('0' + a[i]);
    } else {
        a[t] = a[t - p];
        db(t + 1, p);
        for (int j = a[t - p] + 1; j <= 1; j++) { a[t] = j; db(t + 1, t); }
    }
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int lastN = -1;
    int n, k;
    while (cin >> n >> k) {
        if (n != lastN) {                               // 快取：同一個 n 只建一次
            lastN = n;
            N = n;
            a.assign(n + 1, 0);
            seq.clear();
            seq.reserve(1 << n);
            db(1, 1);
        }
        int total = 1 << n, v = 0;
        for (int i = 0; i < n; i++)                     // 環狀取 n 位視窗
            v = v * 2 + (seq[(k + i) % total] - '0');
        cout << v << "\\n";
    }
    return 0;
}`
},

11412: {
  q: "Dig the Holes：類似「猜數字」——4 個洞從 6 種顏色（R/G/B/Y/O/V）中<b>可重複</b>選填。給兩次猜測與各自的回應（<b>位置與顏色都對的個數</b>、<b>顏色對但位置錯的個數</b>），問是否存在符合兩次回應的答案；不存在則對方作弊。",
  h: "候選只有 <code>6⁴ = 1296</code> 種 ⇒ <b>全部枚舉</b>，對每個候選檢查是否同時符合兩次回應。<br><b>回應的計算方式</b>（標準 Mastermind 規則）：<br>・<b>black（位置顏色皆對）</b>：逐位比對相同的個數。<br>・<b>white（顏色對位置錯）</b>：<code>Σ_c min(猜測中 c 的個數, 答案中 c 的個數) − black</code><br>第二式是關鍵——用<b>各顏色出現次數取 min 再減掉 black</b>，比自己寫配對邏輯正確又簡潔。<br>複雜度 1296 × 2 × 常數，瞬殺。",
  t: "① <b>white 的算法</b>是本題唯一的技術點：<code>Σ min(count) − black</code>；自己寫配對很容易重複計算。<br>② 顏色<b>可重複</b>使用（不是排列），所以是 <code>6⁴</code> 而非 <code>6×5×4×3</code>。<br>③ 兩次猜測都要符合才算 Possible。<br>④ 輸出是 <code>Possible</code> / <code>Cheat</code>（不是 Impossible）。<br>⑤ 顏色只有 6 種：R、G、B、Y、O、V。",
  c: `#include <bits/stdc++.h>
using namespace std;

const char *COL = "RGBYOV";

void score(const string &guess, const string &ans, int &black, int &white) {
    black = 0;
    int cg[128] = {0}, ca[128] = {0};
    for (int i = 0; i < 4; i++) {
        if (guess[i] == ans[i]) black++;
        cg[(int)guess[i]]++;
        ca[(int)ans[i]]++;
    }
    int both = 0;
    for (int i = 0; i < 6; i++) both += min(cg[(int)COL[i]], ca[(int)COL[i]]);
    white = both - black;                               // 顏色對但位置錯
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        string g1, g2; int b1, w1, b2, w2;
        cin >> g1 >> b1 >> w1 >> g2 >> b2 >> w2;

        bool ok = false;
        string cand(4, 'R');
        for (int m = 0; m < 1296 && !ok; m++) {         // 6^4 全部枚舉
            int t = m;
            for (int i = 0; i < 4; i++) { cand[i] = COL[t % 6]; t /= 6; }
            int bb, ww;
            score(g1, cand, bb, ww);
            if (bb != b1 || ww != w1) continue;
            score(g2, cand, bb, ww);
            if (bb == b2 && ww == w2) ok = true;
        }
        cout << (ok ? "Possible" : "Cheat") << "\\n";
    }
    return 0;
}`
}
};

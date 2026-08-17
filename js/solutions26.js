/* 二星題庫（第九批 10 題） */
const SOL26 = {
10718: {
  q: "Bit Mask：給 32 位元的 N 與範圍 <code>[L, U]</code>，找出<b>最小的 M</b>（<code>L ≤ M ≤ U</code>）使得 <code>N | M</code> <b>最大</b>。",
  h: "先把目標拆清楚：<code>N | M</code> 的值，在 N 已經是 1 的位元上<b>恆為 1</b>；只有 N 為 0 的位元才由 M 決定。<br>所以要最大化 OR，就是<b>盡量從高位開始「點亮」N 的 0 位元</b>。<br><b>兩階段做法</b>：<br>① <b>決定必須點亮的位元集合 R</b>：由高位往低位，對每個 N 的 0 位元試著加進 R，只要「存在 <code>M ∈ [L, U]</code> 且 <code>M ⊇ R</code>」就保留。<br>② 答案 = <b>滿足 <code>M ⊇ R</code> 且 <code>M ≥ L</code> 的最小值</b>。<br>核心工具是 <code>minSuper(R, L)</code>：列舉「M 與 L 的共同前綴在第 k 位分歧（L 該位為 0、M 為 1）」，前綴必須already含 R 的高位、低位則只填 R 的位元，取所有 k 的最小值。O(32²) 每筆。",
  t: "① <b>不能只用「N 為 0 就把 M 設 1、否則設 0」的一次性貪心</b>——在 N 為 1 的位元上把 M 設 0 可能讓後面點不亮更高價值的位元。必須用「先定 R、再求最小超集」兩階段。<br>② 四組樣例都可以拿來驗：<code>100 50 60 → 59</code>、<code>100 0 100 → 27</code>、<code>1 0 100 → 100</code>。<br>③ 是 <b>unsigned 32 位元</b>，全程用 <code>long long</code> 才不會在 <code>1 &lt;&lt; 31</code> 出事。<br>④ <code>L</code> 本身若已包含 R，答案就是 L。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

// 最小的 M 使 (M & R) == R 且 M >= L；不存在回傳 -1
ll minSuper(ll R, ll L) {
    if ((L & R) == R) return L;                       // L 本身就合格
    ll best = -1;
    for (int k = 0; k < 32; k++) {
        if ((L >> k) & 1) continue;                   // 需要 L 這位是 0 才能往上跳
        ll high = (L >> (k + 1)) << (k + 1);          // 高位沿用 L
        ll Rhigh = (R >> (k + 1)) << (k + 1);
        if ((high & Rhigh) != Rhigh) continue;        // 高位必須已含 R
        ll M = high | (1LL << k) | (R & ((1LL << k) - 1));
        if (best < 0 || M < best) best = M;
    }
    return best;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll n, l, u;
    while (cin >> n >> l >> u) {
        ll R = 0;
        for (int i = 31; i >= 0; i--) {
            if ((n >> i) & 1) continue;               // N 已是 1，不必要求 M
            ll R2 = R | (1LL << i);
            ll m = minSuper(R2, l);
            if (m >= 0 && m <= u) R = R2;             // 點得亮就保留
        }
        cout << minSuper(R, l) << "\\n";
    }
    return 0;
}`
},

11742: {
  q: "Social Constraints：n（≤ 8）個人排成一列，有 m（≤ 20）條限制，形如 <code>a b d</code>：<code>d &gt; 0</code> 表示兩人距離<b>至多</b> d；<code>d &lt; 0</code> 表示距離<b>至少</b> |d|。求合法的排列數。",
  h: "n ≤ 8 ⇒ 排列只有 <code>8! = 40320</code> 種 ⇒ <b>直接全排列枚舉</b>，每種檢查 20 條限制，總共 80 萬次比較，遠低於時限。<br>寫法：<code>perm[i]</code> 表示第 i 個位置坐誰，再反查 <code>pos[perm[i]] = i</code>；限制就是對 <code>|pos[a] − pos[b]|</code> 做比較。<br><b>先估搜尋空間再決定要不要想聰明解</b>——這題估完就會發現完全不需要 DP 或狀壓，直接 <code>next_permutation</code> 最快也最不會錯。",
  t: "① 記得先 <code>sort</code>（或用 0..n−1 的初始序）再 <code>next_permutation</code>。<br>② <code>d</code> 的正負代表<b>相反的限制方向</b>，看錯就整個反了。<br>③ 需要 <b>pos 反查表</b>（誰坐在第幾個位置），直接用 perm 比較會算錯距離。<br>④ 答案最大 8! = 40320，int 就夠。<br>⑤ 輸入以 <code>0 0</code> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m;
    while (cin >> n >> m && (n || m)) {
        vector<int> A(m), B(m), D(m);
        for (int i = 0; i < m; i++) cin >> A[i] >> B[i] >> D[i];

        vector<int> perm(n), pos(n);
        for (int i = 0; i < n; i++) perm[i] = i;
        int cnt = 0;
        do {
            for (int i = 0; i < n; i++) pos[perm[i]] = i;      // 反查表
            bool ok = true;
            for (int i = 0; i < m && ok; i++) {
                int dist = abs(pos[A[i]] - pos[B[i]]);
                if (D[i] > 0 && dist > D[i]) ok = false;       // 至多
                if (D[i] < 0 && dist < -D[i]) ok = false;      // 至少
            }
            if (ok) cnt++;
        } while (next_permutation(perm.begin(), perm.end()));
        cout << cnt << "\\n";
    }
    return 0;
}`
},

10325: {
  q: "The Lottery：<code>1 … N</code> 之中，有幾個數<b>不能被</b>給定的 M（≤ 15）個數<b>任何一個</b>整除？",
  h: "「不被任何一個整除」= 總數減去「被至少一個整除」⇒ <b>排容原理（inclusion-exclusion）</b>。<br>M ≤ 15 ⇒ 直接<b>枚舉 2ᴹ = 32768 個子集合</b>：<br><code>|至少一個| = Σ (−1)^(|S|+1) × ⌊N / lcm(S)⌋</code><br>子集合元素個數為奇數就加、偶數就減。<br>答案 = <code>N − |至少一個|</code>。<br>複雜度 O(2ᴹ × M)，瞬殺。<br>（排容原理是處理「至少一個」「都不」這類計數的萬用工具，值得徹底熟練。）",
  t: "① <b>lcm 會爆掉</b>：15 個數的最小公倍數可能遠大於 N，計算時<b>一超過 N 就可以提前中止</b>（該子集合貢獻為 0），順便防溢位。<br>② lcm 要寫成 <code>a / gcd(a,b) * b</code>（<b>先除再乘</b>），直接 <code>a*b/gcd</code> 會先溢位。<br>③ 符號規則：子集合大小為<b>奇數加、偶數減</b>。<br>④ 全程 <code>long long</code>。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

ll gcd_(ll a, ll b) { return b ? gcd_(b, a % b) : a; }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll n; int m;
    while (cin >> n >> m) {
        vector<ll> a(m);
        for (int i = 0; i < m; i++) cin >> a[i];

        ll bad = 0;
        for (int s = 1; s < (1 << m); s++) {
            ll l = 1; int bits = 0; bool over = false;
            for (int i = 0; i < m; i++) {
                if (!(s >> i & 1)) continue;
                bits++;
                l = l / gcd_(l, a[i]) * a[i];                  // 先除再乘
                if (l > n) { over = true; break; }             // 提前中止兼防溢位
            }
            if (over) continue;
            bad += (bits % 2 ? 1 : -1) * (n / l);              // 奇加偶減
        }
        cout << n - bad << "\\n";
    }
    return 0;
}`
},

10368: {
  q: "Euclid's Game：兩人輪流，每次從<b>較大的數</b>減去<b>較小的數的任意正整數倍</b>（結果不可為負），把某個數變成 0 的人獲勝。Stan 先手，兩人都下最佳解，問誰贏。",
  h: "設 <code>a ≥ b</code>，遞迴判斷當前玩家是否必勝：<br>・<code>a % b == 0</code> ⇒ 可以一口氣減成 0，<b>當前玩家贏</b>。<br>・<code>a / b ≥ 2</code> ⇒ <b>當前玩家贏</b>。理由很妙：他可以選擇留下 <code>(b, a%b)</code> 或 <code>(b, a%b + b)</code> 這兩個局面之一，而這兩個局面<b>恰好一勝一敗</b>（它們互為一步之遙），所以他一定能把必敗局面丟給對手。<br>・否則（<code>a / b == 1</code>）只有一種走法 ⇒ 遞迴 <code>!win(b, a % b)</code>。<br>本質就是<b>歐幾里得演算法的每一步順便判斷勝負</b>，O(log)。",
  t: "① <code>a / b ≥ 2</code> 必勝的論證是本題的靈魂，想通就一行搞定；想不通會誤以為要做完整的博弈搜尋。<br>② 每次遞迴前要確保 <code>a ≥ b</code>（先 swap）。<br>③ 輸入的兩數<b>不保證大小順序</b>（樣例 <code>15 24</code> 就是小的在前）。<br>④ 輸出 <code>Stan wins</code> / <code>Ollie wins</code>（<b>沒有句號</b>）。<br>⑤ <code>0 0</code> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

bool win(ll a, ll b) {                                 // 保證 a >= b
    if (b == 0) return false;
    if (a % b == 0) return true;                       // 一口氣減成 0
    if (a / b >= 2) return true;                       // 可任選丟給對手必敗局
    return !win(b, a % b);                             // 只有一種走法
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll a, b;
    while (cin >> a >> b && (a || b)) {
        if (a < b) swap(a, b);
        cout << (win(a, b) ? "Stan wins" : "Ollie wins") << "\\n";
    }
    return 0;
}`
},

10881: {
  q: "Piotr's Ants：長 L 的木棒上有 n 隻螞蟻，各自向左或右以 1 cm/s 前進；<b>兩隻相撞時各自掉頭</b>。求 T 秒後每隻螞蟻（依<b>輸入順序</b>）的位置與方向，掉出木棒則輸出 <code>Fell off</code>。",
  h: "本題的經典洞見：<b>兩隻螞蟻相撞掉頭，等價於兩隻螞蟻直接穿過對方</b>（因為螞蟻都長一樣，交換身分不影響「位置的集合」）。<br>所以：<br>① 先把每隻螞蟻當成「幽靈」直接走 <code>pos + dir × T</code>，得到<b>最終位置的多重集合</b>。<br>② 但誰是誰？關鍵性質：<b>螞蟻永遠不會互相穿越，相對順序不變</b> ⇒ 把螞蟻依<b>初始位置</b>排序、把幽靈依<b>最終位置</b>排序，<b>第 k 名對應第 k 名</b>。<br>③ 若某個最終位置<b>有兩隻</b>螞蟻 ⇒ 它們正在相撞 ⇒ 輸出 <code>Turning</code>。<br>O(n log n)。這個「穿過等價」的技巧在很多題會再出現。",
  t: "① <b>相撞等價於穿過</b>——沒有這個洞見就得逐秒模擬，T 很大時必爆。<br>② 但「哪一隻是哪一隻」<b>必須靠相對順序還原</b>，不能直接把幽靈的身分當成原螞蟻。<br>③ 輸出要依<b>輸入順序</b>，所以要記錄原始索引。<br>④ 位置 <code>&lt; 0</code> 或 <code>&gt; L</code> ⇒ <code>Fell off</code>。<br>⑤ 同一位置有兩隻 ⇒ 印 <code>位置 Turning</code>（不印方向）。<br>⑥ 測資之間<b>沒有</b>空行，但每筆前有 <code>Case #k:</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;

struct A { int p; char d; int idx; };
bool byP(const A &x, const A &y) { return x.p < y.p; }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int tc = 1; tc <= T; tc++) {
        int L, t, n; cin >> L >> t >> n;
        vector<A> ant(n), ghost(n);
        for (int i = 0; i < n; i++) {
            int p; char d; cin >> p >> d;
            ant[i].p = p; ant[i].d = d; ant[i].idx = i;
            ghost[i].p = p + (d == 'R' ? t : -t);      // 幽靈直接穿過
            ghost[i].d = d; ghost[i].idx = i;
        }
        sort(ant.begin(), ant.end(), byP);             // 依初始位置
        sort(ghost.begin(), ghost.end(), byP);         // 依最終位置

        map<int, int> cnt;                             // 同位置有幾隻 → Turning
        for (int i = 0; i < n; i++) cnt[ghost[i].p]++;

        vector<string> ans(n);
        for (int k = 0; k < n; k++) {                  // 第 k 名對應第 k 名
            ostringstream os;
            if (ghost[k].p < 0 || ghost[k].p > L) os << "Fell off";
            else if (cnt[ghost[k].p] > 1) os << ghost[k].p << " Turning";
            else os << ghost[k].p << " " << ghost[k].d;
            ans[ant[k].idx] = os.str();
        }
        cout << "Case #" << tc << ":\\n";
        for (int i = 0; i < n; i++) cout << ans[i] << "\\n";
    }
    return 0;
}`
},

10284: {
  q: "Chessboard in FEN：讀入 FEN 格式的棋盤（<code>/</code> 分隔各列、<b>數字代表連續幾個空格</b>、大寫白棋小寫黑棋），求<b>沒有棋子且不被任何一方攻擊</b>的格子數。",
  h: "兩步：<b>解析 FEN</b> + <b>標記攻擊格</b>。<br>解析：逐字元掃，遇數字就<b>跳過那麼多格</b>（填成空），遇字母就放棋子，遇 <code>/</code> 就換列。<br>攻擊：對每個棋子產生它能攻擊到的格子，全部標記起來（<b>不分敵我</b>，題目要的是「不被任何棋子攻擊」）。<br>・兵：<b>白兵斜上、黑兵斜下</b><br>・馬：8 個固定偏移<br>・車／象／后：沿方向滑行，<b>碰到任何棋子就停</b>（該格仍算被攻擊）<br>・王：8 個方向各一步<br>最後數「是空格 且 沒被標記」的格子數。跟 10196 是同一套骨架，只是輸出的東西不同。",
  t: "① <b>數字代表空格數</b>，可能是 1~8；解析時要正確推進欄位指標。<br>② 攻擊<b>不分顏色</b>——白棋攻擊到的空格與黑棋攻擊到的空格都要排除。<br>③ 兵的方向仍是最大的坑：白兵往<b>列號變小</b>的方向斜吃。<br>④ 滑行棋子<b>不能穿透</b>。<br>⑤ 題目說「不一定是合法棋局」，所以可能沒有王、或有很多同色棋，程式不要做額外假設。<br>⑥ 每行一筆測資，讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

char b[8][8];
bool atk[8][8];
int dr8[] = {1, -1, 0, 0, 1, 1, -1, -1};
int dc8[] = {0, 0, 1, -1, 1, -1, 1, -1};              // 前 4 直、後 4 斜
int kr[] = {1, 1, -1, -1, 2, 2, -2, -2};
int kc[] = {2, -2, 2, -2, 1, -1, 1, -1};

bool inb(int r, int c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string s;
    while (cin >> s) {
        memset(b, '.', sizeof b);
        memset(atk, 0, sizeof atk);
        int r = 0, c = 0;
        for (size_t i = 0; i < s.size(); i++) {
            if (s[i] == '/') { r++; c = 0; }
            else if (isdigit((unsigned char)s[i])) c += s[i] - '0';   // 跳過空格
            else b[r][c++] = s[i];
        }
        for (int i = 0; i < 8; i++)
            for (int j = 0; j < 8; j++) {
                char p = b[i][j];
                if (p == '.') continue;
                char t = tolower((unsigned char)p);
                if (t == 'p') {                                       // 兵：斜吃
                    int d = isupper((unsigned char)p) ? -1 : 1;
                    for (int dc = -1; dc <= 1; dc += 2)
                        if (inb(i + d, j + dc)) atk[i + d][j + dc] = true;
                } else if (t == 'n') {
                    for (int k = 0; k < 8; k++)
                        if (inb(i + kr[k], j + kc[k])) atk[i + kr[k]][j + kc[k]] = true;
                } else {
                    int lo = (t == 'b') ? 4 : 0, hi = (t == 'r') ? 4 : 8;
                    for (int k = lo; k < hi; k++) {
                        int nr = i + dr8[k], nc = j + dc8[k];
                        while (inb(nr, nc)) {
                            atk[nr][nc] = true;
                            if (b[nr][nc] != '.') break;              // 不能穿透
                            if (t == 'k') break;                      // 王只走一步
                            nr += dr8[k]; nc += dc8[k];
                        }
                    }
                }
            }
        int ans = 0;
        for (int i = 0; i < 8; i++)
            for (int j = 0; j < 8; j++)
                if (b[i][j] == '.' && !atk[i][j]) ans++;
        cout << ans << "\\n";
    }
    return 0;
}`
},

10408: {
  q: "Farey sequences：<code>Fₙ</code> 是所有分母 ≤ n 的<b>最簡真分數</b>（0 &lt; 分數 ≤ 1）由小到大排列。給 n 與 k，輸出 <code>Fₙ</code> 的<b>第 k 項</b>。",
  h: "不需要把整個序列建出來排序，Farey 序列有一條漂亮的<b>下一項遞推式</b>：<br>已知連續兩項 <code>a/b</code> 與 <code>c/d</code>，則下一項 <code>e/f</code> 為<br><code>k = ⌊(n + b) / d⌋</code>、<code>e = k·c − a</code>、<code>f = k·d − b</code><br>本題的序列<b>不含 0/1</b>、從 <code>1/n</code> 開始（樣例 <code>F₅</code> 的第 1 項是 1/5、第 10 項是 1/1）。<br>所以令 <code>a/b = 0/1</code>、<code>c/d = 1/n</code>（第 1 項），再往後遞推 k−1 次即可。<br>每步 O(1)，k 最多幾十萬 ⇒ 一次掃完，<b>不用排序也不用存整個序列</b>。",
  t: "① <b>起始的兩項要設對</b>：<code>0/1</code>（虛擬前一項）與 <code>1/n</code>（真正的第 1 項）。<br>② 序列<b>不含 0/1</b>，第 1 項就是 1/n——這是索引最容易差一的地方。<br>③ 遞推式中的 <code>k</code> 用<b>整數除法</b>。<br>④ 全程整數，不需要 gcd 也不會有浮點誤差。<br>⑤ 輸出格式是 <code>p/q</code>（沒有空白），最後一項是 <code>1/1</code>。<br>⑥ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll n, k;
    while (cin >> n >> k) {
        ll a = 0, b = 1, c = 1, d = n;                 // 第 1 項是 c/d = 1/n
        for (ll i = 1; i < k; i++) {                   // 往後推 k-1 次
            ll t = (n + b) / d;
            ll e = t * c - a, f = t * d - b;
            a = c; b = d; c = e; d = f;
        }
        cout << c << "/" << d << "\\n";
    }
    return 0;
}`
},

10015: {
  q: "Joseph's Cousin：n 個人圍成圈，<b>第 i 次淘汰的間隔是第 i 個質數</b>（2, 3, 5, 7, …）。求最後倖存者的<b>原始編號</b>。",
  h: "約瑟夫問題的變形，因為間隔<b>每輪都不同</b>，沒有簡潔的閉式解 ⇒ 直接<b>用 <code>vector</code> 模擬</b>。<br>維護一個目前還活著的人的清單，游標 <code>pos</code>：<br><code>pos = (pos + prime[i] − 1) % 目前人數</code>，然後 <code>erase</code> 掉那個位置。<br>n ≤ 3501 ⇒ 最多 3500 次 erase、每次 O(n) 搬移 ⇒ 約 600 萬次操作，完全可行。<br>質數要<b>先篩好前 3501 個</b>（第 3501 個質數約 32000，篩到 40000 綽綽有餘）。<br>（若 n 更大就要換成樹狀陣列或平衡樹來做「找第 k 個存活者」。）",
  t: "① <b>質數表要先建好</b>，每輪重新找質數會慢。<br>② 游標公式的 <code>−1</code> 不能少：從目前位置開始數，第 m 個是 <code>(pos + m − 1) % size</code>。<br>③ <code>erase</code> 之後 <code>pos</code> <b>不用再加</b>（後面的人自動遞補到這個索引），但要對新的 size 取模。<br>④ 人的編號從 1 開始。<br>⑤ 輸入以 <b>0</b> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const int LIM = 40000;
    vector<char> comp(LIM + 1, 0);
    vector<int> pr;
    for (int i = 2; i <= LIM && (int)pr.size() < 3600; i++) {
        if (comp[i]) continue;
        pr.push_back(i);
        for (long long j = (long long)i * i; j <= LIM; j += i) comp[j] = 1;
    }

    int n;
    while (cin >> n && n) {
        vector<int> v(n);
        for (int i = 0; i < n; i++) v[i] = i + 1;
        int pos = 0;
        for (int i = 0; i < n - 1; i++) {
            pos = (pos + pr[i] - 1) % v.size();        // 從目前位置數第 pr[i] 個
            v.erase(v.begin() + pos);
            if (!v.empty()) pos %= v.size();           // 後面的人自動遞補
        }
        cout << v[0] << "\\n";
    }
    return 0;
}`
},

245: {
  q: "Uncompress：壓縮檔中的<b>數字 k</b> 代表「<b>最近使用過的第 k 個單字</b>」。還原原文：遇到單字就直接輸出、遇到數字就換成對應的單字；<b>每次使用後該單字都移到最前面</b>。非字母字元原樣輸出。",
  h: "維護一個「<b>最近使用列表</b>」（MRU list），用 <code>vector&lt;string&gt;</code> 或 <code>list</code> 即可：<br>・讀到<b>單字</b> ⇒ 輸出它，並把它<b>移到列表最前面</b>（若原本在列表中就先移除）。<br>・讀到<b>數字 k</b> ⇒ 輸出列表第 k 個（1-based），並把它<b>移到最前面</b>。<br>・讀到<b>其他字元</b> ⇒ 直接輸出。<br>樣例值得跟一遍：<code>do it--1</code> 時列表最前面是 <code>it</code> ⇒ <code>1</code> 還原成 <code>it</code>；之後的 <code>4</code> 對應到 <code>please</code>。<br>單字<b>區分大小寫</b>（<code>Please</code> 與 <code>please</code> 是兩個項目）。",
  t: "① <b>每次使用（不論是單字還是數字引用）都要把該詞移到最前</b>——這是整題的核心規則，漏了就全錯。<br>② 索引是 <b>1-based</b>。<br>③ 單字<b>區分大小寫</b>。<br>④ 非字母字元（標點、空白、換行）要<b>原樣輸出</b>，所以要逐字元讀（<code>cin.get()</code>），不能用 <code>&gt;&gt;</code> 吃掉空白。<br>⑤ 數字可能是多位數，要完整讀完。",
  c: `#include <bits/stdc++.h>
using namespace std;

vector<string> mru;

void use(const string &w) {                            // 移到最前面
    for (size_t i = 0; i < mru.size(); i++)
        if (mru[i] == w) { mru.erase(mru.begin() + i); break; }
    mru.insert(mru.begin(), w);
}

int main() {
    char ch;
    while (cin.get(ch)) {
        if (isalpha((unsigned char)ch)) {
            string w;
            while (isalpha((unsigned char)ch)) { w += ch; if (!cin.get(ch)) { ch = 0; break; } }
            cout << w;
            use(w);
            if (ch) cout << ch;                        // 把終止字元一起輸出
        } else if (isdigit((unsigned char)ch)) {
            int k = 0;
            while (isdigit((unsigned char)ch)) { k = k * 10 + (ch - '0'); if (!cin.get(ch)) { ch = 0; break; } }
            string w = mru[k - 1];                     // 1-based
            cout << w;
            use(w);
            if (ch) cout << ch;
        } else cout << ch;
    }
    return 0;
}`
},

11093: {
  q: "Just Finish it up：環狀跑道上有 n 個加油站，第 i 站有 <code>pᵢ</code> 加侖油，開到下一站要 <code>qᵢ</code> 加侖。車子油箱起初是空的，求<b>能完成一整圈的最小起點編號</b>；不可能則輸出無解。",
  h: "經典的<b>一次掃描貪心</b>：<br>令 <code>diff[i] = p[i] − q[i]</code>。<br>① 若 <code>Σ diff &lt; 0</code> ⇒ 油總量不夠，<b>任何起點都不可能</b>。<br>② 否則一定有解，用一次掃描找出來：從 0 開始累加，<b>一旦累計油量變成負數，就把起點改成下一站、累計歸零</b>。<br>為什麼正確？若從 s 出發在 i 處耗盡，那麼 <b>s 到 i 之間的任何一站當起點也一定會在 i 之前耗盡</b>（因為從中途出發時油更少），所以可以整段跳過。<br>O(n)，一次掃完。",
  t: "① <b>總量檢查與掃描要分開</b>：掃描只找「候選起點」，可行性由總和決定。<br>② 「中途任一站當起點也會失敗」的論證是貪心成立的關鍵，值得想通。<br>③ 站號輸出是 <b>1-based</b>（樣例答案是 station 4，對應索引 3）。<br>④ 輸出格式 <code>Case k: Possible from station X</code> 或 <code>Case k: Not possible</code>。<br>⑤ n 可能很大，用 <code>long long</code> 累加最安全。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int tc = 1; tc <= T; tc++) {
        int n; cin >> n;
        vector<ll> p(n), q(n);
        for (int i = 0; i < n; i++) cin >> p[i];
        for (int i = 0; i < n; i++) cin >> q[i];

        ll total = 0, tank = 0;
        int start = 0;
        for (int i = 0; i < n; i++) {
            ll d = p[i] - q[i];
            total += d;
            tank += d;
            if (tank < 0) { start = i + 1; tank = 0; }   // 整段跳過
        }
        cout << "Case " << tc << ": ";
        if (total < 0) cout << "Not possible\\n";
        else cout << "Possible from station " << start + 1 << "\\n";
    }
    return 0;
}`
}
};

/* 歷屆補完（第十批 5 題，收尾） */
const SOL17 = {
709: {
  q: "e-mail 排版：把一段文字重排成<b>每行寬度都恰好等於 W</b>（靠插入空白），一個 <code>s</code> 格的空隙<b>醜度 = (s − 1)²</b>，目標是總醜度最小。只有一個單字的行醜度 500（除非剛好填滿）。同醜度時：<b>比較第一個長度不同的空隙，較小者勝</b>。",
  h: "<b>(1) 單行醜度</b>：一行放 g 個空隙、共 S 格空白，最公平的分法最省——<code>q = S / g</code>、<code>rr = S % g</code>，得到 <code>rr</code> 個 <code>q+1</code> 與 <code>g − rr</code> 個 <code>q</code>，醜度 <code>= rr·q² + (g − rr)·(q − 1)²</code>。<br><b>(2) 斷行 DP</b>：<code>best[i] = min(lineCost(i, j) + best[j])</code>，由右往左推。每行最多塞 W/2 個單字，所以是 O(單字數 × W)。<br><b>(3) 平手規則</b>：要讓空隙序列<b>字典序最小</b> ⇒ 同一行內<b>大的空隙一律往右擺</b>（樣例的 2 2 2 3 正是如此）；斷行點則在所有最佳解中挑空隙序列最小者。",
  unsure: true,
  t: "① 醜度是 <code>(s − 1)²</code> 不是 <code>s²</code>——單一空白的醜度是 0。用樣例驗算：1 + 7² = 50 對上重排後的 1+1+1+4+1+4 = 12 ✓。<br>② <b>最後一行也要填滿</b> W，這跟一般的排版題不同。<br>③ 單字行是特例：靠左放，短於 W 就記 500。<br>④ 平手規則決定「大空隙放右邊」，放左邊會 WA。<br>⑤ 段落之間<b>剛好一個空行</b>，輸出每段後也要空一行。<br>⑥ 斷行點平手時的比較（空隙序列跨行延續）本解採「先比本行、再偏好單字較多者」的近似策略，是本題最不確定的一環。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll INF = (ll)4e18;

int W;
vector<string> words;
vector<ll> pre;                         // 單字長度前綴和

ll lineCost(int i, int j) {             // 放 words[i..j)
    int g = j - i - 1;                  // 空隙數
    ll L = pre[j] - pre[i];
    ll S = W - L;                       // 要塞進去的空白總數
    if (g == 0) return (L == W) ? 0 : 500;
    if (S < g) return INF;              // 每個空隙至少 1 格，塞不下
    ll q = S / g, rr = S % g;
    return rr * q * q + (ll)(g - rr) * (q - 1) * (q - 1);
}

vector<int> gapsOf(int i, int j) {      // 該行的空隙長度序列（大的擺右邊）
    int g = j - i - 1;
    vector<int> v;
    if (g <= 0) return v;
    ll S = W - (pre[j] - pre[i]);
    ll q = S / g, rr = S % g;
    for (int t = 0; t < g - rr; t++) v.push_back((int)q);
    for (int t = 0; t < rr; t++) v.push_back((int)q + 1);
    return v;
}

int main() {
    string line;
    while (getline(cin, line)) {
        istringstream hs(line);
        if (!(hs >> W)) continue;                       // 找到寬度那一行
        words.clear();
        while (getline(cin, line)) {
            bool blank = true;
            for (size_t i = 0; i < line.size(); i++)
                if (!isspace((unsigned char)line[i])) { blank = false; break; }
            if (blank) break;
            istringstream is(line);
            string w;
            while (is >> w) words.push_back(w);
        }
        int n = words.size();
        if (n == 0) continue;

        pre.assign(n + 1, 0);
        for (int i = 0; i < n; i++) pre[i + 1] = pre[i] + (ll)words[i].size();

        vector<ll> best(n + 1, INF);
        best[n] = 0;
        for (int i = n - 1; i >= 0; i--)
            for (int j = i + 1; j <= n; j++) {
                if (pre[j] - pre[i] + (j - i - 1) > W) break;   // 再多就一定塞不下
                ll c = lineCost(i, j);
                if (c < INF && best[j] < INF) best[i] = min(best[i], c + best[j]);
            }

        // 由左往右重建：同醜度時挑空隙序列字典序最小的斷點
        int i = 0;
        while (i < n) {
            int pick = -1;
            vector<int> pg;
            for (int j = i + 1; j <= n; j++) {
                if (pre[j] - pre[i] + (j - i - 1) > W) break;
                ll c = lineCost(i, j);
                if (c >= INF || best[j] >= INF || c + best[j] != best[i]) continue;
                vector<int> g = gapsOf(i, j);
                bool better = (pick < 0);
                if (!better) {
                    size_t t = 0;
                    while (t < g.size() && t < pg.size() && g[t] == pg[t]) t++;
                    if (t < g.size() && t < pg.size()) better = g[t] < pg[t];
                    else better = g.size() > pg.size();     // 前綴相同 → 偏好單字較多者
                }
                if (better) { pick = j; pg = g; }
            }
            if (pick < 0) pick = i + 1;                     // 保險
            for (int t = i; t < pick; t++) {
                cout << words[t];
                if (t + 1 < pick) cout << string(pg[t - i], ' ');
            }
            cout << "\\n";
            i = pick;
        }
        cout << "\\n";
    }
    return 0;
}`
},

1101: {
  q: "To Add or to Multiply：處理器只有兩種指令——<code>A</code>（加 a）與 <code>M</code>（乘 m）。給 <code>a, m, p, q, r, s</code>，要寫出<b>最短</b>的程式，使得<b>任何</b> <code>p ≤ x ≤ q</code> 的輸入都會得到 <code>r ≤ 輸出 ≤ s</code>。等長時取<b>字典序最小</b>（A &lt; M）。無解印 <code>impossible</code>，空程式印 <code>empty</code>。",
  h: "設程式是 <code>A^c₀ M A^c₁ M … M A^c_k</code>（k 個 M），則<br><code>f(x) = x·mᵏ + a·T</code>，其中 <code>T = Σ cᵢ·m^(k−i)</code>。<br>f 遞增 ⇒ 只要檢查兩端：<code>f(p) ≥ r</code> 且 <code>f(q) ≤ s</code>，化為 <b>T 的一段區間</b> <code>[Tlo, Thi]</code>。<br>再來，<b>給定 T，最少要幾個 A？</b> 權重是 m 的冪次（標準進位制）⇒ <b>貪心 = 把 T 寫成 m 進位，各位數字相加</b>（最高位可超出，就是 <code>T / mᵏ</code>）：<code>n(T) = T / mᵏ + digitsum_m(T mod mᵏ)</code>。<br>於是對每個 k：在 <code>[Tlo, Thi]</code> 裡找 <code>n(T)</code> 最小的 T（列舉最高位 h，低位用<b>數位 DP 求區間內最小數字和</b>）。<br><b>字典序</b>：同樣長度時 A 越早越好 ⇒ c₀ 越大越好 ⇒ 相同 n 之下<b>取最大的 T</b>（相同數字和時，數值越大代表權重越集中在高位）。",
  unsure: true,
  t: "① 只驗 <code>p</code> 與 <code>q</code> 兩端就夠——f 對 x 嚴格遞增，這是整題的第一個關鍵。<br>② 「最少 A 數」= m 進位<b>數字和</b>，因為 m 的冪次是標準（canonical）進位系統，貪心最佳。<br>③ 字典序最小 ⇔ 相同長度下 <b>T 最大</b>（同數字和時數值大 = 權重集中在高位 = A 集中在前面）。<br>④ k 的上限由 <code>q·mᵏ ≤ s</code> 決定（否則 Thi &lt; 0），約 30 以內；<code>m = 1</code> 要特判避免無窮迴圈。<br>⑤ 除法要用<b>向下 / 向上取整的整數版本</b>，分子可能是負的。<br>⑥ 四組樣例（1A 2M / 1M 2A 1M / impossible / empty）本解都已逐步驗算吻合。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll BIG = (ll)4e18;

int m_, K;
vector<int> LOD, HID;                   // lo / hi 的 m 進位表示（高位在前，長度 K）
vector<ll> pw;
pair<ll, ll> memo_[40][2][2];
bool done_[40][2][2];

// 回傳 (最小數字和, 在最小數字和之下能取到的最大數值)
pair<ll, ll> dfs(int pos, int tl, int th) {
    if (pos == K) return make_pair(0LL, 0LL);
    if (done_[pos][tl][th]) return memo_[pos][tl][th];
    done_[pos][tl][th] = true;
    int lo = tl ? LOD[pos] : 0;
    int hi = th ? HID[pos] : m_ - 1;
    pair<ll, ll> best = make_pair(BIG, -1LL);
    for (int d = lo; d <= hi; d++) {
        pair<ll, ll> sub = dfs(pos + 1, tl && d == LOD[pos], th && d == HID[pos]);
        if (sub.first >= BIG) continue;
        ll s = d + sub.first, v = d * pw[K - 1 - pos] + sub.second;
        if (s < best.first || (s == best.first && v > best.second))
            best = make_pair(s, v);
    }
    return memo_[pos][tl][th] = best;
}

void toDigits(ll x, vector<int> &d) {
    d.assign(K, 0);
    for (int i = K - 1; i >= 0; i--) { d[i] = (int)(x % m_); x /= m_; }
}

ll ceilDiv(ll x, ll y) { return x >= 0 ? (x + y - 1) / y : -((-x) / y); }
ll floorDiv(ll x, ll y) { return x >= 0 ? x / y : -(((-x) + y - 1) / y); }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll a, m, p, q, r, s;
    int cs = 1;
    while (cin >> a >> m >> p >> q >> r >> s) {
        if (!a && !m && !p && !q && !r && !s) break;
        m_ = (int)m;

        ll bestLen = BIG;
        vector<ll> bestC;
        ll M = 1;
        for (int k = 0; ; k++) {
            if (k > 0) {
                if (m <= 1) break;                       // 乘 1 沒有意義
                if (M > s / q) break;                    // q·mᵏ 已超過 s
                M *= m;
            }
            ll Tlo = max(0LL, ceilDiv(r - p * M, a));
            ll Thi = floorDiv(s - q * M, a);
            if (Thi < Tlo) { if (k > 30) break; continue; }

            ll bn, bt;
            if (k == 0) { bn = Tlo; bt = Tlo; }          // M = 1 ⇒ n(T) = T，取最小的 T
            else {
                K = k; pw.assign(K + 1, 1);
                for (int i = 1; i <= K; i++) pw[i] = pw[i - 1] * m;
                bn = BIG; bt = -1;
                ll hmax = Thi / M;
                for (ll h = Tlo / M; h <= hmax && h <= bn; h++) {
                    ll llo = max(0LL, Tlo - h * M), lhi = min(M - 1, Thi - h * M);
                    if (llo > lhi) continue;
                    toDigits(llo, LOD); toDigits(lhi, HID);
                    memset(done_, 0, sizeof done_);
                    pair<ll, ll> got = dfs(0, 1, 1);
                    if (got.first >= BIG) continue;
                    ll n = h + got.first, T = h * M + got.second;
                    if (n < bn || (n == bn && T > bt)) { bn = n; bt = T; }
                }
                if (bt < 0) continue;
            }

            ll len = k + bn;
            if (len > bestLen) continue;
            // 由 T 還原係數向量（貪心 = m 進位）
            vector<ll> c(k + 1, 0);
            ll MM = 1;
            for (int i = 0; i < k; i++) MM *= m;
            c[0] = bt / MM;
            ll rem = bt % MM;
            for (int i = 1; i <= k; i++) { MM /= m; c[i] = rem / MM; rem %= MM; }

            bool take = (len < bestLen);
            if (!take && len == bestLen) {               // 等長 → 比字典序（cᵢ 大者較小）
                for (size_t i = 0; i < c.size() && i < bestC.size(); i++)
                    if (c[i] != bestC[i]) { take = c[i] > bestC[i]; break; }
            }
            if (take) { bestLen = len; bestC = c; }
        }

        cout << "Case " << cs++ << ": ";
        if (bestLen >= BIG) { cout << "impossible\\n"; continue; }
        if (bestLen == 0) { cout << "empty\\n"; continue; }
        // 輸出成 "3A 2M" 這種連續段
        vector<pair<char, ll> > run;
        for (size_t i = 0; i < bestC.size(); i++) {
            if (bestC[i] > 0) run.push_back(make_pair('A', bestC[i]));
            if (i + 1 < bestC.size()) {
                if (!run.empty() && run.back().first == 'M') run.back().second++;
                else run.push_back(make_pair('M', 1LL));
            }
        }
        for (size_t i = 0; i < run.size(); i++)
            cout << (i ? " " : "") << run[i].second << run[i].first;
        cout << "\\n";
    }
    return 0;
}`
},

798: {
  q: "拼圖：<code>w × h</code>（≤ 100）的矩形，要用給定的磁磚<b>全部</b>拼滿。相同尺寸的磁磚屬於同一「相似組」（<b>同組磁磚不可區分</b>），磁磚<b>可以旋轉</b>。求不同拼法的總數。",
  h: "標準的<b>精確覆蓋回溯</b>，關鍵是<b>固定枚舉順序</b>以避免重複計數：<br><b>每次都找「列優先順序下第一個空格」</b>，那個格子一定是覆蓋它的磁磚的<b>左上角</b>（因為它左邊與上面都已填滿）。所以只要枚舉「哪一組、哪個方向」放在這個位置即可，每種拼法<b>恰好被生成一次</b>。<br>同組磁磚不可區分 ⇒ 回溯時只動<b>組的剩餘數量</b>，不去區分是第幾塊。<br>正方形磁磚只有一種擺法，要去重。<br>樣例 1（3×2，兩塊 1×1 + 兩塊 1×2）手算的 11 種正好對上，也確認了<b>磁磚可旋轉</b>。",
  unsure: true,
  t: "① 「第一個空格必為左上角」是<b>不重複計數的保證</b>；若改成隨機找位置就會重複。<br>② 磁磚<b>可旋轉</b>（樣例 11 種必須把 1×2 橫放才湊得出來）。<br>③ 正方形磁磚的兩個方向相同，要去重否則答案翻倍。<br>④ 答案可能很大，用 <code>long long</code>（甚至 unsigned）。<br>⑤ 題目保證一定拼得完且所有磁磚都用得到。<br>⑥ 最壞情況仍是指數級，本解仰賴測資規模友善——這是唯一的風險。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int W, H, n;
int tw[15][2], th[15][2], ocnt[15];     // 每組最多兩種擺法
int nori[15], cnt[15];
bool g[105][105];
ll ans;

void dfs(int filled) {
    if (filled == W * H) { ans++; return; }
    int r = -1, c = -1;                                 // 列優先的第一個空格
    for (int i = 0; i < H && r < 0; i++)
        for (int j = 0; j < W; j++)
            if (!g[i][j]) { r = i; c = j; break; }

    for (int k = 0; k < n; k++) {
        if (cnt[k] == 0) continue;
        for (int o = 0; o < nori[k]; o++) {
            int a = tw[k][o], b = th[k][o];             // a = 寬, b = 高
            if (c + a > W || r + b > H) continue;
            bool ok = true;
            for (int i = r; i < r + b && ok; i++)
                for (int j = c; j < c + a; j++)
                    if (g[i][j]) { ok = false; break; }
            if (!ok) continue;
            for (int i = r; i < r + b; i++) for (int j = c; j < c + a; j++) g[i][j] = true;
            cnt[k]--;
            dfs(filled + a * b);
            cnt[k]++;
            for (int i = r; i < r + b; i++) for (int j = c; j < c + a; j++) g[i][j] = false;
        }
    }
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    while (cin >> W >> H >> n) {
        for (int k = 0; k < n; k++) {
            int m, a, b; cin >> m >> a >> b;
            cnt[k] = m;
            tw[k][0] = a; th[k][0] = b;
            if (a == b) nori[k] = 1;                    // 正方形只有一種擺法
            else { nori[k] = 2; tw[k][1] = b; th[k][1] = a; }
        }
        memset(g, 0, sizeof g);
        ans = 0;
        dfs(0);
        cout << ans << "\\n";
    }
    return 0;
}`
},

1746: {
  q: "String Theory：<b>1-引號</b>= 以引號開頭、引號結尾、中間沒有引號；<b>k-引號</b>= 以 k 個引號開頭、k 個引號結尾，中間夾著<b>非空的 (k−1)-引號序列</b>（之間可插入任意非引號字元）。<br>給一個字串的描述（<code>a₁</code> 個引號、一段文字、<code>a₂</code> 個引號、文字…、<code>aₙ</code> 個引號），求它最大能算是幾-引號；沒有就印 <code>no quotation</code>。",
  h: "把整個字串抽象成一串<b>引號的編號 0..P−1</b>，只保留一個資訊：<code>相鄰兩個引號是否在同一段</code>（同段代表中間沒有文字）。<br><b>關鍵化簡：1-引號恰好就是「任意兩個相鄰的引號」</b>（中間沒有其他引號即可，有沒有文字都行）⇒ 一段連續引號能組成 1-引號序列 <b>⟺ 個數是正偶數</b>。<br>接著兩個互相遞迴的判定：<br><code>Q(j, l, r)</code>：l..r 是否為一個 j-引號 = 開頭 j 個同段、結尾 j 個同段、且中段是 <code>S(j−1, l+j, r−j)</code>。<br><code>S(j, x, y)</code>：x..y 能否切成 ≥1 個 j-引號 = 枚舉第一個的結尾 z。<br>答案從 <code>k = min(a₁, aₙ)</code> 往下試第一個成立的。",
  unsure: true,
  t: "① <b>開頭那 k 個引號必須連續在同一段</b>（字串「以 k 個引號開頭」），結尾同理——這是最容易漏掉的條件。<br>② 1-引號允許中間<b>完全沒有字元</b>（<code>''</code> 也算），所以純引號串也可能是合法的巢狀引號。<br>③ 中段必須<b>非空</b>（至少一個 (k−1)-引號），k 越大所需引號數越多（最少 k(k+1) 個）。<br>④ 記憶化用 <code>(層數, 起, 迄)</code> 當鍵；<b>最壞情況狀態量很大，這是本解最大的風險</b>，實測資料若偏大可能 TLE。<br>⑤ 相鄰引號「是否同段」要正確建表，否則開頭/結尾的連續性會判錯。",
  c: `#include <bits/stdc++.h>
using namespace std;

int P;
vector<int> runOf;                          // 每個引號屬於第幾段
unordered_map<long long, char> memoQ, memoS;

bool S_(int j, int x, int y);

bool Q_(int j, int l, int r) {              // l..r 是否恰好是一個 j-引號
    if (l > r) return false;
    if (j == 1) return r == l + 1;          // 1-引號 = 相鄰兩個引號
    if (l + j > r - j) return false;        // 中段必須非空
    if (runOf[l] != runOf[l + j - 1]) return false;     // 開頭 j 個要同段
    if (runOf[r - j + 1] != runOf[r]) return false;     // 結尾 j 個要同段
    long long key = ((long long)j * 20005 + l) * 20005 + r;
    unordered_map<long long, char>::iterator it = memoQ.find(key);
    if (it != memoQ.end()) return it->second != 0;
    bool res = S_(j - 1, l + j, r - j);
    memoQ[key] = res ? 1 : 0;
    return res;
}

bool S_(int j, int x, int y) {              // x..y 能否切成 >=1 個 j-引號
    if (x > y) return false;
    if (j == 1) { int c = y - x + 1; return c >= 2 && c % 2 == 0; }
    long long key = ((long long)j * 20005 + x) * 20005 + y;
    unordered_map<long long, char>::iterator it = memoS.find(key);
    if (it != memoS.end()) return it->second != 0;
    memoS[key] = 0;                         // 先擋住，避免自我遞迴
    bool res = false;
    for (int z = x + 2 * j - 1; z <= y && !res; z++) {
        if (!Q_(j, x, z)) continue;
        if (z == y || S_(j, z + 1, y)) res = true;
    }
    memoS[key] = res ? 1 : 0;
    return res;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        int n; cin >> n;
        vector<int> a(n);
        for (int i = 0; i < n; i++) cin >> a[i];

        runOf.clear();
        for (int i = 0; i < n; i++)
            for (int j = 0; j < a[i]; j++) runOf.push_back(i);
        P = runOf.size();
        memoQ.clear(); memoS.clear();

        int ans = -1;
        for (int k = min(a[0], a[n - 1]); k >= 1 && ans < 0; k--)
            if (Q_(k, 0, P - 1)) ans = k;

        if (ans < 0) cout << "no quotation\\n";
        else cout << ans << "\\n";
    }
    return 0;
}`
},

13204: {
  q: "Count these Permutations：計算 1..n 的排列中，滿足某個條件（條件式含 <code>⌊n/2⌋</code>）的個數，答案模 10⁹+7。最多 1000 筆詢問，<code>n ≤ 10⁶</code>。",
  h: "<b>先說明一件事：這一題的條件式在 PDF 轉檔時被吃掉了</b>（原文只剩「Count the number of permutations a₁,…,aₙ of (1,…,n) such that … ⌊n/2⌋」），我沒有把握還原成哪一個條件，所以<b>不敢保證下面的遞迴式是對的</b>。<br>但這類題的<b>解題框架是固定的、也是真正該學的部分</b>：<br>① n 到 10⁶、詢問到 1000 筆 ⇒ 一定是「<b>離線預處理一張表 → 每筆 O(1) 查表</b>」，絕不是每筆重算。<br>② 排列計數題的遞推通常來自「<b>看第 n 個位置怎麼擺</b>」，切成幾個互斥情形後相加。<br>③ 全程對 10⁹+7 取模，相乘前轉 <code>long long</code>。<br>下面的程式碼採用最常見的一種讀法 <code>|aᵢ − i| ≤ 1</code>（此時答案是<b>費氏數</b>：第 n 個位置放 n，或與 n−1 對調）。<b>若判錯請以官方題敘為準，只保留框架即可。</b>",
  unsure: true,
  t: "① <b>本題條件式未能還原</b>，遞推式僅為推測，請務必去 uHunt / vjudge 對照原文再送出。<br>② 框架本身是通用的：<b>預處理表 + O(1) 查詢</b>，n ≤ 10⁶ 開 <code>vector&lt;int&gt;</code> 約 4 MB，安全。<br>③ 取模要在<b>每一次加法與乘法後</b>都做。<br>④ 這類題若改成「恰好 ⌊n/2⌋ 個固定點」之類，就要換成<b>錯排數 + 組合數</b>：<code>C(n, ⌊n/2⌋) × D(n − ⌊n/2⌋)</code>，同樣預處理階乘與反元素即可，框架不變。<br>⑤ 以本題 0% 的過題率與極低的出題機率，考場上遇到就直接跳過，不值得花時間。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll MOD = 1000000007;
const int MAXN = 1000001;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);

    // 通用框架：離線預處理整張表，之後每筆詢問 O(1)
    // 下面採用「|a[i] - i| <= 1」的讀法：第 n 位放自己，或與 n-1 對調
    //   f[n] = f[n-1] + f[n-2]          （即費氏數）
    // ※ 原題條件式在轉檔中遺失，此遞推僅為推測，請對照官方題敘後再調整這一行
    vector<int> f(MAXN);
    f[0] = 1; f[1] = 1;
    for (int i = 2; i < MAXN; i++) f[i] = (int)(((ll)f[i - 1] + f[i - 2]) % MOD);

    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        int n; cin >> n;
        cout << f[n] << "\\n";
    }
    return 0;
}`
}
};

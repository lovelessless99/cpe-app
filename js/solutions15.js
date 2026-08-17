/* 歷屆補完（第八批 8 題） */
const SOL15 = {
10273: {
  q: "吃不吃牛：n 頭牛，第 i 頭有<b>週期 <code>k[i]</code>（≤ 10）</b>與週期內每天的產乳量。每天 John 挑<b>產量最少</b>的那頭吃掉；若最少產量<b>不只一頭</b>（平手）就<b>誰都不吃</b>。輸出「沒被吃掉的牛數」與「最後一頭被吃的日子」（沒吃過就輸出 0）。",
  h: "直接模擬，難點是<b>什麼時候可以宣告「永遠不會再吃了」</b>。<br>所有週期都 ≤ 10，<code>lcm(1..10) = 2520</code>，所以在<b>牛群不變</b>的情況下，整個局面以 2520 天為週期重複。<br>⇒ 只要<b>連續 2520 天沒吃到任何一頭牛</b>，之後就永遠不會再吃 ⇒ 可以安全停止。吃掉一頭牛後局面改變，計數器歸零重新算。<br>每天掃一遍存活的牛找最小值與是否平手，O(存活數)。",
  t: "① 停止條件是本題的核心；沒有它會無窮迴圈。2520 是 <code>lcm(1..10)</code>，不是隨便取的。<br>② <b>平手就不吃</b>（含只有兩頭產量相同的情況），所以牛群可能永遠吃不完。<br>③ 只剩<b>一頭</b>牛時它必定是唯一最小值 ⇒ 一定會被吃掉。<br>④ 第 1 天對應週期陣列的索引 0，用 <code>(day − 1) % k</code>。<br>⑤ 沒吃過任何牛時第二個數字輸出 0。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<int> k(n);
        vector<vector<int> > v(n);
        for (int i = 0; i < n; i++) {
            cin >> k[i];
            v[i].resize(k[i]);
            for (int j = 0; j < k[i]; j++) cin >> v[i][j];
        }

        vector<char> alive(n, 1);
        int cnt = n, lastDay = 0, day = 0, barren = 0;
        while (cnt > 0 && barren < 2520) {          // lcm(1..10) = 2520
            day++; barren++;
            int best = INT_MAX, who = -1, tie = 0;
            for (int i = 0; i < n; i++) {
                if (!alive[i]) continue;
                int val = v[i][(day - 1) % k[i]];
                if (val < best) { best = val; who = i; tie = 1; }
                else if (val == best) tie++;
            }
            if (tie == 1) {                          // 唯一最小 → 吃掉
                alive[who] = 0; cnt--; lastDay = day; barren = 0;
            }
        }
        cout << cnt << " " << lastDay << "\\n";
    }
    return 0;
}`
},

10626: {
  q: "買可樂：一瓶可樂 8 元，投幣機吃 1、5、10 元硬幣，<b>找零一定用最少硬幣數</b>（找 2 元 → 兩枚 1 元）。找回的零錢可以繼續投。給「要買幾瓶」與手上 1/5/10 元各有幾枚，求<b>投入硬幣總數的最小值</b>。",
  h: "先窮舉「買一瓶可以怎麼投」，只有 4 種划算的投法（其餘都被這 4 種支配）：<br><code>(a) 8 枚 1 元</code>　成本 8，找零 0<br><code>(b) 1 枚 5 + 3 枚 1</code>　成本 4，找零 0<br><code>(c) 2 枚 5</code>　成本 2，<b>找回 2 枚 1 元</b><br><code>(d) 1 枚 10</code>　成本 1，<b>找回 2 枚 1 元</b><br><b>關鍵洞見：順序可以自由重排！</b> (c)(d) 只會「產生」1 元、不消耗 1 元 ⇒ 把它們全部排到最前面一定不會更差。<br>於是問題退化成一組不等式，只要枚舉 <code>d</code> 與 <code>cc</code> 的次數：<br><code>a + b + cc + d = C</code>、<code>b + 2cc ≤ F</code>、<code>d ≤ T</code>、<code>8a + 3b ≤ O + 2(cc + d)</code><br>成本 <code>= 8a + 4b + 2cc + d = 8k − 4b + 2cc + d</code>（k = C − cc − d）⇒ 固定 <code>(cc, d)</code> 後<b>把 b 開到最大</b>即可。複雜度 O(T × F/2) ≈ 2500。",
  t: "① 大多數人會寫 <code>dp[瓶數][1元數][5元數]</code>，狀態高達千萬還得帶 10 元數；<b>「重排順序」的觀察直接把它變成兩層迴圈</b>。<br>② 別漏掉 (c)「兩枚 5 元」——它跟投 10 元一樣會找回 2 枚 1 元。<br>③ 其他投法（如 5+10、10+1）都比這 4 種貴，可證明被支配。<br>④ 樣例 <code>20 200 3 0</code> 的答案 148 = 17 次 (a) + 3 次 (b)，正好驗證 b 要開到最大。<br>⑤ 題目保證一定買得起，不必處理無解。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        ll C, O, F, Tn;                     // 瓶數、1 元、5 元、10 元
        cin >> C >> O >> F >> Tn;

        ll best = LLONG_MAX;
        for (ll d = 0; d <= min(Tn, C); d++)                    // 投 10 元的次數
            for (ll cc = 0; cc <= min(C - d, F / 2); cc++) {    // 投兩枚 5 元的次數
                ll k = C - d - cc;                              // 剩下用 (a)/(b) 買
                ll bmax = min(k, F - 2 * cc);                   // 5 元剩餘量的限制
                // 1 元夠用：8a + 3b ≤ O + 2cc + 2d，其中 a = k − b
                ll need = 8 * k - (O + 2 * cc + 2 * d);         // 需要 5b ≥ need
                ll bmin = need <= 0 ? 0 : (need + 4) / 5;
                if (bmin > bmax) continue;
                ll b = bmax;                                    // 成本對 b 遞減 → 開到最大
                best = min(best, 8 * (k - b) + 4 * b + 2 * cc + d);
            }
        cout << best << "\\n";
    }
    return 0;
}`
},

10690: {
  q: "表達式極值：給 <code>m</code>、<code>n</code> 與 <code>m + n</code> 個整數（範圍 −50..50），把它們分成大小 <code>m</code> 與 <code>n</code> 的兩組，求<b>兩組總和相乘</b>的最大值與最小值。",
  h: "設全部數字總和為 <code>S</code>，若 m 組的和是 <code>x</code>，另一組必然是 <code>S − x</code> ⇒ 乘積 <code>= x(S − x)</code>，<b>只跟 x 有關</b>。<br>所以問題變成「<b>恰選 m 個數，能湊出哪些和 x</b>」——用 <code>bitset</code> 加速的計數背包：<br><code>dp[k] |= dp[k−1] &lt;&lt; (a[i] + 50)</code><br>因為有負數，每個數字統一<b>加上偏移 50</b>；選了 k 個就多了 <code>50k</code>，還原時減回去即可。<br>最後把 <code>dp[m]</code> 的每個可行 x 代進 <code>x(S − x)</code> 取極值。",
  t: "① <b>負數靠固定偏移量處理</b>：偏移是「每個元素 +50」而不是「整體 +50」，還原時要減 <code>50 × m</code>。<br>② 最大值<b>不是</b>「x 最接近 S/2」就好——直接枚舉所有可行 x 最保險（S 可能是負的）。<br>③ 乘積最大約 51×50 × 51×50 ≈ 6.5 × 10⁶，int 夠但用 <code>long long</code> 更安心。<br>④ 讀到 EOF 結束，最多 110 筆。<br>⑤ k 迴圈要倒著跑（0/1 背包）。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

const int SZ = 5201;                        // 51 個數字 × (50 + 50) 的上界

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int m, n;
    while (cin >> m >> n) {
        int t = m + n;
        vector<int> a(t); ll S = 0;
        for (int i = 0; i < t; i++) { cin >> a[i]; S += a[i]; }

        vector<bitset<SZ> > dp(m + 1);
        dp[0][0] = 1;
        for (int i = 0; i < t; i++)
            for (int k = min(i, m - 1); k >= 0; k--)
                dp[k + 1] |= dp[k] << (a[i] + 50);      // 每個元素偏移 +50

        ll mx = LLONG_MIN, mn = LLONG_MAX;
        for (int idx = 0; idx < SZ; idx++) {
            if (!dp[m][idx]) continue;
            ll x = idx - 50LL * m;                       // 還原真正的和
            ll p = x * (S - x);
            mx = max(mx, p); mn = min(mn, p);
        }
        cout << mx << " " << mn << "\\n";
    }
    return 0;
}`
},

11659: {
  q: "線人：<code>n ≤ 20</code> 位線人，<code>m ≤ 800</code> 條陳述「i 說 j 可信」或「i 說 j 不可信」（可以說自己）。<b>可信的人講的話一定是真的</b>；不可信的人講的話真假不拘。求最多可以有幾人是可信的。",
  h: "n ≤ 20 ⇒ <b>枚舉 2²⁰ 種「誰可信」的集合</b>，每個集合檢查是否自洽。<br>把每個人的陳述壓成兩個 bitmask：<code>pos[i]</code>（i 說「可信」的人）、<code>neg[i]</code>（i 說「不可信」的人）。集合 S 合法 ⟺ 對每個 <code>i ∈ S</code>：<br><code>(pos[i] &amp; ~S) == 0</code>（他說可信的人都必須在 S 裡）<br><code>(neg[i] &amp; S) == 0</code>（他說不可信的人都不能在 S 裡）<br>不在 S 的人講什麼都不用管（謊話也合法）。<br>加上「<code>popcount(S) ≤ 目前最佳解就跳過</code>」的剪枝，實測極快。",
  t: "① 只檢查<b>可信者</b>的陳述——不可信者的話沒有任何約束，這是本題最容易想錯的地方。<br>② 允許 <code>i</code> 評論自己：「1 說 1 不可信」⇒ 1 必定不可信（否則矛盾）。<br>③ 800 條陳述<b>先壓成 bitmask</b>，不要在 2²⁰ 的迴圈裡逐條掃（會 TLE）。<br>④ 輸入以 <code>0 0</code> 結束，那一筆<b>不要輸出</b>。<br>⑤ 陳述的第二個數是<b>帶號</b>的，負號代表「不可信」。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m;
    while (cin >> n >> m) {
        if (n == 0 && m == 0) break;
        vector<int> pos(n, 0), neg(n, 0);
        for (int i = 0; i < m; i++) {
            int a, b; cin >> a >> b;
            if (b > 0) pos[a - 1] |= 1 << (b - 1);
            else       neg[a - 1] |= 1 << (-b - 1);
        }

        int best = 0;
        for (int S = 0; S < (1 << n); S++) {
            if (__builtin_popcount(S) <= best) continue;     // 剪枝
            bool ok = true;
            for (int i = 0; i < n && ok; i++) {
                if (!(S >> i & 1)) continue;                 // 不可信者的話不受約束
                if (pos[i] & ~S) ok = false;
                if (neg[i] & S)  ok = false;
            }
            if (ok) best = __builtin_popcount(S);
        }
        cout << best << "\\n";
    }
    return 0;
}`
},

10326: {
  q: "由根還原多項式：給 <code>n</code> 個整數根，輸出對應的<b>首一多項式方程式</b>，格式如 <code>x^2 - 5x + 6 = 0</code>。係數為 0 的項<b>不印</b>，但<b>常數項一定要印</b>（為 0 就印 <code>+ 0</code>）；係數絕對值為 1 時只印 <code>x</code>。",
  h: "數學部分很單純：<code>P(x) = ∏(x − root)</code>，用<b>逐次乘一次式</b>展開：<br><code>newc[i] = c[i−1] − root × c[i]</code>（把「乘 x」與「乘 −root」疊加）。n ≤ 50，O(n²)。<br><b>難的是輸出排版</b>，逐條規則寫清楚：<br>・最高次項係數恆為 1 ⇒ 直接印 <code>x^n</code>（n = 1 時印 <code>x</code>）<br>・中間項：正號印 <code>\" + \"</code>、負號印 <code>\" - \"</code>，接著印 <b>|係數|（等於 1 時省略）</b>，再接 <code>x</code> 或 <code>x^k</code><br>・係數 0 的中間項<b>整項跳過</b><br>・常數項<b>永遠要印</b>，包含 0",
  t: "① 這題 99% 的 WA 都出在<b>格式</b>而非算式。<br>② 「係數 1 省略」只適用於<b>含 x 的項</b>；常數項的 1 要印出來。<br>③ 常數項是唯一「係數 0 仍要輸出」的項（樣例 <code>x^3 - x + 0 = 0</code>）。<br>④ 數字與 x 之間<b>沒有空白</b>（<code>5x</code> 不是 <code>5 x</code>），但正負號兩側<b>有</b>空白。<br>⑤ 係數可達 10¹⁵ ⇒ 必須 <code>long long</code>。<br>⑥ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n) {
        vector<ll> c(n + 1, 0);
        c[0] = 1;                                   // 目前多項式 = 1（c[i] 是 x^i 係數）
        int deg = 0;
        for (int i = 0; i < n; i++) {
            ll r; cin >> r;
            // 乘上 (x - r)：新的 x^k 係數 = 舊的 x^(k-1) 係數 - r × 舊的 x^k 係數
            for (int k = deg + 1; k >= 1; k--) c[k] = c[k - 1] - r * c[k];
            c[0] = -r * c[0];
            deg++;
        }

        string s = "x";                             // 最高次項係數必為 1
        if (n >= 2) s += "^" + to_string(n);
        for (int k = n - 1; k >= 1; k--) {
            if (c[k] == 0) continue;                // 中間項係數為 0 → 整項不印
            s += (c[k] > 0 ? " + " : " - ");
            ll a = c[k] < 0 ? -c[k] : c[k];
            if (a != 1) s += to_string(a);          // 係數 1 只印 x
            s += (k == 1 ? "x" : "x^" + to_string(k));
        }
        s += (c[0] >= 0 ? " + " : " - ");           // 常數項一定要印
        s += to_string(c[0] < 0 ? -c[0] : c[0]);
        cout << s << " = 0\\n";
    }
    return 0;
}`
},

13242: {
  q: "注水池：一排編號從 0 開始的水罐，各有體積與溫度。只能倒<b>連續一段</b>水罐進池子，要求總體積<b>至少池容量的一半、且不超過容量</b>，混合後溫度（依體積加權平均）與目標溫度差<b>不超過 5 度</b>，並讓溫差<b>越小越好</b>。輸出起訖罐號；多解取<b>編號最小</b>；無解輸出 <code>Not possible</code>。",
  h: "n ≤ 3000 ⇒ <code>O(n²)</code> 枚舉所有連續區間（900 萬）完全可行，配上<b>前綴和</b>讓每段 O(1) 取得：<br><code>V = pv[j+1] − pv[i]</code>、<code>Σ(v·t) = pt[j+1] − pt[i]</code><br><b>全程用整數比較，不要算出浮點溫度</b>：<br><code>(T − target) × V = Σ(v·t) − target × V</code>　令其為 <code>num</code><br>・溫差條件：<code>|num| ≤ 5V</code><br>・比較兩組溫差：<code>|num₁| / V₁ &lt; |num₂| / V₂</code> ⇒ 交叉相乘（用 <code>__int128</code> 防溢位）<br>內層還可以剪枝：體積遞增，<code>V &gt; 容量</code> 時直接 <code>break</code>。",
  t: "① <b>用整數分數比較</b>，浮點在「溫差幾乎相同」時會選錯區間。<br>② 「至少一半」寫成 <code>2V ≥ capacity</code> 避免除法取整。<br>③ 多解要<b>編號最小</b> ⇒ i、j 都由小到大掃，且只在<b>嚴格更好</b>時更新。<br>④ 罐號是 <b>0-based</b>。<br>⑤ 內層 <code>break</code>（超容量）跟 <code>continue</code>（未達半）不能寫反。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        ll cap, tgt; cin >> cap >> tgt;
        int n; cin >> n;
        vector<ll> pv(n + 1, 0), pt(n + 1, 0);
        for (int i = 0; i < n; i++) {
            ll v, t; cin >> v >> t;
            pv[i + 1] = pv[i] + v;
            pt[i + 1] = pt[i] + v * t;
        }

        bool found = false; int bi = 0, bj = 0; ll bn = 0, bd = 1;
        for (int i = 0; i < n; i++)
            for (int j = i; j < n; j++) {
                ll V = pv[j + 1] - pv[i];
                if (2 * V < cap) continue;              // 還沒到一半，繼續加
                if (V > cap) break;                     // 已溢出，j 再大只會更糟
                ll num = (pt[j + 1] - pt[i]) - tgt * V; // = (實際溫度 − 目標) × V
                ll an = num < 0 ? -num : num;
                if (an > 5 * V) continue;               // 溫差超過 5 度
                if (!found || (__int128)an * bd < (__int128)bn * V) {
                    found = true; bi = i; bj = j; bn = an; bd = V;
                }
            }
        if (found) cout << bi << " " << bj << "\\n";
        else cout << "Not possible\\n";
    }
    return 0;
}`
},

13171: {
  q: "像素藝術：手上有洋紅(M)、黃(Y)、青(C) 三原色各若干單位。圖像每個像素是 M/Y/C/R/B/G/V/W 之一，其中 <b>R = M+Y、G = Y+C、V = M+C、B = M+Y+C、W = 不上色</b>。問顏料夠不夠畫完；夠的話輸出 <code>YES</code> 與三色剩餘量，否則 <code>NO</code>。",
  h: "純粹的<b>減色法混色表</b>查表計數：把每個像素展開成三原色的用量向量，全部累加後跟庫存比較。<br><code>M(1,0,0) Y(0,1,0) C(0,0,1) R(1,1,0) G(0,1,1) V(1,0,1) B(1,1,1) W(0,0,0)</code><br>一次掃描 O(像素數)，最多 10 萬。<br>這題唯一的門檻是<b>把顏色理論翻譯正確</b>：洋紅+黃 = 紅、黃+青 = 綠、洋紅+青 = 紫、三色 = 黑、留白 = 白。",
  t: "① 是<b>減色（顏料）混色</b>不是加色（光）混色，別套 RGB 那一套。<br>② <b>白色 W 不耗任何顏料</b>（就是不塗）。<br>③ 像素多達 10 萬，用 <code>cin &gt;&gt; string</code> 一次讀完整串，不要逐字元讀。<br>④ 只要有<b>任何一色不夠</b>就是 NO（不是總量夠就好）。<br>⑤ 輸出剩餘量的順序固定是<b>洋紅、黃、青</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        ll m, y, c; string s;
        cin >> m >> y >> c >> s;

        ll um = 0, uy = 0, uc = 0;
        for (size_t i = 0; i < s.size(); i++) {
            switch (s[i]) {
                case 'M': um++; break;
                case 'Y': uy++; break;
                case 'C': uc++; break;
                case 'R': um++; uy++; break;            // 紅 = 洋紅 + 黃
                case 'G': uy++; uc++; break;            // 綠 = 黃 + 青
                case 'V': um++; uc++; break;            // 紫 = 洋紅 + 青
                case 'B': um++; uy++; uc++; break;      // 黑 = 三原色
                case 'W': break;                        // 白 = 留白，不耗顏料
            }
        }
        if (um <= m && uy <= y && uc <= c)
            cout << "YES " << m - um << " " << y - uy << " " << c - uc << "\\n";
        else
            cout << "NO\\n";
    }
    return 0;
}`
},

10355: {
  q: "超人：超人沿<b>直線</b>從 A 飛到 B，途中有 1~10 個<b>互不相交的球形</b>汙染區。求飛行路徑<b>落在汙染區內的比例</b>（百分比，取到小數點後 2 位）。",
  h: "把路徑參數化成 <code>P(t) = A + t·(B − A)</code>，<code>t ∈ [0, 1]</code>，代進球面方程式 <code>|P(t) − C|² = r²</code> 得到<b>一元二次方程式</b>：<br><code>A' = d·d</code>、<code>B' = 2(f·d)</code>、<code>C' = f·f − r²</code>，其中 <code>d = B − A</code>、<code>f = A − C</code>。<br>判別式 ≤ 0 ⇒ 沒穿過（相切長度為 0）。否則兩根 <code>t₁ &lt; t₂</code>，<b>夾到 [0, 1] 之內</b>後長度即 <code>(t₂ − t₁) × |d|</code>。<br>題目保證<b>球體互不相交</b> ⇒ 各段長度<b>直接相加不會重複計算</b>，省掉區間合併。",
  t: "① 「互不相交」這句是關鍵前提，否則必須先做<b>區間聯集</b>再求長度。<br>② 兩根都要<b>夾在 [0, 1]</b>：球可能只有一部分落在線段上，或整顆在線段外（此時 <code>t₂ ≤ t₁</code>，長度 0）。<br>③ 判別式用 <code>≤ 0</code> 略過（相切貢獻 0）。<br>④ 輸出是<b>兩行</b>：城市名一行、百分比一行。<br>⑤ 城市名用 <code>cin &gt;&gt; string</code> 讀，也是 EOF 的判斷依據。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cout << fixed << setprecision(2);
    string name;
    while (cin >> name) {
        double ax, ay, az, bx, by, bz;
        cin >> ax >> ay >> az >> bx >> by >> bz;
        int n; cin >> n;

        double dx = bx - ax, dy = by - ay, dz = bz - az;
        double len = sqrt(dx * dx + dy * dy + dz * dz);
        double inside = 0;

        for (int i = 0; i < n; i++) {
            double cx, cy, cz, r; cin >> cx >> cy >> cz >> r;
            double fx = ax - cx, fy = ay - cy, fz = az - cz;
            double A = dx * dx + dy * dy + dz * dz;
            double B = 2 * (fx * dx + fy * dy + fz * dz);
            double C = fx * fx + fy * fy + fz * fz - r * r;
            double disc = B * B - 4 * A * C;
            if (disc <= 0) continue;                    // 沒穿過（或相切）
            double s = sqrt(disc);
            double t1 = max((-B - s) / (2 * A), 0.0);   // 夾回線段範圍
            double t2 = min((-B + s) / (2 * A), 1.0);
            if (t2 > t1) inside += (t2 - t1) * len;     // 球體互不相交 → 直接累加
        }
        cout << name << "\\n" << (len > 0 ? inside * 100 / len : 0.0) << "\\n";
    }
    return 0;
}`
}
};

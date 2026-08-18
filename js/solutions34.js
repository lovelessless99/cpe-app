/* 二星題庫（第十七批 6 題） */
const SOL34 = {
10339: {
  q: "Watching Watches：兩支 12 小時類比錶都在午夜對準，之後分別<b>每天各慢 k 秒與 m 秒</b>。求兩支錶<b>下一次顯示相同時刻</b>時，錶面上顯示幾點幾分（四捨五入到分）。",
  h: "兩支錶的<b>相對落後</b>每天差 <code>|k − m|</code> 秒。12 小時錶盤一圈是 <b>43200 秒</b>，所以要等相對差累積到整整一圈：<br><code>經過天數 = 43200 / |k − m|</code><br>此時<b>第一支錶自己</b>累積落後 <code>k × 43200 / |k − m|</code> 秒。錶面顯示的時刻就是<br><code>(43200 − 落後秒數 mod 43200) mod 43200</code>，換算成 12 小時制。<br>驗算：<code>k=1, m=2</code> ⇒ 43200 天後第一支落後 43200 秒 = 剛好一圈 ⇒ 顯示 <b>12:00</b> ✓；<code>k=0, m=7</code> ⇒ 第一支完全沒慢，但要等 43200/7 天 ⇒ <b>10:17</b> ✓。",
  t: "① 兩支錶顯示相同 ⟺ <b>相對差是 43200 的倍數</b>（12 小時制，不是 86400）。<br>② 天數 <code>43200/|k−m|</code> 可能不是整數，落後秒數要<b>保留精度</b>（用 double）。<br>③ 顯示時刻是 <b>12 小時制</b>，0 點要印成 <code>12:00</code>。<br>④ 四捨五入到<b>分</b>，可能進位到下一小時。<br>⑤ 兩數保證相異，不會除以零。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const double CYCLE = 43200.0;                      // 12 小時 = 43200 秒
    ll k, m;
    while (cin >> k >> m) {
        double days = CYCLE / fabs((double)(k - m));   // 相對差累積一整圈
        double lost = k * days;                        // 第一支錶自己落後的秒數
        double shown = fmod(CYCLE - fmod(lost, CYCLE), CYCLE);

        ll mins = (ll)llround(shown / 60.0);           // 四捨五入到分
        mins %= 720;
        ll hh = mins / 60, mm = mins % 60;
        if (hh == 0) hh = 12;                          // 12 小時制
        cout << k << " " << m << " "
             << setw(2) << setfill('0') << hh << ":"
             << setw(2) << setfill('0') << mm << setfill(' ') << "\\n";
    }
    return 0;
}`
},

11326: {
  q: "Laser Pointer：長 L、寬 W 的走廊，<b>兩側長牆是鏡子</b>。Jake 貼著右牆、以與右牆夾角 θ 射出雷射，光束反射若干次後打到<b>盡頭的門</b>上某點。求「光束實際走的距離」與「直線距離」的<b>比值</b>（3 位小數）。",
  h: "鏡面反射的萬用技巧：<b>展開法（unfolding）</b>——與其追蹤反射，不如把走廊<b>一路鏡射複製</b>，光束就變成一條<b>直線</b>。<br>光束與右牆夾角 θ，走到盡頭（縱向 L）時橫向位移是 <code>L·tan θ</code>。<br>・<b>實際距離</b> <code>d = L / cos θ</code>（斜邊）<br>・<b>落點位置</b>：把 <code>L·tan θ</code> 對 <code>2W</code> 取模再摺疊回 [0, W]，得門上實際橫座標 x<br>・<b>直線距離</b> <code>s = √(L² + x²)</code><br>答案 <code>= d / s</code>。<br>驗算：<code>L=10, W=5, θ=45°</code> ⇒ 橫移 10、摺疊後 x=0 ⇒ <code>14.142/10</code> = <b>1.414</b> ✓；<code>L=12, W=12, θ=75°</code> ⇒ <b>3.732</b> ✓。",
  t: "① <b>展開法</b>是鏡面反射題的標準解法，硬追蹤每次反射既慢又容易錯。<br>② 摺疊用 <code>2W</code> 為週期：<code>t = fmod(位移, 2W)</code>，若 <code>t &gt; W</code> 則 <code>x = 2W − t</code>。<br>③ 角度是<b>與右牆的夾角</b>（不是與門），所以縱向用 cos、橫向用 tan。<br>④ 角度要<b>轉弧度</b>。<br>⑤ 輸出 3 位小數。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cout << fixed << setprecision(3);
    const double PI = acos(-1.0);
    int T; cin >> T;
    while (T--) {
        double L, W, deg; cin >> L >> W >> deg;
        double th = deg * PI / 180;
        double d = L / cos(th);                        // 展開後就是一條直線
        double off = L * tan(th);                      // 展開後的橫向總位移
        double t = fmod(off, 2 * W);                   // 摺疊回走廊寬度
        double x = (t > W) ? 2 * W - t : t;
        double s = sqrt(L * L + x * x);                // 直線距離
        cout << d / s << "\\n";
    }
    return 0;
}`
},

10466: {
  q: "How Far?：太陽固定，天體 b₁ 以半徑 <code>r₁</code> 繞太陽、週期 <code>t₁</code>；b₂ 以 <code>r₂</code> 繞 b₁、週期 <code>t₂</code>…以此類推。<code>t = 0</code> 時所有天體都在<b>離太陽最遠</b>的位置。給時刻 T，求各天體<b>離太陽的距離</b>（4 位小數）。",
  h: "把位置<b>逐層疊加成向量</b>：<br>第 i 層相對於上一層的角度是 <code>θᵢ = 2π·T/tᵢ</code>，而「t=0 時最遠」代表<b>所有層的初始方向一致</b>。<br>所以第 i 個天體的座標是<br><code>(x, y) = Σ_{j≤i} rⱼ·(cos θⱼ, sin θⱼ)</code><br>距離就是 <code>√(x² + y²)</code>，一路累加即可，O(n)。<br>驗算：<code>T=5</code>、三個天體週期都是 5 ⇒ 每個 <code>θ = 2π</code>（轉整圈回原位）⇒ 距離就是半徑累加：<b>20 / 50 / 90</b> ✓。",
  t: "① 「t=0 時最遠」⇒ <b>所有初始角度相同</b>（都設 0），這是能直接累加的關鍵。<br>② 角度是 <code>2π·T/tᵢ</code>，<b>每層各自的週期</b>不同。<br>③ 要<b>逐層累加向量後才取模長</b>，不能把半徑直接相加（除非剛好同向）。<br>④ 輸出<b>同一行、空白分隔</b>、各 4 位小數。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cout << fixed << setprecision(4);
    const double PI = acos(-1.0);
    int n; double T;
    while (cin >> n >> T) {
        double x = 0, y = 0;
        for (int i = 0; i < n; i++) {
            double r, t; cin >> r >> t;
            double th = 2 * PI * T / t;                // 各層各自的角速度
            x += r * cos(th);                          // 向量逐層疊加
            y += r * sin(th);
            cout << (i ? " " : "") << sqrt(x * x + y * y);
        }
        cout << "\\n";
    }
    return 0;
}`
},

10555: {
  q: "Dead Fraction：給一個小數如 <code>0.474612399...</code>，<b>省略號代表某個後綴無限循環</b>（但不知道循環節從哪裡開始）。求所有可能還原中<b>分母最小</b>的那個分數。",
  h: "枚舉<b>循環節長度</b> k（1 到全部位數），對每個 k 用循環小數的標準公式還原：<br>設小數部分共 n 位、數值為 <code>D</code>（當成整數），前 <code>n−k</code> 位為 <code>P</code>，則<br><code>分子 = D − P</code>，<code>分母 = (10^k − 1) × 10^(n−k)</code><br>約分後取<b>分母最小</b>的那組。<br>驗算：<code>0.2...</code> ⇒ k=1 得 <code>2/9</code> ✓；<code>0.20...</code> ⇒ k=1 得 <code>18/90 = 1/5</code>、k=2 得 <code>20/99</code> ⇒ 取 <b>1/5</b> ✓。<br>位數 ≤ 9 ⇒ 分子分母都在 <code>long long</code> 範圍內。",
  t: "① <b>循環節起點未知</b>，要枚舉所有可能長度，不能只試最後一位。<br>② <code>10^k − 1</code> 是 k 個 9、<code>10^(n−k)</code> 是後面補的零，兩者相乘才是分母。<br>③ 一定要<b>約分後</b>再比較分母。<br>④ 比較的是<b>分母最小</b>，不是分子。<br>⑤ 輸入格式 <code>0.dddd...</code>，要剝掉開頭的 <code>0.</code> 與結尾的 <code>...</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

ll gcd_(ll a, ll b) { return b ? gcd_(b, a % b) : a; }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string s;
    while (cin >> s && s != "-1") {
        string d = s.substr(2, s.size() - 5);          // 剝掉 "0." 與 "..."
        int n = d.size();
        ll D = atoll(d.c_str());

        ll bn = 0, bd = 0;
        for (int k = 1; k <= n; k++) {                 // 枚舉循環節長度
            ll P = (n - k > 0) ? atoll(d.substr(0, n - k).c_str()) : 0;
            ll num = D - P;
            ll den = 1;
            for (int i = 0; i < k; i++) den *= 10;
            den -= 1;                                  // 10^k - 1（k 個 9）
            for (int i = 0; i < n - k; i++) den *= 10; // 後面補零
            ll g = gcd_(num, den);
            if (g == 0) continue;
            num /= g; den /= g;
            if (bd == 0 || den < bd) { bn = num; bd = den; }   // 取分母最小
        }
        cout << bn << "/" << bd << "\\n";
    }
    return 0;
}`
},

10256: {
  q: "The Great Divide：給兩群點（M 群與 C 群），問是否存在一條<b>直線</b>把兩群完全分開（線上不可有點）。",
  h: "兩個點集<b>可以被直線分開</b> ⟺ 它們的<b>凸包不相交</b>（線性可分性定理）。<br>所以做三件事：<br>① 各自求<b>凸包</b>。<br>② 檢查<b>是否有任一點落在對方凸包內部或邊上</b>。<br>③ 檢查<b>兩凸包的邊是否相交</b>。<br>任一條成立就是 <code>No</code>，否則 <code>Yes</code>。<br>點數 ≤ 500 ⇒ 凸包 O(n log n)、兩兩檢查邊 O(h²) 都很快。<br>「點在凸多邊形內」用<b>叉積同號法</b>最簡潔。",
  t: "① <b>退化情形要小心</b>：某群可能只有 1 或 2 個點（凸包退化成點或線段），判斷函式要能處理。<br>② <b>邊界也算不可分</b>（點落在對方凸包邊上就是 No）。<br>③ 線段相交判定要含<b>共線重疊</b>。<br>④ 座標是整數 ⇒ 全程<b>整數叉積</b>，零誤差。<br>⑤ <code>0 0</code> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

struct P { ll x, y; };
bool cmpP(const P &a, const P &b) { return a.x != b.x ? a.x < b.x : a.y < b.y; }
bool eqP(const P &a, const P &b) { return a.x == b.x && a.y == b.y; }
ll cross(const P &o, const P &a, const P &b) {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}
int sgn(ll v) { return (v > 0) - (v < 0); }

vector<P> hull(vector<P> p) {
    sort(p.begin(), p.end(), cmpP);
    p.erase(unique(p.begin(), p.end(), eqP), p.end());
    int n = p.size();
    if (n < 3) return p;
    vector<P> h(2 * n);
    int k = 0;
    for (int i = 0; i < n; i++) {
        while (k >= 2 && cross(h[k - 2], h[k - 1], p[i]) <= 0) k--;
        h[k++] = p[i];
    }
    int lo = k + 1;
    for (int i = n - 2; i >= 0; i--) {
        while (k >= lo && cross(h[k - 2], h[k - 1], p[i]) <= 0) k--;
        h[k++] = p[i];
    }
    h.resize(k - 1);
    return h;
}

bool onSeg(const P &a, const P &b, const P &p) {
    if (cross(a, b, p) != 0) return false;
    return min(a.x, b.x) <= p.x && p.x <= max(a.x, b.x) &&
           min(a.y, b.y) <= p.y && p.y <= max(a.y, b.y);
}
bool segInter(const P &a, const P &b, const P &c, const P &d) {
    int d1 = sgn(cross(c, d, a)), d2 = sgn(cross(c, d, b));
    int d3 = sgn(cross(a, b, c)), d4 = sgn(cross(a, b, d));
    if (d1 * d2 < 0 && d3 * d4 < 0) return true;
    return onSeg(c, d, a) || onSeg(c, d, b) || onSeg(a, b, c) || onSeg(a, b, d);
}
// 點是否在凸多邊形內部或邊上
bool inHull(const vector<P> &h, const P &p) {
    int n = h.size();
    if (n == 0) return false;
    if (n == 1) return eqP(h[0], p);
    if (n == 2) return onSeg(h[0], h[1], p);
    int pos = 0, neg = 0;
    for (int i = 0; i < n; i++) {
        int s = sgn(cross(h[i], h[(i + 1) % n], p));
        if (s > 0) pos++;
        if (s < 0) neg++;
    }
    return !(pos && neg);                              // 全部同側（含邊上）
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int m, c;
    while (cin >> m >> c && (m || c)) {
        vector<P> A(m), B(c);
        for (int i = 0; i < m; i++) cin >> A[i].x >> A[i].y;
        for (int i = 0; i < c; i++) cin >> B[i].x >> B[i].y;
        vector<P> ha = hull(A), hb = hull(B);

        bool bad = false;
        for (size_t i = 0; i < A.size() && !bad; i++) if (inHull(hb, A[i])) bad = true;
        for (size_t i = 0; i < B.size() && !bad; i++) if (inHull(ha, B[i])) bad = true;
        for (size_t i = 0; i < ha.size() && !bad; i++)
            for (size_t j = 0; j < hb.size() && !bad; j++) {
                P a1 = ha[i], a2 = ha[(i + 1) % ha.size()];
                P b1 = hb[j], b2 = hb[(j + 1) % hb.size()];
                if (segInter(a1, a2, b1, b2)) bad = true;
            }
        cout << (bad ? "No" : "Yes") << "\\n";
    }
    return 0;
}`
},

12406: {
  q: "Help Dexter：找出<b>恰好 p 位數</b>、<b>能被 q 整除</b>、且<b>只由 1 和 2 組成</b>的數字中的<b>最小值與最大值</b>；不存在則輸出 <code>impossible</code>。<code>p, q ≤ 17</code>。",
  h: "p ≤ 17 ⇒ 候選有 <code>2¹⁷ = 131072</code> 個（每位選 1 或 2）⇒ <b>直接枚舉全部</b>，用位元遮罩表示「哪些位是 2」。<br>把每個候選組成 <code>long long</code>（17 位數最大約 2.2×10¹⁶，安全），檢查是否被 q 整除，同時記錄最小與最大。<br><b>更好的做法是預處理</b>：p 只有 17 種、q 只有 17 種 ⇒ 一次把 17×17 的表建好，300 筆查詢就都是 O(1)。<br>驗算：<code>p=2, q=2</code> ⇒ 12 與 22 ⇒ 最小 12、最大 22 ✓；<code>p=2, q=3</code> ⇒ 11/12/21/22 都不被 3 整除 ⇒ <b>impossible</b> ✓。",
  t: "① 「只由 1 和 2 組成」⇒ 每位<b>兩種</b>選擇，不是 0..9。<br>② p = 17 時數值約 2.2×10¹⁶，<code>long long</code> 剛好夠，<code>int</code> 完全不行。<br>③ 要輸出<b>最小與最大兩個數</b>（樣例輸出在轉檔時被截斷，實際是 <code>12 22</code>）。<br>④ 建議<b>預處理 17×17 的表</b>，300 筆查詢不必重算。<br>⑤ 不存在時輸出 <code>impossible</code>（小寫）。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    static ll mn[18][18], mx[18][18];
    for (int p = 1; p <= 17; p++)
        for (int q = 1; q <= 17; q++) { mn[p][q] = -1; mx[p][q] = -1; }

    for (int p = 1; p <= 17; p++)
        for (int mask = 0; mask < (1 << p); mask++) {
            ll v = 0;
            for (int i = 0; i < p; i++)                // 每位選 1 或 2
                v = v * 10 + ((mask >> i) & 1 ? 2 : 1);
            for (int q = 1; q <= 17; q++)
                if (v % q == 0) {
                    if (mn[p][q] < 0 || v < mn[p][q]) mn[p][q] = v;
                    if (mx[p][q] < 0 || v > mx[p][q]) mx[p][q] = v;
                }
        }

    int T; cin >> T;
    for (int tc = 1; tc <= T; tc++) {
        int p, q; cin >> p >> q;
        cout << "Case " << tc << ": ";
        if (mn[p][q] < 0) cout << "impossible\\n";
        else cout << mn[p][q] << " " << mx[p][q] << "\\n";
    }
    return 0;
}`
}
};

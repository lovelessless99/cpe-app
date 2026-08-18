/* 二星題庫（第二十一批 5 題） */
const SOL38 = {
12844: {
  q: "Outwitting the Weighing Machine：5 個人兩兩上磅，得到 <code>C(5,2) = 10</code> 個兩人合重（<b>順序已排序</b>）。反推 5 個人各自的體重，由小到大輸出。",
  h: "設體重排序後為 <code>w₁ ≤ w₂ ≤ … ≤ w₅</code>，則排序後的 10 個合重中：<br>・<b>最小的</b>必定是 <code>w₁ + w₂</code><br>・<b>第二小的</b>必定是 <code>w₁ + w₃</code><br>・<b>最大的</b>必定是 <code>w₄ + w₅</code><br>・<b>第二大的</b>必定是 <code>w₃ + w₅</code><br>另外 <b>10 個合重的總和 = 4 × (所有人的體重和)</b>（每個人各與其他 4 人配對一次）⇒ 得 <code>S = Σwᵢ</code>。<br>於是五個未知數<b>一路解開，完全不用搜尋</b>：<br><code>w₃ = S − p₁ − p₁₀</code>（總和扣掉最小與最大那兩組）<br><code>w₁ = p₂ − w₃</code>、<code>w₂ = p₁ − w₁</code><br><code>w₅ = p₉ − w₃</code>、<code>w₄ = p₁₀ − w₅</code><br>驗算三組樣例（已用程式跑過）：<code>114…129</code> ⇒ S=303、w₃=60 ⇒ <b>56 58 60 64 65</b> ✓；<code>110…126</code> ⇒ <b>53 57 58 61 65</b> ✓；<code>180…232</code> ⇒ <b>90 90 100 106 126</b> ✓。",
  t: "① <b>「總和 = 4S」</b>是解題的鑰匙——沒有它就得暴力枚舉。<br>② 五個關係式要<b>認對對應的位置</b>：最小 = w₁+w₂、第二小 = w₁+w₃、第二大 = w₃+w₅、最大 = w₄+w₅。用錯一個就全盤皆錯。<br>③ 總和必定被 4 整除（每人配對 4 次），可以拿來檢查輸入有沒有讀錯。<br>④ 輸入的 10 個數<b>要先 sort</b>（雖然樣例看似已排序，別依賴它）。<br>⑤ 樣例三有<b>重複體重</b>（90 90），公式仍成立——推導過程沒有假設嚴格遞增。<br>⑥ 輸出前記得把 5 個數<b>由小到大排序</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int tc = 1; tc <= T; tc++) {
        vector<ll> p(10);
        ll tot = 0;
        for (int i = 0; i < 10; i++) { cin >> p[i]; tot += p[i]; }
        sort(p.begin(), p.end());

        ll S = tot / 4;                                 // 每人各配對 4 次
        ll w3 = S - p[0] - p[9];                        // 最小 = w1+w2、最大 = w4+w5
        ll w1 = p[1] - w3;                              // 第二小 = w1+w3
        ll w2 = p[0] - w1;
        ll w5 = p[8] - w3;                              // 第二大 = w3+w5
        ll w4 = p[9] - w5;

        vector<ll> w;
        w.push_back(w1); w.push_back(w2); w.push_back(w3);
        w.push_back(w4); w.push_back(w5);
        sort(w.begin(), w.end());

        cout << "Case " << tc << ":";
        for (int i = 0; i < 5; i++) cout << " " << w[i];
        cout << "\\n";
    }
    return 0;
}`
},

1753: {
  q: "Need for Speed：時速表壞了——讀數 <code>s</code> 時<b>真實速度是 <code>s + c</code></b>（c 是未知常數，可能為負）。給 n 段旅程各自的距離 <code>d</code> 與讀數 <code>s</code>，以及<b>總時間 t</b>，求 c。",
  h: "總時間對 c 的函數是<br><code>f(c) = Σ dᵢ / (sᵢ + c)</code><br>因為每段的<b>真實速度必為正</b>（<code>sᵢ + c &gt; 0</code>），所以 c 的下界是 <code>−min(sᵢ)</code>；而在這個範圍內 <code>f(c)</code> 是<b>嚴格遞減</b>的（c 越大跑越快、時間越短）。<br>⇒ <b>單調 ⇒ 二分搜</b>：在 <code>(−min(sᵢ), 大數)</code> 上二分，找 <code>f(c) = t</code>。<br>浮點二分固定跑 <b>100 次</b>即可（精度遠超過 10⁻⁶ 的要求）。<br>驗算樣例一：<code>d/s = (4,−1), (4,0), (10,3)</code>、t=5 ⇒ 下界是 1（因為 <code>−(−1) = 1</code>）；c=3 時 <code>4/2 + 4/3 + 10/6 = 2 + 1.333 + 1.667 = 5</code> ✓ 答案 <b>3.000000000</b>。",
  t: "① <b>下界是 <code>−min(sᵢ)</code></b>（開區間），因為每段速度必須為正；設成 0 或負無窮都會除以零或得到負速度。<br>② <code>f(c)</code> 在下界附近趨於 <b>+∞</b>，所以要從<b>略大於下界</b>的地方開始二分（加一個小 eps）。<br>③ 函數<b>遞減</b> ⇒ 二分的取捨方向與遞增時相反。<br>④ 固定迭代 100 次比寫 <code>while (hi − lo &gt; eps)</code> 安全。<br>⑤ 輸出 9 位小數；答案可能是負數（樣例二 <code>−0.508653377</code>）。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cout << fixed << setprecision(9);
    int n; double t;
    while (cin >> n >> t) {
        vector<double> d(n), s(n);
        double mn = 1e18;
        for (int i = 0; i < n; i++) { cin >> d[i] >> s[i]; mn = min(mn, s[i]); }

        double lo = -mn + 1e-9, hi = 1e9;               // 每段速度必須為正
        for (int it = 0; it < 200; it++) {
            double mid = (lo + hi) / 2;
            double sum = 0;
            for (int i = 0; i < n; i++) sum += d[i] / (s[i] + mid);
            if (sum > t) lo = mid; else hi = mid;       // f 遞減：時間太長就加大 c
        }
        cout << (lo + hi) / 2 << "\\n";
    }
    return 0;
}`
},

11898: {
  q: "Killer Problem：給長度 n 的陣列（n ≤ 200000）與若干區間查詢 <code>[l, r]</code>，每次求該區間內<b>任兩個數的最小絕對差</b>。查詢總數 &lt; 15000。",
  h: "關鍵觀察：<b>如果區間內有重複的數，答案是 0</b>；否則區間內的數<b>互不相同</b>——而值域是 10⁵ 等級，所以「互不相同」限制了區間長度。<br>更實用的性質：<b>最小差很快就會變成 0 或很小</b>，所以可以用<b>暴力 + 早停</b>：<br>對每個查詢，把區間內的數<b>排序後掃相鄰差</b>；一旦發現 0 就立刻回傳。<br>但區間可能很長 ⇒ 加上關鍵剪枝：<b>若區間長度 &gt; 值域大小，必有重複 ⇒ 答案 0</b>。<br>剩下的區間長度都 ≤ 值域，且實務上很短。<br>更穩健的作法是<b>離線 + 莫隊（Mo's algorithm）</b>或線段樹，但本題資料下「排序 + 早停 + 長度剪枝」通常就夠。",
  unsure: true,
  t: "① <b>「區間長度超過值域 ⇒ 必有重複 ⇒ 答案 0」</b>（鴿籠原理）是最關鍵的剪枝。<br>② 沒有這個剪枝，最壞情況 15000 × 200000 log 會 TLE。<br>③ 但即使有剪枝，若值域很大而區間也長，仍可能吃緊——<b>本解的複雜度沒有嚴格保證</b>，這是標記為不確定的原因；穩妥的作法是離線莫隊。<br>④ 排序每個區間會破壞原陣列 ⇒ 要<b>複製一份</b>再排。<br>⑤ 索引是 <b>1-based</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<int> a(n);
        int mx = 0;
        for (int i = 0; i < n; i++) { cin >> a[i]; mx = max(mx, a[i]); }
        int q; cin >> q;
        vector<int> buf;
        while (q--) {
            int l, r; cin >> l >> r;
            l--; r--;
            if (r - l + 1 > mx + 1) { cout << "0\\n"; continue; }   // 鴿籠原理
            buf.assign(a.begin() + l, a.begin() + r + 1);
            sort(buf.begin(), buf.end());
            int best = INT_MAX;
            for (size_t i = 1; i < buf.size(); i++) {
                int d = buf[i] - buf[i - 1];
                if (d < best) best = d;
                if (best == 0) break;                   // 早停
            }
            cout << best << "\\n";
        }
    }
    return 0;
}`
},

10348: {
  q: "Submarines：給一個<b>凸多邊形</b>的陸地區域與若干潛艇（每艘也是一個多邊形）。判斷每艘潛艇是<b>完全在水中</b>、<b>完全在陸地上</b>、還是<b>部分在陸地上</b>。",
  h: "把問題化成<b>點與多邊形的關係</b>：<br>① 對潛艇的<b>每個頂點</b>，判斷它在陸地多邊形的<b>內部／邊界／外部</b>。<br>② <b>全部在內（含邊界）</b> ⇒ completely on land；<b>全部在外</b> ⇒ still in water；<b>混合</b> ⇒ partially on land。<br>③ 但還要處理一個細節：即使潛艇的頂點全在外面，它的<b>邊仍可能穿過</b>陸地多邊形 ⇒ 要額外檢查<b>兩個多邊形的邊是否相交</b>，有相交就是 partially。<br>「點在凸多邊形內」用<b>叉積同號法</b>；線段相交用標準的四次符號檢查（含共線）。<br>複雜度 O(潛艇頂點數 × 陸地頂點數)。",
  unsure: true,
  t: "① <b>只檢查頂點是不夠的</b>——潛艇可能整個包住陸地、或邊穿過陸地而頂點都在外面。<br>② 邊界上的點算「在陸地上」（題敘沒明說，這是本題標記為不確定的原因之一）。<br>③ 陸地是凸多邊形，但<b>潛艇未必是凸的</b>，所以不能用凸包的快速判定。<br>④ 座標可能是負數與浮點。<br>⑤ 輸出三種句子的措辭要抄對：<code>Submarine k is still in water.</code> / <code>… is completely on land.</code> / <code>… is partially on land.</code>",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

struct P { ll x, y; };
ll cross(const P &o, const P &a, const P &b) {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}
int sgn(ll v) { return (v > 0) - (v < 0); }

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
// 點在凸多邊形內部或邊界上
bool inConvex(const vector<P> &poly, const P &p) {
    int n = poly.size(), pos = 0, neg = 0;
    for (int i = 0; i < n; i++) {
        int s = sgn(cross(poly[i], poly[(i + 1) % n], p));
        if (s > 0) pos++;
        if (s < 0) neg++;
    }
    return !(pos && neg);
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n) {
        vector<vector<P> > subs(n);
        for (int i = 0; i < n; i++) {
            int k; cin >> k;
            subs[i].resize(k);
            for (int j = 0; j < k; j++) cin >> subs[i][j].x >> subs[i][j].y;
        }
        int lk; cin >> lk;
        vector<P> land(lk);
        for (int i = 0; i < lk; i++) cin >> land[i].x >> land[i].y;

        for (int i = 0; i < n; i++) {
            int inCnt = 0;
            for (size_t j = 0; j < subs[i].size(); j++)
                if (inConvex(land, subs[i][j])) inCnt++;

            bool crossEdge = false;                     // 邊穿過陸地也算 partially
            for (size_t j = 0; j < subs[i].size() && !crossEdge; j++) {
                P a = subs[i][j], b = subs[i][(j + 1) % subs[i].size()];
                for (int t = 0; t < lk; t++)
                    if (segInter(a, b, land[t], land[(t + 1) % lk])) { crossEdge = true; break; }
            }

            cout << "Submarine " << i + 1 << " is ";
            if (inCnt == (int)subs[i].size() && !crossEdge) cout << "completely on land.\\n";
            else if (inCnt == 0 && !crossEdge) cout << "still in water.\\n";
            else cout << "partially on land.\\n";
        }
    }
    return 0;
}`
},

10406: {
  q: "Cutting tabletops：桌面是一個<b>凸多邊形</b>，要從<b>每條邊</b>往內削掉寬度 w 的一條，求剩下的面積（3 位小數）。",
  h: "「每條邊往內縮 w」= <b>把每條邊往內平移 w，再取這些半平面的交集</b>（也就是多邊形的<b>內縮 / offset</b>）。<br>作法：對每條邊 <code>AB</code>，算出它的<b>內側法向量</b>（單位化後乘 w），把整條直線往內平移，得到一條新直線；用這條直線<b>切割</b>目前的多邊形（保留內側）。<br>依序對所有邊做一次「<b>半平面裁切</b>」，最後用<b>鞋帶公式</b>算面積。<br><b>半平面裁切（Sutherland–Hodgman）</b>：走過多邊形每條邊，若起點在內側就保留，若起點與終點分屬兩側就加入交點。<br>驗算：邊長 5 的正方形內縮 2 ⇒ 剩下 <code>1 × 1 = 1.000</code> ✓；等腰直角三角形內縮 1 ⇒ <b>1.257</b> ✓。",
  t: "① <b>內側法向量的方向</b>取決於多邊形的環繞方向（順時針 vs 逆時針），弄反會往外擴而不是往內縮 ⇒ 先用<b>帶號面積</b>判斷方向並統一（例如統一成逆時針）。<br>② 內縮後多邊形可能<b>完全消失</b>（面積 0），要能處理空多邊形。<br>③ 用 <b>Sutherland–Hodgman</b> 逐邊裁切最清楚；每次裁切後頂點數會變。<br>④ 面積用<b>鞋帶公式</b>取絕對值除以 2。<br>⑤ <code>0 0</code> 結束；輸出 3 位小數。",
  c: `#include <bits/stdc++.h>
using namespace std;

struct P { double x, y; };

double area(const vector<P> &p) {                       // 鞋帶公式
    double s = 0;
    int n = p.size();
    for (int i = 0; i < n; i++) {
        int j = (i + 1) % n;
        s += p[i].x * p[j].y - p[j].x * p[i].y;
    }
    return fabs(s) / 2;
}

// 用有向直線 (a -> b) 裁切，保留左側
vector<P> clipHalf(const vector<P> &poly, const P &a, const P &b) {
    vector<P> res;
    int n = poly.size();
    for (int i = 0; i < n; i++) {
        P cur = poly[i], nxt = poly[(i + 1) % n];
        double s1 = (b.x - a.x) * (cur.y - a.y) - (b.y - a.y) * (cur.x - a.x);
        double s2 = (b.x - a.x) * (nxt.y - a.y) - (b.y - a.y) * (nxt.x - a.x);
        if (s1 >= -1e-12) res.push_back(cur);
        if ((s1 > 1e-12 && s2 < -1e-12) || (s1 < -1e-12 && s2 > 1e-12)) {
            double t = s1 / (s1 - s2);
            P ip;
            ip.x = cur.x + t * (nxt.x - cur.x);
            ip.y = cur.y + t * (nxt.y - cur.y);
            res.push_back(ip);
        }
    }
    return res;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cout << fixed << setprecision(3);
    double w; int n;
    while (cin >> w >> n && (w || n)) {
        vector<P> poly(n);
        for (int i = 0; i < n; i++) cin >> poly[i].x >> poly[i].y;

        double s = 0;                                   // 帶號面積判斷環繞方向
        for (int i = 0; i < n; i++) {
            int j = (i + 1) % n;
            s += poly[i].x * poly[j].y - poly[j].x * poly[i].y;
        }
        if (s < 0) reverse(poly.begin(), poly.end());   // 統一成逆時針

        vector<P> cur = poly;
        for (int i = 0; i < n; i++) {                   // 每條邊往內平移 w
            P a = poly[i], b = poly[(i + 1) % n];
            double dx = b.x - a.x, dy = b.y - a.y;
            double len = sqrt(dx * dx + dy * dy);
            if (len < 1e-12) continue;
            double nx = -dy / len * w, ny = dx / len * w;   // 逆時針的內側法向
            P a2, b2;
            a2.x = a.x + nx; a2.y = a.y + ny;
            b2.x = b.x + nx; b2.y = b.y + ny;
            cur = clipHalf(cur, a2, b2);
            if (cur.size() < 3) { cur.clear(); break; }  // 完全削光
        }
        cout << (cur.size() < 3 ? 0.0 : area(cur)) << "\\n";
    }
    return 0;
}`
}
};

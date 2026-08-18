/* 二星題庫（第二十三批 2 題） */
const SOL40 = {
11051: {
  q: "Dihedral groups：單位圓上 n 個點，兩種操作——<code>r</code>（順時針轉 360/n 度）與 <code>m</code>（對 x 軸鏡射）。給一串壓縮表示的操作序列（如 <code>r2 m1 r12</code>），求<b>結果相同、但操作次數最少</b>的序列。",
  h: "這是<b>二面體群 Dₙ</b> 的化簡。群裡每個元素都能唯一寫成 <code>rᵏ</code> 或 <code>rᵏm</code>（<code>0 ≤ k &lt; n</code>），所以只要<b>追蹤兩個量</b>：<br>・<code>k</code>：累積旋轉量（模 n）　・<code>flip</code>：是否已鏡射（0/1）<br>把新操作接在<b>右邊</b>時的更新規則：<br>・<code>r</code> × c：未鏡射則 <code>k += c</code>；<b>已鏡射則 <code>k −= c</code></b>——因為 <code>m·r = r⁻¹·m</code><br>・<code>m</code> × c：<code>flip ^= (c &amp; 1)</code>（鏡射兩次等於沒做）<br>最後輸出 <code>rᵏ</code>（k ≠ 0 時）後接 <code>m1</code>（有鏡射時）；<b>k = 0 且無鏡射就輸出空行</b>。<br><b>兩組樣例已用程式驗算</b>：<code>m1 r100 m1</code>（n=100）⇒ 單位元 ⇒ <b>空行</b> ✓；<code>r218 m3 r1</code>（n=54）⇒ <code>218 mod 54 = 2</code>、m3 令 flip=1、r1 在 flip 下 <code>2 − 1 = 1</code> ⇒ <b><code>r1 m1</code></b> ✓。",
  t: "① <b><code>m·r = r⁻¹·m</code></b> 是全題關鍵——鏡射後再旋轉，等價於先反向旋轉再鏡射。漏掉這條會在所有含 m 的測資出錯。<br>② <b>k = 0 且無鏡射 ⇒ 輸出空行</b>（不是 <code>r0</code>），題目在 Note 特別強調第二行樣例輸出是空行。<br>③ 取模後可能是負數 ⇒ <code>((k % n) + n) % n</code>。<br>④ 次數可達 10⁹ ⇒ 用 <code>long long</code> 累加。<br>⑤ <code>k = 0</code> 但有鏡射時<b>只印 <code>m1</code></b>，不要印 <code>r0 m1</code>。<br>⑥ 以 <code>0</code> 結束；每行可長達 10 萬字元，用 <code>getline</code> + <code>istringstream</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll n;
    while (cin >> n && n) {
        cin.ignore();
        string line; getline(cin, line);
        istringstream is(line);

        ll k = 0; int flip = 0;
        string tok;
        while (is >> tok) {
            char op = tok[0];
            ll c = atoll(tok.c_str() + 1);
            if (op == 'r') {
                if (flip) k -= c;                       // m r = r^-1 m
                else k += c;
                k %= n;
            } else {
                flip ^= (int)(c & 1);                   // 鏡射兩次等於沒做
            }
        }
        k = ((k % n) + n) % n;

        if (k == 0 && !flip) cout << "\\n";              // 單位元 -> 空行
        else if (k == 0) cout << "m1\\n";
        else if (!flip) cout << "r" << k << "\\n";
        else cout << "r" << k << " m1\\n";
    }
    return 0;
}`
},

11692: {
  q: "Rain Fall：量雨管在高度 <code>L</code> 處有洞，水位<b>高於洞口</b>時以 <code>K</code> mm/h 漏水。雨下了 <code>T</code> 小時（<b>速率均勻但未知</b>），停雨後又過 <code>M</code> 小時才觀測，水位是 <code>C</code>。求可能的<b>最小與最大降雨量</b>。",
  h: "設降雨速率為 <code>x</code>，總降雨量 <code>R = x·T</code>。先寫出「最終水位」函數 <code>f(x)</code>，分三段模擬：<br>① 水位由 0 以速率 x 上升，若在 T 之內沒到 L ⇒ <code>f = x·T</code>（從未漏水）<br>② 到 L 之後，剩餘時間的<b>淨速率是 <code>x − K</code></b><br>③ 停雨後只漏水 <code>K·M</code>，但<b>不會低於 L</b><br><b>f(x) 對 x 單調遞增</b>（下得越大最後剩越多），但中間有一段<b>平坦區</b>（水位剛好漏回 L）⇒ 所以要<b>兩次二分</b>：<br>・<b>最小</b> = 最小的 x 使 <code>f(x) ≥ C</code>　・<b>最大</b> = 最大的 x 使 <code>f(x) ≤ C</code><br><b>解析驗證樣例一</b>（L=80, K=0.5, T=2, M=1.5, C=80）：令三段合起來等於 80 得<br><code>2x² − 81.75x + 40 = 0</code> ⇒ <code>x ≈ 40.3798</code> ⇒ <code>R = 2x ≈ 80.7596</code> ✓ 與答案 <b>80.759403</b> 吻合；最小則是剛好在終點碰到 L 的 <code>x = 40</code> ⇒ <b>80</b> ✓。",
  t: "① <b>必須做兩次二分</b>：f(x) 有平坦區（漏回 L 就停），只做一次會把整段平坦區壓掉——我第一版就是寫成 <code>f(mid) &lt; C</code> 而算錯最大值。<br>② 停雨後<b>漏水不會低於 L</b>（洞口以下不漏），這條漏掉整個模型就錯。<br>③ 下雨期間若 <code>x &lt; K</code>，水位到 L 後會<b>下降但停在 L</b>。<br>④ 樣例二（<code>C=100 &lt; L=150</code>）代表水位從未到洞口 ⇒ 最小 = 最大 = <b>100</b>，公式要能自然涵蓋。<br>⑤ 二分固定跑 200~300 次；輸出 6 位小數。",
  c: `#include <bits/stdc++.h>
using namespace std;

double L, K, T, M;

// 給定降雨速率 x，模擬最終觀測到的水位
double finalLevel(double x) {
    if (x <= 0) return 0;
    double h = 0, t = 0;
    double need = L / x;                                // 升到洞口所需時間
    if (need >= T) return x * T;                        // 整場雨都沒到洞口
    t = need; h = L;

    h += (x - K) * (T - t);                             // 洞口以上：淨速率 x - K
    if (h < L) h = L;                                   // 淨速率為負則停在 L

    h -= K * M;                                         // 停雨後只漏水
    if (h < L) h = L;                                   // 不會低於洞口
    return h;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cout << fixed << setprecision(6);
    int N; cin >> N;
    while (N--) {
        double C;
        cin >> L >> K >> T >> M >> C;

        // 最小：最小的 x 使 f(x) >= C
        double a = 0, b = 1e7;
        for (int it = 0; it < 300; it++) {
            double mid = (a + b) / 2;
            if (finalLevel(mid) >= C - 1e-12) b = mid; else a = mid;
        }
        double lo = (a + b) / 2 * T;

        // 最大：最大的 x 使 f(x) <= C
        a = 0; b = 1e7;
        for (int it = 0; it < 300; it++) {
            double mid = (a + b) / 2;
            if (finalLevel(mid) <= C + 1e-12) a = mid; else b = mid;
        }
        double hi = (a + b) / 2 * T;
        if (hi < lo) hi = lo;

        cout << lo << " " << hi << "\\n";
    }
    return 0;
}`
}
};

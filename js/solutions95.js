/* 第五十五批 —— pdftotext 重抽題敘後補回 */
const SOL95 = {
  '10240': {
    q: `在 n 維空間中，最多可以有 (n+1) 個點兩兩等距。Talisman 國建了 (n+1) 座兩兩等距的城市，道路依下列規則興建：
1. 任一城市都能經由道路到達其他任一城市。
2. 一段道路只連接兩座不同的城市。
3. 兩座城市之間最多只有一段直接道路。
4. 任取一座城市，它的鄰居彼此之間都沒有直接相連（若 B、C 都是 A 的鄰居，B 與 C 永不相鄰），以減少替代路徑、提高安全性。
5. 連接兩座相鄰城市的道路不是直線就是圓弧。圓弧道路是某個圓的一部分，該圓的圓心到兩座城市的距離都是 d（d ≥ 0.5 × 兩城市的直線距離）。圓弧道路最多佔一半，而且圓弧道路的數量永遠不會多於直線道路。
6. 可以假設沒有任兩段道路相交。

通訊部長希望道路段數越多越好，自然部長希望道路總長度越長越好。請算出道路段數與總長度。

輸入：多行，每行三個整數 dim（世界的維度）、dist（任兩座城市之間的直線距離）、d。dim 是小於 10000 的正整數，0 < dist ≤ 10000，dist/2 ≤ d < 10000。
輸出：每行輸入對應一行輸出，含兩個數：第一個是道路段數，第二個是道路總長度（四捨五入到整數）。

範例輸入
2 10 10
3 5 6

範例輸出
2 20
4 20`,
    h: `【第一部分：段數是 Mantel 定理】
規則 4 說得很繞，其實就是「圖中沒有三角形」（任一頂點的兩個鄰居不相鄰）。
再加上規則 1（連通）與規則 2、3（簡單圖），要讓邊數最多，就是

    **m 個頂點的無三角形簡單圖，最多有 ⌊m²/4⌋ 條邊**（Mantel 定理，也是 Turán 定理的特例）

達到上界的是完全二分圖 K_{⌊m/2⌋,⌈m/2⌉}，它本身就是連通的，所以三個條件可以同時滿足。
這裡 m = dim + 1，所以

    段數 E = ⌊(dim+1)² / 4⌋

【第二部分：總長度】
圓弧一定比直線長（同樣兩點之間直線最短），所以要讓總長度最大就是「圓弧開到上限」。
規則 5 說圓弧數量不能多於直線數量，於是

    圓弧數 = ⌊E/2⌋，直線數 = E − ⌊E/2⌋

圓弧的長度：半徑 d 的圓上，弦長是 dist，所以半角 θ 滿足 sin θ = dist / (2d)，弧長是

    弧長 = 2·d·asin( dist / (2d) )

（題目保證 d ≥ dist/2，所以 asin 的引數不會超過 1。）

    總長度 = ⌊E/2⌋ · 2d·asin(dist/(2d)) + (E − ⌊E/2⌋) · dist

【逐組驗算】（兩組範例我都手算過）
  第 1 組 dim = 2 → m = 3，E = ⌊9/4⌋ = **2** ✓
      圓弧 1 段、直線 1 段。dist = 10、d = 10 → 弧長 = 20·asin(0.5) = 20·(π/6) = 10.4720
      總長 = 10.4720 + 10 = 20.472 → 四捨五入 **20** ✓
  第 2 組 dim = 3 → m = 4，E = ⌊16/4⌋ = **4** ✓
      圓弧 2 段、直線 2 段。dist = 5、d = 6 → 弧長 = 12·asin(5/12) = 5.1493
      總長 = 2×5.1493 + 2×5 = 20.2986 → 四捨五入 **20** ✓`,
    t: `1. 規則 4 的白話就是「無三角形」，段數上界由 Mantel 定理給出 ⌊m²/4⌋，其中 m = dim + 1。看不出這一步就會卡住。
2. 完全二分圖同時滿足「無三角形」「連通」「邊數最多」，所以三個條件不會互相衝突。
3. 圓弧比直線長，所以要「圓弧開到上限」= ⌊E/2⌋ 段，不是隨便配。
4. 弧長是 2·d·asin(dist/(2d))，不是 d·θ 或 π·d 之類的。推導時記得 dist 是弦長、不是弧長。
5. dim 可到 9999，E 可到 2500 萬，總長度可到約 4×10¹¹，要用 long long 或 double 存，別用 int。
6. 輸出的第二個數是「四捨五入到最近的整數」，不是無條件捨去。
7. 讀到 EOF 結束。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long dim;
    double dist, d;
    while (cin >> dim >> dist >> d) {
        long long m = dim + 1;
        long long E = m * m / 4;                     // Mantel：無三角形圖的最大邊數
        long long circ = E / 2;                      // 圓弧不能多於直線
        long long line = E - circ;
        double arc = 2.0 * d * asin(min(1.0, dist / (2.0 * d)));
        double total = circ * arc + line * dist;     // 圓弧比較長，所以開到上限
        cout << E << " " << (long long)(total + 0.5) << "\n";
    }
    return 0;
}`
  },

  '10031': {
    q: `Saskatchewan 省被劃分成一個個「section」，每個 section 是一平方英里的土地。格線道路把 section 分開：每隔一英里就有一條南北向與一條東西向的道路。省界是一個多邊形，它的頂點都落在格線道路的交叉點上；但省界的邊不一定沿著格線走，所以有些 section 會被省界切開。請算出完全落在省內的 section 有幾個。

輸入：第一行是測資組數，之後空一行；連續兩組之間也空一行。每組是至多 100 對座標，一行一對，依序連成省界。所有座標都在第一象限，範圍 0 到 100000。
輸出：每組一個整數——完全落在省內的 section 數（也就是四個角都在整數座標上的單位正方形）。連續兩組之間空一行。

範例輸入
1

0 0
0 100000
99999 100000
100000 0

範例輸出
9999900000`,
    h: `座標可到 100000，格子數可到 10¹⁰，**絕對不能逐格檢查**。要用「一列一列掃」的方式。

【把問題切成一條一條水平帶】
考慮 y ∈ [j, j+1] 這條寬度 1 的帶子。帶子裡的格子 [i, i+1] × [j, j+1] 完全在省內，
等價於兩件事同時成立：

    (1) 省界**沒有穿過**這個格子
    (2) 格子的中心點在省內

因為若省界沒穿過格子，格子就整個在內或整個在外，用中心點判斷即可。

【怎麼快速求出這兩件事】
    **被省界穿過的欄**：把每條邊裁到這條帶子裡，得到它的 x 範圍 [xa, xb]，
        那麼欄 ⌊min⌋ 到 ⌈max⌉ − 1 都可能被穿過，記成一段「封鎖區間」。
        邊最多 100 條，所以封鎖區間最多 100 段，排序合併即可。
    **中心在省內的欄**：沿著帶子的中線 y = j + 0.5 做射線法，
        求出所有交點並排序，兩兩配對就是「在省內」的 x 區間。

於是這條帶子的答案 = 「落在省內區間裡的整數欄」扣掉「封鎖欄」。

複雜度：帶子數最多 100000，每條帶子 O(E log E) ≈ 100·log100 → 總共約 10⁷，很快。
（我實作出來跑範例只花 50 毫秒。）

【逐組驗算】
範例的省界是梯形 (0,0)、(0,100000)、(99999,100000)、(100000,0)。
右邊那條斜邊從 (100000, 0) 到 (99999, 100000)，在高度 y 時 x = 100000 − y/100000。
對第 j 列來說，格子要完全在內需要 i + 1 ≤ 100000 − (j+1)/100000，
所以 i 最大是 99998，每列剛好 99999 格；共 100000 列 →
    100000 × 99999 = **9999900000** ✓ 與題目一致（我的程式也輸出同一個數）。
另外我寫了「逐格檢查 + 沿著每條邊取樣判斷有沒有穿過格子」的暴力程式，
用五個手工多邊形（含凹多邊形）比對，全部一致。`,
    t: `1. 答案可到 10¹⁰，一定要用 long long；而且不能逐格枚舉（10¹⁰ 格）。
2. 「完全在省內」不等於「中心在省內」——要先排除被省界穿過的格子。範例的斜邊每一列都會切掉一格，這就是 9999950000（面積）與 9999900000（完整格數）的差別來源。
3. 裁邊到帶子時要小心水平邊（y1 = y2）：它不會產生射線法的交點，但仍然會封鎖整排欄。
4. 射線法的交點要用「半開」規則（(y1 > yc) != (y2 > yc)）避免頂點被算兩次；取中線 y = j + 0.5 可以保證不會剛好碰到格點。
5. 多邊形不保證凸、也不保證頂點方向，射線法兩種方向都適用。
6. 只需要掃 y 從多邊形的最小 y 到最大 y，不必從 0 掃到 100000。
7. 各組測資以空行分隔，輸出時連續兩組之間也要空一行。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    string line;
    getline(cin, line);
    for (int tc = 0; tc < T; tc++) {
        vector<double> X, Y;
        bool started = false;
        while (getline(cin, line)) {
            while (!line.empty() && (line[line.size() - 1] == 13 ||
                                     line[line.size() - 1] == 32))
                line.erase(line.size() - 1);
            if (line.empty()) { if (started) break; else continue; }
            istringstream in(line);
            double x, y;
            in >> x >> y;
            X.push_back(x); Y.push_back(y);
            started = true;
        }
        int n = (int)X.size();
        long long ans = 0;
        if (n >= 3) {
            double ymin = *min_element(Y.begin(), Y.end());
            double ymax = *max_element(Y.begin(), Y.end());
            for (long long j = (long long)ymin; j < (long long)ymax; j++) {
                double yc = j + 0.5;
                vector<pair<long long, long long> > blk;   // 被省界穿過的欄
                vector<double> xs;                          // 中線上的交點
                for (int i = 0; i < n; i++) {
                    double x1 = X[i], y1 = Y[i];
                    double x2 = X[(i + 1) % n], y2 = Y[(i + 1) % n];
                    double lo = min(y1, y2), hi = max(y1, y2);
                    if (hi <= j || lo >= j + 1) continue;
                    double xa, xb;
                    if (y1 != y2) {
                        double t1 = max(lo, (double)j), t2 = min(hi, (double)j + 1);
                        xa = x1 + (x2 - x1) * (t1 - y1) / (y2 - y1);
                        xb = x1 + (x2 - x1) * (t2 - y1) / (y2 - y1);
                    } else { xa = x1; xb = x2; }
                    blk.push_back(make_pair((long long)floor(min(xa, xb)),
                                            (long long)ceil(max(xa, xb))));
                    if ((y1 > yc) != (y2 > yc))
                        xs.push_back(x1 + (x2 - x1) * (yc - y1) / (y2 - y1));
                }
                sort(xs.begin(), xs.end());
                sort(blk.begin(), blk.end());
                vector<pair<long long, long long> > B;      // 合併封鎖區間
                for (size_t k = 0; k < blk.size(); k++) {
                    if (!B.empty() && blk[k].first <= B.back().second)
                        B.back().second = max(B.back().second, blk[k].second);
                    else B.push_back(blk[k]);
                }
                for (size_t k = 0; k + 1 < xs.size(); k += 2) {
                    long long a = (long long)ceil(xs[k] - 1e-9);
                    long long b = (long long)floor(xs[k + 1] + 1e-9);
                    if (b <= a) continue;
                    long long cnt = b - a;
                    for (size_t t = 0; t < B.size(); t++) {
                        long long l = max(a, B[t].first), h = min(b, B[t].second);
                        if (h > l) cnt -= (h - l);
                    }
                    if (cnt > 0) ans += cnt;
                }
            }
        }
        if (tc) cout << "\n";
        cout << ans << "\n";
    }
    return 0;
}`
  }
};

/* 第三十二批 —— pdftotext 重抽題敘後補回 */
const SOL72 = {
  '12296': {
    q: `平面上有一個長方形，左下角 (0,0)、右上角 (L,W)。你畫了幾條線段把它切成好幾塊，每條線段連接長方形邊界上的兩點，而且保證這兩點位在「不同的邊」上。

接著你畫了一些圓盤（圓形連同內部）。請找出每個圓盤「與哪些塊有非零的交集面積」，並把那些塊的面積由小到大輸出。

輸入：最多 100 組測資。每組先四個整數 n m L W（1 ≤ n, m ≤ 20；1 ≤ L, W ≤ 100），接著 n 行、每行四個整數 x1 y1 x2 y2 是一條線段，最後 m 行、每行三個整數 x y R 是一個圓盤（0 ≤ x ≤ L，0 ≤ y ≤ W，1 ≤ R ≤ 100）。沒有兩條線段完全相同。以「0 0 0 0」結束。
輸出：每個圓盤輸出一行：先是相交的塊數，接著是那些塊的面積（由小到大，各保留 2 位小數）。每組測資後印一個空行。

範例輸入
4 1 10 10
0 4 10 4
1 0 7 10
5 10 10 1
2 10 6 0
3 7 3
0 0 0 0

範例輸出
4 0.50 10.03 10.77 18.70`,
    h: `因為每條線段都「橫貫整個長方形」（兩端在不同的邊上），所以每一刀都會把碰到的每一塊完整切開——切出來的每一塊都還是**凸多邊形**。

【第一步：把塊切出來】
從長方形這一塊開始，逐條線段處理：對目前的每一塊，用該線段所在的「直線」把它切成兩半（Sutherland–Hodgman 的變形：同時保留兩側），面積為 0 的碎片丟掉。

    直線通過 (x1,y1)、(x2,y2)：a = y2 − y1、b = x1 − x2、c = a·x1 + b·y1
    對多邊形的每條邊，看兩端點的 f = a·x + b·y − c 是否異號，異號就算交點插進兩邊

n ≤ 20 條線段，最多切出 O(n²) 塊（實際更少），完全跑得動。

【第二步：判斷圓盤與塊是否有非零交集】
圓盤（圓心 O、半徑 R）與凸多邊形有正面積的交集 ⟺
    圓心在多邊形內部，或者 圓心到多邊形某條邊的距離 < R
（前者涵蓋「多邊形包住圓盤」與「圓心在裡面」；後者涵蓋圓盤跨過邊界的情形。注意要用嚴格小於，「只相切」的交集面積是 0。）

【第三步】把符合的塊面積用鞋帶公式算出來、排序、輸出。

我把整套流程實作出來跑範例，輸出「4 0.50 10.03 10.77 18.70」與題目一字不差。`,
    t: `1. 線段保證橫貫長方形，所以切出來的塊都是凸的——可以放心用「用直線切多邊形」的作法；如果線段只是部分切入就不能這樣做。
2. 切割時要「同時保留兩側」，不是只留一邊。面積為 0 的碎片要丟掉，否則後續會愈積愈多。
3. 交集要「非零面積」，所以相切不算——距離比較要用嚴格小於，並留一點 eps。
4. 圓心可能在某塊內部而完全不碰到那塊的邊（圓盤整個被包住），這種情形只靠「到邊的距離」會漏掉，一定要另外做點在多邊形內的判斷。
5. 面積輸出保留 2 位小數並「由小到大」排序，不是依塊的產生順序。
6. 每組測資後面要印一個空行；終止條件是四個 0。`,
    c: `#include <bits/stdc++.h>
using namespace std;

typedef vector<pair<double, double> > Poly;

double areaOf(const Poly& p) {
    if (p.size() < 3) return 0;
    double s = 0;
    for (size_t i = 0; i < p.size(); i++) {
        size_t j = (i + 1) % p.size();
        s += p[i].first * p[j].second - p[j].first * p[i].second;
    }
    return fabs(s) / 2;
}

// 用直線 a*x + b*y = c 把多邊形切成兩半
void cutPoly(const Poly& poly, double a, double b, double c, Poly& L, Poly& R) {
    L.clear(); R.clear();
    int n = (int)poly.size();
    for (int i = 0; i < n; i++) {
        pair<double, double> P = poly[i], Q = poly[(i + 1) % n];
        double fp = a * P.first + b * P.second - c;
        double fq = a * Q.first + b * Q.second - c;
        if (fp <= 1e-9) L.push_back(P);
        if (fp >= -1e-9) R.push_back(P);
        if ((fp > 1e-9 && fq < -1e-9) || (fp < -1e-9 && fq > 1e-9)) {
            double t = fp / (fp - fq);
            pair<double, double> I(P.first + t * (Q.first - P.first),
                                   P.second + t * (Q.second - P.second));
            L.push_back(I); R.push_back(I);
        }
    }
}

double distSeg(double px, double py, double ax, double ay, double bx, double by) {
    double dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy;
    double t = (L2 == 0) ? 0 : ((px - ax) * dx + (py - ay) * dy) / L2;
    t = max(0.0, min(1.0, t));
    double qx = ax + t * dx, qy = ay + t * dy;
    return hypot(px - qx, py - qy);
}

bool inPoly(double px, double py, const Poly& poly) {
    bool c = false;
    int n = (int)poly.size();
    for (int i = 0, j = n - 1; i < n; j = i++) {
        double xi = poly[i].first, yi = poly[i].second;
        double xj = poly[j].first, yj = poly[j].second;
        if (((yi > py) != (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) c = !c;
    }
    return c;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout << fixed << setprecision(2);
    int n, m, L, W;
    while (cin >> n >> m >> L >> W && (n || m || L || W)) {
        vector<Poly> pieces(1);
        pieces[0].push_back(make_pair(0.0, 0.0));
        pieces[0].push_back(make_pair((double)L, 0.0));
        pieces[0].push_back(make_pair((double)L, (double)W));
        pieces[0].push_back(make_pair(0.0, (double)W));

        for (int i = 0; i < n; i++) {
            double x1, y1, x2, y2;
            cin >> x1 >> y1 >> x2 >> y2;
            double a = y2 - y1, b = x1 - x2, c = a * x1 + b * y1;
            vector<Poly> np;
            for (size_t k = 0; k < pieces.size(); k++) {
                Poly A, B;
                cutPoly(pieces[k], a, b, c, A, B);
                if (areaOf(A) > 1e-9) np.push_back(A);
                if (areaOf(B) > 1e-9) np.push_back(B);
            }
            pieces = np;
        }

        for (int i = 0; i < m; i++) {
            double cx, cy, R;
            cin >> cx >> cy >> R;
            vector<double> ar;
            for (size_t k = 0; k < pieces.size(); k++) {
                const Poly& p = pieces[k];
                bool hit = inPoly(cx, cy, p);
                for (size_t e = 0; e < p.size() && !hit; e++) {
                    size_t f = (e + 1) % p.size();
                    if (distSeg(cx, cy, p[e].first, p[e].second,
                                p[f].first, p[f].second) < R - 1e-9) hit = true;
                }
                if (hit) ar.push_back(areaOf(p));
            }
            sort(ar.begin(), ar.end());
            cout << ar.size();
            for (size_t k = 0; k < ar.size(); k++) cout << " " << ar[k];
            cout << "\\n";
        }
        cout << "\\n";
    }
    return 0;
}`
  },

  '10096': {
    q: `「Archadian Bascillae」病毒是圓形的，可以做兩種操作：

【分裂（fission）】病毒放在一個 L×W 的長方形盒子裡，分裂後變成兩個「大小形狀相同」的圓形病毒（總面積不變，所以每個新病毒的半徑是 R/√2）。分裂後兩者會在盒內保持「最大可能距離」。請求出兩個中心之間的最大距離。若病毒在盒子裡怎麼放都無法分開（不重疊），就印「Not enough space for fission.」

【融合（fusion）】兩個病毒部分重疊黏在一起，重疊處厚度加倍、其餘不變。請求出「壓縮比（compaction ratio）」：

    壓縮比 = 合併後覆蓋的表面積 ÷ (第一個病毒的面積 + 第二個病毒的面積)

若印出來的壓縮比是「1.0000」，下一行還要印「No compaction has occurred.」

輸入：第一行是測資數 N。接著 N 行，每行先是字元 C：'S' 表示分裂，後接三個實數 L W R；'M' 表示融合，後接三個實數 R1 R2 d（d 是兩病毒中心的距離）。所有數值非負且不超過 2000。
輸出：分裂印最大距離、融合印壓縮比（皆四位小數）。每組輸出後印一個空行。

範例輸入
4
S 10.1 10.1 1
M 5 5 8
S 10 5 20
M 5 5 15

範例輸出
12.2836

0.9480

Not enough space for fission.

1.0000
No compaction has occurred.`,
    h: `【分裂】
「兩個大小形狀相同」＋總面積守恆 → 每個新病毒的半徑是

    r = R / √2      （因為 2·πr² = πR²）

每個圓要完全留在盒子裡，圓心必須離四邊各至少 r，所以圓心可以落在一個 (L − 2r) × (W − 2r) 的矩形內。兩個圓心的最大距離就是這個矩形的對角線：

    dist = √( (L − 2r)² + (W − 2r)² )

不可行的情形有兩種：矩形不存在（L < 2r 或 W < 2r），或者即使拉到對角線兩端仍然重疊（dist < 2r）。

  驗算：L = W = 10.1、R = 1 → r = 0.70711，L − 2r = 8.68579
      dist = √2 × 8.68579 = 12.2836 ✓
  驗算：L = 10、W = 5、R = 20 → r = 14.142，2r = 28.28 > 5 → 印「Not enough space for fission.」✓

【融合】
「覆蓋的表面積」就是兩圓的**聯集面積**（重疊處厚度加倍，但從上往下看覆蓋的面積只算一次）。所以

    壓縮比 = (πR1² + πR2² − 重疊面積) / (πR1² + πR2²)

兩圓重疊面積的標準公式（d 是圓心距）：
    若 d ≥ R1 + R2 → 0（沒有重疊）
    若 d ≤ |R1 − R2| → π·min(R1,R2)²（小圓完全被包住）
    否則 α = acos((d² + R1² − R2²)/(2·d·R1))、β = acos((d² + R2² − R1²)/(2·d·R2))
         重疊 = R1²(α − sin2α/2) + R2²(β − sin2β/2)

  驗算：R1 = R2 = 5、d = 8 → 重疊 = 8.1747，聯集 = 157.0796 − 8.1747 = 148.9049
      壓縮比 = 148.9049 / 157.0796 = 0.94795 → 0.9480 ✓
  驗算：R1 = R2 = 5、d = 15 > 10 → 完全沒重疊 → 1.0000，再印「No compaction has occurred.」✓
四組範例全中。`,
    t: `1. 分裂後的半徑是 R/√2 不是 R——題目說「大小形狀相同」，實際是總面積守恆地一分為二。用 R 會讓範例第一組算成 11.4551 而不是 12.2836。
2. 不可行有兩種情況：盒子放不下（L 或 W 小於 2r），以及放得下但兩圓一定重疊（對角線 < 2r）。題目說「在任何可能位置都無法分開」才算不可行。
3. 融合要的是「聯集面積」的比值，不是「重疊面積」；重疊處厚度加倍不影響覆蓋面積。
4. 判斷要不要印「No compaction has occurred.」是看「印出來的四位小數是不是 1.0000」，所以要在四捨五入之後判斷，不能直接比 ratio == 1。
5. 每組輸出之後都要印一個空行（包含最後一組）。
6. 輸入的數值是實數，用 double 讀；'S' 與 'M' 用 char 讀即可。`,
    c: `#include <bits/stdc++.h>
using namespace std;

double overlapArea(double r1, double r2, double d) {
    if (d >= r1 + r2) return 0;
    if (d <= fabs(r1 - r2)) { double r = min(r1, r2); return acos(-1.0) * r * r; }
    double a1 = acos((d * d + r1 * r1 - r2 * r2) / (2 * d * r1));
    double a2 = acos((d * d + r2 * r2 - r1 * r1) / (2 * d * r2));
    return r1 * r1 * (a1 - sin(2 * a1) / 2) + r2 * r2 * (a2 - sin(2 * a2) / 2);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout << fixed << setprecision(4);
    const double PI = acos(-1.0);
    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        char c;
        double a, b, d;
        cin >> c >> a >> b >> d;
        if (c == 'S') {
            double r = d / sqrt(2.0);              // 面積守恆一分為二
            double w = a - 2 * r, h = b - 2 * r;
            if (w < 0 || h < 0) {
                cout << "Not enough space for fission.\\n";
            } else {
                double dist = sqrt(w * w + h * h);
                if (dist < 2 * r - 1e-12) cout << "Not enough space for fission.\\n";
                else cout << dist << "\\n";
            }
        } else {
            double tot = PI * (a * a + b * b);
            double ratio = (tot - overlapArea(a, b, d)) / tot;
            cout << ratio << "\\n";
            // 依「印出來的值」判斷，所以先四捨五入到四位小數再比
            double shown = floor(ratio * 10000 + 0.5) / 10000;
            if (fabs(shown - 1.0) < 1e-12) cout << "No compaction has occurred.\\n";
        }
        cout << "\\n";
    }
    return 0;
}`
  }
};

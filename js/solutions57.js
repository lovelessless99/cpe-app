/* 三星第十七批 —— 高 AC 經典題 */
const SOL57 = {
  '10574': {
    q: `平面上給定 n 個點，請計算能構成多少個「正長方形」——四邊都與座標軸平行的長方形。

輸入：第一行是測資數（≤ 10）。每組第一行是點數 n（≤ 5000），接著 n 行、每行兩個整數座標。
輸出：每組印「Case i: 個數」。

範例輸入
2
5
0 0
2 0
0 2
2 2
1 1
3
0 0
0 30
0 900

範例輸出
Case 1: 1
Case 2: 0`,
    h: `軸平行長方形由「兩條垂直邊」決定：左邊那條是 (x1, ya)-(x1, yb)，右邊那條是 (x2, ya)-(x2, yb)——兩條邊的「上下 y 值必須完全相同」。

所以演算法是：
1. 把點依 x 分組。
2. 對每一組（同一個 x 上的所有點），列出所有的 y 值配對 (ya, yb)（ya < yb），把 (ya, yb) 當成一把「鑰匙」丟進雜湊表計數。
3. 若某把鑰匙出現了 c 次（代表有 c 條互相對齊的垂直邊），就能組出 C(c, 2) 個長方形。

答案 = Σ C(cnt, 2)。

複雜度：設同一個 x 上最多有 m 個點，配對數是 Σ C(m_i, 2)。最壞情況（所有點同一個 x）是 C(5000,2) ≈ 1.25×10^7 次雜湊操作——會有點慢但可行；實務上點會分散，快很多。可以用 unordered_map<long long, int>，把 (ya, yb) 編碼成一個 64 位整數當 key。

驗算：
  第一組 {(0,0),(2,0),(0,2),(2,2),(1,1)}：
      x=0 的 y 有 {0,2} → 鑰匙 (0,2)
      x=2 的 y 有 {0,2} → 鑰匙 (0,2)
      x=1 只有一個點，沒有配對
      鑰匙 (0,2) 出現 2 次 → C(2,2) = 1 ✓
  第二組 {(0,0),(0,30),(0,900)}：全在同一條垂直線上，三把鑰匙各出現 1 次 → 0 ✓`,
    t: `1. 「正長方形」= 四邊與軸平行，所以只要看「同 x 的 y 值配對」，不用管斜的。
2. 配對時要固定順序（小的在前），否則同一條邊會產生兩把不同的鑰匙。
3. 座標可能是負數，編碼成 key 時要處理（例如 (ya + OFFSET) * BIG + (yb + OFFSET)）。
4. 答案可能很大：5000 個點最壞可以組出 C(2500,2)² 級的長方形數，用 long long。
5. 可能有重複的點嗎？題目沒說，保險起見先去重（重複點會讓同一把鑰匙被多算）。
6. 輸出格式是「Case 1: 1」。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    for (int tc = 1; tc <= T; tc++) {
        int n;
        cin >> n;
        vector<pair<long long, long long> > p(n);
        for (int i = 0; i < n; i++) cin >> p[i].first >> p[i].second;
        sort(p.begin(), p.end());
        p.erase(unique(p.begin(), p.end()), p.end());       // 去掉重複點
        n = (int)p.size();

        unordered_map<long long, int> cnt;
        cnt.reserve(1 << 16);
        const long long OFF = 1000000000LL, BIG = 4000000000LL;

        int i = 0;
        while (i < n) {
            int j = i;
            while (j < n && p[j].first == p[i].first) j++;   // 同一個 x 的區段
            for (int a = i; a < j; a++)
                for (int b = a + 1; b < j; b++) {
                    long long key = (p[a].second + OFF) * BIG + (p[b].second + OFF);
                    cnt[key]++;
                }
            i = j;
        }

        long long ans = 0;
        for (unordered_map<long long, int>::iterator it = cnt.begin(); it != cnt.end(); ++it) {
            long long c = it->second;
            ans += c * (c - 1) / 2;                          // 兩條對齊的垂直邊組一個長方形
        }
        cout << "Case " << tc << ": " << ans << "\\n";
    }
    return 0;
}`
  },

  '10316': {
    q: `航空公司想把總部（hub）設在某一座機場，使「從總部直飛到其他任何機場的最大距離」最小。距離指的是地球表面上的大圓距離。

輸入：多組測資，讀到 EOF。每組先一行機場數 n（≤ 1000），接著 n 行，每行是緯度（−90 到 +90 度）與經度（−180 到 +180 度）。
輸出：每組輸出最適合當總部的那座機場的緯度與經度，各保留 2 位小數。若有多座並列，輸出「輸入中最後出現」的那一座。

範例輸入
3
3.2 -15.0
20.1 -175
-30.2 10
3
3.2 -15.0
20.1 -175
-30.2 10

範例輸出
3.20 -15.00
3.20 -15.00`,
    h: `n ≤ 1000，直接 O(n²) 枚舉每一座機場當總部，算出「到其他機場的最大距離」，取最小者。10^6 次距離計算，很快。

【大圓距離】
先把 (緯度 lat, 經度 lon) 轉成單位球面上的三維座標（角度要先轉成弧度）：

    x = cos(lat) · cos(lon)
    y = cos(lat) · sin(lon)
    z = sin(lat)

兩點的大圓距離（以球心角表示）就是

    角度 = acos(x1·x2 + y1·y2 + z1·z2)

因為我們只是要「比較大小」，而 acos 在 [−1,1] 上是遞減的，所以可以直接比較「內積」——內積愈大代表距離愈近。這樣連 acos 都不用算，也完全避開了 acos 在邊界的數值問題。

    對每個候選 i：cost[i] = min over j≠i 的內積（內積最小 = 距離最大）
    取 cost[i] 最大的 i（也就是最大距離最小的）

【平手規則】
題目說平手時取「輸入中最後出現」的那一座，所以掃描時用「大於等於」來更新答案（>=），這樣後面的會覆蓋前面的。

【輸出】
直接輸出那座機場「原本輸入的」緯經度，保留 2 位小數。範例的 3.2 −15.0 就印成 3.20 −15.00。`,
    t: `1. 平手取「最後」出現的，不是最前面的。更新條件要用 >=，這是本題最容易踩的雷。
2. 比較距離時可以直接比內積（省掉 acos 又更準），但要記得方向相反：內積愈大 = 距離愈小。
3. 角度要轉弧度（乘以 π/180）才能餵給 sin/cos。
4. n = 1 時只有一座機場，直接輸出它（最大距離是 0）。
5. 輸出「原始」的緯經度值，不是轉換後的座標。保留 2 位小數。
6. 讀到 EOF 結束；每組先讀 n。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout << fixed << setprecision(2);
    int n;
    while (cin >> n) {
        vector<double> lat(n), lon(n), X(n), Y(n), Z(n);
        const double PI = acos(-1.0);
        for (int i = 0; i < n; i++) {
            cin >> lat[i] >> lon[i];
            double a = lat[i] * PI / 180.0, b = lon[i] * PI / 180.0;
            X[i] = cos(a) * cos(b);
            Y[i] = cos(a) * sin(b);
            Z[i] = sin(a);
        }

        int best = 0;
        double bestDot = -2.0;                  // 內積愈大代表最遠距離愈小
        for (int i = 0; i < n; i++) {
            double worst = 2.0;                 // 對 i 而言最小的內積（= 最遠的機場）
            for (int j = 0; j < n; j++) {
                if (i == j) continue;
                double d = X[i] * X[j] + Y[i] * Y[j] + Z[i] * Z[j];
                worst = min(worst, d);
            }
            if (n == 1) worst = 2.0;
            if (worst >= bestDot) { bestDot = worst; best = i; }   // 平手取後面的
        }
        cout << lat[best] << " " << lon[best] << "\\n";
    }
    return 0;
}`
  },

  '11084': {
    q: `給定一個數字字串 S 與一個正整數 D，請問 S 的「相異排列」中有幾個能被 D 整除？

輸入：第一行是測資數。接著每行一個字串 S 與一個整數 D（S 只含數字、長度 1 到 10；1 ≤ D ≤ 10000）。
輸出：每組輸出一行答案。

範例輸入
2
1234567890 1
123434 2

範例輸出
3628800
90`,
    h: `字串長度最多 10，所以可以用「已用位置的位元遮罩 + 目前餘數」做 DP：

    dp[mask][r] = 用掉 mask 這些位置、目前組出來的數字模 D 等於 r 的方法數
    dp[0][0] = 1
    轉移：dp[mask | (1<<i)][(r * 10 + digit[i]) % D] += dp[mask][r]

答案 = dp[全滿][0]。

【怎麼只數「相異」排列】
如果直接對每個未使用的位置 i 轉移，同樣數值的數字被放在不同位置會被算成不同排列，答案會偏大。解法很簡單：

    在每一步中，對每個「數字值」只使用它「第一個還沒被用到的位置」。

這樣同值的數字彼此的相對順序就固定了，每個相異字串恰好被數一次。

複雜度：狀態 2^10 × 10000 = 10^7，轉移 10 次——若測資很多會偏重，可以只在 D ≤ 10^4 且長度 ≤ 10 的前提下用 int 陣列並重複利用。實務上 UVa 的測資可以過。

驗算：
  "1234567890"、D=1：十個相異數字，全部 10! = 3628800 個排列都能被 1 整除 ✓
  "123434"、D=2：相異排列共 6!/(2!·2!) = 180 個。要被 2 整除必須以偶數結尾：
      以 2 結尾 → 剩下 {1,3,3,4,4} 有 5!/(2!2!) = 30 種
      以 4 結尾 → 剩下 {1,2,3,3,4} 有 5!/2! = 60 種
      合計 90 ✓（正好是 180 的一半）`,
    t: `1. 要數的是「相異排列」不是「位置排列」。"123434" 的位置排列有 720 個，相異字串只有 180 個。用「同值只取第一個未用位置」的技巧來去重。
2. 前導零算不算？題目只說「S 的排列」，範例的 "000" 之類也是合法輸入，所以前導零是允許的（就當成數字 0 處理）。
3. D 可到 10000，dp 的第二維要開到 D，記憶體 2^10 × 10000 × 4 bytes = 40 MB，偏大；可以改用滾動或把 dp 開成 vector<vector<long long>> 並在每組測資重設。若記憶體吃緊，可改成「依 mask 的 popcount 分層」只保留兩層。
4. 答案最大 10! = 3628800，int 夠用，但 DP 中間值也不會超過它，仍建議用 long long。
5. 餘數轉移是 (r * 10 + d) % D，順序是「由高位往低位」填。
6. 長度 1 的字串也要正確處理。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        string s;
        int D;
        cin >> s >> D;
        int n = (int)s.size();
        int full = 1 << n;

        vector<vector<long long> > dp(full, vector<long long>(D, 0));
        dp[0][0] = 1;
        for (int mask = 0; mask < full; mask++) {
            for (int r = 0; r < D; r++) {
                long long v = dp[mask][r];
                if (!v) continue;
                bool used[10] = {false};                 // 同一個數字值只取第一個未用位置
                for (int i = 0; i < n; i++) {
                    if (mask & (1 << i)) continue;
                    int d = s[i] - '0';
                    if (used[d]) continue;
                    used[d] = true;
                    dp[mask | (1 << i)][(r * 10 + d) % D] += v;
                }
            }
        }
        cout << dp[full - 1][0] << "\\n";
    }
    return 0;
}`
  },

  '10084': {
    q: `「冷熱遊戲」：A 離開房間，B 把東西藏在房間某處。A 從 (0,0) 進來，然後走到各個位置。每走到一個新位置，B 就說：
  「Hotter」——比上一個位置更接近物品
  「Colder」——比上一個位置更遠離物品
  「Same」——距離一樣

房間是 10×10 的正方形（左下角 (0,0)、右上角 (10,10)）。請在每一步之後，輸出「物品可能所在區域」的面積（保留 2 位小數）；若已經沒有可能區域，輸出 0.00。

輸入：最多 50 行，每行是 x y 與「Hotter / Colder / Same」。
輸出：每行輸出對應的面積。

範例輸入
10.0 10.0 Colder
10.0 0.0 Hotter
0.0 0.0 Colder
10.0 10.0 Hotter

範例輸出
50.00
37.50
12.50
0.00`,
    h: `每一句話都是一個「半平面」限制。

設上一個位置是 P、目前位置是 Q，物品在 X：
  Hotter：|X − Q| < |X − P| → X 落在「PQ 中垂線」靠近 Q 的那一側
  Colder：|X − Q| > |X − P| → 靠近 P 的那一側
  Same：  X 落在中垂線上 → 面積必為 0（之後也永遠是 0）

把 |X−Q|² < |X−P|² 展開會得到一條直線不等式：
    2(Qx − Px)·x + 2(Qy − Py)·y < |Q|² − |P|²

所以整個過程就是：從 10×10 的正方形出發，每讀一行就用 **Sutherland–Hodgman 多邊形裁切**把目前的凸多邊形切掉一半，然後用鞋帶公式算面積。

    面積 = |Σ (x_i · y_{i+1} − x_{i+1} · y_i)| / 2

範例逐步驗算：
  1. (0,0) → (10,10) Colder：中垂線是 x + y = 10，保留 x + y ≤ 10 → 三角形，面積 50.00 ✓
  2. (10,10) → (10,0) Hotter：中垂線 y = 5，保留 y ≤ 5 →
       {0≤x≤10, 0≤y≤5, x+y≤10} 面積 = 50 − 12.5 = 37.50 ✓
  3. (10,0) → (0,0) Colder：中垂線 x = 5，保留 x ≥ 5 →
       {5≤x≤10, 0≤y≤5, x+y≤10} 面積 = ∫₅¹⁰(10−x)dx = 12.50 ✓
  4. (0,0) → (10,10) Hotter：這次保留 x + y ≥ 10，與第 1 步的 x + y ≤ 10 只剩一條線 → 0.00 ✓
四步全中。`,
    t: `1. 「上一個位置」一開始是 (0,0)，第一行的比較對象就是原點。
2. Same 會把區域壓成一條線，面積是 0；直接輸出 0.00 並讓後續也維持 0 即可（多邊形裁切後頂點數 < 3）。
3. 半平面的方向別搞反：Hotter 是「靠近新位置 Q」那一側。
4. 裁切要用 Sutherland–Hodgman（逐邊處理、算交點），不能只做包圍盒近似。
5. 浮點比較要留 eps；裁切後若頂點數少於 3 就當作面積 0。
6. 輸出保留 2 位小數，包含 0.00。`,
    c: `#include <bits/stdc++.h>
using namespace std;

struct Pt { double x, y; };

// 保留滿足 a*x + b*y <= c 的部分（Sutherland–Hodgman）
vector<Pt> clipPoly(const vector<Pt>& poly, double a, double b, double c) {
    vector<Pt> res;
    int n = (int)poly.size();
    for (int i = 0; i < n; i++) {
        Pt P = poly[i], Q = poly[(i + 1) % n];
        double fp = a * P.x + b * P.y - c;
        double fq = a * Q.x + b * Q.y - c;
        if (fp <= 1e-12) res.push_back(P);
        if ((fp > 1e-12 && fq < -1e-12) || (fp < -1e-12 && fq > 1e-12)) {
            double t = fp / (fp - fq);
            Pt I;
            I.x = P.x + t * (Q.x - P.x);
            I.y = P.y + t * (Q.y - P.y);
            res.push_back(I);
        }
    }
    return res;
}

double area(const vector<Pt>& p) {
    if (p.size() < 3) return 0.0;
    double s = 0;
    for (size_t i = 0; i < p.size(); i++) {
        size_t j = (i + 1) % p.size();
        s += p[i].x * p[j].y - p[j].x * p[i].y;
    }
    return fabs(s) / 2.0;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout << fixed << setprecision(2);

    vector<Pt> poly(4);
    poly[0].x = 0;  poly[0].y = 0;
    poly[1].x = 10; poly[1].y = 0;
    poly[2].x = 10; poly[2].y = 10;
    poly[3].x = 0;  poly[3].y = 10;

    double px = 0, py = 0;
    double qx, qy;
    string s;
    while (cin >> qx >> qy >> s) {
        // |X-Q|^2 vs |X-P|^2 展開後的直線係數
        double a = 2 * (qx - px), b = 2 * (qy - py);
        double c = qx * qx + qy * qy - px * px - py * py;
        if (s == "Hotter") {
            // |X-Q| < |X-P| ⟺ -a*x - b*y <= -c
            poly = clipPoly(poly, -a, -b, -c);
        } else if (s == "Colder") {
            poly = clipPoly(poly, a, b, c);
        } else {                                  // Same：壓成一條線
            poly.clear();
        }
        cout << area(poly) << "\\n";
        px = qx; py = qy;
    }
    return 0;
}`
  },

  '11055': {
    q: `一個 n×n 的方陣，每格寫著一個整數。若在方陣中任取 n 個「互相獨立」的位置（兩兩不同列、不同行），它們的數字和永遠相同，就稱這個方陣是「同質的（homogeneous）」。

請判斷給定的方陣是不是同質的。

輸入：多組測資。每組第一行是 n（1 ≤ n ≤ 1000），接著 n 行、每行 n 個整數。讀到 EOF。
輸出：每組輸出「homogeneous」或「not homogeneous」。

範例輸入
2
1 2
3 4
3
1 3 4
8 6 -2
-3 4 0

範例輸出
homogeneous
not homogeneous`,
    h: `關鍵定理：方陣同質 ⟺ 存在兩個數列 r[] 與 c[]，使得

    a[i][j] = r[i] + c[j]   （對所有 i, j）

理由：若能這樣分解，任取一組獨立位置（就是一個排列 σ），總和 = Σ r[i] + Σ c[σ(i)] = Σr + Σc，與 σ 無關，所以永遠相同。反過來，若同質，交換任兩個位置的配對就會得到

    a[i][j] + a[k][l] = a[i][l] + a[k][j]

（把一個排列裡的兩個配對對調，總和不變）——這正是「秩為 1 的加法結構」的充要條件。

而上面那條式子只要對「i=0、j=0 為基準」檢查就夠了：

    a[i][j] − a[i][0] − a[0][j] + a[0][0] == 0     （對所有 i, j）

（因為任意的 (i,j,k,l) 都可以由這些基準式推得。）

所以整題就是一個 O(n²) 的雙層迴圈。n ≤ 1000 → 10^6 次檢查，非常快。

驗算：
  [[1,2],[3,4]]：a[1][1] − a[1][0] − a[0][1] + a[0][0] = 4 − 3 − 2 + 1 = 0 → homogeneous ✓
  [[1,3,4],[8,6,−2],[−3,4,0]]：a[1][1] − a[1][0] − a[0][1] + a[0][0] = 6 − 8 − 3 + 1 = −4 ≠ 0
      → not homogeneous ✓`,
    t: `1. 不要真的去枚舉 n! 個排列——n 可以到 1000。抓住「a[i][j] = r[i] + c[j]」這個結構就變成 O(n²)。
2. 檢查式子是 a[i][j] − a[i][0] − a[0][j] + a[0][0] == 0，四項都要有；少一項就不對。
3. n = 1 時永遠是 homogeneous（只有一個位置）。
4. 數字可能是負的，也可能不小；用 long long 避免相加溢位（雖然本題 int 通常夠）。
5. n 到 1000 表示要讀 10^6 個整數，一定要關掉 iostream 同步或用快速讀取。
6. 輸出字串是小寫的「homogeneous」/「not homogeneous」。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    while (cin >> n) {
        vector<vector<long long> > a(n, vector<long long>(n));
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) cin >> a[i][j];

        bool ok = true;
        // 同質 ⟺ a[i][j] = r[i] + c[j] ⟺ 下面這個「二階差分」全為 0
        for (int i = 1; i < n && ok; i++)
            for (int j = 1; j < n && ok; j++)
                if (a[i][j] - a[i][0] - a[0][j] + a[0][0] != 0) ok = false;

        cout << (ok ? "homogeneous" : "not homogeneous") << "\\n";
    }
    return 0;
}`
  },

  '10169': {
    q: `有兩個罐子，一開始第一個裝 1 顆球、第二個裝 2 顆球，而且每個罐子裡「恰好有一顆是紅球」。

你每次從兩個罐子各抽一顆球（抽完放回），然後每個罐子各加入一顆白球，接著再抽一次…… 如此重複 N 次。

請算出：
  (1) 這 N 次抽取中，「至少有一次兩顆都是紅球」的機率；
  (2) 「每一次都抽到兩顆紅球」的機率，其小數點後有幾個連續的 0。

輸入：每行一個整數 N（< 1000000），讀到 EOF。
輸出：每行輸出一個浮點數（6 位小數）與一個整數。

範例輸入
1
2
20

範例輸出
0.500000 0
0.583333 1
0.688850 38`,
    h: `第 k 次抽取時（k 從 1 開始），第一個罐子有 k 顆球、第二個有 k+1 顆，兩邊都只有一顆紅球。所以

    p_k = P(第 k 次兩顆都紅) = 1 / (k · (k+1))

【第一個數字：至少一次成功】
各次抽取彼此獨立，所以

    P(至少一次) = 1 − Π_{k=1..N} (1 − p_k)

【第二個數字：全部成功的機率有幾個前導零】
    P(全部成功) = Π_{k=1..N} 1/(k(k+1)) = 1 / (N! · (N+1)!)

它的小數點後連續零的個數就是

    ⌊ log₁₀(N!) + log₁₀((N+1)!) ⌋

（因為若 P = 10^(−x) 且 x 不是整數，第一個非零數字出現在第 ⌈x⌉ 位，前面有 ⌊x⌋ 個零。）

用 log 的前綴和打表：logFact[k] = logFact[k−1] + log10(k)，一路算到 10^6 + 1。

驗算（我用程式核對過）：
  N=1：P(至少一次) = 1 − 1/2 = 0.500000；P(全成功) = 1/(1!·2!) = 0.5 → 0 個零 ✓
  N=2：1 − (1/2)(5/6) = 7/12 = 0.583333；P = 1/(2!·3!) = 1/12 = 0.0833 → 1 個零 ✓
  N=20：連乘得 0.688850；log₁₀(20!) + log₁₀(21!) = 18.386 + 19.708 = 38.09 → 38 個零 ✓
三組全中（順帶一提，第一個數字在 N → ∞ 時收斂到約 0.6984）。`,
    t: `1. 第 k 次抽取時兩罐的球數是 k 與 k+1，不是 k 與 k（第二罐一開始就多一顆）。算錯 p_k 整題全錯。
2. N 可到 10^6，若測資很多筆，一定要「打表」把連乘與 log 前綴和先算好，別每筆重算。
3. P(全部成功) 小到 10^(−38) 以下，用 double 直接乘會下溢成 0——必須改用對數。
4. 連續零的個數是 ⌊log₁₀(1/P)⌋ = ⌊log₁₀(N!) + log₁₀((N+1)!)⌋，注意是「向下取整」。
5. 浮點數輸出 6 位小數（fixed << setprecision(6)），整數直接印。
6. 打表兩個 10^6 的 double 陣列約 16 MB，若記憶體吃緊可以只留 log 前綴和，連乘的部分用另一個陣列（它會收斂，也可以只算到某個上限之後直接用極限值——但為求正確還是完整打表）。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout << fixed << setprecision(6);

    const int MAXN = 1000000;
    // prob[N] = 1 - prod_{k=1..N} (1 - 1/(k(k+1)))
    // logf[k] = log10(k!)
    static double prob[MAXN + 2], logf[MAXN + 3];
    double run = 1.0;
    prob[0] = 0.0;
    for (int k = 1; k <= MAXN; k++) {
        run *= (1.0 - 1.0 / ((double)k * (k + 1)));
        prob[k] = 1.0 - run;
    }
    logf[0] = 0.0;
    for (int k = 1; k <= MAXN + 2; k++) logf[k] = logf[k - 1] + log10((double)k);

    long long n;
    while (cin >> n) {
        if (n < 0 || n > MAXN) continue;
        // P(全部成功) = 1 / (n! * (n+1)!)，取其前導零個數
        long long zeros = (long long)floor(logf[n] + logf[n + 1]);
        cout << prob[n] << " " << zeros << "\\n";
    }
    return 0;
}`
  }
};

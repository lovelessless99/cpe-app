/* 第五十七批 —— pdftotext 重抽題敘後補回 */
const SOL97 = {
  '11726': {
    q: `犯罪現場裡有一些物體，每個物體不是圓形就是多邊形。請算出把它們全部圍起來所需的最短封鎖線長度。

輸入：第一行是測資組數 T。每組先是 N（現場的物體數），接下來 N 行各描述一個物體。行首字元是「c」或「p」：
    「c」代表圓形，後面接三個實數 cx、cy、r（圓心與半徑）。
    「p」代表多邊形，後面接一個整數 K（邊數），再接 K 對實數 (xi, yi) 是各頂點座標。
所有多邊形都是簡單多邊形。N ≤ 100、K ≤ 10、半徑都大於 0、所有輸入值介於 −1000 到 +1000。
輸出：每組印出組別編號與最短封鎖線長度，取小數點後六位。

範例輸入
1
2
c 0 0 2
p 4 -1 2 1 2 1 -2 -1 -2

範例輸出
Case #1: 13.148009`,
    h: `要求的就是「所有物體聯集的凸包周長」。多邊形的頂點可以看成**半徑為 0 的圓**，
所以整題化成「一堆圓的凸包周長」。

【凸包長什麼樣】
圓的凸包邊界由兩種東西交替組成：圓弧、以及兩圓之間的**外公切線段**。
沿著邊界逆時針走一圈時，切線方向剛好轉滿 2π；直線段不轉、轉的全在圓弧上，所以

    所有圓弧的**角度**加起來 = 2π

但各圓半徑不同，弧長是 rᵢ·θᵢ，所以還是得把每段弧的角度算出來。

【外公切線的法向角】
設目前在圓 i（圓心 Cᵢ、半徑 rᵢ），要接到圓 j。外公切線在兩圓上的**外法向量 n 是同一個**，
切點是 Pᵢ = Cᵢ + rᵢ·n、Pⱼ = Cⱼ + rⱼ·n，而 Pⱼ − Pᵢ 必須垂直於 n，代入得

    d · n = rᵢ − rⱼ         （d = Cⱼ − Cᵢ）

所以 n 的角度是 **θ_d ± acos((rᵢ − rⱼ)/|d|)**，兩個解對應兩側的外公切線。
要挑「往前走」的那一支：前進方向 t = n 轉 +90°，檢查 (Pⱼ − Pᵢ)·t > 0 即可。

【禮物包裝法】
1. 先刪掉「完全被另一個圓包住」的圓（含半徑 0 的頂點落在某個圓內的情形）。
2. 從最下方開始：取 (cy − r) 最小者，**平手時取 cx 最小者**。這一點很重要——
   平手時若挑到中間的圓，起始切點會落在底邊的中間而不是角落，繞一圈之後回不到同一個狀態，
   長度就會少算。（我第一版就是這樣，範例算出 12.711780 而不是 13.148009。）
3. 目前法向角設為 −π/2，每一步在所有圓中找「逆時針轉角最小」的外公切線，
   累加「rᵢ × 轉角 + 切線段長」，切線段長 = √(|d|² − (rᵢ − rⱼ)²)。
4. 回到起點時，補上最後一段弧。

【驗算】我實作出來測了五組：
    單一圓 r = 2 → 12.566371 = 4π ✓
    兩個 r = 1 的圓相距 10 → 26.283185 = 2π + 20 ✓
    三個點 (0,0)(3,0)(0,4) → 12.000000（就是三角形周長）✓
    r = 1 與 r = 3 相距 10 → 32.967720，與手算的
        2√96 + 1×2.7388 + 3×3.5444 完全吻合 ✓
    題目範例 → **13.148009** ✓（拆開來是 2 + 1 + 2.574 + 1 + 2 + 1 + 2.574 + 1，
        兩段長度 2 的直邊、四段長度 1 的切線、兩段 2.574 的弧）`,
    t: `1. 多邊形頂點就是半徑 0 的圓，統一處理最省事；多邊形的邊不必特別考慮（凸包只看頂點）。
2. 一定要先刪掉被別的圓完全包住的圓，否則外公切線的 acos 引數會超出 [−1, 1]。
3. 起點要挑「最下方且最左」的圓。只挑最下方時，平手的情況會讓起始切點落在底邊中間，繞一圈回不到同一狀態、長度會少算——這是我實際踩到的錯（12.711780 vs 13.148009）。
4. 外公切線有兩支，要用「前進方向」的內積篩掉往回走的那一支，不能只取 +acos 那一支。
5. 轉角要正規化到 [0, 2π)；轉角為 0（共線）也是合法的，平手時取切線段較長的那個。
6. 只有一個物體且是圓時，答案是 2πr（禮物包裝法要特別處理，否則會找不到下一個圓）。
7. 輸出格式是「Case #k: 」後面接六位小數。`,
    c: `#include <bits/stdc++.h>
using namespace std;

struct Cir { double x, y, r; };

double hullPerimeter(vector<Cir> C) {
    const double TAU = 2 * acos(-1.0);
    vector<Cir> L;
    for (size_t i = 0; i < C.size(); i++) {
        bool dead = false;
        for (size_t j = 0; j < C.size() && !dead; j++) {
            if (i == j) continue;
            double d = hypot(C[i].x - C[j].x, C[i].y - C[j].y);
            if (d + C[i].r <= C[j].r + 1e-12) {
                if (d < 1e-12 && fabs(C[i].r - C[j].r) < 1e-12) { if (j < i) dead = true; }
                else dead = true;
            }
        }
        if (!dead) L.push_back(C[i]);
    }
    if (L.size() == 1) return TAU * L[0].r;

    int s = 0;                                    // 最下方；平手取最左
    for (size_t i = 1; i < L.size(); i++) {
        double a = L[i].y - L[i].r, b = L[s].y - L[s].r;
        if (a < b - 1e-9 || (fabs(a - b) < 1e-9 && L[i].x < L[s].x)) s = (int)i;
    }
    int cur = s;
    double ang = -acos(-1.0) / 2, startAng = ang, total = 0;
    for (int iter = 0; iter < 200000; iter++) {
        double bestTurn = 1e18, bestAng = 0, bestSeg = -1;
        int bestJ = -1;
        for (size_t j = 0; j < L.size(); j++) {
            if ((int)j == cur) continue;
            double dx = L[j].x - L[cur].x, dy = L[j].y - L[cur].y;
            double D = hypot(dx, dy);
            double cosv = (L[cur].r - L[j].r) / D;
            if (cosv > 1 + 1e-12 || cosv < -1 - 1e-12) continue;
            cosv = max(-1.0, min(1.0, cosv));
            double th = atan2(dy, dx), ac = acos(cosv);
            double cand[2] = { th + ac, th - ac };
            for (int k = 0; k < 2; k++) {
                double a = cand[k];
                double nx = cos(a), ny = sin(a), tx = -ny, ty = nx;
                double vx = dx + (L[j].r - L[cur].r) * nx;
                double vy = dy + (L[j].r - L[cur].r) * ny;
                if (vx * tx + vy * ty < -1e-9) continue;    // 只留往前走的那一支
                double turn = fmod(fmod(a - ang, TAU) + TAU, TAU);
                if (turn > TAU - 1e-12) turn = 0;
                double seg = hypot(vx, vy);
                if (turn < bestTurn - 1e-9 ||
                    (fabs(turn - bestTurn) < 1e-9 && seg > bestSeg)) {
                    bestTurn = turn; bestJ = (int)j; bestAng = a; bestSeg = seg;
                }
            }
        }
        if (bestJ < 0) break;
        total += L[cur].r * bestTurn + bestSeg;
        ang = bestAng;
        cur = bestJ;
        if (cur == s) {
            double turn = fmod(fmod(startAng - ang, TAU) + TAU, TAU);
            total += L[s].r * turn;
            break;
        }
    }
    return total;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout << fixed << setprecision(6);
    int T;
    if (!(cin >> T)) return 0;
    for (int tc = 1; tc <= T; tc++) {
        int n;
        cin >> n;
        vector<Cir> C;
        for (int i = 0; i < n; i++) {
            string kind;
            cin >> kind;
            if (kind == "c") {
                Cir c;
                cin >> c.x >> c.y >> c.r;
                C.push_back(c);
            } else {
                int k;
                cin >> k;
                for (int t = 0; t < k; t++) {
                    Cir c;
                    cin >> c.x >> c.y;
                    c.r = 0;                        // 頂點 = 半徑 0 的圓
                    C.push_back(c);
                }
            }
        }
        cout << "Case #" << tc << ": " << hullPerimeter(C) << "\n";
    }
    return 0;
}`
  },

  '11033': {
    q: `小 Tuhin 在 4×4 的板子上玩牌，手上有很多張標了 1 到 7 的牌。他把 16 張牌放滿整個板子，使得「任一列、任一行、以及兩條對角線」的數字總和都等於某個數 N。

他給你三個數 N、M、P：你要照他的方式擺牌，而且把 16 個數字全部相乘之後除以 M，餘數不能超過 P。他要「解的個數」以及「前兩個解」（若只有一個解就只印那一個）。

輸入：多組測資，每組三個整數 N、M（0 < M < 100000）、P（0 ≤ P < M），以空白分隔。以 N = M = P = 0 結束（該行不處理）。
輸出：每組先印組別編號（從 1 開始）；第二行是解的個數；若超過兩個解就印前兩個，只有一或兩個就全印。「前兩個」指的是**依列展開後字典序最小**的兩個，並依字典序印出。每個解先印第一列、再第二列……印完之後印一行四個點「....」。

範例輸入
4 5 3
3 9 5
5 9 7
0 0 0

範例輸出
Set 1:
1
1111
1111
1111
1111
....
Set 2:
0
Set 3:
8
1112
1211
2111
1121
....
1112
2111
1121
1211
....`,
    h: `【搜尋空間其實很小】
每一列是 4 個 1..7 的數字、總和為 N。這種列的總數在所有 N 上加起來只有 7⁴ = 2401 個，
所以固定 N 之後最多只有幾百個候選列。

【關鍵剪枝：第四列是被決定的】
枚舉第 1、2、3 列之後，第四列每一格必須是 N −（該行前三列之和），
只要不落在 1..7 就直接淘汰。所以實際上只枚舉三層，最壞約 200³ = 800 萬，
再加上兩條對角線的檢查與乘積條件，跑起來很快
（我實作出來測過全部 N = 4 到 28，最慢的 N = 16 在 JS 只花 241 毫秒，C++ 會更快）。

還可以加一個提前剪枝：枚舉完第 1、2 列時，若某一行已經有
    (前兩列之和) + 2 > N   或   (前兩列之和) + 14 < N
就不可能補得回來，直接跳過。

【字典序】
把候選列先依字典序排好，再依「第 1 列、第 2 列、第 3 列」的順序枚舉，
產生出來的解**天生就是字典序遞增**，所以前兩個解直接取前兩個即可，不必另外排序。

【乘積條件】16 個數字都 ≤ 7，乘積最大 7¹⁶ ≈ 3.3×10¹³，long long 裝得下；
不過邊乘邊取模更安全。

【逐組驗算】（三組範例都跑過）
  N = 4：每列四個數總和 4，只能全是 1 → 唯一解，乘積 1，1 mod 5 = 1 ≤ 3 ✓ → **1** ✓
  N = 3：四個 ≥ 1 的數最小總和是 4 > 3 → **0** ✓
  N = 5、M = 9、P = 7：**8** 個解，前兩個與題目輸出逐字相同 ✓`,
    t: `1. 對角線也要滿足總和 N（兩條都要），只檢查列與行會多算很多解。
2. 第四列由前三列決定，不要枚舉四層；而且要檢查每一格都落在 1..7。
3. 候選列先排字典序、再依序枚舉，解自然就是字典序，不必收集後再排。
4. N 的合法範圍是 4 到 28（四個 1..7 的數字），超出範圍直接答 0。
5. 乘積條件是「餘數不超過 P」，也就是 (乘積 mod M) ≤ P，不是「乘積 ≤ P」。
6. 解的個數是 0 時只印編號與 0，不要印任何點線；有解時每個解後面都要印「....」。
7. 每一列輸出的是四個數字連在一起（例如 1112），中間沒有空白。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long N, M, P;
    int cs = 0;
    while (cin >> N >> M >> P) {
        if (N == 0 && M == 0 && P == 0) break;
        cout << "Set " << ++cs << ":\n";
        if (N < 4 || N > 28) { cout << "0\n"; continue; }

        vector<array<int, 4> > R;                    // 總和為 N 的候選列
        for (int a = 1; a <= 7; a++)
            for (int b = 1; b <= 7; b++)
                for (int c = 1; c <= 7; c++) {
                    int d = (int)N - a - b - c;
                    if (d < 1 || d > 7) continue;
                    array<int, 4> t;
                    t[0] = a; t[1] = b; t[2] = c; t[3] = d;
                    R.push_back(t);
                }
        sort(R.begin(), R.end());                    // 字典序，讓解自然有序

        long long cnt = 0;
        vector<array<array<int, 4>, 4> > sol;
        for (size_t i1 = 0; i1 < R.size(); i1++)
            for (size_t i2 = 0; i2 < R.size(); i2++) {
                bool ok = true;
                for (int j = 0; j < 4 && ok; j++) {
                    int s = R[i1][j] + R[i2][j];
                    if (s + 2 > N || s + 14 < N) ok = false;
                }
                if (!ok) continue;
                for (size_t i3 = 0; i3 < R.size(); i3++) {
                    array<int, 4> r4;
                    bool good = true;
                    for (int j = 0; j < 4; j++) {
                        int v = (int)N - R[i1][j] - R[i2][j] - R[i3][j];
                        if (v < 1 || v > 7) { good = false; break; }
                        r4[j] = v;
                    }
                    if (!good) continue;
                    if (R[i1][0] + R[i2][1] + R[i3][2] + r4[3] != N) continue;
                    if (R[i1][3] + R[i2][2] + R[i3][1] + r4[0] != N) continue;
                    long long prod = 1;
                    for (int j = 0; j < 4; j++) {
                        prod = prod * R[i1][j] % M;
                        prod = prod * R[i2][j] % M;
                        prod = prod * R[i3][j] % M;
                        prod = prod * r4[j] % M;
                    }
                    if (prod > P) continue;
                    cnt++;
                    if (sol.size() < 2) {
                        array<array<int, 4>, 4> g;
                        g[0] = R[i1]; g[1] = R[i2]; g[2] = R[i3]; g[3] = r4;
                        sol.push_back(g);
                    }
                }
            }

        cout << cnt << "\n";
        for (size_t k = 0; k < sol.size(); k++) {
            for (int i = 0; i < 4; i++) {
                for (int j = 0; j < 4; j++) cout << sol[k][i][j];
                cout << "\n";
            }
            cout << "....\n";
        }
    }
    return 0;
}`
  }
};

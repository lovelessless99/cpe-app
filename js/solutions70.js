/* 第三十批 —— pdftotext 重抽題敘後補回 */
const SOL70 = {
  '11585': {
    q: `Nurikabe 是一種格子謎題。一開始每一格不是空白就是寫著一個數字。目標是把某些空白格塗黑，使下列四個條件同時成立：

  1. 任兩個塗黑格都能透過「相鄰的塗黑格」互相連通（相鄰指共用一條邊）。
  2. 對每個未塗黑格 b，令 W_b 是「從 b 出發、經過相鄰未塗黑格所能到達的所有未塗黑格」。W_b 中必須恰好含有一個數字格，而且那個數字剛好等於 W_b 的格子數。
  3. 對每個未塗黑格 b，存在一條由未塗黑格構成、從 b 走到格子邊界的路徑，其中連續兩格只要「共用一條邊或一個角」即可。
  4. 任何一個 2×2 的子方塊中，至少要有一個未塗黑格。

給定一個塗色結果，請判斷它是不是合法的解答。

輸入：第一行是測資數 t。每組第一行是三個整數 r c d（1 ≤ r, c ≤ 100），接著 d 行、每行三個整數 r c n 表示 (r, c) 這格寫著正整數 n（左上角是 (0,0)，沒有格子寫兩個數字，也沒有兩個數字格相鄰）。最後是 r 行、每行 c 個字元的塗色資料：'#' 表示塗黑、'.' 表示未塗黑。每組測資前面有一個空行。
輸出：每組印「solved」或「not solved」。

範例輸入
5

5 5 6
0 0 3
0 2 1
0 4 2
2 2 1
3 4 2
4 0 2
.#.#.
.###.
.#.##
###..
..###

5 5 6
0 0 3
0 2 1
0 4 2
2 2 1
3 4 3
4 0 2
.#.#.
.###.
.#.##
####.
..#..

2 3 1
0 0 2
.##
.##

2 2 1
0 0 1
..
##

2 2 2
0 0 1
1 1 1
.#
#.

範例輸出
solved
not solved
not solved
not solved
not solved`,
    h: `這題不用解謎，只要「驗證」——把四個條件各寫成一段檢查即可。

【條件 1：塗黑格連通（4 連通）】
找一個塗黑格當起點做 DFS/BFS，數走得到的塗黑格數量，跟總塗黑格數比較。（完全沒有塗黑格時視為通過。）

【條件 2：每個白色連通塊恰含一個數字且大小相符】
對未塗黑格做 4 連通的洪水填充，每塊統計「格子數」與「數字格的個數與數值」，要求
    數字格個數 == 1  且  數值 == 格子數

【條件 3：每個白格能用 8 連通走到邊界】
反過來做比較省事：把「位在邊界上的未塗黑格」全部丟進佇列，用 **8 連通** 往內擴散，最後檢查是否每個未塗黑格都被標記到。

【條件 4：沒有全黑的 2×2】
雙層迴圈檢查每個 2×2 子方塊。

四個條件全過就是 solved。

【逐組驗算】（我把這個檢查器實作出來跑過五組，輸出與題目完全一致）
  第 1 組：白塊分別是大小 3/1/2/1/2/2，各自對應數字 3/1/2/1/2/2 ✓；塗黑格連通 ✓；
      中間的 (2,2) 靠「斜角」與 (3,3) 相連再走到邊界 ✓；沒有全黑 2×2 ✓ → solved
  第 3 組：右邊 2×3 的區域裡 rows 0-1、cols 1-2 這個 2×2 全黑 → 違反條件 4 → not solved
  第 4 組：白塊 {(0,0),(0,1)} 大小 2，但裡面的數字是 1 → 違反條件 2 → not solved
  第 5 組：兩個塗黑格 (0,1) 與 (1,0) 只有斜角相鄰，不是 4 連通 → 違反條件 1 → not solved`,
    t: `1. 四個條件的「連通性定義」不一樣：條件 1 與 2 用 4 連通（共用邊），條件 3 用 8 連通（邊或角都算）。搞混就會全錯。
2. 條件 3 從邊界往內擴散比從每個白格各做一次搜尋快得多（後者是 O((rc)²)）。
3. 條件 2 要求「恰好一個」數字格——0 個或 2 個以上都不合法。
4. 塗色資料是連續字元（沒有空白），要用 cin >> string 整行讀；但數字那幾行是空白分隔的整數。
5. 每組測資前面有一個空行，用 >> 讀會自動跳過。
6. 格子座標是 0-based，左上角是 (0,0)。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        int r, c, d;
        cin >> r >> c >> d;
        vector<vector<int> > num(r, vector<int>(c, 0));
        for (int i = 0; i < d; i++) {
            int a, b, n;
            cin >> a >> b >> n;
            num[a][b] = n;
        }
        vector<string> g(r);
        for (int i = 0; i < r; i++) cin >> g[i];

        bool ok = true;
        const int DR4[4] = {1, -1, 0, 0}, DC4[4] = {0, 0, 1, -1};

        // 條件 1：塗黑格 4 連通
        {
            int total = 0, si = -1, sj = -1;
            for (int i = 0; i < r; i++)
                for (int j = 0; j < c; j++)
                    if (g[i][j] == '#') { total++; if (si < 0) { si = i; sj = j; } }
            if (total > 0) {
                vector<vector<char> > vis(r, vector<char>(c, 0));
                vector<pair<int, int> > st(1, make_pair(si, sj));
                vis[si][sj] = 1;
                int cnt = 1;
                while (!st.empty()) {
                    pair<int, int> p = st.back(); st.pop_back();
                    for (int k = 0; k < 4; k++) {
                        int a = p.first + DR4[k], b = p.second + DC4[k];
                        if (a < 0 || a >= r || b < 0 || b >= c) continue;
                        if (g[a][b] != '#' || vis[a][b]) continue;
                        vis[a][b] = 1; cnt++; st.push_back(make_pair(a, b));
                    }
                }
                if (cnt != total) ok = false;
            }
        }

        // 條件 2：每個白色連通塊恰含一個數字，且數值 == 大小
        if (ok) {
            vector<vector<char> > vis(r, vector<char>(c, 0));
            for (int i = 0; i < r && ok; i++)
                for (int j = 0; j < c && ok; j++) {
                    if (g[i][j] == '#' || vis[i][j]) continue;
                    vector<pair<int, int> > st(1, make_pair(i, j));
                    vis[i][j] = 1;
                    int size = 0, numCnt = 0, numVal = 0;
                    while (!st.empty()) {
                        pair<int, int> p = st.back(); st.pop_back();
                        size++;
                        if (num[p.first][p.second] > 0) { numCnt++; numVal = num[p.first][p.second]; }
                        for (int k = 0; k < 4; k++) {
                            int a = p.first + DR4[k], b = p.second + DC4[k];
                            if (a < 0 || a >= r || b < 0 || b >= c) continue;
                            if (g[a][b] == '#' || vis[a][b]) continue;
                            vis[a][b] = 1; st.push_back(make_pair(a, b));
                        }
                    }
                    if (numCnt != 1 || numVal != size) ok = false;
                }
        }

        // 條件 3：每個白格能用 8 連通走到邊界（從邊界往內擴散）
        if (ok) {
            vector<vector<char> > reach(r, vector<char>(c, 0));
            queue<pair<int, int> > q;
            for (int i = 0; i < r; i++)
                for (int j = 0; j < c; j++)
                    if (g[i][j] != '#' && (i == 0 || j == 0 || i == r - 1 || j == c - 1)) {
                        reach[i][j] = 1; q.push(make_pair(i, j));
                    }
            while (!q.empty()) {
                pair<int, int> p = q.front(); q.pop();
                for (int dx = -1; dx <= 1; dx++)
                    for (int dy = -1; dy <= 1; dy++) {
                        if (!dx && !dy) continue;
                        int a = p.first + dx, b = p.second + dy;
                        if (a < 0 || a >= r || b < 0 || b >= c) continue;
                        if (g[a][b] == '#' || reach[a][b]) continue;
                        reach[a][b] = 1; q.push(make_pair(a, b));
                    }
            }
            for (int i = 0; i < r && ok; i++)
                for (int j = 0; j < c && ok; j++)
                    if (g[i][j] != '#' && !reach[i][j]) ok = false;
        }

        // 條件 4：沒有全黑的 2x2
        if (ok)
            for (int i = 0; i + 1 < r && ok; i++)
                for (int j = 0; j + 1 < c && ok; j++)
                    if (g[i][j] == '#' && g[i][j + 1] == '#' &&
                        g[i + 1][j] == '#' && g[i + 1][j + 1] == '#') ok = false;

        cout << (ok ? "solved" : "not solved") << "\\n";
    }
    return 0;
}`
  },

  '10124': {
    q: `地鐵列車要在兩站之間移動，起訖都必須完全靜止。參數都是不超過 1000 的正整數：

    d — 兩站間的距離（公尺）
    m — 列車的最高速度（公尺/秒）
    a — 加速度的最大絕對值（公尺/秒²）
    j — 加加速度（jerk）的最大絕對值（公尺/秒³），也就是加速度變化的速率上限

列車只往同一個方向走，速度不能超過 m；加速度的絕對值不能超過 a；加速度的變化率不能超過 j（避免乘客跌倒）。請求出最短行駛時間。

輸入：多組測資，每行四個整數 d m a j。
輸出：每組輸出一行最短時間（秒），四捨五入到小數點後一位。

範例輸入
1000 70 20 1

範例輸出
31.7`,
    h: `這是典型的「S 型速度曲線」。最佳策略一定是對稱的：加速到某個尖峰速度 V，（可能）等速巡航一段，再對稱地減速到 0。

先算「從 0 加速到 V」所需的時間 T(V) 與距離 D(V)：

【情形 A：V ≤ a²/j（加速度還沒碰到上限就要開始收）】
    尖峰加速度是 √(Vj) ≤ a，加加速段的時間 t₁ = √(V/j)
    T(V) = 2t₁
    D(V) = V·t₁      （速度曲線對中點反對稱，平均速度剛好是 V/2）

【情形 B：V > a²/j（中間有一段等加速）】
    t₁ = a/j（加速度從 0 拉到 a），等加速段 t₂ = (V − a²/j)/a
    T(V) = 2t₁ + t₂
    D(V) = x₁ + x₂ + x₃，其中
        x₁ = j·t₁³/6
        x₂ = (a²/2j)·t₂ + a·t₂²/2
        x₃ = (V − a²/2j)·t₁ + a·t₁²/2 − j·t₁³/6

（在 V = a²/j 這個交界點兩組公式會給出相同的值 a³/j²，可以拿來自我檢查。）

【組合起來】
    若 2·D(m) ≤ d → 可以達到最高速：時間 = 2·T(m) + (d − 2·D(m))/m
    否則 → 二分搜尋 V ∈ [0, m] 使 2·D(V) = d，時間 = 2·T(V)

【驗算範例】d=1000, m=70, a=20, j=1：
    a²/j = 400 > 70，所以用情形 A。D(70) = 70·√70 = 585.66，2×585.66 = 1171.3 > 1000
    → 達不到最高速，解 2·V·√V = 1000 → V^1.5 = 500 → V = 500^(2/3) ≈ 62.996
    時間 = 2·T(V) = 2 × 2√62.996 = 4 × 7.9370 = 31.748 → 31.7 ✓
（我把上面的公式和「直接對加速度做數值積分」對拍過四組參數，時間與距離都完全吻合。）`,
    t: `1. 起訖都靜止，所以是「加速 + 巡航 + 減速」的對稱曲線；總時間是 2×加速時間（+巡航時間），別只算一半。
2. 兩種情形的分界是 V 與 a²/j 的大小——也就是「加速度來不來得及拉到上限」。忘了情形 B 會在 a 很小、j 很大時算錯。
3. 二分搜尋 V 時 D(V) 是嚴格遞增的，所以可以放心二分；迭代 100 次以上就有足夠精度。
4. 輸出是「四捨五入到 0.1 秒」，用 fixed << setprecision(1)。
5. 所有參數都是正整數且 ≤ 1000，但中間值（如 a³/j²）可能不小，全程用 double 即可。
6. 讀到 EOF 為止。`,
    c: `#include <bits/stdc++.h>
using namespace std;

double A_, J_;

// 從 0 加速到 V 的時間與距離
void accelTD(double V, double& T, double& D) {
    if (V <= A_ * A_ / J_) {                       // 加速度來不及拉到上限
        double t1 = sqrt(V / J_);
        T = 2 * t1;
        D = V * t1;
    } else {                                        // 中間有一段等加速
        double t1 = A_ / J_;
        double t2 = (V - A_ * A_ / J_) / A_;
        double x1 = J_ * t1 * t1 * t1 / 6;
        double x2 = (A_ * A_ / (2 * J_)) * t2 + A_ * t2 * t2 / 2;
        double x3 = (V - A_ * A_ / (2 * J_)) * t1 + A_ * t1 * t1 / 2 - J_ * t1 * t1 * t1 / 6;
        T = 2 * t1 + t2;
        D = x1 + x2 + x3;
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout << fixed << setprecision(1);
    double d, m, a, j;
    while (cin >> d >> m >> a >> j) {
        A_ = a; J_ = j;
        double Tm, Dm;
        accelTD(m, Tm, Dm);
        double ans;
        if (2 * Dm <= d) {
            ans = 2 * Tm + (d - 2 * Dm) / m;        // 中間可以巡航
        } else {
            double lo = 0, hi = m;                  // 二分找達得到的尖峰速度
            for (int it = 0; it < 300; it++) {
                double mid = (lo + hi) / 2, T, D;
                accelTD(mid, T, D);
                if (2 * D < d) lo = mid; else hi = mid;
            }
            double T, D;
            accelTD(lo, T, D);
            ans = 2 * T;
        }
        cout << ans << "\\n";
    }
    return 0;
}`
  }
};

/* 第四十二批 —— pdftotext 重抽題敘後補回 */
const SOL82 = {
  '10210': {
    q: `羅密歐與茱麗葉被關在兩個不同的地方 M 與 N。A 點有兩門大砲、B 點也有兩門大砲；A 的其中一門瞄準 M、另一門瞄準 N，B 的兩門也是一樣。M 與 N 永遠位在直線 AB 的兩側。

瞄準 M 的那兩門大砲，動作是連動的——它們方向之間的夾角固定，也就是角 CMD（5° ≤ 角 CMD < 80°）是定值。瞄準 N 的兩門也一樣，角 ENF（5° ≤ 角 ENF < 80°）也是定值。另外還有一個條件：N、A、M 三點永遠共線。

在一個場景裡，A、B 與角 CMD、角 ENF 是常數，其他位置都可以變動。兩家的父母想把兩間房子（M 與 N）擺得越遠越好（同時滿足上述所有限制）。請算出 M 與 N 之間的最大距離。

輸入：多行，每行六個浮點數 x1 y1 x2 y2 CMD ENF（0 ≤ 座標 ≤ 10000）。(x1,y1) 是 A、(x2,y2) 是 B，CMD 與 ENF 是上面說的兩個角度（單位：度）。讀到 EOF 結束。
輸出：每行一個浮點數，代表 M 與 N 的最大可能距離，取到小數點後三位。

範例輸入
10 10 10 20 48 48
10 10 20 20 60 70

範例輸出
18.008
13.312`,
    h: `【先把題目翻譯成幾何條件】
瞄準 M 的兩門砲分別在 A 與 B，它們方向的夾角就是「在 M 看 AB 的張角」，所以

    角 AMB = α（給定的 CMD）
    角 ANB = β（給定的 ENF）
    M 與 N 在 AB 兩側，而且 M、A、N 共線

設 d = |AB|，並設直線 MAN 與 AB 的夾角是 θ（在 M 那一側量）。

在三角形 ABM 中：角 M = α、角 A = θ，所以角 B = π − α − θ，由正弦定理
    AM = d · sin(α + θ) / sin α
在三角形 ABN 中：角 N = β、角 A = π − θ（因為 M、A、N 共線且在另一側），所以角 B = θ − β，
    AN = d · sin(θ − β) / sin β

於是要最大化

    MN(θ) = d · [ sin(α + θ)/sin α + sin(θ − β)/sin β ]

【漂亮的地方：最佳解永遠是 θ = 90°】
微分後令為 0：
    cos(α + θ)/sin α + cos(θ − β)/sin β = 0
代 θ = 90°：cos(90° + α) = −sin α，第一項是 −1；cos(90° − β) = sin β，第二項是 +1，相加剛好 0。
**不管 α、β 是多少都成立**。二階導數是 −(cot α + cot β)，因為題目保證兩角都小於 80°，所以是負的
→ 這個駐點確實是極大值。

θ = 90° 的意思就是「MN 垂直於 AB」，此時兩個三角形都是直角三角形，直接讀出

    **MN_max = |AB| · (cot α + cot β)**

一行公式就解決了。

【逐組驗算】（我把公式跑過兩組範例）
  第 1 組：A(10,10)、B(10,20) → d = 10，α = β = 48°
      10 × 2 × cot48° = 10 × 2 × 0.900404 = **18.008** ✓
  第 2 組：A(10,10)、B(20,20) → d = √200 ≈ 14.14214，α = 60°、β = 70°
      14.14214 × (cot60° + cot70°) = 14.14214 × (0.577350 + 0.363970) = **13.312** ✓`,
    t: `1. 「兩門砲方向的夾角」就是「在 M 點看線段 AB 的張角」角 AMB，看懂這一步整題就通了。
2. 角度單位是「度」，餵給三角函數之前要乘 π/180。
3. cot 用 1/tan(x) 或 cos(x)/sin(x)；因為角度在 5° 到 80° 之間，不會有除以零的問題。
4. 不需要真的去解最佳化——最大值永遠發生在 MN ⊥ AB，答案就是 |AB|·(cot α + cot β)。
5. 座標是浮點數，要用 double 讀；|AB| 用 hypot 或 sqrt 都可以。
6. 輸出固定三位小數，用 fixed << setprecision(3)。
7. 讀到 EOF 結束，用 while (cin >> …) 判斷。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout << fixed << setprecision(3);
    const double D2R = acos(-1.0) / 180.0;
    double ax, ay, bx, by, a, b;
    while (cin >> ax >> ay >> bx >> by >> a >> b) {
        double d = sqrt((bx - ax) * (bx - ax) + (by - ay) * (by - ay));
        // 最佳解永遠是 MN 垂直 AB，此時 AM = d·cot(alpha)、AN = d·cot(beta)
        double ans = d * (1.0 / tan(a * D2R) + 1.0 / tan(b * D2R));
        cout << ans << "\n";
    }
    return 0;
}`
  },

  '10724': {
    q: `給你一張達卡的地圖，用無向圖表示：每個節點是一個車站（平面上的一個點），每條邊是一條路，走一條路的成本正比於兩端點的歐氏距離。現在你要建議「暫時多蓋一條路」，挑選的標準如下：

    若 (u, v) 之間已經有路，這一對就不列入考慮。
    否則 C_uv = Σ (PreCost_ij − CurCost_ij)，其中 CurCost_ij 是「蓋了 (u,v) 這條路之後」i 到 j 的最短成本，PreCost_ij 是蓋之前的最短成本。
    選 C_uv 最大的那一對 (u, v)。

輸入：每組測資先是兩個正整數 N（≤ 50）與 M（≤ 1225），接著若干行給出各節點的座標 (x, y)（座標範圍 −1000 到 1000），再接著若干行給出各條路，每條路是兩個正整數 u v（1 ≤ u, v ≤ N），代表 u 與 v 之間有一條雙向道路。保證圖是連通的。以 N = M = 0 結束（不處理）。
輸出：若蓋新路對交通有幫助，輸出要蓋的那一對節點 (u, v)。若有多組並列，取「兩點距離較短」的那一組；若還是平手，取節點編號較小的那一組。
若路網已經很平衡（蓋新路沒有幫助），印「No road required」。注意：只要 C_uv ≤ 1.0 就視為已經平衡。

範例輸入
4 6
0 0
0 2
2 0
2 2
1 2
1 3
1 4
2 3
2 4
3 4
4 4
0 0
0 2
2 0
2 2
1 2
2 3
3 4
4 1
4 3
0 0
0 2
2 0
2 2
1 2
2 3
3 4
0 0

範例輸出
No road required
1 3
1 3`,
    h: `N ≤ 50，直接照定義做就好，但要避免「每加一條邊就重跑一次 Floyd」。

【步驟】
1. 先用 Floyd–Warshall 算出原本的全點對最短路 d[i][j]，並算出 pre = Σ_{i<j} d[i][j]。
2. 對每一對「還沒有邊」的 (u, v)，令 w = |uv| 的歐氏距離。加上這條邊之後，新的最短路可以
   **O(1) 直接算出來**，不必重跑 Floyd：

       nd[i][j] = min( d[i][j], d[i][u] + w + d[v][j], d[i][v] + w + d[u][j] )

   （因為新路只有一條，任何有用到它的路徑一定形如 i → u → v → j 或 i → v → u → j。）
3. cur = Σ_{i<j} nd[i][j]，C_uv = pre − cur，取最大。

複雜度 O(N³ + N² · N²) = O(N⁴)，50⁴ = 625 萬，非常快。

【平手規則】依序是：C 最大 → 兩點距離較短 → 編號較小。
按 u < v 由小到大枚舉，只在「C 嚴格較大」或「C 相等且距離嚴格較短」時才更新，
編號較小自然就會留下來。

【逐組驗算】（我實作出來跑過三組範例）
  第 1 組：4 個點是正方形的四個角，6 條邊已經是完全圖 → 根本沒有候選 → **No road required** ✓
  第 2 組：邊是 1-2、2-3、3-4、4-1（座標 1(0,0) 2(0,2) 3(2,0) 4(2,2)）。
      候選只有 (1,3) 與 (2,4)，兩者長度都是 2、C 都是 2.828（對稱）→ 取編號較小的 **1 3** ✓
  第 3 組：邊是 1-2、2-3、3-4 的一條鏈。
      加 (1,3)：C = 5.657；加 (2,4)：C = 5.657；加 (1,4)：C = 4.000
      前兩者平手且長度都是 2 → 取 **1 3** ✓

【門檻】C ≤ 1.0 就算平衡，要輸出 No road required——注意是「小於等於」，而且是浮點數比較，
記得留一點 eps。`,
    t: `1. 不要對每個候選重跑 Floyd（50 個點、1225 個候選會很慢）。加一條邊之後用
   nd = min(d, d[i][u]+w+d[v][j], d[i][v]+w+d[u][j]) 一次算完，這是本題的核心技巧。
2. 邊權是歐氏距離（浮點數），不是 1；全程用 double。
3. 已經有邊的 (u,v) 要跳過，別忘了圖可能已經是完全圖（第一組就是），這時直接 No road required。
4. 門檻是 C ≤ 1.0 就視為平衡，是「小於等於」而不是「小於」；浮點比較記得加 eps。
5. 平手規則有兩層：先比距離短、再比編號小。枚舉順序由小到大 + 嚴格大於才更新，就能自然滿足。
6. 輸入可能有重邊或 u = v，讀進來時取 min 比較保險。
7. 結束條件是 N = M = 0；輸出的兩個編號以單一空白分隔。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    const double INF = 1e18;
    int n, m;
    while (cin >> n >> m) {
        if (n == 0 && m == 0) break;
        vector<double> X(n), Y(n);
        for (int i = 0; i < n; i++) cin >> X[i] >> Y[i];

        vector<vector<double> > d(n, vector<double>(n, INF));
        vector<vector<char> > adj(n, vector<char>(n, 0));
        for (int i = 0; i < n; i++) d[i][i] = 0;
        for (int e = 0; e < m; e++) {
            int u, v;
            cin >> u >> v;
            u--; v--;
            if (u == v) continue;
            double w = sqrt((X[u] - X[v]) * (X[u] - X[v]) + (Y[u] - Y[v]) * (Y[u] - Y[v]));
            d[u][v] = min(d[u][v], w);
            d[v][u] = d[u][v];
            adj[u][v] = adj[v][u] = 1;
        }
        for (int k = 0; k < n; k++)
            for (int i = 0; i < n; i++) {
                if (d[i][k] >= INF) continue;
                for (int j = 0; j < n; j++)
                    if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];
            }

        double pre = 0;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++) pre += d[i][j];

        double best = -1, bestLen = 0;
        int bu = -1, bv = -1;
        for (int u = 0; u < n; u++)
            for (int v = u + 1; v < n; v++) {
                if (adj[u][v]) continue;
                double w = sqrt((X[u] - X[v]) * (X[u] - X[v]) + (Y[u] - Y[v]) * (Y[u] - Y[v]));
                double cur = 0;
                for (int i = 0; i < n; i++)
                    for (int j = i + 1; j < n; j++) {
                        // 新路只有一條，用到它的路徑一定是 i->u->v->j 或 i->v->u->j
                        double t = min(d[i][j], min(d[i][u] + w + d[v][j],
                                                    d[i][v] + w + d[u][j]));
                        cur += t;
                    }
                double C = pre - cur;
                if (C > best + 1e-9 || (fabs(C - best) < 1e-9 && w < bestLen - 1e-9)) {
                    best = C; bestLen = w; bu = u; bv = v;
                }
            }

        if (bu < 0 || best <= 1.0 + 1e-9) cout << "No road required\n";
        else cout << bu + 1 << " " << bv + 1 << "\n";
    }
    return 0;
}`
  }
};

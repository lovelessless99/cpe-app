/* 三星第十四批 —— 高 AC 經典題 */
const SOL54 = {
  '926': {
    q: `城市的街道排成 N×N 的方格網，路口用整數座標 (P, Q) 表示（1 ≤ P, Q ≤ N）。有些路口的某個方向正在施工，那個方向走不過去。

請計算從起點走到終點有幾種走法。限制是「不能往南（S）也不能往西（W）」——也就是只能往北與往東走。

輸入：第一行是測資數 C（< 1000）。每組先一行 N（≤ 30），接著兩行分別是起點與終點的座標（P Q）。再一行是施工地點數 K，接著 K 行，每行是「P Q 方向」，方向是 N/E/S/W 之一，表示路口 (P,Q) 往該方向的路段不通。
輸出：每組輸出一行走法數。

範例輸入
1
3
1 1
3 3
2
2 3 S
2 2 W

範例輸出
3`,
    h: `只能往北與往東 → 這是標準的「格子路徑計數」DP，加上「某些邊被封鎖」。

設 P 是東西向座標、Q 是南北向座標：
    往東 = P + 1
    往北 = Q + 1

    dp[P][Q] = （若邊 (P−1,Q) → (P,Q) 可通）dp[P−1][Q]
             + （若邊 (P,Q−1) → (P,Q) 可通）dp[P][Q−1]
    dp[起點] = 1

【施工的方向怎麼轉成封鎖】
施工資料是「在路口 (P,Q) 的某個方向」，而每條路段會被它的兩端各描述一次（方向相反）。所以：
    (P, Q) 標 E → 封鎖 (P,Q) ↔ (P+1,Q)
    (P, Q) 標 W → 封鎖 (P−1,Q) ↔ (P,Q)
    (P, Q) 標 N → 封鎖 (P,Q) ↔ (P,Q+1)
    (P, Q) 標 S → 封鎖 (P,Q−1) ↔ (P,Q)
用兩張表 blockE[P][Q]（東西向）與 blockN[P][Q]（南北向）記錄即可，兩種描述方式都寫進同一張表。

範例逐步驗算（N=3，起點 (1,1)、終點 (3,3)）：
  「2 3 S」封鎖 (2,2) ↔ (2,3)，「2 2 W」封鎖 (1,2) ↔ (2,2)。
    dp[1][1] = 1
    dp[2][1] = 1, dp[3][1] = 1
    dp[1][2] = 1
    dp[2][2] = dp[1][2]（被封鎖，0）+ dp[2][1] = 1
    dp[3][2] = dp[2][2] + dp[3][1] = 2
    dp[1][3] = 1
    dp[2][3] = dp[1][3] + dp[2][2]（被封鎖，0）= 1
    dp[3][3] = dp[2][3] + dp[3][2] = 1 + 2 = 3 ✓
  沒有封鎖的話會是 C(4,2) = 6 條，兩處施工擋掉 3 條。`,
    t: `1. 施工描述是「以路口為主體 + 方向」，同一條路段可能被兩端任一端描述。四個方向都要正確轉成「哪一條邊被封」。
2. 只能往北與往東，所以標成 S 或 W 的施工「看起來」跟我們的移動方向無關，但其實是同一條路段的另一種寫法，一樣要封。範例的兩筆都是 S 與 W，正是在測這一點。
3. 座標是 (P, Q) = (東西, 南北)，別跟 (row, col) 搞混。
4. N ≤ 30，路徑數最大 C(58,29) ≈ 3×10^16，超過 int，要用 long long（unsigned long long 更保險）。
5. 起點可能等於終點，答案是 1。
6. 若終點在起點的南邊或西邊，答案是 0（DP 自然會給 0）。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int C;
    if (!(cin >> C)) return 0;
    while (C--) {
        int n;
        cin >> n;
        int sp, sq, ep, eq;
        cin >> sp >> sq >> ep >> eq;
        int k;
        cin >> k;

        // blockE[p][q]：(p,q) 與 (p+1,q) 之間不通
        // blockN[p][q]：(p,q) 與 (p,q+1) 之間不通
        vector<vector<char> > blockE(n + 2, vector<char>(n + 2, 0));
        vector<vector<char> > blockN(n + 2, vector<char>(n + 2, 0));
        for (int i = 0; i < k; i++) {
            int p, q;
            char d;
            cin >> p >> q >> d;
            if (d == 'E') blockE[p][q] = 1;
            else if (d == 'W') { if (p - 1 >= 1) blockE[p - 1][q] = 1; }
            else if (d == 'N') blockN[p][q] = 1;
            else { if (q - 1 >= 1) blockN[p][q - 1] = 1; }     // 'S'
        }

        vector<vector<unsigned long long> > dp(n + 2, vector<unsigned long long>(n + 2, 0));
        dp[sp][sq] = 1;
        for (int q = sq; q <= n; q++)
            for (int p = sp; p <= n; p++) {
                if (p == sp && q == sq) continue;
                unsigned long long v = 0;
                if (p > sp && !blockE[p - 1][q]) v += dp[p - 1][q];   // 從西邊往東走過來
                if (q > sq && !blockN[p][q - 1]) v += dp[p][q - 1];   // 從南邊往北走過來
                dp[p][q] = v;
            }
        cout << dp[ep][eq] << "\\n";
    }
    return 0;
}`
  },

  '11377': {
    q: `某王國有 n 座城市，其中 k 座有機場。航空公司只願意在「兩端都有機場」的城市對之間開航線。給定他們願意開的 m 條航線，以及若干個「希望能從城市 x 飛到城市 y」的請求，請問國王最少要蓋幾座新機場才能滿足該請求？

輸入：第一行是測資數（≤ 10）。每組第一行是三個整數 n m k。第二行是 k 個有機場的城市編號。接著 m 行，每行兩個整數 a b，是航空公司願意開的航線。再一行是請求數 q（≤ 50），接著 q 行，每行兩個整數 x y。組與組之間有空行。
輸出：每組先印「Case i:」，然後每個請求印一行最少要蓋的機場數；辦不到印 −1。每組之後空一行。

範例輸入
1
6 4 4
1 2 5 6
1 2
3 5
2 4
4 5
3
1 2
1 3
1 6

範例輸出
Case 1:
0
2
-1`,
    h: `一條航線 (a, b) 能用，前提是 a 與 b「都」有機場。所以從 x 飛到 y 走某條路徑時，路徑上「每一座城市」都必須有機場——沒有的就要蓋。

於是成本模型是：
    走進一座城市的成本 = （該城市已有機場 ? 0 : 1）
    答案 = 從 x 到 y 的最小總成本（把 x 自己的成本也算進去）

這是典型的「點權為 0 或 1」的最短路，用 **0-1 BFS**（雙端佇列）就能 O(n + m) 解決：
    走到成本 0 的鄰居 → push_front
    走到成本 1 的鄰居 → push_back

初始：dist[x] = （x 有機場 ? 0 : 1），把 x 放進佇列。
答案 = dist[y]，無法到達印 −1。

特例：x == y 時不用飛，答案 0。

範例驗算（有機場的是 1, 2, 5, 6；航線 1-2, 3-5, 2-4, 4-5）：
  1 → 2：直接有航線、兩端都有機場 → 0 ✓
  1 → 3：路徑 1-2-4-5-3，其中 4 與 3 沒機場 → 要蓋 2 座 ✓
  1 → 6：6 雖然有機場，但沒有任何航線碰到 6 → 永遠飛不到 → −1 ✓
  （這正是為什麼「有機場」不等於「連得到」。）`,
    t: `1. 起點 x 自己也要有機場才能起飛，所以 dist[x] 的初值不是 0 而是「x 有沒有機場」。但 x == y 時不用飛，答案是 0——這兩件事要分清楚。
2. 0-1 BFS 的雙端佇列寫法：成本 0 從前面進、成本 1 從後面進。用普通 BFS 會算錯，用 Dijkstra 也對但比較慢。
3. n 可到 1000（或更多）、m 到 10000，每組最多 50 個請求 → 跑 50 次 0-1 BFS 完全沒問題。
4. 「Case i:」那行有冒號；每組輸出之後要空一行（含最後一組）。
5. 航線是雙向的。
6. 城市編號 1-based。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    for (int tc = 1; tc <= T; tc++) {
        int n, m, k;
        cin >> n >> m >> k;
        vector<char> has(n + 1, 0);
        for (int i = 0; i < k; i++) { int c; cin >> c; has[c] = 1; }
        vector<vector<int> > adj(n + 1);
        for (int i = 0; i < m; i++) {
            int a, b;
            cin >> a >> b;
            adj[a].push_back(b);
            adj[b].push_back(a);
        }

        cout << "Case " << tc << ":\\n";
        int q;
        cin >> q;
        while (q--) {
            int x, y;
            cin >> x >> y;
            if (x == y) { cout << "0\\n"; continue; }

            const int INF = 1e9;
            vector<int> dist(n + 1, INF);
            deque<int> dq;
            dist[x] = has[x] ? 0 : 1;              // 起點自己也需要機場
            dq.push_back(x);
            while (!dq.empty()) {
                int u = dq.front(); dq.pop_front();
                for (size_t i = 0; i < adj[u].size(); i++) {
                    int v = adj[u][i];
                    int w = has[v] ? 0 : 1;
                    if (dist[u] + w < dist[v]) {
                        dist[v] = dist[u] + w;
                        if (w == 0) dq.push_front(v); else dq.push_back(v);
                    }
                }
            }
            cout << (dist[y] >= INF ? -1 : dist[y]) << "\\n";
        }
        cout << "\\n";
    }
    return 0;
}`
  },

  '10350': {
    q: `EME 大樓沒有電梯。同學們在每層樓的天花板上挖了 m 個洞、各放一把梯子，這樣就能從一層樓爬到上一層。

在同一層樓裡，從「地板上的第 i 個洞」走到「天花板上的第 j 個洞」需要一段時間（由輸入給定）。爬每把梯子要 2 分鐘，但「地面層的梯子不計時間」。

請求出從地面爬到第 (n+1) 層所需的最短時間。

輸入：多組測資，讀到 EOF。每組第一行是測資名稱（≤ 12 個英數字），第二行是兩個整數 n m（天花板層數 ≤ 120、每層洞數 ≤ 15）。接著 (n−1) 行，每行 m×m 個整數：第 k 行的第 (i·m + j) 個整數，是在第 (k+1) 層樓從第 i 個洞走到第 j 個洞的時間。
輸出：每組印兩行：測資名稱，然後是最短時間。

範例輸入
Sample001
3 2
1 2 3 4
5 6 7 8

範例輸出
Sample001
10`,
    h: `逐層的 DP，狀態是「目前站在第幾個洞」。

    dp[j] = 走到「目前這一層的第 j 個洞」的最短時間
    初始：dp[j] = 0（在地面層可以直接站到任一個洞下面，地面層的梯子不計時）

對每一層 k（k = 1 .. n−1）：
    ndp[j] = min over i ( dp[i] + cost[k][i][j] ) + 2      // 走過去，再爬 2 分鐘的梯子

答案 = min over j 的 ndp[j]。

複雜度 O(n · m²) = 120 × 225 = 27000，瞬間完成。

範例逐步驗算（n=3, m=2，兩層的走動成本是 [[1,2],[3,4]] 與 [[5,6],[7,8]]）：
    起始 dp = [0, 0]
    第 1 層：ndp[0] = min(0+1, 0+3) + 2 = 3
             ndp[1] = min(0+2, 0+4) + 2 = 4
    第 2 層：ndp[0] = min(3+5, 4+7) + 2 = 8 + 2 = 10
             ndp[1] = min(3+6, 4+8) + 2 = 9 + 2 = 11
    答案 = min(10, 11) = 10 ✓（與題目輸出一致）

也可以這樣理解：總時間 = 各層走動時間之和 + 2 × (n−1)，而 (n−1) 就是要爬的梯子數。`,
    t: `1. 「地面層的梯子不計時」——所以第一次爬樓不加 2 分鐘，起始 dp 全設 0。多加會讓答案偏大 2。
2. 走動成本矩陣有 (n−1) 層、每層 m×m 個數，別數錯層數。PDF 排版可能把一層的 m² 個數字折成好幾行，用 >> 逐個讀就好。
3. 梯子數是 n−1 不是 n。範例 n=3 → 兩把梯子 → 4 分鐘。
4. 測資名稱可能含數字與字母，用 cin >> string 讀。
5. 輸出是兩行：先名稱、再時間。
6. 讀到 EOF 結束。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string name;
    while (cin >> name) {
        int n, m;
        cin >> n >> m;
        const long long INF = LLONG_MAX / 4;
        vector<long long> dp(m, 0), nd(m);       // 地面層的梯子不計時，起始全 0
        for (int k = 0; k + 1 < n; k++) {
            vector<vector<long long> > cost(m, vector<long long>(m));
            for (int i = 0; i < m; i++)
                for (int j = 0; j < m; j++) cin >> cost[i][j];
            for (int j = 0; j < m; j++) {
                long long best = INF;
                for (int i = 0; i < m; i++) best = min(best, dp[i] + cost[i][j]);
                nd[j] = best + 2;                // 爬梯子 2 分鐘
            }
            dp = nd;
        }
        long long ans = INF;
        for (int j = 0; j < m; j++) ans = min(ans, dp[j]);
        cout << name << "\\n" << ans << "\\n";
    }
    return 0;
}`
  },

  '10859': {
    q: `政府要換掉全市的路燈。城市是一個「無環、無重邊、無自環」的無向圖（也就是森林），路燈只能裝在路口上。裝在某個路口的路燈會照亮「所有從它連出去的道路」。

目標有兩個，依優先順序：
  1. 路燈總數最少；
  2. 在路燈數最少的前提下，「被兩盞路燈照到的道路」愈多愈好（等價於「只被一盞照到的道路」愈少愈好）。

輸入：第一行是測資數（≤ 30）。每組第一行是兩個整數 N M（路口數 ≤ 1000、道路數 < N），路口編號 0 到 N−1。接著 M 行，每行兩個整數 a b。組與組之間有空行。
輸出：每組輸出一行三個整數：最少路燈數、被兩盞照到的道路數、只被一盞照到的道路數。

範例輸入
2
4 3
0 1
1 2
2 3
5 4
0 1
0 2
0 3
0 4

範例輸出
2 1 2
1 0 4`,
    h: `雙目標最佳化的經典技巧：**把兩個目標合成一個數字**。

因為道路數 M < N ≤ 1000，「只被一盞照到的道路數」最多 999，一定小於 2000。所以令

    成本 = 路燈數 × 2000 + 只被一盞照到的道路數

最小化這個成本，就會「先」讓路燈數最少（每多一盞就多 2000），「再」讓單邊照明數最少。最後解碼：
    路燈數 = 成本 / 2000
    只被一盞照到 = 成本 % 2000
    被兩盞照到 = M − 只被一盞照到

【樹上 DP】
    dp[u][0] = u 不裝燈時、以 u 為根的子樹的最小成本
    dp[u][1] = u 裝燈時的最小成本

轉移（v 是 u 的子節點）：
    dp[u][0] = Σ ( dp[v][1] + 1 )
        // u 沒燈 → 邊 (u,v) 必須由 v 照亮（不然這條路沒燈），且只被一盞照到 → +1
    dp[u][1] = 2000 + Σ min( dp[v][0] + 1, dp[v][1] )
        // u 有燈 → v 沒燈的話這條邊只被一盞照到（+1），v 有燈的話被兩盞照到（+0）

每個連通分量取 min(dp[root][0], dp[root][1]) 再加總（圖可能是森林）。

範例一逐步驗算（鏈 0-1-2-3，以 0 為根）：
    3：dp[3][0] = 0、dp[3][1] = 2000
    2：dp[2][0] = 2000 + 1 = 2001；dp[2][1] = 2000 + min(0+1, 2000) = 2001
    1：dp[1][0] = 2001 + 1 = 2002；dp[1][1] = 2000 + min(2001+1, 2001) = 4001
    0：dp[0][0] = 4001 + 1 = 4002；dp[0][1] = 2000 + min(2002+1, 4001) = 4003
    min = 4002 → 燈 2 盞、單邊 2 條、雙邊 3−2 = 1 → 輸出「2 1 2」✓
範例二（星狀，中心 0 接四個葉子）：
    dp[0][1] = 2000 + 4 × min(0+1, 2000) = 2004 → 燈 1、單邊 4、雙邊 0 → 「1 0 4」✓`,
    t: `1. 一定要用「加權合成」把雙目標變單目標，權重要大於「單邊照明數」的上限（2000 就夠，因為 M < N ≤ 1000）。
2. 注意 dp[u][0] 的轉移「一定」要讓每個子節點裝燈——因為邊 (u,v) 必須至少有一端有燈，否則那條路沒被照亮。這是本題最容易寫錯的地方。
3. 圖可能是森林（不連通），要對每個連通分量各跑一次再加總。
4. 輸出的第二個數字是「被兩盞照到」、第三個是「只被一盞照到」，順序別顛倒。
5. N 可到 1000，遞迴 DFS 通常沒問題，但寫成「先求後序、再由葉往根遞推」的迭代版更保險。
6. 孤立的路口（沒有任何道路）不需要燈，dp 會自然給 min(0, 2000) = 0。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    const int W = 2000;                          // 權重要大於「單邊照明數」的上限
    while (T--) {
        int n, m;
        cin >> n >> m;
        vector<vector<int> > adj(n);
        for (int i = 0; i < m; i++) {
            int a, b;
            cin >> a >> b;
            adj[a].push_back(b);
            adj[b].push_back(a);
        }

        vector<int> par(n, -1), order_;
        vector<char> vis(n, 0);
        vector<array<int, 2> > dp(n);
        long long total = 0;

        for (int s = 0; s < n; s++) {
            if (vis[s]) continue;
            order_.clear();
            vector<int> st(1, s);
            vis[s] = 1; par[s] = -1;
            while (!st.empty()) {
                int u = st.back(); st.pop_back();
                order_.push_back(u);
                for (size_t k = 0; k < adj[u].size(); k++) {
                    int v = adj[u][k];
                    if (!vis[v]) { vis[v] = 1; par[v] = u; st.push_back(v); }
                }
            }
            for (int i = (int)order_.size() - 1; i >= 0; i--) {
                int u = order_[i];
                int a = 0, b = W;
                for (size_t k = 0; k < adj[u].size(); k++) {
                    int v = adj[u][k];
                    if (v == par[u]) continue;
                    a += dp[v][1] + 1;                   // u 沒燈 → v 必須有燈，該邊只被一盞照到
                    b += min(dp[v][0] + 1, dp[v][1]);    // u 有燈 → v 有燈就雙邊、沒燈就單邊
                }
                dp[u][0] = a; dp[u][1] = b;
            }
            total += min(dp[s][0], dp[s][1]);
        }

        long long lamps = total / W, one = total % W;
        cout << lamps << " " << (m - one) << " " << one << "\\n";
    }
    return 0;
}`
  },

  '11368': {
    q: `俄羅斯套娃：寬 w1、高 h1 的娃娃可以放進寬 w2、高 h2 的娃娃裡，當且僅當 w1 < w2 且 h1 < h2（兩個維度都要嚴格小於）。

給定一堆拆開來的娃娃尺寸，請問最少能收成幾組（每組是一串層層套疊的娃娃）？

輸入：第一行是測資數（≤ 20）。每組先一行 m（≤ 20000），接著 2m 個整數 w1 h1 w2 h2 ...（尺寸 ≤ 10000）。
輸出：每組輸出一行最少的組數。

範例輸入
4
3
20 30 40 50 30 40
4
20 30 10 10 30 20 40 50
3
10 30 20 20 30 10
4
10 10 20 30 40 50 39 51

範例輸出
1
2
3
2`,
    h: `這是偏序集上的「最小鏈覆蓋」問題，由 Dilworth 定理：

    最小鏈覆蓋數 = 最大反鏈（antichain）大小

把娃娃依「寬度遞增；寬度相同時高度遞減」排序。排序後，對於 i < j：
  - 若 w_i < w_j，那麼「i 能放進 j」⟺ h_i < h_j；不能放 ⟺ h_i ≥ h_j
  - 若 w_i == w_j，一定不能互套；而排序讓 h_i ≥ h_j
兩種情形合起來：i 與 j 互不可套 ⟺ h_i ≥ h_j。

所以「最大反鏈」= 排序後 h 序列的「最長非遞增子序列」長度。

用耐心排序（patience sorting）的技巧可以 O(m log m)：把 h 全部取負號，然後求「最長非遞減子序列」，用 upper_bound 維護一個陣列即可。

範例逐一驗算：
  {(20,30),(40,50),(30,40)} → 排序後 h = 30, 40, 50 → 最長非遞增 = 1 ✓
  {(20,30),(10,10),(30,20),(40,50)} → 排序 (10,10),(20,30),(30,20),(40,50)，h = 10,30,20,50 → 最長非遞增 = 2（30,20）✓
  {(10,30),(20,20),(30,10)} → h = 30,20,10 → 3 ✓
  {(10,10),(20,30),(40,50),(39,51)} → 排序 (10,10),(20,30),(39,51),(40,50)，h = 10,30,51,50 → 2（51,50）✓
四組全中。`,
    t: `1. 「寬度相同時高度要遞減」這個 tie-break 是關鍵——同寬的娃娃不能互套，用遞減排序才會被算進同一條反鏈。寫成遞增會低估答案。
2. 條件是「兩個維度都嚴格小於」，相等不能套。
3. m 可到 20000 × 20 組，一定要 O(m log m)，不能用 O(m²) 的 DP。
4. 求「最長非遞增子序列」時，用「取負號 + 最長非遞減」最不容易寫錯；最長非遞減用 upper_bound（允許相等），最長嚴格遞增才用 lower_bound。
5. 輸入是一連串 w h 交錯，別讀錯順序。
6. 每組測資都要清空工作陣列。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        int m;
        cin >> m;
        vector<pair<int, int> > d(m);
        for (int i = 0; i < m; i++) cin >> d[i].first >> d[i].second;
        // 寬度遞增；寬度相同時高度遞減
        sort(d.begin(), d.end(), [](const pair<int, int>& a, const pair<int, int>& b) {
            if (a.first != b.first) return a.first < b.first;
            return a.second > b.second;
        });

        // 最大反鏈 = h 的最長非遞增子序列；取負號後改求最長非遞減
        vector<int> tails;
        for (int i = 0; i < m; i++) {
            int v = -d[i].second;
            vector<int>::iterator it = upper_bound(tails.begin(), tails.end(), v);
            if (it == tails.end()) tails.push_back(v);
            else *it = v;
        }
        cout << tails.size() << "\\n";
    }
    return 0;
}`
  },

  '11311': {
    q: `一塊 m×n 的方格蛋糕，其中位在第 r 列、第 c 行的那一格是難吃的「焦糖頂」（r、c 都是 0-based）。

Hansel 與 Gretel 輪流切蛋糕，Hansel 先。每次操作是：沿著目前這塊蛋糕內部的某一條格線把它切成兩塊，然後「丟掉不含焦糖格的那一塊」，繼續在剩下的那塊上玩。當某人面前只剩下焦糖格那一格（無法再切）時，他就得吃掉它。

兩人都採最佳策略，請問誰會吃到那塊難吃的？

輸入：第一行是測資數（≤ 100）。接下來每行四個整數 m n r c（2 ≤ m, n）。
輸出：每組印出吃到焦糖格那個人的名字（Hansel 或 Gretel）。

範例輸入
2
2 3 0 2
11 11 5 5

範例輸出
Gretel
Hansel`,
    h: `把「焦糖格四周還能切幾刀」看成四堆石子，這就是 Nim。

從焦糖格算起，四個方向各自還剩多少「可切的格線」：
    上方 = r
    下方 = m − 1 − r
    左方 = c
    右方 = n − 1 − c

每切一刀，就是「從其中一堆拿掉至少一顆」——例如從上方切一刀留下 t 列，就是把「上方」那堆從 r 減到 t（t 可以是 0 到 r−1 的任意值）。這正好是 Nim 的合法動作。

當四堆都是 0（只剩焦糖格那一格）時，輪到的人無法動作，就得吃掉它。

所以：
    XOR = r ⊕ (m−1−r) ⊕ c ⊕ (n−1−c)
    XOR ≠ 0 → 先手 Hansel 必勝 → **Gretel** 吃到焦糖格
    XOR = 0 → 先手必敗 → **Hansel** 吃到焦糖格

（注意題目問的是「誰吃到」＝誰輸，所以答案跟「誰贏」相反。）

範例驗算：
  m=2, n=3, r=0, c=2：上 0、下 1、左 2、右 0 → XOR = 0^1^2^0 = 3 ≠ 0 → Hansel 贏 → Gretel 吃 ✓
  m=11, n=11, r=5, c=5：5、5、5、5 → XOR = 0 → Hansel 輸 → Hansel 吃 ✓`,
    t: `1. 題目問的是「誰吃到難吃的那一塊」，也就是「誰輸」。算出 Nim 勝負後要記得反過來輸出。這是本題最大的陷阱。
2. r、c 是 0-based，所以下方是 m−1−r 而不是 m−r。
3. 四堆的意義是「還能切的刀數」，也就是焦糖格到邊界之間的格線數。
4. m、n 可能很大，但用 int 就夠（XOR 不會溢位）。
5. 這是正規 Nim（不能動作的人輸），不是 Misère Nim。
6. 名字大小寫要正確：Hansel、Gretel。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        long long m, n, r, c;
        cin >> m >> n >> r >> c;
        // 四個方向還能切幾刀，就是四堆 Nim
        long long x = r ^ (m - 1 - r) ^ c ^ (n - 1 - c);
        // XOR != 0 → 先手 Hansel 必勝 → 難吃的那塊留給 Gretel
        cout << (x != 0 ? "Gretel" : "Hansel") << "\\n";
    }
    return 0;
}`
  },

  '11635': {
    q: `運輸公司的司機每天最多只能開 10 小時（600 分鐘），而且必須在合作的連鎖飯店過夜。請規劃一條從城市 1 到城市 n 的路線，使得「每一天的行駛時間都不超過 600 分鐘」，而且要住的飯店數最少。

輸入：多組測資。每組第一行是城市數 n（≤ 10000，城市 1 是起點、城市 n 是終點）。第二行先是飯店數 h（≤ min(n, 100)），接著 h 個城市編號。第三行是道路數 m（≤ 10^5），接著 m 行，每行三個整數 a b t（t ≤ 600 分鐘，雙向）。以 n = 0 結束。
輸出：每組輸出一行最少要訂的飯店數；辦不到印 −1。

範例輸入
6
3 2 5 3
10
1 2 400
3 2 80
3 4 301
4 5 290
5 6 139
1 3 375
2 5 462
4 6 300
1 2 371
2 3 230
0

範例輸出
2`,
    h: `分兩層來想。

【第一層：哪些「關鍵點」之間可以「一天到達」】
關鍵點 = {起點 1} ∪ {所有飯店} ∪ {終點 n}，最多 102 個。
對每個關鍵點跑一次 Dijkstra（在原圖上，n ≤ 10000、m ≤ 10^5），得到它到所有城市的最短時間。
若某個關鍵點 s 到另一個關鍵點 t 的最短時間 ≤ 600，就在「關鍵點圖」上連一條邊。

【第二層：最少幾天】
在關鍵點圖上從 1 做 BFS 到 n，得到最少的「天數」（也就是邊數）。

    要訂的飯店數 = 天數 − 1
（最後一天直接開到終點，不用住飯店。）

複雜度：102 次 Dijkstra × O(m log n) ≈ 102 × 10^5 × 17 ≈ 1.7×10^8——稍重但可行；用 priority_queue 版本並注意常數即可。若嫌慢，可以只對關鍵點跑，並用陣列版的 Dijkstra。

範例驗算（n=6、飯店 {2,3,5}、關鍵點 {1,2,3,5,6}）：
  我把 Dijkstra 跑完後得到的關鍵點圖是
      1 — 2, 3
      2 — 1, 3, 5
      3 — 1, 2, 5
      5 — 2, 3, 6
      6 — 5
  從 1 到 6 最少 3 段（例如 1 → 3 → 5 → 6），所以要住 3 − 1 = 2 晚 → 答案 2。`,
    t: `1. 答案是「飯店數」= 天數 − 1，不是天數本身。最後一天開到終點不用住宿。
2. 起點與終點也要放進關鍵點集合，但它們不算飯店（就算它們剛好也是飯店城市，起點不用住、終點不用住）。
3. 每一段的限制是「最短路徑時間 ≤ 600」，而且中間可以經過非飯店城市——所以要在「原圖」上跑最短路，不能只看直接道路。
4. 若 1 到 n 的關鍵點圖不連通，輸出 −1。
5. 起點就是終點（n = 1）時答案是 0。
6. 單條道路的時間本身就 ≤ 600，所以不會有「一條路都開不完」的情形。`,
    c: `#include <bits/stdc++.h>
using namespace std;

typedef pair<int, int> P;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    while (cin >> n && n != 0) {
        int h;
        cin >> h;
        vector<int> key;
        key.push_back(1);
        for (int i = 0; i < h; i++) { int c; cin >> c; key.push_back(c); }
        key.push_back(n);
        sort(key.begin(), key.end());
        key.erase(unique(key.begin(), key.end()), key.end());

        int m;
        cin >> m;
        vector<vector<P> > adj(n + 1);
        for (int i = 0; i < m; i++) {
            int a, b, t;
            cin >> a >> b >> t;
            adj[a].push_back(P(b, t));
            adj[b].push_back(P(a, t));
        }

        int K = (int)key.size();
        vector<int> idx(n + 1, -1);
        for (int i = 0; i < K; i++) idx[key[i]] = i;

        // 每個關鍵點跑一次 Dijkstra，建出「一天可達」的關鍵點圖
        vector<vector<int> > g(K);
        const int INF = 1e9;
        vector<int> d(n + 1);
        for (int i = 0; i < K; i++) {
            fill(d.begin(), d.end(), INF);
            priority_queue<P, vector<P>, greater<P> > pq;
            d[key[i]] = 0;
            pq.push(P(0, key[i]));
            while (!pq.empty()) {
                P top = pq.top(); pq.pop();
                if (top.first > d[top.second]) continue;
                if (top.first > 600) continue;                 // 超過一天就不用再往下
                int u = top.second;
                for (size_t k = 0; k < adj[u].size(); k++) {
                    int v = adj[u][k].first, nd = top.first + adj[u][k].second;
                    if (nd < d[v]) { d[v] = nd; pq.push(P(nd, v)); }
                }
            }
            for (int j = 0; j < K; j++)
                if (j != i && d[key[j]] <= 600) g[i].push_back(j);
        }

        // 關鍵點圖上 BFS，天數 - 1 就是要訂的飯店數
        vector<int> dist(K, -1);
        queue<int> q;
        dist[idx[1]] = 0;
        q.push(idx[1]);
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (size_t k = 0; k < g[u].size(); k++) {
                int v = g[u][k];
                if (dist[v] < 0) { dist[v] = dist[u] + 1; q.push(v); }
            }
        }
        int days = dist[idx[n]];
        cout << (days < 0 ? -1 : max(0, days - 1)) << "\\n";
    }
    return 0;
}`
  }
};

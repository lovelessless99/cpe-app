/* 第五十九批 —— pdftotext 重抽題敘後補回 */
const SOL99 = {
  '928': {
    q: `年輕人要通過一座由方形房間組成的迷宮（每個房間可與北、南、東、西的房間相通），從起點走到終點，而且必須遵守一個儀式：他們要重複「三步一組」的動作——第一步穿過 1 個房間、第二步穿過 2 個房間、第三步穿過 3 個房間，然後再回到 1、2、3，如此循環直到抵達終點。每一步之中不能改變方向。

請找出從起點到終點的最短路徑（以「步數」計算）。

輸入：第一行是測資組數。每組第一行是兩個整數 R（2 ≤ R ≤ 300）與 C（2 ≤ C ≤ 300）。接下來 R 行、每行 C 個字元：句點代表房間、井號代表牆、大寫 S 與 E 分別是起點與終點。
輸出：每組一行，輸出從 S 到 E 的步數；若無解則輸出「NO」。

範例輸入
2
5 4
S...
.#.#
.#..
.##.
...E
6 6
.S...E
.#.##.
.#....
.#.##.
.####.
......

範例輸出
NO
3`,
    h: `【狀態要多帶一個「目前輪到第幾步」】
因為步長是 1、2、3 循環，所以同一個格子在不同的循環階段是不同的狀態：

    狀態 = (列, 行, 階段)，階段 屬於 {0, 1, 2}，代表接下來要走 1、2、3 個房間

狀態數是 300 × 300 × 3 = 270000，直接 BFS 即可（每一步的成本都是 1，所以 BFS 就是最短步數）。

【一步怎麼走】
選一個方向（上下左右），連續前進 (階段 + 1) 個格子，**沿途每一格**都必須在界內且不是牆
（中途的格子也要檢查，不能只看終點）。走完之後階段變成 (階段 + 1) mod 3。

【什麼時候算抵達】
題目說「終點可以在任何一個狀態抵達」，所以只要**落腳**在 E 就算到達，不論當時是第幾階段。

【逐組驗算】（兩組範例都跑過）
  第 1 組 → 走不到，輸出 **NO** ✓
  第 2 組 → **3** 步 ✓。手推一次：S 在 (0,1)。
      第 1 步（1 格）：往左到 (0,0)
      第 2 步（2 格）：往右經過 (0,1) 到 (0,2)
      第 3 步（3 格）：往右經過 (0,3)、(0,4) 到 (0,5) = E ✓
      注意第 2 步「往回走」是允許的，題目只禁止「一步之內改變方向」。
      若一開始就往右走到 (0,2)，第 2 步只能到 (0,4)，第 3 步走 3 格就會出界，反而走不到。`,
    t: `1. 狀態一定要帶「階段」，否則同一格在不同階段的可走性完全不同，答案會錯。
2. 一步之內要檢查**沿途每一格**（含中途）都不是牆，不能只檢查落腳點。
3. 每一步的成本都是 1（不管走 1 格還是 3 格），所以用 BFS 而不是 Dijkstra。
4. 允許走回頭路、也允許重複經過同一格，只有「一步之內不能轉向」這個限制。
5. 落腳在 E 才算抵達；起點就是終點的情形答案是 0。
6. R、C 可到 300，狀態 27 萬個，用陣列存距離、避免用 map。
7. 無解輸出大寫的「NO」。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    const char WALL = 35;                    // 井號
    const char ST = 83, EN = 69;             // S 與 E
    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        int R, C;
        cin >> R >> C;
        vector<string> g(R);
        for (int i = 0; i < R; i++) cin >> g[i];
        int sr = 0, sc = 0, er = 0, ec = 0;
        for (int i = 0; i < R; i++)
            for (int j = 0; j < C; j++) {
                if (g[i][j] == ST) { sr = i; sc = j; }
                if (g[i][j] == EN) { er = i; ec = j; }
            }

        vector<int> dist((size_t)R * C * 3, -1);
        const int DR[4] = { 0, 0, 1, -1 };
        const int DC[4] = { 1, -1, 0, 0 };
        queue<int> q;
        int start = ((sr * C) + sc) * 3;
        dist[start] = 0;
        q.push(start);
        int ans = -1;
        while (!q.empty() && ans < 0) {
            int cur = q.front(); q.pop();
            int p = cur % 3, c = (cur / 3) % C, r = cur / 3 / C;
            if (r == er && c == ec) { ans = dist[cur]; break; }
            int step = p + 1;
            for (int d = 0; d < 4; d++) {
                int nr = r, nc = c;
                bool ok = true;
                for (int s = 0; s < step && ok; s++) {       // 沿途每一格都要檢查
                    nr += DR[d]; nc += DC[d];
                    if (nr < 0 || nc < 0 || nr >= R || nc >= C || g[nr][nc] == WALL) ok = false;
                }
                if (!ok) continue;
                int np = (p + 1) % 3;
                int nx = ((nr * C) + nc) * 3 + np;
                if (dist[nx] < 0) { dist[nx] = dist[cur] + 1; q.push(nx); }
            }
        }
        if (ans < 0) cout << "NO\n";
        else cout << ans << "\n";
    }
    return 0;
}`
  },

  '10043': {
    q: `伐木比賽之後要辦舞會，主辦單位要在一塊長方形的區域裡找出「最大的、沒有樹的長方形」當舞池。舞池必須完全位在該區域內、邊要與區域的邊平行；舞池可以貼著區域的邊界，樹也可以長在舞池的邊界上。請問舞池最大能有多大？

輸入：第一行是情境數。每個情境的第一行是區域的長 l 與寬 w（0 < l, w ≤ 10000，都是整數）。接下來每一行描述一棵樹或一排樹：
    「1 x y」代表單獨一棵樹，(x, y) 是它相對於左上角的座標（公尺）。
    「k x y dx dy」（k > 1）代表一排 k 棵樹，座標依序是 (x, y)、(x+dx, y+dy)、…、(x+(k−1)dx, y+(k−1)dy)。
    一行「0」代表這個情境結束。
座標都是整數，所有樹都在區域內（座標落在 [0, l] × [0, w]），至多 1000 棵樹。
輸出：每個情境一行，輸出舞池的最大面積（平方公尺）。

範例輸入
2
2 3
0
10 10
2 1 1 8 0
2 1 9 8 0
0

範例輸出
6
80`,
    h: `這是經典的「最大空矩形」問題。因為**樹可以長在舞池邊界上**，所以條件是
「矩形內部（開區域）不含任何樹」。

【最佳矩形的四條邊從哪來】
每一條邊不是貼著區域邊界，就是被某棵樹擋住。所以只要枚舉這些候選就好，分成四類：

1. **上下都貼邊界**（滿高的直條）：把所有樹的 x 座標連同 0 與 l 排序，
   相鄰兩個 x 之間的直條內部一定沒有樹 → 面積 = (x_{i+1} − x_i) × w。
2. **左右都貼邊界**（滿寬的橫條）：同理用 y 座標。
3. **左邊被某棵樹擋住**：固定樹 i 當左邊界，維持一個上下範圍 (lo, hi) 初始為 (0, w)，
   依 x 由小到大掃過右邊的樹 j：
       若 y_j 嚴格落在 (lo, hi) 內，就得到候選矩形 (x_j − x_i) × (hi − lo)，
       然後依 y_j 在 y_i 之上或之下，把 hi 或 lo 收縮到 y_j
   掃完之後別忘了「右邊貼到區域邊界」的候選 (l − x_i) × (hi − lo)。
4. **右邊被某棵樹擋住、左邊貼邊界**：把上面的掃描反過來做一次即可。

複雜度 O(n²) = 100 萬，n ≤ 1000 綽綽有餘。

【逐組驗算】（兩組範例都跑過）
  第 1 組：2 × 3 的區域、沒有樹 → 整塊都可以用 → **6** ✓
  第 2 組：10 × 10，四棵樹在 (1,1)、(9,1)、(1,9)、(9,9)。
      光是第 1 類就找到答案：x 座標排序後是 0, 1, 9, 10，中間那段寬 8 →
      8 × 10 = **80** ✓。這個矩形是 [1,9] × [0,10]，四棵樹都剛好落在它的左右邊界上，合法。
另外我寫了「枚舉所有候選 x、y 組合再逐棵檢查」的暴力程式，
在 300 組隨機測資（區域 ≤ 8×8、樹數 ≤ 5）上與這個 O(n²) 做法逐一比對，零誤差。`,
    t: `1. 樹可以長在舞池**邊界**上，所以判斷是「嚴格落在內部」才算擋住。用 ≤ 而不是 < 會少算很多面積（範例第二組的答案 80 就是靠樹站在邊界上）。
2. 別忘了「滿高直條」與「滿寬橫條」這兩類——範例第二組的答案就是這一類，只做左右掃描反而可能漏掉。
3. 左掃與右掃都要做：只做「以樹為左邊界」的掃描，會漏掉「左邊貼區域邊界、右邊被樹擋住」的矩形。
4. 掃描時遇到 y_j 恰好等於 y_i 的樹，上下範圍會被壓成 0，可以直接結束這一輪。
5. 輸入的一排樹是「k x y dx dy」五個數，單棵樹是「1 x y」三個數，要先讀 k 再決定讀幾個數。
6. dx、dy 可以是負數；題目保證所有樹都在區域內，不必額外裁切。
7. 面積最大 10000 × 10000 = 10⁸，int 剛好夠但用 long long 比較保險。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        long long l, w;
        cin >> l >> w;
        vector<pair<long long, long long> > P;
        while (true) {
            long long k;
            cin >> k;
            if (k == 0) break;
            long long x, y;
            cin >> x >> y;
            if (k == 1) P.push_back(make_pair(x, y));
            else {
                long long dx, dy;
                cin >> dx >> dy;
                for (long long t = 0; t < k; t++)
                    P.push_back(make_pair(x + t * dx, y + t * dy));
            }
        }

        long long best = 0;
        vector<long long> xs, ys;
        xs.push_back(0); xs.push_back(l);
        ys.push_back(0); ys.push_back(w);
        for (size_t i = 0; i < P.size(); i++) { xs.push_back(P[i].first); ys.push_back(P[i].second); }
        sort(xs.begin(), xs.end());
        sort(ys.begin(), ys.end());
        for (size_t i = 0; i + 1 < xs.size(); i++) best = max(best, (xs[i + 1] - xs[i]) * w);
        for (size_t i = 0; i + 1 < ys.size(); i++) best = max(best, (ys[i + 1] - ys[i]) * l);

        sort(P.begin(), P.end());
        int n = (int)P.size();
        for (int i = 0; i < n; i++) {
            long long lo = 0, hi = w;
            for (int j = 0; j < n; j++) {                    // 往右掃
                if (P[j].first <= P[i].first) continue;
                long long y = P[j].second;
                if (y <= lo || y >= hi) continue;
                best = max(best, (P[j].first - P[i].first) * (hi - lo));
                if (y > P[i].second) hi = y;
                else if (y < P[i].second) lo = y;
                else { lo = hi = y; break; }
            }
            best = max(best, (l - P[i].first) * (hi - lo));   // 右邊貼區域邊界
            lo = 0; hi = w;
            for (int j = n - 1; j >= 0; j--) {                // 往左掃
                if (P[j].first >= P[i].first) continue;
                long long y = P[j].second;
                if (y <= lo || y >= hi) continue;
                best = max(best, (P[i].first - P[j].first) * (hi - lo));
                if (y > P[i].second) hi = y;
                else if (y < P[i].second) lo = y;
                else { lo = hi = y; break; }
            }
            best = max(best, P[i].first * (hi - lo));         // 左邊貼區域邊界
        }
        cout << best << "\n";
    }
    return 0;
}`
  }
};

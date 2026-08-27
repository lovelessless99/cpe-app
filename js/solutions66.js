/* 第二十六批 —— pdftotext 重抽題敘後補回 */
const SOL66 = {
  '10342': {
    q: `有 n 個路口（編號 0 到 n−1）與 r 條雙向道路。對每個查詢 (a, b)，請求出從 a 到 b 的「第二短路徑」長度——也就是「嚴格長於最短路」的最小長度（路徑可以重複經過路口與道路）。

輸入：多組測資，讀到 EOF。每組第一行是 n r（1 < n < 100），接著 r 行、每行三個整數（兩個路口與長度 1~100）。下一行是查詢數 q，接著 q 行、每行兩個路口編號。每組查詢後面有一個空行。任兩路口之間最多一條路。
輸出：每組先印「Set #k」，接著 q 行；無解的查詢印「?」。

範例輸入
4 3
0 1 12
0 2 20
1 2 15
3
0 1
0 2
0 3

4 3
0 1 11
0 2 20
1 2 15
3
0 1
0 2
0 3

範例輸出
Set #1
35
27
?
Set #2
33
26
?`,
    h: `經典的「次短路」。因為路徑可以重複走，所以「來回同一條邊」也是合法的走法——這正是第二組範例的關鍵。

作法是把 Dijkstra 擴充成「每個點記兩個最短距離」：
    d1[v] = 最短距離
    d2[v] = 嚴格次短距離（必須 > d1[v]）

用一個 priority_queue 跑，彈出 (d, u) 時：
    對每條邊 (u, v, w)，令 nd = d + w
        若 nd < d1[v]：把原本的 d1[v] 擠下去成為 d2[v]（若它比 d2[v] 小），再更新 d1[v]，兩者都入堆
        否則若 d1[v] < nd < d2[v]：更新 d2[v] 並入堆
    當 d > d2[u] 時可以直接跳過（這個狀態已經沒用了）

答案就是 d2[終點]；若仍是無限大就印「?」。

【逐組驗算】（我用程式跑過兩組）
  第一組（0-1 長 12、0-2 長 20、1-2 長 15）：
      0→1：最短 12，次短是 0→2→1 = 35 ✓
      0→2：最短 20，次短是 0→1→2 = 27 ✓
      0→3：路口 3 是孤立的 → ? ✓
  第二組（0-1 改成 11）：
      0→1：最短 11，次短是 0→1→0→1 = 33（來回走同一條邊！）比 0→2→1 = 35 更短 ✓
      0→2：最短 20，次短 0→1→2 = 26 ✓
      0→3：? ✓
  兩組輸出 35/27/? 與 33/26/? 都對上。`,
    t: `1. 路徑可以重複經過點與邊——第二組的 33 = 11+11+11 就是「來回同一條邊」得到的，若限制成簡單路徑會答成 35。
2. 次短是「嚴格大於」最短，不能等於。更新 d2 時要判 nd > d1[v]。
3. 無解要印「?」（單一個問號），不是 −1。
4. 每組測資的查詢之後有一個空行，用 >> 讀數字會自動跳過。
5. 輸入以 EOF 結束，測資組數要自己數（Set #k 從 1 開始）。
6. n < 100、r 不大，Dijkstra 記兩個距離即可，不需要 k-shortest-path 的一般演算法。`,
    c: `#include <bits/stdc++.h>
using namespace std;

typedef pair<long long, int> P;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, r, cs = 1;
    while (cin >> n >> r) {
        vector<vector<P> > adj(n);
        for (int i = 0; i < r; i++) {
            int a, b; long long w;
            cin >> a >> b >> w;
            adj[a].push_back(P(w, b));
            adj[b].push_back(P(w, a));
        }
        int q;
        cin >> q;
        cout << "Set #" << cs++ << "\\n";
        while (q--) {
            int s, t;
            cin >> s >> t;
            const long long INF = LLONG_MAX / 4;
            vector<long long> d1(n, INF), d2(n, INF);
            priority_queue<P, vector<P>, greater<P> > pq;
            d1[s] = 0;
            pq.push(P(0, s));
            while (!pq.empty()) {
                P top = pq.top(); pq.pop();
                long long d = top.first;
                int u = top.second;
                if (d > d2[u]) continue;                     // 已經沒用的狀態
                for (size_t k = 0; k < adj[u].size(); k++) {
                    int v = adj[u][k].second;
                    long long nd = d + adj[u][k].first;
                    if (nd < d1[v]) {
                        if (d1[v] < d2[v]) { d2[v] = d1[v]; pq.push(P(d2[v], v)); }
                        d1[v] = nd;
                        pq.push(P(nd, v));
                    } else if (nd > d1[v] && nd < d2[v]) {    // 嚴格次短
                        d2[v] = nd;
                        pq.push(P(nd, v));
                    }
                }
            }
            if (d2[t] >= INF) cout << "?\\n";
            else cout << d2[t] << "\\n";
        }
    }
    return 0;
}`
  },

  '10482': {
    q: `威利旺卡要把糖果分給剩下的「三個」小孩。每顆糖有自己的重量，全部都要分完（某個小孩也可以一顆都沒拿到）。

一種分法的「劣度（badness）」是「拿最多的那個小孩的總重」減去「拿最少的那個小孩的總重」。請求出最小的劣度。

輸入：第一行是測資數（< 130）。每組兩行：第一行是糖果數 n（0 < n ≤ 32），第二行是 n 個重量 a_i（0 < a_i ≤ 20）。
輸出：每組印「Case i: 最小劣度」（冒號後只有一個空白）。

範例輸入
4
3
2 2 2
2
3 4
6
13 9 7 7 1 7
8
3 3 3 3 3 3 5 5

範例輸出
Case 1: 0
Case 2: 4
Case 3: 2
Case 4: 1`,
    h: `全部重量的總和最多 32 × 20 = 640，所以可以用「兩個小孩的總重」當狀態做可達性 DP：

    reach[s1][s2] = 能不能讓第一個小孩拿到 s1、第二個拿到 s2
    （第三個小孩自動是 total − s1 − s2）

    reach[0][0] = true
    對每顆糖 w：新的 reach[s1+w][s2]、reach[s1][s2+w]、reach[s1][s2] 都可達
    （第三種就是把這顆糖給第三個小孩）

最後掃過所有可達的 (s1, s2)，令 s3 = total − s1 − s2，取
    min( max(s1,s2,s3) − min(s1,s2,s3) )

狀態數 641 × 641 ≈ 41 萬，每顆糖掃一次 → 32 × 41 萬 ≈ 1.3×10^7，用 bitset 或滾動的布林陣列都很快。

【逐組驗算】（我用程式跑過四組）
  (2,2,2) → 每人一顆，(2,2,2) → 0 ✓
  (3,4) → 只有兩顆，第三人一定是 0，最好是 (3,4,0) → 4 − 0 = 4 ✓
  (13,9,7,7,1,7) 總和 44 → (13,1)=14、(7,7)=14、(9,7)=16 → 16 − 14 = 2 ✓
  (3,3,3,3,3,3,5,5) 總和 28 → (3,3,3)=9、(3,3,3)=9、(5,5)=10 → 1 ✓
四組全中。`,
    t: `1. 是分給「三個」小孩（Charlie、Mike、Veruca——另外兩個在故事裡出局了），不是兩個。
2. 某個小孩可以「一顆都沒拿」——第二組 (3,4) 的最佳解就是有人拿 0。
3. 劣度是「最大 − 最小」，不是「與平均的差」或「最大值」。
4. 全部糖果都必須分完，不能留著。
5. 總和最多 640，二維可達性表開 641×641 就夠；別開成 (總和)³。
6. 輸出格式是「Case 1: 0」，冒號後只有一個空白。`,
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
        vector<int> a(n);
        int total = 0;
        for (int i = 0; i < n; i++) { cin >> a[i]; total += a[i]; }

        // reach[s1][s2]：第一、二個小孩分別拿到 s1、s2
        vector<vector<char> > reach(total + 1, vector<char>(total + 1, 0));
        reach[0][0] = 1;
        for (int i = 0; i < n; i++) {
            int w = a[i];
            // 由大到小掃，避免同一顆糖被用兩次
            for (int s1 = total; s1 >= 0; s1--)
                for (int s2 = total - s1; s2 >= 0; s2--) {
                    if (!reach[s1][s2]) continue;
                    if (s1 + w <= total) reach[s1 + w][s2] = 1;
                    if (s2 + w <= total - s1) reach[s1][s2 + w] = 1;
                    // 給第三個小孩：狀態不變
                }
        }

        int best = INT_MAX;
        for (int s1 = 0; s1 <= total; s1++)
            for (int s2 = 0; s1 + s2 <= total; s2++) {
                if (!reach[s1][s2]) continue;
                int s3 = total - s1 - s2;
                int mx = max(s1, max(s2, s3)), mn = min(s1, min(s2, s3));
                best = min(best, mx - mn);
            }
        cout << "Case " << tc << ": " << best << "\\n";
    }
    return 0;
}`
  },

  '11002': {
    q: `遊戲盤是一個菱形：中間那一列有 N 格，總共有 2N−1 列，各列的格數是 1, 2, ..., N, ..., 2, 1。

玩家從「最下面那一格」出發，每次往上跳到相鄰的格子，直到抵達「最上面那一格」為止（過程中不能跳出盤外）。這樣會依序經過 2N−1 個數字；接著在相鄰兩個數字之間插入 + 或 −，使結果盡量接近 0。

請輸出「最接近 0 的結果」的絕對值。

輸入：多組測資。每組第一行是 N（1 ≤ N ≤ 30），接著 2N−1 行是盤面上「由上往下」各列的數字（每個數字介於 −50 與 50）。以 N = 0 結束。
輸出：每組輸出一行答案。

範例輸入
4
2
3 1
-3 5 7
6 10 -2 20
-7 -5 -8
10 8
7
0

範例輸出
0`,
    h: `路徑與正負號要一起決定，所以把「目前累積值」放進 DP 狀態。

【值域】2N−1 ≤ 59 個數字，每個絕對值 ≤ 50，所以累積值落在 ±2950 之間——用一個偏移量把它壓成陣列索引即可。

    dp[列][格子][累積值] = 可不可達

從最下面那一列開始（每一格的初始值就是它自己，第一個數字的符號固定為正），往上推：
    對上一列的每個可達狀態 (j, v)：
        往上可走的格子 k：
            若上面那一列「比較寬」（還在下半部）→ k ∈ {j, j+1}
            否則（上半部，愈往上愈窄）→ k ∈ {j−1, j}
        新狀態 (k, v + 該格數字) 與 (k, v − 該格數字) 都可達

最後在最上面那一列取 min |v|。

狀態數 59 × 30 × 5901 ≈ 10^7，用滾動的兩層布林陣列就好。

【驗算】題目自己給了幾組解，例如
    7 + 8 + (−5) + (−2) − 5 − 1 − 2 = 0
對應的路徑是由下往上 7 → 8 → −5 → −2 → 5 → 1 → 2。我把上面的 DP 實作出來跑範例，得到 0 ✓。`,
    t: `1. 盤面是「由上往下」給的，但玩家是「由下往上」走。DP 的方向要想清楚，或乾脆先把列反轉。
2. 上下半部的相鄰關係不同：往上走進「比較寬」的列時是 {j, j+1}，走進「比較窄」的列時是 {j−1, j}。用兩列的寬度比較來判斷最不容易錯。
3. 第一個數字（最下面那一格）的符號固定是正的，之後每個數字才有 ± 的選擇。
4. 累積值會是負的，陣列要加偏移量（例如 +3000）。
5. N = 1 時只有一格，答案就是那個數字的絕對值。
6. 終止條件是 N = 0。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    const int OFF = 3000, SZ = 6001;
    int N;
    while (cin >> N && N != 0) {
        int R = 2 * N - 1;
        vector<vector<int> > row(R);
        for (int i = 0; i < R; i++) {
            int w = (i < N) ? (i + 1) : (2 * N - 1 - i);   // 由上往下的寬度
            row[i].resize(w);
            for (int j = 0; j < w; j++) cin >> row[i][j];
        }

        // 從最下面那一列開始往上推
        vector<vector<char> > cur(row[R - 1].size(), vector<char>(SZ, 0));
        for (size_t j = 0; j < row[R - 1].size(); j++)
            cur[j][row[R - 1][j] + OFF] = 1;                // 第一個數字符號固定為正

        for (int r = R - 2; r >= 0; r--) {
            int wCur = (int)row[r + 1].size(), wNext = (int)row[r].size();
            vector<vector<char> > nxt(wNext, vector<char>(SZ, 0));
            for (int j = 0; j < wCur; j++)
                for (int v = 0; v < SZ; v++) {
                    if (!cur[j][v]) continue;
                    int cand[2];
                    if (wNext > wCur) { cand[0] = j; cand[1] = j + 1; }   // 往上變寬
                    else { cand[0] = j - 1; cand[1] = j; }                // 往上變窄
                    for (int t = 0; t < 2; t++) {
                        int k = cand[t];
                        if (k < 0 || k >= wNext) continue;
                        int a = v + row[r][k], b = v - row[r][k];
                        if (a >= 0 && a < SZ) nxt[k][a] = 1;
                        if (b >= 0 && b < SZ) nxt[k][b] = 1;
                    }
                }
            cur = nxt;
        }

        int best = INT_MAX;
        for (size_t j = 0; j < cur.size(); j++)
            for (int v = 0; v < SZ; v++)
                if (cur[j][v]) best = min(best, abs(v - OFF));
        cout << best << "\\n";
    }
    return 0;
}`
  }
};

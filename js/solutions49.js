/* 三星第九批 —— 高 AC 經典題 */
const SOL49 = {
  '10081': {
    q: `給定字母表 {0, 1, ..., k}。若一個長度為 n 的字串中，任兩個相鄰字元的差都不超過 1，就稱它是「緊密的（tight）」。

請計算長度為 n 的所有字串中，緊密字串所佔的百分比。

輸入：多行，每行兩個整數 k n（1 ≤ k ≤ 9，1 ≤ n ≤ 100），讀到 EOF。
輸出：每行輸出百分比，小數點後保留 5 位。

範例輸入
4 1
2 5
3 5
8 7

範例輸出
100.00000
40.74074
17.38281
0.10130`,
    h: `一維 DP。

    dp[i][a] = 長度 i、最後一個字元是 a 的緊密字串個數
    dp[1][a] = 1（每個字母都可以當開頭）
    dp[i][b] = dp[i-1][b-1] + dp[i-1][b] + dp[i-1][b+1]   （越界的項不算）

答案 = (Σ_a dp[n][a]) / (k+1)^n × 100

數字會很大：k=9、n=100 時總數是 10^100，遠超 long long。但我們要的是「比例」，所以可以

  作法 A：直接用 double 存 dp（值最大約 10^100，double 上限 10^308，安全）。
  作法 B：在 DP 中就存機率——每一步除以 (k+1)，dp 全部落在 [0,1]。

兩種都能通過，作法 A 比較直觀。輸出用 printf 風格的固定 5 位小數（C++ 用 fixed << setprecision(5)）。

驗算（我用 JS 逐一核對過四組樣本）：
  k=4, n=1 → 所有 5 個字串都是緊密的 → 100.00000 ✓
  k=2, n=5 → 3^5 = 243 個字串中有 99 個緊密 → 40.74074 ✓
  k=3, n=5 → 17.38281 ✓
  k=8, n=7 → 0.10130 ✓`,
    t: `1. 字母表是 {0, 1, ..., k}，一共 k+1 個字母，不是 k 個。這個 off-by-one 是本題最常見的錯誤。
2. n = 1 時答案一定是 100.00000（單一字元沒有「相鄰」可言）。
3. 用 double 存 DP 沒問題，但別用 long long——k=9、n=100 會爆到 10^100。
4. 輸出必須固定 5 位小數，包含 100.00000 這種尾端的零，所以要用 fixed + setprecision(5)。
5. 輸入沒有測資數，讀到 EOF；而且順序是「k 先、n 後」。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout << fixed << setprecision(5);

    int k, n;
    while (cin >> k >> n) {
        // 字母表是 0..k 共 k+1 個
        vector<double> dp(k + 1, 1.0), nd(k + 1);
        for (int i = 2; i <= n; i++) {
            for (int b = 0; b <= k; b++) {
                double s = dp[b];
                if (b > 0) s += dp[b - 1];
                if (b < k) s += dp[b + 1];
                nd[b] = s;
            }
            dp = nd;
        }
        double tot = 0;
        for (int a = 0; a <= k; a++) tot += dp[a];
        cout << tot / pow((double)(k + 1), n) * 100.0 << "\\n";
    }
    return 0;
}`
  },

  '10400': {
    q: `英國某益智節目會給參賽者一串正整數與一個目標數。參賽者必須用「全部」這些數字、搭配 + − × ÷ 四種運算，組成一個算式使結果等於目標數。

三個限制：
  1. 數字必須「照輸入的順序」出現，每個恰好用一次；
  2. 算式從左到右計算，「不遵守先乘除後加減」；
  3. 只有在整除時才能用 ÷；而且每一步的中間結果必須落在 −32000 到 +32000 之間。

輸入：第一行是測資數。之後每行：先一個整數 p（數字個數，p < 100），接著 p 個正整數（都小於 32000），最後是目標數。
輸出：每筆輸出完整算式（含所有數字、運算子、等號與目標數），中間不能有空白。無解則輸出「NO EXPRESSION」。有多解時輸出任一個即可。

範例輸入
3
3 5 7 4 3
2 1 1 2000
5 12 2 5 1 2 4

範例輸出
5+7/4=3
NO EXPRESSION
12/2-5+1+2=4`,
    h: `狀態很單純：「已經用掉前 i 個數字、目前累積值是 v」。

因為中間結果被限制在 [−32000, 32000]，v 只有 64001 種可能，i 最多 100，總狀態數約 640 萬——可以用一張布林表跑「可達性 DP」。

    reach[0][a1] = true
    reach[i+1][v ⊕ a(i+2)] ← reach[i][v]，⊕ 走遍 + − × ÷

轉移時的檢查：
  - ÷ 只有在 v % a == 0 才允許（a > 0，題目保證輸入是正整數）
  - 結果必須落在 [−32000, 32000]，否則捨棄

輸出算式要回溯，所以除了 reach 之外還要記
    par[i][v]  = 上一步的值
    op[i][v]   = 用了哪個運算子
從 reach[p-1][target] 往回走，把數字與運算子倒著串起來再反轉。

注意「不遵守運算優先順序」讓這題變簡單了——若要遵守，狀態就複雜得多。

我用 JS 版跑過三組樣本：得到 5+7/4=3、NO EXPRESSION、12/2-5+1+2=4。第三個跟題目給的 12-2/5*1*2=4 不同，但題目明說任一組解都可以。`,
    t: `1. 中間值可以是「負數」（限制是 −32000 到 +32000），所以陣列要做偏移：index = v + 32000。只允許非負會漏解。
2. 除法的整除判斷：C++ 的 % 對負數的行為是「取商往零截斷」，v % a == 0 對負 v 仍然正確，可以放心用。
3. 每一步「都要」檢查範圍，不是只檢查最後結果。
4. 記憶體：100 × 64001 的 char 陣列約 6.4 MB，par 若用 short（值域 −32000..32000 剛好放得下）是 12.8 MB，通常可以接受。若吃緊，可以只存 op（1 byte）然後回溯時反推 par。
5. 輸出不能有空白，等號後面要接目標數。
6. p 可能是 1——那就只有一個數字，直接看它是否等於目標。`,
    c: `#include <bits/stdc++.h>
using namespace std;

const int OFF = 32000, SZ = 64001;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    const char* ops = "+-*/";

    while (T--) {
        int p;
        cin >> p;
        vector<int> a(p);
        for (int i = 0; i < p; i++) cin >> a[i];
        int target;
        cin >> target;

        vector<vector<char> > reach(p, vector<char>(SZ, 0));
        vector<vector<short> > par(p, vector<short>(SZ, 0));
        vector<vector<char> > opId(p, vector<char>(SZ, 0));

        if (a[0] >= -OFF && a[0] <= OFF) reach[0][a[0] + OFF] = 1;

        for (int i = 0; i + 1 < p; i++) {
            int v = a[i + 1];
            for (int x = -OFF; x <= OFF; x++) {
                if (!reach[i][x + OFF]) continue;
                for (int o = 0; o < 4; o++) {
                    long long y;
                    if (o == 0) y = (long long)x + v;
                    else if (o == 1) y = (long long)x - v;
                    else if (o == 2) y = (long long)x * v;
                    else {
                        if (v == 0 || x % v != 0) continue;   // 只有整除才能用 /
                        y = x / v;
                    }
                    if (y < -OFF || y > OFF) continue;         // 每一步都要在範圍內
                    int idx = (int)y + OFF;
                    if (!reach[i + 1][idx]) {
                        reach[i + 1][idx] = 1;
                        par[i + 1][idx] = (short)x;
                        opId[i + 1][idx] = (char)o;
                    }
                }
            }
        }

        if (target < -OFF || target > OFF || !reach[p - 1][target + OFF]) {
            cout << "NO EXPRESSION\\n";
            continue;
        }
        // 回溯：從最後一個數字往前串
        vector<string> part;
        int cur = target;
        for (int i = p - 1; i >= 1; i--) {
            part.push_back(to_string(a[i]));
            part.push_back(string(1, ops[(int)opId[i][cur + OFF]]));
            cur = par[i][cur + OFF];
        }
        part.push_back(to_string(a[0]));
        for (int i = (int)part.size() - 1; i >= 0; i--) cout << part[i];
        cout << "=" << target << "\\n";
    }
    return 0;
}`
  },

  '10502': {
    q: `給定一個 R 列 C 行的棋盤，可用格子標示為 '1'、不可用格子標示為 '0'。請計算棋盤上「完全由 '1' 組成」的長方形（含正方形）有幾個。

例如棋盤
    11
    01
中有 5 個：三個 1×1、一個 1×2（上排）、一個 2×1（右行）。

輸入：多筆測資。每筆先一行 R、再一行 C，接著 R 行、每行 C 個字元（'0' 或 '1'，中間沒有空白）。當 R 為 0 時結束。
輸出：每筆輸出一行答案。

範例輸入
2
2
11
01
4
3
110
101
111
011
0

範例輸出
5
22`,
    h: `棋盤最多 100×100，可以用「枚舉上下邊界 + 掃描」的 O(R²·C) 作法。

    for r1 = 0 .. R-1
        for r2 = r1 .. R-1
            run = 0
            for c = 0 .. C-1
                if 第 c 行在 [r1, r2] 這幾列全都是 '1'
                    run++, ans += run
                else
                    run = 0

為什麼 ans += run？因為以第 c 行為右邊界、上下界固定為 (r1, r2) 的合法長方形，左邊界可以是最近的 run 個連續合法行的任何一個。

「第 c 行在 [r1,r2] 全是 1」可以用「每行的向下連續 1 長度」或直接用前綴和 O(1) 判斷：
    col[r][c] = 第 c 行從第 0 列到第 r 列的 '1' 個數
    全 1 ⟺ col[r2][c] − col[r1-1][c] == r2 − r1 + 1

複雜度 100 × 100 × 100 = 10^6，非常快。

驗算（我用 JS 實測）：
  2×2 的 11/01 → 5 ✓
  4×3 的 110/101/111/011 → 22 ✓`,
    t: `1. 輸入的 R 與 C 是分成「兩行」給的，不是同一行——照著 cin >> R >> C 讀其實也對（>> 會跨行），但別用 getline 讀 R 就以為同一行還有 C。
2. 終止條件是 R 為 0（第一個維度是 0），讀到就結束、不要再讀 C 與棋盤。
3. 答案可能很大：100×100 全是 1 時有 C(101,2)² = 5050² ≈ 2.55×10^7，int 還夠，但用 long long 保險。
4. 棋盤那幾行是「連續字元」沒有空白，要用 string 整行讀。
5. 「含正方形」——正方形也要算進去，不要像 10177 那樣扣掉。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int R, C;
    while (cin >> R && R != 0) {
        cin >> C;
        vector<string> g(R);
        for (int i = 0; i < R; i++) cin >> g[i];

        // pre[r][c]：第 c 行前 r 列的 '1' 個數
        vector<vector<int> > pre(R + 1, vector<int>(C, 0));
        for (int r = 0; r < R; r++)
            for (int c = 0; c < C; c++)
                pre[r + 1][c] = pre[r][c] + (g[r][c] == '1' ? 1 : 0);

        long long ans = 0;
        for (int r1 = 0; r1 < R; r1++)
            for (int r2 = r1; r2 < R; r2++) {
                int h = r2 - r1 + 1;
                long long run = 0;
                for (int c = 0; c < C; c++) {
                    if (pre[r2 + 1][c] - pre[r1][c] == h) { run++; ans += run; }
                    else run = 0;
                }
            }
        cout << ans << "\\n";
    }
    return 0;
}`
  },

  '11367': {
    q: `旅遊時各城市的油價不同，聰明地選擇加油地點可以省錢。所有車都是「每走 1 單位距離耗 1 單位油」，出發時油箱是空的。

請找出從起點城市到終點城市的最便宜走法（沿途可以加油）。

輸入：第一行是 n m（城市數 n ≤ 1000、道路數 m ≤ 10000）。第二行是 n 個整數，第 i 個是城市 i 的每單位油價（≤ 100）。接著 m 行，每行三個整數 u v d，表示 u 與 v 之間有一條長度 d（≤ 100）的雙向道路。再來一行是查詢數 q（≤ 100），接著 q 行，每行三個整數 c s e：油箱容量 c（≤ 100）、起點 s、終點 e。
輸出：每個查詢輸出最便宜的花費；若到不了就輸出「impossible」。

範例輸入
5 5
10 10 20 12 13
0 1 9
0 2 8
1 2 1
1 3 11
2 3 7
2
10 0 3
20 1 4

範例輸出
170
impossible`,
    h: `把「城市 + 目前油量」當成一個節點做 Dijkstra，這是分層圖最短路的經典題。

    狀態 (u, f)：人在城市 u、油箱裡還有 f 單位油（0 ≤ f ≤ c）
    dist[u][f] = 到達這個狀態的最低花費

兩種轉移：
  1. 加 1 單位油：(u, f) → (u, f+1)，花費 price[u]（需 f + 1 ≤ c）
  2. 走一條路：(u, f) → (v, f − d)，花費 0（需 f ≥ d）

起點是 (s, 0)（油箱空的），到任何 (e, *) 就是答案。

狀態數 = n × (c+1) ≤ 1000 × 101 ≈ 10 萬，邊數約 10 萬 × 常數，Dijkstra 用 priority_queue 完全來得及。100 個查詢就跑 100 次。

「一次加 1 單位」看起來很笨，但正是它讓轉移變得簡單且不會漏掉最佳解——因為加油的花費是線性的，逐單位加與一次加多少完全等價。

範例驗算：0 →(8)→ 2 →(7)→ 3，容量 10。
  在城市 0 加 10 單位（每單位 10）花 100，走到 2 剩 2 單位；
  在城市 2 加 5 單位（每單位 20）花 100… 這樣是 200。
  更好的走法：在 0 只加 8 單位（80），到 2 剩 0；在 2 加 7 單位（140）→ 220。
  最佳是 0 →(9)→ 1 →(11)→ 3：在 0 加 9（90），到 1 剩 0；在 1 加 11 > 容量 10，不行。
  實際最佳解是 170，Dijkstra 會自動找到（在 0 加滿 10 花 100，走 8 到 2 剩 2，再在 2… ）——重點是不用手推，交給演算法。`,
    t: `1. 出發時油箱是「空的」，所以起點狀態是 (s, 0) 而不是 (s, c)。
2. 容量 c 可能大於任何一條路的長度，但也可能小到走不過去——那就是 impossible。
3. dist 陣列每次查詢都要重設。n × (c+1) 最多 1000 × 101，用 vector 重新配置或 memset 都可以，但別忘了。
4. 費用上限：最多走 1000 個城市 × 100 容量 × 100 單價 = 10^7，int 夠用，long long 更保險。
5. 到達終點時「油箱裡剩多少油」不重要，只要 u == e 就可以停（Dijkstra 第一次彈出 e 的任何狀態即為答案）。
6. 城市編號從 0 開始。`,
    c: `#include <bits/stdc++.h>
using namespace std;

typedef pair<int, int> PII;          // (花費, 狀態編號)

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    while (cin >> n >> m) {
        vector<int> price(n);
        for (int i = 0; i < n; i++) cin >> price[i];
        vector<vector<PII> > adj(n);  // (鄰居, 距離)
        for (int i = 0; i < m; i++) {
            int u, v, d;
            cin >> u >> v >> d;
            adj[u].push_back(PII(v, d));
            adj[v].push_back(PII(u, d));
        }
        int q;
        cin >> q;
        while (q--) {
            int c, s, e;
            cin >> c >> s >> e;

            const int INF = 1e9;
            // dist[u * (c+1) + f]
            vector<int> dist((size_t)n * (c + 1), INF);
            priority_queue<PII, vector<PII>, greater<PII> > pq;
            dist[(size_t)s * (c + 1) + 0] = 0;          // 出發時油箱是空的
            pq.push(PII(0, s * (c + 1) + 0));

            int ans = -1;
            while (!pq.empty()) {
                PII top = pq.top(); pq.pop();
                int cost = top.first, id = top.second;
                if (cost > dist[id]) continue;          // 惰性刪除
                int u = id / (c + 1), f = id % (c + 1);
                if (u == e) { ans = cost; break; }

                // 加 1 單位油
                if (f + 1 <= c) {
                    int nid = u * (c + 1) + f + 1, nc = cost + price[u];
                    if (nc < dist[nid]) { dist[nid] = nc; pq.push(PII(nc, nid)); }
                }
                // 走一條路
                for (size_t k = 0; k < adj[u].size(); k++) {
                    int v = adj[u][k].first, d = adj[u][k].second;
                    if (f < d) continue;
                    int nid = v * (c + 1) + (f - d);
                    if (cost < dist[nid]) { dist[nid] = cost; pq.push(PII(cost, nid)); }
                }
            }
            if (ans < 0) cout << "impossible\\n";
            else cout << ans << "\\n";
        }
    }
    return 0;
}`
  },

  '10912': {
    q: `一種很單純的雜湊：把字母 a..z 分別對應到 1..26，字串的雜湊值就是各字元對應值的總和。例如 "acm" → 1 + 3 + 13 = 17，"adl" 也是 17（碰撞）。

請計算：長度為 L、雜湊值恰好為 S 的字串有幾個？只考慮「全部由小寫字母組成、且字母嚴格遞增」的字串。

輸入：多筆測資，每筆兩個整數 L S（0 < L, S < 10000）。以兩個 0 結束。
輸出：每筆輸出「Case #: 答案」。答案保證在 32 位元有號整數範圍內。

範例輸入
3 10
2 3
0 0

範例輸出
Case 1: 4
Case 2: 1`,
    h: `「字母嚴格遞增」等價於「從 {1, 2, ..., 26} 中選出一個大小為 L 的子集合」，因為選好之後排列順序就唯一確定了。

所以問題變成：從 1..26 中選 L 個相異數字，使其總和為 S，有幾種選法？

三維 DP（可壓成二維）：
    dp[i][l][s] = 只考慮數字 1..i、已選 l 個、總和 s 的方法數
    dp[i][l][s] = dp[i-1][l][s]              （不選 i）
                + dp[i-1][l-1][s-i]          （選 i）
    dp[i][0][0] = 1

答案 = dp[26][L][S]。

範圍：L > 26 一定是 0；S > 1+2+...+26 = 351 也一定是 0。所以表格只要 26 × 27 × 352，非常小，打一次表所有測資查表即可。

驗算（我用 JS 實測）：
  L=3, S=10 → {1,2,7}, {1,3,6}, {1,4,5}, {2,3,5} 共 4 ✓
  L=2, S=3  → {1,2} 共 1 ✓`,
    t: `1. L > 26 或 S > 351 必須直接回答 0，否則陣列會越界。題目說 L、S 可到 9999。
2. 「嚴格遞增」是關鍵——它把「排列」問題變成「組合」問題。若沒注意，會誤以為要考慮字母順序而算出過大的答案。
3. 也不要漏了 L 個字母彼此必須相異（嚴格遞增自然保證相異）。
4. 輸出格式是「Case 1: 4」——Case 後有空白、編號後接冒號再一個空白。
5. 終止條件是「0 0」兩個都是 0。
6. 打表一次就好，別每筆測資重跑 DP。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    const int MAXS = 351;               // 1+2+...+26
    // dp[l][s]：從 1..26 選 l 個、總和 s 的方法數
    static long long dp[27][MAXS + 1];
    memset(dp, 0, sizeof(dp));
    dp[0][0] = 1;
    for (int v = 1; v <= 26; v++)                 // 逐一考慮數字 v
        for (int l = 26; l >= 1; l--)             // 倒著跑，確保每個 v 只用一次
            for (int s = MAXS; s >= v; s--)
                dp[l][s] += dp[l - 1][s - v];

    int L, S, cs = 1;
    while (cin >> L >> S && (L || S)) {
        long long ans = (L > 26 || S > MAXS) ? 0 : dp[L][S];
        cout << "Case " << cs++ << ": " << ans << "\\n";
    }
    return 0;
}`
  },

  '10012': {
    q: `Ian 要搬家，得把他收藏的圓形物件裝進一個長方形箱子。所有圓都必須「碰到箱子底部」。請求出能裝下所有圓的最小箱子寬度。

（在最佳排法中，每個圓應該至少碰到另一個圓。）

輸入：第一行是測資數 N（≤ 50）。接下來每行：先是一個正整數 n（圓的個數，n ≤ 8），接著是 n 個半徑（不一定是整數）。
輸出：每筆輸出最小長方形的寬度，小數點後三位。

範例輸入
3
3 2.0 1.0 2.0
4 2.0 2.0 2.0 2.0
3 2.0 1.0 4.0

範例輸出
9.657
16.000
12.657`,
    h: `n ≤ 8，直接枚舉所有排列（8! = 40320），對每個排列算出寬度取最小。

給定一個左到右的順序後，每個圓的圓心 x 座標「盡量往左靠」：
  x[0] = r[0]
  x[j] = max( r[j],  max over i<j of ( x[i] + 2·√(r[i]·r[j]) ) )

那個 2√(ri·rj) 是關鍵：兩個都碰到底部、且外切的圓，圓心水平距離是
    √((ri+rj)² − (ri−rj)²) = √(4·ri·rj) = 2√(ri·rj)
（垂直距離是 ri − rj，圓心距是 ri + rj，用畢氏定理得出。）

注意 x[j] 要跟「所有」前面的圓比較，不能只跟前一個比——一個小圓可能「躲」在兩個大圓之間卻被更前面的大圓擋住。

最後寬度 = max(x[i] + r[i]) − min(x[i] − r[i])。

驗算（我用 JS 跑過三組樣本）：9.657 / 16.000 / 12.657 全中 ✓
  第一組 [2,1,2]：最佳順序把小圓放中間，2 + 2√2 + 2√2 + 2 = 4 + 4√2 ≈ 9.657 ✓`,
    t: `1. 一定要比較「所有」前面的圓，只比前一個會 WA（大-小-大 的情形就會錯）。
2. 別忘了 x[j] 至少是 r[j]（不能突出箱子左邊）。同理最後算寬度時要用 min(x−r) 而不是假設為 0。
3. n ≤ 8，8! = 40320 × 50 組 × O(n²) ≈ 1.6×10^7，時間充裕；用 next_permutation 最省事。
4. 輸出固定三位小數，包含 16.000 這種尾零，用 fixed << setprecision(3)。
5. 半徑是浮點數，讀入用 double。
6. n = 1 時答案就是 2r。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout << fixed << setprecision(3);

    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        int n;
        cin >> n;
        vector<double> r(n);
        for (int i = 0; i < n; i++) cin >> r[i];

        vector<int> idx(n);
        for (int i = 0; i < n; i++) idx[i] = i;
        sort(idx.begin(), idx.end());

        double best = 1e18;
        do {
            vector<double> x(n);
            for (int j = 0; j < n; j++) {
                double p = r[idx[j]];
                // 要跟「所有」前面的圓比較，不能只看前一個
                for (int i = 0; i < j; i++)
                    p = max(p, x[i] + 2.0 * sqrt(r[idx[i]] * r[idx[j]]));
                x[j] = p;
            }
            double lo = 1e18, hi = -1e18;
            for (int j = 0; j < n; j++) {
                lo = min(lo, x[j] - r[idx[j]]);
                hi = max(hi, x[j] + r[idx[j]]);
            }
            best = min(best, hi - lo);
        } while (next_permutation(idx.begin(), idx.end()));

        cout << best << "\\n";
    }
    return 0;
}`
  },

  '11770': {
    q: `Ronju 是夜班警衛，每天要把場地上所有的燈打開。他把開關換成了光感應觸發器：某盞燈亮起後，會自動觸發附近某些燈也亮起，如此連鎖下去。

給定「燈 a 亮起會觸發燈 b」的關係（有方向性），請問 Ronju 最少要手動打開幾盞燈，才能讓全部的燈都亮？

輸入：第一行是測資數。每組第一行是兩個整數 n m（燈數 n ≤ 10000、關係數 m ≤ 100000），接著 m 行，每行兩個整數 a b，表示 a 亮會觸發 b。每組測資後面有一個空行。
輸出：每組印一行「Case k: x」，x 是最少手動開啟的燈數。

範例輸入
2
5 4
1 2
1 3
3 4
5 3

4 4
1 2
1 3
4 2
4 3

範例輸出
Case 1: 2
Case 2: 2`,
    h: `有向圖上的經典題：先縮強連通分量（SCC），再數「入度為 0 的分量」有幾個。

為什麼？
  - 同一個 SCC 內任兩盞燈互相可達，只要點亮其中一盞，整個分量都會亮。
  - 把每個 SCC 縮成一點後得到 DAG。DAG 上入度為 0 的點沒有任何外來的觸發來源，一定要手動點；
  - 反之，入度不為 0 的分量必定能被某個入度為 0 的分量沿路徑點亮（DAG 沒有環，往回走一定會走到入度 0 的點）。
  所以答案就是「縮點後入度為 0 的分量數」。

用 Tarjan 或 Kosaraju 求 SCC 都可以，n ≤ 10000、m ≤ 100000 都很輕鬆。Tarjan 是單次 DFS，但要注意遞迴深度（10000 層通常沒問題，保險可改成迭代版）。

計算入度：對每條原邊 (a, b)，若 comp[a] != comp[b]，就把 comp[b] 的入度 +1（重複計數不影響「是否為 0」的判斷）。

範例驗算：
  第一組 1→2, 1→3, 3→4, 5→3：沒有環，SCC 就是各點自己。入度 0 的是 1 和 5 → 答案 2 ✓
  第二組 1→2, 1→3, 4→2, 4→3：入度 0 的是 1 和 4 → 答案 2 ✓`,
    t: `1. 這是有向圖，不能用並查集數連通塊（那是無向圖的作法，會把答案算成連通塊數而錯）。
2. 必須先縮 SCC 再數入度 0；直接數原圖入度 0 的點是錯的（一個環上所有點入度都不是 0，卻仍需要手動點一盞）。
3. n 可到 10000、m 到 100000，Tarjan 遞迴深度最壞 10000 層，一般沒問題；若怕爆堆疊可以寫迭代版或用 Kosaraju。
4. 每組測資後面有空行，用 >> 讀數字會自動跳過，不必特別處理。
5. 可能有孤立的燈（沒有任何邊）——它自成一個 SCC 且入度 0，會被正確算進去。
6. 輸出格式是「Case 1: 2」。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int n, m;
vector<vector<int> > adj, radj;
vector<int> order_, comp_;
vector<char> vis;

void dfs1(int s) {                        // 迭代版，避免遞迴太深
    vector<pair<int, int> > st;
    st.push_back(make_pair(s, 0));
    vis[s] = 1;
    while (!st.empty()) {
        int u = st.back().first;
        int& i = st.back().second;
        if (i < (int)adj[u].size()) {
            int v = adj[u][i++];
            if (!vis[v]) { vis[v] = 1; st.push_back(make_pair(v, 0)); }
        } else {
            order_.push_back(u);
            st.pop_back();
        }
    }
}

void dfs2(int s, int c) {
    vector<int> st(1, s);
    comp_[s] = c;
    while (!st.empty()) {
        int u = st.back(); st.pop_back();
        for (size_t k = 0; k < radj[u].size(); k++) {
            int v = radj[u][k];
            if (comp_[v] < 0) { comp_[v] = c; st.push_back(v); }
        }
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    for (int tc = 1; tc <= T; tc++) {
        cin >> n >> m;
        adj.assign(n + 1, vector<int>());
        radj.assign(n + 1, vector<int>());
        vector<pair<int, int> > edges(m);
        for (int i = 0; i < m; i++) {
            int a, b;
            cin >> a >> b;
            adj[a].push_back(b);
            radj[b].push_back(a);
            edges[i] = make_pair(a, b);
        }

        // Kosaraju：第一遍記完成順序，第二遍在反圖上分組
        order_.clear();
        vis.assign(n + 1, 0);
        for (int i = 1; i <= n; i++) if (!vis[i]) dfs1(i);

        comp_.assign(n + 1, -1);
        int nc = 0;
        for (int i = (int)order_.size() - 1; i >= 0; i--)
            if (comp_[order_[i]] < 0) dfs2(order_[i], nc++);

        vector<int> indeg(nc, 0);
        for (int i = 0; i < m; i++) {
            int ca = comp_[edges[i].first], cb = comp_[edges[i].second];
            if (ca != cb) indeg[cb]++;
        }
        int ans = 0;
        for (int i = 0; i < nc; i++) if (indeg[i] == 0) ans++;

        cout << "Case " << tc << ": " << ans << "\\n";
    }
    return 0;
}`
  },

  '11420': {
    q: `五斗櫃有一疊垂直排列的抽屜，每個抽屜可以上鎖或不上鎖。但「上鎖」不代表「安全」：如果某個抽屜上了鎖，但它「正上方」那個抽屜沒上鎖，別人只要把上面那個抽屜抽出來就能拿到它——所以它不算安全。

也就是說：抽屜 i 安全 ⟺ 抽屜 i 上鎖，且（i 是最上面那個，或抽屜 i−1 也上鎖）。

給定抽屜總數 n 與希望安全的數量 k，請問有幾種上鎖組合能讓「恰好」k 個抽屜是安全的？

輸入：多行，每行兩個整數 n k（0 ≤ n ≤ 65，0 ≤ k ≤ 65）。以兩個負數結束。
輸出：每行輸出對應的組合數。

範例輸入
6 2
6 3
6 4
-1 -1

範例輸出
16
9
6`,
    h: `帶狀態的計數 DP。

    dp[i][j][s] = 前 i 個抽屜中恰好有 j 個安全、且第 i 個抽屜的上鎖狀態是 s（0 = 沒鎖、1 = 上鎖）的組合數

轉移到第 i+1 個抽屜：
  - 不上鎖：安全數不變，新狀態 0
        dp[i+1][j][0] += dp[i][j][0] + dp[i][j][1]
  - 上鎖：是否安全看上一個是否上鎖
        從 s=1 來 → 安全，dp[i+1][j+1][1] += dp[i][j][1]
        從 s=0 來 → 不安全，dp[i+1][j][1] += dp[i][j][0]

初始（把「第 0 個抽屜」當成虛擬的、視為沒上鎖）：
        dp[0][0][0] = 1
這樣第 1 個抽屜上鎖時會走「從 s=0 來」那條路而被判為不安全——但題目說最上面那個上鎖就安全，所以第 1 個抽屜要特判成安全。

答案 = dp[n][k][0] + dp[n][k][1]。

n ≤ 65，答案可能很大：n=65 時總組合數是 2^65 > 2^64，所以要用 unsigned long long 或大數。實務上分到各個 k 之後不會爆 unsigned long long，用它就好。

驗算（我用 JS 實測）：
  n=6, k=2 → 16
  n=6, k=3 → 9
  n=6, k=4 → 6 ✓（題目敘述明說「恰好四個安全有六種方式」）`,
    t: `1. 最上面那個抽屜「只要上鎖就安全」，這是唯一的特例。忘了它會讓答案偏小。
2. 「恰好 k 個」不是「至少 k 個」。
3. n 可到 65，2^65 超過 64 位元有號整數。用 unsigned long long（上限 1.8×10^19 > 3.7×10^19？其實 2^65 = 3.7×10^19 也超過），但因為答案是「恰好 k 個」的分配數，最大的那一項約 C 級數量，實測不會超過 unsigned long long。保險做法是用 unsigned long long 並確認 n=65 時各項都沒溢位。
4. k 可能大於 n——直接答 0（陣列別越界）。
5. n = 0 時只有「空組合」，k = 0 的答案是 1、其餘是 0。
6. 終止條件是「兩個負數」，不是 0（0 是合法輸入）。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    const int N = 65;
    // dp[i][j][s]：前 i 個抽屜、恰好 j 個安全、第 i 個的上鎖狀態 s
    static unsigned long long dp[N + 1][N + 2][2];
    memset(dp, 0, sizeof(dp));
    dp[0][0][0] = 1;                      // 虛擬的第 0 個，視為沒上鎖
    for (int i = 0; i < N; i++)
        for (int j = 0; j <= N; j++)
            for (int s = 0; s < 2; s++) {
                unsigned long long v = dp[i][j][s];
                if (!v) continue;
                dp[i + 1][j][0] += v;                       // 不上鎖
                // 上鎖：第 1 個抽屜只要上鎖就安全；其餘要看上一個
                bool secure = (i == 0) ? true : (s == 1);
                dp[i + 1][j + (secure ? 1 : 0)][1] += v;
            }

    int n, k;
    while (cin >> n >> k) {
        if (n < 0 || k < 0) break;
        unsigned long long ans = (k > n) ? 0ULL : dp[n][k][0] + dp[n][k][1];
        cout << ans << "\\n";
    }
    return 0;
}`
  },

  '10112': {
    q: `考古學家在「能量場」中發現許多文物，能量場是一塊不到 100 公尺見方的區域，裡面立著 4 到 15 座紀念碑。文物多半出土於三座紀念碑圍成的三角形內，這個三角形叫「能量三角形」。

能量三角形的定義是：在所有以紀念碑為頂點的三角形中，面積最大、且「內部與邊界上都沒有其他紀念碑」的那一個。

輸入：多組能量場。每組第一行是紀念碑數（4 ~ 15），接著每行一座紀念碑：一個大寫字母標籤與兩個整數座標。以 0 結束。
輸出：每組輸出一行，三個頂點的標籤依字母順序排好、中間不加空白。

範例輸入
6
A 1 0
B 4 0
C 0 3
D 1 3
E 4 4
F 0 6
4
A 0 0
B 1 0
C 99 0
D 99 99
0

範例輸出
BEF
BCD`,
    h: `紀念碑最多 15 座，三角形只有 C(15,3) = 455 個，對每個三角形檢查「其他 12 個點是否在裡面」也只要 455 × 12 次判斷——直接暴力。

兩個幾何工具：
1. 三角形面積（用外積，取兩倍面積避免除法與浮點）：
       area2 = |(B−A) × (C−A)|
   比較大小時用 area2 就好，不用真的除以 2。

2. 點 P 是否在三角形 ABC 的內部或邊界上：
   算三個外積 cross(A,B,P)、cross(B,C,P)、cross(C,A,P)。
   若三者「同號或為 0」（也就是沒有一正一負），P 就在三角形內或邊上。

演算法：
  best = 0
  for 每個三元組 (i, j, k)：
      若面積為 0（共線）跳過
      若存在其他點在三角形內或邊界上 → 跳過
      若面積 > best → 更新答案（三個標籤排序後串起來）

「邊界上」也算違規，所以外積為 0 的情形要判為「在裡面」。

複雜度完全不是問題，重點是幾何判斷要寫對。`,
    t: `1. 「邊界上」的點也算在三角形內，必須排除該三角形。用「三個外積沒有一正一負」的判準時，外積為 0 要視為滿足條件。
2. 面積用「兩倍面積的整數值」比較，不要開浮點——座標是整數，全程用 long long 可以完全避開精度問題。
3. 輸出的三個標籤要「依字母順序」排好，不是照輸入順序。
4. 標籤是單一大寫字母，讀入用 char 或 string 都行；座標可能是負數嗎？題目說是不到 100 公尺見方的區域，範例中有 99，保守起見用 int 讀。
5. 終止條件是紀念碑數為 0。
6. 題目保證一定存在合法的能量三角形嗎？沒明說，但測資都有解；保險起見 best 初始化為 0 並允許最後沒找到時不輸出（實務上不會發生）。`,
    c: `#include <bits/stdc++.h>
using namespace std;

long long cross(long long ax, long long ay, long long bx, long long by,
                long long cx, long long cy) {
    return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    while (cin >> n && n != 0) {
        vector<string> lab(n);
        vector<long long> X(n), Y(n);
        for (int i = 0; i < n; i++) cin >> lab[i] >> X[i] >> Y[i];

        long long best = 0;
        string ans;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                for (int k = j + 1; k < n; k++) {
                    long long a2 = llabs(cross(X[i], Y[i], X[j], Y[j], X[k], Y[k]));
                    if (a2 == 0) continue;                       // 共線
                    bool clean = true;
                    for (int p = 0; p < n && clean; p++) {
                        if (p == i || p == j || p == k) continue;
                        long long c1 = cross(X[i], Y[i], X[j], Y[j], X[p], Y[p]);
                        long long c2 = cross(X[j], Y[j], X[k], Y[k], X[p], Y[p]);
                        long long c3 = cross(X[k], Y[k], X[i], Y[i], X[p], Y[p]);
                        bool hasPos = (c1 > 0) || (c2 > 0) || (c3 > 0);
                        bool hasNeg = (c1 < 0) || (c2 < 0) || (c3 < 0);
                        // 沒有一正一負 → 在內部或邊界上，此三角形不合格
                        if (!(hasPos && hasNeg)) clean = false;
                    }
                    if (!clean) continue;
                    if (a2 > best) {
                        best = a2;
                        vector<string> t;
                        t.push_back(lab[i]); t.push_back(lab[j]); t.push_back(lab[k]);
                        sort(t.begin(), t.end());
                        ans = t[0] + t[1] + t[2];
                    }
                }
        cout << ans << "\\n";
    }
    return 0;
}`
  },

  '11310': {
    q: `蛋糕師傅只做兩種形狀的蛋糕：面積 1 的正方形（1×1），以及面積 3 的 L 形（2×2 少一格，四種方向都算不同擺法）。

盒子固定寬 2 單位、長度不一。請問把蛋糕塞滿一個 2×n 的盒子，有幾種不同的裝法？（長度 2 的盒子有 5 種裝法。）

輸入：第一行是盒子長度的種數。接下來每行一個整數 n（1 ≤ n ≤ 40）。
輸出：每行輸出對應的裝法數。答案保證小於 10^18。

範例輸入
2
1
2

範例輸出
1
5`,
    h: `可以寫輪廓線 DP，但這題有漂亮的線性遞迴：

    f(n) = f(n-1) + 4·f(n-2) + 2·f(n-3)
    f(0) = 1, f(1) = 1, f(2) = 5

直觀解釋（看最左邊那一段怎麼填滿）：
  - 用兩個 1×1 填滿第一欄 → 剩下 2×(n−1)，貢獻 f(n-1)
  - 用「一個 L 形 + 一個 1×1」把前兩欄填滿 → 有 4 種擺法，貢獻 4·f(n-2)
  - 用「兩個 L 形」把前三欄填滿 → 有 2 種擺法，貢獻 2·f(n-3)
（兩個 L 形也可以剛好填滿 2×3 的區塊，那正是那個係數 2 的來源。）

我用暴力回溯程式驗證過前 12 項：
    1, 5, 11, 33, 87, 241, 655, 1793, 4895, 13377, 36543, 99841
並且用程式搜尋確認遞迴係數就是 (1, 4, 2)，前 12 項全部吻合。

n = 40 時 f(40) 約 10^17，unsigned long long 放得下（題目也保證小於 10^18）。

如果不想推遞迴，寫 2×n 的輪廓線 DP 也完全可行：狀態是「目前處理到第幾格 + 右邊突出的形狀遮罩」，n ≤ 40 秒殺。`,
    t: `1. L 形有「四種方向」，都要算成不同的擺法。只算一種方向會嚴重少算。
2. 遞迴用到 f(n-3)，初始值要給到 f(0)、f(1)、f(2)。f(0) = 1（空盒子有一種裝法）是關鍵邊界，設成 0 會全錯。
3. 答案接近 10^18，一定要用 unsigned long long 或 long long（long long 上限 9.2×10^18，夠用）。
4. 別忘了「1×1 正方形」可以隨便放，所以答案遠比純骨牌鋪法多。
5. n ≤ 40，打表一次即可。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    unsigned long long f[45];
    f[0] = 1; f[1] = 1; f[2] = 5;
    for (int n = 3; n <= 40; n++)
        f[n] = f[n - 1] + 4ULL * f[n - 2] + 2ULL * f[n - 3];

    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        int n;
        cin >> n;
        cout << f[n] << "\\n";
    }
    return 0;
}`
  },

  '11327': {
    q: `考慮下面這個列舉 0 到 1 之間所有有理數的方法：

    for d = 1 to infinity:
        for n = 0 to d:
            if gcd(n, d) == 1:
                print n/d

序列的開頭長這樣：
    0/1  1/1  1/2  1/3  2/3  1/4  3/4  1/5  2/5  3/5  4/5  1/6  5/6  1/7 ...

給定 k，請輸出第 k 個印出來的分數。

輸入：多筆測資，每行一個整數 k（1 ≤ k ≤ 12158598919）。以 0 結束。
輸出：每筆輸出「n/d」。

範例輸入
1
2
3
12158598919
0

範例輸出
0/1
1/1
1/2
199999/200000`,
    h: `先算「分母為 d 的分數有幾個」：

  d = 1：n 可以是 0 或 1（gcd(0,1) = gcd(1,1) = 1），共 2 個
  d ≥ 2：n = 0 與 n = d 的 gcd 都是 d ≠ 1，所以 n 只能取 1..d−1 且與 d 互質 → 恰好是 φ(d) 個

於是累積個數
    cum[D] = 2 + Σ_{d=2..D} φ(d)

k 的上限是 12158598919 ≈ 1.216×10^10。因為 Σφ(d) ≈ 3D²/π²，要覆蓋 1.216×10^10 需要 D ≈ 2×10^5。實測 cum[200000] ≈ 1.216×10^10，剛好夠（所以樣本的答案分母是 200000，這不是巧合，是題目刻意設計的邊界）。

演算法：
1. 線性篩或埃氏篩求 φ(1..200005)，同時累積 cum（用 long long 或 unsigned long long）。
2. 對每個 k，二分搜尋找最小的 d 使 cum[d] ≥ k。
3. offset = k − cum[d−1]，然後在 1..d−1 中找第 offset 個與 d 互質的 n（d = 1 時特判：offset 1 → 0/1，offset 2 → 1/1）。

第 3 步最壞要掃 2×10^5 次 gcd，但測資筆數不多，完全來得及。

我用 JS 完整實作驗證過：k = 1..8 得到 0/1, 1/1, 1/2, 1/3, 2/3, 1/4, 3/4, 1/5，與題目給的序列完全一致；k = 12158598919 得到 199999/200000 ✓`,
    t: `1. d = 1 是特例（有 2 個分數，不是 φ(1) = 1 個），因為 0/1 也被印出來。漏掉會讓所有答案偏移一位。
2. 篩的上限要到 200005 左右。開太小會找不到答案、開太大浪費記憶體（不過 2×10^5 的 int 陣列只有 800 KB，開到 3×10^5 也無妨）。
3. cum 的總和超過 40 億，一定要用 long long（unsigned int 會溢位）。
4. k 本身也超過 32 位元，讀入要用 long long。
5. 終止條件是 k = 0。
6. 埃氏篩求 φ 的寫法：phi[i] = i 初始化，對每個質數 p 把所有倍數 m 做 phi[m] -= phi[m] / p。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    const int N = 200005;
    vector<int> phi(N + 1);
    for (int i = 0; i <= N; i++) phi[i] = i;
    for (int p = 2; p <= N; p++)
        if (phi[p] == p)                            // p 是質數
            for (int m = p; m <= N; m += p) phi[m] -= phi[m] / p;

    // cum[d] = 分母 1..d 一共印出幾個分數；d = 1 特殊，有 0/1 與 1/1 兩個
    vector<long long> cum(N + 1, 0);
    for (int d = 1; d <= N; d++)
        cum[d] = cum[d - 1] + (d == 1 ? 2 : phi[d]);

    long long k;
    while (cin >> k && k != 0) {
        int lo = 1, hi = N;
        while (lo < hi) {                            // 找最小的 d 使 cum[d] >= k
            int mid = lo + (hi - lo) / 2;
            if (cum[mid] >= k) hi = mid; else lo = mid + 1;
        }
        int d = lo;
        long long off = k - cum[d - 1];              // 在分母 d 之中排第 off 個

        if (d == 1) {
            cout << (off == 1 ? "0/1" : "1/1") << "\\n";
            continue;
        }
        long long c = 0;
        for (int n = 1; n < d; n++)
            if (__gcd(n, d) == 1) {
                if (++c == off) { cout << n << "/" << d << "\\n"; break; }
            }
    }
    return 0;
}`
  },

  '12376': {
    q: `把一個人的人生階段畫成圖：有 n 個節點（編號 0 到 n−1），邊代表可以從一個階段前進到另一個階段。第 0 個節點是起點，圖中沒有環（不能回到過去）。

每個節點附有一個數值，代表「走進這個節點會學到多少單位」。第 0 個節點的值固定是 0。

這個人沒辦法預知未來——站在節點 u 時，他只看得到「u 有邊指向的那些節點」的數值。他總是選數值最大的那一個前進。題目保證從任一節點出發，數值最大的下一個節點都是唯一的。他可以在任何階段停下，但他會盡量學更多（也就是走到不能走為止）。

請輸出他總共學到多少單位，以及最後停在哪個節點。

輸入：第一行是測資數 T（≤ 100）。每組測資前有一個空行。接著一行兩個整數 n m（節點數、邊數）。下一行是 n 個整數，是各節點的數值（1 ~ 1000，但第 0 個是 0）。接著 m 行，每行兩個整數 u v，表示有一條 u → v 的有向邊。
輸出：每組印「Case k: 總學習量 結束節點」。

範例輸入
1

6 6
0 8 9 2 7 5
5 4
5 3
1 5
0 1
0 2
2 1

範例輸出
Case 1: 29 4`,
    h: `這題看起來像 DAG 最長路，其實不是——因為那個人是「短視的貪心」，走法是唯一確定的，所以只要照著模擬走一遍就好。

演算法：
    cur = 0, total = 0
    while cur 有出邊:
        next = cur 的所有鄰居中數值最大的那個
        total += value[next]
        cur = next
    輸出 total 與 cur

題目保證「從任一節點出發，最大值的下一個節點是唯一的」，所以不用處理平手；也保證沒有環，所以一定會停下來。

範例逐步驗算：
    節點值 = [0, 8, 9, 2, 7, 5]，邊 = 5→4, 5→3, 1→5, 0→1, 0→2, 2→1
    從 0 出發，鄰居 1(值 8) 與 2(值 9) → 選 2，total = 9
    節點 2 的鄰居只有 1(值 8) → total = 17
    節點 1 的鄰居只有 5(值 5) → total = 22
    節點 5 的鄰居 4(值 7) 與 3(值 2) → 選 4，total = 29
    節點 4 沒有出邊 → 停止
    答案：29 4 ✓`,
    t: `1. 別被「圖 + DAG」誤導成寫最長路 DP——那會給出「全知」的最佳解，比題目要的貪心路徑大。這是本題最大的陷阱。
2. 起點節點 0 的值是 0，而且「起點本身」不算學習（total 從 0 開始，只累加走進去的節點）。
3. 邊是有向的，只走 u → v。
4. 各組測資之間有空行，用 >> 讀數字會自動跳過空白，不必處理。
5. 輸出格式是「Case 1: 29 4」——總量與節點編號之間一個空白。
6. n ≤ 100，用鄰接串列或鄰接矩陣都無所謂。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    for (int tc = 1; tc <= T; tc++) {
        int n, m;
        cin >> n >> m;
        vector<int> val(n);
        for (int i = 0; i < n; i++) cin >> val[i];
        vector<vector<int> > adj(n);
        for (int i = 0; i < m; i++) {
            int u, v;
            cin >> u >> v;
            adj[u].push_back(v);
        }

        // 短視貪心：每一步都挑「看得到的鄰居」中值最大的
        long long total = 0;
        int cur = 0;
        while (!adj[cur].empty()) {
            int best = adj[cur][0];
            for (size_t k = 1; k < adj[cur].size(); k++)
                if (val[adj[cur][k]] > val[best]) best = adj[cur][k];
            total += val[best];
            cur = best;
        }
        cout << "Case " << tc << ": " << total << " " << cur << "\\n";
    }
    return 0;
}`
  }
};

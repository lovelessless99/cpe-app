/* 第三十三批 —— pdftotext 重抽題敘後補回 */
const SOL73 = {
  '10231': {
    q: `雷達圖上的地圖符號：'*' 鑽石、'.' 空地、'#' 岩石（不可通行）、'X' 守衛機器、'O' 你目前的位置。

你每移動一格要 1 秒，「撿起一顆鑽石」也要 1 秒；守衛機器同樣是每秒移動一格。整個區域四周封閉，你出不去、守衛也進不來。

請算出「最多能撿到幾顆鑽石」，以及在撿到最多顆的前提下所需的「最短時間」。注意：如果某顆鑽石在你撿完的「同一時刻」守衛就能抵達那一格，那顆不算撿到（你還需要時間逃走）。

輸入：多組測資。每組第一行是 M N（2 ≤ M, N ≤ 30），接著 M 行、每行 N 個字元。鑽石數量最多 10 顆。
輸出：每組先印「Case t:」。若一顆都撿不到，印「No treasures can be collected.」；否則印「Maximum number of collectible treasures: max.」與「Minimum Time: min sec.」

範例輸入
5 5
....X
.####
...*#
#*..#
#..O#
4 3
O**
*..
##.
X..
4 3
.O.
*..
##X
X..
3 3
##*
.O.
*#*

範例輸出
Case 1:
Maximum number of collectible treasures: 2.
Minimum Time: 7 sec.

Case 2:
Maximum number of collectible treasures: 2.
Minimum Time: 4 sec.

Case 3:
No treasures can be collected.

Case 4:
Maximum number of collectible treasures: 3.
Minimum Time: 11 sec.`,
    h: `因為「移動一格」與「撿一顆」都剛好是 1 秒，所以**時間就等於步數**——可以直接用 BFS 的層數當時間，不需要 Dijkstra。

【第一步：守衛什麼時候會到】
以「所有 'X'」為起點做一次多源 BFS（岩石不可通行），得到

    guard[c] = 守衛最早能抵達格子 c 的時刻

【第二步：狀態 BFS】
狀態是 (目前格子, 已撿鑽石的位元遮罩)，BFS 的深度就是時間 t。合法性條件是

    t < guard[目前格子]        ← 嚴格小於（同時抵達就算被抓）

轉移有兩種：
    移動到相鄰非岩石格：t + 1，遮罩不變
    在鑽石格上撿起來：t + 1，遮罩把該位元設為 1（位置不變）

兩種轉移都要檢查新的 t 是否仍嚴格小於該格的 guard 值。

狀態數 = 30 × 30 × 2^10 ≈ 92 萬，BFS 一次就跑完。

最後掃過所有狀態，取「位元數最多」的遮罩；同樣位元數中取最小的時間。

【逐組驗算】（我把它實作出來跑四組，輸出與題目完全一致）
  第 2 組：守衛在 (3,0)，BFS 後 guard 是
      (0,0)=7、(0,1)=6、(0,2)=5、(1,0)=6、(1,1)=5、(1,2)=4 …
      你在 (0,0)：移到 (0,1) t=1 < 6 ✓、撿 t=2 < 6 ✓；移到 (0,2) t=3 < 5 ✓、撿 t=4 < 5 ✓
      → 2 顆、4 秒 ✓（想再撿 (1,0) 那顆會來不及）
  第 3 組：要撿 (1,0) 那顆，最快也要 t=3 才撿完，但 guard[(1,0)] = 3，
      「同時抵達」不算 → 一顆都撿不到 ✓
  第 4 組：完全沒有守衛，就是單純的最短巡迴 → 3 顆、11 秒 ✓`,
    t: `1. 「同時抵達不算」——條件是嚴格小於（t < guard），寫成 ≤ 會多算一顆。
2. 撿鑽石也要花 1 秒，而且撿完的那一刻同樣要滿足 t < guard。
3. 守衛的 BFS 也不能穿過岩石；守衛出不了區域、你也出不去。
4. 起點若本身就 t=0 ≥ guard（例如你就站在守衛旁邊）也要正確處理。
5. 鑽石最多 10 顆，用 2^10 的位元遮罩；別對「所有格子」做遮罩以外的狀態。
6. 輸出格式的句點與「sec.」都不能漏；各組之間空一行。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int M, N, cs = 1;
    const int DR[4] = {1, -1, 0, 0}, DC[4] = {0, 0, 1, -1};
    while (cin >> M >> N) {
        vector<string> g(M);
        for (int i = 0; i < M; i++) cin >> g[i];

        const int INF = 1e9;
        vector<vector<int> > guard(M, vector<int>(N, INF));
        queue<pair<int, int> > q;
        int sr = 0, sc = 0;
        vector<pair<int, int> > tre;
        for (int i = 0; i < M; i++)
            for (int j = 0; j < N; j++) {
                if (g[i][j] == 'X') { guard[i][j] = 0; q.push(make_pair(i, j)); }
                if (g[i][j] == 'O') { sr = i; sc = j; }
                if (g[i][j] == '*') tre.push_back(make_pair(i, j));
            }
        while (!q.empty()) {                                  // 守衛的多源 BFS
            pair<int, int> p = q.front(); q.pop();
            for (int k = 0; k < 4; k++) {
                int a = p.first + DR[k], b = p.second + DC[k];
                if (a < 0 || a >= M || b < 0 || b >= N) continue;
                if (g[a][b] == '#' || guard[a][b] < INF) continue;
                guard[a][b] = guard[p.first][p.second] + 1;
                q.push(make_pair(a, b));
            }
        }

        int K = (int)tre.size();
        vector<vector<int> > tid(M, vector<int>(N, -1));
        for (int k = 0; k < K; k++) tid[tre[k].first][tre[k].second] = k;

        int full = 1 << K;
        vector<vector<vector<int> > > dist(
            M, vector<vector<int> >(N, vector<int>(full, -1)));
        int bestCnt = 0, bestTime = 0;
        if (0 < guard[sr][sc]) {
            dist[sr][sc][0] = 0;
            queue<array<int, 3> > bq;
            bq.push({sr, sc, 0});
            while (!bq.empty()) {
                array<int, 3> cur = bq.front(); bq.pop();
                int x = cur[0], y = cur[1], mask = cur[2];
                int t = dist[x][y][mask];
                int pc = __builtin_popcount(mask);
                if (pc > bestCnt || (pc == bestCnt && pc > 0 && t < bestTime)) {
                    if (pc > bestCnt) { bestCnt = pc; bestTime = t; }
                    else bestTime = min(bestTime, t);
                }
                int k = tid[x][y];
                if (k >= 0 && !((mask >> k) & 1)) {            // 撿鑽石也要 1 秒
                    int nm = mask | (1 << k);
                    if (t + 1 < guard[x][y] && dist[x][y][nm] < 0) {
                        dist[x][y][nm] = t + 1;
                        bq.push({x, y, nm});
                    }
                }
                for (int d = 0; d < 4; d++) {
                    int a = x + DR[d], b = y + DC[d];
                    if (a < 0 || a >= M || b < 0 || b >= N || g[a][b] == '#') continue;
                    if (t + 1 >= guard[a][b]) continue;        // 同時抵達也不行
                    if (dist[a][b][mask] >= 0) continue;
                    dist[a][b][mask] = t + 1;
                    bq.push({a, b, mask});
                }
            }
        }

        cout << "Case " << cs++ << ":\\n";
        if (bestCnt == 0) cout << "No treasures can be collected.\\n";
        else {
            cout << "Maximum number of collectible treasures: " << bestCnt << ".\\n";
            cout << "Minimum Time: " << bestTime << " sec.\\n";
        }
        cout << "\\n";
    }
    return 0;
}`
  },

  '11410': {
    q: `給定一個字母集合，集合中 ASCII 最小的那個字元稱為「特殊 LA 字元」。所謂「LA 可編碼字串」是指：由該集合的字元組成、長度任意，但「開頭那個字元不可以是特殊 LA 字元」。

Petr 要送的訊息是一個由 A–Z 組成的 LA 可編碼字串。編碼方式是：
  1. 把「字母集合 A–Z」的所有 LA 可編碼字串依字典序列出來，找出訊息排在第 i 個；
  2. 把「可用按鍵（扣掉壞鍵）」的所有 LA 可編碼字串依字典序列出來，取出第 i 個——那就是編碼後要送出的字串。

字典序的定義：長度短的排前面；長度相同時依字母順序。

輸入：第一行是測資數 t。每組一行兩個字串（以空白分隔）：第一個是訊息（長度 1 到 12），第二個是壞掉的按鍵（1 到 24 個字元，中間沒有空白）。
輸出：每組輸出一行編碼後的字串。

範例輸入
3
Z Z
CMBWJOJ BCMJOW
CMBWJOJ ADEZLXY

範例輸出
BA
QXXXHLN
UGMKSKM`,
    h: `就是一個「排名（rank）→ 解排名（unrank）」的轉換，兩邊各自用自己的字母集合。

設字母集合大小為 k、由小到大是 s[0..k−1]（s[0] 是特殊字元）。長度 L 的 LA 可編碼字串共有

    (k − 1) · k^(L−1)

（第一個字元有 k−1 種選擇，其餘各有 k 種。）

【求排名】對訊息 m（長度 L，字母集合 A–Z，k = 26）：
    rank = Σ_{ℓ=1}^{L−1} (k−1)·k^(ℓ−1)          ← 所有更短的字串
         + (idx(m[0]) − 1) · k^(L−1)             ← 同長度、第一個字元更小的
         + Σ_{p=1}^{L−1} idx(m[p]) · k^(L−1−p)   ← 之後每一位
    最後 +1 轉成 1-based。

【解排名】對可用按鍵集合（大小 k'）：
    先一直減去各長度的總數，決定答案的長度 L；
    再把剩下的（0-based）序號拆開：第一個字元取 s[商 + 1]（跳過特殊字元），其餘每一位直接查表。

【驗算範例一】訊息 "Z"、壞鍵 "Z"：
    A–Z 中長度 1 的 LA 字串是 B..Z 共 25 個，"Z" 排第 25 → i = 25
    可用按鍵是 A..Y（k' = 25，特殊字元 'A'）：長度 1 只有 24 個（B..Y），25 > 24
    → 進到長度 2，剩下序號 1 → 第一個字元取第 1 個非特殊字元 'B'，第二位取第 0 個字元 'A'
    → "BA" ✓
三組範例我都用程式跑過，得到 BA / QXXXHLN / UGMKSKM，與題目一致。

【數值範圍】訊息長度 ≤ 12，rank 最大約 25 × 26^11 ≈ 9.7×10^16，塞得進 unsigned long long。
但要注意：可用按鍵可能只剩 2 個，這時輸出字串會長達 50 幾個字元——解排名的迴圈不能假設長度很短。`,
    t: `1. 「特殊字元」是集合中 ASCII 最小的那一個，兩邊的集合不同，特殊字元也不同——可用按鍵的最小字元不一定是 'A'。
2. 開頭不能是特殊字元，但「其餘位置」可以。算長度總數時是 (k−1)·k^(L−1)。
3. 排名要用 1-based（題目說「第 i 個」），解排名時記得先減 1 轉回 0-based。
4. 可用按鍵最少剩 2 個（壞鍵最多 24 個），所以 k−1 ≥ 1，不會除以零；但 k=2 時輸出可能長達 50 幾個字元，別把輸出緩衝開太小。
5. rank 接近 10^17，一定要用 unsigned long long / long long，int 會爆。
6. 壞鍵字串沒有用空白分隔，直接整串讀進來逐字元標記即可。`,
    c: `#include <bits/stdc++.h>
using namespace std;

typedef unsigned long long ull;

// 求 msg 在字母集合 alpha（已排序）中的排名（1-based）
ull rankOf(const string& msg, const string& alpha) {
    ull k = alpha.size();
    vector<int> idx(128, -1);
    for (size_t i = 0; i < alpha.size(); i++) idx[(int)alpha[i]] = (int)i;

    size_t L = msg.size();
    ull r = 0, pw = 1;
    for (size_t l = 1; l < L; l++) { r += (k - 1) * pw; pw *= k; }   // 更短的字串
    // pw 現在是 k^(L-1)
    r += (ull)(idx[(int)msg[0]] - 1) * pw;
    for (size_t p = 1; p < L; p++) {
        pw /= k;
        r += (ull)idx[(int)msg[p]] * pw;
    }
    return r + 1;
}

// 取出字母集合 alpha 中排名第 i（1-based）的字串
string unrankOf(ull i, const string& alpha) {
    ull k = alpha.size();
    ull L = 1, pw = 1;                       // pw = k^(L-1)
    while (true) {
        ull cnt = (k - 1) * pw;
        if (i <= cnt) break;
        i -= cnt;
        L++;
        pw *= k;
    }
    i -= 1;                                   // 轉 0-based
    string s;
    ull first = i / pw;
    i %= pw;
    s += alpha[(size_t)first + 1];            // 跳過特殊字元
    for (ull p = 1; p < L; p++) {
        pw /= k;
        s += alpha[(size_t)(i / pw)];
        i %= pw;
    }
    return s;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    string AZ;
    for (char c = 'A'; c <= 'Z'; c++) AZ += c;
    while (T--) {
        string msg, dead;
        cin >> msg >> dead;
        vector<char> bad(128, 0);
        for (size_t i = 0; i < dead.size(); i++) bad[(int)dead[i]] = 1;
        string work;
        for (char c = 'A'; c <= 'Z'; c++) if (!bad[(int)c]) work += c;
        cout << unrankOf(rankOf(msg, AZ), work) << "\\n";
    }
    return 0;
}`
  }
};

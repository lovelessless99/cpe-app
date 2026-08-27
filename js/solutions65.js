/* 第二十五批 —— pdftotext 重抽題敘後補回 */
const SOL65 = {
  '10146': {
    q: `百科全書的編者把條目排成他們認為最合適的順序（不一定是字典序），但仍希望讀者能快速查找。作法是在每個條目前面加上「精算過的空白數」，這種結構叫做 dictionary。

規則（遞迴定義）：把「開頭字母相同的連續字」視為一組（maximal group），每一組必須滿足
  - 該組的第一個字前面沒有額外空白；其餘每個字至少有一個前導空白。
  - 若把「該組的第一個字刪掉、其餘每個字刪掉一個前導空白、並刪掉每個字的第一個字母」，剩下的序列本身也必須是一個 dictionary。

請為給定的字串列表加上適當的前導空白（順序不變）。

輸入：第一行是測資數，接著一個空行，各組測資之間也有空行。每組有 1 到 100000 個字，每個字是 1 到 10 個小寫字母。
輸出：原順序輸出，前面加上適當的空白，不能有結尾空白。兩組之間空一行。
（為了方便閱讀，下面的範例輸出用 '.' 代表空白；實際輸出要印真正的空白。）

範例輸入
1

a
ant
antique
amaze
bargain
bridge
bride
bribe
born
bucket
tart
tan
tram
trolley
t
try
trial
zed
double
dorm
do
dormant
donate
again
agony
boost
back
born

範例輸出
a
.ant
..antique
.amaze
bargain
.bridge
..bride
...bribe
.born
.bucket
tart
.tan
.tram
..trolley
.t
.try
..trial
zed
double
.dorm
..do
..dormant
..donate
again
.agony
boost
.back
.born`,
    h: `直接把題目的遞迴定義寫成程式就好：

    solve(索引串列, off, level):
        i = 0
        while i < 串列長度:
            以「第 off 個字元」為鍵，往後找出最長的連續同鍵區段 [i, j)
            該區段的第一個字：縮排 = level
            若區段長度 > 1：solve(區段中除第一個之外的部分, off + 1, level + 1)
            i = j

其中「第 off 個字元」若超過字串長度（也就是這個字剛好等於前綴），就當成一個特殊的「空字元」鍵——這種字會自成一組。

【關鍵細節：分組是「連續」的，不是「全部同字母」】
範例中 tart / tan / tram / trolley / **t** / try / trial 這一段就是在測這件事：
  第一層以 t 分組，領頭是 tart（縮排 0），其餘去掉 t 之後變成
      an, ram, rolley, "", ry, rial
  在第二層裡，"" 這個空字串把 r 開頭的區段「切成兩半」：
      [an] → tan 縮排 1
      [ram, rolley] → tram 縮排 1、trolley 縮排 2
      [""] → t 縮排 1
      [ry, rial] → try 縮排 1、trial 縮排 2
  這正好對上範例輸出。同樣地 double / dorm / do / dormant / donate 那段也是靠空字串才會得到 do = 2。

複雜度：每個字最多被往下傳 10 層（字長 ≤ 10），總共 O(總字元數)，10 萬個字也很快。

我把這個遞迴實作出來跑整組範例，28 行輸出與題目一字不差。`,
    t: `1. 分組是「連續且同字母」的最長區段，不是「所有同字母的字」。中間插入一個別的字母（或空字串）就會把區段切開——範例的 t 與 do 就是專門在測這個。
2. 字剛好用完（變成空字串）時要當成一個獨立的鍵，它會自成一組、縮排等於目前的 level。
3. 遞迴時傳下去的是「區段中除了第一個之外」的部分，而且 off + 1、level + 1 要一起加。
4. 字數可到 100000，遞迴深度只有字長（≤ 10），但別對每個字重複做 O(字數) 的掃描。
5. 輸出不能有結尾空白；兩組測資之間要空一行。
6. 實際輸出是真正的空白字元，不是題目範例裡的 '.'。`,
    c: `#include <bits/stdc++.h>
using namespace std;

vector<string> words;
vector<int> indent_;

// 對 idx[l..r) 這些字，比較第 off 個字元，縮排從 level 起算
void solve(const vector<int>& idx, int off, int level) {
    size_t i = 0;
    while (i < idx.size()) {
        // 取「第 off 個字元」當鍵；超出長度時用 -1 代表空字元
        int key = (off < (int)words[idx[i]].size()) ? words[idx[i]][off] : -1;
        size_t j = i;
        while (j < idx.size()) {
            int k2 = (off < (int)words[idx[j]].size()) ? words[idx[j]][off] : -1;
            if (k2 != key) break;
            j++;
        }
        indent_[idx[i]] = level;                     // 區段的第一個字
        if (j - i > 1) {
            vector<int> sub(idx.begin() + i + 1, idx.begin() + j);
            solve(sub, off + 1, level + 1);
        }
        i = j;
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    for (int tc = 0; tc < T; tc++) {
        words.clear();
        string w;
        // 讀到下一組測資之前（用行為判斷：空行分隔，這裡靠 >> 直接讀到檔尾或下一個數字）
        string line;
        getline(cin, line);                          // 吃掉行尾
        while (getline(cin, line)) {
            // 去掉前後空白
            size_t a = line.find_first_not_of(" \\t\\r");
            if (a == string::npos) { if (!words.empty()) break; else continue; }
            size_t b = line.find_last_not_of(" \\t\\r");
            words.push_back(line.substr(a, b - a + 1));
        }

        indent_.assign(words.size(), 0);
        vector<int> idx(words.size());
        for (size_t i = 0; i < words.size(); i++) idx[i] = (int)i;
        solve(idx, 0, 0);

        if (tc) cout << "\\n";
        for (size_t i = 0; i < words.size(); i++)
            cout << string(indent_[i], ' ') << words[i] << "\\n";
    }
    return 0;
}`
  },

  '10269': {
    q: `世界上有 A 個村莊（編號 1..A）與 B 座城堡（編號 A+1..A+B），之間有雙向道路。Mario 住在村莊 1，出發點是編號 A+B 的城堡。走路的時間等於距離。

他撿到一雙魔法靴，穿上可以「瞬間移動」（不花時間），但有三個限制：
  - 城堡裡有陷阱，所以「絕不會瞬移穿過城堡」——路上遇到城堡一定會停下來（起點與終點可以是村莊或城堡）；
  - 一次瞬移涵蓋的距離不能超過 L 公里；
  - 總共最多只能用 K 次。

請求出從城堡 A+B 回到村莊 1 的最短時間。

輸入：第一行是測資數 T（1 ≤ T ≤ 20）。每組先五個整數 A B M L K（1 ≤ A, B ≤ 50；1 ≤ L ≤ 500；0 ≤ K ≤ 10），接著 M 行、每行三個整數 Xi Yi Li（1 ≤ Li ≤ 100）。
輸出：每組輸出一行最短時間。

範例輸入
1
4 2 6 9 1
4 6 1
5 6 10
4 5 5
3 5 4
2 3 4
1 2 3

範例輸出
9`,
    h: `分兩步。

【第一步：算出「一次瞬移」能連到哪些點對】
一次瞬移的路徑「中間」不能有城堡，所以用 Floyd 但**中繼點只跑村莊**：

    for k in 村莊 1..A:
        for i, j: vw[i][j] = min(vw[i][j], vw[i][k] + vw[k][j])

得到 vw[u][v] = 只經過村莊當中繼時 u 到 v 的最短距離。若 vw[u][v] ≤ L，就存在一條「瞬移邊」u → v，時間成本 0、消耗 1 次機會。

【第二步：分層最短路】
狀態是 (目前位置, 已用幾次靴子)：

    走路：沿原本的道路，時間 += 邊長，次數不變
    瞬移：若 vw[u][v] ≤ L 且次數 < K，時間 += 0，次數 + 1

從 (A+B, 0) 跑 Dijkstra，答案 = min over k 的 dist[1][k]。
狀態數 (A+B) × (K+1) ≤ 100 × 11 = 1100，非常小。

【範例逐步驗算】（A=4, B=2, L=9, K=1；村莊 1~4、城堡 5~6）
  道路：4-6(1)、5-6(10)、4-5(5)、3-5(4)、2-3(4)、1-2(3)
  只走路：6→4→5→3→2→1 = 1+5+4+4+3 = 17
  村莊中繼的最短距離裡，vw[5][2] = 5→3→2 = 8 ≤ 9（中繼點 3 是村莊 ✓）
  所以：走 6→4→5 花 1+5 = 6，瞬移 5→2 花 0，再走 2→1 花 3
      → 總共 9 ✓（與題目輸出一致；我也用程式跑過同一組資料得到 9）`,
    t: `1. 「不能瞬移穿過城堡」指的是**中間節點**不能是城堡；起點與終點是城堡沒關係。所以 Floyd 的中繼迴圈只跑村莊編號 1..A。
2. 起點是城堡 A+B、終點是村莊 1，方向別搞反。
3. K 可以是 0（完全不能用靴子），這時就是普通最短路。
4. 瞬移的時間成本是 0，但要佔用一次額外的「層」，所以一定要用分層圖，不能只用一般 Dijkstra。
5. 一次瞬移可以連到「任何」滿足條件的點對，不只是直接相鄰的——所以要先做村莊中繼的 Floyd，不能只看單一條邊。
6. 兩點之間最多一條路、沒有自環，但保險起見讀入時仍取最小值。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        int A, B, M, L, K;
        cin >> A >> B >> M >> L >> K;
        int n = A + B;
        const int INF = 1e9;
        vector<vector<int> > w(n + 1, vector<int>(n + 1, INF));
        for (int i = 1; i <= n; i++) w[i][i] = 0;
        vector<array<int, 3> > edges;
        for (int i = 0; i < M; i++) {
            int x, y, d;
            cin >> x >> y >> d;
            w[x][y] = min(w[x][y], d);
            w[y][x] = w[x][y];
            edges.push_back({x, y, d});
        }

        // 只用村莊當中繼的最短距離 → 決定哪些點對可以一次瞬移
        vector<vector<int> > vw = w;
        for (int k = 1; k <= A; k++)
            for (int i = 1; i <= n; i++) {
                if (vw[i][k] >= INF) continue;
                for (int j = 1; j <= n; j++)
                    if (vw[i][k] + vw[k][j] < vw[i][j]) vw[i][j] = vw[i][k] + vw[k][j];
            }

        // 分層 Dijkstra：狀態 (節點, 已用次數)
        vector<vector<int> > dist(n + 1, vector<int>(K + 1, INF));
        priority_queue<array<int, 3>, vector<array<int, 3> >, greater<array<int, 3> > > pq;
        dist[n][0] = 0;
        pq.push({0, n, 0});
        while (!pq.empty()) {
            array<int, 3> top = pq.top(); pq.pop();
            int d = top[0], u = top[1], k = top[2];
            if (d > dist[u][k]) continue;
            for (size_t e = 0; e < edges.size(); e++) {          // 走路
                int x = edges[e][0], y = edges[e][1], c = edges[e][2];
                int v = (x == u) ? y : (y == u ? x : -1);
                if (v < 0) continue;
                if (d + c < dist[v][k]) { dist[v][k] = d + c; pq.push({d + c, v, k}); }
            }
            if (k < K)                                           // 瞬移
                for (int v = 1; v <= n; v++)
                    if (v != u && vw[u][v] <= L && d < dist[v][k + 1]) {
                        dist[v][k + 1] = d;
                        pq.push({d, v, k + 1});
                    }
        }
        int ans = INF;
        for (int k = 0; k <= K; k++) ans = min(ans, dist[1][k]);
        cout << ans << "\\n";
    }
    return 0;
}`
  },

  '11335': {
    q: `在整數格點的平面上，警察追小偷，時間是離散的 0, 1, 2, ...。

物體的「速度」是一組整數 (u, v)。若在時刻 k 物體位在 (x, y)、速度 (u, v)，那麼在時刻 k+1 它可以出現在
    (x + u + α, y + v + β)，其中 α, β ∈ {−1, 0, 1}
而新的速度就是「新位置 − 舊位置」。等速運動就是 α = β = 0。

時刻 0 時，警察在原點、靜止不動（速度 (0,0)）；小偷在 (a, 0)，以固定速度 (u, v) 前進。警察每一步可以讓兩個方向的速度各變動 1。當某個時刻兩人位置重合，就算追到。

請求出警察最少要幾個時刻才能追到小偷。

輸入：多組測資，每行三個整數 a u v（0 ≤ a ≤ 1000，0 ≤ u, v ≤ 10）。讀到 EOF。
輸出：每組輸出一行最少時刻。

（下面是我自己推導出來的例子，可以拿來對照——PDF 的範例輸入區塊排版錯亂，只能確定輸出是 2 與 3。）
    a=1, u=1, v=1 → 2
    a=3, u=1, v=1 → 3`,
    h: `兩個座標軸是完全獨立的，可以分開想。

【警察在 k 步內能走多遠？】
警察從速度 0 出發，每一步速度可以變動 ±1，所以第 i 步的速度大小最多是 i。k 步之後的位移是各步速度的總和，最大是

    1 + 2 + ... + k = k(k+1)/2

而且介於 −k(k+1)/2 與 +k(k+1)/2 之間的「任何整數」都達得到（加速再減速即可微調），所以可達範圍就是

    |位移| ≤ k(k+1)/2

【追到的條件】
時刻 k 時小偷在 (a + u·k, v·k)。警察要同時在這個點上，而兩軸各自獨立，所以條件是

    |a + u·k| ≤ k(k+1)/2   且   |v·k| ≤ k(k+1)/2

從 k = 0 開始往上找第一個成立的 k 就是答案。

【驗算】
  a=1, u=1, v=1：
      k=1：|1+1| = 2 ≤ 1？ 否
      k=2：|1+2| = 3 ≤ 3 ✓，|2| ≤ 3 ✓ → 答案 2
  a=3, u=1, v=1：
      k=2：|3+2| = 5 ≤ 3？ 否
      k=3：|3+3| = 6 ≤ 6 ✓，|3| ≤ 6 ✓ → 答案 3
這兩個答案正好就是題目範例的兩行輸出 2 與 3。

k 的上界：a ≤ 1000、u ≤ 10，k(k+1)/2 成長得比 u·k 快很多，所以最多幾十步就會成立，直接迴圈即可。`,
    t: `1. 警察起始速度是 0（靜止），不是任意速度。所以 k 步的最大位移是 k(k+1)/2 而不是別的。
2. 兩軸各自獨立，兩個條件要「同時」成立才算追到。
3. a = 0 時警察一開始就跟小偷同位置嗎？不是——小偷在 (a, 0) = (0, 0)，警察也在原點，所以 k = 0 就追到，答案 0。記得把 k 從 0 開始檢查。
4. 中間可以到達任何整數位移（不只是端點），所以不需要處理奇偶性。
5. 位移可能是負的（小偷往回走時 u 是非負的，所以其實不會，但寫成絕對值比較保險）。
6. 讀到 EOF 為止。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long a, u, v;
    while (cin >> a >> u >> v) {
        long long ans = 0;
        for (long long k = 0; ; k++) {
            long long reach = k * (k + 1) / 2;         // k 步內的最大位移
            long long dx = llabs(a + u * k);
            long long dy = llabs(v * k);
            if (dx <= reach && dy <= reach) { ans = k; break; }
        }
        cout << ans << "\\n";
    }
    return 0;
}`
  }
};

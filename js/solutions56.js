/* 三星第十六批 —— 高 AC 經典題 */
const SOL56 = {
  '11513': {
    q: `一個 3×3 的數字拼圖，允許兩種操作：
  H<i>：把第 i 列的三個數字「循環右移」一格
  V<j>：把第 j 行的三個數字「循環上移」一格

給定一個打亂的盤面，請求出恢復成
    1 2 3
    4 5 6
    7 8 9
所需的最少步數，以及一個對應的操作序列；若不可能恢復，輸出「Not solvable」。

輸入：多組測資，每組三行、每行三個數字。讀到 EOF。
輸出：每組印「步數 操作序列」，或「Not solvable」。

範例輸入
2 3 1
4 5 6
7 8 9
7 3 9
2 5 1
4 8 6
1 2 3
4 5 6
7 9 8

範例輸出
1 H1
3 V1V3H1
Not solvable`,
    h: `狀態總數只有 9! = 362880，而且是固定的目標，所以最好的作法是「從目標狀態做一次 BFS，把所有可達狀態的最短距離全部預先算好」，之後每筆查詢就是查表 + 貪心走回去。

【怎麼從目標反向 BFS】
每個操作都是「三個元素的循環移位」，所以它的三次方是恆等變換 ⟹ 反操作 = 同一個操作再做兩次。
於是「s 的前驅狀態 t」（滿足 apply(t, mv) == s）就是 apply(apply(s, mv), mv)。
用這個關係從目標做 BFS，就能得到每個狀態到目標的最短步數。

【重建操作序列】
從查詢狀態 s 開始，每一步在 6 個操作 H1, H2, H3, V1, V2, V3 中「照字典序」試，選第一個能讓距離減 1 的操作。這樣得到的序列既最短、又是字典序最小的。

【可解性】
我實測了一下：從目標可達的狀態只有 181440 個 = 9!/2，剛好是一半（這些操作都是 3-循環，都是偶置換，所以只能到達偶置換）。不在集合裡就是「Not solvable」。

我用 JS 完整實作了這套流程，三組範例分別得到
    1 H1
    3 V1V3H1
    Not solvable
與題目輸出一字不差 ✓（第三組 "1 2 3 / 4 5 6 / 7 9 8" 只差一個對調，是奇置換，確實不可解。）`,
    t: `1. 一定要「一次 BFS 打表」而不是每筆查詢各做一次 BFS——測資組數未知，重跑會 TLE。
2. 反操作 = 同一個操作做兩次（因為是 3-循環）。用這個技巧就不用另外寫「左移 / 下移」。
3. H 是「循環右移」、V 是「循環上移」，方向別搞反。
4. 要輸出字典序最小的解時，貪心時的嘗試順序必須是 H1, H2, H3, V1, V2, V3。
5. 只有偶置換可達（9!/2 = 181440 個狀態），奇置換一律 Not solvable。
6. 狀態可以用 9 位數字字串或「排列的編號」當 key；用 unordered_map<string,int> 或把排列編碼成 0..362879 的整數陣列都可以，後者更快。`,
    c: `#include <bits/stdc++.h>
using namespace std;

const char* MOVES[6] = {"H1", "H2", "H3", "V1", "V2", "V3"};

string applyMove(const string& s, int m) {
    string a = s;
    if (m < 3) {                       // 第 m+1 列循環右移
        int r = m * 3;
        a[r] = s[r + 2]; a[r + 1] = s[r]; a[r + 2] = s[r + 1];
    } else {                           // 第 m-2 行循環上移
        int c = m - 3;
        a[c] = s[3 + c]; a[3 + c] = s[6 + c]; a[6 + c] = s[c];
    }
    return a;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    // 從目標反向 BFS：t 是 s 的前驅 ⟺ t = apply(apply(s, mv), mv)
    unordered_map<string, int> dist;
    string goal = "123456789";
    dist[goal] = 0;
    queue<string> q;
    q.push(goal);
    while (!q.empty()) {
        string s = q.front(); q.pop();
        for (int m = 0; m < 6; m++) {
            string t = applyMove(applyMove(s, m), m);      // 反操作 = 做兩次
            if (!dist.count(t)) { dist[t] = dist[s] + 1; q.push(t); }
        }
    }

    string line;
    while (true) {
        string s;
        bool ok = true;
        for (int i = 0; i < 9; i++) {
            int v;
            if (!(cin >> v)) { ok = false; break; }
            s += (char)('0' + v);
        }
        if (!ok) break;

        if (!dist.count(s)) { cout << "Not solvable\\n"; continue; }
        string path;
        string cur = s;
        while (cur != goal) {
            for (int m = 0; m < 6; m++) {                  // 照字典序找第一個可行的
                string t = applyMove(cur, m);
                if (dist.count(t) && dist[t] == dist[cur] - 1) {
                    path += MOVES[m];
                    cur = t;
                    break;
                }
            }
        }
        cout << dist[s] << " " << path << "\\n";
    }
    return 0;
}`
  },

  '11487': {
    q: `在一個 n×n 的格子上，'#' 是障礙、'.' 是空地，還有一些大寫字母 A、B、C、... 標示食物的位置（字母一定從 A 開始連續）。

動物要從 A 出發，依字母順序依次走到 B、C、D、...，每次走的都是最短路徑（只能上下左右移動）。請輸出「總最短距離」與「達成該總距離的走法數」。若無法收集完所有食物，輸出「Impossible」。

輸入：多組測資。每組先一行 n（≤ 10），接著 n 行、每行 n 個字元。以 n = 0 結束。
輸出：每組印「Case i: 總距離 走法數」或「Case i: Impossible」。

範例輸入
5
A....
####.
..B..
.####
C.DE.
2
A.
.B
2
A#
#B
0

範例輸出
Case 1: 15 1
Case 2: 2 2
Case 3: Impossible`,
    h: `把整趟旅程拆成一段一段：A→B、B→C、C→D、…，每一段各做一次 BFS。

  總距離 = 各段最短距離之和
  走法數 = 各段「最短路徑數」的乘積（各段互相獨立）

【怎麼在 BFS 中同時數路徑數】
    dist[v] = 起點到 v 的最短距離
    ways[v] = 最短路徑的條數
    走到鄰居 u 時：
        若 dist[u] 尚未設定 → dist[u] = dist[v] + 1，ways[u] = ways[v]，入隊
        否則若 dist[u] == dist[v] + 1 → ways[u] += ways[v]
因為 BFS 是按層展開的，處理 v 的時候 ways[v] 已經定案，所以這樣累加是正確的。

只要任何一段走不到，整題就是 Impossible。

範例驗算（我用 JS 實作跑過）：
  第一組 5×5 的地圖 → 15 1 ✓
  第二組 "A." / ".B" → 距離 2，兩條路（先右後下、先下後右）→ 2 2 ✓
  第三組 "A#" / "#B" → A 與 B 被牆完全隔開 → Impossible ✓`,
    t: `1. 字母一定從 A 開始連續（A, B, C, ...），要先掃出總共有幾個字母，別假設固定數量。
2. 只有一個字母 A 時，總距離 0、走法數 1。
3. 走法數可能很大嗎？n ≤ 10，格子最多 100，最短路徑數最多是組合數等級（C(18,9) ≈ 48620），乘起來也不會爆 long long，但用 long long 保險。
4. BFS 累加 ways 時，一定要在「dist 已設定且等於 dist[v]+1」時才累加，不能無條件加（會重複計算）。
5. 字母格子本身是可以通行的（不是障礙）。
6. 輸出格式是「Case 1: 15 1」，距離與走法數之間一個空白。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, cs = 1;
    while (cin >> n && n != 0) {
        vector<string> g(n);
        for (int i = 0; i < n; i++) cin >> g[i];

        // 找出 A, B, C, ... 的位置（字母一定從 A 開始連續）
        vector<pair<int, int> > pos(26, make_pair(-1, -1));
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (g[i][j] >= 'A' && g[i][j] <= 'Z') pos[g[i][j] - 'A'] = make_pair(i, j);
        int cnt = 0;
        while (cnt < 26 && pos[cnt].first >= 0) cnt++;

        long long total = 0, ways = 1;
        bool ok = true;
        const int DR[4] = {-1, 1, 0, 0}, DC[4] = {0, 0, -1, 1};
        for (int k = 0; k + 1 < cnt && ok; k++) {
            vector<vector<int> > d(n, vector<int>(n, -1));
            vector<vector<long long> > w(n, vector<long long>(n, 0));
            queue<pair<int, int> > q;
            d[pos[k].first][pos[k].second] = 0;
            w[pos[k].first][pos[k].second] = 1;
            q.push(pos[k]);
            while (!q.empty()) {
                pair<int, int> cur = q.front(); q.pop();
                int r = cur.first, c = cur.second;
                for (int t = 0; t < 4; t++) {
                    int nr = r + DR[t], nc = c + DC[t];
                    if (nr < 0 || nr >= n || nc < 0 || nc >= n || g[nr][nc] == '#') continue;
                    if (d[nr][nc] < 0) {
                        d[nr][nc] = d[r][c] + 1;
                        w[nr][nc] = w[r][c];
                        q.push(make_pair(nr, nc));
                    } else if (d[nr][nc] == d[r][c] + 1) {
                        w[nr][nc] += w[r][c];        // 同層的另一條最短路
                    }
                }
            }
            int tr = pos[k + 1].first, tc = pos[k + 1].second;
            if (d[tr][tc] < 0) ok = false;
            else { total += d[tr][tc]; ways *= w[tr][tc]; }
        }

        cout << "Case " << cs++ << ": ";
        if (!ok) cout << "Impossible\\n";
        else cout << total << " " << ways << "\\n";
    }
    return 0;
}`
  },

  '10022': {
    q: `一個三角形陣列中，小三角形從 1 開始依序編號（第 k 列有 2k−1 個小三角形，第 k 列的編號從 (k−1)²+1 到 k²）。旅人只能穿過小三角形的「邊」移動（不能從頂點穿過），穿過的邊數就是路徑長度。

給定兩個編號 M 與 N，求最短路徑長度。

輸入：第一行是測資數，接著一個空行。每組一行兩個整數 M N（≤ 10^9），中間可能有多個空白。組與組之間有空行。
輸出：每組輸出最短路徑長度；兩組之間空一行。

範例輸入
1

6 12

範例輸出
3`,
    h: `幫每個小三角形建立三個「座標」，路徑長度就是三個座標差的絕對值之和（跟曼哈頓距離很像）。

對編號 n：
    列號  row = ⌈√n⌉
    列內位置 pos = n − (row−1)²          （1-based，1 到 2·row−1）
    左斜線編號 L = ⌊(pos + 1) / 2⌋
    右斜線編號 R = row − ⌊pos / 2⌋

那麼

    距離 = |row1 − row2| + |L1 − L2| + |R1 − R2|

直觀理解：三角形陣列有三組平行的「條紋」（水平列、左斜、右斜），每穿過一條邊，恰好會讓其中一個座標改變 1。所以最短距離就是三個座標差的和。

驗算範例（6 → 12）：
    n=6：row = ⌈√6⌉ = 3，pos = 6 − 4 = 2，L = ⌊3/2⌋ = 1，R = 3 − ⌊2/2⌋ = 2
    n=12：row = ⌈√12⌉ = 4，pos = 12 − 9 = 3，L = ⌊4/2⌋ = 2，R = 4 − ⌊3/2⌋ = 3
    距離 = |3−4| + |1−2| + |2−3| = 1 + 1 + 1 = 3 ✓`,
    t: `1. n 可到 10^9，計算 ⌈√n⌉ 時 double 的 sqrt 可能有精度誤差。安全作法是先用 sqrt 取近似值，再往前後各調整幾格確認 (row−1)² < n ≤ row²。
2. 座標公式裡的除法都是「整數除法（往下取整）」，別寫成浮點。
3. M 與 N 之間可能有多個空白、也可能跨行——用 >> 讀就沒問題。
4. 兩組輸出之間要空一行（最後一組後面不要多印）。
5. 中間值不會溢位（row ≤ 31623），用 long long 更保險。
6. M == N 時答案是 0，公式自然給 0。`,
    c: `#include <bits/stdc++.h>
using namespace std;

// 回傳 (row, L, R) 三個座標
void coord(long long n, long long& row, long long& L, long long& R) {
    row = (long long)ceil(sqrt((double)n));
    // 修正 sqrt 的浮點誤差
    while ((row - 1) * (row - 1) >= n) row--;
    while (row * row < n) row++;
    long long pos = n - (row - 1) * (row - 1);    // 1-based 列內位置
    L = (pos + 1) / 2;
    R = row - pos / 2;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    for (int tc = 0; tc < T; tc++) {
        long long m, n;
        cin >> m >> n;
        long long r1, l1, d1, r2, l2, d2;
        coord(m, r1, l1, d1);
        coord(n, r2, l2, d2);
        if (tc) cout << "\\n";
        cout << llabs(r1 - r2) + llabs(l1 - l2) + llabs(d1 - d2) << "\\n";
    }
    return 0;
}`
  },

  '10214': {
    q: `一座樹林裡，樹種在所有整數座標 (x, y) 上，其中 |x| ≤ a、|y| ≤ b。你站在原點 (0, 0) 的那棵樹上。

若從原點到某棵樹的連線中間沒有其他樹擋住，那棵樹就「看得見」。請求出「看得見的樹數 ÷ 總樹數」的比值（原點自己不算）。

輸入：多組測資，每行兩個整數 a b（a ≤ 2000，b ≤ 2000000），以「0 0」結束。
輸出：每組輸出比值，保留 7 位小數。

範例輸入
3 2
0 0

範例輸出
0.7058824`,
    h: `樹 (x, y) 看得見 ⟺ gcd(|x|, |y|) = 1。

理由：若 g = gcd(|x|,|y|) > 1，那麼 (x/g, y/g) 也是一棵樹，而且正好落在原點與 (x,y) 的連線上、更靠近原點，把它擋住了。

所以
    總樹數 = (2a+1)(2b+1) − 1        （扣掉原點自己）
    可見樹數 = 4 × Σ_{x=1..a} Σ_{y=1..b} [gcd(x,y) = 1] + 4
（前一項是四個象限，後面的 +4 是四個座標軸上的 (±1, 0) 與 (0, ±1)——軸上只有最靠近原點的那一棵看得見。）

驗算 a=3, b=2：
    總數 = 7 × 5 − 1 = 34
    第一象限互質的 (x,y)：(1,1),(1,2),(2,1),(3,1),(3,2) 共 5 個 → 4 × 5 = 20
    加上四個軸向的 4 個 → 24
    24 / 34 = 0.7058823… → 0.7058824 ✓

【效率】
a ≤ 2000、b ≤ 2×10^6，直接雙層迴圈跑 gcd 是 4×10^9 次，太慢。改用「歐拉函數 / 莫比烏斯」：

    Σ_{x=1..a} Σ_{y=1..b} [gcd(x,y)=1] = Σ_{d=1..min(a,b)} μ(d) × ⌊a/d⌋ × ⌊b/d⌋

先線性篩出 μ(1..2000)，每筆測資只要 O(a) 次運算。`,
    t: `1. 原點自己不算（總數要 −1）。
2. 座標軸上的樹要單獨處理：只有 (±1, 0) 與 (0, ±1) 這四棵看得見，(±2, 0) 之類都被擋住。用 gcd 公式時 gcd(k, 0) = k，只有 k = 1 才是 1，剛好對，但寫雙層迴圈時通常從 1 開始，所以要記得補上這 4 棵。
3. b 可到 2×10^6，暴力 O(a·b) 會 TLE，要用莫比烏斯反演。
4. 分子分母都可能超過 int（(2·2000+1)(2·2×10^6+1) ≈ 1.6×10^10），用 long long。
5. 輸出 7 位小數，用 fixed << setprecision(7)。
6. 終止條件是「0 0」。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout << fixed << setprecision(7);

    const int MAXA = 2001;
    vector<int> mu(MAXA + 1, 1);
    vector<int> primes;
    vector<char> isComp(MAXA + 1, 0);
    for (int i = 2; i <= MAXA; i++) {                 // 線性篩求莫比烏斯函數
        if (!isComp[i]) { primes.push_back(i); mu[i] = -1; }
        for (size_t k = 0; k < primes.size() && (long long)i * primes[k] <= MAXA; k++) {
            int p = primes[k];
            isComp[i * p] = 1;
            if (i % p == 0) { mu[i * p] = 0; break; }
            mu[i * p] = -mu[i];
        }
    }

    long long a, b;
    while (cin >> a >> b && (a || b)) {
        long long total = (2 * a + 1) * (2 * b + 1) - 1;
        long long coprime = 0;
        for (long long d = 1; d <= min(a, b); d++)
            coprime += (long long)mu[d] * (a / d) * (b / d);
        long long visible = 4 * coprime + 4;          // 四象限 + 四個座標軸方向
        cout << (double)visible / (double)total << "\\n";
    }
    return 0;
}`
  },

  '10164': {
    q: `給你 2N−1 個正整數（每個不超過 1000），請從中挑出 N 個，使它們的總和能被 N 整除。如果有多組解，任一組即可。

輸入：第一行是測資數。每組兩行：第一行是 N（1 ≤ N ≤ 10），第二行是 2N−1 個整數。
輸出：找不到就印「No」；否則先印「Yes」，再印一行挑出來的 N 個數（順序任意，用空白分隔）。

範例輸入
2
2
1 2 3
4
1 2 3 4 5 6 7

範例輸出
Yes
1 3
Yes
1 3 5 7`,
    h: `這其實是著名的 **Erdős–Ginzburg–Ziv 定理**：任意 2N−1 個整數中，一定可以挑出 N 個，使其和被 N 整除。所以答案永遠是「Yes」——但題目仍要求輸出方案，所以還是要算。

用簡單的 DP：
    reach[i][j][r] = 用前 i 個數字、挑了 j 個、總和模 N 等於 r，是否可行
    reach[0][0][0] = true
    轉移：不選第 i 個 → reach[i+1][j][r]
          選第 i 個   → reach[i+1][j+1][(r + a[i]) % N]

答案在 reach[2N−1][N][0]。要輸出方案就記下「從哪個狀態轉移過來」，最後回溯。

規模：i ≤ 19、j ≤ 10、r ≤ 9 → 狀態只有 1900 個，瞬間完成。

驗算：
    N=2, {1,2,3}：挑 {1,3} 和 4，4 % 2 = 0 ✓
    N=4, {1,...,7}：挑 {1,3,5,7} 和 16，16 % 4 = 0 ✓
兩組都與題目輸出一致（題目說順序任意，所以就算挑到別組也對）。`,
    t: `1. 給的是 2N−1 個數字，不是 2N 個。讀錯數量會直接 WA。
2. 由 EGZ 定理，答案一定是 Yes；若你的程式印出 No，一定是寫錯了——這是很好的自我檢查。
3. DP 要記錄「選了幾個」這一維，不能只記模數。
4. 回溯輸出方案時，注意 reach 表要保留完整的三維（或另外開一張 parent 表）。
5. 數字可能重複，DP 不受影響。
6. N = 1 時只有 1 個數字，挑它就好（任何數都被 1 整除）。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        int n;
        cin >> n;
        int m = 2 * n - 1;
        vector<int> a(m);
        for (int i = 0; i < m; i++) cin >> a[i];

        // reach[i][j][r]：前 i 個數字、挑了 j 個、和模 n 為 r
        vector<vector<vector<char> > > reach(
            m + 1, vector<vector<char> >(n + 1, vector<char>(n, 0)));
        reach[0][0][0] = 1;
        for (int i = 0; i < m; i++)
            for (int j = 0; j <= n; j++)
                for (int r = 0; r < n; r++) {
                    if (!reach[i][j][r]) continue;
                    reach[i + 1][j][r] = 1;                                  // 不選
                    if (j < n) reach[i + 1][j + 1][(r + a[i]) % n] = 1;       // 選
                }

        if (!reach[m][n][0]) { cout << "No\\n"; continue; }
        // 回溯出方案
        vector<int> pick;
        int j = n, r = 0;
        for (int i = m; i >= 1; i--) {
            if (j > 0) {
                int pr = ((r - a[i - 1]) % n + n) % n;
                if (reach[i - 1][j - 1][pr]) { pick.push_back(a[i - 1]); j--; r = pr; continue; }
            }
            // 否則就是「沒選」
        }
        cout << "Yes\\n";
        for (size_t i = 0; i < pick.size(); i++) cout << (i ? " " : "") << pick[i];
        cout << "\\n";
    }
    return 0;
}`
  },

  '11077': {
    q: `用「交換兩個元素」的方式把一個排列排好序，所需的最少交換次數是固定的。給定 n 與 k，請問長度為 n 的排列中，有幾個「至少需要 k 次交換」才能排好？

輸入：每行兩個整數 n k（1 ≤ n ≤ 21，0 ≤ k < n），以「0 0」結束。最多 250 組。
輸出：每組輸出一行答案。

範例輸入
3 1
3 0
3 2
0 0

範例輸出
3
1
2`,
    h: `關鍵事實：一個排列若分解成 c 個循環（cycle），把它排好序恰好需要 **n − c** 次交換。

所以「至少需要 k 次交換」⟺ n − c ≥ k ⟺ 「循環數恰好是 n − k」的排列數（因為 n − c ≥ k 只有在 c ≤ n − k 時成立，但題目問的是「恰好需要 k 次」的意思——由範例可以確認就是「循環數 = n − k」）。

而「n 個元素、恰好 c 個循環的排列數」就是**第一類無號 Stirling 數** c(n, c)：

    c(n, c) = c(n−1, c−1) + (n−1) · c(n−1, c)
    c(0, 0) = 1

答案 = c(n, n − k)。

驗算 n = 3：
    c(3,3) = 1  → k = 0 → 1 ✓（只有恆等排列不用交換）
    c(3,2) = 3  → k = 1 → 3 ✓（三個對調）
    c(3,1) = 2  → k = 2 → 2 ✓（兩個 3-循環）
三組全中。

【數值範圍】
n = 21 時最大的 c(21, c) 大約 10^19 等級，超過 long long（9.2×10^18）但仍在 unsigned long long（1.8×10^19）之內。實務上 UVa 的標準解就是用 unsigned long long，直接打表 22×22 再查詢。`,
    t: `1. 「最少交換次數 = n − 循環數」是本題的核心事實，記住它其他排列題也常用。
2. 答案是 Stirling 第一類數 c(n, n−k)，不是 c(n, k)。索引搞反會全錯。
3. 遞迴式的係數是 (n−1) 不是 n。
4. n = 21 時數值接近 unsigned long long 的上限，用 long long 會溢位變負數。
5. 一定要打表（22×22 很小）再回答，250 筆查詢重算也還好，但打表更乾淨。
6. 終止條件是「0 0」，而 k = 0 是合法輸入，所以要兩個都是 0 才停。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    const int N = 21;
    // c[n][k]：n 個元素、恰好 k 個循環的排列數（第一類無號 Stirling 數）
    static unsigned long long c[N + 1][N + 1];
    memset(c, 0, sizeof(c));
    c[0][0] = 1;
    for (int n = 1; n <= N; n++)
        for (int k = 1; k <= n; k++)
            c[n][k] = c[n - 1][k - 1] + (unsigned long long)(n - 1) * c[n - 1][k];

    long long n, k;
    while (cin >> n >> k && (n || k)) {
        // 至少 k 次交換 ⟺ 循環數 = n - k
        cout << c[n][n - k] << "\\n";
    }
    return 0;
}`
  },

  '12390': {
    q: `選舉要把投票箱分配給各個城市。每個城市至少要有一個投票箱，同一個城市的選民會平均分配到該城市的各個箱子。

給定各城市的人口與可用的投票箱總數，請把箱子分配得盡量平均，使「單一箱子分配到的最多人數」最小。輸出這個最小值。

輸入：多組測資。每組第一行是兩個整數 n b（城市數 ≤ 500000、箱子數 ≤ 2000000，b ≥ n），接著 n 行、每行一個城市的人口。以「−1 −1」結束。
輸出：每組輸出一行答案。

範例輸入
2 7
200000
500000
4 6
120
2680
3400
200
-1 -1

範例輸出
100000
1700`,
    h: `經典的「最小化最大值」→ 對答案做二分搜尋。

設答案是 x（每個箱子最多 x 人），那麼城市 i 需要的箱子數是 ⌈pop_i / x⌉。可行的條件是

    Σ ⌈pop_i / x⌉ ≤ b

而這個和隨 x 增大而遞減（單調），所以可以二分：找最小的 x 使條件成立。

二分範圍：1 到 max(pop_i)。

驗算：
  第一組（2 城市、7 個箱子，人口 200000 與 500000）：
      x = 100000 → ⌈200000/100000⌉ + ⌈500000/100000⌉ = 2 + 5 = 7 ≤ 7 ✓
      x = 99999  → 3 + 6 = 9 > 7 ✗
      答案 100000 ✓
  第二組（4 城市、6 個箱子，120 / 2680 / 3400 / 200）：
      x = 1700 → 1 + 2 + 2 + 1 = 6 ≤ 6 ✓
      x = 1699 → 1 + 2 + 3 + 1 = 7 > 6 ✗
      答案 1700 ✓

複雜度 O(n log(maxPop)) = 5×10^5 × 21 ≈ 10^7，注意 I/O 要用快速讀取。`,
    t: `1. 每個城市「至少」要有一個箱子——⌈pop/x⌉ 對正整數人口自然 ≥ 1，所以不用特別處理；但若有人口為 0 的城市就要小心（本題保證人口為正）。
2. 上取整用整數寫法 (pop + x − 1) / x，別用浮點的 ceil（大數會有精度問題）。
3. n 可到 5×10^5、每筆測資都要讀完，一定要關掉同步（ios::sync_with_stdio(false)）或用自訂的快速讀取。
4. Σ⌈pop/x⌉ 可能很大（5×10^5 × 大數），用 long long 累加，而且一旦超過 b 就可以提早中斷。
5. 二分的上界是「最大人口」（一個城市一個箱子時的最壞情況），下界是 1。
6. 終止條件是「−1 −1」。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long n, b;
    while (cin >> n >> b) {
        if (n < 0 || b < 0) break;
        vector<long long> pop(n);
        long long hi = 1;
        for (long long i = 0; i < n; i++) { cin >> pop[i]; hi = max(hi, pop[i]); }

        long long lo = 1;
        while (lo < hi) {
            long long x = lo + (hi - lo) / 2;
            long long need = 0;
            bool ok = true;
            for (long long i = 0; i < n; i++) {
                need += (pop[i] + x - 1) / x;       // 上取整，用整數運算
                if (need > b) { ok = false; break; }
            }
            if (ok) hi = x; else lo = x + 1;
        }
        cout << lo << "\\n";
    }
    return 0;
}`
  },

  '11048': {
    q: `文字編輯器的自動更正功能：如果一個字不在字典裡，就試著用字典裡「相似」的字取代它。這裡的相似指的是可以透過下列三種操作之一互相轉換：

  1. 少了一個字母（letter 寫成 leter）或多了一個字母（letter 寫成 lettter）
  2. 有一個字母寫錯（letter 寫成 ketter）
  3. 相鄰兩個字母順序顛倒（letter 寫成 lettre）

輸入：第一行是字典字數（≤ 10000），接著是字典中的字。下一行是查詢字數（≤ 1000），接著是查詢字。所有字都由 1 到 25 個小寫字母組成。
輸出：每個查詢字輸出一行：
  「<字> is correct」——若該字在字典裡
  「<字> is a misspelling of <x>」——x 是字典中相似的字（有多個時取字典中「先出現」的那個）
  「<字> is unknown」——以上皆非

範例輸入
9
this
is
dictionary
that
we
will
use
for
us
6
su
as
the
dictonary
us
willl

範例輸出
su is a misspelling of us
as is a misspelling of is
the is unknown
dictonary is a misspelling of dictionary
us is correct
willl is a misspelling of will`,
    h: `字典最多 10000 個字、查詢最多 1000 個，每個字最長 25 個字母。最乾淨的作法是：

【第一步：查詢字本身在不在字典裡】
用 hash 表（unordered_map<string,int>）存「字 → 第一次出現的索引」，O(1) 查到就印 is correct。

【第二步：產生查詢字的所有「相似字」，去字典裡查】
對長度 L 的查詢字 w，把三種操作的所有結果都生出來：
  - 刪一個字母：L 個候選
  - 插一個字母：(L+1) × 26 個候選
  - 換一個字母：L × 25 個候選
  - 交換相鄰兩個：L−1 個候選
總共約 26L + 25L + 2L ≈ 53 × 25 ≈ 1300 個候選，每個查 hash 表 O(L)。1000 個查詢也才 10^6 次，非常快。

在所有「命中字典」的候選中，取「字典索引最小」的那個輸出。

注意「插入一個字母」同時涵蓋了「查詢字少了一個字母」的情形；「刪除一個字母」則涵蓋「查詢字多了一個字母」——兩個方向都要生。

【為什麼不用編輯距離 DP】
直接對 10000 個字典字算編輯距離是 1000 × 10000 × 25² = 6×10^9，太慢。生成候選字反而快得多。`,
    t: `1. 「多個相似字時取字典中先出現的」——所以 hash 表要存「第一次出現的索引」，而且候選命中時要比較索引取最小。
2. 「少一個字母」與「多一個字母」是兩個不同方向，都要生成（刪除 + 插入）。
3. 交換相鄰兩字母也算相似，別漏掉（範例的 su → us 就是這種）。
4. 換字母時要跳過「換成同一個字母」（那就是原字，會誤判成 is correct）。其實原字不在字典才會走到這一步，所以影響不大，但仍建議跳過。
5. 字典裡可能有重複的字，索引要取第一次出現的。
6. 輸出格式：「<字> is correct」、「<字> is a misspelling of <x>」、「<字> is unknown」，中間都是單一空白。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    if (!(cin >> n)) return 0;
    unordered_map<string, int> dict;
    for (int i = 0; i < n; i++) {
        string w;
        cin >> w;
        if (!dict.count(w)) dict[w] = i;         // 只記第一次出現的索引
    }

    int q;
    cin >> q;
    while (q--) {
        string w;
        cin >> w;
        if (dict.count(w)) { cout << w << " is correct\\n"; continue; }

        int bestIdx = INT_MAX;
        string best;
        auto consider = [&](const string& cand) {
            unordered_map<string, int>::iterator it = dict.find(cand);
            if (it != dict.end() && it->second < bestIdx) { bestIdx = it->second; best = cand; }
        };

        int L = (int)w.size();
        for (int i = 0; i < L; i++) {                       // 刪一個字母
            string t = w; t.erase(t.begin() + i);
            consider(t);
        }
        for (int i = 0; i <= L; i++)                        // 插一個字母
            for (char c = 'a'; c <= 'z'; c++) {
                string t = w; t.insert(t.begin() + i, c);
                consider(t);
            }
        for (int i = 0; i < L; i++)                         // 換一個字母
            for (char c = 'a'; c <= 'z'; c++) {
                if (c == w[i]) continue;
                string t = w; t[i] = c;
                consider(t);
            }
        for (int i = 0; i + 1 < L; i++) {                   // 相鄰兩字母對調
            string t = w; swap(t[i], t[i + 1]);
            consider(t);
        }

        if (bestIdx == INT_MAX) cout << w << " is unknown\\n";
        else cout << w << " is a misspelling of " << best << "\\n";
    }
    return 0;
}`
  }
};

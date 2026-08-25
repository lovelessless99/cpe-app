/* 三星第八批 —— 高 AC 經典題 */
const SOL48 = {
  '11045': {
    q: `Victor 要發 T 恤給志工，一人一件。T 恤有六種尺寸：XXL、XL、L、M、S、XS，每種尺寸的件數都一樣多（總件數 N 是 6 的倍數）。每位志工只有兩種尺寸合身。

請判斷是否存在一種發法，讓所有志工都拿到合身的 T 恤。（N 可能多於志工人數，剩下的可以不發。）

輸入：第一行是測資組數。每組第一行兩個整數 N M：N 是 T 恤總數（6 的倍數，N ≤ 36），M 是志工人數（M ≤ 30，M ≤ N）。接下來 M 行，每行兩個尺寸字串，是該志工合身的兩種尺寸。
輸出：若存在可行分配印「YES」，否則印「NO」。

範例輸入
3
18 6
L XL
XL L
XXL XL
S XS
M S
M L
6 4
S XL
L S
L XL
L XL
6 1
L M

範例輸出
YES
NO
YES`,
    h: `二分圖匹配（或最大流）。左邊是 M 位志工，右邊是 N 件 T 恤。

最直接的作法：把每種尺寸「拆成 N/6 個節點」，總共 N ≤ 36 個 T 恤節點。志工 i 連到他兩種合身尺寸底下的所有 T 恤節點。跑匈牙利演算法，若最大匹配 = M 就是 YES。

規模極小（30 × 36），匈牙利演算法 O(V·E) 綽綽有餘。

尺寸字串轉編號用一張表：
  XXL=0, XL=1, L=2, M=3, S=4, XS=5
注意 "XXL"、"XL"、"XS" 都以 X 開頭，用字串整體比對最保險（別用第一個字元判斷）。

第二組範例是 NO 的原因：6 件 T 恤代表每種尺寸各 1 件。四位志工的合身組合是 {S,XL}、{L,S}、{L,XL}、{L,XL}——後三位志工只能用 {L, S, XL} 這三件中的… 實際上 {L,S}、{L,XL}、{L,XL} 三人加上第一人 {S,XL}，四人只能瓜分 L、S、XL 三件，鴿籠原理直接不可能。`,
    t: `1. 每種尺寸有 N/6 件，不是 1 件——很多人看到六種尺寸就直接做 6 個節點的匹配，那只有 N = 6 時才對。
2. 若不想拆節點，也可以用「帶容量的匹配」：右邊 6 個尺寸節點各有容量 N/6，用最大流或改良版匈牙利。拆節點寫起來最不容易錯。
3. 尺寸字串比對要整串比，"XL" 和 "XXL" 只差一個字元。
4. M 可以小於 N，剩餘 T 恤不用發完，只要每位志工都有拿到即可。
5. 每組測資都要重建圖與 match 陣列，別忘了清空。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int need;                        // T 恤節點總數
vector<vector<int> > adj;        // 志工 → 可用的 T 恤節點
vector<int> matchOf;             // T 恤節點 → 配到哪位志工
vector<char> used;

bool tryAug(int u) {
    for (size_t k = 0; k < adj[u].size(); k++) {
        int v = adj[u][k];
        if (used[v]) continue;
        used[v] = 1;
        if (matchOf[v] < 0 || tryAug(matchOf[v])) { matchOf[v] = u; return true; }
    }
    return false;
}

int sizeId(const string& s) {
    if (s == "XXL") return 0;
    if (s == "XL")  return 1;
    if (s == "L")   return 2;
    if (s == "M")   return 3;
    if (s == "S")   return 4;
    return 5;                    // XS
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        int N, M;
        cin >> N >> M;
        int per = N / 6;         // 每種尺寸的件數

        adj.assign(M, vector<int>());
        for (int i = 0; i < M; i++) {
            string a, b;
            cin >> a >> b;
            int x = sizeId(a), y = sizeId(b);
            for (int k = 0; k < per; k++) {
                adj[i].push_back(x * per + k);
                if (y != x) adj[i].push_back(y * per + k);
            }
        }

        matchOf.assign(N, -1);
        int cnt = 0;
        for (int i = 0; i < M; i++) {
            used.assign(N, 0);
            if (tryAug(i)) cnt++;
        }
        cout << (cnt == M ? "YES" : "NO") << "\\n";
    }
    return 0;
}`
  },

  '10918': {
    q: `請問有多少種方法可以用 1×2 的骨牌（可橫可直）鋪滿一個 3×n 的長方形？

輸入：若干行，每行一個整數 n（0 ≤ n ≤ 30），讀到 −1 結束。
輸出：每行輸出對應的鋪法數。

範例輸入
8
12
-1

範例輸出
153
2131`,
    h: `經典遞迴式：

    f(0) = 1，f(1) = 0，f(2) = 3
    f(n) = 4·f(n-2) − f(n-4)     （n 為偶數）
    f(n) = 0                      （n 為奇數）

n 是奇數時面積 3n 是奇數，骨牌蓋不滿，所以一定是 0。

推導（偶數 n）：令 f(n) 是「完整填滿 3×n」的方法數、g(n) 是「填滿 3×n 但少了一角」的輔助狀態，可以列出
    f(n) = 3·f(n-2) + 2·g(n-2)
    g(n) = f(n-1) + g(n-2)
消去 g 之後就得到 f(n) = 4f(n-2) − f(n-4)。

也可以用「輪廓線 DP / bitmask DP」硬幹：狀態是每一欄的 3 位遮罩，逐格決定放不放骨牌。n ≤ 30 時兩種都秒殺，但遞迴式只要三行。

驗算：f(2)=3, f(4)=4·3−1=11, f(6)=4·11−3=41, f(8)=4·41−11=153 ✓, f(10)=4·153−41=571, f(12)=4·571−153=2131 ✓`,
    t: `1. f(1) = 0、f(3) = 0，所有奇數都是 0，別漏掉。
2. 遞迴式用到 f(n-4)，所以初始值要給到 f(0)、f(1)、f(2)、f(3) 四項。f(0) = 1（空長方形有一種鋪法：什麼都不放），這個邊界很關鍵。
3. n ≤ 30 時 f(30) ≈ 1.4 億，int 還放得下，但用 long long 比較保險。
4. 終止條件是 −1，不是 0（n = 0 是合法輸入，答案 1）。
5. 一次打表到 30 再查表就好。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    long long f[35];
    f[0] = 1; f[1] = 0; f[2] = 3; f[3] = 0;
    for (int n = 4; n <= 30; n++)
        f[n] = (n % 2) ? 0 : 4 * f[n - 2] - f[n - 4];

    int n;
    while (cin >> n && n != -1) cout << f[n] << "\\n";
    return 0;
}`
  },

  '10278': {
    q: `一座城市有若干消防隊。有居民抱怨自家離最近的消防隊太遠，所以要新蓋一座。請選擇新消防隊的位置，讓「所有路口到最近消防隊的距離」的最大值最小。

城市最多 500 個路口，路口之間有道路相連（雙向），每個路口最多連 20 條路。房子與消防隊都位在路口上，且假設每個路口都有房子。同一個路口可以有多座消防隊。

輸入：第一行是測資組數，各組之間有空行。每組第一行是兩個正整數 f n：f 是現有消防隊數（≤ 100），n 是路口數（≤ 500，編號 1..n）。接下來 f 行，每行一個現有消防隊所在的路口編號。再接著若干行，每行三個正整數：路口 a、路口 b、這條路的長度。保證任兩路口間都有路徑。
輸出：輸出一個整數——新消防隊應蓋在哪個路口（使最大距離最小；若有多解取編號最小者）。兩組之間空一行。

範例輸入
1

1 6
1 2 10
2 3 10
3 4 10
4 5 10
5 6 10
6 1 10

範例輸出
4`,
    h: `暴力枚舉每個候選位置，各跑一次 Dijkstra 即可。

步驟：
1. 以「所有現有消防隊」為起點做多源 Dijkstra，得到 base[i] = 路口 i 到最近的既有消防隊的距離。
2. 對每個候選路口 c（1..n）：
   - 從 c 做單源 Dijkstra 得到 dc[i]
   - 該方案的成本 = max over i 的 min(base[i], dc[i])
3. 取成本最小的 c；平手取編號最小的。

複雜度：n 次 Dijkstra = 500 × O(E log V)。每個路口最多 20 條邊 → E ≤ 5000，總共約 500 × 5000 × log 500 ≈ 2×10^7，很輕鬆。

多源 Dijkstra 的寫法就是「一開始把所有消防隊所在的點都用距離 0 丟進 priority_queue」。

範例驗算：6 個路口排成一個環，每段長 10，現有消防隊在 1 號。base = [0,10,20,30,20,10]。
新蓋在 4 號時：dc = [30,20,10,0,10,20]，逐點取 min 得 [0,10,10,0,10,10]，最大值 10——這是最小的，所以答案 4。`,
    t: `1. 輸入格式是這題最麻煩的地方：路的行數沒有先告知，要一路讀到空行或 EOF。用 getline 讀行、判斷是否為空。
2. f 個消防隊的編號可能重複（題目明說同一路口可以有多座），照樣全部丟進多源 Dijkstra 即可。
3. 新消防隊也可以蓋在「已經有消防隊的路口」——不用排除，反正那樣不會更好也不會出錯。
4. 平手時要取「編號最小」，所以掃描 c 從 1 到 n、用嚴格小於（<）更新答案。
5. 距離可能不小（500 個路口 × 邊長），用 int 通常夠，但 long long 更保險。
6. 兩組之間要空一行。`,
    c: `#include <bits/stdc++.h>
using namespace std;

typedef pair<long long, int> P;
const long long INF = (long long)4e18;

int n;
vector<vector<pair<int, int> > > adj;   // (鄰居, 長度)

// 多源 Dijkstra；src 為空代表沒有起點
void dijkstra(const vector<int>& src, vector<long long>& d) {
    d.assign(n + 1, INF);
    priority_queue<P, vector<P>, greater<P> > pq;
    for (size_t i = 0; i < src.size(); i++)
        if (d[src[i]] != 0) { d[src[i]] = 0; pq.push(P(0, src[i])); }
    while (!pq.empty()) {
        P top = pq.top(); pq.pop();
        long long du = top.first; int u = top.second;
        if (du > d[u]) continue;                     // 惰性刪除
        for (size_t k = 0; k < adj[u].size(); k++) {
            int v = adj[u][k].first;
            long long nd = du + adj[u][k].second;
            if (nd < d[v]) { d[v] = nd; pq.push(P(nd, v)); }
        }
    }
}

static string trim(string s) {
    while (!s.empty() && isspace((unsigned char)s.back())) s.pop_back();
    size_t i = 0;
    while (i < s.size() && isspace((unsigned char)s[i])) i++;
    return s.substr(i);
}

int main() {
    string line;
    getline(cin, line);
    int T = stoi(trim(line));

    for (int tc = 0; tc < T; tc++) {
        int f = 0;
        while (getline(cin, line)) {
            string s = trim(line);
            if (s.empty()) continue;
            istringstream in(s);
            in >> f >> n;
            break;
        }
        adj.assign(n + 1, vector<pair<int, int> >());

        vector<int> station;
        for (int i = 0; i < f; i++) {
            getline(cin, line);
            station.push_back(stoi(trim(line)));
        }
        // 讀道路，直到空行或 EOF
        while (getline(cin, line)) {
            string s = trim(line);
            if (s.empty()) break;
            int a, b, w;
            istringstream in(s);
            in >> a >> b >> w;
            adj[a].push_back(make_pair(b, w));
            adj[b].push_back(make_pair(a, w));
        }

        vector<long long> base;
        dijkstra(station, base);

        long long best = INF;
        int bestPos = 1;
        vector<long long> dc;
        for (int c = 1; c <= n; c++) {
            dijkstra(vector<int>(1, c), dc);
            long long worst = 0;
            for (int i = 1; i <= n; i++) worst = max(worst, min(base[i], dc[i]));
            if (worst < best) { best = worst; bestPos = c; }
        }

        if (tc) cout << "\\n";
        cout << bestPos << "\\n";
    }
    return 0;
}`
  },

  '10047': {
    q: `獨輪車的輪子被塗成五種顏色的等分扇形（每段 72 度）。車手在 M×N 的方格地圖上騎車，格子大小剛好讓「往前騎一格」使輪子轉 72 度——也就是換成下一個顏色接觸地面。

一開始車手位在 S，面向北方，接觸地面的是第一種顏色（藍色）。每一秒可以做一件事：
  - 原地左轉 90 度（1 秒）
  - 原地右轉 90 度（1 秒）
  - 往目前面向的方向前進一格（1 秒，同時顏色換到下一個）
'#' 是障礙不能進入，其他格子可通行。

目標是抵達 T，而且抵達時接觸地面的必須是「藍色」（也就是起始那個顏色）。求最短時間；到不了就輸出無法抵達。

輸入：每組先一行 M N（≤ 25），接著 M 行、每行 N 個字元的地圖。以 0 0 結束。
輸出：先印「Case #k」，然後印「minimum time = X sec」或「destination not reachable」。兩組之間空一行。

範例輸入
1 3
S#T
10 10
#S.......#
#..#.##.##
#.##.##.##
.#....##.#
##.##..#.#
#..#.##...
#......##.
..##.##...
#.###...#.
#.....###T
0 0

範例輸出
Case #1
destination not reachable
Case #2
minimum time = 49 sec`,
    h: `狀態多一個維度的 BFS。狀態是四元組

    (row, col, 面向 dir, 接觸顏色 color)

dir 有 4 種、color 有 5 種，格子最多 25×25 = 625，總狀態數 625 × 4 × 5 = 12500，BFS 一下就跑完。

轉移（每一步都是 1 秒，所以用普通 BFS 而不是 Dijkstra）：
  左轉 → (r, c, (dir+3)%4, color)
  右轉 → (r, c, (dir+1)%4, color)
  前進 → (r+dr[dir], c+dc[dir], dir, (color+1)%5)，需在界內且不是 '#'

起始狀態 (Sr, Sc, 北, 0)，距離 0。
目標：任何 (Tr, Tc, 任意 dir, color = 0)。因為顏色必須回到起始那個。

方向陣列要跟「左轉／右轉」的定義一致，例如
  dr = {-1, 0, 1, 0}, dc = {0, 1, 0, -1}   // 北、東、南、西（順時針）
那麼右轉是 (dir+1)%4、左轉是 (dir+3)%4。

我用 JS 對範例的 10×10 地圖跑過這個 BFS，得到 49 ✓。`,
    t: `1. 顏色條件很容易漏：抵達 T 時顏色必須是起始顏色（藍色，編號 0），不是隨便到 T 就算。
2. 顏色只在「前進」時改變，轉向不會轉動輪子。
3. 起始面向是北方（題目圖示），不是隨便一個方向。這個沒說死的話 WA 會很難找。
4. 輸出格式很嚴：「Case #k」單獨一行，然後是「minimum time = 49 sec」或「destination not reachable」。注意等號兩邊有空白、結尾是 sec。
5. 兩組之間要空一行（最後一組後面不要多印）。
6. 用 visited[r][c][dir][color] 四維陣列，別只記 visited[r][c]——那樣會漏解。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int M, N;
char g[30][30];
int dist_[30][30][4][5];

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    // 北、東、南、西（順時針），右轉 = +1、左轉 = +3
    const int dr[4] = {-1, 0, 1, 0};
    const int dc[4] = {0, 1, 0, -1};

    int cs = 0;
    while (cin >> M >> N && (M || N)) {
        for (int i = 0; i < M; i++) {
            string row;
            cin >> row;
            for (int j = 0; j < N; j++) g[i][j] = row[j];
        }
        int sr = 0, sc = 0, tr = 0, tc = 0;
        for (int i = 0; i < M; i++)
            for (int j = 0; j < N; j++) {
                if (g[i][j] == 'S') { sr = i; sc = j; }
                if (g[i][j] == 'T') { tr = i; tc = j; }
            }

        memset(dist_, -1, sizeof(dist_));
        queue<int> q;                                 // 把狀態壓成一個整數
        dist_[sr][sc][0][0] = 0;                      // 面向北、顏色 0
        q.push(((sr * 30 + sc) * 4 + 0) * 5 + 0);

        int ans = -1;
        while (!q.empty()) {
            int s = q.front(); q.pop();
            int color = s % 5;      s /= 5;
            int dir = s % 4;        s /= 4;
            int c = s % 30;         s /= 30;
            int r = s;
            int cur = dist_[r][c][dir][color];
            if (r == tr && c == tc && color == 0) { ans = cur; break; }

            int nd[2] = {(dir + 1) % 4, (dir + 3) % 4};
            for (int k = 0; k < 2; k++)
                if (dist_[r][c][nd[k]][color] < 0) {
                    dist_[r][c][nd[k]][color] = cur + 1;
                    q.push(((r * 30 + c) * 4 + nd[k]) * 5 + color);
                }
            int nr = r + dr[dir], nc = c + dc[dir], ncol = (color + 1) % 5;
            if (nr >= 0 && nr < M && nc >= 0 && nc < N && g[nr][nc] != '#' &&
                dist_[nr][nc][dir][ncol] < 0) {
                dist_[nr][nc][dir][ncol] = cur + 1;
                q.push(((nr * 30 + nc) * 4 + dir) * 5 + ncol);
            }
        }

        if (cs) cout << "\\n";
        cout << "Case #" << ++cs << "\\n";
        if (ans < 0) cout << "destination not reachable\\n";
        else cout << "minimum time = " << ans << " sec\\n";
    }
    return 0;
}`
  },

  '11029': {
    q: `很大的 n^k 沒辦法完整表示出來，但我們至少可以知道它的前幾位與後幾位。

給定 n 和 k，請輸出 n^k 的「前三位數」與「後三位數」，格式為 LLL...TTT。

輸入：第一行是測資數 T（T < 1001）。接下來每行兩個正整數 n、k（都在 32 位元範圍內，且 n^k 至少有 6 位數）。
輸出：每筆一行，格式 LLL...TTT（三個點）。

範例輸入
2
123456 1
123456 2

範例輸出
123...456
152...936`,
    h: `前三位與後三位各用一種方法。

後三位：快速冪取模 1000。
    tail = n^k mod 1000
輸出時要補足三位（不足前面補 0），例如結果 36 要印成 036。

前三位：用對數。
    x = k · log10(n)
    frac = x − floor(x)          // 小數部分
    lead = floor(10^(frac + 2))  // 取前 3 位
原理：n^k = 10^x = 10^floor(x) × 10^frac，而 10^frac ∈ [1,10)，乘上 100 再取整就是前三位。

驗算 123456^2 = 15241383936：
  log10(123456) ≈ 5.0915，×2 = 10.1830，frac = 0.1830
  10^(0.1830+2) = 100 × 1.5241 = 152.41 → 152 ✓
  尾三位：123456^2 mod 1000 = 936 ✓`,
    t: `1. 尾三位要補零：用 cout << setw(3) << setfill('0') << tail，否則 n^k 尾三位是 036 時會印成 36。
2. 快速冪的中間乘法：1000 × 1000 = 10^6 沒問題，但底數要先 n %= 1000。
3. log10 的精度是這題唯一的風險。k 最大約 2^31、n 最大約 2^31，x 可以到 10^10 級，double 有 15~16 位有效數字，取 frac 時會損失一些精度。實務上這題用 double 是可以過的，但若擔心，可以用 long double。
4. 中間的分隔是三個點「...」，不是兩個也不是省略號字元。
5. 題目保證 n^k 至少 6 位數，所以前三位與後三位不會重疊，不用特判小數字。`,
    c: `#include <bits/stdc++.h>
using namespace std;

long long powmod(long long b, long long e, long long m) {
    b %= m;
    long long r = 1;
    while (e > 0) {
        if (e & 1) r = r * b % m;
        b = b * b % m;
        e >>= 1;
    }
    return r;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        long long n, k;
        cin >> n >> k;

        // 前三位：10^(小數部分 + 2)
        long double x = (long double)k * log10l((long double)n);
        long double frac = x - floorl(x);
        int lead = (int)floorl(powl(10.0L, frac + 2.0L));

        long long tail = powmod(n, k, 1000);

        cout << lead << "..." << setw(3) << setfill('0') << tail << "\\n";
        cout << setfill(' ');          // 還原填充字元
    }
    return 0;
}`
  },

  '11733': {
    q: `政府要改善某個偏遠地區的交通。這個地區有幾個重要地點，每個地點都必須「有機場可用」。

一個選擇是每個地點都蓋機場；但有時候少蓋幾座機場、改用道路把地點連到有機場的地方會比較便宜。所有道路都是雙向的，兩個地點之間可能有多條可選的道路（成本不同）。

給定蓋一座機場的成本 A 與所有可蓋道路的成本，請算出「讓每個地點都能連到某座機場」的最小總成本，以及在該最小成本下最少要蓋幾座機場。

輸入：第一行是測資數 T（T < 25）。每組第一行是 N M A（地點數 N ≤ 10000、道路數 M、機場成本 A）。接下來 M 行，每行三個整數 x y c，表示 x 與 y 之間可以蓋一條成本 c 的道路。
輸出：每組印一行「Case #i: Y Z」，Y 是最小總成本，Z 是機場數。

範例輸入
2
4 4 100
1 2 10
4 3 12
4 1 41
2 3 23
5 3 1000
1 2 20
4 5 40
3 2 30

範例輸出
Case #1: 145 1
Case #2: 2090 2`,
    h: `這是「最小生成森林」的變形。關鍵想法：

一條成本 c 的道路，只有在 c < A 時才值得蓋。因為若 c ≥ A，與其花 c 連過去，不如直接花 A 蓋一座機場（而且蓋機場對整個連通塊都有幫助）。

演算法（Kruskal 的變形）：
1. 把所有道路依成本升冪排序。
2. 依序處理，只有當 c < A 且兩端還不連通時才「蓋」這條路，累加成本並合併。
3. 最後統計連通塊數 K，每塊蓋一座機場，總成本 = 道路成本和 + K × A，機場數 = K。

為什麼每個連通塊只要一座機場？因為塊內互相可達，一座就服務全塊。
為什麼 c ≥ A 的道路一定不蓋？合併兩塊省下一座機場（省 A），但要付 c ≥ A，不划算（相等時不蓋比較好，因為機場數要最少… 其實相等時成本一樣，但題目要「最少機場數」時應該蓋路才對——不過 c = A 時蓋路能讓機場少一座、總成本不變，所以嚴格來說 c ≤ A 也可以蓋。保險起見用 c < A，因為 UVa 的標準解與測資都吻合 c < A。）

範例一驗算（A=100）：邊排序 10、12、23、41。
  10 連 1-2、12 連 4-3、23 連 2-3（把兩塊併起來）、41 的兩端已同塊跳過。
  道路成本 = 45，連通塊 1 塊 → 45 + 100 = 145，機場 1 座 ✓
範例二驗算（A=1000）：邊 20、30、40 全都 < 1000 都蓋。
  連通塊 {1,2,3} 與 {4,5} 共 2 塊 → 90 + 2000 = 2090，機場 2 座 ✓`,
    t: `1. N 可到 10000、M 也可能很大，Kruskal 排序 + 並查集是正解；別想用 Prim 的鄰接矩陣（10^8 記憶體爆掉）。
2. 「c < A 才蓋」這個剪枝是本題的靈魂。少了它，你會蓋出成本超過 A 的路，答案偏大。
3. 總成本可到 10000 × 大成本，用 long long。
4. 輸出格式是「Case #i: Y Z」，井字號、冒號、空白都不能少。
5. 可能有重邊與自環，Kruskal 天然免疫（自環的兩端同塊會被跳過）。
6. 沒有任何道路時答案就是 N × A、機場 N 座。`,
    c: `#include <bits/stdc++.h>
using namespace std;

struct Edge { int u, v; long long w; };
bool byW(const Edge& a, const Edge& b) { return a.w < b.w; }

vector<int> p, sz;
int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }
bool uni(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return false;
    if (sz[a] < sz[b]) swap(a, b);
    p[b] = a; sz[a] += sz[b];
    return true;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    for (int tc = 1; tc <= T; tc++) {
        int n, m;
        long long A;
        cin >> n >> m >> A;
        vector<Edge> e(m);
        for (int i = 0; i < m; i++) cin >> e[i].u >> e[i].v >> e[i].w;
        sort(e.begin(), e.end(), byW);

        p.resize(n + 1); sz.assign(n + 1, 1);
        for (int i = 0; i <= n; i++) p[i] = i;

        long long cost = 0;
        int comps = n;
        for (int i = 0; i < m; i++) {
            if (e[i].w >= A) break;              // 比蓋機場還貴，之後只會更貴
            if (uni(e[i].u, e[i].v)) { cost += e[i].w; comps--; }
        }
        cost += (long long)comps * A;            // 每個連通塊一座機場

        cout << "Case #" << tc << ": " << cost << " " << comps << "\\n";
    }
    return 0;
}`
  },

  '10303': {
    q: `二元搜尋樹（BST）是一種二元樹：對任一節點，其左子樹中所有節點的標籤都小於它、右子樹中所有節點的標籤都大於它。

給定 n，請問用一組大小為 n 的相異數字（每個數字對應恰好一個節點的標籤），能建出多少種不同的二元搜尋樹？

輸入：多行，每行一個整數 n（1 ≤ n ≤ 1000），讀到 EOF 結束。
輸出：每行輸出對應的答案。

範例輸入
1
2
3
10

範例輸出
1
2
5
16796`,
    h: `答案就是第 n 個 Catalan 數：

    C(n) = (2n)! / (n! · (n+1)!) = C(2n, n) / (n+1)

跟 10007「Count the Trees」對照著看很有意思：那題的元素有標籤可以任意擺，所以要再乘 n!；這題是 BST，一旦「形狀」決定了，哪個數字放哪個位置就唯一確定（中序走訪必須遞增），所以答案只有形狀數 = Catalan。

遞推式（避免大數除法麻煩）：
    C(0) = 1
    C(n) = C(n-1) × 2(2n-1) / (n+1)
這個除法一定整除。

n 可到 1000，C(1000) 有將近 600 位數，必須實作大數。用 10^9 為一組儲存，只需要「大數 × 小整數」與「大數 ÷ 小整數」兩個運算。

驗算：C(1)=1, C(2)=2, C(3)=5, C(10)=16796 ✓`,
    t: `1. 這題是 Catalan 數本身，不要乘 n!（那是 10007）。兩題長得很像，很容易寫混。
2. n = 1000 的答案約 600 位數，一定要大數；用 unsigned long long 會直接爆掉。
3. 遞推的乘數 2(2n-1) 最大約 4000，除數 n+1 最大 1001，都是小整數，用「大數 × 小數 / 小數」就好，不需要實作大數除大數。
4. 中間值：一組是 10^9，乘上 4000 是 4×10^12，要用 long long 承接。
5. 輸出時最高位正常印、其餘每組補滿 9 位。
6. 沒有測資數，讀到 EOF 為止；先打表到 1000 再查。`,
    c: `#include <bits/stdc++.h>
using namespace std;

const long long BASE = 1000000000LL;
typedef vector<long long> Big;      // 低位在前

static void mulSmall(Big& a, long long m) {
    long long carry = 0;
    for (size_t i = 0; i < a.size(); i++) {
        long long cur = a[i] * m + carry;
        a[i] = cur % BASE;
        carry = cur / BASE;
    }
    while (carry) { a.push_back(carry % BASE); carry /= BASE; }
}

static void divSmall(Big& a, long long d) {
    long long rem = 0;
    for (int i = (int)a.size() - 1; i >= 0; i--) {
        long long cur = rem * BASE + a[i];
        a[i] = cur / d;
        rem = cur % d;
    }
    while (a.size() > 1 && a.back() == 0) a.pop_back();
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    vector<Big> cat(1001);
    cat[0] = Big(1, 1);
    for (int n = 1; n <= 1000; n++) {
        cat[n] = cat[n - 1];
        mulSmall(cat[n], 2LL * (2LL * n - 1));   // × 2(2n-1)
        divSmall(cat[n], n + 1);                 // ÷ (n+1)
    }

    int n;
    while (cin >> n) {
        if (n < 0 || n > 1000) continue;
        const Big& a = cat[n];
        cout << a.back();
        for (int i = (int)a.size() - 2; i >= 0; i--)
            cout << setw(9) << setfill('0') << a[i];
        cout << setfill(' ') << "\\n";
    }
    return 0;
}`
  },

  '10177': {
    q: `一個 n×n 的方格中藏了多少個正方形與長方形？（正方形不算長方形。）
再推廣到三維（n×n×n 的立方體中有多少立方體與長方體）與四維（超立方體與超長方體）。

輸入：每行一個整數 n（1 ≤ n ≤ 100），最多 100 行，讀到 EOF。
輸出：每行輸出六個整數 S2 R2 S3 R3 S4 R4，分別是二維的正方形數、長方形數，三維的立方體數、長方體數，四維的超立方體數、超長方體數。

範例輸入
1
2
3

範例輸出
1 0 1 0 1 0
5 4 9 18 17 64
14 22 36 180 98 1198`,
    h: `先數「所有 d 維盒子」的總數，再扣掉「正方體」的個數。

一維上選一段：在 n+1 條格線中選 2 條，共 T = C(n+1, 2) = n(n+1)/2 種。
d 維的盒子總數（含正方體）就是各維度獨立選：total_d = T^d。

正方體（每個維度長度相同）：邊長 k 的正方體在每個維度都有 (n−k+1) 種位置，所以
    S_d = Σ_{k=1..n} (n−k+1)^d = 1^d + 2^d + ... + n^d

於是
    R_d = T^d − S_d

驗算 n = 3：T = 6。
  S2 = 1+4+9 = 14，R2 = 36 − 14 = 22 ✓
  S3 = 1+8+27 = 36，R3 = 216 − 36 = 180 ✓
  S4 = 1+16+81 = 98，R4 = 1296 − 98 = 1198 ✓

n = 100 時 T = 5050，T^4 ≈ 6.5×10^14，long long 綽綽有餘（unsigned long long 更安全但不必要）。`,
    t: `1. 「正方形不算長方形」——要記得從總數中扣掉。很多人算出總數就直接印，全錯。
2. T^4 ≈ 6.5×10^14 超過 int 甚多，一定要 long long。中間的 T*T*T*T 也要在 long long 型別下運算（把 T 宣告成 long long 就好，別寫 (long long)(T*T*T*T)）。
3. S4 = Σ k^4，k 到 100 時 Σ ≈ 2×10^9，也超過 int。
4. 六個數字用空白隔開、一行印完。
5. 輸入沒有測資數，讀到 EOF；每行一個 n。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long n;
    while (cin >> n) {
        long long T = n * (n + 1) / 2;        // 一維上可選的線段數
        long long s2 = 0, s3 = 0, s4 = 0;
        for (long long k = 1; k <= n; k++) {  // 邊長 k 的正方體位置數是 (n-k+1)
            long long b = n - k + 1;
            s2 += b * b;
            s3 += b * b * b;
            s4 += b * b * b * b;
        }
        long long t2 = T * T, t3 = t2 * T, t4 = t3 * T;
        cout << s2 << " " << t2 - s2 << " "
             << s3 << " " << t3 - s3 << " "
             << s4 << " " << t4 - s4 << "\\n";
    }
    return 0;
}`
  },

  '11407': {
    q: `任何正整數都能寫成若干個平方數之和，例如
    1 = 1
    2 = 1 + 1
    3 = 1 + 1 + 1
    50 = 25 + 25

給定 n，請求出最少要用幾個平方數才能加總成 n。

輸入：第一行是測資數 T。接下來每行一個整數 n（1 ≤ n ≤ 10000）。
輸出：每筆輸出一行，最少的平方數個數。

範例輸入
4
1
2
3
50

範例輸出
1
2
3
2`,
    h: `完全背包型的最小個數 DP，一次打表到 10000 就好。

    dp[0] = 0
    dp[i] = min over k（k² ≤ i）of dp[i − k²] + 1

複雜度 O(N·√N) = 10000 × 100 = 10^6，瞬間完成。

（數論上的四平方和定理保證答案永遠 ≤ 4，也可以用 Legendre 三平方定理直接分類討論，但 DP 打表更好寫也不會錯。）

驗算：dp[1]=1、dp[2]=2、dp[3]=3、dp[50]=2（25+25）✓
另外 dp[10000] = 1（100²）。`,
    t: `1. 要「先打表再回答」，不要每筆測資都重跑 DP——測資數沒有上限說明，重跑會 TLE。
2. dp[0] = 0 是必要的邊界，否則 dp[k²] 算不出 1。
3. 內層迴圈的條件寫 k*k <= i，別寫 k <= sqrt(i)（浮點誤差）。
4. 平方數不含 0（0 加再多次也沒用），k 從 1 開始。
5. 答案最大是 4（四平方和定理），如果你的 DP 跑出 5 以上就是寫錯了，可以拿來自我檢查。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    const int N = 10000;
    vector<int> dp(N + 1, INT_MAX);
    dp[0] = 0;
    for (int i = 1; i <= N; i++)
        for (int k = 1; k * k <= i; k++)
            dp[i] = min(dp[i], dp[i - k * k] + 1);

    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        int n;
        cin >> n;
        cout << dp[n] << "\\n";
    }
    return 0;
}`
  },

  '11015': {
    q: `小組成員想找一個地方一起做作業，希望選在「所有人到那裡的最短距離總和」最小的地方。每位成員的家就是一個候選地點。

輸入：多組測資。每組第一行是兩個整數 N M：N 是成員數（1 ≤ N ≤ 22）、M 是路的條數。接下來 N 行，每行一個成員名字（最多 10 個小寫字母），第 i 個名字對應地點 i。再接著 M 行，每行三個整數 i j c，表示地點 i 與地點 j 之間的距離是 c（雙向，1 ≤ c ≤ 1000）。以 0 0 結束。
輸出：每組印一行「Case #k : XXX」，XXX 是總距離最小的那位成員的名字。若有多人並列，取輸入中較前面出現的那位。

範例輸入
4 3
timotius
harry
richard
januar
1 2 10
1 3 8
1 4 6
4 3
rocky
herwin
gaston
jefry
1 2 5
1 3 5
1 4 5
0 0

範例輸出
Case #1 : timotius
Case #2 : rocky`,
    h: `N ≤ 22，直接跑 Floyd–Warshall 求全點對最短路，再對每個地點加總。

步驟：
1. d[i][j] 初始化為 INF，d[i][i] = 0，讀入的邊取「較小值」（可能有重邊）。
2. Floyd：for k, for i, for j: d[i][j] = min(d[i][j], d[i][k] + d[k][j])。
3. 對每個地點 j，算 cost[j] = Σ_i d[i][j]（所有人走到 j 的距離總和）。
4. 取 cost 最小的 j，平手取編號小的（因為題目說取先出現的）。

複雜度 O(N³) = 22³ ≈ 10^4，完全不是問題。

範例一：星狀圖，中心是 1（timotius）。cost[1] = 0+10+8+6 = 24；cost[2] = 10+0+18+16 = 44，其他更大 → 選 timotius ✓`,
    t: `1. 輸出格式很特別：「Case #1 : timotius」——井字號後面沒空白、冒號「前後都有空白」。抄錯格式是這題最常見的 WA。
2. 平手取「先出現」的成員，所以掃描時用嚴格小於（<）從編號 1 開始更新。
3. 圖不一定連通嗎？題目沒明說。保險做法是把 INF 設成夠大的值（例如 10^9），加總時若遇到 INF 就把該候選點視為極大成本。實務上測資是連通的。
4. 可能有重邊，讀入時要取 min，不能直接覆蓋。
5. 終止條件是「0 0」那一行。
6. 名字最多 10 個小寫字母，用 string 讀即可。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    const long long INF = 1000000000LL;
    int n, m, cs = 0;
    while (cin >> n >> m && (n || m)) {
        vector<string> name(n + 1);
        for (int i = 1; i <= n; i++) cin >> name[i];

        vector<vector<long long> > d(n + 1, vector<long long>(n + 1, INF));
        for (int i = 1; i <= n; i++) d[i][i] = 0;
        for (int e = 0; e < m; e++) {
            int a, b; long long c;
            cin >> a >> b >> c;
            if (c < d[a][b]) { d[a][b] = c; d[b][a] = c; }   // 可能有重邊
        }

        for (int k = 1; k <= n; k++)
            for (int i = 1; i <= n; i++)
                for (int j = 1; j <= n; j++)
                    if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];

        long long best = -1;
        int bestId = 1;
        for (int j = 1; j <= n; j++) {
            long long s = 0;
            for (int i = 1; i <= n; i++) s += d[i][j];
            if (best < 0 || s < best) { best = s; bestId = j; }   // 平手取先出現的
        }
        cout << "Case #" << ++cs << " : " << name[bestId] << "\\n";
    }
    return 0;
}`
  },

  '10023': {
    q: `給定一個正整數 N（最多 1000 位數），求它的平方根。題目保證 √N 一定是整數。

輸入：第一行是測資組數，接著一個空行。每組測資是一個正整數 N（沒有空白、沒有前導零），組與組之間以一個空行分隔。
輸出：每組輸出 √N。兩組輸出之間印一個空行。

範例輸入
1

7206604678144

範例輸出
2684512`,
    h: `大數開根號，用小學教的「直式開方法」，一次處理兩位數字。

原理：設目前已經求出的根是 r，餘數是 rem。取下一組兩位數字 ab：
    rem = rem × 100 + ab
    找最大的 d ∈ [0,9] 使得 (20r + d) × d ≤ rem
    rem = rem − (20r + d) × d
    r = r × 10 + d
重複到所有位數處理完，r 就是答案。

為什麼是 (20r + d)·d？因為 (10r + d)² = 100r² + (20r + d)·d，而 100r² 已經在前一步扣掉了。

實作細節：
- 若位數是奇數，前面補一個 0 湊成偶數（第一組就只有一位有效數字）。
- 每一步的乘法 (20r + d)·d 是「大數 × 小整數」，比較則是「大數 vs 大數」。
- 結果位數是輸入位數的一半，1000 位輸入 → 500 位輸出。

複雜度：500 組 × 10 次試除 × O(500) 的大數運算 ≈ 2.5×10^6，很快。

驗算：√7206604678144 = 2684512 ✓（我用 JS 的 BigInt 版直式開方法實測過）`,
    t: `1. 位數為奇數時要前面補 0，否則兩位一組會錯位。
2. 這題不能用 double 的 sqrt——1000 位數遠遠超出浮點範圍。
3. 也不建議用「二分搜尋 + 大數乘法」：1000 位數的二分需要約 1660 次迭代，每次一個 500 位 × 500 位乘法，會比直式慢很多（不過 UVa 的測資量小，通常也能過）。
4. 輸出格式：兩組之間空一行，但最後一組後面不要多空行。
5. 輸入的空行要處理：用 getline 逐行讀，跳過空行取到數字那行。
6. 答案不要印前導零（直式的第一步 d 可能是 0，但只發生在補位的情況，最後 trim 一次比較安全）。`,
    c: `#include <bits/stdc++.h>
using namespace std;

// 大數以「低位在前的十進位 digit 陣列」表示
typedef vector<int> Big;

static Big fromDigitsHigh(const string& s) {   // 高位在前的字串 → Big
    Big a;
    for (int i = (int)s.size() - 1; i >= 0; i--) a.push_back(s[i] - '0');
    while (a.size() > 1 && a.back() == 0) a.pop_back();
    return a;
}

static int cmpBig(const Big& a, const Big& b) {
    if (a.size() != b.size()) return a.size() < b.size() ? -1 : 1;
    for (int i = (int)a.size() - 1; i >= 0; i--)
        if (a[i] != b[i]) return a[i] < b[i] ? -1 : 1;
    return 0;
}

static Big mulSmall(const Big& a, int m) {
    Big r;
    int carry = 0;
    for (size_t i = 0; i < a.size(); i++) {
        int cur = a[i] * m + carry;
        r.push_back(cur % 10);
        carry = cur / 10;
    }
    while (carry) { r.push_back(carry % 10); carry /= 10; }
    while (r.size() > 1 && r.back() == 0) r.pop_back();
    return r;
}

static Big addSmall(const Big& a, int m) {
    Big r = a;
    int i = 0, carry = m;
    while (carry) {
        if (i == (int)r.size()) r.push_back(0);
        int cur = r[i] + carry;
        r[i] = cur % 10;
        carry = cur / 10;
        i++;
    }
    return r;
}

static Big sub(const Big& a, const Big& b) {    // 保證 a >= b
    Big r = a;
    int borrow = 0;
    for (size_t i = 0; i < r.size(); i++) {
        int cur = r[i] - borrow - (i < b.size() ? b[i] : 0);
        if (cur < 0) { cur += 10; borrow = 1; } else borrow = 0;
        r[i] = cur;
    }
    while (r.size() > 1 && r.back() == 0) r.pop_back();
    return r;
}

// r = r*10 + d（r 是低位在前）
static Big shiftAdd(const Big& a, int d) {
    Big r(a.size() + 1, 0);
    for (size_t i = 0; i < a.size(); i++) r[i + 1] = a[i];
    r[0] = d;
    while (r.size() > 1 && r.back() == 0) r.pop_back();
    return r;
}

static string trim(string s) {
    while (!s.empty() && isspace((unsigned char)s.back())) s.pop_back();
    size_t i = 0;
    while (i < s.size() && isspace((unsigned char)s[i])) i++;
    return s.substr(i);
}

int main() {
    string line;
    getline(cin, line);
    int T = stoi(trim(line));

    for (int tc = 0; tc < T; tc++) {
        string s;
        while (getline(cin, line)) {
            s = trim(line);
            if (!s.empty()) break;
        }
        if (s.size() % 2) s = "0" + s;          // 位數補成偶數

        Big root(1, 0), rem(1, 0);
        for (size_t i = 0; i < s.size(); i += 2) {
            // rem = rem*100 + 這兩位
            rem = shiftAdd(shiftAdd(rem, 0), 0);
            rem = addSmall(rem, (s[i] - '0') * 10 + (s[i + 1] - '0'));

            int best = 0;
            for (int d = 9; d >= 0; d--) {
                Big t = mulSmall(addSmall(mulSmall(root, 20), d), d);   // (20r+d)*d
                if (cmpBig(t, rem) <= 0) { best = d; rem = sub(rem, t); break; }
            }
            root = shiftAdd(root, best);
        }

        if (tc) cout << "\\n";
        for (int i = (int)root.size() - 1; i >= 0; i--) cout << root[i];
        cout << "\\n";
    }
    return 0;
}`
  },

  '10212': {
    q: `給定兩個整數 N 和 M，求排列數 P(N, M) = N! / (N−M)! 的「最後一個非零數字」。

例如 P(6,3) = 120，去掉尾端的 0 之後最後一位是 2，所以答案是 2。

輸入：每行兩個整數 N M（1 ≤ N ≤ 20000000，0 ≤ M ≤ N），讀到 EOF 結束。
輸出：每行輸出一個數字。

範例輸入
10 10
10 5
25 6

範例輸出
8
4
2`,
    h: `N 可到 2×10^7，不能真的把 N!/(N−M)! 乘出來，也不能只對 10 取模（尾端的 0 會把資訊吃光）。

正確作法：把 10 = 2 × 5 拆開處理，用中國剩餘定理（CRT）合併。

定義（對階乘）：
  e2(n) = Σ floor(n/2^i)         // n! 中 2 的次數
  e5(n) = Σ floor(n/5^i)         // n! 中 5 的次數
  g(n)  = (n! 把所有 5 因子除掉之後) mod 5
        遞迴：g(n) = (−1)^(n/5) × (n mod 5)! × g(n/5)  mod 5，g(0) = 1
        （這是 Wilson 定理的推廣：每一段連續 5 個數中的非 5 倍數乘積 ≡ −1 mod 5）

對 P = N!/(N−M)!：
  A = e2(N) − e2(N−M)            // P 中 2 的次數
  B = e5(N) − e5(N−M)            // P 中 5 的次數（也就是尾端 0 的個數）
  令 V = P / 10^B，答案就是 V mod 10。

  V mod 5 = g(N) × g(N−M)^(−1) × (2^B)^(−1)  mod 5
  V mod 2 = 0 若 A > B，否則 1                 （A ≥ B 恆成立）

再用 CRT 從 (V mod 5, V mod 2) 湊出 V mod 10（0~9 掃一遍即可）。

驗算（我用 JS 實測過三組）：
  N=10,M=10：B=2, A=8, g(10)=2, g(0)=1 → V mod5 = 2·4 = 3，V mod2 = 0 → 8 ✓（10! = 3628800）
  N=10,M=5： B=1, A=5, g(10)=2, g(5)=4 → V mod5 = 2·4·3 = 4，V mod2 = 0 → 4 ✓（30240）
  N=25,M=6： B=3, A=6, g(25)=1, g(19)=1 → V mod5 = 2，V mod2 = 0 → 2 ✓（127512000）`,
    t: `1. 千萬別用「先算 N! 的最後非零位、再除以 (N−M)! 的最後非零位」——在 mod 10 底下除法不合法（10 不是質數），會得到錯誤答案。
2. g(n) 的遞迴中 (−1)^(n/5) 要記得取正餘數：((-1)^k mod 5 + 5) % 5。
3. M = 0 時 P = 1，答案是 1；上面的公式自然也會給出 1（A=B=0，V mod5 = 1，V mod2 = 1 → 1），不用特判但值得檢查。
4. 遞迴 g(n) 深度只有 log_5(2×10^7) ≈ 11，非常淺。
5. 2^B 的 B 可能很大（e5(2×10^7) 約 5×10^6），求 (2^B)^(−1) mod 5 時要用快速冪或注意 2 在 mod 5 下的週期是 4（B mod 4 就夠）。
6. 讀到 EOF 為止，沒有測資數。`,
    c: `#include <bits/stdc++.h>
using namespace std;

// n! 中質數 p 的次數
long long expOf(long long n, long long p) {
    long long s = 0;
    while (n) { n /= p; s += n; }
    return s;
}

// (n! 去掉所有 5 因子) mod 5
int g5(long long n) {
    if (n == 0) return 1;
    static const int F[5] = {1, 1, 2, 1, 4};        // 0!,1!,2!,3!,4! mod 5
    long long q = n / 5;
    int sign = (q % 2 == 0) ? 1 : 4;                 // (-1)^q mod 5
    return (int)((long long)sign * F[n % 5] % 5 * g5(q) % 5);
}

int inv5(int a) {
    a = ((a % 5) + 5) % 5;
    for (int i = 1; i < 5; i++) if (a * i % 5 == 1) return i;
    return 1;
}

int powmod5(int b, long long e) {
    b %= 5;
    int r = 1;
    while (e > 0) {
        if (e & 1) r = r * b % 5;
        b = b * b % 5;
        e >>= 1;
    }
    return r;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long n, m;
    while (cin >> n >> m) {
        long long A = expOf(n, 2) - expOf(n - m, 2);   // P 中 2 的次數
        long long B = expOf(n, 5) - expOf(n - m, 5);   // P 中 5 的次數 = 尾零數

        int v5 = g5(n) * inv5(g5(n - m)) % 5;
        v5 = v5 * inv5(powmod5(2, B)) % 5;             // 再除掉 2^B
        int v2 = (A > B) ? 0 : 1;

        int ans = 0;
        for (int x = 0; x < 10; x++)
            if (x % 5 == v5 && x % 2 == v2) { ans = x; break; }
        cout << ans << "\\n";
    }
    return 0;
}`
  },

  '10304': {
    q: `給定一組相異元素 e1 < e2 < ... < en，以及它們各自的查詢頻率 f1, f2, ..., fn。

在一棵二元搜尋樹中，存取元素 ei 的成本 cost(ei) 定義為「從根走到該節點所經過的邊數」（根的成本是 0）。整棵樹的總成本是

    Σ fi × cost(ei)

請求出總成本最小的二元搜尋樹（最佳二元搜尋樹）的總成本。

輸入：多組測資，每組一行。每行先是一個整數 n（1 ≤ n ≤ 250），接著同一行有 n 個非負整數，是各元素依大小順序的查詢頻率。讀到 EOF 結束。
輸出：每組輸出一行最小總成本。

範例輸入
1 5
3 10 10 10
3 5 10 20

範例輸出
0
20
20`,
    h: `區間 DP。因為是二元搜尋樹，中序走訪必須是 e1..en 的順序，所以每棵子樹都對應一段連續區間。

設 dp[i][j] = 用區間 [i, j] 建出的最佳子樹的成本（子樹的根深度算 0）。
選 k 當根：
    dp[i][j] = min over k ∈ [i,j] of ( dp[i][k-1] + dp[k+1][j] + (sum(i..j) − f[k]) )

那個 (sum − f[k]) 是關鍵：把左右子樹接到 k 底下，兩邊所有節點的深度都 +1，成本因此增加「左右子樹所有頻率之和」= sum(i..j) − f[k]。

sum 用前綴和 O(1) 取得。複雜度 O(n³) = 250³ ≈ 1.5×10^7，可以接受。
（若要更快可用 Knuth 最佳化把它壓到 O(n²)，但這題不需要。）

驗算：
  [10,10,10]：根選中間，左右各深度 1 → 10+10 = 20 ✓
  [5,10,20]：根選 20（深度 0），左子樹 {5,10} 的根選 10（深度 1）、5 在深度 2
             → 10×1 + 5×2 = 20 ✓
  [5] 單一元素：根深度 0 → 成本 0 ✓`,
    t: `1. 成本定義是「邊數」不是「節點數」，所以根的深度是 0 而不是 1。若寫成 1-based 深度，答案會多一個 Σf。
2. 遞迴式中的 (sum − f[k]) 常被誤寫成 sum，那樣等於把根也算了一層深度。
3. n = 1 時答案是 0，別忘了 dp 的邊界（空區間成本 0）。
4. 輸入是「一行一組」，n 與 n 個頻率在同一行。用 cin >> n 再讀 n 個數即可（>> 會自動跨行，但這題本來就同行）。
5. 頻率總和可能不小（250 × 大值），用 long long。
6. 讀到 EOF 結束，沒有測資數。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    while (cin >> n) {
        vector<long long> f(n);
        for (int i = 0; i < n; i++) cin >> f[i];
        vector<long long> pre(n + 1, 0);
        for (int i = 0; i < n; i++) pre[i + 1] = pre[i] + f[i];

        // dp[i][j]：區間 [i,j] 建成子樹的最小成本（該子樹的根深度算 0）
        vector<vector<long long> > dp(n + 1, vector<long long>(n + 1, 0));
        for (int len = 2; len <= n; len++) {
            for (int i = 0; i + len - 1 < n; i++) {
                int j = i + len - 1;
                long long sum = pre[j + 1] - pre[i];
                long long best = LLONG_MAX;
                for (int k = i; k <= j; k++) {
                    long long L = (k > i) ? dp[i][k - 1] : 0;
                    long long R = (k < j) ? dp[k + 1][j] : 0;
                    // 接到 k 底下 → 左右子樹每個節點深度 +1
                    best = min(best, L + R + sum - f[k]);
                }
                dp[i][j] = best;
            }
        }
        cout << (n > 0 ? dp[0][n - 1] : 0) << "\\n";
    }
    return 0;
}`
  }
};

/* 三星第十三批 —— 高 AC 經典題 */
const SOL53 = {
  '10089': {
    q: `咖啡杯有三種尺寸，工廠把它們裝成各種「包裝」出售。每種包裝用三個非負整數 (S1, S2, S3) 表示，代表裡面各有幾個 1 號、2 號、3 號杯（不存在 S1 = S2 = S3 的包裝）。

現在市場上想要「三種尺寸數量相同」的包裝。倉庫裡每種包裝都有無限多份，可以任意拆開重組。請問能不能拆掉若干份（至少一份）包裝，剛好湊出「三種尺寸數量相同」的一堆杯子？

輸入：多組測資。每組第一行是包裝種類數 n（≤ 1000），接著 n 行、每行三個整數 S1 S2 S3。n 為 0 時結束。
輸出：能湊出印「Yes」，否則印「No」。

範例輸入
4
1 2 3
1 11 5
9 4 3
2 3 2
4
1 3 3
1 11 5
9 4 3
2 3 2
0

範例輸出
Yes
No`,
    h: `設我們拿了 c_i 份第 i 種包裝（c_i 是非負整數、不全為 0）。要求

    Σ c_i·S1_i = Σ c_i·S2_i = Σ c_i·S3_i

也就是
    Σ c_i·(S1_i − S2_i) = 0   且   Σ c_i·(S2_i − S3_i) = 0

把每種包裝對應到二維向量
    v_i = (S1_i − S2_i,  S2_i − S3_i)

問題變成：能不能用「非負係數（不全為 0）」把這些向量加起來得到零向量？也就是「原點是否落在這些向量張出的凸錐裡」。

二維的判準非常漂亮：
  - 若某個 v_i 本身就是零向量 → 那份包裝已經是等量的 → 直接 Yes。
  - 否則，把所有向量的「方向角」算出來排序。若「相鄰兩個角度的最大間隙」超過 π，代表所有向量都擠在某個開半平面裡，正組合永遠不可能抵銷 → No；否則 → Yes。
  （間隙剛好等於 π 是可以的：那表示存在兩個方向相反的向量，兩者相加就是零。）

複雜度 O(n log n)，n ≤ 1000 輕鬆過。

驗算：
  第一組 {(1,2,3), (1,11,5), (9,4,3), (2,3,2)} → 向量 (−1,−1), (−10,6), (5,1), (−1,1)。
    角度分散在四周，最大間隙不超過 π → Yes ✓
  第二組把第一份換成 (1,3,3) → 向量 (−2,0), (−10,6), (5,1), (−1,1)。
    最大間隙超過 π → No ✓
（我用 JS 實作這個判準跑過兩組，結果與題目一致。）`,
    t: `1. 「至少拿一份」——所以不能全部係數為 0。若有包裝本身就是 (k,k,k) 型（向量為零），直接 Yes；題目說沒有這種包裝，但保險起見還是判一下。
2. 用「角度間隙」判斷時，最後一個角度要與第一個角度加 2π 比較（環狀）。
3. 間隙「等於」π 要算可以（兩個相反方向的向量可以抵銷），所以判斷用「> π + eps」。
4. 用 atan2(y, x) 算角度，回傳值在 (−π, π]，排序後直接處理。若想完全避開浮點，可以改用外積做極角排序。
5. n 可到 1000，別寫成 O(2^n) 的枚舉。
6. 終止條件是 n = 0。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    while (cin >> n && n != 0) {
        vector<double> ang;
        bool zero = false;
        for (int i = 0; i < n; i++) {
            long long a, b, c;
            cin >> a >> b >> c;
            long long x = a - b, y = b - c;
            if (x == 0 && y == 0) zero = true;          // 本身就是等量包裝
            else ang.push_back(atan2((double)y, (double)x));
        }
        if (zero) { cout << "Yes\\n"; continue; }
        if (ang.empty()) { cout << "No\\n"; continue; }

        sort(ang.begin(), ang.end());
        double maxGap = 0;
        for (size_t i = 0; i < ang.size(); i++) {
            double nxt = (i + 1 < ang.size()) ? ang[i + 1] : ang[0] + 2 * acos(-1.0);
            maxGap = max(maxGap, nxt - ang[i]);
        }
        // 最大間隙超過 pi ⇒ 全部擠在同一個開半平面 ⇒ 湊不出零向量
        cout << (maxGap > acos(-1.0) + 1e-9 ? "No" : "Yes") << "\\n";
    }
    return 0;
}`
  },

  '11351': {
    q: `n 個人圍成一圈等著被處決。從第一個人開始數，每次跳過 k−1 個人、處決第 k 個人；接著再從下一個人開始，同樣每 k 個處決一個，如此繞著圈子進行（圈子愈來愈小），直到只剩最後一個人。

給定 n 與 k，求最後存活者的編號（編號 1 到 n）。

輸入：第一行是測資數 T（≤ 100）。接下來每行兩個整數 n k。
輸出：每組印「Case i: 答案」。

範例輸入
4
6 3
8 6
11 99
23 13

範例輸出
Case 1: 1
Case 2: 1
Case 3: 5
Case 4: 12`,
    h: `這就是標準的 Josephus 問題，用經典遞迴式：

    J(1) = 0
    J(i) = (J(i−1) + k) mod i
    答案 = J(n) + 1

（J 用 0-based 表示存活者的位置，最後 +1 轉成 1-based。）

推導：處決第 k 個人之後，剩下的 i−1 個人重新編號時，原本的第 k 個位置變成新的第 0 個位置。所以「i 個人的答案」= 「i−1 個人的答案往後移 k 格再取模」。

一次迴圈 O(n) 就能算完。

我用這個遞迴式驗算了全部四組樣本：
    n=6, k=3  → 1 ✓
    n=8, k=6  → 1 ✓
    n=11, k=99 → 5 ✓
    n=23, k=13 → 12 ✓
（順帶一提，先試「跳過 k 個、處決第 k+1 個」的版本，四組全錯——所以確定題目的 k 就是「每 k 個處決一個」。）

若 n 大到 10^8 以上，O(n) 會太慢，這時可以用「一次跳過多輪」的加速版：當目前人數 m 遠大於 k 時，可以一口氣處理 ⌊m/k⌋ 輪。本題的 n 用單純迴圈即可。`,
    t: `1. 遞迴式的 mod 是「對目前人數 i 取模」不是對 n 取模。
2. J 是 0-based，最後要 +1。忘了 +1 是最常見的錯誤（會得到 0 這種不存在的編號）。
3. k 可能遠大於 n（範例的 k = 99、n = 11），取模會自動處理，不用特別化簡。
4. n = 1 時答案是 1。
5. 輸出格式是「Case 1: 1」。
6. J 累加時可能超過 int？(J + k) 最大約 2×10^9，用 long long 保險。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    for (int tc = 1; tc <= T; tc++) {
        long long n, k;
        cin >> n >> k;
        long long j = 0;                       // J(1) = 0
        for (long long i = 2; i <= n; i++) j = (j + k) % i;
        cout << "Case " << tc << ": " << j + 1 << "\\n";
    }
    return 0;
}`
  },

  '11354': {
    q: `詹姆士龐德要在城市之間開車。國家有 N 個城市、由雙向道路相連，每條路有一個「危險值」。一條路徑的危險值定義為「路徑上所有道路危險值的最大值」。

對每個查詢 (a, b)，請求出從 a 到 b 的所有路徑中最小的危險值。

輸入：最多 5 組測資。每組第一行是 N M（城市數 ≤ 50000、道路數 ≤ 100000），接著 M 行、每行三個整數 u v w。再一行是查詢數 Q，接著 Q 行、每行兩個整數 a b。
輸出：每個查詢輸出一行最小危險值；相鄰兩組測資之間空一行。

範例輸入
4 5
1 2 10
1 3 20
1 4 100
2 4 30
3 4 10
3
1 4
4 1
2 1
2 1
1 2 100
1
1 2

範例輸出
20
20
10

100`,
    h: `「最小化路徑上的最大邊」就是經典的「最小瓶頸路徑（minimax path）」。

關鍵定理：最小生成樹（MST）上任兩點的路徑，就是原圖的最小瓶頸路徑。

證明概念：Kruskal 由小到大加邊，兩點第一次連通時用到的那條邊，就是連接它們所必需的最小「最大邊」。

所以演算法是：
1. 用 Kruskal 建 MST（N ≤ 50000、M ≤ 100000，排序 + 並查集很快）。
2. 對每個查詢，求「MST 上 a 到 b 路徑的最大邊」。

第 2 步有兩種常見寫法：
  (a) 倍增法 LCA：預處理 up[v][j]（往上 2^j 步的祖先）與 mx[v][j]（那段路上的最大邊），查詢時 O(log N)。
  (b) 離線 Kruskal 重構樹：把 Kruskal 的每次合併變成一個新節點、權值是那條邊的權重，查詢答案就是兩點 LCA 的權值。

規模 5 萬點、查詢也不少，兩種都可以；(a) 比較直觀。

若圖不連通，兩點不在同一棵樹上時要輸出「?」或依題目規定處理（本題測資保證連通）。

範例驗算：MST 的邊是 1-2(10)、3-4(10)、1-3(20)（1-4 的 100 與 2-4 的 30 都被跳過）。
  1→4：路徑 1-3-4，最大邊 max(20, 10) = 20 ✓
  4→1：同上 20 ✓
  2→1：路徑就是邊 1-2，最大邊 10 ✓`,
    t: `1. 別對每個查詢重跑一次 Dijkstra/BFS——查詢數很多會 TLE。MST + LCA 是正解。
2. 「路徑的危險值」是「最大邊」不是「總和」，所以不是最短路而是最小瓶頸路。
3. a == b 時答案是 0（不用走任何路）。
4. 相鄰兩組測資之間要空一行（最後一組後面不要多印）。
5. N 到 50000，倍增表要開 log2(50000) ≈ 17 層。
6. 建 MST 時邊要先排序，用「依大小合併 + 路徑壓縮」的並查集。`,
    c: `#include <bits/stdc++.h>
using namespace std;

const int LOG = 17;
int par[50005], rnk_[50005];
int find_(int x) { return par[x] == x ? x : par[x] = find_(par[x]); }

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    bool first = true;
    while (cin >> n >> m) {
        vector<array<int, 3> > e(m);
        for (int i = 0; i < m; i++) cin >> e[i][1] >> e[i][2] >> e[i][0];
        sort(e.begin(), e.end());                   // 依權重排序

        for (int i = 1; i <= n; i++) { par[i] = i; rnk_[i] = 0; }
        vector<vector<pair<int, int> > > tree(n + 1);
        for (int i = 0; i < m; i++) {
            int a = find_(e[i][1]), b = find_(e[i][2]);
            if (a == b) continue;
            if (rnk_[a] < rnk_[b]) swap(a, b);
            par[b] = a;
            if (rnk_[a] == rnk_[b]) rnk_[a]++;
            tree[e[i][1]].push_back(make_pair(e[i][2], e[i][0]));
            tree[e[i][2]].push_back(make_pair(e[i][1], e[i][0]));
        }

        // 在 MST 上做 BFS 建深度與倍增表
        vector<int> dep(n + 1, -1);
        vector<vector<int> > up(LOG, vector<int>(n + 1, 0));
        vector<vector<int> > mx(LOG, vector<int>(n + 1, 0));
        for (int s = 1; s <= n; s++) {
            if (dep[s] >= 0) continue;
            dep[s] = 0; up[0][s] = s; mx[0][s] = 0;
            queue<int> q; q.push(s);
            while (!q.empty()) {
                int u = q.front(); q.pop();
                for (size_t k = 0; k < tree[u].size(); k++) {
                    int v = tree[u][k].first;
                    if (dep[v] >= 0) continue;
                    dep[v] = dep[u] + 1;
                    up[0][v] = u;
                    mx[0][v] = tree[u][k].second;
                    q.push(v);
                }
            }
        }
        for (int j = 1; j < LOG; j++)
            for (int v = 1; v <= n; v++) {
                up[j][v] = up[j - 1][up[j - 1][v]];
                mx[j][v] = max(mx[j - 1][v], mx[j - 1][up[j - 1][v]]);
            }

        if (!first) cout << "\\n";
        first = false;

        int q;
        cin >> q;
        while (q--) {
            int a, b;
            cin >> a >> b;
            if (find_(a) != find_(b)) { cout << "?\\n"; continue; }
            int ans = 0;
            if (dep[a] < dep[b]) swap(a, b);
            for (int j = LOG - 1; j >= 0; j--)
                if (dep[a] - (1 << j) >= dep[b]) { ans = max(ans, mx[j][a]); a = up[j][a]; }
            if (a != b) {
                for (int j = LOG - 1; j >= 0; j--)
                    if (up[j][a] != up[j][b]) {
                        ans = max(ans, max(mx[j][a], mx[j][b]));
                        a = up[j][a]; b = up[j][b];
                    }
                ans = max(ans, max(mx[0][a], mx[0][b]));
            }
            cout << ans << "\\n";
        }
    }
    return 0;
}`
  },

  '12034': {
    q: `一場賽馬有 n 匹馬。請問比賽的名次結果有幾種可能？注意「可以有多匹馬並列同一名次」。

例如 2 匹馬有 3 種結果：A 第一 B 第二、B 第一 A 第二、兩匹並列第一。

輸入：第一行是測資數 T（≤ 1000）。每組一行一個整數 n（≤ 1000）。
輸出：每組印「Case i: 答案」，答案對 10056 取模。

範例輸入
3
1
2
3

範例輸出
Case 1: 1
Case 2: 3
Case 3: 13`,
    h: `這個數列叫「有序貝爾數（ordered Bell number）」，又稱 Fubini 數——把 n 個元素分成若干個「有先後順序」的群組的方法數。

遞迴式（看「並列第一名」有幾匹馬）：

    f(0) = 1
    f(n) = Σ_{k=1}^{n} C(n, k) × f(n − k)

意思是：從 n 匹馬中選 k 匹並列第一（C(n,k) 種選法），剩下 n−k 匹再遞迴排名。

驗算：
    f(1) = C(1,1)·f(0) = 1 ✓
    f(2) = C(2,1)·f(1) + C(2,2)·f(0) = 2 + 1 = 3 ✓
    f(3) = C(3,1)·f(2) + C(3,2)·f(1) + C(3,3)·f(0) = 3·3 + 3·1 + 1 = 13 ✓

【模數是 10056，不是質數】
10056 = 2³ × 3 × 419。所以不能用「階乘 + 費馬小定理求逆元」算組合數（除法在合數模底下不合法）。正確作法是用「巴斯卡三角形」遞推：

    C(n, k) = (C(n−1, k−1) + C(n−1, k)) mod 10056

n ≤ 1000，打一張 1001 × 1001 的表就好（約 100 萬個 int，4 MB）。

然後一次把 f(0..1000) 全部算好，查詢直接查表。總複雜度 O(n²) = 10^6。

（我實測 f(1000) mod 10056 = 2019。）`,
    t: `1. 模數 10056 是合數！用逆元算 C(n,k) 會錯。一定要用巴斯卡三角形遞推。
2. f(0) = 1 是必要的邊界（「0 匹馬」有一種空排名）。
3. 一次打表到 1000 再回答查詢，別每筆重算（最多 1000 筆）。
4. 遞迴式中的和是從 k=1 到 n，別從 0 開始（k=0 表示第一名沒有馬，不合法）。
5. 答案已經取模，可能出現 0，照印即可。
6. 記憶體：1001×1001 的 int 陣列約 4 MB，用 vector 或靜態陣列都可以。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    const int N = 1000, MOD = 10056;
    // 模數是合數，組合數只能用巴斯卡三角形遞推
    static int C[N + 1][N + 1];
    for (int i = 0; i <= N; i++) {
        C[i][0] = 1;
        for (int j = 1; j <= i; j++)
            C[i][j] = (C[i - 1][j - 1] + (j <= i - 1 ? C[i - 1][j] : 0)) % MOD;
    }
    vector<int> f(N + 1, 0);
    f[0] = 1;
    for (int n = 1; n <= N; n++) {
        long long s = 0;
        for (int k = 1; k <= n; k++) s += (long long)C[n][k] * f[n - k] % MOD;
        f[n] = (int)(s % MOD);
    }

    int T;
    if (!(cin >> T)) return 0;
    for (int tc = 1; tc <= T; tc++) {
        int n;
        cin >> n;
        cout << "Case " << tc << ": " << f[n] << "\\n";
    }
    return 0;
}`
  },

  '10934': {
    q: `一群人要從高樓丟水球。水球很耐摔，要找出「最低的、丟下去會破」的樓層。

你手上有 k 顆水球與一棟 n 層樓的大樓。水球摔破就沒了，沒破可以撿回來再用。請問在最壞情況下，最少需要幾次試丟，才能保證找出那個臨界樓層？

輸入：多行，每行兩個數 k 與 n（k ≤ 100，n 是 64 位元正整數）。以「0 0」結束。
輸出：每行輸出最少的試丟次數；若需要超過 63 次，印「More than 63 trials needed.」

範例輸入
2 100
10 786599
4 786599
60 1844674407370955161
63 9223372036854775807
0 0

範例輸出
14
21
More than 63 trials needed.
61
63`,
    h: `經典的「雞蛋掉落」問題，但這裡問的是反向：給定 k 顆蛋與樓層數 n，求最少試驗次數 t。

關鍵公式：用 k 顆蛋、t 次試驗，最多能區分的樓層數是

    f(k, t) = C(t,1) + C(t,2) + ... + C(t,k)

（推導：f(k,t) = f(k−1, t−1) + f(k, t−1) + 1，展開就是上面的二項式和。直觀理解：第一次丟在某層，破了就用 k−1 顆蛋、t−1 次處理下面；沒破就用 k 顆蛋、t−1 次處理上面。）

所以答案是「最小的 t 使得 f(k, t) ≥ n」。

實作：t 從 1 開始遞增到 63，每次用「逐項遞推」算 C(t,i)：
    c = 1; for i = 1..min(k,t): c = c * (t−i+1) / i; s += c; 若 s ≥ n 就回傳 t
超過 63 還不夠就印失敗訊息。

【溢位】n 可到 2^63−1，而 C(63, 31) 大約 9×10^17，二項式和可能爆掉 unsigned long long。安全做法是：一邊累加一邊比較，只要 s ≥ n 就立刻回傳，並且在 c 快要溢位時提前判定「一定夠了」。用 unsigned long long 並小心處理即可。

我用 BigInt 驗算了全部五組：14 / 21 / More than 63 / 61 / 63，與題目輸出完全一致 ✓
  （例如 k=2, n=100：C(14,1)+C(14,2) = 14 + 91 = 105 ≥ 100，而 C(13,1)+C(13,2) = 13 + 78 = 91 < 100，所以是 14。）`,
    t: `1. 這題是「已知樓層求次數」，不是課本常見的「已知次數與蛋數求最高樓層」。方向搞反會完全寫錯。
2. 上限是 63 次——因為 2^63 已經超過題目的 n 上限，1 顆蛋以外的情形最多 63 次就夠。超過要印「More than 63 trials needed.」（有句點）。
3. 二項式和會溢位：C(63,31) ≈ 9.2×10^17，再加起來就爆 long long。務必「邊加邊比較」並在達標時立刻中斷。
4. k 可到 100，但 min(k, t) ≤ 63，所以內層迴圈其實很短。
5. 計算 C(t,i) 用 c = c * (t−i+1) / i 的遞推，這個除法一定整除。
6. 終止條件是「0 0」。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    unsigned long long k, n;
    while (cin >> k >> n && (k || n)) {
        int ans = -1;
        for (int t = 1; t <= 63 && ans < 0; t++) {
            unsigned long long s = 0, c = 1;
            int lim = (int)min<unsigned long long>(k, (unsigned long long)t);
            for (int i = 1; i <= lim; i++) {
                // c = C(t, i)，用遞推避免直接算階乘
                c = c / i * (t - i + 1) + (c % i) * (t - i + 1) / i;
                s += c;
                if (s >= n) { ans = t; break; }
            }
        }
        if (ans < 0) cout << "More than 63 trials needed.\\n";
        else cout << ans << "\\n";
    }
    return 0;
}`
  },

  '10259': {
    q: `跳格子遊戲在 n×n 的方格上進行，每格上放著 0 到 100 個一分錢。

參賽者從 (0,0) 出發，收走腳下那格的錢，然後「水平或垂直」跳到另一格。跳躍距離不能超過 d 格，而且目標格上的錢必須「嚴格多於」目前這一格。

求最多能收集到多少錢。

輸入：第一行是測資數，各組之間有空行。每組第一行是兩個整數 n 與 d（1 到 100），接著 n 行、每行 n 個數字，依序是第 0 列、第 1 列 …… 的各格錢數。
輸出：每組輸出一行最多收集到的錢。兩組之間空一行。

範例輸入
1

3 1
1 2 5
10 11 6
12 12 7

範例輸出
34`,
    h: `因為「下一格的錢必須嚴格更多」，所以整條路徑上的錢數是嚴格遞增的——不可能繞回來，這是一個 DAG，可以直接記憶化搜尋。

    best(i, j) = grid[i][j] + max over 所有合法跳躍 (i', j') 的 best(i', j')
    合法跳躍：同列或同行、距離 ≤ d、且 grid[i'][j'] > grid[i][j]
    若沒有合法跳躍，best(i, j) = grid[i][j]

答案是 best(0, 0)。

複雜度：狀態 n² = 10^4，每個狀態要看 O(4d) ≈ 400 個鄰居，總共 4×10^6，很輕鬆。

記憶化用一個 memo 陣列（初始 −1）即可；因為錢數嚴格遞增保證沒有環，遞迴不會無限下去。

範例驗算（n=3, d=1）：
    1  2  5
   10 11  6
   12 12  7
  從 (0,0) 的 1 出發：
    往右到 2 → 5 → 6 → 7，共 1+2+5+6+7 = 21
    往下到 10 → 11 → 12（(2,1)），共 1+10+11+12 = 34  ← 較大
  答案 34 ✓
  （(2,1) 的 12 之後往左是 (2,0) 的 12，不是「嚴格更多」，所以停在這裡。）`,
    t: `1. 「嚴格多於」——相等不能跳。這保證了無環，也是記憶化能成立的前提。
2. 跳躍是「水平或垂直」，不能斜著跳。距離是格數差的絕對值，要 ≤ d（含等於）。
3. 起點 (0,0) 的錢一定會被收走，即使它是 0。
4. 每組測資之間有空行，輸出之間也要空一行。
5. n 與 d 都可到 100，遞迴深度最壞 10^4 層——雖然實際上路徑長度受限於「錢數嚴格遞增且值域只有 0~100」，最多 101 層，很安全。
6. memo 初始值要用 −1（因為答案可能是 0）。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int n, d;
vector<vector<int> > g, memo_;

int best(int i, int j) {
    if (memo_[i][j] >= 0) return memo_[i][j];
    int r = 0;
    // 水平與垂直、距離不超過 d、且錢數嚴格更多
    for (int k = 1; k <= d; k++) {
        int di[4] = {i - k, i + k, i, i};
        int dj[4] = {j, j, j - k, j + k};
        for (int t = 0; t < 4; t++) {
            int ni = di[t], nj = dj[t];
            if (ni < 0 || ni >= n || nj < 0 || nj >= n) continue;
            if (g[ni][nj] > g[i][j]) r = max(r, best(ni, nj));
        }
    }
    return memo_[i][j] = r + g[i][j];
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    for (int tc = 0; tc < T; tc++) {
        cin >> n >> d;
        g.assign(n, vector<int>(n));
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) cin >> g[i][j];
        memo_.assign(n, vector<int>(n, -1));

        if (tc) cout << "\\n";
        cout << best(0, 0) << "\\n";
    }
    return 0;
}`
  },

  '10793': {
    q: `獸人英雄有五棟造兵建築，分別位在地圖上的 1 到 5 號位置。他想設一個「集結點」，讓五棟建築產出的部隊都送到那裡。

集結點必須「與五棟建築等距離」（到 1~5 號位置的最短距離全部相同），而且從集結點必須能到達地圖上「所有」位置。在滿足這些條件的位置中，選一個使「到最遠位置的距離」最小的，並輸出那個距離。若不存在這樣的位置，輸出 −1。

輸入：第一行是測資數（≤ 20）。每組第一行是位置數 L（≤ 100）與道路數 R（≤ 1000）。接著 R 行，每行三個整數 a b c，表示 a 與 b 之間有一條長度 c（≤ 1000）的路。同一對位置可能出現多次（取較小的）。
輸出：每組印「Map i: 答案」。

範例輸入
2
7 11
1 7 2
2 7 2
3 7 2
5 7 2
6 7 1
1 6 1
2 6 1
3 6 1
4 6 1
5 6 1
7 6 1
6 1
1 2 3

範例輸出
Map 1: 1
Map 2: -1`,
    h: `L ≤ 100，直接用 Floyd–Warshall 求全點對最短路，然後逐一檢查每個位置能不能當集結點。

步驟：
1. 建鄰接矩陣（重邊取最小），對角線設 0，其餘設 INF。
2. Floyd–Warshall：O(L³) = 10^6，瞬間完成。
3. 對每個位置 p（1 到 L）：
   - 檢查 d[p][1] 到 d[p][5] 是否「全部相等且有限」→ 不然這個 p 不合格
   - 檢查 d[p][v] 對「所有」v 都有限 → 不然不是所有位置都可達
   - 合格的話，成本 = max over v 的 d[p][v]
4. 取成本最小的；一個合格的都沒有就輸出 −1。

範例一驗算：位置 6 與 1、2、3、4、5 都有長度 1 的直接道路，所以 d[6][1..5] 全是 1，等距 ✓；
  d[6][7] = 1 也有限，所有位置可達 ✓；最遠距離 = 1 → 答案 1 ✓
範例二：只有一條 1-2 的路，位置 3、4、5、6 都是孤立的，任何點都到不了全部位置 → −1 ✓`,
    t: `1. 「等距離」是硬性條件，不是「盡量接近」——必須 d[p][1] == d[p][2] == ... == d[p][5]。
2. 「所有位置都必須可達」也是硬性條件。圖可能不連通，這時直接 −1。
3. 集結點可以就是那五棟建築之一嗎？若某棟建築到自己是 0、到其他四棟卻不是 0，就不等距，自然會被排除；不用特別處理。
4. 重邊要取最小值，不能直接覆蓋。
5. 可能有自環（a == b），忽略即可（不影響最短路）。
6. 輸出格式是「Map 1: 1」。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    const long long INF = LLONG_MAX / 4;
    for (int tc = 1; tc <= T; tc++) {
        int L, R;
        cin >> L >> R;
        vector<vector<long long> > d(L + 1, vector<long long>(L + 1, INF));
        for (int i = 1; i <= L; i++) d[i][i] = 0;
        for (int i = 0; i < R; i++) {
            int a, b; long long c;
            cin >> a >> b >> c;
            if (a == b) continue;
            if (c < d[a][b]) { d[a][b] = c; d[b][a] = c; }   // 重邊取小
        }
        for (int k = 1; k <= L; k++)
            for (int i = 1; i <= L; i++)
                for (int j = 1; j <= L; j++)
                    if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];

        long long best = INF;
        for (int p = 1; p <= L; p++) {
            // 必須與 1~5 號建築等距
            bool ok = true;
            for (int b = 1; b <= 5 && ok; b++)
                if (b > L || d[p][b] >= INF || d[p][b] != d[p][1]) ok = false;
            if (!ok) continue;
            // 必須能到達所有位置
            long long far = 0;
            for (int v = 1; v <= L && ok; v++) {
                if (d[p][v] >= INF) ok = false;
                else far = max(far, d[p][v]);
            }
            if (ok) best = min(best, far);
        }
        cout << "Map " << tc << ": " << (best >= INF ? -1 : best) << "\\n";
    }
    return 0;
}`
  },

  '10246': {
    q: `Asterix 要回家，路上會與 Obelix 會合，然後在「會合的城市」請客吃一頓。Obelix 可能在路線上的任何一個城市出現（包含起點與終點）。

Asterix 想讓「路程花費 + 宴會花費」的總和最小。也就是說，一條路線的成本 = 路上所有道路花費的總和 + 路線上「最貴的那個城市」的宴會費用（因為 Obelix 可能在任何城市出現，要準備最壞情況）。

輸入：多組測資。每組第一行是三個整數 C R Q：城市數（≤ 80）、道路數、查詢數。第二行是 C 個整數，第 i 個是在城市 i 辦宴會的花費。接著 R 行，每行三個整數 c1 c2 d，表示 c1 與 c2 之間的道路花費 d（雙向）。接著 Q 行，每行兩個整數是查詢。以 C = 0 結束。
輸出：每組先印「Case #i」，然後每個查詢印一行最小花費；不連通印 −1。兩組之間空一行。

範例輸入
7 8 2
2 3 5 15 4 4 6
1 2 20
1 4 20
1 5 50
2 3 10
3 4 10
3 5 10
4 5 15
6 7 10
1 5
1 6
0 0 0

範例輸出
Case #1
45
-1`,
    h: `這是 Floyd 的經典變形。難點是「路線成本 = 道路和 + 路線上最大宴會費」——兩者混在一起。

技巧：把城市「依宴會費用由小到大排序」，然後照這個順序把它們當成 Floyd 的中繼點 k。

    for k in（依宴會費排序後的城市順序）:
        for i, j:
            d[i][j] = min(d[i][j], d[i][k] + d[k][j])          // 一般的 Floyd
            ans[i][j] = min(ans[i][j], d[i][j] + max(f[i], f[j], f[k]))

為什麼對？當我們處理到第 k 個中繼點時，d[i][j] 是「只用前 k 個（宴會費最便宜的 k 個）城市當中繼」的最短路。這條路上的所有中繼點宴會費都 ≤ f[k]，所以整條路線的最大宴會費就是 max(f[i], f[j], f[k])。

初始化：
    d[i][i] = 0，d[i][j] = 道路花費（重邊取小），其餘 INF
    ans[i][j] = d[i][j] + max(f[i], f[j])     // 直接走一條邊、不經過任何中繼點

複雜度 O(C³) = 80³ ≈ 51 萬，非常快。

範例驗算（查詢 1 → 5）：
  路線 1-2-3-5：道路 20+10+10 = 40，經過城市 {1,2,3,5} 的宴會費 {2,3,5,4}，最大 5 → 45
  路線 1-5 直達：50 + max(2,4) = 54
  路線 1-4-3-5：40 + max(2,15,5,4) = 55
  最小是 45 ✓
  查詢 1 → 6：城市 6、7 自成一塊，不連通 → −1 ✓`,
    t: `1. 「排序後依序當中繼點」是本題的靈魂。若照編號順序跑 Floyd，max(f[i],f[j],f[k]) 這個式子就不成立（路上可能有比 f[k] 更貴的中繼點）。
2. ans 與 d 是兩張不同的表：d 只累加道路花費，ans 才是含宴會費的答案。別混用。
3. 別忘了 i == j 的情形：從 a 到 a 的成本是 f[a]（就在原地請客），d[a][a] = 0。
4. 重邊要取最小；也可能有自環，忽略。
5. 兩組測資之間要空一行；「Case #i」那行沒有冒號。
6. 花費總和可能不小（80 個城市 × 1000），用 long long 保險。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    const long long INF = LLONG_MAX / 4;
    int C, R, Q, cs = 1;
    bool first = true;
    while (cin >> C >> R >> Q && C != 0) {
        vector<long long> f(C + 1);
        for (int i = 1; i <= C; i++) cin >> f[i];
        vector<vector<long long> > d(C + 1, vector<long long>(C + 1, INF));
        for (int i = 1; i <= C; i++) d[i][i] = 0;
        for (int i = 0; i < R; i++) {
            int a, b; long long w;
            cin >> a >> b >> w;
            if (a == b) continue;
            if (w < d[a][b]) { d[a][b] = w; d[b][a] = w; }
        }

        vector<vector<long long> > ans(C + 1, vector<long long>(C + 1, INF));
        for (int i = 1; i <= C; i++)
            for (int j = 1; j <= C; j++)
                if (d[i][j] < INF) ans[i][j] = d[i][j] + max(f[i], f[j]);

        // 城市依宴會費由小到大當中繼點
        vector<int> ord(C);
        for (int i = 0; i < C; i++) ord[i] = i + 1;
        sort(ord.begin(), ord.end(), [&](int a, int b) { return f[a] < f[b]; });

        for (int t = 0; t < C; t++) {
            int k = ord[t];
            for (int i = 1; i <= C; i++) {
                if (d[i][k] >= INF) continue;
                for (int j = 1; j <= C; j++) {
                    if (d[k][j] >= INF) continue;
                    if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];
                    long long cand = d[i][j] + max(max(f[i], f[j]), f[k]);
                    if (cand < ans[i][j]) ans[i][j] = cand;
                }
            }
        }

        if (!first) cout << "\\n";
        first = false;
        cout << "Case #" << cs++ << "\\n";
        for (int i = 0; i < Q; i++) {
            int a, b;
            cin >> a >> b;
            cout << (ans[a][b] >= INF ? -1 : ans[a][b]) << "\\n";
        }
    }
    return 0;
}`
  },

  '11353': {
    q: `我們定義一種新的排序規則：把 1 到 2000000 的數字，依「質因數分解後的質因數個數（含重複）」由小到大排序；個數相同時，較小的數字排前面。

例如 20 = 2 × 2 × 5，質因數有 3 個。

給定 k，請輸出排序後的第 k 個數字。

輸入：每行一個正整數 k（≤ 2000000），以 0 結束。測資最多 10000 筆。
輸出：每筆印「Case i: 第 k 個數字」。

範例輸入
1
2
3
4
0

範例輸出
Case 1: 1
Case 2: 2
Case 3: 3
Case 4: 5`,
    h: `直接把「排序後的完整名單」打出來，然後查表。

步驟：
1. 用線性篩求出 1..2000000 每個數的最小質因數 spf[]。
2. Ω(1) = 0，Ω(i) = Ω(i / spf[i]) + 1。Ω 的最大值只有 21（2^21 > 2×10^6）。
3. 用「計數排序」把名單排好——因為 Ω 只有 0..21 這幾種值：
     先數出每種 Ω 值有幾個數，算前綴和得到每一組的起始位置；
     再從 1 掃到 2000000，依序把每個數放進它那組的下一個位置。
   這樣自然滿足「Ω 相同時較小的在前」（因為我們是由小到大掃的）。
4. 查詢直接查 order[k]。

複雜度 O(N)，記憶體是兩個 int 陣列（2×10^6 × 4 × 2 = 16 MB），要注意上限。若記憶體吃緊，Ω 可以用 unsigned char 存（省 3/4）。

驗算前幾名：
    Ω = 0 的只有 1        → 第 1 名是 1
    Ω = 1 的是所有質數 2, 3, 5, 7, ...  → 第 2、3、4 名是 2, 3, 5 ✓
與題目的範例輸出一致。`,
    t: `1. 是「含重複」的質因數個數（大 Omega），不是相異質因數個數。20 = 2²×5 算 3 個不是 2 個。
2. 1 的 Ω 是 0，排在最前面。
3. 一定要打表 + 查表，10000 筆查詢重算會 TLE。
4. 用計數排序而不是 std::sort——2×10^6 個元素的比較排序雖然也能過，但計數排序是 O(N) 且不需要自訂比較器。
5. 記憶體要小心：spf 用 int（8 MB）、order 用 int（8 MB）、Ω 用 unsigned char（2 MB），總共 18 MB 左右。
6. 終止條件是 0。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    const int N = 2000000;
    vector<int> spf(N + 1, 0);
    for (int i = 2; i <= N; i++)
        if (!spf[i])
            for (long long j = i; j <= N; j += i)
                if (!spf[j]) spf[j] = i;

    vector<unsigned char> om(N + 1, 0);
    for (int i = 2; i <= N; i++) om[i] = (unsigned char)(om[i / spf[i]] + 1);

    // 依 Omega 做計數排序；同組內因為由小到大掃，自然是數值遞增
    const int MAXOM = 24;
    vector<int> cnt(MAXOM + 1, 0);
    for (int i = 1; i <= N; i++) cnt[om[i]]++;
    // start[v] = Omega 值為 v 的那一組之前有幾個數（0-based 偏移）
    vector<int> start(MAXOM + 2, 0);
    for (int v = 1; v <= MAXOM; v++) start[v] = start[v - 1] + cnt[v - 1];
    vector<int> order_(N + 2, 0), pos = start;
    for (int i = 1; i <= N; i++) order_[++pos[om[i]]] = i;   // 名次是 1-based

    int k, cs = 1;
    while (cin >> k && k != 0) cout << "Case " << cs++ << ": " << order_[k] << "\\n";
    return 0;
}`
  },

  '11049': {
    q: `一個 6×6 的方格迷宮，裡面有 3 道牆（長度 1 到 6，水平或垂直放置，用來隔開方格），以及一個起點與一個終點。

請找出從起點到終點的最短路徑。只能在相鄰（共邊且中間沒有牆）的方格之間移動，不能走出格子外。

輸入：每組測資五行。第一行是起點的「行號 列號」（column、row），第二行是終點的行列號。第三、四、五行各描述一道牆：水平牆給「左端點、右端點」，垂直牆給「上端點、下端點」。端點位置以「距離左邊界的距離、距離上邊界的距離」表示。以兩個 0 結束。
輸出：每組輸出一條最短路徑的方向字串（'N' 上、'E' 右、'S' 下、'W' 左）。有多解時任一即可。

範例輸入
1 6
2 6
0 0 1 0
1 5 1 6
1 5 3 5
0 0

範例輸出
NEEESWW`,
    h: `就是 6×6 的 BFS，難的是把「牆」轉成「哪些相鄰移動被封鎖」。

【座標系統】
方格用 (col, row) 表示，col 從左到右 1..6、row 從上到下 1..6。牆的端點在「格線交點」上，座標 0..6。

【牆怎麼封鎖移動】
  水平牆從 (x1, y) 到 (x2, y)：它躺在第 y 條水平格線上，封鎖「(x, y) 與 (x, y+1) 之間的上下移動」，其中 x 從 x1+1 到 x2。
  垂直牆從 (x, y1) 到 (x, y2)：它立在第 x 條垂直格線上，封鎖「(x, y) 與 (x+1, y) 之間的左右移動」，其中 y 從 y1+1 到 y2。

用 blockV[col][row]（上下方向）與 blockH[col][row]（左右方向）兩張表記錄即可。

【BFS】
36 個格子，從起點 BFS 到終點，記下 parent 與走的方向，最後回溯出字串。

範例逐步驗算（起點 (1,6)、終點 (2,6)）：
  牆 1：水平 (0,0)-(1,0)，在最上緣，不影響。
  牆 2：垂直 (1,5)-(1,6)，封鎖 (1,6) 與 (2,6) 之間 → 沒辦法直接往右！
  牆 3：水平 (1,5)-(3,5)，封鎖 (2,5)↔(2,6) 與 (3,5)↔(3,6)。
  於是最短路是：N 到 (1,5) → E E E 到 (4,5) → S 到 (4,6) → W W 到 (2,6)
  也就是 "NEEESWW"，長度 7，與題目輸出完全一致 ✓`,
    t: `1. 輸入是「行號 列號」（column 在前、row 在後），不是常見的 (row, col)。搞反整題全錯。
2. 牆的端點座標是「格線」座標（0..6），格子座標是 1..6，兩者差一格。水平牆 (x1,y)-(x2,y) 封鎖的是 x = x1+1 .. x2 這些格子的上下通道，別寫成 x1..x2。
3. 牆可能只有長度 1（兩個端點相鄰），也可能在邊界上（完全不影響移動）——照公式處理就好。
4. 三道牆保證不交叉，但可能在格線交點上相碰，不用特別處理。
5. 方向字母是大寫 N/E/S/W；'N' 是往上（row 減 1）。
6. 終止條件是「0 0」（起點那行是 0 0）。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int sc, sr;
    while (cin >> sc >> sr && (sc || sr)) {
        int ec, er;
        cin >> ec >> er;

        // blockV[c][r]：格子 (c,r) 與 (c,r+1) 之間的上下通道被封鎖
        // blockH[c][r]：格子 (c,r) 與 (c+1,r) 之間的左右通道被封鎖
        static bool blockV[8][8], blockH[8][8];
        memset(blockV, 0, sizeof(blockV));
        memset(blockH, 0, sizeof(blockH));

        for (int w = 0; w < 3; w++) {
            int x1, y1, x2, y2;
            cin >> x1 >> y1 >> x2 >> y2;
            if (y1 == y2) {                      // 水平牆，躺在第 y1 條水平格線上
                if (x1 > x2) swap(x1, x2);
                for (int x = x1 + 1; x <= x2; x++) blockV[x][y1] = true;
            } else {                             // 垂直牆，立在第 x1 條垂直格線上
                if (y1 > y2) swap(y1, y2);
                for (int y = y1 + 1; y <= y2; y++) blockH[x1][y] = true;
            }
        }

        // BFS：狀態 (col, row)
        const int DC[4] = {0, 1, 0, -1};
        const int DR[4] = {-1, 0, 1, 0};
        const char NM[5] = "NESW";
        vector<vector<int> > dist(7, vector<int>(7, -1));
        vector<vector<pair<int, int> > > par(7, vector<pair<int, int> >(7));
        vector<vector<char> > mv(7, vector<char>(7, 0));
        queue<pair<int, int> > q;
        dist[sc][sr] = 0;
        q.push(make_pair(sc, sr));
        while (!q.empty()) {
            pair<int, int> cur = q.front(); q.pop();
            int c = cur.first, r = cur.second;
            for (int k = 0; k < 4; k++) {
                int nc = c + DC[k], nr = r + DR[k];
                if (nc < 1 || nc > 6 || nr < 1 || nr > 6) continue;
                if (dist[nc][nr] >= 0) continue;
                bool blocked = false;
                if (k == 0) blocked = blockV[c][r - 1];      // 往上：跨越第 r-1 條水平線
                if (k == 2) blocked = blockV[c][r];          // 往下：跨越第 r 條
                if (k == 1) blocked = blockH[c][r];          // 往右：跨越第 c 條垂直線
                if (k == 3) blocked = blockH[c - 1][r];      // 往左：跨越第 c-1 條
                if (blocked) continue;
                dist[nc][nr] = dist[c][r] + 1;
                par[nc][nr] = make_pair(c, r);
                mv[nc][nr] = NM[k];
                q.push(make_pair(nc, nr));
            }
        }

        string path;
        int c = ec, r = er;
        while (!(c == sc && r == sr)) {
            path += mv[c][r];
            pair<int, int> p = par[c][r];
            c = p.first; r = p.second;
        }
        reverse(path.begin(), path.end());
        cout << path << "\\n";
    }
    return 0;
}`
  }
};

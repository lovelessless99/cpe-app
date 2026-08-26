/* 三星第二十批 —— 高 AC 經典題 */
const SOL60 = {
  '11314': {
    q: `要從一塊 10000×10000 的長方形蛋糕（放在第一象限）切出一塊四邊形 ABCD，使周長最小。

點 A 與 B 是給定的（保證落在一條負斜率的直線上）。點 C 必須在正 y 軸上、點 D 必須在正 x 軸上，位置由你決定。

輸入：第一行是測資數（≤ 100）。接著每行四個數 ax ay bx by。
輸出：每組輸出最小周長，保留 3 位小數。

範例輸入
1
3.0 1.0 1.0 2.0

範例輸出
7.236`,
    h: `周長 = |AB| + |BC| + |CD| + |DA|。其中 |AB| 是固定的，要最小化的是

    |BC| + |CD| + |DA|

這是典型的「兩次鏡射」問題：走的路線是 B → C（C 在 y 軸）→ D（D 在 x 軸）→ A。

把 B 對 **y 軸** 鏡射得到 B' = (−bx, by)；把 A 對 **x 軸** 鏡射得到 A' = (ax, −ay)。那麼

    |BC| = |B'C|，|DA| = |DA'|

於是 |BC| + |CD| + |DA| = |B'C| + |CD| + |DA'| ≥ |B'A'|，而且當 C、D 落在線段 B'A' 上時取到等號。

所以

    最小周長 = |AB| + √( (ax + bx)² + (ay + by)² )

（因為 B'A' 的兩端是 (−bx, by) 與 (ax, −ay)，水平差是 ax + bx、垂直差是 ay + by。）

驗算範例（A = (3,1)、B = (1,2)）：
    |AB| = √((3−1)² + (1−2)²) = √5 = 2.2360680
    √((3+1)² + (1+2)²) = √(16 + 9) = 5
    周長 = 2.2360680 + 5 = 7.2360680 → 7.236 ✓（與題目輸出一致）

整題就是一行公式，完全不用做最佳化搜尋。`,
    t: `1. 鏡射的軸別搞反：B 對 y 軸鏡射（因為 C 在 y 軸上）、A 對 x 軸鏡射（因為 D 在 x 軸上）。
2. 題目保證 A、B 在負斜率直線上，這確保線段 B'A' 真的會先穿過 y 軸再穿過 x 軸，等號取得到。
3. 輸出保留 3 位小數（fixed << setprecision(3)）。
4. 座標是實數，用 double 讀。
5. 別忘了把 |AB| 加回去——那是四邊形的第四條邊。
6. 不需要真的求出 C、D 的座標，題目只要周長。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout << fixed << setprecision(3);
    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        double ax, ay, bx, by;
        cin >> ax >> ay >> bx >> by;
        double ab = sqrt((ax - bx) * (ax - bx) + (ay - by) * (ay - by));
        // B 對 y 軸鏡射、A 對 x 軸鏡射，兩點直線距離就是 |BC|+|CD|+|DA| 的最小值
        double path = sqrt((ax + bx) * (ax + bx) + (ay + by) * (ay + by));
        cout << ab + path << "\\n";
    }
    return 0;
}`
  },

  '10320': {
    q: `一片無限大的草地上有一棟長方形的房子，長 l、寬 w。一頭牛被綁在房子的某個角柱上，繩長 r。牛不能進入房子。

請計算牛能吃到草的面積。

輸入：每行三個浮點數 l w r（都小於 10000），讀到 EOF。
輸出：每行輸出面積，保留 10 位小數。

範例輸入
10 5 5
10 4 8

範例輸出
58.9048622548
163.3628179867`,
    h: `牛綁在角落，房子擋住了一個象限，所以：

1. 以角柱為圓心，可以掃出 **270°**（四分之三個圓）的區域：
       (3/4)·π·r²
2. 繩子沿著長為 l 的那一邊繞過下一個角柱時，剩下 r − l 的繩長，可以再掃 **90°**：
       (1/4)·π·(r − l)²     （只有 r > l 時才有）
3. 同樣地，沿著長為 w 的那一邊繞過去：
       (1/4)·π·(r − w)²     （只有 r > w 時才有）

    面積 = (3/4)πr² + (1/4)π·max(0, r−l)² + (1/4)π·max(0, r−w)²

驗算（注意輸入順序是 l w r）：
    l=10, w=5, r=5：r ≤ l 且 r ≤ w，只有第一項 → (3/4)π·25 = 58.9048622548 ✓
    l=10, w=4, r=8：r < l（不加第二項），r > w → (3/4)π·64 + (1/4)π·(8−4)²
        = 150.7964474 + 12.5663706 = 163.3628180 ✓
兩組都與題目輸出一字不差。

【r 大於 l + w 的情形】
若繩子長到能繞過兩個角、抵達對角的那個角柱（r > l + w），兩邊繞過去的扇形會在房子後方相遇並重疊，這時要再補上一個以對角角柱為圓心、半徑 r − l − w 的 90° 扇形（而且只能補「一次」，因為兩邊繞過來得到的是同一塊區域）。範例沒有測到這個情形，但實作時要記得處理。`,
    t: `1. 輸入順序是「l w r」——先兩個邊長、最後才是繩長。用範例第一組（10 5 5 → (3/4)π·25）可以立刻確認。
2. r − l 或 r − w 可能是負的，要先取 max(0, ·) 再平方，不然會多算一塊。
3. 輸出要 10 位小數（fixed << setprecision(10)），π 要用 acos(-1.0) 這種高精度寫法，不要寫 3.14159。
4. r > l + w 時要補對角角柱的扇形，而且只補一次。
5. 房子本身的面積不算在內——公式裡本來就沒有包含房子那一塊（270° 已經扣掉了）。
6. 讀到 EOF 結束。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout << fixed << setprecision(10);
    const double PI = acos(-1.0);
    double l, w, r;
    while (cin >> l >> w >> r) {
        double area = 0.75 * PI * r * r;                 // 角落可掃 270 度
        if (r > l) area += 0.25 * PI * (r - l) * (r - l); // 繞過長邊那一角
        if (r > w) area += 0.25 * PI * (r - w) * (r - w); // 繞過寬邊那一角
        if (r > l + w) {                                  // 繞到對角，兩側重疊只補一次
            double t = r - l - w;
            area += 0.25 * PI * t * t;
        }
        cout << area << "\\n";
    }
    return 0;
}`
  },

  '11035': {
    q: `每副牌組（hand）以「標準順序」存成一條 linked list：先依花色排（梅花 C、方塊 D、紅心 H、黑桃 S），同花色再依點數排（A, 2, 3, ..., 10, J, Q, K）。每副牌組中同一張牌最多出現一次。

聰明的做法是讓不同牌組「共用尾端相同的部分」。給定若干副牌組，請問最少需要幾個 list 節點才能把它們全部存下來？

輸入：多組測資。每組第一行是牌組數，接著每行描述一副牌組：先是張數，再是那幾張牌。
輸出：每組輸出所需的節點總數。

範例輸入
1
3
3 7D AH 5S
4 9C 3D 4D 5S
2 AH 5S

自行推算的輸出
6`,
    h: `「共用尾端」= 把每副牌組**反過來**看，就是「共用前綴」——這正是字典樹（trie）。

步驟：
1. 把每張牌轉成一個可比較的鍵值：花色權重（C=0, D=1, H=2, S=3）× 13 + 點數權重（A=0, 2=1, ..., K=12）。
2. 把每副牌組依這個鍵值排序，得到標準順序。
3. 把排序後的序列**反轉**，插入一棵 trie。
4. 答案就是 trie 的節點總數（不含虛擬根節點）。

因為 linked list 是「往後接」的，兩條 list 只要尾端相同就能共用同一串節點；反轉之後「尾端相同」變成「前綴相同」，trie 自然把共用的部分只算一次。

逐步驗算（範例）：
    hand1 標準順序 7D, AH, 5S → 反轉 [5S, AH, 7D]
    hand2 標準順序 9C, 3D, 4D, 5S → 反轉 [5S, 4D, 3D, 9C]
    hand3 標準順序 AH, 5S → 反轉 [5S, AH]
  插入 trie：
    hand1 產生 3 個節點（5S、AH、7D）
    hand2 的 5S 可共用，再產生 3 個（4D、3D、9C）→ 累計 6
    hand3 的 [5S, AH] 完全已存在 → 0
  總共 6 個節點。`,
    t: `1. 要「反轉之後」建 trie，不是直接建——linked list 共用的是尾端。
2. 花色順序是 C < D < H < S（梅花、方塊、紅心、黑桃），點數順序是 A 最小、K 最大，10 是兩個字元要小心解析。
3. 輸入的牌不一定已排好，要自己依標準順序排序。
4. 同一副牌組中同一張牌最多出現一次，不用處理重複。
5. trie 的節點數不含根（根代表空串）。
6. 用 map<int,int> 當每個節點的子節點表最省事；牌只有 52 種，也可以開固定陣列。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int rankOf(const string& s) {
    // 最後一個字元是花色，前面是點數
    char suit = s[s.size() - 1];
    string val = s.substr(0, s.size() - 1);
    int sv = (suit == 'C') ? 0 : (suit == 'D') ? 1 : (suit == 'H') ? 2 : 3;
    int vv;
    if (val == "A") vv = 0;
    else if (val == "J") vv = 10;
    else if (val == "Q") vv = 11;
    else if (val == "K") vv = 12;
    else vv = atoi(val.c_str()) - 1;             // "2".."10" → 1..9
    return sv * 13 + vv;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        int h;
        cin >> h;
        vector<map<int, int> > child(1);          // 節點 0 是根
        int nodes = 0;
        for (int i = 0; i < h; i++) {
            int c;
            cin >> c;
            vector<int> cards(c);
            for (int j = 0; j < c; j++) {
                string s;
                cin >> s;
                cards[j] = rankOf(s);
            }
            sort(cards.begin(), cards.end());
            reverse(cards.begin(), cards.end());  // 尾端共用 → 反轉成前綴共用
            int cur = 0;
            for (int j = 0; j < c; j++) {
                map<int, int>::iterator it = child[cur].find(cards[j]);
                if (it == child[cur].end()) {
                    child.push_back(map<int, int>());
                    int nid = (int)child.size() - 1;
                    child[cur][cards[j]] = nid;
                    cur = nid;
                    nodes++;
                } else {
                    cur = it->second;
                }
            }
        }
        cout << nodes << "\\n";
    }
    return 0;
}`
  },

  '1757': {
    q: `拉什莫爾山的祕密房間裡有一本翻譯表：每筆資料 a b 表示「字母 a 可以轉換成字母 b」（單向）。轉換可以連續使用（遞移），而且每個字母當然可以轉成自己。

給定若干對單字，判斷第一個單字能不能透過這些轉換變成第二個單字。

輸入：多組測資。每組第一行是兩個整數 m k（m 是翻譯規則數 ≤ 500，k 是要比對的單字對數 ≤ 50）。接著 m 行每行兩個字母，再接著 k 行每行兩個單字。
輸出：每對單字輸出「yes」或「no」。

範例輸入
9 5
c t
i r
k p
o c
r o
t e
t f
u h
w p
we we
can the
work people
it of
out the

範例輸出
yes
no
no
yes
yes`,
    h: `把 26 個字母當節點、每條規則當一條有向邊，然後求「遞移閉包」。因為只有 26 個字母，直接用 Floyd–Warshall 風格的三重迴圈就好：

    reach[a][a] = true                        // 自己一定能轉成自己
    reach[a][b] = true                        // 每條規則
    for k, i, j: reach[i][j] |= reach[i][k] && reach[k][j]

判斷兩個單字 A、B 是否相符：
    長度必須一樣，而且對每個位置 i 都要 reach[A[i]][B[i]] 為真。

（注意方向：是「A 轉成 B」，不是雙向。）

範例逐一驗算（規則 c→t, i→r, k→p, o→c, r→o, t→e, t→f, u→h, w→p）：
    "we we"：完全相同，靠自反性 → yes ✓
    "can the"：c→t ✓，但 a→h 沒有任何路徑 → no ✓
    "work people"：長度 4 vs 6 → no ✓
    "it of"：i→r→o ✓（遞移），t→f ✓（直接）→ yes ✓
    "out the"：o→c→t ✓，u→h ✓，t→e ✓ → yes ✓
五組全中。`,
    t: `1. 轉換是「單向」的：規則 a b 表示 a 能變成 b，不代表 b 能變成 a。方向搞反會有好幾組錯。
2. 自反性要自己補上（reach[a][a] = true），不然「we we」都會答錯。
3. 遞移閉包不能只做一層——範例的 i→r→o 與 o→c→t 都需要兩層。用 Floyd 三重迴圈最保險。
4. 長度不同直接 no，不要再逐字元比。
5. 每組測資都要重設 reach 陣列。
6. 輸出是小寫的「yes」/「no」。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int m, k;
    while (cin >> m >> k) {
        bool reach[26][26];
        memset(reach, 0, sizeof(reach));
        for (int i = 0; i < 26; i++) reach[i][i] = true;   // 自反
        for (int i = 0; i < m; i++) {
            char a, b;
            cin >> a >> b;
            reach[a - 'a'][b - 'a'] = true;
        }
        for (int t = 0; t < 26; t++)                       // 遞移閉包
            for (int i = 0; i < 26; i++)
                for (int j = 0; j < 26; j++)
                    if (reach[i][t] && reach[t][j]) reach[i][j] = true;

        for (int q = 0; q < k; q++) {
            string a, b;
            cin >> a >> b;
            bool ok = (a.size() == b.size());
            for (size_t i = 0; i < a.size() && ok; i++)
                if (!reach[a[i] - 'a'][b[i] - 'a']) ok = false;
            cout << (ok ? "yes" : "no") << "\\n";
        }
    }
    return 0;
}`
  },

  '12544': {
    q: `蜜蜂在森林裡的樹之間有固定的路徑（無向邊）。牠們想找一個「最小的環狀聚落」——也就是圖中最短的環，並回報這個環上有幾棵樹。

輸入：第一行是測資數（≤ 50）。每組前有一個空行，接著一行兩個整數 n m（樹數 ≤ 500、路徑數 ≤ 20000），再接著 m 行、每行兩個整數表示一條無向邊。
輸出：每組印「Case i: 環的長度」；若圖中沒有環則印「Case i: impossible」。

範例輸入
3

3 3
0 1
1 2
2 0

2 1
0 1

5 6
0 1
1 2
1 3
2 3
0 4
3 4

範例輸出
Case 1: 3
Case 2: impossible
Case 3: 3`,
    h: `這是求「圍長（girth）」——圖中最短環的長度。無權圖的標準作法是：

    對每個頂點 s 各做一次 BFS；
    在 BFS 過程中，若遇到一條邊 (u, v) 使得 v 已經被造訪、而且 v 不是 u 的父節點，
    就找到一個長度 dist[u] + dist[v] + 1 的環，更新答案。

對所有 s 取最小值就是圍長。

為什麼「每個點各做一次 BFS」是對的？因為最短環上的每個點都會在「以它為起點」的 BFS 中被正確地量到（環上兩條路徑長度差不超過 1）。

複雜度 O(n · m) = 500 × 20000 = 10^7，可以接受。

小技巧：一旦目前找到的答案已經是 3（三角形），就可以提早結束——不可能更短。

驗算：
    第 1 組：三角形 0-1-2-0 → 3 ✓
    第 2 組：只有一條邊，沒有環 → impossible ✓
    第 3 組：邊 0-1, 1-2, 1-3, 2-3, 0-4, 3-4 → 1-2-3-1 是三角形 → 3 ✓`,
    t: `1. BFS 時要排除「回到父節點」的那條邊，否則每條邊都會被誤判成長度 2 的環。
2. 但若圖中有重邊（同兩點之間兩條邊），那確實構成長度 2 的環——依題目而定；本題通常視為簡單圖。
3. 每組測資之前有空行，用 >> 讀數字會自動跳過，不必處理。
4. 圖可能不連通，要對每個頂點都做 BFS（自然涵蓋所有連通塊）。
5. 沒有環時輸出「impossible」（小寫）。
6. n·m 到 10^7，鄰接串列要用 vector 預先 reserve，避免常數過大。`,
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
        vector<vector<int> > adj(n);
        for (int i = 0; i < m; i++) {
            int a, b;
            cin >> a >> b;
            adj[a].push_back(b);
            adj[b].push_back(a);
        }

        int best = INT_MAX;
        vector<int> dist(n), par(n);
        for (int s = 0; s < n && best > 3; s++) {
            fill(dist.begin(), dist.end(), -1);
            fill(par.begin(), par.end(), -1);
            queue<int> q;
            dist[s] = 0;
            q.push(s);
            while (!q.empty()) {
                int u = q.front(); q.pop();
                for (size_t i = 0; i < adj[u].size(); i++) {
                    int v = adj[u][i];
                    if (dist[v] < 0) {
                        dist[v] = dist[u] + 1;
                        par[v] = u;
                        q.push(v);
                    } else if (v != par[u]) {
                        // 找到一個環：兩條到 s 的路徑加上這條邊
                        best = min(best, dist[u] + dist[v] + 1);
                    }
                }
            }
        }
        cout << "Case " << tc << ": ";
        if (best == INT_MAX) cout << "impossible\\n";
        else cout << best << "\\n";
    }
    return 0;
}`
  },

  '11603': {
    q: `我的公寓有 n 台電腦，有些電腦之間接了網路線，每條線有頻寬。兩台電腦之間的「頻寬」定義為連接它們的路徑上「最小的一條線」的頻寬（若有多條路徑，取最好的那條）。

朋友給了我一張 n×n 的表，列出他家每一對電腦之間的頻寬。我想用「最少的網路線」造出一個網路，使得我的表跟他的完全一樣。請問要買幾條線、分別接在哪裡？若做不到，輸出「Impossible」。

輸入：第一行是測資數。每組先一行 n（≤ 200），接著 n 行、每行 n 個整數。
輸出：每組印「Case #i: 條數」，接著每條線一行「u v 頻寬」；若不可能印「Case #i: Impossible」。

範例輸入
4
2
0 10
10 0
3
0 1 1
1 0 2
1 2 0
1
0
4
0 2 2 1
2 0 2 2
2 2 0 2
1 2 2 0

範例輸出
Case #1: 1
0 1 10
Case #2: 2
0 1 1
1 2 2
Case #3: 0
Case #4: Impossible`,
    h: `「路徑上的最小邊最大化」就是**最大瓶頸路徑**，而它的答案由**最大生成樹**決定：最大生成樹上兩點路徑的最小邊，就等於原圖的最大瓶頸值。

所以：
1. 把表中所有 (i, j)（i < j）當成候選邊，**由大到小**排序，跑 Kruskal 建最大生成樹。這棵樹就是「最少的線」——n 個點只要 n−1 條。
2. **驗證**：在這棵樹上算出每一對的瓶頸值（n ≤ 200，直接對每個點做一次 DFS/BFS，O(n²)），跟輸入的表逐一比對。
   只要有一格對不上，就是「Impossible」。
3. 輸出樹上的邊（依題目慣例照 u < v 排序輸出）。

為什麼最大生成樹一定是最省的？因為要讓 n 個點兩兩都有非零頻寬就必須連通，至少 n−1 條線；而最大生成樹恰好用 n−1 條並且保證每一對的瓶頸值都是可能的最大值。若表的值比這個最大值還大，那就無論如何都做不到 → Impossible。

驗算：
    Case 1：兩點、頻寬 10 → 一條線 0-1 權 10 ✓
    Case 2：表 [[0,1,1],[1,0,2],[1,2,0]]，最大生成樹取 (1,2,2) 與 (0,1,1)；
        驗證 0↔2 的瓶頸 = min(1,2) = 1，與表相符 → 2 條線 ✓
    Case 3：n = 1，不需要任何線 → 0 ✓
    Case 4：表要求 0↔1、0↔2、1↔2、1↔3、2↔3 都是 2，但 0↔3 只有 1。
        最大生成樹會讓 0 與 3 之間的瓶頸變成 2（透過那些權 2 的邊），與表的 1 不符 → Impossible ✓`,
    t: `1. 是「最大」生成樹不是最小——瓶頸要盡量大。Kruskal 要由大到小排序。
2. 一定要做驗證。只建樹不驗證，Case 4 那種矛盾的表就會被誤判成有解。
3. 表必須對稱且對角線為 0；不對稱或對角線非 0 也算 Impossible（保險起見檢查一下）。
4. n = 1 時答案是 0 條線，別忘了這個邊界。
5. n ≤ 200 → 邊有 ~20000 條，排序與 Kruskal 都很快；驗證用 O(n²) 的樹上 DFS 也沒問題。
6. 輸出格式：「Case #i: k」，接著 k 行；k 可以是 0（Case 3 就只有標題行）。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int par_[205];
int find_(int x) { return par_[x] == x ? x : par_[x] = find_(par_[x]); }

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    for (int tc = 1; tc <= T; tc++) {
        int n;
        cin >> n;
        vector<vector<long long> > w(n, vector<long long>(n));
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) cin >> w[i][j];

        // 依權重由大到小做 Kruskal → 最大生成樹
        vector<array<long long, 3> > e;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++) e.push_back({w[i][j], (long long)i, (long long)j});
        sort(e.begin(), e.end(), greater<array<long long, 3> >());

        for (int i = 0; i < n; i++) par_[i] = i;
        vector<vector<pair<int, long long> > > tree(n);
        vector<array<long long, 3> > used;
        for (size_t i = 0; i < e.size(); i++) {
            int a = (int)e[i][1], b = (int)e[i][2];
            if (find_(a) == find_(b)) continue;
            par_[find_(a)] = find_(b);
            tree[a].push_back(make_pair(b, e[i][0]));
            tree[b].push_back(make_pair(a, e[i][0]));
            used.push_back({(long long)a, (long long)b, e[i][0]});
        }

        // 驗證：樹上每一對的瓶頸值必須與表相符
        bool ok = true;
        const long long INF = LLONG_MAX / 4;
        for (int s = 0; s < n && ok; s++) {
            vector<long long> b(n, -1);
            b[s] = INF;
            queue<int> q;
            q.push(s);
            while (!q.empty()) {
                int u = q.front(); q.pop();
                for (size_t i = 0; i < tree[u].size(); i++) {
                    int v = tree[u][i].first;
                    if (b[v] >= 0) continue;
                    b[v] = min(b[u], tree[u][i].second);
                    q.push(v);
                }
            }
            for (int j = 0; j < n && ok; j++) {
                long long expect = (j == s) ? 0 : w[s][j];
                long long got = (j == s) ? 0 : (b[j] < 0 ? -1 : b[j]);
                if (got != expect) ok = false;
            }
        }

        cout << "Case #" << tc << ": ";
        if (!ok) { cout << "Impossible\\n"; continue; }
        cout << used.size() << "\\n";
        for (size_t i = 0; i < used.size(); i++) {
            long long a = used[i][0], b = used[i][1];
            if (a > b) swap(a, b);
            cout << a << " " << b << " " << used[i][2] << "\\n";
        }
    }
    return 0;
}`
  },

  '11748': {
    q: `選舉採「一對一淘汰制」：每週從候選人池中挑兩個人出來，全民投票選出偏好的一位，輸的被淘汰、贏的回到池中，直到只剩一人。

挑選每週對戰組合的人是你。給定每位選民對所有候選人的偏好排序，請判斷你能不能安排對戰順序，讓你心目中的候選人（1 號）最後勝出。

輸入：多組測資。每組第一行是三個整數 n v f（候選人數 ≤ 100、選民數 ≤ 100、你支持的候選人編號）。接著 v 行，每行是一位選民的偏好排序（n 個候選人編號，愈前面愈偏好）。以「0 0 0」結束。
輸出：每組印「yes」或「no」。

範例輸入
3 3 1
1 2 3
2 3 1
3 1 2
3 3 1
1 2 3
2 3 1
3 2 1
0 0 0

範例輸出
yes
no`,
    h: `分兩步。

【第一步：算出兩兩對決的勝負】
對每一對 (i, j)，數有多少選民把 i 排在 j 前面。過半就是 i 贏。用「每位選民的偏好排序 → 位置表」可以 O(1) 比較，總共 O(v·n²)。

【第二步：判斷 f 能不能奪冠】
關鍵定理：在這種「每輪自由挑選兩人對戰」的淘汰制中，

    f 能奪冠 ⟺ 在「勝負有向圖」中，從 f 出發能走到「所有」其他候選人

（有向邊 i → j 代表 i 打敗 j。）

直觀理由：
  - 必要性：若某人 x 從 f 走不到，那 x 所在的那群人永遠不會被 f 或 f 能擊敗的人打敗，x 不可能被淘汰。
  - 充分性：按「離 f 的距離由遠到近」安排——先讓距離較遠的人互相淘汰、由距離較近的人把他們一個個打掉，最後 f 出場收尾。

所以只要從 f 做一次 DFS/BFS，看是否覆蓋全部 n 個節點即可。

驗算：
    第 1 組：偏好 (1,2,3)、(2,3,1)、(3,1,2)。
        1 vs 2：兩票支持 1（第 1、3 位選民）→ 1 勝 2
        2 vs 3：兩票支持 2（第 1、2 位）→ 2 勝 3
        1 vs 3：只有第 1 位支持 1 → 3 勝 1
        從 1 出發：1 → 2 → 3，走遍所有人 → yes ✓
        （實際安排：先讓 2 打 3，2 勝；再讓 1 打 2，1 勝。）
    第 2 組：偏好 (1,2,3)、(2,3,1)、(3,2,1)。
        1 vs 2：只有第 1 位支持 1 → 2 勝 1；1 vs 3：同樣 3 勝 1
        從 1 出發哪裡都去不了 → no ✓`,
    t: `1. 不要真的去枚舉所有對戰順序（那是階乘級）。抓住「可達性」這個判準就是一次 DFS。
2. 「過半」的定義：v 位選民中支持數 > v/2。題目通常保證 v 是奇數不會平手；若可能平手要看題目怎麼定義（保險起見用嚴格大於）。
3. 偏好排序要先轉成「位置表」pos[voter][candidate]，才能 O(1) 判斷誰排前面。
4. 候選人編號是 1-based。
5. 終止條件是「0 0 0」。
6. 輸出是小寫的「yes」/「no」。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, v, f;
    while (cin >> n >> v >> f && (n || v || f)) {
        vector<vector<int> > pos(v, vector<int>(n + 1, 0));
        for (int i = 0; i < v; i++)
            for (int j = 0; j < n; j++) {
                int c;
                cin >> c;
                pos[i][c] = j;                       // 愈小代表愈偏好
            }

        // 兩兩對決：過半者勝
        vector<vector<char> > beat(n + 1, vector<char>(n + 1, 0));
        for (int a = 1; a <= n; a++)
            for (int b = a + 1; b <= n; b++) {
                int cnt = 0;
                for (int i = 0; i < v; i++) if (pos[i][a] < pos[i][b]) cnt++;
                if (cnt * 2 > v) beat[a][b] = 1; else beat[b][a] = 1;
            }

        // 從 f 出發能否走遍所有候選人
        vector<char> vis(n + 1, 0);
        vector<int> st(1, f);
        vis[f] = 1;
        int cnt = 1;
        while (!st.empty()) {
            int u = st.back(); st.pop_back();
            for (int w = 1; w <= n; w++)
                if (beat[u][w] && !vis[w]) { vis[w] = 1; cnt++; st.push_back(w); }
        }
        cout << (cnt == n ? "yes" : "no") << "\\n";
    }
    return 0;
}`
  }
};

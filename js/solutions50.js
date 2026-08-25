/* 三星第十批 —— 高 AC 經典題 */
const SOL50 = {
  '10181': {
    q: `15 拼圖：4×4 的框裡有 15 塊寫著 1~15 的滑塊與一個空格，目標是排成

    1  2  3  4
    5  6  7  8
    9 10 11 12
   13 14 15  空

唯一合法的操作是把空格與相鄰（共邊）的滑塊互換。移動方向用空格的移動方向表示：
  L = 空格往左、R = 空格往右、U = 空格往上、D = 空格往下

輸入：第一行是測資組數 T。接著每組 4 行、每行 4 個整數，0 代表空格。
輸出：若無解印「This puzzle is not solvable.」；有解則印出一串移動字母（長度不超過 50）。

範例輸入
2
2 3 4 0
1 5 7 8
9 6 10 12
13 14 11 15
13 1 2 4
5 0 3 7
9 6 10 12
15 8 11 14

範例輸出
LLLDRDRDR
This puzzle is not solvable.`,
    h: `分成「判斷可解」與「搜尋解答」兩件事。

【判斷可解】
把 15 個數字（忽略空格）按列優先排成一列，數出逆序數 inv。再看空格所在的列 r（0-based，從最上面數起）。

    可解 ⟺ (inv + r) 是奇數

驗算範例一：數列 2 3 4 1 5 7 8 9 6 10 12 13 14 11 15 的逆序數是 9，空格在第 0 列 → 9 + 0 = 9 奇數 → 可解 ✓
驗算範例二：逆序數 23，空格在第 1 列 → 24 偶數 → 無解 ✓

【搜尋】
用 IDA*（迭代加深的 A*）配 Manhattan 距離啟發函數：
  h = Σ 每塊滑塊到它目標位置的曼哈頓距離（空格不計）

IDA* 的框架：
  limit = h(初始)
  重複：從初始狀態做深度優先搜尋，只要 g + h > limit 就剪枝；
       若找到解就回傳，否則 limit++ 再來一次。

兩個關鍵最佳化：
1. 不要走「上一步的反方向」（會回到剛才的狀態）。
2. h 用「增量更新」：移動一塊滑塊時，只要重算那一塊的曼哈頓距離差，不必整盤重算。

我用 JS 實作了完整的 IDA*，移動嘗試順序取 L, U, R, D，跑範例一得到的答案正是 LLLDRDRDR，與題目給的輸出一模一樣；範例二正確判為無解。`,
    t: `1. 移動字母代表「空格」的移動方向，不是滑塊的移動方向——兩者剛好相反，搞錯的話整串會是反的。
2. 可解性判準對 4×4 是「inv + 空格列(0-based) 為奇數」。網路上有各種寫法（有的用「從底部數起的列數」配偶數），務必挑一種並用範例驗證。
3. 直接 BFS 會爆記憶體（狀態空間 16!/2 ≈ 10^13），一定要 IDA*。
4. h 必須是「可容許的」（不高估）——曼哈頓距離符合，因為每次移動最多讓一塊滑塊的距離減 1。
5. 剪掉反向移動能省掉一半以上的搜尋量，不加通常會 TLE。
6. 這題判題是特別判定（special judge），任何長度不超過 50 的合法解都算對，不必跟範例輸出一字不差。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int b[16];
string path_;
int limit_;
const int DR[4] = {0, -1, 0, 1};
const int DC[4] = {-1, 0, 1, 0};
const char NM[5] = "LURD";

int manhattan() {
    int s = 0;
    for (int i = 0; i < 16; i++) {
        int v = b[i];
        if (!v) continue;
        int tr = (v - 1) / 4, tc = (v - 1) % 4;
        s += abs(i / 4 - tr) + abs(i % 4 - tc);
    }
    return s;
}

bool dfs(int pos, int g, int h, int lastDir) {
    if (h == 0) return true;
    if (g + h > limit_) return false;                 // IDA* 剪枝
    for (int d = 0; d < 4; d++) {
        if (lastDir >= 0 && d == (lastDir ^ 2)) continue;   // 不走回頭路
        int r = pos / 4 + DR[d], c = pos % 4 + DC[d];
        if (r < 0 || r > 3 || c < 0 || c > 3) continue;
        int np = r * 4 + c, v = b[np];
        int tr = (v - 1) / 4, tc = (v - 1) % 4;
        // 增量更新 h：只有這一塊的曼哈頓距離改變
        int oldD = abs(r - tr) + abs(c - tc);
        int newD = abs(pos / 4 - tr) + abs(pos % 4 - tc);

        b[pos] = v; b[np] = 0;
        path_ += NM[d];
        if (dfs(np, g + 1, h - oldD + newD, d)) return true;
        path_.erase(path_.size() - 1);
        b[np] = v; b[pos] = 0;
    }
    return false;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        int blank = 0;
        for (int i = 0; i < 16; i++) {
            cin >> b[i];
            if (b[i] == 0) blank = i;
        }
        // 可解性：逆序數 + 空格所在列（0-based）必須是奇數
        vector<int> t;
        for (int i = 0; i < 16; i++) if (b[i]) t.push_back(b[i]);
        int inv = 0;
        for (size_t i = 0; i < t.size(); i++)
            for (size_t j = i + 1; j < t.size(); j++)
                if (t[i] > t[j]) inv++;
        if ((inv + blank / 4) % 2 == 0) {
            cout << "This puzzle is not solvable.\\n";
            continue;
        }

        int h0 = manhattan();
        bool done = false;
        for (limit_ = h0; limit_ <= 50 && !done; limit_++) {
            path_.clear();
            done = dfs(blank, 0, h0, -1);
        }
        cout << path_ << "\\n";
    }
    return 0;
}`
  },

  '11352': {
    q: `國王住在王國 A，女兒住在王國 B，中間隔著一片森林。森林是一個 n×m 的棋盤，上面有一些敵人的「騎士（馬）」。

國王走棋盤上的「王」步：每一步可以往八個方向（含斜向）走一格。他不能走到「有馬的格子」，也不能走到「任何一隻馬能一步吃到的格子」（馬走日字）。

A 與 B 這兩格本身是王國領土，視為安全，即使被馬攻擊也沒關係。

請求出國王從 A 走到 B 的最少步數。

輸入：第一行是測資數（≤ 100）。每組第一行是 n m，接著 n 行、每行 m 個字元：'.' 空地、'Z' 馬、'A' 王國 A、'B' 王國 B。每組恰有一個 A 與一個 B。
輸出：若能到達印「Minimal possible length of a trip is X」；否則印「King Peter, you can't go now!」

範例輸入
4
5 5
.Z..B
..Z..
Z...Z
.Z...
A....
3 2
ZB
.Z
AZ
6 5
....B
.....
.....
..Z..
.....
A..Z.
3 3
ZZ.
...
AB.

範例輸出
King Peter, you can't go now!
Minimal possible length of a trip is 2
King Peter, you can't go now!
Minimal possible length of a trip is 1`,
    h: `兩步驟：先標記危險格，再做 BFS。

【標記危險格】
掃過整張圖，遇到 'Z' 就把它自己與它的 8 個馬步目標都標成危險：
    (±1, ±2) 與 (±2, ±1) 共 8 個方向
別忘了界內檢查。

【豁免 A 與 B】
題目的第四組範例是關鍵線索：那組的 A 與 B 兩格「都」在馬的攻擊範圍內，但答案是 1（A 與 B 相鄰，走一步就到）。所以標記完之後，要把 A 與 B 這兩格強制設回安全。

【BFS】
從 A 出發，八方向走格子，只走非危險格，求到 B 的最短步數。步數就是 BFS 層數。

我用 JS 對四組範例都跑過：得到 −1（不可達）、2、−1、1，與題目輸出完全吻合。（一開始我沒有豁免 A、B，第四組就會得到「不可達」而與範例矛盾——這正是找出這條規則的方式。）`,
    t: `1. A 與 B 兩格豁免這件事題目沒有明講，但範例四逼出來了：不豁免就會答錯。
2. 馬的格子本身也不能走（既是障礙也是危險）。
3. 移動是「王步」八方向，不是四方向。
4. 輸出字串要一字不差：「Minimal possible length of a trip is 2」、「King Peter, you can't go now!」（含驚嘆號與撇號）。
5. n、m 可能不等，別假設是正方形；範例二就是 3×2。
6. A 與 B 可能相鄰（答案 1），也可能是同一格嗎？題目說各有一個，所以不會重疊。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    const int KR[8] = {1, 2, -1, -2, 1, 2, -1, -2};
    const int KC[8] = {2, 1, 2, 1, -2, -1, -2, -1};
    const int DR[8] = {-1, -1, -1, 0, 0, 1, 1, 1};
    const int DC[8] = {-1, 0, 1, -1, 1, -1, 0, 1};

    while (T--) {
        int n, m;
        cin >> n >> m;
        vector<string> g(n);
        for (int i = 0; i < n; i++) cin >> g[i];

        vector<vector<char> > bad(n, vector<char>(m, 0));
        int ar = 0, ac = 0, br = 0, bc = 0;
        for (int i = 0; i < n; i++)
            for (int j = 0; j < m; j++) {
                if (g[i][j] == 'Z') {
                    bad[i][j] = 1;
                    for (int k = 0; k < 8; k++) {
                        int r = i + KR[k], c = j + KC[k];
                        if (r >= 0 && r < n && c >= 0 && c < m) bad[r][c] = 1;
                    }
                }
                if (g[i][j] == 'A') { ar = i; ac = j; }
                if (g[i][j] == 'B') { br = i; bc = j; }
            }
        bad[ar][ac] = 0;                 // A、B 兩格是王國領土，視為安全
        bad[br][bc] = 0;

        vector<vector<int> > d(n, vector<int>(m, -1));
        queue<pair<int, int> > q;
        d[ar][ac] = 0;
        q.push(make_pair(ar, ac));
        while (!q.empty()) {
            pair<int, int> cur = q.front(); q.pop();
            int r = cur.first, c = cur.second;
            for (int k = 0; k < 8; k++) {          // 王步：八方向
                int nr = r + DR[k], nc = c + DC[k];
                if (nr < 0 || nr >= n || nc < 0 || nc >= m) continue;
                if (bad[nr][nc] || d[nr][nc] >= 0) continue;
                d[nr][nc] = d[r][c] + 1;
                q.push(make_pair(nr, nc));
            }
        }

        if (d[br][bc] < 0) cout << "King Peter, you can't go now!\\n";
        else cout << "Minimal possible length of a trip is " << d[br][bc] << "\\n";
    }
    return 0;
}`
  },

  '10202': {
    q: `給 N 個數字，把它們兩兩相加（含所有 C(N,2) 對）會得到 N(N−1)/2 個和。現在反過來：給你這些和，請還原出原本的 N 個數字。

輸入：每行一筆測資，先是 N（2 < N < 10），接著 N(N−1)/2 個整數，讀到 EOF。
輸出：每筆輸出 N 個非遞減排序的整數；若無解印「Impossible」。有多解時任一個即可。

範例輸入
3 1269 1160 1663
3 1 1 1
5 226 223 225 224 227 229 228 226 225 227
5 216 210 204 212 220 214 222 208 216 210
5 -1 0 -1 -2 1 0 -1 1 0 -1
5 79950 79936 79942 79962 79954 79972 79960 79968 79924 79932

範例輸出
383 777 886
Impossible
111 112 113 114 115
101 103 107 109 113
-1 -1 0 0 1
39953 39971 39979 39983 39989`,
    h: `先把所有和排序。設還原後的數字（也排好序）是 a0 ≤ a1 ≤ ... ≤ a(N−1)，則

  最小的和 s[0] = a0 + a1
  次小的和 s[1] = a0 + a2      （a1 + a2 ≥ a0 + a2，所以第二小一定是 a0+a2）

第三小的和不確定是 a0+a3 還是 a1+a2，所以要「枚舉」：假設 s[j] = a1 + a2（j 從 2 掃到最後），那麼

    a0 = (s[0] + s[1] − s[j]) / 2

（因為 s[0] + s[1] − s[j] = (a0+a1) + (a0+a2) − (a1+a2) = 2·a0）

有了 a0 就有 a1 = s[0] − a0、a2 = s[1] − a0。接著用「多重集合」貪心把剩下的數推出來：

  重複直到湊滿 N 個：
    取出目前剩下的最小和 mn，它一定是 a0 + （下一個新數字）
    新數字 v = mn − a0
    把 v 與「所有已求出的數字」的和從多重集合中一一刪掉（刪不掉就這條枚舉失敗）

最後檢查多重集合恰好清空且湊滿 N 個。

為什麼「剩下的最小和 = a0 + 新數字」？因為所有已知數字彼此的和都已經被刪掉了，剩下的和至少含一個未知數字；含未知數字的和中最小的必然是「最小的已知數 a0 + 最小的未知數」。

N < 10 → 最多 36 個和，枚舉 j 最多 34 次，每次 O(N²) 的刪除，完全不是負擔。

我用 JS 完整實作並跑過全部六組範例，輸出與題目給的答案一字不差。`,
    t: `1. 數字可以是負數（範例第五組就有 −1、−2），所以不能假設非負，計算 a0 時也要處理負數的除法。
2. (s[0] + s[1] − s[j]) 必須是偶數，否則 a0 不是整數，這條枚舉直接跳過。
3. 多重集合要用 multiset 或 map<int,int> 計數；直接用 vector 刪除要小心「相同數值只刪一個」。
4. 每次枚舉 j 都要重建多重集合（前一次的刪除要還原）。
5. 「非遞減」輸出——結果要排序後再印。
6. 讀到 EOF 結束，沒有測資數。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    while (cin >> n) {
        int cnt = n * (n - 1) / 2;
        vector<int> s(cnt);
        for (int i = 0; i < cnt; i++) cin >> s[i];
        sort(s.begin(), s.end());

        vector<int> ans;
        for (int j = 2; j < cnt && ans.empty(); j++) {
            int tot = s[0] + s[1] - s[j];
            if (tot % 2 != 0) continue;                  // a0 必須是整數
            int a0 = tot / 2;

            multiset<int> ms(s.begin(), s.end());
            vector<int> a;
            a.push_back(a0);
            a.push_back(s[0] - a0);
            a.push_back(s[1] - a0);

            bool ok = true;
            // 先把 a0+a1、a0+a2、a1+a2 這三個和刪掉
            int need[3] = {s[0], s[1], s[j]};
            for (int k = 0; k < 3 && ok; k++) {
                multiset<int>::iterator it = ms.find(need[k]);
                if (it == ms.end()) ok = false; else ms.erase(it);
            }

            while (ok && (int)a.size() < n) {
                if (ms.empty()) { ok = false; break; }
                int mn = *ms.begin();                    // 剩下的最小和
                int v = mn - a0;                         // 一定是 a0 + 新數字
                for (size_t k = 0; k < a.size() && ok; k++) {
                    multiset<int>::iterator it = ms.find(a[k] + v);
                    if (it == ms.end()) ok = false; else ms.erase(it);
                }
                if (ok) a.push_back(v);
            }
            if (ok && ms.empty() && (int)a.size() == n) {
                sort(a.begin(), a.end());
                ans = a;
            }
        }

        if (ans.empty()) cout << "Impossible\\n";
        else {
            for (int i = 0; i < n; i++) cout << (i ? " " : "") << ans[i];
            cout << "\\n";
        }
    }
    return 0;
}`
  },

  '10005': {
    q: `給定一個多邊形（不一定是凸的）的所有頂點，以及一個半徑 r，判斷是否存在一個半徑為 r 的圓能把整個多邊形包住。

輸入：多組測資。每組第一行是頂點數 n（n < 100），接著 n 行、每行兩個整數是頂點座標，最後一行是半徑 r（浮點數）。n 為 0 時結束。
輸出：能包住印「The polygon can be packed in the circle.」，否則印「There is no way of packing that polygon.」

範例輸入
3
0 0
1 0
0 1
1.0
3
0 0
1 0
0 1
0.1
0

範例輸出
The polygon can be packed in the circle.
There is no way of packing that polygon.`,
    h: `多邊形能被半徑 r 的圓包住 ⟺ 它的「最小外接圓（minimum enclosing circle, MEC）」半徑 ≤ r。

而多邊形的 MEC 只跟「頂點」有關（邊上的點都在頂點的凸包內），所以問題就是：求 n 個點的最小外接圓。

最經典的作法是 Welzl 演算法（隨機增量法），期望複雜度 O(n)：

  1. 先把點隨機打亂。
  2. 圓 C = 空。逐一加入點 p：
     若 p 已在 C 內 → 不動；
     否則 p 一定在新 MEC 的邊界上，於是以 p 為「必在邊界」的條件重跑一層：
       C = 以 (p, points[0]) 為直徑的圓，再逐一加入 q < i…（第二層）
       第二層若又發現 q 在外，就再進第三層，用三點求外接圓。
  三層迴圈看起來是 O(n³)，但隨機化之後期望是 O(n)。

兩個小工具：
  兩點為直徑的圓：圓心是中點、半徑是距離的一半。
  三點的外接圓：解兩條中垂線的交點（用行列式公式）。

判斷時要留一點浮點容忍：radius <= r + 1e-9。

驗算範例：直角三角形 (0,0)(1,0)(0,1) 的最小外接圓是以斜邊為直徑，半徑 √2/2 ≈ 0.7071。
  r = 1.0 → 0.7071 ≤ 1.0 → 可以包 ✓
  r = 0.1 → 不行 ✓`,
    t: `1. 不要誤以為「圓心是重心」或「圓心是外接矩形的中心」——那都不是最小外接圓。
2. 三點共線時外接圓不存在（分母為 0），要特別處理：這種情況最小外接圓就是最遠兩點的直徑圓。
3. 浮點比較要加 eps（例如 1e-9），不然剛好相等的測資會判錯。
4. 輸出字串一字不差，包含句尾的句點。
5. 終止條件是 n = 0；讀到 0 就結束、不要再讀半徑。
6. n < 100，就算寫成 O(n³) 的暴力（枚舉所有點對與三點組再驗證）也能過，但 Welzl 更穩。`,
    c: `#include <bits/stdc++.h>
using namespace std;

struct Pt { double x, y; };
double dist(const Pt& a, const Pt& b) {
    return sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

// 三點外接圓的圓心；共線時回傳 false
bool circumcenter(const Pt& a, const Pt& b, const Pt& c, Pt& o) {
    double d = 2.0 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
    if (fabs(d) < 1e-12) return false;
    double aa = a.x * a.x + a.y * a.y, bb = b.x * b.x + b.y * b.y, cc = c.x * c.x + c.y * c.y;
    o.x = (aa * (b.y - c.y) + bb * (c.y - a.y) + cc * (a.y - b.y)) / d;
    o.y = (aa * (c.x - b.x) + bb * (a.x - c.x) + cc * (b.x - a.x)) / d;
    return true;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    while (cin >> n && n != 0) {
        vector<Pt> p(n);
        for (int i = 0; i < n; i++) cin >> p[i].x >> p[i].y;
        double r;
        cin >> r;

        // Welzl 隨機增量法
        random_shuffle(p.begin(), p.end());
        Pt o = p[0];
        double rad = 0;
        const double EPS = 1e-9;
        for (int i = 1; i < n; i++) {
            if (dist(o, p[i]) <= rad + EPS) continue;
            o = p[i]; rad = 0;
            for (int j = 0; j < i; j++) {
                if (dist(o, p[j]) <= rad + EPS) continue;
                o.x = (p[i].x + p[j].x) / 2;
                o.y = (p[i].y + p[j].y) / 2;
                rad = dist(p[i], p[j]) / 2;
                for (int k = 0; k < j; k++) {
                    if (dist(o, p[k]) <= rad + EPS) continue;
                    Pt c;
                    if (!circumcenter(p[i], p[j], p[k], c)) continue;   // 共線
                    o = c;
                    rad = dist(o, p[i]);
                }
            }
        }

        if (rad <= r + EPS) cout << "The polygon can be packed in the circle.\\n";
        else cout << "There is no way of packing that polygon.\\n";
    }
    return 0;
}`
  },

  '12582': {
    q: `蘇丹的婚禮上有一排灑水器（sprinkler），每個灑水器有一個名字（單一大寫字母）。有人沿著灑水器走了一趟，記錄下經過的名字序列。

這個序列其實是某棵樹的「進入 / 離開」走訪紀錄：每個灑水器的名字恰好出現兩次，第一次是走進去、第二次是走出來。請算出每個灑水器連了幾條「小徑（trail）」，也就是它在樹上的度數。

輸入：第一行是測資數 T（≤ 100）。接著 T 行，每行一個合法的名字序列。
輸出：每組先印「Case k」，然後依名字字母順序印「名字 = 小徑數」，各佔一行。

範例輸入
2
AEFFGGEBDDCCBA
ZAABBZ

範例輸出
Case 1
A = 2
B = 3
C = 1
D = 1
E = 3
F = 1
G = 1
Case 2
A = 1
B = 1
Z = 2`,
    h: `用一個堆疊把序列還原成樹，邊建邊統計度數。

逐字掃描：
  - 若堆疊非空且堆疊頂端就是目前這個字元 → 表示「離開」這個節點，pop。
  - 否則 → 表示「進入」一個新節點：它的父親就是目前的堆疊頂端。
       把「父親」與「自己」的度數各 +1（這是一條樹邊），然後 push。

最後每個字母的度數就是答案（根節點的度數 = 子節點數，其餘節點 = 子節點數 + 1）。

驗算 AEFFGGEBDDCCBA：
  A 進（堆疊空，沒有父親）→ 堆疊 [A]
  E 進，父親 A → deg[A]=1, deg[E]=1，堆疊 [A,E]
  F 進，父親 E → deg[E]=2, deg[F]=1，堆疊 [A,E,F]
  F 出 → 堆疊 [A,E]
  G 進，父親 E → deg[E]=3, deg[G]=1
  G 出、E 出 → 堆疊 [A]
  B 進，父親 A → deg[A]=2, deg[B]=1
  D 進出 → deg[B]=2, deg[D]=1
  C 進出 → deg[B]=3, deg[C]=1
  B 出、A 出
  結果 A=2, B=3, C=1, D=1, E=3, F=1, G=1 ✓（與題目輸出完全一致）
ZAABBZ 同法得 A=1, B=1, Z=2 ✓`,
    t: `1. 判斷「是進入還是離開」的依據是「堆疊頂端是不是同一個字元」，不是「這個字元之前出現過沒有」——後者在 AEFFGGEBDDCCBA 這種情形會誤判。
2. 根節點（序列的第一個字元）沒有父親，第一次進入時不要加度數。
3. 輸出要「依字母順序」，不是依出現順序。
4. 名字是單一大寫字母，用 26 格的陣列就夠；但只印出「有出現過」的字母。
5. 輸出格式是「A = 2」，等號兩邊各一個空白。
6. Case 那行沒有冒號，只有「Case 1」。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    for (int tc = 1; tc <= T; tc++) {
        string s;
        cin >> s;
        vector<int> deg(26, 0);
        vector<char> seen(26, 0);
        vector<char> st;

        for (size_t i = 0; i < s.size(); i++) {
            char ch = s[i];
            seen[ch - 'A'] = 1;
            if (!st.empty() && st.back() == ch) {
                st.pop_back();                       // 離開這個節點
            } else {
                if (!st.empty()) {                   // 進入：父親是堆疊頂端
                    deg[st.back() - 'A']++;
                    deg[ch - 'A']++;
                }
                st.push_back(ch);
            }
        }

        cout << "Case " << tc << "\\n";
        for (int i = 0; i < 26; i++)
            if (seen[i]) cout << (char)('A' + i) << " = " << deg[i] << "\\n";
    }
    return 0;
}`
  },

  '11064': {
    q: `定義數列 i_n：i_n 是滿足下列條件的正整數 m 的個數——

    m < n，且 gcd(m, n) ≠ 1，且 gcd(m, n) ≠ m

（也就是 m 與 n 不互質，而且 m 不是 n 的因數。）

輸入：多行，每行一個整數 n（n < 2^31），讀到 EOF。
輸出：每行輸出對應的 i_n。

範例輸入
2147000000

範例輸出
1340599805`,
    h: `把三個條件翻譯成計數：

  在 1 ≤ m ≤ n−1 中：
    總數                = n − 1
    與 n 互質的          = φ(n)        （n > 1 時，互質的餘數都落在 1..n−1）
    → 不互質的          = n − 1 − φ(n)
  再從「不互質」中扣掉「m 整除 n」的（這時 gcd(m,n) = m）：
    n 的因數中落在 2..n−1 的個數 = d(n) − 2   （扣掉 1 與 n 本身；1 本來就與 n 互質不在此列，但 1 也不在「不互質」集合裡，所以扣的是 2..n−1 的因數）

所以

    i_n = (n − 1 − φ(n)) − (d(n) − 2) = n + 1 − φ(n) − d(n)

一次試除分解就能同時得到 φ(n) 與 d(n)：
    n = p1^e1 × ... × pk^ek
    φ(n) = n × Π (1 − 1/pi)
    d(n) = Π (ei + 1)

n < 2^31，試除到 √n ≈ 46341 即可，每筆測資幾萬次除法，很快。

驗算（我算過）：n = 2147000000 = 2^6 × 5^6 × 19 × 113
    φ(n) = 806400000，d(n) = 7 × 7 × 2 × 2 = 196
    i_n = 2147000000 + 1 − 806400000 − 196 = 1340599805 ✓`,
    t: `1. 公式裡的 φ 要用「整數安全」的算法：phi = phi / p * (p - 1)，先除再乘，避免溢位也避免浮點誤差。
2. n 接近 2^31，用 long long 存 n 與中間結果（n + 1 就可能超過 int）。
3. 試除完之後若剩下的 m > 1，它是一個大質數，要記得 φ 與 d 都要處理它（φ 乘 (m−1)/m、d 乘 2）。
4. n = 1 的特例：φ(1) = 1、d(1) = 1，公式給 1 + 1 − 1 − 1 = 0，正確（沒有 m < 1）。
5. 讀到 EOF 結束。
6. 別誤解條件：「gcd(m,n) ≠ m」等價於「m 不整除 n」。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long n;
    while (cin >> n) {
        long long m = n, phi = n, d = 1;
        for (long long p = 2; p * p <= m; p++) {
            if (m % p) continue;
            int e = 0;
            while (m % p == 0) { m /= p; e++; }
            phi = phi / p * (p - 1);
            d *= (e + 1);
        }
        if (m > 1) { phi = phi / m * (m - 1); d *= 2; }
        // i_n = (n-1-phi) - (d-2)
        cout << n + 1 - phi - d << "\\n";
    }
    return 0;
}`
  },

  '10088': {
    q: `我買了一座島，想在上面種樹，樹要種在整數格點上。但島本身不是長方形，所以我在島內畫了一個「簡單多邊形」（頂點都在格點上），只在「嚴格位於多邊形內部」的格點上種樹。

請計算能種幾棵樹。

輸入：多組測資。每組第一行是頂點數 n（3 ≤ n ≤ 1000），接著 n 行，每行兩個整數是頂點座標（順時針或逆時針皆可，絕對值不超過 1,000,000）。n 為 0 時結束。
輸出：每組輸出一行內部格點數。

範例輸入
12
3 1
6 3
9 2
8 4
9 6
9 9
8 9
6 5
5 8
4 4
3 5
1 3
0

範例輸出
21`,
    h: `Pick 定理：對頂點都在格點上的簡單多邊形，

    A = I + B/2 − 1

其中 A 是面積、I 是「嚴格內部」的格點數、B 是「邊界上」的格點數。移項得到我們要的

    I = A − B/2 + 1

兩個量都好算：
  面積用鞋帶公式（取兩倍面積避免除法）：
      2A = |Σ (x_i · y_{i+1} − x_{i+1} · y_i)|
  邊界格點數：一條從 (x1,y1) 到 (x2,y2) 的線段上（不含起點、含終點）有 gcd(|dx|, |dy|) 個格點，全部加起來就是 B。

代進去（全用整數）：
    I = (2A − B + 2) / 2

驗算範例（我用 BigInt 實測）：那 12 個頂點的多邊形算出 I = 21 ✓

數值範圍：座標到 10^6、n 到 1000，2A 最大約 2 × 10^6 × 10^6 × 1000 ⇒ 遠超 int，一定要用 long long（甚至要注意 __int128？實際上鞋帶公式每一項最大 10^12，累加 1000 項 = 10^15，long long 的 9.2×10^18 綽綽有餘）。`,
    t: `1. 一定要用 long long。座標乘積就有 10^12，累加後到 10^15。用 int 會直接爆掉。
2. 鞋帶公式算出來可能是負的（看頂點順序），取絕對值。
3. gcd(0, k) = k，垂直或水平的邊要靠這個性質才會算對；C++ 的 __gcd(0, k) 回傳 k，沒問題，但要先取絕對值。
4. 「嚴格內部」——邊界上的格點不算，這正是 Pick 定理裡的 I。
5. 終止條件是 n = 0。
6. 多邊形保證是「簡單」的（邊不自交），所以 Pick 定理適用。`,
    c: `#include <bits/stdc++.h>
using namespace std;

long long gcdll(long long a, long long b) {
    a = llabs(a); b = llabs(b);
    while (b) { long long t = a % b; a = b; b = t; }
    return a;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    while (cin >> n && n != 0) {
        vector<long long> X(n), Y(n);
        for (int i = 0; i < n; i++) cin >> X[i] >> Y[i];

        long long A2 = 0, B = 0;
        for (int i = 0; i < n; i++) {
            int j = (i + 1) % n;
            A2 += X[i] * Y[j] - X[j] * Y[i];      // 鞋帶公式（兩倍面積）
            B += gcdll(X[j] - X[i], Y[j] - Y[i]); // 這條邊上的格點數
        }
        if (A2 < 0) A2 = -A2;
        // Pick 定理：I = A - B/2 + 1 = (2A - B + 2) / 2
        cout << (A2 - B + 2) / 2 << "\\n";
    }
    return 0;
}`
  },

  '10990': {
    q: `一個數字的「phi 深度」是指反覆取歐拉函數 φ 直到變成 1 所需的步數。例如

    φ(13) = 12  … 第 1 步
    φ(12) = 4   … 第 2 步
    φ(4)  = 2   … 第 3 步
    φ(2)  = 1   … 第 4 步
所以 depthphi(13) = 4。

再定義 SODF(m, n) = depthphi(m) + depthphi(m+1) + ... + depthphi(n)。

給定 m 與 n，求 SODF(m, n)。

輸入：第一行是測資數 N（0 < N < 2001）。接下來每行兩個整數 m n（2 ≤ m ≤ n ≤ 2000000）。
輸出：每行輸出對應的 SODF 值。

範例輸入
2
2 10
100000 200000

範例輸出
22
1495105`,
    h: `一次篩出所有 φ 值，再遞推深度，最後用前綴和回答區間查詢。

步驟：
1. 埃氏篩法求 φ(1..2000000)：
       phi[i] = i 初始化
       對每個質數 p（即 phi[p] == p 的 p），把所有倍數 m 做 phi[m] -= phi[m] / p
2. 深度遞推：
       dep[1] = 0
       dep[i] = dep[phi[i]] + 1
   因為 φ(i) < i（i > 1），所以由小到大遞推時 dep[phi[i]] 一定已經算好。
3. 前綴和：
       pre[i] = pre[i-1] + dep[i]
       SODF(m, n) = pre[n] − pre[m-1]

三個步驟都是 O(N log log N) 或 O(N)，2×10^6 的規模在時限內綽綽有餘。

我用 JS 完整跑過：dep[13] = 4 ✓、SODF(2,10) = 22 ✓、SODF(100000, 200000) = 1495105 ✓

記憶體：兩個 int 陣列（2×10^6 × 4 bytes × 2 = 16 MB）加一個 long long 前綴和陣列（16 MB），如果吃緊，dep 可以改用 char（深度最多約 21）。`,
    t: `1. 一定要「打表一次」而不是每筆測資重算——最多 2000 筆查詢，重算會 TLE。
2. dep[1] = 0，而 dep[2] = dep[φ(2)] + 1 = dep[1] + 1 = 1。邊界設錯會整排偏移。
3. 前綴和可能超過 int：2×10^6 × 21 ≈ 4.2×10^7，其實 int 夠用，但用 long long 保險。
4. 篩 φ 的寫法 phi[m] -= phi[m] / p 只有在「p 是質數且由小到大處理」時才正確。
5. m 最小是 2，所以不用擔心 pre[m-1] 越界（m-1 ≥ 1）。
6. 記憶體若吃緊，dep 用 unsigned char（值不超過 21）可省下不少。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    const int N = 2000000;
    vector<int> phi(N + 1);
    for (int i = 0; i <= N; i++) phi[i] = i;
    for (int p = 2; p <= N; p++)
        if (phi[p] == p)                             // p 是質數
            for (int m = p; m <= N; m += p) phi[m] -= phi[m] / p;

    vector<unsigned char> dep(N + 1, 0);
    dep[1] = 0;
    for (int i = 2; i <= N; i++) dep[i] = (unsigned char)(dep[phi[i]] + 1);

    vector<long long> pre(N + 1, 0);
    for (int i = 2; i <= N; i++) pre[i] = pre[i - 1] + dep[i];

    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        int m, n;
        cin >> m >> n;
        cout << pre[n] - pre[m - 1] << "\\n";
    }
    return 0;
}`
  },

  '10308': {
    q: `北方的村莊之間造路很貴，所以路網被設計成：任兩個村莊之間只有唯一一條不重複經過其他村莊的路徑（也就是一棵樹）。

給定村莊與道路，請求出「最遠的兩個村莊之間的道路距離」，也就是這棵樹的直徑。村莊最多 10000 個，編號從 1 開始。

輸入：多組測資。每組是一連串的行，每行三個正整數：村莊 a、村莊 b、這條路的長度。每組以空行分隔，讀到 EOF。
輸出：每組輸出一行，最遠兩村莊之間的距離。

範例輸入
5 1 6
1 4 5
6 3 9
2 6 8
6 1 7

範例輸出
22`,
    h: `樹的直徑，經典的「兩次 DFS/BFS」：

  1. 從任一點 s 出發做 DFS，找出距離 s 最遠的點 u。
  2. 從 u 出發再做一次 DFS，距離 u 最遠的點 v，dist(u, v) 就是直徑。

為什麼正確？可以證明「從任一點出發最遠的點，一定是某條直徑的端點」。

實作要點：
  - n 可到 10000，用鄰接串列。
  - 遞迴 DFS 深度最壞 10000，通常沒問題；保險可以寫成用堆疊的迭代版或用 BFS（邊有權重，但樹上不會有更短路徑，所以「BFS 順序 + 累加距離」也對）。

範例驗算：邊 5-1(6)、1-4(5)、6-3(9)、2-6(8)、6-1(7)。
  從 5 出發：5→1 = 6，1→4 = 11，1→6 = 13，6→3 = 22，6→2 = 21 → 最遠是 3，距離 22。
  從 3 再走一次：3→6 = 9，6→2 = 17，6→1 = 16，1→5 = 22，1→4 = 21 → 最遠 22 ✓

輸入的處理才是這題真正的坑：測資組數沒有告知、每組的邊數也沒有告知，只用「空行」分隔。要用 getline 一行一行讀，遇到空行就結束一組。`,
    t: `1. 輸入格式：用 getline 逐行讀，讀到空行代表一組結束，讀到 EOF 代表全部結束。用 >> 讀會看不到空行。
2. 村莊編號從 1 開始，但最大編號未必等於村莊數——要邊讀邊記錄出現過的最大編號，或直接開 10005 的陣列。
3. 邊長沒說上限，總距離用 long long 保險。
4. 每組測資都要清空鄰接串列。
5. 只有一個村莊（沒有任何邊）的極端情形，直徑是 0。
6. 樹保證連通，所以兩次 DFS 一定走得到所有點。`,
    c: `#include <bits/stdc++.h>
using namespace std;

vector<vector<pair<int, long long> > > adj;

// 迭代版 DFS，回傳最遠點並把距離填進 d
int farthest(int s, int n, vector<long long>& d) {
    d.assign(n + 1, -1);
    vector<int> st(1, s);
    d[s] = 0;
    int best = s;
    while (!st.empty()) {
        int u = st.back(); st.pop_back();
        if (d[u] > d[best]) best = u;
        for (size_t k = 0; k < adj[u].size(); k++) {
            int v = adj[u][k].first;
            if (d[v] < 0) { d[v] = d[u] + adj[u][k].second; st.push_back(v); }
        }
    }
    return best;
}

static string trim(string s) {
    while (!s.empty() && isspace((unsigned char)s.back())) s.pop_back();
    size_t i = 0;
    while (i < s.size() && isspace((unsigned char)s[i])) i++;
    return s.substr(i);
}

int main() {
    string line;
    const int MAXN = 10005;
    while (true) {
        adj.assign(MAXN, vector<pair<int, long long> >());
        int maxId = 0;
        bool any = false;
        bool eof = true;
        while (getline(cin, line)) {
            eof = false;
            string s = trim(line);
            if (s.empty()) { if (any) break; else continue; }
            int a, b; long long w;
            istringstream in(s);
            in >> a >> b >> w;
            adj[a].push_back(make_pair(b, w));
            adj[b].push_back(make_pair(a, w));
            maxId = max(maxId, max(a, b));
            any = true;
        }
        if (!any) { if (eof) break; else continue; }

        vector<long long> d;
        int u = farthest(1, maxId, d);        // 第一次：找最遠端點
        int v = farthest(u, maxId, d);        // 第二次：量出直徑
        cout << d[v] << "\\n";

        if (cin.eof()) break;
    }
    return 0;
}`
  },

  '11022': {
    q: `在看似隨機的字串中找出重複的樣式，是很多領域（DNA 分析、資料壓縮、訊號解讀）都會遇到的問題。

一個字串可以被「因式分解」：若 S = X^k（X 重複 k 次），那麼 S 可以用 X 來表示。分解可以遞迴進行，也可以把字串切成好幾段各自分解。分解後的「重量（weight）」定義為最後剩下的字元總數。

例如 PRATTATTATTIC 可以寫成 PR(A(T)²)³IC，重量是 P、R、A、T、I、C 共 6 個字元。

請求出每個字串的「最大分解」後的最小重量。

輸入：每行一個字串（1 到 79 個大寫字母），以只含一個 '*' 的行結束。
輸出：每行輸出對應的最小重量。

範例輸入
PRATTATTATTIC
GGGGGGGGG
PRIME
BABBABABBABBA
ARPARPARPARPAR
*

範例輸出
6
1
5
6
5`,
    h: `區間 DP。設 dp[i][j] = 子字串 s[i..j] 的最小重量。

三種轉移：
  1. 完全不分解：dp[i][j] = 長度 (j − i + 1)
  2. 週期壓縮：若 s[i..j] 是某個長度 p 的字串重複 (len/p) 次（p 整除 len，且對所有 k 有 s[k] == s[k−p]），
     則 dp[i][j] 可以取 dp[i][i+p−1]
  3. 切成兩段：dp[i][j] = min over k of ( dp[i][k] + dp[k+1][j] )

三者取最小。答案是 dp[0][n−1]。

複雜度：狀態 O(n²)，週期檢查 O(n) × 因數個數、切分 O(n) → 總共約 O(n³) = 80³ ≈ 5×10^5，秒殺。

我用 JS 實作並印出最佳分解，驗證五組範例：
    PRATTATTATTIC  = 6   PR(A(T)^2)^3IC
    GGGGGGGGG      = 1   (G)^9
    PRIME          = 5   PRIME
    BABBABABBABBA  = 6   (BAB)^2A((B)^2A)^2
    ARPARPARPARPAR = 5   AR(PAR)^4
全部與題目答案吻合。注意 PRATTATTATTIC 之所以是 6 而不是 7，是因為週期 ATT 本身還能再壓成 A(T)²，重量只有 2。`,
    t: `1. 週期壓縮要「遞迴地」用 dp[i][i+p-1] 而不是直接用 p——這正是 PRATTATTATTIC 答案是 6 而非 7 的原因（ATT 內部的 TT 還能再壓）。
2. 週期 p 必須整除長度，否則不是完整的重複。
3. 三種轉移都要試，只做週期壓縮或只做切分都會答錯（BABBABABBABBA 就同時需要兩者）。
4. 長度上限 79，dp 開 80×80 就好；但別忘了長度 1 的 dp 是 1。
5. 終止條件是只含 '*' 的一行。
6. 「重量」是最後剩下的字元個數，不是分解的層數。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s;
    while (cin >> s && s != "*") {
        int n = (int)s.size();
        vector<vector<int> > dp(n, vector<int>(n, 0));
        for (int len = 1; len <= n; len++) {
            for (int i = 0; i + len - 1 < n; i++) {
                int j = i + len - 1;
                int best = len;                       // 完全不分解
                // 週期壓縮：s[i..j] = X^(len/p)
                for (int p = 1; p < len; p++) {
                    if (len % p) continue;
                    bool ok = true;
                    for (int k = i + p; k <= j && ok; k++)
                        if (s[k] != s[k - p]) ok = false;
                    if (ok) best = min(best, dp[i][i + p - 1]);   // 遞迴用週期自己的重量
                }
                // 切成兩段
                for (int k = i; k < j; k++)
                    best = min(best, dp[i][k] + dp[k + 1][j]);
                dp[i][j] = best;
            }
        }
        cout << dp[0][n - 1] << "\\n";
    }
    return 0;
}`
  },

  '10702': {
    q: `Jean 是旅行推銷員，他在城市之間旅行：到一個城市就把手上的東西賣掉、再買新的，然後前往下一個城市。

給定「從城市 i 到城市 j 能賺多少」的利潤表、出發城市、可以結束的城市清單、以及他想進行的「城際移動次數」，請求出最佳路線的總利潤。路線可以重複造訪同一個城市。

輸入：多組測資。每組第一行四個整數 n s e k：城市數 n（≤ 100）、出發城市編號 s、可結束的城市個數 e、移動次數 k（≤ 1000）。
接著 n 行、每行 n 個非負整數，第 i 行第 j 個是「從 i 到 j」的利潤（i 到 i 一定是 0）。注意 i→j 與 j→i 的利潤可能不同。
再一行 e 個整數，是可以結束的城市編號。
以 n = 0 結束（該組不處理）。組與組之間有空行。
輸出：每組輸出一行最大總利潤。

範例輸入
3 1 2 2
0 3 5
5 0 1
9 2 0
2 3
0 0 0 0

範例輸出
7`,
    h: `分層 DP（也就是「走 k 步的最長路」）：

    dp[t][v] = 走了 t 次移動之後，人在城市 v 的最大累積利潤
    dp[0][s] = 0，其餘 −∞
    dp[t+1][v] = max over u≠v of ( dp[t][u] + profit[u][v] )

答案 = max over 可結束城市 e 的 dp[k][e]。

複雜度 O(k · n²) = 1000 × 100² = 10^7，可以接受。用滾動陣列只留兩層即可省記憶體。

範例驗算（n=3、出發城市 1、走 2 步、可結束於 {2,3}）：
  利潤表（1-based）：1→2 = 3, 1→3 = 5, 2→1 = 5, 2→3 = 1, 3→1 = 9, 3→2 = 2
  1→2→3 = 3 + 1 = 4
  1→3→2 = 5 + 2 = 7  ← 最佳，結束在城市 2（在清單裡）✓
  答案 7 ✓

注意題目說「不會原地不動」（i→i 的利潤是 0 且他不想留在原地），所以轉移時要跳過 u == v。`,
    t: `1. 「路線可以重複造訪城市」——所以這不是 TSP，不需要狀態壓縮，只是單純的分層最長路。看到 Travelling Salesman 就寫 bitmask DP 是最大的陷阱（而且 n = 100 也做不到）。
2. 城市編號是 1-based，記得轉換。
3. dp 初始值要用「負無限大」而不是 0，否則會允許從不存在的狀態出發。
4. 移動次數 k 可能是 0——那就只能結束在出發城市，答案是 0（若 s 在可結束清單中）或無解。
5. 利潤是非負的，所以總利潤最大 1000 × 大值，int 可能不夠，用 long long。
6. 終止條件是第一個數字 n = 0（整行是 0 0 0 0）。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, s, e, k;
    while (cin >> n >> s >> e >> k && n != 0) {
        vector<vector<long long> > P(n, vector<long long>(n));
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) cin >> P[i][j];
        vector<int> ends(e);
        for (int i = 0; i < e; i++) { cin >> ends[i]; ends[i]--; }
        s--;

        const long long NEG = LLONG_MIN / 4;
        vector<long long> dp(n, NEG), nd(n);
        dp[s] = 0;
        for (int t = 0; t < k; t++) {
            fill(nd.begin(), nd.end(), NEG);
            for (int u = 0; u < n; u++) {
                if (dp[u] == NEG) continue;
                for (int v = 0; v < n; v++) {
                    if (v == u) continue;               // 不會原地不動
                    nd[v] = max(nd[v], dp[u] + P[u][v]);
                }
            }
            dp = nd;
        }
        long long best = NEG;
        for (int i = 0; i < e; i++) best = max(best, dp[ends[i]]);
        cout << best << "\\n";
    }
    return 0;
}`
  },

  '11218': {
    q: `一首歌需要 3 個人一起唱（房間裡剛好 3 支麥克風）。你們一共 9 個人，每個人恰好唱一次——也就是要把 9 個人分成 3 組、每組 3 人。

有些三人組合合不來，有些組合表現得比較好。給定「某些三人組合的分數」，請求出三組的總分最大是多少。沒有給分數的組合代表不能組。

輸入：多組測資。每組第一行是組合數 n（0 < n < 81），接下來 n 行，每行四個正整數 a b c s（1 ≤ a < b < c ≤ 9，分數 s < 10000），表示 {a,b,c} 這組的分數是 s。以單獨一個 0 結束。
輸出：每組印「Case k: 最大總分」；若無法完成分組印 −1。

範例輸入
3
1 2 3 1
4 5 6 2
7 8 9 3
4
1 2 3 1
1 4 5 2
1 6 7 3
1 8 9 4
0

範例輸出
Case 1: 6
Case 2: -1`,
    h: `9 個人 → 用 9 位元的狀態壓縮，狀態總數只有 512。

    dp[mask] = 已經把 mask 中的人分好組能拿到的最高總分（mask 中的位元數必為 3 的倍數）
    dp[0] = 0，其餘 −1（不可達）

轉移：對每個可達的 mask，試每一個給定的三人組合 c（也壓成一個 9 位元遮罩）：
    若 (mask & c) == 0 → dp[mask | c] = max(dp[mask | c], dp[mask] + score(c))

答案是 dp[0b111111111] = dp[511]，若仍是 −1 就印 −1。

複雜度：512 × 80 = 40960，瞬間完成。1000 組測資也毫無壓力。

還有個更快的小技巧：只從「包含最小未分配者」的組合中挑，可以把搜尋量再砍一大截，但這題規模根本用不上。

驗算（我用 JS 實測）：
  第一組 {1,2,3}=1、{4,5,6}=2、{7,8,9}=3 → 恰好三組互不重疊，總分 6 ✓
  第二組所有組合都含 1 號，三組必定重疊 → −1 ✓`,
    t: `1. 「沒有給分數的組合就不能用」——不要把未列出的組合當成 0 分可用，那樣第二組會答成 0 而不是 −1。
2. dp 初始值用 −1（或很小的負數）表示不可達，不能用 0。
3. 人的編號是 1..9，轉成位元時要減 1。
4. 分數是正整數，所以最大值一定 ≥ 3；但「不可行」要輸出 −1 而不是 0。
5. 測資可能很多（最多 1000 組），dp 陣列每組都要重設。
6. 終止條件是單獨一行的 0。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, cs = 1;
    while (cin >> n && n != 0) {
        vector<pair<int, int> > combo(n);      // (九位元遮罩, 分數)
        for (int i = 0; i < n; i++) {
            int a, b, c, s;
            cin >> a >> b >> c >> s;
            combo[i] = make_pair((1 << (a - 1)) | (1 << (b - 1)) | (1 << (c - 1)), s);
        }

        vector<int> dp(512, -1);
        dp[0] = 0;
        for (int mask = 0; mask < 512; mask++) {
            if (dp[mask] < 0) continue;
            for (int i = 0; i < n; i++) {
                int c = combo[i].first;
                if (mask & c) continue;                    // 有人重複
                int nm = mask | c;
                if (dp[mask] + combo[i].second > dp[nm]) dp[nm] = dp[mask] + combo[i].second;
            }
        }
        cout << "Case " << cs++ << ": " << dp[511] << "\\n";
    }
    return 0;
}`
  },

  '12293': {
    q: `有兩個一模一樣的盒子，一個裝了 n 顆球，另一個裝了 1 顆球。

Alice 與 Bob 輪流動作，Alice 先。每一步：找出球比較少的那個盒子，把它清空（球永久消失），然後把「另一個盒子」裡的球重新分配到兩個盒子中——分配後每個盒子至少要有 1 顆球。若某位玩家無法做出合法動作，他就輸了。

兩人都採取最佳策略，請問誰會贏？

輸入：多筆測資（≤ 300），每行一個整數 n（1 ≤ n ≤ 10^9）。以 n = 0 結束。
輸出：每筆印勝者的名字（Alice 或 Bob）。

範例輸入
2
3
4
0

範例輸出
Alice
Bob
Alice`,
    h: `先把遊戲抽象化。目前狀態是「一個盒子有 1 顆、另一個有 N 顆」。輪到的人：
  清空那顆只有 1 顆的盒子，把 N 顆重新分成 a + b（a, b ≥ 1）。
  接著換對手，對手看到的是 (a, b)，他會清空比較少的那邊，重新分配比較多的那邊 —— 也就是他面對的數字是 max(a, b)。

所以整個遊戲可以化簡成：

    當前數字 N。你要把 N 拆成 a + b（a, b ≥ 1），對手接手的數字是 max(a, b)。
    max(a, b) 的可能範圍是 ceil(N/2) 到 N−1。
    N = 1 時無法拆 → 當前玩家輸。

算一下必敗態（當前玩家輸的 N）：
    N = 1：敗
    N = 2：可到 1（敗態）→ 勝
    N = 3：只能到 2（勝態）→ 敗
    N = 4：可到 3（敗態）→ 勝
    N = 5, 6：都能到 3 → 勝
    N = 7：只能到 4, 5, 6（全勝態）→ 敗
    …
規律是 N = 1, 3, 7, 15, 31, ... 也就是 N = 2^k − 1 時當前玩家必敗。

Alice 面對的正是 N = n，所以

    n = 2^k − 1 → Bob 贏；否則 Alice 贏

判斷 n 是否為 2^k − 1 的一行寫法：((n + 1) & n) == 0。

驗算：n=2 → 3&2 = 2 ≠ 0 → Alice ✓；n=3 → 4&3 = 0 → Bob ✓；n=4 → 5&4 = 4 ≠ 0 → Alice ✓`,
    t: `1. 別被「兩個盒子」的敘述嚇到——真正的狀態只有一個數字（比較多的那邊），因為少的那邊永遠會被清空。
2. 「分配後每個盒子至少 1 顆」是關鍵限制，它讓 N = 1 變成必敗態。
3. n 可到 10^9，2^30 − 1 = 1073741823 也在範圍內，所以要能正確判斷到 2^30 − 1。
4. ((n+1) & n) == 0 這個判斷在 n = 0 時也成立，但輸入用 0 當終止符所以碰不到。
5. 別打表——n 到 10^9 沒辦法打表，要用位元判斷。
6. 輸出是 "Alice" / "Bob"，注意大小寫。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long n;
    while (cin >> n && n != 0) {
        // n 是 2^k - 1（二進位全是 1）時，先手 Alice 必敗
        bool allOnes = (((n + 1) & n) == 0);
        cout << (allOnes ? "Bob" : "Alice") << "\\n";
    }
    return 0;
}`
  },

  '10201': {
    q: `你要租一輛搬家貨車。這輛車每走 1 公里就耗掉 1 公升汽油，油箱容量 200 公升。租車時油箱是「半滿」（100 公升），還車時油箱也必須「至少半滿」（≥ 100 公升）。你想讓油錢最少，但路上不能沒油。

輸入：第一行是測資組數，各組之間有空行。每組第一行是總距離（公里，≤ 10000）。接著最多 100 個加油站的資料，每個佔一行：距離起點的公里數（依非遞減排序）與該站每公升的油價（單位是「十分之一分」，≤ 2000）。
輸出：每組輸出最少的油錢；若無法在限制下抵達，輸出「Impossible」。兩組之間空一行。

範例輸入
1

500
100 999
150 888
200 777
300 999
400 1009
450 1019
500 1399

範例輸出
450550`,
    h: `以「油量」為狀態的 DP。

    dp[f] = 抵達目前這個加油站時，油箱剩 f 公升的最小花費

從起點（距離 0、油量 100、花費 0）開始，依序處理每個加油站：

1. 移動：從上一個位置走 move 公里到這個加油站
       new_dp[f − move] = dp[f]      （需 f ≥ move）
2. 加油：在這個站以價格 pr 加油，一次加 1 公升
       new_dp[f + 1] = min(new_dp[f + 1], new_dp[f] + pr)
   這一步要「由小到大掃過整個 f」，這樣才能自動處理「加很多公升」的情形（就是完全背包的寫法）。

最後從最後一個加油站走到終點：需要 move 公里，而且到達時要 ≥ 100 公升，所以
    答案 = min over f ≥ 100 + move 的 dp[f]

油量範圍 0..200、加油站 ≤ 100 → 狀態數只有 2 萬，非常小。

驗算：範例的答案 450550，我用 JS 實作這個 DP 跑出來完全一致 ✓

注意「加油站可能剛好在終點」（範例最後一個站就在 500 公里處），這時最後一段 move = 0，仍然要求 ≥ 100 公升。`,
    t: `1. 起始油量是 100（半滿）不是 0 也不是 200；結束時也要 ≥ 100。兩個條件都漏不得。
2. 加油的內層迴圈必須「由小到大」，才能讓 dp[f] 由 dp[f-1] 推得而達成「加任意公升」的效果。寫成由大到小就變成「最多加 1 公升」。
3. 油價單位是「十分之一分」，題目沒有要求換算，直接照數字加總輸出即可。
4. 距離可能有兩個加油站在同一公里處（非遞減，不是嚴格遞增），move 會是 0，程式要能處理。
5. 若中途某段距離超過 200 公里就一定到不了 → Impossible。DP 會自然得出全部無限大。
6. 兩組輸出之間要空一行；輸入的空行要用 getline 或直接靠 >> 跳過。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    for (int tc = 0; tc < T; tc++) {
        int D;
        cin >> D;
        vector<pair<int, int> > st;              // (距離, 油價)
        int d, p;
        // 加油站資料一直讀到「距離 > D」不會發生，改用行為判斷：讀到下一組或 EOF
        // 這裡採用常見寫法：讀到距離超過 D 或讀完該組（以空行分隔）
        string line;
        getline(cin, line);                      // 吃掉 D 那行的換行
        while (getline(cin, line)) {
            // 去掉前後空白
            size_t a = 0, b = line.size();
            while (a < b && isspace((unsigned char)line[a])) a++;
            while (b > a && isspace((unsigned char)line[b - 1])) b--;
            string s = line.substr(a, b - a);
            if (s.empty()) break;                // 本組結束
            istringstream in(s);
            in >> d >> p;
            st.push_back(make_pair(d, p));
        }

        const int CAP = 200;
        const long long INF = LLONG_MAX / 4;
        vector<long long> dp(CAP + 1, INF), nd(CAP + 1);
        dp[100] = 0;                             // 出發時半滿
        int pos = 0;

        for (size_t i = 0; i < st.size(); i++) {
            int move = st[i].first - pos;
            pos = st[i].first;
            fill(nd.begin(), nd.end(), INF);
            for (int f = move; f <= CAP; f++)
                if (dp[f] < INF) nd[f - move] = min(nd[f - move], dp[f]);
            // 加油：完全背包式的由小到大掃
            for (int f = 1; f <= CAP; f++)
                if (nd[f - 1] < INF) nd[f] = min(nd[f], nd[f - 1] + st[i].second);
            dp = nd;
        }

        int move = D - pos;
        long long best = INF;
        for (int f = 100 + move; f <= CAP; f++) best = min(best, dp[f]);

        if (tc) cout << "\\n";
        if (best >= INF) cout << "Impossible\\n";
        else cout << best << "\\n";
    }
    return 0;
}`
  }
};

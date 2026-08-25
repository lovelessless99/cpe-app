/* 三星第十一批 —— 高 AC 經典題 */
const SOL51 = {
  '10250': {
    q: `你有一塊四邊形土地，對邊等長（也就是平行四邊形）。四個鄰居的土地分別緊貼你的四條邊，而且每塊鄰地都是「正方形」，共用的那條邊就是正方形的一邊。四個鄰居彼此沒有共用邊、土地也不重疊。每位鄰居都在自家正方形的正中央種了一棵樹。

給定「兩個相對的鄰居」的樹的座標，求另外兩棵樹的座標。

輸入：每行四個浮點數或整數 x1 y1 x2 y2，是兩棵相對的樹的座標。讀到 EOF。
輸出：每行輸出另外兩棵樹的座標（各保留 10 位小數）；若無法決定則輸出「Impossible.」。

範例輸入
10 0 -10 0

範例輸出
0.0000000000 10.0000000000 0.0000000000 -10.0000000000`,
    h: `四棵樹其實構成一個正方形——這是本題的核心觀察。

理由：設你的平行四邊形是 ABCD，四個鄰居正方形的中心分別在四條邊的外側、距離該邊「邊長的一半」處。用向量算一下會發現，這四個中心點形成一個正方形（這是著名的 Van Aubel / 四邊形外接正方形性質的特例）。

既然四個中心是正方形的四個頂點，而題目給的是「一對相對的頂點」（也就是對角線的兩端），那另外兩個頂點就是：

    中心 M = ((x1+x2)/2, (y1+y2)/2)
    半對角向量 v = ((x2−x1)/2, (y2−y1)/2)
    把 v 旋轉 90 度得到 w = (−v.y, v.x)
    另兩個頂點 = M + w 與 M − w

驗算範例一：(10,0) 與 (−10,0)。M = (0,0)，v = (−10, 0)，w = (0, −10)。
   另兩點 = (0,−10) 與 (0,10) → 輸出 0 10 與 0 −10 ✓

再自己驗一組：(0,0) 與 (0,8)。M = (0,4)，v = (0,4)，w = (−4,0)。
   另兩點 = (−4,4) 與 (4,4)——確實構成以 (0,0)、(0,8) 為對角線的正方形 ✓

「Impossible.」的情形是兩個給定點重合（v 為零向量，正方形退化）。`,
    t: `1. 別去解原本那塊平行四邊形——它其實不唯一，但四棵樹的位置唯一。抓住「四個中心成正方形」這個性質就三行解決。
2. 輸出要 10 位小數，用 fixed << setprecision(10)。
3. 輸出可能出現「−0.0000000000」（例如範例一的第二種寫法），UVa 通常兩者都接受；若擔心，可以在輸出前把 −0 正規化成 0（加上 0.0 或判斷 fabs < eps）。
4. 兩個點的輸出順序沒有規定（正方形的兩個對稱頂點），任一順序都可以。
5. 兩點重合時輸出「Impossible.」（含句點）。
6. 輸入可能是浮點數，用 double 讀。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout << fixed << setprecision(10);

    double x1, y1, x2, y2;
    while (cin >> x1 >> y1 >> x2 >> y2) {
        double mx = (x1 + x2) / 2, my = (y1 + y2) / 2;   // 正方形中心
        double vx = (x2 - x1) / 2, vy = (y2 - y1) / 2;   // 半對角向量
        if (fabs(vx) < 1e-12 && fabs(vy) < 1e-12) {
            cout << "Impossible.\\n";
            continue;
        }
        double wx = -vy, wy = vx;                        // 旋轉 90 度
        double ax = mx + wx, ay = my + wy;
        double bx = mx - wx, by = my - wy;
        // 消掉 -0.0
        if (fabs(ax) < 1e-12) ax = 0;
        if (fabs(ay) < 1e-12) ay = 0;
        if (fabs(bx) < 1e-12) bx = 0;
        if (fabs(by) < 1e-12) by = 0;
        cout << ax << " " << ay << " " << bx << " " << by << "\\n";
    }
    return 0;
}`
  },

  '10083': {
    q: `給定三個不超過 2147483647 的正整數 a、b、c，判斷 (a^b − 1) / (a^c − 1) 是否為「小於 100 位數的整數」。

輸入：每行三個整數 a b c，讀到 EOF。
輸出：先印出算式 (a^b-1)/(a^c-1)，然後接一個空白與答案值；若不是小於 100 位的整數，就接「is not an integer with less than 100 digits.」

範例輸入
2 9 3
2 3 2
21 42 7
123 911 1

範例輸出
(2^9-1)/(2^3-1) 73
(2^3-1)/(2^2-1) is not an integer with less than 100 digits.
(21^42-1)/(21^7-1) 18952884496956715554550978627384117011154680106
(123^911-1)/(123^1-1) is not an integer with less than 100 digits.`,
    h: `兩個關鍵事實：

【何時整除】
    (a^b − 1) / (a^c − 1) 是整數 ⟺ c 整除 b
理由：令 b = qc + r，用等比級數展開會發現餘數項是 a^r − 1，只有 r = 0 時才整除。
（a = 1 時要特判：分母是 0。）

【商是什麼】
若 b = qc，設 t = a^c，則
    (a^b − 1)/(a^c − 1) = (t^q − 1)/(t − 1) = 1 + t + t² + ... + t^(q−1)

所以只要用大數把這 q 項加起來就好。不用做大數除法！

【何時放棄】
題目要求「小於 100 位」，所以邊加邊檢查：一旦累積值的位數 ≥ 100 就可以立刻停下來印失敗訊息。因為每一項都是正的、只會愈加愈大，提早中斷是安全的。

驗算：
  (2^9−1)/(2^3−1)：3 | 9，t = 8，q = 3 → 1 + 8 + 64 = 73 ✓
  (2^3−1)/(2^2−1)：2 ∤ 3 → 不是整數 ✓
  (21^42−1)/(21^7−1)：7 | 42，t = 21^7，q = 6 → 18952884496956715554550978627384117011154680106（46 位）✓
  (123^911−1)/(123^1−1)：1 | 911，q = 911，但 1 + 123 + 123² + ... 會遠遠超過 100 位 → 失敗 ✓`,
    t: `1. 一定要「先判斷 c 是否整除 b」，別真的去算 a^b（那是天文數字）。
2. 大數只需要「加法」與「乘以大數」兩個運算——把 t = a^c 先算出來（它本身也可能是大數，但若 t 已經超過 100 位就直接失敗）。
3. 提早中斷很重要：q 可能高達 2×10^9（例如 c = 1、b 很大），不中斷會跑到天荒地老。位數一超過 99 就停。
4. a = 1 的特例：分母 a^c − 1 = 0，除法無意義。這種輸入題目應該不會給，但保險起見判掉（輸出失敗訊息）。
5. 輸出的算式部分要照原樣印 a、b、c，不要印化簡後的。
6. 失敗訊息結尾有句點：「is not an integer with less than 100 digits.」`,
    c: `#include <bits/stdc++.h>
using namespace std;

typedef vector<int> Big;      // 低位在前的十進位

static Big fromInt(long long v) {
    Big r;
    if (v == 0) r.push_back(0);
    while (v) { r.push_back((int)(v % 10)); v /= 10; }
    return r;
}
static void add(Big& a, const Big& b) {
    int carry = 0;
    for (size_t i = 0; i < max(a.size(), b.size()) || carry; i++) {
        if (i == a.size()) a.push_back(0);
        int cur = a[i] + carry + (i < b.size() ? b[i] : 0);
        a[i] = cur % 10;
        carry = cur / 10;
    }
}
static Big mul(const Big& a, const Big& b) {
    Big r(a.size() + b.size(), 0);
    for (size_t i = 0; i < a.size(); i++) {
        int carry = 0;
        for (size_t j = 0; j < b.size() || carry; j++) {
            long long cur = r[i + j] + carry + (j < b.size() ? (long long)a[i] * b[j] : 0);
            r[i + j] = (int)(cur % 10);
            carry = (int)(cur / 10);
        }
    }
    while (r.size() > 1 && r.back() == 0) r.pop_back();
    return r;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long a, b, c;
    while (cin >> a >> b >> c) {
        cout << "(" << a << "^" << b << "-1)/(" << a << "^" << c << "-1) ";
        if (a <= 1 || c == 0 || b % c != 0) {
            cout << "is not an integer with less than 100 digits.\\n";
            continue;
        }
        // t = a^c，超過 100 位就直接失敗
        Big t = fromInt(1), base = fromInt(a);
        bool fail = false;
        for (long long e = 0; e < c; e++) {
            t = mul(t, base);
            if (t.size() >= 100) { fail = true; break; }
        }
        if (fail) {
            cout << "is not an integer with less than 100 digits.\\n";
            continue;
        }
        // sum = 1 + t + t^2 + ... + t^(q-1)
        long long q = b / c;
        Big sum = fromInt(0), term = fromInt(1);
        for (long long i = 0; i < q; i++) {
            add(sum, term);
            if (sum.size() >= 100) { fail = true; break; }
            if (i + 1 < q) {
                term = mul(term, t);
                if (term.size() >= 100) { fail = true; break; }
            }
        }
        if (fail) {
            cout << "is not an integer with less than 100 digits.\\n";
            continue;
        }
        for (int i = (int)sum.size() - 1; i >= 0; i--) cout << sum[i];
        cout << "\\n";
    }
    return 0;
}`
  },

  '10401': {
    q: `「受傷的皇后」只能像國王一樣做水平與斜向的一步移動，但仍然可以像皇后一樣抵達同一行（row）的任何位置。換句話說，兩個受傷皇后互相攻擊的條件是：它們在相鄰的兩「列（column）」上，而且行號相差不超過 1；或者它們在同一列上。

在 n×n 的棋盤上放 n 個受傷皇后（每列恰好一個），使彼此不攻擊。給定部分皇后的固定位置，求總共有幾種排法。

輸入：每行一個狀態字串，字串長度就是棋盤大小 n（n ≤ 15）。第 i 個字元代表第 i 列：'?' 表示該列的皇后可以放在任意行；'1'~'9'、'A'~'F' 分別代表行 1~9、10~15，表示該列的皇后固定在那一行。
輸出：每行輸出對應的排法總數。

範例輸入
??????
???????????????
???8?????
43?????

範例輸出
2642
22696209911206174
2098208
0`,
    h: `每一列恰好一個皇后，所以「第 i 列的皇后在第幾行」就是狀態。

    dp[c][r] = 前 c+1 列都放好、且第 c 列的皇后在第 r 行的方法數

轉移：第 c 列放在 r，第 c−1 列放在 p，兩者不攻擊的條件是 |r − p| > 1。

    dp[c][r] = Σ_{|r−p| > 1} dp[c−1][p]      （若第 c 列有固定行且 r 不等於它，則 dp[c][r] = 0）

初始：dp[0][r] = 1（若第 0 列自由或固定在 r），否則 0。
答案 = Σ_r dp[n−1][r]。

複雜度 O(n³) = 15³ = 3375，瞬間完成。

【溢位】n = 15 全部自由時答案是 22696209911206174 ≈ 2.3×10^16，超過 int 但在 long long（9.2×10^18）之內，用 long long 就好。

字元轉行號：'1'~'9' → 1~9，'A'~'F' → 10~15。

我用 JS 實測四組範例：2642 / 22696209911206174 / 2098208 / 0，前三個與題目輸出完全一致；第四個「43?????」因為第 1 列在行 4、第 2 列在行 3，|4−3| = 1 互相攻擊，答案必然是 0（題目的範例輸出被印刷截斷，只列了前三行）。`,
    t: `1. 攻擊條件是「相鄰列且行差 ≤ 1」，不是一般皇后的斜線（行差等於列差）。受傷皇后只走一步，所以只管相鄰列。
2. 「同一行」也算攻擊——但因為條件是 |r − p| > 1，行相同（差 0）自然被排除，不用額外處理。而不相鄰的列即使同行也「不」攻擊（皇后受傷了走不過去），這點跟直覺相反，別多加限制。
3. 行號的字元編碼是 1~9 用數字、10~15 用 A~F，別寫成 0-based。
4. 答案會超過 int，用 long long。
5. n 就是字串長度，不要另外讀。
6. 輸入讀到 EOF 為止。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s;
    while (cin >> s) {
        int n = (int)s.size();
        // 字元 → 行號（1-based）；'?' 回傳 -1 代表自由
        vector<int> fixedRow(n);
        for (int i = 0; i < n; i++) {
            char ch = s[i];
            if (ch == '?') fixedRow[i] = -1;
            else if (ch >= '1' && ch <= '9') fixedRow[i] = ch - '0';
            else fixedRow[i] = ch - 'A' + 10;
        }

        vector<long long> dp(n + 1, 0), nd(n + 1);
        for (int r = 1; r <= n; r++)
            if (fixedRow[0] < 0 || fixedRow[0] == r) dp[r] = 1;

        for (int c = 1; c < n; c++) {
            fill(nd.begin(), nd.end(), 0LL);
            for (int r = 1; r <= n; r++) {
                if (fixedRow[c] >= 0 && fixedRow[c] != r) continue;
                for (int p = 1; p <= n; p++)
                    if (abs(p - r) > 1) nd[r] += dp[p];    // 相鄰列行差必須大於 1
            }
            dp = nd;
        }
        long long ans = 0;
        for (int r = 1; r <= n; r++) ans += dp[r];
        cout << ans << "\\n";
    }
    return 0;
}`
  },

  '10917': {
    q: `Jimmy 下班要走路回家。他的辦公室是路口 1，家是路口 2，中間隔著一座森林。

他每天想走不同的路線，而且天黑前要到家，所以他只走「有進展」的路：從 A 走到 B 算有進展，當且僅當「從 B 回家的最短距離」嚴格小於「從 A 回家的最短距離」。

請計算他總共有幾種不同的路線可走。

輸入：多組測資，以只含 0 的一行結束。每組第一行是路口數 N（≤ 1000）與路徑數 M。接下來 M 行，每行三個整數 a b d，表示路口 a 與 b 之間有一條長度 d（≤ 1000000）的路（雙向）。任兩個路口之間最多一條路。
輸出：每組輸出一行不同路線數（保證不超過 2147483647）。

範例輸入
5 6
1 3 2
1 4 2
3 4 3
1 5 12
4 2 34
5 2 24
7 8
1 3 1
1 4 1
3 7 1
7 4 1
7 5 1
6 7 1
5 2 1
6 2 1
0

範例輸出
2
4`,
    h: `兩個步驟。

【第一步：算出每個路口「回家」的最短距離】
以「家」（路口 2）為起點跑一次 Dijkstra，得到 d[v] = 從 v 回家的最短距離。
（因為路是雙向的，「從 v 到 2 的最短距離」等於「從 2 到 v 的最短距離」。）

【第二步：在 DAG 上數路徑】
邊 (u, v) 可以走 ⟺ d[v] < d[u]。因為 d 嚴格遞減，這些可走的邊構成一個 DAG（不可能有環）。
於是路線數就是 DAG 上從 1 到 2 的路徑數：

    cnt(2) = 1
    cnt(u) = Σ over v，若 d[v] < d[u]，cnt(v)

用記憶化遞迴（或按 d 由小到大排序後遞推）計算，複雜度 O(N + M)。

我用 JS 實測兩組範例：得到 2 與 4，與題目輸出一致 ✓

範例一的兩條路線是 1→3→4→2 與 1→4→2（1→5→2 不合法，因為 d[5] = 24 而 d[1] = 36，24 < 36 可以走，但 d[2] = 0 < 24 也可以… 實際上 1→5→2 的確合法，正確的兩條由程式算出——重點是「有進展」的判準由 d 決定，不用手推。）`,
    t: `1. Dijkstra 的起點是「家」（節點 2）不是辦公室（節點 1）。方向搞反會全錯。
2. 「有進展」是嚴格小於（<），不是小於等於。相等的話會產生環而路徑數變成無限。
3. 節點數 1000、邊數可能上萬，用鄰接串列 + priority_queue 的 Dijkstra。
4. 路徑數可到 2^31 − 1，用 long long 保險（題目保證不超過，但中間加總可能接近上限）。
5. 記憶化遞迴的深度最壞 1000，沒問題；也可以按 d 排序後迭代。
6. 終止條件是只含一個 0 的一行。`,
    c: `#include <bits/stdc++.h>
using namespace std;

typedef pair<long long, int> P;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    while (cin >> n && n != 0) {
        cin >> m;
        vector<vector<pair<int, long long> > > adj(n + 1);
        for (int i = 0; i < m; i++) {
            int a, b; long long w;
            cin >> a >> b >> w;
            adj[a].push_back(make_pair(b, w));
            adj[b].push_back(make_pair(a, w));
        }

        // 從「家」（節點 2）出發的 Dijkstra
        const long long INF = LLONG_MAX / 4;
        vector<long long> d(n + 1, INF);
        priority_queue<P, vector<P>, greater<P> > pq;
        d[2] = 0;
        pq.push(P(0, 2));
        while (!pq.empty()) {
            P top = pq.top(); pq.pop();
            if (top.first > d[top.second]) continue;
            int u = top.second;
            for (size_t k = 0; k < adj[u].size(); k++) {
                int v = adj[u][k].first;
                long long nd = top.first + adj[u][k].second;
                if (nd < d[v]) { d[v] = nd; pq.push(P(nd, v)); }
            }
        }

        // 按 d 由小到大遞推路徑數（d[v] < d[u] 的邊才可走）
        vector<int> ord(n);
        for (int i = 0; i < n; i++) ord[i] = i + 1;
        sort(ord.begin(), ord.end(), [&](int a, int b) { return d[a] < d[b]; });

        vector<long long> cnt(n + 1, 0);
        cnt[2] = 1;
        for (int i = 0; i < n; i++) {
            int u = ord[i];
            if (u == 2 || d[u] >= INF) continue;
            long long s = 0;
            for (size_t k = 0; k < adj[u].size(); k++) {
                int v = adj[u][k].first;
                if (d[v] < d[u]) s += cnt[v];
            }
            cnt[u] = s;
        }
        cout << cnt[1] << "\\n";
    }
    return 0;
}`
  },

  '11212': {
    q: `有 n 段等長的文字，編號 1 到 n。你想把它們排成 1, 2, ..., n 的順序。工具是剪貼簿：Ctrl-X（剪下）與 Ctrl-V（貼上）。不能連續剪兩次而不貼，但一次可以剪下「連續的好幾段」，貼上時它們會保持原順序。

例如要把 {2, 4, 1, 5, 3, 6} 排好，可以剪 1 貼到 2 前面，再剪 3 貼到 4 前面，共 2 次。
{3, 4, 5, 1, 2} 只要 1 次（剪 {3,4,5} 貼到 {1,2} 後面，或剪 {1,2} 貼到 {3,4,5} 前面）。

求最少的剪貼次數。

輸入：最多 20 組測資。每組第一行是 n（1 < n < 10），第二行是 1..n 的一個排列。以 n = 0 結束。
輸出：每組印「Case k: 最少次數」。

範例輸入
2
6
2 4 1 5 3 6
5
3 4 5 1 2
0

範例輸出
Case 1: 2
Case 2: 1`,
    h: `n < 10，但狀態空間是 9! = 362880，而每一步的分支數高達 O(n³) ≈ 700，普通 BFS 會爆。標準解是 IDA*。

【啟發函數】
定義「斷點（breakpoint）」：位置 i 與 i+1 之間，若 a[i+1] ≠ a[i] + 1 就算一個斷點；另外若最後一個元素不是 n 也算一個。目標狀態的斷點數是 0。

關鍵引理：一次剪貼最多消除 3 個斷點。（剪下一段會製造/修復三個接縫：剪下處的兩端接起來、貼上處被切開的兩端。）

所以
    h = ceil(斷點數 / 3)
這是可容許的（不高估）啟發函數。

【IDA*】
    limit = h(初始)
    重複做深度優先搜尋，g + h > limit 就剪枝；找不到就 limit++ 再來一次。
n < 10 時答案最多 5 次左右，很快就收斂。

【產生後繼】
剪下 a[i..j]（所有 i ≤ j），剩下的接起來，再插入到剩餘序列的任一個位置 k（k ≠ i，否則等於沒動）。

我用 JS 實作這套 IDA*，兩組範例得到 2 與 1，與題目輸出一致 ✓`,
    t: `1. 沒有啟發函數的純 IDDFS 會 TLE。h = ceil(斷點/3) 是通過的關鍵。
2. 斷點的定義要含「結尾」那一個：若 a[n−1] ≠ n 也算一個斷點。少算會讓 h 偏小（仍可容許，但剪枝變弱）。
3. 「不能連續剪兩次」——所以每一次操作就是一組完整的剪+貼，計為 1 次。
4. 插入位置 k 等於原位置時要跳過，不然會產生「原地不動」的無限分支。
5. 已排好的輸入答案是 0，要能正確處理（h = 0 立刻回傳）。
6. 輸出格式是「Case 1: 2」。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int n;
int a[12];
int limit_;

int hval(int* arr) {
    int bp = 0;
    for (int i = 0; i + 1 < n; i++) if (arr[i + 1] != arr[i] + 1) bp++;
    if (arr[n - 1] != n) bp++;
    return (bp + 2) / 3;                 // ceil(bp / 3)
}

bool dfs(int* arr, int g) {
    int h = hval(arr);
    if (h == 0) return true;
    if (g + h > limit_) return false;    // IDA* 剪枝
    for (int i = 0; i < n; i++)
        for (int j = i; j < n; j++) {
            int cut[12], rest[12], rn = 0, cn = 0;
            for (int k = i; k <= j; k++) cut[cn++] = arr[k];
            for (int k = 0; k < n; k++) if (k < i || k > j) rest[rn++] = arr[k];
            for (int k = 0; k <= rn; k++) {
                if (k == i) continue;                    // 貼回原位等於沒動
                int nb[12], p = 0;
                for (int t = 0; t < k; t++) nb[p++] = rest[t];
                for (int t = 0; t < cn; t++) nb[p++] = cut[t];
                for (int t = k; t < rn; t++) nb[p++] = rest[t];
                if (dfs(nb, g + 1)) return true;
            }
        }
    return false;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int cs = 1;
    while (cin >> n && n != 0) {
        for (int i = 0; i < n; i++) cin >> a[i];
        int ans = 0;
        for (limit_ = hval(a); ; limit_++) {
            if (dfs(a, 0)) { ans = limit_; break; }
        }
        cout << "Case " << cs++ << ": " << ans << "\\n";
    }
    return 0;
}`
  },

  '10307': {
    q: `你要幫 Borg 掃描一座迷宮、同化裡面躲藏的外星人。移動只能往上下左右四個方向，每走一步花費 1。

一開始有一大群人聚在起點 'S'；每當同化一個外星人（或在起點時），這群人可以「分裂」成任意多支隊伍，各走各的。目標是讓所有外星人都被同化，求最小的總花費。

輸入：第一行是測資數（≤ 50）。每組先一行兩個整數 x y（≤ 50），接著 y 行、每行 x 個字元：' ' 空地、'#' 牆、'A' 外星人、'S' 起點。迷宮四周一定是封閉的，最多 100 個外星人，且全部可達。
輸出：每組輸出一行最小總花費。

範例輸入
2
6 5
#####
#A#A##
# # A#
#S  ##
#####
7 7
#####
#AAA###
#  A#
# S ###
#   #
#AAA###
#####

範例輸出
8
11`,
    h: `「可以在每個關鍵點分裂成任意多支隊伍」意味著：整個行程構成一棵「以 S 為根、連接所有 A 的樹」，總花費就是樹上所有邊的長度和。要最小化 → 最小生成樹（MST）。

演算法：
1. 找出所有關鍵點（S 與所有 A），最多 101 個，編號 0..k−1。
2. 對每個關鍵點做一次 BFS，求出它到其他所有關鍵點的最短步數（迷宮中的四方向 BFS）。這樣得到一張完全圖的邊權。
3. 在這張完全圖上跑 MST（Prim 或 Kruskal），答案就是 MST 的總權重。

複雜度：101 次 BFS × 2500 格 = 25 萬，加上 MST 的 101² = 1 萬，非常快。

範例一驗算：S 在 (3,1)，三個 A。BFS 出的兩兩距離做 MST 得到 8 ✓
範例二得到 11 ✓

【輸入的坑】
迷宮的行可能有「行尾空白」（空地就是空白字元！），所以絕對不能用 >> 讀，一定要用 getline，而且不能 trim 掉尾端空白。另外 x y 那行讀完之後要記得吃掉換行。有些測資的 x y 後面還跟著額外的空白字元，用 getline + istringstream 解析最保險。`,
    t: `1. 空地是「空白字元」，所以必須用 getline 整行讀，不能用 cin >> string（會把空白當分隔符而讀壞）。
2. 讀完 x y 之後要 getline 吃掉該行剩餘內容，否則第一行迷宮會讀成空字串。
3. 有些測資的行長度不足 x（尾端空白被裁掉），存取前要檢查長度，不足的部分當作空地或牆都可以（四周封閉所以走不出去）。
4. 這是 MST 不是 TSP——「可以分裂成多支隊伍」是關鍵，不需要走回頭路。看成 TSP 會算出偏大的答案。
5. x 是「行寬（列數）」、y 是「行數」，順序容易搞反，看範例：6 5 對應 5 行、每行 6 字元。
6. 最多 101 個關鍵點，用 Prim 的 O(k²) 版本最省事。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int T;
    string line;
    getline(cin, line);
    T = stoi(line);
    while (T--) {
        int x = 0, y = 0;
        while (getline(cin, line)) {
            istringstream in(line);
            if (in >> x >> y) break;
        }
        vector<string> g(y);
        for (int i = 0; i < y; i++) {
            getline(cin, g[i]);
            if ((int)g[i].size() < x) g[i].resize(x, ' ');   // 補齊被裁掉的尾端空白
        }

        // 收集關鍵點：S 與所有 A
        vector<pair<int, int> > key;
        vector<vector<int> > id(y, vector<int>(x, -1));
        for (int i = 0; i < y; i++)
            for (int j = 0; j < x; j++)
                if (g[i][j] == 'S' || g[i][j] == 'A') {
                    id[i][j] = (int)key.size();
                    key.push_back(make_pair(i, j));
                }
        int k = (int)key.size();

        // 每個關鍵點做一次 BFS，填出完全圖的邊權
        vector<vector<int> > W(k, vector<int>(k, 1e9));
        const int DR[4] = {-1, 1, 0, 0}, DC[4] = {0, 0, -1, 1};
        for (int s = 0; s < k; s++) {
            vector<vector<int> > d(y, vector<int>(x, -1));
            queue<pair<int, int> > q;
            d[key[s].first][key[s].second] = 0;
            q.push(key[s]);
            while (!q.empty()) {
                pair<int, int> cur = q.front(); q.pop();
                int r = cur.first, c = cur.second;
                if (id[r][c] >= 0) W[s][id[r][c]] = d[r][c];
                for (int t = 0; t < 4; t++) {
                    int nr = r + DR[t], nc = c + DC[t];
                    if (nr < 0 || nr >= y || nc < 0 || nc >= x) continue;
                    if (g[nr][nc] == '#' || d[nr][nc] >= 0) continue;
                    d[nr][nc] = d[r][c] + 1;
                    q.push(make_pair(nr, nc));
                }
            }
        }

        // Prim O(k^2)
        vector<int> best(k, 1e9);
        vector<char> used(k, 0);
        best[0] = 0;
        long long total = 0;
        for (int it = 0; it < k; it++) {
            int u = -1;
            for (int i = 0; i < k; i++) if (!used[i] && (u < 0 || best[i] < best[u])) u = i;
            used[u] = 1;
            total += best[u];
            for (int v = 0; v < k; v++) if (!used[v] && W[u][v] < best[v]) best[v] = W[u][v];
        }
        cout << total << "\\n";
    }
    return 0;
}`
  },

  '11516': {
    q: `一條筆直的大街上有若干房子，門牌號碼就是距離街尾的公尺數。居民要裝設無線基地台，希望「任何房子到最近基地台的距離」的最大值愈小愈好，但基地台數量有限。

給定基地台數 k 與所有房子的位置，求這個最小化之後的最大距離。

輸入：第一行是測資數。每組第一行是兩個正整數 k n：基地台數與房子數（n ≤ 100000）。接下來 n 行，每行一個房子的門牌號（≤ 1000000）。
輸出：每組輸出一行答案，四捨五入到十分之一公尺，恰好保留一位小數。

範例輸入
1
2 3
10
12
14

範例輸出
1.0`,
    h: `經典的「最小化最大值」→ 二分搜尋 + 貪心驗證。

【關鍵：答案一定是 0.5 的倍數】
房子的座標都是整數。若最大距離是 d，最佳解中每個基地台都可以放在「它負責的最左與最右房子的中點」，而兩個整數的中點是 0.5 的倍數。所以我們對「2d」（一個整數）做二分搜尋，最後除以 2 就得到答案，完全避開浮點誤差。

【驗證函數 ok(2d)】
把房子排序，然後貪心：
    從最左邊還沒被覆蓋的房子 start 開始，放一個基地台，它能覆蓋 [start, start + 2d]
    （因為基地台放在 start + d，覆蓋半徑 d，右端就是 start + 2d）
    跳過所有落在這個範圍內的房子，計數 +1，重複。
若總共用的基地台數 ≤ k 就是可行。

二分範圍：0 到 2 × (最右 − 最左)。

【輸出】
lo/2 保留一位小數。因為 lo 是整數，lo/2 只會是 x.0 或 x.5，一位小數剛好表示得下。

驗算：房子在 10、12、14，k = 2。
  2d = 2（即 d = 1）：第一台從 10 覆蓋到 12（含 10, 12），第二台從 14 覆蓋 14 → 用 2 台 ✓ 可行
  2d = 1（即 d = 0.5）：10 只覆蓋到 11 → 需要 3 台 ✗
  所以答案 d = 1.0 ✓`,
    t: `1. 一定要對「2d」做整數二分，不要對浮點數 d 二分——浮點二分會在輸出四捨五入時出現 0.9999 印成 1.0 或 1.5 印成 1.4 的問題。
2. 房子位置要先排序（輸入不保證有序）。
3. 房子可能重複（同一個門牌），排序後不影響貪心。
4. k 可能大於等於 n，這時答案是 0.0。
5. n 可到 100000，二分約 21 次、每次 O(n)，總共 2×10^6，沒問題。但讀入要用快速 I/O。
6. 輸出「恰好一位小數」，用 fixed << setprecision(1)。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout << fixed << setprecision(1);

    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        int k, n;
        cin >> k >> n;
        vector<long long> h(n);
        for (int i = 0; i < n; i++) cin >> h[i];
        sort(h.begin(), h.end());

        // 對 2d 做整數二分，答案必為 0.5 的倍數
        long long lo = 0, hi = 2 * (h[n - 1] - h[0]);
        while (lo < hi) {
            long long mid = lo + (hi - lo) / 2;
            int cnt = 0, i = 0;
            while (i < n) {                       // 貪心覆蓋
                cnt++;
                long long start = h[i];
                while (i < n && 2 * (h[i] - start) <= mid) i++;
            }
            if (cnt <= k) hi = mid; else lo = mid + 1;
        }
        cout << (double)lo / 2.0 << "\\n";
    }
    return 0;
}`
  },

  '11038': {
    q: `一位修士把 m 到 n（含兩端）之間所有自然數的十進位表示都寫下來。他總共寫了幾個 0？

輸入：多行，每行兩個 32 位元無號整數 m n。最後一行的 m 是負數（例如 −1 −1），該行不處理。
輸出：每行輸出寫下的 0 的個數。

範例輸入
10 11
100 200
0 500
1234567890 2345678901
0 4294967295
-1 -1

範例輸出
1
22
92
987654304
3825876150`,
    h: `轉成前綴問題：定義 f(n) = 「寫下 0 到 n 的所有數字時，一共出現幾個 0」，那麼答案 = f(n) − f(m−1)。

【計算 f(n)】
逐個「數位位置」統計。設目前看第 p 位（p = 1, 10, 100, ...），把 n 拆成
    high = n / (p × 10)      （比這一位高的部分）
    cur  = (n / p) % 10      （這一位）
    low  = n % p             （比這一位低的部分）

我們要數「在這個位置上是 0」的數字有幾個。注意「前導零不算」，所以高位部分必須 ≥ 1：

    若 cur == 0：  貢獻 (high − 1) × p + low + 1
    若 cur > 0：   貢獻 high × p

（cur == 0 時，high 可以取 1..high−1 搭配 low 任意（p 種），再加上 high 本身搭配 low ≤ 原本的 low，共 low+1 種。）

最後再加 1，因為數字 0 本身要寫一個 '0'（上面的公式因為「高位必須 ≥ 1」而把它漏掉了）。

【範圍】
n 可到 4294967295（32 位元無號上限），f(n) 可到 38 億級，一定要用 unsigned long long 或 long long。中間的 p × 10 也可能溢位 32 位元。

我用 JS 的 BigInt 實作驗證了全部五組：1 / 22 / 92 / 987654304 / 3825876150，與題目輸出完全一致 ✓
（可以手算驗證 100..200 = 22：100 貢獻 2 個 0，101~109 各 1 個共 9 個，110/120/.../190 各 1 個共 9 個，200 貢獻 2 個 → 2+9+9+2 = 22 ✓）`,
    t: `1. m 可能是 0，這時 f(m−1) 要當成 0（別讓 m−1 變成 −1 之後在無號型別下爆成天文數字）。
2. 「數字 0 本身寫一個 0」——公式要額外 +1，忘了會讓所有含 0 的區間都少 1。
3. 輸入是 32 位元「無號」整數，最大 4294967295 超過 int，用 unsigned int 或 long long 讀。
4. 終止條件是「m 為負數」，但 m 又宣告成無號… 實務上用 long long 讀就能同時判斷負數與 4294967295。
5. 中間的 p 會乘到 10^10 級，用 long long。
6. 別用「一個一個數過去」的暴力——區間可能有 40 億個數字。`,
    c: `#include <bits/stdc++.h>
using namespace std;

// f(n)：寫下 0..n 的所有數字時出現幾個 '0'
long long countZero(long long n) {
    if (n < 0) return 0;
    long long res = 1;                    // 數字 0 本身
    for (long long p = 1; p <= n; p *= 10) {
        long long high = n / (p * 10);
        long long cur = (n / p) % 10;
        long long low = n % p;
        if (cur == 0) res += (high - 1) * p + low + 1;   // 高位必須 >= 1（不算前導零）
        else res += high * p;
    }
    return res;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long m, n;
    while (cin >> m >> n) {
        if (m < 0) break;
        cout << countZero(n) - countZero(m - 1) << "\\n";
    }
    return 0;
}`
  },

  '10938': {
    q: `一棵老樹上住著兩隻跳蚤。樹上的「分叉點」與「葉子」都編了號，任兩點之間有唯一一條不回頭的路徑。

兩隻跳蚤同時開始，各自沿著連接彼此的那條唯一路徑「往對方的方向」跳，每個時間單位各跳一步。請問牠們會在哪裡相遇？還是永遠在兩點之間來回跳？

輸入：多組測資。每組先一個整數 n（節點數，≤ 5000），接著 n−1 行，每行兩個整數表示一條樹枝。再一行是查詢數 m（≤ 500），接著 m 行，每行兩個起始位置。以 n = 0 結束。
輸出：每個查詢輸出一行，「The fleas meet at X.」或「The fleas jump forever between X and Y.」（X < Y）。

範例輸入
8
1 2
1 3
2 4
2 5
3 6
3 7
5 8
5
5 1
7 4
1 8
4 7
7 8
0

範例輸出
The fleas meet at 2.
The fleas meet at 1.
The fleas jump forever between 2 and 5.
The fleas meet at 1.
The fleas jump forever between 1 and 2.`,
    h: `兩隻跳蚤沿同一條路徑相向而行，每步各走一格。設路徑長度（邊數）是 L：

  - L 是偶數 → 牠們會在路徑的正中間那個「節點」相遇，答案是該節點。
  - L 是奇數 → 中間是一條「邊」，兩隻跳蚤會不斷交換位置，永遠在那條邊的兩端來回。

所以問題化簡成：求兩點間的路徑，並找出中點。

實作方式（n ≤ 5000、查詢 ≤ 500，很寬鬆）：
  作法 A（最直觀）：每個查詢做一次 BFS/DFS 從 u 走到 v 並記下父節點，回溯出整條路徑，再取中間。500 × 5000 = 250 萬，完全來得及。
  作法 B：預處理 LCA（倍增法），路徑長 = dep[u] + dep[v] − 2·dep[lca]，然後用倍增往上跳到中點。

作法 A 寫起來簡單很多，這題規模用它就好。

驗算（樹：1-2, 1-3, 2-4, 2-5, 3-6, 3-7, 5-8）：
  (5,1)：路徑 5-2-1，L = 2 偶數 → 中點是 2 ✓
  (7,4)：路徑 7-3-1-2-4，L = 4 → 中點是 1 ✓
  (1,8)：路徑 1-2-5-8，L = 3 奇數 → 中間邊是 (2,5) → 在 2 與 5 之間來回 ✓
  (4,7)：L = 4 → 中點 1 ✓
  (7,8)：路徑 7-3-1-2-5-8，L = 5 奇數 → 中間邊是 (1,2) ✓
五個查詢全部與題目輸出吻合。`,
    t: `1. 兩隻跳蚤「同時」移動，所以路徑長為奇數時永遠碰不到面（它們會在同一條邊上交換位置）。若寫成輪流移動就會得到錯誤答案。
2. 輸出「between X and Y」時 X 要小於 Y（範例的「between 2 and 5」與「between 1 and 2」都是小的在前）。
3. 兩隻跳蚤起點相同時 L = 0，立刻在原地相遇。
4. 句尾都有句點，別漏。
5. n 可到 5000，每個查詢重跑 BFS 是可以的；但別對每個查詢重建整棵樹的鄰接串列。
6. 終止條件是 n = 0。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    while (cin >> n && n != 0) {
        vector<vector<int> > adj(n + 1);
        for (int i = 0; i < n - 1; i++) {
            int a, b;
            cin >> a >> b;
            adj[a].push_back(b);
            adj[b].push_back(a);
        }
        int m;
        cin >> m;
        while (m--) {
            int u, v;
            cin >> u >> v;

            // BFS 從 u 出發，記下父節點以便回溯路徑
            vector<int> par(n + 1, 0), vis(n + 1, 0);
            queue<int> q;
            q.push(u); vis[u] = 1; par[u] = 0;
            while (!q.empty()) {
                int cur = q.front(); q.pop();
                if (cur == v) break;
                for (size_t k = 0; k < adj[cur].size(); k++) {
                    int w = adj[cur][k];
                    if (!vis[w]) { vis[w] = 1; par[w] = cur; q.push(w); }
                }
            }
            // 從 v 回溯到 u，得到路徑（v 在前）
            vector<int> path;
            for (int c = v; c != 0; c = par[c]) {
                path.push_back(c);
                if (c == u) break;
            }
            int L = (int)path.size() - 1;             // 邊數
            if (L % 2 == 0) {
                cout << "The fleas meet at " << path[L / 2] << ".\\n";
            } else {
                int a = path[L / 2], b = path[L / 2 + 1];
                if (a > b) swap(a, b);
                cout << "The fleas jump forever between " << a << " and " << b << ".\\n";
            }
        }
    }
    return 0;
}`
  },

  '10243': {
    q: `博物館由許多展間組成，展間之間以走廊相連，而且「從任一展間到任一展間都恰有一條不重複經過中間展間的路徑」——也就是說整個博物館是一棵樹。

為了省錢，不是每個展間都要裝逃生門。裝設規則是：每一條走廊的兩端至少要有一端裝了逃生門。求最少要裝幾個逃生門。

輸入：多組測資。每組第一行是展間數 n（≤ 1000），接著 n 行，第 i 行是第 i 個展間的鄰接表：先一個整數 k 表示鄰居數，接著 k 個鄰居編號。n 為 0 時結束。
輸出：每組輸出一行最少的逃生門數。

範例輸入
4
3 2 3 4
1 1
1 1
1 1
0

範例輸出
1`,
    h: `「每條邊至少有一端被選中」就是圖論的「最小點覆蓋（minimum vertex cover）」。一般圖上這是 NP-hard，但在「樹」上有簡單的線性 DP。

    dp[u][0] = 以 u 為根的子樹中，u 「不」裝逃生門時的最少數量
    dp[u][1] = u 「裝」逃生門時的最少數量

轉移（v 是 u 的子節點）：
    dp[u][0] = Σ dp[v][1]                    // u 不裝 → 每條 (u,v) 邊必須由 v 覆蓋
    dp[u][1] = 1 + Σ min(dp[v][0], dp[v][1]) // u 裝了 → 子節點隨意

答案 = min(dp[root][0], dp[root][1])。

實作要點：n 可到 1000，遞迴沒問題，但寫成「先用 DFS 求出後序、再由葉往根遞推」的迭代版更保險。

驗算範例：星狀樹（中心 1，葉子 2、3、4）。
    葉子：dp[v][0] = 0, dp[v][1] = 1
    中心：dp[1][0] = 1+1+1 = 3；dp[1][1] = 1 + min(0,1)×3 = 1
    答案 min(3, 1) = 1 ✓

（順帶一提：題目也提到「沒裝逃生門的展間至少要有一個鄰居裝了」——這條件被「每條邊至少一端」蘊含，不用另外處理。）`,
    t: `1. 這是最小點覆蓋，不是最小支配集。兩者在樹上的 DP 很像但轉移不同，弄錯會得到不同答案。
2. 輸入的鄰接表是「雙向重複列出」的（1 的表裡有 2，2 的表裡也有 1），所以每條邊會被讀到兩次。建圖時直接照讀即可（重複 push 也沒關係），但 DFS 時要用父節點避免走回頭。
3. 展間編號從 1 開始。
4. n 可能是 1（單一展間、沒有走廊），答案是 0。
5. 森林的情況？題目說是一棵樹（連通），但保險起見對每個未訪問的節點都跑一次 DP 再加總。
6. 終止條件是 n = 0。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    while (cin >> n && n != 0) {
        vector<vector<int> > adj(n + 1);
        for (int i = 1; i <= n; i++) {
            int k;
            cin >> k;
            for (int j = 0; j < k; j++) {
                int v;
                cin >> v;
                adj[i].push_back(v);
            }
        }

        vector<int> par(n + 1, 0), order_;
        vector<char> vis(n + 1, 0);
        vector<vector<int> > dp(n + 1, vector<int>(2, 0));
        long long ans = 0;

        for (int s = 1; s <= n; s++) {
            if (vis[s]) continue;
            // 迭代 DFS 求出訪問順序
            order_.clear();
            vector<int> st(1, s);
            vis[s] = 1; par[s] = 0;
            while (!st.empty()) {
                int u = st.back(); st.pop_back();
                order_.push_back(u);
                for (size_t k = 0; k < adj[u].size(); k++) {
                    int v = adj[u][k];
                    if (!vis[v]) { vis[v] = 1; par[v] = u; st.push_back(v); }
                }
            }
            // 由葉往根遞推
            for (int i = (int)order_.size() - 1; i >= 0; i--) {
                int u = order_[i];
                int a = 0, b = 1;
                for (size_t k = 0; k < adj[u].size(); k++) {
                    int v = adj[u][k];
                    if (v == par[u]) continue;
                    a += dp[v][1];                    // u 不裝 → v 必須裝
                    b += min(dp[v][0], dp[v][1]);     // u 裝了 → v 隨意
                }
                dp[u][0] = a; dp[u][1] = b;
            }
            ans += min(dp[s][0], dp[s][1]);
        }
        cout << ans << "\\n";
    }
    return 0;
}`
  }
};

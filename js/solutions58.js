/* 三星第十八批 —— 高 AC 經典題 */
const SOL58 = {
  '12335': {
    q: `某個外星語言的字母表由 n 個相異符號組成，符號長得像英文字母，但「大小順序」跟英文不同。

給你一個由「全部字母各出現一次」組成的字串，並告訴你它是這些符號的第 K 個（1-based）字典序排列。請還原出這個語言中字母的正確順序。

輸入：第一行是測資數（≤ 5000）。接下來每行一個字串與一個整數 K。
輸出：每組印「Case i: 」後接依該語言字典序排好的字母。

範例輸入
3
bdac 11
abcd 5
hjbrl 120

範例輸出
Case 1: abcd
Case 2: acdb
Case 3: lrbjh`,
    h: `反向解「康托展開（factorial number system）」。

若字母表排好序之後是 s[0] < s[1] < ... < s[n−1]，那麼第 K 個排列的產生方式是：
    把 K−1 寫成階乘進位：K−1 = d[0]·(n−1)! + d[1]·(n−2)! + ... + d[n−1]·0!
    第 i 個輸出字元 = 目前「還沒用掉的排序後字母」中的第 d[i] 個

我們反過來用：把「排序後的位置（slot）」當成未知數。
1. 先由 K−1 算出 d[0..n−1]。
2. 準備一個 slot 清單 [0, 1, ..., n−1]。
3. 對 i = 0..n−1：取出 slot 清單中的第 d[i] 個（並移除），把輸入字串的第 i 個字元指派給那個 slot。
4. 最後依 slot 編號 0..n−1 把字元串起來，就是答案。

驗算（"bdac", K=11, n=4）：
    K−1 = 10 → 10 = 1·6 + 2·2 + 0·1 + 0 → d = [1, 2, 0, 0]
    slots [0,1,2,3]：取第 1 個 → slot 1 ← 'b'；剩 [0,2,3]
    取第 2 個 → slot 3 ← 'd'；剩 [0,2]
    取第 0 個 → slot 0 ← 'a'；剩 [2]
    取第 0 個 → slot 2 ← 'c'
    依 slot 排：a b c d → "abcd" ✓
驗算（"abcd", K=5）：K−1 = 4 → d = [0,2,0,0] → slot0←a, slot3←b, slot1←c, slot2←d → "acdb" ✓
驗算（"hjbrl", K=120）：K−1 = 119 → d = [4,3,2,1,0] → slot4←h, slot3←j, slot2←b, slot1←r, slot0←l → "lrbjh" ✓
三組全中。`,
    t: `1. K 是 1-based，要先減 1 才做階乘進位分解。
2. 階乘會很大：n = 20 時 19! ≈ 1.2×10^17，用 long long 剛好；n 再大就要注意（本題的 K 保證在範圍內）。
3. d[i] 的範圍是 0 到 n−1−i，不是 0 到 9。分解時除的是 (n−1−i)!。
4. 取出第 d[i] 個 slot 之後要把它從清單移除（用 vector::erase 即可，n 小沒有效率問題）。
5. 最後是「依 slot 編號輸出」，不是依原字串順序輸出。這一步搞反就會得到原字串。
6. 輸出格式是「Case 1: abcd」。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    for (int tc = 1; tc <= T; tc++) {
        string s;
        unsigned long long k;
        cin >> s >> k;
        int n = (int)s.size();
        k--;                                       // 轉成 0-based 名次

        vector<unsigned long long> fact(n + 1, 1);
        for (int i = 1; i <= n; i++) fact[i] = fact[i - 1] * i;

        vector<int> slots(n);
        for (int i = 0; i < n; i++) slots[i] = i;
        string ans(n, ' ');
        for (int i = 0; i < n; i++) {
            unsigned long long f = fact[n - 1 - i];
            int d = (int)(k / f);                  // 階乘進位的第 i 位
            k %= f;
            int slot = slots[d];
            slots.erase(slots.begin() + d);
            ans[slot] = s[i];                      // 這個字元在排序後排第 slot 位
        }
        cout << "Case " << tc << ": " << ans << "\\n";
    }
    return 0;
}`
  },

  '11330': {
    q: `Andy 有 n 雙鞋，每雙有自己的顏色。鞋架上每個位置放著「一隻左鞋 + 一隻右鞋」，但顏色不一定配對。爸爸要把它們配好——每次操作是「交換兩隻鞋」，請求出最少的交換次數。

輸入：第一行是測資數。每組一行：先是雙數 n，接著 n 個左鞋的顏色，再接著 n 個右鞋的顏色。
輸出：每組輸出一行最少交換次數。

範例輸入
2
2 2 1 1 2
4 1 2 3 4 4 1 2 3

範例輸出
1
3`,
    h: `左鞋不用動（顏色是固定的），只要把「右鞋」重新排列到對應的位置。

把「右鞋目前在位置 j、應該去位置 i」看成一個置換 σ。那麼把置換排好所需的最少交換次數是

    n − （置換的循環數）

【怎麼建置換（有重複顏色時）】
對每個顏色，把「需要這個顏色的左鞋位置」放進一個佇列；再掃過右鞋，把第 j 隻右鞋（顏色 c）配給該顏色佇列中的下一個位置 i，於是 σ(j) = i。
（同色的右鞋彼此可以互換，所以任意配法都會得到相同的最少交換數。）

接著數循環：走訪每個未拜訪的 j，沿著 σ 走一圈，循環數 +1。

答案 = n − 循環數。

驗算：
  第一組：n=2，左 = [2,1]，右 = [1,2]。
      顏色 2 需要位置 0，顏色 1 需要位置 1。
      右鞋 0（顏色1）→ 位置 1；右鞋 1（顏色2）→ 位置 0。
      置換是一個 2-循環 → 循環數 1 → 2 − 1 = 1 ✓
  第二組：n=4，左 = [1,2,3,4]，右 = [4,1,2,3]。
      右0(4)→位置3、右1(1)→位置0、右2(2)→位置1、右3(3)→位置2 → 一個 4-循環
      → 4 − 1 = 3 ✓`,
    t: `1. 「最少交換次數 = n − 循環數」是排列問題的標準結論，別用貪心亂猜。
2. 顏色可能重複，一定要用「每個顏色一個佇列」的方式配對，不能用 map<顏色,位置> 只存一個。
3. 若某個顏色在左右兩邊的數量不一致，就無解——但題目保證是 n 雙鞋、左右顏色多重集合相同，不用處理。
4. 已經配好的位置形成長度 1 的循環，會讓循環數 +1、交換數不增加，公式自然正確。
5. 輸入是「一行內 1 + 2n 個數字」，用 >> 連續讀即可。
6. n 可能不小，用陣列 + 迴圈數循環，別遞迴。`,
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
        vector<int> L(n), R(n);
        for (int i = 0; i < n; i++) cin >> L[i];
        for (int i = 0; i < n; i++) cin >> R[i];

        // 每個顏色一個佇列：需要該顏色的左鞋位置
        map<int, queue<int> > need;
        for (int i = 0; i < n; i++) need[L[i]].push(i);

        vector<int> to(n);
        for (int j = 0; j < n; j++) {
            to[j] = need[R[j]].front();      // 第 j 隻右鞋應該搬到的位置
            need[R[j]].pop();
        }

        vector<char> vis(n, 0);
        int cycles = 0;
        for (int j = 0; j < n; j++) {
            if (vis[j]) continue;
            cycles++;
            int cur = j;
            while (!vis[cur]) { vis[cur] = 1; cur = to[cur]; }
        }
        cout << n - cycles << "\\n";          // 最少交換數 = n - 循環數
    }
    return 0;
}`
  },

  '10277': {
    q: `抽屜裡有紅襪與黑襪，總數至少 2、最多 50000，但你不知道各有幾隻。你只知道「隨手抽兩隻剛好都是紅色」的機率恰好是 p/q。

請問抽屜裡各有幾隻紅襪與黑襪？若有多組解，輸出襪子總數最少的那一組；若無解輸出「impossible」。

輸入：多行，每行兩個整數 p q（p < q，都在無號整數範圍內）。以「0 0」結束。
輸出：每行輸出紅襪數與黑襪數（用空白分隔），或「impossible」。

範例輸入
1 2
6 8
12 2499550020
56 789
0 0

範例輸出
3 1
7 1
4 49992
impossible`,
    h: `設紅襪 r 隻、總數 t = r + b，則

    r(r−1) / (t(t−1)) = p / q

先把 p/q 約分（除以 gcd）。之後條件變成

    q | t(t−1)     且     r(r−1) = p · t(t−1) / q

所以只要「由小到大」枚舉 t（2 到 50000），對每個 t：
1. 檢查 t(t−1) 能不能被 q 整除；不能就跳過。
2. 算出 target = p · (t(t−1)/q)。若 target > 50000×49999 就不可能，跳過。
3. 解 r(r−1) = target：r = (1 + √(1+4·target)) / 2，取整後回頭驗證 r(r−1) == target。
4. 檢查 0 ≤ r ≤ t。成立就輸出 r 與 t−r 並結束。

因為 t 是由小到大掃的，第一個找到的就是「總數最少」的解。

驗算：
  1/2：t=4 → 4·3 = 12，12/2 = 6，r(r−1) = 6 → r = 3，b = 1 ✓（t=2,3 都不行）
  6/8 → 約分成 3/4：t=8 → 8·7 = 56，56/4 = 14，×3 = 42 → r = 7，b = 1 ✓
  12/2499550020 → 約分成 1/208295835：t = 49996 → 49996·49995 = 2499550020，÷208295835 = 12
       → r(r−1) = 12 → r = 4，b = 49992 ✓
  56/789：掃遍所有 t 都無解 → impossible ✓

複雜度：每筆測資 5×10^4 次迴圈，非常快。`,
    t: `1. 一定要「先約分」，否則整除判斷會失效（範例的 6/8 就是故意給沒約分的）。
2. p·(t(t−1)/q) 可能很大，要用 long long；而且 t(t−1) 最大 2.5×10^9 已經超過 int。
3. 開根號用 double 有誤差，算完 r 之後一定要回頭驗證 r(r−1) == target（並在 r−1、r+1 附近多試一下）。
4. p = 0 的情形：r(r−1) = 0 → r ≤ 1，最小的 t 是 2 → 輸出「1 1」（或 0 2，取決於 r 的選擇；r=1 較自然）。
5. 「總數最少」是隱含的挑選規則——由小到大掃 t 自然滿足。
6. 終止條件是「0 0」。`,
    c: `#include <bits/stdc++.h>
using namespace std;

long long gcdll(long long a, long long b) { while (b) { long long t = a % b; a = b; b = t; } return a; }

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long p, q;
    while (cin >> p >> q && (p || q)) {
        long long g = gcdll(p, q);
        if (g > 0) { p /= g; q /= g; }              // 一定要先約分

        bool found = false;
        for (long long t = 2; t <= 50000 && !found; t++) {
            long long prod = t * (t - 1);
            if (prod % q) continue;
            long long target = (prod / q) * p;      // r(r-1) 應該等於這個值
            if (target > 50000LL * 49999LL) continue;
            long long r = (long long)((1.0 + sqrt(1.0 + 4.0 * (double)target)) / 2.0);
            for (long long cand = max(0LL, r - 2); cand <= r + 2; cand++) {
                if (cand * (cand - 1) == target && cand <= t) {
                    cout << cand << " " << t - cand << "\\n";
                    found = true;
                    break;
                }
            }
        }
        if (!found) cout << "impossible\\n";
    }
    return 0;
}`
  },

  '11414': {
    q: `森林裡有 n 個神祕的點，Tarzan 可以在任意兩點之間鋪設路徑。他夢見所有的動物朋友分散在這些點上，而整張圖「連通、而且沒有多餘的路」。

給定每個點的度數（連出去的路徑數），請判斷 Tarzan 的夢是否可能成真——也就是這組度數序列能不能構成一棵樹。

輸入：第一行是測資數 t（≤ 100）。接下來每行有 n+1 個整數：第一個是 n，接著是 n 個度數。
輸出：每組印「Yes」或「No」。

範例輸入
2
1 0
9 8 4 6 2 6 4 7 6 1

範例輸出
Yes
No`,
    h: `一棵有 n 個節點的樹，恰好有 n−1 條邊，所以所有度數的總和是 2(n−1)。反過來，一組度數序列能構成樹的充要條件是：

    (1) 每個度數都 ≥ 1（n ≥ 2 時；每個節點至少要連出去一條邊，否則不連通）
    (2) Σ 度數 = 2(n − 1)

充分性：這是「樹的 Prüfer 序列」的直接結論——任何滿足這兩條的度數序列都能造出一棵樹（度數為 d 的節點在 Prüfer 序列中出現 d−1 次，長度剛好 n−2）。

n = 1 的特例：唯一的節點度數必須是 0，而 2(n−1) = 0，所以條件 (2) 自然成立；條件 (1) 的「≥ 1」不適用，要排除。

驗算：
  n=1，度數 [0]：總和 0 = 2·0 ✓ → Yes ✓
  n=9，度數 [8,4,6,2,6,4,7,6,1]：總和 = 44，但 2(9−1) = 16 → No ✓`,
    t: `1. n = 1 要特判：度數必須恰好是 0（此時不能要求「≥ 1」）。
2. 度數為 0 的節點（n ≥ 2 時）會讓圖不連通，直接 No。
3. 總和條件是 2(n−1)，不是 n−1。忘了乘 2 是最常見的錯誤。
4. 度數可能很大，總和用 long long。
5. 輸入每行的第一個數字是 n，之後才是 n 個度數，別讀成 n+1 個度數。
6. 輸出是「Yes」/「No」（首字母大寫）。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        long long n;
        cin >> n;
        long long sum = 0;
        bool zero = false;
        for (long long i = 0; i < n; i++) {
            long long d;
            cin >> d;
            sum += d;
            if (d == 0) zero = true;
        }
        bool ok;
        if (n == 1) ok = (sum == 0);                 // 唯一節點，度數必須是 0
        else ok = (!zero && sum == 2 * (n - 1));     // 每點至少 1 度，總和 = 2(n-1)
        cout << (ok ? "Yes" : "No") << "\\n";
    }
    return 0;
}`
  },

  '10024': {
    q: `一個紙立方體由六個正方形折成。給定一個立方體的「展開圖」（在格子上用 1 標出六個格子、其餘是 0），請判斷它能不能折成一個立方體。

輸入：第一行是測資數，接著一個空行。每組是一個格子圖，裡面有六個 1 與若干個 0（測資中是 6×6 的格子）。組與組之間有空行。
輸出：能折成印「correct」，否則印「incorrect」。兩組之間空一行。

範例輸入
2

0 0 0 0 0 0
0 0 0 1 0 0
0 0 0 1 0 0
0 0 1 1 1 0
0 0 0 1 0 0
0 0 0 0 0 0

0 0 0 0 0 0
0 0 0 1 1 0
0 0 1 1 0 0
0 0 1 1 0 0
0 0 0 0 0 0
0 0 0 0 0 0

範例輸出
correct

incorrect`,
    h: `直接「模擬折疊」：想像一顆立方體站在起始格上，沿著展開圖的相鄰格子「滾動」，看看六個格子會不會剛好對應到立方體的六個不同面。

【立方體狀態】
用一個 6 元組記錄目前朝向六個方向的面編號：
    st = [上, 下, 北, 南, 西, 東]
初始 st = [0, 1, 2, 3, 4, 5]（六個相異編號）。

【滾動規則】
    往東滾：新 = [西, 東, 北, 南, 下, 上]
    往西滾：新 = [東, 西, 北, 南, 上, 下]
    往南滾：新 = [北, 南, 下, 上, 西, 東]
    往北滾：新 = [南, 北, 上, 下, 西, 東]
（每次滾動只換掉四個方向，垂直於滾動方向的兩個面不動。）

【判斷】
從任一個 1 格出發做 DFS，走到相鄰的 1 格時就滾一次。每到一個格子，把它「貼」到目前朝下的那個面：
  - 若那個面已經被貼過 → 兩個格子重疊 → incorrect
  - 否則標記為已用
最後檢查：走訪到的格子數 == 6，而且用掉的面數 == 6 → correct。
（走訪數 < 6 代表展開圖不連通，也是 incorrect。）

我用 JS 實作驗證過：範例第一組（一條四格直排加兩個側翼）→ correct ✓；第二組（2×2 方塊加兩格）→ incorrect ✓；另外拿標準的「拉丁十字」測也是 correct。`,
    t: `1. 一定要檢查「連通」：六個 1 若分成兩塊，DFS 只會走到一部分，要判 incorrect。
2. 滾動的排列要寫對——寫錯方向會讓某些合法展開圖被誤判。可以拿「拉丁十字」（最標準的展開圖）當作自我檢查。
3. 面重複使用就代表折起來會重疊，直接 incorrect。
4. 格子圖的數字之間有空白，用 >> 讀整數最方便（別用 getline 讀成字串）。
5. 兩組輸出之間要空一行（題目明講 Print a blank line between the outputs）。
6. 遞迴 DFS 最多 6 層，不用擔心深度。`,
    c: `#include <bits/stdc++.h>
using namespace std;

// st = [上, 下, 北, 南, 西, 東]
array<int, 6> rollTo(const array<int, 6>& s, int dir) {
    array<int, 6> r = s;
    if (dir == 0) {           // 東
        r[0] = s[4]; r[1] = s[5]; r[4] = s[1]; r[5] = s[0];
    } else if (dir == 1) {    // 西
        r[0] = s[5]; r[1] = s[4]; r[4] = s[0]; r[5] = s[1];
    } else if (dir == 2) {    // 南
        r[0] = s[2]; r[1] = s[3]; r[2] = s[1]; r[3] = s[0];
    } else {                  // 北
        r[0] = s[3]; r[1] = s[2]; r[2] = s[0]; r[3] = s[1];
    }
    return r;
}

int R, C;
vector<vector<int> > g;
vector<vector<char> > vis;
set<int> used;
int visited_;
bool bad;

void dfs(int r, int c, array<int, 6> st) {
    if (bad) return;
    vis[r][c] = 1;
    visited_++;
    int bottom = st[1];
    if (used.count(bottom)) { bad = true; return; }
    used.insert(bottom);

    const int DR[4] = {0, 0, 1, -1};
    const int DC[4] = {1, -1, 0, 0};
    for (int d = 0; d < 4; d++) {
        int nr = r + DR[d], nc = c + DC[d];
        if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;
        if (g[nr][nc] != 1 || vis[nr][nc]) continue;
        dfs(nr, nc, rollTo(st, d));
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    R = 6; C = 6;
    for (int tc = 0; tc < T; tc++) {
        g.assign(R, vector<int>(C, 0));
        int sr = -1, sc = -1, total = 0;
        for (int i = 0; i < R; i++)
            for (int j = 0; j < C; j++) {
                cin >> g[i][j];
                if (g[i][j] == 1) { total++; if (sr < 0) { sr = i; sc = j; } }
            }

        vis.assign(R, vector<char>(C, 0));
        used.clear();
        visited_ = 0;
        bad = false;
        array<int, 6> st;
        for (int i = 0; i < 6; i++) st[i] = i;
        if (sr >= 0) dfs(sr, sc, st);

        bool ok = (!bad && total == 6 && visited_ == 6 && (int)used.size() == 6);
        if (tc) cout << "\\n";
        cout << (ok ? "correct" : "incorrect") << "\\n";
    }
    return 0;
}`
  },

  '10606': {
    q: `學校走廊上有 n 個置物櫃，編號 1 到 n，一開始全部是關著的。第 i 個男孩會去「切換」所有編號是 i 的倍數的櫃子（關的打開、開的關上），i 從 1 到 n。

全部做完之後，編號最大的那個「開著」的櫃子是幾號？

輸入：每行一個整數 n（可以非常大，最多 100 位數），以 0 結束。
輸出：每行輸出編號最大的、仍然開著的櫃門編號。

範例輸入
10
100
0

範例輸出
9
100`,
    h: `第 k 個櫃子被切換的次數 = k 的因數個數。開著 ⟺ 切換了奇數次 ⟺ k 的因數個數是奇數 ⟺ **k 是完全平方數**。

（因數通常成雙成對出現 d 與 k/d，只有 d = k/d，也就是 k 是平方數時才會落單。）

所以答案是「不超過 n 的最大完全平方數」：

    答案 = ⌊√n⌋²

驗算：
    n = 10 → ⌊√10⌋ = 3 → 9 ✓
    n = 100 → ⌊√100⌋ = 10 → 100 ✓

【難點：n 是大數】
n 最多 100 位，遠遠超過任何內建整數型別，所以要自己寫「大數開平方」與「大數平方」。

大數開平方用小學的「直式開方法」，一次處理兩位數字：
    rem = rem × 100 + 下兩位
    找最大的 d ∈ [0,9] 使 (20·root + d)·d ≤ rem
    rem −= (20·root + d)·d；root = root×10 + d
位數為奇數時前面補一個 0。

算出 ⌊√n⌋ 之後再做一次大數乘法平方，就是答案。`,
    t: `1. 別被「開著/關著」的敘述繞暈——結論就是「完全平方數」。
2. n 可到 100 位，一定要用大數；用 long long 或 double 的 sqrt 都會錯。
3. 直式開方法得到的是「向下取整的平方根」，正是我們要的（不能四捨五入）。
4. 位數為奇數時要在前面補 0，才能兩位一組。
5. 終止條件是 n = 0（單獨一行的 0）。
6. 輸出時去掉前導零（除非答案就是 0）。`,
    c: `#include <bits/stdc++.h>
using namespace std;

typedef vector<int> Big;              // 低位在前的十進位

static int cmpBig(const Big& a, const Big& b) {
    if (a.size() != b.size()) return a.size() < b.size() ? -1 : 1;
    for (int i = (int)a.size() - 1; i >= 0; i--)
        if (a[i] != b[i]) return a[i] < b[i] ? -1 : 1;
    return 0;
}
static Big mulSmall(const Big& a, int m) {
    Big r; int carry = 0;
    for (size_t i = 0; i < a.size(); i++) { int cur = a[i] * m + carry; r.push_back(cur % 10); carry = cur / 10; }
    while (carry) { r.push_back(carry % 10); carry /= 10; }
    while (r.size() > 1 && r.back() == 0) r.pop_back();
    return r;
}
static Big addSmall(const Big& a, int m) {
    Big r = a; int i = 0, carry = m;
    while (carry) {
        if (i == (int)r.size()) r.push_back(0);
        int cur = r[i] + carry; r[i] = cur % 10; carry = cur / 10; i++;
    }
    return r;
}
static Big subBig(const Big& a, const Big& b) {
    Big r = a; int borrow = 0;
    for (size_t i = 0; i < r.size(); i++) {
        int cur = r[i] - borrow - (i < b.size() ? b[i] : 0);
        if (cur < 0) { cur += 10; borrow = 1; } else borrow = 0;
        r[i] = cur;
    }
    while (r.size() > 1 && r.back() == 0) r.pop_back();
    return r;
}
static Big shiftAdd(const Big& a, int d) {          // a*10 + d
    Big r(a.size() + 1, 0);
    for (size_t i = 0; i < a.size(); i++) r[i + 1] = a[i];
    r[0] = d;
    while (r.size() > 1 && r.back() == 0) r.pop_back();
    return r;
}
static Big mulBig(const Big& a, const Big& b) {
    vector<int> t(a.size() + b.size(), 0);
    for (size_t i = 0; i < a.size(); i++) {
        int carry = 0;
        for (size_t j = 0; j < b.size() || carry; j++) {
            int cur = t[i + j] + carry + (j < b.size() ? a[i] * b[j] : 0);
            t[i + j] = cur % 10; carry = cur / 10;
        }
    }
    while (t.size() > 1 && t.back() == 0) t.pop_back();
    return t;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s;
    while (cin >> s) {
        bool zero = true;
        for (size_t i = 0; i < s.size(); i++) if (s[i] != '0') zero = false;
        if (zero) break;

        string t = s;
        if (t.size() % 2) t = "0" + t;               // 位數補成偶數
        Big root(1, 0), rem(1, 0);
        for (size_t i = 0; i < t.size(); i += 2) {
            rem = shiftAdd(shiftAdd(rem, 0), 0);     // rem *= 100
            rem = addSmall(rem, (t[i] - '0') * 10 + (t[i + 1] - '0'));
            int best = 0;
            for (int d = 9; d >= 0; d--) {
                Big v = mulSmall(addSmall(mulSmall(root, 20), d), d);   // (20r+d)*d
                if (cmpBig(v, rem) <= 0) { best = d; rem = subBig(rem, v); break; }
            }
            root = shiftAdd(root, best);
        }
        Big ans = mulBig(root, root);                // 最大的平方數
        for (int i = (int)ans.size() - 1; i >= 0; i--) cout << ans[i];
        cout << "\\n";
    }
    return 0;
}`
  },

  '11027': {
    q: `給一個字串，把它的字元重新排列可以得到許多字串，把這些「相異」字串依字典序排好。其中有些是回文。

例如 "abba" 的 6 個相異排列依序是
    aabb, abab, abba, baab, baba, bbaa
其中只有 abba（第 3 個）與 baab（第 4 個）是回文，所以 abba 是「第 1 個回文」、baab 是「第 2 個回文」。

給定字串與 k，請輸出字典序中的第 k 個回文；若回文總數少於 k，輸出「XXX」。

輸入：第一行是測資數。接著每行一個小寫字串與一個正整數 k。
輸出：每組印「Case i: 」後接答案。

範例輸入
3
abba 1
abba 2
abba 3

範例輸出
Case 1: abba
Case 2: baab
Case 3: XXX`,
    h: `一個回文完全由它的「前半段」決定，而且回文之間的字典序順序，跟它們前半段的字典序順序完全一致。所以問題化簡成：

    求「半段多重集合」的第 k 個相異排列。

【前置檢查】
統計每個字元的出現次數。若「出現奇數次的字元」超過 1 個，就沒有任何回文 → 直接 XXX。
（長度為偶數時奇數次的字元必須是 0 個；長度為奇數時恰好 1 個。）

【建半段】
每個字元取 count/2 個，組成半段的多重集合；出現奇數次的那個字元留一個當「正中央」。

【求第 k 個相異排列】
標準的貪心：
    for 位置 i = 0 .. len−1：
        for 字元 c = 'a' .. 'z'（還有剩）：
            把 c 放在位置 i，算出「剩下的多重集合有幾種相異排列」= (剩餘總數)! / Π(各字元剩餘次數)!
            若 k > 這個數 → k −= 它，換下一個字元
            否則 → 固定 c，進入下一個位置
若一開始總排列數就 < k → XXX。

【溢位】
排列數可能非常大（字串可以很長），要用「上限截斷」：一旦計算過程中超過某個大界（例如 10^18 或 k 的上限），就直接視為「足夠大」。這樣既不會溢位、也不影響比較。

驗算 "abba"、半段是 {a, b}：
    相異排列依序是 "ab"、"ba" → 回文 "abba"、"baab"
    k=1 → abba ✓、k=2 → baab ✓、k=3 > 2 → XXX ✓`,
    t: `1. 回文存在的條件：奇數次的字元最多 1 個。長度為偶數時必須是 0 個。
2. 半段是「每個字元取一半」，中間那個字元（若有）不參與排列。
3. 排列數要用「多重集合排列數」= n! / Π(cnt_i!)，不是 n!。用一般階乘會嚴重高估。
4. 數字會爆掉，要做截斷（超過某個上界就當成無限大）。用 long double 近似很危險，建議用「邊乘邊比較上界」的整數作法。
5. k 可能超過 int，用 long long 讀。
6. 輸出的是完整回文（半段 + 中間字元 + 反轉的半段），不是半段。`,
    c: `#include <bits/stdc++.h>
using namespace std;

const unsigned long long CAP = 2000000000000000000ULL;   // 超過就當「足夠大」

// 多重集合 cnt 的相異排列數（截斷到 CAP）
unsigned long long perms(const vector<int>& cnt) {
    long long total = 0;
    for (int i = 0; i < 26; i++) total += cnt[i];
    unsigned long long res = 1;
    // 多重集合排列數 = prod C(remain, cnt_i)，逐步累乘保證整除
    long long remain = total;
    for (int i = 0; i < 26; i++) {
        for (int j = 1; j <= cnt[i]; j++) {
            if (remain <= 0) return res;
            if (res > CAP / (unsigned long long)remain) return CAP;   // 先判溢位
            res = res * (unsigned long long)remain / (unsigned long long)j;
            remain--;
        }
    }
    return res;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    for (int tc = 1; tc <= T; tc++) {
        string s;
        unsigned long long k;
        cin >> s >> k;

        vector<int> cnt(26, 0);
        for (size_t i = 0; i < s.size(); i++) cnt[s[i] - 'a']++;
        int odd = 0, mid = -1;
        for (int i = 0; i < 26; i++) if (cnt[i] % 2) { odd++; mid = i; }

        cout << "Case " << tc << ": ";
        if (odd > 1) { cout << "XXX\\n"; continue; }

        vector<int> half(26, 0);
        int hlen = 0;
        for (int i = 0; i < 26; i++) { half[i] = cnt[i] / 2; hlen += half[i]; }
        if (perms(half) < k) { cout << "XXX\\n"; continue; }

        string h;
        for (int pos = 0; pos < hlen; pos++) {
            for (int c = 0; c < 26; c++) {
                if (half[c] == 0) continue;
                half[c]--;
                unsigned long long cntp = perms(half);
                if (k > cntp) { k -= cntp; half[c]++; }       // 跳過這一整批
                else { h += (char)('a' + c); break; }
            }
        }
        string rev = h;
        reverse(rev.begin(), rev.end());
        cout << h << (mid >= 0 ? string(1, (char)('a' + mid)) : string("")) << rev << "\\n";
    }
    return 0;
}`
  },

  '10217': {
    q: `電影院賣票時記錄每位買票者的生日。如果某人的生日跟「在他之前買票的某個人」相同，他就能跟阿諾共進晚餐。為了讓排在最前面的人也有機會，隊伍第一個人的生日會拿去跟售票員的生日比對。

若你可以自由選擇要排在隊伍的第幾個位置，哪個位置讓你獲勝的機率最大？

輸入：每行一個整數 N（30 ≤ N < 100001），代表一年有幾天。讀到 EOF。
輸出：每行輸出一個浮點數（2 位小數）與一個整數：前者是「最佳的連續位置」、後者是「最佳的整數位置」。

範例輸入
365
200

範例輸出
18.61 19
13.65 14`,
    h: `排在第 k 個位置的人，前面已經有 k 個生日（售票員 + k−1 位買票者）。他獲勝的條件是：前面那 k 個生日彼此都不同（否則早就有人贏了），而且他的生日撞到其中之一。

    P(k) = [ Π_{i=1}^{k−1} (1 − i/N) ] × (k / N)

【整數答案】
直接從 k = 1 開始逐一算 P(k)，取最大值的 k。因為連乘項衰減得很快（k 超過幾倍 √N 之後就趨近 0），迴圈很快就能結束。

【浮點數答案】
把 P(k) 的最大值點做連續化，可以得到一個非常漂亮的近似式：

    x² + x = N   →   x = ( −1 + √(1 + 4N) ) / 2

驗算：
    N = 365：√1461 = 38.2230 → x = 37.2230/2 = 18.6115 → 18.61 ✓
    N = 200：√801 = 28.3019 → x = 27.3019/2 = 13.6509 → 13.65 ✓
兩組都與題目輸出一字不差。

而整數位置我用程式逐一算 P(k) 驗證過：N = 365 時最大值在 k = 19、N = 200 時在 k = 14，也與題目一致 ✓

（順帶一提：整數答案「大多數」情況下就是 ⌈x⌉，但我掃過 N = 30 到 100000 發現有少數幾個 N（例如 N = 30，x 剛好是整數 5.000）會不一致，所以整數部分還是老老實實用 P(k) 逐一比較最保險。）`,
    t: `1. 第 k 個位置前面有 k 個生日（含售票員），不是 k−1 個。少算一個會讓答案整個偏移。
2. 浮點答案用公式 x = (−1 + √(1+4N))/2；整數答案要用 P(k) 逐一比較，不要直接對 x 取整（少數 N 會不一致）。
3. 連乘要用 double；k 大到某個程度後乘積會下溢成 0，可以在乘積小於 1e−300 時中斷迴圈。
4. 浮點輸出 2 位小數（fixed << setprecision(2)），整數直接印，中間一個空白。
5. N 可到 10^5，若測資很多筆，每筆的迴圈其實只跑 O(√N × 常數) 次就會收斂，不用擔心。
6. 讀到 EOF 結束。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout << fixed << setprecision(2);
    long long N;
    while (cin >> N) {
        // 連續近似解：x^2 + x = N
        double x = (-1.0 + sqrt(1.0 + 4.0 * (double)N)) / 2.0;

        // 整數位置：逐一比較 P(k)
        double prod = 1.0, best = -1.0;
        long long bestK = 1;
        for (long long k = 1; k <= N; k++) {
            double p = prod * ((double)k / (double)N);
            if (p > best) { best = p; bestK = k; }
            prod *= (1.0 - (double)k / (double)N);
            if (prod < 1e-300) break;                // 之後只會更小
        }
        cout << x << " " << bestK << "\\n";
    }
    return 0;
}`
  }
};

/* 三星第二十一批 —— 高 AC 經典題 */
const SOL61 = {
  '11523': {
    q: `一排待回收的物品，每種可回收材質都有對應的回收桶。你要把所有「可回收」的物品丟進桶子裡。

一次「移動」可以把「連續且同種類」的一整段物品一起丟掉。不可回收的物品不能移動，會一直卡在原地。

例：paper − glass − paper − AEROSOL − paper
    先丟掉 glass → paper − paper − AEROSOL − paper
    再一次丟掉前兩張 paper → AEROSOL − paper
    最後丟掉那張 paper
共 3 次。

輸入：第一行是測資數 T（< 50）。每組先一行 N（< 100），下一行是 N 個材質名稱。可回收材質「全部小寫」，不可回收材質「全部大寫」。
輸出：每組印「Case i: 最少移動次數」。

範例輸入
3
5
paper glass paper AEROSOL paper
4
icpc icpc icpc icpc
3
NO RECYCLABLE MATERIALS

範例輸出
Case 1: 3
Case 2: 1
Case 3: 0`,
    h: `不可回收的物品永遠不會消失，所以它們把序列切成好幾段互不影響的區間——先把序列依「大寫物品」切開，各段分別求解再加總。

每一段是「同種類連續就能一次清掉」的經典區間 DP（跟 Strange Printer / Zuma 同一類）：

    dp[i][j] = 清空 s[i..j] 所需的最少次數
    dp[i][i] = 1
    dp[i][j] = dp[i+1][j] + 1                        // 先把 s[i] 單獨算一次
             ; 對每個 k ∈ [i+1, j] 且 s[k] == s[i]：
               dp[i][j] = min(dp[i][j], dp[i+1][k-1] + dp[k][j])
                                                      // 把 s[i] 併到 s[k] 那一次一起清

第二條轉移的意思是：先把 s[i+1..k-1] 清光，s[i] 就跟 s[k] 貼在一起了，於是它們可以一起被清掉——所以 s[i] 不用額外花一次，成本直接算進 dp[k][j]。

複雜度 O(len³)，N < 100 完全沒問題。

逐步驗算（第一組）：
    大寫的 AEROSOL 把序列切成 [paper, glass, paper] 與 [paper]。
    第一段：dp = 2（先清 glass，兩張 paper 就貼在一起，一次清掉）
    第二段：dp = 1
    合計 3 ✓
第二組：四個 icpc 本來就連續 → 1 ✓
第三組：三個詞全是大寫，沒有可回收物 → 0 ✓`,
    t: `1. 大小寫是關鍵：全小寫 = 可回收、全大寫 = 不可回收。用第一個字元判斷 islower 就好。
2. 不可回收的物品「不能被移走」，所以要把序列切段，不能直接刪掉它們再合併（那樣第一組會算成 2）。
3. 區間 DP 的第二條轉移用的是 dp[i+1][k-1] + dp[k][j]，不是 dp[i+1][k-1] + dp[k][j] + 1——關鍵就在於 s[i] 蹭到 s[k] 那一次，不另外計費。
4. k = i+1 時 dp[i+1][k-1] 是空區間，要當作 0。
5. 材質名稱最長 20 個字元，先把名稱映射成整數再做 DP，比較快也比較好寫。
6. 輸出格式是「Case 1: 3」。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    for (int tc = 1; tc <= T; tc++) {
        int n;
        cin >> n;
        vector<string> w(n);
        for (int i = 0; i < n; i++) cin >> w[i];

        // 依「大寫（不可回收）」切段，各段獨立求解
        long long total = 0;
        map<string, int> id;
        int i = 0;
        while (i < n) {
            if (isupper((unsigned char)w[i][0])) { i++; continue; }
            int j = i;
            vector<int> seg;
            while (j < n && islower((unsigned char)w[j][0])) {
                if (!id.count(w[j])) { int k = (int)id.size(); id[w[j]] = k; }
                seg.push_back(id[w[j]]);
                j++;
            }
            int m = (int)seg.size();
            vector<vector<int> > dp(m, vector<int>(m, 0));
            for (int a = 0; a < m; a++) dp[a][a] = 1;
            for (int len = 2; len <= m; len++)
                for (int a = 0; a + len - 1 < m; a++) {
                    int b = a + len - 1;
                    int best = dp[a + 1][b] + 1;              // s[a] 自己清一次
                    for (int k = a + 1; k <= b; k++) {
                        if (seg[k] != seg[a]) continue;
                        int left = (k - 1 >= a + 1) ? dp[a + 1][k - 1] : 0;
                        best = min(best, left + dp[k][b]);    // s[a] 蹭 s[k] 那一次
                    }
                    dp[a][b] = best;
                }
            if (m > 0) total += dp[0][m - 1];
            i = j;
        }
        cout << "Case " << tc << ": " << total << "\\n";
    }
    return 0;
}`
  },

  '12507': {
    q: `王國有 n 座城市（編號 1 到 n，首都是城市 1），每座城市有人口數。戰後所有道路都毀了，國王想重建一部分道路，但總花費不能超過預算 B。

給定「可以重建」的道路清單與各自造價，請求出「從首都可以到達的城市（含首都自己）」的最大總人口。

輸入：第一行是測資數（≤ 20）。每組第一行是三個整數 n m B（n ≤ 16、m ≤ 100、B ≤ 100000）。第二行是 n 個人口數。接著 m 行，每行三個整數 u v c。
輸出：每組輸出可達到的最大總人口。

範例輸入
2
4 6 6
500 400 300 200
1 2 4
1 3 3
1 4 2
4 3 5
2 4 6
3 2 7
4 6 5
500 400 300 200
1 2 4
1 3 3
1 4 2
4 3 5
2 4 6
3 2 7

範例輸出
1100
1000`,
    h: `n ≤ 16，所以可以直接**枚舉所有城市子集合**（2^16 = 65536 種）。

對每個「包含城市 1」的子集合 S：
1. 只保留「兩端都在 S 裡」的道路，用 Kruskal 求最小生成樹。
2. 若 S 能被這些道路連通，且 MST 的總花費 ≤ B，那麼 S 就是一個可行解，候選答案是 S 中所有人口的總和。
3. 取所有可行解中最大的人口總和。

為什麼取 MST 就好？因為我們只在乎「S 全部連通」，用最便宜的方式連通就是 MST；若連 MST 都超過預算，任何連通方式都超過。

複雜度：2^n × m·α ≈ 65536 × 100 ≈ 6.5×10^6，很快。（先把邊依造價排好序，每個子集合只要線性掃一次。）

驗算（n=4，人口 500/400/300/200）：
  第一組預算 6：
      {1,2,4}：MST = 1-4(2) + 1-2(4) = 6 ≤ 6 → 人口 500+400+200 = 1100
      {1,3,4}：MST = 1-4(2) + 1-3(3) = 5 ≤ 6 → 人口 1000
      {1,2,3}：MST = 1-3(3) + 1-2(4) = 7 > 6 ✗
      全部四個：MST = 2+3+4 = 9 > 6 ✗
      最大 1100 ✓
  第二組預算 5：{1,3,4} 花 5 → 1000；{1,2,4} 要 6 > 5 ✗ → 1000 ✓`,
    t: `1. 子集合必須包含城市 1（首都），而且「只算 S 內部的邊」——不能借道 S 以外的城市。
2. 只有「S 完全連通」才算數；MST 沒把 S 全部接起來就要跳過。
3. 單獨的首都（S = {1}）永遠可行，花費 0，人口就是首都人口——這是答案的下界。
4. 邊要先依造價排序一次（在所有子集合之外），不要每個子集合重排。
5. 人口總和可能超過 int？n ≤ 16、人口值不大，int 通常夠，但用 long long 保險。
6. 預算 B 可到 100000，花費用 int/long long 都行。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int par_[20];
int find_(int x) { return par_[x] == x ? x : par_[x] = find_(par_[x]); }

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        int n, m;
        long long B;
        cin >> n >> m >> B;
        vector<long long> pop(n);
        for (int i = 0; i < n; i++) cin >> pop[i];
        vector<array<long long, 3> > e(m);          // (造價, u, v)
        for (int i = 0; i < m; i++) {
            long long u, v, c;
            cin >> u >> v >> c;
            e[i] = {c, u - 1, v - 1};
        }
        sort(e.begin(), e.end());                    // 只排一次

        long long best = 0;
        for (int mask = 1; mask < (1 << n); mask++) {
            if (!(mask & 1)) continue;               // 必須含首都
            for (int i = 0; i < n; i++) par_[i] = i;
            long long cost = 0;
            int need = __builtin_popcount(mask) - 1; // 還要接幾條邊
            for (int i = 0; i < m && need > 0; i++) {
                int u = (int)e[i][1], v = (int)e[i][2];
                if (!((mask >> u) & 1) || !((mask >> v) & 1)) continue;
                if (find_(u) == find_(v)) continue;
                par_[find_(u)] = find_(v);
                cost += e[i][0];
                need--;
                if (cost > B) break;
            }
            if (need > 0 || cost > B) continue;      // 沒連通或超預算
            long long sum = 0;
            for (int i = 0; i < n; i++) if ((mask >> i) & 1) sum += pop[i];
            best = max(best, sum);
        }
        cout << best << "\\n";
    }
    return 0;
}`
  },

  '12875': {
    q: `百貨集團在 n 個城市各有一家分店，接下來 m 個月每個月要辦一場演唱會（每月挑一個城市）。

每個城市在每個月辦演唱會可以賺到的利潤已知；而從一個城市移動到另一個城市要付旅費（給定城市之間的移動成本矩陣）。第一個月可以直接在任何城市開始（不用旅費）。

請求出「總利潤減去總旅費」的最大值。

輸入：第一行是測資數（≤ 10）。每組第一行是兩個整數 n m。接著 n 行，第 i 行是 m 個數，代表城市 i 在各月的利潤。再接著 n 行 n 個數，是城市之間的移動成本。
輸出：每組輸出一行最大值。

範例輸入
1
3 4
1 3 20 40
50 20 1 2
20 50 50 1
0 10 10
10 0 10
10 10 0

範例輸出
170`,
    h: `很直接的分層 DP。

    dp[t][c] = 第 t 個月在城市 c 辦演唱會時，前 t 個月的最大淨收益

    dp[0][c] = profit[c][0]                                （第一個月不用旅費）
    dp[t][c] = profit[c][t] + max over p ( dp[t-1][p] − cost[p][c] )

答案 = max over c 的 dp[m-1][c]。

複雜度 O(m · n²)，規模很小。

逐月驗算（範例：利潤矩陣的列是城市、行是月份）：
    城市0：1, 3, 20, 40
    城市1：50, 20, 1, 2
    城市2：20, 50, 50, 1
    旅費：任兩城市都是 10
    第 1 月：dp = [1, 50, 20]
    第 2 月：
        城市0：3 + max(1, 50−10, 20−10) = 3 + 40 = 43
        城市1：20 + max(1−10, 50, 20−10) = 20 + 50 = 70
        城市2：50 + max(1−10, 50−10, 20) = 50 + 40 = 90
    第 3 月：
        城市0：20 + max(43, 70−10, 90−10) = 20 + 80 = 100
        城市1：1 + max(43−10, 70, 90−10) = 1 + 80 = 81
        城市2：50 + max(43−10, 70−10, 90) = 50 + 90 = 140
    第 4 月：
        城市0：40 + max(100, 81−10, 140−10) = 40 + 130 = 170  ← 最大
    答案 170 ✓（與題目輸出一致）`,
    t: `1. 第一個月「不用旅費」——起點可以是任何城市。若把第一個月也加上旅費，答案會偏小。
2. 留在同一個城市的成本是 cost[c][c] = 0（矩陣對角線），轉移時不用特別處理。
3. dp 的初值要用「負無限大」而不是 0，避免從不存在的狀態轉移（雖然這題第一個月每個城市都可行，仍是好習慣）。
4. 利潤與旅費相減可能是負的，最終答案也可能是負的，別把 dp 夾在 0 以上。
5. 讀入順序：先 n 列利潤（每列 m 個），再 n × n 的成本矩陣。
6. 用 long long 保險（m 個月 × 大利潤）。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        int n, m;
        cin >> n >> m;
        vector<vector<long long> > profit(n, vector<long long>(m));
        for (int i = 0; i < n; i++)
            for (int j = 0; j < m; j++) cin >> profit[i][j];
        vector<vector<long long> > cost(n, vector<long long>(n));
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) cin >> cost[i][j];

        const long long NEG = LLONG_MIN / 4;
        vector<long long> dp(n), nd(n);
        for (int c = 0; c < n; c++) dp[c] = profit[c][0];   // 第一個月不用旅費
        for (int t = 1; t < m; t++) {
            for (int c = 0; c < n; c++) {
                long long best = NEG;
                for (int p = 0; p < n; p++)
                    if (dp[p] != NEG) best = max(best, dp[p] - cost[p][c]);
                nd[c] = (best == NEG) ? NEG : best + profit[c][t];
            }
            dp = nd;
        }
        long long ans = NEG;
        for (int c = 0; c < n; c++) ans = max(ans, dp[c]);
        cout << ans << "\\n";
    }
    return 0;
}`
  },

  '10317': {
    q: `讀入若干個「不正確的等式」，等式最多 16 個項，運算子只有 '+' 與 '−'，中間有一個 '='。請把「項」重新排列（運算子的位置與順序保持不變），讓等式成立。

例如 1 + 2 = 4 − 5 + 6 不成立，但把項重排成 6 + 2 = 4 − 1 + 5 就成立了。

輸入：多行，每行一個等式。項是小於 100 的整數，項與運算子之間以空白分隔。讀到 EOF。
輸出：每行輸出重排後的等式；若無解輸出「no solution」。

範例輸入
1 + 2 = 4 - 5 + 6
1 + 5 = 6 + 7

範例輸出
6 + 2 = 4 - 1 + 5
no solution`,
    h: `先把整個等式搬到同一邊：等號右邊的每一項，符號要反過來。

例：1 + 2 = 4 − 5 + 6
  → (+1) + (+2) + (−4) + (+5) + (−6) = 0
所以每個「位置」都有一個固定的符號 s_i ∈ {+1, −1}（由運算子與是否在等號右邊決定），而我們可以自由決定哪個數字放到哪個位置。

於是問題變成：
    把這些數字分成兩組——一組放到「+ 位置」（共 p 個），一組放到「− 位置」（共 q 個），
    使得兩組的總和相等（都等於 total / 2）。

所以：
1. 若 total 是奇數 → 直接 no solution。
2. 枚舉所有 2^n 種子集合（n ≤ 16 → 65536），找一個「元素個數恰好是 p、總和恰好是 total/2」的子集合。
3. 把該子集合的數字依序填進 + 位置、其餘填進 − 位置，照原本的運算子輸出。

驗算：
  「1 + 2 = 4 − 5 + 6」：符號是 +,+,−,+,−（第 4 項因為前面是 '−' 又在右邊，變成 +）。
      + 位置有 3 個、− 位置有 2 個；total = 1+2+4+5+6 = 18，各半是 9。
      取 {1, 2, 6} 放 + 位置、{4, 5} 放 − 位置 → 例如輸出 6 + 2 = 4 − 1 + 5
      （檢查：6+2 = 8，4−1+5 = 8 ✓）
  「1 + 5 = 6 + 7」：total = 19 是奇數 → no solution ✓

輸出時只要把選好的數字依序塞回原本的位置即可。

我把這套流程實作出來跑第一組，得到的是「1 + 2 = 4 − 6 + 5」（1+2 = 3、4−6+5 = 3 ✓），
跟題目範例列的「6 + 2 = 4 − 1 + 5」不同但同樣成立——題目本來就允許任何一組合法的重排。`,
    t: `1. 等號右邊的符號要整體反轉：右邊第一項前面沒有運算子，搬過來之後是 '−'。這一步弄錯全題皆錯。
2. 判斷條件是「+ 位置那組的和 = − 位置那組的和」，也就是各佔 total 的一半——所以 total 必須是偶數。
3. 子集合的「元素個數」必須剛好等於 + 位置的數量，不能只看總和。
4. n ≤ 16，2^16 的枚舉完全足夠；用 __builtin_popcount 快速取個數。
5. 解析輸入要小心：項與運算子之間用空白分隔，用 >> 逐個 token 讀最省事，遇到 "=" 就切換到右半邊。
6. 題目允許多解，輸出任何一組合法的即可（「no solution」全小寫）。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string line;
    while (getline(cin, line)) {
        if (line.find_first_not_of(" \\t\\r") == string::npos) continue;
        istringstream in(line);
        vector<int> num;
        vector<int> sign;            // 每個「位置」搬到左邊之後的符號
        vector<string> ops;          // 原本的運算子（含 "="）
        string t;
        int cur = 1;                 // 目前這一項的符號
        bool right = false;
        while (in >> t) {
            if (t == "+") { ops.push_back("+"); cur = right ? -1 : 1; }
            else if (t == "-") { ops.push_back("-"); cur = right ? 1 : -1; }
            else if (t == "=") { ops.push_back("="); right = true; cur = -1; }
            else { num.push_back(atoi(t.c_str())); sign.push_back(cur); }
        }

        int n = (int)num.size();
        int total = 0, plusCnt = 0;
        for (int i = 0; i < n; i++) total += num[i];
        for (int i = 0; i < n; i++) if (sign[i] > 0) plusCnt++;

        int found = -1;
        if (total % 2 == 0) {
            int half = total / 2;
            for (int mask = 0; mask < (1 << n) && found < 0; mask++) {
                if (__builtin_popcount(mask) != plusCnt) continue;
                int s = 0;
                for (int i = 0; i < n; i++) if ((mask >> i) & 1) s += num[i];
                if (s == half) found = mask;
            }
        }
        if (found < 0) { cout << "no solution\\n"; continue; }

        vector<int> pos, neg;
        for (int i = 0; i < n; i++) {
            if ((found >> i) & 1) pos.push_back(num[i]);
            else neg.push_back(num[i]);
        }
        // 依原本的符號把數字填回去
        size_t pi = 0, ni = 0;
        ostringstream out;
        int opIdx = 0;
        for (int i = 0; i < n; i++) {
            if (i > 0) out << " " << ops[opIdx++] << " ";
            out << (sign[i] > 0 ? pos[pi++] : neg[ni++]);
        }
        cout << out.str() << "\\n";
    }
    return 0;
}`
  }
};

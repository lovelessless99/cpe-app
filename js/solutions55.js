/* 三星第十五批 —— 高 AC 經典題 */
const SOL55 = {
  '11732': {
    q: `C/C++ 的 strcmp() 標準寫法如下：

    int strcmp(char *s, char *t) {
        int i;
        for (i = 0; s[i] == t[i]; i++)
            if (s[i] == '\\0') return 0;
        return s[i] - t[i];
    }

給定 N 個字串，請計算「把每一對字串都拿去 strcmp 一次」時，程式一共執行了幾次「字元比較」。上面的程式碼中有兩個比較：迴圈條件的 s[i] == t[i]，以及迴圈內的 s[i] == '\\0'。

輸入：最多 10 組測資。每組先一行 N（< 4001），接著 N 行字串。以 N = 0 結束。
輸出：每組印「Case i: 總比較次數」。

範例輸入
2
a
b
4
cat
hat
mat
sir
0

範例輸出
Case 1: 1
Case 2: 6`,
    h: `先算「一對字串」要比幾次。設兩字串的最長共同前綴長度是 L：

  - 兩字串不相同：i = 0 .. L−1 每一輪做 2 次比較（相等 + 不是結尾），第 L 輪做 1 次（s[L] == t[L] 為假，直接跳出）
        總共 2L + 1
  - 兩字串完全相同（長度 len）：i = 0 .. len−1 每輪 2 次，第 len 輪做 2 次（'\\0' == '\\0' 為真，然後 s[len] == '\\0' 為真、return）
        總共 2·len + 2

所以

    總數 = Σ_pairs (2·LCP + 1) + （相同字串的配對數）

【怎麼快速算 Σ LCP】
建一棵字典樹（trie），每個節點記錄「經過它的字串數 cnt」。那麼

    Σ_pairs LCP = Σ_{深度 ≥ 1 的每個節點 v} C(cnt[v], 2)

因為「LCP ≥ d」的配對數 = 深度 d 的各節點的 C(cnt, 2) 之和，而 Σ_d 這個量剛好等於 Σ LCP。

相同字串的配對數 = Σ over 每個「字串結尾標記」節點的 C(endCnt, 2)。

所以最終答案：
    ans = C(N,2) + 2·Σ_{v, 深度≥1} C(cnt[v], 2) + Σ_v C(endCnt[v], 2)

複雜度 O(總字元數)。

驗算 {cat, hat, mat, sir}：沒有任何共同前綴 → Σ LCP = 0、相同配對 0
    ans = C(4,2) = 6 ✓
驗算 {a, b}：ans = C(2,2)… 也就是 C(2,2) = 1 對，LCP = 0 → 1 ✓`,
    t: `1. 迴圈裡有「兩個」比較，不是一個。少算一半是最常見的錯誤。
2. 完全相同的字串要多算 1 次（最後那個 s[i] == '\\0'），公式是 2·len + 2 而不是 2·len + 1。
3. N 可到 4000，配對數 800 萬；若真的兩兩比對再逐字元算會 TLE，一定要用 trie 聚合。
4. 答案很大：4000² × 字串長度，用 long long。
5. 字串可能重複出現，trie 的結尾計數要能累加。
6. 每組測資都要重建 trie（重設節點池即可）。`,
    c: `#include <bits/stdc++.h>
using namespace std;

const int MAXNODE = 4000005;
int nxt_[MAXNODE][26];
long long cnt_[MAXNODE], endc[MAXNODE];
int nodeCnt;

int newNode() {
    memset(nxt_[nodeCnt], -1, sizeof(nxt_[nodeCnt]));
    cnt_[nodeCnt] = 0; endc[nodeCnt] = 0;
    return nodeCnt++;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, cs = 1;
    while (cin >> n && n != 0) {
        nodeCnt = 0;
        int root = newNode();
        for (int i = 0; i < n; i++) {
            string s;
            cin >> s;
            int cur = root;
            for (size_t k = 0; k < s.size(); k++) {
                int c = s[k] - 'a';
                if (nxt_[cur][c] < 0) nxt_[cur][c] = newNode();
                cur = nxt_[cur][c];
                cnt_[cur]++;                     // 經過此節點的字串數
            }
            endc[cur]++;                         // 在此結尾的字串數
        }

        long long N = n;
        long long ans = N * (N - 1) / 2;         // 每一對的常數項 +1
        for (int v = 1; v < nodeCnt; v++) {      // 跳過根（深度 0）
            ans += 2 * (cnt_[v] * (cnt_[v] - 1) / 2);        // 2 * sum(LCP)
            ans += endc[v] * (endc[v] - 1) / 2;              // 相同字串多的那一次
        }
        cout << "Case " << cs++ << ": " << ans << "\\n";
    }
    return 0;
}`
  },

  '10433': {
    q: `「自守數（Automorphic number）」是指平方的末幾位剛好等於自己的數：
    5² = 25、6² = 36、25² = 625、76² = 5776 …
前幾個自守數是 1, 5, 6, 25, 76, ...

依定義 0 不是自守數。注意有些自守數帶有前導零，前導零要視為有效位數（例如 "0625" 是 4 位數的自守數，因為 625² = 390625 的末 4 位是 0625）。

輸入：每行一個任意大的整數（位數不超過 2000），讀到 EOF。
輸出：若是自守數，印「Automorphic number of d-digit.」（d 是位數）；否則印「Not an Automorphic number.」

範例輸入
6
76
34

範例輸出
Automorphic number of 1-digit.
Automorphic number of 2-digit.
Not an Automorphic number.`,
    h: `判斷式就是

    n² mod 10^d == n     （d 是 n 的位數，含前導零）

因為 n 可以有 2000 位，一定要用大數。但有個關鍵優化：**我們只需要平方的最後 d 位**，所以乘法只要算低位的部分就好。

實作：把數字存成「低位在前的 digit 陣列」，然後做一次只保留前 d 位（也就是低 d 位）的乘法：

    for i in 0..d-1:
        for j in 0..d-1-i:
            res[i+j] += a[i] * a[j]
    再統一處理進位（只處理到第 d 位，更高位直接丟掉）

最後比較 res[0..d-1] 是否等於 a[0..d-1]。

複雜度 O(d²) = 4×10^6，單筆很快。

【前導零】
題目說前導零是有效位數，所以 d 就是「輸入字串的長度」，不能先去掉前導零。輸入 "0625" 的 d 是 4。

【0 不是自守數】
若整個字串都是 0，直接判為不是。

驗算：
    6：6² = 36，末 1 位是 6 ✓ → 1-digit
    76：76² = 5776，末 2 位是 76 ✓ → 2-digit
    34：34² = 1156，末 2 位是 56 ≠ 34 ✗`,
    t: `1. 前導零是有效位數！不能 trim。位數 d 就是字串長度。
2. 0 不是自守數（題目明講），要特判「全部都是 0」的情形。
3. 只需要平方的「低 d 位」，別去算完整的 2000×2000 位乘法（會慢 4 倍且沒必要）。
4. 進位處理要小心：內層累加最大是 d × 81 ≈ 162000，用 int 存中間值再統一進位就好。
5. 輸出的訊息裡 d 後面是「-digit.」，句尾有句點。
6. 輸入讀到 EOF；每行就是一個數字字串。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s;
    while (cin >> s) {
        int d = (int)s.size();
        bool allZero = true;
        for (int i = 0; i < d; i++) if (s[i] != '0') allZero = false;
        if (allZero) { cout << "Not an Automorphic number.\\n"; continue; }

        // 低位在前
        vector<int> a(d);
        for (int i = 0; i < d; i++) a[i] = s[d - 1 - i] - '0';

        // 只算平方的低 d 位
        vector<long long> res(d + 1, 0);
        for (int i = 0; i < d; i++)
            for (int j = 0; i + j < d; j++)
                res[i + j] += (long long)a[i] * a[j];
        long long carry = 0;
        for (int i = 0; i < d; i++) {
            long long cur = res[i] + carry;
            res[i] = cur % 10;
            carry = cur / 10;
        }

        bool ok = true;
        for (int i = 0; i < d && ok; i++) if (res[i] != a[i]) ok = false;
        if (ok) cout << "Automorphic number of " << d << "-digit.\\n";
        else cout << "Not an Automorphic number.\\n";
    }
    return 0;
}`
  },

  '11346': {
    q: `在平面上，從區域 A = {(x, y) : |x| ≤ a, |y| ≤ b} 之中均勻隨機取一點 (X, Y)。以 (0,0) 與 (X, Y) 為對角的長方形，面積是 |X·Y|。

請問這個面積大於 S 的機率是多少？

輸入：第一行是測資數（≤ 200）。接著每行三個實數 a b S。
輸出：每組輸出機率（百分比），保留 6 位小數，後面接一個百分號。

範例輸入
3
10 5 20
1 1 1
2 2 0

範例輸出
23.348371%
0.000000%
100.000000%`,
    h: `由對稱性，只要看第一象限就好：X 均勻分布在 [0, a]、Y 均勻分布在 [0, b]，求 P(X·Y > S)。

先算補事件 P(X·Y ≤ S) 對應的面積：
  若 S ≥ a·b → 整個矩形，機率 1，答案 0。
  若 S ≤ 0 → 面積 0，答案 1（100%）。
  否則，曲線 xy = S 與矩形相交。把矩形依 x 切開：
      x ∈ [0, S/b]：整條高度 b 都滿足 xy ≤ S → 面積 (S/b)·b = S
      x ∈ [S/b, a]：滿足的高度是 S/x → 面積 ∫_{S/b}^{a} (S/x) dx = S·ln(ab/S)
  所以「xy ≤ S」的面積 = S + S·ln(a·b / S)

    P(X·Y > S) = 1 − ( S + S·ln(ab/S) ) / (a·b)

驗算範例一（a=10, b=5, S=20）：ab = 50
    S + S·ln(50/20) = 20 + 20 × 0.916291 = 38.325814
    P = 1 − 38.325814 / 50 = 1 − 0.766516 = 0.233484 → 23.348371% ✓
範例二（a=1, b=1, S=1）：S = ab → P = 0 → 0.000000% ✓
範例三（a=2, b=2, S=0）：S ≤ 0 → P = 1 → 100.000000% ✓

輸出乘 100 並保留 6 位小數，後面直接接 '%'。`,
    t: `1. 一定要用「對稱性化簡到第一象限」，否則要處理 |X·Y| 的絕對值會很麻煩（其實兩者的機率完全相同）。
2. S = 0 要特判：ln(ab/0) 會發散。S ≤ 0 時答案就是 100%。
3. S ≥ a·b 時答案是 0%，不要讓 ln 算出負數。
4. 輸出是「百分比」，要乘 100；6 位小數用 fixed << setprecision(6)，最後接 '%' 且沒有空白。
5. a、b、S 是實數（可能有小數），用 double 讀。
6. 由於是連續分布，「大於」與「大於等於」機率相同，不用區分。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout << fixed << setprecision(6);
    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        double a, b, S;
        cin >> a >> b >> S;
        double area = a * b;
        double p;
        if (S <= 0) p = 1.0;                       // 面積一定大於 0
        else if (S >= area) p = 0.0;               // 不可能超過整個矩形
        else p = 1.0 - (S + S * log(area / S)) / area;
        cout << p * 100.0 << "%\\n";
    }
    return 0;
}`
  },

  '11658': {
    q: `一家股份公司的股東各持有一定百分比的股份。若某位股東持股超過一半，他就獨得全部利潤。若沒有人過半，股東們可以組成「聯盟」——只要聯盟的總持股超過 50%，利潤就歸這個聯盟，並依各成員的持股比例分配。

給定所有股東的持股百分比與指定的股東 k，請求出他能拿到的最大利潤百分比（也就是「他的持股 ÷ 聯盟總持股 × 100」的最大值）。

輸入：多組測資。每組第一行是兩個整數 n k（股東數與指定股東的編號）。接著 n 行，每行一個持股百分比（兩位小數）。
輸出：每組輸出一行答案，保留兩位小數。

範例輸入
5 5
20.00
12.00
29.00
14.00
25.00
2 1
56.87
43.13
2 2
56.87
43.13

範例輸出
49.02
100.00
43.13`,
    h: `目標是最大化「自己的持股 ÷ 聯盟總持股」。自己的持股是固定的，所以等價於「讓聯盟總持股盡量小，但仍要超過 50%」。

貪心：把「其他股東」的持股由小到大排序，然後從最小的開始一個一個拉進聯盟，直到總持股超過 50% 就停。

為什麼由小到大最好？因為我們要的是「剛好超過 50% 的最小總和」。每次加入最小的那位，總和成長最慢，最先達到 50% 時的總和就是最小的。（嚴格說：任何達標的聯盟，其總和 ≥ 我們貪心得到的總和，因為貪心是同樣人數下總和最小的選法，而更多人只會更大。）

    答案 = 自己的持股 / 聯盟總持股 × 100

特例：自己就超過 50% 時，聯盟只有自己，答案 100.00。

範例驗算：
  第一組：n=5, k=5，持股 [20, 12, 29, 14, 25]，自己是 25。
      其他人排序後 12, 14, 20, 29。25 + 12 = 37（不夠）、+14 = 51 > 50 ✓
      答案 = 25 / 51 × 100 = 49.0196… → 49.02 ✓
  第二組：自己 56.87 > 50 → 100.00 ✓
  第三組：自己 43.13，必須拉進 56.87 → 總和 100 → 43.13 / 100 × 100 = 43.13 ✓`,
    t: `1. 是「超過」50%，不是「大於等於」。持股剛好 50% 不算過半。浮點比較時要留意（用 > 50.0 + eps 或把百分比乘 100 變整數處理）。
2. 持股是兩位小數的浮點數，最保險的作法是「乘以 100 轉成整數」再比較（總和 > 5000）。這樣完全避開浮點誤差。
3. 貪心是把「其他人」由小到大加入，自己一定在聯盟裡。
4. 輸出保留兩位小數，注意四捨五入（fixed << setprecision(2)）。
5. n 可能是 1（只有一位股東），他一定持有 100%，答案 100.00。
6. 讀到 EOF 為止（或依測資給的組數）。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout << fixed << setprecision(2);
    int n, k;
    while (cin >> n >> k) {
        vector<long long> v(n);
        for (int i = 0; i < n; i++) {
            double x;
            cin >> x;
            v[i] = (long long)llround(x * 100);       // 轉成整數避免浮點誤差
        }
        long long mine = v[k - 1];
        vector<long long> other;
        for (int i = 0; i < n; i++) if (i != k - 1) other.push_back(v[i]);
        sort(other.begin(), other.end());             // 由小到大拉進聯盟

        long long total = mine;
        for (size_t i = 0; i < other.size() && total <= 5000; i++) total += other[i];
        cout << (double)mine / (double)total * 100.0 << "\\n";
    }
    return 0;
}`
  },

  '11088': {
    q: `教練要從 N 位選手中組隊，每隊「恰好三人」。若一隊三人的能力值總和 ≥ 20，就算是一支「有希望的隊伍」。不一定每個人都要入隊。

請求出最多能組出幾支有希望的隊伍。

輸入：最多 100 組測資。每組第一行是選手數 N，第二行是 N 個正整數（每個 ≤ 30）。以 N = 0 結束。
輸出：每組印「Case i: 最多隊伍數」。

範例輸入
9
22 20 9 10 19 30 2 4 16
2
15 3
0

範例輸出
Case 1: 3
Case 2: 0`,
    h: `N 很小（這題的上限讓 2^N 可行），所以用「集合狀態壓縮 DP」：

    dp[mask] = 已經把 mask 這些人分配掉之後，最多能組出幾支有希望的隊伍
    dp[0] = 0

轉移：為了避免重複枚舉同一組合，固定「先處理 mask 中最小的那個未使用的人 i」，然後從剩下的人中選兩位 j、k：
    若 a[i] + a[j] + a[k] ≥ 20 → dp[mask | (1<<i) | (1<<j) | (1<<k)] = max(..., dp[mask] + 1)
    另外也允許「i 不入隊」：dp[mask | (1<<i)] = max(..., dp[mask])

「固定最小未使用者」這個技巧把分支從 C(n,3) 降到 C(n−1,2)，而且天然避免了同一組隊被以不同順序枚舉。

答案 = dp[全滿]（或掃過所有 mask 取最大，兩者等價）。

複雜度 O(2^N · N²)。

範例驗算：
  {22, 20, 9, 10, 19, 30, 2, 4, 16} 共 9 人 → 最多 3 隊，而且確實可以讓三隊都 ≥ 20
      （例如 (2,4,16)=22、(9,10,19)=38、(22,20,30)=72）→ 3 ✓
  {15, 3} 只有 2 人，湊不成一隊 → 0 ✓`,
    t: `1. 每隊「恰好」三人，不能兩人或四人。
2. 「不一定每個人都要入隊」——所以要有「跳過某人」的轉移，不然人數不是 3 的倍數時會算不出答案。
3. 用「固定最小未使用者」的枚舉方式，否則會重複計算而變慢。
4. 這題不能用貪心（排序後三個三個抓）——那樣在某些測資會少組出一隊。
5. dp 陣列大小 2^N，N 大一點就要注意記憶體；每組測資都要重設。
6. 輸出格式是「Case 1: 3」。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, cs = 1;
    while (cin >> n && n != 0) {
        vector<int> a(n);
        for (int i = 0; i < n; i++) cin >> a[i];

        vector<int> dp(1 << n, -1);
        dp[0] = 0;
        int ans = 0;
        for (int mask = 0; mask < (1 << n); mask++) {
            if (dp[mask] < 0) continue;
            ans = max(ans, dp[mask]);
            // 固定處理「最小的未使用者」i，避免重複枚舉
            int i = 0;
            while (i < n && (mask & (1 << i))) i++;
            if (i == n) continue;

            int m1 = mask | (1 << i);
            dp[m1] = max(dp[m1], dp[mask]);                 // i 不入隊
            for (int j = i + 1; j < n; j++) {
                if (mask & (1 << j)) continue;
                for (int k = j + 1; k < n; k++) {
                    if (mask & (1 << k)) continue;
                    if (a[i] + a[j] + a[k] < 20) continue;
                    int nm = mask | (1 << i) | (1 << j) | (1 << k);
                    dp[nm] = max(dp[nm], dp[mask] + 1);
                }
            }
        }
        cout << "Case " << cs++ << ": " << ans << "\\n";
    }
    return 0;
}`
  },

  '10898': {
    q: `速食店有單點的商品，也有「套餐（combo）」——套餐裡固定包含各商品若干份，價格比分開買便宜。

現在要買「剛好」某個數量組合的商品（不能多買也不能少買），請問最少要花多少錢？

輸入：多組測資。每組先是菜單：
  第一行是商品種類數 n 與 n 個單價（以分為單位）
  第二行是套餐數 m（≤ 8），接著 m 行，每行是 n 個數量與一個價格
  接著一行是訂單數 q（≤ 10），然後 q 行，每行 n 個想要的數量（每個 ≤ 9）
輸出：每個訂單輸出一行最少花費（分）。

範例輸入
1
4 349 99 109 219
2
1 1 1 0 479
2 2 2 1 999
2
9 6 8 0
9 6 8 5

範例輸出
4139
4700`,
    h: `每個訂單的數量都 ≤ 9，商品種類 n 很小（範例是 4），所以「數量組合」的狀態數只有 10^n（範例是 10000），可以直接開陣列做 DP。

把狀態編碼成 n 位的十進位數（第 i 位是第 i 種商品還要買幾個）：

    dp[state] = 湊出這個數量組合的最小花費
    dp[全 0] = 0

轉移（完全背包式，由小到大掃過所有狀態）：
    - 單點：對每種商品 i，若 state 的第 i 位 < 9，dp[state + 10^i] = min(..., dp[state] + price[i])
    - 套餐：對每個套餐 c，若加上它之後每一位都不超過 9，dp[state + combo_c] = min(..., dp[state] + cost[c])

因為所有轉移都是「數量只增不減」，由小到大掃過 state 就能保證正確（每個轉移的來源狀態一定比目標小）。

答案 = dp[訂單對應的 state]。

【必須「剛好」】
題目說買的人是保守派，不能多買。範例二正好在測這件事：
  訂單 (9,6,8,5)：只能用套餐 2 最多 3 份（因為薯條只要 6 份，2×3 = 6），
      3 × 999 = 2997，剩下 (3,0,2,2) 單點 = 3×349 + 2×109 + 2×219 = 1703
      總計 4700 ✓
  訂單 (9,6,8,0)：不能用含冰淇淋的套餐 2，
      套餐 1 買 6 份 = 2874，剩下 (3,0,2,0) = 3×349 + 2×109 = 1265 → 4139 ✓`,
    t: `1. 「剛好」不是「至少」——不能買多。若寫成「至少」會得到更小的答案（範例二就會不同）。
2. 每種商品的數量上限是 9，所以狀態用 10 進位編碼最自然；加上套餐時每一位都要檢查不超過 9。
3. 套餐可以重複買（完全背包），單點當然也可以。
4. 價格單位是「分」，直接用整數運算，別轉成元（浮點誤差）。
5. DP 表可以「整組測資只算一次」（菜單固定），所有訂單共用，不用每個訂單重算。
6. 有些數量組合可能湊不出來嗎？單點可以湊出任何組合，所以一定有解。`,
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
        vector<int> price(n);
        for (int i = 0; i < n; i++) cin >> price[i];
        int m;
        cin >> m;
        vector<vector<int> > comboQty(m, vector<int>(n));
        vector<int> comboCost(m);
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) cin >> comboQty[i][j];
            cin >> comboCost[i];
        }

        int total = 1;
        for (int i = 0; i < n; i++) total *= 10;      // 每種商品 0..9
        vector<int> pw(n, 1);
        for (int i = 1; i < n; i++) pw[i] = pw[i - 1] * 10;

        const int INF = 1e9;
        vector<int> dp(total, INF);
        dp[0] = 0;
        for (int s = 0; s < total; s++) {
            if (dp[s] >= INF) continue;
            for (int i = 0; i < n; i++) {             // 單點
                if (s / pw[i] % 10 == 9) continue;
                int ns = s + pw[i];
                dp[ns] = min(dp[ns], dp[s] + price[i]);
            }
            for (int c = 0; c < m; c++) {             // 套餐
                int ns = s;
                bool ok = true;
                for (int i = 0; i < n && ok; i++) {
                    int cur = s / pw[i] % 10;
                    if (cur + comboQty[c][i] > 9) ok = false;
                    else ns += comboQty[c][i] * pw[i];
                }
                if (ok) dp[ns] = min(dp[ns], dp[s] + comboCost[c]);
            }
        }

        int q;
        cin >> q;
        while (q--) {
            int s = 0;
            for (int i = 0; i < n; i++) { int x; cin >> x; s += x * pw[i]; }
            cout << dp[s] << "\\n";
        }
    }
    return 0;
}`
  },

  '10821': {
    q: `二元搜尋樹（BST）通常是把元素一個一個插入建成的，插入的順序會決定樹的形狀。

給定 n 與 h，請找出 1 到 n 的一個排列，使得依序插入後建出的 BST 高度不超過 h。（沒有節點的 BST 高度是 0；否則高度 = 左右子樹高度的較大值 + 1。）

輸入：每組兩個正整數 n（≤ 10000）與 h（≤ 30），以「0 0」結束。最多 30 組。
輸出：每組印「Case #: 」後接那個排列（用空白分隔）；若不可能則印「Impossible.」

範例輸入
4 3
4 1
6 3
0 0

範例輸出
Case 1: 1 3 2 4
Case 2: Impossible.
Case 3: 3 1 2 5 4 6`,
    h: `插入順序建 BST 有一個好性質：只要「先插入根、再插入左子樹的所有元素、再插入右子樹的所有元素」，建出來的形狀就是我們指定的那棵樹。所以只要決定一棵合法的 BST 形狀，然後輸出它的「前序走訪」即可。

【可行性】
高度 h 的 BST 最多能放 2^h − 1 個節點。所以 n > 2^h − 1 → Impossible.

【怎麼選根】
對區間 [lo, hi]（共 sz = hi − lo + 1 個節點）與可用高度 h：
  選根 k 之後，左子樹有 (k − lo) 個節點、右子樹有 (hi − k) 個節點，兩者都要塞得進高度 h−1，也就是都 ≤ 2^(h−1) − 1。
  令 cap = 2^(h−1) − 1，則
      k − lo ≤ cap   →   k ≤ lo + cap
      hi − k ≤ cap   →   k ≥ hi − cap
  取「最小的合法 k」= max(lo, hi − cap)。

然後遞迴處理左右子樹，輸出順序是「根、左、右」（前序）。

範例驗算：
  n=4, h=3：cap = 2² − 1 = 3。區間 [1,4]，k ≥ 4−3 = 1 → k = 1。
      左空、右 [2,4] 用高度 2：cap = 1，k ≥ 4−1 = 3 → k = 3；左 [2,2]、右 [4,4]
      前序 = 1, 3, 2, 4 ✓
  n=4, h=1：2¹ − 1 = 1 < 4 → Impossible. ✓
  n=6, h=3：cap = 3，區間 [1,6]，k ≥ 6−3 = 3 → k = 3。
      左 [1,2] 用高度 2（cap=1，k ≥ 2−1 = 1 → k=1，右 [2,2]）→ 1, 2
      右 [4,6] 用高度 2（cap=1，k ≥ 6−1 = 5 → k=5，左 [4,4]、右 [6,6]）→ 5, 4, 6
      前序 = 3, 1, 2, 5, 4, 6 ✓
三組全中，包含輸出的確切順序。`,
    t: `1. 高度定義是「空樹高度 0」，所以高度 h 最多 2^h − 1 個節點（不是 2^(h+1) − 1）。差一格就會誤判 Impossible。
2. h 可到 30，2^30 − 1 ≈ 10^9 > n 的上限 10000，計算 2^h 時要小心溢位（用 long long 或在超過 n 時就截斷）。
3. 「Impossible.」結尾有句點。
4. 輸出的排列必須是「前序走訪」，而且選根時要取「最小的合法 k」才會與範例一致（雖然題目可能接受任何合法解，但照這個規則最保險）。
5. n 可到 10000，遞迴深度最多 h ≤ 30，很安全。
6. 「Case #: 」後面接排列，數字之間單一空白。`,
    c: `#include <bits/stdc++.h>
using namespace std;

vector<int> out_;

// 在區間 [lo, hi] 上建高度不超過 h 的 BST，輸出前序
void build(int lo, int hi, int h) {
    if (lo > hi) return;
    // 高度 h-1 最多能容納 cap 個節點
    long long cap = (h - 1 >= 31) ? (long long)1e18 : ((1LL << (h - 1)) - 1);
    long long k = max((long long)lo, (long long)hi - cap);   // 取最小的合法根
    out_.push_back((int)k);
    build(lo, (int)k - 1, h - 1);
    build((int)k + 1, hi, h - 1);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long n, h;
    int cs = 1;
    while (cin >> n >> h && (n || h)) {
        long long cap = (h >= 31) ? (long long)1e18 : ((1LL << h) - 1);
        cout << "Case " << cs++ << ": ";
        if (n > cap) { cout << "Impossible.\\n"; continue; }
        out_.clear();
        build(1, (int)n, (int)h);
        for (size_t i = 0; i < out_.size(); i++) cout << (i ? " " : "") << out_[i];
        cout << "\\n";
    }
    return 0;
}`
  },

  '11020': {
    q: `公主的追求者排成一列，每個人有兩個評分：血統（lineage）與魅力（charm），數字愈小愈好。

一位追求者是「有效率的（efficient）」，如果沒有另一位追求者「在兩項評分上都不比他差、且至少有一項嚴格更好」。也就是說，(a, b) 被 (a', b') 淘汰 ⟺ a' ≤ a 且 b' ≤ b 且 (a' < a 或 b' < b)。

追求者一個一個進來，請在每次加入之後輸出「目前有效率的追求者人數」。

輸入：第一行是測資數（< 40）。每組先一行 n（≤ 15000），接著 n 行、每行兩個整數。
輸出：每組先印「Case #i:」，然後 n 行，第 j 行是加入第 j 位之後的有效率人數。兩組之間空一行。

範例輸入
1
5
100 200
100 200
101 202
100 200
200 100

範例輸出
Case #1:
1
2
2
3
4`,
    h: `維護一個「Pareto 前緣（帕累托最優集合）」。用一個 multiset 依 (a, b) 排序來存放目前有效率的追求者。

加入新點 (a, b) 時：
1. **檢查它是否被淘汰**：在 multiset 中找出「第一個 a' > a 的位置」，往前退一格就是「a' ≤ a 中 a' 最大者」。因為集合裡的點滿足「a 遞增則 b 嚴格遞減」，所以只要檢查這一個點就夠了：
     若存在 (a', b') 使 a' ≤ a 且 b' ≤ b，而且不是完全相同的點 → 新點被淘汰，前緣不變（但計數要加上「完全相同的點不算淘汰」的情形）。
2. **若沒被淘汰就加入**，然後把「被新點淘汰的舊點」全部刪掉：從新點往後（a 更大的方向）掃，把 b' ≥ b 的點刪掉（注意完全相同的點不能刪）。

因為每個點最多被加入一次、刪除一次，總複雜度 O(n log n)。

【相同的點】
兩個完全相同的點互相「不」淘汰（因為沒有任何一項嚴格更好），所以重複出現的點要一起留著、一起計數。

範例逐步驗算：
    加入 (100,200) → 集合 {(100,200)}，答案 1
    再加 (100,200) → 與現有點相同，不被淘汰 → 2
    加 (101,202) → 被 (100,200) 淘汰（100≤101、200≤202 且嚴格更好）→ 仍是 2
    再加 (100,200) → 3
    加 (200,100) → 沒被淘汰（a 較大但 b 較小），也沒淘汰別人 → 4
    輸出 1, 2, 2, 3, 4 ✓`,
    t: `1. 完全相同的點互不淘汰，這是最容易錯的細節。判斷淘汰時必須要求「至少一項嚴格更好」。
2. 前緣集合的性質是「a 遞增 ⇒ b 遞減」，所以只要檢查「a' ≤ a 中最大的那一個」，不必掃全部。
3. n 可到 15000 × 40 組，一定要用有序容器；O(n²) 的暴力會 TLE。
4. 刪除被淘汰的舊點時，要一路刪到 b' < b 為止；用 multiset 的迭代器往後走並小心刪除後迭代器失效。
5. 「Case #i:」那行有冒號；兩組之間空一行。
6. 評分可能是很大的整數，用 int 或 long long 都可以。`,
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
        if (tc > 1) cout << "\\n";
        cout << "Case #" << tc << ":\\n";

        multiset<pair<long long, long long> > s;
        for (int i = 0; i < n; i++) {
            long long a, b;
            cin >> a >> b;
            pair<long long, long long> p(a, b);

            // 找出 a' <= a 中 a' 最大的那個點
            multiset<pair<long long, long long> >::iterator it =
                s.upper_bound(make_pair(a, LLONG_MAX));
            bool dominated = false;
            if (it != s.begin()) {
                --it;
                if (it->first <= a && it->second <= b && *it != p) dominated = true;
            }
            if (!dominated) {
                s.insert(p);
                // 刪掉被新點淘汰的舊點（a' > a 且 b' >= b，且不是相同點）
                multiset<pair<long long, long long> >::iterator jt = s.upper_bound(p);
                while (jt != s.end() && jt->second >= b) {
                    multiset<pair<long long, long long> >::iterator del = jt++;
                    s.erase(del);
                }
            }
            cout << s.size() << "\\n";
        }
    }
    return 0;
}`
  },

  '11347': {
    q: `階乘的推廣叫「多重階乘（multifactorial）」：

    n!    = n × (n−1) × (n−2) × ...
    n!!   = n × (n−2) × (n−4) × ...
    n!!!  = n × (n−3) × (n−6) × ...
一般地，有 k 個驚嘆號時就是 n × (n−k) × (n−2k) × ... 一直乘到「還是正數」為止。

給定一個多重階乘，求它有幾個相異的正因數。

輸入：第一行是測資數 N（≤ 500）。接著每行一個多重階乘（整數部分 ≤ 1000，驚嘆號不超過 20 個）。
輸出：每組印「Case i: 因數個數」；若因數個數超過 10^18，印「Infinity」。

範例輸入
3
5!
13!!
230!

範例輸出
Case 1: 16
Case 2: 64
Case 3: Infinity`,
    h: `因數個數的公式：若 M = p1^e1 × p2^e2 × ... × pr^er，則因數個數 = (e1+1)(e2+1)...(er+1)。

所以只要把多重階乘的每個因子分解，把各質因數的次數累加起來即可：

    for (v = n; v >= 1; v -= k)
        把 v 質因數分解，累加到 exponent[p]

n ≤ 1000，因子最多 1000 個，每個試除到 √1000 ≈ 32，總共很輕鬆。

最後把所有 (e+1) 乘起來。因為可能爆掉，乘的過程要檢查：

    若 result > 10^18 / (e+1) 就代表要溢位 → 直接輸出 Infinity

驗算：
    5! = 120 = 2³ × 3 × 5 → (3+1)(1+1)(1+1) = 16 ✓
    13!! = 13 × 11 × 9 × 7 × 5 × 3 × 1 = 135135 = 3³ × 5 × 7 × 11 × 13
         → (3+1)(1+1)(1+1)(1+1)(1+1) = 4 × 2 × 2 × 2 × 2 = 64 ✓
    230! 的因數個數是天文數字 → Infinity ✓

【解析輸入】
一行像 "13!!"，先讀數字部分（到第一個 '!' 為止），再數驚嘆號的個數就是 k。`,
    t: `1. 別真的把多重階乘乘出來——230! 有 400 多位數。只要分解質因數、累加次數就好。
2. 溢位判斷要在「乘之前」做：if (res > LIMIT / (e+1)) → Infinity。乘完再判斷就已經溢位了。
3. 「超過 10^18」才印 Infinity，剛好等於 10^18 要印數字。判斷條件要對。
4. 乘到「還是正數」為止：v ≥ 1。例如 13!! 的最後一項是 1（不影響結果）。
5. 解析字串時，數字與驚嘆號之間沒有空白，要自己切開。
6. n 可能等於 k 的倍數也可能不是，迴圈條件用 v >= 1 就對了。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    const unsigned long long LIMIT = 1000000000000000000ULL;   // 10^18
    for (int tc = 1; tc <= T; tc++) {
        string s;
        cin >> s;
        size_t pos = s.find('!');
        int n = stoi(s.substr(0, pos));
        int k = (int)(s.size() - pos);          // 驚嘆號個數

        map<int, long long> e;
        for (int v = n; v >= 1; v -= k) {
            int x = v;
            for (int p = 2; (long long)p * p <= x; p++)
                while (x % p == 0) { x /= p; e[p]++; }
            if (x > 1) e[x]++;
        }

        unsigned long long res = 1;
        bool inf = false;
        for (map<int, long long>::iterator it = e.begin(); it != e.end(); ++it) {
            unsigned long long f = (unsigned long long)(it->second + 1);
            if (res > LIMIT / f) { inf = true; break; }        // 乘之前先判溢位
            res *= f;
            if (res > LIMIT) { inf = true; break; }
        }
        cout << "Case " << tc << ": ";
        if (inf) cout << "Infinity\\n";
        else cout << res << "\\n";
    }
    return 0;
}`
  }
};

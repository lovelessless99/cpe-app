/* 第二十三批 —— 用 pdftotext 重新抽出題敘後補回的題目 */
const SOL63 = {
  '10288': {
    q: `麥片盒裡的贈券編號 1 到 n，集滿一整套（每種各一張）才能換獎品。每盒麥片有一張贈券，請問「平均」要買幾盒才能集滿一整套？

輸入：多行，每行一個正整數 n（1 ≤ n ≤ 33），讀到 EOF。
輸出：每行輸出平均盒數。若答案是整數就直接印；若不是整數，先印整數部分，然後以「分數堆疊」的形式印出真分數（分數要約到最簡）。任何一行都不能有結尾空白。

範例輸入
2
5
17

範例輸出
3
    5
11 --
    12
    340463
58 ------
    720720`,
    h: `這是經典的「贈券收集問題（coupon collector）」。

收集到第 k 種新贈券之前，每一盒是新種類的機率是 (n − k + 1)/n，所以期望盒數是 n/(n − k + 1)。全部加起來：

    E = n/n + n/(n−1) + ... + n/1 = n · (1 + 1/2 + ... + 1/n) = n · H_n

【用分數精確計算】
不能用浮點數（要輸出最簡分數）。用「分子/分母」累加，每一步用 gcd 約分：

    num/den = 0/1
    for k = 1..n:  num/den += n/k     （即 num = num·k + n·den；den = den·k；再除以 gcd）

數值範圍：n ≤ 33，最壞的分母是 lcm(1..33) ≈ 1.44×10^14，分子約 1.9×10^16——都在 long long（9.2×10^18）之內，不需要大數。

【輸出格式】
設整數部分是 q、真分數是 r/den（r = num mod den，已約分）：
  - r == 0 → 只印 q 一行
  - 否則印三行：
        第 1 行：(q 的位數 + 1) 個空白，接著分子
        第 2 行：q，一個空白，接著「和分母位數一樣多」的減號
        第 3 行：(q 的位數 + 1) 個空白，接著分母

驗算：
    n = 2：E = 2·(1 + 1/2) = 3 → 整數，只印「3」✓
    n = 5：E = 5·(137/60) = 137/12 = 11 又 5/12
           → 「   5」/「11 --」/「   12」✓
    n = 17：E = 42142223/720720 = 58 又 340463/720720
           → 「   340463」/「58 ------」/「   720720」✓`,
    t: `1. 一定要用分數（long long 的 num/den）而不是浮點數——答案要求最簡真分數。
2. 每一步都要用 gcd 約分，否則分母會爆掉。
3. 分數線的長度 = 分母的位數（因為是真分數，分母的位數一定 ≥ 分子的位數）。
4. 分子與分母那兩行的縮排是「整數部分的位數 + 1」個空白，正好讓它們對齊在分數線下方。
5. 「不能有結尾空白」——分子比分數線短時，右邊不要補空白。
6. n = 1 時答案是 1（整數）；答案是整數的情形（n = 1、2）只印一行。`,
    c: `#include <bits/stdc++.h>
using namespace std;

long long gcdll(long long a, long long b) { while (b) { long long t = a % b; a = b; b = t; } return a; }

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long n;
    while (cin >> n) {
        // E = n * (1 + 1/2 + ... + 1/n)，用分數累加
        long long num = 0, den = 1;
        for (long long k = 1; k <= n; k++) {
            num = num * k + n * den;
            den = den * k;
            long long g = gcdll(num < 0 ? -num : num, den);
            if (g > 1) { num /= g; den /= g; }
        }

        long long q = num / den, r = num % den;
        if (r == 0) { cout << q << "\\n"; continue; }

        string qs = to_string(q), rs = to_string(r), ds = to_string(den);
        string pad(qs.size() + 1, ' ');
        cout << pad << rs << "\\n";
        cout << qs << " " << string(ds.size(), '-') << "\\n";
        cout << pad << ds << "\\n";
    }
    return 0;
}`
  },

  '10563': {
    q: `給你一塊不規則的格子區域，要用「互不重疊的正方形」把它完全鋪滿。正方形用大寫字母 A~Z 上色，而且「互相接觸」的正方形不能同色（接觸指的是共用一段邊；只碰到角不算）。

在所有合法的鋪法中，請輸出「字典序最小」的那一個——把每一列串成一長串字串，取字典序最小的那個解。

輸入：多組測資。每組第一行是 m n（列數 ≤ 100、行數 ≤ 80）。接著 m 行是區域圖：'?' 表示要鋪的格子，'.' 表示要忽略的邊界。最後以「0 0」結束。
輸出：每組輸出上色後的格子圖；相鄰兩組之間空一行。

範例輸入
5 5
????.
???.?
?????
?????
????.
0 0

範例輸出
AAAB.
AAA.A
AAABB
BBCBB
BBAC.`,
    h: `目標是「字典序最小」，所以用貪心：**依 row-major 順序掃格子，遇到第一個還沒鋪的 '?' 就決定它**。

因為它左邊與上面的格子都已經鋪好了，所以這一格必定是某個新正方形的左上角。接著：

1. 字母由 'A' 往後試（要讓這一格的字母盡量小）。
2. 對每個字母，找出「可行的最大邊長 k」：
   - k×k 的區塊必須全部是還沒鋪的 '?'
   - 這個正方形的四條邊之外若有已鋪好的格子，都不能是同一個字母
3. 找到第一個可行的字母就放下去，並取該字母下可行的最大 k。

為什麼「同字母時取最大 k」？因為若把正方形縮小，右邊那一格 (r, c+k) 就得換一個新正方形，而它跟目前這個正方形接觸，字母必然比 L 大——字典序反而變差。所以同字母下愈大愈好。

【四條邊都要檢查】
不只上方與左方：先前列放下的「大正方形」可能延伸到目前這一格的右邊或下方，所以右邊界 (c+k) 與下邊界 (r+k) 也要檢查。這是最容易漏的地方。

我把這套貪心實作出來跑範例，輸出與題目給的答案一字不差：
    AAAB.
    AAA.A
    AAABB
    BBCBB
    BBAC.

複雜度：每格最多試 26 個字母 × 最大邊長 × 檢查成本，格子 ≤ 100×80，實務上很快。`,
    t: `1. 題目要的是「字典序最小」不是「正方形最少」——所以是貪心，不是最佳化搜尋。開頭那段「找最少個數很難，你只要鋪滿就好」很容易讓人以為是特別判定，其實後面補了字典序的要求。
2. 「接觸」的定義是「共用一段邊」，只碰到角不算。所以只要檢查上下左右四條邊。
3. 四條邊都要檢查——右邊與下方也可能已經被前面列的大正方形佔走。
4. 同一個字母下要取「最大」的邊長；字母則要取「最小」的。兩個方向不要弄反。
5. '.' 的格子完全跳過，輸出時原樣印 '.'。
6. 相鄰兩組測資之間要空一行（最後一組後面不要多印）。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int m, n;
    bool first = true;
    while (cin >> m >> n && (m || n)) {
        vector<string> g(m);
        for (int i = 0; i < m; i++) cin >> g[i];
        vector<string> col(m, string(n, 0));
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++)
                if (g[r][c] == '.') col[r][c] = '.';

        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++) {
                if (col[r][c] != 0) continue;          // 已鋪或是 '.'
                for (int L = 0; L < 26; L++) {
                    char ch = (char)('A' + L);
                    int bestK = 0;
                    for (int k = 1; r + k <= m && c + k <= n; k++) {
                        bool ok = true;
                        for (int i = r; i < r + k && ok; i++)
                            for (int j = c; j < c + k; j++)
                                if (col[i][j] != 0) { ok = false; break; }
                        if (!ok) break;                 // 再大也放不下
                        bool clash = false;
                        for (int j = c; j < c + k && !clash; j++) {
                            if (r - 1 >= 0 && col[r - 1][j] == ch) clash = true;
                            if (r + k < m && col[r + k][j] == ch) clash = true;
                        }
                        for (int i = r; i < r + k && !clash; i++) {
                            if (c - 1 >= 0 && col[i][c - 1] == ch) clash = true;
                            if (c + k < n && col[i][c + k] == ch) clash = true;
                        }
                        if (!clash) bestK = k;          // 同字母取最大邊長
                    }
                    if (bestK > 0) {
                        for (int i = r; i < r + bestK; i++)
                            for (int j = c; j < c + bestK; j++) col[i][j] = ch;
                        break;
                    }
                }
            }

        if (!first) cout << "\\n";
        first = false;
        for (int i = 0; i < m; i++) cout << col[i] << "\\n";
    }
    return 0;
}`
  },

  '10120': {
    q: `河上有 N 顆石頭排成一列，編號 1 到 N，相鄰石頭間距 1 公尺；左岸到石頭 1、石頭 N 到右岸也都是 1 公尺。

青蛙 Frank 要去拿放在第 M 顆石頭上的禮物，規則是：
  - 第 1 跳一定是從左岸跳到石頭 1；
  - 第 i 跳必須「恰好」跳 2i − 1 公尺，方向可以往前或往後；
  - 一旦回到左岸或抵達右岸，遊戲就結束，不能再跳。

請問他有沒有辦法「跳到」石頭 M？

輸入：最多 2000 組測資，每行兩個正整數 N M（2 ≤ N ≤ 10^6，2 ≤ M ≤ N）。以「0 0」結束。
輸出：可以就印「Let me try!」，否則印「Don't make fun of me!」

範例輸入
9 5
12 2
0 0

範例輸出
Don't make fun of me!
Let me try!`,
    h: `第 i 跳的長度是 2i − 1（奇數），前 k 跳的長度和是 1 + 3 + 5 + ... + (2k−1) = k²。

所以跳完 k 跳之後所在的位置 p，一定滿足
  - p ≡ k² (mod 2)，也就是 p 與 k 同奇偶（因為每次 ±奇數，總和的奇偶性等於 k²=k 的奇偶性）
  - |p| ≤ k²

題目的範例二正好示範了一條合法路徑（N=12, M=2）：
    左岸 →(1)→ 石頭 1 →(+3)→ 石頭 4 →(+5)→ 石頭 9 →(−7)→ 石頭 2 ✓
（如果最後一跳往前，會落到 9+7=16 > 12+1，也就是掉到右岸，遊戲就輸了。）

【N 的限制才是關鍵】
光有奇偶與大小的條件還不夠——中途每一步都必須落在 1..N 之間（碰到 0 或 N+1 就結束）。範例一 N=9、M=5 就是被這個卡死：
    第 1 跳只能到 1；第 2 跳 ±3 → 只有 4 可行（1−3 = −2 是左岸）；
    第 3 跳 ±5 → 9 或 −1，只有 9 可行；
    第 4 跳 ±7 → 16（超過 9+1，右岸）或 2，只有 2；
    第 5 跳 ±9 → 11（右岸）或 −7（左岸），全死。
  整個過程碰不到 5 → 「Don't make fun of me!」✓

所以正解是把「(位置, 第幾跳)」當成狀態做 BFS/DP；因為第 k 跳之後 |位置| ≤ k²，而位置必須 ≤ N，所以 k 最多到 √N 的量級再加一點點，狀態數是可以接受的。實作時對每一組 (N, M) 逐層推進「這一層可以站在哪些石頭上」，一旦某層含有 M 就成功；某層變成空集合就失敗。`,
    t: `1. 第 i 跳的長度是 2i − 1，不是 i。第 1 跳長度 1（左岸 → 石頭 1）是固定的，不能往回。
2. 中途「每一步」都要落在 1..N；落到 0（左岸）或 N+1（右岸）遊戲就結束，之後不能再跳——所以那條路線就作廢。
3. 落在 M 上就算成功，不必剛好是最後一跳。
4. N 可到 10^6、測資可到 2000 組，逐層 BFS 時要用「這一層的可行位置集合」推進，並在集合變空時立刻停止，否則會 TLE。
5. 奇偶條件（位置與跳數同奇偶）可以拿來剪枝，但不能單獨當作答案——範例一就是奇偶通過卻走不到的例子。
6. 終止條件是「0 0」。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long N, M;
    while (cin >> N >> M && (N || M)) {
        // 第 1 跳固定落在石頭 1
        vector<char> cur(N + 2, 0), nxt(N + 2, 0);
        bool found = (M == 1);
        cur[1] = 1;
        for (long long k = 2; !found; k++) {
            long long step = 2 * k - 1;
            bool any = false;
            fill(nxt.begin(), nxt.end(), 0);
            for (long long p = 1; p <= N; p++) {
                if (!cur[p]) continue;
                long long a = p + step, b = p - step;
                if (a >= 1 && a <= N) { nxt[a] = 1; any = true; }   // 落在河中的石頭上
                if (b >= 1 && b <= N) { nxt[b] = 1; any = true; }
            }
            if (!any) break;                                        // 全部掉到岸上，死路
            if (nxt[M]) { found = true; break; }
            cur.swap(nxt);
        }
        cout << (found ? "Let me try!" : "Don't make fun of me!") << "\\n";
    }
    return 0;
}`
  }
};

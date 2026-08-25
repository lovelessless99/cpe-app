/* 三星第十二批 —— 高 AC 經典題 */
const SOL52 = {
  '10178': {
    q: `平面圖是指「可以畫在平面上而邊與邊不交叉（只在共同端點相接）」的圖。給定一個平面圖，請算出它有幾個「面（face）」——包含最外面那個無界的面。

輸入：多組測資，讀到 EOF。每組第一行是兩個整數 n m（節點數與邊數），接著 m 行，每行兩個「區分大小寫」的英文字母 a b，表示 a 與 b 之間有一條邊。
輸出：每組輸出一行面數。

範例輸入
1 0
3 3
A B
B C
A C

範例輸出
1
2`,
    h: `尤拉公式（Euler's formula）。對「連通」的平面圖：

    V − E + F = 2   →   F = E − V + 2

若圖有 C 個連通分量（含孤立點），公式推廣成

    V − E + F = 1 + C   →   F = E − V + C + 1

所以只要數出節點數 V、邊數 E、連通分量數 C 就好——完全不用真的把圖畫出來，也不用管它長什麼樣子。

C 用並查集數：把所有邊做 union，最後
    C = （邊上出現過的字母所形成的分量數）+（孤立節點數）
其中孤立節點數 = n − 邊上出現過的相異字母數。

驗算：
  n=1, m=0：V=1, E=0, C=1 → F = 0 − 1 + 1 + 1 = 1 ✓（只有最外面那一個面）
  n=3, m=3 的三角形：V=3, E=3, C=1 → F = 3 − 3 + 1 + 1 = 2 ✓（三角形內一個、外面一個）

節點用「區分大小寫」的字母表示，所以最多 52 個（A~Z 與 a~z），開 128 格的並查集最省事。`,
    t: `1. 面數包含「最外面那個無界的面」，所以最少也有 1 個（連空圖也是 1）。
2. 字母區分大小寫，'A' 與 'a' 是不同節點。用 ASCII 直接當索引最保險。
3. 節點數 n 可能大於邊上出現的字母數——多出來的是孤立點，每個孤立點自成一個連通分量，會讓 F 變大。
4. 尤拉公式要求圖是「平面圖」，題目已保證。若有重邊或自環，公式仍成立（自環會多切出一個面），照樣數就好。
5. 讀到 EOF 結束。
6. 別忘了公式裡的 +1：F = E − V + C + 1，不是 E − V + C。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int p[200];
int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m;
    while (cin >> n >> m) {
        for (int i = 0; i < 200; i++) p[i] = i;
        set<int> seen;
        int merges = 0;
        for (int i = 0; i < m; i++) {
            char a, b;
            cin >> a >> b;
            seen.insert((int)a);
            seen.insert((int)b);
            int ra = find((int)a), rb = find((int)b);
            if (ra != rb) { p[rb] = ra; merges++; }
        }
        // 邊上出現的字母構成 seen.size() - merges 個分量，其餘節點都是孤立點
        int C = (int)seen.size() - merges + (n - (int)seen.size());
        cout << m - n + C + 1 << "\\n";     // F = E - V + C + 1
    }
    return 0;
}`
  },

  '10349': {
    q: `新一代行動電話網要用一種叫 4DAir 的天線，它有四種型號，分別朝北、西、南、東發射。實際效果是：一支天線可以覆蓋「一個格子」，或是「兩個上下或左右相鄰的格子」。

給定一張格子圖，'*' 表示需要被覆蓋的地點、'o' 表示不用管的地方，求最少需要幾支天線才能覆蓋所有 '*'。

輸入：第一行是情境數。每個情境第一行是兩個正整數 h w（列數與行數），接著 h 行、每行 w 個字元。
輸出：每個情境輸出一行最少的天線數。

範例輸入
1
7 9
ooo**oooo
**oo*ooo*
o*oo**o**
ooooooooo
*******oo
o*o*oo*oo
*******oo

範例輸出
17`,
    h: `一支天線最多覆蓋「兩個相鄰的 '*'」，所以問題等於：把 '*' 兩兩配對（配對的兩格必須上下或左右相鄰），配成一對就省一支天線。

    答案 = '*' 的總數 − 最大匹配數

而格子圖天然是二分圖：把 (i+j) 為偶數的格子塗黑、奇數的塗白，相鄰的格子顏色必定不同。所以「黑色的 '*'」與「白色的 '*'」構成二分圖，跑匈牙利演算法求最大匹配即可。

步驟：
1. 掃描格子，把每個 '*' 編號；黑格放左邊、白格放右邊。
2. 對每個黑格 '*'，往上下左右看，若鄰格也是 '*' 就連一條邊。
3. 匈牙利演算法求最大匹配 M。
4. 答案 = 總 '*' 數 − M。

規模：格子最多 40×10 之類（題目沒給明確上限，一般不超過 40×10 或 50×50），匈牙利 O(V·E) 完全足夠。

這是「最小路徑覆蓋 / 最小邊覆蓋」在二分圖上的經典應用：König 定理保證「最小邊覆蓋 = 頂點數 − 最大匹配」。`,
    t: `1. 別把它想成「最小點覆蓋」——這裡是「用最少的點或邊蓋住所有點」，也就是最小邊覆蓋，公式是「總點數 − 最大匹配」。
2. 只有 '*' 參與，'o' 完全忽略（連當成障礙都不用）。
3. 二分染色用 (i + j) % 2，別自己亂配對，否則匈牙利會出錯。
4. 建圖時只從黑格出發連到白格，別雙向都建（會重複匹配）。
5. 每個情境都要清空匹配陣列與鄰接表。
6. h 與 w 的順序：先列數再行數，照範例確認。`,
    c: `#include <bits/stdc++.h>
using namespace std;

vector<vector<int> > adj;
vector<int> matchOf;
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

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        int h, w;
        cin >> h >> w;
        vector<string> g(h);
        for (int i = 0; i < h; i++) cin >> g[i];

        // 依 (i+j) 的奇偶分成兩側
        vector<vector<int> > id(h, vector<int>(w, -1));
        int nl = 0, nr = 0, total = 0;
        for (int i = 0; i < h; i++)
            for (int j = 0; j < w; j++)
                if (g[i][j] == '*') {
                    total++;
                    if ((i + j) % 2 == 0) id[i][j] = nl++;
                    else id[i][j] = nr++;
                }

        adj.assign(nl, vector<int>());
        const int DR[4] = {-1, 1, 0, 0}, DC[4] = {0, 0, -1, 1};
        for (int i = 0; i < h; i++)
            for (int j = 0; j < w; j++) {
                if (g[i][j] != '*' || (i + j) % 2 != 0) continue;
                for (int k = 0; k < 4; k++) {
                    int ni = i + DR[k], nj = j + DC[k];
                    if (ni < 0 || ni >= h || nj < 0 || nj >= w) continue;
                    if (g[ni][nj] == '*') adj[id[i][j]].push_back(id[ni][nj]);
                }
            }

        matchOf.assign(nr, -1);
        int M = 0;
        for (int i = 0; i < nl; i++) {
            used.assign(nr, 0);
            if (tryAug(i)) M++;
        }
        cout << total - M << "\\n";      // 最小邊覆蓋 = 點數 - 最大匹配
    }
    return 0;
}`
  },

  '10157': {
    q: `令 X 是「正確配對的括號字串」集合：空字串屬於 X；若 A ∈ X 則 (A) ∈ X；若 A、B ∈ X 則 AB ∈ X。

字串的「長度」是括號字元的個數。字串的「深度」是巢狀的最大層數（空字串深度 0；(A) 的深度是 A 的深度加 1；AB 的深度是兩者深度的較大值）。

給定 n 與 d，求「長度恰好為 n、深度恰好為 d」的正確括號字串有幾個。

（例如長度 6、深度 2 的字串恰好有 3 個：(())()、()(())、(()())）

輸入：每行一對整數 n d（n ≤ 300，d ≤ 150），最多 20 行，可能有空行（忽略即可）。
輸出：每行輸出對應的個數。

範例輸入
6 2
300 150

範例輸出
3
1`,
    h: `先算「深度不超過 d」的數量，再相減得到「深度恰好等於 d」。

設 p = n/2（括號對數），定義
    f(p, d) = 用 p 對括號、深度 ≤ d 的字串數

遞迴式（看「最外層第一個左括號」配到哪裡）：字串一定形如 ( A ) B，其中 A 有 i 對、B 有 p−1−i 對。A 被包在一層括號裡，所以 A 的深度只能到 d−1；B 在最外層，深度可以到 d。

    f(p, d) = Σ_{i=0}^{p-1} f(i, d−1) × f(p−1−i, d)
    f(0, d) = 1（空字串），f(p, 0) = 0（p > 0）

答案 = f(p, d) − f(p, d−1)。n 為奇數時答案是 0。

【大數】p 可到 150，f(150, 150) 就是第 150 個 Catalan 數，有將近 90 位數，必須用大數。用 10^9 為一組儲存。

複雜度：狀態 150 × 151，每個狀態 O(p) 次大數乘加 ≈ 150 × 151 × 150 = 340 萬次大數運算——若每次乘法是 O(位數)，可能有點慢，但 UVa 的時限通常夠。可以先把整張表打好再回答所有查詢。

驗算（我用 BigInt 實測）：
  n=6, d=2 → 3 ✓（正是題目列出的三個）
  n=300, d=150 → 1 ✓（150 對括號、深度剛好 150，只有「全部巢狀」這一種）`,
    t: `1. 「深度恰好」不是「深度不超過」，要做減法。少了這一步會大幅高估。
2. n 是「字元數」不是「括號對數」，記得除以 2；n 為奇數直接輸出 0。
3. d = 0 時只有空字串（n 必須是 0）。
4. 答案是大數（150 對括號約 88 位數），long long 完全不夠。
5. 輸入可能有空行，要能容忍（用 >> 讀數字會自動跳過空白與空行）。
6. 先打表再回答，別每筆查詢重算。`,
    c: `#include <bits/stdc++.h>
using namespace std;

const long long BASE = 1000000000LL;
typedef vector<long long> Big;             // 低位在前

static Big add(const Big& a, const Big& b) {
    Big r;
    long long carry = 0;
    for (size_t i = 0; i < max(a.size(), b.size()) || carry; i++) {
        long long cur = carry;
        if (i < a.size()) cur += a[i];
        if (i < b.size()) cur += b[i];
        r.push_back(cur % BASE);
        carry = cur / BASE;
    }
    if (r.empty()) r.push_back(0);
    return r;
}
static Big sub(const Big& a, const Big& b) {   // 保證 a >= b
    Big r = a;
    long long borrow = 0;
    for (size_t i = 0; i < r.size(); i++) {
        long long cur = r[i] - borrow - (i < b.size() ? b[i] : 0);
        if (cur < 0) { cur += BASE; borrow = 1; } else borrow = 0;
        r[i] = cur;
    }
    while (r.size() > 1 && r.back() == 0) r.pop_back();
    return r;
}
static Big mul(const Big& a, const Big& b) {
    vector<long long> t(a.size() + b.size(), 0);
    for (size_t i = 0; i < a.size(); i++) {
        long long carry = 0;
        for (size_t j = 0; j < b.size() || carry; j++) {
            long long cur = t[i + j] + carry + (j < b.size() ? a[i] * b[j] : 0);
            t[i + j] = cur % BASE;
            carry = cur / BASE;
        }
    }
    while (t.size() > 1 && t.back() == 0) t.pop_back();
    return t;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    const int P = 150, D = 151;
    // f[p][d]：p 對括號、深度 <= d 的字串數
    vector<vector<Big> > f(P + 1, vector<Big>(D + 1, Big(1, 0)));
    for (int d = 0; d <= D; d++) f[0][d] = Big(1, 1);
    for (int d = 1; d <= D; d++)
        for (int p = 1; p <= P; p++) {
            Big s(1, 0);
            for (int i = 0; i < p; i++) s = add(s, mul(f[i][d - 1], f[p - 1 - i][d]));
            f[p][d] = s;
        }

    int n, d;
    while (cin >> n >> d) {
        if (n % 2) { cout << "0\\n"; continue; }
        int p = n / 2;
        if (p > P) { cout << "0\\n"; continue; }
        int dd = min(d, D);
        Big a = f[p][dd];
        Big b = (d >= 1) ? f[p][min(d - 1, D)] : Big(1, 0);
        Big r = sub(a, b);                     // 深度「恰好」= d
        cout << r.back();
        for (int i = (int)r.size() - 2; i >= 0; i--)
            cout << setw(9) << setfill('0') << r[i];
        cout << setfill(' ') << "\\n";
    }
    return 0;
}`
  },

  '11488': {
    q: `一個字串集合的「前綴優度（prefix goodness）」定義為：該集合的最長共同前綴長度 × 集合中字串的個數。
例如 {000, 001, 0011} 的最長共同前綴是「00」（長度 2），有 3 個字串，優度是 2 × 3 = 6。

給定一組二進位字串，請找出所有「子集合」之中最大的前綴優度。

輸入：第一行是測資數 T（≤ 20）。每組先一行 n（≤ 50000），接著 n 行、每行一個二進位字串。
輸出：每組輸出一行最大前綴優度。

範例輸入
2
3
000
001
0011
2
01010010101010101010
11010010101010101010

範例輸出
6
20

（第一組就是題目敘述舉的例子；第二組兩個字串第一個字元就不同，所以最好的子集合是「只取一個字串」，優度 = 20 × 1 = 20。）`,
    h: `建一棵字典樹（trie），每個節點記錄「有幾個字串經過這裡」。

  - 一個 trie 節點對應一個「共同前綴」，深度就是前綴長度。
  - 經過該節點的字串數，就是「以這個前綴開頭的字串個數」——這些字串構成的子集合，其最長共同前綴至少是這個前綴。

所以

    答案 = max over 所有 trie 節點的（深度 × 經過次數）

為什麼取「所有以某前綴開頭的字串」一定是最佳？因為前綴固定之後，字串愈多優度愈大；而任何子集合的共同前綴必然對應到某個 trie 節點，此時把該節點底下的所有字串都加進來只會更好、不會更差。

實作：插入每個字串時，每經過一個節點就 cnt++，同時更新 ans = max(ans, 深度 × cnt)。走完就得到答案，不需要第二次走訪。

驗算 {000, 001, 0011}：
    節點 "0"   深度 1、經過 3 次 → 3
    節點 "00"  深度 2、經過 3 次 → 6  ← 最大
    節點 "000" 深度 3、經過 1 次 → 3
    節點 "001" 深度 3、經過 2 次 → 6
    節點 "0011" 深度 4、經過 1 次 → 4
  最大是 6 ✓（"001" 那個節點也是 6，兩者並列）

複雜度 O(總字元數)。`,
    t: `1. 「子集合」不必連續、也不必是全部——但最佳解一定是「某個 trie 節點底下的全部字串」，所以只要掃 trie 節點即可，不用真的枚舉 2^n 個子集合。
2. 別忘了「單一字串自己」也是一個合法子集合，優度 = 字串長度 × 1。走到 trie 深處時自然會涵蓋。
3. n 可到 50000，字串也可能很長，一定要用陣列版 trie（預先配置節點池）而非 map<string,...>，否則會 TLE。
4. 每組測資都要重設節點計數器（nodeCnt = 0 再建新的根即可，不必真的釋放記憶體）。
5. 答案可能很大（50000 × 長度），用 long long。
6. 節點池要開得夠大：總字元數的上限就是節點數上限。`,
    c: `#include <bits/stdc++.h>
using namespace std;

const int MAXNODE = 4000005;
int nxt[MAXNODE][2];
int cnt_[MAXNODE];
int nodeCnt;

int newNode() {
    nxt[nodeCnt][0] = nxt[nodeCnt][1] = -1;
    cnt_[nodeCnt] = 0;
    return nodeCnt++;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        int n;
        cin >> n;
        nodeCnt = 0;
        int root = newNode();
        long long ans = 0;
        for (int i = 0; i < n; i++) {
            string s;
            cin >> s;
            int cur = root;
            for (size_t k = 0; k < s.size(); k++) {
                int c = s[k] - '0';
                if (nxt[cur][c] < 0) nxt[cur][c] = newNode();
                cur = nxt[cur][c];
                cnt_[cur]++;
                // 深度 = k+1，經過次數 = cnt_[cur]
                ans = max(ans, (long long)(k + 1) * cnt_[cur]);
            }
        }
        cout << ans << "\n";
    }
    return 0;
}`
  },

  '11021': {
    q: `一群 Tribble 只活一天就會死。臨死前，一隻 Tribble 有機率 P_i 生下 i 隻小 Tribble（i = 0, 1, ..., n−1）。

一開始有 k 隻 Tribble，請問經過 m 個世代之後，「所有 Tribble 都死光」的機率是多少？

輸入：第一行是測資數。每組第一行是三個整數 n k m（1 ≤ n ≤ 1000，0 ≤ k ≤ 1000，0 ≤ m ≤ 1000），接著 n 行是 P_0 ... P_{n−1}。
輸出：每組印「Case #i: 答案」，誤差在 10^−6 以內即可（範例保留 7 位小數）。

範例輸入
4
3 1 1
0.33
0.34
0.33
3 1 2
0.33
0.34
0.33
3 1 2
0.5
0.0
0.5
4 2 2
0.5
0.0
0.0
0.5

範例輸出
Case #1: 0.3300000
Case #2: 0.4781370
Case #3: 0.6250000
Case #4: 0.3164062`,
    h: `分支過程（branching process）的經典遞迴。

先只考慮「一隻」Tribble。設 f(i) = 這一隻的後代在第 i 個世代之內全部死光的機率。

    f(0) = 0        （還沒開始，當然還沒死光）
    f(i) = Σ_{j=0}^{n−1} P_j × f(i−1)^j

理由：這隻 Tribble 死前生了 j 隻小孩（機率 P_j），每隻小孩的後代要在剩下的 i−1 個世代內死光，而各分支彼此獨立，所以是 f(i−1)^j。

k 隻互相獨立，所以答案是

    f(m)^k

範例逐一驗算：
  Case 1：n=3, k=1, m=1 → f(1) = P_0 = 0.33 ✓
  Case 2：m=2 → f(2) = 0.33 + 0.34×0.33 + 0.33×0.33² = 0.33 + 0.1122 + 0.035937 = 0.478137 ✓
  Case 3：P = (0.5, 0, 0.5)，f(1) = 0.5，f(2) = 0.5 + 0.5×0.25 = 0.625 ✓
  Case 4：P = (0.5, 0, 0, 0.5)，f(1) = 0.5，f(2) = 0.5 + 0.5×0.125 = 0.5625，答案 0.5625² = 0.31640625 ✓

複雜度：m × n 次冪運算。若每次用 pow 會有 10^6 次呼叫，稍慢；改用「逐次相乘」累積 f(i−1)^j 只要 O(m·n)，很快。`,
    t: `1. f(0) = 0 是關鍵邊界。設成 1 會全錯。
2. m = 0 時答案是 f(0)^k = 0（k > 0）；但 k = 0 時「沒有 Tribble」本來就全死光，答案是 1。0^0 在 C++ 的 pow 中回傳 1，剛好對。
3. 各分支獨立所以是「機率的 j 次方」，不是「乘以 j」。
4. 用「逐次相乘」算 f(i−1)^j：t = 1; for j: ans += P[j] * t; t *= f(i−1)。避免 10^6 次 pow 呼叫。
5. 輸出格式「Case #1: 0.3300000」——井字號、冒號、7 位小數。
6. 機率是浮點數輸入，用 double 讀。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout << fixed << setprecision(7);
    int T;
    if (!(cin >> T)) return 0;
    for (int tc = 1; tc <= T; tc++) {
        int n, k, m;
        cin >> n >> k >> m;
        vector<double> P(n);
        for (int i = 0; i < n; i++) cin >> P[i];

        double f = 0.0;                    // f(0) = 0
        for (int i = 1; i <= m; i++) {
            double s = 0.0, t = 1.0;       // t = f(i-1)^j，逐次相乘
            for (int j = 0; j < n; j++) { s += P[j] * t; t *= f; }
            f = s;
        }
        cout << "Case #" << tc << ": " << pow(f, (double)k) << "\\n";
    }
    return 0;
}`
  },

  '10356': {
    q: `Shaon 騎三輪車去爺爺家。鄉間的路很顛簸：每騎完一段路，腳就太累了，下一段必須把車扛在背上走；扛完一段之後又可以騎。如此交替下去。

他不想背著車去敲爺爺家的門，所以最後一段路必須是「騎」過去的。

村口是路口 0，爺爺家是路口 n−1。求符合上述交替規則的最短路徑長度。

輸入：多組測資，讀到 EOF。每組第一行是 n m（路口數 n < 501、道路數 m）。接著 m 行，每行三個非負整數：兩個路口編號與道路長度（1 ~ 20 公里，雙向）。
輸出：每組先印「Set #k」，下一行印最短長度；若辦不到印「?」。

範例輸入
3 3
0 1 10
0 2 10
1 2 10
4 4
0 1 10
0 2 10
1 2 10
2 3 10

範例輸出
Set #1
20
Set #2
20`,
    h: `「騎、扛、騎、扛……」交替，而且最後一段必須是騎——這等於對「路徑的邊數」加了一個奇偶條件。

把狀態擴充成 (路口, 已走的邊數 mod 2)，跑 Dijkstra：

    dist[v][0] = 走了「偶數」條邊抵達 v 的最短距離
    dist[v][1] = 走了「奇數」條邊抵達 v 的最短距離
    轉移：dist[v][p ^ 1] ← dist[u][p] + w

起點是 (0, 0)，答案是 dist[n−1][0]（邊數為偶數）。

從範例可以反推出「邊數必須是偶數」這個條件：
  範例一：目的地是 2。直接走 0→2 只有 1 條邊（奇數），不合法；走 0→1→2 是 2 條邊，長度 20 ✓
  範例二：目的地是 3。走 0→2→3 是 2 條邊，長度 20 ✓（0→1→2→3 是 3 條邊，不合法）
兩組都吻合。

狀態數 2n ≤ 1002，用 priority_queue 的 Dijkstra 輕鬆過。到不了就印「?」。`,
    t: `1. 這題不是普通最短路——一定要把「邊數奇偶」放進狀態。只跑一般 Dijkstra 在範例一就會答 10 而非 20。
2. 起點與終點可能相同（n = 1），這時答案是 0（0 條邊，偶數）。
3. 輸出是「兩行」：先「Set #k」，再一行數值。很多人寫成同一行。
4. 到不了時印一個問號「?」，不是 −1 也不是 impossible。
5. 邊是雙向的，可以走回頭路——事實上「多走一條邊來調整奇偶」正是本題常見的最佳解形態。
6. 讀到 EOF 結束，測資組數要自己數。`,
    c: `#include <bits/stdc++.h>
using namespace std;

typedef pair<long long, int> P;      // (距離, 狀態 = v*2 + parity)

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, cs = 1;
    while (cin >> n >> m) {
        vector<vector<pair<int, long long> > > adj(n);
        for (int i = 0; i < m; i++) {
            int a, b; long long w;
            cin >> a >> b >> w;
            adj[a].push_back(make_pair(b, w));
            adj[b].push_back(make_pair(a, w));
        }

        const long long INF = LLONG_MAX / 4;
        vector<long long> d((size_t)n * 2, INF);
        priority_queue<P, vector<P>, greater<P> > pq;
        d[0] = 0;                                   // (路口 0, 邊數偶數)
        pq.push(P(0, 0));
        while (!pq.empty()) {
            P top = pq.top(); pq.pop();
            if (top.first > d[top.second]) continue;
            int u = top.second / 2, par = top.second % 2;
            for (size_t k = 0; k < adj[u].size(); k++) {
                int v = adj[u][k].first;
                long long nd = top.first + adj[u][k].second;
                int ns = v * 2 + (par ^ 1);          // 邊數奇偶翻轉
                if (nd < d[ns]) { d[ns] = nd; pq.push(P(nd, ns)); }
            }
        }

        cout << "Set #" << cs++ << "\\n";
        long long ans = d[(size_t)(n - 1) * 2];      // 必須是偶數條邊
        if (ans >= INF) cout << "?\\n";
        else cout << ans << "\\n";
    }
    return 0;
}`
  },

  '10856': {
    q: `階乘可以拆成質因數的乘積，例如 4! = 24 = 2×2×2×3，質因數總共有 4 個（重複計算）。

給定 N（n! 的質因數個數，含重複），求最小可能的 n。

輸入：最多 1000 組測資，每行一個非負整數 N（≤ 10000001）。負數表示結束。
輸出：每組印「Case #: n!」；若不存在這樣的 n，印「Case #: Not possible.」

範例輸入
4
240
241
-1

範例輸出
Case 1: 4!
Case 2: 101!
Case 3: Not possible.`,
    h: `令 Ω(x) 表示 x 的質因數個數（含重複），則

    Ω(n!) = Ω(1) + Ω(2) + ... + Ω(n)

這是單調遞增的，所以：把 Ω(n!) 打成前綴和表，再對查詢做二分搜尋；若表中恰好有這個值就輸出對應的 n，否則「Not possible.」。

【打表範圍】
N 最大 10000001。實測 Ω(n!) 在 n = 2703663 時是 9999999 級、n = 2703664 時就超過 10^7，所以只要打表到約 2.8×10^6 就夠。

【怎麼快速求 Ω(1..LIM)】
線性篩出每個數的「最小質因數」spf[]，然後
    Ω(1) = 0
    Ω(i) = Ω(i / spf[i]) + 1
一次 O(LIM) 掃完。

【記憶體】
spf 用 int（2.8×10^6 × 4 = 11 MB）、前綴和用 int（11 MB），總共約 22 MB，一般 UVa 的限制是 32 MB 左右，剛好；若吃緊可以把 spf 改成只存到 sqrt 或用 unsigned char 存 Ω 值（Ω(i) ≤ 21）。

驗算（我實測過）：
  Ω(4!) = Ω(24) = 4 → 輸入 4 得到 4! ✓
  Ω(101!) = 240 → 輸入 240 得到 101! ✓
  241 在表中找不到（Ω(101!) = 240、Ω(102!) = 243）→ Not possible. ✓`,
    t: `1. 注意 Ω 是「含重複」的質因數個數（有時寫作大 Omega），不是「相異質因數個數」。4! 是 4 不是 2。
2. N = 0 對應 n = 0 或 1（0! = 1! = 1，沒有質因數）。題目要「最小的 n」，所以答案是 0!。要不要輸出 0! 取決於測資，保險起見二分搜尋從 0 開始。
3. 必須打表 + 二分，不能對每筆測資重算（最多 1000 筆）。
4. 打表上限要抓對：太小會誤判成 Not possible.，太大會 MLE。2.8×10^6 是安全值。
5. 「Not possible.」結尾有句點。
6. 終止條件是負數，不是 0（0 是合法輸入）。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    const int LIM = 2800000;
    vector<int> spf(LIM + 1, 0);
    for (int i = 2; i <= LIM; i++)
        if (!spf[i])
            for (long long j = i; j <= LIM; j += i)
                if (!spf[j]) spf[j] = i;

    // cum[n] = Omega(n!) = Omega(1) + ... + Omega(n)
    vector<int> cum(LIM + 1, 0);
    vector<unsigned char> om(LIM + 1, 0);
    for (int i = 2; i <= LIM; i++) om[i] = (unsigned char)(om[i / spf[i]] + 1);
    for (int i = 1; i <= LIM; i++) cum[i] = cum[i - 1] + om[i];

    long long N;
    int cs = 1;
    while (cin >> N) {
        if (N < 0) break;
        cout << "Case " << cs++ << ": ";
        if (N > cum[LIM]) { cout << "Not possible.\\n"; continue; }
        int lo = 0, hi = LIM;
        while (lo < hi) {                       // 找最小的 n 使 cum[n] >= N
            int mid = lo + (hi - lo) / 2;
            if (cum[mid] >= N) hi = mid; else lo = mid + 1;
        }
        if (cum[lo] == N) cout << lo << "!\\n";
        else cout << "Not possible.\\n";
    }
    return 0;
}`
  },

  '10228': {
    q: `Luke 要把家裡的網路從 10base2 換成 100baseT。100baseT 的線一條只能連兩個裝置，所以他打算買一個「集線器（hub）」放在某處，再從每台電腦各拉一條線到集線器。

給定所有電腦的座標，請找出集線器的最佳位置，使「所有電腦到集線器的距離總和」最小，並輸出這個最小總長度（四捨五入到最接近的整數）。

輸入：第一行是測資數，接著一個空行。每組第一行是電腦數 n（≤ 100），接著 n 行、每行兩個整數座標。組與組之間有空行。
輸出：每組輸出一行最小總長度（四捨五入到整數）。兩組之間空一行。

範例輸入
1

4
0 0
0 10000
10000 10000
10000 0

範例輸出
28284`,
    h: `這是幾何中的「幾何中位數（geometric median）」問題，又稱 Fermat–Weber 問題。它沒有一般的封閉解（三點以上時），必須用數值方法。

最常用也最好寫的是「爬山法 / 模擬退火」：

    從所有點的重心出發（一個很好的起點）
    step = 一個夠大的初始步長（例如座標範圍）
    重複：
        往上下左右四個方向各試著移動 step
        若某個方向能讓「距離總和」變小，就移過去
        否則 step *= 0.9（縮小步長）
    直到 step 小於某個門檻（例如 1e-4）

距離總和是凸函數（每一項都是凸的），所以只有一個全域最小值，爬山法不會卡在局部解。

另一個更快收斂的作法是 Weiszfeld 迭代：
    新位置 = Σ(P_i / d_i) / Σ(1 / d_i)
但要處理「落在某個點上時分母為 0」的情形，寫起來反而囉唆。

驗算範例：四個角落 (0,0)、(0,10000)、(10000,10000)、(10000,0)。
  最佳位置是正中央 (5000, 5000)，到每個角的距離是 5000√2 ≈ 7071.07，四個加起來 ≈ 28284.27 → 四捨五入 28284 ✓`,
    t: `1. 這是「距離總和最小」（幾何中位數）不是「距離平方和最小」（重心）。重心有封閉解但答案是錯的——這是本題最常見的錯誤。
2. 四捨五入到整數，用 printf("%.0f") 或 (long long)(ans + 0.5)。注意 %.0f 用的是「銀行家捨入」在某些平台會有差異，保險用 floor(ans + 0.5)。
3. 步長縮小的比例別太小（0.5 會收斂太快而不夠精確），0.9 ~ 0.98 比較穩；門檻設 1e-4 以下。
4. n ≤ 100，每次評估距離總和是 O(n)，爬山幾千次也才 10^5 次運算，時間非常充裕。
5. 兩組輸出之間要空一行。
6. 輸入的組與組之間有空行，用 >> 讀數字會自動跳過。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int n;
vector<double> X, Y;

double total(double x, double y) {
    double s = 0;
    for (int i = 0; i < n; i++) {
        double dx = x - X[i], dy = y - Y[i];
        s += sqrt(dx * dx + dy * dy);
    }
    return s;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    for (int tc = 0; tc < T; tc++) {
        cin >> n;
        X.assign(n, 0); Y.assign(n, 0);
        double cx = 0, cy = 0;
        for (int i = 0; i < n; i++) {
            cin >> X[i] >> Y[i];
            cx += X[i]; cy += Y[i];
        }
        cx /= n; cy /= n;                       // 從重心出發

        double best = total(cx, cy);
        double step = 10000.0;
        const double DX[4] = {1, -1, 0, 0}, DY[4] = {0, 0, 1, -1};
        while (step > 1e-5) {
            bool moved = false;
            for (int k = 0; k < 4; k++) {
                double nx = cx + DX[k] * step, ny = cy + DY[k] * step;
                double v = total(nx, ny);
                if (v < best) { best = v; cx = nx; cy = ny; moved = true; break; }
            }
            if (!moved) step *= 0.9;            // 走不動就縮小步長
        }

        if (tc) cout << "\\n";
        cout << (long long)floor(best + 0.5) << "\\n";
    }
    return 0;
}`
  },

  '10354': {
    q: `你請病假在家，但想出門去市場，又怕被老闆撞見。老闆只會在兩個地方之間往返：他家與辦公室，而且他一定走「最短路徑」（任何一條最短路徑都有可能）。

所以你必須避開「任何一條老闆最短路徑上會經過的地方」。請求出從你家到市場的最小花費；若辦不到，輸出「MISSION IMPOSSIBLE.」

輸入：多組測資，讀到 EOF。每組第一行是六個整數 P R BH OF YH M：地點數（≤ 100）、道路數、老闆家、辦公室、你家、市場。接著 R 行，每行三個整數 a b c，表示地點 a 與 b 之間有一條花費 c（< 101）的雙向道路。任兩地之間最多一條路。
輸出：每組輸出一行最小花費，或「MISSION IMPOSSIBLE.」

範例輸入
3 2 2 3 1 3
1 2 4
2 3 4
3 2 2 3 3 3
1 2 4
2 3 4
4 3 2 3 1 4
1 2 4
2 3 4
1 4 10

範例輸出
MISSION IMPOSSIBLE.
MISSION IMPOSSIBLE.
10`,
    h: `分三步。

【第一步：找出所有「危險地點」】
從 BH 跑一次 Dijkstra 得到 d1[]，從 OF 跑一次得到 d2[]，令 D = d1[OF]（老闆的最短距離）。
地點 v 在「某一條」BH→OF 的最短路徑上 ⟺
    d1[v] + d2[v] == D
把所有滿足這個條件的 v 標成危險。

（順帶一提，這也自動涵蓋了「危險道路」：若一條邊在某條最短路徑上，它的兩個端點必定都在最短路徑上，所以刪掉危險地點就等於刪掉危險道路。）

【第二步：刪掉危險地點】
包括 BH 與 OF 自己（它們一定滿足 d1 + d2 == D）。

【第三步：在剩下的圖上跑 Dijkstra】
從 YH 到 M。若 YH 或 M 本身就是危險地點，直接 MISSION IMPOSSIBLE.

範例驗算：
  第一組：BH=2, OF=3，最短路徑就是邊 2-3，危險地點 {2, 3}。市場 M=3 是危險地點 → 不可能 ✓
  第二組：你家 YH=3 是危險地點 → 不可能 ✓
  第三組：危險地點 {2, 3}，剩下 {1, 4} 與邊 1-4(10)，YH=1 → M=4，花費 10 ✓`,
    t: `1. 老闆走「任何一條」最短路徑都有可能，所以要避開「所有」最短路徑上的地點，不是只避開其中一條。用 d1[v] + d2[v] == D 這個判準一網打盡。
2. BH 與 OF 本身也是危險地點（起點與終點當然在路徑上）。
3. 你家或市場本身就危險時，直接輸出 MISSION IMPOSSIBLE.（別讓 Dijkstra 誤判成 0）。
4. 你家與市場可能是同一個地點——若它不危險，答案是 0。
5. 輸出字串結尾有句點：「MISSION IMPOSSIBLE.」
6. P ≤ 100，用鄰接矩陣 + O(P²) 的 Dijkstra 就綽綽有餘。`,
    c: `#include <bits/stdc++.h>
using namespace std;

const long long INF = LLONG_MAX / 4;
int P;
vector<vector<long long> > W;      // 鄰接矩陣

void dij(int s, vector<long long>& d, const vector<char>& blocked) {
    d.assign(P + 1, INF);
    if (blocked[s]) return;
    d[s] = 0;
    vector<char> done(P + 1, 0);
    for (int it = 0; it < P; it++) {
        int u = -1;
        for (int i = 1; i <= P; i++)
            if (!done[i] && !blocked[i] && d[i] < INF && (u < 0 || d[i] < d[u])) u = i;
        if (u < 0) break;
        done[u] = 1;
        for (int v = 1; v <= P; v++) {
            if (blocked[v] || W[u][v] >= INF) continue;
            if (d[u] + W[u][v] < d[v]) d[v] = d[u] + W[u][v];
        }
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int R, BH, OF, YH, M;
    while (cin >> P >> R >> BH >> OF >> YH >> M) {
        W.assign(P + 1, vector<long long>(P + 1, INF));
        for (int i = 0; i < R; i++) {
            int a, b; long long c;
            cin >> a >> b >> c;
            W[a][b] = min(W[a][b], c);
            W[b][a] = min(W[b][a], c);
        }

        vector<char> none(P + 1, 0);
        vector<long long> d1, d2;
        dij(BH, d1, none);
        dij(OF, d2, none);
        long long D = d1[OF];

        // 在某條 BH -> OF 最短路徑上的地點都要避開
        vector<char> blocked(P + 1, 0);
        if (D < INF)
            for (int v = 1; v <= P; v++)
                if (d1[v] < INF && d2[v] < INF && d1[v] + d2[v] == D) blocked[v] = 1;

        if (blocked[YH] || blocked[M]) {
            cout << "MISSION IMPOSSIBLE.\\n";
            continue;
        }
        vector<long long> d;
        dij(YH, d, blocked);
        if (d[M] >= INF) cout << "MISSION IMPOSSIBLE.\\n";
        else cout << d[M] << "\\n";
    }
    return 0;
}`
  },

  '10247': {
    q: `一棵「完全 k 元樹」是指：所有葉子的深度相同，所有內部節點都恰有 k 個子節點。給定分支度 k 與深度 d，這棵樹的節點數 N 是固定的。

現在要用 1 到 N 這些標籤替每個節點編號，使得「每個節點的標籤都小於它所有子孫的標籤」。請問有幾種編號方式？

輸入：每行兩個整數 k d（分支度與深度），讀到 EOF。
輸出：每行輸出對應的方法數（大數）。

範例輸入
2 2
10 1

範例輸出
80
3628800`,
    h: `經典的「樹的線性延伸（hook length formula for forests）」公式：

    方法數 = N! / Π_{每個節點 v} size(v)

其中 size(v) 是以 v 為根的子樹節點數。

直觀理由：把 N! 種全排列平均分配——對每棵子樹來說，「根拿到子樹內最小標籤」的機率恰好是 1/size(v)，而各節點的這個條件彼此獨立（可用歸納法證明）。

對完全 k 元樹，深度 j 的節點（根是深度 0、葉子是深度 d）其子樹大小是
    s_j = (k^(d−j+1) − 1) / (k − 1)          （k > 1）
    s_j = d − j + 1                           （k = 1）
而深度 j 的節點共有 k^j 個。

所以分母 = Π_{j=0..d} s_j^(k^j)。

【實作】大數運算。N 可能很大（k、d 都可到 21，N = (k^(d+1)−1)/(k−1) 會很大），但題目的測資規模讓 N! 仍算得出來。實務上的寫法是：

  1. 先算出 N。
  2. 大數階乘 N!。
  3. 逐一除以每個節點的子樹大小（大數除以小整數；若 s_j 超過 long long 就要大數除大數，但 k、d ≤ 21 時 s_j 仍在 long long 範圍內）。

驗算：
  k=2, d=2：N = 1+2+4 = 7。子樹大小：根 7、兩個深度 1 節點各 3、四個葉子各 1。
      7! / (7 × 3 × 3) = 5040 / 63 = 80 ✓
  k=10, d=1：N = 1 + 10 = 11。根的子樹 11、十個葉子各 1。
      11! / 11 = 10! = 3628800 ✓`,
    t: `1. 公式是「N! 除以所有子樹大小的乘積」，不是「除以所有節點數」。每個節點都要貢獻一次它自己的子樹大小。
2. 葉子的子樹大小是 1，除了不影響結果，但別漏算內部節點。
3. k = 1 時是一條鏈，公式要特判（等比級數的分母 k−1 = 0）。這時答案永遠是 1（只有一種遞增編號）。
4. 大數是必要的：即使 N 只有幾十，N! 也有數十位。
5. 除法一律是「大數 ÷ 小整數」，保證整除；別去實作大數除大數。
6. 讀到 EOF 結束。`,
    c: `#include <bits/stdc++.h>
using namespace std;

const long long BASE = 1000000000LL;
typedef vector<long long> Big;

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
    long long k, d;
    while (cin >> k >> d) {
        // 節點總數 N 與每層的子樹大小
        vector<long long> sz(d + 1), cntAt(d + 1);
        long long N = 0;
        for (long long j = 0; j <= d; j++) {
            long long h = d - j;                  // 這一層節點底下還有幾層
            long long s = 0, t = 1;
            for (long long i = 0; i <= h; i++) { s += t; t *= k; }   // 1 + k + ... + k^h
            sz[j] = s;
            long long c = 1;
            for (long long i = 0; i < j; i++) c *= k;                // k^j
            cntAt[j] = c;
            N += c;
        }

        Big ans(1, 1);
        for (long long i = 2; i <= N; i++) mulSmall(ans, i);         // N!
        for (long long j = 0; j <= d; j++)
            for (long long c = 0; c < cntAt[j]; c++) divSmall(ans, sz[j]);

        cout << ans.back();
        for (int i = (int)ans.size() - 2; i >= 0; i--)
            cout << setw(9) << setfill('0') << ans[i];
        cout << setfill(' ') << "\\n";
    }
    return 0;
}`
  },

  '10927': {
    q: `藝術展由許多隨機擺放的柱子組成，每根柱子水平發射雷射，全都射向位在原點 (0, 0) 的「雷射圖騰」T（圖騰高度視為無限高）。

若柱子 P 與柱子 L 和圖騰 T 三者共線，而且 P 比 T 更靠近… 更精確地說：P 位在 L 與 T 之間、且 P 的高度大於等於 L 的高度，那麼 L 就被 P 擋住而「看不見」。

請找出所有看不見的柱子。

輸入：多組測資。每組第一行是柱子數 N（≤ 100000），接著 N 行，每行三個整數 x y h（座標與高度）。同一組中沒有兩根柱子座標相同。以 N = 0 結束。
輸出：每組先印「Data set k:」。若全部可見，印「All the lights are visible.」；否則印「Some lights are not visible:」，再依 x 遞增（x 相同則 y 遞增）列出看不見的柱子，格式為「x = X, y = Y」，各筆之間用分號隔開，最後一筆用句點結尾。

範例輸入
3
-1 0 1
0 1 1
1 0 1
5
-1 0 1
-1 1 2
-2 2 2
-3 3 3
-4 4 2
0

範例輸出
Data set 1:
All the lights are visible.
Data set 2:
Some lights are not visible:
x = -4, y = 4;
x = -2, y = 2.`,
    h: `「共線且在同一側」就是「從原點看出去的方向相同」。所以：

1. 把每根柱子的方向正規化：(x, y) 除以 g = gcd(|x|, |y|)，得到最簡的方向向量 (x/g, y/g)。方向相同的柱子分成同一組。
   注意要保留正負號——(1, 1) 與 (−1, −1) 是相反方向，不能歸為一組。
2. 每一組內，依「距離原點的遠近」排序（用 x²+y² 或直接用 g 比較，因為同方向時 g 就正比於距離）。
3. 由近到遠掃描，維護「目前看過的最大高度 maxH」：
     若目前柱子的高度 ≤ maxH → 它被前面某根擋住，是看不見的
     否則 → 可見，更新 maxH
   （條件是「高度大於等於」就會擋住，所以判斷用 h ≤ maxH。）
4. 收集所有看不見的柱子，依 x 遞增、x 相同則 y 遞增排序後輸出。

範例二驗算：五根柱子。(−1,0) 自己一個方向，可見。
  (−1,1)、(−2,2)、(−3,3)、(−4,4) 都是方向 (−1,1)，由近到遠是 h=2, 2, 3, 2：
     (−1,1) h=2 → 可見，maxH = 2
     (−2,2) h=2 ≤ 2 → 看不見
     (−3,3) h=3 > 2 → 可見，maxH = 3
     (−4,4) h=2 ≤ 3 → 看不見
  看不見的是 (−2,2) 與 (−4,4)，依 x 遞增排序後是 (−4,4) 再 (−2,2) ✓ 與題目輸出一致`,
    t: `1. 方向正規化一定要用 gcd 保留符號，不能用浮點的斜率 y/x（會有精度問題，而且分不出相反方向）。x 或 y 為 0 時 gcd 仍然正確（gcd(0, k) = k）。
2. 擋住的條件是「高度大於『等於』」——相等也會擋住。用嚴格大於會少判。
3. 輸出排序是「先 x 遞增、再 y 遞增」，不是依原輸入順序也不是依距離。
4. 標點很嚴格：每筆之間分號、最後一筆句點，而且「x = -4, y = 4」中等號與逗號的空白位置要一模一樣。
5. N 可到 100000，要用 O(N log N) 的作法（用 map 分組 + 排序），別用 O(N²)。
6. 終止條件是 N = 0。`,
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
    int n, cs = 1;
    while (cin >> n && n != 0) {
        // key = 正規化方向；value = (距離平方, 高度, x, y)
        map<pair<long long, long long>, vector<pair<long long, array<long long, 3> > > > grp;
        for (int i = 0; i < n; i++) {
            long long x, y, h;
            cin >> x >> y >> h;
            long long g = gcdll(x, y);
            if (g == 0) g = 1;                       // (0,0) 不會出現，保險
            pair<long long, long long> dir(x / g, y / g);
            array<long long, 3> info = {h, x, y};
            grp[dir].push_back(make_pair(x * x + y * y, info));
        }

        vector<pair<long long, long long> > hidden;
        for (map<pair<long long, long long>, vector<pair<long long, array<long long, 3> > > >::iterator
                 it = grp.begin(); it != grp.end(); ++it) {
            vector<pair<long long, array<long long, 3> > >& v = it->second;
            sort(v.begin(), v.end());                // 由近到遠
            long long maxH = 0;
            for (size_t k = 0; k < v.size(); k++) {
                long long h = v[k].second[0];
                if (k > 0 && h <= maxH) hidden.push_back(make_pair(v[k].second[1], v[k].second[2]));
                else maxH = max(maxH, h);
            }
        }

        cout << "Data set " << cs++ << ":\\n";
        if (hidden.empty()) {
            cout << "All the lights are visible.\\n";
        } else {
            sort(hidden.begin(), hidden.end());      // 先 x 遞增、再 y 遞增
            cout << "Some lights are not visible:\\n";
            for (size_t i = 0; i < hidden.size(); i++) {
                cout << "x = " << hidden[i].first << ", y = " << hidden[i].second;
                cout << (i + 1 == hidden.size() ? ".\\n" : ";\\n");
            }
        }
    }
    return 0;
}`
  }
};

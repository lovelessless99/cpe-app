/* 第二十七批 —— pdftotext 重抽題敘後補回 */
const SOL67 = {
  '11095': {
    q: `Tabriz 市的市長想在一些路口設置旅遊服務中心，條件是「每一條街道的兩個端點中，至少有一端要有服務中心」。請求出最少需要幾個服務中心，並列出要蓋在哪些路口。

輸入：第一行是測資數 N（≤ 20）。每組先兩行，分別是路口數 n（≤ 30）與街道數 m；接著 m 行，每行兩個整數 si ti（0 ≤ si, ti < n）表示這兩個路口之間有一條街。
輸出：每組先印「Case #x: 最少數量」，下一行列出要蓋的路口（有多組解時任一組皆可）。若一個都不用蓋，第二行輸出空行。

範例輸入
2
5
4
0 3
3 1
1 4
2 4

2
1
0 1

範例輸出
Case #1: 2
3 4
Case #2: 1
0`,
    h: `「每條邊至少有一端被選中」就是「最小點覆蓋（minimum vertex cover）」。一般圖上這是 NP-hard，但 n ≤ 30 可以用「補集」硬解：

    最小點覆蓋 = n − 最大獨立集

所以改求「最大獨立集（maximum independent set）」，用分支界限（branch and bound）：

    mis(候選集合 cand, 目前選了 cur, 大小 size):
        若 cand 為空 → 更新答案
        剪枝：size + |cand| ≤ 目前最佳 → 直接返回
        選一個「在 cand 中度數最大」的點 v 來分支：
            不選 v：cand 去掉 v
            選   v：cand 去掉 v 與它的所有鄰居，size + 1

用 32 位元的 bitmask 表示點集合，鄰居也用 bitmask，交集與差集都是位元運算，非常快。挑「度數最大的點」來分支能大幅縮小搜尋樹。

最後把「不在最大獨立集裡」的點列出來，就是一組最小點覆蓋。

【驗算】（我用程式跑過兩組）
  第一組：5 個路口、街道 (0,3)(3,1)(1,4)(2,4)
      最大獨立集是 {0, 1, 2}（三個點兩兩之間都沒有街道），大小 3
      → 點覆蓋 = {3, 4}，數量 2 ✓（與題目輸出一致）
  第二組：2 個路口、一條街 (0,1)
      最大獨立集 {0} 或 {1}，大小 1 → 覆蓋數量 1，輸出 0 ✓`,
    t: `1. 這是一般圖的最小點覆蓋，不是二分圖——不能用 König 定理配最大匹配。n ≤ 30 是明確的暗示：要用分支界限或 2^(n/2) 的折半搜尋。
2. 分支時挑「度數最大的點」比按編號順序快非常多；再加上「size + |cand| ≤ best 就剪枝」，30 個點很輕鬆。
3. 孤立的路口不需要被覆蓋，會自動落在最大獨立集裡，不會被選進覆蓋。
4. 答案可能是 0（完全沒有街道），這時第二行要輸出「空行」而不是不輸出。
5. 輸入的 n 與 m 是「分成兩行」給的，不是同一行。
6. 街道可能重複給或出現自環嗎？題目說沒有重邊；自環會讓該點必選，用 bitmask 時要小心（adj[v] 含自己會讓「選 v」把自己也排除，結果仍正確）。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int n_;
int adjm[32];
int best_, bestSet_;

void mis(int cand, int cur, int size) {
    if (size + __builtin_popcount(cand) <= best_) return;      // 剪枝
    if (cand == 0) {
        if (size > best_) { best_ = size; bestSet_ = cur; }
        return;
    }
    // 挑在 cand 中度數最大的點來分支
    int v = -1, bd = -1;
    for (int i = 0; i < n_; i++) {
        if (!((cand >> i) & 1)) continue;
        int d = __builtin_popcount(adjm[i] & cand);
        if (d > bd) { bd = d; v = i; }
    }
    mis(cand & ~(1 << v), cur, size);                          // 不選 v
    mis(cand & ~(1 << v) & ~adjm[v], cur | (1 << v), size + 1);// 選 v
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    for (int tc = 1; tc <= T; tc++) {
        int m;
        cin >> n_ >> m;
        for (int i = 0; i < n_; i++) adjm[i] = 0;
        for (int i = 0; i < m; i++) {
            int a, b;
            cin >> a >> b;
            adjm[a] |= 1 << b;
            adjm[b] |= 1 << a;
        }
        best_ = -1; bestSet_ = 0;
        mis((n_ >= 32 ? -1 : (1 << n_) - 1), 0, 0);

        vector<int> cover;
        for (int i = 0; i < n_; i++) if (!((bestSet_ >> i) & 1)) cover.push_back(i);
        cout << "Case #" << tc << ": " << cover.size() << "\\n";
        for (size_t i = 0; i < cover.size(); i++) cout << (i ? " " : "") << cover[i];
        cout << "\\n";                                          // 數量為 0 時就是空行
    }
    return 0;
}`
  },

  '11031': {
    q: `給定一個序列 a1, a2, ..., an。對每個查詢 m，請找出一組索引 x1 < x2 < ... < xm，使得

    a_{x1} < a_{x2} < ... < a_{xm}

（也就是一個長度為 m 的「嚴格遞增子序列」）。若有多組解，取 x1 最小的；仍平手就取 x2 最小的，依此類推。輸出這組子序列的「數值」。

輸入：多組測資。每組第一行是 n q（1 ≤ n ≤ 10000，1 ≤ q ≤ 100），第二行是 n 個整數，接著 q 行、每行一個 m（1 ≤ m ≤ n）。以「0 0」結束。
輸出：每組先印「Set k:」，接著每個查詢印「  Subset j:」（前面 2 個空白），再印結果（前面 4 個空白）；無解印「Impossible」。組與組之間空一行。

範例輸入
6 3
3 4 1 2 3 6
6
4
5
6 2
2 4 6 1 3 5
3
4
0 0

範例輸出
Set 1:
  Subset 1:
    Impossible
  Subset 2:
    1 2 3 6
  Subset 3:
    Impossible

Set 2:
  Subset 1:
    2 4 6
  Subset 2:
    Impossible`,
    h: `先算出「從每個位置往後能拉出的最長遞增子序列長度」：

    L[i] = 以 a[i] 為開頭的最長嚴格遞增子序列長度

有了 L 之後，「字典序最小的索引序列」就可以貪心地一路挑下去：

    need = m，lastVal = −∞
    由左往右掃 i：
        若 a[i] > lastVal 且 L[i] ≥ need
            → 選 i，lastVal = a[i]，need−−
    最後 need == 0 就成功，否則 Impossible

為什麼貪心正確？因為我們是「由左往右」找第一個「選了之後還能補完剩下 need−1 個」的位置——這正好就是字典序最小的 x1；固定 x1 之後同理往下推。而 L[i] ≥ need 就是「選了 i 之後補得完」的充要條件。

【複雜度】L 用 O(n log n)（樹狀陣列或 lower_bound 的反向 LIS）算一次；每個查詢的貪心是一次線性掃描，總共 O(n log n + q·n)。n ≤ 10000、q ≤ 100 完全沒問題。

【逐組驗算】（我用程式跑過兩組）
  Set 1：a = [3, 4, 1, 2, 3, 6]
      m=6 → 整個序列的最長遞增只有 4（1,2,3,6）→ Impossible ✓
      m=4 → x1 從 1 開始試：a[1]=3 之後只能接 4、6 → 長度 3，不夠；
              a[2]=4 → 只能接 6，長度 2；a[3]=1 → 1,2,3,6 長度 4 ✓
              → 輸出 1 2 3 6 ✓
      m=5 → Impossible ✓
  Set 2：a = [2, 4, 6, 1, 3, 5]
      m=3 → 從 a[1]=2 開始就有 2,4,6 ✓ → 2 4 6 ✓
      m=4 → LIS 只有 3 → Impossible ✓`,
    t: `1. 要的是「索引序列字典序最小」，不是「數值字典序最小」——但輸出的是數值。範例 Set 2 的 m=3 輸出 2 4 6（索引 1,2,3）而不是 1 3 5（索引 4,5,6），正是這個差別。
2. 是「嚴格」遞增，相等不算。
3. 輸出縮排很嚴格：「Set k:」不縮排、「Subset j:」前面 2 個空白、結果前面 4 個空白。題目在 Notes 裡用 '.' 標出了每個空白，照抄即可。
4. 組與組之間要空一行。
5. 題目特別提醒「不建議用 cin/cout」——資料量不大但輸出行數多，記得關掉 iostream 同步（ios::sync_with_stdio(false)）。
6. 終止條件是「0 0」。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q, cs = 1;
    bool first = true;
    while (cin >> n >> q && (n || q)) {
        vector<int> a(n);
        for (int i = 0; i < n; i++) cin >> a[i];

        // L[i] = 以 a[i] 開頭的最長嚴格遞增子序列長度（由右往左用 lower_bound）
        vector<int> L(n, 1), tail;
        for (int i = n - 1; i >= 0; i--) {
            // 對「反轉且取負」的序列求最長遞增 → 等價於往後的遞增長度
            int key = -a[i];
            vector<int>::iterator it = lower_bound(tail.begin(), tail.end(), key);
            L[i] = (int)(it - tail.begin()) + 1;
            if (it == tail.end()) tail.push_back(key);
            else *it = key;
        }

        if (!first) cout << "\\n";
        first = false;
        cout << "Set " << cs++ << ":\\n";
        for (int t = 1; t <= q; t++) {
            int m;
            cin >> m;
            cout << "  Subset " << t << ":\\n";
            vector<int> res;
            int need = m;
            long long lastVal = LLONG_MIN;
            for (int i = 0; i < n && need > 0; i++)
                if (a[i] > lastVal && L[i] >= need) { res.push_back(a[i]); lastVal = a[i]; need--; }
            cout << "    ";
            if (need > 0) cout << "Impossible\\n";
            else {
                for (size_t i = 0; i < res.size(); i++) cout << (i ? " " : "") << res[i];
                cout << "\\n";
            }
        }
    }
    return 0;
}`
  }
};

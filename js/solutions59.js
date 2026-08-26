/* 三星第十九批 —— 高 AC 經典題 */
const SOL59 = {
  '11481': {
    q: `把 1, 2, 3, ..., n 這個初始序列重新排列，共有 n! 種排法。請計算：其中「前 m 個位置裡，恰好有 k 個數字仍在自己原本的位置」的排法有幾種？

例如 n = 5、m = 3、k = 2：排列 1, 4, 3, 2, 5 要算進去（前 3 個位置中 1 在第 1 位、3 在第 3 位，恰好 2 個）；但 1, 2, 3, 4, 5 不算（前 3 個位置有 3 個在原位）。

輸入：第一行是測資數（≤ 1000）。接著每行三個整數 n m k（1 ≤ n ≤ 1000）。
輸出：每組印「Case i: 答案 mod 1000000007」。

範例輸入
1
5 3 2

範例輸出
Case 1: 12`,
    h: `分兩步。

【第一步：選出哪 k 個位置是固定點】
從前 m 個位置中選 k 個 → C(m, k) 種。

【第二步：剩下的必須「前 m 個位置中沒有其他固定點」】
剩下 n − k 個數字要放進 n − k 個位置，而其中「前 m 個位置裡剩下的 m − k 個」都不能放自己。這是「部分錯位排列」，用排容原理：

    D(n−k, m−k) = Σ_{i=0}^{m−k} (−1)^i · C(m−k, i) · (n−k−i)!

（意思是：至少 i 個那 m−k 個受限位置變成固定點的情形，用容斥加加減減。）

所以答案 =

    C(m, k) × Σ_{i=0}^{m−k} (−1)^i · C(m−k, i) · (n−k−i)!     (mod 10^9+7)

驗算 n=5, m=3, k=2：
    C(3,2) = 3
    Σ_{i=0}^{1} (−1)^i C(1,i)(3−i)! = 3! − 2! = 6 − 2 = 4
    答案 = 3 × 4 = 12 ✓（與題目輸出一致）
另外自我檢查兩個邊界：
    (n,m,k) = (5,5,5) → 1（只有恆等排列）✓
    (n,m,k) = (4,4,0) → 9，正好是 4 的錯位排列數 !4 = 9 ✓

【實作】
先把階乘與階乘反元素（用費馬小定理求逆元）打表到 1000，每筆測資 O(m) 即可。`,
    t: `1. 是「恰好 k 個」不是「至少 k 個」，所以第二步一定要用容斥排除其他固定點。
2. 容斥的上限是 m−k（受限位置只有那麼多），不是 n−k。
3. k > m 時答案是 0，要先判掉。
4. 模數 10^9+7 是質數，可以用費馬小定理算逆元；別忘了減法後要 +MOD 再取模。
5. n ≤ 1000、測資 ≤ 1000 → 總共 10^6 次運算，打好表就很快。
6. 輸出格式是「Case 1: 12」。`,
    c: `#include <bits/stdc++.h>
using namespace std;

const long long MOD = 1000000007LL;
const int MX = 1005;
long long fac[MX], inv[MX];

long long pw(long long a, long long b) {
    long long r = 1;
    a %= MOD;
    while (b > 0) { if (b & 1) r = r * a % MOD; a = a * a % MOD; b >>= 1; }
    return r;
}
long long C(int n, int k) {
    if (k < 0 || k > n || n < 0) return 0;
    return fac[n] * inv[k] % MOD * inv[n - k] % MOD;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    fac[0] = 1;
    for (int i = 1; i < MX; i++) fac[i] = fac[i - 1] * i % MOD;
    inv[MX - 1] = pw(fac[MX - 1], MOD - 2);
    for (int i = MX - 1; i > 0; i--) inv[i - 1] = inv[i] * i % MOD;

    int T;
    if (!(cin >> T)) return 0;
    for (int tc = 1; tc <= T; tc++) {
        int n, m, k;
        cin >> n >> m >> k;
        long long ans = 0;
        if (k <= m) {
            long long s = 0;
            for (int i = 0; i <= m - k; i++) {          // 排容：排除其他固定點
                long long t = C(m - k, i) * fac[n - k - i] % MOD;
                if (i % 2 == 0) s = (s + t) % MOD;
                else s = (s - t % MOD + MOD) % MOD;
            }
            ans = C(m, k) * s % MOD;
        }
        cout << "Case " << tc << ": " << ans << "\\n";
    }
    return 0;
}`
  },

  '10439': {
    q: `考古學家發現三件古物，它們位在某個「正多邊形」的三個頂點上。給定這三個點的座標，請求出這個正多邊形最少可能有幾個頂點。

輸入：第一行是測資數。接著每組一行，是三個點的 x y 座標（實數）。
輸出：每組輸出一行，最少的頂點數。

範例輸入
4
10.00000 0.00000 0.00000 -10.00000 -10.00000 0.00000
22.23086 0.42320 -4.87328 11.92822 1.76914 27.57680
156.71567 -13.63236 139.03195 -22.04236 137.96925 -11.70517
129.400249 -44.695226 122.278798 -53.696996 44.828427 -83.507917

範例輸出
4
6
23
100`,
    h: `正多邊形的所有頂點都在同一個外接圓上，而且相鄰頂點對圓心的張角固定是 2π/n。

步驟：
1. 由三點求外接圓圓心 O（兩條中垂線的交點，用行列式公式一次算出）：
       d = 2·(Ax(By−Cy) + Bx(Cy−Ay) + Cx(Ay−By))
       Ox = (|A|²(By−Cy) + |B|²(Cy−Ay) + |C|²(Ay−By)) / d
       Oy = (|A|²(Cx−Bx) + |B|²(Ax−Cx) + |C|²(Bx−Ax)) / d
2. 算出三點相對於 O 的極角，再取兩個「角度差」（都正規化到 [0, 2π)）。
3. 從 n = 3 往上找，第一個讓「兩個角度差都是 2π/n 的整數倍」的 n 就是答案。

判斷「是整數倍」時要留浮點容忍：|q − round(q)| < 1e−4（座標只有 5~6 位小數，太嚴會找不到、太鬆會提早誤判）。

我用程式把四組範例全跑過：
    第 1 組（(10,0)、(0,−10)、(−10,0)）→ 圓心 (0,0)、半徑 10，角度差 90° 與 90° → n = 4 ✓
    第 2 組 → 圓心 (12,14)、半徑 17，角度差 240° 與 300° → n = 6 ✓
    第 3 組 → 23 ✓
    第 4 組 → 100 ✓
（第 1、2 組的答案在題目的 PDF 範例輸出裡被截掉了，但用同一支程式算出來與第 3、4 組一致，可以互相印證。）`,
    t: `1. 三點共線時外接圓不存在（分母 d = 0）——題目保證是正多邊形的頂點，所以不會發生，但寫程式時仍建議判一下。
2. 角度差要正規化到 [0, 2π)，用 fmod 之後再加 2π 再 fmod 一次。
3. eps 的拿捏是本題唯一的坑：座標小數位不多，用 1e−4 這個量級最穩；用 1e−6 可能會漏掉正確的 n，用 1e−2 會提早撞到錯的 n。
4. n 的上限：題目沒明說，掃到 1000 就夠（範例最大是 100）。
5. 兩個角度差就夠了（第三個是 2π 減掉前兩個，自動滿足）。
6. 每組只輸出一個整數。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    const double TAU = 2 * acos(-1.0);
    while (T--) {
        double ax, ay, bx, by, cx, cy;
        cin >> ax >> ay >> bx >> by >> cx >> cy;

        // 外接圓圓心
        double d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
        double aa = ax * ax + ay * ay, bb = bx * bx + by * by, cc = cx * cx + cy * cy;
        double ox = (aa * (by - cy) + bb * (cy - ay) + cc * (ay - by)) / d;
        double oy = (aa * (cx - bx) + bb * (ax - cx) + cc * (bx - ax)) / d;

        double t1 = atan2(ay - oy, ax - ox);
        double t2 = atan2(by - oy, bx - ox);
        double t3 = atan2(cy - oy, cx - ox);
        double g1 = fmod(fmod(t2 - t1, TAU) + TAU, TAU);
        double g2 = fmod(fmod(t3 - t2, TAU) + TAU, TAU);

        int ans = 3;
        for (int n = 3; n <= 1000; n++) {
            double u = TAU / n;
            double q1 = g1 / u, q2 = g2 / u;
            if (fabs(q1 - floor(q1 + 0.5)) < 1e-4 && fabs(q2 - floor(q2 + 0.5)) < 1e-4) {
                ans = n;
                break;
            }
        }
        cout << ans << "\\n";
    }
    return 0;
}`
  },

  '11036': {
    q: `給定一個函數 f : {0..N−1} → {0..N−1} 與一個起始值 a，可以造出無窮序列

    x₀ = a,  x_{i+1} = f(x_i)

因為值域有限，這個序列一定會「最終週期化」（從某一項之後開始循環）。請求出它的週期長度。

輸入：每行包含 N、a，以及函數 f 的「後序（逆波蘭）表示式」。運算元可以是無號整數常數、字母 x（代表輸入值）、字母 N；運算子有 + − * / %。所有運算最後都對 N 取模。
輸出：每行輸出對應序列的週期長度。

範例輸入
10 1 x N %
11 1 x x 1 + * N %
1728 1 x x 1 + * x 2 + * N %
1728 1 x x 1 + x 2 + * * N %

自行推算的輸出
1
3
6
6`,
    h: `兩個獨立的部分：**求值**與**找週期**。

【後序表示式求值】
用一個堆疊逐一掃過 token：
    "x" → push 目前的輸入值
    "N" → push N
    數字 → push 該常數
    運算子 → pop 兩個（注意順序：先 pop 的是右運算元），算完 push 回去
最後堆疊剩下的那個值就是 f(x)。記得結果要對 N 取正餘數（C++ 的 % 對負數會給負值）。

【找週期】
N 可以到 1.1×10^7，開一個「造訪過沒有」的陣列會吃掉幾十 MB，而且題目只要「週期長度」不要「進入週期前的長度」，所以最省事的是 **Floyd 龜兔演算法**（O(1) 記憶體）：

    tortoise = f(a);  hare = f(f(a));
    while (tortoise != hare) { tortoise = f(tortoise); hare = f(f(hare)); }
    // 相遇之後，從相遇點再繞一圈就是週期
    len = 1;  x = f(tortoise);
    while (x != tortoise) { x = f(x); len++; }

【驗算】（我用程式跑過）
    N=10, a=1, f(x)=x%10：序列 1,1,1,... → 週期 1
    N=11, a=1, f(x)=x(x+1)%11：1 → 2 → 6 → 9 → 2 → ... 循環 (2,6,9) → 週期 3
    N=1728, a=1, f(x)=x(x+1)(x+2)%1728 → 週期 6
    N=1728, a=1, f(x)=x·((x+1)(x+2))%1728 → 週期 6
（後兩式雖然括號位置不同，數學上相同，週期自然一樣——正好可以互相驗證求值器寫對了。）`,
    t: `1. 不要開 O(N) 的 visited 陣列——N 到 1.1×10^7 會 MLE。用 Floyd 龜兔法只要 O(1) 記憶體。
2. 中間運算可能溢位：x·(x+1)·(x+2) 在 x 接近 10^7 時是 10^21，遠超 long long。務必「每個運算之後就對 N 取模」，或用 __int128 承接乘法。
3. C++ 的 % 對負數回傳負值，取模後要 ((v % N) + N) % N。
4. 後序表示式的運算元順序：pop 出來的第一個是右運算元。減法與除法會受影響。
5. 每一行的 token 數量不固定，用 getline 讀整行再用 stringstream 拆比較安全。
6. 週期長度至少是 1（不動點也算週期 1）。`,
    c: `#include <bits/stdc++.h>
using namespace std;

vector<string> tok;
long long N;

long long evalF(long long x) {
    vector<long long> st;
    for (size_t i = 0; i < tok.size(); i++) {
        const string& t = tok[i];
        if (t == "x") st.push_back(x);
        else if (t == "N") st.push_back(N);
        else if (t == "+" || t == "-" || t == "*" || t == "/" || t == "%") {
            long long b = st.back(); st.pop_back();
            long long a = st.back(); st.pop_back();
            long long r = 0;
            if (t == "+") r = (a + b) % N;
            else if (t == "-") r = ((a - b) % N + N) % N;
            else if (t == "*") r = (__int128)a * b % N;      // 每步取模避免溢位
            else if (t == "/") r = (b == 0 ? 0 : a / b);
            else r = (b == 0 ? 0 : a % b);
            st.push_back(r);
        } else {
            st.push_back(atoll(t.c_str()) % N);
        }
    }
    long long v = st.back();
    return ((v % N) + N) % N;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string line;
    while (getline(cin, line)) {
        istringstream in(line);
        long long a;
        if (!(in >> N >> a)) continue;
        tok.clear();
        string t;
        while (in >> t) tok.push_back(t);
        if (tok.empty()) continue;

        // Floyd 龜兔：先找相遇點
        long long slow = evalF(a), fast = evalF(evalF(a));
        while (slow != fast) { slow = evalF(slow); fast = evalF(evalF(fast)); }
        // 再繞一圈量週期
        long long len = 1, cur = evalF(slow);
        while (cur != slow) { cur = evalF(cur); len++; }
        cout << len << "\\n";
    }
    return 0;
}`
  },

  '12621': {
    q: `我們有一本食譜，每道菜標了熱量。想挑出「不重複」的若干道菜，使總熱量剛好等於指定的目標，或是在超過的前提下「超得最少」。

輸入：第一行是測資數。每組三行：第一行是目標熱量，第二行是菜的道數，第三行是各道菜的熱量。
輸出：每組輸出一行，挑出來那組的總熱量；若怎麼挑都湊不到目標，輸出「NO SOLUTION」。

範例輸入
4
2480
5
1230 1050 820 890 1150
2140
4
450 150 120 50
1200
5
320 570 610 1560 890
1810
6
2340 780 940 310 660 790

範例輸出
2760
NO SOLUTION
1210
1880`,
    h: `經典的 0/1 子集合和（subset-sum）：先算出「哪些總和湊得出來」，再找出「≥ 目標的最小可行總和」。

    dp[s] = 能不能用某個子集合湊出總和 s
    dp[0] = true
    對每道菜 v：for s 從大到小：dp[s] |= dp[s − v]

（由大到小掃是 0/1 背包的標準寫法，保證每道菜只用一次。）

最後從 s = 目標往上掃，第一個 dp[s] 為真的 s 就是答案；掃到「全部熱量的總和」都沒有就是 NO SOLUTION。

複雜度 O(道數 × 總熱量)。用 bitset 可以再快 64 倍：

    bitset<MAX> dp;  dp[0] = 1;
    for (v : items) dp |= (dp << v);

驗算（我用程式跑過四組）：
    目標 2480，{1230,1050,820,890,1150} → 1050+820+890 = 2760 ✓
        （1230+1150 = 2380 還不夠、1230+1050 = 2280 也不夠）
    目標 2140，{450,150,120,50} → 全部加起來才 770 → NO SOLUTION ✓
    目標 1200，{320,570,610,1560,890} → 320+890 = 1210 ✓
    目標 1810，{2340,780,940,310,660,790} → 780+790+310 = 1880 ✓
四組全中。`,
    t: `1. 「剛好等於或超過最少」——所以是從目標往上找第一個可行值，不是找最接近的（可能在下面）。
2. dp 的大小要開到「所有熱量的總和」，不是目標值——答案可能超過目標。
3. 0/1 背包的內層迴圈要「由大到小」，寫成由小到大會變成每道菜可重複用。
4. 空集合（總和 0）算可行，但若目標 > 0 就不會被選到，不影響。
5. 總和可能不小，開 bitset 或 vector<char> 都可以；bitset 版本快很多。
6. 「NO SOLUTION」要全大寫、中間一個空白。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        long long target;
        int n;
        cin >> target >> n;
        vector<int> a(n);
        long long total = 0;
        for (int i = 0; i < n; i++) { cin >> a[i]; total += a[i]; }

        vector<char> dp(total + 1, 0);
        dp[0] = 1;
        for (int i = 0; i < n; i++)
            for (long long s = total; s >= a[i]; s--)    // 由大到小 = 每道菜只用一次
                if (dp[s - a[i]]) dp[s] = 1;

        long long ans = -1;
        for (long long s = max(0LL, target); s <= total; s++)
            if (dp[s]) { ans = s; break; }

        if (ans < 0) cout << "NO SOLUTION\\n";
        else cout << ans << "\\n";
    }
    return 0;
}`
  },

  '11072': {
    q: `給定第一組點集（最多 100000 個相異的整數座標點），再給第二組查詢點。對每個查詢點，判斷它是否落在「第一組中任意三點所張成的三角形」之內（在邊上也算「內部」）。

輸入：多組測資。每組先是第一組的點數 n，接著 n 對座標；再來是第二組的點數 m，接著 m 對座標。
輸出：每個查詢點輸出一行「inside」或「outside」。

範例輸入
4
0 0
4 4
0 4
4 0
6
2 2
4 4
1 1
0 2
0 10
10 0

範例輸出
inside
inside
inside
inside
outside
outside`,
    h: `關鍵觀察：「存在三個點張成的三角形包含 P」⟺「P 落在第一組點集的**凸包**內（含邊界）」。

（→ 三角形的三個頂點都在凸包內，所以三角形整個在凸包內。
  ← 若 P 在凸包內，把凸包三角剖分，P 一定落在某個以凸包頂點為頂點的三角形裡。）

所以演算法是：
1. 用 Andrew monotone chain 求凸包，O(n log n)。
2. 每個查詢用「凸多邊形內部判定」的二分搜尋版本，O(log n)：
   - 以凸包頂點 h[0] 為原點，先檢查 P 是否落在 h[0]h[1] 與 h[0]h[n−1] 所夾的扇形內；
   - 用二分找出 P 落在哪一個三角形 (h[0], h[i], h[i+1]) 的角度區間，最後檢查 P 在 h[i]h[i+1] 的內側。

【退化情形】
- 凸包只有 1 個點：P 必須跟它相同才算 inside。
- 凸包是一條線段（所有點共線）：P 必須落在線段上。
這兩種情形要單獨處理，否則二分會出錯。

【全整數運算】
座標是整數且絕對值 < 10000，所有外積都用 long long 就不會溢位，完全避開浮點誤差。

驗算範例（第一組是 (0,0)、(4,4)、(0,4)、(4,0)，凸包就是那個正方形）：
    (2,2) 在中心 → inside ✓
    (4,4) 是頂點 → inside（邊界算內部）✓
    (1,1) 在內部 → inside ✓
    (0,2) 在左邊上 → inside ✓
    (0,10)、(10,0) 都在外面 → outside ✓
六個全中。`,
    t: `1. 「邊上算 inside」——所有外積判斷都要用 ≥ 0 / ≤ 0 而不是嚴格大於小於。
2. 求凸包時要保留共線點嗎？為了「邊上算內部」，用「嚴格外積 < 0 才彈出」的版本（不保留共線點）比較單純，邊界判定交給後面的 ≥ 0 處理。
3. n 到 100000，查詢也可能很多，所以查詢一定要 O(log n)；每次都掃一圈凸包會 TLE。
4. 退化情形（1 個點、共線）一定要特判，不然二分會爆。
5. 全程用 long long 做外積（10000 × 10000 × 4 仍在範圍內），別用 double。
6. 多組測資要讀到 EOF；每組都要重建凸包。`,
    c: `#include <bits/stdc++.h>
using namespace std;

typedef pair<long long, long long> P;

long long cross(const P& O, const P& A, const P& B) {
    return (A.first - O.first) * (B.second - O.second) -
           (A.second - O.second) * (B.first - O.first);
}

vector<P> hull(vector<P> p) {
    sort(p.begin(), p.end());
    p.erase(unique(p.begin(), p.end()), p.end());
    int n = (int)p.size();
    if (n <= 2) return p;
    vector<P> h(2 * n);
    int k = 0;
    for (int i = 0; i < n; i++) {
        while (k >= 2 && cross(h[k - 2], h[k - 1], p[i]) <= 0) k--;
        h[k++] = p[i];
    }
    int lower = k + 1;
    for (int i = n - 2; i >= 0; i--) {
        while (k >= lower && cross(h[k - 2], h[k - 1], p[i]) <= 0) k--;
        h[k++] = p[i];
    }
    h.resize(k - 1);
    return h;
}

bool onSeg(const P& a, const P& b, const P& q) {
    if (cross(a, b, q) != 0) return false;
    return min(a.first, b.first) <= q.first && q.first <= max(a.first, b.first) &&
           min(a.second, b.second) <= q.second && q.second <= max(a.second, b.second);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    while (cin >> n) {
        vector<P> pts(n);
        for (int i = 0; i < n; i++) cin >> pts[i].first >> pts[i].second;
        vector<P> h = hull(pts);
        int m;
        cin >> m;
        while (m--) {
            P q;
            cin >> q.first >> q.second;
            bool in = false;
            int hs = (int)h.size();
            if (hs == 1) {
                in = (h[0] == q);
            } else if (hs == 2) {
                in = onSeg(h[0], h[1], q);
            } else {
                // 先看是否落在 h[0]h[1] 與 h[0]h[hs-1] 夾的扇形內
                if (cross(h[0], h[1], q) >= 0 && cross(h[0], h[hs - 1], q) <= 0) {
                    int lo = 1, hi = hs - 1;
                    while (hi - lo > 1) {                 // 二分找所在的三角形
                        int mid = (lo + hi) / 2;
                        if (cross(h[0], h[mid], q) >= 0) lo = mid; else hi = mid;
                    }
                    in = (cross(h[lo], h[lo + 1], q) >= 0);
                }
            }
            cout << (in ? "inside" : "outside") << "\\n";
        }
    }
    return 0;
}`
  }
};

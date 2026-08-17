/* 二星題庫（第二批 12 題） */
const SOL19 = {
11057: {
  q: "剛好湊滿：n 本書各有價格，要挑<b>兩本</b>價格總和恰為 m。若有多組解，取<b>兩本價差最小</b>的那組。輸出 <code>Peter should buy books whose prices are X and Y.</code>（X ≤ Y）",
  h: "<b>排序 + 對撞雙指標</b>的模板題：<br>左指標 <code>i</code> 從頭、右指標 <code>j</code> 從尾，看 <code>a[i] + a[j]</code>：<br>・太小 ⇒ <code>i++</code>（要更大的數）<br>・太大 ⇒ <code>j--</code><br>・剛好 ⇒ 記錄下來（此時 <code>a[j] − a[i]</code> 就是這組的價差），然後<b>兩邊同時往內縮</b>繼續找。<br>因為指標<b>由外往內</b>走，越晚找到的配對價差越小 ⇒ <b>最後一組就是答案</b>，連比較都省了。<br>O(n log n)，n = 10000 輕鬆過。",
  t: "① 「價差最小」用雙指標<b>天然滿足</b>——由外往內掃，後找到的一定更接近，直接覆蓋即可。<br>② 兩本書可以<b>同價格</b>（樣例的 40 + 40），所以 <code>i &lt; j</code> 是索引不同即可，不是數值不同。<br>③ 輸入順序是 <code>n → n 個價格 → m</code>，別把 m 讀成第 n+1 個價格。<br>④ 題目保證有解，不必處理找不到的情況。<br>⑤ 輸出句尾有<b>句號</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n) {
        vector<int> a(n);
        for (int i = 0; i < n; i++) cin >> a[i];
        int m; cin >> m;
        sort(a.begin(), a.end());

        int x = 0, y = 0;
        int i = 0, j = n - 1;
        while (i < j) {
            int s = a[i] + a[j];
            if (s < m) i++;
            else if (s > m) j--;
            else { x = a[i]; y = a[j]; i++; j--; }   // 由外往內 → 後找到的價差更小
        }
        cout << "Peter should buy books whose prices are " << x << " and " << y << ".\\n";
    }
    return 0;
}`
},

11340: {
  q: "報社稿費：給 K 個「付費字元」與它們的<b>分值</b>，再給一篇文章（M 行），把文章中所有付費字元的分值加總，以 <code>d.cc$</code> 的格式輸出（元不補零、分固定兩位）。",
  h: "本質是<b>查表累加</b>：開一個 <code>long long val[256]</code>，把付費字元的分值填進去，其餘為 0；然後把文章每個字元的分值加起來。<br>真正的考點是 <b>I/O 解析</b>：<br>① 字元與分值的那一行，<b>字元本身可能是空白</b>，所以要用 <code>getline</code> 讀整行，取 <code>line[0]</code> 當字元、其餘轉成數字，<b>不能用 <code>cin &gt;&gt; c &gt;&gt; v</code></b>。<br>② <code>cin &gt;&gt;</code> 與 <code>getline</code> 混用時，讀完數字要 <code>cin.ignore()</code> 吃掉行尾的換行。<br>③ <b>換行字元不計分</b>（getline 本來就不會把它讀進來）。",
  t: "① <b><code>cin &gt;&gt;</code> 與 <code>getline</code> 混用必須 <code>cin.ignore()</code></b>，否則第一次 getline 會讀到空字串——這是本題最常見的錯誤。<br>② 付費字元可能是空白或標點，一律用 <code>line[0]</code> 取。<br>③ 索引 <code>val[]</code> 時要轉 <code>unsigned char</code>，否則負值字元會越界。<br>④ 總分要用 <code>long long</code>。<br>⑤ 輸出格式是 <code>3.74$</code>——<b>錢字號在後面</b>，且分要補滿兩位。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        ll val[256];
        memset(val, 0, sizeof val);
        int k; cin >> k; cin.ignore();               // 吃掉行尾換行
        for (int i = 0; i < k; i++) {
            string line; getline(cin, line);
            val[(unsigned char)line[0]] = atoll(line.c_str() + 1);
        }
        int m; cin >> m; cin.ignore();
        ll sum = 0;
        for (int i = 0; i < m; i++) {
            string line; getline(cin, line);
            for (size_t j = 0; j < line.size(); j++)
                sum += val[(unsigned char)line[j]];
        }
        cout << sum / 100 << "."
             << setw(2) << setfill('0') << sum % 100 << setfill(' ') << "$\\n";
    }
    return 0;
}`
},

10034: {
  q: "雀斑連線：平面上 n 個點，要用線段把所有點連起來（可經由其他點中轉），求<b>總長度最短</b>是多少，輸出到小數點後兩位。",
  h: "「把所有點連通、總長最短」＝ <b>最小生成樹（MST）</b>，邊權是歐氏距離。<br>點數少（n ≤ 100）⇒ 建完全圖有 n²/2 條邊，兩種寫法都行：<br>・<b>Kruskal</b>：所有邊排序後由小到大加，用 DSU 判環。<br>・<b>Prim</b>：稠密圖用 O(n²) 的鄰接矩陣版更直觀，連邊都不用建。<br>本解用 Prim，因為完全圖天生就是稠密圖。<br>這題和 10369（北極網路）是<b>同一個模子</b>，差別只在最後取的是總和還是第 k 大的邊。",
  t: "① 距離用 <code>hypot</code> 或 <code>sqrt(dx*dx + dy*dy)</code>，全程 <code>double</code>。<br>② 座標是<b>實數</b>不是整數。<br>③ 測資之間要<b>空一行</b>（最後一筆後面不要）——這是本題最常見的 PE 來源。<br>④ 第一行是測資數，後面接一個空行；用 <code>cin &gt;&gt;</code> 會自動略過所有空白，不必特別處理。<br>⑤ 輸出固定兩位小數。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cout << fixed << setprecision(2);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<double> x(n), y(n);
        for (int i = 0; i < n; i++) cin >> x[i] >> y[i];

        // Prim：稠密圖用 O(n^2) 版本，不需要建邊
        vector<double> dist(n, 1e18);
        vector<char> used(n, 0);
        dist[0] = 0;
        double total = 0;
        for (int it = 0; it < n; it++) {
            int u = -1;
            for (int v = 0; v < n; v++)
                if (!used[v] && (u < 0 || dist[v] < dist[u])) u = v;
            used[u] = 1;
            total += dist[u];
            for (int v = 0; v < n; v++)
                if (!used[v]) dist[v] = min(dist[v], hypot(x[u] - x[v], y[u] - y[v]));
        }
        cout << total << "\\n";
        if (T) cout << "\\n";                        // 測資之間空一行
    }
    return 0;
}`
},

10006: {
  q: "Carmichael 數：若 n 是<b>合數</b>，且對所有 <code>2 ≤ a &lt; n</code> 都滿足 <code>aⁿ mod n == a</code>，n 就是 Carmichael 數。判斷輸入的 n（&lt; 65000）是不是。",
  h: "定義直接翻譯成程式，兩個步驟：<br>① <b>先判 n 是不是質數</b>——質數必定滿足費馬小定理（<code>aⁿ ≡ a</code>），但題目要求是<b>合數</b>，所以質數一律輸出 normal。<br>② 對每個 <code>a</code> 用<b>快速冪</b>算 <code>aⁿ mod n</code>，只要有一個不等於 a 就不是。<br>複雜度 O(n log n) ≈ 65000 × 16 ≈ 100 萬，完全可行。<br>（Carmichael 數又叫「費馬偽質數」，是 RSA 這類基於費馬測試的演算法的天敵——這也是題目扯一堆密碼學的原因。）",
  t: "① <b>質數不算 Carmichael 數</b>，一定要先擋掉，否則所有質數都會被誤判。<br>② 快速冪內的乘法要轉 <code>long long</code>：<code>(ll)res * a % n</code>。<br>③ 條件是 <code>aⁿ ≡ a (mod n)</code>，<b>不是</b> <code>a^(n−1) ≡ 1</code>（後者要求 gcd(a,n)=1）。<br>④ 輸出兩種句子的措辭完全不同，注意抄對：<code>The number n is a Carmichael number.</code> / <code>n is normal.</code><br>⑤ <code>n = 0</code> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

ll powmod(ll b, ll p, ll m) {
    ll r = 1 % m; b %= m;
    while (p) { if (p & 1) r = r * b % m; b = b * b % m; p >>= 1; }
    return r;
}

bool isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; (ll)i * i <= n; i++) if (n % i == 0) return false;
    return true;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n && n) {
        bool car = !isPrime(n);                      // 必須是合數
        for (int a = 2; a < n && car; a++)
            if (powmod(a, n, n) != a % n) car = false;
        if (car) cout << "The number " << n << " is a Carmichael number.\\n";
        else cout << n << " is normal.\\n";
    }
    return 0;
}`
},

10104: {
  q: "Euclid Problem：給 A、B，求整數 X、Y 使 <code>AX + BY = gcd(A, B)</code>。若有多組解，取 <code>|X| + |Y|</code> 最小者；再平手則取 X ≤ Y。輸出 X Y gcd。",
  h: "<b>擴充歐幾里得（extended gcd）</b>，必背模板：<br>遞迴到 <code>gcd(a, 0) = a</code>（此時 x = 1, y = 0），回程時用<br><code>x = y₁</code>、<code>y = x₁ − (a / b) · y₁</code><br>來把子問題的解「翻譯」回原問題。<br>推導：已知 <code>b·x₁ + (a mod b)·y₁ = g</code>，代入 <code>a mod b = a − ⌊a/b⌋·b</code> 整理即得。<br>這個模板的用途遠不只本題——<b>模逆元</b>（<code>ax ≡ 1 mod m</code>）、<b>中國剩餘定理</b>、<b>線性丟番圖方程</b>全靠它。<br>標準遞迴回傳的解<b>天然就是 |x| + |y| 最小的那組</b>，不用額外調整。",
  t: "① A、B 可到 10⁹ ⇒ 中間值要用 <code>long long</code>。<br>② 遞迴式裡是 <code>x₁ − (a / b) * y₁</code>，係數是<b>整數除法</b>，寫成浮點就錯了。<br>③ 兩個參數的順序、以及回程時 x 與 y 的<b>交換</b>是最容易寫反的地方。<br>④ 樣例 <code>4 6 → -1 1 2</code>：4×(−1) + 6×1 = 2 ✓，可以拿來驗模板有沒有寫對。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

// 回傳 gcd(a,b)，並解出 a*x + b*y = gcd
ll extgcd(ll a, ll b, ll &x, ll &y) {
    if (b == 0) { x = 1; y = 0; return a; }
    ll x1, y1;
    ll g = extgcd(b, a % b, x1, y1);
    x = y1;
    y = x1 - (a / b) * y1;
    return g;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll a, b;
    while (cin >> a >> b) {
        ll x, y;
        ll g = extgcd(a, b, x, y);
        cout << x << " " << y << " " << g << "\\n";
    }
    return 0;
}`
},

10611: {
  q: "花花公子黑猩猩：給一排<b>已排序</b>的身高（n ≤ 50000），對每個查詢身高 h，輸出「比 h <b>嚴格矮</b>的最高者」與「比 h <b>嚴格高</b>的最矮者」；不存在就印 <code>X</code>。",
  h: "排好序 ⇒ <b>二分搜</b>，而且 STL 已經幫你寫好了：<br>・<code>lower_bound(h)</code> = 第一個 <b>≥ h</b> 的位置 ⇒ 它<b>前面一個</b>就是「嚴格小於 h 的最大值」。<br>・<code>upper_bound(h)</code> = 第一個 <b>&gt; h</b> 的位置 ⇒ 它本身就是「嚴格大於 h 的最小值」。<br>兩個函式的差別（<code>≥</code> vs <code>&gt;</code>）正是本題的考點，值得專門記住。<br>每次查詢 O(log n)。",
  t: "① <b>「嚴格」比較是本題的核心</b>：查詢值 4 而陣列裡有 4 時，答案不能是 4 自己。用 lower_bound 找矮的、upper_bound 找高的，剛好各自跳過相等的元素。<br>② 邊界：<code>lower_bound</code> 回傳 <code>begin()</code> 代表沒有更矮的 ⇒ 印 <code>X</code>；<code>upper_bound</code> 回傳 <code>end()</code> 代表沒有更高的 ⇒ 印 <code>X</code>。<br>③ 輸入已經排序（題目保證），但保險起見自己 <code>sort</code> 一次也不虧。<br>④ 查詢數量未知，讀到 EOF。<br>⑤ 兩個答案<b>同一行、空白分隔</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    sort(a.begin(), a.end());                        // 保險

    int h;
    while (cin >> h) {
        vector<int>::iterator lo = lower_bound(a.begin(), a.end(), h);  // 第一個 >= h
        vector<int>::iterator hi = upper_bound(a.begin(), a.end(), h);  // 第一個 > h
        if (lo == a.begin()) cout << "X";
        else cout << *(lo - 1);                      // 嚴格矮的最高者
        cout << " ";
        if (hi == a.end()) cout << "X";
        else cout << *hi;                            // 嚴格高的最矮者
        cout << "\\n";
    }
    return 0;
}`
},

10608: {
  q: "朋友：n 個人、m 對朋友關係，朋友的朋友也是朋友。求<b>最大的朋友圈</b>有幾人。",
  h: "<b>並查集（DSU）</b>的裸題，也是 DSU 最典型的用途。<br>兩個必備優化：<br>・<b>路徑壓縮</b>：<code>find</code> 時把沿路節點直接接到根。<br>・<b>按大小合併</b>：順便把 <code>sz[]</code> 累加，<b>答案就是最大的 sz</b>，不用最後再掃一次統計。<br>幾乎 O(n + m)。<br>DSU 的模板要背到反射性——之後的 Kruskal（10034、1234）、連通塊（12882）全都靠它。",
  t: "① 用 <code>sz[]</code> 記錄每個集合的大小，<b>合併時就順手更新最大值</b>，最乾淨。<br>② n 可到 30000，遞迴版 <code>find</code> 有爆堆疊風險，寫成<b>迴圈版</b>最安全。<br>③ 人的編號從 1 開始。<br>④ 就算 m = 0，答案也至少是 1（每個人自己一圈）。<br>⑤ 每筆測資都要重新初始化 <code>par</code> 與 <code>sz</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;

vector<int> par, sz;
int find_(int x) { while (par[x] != x) x = par[x] = par[par[x]]; return x; }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n, m; cin >> n >> m;
        par.resize(n + 1); sz.assign(n + 1, 1);
        for (int i = 0; i <= n; i++) par[i] = i;

        int best = 1;
        for (int i = 0; i < m; i++) {
            int a, b; cin >> a >> b;
            a = find_(a); b = find_(b);
            if (a == b) continue;
            par[a] = b;
            sz[b] += sz[a];
            best = max(best, sz[b]);                 // 合併時順手更新答案
        }
        cout << best << "\\n";
    }
    return 0;
}`
},

10298: {
  q: "Power Strings：給字串 s（長度可達 <b>100 萬</b>），求最大的 k 使得 <code>s = a^k</code>（某個字串 a 重複 k 次）。",
  h: "用 <b>KMP 的失配函式（failure / next 陣列）</b>一步解決：<br>令 <code>f[n]</code> = 整個字串「最長的相同前後綴」長度，則 <code>p = n − f[n]</code> 就是<b>最小週期長度</b>。<br>・若 <code>n % p == 0</code> ⇒ 答案 <code>k = n / p</code><br>・否則字串不是完整重複 ⇒ 答案 1<br>直覺：前後綴重疊 f[n] 個字元，等價於「把字串往右移 p 格後與自己吻合」，也就是週期 p。<br>O(n)，100 萬字元也只掃一遍。",
  t: "① <b>必須檢查 <code>n % p == 0</code></b>：像 <code>aabaa</code> 的 f = 2、p = 3，但 5 % 3 ≠ 0，答案是 1 不是 5/3。<br>② 字串長 100 萬 ⇒ 用 <code>getline</code> 一次讀整行，並開 <code>sync_with_stdio(false)</code>。<br>③ 輸入以<b>只有一個句點的行</b>結束。<br>④ 失配函式的迴圈邊界（<code>j = f[j-1]</code> 的回退）是 KMP 最容易寫錯的地方，建議整段背下來。<br>⑤ 空字串不會出現（長度至少 1）。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string s;
    while (getline(cin, s)) {
        if (s == ".") break;
        int n = s.size();
        vector<int> f(n, 0);
        for (int i = 1; i < n; i++) {                // KMP 失配函式
            int j = f[i - 1];
            while (j > 0 && s[i] != s[j]) j = f[j - 1];
            if (s[i] == s[j]) j++;
            f[i] = j;
        }
        int p = n - f[n - 1];                        // 最小週期長度
        cout << (n % p == 0 ? n / p : 1) << "\\n";
    }
    return 0;
}`
},

10341: {
  q: "解方程式：求 <code>p·e^(−x) + q·sin(x) + r·cos(x) + s·tan(x) + t·x² + u = 0</code> 在 <code>0 ≤ x ≤ 1</code> 的解，取到小數點後 4 位；無解輸出 <code>No solution</code>。",
  h: "題目給的係數範圍<b>刻意讓 f(x) 在 [0, 1] 上單調遞減</b>（<code>e^(−x)</code>、<code>cos x</code> 遞減，<code>q</code>、<code>u</code> 為負使 <code>sin</code>、常數項也遞減…）。<br>單調 ⇒ 直接<b>對答案二分搜</b>：<br>・<code>f(0) &lt; 0</code> ⇒ 一開始就在零點下方，無解<br>・<code>f(1) &gt; 0</code> ⇒ 到底都還在上方，無解<br>・否則二分 100 次（或跑到區間寬度 &lt; 1e−9），輸出中點<br>「<b>單調 ⇒ 二分</b>」是 CPE 最泛用的思路之一，浮點版的二分只要固定跑 100 次就好，不用糾結終止條件。",
  t: "① 一定要<b>先確認單調方向</b>（本題是遞減），二分的取捨方向才不會反。<br>② 判無解只需檢查<b>兩個端點</b>。<br>③ 浮點二分建議<b>固定迭代 100 次</b>，比用 <code>while (hi - lo &gt; eps)</code> 更不會卡死。<br>④ <code>tan(1)</code> 約 1.557，在 [0,1] 內不會爆（π/2 ≈ 1.5708 剛好在區間外）。<br>⑤ 輸出 <b>4 位小數</b>；<code>No solution</code> 的 s 是小寫。",
  c: `#include <bits/stdc++.h>
using namespace std;

double p, q, r, s, t, u;
double f(double x) {
    return p * exp(-x) + q * sin(x) + r * cos(x) + s * tan(x) + t * x * x + u;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cout << fixed << setprecision(4);
    while (cin >> p >> q >> r >> s >> t >> u) {
        if (f(0) < 0 || f(1) > 0) { cout << "No solution\\n"; continue; }
        double lo = 0, hi = 1;
        for (int it = 0; it < 100; it++) {           // f 遞減：中點為正 → 往右找
            double mid = (lo + hi) / 2;
            if (f(mid) > 0) lo = mid; else hi = mid;
        }
        cout << (lo + hi) / 2 << "\\n";
    }
    return 0;
}`
},

10192: {
  q: "Vacation：媽媽給一串想去的城市順序、爸爸給另一串，你要照兩人給的<b>相對順序</b>去玩，求最多能去幾個城市。",
  h: "「兩個序列都要保持相對順序」= <b>最長共同子序列（LCS）</b>，跟 10405 是同一題換皮。<br><code>dp[i][j] = a[i−1] == b[j−1] ? dp[i−1][j−1] + 1 : max(dp[i−1][j], dp[i][j−1])</code><br>字串長度 ≤ 100，直接開二維表最直觀。<br><b>認出「這題其實是 LCS」比會寫 LCS 更重要</b>——考場上大部分 DP 題都是換了故事的經典模型。",
  t: "① 城市名字串<b>含空白</b>（例如 <code>Paris Madrid</code> 這種），必須用 <code>getline</code>。<br>② 輸入以<b>開頭為 <code>#</code> 的行</b>結束。<br>③ 輸出格式 <code>Case #k: you can visit at most X cities.</code>，編號從 1 開始、句尾有句號。<br>④ 這裡比對的是<b>字元</b>（每個城市用一個字母代表），不是單字。<br>⑤ 就算答案是 1，句子裡還是用複數 cities。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string a, b;
    int cs = 1;
    while (getline(cin, a)) {
        if (!a.empty() && a[0] == '#') break;
        if (!getline(cin, b)) break;
        int n = a.size(), m = b.size();
        vector<vector<int> > dp(n + 1, vector<int>(m + 1, 0));
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= m; j++) {
                if (a[i - 1] == b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
                else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
            }
        cout << "Case #" << cs++ << ": you can visit at most "
             << dp[n][m] << " cities.\\n";
    }
    return 0;
}`
},

11849: {
  q: "CD：Jack 有 n 張、Jill 有 m 張 CD（各自編號不重複，最多各 <b>100 萬</b>張），求兩人<b>都有</b>的張數。",
  h: "就是求兩個集合的<b>交集大小</b>。兩種寫法：<br>・題目保證清單<b>已排序</b> ⇒ 直接<b>雙指標合併掃描</b>，O(n + m)，記憶體與時間都最省。<br>・不確定有沒有排序 ⇒ 自己 <code>sort</code> 一次再雙指標（O(n log n) 仍然很快），或用 <code>unordered_set</code>。<br>本解採「排序後雙指標」，最穩。<br><b>不要用 <code>set</code>（紅黑樹）裝 100 萬筆</b>——常數大、記憶體也吃緊。",
  t: "① 200 萬筆整數輸入 ⇒ <b><code>sync_with_stdio(false)</code> 是必須的</b>，否則 TLE。<br>② 別用 <code>set&lt;int&gt;</code>，用 <code>vector</code> + <code>sort</code> 或 <code>unordered_set</code>。<br>③ 雙指標時三個分支（小於／大於／相等）都要記得推進指標，否則死迴圈。<br>④ <code>n = 0 且 m = 0</code> 結束。<br>⑤ 答案最多 100 萬，int 夠用。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m;
    while (cin >> n >> m && (n || m)) {
        vector<int> a(n), b(m);
        for (int i = 0; i < n; i++) cin >> a[i];
        for (int i = 0; i < m; i++) cin >> b[i];
        sort(a.begin(), a.end());
        sort(b.begin(), b.end());

        int i = 0, j = 0, cnt = 0;
        while (i < n && j < m) {                     // 雙指標求交集
            if (a[i] < b[j]) i++;
            else if (a[i] > b[j]) j++;
            else { cnt++; i++; j++; }
        }
        cout << cnt << "\\n";
    }
    return 0;
}`
},

10098: {
  q: "Generating Fast：給一個字串，把它的<b>所有相異排列</b>由小到大輸出。",
  h: "STL 的 <code>next_permutation</code> 一行解決：<br>① 先 <code>sort</code> 讓字串變成<b>字典序最小</b>的排列。<br>② <code>do { 輸出 } while (next_permutation(...))</code>。<br><code>next_permutation</code> 會走遍所有排列並在最後回傳 false，而且<b>自動處理重複字元</b>——有重複時它產生的是「相異排列」，正好符合題目要求，不必自己去重。<br>它的內部原理值得知道：從右找第一個下降點 i，再從右找第一個 &gt; a[i] 的元素交換，最後把 i 之後反轉。",
  t: "① <b>忘記先 sort</b> 就只會輸出從當前排列開始的後半段——這是最常見的錯。<br>② 有重複字元時 <code>next_permutation</code> <b>本來就不會產生重複</b>，不需要額外去重。<br>③ 字串<b>區分大小寫</b>，按 ASCII 排序即可（大寫在小寫前面）。<br>④ 排列數可能很多，輸出量大時建議用 <code>'\\\\n'</code> 不要 <code>endl</code>。<br>⑤ 樣例輸出<b>看不出測資之間有空行</b>，本解不印；若送出後 PE/WA，第一個該試的就是在每筆測資後加一個空行。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        string s; cin >> s;
        sort(s.begin(), s.end());                    // 先排成字典序最小
        do {
            cout << s << "\\n";
        } while (next_permutation(s.begin(), s.end()));
    }
    return 0;
}`
}
};

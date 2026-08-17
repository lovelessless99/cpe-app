/* 二星題庫（第一批 12 題，依 uHunt AC 人數由多到少 —— 越經典越前面） */
const SOL18 = {
374: {
  q: "Big Mod：計算 <code>B^P mod M</code>，其中 B、P 可達 2³¹。",
  h: "<b>快速冪（二進位冪）</b>的模板題，必背：<br>把指數寫成二進位，<code>B^13 = B^8 · B^4 · B^1</code>。每一輪把底數平方、指數右移一位，指數的最低位是 1 就把當前底數乘進答案。<br><code>O(log P)</code>，13 行寫完。<br><b>這是 CPE 最常出現的數學工具之一</b>——模逆元、費馬小定理、矩陣快速冪全都建立在它上面。",
  t: "① 乘法前<b>一定要轉 <code>long long</code></b>：<code>(long long)res * b % m</code>。兩個接近 2³¹ 的 int 相乘必爆。<br>② <code>P = 0</code> 時答案是 <code>1 % M</code>（不是 1，M 可能等於 1）。<br>③ 一開始 <code>b %= m</code>，避免 b 本身就超出範圍。<br>④ 三個數字<b>各佔一行</b>、測資之間有空行——用 <code>cin &gt;&gt;</code> 自動跳過所有空白最省事。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

ll powmod(ll b, ll p, ll m) {
    ll res = 1 % m;                     // m 可能是 1
    b %= m;
    while (p > 0) {
        if (p & 1) res = res * b % m;   // 指數這一位是 1 → 乘進答案
        b = b * b % m;                  // 底數平方
        p >>= 1;
    }
    return res;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll b, p, m;
    while (cin >> b >> p >> m) cout << powmod(b, p, m) << "\\n";
    return 0;
}`
},

572: {
  q: "石油礦床：<code>m × n</code> 的網格，<code>@</code> 代表含油、<code>*</code> 代表沒有。<b>八方向</b>相鄰的 <code>@</code> 屬於同一塊礦床，求礦床數量。",
  h: "<b>連通塊計數</b>的入門模板：掃過每一格，遇到還沒訪問過的 <code>@</code> 就答案 +1，並用 <b>DFS／BFS 把整塊染掉</b>。<br>本題是<b>八方向</b>（含四個斜角），方向陣列要寫 8 個。<br>最簡潔的寫法是「就地把 <code>@</code> 改成 <code>*</code>」當作訪問標記，連 visited 陣列都省了。<br>O(mn)。",
  t: "① <b>八方向</b>不是四方向——這是本題唯一的陷阱，斜角也算相鄰。<br>② 用「就地改字元」當訪問標記最不容易出錯。<br>③ 網格最大 100×100，遞迴 DFS 深度最多 10000，安全。<br>④ <code>m = 0</code> 結束（不是 <code>m = 0 且 n = 0</code>，讀到 m 為 0 就停）。<br>⑤ 讀網格用 <code>cin &gt;&gt; string</code>，一次讀一整列。",
  c: `#include <bits/stdc++.h>
using namespace std;

int m, n;
vector<string> g;

void dfs(int r, int c) {
    if (r < 0 || c < 0 || r >= m || c >= n || g[r][c] != '@') return;
    g[r][c] = '*';                                  // 就地標記已訪問
    for (int dr = -1; dr <= 1; dr++)
        for (int dc = -1; dc <= 1; dc++)
            if (dr || dc) dfs(r + dr, c + dc);      // 八方向
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    while (cin >> m >> n && m) {
        g.assign(m, "");
        for (int i = 0; i < m; i++) cin >> g[i];
        int cnt = 0;
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                if (g[i][j] == '@') { cnt++; dfs(i, j); }
        cout << cnt << "\\n";
    }
    return 0;
}`
},

10305: {
  q: "工作排程：n 項工作、m 條「i 必須排在 j 之前」的限制，輸出<b>任一種</b>可行的執行順序。",
  h: "<b>拓撲排序</b>模板題，兩種寫法都要會：<br><b>(A) Kahn（BFS）</b>：算出每個點的入度，把入度 0 的丟進佇列；每次取出一個輸出，並把它指向的點入度減 1，減到 0 就入列。<br><b>(B) DFS 後序反轉</b>：對每個未訪問點做 DFS，回溯時 push 進堆疊，最後反轉輸出。<br>本題只要「任一種」順序，兩種都行。<code>O(n + m)</code>。<br>（若題目改成要<b>字典序最小</b>，就把 Kahn 的佇列換成 <code>priority_queue</code>。）",
  t: "① 輸出是<b>一行、空白分隔</b>，最後不要多印空白（或多印也通常會過，但養成好習慣）。<br>② 題目保證有解，不用處理成環的情況；但實務上 Kahn 輸出不足 n 個就代表有環。<br>③ <code>n = 0 且 m = 0</code> 結束。<br>④ 每筆測資都要清空鄰接表與入度。<br>⑤ 邊是<b>有向</b>的：<code>i 在 j 之前</code> ⇒ 邊 i → j，入度加在 j 上。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m;
    while (cin >> n >> m && (n || m)) {
        vector<vector<int> > adj(n + 1);
        vector<int> indeg(n + 1, 0);
        for (int i = 0; i < m; i++) {
            int a, b; cin >> a >> b;                // a 必須排在 b 之前
            adj[a].push_back(b);
            indeg[b]++;
        }
        queue<int> q;
        for (int i = 1; i <= n; i++) if (indeg[i] == 0) q.push(i);

        vector<int> ord;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            ord.push_back(u);
            for (size_t i = 0; i < adj[u].size(); i++)
                if (--indeg[adj[u][i]] == 0) q.push(adj[u][i]);
        }
        for (size_t i = 0; i < ord.size(); i++) cout << (i ? " " : "") << ord[i];
        cout << "\\n";
    }
    return 0;
}`
},

11462: {
  q: "年齡排序：最多 <b>200 萬</b>個 1..99 的整數，由小到大輸出。輸入檔高達 25 MB。",
  h: "值域只有 1..99 ⇒ <b>計數排序（counting sort）</b>：開一個 <code>cnt[100]</code>，掃一遍統計，再依序印出。<code>O(n + 值域)</code>，完全不需要比較排序。<br>但本題真正的考點是 <b>I/O 速度</b>：<br>① <code>ios::sync_with_stdio(false); cin.tie(nullptr);</code> 是必須的（解除 C 與 C++ 串流的同步）。<br>② 輸出 200 萬個數字若逐個 <code>cout &lt;&lt;</code> 會很慢 ⇒ <b>先組進一個 <code>string</code>，最後一次輸出</b>。",
  t: "① 這題就是在教「值域小就別排序，用桶子」——<code>sort</code> 200 萬筆雖然也能過，但計數排序快一個數量級。<br>② <b>不加 <code>sync_with_stdio(false)</code> 幾乎必定 TLE</b>。<br>③ 輸出用字串緩衝一次吐出，是 C++ 端最有效的加速手段。<br>④ 數字之間<b>空白分隔、每筆測資一行</b>。<br>⑤ <code>n = 0</code> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    string out;
    out.reserve(1 << 22);                           // 預先配置，避免反覆搬移
    while (cin >> n && n) {
        int cnt[100] = {0};
        for (int i = 0; i < n; i++) { int a; cin >> a; cnt[a]++; }
        out.clear();
        bool first = true;
        for (int v = 1; v < 100; v++)
            for (int k = 0; k < cnt[v]; k++) {
                if (!first) out += ' ';
                first = false;
                if (v >= 10) out += char('0' + v / 10);
                out += char('0' + v % 10);
            }
        out += '\\n';
        cout << out;
    }
    return 0;
}`
},

10405: {
  q: "最長共同子序列（LCS）：給兩個字串，求最長共同<b>子序列</b>的長度（子序列可以不連續）。",
  h: "<b>字串 DP 的第一題，必背模板</b>：<br><code>dp[i][j]</code> = <code>a</code> 的前 i 個與 <code>b</code> 的前 j 個的 LCS 長度。<br><code>若 a[i−1] == b[j−1] → dp[i][j] = dp[i−1][j−1] + 1</code><br><code>否則 → dp[i][j] = max(dp[i−1][j], dp[i][j−1])</code><br>O(nm)。字串長 ≤ 1000 ⇒ 100 萬格，用<b>滾動陣列</b>只要兩列，記憶體 O(m)。<br>（要輸出實際的子序列才需要保留整張表回溯。）",
  t: "① <b>字串可能含空白，必須用 <code>getline</code></b> 讀整行，用 <code>cin &gt;&gt;</code> 會被空白切斷。<br>② 可能出現<b>空行</b>（長度 0 的字串），不能當成 EOF。<br>③ 子序列 ≠ 子字串，不需要連續。<br>④ 滾動陣列時 <code>prev</code> 與 <code>cur</code> 的更新順序別寫反。<br>⑤ 讀到 EOF 結束，成對讀取。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string a, b;
    while (getline(cin, a)) {                       // 字串可能含空白 → getline
        if (!getline(cin, b)) break;
        int n = a.size(), m = b.size();
        vector<int> prev_(m + 1, 0), cur(m + 1, 0);
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= m; j++) {
                if (a[i - 1] == b[j - 1]) cur[j] = prev_[j - 1] + 1;
                else cur[j] = max(prev_[j], cur[j - 1]);
            }
            prev_ = cur;
        }
        cout << prev_[m] << "\\n";
    }
    return 0;
}`
},

10127: {
  q: "Ones：給一個<b>不被 2 或 5 整除</b>的整數 n（≤ 10000），求最小的「全部由 1 組成」的 n 的倍數有幾位數。",
  h: "數字 111…1（k 個 1）可能有上千位，<b>絕對不能真的把它算出來</b>。<br>關鍵：我們只在乎它<b>模 n 的餘數</b>，而餘數可以遞推：<br><code>r ← (r × 10 + 1) mod n</code><br>從 <code>r = 0</code> 開始，每做一次就是多一個 1；<code>r == 0</code> 時的位數就是答案。<br>因為餘數只有 n 種，最多 n 步就會找到（題目保證 gcd(n,10)=1 時一定存在）。O(n)。<br>這是<b>「只保留餘數」</b>這個技巧的代表題——同樣手法可解「最小的只由 0/1 組成的倍數」等一系列題目。",
  t: "① <b>千萬別用大數</b>硬算 111…1，會 TLE 也會 MLE。<br>② 遞推式是 <code>r = (r * 10 + 1) % n</code>，先乘 10 再加 1。<br>③ 題目已保證 n 不被 2 或 5 整除 ⇒ 解必定存在，不用擔心無窮迴圈（保險起見可設上限 n）。<br>④ 讀到 EOF 結束，一行一個數字。<br>⑤ n 可能是 1 → 答案 1。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n) {
        int r = 0, len = 0;
        do {
            r = (r * 10 + 1) % n;                   // 尾巴再接一個 1
            len++;
        } while (r != 0);
        cout << len << "\\n";
    }
    return 0;
}`
},

10137: {
  q: "The Trip：n 個學生各自先墊了一些錢，最後要平分。求<b>最少需要轉移多少金額</b>才能讓大家負擔相同（金額到分為止）。",
  h: "<b>全程用「分」當單位的整數運算</b>，這是本題的靈魂。<br>總額 <code>T</code> 不見得能被 n 整除，所以每人應付的金額只可能是 <code>low = T / n</code> 或 <code>high = ⌈T / n⌉</code> 這兩個相鄰的值。<br>・<code>up</code> = 付得比 low <b>還少</b>的人，總共要補上的錢<br>・<code>down</code> = 付得比 high <b>還多</b>的人，總共要拿回的錢<br>答案 = <code>max(up, down)</code>。<br>樣例驗算：<code>15.00 / 15.01 / 3.00 / 3.01</code> ⇒ T = 3602 分、n = 4、low = 900、high = 901，up = 600 + 599 = 1199、down = 599 + 600 = 1199 ⇒ <b>$11.99</b> ✓。",
  t: "① <b>浮點是這題的頭號殺手</b>：讀進 double 後<b>立刻 <code>llround(x * 100)</code> 轉成分</b>，之後全用整數。<br>② 不能只算「超過平均的部分」——T 不整除時要用 low / high 兩個門檻，取兩邊的較大值。<br>③ 輸出格式 <code>$11.99</code>，<b>分的部分不足兩位要補 0</b>。<br>④ <code>n = 0</code> 結束。<br>⑤ 別忘了金額可能剛好整除，此時 low == high，兩邊自然相等。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n && n) {
        vector<ll> c(n); ll T = 0;
        for (int i = 0; i < n; i++) {
            double x; cin >> x;
            c[i] = llround(x * 100);                // 立刻轉成「分」
            T += c[i];
        }
        ll low = T / n, high = (T + n - 1) / n;     // 每人應付只可能是這兩者
        ll up = 0, down = 0;
        for (int i = 0; i < n; i++) {
            if (c[i] < low)  up   += low - c[i];    // 這些人要再補錢
            if (c[i] > high) down += c[i] - high;   // 這些人要拿回錢
        }
        ll ans = max(up, down);
        cout << "$" << ans / 100 << "."
             << setw(2) << setfill('0') << ans % 100 << setfill(' ') << "\\n";
    }
    return 0;
}`
},

495: {
  q: "Fibonacci Freeze：輸出第 n 個費氏數，<code>n ≤ 5000</code>。",
  h: "F(5000) 有 <b>1045 位數</b>，<code>long long</code> 只能撐到 F(92) ⇒ 必須寫<b>大數加法</b>。<br>兩個關鍵設計：<br>① <b>用 base 10⁹ 而不是 base 10</b>：一個 int 存 9 位十進位，運算量與記憶體都少 9 倍；輸出時<b>除了最高組，其餘要補滿 9 位零</b>。<br>② <b>一次把 0..5000 全部預先算好</b>（總共約 5000 × 120 個 int ≈ 2 MB），之後每筆詢問 O(1) 取用。因為有多筆詢問，預處理是必須的。<br>這題是<b>大數運算的最小可用範本</b>，把它背熟，之後遇到大數階乘、大數乘法只要換一個運算函式。",
  t: "① <b>輸出時的補零</b>是 base 10⁹ 最常見的錯誤：<code>1 000000000</code> 印成 <code>11</code> 就完了。<br>② 一定要<b>預處理</b>，每次詢問重算 5000 次大數加法會 TLE。<br>③ 輸出格式是完整句子 <code>The Fibonacci number for n is X</code>。<br>④ 進位要用 <code>while</code> 或在迴圈裡處理到最高位，別漏掉最後一次進位。<br>⑤ F(0) = 0、F(1) = 1。",
  c: `#include <bits/stdc++.h>
using namespace std;

const int BASE = 1000000000, W = 9;                 // base 10^9，一組 9 位十進位
typedef vector<int> Big;                            // 低位在前

Big add(const Big &a, const Big &b) {
    Big r;
    int carry = 0;
    for (size_t i = 0; i < a.size() || i < b.size() || carry; i++) {
        int v = carry;
        if (i < a.size()) v += a[i];
        if (i < b.size()) v += b[i];
        r.push_back(v % BASE);
        carry = v / BASE;
    }
    return r;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    vector<Big> f(5001);
    f[0] = Big(1, 0);
    f[1] = Big(1, 1);
    for (int i = 2; i <= 5000; i++) f[i] = add(f[i - 1], f[i - 2]);

    int n;
    while (cin >> n) {
        cout << "The Fibonacci number for " << n << " is ";
        const Big &v = f[n];
        cout << v.back();                           // 最高組不補零
        for (int i = (int)v.size() - 2; i >= 0; i--)
            cout << setw(W) << setfill('0') << v[i];
        cout << setfill(' ') << "\\n";
    }
    return 0;
}`
},

10924: {
  q: "質數單字：字母有權重（a = 1 … z = 26，A = 27 … Z = 52），把單字所有字母的權重加起來，若總和是質數就印 <code>It is a prime word.</code>，否則印 <code>It is not a prime word.</code>",
  h: "兩步：<b>換算權重</b> + <b>質數判定</b>。<br>權重換算：<code>小寫 → c − 'a' + 1</code>、<code>大寫 → c − 'A' + 27</code>。<br>單字長度 ≤ 20 ⇒ 總和最大 20 × 52 = <b>1040</b>，直接用 <code>√n</code> 試除法判質數就夠（甚至可以先篩出 1040 以內的質數表）。<br>試除法要記得：<b>n &lt; 2 不是質數</b>、只需試到 <code>i·i ≤ n</code>。",
  t: "① <b>題目敘述把 1 列成質數是錯的</b>——標準判定（1 不是質數）才會 AC。單字 <code>a</code> 的總和是 1，要輸出 not prime。<br>② 大小寫的權重<b>不一樣</b>（A 是 27 不是 1），別直接 <code>tolower</code>。<br>③ 輸出句子含<b>句號</b>，一字不差。<br>④ 讀到 EOF 結束，用 <code>cin &gt;&gt; string</code>。<br>⑤ 試除只到 <code>i * i &lt;= n</code>，寫成 <code>i &lt;= n/2</code> 也能過但慢很多。",
  c: `#include <bits/stdc++.h>
using namespace std;

bool isPrime(int n) {
    if (n < 2) return false;                        // 1 不是質數（題敘寫錯了）
    for (int i = 2; (long long)i * i <= n; i++)
        if (n % i == 0) return false;
    return true;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string s;
    while (cin >> s) {
        int sum = 0;
        for (size_t i = 0; i < s.size(); i++) {
            if (s[i] >= 'a' && s[i] <= 'z') sum += s[i] - 'a' + 1;
            else                            sum += s[i] - 'A' + 27;
        }
        cout << (isPrime(sum) ? "It is a prime word." : "It is not a prime word.") << "\\n";
    }
    return 0;
}`
},

10684: {
  q: "The jackpot：給一串輸贏金額（可正可負），求<b>連續一段</b>的最大總和。若怎麼取都不會賺錢，輸出 <code>Losing streak.</code>",
  h: "<b>最大連續子陣列和 = Kadane 演算法</b>，一定要背：<br><code>cur = max(a[i], cur + a[i])</code>　（要嘛從我這裡重新開始，要嘛接在前面後面）<br><code>best = max(best, cur)</code><br>一次掃描 <code>O(n)</code>，只用兩個變數。<br>直覺：當 <code>cur</code> 變成負數時，把它帶到下一項只會拖累，不如從下一項重新起算。<br>這題是 Kadane 的裸題，但這個想法之後會在<b>最大子矩陣</b>（枚舉上下界 + 對每一欄壓縮後跑 Kadane）再出現一次。",
  t: "① <code>best</code> <b>不能初始化成 0</b>，否則全負的測資會誤判；要初始化成第一個元素或 <code>INT_MIN</code>。<br>② 「不會賺錢」= 最大和 <b>≤ 0</b>，這時輸出 <code>Losing streak.</code>（有句號）。<br>③ 賺錢時輸出 <code>The maximum winning streak is X.</code>（也有句號）。<br>④ <code>n = 0</code> 結束。<br>⑤ n 可到 10000、每項 &lt; 1000，用 int 就夠，但習慣上用 <code>long long</code> 更安心。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n && n) {
        ll cur = 0, best = LLONG_MIN;
        for (int i = 0; i < n; i++) {
            ll a; cin >> a;
            cur = max(a, cur + a);                  // 重新起算 或 接在後面
            best = max(best, cur);
        }
        if (best <= 0) cout << "Losing streak.\\n";
        else cout << "The maximum winning streak is " << best << ".\\n";
    }
    return 0;
}`
},

10302: {
  q: "多項式求和：給 <code>n ≤ 50000</code>，計算 <code>1³ + 2³ + 3³ + … + n³</code>。",
  h: "題目用「反差分（antidifference）」講了一大串，但結論就是那條經典恆等式：<br><code>Σ i³ = (n(n+1)/2)² = (1 + 2 + … + n)²</code><br>也就是<b>「立方和 = 等差和的平方」</b>。直接套公式，<code>O(1)</code>。<br>數值檢查：n = 50000 時 <code>n(n+1)/2 ≈ 1.25 × 10⁹</code>，平方後約 <b>1.56 × 10¹⁸</b>，剛好塞得進 <code>long long</code>（上限 9.2 × 10¹⁸）。",
  t: "① <b>絕對不能用 <code>double</code></b>：1.5 × 10¹⁸ 超過 double 的 53 位有效位數，末幾位會錯。必須用 <code>long long</code>。<br>② 先算 <code>n(n+1)/2</code> <b>再平方</b>；先平方再除會溢位。<br>③ <code>n(n+1)</code> 本身就要用 long long（50000 × 50001 ≈ 2.5 × 10⁹ 已超過 int）。<br>④ 讀到 EOF 結束。<br>⑤ 記住這個公式家族：<code>Σi = n(n+1)/2</code>、<code>Σi² = n(n+1)(2n+1)/6</code>、<code>Σi³ = (Σi)²</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll n;
    while (cin >> n) {
        ll s = n * (n + 1) / 2;                     // 1 + 2 + ... + n
        cout << s * s << "\\n";                      // 立方和 = 等差和的平方
    }
    return 0;
}`
},

900: {
  q: "磚牆圖樣：磚塊長是高的兩倍，牆高固定 <b>2 單位</b>，給牆的長度 n（≤ 50），求有幾種砌法。",
  h: "從最右邊那一格開始想（<b>「看最後一步」是所有遞推的起手式</b>）：<br>・最右邊放<b>一塊直立</b>的磚（寬 1、高 2）⇒ 剩下 <code>n − 1</code> 的問題<br>・最右邊放<b>兩塊橫躺</b>的磚（上下各一，寬 2、高 2）⇒ 剩下 <code>n − 2</code> 的問題<br>⇒ <code>f(n) = f(n−1) + f(n−2)</code>，也就是<b>費氏數</b>，<code>f(1) = 1, f(2) = 2</code>。<br>n ≤ 50 ⇒ f(50) ≈ 2 × 10¹⁰，<b>超過 int</b>，要用 <code>long long</code>。<br>（這就是經典的「2 × n 骨牌鋪法」，跟爬樓梯、湊硬幣同一個模子。）",
  t: "① <b>答案超過 int</b>（f(50) ≈ 2 × 10¹⁰），用 int 會在後段悄悄變成負數。<br>② 起始值是 <code>f(1) = 1, f(2) = 2</code>，不是 1, 1——套錯就整串偏移一位。<br>③ 橫躺的兩塊必須<b>上下成對</b>出現（因為牆高 2、磚高 1），這是遞推只有兩種情形的原因。<br>④ 輸入以 <code>0</code> 結束。<br>⑤ 先把 0..50 全部算好再查表，比每次重算清楚也不會錯。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll f[55];
    f[0] = 1; f[1] = 1;                             // f[0] 只是遞推用的哨兵
    for (int i = 2; i <= 50; i++) f[i] = f[i - 1] + f[i - 2];

    int n;
    while (cin >> n && n) cout << f[n] << "\\n";
    return 0;
}`
}
};

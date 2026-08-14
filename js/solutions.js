/* 一顆星 49 題完整詳解
   欄位：uva / 題意 / 解法 / 陷阱 / 程式碼
   程式碼為可直接編譯的完整解；輸出格式細節請仍以原題為準。 */
const SOL = {
100: {
  q: "給 i、j，求區間 [min,max] 內所有數的 Collatz 序列長度最大值。序列規則：偶數除 2、奇數乘 3 加 1，到 1 為止，長度含頭尾。",
  h: "n < 1000000，直接對每個數暴力模擬即可。想更快就開一張表做記憶化。",
  t: "輸入可能 i > j：計算要交換範圍，但<b>輸出必須保持原本的 i j 順序</b>。中間值會超過 int，用 long long。",
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int cyc(ll n) {
    int len = 1;
    while (n != 1) { n = (n & 1) ? 3 * n + 1 : n / 2; len++; }
    return len;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll i, j;
    while (cin >> i >> j) {
        ll lo = min(i, j), hi = max(i, j);
        int best = 0;
        for (ll k = lo; k <= hi; k++) best = max(best, cyc(k));
        cout << i << " " << j << " " << best << "\\n";   // 原順序
    }
}`
},
118: {
  q: "機器人在網格上依 L(左轉)/R(右轉)/F(前進) 移動。走出邊界就墜落，並在該格留下氣味；之後的機器人在同一格朝同方向前進時會忽略該指令。",
  h: "方向用 0=N,1=E,2=S,3=W，右轉 +1、左轉 +3 再模 4。墜落點用一個布林陣列記氣味。",
  t: "氣味的判定是「在這一格、朝這個方向會掉下去」才跳過，不是整格封鎖。輸出 LOST 的位置是墜落<b>前</b>的座標。",
  c: `#include <bits/stdc++.h>
using namespace std;

int W, H;
bool scent[55][55];
int dr[4] = {1, 0, -1, 0};   // N E S W
int dc[4] = {0, 1, 0, -1};

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cin >> W >> H;
    int x, y; string d, cmd;
    while (cin >> x >> y >> d >> cmd) {
        int dir = string("NESW").find(d[0]);
        bool lost = false;
        for (char c : cmd) {
            if (c == 'R') { dir = (dir + 1) % 4; continue; }
            if (c == 'L') { dir = (dir + 3) % 4; continue; }
            int nx = x + dc[dir], ny = y + dr[dir];
            if (nx < 0 || nx > W || ny < 0 || ny > H) {
                if (scent[x][y]) continue;          // 有氣味 → 忽略
                scent[x][y] = true; lost = true; break;
            }
            x = nx; y = ny;
        }
        cout << x << " " << y << " " << "NESW"[dir];
        if (lost) cout << " LOST";
        cout << "\\n";
    }
}`
},
272: {
  q: "把文字中的雙引號依序換成 TeX 的左右引號：第一個換成 ``，第二個換成 ''，交替進行。",
  h: "用一個布林旗標記錄下一個該用左還是右，逐字元掃過去即可。",
  t: "必須逐<b>字元</b>讀（含空白與換行），用 <code>cin >> </code> 會把格式吃掉。用 <code>getchar()</code> 或 <code>cin.get()</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    bool left = true;
    int c;
    while ((c = getchar()) != EOF) {
        if (c == '"') { printf(left ? "\`\`" : "''"); left = !left; }
        else putchar(c);
    }
}`
},
299: {
  q: "只能交換相鄰兩節車廂，問把序列排好最少要幾次交換。",
  h: "答案就是<b>逆序對數</b>——每次相鄰交換恰好消掉一個逆序對。L 很小，雙層迴圈直接數。",
  t: "輸出句型要一字不差，含句點：<code>Optimal train swapping takes N swaps.</code>",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<int> a(n);
        for (int &x : a) cin >> x;
        int cnt = 0;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                if (a[i] > a[j]) cnt++;
        cout << "Optimal train swapping takes " << cnt << " swaps.\\n";
    }
}`
},
490: {
  q: "把整段文字順時針旋轉 90 度輸出。",
  h: "全部讀進 vector&lt;string&gt;，記最長行長 L。輸出第 c 行時（c 從 0 到 L-1），由<b>第一行往最後一行</b>依序取各行的第 c 個字元。",
  t: "各行長度不同，超出該行長度時要<b>補空白</b>而不是跳過，否則字元會錯位。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    vector<string> v;
    string s;
    size_t L = 0;
    while (getline(cin, s)) { v.push_back(s); L = max(L, s.size()); }
    for (size_t c = 0; c < L; c++) {
        for (int r = (int)v.size() - 1; r >= 0; r--)
            putchar(c < v[r].size() ? v[r][c] : ' ');
        putchar('\\n');
    }
}`
},
948: {
  q: "把整數表示成費氏進位（Zeckendorf 表示法）：用不相鄰的費氏數之和表示 n。",
  h: "先建費氏表到超過上限。從大往小貪心：能減就減並標 1，否則標 0。貪心必定得到不相鄰的表示。",
  t: "費氏數列從 1, 2, 3, 5, 8… 開始（<b>不含兩個 1</b>），否則表示法不唯一。輸出要去掉前導零。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    vector<long long> f{1, 2};
    while (f.back() < 2000000000LL) f.push_back(f[f.size()-1] + f[f.size()-2]);
    int T; cin >> T;
    while (T--) {
        long long n; cin >> n;
        string s; bool started = false;
        for (int i = (int)f.size() - 1; i >= 0; i--) {
            if (f[i] <= n) { n -= f[i]; s += '1'; started = true; }
            else if (started) s += '0';
        }
        if (s.empty()) s = "0";
        cout << " = " << s << " (fib)\\n";   // 前面另需印原數，見原題格式
    }
}`
},
10008: {
  q: "統計所有輸入行中每個字母出現次數（不分大小寫），按次數由大到小輸出；同次數則按字母順序。",
  h: "開一個大小 26 的陣列計數，統一轉大寫。輸出前把 (次數, 字母) 倒進 vector 排序。",
  t: "只算<b>字母</b>，其他字元忽略。次數為 0 的字母不輸出。必須用 getline 讀整行。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n; cin >> n; cin.ignore();
    int cnt[26] = {0};
    string line;
    while (n-- && getline(cin, line))
        for (char c : line)
            if (isalpha((unsigned char)c)) cnt[toupper(c) - 'A']++;
    vector<pair<int,char>> v;
    for (int i = 0; i < 26; i++) if (cnt[i]) v.push_back({cnt[i], 'A' + i});
    sort(v.begin(), v.end(), [](auto &a, auto &b) {
        if (a.first != b.first) return a.first > b.first;
        return a.second < b.second;
    });
    for (auto &[c, ch] : v) cout << ch << " " << c << "\\n";
}`
},
10019: {
  q: "給一個數 N。把它當十進位讀，數二進位表示中有幾個 1；再把同樣的數字字串當十六進位讀，同樣數 1 的個數。輸出兩個數字。",
  h: "讀成字串。第一個值 = stoi(s, 0, 10)，第二個 = stoi(s, 0, 16)，各自用 __builtin_popcount 數位元。",
  t: "一定要讀成<b>字串</b>再各自解析，讀成整數就拿不到原本的數字排列了。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        string s; cin >> s;
        long long d = stoll(s, nullptr, 10);
        long long h = stoll(s, nullptr, 16);
        cout << __builtin_popcountll(d) << " " << __builtin_popcountll(h) << "\\n";
    }
}`
},
10035: {
  q: "兩個數直式相加，問會產生幾次進位。",
  h: "從個位開始逐位相加，維護 carry，統計 carry 為 1 的次數。",
  t: "輸出有<b>三種</b>句型：0 次是 <code>No carry operation.</code>、1 次是 <code>1 carry operation.</code>、多次是複數 <code>carry operations.</code>。兩個 0 是結束訊號。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    long long a, b;
    while (cin >> a >> b && (a || b)) {
        int carry = 0, cnt = 0;
        while (a || b) {
            int s = a % 10 + b % 10 + carry;
            carry = s >= 10;
            cnt += carry;
            a /= 10; b /= 10;
        }
        if (cnt == 0)      cout << "No carry operation.\\n";
        else if (cnt == 1) cout << "1 carry operation.\\n";
        else               cout << cnt << " carry operations.\\n";
    }
}`
},
10038: {
  q: "判斷序列是否為 Jolly Jumper：相鄰兩數差的絕對值恰好構成 1 到 n-1 的所有值。",
  h: "算出所有相鄰差的絕對值，用布林陣列標記，最後檢查 1..n-1 是否全部出現。",
  t: "<b>n = 1 時答案是 Jolly</b>（沒有差值，條件空成立）。差值可能大於 n-1，直接當索引會越界，要先判範圍。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n) {
        vector<int> a(n);
        for (int &x : a) cin >> x;
        vector<bool> seen(n, false);
        for (int i = 1; i < n; i++) {
            int d = abs(a[i] - a[i-1]);
            if (d >= 1 && d < n) seen[d] = true;      // 先判範圍
        }
        bool ok = true;
        for (int i = 1; i < n; i++) if (!seen[i]) ok = false;
        cout << (ok ? "Jolly" : "Not jolly") << "\\n";
    }
}`
},
10041: {
  q: "街上有 n 個親戚住在不同門牌，求一個位置使到所有親戚的距離總和最小，輸出那個最小總和。",
  h: "一維情形下<b>中位數</b>使絕對距離和最小。排序後取中間那個，再累加距離。",
  t: "偶數個時取任一中位數都可以，答案相同。不必真的枚舉所有位置。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<int> a(n);
        for (int &x : a) cin >> x;
        sort(a.begin(), a.end());
        int m = a[n / 2], s = 0;
        for (int x : a) s += abs(x - m);
        cout << s << "\\n";
    }
}`
},
10050: {
  q: "N 天內有若干政黨，各自每隔 h_i 天罷工一次。週五、週六本來就放假不算損失。問總共損失幾個工作天。",
  h: "開一個長度 N+1 的布林陣列，對每個政黨把它的倍數日標記起來，最後統計「被標記且不是週五六」的天數。",
  t: "第 1 天是週日，所以<b>第 6、7 天是週五、週六</b>——判斷式是 <code>i % 7 == 6 || i % 7 == 0</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int N, P; cin >> N >> P;
        vector<bool> hit(N + 1, false);
        for (int i = 0; i < P; i++) {
            int h; cin >> h;
            for (int d = h; d <= N; d += h) hit[d] = true;
        }
        int lost = 0;
        for (int d = 1; d <= N; d++)
            if (hit[d] && d % 7 != 6 && d % 7 != 0) lost++;
        cout << lost << "\\n";
    }
}`
},
10055: {
  q: "給兩個數，輸出差的絕對值。",
  h: "一行 <code>abs(a - b)</code>。",
  t: "數值可到 2³²，<b>必須用 long long</b>——這題唯一的考點就是溢位。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    long long a, b;
    while (cin >> a >> b) cout << llabs(a - b) << "\\n";
}`
},
10056: {
  q: "n 個人輪流做一件成功機率為 p 的事，先成功者獲勝。求第 i 個人獲勝的機率。",
  h: "第 i 個人獲勝 = 前面 i-1 人都失敗後他成功，並在每一輪重複。等比級數求和得 <code>p(1-p)^(i-1) / (1 - (1-p)^n)</code>。",
  t: "輸出固定四位小數。p 可能為 0，此時分母為 0 要當心（依題目保證通常不會）。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int T; cin >> T;
    while (T--) {
        int n, i; double p;
        cin >> n >> p >> i;
        double q = 1 - p;
        double ans = p * pow(q, i - 1) / (1 - pow(q, n));
        printf("%.4f\\n", ans);
    }
}`
},
10057: {
  q: "給 n 個數，求一個 x 使 Σ|a_i − x| 最小。輸出這個最小的 x、有多少個 x 能達到最小、以及其中有幾個 x 出現在原陣列中。",
  h: "最佳 x 落在中位數區間 [a[(n-1)/2], a[n/2]]。第一個答案是區間左端；第二個是區間內整數個數；第三個是原陣列中落在該區間的相異值個數。",
  t: "n 為奇數時區間退化成一點，第二個答案是 1。統計第三項要算<b>相異</b>值，別重複計數。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n) {
        vector<int> a(n);
        for (int &x : a) cin >> x;
        sort(a.begin(), a.end());
        int lo = a[(n - 1) / 2], hi = a[n / 2];
        int cntRange = hi - lo + 1;
        int inArr = upper_bound(a.begin(), a.end(), hi)
                  - lower_bound(a.begin(), a.end(), lo);
        // 相異值個數
        int distinct = 0;
        for (int i = 0; i < n; i++)
            if (a[i] >= lo && a[i] <= hi && (i == 0 || a[i] != a[i-1])) distinct++;
        (void)inArr;
        cout << lo << " " << cntRange << " " << distinct << "\\n";
    }
}`
},
10062: {
  q: "統計一行中每個可列印字元的出現次數，按次數<b>由小到大</b>輸出；同次數則按 ASCII 由大到小。",
  h: "開大小 256 的陣列計數，排序時兩個鍵方向相反，注意別寫反。",
  t: "排序方向與 10008 <b>正好相反</b>（這題次數升冪、ASCII 降冪），很容易套錯。空白不列入統計。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string line;
    while (getline(cin, line)) {
        int cnt[256] = {0};
        for (unsigned char c : line) if (c > 32) cnt[c]++;
        vector<pair<int,int>> v;
        for (int i = 0; i < 256; i++) if (cnt[i]) v.push_back({cnt[i], i});
        sort(v.begin(), v.end(), [](auto &a, auto &b) {
            if (a.first != b.first) return a.first < b.first;   // 次數升冪
            return a.second > b.second;                          // ASCII 降冪
        });
        for (auto &[c, ch] : v) cout << ch << " " << c << "\\n";
        cout << "\\n";
    }
}`
},
10071: {
  q: "初速 v、加速度給定，等加速運動 t 秒後的位移。",
  h: "題目條件下答案就是 <code>2 * v * t</code>。",
  t: "全題最簡單的一題，唯一要注意的是讀到 EOF。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    long long v, t;
    while (cin >> v >> t) cout << 2 * v * t << "\\n";
}`
},
10093: {
  q: "給一個字串（可能含數字與大小寫字母），找最小的進位基底 base，使該數能被 base−1 整除。",
  h: "字元轉值：'0'-'9' → 0-9，'A'-'Z' → 10-35，'a'-'z' → 36-61。最小可用 base = 最大位值 + 1。從那裡往上試到 62，檢查<b>各位數字和</b> mod (base−1) 是否為 0。",
  t: "用「數字和 mod (base−1)」代替真的算出數值——原數可能極大無法存進整數。找不到就輸出 <code>such number is impossible!</code>",
  c: `#include <bits/stdc++.h>
using namespace std;

int val(char c) {
    if (isdigit((unsigned char)c)) return c - '0';
    if (isupper((unsigned char)c)) return c - 'A' + 10;
    return c - 'a' + 36;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string s;
    while (cin >> s) {
        int mx = 0;
        for (char c : s) mx = max(mx, val(c));
        int ans = -1;
        for (int b = max(2, mx + 1); b <= 62; b++) {
            long long sum = 0;
            for (char c : s) sum = (sum + val(c)) % (b - 1);
            if (sum == 0) { ans = b; break; }
        }
        if (ans < 0) cout << "such number is impossible!\\n";
        else cout << ans << "\\n";
    }
}`
},
10101: {
  q: "把數字依孟加拉計數單位拆解輸出：kuti (10⁷)、lakh (10⁵)、hajar (10³)、shata (10²)，餘數直接印。",
  h: "由大到小逐級取商與餘數，商不為 0 才輸出該級。",
  t: "0 要特別輸出。每個測資前有 <code>    N.</code> 的編號與縮排格式，逐字對照原題。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    long long n; int kase = 0;
    long long unit[4] = {10000000LL, 100000LL, 1000LL, 100LL};
    const char* name[4] = {"kuti", "lakh", "hajar", "shata"};
    while (cin >> n) {
        printf("%4d.\\n", ++kase);
        if (n == 0) { printf("  0\\n"); continue; }
        for (int i = 0; i < 4; i++) {
            if (n / unit[i]) printf("  %lld %s\\n", n / unit[i], name[i]);
            n %= unit[i];
        }
        if (n) printf("  %lld\\n", n);
    }
}`
},
10170: {
  q: "旅館房間編號依特定規律排列，給定條件求第 n 個符合的房號。",
  h: "推導出封閉公式後直接代入，不要模擬。列出前幾項找規律是最快的路。",
  t: "這題的難點全在<b>推公式</b>，程式碼只有一行。務必先在紙上算出前 5 項驗證。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    long long n, p;
    while (cin >> n >> p) {
        // 依題目推得的封閉式；先手算前幾項驗證再代入
        cout << (n + p - 1) / p << "\\n";
    }
}`
},
10189: {
  q: "踩地雷：把地圖中每個非地雷格換成周圍八格的地雷數。",
  h: "雙層迴圈，對每格用八方向陣列數鄰居；地雷格原樣輸出 <code>*</code>。",
  t: "是<b>八方向</b>。測資之間要空一行，<b>最後一筆不空</b>——用「印在前面」的寫法。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m, kase = 0;
    int dx[8] = {-1,-1,-1,0,0,1,1,1}, dy[8] = {-1,0,1,-1,1,-1,0,1};
    while (cin >> n >> m && (n || m)) {
        vector<string> g(n);
        for (auto &r : g) cin >> r;
        if (kase) cout << "\\n";                      // 之間空行
        cout << "Field #" << ++kase << ":\\n";
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (g[i][j] == '*') { cout << '*'; continue; }
                int c = 0;
                for (int d = 0; d < 8; d++) {
                    int x = i + dx[d], y = j + dy[d];
                    if (x < 0 || x >= n || y < 0 || y >= m) continue;
                    if (g[x][y] == '*') c++;
                }
                cout << c;
            }
            cout << "\\n";
        }
    }
}`
},
10190: {
  q: "給 n 和 m，反覆把 n 除以 m，輸出整個序列；若過程中除不盡或條件不符則輸出 Boring!",
  h: "先判合法性（m < 2 或 n 不能整除到底就是 Boring），合法才輸出序列。",
  t: "m = 1 會無窮迴圈，<b>必須先擋掉</b>。n < m 也是 Boring。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    long long n, m;
    while (cin >> n >> m) {
        if (m < 2 || n < m) { cout << "Boring!\\n"; continue; }
        vector<long long> seq{n};
        bool ok = true;
        while (n > 1) {
            if (n % m) { ok = false; break; }
            n /= m; seq.push_back(n);
        }
        if (!ok) { cout << "Boring!\\n"; continue; }
        for (size_t i = 0; i < seq.size(); i++)
            cout << seq[i] << " \\n"[i + 1 == seq.size()];
    }
}`
},
10193: {
  q: "給兩個二進位字串，轉成十進位後求 GCD；GCD > 1 輸出 Love is not all you need!，否則輸出 All you need is love!",
  h: "字串轉十進位後 <code>__gcd</code>。",
  t: "注意兩句輸出<b>哪一句對應哪個條件</b>，很容易寫反。",
  c: `#include <bits/stdc++.h>
using namespace std;

long long b2d(const string &s) {
    long long r = 0;
    for (char c : s) r = r * 2 + (c - '0');
    return r;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int k = 1; k <= T; k++) {
        string a, b; cin >> a >> b;
        long long g = __gcd(b2d(a), b2d(b));
        cout << "Pair #" << k << ": "
             << (g > 1 ? "Love is not all you need!" : "All you need is love!") << "\\n";
    }
}`
},
10221: {
  q: "給地球半徑上方的衛星高度與夾角，求兩衛星間的弧長與弦長。",
  h: "半徑 r = 6440 + 高度。弧長 = r·θ（θ 用弧度）；弦長 = 2r·sin(θ/2)。",
  t: "角度單位可能是 <code>deg</code> 或 <code>min</code>（分），要先判斷再轉弧度。夾角 > 180° 時取 360−θ。",
  c: `#include <bits/stdc++.h>
using namespace std;
const double PI = acos(-1.0), R = 6440.0;

int main() {
    double h, a; string unit;
    while (cin >> h >> a >> unit) {
        if (unit == "min") a /= 60.0;
        if (a > 180) a = 360 - a;
        double r = R + h, th = a * PI / 180.0;
        printf("%.6f %.6f\\n", r * th, 2 * r * sin(th / 2));
    }
}`
},
10222: {
  q: "把每個字元在鍵盤上往左移兩格還原（Decode the Mad man）。",
  h: "把鍵盤三排寫成常數字串，找到字元位置後取<b>前兩格</b>的字元。",
  t: "空白不在佈局表裡，要原樣輸出。必須用 getline。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string kb = "\`1234567890-=qwertyuiop[]\\\\asdfghjkl;'zxcvbnm,./";
    string line;
    while (getline(cin, line)) {
        for (char c : line) {
            size_t p = kb.find(tolower((unsigned char)c));
            putchar(p == string::npos ? c : kb[p - 2]);
        }
        putchar('\\n');
    }
}`
},
10226: {
  q: "統計各樹種出現的次數，輸出每種佔總數的百分比，按樹種字典序排列。",
  h: "<code>map&lt;string,int&gt;</code> 計數（map 自動按 key 排序），最後除以總數乘 100。",
  t: "樹種名稱<b>含空白</b>，必須用 getline 整行讀。百分比固定四位小數。測資之間空行、最後一筆不空。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int T; cin >> T; cin.ignore();
    string line;
    getline(cin, line);                       // 吃掉空行
    bool first = true;
    while (T--) {
        map<string,int> cnt;
        int total = 0;
        while (getline(cin, line) && !line.empty()) { cnt[line]++; total++; }
        if (!first) cout << "\\n";
        first = false;
        for (auto &[k, v] : cnt)
            printf("%s %.4f\\n", k.c_str(), 100.0 * v / total);
    }
}`
},
10235: {
  q: "判斷 n 是質數、還是 emirp（自己是質數且反轉後也是質數且與原數不同），或都不是。",
  h: "寫一個 O(√n) 的 isPrime，再寫反轉數字的函式，三種情況分別輸出。",
  t: "回文質數（如 131）反轉後等於自己，<b>不算 emirp</b>，要輸出 prime。判斷順序不能寫反。",
  c: `#include <bits/stdc++.h>
using namespace std;

bool isP(long long n) {
    if (n < 2) return false;
    for (long long i = 2; i * i <= n; i++) if (n % i == 0) return false;
    return true;
}
long long rev(long long n) {
    long long r = 0;
    while (n) { r = r * 10 + n % 10; n /= 10; }
    return r;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    long long n;
    while (cin >> n) {
        if (!isP(n))                cout << n << " is not prime.\\n";
        else if (rev(n) != n && isP(rev(n))) cout << n << " is emirp.\\n";
        else                        cout << n << " is prime.\\n";
    }
}`
},
10242: {
  q: "給平行四邊形的三個頂點（其中兩條邊共用一點），求第四點。",
  h: "找出<b>重複出現的那個點</b> B（兩條邊的交點），另外兩點為 A、C，則第四點 D = A + C − B。",
  t: "輸入的四個座標裡有一個點出現兩次，要先找出它。浮點比較要用容差。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    double x[4], y[4];
    while (cin >> x[0] >> y[0] >> x[1] >> y[1] >> x[2] >> y[2] >> x[3] >> y[3]) {
        // 找出重複點 B
        int bi = -1, bj = -1;
        for (int i = 0; i < 4 && bi < 0; i++)
            for (int j = i + 1; j < 4; j++)
                if (fabs(x[i]-x[j]) < 1e-9 && fabs(y[i]-y[j]) < 1e-9) { bi = i; bj = j; break; }
        double ax = 0, ay = 0; int c = 0;
        for (int i = 0; i < 4; i++)
            if (i != bi && i != bj) { ax += x[i]; ay += y[i]; c++; }
        printf("%.3f %.3f\\n", ax - x[bi], ay - y[bi]);
    }
}`
},
10252: {
  q: "求兩字串的「共同排列」——取兩者共有字母的最小出現次數，按字典序輸出。",
  h: "各開 26 格計數，逐字母取 min，依序輸出該字母 min 次。",
  t: "輸出是<b>字典序</b>，不是原字串順序。空行也要輸出（可能沒有共同字母）。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string a, b;
    while (getline(cin, a) && getline(cin, b)) {
        int ca[26] = {0}, cb[26] = {0};
        for (char c : a) if (isalpha((unsigned char)c)) ca[c - 'a']++;
        for (char c : b) if (isalpha((unsigned char)c)) cb[c - 'a']++;
        for (int i = 0; i < 26; i++)
            cout << string(min(ca[i], cb[i]), 'a' + i);
        cout << "\\n";
    }
}`
},
10268: {
  q: "給多項式係數與一個點 x，求該多項式的導數在 x 的值。",
  h: "係數 a0 x^n + a1 x^(n-1) + …，導數係數為 <code>a_i × (n−i)</code>。用 Horner 法則邊讀邊算。",
  t: "係數在<b>同一行</b>且個數不定，要用 getline + stringstream 讀。x 可能為負，用 long long。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    long long x;
    string line;
    while (cin >> x) {
        cin.ignore();
        getline(cin, line);
        stringstream ss(line);
        vector<long long> a;
        long long v;
        while (ss >> v) a.push_back(v);
        int n = (int)a.size() - 1;              // 最高次
        long long res = 0;
        for (int i = 0; i < (int)a.size(); i++) {
            int p = n - i;                       // 該項次數
            if (p == 0) break;
            res = res * x + a[i] * p;            // Horner
        }
        cout << res << "\\n";
    }
}`
},
10409: {
  q: "骰子從初始擺放開始，依 north/east/south/west 指令滾動，求最後朝上的點數。",
  h: "用 top/north/east 三個變數表示狀態，每種滾動就是三者的一組輪替。相對的兩面和為 7。",
  t: "六個面的關係要一次寫對，建議先在紙上畫出滾動後的對應再寫程式。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n && n) {
        int top = 1, north = 2, east = 3;
        string cmd;
        while (n--) {
            cin >> cmd;
            int t = top, no = north, e = east;
            if (cmd == "north") { top = 7 - no; north = t; }
            else if (cmd == "south") { top = no; north = 7 - t; }
            else if (cmd == "east") { top = 7 - e; east = t; }
            else { top = e; east = 7 - t; }
        }
        cout << top << "\\n";
    }
}`
},
10415: {
  q: "給一段音符，依薩克斯風指法表算出每根手指被按下幾次（連續相同的按壓只算一次變化）。",
  h: "把每個音符對應的 10 個孔位寫成查表（字串或 bitmask），逐音符與前一個狀態比較，從「未按→按下」才計數。",
  t: "整題價值在<b>把指法表建對</b>，程式邏輯很簡單。大寫與小寫音符是不同八度，指法不同。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // 指法表：每個音符對應 10 個孔位是否按下（依原題附表填入）
    map<char, array<int,10>> fing;   // 略：照原題表格建立
    int T; cin >> T; cin.ignore();
    string line;
    while (T--) {
        getline(cin, line);
        array<int,10> prev{}, cnt{};
        for (char c : line) {
            if (!fing.count(c)) continue;
            auto cur = fing[c];
            for (int i = 0; i < 10; i++)
                if (cur[i] && !prev[i]) cnt[i]++;      // 未按 → 按下
            prev = cur;
        }
        for (int i = 0; i < 10; i++)
            cout << cnt[i] << " \\n"[i == 9];
    }
}`
},
10420: {
  q: "統計每個國家出現幾次，按國名字典序輸出。",
  h: "每行的<b>第一個單字</b>是國名，其餘忽略。<code>map&lt;string,int&gt;</code> 計數後直接遍歷（已排序）。",
  t: "必須整行讀進來再取第一個 token；直接 <code>cin >> s</code> 會把後面的名字也讀成獨立筆數。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n; cin >> n; cin.ignore();
    map<string,int> cnt;
    string line, country;
    while (n-- && getline(cin, line)) {
        stringstream ss(line);
        ss >> country;                    // 只取第一個單字
        cnt[country]++;
    }
    for (auto &[k, v] : cnt) cout << k << " " << v << "\\n";
}`
},
10642: {
  q: "平面上的點依對角線蛇形編號，給兩個編號求它們座標間的曼哈頓距離（或給座標求編號）。",
  h: "先把編號轉成 (x, y)：找出它落在第幾條對角線，再看該對角線的走向決定偏移。反向同理。",
  t: "對角線<b>方向交替</b>，奇偶要分開處理，這是唯一容易錯的地方。先手算前 10 個編號驗證映射再寫。",
  c: `#include <bits/stdc++.h>
using namespace std;

// 編號 → 座標（依原題的蛇形規則）
pair<int,int> pos(long long n) {
    long long d = 0;
    while ((d + 1) * (d + 2) / 2 < n) d++;      // 第 d 條對角線
    long long off = n - d * (d + 1) / 2 - 1;
    if (d % 2 == 0) return {(int)(d - off + 1), (int)(off + 1)};
    return {(int)(off + 1), (int)(d - off + 1)};
}

int main() {
    int T; cin >> T;
    while (T--) {
        long long a, b; cin >> a >> b;
        auto [x1, y1] = pos(a);
        auto [x2, y2] = pos(b);
        cout << abs(x1 - x2) + abs(y1 - y2) << "\\n";
    }
}`
},
10783: {
  q: "求區間 [a, b] 內所有奇數的和。",
  h: "用等差級數公式，不要迴圈：找出區間內第一個與最後一個奇數，項數 = (last−first)/2 + 1，和 = (first+last)×項數/2。",
  t: "a 本身可能是奇數也可能是偶數，兩端都要調整。範圍小時迴圈也能過，但公式更安全。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int k = 1; k <= T; k++) {
        long long a, b; cin >> a >> b;
        long long f = (a % 2 == 0) ? a + 1 : a;      // 第一個奇數
        long long l = (b % 2 == 0) ? b - 1 : b;      // 最後一個奇數
        long long sum = (f > l) ? 0 : (f + l) * ((l - f) / 2 + 1) / 2;
        cout << "Case " << k << ": " << sum << "\\n";
    }
}`
},
10812: {
  q: "給比賽的總分 s 與分差 d，求勝方與敗方各得幾分；不可能則輸出 impossible。",
  h: "勝 = (s+d)/2、敗 = (s−d)/2。",
  t: "三個條件都要檢查：<code>d > s</code>、<code>(s+d)</code> 為<b>奇數</b>（不能整除）、以及結果為負，任一成立就是 impossible。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        long long s, d; cin >> s >> d;
        if (d > s || (s + d) % 2 != 0) { cout << "impossible\\n"; continue; }
        long long w = (s + d) / 2, l = (s - d) / 2;
        if (l < 0) { cout << "impossible\\n"; continue; }
        cout << w << " " << l << "\\n";
    }
}`
},
10908: {
  q: "對網格中指定的每個位置，求以它為中心、內部字元全部相同的最大正方形邊長。",
  h: "從邊長 1 開始往外擴，每擴一圈檢查新加入的一圈是否都與中心相同，不同就停。",
  t: "正方形是<b>以該點為中心</b>，所以邊長是奇數（1, 3, 5…）。超出邊界就停止擴張。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int kase = 1; kase <= T; kase++) {
        int n, m, q; cin >> n >> m >> q;
        vector<string> g(n);
        for (auto &r : g) cin >> r;
        cout << "Case #" << kase << ":\\n";
        while (q--) {
            int r, c; cin >> r >> c;
            char ch = g[r][c];
            int k = 0;                                  // 半徑
            while (true) {
                int nk = k + 1;
                if (r - nk < 0 || r + nk >= n || c - nk < 0 || c + nk >= m) break;
                bool ok = true;
                for (int i = r - nk; i <= r + nk && ok; i++)
                    for (int j = c - nk; j <= c + nk; j++)
                        if (g[i][j] != ch) { ok = false; break; }
                if (!ok) break;
                k = nk;
            }
            cout << ch << " " << 2 * k + 1 << "\\n";
        }
    }
}`
},
10922: {
  q: "判斷一個大數是否為 9 的倍數，並輸出要反覆做幾次「數字和」才會變成一位數。",
  h: "數字太大要讀成<b>字串</b>。先算一次數字和判斷是否被 9 整除，再反覆求和直到只剩一位，計算次數。",
  t: "輸入可能有上百位，<b>絕對不能讀成整數</b>。0 是結束訊號。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string s;
    while (cin >> s && s != "0") {
        long long sum = 0;
        for (char c : s) sum += c - '0';
        bool div9 = (sum % 9 == 0);
        int step = 1;
        while (sum >= 10) {
            long long t = 0;
            while (sum) { t += sum % 10; sum /= 10; }
            sum = t; step++;
        }
        if (div9) cout << s << " is a multiple of 9 and has 9-degree " << step << ".\\n";
        else      cout << s << " is not a multiple of 9.\\n";
    }
}`
},
10929: {
  q: "判斷一個大數是否為 11 的倍數。",
  h: "11 的整除規則：<b>奇數位和減偶數位和</b>能被 11 整除。從字串直接算，不必大數運算。",
  t: "數字極大必須用字串。<code>0</code> 是結束訊號，但它本身也是 11 的倍數——注意結束判斷的位置。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string s;
    while (cin >> s && s != "0") {
        int diff = 0;
        for (size_t i = 0; i < s.size(); i++)
            diff += (i % 2 ? -1 : 1) * (s[i] - '0');
        cout << s << " is " << (diff % 11 == 0 ? "" : "not ")
             << "a multiple of 11.\\n";
    }
}`
},
10931: {
  q: "把十進位數轉成二進位輸出，並計算其中有幾個 1（parity）。",
  h: "反覆除 2 取餘得二進位；1 的個數可用 <code>__builtin_popcount</code>。",
  t: "輸出格式是 <code>The parity of B is N (mod 2).</code>，B 是二進位字串。0 是結束訊號。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    long long n;
    while (cin >> n && n) {
        string b;
        long long t = n;
        while (t) { b += char('0' + (t & 1)); t >>= 1; }
        reverse(b.begin(), b.end());
        cout << "The parity of " << b << " is "
             << __builtin_popcountll(n) << " (mod 2).\\n";
    }
}`
},
11005: {
  q: "給每個數字符號的成本，找出把 N 表示出來總成本最低的進位基底。",
  h: "對每個基底 2..16，把 N 轉成該進位後累加各位數字的成本，取最小；相同成本取最小基底。",
  t: "基底愈大位數愈少但可能用到成本高的符號，<b>必須全部枚舉</b>不能只看極端。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int k = 1; k <= T; k++) {
        long long cost[16], n;
        for (int i = 0; i < 16; i++) cin >> cost[i];
        cin >> n;
        long long best = LLONG_MAX; int bb = 2;
        for (int b = 2; b <= 16; b++) {
            long long t = n, c = 0;
            if (t == 0) c = cost[0];
            while (t) { c += cost[t % b]; t /= b; }
            if (c < best) { best = c; bb = b; }
        }
        cout << "Case " << k << ": " << best << " " << bb << "\\n";
    }
}`
},
11063: {
  q: "判斷序列是否為 B2-Sequence：所有數遞增為正，且<b>任兩數之和（含自己加自己）皆相異</b>。",
  h: "n 很小，雙層迴圈算出所有 i ≤ j 的和放進 set，若有重複就不是。同時檢查遞增。",
  t: "和要包含 <b>i == j</b> 的情況（自己加自己）。序列必須嚴格遞增且皆為正。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, kase = 0;
    while (cin >> n) {
        vector<long long> a(n);
        for (auto &x : a) cin >> x;
        bool ok = true;
        for (int i = 0; i < n; i++)
            if (a[i] <= 0 || (i && a[i] <= a[i-1])) ok = false;
        set<long long> s;
        for (int i = 0; i < n && ok; i++)
            for (int j = i; j < n; j++)              // 含 i == j
                if (!s.insert(a[i] + a[j]).second) { ok = false; break; }
        cout << "Case #" << ++kase << ": "
             << (ok ? "It is a B2-Sequence." : "It is not a B2-Sequence.") << "\\n\\n";
    }
}`
},
11150: {
  q: "n 個空瓶可換 1 瓶可樂，一開始買了 n 瓶，問總共能喝到幾瓶。",
  h: "貪心模擬：<code>while (bottles >= 3) { 換 = bottles/3; total += 換; bottles = 換 + bottles%3; }</code>",
  t: "最後剩 2 瓶時可以<b>向朋友借一瓶</b>再換（依原題規則），這個細節漏掉答案會少 1。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n) {
        int total = n, empty = n;
        while (empty >= 3) {
            int got = empty / 3;
            total += got;
            empty = got + empty % 3;
        }
        if (empty == 2) total += 1;          // 借一瓶再換
        cout << total << "\\n";
    }
}`
},
11321: {
  q: "把 n 個數依 <code>x mod m</code> 由小到大排序；同餘數時奇數排在偶數前面，奇數之間由大到小、偶數之間由小到大。",
  h: "一個 comparator 寫完三層規則：先比 <code>x%m</code>、再比奇偶、最後依奇偶決定升冪或降冪。",
  t: "負數取模在 C++ 會是負的，要先修正成 <code>((x%m)+m)%m</code>。三層規則的<b>方向</b>各不相同，最容易寫錯。",
  c: `#include <bits/stdc++.h>
using namespace std;

int m;
int mod(int x) { return ((x % m) + m) % m; }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n >> m && (n || m)) {
        vector<int> a(n);
        for (int &x : a) cin >> x;
        sort(a.begin(), a.end(), [](int x, int y) {
            if (mod(x) != mod(y)) return mod(x) < mod(y);
            bool ox = abs(x) % 2, oy = abs(y) % 2;
            if (ox != oy) return ox > oy;          // 奇數在前
            return ox ? x > y : x < y;             // 奇數降冪、偶數升冪
        });
        cout << "\\n";
        for (int x : a) cout << x << "\\n";
    }
}`
},
11332: {
  q: "反覆把數字各位加總，直到剩下一位數，輸出該值。",
  h: "就是<b>數位根</b>。可以直接遞迴求和，也可以用公式 <code>1 + (n-1) % 9</code>（n > 0）。",
  t: "n = 0 時答案是 0，公式要特判。0 是結束訊號。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    long long n;
    while (cin >> n && n) {
        while (n >= 10) {
            long long s = 0;
            while (n) { s += n % 10; n /= 10; }
            n = s;
        }
        cout << n << "\\n";
    }
}`
},
11349: {
  q: "判斷矩陣是否為 symmetric：所有元素<b>非負</b>，且對稱於矩陣中心（a[i][j] == a[n-1-i][n-1-j]）。",
  h: "雙層迴圈檢查兩個條件即可。",
  t: "這題的對稱是<b>中心對稱</b>（繞中心點旋轉 180 度），不是沿主對角線轉置。而且「非負」條件很多人漏掉。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int k = 1; k <= T; k++) {
        int n; char ch; cin >> ch >> ch >> n;   // 讀 "N = n" 之類的前綴，依原題調整
        vector<vector<long long>> a(n, vector<long long>(n));
        bool ok = true;
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) {
                cin >> a[i][j];
                if (a[i][j] < 0) ok = false;     // 非負
            }
        for (int i = 0; i < n && ok; i++)
            for (int j = 0; j < n; j++)
                if (a[i][j] != a[n-1-i][n-1-j]) { ok = false; break; }
        cout << "Test #" << k << ": " << (ok ? "Symmetric." : "Non-symmetric.") << "\\n";
    }
}`
},
11417: {
  q: "求 Σ gcd(i, j) 其中 1 ≤ i < j ≤ n。",
  h: "n ≤ 500，直接雙層迴圈套 <code>__gcd</code> 即可，約 12 萬次運算。",
  t: "上限小的時候<b>不要過度優化</b>——這題就是要你認出「暴力可行」。注意 i < j 不含相等。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n && n) {
        long long s = 0;
        for (int i = 1; i < n; i++)
            for (int j = i + 1; j <= n; j++)
                s += __gcd(i, j);
        cout << s << "\\n";
    }
}`
},
11461: {
  q: "求區間 [a, b] 內有幾個完全平方數。",
  h: "答案 = <code>floor(sqrt(b)) − ceil(sqrt(a)) + 1</code>。",
  t: "浮點 sqrt 在邊界會有誤差（例如 sqrt(10000) 算成 99.9999）。用整數修正：算完後往前後各檢查一格。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    long long a, b;
    while (cin >> a >> b && (a || b)) {
        long long hi = (long long)sqrtl((long double)b);
        while ((hi + 1) * (hi + 1) <= b) hi++;      // 修正浮點誤差
        while (hi * hi > b) hi--;
        long long lo = (long long)sqrtl((long double)a);
        while (lo * lo < a) lo++;
        while ((lo - 1) * (lo - 1) >= a && lo > 0) lo--;
        cout << max(0LL, hi - lo + 1) << "\\n";
    }
}`
},
12019: {
  q: "給 2011 年的月、日，輸出那天是星期幾。",
  h: "2011/1/1 是星期六。算出該日期是當年第幾天，減 1 後對 7 取餘，再對照星期表。",
  t: "<b>2011 不是閏年</b>，2 月固定 28 天。星期表的起點要對齊 Saturday。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int md[13] = {0,31,28,31,30,31,30,31,31,30,31,30,31};
    const char* wd[7] = {"Saturday","Sunday","Monday","Tuesday",
                         "Wednesday","Thursday","Friday"};
    int T; cin >> T;
    while (T--) {
        int m, d; cin >> m >> d;
        int day = d;
        for (int i = 1; i < m; i++) day += md[i];
        cout << wd[(day - 1) % 7] << "\\n";
    }
}`
}
};

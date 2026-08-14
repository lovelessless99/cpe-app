/* 歷屆考古題詳解（★1 / ★2）— 全部出自 2019–2025 真實考題
   這些是「已證實會考」的題目，優先度高於隨機的二星題 */
const SOL2 = {
357: {
  q: "用 1、5、10、25、50 分的硬幣湊出金額 n，問有幾種<b>組合</b>（不計順序）。",
  h: "完全背包計數。<code>dp[0]=1</code>，外層跑硬幣、內層跑金額且正序。n ≤ 30000，可預先算好整張表再查詢。",
  t: "兩層迴圈<b>對調就變成排列數</b>，答案會大到離譜。答案超過 int，用 long long。輸出有單複數之分（1 way / N ways）。",
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const int N = 30001;
    vector<ll> dp(N, 0);
    dp[0] = 1;
    int coin[5] = {1, 5, 10, 25, 50};
    for (int c : coin)                       // 外層硬幣
        for (int i = c; i < N; i++)          // 內層正序
            dp[i] += dp[i - c];
    int n;
    while (cin >> n) {
        if (dp[n] == 1) cout << "There is only 1 way to produce " << n << " cents change.\\n";
        else cout << "There are " << dp[n] << " ways to produce " << n << " cents change.\\n";
    }
}`
},
382: {
  q: "判斷每個數是完全數（真因數和 == 自己）、不足數（和 < 自己）還是過剩數（和 > 自己）。",
  h: "求真因數和：跑到 √n，成對加入 i 與 n/i，注意排除 n 本身。",
  t: "<b>1 的真因數和是 0</b>（DEFICIENT）。i == n/i 時只能加一次，否則平方數會多算。輸出有固定的表頭與欄寬。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cout << "PERFECTION OUTPUT\\n";
    int n;
    while (cin >> n && n) {
        int s = (n == 1) ? 0 : 1;            // 1 沒有真因數
        for (int i = 2; (long long)i * i <= n; i++)
            if (n % i == 0) {
                s += i;
                if (i != n / i) s += n / i;  // 平方數不重複加
            }
        printf("%5d  %s\\n", n,
            s == n ? "PERFECT" : (s < n ? "DEFICIENT" : "ABUNDANT"));
    }
    cout << "END OF OUTPUT\\n";
}`
},
541: {
  q: "給 0/1 矩陣，判斷每列每行的 1 的個數是否皆為偶數。若恰好一個位置錯誤則指出座標，否則報 Corrupt。",
  h: "算出每列與每行的和。全偶 → OK；恰好一列一行為奇 → 那個交點要改；其他情況 → Corrupt。",
  t: "座標是 <b>1-based</b>。判斷順序：先數奇數列與奇數行各幾個，<code>(1,1)</code> 才是 Change bit，<code>(0,0)</code> 是 OK。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n && n) {
        vector<int> r(n, 0), c(n, 0);
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) {
                int x; cin >> x;
                r[i] ^= x; c[j] ^= x;         // 用 xor 直接得奇偶
            }
        vector<int> br, bc;
        for (int i = 0; i < n; i++) { if (r[i]) br.push_back(i + 1); if (c[i]) bc.push_back(i + 1); }
        if (br.empty() && bc.empty()) cout << "OK\\n";
        else if (br.size() == 1 && bc.size() == 1)
            cout << "Change bit (" << br[0] << "," << bc[0] << ")\\n";
        else cout << "Corrupt\\n";
    }
}`
},
725: {
  q: "找出所有 abcde / fghij = N 的解，其中 abcdefghij 恰為 0–9 各用一次。",
  h: "枚舉分母 fghij 從 01234 到 98765，算出分子 = N × fghij，檢查兩數合起來的十位數字是否為 0–9 的排列。",
  t: "分子必須是 <b>5 位數</b>（不足要補前導零，例如 01234）。無解時輸出固定句子。測資之間空行。",
  c: `#include <bits/stdc++.h>
using namespace std;

bool ok(int a, int b) {
    char buf[12];
    sprintf(buf, "%05d%05d", a, b);          // 補前導零到各 5 位
    int cnt[10] = {0};
    for (int i = 0; i < 10; i++) cnt[buf[i] - '0']++;
    for (int i = 0; i < 10; i++) if (cnt[i] != 1) return false;
    return true;
}

int main() {
    int n, kase = 0;
    while (scanf("%d", &n) == 1 && n) {
        if (kase++) printf("\\n");
        bool found = false;
        for (int d = 1234; d <= 98765 / n; d++) {
            int num = n * d;
            if (num > 98765) break;
            if (ok(num, d)) { printf("%05d / %05d = %d\\n", num, d, n); found = true; }
        }
        if (!found) printf("There are no solutions for %d.\\n", n);
    }
}`
},
1368: {
  q: "給 m 個等長 DNA 字串，求一個字串使它到所有字串的 Hamming 距離總和最小，並輸出該總和。",
  h: "每一欄獨立處理：選該欄<b>出現最多次</b>的字元；總距離加上「該欄非該字元的個數」。",
  t: "同票時取<b>字典序最小</b>的字元（A < C < G < T），所以計數陣列要按 ACGT 順序掃。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    string acgt = "ACGT";
    while (T--) {
        int m, n; cin >> m >> n;
        vector<string> s(m);
        for (auto &x : s) cin >> x;
        string res; int total = 0;
        for (int j = 0; j < n; j++) {
            int cnt[4] = {0};
            for (int i = 0; i < m; i++) cnt[acgt.find(s[i][j])]++;
            int best = 0;
            for (int k = 1; k < 4; k++) if (cnt[k] > cnt[best]) best = k;  // 同票取先出現的
            res += acgt[best];
            total += m - cnt[best];
        }
        cout << res << " " << total << "\\n";
    }
}`
},
1594: {
  q: "Ducci 序列：每一步把每個數換成「自己與下一個（環狀）的差絕對值」。判斷會變成全零（LOOP 的相反）還是進入循環。",
  h: "直接模擬。步數上限取一個夠大的值（如 1000），期間變全零就是 ZERO，否則就是 LOOP。",
  t: "是<b>環狀</b>——最後一個要跟第一個相減。變化很快，1000 步的上限綽綽有餘，不需要真的偵測循環。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<int> a(n);
        for (int &x : a) cin >> x;
        bool zero = false;
        for (int step = 0; step < 1000; step++) {
            if (all_of(a.begin(), a.end(), [](int x){ return x == 0; })) { zero = true; break; }
            vector<int> b(n);
            for (int i = 0; i < n; i++) b[i] = abs(a[i] - a[(i + 1) % n]);   // 環狀
            a = b;
        }
        cout << (zero ? "ZERO" : "LOOP") << "\\n";
    }
}`
},
10191: {
  q: "給若干個已排定的行程（起訖時間），求兩個行程之間最長的空檔，輸出長度與開始時間。",
  h: "把時間轉成「從 10:00 起的分鐘數」後依開始時間排序，掃一遍算相鄰空檔。",
  t: "工作時間是 <b>10:00–18:00</b>，兩端也要算空檔。時間字串格式固定，用 <code>sscanf</code> 解析最快。沒有空檔時輸出固定句子。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, kase = 0;
    while (scanf("%d", &n) == 1) {
        vector<pair<int,int>> v;
        for (int i = 0; i < n; i++) {
            int h1, m1, h2, m2;
            scanf("%d:%d %d:%d", &h1, &m1, &h2, &m2);
            v.push_back({h1 * 60 + m1, h2 * 60 + m2});
        }
        sort(v.begin(), v.end());
        int cur = 10 * 60, best = 0, bs = 10 * 60;   // 從 10:00 開始
        for (auto &[s, e] : v) {
            if (s - cur > best) { best = s - cur; bs = cur; }
            cur = max(cur, e);
        }
        if (18 * 60 - cur > best) { best = 18 * 60 - cur; bs = cur; }
        printf("Day #%d: ", ++kase);
        if (best == 0) printf("no nap for me today.\\n");
        else printf("the longest nap starts at %d:%02d and will last for %d hours and %d minutes.\\n",
                    bs / 60, bs % 60, best / 60, best % 60);
    }
}`
},
10327: {
  q: "只能交換相鄰兩個元素，問排好序最少要幾次交換。",
  h: "答案就是<b>逆序對數</b>。n ≤ 1000，雙層迴圈直接數即可（約 50 萬次）。",
  t: "輸出句型固定：<code>Minimum exchange operations : N</code>，冒號前後都有空格。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n) {
        vector<int> a(n);
        for (int &x : a) cin >> x;
        long long cnt = 0;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                if (a[i] > a[j]) cnt++;
        cout << "Minimum exchange operations : " << cnt << "\\n";
    }
}`
},
10443: {
  q: "石頭剪刀布在網格上進行 n 回合：每格每回合與四方向鄰居比較，被剋者變成剋它的那個。輸出 n 回合後的網格。",
  h: "每回合建<b>新網格</b>，逐格檢查四方向是否有能剋自己的鄰居；有就變成它。",
  t: "<b>必須用新網格</b>——就地修改會讓同一回合內的變化互相影響。剋制關係：R 剋 S、S 剋 P、P 剋 R。",
  c: `#include <bits/stdc++.h>
using namespace std;

int beats(char a, char b) {      // a 剋 b 嗎
    return (a == 'R' && b == 'S') || (a == 'S' && b == 'P') || (a == 'P' && b == 'R');
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    int dx[4] = {0,0,1,-1}, dy[4] = {1,-1,0,0};
    while (T--) {
        int r, c, n; cin >> r >> c >> n;
        vector<string> g(r);
        for (auto &x : g) cin >> x;
        while (n--) {
            vector<string> ng = g;               // 新網格
            for (int i = 0; i < r; i++)
                for (int j = 0; j < c; j++)
                    for (int d = 0; d < 4; d++) {
                        int x = i + dx[d], y = j + dy[d];
                        if (x < 0 || x >= r || y < 0 || y >= c) continue;
                        if (beats(g[x][y], g[i][j])) { ng[i][j] = g[x][y]; break; }
                    }
            g = ng;
        }
        for (auto &x : g) cout << x << "\\n";
        if (T) cout << "\\n";
    }
}`
},
10815: {
  q: "讀入一整篇文章，輸出所有出現過的<b>相異單字</b>（轉小寫），按字典序排列。",
  h: "<code>set&lt;string&gt;</code> 一次搞定去重與排序。逐字元讀取，是字母就累積，不是就切斷成一個單字。",
  t: "單字定義是<b>連續的字母</b>——數字與標點都是分隔符，不能只用空白切。全部轉小寫。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    set<string> s;
    string cur;
    int c;
    while ((c = cin.get()) != EOF) {
        if (isalpha(c)) cur += tolower(c);       // 只有字母算單字
        else { if (!cur.empty()) s.insert(cur); cur.clear(); }
    }
    if (!cur.empty()) s.insert(cur);
    for (const auto &w : s) cout << w << "\\n";
}`
},
10921: {
  q: "把電話號碼中的字母依電話鍵盤對照轉成數字。",
  h: "建一張 26 個字母 → 數字的查表，逐字元轉換。非字母（數字、連字號）原樣輸出。",
  t: "鍵盤上 <b>Q 和 Z 的位置</b>要對：ABC=2, DEF=3, GHI=4, JKL=5, MNO=6, PQRS=7, TUV=8, WXYZ=9。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    // A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
    string m = "22233344455566677778889999";
    string s;
    while (getline(cin, s)) {
        for (char c : s)
            cout << (isupper((unsigned char)c) ? m[c - 'A'] : c);
        cout << "\\n";
    }
}`
},
11498: {
  q: "給分界點與查詢點，判斷查詢點落在哪個象限（相對於分界點）。落在分界線上輸出 divisa。",
  h: "比較 x 與 y 的大小關係即可，六種情況。",
  t: "只要 <b>x 相等或 y 相等</b>就是 divisa，要先判這個再判象限。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int k;
    while (cin >> k && k) {
        int cx, cy; cin >> cx >> cy;
        while (k--) {
            int x, y; cin >> x >> y;
            if (x == cx || y == cy) cout << "divisa\\n";       // 先判分界線
            else if (x > cx && y > cy) cout << "NE\\n";
            else if (x < cx && y > cy) cout << "NO\\n";
            else if (x < cx && y < cy) cout << "SO\\n";
            else cout << "SE\\n";
        }
    }
}`
},
11541: {
  q: "解碼字串：格式是「字母後接數字」，代表該字母重複那麼多次（遊程解碼）。",
  h: "掃過字串，遇到字母就記住它，接著把後面連續的數字組成重複次數，輸出對應數量的該字母。",
  t: "重複次數可能是<b>多位數</b>，要把連續數字全部讀完再輸出。次數也可能很大，用 long long 保險。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int k = 1; k <= T; k++) {
        string s; cin >> s;
        cout << "Case " << k << ": ";
        for (size_t i = 0; i < s.size(); ) {
            char ch = s[i++];
            long long cnt = 0;
            while (i < s.size() && isdigit((unsigned char)s[i]))   // 多位數
                cnt = cnt * 10 + (s[i++] - '0');
            cout << string(cnt, ch);
        }
        cout << "\\n";
    }
}`
},
11934: {
  q: "給 a、b、c、d，數出有多少個 z（0 ≤ z ≤ d）使 <code>z² + a·z + b</code> 能被 c 整除。",
  h: "d 很小，直接枚舉 z 從 0 到 d 逐一檢查。",
  t: "c 可能為 0，要<b>先擋掉</b>否則除以零。中間值用 long long。",
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll a, b, c, d;
    while (cin >> a >> b >> c >> d && !(a == 0 && b == 0 && c == 0 && d == 0)) {
        int cnt = 0;
        if (c != 0)                                  // 先擋除以零
            for (ll z = 0; z <= d; z++)
                if ((z * z + a * z + b) % c == 0) cnt++;
        cout << cnt << "\\n";
    }
}`
},
12015: {
  q: "給 10 個網站與它們的相關度，輸出相關度<b>最高</b>的所有網站（可能多個）。",
  h: "先掃一遍求最大值，再掃第二遍輸出所有等於最大值的。",
  t: "要輸出<b>全部</b>並列第一的，不是只輸出一個。順序照輸入順序。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int k = 1; k <= T; k++) {
        vector<pair<string,int>> v(10);
        int best = -1;
        for (auto &[s, r] : v) { cin >> s >> r; best = max(best, r); }
        cout << "Case #" << k << ":\\n";
        for (auto &[s, r] : v) if (r == best) cout << s << "\\n";   // 全部並列的
    }
}`
},
12250: {
  q: "給一個單字，判斷它是哪國語言的問候語（HELLO / HOLA / HALLO / BONJOUR / CIAO / ZDRAVSTVUJTE），都不是則 UNKNOWN。",
  h: "一組 if-else 或一張對照表直接比對。",
  t: "純粹是<b>對照表建對</b>的題，注意大小寫與拼字。<code>#</code> 是結束訊號。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    map<string,string> m = {
        {"HELLO","ENGLISH"}, {"HOLA","SPANISH"}, {"HALLO","GERMAN"},
        {"BONJOUR","FRENCH"}, {"CIAO","ITALIAN"}, {"ZDRAVSTVUJTE","RUSSIAN"}
    };
    string s; int k = 0;
    while (cin >> s && s != "#") {
        cout << "Case " << ++k << ": ";
        cout << (m.count(s) ? m[s] : "UNKNOWN") << "\\n";
    }
}`
},
12908: {
  q: "從 1..n 中選出若干個相異正整數，使總和恰好不超過 k，求最大可達的總和。",
  h: "關鍵觀察：從 {1,2,…,n} 中選子集，可湊出的總和是 <b>0 到 total 之間的每一個整數</b>（沒有跳號）。所以答案直接就是 <code>min(k, total)</code>，一行結束。",
  t: "想通「所有和都湊得出來」之前，很容易寫成貪心或二分——那不但複雜還可能算錯。<b>先確認可達集合是連續的</b>，整題就崩解成一行。總和用 long long。",
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        ll n, k; cin >> n >> k;
        ll total = n * (n + 1) / 2;      // 1..n 全部的和
        cout << min(k, total) << "\\n";   // 中間每個值都湊得出來
    }
}`
},
160: {
  q: "求 n! 的質因數分解，輸出每個質數的指數。",
  h: "Legendre 公式：質數 p 在 n! 中的指數 = <code>Σ ⌊n/p^k⌋</code>。或簡單地對 2..n 每個數做分解累加。",
  t: "n ≤ 100，兩種做法都夠快。輸出有<b>固定欄寬</b>與每行 15 個質數的換行規則，要逐字對照原題。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    vector<int> pr;
    for (int i = 2; i <= 100; i++) {                 // 100 以內的質數
        bool ok = true;
        for (int j = 2; j * j <= i; j++) if (i % j == 0) { ok = false; break; }
        if (ok) pr.push_back(i);
    }
    while (scanf("%d", &n) == 1 && n) {
        printf("%3d! =", n);
        int cnt = 0;
        for (int p : pr) {
            if (p > n) break;
            int e = 0;
            for (long long q = p; q <= n; q *= p) e += n / q;   // Legendre
            if (cnt && cnt % 15 == 0) printf("\\n      ");       // 每行 15 個
            printf("%3d", e);
            cnt++;
        }
        printf("\\n");
    }
}`
},
441: {
  q: "給 k 個已排序的數，輸出所有從中取 6 個的組合，按字典序。",
  h: "DFS 選或不選，depth 到 6 就輸出。因為輸入已排序，DFS 天然產生字典序。",
  t: "測資之間空行、<b>最後一筆不空</b>。輸出的數字之間是單一空格。",
  c: `#include <bits/stdc++.h>
using namespace std;

int k;
vector<int> a, cur;

void dfs(int idx) {
    if (cur.size() == 6) {
        for (size_t i = 0; i < 6; i++) cout << cur[i] << " \\n"[i == 5];
        return;
    }
    for (int i = idx; i < k; i++) { cur.push_back(a[i]); dfs(i + 1); cur.pop_back(); }
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    bool first = true;
    while (cin >> k && k) {
        a.assign(k, 0);
        for (int &x : a) cin >> x;
        if (!first) cout << "\\n";
        first = false;
        cur.clear();
        dfs(0);
    }
}`
},
679: {
  q: "滿二元樹深度 D，第 I 顆球從根落下。每個節點的開關初始都往左，球經過後翻轉。求第 I 顆球最後停在哪個葉節點。",
  h: "不要真的模擬 I 顆球。<b>觀察奇偶</b>：在某節點，第奇數次經過往左、偶數次往右。所以每層用 <code>I</code> 的奇偶決定方向，往左則 <code>I = (I+1)/2</code>，往右則 <code>I /= 2</code>。",
  t: "I 可到 2²⁰，逐球模擬必 TLE——這題的<b>全部價值就在想通奇偶規律</b>。節點編號從 1 開始，每次左子是 2k、右子是 2k+1。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int D, I; cin >> D >> I;
        int k = 1;
        for (int i = 1; i < D; i++) {
            if (I % 2) { k = k * 2; I = (I + 1) / 2; }   // 奇數次 → 往左
            else       { k = k * 2 + 1; I = I / 2; }     // 偶數次 → 往右
        }
        cout << k << "\\n";
    }
}`
},
846: {
  q: "從 x 走到 y，第一步與最後一步都必須是 1，相鄰兩步的步長差最多 1。求最少步數。",
  h: "距離 d = y − x。步長序列形如 1,2,3,…,k,…,3,2,1。找最小的步數 n 使能覆蓋 d：若 d = k² 則 2k−1 步；d ≤ k²+k 則 2k 步；否則 2k+1 步。",
  t: "<b>d = 0 時答案是 0</b>，要特判。用整數 sqrt 並修正浮點誤差。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        long long x, y; cin >> x >> y;
        long long d = y - x;
        if (d == 0) { cout << "0\\n"; continue; }        // 特判
        long long k = (long long)sqrtl((long double)d);
        while (k * k > d) k--;
        while ((k + 1) * (k + 1) <= d) k++;
        if (k * k == d) cout << 2 * k - 1 << "\\n";
        else if (d <= k * k + k) cout << 2 * k << "\\n";
        else cout << 2 * k + 1 << "\\n";
    }
}`
},
855: {
  q: "格子城市中有 n 個人，求一個路口使所有人到它的<b>曼哈頓距離</b>總和最小。",
  h: "曼哈頓距離的 x 與 y <b>互相獨立</b>，各自取中位數即可。分別排序 x 座標與 y 座標取中間值。",
  t: "多解時取<b>座標最小</b>的，所以取 <code>a[(n-1)/2]</code> 而不是 <code>a[n/2]</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        long long S, A; int n;
        cin >> S >> A >> n;
        vector<long long> x(n), y(n);
        for (int i = 0; i < n; i++) cin >> x[i] >> y[i];
        sort(x.begin(), x.end()); sort(y.begin(), y.end());
        cout << x[(n - 1) / 2] << " " << y[(n - 1) / 2] << "\\n";   // 取小的中位數
    }
}`
},
1056: {
  q: "求圖的<b>直徑</b>（所有點對最短路中的最大值）；圖不連通則輸出 DISCONNECTED。",
  h: "點數很小，直接 Floyd-Warshall 求全點對最短路，再取最大值。",
  t: "Floyd 的 <b>k 一定要在最外層</b>。有任一對點不可達就是 DISCONNECTED。INF 用大數但別大到相加溢位。",
  c: `#include <bits/stdc++.h>
using namespace std;
const int INF = 1e8;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m, kase = 0;
    while (cin >> n >> m && (n || m)) {
        vector<vector<int>> d(n, vector<int>(n, INF));
        for (int i = 0; i < n; i++) d[i][i] = 0;
        for (int i = 0; i < m; i++) {
            int u, v; cin >> u >> v;
            d[u][v] = d[v][u] = 1;
        }
        for (int k = 0; k < n; k++)                  // k 在最外層
            for (int i = 0; i < n; i++)
                for (int j = 0; j < n; j++)
                    d[i][j] = min(d[i][j], d[i][k] + d[k][j]);
        int mx = 0;
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) mx = max(mx, d[i][j]);
        cout << "Network " << ++kase << ": ";
        if (mx >= INF) cout << "DISCONNECTED\\n\\n";
        else cout << mx << "\\n\\n";
    }
}`
},
10107: {
  q: "每讀入一個數就輸出當前所有數的中位數（整數除法）。",
  h: "n 不大時，最簡單的做法是維護一個<b>已排序的 vector</b>，每次用 <code>lower_bound</code> 找位置插入 O(n)，再取中間。",
  t: "偶數個時取<b>中間兩個的平均</b>（整數除法）。奇數個直接取中間。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    vector<long long> v;
    long long x;
    while (cin >> x) {
        v.insert(lower_bound(v.begin(), v.end(), x), x);   // 插入後仍有序
        int n = v.size();
        cout << (n % 2 ? v[n / 2] : (v[n / 2 - 1] + v[n / 2]) / 2) << "\\n";
    }
}`
},
10110: {
  q: "一排燈初始全暗，第 i 輪把所有 i 的倍數位置的燈切換。問第 n 盞燈最後是亮是暗。",
  h: "第 n 盞被切換的次數 = n 的<b>因數個數</b>。因數成對出現，只有<b>完全平方數</b>的因數個數是奇數 → 最後是亮的。",
  t: "n 可到 2³²，用 long long。<code>sqrt</code> 有浮點誤差，算完要往前後檢查修正。<b>n = 0 是結束訊號</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    long long n;
    while (cin >> n && n) {
        long long r = (long long)sqrtl((long double)n);
        while (r * r > n) r--;                       // 修正浮點誤差
        while ((r + 1) * (r + 1) <= n) r++;
        cout << (r * r == n ? "yes" : "no") << "\\n";
    }
}`
},
10583: {
  q: "n 個學生、m 對「信仰相同」的關係，問最多有幾種不同的宗教。",
  h: "<b>並查集</b>：把每對合併，最後數有幾個根（<code>find(i) == i</code> 的個數）。",
  t: "n 可到 50000、m 到 n(n−1)/2，<code>cin</code> 要加速。輸出句型含 <code>Case k:</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int p[50005];
int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m, kase = 0;
    while (cin >> n >> m && (n || m)) {
        for (int i = 0; i < n; i++) p[i] = i;
        for (int i = 0; i < m; i++) {
            int a, b; cin >> a >> b;
            p[find(a - 1)] = find(b - 1);            // 1-based 轉 0-based
        }
        int cnt = 0;
        for (int i = 0; i < n; i++) if (find(i) == i) cnt++;
        cout << "Case " << ++kase << ": " << cnt << "\\n";
    }
}`
},
11121: {
  q: "把十進位整數轉成 <b>−2 進位</b>表示。",
  h: "跟一般進位轉換一樣做，但餘數為負時要修正：取 <code>r = n % -2</code>，若 r < 0 則 <code>r += 2; n += 1;</code>，再 <code>n /= -2</code>。",
  t: "負底數的除法與取餘在 C++ 的行為要<b>手動修正</b>，否則會無窮迴圈或算錯。n = 0 要特別輸出 \"0\"。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int k = 1; k <= T; k++) {
        long long n; cin >> n;
        string s;
        if (n == 0) s = "0";
        while (n != 0) {
            long long r = n % -2;
            n /= -2;
            if (r < 0) { r += 2; n += 1; }           // 修正負餘數
            s += char('0' + r);
        }
        reverse(s.begin(), s.end());
        cout << "Case #" << k << ": " << s << "\\n";
    }
}`
},
11240: {
  q: "求最長的<b>交替</b>子序列（嚴格上升、下降、上升…交替）。",
  h: "貪心掃一遍：維護目前的方向，只有當新元素與當前方向<b>相反</b>時才計數並翻轉方向。",
  t: "相等的元素要跳過。開頭的方向可以自由選，貪心會自動處理。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<int> a(n);
        for (int &x : a) cin >> x;
        int cnt = 1, dir = 0;                        // 0=未定, 1=上升, -1=下降
        for (int i = 1; i < n; i++) {
            if (a[i] > a[i-1] && dir != 1) { cnt++; dir = 1; }
            else if (a[i] < a[i-1] && dir != -1) { cnt++; dir = -1; }
        }
        cout << cnt << "\\n";
    }
}`
},
11518: {
  q: "n 張骨牌，給定 m 組「推倒 a 會連帶推倒 b」的關係，再給 l 張手動推倒的骨牌，問總共倒下幾張。",
  h: "有向圖上做 DFS 或 BFS，從每張手動推倒的骨牌出發標記可達節點，最後數被標記的總數。",
  t: "多測資之間要<b>清空鄰接表與 visited</b>。同一張骨牌可能被推倒多次，用 visited 避免重複計數。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n, m, l; cin >> n >> m >> l;
        vector<vector<int>> g(n + 1);
        for (int i = 0; i < m; i++) { int a, b; cin >> a >> b; g[a].push_back(b); }
        vector<bool> vis(n + 1, false);
        int cnt = 0;
        for (int i = 0; i < l; i++) {
            int s; cin >> s;
            if (vis[s]) continue;
            stack<int> st; st.push(s);              // 用 stack 避免遞迴過深
            while (!st.empty()) {
                int u = st.top(); st.pop();
                if (vis[u]) continue;
                vis[u] = true; cnt++;
                for (int v : g[u]) if (!vis[v]) st.push(v);
            }
        }
        cout << cnt << "\\n";
    }
}`
},
12218: {
  q: "給一個數字串，用它的數字組成所有可能的<b>質數</b>（不重複、無前導零），輸出有幾個。",
  h: "枚舉數字的所有<b>子集排列</b>：對每個非空子集做 next_permutation，組成數字後判質數。用 set 去重。",
  t: "數字最多 8 位，子集排列量可觀但可行。要排除<b>前導零</b>。同樣的數字可能由不同排列產生，必須用 set 去重。",
  c: `#include <bits/stdc++.h>
using namespace std;

bool isP(long long n) {
    if (n < 2) return false;
    for (long long i = 2; i * i <= n; i++) if (n % i == 0) return false;
    return true;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        string s; cin >> s;
        int n = s.size();
        set<long long> found;
        for (int mask = 1; mask < (1 << n); mask++) {
            string t;
            for (int i = 0; i < n; i++) if (mask >> i & 1) t += s[i];
            sort(t.begin(), t.end());
            do {
                if (t[0] == '0') continue;           // 排除前導零
                long long v = stoll(t);
                if (isP(v)) found.insert(v);         // set 去重
            } while (next_permutation(t.begin(), t.end()));
        }
        cout << found.size() << "\\n";
    }
}`
},
12442: {
  q: "每個人只轉寄給一個特定的人（可能成環），問從誰開始寄能讓最多人收到。",
  h: "這是<b>功能圖</b>（每點出度為 1）。對每個起點做一次走訪計算可達長度；n 不大時直接暴力 DFS 加記憶化。",
  t: "圖一定有環（走著走著必定回到走過的點）。走訪時要記錄「這一趟」已訪問的點來偵測環。同分時取<b>編號最小</b>的。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int k = 1; k <= T; k++) {
        int n; cin >> n;
        vector<int> nxt(n + 1);
        for (int i = 0; i < n; i++) { int a, b; cin >> a >> b; nxt[a] = b; }
        int best = 0, who = 1;
        for (int s = 1; s <= n; s++) {
            vector<char> seen(n + 1, 0);
            int u = s, cnt = 0;
            while (!seen[u]) { seen[u] = 1; cnt++; u = nxt[u]; }
            if (cnt > best) { best = cnt; who = s; }   // 同分保留較小編號
        }
        cout << "Case " << k << ": " << who << "\\n";
    }
}`
},
12455: {
  q: "給一根長度 n 的木棒與若干段長度，問能不能用其中一部分恰好拼出長度 n。",
  h: "<b>子集和</b>問題。用布林 DP：<code>dp[j] |= dp[j - a[i]]</code>，內層逆序。或用 bitset 一行搞定。",
  t: "內層必須<b>逆序</b>（每段只能用一次）。n ≤ 1000、段數 ≤ 20，兩種做法都夠快。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n, m; cin >> n >> m;
        vector<int> a(m);
        for (int &x : a) cin >> x;
        vector<char> dp(n + 1, 0);
        dp[0] = 1;
        for (int i = 0; i < m; i++)
            for (int j = n; j >= a[i]; j--)          // 逆序：每段只用一次
                if (dp[j - a[i]]) dp[j] = 1;
        cout << (dp[n] ? "YES" : "NO") << "\\n";
    }
}`
}
};

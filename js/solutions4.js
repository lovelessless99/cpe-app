/* 歷屆高答對率題（第三批）
   依 CPE 官方「考生答對率」挑選——這些是考生實際拿得到分的題目，
   價值高於全球 AC 人數多但 CPE 沒考過的題。 */
const SOL4 = {
11677: {
  q: "給起床時間與睡覺時間（時:分），求中間經過了幾分鐘（可能跨過午夜）。",
  h: "全部換算成「從 00:00 起的分鐘數」相減。若結果為負代表跨日，加上 <code>24*60</code>。",
  t: "跨午夜是唯一的考點。<b>兩個 0:0 才是結束訊號</b>，不是任一個為 0。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int h1, m1, h2, m2;
    while (cin >> h1 >> m1 >> h2 >> m2 && (h1 || m1 || h2 || m2)) {
        int d = (h2 * 60 + m2) - (h1 * 60 + m1);
        if (d < 0) d += 24 * 60;                  // 跨過午夜
        cout << d << "\\n";
    }
}`
},
11636: {
  q: "一開始有 1 行文字，每次「複製貼上」可讓行數<b>加倍</b>。問至少要幾次才能達到 n 行。",
  h: "行數是 1, 2, 4, 8…，所以答案是最小的 k 使 <code>2^k ≥ n</code>。直接迴圈倍增計數即可。",
  t: "<b>n = 1 時答案是 0</b>（本來就有一行，不用複製）。輸出句型含 <code>Case k: </code>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    long long n; int kase = 0;
    while (cin >> n && n > 0) {
        int cnt = 0;
        for (long long cur = 1; cur < n; cur *= 2) cnt++;   // n=1 時不進迴圈
        cout << "Case " << ++kase << ": " << cnt << "\\n";
    }
}`
},
11689: {
  q: "手上有 e 個空瓶、又撿到 f 個，每 c 個空瓶可換一瓶汽水。問總共能喝幾瓶。",
  h: "貪心模擬：<code>總空瓶 = e + f</code>，只要 <code>≥ c</code> 就換，喝掉後空瓶變成 <code>換得數 + 餘數</code>。",
  t: "跟 UVa 11150 Cola 同型但<b>沒有借瓶子的規則</b>，別把那題的 +1 帶過來。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int e, f, c; cin >> e >> f >> c;
        int empty = e + f, drank = 0;
        while (empty >= c) {
            int got = empty / c;                  // 換到幾瓶
            drank += got;
            empty = got + empty % c;              // 喝完又變空瓶 + 沒換掉的
        }
        cout << drank << "\\n";
    }
}`
},
1260: {
  q: "給每個人的銷售額，對每個人算出「前面有幾個人的銷售額<b>小於等於</b>他」，全部加總。",
  h: "n 很小，雙層迴圈直接數。",
  t: "是<b>小於等於</b>不是小於——相等也要算。順序固定，只看「前面的人」。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<int> a(n);
        for (int &x : a) cin >> x;
        int total = 0;
        for (int i = 0; i < n; i++)
            for (int j = 0; j < i; j++)
                if (a[j] <= a[i]) total++;        // 小於等於
        cout << total << "\\n";
    }
}`
},
458: {
  q: "解碼：每個字元的 ASCII 減去 7 就是原文。",
  h: "逐字元 <code>c - 7</code> 輸出，讀到 EOF。",
  t: "必須用 <code>getline</code> 保留空白。這題極簡單，但<b>整行讀</b>是重點——用 <code>cin >></code> 會弄丟空格。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string s;
    while (getline(cin, s)) {
        for (char c : s) cout << char(c - 7);
        cout << "\\n";
    }
}`
},
1583: {
  q: "定義 <code>f(x) = x + x 的各位數字和</code>。給 n，求最小的 x 使 <code>f(x) = n</code>；不存在則輸出 0。",
  h: "n ≤ 100000。<b>預先建表</b>：對每個 x 從 1 到 100000 算出 f(x)，若 f(x) ≤ 上限且該格還沒被填過就記下 x。之後每次查詢 O(1)。",
  t: "要的是<b>最小</b>的 x，所以由小到大掃且「只在空的時候填」。逐筆現算會 TLE，一定要預建表。",
  c: `#include <bits/stdc++.h>
using namespace std;
const int N = 1000001;
int ans[N];

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    for (int x = 1; x < N; x++) {
        int s = x, t = x;
        while (t) { s += t % 10; t /= 10; }
        if (s < N && ans[s] == 0) ans[s] = x;      // 由小到大，只填一次
    }
    int T; cin >> T;
    while (T--) { int n; cin >> n; cout << ans[n] << "\\n"; }
}`
},
11728: {
  q: "給 S，求最小的 n 使 n 的<b>所有因數之和</b>等於 S；不存在輸出 −1。",
  h: "S ≤ 1000。預建表：對每個 n 從 1 到 1000，用 O(√n) 算因數和，若等於某個 S 且尚未記錄就填入。",
  t: "是<b>所有</b>因數（含 n 自己），不是真因數。要最小的 n，所以由小到大掃。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const int M = 1001;
    vector<int> ans(M, -1);
    for (int n = 1; n < M; n++) {
        int s = 0;
        for (int i = 1; i * i <= n; i++)
            if (n % i == 0) { s += i; if (i != n / i) s += n / i; }
        if (s < M && ans[s] == -1) ans[s] = n;     // 最小的 n
    }
    int S, kase = 0;
    while (cin >> S && S) cout << "Case " << ++kase << ": " << ans[S] << "\\n";
}`
},
10789: {
  q: "統計字串中每個字元的出現次數，輸出<b>出現次數為質數</b>的字元與次數，按字元順序。",
  h: "開 128 格的計數陣列，最後檢查每個次數是不是質數。",
  t: "<b>1 不是質數</b>，只出現一次的字元不算。沒有任何符合時要輸出固定訊息。大小寫視為不同字元。",
  c: `#include <bits/stdc++.h>
using namespace std;

bool isP(int n) {
    if (n < 2) return false;
    for (int i = 2; i * i <= n; i++) if (n % i == 0) return false;
    return true;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int k = 1; k <= T; k++) {
        string s; cin >> s;
        int cnt[128] = {0};
        for (unsigned char c : s) cnt[c]++;
        cout << "Case " << k << ":\\n";
        bool any = false;
        for (int i = 0; i < 128; i++)
            if (isP(cnt[i])) { cout << char(i) << " " << cnt[i] << "\\n"; any = true; }
        if (!any) cout << "empty\\n";
    }
}`
},
11678: {
  q: "兩人各有一疊卡片，各自把「對方沒有的卡片」拿出來交換。問各自要拿出幾張。",
  h: "兩個 <code>set</code>，各自數「不在對方集合裡」的元素個數。",
  t: "卡片<b>可能重複</b>但只算相異的——所以要用 set 而不是直接計數。輸出兩個數字之間有空格。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m;
    while (cin >> n >> m && (n || m)) {
        set<int> a, b;
        for (int i = 0; i < n; i++) { int x; cin >> x; a.insert(x); }
        for (int i = 0; i < m; i++) { int x; cin >> x; b.insert(x); }
        int ca = 0, cb = 0;
        for (int x : a) if (!b.count(x)) ca++;     // A 有 B 沒有
        for (int x : b) if (!a.count(x)) cb++;
        cout << ca << " " << cb << "\\n";
    }
}`
},
10550: {
  q: "轉盤鎖：從起始刻度開始，依「逆時針到 a、順時針到 b、逆時針到 c」轉，最後順時針轉到 0。求總共轉了幾度。",
  h: "每格 9 度（40 格 × 9 = 360）。三段各自算出要轉幾格，注意方向不同時取模的方式相反，再加上固定的兩圈與一圈。",
  t: "轉盤有 <b>40 格</b>、每格 <b>9 度</b>。開鎖規則固定要多轉整圈（第一段 +2 圈、第二段 +1 圈），這個常數漏了就錯。負的取模要修正。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int s, a, b, c;
    while (cin >> s >> a >> b >> c && (s || a || b || c)) {
        int deg = 0;
        deg += 2 * 360;                            // 先逆時針轉兩整圈
        deg += ((s - a) % 40 + 40) % 40 * 9;       // 逆時針到 a
        deg += 360;                                // 順時針一整圈
        deg += ((b - a) % 40 + 40) % 40 * 9;       // 順時針到 b
        deg += ((b - c) % 40 + 40) % 40 * 9;       // 逆時針到 c
        deg += ((c - 0) % 40 + 40) % 40 * 9;       // 順時針到 0
        cout << deg << "\\n";
    }
}`
},
389: {
  q: "把一個數從某個進位轉成另一個進位（2–16 進位）。",
  h: "先轉成十進位，再轉成目標進位。用查表處理 A–F。",
  t: "結果超過 <b>7 個字元</b>時要輸出 <code>ERROR</code>——這是最多人漏掉的條件。輸出<b>靠右對齊寬度 7</b>。數字 0 要輸出 \"0\"。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string s; int from, to;
    while (cin >> s >> from >> to) {
        long long v = 0;
        for (char c : s) {
            int d = isdigit((unsigned char)c) ? c - '0' : toupper(c) - 'A' + 10;
            v = v * from + d;
        }
        string r;
        if (v == 0) r = "0";
        while (v) { int d = v % to; r += (d < 10 ? char('0'+d) : char('A'+d-10)); v /= to; }
        reverse(r.begin(), r.end());
        if (r.size() > 7) cout << "  ERROR\\n";      // 超過 7 位
        else cout << setw(7) << r << "\\n";          // 靠右對齊寬度 7
    }
}`
},
1339: {
  q: "判斷兩個等長字串能否透過「字母重新對應 + 循環位移」互相轉換。",
  h: "關鍵洞察：只要兩者的<b>字母出現次數多重集合相同</b>就可以。所以各自統計 26 個字母的次數，<b>排序後比較</b>。",
  t: "不需要真的去找對應關係或位移量——想通「只看次數的分布」整題就三行。這是典型的<b>把問題轉換掉</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string a, b;
    while (cin >> a >> b) {
        vector<int> ca(26, 0), cb(26, 0);
        for (char c : a) ca[c - 'A']++;
        for (char c : b) cb[c - 'A']++;
        sort(ca.begin(), ca.end());                // 只比較「次數的分布」
        sort(cb.begin(), cb.end());
        cout << (ca == cb ? "YES" : "NO") << "\\n";
    }
}`
},
11078: {
  q: "給一個序列，求 <code>a[i] − a[j]</code> 的最大值，其中 <b>i < j</b>。",
  h: "掃一遍：維護「目前為止的最大值」<code>mx</code>，對每個新元素 <code>a[j]</code> 更新答案為 <code>mx − a[j]</code>，再把 <code>a[j]</code> 併入 mx。O(n)。",
  t: "順序是 <b>i 在前、j 在後</b>，別寫反。答案<b>可能是負數</b>，初值不能設 0，要設成極小值。n 可到 10⁵，O(n²) 會 TLE。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<int> a(n);
        for (int &x : a) cin >> x;
        int mx = a[0], best = INT_MIN;             // 初值不能設 0
        for (int j = 1; j < n; j++) {
            best = max(best, mx - a[j]);
            mx = max(mx, a[j]);
        }
        cout << best << "\\n";
    }
}`
},
10336: {
  q: "地圖上每種語言用一個字母表示，求每種語言有幾個<b>連通區塊</b>，按字母序輸出並附百分比。",
  h: "對每個字母各做一次 <b>Flood Fill</b>：掃全圖，遇到未訪問的該字母就展開整塊、計數加一。",
  t: "是<b>四方向</b>不是八方向。百分比的分母是<b>區塊總數</b>不是格子數。大網格用 BFS 避免遞迴爆 stack。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    int dx[4] = {0,0,1,-1}, dy[4] = {1,-1,0,0};
    for (int kase = 1; kase <= T; kase++) {
        int n, m; cin >> n >> m;
        vector<string> g(n);
        for (auto &r : g) cin >> r;
        vector<vector<char>> vis(n, vector<char>(m, 0));
        map<char,int> cnt;
        int total = 0;
        for (int i = 0; i < n; i++)
            for (int j = 0; j < m; j++) {
                if (vis[i][j]) continue;
                char ch = g[i][j];
                cnt[ch]++; total++;
                queue<pair<int,int>> q;            // BFS 展開整塊
                q.push({i, j}); vis[i][j] = 1;
                while (!q.empty()) {
                    auto [x, y] = q.front(); q.pop();
                    for (int d = 0; d < 4; d++) {
                        int nx = x + dx[d], ny = y + dy[d];
                        if (nx < 0 || nx >= n || ny < 0 || ny >= m) continue;
                        if (vis[nx][ny] || g[nx][ny] != ch) continue;
                        vis[nx][ny] = 1; q.push({nx, ny});
                    }
                }
            }
        cout << "World #" << kase << "\\n" << fixed << setprecision(4);
        for (auto &[ch, c] : cnt)
            cout << ch << ": " << 100.0 * c / total << "%\\n";
    }
}`
},
10188: {
  q: "比對程式輸出與標準答案：完全相同輸出 Accepted；行數與各行長度相同但內容不同則 Presentation Error；否則 Wrong Answer。",
  h: "逐行比對。先比行數，再比每行內容；若不同就再比每行<b>長度</b>是否相同來區分 PE 與 WA。",
  t: "這題本身就在教你 <b>PE 和 WA 的差別</b>。讀入用 getline，行數不同直接是 WA。空行也要算進去。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m, kase = 0;
    while (cin >> n >> m) {
        cin.ignore();
        vector<string> a(n), b(m);
        for (auto &x : a) getline(cin, x);
        for (auto &x : b) getline(cin, x);
        cout << "Run #" << ++kase << ": ";
        if (n != m) { cout << "Wrong Answer\\n"; continue; }
        bool same = true, samelen = true;
        for (int i = 0; i < n; i++) {
            if (a[i] != b[i]) same = false;
            if (a[i].size() != b[i].size()) samelen = false;
        }
        if (same) cout << "Accepted\\n";
        else if (samelen) cout << "Presentation Error\\n";   // 長度一樣但內容不同
        else cout << "Wrong Answer\\n";
    }
}`
}
};

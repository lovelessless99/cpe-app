/* 歷屆考古題詳解（第二批）— 依全球 AC 人數由高而低，愈前面愈基礎 */
const SOL3 = {
10130: {
  q: "N 件商品各有價值與重量，再給 G 個家人各自的負重上限，求全家能帶走的最大總價值。",
  h: "<b>每個人各自一個背包</b>，不是共用。所以只要跑<b>一次</b> 0/1 背包得到所有容量的 dp[w]，再對每個人查 dp[limit] 累加即可。",
  t: "「每人各自獨立挑選、同一商品可被不同人各拿一件」——理解成共用一個背包就完全做錯。不要對每個人重跑背包（會 TLE 也沒必要）。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<int> p(n), w(n);
        for (int i = 0; i < n; i++) cin >> p[i] >> w[i];
        const int MW = 31;
        vector<int> dp(MW, 0);
        for (int i = 0; i < n; i++)
            for (int j = MW - 1; j >= w[i]; j--)      // 逆序：每件只拿一次
                dp[j] = max(dp[j], dp[j - w[i]] + p[i]);
        int g, total = 0; cin >> g;
        while (g--) { int lim; cin >> lim; total += dp[lim]; }   // 每人查一次
        cout << total << "\\n";
    }
}`
},
10161: {
  q: "棋盤上的格子沿對角線蛇形編號，給編號求 (x, y) 座標。",
  h: "令 <code>s = ceil(sqrt(n))</code>，代表它在第 s 層；<code>rem = n − (s−1)²</code> 是該層的第幾個。層的走向<b>依 s 的奇偶交替</b>：s 偶數時先往右再往下，s 奇數時先往下再往左。",
  t: "奇偶方向相反是唯一容易錯的地方。<b>先手算前 10 個編號驗證</b>：(1,1)→(1,2)→(2,2)→(2,1)→(3,1)…路徑必須連續，不連續就是公式錯了。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    long long n;
    while (cin >> n && n) {
        long long s = (long long)ceill(sqrtl((long double)n));
        while ((s - 1) * (s - 1) >= n) s--;           // 修正浮點誤差
        while (s * s < n) s++;
        long long rem = n - (s - 1) * (s - 1);
        long long x, y;
        if (s % 2 == 0) {                             // 偶數層：先往右再往下
            if (rem <= s) { x = rem; y = s; }
            else { x = s; y = 2 * s - rem; }
        } else {                                      // 奇數層：先往下再往左
            if (rem <= s) { x = s; y = rem; }
            else { x = 2 * s - rem; y = s; }
        }
        cout << x << " " << y << "\\n";
    }
}`
},
834: {
  q: "把分數 a/b 展開成連分數形式，輸出 <code>[a0;a1,a2,...]</code>。",
  h: "就是<b>輾轉相除法</b>：每次取商放進答案、餘數繼續。<code>a0 = a/b</code>，然後 <code>(a,b) = (b, a%b)</code> 重複到餘數為 0。",
  t: "第一個數後面是<b>分號</b>，之後才是逗號。只有一項時輸出 <code>[a0]</code>，沒有分號。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    long long a, b;
    while (cin >> a >> b) {
        vector<long long> v;
        while (b) { v.push_back(a / b); long long r = a % b; a = b; b = r; }
        cout << "[" << v[0];
        for (size_t i = 1; i < v.size(); i++)
            cout << (i == 1 ? ";" : ",") << v[i];      // 第一個是分號
        cout << "]\\n";
    }
}`
},
442: {
  q: "給矩陣的維度與一串加了括號的乘法運算式，算出乘法次數；維度不合則輸出 error。",
  h: "用 <b>stack</b>：遇到字母就把它的維度推入；遇到右括號就彈出兩個相乘——檢查 <code>a.col == b.row</code>，成本加 <code>a.row × a.col × b.col</code>，把結果 (a.row, b.col) 推回去。",
  t: "維度不合要<b>立刻停止</b>並輸出 error，不能繼續算。左括號直接忽略。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    map<char, pair<int,int>> dim;
    for (int i = 0; i < n; i++) { char c; int r, cc; cin >> c >> r >> cc; dim[c] = {r, cc}; }
    string s;
    while (cin >> s) {
        stack<pair<int,int>> st;
        long long cost = 0; bool err = false;
        for (char c : s) {
            if (c == '(') continue;
            if (isalpha((unsigned char)c)) { st.push(dim[c]); continue; }
            // c == ')'
            auto b = st.top(); st.pop();
            auto a = st.top(); st.pop();
            if (a.second != b.first) { err = true; break; }    // 維度不合
            cost += (long long)a.first * a.second * b.second;
            st.push({a.first, b.second});
        }
        if (err) cout << "error\\n";
        else cout << cost << "\\n";
    }
}`
},
10810: {
  q: "只能交換相鄰元素，求排好序所需的最少交換次數（n 可到 500000）。",
  h: "答案是<b>逆序對數</b>。n 太大不能用 O(n²)，要用<b>合併排序計數</b>：merge 時右邊元素先被取走，代表左邊剩下的都比它大，一次加上 <code>mid − i</code>。",
  t: "答案可到約 10¹¹，<b>必須用 long long</b>。n = 0 是結束訊號。這題就是 10327 的大資料版——認出「同一件事，只是 n 變大」是重點。",
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

vector<int> a, tmp;

ll mergeCount(int l, int r) {
    if (r - l <= 1) return 0;
    int m = (l + r) / 2;
    ll cnt = mergeCount(l, m) + mergeCount(m, r);
    int i = l, j = m, k = l;
    while (i < m && j < r) {
        if (a[i] <= a[j]) tmp[k++] = a[i++];
        else { cnt += m - i; tmp[k++] = a[j++]; }     // 左邊剩下的都比 a[j] 大
    }
    while (i < m) tmp[k++] = a[i++];
    while (j < r) tmp[k++] = a[j++];
    copy(tmp.begin() + l, tmp.begin() + r, a.begin() + l);
    return cnt;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n && n) {
        a.assign(n, 0); tmp.assign(n, 0);
        for (int &x : a) cin >> x;
        cout << mergeCount(0, n) << "\\n";
    }
}`
},
10036: {
  q: "給一串數字，可在每兩數之間放 + 或 −，問能否讓結果被 k 整除。",
  h: "<b>DP on 餘數</b>：<code>dp[i][r]</code> = 前 i 個數能否湊出餘數 r。轉移時對每個可達的 r，往 <code>(r + a[i]) % k</code> 與 <code>(r − a[i]) % k</code> 兩個方向擴展。",
  t: "餘數可能為負，一定要用 <code>((x % k) + k) % k</code> 修正。第一個數是<b>固定的</b>（前面沒有運算子），初始狀態要用它。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n, k; cin >> n >> k;
        vector<int> a(n);
        for (int &x : a) cin >> x;
        vector<char> cur(k, 0), nxt(k, 0);
        cur[((a[0] % k) + k) % k] = 1;                 // 第一個數固定
        for (int i = 1; i < n; i++) {
            fill(nxt.begin(), nxt.end(), 0);
            int v = ((a[i] % k) + k) % k;
            for (int r = 0; r < k; r++) if (cur[r]) {
                nxt[(r + v) % k] = 1;
                nxt[((r - v) % k + k) % k] = 1;        // 修正負餘數
            }
            cur = nxt;
        }
        cout << (cur[0] ? "Divisible" : "Not divisible") << "\\n";
    }
}`
},
392: {
  q: "給多項式係數，輸出人類可讀的標準形式（如 <code>-x^3 + 2x - 1</code>）。",
  h: "純<b>輸出格式</b>題。逐項處理：跳過係數 0；第一項不印前導 <code>+</code>；係數絕對值為 1 且次方非 0 時不印數字；次方為 1 不印 <code>^1</code>；次方為 0 只印數字。",
  t: "WA/AC 比高達 1.6，<b>失分全在格式</b>而非邏輯。全部係數為 0 時要輸出 <code>0</code>。運算子兩側都有空格，但第一項的負號<b>緊貼</b>數字。逐字對照範例。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n) {
        vector<int> c(n + 1);
        for (int &x : c) cin >> x;
        bool first = true;
        for (int i = 0; i <= n; i++) {
            int p = n - i, v = c[i];
            if (v == 0) continue;
            if (first) { if (v < 0) cout << "-"; }
            else cout << (v < 0 ? " - " : " + ");
            int a = abs(v);
            if (a != 1 || p == 0) cout << a;           // 係數 1 且有 x 時不印
            if (p > 0) cout << "x";
            if (p > 1) cout << "^" << p;
            first = false;
        }
        if (first) cout << "0";                        // 全為 0
        cout << "\\n";
    }
}`
},
10539: {
  q: "求區間 [a, b] 內有幾個「幾乎質數」——恰好是某個質數的<b>次方且指數 ≥ 2</b>（如 4, 8, 9, 25…）。",
  h: "先篩出 √b 以內的質數（10⁶ 夠用）。對每個質數 p，從 p² 開始不斷乘 p，只要落在範圍內就計數。",
  t: "指數必須 ≥ 2，所以<b>從 p² 開始</b>不是 p。連乘會溢位，要用 long long 並在乘之前判斷會不會超過 b。",
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const int N = 1000006;
    vector<bool> notp(N, false);
    vector<ll> pr;
    for (int i = 2; i < N; i++) {
        if (notp[i]) continue;
        pr.push_back(i);
        for (ll j = (ll)i * i; j < N; j += i) notp[j] = true;
    }
    int T; cin >> T;
    while (T--) {
        ll a, b; cin >> a >> b;
        ll cnt = 0;
        for (ll p : pr) {
            if (p * p > b) break;
            for (ll v = p * p; v <= b; v *= p) {       // 從 p² 開始
                if (v >= a) cnt++;
                if (v > b / p) break;                  // 先判再乘，防溢位
            }
        }
        cout << cnt << "\\n";
    }
}`
},
11456: {
  q: "從一列車廂中選出一個子序列，使它能先遞增再遞減（可只有其中一半），求最長長度。",
  h: "對每個位置 i 算兩個值：<code>inc[i]</code> = 以 i 結尾的最長遞增子序列、<code>dec[i]</code> = 從 i 開始的最長遞減子序列。答案是 <code>max(inc[i] + dec[i] − 1)</code>。",
  t: "中心元素<b>被算了兩次</b>，所以要減 1。n ≤ 2000，O(n²) 的 LIS 就夠。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<int> a(n);
        for (int &x : a) cin >> x;
        vector<int> inc(n, 1), dec(n, 1);
        for (int i = 0; i < n; i++)
            for (int j = 0; j < i; j++)
                if (a[j] < a[i]) inc[i] = max(inc[i], inc[j] + 1);
        for (int i = n - 1; i >= 0; i--)
            for (int j = n - 1; j > i; j--)
                if (a[j] < a[i]) dec[i] = max(dec[i], dec[j] + 1);
        int best = 0;
        for (int i = 0; i < n; i++) best = max(best, inc[i] + dec[i] - 1);  // 中心重複算一次
        cout << best << "\\n";
    }
}`
},
10721: {
  q: "用 k 種不同長度（1 到 m）的條碼段，拼出總長為 n 的條碼，問有幾種方式。",
  h: "<code>dp[n][k]</code> = 用恰好 k 段拼出長度 n 的方法數。轉移枚舉最後一段的長度 L（1 ≤ L ≤ m）：<code>dp[n][k] = Σ dp[n−L][k−1]</code>。",
  t: "邊界 <code>dp[0][0] = 1</code>。答案可能很大，用 long long。這是標準的<b>分段計數 DP</b>，狀態定義寫清楚就不會亂。",
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, k, m;
    while (cin >> n >> k >> m) {
        vector<vector<ll>> dp(n + 1, vector<ll>(k + 1, 0));
        dp[0][0] = 1;
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= k; j++)
                for (int L = 1; L <= m && L <= i; L++)     // 最後一段長 L
                    dp[i][j] += dp[i - L][j - 1];
        cout << dp[n][k] << "\\n";
    }
}`
},
11624: {
  q: "迷宮中 Joe 要逃出去，同時有多處起火，火每回合往四方向蔓延。求 Joe 能否逃出與最短時間。",
  h: "<b>兩次 BFS</b>：先做<b>多源 BFS</b>算出火燒到每格的時間 <code>fire[][]</code>（一開始把所有火源都 push 進 queue），再對 Joe 做一般 BFS，只走「到達時間 < 火到達時間」的格子。",
  t: "火源可能有<b>很多個</b>——用多源 BFS 一次算完，不要對每個火源各跑一次。走到邊界外就是逃出成功。沒被火燒到的格子 fire 要視為無限大。",
  c: `#include <bits/stdc++.h>
using namespace std;
const int INF = 1e9;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    int dx[4] = {0,0,1,-1}, dy[4] = {1,-1,0,0};
    while (T--) {
        int R, C; cin >> R >> C;
        vector<string> g(R);
        for (auto &r : g) cin >> r;
        vector<vector<int>> fire(R, vector<int>(C, INF)), d(R, vector<int>(C, -1));
        queue<pair<int,int>> q;
        int sx = -1, sy = -1;
        for (int i = 0; i < R; i++)
            for (int j = 0; j < C; j++) {
                if (g[i][j] == 'F') { fire[i][j] = 0; q.push({i, j}); }   // 多源
                if (g[i][j] == 'J') { sx = i; sy = j; }
            }
        while (!q.empty()) {                          // 火的 BFS
            auto [x, y] = q.front(); q.pop();
            for (int k = 0; k < 4; k++) {
                int nx = x + dx[k], ny = y + dy[k];
                if (nx < 0 || nx >= R || ny < 0 || ny >= C) continue;
                if (g[nx][ny] == '#' || fire[nx][ny] != INF) continue;
                fire[nx][ny] = fire[x][y] + 1;
                q.push({nx, ny});
            }
        }
        d[sx][sy] = 0; q.push({sx, sy});
        int ans = -1;
        while (!q.empty()) {                          // Joe 的 BFS
            auto [x, y] = q.front(); q.pop();
            if (x == 0 || x == R-1 || y == 0 || y == C-1) { ans = d[x][y] + 1; break; }
            for (int k = 0; k < 4; k++) {
                int nx = x + dx[k], ny = y + dy[k];
                if (nx < 0 || nx >= R || ny < 0 || ny >= C) continue;
                if (g[nx][ny] == '#' || d[nx][ny] != -1) continue;
                if (d[x][y] + 1 >= fire[nx][ny]) continue;    // 火先到就不能走
                d[nx][ny] = d[x][y] + 1;
                q.push({nx, ny});
            }
        }
        if (ans < 0) cout << "IMPOSSIBLE\\n";
        else cout << ans << "\\n";
    }
}`
},
10150: {
  q: "給一本字典，問兩個單字之間能否透過每次<b>只改一個字母</b>（中間結果也必須是字典裡的單字）互相轉換，求最短變換序列。",
  h: "把單字當節點、「差一個字母」當邊，做 <b>BFS</b> 求最短路並記錄前驅還原路徑。",
  t: "建圖時只需比較<b>長度相同</b>的單字。字典可能上千字，兩兩比較是 O(n²·len)，可接受。找不到路徑要輸出固定訊息。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    vector<string> w;
    string s;
    while (getline(cin, s) && !s.empty()) w.push_back(s);
    int n = w.size();
    auto diff1 = [&](int i, int j) {
        if (w[i].size() != w[j].size()) return false;
        int c = 0;
        for (size_t k = 0; k < w[i].size(); k++) if (w[i][k] != w[j][k]) if (++c > 1) return false;
        return c == 1;
    };
    map<string,int> id;
    for (int i = 0; i < n; i++) id[w[i]] = i;
    string a, b;
    while (cin >> a >> b) {
        vector<int> prev(n, -2), d(n, -1);
        int st = id.count(a) ? id[a] : -1, en = id.count(b) ? id[b] : -1;
        if (st < 0 || en < 0) { cout << "No solution.\\n"; continue; }
        queue<int> q; q.push(st); d[st] = 0; prev[st] = -1;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            if (u == en) break;
            for (int v = 0; v < n; v++)
                if (d[v] == -1 && diff1(u, v)) { d[v] = d[u] + 1; prev[v] = u; q.push(v); }
        }
        if (d[en] == -1) { cout << "No solution.\\n"; continue; }
        vector<string> path;
        for (int u = en; u != -1; u = prev[u]) path.push_back(w[u]);
        reverse(path.begin(), path.end());
        for (auto &x : path) cout << x << "\\n";
    }
}`
},
11360: {
  q: "對矩陣做一連串操作（左右翻轉、上下翻轉、轉置、旋轉、對某範圍的數字做增減），最後輸出矩陣。",
  h: "n 可到 1000、操作可到 10⁵，<b>不能每次操作都真的搬動矩陣</b>。改用<b>延遲變換</b>：用幾個變數記住「目前的座標映射狀態」與「數值的加值量」，最後一次套用。",
  t: "真的做每次翻轉是 O(n²) 一次，必 TLE。關鍵是意識到<b>所有翻轉/旋轉都能合成一個座標變換</b>，數值操作也能累積成一張 0–9 的映射表。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<string> g(n);
        for (auto &r : g) cin >> r;
        bool flipH = false, flipV = false, trans = false;
        int mapd[10]; for (int i = 0; i < 10; i++) mapd[i] = i;    // 數字映射表
        int m; cin >> m;
        while (m--) {
            string op; cin >> op;
            if (op == "lr") flipH = !flipH;
            else if (op == "tb") flipV = !flipV;
            else if (op == "transpose") { trans = !trans; swap(flipH, flipV); }
            else if (op == "inc") { for (int i = 0; i < 10; i++) mapd[i] = (mapd[i] + 1) % 10; }
            else if (op == "dec") { for (int i = 0; i < 10; i++) mapd[i] = (mapd[i] + 9) % 10; }
        }
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                int r = i, c = j;
                if (trans) swap(r, c);
                if (flipV) r = n - 1 - r;
                if (flipH) c = n - 1 - c;
                cout << mapd[g[r][c] - '0'];
            }
            cout << "\\n";
        }
        if (T) cout << "\\n";
    }
}`
},
11495: {
  q: "只能交換相鄰元素排序，問先手（Alice）還是後手（Bob）會做最後一次交換。",
  h: "總交換次數 = <b>逆序對數</b>。奇數則 Alice 做最後一次，偶數則 Bob。n 大時用合併排序計數。",
  t: "只需要<b>奇偶</b>不需要精確值，但仍得正確計算。n 可到 5×10⁵，O(n²) 會 TLE。逆序對數用 long long。",
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

vector<int> a, tmp;
ll mergeCount(int l, int r) {
    if (r - l <= 1) return 0;
    int m = (l + r) / 2;
    ll c = mergeCount(l, m) + mergeCount(m, r);
    int i = l, j = m, k = l;
    while (i < m && j < r) {
        if (a[i] <= a[j]) tmp[k++] = a[i++];
        else { c += m - i; tmp[k++] = a[j++]; }
    }
    while (i < m) tmp[k++] = a[i++];
    while (j < r) tmp[k++] = a[j++];
    copy(tmp.begin() + l, tmp.begin() + r, a.begin() + l);
    return c;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n && n) {
        a.assign(n, 0); tmp.assign(n, 0);
        for (int &x : a) cin >> x;
        cout << (mergeCount(0, n) % 2 ? "Marcelo" : "Carlos") << "\\n";  // 依原題人名調整
    }
}`
},
12096: {
  q: "模擬一台以<b>集合</b>為元素的堆疊機器，支援 PUSH（推入空集合）、DUP、UNION、INTERSECT、ADD（把次頂集合加入頂端集合），每步輸出堆疊頂端集合的大小。",
  h: "關鍵是「集合的集合」。給每個出現過的<b>集合</b>一個整數編號（用 <code>map&lt;set&lt;int&gt;, int&gt;</code>），這樣堆疊裡就只存 <code>set&lt;int&gt;</code>，元素是編號。",
  t: "ADD 是把<b>次頂那個集合本身</b>當成一個元素加進頂端集合——所以需要「集合 → 編號」的映射，這正是整題的核心巧思。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef set<int> Set;

map<Set,int> id;
vector<Set> all;
int getId(const Set& s) {
    auto it = id.find(s);
    if (it != id.end()) return it->second;
    int k = all.size();                 // 先取 size
    id[s] = k; all.push_back(s);
    return k;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        id.clear(); all.clear();
        stack<Set> st;
        string op;
        while (n--) {
            cin >> op;
            if (op == "PUSH") st.push(Set());
            else if (op == "DUP") st.push(st.top());
            else {
                Set x = st.top(); st.pop();
                Set y = st.top(); st.pop();
                Set r;
                if (op == "UNION") set_union(x.begin(),x.end(),y.begin(),y.end(),inserter(r,r.begin()));
                else if (op == "INTERSECT") set_intersection(x.begin(),x.end(),y.begin(),y.end(),inserter(r,r.begin()));
                else { r = y; r.insert(getId(x)); }    // ADD：把 x 當成元素放進 y
                st.push(r);
            }
            cout << st.top().size() << "\\n";
        }
        cout << "***\\n";
    }
}`
},
941: {
  q: "求 0..n−1 的第 k 個排列（字典序，k 從 0 開始）。",
  h: "<b>階乘進位制</b>：第一位是 <code>k / (n−1)!</code>，取走該元素後 <code>k %= (n−1)!</code>，對剩下的元素重複。",
  t: "n ≤ 20，<code>20!</code> 已接近 long long 上限，要用 <b>unsigned long long</b> 或小心邊界。k 是 <b>0-based</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; ll k; cin >> n >> k;
        vector<ll> f(21); f[0] = 1;
        for (int i = 1; i <= 20; i++) f[i] = f[i-1] * i;
        vector<int> pool(n);
        iota(pool.begin(), pool.end(), 0);
        string res;
        for (int i = n - 1; i >= 0; i--) {
            ll idx = k / f[i];                        // 這一位取第幾個
            k %= f[i];
            res += char('a' + pool[idx]);
            pool.erase(pool.begin() + idx);           // 取走
        }
        cout << res << "\\n";
    }
}`
},
10813: {
  q: "模擬 BINGO：5×5 卡片中央是免費格，主持人依序報號，問報到第幾個號碼時卡片連成一線（橫、直、或兩條對角線）。",
  h: "把號碼位置存進 map 以便快速定位，逐一標記後檢查 12 種連線（5 橫 + 5 直 + 2 對角）。",
  t: "<b>中央格 (2,2) 一開始就是通的</b>。找到第一次 BINGO 就要停止，不能繼續讀完所有號碼再判斷。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        map<int,pair<int,int>> pos;
        bool mark[5][5] = {};
        for (int i = 0; i < 5; i++)
            for (int j = 0; j < 5; j++) {
                if (i == 2 && j == 2) { mark[i][j] = true; continue; }   // 中央免費
                int x; cin >> x; pos[x] = {i, j};
            }
        auto bingo = [&]() {
            for (int i = 0; i < 5; i++) {
                bool r = true, c = true;
                for (int j = 0; j < 5; j++) { r &= mark[i][j]; c &= mark[j][i]; }
                if (r || c) return true;
            }
            bool d1 = true, d2 = true;
            for (int i = 0; i < 5; i++) { d1 &= mark[i][i]; d2 &= mark[i][4-i]; }
            return d1 || d2;
        };
        int m; cin >> m;
        int ans = -1;
        for (int i = 1; i <= m; i++) {
            int x; cin >> x;
            if (ans > 0) continue;                    // 已中獎，但仍要把輸入讀完
            if (pos.count(x)) mark[pos[x].first][pos[x].second] = true;
            if (bingo()) ans = i;
        }
        cout << "BINGO after " << ans << " numbers announced\\n";
    }
}`
},
1193: {
  q: "海岸線是 x 軸，海上有若干島嶼，雷達半徑 d 只能放在 x 軸上。求覆蓋所有島嶼所需的最少雷達數；無解輸出 −1。",
  h: "把每個島嶼轉成 x 軸上的<b>可行區間</b> <code>[x − √(d²−y²), x + √(d²−y²)]</code>，問題變成<b>最少點覆蓋所有區間</b>。按<b>右端點</b>排序，貪心放在右端點。",
  t: "<code>y > d</code> 的島嶼<b>無解</b>，要先擋掉否則 sqrt 拿到負數。排序鍵是<b>右端點</b>不是左端點——用左端點排序會做錯。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; double d; int kase = 0;
    while (cin >> n >> d && (n || d)) {
        vector<pair<double,double>> v;
        bool ok = true;
        for (int i = 0; i < n; i++) {
            double x, y; cin >> x >> y;
            if (y > d) ok = false;                    // 無解，但要讀完
            else { double w = sqrt(d*d - y*y); v.push_back({x + w, x - w}); }
        }
        cout << "Case " << ++kase << ": ";
        if (!ok) { cout << "-1\\n"; continue; }
        sort(v.begin(), v.end());                     // 依右端點排序
        int cnt = 0; double last = -1e18;
        for (auto &[r, l] : v)
            if (l > last) { cnt++; last = r; }        // 放在右端點
        cout << cnt << "\\n";
    }
}`
},
11634: {
  q: "中平方法產生亂數：取 4 位數平方後取中間 4 位當下一個數。問從某個種子開始，到出現重複為止共產生幾個相異數。",
  h: "直接模擬，用一個<b>大小 10000 的布林陣列</b>記錄看過哪些數，出現重複就停。",
  t: "平方後不足 8 位要<b>補前導零</b>再取中間四位——正確做法是 <code>(n*n / 100) % 10000</code>。種子本身也算一個。0 是結束訊號。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n && n) {
        vector<bool> seen(10000, false);
        int cnt = 0, cur = n;
        while (!seen[cur]) {
            seen[cur] = true; cnt++;
            cur = (cur * cur / 100) % 10000;          // 取中間四位
        }
        cout << cnt << "\\n";
    }
}`
},
11576: {
  q: "一塊寬 k 的跑馬燈，每按一次就左移一格並在右端補一個新字元。給定必須<b>依序顯示</b>的 n 個長度為 k 的字串，求最少要按幾次。",
  h: "第一個字串要 k 次填滿。之後每相鄰兩個字串 a → b，找最大的 L 使 <b>a 的長度 L 後綴 == b 的長度 L 前綴</b>，那麼只要再按 <code>k − L</code> 次。總和即答案。",
  t: "重疊要<b>從最長往下試</b>，第一個成立的就是最大重疊。L 可以等於 k（兩字串相同時完全不用按）。第一個字串的 k 次不要漏算。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n, k; cin >> n >> k;
        vector<string> s(n);
        for (auto &x : s) cin >> x;
        int total = k;                                // 第一個字串要填滿
        for (int i = 1; i < n; i++) {
            int best = 0;
            for (int L = k; L >= 0; L--)              // 從最長重疊開始試
                if (s[i-1].substr(k - L) == s[i].substr(0, L)) { best = L; break; }
            total += k - best;
        }
        cout << total << "\\n";
    }
}`
},
1292: {
  q: "樹上放最少的士兵守衛所有邊（每條邊至少有一端有士兵）——樹的<b>最小點覆蓋</b>。",
  h: "樹上 DP：<code>dp[u][0]</code> = 不選 u 的最小值 = <code>Σ dp[v][1]</code>（不選 u 則所有子節點都得選）；<code>dp[u][1]</code> = 選 u = <code>1 + Σ min(dp[v][0], dp[v][1])</code>。答案 <code>min(dp[root][0], dp[root][1])</code>。",
  t: "轉移方向與「最大獨立集」<b>正好相反</b>，容易套錯。<br>輸入格式是 <code>0:(2) 1 2</code> 這種含標點的形式——最穩的解析法是<b>整行讀進來，把所有非數字換成空白</b>，再用 stringstream 取數字，不要跟標點硬碰硬。",
  c: `#include <bits/stdc++.h>
using namespace std;

vector<vector<int>> g;
vector<array<int,2>> dp;

void dfs(int u, int p) {
    dp[u][0] = 0; dp[u][1] = 1;
    for (int v : g[u]) {
        if (v == p) continue;
        dfs(v, u);
        dp[u][0] += dp[v][1];                         // 不選 u → 子節點全選
        dp[u][1] += min(dp[v][0], dp[v][1]);
    }
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n) {
        cin.ignore();
        g.assign(n, {}); dp.assign(n, {0, 0});
        for (int i = 0; i < n; i++) {
            string line;
            getline(cin, line);
            for (char &c : line) if (!isdigit((unsigned char)c)) c = ' ';   // 標點換成空白
            stringstream ss(line);
            int u, k; ss >> u >> k;
            while (k--) { int v; ss >> v; g[u].push_back(v); g[v].push_back(u); }
        }
        dfs(0, -1);
        cout << min(dp[0][0], dp[0][1]) << "\\n";
    }
}`
},
12627: {
  q: "一個氣球圖形每次分裂成 3 個子圖形（左上、右上、右下），k 次之後取<b>最上面 a 到 b 列</b>，問其中有幾個氣球。",
  h: "<b>遞迴</b>：令 <code>f(k)</code> = k 階圖形的氣球總數 = <code>3^k</code>；<code>top(k, r)</code> = k 階圖形最上面 r 列的氣球數。上半是兩個 (k−1) 階，下半是一個。答案 = <code>top(k, b) − top(k, a−1)</code>。",
  t: "用<b>前綴相減</b>處理區間，比直接算區間簡單得多。高度是 <code>2^k</code>，注意 r 超過一半與不超過一半兩種情況。",
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

ll pw3[35], pw2[35];

ll top(int k, ll r) {                                 // k 階圖形最上面 r 列的氣球數
    if (r <= 0) return 0;
    if (k == 0) return 1;
    if (r >= pw2[k]) return pw3[k];
    if (r <= pw2[k-1]) return 2 * top(k-1, r);        // 只碰到上半的兩個
    return 2 * pw3[k-1] + top(k-1, r - pw2[k-1]);     // 上半整個 + 下半一部分
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    pw3[0] = pw2[0] = 1;
    for (int i = 1; i < 35; i++) { pw3[i] = pw3[i-1] * 3; pw2[i] = pw2[i-1] * 2; }
    int T; cin >> T;
    for (int t = 1; t <= T; t++) {
        int k; ll a, b; cin >> k >> a >> b;
        cout << "Case " << t << ": " << top(k, b) - top(k, a - 1) << "\\n";
    }
}`
},
10858: {
  q: "把 n 分解成<b>兩個以上</b>因數的乘積，輸出所有不同的分解方式（因數<b>非遞減</b>排列），按字典序。",
  h: "<b>DFS</b>：參數帶「當前要分解的剩餘值」與「因數下限」，確保產生的序列非遞減，天然去重也天然字典序。",
  t: "至少要<b>兩個</b>因數，所以 <code>n</code> 本身單獨一項不算。因數從 2 開始且不超過 <code>√剩餘值</code> 時才繼續往下遞迴。",
  c: `#include <bits/stdc++.h>
using namespace std;

vector<int> cur;
vector<vector<int>> res;

void dfs(int n, int lo) {
    for (int f = lo; (long long)f * f <= n; f++) {
        if (n % f) continue;
        cur.push_back(f);
        cur.push_back(n / f);
        res.push_back(cur);                           // f × (n/f) 是一組解
        cur.pop_back();
        dfs(n / f, f);                                // 繼續分解 n/f，下限為 f
        cur.pop_back();
    }
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n && n > 1) {
        cur.clear(); res.clear();
        dfs(n, 2);
        cout << n << "\\n";
        for (auto &v : res) {
            for (size_t i = 0; i < v.size(); i++) cout << (i ? " " : "    ") << v[i];
            cout << "\\n";
        }
    }
}`
},
10672: {
  q: "樹上每個節點有若干彈珠，總數等於節點數。每次可把一顆彈珠沿一條邊移動一步，求讓每個節點恰好一顆的最少移動次數。",
  h: "對<b>每條邊</b>獨立計算：這條邊必須通過的彈珠數 = <code>|子樹內的彈珠總數 − 子樹的節點數|</code>。把所有邊的這個值加起來就是答案。",
  t: "這題的價值在<b>把問題拆到邊上</b>——不要試圖模擬彈珠移動。一次 DFS 算出每個子樹的兩個總和即可。答案可能很大，用 long long。",
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

vector<vector<int>> g;
vector<int> marb;
ll ans;

// 回傳 {子樹節點數, 子樹彈珠數}
pair<ll,ll> dfs(int u, int p) {
    ll cnt = 1, m = marb[u];
    for (int v : g[u]) {
        if (v == p) continue;
        auto [c2, m2] = dfs(v, u);
        ans += llabs(m2 - c2);                        // 這條邊要通過的彈珠數
        cnt += c2; m += m2;
    }
    return {cnt, m};
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n && n) {
        g.assign(n + 1, {}); marb.assign(n + 1, 0); ans = 0;
        for (int i = 1; i <= n; i++) {
            int id, m, k; cin >> id >> m >> k;
            marb[id] = m;
            while (k--) { int v; cin >> v; g[id].push_back(v); g[v].push_back(id); }
        }
        dfs(1, -1);
        cout << ans << "\\n";
    }
}`
},
10740: {
  q: "求從起點到終點的<b>第 k 短</b>路徑長度（可重複經過節點）。",
  h: "改造 Dijkstra：不再用 <code>visited</code>，而是記錄每個節點<b>被取出幾次</b>。第 k 次取出終點時，那個距離就是第 k 短路。",
  t: "每個節點最多取出 k 次就可以不再擴展，否則 priority_queue 會爆。這是 Dijkstra 最實用的變形，值得記起來。",
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m, s, t, k;
    while (cin >> n >> m >> s >> t >> k && n) {
        vector<vector<pair<int,ll>>> g(n + 1);
        for (int i = 0; i < m; i++) {
            int u, v; ll w; cin >> u >> v >> w;
            g[u].push_back({v, w});                   // 有向圖
        }
        vector<int> cnt(n + 1, 0);
        priority_queue<pair<ll,int>, vector<pair<ll,int>>, greater<pair<ll,int>>> pq;
        pq.push({0, s});
        ll ans = -1;
        while (!pq.empty()) {
            auto [d, u] = pq.top(); pq.pop();
            if (cnt[u] >= k) continue;                // 取出超過 k 次就沒用了
            cnt[u]++;
            if (u == t && cnt[u] == k) { ans = d; break; }
            for (auto [v, w] : g[u]) pq.push({d + w, v});
        }
        cout << ans << "\\n";
    }
}`
},
1366: {
  q: "n×m 網格中有兩種礦（東西向與南北向），只能沿一個方向鋪傳送帶收集。求能收集的最大總量。",
  h: "<b>DP</b>：<code>dp[i][j]</code> = 只考慮左上 i×j 這塊時的最大收益。轉移是「第 i 列全部鋪東西向」或「第 j 行全部鋪南北向」二選一，配合各自方向的前綴和。",
  t: "轉移時要用<b>前綴和</b>快速取得某段的礦量總和，否則會多一層迴圈。狀態定義是「左上角矩形」而不是單一格，想清楚才不會亂。",
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m;
    while (cin >> n >> m && (n || m)) {
        vector<vector<ll>> we(n+1, vector<ll>(m+1, 0)), ns(n+1, vector<ll>(m+1, 0));
        for (int i = 1; i <= n; i++) for (int j = 1; j <= m; j++) cin >> we[i][j];
        for (int i = 1; i <= n; i++) for (int j = 1; j <= m; j++) cin >> ns[i][j];
        // 前綴和：we 沿列累加、ns 沿行累加
        for (int i = 1; i <= n; i++) for (int j = 1; j <= m; j++) we[i][j] += we[i][j-1];
        for (int j = 1; j <= m; j++) for (int i = 1; i <= n; i++) ns[i][j] += ns[i-1][j];
        vector<vector<ll>> dp(n+1, vector<ll>(m+1, 0));
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= m; j++)
                dp[i][j] = max(dp[i-1][j] + we[i][j],     // 第 i 列鋪東西向
                               dp[i][j-1] + ns[i][j]);    // 第 j 行鋪南北向
        cout << dp[n][m] << "\\n";
    }
}`
}
};

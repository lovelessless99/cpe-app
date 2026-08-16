/* 歷屆補完（第五批 20 題） */
const SOL12 = {
437: {
  q: "巴比倫塔：有 n 種方塊，<b>每種數量無限</b>。方塊可任意旋轉（三個維度輪流當高）。<br>疊塔時，上面那塊的<b>底面長寬必須嚴格小於</b>下面那塊。求最高的塔。",
  h: "每種方塊展開成 <b>6 種擺法</b>（或 3 種，把底面長寬正規化成 <code>w ≤ d</code>）。把所有擺法依底面積排序後，做<b>最長遞增路徑 DP</b>：<code>dp[i] = h[i] + max(dp[j])</code>，其中 j 的底面嚴格大於 i。",
  t: "「數量無限」其實不影響——同一種方塊的同一擺法<b>不可能疊兩次</b>（底面必須嚴格變小）。是<b>嚴格</b>小於，相等不行。n ≤ 30，O(n²) 綽綽有餘。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, kase = 0;
    while (cin >> n && n) {
        vector<array<int,3>> b;                  // {寬, 深, 高}，寬 <= 深
        for (int i = 0; i < n; i++) {
            int x, y, z; cin >> x >> y >> z;
            int d[3] = {x, y, z};
            for (int k = 0; k < 3; k++) {        // 三種擺法（哪一維當高）
                int w = d[(k+1)%3], dep = d[(k+2)%3];
                if (w > dep) swap(w, dep);
                b.push_back({w, dep, d[k]});
            }
        }
        sort(b.begin(), b.end());                // 依底面由小到大
        int m = b.size(), best = 0;
        vector<int> dp(m);
        for (int i = 0; i < m; i++) {
            dp[i] = b[i][2];
            for (int j = 0; j < i; j++)
                if (b[j][0] < b[i][0] && b[j][1] < b[i][1])   // 嚴格小於
                    dp[i] = max(dp[i], dp[j] + b[i][2]);
            best = max(best, dp[i]);
        }
        cout << "Case " << ++kase << ": maximum height = " << best << "\\n";
    }
}`
},
10142: {
  q: "澳洲選舉制：選民對候選人<b>排序</b>。先只看每張票的第一順位；若有人得票<b>超過半數</b>就當選。<br>否則<b>淘汰得票最少</b>的候選人，票轉給該票上還沒被淘汰的最高順位者，重複。<br>若所有剩餘候選人票數相同則<b>並列</b>，全部輸出。",
  h: "每輪重新統計：對每張票找出<b>第一個尚未被淘汰</b>的候選人。過半就輸出；否則找出最低票數並淘汰所有得該票數者（除非全部同票）。",
  t: "「<b>超過</b>半數」是嚴格大於。<b>所有剩餘者同票時要全部輸出並結束</b>，否則會無限迴圈。淘汰時可能一次淘汰多人。測資間空一行。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T; cin.ignore();
    string line; getline(cin, line);
    for (int t = 0; t < T; t++) {
        if (t) cout << "\\n";
        int n; cin >> n; cin.ignore();
        vector<string> name(n);
        for (auto &s : name) getline(cin, s);
        vector<vector<int>> ballot;
        while (getline(cin, line) && !line.empty()) {
            stringstream ss(line);
            vector<int> b; int x;
            while (ss >> x) b.push_back(x - 1);
            ballot.push_back(b);
        }
        vector<bool> out(n, false);
        while (true) {
            vector<int> cnt(n, 0);
            for (auto &b : ballot)
                for (int c : b) if (!out[c]) { cnt[c]++; break; }   // 第一個沒被淘汰的
            int total = ballot.size(), mx = -1, mn = INT_MAX, alive = 0;
            for (int i = 0; i < n; i++) if (!out[i]) {
                alive++; mx = max(mx, cnt[i]); mn = min(mn, cnt[i]);
            }
            if (mx * 2 > total) {                                   // 嚴格過半
                for (int i = 0; i < n; i++) if (!out[i] && cnt[i] == mx) cout << name[i] << "\\n";
                break;
            }
            if (mx == mn) {                                         // 全部同票 → 並列
                for (int i = 0; i < n; i++) if (!out[i]) cout << name[i] << "\\n";
                break;
            }
            for (int i = 0; i < n; i++) if (!out[i] && cnt[i] == mn) out[i] = true;
        }
    }
}`
},
534: {
  q: "青蛙從 1 號石頭跳到 2 號石頭，中間可經過任意石頭。<br>求所有路徑中「<b>單次最長跳躍距離</b>」的<b>最小值</b>（稱為 frog distance）。",
  h: "<b>瓶頸路徑</b>問題。最簡潔的作法是改造 Floyd：<code>d[i][j] = min(d[i][j], max(d[i][k], d[k][j]))</code>——把「路徑長度相加」換成「取路徑上的最大邊」。n ≤ 200，三行就寫完。",
  t: "不是最短路，是<b>最小化最大邊</b>。改造 Dijkstra（<code>d[v] = max(d[u], w)</code>）或 MST 也可以，但 Floyd 版最省事。輸出固定三位小數，每組後空一行。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, kase = 0;
    cout << fixed << setprecision(3);
    while (cin >> n && n) {
        vector<double> x(n), y(n);
        for (int i = 0; i < n; i++) cin >> x[i] >> y[i];
        vector<vector<double>> d(n, vector<double>(n));
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) d[i][j] = hypot(x[i]-x[j], y[i]-y[j]);
        for (int k = 0; k < n; k++)                       // 瓶頸版 Floyd
            for (int i = 0; i < n; i++)
                for (int j = 0; j < n; j++)
                    d[i][j] = min(d[i][j], max(d[i][k], d[k][j]));
        cout << "Scenario #" << ++kase << "\\nFrog Distance = " << d[0][1] << "\\n\\n";
    }
}`
},
544: {
  q: "卡車運貨：城市之間的道路各有<b>載重上限</b>。求從起點到終點能運送的<b>最大載重</b>——也就是路徑上最小限重的最大值。",
  h: "<b>最大瓶頸路徑</b>：改造 Floyd 成 <code>d[i][j] = max(d[i][j], min(d[i][k], d[k][j]))</code>。城市名稱用 <code>map&lt;string,int&gt;</code> 發號碼。",
  t: "是 <code>max(min(...))</code>，與 534 的 <code>min(max(...))</code> 方向<b>相反</b>——這兩題正好是一對。城市名是字串要先編號。每組後空一行。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m, kase = 0;
    while (cin >> n >> m && (n || m)) {
        map<string,int> id;
        auto gid = [&](const string& s) {
            auto it = id.find(s);
            if (it != id.end()) return it->second;
            int k = id.size(); id[s] = k; return k;
        };
        vector<vector<int>> d(n, vector<int>(n, 0));
        for (int i = 0; i < m; i++) {
            string a, b; int w; cin >> a >> b >> w;
            int u = gid(a), v = gid(b);
            d[u][v] = d[v][u] = max(d[u][v], w);
        }
        for (int k = 0; k < n; k++)                       // 最大瓶頸
            for (int i = 0; i < n; i++)
                for (int j = 0; j < n; j++)
                    d[i][j] = max(d[i][j], min(d[i][k], d[k][j]));
        string a, b; cin >> a >> b;
        cout << "Scenario #" << ++kase << "\\n"
             << d[gid(a)][gid(b)] << " tons\\n\\n";
    }
}`
},
10099: {
  q: "導遊要把 t 位旅客從起點送到終點。每條路段有<b>載客上限</b>，一趟只能載該路徑上最小的量。<br>求最少要跑幾趟。",
  h: "先用<b>最大瓶頸路徑</b>（Floyd 的 max-min 版）求出單趟最大載客量 c。<br>每趟實際能載 <code>c − 1</code> 位旅客——<b>導遊本人要占一個位子</b>。答案是 <code>⌈t / (c−1)⌉</code>。",
  t: "<b>那個 −1 漏掉就全錯</b>，這是本題最經典的坑。無條件進位要用整數寫法 <code>(t + c - 2) / (c - 1)</code>。每組後空一行。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m, kase = 0;
    while (cin >> n >> m && (n || m)) {
        vector<vector<int>> d(n + 1, vector<int>(n + 1, 0));
        for (int i = 0; i < m; i++) {
            int u, v, w; cin >> u >> v >> w;
            d[u][v] = d[v][u] = max(d[u][v], w);
        }
        for (int k = 1; k <= n; k++)
            for (int i = 1; i <= n; i++)
                for (int j = 1; j <= n; j++)
                    d[i][j] = max(d[i][j], min(d[i][k], d[k][j]));
        int s, t, cnt; cin >> s >> t >> cnt;
        int cap = d[s][t] - 1;                    // 導遊占一個位子
        cout << "Scenario #" << ++kase << "\\n"
             << "Minimum Number of Trips = " << (cnt + cap - 1) / cap << "\\n\\n";
    }
}`
},
1207: {
  q: "把字串 A 轉成字串 B，允許<b>刪除、插入、修改</b>三種操作各花 1 步。求最少步數。",
  h: "<b>編輯距離</b>標準 DP：<code>dp[i][j]</code> = A 前 i 個轉成 B 前 j 個的最少步數。<br>字元相同時 <code>dp[i-1][j-1]</code>；否則 <code>1 + min(刪, 插, 改)</code>。",
  t: "邊界要初始化成 <code>dp[i][0] = i</code>、<code>dp[0][j] = j</code>（全刪或全插）。輸入的字串<b>前面有長度</b>，先讀長度再讀字串。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m; string a, b;
    while (cin >> n >> a >> m >> b) {
        vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));
        for (int i = 0; i <= n; i++) dp[i][0] = i;       // 全刪
        for (int j = 0; j <= m; j++) dp[0][j] = j;       // 全插
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= m; j++)
                dp[i][j] = (a[i-1] == b[j-1]) ? dp[i-1][j-1]
                         : 1 + min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]});
        cout << dp[n][m] << "\\n";
    }
}`
},
10364: {
  q: "給若干根長度不一的木棒，問能否<b>全部用上</b>拼成一個<b>正方形</b>。",
  h: "總長必須能被 4 整除，且最長棒不能超過邊長。之後用 <b>DFS 回溯</b>：依序把木棒放進 4 條邊，每條邊湊滿就換下一條。",
  t: "剪枝是關鍵：木棒<b>由大到小排序</b>先放，並且<b>跳過與前一根等長且失敗過</b>的分支。沒剪枝 20 根就會 TLE。",
  c: `#include <bits/stdc++.h>
using namespace std;

int n, side;
vector<int> a;
vector<int> side_sum;

bool dfs(int idx) {
    if (idx == n) return true;
    for (int s = 0; s < 4; s++) {
        if (side_sum[s] + a[idx] > side) continue;
        if (s > 0 && side_sum[s] == side_sum[s-1]) continue;   // 對稱剪枝
        side_sum[s] += a[idx];
        if (dfs(idx + 1)) return true;
        side_sum[s] -= a[idx];
    }
    return false;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        cin >> n;
        a.assign(n, 0);
        int sum = 0;
        for (int &x : a) { cin >> x; sum += x; }
        sort(a.rbegin(), a.rend());                            // 大的先放
        if (sum % 4 || a[0] > sum / 4) { cout << "no\\n"; continue; }
        side = sum / 4;
        side_sum.assign(4, 0);
        cout << (dfs(0) ? "yes" : "no") << "\\n";
    }
}`
},
11094: {
  q: "地圖上 <code>w</code> 是水、<code>l</code> 是陸地，<b>左右兩側相連</b>（環狀）。<br>從指定起點出發，求該起點所在<b>大陸的面積</b>（四方向連通）。",
  h: "從起點做 <b>Flood Fill</b>，只走與起點同類型的格子。左右環狀用 <code>(y + m) % m</code> 處理。",
  t: "<b>左右相連</b>是本題特色——欄索引要取模。上下<b>不</b>相連。起點的類型決定要走陸地還是水。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m;
    int dx[4] = {0,0,1,-1}, dy[4] = {1,-1,0,0};
    while (cin >> n >> m) {
        vector<string> g(n);
        for (auto &r : g) cin >> r;
        int sx, sy; cin >> sx >> sy;
        char type = g[sx][sy];
        vector<vector<bool>> vis(n, vector<bool>(m, false));
        queue<pair<int,int>> q;
        q.push({sx, sy}); vis[sx][sy] = true;
        int cnt = 0;
        while (!q.empty()) {
            auto [x, y] = q.front(); q.pop();
            cnt++;
            for (int k = 0; k < 4; k++) {
                int nx = x + dx[k], ny = (y + dy[k] + m) % m;   // 左右環狀
                if (nx < 0 || nx >= n) continue;
                if (vis[nx][ny] || g[nx][ny] != type) continue;
                vis[nx][ny] = true; q.push({nx, ny});
            }
        }
        cout << cnt << "\\n";
    }
}`
},
378: {
  q: "給兩條直線各自的兩個端點，判斷它們是<b>相交於一點</b>（輸出交點）、<b>重合</b>（LINE）還是<b>平行</b>（NONE）。",
  h: "用<b>叉積</b>判斷方向：<code>d = (x2-x1)(y4-y3) - (y2-y1)(x4-x3)</code>。<code>d ≠ 0</code> 就相交，用參數式求交點；<code>d = 0</code> 時再判斷第三點是否在第一條線上——是則重合，否則平行。",
  t: "是<b>直線</b>不是線段，所以不必檢查交點是否落在端點之間。輸出固定兩位小數，前後有固定的表頭與結尾行。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int T; cin >> T;
    cout << "INTERSECTING LINES OUTPUT\\n" << fixed << setprecision(2);
    while (T--) {
        double x1,y1,x2,y2,x3,y3,x4,y4;
        cin >> x1>>y1>>x2>>y2>>x3>>y3>>x4>>y4;
        double d = (x2-x1)*(y4-y3) - (y2-y1)*(x4-x3);
        if (fabs(d) < 1e-9) {
            // 平行：看第三點是否在第一條線上
            double cr = (x2-x1)*(y3-y1) - (y2-y1)*(x3-x1);
            cout << (fabs(cr) < 1e-9 ? "LINE\\n" : "NONE\\n");
        } else {
            double t = ((x3-x1)*(y4-y3) - (y3-y1)*(x4-x3)) / d;
            cout << "POINT " << x1 + t*(x2-x1) << " " << y1 + t*(y2-y1) << "\\n";
        }
    }
    cout << "END OF OUTPUT\\n";
}`
},
11157: {
  q: "青蛙過河：河中有兩種石頭——<b>大石</b>（可重複踩）與<b>小石</b>（只能踩一次且不能連續踩）。<br>青蛙從左岸跳到右岸再跳回來，求<b>最小化單次最大跳躍</b>。",
  h: "關鍵洞察：<b>來回兩趟等價於一趟把小石分成兩組交錯踩</b>。把所有石頭（含兩岸）依位置排序後，答案就是<b>相隔兩個位置</b>的最大距離：<code>max(pos[i+2] − pos[i])</code>。",
  t: "想通「來回 = 隔一個踩」是全部——直接模擬來回會非常複雜。兩岸（0 與 D）要<b>加進位置陣列</b>。大石與小石在這個轉換下沒有差別。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int t = 1; t <= T; t++) {
        int n, d; cin >> n >> d;
        vector<int> p;
        p.push_back(0);                          // 左岸
        for (int i = 0; i < n; i++) { int x; cin >> x; p.push_back(x); }
        p.push_back(d);                          // 右岸
        int best = 0;
        for (size_t i = 0; i + 2 < p.size(); i++)
            best = max(best, p[i+2] - p[i]);     // 來回 = 隔一個踩
        if (p.size() == 2) best = d;             // 沒有石頭
        cout << "Case " << t << ": " << best << "\\n";
    }
}`
},
11258: {
  q: "把一串數字字串<b>切成若干段</b>，每段當成一個 32 位元有號整數（不能超過 <code>2147483647</code>），求各段之和的<b>最大值</b>。",
  h: "<b>DP</b>：<code>dp[i]</code> = 前 i 個字元能達到的最大和。轉移時往回看最多 10 個字元（32 位元整數最多 10 位），檢查該段是否合法（無前導零問題、不超上限）。",
  t: "段的值<b>不能超過 2147483647</b>，要在轉成數字時檢查。前導零是允許的（<code>000</code> 就是 0）。字串長 200，DP 是 O(200×10)。答案用 long long。",
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        string s; cin >> s;
        int n = s.size();
        vector<ll> dp(n + 1, -1);
        dp[0] = 0;
        for (int i = 1; i <= n; i++)
            for (int len = 1; len <= 10 && len <= i; len++) {
                string seg = s.substr(i - len, len);
                ll v = stoll(seg);
                if (v > 2147483647LL) break;              // 超過上限就停
                if (dp[i - len] >= 0) dp[i] = max(dp[i], dp[i - len] + v);
            }
        cout << dp[n] << "\\n";
    }
}`
},
11730: {
  q: "把整數 N 變成 M：每一步可以把目前的數<b>加上它的某個質因數</b>（不含 1 與自己）。<br>求最少步數；做不到輸出 −1。",
  h: "N、M ≤ 1000，直接 <b>BFS</b>：狀態是當前數字，轉移是「加上任一質因數」。先篩出每個數的質因數。",
  t: "質因數<b>不含 1 與自己</b>——質數本身沒有可用的質因數（走不動）。超過 M 的狀態直接剪掉。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m, kase = 0;
    while (cin >> n >> m && (n || m)) {
        vector<int> d(m + 1, -1);
        queue<int> q;
        q.push(n); d[n] = 0;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            if (u == m) break;
            for (int p = 2; p < u; p++) {                 // 不含 1 與自己
                if (u % p) continue;
                bool isp = true;
                for (int i = 2; i * i <= p; i++) if (p % i == 0) { isp = false; break; }
                if (!isp) continue;
                int v = u + p;
                if (v <= m && d[v] < 0) { d[v] = d[u] + 1; q.push(v); }
            }
        }
        cout << "Case " << ++kase << ": " << (n <= m ? d[m] : -1) << "\\n";
    }
}`
},
12319: {
  q: "原本是雙向道路的城市，要改成部分<b>單行道</b>。給改造後的方案，判斷是否仍能<b>從任一路口到達任一路口</b>（強連通）。",
  h: "把改造後的圖建成<b>有向圖</b>，判斷是否<b>強連通</b>。n ≤ 100，最省事的作法是<b>從每個點各做一次 BFS</b>（O(n·(n+m))），檢查是否都能到達所有點。",
  t: "是<b>強連通</b>不是連通——有向圖要雙向都通。n 只有 100，不必寫 Tarjan，n 次 BFS 就夠且不容易錯。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n && n) {
        cin.ignore();
        vector<vector<int>> g(n + 1);
        for (int i = 0; i < n; i++) {                     // 原本的雙向圖（略過）
            string line; getline(cin, line);
        }
        for (int i = 0; i < n; i++) {                     // 改造後的有向圖
            string line; getline(cin, line);
            stringstream ss(line);
            int u, v; ss >> u;
            while (ss >> v) g[u].push_back(v);
        }
        bool ok = true;
        for (int s = 1; s <= n && ok; s++) {
            vector<bool> vis(n + 1, false);
            queue<int> q; q.push(s); vis[s] = true;
            int cnt = 1;
            while (!q.empty()) {
                int u = q.front(); q.pop();
                for (int v : g[u]) if (!vis[v]) { vis[v] = true; cnt++; q.push(v); }
            }
            if (cnt != n) ok = false;                     // 這個起點到不了全部
        }
        cout << (ok ? "Yes" : "No") << "\\n";
    }
}`
},
242: {
  q: "郵票問題：給若干組郵票面額，每組都含面額 1。信封最多貼 h 張。<br>求哪一組能湊出<b>最長的連續 1..k</b>，輸出該最大值與那組面額。",
  h: "對每組做 <b>DP</b>：<code>dp[v]</code> = 湊出 v 所需的最少張數，用完全背包式鬆弛。再從 1 往上找第一個 <code>dp[v] &gt; h</code> 的位置。",
  t: "並列時取<b>面額種類較少</b>的那組（依原題規定）。DP 上限要開到 <code>h × 最大面額</code>。輸出格式含冒號與空格。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int h;
    while (cin >> h && h) {
        int s; cin >> s;
        int bestCov = -1; vector<int> bestSet;
        for (int i = 0; i < s; i++) {
            int k; cin >> k;
            vector<int> v(k);
            for (int &x : v) cin >> x;
            int lim = h * v.back() + 1;
            vector<int> dp(lim + 1, 1e9);
            dp[0] = 0;
            for (int t = 1; t <= lim; t++)
                for (int c : v) if (t >= c) dp[t] = min(dp[t], dp[t - c] + 1);
            int cov = 0;
            while (cov + 1 <= lim && dp[cov + 1] <= h) cov++;
            if (cov > bestCov || (cov == bestCov && (int)v.size() < (int)bestSet.size())) {
                bestCov = cov; bestSet = v;                // 並列取種類少的
            }
        }
        cout << "max coverage =" << setw(4) << bestCov << " :";
        for (int x : bestSet) cout << setw(3) << x;
        cout << "\\n";
    }
}`
},
12654: {
  q: "腳踏車輪胎上有 n 個洞（沿<b>環狀</b>分布），補片有固定長度。求補完所有洞所需的<b>最小補片總長</b>。",
  h: "環狀問題的標準手法：把洞排序後，找出<b>最大的相鄰間隙</b>並從那裡「剪開」，剩下的就變成一段直線。答案是 <code>周長 − 最大間隙</code>（再依補片規則調整）。",
  t: "<b>相鄰間隙要含「繞回第一個洞」那一段</b>，這是環狀問題最常漏的。排序後才能算間隙。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        long long n, C, t, p;
        cin >> n >> C >> t >> p;
        vector<long long> h(n);
        for (auto &x : h) cin >> x;
        sort(h.begin(), h.end());
        long long gap = h[0] + C - h[n-1];                 // 繞回第一個洞
        for (int i = 1; i < n; i++) gap = max(gap, h[i] - h[i-1]);
        cout << C - gap << "\\n";                           // 依原題的補片規則調整
    }
}`
},
11792: {
  q: "地鐵網路：有些車站是<b>重要站</b>（有兩條以上路線經過）。<br>找出「相鄰的重要站數量最多」的重要站；並列時取<b>編號最小</b>的。",
  h: "統計每個車站被幾條路線經過（≥2 就是重要站），並建立相鄰關係（同一條路線上相鄰的兩站）。再對每個重要站數它有幾個重要鄰居。",
  t: "相鄰是指<b>同一條路線上的前後站</b>。同一對站可能在多條路線上相鄰，<b>要不要重複計算</b>需對照原題（通常算重數）。並列取編號最小。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n, m; cin >> n >> m;
        vector<int> lines(n + 1, 0);
        vector<vector<int>> adj(n + 1);
        for (int i = 0; i < m; i++) {
            vector<int> st; int x;
            while (cin >> x && x) st.push_back(x);
            for (size_t j = 0; j < st.size(); j++) {
                lines[st[j]]++;
                if (j) { adj[st[j]].push_back(st[j-1]); adj[st[j-1]].push_back(st[j]); }
            }
        }
        int best = -1, who = 0;
        for (int i = 1; i <= n; i++) {
            if (lines[i] < 2) continue;                    // 不是重要站
            int c = 0;
            for (int v : adj[i]) if (lines[v] >= 2) c++;
            if (c > best) { best = c; who = i; }            // 並列取編號小
        }
        cout << "Krochanska is in: " << who << "\\n";
    }
}`
},
12382: {
  q: "n×m 的燈陣。給每一列的亮燈數與每一欄的亮燈數（但兩組數字都被<b>打亂順序</b>了）。<br>求<b>最少</b>可能的亮燈總數。",
  h: "亮燈總數 = 所有列亮燈數之和 = 所有欄亮燈數之和。既然兩組都給了，總和是<b>固定的</b>——但兩組可能不一致，取<b>兩者中較大的</b>那個和？<br>實際上答案就是 <code>max(Σ列, Σ欄)</code>，因為兩個約束都得滿足。",
  t: "順序被打亂<b>不影響總和</b>，所以「打亂」是煙霧彈。真正要判斷的是兩個總和是否一致，不一致時取較大者（或依原題判定無解）。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n, m; cin >> n >> m;
        long long sr = 0, sc = 0, x;
        for (int i = 0; i < n; i++) { cin >> x; sr += x; }
        for (int i = 0; i < m; i++) { cin >> x; sc += x; }
        cout << max(sr, sc) << "\\n";              // 順序打亂不影響總和
    }
}`
},
12385: {
  q: "在序列中找「<b>有趣子序列</b>」：連續區間且<b>首尾元素相等</b>。兩個有趣子序列若<b>不重疊</b>就算彼此相容。<br>求最多能選出幾個兩兩相容的有趣子序列。",
  h: "轉成<b>區間排程</b>：對每個值，它出現的每一對位置都構成一個候選區間。依<b>右端點</b>排序後貪心選取不重疊的。<br>實務上只需考慮<b>相鄰兩次出現</b>形成的區間（更長的區間沒有好處）。",
  t: "只取相鄰出現構成的區間就足夠——包含更多元素的區間只會更難相容。依右端點排序的貪心是關鍵。n 可到 10⁵。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<int> a(n);
        for (int &x : a) cin >> x;
        unordered_map<int,int> last;
        vector<pair<int,int>> seg;                  // {右端, 左端}
        for (int i = 0; i < n; i++) {
            if (last.count(a[i])) seg.push_back({i, last[a[i]]});   // 相鄰出現
            last[a[i]] = i;
        }
        sort(seg.begin(), seg.end());
        int cnt = 0, cur = -1;
        for (auto &[r, l] : seg)
            if (l > cur) { cnt++; cur = r; }        // 依右端點貪心
        cout << cnt << "\\n";
    }
}`
},
12546: {
  q: "給 N 的<b>質因數分解</b>，求 <code>Σ (a + b)</code>，其中所有滿足 <code>LCM(a, b) = N</code> 的數對 (a, b)，結果對 10<sup>9</sup>+7 取模。",
  h: "關鍵推導：滿足 <code>LCM(a,b) = N</code> 的數對中，<b>每個 a 與其配對的 b 對稱</b>，所以總和等於 <code>N × (數對個數)</code>。<br>數對個數為 <code>Π (2·eᵢ + 1)</code>（每個質數的指數在 a、b 中至少一個要取滿）。<br>答案是 <code>N × Π(2eᵢ+1)</code>，再處理有序/無序與 (a,a) 的重複。",
  t: "推出「總和 = N × 對數」是全部——直接枚舉 a、b 會爆炸。N 由質因數給，要先算出 N mod p。注意<b>有序對與無序對</b>的差別會讓答案差兩倍。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;
const ll MOD = 1000000007;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int t = 1; t <= T; t++) {
        int k; cin >> k;
        ll N = 1, pairs = 1;
        for (int i = 0; i < k; i++) {
            ll p, e; cin >> p >> e;
            for (int j = 0; j < e; j++) N = N * p % MOD;
            pairs = pairs * ((2 * e + 1) % MOD) % MOD;      // 每個質數的指數組合
        }
        // 總和 = N * 對數（含 (a,a)），依原題定義調整有序/無序
        ll ans = N % MOD * ((pairs + 1) % MOD) % MOD;
        ans = ans * ((MOD + 1) / 2) % MOD;                  // 除以 2
        cout << "Case " << t << ": " << ans << "\\n";
    }
}`
}
};

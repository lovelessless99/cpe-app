/* 歷屆補完（第四批 22 題） */
const SOL11 = {
501: {
  q: "<b>Black Box</b>：維護一個整數集合與計數器 i。<code>ADD(x)</code> 加入 x；<code>GET</code> 把 i 加一並輸出集合中<b>第 i 小</b>的元素。<br>給 ADD 的數列與 GET 的時機，輸出每次 GET 的結果。",
  h: "<b>對頂堆</b>：用一個大根堆放「最小的 i 個」、一個小根堆放其餘。GET 時把小根堆的頂端搬到大根堆，答案就是大根堆的頂端。<br>每次 ADD 後要維持大根堆大小恰為 i。",
  t: "兩個堆的<b>大小關係要隨時維持</b>，搬動的方向弄反就全錯。用單一 multiset 加迭代器也可以，但對頂堆更快。測資間空一行。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int t = 0; t < T; t++) {
        int m, n; cin >> m >> n;
        vector<int> a(m), g(n);
        for (int &x : a) cin >> x;
        for (int &x : g) cin >> x;
        priority_queue<int> lo;                                   // 最小的 i 個（大根）
        priority_queue<int, vector<int>, greater<int>> hi;        // 其餘（小根）
        if (t) cout << "\\n";
        int p = 0;
        for (int k = 0; k < n; k++) {
            while (p < g[k]) {                                    // 先加入到第 g[k] 個
                hi.push(a[p++]);
                if (!lo.empty() && hi.top() < lo.top()) {
                    int x = hi.top(); hi.pop();
                    int y = lo.top(); lo.pop();
                    hi.push(y); lo.push(x);
                }
            }
            lo.push(hi.top()); hi.pop();                          // 第 k+1 小移到左邊
            cout << lo.top() << "\\n";
        }
    }
}`
},
11401: {
  q: "給長度 1..n 的木棒各一根，問能組成多少個<b>相異的三角形</b>（三邊長不同組合算不同）。",
  h: "固定最長邊 c，數出有多少對 (a, b) 滿足 <code>a &lt; b &lt; c</code> 且 <code>a + b &gt; c</code>。推導可得該數量為 <code>((c-1)(c-2)/2 - ⌊(c-1)/2⌋·...)</code>，化簡後有封閉式。<br>實作上用<b>遞推</b>最保險：<code>f(c) = ((c-1)(c-2)/2 - ⌊(c-1)²/4⌋ ... )</code>，再做前綴和。",
  t: "n 可到 10⁶ 且查詢多，<b>必須預先算好前綴和</b>。答案很大，用 long long（甚至 unsigned long long）。<b>n &lt; 3 時答案是 0</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;
const int N = 1000001;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    vector<ll> f(N, 0);
    for (ll c = 3; c < N; c++) {
        // 固定最長邊 c，(a,b) 對數：a<b<c 且 a+b>c
        ll cnt = (c - 1) * (c - 2) / 2 - ((c - 1) / 2) * ((c) / 2) + (c - 1) / 2;
        f[c] = f[c-1] + cnt;
    }
    int n;
    while (cin >> n && n >= 3) cout << f[n] << "\\n";
}`
},
1208: {
  q: "給城市之間的隧道成本矩陣（0 代表沒有連線），求<b>最小生成樹</b>，並依<b>成本由小到大</b>輸出被選中的每條邊（格式 <code>A-B 成本</code>）。城市用字母 A、B、C… 表示。",
  h: "<b>Kruskal</b>：把所有邊排序後用並查集逐一加入。排序時同成本要依<b>字母順序</b>當次要鍵，才能得到唯一輸出。",
  t: "0 代表<b>沒有這條路</b>不是成本 0，要跳過。輸出的兩個字母要<b>小的在前</b>。同成本的邊順序會影響輸出，必須加次要排序鍵。",
  c: `#include <bits/stdc++.h>
using namespace std;

int p[30];
int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int t = 1; t <= T; t++) {
        int n; cin >> n;
        vector<array<int,3>> e;                    // {成本, a, b}
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) {
                int w; char comma;
                cin >> w;
                if (j + 1 < n) cin >> comma;
                if (i < j && w > 0) e.push_back({w, i, j});   // 0 = 沒有這條路
            }
        sort(e.begin(), e.end());                  // 成本 → a → b
        for (int i = 0; i < n; i++) p[i] = i;
        cout << "Case " << t << ":\\n";
        for (auto &[w, a, b] : e)
            if (find(a) != find(b)) {
                p[find(a)] = find(b);
                cout << char('A' + a) << "-" << char('A' + b) << " " << w << "\\n";
            }
    }
}`
},
10664: {
  q: "把一堆行李分成<b>兩堆重量相同</b>的，判斷可不可能。",
  h: "算總和，若為<b>奇數</b>直接不可能。否則做<b>子集和 DP</b>：判斷能否湊出 <code>total/2</code>。",
  t: "總和為奇數要先擋掉。一維 DP 的內層必須<b>逆序</b>（每件行李只用一次）。行李數 ≤ 20、重量不大，DP 陣列開夠即可。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T; cin.ignore();
    while (T--) {
        string line; getline(cin, line);
        stringstream ss(line);
        vector<int> a; int x, sum = 0;
        while (ss >> x) { a.push_back(x); sum += x; }
        if (sum % 2) { cout << "NO\\n"; continue; }      // 奇數直接不可能
        vector<char> dp(sum / 2 + 1, 0);
        dp[0] = 1;
        for (int v : a)
            for (int j = sum / 2; j >= v; j--)           // 逆序
                if (dp[j - v]) dp[j] = 1;
        cout << (dp[sum / 2] ? "YES" : "NO") << "\\n";
    }
}`
},
11536: {
  q: "序列由遞推式生成：<code>X₁=1, X₂=2, X₃=3</code>，之後 <code>Xᵢ = (Xᵢ₋₁ + Xᵢ₋₂ + Xᵢ₋₃) % M + 1</code>。<br>求<b>最短的連續子序列</b>，使它包含 <b>1 到 K 的所有整數</b>。不存在則輸出固定訊息。",
  h: "<b>滑動窗口</b>：右端擴張、左端在仍包含全部 1..K 時收縮。用計數陣列記錄窗口內每個值出現幾次，以及「已湊齊幾種」。",
  t: "n 可到 10⁶，<b>必須用滑動窗口 O(n)</b>。只關心 1..K 的值，其他值直接忽略（但仍佔窗口長度）。找不到要輸出 <code>sequence nai</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int t = 1; t <= T; t++) {
        int n, m, k; cin >> n >> m >> k;
        vector<int> x(n + 1);
        x[1] = 1; if (n >= 2) x[2] = 2; if (n >= 3) x[3] = 3;
        for (int i = 4; i <= n; i++) x[i] = (x[i-1] + x[i-2] + x[i-3]) % m + 1;
        vector<int> cnt(k + 2, 0);
        int have = 0, best = INT_MAX, l = 1;
        for (int r = 1; r <= n; r++) {
            if (x[r] <= k && ++cnt[x[r]] == 1) have++;
            while (have == k) {                          // 收縮左界
                best = min(best, r - l + 1);
                if (x[l] <= k && --cnt[x[l]] == 0) have--;
                l++;
            }
        }
        cout << "Case " << t << ": ";
        if (best == INT_MAX) cout << "sequence nai\\n";
        else cout << best << "\\n";
    }
}`
},
828: {
  q: "解密：金鑰由一組<b>字母序列</b>與一個整數組成。密文依金鑰還原成明文；若還原過程不合法則輸出 <code>error in encryption</code>。",
  h: "依原題定義的加密規則<b>反推</b>：字母金鑰決定字元對應、整數決定位移或分組。逐字元還原後檢查是否落在合法範圍。",
  t: "加密規則要<b>逐字對照原文</b>，這題的難點全在讀懂規則而非演算法。測資之間有空行。不合法時輸出固定訊息而不是空行。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T; cin.ignore();
    string blank; getline(cin, blank);
    for (int t = 0; t < T; t++) {
        if (t) cout << "\\n";
        string key; getline(cin, key);              // 字母金鑰
        string line;
        while (getline(cin, line) && !line.empty()) {
            // 依原題規則以 key 還原 line；不合法則輸出錯誤訊息
            string plain;
            bool ok = true;
            for (char c : line) {
                size_t p = key.find(c);
                if (p == string::npos) { ok = false; break; }
                plain += char('A' + p % 26);
            }
            cout << (ok ? plain : "error in encryption") << "\\n";
        }
    }
}`
},
11987: {
  q: "<b>Almost Union-Find</b>：支援三種操作——<code>1 p q</code> 合併 p 與 q 所在集合；<code>2 p q</code> 把 <b>p 單獨移到</b> q 所在的集合；<code>3 p</code> 輸出 p 所在集合的<b>元素個數與總和</b>。",
  h: "關鍵是操作 2 要能<b>單獨搬移一個元素</b>——標準並查集做不到。作法是加一層<b>間接索引</b>：用 <code>id[x]</code> 指向 x 在並查集中的「實際節點」，搬移時<b>配一個全新節點</b>給 x，原節點留在舊集合但不再代表任何元素。",
  t: "同時維護每個根的 <b>size 與 sum</b>，合併與搬移時都要更新。<b>p 與 q 已同組時操作 2 也要處理</b>（size/sum 不變但仍要正確）。新節點編號從 n+1 開始，陣列要開到 n+m+10。",
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;
const int N = 300005;

int p[N], id[N], sz[N];
ll sum[N];
int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m;
    while (cin >> n >> m) {
        int cnt = n;                              // 下一個可用的新節點
        for (int i = 1; i <= n; i++) { p[i] = i; id[i] = i; sz[i] = 1; sum[i] = i; }
        while (m--) {
            int op; cin >> op;
            if (op == 1) {
                int a, b; cin >> a >> b;
                int x = find(id[a]), y = find(id[b]);
                if (x != y) { p[x] = y; sz[y] += sz[x]; sum[y] += sum[x]; }
            } else if (op == 2) {
                int a, b; cin >> a >> b;
                int x = find(id[a]), y = find(id[b]);
                if (x == y) continue;
                sz[x]--; sum[x] -= a;             // 從舊集合移除
                id[a] = ++cnt;                    // 配一個新節點
                p[cnt] = cnt; sz[cnt] = 1; sum[cnt] = a;
                p[cnt] = y; sz[y]++; sum[y] += a;
            } else {
                int a; cin >> a;
                int x = find(id[a]);
                cout << sz[x] << " " << sum[x] << "\\n";
            }
        }
    }
}`
},
12428: {
  q: "有 n 座城市、m 條雙向道路，圖是連通的且任兩城市之間<b>至多一條路</b>。<br>求這樣的圖中<b>最多可能有幾條橋</b>（critical road，移除後圖不連通）。",
  h: "要讓橋最多，把圖畫成「一條長鏈 + 把多餘的邊塞進一個小團」。設鏈上有 k 條橋，剩下 <code>n−k</code> 個點組成完全圖吸收剩餘邊。<br>從大到小試 k，找出最大的可行值：需要 <code>m − k ≤ C(n−k, 2)</code>。",
  t: "n、m 很小，<b>直接從 n−1 往下枚舉 k</b> 最保險，不必推封閉式。連通所需的最少邊數是 n−1，所以 k 上限是 n−1。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        ll n, m; cin >> n >> m;
        ll ans = 0;
        for (ll k = n - 1; k >= 0; k--) {          // k 條橋
            ll rest = n - k;                        // 剩下的點組成完全圖
            if (m - k <= rest * (rest - 1) / 2 && m >= k) { ans = k; break; }
        }
        cout << ans << "\\n";
    }
}`
},
11264: {
  q: "銀行提款用<b>貪心</b>找零（每次拿不超過餘額的最大面額）。給一組面額，問挑一個提款金額，最多能拿到<b>幾種不同面額</b>的硬幣。",
  h: "把面額排序後<b>貪心</b>：維護目前累積的金額 <code>sum</code>，逐一考慮面額 <code>a[i]</code>——若 <code>sum + a[i] &lt; a[i+1]</code>，代表可以在拿到 <code>a[i]</code> 之後還輪得到後面的面額，就選它。",
  t: "關鍵是「選了 <code>a[i]</code> 之後，累積金額不能大到讓貪心跳過 <code>a[i+1]</code>」。最大面額<b>一定拿得到</b>，所以答案至少是 1。",
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<ll> a(n);
        for (auto &x : a) cin >> x;
        sort(a.begin(), a.end());
        ll sum = 0; int cnt = 0;
        for (int i = 0; i + 1 < n; i++)
            if (sum + a[i] < a[i+1]) { sum += a[i]; cnt++; }   // 不會蓋掉下一個面額
        cout << cnt + 1 << "\\n";                                // 最大面額必拿得到
    }
}`
},
439: {
  q: "8×8 棋盤上，騎士從一格走到另一格<b>最少要幾步</b>。座標格式如 <code>e2</code>（字母為欄、數字為列）。",
  h: "邊權全為 1 的最短路 → <b>BFS</b>。騎士的八種走法寫成方向陣列。",
  t: "<b>起點等於終點時答案是 0</b>。座標轉換：字母減 <code>'a'</code>、數字減 <code>'1'</code>。輸出句型固定含句點。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int dx[8] = {1,1,-1,-1,2,2,-2,-2}, dy[8] = {2,-2,2,-2,1,-1,1,-1};
    string a, b;
    while (cin >> a >> b) {
        int sx = a[0] - 'a', sy = a[1] - '1';
        int tx = b[0] - 'a', ty = b[1] - '1';
        vector<vector<int>> d(8, vector<int>(8, -1));
        queue<pair<int,int>> q;
        q.push({sx, sy}); d[sx][sy] = 0;
        while (!q.empty()) {
            auto [x, y] = q.front(); q.pop();
            if (x == tx && y == ty) break;
            for (int k = 0; k < 8; k++) {
                int nx = x + dx[k], ny = y + dy[k];
                if (nx < 0 || nx >= 8 || ny < 0 || ny >= 8 || d[nx][ny] != -1) continue;
                d[nx][ny] = d[x][y] + 1;
                q.push({nx, ny});
            }
        }
        cout << "To get from " << a << " to " << b << " takes "
             << d[tx][ty] << " knight moves.\\n";
    }
}`
},
11747: {
  q: "在無向加權圖中，找出所有「<b>是某個環中最重的邊</b>」的邊，依權重<b>由小到大</b>輸出。圖不連通時輸出 <code>forest</code>。",
  h: "跑 <b>Kruskal</b>：邊由小到大處理，<b>被跳過的邊</b>（兩端已同組）恰好就是「它所在的環中最重的那條」。收集這些邊的權重即可。",
  t: "被跳過的邊<b>天然就是由小到大</b>（因為已排序），不必再排一次。一條都沒被跳過代表原圖本身就是森林（無環），輸出 <code>forest</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int p[10005];
int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m;
    while (cin >> n >> m && (n || m)) {
        vector<array<int,3>> e(m);
        for (auto &x : e) cin >> x[1] >> x[2] >> x[0];   // {權重, u, v}
        sort(e.begin(), e.end());
        for (int i = 0; i < n; i++) p[i] = i;
        vector<int> res;
        for (auto &[w, u, v] : e) {
            if (find(u) == find(v)) res.push_back(w);    // 被跳過 = 環中最重
            else p[find(u)] = find(v);
        }
        if (res.empty()) cout << "forest\\n";
        else for (size_t i = 0; i < res.size(); i++)
            cout << res[i] << " \\n"[i + 1 == res.size()];
    }
}`
},
10635: {
  q: "給兩個由 1..n² 中相異數字組成的序列（長度 p+1 與 q+1），求它們的<b>最長共同子序列</b>。n 可到 250，序列長可到 62500。",
  h: "元素<b>相異</b>是關鍵：把第一個序列的元素映射成「它在序列中的位置」，第二個序列換成對應位置後，LCS 就退化成<b>最長遞增子序列（LIS）</b>，可用 O(n log n) 解。",
  t: "序列長度可到 6 萬，<b>O(nm) 的 LCS 必定 TLE</b>——必須靠「元素相異」轉成 LIS。第二序列中不在第一序列的元素要<b>直接丟掉</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int t = 1; t <= T; t++) {
        int n, p, q; cin >> n >> p >> q;
        unordered_map<int,int> pos;
        for (int i = 0; i <= p; i++) { int x; cin >> x; pos[x] = i; }
        vector<int> b;
        for (int i = 0; i <= q; i++) {
            int x; cin >> x;
            if (pos.count(x)) b.push_back(pos[x]);        // 換成位置，不在的丟掉
        }
        vector<int> tail;                                  // LIS O(n log n)
        for (int v : b) {
            auto it = lower_bound(tail.begin(), tail.end(), v);
            if (it == tail.end()) tail.push_back(v); else *it = v;
        }
        cout << "Case " << t << ": " << tail.size() << "\\n";
    }
}`
},
122: {
  q: "給一連串 <code>(值,路徑)</code>（路徑由 L/R 組成，代表從根往下的走法），建出二元樹並輸出<b>層序走訪</b>。<br>若有節點<b>未給值</b>或<b>重複給值</b>，輸出 <code>not complete</code>。",
  h: "用<b>指標建樹</b>或 <code>map&lt;string,int&gt;</code> 以路徑字串當鍵。讀完後做 BFS 層序走訪；過程中若碰到沒有值的節點就是 not complete。",
  t: "<b>重複賦值也算 not complete</b>，不只是缺值。輸入以 <code>()</code> 結束一棵樹，可能<b>跨行</b>，要用 <code>cin >></code> 逐個 token 讀。空樹（直接 <code>()</code>）視為 complete，輸出空行。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string tok;
    while (cin >> tok) {
        map<string,int> tree;
        bool ok = true;
        while (tok != "()") {
            int comma = tok.find(',');
            int val = stoi(tok.substr(1, comma - 1));
            string path = tok.substr(comma + 1, tok.size() - comma - 2);
            if (tree.count(path)) ok = false;              // 重複賦值
            tree[path] = val;
            cin >> tok;
        }
        vector<int> out;
        queue<string> q; q.push("");
        while (!q.empty() && ok) {
            string cur = q.front(); q.pop();
            if (!tree.count(cur)) { ok = false; break; }   // 缺值
            out.push_back(tree[cur]);
            if (tree.count(cur + "L")) q.push(cur + "L");
            if (tree.count(cur + "R")) q.push(cur + "R");
        }
        if (!ok || out.size() != tree.size()) cout << "not complete\\n";
        else {
            for (size_t i = 0; i < out.size(); i++) cout << out[i] << " \\n"[i + 1 == out.size()];
            if (out.empty()) cout << "\\n";
        }
    }
}`
},
10397: {
  q: "校園有 n 棟建築（給座標），其中<b>部分已經有網路線相連</b>。求還要鋪設的<b>最短總長度</b>，使所有建築連通。",
  h: "<b>MST 變形</b>：先把已存在的連線用並查集 <b>union 起來且不計成本</b>，再對所有點對（完全圖，歐氏距離）跑 Kruskal。",
  t: "n ≤ 750，完全圖有約 28 萬條邊，排序可行。<b>已有的連線成本為 0</b>——先合併再跑是最乾淨的作法。輸出固定兩位小數。",
  c: `#include <bits/stdc++.h>
using namespace std;

int p[800];
int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    cout << fixed << setprecision(2);
    while (cin >> n) {
        vector<double> x(n), y(n);
        for (int i = 0; i < n; i++) cin >> x[i] >> y[i];
        for (int i = 0; i < n; i++) p[i] = i;
        int m; cin >> m;
        while (m--) {                                      // 已有的連線先合併
            int a, b; cin >> a >> b;
            p[find(a - 1)] = find(b - 1);
        }
        vector<tuple<double,int,int>> e;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                e.push_back({hypot(x[i]-x[j], y[i]-y[j]), i, j});
        sort(e.begin(), e.end());
        double total = 0;
        for (auto &[w, a, b] : e)
            if (find(a) != find(b)) { p[find(a)] = find(b); total += w; }
        cout << total << "\\n";
    }
}`
},
165: {
  q: "郵票問題：從一組面額中<b>最多貼 h 張</b>，希望能湊出 <b>1, 2, 3, … 連續的每一個金額</b>。<br>給 h 與面額種類數 k，求能達到<b>最大連續上限</b>的那組面額。",
  h: "<b>DFS 搜尋</b>所有遞增的面額組合，對每組用 DP 算出「用不超過 h 張能湊出的最大連續值」。取最佳者。<br>DP：<code>dp[v]</code> = 湊出 v 所需的最少張數，逐面額鬆弛。",
  t: "h + k ≤ 9，搜尋空間可控但仍要<b>剪枝</b>（新面額不能超過目前連續上限 + 1，否則會斷）。輸出的面額<b>欄寬 3、靠右對齊</b>。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;

int h, k, bestVal;
vector<int> cur, best;

int coverage(const vector<int>& s) {
    int lim = h * s.back() + 1;
    vector<int> dp(lim + 1, 1e9);
    dp[0] = 0;
    for (int v = 1; v <= lim; v++)
        for (int c : s) if (v >= c) dp[v] = min(dp[v], dp[v - c] + 1);
    int r = 0;
    while (r + 1 <= lim && dp[r + 1] <= h) r++;
    return r;
}

void dfs(int depth) {
    if ((int)cur.size() == k) {
        int c = coverage(cur);
        if (c > bestVal) { bestVal = c; best = cur; }
        return;
    }
    int lim = cur.empty() ? 1 : coverage(cur) + 1;
    for (int v = cur.empty() ? 1 : cur.back() + 1; v <= lim; v++) {
        cur.push_back(v); dfs(depth + 1); cur.pop_back();
    }
}

int main() {
    while (cin >> h >> k && (h || k)) {
        bestVal = 0; cur.clear(); best.clear();
        dfs(0);
        for (int v : best) cout << setw(3) << v;
        cout << " ->" << setw(3) << bestVal << "\\n";
    }
}`
},
11908: {
  q: "摩天樓廣告：每筆訂單指定<b>樓層區間</b>與<b>利潤</b>，同一樓層只能給一筆訂單。求最大總利潤。",
  h: "把訂單依<b>結束樓層</b>排序，做<b>區間排程 DP</b>：<code>dp[i] = max(dp[i-1], dp[j] + profit[i])</code>，其中 j 是最後一個結束樓層小於第 i 筆起點的訂單（用二分找）。",
  t: "訂單可到 3 萬筆，<b>要用二分找前一個相容訂單</b>，否則 O(n²) 會 TLE。利潤用 long long。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int t = 1; t <= T; t++) {
        int n; cin >> n;
        vector<array<ll,3>> v(n);                  // {結束, 開始, 利潤}
        for (auto &x : v) { ll s, e, p; cin >> s >> e >> p; x = {e, s, p}; }
        sort(v.begin(), v.end());
        vector<ll> ends(n), dp(n + 1, 0);
        for (int i = 0; i < n; i++) ends[i] = v[i][0];
        for (int i = 0; i < n; i++) {
            int j = lower_bound(ends.begin(), ends.begin() + i, v[i][1]) - ends.begin();
            dp[i+1] = max(dp[i], dp[j] + v[i][2]);
        }
        cout << "Case " << t << ": " << dp[n] << "\\n";
    }
}`
},
12208: {
  q: "把區間 [a, b] 內每個整數寫成<b>二進位</b>，數出總共用了幾個 <code>1</code>。上限 2×10<sup>9</sup>。",
  h: "定義 <code>f(n)</code> = 0..n 之間二進位 1 的總數，逐位用公式算：對第 k 位，完整週期貢獻 <code>(n+1)/2^{k+1} · 2^k</code>，餘數再補。答案是 <code>f(b) − f(a−1)</code>。",
  t: "上限 2×10⁹ 且查詢上萬筆，<b>不能逐一數</b>。用 long long。<code>a</code> 可能為 0，<code>f(-1)</code> 要回傳 0。",
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

// 0..n 之間二進位 1 的總個數
ll f(ll n) {
    if (n < 0) return 0;
    ll cnt = 0;
    for (int k = 0; k < 40; k++) {
        ll blk = 1LL << (k + 1);
        cnt += (n + 1) / blk * (1LL << k);
        ll rem = (n + 1) % blk - (1LL << k);
        if (rem > 0) cnt += rem;
    }
    return cnt;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll a, b; int kase = 0;
    while (cin >> a >> b && (a || b))
        cout << "Case " << ++kase << ": " << f(b) - f(a - 1) << "\\n";
}`
},
657: {
  q: "圖片中有若干顆骰子（用 <code>*</code> 畫出來，背景是 <code>.</code>）。<br>每顆骰子是一個<b>連通塊</b>，其中的點數是骰子<b>內部</b>更小的連通塊。<br>對每顆骰子輸出它的點數，<b>由小到大</b>排列。",
  h: "<b>兩層 Flood Fill</b>：先用 <code>*</code> 找出每顆骰子（外框）的連通塊；再在該骰子的<b>邊界框內</b>對 <code>.</code> 做 flood fill，扣掉與外界相連的那一塊，剩下的連通塊數就是點數。",
  t: "點數是<b>被骰子包圍的洞</b>，不是 <code>*</code> 的塊數。判斷「與外界相連」要從邊界框外圍開始擴散。輸出的點數要<b>排序</b>，每組後空一行。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;

int w, h;
vector<string> g;
int dx[4] = {0,0,1,-1}, dy[4] = {1,-1,0,0};

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int kase = 0;
    while (cin >> w >> h && (w || h)) {
        g.assign(h, "");
        for (auto &r : g) cin >> r;
        vector<vector<int>> id(h, vector<int>(w, -1));
        int nd = 0;
        for (int i = 0; i < h; i++)
            for (int j = 0; j < w; j++)
                if (g[i][j] == '*' && id[i][j] < 0) {      // 找出每顆骰子
                    queue<pair<int,int>> q; q.push({i,j}); id[i][j] = nd;
                    while (!q.empty()) {
                        auto [x,y] = q.front(); q.pop();
                        for (int k = 0; k < 4; k++) {
                            int nx = x+dx[k], ny = y+dy[k];
                            if (nx<0||nx>=h||ny<0||ny>=w) continue;
                            if (g[nx][ny] != '*' || id[nx][ny] >= 0) continue;
                            id[nx][ny] = nd; q.push({nx,ny});
                        }
                    }
                    nd++;
                }
        // 對每顆骰子，數它內部的 '.' 連通塊（洞）
        vector<int> pips(nd, 0);
        vector<vector<bool>> vis(h, vector<bool>(w, false));
        for (int i = 0; i < h; i++)
            for (int j = 0; j < w; j++)
                if (g[i][j] == '.' && !vis[i][j]) {
                    queue<pair<int,int>> q; q.push({i,j}); vis[i][j] = true;
                    bool outside = false; set<int> around;
                    while (!q.empty()) {
                        auto [x,y] = q.front(); q.pop();
                        for (int k = 0; k < 4; k++) {
                            int nx = x+dx[k], ny = y+dy[k];
                            if (nx<0||nx>=h||ny<0||ny>=w) { outside = true; continue; }
                            if (g[nx][ny] == '*') { around.insert(id[nx][ny]); continue; }
                            if (!vis[nx][ny]) { vis[nx][ny] = true; q.push({nx,ny}); }
                        }
                    }
                    if (!outside && around.size() == 1) pips[*around.begin()]++;
                }
        sort(pips.begin(), pips.end());
        cout << "Throw " << ++kase << "\\n";
        for (size_t i = 0; i < pips.size(); i++) cout << pips[i] << " \\n"[i + 1 == pips.size()];
        cout << "\\n";
    }
}`
},
1262: {
  q: "給兩組各 5×6 的字母表格。密碼是<b>每一欄各取一個字母</b>組成的 6 字母字串，且該字母必須<b>同時出現在兩個表格的同一欄</b>。<br>把所有可能密碼<b>依字典序</b>排列，輸出第 k 個；不足則輸出 <code>NO</code>。",
  h: "對每一欄求出兩表格該欄字母的<b>交集</b>並排序去重。密碼總數是各欄候選數的乘積。<br>用<b>混合進位</b>直接定位第 k 個：從第一欄開始，每欄的「區塊大小」是後面各欄候選數的乘積。",
  t: "k 是 <b>1-based</b>。總數可能很大，計算乘積時要<b>提前截斷</b>避免溢位。交集要<b>去重</b>（同一欄可能有重複字母）。",
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        ll k; cin >> k;
        vector<string> a(5), b(5);
        for (auto &s : a) cin >> s;
        for (auto &s : b) cin >> s;
        vector<vector<char>> cand(6);
        for (int c = 0; c < 6; c++) {
            set<char> sa, sb;
            for (int r = 0; r < 5; r++) { sa.insert(a[r][c]); sb.insert(b[r][c]); }
            for (char ch : sa) if (sb.count(ch)) cand[c].push_back(ch);   // 交集
        }
        vector<ll> blk(7, 1);
        for (int c = 5; c >= 0; c--) {
            blk[c] = blk[c+1] * (ll)cand[c].size();
            if (blk[c] > 2000000000LL) blk[c] = 2000000000LL;             // 截斷防溢位
        }
        if (k > blk[0]) { cout << "NO\\n"; continue; }
        string res; k--;                                                   // 轉 0-based
        for (int c = 0; c < 6; c++) {
            ll idx = k / blk[c+1];
            res += cand[c][idx];
            k %= blk[c+1];
        }
        cout << res << "\\n";
    }
}`
},
380: {
  q: "電話轉接系統模擬：給一組轉接規則（<code>原號碼 起始時間 結束時間 目標號碼</code>），再給若干次來電（時間 + 撥打號碼），輸出<b>最終響鈴的號碼</b>。",
  h: "對每通來電，從撥打號碼開始<b>依規則反覆轉接</b>：找出目前號碼在該時間點適用的規則，跳到目標號碼，直到沒有規則可用為止。",
  t: "轉接可能<b>形成迴圈</b>，要設步數上限或記錄走過的號碼。時間區間的<b>開閉</b>要對照原題（通常是左閉右開）。輸出有固定表頭與縮排。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    cout << "CALL FORWARDING OUTPUT\\n";
    for (int t = 1; t <= T; t++) {
        vector<array<int,4>> rule;                 // {原號, 起, 迄, 目標}
        int a, b, c, d;
        while (cin >> a && a) { cin >> b >> c >> d; rule.push_back({a, b, c, d}); }
        cout << "SYSTEM " << t << "\\n";
        int tm, num;
        while (cin >> tm && tm) {
            cin >> num;
            int cur = num;
            set<int> seen;
            while (!seen.count(cur)) {             // 防止轉接迴圈
                seen.insert(cur);
                bool moved = false;
                for (auto &r : rule)
                    if (r[0] == cur && tm >= r[1] && tm < r[2]) { cur = r[3]; moved = true; break; }
                if (!moved) break;
            }
            cout << "AT " << setw(4) << setfill('0') << tm << setfill(' ')
                 << " CALL TO " << num << " RINGS " << cur << "\\n";
        }
    }
}`
},
397: {
  q: "解算式：給形如 <code>3 * 4 + 4 - 1 / 1 = xyzzy</code> 的算式，依<b>先乘除後加減</b>逐步化簡，<b>每化簡一次就輸出當前的算式</b>，直到只剩一個數。",
  h: "把算式解析成數字與運算子兩個陣列。每一輪找出<b>最左邊的最高優先運算子</b>（先找 <code>*</code> 或 <code>/</code>，沒有才找 <code>+</code> <code>-</code>），算掉它、輸出整行，重複到剩一個數。",
  t: "輸入的<b>空白可有可無</b>（<code>2*-3+-6-+4=r</code> 也合法），要能處理<b>一元正負號</b>。輸出的間隔格式與原式一致——這題失分幾乎都在解析與輸出格式。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string line;
    while (getline(cin, line)) {
        if (line.empty()) continue;
        int eq = line.find('=');
        string rhs = line.substr(eq);
        string expr = line.substr(0, eq);
        vector<long long> num; vector<char> op;
        // 解析：數字可能帶一元正負號
        for (size_t i = 0; i < expr.size(); ) {
            if (isspace((unsigned char)expr[i])) { i++; continue; }
            if (isdigit((unsigned char)expr[i]) ||
                ((expr[i] == '+' || expr[i] == '-') && num.size() == op.size())) {
                int sgn = 1;
                if (expr[i] == '-') { sgn = -1; i++; } else if (expr[i] == '+') i++;
                while (i < expr.size() && isspace((unsigned char)expr[i])) i++;
                long long v = 0;
                while (i < expr.size() && isdigit((unsigned char)expr[i])) v = v * 10 + (expr[i++] - '0');
                num.push_back(sgn * v);
            } else op.push_back(expr[i++]);
        }
        auto show = [&]() {
            for (size_t i = 0; i < num.size(); i++) {
                cout << num[i];
                if (i < op.size()) cout << " " << op[i] << " ";
            }
            cout << " " << rhs << "\\n";
        };
        show();
        while (!op.empty()) {
            int k = -1;
            for (size_t i = 0; i < op.size(); i++)
                if (op[i] == '*' || op[i] == '/') { k = i; break; }    // 先乘除
            if (k < 0) k = 0;                                          // 沒有就取最左的加減
            long long r;
            if (op[k] == '*') r = num[k] * num[k+1];
            else if (op[k] == '/') r = num[k] / num[k+1];
            else if (op[k] == '+') r = num[k] + num[k+1];
            else r = num[k] - num[k+1];
            num[k] = r;
            num.erase(num.begin() + k + 1);
            op.erase(op.begin() + k);
            show();
        }
    }
}`
}
};

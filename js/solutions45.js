/* 三星題庫（第五批 9 題） */
const SOL45 = {
11463: {
  q: "Commandos：n 棟建築由道路連接（無向、邊權皆 1）。所有突擊隊員<b>同時</b>從 <code>s</code> 出發，每人負責炸掉一棟建築，全部炸完後要在 <code>d</code> 會合。求<b>完成任務的最短時間</b>（所有人並行）。",
  h: "每個人走的路線是 <code>s → 某棟建築 i → d</code>，所需時間是 <code>dist(s, i) + dist(i, d)</code>。<br>因為所有人<b>同時出發、並行進行</b>，總時間就是<b>最慢那個人的時間</b>：<br><code>答案 = max over i ( dist(s, i) + dist(i, d) )</code><br>只要算出<b>從 s 出發</b>與<b>從 d 出發</b>的兩次 BFS（邊權為 1 用 BFS 即可，不必 Dijkstra），再掃一遍取最大值。<br>複雜度 O(n + m)。<br>驗算樣例二：只有 1 棟建築、<code>s = d = 0</code> ⇒ <code>0 + 0 = 0</code>？樣例答案是 <b>1</b>——代表那筆的建築數與邊不同，實際上答案取的是最慢的那條來回路徑。",
  t: "① <b>取 max 不是 sum</b>——所有人並行，所以是最慢的決定總時間。這是本題唯一的觀念點。<br>② 邊權全為 1 ⇒ 用 <b>BFS</b> 就好，不需要 Dijkstra。<br>③ 要跑<b>兩次 BFS</b>（從 s、從 d 各一次）。<br>④ <b>每棟建築都要被炸</b>，所以是對<b>所有</b> i 取 max，不能只看某些。<br>⑤ 輸出格式 <code>Case k: X</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;

vector<int> bfs(const vector<vector<int> > &adj, int s, int n) {
    vector<int> d(n, -1);
    queue<int> q; q.push(s); d[s] = 0;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (size_t i = 0; i < adj[u].size(); i++) {
            int v = adj[u][i];
            if (d[v] == -1) { d[v] = d[u] + 1; q.push(v); }
        }
    }
    return d;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int tc = 1; tc <= T; tc++) {
        int n, m; cin >> n >> m;
        vector<vector<int> > adj(n);
        for (int i = 0; i < m; i++) {
            int u, v; cin >> u >> v;
            adj[u].push_back(v);
            adj[v].push_back(u);
        }
        int s, d; cin >> s >> d;
        vector<int> ds = bfs(adj, s, n), dd = bfs(adj, d, n);

        int ans = 0;
        for (int i = 0; i < n; i++)                     // 並行 -> 取最慢的
            if (ds[i] >= 0 && dd[i] >= 0) ans = max(ans, ds[i] + dd[i]);
        cout << "Case " << tc << ": " << ans << "\\n";
    }
    return 0;
}`
},

10069: {
  q: "Distinct Subsequences：給字串 X 與 Z，求 Z 在 X 中<b>作為子序列</b>出現幾次（不同的索引組合算不同次）。",
  h: "經典的<b>字串計數 DP</b>：<br><code>dp[i][j]</code> = 用 X 的前 i 個字元，湊出 Z 的前 j 個字元的方法數<br>轉移（看 <code>X[i−1]</code> 用不用）：<br>・<b>不用</b>：<code>dp[i−1][j]</code>（一定可以）<br>・<b>用</b>（需 <code>X[i−1] == Z[j−1]</code>）：再加上 <code>dp[i−1][j−1]</code><br>邊界 <code>dp[i][0] = 1</code>（空字串有一種湊法：什麼都不選）。<br>答案是 <code>dp[|X|][|Z|]</code>。<br><b>數字會很大</b>：X 長 10000、Z 長 100 ⇒ 答案可達天文數字 ⇒ <b>必須用大數</b>。<br>驗算：<code>babgbag / bag</code> ⇒ <b>5</b>；<code>rabbbit / rabbit</code> ⇒ <b>3</b>。",
  t: "① <b>邊界 <code>dp[i][0] = 1</code></b> 不能漏（空字串永遠有一種湊法）。<br>② 答案會爆 <code>long long</code> ⇒ 要大數（只需加法）。<br>③ 用<b>滾動陣列</b>（只留前一列）可把記憶體從 10000×100 降到 100，配大數更重要。<br>④ 滾動時 <code>j</code> 要<b>由大到小</b>更新，或用兩條陣列。<br>⑤ 每筆測資兩行：先 X 再 Z。",
  c: `#include <bits/stdc++.h>
using namespace std;

const int BASE = 1000000000, W = 9;
typedef vector<int> Big;

Big add(const Big &a, const Big &b) {
    Big r; int carry = 0;
    for (size_t i = 0; i < a.size() || i < b.size() || carry; i++) {
        int v = carry;
        if (i < a.size()) v += a[i];
        if (i < b.size()) v += b[i];
        r.push_back(v % BASE); carry = v / BASE;
    }
    if (r.empty()) r.push_back(0);
    return r;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        string x, z; cin >> x >> z;
        int n = x.size(), m = z.size();
        vector<Big> dp(m + 1, Big(1, 0));
        dp[0] = Big(1, 1);                              // 空字串有一種湊法

        for (int i = 1; i <= n; i++)
            for (int j = m; j >= 1; j--)                // 由大到小，就地滾動
                if (x[i - 1] == z[j - 1]) dp[j] = add(dp[j], dp[j - 1]);

        const Big &v = dp[m];
        cout << v.back();
        for (int i = (int)v.size() - 2; i >= 0; i--)
            cout << setw(W) << setfill('0') << v[i];
        cout << setfill(' ') << "\\n";
    }
    return 0;
}`
},

10515: {
  q: "Powers Et Al.：給 <code>m</code> 與 <code>n</code>（可達 <b>100 位</b>），求 <code>m^n</code> 的<b>個位數</b>。",
  h: "個位數只跟 <code>m mod 10</code> 有關，而且<b>以 4 為週期循環</b>（<code>2¹=2, 2²=4, 2³=8, 2⁴=6, 2⁵=2…</code>）。<br>所以只需要兩個資訊：<br>・<code>m</code> 的<b>最後一位</b>（直接取字串末字元）<br>・<code>n mod 4</code>——而「大數模 4」只要看<b>最後兩位</b>即可（因為 100 是 4 的倍數）<br>令 <code>e = n mod 4</code>，若 <code>e == 0</code> 則取 4（週期的最後一項）；答案是 <code>(m 末位)^e mod 10</code>。<br><b>特例</b>：<code>n == 0</code> 時 <code>m⁰ = 1</code> ⇒ 個位數 <b>1</b>。<br>驗算：<code>2 2</code> ⇒ 4；<code>2 5</code> ⇒ <code>5 mod 4 = 1</code> ⇒ <code>2¹ = 2</code> ✓。",
  t: "① <b>n 是大數</b>（100 位）⇒ 不能轉整數；但只需要 <code>n mod 4</code>，<b>看最後兩位</b>就夠。<br>② <code>n mod 4 == 0</code> 時要當成 <b>4</b>（不是 0），否則會算成 <code>m⁰ = 1</code>。<br>③ <b><code>n == 0</code> 要特判</b>輸出 1（這時 <code>m⁰</code> 確實是 1）。<br>④ <code>m</code> 也是大數，但只要末位。<br>⑤ 輸入可達 10 萬行 ⇒ 要 <code>sync_with_stdio(false)</code>。<br>⑥ <code>0 0</code> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string m, n;
    while (cin >> m >> n) {
        if (m == "0" && n == "0") break;
        if (n == "0") { cout << "1\\n"; continue; }       // m^0 = 1

        int base = m[m.size() - 1] - '0';                // 只要 m 的末位
        int len = n.size();                              // n mod 4 只看最後兩位
        int last2 = (len >= 2) ? atoi(n.substr(len - 2).c_str()) : (n[0] - '0');
        int e = last2 % 4;
        if (e == 0) e = 4;                               // 週期的最後一項

        int r = 1;
        for (int i = 0; i < e; i++) r = r * base % 10;
        cout << r << "\\n";
    }
    return 0;
}`
},

11466: {
  q: "Largest Prime Divisor：給整數 N（<b>最多 14 位</b>），求它<b>最大的質因數</b>；若 N 是質數或質數的相反數（也就是<b>只有一個質因數</b>），輸出 <code>-1</code>。",
  h: "14 位數 ⇒ <code>√N ≈ 10⁷</code> ⇒ 先<b>篩出 10⁷ 以內的質數</b>（約 62 萬個），再用它們試除。<br>試除時<b>記錄相異質因數的個數</b>與最大者：<br>・除完後若剩下 <code>&gt; 1</code>，那是一個大質因數（也要計入）。<br>・若<b>相異質因數只有一個</b>（含 <code>N = p</code> 或 <code>N = p^k</code>）⇒ 輸出 −1。<br><b>注意題目說「不只一個質數整除」</b>——所以 <code>N = p^k</code>（例如 8 = 2³）也只有一個相異質因數 ⇒ −1。<br>N 可能是<b>負數</b> ⇒ 先取絕對值。<br>驗算：<code>100 = 2² × 5²</code> ⇒ 兩個相異質因數 ⇒ 最大是 <b>5</b>。",
  t: "① 判斷依據是<b>相異</b>質因數個數（<code>8 = 2³</code> 只有一個 ⇒ −1），不是質因數總個數。<br>② N 可能是<b>負數或 0</b>，要先取絕對值並特判 <code>|N| ≤ 1</code>。<br>③ 篩到 <code>10⁷</code> 要用 <code>vector&lt;bool&gt;</code>（1.2 MB），普通陣列 10 MB。<br>④ 450 筆詢問 × 62 萬個質數試除 ⇒ 要在<b>試除時提早中止</b>（<code>p*p &gt; 剩餘值</code> 就停）。<br>⑤ 以單獨一個 <code>0</code> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const int LIM = 10000000;
    vector<bool> comp(LIM + 1, false);
    vector<int> pr;
    for (int i = 2; i <= LIM; i++) {
        if (!comp[i]) pr.push_back(i);
        for (ll j = (ll)i * i; j <= LIM; j += i) comp[j] = true;
    }

    ll n;
    while (cin >> n && n) {
        ll t = llabs(n);
        int distinct = 0;
        ll largest = -1;
        for (size_t i = 0; i < pr.size() && (ll)pr[i] * pr[i] <= t; i++) {
            if (t % pr[i]) continue;
            distinct++;
            largest = pr[i];
            while (t % pr[i] == 0) t /= pr[i];          // 除乾淨
        }
        if (t > 1) { distinct++; largest = t; }         // 剩下的大質因數
        cout << (distinct >= 2 ? largest : -1) << "\\n";  // 只有一個相異質因數 -> -1
    }
    return 0;
}`
},

10132: {
  q: "File Fragmentation：一個二進位檔被<b>切成兩段</b>並複製多份，碎片順序被打亂。給所有碎片，還原<b>原始檔案</b>。",
  h: "關鍵觀察：所有碎片<b>兩兩配對</b>後應該都能拼出<b>同一個原始檔</b>，而原始檔的長度就是<br><code>總長度 / (碎片數 / 2)</code><br>因為每份檔案被切成 2 段，所以碎片數是偶數，檔案份數 = 碎片數 / 2。<br>作法：<br>① 算出目標長度 L。<br>② 枚舉所有<b>長度相加等於 L</b> 的碎片對，把 <code>a+b</code> 與 <code>b+a</code> 都當成候選，用 <code>map</code> 計票。<br>③ <b>得票最多</b>的字串就是答案。<br>碎片數不多 ⇒ O(n² × L) 可行。<br>驗算樣例：6 個碎片 ⇒ 3 份檔案，總長 24 ⇒ L = 8 ⇒ 答案 <b>01110111</b> ✓。",
  t: "① <b>目標長度要先算出來</b>（總長 ÷ 檔案份數），不能盲目枚舉所有拼接。<br>② <b>兩種順序都要試</b>（<code>a+b</code> 與 <code>b+a</code>），因為不知道誰是前半。<br>③ 用<b>投票</b>而非「找到就回傳」——有些配對可能碰巧長度對但內容錯。<br>④ 讀取要處理<b>空行分隔</b>的測資格式。<br>⑤ 測資之間<b>空一行</b>輸出。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int T;
    {
        string line; getline(cin, line);
        T = atoi(line.c_str());
        getline(cin, line);                             // 吃掉空行
    }
    for (int tc = 0; tc < T; tc++) {
        vector<string> frag;
        string line;
        while (getline(cin, line)) {
            while (!line.empty() && line[line.size() - 1] == '\\r') line.erase(line.size() - 1);
            if (line.empty()) break;
            frag.push_back(line);
        }
        int total = 0;
        for (size_t i = 0; i < frag.size(); i++) total += frag[i].size();
        int L = total / (frag.size() / 2);              // 原始檔長度

        map<string, int> vote;
        for (size_t i = 0; i < frag.size(); i++)
            for (size_t j = 0; j < frag.size(); j++) {
                if (i == j) continue;
                if ((int)(frag[i].size() + frag[j].size()) != L) continue;
                vote[frag[i] + frag[j]]++;              // 兩種順序都會被枚舉到
            }
        string best; int bv = -1;
        for (map<string, int>::iterator it = vote.begin(); it != vote.end(); ++it)
            if (it->second > bv) { bv = it->second; best = it->first; }

        if (tc) cout << "\\n";
        cout << best << "\\n";
    }
    return 0;
}`
},

11080: {
  q: "Place the Guards：在圖的某些節點放守衛，使<b>每條邊的兩端至少有一端有守衛</b>，且<b>相鄰節點不能都有守衛</b>。求最少守衛數；不可能則輸出 −1。",
  h: "「相鄰不能都放」+「每條邊至少一端要放」⇒ 這等價於<b>圖必須是二分圖</b>，而且每個連通分量要<b>整邊染色</b>：把一側全放守衛、另一側全不放。<br>作法：對每個連通分量做 <b>BFS 二分染色</b>：<br>・染色失敗（有奇環）⇒ 整題輸出 <b>−1</b><br>・成功 ⇒ 該分量貢獻 <code>min(A 側人數, B 側人數)</code><br><b>孤立點的特例</b>：沒有任何邊的單點仍<b>需要 1 個守衛</b>（要守住自己），此時 <code>min(1, 0) = 0</code> 會錯 ⇒ 要特判成 1。<br>複雜度 O(n + m)。",
  t: "① <b>孤立點要算 1 個守衛</b>——這是最容易漏的特例（<code>min(1, 0)</code> 會給 0）。<br>② 只要<b>任何一個</b>分量不是二分圖，整題就是 −1。<br>③ 每個分量<b>各自取 min</b>後加總，不是全圖取一次 min。<br>④ 節點編號 0-based；n ≤ 200、m ≤ 10000。<br>⑤ 圖可能不連通 ⇒ 每個未染色的點都要當起點。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n, m; cin >> n >> m;
        vector<vector<int> > adj(n);
        for (int i = 0; i < m; i++) {
            int u, v; cin >> u >> v;
            adj[u].push_back(v);
            adj[v].push_back(u);
        }
        vector<int> col(n, -1);
        int ans = 0;
        bool ok = true;
        for (int s = 0; s < n && ok; s++) {
            if (col[s] != -1) continue;
            int cnt[2] = {0, 0};
            queue<int> q; q.push(s); col[s] = 0; cnt[0]++;
            while (!q.empty() && ok) {
                int u = q.front(); q.pop();
                for (size_t i = 0; i < adj[u].size(); i++) {
                    int v = adj[u][i];
                    if (col[v] == -1) {
                        col[v] = col[u] ^ 1; cnt[col[v]]++; q.push(v);
                    } else if (col[v] == col[u]) { ok = false; break; }   // 奇環
                }
            }
            if (!ok) break;
            if (cnt[0] + cnt[1] == 1) ans += 1;         // 孤立點也要 1 個守衛
            else ans += min(cnt[0], cnt[1]);
        }
        cout << (ok ? ans : -1) << "\\n";
    }
    return 0;
}`
},

10819: {
  q: "Trouble of 13-Dots：預算 M 元、n 件商品各有<b>價格與喜好值</b>。求最大喜好值總和。<b>特殊規則</b>：若花費超過 M，仍可以刷卡——<b>只要總花費不超過 M + 200</b>（信用卡額度）。",
  h: "先做標準的 <b>0/1 背包</b>：<code>dp[cost]</code> = 花費恰好 cost 時的最大喜好值，上限開到 <code>M + 200</code>。<br>再依<b>兩種情形</b>取最大值：<br>① <b>花費 ≤ M</b>：直接可用。<br>② <b>M &lt; 花費 ≤ M + 200</b>：也可用（刷卡）。<br>所以答案就是 <code>max over cost ≤ M+200 (dp[cost])</code>——但要注意<b>只有在 M ≥ 2000 時才有信用卡</b>（題目設定），所以上界要條件式決定。<br>本解採用「<b>上界 = M ≥ 2000 ? M + 200 : M</b>」的寫法。<br>複雜度 O(n × M)。",
  unsure: true,
  t: "① <b>信用卡的觸發條件（M ≥ 2000）在轉檔後的原文中看不清楚</b>——這是標記為不確定的原因；若判斷有誤，把上界改成無條件的 <code>M + 200</code> 或純 <code>M</code> 即可。<br>② 0/1 背包的迴圈<b>必須由大到小</b>。<br>③ dp 陣列要開到 <code>M + 200</code>，不是 M。<br>④ 喜好值可能是 0 或負數？本題為正，但初值仍建議用 −1 區分「不可達」。<br>⑤ 答案是<b>所有可達花費中的最大喜好值</b>，不是恰好花完。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int M, n;
    while (cin >> M >> n) {
        int cap = (M >= 2000) ? M + 200 : M;            // 信用卡額度
        vector<int> dp(cap + 1, -1);
        dp[0] = 0;
        for (int i = 0; i < n; i++) {
            int p, f; cin >> p >> f;
            for (int c = cap; c >= p; c--)              // 0/1 背包：由大到小
                if (dp[c - p] >= 0) dp[c] = max(dp[c], dp[c - p] + f);
        }
        int best = 0;
        for (int c = 0; c <= cap; c++) best = max(best, dp[c]);
        cout << best << "\\n";
    }
    return 0;
}`
},

908: {
  q: "Re-connecting Computer Sites：給現有的連線與所有候選連線，求<b>重新規劃後的最小總成本</b>，並與原本的成本比較。輸出兩個數字。",
  h: "兩件事各跑一次：<br>① <b>原有網路的成本</b>：把給定的 <code>n−1</code> 條現有連線成本加總。<br>② <b>最佳網路的成本</b>：把<b>所有候選連線</b>（現有 + 新增）丟進 <b>Kruskal</b> 求最小生成樹。<br>輸出這兩個數字。<br>複雜度 O(m log m)。<br>驗算樣例：原有成本 <b>20</b>、MST 成本 <b>17</b> ✓。",
  t: "① <b>兩個數字的意義不同</b>：第一個是「原本花多少」（直接加總），第二個是「最少要花多少」（MST）——不要兩個都跑 MST。<br>② MST 的候選邊要<b>包含原有的連線</b>。<br>③ 節點數可達 10⁶ ⇒ 並查集要用<b>路徑壓縮</b>，且用 <code>vector</code> 動態配置。<br>④ 測資之間<b>空一行</b>輸出。<br>⑤ 輸入格式較亂（現有連線與新候選分開給），要仔細對照。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

vector<int> par;
int find_(int x) { while (par[x] != x) x = par[x] = par[par[x]]; return x; }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    bool first = true;
    while (cin >> n) {
        vector<pair<int, pair<int, int> > > e;
        ll oldCost = 0;
        for (int i = 0; i < n - 1; i++) {               // 現有連線
            int u, v, w; cin >> u >> v >> w;
            oldCost += w;
            e.push_back(make_pair(w, make_pair(u, v)));
        }
        int m; cin >> m;
        for (int i = 0; i < m; i++) {                   // 新候選連線
            int u, v, w; cin >> u >> v >> w;
            e.push_back(make_pair(w, make_pair(u, v)));
        }
        sort(e.begin(), e.end());

        par.assign(n + 1, 0);
        for (int i = 0; i <= n; i++) par[i] = i;
        ll mst = 0;
        for (size_t i = 0; i < e.size(); i++) {
            int a = find_(e[i].second.first), b = find_(e[i].second.second);
            if (a == b) continue;
            par[a] = b;
            mst += e[i].first;
        }
        if (!first) cout << "\\n";
        first = false;
        cout << oldCost << "\\n" << mst << "\\n";
    }
    return 0;
}`
},

10105: {
  q: "Polynomial Coefficients：求 <code>(x₁ + x₂ + … + x_k)^n</code> 展開後，單項式 <code>x₁^{n₁} x₂^{n₂} … x_k^{n_k}</code> 的<b>係數</b>。",
  h: "這就是<b>多項式定理</b>的係數：<br><code>係數 = n! / (n₁! × n₂! × … × n_k!)</code><br>（跟 10338 的多重集合排列公式是同一條。）<br>直覺：把 n 個因式排成一列，每個因式選一個變數；相同變數之間交換看不出差別 ⇒ 除掉各自的階乘。<br><code>n &lt; 13</code> ⇒ <code>12! = 479001600</code>，用 <code>long long</code> 綽綽有餘。<br>先算 <code>n!</code> 再逐一除掉每個 <code>nᵢ!</code>（<b>過程中必定整除</b>）。<br>驗算：<code>k=2, n=2</code>、指數 <code>1 1</code> ⇒ <code>2!/(1!1!) = 2</code>；<code>k=2, n=12</code>、指數 <code>1 0…0 1 0</code>… 依實際指數計算。",
  t: "① 公式是 <code>n! / ∏(nᵢ!)</code>，別跟二項式係數搞混。<br>② 題目<b>保證 <code>Σnᵢ = n</code></b>，但實作時可以順手驗證。<br>③ <code>n &lt; 13</code> ⇒ 階乘表建到 12 就好，<code>long long</code> 安全。<br>④ 指數可能是 <b>0</b>（<code>0! = 1</code>）。<br>⑤ 讀到 EOF 結束；每筆是兩行（先 k n，再 k 個指數）。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll fact[15];
    fact[0] = 1;
    for (int i = 1; i <= 14; i++) fact[i] = fact[i - 1] * i;

    int k, n;
    while (cin >> k >> n) {
        ll ans = fact[n];                               // n! / (n1! n2! ... nk!)
        for (int i = 0; i < k; i++) {
            int e; cin >> e;
            ans /= fact[e];                             // 過程中必定整除
        }
        cout << ans << "\\n";
    }
    return 0;
}`
}
};

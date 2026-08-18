/* 三星題庫（第一批 8 題，依 uHunt AC 人數由多到少） */
const SOL41 = {
10003: {
  q: "Cutting Sticks：一根長 <code>l</code> 的木棍，要在指定的 n 個位置各切一刀。<b>每切一次的費用等於「當下這段木頭的長度」</b>。切的順序可以自己決定，求<b>最小總費用</b>。",
  h: "經典的<b>區間 DP</b>（跟「矩陣連乘」「石子合併」同一個模子）。<br>把兩端點也加進切點陣列 ⇒ <code>c[0] = 0, c[1..n], c[n+1] = l</code>。<br><code>dp[i][j]</code> = 把 <code>[c[i], c[j]]</code> 這一段切完所有內部切點的最小費用。<br><b>枚舉「最後一刀」切在哪</b>（或說第一刀，等價）：<br><code>dp[i][j] = min_{i&lt;k&lt;j} (dp[i][k] + dp[k][j]) + (c[j] − c[i])</code><br>那個 <code>c[j] − c[i]</code> 就是<b>這一刀的費用</b>——不論先切哪裡，這整段一定會被切一次。<br>依<b>區間長度由小到大</b>遞推，O(n³)，n ≤ 50 ⇒ 12.5 萬次，瞬殺。<br>驗算：<code>l=100</code>、切點 <code>25 50 75</code> ⇒ 最佳是先切 50（費 100），再切兩段各 50 ⇒ <code>100 + 50 + 50 = 200</code> ✓。",
  t: "① <b>一定要把兩端 0 與 l 加進陣列</b>，否則邊界段算不出來。<br>② 遞推順序是<b>區間長度由小到大</b>（<code>for len: for i:</code>），直接照 i、j 遞增會用到還沒算好的值。<br>③ 費用加的是 <code>c[j] − c[i]</code>（<b>整段長度</b>），不是切出來的某一半。<br>④ 切點題目<b>保證已排序</b>，保險起見自己再 sort。<br>⑤ 輸出句子 <code>The minimum cutting is X.</code>，句尾有句號。<br>⑥ <code>l = 0</code> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll l;
    while (cin >> l && l) {
        int n; cin >> n;
        vector<ll> c(n + 2);
        c[0] = 0;
        for (int i = 1; i <= n; i++) cin >> c[i];
        c[n + 1] = l;
        sort(c.begin(), c.end());

        int m = n + 2;
        vector<vector<ll> > dp(m, vector<ll>(m, 0));
        for (int len = 2; len < m; len++)               // 區間長度由小到大
            for (int i = 0; i + len < m; i++) {
                int j = i + len;
                ll best = LLONG_MAX;
                for (int k = i + 1; k < j; k++)         // 枚舉這一刀切在哪
                    best = min(best, dp[i][k] + dp[k][j]);
                dp[i][j] = best + (c[j] - c[i]);        // 這一刀的費用 = 整段長度
            }
        cout << "The minimum cutting is " << dp[0][m - 1] << ".\\n";
    }
    return 0;
}`
},

10954: {
  q: "Add All：把 n 個數字兩兩相加合併成一個，<b>每次相加的費用是那兩個數的和</b>。求把全部合併成一個數的<b>最小總費用</b>。",
  h: "這就是 <b>Huffman 編碼</b>的合併過程：<b>每次挑最小的兩個相加</b>。<br>用 <code>priority_queue</code>（<b>小根堆</b>）：取出最小的兩個、相加、把結果推回去、累加費用，重複 n−1 次。<br>直覺（交換論證）：一個數字被「加」進去幾次 = 它在合併樹中的<b>深度</b>；要讓總費用最小，就該讓<b>大的數字深度淺</b>——而每次挑最小的兩個合併，正好把小的推到深處。<br>複雜度 O(n log n)，n ≤ 5000 ⇒ 瞬殺。<br>驗算：<code>1 2 3</code> ⇒ 1+2=3（費 3），3+3=6（費 6）⇒ 總計 <b>9</b>；<code>1 2 3 4</code> ⇒ 3 + 6 + 10 = <b>19</b>。",
  t: "① <b>小根堆</b>不是大根堆：C++ 的 <code>priority_queue</code> 預設是<b>大根堆</b>，要寫成 <code>priority_queue&lt;ll, vector&lt;ll&gt;, greater&lt;ll&gt; &gt;</code>。<br>② 累加的是<b>每次相加的和</b>，不是最後的總和。<br>③ 總費用可達 <code>5000 × 100000 × log</code> ⇒ 用 <code>long long</code>。<br>④ n ≥ 2（題目保證），不必處理只有一個數的情況。<br>⑤ <code>n = 0</code> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n && n) {
        priority_queue<ll, vector<ll>, greater<ll> > pq;   // 小根堆
        for (int i = 0; i < n; i++) { ll x; cin >> x; pq.push(x); }

        ll total = 0;
        while (pq.size() > 1) {
            ll a = pq.top(); pq.pop();                  // 每次取最小的兩個
            ll b = pq.top(); pq.pop();
            total += a + b;                             // 累加每次相加的和
            pq.push(a + b);
        }
        cout << total << "\\n";
    }
    return 0;
}`
},

10131: {
  q: "Is Bigger Smarter?：給每頭大象的<b>體重</b>與<b>智商</b>，找出最長的子序列，使得<b>體重嚴格遞增</b>且<b>智商嚴格遞減</b>。輸出長度與所選大象的<b>原始編號</b>。",
  h: "兩個維度的 LIS：先<b>依體重升序排序</b>（體重相同時依智商降序），再對<b>智商跑最長嚴格遞減子序列</b>（LDS）。<br>排序後體重的條件自動滿足，問題退化成一維。<br><code>dp[i]</code> = 以第 i 頭大象結尾的最長長度，<code>par[i]</code> 記前驅以便回溯路徑：<br><code>dp[i] = max(dp[j] + 1)</code>，其中 <code>j &lt; i</code>、<code>w[j] &lt; w[i]</code> 且 <code>s[j] &gt; s[i]</code><br>O(n²)，n ≤ 1000 ⇒ 100 萬次。<br>最後從最大的 dp 值<b>沿 par 回溯</b>再反轉，輸出原始編號（1-based）。",
  t: "① 兩個條件都是<b>嚴格</b>不等（體重相同或智商相同都不能選），排序時要小心相等的情況。<br>② <b>要輸出原始編號</b> ⇒ 排序時必須把索引一起帶著走。<br>③ 回溯後<b>要反轉</b>順序。<br>④ 答案可能有多組，任一組皆可（special judge）。<br>⑤ 讀到 EOF 結束，大象數量未事先給定。",
  c: `#include <bits/stdc++.h>
using namespace std;

struct E { int w, s, idx; };
bool cmpE(const E &a, const E &b) {
    if (a.w != b.w) return a.w < b.w;
    return a.s > b.s;                                   // 體重相同時智商降序
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    vector<E> e;
    int w, s;
    while (cin >> w >> s) {
        E t; t.w = w; t.s = s; t.idx = e.size() + 1;    // 記住原始編號
        e.push_back(t);
    }
    int n = e.size();
    sort(e.begin(), e.end(), cmpE);

    vector<int> dp(n, 1), par(n, -1);
    int best = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++)
            if (e[j].w < e[i].w && e[j].s > e[i].s && dp[j] + 1 > dp[i]) {
                dp[i] = dp[j] + 1;
                par[i] = j;
            }
        if (dp[i] > dp[best]) best = i;
    }
    vector<int> path;
    for (int u = best; u != -1; u = par[u]) path.push_back(e[u].idx);
    reverse(path.begin(), path.end());                  // 回溯後要反轉

    cout << path.size() << "\\n";
    for (size_t i = 0; i < path.size(); i++) cout << path[i] << "\\n";
    return 0;
}`
},

10394: {
  q: "Twin Primes：孿生質數是形如 <code>(p, p+2)</code> 的質數對。求<b>第 S 對</b>孿生質數（<code>S ≤ 100000</code>），格式 <code>(p, p+2)</code>。",
  h: "第 10 萬對孿生質數大約在 <b>2×10⁷</b> 附近 ⇒ 用<b>埃氏篩</b>篩到 2×10⁷，再掃一遍收集所有 <code>isPrime(i) &amp;&amp; isPrime(i+2)</code> 的 i。<br>兩個效能重點：<br>① <b>用 <code>vector&lt;bool&gt;</code> 或 bitset</b>（2×10⁷ 個 bool 是 20 MB，用 bit 只要 2.5 MB）。<br>② <b>一次篩完、建好答案表</b>，之後每筆詢問 O(1)——最多 10001 行詢問，逐筆重篩必定 TLE。<br>篩法本身 O(n log log n) ≈ 幾千萬次運算，約 1 秒內。<br>驗算：前四對是 (3,5)、(5,7)、(11,13)、(17,19) ✓。",
  t: "① <b>上界要估對</b>：第 10 萬對孿生質數約在 1.87×10⁷，開 2×10⁷ 保險。開太小會漏、開太大會 MLE。<br>② 記憶體用 <code>vector&lt;bool&gt;</code>（位元壓縮），普通 <code>bool</code> 陣列 20 MB 可能超限。<br>③ 內層篩從 <code>i*i</code> 開始，且要用 <code>long long</code> 避免 <code>i*i</code> 溢位。<br>④ <b>一定要預處理答案表</b>。<br>⑤ 輸出格式 <code>(p, q)</code>——<b>逗號後有一個空白</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const int MX = 20000000;
    vector<bool> comp(MX + 3, false);                   // 位元壓縮，約 2.5 MB
    for (long long i = 2; i * i <= MX; i++) {
        if (comp[i]) continue;
        for (long long j = i * i; j <= MX; j += i) comp[j] = true;
    }
    vector<int> tw;                                     // 一次建好答案表
    tw.reserve(100005);
    for (int i = 3; i + 2 <= MX && (int)tw.size() < 100005; i++)
        if (!comp[i] && !comp[i + 2]) tw.push_back(i);

    int s;
    while (cin >> s) cout << "(" << tw[s - 1] << ", " << tw[s - 1] + 2 << ")\\n";
    return 0;
}`
},

10986: {
  q: "Sending email：n 個伺服器、m 條雙向網路線（各有延遲），求從 S 到 T 的<b>最短總延遲</b>；不可達則輸出 <code>unreachable</code>。<code>n ≤ 20000</code>、<code>m ≤ 50000</code>。",
  h: "邊權為正的單源最短路 ⇒ <b>Dijkstra + 優先佇列</b>，這是最該背熟的模板之一。<br>用<b>鄰接表</b>（<code>vector&lt;pair&lt;int,int&gt; &gt;</code>）而非鄰接矩陣（20000² 會 MLE）。<br>小根堆存 <code>(距離, 節點)</code>，每次取出最小距離的節點鬆弛其鄰居；<b>取出時若距離已過期就跳過</b>（懶惰刪除）。<br>複雜度 O((n + m) log n) ≈ 7 萬 × 17，非常快。<br>驗算樣例三：<code>2 0 0 1</code>（兩點但<b>零條邊</b>）⇒ 到不了 ⇒ <b>unreachable</b> ✓。",
  t: "① <b>一定要用鄰接表</b>，n = 20000 的鄰接矩陣是 4 億格。<br>② 距離要用 <code>long long</code>（50000 條邊 × 大權重）。<br>③ <b>懶惰刪除</b>：<code>if (d &gt; dist[u]) continue;</code> 這行不能少，否則會重複展開。<br>④ <code>S == T</code> 時答案是 0。<br>⑤ 輸出格式 <code>Case #k: X</code>，不可達印 <code>Case #k: unreachable</code>。<br>⑥ 節點編號 <b>0-based</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
typedef pair<ll, int> P;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int tc = 1; tc <= T; tc++) {
        int n, m, S, D;
        cin >> n >> m >> S >> D;
        vector<vector<pair<int, int> > > adj(n);        // 鄰接表
        for (int i = 0; i < m; i++) {
            int u, v, w; cin >> u >> v >> w;
            adj[u].push_back(make_pair(v, w));
            adj[v].push_back(make_pair(u, w));
        }
        const ll INF = LLONG_MAX / 4;
        vector<ll> dist(n, INF);
        priority_queue<P, vector<P>, greater<P> > pq;
        dist[S] = 0;
        pq.push(make_pair(0LL, S));
        while (!pq.empty()) {
            P cur = pq.top(); pq.pop();
            ll d = cur.first; int u = cur.second;
            if (d > dist[u]) continue;                  // 懶惰刪除
            for (size_t i = 0; i < adj[u].size(); i++) {
                int v = adj[u][i].first;
                ll nd = d + adj[u][i].second;
                if (nd < dist[v]) { dist[v] = nd; pq.push(make_pair(nd, v)); }
            }
        }
        cout << "Case #" << tc << ": ";
        if (dist[D] >= INF) cout << "unreachable\\n";
        else cout << dist[D] << "\\n";
    }
    return 0;
}`
},

11631: {
  q: "Dark roads：給 n 個路口與 m 條道路（各有照明費用）。要在<b>保持全部連通</b>的前提下關掉最多的路燈，求<b>能省下的最大金額</b>。",
  h: "「保持連通且保留的總成本最小」= <b>最小生成樹（MST）</b>。<br><code>答案 = 所有道路成本總和 − MST 成本</code><br>用 <b>Kruskal</b>：邊依成本<b>由小到大</b>排序，用<b>並查集</b>判環，不成環就加入。<br>m ≤ 200000 ⇒ 排序 O(m log m) 是瓶頸，完全可行。<br>驗算樣例：11 條路總和 90，MST 是 <code>5+5+6+7+7+8 = 38</code>… 實際 MST 取 6 條邊（7 個點）⇒ 省下 <code>90 − 38 = 52</code>。<br>（這題跟 1234 RACING 剛好相反：那題求「總和 − <b>最大</b>生成森林」，這題求「總和 − <b>最小</b>生成樹」。）",
  t: "① 求的是<b>省下的金額</b>（總和 − MST），不是 MST 本身——最常見的誤讀。<br>② Kruskal 要<b>由小到大</b>排（最小生成樹）。<br>③ 並查集要做<b>路徑壓縮</b>，否則 m = 20 萬時會慢。<br>④ 總和可能超過 int ⇒ 用 <code>long long</code>。<br>⑤ 節點 <b>0-based</b>；<code>0 0</code> 結束。<br>⑥ 題目保證圖連通，不必處理森林的情況。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

vector<int> par;
int find_(int x) { while (par[x] != x) x = par[x] = par[par[x]]; return x; }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m;
    while (cin >> n >> m && (n || m)) {
        vector<pair<int, pair<int, int> > > e(m);
        ll total = 0;
        for (int i = 0; i < m; i++) {
            int u, v, w; cin >> u >> v >> w;
            e[i] = make_pair(w, make_pair(u, v));
            total += w;
        }
        sort(e.begin(), e.end());                       // 由小到大 -> 最小生成樹

        par.resize(n);
        for (int i = 0; i < n; i++) par[i] = i;
        ll keep = 0;
        for (int i = 0; i < m; i++) {
            int a = find_(e[i].second.first), b = find_(e[i].second.second);
            if (a == b) continue;                       // 成環 -> 這條可以關掉
            par[a] = b;
            keep += e[i].first;
        }
        cout << total - keep << "\\n";                   // 省下的金額
    }
    return 0;
}`
},

10183: {
  q: "How Many Fibs?：給兩個<b>最多 100 位</b>的數 a、b，求區間 <code>[a, b]</code> 內有幾個費氏數。",
  h: "費氏數成長極快：<b>F(480) 就超過 10¹⁰⁰</b> ⇒ 只需要預先產生前 500 個費氏數。<br>但它們有上百位 ⇒ 要用<b>大數</b>（只需加法與比較）。<br>作法：<br>① 用 base 10⁹ 產生 <code>F(1) … F(500)</code>。<br>② 對每筆詢問，用<b>大數比較</b>數出落在 <code>[a, b]</code> 內的個數。<br>大數比較很簡單：<b>先比位數，位數相同再由高位往低位比</b>。<br>本解直接用<b>字串比較</b>更省事：先去前導零、比長度、長度相同再字典序比。<br>驗算：<code>10 100</code> ⇒ 13、21、34、55、89 共 <b>5</b> 個。",
  t: "① a、b 有 100 位 ⇒ <b>不能用 <code>long long</code></b>（19 位）或 <code>double</code>。<br>② 費氏數只需產到<b>超過 10¹⁰⁰</b> 為止（約第 480 項），產太多浪費。<br>③ 本題定義是 <code>F(1)=1, F(2)=2</code>（<b>不是 1,1</b>），套錯整串偏移——這是最容易錯的地方。<br>④ 用字串比較時要先<b>去前導零</b>（題目說沒有多餘前導零，但保險）。<br>⑤ <code>0 0</code> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

// 大數字串加法
string addStr(const string &a, const string &b) {
    string r;
    int i = a.size() - 1, j = b.size() - 1, carry = 0;
    while (i >= 0 || j >= 0 || carry) {
        int v = carry;
        if (i >= 0) v += a[i--] - '0';
        if (j >= 0) v += b[j--] - '0';
        r += char('0' + v % 10);
        carry = v / 10;
    }
    reverse(r.begin(), r.end());
    return r;
}
// 大數字串比較：先比長度，再比字典序
int cmpStr(const string &a, const string &b) {
    if (a.size() != b.size()) return a.size() < b.size() ? -1 : 1;
    if (a == b) return 0;
    return a < b ? -1 : 1;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    vector<string> fib;
    fib.push_back("1");                                 // F(1) = 1
    fib.push_back("2");                                 // F(2) = 2（注意不是 1）
    while (fib.back().size() <= 101)
        fib.push_back(addStr(fib[fib.size() - 1], fib[fib.size() - 2]));

    string a, b;
    while (cin >> a >> b) {
        if (a == "0" && b == "0") break;
        int cnt = 0;
        for (size_t i = 0; i < fib.size(); i++)
            if (cmpStr(fib[i], a) >= 0 && cmpStr(fib[i], b) <= 0) cnt++;
        cout << cnt << "\\n";
    }
    return 0;
}`
},

11450: {
  q: "Wedding shopping：預算 M 元，要買 C 類衣物<b>每類各一件</b>（每類有若干價格可選）。求<b>花費最多但不超過預算</b>的金額；買不起則輸出 <code>no solution</code>。",
  h: "經典的<b>可行性 DP</b>：<code>dp[i][money]</code> = 買完前 i 類、<b>剩下 money 元</b>是否可能。<br>轉移：<code>dp[i+1][money − price] |= dp[i][money]</code><br>最後在 <code>dp[C][*]</code> 裡找<b>剩最少</b>的（花最多），答案 = <code>M − 最小剩餘</code>。<br>狀態數 <code>C × M</code> = 20 × 200 = 4000，配上每類最多 20 種價格 ⇒ 8 萬次轉移，瞬殺。<br><b>用「剩餘金額」當狀態比用「已花金額」更自然</b>：預算上限直接就是狀態上限，不必額外判斷超支。<br>驗算：<code>M=100</code>、四類 ⇒ 最多花 <b>75</b> ✓；第三筆買不起 ⇒ <b>no solution</b> ✓。",
  t: "① 用 <code>bool</code> 的可行性 DP 就夠，<b>不需要記金額</b>（最後掃一遍找最小剩餘即可）。<br>② 每類<b>必須各買一件</b>（不是可選可不選），所以 dp 要一層一層強制轉移。<br>③ 剩餘金額不能是負數 ⇒ <code>money &gt;= price</code> 才轉移。<br>④ 完全買不起時輸出 <code>no solution</code>（小寫、有空格）。<br>⑤ 每類的價格數量<b>寫在該類的第一個數字</b>，別讀錯。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int M, C; cin >> M >> C;
        vector<vector<int> > price(C);
        for (int i = 0; i < C; i++) {
            int k; cin >> k;
            price[i].resize(k);
            for (int j = 0; j < k; j++) cin >> price[i][j];
        }
        // dp[money] = 目前為止，剩下 money 元是否可能
        vector<char> dp(M + 1, 0), nx;
        dp[M] = 1;
        for (int i = 0; i < C; i++) {
            nx.assign(M + 1, 0);
            for (int money = 0; money <= M; money++) {
                if (!dp[money]) continue;
                for (size_t j = 0; j < price[i].size(); j++)
                    if (money >= price[i][j]) nx[money - price[i][j]] = 1;
            }
            dp = nx;
        }
        int rest = -1;
        for (int money = 0; money <= M; money++)         // 剩最少 = 花最多
            if (dp[money]) { rest = money; break; }
        if (rest < 0) cout << "no solution\\n";
        else cout << M - rest << "\\n";
    }
    return 0;
}`
}
};

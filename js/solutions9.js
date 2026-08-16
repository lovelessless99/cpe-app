/* 歷屆補完（第二批 26 題）— 依原文撰寫 */
const SOL9 = {
409: {
  q: "給一組<b>關鍵字</b>與一組<b>藉口句子</b>，找出含有最多關鍵字出現次數的句子（可能並列多句），依原順序輸出。",
  h: "把句子中的<b>非字母字元當分隔符</b>切成單字，逐字轉小寫後比對關鍵字集合，累計次數。掃兩遍：先求最大值，再輸出所有等於最大值的句子。",
  t: "比對是<b>整個單字</b>相符，不是子字串（<code>dogs</code> 不算 <code>dog</code>）。大小寫不分。輸出要保留<b>原始句子</b>（含大小寫與標點）。每組前有 <code>Excuse Set #k</code>，組間空一行。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int k, e, kase = 0;
    while (cin >> k >> e) {
        cin.ignore();
        set<string> key;
        for (int i = 0; i < k; i++) { string s; getline(cin, s); key.insert(s); }
        vector<string> ex(e); vector<int> cnt(e, 0);
        for (int i = 0; i < e; i++) {
            getline(cin, ex[i]);
            string w;
            for (char c : ex[i] + " ") {
                if (isalpha((unsigned char)c)) w += tolower(c);
                else { if (key.count(w)) cnt[i]++; w.clear(); }   // 整個單字比對
            }
        }
        int mx = *max_element(cnt.begin(), cnt.end());
        if (kase) cout << "\\n";
        cout << "Excuse Set #" << ++kase << "\\n";
        for (int i = 0; i < e; i++) if (cnt[i] == mx) cout << ex[i] << "\\n";
    }
}`
},
151: {
  q: "約瑟夫問題變形：N 個地區排成圓圈，從 1 號開始，每次數 m 個關掉一個。<br>求<b>最小的 m</b>，使得<b>13 號地區是最後一個被關掉的</b>。",
  h: "N ≤ 100，直接<b>從 m = 1 往上試</b>，每個 m 用一次約瑟夫模擬（用 vector 或 list 刪除），檢查最後剩下的是不是 13 號。",
  t: "起點是 1 號、<b>第一個被關掉的就是從 1 開始數 m 個</b>。編號是 1-based。用 vector 加取模索引最好寫，刪除後索引不要多加。",
  c: `#include <bits/stdc++.h>
using namespace std;

// 用步長 m 做約瑟夫，回傳最後剩下的編號
int last(int n, int m) {
    vector<int> v(n);
    iota(v.begin(), v.end(), 1);
    int pos = 0;
    while (v.size() > 1) {
        pos = (pos + m - 1) % v.size();
        v.erase(v.begin() + pos);           // 刪掉後 pos 已指向下一個
        if (pos == (int)v.size()) pos = 0;
    }
    return v[0];
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n && n) {
        int m = 1;
        while (last(n, m) != 13) m++;       // 從小往上找
        cout << m << "\\n";
    }
}`
},
514: {
  q: "車廂依 1..n 順序進站，車站是<b>一條死路（堆疊）</b>：可以把車廂推進去，也可以把最上面的推出去。<br>給一個目標出站順序，判斷能否達成。",
  h: "<b>堆疊模擬</b>：維護下一個要進站的車廂 <code>nxt</code>，掃過目標序列——若堆疊頂端就是要的，彈出；否則一直推入直到推出要的那個；推不出來就是 No。",
  t: "輸入是<b>多組區塊</b>：n 為 0 結束整個輸入，區塊內第一個數為 0 則結束該區塊並<b>空一行</b>。這個雙層結束條件最容易讀錯。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n && n) {
        int first;
        while (cin >> first && first) {
            vector<int> t(n);
            t[0] = first;
            for (int i = 1; i < n; i++) cin >> t[i];
            stack<int> st;
            int nxt = 1, i = 0;
            while (i < n) {
                if (!st.empty() && st.top() == t[i]) { st.pop(); i++; }
                else if (nxt <= n) st.push(nxt++);
                else break;                 // 推不出要的了
            }
            cout << (i == n ? "Yes" : "No") << "\\n";
        }
        cout << "\\n";                       // 每個區塊後空一行
    }
}`
},
294: {
  q: "給區間 [L, U]，找出<b>因數個數最多</b>的數；若有並列取<b>最小</b>的那個。輸出該數與它的因數個數。",
  h: "因數個數由<b>質因數分解</b>得到：<code>n = p₁^a₁ · p₂^a₂ …</code> 則因數個數為 <code>(a₁+1)(a₂+1)…</code>。<br>對區間內每個數做 O(√n) 分解即可（區間長度不大）。",
  t: "區間可能落在 10⁹ 附近，但<b>長度有限</b>，所以逐一分解是可行的——不要試圖篩整個 10⁹。並列時取<b>最小</b>，所以只在「嚴格大於」時才更新。",
  c: `#include <bits/stdc++.h>
using namespace std;

int numDiv(long long n) {
    int cnt = 1;
    for (long long p = 2; p * p <= n; p++) {
        int e = 0;
        while (n % p == 0) { n /= p; e++; }
        cnt *= e + 1;                       // (a+1) 相乘
    }
    if (n > 1) cnt *= 2;
    return cnt;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        long long L, U; cin >> L >> U;
        long long best = L; int bd = 0;
        for (long long n = L; n <= U; n++) {
            int d = numDiv(n);
            if (d > bd) { bd = d; best = n; }   // 嚴格大於才更新 → 並列取最小
        }
        cout << "Between " << L << " and " << U << ", " << best
             << " has a maximum of " << bd << " divisors.\\n";
    }
}`
},
696: {
  q: "在 m×n 的棋盤上放<b>最多</b>幾個騎士（knight），使得任兩個都<b>不互相攻擊</b>。",
  h: "騎士只攻擊<b>異色格</b>，所以把所有同色格放滿就不會互相攻擊——答案是 <code>⌈mn/2⌉</code>。<br>但 m 或 n 等於 1 時全部可放（<code>mn</code>）；等於 2 時是每 4 格一組的特殊排法：<code>4·⌈n/4⌉</code> 取上限後夾住。",
  t: "<b>m 或 n 為 1、2 是特例</b>，直接套 ⌈mn/2⌉ 會錯。1×n 全放；2×n 用 4 個一組的花樣。其餘才是 ⌈mn/2⌉。",
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll m, n;
    while (cin >> m >> n && (m || n)) {
        if (m > n) swap(m, n);
        ll ans;
        if (m == 1) ans = n;                          // 一列全放
        else if (m == 2) ans = 4 * ((n + 3) / 4) - 2 * ((4 - n % 4) % 4 >= 2 ? 1 : 0),
             ans = min(ans, 2 * n),                   // 2×n 的花樣
             ans = 4 * ((n / 4)) + 2 * min(2LL, n % 4);
        else ans = (m * n + 1) / 2;                   // 同色格全放
        cout << ans << " knights may be placed on a " << m
             << " row " << n << " column board.\\n";
    }
}`
},
11995: {
  q: "有一個容器支援兩種操作：<code>1 x</code> 放入 x、<code>2 x</code> 取出並宣稱取出的是 x。<br>依據這串操作與回傳值，判斷它是 <b>stack / queue / priority queue</b>，還是無法判斷（not sure）或不可能（impossible）。",
  h: "<b>同時模擬三種容器</b>，各維護一個「還可能是它」的布林旗標。每次取出時，若某容器是空的或頂端不等於宣稱值，就把該旗標關掉。<br>最後依剩下幾個可能輸出。",
  t: "<b>取出時容器可能是空的</b>，要先判 empty 再比較，否則未定義行為。三個都被排除是 impossible、剩一個就報那個、剩兩個以上是 not sure。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n) {
        stack<int> st; queue<int> q; priority_queue<int> pq;
        bool bs = true, bq = true, bp = true;
        for (int i = 0; i < n; i++) {
            int op, x; cin >> op >> x;
            if (op == 1) { st.push(x); q.push(x); pq.push(x); }
            else {
                if (st.empty() || st.top() != x) bs = false; else st.pop();
                if (q.empty()  || q.front() != x) bq = false; else q.pop();
                if (pq.empty() || pq.top() != x) bp = false; else pq.pop();
            }
        }
        int c = bs + bq + bp;
        if (c == 0) cout << "impossible\\n";
        else if (c > 1) cout << "not sure\\n";
        else cout << (bs ? "stack" : bq ? "queue" : "priority queue") << "\\n";
    }
}`
},
11957: {
  q: "n×n 西洋跳棋盤，只有一顆白棋 W，其餘 B 是黑棋（不動）。白棋每步<b>往上斜走一格</b>到空格，或<b>跳過相鄰的黑棋</b>落到它後面的空格。<br>求白棋走到<b>最上面一列</b>的<b>路徑數</b>（對 10<sup>9</sup>+7 取模）。",
  h: "<b>記憶化 DP</b>：<code>f(r,c)</code> = 從 (r,c) 走到第 0 列的路徑數。轉移是左上／右上兩個方向，各自嘗試「走一格」與「跳過黑棋兩格」。<code>r == 0</code> 時回傳 1。",
  t: "跳躍需要<b>中間那格是黑棋、落點是空格</b>兩個條件同時成立。答案要<b>取模</b>。記憶化陣列每組測資要重置。",
  c: `#include <bits/stdc++.h>
using namespace std;
const long long MOD = 1000000007;

int n;
vector<string> g;
vector<vector<long long>> memo;

long long f(int r, int c) {
    if (r == 0) return 1;
    long long &res = memo[r][c];
    if (res >= 0) return res;
    res = 0;
    for (int d = -1; d <= 1; d += 2) {
        int nr = r - 1, nc = c + d;
        if (nc < 0 || nc >= n) continue;
        if (g[nr][nc] == '.') res = (res + f(nr, nc)) % MOD;          // 走一格
        else if (g[nr][nc] == 'B') {                                   // 跳過黑棋
            int jr = r - 2, jc = c + 2 * d;
            if (jr >= 0 && jc >= 0 && jc < n && g[jr][jc] == '.')
                res = (res + f(jr, jc)) % MOD;
        }
    }
    return res;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int k = 1; k <= T; k++) {
        cin >> n; g.assign(n, "");
        for (auto &r : g) cin >> r;
        memo.assign(n, vector<long long>(n, -1));
        int sr = 0, sc = 0;
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) if (g[i][j] == 'W') { sr = i; sc = j; }
        cout << "Case " << k << ": " << f(sr, sc) << "\\n";
    }
}`
},
10533: {
  q: "<b>Digit Prime</b> 是「本身是質數，且各位數字之和也是質數」的數。<br>給區間 [a, b]（上限 10<sup>6</sup>），問區間內有幾個 Digit Prime。查詢多達 50 萬筆。",
  h: "先<b>篩出 10⁶ 內的質數</b>，對每個質數檢查數字和是否也是質數，做成布林陣列後再算<b>前綴和</b>。之後每筆查詢 O(1)。",
  t: "查詢有 50 萬筆，<b>沒有前綴和一定 TLE</b>。數字和最大只有 54，判斷質數用小表即可。",
  c: `#include <bits/stdc++.h>
using namespace std;
const int N = 1000001;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    vector<bool> notp(N, false);
    for (int i = 2; (long long)i * i < N; i++)
        if (!notp[i]) for (int j = i * i; j < N; j += i) notp[j] = true;
    auto small = [&](int x) {
        if (x < 2) return false;
        for (int i = 2; i * i <= x; i++) if (x % i == 0) return false;
        return true;
    };
    vector<int> pre(N, 0);
    for (int i = 2; i < N; i++) {
        int s = 0;
        for (int t = i; t; t /= 10) s += t % 10;
        pre[i] = pre[i-1] + ((!notp[i] && small(s)) ? 1 : 0);
    }
    pre[1] = 0; pre[0] = 0;
    int T; cin >> T;
    while (T--) { int a, b; cin >> a >> b; cout << pre[b] - pre[a-1] << "\\n"; }
}`
},
10267: {
  q: "簡易繪圖編輯器模擬。指令包含：<code>I m n</code> 建立畫布、<code>C</code> 清空、<code>L x y c</code> 畫點、<code>V x y1 y2 c</code> 畫直線、<code>H x1 x2 y c</code> 畫橫線、<code>K x1 y1 x2 y2 c</code> 畫矩形、<code>F x y c</code> 填充、<code>S name</code> 輸出、<code>X</code> 結束。",
  h: "二維字元陣列直接模擬。<code>F</code>（填充）用 <b>BFS/DFS flood fill</b>，把與起點同色的連通區域全部換色。",
  t: "座標是 <b>x 為欄、y 為列</b>且 <b>1-based</b>——這個順序最容易搞反。線段的兩端點<b>可能給反</b>（y1 &gt; y2），要先 swap。填充時若新舊顏色相同要直接返回，否則無窮遞迴。未知指令要忽略。",
  c: `#include <bits/stdc++.h>
using namespace std;

int M, N;
vector<string> img;

void fill(int x, int y, char oc, char nc) {
    if (x < 1 || x > M || y < 1 || y > N) return;
    if (img[y-1][x-1] != oc) return;
    img[y-1][x-1] = nc;
    fill(x+1, y, oc, nc); fill(x-1, y, oc, nc);
    fill(x, y+1, oc, nc); fill(x, y-1, oc, nc);
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string op;
    while (cin >> op && op != "X") {
        if (op == "I") { cin >> M >> N; img.assign(N, string(M, 'O')); }
        else if (op == "C") img.assign(N, string(M, 'O'));
        else if (op == "L") { int x, y; char c; cin >> x >> y >> c; img[y-1][x-1] = c; }
        else if (op == "V") {
            int x, y1, y2; char c; cin >> x >> y1 >> y2 >> c;
            if (y1 > y2) swap(y1, y2);                    // 端點可能給反
            for (int y = y1; y <= y2; y++) img[y-1][x-1] = c;
        } else if (op == "H") {
            int x1, x2, y; char c; cin >> x1 >> x2 >> y >> c;
            if (x1 > x2) swap(x1, x2);
            for (int x = x1; x <= x2; x++) img[y-1][x-1] = c;
        } else if (op == "K") {
            int x1, y1, x2, y2; char c; cin >> x1 >> y1 >> x2 >> y2 >> c;
            if (x1 > x2) swap(x1, x2); if (y1 > y2) swap(y1, y2);
            for (int y = y1; y <= y2; y++)
                for (int x = x1; x <= x2; x++) img[y-1][x-1] = c;
        } else if (op == "F") {
            int x, y; char c; cin >> x >> y >> c;
            char oc = img[y-1][x-1];
            if (oc != c) fill(x, y, oc, c);               // 同色直接跳過
        } else if (op == "S") {
            string name; cin >> name;
            cout << name << "\\n";
            for (auto &r : img) cout << r << "\\n";
        } else getline(cin, op);                          // 未知指令：吃掉整行
    }
}`
},
674: {
  q: "用 1、5、10、25、50 分的硬幣湊出金額 n，問有幾種<b>組合</b>（不計順序）。n ≤ 7489。",
  h: "<b>完全背包計數</b>：<code>ways[0] = 1</code>，<b>外層跑硬幣、內層跑金額且正序</b>。可預先算好整張表再逐筆查詢。",
  t: "兩層迴圈<b>對調就變成排列數</b>，答案會大到離譜——這是計數 DP 最經典的坑。答案可能超過 int，用 long long。",
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const int N = 7490;
    vector<ll> ways(N, 0);
    ways[0] = 1;
    int coin[5] = {1, 5, 10, 25, 50};
    for (int c : coin)                       // 外層硬幣
        for (int i = c; i < N; i++)          // 內層正序
            ways[i] += ways[i - c];
    int n;
    while (cin >> n) cout << ways[n] << "\\n";
}`
},
615: {
  q: "給一串有向邊，判斷它們是否構成一棵<b>樹</b>。樹的條件：恰有一個根（入度 0）、其餘每個節點入度恰為 1、且<b>連通無環</b>。<b>空圖也算樹</b>。",
  h: "用<b>並查集</b>：加邊時若兩端已同組代表成環 → 不是樹。同時統計每個節點的<b>入度</b>，超過 1 → 不是樹。最後檢查連通塊數是否為 1。",
  t: "<b>空的輸入（直接兩個 0）算是樹</b>，這是最多人漏掉的。節點編號不連續，要用 set 記錄出現過的節點。<code>-1 -1</code> 結束整個輸入。",
  c: `#include <bits/stdc++.h>
using namespace std;

int p[100005];
int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int a, b, kase = 0;
    while (cin >> a >> b && !(a < 0 && b < 0)) {
        set<int> node; map<int,int> indeg;
        bool ok = true;
        for (int i = 0; i < 100005; i++) p[i] = i;
        while (!(a == 0 && b == 0)) {
            node.insert(a); node.insert(b);
            if (++indeg[b] > 1) ok = false;              // 入度超過 1
            if (find(a) == find(b)) ok = false;          // 成環
            else p[find(a)] = find(b);
            cin >> a >> b;
        }
        if (ok) {                                        // 檢查是否單一連通塊
            int roots = 0;
            for (int x : node) if (find(x) == x) roots++;
            if (!node.empty() && roots != 1) ok = false;
        }
        cout << "Case " << ++kase << " is " << (ok ? "" : "not ") << "a tree.\\n";
    }
}`
},
11039: {
  q: "蓋大樓：每層樓有一個<b>尺寸</b>與<b>顏色</b>（用整數的正負號表示）。<br>規則是<b>下層必須比上層大</b>，而且<b>相鄰兩層顏色必須不同</b>。求最多能蓋幾層。",
  h: "把所有樓層依<b>尺寸絕對值排序</b>，然後貪心地從小到大掃：只要當前這層的顏色與上一個選中的不同就選它。<br>因為尺寸已排序，「下層比上層大」自動成立，剩下只需滿足顏色交替。",
  t: "排序的鍵是<b>絕對值</b>（顏色藏在正負號裡）。相同絕對值也不影響——貪心只在顏色不同時才接受。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<int> a(n);
        for (int &x : a) cin >> x;
        sort(a.begin(), a.end(), [](int x, int y) { return abs(x) < abs(y); });
        int cnt = 0, prev = 0;                     // prev: 上一層的正負號
        for (int x : a) {
            int s = x > 0 ? 1 : -1;
            if (s != prev) { cnt++; prev = s; }    // 顏色不同才疊上去
        }
        cout << cnt << "\\n";
    }
}`
},
10666: {
  q: "杯賽有 N 輪、共 2<sup>N</sup> 支隊伍。給你的隊伍編號 P，求它<b>最樂觀</b>與<b>最悲觀</b>的名次。",
  h: "從最低位往上看 P 的二進位。<b>最樂觀</b>：一路贏到不能贏為止——連續的低位相同 bit 決定能晉級幾輪。<b>最悲觀</b>：第一輪就輸，名次是該輪淘汰組的最後一名。<br>實作上是數 P 末尾連續相同 bit 的長度。",
  t: "隊伍編號可能<b>從 0 或 1 開始</b>，先確認再套公式。N 可到 31，<code>2^N</code> 要用 long long。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        ll n, p; cin >> n >> p;
        // 末尾連續相同 bit 的長度 → 能晉級的輪數
        ll k = 0, x = p;
        while (k < n && ((x >> k) & 1) == (x & 1)) k++;
        ll best = (1LL << (n - k)) / 2 + 1;
        ll worst = (1LL << n) - (1LL << (n - k)) / 2;
        cout << best << " " << worst << "\\n";
    }
}`
},
141: {
  q: "Spot 遊戲：n×n 棋盤，兩人輪流放上或移除棋子。若某次操作後的盤面（<b>或它旋轉 90/180/270 度後的樣子</b>）與之前出現過的盤面相同，該玩家<b>輸</b>。<br>輸出誰在第幾步獲勝，或平手。",
  h: "把盤面編碼成字串存進 <code>set</code>。每次操作後產生<b>四種旋轉</b>，只要任一在 set 裡就判負；否則把四種都存進去（或只存正規化後的最小者）。",
  t: "<b>四種旋轉都要比對</b>，只比原樣會漏判。輸家是<b>造成重複的那個人</b>，所以第 i 步（1-based）由玩家 <code>(i-1)%2 + 1</code> 操作。走完所有步驟沒重複就是 Draw，但<b>剩下的輸入仍要讀完</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int n;
string rot(const string& s) {               // 順時針旋轉 90 度
    string r(n * n, ' ');
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++)
            r[j * n + (n - 1 - i)] = s[i * n + j];
    return r;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    while (cin >> n && n) {
        int m; cin >> m;
        string b(n * n, '.');
        set<string> seen;
        seen.insert(b);
        int win = 0, step = 0;
        for (int i = 1; i <= m; i++) {
            int x, y; char op; cin >> x >> y >> op;
            if (!win) {
                b[(x - 1) * n + (y - 1)] = (op == '+') ? 'X' : '.';
                string t = b; bool dup = false;
                for (int r = 0; r < 4; r++) { if (seen.count(t)) dup = true; t = rot(t); }
                if (dup) { win = (i - 1) % 2 + 1; step = i; }
                else { t = b; for (int r = 0; r < 4; r++) { seen.insert(t); t = rot(t); } }
            }
        }
        if (win) cout << "Player " << win << " wins on move " << step << "\\n";
        else cout << "Draw\\n";
    }
}`
},
967: {
  q: "<b>循環質數</b>：把最高位的數字依序搬到最右邊，過程中產生的每個數都必須是質數。例如 19937 → 99371 → 93719 → 37199 → 71993 全是質數。<br>給區間，數出其中有幾個循環質數。",
  h: "先篩出 10⁶ 內的質數。對每個質數做<b>所有輪轉</b>並檢查是否都是質數，把結果做成布林陣列後算<b>前綴和</b>供查詢。",
  t: "含有數字 <b>0</b> 的數輪轉後會出現前導零，通常直接判為非循環質數。輸出有<b>單複數之分</b>（1 Circular Prime. / N Circular Primes. / No Circular Primes.）。<code>-1</code> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;
const int N = 1000000;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    vector<bool> notp(N, false);
    for (int i = 2; (long long)i * i < N; i++)
        if (!notp[i]) for (int j = i * i; j < N; j += i) notp[j] = true;
    vector<int> pre(N, 0);
    for (int i = 2; i < N; i++) {
        bool ok = !notp[i];
        if (ok) {
            string s = to_string(i);
            if (s.find('0') != string::npos) ok = false;      // 有 0 就排除
            for (size_t k = 1; k < s.size() && ok; k++) {
                string t = s.substr(k) + s.substr(0, k);
                if (notp[stoi(t)]) ok = false;
            }
        }
        pre[i] = pre[i-1] + (ok ? 1 : 0);
    }
    int a, b;
    while (cin >> a && a != -1) {
        cin >> b;
        int c = pre[b] - pre[a-1];
        if (c == 0) cout << "No Circular Primes.\\n";
        else if (c == 1) cout << "1 Circular Prime.\\n";
        else cout << c << " Circular Primes.\\n";
    }
}`
},
10010: {
  q: "在 m×n 的字母格中尋找單字，可沿<b>八個方向</b>直線延伸，<b>不分大小寫</b>。<br>對每個單字輸出它<b>第一個字母</b>所在的列與行（1-based）。",
  h: "全部轉小寫後，對每個格子當起點、每個方向試著逐字比對。找到就停。",
  t: "是<b>八方向</b>（含反向與對角）。輸出是<b>列 行</b>（row col）的順序。題目保證每個單字都找得到。測資之間有空行、輸出也要空一行。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    int dx[8] = {-1,-1,-1,0,0,1,1,1}, dy[8] = {-1,0,1,-1,1,-1,0,1};
    for (int t = 0; t < T; t++) {
        int m, n; cin >> m >> n;
        vector<string> g(m);
        for (auto &r : g) { cin >> r; for (char &c : r) c = tolower((unsigned char)c); }
        int k; cin >> k;
        if (t) cout << "\\n";
        while (k--) {
            string w; cin >> w;
            for (char &c : w) c = tolower((unsigned char)c);
            bool found = false;
            for (int i = 0; i < m && !found; i++)
                for (int j = 0; j < n && !found; j++)
                    for (int d = 0; d < 8 && !found; d++) {
                        size_t p = 0; int x = i, y = j;
                        while (p < w.size() && x >= 0 && x < m && y >= 0 && y < n
                               && g[x][y] == w[p]) { p++; x += dx[d]; y += dy[d]; }
                        if (p == w.size()) { cout << i + 1 << " " << j + 1 << "\\n"; found = true; }
                    }
        }
    }
}`
},
11960: {
  q: "給 n，找出<b>不超過 n</b> 且<b>因數個數最多</b>的數；並列時取<b>最小</b>。n 可到 10<sup>6</sup>，查詢多達 50000 筆。",
  h: "用<b>類似篩法</b>算出 1..10⁶ 每個數的因數個數（對每個 d，把它的所有倍數的計數加一，總共 O(n log n)）。<br>再掃一遍做<b>前綴最佳</b>：<code>best[i]</code> = 1..i 中因數最多者（並列取小）。查詢 O(1)。",
  t: "逐筆現算必 TLE，<b>一定要預處理前綴最佳</b>。並列取最小，所以前綴更新時用<b>嚴格大於</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;
const int N = 1000001;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    vector<int> d(N, 0);
    for (int i = 1; i < N; i++)
        for (int j = i; j < N; j += i) d[j]++;      // 篩法算因數個數
    vector<int> best(N);
    best[1] = 1;
    for (int i = 2; i < N; i++)
        best[i] = (d[i] > d[best[i-1]]) ? i : best[i-1];   // 嚴格大於 → 並列取小
    int T; cin >> T;
    while (T--) { int n; cin >> n; cout << best[n] << "\\n"; }
}`
},
12694: {
  q: "會議室排程：給若干活動的<b>起訖時間</b>，求最多能安排幾個<b>互不重疊</b>的活動。",
  h: "經典<b>區間排程貪心</b>：依<b>結束時間</b>由小到大排序，逐一挑選開始時間不早於目前結束時間的活動。",
  t: "排序鍵是<b>結束時間</b>不是開始時間——用開始時間排序會做錯。<code>0 0</code> 結束一組測資。相接（前一個結束時間等於後一個開始時間）算不重疊。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        vector<pair<int,int>> v;                    // {結束, 開始}
        int s, e;
        while (cin >> s >> e && (s || e)) v.push_back({e, s});
        sort(v.begin(), v.end());                   // 依結束時間
        int cnt = 0, cur = 0;
        for (auto &[en, st] : v)
            if (st >= cur) { cnt++; cur = en; }     // 相接也算不重疊
        cout << cnt << "\\n";
    }
}`
},
10407: {
  q: "給一串整數，求<b>最大的 d</b>，使得所有數除以 d 之後<b>餘數都相同</b>。",
  h: "若 a ≡ b (mod d) 則 <code>d | (a−b)</code>。所以答案是<b>所有相鄰差的絕對值的 GCD</b>。",
  t: "想通「同餘 → 整除差」是全部。要取<b>絕對值</b>（數字可能是負的）。每行以 0 結束、空行結束整個輸入。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    long long x;
    while (cin >> x && x) {
        vector<long long> v{x};
        while (cin >> x && x) v.push_back(x);
        long long g = 0;
        for (size_t i = 1; i < v.size(); i++)
            g = __gcd(g, llabs(v[i] - v[i-1]));     // 相鄰差的 GCD
        cout << g << "\\n";
    }
}`
},
815: {
  q: "一塊 m×n 的地，每格是 10×10 公尺、有各自的<b>高程</b>。給注入的水量（立方公尺），水會<b>先淹最低的格子</b>。<br>求最終<b>水位高度</b>與<b>被淹沒的面積百分比</b>。",
  h: "把所有高程<b>排序</b>，由低往高逐格加水：把水位抬到第 i+1 格的高度需要 <code>(h[i+1] − h[i]) × i × 100</code> 立方公尺。水不夠時就用剩餘水量均分到已淹的 i 格上。",
  t: "每格底面積是 <b>100 平方公尺</b>（10×10），不是 1。水可能<b>淹過最高點</b>，要處理迴圈走完的情況。百分比的分母是總格數。輸出固定兩位小數。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int m, n, kase = 0;
    cout << fixed << setprecision(2);
    while (cin >> m >> n && (m || n)) {
        int t = m * n;
        vector<double> h(t);
        for (auto &x : h) cin >> x;
        double water; cin >> water;
        sort(h.begin(), h.end());
        double level = h[0]; int cnt = 1;
        for (int i = 1; i < t; i++) {
            double need = (h[i] - h[i-1]) * i * 100;   // 抬到下一格高度所需
            if (water < need) break;
            water -= need; level = h[i]; cnt = i + 1;
        }
        level += water / (cnt * 100.0);                 // 剩餘水量均分
        cout << "Region " << ++kase << "\\n";
        cout << "Water level is " << level << " meters.\\n";
        cout << 100.0 * cnt / t << " percent of the region is under water.\\n";
    }
}`
},
10026: {
  q: "鞋匠有 n 件工作，第 i 件需要 <code>T[i]</code> 天完成；每<b>延遲一天開工</b>要罰 <code>S[i]</code> 分。一天只能做一件。<br>求罰金最少的<b>工作順序</b>（並列時取字典序最小）。",
  h: "<b>交換論證</b>：比較相鄰兩件的先後，得出應依 <code>T[i] × S[j]</code> 與 <code>T[j] × S[i]</code> 排序——也就是按 <b>T/S 由小到大</b>。並列時按<b>編號</b>由小到大。",
  t: "用 <code>T[i]*S[j] &lt; T[j]*S[i]</code> 比較可<b>避開浮點誤差</b>，比直接比 T/S 安全。測資之間空一行。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int t = 0; t < T; t++) {
        int n; cin >> n;
        vector<array<long long,3>> v(n);            // {工期, 罰金, 編號}
        for (int i = 0; i < n; i++) { cin >> v[i][0] >> v[i][1]; v[i][2] = i + 1; }
        sort(v.begin(), v.end(), [](auto &a, auto &b) {
            long long l = a[0] * b[1], r = b[0] * a[1];   // 交換論證，整數比較
            if (l != r) return l < r;
            return a[2] < b[2];                            // 並列取編號小
        });
        if (t) cout << "\\n";
        for (int i = 0; i < n; i++) cout << v[i][2] << " \\n"[i == n-1];
    }
}`
},
11538: {
  q: "在 m×n 的棋盤上放<b>一黑一白兩個皇后</b>，問有幾種擺法使它們<b>互相攻擊</b>（同列、同行或同對角線）。兩個皇后<b>有分顏色</b>，所以順序不同算不同擺法。",
  h: "分三部分相加再乘 2（因為兩皇后可互換）：<br><b>同列</b>：<code>m·n·(n−1)</code>　<b>同行</b>：<code>n·m·(m−1)</code>　<b>對角線</b>：設 <code>a = min(m,n), b = max(m,n)</code>，兩個方向合計 <code>2·(2·Σ_{i=1}^{a-1} i(i+1) ... )</code>——用封閉式算出。",
  t: "m、n 可到 10<sup>6</sup>，<b>必須用公式不能枚舉</b>，且乘積會超過 long long 邊緣，注意運算順序。兩皇后<b>有序</b>，所以每種無序組合要算兩次。",
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll m, n;
    while (cin >> m >> n && (m || n)) {
        if (m > n) swap(m, n);
        ll row = n * m * (m - 1);                  // 同一列
        ll col = m * n * (n - 1);                  // 同一行
        // 對角線：長度 1..m-1 各出現兩次（兩個方向、兩側），長度 m 出現 (n-m+1)*2 次
        ll dia = 0;
        dia += 2 * 2 * (m - 1) * m * (2 * m - 1) / 6 - 2 * 2 * (m - 1) * m / 2;
        dia += 2 * (n - m + 1) * m * (m - 1);
        cout << row + col + dia << "\\n";
    }
}`
}
};

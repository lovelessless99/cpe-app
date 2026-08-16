/* 歷屆補完（第三批 22 題） */
const SOL10 = {
12532: {
  q: "給一個整數序列，支援兩種操作：<code>C i v</code> 把第 i 個元素改成 v；<code>P i j</code> 詢問區間 [i, j] 的<b>乘積是正、負還是零</b>。<br>對每個 P 輸出一個字元 <code>+</code> / <code>-</code> / <code>0</code>，全部串成一行。",
  h: "不必算乘積，<b>只要追蹤符號</b>。用兩棵樹狀陣列（或線段樹）：一棵記錄區間內<b>零的個數</b>，一棵記錄<b>負數的個數</b>。<br>區間有零 → <code>0</code>；否則看負數個數的<b>奇偶</b>。",
  t: "直接乘會溢位到天邊——<b>把問題化簡成「數零與數負」</b>是全部。修改時要先扣掉舊值的貢獻再加新值。",
  c: `#include <bits/stdc++.h>
using namespace std;

int n, q;
vector<int> tz, tn;                         // 零的個數 / 負數的個數

void upd(vector<int>& t, int i, int v) { for (++i; i <= n; i += i & -i) t[i] += v; }
int qry(vector<int>& t, int i) { int s = 0; for (++i; i > 0; i -= i & -i) s += t[i]; return s; }
int rng(vector<int>& t, int l, int r) { return qry(t, r) - (l ? qry(t, l - 1) : 0); }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    while (cin >> n >> q) {
        vector<int> a(n);
        tz.assign(n + 2, 0); tn.assign(n + 2, 0);
        for (int i = 0; i < n; i++) {
            cin >> a[i];
            if (a[i] == 0) upd(tz, i, 1);
            else if (a[i] < 0) upd(tn, i, 1);
        }
        string res;
        while (q--) {
            char op; cin >> op;
            if (op == 'C') {
                int i, v; cin >> i >> v; i--;
                if (a[i] == 0) upd(tz, i, -1); else if (a[i] < 0) upd(tn, i, -1);
                a[i] = v;
                if (v == 0) upd(tz, i, 1); else if (v < 0) upd(tn, i, 1);
            } else {
                int l, r; cin >> l >> r; l--; r--;
                if (rng(tz, l, r) > 0) res += '0';
                else res += (rng(tn, l, r) % 2) ? '-' : '+';   // 看負數個數奇偶
            }
        }
        cout << res << "\\n";
    }
}`
},
11344: {
  q: "給一個<b>大整數</b> N（可能上百位）與一組數字 <code>a₁…aₖ</code>。<br>若 N 能被<b>每一個</b> aᵢ 整除，輸出 <code>N - Wonderful.</code>，否則 <code>N - Simple.</code>",
  h: "N 太大存不進整數，用<b>字串逐位取模</b>：<code>r = (r*10 + digit) % a</code>。對每個 a 各算一次即可。",
  t: "N 可能是<b>負數</b>（開頭有減號），取模前要跳過符號。所有 a 都要整除才算 Wonderful，一個不過就結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

int modOf(const string& s, int m) {
    long long r = 0;
    for (char c : s) {
        if (!isdigit((unsigned char)c)) continue;    // 跳過負號
        r = (r * 10 + (c - '0')) % m;
    }
    return (int)r;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        string n; cin >> n;
        int k; cin >> k;
        bool ok = true;
        while (k--) { int a; cin >> a; if (modOf(n, a) != 0) ok = false; }
        cout << n << (ok ? " - Wonderful.\\n" : " - Simple.\\n");
    }
}`
},
10025: {
  q: "在 <code>?1?2?3…?n</code> 的每個 <code>?</code> 填入 <code>+</code> 或 <code>−</code>，使結果等於 k。<br>求<b>最小的 n</b>。",
  h: "取 <code>k</code> 的絕對值（正負對稱）。先找最小的 n 使 <code>1+2+…+n ≥ |k|</code>，再檢查 <code>S − |k|</code> 是否為<b>偶數</b>——把某個數從 + 改成 − 會讓總和減少 2 倍，所以差值必須是偶數。不是就 n 加一再試。",
  t: "<b>k = 0 時答案是 0</b>。差值必為偶數這件事是關鍵，否則會誤以為要搜尋。<code>|k|</code> 可到 10⁹，n 大約 45000，迴圈很快。測資之間空行。",
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int t = 0; t < T; t++) {
        ll k; cin >> k;
        k = llabs(k);
        ll n = 0, s = 0;
        while (s < k || (s - k) % 2 != 0) { n++; s += n; }   // 差值必為偶數
        if (t) cout << "\\n";
        cout << n << "\\n";
    }
}`
},
540: {
  q: "<b>Team Queue</b>（團隊佇列）：每個元素屬於某個隊伍。入列時，若佇列中<b>已有同隊成員</b>，就插到<b>該隊最後一人之後</b>；否則排到整個佇列最後面。出列則從最前面取。<br>模擬 ENQUEUE / DEQUEUE / STOP 指令。",
  h: "用<b>兩層佇列</b>：一個「隊伍佇列」記錄各隊在整體中的先後，另有每隊一個「成員佇列」。<br>入列時若該隊成員佇列是空的，就把隊伍推進隊伍佇列；出列時取隊伍佇列最前面那隊的第一個成員，該隊空了就把隊伍彈出。",
  t: "用 <code>map</code> 或陣列做「元素 → 隊伍編號」的對照。<b>兩層結構</b>是本題的核心巧思——用單一佇列做插入會是 O(n)。每組前有 <code>Scenario #k</code>，組後空一行。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int t, kase = 0;
    while (cin >> t && t) {
        unordered_map<int,int> team;
        for (int i = 0; i < t; i++) {
            int n; cin >> n;
            while (n--) { int x; cin >> x; team[x] = i; }
        }
        queue<int> tq;                       // 隊伍的先後
        vector<queue<int>> mq(t);            // 每隊的成員
        cout << "Scenario #" << ++kase << "\\n";
        string op;
        while (cin >> op && op != "STOP") {
            if (op == "ENQUEUE") {
                int x; cin >> x;
                int g = team[x];
                if (mq[g].empty()) tq.push(g);    // 該隊first次出現
                mq[g].push(x);
            } else {
                int g = tq.front();
                cout << mq[g].front() << "\\n";
                mq[g].pop();
                if (mq[g].empty()) tq.pop();      // 該隊清空就移除
            }
        }
        cout << "\\n";
    }
}`
},
1640: {
  q: "給區間 [a, b]，把區間內所有整數寫出來，<b>數每個數字 0–9 各出現幾次</b>。上限 10<sup>8</sup>。",
  h: "<b>數位計數</b>：定義 <code>f(n, d)</code> = 1..n 之間數字 d 出現的次數，逐位用公式算（考慮高位、當前位、低位三段）。答案是 <code>f(b,d) − f(a−1,d)</code>。",
  t: "a 可能<b>大於</b> b，要先 swap。數字 <b>0</b> 的計算與其他數字不同（不能有前導零），公式要分開處理。上限 10⁸ 不能逐一枚舉。",
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

// 1..n 之間數字 d 出現的次數
ll f(ll n, int d) {
    if (n < 0) return 0;
    ll cnt = 0;
    for (ll p = 1; p <= n; p *= 10) {
        ll high = n / (p * 10), cur = (n / p) % 10, low = n % p;
        if (d == 0) {
            if (high > 0) cnt += (high - 1) * p + (cur > 0 ? p : low + 1);
        } else {
            cnt += high * p;
            if (cur > d) cnt += p;
            else if (cur == d) cnt += low + 1;
        }
        if (p > n / 10) break;
    }
    return cnt;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll a, b;
    while (cin >> a >> b && (a || b)) {
        if (a > b) swap(a, b);                      // 可能給反
        for (int d = 0; d < 10; d++)
            cout << f(b, d) - f(a - 1, d) << " \\n"[d == 9];
    }
}`
},
108: {
  q: "給 N×N 的整數矩陣（元素可為負），求<b>和最大的子矩陣</b>之和。",
  h: "枚舉<b>上下邊界</b>（r1, r2），用<b>欄前綴和</b> O(1) 取得每欄在這兩列之間的和，把二維壓成一維後跑 <b>Kadane</b>。整體 O(N³)。",
  t: "元素<b>可能全為負</b>，Kadane 的初值不能設 0，要設成極小值。N ≤ 100，O(N³) = 一百萬，很快。輸入的數字<b>可跨行任意排列</b>，直接連續 <code>cin >></code> 即可。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n) {
        vector<vector<int>> pre(n + 1, vector<int>(n, 0));
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) {
                int x; cin >> x;
                pre[i+1][j] = pre[i][j] + x;        // 欄前綴和
            }
        int best = INT_MIN;
        for (int r1 = 0; r1 < n; r1++)
            for (int r2 = r1 + 1; r2 <= n; r2++) {
                int cur = INT_MIN;                   // 全負也要正確
                for (int j = 0; j < n; j++) {
                    int v = pre[r2][j] - pre[r1][j];
                    cur = max(v, cur + v);           // Kadane
                    best = max(best, cur);
                }
            }
        cout << best << "\\n";
    }
}`
},
516: {
  q: "質數基底表示法：把整數寫成 <code>p₁ e₁ p₂ e₂ …</code>（質數與指數交替，<b>質數由大到小</b>）。<br>給某數 x 的表示法，求 <b>x − 1</b> 的表示法。",
  h: "先把輸入還原成整數 x（≤ 32767），減一後做<b>質因數分解</b>，再<b>由大到小</b>輸出質數與指數。",
  t: "輸出順序是<b>質數由大到小</b>，跟一般分解的順序相反。輸入以 <code>0</code> 結束。x ≤ 32767，直接試除即可。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string line;
    while (getline(cin, line)) {
        stringstream ss(line);
        long long p, e, x = 1;
        if (!(ss >> p) || p == 0) break;
        do { ss >> e; while (e--) x *= p; } while (ss >> p);
        x--;
        vector<pair<long long,int>> f;
        for (long long d = 2; d * d <= x; d++) {
            int c = 0;
            while (x % d == 0) { x /= d; c++; }
            if (c) f.push_back({d, c});
        }
        if (x > 1) f.push_back({x, 1});
        for (int i = f.size() - 1; i >= 0; i--)      // 由大到小
            cout << f[i].first << " " << f[i].second << " \\n"[i == 0];
    }
}`
},
10074: {
  q: "給 M×N 的 0/1 矩陣（1 代表有樹），求<b>不含任何樹</b>的<b>最大矩形面積</b>。",
  h: "對每一列維護「<b>該欄往上連續有幾個 0</b>」的高度陣列，然後對每列用<b>單調棧</b>求柱狀圖中的最大矩形。整體 O(MN)。",
  t: "遇到 1 時高度要<b>歸零</b>不是減一。單調棧求最大矩形時，記得在尾端補一個高度 0 的哨兵把棧清空。",
  c: `#include <bits/stdc++.h>
using namespace std;

int largest(vector<int> h) {
    h.push_back(0);                          // 哨兵，清空棧
    stack<int> st;
    int best = 0;
    for (int i = 0; i < (int)h.size(); i++) {
        while (!st.empty() && h[st.top()] >= h[i]) {
            int ht = h[st.top()]; st.pop();
            int left = st.empty() ? -1 : st.top();
            best = max(best, ht * (i - left - 1));
        }
        st.push(i);
    }
    return best;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int m, n;
    while (cin >> m >> n && (m || n)) {
        vector<int> h(n, 0);
        int best = 0;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                int x; cin >> x;
                h[j] = x ? 0 : h[j] + 1;     // 有樹就歸零
            }
            best = max(best, largest(h));
        }
        cout << best << "\\n";
    }
}`
},
532: {
  q: "<b>3D 迷宮</b>：L 層、R 列、C 欄，每格是空地 <code>.</code>、岩石 <code>#</code>、起點 <code>S</code> 或出口 <code>E</code>。<br>每分鐘可往<b>六個方向</b>（東西南北上下）移動一格，求逃出的最短時間。",
  h: "<b>三維 BFS</b>：方向陣列開成六個方向，距離陣列開三維。其餘與平面 BFS 完全相同。",
  t: "是<b>六方向</b>不是四方向——上下也能走。<b>不能斜走</b>。到不了出口要輸出 <code>Trapped!</code>。三個 0 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int L, R, C;
    int dz[6] = {1,-1,0,0,0,0}, dx[6] = {0,0,1,-1,0,0}, dy[6] = {0,0,0,0,1,-1};
    while (cin >> L >> R >> C && (L || R || C)) {
        vector<vector<string>> g(L, vector<string>(R));
        int sz=0, sx=0, sy=0, ez=0, ex=0, ey=0;
        for (int z = 0; z < L; z++)
            for (int x = 0; x < R; x++) {
                cin >> g[z][x];
                for (int y = 0; y < C; y++) {
                    if (g[z][x][y] == 'S') { sz=z; sx=x; sy=y; }
                    if (g[z][x][y] == 'E') { ez=z; ex=x; ey=y; }
                }
            }
        vector<vector<vector<int>>> d(L, vector<vector<int>>(R, vector<int>(C, -1)));
        queue<array<int,3>> q;
        q.push({sz, sx, sy}); d[sz][sx][sy] = 0;
        while (!q.empty()) {
            auto [z, x, y] = q.front(); q.pop();
            for (int k = 0; k < 6; k++) {            // 六方向
                int nz = z+dz[k], nx = x+dx[k], ny = y+dy[k];
                if (nz<0||nz>=L||nx<0||nx>=R||ny<0||ny>=C) continue;
                if (g[nz][nx][ny] == '#' || d[nz][nx][ny] != -1) continue;
                d[nz][nx][ny] = d[z][x][y] + 1;
                q.push({nz, nx, ny});
            }
        }
        if (d[ez][ex][ey] < 0) cout << "Trapped!\\n";
        else cout << "Escaped in " << d[ez][ex][ey] << " minute(s).\\n";
    }
}`
},
10004: {
  q: "判斷一張無向圖是否為<b>二分圖</b>（能否用兩種顏色著色，使相鄰節點顏色不同）。",
  h: "<b>BFS 塗色</b>：從節點 0 出發，相鄰節點塗相反色；若發現相鄰節點同色就不是二分圖。",
  t: "題目保證連通，所以從 0 出發一次就夠。<b>可能有自環或重邊</b>，自環直接判否。輸出句型含句點。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n && n) {
        int m; cin >> m;
        vector<vector<int>> g(n);
        for (int i = 0; i < m; i++) {
            int a, b; cin >> a >> b;
            g[a].push_back(b); g[b].push_back(a);
        }
        vector<int> col(n, -1);
        col[0] = 0;
        queue<int> q; q.push(0);
        bool ok = true;
        while (!q.empty() && ok) {
            int u = q.front(); q.pop();
            for (int v : g[u]) {
                if (col[v] == -1) { col[v] = col[u] ^ 1; q.push(v); }
                else if (col[v] == col[u]) { ok = false; break; }   // 相鄰同色
            }
        }
        cout << (ok ? "BICOLORABLE." : "NOT BICOLORABLE.") << "\\n";
    }
}`
},
11584: {
  q: "把一個字串切成<b>最少</b>幾段，使<b>每一段都是回文</b>。",
  h: "先用 <b>O(n²) DP 預處理</b>所有 <code>isPal[i][j]</code>。再做一維 DP：<code>dp[i] = min(dp[j] + 1)</code>，其中 <code>s[j..i-1]</code> 是回文。",
  t: "字串長度可到 1000，<b>回文判斷必須先預處理</b>，每次現算會是 O(n³)。<code>dp[0] = 0</code> 為邊界。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        string s; cin >> s;
        int n = s.size();
        vector<vector<bool>> pal(n, vector<bool>(n, false));
        for (int i = n - 1; i >= 0; i--)
            for (int j = i; j < n; j++)
                pal[i][j] = (s[i] == s[j]) && (j - i < 2 || pal[i+1][j-1]);
        vector<int> dp(n + 1, INT_MAX);
        dp[0] = 0;
        for (int i = 1; i <= n; i++)
            for (int j = 0; j < i; j++)
                if (pal[j][i-1] && dp[j] != INT_MAX)
                    dp[i] = min(dp[i], dp[j] + 1);
        cout << dp[n] << "\\n";
    }
}`
},
748: {
  q: "計算 <code>R<sup>n</sup></code> 的<b>精確值</b>，其中 R 是最多 6 位的實數（含小數點）、n ≤ 25。<br>要求去掉<b>前導零與無意義的尾零</b>。",
  h: "把 R 的小數點去掉當成<b>大整數</b>，記下小數位數 d。算出整數的 n 次方（大數乘法），最後在結果中插入小數點於倒數第 <code>d×n</code> 位。",
  t: "結果可到 150 位以上，<b>必須自己寫大數乘法</b>。輸出要去掉<b>前導零</b>（<code>0.123</code> 印成 <code>.123</code>）與<b>尾零</b>。小數位數是 <code>d×n</code> 不是 d。",
  c: `#include <bits/stdc++.h>
using namespace std;

vector<int> mul(const vector<int>& a, const vector<int>& b) {
    vector<int> r(a.size() + b.size(), 0);
    for (size_t i = 0; i < a.size(); i++)
        for (size_t j = 0; j < b.size(); j++) r[i+j] += a[i] * b[j];
    int c = 0;
    for (size_t i = 0; i < r.size(); i++) { int v = r[i] + c; r[i] = v % 10; c = v / 10; }
    while (r.size() > 1 && r.back() == 0) r.pop_back();
    return r;
}

int main() {
    string s; int n;
    while (cin >> s >> n) {
        int dot = s.find('.');
        int dec = (dot == (int)string::npos) ? 0 : s.size() - dot - 1;
        string digits = s; if (dot != (int)string::npos) digits.erase(dot, 1);
        vector<int> base;
        for (int i = digits.size() - 1; i >= 0; i--) base.push_back(digits[i] - '0');
        vector<int> res{1};
        for (int i = 0; i < n; i++) res = mul(res, base);
        string out;
        for (int i = res.size() - 1; i >= 0; i--) out += char('0' + res[i]);
        int d = dec * n;                                  // 小數位數
        while ((int)out.size() <= d) out = "0" + out;
        out.insert(out.size() - d, ".");
        while (out.back() == '0') out.pop_back();         // 去尾零
        if (out.back() == '.') out.pop_back();
        size_t p = 0; while (p + 1 < out.size() && out[p] == '0' && out[p+1] != '.') p++;
        if (out[p] == '0' && p + 1 < out.size() && out[p+1] == '.') p++;   // 去前導零
        cout << out.substr(p) << "\\n";
    }
}`
},
1316: {
  q: "超市有一批商品，每個有<b>利潤</b> p 與<b>期限</b> d（必須在第 d 個時間單位<b>之前</b>賣出）。每個時間單位只能賣一件。<br>求最大總利潤。",
  h: "<b>貪心 + 小根堆</b>：把商品依期限排序，逐一放進堆（以利潤為鍵，小的在頂）。當堆的大小超過當前期限時，<b>丟掉利潤最小的</b>。最後堆內元素之和即答案。",
  t: "這是經典的「<b>帶期限的排程</b>」。用小根堆隨時丟掉最差的，比先排利潤再找空位簡潔得多。輸入是<b>一連串數字</b>，第一個是件數，之後成對。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n) {
        vector<pair<int,int>> v(n);          // {期限, 利潤}
        for (int i = 0; i < n; i++) { int p, d; cin >> p >> d; v[i] = {d, p}; }
        sort(v.begin(), v.end());
        priority_queue<int, vector<int>, greater<int>> pq;
        for (auto &[d, p] : v) {
            pq.push(p);
            if ((int)pq.size() > d) pq.pop();   // 超過期限就丟掉最小的
        }
        long long sum = 0;
        while (!pq.empty()) { sum += pq.top(); pq.pop(); }
        cout << sum << "\\n";
    }
}`
},
10066: {
  q: "兩座塔各由一疊圓形磚組成（給半徑序列）。要從兩塔各拆掉一些磚，使剩下的<b>兩疊完全相同</b>（順序不變）。<br>求能建成的<b>最高</b>雙塔的磚數。",
  h: "就是兩個序列的<b>最長共同子序列（LCS）</b>。標準二維 DP。",
  t: "認出「這是 LCS」是全部——題目描述繞了一大圈。N ≤ 100，O(nm) 很快。輸出含 <code>Twin Towers #k</code> 與固定句型，組間空一行。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m, kase = 0;
    while (cin >> n >> m && (n || m)) {
        vector<int> a(n), b(m);
        for (int &x : a) cin >> x;
        for (int &x : b) cin >> x;
        vector<vector<int>> dp(n + 1, vector<int>(m + 1, 0));
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= m; j++)
                dp[i][j] = (a[i-1] == b[j-1]) ? dp[i-1][j-1] + 1
                                              : max(dp[i-1][j], dp[i][j-1]);
        cout << "Twin Towers #" << ++kase << "\\n";
        cout << "Number of Tiles : " << dp[n][m] << "\\n\\n";
    }
}`
},
13257: {
  q: "給一個大寫字串 S（長度 ≤ 10），問有多少個<b>不同的三字母字串</b>是 S 的<b>子序列</b>。",
  h: "長度只有 10，直接<b>三層迴圈枚舉位置</b> i &lt; j &lt; k，把 <code>S[i]S[j]S[k]</code> 丟進 <code>set</code> 去重，最後取 size。",
  t: "是<b>子序列</b>不是子字串（不必連續）。要<b>去重</b>——相同的三字母組合只算一次，這是本題唯一的考點。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        string s; cin >> s;
        set<string> st;
        int n = s.size();
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                for (int k = j + 1; k < n; k++)
                    st.insert({s[i], s[j], s[k]});     // set 去重
        cout << st.size() << "\\n";
    }
}`
},
536: {
  q: "給二元樹的<b>前序</b>與<b>中序</b>走訪結果（節點是相異的大寫字母），還原這棵樹並輸出<b>後序</b>走訪。",
  h: "<b>遞迴</b>：前序的第一個字元是根，在中序中找到它的位置就把中序切成左右子樹，前序也依對應長度切開。左右各自遞迴，最後印根。",
  t: "切割時的<b>長度計算</b>最容易錯——左子樹在前序中的範圍是「根之後的 leftLen 個」。節點相異所以可直接用 <code>find</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;

void post(const string& pre, const string& in) {
    if (pre.empty()) return;
    char root = pre[0];
    int k = in.find(root);
    post(pre.substr(1, k), in.substr(0, k));            // 左子樹
    post(pre.substr(k + 1), in.substr(k + 1));          // 右子樹
    cout << root;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string pre, in;
    while (cin >> pre >> in) { post(pre, in); cout << "\\n"; }
}`
},
11067: {
  q: "小紅帽要從 (0,0) 走到外婆家 (m−1, n−1)，只能<b>往右或往下</b>。格子上的數字代表狼的位置或障礙——若某格有狼就不能走。<br>求不遇到狼的路徑數。",
  h: "<b>網格路徑 DP</b>：<code>dp[i][j] = dp[i-1][j] + dp[i][j-1]</code>，有狼的格子設為 0。",
  t: "起點或終點本身就有狼時答案是 0。路徑數可能很大，用 long long。輸出有三種句型（0 條 / 1 條 / N 條）要分開處理。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int m, n;
    while (cin >> m >> n && (m || n)) {
        vector<vector<int>> g(m, vector<int>(n));
        for (auto &r : g) for (int &x : r) cin >> x;
        vector<vector<ll>> dp(m, vector<ll>(n, 0));
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++) {
                if (g[i][j] == 0) { dp[i][j] = 0; continue; }   // 有狼不能走
                if (i == 0 && j == 0) { dp[i][j] = 1; continue; }
                if (i) dp[i][j] += dp[i-1][j];
                if (j) dp[i][j] += dp[i][j-1];
            }
        ll r = dp[m-1][n-1];
        if (r == 0) cout << "There is no path.\\n";
        else if (r == 1) cout << "There is 1 path from Little Red Riding Hood's house to her grandmother's house.\\n";
        else cout << "There are " << r << " paths from Little Red Riding Hood's house to her grandmother's house.\\n";
    }
}`
},
1730: {
  q: "對數字 N，<code>MSLCM(N)</code> 是「LCM 恰為 N 的那些數字集合中，元素和最大者」的那個和。<br>求 <code>Σ MSLCM(i)</code>，i 從 2 到 N。上限 2×10<sup>7</sup>。",
  h: "關鍵推導：使 LCM 為 N 且總和最大的集合，就是 <b>N 的所有「質數冪最大因數」</b>再加上 N 自己。<br>可用<b>類似篩法</b>：對每個質數 p 與其冪 p^k，把 p^k 加到所有 <code>p^k</code> 恰為該數之 p 部分的倍數上。",
  t: "N 到 2×10<sup>7</sup>，<b>必須用篩法一次算完所有 MSLCM 並做前綴和</b>，逐筆現算必 TLE。記憶體要小心，用 <code>vector&lt;long long&gt;</code> 會吃 160 MB，可能要改用 unsigned int。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;
const int N = 20000001;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    vector<unsigned> s(N, 1);                 // MSLCM 累加，初值 1（代表數字 1）
    for (int p = 2; p < N; p++)
        if (s[p] == 1) {                      // p 是質數
            for (long long q = p; q < N; q *= p)
                for (long long m = q; m < N; m += q)
                    if ((m / q) % p != 0) s[m] += q;   // q 是 m 的最大 p 次冪
                if (q > N / p) break;
        }
    vector<unsigned long long> pre(N, 0);
    for (int i = 2; i < N; i++) pre[i] = pre[i-1] + s[i];
    int n;
    while (cin >> n && n) cout << pre[n] << "\\n";
}`
},
337: {
  q: "終端機控制序列模擬：畫面固定大小，字元依序輸入。特殊控制碼（如 <code>^h</code> 左移、<code>^d</code> 下移、<code>^u</code> 上移、<code>^l</code> 左移、<code>^r</code> 右移、<code>^b</code> 換行、<code>^c</code> 清畫面等）會移動游標或改變畫面。<br>輸出最終畫面。",
  h: "維護游標座標與二維字元陣列，逐字元處理：遇到 <code>^</code> 就讀下一個字元當控制碼，否則直接寫入並右移游標。",
  t: "控制碼的定義要<b>逐一對照原文</b>，一個弄錯整題就錯。游標移動要<b>夾在畫面範圍內</b>（撞到邊界就停，不是繞回）。輸出有邊框。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T; cin.ignore();
    const int H = 10, W = 10;                 // 畫面大小依原題
    for (int t = 1; t <= T; t++) {
        vector<string> scr(H, string(W, ' '));
        int r = 0, c = 0;
        string line;
        while (getline(cin, line) && !line.empty()) {
            for (size_t i = 0; i < line.size(); i++) {
                if (line[i] != '^') { scr[r][c] = line[i]; if (c + 1 < W) c++; continue; }
                char op = line[++i];
                switch (op) {                  // 控制碼定義請對照原文
                    case 'l': if (c) c--; break;
                    case 'r': if (c + 1 < W) c++; break;
                    case 'u': if (r) r--; break;
                    case 'd': if (r + 1 < H) r++; break;
                    case 'h': c = 0; break;
                    case 'b': r = 0; c = 0; break;
                    case 'c': scr.assign(H, string(W, ' ')); r = c = 0; break;
                }
            }
        }
        cout << "Case " << t << "\\n";
        for (auto &x : scr) cout << "|" << x << "|\\n";
    }
}`
},
512: {
  q: "試算表追蹤：對表格做一連串操作（刪除列/欄 <code>DR</code>/<code>DC</code>、插入列/欄 <code>IR</code>/<code>IC</code>、交換兩格 <code>EX</code>），追蹤指定儲存格<b>最終跑到哪裡</b>，或報告它被刪掉了（GONE）。",
  h: "<b>不要真的搬動表格</b>，只追蹤查詢的那幾個座標。對每個操作更新座標：刪除時若在被刪的列就標為 GONE，否則減去前面被刪的數量；插入時加上前面插入的數量；交換時對調。",
  t: "刪除與插入的<b>多個索引要先排序</b>再處理，否則位移會算錯。<b>EX 是交換兩個特定儲存格</b>而不是整列。追蹤法比模擬整張表簡單得多。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int R, C, kase = 0;
    while (cin >> R >> C && (R || C)) {
        int n; cin >> n;
        vector<array<int,3>> ops;             // {類型, 參數…} 先全部存起來
        vector<vector<int>> args(n);
        vector<string> type(n);
        for (int i = 0; i < n; i++) {
            cin >> type[i];
            if (type[i] == "EX") { args[i].resize(4); for (int &x : args[i]) cin >> x; }
            else { int k; cin >> k; args[i].resize(k); for (int &x : args[i]) cin >> x; sort(args[i].begin(), args[i].end()); }
        }
        int q; cin >> q;
        cout << "Spreadsheet #" << ++kase << "\\n";
        while (q--) {
            int r, c; cin >> r >> c;
            int or_ = r, oc = c;
            bool gone = false;
            for (int i = 0; i < n && !gone; i++) {
                auto &a = args[i];
                if (type[i] == "EX") {
                    if (r == a[0] && c == a[1]) { r = a[2]; c = a[3]; }
                    else if (r == a[2] && c == a[3]) { r = a[0]; c = a[1]; }
                } else if (type[i] == "DR") {
                    int d = 0;
                    for (int x : a) { if (x == r) { gone = true; break; } if (x < r) d++; }
                    r -= d;
                } else if (type[i] == "DC") {
                    int d = 0;
                    for (int x : a) { if (x == c) { gone = true; break; } if (x < c) d++; }
                    c -= d;
                } else if (type[i] == "IR") {
                    int d = 0; for (int x : a) if (x <= r) d++;
                    r += d;
                } else {
                    int d = 0; for (int x : a) if (x <= c) d++;
                    c += d;
                }
            }
            if (gone) cout << "Cell data in (" << or_ << "," << oc << ") GONE\\n";
            else cout << "Cell data in (" << or_ << "," << oc << ") moved to ("
                      << r << "," << c << ")\\n";
        }
        cout << "\\n";
    }
}`
},
255: {
  q: "8×8 棋盤（格子編號 0–63）上有<b>王</b>與<b>后</b>，輪流移動。給「王位置、后位置、目標位置」，判斷這一步的合法性：<br><code>Illegal state</code>（兩子同格）、<code>Illegal move</code>（走法不合規則）、<code>Move not allowed</code>（走到被后攻擊的格）、<code>Stop</code>（吃掉后）、<code>Continue</code>（正常）。",
  h: "把編號轉成 (row, col)。王走法是<b>八方向各一格</b>。判斷順序：先檢查狀態合法 → 再檢查走法合法 → 再看是否吃后（Stop）→ 最後看目標格是否被后攻擊。",
  t: "<b>判斷順序決定答案</b>，順序錯就會輸出錯的訊息。后的攻擊要算<b>同列、同行、同對角線</b>，而且<b>王本身不擋路</b>（因為王要離開原位）。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int k, q, t;
    while (cin >> k >> q >> t) {
        int kr = k / 8, kc = k % 8, qr = q / 8, qc = q % 8, tr = t / 8, tc = t % 8;
        if (k == q) { cout << "Illegal state\\n"; continue; }
        if (abs(tr - kr) > 1 || abs(tc - kc) > 1 || t == k) { cout << "Illegal move\\n"; continue; }
        if (t == q) { cout << "Stop\\n"; continue; }              // 吃掉后
        bool attacked = (tr == qr) || (tc == qc) || (abs(tr - qr) == abs(tc - qc));
        cout << (attacked ? "Move not allowed\\n" : "Continue\\n");
    }
}`
},
10800: {
  q: "把股價走勢畫成 ASCII 圖。輸入是由 <code>R</code>（漲）、<code>F</code>（跌）、<code>C</code>（平）組成的字串。<br>用 <code>/</code>、<code>\\\\</code>、<code>_</code> 畫出折線，並附上 x 與 y 軸。",
  h: "先掃一遍算出每一步的高度變化與整體高度範圍，決定畫布大小。再逐步把對應字元放進二維字元陣列：R 用 <code>/</code> 且高度上升、F 用 <code>\\\\</code> 且高度下降、C 用 <code>_</code> 高度不變。最後補上 <code>|</code> 與 <code>+---</code> 的軸。",
  t: "<b>字元的垂直位置</b>要算對：<code>/</code> 佔的是上升後的那格、<code>\\\\</code> 佔的是下降前的那格。輸出的行尾<b>不要有多餘空白</b>。這題失分幾乎都在座標與空白。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int t = 1; t <= T; t++) {
        string s; cin >> s;
        int n = s.size(), y = 0, lo = 0, hi = 0;
        vector<int> pos(n);                    // 每步字元所在高度
        for (int i = 0; i < n; i++) {
            if (s[i] == 'R') { y++; pos[i] = y; }
            else if (s[i] == 'F') { pos[i] = y; y--; }
            else pos[i] = y;
            lo = min(lo, y); hi = max(hi, y);
        }
        int H = hi - lo + 1;
        vector<string> canvas(H, string(n, ' '));
        for (int i = 0; i < n; i++) {
            int row = hi - pos[i];
            canvas[row][i] = (s[i] == 'R') ? '/' : (s[i] == 'F') ? '\\\\' : '_';
        }
        cout << "Case #" << t << ":\\n";
        for (auto &r : canvas) {
            string line = "|" + r;
            while (!line.empty() && line.back() == ' ') line.pop_back();
            cout << line << "\\n";
        }
        cout << "+" << string(n, '-') << "\\n";
    }
}`
}
};

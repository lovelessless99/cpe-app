/* 二星題庫（第六批 12 題） */
const SOL23 = {
10194: {
  q: "Football 積分榜：給賽事名稱、隊伍名單與比賽結果（格式 <code>A隊#3@1#B隊</code>），輸出排名。勝 3 分、和 1 分、敗 0 分。排序依序看：<b>積分 → 勝場 → 淨勝球 → 進球數 → 場次少 → 隊名字典序（不分大小寫）</b>。",
  h: "邏輯不難，難在<b>解析與排序規則的精確度</b>，是典型的「大型模擬 + 自訂比較器」題。<br><b>解析</b>：隊名可含空白但<b>保證不含 <code>#</code> 與 <code>@</code></b>，所以用這兩個字元切分最安全：找第一個 <code>#</code>、中間的 <code>@</code>、以及最後一個 <code>#</code>。<br><b>排序</b>：把六條規則<b>照順序</b>寫進比較函式，一條一條 <code>if (a != b) return ...</code>；最後一條字典序要<b>轉小寫再比</b>。<br><b>輸出</b>：<code>k) 隊名 Xp, Yg (W-T-L), Zgd (F-A)</code>，欄位之間各一個空白。",
  t: "① <b>最後一條 tie-breaker 是「不分大小寫」的字典序</b>——直接用 <code>&lt;</code> 比字串會錯。<br>② 「場次少者優先」是<b>遞增</b>，其他都是遞減，容易寫反。<br>③ 隊名<b>可含空白</b>，一定要用 <code>#</code>/<code>@</code> 定位切分，不能用 <code>&gt;&gt;</code>。<br>④ 賽事名稱也是一整行（可含空白、數字、符號）。<br>⑤ 兩場賽事的輸出之間要<b>空一行</b>。<br>⑥ 可能有隊伍<b>一場都沒打</b>，各項統計都是 0，仍要列出。",
  c: `#include <bits/stdc++.h>
using namespace std;

struct Team {
    string name, lower_;
    int pts, w, t, l, gf, ga;
    Team() : pts(0), w(0), t(0), l(0), gf(0), ga(0) {}
    int games() const { return w + t + l; }
    int gd() const { return gf - ga; }
};

bool cmp(const Team &a, const Team &b) {
    if (a.pts != b.pts) return a.pts > b.pts;              // 1. 積分多
    if (a.w != b.w) return a.w > b.w;                      // 2. 勝場多
    if (a.gd() != b.gd()) return a.gd() > b.gd();          // 3. 淨勝球多
    if (a.gf != b.gf) return a.gf > b.gf;                  // 4. 進球多
    if (a.games() != b.games()) return a.games() < b.games();   // 5. 場次少
    return a.lower_ < b.lower_;                            // 6. 不分大小寫字典序
}

int main() {
    int N; cin >> N; cin.ignore();
    for (int tc = 0; tc < N; tc++) {
        string title; getline(cin, title);
        int T; cin >> T; cin.ignore();
        vector<Team> v(T);
        map<string, int> id;
        for (int i = 0; i < T; i++) {
            getline(cin, v[i].name);
            v[i].lower_ = v[i].name;
            for (size_t j = 0; j < v[i].lower_.size(); j++)
                v[i].lower_[j] = tolower((unsigned char)v[i].lower_[j]);
            id[v[i].name] = i;
        }
        int G; cin >> G; cin.ignore();
        for (int i = 0; i < G; i++) {
            string line; getline(cin, line);
            size_t p1 = line.find('#');
            size_t pa = line.find('@', p1);
            size_t p2 = line.find('#', pa);
            string na = line.substr(0, p1);
            int ga_ = atoi(line.substr(p1 + 1, pa - p1 - 1).c_str());
            int gb_ = atoi(line.substr(pa + 1, p2 - pa - 1).c_str());
            string nb = line.substr(p2 + 1);
            int A = id[na], B = id[nb];
            v[A].gf += ga_; v[A].ga += gb_;
            v[B].gf += gb_; v[B].ga += ga_;
            if (ga_ > gb_) { v[A].w++; v[A].pts += 3; v[B].l++; }
            else if (ga_ < gb_) { v[B].w++; v[B].pts += 3; v[A].l++; }
            else { v[A].t++; v[B].t++; v[A].pts++; v[B].pts++; }
        }
        sort(v.begin(), v.end(), cmp);

        if (tc) cout << "\\n";
        cout << title << "\\n";
        for (int i = 0; i < T; i++)
            cout << i + 1 << ") " << v[i].name << " " << v[i].pts << "p, "
                 << v[i].games() << "g (" << v[i].w << "-" << v[i].t << "-" << v[i].l
                 << "), " << v[i].gd() << "gd (" << v[i].gf << "-" << v[i].ga << ")\\n";
    }
    return 0;
}`
},

10494: {
  q: "If We Were a Child Again：計算「<b>大數 ÷ 小數</b>」與「<b>大數 mod 小數</b>」。被除數可以有非常多位，除數在 <code>long long</code> 範圍內。",
  h: "<b>大數除以小數的直式除法</b>，一次掃過每一位即可：<br><code>cur = cur × 10 + digit；商的這一位 = cur / d；cur %= d</code><br>掃完後 <code>cur</code> 就是<b>餘數</b>，商則要<b>去掉前導零</b>（全零時保留一個 0）。<br>取模的部分連商都不用存，就是 10070／11879 用過的「大數對小數取模」。<br>O(位數)，一段程式碼同時解決兩種運算。",
  t: "① <b>商要去前導零</b>：<code>110 / 100 = 1</code> 而不是 <code>001</code>；但答案是 0 時要保留一個 <code>0</code>。<br>② 中間值 <code>cur × 10 + digit</code> 最大約 <code>10 × 2³¹</code>，<b>必須 <code>long long</code></b>（除數可到 2³¹−1）。<br>③ 輸入格式是「數字 空白 運算子 空白 數字」，用 <code>cin &gt;&gt; a &gt;&gt; op &gt;&gt; b</code> 直接吃掉空白最省事。<br>④ 被除數用 <code>string</code> 讀，除數用 <code>long long</code> 讀。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string a; char op; ll d;
    while (cin >> a >> op >> d) {
        string q;
        ll cur = 0;
        for (size_t i = 0; i < a.size(); i++) {
            cur = cur * 10 + (a[i] - '0');
            q += char('0' + cur / d);
            cur %= d;                                      // 掃完後 cur 就是餘數
        }
        if (op == '%') { cout << cur << "\\n"; continue; }
        size_t p = q.find_first_not_of('0');                // 去前導零
        cout << (p == string::npos ? "0" : q.substr(p)) << "\\n";
    }
    return 0;
}`
},

10020: {
  q: "Minimal coverage：給若干線段 <code>[L, R]</code>，選出<b>最少</b>的線段完整覆蓋 <code>[0, M]</code>。輸出數量與所選線段；不可能則輸出 <code>0</code>。",
  h: "經典的<b>最少區間覆蓋貪心</b>（跟 10382 灑水器同一個模子）：<br>把線段依左端排序，維護目前已覆蓋到的位置 <code>cur</code>（初值 0）：<br>每回合在所有<b>左端 ≤ cur</b> 的線段裡，挑<b>右端最大</b>的那一條，把 <code>cur</code> 推到那裡；找不到能延伸的（右端都 ≤ cur）就是無解。<br>指標<b>一路往前不回頭</b>，總複雜度 O(n log n)。<br>本題比 10382 多一件事：要<b>記錄選了哪些線段</b>並輸出，所以貪心時要把最佳線段的座標存下來。",
  t: "① 貪心的正確性：每步都選能跨最遠的，用交換論證可證最優。<br>② 右端 <code>≤ cur</code> 的線段<b>毫無幫助</b>，判斷無解時別漏。<br>③ 座標可以是<b>負數</b>，也可能有完全在 [0, M] 之外的線段。<br>④ 線段清單以 <code>0 0</code> 結束。<br>⑤ 每筆測資的輸出之間要<b>空一行</b>。<br>⑥ 若 M = 0，空集合即可覆蓋，答案是 0 條。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int tc = 0; tc < T; tc++) {
        int M; cin >> M;
        vector<pair<int, int> > seg;
        int l, r;
        while (cin >> l >> r && (l || r)) seg.push_back(make_pair(l, r));
        sort(seg.begin(), seg.end());

        vector<pair<int, int> > pick;
        int cur = 0, i = 0, n = seg.size();
        bool ok = true;
        while (cur < M) {
            int best = cur, bi = -1;
            while (i < n && seg[i].first <= cur) {          // 所有能接上的
                if (seg[i].second > best) { best = seg[i].second; bi = i; }
                i++;
            }
            if (bi < 0) { ok = false; break; }              // 延伸不了 → 無解
            pick.push_back(seg[bi]);
            cur = best;
        }
        if (tc) cout << "\\n";
        if (!ok) { cout << "0\\n"; continue; }
        cout << pick.size() << "\\n";
        for (size_t k = 0; k < pick.size(); k++)
            cout << pick[k].first << " " << pick[k].second << "\\n";
    }
    return 0;
}`
},

10125: {
  q: "Sumsets：給一個整數集合 S（n ≤ 1000），找出<b>最大的 d</b>，使得存在<b>相異</b>的 a、b、c、d ∈ S 滿足 <code>a + b + c = d</code>。找不到輸出 <code>no solution</code>。",
  h: "直接列舉四個數是 O(n⁴) = 10¹²，必須<b>把式子搬移</b>：<br><code>a + b = d − c</code><br>左邊只跟 (a, b) 有關、右邊只跟 (c, d) 有關 ⇒ <b>先把所有 <code>a + b</code> 存進雜湊表</b>（O(n²) = 50 萬筆），再列舉 (d, c) 去查表。<br>把 d 由<b>大到小</b>枚舉，第一個成功的就是答案，可以提早結束。<br>總複雜度約 O(n²)。<br>這個「<b>把等式拆成兩半、各自預處理</b>」的手法就是折半枚舉（meet in the middle）的雛形，跟 12911 是同一家族。",
  t: "① <b>四個數必須互不相同</b>（是「相異元素」不是「相異數值」），查到候選後要驗證索引不重疊——這是本題最常見的 WA 來源。<br>② 因此雜湊表要能存<b>同一個和的多組 (a, b)</b>，否則唯一的那組剛好撞到 c 或 d 就會誤判無解。<br>③ 數值可能是負數，和的範圍很大，用 <code>unordered_map</code> 而非陣列。<br>④ 由大到小枚舉 d 才能提早收工。<br>⑤ 讀到 EOF 結束；無解時輸出 <code>no solution</code>（小寫）。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n) {
        vector<ll> a(n);
        for (int i = 0; i < n; i++) cin >> a[i];
        sort(a.begin(), a.end());

        // 所有 a[i] + a[j]（i < j）→ 記下所有可行的索引配對
        unordered_map<ll, vector<pair<int, int> > > sum2;
        sum2.reserve(n * n / 2);
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                sum2[a[i] + a[j]].push_back(make_pair(i, j));

        bool found = false;
        ll ans = 0;
        for (int d = n - 1; d >= 0 && !found; d--)          // d 由大到小
            for (int c = 0; c < n && !found; c++) {
                if (c == d) continue;
                unordered_map<ll, vector<pair<int, int> > >::iterator it
                    = sum2.find(a[d] - a[c]);
                if (it == sum2.end()) continue;
                for (size_t k = 0; k < it->second.size(); k++) {
                    int x = it->second[k].first, y = it->second[k].second;
                    if (x != c && x != d && y != c && y != d) {   // 四者互異
                        ans = a[d]; found = true; break;
                    }
                }
            }
        if (found) cout << ans << "\\n";
        else cout << "no solution\\n";
    }
    return 0;
}`
},

10116: {
  q: "Robot Motion：網格中每格寫著 <code>N/S/E/W</code>，機器人從第一列的指定欄進入，依格子指示移動。輸出「走幾步離開網格」或「走 A 步後進入長度 B 的迴圈」。",
  h: "純模擬，重點是<b>迴圈偵測</b>：用一個 <code>step[r][c]</code> 記下<b>第一次踏上該格時是第幾步</b>（0 代表沒走過）。<br>・走出格線 ⇒ 輸出 <code>總步數 step(s) to exit</code><br>・踏到已訪問的格子 ⇒ <b>進入迴圈</b>，此時<br>　<code>迴圈前的步數 = step[r][c] − 1</code>、<code>迴圈長度 = 目前步數 − step[r][c] + 1</code><br>用「記錄步數」而不是單純的布林 visited，是<b>一次同時得到兩個答案</b>的關鍵。<br>O(rows × cols)。",
  t: "① 起點是<b>第 1 列</b>的指定欄，且欄號是 <b>1-based</b>。<br>② 迴圈長度的算式很容易差 1，建議用小例子（例如 3 步後進 2 步的圈）驗一次。<br>③ 輸出的 <code>step(s)</code> <b>永遠帶括號 s</b>，不用管單複數。<br>④ 每筆測資都要清空 step 陣列。<br>⑤ <code>0 0 0</code> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int R, C, s;
    while (cin >> R >> C >> s && (R || C || s)) {
        vector<string> g(R);
        for (int i = 0; i < R; i++) cin >> g[i];
        vector<vector<int> > step(R, vector<int>(C, 0));

        int r = 0, c = s - 1, cnt = 0;                     // 1-based 欄 → 0-based
        while (true) {
            if (r < 0 || c < 0 || r >= R || c >= C) {
                cout << cnt << " step(s) to exit\\n"; break;
            }
            if (step[r][c]) {                              // 踏到走過的格子 → 迴圈
                cout << step[r][c] - 1 << " step(s) before a loop of "
                     << cnt - step[r][c] + 1 << " step(s)\\n";
                break;
            }
            step[r][c] = ++cnt;
            char d = g[r][c];
            if (d == 'N') r--;
            else if (d == 'S') r++;
            else if (d == 'E') c++;
            else c--;
        }
    }
    return 0;
}`
},

10940: {
  q: "Throwing cards away II：1..n 由上而下疊好，重複「丟掉最上面那張、再把新的最上面那張移到最底下」，直到只剩一張。求最後剩下哪張。",
  h: "先用小 n 手算出規律：<code>1→1, 2→2, 3→2, 4→4, 5→2, 6→4, 7→6, 8→8</code>。<br>看出來了：設 <code>2^m</code> 是 ≤ n 的<b>最大 2 的冪</b>，令 <code>L = n − 2^m</code>，則<br><code>答案 = 2L</code>（<code>L = 0</code> 時答案就是 n）<br>直覺：每一輪過後所有奇數位置被丟掉、規模減半，剛好對應二進位「把最高位搬到最低位」的約瑟夫問題。<br>O(1) 或 O(log n)。n 可到 50 萬又有大量詢問，<b>公式解遠勝逐次模擬</b>（用 <code>deque</code> 模擬是 O(n)，題目資料量下可能吃緊）。",
  t: "① <b><code>L = 0</code>（n 是 2 的冪）要特判</b>，此時答案是 n 本身而不是 0。<br>② 找最大 2 的冪可以用 <code>while (p * 2 &lt;= n) p *= 2;</code>，或 <code>1 &lt;&lt; (31 − __builtin_clz(n))</code>。<br>③ n = 1 時直接是 1（連一次操作都做不了）。<br>④ 輸入以 <code>0</code> 結束。<br>⑤ 若想保險，可以用 <code>deque</code> 模擬小 n 來驗證公式——這也是推出公式的過程。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    long long n;
    while (cin >> n && n) {
        long long p = 1;
        while (p * 2 <= n) p *= 2;                         // 最大的 2 的冪
        long long L = n - p;
        cout << (L == 0 ? n : 2 * L) << "\\n";
    }
    return 0;
}`
},

10360: {
  q: "Rat Attack：城市是 1025 × 1025 的格子，某些格子有老鼠。投下強度 d 的毒氣彈會消滅以該點為中心、<b>邊長 2d+1 的正方形</b>內所有老鼠。求最佳投彈點與消滅數量。",
  h: "格子只有 1025 × 1025 ≈ 105 萬個，<b>對每個可能的中心都算一次</b>是可行的——前提是每次要 O(1) 算出正方形內的總和 ⇒ <b>二維前綴和</b>。<br><code>S[i][j] = A[i][j] + S[i−1][j] + S[i][j−1] − S[i−1][j−1]</code><br>查詢矩形 <code>[r1..r2] × [c1..c2]</code>：<br><code>S[r2][c2] − S[r1−1][c2] − S[r2][c1−1] + S[r1−1][c1−1]</code><br>邊界要<b>夾回 [0, 1024]</b>。總複雜度 O(1025²)，約 100 萬次運算。<br>這是二維前綴和最標準的應用場景，模板值得背熟。",
  t: "① 二維前綴和的<b>容斥四項</b>（減兩塊、加回一塊）是最容易寫錯的地方。<br>② 邊界要 <b>clamp</b>：中心在角落時正方形會超出地圖。<br>③ 座標範圍是 <b>0..1024</b>（共 1025 格），不是 1..1024。<br>④ 為了避免 <code>i−1</code> 越界，前綴和陣列習慣<b>多開一圈</b>並整體偏移 1。<br>⑤ 同一格可能出現多次，人口要<b>累加</b>而非覆蓋。",
  c: `#include <bits/stdc++.h>
using namespace std;

int S[1027][1027];                                          // 多開一圈，索引偏移 1

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int d; cin >> d;
        memset(S, 0, sizeof S);
        int n; cin >> n;
        for (int i = 0; i < n; i++) {
            int x, y, p; cin >> x >> y >> p;
            S[x + 1][y + 1] += p;                          // 同格要累加
        }
        for (int i = 1; i <= 1025; i++)
            for (int j = 1; j <= 1025; j++)
                S[i][j] += S[i - 1][j] + S[i][j - 1] - S[i - 1][j - 1];

        int bx = 0, by = 0, best = -1;
        for (int x = 0; x <= 1024; x++)
            for (int y = 0; y <= 1024; y++) {
                int r1 = max(0, x - d) + 1, r2 = min(1024, x + d) + 1;
                int c1 = max(0, y - d) + 1, c2 = min(1024, y + d) + 1;
                int s = S[r2][c2] - S[r1 - 1][c2] - S[r2][c1 - 1] + S[r1 - 1][c1 - 1];
                if (s > best) { best = s; bx = x; by = y; }
            }
        cout << bx << " " << by << " " << best << "\\n";
    }
    return 0;
}`
},

10102: {
  q: "彩色田地上的路徑：<code>n × n</code> 的格子塗上顏色 1、2、3。從<b>任一個顏色 1 的格子</b>出發（四方向移動），走到<b>某個顏色 3 的格子</b>。求「不論從哪個 1 出發都能達成」的最少步數——也就是所有 1 到最近的 3 的距離中的<b>最大值</b>。",
  h: "兩種等價寫法：<br><b>(A) 多源 BFS</b>：把<b>所有顏色 3 的格子一起丟進佇列</b>當起點，一次 BFS 就得到每格到最近 3 的距離；再取所有顏色 1 格子的最大值。O(n²)。<br><b>(B) 直接用曼哈頓距離</b>：因為沒有障礙物，四方向的最短距離就是 <code>|dx| + |dy|</code>，所以答案 = <code>max over 1 ( min over 3 |dx|+|dy| )</code>。若 1 與 3 的數量都不多，暴力 O(#1 × #3) 也可以。<br>本解用 (A)，因為它<b>與格子數成正比、不受 1/3 數量影響</b>，也是更泛用的模板（有障礙物時只有 (A) 還能用）。",
  t: "① <b>多源 BFS 就是把所有起點一次全部入列、距離設 0</b>——不需要跑很多次 BFS，這是本題最該學的技巧。<br>② 求的是「最壞情況」⇒ 對 1 取 <b>max</b>、對 3 取 min，兩層方向別搞反。<br>③ 題目保證至少各有一個 1 和一個 3。<br>④ 顏色是<b>連在一起的一串數字</b>（例如 <code>1223</code>），用 <code>cin &gt;&gt; string</code> 讀整列。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n) {
        vector<string> g(n);
        for (int i = 0; i < n; i++) cin >> g[i];

        vector<vector<int> > d(n, vector<int>(n, -1));
        queue<pair<int, int> > q;
        for (int i = 0; i < n; i++)                        // 多源 BFS：所有 3 一起入列
            for (int j = 0; j < n; j++)
                if (g[i][j] == '3') { d[i][j] = 0; q.push(make_pair(i, j)); }

        int dx[] = {1, -1, 0, 0}, dy[] = {0, 0, 1, -1};
        while (!q.empty()) {
            pair<int, int> u = q.front(); q.pop();
            for (int k = 0; k < 4; k++) {
                int nx = u.first + dx[k], ny = u.second + dy[k];
                if (nx < 0 || ny < 0 || nx >= n || ny >= n || d[nx][ny] >= 0) continue;
                d[nx][ny] = d[u.first][u.second] + 1;
                q.push(make_pair(nx, ny));
            }
        }
        int ans = 0;
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (g[i][j] == '1') ans = max(ans, d[i][j]);   // 最壞情況
        cout << ans << "\\n";
    }
    return 0;
}`
},

10009: {
  q: "All Roads Lead Where?：給城市之間的道路（無權重），對每組查詢輸出<b>最短路徑</b>經過的城市，以各城市<b>名稱首字母</b>串接表示。",
  unsure: true,
  h: "無權重圖的最短路 = <b>BFS</b>。<br>做法：用 <code>map&lt;string,int&gt;</code> 把城市名編號、建鄰接表；對每個查詢從起點 BFS，並記錄 <code>parent[]</code>，抵達終點後<b>沿 parent 回溯</b>再反轉，即得路徑。<br>輸出時把每個城市名的<b>第一個字母</b>接起來。<br>因為 BFS 逐層擴展，<b>第一次抵達即為最短</b>，這是 BFS 相對 Dijkstra 的最大好處（邊權全為 1 時不需要優先佇列）。<br>查詢數不多，每次重跑一次 BFS 即可。",
  t: "① BFS 記得在<b>入列時</b>就標記 visited（不是出列時），否則同一點會被重複入列。<br>② 路徑要<b>回溯後反轉</b>，順序反了就整串顛倒。<br>③ 輸出是<b>首字母串接</b>，不是完整城市名。<br>④ 測資之間、輸出之間要<b>空行</b>（本題原文在轉檔中有殘缺，格式細節請對照官方題敘再微調——這也是本題標記為不確定的原因）。<br>⑤ 城市名大小寫敏感，用 map 當鍵時要一致。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int T; cin >> T;
    for (int tc = 0; tc < T; tc++) {
        int n, q; cin >> n >> q;
        map<string, int> id;
        vector<string> name;
        vector<vector<int> > adj;
        // 取得城市編號，沒有就新建
        for (int i = 0; i < n; i++) {
            string a, b; cin >> a >> b;
            if (!id.count(a)) { id[a] = name.size(); name.push_back(a); adj.push_back(vector<int>()); }
            if (!id.count(b)) { id[b] = name.size(); name.push_back(b); adj.push_back(vector<int>()); }
            adj[id[a]].push_back(id[b]);
            adj[id[b]].push_back(id[a]);
        }
        if (tc) cout << "\\n";
        for (int Q = 0; Q < q; Q++) {
            string a, b; cin >> a >> b;
            int s = id[a], t = id[b];
            vector<int> par(name.size(), -2);
            queue<int> que; que.push(s); par[s] = -1;
            while (!que.empty()) {
                int u = que.front(); que.pop();
                if (u == t) break;
                for (size_t i = 0; i < adj[u].size(); i++) {
                    int v = adj[u][i];
                    if (par[v] == -2) { par[v] = u; que.push(v); }   // 入列時就標記
                }
            }
            vector<int> path;
            for (int u = t; u != -1; u = par[u]) path.push_back(u);
            reverse(path.begin(), path.end());
            for (size_t i = 0; i < path.size(); i++) cout << name[path[i]][0];
            cout << "\\n";
        }
    }
    return 0;
}`
},

10286: {
  q: "正五邊形內的最大正方形：給正五邊形的邊長，求能塞進去、且<b>有一個頂點與五邊形頂點重合</b>的最大正方形邊長，輸出 10 位小數。",
  h: "純幾何推導，結果是一個<b>常數比例</b>：<br><code>正方形邊長 = 邊長 × sin(72°) / sin(63°) ≈ 邊長 × 1.0673</code><br>推導概略：把正方形的一頂點放在五邊形頂點上，另兩個頂點落在兩條邊上，用<b>正弦定理</b>在由五邊形頂點、正方形頂點構成的三角形上解出比例；72° 是五邊形的外角關係、63° 則來自 45° 與 18° 的組合。<br>驗算：<code>0.0000001 × 1.06740 = 0.0000001067</code> ✓、<code>0.0000003 × 1.06740 = 0.0000003202</code> ✓。<br>O(1)——考場上這種題只要<b>用樣例反推出比例常數</b>就能解，不必真的推完幾何。",
  t: "① 這題最實用的技巧是：<b>看出「答案 ÷ 輸入」是定值</b>，用樣例把常數反推出來（0.0000001067 / 0.0000001 = 1.0674）。<br>② 角度要轉<b>弧度</b>：<code>72 × π / 180</code>。<br>③ 輸出<b>整整 10 位小數</b>，用 <code>setprecision(10)</code> 搭配 <code>fixed</code>。<br>④ 輸入可能極小（1e−7）或極大（1e5），<code>double</code> 的相對精度足夠。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cout << fixed << setprecision(10);
    const double PI = acos(-1.0);
    double k = sin(72 * PI / 180) / sin(63 * PI / 180);     // ≈ 1.0673827...
    double a;
    while (cin >> a) cout << a * k << "\\n";
    return 0;
}`
},

10673: {
  q: "Play with Floor and Ceil：給 x 與 k，找出整數 p、q 使得<br><code>x = p × ⌊x/k⌋ + q × ⌈x/k⌉</code>",
  h: "設 <code>a = ⌊x/k⌋</code>、<code>r = x mod k</code>，則 <code>x = k·a + r</code>。<br>・若 <code>r = 0</code>：兩者都等於 a，任何 <code>p + q = k</code> 都成立。<br>・若 <code>r &gt; 0</code>：<code>⌈x/k⌉ = a + 1</code>，把 x 拆成<br>　<code>x = (k − r)·a + r·(a + 1)</code>　⇒　<code>p = k − r, q = r</code><br>驗證：<code>(k−r)a + r(a+1) = ka + r = x</code> ✓。<br>而 <code>r = 0</code> 時這條公式給出 <code>(k, 0)</code>，同樣成立 ⇒ <b>一條公式通吃</b>，O(1)。<br>樣例 <code>5 2</code>：a = 2, r = 1 ⇒ (1, 1)，<code>1×2 + 1×3 = 5</code> ✓。",
  t: "① 這題是<b>特殊評分（special judge）</b>：只要等式成立就算對，不必跟樣例輸出一模一樣（樣例中 <code>40 2</code> 印 <code>1 1</code>、<code>24444 6</code> 印 <code>0 6</code>，可見多解皆可）。<br>② 一條公式 <code>(k − r, r)</code> 同時涵蓋整除與不整除的情況，不用分支。<br>③ x 可能很大，用 <code>long long</code>。<br>④ p、q 都會是<b>非負整數</b>，符合題意。<br>⑤ 第一行是測資數。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        ll x, k; cin >> x >> k;
        ll r = x % k;
        cout << k - r << " " << r << "\\n";                 // x = (k-r)*floor + r*ceil
    }
    return 0;
}`
},

10182: {
  q: "Bee Maja：蜂巢由六角形格子編號，1 號在原點，之後<b>一圈一圈往外螺旋</b>。給編號，輸出它的座標 (x, y)。",
  h: "用<b>軸向座標（axial coordinates）</b>表示六角格，六個鄰居方向是<br><code>(0,1) (−1,1) (−1,0) (0,−1) (1,−1) (1,0)</code><br>第 k 圈有 <b>6k</b> 格，起點是 <code>(0, k)</code>。從起點出發，依序沿<br><code>(−1,0) (0,−1) (1,−1) (1,0) (0,1)</code> 各走 <b>k</b> 步，最後沿 <code>(−1,1)</code> 走 <b>k−1</b> 步，剛好繞回起點旁邊（合計 6k − 1 步）。<br>編號 &lt; 100000 ⇒ 直接<b>把整條螺旋預先走一遍存成表</b>（10 萬筆），查詢 O(1)。<br>比起硬推公式，<b>「照定義走一遍建表」既好寫又不會錯</b>，是這類螺旋題的首選做法。",
  t: "① 第一圈的步數分配是 <code>k, k, k, k, k, k−1</code>（最後一段少一步），寫成全部 k 步會多繞一格。<br>② 起點 <code>(0, k)</code> 與方向順序要跟樣例對齊：<code>1→(0,0)</code>、<code>2→(0,1)</code>、<code>3→(−1,1)</code>、<code>4→(−1,0)</code>、<code>5→(0,−1)</code> ✓。<br>③ 建表一次就好，別每筆詢問重走。<br>④ 座標會是<b>負數</b>。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const int MX = 100005;
    vector<pair<int, int> > pos(MX + 1);
    pos[1] = make_pair(0, 0);

    int dx[] = {-1, 0, 1, 1, 0, -1};                        // 繞圈用的六個方向
    int dy[] = {0, -1, -1, 0, 1, 1};
    int idx = 1;
    for (int k = 1; idx < MX; k++) {
        int x = 0, y = k;                                   // 每圈的起點
        if (++idx > MX) break;
        pos[idx] = make_pair(x, y);
        for (int d = 0; d < 6 && idx < MX; d++) {
            int steps = (d == 5) ? k - 1 : k;               // 最後一段少一步
            for (int s = 0; s < steps && idx < MX; s++) {
                x += dx[d]; y += dy[d];
                pos[++idx] = make_pair(x, y);
            }
        }
    }
    int n;
    while (cin >> n) cout << pos[n].first << " " << pos[n].second << "\\n";
    return 0;
}`
}
};

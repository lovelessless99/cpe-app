/* 二星題庫（第十四批 7 題） */
const SOL31 = {
10160: {
  q: "Servicing Stations：n 個城鎮（≤ 35）與若干條直接連線。要蓋最少的服務站，使<b>每個城鎮本身有站，或與某個有站的城鎮直接相連</b>。求最少站數。",
  h: "這是<b>最小支配集（minimum dominating set）</b>，NP-hard，但 n ≤ 35 可以用<b>分支限界</b>解決。<br>把每個城鎮 i 的「覆蓋範圍」壓成一個 <code>long long</code> 位元遮罩 <code>cover[i] = i 自己 | 所有鄰居</code>。<br><b>關鍵的分支規則</b>：每次找出<b>編號最小的、尚未被覆蓋的城鎮 u</b>——因為 u 一定得被覆蓋，所以下一個放站的地方<b>只可能是 u 本身或 u 的某個鄰居</b>。這把分支數從 n 降到「u 的度數 + 1」，剪枝效果極強。<br>再加上「目前站數 ≥ 已知最佳解就回溯」，實測非常快。",
  t: "① <b>不要枚舉 2³⁵ 個子集合</b>——要用「先挑一個未覆蓋的點，只在它的鄰域裡分支」這個規則。<br>② 位元遮罩要用 <code>long long</code>（35 位超過 int）。<br>③ 別忘了 <code>cover[i]</code> 要<b>包含 i 自己</b>。<br>④ 剪枝條件用<b>嚴格</b>比較（<code>cnt &gt;= best</code> 就回溯），避免做白工。<br>⑤ <code>n = 0</code> 結束；一份輸入可能有多筆測資。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int n;
ll cover[40];
int best_;

void dfs(int cnt, ll covered) {
    if (cnt >= best_) return;                          // 剪枝
    if (covered == (n == 63 ? -1LL : (1LL << n) - 1)) { best_ = cnt; return; }
    int u = 0;
    while (covered >> u & 1) u++;                      // 最小的未覆蓋城鎮
    for (int v = 0; v < n; v++)
        if (cover[v] >> u & 1)                         // 只能靠 u 自己或它的鄰居
            dfs(cnt + 1, covered | cover[v]);
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int m;
    while (cin >> n >> m && (n || m)) {
        for (int i = 0; i < n; i++) cover[i] = 1LL << i;   // 包含自己
        for (int i = 0; i < m; i++) {
            int a, b; cin >> a >> b;
            a--; b--;
            cover[a] |= 1LL << b;
            cover[b] |= 1LL << a;
        }
        best_ = n;
        dfs(0, 0);
        cout << best_ << "\\n";
    }
    return 0;
}`
},

11609: {
  q: "Teams：教練有 n 位球員，要選出一支<b>非空</b>球隊並從中指定<b>一位隊長</b>。問有幾種選法（模 10⁹+7）。",
  h: "直接列式：選 k 人再挑隊長 ⇒ <code>Σ_{k=1..n} C(n,k) × k</code>。<br>用組合恆等式 <code>k·C(n,k) = n·C(n−1,k−1)</code> 化簡：<br><code>Σ k·C(n,k) = n · Σ C(n−1,k−1) = n · 2^(n−1)</code><br>更直觀的<b>雙重計數</b>：先選隊長（n 種），其餘 n−1 人各自決定加不加入（2^(n−1) 種）⇒ 直接就是 <code>n × 2^(n−1)</code>。<br>驗算：n=1 ⇒ 1 ✓、n=2 ⇒ 4 ✓、n=3 ⇒ 12 ✓。<br>n 可到 10⁹ ⇒ 用<b>快速冪</b>算 <code>2^(n−1) mod p</code>，O(log n)。",
  t: "① <b>先選隊長再讓其他人自由選擇</b>的雙重計數視角，可以完全避開組合數與求和。<br>② n 到 10⁹ ⇒ 指數要用快速冪，且 <code>n % MOD</code> 也要先取模再相乘。<br>③ 乘法前轉 <code>long long</code>。<br>④ n = 0 時答案是 0（但題目 n ≥ 1）。<br>⑤ 輸出格式 <code>Case #k: X</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll MOD = 1000000007;

ll powmod(ll b, ll e, ll m) {
    ll r = 1 % m; b %= m;
    while (e) { if (e & 1) r = r * b % m; b = b * b % m; e >>= 1; }
    return r;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int tc = 1; tc <= T; tc++) {
        ll n; cin >> n;
        // 先選隊長 (n 種)，其餘 n-1 人各自決定加不加入 (2^(n-1) 種)
        ll ans = n % MOD * powmod(2, n - 1, MOD) % MOD;
        cout << "Case #" << tc << ": " << ans << "\\n";
    }
    return 0;
}`
},

10283: {
  q: "The Kissing Circles：半徑 R 的大圓內放 n 個<b>等半徑</b>小圓，每個都與大圓內切、且<b>相鄰兩圓互相外切</b>。求小圓半徑 r、<b>正中央空白區</b>的面積，以及<b>其餘空白</b>的面積（各 10 位小數）。",
  h: "三段幾何：<br><b>① 小圓半徑</b>：n 個圓心落在半徑 <code>R − r</code> 的圓上，相鄰圓心夾角 <code>2π/n</code>、距離 <code>2r</code> ⇒<br><code>2r = 2(R−r)·sin(π/n)</code>　⇒　<code>r = R·s / (1 + s)</code>，其中 <code>s = sin(π/n)</code><br><b>② 中央區域</b>：由 n 個圓心構成的<b>正 n 邊形</b>，扣掉每個頂點處的<b>扇形</b>：<br><code>正 n 邊形面積 = ½·n·(R−r)²·sin(2π/n)</code><br><code>扇形總和 = ½·r²·π·(n−2)</code>（n 個內角合計 <code>(n−2)π</code>）<br><b>③ 其餘空白</b> = <code>πR² − n·πr² − 中央區域</code><br>驗算 <code>R=10, n=3</code>：r = <b>4.6410161514</b> ✓、中央 <b>3.4732652470</b> ✓、其餘 <b>107.6854162259</b> ✓。",
  t: "① 圓心軌跡半徑是 <code>R − r</code>（<b>內切</b>，不是 R）。<br>② 中央區域<b>不是</b>正 n 邊形本身，要扣掉 n 個扇形；扇形角總和用「多邊形內角和 <code>(n−2)π</code>」一次算完最省事。<br>③ π 用 <code>acos(-1.0)</code>，輸出 <b>10 位小數</b> ⇒ 精度要求高，全程 <code>double</code> 剛好夠。<br>④ n = 2 時中央區域為 0，公式自然成立。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cout << fixed << setprecision(10);
    const double PI = acos(-1.0);
    double R; int n;
    while (cin >> R >> n) {
        double s = sin(PI / n);
        double r = R * s / (1 + s);                     // 相鄰外切 + 與大圓內切
        double poly = 0.5 * n * (R - r) * (R - r) * sin(2 * PI / n);
        double sectors = 0.5 * r * r * PI * (n - 2);    // 內角和 = (n-2)π
        double center = poly - sectors;
        double rest = PI * R * R - n * PI * r * r - center;
        cout << r << " " << center << " " << rest << "\\n";
    }
    return 0;
}`
},

10596: {
  q: "Morning Walk：給一張無向圖，問能否<b>每條路恰好走一次</b>並回到起點（歐拉迴路）。",
  h: "歐拉迴路的存在條件只有兩條：<br>① <b>所有頂點的度數皆為偶數</b><br>② <b>所有「有邊」的頂點都在同一個連通分量</b>（孤立點可以忽略）<br>用<b>並查集</b>檢查連通性最省事：加邊時合併，最後看所有度數 &gt; 0 的點是否同根。<br>O(m α(n))。<br>（跟 302 John's trip 是同一個判定，只是那題還要真的把路線走出來。）",
  t: "① <b>孤立點不影響答案</b>——只檢查度數 &gt; 0 的點是否連通，否則有孤立點的圖會被誤判。<br>② 可能有<b>重邊與自環</b>：自環對度數貢獻 2（仍是偶數），重邊也要各自計入度數。<br>③ 邊數可能是 0 ⇒ 沒有路要走，一般判定為 <code>Possible</code>（視題目，本解在無邊時所有度數為 0、無需連通性檢查，自然回傳 Possible）。<br>④ 輸出 <code>Possible</code> / <code>Not Possible</code>（注意大小寫與空格）。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

vector<int> par;
int find_(int x) { while (par[x] != x) x = par[x] = par[par[x]]; return x; }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m;
    while (cin >> n >> m) {
        par.resize(n);
        for (int i = 0; i < n; i++) par[i] = i;
        vector<int> deg(n, 0);
        for (int i = 0; i < m; i++) {
            int a, b; cin >> a >> b;
            deg[a]++; deg[b]++;                         // 自環自然貢獻 2
            int x = find_(a), y = find_(b);
            if (x != y) par[x] = y;
        }
        bool ok = true;
        int root = -1;
        for (int i = 0; i < n; i++) {
            if (deg[i] % 2) ok = false;                 // 度數必須全偶
            if (deg[i] > 0) {                           // 只看有邊的點是否連通
                if (root < 0) root = find_(i);
                else if (find_(i) != root) ok = false;
            }
        }
        cout << (ok ? "Possible" : "Not Possible") << "\\n";
    }
    return 0;
}`
},

11056: {
  q: "Formula 1：給若干筆計時紀錄（<code>車手名 : X min Y sec Z ms</code>，同一車手可能出現多次），依<b>各自最佳成績</b>排出發車順序，<b>每排兩位</b>，輸出 <code>Row 1</code>、兩個名字、<code>Row 2</code>…",
  h: "三個步驟：<br>① <b>統一時間單位</b>：把 <code>min / sec / ms</code> 換算成毫秒 <code>(min×60 + sec)×1000 + ms</code>，之後全用整數比較，零誤差。<br>② <b>取每位車手的最佳（最小）成績</b>：用 <code>map&lt;string, ll&gt;</code>，遇到更好的就更新。<br>③ <b>依成績遞增排序</b>，每兩位輸出一排。<br>解析那一行時，格式固定為 <code>名字 : a min b sec c ms</code>，用 <code>&gt;&gt;</code> 依序吃掉那些單位字就好——<b>名字本身不含空白</b>（否則得改用 <code>find(':')</code> 切分）。",
  t: "① <b>時間一律換成毫秒</b>再比較，別用「先比分鐘再比秒」的多層判斷（容易漏）。<br>② 同一車手<b>出現多次要取最佳</b>，不是最後一次。<br>③ 輸出是<b>每排兩位</b>；最後一排可能只有一位。<br>④ <code>Row</code> 的編號從 1 開始。<br>⑤ 讀取時要把 <code>:</code>、<code>min</code>、<code>sec</code>、<code>ms</code> 這些字串一起吃掉。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        map<string, ll> best;
        for (int i = 0; i < n; i++) {
            string name, tok; ll mi, se, ms;
            cin >> name >> tok >> mi >> tok >> se >> tok >> ms >> tok;
            ll t = (mi * 60 + se) * 1000 + ms;          // 統一成毫秒
            map<string, ll>::iterator it = best.find(name);
            if (it == best.end() || t < it->second) best[name] = t;
        }
        vector<pair<ll, string> > v;
        for (map<string, ll>::iterator it = best.begin(); it != best.end(); ++it)
            v.push_back(make_pair(it->second, it->first));
        sort(v.begin(), v.end());

        for (size_t i = 0; i < v.size(); i++) {
            if (i % 2 == 0) cout << "Row " << i / 2 + 1 << "\\n";
            cout << v[i].second << "\\n";
        }
    }
    return 0;
}`
},

10497: {
  q: "Sweet Child Makes Trouble：n 樣東西全部<b>放回原位以外</b>的位置，有幾種排法？（也就是 n 的<b>錯排數</b>）n ≤ 800。",
  h: "<b>錯排（derangement）</b>的遞推：<br><code>D(n) = (n − 1) × (D(n−1) + D(n−2))</code>，<code>D(0) = 1, D(1) = 0</code><br>推導：第 1 個物品放到位置 k（n−1 種選擇），接著看第 k 個物品——若它放回位置 1，剩下就是 <code>D(n−2)</code>；否則把「不能放位置 1」看成它的新禁區，剩下是 <code>D(n−1)</code>。<br><b>n = 800 時 D(n) 有近 2000 位</b> ⇒ 必須用<b>大數</b>（加法 + 乘小數）。<br>一次遞推到 800 全部存起來，之後每筆詢問 O(1)。",
  t: "① <b>D(800) 約 2000 位</b>，<code>long long</code> 差了幾十個數量級，一定要大數。<br>② 遞推的初始值是 <code>D(0) = 1, D(1) = 0</code>（不是 1, 1）。<br>③ 要<b>預處理全部</b>再查表，每筆重算會 TLE。<br>④ base 10⁹ 輸出時<b>最高組不補零、其餘補滿 9 位</b>。<br>⑤ 記憶體：801 個大數 × 約 220 個 limb ≈ 700 KB，安全。<br>⑥ 讀到負數或 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

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

Big mulSmall(const Big &a, ll k) {
    Big r; ll carry = 0;
    for (size_t i = 0; i < a.size() || carry; i++) {
        ll v = carry + (i < a.size() ? (ll)a[i] * k : 0);
        r.push_back((int)(v % BASE)); carry = v / BASE;
    }
    if (r.empty()) r.push_back(0);
    return r;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const int MX = 800;
    vector<Big> D(MX + 1);
    D[0] = Big(1, 1);                                   // D(0) = 1
    D[1] = Big(1, 0);                                   // D(1) = 0
    for (int i = 2; i <= MX; i++)
        D[i] = mulSmall(add(D[i - 1], D[i - 2]), i - 1);

    int n;
    while (cin >> n && n >= 0) {
        const Big &v = D[n];
        cout << v.back();
        for (int i = (int)v.size() - 2; i >= 0; i--)
            cout << setw(W) << setfill('0') << v[i];
        cout << setfill(' ') << "\\n";
    }
    return 0;
}`
},

722: {
  q: "Lakes：格子地圖上 <code>0</code> 是水、<code>1</code> 是陸地。給一個起始座標（<b>1-based 的列、行</b>），求包含該點的<b>水域連通塊</b>面積（<b>四方向</b>相鄰）。",
  h: "最單純的 <b>flood fill</b>：從起點出發，四方向擴展所有還沒走過的 <code>0</code>，數格子數。<br>難點全在 <b>I/O</b>：<br>・地圖的<b>大小沒有給</b>，要<b>讀到空行或 EOF 為止</b>，列數由讀到幾行決定、行數由字串長度決定。<br>・起始座標是 <code>1-based</code>，而且格式可能有<b>前導零</b>（樣例的 <code>02 01</code>），用 <code>cin &gt;&gt; int</code> 讀就會自動處理。<br>・每筆測資之間有空行，輸出之間也要空行。<br>用迴圈版 BFS（<code>queue</code>）比遞迴 DFS 安全，避免大地圖爆堆疊。",
  t: "① <b>地圖尺寸要自己推</b>（讀到空行為止），這是本題最麻煩的地方。<br>② 起點是 <b>1-based</b>，轉成陣列索引要各減 1。<br>③ 是<b>四方向</b>（不含斜角）。<br>④ 起點若本身是陸地，面積是 0。<br>⑤ 第一行是測資數、後面接空行；測資之間也有空行，輸出之間要<b>空一行</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int T;
    {
        string line; getline(cin, line);
        T = atoi(line.c_str());
    }
    for (int tc = 0; tc < T; tc++) {
        string line;
        while (getline(cin, line) && line.find_first_not_of(" \\t\\r") == string::npos) {}
        int r0, c0;
        { istringstream is(line); is >> r0 >> c0; }     // 1-based，可能有前導零

        vector<string> g;
        while (getline(cin, line)) {                    // 讀到空行或 EOF
            if (line.find_first_not_of(" \\t\\r") == string::npos) break;
            while (!line.empty() && (line[line.size() - 1] == '\\r')) line.erase(line.size() - 1);
            g.push_back(line);
        }
        int n = g.size(), m = n ? g[0].size() : 0;

        int area = 0;
        int sr = r0 - 1, sc = c0 - 1;
        if (sr >= 0 && sr < n && sc >= 0 && sc < m && g[sr][sc] == '0') {
            queue<pair<int, int> > q;
            q.push(make_pair(sr, sc));
            g[sr][sc] = '1';                            // 就地標記已訪問
            int dx[] = {1, -1, 0, 0}, dy[] = {0, 0, 1, -1};
            while (!q.empty()) {
                pair<int, int> u = q.front(); q.pop();
                area++;
                for (int k = 0; k < 4; k++) {
                    int x = u.first + dx[k], y = u.second + dy[k];
                    if (x < 0 || y < 0 || x >= n || y >= (int)g[x].size()) continue;
                    if (g[x][y] != '0') continue;
                    g[x][y] = '1';
                    q.push(make_pair(x, y));
                }
            }
        }
        if (tc) cout << "\\n";
        cout << area << "\\n";
    }
    return 0;
}`
}
};

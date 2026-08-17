/* 二星題庫（第七批 12 題） */
const SOL24 = {
10176: {
  q: "Ocean Deep：給一個<b>二進位大數</b>（可能跨好幾行，以 <code>#</code> 結束），判斷它是否為質數 <b>131071</b>（= 2¹⁷ − 1）的倍數。",
  h: "又是<b>大數對小數取模</b>，只是底數從 10 換成 2：<br><code>r = (r × 2 + bit) % 131071</code><br>逐字元讀入、遇到 <code>#</code> 結束，過程中<b>完全不需要保存整個數字</b>。<br>因為數字可能跨行，最乾淨的寫法是用 <code>cin &gt;&gt; c</code> <b>逐字元讀</b>（它會自動跳過所有空白與換行），完全不用管換行在哪。<br>O(位數)。",
  t: "① 模數是 <b>131071</b>（2¹⁷ − 1，一個梅森質數），這個常數要記得。<br>② 數字<b>可能跨多行</b>，用逐字元讀最省事，別用 getline 再自己拼。<br>③ <code>0#</code> 也是合法輸入，0 是任何數的倍數 ⇒ 輸出 YES。<br>④ 中間值最大 <code>131070 × 2 + 1</code>，<code>int</code> 綽綽有餘。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const int P = 131071;                              // 2^17 - 1
    char c;
    while (cin >> c) {                                 // >> 會自動跳過換行
        int r = 0;
        while (c != '#') {
            r = (r * 2 + (c - '0')) % P;               // 二進位版的大數取模
            if (!(cin >> c)) break;
        }
        cout << (r == 0 ? "YES" : "NO") << "\\n";
    }
    return 0;
}`
},

10700: {
  q: "Camel trading：一串只有 <code>+</code> 與 <code>*</code> 的算式（沒有括號），可以<b>任意加括號</b>。求可能的<b>最大值與最小值</b>。",
  h: "看起來要枚舉所有加括號方式（卡塔蘭數量級），其實有<b>一句話的貪心</b>：<br>・<b>最大值</b>：讓<b>加法先做</b> ⇒ 以 <code>*</code> 切段，每段內的數字相加，再把各段乘起來。<br>・<b>最小值</b>：讓<b>乘法先做</b>（也就是一般的四則運算優先序）⇒ 以 <code>+</code> 切段，每段內相乘，再把各段相加。<br>直覺：所有數字都 ≥ 1，把數字先加起來再相乘會放大（<code>(a+b)·c ≥ a·c + b</code>），反之則縮小。<br>驗算：<code>1+2*3*4+5</code> ⇒ 最大 <code>(1+2)×3×(4+5) = 81</code> ✓、最小 <code>1 + 2×3×4 + 5 = 30</code> ✓。",
  t: "① <b>不要真的去枚舉括號</b>——12 個數字的卡塔蘭數已上萬，而且完全沒必要。<br>② 數字最大 20、最多 12 個 ⇒ 乘積可達 <code>20¹² ≈ 4 × 10¹⁵</code>，<b>必須 <code>long long</code></b>。<br>③ 這個貪心成立的前提是<b>所有數字都是正整數</b>（≥ 1），有 0 或負數就不成立。<br>④ 輸入是一整行沒有空白的算式，逐字元解析數字與運算子。<br>⑤ 輸出句子 <code>The maximum and minimum are X and Y.</code>，句尾有句號。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        string s; cin >> s;
        vector<ll> num;
        vector<char> op;
        ll cur = 0;
        for (size_t i = 0; i < s.size(); i++) {
            if (isdigit((unsigned char)s[i])) cur = cur * 10 + (s[i] - '0');
            else { num.push_back(cur); cur = 0; op.push_back(s[i]); }
        }
        num.push_back(cur);

        // 最大值：加法先做 → 以 '*' 切段，段內相加，段間相乘
        ll mx = 1, seg = num[0];
        for (size_t i = 0; i < op.size(); i++) {
            if (op[i] == '+') seg += num[i + 1];
            else { mx *= seg; seg = num[i + 1]; }
        }
        mx *= seg;

        // 最小值：乘法先做 → 以 '+' 切段，段內相乘，段間相加
        ll mn = 0; seg = num[0];
        for (size_t i = 0; i < op.size(); i++) {
            if (op[i] == '*') seg *= num[i + 1];
            else { mn += seg; seg = num[i + 1]; }
        }
        mn += seg;

        cout << "The maximum and minimum are " << mx << " and " << mn << ".\\n";
    }
    return 0;
}`
},

11850: {
  q: "Alaska：公路全長 <b>1422</b> 英里，電動車充飽電可跑 <b>200</b> 英里。給充電站的位置（從起點算起的里程），問能否從 0 開到 1422。",
  h: "只要檢查三件事，全部通過就是 POSSIBLE：<br>① <b>第一站 ≤ 200</b>（從起點滿電出發要到得了）<br>② <b>1422 − 最後一站 ≤ 200</b>（從最後一站要到得了終點）<br>③ <b>任兩個相鄰站的間距 ≤ 200</b><br>先排序再檢查即可，O(n log n)。<br>直覺：每到一站就充飽電，所以只要每一段（起點→第一站、站與站之間、最後一站→終點）都不超過續航力就一定可行；反之只要有一段超過就必定卡住。<b>這是「必要且充分」的條件，不需要任何搜尋或 DP</b>。",
  t: "① <b>輸入不保證已排序</b>，一定要先 sort（樣例就是亂序的）。<br>② 三個檢查缺一不可，最常漏的是<b>最後一站到終點</b>那一段。<br>③ 總長 1422、續航 200 都是<b>題目寫死的常數</b>。<br>④ 距離用 <code>double</code> 讀（位置可能是小數），比較時可留一點 eps。<br>⑤ 輸出全大寫 <code>POSSIBLE</code> / <code>IMPOSSIBLE</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<double> a(n);
        for (int i = 0; i < n; i++) cin >> a[i];
        sort(a.begin(), a.end());                      // 輸入不保證有序

        bool ok = (a[0] <= 200 + 1e-9) && (1422 - a[n - 1] <= 200 + 1e-9);
        for (int i = 1; i < n && ok; i++)
            if (a[i] - a[i - 1] > 200 + 1e-9) ok = false;
        cout << (ok ? "POSSIBLE" : "IMPOSSIBLE") << "\\n";
    }
    return 0;
}`
},

10920: {
  q: "Spiral Tap：<code>SZ × SZ</code> 的方格（SZ 是奇數、可達 100000），編號從<b>正中央</b>開始螺旋往外。給編號 P，輸出它的列與行。",
  h: "SZ 可到 100000 ⇒ 格子多達 10¹⁰，<b>絕對不能逐格模擬</b>。要用「先定位在第幾圈、再算圈內偏移」的兩段式：<br>① 第 k 圈（中心為第 0 圈）涵蓋編號 <code>(2k−1)² &lt; P ≤ (2k+1)²</code>，圈內有 <b>8k</b> 格。<br>② 圈的起點在中心正下方偏右一格：<code>(c+k, c+k−1)</code>，接著依序<br>　<b>左 (2k−1) 步 → 上 2k 步 → 右 2k 步 → 下 2k 步</b>（合計 8k−1 步，剛好繞回 <code>(c+k, c+k)</code>）。<br>算出圈內偏移後<b>用四段長度直接跳過去</b>，全程 O(1)（找 k 用 <code>sqrt</code> 後微調）。<br>驗算：<code>SZ=5, P=9</code> ⇒ k=1、偏移 7 ⇒ 下方走完 = <b>(4,4)</b> ✓；<code>P=10</code> ⇒ k=2 起點 <b>(5,4)</b> ✓。",
  t: "① <b>絕對不能逐格走</b>（10¹⁰ 格），但<b>可以逐圈走</b>（最多 5 萬圈）——若怕開根號誤差，用迴圈找 k 也完全來得及。<br>② 第一段是 <code>2k−1</code> 步（比其他三段少一步），因為起點已經算在圈內了。<br>③ 列與行都是 <b>1-based</b>。<br>④ P 可達 10¹⁰ ⇒ <b><code>long long</code></b>。<br>⑤ 輸出句子 <code>Line = L, column = C.</code>，句尾有句號。<br>⑥ <code>0 0</code> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll sz, p;
    while (cin >> sz >> p && (sz || p)) {
        ll c = (sz + 1) / 2;                           // 中心座標（1-based）
        if (p == 1) { cout << "Line = " << c << ", column = " << c << ".\\n"; continue; }

        ll k = (ll)((sqrt((double)p) - 1) / 2) + 1;    // 先估，再往上下微調
        while ((2 * k - 1) * (2 * k - 1) >= p) k--;
        while ((2 * k + 1) * (2 * k + 1) < p) k++;

        ll off = p - (2 * k - 1) * (2 * k - 1) - 1;    // 圈內 0-based 偏移
        ll r = c + k, col = c + k - 1;                 // 圈的起點
        ll seg[4] = {2 * k - 1, 2 * k, 2 * k, 2 * k};  // 左、上、右、下
        int dr[4] = {0, -1, 0, 1}, dc[4] = {-1, 0, 1, 0};
        for (int i = 0; i < 4 && off > 0; i++) {
            ll take = min(off, seg[i]);
            r += dr[i] * take; col += dc[i] * take;
            off -= take;
        }
        cout << "Line = " << r << ", column = " << col << ".\\n";
    }
    return 0;
}`
},

10014: {
  q: "Simple calculations：有一串 <code>a₀ … a₍ₙ₊₁₎</code> 滿足 <code>aᵢ = (aᵢ₋₁ + aᵢ₊₁)/2 − cᵢ</code>。給 <code>a₀</code>、<code>a₍ₙ₊₁₎</code> 與 <code>c₁…cₙ</code>，求 <code>a₁</code>。",
  h: "遞迴式看起來要解方程組，其實<b>換個變數就變成等差級數</b>：<br>把式子整理成 <code>aᵢ₊₁ = 2aᵢ − aᵢ₋₁ + 2cᵢ</code>，令<b>差分</b> <code>dᵢ = aᵢ − aᵢ₋₁</code>，則<br><code>dᵢ₊₁ = dᵢ + 2cᵢ</code>　⇒　<code>dᵢ₊₁ = d₁ + 2(c₁ + … + cᵢ)</code><br>再把所有差分加起來（望遠鏡和）：<br><code>a₍ₙ₊₁₎ − a₀ = (n+1)·d₁ + 2·Σ (n+1−i)·cᵢ</code><br>解出 <code>d₁</code>，答案 <code>a₁ = a₀ + d₁</code>。O(n)。<br>驗算樣例（n=1, a₀=50.50, a₂=25.50, c₁=10.15）：<code>d₁ = (25.50 − 50.50 − 20.30)/2 = −22.65</code> ⇒ <b>a₁ = 27.85</b> ✓。",
  t: "① <b>「令差分」是這類線性遞迴的萬用起手式</b>——把二階遞迴降成一階。<br>② 係數 <code>(n+1−i)</code> 是因為 <code>cᵢ</code> 會影響 <code>dᵢ₊₁ … d₍ₙ₊₁₎</code> 共 <code>n+1−i</code> 項。<br>③ 全程 <code>double</code>，輸出<b>兩位小數</b>（與輸入同格式）。<br>④ 測資之間要<b>空一行</b>。<br>⑤ n 可到 3000，O(n) 綽綽有餘。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cout << fixed << setprecision(2);
    int T; cin >> T;
    for (int tc = 0; tc < T; tc++) {
        int n; cin >> n;
        double a0, an1; cin >> a0 >> an1;
        double s = 0;
        for (int i = 1; i <= n; i++) {
            double c; cin >> c;
            s += (double)(n + 1 - i) * c;              // cᵢ 影響 n+1-i 個差分
        }
        double d1 = (an1 - a0 - 2 * s) / (n + 1);
        if (tc) cout << "\\n";
        cout << a0 + d1 << "\\n";
    }
    return 0;
}`
},

991: {
  q: "Safe Salutations：<code>2n</code> 個人圍成一圈握手（每人恰好握一次），問有幾種<b>握手的弦互不交叉</b>的方式。n ≤ 10。",
  h: "這是<b>卡塔蘭數</b>最經典的化身。<br>推導：固定第 1 個人，他與第 <code>2i+2</code> 個人握手，這條弦把圈分成兩半（左邊 <code>2i</code> 人、右邊 <code>2(n−1−i)</code> 人），兩邊<b>不能有弦跨越</b>（否則相交）⇒<br><code>C(n) = Σ C(i) · C(n−1−i)</code>，<code>C(0) = 1</code><br>正是卡塔蘭遞迴。n ≤ 10 ⇒ <code>C(10) = 16796</code>。<br>卡塔蘭數還會出現在：<b>合法括號序列、二元樹形狀、凸多邊形三角剖分、堆疊出棧順序</b>——看到「不交叉／不越界」幾乎都是它。",
  t: "① 遞迴式的兩半是 <code>C(i) × C(n−1−i)</code>，指標範圍別寫錯。<br>② 也可以用封閉式 <code>C(n) = C(2n, n)/(n+1)</code>，但 n 小時遞迴更不易出錯。<br>③ n ≤ 10 ⇒ int 就夠，但習慣上用 <code>long long</code>。<br>④ 輸出<b>每筆之後要空一行</b>（含最後一筆）。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll C[21];
    C[0] = 1;
    for (int n = 1; n <= 20; n++) {                    // 卡塔蘭遞迴
        C[n] = 0;
        for (int i = 0; i < n; i++) C[n] += C[i] * C[n - 1 - i];
    }
    int n;
    while (cin >> n) cout << C[n] << "\\n\\n";
    return 0;
}`
},

11683: {
  q: "Laser Sculpture：一塊高 H 的方塊分成 m 個直行，要雕成指定的高度 <code>h₁…h_m</code>。雷射<b>水平掃過</b>，每次只能連續開著削掉同一高度層的一段。求雷射<b>至少要開啟幾次</b>。",
  h: "把它想成「<b>從左往右走一遍，什麼時候需要重新按下開關</b>」：<br>雷射在某一層是連續開著的，只有當<b>這一行比前一行矮</b>（需要多削掉一些）時，才會產生新的、必須另外開一次的區段。<br>⇒ <code>答案 = Σ max(0, h[i−1] − h[i])</code>，其中 <code>h[0] = H</code>（左邊界外視為原始高度）。<br>一次掃描 O(m)，連陣列都可以不存。<br>這種「<b>只看相鄰差的正部分</b>」的計數方式，在「最少刷幾次油漆」「最少幾次區間加減」等題型會一再出現。",
  t: "① 起始的 <code>h[0]</code> 要設成 <b>H</b>（方塊原始高度），不是 0。<br>② 只累加<b>正的差</b>（變矮才需要新開一次；變高不需要）。<br>③ 高度可能是 <b>0</b>（整行削光）。<br>④ 讀到 EOF 結束。<br>⑤ 驗算樣例 <code>H=5, h = 1 2 3 2 0 3 4 5</code>：<code>4 + 1 + 2 = 7</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int H, m;
    while (cin >> H >> m) {
        long long ans = 0;
        int prev = H;                                  // 左邊界外視為原始高度
        for (int i = 0; i < m; i++) {
            int h; cin >> h;
            if (prev > h) ans += prev - h;             // 只算「變矮」的部分
            prev = h;
        }
        cout << ans << "\\n";
    }
    return 0;
}`
},

10115: {
  q: "Automatic Editing：給一串取代規則（找 A 換成 B），<b>依序</b>套用到一行文字上。每條規則要<b>反覆套用直到找不到為止</b>，才換下一條。",
  h: "直接照定義模擬，用 <code>string::find</code> + <code>string::replace</code>：<br><code>while ((pos = text.find(from)) != string::npos) text.replace(pos, from.size(), to);</code><br>注意 <code>find</code> 預設從<b>最左邊</b>開始找，正好符合題目「每次取代最左出現處」的語意。<br>樣例值得跟一遍（<code>banana boat</code> → 規則 1 反覆套用 → <code>bababa boat</code> → 規則 2 → <code>beba boat</code> → 規則 4 → <b><code>behind the goat</code></b> ✓），可以確認「反覆套用」與「依序」兩件事都有做到。",
  t: "① <b>每條規則要反覆套用到找不到為止</b>，不是只換一次——樣例的規則 1 就要套用兩次。<br>② 規則是<b>有先後順序</b>的，換完一條才換下一條，不能一起做。<br>③ 取代後產生的新字串<b>可能又符合同一條規則</b>（樣例正是如此），所以要用 <code>while</code> 而不是 <code>if</code>。<br>④ 字串<b>含空白</b>（例如 <code>ba b</code>），全部要用 <code>getline</code>。<br>⑤ 規則數為 <b>0</b> 時代表輸入結束。<br>⑥ 理論上規則可能造成無窮迴圈，但題目保證不會。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    while (cin >> n && n) {
        cin.ignore();
        vector<string> from(n), to(n);
        for (int i = 0; i < n; i++) { getline(cin, from[i]); getline(cin, to[i]); }
        string text; getline(cin, text);

        for (int i = 0; i < n; i++) {
            size_t pos;
            while ((pos = text.find(from[i])) != string::npos)      // 反覆套用
                text.replace(pos, from[i].size(), to[i]);
        }
        cout << text << "\\n";
    }
    return 0;
}`
},

11396: {
  q: "Claw Decomposition：一張圖能否被分解成若干個「爪」（一個中心點連出三條邊的星形 K₁,₃）？",
  h: "這題的價值全在<b>那個轉換</b>：<b>可分解成爪 ⟺ 圖是二分圖</b>。<br>直覺（必要性）：每條邊都屬於某個爪，爪的中心與葉子是兩種角色；同一個點<b>不可能既當中心又當葉子</b>（題目保證每點度數為 3 的倍數等條件下），於是「中心」與「葉子」構成一組二分染色。<br>⇒ 整題退化成<b>二分圖判定</b>：BFS/DFS 交替染色，若發現一條邊兩端同色就是 NO。<br>O(V + E)，V ≤ 300。<br>樣例的兩張圖都含三角形（奇環）⇒ 都不是二分圖 ⇒ 都輸出 NO ✓。",
  t: "① <b>看穿「= 二分圖判定」是唯一的難點</b>，看穿之後就是模板題。<br>② 圖<b>可能不連通</b>，每個未染色的點都要當起點跑一次。<br>③ 邊清單以 <code>0 0</code> 結束；<code>n = 0</code> 代表整份輸入結束。<br>④ 判定二分圖等價於<b>沒有奇環</b>，有三角形就一定不是。<br>⑤ 點編號 1-based。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n && n) {
        vector<vector<int> > adj(n + 1);
        int u, v;
        while (cin >> u >> v && (u || v)) {
            adj[u].push_back(v);
            adj[v].push_back(u);
        }
        vector<int> col(n + 1, -1);
        bool ok = true;
        for (int s = 1; s <= n && ok; s++) {           // 圖可能不連通
            if (col[s] != -1) continue;
            queue<int> q; q.push(s); col[s] = 0;
            while (!q.empty() && ok) {
                int x = q.front(); q.pop();
                for (size_t i = 0; i < adj[x].size(); i++) {
                    int y = adj[x][i];
                    if (col[y] == -1) { col[y] = col[x] ^ 1; q.push(y); }
                    else if (col[y] == col[x]) { ok = false; break; }
                }
            }
        }
        cout << (ok ? "YES" : "NO") << "\\n";
    }
    return 0;
}`
},

10901: {
  q: "Ferry Loading III：渡輪載客量 n、單程 t 分鐘，車子在<b>兩岸</b>各自排隊（給抵達時間與岸別）。渡輪一開始在左岸，求<b>每輛車</b>被送到對岸的時刻（依輸入順序輸出）。",
  h: "純模擬，把規則寫清楚就好。用兩個佇列存左右岸的車（記下<b>原始索引</b>好按輸入順序輸出）：<br>迴圈直到所有車都過河：<br>① 目前這岸有<b>已經抵達</b>的車 ⇒ 最多載 n 輛，<code>time += t</code>，這批車的答案就是新的 time，換岸。<br>② 否則對岸有已抵達的車 ⇒ <b>空船開過去</b>，<code>time += t</code>，換岸。<br>③ 兩岸都沒車在等 ⇒ <b>時間快轉</b>到剩餘車輛中最早的抵達時刻。<br>樣例逐輪驗算：10 / 30 30 / 50 50 / 70 70 / 90 90 / 110 ✓，正好對上「載完就得空船回來接下一批」的節奏。",
  t: "① 「<b>已經抵達</b>」的判斷是 <code>arrive ≤ time</code>，不能把還沒到的車先載走。<br>② 三種情形<b>缺一不可</b>，尤其是「空船去對岸接人」與「時間快轉」。<br>③ 沒有時間快轉會<b>無窮迴圈</b>（兩岸都沒人在等時）。<br>④ 答案要<b>依輸入順序</b>輸出 ⇒ 佇列裡要帶原始索引。<br>⑤ 測資之間要<b>空一行</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int tc = 0; tc < T; tc++) {
        ll n, t; int m;
        cin >> n >> t >> m;
        queue<pair<ll, int> > side[2];                 // 0 = left, 1 = right
        for (int i = 0; i < m; i++) {
            ll a; string s; cin >> a >> s;
            side[s == "left" ? 0 : 1].push(make_pair(a, i));
        }
        vector<ll> ans(m);
        ll time_ = 0; int cur = 0, left_ = m;
        while (left_ > 0) {
            if (!side[cur].empty() && side[cur].front().first <= time_) {
                time_ += t;                            // 載人過河
                for (ll k = 0; k < n && !side[cur].empty()
                        && side[cur].front().first <= time_ - t; k++) {
                    ans[side[cur].front().second] = time_;
                    side[cur].pop(); left_--;
                }
                cur ^= 1;
            } else if (!side[cur ^ 1].empty() && side[cur ^ 1].front().first <= time_) {
                time_ += t; cur ^= 1;                  // 空船去對岸接人
            } else {                                   // 兩岸都沒人在等 → 快轉
                ll nxt = LLONG_MAX;
                if (!side[0].empty()) nxt = min(nxt, side[0].front().first);
                if (!side[1].empty()) nxt = min(nxt, side[1].front().first);
                time_ = max(time_, nxt);
            }
        }
        if (tc) cout << "\\n";
        for (int i = 0; i < m; i++) cout << ans[i] << "\\n";
    }
    return 0;
}`
},

10297: {
  q: "Beavergnaw：海狸把直徑與高皆為 <code>D</code> 的圓柱樹幹，啃成「<b>兩個圓錐台 + 中間一段直徑與高皆為 d 的圓柱</b>」。給 D 與<b>啃掉的體積 V</b>，求 d（3 位小數）。",
  h: "純粹推公式，用圓錐台體積 <code>V = πh(R² + Rr + r²)/3</code>：<br>剩下的形狀 = 兩個高 <code>(D−d)/2</code>、半徑 <code>D/2 → d/2</code> 的圓錐台 + 高 d 半徑 d/2 的圓柱：<br><code>剩下 = π(D−d)(D²+Dd+d²)/12 + πd³/4 = π(D³ + 2d³)/12</code><br>啃掉的 = 原圓柱 <code>πD³/4</code> 減去剩下的：<br><code>V = πD³/4 − π(D³+2d³)/12 = π(D³ − d³)/6</code><br>⇒ <b><code>d = ∛(D³ − 6V/π)</code></b><br>驗算：<code>D=10, V=250</code> ⇒ <code>d³ = 1000 − 1500/π = 522.54</code> ⇒ <b>8.054</b> ✓；<code>D=20, V=2500</code> ⇒ <b>14.775</b> ✓。",
  t: "① 推導時<b>圓柱那一段的高等於它的直徑 d</b>（題目說「直徑與高相同」），這是化簡的關鍵。<br>② 中間那些交叉項會漂亮地消掉，最後只剩 <code>D³ − d³</code>，如果推出來很醜就是哪裡算錯了。<br>③ 開立方根用 <code>cbrt()</code>；用 <code>pow(x, 1.0/3)</code> 在 x 為負時會出問題（本題 x 恆正，但習慣要好）。<br>④ π 用 <code>acos(-1.0)</code>。<br>⑤ <code>0 0</code> 結束，輸出 3 位小數。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cout << fixed << setprecision(3);
    const double PI = acos(-1.0);
    double D, V;
    while (cin >> D >> V && (D || V))
        cout << cbrt(D * D * D - 6 * V / PI) << "\\n";  // V = π(D³ − d³)/6
    return 0;
}`
},

1210: {
  q: "連續質數之和：給 n（≤ 10000），問它有幾種寫成<b>一個或多個連續質數之和</b>的方式。例如 53 = 5+7+11+13+17 = 53，共 2 種。",
  h: "先用<b>篩法</b>求出 10000 以內的所有質數（1229 個），再用<b>滑動視窗／前綴和</b>數出所有連續區段的和。<br>最有效率的做法是<b>一次把所有答案算好</b>：對每個起點 i，往右累加，只要和 ≤ 10000 就把 <code>ans[和]++</code>，超過就換下一個起點。<br>總運算量約「質數個數 × 平均區段長」≈ 幾萬次，之後每筆詢問 O(1)。<br>（也可以用雙指標，但因為要對<b>所有</b> n 建表，直接雙層迴圈更直觀。）",
  t: "① <b>預處理所有 n 的答案</b>，不要每筆詢問重掃一次。<br>② 單獨一個質數<b>也算一種</b>表示法（長度 1 的區段）。<br>③ 累加時一超過 10000 就要 <code>break</code>，否則會多做很多無用功。<br>④ 篩到 10000 就夠（區段裡的質數都 ≤ n）。<br>⑤ 輸入以 <b>0</b> 結束。<br>⑥ 驗算：17 → 2（17、2+3+5+7）、41 → 3、20 → 0 ✓。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const int MX = 10000;
    vector<char> comp(MX + 1, 0);
    vector<int> pr;
    for (int i = 2; i <= MX; i++) {
        if (!comp[i]) pr.push_back(i);
        for (long long j = (long long)i * i; j <= MX; j += i) comp[j] = 1;
    }
    vector<int> ans(MX + 1, 0);
    for (size_t i = 0; i < pr.size(); i++) {           // 一次把所有答案建好
        int s = 0;
        for (size_t j = i; j < pr.size(); j++) {
            s += pr[j];
            if (s > MX) break;
            ans[s]++;
        }
    }
    int n;
    while (cin >> n && n) cout << ans[n] << "\\n";
    return 0;
}`
}
};

/* 二星題庫（第八批 12 題） */
const SOL25 = {
10100: {
  q: "Longest Match：每兩行為一組，把每行拆成<b>單字</b>（連續的英文字母，標點與空白當分隔），求兩行單字序列的<b>最長共同子序列長度</b>。任一行沒有單字就輸出 <code>Blank!</code>",
  h: "拆完單字後就是<b>以「單字」為元素的 LCS</b>——跟 10405 完全一樣，只是比較的單位從字元變成字串。<br>拆單字最乾淨的寫法：掃過整行，遇到 <code>isalpha</code> 就往目前的單字後面接，遇到非字母就把累積的單字收進 vector 並清空（記得<b>迴圈結束後還要收一次尾巴</b>）。<br>行長不超過 1000，LCS 是 O(單字數²)，毫無壓力。",
  t: "① <b>分隔符不只是空白</b>，任何非字母（數字、標點）都算，<code>late-breaking</code> 要拆成 <code>late</code> 與 <code>breaking</code>。<br>② 拆字迴圈<b>結束後要再收一次尾巴</b>，否則最後一個單字會漏掉。<br>③ 任一行沒有單字（空行或全是標點）⇒ 輸出 <code>Blank!</code>，<b>不是輸出 0</b>。<br>④ 案號要<b>靠右對齊、寬度 2</b>（<code>setw(2)</code>）。<br>⑤ 用 <code>getline</code> 讀行，空行也要正常讀進來、不能當 EOF。",
  c: `#include <bits/stdc++.h>
using namespace std;

vector<string> words(const string &s) {
    vector<string> w;
    string cur;
    for (size_t i = 0; i < s.size(); i++) {
        if (isalpha((unsigned char)s[i])) cur += s[i];
        else if (!cur.empty()) { w.push_back(cur); cur.clear(); }
    }
    if (!cur.empty()) w.push_back(cur);                // 別漏掉最後一個單字
    return w;
}

int main() {
    string l1, l2;
    int cs = 1;
    while (getline(cin, l1)) {
        if (!getline(cin, l2)) break;
        vector<string> a = words(l1), b = words(l2);
        cout << setw(2) << cs++ << ". ";
        if (a.empty() || b.empty()) { cout << "Blank!\\n"; continue; }
        int n = a.size(), m = b.size();
        vector<vector<int> > dp(n + 1, vector<int>(m + 1, 0));
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= m; j++)
                dp[i][j] = (a[i - 1] == b[j - 1]) ? dp[i - 1][j - 1] + 1
                                                  : max(dp[i - 1][j], dp[i][j - 1]);
        cout << "Length of longest match: " << dp[n][m] << "\\n";
    }
    return 0;
}`
},

10959: {
  q: "The Party, Part I：n 個人、m 段跳舞關係（無向），主人是 0 號。輸出 1..n−1 每個人的「Giovanni 數」——也就是<b>到 0 號的最短距離</b>。",
  h: "邊權全為 1 的最短路 ⇒ <b>BFS 一次搞定</b>，從 0 號出發逐層擴展，第一次被訪問到的層數就是答案。<br>這題就是「<b>Erdős 數</b>」的翻版，也是 BFS 最原始的用途。<br>用 <code>dist</code> 陣列兼作 visited（初值 −1），入列時就設好距離，可以少一個陣列也不會重複入列。<br>O(n + m)。",
  t: "① BFS 要在<b>入列時</b>設距離／標記，不是出列時，否則同一點會被推進佇列多次。<br>② 邊是<b>無向</b>的，兩個方向都要加。<br>③ 只輸出 <b>1 到 n−1</b>，不含 0 號自己。<br>④ 測資之間要<b>空一行</b>。<br>⑤ 題目保證連通（否則要考慮輸出無限大，本題不必）。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int tc = 0; tc < T; tc++) {
        int n, m; cin >> n >> m;
        vector<vector<int> > adj(n);
        for (int i = 0; i < m; i++) {
            int a, b; cin >> a >> b;
            adj[a].push_back(b);
            adj[b].push_back(a);
        }
        vector<int> d(n, -1);
        queue<int> q; q.push(0); d[0] = 0;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (size_t i = 0; i < adj[u].size(); i++) {
                int v = adj[u][i];
                if (d[v] == -1) { d[v] = d[u] + 1; q.push(v); }   // 入列時就設距離
            }
        }
        if (tc) cout << "\\n";
        for (int i = 1; i < n; i++) cout << d[i] << "\\n";
    }
    return 0;
}`
},

10264: {
  q: "The Most Potent Corner：N 維單位立方體（N &lt; 15）每個頂點有權重。兩頂點<b>相鄰</b>= 只差一個座標位元。頂點的「潛能」= <b>所有相鄰頂點的權重和</b>。求<b>一對相鄰頂點</b>的潛能和最大值。",
  h: "關鍵是把頂點編號當成 <b>N 位元的二進位數</b>：<code>(0,…,0,1)</code> 就是 1、<code>(0,…,1,0)</code> 就是 2 …，正好對應題目給的「自然順序」。<br>於是「相鄰」= <b>差一個位元</b> = <code>u ^ (1 &lt;&lt; k)</code>。<br>兩步：<br>① 對每個頂點 u，<code>pot[u] = Σ w[u ^ (1&lt;&lt;k)]</code>，共 <code>2ᴺ × N</code> 次運算。<br>② 對每條邊（u, u^(1&lt;&lt;k)）取 <code>pot[u] + pot[v]</code> 的最大值，同樣 <code>2ᴺ × N</code>。<br>N = 14 ⇒ 16384 × 14 ≈ 23 萬，瞬殺。<br><b>「用 XOR 表示超立方體的相鄰關係」是位元運算最漂亮的應用之一</b>，狀態壓縮題經常用到。",
  t: "① 頂點順序就是<b>二進位遞增</b>，直接照讀入順序當索引即可，不用另外換算。<br>② 潛能是<b>鄰居的權重和</b>，<b>不含自己</b>。<br>③ 求的是「兩個<b>相鄰</b>頂點」的潛能和，不是任意兩點的最大值相加。<br>④ 權重 &lt; 256、N &lt; 15 ⇒ 潛能 &lt; 256 × 14，兩個相加也遠在 int 範圍內。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n) {
        int m = 1 << n;
        vector<int> w(m);
        for (int i = 0; i < m; i++) cin >> w[i];

        vector<int> pot(m, 0);
        for (int u = 0; u < m; u++)
            for (int k = 0; k < n; k++)
                pot[u] += w[u ^ (1 << k)];              // 相鄰 = 差一個位元

        int best = 0;
        for (int u = 0; u < m; u++)
            for (int k = 0; k < n; k++)
                best = max(best, pot[u] + pot[u ^ (1 << k)]);
        cout << best << "\\n";
    }
    return 0;
}`
},

10223: {
  q: "How many nodes?：給「用某個節點數能組出的相異二元樹總數」，反推<b>節點數</b>。",
  h: "n 個節點的相異二元樹數目就是<b>卡塔蘭數</b> <code>C(n)</code>：<br><code>C(n) = Σ C(i)·C(n−1−i)</code>（枚舉左子樹放 i 個節點）<br>題目給的上界是 <code>4294967295</code>（2³² − 1），而 <code>C(19) = 1767263190</code>、<code>C(20) = 6564120420</code> 已超過 ⇒ <b>n 最多 19</b>。<br>所以<b>把 C(1)…C(19) 先算好，查表即可</b>，O(1)。<br>這種「反查表」題型的通則：先估出答案的上界，再把整張表建出來。",
  t: "① 上限 2³² − 1 ⇒ 用 <code>unsigned long long</code> 或 <code>long long</code> 建表（<code>C(20)</code> 已超過 32 位）。<br>② 題目保證輸入一定是某個卡塔蘭數，不用處理找不到的情況（保險起見仍可加判斷）。<br>③ 卡塔蘭數列：1, 2, 5, 14, 42, 132, 429, …，對應 n = 1, 2, 3, 4, 5, …（本題 <code>C(1) = 1</code>）。<br>④ 樣例 14 → 4、42 → 5，可以直接驗表有沒有對齊。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef unsigned long long ull;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ull C[25];
    C[0] = 1;
    for (int n = 1; n <= 22; n++) {                     // 卡塔蘭遞迴
        C[n] = 0;
        for (int i = 0; i < n; i++) C[n] += C[i] * C[n - 1 - i];
    }
    ull x;
    while (cin >> x) {
        for (int n = 1; n <= 22; n++)
            if (C[n] == x) { cout << n << "\\n"; break; }
    }
    return 0;
}`
},

10311: {
  q: "Goldbach and Euler：給 <code>n ≤ 10⁸</code>，把它寫成<b>兩個質數之和</b>並輸出（第一個質數要盡量小）；寫不出來就輸出 <code>n is not the sum of two primes!</code>",
  h: "n 到 10⁸，<b>不可能篩到 n</b>，但可以只篩到 <code>√n = 10⁴</code>：<br>① 先用一般篩法求出 10⁴ 以內的 1229 個質數，用來做<b>試除法質數判定</b>（判斷 ≤ 10⁸ 的數只需除到 10⁴）。<br>② 由小到大枚舉第一個質數 <code>p</code>，檢查 <code>n − p</code> 是否為質數，第一個成功的就是答案（第一個質數最小）。<br>由於哥德巴赫猜想在這個範圍內成立，偶數幾乎<b>試幾次就會中</b>。<br><b>奇數的情形要特別想</b>：奇 = 質 + 質 只可能是 <code>2 + (n−2)</code>（其他兩質數都是奇數，和為偶），所以只要檢查 <code>n − 2</code> 是不是質數。",
  t: "① <b>奇數只有一種可能</b>（2 + 奇質數），想通這點可以省掉大量枚舉，也解釋了樣例 <code>11 → 不是</code>（9 不是質數）。<br>② 篩到 <code>√(10⁸) = 10⁴</code> 就夠做試除判定。<br>③ n 可能 &lt; 4（例如 2、3），這時無解。<br>④ 輸出兩種句子的措辭與標點要抄對（一個驚嘆號、一個句號）。<br>⑤ 最多 10 萬行輸入 ⇒ 要 <code>sync_with_stdio(false)</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

vector<int> pr;

bool isPrime(ll x) {
    if (x < 2) return false;
    for (size_t i = 0; i < pr.size() && (ll)pr[i] * pr[i] <= x; i++)
        if (x % pr[i] == 0) return false;
    return true;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const int LIM = 10000;
    vector<char> comp(LIM + 1, 0);
    for (int i = 2; i <= LIM; i++) {
        if (comp[i]) continue;
        pr.push_back(i);
        for (ll j = (ll)i * i; j <= LIM; j += i) comp[j] = 1;
    }

    ll n;
    while (cin >> n) {
        ll a = 0, b = 0;
        if (n % 2 == 1) {                               // 奇數只可能是 2 + 奇質數
            if (n > 4 && isPrime(n - 2)) { a = 2; b = n - 2; }
        } else {
            for (size_t i = 0; i < pr.size(); i++) {
                if (pr[i] * 2 > n) break;
                if (isPrime(n - pr[i])) { a = pr[i]; b = n - pr[i]; break; }
            }
        }
        if (a) cout << n << " is the sum of " << a << " and " << b << ".\\n";
        else cout << n << " is not the sum of two primes!\\n";
    }
    return 0;
}`
},

11520: {
  q: "Fill the Square：<code>n × n</code> 格子部分已填大寫字母，其餘要填滿，使得<b>上下左右相鄰的格子字母不同</b>，且整體<b>字典序最小</b>（依由上到下、由左到右讀出的順序）。",
  h: "「字典序最小」＋「每格的選擇只受<b>已確定的鄰居</b>影響」⇒ <b>由左上往右下逐格貪心填最小可用字母</b>就是最優解。<br>為什麼貪心成立？因為填第 k 格時，只有<b>左邊與上面</b>的格子已定（它們排在字典序更前面、不能再改），而右邊與下面還沒填、永遠可以配合（字母有 26 個、鄰居最多 4 個，必定填得下去）。<br>所以每格只要從 <code>'A'</code> 開始試，跳過與左、上、右、下<b>已填</b>格子相同的字母即可。<br>O(n² × 26)。",
  t: "① 檢查鄰居時，<b>右邊與下面已經填好的格子也要避開</b>（它們可能是題目給定的），只跳過左上是不夠的。<br>② 貪心的順序必須是<b>由上到下、由左到右</b>，跟字典序的定義一致。<br>③ 空格用 <code>.</code> 表示。<br>④ 輸出先印 <code>Case k:</code> 再印格子。<br>⑤ 驗算樣例 2（中間有個固定的 <code>A</code>）：答案是 <code>BAB / ABA / BAB</code>，可以檢查有沒有正確避開已填字母。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int tc = 1; tc <= T; tc++) {
        int n; cin >> n;
        vector<string> g(n);
        for (int i = 0; i < n; i++) cin >> g[i];

        int dx[] = {0, 0, 1, -1}, dy[] = {1, -1, 0, 0};
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) {
                if (g[i][j] != '.') continue;
                for (char c = 'A'; ; c++) {
                    bool ok = true;
                    for (int k = 0; k < 4; k++) {       // 四個方向「已填」的都要避開
                        int x = i + dx[k], y = j + dy[k];
                        if (x < 0 || y < 0 || x >= n || y >= n) continue;
                        if (g[x][y] == c) { ok = false; break; }
                    }
                    if (ok) { g[i][j] = c; break; }
                }
            }
        cout << "Case " << tc << ":\\n";
        for (int i = 0; i < n; i++) cout << g[i] << "\\n";
    }
    return 0;
}`
},

10820: {
  q: "Send a Table：對所有 <code>1 ≤ x, y ≤ n</code>，若 <code>f(x, y)</code> 只跟 <code>x : y</code> 的比例有關，則只需為<b>互質</b>的 (x, y) 預先算好。求需要預算幾組。",
  h: "答案 = <code>#{(x, y) : 1 ≤ x, y ≤ n, gcd(x, y) = 1}</code>。<br>把它拆成「x &lt; y」「x &gt; y」「x = y = 1」三塊：對每個 <code>y</code>，比它小且與它互質的 x 共有 <code>φ(y)</code> 個 ⇒<br><code>答案 = 1 + 2 × Σ_{i=2..n} φ(i)</code><br>用<b>線性／埃氏篩法一次算出所有 φ</b>（<code>phi[i]</code> 初始化為 i，對每個質數 p 把它的倍數乘上 <code>(p−1)/p</code>），再做前綴和，之後每筆詢問 O(1)。<br>n ≤ 50000，篩 + 前綴和只需幾毫秒。",
  t: "① <b>要預處理 φ 的前綴和</b>，最多 600 筆詢問若每筆重算會慢。<br>② 別忘了那個 <code>+1</code>（(1,1) 自己）與 <code>×2</code>（對稱的兩半）。<br>③ 篩 φ 的寫法：<code>phi[i] = i</code> 起始，遇到 <code>phi[i] == i</code>（代表 i 是質數）就把所有 i 的倍數 <code>phi[j] -= phi[j] / i</code>。<br>④ 答案可達 <code>50000² × 0.6</code> ≈ 15 億 ⇒ <b><code>long long</code></b>。<br>⑤ 輸入以 <code>0</code> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const int MX = 50000;
    vector<int> phi(MX + 1);
    for (int i = 0; i <= MX; i++) phi[i] = i;
    for (int i = 2; i <= MX; i++)
        if (phi[i] == i)                                // i 是質數
            for (int j = i; j <= MX; j += i) phi[j] -= phi[j] / i;

    vector<ll> pre(MX + 1, 0);
    for (int i = 2; i <= MX; i++) pre[i] = pre[i - 1] + phi[i];

    int n;
    while (cin >> n && n) cout << 1 + 2 * pre[n] << "\\n";
    return 0;
}`
},

10167: {
  q: "Birthday Cake：半徑 100 的圓形蛋糕上有 <code>2N</code> 顆櫻桃（座標為整數）。要找一條<b>過原點的直線</b> <code>Ax + By = 0</code>，把櫻桃分成<b>各 N 顆</b>的兩半，且<b>不能有櫻桃落在線上</b>。輸出任一組整數 A、B。",
  h: "題目已經幫你把搜尋空間縮到極小：<b>A、B 只要在 [−50, 50] 之間找就一定有解</b>（這是題目的保證），所以直接<b>暴力枚舉</b>：<br>對每組 (A, B)（不同時為 0），掃過所有櫻桃計算 <code>A·x + B·y</code> 的正負：<br>・有任何一顆等於 0 ⇒ 這條線不合法<br>・正的顆數恰為 N ⇒ 輸出<br>複雜度 101 × 101 × 100 ≈ 100 萬，瞬殺。<br><b>看到「輸出任一組解」＋「係數範圍很小」就該想到暴力枚舉</b>——這是競賽題常見的暗示。",
  t: "① 必須排除 <code>A = B = 0</code>（那不是一條直線）。<br>② <b>不能有櫻桃剛好在線上</b>（<code>A·x + B·y == 0</code>），這個檢查很容易漏。<br>③ 只要數「正的那一半是不是 N 顆」即可，另一半自然也是 N 顆（前提是沒有落在線上的）。<br>④ 座標是<b>整數</b>，全程整數運算，沒有浮點誤差問題。<br>⑤ 題目保證有解；多解時輸出任一組。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;                                // 櫻桃共有 2n 顆
        vector<int> x(2 * n), y(2 * n);
        for (int i = 0; i < 2 * n; i++) cin >> x[i] >> y[i];

        for (int A = -50; A <= 50; A++) {
            bool done = false;
            for (int B = -50; B <= 50 && !done; B++) {
                if (!A && !B) continue;                 // 不是直線
                int pos = 0; bool onLine = false;
                for (int i = 0; i < 2 * n; i++) {
                    int v = A * x[i] + B * y[i];
                    if (v == 0) { onLine = true; break; }   // 不能有櫻桃在線上
                    if (v > 0) pos++;
                }
                if (!onLine && pos == n) {
                    cout << A << " " << B << "\\n";
                    done = true;
                }
            }
            if (done) break;
        }
    }
    return 0;
}`
},

10910: {
  q: "Marks Distribution：某生 N 科總分 T，且<b>每科至少 P 分</b>（都及格）。問有幾種可能的分數組合？",
  h: "經典的<b>隔板法（stars and bars）</b>。<br>先讓每科都先拿走 P 分（保證及格），剩下 <code>R = T − N·P</code> 分可以<b>任意</b>分給 N 科（可以是 0）。<br>把 R 顆星排成一列，插入 <code>N−1</code> 塊隔板切成 N 段 ⇒<br><code>答案 = C(R + N − 1, N − 1)</code><br>驗算：<code>N=3, T=34, P=10</code> ⇒ R = 4 ⇒ <code>C(6, 2) = 15</code> ✓。<br>算組合數時用<b>邊乘邊除</b>的寫法（<code>ans = ans * (a−i) / (i+1)</code>），可以避免先算出巨大的階乘再相除。",
  t: "① 一定要先<b>扣掉每科的下限 P</b>，把「至少 P」轉成「至少 0」，隔板法才適用。<br>② 若 <code>T &lt; N·P</code> ⇒ 無解，答案 0（雖然題目通常保證有解，仍該判）。<br>③ 組合數用<b>逐項乘除</b>：因為連續 i+1 個整數的乘積必定被 (i+1)! 整除，過程中一定整除、不會失真。<br>④ 答案可能很大，用 <code>long long</code>。<br>⑤ 第一行是測資數。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

ll comb(ll a, ll b) {                                   // C(a, b)，邊乘邊除
    if (b < 0 || b > a) return 0;
    b = min(b, a - b);
    ll r = 1;
    for (ll i = 0; i < b; i++) r = r * (a - i) / (i + 1);
    return r;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        ll n, t, p; cin >> n >> t >> p;
        ll R = t - n * p;                               // 扣掉每科的下限
        cout << (R < 0 ? 0 : comb(R + n - 1, n - 1)) << "\\n";
    }
    return 0;
}`
},

10489: {
  q: "Boxes of Chocolates：每個盒子裡可能套著更小的盒子（層層相套），最小的盒子裡才有巧克力。一行描述一個盒子：<code>K a₁ a₂ … a_K</code>，表示每層各有幾個盒子、<b>最後一個數是最小盒裡的巧克力數</b>。求全部巧克力平分給 f 個朋友後<b>剩下幾顆</b>。",
  h: "每個盒子的巧克力總數就是<b>那一行所有數字的乘積</b> <code>a₁ × a₂ × … × a_K</code>。<br>但 <code>K</code> 可達 10000、每個數可達 100 ⇒ 乘積是 <code>100^10000</code>，<b>大數都放不下</b>！<br>關鍵：題目只要<b>餘數</b> ⇒ 全程<b>邊乘邊取模</b>：<br><code>prod = prod × aᵢ % f</code><br>再把各盒的餘數加起來再取模。因為模運算對乘法與加法都是「可以隨時取模」的，結果完全正確。<br>O(總數字量)，完全不用大數。",
  t: "① <b>絕對不能真的算出乘積</b>——這是本題唯一的陷阱，也是「模運算可以邊算邊取」最好的示範。<br>② 每行的<b>最後一個數也是乘數</b>（它是最小盒的巧克力數），一起乘進去就對了。<br>③ 第一個數是 f（朋友數）、第二個才是盒子數，順序別讀反。<br>④ f &lt; 101 ⇒ 中間值最大 100 × 100，int 就夠。<br>⑤ f 可能是 1（餘數必為 0）。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        ll f; int b;
        cin >> f >> b;
        ll total = 0;
        for (int i = 0; i < b; i++) {
            int k; cin >> k;
            ll prod = 1;
            for (int j = 0; j <= k; j++) {              // K 個數 + 最後的巧克力數
                ll a; cin >> a;
                prod = prod * a % f;                    // 邊乘邊取模
            }
            total = (total + prod) % f;
        }
        cout << total << "\\n";
    }
    return 0;
}`
},

10916: {
  q: "Factstone Benchmark：1960 年是 4 位元電腦，之後<b>每十年位元數加倍</b>（1970 = 8、1980 = 16、1990 = 32、2000 = 64…）。給年份，求<b>最大的 n</b> 使得 <code>n!</code> 塞得進當年的字組。",
  h: "位元數 <code>bits = 4 × 2^((year − 1960) / 10)</code>（十年一階，用整數除法取階）。<br>條件是 <code>n! &lt; 2^bits</code>，直接算 <code>n!</code> 完全不可行（bits 可達數百萬）⇒ <b>兩邊取以 2 為底的對數</b>：<br><code>Σ_{i=1..n} log₂(i) &lt; bits</code><br>於是從 n = 1 開始累加 <code>log2(i)</code>，直到超過 bits 為止。<br>驗算：1960 ⇒ bits = 4，<code>log₂(3!) = 2.58 &lt; 4</code>、<code>log₂(4!) = 4.58 &gt; 4</code> ⇒ <b>3</b> ✓；1981 ⇒ bits = 16，<code>log₂(8!) = 15.3 &lt; 16</code>、<code>log₂(9!) = 18.5</code> ⇒ <b>8</b> ✓。<br><b>「連乘爆掉就取對數變連加」</b>是處理大數比較的萬用招式。",
  t: "① <b>取對數</b>是本題的核心——直接乘會爆，用大數又太慢。<br>② 年份要<b>先取十年一階</b>（<code>(year − 1960) / 10</code> 的整數除法），1981 與 1989 都算 1980 那一階。<br>③ 位元數可達 4 × 2²⁰，<code>bits</code> 用 <code>double</code> 或 <code>long long</code> 存都行。<br>④ 浮點累加會有微小誤差，但本題的邊界不會卡在剛好相等，安全。<br>⑤ 輸入以 <code>0</code> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int y;
    while (cin >> y && y) {
        int dec = (y - 1960) / 10;                      // 十年一階
        double bits = 4.0 * pow(2.0, dec);
        double sum = 0;
        long long n = 0;
        while (sum + log2((double)(n + 1)) < bits) {    // log2(n!) < bits
            n++;
            sum += log2((double)n);
        }
        cout << n << "\\n";
    }
    return 0;
}`
},

10926: {
  q: "How Many Dependencies?：n 個任務，每個任務列出它<b>直接依賴</b>的任務。若 A 依賴 B、B 依賴 C，則 A 有兩個依賴。求<b>依賴數最多</b>的任務編號（平手取編號最小）。",
  h: "「直接或間接依賴」= <b>有向圖上從該點可達的所有點</b>（不含自己）⇒ 對每個任務跑一次 <b>DFS／BFS 數可達點</b>。<br>n ≤ 100 ⇒ 最多 100 次遍歷、每次 O(n + m)，總量極小，<b>不需要任何優化</b>（若 n 很大才需要考慮傳遞閉包或 bitset）。<br>找最大值時用<b>嚴格大於</b>更新，就自動滿足「平手取編號最小」。<br>（若要一次算完所有點，也可以用 <code>bitset&lt;100&gt;</code> 做傳遞閉包：<code>reach[u] |= reach[v]</code>，配合拓撲序即可。）",
  t: "① 依賴是<b>有向</b>的，而且要算<b>間接</b>的（可達性），不是只數直接鄰居。<br>② 計數<b>不含自己</b>。<br>③ 平手取編號小 ⇒ 更新條件用<b>嚴格大於</b>，並從編號小的開始掃。<br>④ 每次遍歷都要<b>重置 visited</b>。<br>⑤ 輸入以 <code>n = 0</code> 結束；輸出只印<b>任務編號</b>（不是依賴數）。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n && n) {
        vector<vector<int> > adj(n + 1);
        for (int i = 1; i <= n; i++) {
            int k; cin >> k;
            adj[i].resize(k);
            for (int j = 0; j < k; j++) cin >> adj[i][j];
        }
        int best = -1, bestId = 1;
        for (int s = 1; s <= n; s++) {
            vector<char> vis(n + 1, 0);
            stack<int> st; st.push(s); vis[s] = 1;
            int cnt = 0;
            while (!st.empty()) {
                int u = st.top(); st.pop();
                for (size_t i = 0; i < adj[u].size(); i++) {
                    int v = adj[u][i];
                    if (!vis[v]) { vis[v] = 1; cnt++; st.push(v); }
                }
            }
            if (cnt > best) { best = cnt; bestId = s; }   // 嚴格大於 → 平手取小
        }
        cout << bestId << "\\n";
    }
    return 0;
}`
}
};

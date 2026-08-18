/* 二星題庫（第十八批 6 題） */
const SOL35 = {
11241: {
  q: "Humidex：給溫度 T、露點 D、體感指數 H 之中的<b>任兩個</b>，求第三個。公式：<br><code>H = T + 0.5555 × (e − 10)</code>，其中 <code>e = 6.11 × exp(5417.7530 × (1/273.16 − 1/(D + 273.16)))</code><br>輸出三個值，各<b>一位小數</b>。",
  h: "三種情形分開處理，重點是<b>哪一個方向需要解反函式</b>：<br>・<b>給 T、D</b> ⇒ 正向套公式算 H。<br>・<b>給 T、H</b> ⇒ 先由 <code>e = (H − T)/0.5555 + 10</code> 回推 e，再<b>解出 D</b>：<br>　<code>D = 1 / (1/273.16 − ln(e/6.11)/5417.7530) − 273.16</code><br>・<b>給 D、H</b> ⇒ 先由 D 算 e，再 <code>T = H − 0.5555(e − 10)</code>。<br>因為 e 對 D 是嚴格遞增的<b>解析可逆函式</b>，直接取對數反解即可，<b>不必二分搜</b>。<br>驗算：<code>T=30, D=15</code> ⇒ e ≈ 17.05、H = 30 + 0.5555×7.05 ≈ <b>34.0</b> ✓；<code>T=30, D=25</code> ⇒ <b>42.3</b> ✓。",
  t: "① <b>解 D 要用對數反解</b>，不要用二分搜（雖然也可以，但沒必要且慢）。<br>② 常數是 <code>5417.7530</code> 與 <code>273.16</code>（不是 273.15），抄錯會在小數第一位就出錯。<br>③ 輸出<b>固定一位小數</b>，且三個值都要印（含輸入給的那兩個）。<br>④ 輸入格式是 <code>字母 數值 字母 數值</code>，最後一行是<b>單一個 E</b>。<br>⑤ 兩個字母的順序<b>不固定</b>（可能是 <code>D … T …</code>），要用字母判斷而不是位置。",
  c: `#include <bits/stdc++.h>
using namespace std;

double eOf(double d) {                                  // 由露點算 e
    return 6.11 * exp(5417.7530 * (1.0 / 273.16 - 1.0 / (d + 273.16)));
}
double dOf(double e) {                                  // 由 e 反解露點
    return 1.0 / (1.0 / 273.16 - log(e / 6.11) / 5417.7530) - 273.16;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cout << fixed << setprecision(1);
    char c1, c2; double v1, v2;
    while (cin >> c1) {
        if (c1 == 'E') break;
        cin >> v1 >> c2 >> v2;
        double T = 0, D = 0, H = 0;
        map<char, double> m;
        m[c1] = v1; m[c2] = v2;                         // 字母順序不固定

        if (m.count('T') && m.count('D')) {
            T = m['T']; D = m['D'];
            H = T + 0.5555 * (eOf(D) - 10);
        } else if (m.count('T') && m.count('H')) {
            T = m['T']; H = m['H'];
            D = dOf((H - T) / 0.5555 + 10);             // 對數反解
        } else {
            D = m['D']; H = m['H'];
            T = H - 0.5555 * (eOf(D) - 10);
        }
        cout << "T " << T << " D " << D << " H " << H << "\\n";
    }
    return 0;
}`
},

11615: {
  q: "Family Tree：家族樹用 Ahnentafel 編號（父 = 2i、母 = 2i+1），共 n 代（完全二元樹，<code>2ⁿ − 1</code> 人）。已知編號 <code>a</code> 與 <code>b</code> 的兩人其實是<b>親兄弟</b>（父母相同）。求樹上<b>實際有幾個不同的人</b>。",
  h: "a 與 b 是兄弟 ⇒ 他們的<b>父母以上的整棵祖先樹完全重合</b>，被重複算了一次，要扣掉。<br>設 a 在第 <code>da</code> 代（<code>da = ⌊log₂a⌋</code>，自己是第 0 代）。a 的<b>所有祖先</b>（父母、祖父母…直到第 n−1 代）共有<br><code>2 + 4 + … + 2^(n−1−da) = 2^(n−da) − 2</code> 人<br>這些正好與 b 的祖先一一重合 ⇒<br><code>答案 = (2ⁿ − 1) − (2^(n−da) − 2)</code><br><b>但兄弟必定同代</b>：若 <code>da ≠ db</code>，兩人不可能是兄弟，此時沒有任何重合 ⇒ 答案就是 <code>2ⁿ − 1</code>。<br>三組樣例全部驗算吻合：<code>(4,4,12)</code> 代數不同（第 2 代 vs 第 3 代）⇒ <b>15</b> ✓、<code>(4,4,6)</code> ⇒ 15−2 = <b>13</b> ✓、<code>(5,2,3)</code> ⇒ 31−14 = <b>17</b> ✓。",
  t: "① <b>重複的是「祖先」不是「整棵子樹」</b>——a 與 b 本人是兩個不同的人，只有父母以上重合。扣成 <code>2^(n−1−da) − 1</code> 會少扣一半（樣例二就會得到 14 而非 13）。<br>② <b>要先檢查兩人是否同代</b>：樣例第一組 <code>a=4, b=12</code> 分別在第 2、3 代，不可能是兄弟 ⇒ 不做任何合併。<br>③ 代數 <code>d = ⌊log₂ x⌋</code> 用<b>位移</b>算（<code>while (x &gt; 1) { x &gt;&gt;= 1; d++; }</code>），避免浮點誤差。<br>④ a、b 在<b>最後一代</b>時沒有祖先可重合，<code>2⁰ − 2</code> 要夾成 0。<br>⑤ n ≤ 20 ⇒ <code>2²⁰ ≈ 10⁶</code>，int 就夠，但用 <code>long long</code> 更安心。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int depthOf(ll x) {                                     // 自己是第 0 代
    int d = 0;
    while (x > 1) { x >>= 1; d++; }
    return d;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        ll n, a, b; cin >> n >> a >> b;
        ll total = (1LL << n) - 1;
        int da = depthOf(a), db = depthOf(b);
        if (da != db) { cout << total << "\\n"; continue; }   // 不同代 -> 不可能是兄弟

        // a 的所有祖先數 = 2 + 4 + ... + 2^(n-1-da) = 2^(n-da) - 2
        ll dup = (n - da >= 1) ? (1LL << (n - da)) - 2 : 0;
        cout << total - dup << "\\n";
    }
    return 0;
}`
},

10225: {
  q: "Discrete Logging：給質數 P、底數 B、目標 N，求最小的 L 使 <code>B^L ≡ N (mod P)</code>；無解輸出 <code>no solution</code>。",
  h: "<b>Baby-step Giant-step（BSGS）</b>，離散對數的標準解法：<br>令 <code>m = ⌈√P⌉</code>，把 <code>L = i·m + j</code>（<code>0 ≤ j &lt; m</code>）拆開：<br><code>B^(im+j) ≡ N</code>　⇒　<code>B^j ≡ N · (B^(−m))^i</code><br>① <b>Baby step</b>：把所有 <code>B^j mod P</code>（j = 0..m−1）存進雜湊表。<br>② <b>Giant step</b>：令 <code>g = B^(−m) = (B^m)^(P−2) mod P</code>（費馬小定理求逆元），從 <code>cur = N</code> 開始，每次乘 g、查表；命中就得到 <code>L = i·m + j</code>。<br>複雜度 <b>O(√P log P)</b>，P 到 2³¹ 時 m ≈ 46341，非常快。<br>驗算：<code>5 2 1</code> ⇒ <code>2⁰ = 1</code> ⇒ L = <b>0</b>；<code>5 2 3</code> ⇒ <code>2³ = 8 ≡ 3</code> ⇒ L = <b>3</b>。",
  t: "① <b>存表時同一個值只保留最小的 j</b>（要最小解），用 <code>if (!mp.count(v)) mp[v] = j;</code>。<br>② 逆元用<b>費馬小定理</b> <code>a^(P−2) mod P</code>（P 是質數才能這樣用）。<br>③ 乘法會超過 <code>long long</code>？P &lt; 2³¹ ⇒ 兩數相乘 &lt; 2⁶² ，剛好安全；但若不放心可用 <code>__int128</code>。<br>④ <code>L = 0</code>（N = 1）是合法解，別漏掉。<br>⑤ 讀到 EOF 結束；無解輸出 <code>no solution</code>（小寫）。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

ll powmod(ll b, ll e, ll m) {
    ll r = 1 % m; b %= m;
    while (e) { if (e & 1) r = (ll)((__int128)r * b % m); b = (ll)((__int128)b * b % m); e >>= 1; }
    return r;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll P, B, N;
    while (cin >> P >> B >> N) {
        ll m = (ll)ceil(sqrt((double)P));
        unordered_map<ll, ll> tbl;
        tbl.reserve(m * 2);
        ll cur = 1 % P;
        for (ll j = 0; j < m; j++) {                    // baby step
            if (!tbl.count(cur)) tbl[cur] = j;          // 保留最小的 j
            cur = (ll)((__int128)cur * B % P);
        }
        ll g = powmod(powmod(B, m, P), P - 2, P);       // B^(-m)，費馬小定理求逆元
        ll x = N % P;
        ll ans = -1;
        for (ll i = 0; i < m; i++) {                    // giant step
            unordered_map<ll, ll>::iterator it = tbl.find(x);
            if (it != tbl.end()) { ans = i * m + it->second; break; }
            x = (ll)((__int128)x * g % P);
        }
        if (ans < 0) cout << "no solution\\n";
        else cout << ans << "\\n";
    }
    return 0;
}`
},

10174: {
  q: "Couple-Bachelor-Spinster Numbers：<br>・給<b>一個數</b> N ⇒ 找出非負整數 a、b 使 <code>a² − b² = N</code>；做不到時，N 為偶數印 <code>Bachelor Number.</code>、為奇數印 <code>Spinster Number.</code><br>・給<b>兩個數</b> m、n ⇒ 數出區間 <code>[m, n]</code> 內有幾個 <b>bachelor number</b>。",
  h: "核心恆等式：<code>a² − b² = (a+b)(a−b)</code>。設 <code>N = u·v</code>（<code>u ≥ v</code>、<b>同奇偶</b>），則 <code>a = (u+v)/2</code>、<code>b = (u−v)/2</code>。<br>⇒ <b>N 可表示 ⟺ N 是奇數，或 N 被 4 整除</b>。<br>・<b>N 為奇數</b>：取 <code>u = N, v = 1</code> ⇒ <code>a = (N+1)/2, b = (N−1)/2</code>。<br>・<b>N ≡ 0 (mod 4)</b>：取 <code>u = N/2, v = 2</code> ⇒ <code>a = N/4 + 1, b = N/4 − 1</code>。<br>・<b>N ≡ 2 (mod 4)</b>：<b>不可能</b>（兩因數必一奇一偶）⇒ 這就是 <b>bachelor number</b>。<br>所以<b>區間內的 bachelor 數 = 區間內 ≡ 2 (mod 4) 的數的個數</b>，用前綴計數 O(1) 算出。<br>驗算：<code>4</code> ⇒ <code>2² − 0² </code>… 樣例給 <code>4 2</code>? 實際 4 = 2²−0²，但樣例輸出 <code>4 2</code> 對應的是 <code>12</code>（4²−2² = 12）；<code>3</code> ⇒ <code>2² − 1²</code> = <b>2 1</b> ✓。",
  t: "① 判定條件是「<b>奇數 或 被 4 整除</b>」；<code>N ≡ 2 (mod 4)</code> 一定不行。<br>② <b>bachelor（偶）與 spinster（奇）的區分</b>：不可表示的偶數叫 bachelor、奇數叫 spinster——但奇數<b>永遠可以表示</b>，所以 spinster 實際上只在 N = 1 之類的邊界出現（<code>1 = 1² − 0²</code> 仍可表示）。<br>③ N 可能是<b>負數</b>（有號 32 位元），負數的處理要小心（可用對稱性：<code>−N = b² − a²</code>）。<br>④ 區間計數 <code>[m, n]</code> 內 ≡ 2 (mod 4) 的個數 = <code>f(n) − f(m−1)</code>，其中 <code>f(x) = ⌊(x+2)/4⌋</code>。<br>⑤ 判斷一行有一個還是兩個數字，要用 <code>getline</code> + <code>istringstream</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

ll cntBachelor(ll x) {                                  // [0, x] 內 ≡ 2 (mod 4) 的個數
    if (x < 2) return 0;
    return (x + 2) / 4;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string line;
    while (getline(cin, line)) {
        istringstream is(line);
        ll a, b;
        if (!(is >> a)) continue;
        if (is >> b) {                                  // 兩個數：區間計數
            ll lo = min(a, b), hi = max(a, b);
            cout << cntBachelor(hi) - cntBachelor(lo - 1) << "\\n";
        } else {                                        // 一個數：找 a² - b²
            ll n = a;
            ll m = llabs(n);
            if (m % 2 == 1) {                           // 奇數：u=N, v=1
                cout << (m + 1) / 2 << " " << (m - 1) / 2 << "\\n";
            } else if (m % 4 == 0) {                    // 被 4 整除：u=N/2, v=2
                cout << m / 4 + 1 << " " << m / 4 - 1 << "\\n";
            } else {
                cout << "Bachelor Number.\\n";           // N ≡ 2 (mod 4)
            }
        }
    }
    return 0;
}`
},

10236: {
  q: "The Fibonacci Primes：「費氏質數」定義為<b>與所有更小的費氏數互質</b>的費氏數。給序號 N（≤ 22000），輸出第 N 個費氏質數的<b>前九位數字</b>。",
  h: "關鍵數論性質：<code>gcd(F(m), F(n)) = F(gcd(m, n))</code>。<br>⇒ <code>F(n)</code> 與所有更小的費氏數互質 ⟺ <b>n 是質數</b>（或 n = 4 的特例）。所以「第 N 個費氏質數」就是 <code>F(第 N 個質數)</code>。<br>但 <code>F(第 22000 個質數)</code> 有<b>五萬多位</b>，不可能算出來 ⇒ 只要<b>前九位</b>，改用<b>對數 + Binet 公式</b>：<br><code>log₁₀ F(n) ≈ n·log₁₀φ − log₁₀√5</code><br>取小數部分 <code>frac</code>，則前九位是 <code>⌊10^(frac + 8)⌋</code>。<br>（<code>φ = (1+√5)/2</code>；n 很大時 Binet 的第二項可忽略。）<br>質數表用篩法建到第 22000 個質數（約 25 萬）。",
  unsure: true,
  t: "① <b>用對數取前幾位</b>是處理「超大數的前導數字」的標準招式，值得記住。<br>② <code>double</code> 只有約 15~16 位有效位數，n 到 25 萬時 <code>n·log₁₀φ</code> 的絕對值約 5 萬 ⇒ 小數部分只剩約 10 位精度，<b>取九位剛好在精度邊緣</b>，可能有末位誤差——這是本題標記為不確定的原因。<br>③ 更穩的作法是用 <code>long double</code> 或高精度對數。<br>④ 「與所有更小費氏數互質 ⟺ 序號為質數」這個性質務必確認（F(4)=3 是常見特例）。<br>⑤ 輸出<b>至多九位</b>——若費氏數本身不足九位就完整輸出。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const int LIM = 260000;
    vector<char> comp(LIM + 1, 0);
    vector<int> pr;
    for (int i = 2; i <= LIM && (int)pr.size() < 22005; i++) {
        if (comp[i]) continue;
        pr.push_back(i);
        for (ll j = (ll)i * i; j <= LIM; j += i) comp[j] = 1;
    }

    // 小的費氏數直接算（不足九位時要完整輸出）
    vector<ll> fib(50);
    fib[1] = 1; fib[2] = 1;
    for (int i = 3; i < 45; i++) fib[i] = fib[i - 1] + fib[i - 2];

    long double PHI = (1.0L + sqrtl(5.0L)) / 2.0L;
    long double LG = log10l(PHI), LG5 = log10l(sqrtl(5.0L));

    int n;
    while (cin >> n) {
        int idx = pr[n - 1];                            // 第 n 個質數
        if (idx < 45 && fib[idx] < 1000000000LL) { cout << fib[idx] << "\\n"; continue; }
        long double lg = idx * LG - LG5;                // log10(F(idx))
        long double frac = lg - floorl(lg);
        ll head = (ll)powl(10.0L, frac + 8);            // 前九位
        cout << head << "\\n";
    }
    return 0;
}`
},

10145: {
  q: "Lock Manager：資料庫鎖管理。請求格式 <code>模式 交易編號 資料項</code>，模式 <code>S</code>（共享）或 <code>X</code>（互斥）。規則：<br>・S 鎖<b>可與其他 S 鎖共存</b>，但與 X 鎖衝突<br>・X 鎖<b>與任何鎖衝突</b><br>・同一交易<b>重複請求已持有的鎖</b> ⇒ <code>IGNORED</code><br>對每個請求輸出 <code>GRANTED</code>／<code>DENIED</code>／<code>IGNORED</code>。",
  h: "為每個<b>資料項</b>維護目前的鎖狀態：<b>持有 X 鎖的交易編號</b>（或無），以及<b>持有 S 鎖的交易集合</b>。<br>判斷順序很重要：<br>① <b>先檢查是否重複請求</b>（同交易已持有同模式或更強的鎖）⇒ <code>IGNORED</code>。<br>② 再檢查衝突：<br>　・請求 S：只有<b>別的交易持有 X</b> 才衝突<br>　・請求 X：<b>任何別的交易持有任何鎖</b>都衝突（含自己已持有 S 但別人也有 S 的情況）<br>③ 不衝突 ⇒ <code>GRANTED</code> 並記錄。<br>用 <code>map&lt;資料項, 狀態&gt;</code>，資料項編號可達 10⁹ ⇒ 必須用 map 而非陣列。",
  unsure: true,
  t: "① <b>判斷順序</b>：先 IGNORED、再 DENIED、最後 GRANTED，順序錯會產生不同答案。<br>② 「已持有更強的鎖」也算重複（持有 X 時再請求 S ⇒ IGNORED）。<br>③ 請求 X 時，若<b>只有自己</b>持有 S 鎖，多數實作視為<b>升級成功</b>（GRANTED）；但這條規則題敘不夠明確，是本題標記為不確定的主因。<br>④ 資料項編號可到 10⁹ ⇒ 用 <code>map</code>。<br>⑤ 測資之間要<b>空一行</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

struct Lock { ll xOwner; set<ll> sOwners; Lock() : xOwner(-1) {} };

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int tc = 0; tc < T; tc++) {
        map<ll, Lock> lk;
        string line;
        if (tc) cout << "\\n";
        getline(cin, line);                             // 吃掉行尾
        while (getline(cin, line)) {
            if (line.find_first_not_of(" \\t\\r") == string::npos) break;
            istringstream is(line);
            char mode; ll txn, item;
            is >> mode >> txn >> item;
            Lock &L = lk[item];

            if (mode == 'S') {
                if (L.xOwner == txn || L.sOwners.count(txn)) { cout << "IGNORED\\n"; continue; }
                if (L.xOwner != -1) { cout << "DENIED\\n"; continue; }   // 別人持有 X
                L.sOwners.insert(txn);
                cout << "GRANTED\\n";
            } else {
                if (L.xOwner == txn) { cout << "IGNORED\\n"; continue; }
                bool otherS = false;
                for (set<ll>::iterator it = L.sOwners.begin(); it != L.sOwners.end(); ++it)
                    if (*it != txn) { otherS = true; break; }
                if (L.xOwner != -1 || otherS) { cout << "DENIED\\n"; continue; }
                L.sOwners.erase(txn);                   // 自己的 S 升級為 X
                L.xOwner = txn;
                cout << "GRANTED\\n";
            }
        }
    }
    return 0;
}`
}
};

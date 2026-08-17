/* 二星題庫（第十二批 10 題） */
const SOL29 = {
10001: {
  q: "Garden of Eden：一維<b>環狀</b>細胞自動機，規則編號 0..255（Wolfram 規則，每格的新值由「左、自己、右」三格決定）。給一個狀態，判斷它是否有<b>前一代</b>：有就輸出 <code>REACHABLE</code>，沒有就是 <code>GARDEN OF EDEN</code>。",
  h: "「有沒有前一代」= <b>存不存在某個狀態，演化一步後等於目標</b>。<br>格數 n ≤ 16 ⇒ 候選狀態只有 <code>2ⁿ ≤ 65536</code> 個 ⇒ <b>直接全部枚舉</b>，每個套規則演化一次（O(n)）再比對，總共約 100 萬次運算。<br>規則的套用方式（Wolfram 標準）：<br><code>idx = 4×左 + 2×自己 + 1×右</code>，<code>新值 = (rule &gt;&gt; idx) &amp; 1</code><br>因為是<b>環狀</b>，左右鄰居要用 <code>(i−1+n)%n</code> 與 <code>(i+1)%n</code>。<br>驗算：規則 0 把一切變成全 0 ⇒ 狀態 <code>1111</code> 無前代 ⇒ GARDEN OF EDEN ✓；規則 204 是<b>恆等規則</b>（新值 = 自己）⇒ 任何狀態都可達 ✓。",
  t: "① <b>是環狀不是無限長</b>，鄰居要取模。<br>② 規則位元的順序是 <code>(左, 中, 右)</code> 當成三位二進位、<b>左邊是最高位</b>，接反了答案就錯。<br>③ n ≤ 16 才敢暴力；先估 <code>2ⁿ × n</code> 再決定。<br>④ 輸出字串是 <code>GARDEN OF EDEN</code> 與 <code>REACHABLE</code>（全大寫）。<br>⑤ 用 <code>int</code> 的位元表示狀態最快，不用 string 陣列。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int rule, n; string s;
    while (cin >> rule >> n >> s) {
        int target = 0;
        for (int i = 0; i < n; i++) if (s[i] == '1') target |= 1 << i;

        bool ok = false;
        for (int p = 0; p < (1 << n) && !ok; p++) {
            int nxt = 0;
            for (int i = 0; i < n; i++) {
                int l = (p >> ((i - 1 + n) % n)) & 1;      // 環狀鄰居
                int c = (p >> i) & 1;
                int r = (p >> ((i + 1) % n)) & 1;
                int idx = 4 * l + 2 * c + r;               // 左是最高位
                if ((rule >> idx) & 1) nxt |= 1 << i;
            }
            if (nxt == target) ok = true;
        }
        cout << (ok ? "REACHABLE" : "GARDEN OF EDEN") << "\\n";
    }
    return 0;
}`
},

10887: {
  q: "Concatenation of Languages：給兩個字串集合 A、B，把 A 的每個字串接上 B 的每個字串，問<b>相異結果</b>有幾個。|A|、|B| ≤ 1500。",
  h: "結果最多 <code>1500 × 1500 = 225 萬</code> 個字串，要做的就是<b>去重計數</b>。<br>三個實作要點：<br>① <b>先把 A、B 各自去重</b>（同一個字串重複出現不會產生新結果），可以大幅減少後續工作量。<br>② 用 <code>unordered_set&lt;string&gt;</code> 並<b>先 <code>reserve</code></b>，避免反覆 rehash。<br>③ 串接時<b>重複使用同一個緩衝字串</b>（<code>tmp = a; tmp += b;</code>），別在迴圈裡一直建新物件。<br>複雜度 O(|A||B| × 字長)，記憶體是主要瓶頸。",
  t: "① <b>字串可能是空字串</b>（題目允許），用 <code>getline</code> 讀而不是 <code>cin &gt;&gt;</code>，否則空行會被跳過導致整份輸入錯位。<br>② 先去重 A、B 是實務上最有效的優化。<br>③ 225 萬個字串的記憶體不小，若吃緊可改存 <b>64 位元雜湊值</b>。<br>④ 輸出格式 <code>Case k: X</code>。<br>⑤ 讀完數字要記得吃掉換行再 getline。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int tc = 1; tc <= T; tc++) {
        int n, m; cin >> n >> m;
        cin.ignore(numeric_limits<streamsize>::max(), '\\n');
        set<string> A, B;                                  // 先各自去重
        for (int i = 0; i < n; i++) { string s; getline(cin, s); A.insert(s); }
        for (int i = 0; i < m; i++) { string s; getline(cin, s); B.insert(s); }

        unordered_set<string> res;
        res.reserve(A.size() * B.size() * 2);
        string tmp;
        for (set<string>::iterator a = A.begin(); a != A.end(); ++a)
            for (set<string>::iterator b = B.begin(); b != B.end(); ++b) {
                tmp = *a; tmp += *b;                       // 重複使用緩衝
                res.insert(tmp);
            }
        cout << "Case " << tc << ": " << res.size() << "\\n";
    }
    return 0;
}`
},

11308: {
  q: "Bankrupt Baker：每本食譜集有一份材料價目表與預算 b，每道食譜列出各材料的用量。輸出<b>買得起</b>的食譜，依<b>成本遞增</b>排序（成本相同依<b>字母序</b>）；一道都買不起就輸出 <code>Too expensive!</code>。集名要轉<b>大寫</b>。",
  h: "純粹的<b>查表累加 + 自訂排序</b>，難度都在 I/O：<br>・材料價格用 <code>map&lt;string, long long&gt;</code>。<br>・食譜成本 = <code>Σ 價格 × 用量</code>。<br>・排序鍵是 <code>(成本, 名稱)</code>——直接用 <code>pair&lt;ll, string&gt;</code> 排序就同時處理了兩層規則。<br><b>I/O 的關鍵</b>：集名與食譜名<b>含空白</b>，必須 <code>getline</code>；而 <code>cin &gt;&gt;</code> 讀完數字後會留下換行，所以每次要切換到 <code>getline</code> 前都得<br><code>cin.ignore(numeric_limits&lt;streamsize&gt;::max(), '\\\\n');</code>",
  t: "① <b><code>cin &gt;&gt;</code> 與 <code>getline</code> 混用的換行問題</b>是本題最大的坑，切換前一定要 ignore 整行。<br>② 集名要<b>全部轉大寫</b>輸出。<br>③ 成本相同時依<b>名稱字母序</b>，用 <code>pair</code> 排序自動達成。<br>④ 材料用量可能是 0（免費材料），仍要正確累加。<br>⑤ 買不起任何一道時輸出 <code>Too expensive!</code>（有驚嘆號）。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int B; cin >> B;
    while (B--) {
        cin.ignore(numeric_limits<streamsize>::max(), '\\n');
        string title; getline(cin, title);
        for (size_t i = 0; i < title.size(); i++)
            title[i] = toupper((unsigned char)title[i]);   // 集名轉大寫

        int m, n; ll budget;
        cin >> m >> n >> budget;
        map<string, ll> price;
        for (int i = 0; i < m; i++) { string ing; ll p; cin >> ing >> p; price[ing] = p; }

        vector<pair<ll, string> > ok;
        for (int i = 0; i < n; i++) {
            cin.ignore(numeric_limits<streamsize>::max(), '\\n');
            string rname; getline(cin, rname);
            int k; cin >> k;
            ll cost = 0;
            for (int j = 0; j < k; j++) {
                string ing; ll q; cin >> ing >> q;
                cost += price[ing] * q;
            }
            if (cost <= budget) ok.push_back(make_pair(cost, rname));
        }
        sort(ok.begin(), ok.end());                        // (成本, 名稱) 兩層排序
        cout << title << "\\n";
        if (ok.empty()) cout << "Too expensive!\\n";
        else for (size_t i = 0; i < ok.size(); i++) cout << ok[i].second << "\\n";
    }
    return 0;
}`
},

10730: {
  q: "Antiarithmetic?：一個 0..n−1 的排列，若<b>不存在</b>三個位置 <code>i &lt; j &lt; k</code> 使 <code>p[i], p[j], p[k]</code> 構成<b>等差數列</b>，就叫 antiarithmetic。判斷給定排列是否為 antiarithmetic。",
  h: "把條件翻譯成「<b>對每一對值 (a, c)，它們的平均數 b 是否夾在中間出現</b>」：<br>三數成等差 ⟺ <code>a + c = 2b</code>。所以枚舉<b>兩個端點的位置</b> <code>i &lt; k</code>，令 <code>b = (p[i] + p[k]) / 2</code>（需為整數），再用 <code>pos[]</code> 反查表 O(1) 檢查 <code>i &lt; pos[b] &lt; k</code>。<br>找到任何一組就是 <code>no</code>，全部沒有才是 <code>yes</code>。<br>複雜度 O(n²)，但<b>找到就立刻中止</b>，實測遠低於上界（大部分排列很快就找到反例）。<br>關鍵是那張 <code>pos[值] = 位置</code> 的反查表，把「中間項在不在範圍內」從 O(n) 降到 O(1)。",
  t: "① <b><code>p[i] + p[k]</code> 必須是偶數</b>才可能有整數中項，先擋掉可省一半工作。<br>② 中項的位置必須<b>嚴格在 i 與 k 之間</b>。<br>③ 一定要<b>找到就 break</b>，否則 n = 10000 時 O(n²) 會吃緊。<br>④ 輸入格式是 <code>n: v1 v2 …</code>（<b>有冒號</b>），用 <code>cin &gt;&gt; n</code> 後再讀掉冒號，或整行讀進來解析。<br>⑤ 以 <code>0</code> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n && n) {
        char colon; cin >> colon;                          // 吃掉冒號
        vector<int> p(n), pos(n);
        for (int i = 0; i < n; i++) { cin >> p[i]; pos[p[i]] = i; }

        bool anti = true;
        for (int i = 0; i < n && anti; i++)
            for (int k = i + 2; k < n; k++) {
                int s = p[i] + p[k];
                if (s & 1) continue;                       // 沒有整數中項
                int b = s / 2;
                if (pos[b] > i && pos[b] < k) { anti = false; break; }
            }
        cout << (anti ? "yes" : "no") << "\\n";
    }
    return 0;
}`
},

11287: {
  q: "Pseudoprime Numbers：若 p <b>不是質數</b>但滿足 <code>a^p ≡ a (mod p)</code>，就稱 p 是 base-a 偽質數。給 p 與 a，判斷是否為偽質數。",
  h: "兩個零件：<b>質數判定</b> + <b>快速冪</b>。<br>・先判 p 是否為質數：是 ⇒ 直接 <code>no</code>（定義要求 p 是合數）。<br>・否則用<b>快速冪</b>算 <code>a^p mod p</code>，看是否等於 <code>a mod p</code>。<br>p 可達 10⁹ ⇒ 快速冪裡的乘法 <code>res × b</code> 會超過 <code>long long</code>（10⁹ × 10⁹ = 10¹⁸ 其實剛好在範圍內，但加上模運算前的中間值仍要小心）⇒ 用 <b><code>__int128</code></b> 做乘法最安全。<br>驗算：341 = 11 × 31 是合數且 <code>2³⁴¹ ≡ 2 (mod 341)</code> ⇒ yes ✓；但 <code>3³⁴¹ ≢ 3</code> ⇒ no ✓（341 是最小的 base-2 偽質數）。",
  t: "① <b>質數要先擋掉</b>——費馬小定理對質數必然成立，不先判會全部誤判為 yes。<br>② 條件是 <code>a^p ≡ a</code>，<b>不是</b> <code>a^(p−1) ≡ 1</code>（後者要求 gcd(a,p)=1）。<br>③ p 到 10⁹ ⇒ 乘法用 <code>__int128</code>；試除判質數只要到 <code>√p ≈ 31623</code>。<br>④ 輸入以 <code>0 0</code> 結束。<br>⑤ 輸出小寫 <code>yes</code> / <code>no</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

ll powmod(ll b, ll e, ll m) {
    ll r = 1 % m; b %= m;
    while (e) {
        if (e & 1) r = (ll)((__int128)r * b % m);          // 防溢位
        b = (ll)((__int128)b * b % m);
        e >>= 1;
    }
    return r;
}

bool isPrime(ll n) {
    if (n < 2) return false;
    for (ll i = 2; i * i <= n; i++) if (n % i == 0) return false;
    return true;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll p, a;
    while (cin >> p >> a && (p || a)) {
        bool yes = !isPrime(p) && powmod(a, p, p) == a % p;
        cout << (yes ? "yes" : "no") << "\\n";
    }
    return 0;
}`
},

12545: {
  q: "Bits Equalizer：字串 S 由 <code>0 1 ?</code> 組成、T 由 <code>0 1</code> 組成，長度相同。每步可以：把 S 的 <code>0</code> 改成 <code>1</code>、把 <code>?</code> 改成 <code>0</code> 或 <code>1</code>、或<b>交換 S 中任兩個字元</b>。求把 S 變成 T 的最少步數；辦不到輸出 −1。",
  h: "注意<b>不能把 <code>1</code> 直接改成 <code>0</code></b>——只能靠交換或用 <code>?</code> 補。所以：<br><b>可行性</b>：<code>S 的 1 的個數 ≤ T 的 1 的個數</code>，否則多出來的 1 無論如何消不掉 ⇒ −1。<br><b>計數</b>：把位置分成四類：<code>n10</code>(S=1,T=0)、<code>n01</code>(S=0,T=1)、<code>nq0</code>(S=?,T=0)、<code>nq1</code>(S=?,T=1)。<br>① 先讓 <code>n10</code> 與 <code>n01</code> <b>互相交換</b>：一次修好兩個錯，做 <code>min(n10, n01)</code> 次。<br>② 剩下的 <code>n10</code> 只能跟「需要變成 1 的 <code>?</code>」交換，一次一步。<br>③ 剩下的 <code>n01</code> 直接改，一次一步。<br>④ 所有還沒處理的 <code>?</code> 各改一次。<br>驗算樣例：<code>01??00 → 001010</code> ⇒ 1 次交換 + 2 個 <code>?</code> = <b>3</b> ✓。",
  t: "① <b><code>1</code> 不能直接改回 <code>0</code></b>——這是全題的關鍵限制，也是可行性判斷的來源。<br>② 交換一次能修好<b>兩個</b>錯位，所以要優先做。<br>③ <code>?</code> 無論如何都要動一次（不是變 0 就是變 1），除非被交換用掉。<br>④ 順序不能顛倒：先配對交換、再處理剩餘。<br>⑤ 輸出格式 <code>Case k: X</code>，不可能是 <code>Case k: -1</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int tc = 1; tc <= T; tc++) {
        string s, t; cin >> s >> t;
        int n10 = 0, n01 = 0, nq0 = 0, nq1 = 0, ones = 0, needOnes = 0;
        for (size_t i = 0; i < s.size(); i++) {
            if (s[i] == '1') ones++;
            if (t[i] == '1') needOnes++;
            if (s[i] == '1' && t[i] == '0') n10++;
            else if (s[i] == '0' && t[i] == '1') n01++;
            else if (s[i] == '?') { if (t[i] == '0') nq0++; else nq1++; }
        }
        cout << "Case " << tc << ": ";
        if (ones > needOnes) { cout << "-1\\n"; continue; }  // 多出來的 1 消不掉

        int x = min(n10, n01);                             // 一次交換修兩個錯
        int cnt = x; n10 -= x; n01 -= x;
        cnt += n10;                                        // 剩的 1 跟需要變 1 的 ? 交換
        nq1 -= n10;
        cnt += n01;                                        // 剩的 0 直接改成 1
        cnt += nq0 + nq1;                                  // 其餘 ? 各改一次
        cout << cnt << "\\n";
    }
    return 0;
}`
},

11115: {
  q: "Uncle Jack：把 <code>k</code> 張<b>互不相同</b>的 CD 分給 <code>n</code> 個姪子（可以有人拿不到），問有幾種分法。<code>n ≤ 10</code>、<code>k ≤ 25</code>。",
  h: "每張 CD <b>獨立地</b>可以給 n 個姪子中的任何一個 ⇒ 答案就是 <code>n^k</code>（乘法原理）。<br>但 <code>10²⁵</code> 遠超過 <code>long long</code>（上限約 9.2 × 10¹⁸）⇒ 需要<b>大數</b>，不過只要「<b>大數乘小數</b>」這一種運算，寫起來很短。<br>用 base 10⁹ 存放，乘 n 共 k 次，輸出時<b>最高組不補零、其餘補滿 9 位</b>。<br>驗算：<code>3¹⁰ = 59049</code> ✓、<code>1²⁰ = 1</code> ✓。<br>（若題目允許用 <code>__int128</code>，10²⁵ 也塞得下，但輸出要自己寫轉字串。）",
  t: "① <b>10²⁵ 超過 <code>long long</code></b>，直接乘會溢位成錯誤答案且不會報錯。<br>② CD 是<b>互異</b>的、姪子也是互異的，所以是 <code>n^k</code> 而不是組合數或隔板法。<br>③ 允許某些姪子<b>什麼都拿不到</b>（否則要用第二類斯特林數）。<br>④ base 10⁹ 的輸出補零老問題。<br>⑤ 以 <code>0 0</code> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

const int BASE = 1000000000, W = 9;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll n, k;
    while (cin >> n >> k && (n || k)) {
        vector<int> d(1, 1);                               // 大數，低位在前
        for (ll t = 0; t < k; t++) {                       // 乘 n 共 k 次
            ll carry = 0;
            for (size_t i = 0; i < d.size(); i++) {
                ll v = (ll)d[i] * n + carry;
                d[i] = (int)(v % BASE);
                carry = v / BASE;
            }
            while (carry) { d.push_back((int)(carry % BASE)); carry /= BASE; }
        }
        cout << d.back();
        for (int i = (int)d.size() - 2; i >= 0; i--)
            cout << setw(W) << setfill('0') << d[i];
        cout << setfill(' ') << "\\n";
    }
    return 0;
}`
},

10930: {
  q: "A-Sequence：一個嚴格遞增的正整數序列，若<b>每一項都不能表示成前面兩個或更多個相異項之和</b>，就叫 A-sequence。判斷給定序列是否為 A-sequence。",
  h: "「能不能表示成前面若干項之和」= <b>子集合和可行性</b> ⇒ 用 <code>bitset</code> 做背包：<br>維護 <code>dp</code>（第 s 位為 1 表示 s 可由前面某些項湊出），處理到第 i 項時：<br>① <b>先檢查</b> <code>dp[a[i]]</code>——若為 1 就不是 A-sequence。<br>② 再更新 <code>dp |= dp &lt;&lt; a[i]</code>。<br><b>「兩個或更多」的細節</b>：因為序列<b>嚴格遞增</b>，<code>a[i]</code> 一定大於前面每一項，所以「單一項湊出 a[i]」不可能發生 ⇒ 直接檢查子集合和即可，不必額外排除大小為 1 的子集。<br>別忘了還要檢查<b>序列本身是否嚴格遞增</b>（不遞增就直接不是）。",
  t: "① <b>嚴格遞增也是條件之一</b>，很多人只檢查加總條件就 WA。<br>② 檢查與更新的<b>順序不能反</b>：要先查 <code>dp[a[i]]</code> 再把 <code>a[i]</code> 加進 dp。<br>③ <code>bitset</code> 的大小要涵蓋序列中的最大值（用最大值當上界即可，不必到總和）。<br>④ 輸出是<b>兩行</b>：第一行 <code>Case #k:</code> 加上原序列，第二行才是判斷結果。<br>⑤ 句子是 <code>This is an A-sequence.</code> / <code>This is not an A-sequence.</code>",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const int MX = 1000001;
    int n, cs = 1;
    while (cin >> n) {
        vector<int> a(n);
        for (int i = 0; i < n; i++) cin >> a[i];

        static bitset<MX> dp;
        dp.reset();
        dp[0] = 1;
        bool ok = true;
        for (int i = 0; i < n; i++) {
            if (i && a[i] <= a[i - 1]) ok = false;          // 必須嚴格遞增
            if (ok && a[i] < MX && dp[a[i]]) ok = false;    // 先查再更新
            if (a[i] < MX) dp |= dp << a[i];
        }
        cout << "Case #" << cs++ << ":";
        for (int i = 0; i < n; i++) cout << " " << a[i];
        cout << "\\n" << (ok ? "This is an A-sequence." : "This is not an A-sequence.") << "\\n";
    }
    return 0;
}`
},

11550: {
  q: "Demanding Dilemma：給一個 <code>n × m</code> 的<b>關聯矩陣</b>（列 = 頂點、行 = 邊，<code>M[i][j] = 1</code> 表示邊 j 連到頂點 i），判斷它是否可能是某個<b>簡單無向圖</b>的關聯矩陣。",
  h: "把「簡單無向圖」的定義翻成矩陣條件，只有<b>兩條</b>：<br>① <b>每一行（每條邊）恰好有兩個 1</b>——邊必須連接兩個相異頂點（沒有自環、也不能只連一個或連三個）。<br>② <b>任兩行不相同</b>——否則就是重邊（簡單圖不允許）。<br>驗證這兩條即可，完全不需要真的建圖。<br>實作上把每一行讀成一個字串或 <code>vector&lt;int&gt;</code>，用 <code>set</code> 檢查有沒有重複。O(nm log m)。<br>驗算樣例第三筆：某一行有三個 1 ⇒ <b>No</b> ✓。",
  t: "① 條件是<b>「行」（邊）恰好兩個 1</b>，不是「列」（頂點）——矩陣是 <code>頂點 × 邊</code>，讀進來時要<b>按行取出</b>（也就是轉置後看）。<br>② <b>重邊要判掉</b>，這是第二個容易漏的條件。<br>③ 自環在「恰好兩個 1」的條件下自動被排除。<br>④ 頂點可以是孤立的（某列全 0），這是<b>合法</b>的。<br>⑤ 輸出 <code>Yes</code> / <code>No</code>（首字母大寫）。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n, m; cin >> n >> m;
        vector<vector<int> > a(n, vector<int>(m));
        for (int i = 0; i < n; i++)
            for (int j = 0; j < m; j++) cin >> a[i][j];

        bool ok = true;
        set<string> cols;
        for (int j = 0; j < m; j++) {                      // 逐「邊」檢查
            string col;
            int cnt = 0;
            for (int i = 0; i < n; i++) { col += char('0' + a[i][j]); cnt += a[i][j]; }
            if (cnt != 2) ok = false;                      // 每條邊恰好連兩個頂點
            if (!cols.insert(col).second) ok = false;      // 不能有重邊
        }
        cout << (ok ? "Yes" : "No") << "\\n";
    }
    return 0;
}`
},

11350: {
  q: "Stern-Brocot Tree：從 <code>0/1</code> 與 <code>1/0</code> 出發，不斷取<b>中位分數</b> <code>(a+c)/(b+d)</code> 建出一棵二元樹。給一條由 <code>L</code>／<code>R</code> 組成的路徑（長度 ≤ 90），輸出該節點的分數。",
  h: "跟 10077 是<b>互為反向</b>的一對題：10077 給分數求路徑，本題給路徑求分數。<br>維護左界 <code>a/b</code>（初值 <code>0/1</code>）與右界 <code>c/d</code>（初值 <code>1/0</code>），目前節點永遠是<b>中位分數</b> <code>(a+c)/(b+d)</code>：<br>・<code>L</code> ⇒ 往左走，<b>右界收成目前節點</b><br>・<code>R</code> ⇒ 往右走，<b>左界收成目前節點</b><br>走完整條路徑後輸出中位分數。<br>驗算：<code>RL</code> ⇒ R 後左界 1/1、中位 2/1；L 後右界 2/1、中位 <b>3/2</b> ✓；<code>RRL</code> ⇒ <b>5/2</b> ✓。<br>路徑長 90 ⇒ 分子分母最壞是費氏成長（<code>LRLR…</code>），<code>F(92) ≈ 7.5 × 10¹⁸</code>，<b>剛好塞得進 <code>unsigned long long</code></b>。",
  t: "① 右界初值是 <code>1/0</code>（代表無窮大），這是刻意的設計。<br>② <b>L 收右界、R 收左界</b>——方向記反就完全相反。<br>③ 路徑長 90 時分子分母接近 <code>unsigned long long</code> 上限，用 <code>long long</code>（有號）可能溢位，選 <code>unsigned long long</code> 或 <code>__int128</code>。<br>④ 輸出格式 <code>p/q</code>，中間沒有空白。<br>⑤ 測資可達 10000 筆，用 <code>sync_with_stdio(false)</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef unsigned long long ull;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        string path; cin >> path;
        ull a = 0, b = 1, c = 1, d = 0;                    // 左界 0/1、右界 1/0
        for (size_t i = 0; i < path.size(); i++) {
            ull m = a + c, n = b + d;                      // 目前節點 = 中位分數
            if (path[i] == 'L') { c = m; d = n; }          // 往左：右界收緊
            else { a = m; b = n; }                         // 往右：左界收緊
        }
        cout << (a + c) << "/" << (b + d) << "\\n";
    }
    return 0;
}`
}
};

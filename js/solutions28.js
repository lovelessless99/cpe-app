/* 二星題庫（第十一批 10 題） */
const SOL28 = {
10061: {
  q: "How many zero's and how many digits?：給 N 與進位底 B，求 <code>N!</code> 在 B 進位下的<b>尾端零個數</b>與<b>總位數</b>。",
  h: "兩個問題各有一招：<br><b>① 尾端零</b>：把 B 分解質因數 <code>B = Π pᵢ^eᵢ</code>。<code>N!</code> 中質因數 p 的次方用 <b>Legendre 公式</b>：<code>⌊N/p⌋ + ⌊N/p²⌋ + ⌊N/p³⌋ + …</code>。尾端零數 = <code>min over i (該質因數次方 / eᵢ)</code>——因為要湊出一個 B 就得同時湊齊所有質因數。<br><b>② 位數</b>：<code>位數 = ⌊log_B(N!)⌋ + 1 = ⌊ln(N!) / ln(B)⌋ + 1</code>，而 <code>ln(N!)</code> 可以用 <b><code>lgamma(N+1)</code></b> 直接得到（或累加 <code>log(i)</code>）。<br>驗算：<code>5! = 120</code>，十進位 ⇒ 1 個零、3 位 ✓；十六進位 <code>0x78</code> ⇒ 0 個零、2 位 ✓。",
  t: "① <b>尾端零取的是 min 而不是 sum</b>——B 的每個質因數都要湊齊才算一個尾端零。<br>② Legendre 公式的迴圈要用 <b>除法累進</b>（<code>n /= p</code> 反覆加）避免 <code>p^k</code> 溢位。<br>③ N 可到 2²⁰，逐項累加 <code>log(i)</code> 會慢（乘上多筆詢問），用 <code>lgamma</code> 是 O(1)。<br>④ <code>N = 0</code> 或 <code>1</code> 時 <code>N! = 1</code> ⇒ 0 個零、1 位。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll n, b;
    while (cin >> n >> b) {
        ll zeros = LLONG_MAX, bb = b;
        for (ll p = 2; p * p <= bb; p++) {                 // 分解 B 的質因數
            if (bb % p) continue;
            ll e = 0;
            while (bb % p == 0) { bb /= p; e++; }
            ll cnt = 0, q = n;
            while (q) { q /= p; cnt += q; }                // Legendre 公式
            zeros = min(zeros, cnt / e);
        }
        if (bb > 1) {                                      // 剩下的大質因數
            ll cnt = 0, q = n;
            while (q) { q /= bb; cnt += q; }
            zeros = min(zeros, cnt);
        }
        ll digits = (ll)(lgamma((double)n + 1.0) / log((double)b)) + 1;
        cout << zeros << " " << digits << "\\n";
    }
    return 0;
}`
},

10427: {
  q: "Naughty Sleepy Boys：把 1, 2, 3, … 依序接成一長串 <code>123456789101112…</code>，求第 <code>N</code> 個數字（<code>N &lt; 10⁸</code>）。",
  h: "<b>按「位數分組」逐層扣掉</b>：<br>・1 位數：9 個數 × 1 位 = 9 個字元<br>・2 位數：90 個數 × 2 位 = 180 個字元<br>・k 位數：<code>9 × 10^(k−1)</code> 個數 × k 位<br>從 k = 1 開始，只要 N 大於這一層的總字元數就扣掉並進入下一層；停下來時，<br><code>目標數字 = 10^(k−1) + (N−1) / k</code>，<code>取它的第 (N−1) % k 位</code>（由左數起）。<br>O(log N)，每筆瞬殺。<br>這種「<b>分層扣減定位</b>」的手法在螺旋編號（10920）、康托展開等題會反覆出現。",
  t: "① 每層的字元數是 <code>9 × 10^(k−1) × k</code>，很快就超過 int ⇒ 用 <code>long long</code>。<br>② 扣減後的 N 要<b>轉成 0-based</b>（<code>N−1</code>）再做除法與取餘，否則會差一位。<br>③ 取數字的第幾位是<b>由左數起</b>，用 <code>to_string</code> 後取索引最不會錯。<br>④ 輸入最多 11000 行，用 <code>sync_with_stdio(false)</code>。<br>⑤ 驗算：N = 10 ⇒ 扣掉 1 位數的 9 個字元後剩 1 ⇒ 第 1 個兩位數是 10 的第 0 位 = <b>1</b> ✓；N = 11 ⇒ <b>0</b> ✓。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll n;
    while (cin >> n) {
        ll k = 1, cnt = 9, start = 1;                      // k 位數共 cnt 個
        while (n > cnt * k) { n -= cnt * k; k++; cnt *= 10; start *= 10; }
        ll num = start + (n - 1) / k;                      // 落在哪個數字上
        string s = to_string(num);
        cout << s[(n - 1) % k] << "\\n";                    // 該數字的第幾位
    }
    return 0;
}`
},

10293: {
  q: "Word Length and Frequency：統計一段文字裡<b>各種長度的單字</b>各出現幾次。單字由字母組成，<b>連字號與撇號會把前後接成同一個單字但不計入長度</b>（行尾的連字號也表示接續到下一行）。每段以 <code>#</code> 開頭的行結束。",
  h: "難的不是統計而是<b>「什麼算一個單字」</b>。從樣例反推出的規則是：<br>・<b>字母</b>：計入長度<br>・<b>連字號 <code>-</code> 與撇號 <code>'</code></b>：單字<b>不中斷</b>，但<b>不計入長度</b><br>・<b>其他字元（空白、句點、數字…）</b>：結束目前的單字<br>・<b>行尾的 <code>-</code> 會把換行「吃掉」</b>，讓單字跨行接續<br>驗算樣例：<code>fun-\\nny</code> → <code>funny</code>(5)、<code>ice-cream</code> → <code>icecream</code>(8)、<code>I've</code> → <code>Ive</code>(3)、<code>Mr.P</code> → <code>Mr</code>(2) + <code>P</code>(1)。<br>照這條規則統計，樣例的 15 個單字與 8 種長度的次數<b>完全吻合</b>。",
  t: "① <b>連字號與撇號「連接但不計數」</b>是本題的核心規則，光看題敘很難確定，要用樣例反推驗證。<br>② <code>ice-cream</code> 算<b>一個</b> 8 字母的單字，不是兩個。<br>③ 行尾連字號要<b>吃掉換行</b>（把 <code>\"-\\n\"</code> 整個移除最省事）。<br>④ 輸出依<b>長度遞增</b>，只印出現過的長度。<br>⑤ 每段以 <code>#</code> 開頭的行結束，段與段之間輸出要<b>空一行</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;

void solve(string text, bool &first) {
    // 行尾的連字號吃掉換行，讓單字跨行接續
    string t;
    for (size_t i = 0; i < text.size(); i++) {
        if (text[i] == '-' && i + 1 < text.size() && text[i + 1] == '\\n') { i++; continue; }
        t += text[i];
    }
    map<int, int> freq;
    int len = 0;
    for (size_t i = 0; i <= t.size(); i++) {
        char c = (i < t.size()) ? t[i] : ' ';
        if (isalpha((unsigned char)c)) len++;              // 只有字母計長度
        else if (c == '-' || c == '\\'') continue;          // 連接但不計數
        else { if (len) freq[len]++; len = 0; }            // 其他字元 → 斷字
    }
    if (!first) cout << "\\n";
    first = false;
    for (map<int, int>::iterator it = freq.begin(); it != freq.end(); ++it)
        cout << it->first << " " << it->second << "\\n";
}

int main() {
    string line, block;
    bool first = true;
    while (getline(cin, line)) {
        if (!line.empty() && line[0] == '#') { solve(block, first); block.clear(); }
        else block += line + "\\n";
    }
    return 0;
}`
},

10002: {
  q: "Center of Masses：給一個凸多邊形的所有頂點（<b>順序任意</b>），求它的<b>質心</b>（面積重心），取 3 位小數。",
  h: "兩個步驟：<br><b>① 把頂點排成正確的環繞順序</b>——題目說「順序任意」，所以要先算出<b>頂點平均點</b>當中心，再依 <code>atan2(y − cy, x − cx)</code> 排序。凸多邊形這樣排一定得到正確的多邊形。<br><b>② 套多邊形質心公式</b>（注意<b>不是</b>頂點的平均！）：<br><code>A = ½ Σ (xᵢ·yᵢ₊₁ − xᵢ₊₁·yᵢ)</code><br><code>Cx = (1/6A) Σ (xᵢ + xᵢ₊₁)(xᵢ·yᵢ₊₁ − xᵢ₊₁·yᵢ)</code>，Cy 同理<br>驗算：正方形 ⇒ (0.500, 0.500) ✓；三角形 (1,2)(1,0)(0,0) ⇒ (0.667, 0.667) ✓（三角形的質心剛好等於頂點平均，但一般多邊形<b>不是</b>）。",
  t: "① <b>頂點平均 ≠ 多邊形質心</b>（只有三角形恰好相等），一定要用面積加權的公式。<br>② 頂點順序是亂的，<b>必須先依角度排序</b>，否則叉積會亂算。<br>③ 排序中心用「頂點平均」即可（凸多邊形保證在內部）。<br>④ 公式裡的 <code>i+1</code> 要<b>循環回 0</b>。<br>⑤ 輸出 3 位小數，兩個座標<b>同一行、空白分隔</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cout << fixed << setprecision(3);
    int n;
    while (cin >> n) {
        vector<double> x(n), y(n);
        double sx = 0, sy = 0;
        for (int i = 0; i < n; i++) { cin >> x[i] >> y[i]; sx += x[i]; sy += y[i]; }
        sx /= n; sy /= n;

        vector<int> idx(n);
        for (int i = 0; i < n; i++) idx[i] = i;
        // 依繞著中心的角度排序，還原多邊形的環繞順序
        vector<pair<double, int> > ang(n);
        for (int i = 0; i < n; i++) ang[i] = make_pair(atan2(y[i] - sy, x[i] - sx), i);
        sort(ang.begin(), ang.end());

        double A = 0, cx = 0, cy = 0;
        for (int i = 0; i < n; i++) {
            int a = ang[i].second, b = ang[(i + 1) % n].second;
            double cross = x[a] * y[b] - x[b] * y[a];
            A += cross;
            cx += (x[a] + x[b]) * cross;
            cy += (y[a] + y[b]) * cross;
        }
        A /= 2;
        cout << cx / (6 * A) << " " << cy / (6 * A) << "\\n";
    }
    return 0;
}`
},

11629: {
  q: "Ballot evaluation：給各政黨的得票率（<b>一位小數</b>），再給若干猜測如 <code>CDU + SPD &lt; 50</code>，判斷每個猜測是否正確。",
  h: "邏輯很單純，重點在<b>浮點陷阱</b>：得票率是一位小數，直接用 <code>double</code> 相加再比較，會出現 <code>30.7 + 20.8 = 51.499999…</code> 這種誤差，在邊界（剛好相等）時判錯。<br><b>解法：全部乘 10 轉成整數</b>——讀進 double 後 <code>llround(p * 10)</code>，比較的數字也乘 10，之後純整數運算，零誤差。<br>解析上把整行讀進來用 <code>istringstream</code> 切詞：政黨名與 <code>+</code> 交替出現，直到遇到比較運算子為止。<br>用 <code>map&lt;string, ll&gt;</code> 查政黨得票率。",
  t: "① <b>一定要轉成整數</b>（×10）再比較——這題的測資就是設計來卡浮點誤差的。<br>② 運算子有 <b>五種</b>：<code>&lt; &gt; &lt;= &gt;= =</code>，別漏掉 <code>=</code>。<br>③ 政黨名可能重複出現在同一個猜測裡（要重複累加）。<br>④ 輸出 <code>Guess #k was correct.</code> / <code>… was incorrect.</code>，句尾有句號。<br>⑤ 猜測最多 10000 個，用 <code>sync_with_stdio(false)</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, g;
    while (cin >> n >> g) {
        map<string, ll> pct;
        for (int i = 0; i < n; i++) {
            string name; double p;
            cin >> name >> p;
            pct[name] = llround(p * 10);                   // 乘 10 轉整數
        }
        cin.ignore();
        for (int i = 1; i <= g; i++) {
            string line; getline(cin, line);
            istringstream is(line);
            string tok;
            ll sum = 0; string op;
            while (is >> tok) {
                if (tok == "+") continue;
                if (tok == "<" || tok == ">" || tok == "<=" || tok == ">=" || tok == "=") {
                    op = tok; break;
                }
                sum += pct[tok];
            }
            ll rhs; is >> rhs; rhs *= 10;
            bool ok = false;
            if (op == "<") ok = sum < rhs;
            else if (op == ">") ok = sum > rhs;
            else if (op == "<=") ok = sum <= rhs;
            else if (op == ">=") ok = sum >= rhs;
            else ok = (sum == rhs);
            cout << "Guess #" << i << " was " << (ok ? "correct." : "incorrect.") << "\\n";
        }
    }
    return 0;
}`
},

11997: {
  q: "K Smallest Sums：給 k 個陣列、每個有 k 個整數，從每個陣列各取一個相加共有 <code>kᵏ</code> 種和。求<b>最小的 k 個和</b>（遞增輸出）。k ≤ 750。",
  h: "<code>kᵏ</code> 大到無法枚舉，關鍵是<b>兩兩合併</b>：<br><b>子問題</b>：給兩個長度 k 的<b>已排序</b>陣列 A、B，求 <code>A[i] + B[j]</code> 中<b>最小的 k 個</b>。<br>作法：把 k 個候選 <code>(A[i] + B[0], i, 0)</code> 丟進<b>小根堆</b>，每次取出最小的 <code>(A[i]+B[j], i, j)</code> 就記錄答案，並把 <code>(A[i]+B[j+1], i, j+1)</code> 推進去。取 k 次即可。O(k log k)。<br><b>整體</b>：把第 1、2 個陣列合併成一個長度 k 的「最小 k 個和」陣列，再拿它跟第 3 個合併…如此重複 k−1 次。<br>總複雜度 O(k² log k) ≈ 750² × 10 ≈ 500 萬，穩過。<br>正確性：<b>只保留最小的 k 個不會漏掉最終答案</b>——因為最終的第 k 小，在每個前綴裡也不會用到比第 k 小更大的部分和。",
  t: "① <b>每次合併只留 k 個</b>是關鍵；留多了會爆記憶體、留少了會錯。<br>② 兩陣列<b>都要先排序</b>，堆的初始候選才正確。<br>③ 堆裡要記 <code>(和, i, j)</code>，推進時只沿 <b>j 方向</b>前進，避免重複。<br>④ 和可能很大，用 <code>long long</code> 較保險。<br>⑤ 讀到 EOF 結束；輸出 k 個數<b>同一行、空白分隔</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
typedef pair<ll, pair<int, int> > Node;                    // (和, i, j)

// 回傳 A[i] + B[j] 之中最小的 k 個（A、B 皆已排序）
vector<ll> mergeK(vector<ll> &A, vector<ll> &B, int k) {
    priority_queue<Node, vector<Node>, greater<Node> > pq;
    for (int i = 0; i < k; i++) pq.push(make_pair(A[i] + B[0], make_pair(i, 0)));
    vector<ll> res;
    for (int t = 0; t < k; t++) {
        Node cur = pq.top(); pq.pop();
        res.push_back(cur.first);
        int i = cur.second.first, j = cur.second.second;
        if (j + 1 < k) pq.push(make_pair(A[i] + B[j + 1], make_pair(i, j + 1)));
    }
    return res;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int k;
    while (cin >> k) {
        vector<ll> cur(k);
        for (int i = 0; i < k; i++) cin >> cur[i];
        sort(cur.begin(), cur.end());
        for (int r = 1; r < k; r++) {
            vector<ll> b(k);
            for (int i = 0; i < k; i++) cin >> b[i];
            sort(b.begin(), b.end());
            cur = mergeK(cur, b, k);                       // 每次只留最小的 k 個
        }
        for (int i = 0; i < k; i++) cout << (i ? " " : "") << cur[i];
        cout << "\\n";
    }
    return 0;
}`
},

10670: {
  q: "Work Reduction：桌上有 n 份文件，要減到 m 份。每家公司提供兩種服務：花 <code>a</code> 元<b>移除 1 份</b>，或花 <code>b</code> 元<b>移除一半</b>（剩下 <code>⌊目前/2⌋</code> 份）。求每家公司的<b>最低花費</b>，並依花費由小到大輸出。",
  h: "先觀察：<b>「減半」永遠應該做在前面</b>（數量越大，減半移除得越多）。所以最佳策略必定形如「<b>先減半 j 次，再逐份移除剩下的</b>」。<br>於是只要<b>枚舉減半次數 j</b>（最多 log₂n ≈ 30 次）：<br><code>cost(j) = j·b + (n 減半 j 次後的值 − m) · a</code>，且必須 <code>減半 j 次後 ≥ m</code>。<br>取所有 j 的最小值即可，O(log n) 每家公司。<br>驗算樣例（n=100, m=5）：<code>A(1,10)</code> ⇒ 減半 3 次到 12（30 元）再移除 7 份 = <b>37</b> ✓；<code>C(3,1)</code> ⇒ 減半 4 次到 6（4 元）再移除 1 份 = <b>7</b> ✓。",
  t: "① <b>減半是向下取整</b>（100 → 50 → 25 → 12 → 6），算錯就整個對不上。<br>② 減半後<b>不可低於 m</b>，所以 j 要在還 ≥ m 時才合法。<br>③ 「先減半後逐份」的順序論證是本題核心；混合順序不會更好。<br>④ 排序是<b>依花費遞增</b>，<b>平手時保持輸入順序</b>（用 <code>stable_sort</code>）。<br>⑤ 輸出格式 <code>Case k</code> 一行，之後每行 <code>公司名 花費</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int tc = 1; tc <= T; tc++) {
        ll n, m; int c;
        cin >> n >> m >> c;
        vector<pair<ll, string> > res;
        for (int i = 0; i < c; i++) {
            string line; cin >> line;
            size_t p1 = line.find(':'), p2 = line.find(',');
            string name = line.substr(0, p1);
            ll a = atoll(line.substr(p1 + 1, p2 - p1 - 1).c_str());
            ll b = atoll(line.substr(p2 + 1).c_str());

            ll best = LLONG_MAX, cur = n;
            for (ll j = 0; cur >= m; j++) {                // 枚舉減半次數
                best = min(best, j * b + (cur - m) * a);
                if (cur / 2 < m) break;
                cur /= 2;                                  // 減半是向下取整
            }
            res.push_back(make_pair(best, name));
        }
        stable_sort(res.begin(), res.end());               // 平手保持輸入順序
        cout << "Case " << tc << "\\n";
        for (size_t i = 0; i < res.size(); i++)
            cout << res[i].second << " " << res[i].first << "\\n";
    }
    return 0;
}`
},

10440: {
  q: "Ferry Loading II：渡輪一次載 n 輛車、單程 t 分鐘。m 輛車依<b>抵達時間遞增</b>給定。求<b>最後一輛車送達的時間</b>與<b>最少航行趟數</b>。",
  h: "兩層貪心：<br><b>① 趟數</b>：至少要 <code>⌈m / n⌉</code> 趟，而且這個下界一定達得到。<br><b>② 時間</b>：在趟數固定的前提下，要讓<b>最後一趟越早出發越好</b> ⇒ <b>第一趟載「餘數」那幾輛</b>（<code>m − (趟數−1)·n</code> 輛），之後每趟都載滿 n 輛。這樣後面每一趟都能盡早湊滿出發。<br>接著逐趟模擬：<br><code>出發 = max(渡輪回到岸邊的時刻, 該趟最後一輛車的抵達時刻)</code>，<code>抵達 = 出發 + t</code>，若不是最後一趟再加 t（空船返航）。<br>驗算：<code>n=2, t=10</code>、10 輛車（0..90）⇒ 5 趟、最後送達 <b>100</b> ✓；3 輛車（10, 30, 40）⇒ 2 趟、<b>50</b> ✓。",
  t: "① <b>第一趟載餘數</b>是本題的關鍵貪心；平均分配或最後一趟載餘數都會讓時間變差。<br>② 出發時刻要取 <code>max(渡輪就緒時刻, 最後一輛車抵達時刻)</code>——車還沒到就得等。<br>③ <b>返航也要 t 分鐘</b>，但最後一趟不用回來。<br>④ 抵達時間已排序（題目保證），不必再 sort。<br>⑤ 輸出<b>兩個數</b>：時間與趟數。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        ll n, t; int m;
        cin >> n >> t >> m;
        vector<ll> a(m);
        for (int i = 0; i < m; i++) cin >> a[i];

        ll trips = (m + n - 1) / n;                        // 趟數下界
        ll first = m - (trips - 1) * n;                    // 第一趟載餘數
        ll cur = 0;
        int idx = 0;
        for (ll k = 0; k < trips; k++) {
            ll take = (k == 0) ? first : n;
            idx += (int)take;
            cur = max(cur, a[idx - 1]) + t;                // 車沒到就得等
            if (k + 1 < trips) cur += t;                   // 空船返航
        }
        cout << cur << " " << trips << "\\n";
    }
    return 0;
}`
},

10508: {
  q: "Word Morphing：給 n 個等長單字，第一個是起點、第二個是終點，其餘是中途。把它們排成一條鏈，使<b>相鄰兩個單字恰好差一個字母</b>，輸出整條鏈。",
  h: "「相鄰差一個字母」構成一張圖，而題目保證這些單字剛好排成<b>一條鏈（路徑）</b> ⇒ 起點的度數為 1，<b>從起點開始貪心走</b>就是唯一解：<br>每次在<b>還沒用過</b>的單字中，找一個與目前單字<b>恰好差一個字母</b>的，走過去、標記已用，重複 n−1 次。<br>因為是路徑，每一步的選擇都唯一（除了已走過的那個），所以不會走錯也不必回溯。<br>複雜度 O(n² × 字長)。<br>驗算：<code>remar → remas → remos → retos → ritos → pitos</code> ✓ 與樣例吻合。",
  t: "① 「恰好差一個字母」= 逐位比較，<b>不同的位數剛好等於 1</b>（不是 ≤ 1）。<br>② 一定要<b>標記已使用</b>，否則會在兩個單字之間來回震盪。<br>③ 第二個輸入的單字是<b>終點</b>，它會自然出現在鏈的最後（不必特別處理，但可以拿來驗證）。<br>④ 輸入順序：<code>n 字長</code>、起點、終點、其餘。<br>⑤ 輸出<b>整條鏈</b>（含起點與終點），一行一個。",
  c: `#include <bits/stdc++.h>
using namespace std;

int diff(const string &a, const string &b) {
    int d = 0;
    for (size_t i = 0; i < a.size(); i++) if (a[i] != b[i]) d++;
    return d;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, len;
    while (cin >> n >> len) {
        vector<string> w(n);
        for (int i = 0; i < n; i++) cin >> w[i];
        vector<char> used(n, 0);

        string cur = w[0];
        used[0] = 1;
        cout << cur << "\\n";
        for (int step = 1; step < n; step++) {
            for (int i = 0; i < n; i++) {
                if (used[i] || diff(cur, w[i]) != 1) continue;   // 恰好差一個字母
                used[i] = 1; cur = w[i];
                cout << cur << "\\n";
                break;
            }
        }
    }
    return 0;
}`
},

10738: {
  q: "Riemann vs Mertens：對每個 <code>n ≤ 10⁶</code>，輸出 n、<b>莫比烏斯函數 μ(n)</b> 與 <b>梅騰斯函數 M(n) = Σ μ(k)</b>，三個數各<b>靠右對齊、欄寬 8</b>。",
  h: "<b>用篩法一次算出所有 μ</b>：<br>初始 <code>mu[1] = 1</code>；對每個 i 由小到大，把 <code>mu[i]</code> 的<b>相反數</b>加到所有 i 的倍數上（<code>mu[j] -= mu[i]</code>）——這是從 <code>Σ_{d|n} μ(d) = [n == 1]</code> 直接推出來的篩法，簡潔又不易錯。<br>接著做<b>前綴和</b>得到 M(n)。<br>預處理 O(n log n) ≈ 2000 萬，之後每筆詢問 O(1)。<br>μ 的定義複習：n 有平方因數 ⇒ 0；否則質因數個數為偶 ⇒ +1、為奇 ⇒ −1。（<code>μ(20) = 0</code> 因為 20 = 2²·5；<code>μ(73) = −1</code> 因為 73 是質數。）",
  t: "① <b>一定要預處理</b>——最多 1000 筆詢問但值域到 10⁶，逐筆分解質因數會慢。<br>② 篩法寫成 <code>for i: for j = 2i, 3i, …: mu[j] -= mu[i]</code>，起始 <code>mu[1] = 1</code>，其餘為 0。<br>③ 記憶體：兩條 10⁶ 的 <code>int</code> 陣列共 8 MB，安全。<br>④ 輸出要<b>靠右對齊、欄寬 8</b>（<code>setw(8)</code>），三個數同一行。<br>⑤ 讀到 EOF 結束；同一個數字可能重複出現。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const int MX = 1000000;
    vector<int> mu(MX + 1, 0), M(MX + 1, 0);
    mu[1] = 1;
    for (int i = 1; i <= MX; i++)                          // 由 Σ_{d|n} μ(d) = [n==1] 推得
        for (int j = 2 * i; j <= MX; j += i) mu[j] -= mu[i];
    for (int i = 1; i <= MX; i++) M[i] = M[i - 1] + mu[i]; // 梅騰斯函數 = 前綴和

    int n;
    while (cin >> n)
        cout << setw(8) << n << setw(8) << mu[n] << setw(8) << M[n] << "\\n";
    return 0;
}`
}
};

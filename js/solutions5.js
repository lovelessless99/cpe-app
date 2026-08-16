/* 歷屆高答對率題（第四批）— 依 CPE 官方考生答對率由高而低 */
const SOL5 = {
11942: {
  q: "給 10 個數，判斷它們是<b>嚴格遞增</b>還是<b>嚴格遞減</b>；兩者皆非則不合格。",
  h: "掃一遍分別檢查兩個條件。",
  t: "只要不是嚴格遞增也不是嚴格遞減就輸出 Unordered。輸出前有固定的表頭兩行，別漏掉。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    cout << "Lumberjacks:\\n";
    while (T--) {
        vector<int> a(10);
        for (int &x : a) cin >> x;
        bool inc = true, dec = true;
        for (int i = 1; i < 10; i++) {
            if (a[i] <= a[i-1]) inc = false;
            if (a[i] >= a[i-1]) dec = false;
        }
        cout << (inc || dec ? "Ordered" : "Unordered") << "\\n";
    }
}`
},
11764: {
  q: "馬力歐依序經過若干面牆，數出他往<b>上</b>跳幾次（下一面比較高）與往<b>下</b>跳幾次。",
  h: "掃一遍比較相鄰兩個高度，分別計數。相等不算。",
  t: "輸出句型固定：<code>Case k: X Y</code>。只有一面牆時兩個答案都是 0。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int k = 1; k <= T; k++) {
        int n; cin >> n;
        vector<int> a(n);
        for (int &x : a) cin >> x;
        int hi = 0, lo = 0;
        for (int i = 1; i < n; i++) {
            if (a[i] > a[i-1]) hi++;
            else if (a[i] < a[i-1]) lo++;
        }
        cout << "Case " << k << ": " << hi << " " << lo << "\\n";
    }
}`
},
488: {
  q: "給振幅 A 與重複次數 F，印出三角波：<code>1 / 22 / 333 / … / AAAA… / … / 333 / 22 / 1</code>，整組重複 F 次。",
  h: "兩層迴圈：先從 1 印到 A（第 i 行印 i 個字元 i），再從 A−1 印回 1。外面再包一層重複 F 次。",
  t: "<b>每個三角波之間空一行、最後一個之後不空</b>——這題的 WA 幾乎都出在這裡。用「印在前面」的寫法最安全。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    bool first = true;
    while (T--) {
        int A, F; cin >> A >> F;
        while (F--) {
            if (!first) cout << "\\n";          // 之間空行，最後不空
            first = false;
            for (int i = 1; i <= A; i++) cout << string(i, '0' + i) << "\\n";
            for (int i = A - 1; i >= 1; i--) cout << string(i, '0' + i) << "\\n";
        }
    }
}`
},
11455: {
  q: "給四個邊長，判斷是正方形、長方形、一般四邊形，還是根本不是四邊形。",
  h: "排序後：四邊相等是 square；兩兩相等是 rectangle；最長邊 ≥ 其餘三邊之和就 banana（構不成四邊形）；否則 quadrangle。",
  t: "判斷<b>順序</b>很重要：先判 square、再 rectangle，最後才判能不能構成四邊形。四邊形成立條件是「最長邊 < 其他三邊之和」。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        vector<long long> a(4);
        for (auto &x : a) cin >> x;
        sort(a.begin(), a.end());
        if (a[0] == a[3]) cout << "square\\n";
        else if (a[0] == a[1] && a[2] == a[3]) cout << "rectangle\\n";
        else if (a[3] >= a[0] + a[1] + a[2]) cout << "banana\\n";   // 構不成四邊形
        else cout << "quadrangle\\n";
    }
}`
},
591: {
  q: "一排磚塔高度不一，每次可搬一塊磚。問最少搬幾塊能讓所有塔一樣高。",
  h: "算出平均值，答案是<b>所有高於平均的部分之總和</b>（那些多出來的磚必須搬走）。",
  t: "題目保證總和能被 n 整除。輸出含 <code>Set #k</code> 與固定句型，<b>測資之間要空行</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, kase = 0;
    while (cin >> n && n) {
        vector<int> a(n);
        int sum = 0;
        for (int &x : a) { cin >> x; sum += x; }
        int avg = sum / n, moves = 0;
        for (int x : a) if (x > avg) moves += x - avg;   // 只算多出來的
        cout << "Set #" << ++kase << "\\n";
        cout << "The minimum number of moves is " << moves << ".\\n\\n";
    }
}`
},
11743: {
  q: "用 Luhn 演算法驗證信用卡號是否合法。",
  h: "從<b>右邊</b>數起，偶數位（第 2、4、6…）乘 2，若超過 9 則減 9；全部相加後能被 10 整除就合法。",
  t: "是從<b>右</b>邊開始數位置，方向搞反就全錯。乘 2 後大於 9 要減 9（等同於各位數字相加）。輸入含空格，要整行讀再過濾。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T; cin.ignore();
    string line;
    while (T-- && getline(cin, line)) {
        string d;
        for (char c : line) if (isdigit((unsigned char)c)) d += c;
        int sum = 0;
        for (int i = 0, pos = 0; i < (int)d.size(); i++) {
            int v = d[d.size() - 1 - i] - '0';           // 從右往左
            if (i % 2 == 1) { v *= 2; if (v > 9) v -= 9; }
            sum += v; (void)pos;
        }
        cout << (sum % 10 == 0 ? "Valid" : "Invalid") << "\\n";
    }
}`
},
1585: {
  q: "一串由 O 與 X 組成的答題紀錄，連續答對的第 k 題得 k 分（O 連續就累加，遇到 X 歸零）。求總分。",
  h: "掃一遍：遇到 O 就 <code>streak++</code> 並把 streak 加進總分；遇到 X 就 <code>streak = 0</code>。",
  t: "分數是<b>連續長度</b>而不是固定 1 分——OOO 得 1+2+3=6 分。這是唯一考點。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        string s; cin >> s;
        int streak = 0, total = 0;
        for (char c : s) {
            if (c == 'O') { streak++; total += streak; }   // 連續長度就是分數
            else streak = 0;
        }
        cout << total << "\\n";
    }
}`
},
1225: {
  q: "把 1 到 N 的數字全部串起來，數每個數字 0–9 各出現幾次。",
  h: "N ≤ 10000，直接對每個數逐位統計即可（約 4 萬次運算）。",
  t: "上限小，<b>不要過度優化</b>去推數學公式。輸出十個數字用空格分隔。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        int cnt[10] = {0};
        for (int i = 1; i <= n; i++)
            for (int t = i; t; t /= 10) cnt[t % 10]++;
        for (int i = 0; i < 10; i++) cout << cnt[i] << " \\n"[i == 9];
    }
}`
},
11364: {
  q: "一條街上有若干店家，車子停一個位置後要走訪全部店家再回到車上。求最少步行距離。",
  h: "答案是 <code>2 × (最大座標 − 最小座標)</code>——把車停在區間內任一點，來回都要走完整段。",
  t: "想通「停哪裡都一樣」是關鍵。乘 2 是因為要<b>走回車上</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        int mn = INT_MAX, mx = INT_MIN;
        while (n--) { int x; cin >> x; mn = min(mn, x); mx = max(mx, x); }
        cout << 2 * (mx - mn) << "\\n";
    }
}`
},
913: {
  q: "把奇數 1, 3, 5, 7… 依序分組：第 1 組 1 個、第 2 組 2 個、第 3 組 3 個…求第 n 組的總和。",
  h: "第 n 組有 n 個數，前面已用掉 <code>n(n−1)/2</code> 個奇數。第 k 個奇數是 <code>2k−1</code>，用等差級數求和可得答案是 <code>n³</code>。",
  t: "答案就是 <b>n³</b>——先算前幾組驗證（1, 8, 27…）就能看出來。n 可到 10⁴，n³ 會超過 int，用 long long。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        long long n; cin >> n;
        cout << n * n * n << "\\n";           // 手算前幾組即可驗證
    }
}`
},
12195: {
  q: "一段樂譜以 <code>/</code> 分隔小節，每個音符有時值（1=全音符、2=二分…8=八分）。數出有幾個小節的時值總和恰好為 1。",
  h: "以 <code>/</code> 切開，每段把各音符的 <code>1/x</code> 累加。用<b>通分</b>成 64 分音符為單位（1/x → 64/x）避免浮點誤差，總和等於 64 就是合法小節。",
  t: "<b>不要用浮點數相加</b>比較是否等於 1，會有精度問題。全部乘 64 化成整數最穩。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string s;
    while (cin >> s && s != "*") {
        int cnt = 0, cur = 0;
        for (char c : s) {
            if (c == '/') { if (cur == 64) cnt++; cur = 0; }
            else cur += 64 / (c - '0');       // 通分成 64 分音符，避開浮點
        }
        if (cur == 64) cnt++;                 // 最後一小節
        cout << cnt << "\\n";
    }
}`
},
11192: {
  q: "把字串平均分成 G 組，每組各自反轉後接回去輸出。",
  h: "每組長度 = <code>len / G</code>，逐組用 <code>reverse</code> 處理。",
  t: "題目保證能整除。<b>只反轉組內</b>，組的順序不變——這點寫反就全錯。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int g;
    while (cin >> g && g) {
        string s; cin >> s;
        int len = s.size() / g;
        for (int i = 0; i < g; i++)
            reverse(s.begin() + i * len, s.begin() + (i + 1) * len);   // 只反轉組內
        cout << s << "\\n";
    }
}`
},
10474: {
  q: "先給 N 顆彈珠與 Q 個查詢，每個查詢問某個數字排序後在第幾個位置。",
  h: "<code>sort</code> 後用 <code>lower_bound</code> 找位置，位置 = 迭代器差 + 1。",
  t: "<code>lower_bound</code> 找不到時會指向<b>第一個大於它的元素</b>而不是 end()，<b>必須額外檢查該位置的值是否真的等於查詢值</b>。位置是 1-based 記得 +1。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, q, kase = 0;
    while (cin >> n >> q && (n || q)) {
        vector<int> a(n);
        for (int &x : a) cin >> x;
        sort(a.begin(), a.end());
        cout << "CASE# " << ++kase << ":\\n";
        while (q--) {
            int x; cin >> x;
            auto it = lower_bound(a.begin(), a.end(), x);
            if (it != a.end() && *it == x)                 // 一定要驗值
                cout << x << " found at " << (it - a.begin() + 1) << "\\n";
            else cout << x << " not found\\n";
        }
    }
}`
},
10082: {
  q: "打字時右手整排往右偏了一格，給打出來的文字還原原文。",
  h: "把鍵盤四排寫成一個常數字串，找到字元位置後輸出<b>前一個</b>字元。",
  t: "<b>空白不在佈局表裡，要原樣輸出</b>。必須用 getline，用 <code>cin >></code> 會吃掉空白。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string kb = "\`1234567890-=QWERTYUIOP[]\\\\ASDFGHJKL;'ZXCVBNM,./";
    string line;
    while (getline(cin, line)) {
        for (char c : line) {
            size_t p = kb.find(c);
            cout << (p == string::npos ? c : kb[p - 1]);   // 空白等找不到就原樣輸出
        }
        cout << "\\n";
    }
}`
},
10591: {
  q: "判斷一個數是不是快樂數：反覆把各位數字平方後相加，最終變成 1 就是快樂數，否則會進入循環。",
  h: "用 <code>set</code> 記錄看過的值，出現重複就代表進入循環（不快樂）。",
  t: "循環一定會發生（值會收斂到很小的範圍），所以用 set 判重是安全的。輸出句型含 <code>Case #k: N is</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int k = 1; k <= T; k++) {
        long long n; cin >> n;
        long long cur = n;
        set<long long> seen;
        while (cur != 1 && !seen.count(cur)) {
            seen.insert(cur);
            long long s = 0;
            for (long long t = cur; t; t /= 10) s += (t % 10) * (t % 10);
            cur = s;
        }
        cout << "Case #" << k << ": " << n << " is "
             << (cur == 1 ? "" : "not ") << "a Happy number.\\n";
    }
}`
},
1587: {
  q: "給六個長方形的長寬，判斷它們能不能剛好組成一個長方體。",
  h: "把每個面的長寬<b>正規化</b>（小的在前），全部排序後檢查是否形成三組、每組兩個相同的面，且三組的邊長彼此能對得起來。",
  t: "每個面要先 <code>swap</code> 讓長 ≤ 寬再排序，否則同一個面用不同方向給就配不起來。這是本題唯一難點。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int a, b;
    while (cin >> a >> b) {
        vector<pair<int,int>> f;
        if (a > b) swap(a, b);
        f.push_back({a, b});
        for (int i = 1; i < 6; i++) {
            cin >> a >> b;
            if (a > b) swap(a, b);              // 正規化
            f.push_back({a, b});
        }
        sort(f.begin(), f.end());
        bool ok = f[0] == f[1] && f[2] == f[3] && f[4] == f[5]
               && f[0].first == f[2].first && f[0].second == f[4].first
               && f[2].second == f[4].second;
        cout << (ok ? "POSSIBLE" : "IMPOSSIBLE") << "\\n";
    }
}`
},
499: {
  q: "找出一行文字中出現次數<b>最多</b>的字母（可能多個），輸出它們與該次數。",
  h: "開 128 格計數陣列，先求最大值再輸出所有等於最大值的字元。",
  t: "只算<b>字母</b>，大小寫視為不同。可能有多個並列，要全部輸出且按 ASCII 順序。用 getline 讀整行。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string line;
    while (getline(cin, line)) {
        int cnt[128] = {0};
        for (unsigned char c : line) if (isalpha(c)) cnt[c]++;
        int mx = 0;
        for (int i = 0; i < 128; i++) mx = max(mx, cnt[i]);
        if (mx == 0) { cout << "\\n"; continue; }
        for (int i = 0; i < 128; i++) if (cnt[i] == mx) cout << char(i);   // 全部並列的
        cout << " " << mx << "\\n";
    }
}`
},
10487: {
  q: "給 n 個數與若干查詢，對每個查詢找出「任兩個相異元素之和」中<b>最接近</b>查詢值的那個和。",
  h: "n ≤ 1000，先把所有 C(n,2) 個兩兩之和算出來（約 50 萬個），對每個查詢掃一遍找最接近的。或排序後二分。",
  t: "是<b>兩個相異元素</b>，不能同一個用兩次。距離相同時取哪個依原題規定（通常任一即可）。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, kase = 0;
    while (cin >> n && n) {
        vector<int> a(n);
        for (int &x : a) cin >> x;
        vector<int> sums;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++) sums.push_back(a[i] + a[j]);   // 相異兩個
        sort(sums.begin(), sums.end());
        int m; cin >> m;
        cout << "Case " << ++kase << ":\\n";
        while (m--) {
            int q; cin >> q;
            auto it = lower_bound(sums.begin(), sums.end(), q);
            int best = sums[0];
            if (it != sums.end()) best = *it;
            if (it != sums.begin() && (it == sums.end() || abs(*prev(it) - q) <= abs(*it - q)))
                best = *prev(it);
            cout << "Closest sum to " << q << " is " << best << ".\\n";
        }
    }
}`
},
11233: {
  q: "把英文單字變成複數：有例外表就查表；以子音+y 結尾把 y 換成 ies；以 o, s, ch, sh, x 結尾加 es；其餘加 s。",
  h: "先建例外表（<code>map&lt;string,string&gt;</code>），查得到直接輸出；查不到才依規則判斷字尾。",
  t: "規則的<b>判斷順序</b>要對，而且「子音 + y」才變 ies（母音 + y 只加 s）。字尾兩個字元的規則（ch/sh）要先檢查長度足夠。",
  c: `#include <bits/stdc++.h>
using namespace std;

bool endsWith(const string &s, const string &t) {
    return s.size() >= t.size() && s.compare(s.size() - t.size(), t.size(), t) == 0;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int L, N; cin >> L >> N;
    map<string,string> ex;
    while (L--) { string a, b; cin >> a >> b; ex[a] = b; }
    while (N--) {
        string w; cin >> w;
        if (ex.count(w)) { cout << ex[w] << "\\n"; continue; }
        string vowels = "aeiou";
        if (w.back() == 'y' && vowels.find(w[w.size()-2]) == string::npos)
            cout << w.substr(0, w.size()-1) << "ies\\n";      // 子音 + y
        else if (w.back() == 'o' || w.back() == 's' || w.back() == 'x'
                 || endsWith(w, "ch") || endsWith(w, "sh"))
            cout << w << "es\\n";
        else cout << w << "s\\n";
    }
}`
},
455: {
  q: "求字串的<b>最小週期</b>長度。",
  h: "從 1 到 n 枚舉週期 p，只有能整除 n 的 p 才可能；檢查每個位置是否等於 <code>s[i % p]</code>。找到第一個成立的就是答案。",
  t: "週期必須<b>整除</b>字串長度。找不到時答案就是 n 本身。<b>測資之間空行、最後一筆不空</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    bool first = true;
    while (T--) {
        string s; cin >> s;
        int n = s.size(), ans = n;
        for (int p = 1; p <= n; p++) {
            if (n % p) continue;                  // 必須整除
            bool ok = true;
            for (int i = p; i < n && ok; i++) if (s[i] != s[i % p]) ok = false;
            if (ok) { ans = p; break; }
        }
        if (!first) cout << "\\n";
        first = false;
        cout << ans << "\\n";
    }
}`
},
686: {
  q: "給偶數 n，數出有多少組 <code>a + b = n</code> 且 a、b 皆為質數、a ≤ b。",
  h: "先篩出質數表，再從 a = 2 掃到 n/2，檢查 a 與 n−a 是否都是質數。",
  t: "因為要求 <b>a ≤ b</b>，所以只掃到 n/2 就好，掃到 n 會算成兩倍。篩表放迴圈外只建一次。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const int N = 32770;
    vector<bool> notp(N, false);
    for (int i = 2; (long long)i * i < N; i++)
        if (!notp[i]) for (int j = i * i; j < N; j += i) notp[j] = true;
    int n;
    while (cin >> n && n) {
        int cnt = 0;
        for (int a = 2; a <= n / 2; a++)          // 只掃到一半，避免重複計數
            if (!notp[a] && !notp[n - a]) cnt++;
        cout << cnt << "\\n";
    }
}`
},
263: {
  q: "數字鏈：把一個數的各位數字由大到小排成 A、由小到大排成 B，下一個數是 A − B。反覆直到出現重複，求鏈長。",
  h: "用 <code>set</code> 或 <code>map</code> 記錄看過的數，出現重複就停，長度即為看過的個數。",
  t: "產生的數要<b>去掉前導零</b>再繼續（用整數運算自然就處理掉了）。鏈長的定義是含起點到重複前的個數，依原題確認。",
  c: `#include <bits/stdc++.h>
using namespace std;

long long step(long long n) {
    string s = to_string(n);
    sort(s.begin(), s.end());
    long long b = stoll(s);
    reverse(s.begin(), s.end());
    long long a = stoll(s);
    return a - b;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    long long n; int kase = 0;
    while (cin >> n && n) {
        set<long long> seen;
        long long cur = n;
        while (!seen.count(cur)) { seen.insert(cur); cur = step(cur); }
        if (kase++) cout << "\\n";
        cout << "Original number was " << n << "\\n";
        cout << "Chain length " << seen.size() << "\\n";
    }
}`
},
10633: {
  q: "給 M，找出所有可能的 N 使得 <code>N − N 的各位數字和 = M</code>。",
  h: "數字和最多不超過位數 × 9，所以 N 只可能落在 <code>[M, M + 200]</code> 這種小範圍內。直接在該範圍枚舉。",
  t: "M 可到 10¹⁶，用 <b>long long</b>。範圍要開得夠但不必大——數字和上限很小，這就是把大範圍縮成常數的關鍵。",
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll m;
    while (cin >> m && m) {
        int cnt = 0;
        for (ll n = m; n <= m + 200; n++) {       // 數字和上限很小
            ll s = 0;
            for (ll t = n; t; t /= 10) s += t % 10;
            if (n - s == m) cnt++;
        }
        cout << cnt << "\\n";
    }
}`
},
482: {
  q: "給一個索引排列與一個陣列，把陣列依索引重排：索引第 i 個是 p，代表原陣列第 i 個要放到位置 p。",
  h: "讀進兩行後，<code>res[p[i]] = a[i]</code>。索引是 1-based，記得減 1。",
  t: "要看清楚是「第 i 個放到 p」還是「位置 i 放原本的第 p 個」——<b>方向搞反就全錯</b>。數值可能是浮點或很長，用<b>字串</b>存最安全。測資之間空行。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T; cin.ignore();
    string line;
    getline(cin, line);
    bool first = true;
    while (T--) {
        vector<int> idx;
        vector<string> val;
        getline(cin, line);
        { stringstream ss(line); int x; while (ss >> x) idx.push_back(x); }
        getline(cin, line);
        { stringstream ss(line); string x; while (ss >> x) val.push_back(x); }
        vector<string> res(idx.size());
        for (size_t i = 0; i < idx.size(); i++) res[idx[i] - 1] = val[i];   // 1-based
        if (!first) cout << "\\n";
        first = false;
        for (auto &x : res) cout << x << "\\n";
        getline(cin, line);                       // 吃掉分隔空行
    }
}`
},
11389: {
  q: "把 n 條路線分配給 n 位司機，每人一條早班一條晚班。若某人總時數超過 d，每超過 1 小時罰 r 元。求最少罰金。",
  h: "<b>貪心</b>：早班由小到大排、晚班由大到小排，兩兩配對。這樣能讓最大總和最小。",
  t: "想通「最長配最短」是本題全部。超時才罰，沒超過不算負的——記得 <code>max(0, ...)</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, d, r;
    while (cin >> n >> d >> r && (n || d || r)) {
        vector<int> a(n), b(n);
        for (int &x : a) cin >> x;
        for (int &x : b) cin >> x;
        sort(a.begin(), a.end());
        sort(b.rbegin(), b.rend());               // 一升一降配對
        long long fine = 0;
        for (int i = 0; i < n; i++)
            fine += max(0, a[i] + b[i] - d) * (long long)r;
        cout << fine << "\\n";
    }
}`
}
};

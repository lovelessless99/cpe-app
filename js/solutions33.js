/* 二星題庫（第十六批 5 題） */
const SOL33 = {
10527: {
  q: "Persistent Numbers：給一個最多 <b>1000 位</b>的數 N，求<b>最小的正整數 M</b>，使 M 的各位數字相乘等於 N；不存在則輸出 <code>There is no such number.</code>",
  h: "M 的每一位都是 0..9，所以 N 只能由 <b>2..9 這些因數</b>組成 ⇒ 若 N 含有<b>大於 7 的質因數</b>（11、13、17…）就無解。<br><b>貪心的關鍵</b>：要讓 M 最小，就要<b>位數最少</b>，也就是每一位盡量大 ⇒ <b>從 9 往 2 依序把 N 除乾淨</b>。除完後把收集到的數字<b>由小到大排列</b>就是最小的 M。<br><b>單位數要特判</b>：N &lt; 10 時答案是 <code>1</code> 接上 N（例如 N=4 ⇒ <b>14</b>、N=0 ⇒ <b>10</b>、N=1 ⇒ <b>11</b>），因為 M 必須真的「相乘」出 N。<br>N 有 1000 位 ⇒ 需要<b>大數除以小數</b>（取商與餘數），一次掃過每一位即可。",
  t: "① <b>單位數 N 要特判成 <code>10 + N</code></b>——這是最多人錯的地方（N=1 的答案是 11 不是 1）。<br>② 一定要<b>從 9 往 2</b> 除，從 2 往 9 會得到位數更多的答案。<br>③ N 有 1000 位 ⇒ 全程用<b>字串</b>做大數除法，不能轉成整數。<br>④ 除完後若剩下的不是 1 ⇒ 有大質因數 ⇒ 無解。<br>⑤ 收集到的數字要<b>升序</b>輸出（同樣的數字集合，小的排前面才最小）。<br>⑥ 以 <code>-1</code> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

// 大數（字串）除以小數，回傳商（去前導零），rem 帶回餘數
string divSmall(const string &s, int d, int &rem) {
    string q;
    int cur = 0;
    for (size_t i = 0; i < s.size(); i++) {
        cur = cur * 10 + (s[i] - '0');
        q += char('0' + cur / d);
        cur %= d;
    }
    rem = cur;
    size_t p = q.find_first_not_of('0');
    return (p == string::npos) ? "0" : q.substr(p);
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string n;
    while (cin >> n && n != "-1") {
        if (n.size() == 1) { cout << "1" << n << "\\n"; continue; }   // 單位數特判

        string cur = n;
        vector<int> digits;
        for (int d = 9; d >= 2; d--) {                    // 由大到小 → 位數最少
            int rem;
            while (true) {
                string q = divSmall(cur, d, rem);
                if (rem) break;
                cur = q;
                digits.push_back(d);
            }
        }
        if (cur != "1") { cout << "There is no such number.\\n"; continue; }
        sort(digits.begin(), digits.end());               // 升序才最小
        for (size_t i = 0; i < digits.size(); i++) cout << digits[i];
        cout << "\\n";
    }
    return 0;
}`
},

11096: {
  q: "Nails：牆上有若干釘子，用一條<b>初始長度 L</b> 的橡皮筋圈住全部釘子。求橡皮筋最後的長度（5 位小數）。",
  h: "橡皮筋圈住所有點後的形狀就是<b>凸包（convex hull）</b>，長度是凸包周長。<br>但橡皮筋<b>不會縮得比原本短</b>（它有自然長度 L）⇒<br><code>答案 = max(L, 凸包周長)</code><br>凸包用 <b>Andrew's monotone chain</b>：先依 (x, y) 排序，再由左而右建下凸包、由右而左建上凸包，用<b>叉積 ≤ 0 就彈出</b>來維持凸性。O(n log n)。<br>驗算：四個點 (0,0)(0,1)(1,0)(1,1) 的凸包是單位正方形、周長 4 ⇒ L=2 時答案 <b>4</b>、L=5 時答案 <b>5</b> ✓。",
  t: "① <b>別忘了跟初始長度取 max</b>——這是本題唯一的變化，只算凸包會 WA。<br>② 點數可能 ≤ 2：一個點周長 0、兩個點是<b>來回兩趟</b>（<code>2 × 距離</code>）。<br>③ 凸包要處理<b>共線點</b>（用 <code>&lt;= 0</code> 彈出可去掉共線點，周長不受影響）。<br>④ 座標可能是實數，全程 <code>double</code>。<br>⑤ 輸出 <b>5 位小數</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;

struct P { double x, y; };
bool cmpP(const P &a, const P &b) { return a.x != b.x ? a.x < b.x : a.y < b.y; }
double cross(const P &o, const P &a, const P &b) {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cout << fixed << setprecision(5);
    int T; cin >> T;
    while (T--) {
        double L; int n;
        cin >> L >> n;
        vector<P> p(n);
        for (int i = 0; i < n; i++) cin >> p[i].x >> p[i].y;
        sort(p.begin(), p.end(), cmpP);

        vector<P> h(2 * n + 1);                           // Andrew's monotone chain
        int k = 0;
        for (int i = 0; i < n; i++) {
            while (k >= 2 && cross(h[k - 2], h[k - 1], p[i]) <= 0) k--;
            h[k++] = p[i];
        }
        int lower = k + 1;
        for (int i = n - 2; i >= 0; i--) {
            while (k >= lower && cross(h[k - 2], h[k - 1], p[i]) <= 0) k--;
            h[k++] = p[i];
        }
        double per = 0;
        for (int i = 0; i + 1 < k; i++)
            per += hypot(h[i].x - h[i + 1].x, h[i].y - h[i + 1].y);
        cout << max(L, per) << "\\n";                      // 橡皮筋不會縮短
    }
    return 0;
}`
},

10625: {
  q: "GNU = GNU's Not Unix：給若干條取代規則（如 <code>G-&gt;GNU's</code>），每一步<b>同時</b>把字串中所有有規則的字元換成對應字串（沒有規則的字元不變）。問從初始字串出發、做 t 步後，某個字元出現幾次。",
  h: "字串長度會爆炸性成長，<b>絕對不能真的展開</b>。但我們只要<b>各字元的個數</b>，而個數的變化是<b>線性</b>的 ⇒ 用<b>矩陣</b>描述：<br><code>M[i][j] = 字元 i 的規則右側中，字元 j 出現的次數</code>（沒有規則的字元 <code>M[i][i] = 1</code>）<br>則「做 t 步後的計數向量」<code>= v₀ × Mᵗ</code>，用<b>矩陣快速冪</b>在 O(m³ log t) 算完。<br><b>關鍵優化</b>：把矩陣限制在<b>真正出現過的字元</b>上（規則左右側 + 初始字串），通常只有幾十個 ⇒ m³ 只有幾萬。<br>驗算：規則 <code>A→BAcX</code> 從 <code>ABCcXA</code> 出發，每步每個 A 生出一個 c 且自己保留 ⇒ 10000 步後 c 的個數 = 1 + 2×10000 = <b>20001</b> ✓。",
  t: "① <b>不能展開字串</b>（t 可到 10000）；也不能逐步更新向量（每步 O(m²)，10000 步 × 多筆查詢會 TLE）⇒ 要用<b>矩陣快速冪</b>。<br>② 沒有規則的字元要對映到<b>自己</b>（單位對角），漏了會憑空消失。<br>③ 只保留出現過的字元，矩陣才夠小。<br>④ 計數成長極快，用 <code>unsigned long long</code>（題目保證答案放得下）。<br>⑤ 規則格式是 <code>X-&gt;Y</code>，解析時要跳過那兩個字元。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef unsigned long long ull;

int m;
typedef vector<vector<ull> > Mat;

Mat mul(const Mat &a, const Mat &b) {
    Mat c(m, vector<ull>(m, 0));
    for (int i = 0; i < m; i++)
        for (int k = 0; k < m; k++) {
            if (!a[i][k]) continue;
            for (int j = 0; j < m; j++) c[i][j] += a[i][k] * b[k][j];
        }
    return c;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<string> lhs(n), rhs(n);
        set<char> alpha;
        for (int i = 0; i < n; i++) {
            string s; cin >> s;                           // 格式 X->Y
            lhs[i] = string(1, s[0]);
            rhs[i] = s.substr(3);
            alpha.insert(s[0]);
            for (size_t j = 0; j < rhs[i].size(); j++) alpha.insert(rhs[i][j]);
        }
        int q; cin >> q;
        vector<string> qs(q); vector<char> qc(q); vector<ull> qt(q);
        for (int i = 0; i < q; i++) {
            cin >> qs[i] >> qc[i] >> qt[i];
            for (size_t j = 0; j < qs[i].size(); j++) alpha.insert(qs[i][j]);
            alpha.insert(qc[i]);
        }
        map<char, int> id;
        for (set<char>::iterator it = alpha.begin(); it != alpha.end(); ++it) {
            int k = id.size(); id[*it] = k;
        }
        m = id.size();

        Mat M(m, vector<ull>(m, 0));
        for (int i = 0; i < m; i++) M[i][i] = 1;          // 沒規則的字元對映自己
        for (int i = 0; i < n; i++) {
            int r = id[lhs[i][0]];
            for (int j = 0; j < m; j++) M[r][j] = 0;
            for (size_t j = 0; j < rhs[i].size(); j++) M[r][id[rhs[i][j]]]++;
        }

        for (int i = 0; i < q; i++) {
            Mat P(m, vector<ull>(m, 0)), B = M;
            for (int j = 0; j < m; j++) P[j][j] = 1;
            ull e = qt[i];
            while (e) { if (e & 1) P = mul(P, B); B = mul(B, B); e >>= 1; }   // 快速冪

            vector<ull> v(m, 0);
            for (size_t j = 0; j < qs[i].size(); j++) v[id[qs[i][j]]]++;
            ull ans = 0;
            for (int j = 0; j < m; j++) ans += v[j] * P[j][id[qc[i]]];
            cout << ans << "\\n";
        }
    }
    return 0;
}`
},

11418: {
  q: "Clever Naming Patterns：n 道題目要分別以 A、B、C… 開頭命名。給 n 組候選名稱，每組只能供<b>一道題</b>使用。求一組可行的指派，輸出每個字母對應的名稱（<b>只有首字母大寫</b>）。",
  h: "「每組供一道題、每道題要一個特定開頭字母」⇒ 這是<b>二分圖完美匹配</b>：<br>左邊是 n 個候選組、右邊是字母 A..（第 n 個字母）。若第 i 組裡<b>有名稱以字母 j 開頭</b>，就連一條邊。<br>用 <b>匈牙利演算法（Kuhn's）</b>求完美匹配，n ≤ 26 ⇒ 極快。<br>找到匹配後，對每個字母 j，從匹配到的那一組裡<b>取出以 j 開頭的那個名稱</b>輸出。<br>輸出前要<b>正規化大小寫</b>：首字母大寫、其餘小寫（<code>ApPlEs → Apples</code>、<code>axe → Axe</code>）。<br>依字母 A、B、C… 的順序輸出。",
  t: "① <b>看穿它是二分圖匹配</b>是本題的門檻——直覺會以為「每組自己挑」，但一組只能給一道題用。<br>② 比對開頭字母時要<b>忽略大小寫</b>（<code>axe</code> 對應字母 A）。<br>③ 輸出要把整個名稱正規化成<b>首字母大寫、其餘小寫</b>。<br>④ 同一組裡可能有多個以同一字母開頭的名稱，任取一個即可。<br>⑤ 輸出順序是<b>字母序</b>（A 開頭的先印），不是輸入組的順序。",
  c: `#include <bits/stdc++.h>
using namespace std;

int n;
vector<vector<int> > can;                                  // can[組][字母] 是否可用
vector<int> matchL;                                        // 字母 -> 組
vector<char> used;

bool tryK(int g) {
    for (int L = 0; L < n; L++) {
        if (!can[g][L] || used[L]) continue;
        used[L] = 1;
        if (matchL[L] < 0 || tryK(matchL[L])) { matchL[L] = g; return true; }
    }
    return false;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int tc = 1; tc <= T; tc++) {
        cin >> n;
        vector<vector<string> > names(n);
        can.assign(n, vector<int>(n, 0));
        for (int i = 0; i < n; i++) {
            int k; cin >> k;
            for (int j = 0; j < k; j++) {
                string s; cin >> s;
                for (size_t p = 0; p < s.size(); p++)
                    s[p] = (p == 0) ? toupper((unsigned char)s[p])
                                    : tolower((unsigned char)s[p]);   // 正規化
                names[i].push_back(s);
                int L = s[0] - 'A';
                if (L >= 0 && L < n) can[i][L] = 1;
            }
        }
        matchL.assign(n, -1);
        for (int i = 0; i < n; i++) { used.assign(n, 0); tryK(i); }

        cout << "Case #" << tc << ":\\n";
        for (int L = 0; L < n; L++) {                      // 依字母序輸出
            int g = matchL[L];
            for (size_t j = 0; j < names[g].size(); j++)
                if (names[g][j][0] - 'A' == L) { cout << names[g][j] << "\\n"; break; }
        }
    }
    return 0;
}`
},

10039: {
  q: "Railroads：給城市清單與若干班列車（每班是一串「時刻 城市」的停靠序列），以及<b>最早出發時刻、起點、終點</b>。求<b>最早能抵達終點的時刻</b>；若有多種走法，取<b>最晚出發</b>的那一種。輸出出發與抵達資訊，無解則輸出 <code>No connection</code>。",
  h: "把每班列車的<b>相鄰兩站</b>拆成一條「班次邊」<code>(起站, 發車時刻, 到站, 到達時刻)</code>，就變成一個<b>時刻受限的最短路</b>問題。<br><b>第一趟（求最早抵達）</b>：<code>early[城市]</code> = 最早能出現在該城市的時刻。從起點的最早出發時刻開始，反覆鬆弛「所有 <code>發車時刻 ≥ early[起站]</code> 的班次邊」，取 <code>early[到站] = min(…, 到達時刻)</code>。<br><b>第二趟（求最晚出發）</b>：反過來做——<code>late[城市]</code> = 「最晚可以出現在該城市、仍趕得上最佳抵達時刻」。從 <code>late[終點] = 最佳抵達時刻</code> 出發，對每條 <code>到達時刻 ≤ late[到站]</code> 的邊做 <code>late[起站] = max(…, 發車時刻)</code>。<br>答案的出發時刻就是 <code>late[起點]</code>。<br>兩趟都用 Bellman-Ford 式的反覆鬆弛即可（班次邊數不多）。",
  t: "① <b>兩個目標要分兩趟算</b>：先固定「最早抵達」，再回頭求「最晚出發」，一次做不出來。<br>② 時刻是 <code>HHMM</code> 格式，<b>要轉成分鐘</b>再比較（<code>0949 → 9×60+49</code>），直接比字串或整數會在跨小時處出錯。<br>③ 只有<b>發車時刻 ≥ 目前所在時刻</b>的班次能搭（不能搭已經開走的）。<br>④ 城市名要<b>字串對映成編號</b>。<br>⑤ 輸出格式：<code>Scenario k</code>、<code>Departure HHMM 城市</code>、<code>Arrival HHMM 城市</code>，每個情境後<b>空一行</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;

struct E { int u, dep, v, arr; };

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int S; cin >> S;
    for (int tc = 1; tc <= S; tc++) {
        int C; cin >> C;
        map<string, int> id;
        for (int i = 0; i < C; i++) { string s; cin >> s; int k = id.size(); id[s] = k; }

        int TR; cin >> TR;
        vector<E> es;
        for (int i = 0; i < TR; i++) {
            int k; cin >> k;
            vector<int> t(k), c(k);
            for (int j = 0; j < k; j++) {
                int hhmm; string city; cin >> hhmm >> city;
                t[j] = hhmm / 100 * 60 + hhmm % 100;       // HHMM 轉分鐘
                c[j] = id[city];
            }
            for (int j = 0; j + 1 < k; j++) {
                E e; e.u = c[j]; e.dep = t[j]; e.v = c[j + 1]; e.arr = t[j + 1];
                es.push_back(e);
            }
        }
        int st; string sc, dc;
        { int hhmm; cin >> hhmm >> sc >> dc; st = hhmm / 100 * 60 + hhmm % 100; }
        int s = id[sc], d = id[dc];

        const int INF = 1000000;
        vector<int> early(C, INF);
        early[s] = st;
        for (int it = 0; it < C; it++)                     // 反覆鬆弛求最早抵達
            for (size_t i = 0; i < es.size(); i++)
                if (early[es[i].u] <= es[i].dep && es[i].arr < early[es[i].v])
                    early[es[i].v] = es[i].arr;

        cout << "Scenario " << tc << "\\n";
        if (early[d] >= INF) cout << "No connection\\n";
        else {
            vector<int> late(C, -1);
            late[d] = early[d];
            for (int it = 0; it < C; it++)                 // 反向鬆弛求最晚出發
                for (size_t i = 0; i < es.size(); i++)
                    if (late[es[i].v] >= es[i].arr && es[i].dep > late[es[i].u])
                        late[es[i].u] = es[i].dep;
            int dep = late[s];
            cout << "Departure " << setw(4) << setfill('0') << dep / 60 * 100 + dep % 60
                 << setfill(' ') << " " << sc << "\\n";
            cout << "Arrival   " << setw(4) << setfill('0')
                 << early[d] / 60 * 100 + early[d] % 60 << setfill(' ') << " " << dc << "\\n";
        }
        cout << "\\n";
    }
    return 0;
}`
},

11714: {
  q: "Blind Sorting：蒙著眼睛，只能問「這兩個數哪個大」。要同時找出 n 個數之中的<b>最大值與最小值</b>，<b>最壞情況</b>下最少要問幾次？",
  unsure: true,
  h: "經典的<b>對抗論證（adversary argument）</b>結果：<br><code>答案 = ⌈3n/2⌉ − 2</code><br>作法：把元素<b>兩兩配對</b>先比一次（<code>⌊n/2⌋</code> 次），勝者進「候選最大」組、敗者進「候選最小」組；接著在兩組內各找極值（各 <code>⌈n/2⌉ − 1</code> 次）。合計正好是 <code>⌈3n/2⌉ − 2</code>。<br>這個上界可以用資訊論／對抗論證證明是<b>最佳</b>的。<br>驗算：n=2 ⇒ 1、n=3 ⇒ 3、n=4 ⇒ 4。<br>n 可到接近 10¹⁰ ⇒ 用 <code>long long</code>，並小心 <code>⌈3n/2⌉</code> 的整數寫法（<code>(3n+1)/2</code>）。",
  t: "① <b>本題原文在轉檔中有殘缺</b>，我是依標題與常見題型判斷為「同時找最大與最小」；若判斷有誤請以官方題敘為準——這也是標記為不確定的原因。<br>② 公式是 <code>⌈3n/2⌉ − 2</code>，用整數寫成 <code>(3n + 1) / 2 − 2</code>。<br>③ n 接近 10¹⁰ ⇒ <code>3n</code> 會超過 int，全程 <code>long long</code>。<br>④ n = 1 時不需要比較（答案 0），n = 2 時 1 次。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll n;
    while (cin >> n) {
        if (n <= 1) { cout << 0 << "\\n"; continue; }
        cout << (3 * n + 1) / 2 - 2 << "\\n";               // ceil(3n/2) - 2
    }
    return 0;
}`
}
};

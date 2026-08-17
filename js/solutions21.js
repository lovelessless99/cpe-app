/* 二星題庫（第四批 12 題） */
const SOL21 = {
10344: {
  q: "23 out of 5：給 5 個 1..50 的整數，問能否<b>重新排列</b>並在中間插入 <code>+ − ×</code>，由左往右計算（<code>((((a?b)?c)?d)?e</code>）得到 <b>23</b>。",
  h: "搜尋空間小到可以完全暴力：<br>・排列 <code>5! = 120</code> 種（用 <code>next_permutation</code>，記得先 <code>sort</code>）<br>・運算子 <code>3⁴ = 81</code> 種<br>合計 <b>9720</b> 次計算，每筆測資瞬殺。<br>寫法上用<b>遞迴枚舉運算子</b>最乾淨：<code>go(第 i 個位置, 目前累計值)</code>，到底檢查是否等於 23。<br>這是「<b>估算搜尋空間 → 確認暴力可行 → 直接爆搜</b>」的典型練習：考場上先算一下 120 × 81 再動手，比苦思巧解快得多。",
  t: "① 運算是<b>嚴格由左往右</b>，沒有先乘除後加減，所以累計值一路帶著走即可。<br>② 沒有除法，只有 <code>+ − ×</code>。<br>③ 中間值可能是<b>負數</b>或很大（50⁵ = 3 億），用 <code>int</code> 剛好但建議 <code>long long</code>。<br>④ <code>next_permutation</code> 前<b>一定要先 sort</b>，否則只走到一半的排列。<br>⑤ 輸入以<b>五個 0</b> 結束，那一行不處理。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int a[5];
bool ok;

void go(int i, ll cur) {                            // 由左往右套運算子
    if (ok) return;
    if (i == 5) { if (cur == 23) ok = true; return; }
    go(i + 1, cur + a[i]);
    go(i + 1, cur - a[i]);
    go(i + 1, cur * a[i]);
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    while (cin >> a[0] >> a[1] >> a[2] >> a[3] >> a[4]) {
        if (!a[0] && !a[1] && !a[2] && !a[3] && !a[4]) break;
        sort(a, a + 5);                             // next_permutation 前必排序
        ok = false;
        do {
            go(1, a[0]);
        } while (!ok && next_permutation(a, a + 5));
        cout << (ok ? "Possible" : "Impossible") << "\\n";
    }
    return 0;
}`
},

10579: {
  q: "大費氏數：<code>f(1) = f(2) = 1</code>，輸出第 n 個費氏數（可能有數百位）。",
  h: "跟 495 同一個模子：<b>base 10⁹ 大數加法 + 一次預處理全部</b>。<br>本題與 495 只差在<b>輸出格式</b>（這裡只印數字本身）與<b>索引起點</b>（f(1) = 1）。<br>把 f(0) = 0、f(1) = 1 存好之後，f(n) 就是標準費氏數，兩種索引都相容。<br>驗算：f(100) = 354224848179261915075 ✓（21 位，早就超過 <code>long long</code> 的 19 位）。<br>大數輸出的鐵則再說一次：<b>最高組不補零、其餘每組補滿 9 位</b>。",
  t: "① f(100) 就已經 21 位，<b><code>unsigned long long</code> 也不夠</b>（上限約 20 位），一定要大數。<br>② n 的上界題目沒明講，預處理到 5000 保險（F(5000) 約 1045 位，記憶體仍很小）。<br>③ base 10⁹ 輸出<b>補零</b>是最常見的錯。<br>④ 一次預處理、之後 O(1) 查表；每筆重算會 TLE。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

const int BASE = 1000000000, W = 9;
typedef vector<int> Big;                            // 低位在前

Big add(const Big &a, const Big &b) {
    Big r; int carry = 0;
    for (size_t i = 0; i < a.size() || i < b.size() || carry; i++) {
        int v = carry;
        if (i < a.size()) v += a[i];
        if (i < b.size()) v += b[i];
        r.push_back(v % BASE);
        carry = v / BASE;
    }
    return r;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const int MX = 5000;
    vector<Big> f(MX + 1);
    f[0] = Big(1, 0);
    f[1] = Big(1, 1);
    for (int i = 2; i <= MX; i++) f[i] = add(f[i - 1], f[i - 2]);

    int n;
    while (cin >> n) {
        const Big &v = f[n];
        cout << v.back();                           // 最高組不補零
        for (int i = (int)v.size() - 2; i >= 0; i--)
            cout << setw(W) << setfill('0') << v[i];
        cout << setfill(' ') << "\\n";
    }
    return 0;
}`
},

11286: {
  q: "Conformity：每位新生選 5 門課，<b>選課組合相同</b>（不管順序）的算同一組。求選到<b>最熱門組合</b>的學生<b>總人數</b>（若有多組並列最熱門，人數要全部加起來）。",
  h: "把每個學生的 5 門課<b>排序後當成鍵</b>，這樣「不管順序」就自動處理掉了——這是<b>集合正規化</b>最常用的手法。<br>用 <code>map&lt;vector&lt;int&gt;, int&gt;</code> 統計每個組合的人數，再掃一遍求最大值，最後把<b>所有等於最大值的組合人數加總</b>。<br>n ≤ 10000 ⇒ 完全不用擔心效率。<br>（想更快可以把 5 個排序後的課號組成一個字串或雜湊鍵，用 <code>unordered_map</code>。）",
  t: "① <b>排序後才能當鍵</b>——「100 101 102」和「102 100 101」是同一組。<br>② 答案是<b>人數總和</b>不是組合數：若有兩組並列 3 人，答案是 6 不是 3。<br>③ 課號可能不連續、可達 6 位數，用 <code>vector&lt;int&gt;</code> 當鍵最省事。<br>④ <code>n = 0</code> 結束。<br>⑤ 每筆測資都要清空 map。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n && n) {
        map<vector<int>, int> cnt;
        for (int i = 0; i < n; i++) {
            vector<int> v(5);
            for (int j = 0; j < 5; j++) cin >> v[j];
            sort(v.begin(), v.end());               // 正規化：排序後當鍵
            cnt[v]++;
        }
        int best = 0, total = 0;
        for (map<vector<int>, int>::iterator it = cnt.begin(); it != cnt.end(); ++it)
            best = max(best, it->second);
        for (map<vector<int>, int>::iterator it = cnt.begin(); it != cnt.end(); ++it)
            if (it->second == best) total += it->second;   // 並列的要全部加起來
        cout << total << "\\n";
    }
    return 0;
}`
},

11953: {
  q: "戰艦：<code>n × n</code> 的棋盤，<code>@</code> 是完好的船身、<code>x</code> 是被打中的船身、<code>.</code> 是海水。船是<b>橫或直的一直線</b>且彼此不相鄰。求<b>還活著</b>（至少有一格 <code>@</code>）的船有幾艘。",
  h: "船彼此不相鄰 ⇒ <b>四方向連通塊就是一艘船</b>。<br>做一次 flood fill，對每個連通塊記錄「<b>裡面有沒有出現 <code>@</code></b>」，有就是活的。<br>寫法上最省事的是：DFS 時回傳／累計該塊的 <code>@</code> 數量，>0 就答案 +1。<br>O(n²)。<br>本題是 572（石油礦床）的變形——差別在<b>四方向</b>（船是直線，斜角不算同一艘）以及要<b>附帶統計連通塊的性質</b>，而不只是數數量。",
  t: "① 是<b>四方向</b>不是八方向（572 才是八方向），寫錯會把並排的兩艘船併成一艘。<br>② 判定「活著」的是<b>整個連通塊裡有沒有 <code>@</code></b>，不是逐格判斷。<br>③ 全是 <code>x</code> 的船已被擊沉，<b>不計入</b>。<br>④ 輸出格式 <code>Case k: m</code>。<br>⑤ 每筆測資都要重讀棋盤，別忘了清狀態（就地把走過的格子改成 <code>.</code> 最方便）。",
  c: `#include <bits/stdc++.h>
using namespace std;

int n;
vector<string> g;

int dfs(int r, int c) {                             // 回傳這塊裡 '@' 的數量
    if (r < 0 || c < 0 || r >= n || c >= n || g[r][c] == '.') return 0;
    int cnt = (g[r][c] == '@') ? 1 : 0;
    g[r][c] = '.';                                  // 就地標記已訪問
    cnt += dfs(r + 1, c) + dfs(r - 1, c) + dfs(r, c + 1) + dfs(r, c - 1);
    return cnt;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int t = 1; t <= T; t++) {
        cin >> n;
        g.assign(n, "");
        for (int i = 0; i < n; i++) cin >> g[i];
        int alive = 0;
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (g[i][j] != '.' && dfs(i, j) > 0) alive++;
        cout << "Case " << t << ": " << alive << "\\n";
    }
    return 0;
}`
},

11235: {
  q: "Frequent values：給一個<b>非遞減</b>的序列與 q 筆區間詢問，每次問區間 <code>[l, r]</code> 內<b>出現次數最多的值出現了幾次</b>。n、q ≤ 100000。",
  h: "「非遞減」是整題的鑰匙 ⇒ <b>相同的值一定連成一段</b>。先做 <b>run-length 壓縮</b>，把序列切成若干段。<br>對區間 <code>[l, r]</code>，答案只可能來自三種東西：<br>① <b>左端那段被截斷後的剩餘長度</b><br>② <b>右端那段被截斷後的剩餘長度</b><br>③ 中間<b>完整包含</b>的那些段裡最長的一段<br>①②是 O(1) 算出來的，③是一個<b>區間最大值查詢</b> ⇒ 用<b>稀疏表（Sparse Table）</b>預處理，查詢 O(1)。<br>特例：<code>l</code> 與 <code>r</code> 落在<b>同一段</b>時，答案直接是 <code>r − l + 1</code>。<br>總複雜度 O(n log n + q)。",
  t: "① <b>l、r 同段的特例一定要先擋</b>，否則「中間段」的區間會變成非法。<br>② 索引是 <b>1-based</b>，轉成 0-based 時整批要一致。<br>③ 中間段可能<b>不存在</b>（左右段相鄰），此時只比較①②。<br>④ 稀疏表的 log 表要預先算好，用 <code>__lg()</code> 也可以。<br>⑤ <code>n = 0</code> 結束；值可能是<b>負數</b>，但這題只在乎「相不相等」，不影響。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, q;
    while (cin >> n && n) {
        cin >> q;
        vector<int> a(n);
        for (int i = 0; i < n; i++) cin >> a[i];

        // run-length 壓縮：每格屬於哪一段、每段的起訖與長度
        vector<int> rid(n), st, en;
        for (int i = 0; i < n; i++) {
            if (i == 0 || a[i] != a[i - 1]) { st.push_back(i); en.push_back(i); }
            else en.back() = i;
            rid[i] = st.size() - 1;
        }
        int m = st.size();
        vector<int> len(m);
        for (int i = 0; i < m; i++) len[i] = en[i] - st[i] + 1;

        // 稀疏表：段長度的區間最大值
        int LG = 1; while ((1 << LG) <= m) LG++;
        vector<vector<int> > sp(LG, vector<int>(m, 0));
        sp[0] = len;
        for (int k = 1; k < LG; k++)
            for (int i = 0; i + (1 << k) <= m; i++)
                sp[k][i] = max(sp[k - 1][i], sp[k - 1][i + (1 << (k - 1))]);

        for (int Q = 0; Q < q; Q++) {
            int l, r; cin >> l >> r;
            l--; r--;
            if (rid[l] == rid[r]) { cout << r - l + 1 << "\\n"; continue; }
            int ans = max(en[rid[l]] - l + 1, r - st[rid[r]] + 1);
            int L = rid[l] + 1, R = rid[r] - 1;
            if (L <= R) {
                int k = 0; while ((1 << (k + 1)) <= R - L + 1) k++;
                ans = max(ans, max(sp[k][L], sp[k][R - (1 << k) + 1]));
            }
            cout << ans << "\\n";
        }
    }
    return 0;
}`
},

11879: {
  q: "17 的倍數：給一個最多 <b>100 位</b>的正整數，判斷它是不是 17 的倍數，是就印 1、否則印 0。",
  h: "題目講了一個「去尾數再減 5 倍」的定理，但那只是花絮——<b>直接做大數對 17 取模</b>最短最穩：<br><code>r = (r × 10 + digit) % 17</code>，掃完看 <code>r == 0</code>。<br>正確性來自十進位的展開：<code>N = ((d₀×10 + d₁)×10 + d₂)…</code>，每一步取模不影響結果。<br>這招（<b>大數對小數取模</b>）跟 10070 是同一個技巧，值得固化成反射動作。<br>O(位數)。",
  t: "① 100 位 ⇒ <b>一定要用字串讀</b>，<code>long long</code> 只能到 19 位。<br>② 中間值最大 <code>16 × 10 + 9 = 169</code>，用 <code>int</code> 綽綽有餘。<br>③ 輸入以<b>單獨一個 0</b> 結束；注意 <code>\"0\"</code> 這個字串就是結束符，不要當成待判斷的數。<br>④ 輸出是 <code>1</code> / <code>0</code>，不是 Yes / No。<br>⑤ 題目給的定理拿來驗算很方便：34 → 3 − 5×4 = −17 ✓ 是 17 的倍數。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string s;
    while (cin >> s) {
        if (s == "0") break;
        int r = 0;
        for (size_t i = 0; i < s.size(); i++) r = (r * 10 + (s[i] - '0')) % 17;
        cout << (r == 0 ? 1 : 0) << "\\n";
    }
    return 0;
}`
},

10450: {
  q: "World Cup Noise：求長度 n（&lt; 51）的 0/1 序列中，<b>沒有相鄰兩個 1</b> 的個數。",
  h: "看最後一位（<b>「看最後一步」永遠是遞推的起手式</b>）：<br>・最後放 <b>0</b> ⇒ 前面 n−1 位隨意（只要自身合法）⇒ <code>f(n−1)</code><br>・最後放 <b>1</b> ⇒ 倒數第二位<b>必須是 0</b> ⇒ <code>f(n−2)</code><br>⇒ <code>f(n) = f(n−1) + f(n−2)</code>，又是<b>費氏數</b>。<br>邊界：<code>f(1) = 2</code>（0 或 1）、<code>f(2) = 3</code>（00、01、10）。<br>n ≤ 50 ⇒ f(50) 約 3 × 10¹⁰，<b>超過 int</b>，用 <code>long long</code>。<br>（這題和 900 磚牆、10334 光線折射是<b>同一個遞推</b>換三種故事——認出模型就一秒解決。）",
  t: "① <b>答案超過 int</b>，用 <code>long long</code>。<br>② 邊界是 <code>f(1) = 2, f(2) = 3</code>，不是 1, 1——套錯整串偏移。<br>③ 輸出格式：<code>Scenario #i:</code> 一行、數字一行，<b>每筆後面再空一行</b>。<br>④ 先把 1..50 全部算好再查表。<br>⑤ 第一行是測資數量。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll f[55];
    f[1] = 2; f[2] = 3;                             // 0/1 ; 00,01,10
    for (int i = 3; i <= 51; i++) f[i] = f[i - 1] + f[i - 2];

    int T; cin >> T;
    for (int t = 1; t <= T; t++) {
        int n; cin >> n;
        cout << "Scenario #" << t << ":\\n" << f[n] << "\\n\\n";
    }
    return 0;
}`
},

10196: {
  q: "西洋棋將軍判定：讀入 8×8 棋盤（<b>大寫是白棋、小寫是黑棋</b>），判斷有沒有國王正被將軍，輸出白王被將／黑王被將／都沒有。",
  h: "把「有沒有被將」反過來想：<b>對每個棋子產生它的攻擊格</b>，若打到對方的國王就是將軍。<br>六種棋子分兩類：<br>・<b>固定步伐</b>（兵、馬、王）：直接列出偏移量檢查。<br>・<b>滑行棋子</b>（車、象、后）：沿方向一路走，<b>碰到任何棋子就停</b>（可攻擊該格但不能穿透）。<br>兵最容易錯：<b>白兵往上（row 減）斜吃、黑兵往下（row 加）斜吃</b>，而且是<b>斜著吃</b>不是直走。<br>把 8 個方向拆成「直 4 + 斜 4」，車用直、象用斜、后兩者都用、王兩者都用但只走一步——這樣程式碼可以高度共用。",
  t: "① <b>兵的方向</b>是最大的坑：白兵攻擊 <code>(r−1, c±1)</code>、黑兵攻擊 <code>(r+1, c±1)</code>。<br>② 滑行棋子<b>不能穿透</b>，碰到棋子就要停下（該格仍算被攻擊）。<br>③ 大寫白、小寫黑，判斷攻擊目標時要確認<b>顏色相反</b>。<br>④ 輸入以<b>全空的棋盤</b>結束。<br>⑤ 輸出句子三選一，格式 <code>Game #k: ...</code>，題目保證不會兩王同時被將。",
  c: `#include <bits/stdc++.h>
using namespace std;

char b[8][9];
int dr8[] = {1, -1, 0, 0, 1, 1, -1, -1};
int dc8[] = {0, 0, 1, -1, 1, -1, 1, -1};            // 前 4 直、後 4 斜
int kr[] = {1, 1, -1, -1, 2, 2, -2, -2};
int kc[] = {2, -2, 2, -2, 1, -1, 1, -1};

bool inb(int r, int c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }

// 檢查 (r,c) 的棋子是否攻擊到 target 這個字元所在的格子
bool attacks(int r, int c, char target) {
    char p = b[r][c];
    char t = tolower(p);
    if (t == 'p') {                                 // 兵：斜吃，白往上、黑往下
        int d = isupper((unsigned char)p) ? -1 : 1;
        for (int dc = -1; dc <= 1; dc += 2)
            if (inb(r + d, c + dc) && b[r + d][c + dc] == target) return true;
        return false;
    }
    if (t == 'n') {
        for (int k = 0; k < 8; k++)
            if (inb(r + kr[k], c + kc[k]) && b[r + kr[k]][c + kc[k]] == target) return true;
        return false;
    }
    int lo = (t == 'b') ? 4 : 0;                    // 象只走斜
    int hi = (t == 'r') ? 4 : 8;                    // 車只走直
    for (int k = lo; k < hi; k++) {
        int nr = r + dr8[k], nc = c + dc8[k];
        while (inb(nr, nc)) {
            if (b[nr][nc] != '.') {                 // 碰到棋子就停（不能穿透）
                if (b[nr][nc] == target) return true;
                break;
            }
            if (t == 'k') break;                    // 王只走一步
            nr += dr8[k]; nc += dc8[k];
        }
    }
    return false;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int cs = 1;
    while (true) {
        bool empty_ = true;
        for (int i = 0; i < 8; i++) {
            string row;
            if (!(cin >> row)) return 0;
            for (int j = 0; j < 8; j++) {
                b[i][j] = row[j];
                if (row[j] != '.') empty_ = false;
            }
        }
        if (empty_) break;                          // 全空棋盤 = 輸入結束

        string res = "no king is in check.";
        for (int r = 0; r < 8 && res[0] == 'n'; r++)
            for (int c = 0; c < 8 && res[0] == 'n'; c++) {
                if (b[r][c] == '.') continue;
                if (isupper((unsigned char)b[r][c])) {          // 白棋攻擊黑王
                    if (attacks(r, c, 'k')) res = "black king is in check.";
                } else {                                        // 黑棋攻擊白王
                    if (attacks(r, c, 'K')) res = "white king is in check.";
                }
            }
        cout << "Game #" << cs++ << ": " << res << "\\n";
    }
    return 0;
}`
},

10334: {
  q: "光線穿過玻璃：兩片玻璃背靠背，光線在其中<b>改變方向 n 次</b>後穿出，問有幾種可能的路徑。n ≤ 1000。",
  h: "把 n = 0, 1, 2 的情況數出來是 <b>2, 3, 5</b> ⇒ 又是<b>費氏數</b>：<code>答案 = F(n+3)</code>（<code>F(1) = F(2) = 1</code>）。<br>直覺：每多一次反射，光線要嘛在同一個界面來回、要嘛跨到另一個界面，恰好對應「上一步」與「上上步」兩種來源。<br><b>但 n 可到 1000 ⇒ F(1003) 有 210 位，必須用大數</b>。<br>所以本題 = 「認出費氏」+「大數加法」的組合，正好把前面 495、10579 的模板再用一次。<br>一次預處理到 1003，之後 O(1) 查表。",
  t: "① <b>要用大數</b>：n = 1000 時答案 210 位，<code>long long</code> 差得遠。<br>② 索引偏移要對：<code>n = 0 → 2</code>、<code>n = 1 → 3</code>、<code>n = 2 → 5</code>，也就是 <code>F(n+3)</code>。<br>③ 預處理一次，別每筆重算。<br>④ base 10⁹ 的輸出補零老問題。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

const int BASE = 1000000000, W = 9;
typedef vector<int> Big;

Big add(const Big &a, const Big &b) {
    Big r; int carry = 0;
    for (size_t i = 0; i < a.size() || i < b.size() || carry; i++) {
        int v = carry;
        if (i < a.size()) v += a[i];
        if (i < b.size()) v += b[i];
        r.push_back(v % BASE);
        carry = v / BASE;
    }
    return r;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const int MX = 1010;
    vector<Big> f(MX + 1);
    f[1] = Big(1, 1); f[2] = Big(1, 1);
    for (int i = 3; i <= MX; i++) f[i] = add(f[i - 1], f[i - 2]);

    int n;
    while (cin >> n) {
        const Big &v = f[n + 3];                    // 2, 3, 5, ... = F(n+3)
        cout << v.back();
        for (int i = (int)v.size() - 2; i >= 0; i--)
            cout << setw(W) << setfill('0') << v[i];
        cout << setfill(' ') << "\\n";
    }
    return 0;
}`
},

10152: {
  q: "ShellSort（烏龜疊塔）：給烏龜的<b>初始由上到下</b>順序與<b>目標</b>順序，每次操作可以把<b>任一隻</b>烏龜抽出來放到<b>最頂端</b>。求最少操作，並依序輸出被移動的烏龜名字。",
  h: "反過來想：<b>沒有被移動的烏龜</b>，相對順序不變，而且因為每隻被移動的都跑到上面去，所以<b>不動的那些必定是目標順序中「最底部的一段」</b>。<br>⇒ 目標：找最大的 k，使目標的<b>由下往上前 k 隻</b>是初始序列（由下往上）的<b>子序列</b>。<br>用<b>雙指標貪心</b>一次掃完：初始指標往上走，遇到符合目標下一隻就前進。<br>剩下的 <code>目標[k..頂端]</code> 就是必須移動的，而且<b>由下往上依序移動</b>即為答案順序（先移的會被後移的壓在下面）。<br>O(n)。",
  t: "① <b>兩個序列都要先反轉成「由下往上」</b>再比對，這是最容易搞混的地方。<br>② 輸出順序是<b>由下往上</b>（也就是目標序列中位置較低的先移動）。<br>③ 名字<b>含空白</b>（例如 <code>Duke of Earl</code>），必須用 <code>getline</code>；讀完數字要 <code>cin.ignore()</code>。<br>④ 貪心的正確性來自「不動的必為目標底部連續段」——想通這點整題就通了。<br>⑤ 第一行是測資數量。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int T; cin >> T;
    while (T--) {
        int n; cin >> n; cin.ignore();
        vector<string> a(n), b(n);
        for (int i = 0; i < n; i++) getline(cin, a[i]);   // 初始，由上到下
        for (int i = 0; i < n; i++) getline(cin, b[i]);   // 目標，由上到下
        reverse(a.begin(), a.end());                     // 改成由下往上
        reverse(b.begin(), b.end());

        int j = 0;                                       // 目標中已對上的隻數
        for (int i = 0; i < n; i++)
            if (j < n && a[i] == b[j]) j++;              // 貪心配子序列

        for (int k = j; k < n; k++) cout << b[k] << "\\n";  // 其餘依序搬到頂端
    }
    return 0;
}`
},

10140: {
  q: "Prime Distance：給區間 <code>[L, U]</code>（U 可達 2³¹−1，但 <code>U − L ≤ 10⁶</code>），找出區間內<b>相鄰質數</b>中距離<b>最近</b>與<b>最遠</b>的兩組。少於兩個質數則輸出無解訊息。",
  h: "U 到 21 億，不可能篩到 U ⇒ 用<b>區間篩（segmented sieve）</b>：<br>① 先用一般篩法求出 <code>√U ≈ 46341</code> 以內的所有質數。<br>② 開一條長度 <code>U − L + 1</code> 的布林陣列代表 <code>[L, U]</code>，對每個小質數 p，從 <code>max(p², ⌈L/p⌉ × p)</code> 開始<b>每隔 p 標記為合數</b>。<br>③ 剩下沒被標記的就是質數。<br>記憶體只用 10⁶，時間約 <code>10⁶ × log log</code>，非常快。<br>最後把區間內的質數依序取出，掃一遍相鄰差即可。",
  t: "① <b><code>L = 1</code> 要特判</b>：1 不是質數，必須手動標掉，否則會多一個假質數。<br>② 起始倍數要取 <code>max(p·p, 第一個 ≥ L 的 p 的倍數)</code>，否則會把小質數自己標成合數。<br>③ <code>p × p</code> 可能超過 int（46341² ≈ 21 億），用 <code>long long</code>。<br>④ 質數不足兩個時輸出 <code>There are no adjacent primes.</code><br>⑤ 平手時取<b>先出現</b>的那組（用嚴格不等式更新即可）。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const int LIM = 46350;
    vector<char> comp(LIM + 1, 0);
    vector<int> pr;
    for (int i = 2; i <= LIM; i++) {
        if (!comp[i]) pr.push_back(i);
        for (size_t j = 0; j < pr.size() && (ll)i * pr[j] <= LIM; j++) {
            comp[i * pr[j]] = 1;
            if (i % pr[j] == 0) break;
        }
    }

    ll L, U;
    while (cin >> L >> U) {
        int len = (int)(U - L + 1);
        vector<char> isC(len, 0);
        if (L == 1) isC[0] = 1;                          // 1 不是質數
        for (size_t i = 0; i < pr.size(); i++) {
            ll p = pr[i];
            ll start = max(p * p, (L + p - 1) / p * p);  // 別把 p 自己標掉
            for (ll x = start; x <= U; x += p) isC[x - L] = 1;
        }
        vector<ll> ps;
        for (int i = 0; i < len; i++) if (!isC[i]) ps.push_back(L + i);

        if (ps.size() < 2) { cout << "There are no adjacent primes.\\n"; continue; }
        int ci = 0, di = 0;                              // 最近／最遠那一對的左邊索引
        for (size_t i = 1; i + 1 < ps.size(); i++) {
            if (ps[i + 1] - ps[i] < ps[ci + 1] - ps[ci]) ci = (int)i;
            if (ps[i + 1] - ps[i] > ps[di + 1] - ps[di]) di = (int)i;
        }
        cout << ps[ci] << "," << ps[ci + 1] << " are closest, "
             << ps[di] << "," << ps[di + 1] << " are most distant.\\n";
    }
    return 0;
}`
},

10338: {
  q: "調皮的小孩：給一個單字，求它的字母<b>相異排列</b>共有幾種（含原本的排列）。單字長 ≤ 20。",
  h: "<b>多重集合排列公式</b>：<br><code>答案 = n! / (c₁! × c₂! × … × c₂₆!)</code><br>其中 n 是字母總數、cᵢ 是第 i 個字母出現的次數。<br>直覺：先當成全部相異算 n!，再把每組相同字母內部的 cᵢ! 種順序<b>除掉</b>（因為它們互換看不出差別）。<br>n ≤ 20 ⇒ <code>20! = 2432902008176640000</code>，剛好塞得進 <code>long long</code>（上限 9.2 × 10¹⁸）。<br>驗算：<code>HAPPY</code> = 5!/2! = 60 ✓、<code>WEDDING</code> = 7!/2!/2! = 2520 ✓、<code>ADAM</code> = 4!/2! = 12 ✓。",
  t: "① <b>20! 剛好在 <code>long long</code> 邊緣</b>——用 <code>int</code> 或 <code>double</code> 都會錯；<code>double</code> 的 53 位有效位數不足以精確表示 20!。<br>② <b>先除再乘</b>可以進一步降低溢位風險，但本題直接算 n! 再連除即可（過程中不會超過 20!）。<br>③ 只計字母，題目保證輸入是單字。<br>④ 輸出格式 <code>Data set k: X</code>。<br>⑤ 測資數可達 30000，把 0!..20! 先算好即可。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll fact[21];
    fact[0] = 1;
    for (int i = 1; i <= 20; i++) fact[i] = fact[i - 1] * i;

    int T; cin >> T;
    for (int t = 1; t <= T; t++) {
        string s; cin >> s;
        int cnt[256] = {0};
        for (size_t i = 0; i < s.size(); i++) cnt[(unsigned char)s[i]]++;
        ll ans = fact[s.size()];
        for (int c = 0; c < 256; c++) if (cnt[c] > 1) ans /= fact[cnt[c]];
        cout << "Data set " << t << ": " << ans << "\\n";
    }
    return 0;
}`
}
};

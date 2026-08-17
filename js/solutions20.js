/* 二星題庫（第三批 12 題） */
const SOL20 = {
11614: {
  q: "伊特魯里亞戰士：第 1 排 1 人、第 2 排 2 人、…、第 k 排 k 人。給總人數 n，求<b>能排滿幾排</b>。",
  h: "要找最大的 k 使 <code>k(k+1)/2 ≤ n</code>。解二次不等式得<br><code>k = ⌊(−1 + √(1 + 8n)) / 2⌋</code>。<br><b>但浮點開根號在大數時會有誤差</b>，正解算出來可能差 1。兩個保險做法：<br>① 用公式算出估計值後，<b>往上下各檢查一格</b>再修正。<br>② 直接<b>對答案二分搜</b>（<code>k(k+1)/2 ≤ n</code> 顯然單調），完全不碰浮點。<br>本解用二分，最穩且照樣 O(log n)。",
  t: "① <b>不要盡信 <code>sqrt</code></b>：n 大到 10¹⁸ 時 double 只有 53 位有效位數，開根號後的整數部分可能錯 1。<br>② 二分時 <code>k(k+1)/2</code> 會溢位 ⇒ 上界要抓好（k ≤ 2×10⁹ 時 k·k 就爆 long long），本解把上界設在 √(2n) 附近並用除法比較。<br>③ n 可能是 0（排不出任何一排）。<br>④ 這種「找最大的 k 使 f(k) ≤ n」的題型，<b>二分是萬用解</b>，不用每次重推公式。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        ll n; cin >> n;
        // 找最大的 k 使 k(k+1)/2 <= n；用 __int128 比較，完全不碰浮點
        ll lo = 0, hi = 2000000000LL;
        while (lo < hi) {
            ll mid = lo + (hi - lo + 1) / 2;
            if ((__int128)mid * (mid + 1) / 2 <= n) lo = mid; else hi = mid - 1;
        }
        cout << lo << "\\n";
    }
    return 0;
}`
},

10141: {
  q: "招標：每個 RFP 有 n 項需求、p 個提案。每個提案有<b>名稱、報價、以及滿足的需求清單</b>。挑<b>滿足需求最多</b>的提案；平手取<b>報價最低</b>；再平手取<b>先出現</b>的。輸出 <code>RFP #k</code> 與得標者名稱。",
  h: "邏輯本身只是「<b>三層鍵值的極值搜尋</b>」：<code>(滿足數 ↓, 報價 ↑, 出現順序 ↑)</code>。<br>因為題目保證提案列出的需求都在需求清單裡，所以<b>連字串比對都不用做</b>——直接讀那個「滿足幾項」的數字即可。<br>真正的工作量在 <b>I/O 解析</b>：名稱與需求都<b>含空白</b>，必須整行 <code>getline</code>；而報價與數量那一行則要用 <code>istringstream</code> 拆。<br>只在<b>嚴格更好</b>時才更新答案，就自動滿足「平手取先出現者」。",
  t: "① 名稱與需求字串<b>含空白</b> ⇒ 全部用 <code>getline</code>，混用 <code>cin &gt;&gt;</code> 時記得 <code>cin.ignore()</code>。<br>② 比較條件的<b>優先序不能顛倒</b>：先比滿足數（多的贏），再比報價（低的贏）。<br>③ 只在嚴格更好時更新 ⇒ 天然保留先出現者。<br>④ 報價是<b>浮點</b>，用 double 讀即可（只做比較，不做累加，精度無虞）。<br>⑤ 兩筆 RFP 之間要<b>空一行</b>；<code>0 0</code> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n, p, cs = 1;
    while (cin >> n >> p && (n || p)) {
        cin.ignore();
        for (int i = 0; i < n; i++) { string t; getline(cin, t); }   // 需求清單用不到

        string bestName;
        int bestCnt = -1;
        double bestPrice = 0;
        for (int i = 0; i < p; i++) {
            string name; getline(cin, name);
            string line; getline(cin, line);
            istringstream is(line);
            double price; int cnt;
            is >> price >> cnt;
            for (int j = 0; j < cnt; j++) { string t; getline(cin, t); }
            // 三層鍵值：滿足數多 > 報價低 > 先出現
            if (cnt > bestCnt || (cnt == bestCnt && price < bestPrice)) {
                bestCnt = cnt; bestPrice = price; bestName = name;
            }
        }
        if (cs > 1) cout << "\\n";
        cout << "RFP #" << cs++ << "\\n" << bestName << "\\n";
    }
    return 0;
}`
},

10220: {
  q: "大數階乘的數字和：給 <code>n ≤ 1000</code>，求 <code>n!</code> 的<b>每一位數字加起來</b>是多少。",
  h: "1000! 有 <b>2568 位</b>，必須用大數。但這題只要<b>數字和</b>，所以用最樸素的 <b>base 10（一格一位）</b>反而最方便——直接把每一格加起來就是答案。<br>大數乘小數的寫法：<code>每一格 × i + 進位</code>，再處理最高位的連鎖進位。<br><b>關鍵優化：一邊遞推階乘、一邊記下每個 n 的答案</b>，一次算到 1000，之後每筆詢問 O(1)。若每筆都從頭乘一次，1000 筆詢問就是 50 萬次大數乘法，會 TLE。",
  t: "① 只要<b>數字和</b>，所以不用 base 10⁹（那還得把每組拆回十進位），<b>base 10 最省事</b>。<br>② 一定要<b>預處理 1..1000 的答案</b>，不要每筆重算。<br>③ 進位可能一次進好幾位（乘 1000 時），用 <code>while (carry)</code> 往上推。<br>④ 陣列開夠大：1000! 有 2568 位，開 3000 保險。<br>⑤ 0! = 1，數字和是 1。<br>⑥ 樣例可自驗：60! → 288、100! → 648。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const int MX = 3000;
    vector<int> d(MX, 0);
    int len = 1;
    d[0] = 1;                                        // 目前是 0! = 1
    vector<int> ans(1001, 0);
    ans[0] = 1;
    for (int i = 1; i <= 1000; i++) {
        int carry = 0;
        for (int j = 0; j < len; j++) {              // 大數 × 小數
            int v = d[j] * i + carry;
            d[j] = v % 10;
            carry = v / 10;
        }
        while (carry) { d[len++] = carry % 10; carry /= 10; }
        int s = 0;
        for (int j = 0; j < len; j++) s += d[j];
        ans[i] = s;                                  // 順手記下這個 n 的答案
    }
    int n;
    while (cin >> n) cout << ans[n] << "\\n";
    return 0;
}`
},

10432: {
  q: "圓內接正多邊形面積：給圓半徑 r 與邊數 n，求<b>正 n 邊形</b>的面積，取到小數點後 3 位。",
  h: "把正 n 邊形從圓心切成 <b>n 個全等的等腰三角形</b>，每個的兩腰是 r、頂角是 <code>2π/n</code>。<br>三角形面積 = <code>(1/2)·r·r·sin(頂角)</code>，所以<br><code>面積 = (1/2)·n·r²·sin(2π/n)</code><br>一行公式，O(1)。<br>驗算：<code>r = 2, n = 2000</code> ⇒ 0.5 × 2000 × 4 × sin(0.0031416) ≈ <b>12.566</b> ✓（n 很大時趨近圓面積 πr² = 12.566，正好對得上）。",
  t: "① <b>π 要用高精度</b>：<code>acos(-1.0)</code> 或 <code>M_PI</code>，自己寫 3.14159 會在第 3 位小數出錯。<br>② 角度是<b>弧度</b>，<code>sin</code> 吃的就是弧度，不用轉換。<br>③ n 可到 20000，此時面積極接近 πr²，可以拿來自我檢查。<br>④ 輸出<b>固定 3 位小數</b>。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cout << fixed << setprecision(3);
    const double PI = acos(-1.0);
    double r; int n;
    while (cin >> r >> n)
        cout << 0.5 * n * r * r * sin(2 * PI / n) << "\\n";   // n 個等腰三角形
    return 0;
}`
},

10013: {
  q: "超長加法：兩個最多 <b>100 萬位</b>的數字相加。輸入是 N 行，<b>每行兩個數字</b>（分別是兩個大數的同一位），由<b>高位到低位</b>給。輸出恰好 N 位。",
  h: "資料已經<b>幫你拆好每一位</b>了，所以連字串解析都省了——直接<b>從最後一行往回加</b>，維護進位即可。<br><code>s = a[i] + b[i] + carry；輸出位 = s % 10；carry = s / 10</code><br>本題真正的考點是 <b>100 萬 × 2 = 200 萬個數字的 I/O 速度</b>：<br>・<code>ios::sync_with_stdio(false); cin.tie(nullptr);</code> 必加<br>・輸出先組成一個 <code>string</code>，最後一次吐出<br>驗算：樣例 <code>0463 + 4287 = 4750</code> ✓。",
  t: "① 輸入是<b>高位在前</b>，加法要<b>從最後一行往前</b>做。<br>② 輸出<b>剛好 N 位</b>——最高位的進位（若有）題目保證不會發生，直接丟掉即可。<br>③ 200 萬次 <code>cin &gt;&gt;</code>，<b>沒解除同步一定 TLE</b>。<br>④ 輸出區塊之間要<b>空一行</b>。<br>⑤ 直接開 <code>vector&lt;int&gt;</code> 兩條各 100 萬（8 MB），在記憶體限制內；若吃緊可改用 <code>vector&lt;char&gt;</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<char> a(n), b(n);
        for (int i = 0; i < n; i++) {
            int x, y; cin >> x >> y;
            a[i] = (char)x; b[i] = (char)y;
        }
        string res(n, '0');
        int carry = 0;
        for (int i = n - 1; i >= 0; i--) {            // 高位在前 → 從尾巴開始加
            int s = a[i] + b[i] + carry;
            res[i] = char('0' + s % 10);
            carry = s / 10;
        }
        cout << res << "\\n";
        if (T) cout << "\\n";                          // 區塊之間空一行
    }
    return 0;
}`
},

10114: {
  q: "買車貸款：給貸款月數、頭期款、貸款金額，以及若干「第 m 個月起每月折舊率」的紀錄。車子每個月依當時的折舊率貶值，貸款則每月平均攤還。求<b>第幾個月結束時「欠的錢」首次低於「車子價值」</b>。",
  h: "純模擬，把時間軸走一遍就好，但<b>三個量的定義要抓準</b>：<br>・<b>車價初值</b> = 頭期款 + 貸款額（車子的原始售價）<br>・<b>每月折舊</b>：<code>value *= (1 − 當月折舊率)</code>，率取「月份 ≤ 當前月」中<b>最後一筆</b>紀錄<br>・<b>欠款</b> = 貸款額 − 已繳月數 × (貸款額 / 月數)<br>從第 0 個月開始：<b>先折舊、再比較</b>。第一次出現 <code>欠款 &lt; 車價</code> 就是答案。<br>樣例逐月驗算（30 個月、頭期 500、貸款 15000）：月 0 車價 13950 vs 欠 15000 → … → 月 4 車價 13073 vs 欠 13000 ⇒ 答案 <b>4 months</b> ✓。",
  t: "① <b>車價初值含頭期款</b>（= 頭期 + 貸款），只用貸款額當車價就錯了。<br>② <b>第 0 個月也要折舊一次</b>再比較——順序寫反會差一個月。<br>③ 折舊率是<b>階梯式</b>的：某月份的紀錄一直沿用到下一筆紀錄出現。<br>④ 輸出要處理<b>單複數</b>：<code>1 month</code> vs <code>4 months</code>。<br>⑤ 月數為<b>負數</b>時結束輸入。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int dur;
    while (cin >> dur && dur >= 0) {
        double down, loan; int k;
        cin >> down >> loan >> k;
        vector<int> mon(k);
        vector<double> rate(k);
        for (int i = 0; i < k; i++) cin >> mon[i] >> rate[i];

        double value = down + loan;                  // 車子原始售價
        double monthly = loan / dur;                 // 每月攤還
        int idx = 0, m = 0;
        while (true) {
            while (idx + 1 < k && mon[idx + 1] <= m) idx++;   // 階梯式折舊率
            value *= (1.0 - rate[idx]);              // 先折舊
            double owed = loan - m * monthly;
            if (owed < value) break;                 // 再比較
            m++;
        }
        cout << m << (m == 1 ? " month\\n" : " months\\n");
    }
    return 0;
}`
},

10070: {
  q: "閏年與節慶年：判斷一個年份是否為<br>・<b>閏年</b>（被 4 整除且不被 100 整除，或被 400 整除）<br>・<b>huluculu 節</b>（被 15 整除）<br>・<b>bulukulu 節</b>（是閏年<b>且</b>被 55 整除）<br>都不是就輸出 <code>This is an ordinary year.</code>",
  h: "規則本身是國小數學，<b>真正的陷阱是年份可能有上千位數</b>——這也是本題只有 18% 過題率的唯一原因。<br>解法：把年份當<b>字串</b>讀，用逐位取模求餘數：<br><code>r = (r × 10 + digit) % m</code><br>對 4、100、400、15、55 各跑一次（或一次迴圈同時算五個）即可。<br>這個「<b>大數對小數取模</b>」的技巧非常常用，值得單獨記起來。",
  t: "① <b>年份是大數</b>！用 <code>int</code> 或 <code>long long</code> 讀會直接 WA，這是本題 18% 過題率的來源。<br>② 一年可能<b>同時輸出多行</b>（例如既是閏年又是 huluculu 年），順序是 leap → huluculu → bulukulu。<br>③ bulukulu 的條件是「<b>閏年 且</b> 被 55 整除」，不是只看 55。<br>④ 每個年份的輸出之間要<b>空一行</b>。<br>⑤ 都不符合才印 <code>This is an ordinary year.</code>（注意 an）。",
  c: `#include <bits/stdc++.h>
using namespace std;

int modOf(const string &s, int m) {                 // 大數對小數取模
    int r = 0;
    for (size_t i = 0; i < s.size(); i++) r = (r * 10 + (s[i] - '0')) % m;
    return r;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string y;
    bool first = true;
    while (cin >> y) {
        if (!first) cout << "\\n";
        first = false;
        bool leap = (modOf(y, 4) == 0 && modOf(y, 100) != 0) || modOf(y, 400) == 0;
        bool hulu = modOf(y, 15) == 0;
        bool bulu = leap && modOf(y, 55) == 0;
        if (leap) cout << "This is leap year.\\n";
        if (hulu) cout << "This is huluculu festival year.\\n";
        if (bulu) cout << "This is bulukulu festival year.\\n";
        if (!leap && !hulu && !bulu) cout << "This is an ordinary year.\\n";
    }
    return 0;
}`
},

821: {
  q: "Page Hopping：給一張<b>有向圖</b>（保證任兩點互相可達），求<b>所有有序點對之間最短路的平均長度</b>，取到小數點後 3 位。",
  h: "點數 ≤ 100 ⇒ <b>Floyd-Warshall</b> 三層迴圈直接算出全點對最短路，10⁶ 次運算。<br>Floyd 的核心是那個「<b>中繼點在最外層</b>」的迴圈順序：<br><code>for k: for i: for j: d[i][j] = min(d[i][j], d[i][k] + d[k][j])</code><br>k 放最外層代表「只允許用前 k 個點當中繼」，這個 DP 語意<b>不能</b>把 k 挪到內層。<br>最後把所有 <code>i ≠ j</code> 的距離加總除以對數即可。<br>頁碼是任意整數 ⇒ 用 <code>map</code> 離散化成 0..cnt−1。",
  t: "① <b>Floyd 的 k 必須在最外層</b>——挪到內層是最經典的錯誤，會得到錯的最短路。<br>② 頁碼<b>不是連續的 1..n</b>，要先離散化（用 <code>map&lt;int,int&gt;</code>）。<br>③ 邊是<b>有向</b>的，只設 <code>d[u][v]</code>。<br>④ 分母是<b>有序對</b>數 <code>cnt × (cnt − 1)</code>，不是組合數。<br>⑤ 每筆測資以 <code>0 0</code> 結束，整份輸入以再一個 <code>0 0</code> 結束。<br>⑥ 輸出句子含 <code>clicks</code>，格式要抄對。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cout << fixed << setprecision(3);
    int u, v, cs = 1;
    while (cin >> u >> v && (u || v)) {
        map<int, int> id;
        vector<pair<int, int> > es;
        while (true) {
            if (!id.count(u)) { int k = id.size(); id[u] = k; }
            if (!id.count(v)) { int k = id.size(); id[v] = k; }
            es.push_back(make_pair(id[u], id[v]));
            cin >> u >> v;
            if (!u && !v) break;
        }
        int n = id.size();
        const int INF = 1000000;
        vector<vector<int> > d(n, vector<int>(n, INF));
        for (int i = 0; i < n; i++) d[i][i] = 0;
        for (size_t i = 0; i < es.size(); i++) d[es[i].first][es[i].second] = 1;

        for (int k = 0; k < n; k++)                  // 中繼點必須在最外層
            for (int i = 0; i < n; i++)
                for (int j = 0; j < n; j++)
                    if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];

        double sum = 0; long long cnt = 0;
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (i != j) { sum += d[i][j]; cnt++; }
        cout << "Case " << cs++ << ": average length between pages = "
             << sum / cnt << " clicks\\n";
    }
    return 0;
}`
},

10077: {
  q: "Stern-Brocot 數系：所有最簡分數可由 <code>0/1</code> 與 <code>1/0</code> 不斷取<b>中位分數</b> <code>(a+c)/(b+d)</code> 建成一棵二元樹。給一個最簡分數，輸出它在樹上的路徑（往左 <code>L</code>、往右 <code>R</code>）。",
  h: "就是在這棵樹上做<b>二分搜</b>：<br>維護左界 <code>L = a/b</code>（初值 0/1）與右界 <code>R = c/d</code>（初值 1/0），中位分數 <code>M = (a+c)/(b+d)</code>。<br>・目標 &lt; M ⇒ 輸出 <code>L</code>，把右界收成 M<br>・目標 &gt; M ⇒ 輸出 <code>R</code>，把左界收成 M<br>・相等 ⇒ 結束<br>比較分數用<b>交叉相乘</b>（<code>p·(b+d)</code> vs <code>(a+c)·q</code>），不要用除法。<br>驗算：<code>5/7</code> ⇒ 起點 1/1 比 5/7 大 → L；再來 1/2 比較小 → R；2/3 → R；3/4 大 → L ⇒ <b>LRRL</b> ✓。<br>（有趣的是：這棵樹的路徑長度等於<b>連分數展開</b>的各項和，所以最壞情況是費氏數對。）",
  t: "① <b>用交叉相乘比較分數</b>，浮點除法會在大數時判錯。<br>② 右界初值是 <code>1/0</code>（無窮大），這是刻意的，不要以為是錯的。<br>③ 分子分母可到 10⁶，交叉相乘要用 <code>long long</code>。<br>④ 輸入保證分數<b>已是最簡</b>，所以一定找得到、不會無窮迴圈。<br>⑤ 以 <code>1 1</code> 結束（它自己就是樹根，路徑為空，不處理）。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll p, q;
    while (cin >> p >> q) {
        if (p == 1 && q == 1) break;
        ll a = 0, b = 1, c = 1, d = 0;               // 左界 0/1、右界 1/0
        string path;
        while (true) {
            ll m = a + c, n = b + d;                 // 中位分數 m/n
            ll lhs = p * n, rhs = m * q;             // 交叉相乘比較
            if (lhs == rhs) break;
            if (lhs < rhs) { path += 'L'; c = m; d = n; }
            else           { path += 'R'; a = m; b = n; }
        }
        cout << path << "\\n";
    }
    return 0;
}`
},

10195: {
  q: "圓桌武士：給三角形三邊長，求能塞進這個三角形的<b>最大圓</b>半徑（內切圓），取 3 位小數。若三邊構不成三角形，半徑為 0。",
  h: "內切圓半徑的公式：<code>r = 面積 / s</code>，其中 <code>s = (a+b+c)/2</code> 是半周長。<br>面積用 <b>海龍公式</b>：<code>面積 = √(s(s−a)(s−b)(s−c))</code>。<br>合起來就是 <code>r = √((s−a)(s−b)(s−c) / s)</code>。<br>直覺推導：把內心與三個頂點連起來，三角形被切成三個小三角形，高都是 r，底分別是 a、b、c ⇒ <code>面積 = (a+b+c)·r/2 = s·r</code>。<br>驗算：<code>12, 12, 8</code> ⇒ s = 16，面積 = √(16·4·4·8) = 45.25，r = 45.25/16 = <b>2.828</b> ✓。",
  t: "① <b>要處理退化三角形</b>：任一邊長為 0 或不滿足三角不等式時，海龍公式裡會出現負數 ⇒ 半徑輸出 <code>0.000</code>。<br>② 邊長是<b>實數</b>不是整數。<br>③ 開根號前先檢查括號內是否 &gt; 0，避免 <code>sqrt</code> 得到 NaN。<br>④ 輸出句子 <code>The radius of the round table is: X.XXX</code>，冒號後有<b>一個空白</b>。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cout << fixed << setprecision(3);
    double a, b, c;
    while (cin >> a >> b >> c) {
        double s = (a + b + c) / 2;
        double t = (s - a) * (s - b) * (s - c);
        double r = (a <= 0 || b <= 0 || c <= 0 || t <= 0) ? 0.0 : sqrt(t / s);
        cout << "The radius of the round table is: " << r << "\\n";
    }
    return 0;
}`
},

10295: {
  q: "Hay Points：給一本「字典」（單字 → 分值），再給若干份職務說明，每份以<b>只有一個句點的行</b>結束。求每份說明的<b>總分</b>（字典裡沒有的單字算 0 分）。",
  h: "<b><code>map&lt;string, long long&gt;</code> 的入門題</b>：把字典塞進 map，再逐字查表累加。<br>讀取技巧：職務說明是<b>一連串以空白分隔的單字</b>，直接 <code>while (cin &gt;&gt; w)</code> 讀到單字是 <code>\".\"</code> 為止，完全不用管換行，比逐行 getline 再拆字乾淨得多。<br>查表用 <code>m.count(w) ? m[w] : 0</code>，或直接 <code>m[w]</code>（不存在時自動建 0，但會讓 map 變大）。<br>複雜度 O(總單字數 × log 字典大小)。",
  t: "① 用 <code>cin &gt;&gt; w</code> 逐<b>單字</b>讀、以 <code>\".\"</code> 當結束符，<b>不要</b>逐行讀再自己切。<br>② 總分可達 100 × 1000 × 100000，<b>必須 <code>long long</code></b>。<br>③ 字典外的單字算 0 分，不是跳過整份說明。<br>④ 建議用 <code>find</code> 查詢而非 <code>operator[]</code>，避免無謂地把未知單字插進 map。<br>⑤ 第一行是「字典大小 m」與「說明份數 n」。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int m, n;
    while (cin >> m >> n) {
        map<string, ll> dict;
        for (int i = 0; i < m; i++) {
            string w; ll v; cin >> w >> v;
            dict[w] = v;
        }
        for (int i = 0; i < n; i++) {
            ll sum = 0;
            string w;
            while (cin >> w && w != ".") {           // 逐單字讀到句點為止
                map<string, ll>::iterator it = dict.find(w);
                if (it != dict.end()) sum += it->second;
            }
            cout << sum << "\\n";
        }
    }
    return 0;
}`
},

11991: {
  q: "Rujia Liu 的簡單題：給一個長度 n 的陣列與 m 筆詢問，每筆問「數值 v <b>第 k 次</b>出現在哪個位置」（1-based）；不存在則輸出 0。",
  h: "把「每個數值出現過的所有位置」<b>預先收集成清單</b>：<br><code>map&lt;int, vector&lt;int&gt; &gt; pos;</code>　掃一遍陣列，<code>pos[a[i]].push_back(i + 1)</code>。<br>因為是<b>由左往右</b>推入，每條清單天然遞增 ⇒ 第 k 次出現就是 <code>pos[v][k − 1]</code>，<b>O(1) 取用</b>。<br>查詢只要檢查兩件事：v 存在嗎、清單長度夠 k 嗎。<br>建表 O(n log n)、每次查詢 O(log n)。若數值範圍小也可以用 <code>vector</code> 直接索引，連 log 都省。<br>這是「<b>離線建索引把查詢降到 O(1)</b>」最乾淨的示範。",
  t: "① 位置是 <b>1-based</b>，推入時記得 <code>i + 1</code>。<br>② 數值可能是<b>負數或很大</b>，所以用 <code>map</code>／<code>unordered_map</code> 而不是直接開陣列。<br>③ 不存在（v 沒出現過，或出現次數 &lt; k）一律輸出 <b>0</b>。<br>④ n、m 各到 10 萬 ⇒ 要 <code>sync_with_stdio(false)</code>。<br>⑤ 多筆測資，讀到 EOF 結束；每筆都要清空 map。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m;
    while (cin >> n >> m) {
        map<int, vector<int> > pos;
        for (int i = 0; i < n; i++) {
            int a; cin >> a;
            pos[a].push_back(i + 1);                 // 由左往右推入 → 天然遞增
        }
        for (int i = 0; i < m; i++) {
            int k, v; cin >> k >> v;
            map<int, vector<int> >::iterator it = pos.find(v);
            if (it == pos.end() || (int)it->second.size() < k) cout << "0\\n";
            else cout << it->second[k - 1] << "\\n";
        }
    }
    return 0;
}`
}
};

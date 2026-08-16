/* 歷屆高答對率題（第五批）
   題意欄改寫得更完整：情境、限制、邊界全部寫明，不必再看原文。 */
const SOL6 = {
12602: {
  q: "車牌格式是「三個大寫字母 + 連字號 + 三個數字」，例如 <code>ABC-123</code>。<br>定義：把三個字母各自轉成它在字母表的順序（A=1, B=2, …, Z=26）相加得到 S1；把三個數字當成一個三位數得到 S2。<b>若 S1 == S2 就是「好車牌」</b>。<br>對每個車牌判斷是不是好車牌。",
  h: "字母部分逐字元累加 <code>c - 'A' + 1</code>；數字部分把三個字元組成整數（或直接 <code>stoi</code> 取後三位）。兩者相比。",
  t: "字母是 <b>A=1</b> 不是 A=0。數字部分是<b>整個三位數</b>（含前導零，如 <code>007</code> 就是 7），不是三個數字相加——這是最多人誤解的地方。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        string s; cin >> s;                       // 格式 ABC-123
        int s1 = 0;
        for (int i = 0; i < 3; i++) s1 += s[i] - 'A' + 1;   // A = 1
        int s2 = stoi(s.substr(4));                          // 整個三位數
        cout << (s1 == s2 ? "nice" : "not nice") << "\\n";
    }
}`
},
579: {
  q: "給一個 12 小時制的時間 <code>H:MM</code>（H 為 0–11、MM 為 0–59），求時針與分針之間的<b>夾角</b>。<br>時針每小時走 30 度，而且會隨著分鐘<b>連續移動</b>（例如 1:30 時針已經走到 1 和 2 中間）。分針每分鐘走 6 度。<br>輸出<b>較小</b>的那個夾角（0 到 180 度之間）。",
  h: "分針角度 = <code>6 × MM</code>；時針角度 = <code>30 × H + 0.5 × MM</code>。取兩者差的絕對值，若大於 180 就用 360 減掉。",
  t: "<b>時針會隨分鐘移動</b>——漏掉 <code>0.5 × MM</code> 這一項是本題最經典的錯誤。答案取<b>較小</b>的夾角，所以超過 180 要用 360 減。輸出固定三位小數。<code>0:00</code> 是結束訊號。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int h, m; char colon;
    cout << fixed << setprecision(3);
    while (cin >> h >> colon >> m && (h || m)) {   // 讀 H:MM
        double mh = 6.0 * m;                      // 分針
        double hh = 30.0 * h + 0.5 * m;           // 時針會隨分鐘移動
        double d = fabs(hh - mh);
        if (d > 180) d = 360 - d;                 // 取較小的夾角
        cout << d << "\\n";
    }
}`
},
11000: {
  q: "蜜蜂的家譜：<b>公蜂只有一個母親、沒有父親；母蜂有一父一母。</b><br>從一隻公蜂出發往上追溯 n 代，問這 n 代（含第 0 代那隻公蜂本身）之中<b>公蜂有幾隻</b>、<b>總共有幾隻蜂</b>。<br>n 可到 10000 以上。",
  h: "設第 n 代的公蜂數為 <code>M(n)</code>、總數為 <code>T(n)</code>，兩者都滿足<b>費氏遞迴</b>：<code>M(n) = M(n-1) + M(n-2)</code>。初值 <code>M(0)=1, M(1)=1</code>；<code>T(0)=1, T(1)=2</code>。直接迭代即可。",
  t: "答案<b>累積到第 n 代為止</b>（含前面所有代），不是只算第 n 代。數值成長極快，n 大時會超過 long long——依原題範圍判斷是否需要大數或用 unsigned long long。",
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const int N = 100;
    vector<ll> male(N), total(N);
    male[0] = 1; total[0] = 1;
    male[1] = 1; total[1] = 2;
    for (int i = 2; i < N; i++) {
        male[i] = male[i-1] + male[i-2];          // 費氏遞迴
        total[i] = total[i-1] + total[i-2];
    }
    int n;
    while (cin >> n && n >= 0) cout << male[n] << " " << total[n] << "\\n";
}`
},
12650: {
  q: "一群潛水員編號 1 到 n，出發前登記，回來後也登記。<br>給出<b>回來的人的編號清單</b>（順序任意），找出<b>沒回來的人</b>，依編號由小到大輸出。<br>若所有人都回來了，輸出固定訊息。",
  h: "開一個大小 n+1 的布林陣列標記回來的人，最後掃一遍找沒被標記的。",
  t: "沒有人失蹤時要輸出特定訊息（依原題），<b>不能輸出空行</b>。編號是 1-based。輸出的數字之間用空格分隔，注意行尾不要多空格。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n, k; cin >> n >> k;
        vector<bool> back(n + 1, false);
        while (k--) { int x; cin >> x; back[x] = true; }
        vector<int> lost;
        for (int i = 1; i <= n; i++) if (!back[i]) lost.push_back(i);
        if (lost.empty()) cout << "*\\n";          // 全員生還，訊息依原題
        else for (size_t i = 0; i < lost.size(); i++)
            cout << lost[i] << " \\n"[i + 1 == lost.size()];
    }
}`
},
264: {
  q: "康托對角線把所有正有理數排成一個序列：<br><code>1/1, 1/2, 2/1, 3/1, 2/2, 1/3, 1/4, 2/3, 3/2, 4/1, …</code><br>也就是沿著對角線走，<b>方向交替</b>：第 1 條由上往下、第 2 條由下往上，依此類推。<br>給一個編號 n，輸出該位置上的分數（<b>不化簡</b>）。",
  h: "先找出 n 落在第幾條對角線 d：最大的 d 使 <code>d(d+1)/2 < n</code>。該對角線上的位置 <code>off = n − d(d+1)/2</code>。若 d 為<b>奇數</b>則分子從大到小、偶數則相反。",
  t: "分數<b>不要化簡</b>（2/2 就輸出 2/2）。對角線的方向<b>交替</b>是唯一難點——先手算前 10 項驗證你的公式再寫。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    long long n;
    while (cin >> n) {
        long long d = 0;
        while ((d + 1) * (d + 2) / 2 < n) d++;    // 第 d 條對角線（0-based）
        long long off = n - d * (d + 1) / 2;      // 該線上第幾個
        long long num, den;
        if (d % 2 == 0) { num = d - off + 2; den = off; }   // 方向交替
        else { num = off; den = d - off + 2; }
        cout << "TERM " << n << " IS " << num << "/" << den << "\\n";
    }
}`
},
11219: {
  q: "給出生日期與今天的日期（各為 <code>日 月 年</code>），計算年齡。<br>若出生日期<b>晚於</b>今天（也就是還沒出生），輸出 <code>Invalid birth date</code>。<br>若算出的年齡<b>大於 130 歲</b>，也視為 <code>Check birth date</code>（依原題訊息）。",
  h: "年齡 = 今年 − 出生年；若今天的「月日」還沒到生日的「月日」就再減 1。比較月日時用 <code>(月, 日)</code> 這個 pair 直接比大小最省事。",
  t: "<b>生日還沒到要減 1</b> 是核心。判斷順序：先算年齡，再依序檢查「是否為負」與「是否超過 130」。輸出含 <code>Case #k: </code>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int k = 1; k <= T; k++) {
        int d1, m1, y1, d2, m2, y2;
        cin >> d1 >> m1 >> y1 >> d2 >> m2 >> y2;   // 生日、今天
        int age = y2 - y1;
        if (make_pair(m2, d2) < make_pair(m1, d1)) age--;   // 生日還沒到
        cout << "Case #" << k << ": ";
        if (age < 0) cout << "Invalid birth date\\n";
        else if (age > 130) cout << "Check birth date\\n";
        else cout << age << "\\n";
    }
}`
},
10018: {
  q: "「反轉相加」：把一個數反轉後與原數相加，若結果不是回文就重複這個動作。<br>例如 195 → 195+591=786 → 786+687=1473 → 1473+3741=5214 → 5214+4125=<b>9339</b>（回文，共 4 步）。<br>輸出<b>步數</b>與<b>最後得到的回文數</b>。題目保證會在合理步數內收斂。",
  h: "迴圈：每次把數字轉字串反轉、轉回整數相加，檢查是不是回文。",
  t: "結果會很快變大，<b>必須用 long long</b>。判斷回文前要先做過至少一次加法——即使原數本身就是回文（如 121），也要先加一次。",
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

ll rev(ll n) { ll r = 0; while (n) { r = r * 10 + n % 10; n /= 10; } return r; }
bool pal(ll n) { return n == rev(n); }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        ll n; cin >> n;
        int step = 0;
        do { n += rev(n); step++; } while (!pal(n));   // 至少加一次
        cout << step << " " << n << "\\n";
    }
}`
},
494: {
  q: "給一行文字，數出裡面有幾個<b>單字</b>。<br>單字的定義是<b>連續的英文字母</b>；數字、標點、空白都算分隔符。例如 <code>Meet me at 10 o'clock</code> 有 5 個單字（<code>Meet, me, at, o, clock</code>）。",
  h: "掃過每個字元，用一個布林旗標記錄「目前是否在單字中」。從「非字母」變成「字母」時計數加一。",
  t: "<b>數字不算單字的一部分</b>，撇號也是分隔符（<code>o'clock</code> 算兩個字）。用 getline 讀整行，讀到 EOF 為止。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string line;
    while (getline(cin, line)) {
        int cnt = 0; bool in = false;
        for (char c : line) {
            if (isalpha((unsigned char)c)) {
                if (!in) cnt++;                   // 從非字母進入字母
                in = true;
            } else in = false;
        }
        cout << cnt << "\\n";
    }
}`
},
13185: {
  q: "依<b>真因數和</b>把數字分類（真因數 = 不含自己的因數）：<br>和 < 自己 → <b>DEFICIENT</b>（不足數）<br>和 == 自己 → <b>PERFECT</b>（完全數）<br>和 > 自己 → <b>ABUNDANT</b>（過剩數）<br>給一組數字，依序輸出各自的分類。",
  h: "求真因數和跑到 √n，成對加入 i 與 n/i，最後扣掉 n 本身（或一開始就從 1 起算不含 n）。",
  t: "<b>1 的真因數和是 0</b>，屬於 DEFICIENT。平方數時 <code>i == n/i</code> 只能加一次，否則會多算。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        long long n; cin >> n;
        long long s = (n == 1) ? 0 : 1;           // 1 沒有真因數
        for (long long i = 2; i * i <= n; i++)
            if (n % i == 0) {
                s += i;
                if (i != n / i) s += n / i;       // 平方數不重複加
            }
        cout << (s == n ? "PERFECT" : (s < n ? "DEFICIENT" : "ABUNDANT")) << "\\n";
    }
}`
},
1237: {
  q: "有一份型錄，每筆是「品牌名 最低價 最高價」。<br>給一個價格，找出<b>價格區間包含該價格</b>的品牌。<br>若<b>恰好只有一個</b>品牌符合就輸出品牌名；若有<b>多個</b>符合或<b>一個都沒有</b>，輸出 <code>UNDETERMINED</code>。",
  h: "掃過所有型錄項目，統計符合的個數並記住最後一個符合的品牌名。最後依個數是否恰為 1 決定輸出。",
  t: "「多個符合」與「零個符合」<b>都是 UNDETERMINED</b>——只有恰好一個才輸出品牌。價格是浮點數，比較時用 ≤ 與 ≥（含端點）。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<string> name(n);
        vector<double> lo(n), hi(n);
        for (int i = 0; i < n; i++) cin >> name[i] >> lo[i] >> hi[i];
        int q; cin >> q;
        while (q--) {
            double p; cin >> p;
            int cnt = 0; string who;
            for (int i = 0; i < n; i++)
                if (p >= lo[i] && p <= hi[i]) { cnt++; who = name[i]; }
            cout << (cnt == 1 ? who : "UNDETERMINED") << "\\n";   // 多個或零個都是
        }
    }
}`
},
406: {
  q: "給 n 與 c，先找出<b>所有不超過 n 的質數</b>（<b>1 也算</b>，這是本題的特殊定義）。<br>從這個質數清單的<b>正中間</b>取出 <code>2c</code> 個（若清單長度為奇數則取 <code>2c−1</code> 個），輸出它們。<br>若清單長度不足就全部輸出。",
  h: "先篩出質數（記得把 1 加進去）。設清單長度 L：長度為奇數時取 <code>2c−1</code> 個、偶數時取 <code>2c</code> 個，起始位置為 <code>(L − 取出個數) / 2</code>。",
  t: "<b>1 被當成質數</b>是本題的特殊規定，忘了加會全錯。取出個數依 L 的<b>奇偶</b>而不同。起始位置若算出負數要夾成 0（全部輸出）。輸出前有 <code>n c</code> 的標頭，測資間空一行。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, c;
    bool first = true;
    while (cin >> n >> c) {
        vector<int> pr{1};                        // 本題把 1 也算質數
        for (int i = 2; i <= n; i++) {
            bool ok = true;
            for (int j = 2; j * j <= i; j++) if (i % j == 0) { ok = false; break; }
            if (ok) pr.push_back(i);
        }
        int L = pr.size();
        int take = (L % 2) ? 2 * c - 1 : 2 * c;   // 依奇偶決定取幾個
        take = min(take, L);
        int st = max(0, (L - take) / 2);
        if (!first) cout << "\\n";
        first = false;
        cout << n << " " << c << ":";
        for (int i = st; i < st + take && i < L; i++) cout << " " << pr[i];
        cout << "\\n";
    }
}`
},
10903: {
  q: "n 個人打剪刀石頭布循環賽，每兩人對戰 k 次。<br>給出每一場的結果（誰對誰、誰贏），求<b>每個人的勝率</b>：<code>勝場 / (勝場 + 敗場)</code>——<b>平手不列入分母</b>。<br>若某人所有比賽都平手（分母為 0），輸出 <code>-</code>。",
  h: "開兩個陣列分別記錄每個人的勝場與敗場，逐場累加，最後計算比率。",
  t: "<b>平手不計入分母</b>是本題核心。分母為 0 時輸出 <code>-</code> 而不是 0.000。輸出固定三位小數，測資之間空一行。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    bool first = true;
    while (T--) {
        int n, k; cin >> n >> k;
        vector<int> win(n + 1, 0), lose(n + 1, 0);
        int games = n * (n - 1) / 2 * k;
        while (games--) {
            int a, b; string r; cin >> a >> b >> r;   // 依原題格式調整
            if (r == "a") { win[a]++; lose[b]++; }
            else if (r == "b") { win[b]++; lose[a]++; }
            // 平手不計
        }
        if (!first) cout << "\\n";
        first = false;
        for (int i = 1; i <= n; i++) {
            int tot = win[i] + lose[i];
            if (tot == 0) cout << "-\\n";           // 全平手
            else cout << fixed << setprecision(3) << (double)win[i] / tot << "\\n";
        }
    }
}`
},
10530: {
  q: "猜數字遊戲：答案是 1 到 10 之間的整數。<br>玩家每次猜一個數 g，主持人回應 <code>too high</code>、<code>too low</code> 或 <code>right on</code>。<br>看完一連串問答後，判斷主持人有沒有<b>說謊</b>——也就是這些回應是否可能同時成立。<br>回應 <code>right on</code> 代表本輪結束。",
  h: "維護可能答案的區間 <code>[lo, hi]</code>，初值 [1, 10]。<code>too high</code> → <code>hi = g − 1</code>；<code>too low</code> → <code>lo = g + 1</code>；<code>right on</code> → 檢查 g 是否仍落在 <code>[lo, hi]</code> 內。",
  t: "區間更新的<b>方向不要寫反</b>：說「太大」代表答案比 g <b>小</b>。<code>right on</code> 時若 g 已不在區間內就是說謊。每輪結束後要<b>重置區間</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int g;
    while (cin >> g && g) {
        int lo = 1, hi = 10;
        bool lie = false;
        string a, b;
        while (true) {
            cin >> a >> b;                         // "too high" / "too low" / "right on"
            if (b == "on") {                       // right on
                if (g < lo || g > hi) lie = true;
                break;
            }
            if (b == "high") hi = min(hi, g - 1);  // 太大 → 答案更小
            else lo = max(lo, g + 1);
            cin >> g;
        }
        cout << (lie ? "Stan is dishonest" : "Stan may be honest") << "\\n";
    }
}`
},
11054: {
  q: "村莊沿一條直線排列。每個村莊有一個數字：<b>正數代表要賣出</b>那麼多桶酒，<b>負數代表要買入</b>。總和保證為 0。<br>把 1 桶酒搬動 1 個村莊的距離要花 1 單位工作量。求把所有交易完成的<b>最少總工作量</b>。",
  h: "從左往右掃，維護<b>前綴和</b>。走到第 i 個村莊時，前綴和的絕對值就是「必須通過 i 與 i+1 之間那條路的酒桶數」，把它累加起來就是答案。",
  t: "答案可到 10¹⁴ 以上，<b>必須用 long long</b>。想通「拆解到每一條路段上」是本題全部——不要試圖模擬酒桶怎麼搬。",
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n && n) {
        ll carry = 0, total = 0;
        for (int i = 0; i < n; i++) {
            ll x; cin >> x;
            carry += x;                           // 前綴和
            total += llabs(carry);                // 這條路段要通過的桶數
        }
        cout << total << "\\n";
    }
}`
},
401: {
  q: "給一個字串（僅含大寫字母與數字），判斷它是不是：<br><b>回文</b>（正著讀反著讀一樣）<br><b>鏡像字串</b>（每個字元換成它的鏡像後反著讀一樣，例如 A↔A、E↔3、J↔L、S↔2、Z↔5）<br>依結果輸出四種句型之一：普通回文、鏡像字串、兩者皆是、兩者皆非。",
  h: "雙指針從兩端往中間掃。回文檢查 <code>s[i] == s[n-1-i]</code>；鏡像檢查 <code>mirror(s[i]) == s[n-1-i]</code>。",
  t: "<b>鏡像對照表要自己建，漏一個字元就錯</b>。輸出的四種句型含標點要一字不差。<b>長度為 1 的字串兩種性質都成立</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;

// 對照表：字元 -> 鏡像；索引 0-25 為 A-Z，26-35 為 0-9
const char* M = "A   3  HIL JM O   2TUVWXY51SE Z  8 ";

char mirror(char c) {
    if (isalpha((unsigned char)c)) return M[c - 'A'];
    return M[c - '0' + 25];
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string s;
    while (cin >> s) {
        int n = s.size();
        bool p = true, m = true;
        for (int i = 0; i < n; i++) {
            if (s[i] != s[n-1-i]) p = false;
            if (mirror(s[i]) != s[n-1-i]) m = false;
        }
        cout << s << " -- is ";
        if (p && m) cout << "a mirrored palindrome.\\n";
        else if (p) cout << "a regular palindrome.\\n";
        else if (m) cout << "a mirrored string.\\n";
        else cout << "not a palindrome.\\n";
        cout << "\\n";
    }
}`
},
706: {
  q: "用 <code>-</code> 與 <code>|</code> 畫出七段顯示器的數字。<br>給筆畫長度 s（1 ≤ s ≤ 10）與一個數字串，把每個數字畫成寬 <code>s+2</code>、高 <code>2s+3</code> 的圖案，數字之間<b>空一欄</b>。<br>橫線用 <code>-</code>、豎線用 <code>|</code>、其餘位置用空白。",
  h: "把 0–9 各自「點亮哪幾段」寫成七位的查表（順序：上、左上、右上、中、左下、右下、下）。輸出時分成 <code>2s+3</code> 列處理：第 0、s+1、2s+2 列畫橫線，其餘列畫豎線。",
  t: "整題價值在<b>把七段表建對</b>與<b>列的分類寫對</b>。數字之間要空一欄、行尾不要多餘空白。每個數字之後（含最後一個）依原題決定是否空行。",
  c: `#include <bits/stdc++.h>
using namespace std;
// 七段：上 左上 右上 中 左下 右下 下
const char* SEG[10] = {
    "1110111","0010010","1011101","1011011","0111010",
    "1101011","1101111","1010010","1111111","1111011"
};

int main() {
    int s; string d;
    while (cin >> s >> d && s) {
        int H = 2 * s + 3;
        for (int r = 0; r < H; r++) {
            string line;
            for (size_t k = 0; k < d.size(); k++) {
                const char* g = SEG[d[k] - '0'];
                string col(s + 2, ' ');
                if (r == 0 || r == s + 1 || r == 2 * s + 2) {          // 橫線列
                    int seg = (r == 0) ? 0 : (r == s + 1 ? 3 : 6);
                    if (g[seg] == '1') for (int i = 1; i <= s; i++) col[i] = '-';
                } else {                                               // 豎線列
                    bool up = r < s + 1;
                    if (g[up ? 1 : 4] == '1') col[0] = '|';
                    if (g[up ? 2 : 5] == '1') col[s + 1] = '|';
                }
                line += col;
                if (k + 1 < d.size()) line += ' ';                     // 數字間空一欄
            }
            while (!line.empty() && line.back() == ' ') line.pop_back();
            cout << line << "\\n";
        }
        cout << "\\n";
    }
}`
},
1644: {
  q: "定義「質數間隙」：對一個數 n，找出<b>最接近它的兩個質數</b>——不大於 n 的最大質數 p、不小於 n 的最小質數 q——輸出 <code>q − p</code>。<br><b>若 n 本身就是質數，間隙為 0。</b>",
  h: "先篩出足夠大的質數表（10⁶ 夠用）。若 n 是質數直接輸出 0；否則往下找 p、往上找 q。",
  t: "<b>n 本身是質數時答案是 0</b>，不是相鄰兩質數的距離——這是最多人錯的地方。篩表放迴圈外只建一次。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const int N = 1300000;
    vector<bool> notp(N, false);
    notp[0] = notp[1] = true;
    for (int i = 2; (long long)i * i < N; i++)
        if (!notp[i]) for (int j = i * i; j < N; j += i) notp[j] = true;
    int n;
    while (cin >> n && n) {
        if (!notp[n]) { cout << "0\\n"; continue; }   // 本身是質數
        int p = n, q = n;
        while (notp[p]) p--;
        while (notp[q]) q++;
        cout << q - p << "\\n";
    }
}`
},
993: {
  q: "給一個正整數 N，找出<b>最小的正整數</b>，使它的<b>各位數字相乘</b>等於 N。<br>例如 N = 10 → 答案 25（2×5=10）；N = 1 → 答案 1；找不到則輸出 −1。",
  h: "<b>貪心</b>：從 9 往 2 試除，能整除就一直除並記錄該位數字。最後把記錄的數字<b>由小到大</b>排列即得最小數。若最後剩下的商不是 1 就無解。",
  t: "從<b>大的因數（9）開始除</b>才能讓位數最少；位數最少的前提下再由小到大排才是最小值。<b>N = 1 時答案是 1</b>，要特判。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        long long n; cin >> n;
        if (n == 1) { cout << "1\\n"; continue; }   // 特判
        string s;
        for (int d = 9; d >= 2; d--)               // 從大的開始除，位數最少
            while (n % d == 0) { s += char('0' + d); n /= d; }
        if (n != 1) { cout << "-1\\n"; continue; }
        sort(s.begin(), s.end());                  // 由小到大才是最小數
        cout << s << "\\n";
    }
}`
},
496: {
  q: "給兩個整數集合 A 與 B（各為一行、以空白分隔，可能有重複元素需先去重），判斷它們的關係並輸出下列之一：<br><code>A is a proper subset of B</code>（A 真包含於 B）<br><code>B is a proper subset of A</code><br><code>A equals B</code><br><code>A and B are disjoint</code>（沒有共同元素）<br><code>I'm confused!</code>（以上皆非）",
  h: "各自讀進 <code>set</code>（自動去重排序），再用 <code>includes</code> 或直接比較大小與交集判斷。",
  t: "判斷<b>順序</b>要對：先判相等、再判真子集、再判互斥。「真子集」不含相等的情況。用 set 讀入可一次解決去重與排序。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    string la, lb;
    while (getline(cin, la) && getline(cin, lb)) {
        set<int> A, B;
        { stringstream ss(la); int x; while (ss >> x) A.insert(x); }
        { stringstream ss(lb); int x; while (ss >> x) B.insert(x); }
        vector<int> inter;
        set_intersection(A.begin(), A.end(), B.begin(), B.end(), back_inserter(inter));
        if (A == B) cout << "A equals B\\n";
        else if (inter.size() == A.size()) cout << "A is a proper subset of B\\n";
        else if (inter.size() == B.size()) cout << "B is a proper subset of A\\n";
        else if (inter.empty()) cout << "A and B are disjoint\\n";
        else cout << "I'm confused!\\n";
    }
}`
},
10200: {
  q: "尤拉發現多項式 <code>n² + n + 41</code> 在 n 較小時常常產生質數。<br>給區間 <code>[a, b]</code>，計算其中有多少個 n 使 <code>n² + n + 41</code> 是質數，輸出<b>百分比</b>（四捨五入到小數點後兩位）。",
  h: "對 a 到 b 每個 n 算出多項式值再判質數。b − a 不大，直接暴力即可。可先預算一張表加速。",
  t: "百分比的分母是 <code>b − a + 1</code>（<b>含兩端</b>）。多項式值可能較大，判質數用 O(√n) 試除。輸出固定兩位小數並帶 <code>%</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;

bool isP(long long n) {
    if (n < 2) return false;
    for (long long i = 2; i * i <= n; i++) if (n % i == 0) return false;
    return true;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    long long a, b;
    cout << fixed << setprecision(2);
    while (cin >> a >> b) {
        long long cnt = 0, tot = b - a + 1;        // 含兩端
        for (long long n = a; n <= b; n++)
            if (isP(n * n + n + 41)) cnt++;
        cout << 100.0 * cnt / tot << "\\n";
    }
}`
},
11220: {
  q: "解碼訊息：給 n 行文字，取<b>第 i 行的第 i 個單字</b>（1-based），把取出的單字依序組成答案，以空白分隔輸出。",
  h: "逐行讀入後用 <code>stringstream</code> 切成單字，取第 i 個（i 從 1 算起）。",
  t: "行號與單字序號都是 <b>1-based</b>。必須用 getline 整行讀再切詞。測資之間要空一行。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T; cin.ignore();
    bool first = true;
    while (T--) {
        int n; cin >> n; cin.ignore();
        vector<string> res;
        for (int i = 1; i <= n; i++) {
            string line; getline(cin, line);
            stringstream ss(line);
            string w;
            for (int j = 0; j < i && ss >> w; j++) ;   // 取第 i 個單字
            res.push_back(w);
        }
        if (!first) cout << "\\n";
        first = false;
        for (size_t i = 0; i < res.size(); i++)
            cout << res[i] << " \\n"[i + 1 == res.size()];
    }
}`
}
};

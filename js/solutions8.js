/* 歷屆補完（第一批）— 依原文撰寫，輸入輸出格式與範例見同頁「題目原文」 */
const SOL8 = {
12869: {
  q: "定義 <code>fzero(n)</code> 為 <b>n! 末尾有幾個零</b>。給區間 [low, high]（可到 10<sup>18</sup>），問 <code>fzero</code> 在這個區間內總共會取到<b>幾種不同的值</b>。",
  h: "<code>fzero(n) = ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + …</code>（每個 5 的因子貢獻一個零）。<br>關鍵：<b>fzero 是非遞減函數</b>，所以區間內的相異值個數就是 <code>fzero(high) − fzero(low) + 1</code>，不必逐一枚舉。",
  t: "n 可到 10<sup>18</sup>，逐一算必 TLE——<b>要靠「單調」這個性質把它變成兩次計算</b>。累乘 5 的冪會溢位，迴圈條件寫成 <code>n / p</code> 遞減比較安全。用 unsigned long long 或注意 p 的上界。",
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

// n! 末尾的零個數
ll fzero(ll n) {
    ll cnt = 0;
    for (ll p = 5; p <= n / 5 * 5 && p > 0; p *= 5) {
        cnt += n / p;
        if (p > n / 5) break;              // 防止 p *= 5 溢位
    }
    return cnt;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll lo, hi;
    while (cin >> lo >> hi && (lo || hi))
        cout << fzero(hi) - fzero(lo) + 1 << "\\n";   // 單調 → 相異值數
}`
},
11040: {
  q: "一面三角形磚牆共 <b>9 列</b>，第 i 列有 i 塊磚。規則是<b>每塊磚的數字等於它下方兩塊磚之和</b>（第 9 列除外）。<br>題目只給<b>奇數列的奇數位置</b>（第 1、3、5、7、9 列，各列的第 1、3、5… 塊），要你把整面牆 9 列全部還原並輸出。",
  h: "從上往下推。若第 r−2 列已知、第 r 列的奇數位置已知，可解出第 r 列的偶數位置：<br>由 <code>a[r-2][j] = a[r][j] + 2·a[r][j+1] + a[r][j+2]</code> 得 <code>a[r][j+1] = (a[r-2][j] − a[r][j] − a[r][j+2]) / 2</code>。<br>奇數列全部補完後，偶數列直接由下一列兩兩相加得到。",
  t: "那個 <b>2 倍係數</b>是關鍵——展開兩層之後中間項會被算兩次。要<b>先把所有奇數列補完</b>再回頭算偶數列，順序反了就缺資料。題目保證有解，所以除以 2 必定整除。",
  c: `#include <bits/stdc++.h>
using namespace std;

int a[10][10];                              // a[列][位置]，1-based

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        memset(a, 0, sizeof(a));
        // 讀入奇數列的奇數位置
        for (int r = 1; r <= 9; r += 2)
            for (int j = 1; j <= r; j += 2) cin >> a[r][j];
        // 由上往下補齊奇數列的偶數位置
        for (int r = 3; r <= 9; r += 2)
            for (int j = 2; j < r; j += 2)
                a[r][j] = (a[r-2][j-1] - a[r][j-1] - a[r][j+1]) / 2;
        // 偶數列 = 下一列相鄰兩塊之和
        for (int r = 8; r >= 2; r -= 2)
            for (int j = 1; j <= r; j++)
                a[r][j] = a[r+1][j] + a[r+1][j+1];
        for (int r = 1; r <= 9; r++)
            for (int j = 1; j <= r; j++)
                cout << a[r][j] << " \\n"[j == r];
    }
}`
},
10106: {
  q: "兩個非負整數相乘，每個數<b>最多 250 位</b>。輸入成對的行，讀到 EOF。",
  h: "<b>大數乘法</b>：把兩數反轉存成數字陣列，用兩層迴圈累加 <code>res[i+j] += a[i] * b[j]</code>，最後統一進位、去前導零、反轉輸出。",
  t: "結果最多 500 位，遠超任何內建型別。<b>先全部累加再統一進位</b>比邊乘邊進位好寫也不易錯（中間值不會超過 250×81，int 足夠）。<b>任一數為 0 時答案是 0</b>，去前導零時要留一位。",
  c: `#include <bits/stdc++.h>
using namespace std;

string mul(const string& x, const string& y) {
    int n = x.size(), m = y.size();
    vector<int> r(n + m, 0);
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            r[i + j] += (x[n-1-i] - '0') * (y[m-1-j] - '0');   // 先全部累加
    int carry = 0;
    for (int i = 0; i < (int)r.size(); i++) {
        int v = r[i] + carry;
        r[i] = v % 10; carry = v / 10;
    }
    string s;
    int k = r.size() - 1;
    while (k > 0 && r[k] == 0) k--;                            // 去前導零但留一位
    for (; k >= 0; k--) s += char('0' + r[k]);
    return s;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string a, b;
    while (cin >> a >> b) cout << mul(a, b) << "\\n";
}`
},
1200: {
  q: "解一元一次方程式，變數固定是小寫 <code>x</code>，沒有括號、沒有一元正負號。例如 <code>2x-4+5x+300=98x</code>。<br>每一項是「整數」或「整數後接 x」或單獨一個 <code>x</code>（等同 1x）。<br>輸出 <b>⌊x⌋</b>；無解輸出 <code>IMPOSSIBLE</code>，無限多解輸出 <code>IDENTITY</code>。",
  h: "把等號兩邊都整理成 <code>A·x + B</code> 的形式：掃過字串累積係數 A 與常數 B，等號右邊的貢獻取負號搬到左邊。<br>最後解 <code>A·x + B = 0</code>：A ≠ 0 → <code>x = −B/A</code>；A = 0 且 B = 0 → IDENTITY；A = 0 且 B ≠ 0 → IMPOSSIBLE。",
  t: "<b>⌊⌋ 是向下取整</b>，負數時 C++ 的整數除法會往零截斷，必須修正（例如用 <code>floor((double)-B/A)</code> 或先判正負）。<br>單獨的 <code>x</code> 係數是 1、<code>-x</code> 是 −1，別漏掉。過了等號之後所有項要變號。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        string s; cin >> s;
        long long A = 0, B = 0;
        int sign = 1, side = 1;            // side: 等號右邊變號
        size_t i = 0;
        while (i < s.size()) {
            if (s[i] == '+') { sign = 1; i++; continue; }
            if (s[i] == '-') { sign = -1; i++; continue; }
            if (s[i] == '=') { side = -1; sign = 1; i++; continue; }
            long long num = 0; bool hasNum = false;
            while (i < s.size() && isdigit((unsigned char)s[i])) { num = num * 10 + (s[i++] - '0'); hasNum = true; }
            if (i < s.size() && s[i] == 'x') {
                A += (long long)sign * side * (hasNum ? num : 1);   // 單獨的 x 係數為 1
                i++;
            } else B += (long long)sign * side * num;
            sign = 1;
        }
        if (A == 0) cout << (B == 0 ? "IDENTITY" : "IMPOSSIBLE") << "\\n";
        else {
            double x = -(double)B / A;
            cout << (long long)floor(x) << "\\n";     // 向下取整，負數也正確
        }
    }
}`
},
10763: {
  q: "交換學生媒合：每位學生給出「原本所在地 → 想去的地方」。<br>方案可行的條件是<b>每個 A→B 都要有一個對應的 B→A</b>。判斷可不可行，輸出 YES / NO。人數可到 500000。",
  h: "用 <code>map&lt;pair&lt;int,int&gt;, int&gt;</code> 計數：讀到 (a,b) 就 <code>++cnt[{a,b}]</code>。最後檢查每個 (a,b) 的個數是否等於 (b,a) 的個數。<br>更省事的作法：讀到 (a,b) 時若 <code>cnt[{b,a}] &gt; 0</code> 就把它抵銷掉，最後檢查是否全部歸零。",
  t: "n 可到 <b>50 萬</b>，<code>cin</code> 一定要加速。<b>是要求數量相等而不只是存在</b>——三個 A→B 配一個 B→A 是不行的，用抵銷法自然就處理掉了。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n && n) {
        map<pair<int,int>, int> cnt;
        int unmatched = 0;
        for (int i = 0; i < n; i++) {
            int a, b; cin >> a >> b;
            if (cnt[{b, a}] > 0) { cnt[{b, a}]--; unmatched--; }   // 抵銷
            else { cnt[{a, b}]++; unmatched++; }
        }
        cout << (unmatched == 0 ? "YES" : "NO") << "\\n";
    }
}`
},
612: {
  q: "定義字串的<b>「未排序度」= 逆序對數</b>（有多少對字元順序相反）。<br>給 m 個等長的 DNA 字串，依未排序度<b>由小到大</b>排列輸出；<b>相同時保持原始輸入順序</b>。",
  h: "對每個字串用雙層迴圈算逆序對數（長度 ≤ 50，很快），再用 <code>stable_sort</code> 依該值排序。",
  t: "<b>必須用 <code>stable_sort</code></b>——題目要求同分時保持原順序，普通 <code>sort</code> 不保證。<br>輸入的測資之間有<b>空行</b>，測資之間輸出也要空一行。",
  c: `#include <bits/stdc++.h>
using namespace std;

int inv(const string& s) {
    int c = 0;
    for (size_t i = 0; i < s.size(); i++)
        for (size_t j = i + 1; j < s.size(); j++)
            if (s[i] > s[j]) c++;
    return c;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int t = 0; t < T; t++) {
        int n, m; cin >> n >> m;
        vector<string> v(m);
        for (auto &s : v) cin >> s;
        stable_sort(v.begin(), v.end(),           // 同分保持原順序
                    [](const string& a, const string& b) { return inv(a) < inv(b); });
        if (t) cout << "\\n";
        for (auto &s : v) cout << s << "\\n";
    }
}`
},
145: {
  q: "電話費依<b>距離級距</b>（A–E）與<b>通話時段</b>計費。三個時段是：<br>日間 08:00–18:00、晚間 18:00–22:00、夜間 22:00–08:00。<br>跨時段的通話<b>按各時段實際分鐘數分別計費</b>。給級距、電話號碼、起訖時間，算出各時段分鐘數與總費用。",
  h: "把起訖時間換成分鐘數，<b>逐分鐘</b>判斷屬於哪個時段並計數（最多 1440 次，很快）。費率查表後相乘。跨午夜時終點加 1440。",
  t: "逐分鐘計數時，第 t 分鐘的歸屬要看<b>該分鐘的起始時刻</b>（例如 17:58 開始的那分鐘算日間）。費率表要建對——樣例 <code>A 17:58→18:04</code> 是 2 分日間 + 4 分晚間 = 2×0.10 + 4×0.06 = <b>0.44</b>，可用來驗證。輸出有固定欄寬。",
  c: `#include <bits/stdc++.h>
using namespace std;

// A–E 各級距的 日 / 晚 / 夜 費率（美元/分鐘）
const double RATE[5][3] = {
    {0.10, 0.06, 0.02}, {0.25, 0.15, 0.05}, {0.53, 0.33, 0.13},
    {0.87, 0.47, 0.17}, {1.44, 0.80, 0.30}
};

int band(int m) {                         // 0=日 1=晚 2=夜
    int h = (m / 60) % 24;
    if (h >= 8 && h < 18) return 0;
    if (h >= 18 && h < 22) return 1;
    return 2;
}

int main() {
    string step, num;
    int h1, m1, h2, m2;
    while (cin >> step && step != "#") {
        cin >> num >> h1 >> m1 >> h2 >> m2;
        int s = h1 * 60 + m1, e = h2 * 60 + m2;
        if (e <= s) e += 1440;                    // 跨午夜
        int cnt[3] = {0, 0, 0};
        for (int t = s; t < e; t++) cnt[band(t)]++;   // 逐分鐘歸類
        int k = step[0] - 'A';
        double cost = 0;
        for (int i = 0; i < 3; i++) cost += cnt[i] * RATE[k][i];
        cout << setw(10) << num
             << setw(6) << cnt[0] << setw(6) << cnt[1] << setw(6) << cnt[2]
             << setw(3) << step << fixed << setprecision(2) << setw(7) << cost << "\\n";
    }
}`
},
300: {
  q: "馬雅曆換算。<b>Haab 曆</b>一年 365 天、19 個月：前 18 個月各 20 天（日編號 0–19），最後一個月 <code>uayet</code> 只有 5 天（0–4）。<br><b>Tzolkin 曆</b>一年 260 天：日編號 1–13 循環，同時搭配 20 個日名循環。<br>給 Haab 日期（格式 <code>日. 月 年</code>），換算成 Tzolkin 日期（格式 <code>數字 日名 年</code>）。",
  h: "先把 Haab 換成「從第 0 年第 0 天起的<b>絕對天數</b>」：<code>d = 年×365 + 月序×20 + 日</code>。<br>再換成 Tzolkin：年 = <code>d / 260</code>、數字 = <code>d % 13 + 1</code>、日名 = 第 <code>d % 20</code> 個。",
  t: "Haab 的日編號<b>從 0 開始</b>、Tzolkin 的數字<b>從 1 開始</b>——差一就全錯。輸入的日期後面有個<b>句點</b>要吃掉。輸出第一行是筆數。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    vector<string> hm = {"pop","no","zip","zotz","tzec","xul","yoxkin","mol","chen",
        "yax","zac","ceh","mac","kankin","muan","pax","koyab","cumhu","uayet"};
    vector<string> tn = {"imix","ik","akbal","kan","chicchan","cimi","manik","lamat",
        "muluk","ok","chuen","eb","ben","ix","mem","cib","caban","eznab","canac","ahau"};
    int T; cin >> T;
    cout << T << "\\n";
    while (T--) {
        int d, y; char dot; string mon;
        cin >> d >> dot >> mon >> y;              // 格式 "10. zac 1995"
        int mi = find(hm.begin(), hm.end(), mon) - hm.begin();
        long long abs = (long long)y * 365 + mi * 20 + d;   // 絕對天數
        cout << abs % 13 + 1 << " " << tn[abs % 20] << " " << abs / 260 << "\\n";
    }
}`
}
};

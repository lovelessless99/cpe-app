/* 第六十七批 —— pdftotext 重抽題敘後補回 */
const SOL107 = {
  '10028': {
    q: `某省的駕照記點制度如下：
    新駕駛一開始沒有任何優點或違規點數。被判定違規時，依嚴重程度給 2 到 15 點違規點數。
    每「連續兩年沒有違規、也沒有違規點數」就得到 1 點優點，最多 5 點。每 1 點優點可以抵銷最多 2 點違規點數。
    之後若再違規：若違規點數**超過**優點的兩倍，就把違規點數減去「優點的兩倍」，並把優點歸零；若違規點數**小於或等於**優點的兩倍，就把違規點數歸零，並把優點減去「違規點數的一半」（小數捨去）。
    只要有一整年沒有違規，違規點數就會減少：減去「一半」或「2」中**較多**的那個；小數與負數都捨去。這個減點會在「最近一次違規」的每個週年日發生，直到點數歸零為止。
    若新的違規與某次減點或加優點發生在同一天，先做減點/加優點，再給新的違規點數。

輸入：第一行是測資組數，之後空一行；各組之間也空一行。每組第一行是駕照發照日期（yyyymmdd），接下來每行是一次違規的日期（yyyymmdd）與點數（2 到 15 的整數），依時間順序排列。
輸出：發照當天，以及每次優點或違規點數改變時，各印一行日期與點數。累積到 5 點優點（在最後一次違規之後）就結束。各組之間空一行。

範例輸入
1

19820508
19830606 2
19830607 2
19891212 15

範例輸出
1982-05-08 No merit or demerit points.
1983-06-06 2 demerit point(s).
1983-06-07 4 demerit point(s).
1984-06-07 2 demerit point(s).
1985-06-07 No merit or demerit points.
1987-06-07 1 merit point(s).
1989-06-07 2 merit point(s).
1989-12-12 11 demerit point(s).
1990-12-12 5 demerit point(s).
1991-12-12 2 demerit point(s).
1992-12-12 No merit or demerit points.
1994-12-12 1 merit point(s).
1996-12-12 2 merit point(s).
1998-12-12 3 merit point(s).
2000-12-12 4 merit point(s).
2002-12-12 5 merit point(s).`,
    h: `這是純模擬，重點是把「下一個事件」找對。維護三個東西：目前的違規點數、優點數、
以及一個「基準日 + 模式」：

    模式 = 減點：基準日是最近一次違規，**每 1 年**減一次點，直到歸零
    模式 = 加優點：基準日是「點數歸零的那一天」或發照日，**每 2 年**加一點，最多 5 點

每一步比較「下一個自動事件的日期」與「下一次違規的日期」，日期較早者先處理；
**同一天時自動事件先做**（題目明講）。

【兩個計算規則】
    減點：新點數 = ⌊舊點數 − max(舊點數 / 2, 2)⌋，不足 0 就算 0
        11 → max(5.5, 2) = 5.5 → 5.5 → 取整 **5**
        5  → max(2.5, 2) = 2.5 → 2.5 → **2**
        4  → max(2, 2) = 2 → **2**
        2  → max(1, 2) = 2 → **0**
    違規時若有優點：
        點數 > 2 × 優點 → 點數 −= 2 × 優點、優點 = 0
        否則 → 點數 = 0、優點 −= ⌊點數 / 2⌋

【逐行驗算】（範例 16 行我全部跑過，逐字相同）
  1983-06-06 給 2 點；隔天再給 2 點（同樣沒滿一年，所以是**累加**）→ 4 點。
  最近一次違規是 1983-06-07，週年日 1984-06-07 減成 2、1985-06-07 減成 0。
  從 1985-06-07 開始算兩年 → 1987 得 1 點、1989 得 2 點。
  1989-12-12 違規 15 點：15 > 2 × 2 = 4 → 15 − 4 = **11**，優點歸零。
  之後每年減：11 → 5 → 2 → 0（1992-12-12），再從那天起每兩年加一點，
  1994、1996、1998、2000、2002 依序到 5 點，結束 ✓

【日期運算】只需要「加 N 年」，把年份加上去、月日不變即可；
若原本是 2 月 29 日而目標年不是閏年，就夾到當月最後一天。`,
    t: `1. 加優點的計時起點是「點數歸零的那一天」（或發照日），不是最近一次違規那天。範例中 1985-06-07 歸零、1987-06-07 才拿到第一點。
2. 減點是在「最近一次違規」的每個**週年日**，每年一次，不是每兩年。
3. 減點規則是「減去 一半 或 2 之中較多的」再捨去小數：11 → 5（不是 6），2 → 0（不是 1）。
4. 同一天同時有自動事件與新違規時，先做自動事件再給新點數。
5. 違規點數在還沒歸零時再違規是**累加**（範例連續兩天各 2 點變成 4 點）；有優點時才走抵銷規則。
6. 結束條件是「最後一次違規之後累積到 5 點優點」，所以違規全部處理完之後還要繼續跑到 5 點。
7. 輸出三種句型都要一字不差，注意 point(s) 的括號與句尾的句點。`,
    c: `#include <bits/stdc++.h>
using namespace std;

struct Date { int y, m, d; };

bool leap(int y) { return (y % 4 == 0 && y % 100 != 0) || y % 400 == 0; }
int dim(int y, int m) {
    static const int MD[12] = { 31,28,31,30,31,30,31,31,30,31,30,31 };
    return (m == 2 && leap(y)) ? 29 : MD[m - 1];
}
Date addY(Date a, int k) {
    a.y += k;
    if (a.d > dim(a.y, a.m)) a.d = dim(a.y, a.m);
    return a;
}
int cmpD(const Date& a, const Date& b) {
    if (a.y != b.y) return a.y < b.y ? -1 : 1;
    if (a.m != b.m) return a.m < b.m ? -1 : 1;
    if (a.d != b.d) return a.d < b.d ? -1 : 1;
    return 0;
}
string fmt(const Date& a) {
    ostringstream os;
    os << setw(4) << setfill('0') << a.y << "-" << setw(2) << setfill('0') << a.m
       << "-" << setw(2) << setfill('0') << a.d;
    return os.str();
}
void emit(const Date& a, int dem, int mer) {
    cout << fmt(a) << " ";
    if (dem > 0) cout << dem << " demerit point(s).\n";
    else if (mer > 0) cout << mer << " merit point(s).\n";
    else cout << "No merit or demerit points.\n";
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    string line;
    getline(cin, line);
    for (int tc = 0; tc < T; tc++) {
        while (getline(cin, line)) {
            bool blank = true;
            for (size_t i = 0; i < line.size(); i++) if (line[i] > 32) blank = false;
            if (!blank) break;
        }
        long long v;
        {
            istringstream in(line);
            in >> v;
        }
        Date issue;
        issue.y = (int)(v / 10000); issue.m = (int)(v / 100 % 100); issue.d = (int)(v % 100);

        vector<pair<Date, int> > offs;
        while (getline(cin, line)) {
            bool blank = true;
            for (size_t i = 0; i < line.size(); i++) if (line[i] > 32) blank = false;
            if (blank) break;
            istringstream in(line);
            long long dv;
            int p;
            in >> dv >> p;
            Date d;
            d.y = (int)(dv / 10000); d.m = (int)(dv / 100 % 100); d.d = (int)(dv % 100);
            offs.push_back(make_pair(d, p));
        }

        if (tc) cout << "\n";
        int dem = 0, mer = 0;
        Date clock_ = issue;
        bool meritMode = true;
        emit(issue, dem, mer);
        size_t oi = 0;
        while (true) {
            bool hasNext = false;
            Date nxt = clock_;
            if (meritMode) { if (mer < 5) { nxt = addY(clock_, 2); hasNext = true; } }
            else { if (dem > 0) { nxt = addY(clock_, 1); hasNext = true; } }
            bool hasOff = (oi < offs.size());
            if (!hasNext && !hasOff) break;

            if (hasNext && (!hasOff || cmpD(nxt, offs[oi].first) <= 0)) {
                clock_ = nxt;                                   // 同日時自動事件先做
                if (meritMode) {
                    mer++;
                    emit(nxt, dem, mer);
                    if (mer >= 5 && !hasOff) break;
                } else {
                    double red = max(dem / 2.0, 2.0);
                    dem = max(0, (int)floor(dem - red));
                    emit(nxt, dem, mer);
                    if (dem == 0) meritMode = true;
                }
                continue;
            }
            Date d = offs[oi].first;
            int p = offs[oi].second;
            oi++;
            if (mer > 0) {
                if (p > 2 * mer) { dem = p - 2 * mer; mer = 0; }
                else { mer -= p / 2; dem = 0; }
            } else dem += p;
            emit(d, dem, mer);
            clock_ = d;
            meritMode = (dem == 0);
        }
    }
    return 0;
}`
  },

  '11319': {
    q: `「笨數列」是由下面這個多項式函數產生的數列：

    f(x) = a₀ + a₁x + a₂x² + a₃x³ + a₄x⁴ + a₅x⁵ + a₆x⁶

笨數列就是 f(1), f(2), f(3), f(4), … 。可以假設所有 i（0 ≤ i ≤ 6）都滿足 0 ≤ aᵢ ≤ 1000。
給你笨數列的前 1500 項，請求出 a₀ 到 a₆。

輸入：第一行是測資組數 N（0 < N < 101）。每組有 1500 行，每行一個整數，第 i 行是數列的第 i 項；所有整數都能放進 64 位元無號整數。每組之後有一個空行。
輸出：每組一行，輸出 a₀ 到 a₆ 的值（都是小於 1001 的非負整數）。若找不到這樣的值，就印「This is a smart sequence!」。

範例輸入（題目說範例太長，只列出每組的前 10 項）
3
1 1 1 1 1 1 1 1 1 1 …
2 6 12 20 30 42 56 72 90 110 …
1 64 729 4096 15625 46656 117649 250000 500000 1000000 …

範例輸出
1 0 0 0 0 0 0
0 1 1 0 0 0 0
This is a smart sequence!`,
    h: `六次多項式由 **7 個點**唯一決定，所以只要用前 7 項 f(1)…f(7) 把係數解出來，
再拿全部 1500 項驗證即可。

【用有限差分求係數（全程整數）】
先算出 f(1) 在 x = 1 處的各階前向差分 d₀, d₁, …, d₆，則牛頓前向公式給出

    f(x) = Σ_{j=0}^{6} d_j · C(x−1, j)，其中 C(x−1, j) = (x−1)(x−2)…(x−j) / j!

把每個 C(x−1, j) 展開成 x 的多項式再乘上 d_j 累加，就得到 a₀…a₆。
為了避免分數，全部**乘上 720**（= 6!，也是 0!…6! 的公倍數）再處理，
最後每個係數必須能被 720 整除；不能整除就代表不是這種形式。

【三道關卡，任何一關沒過就是「smart」】
    1. 係數必須是整數（除得盡 720）
    2. 每個係數要落在 0 到 1000
    3. **用求出來的多項式驗證全部 1500 項**——這一關最重要

第三組範例正是為了考這一關：前 7 項 1, 64, 729, 4096, 15625, 46656, 117649 剛好是 x⁶，
所以係數會解出 a₆ = 1；但第 8 項題目給的是 **250000**，而 8⁶ = 262144，對不上
→ 必須輸出「This is a smart sequence!」✓
只用 7 項解係數而不驗證後面，這一組就會答錯。

【型別】f(1500) 的量級接近 64 位元無號整數的上限，中間乘上 720 之後會超過，
所以差分與展開都要用 **__int128**（上限約 1.7×10³⁸，綽綽有餘）。

【驗算】三組範例我都跑過：
    全部是 1 → **1 0 0 0 0 0 0** ✓
    2, 6, 12, 20, … 就是 x² + x → **0 1 1 0 0 0 0** ✓
    第三組 → **This is a smart sequence!** ✓`,
    t: `1. 一定要拿全部 1500 項驗證，不能只用前 7 項解完就輸出。第三組範例就是「前 7 項對、第 8 項開始不對」的陷阱。
2. 讀進來的值接近 64 位元無號整數上限，差分與展開時會再放大，要用 __int128。
3. 用有限差分 + 牛頓前向公式可以全程整數運算（先乘 720 再最後除回去），比高斯消去法穩，不會有浮點誤差。
4. 係數必須是「整數」而且落在 0 到 1000，兩個條件都要檢查。
5. 差分可能是負數，型別要用有號的。
6. 每組之後有空行，用 cin >> 讀數字會自動跳過，不必特別處理。
7. 輸出的七個數以單一空白分隔。`,
    c: `#include <bits/stdc++.h>
using namespace std;

typedef __int128 lll;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    const int M = 1500;
    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        vector<lll> f(M);
        for (int i = 0; i < M; i++) {
            unsigned long long v;
            cin >> v;
            f[i] = (lll)v;
        }
        // 前 7 項的各階前向差分
        lll d[7];
        vector<lll> cur(f.begin(), f.begin() + 7);
        for (int j = 0; j < 7; j++) {
            d[j] = cur[0];
            vector<lll> nx;
            for (size_t i = 0; i + 1 < cur.size(); i++) nx.push_back(cur[i + 1] - cur[i]);
            cur = nx;
        }

        const lll SC = 720;                          // 6! 的倍數，用來避開分數
        lll a[7] = { 0, 0, 0, 0, 0, 0, 0 };
        vector<lll> P(1, 1);                          // (x-1)(x-2)...(x-j)
        lll fact = 1;
        for (int j = 0; j < 7; j++) {
            if (j > 0) {
                fact *= j;
                vector<lll> Q(P.size() + 1, 0);
                for (size_t k = 0; k < P.size(); k++) {
                    Q[k + 1] += P[k];
                    Q[k] -= P[k] * j;
                }
                P = Q;
            }
            lll mult = SC / fact * d[j];
            for (size_t k = 0; k < P.size(); k++) a[k] += mult * P[k];
        }

        bool ok = true;
        long long c[7];
        for (int k = 0; k < 7 && ok; k++) {
            if (a[k] % SC != 0) { ok = false; break; }
            lll v = a[k] / SC;
            if (v < 0 || v > 1000) { ok = false; break; }
            c[k] = (long long)v;
        }
        if (ok) {                                     // 一定要驗證全部 1500 項
            for (int x = 1; x <= M && ok; x++) {
                lll s = 0, p = 1;
                for (int k = 0; k < 7; k++) { s += (lll)c[k] * p; p *= x; }
                if (s != f[x - 1]) ok = false;
            }
        }
        if (!ok) cout << "This is a smart sequence!\n";
        else {
            for (int k = 0; k < 7; k++) cout << (k ? " " : "") << c[k];
            cout << "\n";
        }
    }
    return 0;
}`
  }
};

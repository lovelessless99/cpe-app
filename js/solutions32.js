/* 二星題庫（第十五批 5 題，含上輪卡住的 10233） */
const SOL32 = {
10233: {
  q: "Dermuba Triangle：房屋排成三角形，第 r 列（0 起算）有 <b>2r + 1</b> 間，編號連續（第 r 列從 <code>r²</code> 開始）。每間房子是一個<b>邊長 1 的正三角形</b>，交替朝上、朝下。給兩個編號，求兩間房子（<b>三角形重心</b>）之間的直線距離，取 3 位小數。",
  h: "把編號換成座標就結束了。設 <code>h = √3/2</code>：<br>① <b>定位</b>：<code>r = ⌊√n⌋</code>、列內索引 <code>k = n − r²</code>。<br>② <b>x 座標</b>：推導後會發現朝上與朝下的公式<b>可以合而為一</b>——<br>　<code>x = (k − r) / 2</code><br>③ <b>y 座標</b>：朝上（k 為偶數）的重心離該列頂端 <code>2h/3</code>，朝下（k 為奇數）離 <code>h/3</code>：<br>　<code>y = r·h + (k 為奇數 ? h/3 : 2h/3)</code><br>四組樣例全部驗算吻合：<code>0→7</code> 得 <code>√(0.25 + (5h/3)²) = 1.528</code> ✓、<code>2→8</code> 得 <code>√(1 + (4h/3)²) = 1.528</code> ✓、<code>9→10</code> 與 <code>10→11</code> 皆為 <code>√(0.25 + (h/3)²) = 0.577</code> ✓。",
  t: "① <b>朝上與朝下的重心高度不同</b>（<code>2h/3</code> vs <code>h/3</code>）——這是整題的關鍵，只算列距會全錯。<br>② x 座標合成一條 <code>(k − r)/2</code> 是化簡後的結果，直接分兩種情況寫也可以，但容易漏 0.5 的偏移。<br>③ n 可達 2147483647 ⇒ <code>⌊√n⌋</code> 用 <code>sqrt</code> 後<b>要往上下各修正一次</b>（浮點在完全平方數附近會差 1）。<br>④ 每列的房子數是 <b>2r + 1</b> 不是 r + 1，起始編號是 <code>r²</code>。<br>⑤ 讀到 EOF 結束，輸出 3 位小數。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

const double H = sqrt(3.0) / 2;

void locate(ll n, double &x, double &y) {
    ll r = (ll)sqrt((double)n);
    while (r * r > n) r--;                              // 浮點修正
    while ((r + 1) * (r + 1) <= n) r++;
    ll k = n - r * r;                                   // 列內索引
    x = (double)(k - r) / 2;                            // 朝上朝下可合成同一式
    y = r * H + ((k & 1) ? H / 3 : 2 * H / 3);          // 朝下較高、朝上較低
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cout << fixed << setprecision(3);
    ll a, b;
    while (cin >> a >> b) {
        double x1, y1, x2, y2;
        locate(a, x1, y1);
        locate(b, x2, y2);
        cout << sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) << "\\n";
    }
    return 0;
}`
},

10371: {
  q: "Time Zones：給一個時間與兩個時區縮寫，把「第一個時區的該時刻」換算成第二個時區的時間。輸入可能是 <code>noon</code>、<code>midnight</code> 或 <code>h:mm a.m./p.m.</code>，輸出同樣格式。",
  h: "純粹是<b>查表 + 分鐘運算</b>，難度全在細節：<br>① <b>把所有時間換成「當日的分鐘數」</b>（0..1439），12 小時制轉換的規則是：<code>12 a.m. → 0 時</code>、<code>12 p.m. → 12 時</code>，其餘 p.m. 加 12。<br>② 時區偏移<b>有半小時的</b>（NST −3:30、NDT −2:30）⇒ 表要以<b>分鐘</b>存，不能用整數小時。<br>③ 換算 <code>新分鐘 = (原分鐘 − 起點偏移 + 目標偏移) mod 1440</code>，記得處理負數取模。<br>④ 輸出時 <code>0 分鐘 → midnight</code>、<code>720 分鐘 → noon</code>，其餘印成 12 小時制。<br>驗算：<code>noon HST → CEST</code>，−10 到 +2 差 12 小時 ⇒ <b>midnight</b> ✓；<code>12:40 p.m. ADT → MSK</code>，−3 到 +3 差 6 小時 ⇒ <b>6:40 p.m.</b> ✓。",
  t: "① <b>半小時時區</b>（NST / NDT）一定要用分鐘存，用小時會整個錯。<br>② <code>12 a.m.</code> 是<b>午夜</b>（0 時）、<code>12 p.m.</code> 是<b>中午</b>（12 時），這組對應最容易寫反。<br>③ 輸出的 <code>midnight</code> 與 <code>noon</code> 是<b>特例</b>，不能印成 <code>12:00 a.m.</code>。<br>④ 取模後可能是負數，要 <code>((x % 1440) + 1440) % 1440</code>。<br>⑤ 分鐘數要補零（<code>4:29</code> 而非 <code>4:9</code>）。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    // 時區偏移，單位：分鐘（含半小時時區）
    map<string, int> tz;
    tz["UTC"] = 0;      tz["GMT"] = 0;      tz["BST"] = 60;     tz["IST"] = 60;
    tz["WET"] = 0;      tz["WEST"] = 60;    tz["CET"] = 60;     tz["CEST"] = 120;
    tz["EET"] = 120;    tz["EEST"] = 180;   tz["MSK"] = 180;    tz["MSD"] = 240;
    tz["AST"] = -240;   tz["ADT"] = -180;   tz["NST"] = -210;   tz["NDT"] = -150;
    tz["EST"] = -300;   tz["EDT"] = -240;   tz["CST"] = -360;   tz["CDT"] = -300;
    tz["MST"] = -420;   tz["MDT"] = -360;   tz["PST"] = -480;   tz["PDT"] = -420;
    tz["HST"] = -600;   tz["AKST"] = -540;  tz["AKDT"] = -480;

    int T; cin >> T;
    while (T--) {
        string t; cin >> t;
        int mins;
        if (t == "noon") mins = 720;
        else if (t == "midnight") mins = 0;
        else {
            string ap; cin >> ap;                       // a.m. / p.m.
            int h = atoi(t.substr(0, t.find(':')).c_str());
            int m = atoi(t.substr(t.find(':') + 1).c_str());
            if (h == 12) h = 0;                         // 12 a.m. = 0 時
            if (ap[0] == 'p') h += 12;                  // 12 p.m. = 12 時
            mins = h * 60 + m;
        }
        string from, to; cin >> from >> to;
        int r = ((mins - tz[from] + tz[to]) % 1440 + 1440) % 1440;

        if (r == 0) cout << "midnight\\n";
        else if (r == 720) cout << "noon\\n";
        else {
            int h = r / 60, m = r % 60;
            string ap = (h < 12) ? "a.m." : "p.m.";
            int hh = h % 12; if (hh == 0) hh = 12;
            cout << hh << ":" << setw(2) << setfill('0') << m << setfill(' ')
                 << " " << ap << "\\n";
        }
    }
    return 0;
}`
},

11086: {
  q: "Composite Prime：所謂「合成質數」是<b>恰好由兩個質數相乘</b>而成的數（例如 4 = 2×2、6 = 2×3）。給一串數字，數出有幾個是合成質數。",
  h: "把「恰好兩個質因數（<b>計重數</b>）」直接翻成程式：<b>試除法分解，累計質因數個數</b>，最後看是不是恰好 2。<br>寫法：從 2 開始試除，每除掉一次就 <code>cnt++</code>；迴圈結束後若剩下的數 &gt; 1，代表還有一個大質因數，再 <code>cnt++</code>。<br>只要 <code>cnt == 2</code> 就是合成質數（也叫 <b>semiprime</b>）。<br>複雜度 O(√n) 每個數。<br><b>注意 8 = 2×2×2 有三個質因數，不算</b>——「恰好兩個」是計重的。",
  t: "① 質因數要<b>計重</b>（4 = 2×2 算兩個），所以 <code>while (n % p == 0) { n /= p; cnt++; }</code>。<br>② 別忘了迴圈結束後<b>剩下的大質因數</b>也要計入。<br>③ 只要 <code>cnt</code> 一超過 2 就可以提早中止。<br>④ 1 與質數本身都不算（cnt 分別是 0 與 1）。<br>⑤ 讀到 EOF 結束；每筆先給個數再給那些數。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

bool semiPrime(ll n) {
    int cnt = 0;
    for (ll p = 2; p * p <= n && cnt <= 2; p++)
        while (n % p == 0) { n /= p; cnt++; }           // 計重
    if (n > 1) cnt++;                                   // 剩下的大質因數
    return cnt == 2;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n) {
        int ans = 0;
        for (int i = 0; i < n; i++) {
            ll x; cin >> x;
            if (semiPrime(x)) ans++;
        }
        cout << ans << "\\n";
    }
    return 0;
}`
},

10287: {
  q: "Gifts in a Hexagonal Box：給正六邊形盒子的<b>邊長 a</b>，求盒內分別放 <b>1、2、3、4 個等大圓形禮物</b>時，每個禮物的最大半徑（各 10 位小數）。",
  h: "四個都是<b>與 a 成固定比例</b>的常數，關鍵是把比例算對：<br>・<b>1 個</b>：就是六邊形的<b>內切圓</b>（邊心距）⇒ <code>r = a·√3/2 ≈ 0.8660a</code><br>・<b>2 個</b>：兩圓互相外切並內切於六邊形 ⇒ <code>r = a(2√3 − 3) ≈ 0.4641a</code><br>・<b>3 個</b>：<code>r = a·√3/4 ≈ 0.4330a</code>（正好是 1 個時的一半）<br>・<b>4 個</b>：<code>r = 3a/8 = 0.375a</code><br>驗算 <code>a = 2×10⁻⁷</code>：<code>0.0000001732 / 0.0000000928 / 0.0000000866 / 0.0000000750</code> ✓ 四個全中。<br><b>考場心法</b>：這種「答案與輸入成正比」的幾何題，<b>直接用樣例把比例常數反推出來</b>（答案 ÷ 輸入）遠比硬推圖形快——跟 10286 正五邊形是同一招。",
  t: "① 四個比例常數：<code>√3/2</code>、<code>2√3 − 3</code>、<code>√3/4</code>、<code>3/8</code>，記錯一個就整行錯。<br>② 用樣例<b>反推比例</b>是最可靠的驗證方式（0.0000000866 ÷ 0.0000001 = 0.866 = √3/2 ✓）。<br>③ 輸出<b>10 位小數</b>、四個數同一行用單一空白分隔。<br>④ a 可能極小（10⁻⁷）或極大（10⁴），<code>double</code> 的相對精度足夠。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cout << fixed << setprecision(10);
    double S3 = sqrt(3.0);
    double a;
    while (cin >> a) {
        cout << a * S3 / 2 << " "                       // 1 個：內切圓
             << a * (2 * S3 - 3) << " "                 // 2 個
             << a * S3 / 4 << " "                       // 3 個
             << a * 3 / 8 << "\\n";                      // 4 個
    }
    return 0;
}`
},

10180: {
  q: "Rope Crisis in Ropeland：一條繩子從點 A 拉到點 B，中間有一個以<b>原點為圓心、半徑 r</b> 的圓形障礙物，繩子不能穿過它。求繩子的<b>最短長度</b>（3 位小數）。",
  h: "分兩種情況：<br>① <b>線段 AB 與圓不相交</b>（線段到原點的最短距離 ≥ r）⇒ 直接拉直，答案是 <code>|AB|</code>。<br>② <b>會穿過</b> ⇒ 繩子變成「<b>切線 + 圓弧 + 切線</b>」：<br>　<code>切線長 = √(|A|² − r²)</code> 與 <code>√(|B|² − r²)</code><br>　<code>圓弧角 = ∠AOB − arccos(r/|A|) − arccos(r/|B|)</code><br>　（從總夾角扣掉兩段切線各自「佔掉」的角度）<br>　<code>答案 = 兩段切線 + r × 圓弧角</code><br>驗算：<code>A=(1,1), B=(−1,−1), r=1</code> ⇒ 切線各 1、夾角 180° 扣掉兩個 45° 得 90° ⇒ <code>1 + 1 + π/2 = 3.571</code> ✓；<code>A=(1,1), B=(−1,1), r=1</code> 剛好相切 ⇒ <b>2.000</b> ✓。",
  t: "① <b>判斷用的是「線段」到原點的距離，不是「直線」</b>——要先把投影參數夾到 [0, 1]（跟 10263 同一個模板）。<br>② 圓弧角算出來若是<b>負數</b>要當 0（相切的邊界情形）。<br>③ <code>arccos</code> 的引數要夾在 [−1, 1]，浮點誤差可能讓它跑出範圍導致 NaN。<br>④ 若 A 或 B <b>落在圓內</b>，題目一般保證不會發生；保險起見可加判斷。<br>⑤ 輸出 3 位小數。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cout << fixed << setprecision(3);
    double ax, ay, bx, by, r;
    while (cin >> ax >> ay >> bx >> by >> r) {
        double dx = bx - ax, dy = by - ay;
        double len2 = dx * dx + dy * dy;
        double t = 0;
        if (len2 > 1e-18) t = (-ax * dx - ay * dy) / len2;      // 原點在線段上的投影
        if (t < 0) t = 0; if (t > 1) t = 1;                     // 夾到線段上
        double qx = ax + t * dx, qy = ay + t * dy;
        double dmin = sqrt(qx * qx + qy * qy);

        double dist = sqrt(len2);
        if (dmin >= r - 1e-12) { cout << dist << "\\n"; continue; }   // 拉直即可

        double da = sqrt(ax * ax + ay * ay), db = sqrt(bx * bx + by * by);
        double ta = sqrt(max(0.0, da * da - r * r));                 // 兩段切線
        double tb = sqrt(max(0.0, db * db - r * r));
        double cosAOB = (ax * bx + ay * by) / (da * db);
        cosAOB = max(-1.0, min(1.0, cosAOB));
        double ang = acos(cosAOB)
                   - acos(max(-1.0, min(1.0, r / da)))
                   - acos(max(-1.0, min(1.0, r / db)));
        if (ang < 0) ang = 0;                                        // 相切邊界
        cout << ta + tb + r * ang << "\\n";
    }
    return 0;
}`
}
};

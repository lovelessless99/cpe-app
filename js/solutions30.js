/* 二星題庫（第十三批 9 題） */
const SOL30 = {
10138: {
  q: "CDVII 收費公路：給 24 個整數（每個小時的<b>每公里費率</b>，單位分）與一整月的進出站紀錄（車牌、<code>mm:dd:hh:mm</code>、<code>enter</code>/<code>exit</code>、位置公里數）。每趟收費 = <b>里程 × 進站當時的費率 + 1 美元</b>，每輛車另加 <b>2 美元</b>帳務費。依車牌<b>字母序</b>輸出帳單。",
  h: "重點全在<b>規則的精確拆解</b>：<br>① <b>費率取「進站」那一刻的小時</b>，不是出站、也不是平均。<br>② 配對規則：每筆 <code>enter</code> 只跟<b>同車牌、時間上緊接著的下一筆</b>配對，而且那筆<b>必須是 <code>exit</code></b>；配不到的紀錄一律忽略。<br>③ 費用 = <code>Σ (里程 × 費率) + 100 × 趟數 + 200</code>（全程用<b>分</b>算，最後才換成元）。<br>④ <b>沒有完整行程的車不列出</b>。<br>作法：依車牌分組、依時間排序，掃一遍做配對。時間轉成 <code>mm×10⁶ + dd×10⁴ + hh×10² + mi</code> 就能直接比大小。<br>驗算樣例：765DEF 於 05 時進站（費率 10）行駛 78 km ⇒ 780 + 100 + 200 = <b>$10.80</b> ✓；ABCD123 於 06 時進站（費率 20）⇒ 1560 + 100 + 200 = <b>$18.60</b> ✓。",
  t: "① <b>費率看進站小時</b>——這是最容易看錯的一句話。<br>② 配對是「<b>時間上緊接的下一筆</b>」，不是「下一筆 exit」；中間若又出現一筆 enter，前一筆就作廢。<br>③ 全程用<b>分</b>做整數運算，輸出時再拆成元與分（分要補兩位）。<br>④ 沒跑完整趟的車<b>不能列出</b>（連 2 元帳務費也不收）。<br>⑤ 依<b>車牌字母序</b>輸出；測資之間要空一行。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

struct Rec { ll t; bool enter_; ll km; };

int main() {
    int T;
    {
        string line;
        getline(cin, line);
        T = atoi(line.c_str());
    }
    for (int tc = 0; tc < T; tc++) {
        string line;
        while (getline(cin, line) && line.find_first_not_of(" \\t\\r") == string::npos) {}
        istringstream rs(line);
        vector<ll> rate(24);
        for (int i = 0; i < 24; i++) rs >> rate[i];

        map<string, vector<Rec> > rec;
        while (getline(cin, line)) {
            if (line.find_first_not_of(" \\t\\r") == string::npos) break;
            istringstream is(line);
            string plate, ts, act; ll km;
            is >> plate >> ts >> act >> km;
            ll mm = atoi(ts.substr(0, 2).c_str()), dd = atoi(ts.substr(3, 2).c_str());
            ll hh = atoi(ts.substr(6, 2).c_str()), mi = atoi(ts.substr(9, 2).c_str());
            Rec r;
            r.t = ((mm * 100 + dd) * 100 + hh) * 100 + mi;
            r.enter_ = (act == "enter");
            r.km = km;
            rec[plate].push_back(r);
        }

        if (tc) cout << "\\n";
        for (map<string, vector<Rec> >::iterator it = rec.begin(); it != rec.end(); ++it) {
            vector<Rec> &v = it->second;
            sort(v.begin(), v.end(), [](const Rec &a, const Rec &b) { return a.t < b.t; });
            ll bill = 0; int trips = 0;
            for (size_t i = 0; i + 1 < v.size(); i++) {
                if (!v[i].enter_ || v[i + 1].enter_) continue;   // 必須緊接著是 exit
                ll hh = (v[i].t / 100) % 100;                    // 進站當時的小時
                bill += llabs(v[i + 1].km - v[i].km) * rate[hh] + 100;
                trips++;
                i++;                                             // 這兩筆都用掉了
            }
            if (!trips) continue;                                // 沒跑完整趟就不列
            bill += 200;                                         // 帳務費
            cout << it->first << " $" << bill / 100 << "."
                 << setw(2) << setfill('0') << bill % 100 << setfill(' ') << "\\n";
        }
    }
    return 0;
}`
},

11076: {
  q: "Add Again：給 n（≤ 12）個數字，把它們的<b>所有相異排列</b>當成 n 位數全部加起來。",
  h: "不要真的枚舉排列（12! 近 5 億）。<b>從「每個數字在每個位置出現幾次」下手</b>：<br>相異排列總數 <code>P = n! / Π(cntᵢ!)</code>。由對稱性，數字 d 在<b>任一固定位置</b>出現的次數是<br><code>P × cntᵈ / n</code><br>所以每個位置的數字總和都是 <code>S = Σ d × (P × cntᵈ / n)</code>，而所有位置的權重加起來就是 <b>repunit</b>（<code>111…1</code>，n 個 1）⇒<br><code>答案 = repunit(n) × S</code><br>驗算：<code>1 2 3</code> ⇒ P=6、S = 2×(1+2+3) = 12、111 × 12 = <b>1332</b> ✓；<code>1 1 2</code> ⇒ P=3、S = 1×(1+1+2) = 4、111 × 4 = <b>444</b> ✓。",
  t: "① <b>重複數字要用相異排列數</b>（除以各自的階乘），否則 <code>1 1 2</code> 會算成 6 個排列。<br>② <code>P × cntᵈ / n</code> <b>必定整除</b>，但要先乘再除（先除會失真）；<code>P ≤ 12! ≈ 4.8×10⁸</code>、乘 12 仍在 <code>unsigned long long</code> 內。<br>③ 題目保證答案塞得進 64 位元<b>無號</b>整數，用 <code>unsigned long long</code>。<br>④ repunit 要自己遞推（<code>r = r × 10 + 1</code>）。<br>⑤ 最多 20000 筆測資 ⇒ 階乘先建表。<br>⑥ <code>n = 0</code> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef unsigned long long ull;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ull fact[13];
    fact[0] = 1;
    for (int i = 1; i <= 12; i++) fact[i] = fact[i - 1] * i;

    int n;
    while (cin >> n && n) {
        int cnt[10] = {0};
        for (int i = 0; i < n; i++) { int d; cin >> d; cnt[d]++; }

        ull P = fact[n];
        for (int d = 0; d < 10; d++) P /= fact[cnt[d]];    // 相異排列總數
        ull S = 0;
        for (int d = 0; d < 10; d++)
            if (cnt[d]) S += (ull)d * (P * cnt[d] / n);    // 每個位置的數字總和
        ull rep = 0;
        for (int i = 0; i < n; i++) rep = rep * 10 + 1;    // repunit
        cout << rep * S << "\\n";
    }
    return 0;
}`
},

11480: {
  q: "Jimmy's Balls：袋子裡共 n 顆球，紅、藍、綠三色<b>各至少一顆</b>，且<b>藍 &gt; 紅</b>、<b>綠 &gt; 藍</b>。問有幾種可能的 (紅, 藍, 綠) 組合。",
  h: "條件 <code>1 ≤ r &lt; b &lt; g</code> 且 <code>r + b + g = n</code> ⇒ 就是「把 n 分成<b>三個相異正整數</b>之和」的方法數。<br>這個經典計數有封閉式：<br><code>答案 = round((n − 3)² / 12)</code><br>用整數寫成 <code>((n−3)² + 6) / 12</code> 即可（加 6 再整除就是四捨五入）。<br>驗算：n=6 ⇒ (9+6)/12 = <b>1</b>（只有 1+2+3）✓；n=10 ⇒ (49+6)/12 = <b>4</b>（1+2+7、1+3+6、1+4+5、2+3+5）✓。<br>推導概略：先令 <code>r = r'</code>、<code>b = r'+x</code>、<code>g = r'+x+y</code>（x, y ≥ 1）化成無限制的三元方程，再用生成函數或直接數格點。<br>O(1)。",
  t: "① 「相異」是關鍵——若允許相等，答案會完全不同。<br>② <code>(n−3)²</code> 在 n 到 10⁶ 時約 10¹² ⇒ 用 <code>long long</code>。<br>③ 四捨五入用 <code>(x + 6) / 12</code> 的整數寫法，別用浮點（大數時會失準）。<br>④ 若不確定公式，可以先寫 O(n) 的雙層迴圈驗證小 n，再換成公式——這也是推出它的方法。<br>⑤ 輸出格式 <code>Case k: X</code>；以 <code>0</code> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll n; int cs = 1;
    while (cin >> n && n) {
        ll m = n - 3;
        cout << "Case " << cs++ << ": " << (m * m + 6) / 12 << "\\n";   // 四捨五入
    }
    return 0;
}`
},

11847: {
  q: "Cut the Silver Bar：一根長 n 微米的銀條要付 n 天的債，<b>每天付 1 微米</b>（可以找零換回）。問<b>最少要切幾刀</b>才能保證每天都付得出來。",
  h: "經典的<b>二進位分割</b>：把銀條切成長度 <code>1, 2, 4, 8, …</code> 的片段（加上最後剩下的一塊），任何 1..n 的金額都能用「拿出一些、換回一些」湊出來——因為<b>每個數都有唯一的二進位表示</b>。<br>要湊到 n，需要 <code>1, 2, 4, …, 2^(k−1)</code> 這 k 片再加上剩餘的一片，總共 k+1 片 ⇒ <b>k 刀</b>，其中 k 是滿足 <code>2^k ≤ n</code> 的最大整數，也就是<br><code>答案 = ⌊log₂ n⌋</code><br>驗算：n=1 ⇒ 0 刀（整根給他）；n=3 ⇒ 1 刀（1 和 2）；n=7 ⇒ 2 刀（1、2、4）；n=8 ⇒ 3 刀 ✓。<br>用<b>位移</b>計算而不是浮點 log，避免邊界誤差。",
  t: "① <b>可以「找零」</b>（把先前給的拿回來換），這是二進位分割成立的前提；不能找零的話答案完全不同。<br>② 用 <code>while ((1LL &lt;&lt; (k+1)) &lt;= n) k++;</code> 這種<b>位移</b>寫法，<code>log2()</code> 在 2 的冪附近會因浮點誤差差 1。<br>③ n = 1 時答案是 <b>0</b>。<br>④ n 可能很大，用 <code>long long</code> 並小心位移溢位。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll n;
    while (cin >> n) {
        int k = 0;
        while (k < 62 && (1LL << (k + 1)) <= n) k++;        // 用位移避免浮點誤差
        cout << k << "\\n";
    }
    return 0;
}`
},

10902: {
  q: "Pick-up Sticks：依序丟下 n 根線段（後丟的壓在先丟的上面），找出<b>沒有被任何後來的線段壓到</b>的「頂層」線段，依丟下順序輸出編號。",
  h: "「被壓到」= 與<b>後面某根</b>線段相交。<br>暴力兩兩比較是 O(n²)，n = 100000 時不可行。關鍵是題目保證<b>頂層線段不超過 1000 根</b> ⇒ 維護一份「目前的頂層清單」：<br>每丟下一根新線段，就掃一遍清單，<b>把與它相交的全部移除</b>，再把新線段加入清單。<br>因為清單長度始終 ≤ 1000（加上剛被移除的），總成本約 <code>n × 1000</code>，可行。<br><b>線段相交判定</b>用標準的<b>叉積四次符號檢查</b> + 共線時的「點在線段上」檢查，是計算幾何最該背熟的模板之一。",
  t: "① <b>複雜度靠「答案很小」這個保證</b>——沒有這個保證就得用掃描線。<br>② 相交判定要處理<b>共線重疊</b>與<b>端點接觸</b>（都算相交），只寫嚴格跨越會 WA。<br>③ 座標是<b>實數</b>，比較要用 eps；判斷符號時寫成 <code>sgn()</code> 函式最不易錯。<br>④ 輸出格式 <code>Top sticks: a, b, c.</code>——逗號後有空白、句尾有句號。<br>⑤ <code>n = 0</code> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

const double EPS = 1e-9;
int sgn(double x) { return (x > EPS) - (x < -EPS); }

struct P { double x, y; };
double cross(P a, P b, P c) { return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x); }
bool onSeg(P a, P b, P p) {                                 // 已知共線，檢查是否在段內
    return min(a.x, b.x) - EPS <= p.x && p.x <= max(a.x, b.x) + EPS &&
           min(a.y, b.y) - EPS <= p.y && p.y <= max(a.y, b.y) + EPS;
}
bool inter(P a, P b, P c, P d) {
    int d1 = sgn(cross(c, d, a)), d2 = sgn(cross(c, d, b));
    int d3 = sgn(cross(a, b, c)), d4 = sgn(cross(a, b, d));
    if (d1 * d2 < 0 && d3 * d4 < 0) return true;            // 嚴格跨越
    if (!d1 && onSeg(c, d, a)) return true;                 // 共線／端點接觸
    if (!d2 && onSeg(c, d, b)) return true;
    if (!d3 && onSeg(a, b, c)) return true;
    if (!d4 && onSeg(a, b, d)) return true;
    return false;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n && n) {
        vector<P> A(n), B(n);
        vector<int> top;                                    // 目前的頂層清單（保證很短）
        for (int i = 0; i < n; i++) {
            cin >> A[i].x >> A[i].y >> B[i].x >> B[i].y;
            vector<int> keep;
            for (size_t k = 0; k < top.size(); k++) {
                int j = top[k];
                if (!inter(A[j], B[j], A[i], B[i])) keep.push_back(j);   // 沒被壓到才留
            }
            keep.push_back(i);
            top.swap(keep);
        }
        cout << "Top sticks:";
        for (size_t k = 0; k < top.size(); k++)
            cout << " " << top[k] + 1 << (k + 1 == top.size() ? "." : ",");
        cout << "\\n";
    }
    return 0;
}`
},

10312: {
  q: "Expression Bracketing：n 個字母有幾種<b>非二元</b>的括號化方式？（總括號化方式扣掉「每層都恰好分成兩塊」的那些）",
  h: "拆成兩個經典數列相減：<br>・<b>所有括號化方式</b>（每層可分成 2 塊以上，也可以不加括號）= <b>小 Schröder 數</b> <code>s(n)</code>：1, 1, 3, 11, 45, 197, 903, …<br>・<b>二元括號化方式</b> = <b>卡塔蘭數</b> <code>C(n−1)</code>：1, 1, 2, 5, 14, 42, …<br>⇒ <code>答案 = s(n) − C(n−1)</code><br>小 Schröder 數的遞推：<br><code>n·s(n) = (6n − 9)·s(n−1) − (n − 3)·s(n−2)</code>，<code>s(1) = s(2) = 1</code><br>驗算：n=4 ⇒ s(4) = 11（題目自己說 4 個字母有 11 種）、C(3) = 5 ⇒ 6；n=5 ⇒ 45 − 14 = <b>31</b> ✓；n=10 ⇒ 103049 − 4862 = <b>98187</b> ✓。",
  t: "① 認出「總數 = 小 Schröder、二元 = 卡塔蘭」是本題唯一的門檻，之後只是套遞推。<br>② 遞推裡的除法 <b>必定整除</b>，但中間值 <code>(6n−9)·s(n−1)</code> 在 n = 26 時逼近 <code>unsigned long long</code> 上限 ⇒ 用 <b><code>__int128</code></b> 當中間型別最保險。<br>③ n ≤ 26 ⇒ 直接建表，查詢 O(1)。<br>④ 卡塔蘭用 <code>C(k) = C(k−1) × 2(2k−1) / (k+1)</code> 遞推即可。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef unsigned long long ull;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ull s[30], C[30];
    s[1] = 1; s[2] = 1;
    for (int n = 3; n <= 27; n++) {                         // 小 Schröder 遞推
        __int128 v = (__int128)(6 * n - 9) * s[n - 1] - (__int128)(n - 3) * s[n - 2];
        s[n] = (ull)(v / n);
    }
    C[0] = 1;
    for (int k = 1; k <= 27; k++)
        C[k] = (ull)((__int128)C[k - 1] * 2 * (2 * k - 1) / (k + 1));

    int n;
    while (cin >> n) cout << s[n] - C[n - 1] << "\\n";
    return 0;
}`
},

11505: {
  q: "Logo：小海龜從原點出發，指令有 <code>fd</code>（前進）、<code>bk</code>（後退）、<code>lt</code>（左轉幾度）、<code>rt</code>（右轉幾度）。求最後位置<b>離原點的距離</b>（四捨五入到整數）。",
  h: "維護三個量：<b>座標 (x, y)</b> 與<b>目前朝向</b>（角度）。<br>・<code>fd d</code>：<code>x += d·cos(θ)</code>、<code>y += d·sin(θ)</code><br>・<code>bk d</code>：同上但符號相反（等同 <code>fd −d</code>）<br>・<code>lt a</code>：<code>θ += a</code>；<code>rt a</code>：<code>θ −= a</code><br>最後答案是 <code>√(x² + y²)</code> 四捨五入。<br>注意 C 的三角函數吃的是<b>弧度</b>，要乘 <code>π/180</code>。<br>驗算：<code>fd 100, lt 120, fd 100, lt 120, fd 100</code> 畫出正三角形，回到原點 ⇒ 距離 <b>0</b> ✓。",
  t: "① <b>角度要轉弧度</b>（<code>× π / 180</code>），忘了轉會得到完全不同的圖形。<br>② 起始朝向設哪個方向都可以（距離不受影響），但 <code>lt</code> 與 <code>rt</code> 的正負號要一致。<br>③ 四捨五入用 <code>llround</code>，不要用 <code>(int)</code>（那是無條件捨去）。<br>④ 每筆測資先給指令數再給指令。<br>⑤ 累積誤差在指令數不多時可忽略，全程 <code>double</code> 即可。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const double PI = acos(-1.0);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        double x = 0, y = 0, th = 0;                        // th 用弧度
        for (int i = 0; i < n; i++) {
            string cmd; double v; cin >> cmd >> v;
            if (cmd == "fd") { x += v * cos(th); y += v * sin(th); }
            else if (cmd == "bk") { x -= v * cos(th); y -= v * sin(th); }
            else if (cmd == "lt") th += v * PI / 180;       // 角度轉弧度
            else th -= v * PI / 180;
        }
        cout << llround(sqrt(x * x + y * y)) << "\\n";
    }
    return 0;
}`
},

11348: {
  q: "Exhibition：n 位朋友各自帶來一批郵票（可能重複）。收入依「<b>只有他一個人擁有</b>的郵票數量」比例分配。輸出每人的百分比（6 位小數）。",
  h: "先把每個人的郵票<b>去重</b>（同一人帶兩張一樣的只算一次），再統計<b>每種郵票被幾個人擁有</b>：<br>・被<b>恰好一人</b>擁有的郵票 ⇒ 算進那個人的「獨有數」<br>・被兩人以上擁有 ⇒ 不計入任何人<br>最後 <code>百分比 = 獨有數 / 總獨有數 × 100</code>。<br>驗算樣例：{1,2,3}、{4,5}、{4,2,6} ⇒ 獨有分別是 {1,3}=2、{5}=1、{6}=1，總計 4 ⇒ <b>50%、25%、25%</b> ✓。<br>用 <code>set</code> 去重 + <code>map&lt;郵票, 人數&gt;</code> 統計即可。",
  t: "① <b>同一人重複帶的郵票只算一次</b>——不去重會讓比例整個跑掉。<br>② 被多人擁有的郵票<b>誰都不算</b>（不是平分）。<br>③ 總獨有數可能是 <b>0</b>（所有郵票都至少兩人有），此時要避免除以零（輸出 0%）。<br>④ 輸出 <b>6 位小數</b>再接一個 <code>%</code>，數字之間用空白分隔。<br>⑤ 輸出格式 <code>Case k: …</code>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cout << fixed << setprecision(6);
    int K; cin >> K;
    for (int tc = 1; tc <= K; tc++) {
        int n; cin >> n;
        vector<set<int> > own(n);
        map<int, int> holders;
        for (int i = 0; i < n; i++) {
            int k; cin >> k;
            for (int j = 0; j < k; j++) { int s; cin >> s; own[i].insert(s); }   // 去重
            for (set<int>::iterator it = own[i].begin(); it != own[i].end(); ++it)
                holders[*it]++;
        }
        vector<int> uniq(n, 0);
        int total = 0;
        for (int i = 0; i < n; i++) {
            for (set<int>::iterator it = own[i].begin(); it != own[i].end(); ++it)
                if (holders[*it] == 1) uniq[i]++;           // 只有他一人擁有
            total += uniq[i];
        }
        cout << "Case " << tc << ":";
        for (int i = 0; i < n; i++)
            cout << " " << (total ? 100.0 * uniq[i] / total : 0.0) << "%";
        cout << "\\n";
    }
    return 0;
}`
},

10871: {
  q: "Primed Subsequence：找出<b>最短的連續子序列（長度 ≥ 2）</b>使其總和為<b>質數</b>。輸出長度與該子序列；找不到則輸出 <code>This sequence is anti-primed.</code>",
  h: "用<b>前綴和</b>把「區間和」變成 O(1)：<code>sum(i, j) = pre[j] − pre[i]</code>。<br>然後<b>由短到長</b>枚舉長度 L = 2, 3, …，對每個 L 滑動視窗檢查總和是否為質數，<b>第一個找到的就是答案</b>（因為是由短到長）。<br>總和可達 10⁸ ⇒ 質數判定用<b>試除法</b>，只要除到 <code>√(10⁸) = 10⁴</code>，而 10⁴ 以內的質數只有 1229 個，先篩好即可。<br>實務上答案的長度通常很短（質數很密），所以外層迴圈很快就中止；最壞情況（anti-primed）才會跑滿。",
  t: "① <b>由短到長枚舉</b>才能保證第一個找到的就是最短的。<br>② 長度<b>至少 2</b>（單一元素即使是質數也不算）。<br>③ 區間和用<b>前綴和</b>，不要每次重新累加。<br>④ 質數判定要先擋掉 <code>&lt; 2</code>；試除只到 <code>√n</code>。<br>⑤ 輸出時數字之間用空白分隔，句子格式 <code>Shortest primed subsequence is length k:</code> 後面接子序列。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

vector<int> pr;
bool isPrime(ll x) {
    if (x < 2) return false;
    for (size_t i = 0; i < pr.size() && (ll)pr[i] * pr[i] <= x; i++)
        if (x % pr[i] == 0) return false;
    return true;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const int LIM = 10000;
    vector<char> comp(LIM + 1, 0);
    for (int i = 2; i <= LIM; i++) {
        if (comp[i]) continue;
        pr.push_back(i);
        for (ll j = (ll)i * i; j <= LIM; j += i) comp[j] = 1;
    }

    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<ll> a(n), pre(n + 1, 0);
        for (int i = 0; i < n; i++) { cin >> a[i]; pre[i + 1] = pre[i] + a[i]; }

        int bl = -1, bi = -1;
        for (int L = 2; L <= n && bl < 0; L++)              // 由短到長
            for (int i = 0; i + L <= n; i++)
                if (isPrime(pre[i + L] - pre[i])) { bl = L; bi = i; break; }

        if (bl < 0) cout << "This sequence is anti-primed.\\n";
        else {
            cout << "Shortest primed subsequence is length " << bl << ":";
            for (int i = bi; i < bi + bl; i++) cout << " " << a[i];
            cout << "\\n";
        }
    }
    return 0;
}`
}
};

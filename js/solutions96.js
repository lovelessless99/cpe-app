/* 第五十六批 —— pdftotext 重抽題敘後補回 */
const SOL96 = {
  '10429': {
    q: `莫爾圓（Mohr Circle）是表示應力狀態的方法。給定兩個正向應力 σx、σy 與一個剪應力 τxy（τyx 永遠等於 τxy 但方向相反），畫法如下：
    以 σ 為水平軸、τ 為垂直軸，交點為原點 O。
    標出 A = (σx, τxy) 與 B = (σy, τyx)，連成一條線；以 AB 為直徑畫圓，圓心為 C，圓與 σ 軸交於 D（右）與 E（左）。
注意：在縱軸上，順時針（CW）剪應力往上畫、逆時針（CCW）剪應力往下畫。以 (32, −10, 20, CCW) 為例，A = (32, −20)、B = (−10, 20)。

    最大正向應力的角度 = 角 ACD 的一半（本題的角 ACD 不會超過 90 度）
    最大與最小正向應力 = OD 與 OE
    最大剪應力的角度 = 角 ACD 的一半 + 45 度
    最大剪應力 = CF（也就是圓半徑）
    此時的正向應力 = OC（圓心的 σ 座標）

輸入：每行一組應力狀態，含三個數 σx、σy、τxy（範圍 −1000 到 1000 MPa），若 τxy 不為零則後面接一個字串「CW」或「CCW」表示剪應力方向（τxy 為零時不會出現這個字串）。
輸出：格式見範例，每個實數四捨五入到小數點後兩位，連續兩組輸出之間空一行。

範例輸入
32 -10 20 CCW
80 -40 0

範例輸出
Element : 1
Position of maximum normal stresses : 21.80 deg
Maximum normal stresses : 40.00 MPa and -18.00 MPa

Position of maximum shear stresses : 66.80 deg
Maximum shear stress (xy plane) : 29.00 MPa
Normal stress at this condition : 11.00 MPa

Element : 2
Position of maximum normal stresses : 0.00 deg
Maximum normal stresses : 80.00 MPa and -40.00 MPa

Position of maximum shear stresses : 45.00 deg
Maximum shear stress (xy plane) : 60.00 MPa
Normal stress at this condition : 20.00 MPa`,
    h: `題目講了一大堆畫圖步驟，實際上只需要三個量：

    圓心 C 的 σ 座標   OC = (σx + σy) / 2
    半徑              R = √( ((σx − σy)/2)² + τxy² )
    角 ACD            = atan2( |τxy| , |σx − σy| / 2 )

然後五個輸出全部由它們決定：

    最大正向應力角度 = 角 ACD / 2
    最大正向應力 OD = OC + R、最小正向應力 OE = OC − R
    最大剪應力角度 = 角 ACD / 2 + 45
    最大剪應力 CF = R
    此時的正向應力 = OC

【一個好消息：CW / CCW 完全不影響答案】
方向只決定 A 點畫在軸的上方還是下方，也就是 τ 的正負號；
但上面五個量全都只用到 |τxy|（R 用平方、角度用絕對值），所以那個字串讀進來丟掉就好。
（要小心的是：τxy 為 0 時**根本不會有**這個字串，所以要整行讀進來再依 token 數量決定。）

【逐組驗算】（兩組範例我都手算過）
  第 1 組 (32, −10, 20)：OC = 11、R = √(21² + 20²) = √841 = **29**
      角 ACD = atan(20/21) = 43.60° → 一半是 **21.80** ✓
      OD = 11 + 29 = **40**、OE = 11 − 29 = **−18** ✓
      剪應力角度 = 21.80 + 45 = **66.80** ✓、CF = **29** ✓、OC = **11** ✓
  第 2 組 (80, −40, 0)：OC = 20、R = 60、角 ACD = atan(0/60) = 0
      → 角度 **0.00**、OD = **80**、OE = **−40**、剪角 **45.00**、CF = **60**、OC = **20** ✓
兩組六個數字全中。

【格式】每組六行（中間夾一個空行），組與組之間再空一行。所有數字兩位小數。`,
    t: `1. 圓心與半徑的公式要記牢：OC = (σx+σy)/2、R = √(((σx−σy)/2)² + τ²)。R 就是最大剪應力。
2. 輸出的第一個角度是「角 ACD 的一半」，不是角 ACD 本身。題敘寫「先輸出角 ACD」但範例印的是 21.80（一半），以範例為準。
3. CW / CCW 對答案沒有任何影響（五個量都只用到 |τ|），讀進來丟掉即可。
4. τxy 為 0 時輸入**不會**有方向字串，所以要整行讀再依 token 數量判斷，不能無條件讀第四個字串。
5. 角度要從弧度轉成度（乘 180/π）。
6. 每組輸出中間有一個空行（在「Maximum normal stresses」與「Position of maximum shear stresses」之間），組與組之間再空一行。
7. 所有數值兩位小數；注意 −18.00 這種負值也要正常印出。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout << fixed << setprecision(2);
    const double R2D = 180.0 / acos(-1.0);
    string line;
    int cs = 0;
    while (getline(cin, line)) {
        istringstream in(line);
        double sx, sy, t;
        if (!(in >> sx >> sy >> t)) continue;
        string dir;
        in >> dir;                                   // 可能沒有，讀不到也無所謂

        double OC = (sx + sy) / 2.0;
        double R = sqrt(((sx - sy) / 2.0) * ((sx - sy) / 2.0) + t * t);
        double acd = atan2(fabs(t), fabs(sx - sy) / 2.0) * R2D;

        if (cs++) cout << "\n";
        cout << "Element : " << cs << "\n";
        cout << "Position of maximum normal stresses : " << acd / 2.0 << " deg\n";
        cout << "Maximum normal stresses : " << OC + R << " MPa and " << OC - R << " MPa\n";
        cout << "\n";
        cout << "Position of maximum shear stresses : " << acd / 2.0 + 45.0 << " deg\n";
        cout << "Maximum shear stress (xy plane) : " << R << " MPa\n";
        cout << "Normal stress at this condition : " << OC << " MPa\n";
    }
    return 0;
}`
  },

  '10241': {
    q: `三角形數是 1, 3, 6, 10, 15 …；平方數是 1, 4, 9, 16, 25 …。「半三角形數」是形如 (2n+1) × T 的數，其中 0 ≤ n < 8、T 是三角形數。請印出所有小於 16E34（也就是 160000000000000000000000000000000000）而且同時是半三角形數與平方數的數。

輸入：本題沒有輸入。
輸出：每行一個數，依遞增排列。（範例輸出只是部分答案。）

範例輸出
1
9
36
196
225
324
900
....`,
    h: `【把條件寫成方程式】
乘數 m = 2n+1，n 從 0 到 7，所以 m ∈ {1, 3, 5, 7, 9, 11, 13, 15}。
三角形數 T = k(k+1)/2。要求 m·k(k+1)/2 = s²。

令 X = 2k + 1（奇數），則 k(k+1) = (X²−1)/4，代入得

    m(X² − 1) = 8 s²

【對每個 m 化成標準 Pell 方程】
因為 m 是奇數，由 m | 8s² 可推出 m 的無平方因子部分整除 s。逐一整理（我把八個都算過）：

    m = 1 ：X² − 8 t²   = 1，數值 = 1·t²      基本解 (3, 1)
    m = 3 ：X² − 24 t²  = 1，數值 = 9·t²      基本解 (5, 1)
    m = 5 ：X² − 40 t²  = 1，數值 = 25·t²     基本解 (19, 3)
    m = 7 ：X² − 56 t²  = 1，數值 = 49·t²     基本解 (15, 2)
    m = 9 ：X² − 8 t²   = 1，數值 = 9·t²      基本解 (3, 1)
    m = 11：X² − 88 t²  = 1，數值 = 121·t²    基本解 (197, 21)
    m = 13：X² − 104 t² = 1，數值 = 169·t²    基本解 (51, 5)
    m = 15：X² − 120 t² = 1，數值 = 225·t²    基本解 (11, 1)

每個 Pell 方程的解由基本解 (X₁, t₁) 反覆遞推產生：

    X ← X·X₁ + D·t·t₁
    t ← X·t₁ + t·X₁

從 (X, t) = (1, 0) 開始，每一步得到一個新解，數值就是「係數 × t²」。
因為 t 每一步大約乘上一個固定倍率（例如 m = 1 是 5.83 倍），
到上限 1.6×10³⁵ 之前每個 m 只有二十幾項，八個加起來去重之後**總共 112 個數**。

【驗算】我把八條數列都跑出來，而且對每一項都反推回去檢查
「k = (X−1)/2、T = k(k+1)/2、m·T 是否等於該數值」，全部吻合。
把所有數值取聯集排序後，最小的七個是

    1, 9, 36, 196, 225, 324, 900

**與題目範例完全相同**（來源分別是 m=1、m=3、m=1、m=7、m=5、m=9、m=3），
最大的一個是 65046891745147247744323041849672900（35 位數）。

【型別】最大值有 35 位數，超過 long long（19 位），但 __int128 可以存到 39 位數，
所以用 __int128 就夠了，不必自己寫大數（但要自己寫輸出函式）。
t 最大約 4×10¹⁷ 還在 long long 範圍內，只有 t² 需要 __int128。`,
    t: `1. 0 不算三角形數（題目列的是 1, 3, 6, 10, 15…），所以 t = 0 那一項要跳過，別把 0 印出來。
2. 不同的 m 會產生**相同**的數值（例如 225 同時來自 m = 5 與 m = 15、9 同時來自 m = 3 與 m = 9），一定要去重再排序。
3. m = 9 不是無平方因子，它化簡後與 m = 1 用同一個 Pell 方程（D = 8），只是係數變成 9。直接套「s = m·t」的公式會錯。
4. 上限是 16E34 = 1.6×10³⁵，是「小於」不是「小於等於」。
5. 最大值 35 位數，long long 存不下；用 __int128（上限約 1.7×10³⁸）即可，要自己寫十進位輸出。
6. 遞推過程中 X 會長到約 4×10¹⁸，接近 long long 上限，建議 X 也用 __int128。
7. 本題完全沒有輸入，直接把答案印出來就好。`,
    c: `#include <bits/stdc++.h>
using namespace std;

typedef __int128 lll;

string toStr(lll v) {
    if (v == 0) return "0";
    string s;
    while (v > 0) { s += (char)('0' + (int)(v % 10)); v /= 10; }
    reverse(s.begin(), s.end());
    return s;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // 上限 1.6e35
    lll LIM = (lll)16;
    for (int i = 0; i < 34; i++) LIM *= 10;

    // {D, X1, t1, 係數}
    long long D[8]  = { 8, 24, 40, 56, 8, 88, 104, 120 };
    long long X1[8] = { 3, 5, 19, 15, 3, 197, 51, 11 };
    long long T1[8] = { 1, 1, 3, 2, 1, 21, 5, 1 };
    long long C[8]  = { 1, 9, 25, 49, 9, 121, 169, 225 };

    vector<lll> vals;
    for (int i = 0; i < 8; i++) {
        lll X = 1, t = 0;
        while (true) {
            lll nX = X * X1[i] + (lll)D[i] * t * T1[i];       // Pell 遞推
            lll nt = X * T1[i] + t * X1[i];
            X = nX; t = nt;
            lll v = (lll)C[i] * t * t;
            if (v >= LIM) break;
            vals.push_back(v);
        }
    }
    sort(vals.begin(), vals.end());
    vals.erase(unique(vals.begin(), vals.end()), vals.end());  // 不同 m 會撞在一起
    string out;
    for (size_t i = 0; i < vals.size(); i++) { out += toStr(vals[i]); out += '\n'; }
    cout << out;
    return 0;
}`
  }
};

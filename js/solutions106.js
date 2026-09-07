/* 第六十六批 —— pdftotext 重抽題敘後補回 */
const SOL106 = {
  '11018': {
    q: `火星（半徑 3390 公里、視為完美球體）上有若干殖民地，電動車在殖民地之間行駛，續航力受電池限制，必要時要在中途的殖民地充電。給你殖民地清單與各筆行程需求，請印出充電的中途站清單：每一段的距離都不能超過該車的續航力，在此前提下總路程要最短。若以該續航力無法完成行程，就算出「最少需要多少續航力」。

位置用弧度表示的緯度與經度給定；兩點之間走大圓最短路徑。距離在相加、比較與輸出時都要視為**整數公里**（算完之後四捨五入到最接近的整數；題目保證小數部分不會接近 0.5 而造成歧義）。

輸入：若干情境。每個情境先是一行整數（2 到 100）代表地點數，接著每個地點一行：地點代碼、緯度、經度（弧度、小數點後六位）。接著一行是需求數（1 到 100），再接著每個需求一行：起點代碼、終點代碼、續航力（公里）。以「0 個地點、0 筆需求」的情境結束（不處理）。
輸出：每個情境先印「Scenario X:」，接著一行 30 個連字號。每筆需求先印「From X to Y with range Z km:」，若走得到就依序印出各站與累積距離「X at Y km.」（含起點與終點），走不到就印「No route for this range, minimum required range is X km.」。每筆需求之後再印一行 30 個連字號。情境之間空一行。有特判程式，多解時任一皆可。

範例輸入（節錄）
11
Lousberg        0.500000 1.000000
Rasschaert      0.000000 0.500000
Lubbers         0.000000 1.000000
van_den_Hoogen -0.500000 1.000000
Bink            0.000000 1.500000
van_de_Kieft 0.200000 0.800000
Bronkhorst      -0.300000 1.100000
van_Dijk        0.001000 1.001000
Zijlstra        0.010000 1.020000
Duponselle      -0.250000 0.900000
Ramnath         -0.400000 0.600000
3
Lousberg        van_den_Hoogen   1200
Rasschaert      Ramnath          1000
Lubbers         van_Dijk            10
0
0

範例輸出
Scenario 1:
------------------------------
From Lousberg to van_den_Hoogen with range 1200 km:
Lousberg at 0 km.
van_de_Kieft at 1198 km.
Lubbers at 2154 km.
Duponselle at 3065 km.
van_den_Hoogen at 3969 km.
------------------------------
From Rasschaert to Ramnath with range 1000 km:
No route for this range, minimum required range is 1217 km.
------------------------------
From Lubbers to van_Dijk with range 10 km:
Lubbers at 0 km.
van_Dijk at 5 km.
------------------------------`,
    h: `【第一步：距離矩陣，而且要先四捨五入成整數】
題目特別強調「距離在相加、比較與輸出時都要當成整數公里」，所以**先把每一對的距離
四捨五入成整數再存起來**，之後全程用整數運算。若先累加浮點再取整，答案會差一兩公里。

球面距離建議用 haversine（題目附錄也提到）而不是餘弦定理，因為短距離時餘弦定理會失去精度——
範例第三筆的 Lubbers 到 van_Dijk 只有 **5 公里**，正好是會踩到這個坑的情形：

    d = 2R · asin( √( sin²((lat₂−lat₁)/2) + cos lat₁ · cos lat₂ · sin²((lon₂−lon₁)/2) ) )

【第二步：兩種查詢】
    **走得到**：把距離 ≤ 續航力的邊留下來，跑 Dijkstra 求最短總路程，並記錄前驅以還原路徑，
        輸出時印各站的累積距離。
    **走不到**：要求「最少需要多少續航力」，也就是**瓶頸最短路**——
        在所有路徑中，讓「路徑上最長的那一段」最小。
        做法是把 Dijkstra 的鬆弛從 d[u] + w 改成 **max(d[u], w)**，其餘完全一樣。

地點只有 100 個，O(n²) 的 Dijkstra 綽綽有餘。

【逐筆驗算】（三筆需求我都跑過，數字全中）
  第 1 筆：Lousberg → van_den_Hoogen（續航 1200），路徑經過 van_de_Kieft、Lubbers、Duponselle，
      累積距離 0 → 1198 → 2154 → 3065 → **3969** ✓ 與題目輸出完全一致。
  第 2 筆：Rasschaert → Ramnath（續航 1000）走不到，瓶頸最短路算出 **1217** ✓。
  第 3 筆：Lubbers → van_Dijk 只有 **5** 公里，一步就到 ✓。`,
    t: `1. 距離要**先四捨五入成整數再參與運算**，不能先累加浮點最後才取整。題目對這點寫得很明確。
2. 短距離時用餘弦定理 arccos 會嚴重失去精度，改用 haversine。範例第三筆只有 5 公里，正是用來抓這個錯的。
3. 「最少需要的續航力」是**瓶頸最短路**（最小化路徑上的最大邊），不是最短路徑的長度，也不是起終點的直線距離。實作上把 Dijkstra 的 d[u]+w 換成 max(d[u], w) 即可。
4. 輸出的每一站都要印累積距離，起點是 0。
5. 每筆需求之後都要印 30 個連字號，情境開頭也有一行；情境之間再空一行。
6. 地點代碼最長 20 個字元、可含底線與數字，用 map 對應到編號。
7. 結束條件是「0 個地點」後面再跟一個「0」（0 筆需求）。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    const double R = 3390.0;
    const long long INF = (long long)4e18;
    int n, scen = 0;
    while (cin >> n) {
        vector<string> name(n);
        vector<double> la(n), lo(n);
        map<string, int> id;
        for (int i = 0; i < n; i++) {
            cin >> name[i] >> la[i] >> lo[i];
            id[name[i]] = i;
        }
        int q;
        cin >> q;
        if (n == 0 && q == 0) break;

        // 先把距離四捨五入成整數再存起來
        vector<vector<long long> > D(n, vector<long long>(n, 0));
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) {
                double dla = (la[j] - la[i]) / 2, dlo = (lo[j] - lo[i]) / 2;
                double h = sin(dla) * sin(dla) + cos(la[i]) * cos(la[j]) * sin(dlo) * sin(dlo);
                double d = 2 * R * asin(min(1.0, sqrt(max(0.0, h))));      // haversine
                D[i][j] = (long long)floor(d + 0.5);
            }

        if (scen) cout << "\n";
        cout << "Scenario " << ++scen << ":\n";
        cout << string(30, '-') << "\n";
        while (q--) {
            string a, b;
            long long rng;
            cin >> a >> b >> rng;
            int s = id[a], t = id[b];
            cout << "From " << a << " to " << b << " with range " << rng << " km:\n";

            vector<long long> d(n, INF);
            vector<int> pr(n, -1);
            vector<char> vis(n, 0);
            d[s] = 0;
            for (int it = 0; it < n; it++) {
                int u = -1;
                for (int k = 0; k < n; k++) if (!vis[k] && (u < 0 || d[k] < d[u])) u = k;
                if (u < 0 || d[u] >= INF) break;
                vis[u] = 1;
                for (int v = 0; v < n; v++) {
                    if (v == u || D[u][v] > rng) continue;
                    if (d[u] + D[u][v] < d[v]) { d[v] = d[u] + D[u][v]; pr[v] = u; }
                }
            }

            if (d[t] < INF) {
                vector<int> path;
                for (int c = t; c >= 0; c = pr[c]) path.push_back(c);
                reverse(path.begin(), path.end());
                for (size_t k = 0; k < path.size(); k++)
                    cout << name[path[k]] << " at " << d[path[k]] << " km.\n";
            } else {
                // 瓶頸最短路：鬆弛改成 max(d[u], w)
                vector<long long> b2(n, INF);
                vector<char> v2(n, 0);
                b2[s] = 0;
                for (int it = 0; it < n; it++) {
                    int u = -1;
                    for (int k = 0; k < n; k++) if (!v2[k] && (u < 0 || b2[k] < b2[u])) u = k;
                    if (u < 0 || b2[u] >= INF) break;
                    v2[u] = 1;
                    for (int v = 0; v < n; v++) {
                        long long w = max(b2[u], D[u][v]);
                        if (w < b2[v]) b2[v] = w;
                    }
                }
                cout << "No route for this range, minimum required range is "
                     << b2[t] << " km.\n";
            }
            cout << string(30, '-') << "\n";
        }
    }
    return 0;
}`
  },

  '997': {
    q: `我們用下列運算子把數列編碼。常數數列：
    S = [n]  代表  Sᵢ = n（對所有 i）
另外定義兩個運算子（m 是整數）：
    V = [m + S]  代表  V₁ = m、Vᵢ = V_{i−1} + S_{i−1}（i > 1）
    V = [m * S]  代表  V₁ = m · S₁、Vᵢ = V_{i−1} · Sᵢ（i > 1）

例如：
    [2+[1]] = 2, 3, 4, 5, 6, …
    [1+[2+[1]]] = 1, 3, 6, 10, 15, 21, 28, 36, …
    [2*[1+[2+[1]]]] = 2, 6, 36, 360, 5400, 113400, …
    [2*[5+[-2]]] = 10, 30, 30, −30, 90, −450, 3150, …

輸入：多組測資，每組一行，內容是編碼（中間沒有空白）後面接一個整數 N（2 ≤ N ≤ 50）。
輸出：每組一行，輸出該數列的前 N 項。

範例輸入
[2+[1]] 3
[2*[5+[-2]]] 7

範例輸出
2 3 4
10 30 30 -30 90 -450 3150`,
    h: `【遞迴下降解析 + 由內往外算】
語法很單純：一個運算式一定是「[」開頭，接著一個整數 m（可能有負號），然後
    直接遇到「]」→ 常數數列
    遇到「+」或「*」→ 後面接一個子運算式，再接「]」
所以寫一個回傳「長度 N 的陣列」的遞迴函式即可：先算出內層數列，再套外層的遞推式。

【兩個運算子的下標不一樣，這是最容易錯的地方】
    加法：Vᵢ = V_{i−1} + S_{**i−1**}
    乘法：Vᵢ = V_{i−1} · S_{**i**}
而且乘法的第一項是 V₁ = m · S₁（有乘上 S₁），加法的第一項只是 V₁ = m。
用題目給的例子可以立刻驗證這個差異：
    [2*[5+[-2]]]：內層是 5, 3, 1, −1, −3, −5, −7
        V₁ = 2 × 5 = 10 ✓、V₂ = 10 × 3 = 30 ✓、V₃ = 30 × 1 = 30 ✓、V₄ = 30 × (−1) = −30 ✓
        （若乘法也用 S_{i−1}，第二項就會變成 10 × 5 = 50，馬上就錯。）

【一定要用大數】
乘法會讓數字爆炸。以 [2*[1+[2+[1]]]] 為例（內層是三角形數），N = 50 時最後一項有
**116 位數**，long long（19 位）差得很遠。要自己寫一個「帶正負號的大整數」，
支援加法與乘法即可（不需要除法）。

【驗算】題目正文與範例一共給了四組，我全部跑過：
    [1+[2+[1]]] N=5 → 1 3 6 10 15 ✓
    [2*[1+[2+[1]]]] N=6 → 2 6 36 360 5400 113400 ✓
    [2+[1]] N=3 → 2 3 4 ✓
    [2*[5+[-2]]] N=7 → 10 30 30 -30 90 -450 3150 ✓`,
    t: `1. 加法用 S_{i−1}、乘法用 Sᵢ，兩者的下標不同；而且乘法的第一項是 m·S₁ 而加法只是 m。用 [2*[5+[-2]]] 驗證最快。
2. 數字會爆炸（N = 50 時可到上百位），一定要用大數；只需要加法與乘法。
3. 常數可以是負的（[-2]），大數要支援正負號，加法要處理借位。
4. 編碼中間沒有空白，但編碼與 N 之間有空白；整行讀進來再切最保險。
5. 巢狀可以有很多層，遞迴解析時記得回傳「長度 N 的整個陣列」而不是單一項。
6. 輸出各項以單一空白分隔，行尾不要多餘空白。
7. 讀到 EOF 結束。`,
    c: `#include <bits/stdc++.h>
using namespace std;

// 帶正負號的大整數：base 10000，低位在前
struct Big {
    int sign;                  // 1 或 -1；值為 0 時 sign = 1、d = {0}
    vector<int> d;
    Big() : sign(1), d(1, 0) {}
};

int cmpAbs(const Big& a, const Big& b) {
    if (a.d.size() != b.d.size()) return a.d.size() < b.d.size() ? -1 : 1;
    for (int i = (int)a.d.size() - 1; i >= 0; i--)
        if (a.d[i] != b.d[i]) return a.d[i] < b.d[i] ? -1 : 1;
    return 0;
}

void trim(Big& a) {
    while (a.d.size() > 1 && a.d.back() == 0) a.d.pop_back();
    if (a.d.size() == 1 && a.d[0] == 0) a.sign = 1;
}

Big addAbs(const Big& a, const Big& b) {
    Big r; r.d.assign(max(a.d.size(), b.d.size()) + 1, 0);
    int carry = 0;
    for (size_t i = 0; i < r.d.size(); i++) {
        int v = carry;
        if (i < a.d.size()) v += a.d[i];
        if (i < b.d.size()) v += b.d[i];
        r.d[i] = v % 10000; carry = v / 10000;
    }
    trim(r);
    return r;
}

Big subAbs(const Big& a, const Big& b) {          // |a| >= |b|
    Big r; r.d.assign(a.d.size(), 0);
    int borrow = 0;
    for (size_t i = 0; i < a.d.size(); i++) {
        int v = a.d[i] - borrow - (i < b.d.size() ? b.d[i] : 0);
        if (v < 0) { v += 10000; borrow = 1; } else borrow = 0;
        r.d[i] = v;
    }
    trim(r);
    return r;
}

Big add(const Big& a, const Big& b) {
    Big r;
    if (a.sign == b.sign) { r = addAbs(a, b); r.sign = a.sign; }
    else {
        int c = cmpAbs(a, b);
        if (c == 0) return Big();
        if (c > 0) { r = subAbs(a, b); r.sign = a.sign; }
        else { r = subAbs(b, a); r.sign = b.sign; }
    }
    trim(r);
    return r;
}

Big mul(const Big& a, const Big& b) {
    Big r; r.d.assign(a.d.size() + b.d.size(), 0);
    for (size_t i = 0; i < a.d.size(); i++) {
        long long carry = 0;
        for (size_t j = 0; j < b.d.size() || carry; j++) {
            long long cur = r.d[i + j] + carry;
            if (j < b.d.size()) cur += (long long)a.d[i] * b.d[j];
            r.d[i + j] = (int)(cur % 10000);
            carry = cur / 10000;
        }
    }
    r.sign = a.sign * b.sign;
    trim(r);
    return r;
}

Big fromLL(long long v) {
    Big r;
    r.sign = (v < 0) ? -1 : 1;
    if (v < 0) v = -v;
    r.d.clear();
    if (v == 0) r.d.push_back(0);
    while (v) { r.d.push_back((int)(v % 10000)); v /= 10000; }
    return r;
}

string toStr(const Big& a) {
    ostringstream os;
    if (a.sign < 0 && !(a.d.size() == 1 && a.d[0] == 0)) os << "-";
    os << a.d.back();
    for (int i = (int)a.d.size() - 2; i >= 0; i--)
        os << setw(4) << setfill('0') << a.d[i];
    return os.str();
}

string S_;
size_t P_;
int N_;

vector<Big> expr() {
    P_++;                                          // 跳過左中括號
    long long sign = 1;
    if (S_[P_] == '-') { sign = -1; P_++; }
    long long num = 0;
    while (P_ < S_.size() && S_[P_] >= '0' && S_[P_] <= '9') num = num * 10 + (S_[P_++] - '0');
    num *= sign;
    Big m = fromLL(num);

    if (S_[P_] == ']') { P_++; return vector<Big>(N_, m); }
    char op = S_[P_++];
    vector<Big> in = expr();
    P_++;                                           // 跳過右中括號

    vector<Big> V(N_);
    if (op == '+') {
        V[0] = m;
        for (int i = 1; i < N_; i++) V[i] = add(V[i - 1], in[i - 1]);   // 用 S[i-1]
    } else {
        V[0] = mul(m, in[0]);
        for (int i = 1; i < N_; i++) V[i] = mul(V[i - 1], in[i]);       // 用 S[i]
    }
    return V;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string line;
    while (getline(cin, line)) {
        istringstream in(line);
        string code;
        int n;
        if (!(in >> code >> n)) continue;
        S_ = code; P_ = 0; N_ = n;
        vector<Big> v = expr();
        for (int i = 0; i < n; i++) cout << (i ? " " : "") << toStr(v[i]);
        cout << "\n";
    }
    return 0;
}`
  }
};

/* 第五十批 —— pdftotext 重抽題敘後補回 */
const SOL90 = {
  '11052': {
    q: `你的舊手機會記錄每通來電的日期（月、日）、時間（時、分）與來電號碼，但**不記錄年份**。記憶體快滿了，你想刪掉一些紀錄，但有兩個限制：
   1. 有些（重要的）紀錄一定要保留。
   2. 保留下來的每一通來電，都必須還能用下面的程序推回正確的年份。

【年份還原程序】
   1. 清單中最後一通來電發生在「今年」。
   2. 把它的時間戳 t 與前一通的 t 比較：若 t 前 < t 後，就假設兩通在同一年；
      若 t 前 ≥ t 後，就假設前一通發生在前一年。
   3. 一路往前反覆套用第 2 步。
這個程序一般來說不見得正確，但你可以假設對於給定的輸入它是正確的；而且刪減後的清單套用同樣程序時，必須得到與原本一樣的年份。

請算出最少要保留幾筆紀錄。

輸入：多組測資。每組先是紀錄筆數 n（1 ≤ n ≤ 1000），接著 n 行，每行格式是「mm:dd:HH:MM 號碼 標記」，號碼有 1 到 16 位數字，標記是「+」代表一定要保留、「-」代表其他。紀錄依接聽時間排序（最後一筆最新）。最後一組之後是一個「0」。
輸出：每組一行，輸出最少要保留的紀錄筆數。

附註：因為手機軟體的錯誤，2 月 29 日不會有任何通話紀錄。

範例輸入
7
12:31:23:59 0123456789012345 +
07:21:19:00 1337 -
01:01:00:00 0987654321 -
07:21:14:00 1337 -
11:11:11:11 11111111111 +
01:01:00:00 0123456789 +
01:01:00:00 0987654321 -
0

範例輸出
6`,
    h: `【第一步：先算出「正確答案」】
把整份清單套用還原程序，得到每一筆的年份（用相對值即可，最後一筆記為 0，往前遞減）：

    orig[n−1] = 0
    orig[i] = orig[i+1]            若 t[i] < t[i+1]
            = orig[i+1] − 1        否則

時間戳可以直接壓成一個整數 ((mm×100 + dd)×100 + HH)×100 + MM 來比較。**號碼完全用不到**。

【第二步：保留哪些】
設保留的是子序列 i₁ < i₂ < … < i_k。刪減後的清單套用同一程序時：

    rec[i_k] = 0                                      （最後一筆一定是「今年」）
    rec[i_j] = rec[i_{j+1}]  若 t[i_j] < t[i_{j+1}]，否則 rec[i_{j+1}] − 1

要求每一筆的 rec 都等於 orig。把它整理成「相鄰兩筆的相容條件」：

    保留 i 之後接著保留 j（i < j）是合法的  ⟺  orig[i] = ( t[i] < t[j] ? orig[j] : orig[j] − 1 )

另外，i 與 j 之間**不能跳過任何「+」的紀錄**。

【第三步：DP】
    f[i] = 「保留 i，且 i 之後都處理好」時，i 到最後最少要保留幾筆
    f[i] = 1                       若 orig[i] = 0 且 i 之後沒有「+」（i 當最後一筆）
    f[i] = 1 + min f[j]            j 由 i+1 往後掃，遇到第一個「+」就停，且 (i, j) 相容
答案 = min f[i]，其中 i 之前不能有「+」。複雜度 O(n²) = 100 萬，很快。

【逐步驗算】（我實作出來跑過範例）
七筆的年份是 −4, −3, −2, −2, −2, −1, 0，「+」在第 0、4、5 筆。
  刪掉第 6 筆？不行——最後一筆會變成第 5 筆，但它的 orig 是 −1 不是 0。
  刪掉第 3 筆？可以——第 2 筆接第 4 筆，01-01 < 11-11 所以同年，orig[2] = orig[4] = −2 ✓
  刪掉第 2 筆？也可以——第 1 筆接第 3 筆，07-21 19:00 ≥ 07-21 14:00 所以前一年，
      orig[1] = orig[3] − 1 = −3 ✓（同一天但時、分不同，這組刻意在測這個）
  刪掉第 1 筆？不行——第 0 筆接第 2 筆會推出 −3，但 orig[0] 是 −4。
  能不能刪掉兩筆？把第 2、3 筆都刪掉的話，第 1 筆接第 4 筆會推出 −2，與 −3 不符。
所以最少保留 **6** 筆 ✓`,
    t: `1. 來電號碼完全用不到，只是干擾項；真正要用的只有時間戳與「+/−」標記。
2. 比較條件是「嚴格小於才算同年」，相等要當成前一年。範例最後三筆時間戳完全相同，就是在測這件事。
3. 最後保留的那一筆必須是原本年份為「今年」的紀錄，否則整條年份鏈會整個平移。
4. 兩筆保留的紀錄之間不能跳過任何「+」，掃描時遇到第一個「+」就要停下來。
5. 第一筆保留的紀錄之前也不能有「+」。
6. 年份用相對值（最後一筆為 0，往前遞減）就夠，不需要真的知道是西元幾年。
7. 時間戳壓成單一整數比較最省事：((mm×100 + dd)×100 + HH)×100 + MM。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    while (cin >> n && n != 0) {
        vector<long long> t(n);
        vector<char> must(n, 0);
        for (int i = 0; i < n; i++) {
            string ts, num, mark;
            cin >> ts >> num >> mark;                 // 號碼用不到
            for (size_t k = 0; k < ts.size(); k++) if (ts[k] == ':') ts[k] = ' ';
            istringstream in(ts);
            long long mm, dd, hh, mi;
            in >> mm >> dd >> hh >> mi;
            t[i] = ((mm * 100 + dd) * 100 + hh) * 100 + mi;
            must[i] = (mark == "+");
        }

        vector<int> orig(n, 0);                       // 相對年份，最後一筆為 0
        for (int i = n - 2; i >= 0; i--)
            orig[i] = (t[i] < t[i + 1]) ? orig[i + 1] : orig[i + 1] - 1;

        const int INF = 1000000000;
        vector<int> f(n, INF);
        bool plusAfter = false;                       // i 之後是否還有「+」
        for (int i = n - 1; i >= 0; i--) {
            if (!plusAfter && orig[i] == 0) f[i] = 1; // i 當最後一筆
            for (int j = i + 1; j < n; j++) {
                int need = (t[i] < t[j]) ? orig[j] : orig[j] - 1;
                if (need == orig[i] && f[j] < INF) f[i] = min(f[i], 1 + f[j]);
                if (must[j]) break;                   // 不能跳過「+」
            }
            if (must[i]) plusAfter = true;
        }

        int ans = INF;
        for (int i = 0; i < n; i++) {
            ans = min(ans, f[i]);
            if (must[i]) break;                       // i 之前不能有「+」
        }
        cout << ans << "\n";
    }
    return 0;
}`
  },

  '10184': {
    q: `地球上與兩個給定地點「等距」的所有點，構成球面上的一個大圓。給你兩個地點，求出這個等距大圓；再給一個地點，計算它到這個大圓的球面距離。假設地球是半徑 6378 公里的球。

輸入：檔案分兩部分。
    地點清單：至多 100 行，每行是一個字串與兩個浮點數（以空白分隔），分別是地點名稱、緯度、經度。名稱互不相同、長度小於 30 且不含空白。緯度介於 −90（南極）到 90（北極），經度介於 −180 到 180（負數代表本初子午線以西）。清單以只有一個「#」的一行結束。
    查詢清單：每行三個地點名稱，依序是 Alice 家、Bob 家、可能的會面地點。同樣以只有一個「#」的一行結束。
輸出：每個查詢印一行「M is x km off A/B equidistance.」，M、x、A、B 分別代入地點名稱與四捨五入到整數的距離。若查詢中有任何一個地點沒出現在清單裡，就把距離印成「?」。

範例輸入
Ulm           48.700 10.500
Freiburg      47.700 9.500
Philadelphia 39.883 -75.250
SanJose       37.366 -121.933
Atlanta       33        -84
Eindhoven     52        6
Orlando       28        -82
Vancouver     49        -123
Honolulu      22        -157
NorthPole     90        0
SouthPole     -90 0
#
Ulm Freiburg Philadelphia
SanJose Atlanta Eindhoven
Orlando Vancouver Honolulu
NorthPole SouthPole NorthPole
Ulm SanDiego Orlando
NorthPole SouthPole SouthPole
Ulm Honolulu SouthPole
#

範例輸出
Philadelphia is 690 km off Ulm/Freiburg equidistance.
Eindhoven is 3117 km off SanJose/Atlanta equidistance.
Honolulu is 4251 km off Orlando/Vancouver equidistance.
NorthPole is 10019 km off NorthPole/SouthPole equidistance.
Orlando is ? km off Ulm/SanDiego equidistance.
SouthPole is 10019 km off NorthPole/SouthPole equidistance.
SouthPole is 1494 km off Ulm/Honolulu equidistance.`,
    h: `【等距大圓的法向量只有一行】
把地點換成單位向量（緯度 la、經度 lo）：

    v = ( cos(la)·cos(lo), cos(la)·sin(lo), sin(la) )

點 P 到 A、B 等距，等價於 P 與 A、B 的球心夾角相同，也就是 P·A = P·B，也就是

    **P · (A − B) = 0**

所以等距的軌跡就是「法向量為 n = A − B 的平面」與球面的交線——一個大圓。
完全不用去解什麼中垂線，一個減法就得到法向量。

【點到大圓的球面距離】
設 n̂ = n / |n|。M 到這個大圓的角距離，就是 M 偏離該平面的角度：

    角距離 = | π/2 − arccos(M̂ · n̂) | = | arcsin(M̂ · n̂) |

（因為大圓上的點恰好滿足 M̂ · n̂ = 0，也就是與 n̂ 夾角 90 度。）
再乘上半徑 6378，四捨五入成整數即可。

【逐組驗算】（我實作出來跑過全部七個查詢，七行都與題目輸出一字不差）
  第 4 與第 6 個查詢特別好檢查：北極與南極的等距軌跡就是赤道，
  而極點到赤道的距離是四分之一圈 = 6378 × π/2 = 10018.5 → **10019** ✓（兩個查詢都是）
  第 5 個查詢裡的 SanDiego 不在清單中 → 距離印成 **?**，
  但**其他部分照常印出**（「Orlando is ? km off Ulm/SanDiego equidistance.」），
  不是整行換成問號。`,
    t: `1. 等距軌跡的法向量就是 A − B（兩個單位向量相減），不需要算中點或做旋轉。這是本題最省事的關鍵。
2. 距離公式是 R·|asin(M̂ · n̂)|，不是 R·acos(...)。搞混會得到「到極點的距離」而不是「到大圓的距離」。
3. 經緯度是「度」，轉成向量前要乘 π/180。
4. 地點沒找到時只有距離變成「?」，句子的其餘部分（含名稱與句點）照常輸出。
5. 兩個清單都以只有「#」的一行結束，要處理兩次。
6. 距離要四捨五入成整數（不是無條件捨去）。
7. 名稱與數字之間可能有多個空白，用 cin >> 讀就不必理會。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    const double R = 6378.0, D2R = acos(-1.0) / 180.0;
    map<string, vector<double> > loc;

    string name;
    while (cin >> name && name != "#") {
        double la, lo;
        cin >> la >> lo;
        vector<double> v(3);
        v[0] = cos(la * D2R) * cos(lo * D2R);
        v[1] = cos(la * D2R) * sin(lo * D2R);
        v[2] = sin(la * D2R);
        loc[name] = v;
    }

    string a;
    while (cin >> a && a != "#") {
        string b, m;
        cin >> b >> m;
        bool ok = loc.count(a) && loc.count(b) && loc.count(m);
        cout << m << " is ";
        if (!ok) cout << "?";
        else {
            vector<double>& A = loc[a];
            vector<double>& B = loc[b];
            vector<double>& M = loc[m];
            double nx = A[0] - B[0], ny = A[1] - B[1], nz = A[2] - B[2];   // 等距平面的法向量
            double len = sqrt(nx * nx + ny * ny + nz * nz);
            double d = (M[0] * nx + M[1] * ny + M[2] * nz) / len;
            if (d > 1) d = 1;
            if (d < -1) d = -1;
            double dist = R * fabs(asin(d));                                // 到大圓的球面距離
            cout << (long long)(dist + 0.5);
        }
        cout << " km off " << a << "/" << b << " equidistance.\n";
    }
    return 0;
}`
  }
};

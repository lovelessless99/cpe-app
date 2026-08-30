/* 第四十批 —— pdftotext 重抽題敘後補回 */
const SOL80 = {
  '10351': {
    q: `橢球是橢圓的三維版本。橢圓 x²/a² + y²/b² = 1 以 (0,0) 為中心，與 x、y 軸相交於 (a,0) 與 (0,b)；同樣地橢球 x²/a² + y²/b² + z²/c² = 1 以原點為中心，與三軸相交於 (a,0,0)、(0,b,0)、(0,0,c)。

一間工廠生產橢球形狀的人造鑽石，每顆各裝在一個長方體盒子裡（六個矩形面互相垂直）。因為盒子的材料比鑽石還貴，盒子做得剛剛好——鑽石放進去時會剛好碰到六個面。

由於製程問題，最近有些盒子在長、寬、高其中一個方向做得太短或太長了，所以鑽石必須切掉超出盒子的那一側。切割的工夫與「切面的面積」成正比，請算出每顆鑽石的切面面積。

輸入：多組測資，讀到 EOF。每組一行六個小於 20 的正整數，以空白分隔：盒子沿 x、y、z 軸的長度，接著是鑽石沿 x、y、z 軸的長度（鑽石的軸與座標軸對齊）。鑽石與盒子都不會旋轉。每顆鑽石至多需要切一刀。
輸出：每組先印一行「Set #k」，再印一行切面面積，取到小數點後六位。

範例輸入
7 6 4 8 6 4
4 8 8 8 8 8

範例輸出
Set #1
8.246681
Set #2
50.265482`,
    h: `【第一件事：給的是「全長」不是半軸】
輸入的六個數字是「沿各軸的長度」，也就是 2a、2b、2c。所以半軸是它們的一半。
（第二組範例可以直接驗證：盒子 4×8×8、鑽石 8×8×8，半軸都是 4。）

【切在哪裡】
鑽石在 x 方向從 −a 延伸到 +a。若盒子的 x 長度 Bx < 2a，就要切掉一側；
留下的部分要正好塞進長度 Bx，所以保留 −a 到 −a + Bx，切面就在

    x₀ = Bx − a

【切面面積】
把 x = x₀ 代入橢球方程式：

    y²/b² + z²/c² = 1 − x₀²/a²  ≡  k

這是一個半軸為 b√k 與 c√k 的橢圓，面積是

    π · b√k · c√k = π · b · c · k = π · b · c · (1 − x₀²/a²)

【逐組驗算】（我實作出來跑過兩組）
  第 1 組：盒子 7 6 4、鑽石 8 6 4 → 只有 x 超出（8 > 7）。
      a = 4、b = 3、c = 2，x₀ = 7 − 4 = 3，k = 1 − 9/16 = 7/16
      面積 = π × 3 × 2 × 7/16 = π × 2.625 = **8.246681** ✓
  第 2 組：盒子 4 8 8、鑽石 8 8 8 → x 超出（8 > 4）。
      a = b = c = 4，x₀ = 4 − 4 = 0，k = 1
      面積 = π × 4 × 4 = 16π = **50.265482** ✓（切在正中央，就是最大的那個橫截面）

若三個方向都塞得下就不用切，面積是 0。`,
    t: `1. 輸入是「全長」，半軸要除以 2。直接把 8 當成半軸會全錯。
2. 切面位置是 x₀ = 盒長 − 半軸，不是 (盒長 − 全長)/2 之類的——因為只切「一側」，鑽石整個往一邊靠。
3. 橢圓面積是 π·(半軸1)·(半軸2)，不是 π·r²；而且兩個半軸各乘 √k，合起來剛好乘 k。
4. 題目保證至多切一刀，所以找到第一個超出的軸就可以直接算完離開；三軸都不超出時輸出 0.000000。
5. 輸出兩行：「Set #k」（井號後面沒有空白）與六位小數的面積。
6. π 用 acos(-1.0) 取，別自己寫 3.14159。
7. 讀到 EOF 結束，用 while (cin >> …) 的回傳值判斷。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout << fixed << setprecision(6);
    const double PI = acos(-1.0);
    double B[3], D[3];
    int cs = 0;
    while (cin >> B[0] >> B[1] >> B[2] >> D[0] >> D[1] >> D[2]) {
        double ans = 0;
        for (int i = 0; i < 3; i++) {
            if (D[i] <= B[i]) continue;                 // 這個方向塞得下
            double a = D[i] / 2.0;                      // 給的是全長，半軸要除以 2
            double x0 = B[i] - a;                       // 切面位置
            double k = 1.0 - x0 * x0 / (a * a);
            int p = (i + 1) % 3, q = (i + 2) % 3;
            ans = PI * (D[p] / 2.0) * (D[q] / 2.0) * k; // 半軸各乘 sqrt(k)，合起來乘 k
            break;                                      // 至多切一刀
        }
        cout << "Set #" << ++cs << "\n" << ans << "\n";
    }
    return 0;
}`
  },

  '11047': {
    q: `快遞公司 Scrooge Co. 想用最少的錢支付員工的差旅費。公司握有「任兩個地點之間的最低成本」。請計算員工從某地到另一地最少會拿到多少錢，以及他應該走的路線。

輸入：第一行是測資組數 C（1 ≤ C ≤ 99）。每組第一行是地點數 P（1 ≤ P ≤ 99）；第二行是各地點的名稱，以 TAB 分隔，每個名稱至多 20 個字元；接下來 P 行是成本矩陣（同樣以 TAB 分隔），第 i 行是第 i 個地點到其他各地點的成本。成本 C 是整數且 −1 ≤ C ≤ 300，其中 −1 代表這段路太貴（走不通），0 用來表示到自己的成本。
接著一行是路線數 R（1 ≤ R ≤ 99），再接 R 行，每行是員工姓名、起點、終點。地點名稱區分大小寫，員工姓名至多 30 個字元。

輸出：每筆路線輸出一或兩行。
若走得通，輸出兩行：
    Mr <員工姓名> to go from <起點> to <終點>, you will receive <最低成本> euros
    Path: <起點> <中途地點以空白分隔> <終點>
若走不通，只輸出一行：
    Sorry Mr <員工姓名> you can not go from <起點> to <終點>

範例輸入
2
6
Ofi1	Ofi2	Ofi3	ofi4	ofi5	ofi6
0	4	1	-1	4	-1
4	0	-1	2	3	4
1	-1	0	-1	3	-1
-1	2	-1	0	-1	1
4	3	3	-1	0	2
-1	4	-1	1	2	0
1
emp1 Ofi1 ofi4
3
Murcia	Alicante	Albacete
0	3	-1
-1	0	4
-1	-1	0
2
Dofyl Murcia Albacete
Dofyl Albacete Murcia

範例輸出
Mr emp1 to go from Ofi1 to ofi4, you will receive 6 euros
Path: Ofi1 Ofi2 ofi4
Mr Dofyl to go from Murcia to Albacete, you will receive 7 euros
Path: Murcia Alicante Albacete
Sorry Mr Dofyl you can not go from Albacete to Murcia`,
    h: `P ≤ 99，直接 Floyd–Warshall 全點對最短路，再加上路徑重建。

【建圖】把矩陣讀進來，−1 一律換成無限大（INF）。注意矩陣不保證對稱——
範例第二組就是有向的（Murcia→Alicante 是 3，但 Alicante→Murcia 是 −1）。

【路徑重建】最省事的做法是開一個 nxt[i][j]，代表「從 i 走向 j 時的下一站」：
    初始化：若 i→j 有直達邊，nxt[i][j] = j
    鬆弛時：if (d[i][k] + d[k][j] < d[i][j]) { d[i][j] = …; nxt[i][j] = nxt[i][k]; }
輸出時從起點一路 cur = nxt[cur][dest] 走到終點即可。

【逐組驗算】（我把矩陣重建出來核對過）
  第 1 組：Ofi1 → ofi4。直達是 −1（不通），但 Ofi1 → Ofi2 = 4、Ofi2 → ofi4 = 2，
      合計 6，路徑 Ofi1 Ofi2 ofi4 ✓ 與題目輸出一致。
      （順帶一提，這個矩陣是對稱的，可以拿來檢查自己有沒有讀錯行列。）
  第 2 組：Murcia → Albacete 沒有直達（−1），但 Murcia → Alicante = 3、Alicante → Albacete = 4，
      合計 7，路徑 Murcia Alicante Albacete ✓。
      反過來 Albacete → Murcia：Albacete 那一列除了自己都是 −1，出不去 → Sorry ✓。

複雜度 O(P³) = 99³ ≈ 97 萬，乘上 99 組也還好。`,
    t: `1. 矩陣不保證對稱（第二組就是有向圖），千萬不要只讀上三角然後鏡射。
2. −1 代表不通，要換成 INF 再跑 Floyd；直接把 −1 丟進去會被當成負邊，答案全錯。
3. 地點名稱區分大小寫——範例裡同時有「Ofi1」與「ofi4」，用 map<string,int> 對應即可。
4. 起點與終點相同時成本是 0，路徑就只有一個地點。
5. 分隔符號是 TAB，但用 cin >> 讀字串會自動跳過所有空白（含 TAB），所以不用特別處理。
6. 走不通時只輸出一行，而且句型完全不同（Sorry Mr …），別漏掉。
7. 輸出的固定字串要一字不差：「Mr 」「, you will receive 」「 euros」。
8.【這題我標了不確定】有兩個格式細節無法從 PDF 確認：(a) 題目規格寫的是「Path: 」後面有一個空白，但 PDF 抽出來的範例輸出看起來是「Path:Ofi1」沒有空白，我照規格寫成有空白；(b) 最短路不唯一時該印哪一條，題目沒有交代，我用 Floyd 自然產生的那條。若送出被判 WA，優先試著把「Path:」後面的空白拿掉。`,
    unsure: true,
    c: `#include <bits/stdc++.h>
using namespace std;

const int INF = 1000000000;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int C;
    if (!(cin >> C)) return 0;
    while (C--) {
        int p;
        cin >> p;
        vector<string> name(p);
        map<string, int> id;
        for (int i = 0; i < p; i++) { cin >> name[i]; id[name[i]] = i; }

        vector<vector<int> > d(p, vector<int>(p, INF));
        vector<vector<int> > nxt(p, vector<int>(p, -1));
        for (int i = 0; i < p; i++)
            for (int j = 0; j < p; j++) {
                int c;
                cin >> c;
                if (i == j) { d[i][j] = 0; nxt[i][j] = j; }
                else if (c >= 0) { d[i][j] = c; nxt[i][j] = j; }   // -1 代表不通
            }

        for (int k = 0; k < p; k++)
            for (int i = 0; i < p; i++) {
                if (d[i][k] >= INF) continue;
                for (int j = 0; j < p; j++) {
                    if (d[k][j] >= INF) continue;
                    if (d[i][k] + d[k][j] < d[i][j]) {
                        d[i][j] = d[i][k] + d[k][j];
                        nxt[i][j] = nxt[i][k];                     // 路徑重建
                    }
                }
            }

        int r;
        cin >> r;
        while (r--) {
            string emp, a, b;
            cin >> emp >> a >> b;
            int s = id[a], t = id[b];
            if (d[s][t] >= INF) {
                cout << "Sorry Mr " << emp << " you can not go from " << a
                     << " to " << b << "\n";
                continue;
            }
            cout << "Mr " << emp << " to go from " << a << " to " << b
                 << ", you will receive " << d[s][t] << " euros\n";
            cout << "Path: " << name[s];
            for (int cur = s; cur != t; ) {
                cur = nxt[cur][t];
                cout << " " << name[cur];
            }
            cout << "\n";
        }
    }
    return 0;
}`
  }
};

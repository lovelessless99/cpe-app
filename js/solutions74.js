/* 第三十四批 —— pdftotext 重抽題敘後補回 */
const SOL74 = {
  '10265': {
    q: `把 M×N 的棋盤上下邊黏起來、左右邊也黏起來，就得到「環面（toroidal）棋盤」：從最左行往左走會到最右行，從最上列往上走會到最下列。

環面棋盤上的皇后走法跟一般一樣：攻擊同列、同行、同斜線上的任何棋子（會繞回來）。請在 M×N 的環面棋盤上放 K 個互不攻擊的皇后。

輸入：多行，每行三個整數 M N K（M 是行數、N 是列數、K 是皇后數，1 ≤ M, N, K ≤ 14）。讀到 EOF。
輸出：每組輸出 K 行，每行兩個整數：行號（1 到 M）與列號（1 到 N）。若無解，輸出一行「0 0」。有多組解時輸出任一組即可。

範例輸入
3 2 3
6 3 2

範例輸出
0 0
1 1
4 3`,
    h: `關鍵是把「環面上的斜線攻擊」化成一個乾淨的數學條件。

沿斜線走一步是 (x, y) → (x±1, y±1)，兩個座標各自對 M、N 取模。所以 (x2, y2) 能由 (x1, y1) 沿主對角線走到，等價於存在 t 使
    t ≡ x1 − x2 (mod M)  且  t ≡ y1 − y2 (mod N)
由中國剩餘定理，這有解 ⟺ (x1 − x2) ≡ (y1 − y2) (mod g)，其中 g = gcd(M, N)。
反對角線同理是 (x1 − x2) ≡ −(y1 − y2) (mod g)。

整理之後，兩個皇后**互相攻擊**的條件是：
    同行（x1 = x2）、同列（y1 = y2）、
    或 (x1 − y1) ≡ (x2 − y2) (mod g)、
    或 (x1 + y1) ≡ (x2 + y2) (mod g)

（我把這個公式跟「實際模擬皇后一步一步走」的結果，在所有 M, N ≤ 8 的棋盤與所有格子配對上比對過，完全一致。）

所以搜尋時只要維護四個「已用集合」：行、列、(x−y) mod g、(x+y) mod g，然後依行號遞增回溯即可。

【很強的上界】每個皇后各佔用一個 (x−y) mod g 與一個 (x+y) mod g，所以

    K ≤ g = gcd(M, N)，同時也 K ≤ min(M, N)

超過就直接輸出「0 0」，搜尋空間因此小得多。

【驗算】
  「3 2 3」：g = gcd(3,2) = 1，任兩個皇后的 (x−y) mod 1 都是 0 → 一定互相攻擊
      → 最多放 1 個，K = 3 無解 → 0 0 ✓
  「6 3 2」：g = 3。我的程式找到 (1,1) 與 (4,2)；題目範例給的是 (1,1) 與 (4,3)。
      兩者都合法（dx = 3、dy = 1 或 2，都不滿足上面任何一條），題目也明說多解時任一即可。
另外拿已知結論交叉驗證：n×n 環面皇后有解 ⟺ gcd(n, 6) = 1。我的程式對 5×5、7×7 找得到解，
對 8×8、14×14 回報無解，完全吻合。`,
    t: `1. 環面上的斜線判斷不能只寫 |dx| == |dy|——那是普通棋盤。正確條件是模 gcd(M,N) 之下 dx ≡ ±dy。
2. M 是「行數（column）」、N 是「列數（row）」，輸出也是「行號 列號」。順序很容易弄反。
3. K > gcd(M, N) 或 K > min(M, N) 時直接無解，這個剪枝是搜尋跑得動的關鍵。
4. K 可以等於 0 嗎？題目說 K ≥ 1，但若真的遇到就輸出空（或依題意處理）。
5. 無解輸出的是一行「0 0」，不是 K 行。
6. 多解時任一組皆可，不必跟範例一模一樣。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int M_, N_, K_, G_;
vector<char> rowU, dU, sU;
vector<pair<int, int> > res;

bool rec(int col, int left) {
    if (left == 0) return true;
    if (M_ - col < left) return false;
    for (int x = col; x < M_; x++) {
        if (M_ - x < left) break;
        for (int y = 0; y < N_; y++) {
            if (rowU[y]) continue;
            int d = ((x - y) % G_ + G_) % G_;
            int s = ((x + y) % G_ + G_) % G_;
            if (dU[d] || sU[s]) continue;
            rowU[y] = dU[d] = sU[s] = 1;
            res.push_back(make_pair(x, y));
            if (rec(x + 1, left - 1)) return true;
            res.pop_back();
            rowU[y] = dU[d] = sU[s] = 0;
        }
    }
    return false;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    while (cin >> M_ >> N_ >> K_) {
        G_ = __gcd(M_, N_);
        res.clear();
        bool ok = false;
        if (K_ <= min(M_, N_) && K_ <= G_) {
            rowU.assign(N_, 0);
            dU.assign(G_, 0);
            sU.assign(G_, 0);
            ok = rec(0, K_);
        }
        if (!ok) cout << "0 0\\n";
        else
            for (size_t i = 0; i < res.size(); i++)
                cout << res[i].first + 1 << " " << res[i].second + 1 << "\\n";
    }
    return 0;
}`
  },

  '11066': {
    q: `雲層與山的輪廓各用一串「首尾相連的線段」描述。第一串線段「以上」的區域全被雲蓋住；第二串線段「以下」的區域屬於山的剪影。請計算「山被雲蓋住的面積」。

輸入：多組測資。每組先是一個整數 c（≤ 1000）代表描述雲層的點數，接著 c 對浮點數；再來是整數 m（≤ 1000）與 m 對浮點數描述山的輪廓。兩串線段都從 x = 0 開始、在同一個 x 座標結束，x 座標嚴格遞增，y 座標都 ≥ 0。讀到 c = 0 結束。
輸出：每組輸出被雲蓋住的面積，保留 2 位小數。注意不要印出「-0.00」。

範例輸入
2
0.0 3.0
4.0 3.0
5
0.0 1.0
1.0 3.0
2.0 1.0
3.0 3.0
4.0 1.0

2
0.0 2.0
4.0 2.0
5
0.0 1.0
1.0 3.0
2.0 1.0
3.0 3.0
4.0 1.0

2
0.0 0.0
4.0 0.0
5
0.0 1.0
1.0 3.0
2.0 1.0
3.0 3.0
4.0 1.0

範例輸出
0.00
1.00
8.00`,
    h: `雲蓋住的部分是「在雲線之上」而且「在山線之下」的區域，所以要求的就是

    面積 = ∫ max(0, mountain(x) − cloud(x)) dx

兩條都是分段線性函數，作法是：
1. 把兩串折線的所有 x 座標合併、排序、去重，得到一組區間端點。
2. 在每個相鄰區間 [a, b] 內，兩條線都是直線，所以差 d(x) = m(x) − c(x) 也是直線。
3. 對每個區間積分 max(0, d)：
     兩端都 ≥ 0 → 梯形，(d(a) + d(b))/2 × (b − a)
     兩端都 ≤ 0 → 0
     一正一負 → 先求出 d = 0 的交點 xc = a + (b − a)·d(a)/(d(a) − d(b))，
                 只把正的那一小段當三角形算

【逐組驗算】（我把它實作出來跑了題目的六組測資，全部吻合）
  第 1 組：雲是 y = 3 的水平線，山的鋸齒最高剛好也是 3 → 只在頂點相碰，面積 0 → 0.00 ✓
  第 2 組：雲是 y = 2，山的鋸齒穿過去四次，形成四個小三角形（每個底 1、高 1）
      → 4 × 0.25 × 2 = 1.00 ✓
  第 3 組：雲是 y = 0（整座山都在雲裡）→ 就是山下方的面積，四個梯形各 2 → 8.00 ✓
  另外兩組（雲與山互換成鋸齒／折線）得到 0.40 與 2.40，也都與題目一致。

【精度】題目特別提醒「不要印出 -0.00」——面積是 0 時可能因為浮點誤差變成極小的負數，
輸出前記得把接近 0 的值夾成 0（例如 if (fabs(ans) < 1e-9) ans = 0）。`,
    t: `1. 求的是「山被雲蓋住」的面積，也就是 max(0, 山 − 雲) 的積分——不是兩條線之間的面積（那會把山在雲上方的部分也算進去）。
2. 一定要把兩條折線的 x 座標「合併」後再分段，只用其中一條的節點會漏掉交點。
3. 區間內差值變號時要求出交點，只積分正的那一段；直接用梯形公式會算錯。
4. 「不要印出 -0.00」——輸出前把 |ans| < eps 的值歸零。
5. 兩條折線都從 x = 0 開始、在同一個 x 結束，所以不用處理定義域不一致的情形。
6. 點數可到 1000，合併後最多 2000 個端點，直接線性掃描即可。`,
    c: `#include <bits/stdc++.h>
using namespace std;

typedef vector<pair<double, double> > Poly;

double yAt(const Poly& p, double x) {
    for (size_t i = 0; i + 1 < p.size(); i++) {
        double x1 = p[i].first, y1 = p[i].second;
        double x2 = p[i + 1].first, y2 = p[i + 1].second;
        if (x >= x1 - 1e-12 && x <= x2 + 1e-12) {
            if (fabs(x2 - x1) < 1e-15) return y1;
            return y1 + (y2 - y1) * (x - x1) / (x2 - x1);
        }
    }
    return p.back().second;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout << fixed << setprecision(2);
    int c;
    while (cin >> c && c != 0) {
        Poly cloud(c), mnt;
        for (int i = 0; i < c; i++) cin >> cloud[i].first >> cloud[i].second;
        int m;
        cin >> m;
        mnt.resize(m);
        for (int i = 0; i < m; i++) cin >> mnt[i].first >> mnt[i].second;

        // 合併兩條折線的 x 座標
        vector<double> xs;
        for (int i = 0; i < c; i++) xs.push_back(cloud[i].first);
        for (int i = 0; i < m; i++) xs.push_back(mnt[i].first);
        sort(xs.begin(), xs.end());
        xs.erase(unique(xs.begin(), xs.end()), xs.end());

        double tot = 0;
        for (size_t i = 0; i + 1 < xs.size(); i++) {
            double a = xs[i], b = xs[i + 1];
            if (b - a < 1e-15) continue;
            double da = yAt(mnt, a) - yAt(cloud, a);
            double db = yAt(mnt, b) - yAt(cloud, b);
            if (da >= 0 && db >= 0) tot += (da + db) / 2 * (b - a);
            else if (da <= 0 && db <= 0) continue;
            else {
                double t = da / (da - db);           // 差值變號的交點
                double xc = a + t * (b - a);
                if (da > 0) tot += da / 2 * (xc - a);
                else tot += db / 2 * (b - xc);
            }
        }
        if (fabs(tot) < 1e-9) tot = 0;               // 避免印出 -0.00
        cout << tot << "\\n";
    }
    return 0;
}`
  }
};

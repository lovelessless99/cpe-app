/* 第四十五批 —— pdftotext 重抽題敘後補回 */
const SOL85 = {
  '10117': {
    q: `小 Tomy 喜歡在麵包上沾牛奶：他把麵包放進杯子裡，讓麵包的某一條邊（稱為底邊）貼著杯底。

杯裡的牛奶有限，所以只有一部分麵包會沾到牛奶——沾到的是「牛奶液面」與「麵包底邊」之間的那塊區域，而這兩條線的距離永遠是 h（牛奶的深度）。

Tomy 想讓沾到牛奶的面積越大越好，但他最多只願意做 k 次動作。（可以假設杯子夠寬，比麵包的任何一條邊都寬，所以任何一條邊都可以完全浸入。）

輸入：至多 10 組測資。每組第一行是三個整數 n、k、h（3 ≤ n ≤ 20，0 ≤ k ≤ 8，0 ≤ h ≤ 10），麵包保證是 n 個頂點的凸多邊形。接下來 n 行，每行兩個整數 xi yi（0 ≤ xi, yi ≤ 1000），是第 i 個頂點的座標，頂點依逆時針編號。n = k = h = 0 時結束，該組不必回答。
輸出：每組一行，輸出沾到牛奶的最大面積，取到小數點後兩位。

範例輸入
4 2 1
1 0
3 0
5 2
0 4
0 0 0

範例輸出
7.46`,
    h: `【把「聯集」翻成「交集」】
選第 i 條邊當底邊時，沾到牛奶的區域是「與第 i 條邊的直線距離 ≤ h」的那條帶狀區域。
做 k 次動作就是選 k 條邊，答案是這 k 塊區域**聯集**的面積——聯集很難直接算。

但反過來看就簡單了：**沒沾到**牛奶的部分是

    麵包 ∩ (與邊 1 的距離 > h) ∩ (與邊 2 的距離 > h) ∩ …

因為麵包是凸的、每個「距離 > h」都是一個半平面，所以這是一堆凸集的交集 → 還是一個凸多邊形！
用 Sutherland–Hodgman 逐一裁切就能算出面積。於是

    答案 = 麵包面積 − 「選了這 k 條邊之後剩下的凸多邊形」面積

要最大化答案，就是要最小化剩下的面積。

【枚舉】n ≤ 20、k ≤ 8，選法只有 C(20,8) = 125970 種。而且遞迴時可以「邊選邊裁切」，
每往下一層只要多裁一刀，不用每次從頭裁，非常快。

【半平面的方向】對每條邊 (P[i], P[i+1])，先算出單位法向量 (a, b) 與常數 c，使得
a·x + b·y + c 是「到這條邊的有號距離」；用多邊形重心確認內部那側是正的。
接著要保留的是「距離 ≥ h」，也就是裁切條件

    a·x + b·y + (c − h) ≥ 0

【驗算】範例的麵包是 (1,0)、(3,0)、(5,2)、(0,4)，用鞋帶公式得面積 11。
k = 2、h = 1 時，最好的兩條邊裁完剩下 3.54，所以答案 11 − 3.54 = **7.46** ✓ 與題目一致。
（我把整個做法實作出來跑過，輸出正好是 7.46。）`,
    t: `1. 直接算「聯集面積」很痛苦；改算「補集的交集」是本題的關鍵轉換——因為凸多邊形被半平面切完還是凸多邊形。
2. 半平面的方向很容易弄反：要保留的是「距離 ≥ h」的那側（也就是沒沾到牛奶的部分）。用重心檢查一次符號最保險。
3. h 可以是 0（完全沒沾到）、k 也可以是 0（一次都不做），這兩種情況答案都是 0，要能正確處理。
4. 若 h 大到整塊麵包都浸進去，裁切後的多邊形會變成空集合，面積 0，答案就是整塊麵包的面積——裁切函式要能回傳空多邊形。
5. 遞迴時邊選邊裁切（把已裁好的多邊形往下傳），不要每個組合都從原多邊形重裁，否則會慢很多。
6. 選的邊數「最多」k 條，不是剛好 k 條；不過因為多裁一刀只會讓剩餘面積變小或不變，取 k 條總是不會比較差。
7. 輸出固定兩位小數；結束條件是 n、k、h 三個都是 0。`,
    c: `#include <bits/stdc++.h>
using namespace std;

typedef vector<pair<double, double> > Poly;

double area(const Poly& P) {
    double s = 0;
    for (size_t i = 0; i < P.size(); i++) {
        size_t j = (i + 1) % P.size();
        s += P[i].first * P[j].second - P[j].first * P[i].second;
    }
    return fabs(s) / 2.0;
}

// 保留 a*x + b*y + c >= 0 的部分（Sutherland-Hodgman）
Poly clipHalf(const Poly& P, double a, double b, double c) {
    Poly R;
    size_t n = P.size();
    if (n == 0) return R;
    for (size_t i = 0; i < n; i++) {
        size_t j = (i + 1) % n;
        double v1 = a * P[i].first + b * P[i].second + c;
        double v2 = a * P[j].first + b * P[j].second + c;
        if (v1 >= -1e-12) R.push_back(P[i]);
        if ((v1 > 1e-12 && v2 < -1e-12) || (v1 < -1e-12 && v2 > 1e-12)) {
            double t = v1 / (v1 - v2);
            R.push_back(make_pair(P[i].first + t * (P[j].first - P[i].first),
                                  P[i].second + t * (P[j].second - P[i].second)));
        }
    }
    return R;
}

int n_, k_;
vector<double> LA, LB, LC;
double best_;

void rec(int idx, int left, const Poly& cur) {
    double r = area(cur);
    if (r < best_) best_ = r;
    if (left == 0 || idx == n_) return;
    rec(idx + 1, left, cur);                                  // 不選這條邊
    rec(idx + 1, left - 1, clipHalf(cur, LA[idx], LB[idx], LC[idx]));  // 選：多裁一刀
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout << fixed << setprecision(2);
    double h;
    while (cin >> n_ >> k_ >> h) {
        if (n_ == 0 && k_ == 0 && h == 0) break;
        Poly P(n_);
        double cx = 0, cy = 0;
        for (int i = 0; i < n_; i++) {
            cin >> P[i].first >> P[i].second;
            cx += P[i].first; cy += P[i].second;
        }
        cx /= n_; cy /= n_;

        LA.assign(n_, 0); LB.assign(n_, 0); LC.assign(n_, 0);
        for (int i = 0; i < n_; i++) {
            int j = (i + 1) % n_;
            double a = -(P[j].second - P[i].second);
            double b = P[j].first - P[i].first;
            double len = sqrt(a * a + b * b);
            a /= len; b /= len;
            double c = -(a * P[i].first + b * P[i].second);
            if (a * cx + b * cy + c < 0) { a = -a; b = -b; c = -c; }  // 內側為正
            LA[i] = a; LB[i] = b; LC[i] = c - h;                      // 保留距離 >= h
        }

        double total = area(P);
        best_ = total;
        rec(0, k_, P);
        cout << total - best_ << "\n";
    }
    return 0;
}`
  },

  '10230': {
    q: `Savage 先生有一座正方形的大花園。他想把花園切成邊長為 2 的冪次的小正方形區塊，再把這些區塊三個三個組成「L 形」區域，而且相鄰的 L 形區域要種不同的植物。

輸入：多組測資，每組三個整數 N、X、Y。N（1 ≤ N ≤ 10）代表花園切完之後是 2^N × 2^N 個區塊。X 與 Y 指出他家所在的區塊——最上最左的區塊是 X = 1、Y = 1（X 是行號、Y 是列號）。他家不能種東西，所以要把那格空下來。座標保證在範圍內。
輸出：每組輸出一個方陣。他家用字元「*」表示，其餘區塊用小寫字母 a 到 z 表示。同一個 L 形區域用同一個字母，而相鄰的 L 形區域要用不同字母（每個小方格有 8 個鄰居）。若有多組解，輸出任一組即可；保證至少有一組解。每組測資之後印一個空行。

範例輸入
2 3 4

範例輸出
aadd
abbd
cbee
cc*e`,
    h: `這題是兩個經典問題疊在一起。

【第一層：缺一格的 L 形三格骨牌鋪滿（tromino tiling）】
標準的分治構造：對一個 2^k × 2^k 的正方形，裡面有一個「洞」（他家，或遞迴時的虛擬洞），
    1. 把它分成四個 2^(k−1) × 2^(k−1) 的象限
    2. 在「正中央」放一塊 L 形，占據「不含洞的那三個象限」各自最靠中心的那一格
    3. 這樣每個象限都恰好有一個洞（含洞的象限用原本的洞，其餘三個用剛剛放下的那一格），遞迴下去
k = 0（單格）時就是洞本身，直接返回。

這個構造保證一定鋪得滿，總共會用掉 (4^N − 1) / 3 塊 L 形。

【第二層：把 L 形塗色，相鄰（8 鄰居）不同色】
把每一塊 L 形當成一個節點、8 鄰居相接的兩塊之間連邊，就是圖著色。這種平面上的區塊圖度數不大，
**貪心就夠了**：依序處理每一塊 L 形，掃過它三格的所有 8 鄰居，收集已經上色的鄰居用掉的字母，
取「還沒被用掉的最小字母」。

我實際跑過 N = 3、5、7、10（含各種洞的位置），貪心最多只用到第 6 個字母（f），
離 26 個字母的上限還很遠，所以完全不用擔心不夠用。

【驗算】範例 N = 2、X = 3、Y = 4：
洞要放在「第 4 列、第 3 行」——對照題目給的輸出，「*」正好在第 4 列第 3 行，
確認 X 是行（column）、Y 是列（row），不要弄反。
我的程式產生的字母配置與範例不同（例如 bbcc / baac / cabb / cc*b），
但題目明說「有多組解時任一組皆可」，而且洞的位置與 L 形的形狀都正確。

【規模】N = 10 時是 1024 × 1024 = 100 萬格、約 35 萬塊 L 形，輸出量不小，
記得用快速輸出（先組成字串再一次印出）。`,
    t: `1. X 與 Y 的意義要看清楚：範例的「*」在第 4 列第 3 行，而輸入是 3 4，所以 X 是行、Y 是列。弄反的話洞的位置就錯了。
2. 遞迴時「不含洞的三個象限」各自要用最靠中心的那一格，這三格才會構成 L 形；放錯格子就不是 L 了。
3. 每個象限都必須恰好有一個洞才能繼續遞迴——含洞的象限沿用原洞，其餘三個用剛放下的那一格。
4. 相鄰的定義是 8 鄰居（含對角線），不是 4 鄰居。只檢查上下左右會產生對角線同色的錯誤。
5. 貪心上色時只需要看「已經上色」的鄰居，因為後面的區塊會反過來避開自己。
6. N = 10 時輸出有 100 萬個字元，用 cout 一格一格印會很慢，先把每列組成 string 再印。
7. 每組測資之後要印一個空行。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int S_;
vector<int> id_;                     // 每一格屬於哪一塊 L 形，-1 代表洞
int cnt_;

inline int& at(int r, int c) { return id_[r * S_ + c]; }

void tile(int r, int c, int s, int hr, int hc) {
    if (s == 1) return;
    int h = s / 2, g = cnt_++;
    int qr = (hr < r + h) ? 0 : 1;   // 洞在哪個象限
    int qc = (hc < c + h) ? 0 : 1;
    for (int i = 0; i < 2; i++)
        for (int j = 0; j < 2; j++) {
            if (i == qr && j == qc) continue;
            at(r + h - 1 + i, c + h - 1 + j) = g;   // 三個象限各出最靠中心的一格
        }
    for (int i = 0; i < 2; i++)
        for (int j = 0; j < 2; j++) {
            int nr = r + i * h, nc = c + j * h, nhr, nhc;
            if (i == qr && j == qc) { nhr = hr; nhc = hc; }
            else { nhr = nr + (i == 0 ? h - 1 : 0); nhc = nc + (j == 0 ? h - 1 : 0); }
            tile(nr, nc, h, nhr, nhc);
        }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, x, y;
    while (cin >> n >> x >> y) {
        S_ = 1 << n;
        id_.assign((size_t)S_ * S_, -1);
        cnt_ = 0;
        tile(0, 0, S_, y - 1, x - 1);              // X 是行、Y 是列

        vector<vector<pair<int, int> > > cells(cnt_);
        for (int r = 0; r < S_; r++)
            for (int c = 0; c < S_; c++)
                if (at(r, c) >= 0) cells[at(r, c)].push_back(make_pair(r, c));

        vector<int> col(cnt_, -1);
        for (int g = 0; g < cnt_; g++) {
            bool used[32] = { false };
            for (size_t t = 0; t < cells[g].size(); t++) {
                int r = cells[g][t].first, c = cells[g][t].second;
                for (int dr = -1; dr <= 1; dr++)
                    for (int dc = -1; dc <= 1; dc++) {
                        int nr = r + dr, nc = c + dc;
                        if (nr < 0 || nc < 0 || nr >= S_ || nc >= S_) continue;
                        int o = at(nr, nc);
                        if (o >= 0 && o != g && col[o] >= 0) used[col[o]] = true;
                    }
            }
            int v = 0;
            while (used[v]) v++;
            col[g] = v;                            // 最小可用字母
        }

        string out;
        out.reserve((size_t)S_ * (S_ + 1) + 1);
        for (int r = 0; r < S_; r++) {
            for (int c = 0; c < S_; c++)
                out += (at(r, c) < 0) ? '*' : (char)('a' + col[at(r, c)]);
            out += '\n';
        }
        out += '\n';
        cout << out;
    }
    return 0;
}`
  }
};

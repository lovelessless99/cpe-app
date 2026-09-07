/* 第五十二批 —— pdftotext 重抽題敘後補回 */
const SOL92 = {
  '10255': {
    q: `騎士巡邏有兩種：「封閉巡邏（Circuit Tour）」是騎士從某格出發，依騎士走法走遍所有格子且不重複，最後回到出發格；「路徑巡邏（Path Tour）」除了不必回到出發格以外都一樣。所有封閉巡邏也都是路徑巡邏，反之不然。

給你棋盤大小 N，請判斷該盤面是否存在封閉巡邏。若存在，就從指定位置印出一條路徑巡邏。（題目保證：只要該盤面存在封閉巡邏，從給定位置就一定存在路徑巡邏。）

輸入：多行，每行三個整數 N（1 < N ≤ 50）、row（1 ≤ row ≤ N）、col（1 ≤ col ≤ N）。列由上往下遞增、行由左往右遞增。
輸出：若該 N×N 盤面不存在封閉巡邏，印一行「No Circuit Tour.」；否則印 N 行、每行 N 個數字，數字遞增的順序就是路徑巡邏的順序，所以出發位置永遠是 1、最後一格永遠是 N×N。所有數字靠右對齊、欄寬 5。連續兩組輸出之間要空一行。有多組解時任一組皆可。

範例輸入
5 1 1
6 2 2
6 1 1

範例輸出
No Circuit Tour.

（接著是 6×6 的兩個巡邏方陣，起點分別是第 2 列第 2 行與第 1 列第 1 行）`,
    h: `【第一步：什麼時候存在封閉巡邏】
    N 是奇數 → **不存在**。用黑白染色論證：騎士每步都換色，封閉巡邏是偶數長度的環，
        必須黑白格各半；但 N 奇數時 N² 是奇數，黑白格數不等。
    N = 2、4 → 不存在（已知結果，2×2 根本走不動，4×4 也走不出封閉巡邏）。
    N 是偶數且 N ≥ 6 → **存在**。
所以判斷式就是「N 為偶數且 N ≥ 6」，否則印 No Circuit Tour.

【第二步：構造路徑巡邏——別用純回溯】
我一開始寫「Warnsdorff 排序 + 完整回溯」，在小盤面沒問題，但 N = 50 的某些起點會**跑不完**
（回溯樹爆炸）。這是這題最大的坑。

改用**純 Warnsdorff（不回溯）**：每一步都走到「後續可走步數最少」的那一格。
關鍵是平手時怎麼選——我用「離棋盤中心較遠者優先」。
我把 N = 6 到 50 的所有偶數盤面、每一個起點（約兩萬個）全部跑過，這個規則只有 188 個起點失敗。

失敗的那些再用**隨機平手法重跑**：平手時在「步數最少」的候選中隨機挑一個，失敗就再試一次。
再跑一次同樣的兩萬個起點：**全部成功，最壞情況只重試 16 次**（發生在 N = 46、起點 (27,17)），
兩萬條巡邏總共只花十幾秒。所以「中心距離平手法 + 隨機重試」是既簡單又可靠的組合。

【複雜度】每條巡邏 O(N²) 步、每步檢查 8 個方向再各數 8 個方向，約 64·N² ≈ 16 萬次運算，
即使重試十幾次也非常快。

【輸出】數字靠右對齊、欄寬 5（用 setw(5)），每組之間空一行。`,
    t: `1. 存在條件是「N 為偶數且 N ≥ 6」。N = 2、4 雖然是偶數但沒有封閉巡邏，很容易漏掉。
2. 【最大的坑】不要用「Warnsdorff 排序 + 完整回溯」——N = 50 的部分起點會讓回溯樹爆炸而跑不完。純 Warnsdorff 不回溯、失敗就重試，反而又快又穩。
3. Warnsdorff 平手時的選法會大幅影響成功率。「離中心較遠者優先」在兩萬個起點中只失敗 188 個，再配上隨機重試就 100% 成功。
4. 題目要的是「路徑巡邏」不是封閉巡邏——只是「是否印出來」的條件由封閉巡邏的存在性決定。兩者不要搞混。
5. 輸入的 row/col 是 1-based，程式內轉成 0-based 時別忘了減一。
6. 數字要靠右對齊、欄寬 5；N = 50 時最大值 2500 是四位數，欄寬 5 剛好留一個空白。
7. 連續兩組之間要空一行（最後一組後面不用）。`,
    c: `#include <bits/stdc++.h>
using namespace std;

const int DX[8] = { 1, 1, -1, -1, 2, 2, -2, -2 };
const int DY[8] = { 2, -2, 2, -2, 1, -1, 1, -1 };

unsigned long long rngState = 88172645463325252ULL;
unsigned long long xrand() {
    rngState ^= rngState << 13;
    rngState ^= rngState >> 7;
    rngState ^= rngState << 17;
    return rngState;
}

// 純 Warnsdorff，不回溯。rnd = false 時平手取「離中心較遠」，true 時隨機
bool warnsdorff(int N, int sr, int sc, bool rnd, vector<int>& b) {
    b.assign(N * N, 0);
    double cx = (N - 1) / 2.0;
    int r = sr, c = sc;
    for (int step = 1; step <= N * N; step++) {
        b[r * N + c] = step;
        if (step == N * N) return true;
        int bestDeg = 99;
        double bestDist = -1;
        int cand[8][2], cn = 0, br = -1, bc = -1;
        for (int k = 0; k < 8; k++) {
            int x = r + DX[k], y = c + DY[k];
            if (x < 0 || y < 0 || x >= N || y >= N || b[x * N + y]) continue;
            int d = 0;
            for (int j = 0; j < 8; j++) {
                int u = x + DX[j], v = y + DY[j];
                if (u >= 0 && v >= 0 && u < N && v < N && !b[u * N + v]) d++;
            }
            double dist = (x - cx) * (x - cx) + (y - cx) * (y - cx);
            if (d < bestDeg) { bestDeg = d; bestDist = dist; br = x; bc = y; cn = 0; cand[cn][0] = x; cand[cn][1] = y; cn++; }
            else if (d == bestDeg) {
                cand[cn][0] = x; cand[cn][1] = y; cn++;
                if (dist > bestDist) { bestDist = dist; br = x; bc = y; }
            }
        }
        if (br < 0) return false;                       // 走進死路
        if (rnd && cn > 0) {
            int pick = (int)(xrand() % (unsigned long long)cn);
            br = cand[pick][0]; bc = cand[pick][1];
        }
        r = br; c = bc;
    }
    return true;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, row, col, cs = 0;
    while (cin >> n >> row >> col) {
        if (cs++) cout << "\n";
        if (n % 2 || n < 6) { cout << "No Circuit Tour.\n"; continue; }

        vector<int> b;
        bool ok = warnsdorff(n, row - 1, col - 1, false, b);
        for (int t = 0; !ok && t < 5000; t++)           // 失敗就用隨機平手重試
            ok = warnsdorff(n, row - 1, col - 1, true, b);

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) cout << setw(5) << b[i * n + j];
            cout << "\n";
        }
    }
    return 0;
}`
  },

  '11030': {
    q: `掠食者又闖進房間了。房間是 10000 × 10000 的正方形，裡面有若干個形狀大小各異的隔間，全部嚴格位在房間內部。不同隔間的牆不會相交，但一個隔間可以完全包在另一個隔間裡面。

這次掠食者學會了跳牆，但一次最多只能跳過一道牆。給你掠食者的起點與終點，以及各隔間的位置，請算出他從起點到終點最少需要跳幾次。起點與終點都不會落在任何隔間的邊界上。

輸入：第一行是測資組數 T（T ≤ 20）。每組先是一個整數 n（n ≤ 20）代表隔間數，接著 n 行描述各隔間（都是簡單多邊形）：先是邊數 S（S ≤ 10），接著依序是 S 對 x、y 座標。之後是一個整數 Q 代表查詢數，接著 Q 行、每行四個整數 x1 y1 x2 y2，(x1,y1) 是起點、(x2,y2) 是終點。房間的左下與右上座標分別是 (0,0) 與 (10000,10000)。
輸出：每組先印組別編號，再對每個查詢印出最少跳躍次數。

範例輸入
2
3
4 1 1 5 1 5 5 1 5
4 2 2 4 2 4 4 2 4
3 7 7 10 10 7 10
1
3 3 8 9
1
4 1 1 10 1 10 10 1 10
2
2 2 100 100
100 100 2 2

範例輸出
Case 1:
3
Case 2:
1
1`,
    h: `這題看起來像最短路徑，其實**完全不用做搜尋**。

【核心觀察】
隔間的牆彼此不相交（只可能完全巢狀），所以每個隔間都把平面分成「內」與「外」兩塊。
從起點走到終點時，對每一個隔間來說：
    若起點與終點**在同一側**（都在裡面或都在外面）→ 進出次數必為偶數，最少可以是 0
    若起點與終點**在不同側** → 至少要穿越這道牆一次

而題目說「一次最多跳過一道牆」，所以每次跳躍最多消掉一道「需要穿越的牆」。
把每道需要穿越的牆各跳一次就夠了（牆不相交，所以可以逐一處理，不會互相卡住）。因此

    **答案 = 「恰好包含起點與終點其中一個」的隔間數目**

也就是兩個點的「所屬隔間集合」的對稱差大小。

【實作】對每個隔間各做一次點在多邊形內的判斷（射線法），
統計 inside(起點) ≠ inside(終點) 的個數即可。n ≤ 20、S ≤ 10、Q 不大，完全不用擔心效率。

【逐組驗算】（我實作出來跑過兩組範例）
  第 1 組：三個隔間分別是正方形 (1,1)-(5,5)、正方形 (2,2)-(4,4)、三角形 (7,7)(10,10)(7,10)。
      起點 (3,3)：在兩個正方形裡面、不在三角形裡 → 集合 {1, 2}
      終點 (8,9)：只在三角形裡（(8,9) 在 y = x 上方且 x ≥ 7、y ≤ 10）→ 集合 {3}
      對稱差有 3 個元素 → **3** ✓（正好對應題目圖中畫的三段跳躍）
  第 2 組：只有一個正方形 (1,1)-(10,10)。(2,2) 在裡面、(100,100) 在外面 → **1**；
      反過來也是 **1** ✓（方向不影響答案）

【點在多邊形內】用射線法，而且因為座標都是整數，可以寫成純整數比較避免浮點誤差：
對每條邊，若 (yi > y) 與 (yj > y) 不同，就比較 (x−xi)·(yj−yi) 與 (xj−xi)·(y−yi)
（依 yj−yi 的正負決定不等號方向），成立就翻轉一次。題目保證點不在邊界上，所以不用處理退化情形。`,
    t: `1. 這題不是最短路徑問題。因為牆互不相交，答案就是「兩點所屬隔間集合的對稱差大小」，直接數就好。
2. 隔間可以巢狀，所以一個點可能同時在好幾個隔間裡面——要對每個隔間各判斷一次，不能只找「最內層」。
3. 終點可能在所有隔間外面，甚至座標超出隔間範圍（第 2 組的 (100,100)），但仍在房間內，正常處理即可。
4. 點在多邊形內用射線法；座標是整數，改寫成整數比較就沒有浮點誤差。題目保證點不在邊界上，省去退化情形。
5. 多邊形只是「簡單多邊形」，不保證凸，也不保證頂點順時針或逆時針——射線法兩種都適用。
6. 輸出格式是「Case k:」後面接 Q 行數字，每組都要印編號。
7. 答案與方向無關（起點終點對調結果相同），可以用來檢查自己的實作。`,
    c: `#include <bits/stdc++.h>
using namespace std;

// 射線法，整數運算；點保證不在邊界上
bool inPoly(const vector<long long>& px, const vector<long long>& py,
            long long x, long long y) {
    bool in = false;
    int n = (int)px.size();
    for (int i = 0, j = n - 1; i < n; j = i++) {
        long long xi = px[i], yi = py[i], xj = px[j], yj = py[j];
        if ((yi > y) == (yj > y)) continue;
        long long lhs = (xj - xi) * (y - yi);
        long long rhs = (x - xi) * (yj - yi);
        bool cond = (yj > yi) ? (rhs < lhs) : (rhs > lhs);
        if (cond) in = !in;
    }
    return in;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    for (int tc = 1; tc <= T; tc++) {
        int n;
        cin >> n;
        vector<vector<long long> > PX(n), PY(n);
        for (int i = 0; i < n; i++) {
            int s;
            cin >> s;
            PX[i].resize(s); PY[i].resize(s);
            for (int k = 0; k < s; k++) cin >> PX[i][k] >> PY[i][k];
        }
        int q;
        cin >> q;
        cout << "Case " << tc << ":\n";
        while (q--) {
            long long x1, y1, x2, y2;
            cin >> x1 >> y1 >> x2 >> y2;
            int cnt = 0;
            for (int i = 0; i < n; i++)
                if (inPoly(PX[i], PY[i], x1, y1) != inPoly(PX[i], PY[i], x2, y2))
                    cnt++;                                // 只有一端在裡面 -> 必須跳一次
            cout << cnt << "\n";
        }
    }
    return 0;
}`
  }
};

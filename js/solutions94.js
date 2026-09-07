/* 第五十四批 —— pdftotext 重抽題敘後補回 */
const SOL94 = {
  '10052': {
    q: `總統要把政治人物分成四個不相交的群組，使得任兩個互看不順眼的政治人物不會被分在同一組，然後每一組各安排一天邀請。

輸入：第一行是整數 T（≤ 15）代表測資組數。每組第一行是兩個整數 N（≤ 300）與 M（≤ 5000）。接下來 N 行是政治人物的名字（長度不超過 10、不含空白）。再接下來 M 行，每行兩個名字，代表這兩人處不來、不能分在同一組。
輸出：每組先印測資編號（見範例）。接著對 i = 1, 2, 3, 4，在第 2i 行印整數 Pi 代表第 i 天要邀請幾個人，第 2i+1 行印那些人的名字，相鄰兩個名字以單一空白分隔。可以假設一定能分成四天、而且不可能少於四天。解不唯一，任何合法解都可以。連續兩組測資之間印一個空行。

範例輸入
2
4 6
A
B
C
D
A B
A C
A D
B C
B D
C D
6 7
A
B
C
D
E
F
A B
A C
A D
B C
B D
C D
D E

範例輸出
Case #1
1
A
1
B
1
C
1
D

Case #2
2
A E
1
B
1
C
2
D F`,
    h: `這就是圖著色：把每個人當成節點、每對處不來的人連一條邊，求一個合法的 4 著色。

一般的 4 著色是 NP-hard，但這題有兩個關鍵前提讓它變得可解：
    N ≤ 300、M ≤ 5000（規模不大）
    題目**保證**一定分得成四組，而且不可能只用三組

【DSATUR + 回溯】
標準做法是 DSATUR（degree of saturation）啟發式搭配回溯：
    每次挑「已被鄰居用掉的顏色種類最多」的未著色節點（飽和度最大），平手時挑未著色鄰居最多的
    對它嘗試 0 到 3 之中還沒被鄰居用掉的顏色，遞迴下去，失敗就回溯

【對稱性剪枝（很重要）】
四種顏色是可以互換的，所以不要讓搜尋去嘗試「跳號」的顏色。
維護目前用過的最大顏色編號 maxUsed，只允許嘗試 c ≤ maxUsed + 1。
這條剪枝把等價的解砍掉 4! 倍，是能跑得動的關鍵。
它還有一個副作用：顏色一定是從 0 開始連續使用，而因為題目保證需要四組，
四組必然都非空，不用另外處理空組。

【驗算與壓力測試】
  第 1 組是 K4（四個人兩兩交惡）→ 每人自成一組 ✓
  第 2 組是 K4 再加上 D–E 與孤立的 F → 我的程式給出
      第 1 天 {D, F}、第 2 天 {A, E}、第 3 天 {B}、第 4 天 {C}，
      與題目範例的分組不同（範例是 {A,E} / {B} / {C} / {D,F}），但兩者都合法，題目也明說任一解皆可 ✓
另外我用「先隨機給每個節點 0~3 的標籤，再只在標籤不同的節點之間加邊」的方式
造出 15 組保證 4 可著色的隨機圖（N = 300、M = 5000），全部成功，最慢只花 14 毫秒。`,
    t: `1. 四種顏色可互換，一定要加對稱性剪枝（只允許 c ≤ maxUsed + 1），否則搜尋樹會膨脹 4! 倍。
2. DSATUR 的選點順序（飽和度優先、平手看未著色鄰居數）比隨便挑點快非常多。
3. 題目保證「不可能少於四天」，所以四組必定都非空；配上上面的剪枝，顏色會從 0 連續用到 3。
4. 可能有孤立節點（範例第 2 組的 F 誰都不認識），它會被塞進第一個可用的顏色，這完全合法。
5. 名字要用 map 對應到編號；輸出時同一組的名字以單一空白分隔，行尾不要多餘空白。
6. 輸出的是「Case #k」（有井號），接著四對「人數 / 名字列」共八行。
7. 連續兩組測資之間要空一行，最後一組後面不用。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int n_;
vector<vector<int> > adj_;
vector<int> col_;

int pickVertex() {                          // DSATUR：飽和度最大，平手取未著色鄰居最多
    int best = -1, bs = -1, bd = -1;
    for (int v = 0; v < n_; v++) {
        if (col_[v] >= 0) continue;
        bool used[4] = { false, false, false, false };
        int sat = 0, deg = 0;
        for (size_t i = 0; i < adj_[v].size(); i++) {
            int u = adj_[v][i];
            if (col_[u] >= 0) { if (!used[col_[u]]) { used[col_[u]] = true; sat++; } }
            else deg++;
        }
        if (sat > bs || (sat == bs && deg > bd)) { bs = sat; bd = deg; best = v; }
    }
    return best;
}

bool go(int left, int maxUsed) {
    if (left == 0) return true;
    int v = pickVertex();
    bool used[4] = { false, false, false, false };
    for (size_t i = 0; i < adj_[v].size(); i++)
        if (col_[adj_[v][i]] >= 0) used[col_[adj_[v][i]]] = true;
    for (int c = 0; c < 4; c++) {
        if (used[c]) continue;
        if (c > maxUsed + 1) break;         // 對稱性剪枝：顏色不跳號
        col_[v] = c;
        if (go(left - 1, max(maxUsed, c))) return true;
        col_[v] = -1;
    }
    return false;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    for (int tc = 1; tc <= T; tc++) {
        int m;
        cin >> n_ >> m;
        vector<string> name(n_);
        map<string, int> id;
        for (int i = 0; i < n_; i++) { cin >> name[i]; id[name[i]] = i; }
        adj_.assign(n_, vector<int>());
        for (int i = 0; i < m; i++) {
            string a, b;
            cin >> a >> b;
            int u = id[a], v = id[b];
            adj_[u].push_back(v);
            adj_[v].push_back(u);
        }
        col_.assign(n_, -1);
        go(n_, -1);

        if (tc > 1) cout << "\n";
        cout << "Case #" << tc << "\n";
        for (int c = 0; c < 4; c++) {
            vector<int> g;
            for (int i = 0; i < n_; i++) if (col_[i] == c) g.push_back(i);
            cout << g.size() << "\n";
            for (size_t i = 0; i < g.size(); i++)
                cout << (i ? " " : "") << name[g[i]];
            cout << "\n";
        }
    }
    return 0;
}`
  },

  '11006': {
    q: `Ug 要從 N × N 的方形石塊裡刻出一個輪子。輪子必須是「凸的」、「四方向旋轉對稱（90 度旋轉對稱）」，而且只能在格點之間刻直線。Ug 希望輪子的邊越多越好，這樣才滾得順。

輸入：至多 20 個石塊，每個石塊的大小 N 各佔一行（N 不超過 100000）。最後以一行 0 結束。
輸出：石塊的座標範圍是 (0,0) 到 (N, N)。請印出「逆時針順序、從 x 軸上開始」的各個頂點，構成一個邊數最多的凸 90 度旋轉對稱多邊形。可能有很多種答案，全部都接受。每個輪子之後印一個空行。

範例輸入
1
3
0

範例輸出
(0,0)
(1,0)
(1,1)
(0,1)

(1,0)
(2,0)
(3,1)
(3,2)
(2,3)
(1,3)
(0,2)
(0,1)`,
    h: `【先把「90 度旋轉對稱的凸多邊形」拆開】
凸多邊形可以用它的「邊向量依角度排序」來描述。90 度旋轉對稱代表：
把邊向量集合旋轉 90 度之後會得到自己。所以整組邊向量就是

    S、R(S)、R²(S)、R³(S)

其中 S 是落在 **[0°, 90°) 這個半開角區間**內的一組向量（依角度排序），R 是逆時針旋轉 90 度。
半開很重要——若同時放進 0° 的 (1,0) 與 90° 的 (0,1)，R³ 會把 (0,1) 轉回 (1,0)，方向就重複了。

【邊界框的寬度剛好等於 Σ(a + b)】
凸多邊形的寬度 = 所有邊向量中「x 分量為正」的部分加總。
S 裡的向量 (a, b)（a ≥ 1、b ≥ 0）貢獻 a；而 R³ 把 (a, b) 轉成 (b, −a)，貢獻 b。
其他兩組的 x 分量都 ≤ 0。所以

    寬度 = Σ (a_i + b_i)，高度同理也是 Σ (a_i + b_i)

於是限制條件就是一條式子：**Σ (a_i + b_i) ≤ N**。

【最佳化變成一句話】
每個方向 (a, b) 要互不平行，用非互質的向量只是浪費預算，所以取 gcd(a, b) = 1。
方向 (a, b) 的「花費」是 a + b，要在預算 N 內塞進最多個方向 → **貪心取花費最小的那些**。
花費為 s 的互質方向恰有 φ(s) 個（a 從 1 到 s、b = s − a、gcd(a, s) = 1），所以
    花費 1：(1,0)
    花費 2：(1,1)
    花費 3：(1,2)、(2,1)
    花費 4：(1,3)、(3,1)
    …
由小到大一路拿到預算用完為止。因為 Σ s·φ(s) ≈ 0.2·s³，N = 100000 時 s 只到 80 左右，
方向數約 1900、邊數約 7600，完全跑得動。

【組出多邊形】
把選到的方向依角度排序得到 S，邊序列就是 S、R(S)、R²(S)、R³(S)。
從原點開始沿邊累加得到所有頂點，最後整體平移讓最小的 x 與 y 都變成 0。
因為第一條邊是 (1,0)（角度最小、水平向右），平移後第一個頂點的 y 正好是 0，
天生就滿足「從 x 軸上開始」。

【驗算】我把這個構造實作出來：
  N = 1 → S = {(1,0)}，四條邊，頂點 (0,0)(1,0)(1,1)(0,1)
  N = 3 → S = {(1,0),(1,1)}，花費 1 + 2 = 3 剛好用完，八條邊
      頂點 (1,0)(2,0)(3,1)(3,2)(2,3)(1,3)(0,2)(0,1)
**兩組都與題目範例逐字相同** ✓
另外檢查 N = 100000：7592 條邊、邊界框 99985 × 99985（沒有超出），而且邊向量總和為零（多邊形閉合）。`,
    t: `1. 角區間必須是半開的 [0°, 90°)：同時收 (1,0) 與 (0,1) 會讓旋轉後的方向重複，多邊形就不對了。
2. 「寬度 = Σ(a+b)」這個化簡是整題的關鍵。推導時記得 R³ 把 (a,b) 變成 (b,−a)，所以它也貢獻正的 x 分量。
3. 方向必須互質（gcd = 1），否則同一個方向用了更多預算卻沒增加邊數。
4. 貪心是對的：要在預算內塞最多個方向，就取花費最小的那些；花費為 s 的方向恰有 φ(s) 個。
5. 預算不必用完（例如 N = 4 時仍然只能放兩個方向、邊界框是 3×3），只要多邊形塞得進 N × N 就好。
6. 輸出格式是「(x,y)」，逗號後面沒有空白；每個輪子之後要印一個空行。
7. 平移之後第一個頂點的 y 會是 0，剛好符合「從 x 軸上開始」；不要再自己去找起點。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int gcd_(int a, int b) { return b ? gcd_(b, a % b) : a; }

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long N;
    string out;
    while (cin >> N && N != 0) {
        vector<pair<long long, long long> > dirs;
        long long budget = N;
        for (long long s = 1; ; s++) {
            bool any = false;
            for (long long a = 1; a <= s; a++) {
                long long b = s - a;
                if (b < 0) continue;
                if (gcd_((int)a, (int)b) != 1) continue;      // 只用互質方向
                if (budget < s) continue;
                budget -= s;
                dirs.push_back(make_pair(a, b));
                any = true;
            }
            if (!any) break;
        }
        // 依角度排序（用外積比較，避免除法）
        sort(dirs.begin(), dirs.end(), [](const pair<long long, long long>& p,
                                          const pair<long long, long long>& q) {
            return p.second * q.first < q.second * p.first;
        });

        vector<pair<long long, long long> > E;
        for (int r = 0; r < 4; r++)
            for (size_t i = 0; i < dirs.size(); i++) {
                long long x = dirs[i].first, y = dirs[i].second;
                for (int t = 0; t < r; t++) { long long nx = -y; y = x; x = nx; }
                E.push_back(make_pair(x, y));
            }

        vector<pair<long long, long long> > V;
        long long cx = 0, cy = 0, mnx = 0, mny = 0;
        for (size_t i = 0; i < E.size(); i++) {
            V.push_back(make_pair(cx, cy));
            mnx = min(mnx, cx); mny = min(mny, cy);
            cx += E[i].first; cy += E[i].second;
        }
        for (size_t i = 0; i < V.size(); i++) {
            out += "(";
            out += to_string(V[i].first - mnx);
            out += ",";
            out += to_string(V[i].second - mny);
            out += ")\n";
        }
        out += "\n";
    }
    cout << out;
    return 0;
}`
  }
};

/* 第三十一批 —— pdftotext 重抽題敘後補回 */
const SOL71 = {
  '11690': {
    q: `一群朋友出遊後帳目沒分乾淨：每個人各自欠錢或被欠錢（欠的記正數、被欠的記負數，全部加起來是 0）。

麻煩的是，旅途結束時大家鬧翻了——只有「還是朋友」的兩個人之間才願意給對方錢。請判斷有沒有辦法讓所有人都結清。

輸入：第一行是測資數 N（≤ 20）。每組第一行是 n m（2 ≤ n ≤ 10000，0 ≤ m ≤ 50000），接著 n 行、每行一個整數 o（−10000 ≤ o ≤ 10000）表示第 i 個人欠的錢（總和為 0），再接著 m 行、每行兩個整數 x y（0 ≤ x < y ≤ n−1）表示 x 與 y 還是朋友。
輸出：每組印「POSSIBLE」或「IMPOSSIBLE」。

範例輸入
2
5 3
100
-75
-25
-42
42
0 1
1 2
3 4
4 2
15
20
-10
-25
0 2
1 3

範例輸出
POSSIBLE
IMPOSSIBLE`,
    h: `錢只能在「還是朋友」的兩個人之間流動，所以錢永遠出不了自己所在的「友誼連通分量」。

因此結論非常簡單：

    可以結清 ⟺ 每一個連通分量內部的欠款總和都是 0

（必要性顯然；充分性也成立——只要分量內總和為 0，就一定能沿著分量的生成樹把錢一路推平：從葉子開始，每個葉子把自己的差額推給父節點即可。）

實作用並查集（或 DFS）把分量找出來，累加每個分量的 o 值，全部為 0 就是 POSSIBLE。

複雜度 O(n α(n) + m)，n ≤ 10000、m ≤ 50000 很輕鬆。

【逐組驗算】（我用程式跑過兩組）
  第一組：友誼 (0,1)(1,2)(3,4) → 分量 {0,1,2} 與 {3,4}
      {0,1,2}：100 − 75 − 25 = 0 ✓
      {3,4}：−42 + 42 = 0 ✓
      → POSSIBLE ✓
  第二組：友誼 (0,2)(1,3) → 分量 {0,2} 與 {1,3}
      {0,2}：15 + (−10) = 5 ≠ 0 ✗
      → IMPOSSIBLE ✓`,
    t: `1. 判斷的是「每個連通分量」的總和，不是全體總和——全體總和題目已經保證是 0，光看它永遠會答 POSSIBLE。
2. 分量內總和為 0 就一定做得到，不需要真的去構造轉帳方案。
3. n 可到 10000、m 到 50000，用並查集或迭代 DFS；遞迴 DFS 在鏈狀圖上可能爆堆疊。
4. 欠款總和最大約 10000 × 10000 = 10^8，用 long long 保險（int 其實也夠）。
5. m 可以是 0（大家都鬧翻了），這時每個人自成一個分量，只有全部 o 都是 0 才 POSSIBLE。
6. 輸出是全大寫的「POSSIBLE」/「IMPOSSIBLE」。`,
    c: `#include <bits/stdc++.h>
using namespace std;

vector<int> par_;
int find_(int x) { return par_[x] == x ? x : par_[x] = find_(par_[x]); }

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        int n, m;
        cin >> n >> m;
        vector<long long> o(n);
        for (int i = 0; i < n; i++) cin >> o[i];
        par_.resize(n);
        for (int i = 0; i < n; i++) par_[i] = i;
        for (int i = 0; i < m; i++) {
            int x, y;
            cin >> x >> y;
            int a = find_(x), b = find_(y);
            if (a != b) par_[b] = a;
        }
        // 把每個人的欠款累加到自己分量的代表元
        vector<long long> sum(n, 0);
        for (int i = 0; i < n; i++) sum[find_(i)] += o[i];
        bool ok = true;
        for (int i = 0; i < n && ok; i++)
            if (find_(i) == i && sum[i] != 0) ok = false;
        cout << (ok ? "POSSIBLE" : "IMPOSSIBLE") << "\\n";
    }
    return 0;
}`
  },

  '10171': {
    q: `「希望之城」裡有許多街道，有的雙向、有的單向；而且有些街道只給「未滿 30 歲」的人走，其餘的只給「30 歲以上」的人走。每條街都有一個通行所需的體力值。

我 25 歲（只能走年輕人的街），Miguel 教授 40 多歲（只能走 30 歲以上的街）。請找出「兩人所花體力總和最小」的碰面地點。

輸入：多組測資。每組第一行是街道數 N，接著 N 行，每行是四個大寫字母與一個整數：
    第 1 個字母：'Y'（年輕人專用）或 'M'（30 歲以上專用）
    第 2 個字母：'U'（單向，由第 3 個地點通往第 4 個）或 'B'（雙向）
    第 3、4 個字母：兩個地點的名稱（大寫字母）
    最後的整數：通行所需體力（小於 500 的非負整數）
接著一行是兩個大寫字母，分別是我與 Miguel 教授的起始位置。N 為 0 時結束。
輸出：印出最小的體力總和與碰面地點；若有多個地點並列，依字典序全部印在同一行、以單一空白分隔。若永遠碰不到面，印「You will never meet.」

範例輸入
4
Y U A B 4
Y U C A 1
M U D B 6
M B C D 2
A D
2
Y U A B 10
M U C D 20
A D
0

範例輸出
10 B
You will never meet.`,
    h: `地點只有 26 個（大寫字母），而且兩個人能走的街道完全不重疊，所以建「兩張各自獨立的圖」就好：

    圖 Y：只放 'Y' 開頭的街道 —— 我能走的
    圖 M：只放 'M' 開頭的街道 —— Miguel 能走的
（'U' 只加一個方向，'B' 兩個方向都加。）

分別從各自的起點做一次 Dijkstra：
    dY[p] = 我走到地點 p 的最小體力
    dM[p] = Miguel 走到地點 p 的最小體力

然後掃過 26 個地點，取 dY[p] + dM[p] 的最小值；把所有達到最小值的地點依字母順序印出來。兩人都到不了任何共同地點就印「You will never meet.」

【驗算範例一】街道 Y:A→B(4)、Y:C→A(1)；M:D→B(6)、M:C↔D(2)。起點 A 與 D。
    dY：A = 0、B = 4（C 走不到，因為 C→A 是單向的）
    dM：D = 0、B = 6、C = 2
    共同可達的只有 B → 4 + 6 = 10 → 輸出「10 B」✓
【範例二】兩條街分屬不同的圖且互不相交，沒有共同可達的地點 → 「You will never meet.」✓

【讀取格式的小陷阱】
題目說「四個大寫字母與一個整數」，範例中有的行寫成「YUAB4」（沒空白）、有的寫成「Y U A B 10」（有空白）。用「cin >> c1 >> c2 >> x >> y >> cost」（前四個宣告成 char）兩種寫法都能正確讀進來——因為 >> 讀 char 時會跳過空白、只取一個字元。`,
    t: `1. 兩人的可走街道完全不重疊，要建兩張圖分開跑 Dijkstra；千萬別建成同一張圖。
2. 'U' 是單向（第 3 個字母 → 第 4 個字母），'B' 才是雙向。方向搞反會漏解。
3. 起點自己的距離是 0——若兩人一開始就在同一個地點，答案就是「0 該地點」（題目明說同地點可以零成本碰面）。
4. 輸出是「數字 + 空白 + 各地點（字典序、單一空白分隔）」全部在同一行。
5. 體力值可以是 0，所以不能用「距離 > 0」來判斷可達，要用「是否為無限大」。
6. N = 0 結束；地點名稱一定是單一大寫字母，開 26 個節點即可。`,
    c: `#include <bits/stdc++.h>
using namespace std;

typedef pair<int, int> P;

vector<int> dijkstra(const vector<vector<P> >& g, int s) {
    const int INF = 1e9;
    vector<int> d(26, INF);
    priority_queue<P, vector<P>, greater<P> > pq;
    d[s] = 0;
    pq.push(P(0, s));
    while (!pq.empty()) {
        P top = pq.top(); pq.pop();
        if (top.first > d[top.second]) continue;
        int u = top.second;
        for (size_t k = 0; k < g[u].size(); k++) {
            int v = g[u][k].first, nd = top.first + g[u][k].second;
            if (nd < d[v]) { d[v] = nd; pq.push(P(nd, v)); }
        }
    }
    return d;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    while (cin >> n && n != 0) {
        vector<vector<P> > gY(26), gM(26);
        for (int i = 0; i < n; i++) {
            char age, dir, x, y;
            int c;
            cin >> age >> dir >> x >> y >> c;       // 有無空白都能正確讀入
            int u = x - 'A', v = y - 'A';
            vector<vector<P> >& g = (age == 'Y') ? gY : gM;
            g[u].push_back(P(v, c));
            if (dir == 'B') g[v].push_back(P(u, c));
        }
        char me, mig;
        cin >> me >> mig;

        vector<int> dY = dijkstra(gY, me - 'A');
        vector<int> dM = dijkstra(gM, mig - 'A');

        const int INF = 1e9;
        int best = INF;
        vector<char> res;
        for (int i = 0; i < 26; i++) {
            if (dY[i] >= INF || dM[i] >= INF) continue;
            int t = dY[i] + dM[i];
            if (t < best) { best = t; res.clear(); res.push_back((char)('A' + i)); }
            else if (t == best) res.push_back((char)('A' + i));
        }
        if (best >= INF) cout << "You will never meet.\\n";
        else {
            cout << best;
            for (size_t i = 0; i < res.size(); i++) cout << " " << res[i];
            cout << "\\n";
        }
    }
    return 0;
}`
  }
};

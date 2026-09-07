/* 第五十八批 —— pdftotext 重抽題敘後補回 */
const SOL98 = {
  '10187': {
    q: `吸血鬼 Vladimir 想旅行，但有三個限制：只能搭火車（要帶棺材）；只能在「黃昏到黎明」之間移動，也就是 18:00 到 6:00，白天必須待在車站裡；每天中午 12:00 要在棺材裡喝一公升血。

請幫他找出兩個城市之間的最短路線，讓他帶最少的血。

輸入：第一行是測資組數。每組先是一個數字代表接下來有幾條路線。每條路線含兩個城市名稱、從第一個城市的出發時間、以及總旅行時間（單位都是小時）。注意 Vladimir 不能搭「早於 18:00 出發」或「晚於 6:00 抵達」的班次。最多 100 個城市、少於 1000 條連線；每條路線的時間介於 1 到 24 小時（因為黃昏到黎明只有 12 小時，實際能用的最多 12 小時）。城市名稱長度小於 32。最後一行是兩個城市名稱：出發地與目的地。
輸出：每組先印測資編號，接著印「Vladimir needs # litre(s) of blood.」或「There is no route Vladimir can take.」

範例輸入
2
3
Ulm Muenchen 17 2
Ulm Muenchen 19 12
Ulm Muenchen 5 2
Ulm Muenchen
10
Lugoj Sibiu 12 6
Lugoj Sibiu 18 6
Lugoj Sibiu 24 5
Lugoj Medias 22 8
Lugoj Medias 18 8
Lugoj Reghin 17 4
Sibiu Reghin 19 9
Sibiu Medias 20 3
Reghin Medias 20 4
Reghin Bacau 24 6
Lugoj Bacau

範例輸出
Test Case 1.
There is no route Vladimir can take.
Test Case 2.
Vladimir needs 2 litre(s) of blood.`,
    h: `【第一步：篩掉不能搭的班次】
把出發時間 dep 與旅行時間 t 直接相加（不用管跨日），條件是

    dep ≥ 18   且   dep + t ≤ 30

（30 就是隔天早上 6:00。題目用 24 表示午夜，所以 24 也算 ≥ 18。）
範例第一組三條路線分別是：17 出發太早、19 出發但 19+12 = 31 太晚、5 出發太早 → 全部不能搭 ✓

【第二步：血量 = 搭車次數 − 1】
他晚上搭車、隔天早上抵達，白天待在車站，中午喝一公升；晚上再搭下一班。
所以搭 k 趟車的話，中間會經過 k − 1 個白天 → 需要 **k − 1** 公升血。
（抵達目的地的那天早上就結束了，不用再喝。）

於是要最小化血量就是最小化「搭車次數」= 在有向圖上做 **BFS 最短路（邊權都是 1）**。

【逐組驗算】（第二組我手推過）
可以搭的班次：Lugoj→Sibiu(18,6)、Lugoj→Sibiu(24,5)、Lugoj→Medias(22,8)、Lugoj→Medias(18,8)、
Sibiu→Reghin(19,9)、Sibiu→Medias(20,3)、Reghin→Medias(20,4)、Reghin→Bacau(24,6)。
（Lugoj→Sibiu 12 出發、Lugoj→Reghin 17 出發都太早，被篩掉。）
Lugoj 到 Bacau 沒有直達，也不能走 Lugoj→Reghin（那班太早），
Medias 又沒有出去的班次，所以唯一的走法是
    Lugoj → Sibiu → Reghin → Bacau，三趟車 → **3 − 1 = 2 公升** ✓ 與題目一致。`,
    t: `1. 篩選條件是「出發 ≥ 18 且 出發 + 時間 ≤ 30」。把 24 當午夜、直接用相加後的數值比較最省事，不要真的去做時鐘的模 24 運算。
2. 路線是**有向的**（從第一個城市開往第二個），別建成無向圖。範例第二組的 Reghin→Medias 與 Medias→Reghin 就不一樣。
3. 血量是「搭車次數減一」，不是次數本身。想清楚「晚上搭車、白天在車站喝血」的節奏就不會錯。
4. 出發地與目的地相同時搭 0 趟車，血量應該是 0（不要印 −1）。
5. 城市名稱要用 map 對應到編號，名稱長度可到 31。
6. 輸出的第一行是「Test Case k.」（有句點）；第二行兩種句型都要一字不差，注意 litre(s) 的括號。
7. 邊權都是 1，用 BFS 就好，不需要 Dijkstra。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    for (int tc = 1; tc <= T; tc++) {
        int m;
        cin >> m;
        map<string, int> id;
        vector<vector<int> > adj;
        for (int i = 0; i < m; i++) {
            string a, b;
            long long dep, t;
            cin >> a >> b >> dep >> t;
            if (!id.count(a)) { id[a] = (int)adj.size(); adj.push_back(vector<int>()); }
            if (!id.count(b)) { id[b] = (int)adj.size(); adj.push_back(vector<int>()); }
            if (dep < 18 || dep + t > 30) continue;        // 太早出發或太晚抵達
            adj[id[a]].push_back(id[b]);                    // 有向
        }
        string s, e;
        cin >> s >> e;
        cout << "Test Case " << tc << ".\n";
        if (!id.count(s) || !id.count(e)) {
            cout << "There is no route Vladimir can take.\n";
            continue;
        }
        int S = id[s], E = id[e];
        vector<int> dist(adj.size(), -1);
        queue<int> q;
        dist[S] = 0;
        q.push(S);
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (size_t k = 0; k < adj[u].size(); k++) {
                int v = adj[u][k];
                if (dist[v] < 0) { dist[v] = dist[u] + 1; q.push(v); }
            }
        }
        if (dist[E] < 0) cout << "There is no route Vladimir can take.\n";
        else cout << "Vladimir needs " << max(0, dist[E] - 1) << " litre(s) of blood.\n";
    }
    return 0;
}`
  },

  '10802': {
    q: `圖 G 由頂點集合 V = {0, 1, …, n−1} 與邊集合 E 組成。「walk」是一串頂點 (v₁, …, v_k)，其中每一對相鄰頂點都有邊相連。兩條 walk 可以依字典序比較（例如 (3,5,6,2,8) 小於 (3,5,6,5,7)）。

「drive」是一條不會「立刻走回頭路」的 walk：對所有 i（2 ≤ i ≤ k−1），v_{i−1} ≠ v_{i+1}。

給你圖 G 與起點 s，請對每個頂點求出「從 s 到它、字典序最小的 drive」。

輸入：第一行是測資數 N。每組先是一行三個整數 n、m、s（0 ≤ n ≤ 100，0 ≤ m ≤ 4950），接著 m 行列出各條邊。
輸出：每組先印「Case #x:」，接著印 n 行，第 i 行是從 s 到頂點 i 的字典序最小 drive，頂點之間用單一空白分隔。若不存在這樣的 drive，印「No drive.」。每組之後印一個空行。

範例輸入
2
6 4 5
5 0
2 5
4 0
3 1
4 4 0
0 1
1 2
0 2
0 3

範例輸出
Case #1:
5 0
No drive.
5 2
No drive.
5 0 4
5

Case #2:
0
0 1
0 1 2
No drive.`,
    h: `【最反直覺的一點：「不存在」不一定是因為走不到】
範例第二組的頂點 3 明明與起點 0 直接相連，答案卻是「No drive.」。原因是**沒有最小值**：
    0 3
    0 1 2 0 3      （比上面小，因為第二個頂點 1 < 3）
    0 1 2 0 1 2 0 3（又更小）
    …
可以一直繞 0→1→2→0 這個圈，每繞一圈就得到更小的 drive，永遠沒有最小者。

【正確的演算法：依字典序做 DFS，遇到環就整個停下來】
把鄰居由小到大排序後做 DFS，狀態是 **(目前頂點, 前一個頂點)**（因為 drive 只禁止「立刻回頭」）。
DFS 的前序走訪順序剛好就是所有 drive 的字典序，所以

    **第一次踏到某個頂點時，當下的路徑就是它的答案。**

而環的偵測是關鍵：若下一步的狀態**正在目前的路徑上**，代表可以繞圈，
於是從這裡開始（以及所有字典序更大的走法）都不存在最小值 → **立刻中止整個 DFS**，
還沒記錄到的頂點全部輸出「No drive.」。
（若下一步的狀態是「已經探索完畢」的狀態，那不是環，只要剪掉這一支即可——
因為從那個狀態能到的頂點，早就在更小的路徑上被記錄過了。）

【逐組驗算】（兩組範例我都跑過，六行與四行全中）
  第 1 組：起點 5。DFS：5 →（鄰居 0, 2 取 0）→ 0 →（鄰居 4, 5，排除前一個 5）→ 4 →
      4 的鄰居只有 0，被排除 → 死路，回溯。回到 5 試 2 → 「5 2」。
      過程中沒有偵測到環，所以 0、2、4、5 都有答案，1 與 3 不連通 → No drive. ✓
  第 2 組：起點 0。0 → 1 → 2 → 0（狀態 (0,2)）→ 想走 1，但狀態 (1,0) 正在路徑上 → **偵測到環，中止**。
      此時 0、1、2 已記錄，3 還沒 → No drive. ✓

【複雜度】狀態只有 n² = 10000 個，每個最多展開 n 個鄰居 → 10⁶，非常快。`,
    t: `1. 「No drive.」有兩種原因：真的走不到，以及**存在無窮遞減鏈所以沒有最小值**。第二組的頂點 3 就是後者，只看連通性會答錯。
2. 狀態要用 (目前頂點, 前一個頂點)，因為 drive 的限制是「不能立刻回頭」而不是「不能重複頂點」。
3. 環的判定要看「狀態是否在目前的 DFS 路徑上」，不是「是否曾經拜訪過」。已經探索完畢的狀態只要剪枝，不能中止全域。
4. 偵測到環之後要中止**整個** DFS，因為之後的走法字典序都更大、都可以被「先繞幾圈」的走法比下去。
5. 鄰居要由小到大排序後才走，這樣 DFS 前序就是字典序。
6. 邊是無向的，而且可能有重邊或自環，用 set 去重比較安全。
7. 起點自己的答案就是單一個頂點 s；輸出每組之後要空一行。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int n_;
vector<vector<int> > A_;
vector<vector<int> > ans_;
vector<int> path_;
vector<char> onPath_, done_;
bool abort_;

void dfs(int u, int p) {
    if (abort_) return;
    int key = u * 101 + (p + 1);
    path_.push_back(u);
    onPath_[key] = 1;
    if (ans_[u].empty()) ans_[u] = path_;          // 第一次踏到 = 字典序最小
    for (size_t i = 0; i < A_[u].size(); i++) {
        int v = A_[u][i];
        if (v == p) continue;                       // drive：不能立刻回頭
        int k2 = v * 101 + (u + 1);
        if (onPath_[k2]) { abort_ = true; break; }  // 狀態在路徑上 -> 有環，全部中止
        if (done_[k2]) continue;                    // 已探索完，剪枝即可
        dfs(v, u);
        if (abort_) break;
    }
    onPath_[key] = 0;
    done_[key] = 1;
    path_.pop_back();
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    for (int tc = 1; tc <= T; tc++) {
        int m, s;
        cin >> n_ >> m >> s;
        vector<set<int> > g(n_);
        for (int i = 0; i < m; i++) {
            int a, b;
            cin >> a >> b;
            if (a == b) continue;
            g[a].insert(b);
            g[b].insert(a);
        }
        A_.assign(n_, vector<int>());
        for (int i = 0; i < n_; i++) A_[i].assign(g[i].begin(), g[i].end());  // 已排序

        ans_.assign(n_, vector<int>());
        onPath_.assign(n_ * 101 + 105, 0);
        done_.assign(n_ * 101 + 105, 0);
        path_.clear();
        abort_ = false;
        if (n_ > 0) dfs(s, -1);

        cout << "Case #" << tc << ":\n";
        for (int i = 0; i < n_; i++) {
            if (ans_[i].empty()) { cout << "No drive.\n"; continue; }
            for (size_t k = 0; k < ans_[i].size(); k++)
                cout << (k ? " " : "") << ans_[i][k];
            cout << "\n";
        }
        cout << "\n";
    }
    return 0;
}`
  }
};

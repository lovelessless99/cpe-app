/* 歷屆補完（第九批 6 題） */
const SOL16 = {
11336: {
  q: "DRM 地圖：地圖 = 一堆地點 + 一堆雙向街道。地圖 B 比 A <b>更詳細</b>的定義是：<br>① B 至少包含 A 的所有地點；<br>② A 的<b>每一條街道 (u, v)</b>，在 B 裡都存在一條 u 到 v 的路徑，且<b>路徑上的中繼點全部都是新地點</b>（不在 A 裡）。<br>判斷第二張圖是否比第一張更詳細。",
  h: "看起來像圖同構之類的難題，其實條件②可以<b>逐條街道獨立驗證</b>：<br>對 A 的每條街 (u, v)，在 B 上從 u 做 BFS，但<b>只允許從「新地點」繼續往外擴展</b>——起點 u 可以擴展，其他 A 的地點一旦踩到就只能當終點、不能再往前走。若能碰到 v 就通過。<br>這正好把「中繼點必須全是新地點」翻譯成一個受限 BFS，完全不用列舉路徑。<br>複雜度 O(|A 的街道數| × |B|)。",
  t: "① 條件②的「中繼點」<b>不含頭尾</b>——u、v 本來就是舊地點，只有中間不能是舊的。<br>② 別忘了條件①：A 出現過的地點<b>每一個</b>都要出現在 B 裡。<br>③ 地點是<b>字串</b>，用 <code>map&lt;string,int&gt;</code> 編號；樣例裡故意放了拼錯的 <code>Barrranquilla</code>（三個 r），它是<b>另一個新地點</b>，不是筆誤。<br>④ 街道兩端的順序可任意，且保證不重複。<br>⑤ 每張地圖以 <code>* * *</code> 結束，整份輸入以 <code>END</code> 結束；用 <code>getline</code> 讀。<br>⑥ 輸出的 YES / NO 句子要<b>一字不差</b>（注意 NO 那句多一個 not）。",
  c: `#include <bits/stdc++.h>
using namespace std;

struct Map_ {
    string id;
    map<string, int> id_of;
    vector<vector<int> > adj;
    vector<pair<int, int> > edges;
    int get(const string &s) {
        map<string, int>::iterator it = id_of.find(s);
        if (it != id_of.end()) return it->second;
        int k = id_of.size();
        id_of[s] = k;
        adj.push_back(vector<int>());
        return k;
    }
    void addEdge(const string &a, const string &b) {
        int u = get(a), v = get(b);
        adj[u].push_back(v); adj[v].push_back(u);
        edges.push_back(make_pair(u, v));
    }
};

// 讀一張地圖；回傳 false 表示碰到 END
bool readMap(Map_ &m) {
    string line;
    if (!getline(cin, line)) return false;
    while (line.empty()) { if (!getline(cin, line)) return false; }
    if (line == "END") return false;
    m.id = line;
    while (getline(cin, line)) {
        if (line.substr(0, 5) == "* * *") break;
        istringstream is(line);
        string a, b;
        if (is >> a >> b) m.addEdge(a, b);
    }
    return true;
}

int main() {
    while (true) {
        Map_ A, B;
        if (!readMap(A)) break;
        if (!readMap(B)) break;

        bool ok = true;
        // 條件①：A 的地點都要在 B 裡
        vector<int> mapAtoB(A.id_of.size(), -1);
        for (map<string, int>::iterator it = A.id_of.begin(); it != A.id_of.end(); ++it) {
            map<string, int>::iterator jt = B.id_of.find(it->first);
            if (jt == B.id_of.end()) { ok = false; break; }
            mapAtoB[it->second] = jt->second;
        }
        // oldInB[x] = B 的節點 x 是不是「A 也有的舊地點」
        vector<char> oldInB(B.id_of.size(), 0);
        if (ok) for (size_t i = 0; i < mapAtoB.size(); i++) oldInB[mapAtoB[i]] = 1;

        // 條件②：A 的每條街，在 B 裡都有一條「中繼點全新」的路徑
        for (size_t e = 0; e < A.edges.size() && ok; e++) {
            int s = mapAtoB[A.edges[e].first], t = mapAtoB[A.edges[e].second];
            vector<char> vis(B.id_of.size(), 0);
            queue<int> q; q.push(s); vis[s] = 1;
            bool reach = false;
            while (!q.empty() && !reach) {
                int u = q.front(); q.pop();
                // 只有起點與「新地點」可以繼續往外走
                if (u != s && oldInB[u]) continue;
                for (size_t i = 0; i < B.adj[u].size(); i++) {
                    int v = B.adj[u][i];
                    if (v == t) { reach = true; break; }
                    if (!vis[v]) { vis[v] = 1; q.push(v); }
                }
            }
            if (!reach) ok = false;
        }

        if (ok) cout << "YES: " << B.id << " is a more detailed version of " << A.id << "\\n";
        else    cout << "NO: "  << B.id << " is not a more detailed version of " << A.id << "\\n";
    }
    return 0;
}`
},

12882: {
  q: "城市公園：<code>N ≤ 50000</code> 塊<b>互不重疊</b>的軸平行矩形石板。互相<b>接觸</b>的石板構成一片「石面」，求<b>面積最大的那片石面</b>的面積。",
  h: "本質是<b>連通分量</b>，難點在「怎麼在 N = 5 萬時找出所有相鄰的石板對」。<br>暴力兩兩比對是 O(N²) = 25 億。關鍵觀察：<b>兩塊石板要接觸，一定共用一條格線</b>。<br>・<b>垂直接觸</b>：A 的右邊界 x 等於 B 的左邊界 x，且 y 區間相交。<br>・<b>水平接觸</b>：A 的上邊界 y 等於 B 的下邊界 y，且 x 區間相交。<br>於是把「右邊界」與「左邊界」依 x 分組；<b>因為石板互不重疊，同一條 x 上的右邊界彼此不相交、左邊界彼此也不相交</b>——兩組互不相交的區間求交集，用<b>雙指標一次掃描</b>即可，配對數是 O(a + b) 而非 O(ab)！<br>找到相鄰就 <b>DSU 合併</b>，最後統計每個分量的面積總和。整體 O(N log N)。",
  t: "① <b>角對角接觸也算相連</b>！樣例的石板 3 與 4 只在點 (5, 9) 碰到，仍被算成同一片（面積 16）。所以區間相交要用<b>閉區間</b>（允許長度 0）。<br>② 一定要利用「互不重疊 ⇒ 同一條線上的區間彼此不交」這個性質，否則雙指標會漏配對。<br>③ 座標可能是負的、可達 32 位元邊緣，用 <code>long long</code> 累加面積。<br>④ 別忘了同時做<b>水平</b>與<b>垂直</b>兩個方向的掃描。<br>⑤ 每筆測資都要重建 DSU 與 map。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

vector<int> par;
int find_(int x) { while (par[x] != x) x = par[x] = par[par[x]]; return x; }
void uni(int a, int b) { a = find_(a); b = find_(b); if (a != b) par[a] = b; }

// 兩組「彼此不相交」的閉區間，雙指標找出所有相交的配對並合併
void sweep(vector<pair<pair<int, int>, int> > &A, vector<pair<pair<int, int>, int> > &B) {
    sort(A.begin(), A.end());
    sort(B.begin(), B.end());
    size_t i = 0, j = 0;
    while (i < A.size() && j < B.size()) {
        int a1 = A[i].first.first, a2 = A[i].first.second;
        int b1 = B[j].first.first, b2 = B[j].first.second;
        if (a2 < b1) { i++; continue; }
        if (b2 < a1) { j++; continue; }
        uni(A[i].second, B[j].second);          // 閉區間相交（含只碰到端點）
        if (a2 < b2) i++; else j++;
    }
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n;
    while (cin >> n) {
        vector<int> X(n), Y(n), W(n), H(n);
        for (int i = 0; i < n; i++) cin >> X[i] >> Y[i] >> W[i] >> H[i];
        par.resize(n);
        for (int i = 0; i < n; i++) par[i] = i;

        // 垂直接觸：某石板的右邊界 x == 另一石板的左邊界 x
        map<int, vector<pair<pair<int, int>, int> > > R, L;
        // 水平接觸：某石板的上邊界 y == 另一石板的下邊界 y
        map<int, vector<pair<pair<int, int>, int> > > U, D;
        for (int i = 0; i < n; i++) {
            R[X[i] + W[i]].push_back(make_pair(make_pair(Y[i], Y[i] + H[i]), i));
            L[X[i]].push_back(make_pair(make_pair(Y[i], Y[i] + H[i]), i));
            U[Y[i] + H[i]].push_back(make_pair(make_pair(X[i], X[i] + W[i]), i));
            D[Y[i]].push_back(make_pair(make_pair(X[i], X[i] + W[i]), i));
        }
        for (map<int, vector<pair<pair<int, int>, int> > >::iterator it = R.begin(); it != R.end(); ++it)
            if (L.count(it->first)) sweep(it->second, L[it->first]);
        for (map<int, vector<pair<pair<int, int>, int> > >::iterator it = U.begin(); it != U.end(); ++it)
            if (D.count(it->first)) sweep(it->second, D[it->first]);

        vector<ll> area(n, 0);
        for (int i = 0; i < n; i++) area[find_(i)] += (ll)W[i] * H[i];
        ll best = 0;
        for (int i = 0; i < n; i++) best = max(best, area[i]);
        cout << best << "\\n";
    }
    return 0;
}`
},

1234: {
  q: "RACING：無向連通道路網，每條路裝一台監視器有各自的成本。要讓<b>每一個環（賽車路線）上至少有一台監視器</b>，求最小總成本。",
  h: "「每個環上都要有一條被選中的邊」= 「<b>沒被選中的邊構成的圖必須無環</b>」= 沒被選中的邊構成一片<b>森林</b>。<br>要讓被選中的成本最小 ⟺ 讓<b>沒被選中的成本最大</b> ⟺ 保留一棵<b>最大生成森林</b>！<br><code>答案 = 所有邊成本總和 − 最大生成森林的成本</code><br>最大生成森林就是 Kruskal 由<b>大到小</b>排序後加邊（不成環就加）。<br>m ≤ 10⁵ ⇒ O(m log m)，輕鬆。<br>樣例驗證：總和 27，最大生成樹 5 + 5 + 4 + 4 + 3 = 21 ⇒ 27 − 21 = <b>6</b> ✓。",
  t: "① 這是「<b>最小回饋邊集合</b>」的經典轉換，看穿它整題就只剩一個 Kruskal。<br>② Kruskal 要<b>由大到小</b>排（最大生成樹），寫成遞增就完全相反了。<br>③ 圖題目說是連通的，但寫成<b>森林</b>版本（不假設連通）更保險。<br>④ 成本總和最多 10⁵ × 1000 = 10⁸，用 <code>long long</code>。<br>⑤ 第一行是資料組數，最後那行 <code>0</code> 直接忽略。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

vector<int> par;
int find_(int x) { while (par[x] != x) x = par[x] = par[par[x]]; return x; }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n, m; cin >> n >> m;
        vector<pair<int, pair<int, int> > > e(m);
        ll total = 0;
        for (int i = 0; i < m; i++) {
            int u, v, c; cin >> u >> v >> c;
            e[i] = make_pair(c, make_pair(u, v));
            total += c;
        }
        sort(e.rbegin(), e.rend());             // 由大到小 → 最大生成森林

        par.assign(n + 1, 0);
        for (int i = 0; i <= n; i++) par[i] = i;
        ll keep = 0;
        for (int i = 0; i < m; i++) {
            int a = find_(e[i].second.first), b = find_(e[i].second.second);
            if (a == b) continue;               // 會成環 → 這條要裝監視器
            par[a] = b;
            keep += e[i].first;
        }
        cout << total - keep << "\\n";
    }
    return 0;
}`
},

1371: {
  q: "近似週期：把長字串 <code>y</code>（≤ 5000）切成若干段非空子字串，若<b>每一段</b>與短字串 <code>x</code>（≤ 50）的<b>編輯距離都 ≤ k</b>，就說 x 是 y 的 k-近似週期。求最小的 k。",
  h: "<b>對答案二分搜 + 可行性 DP</b>。<br>k 的上界是 |x| ≤ 50（每段切成 1 個字元時，編輯距離 ≤ |x|），所以二分範圍只有 [0, 50]，最多 6 次判定。<br><b>判定 k 是否可行</b>：<code>reach[i]</code> = 前 i 個字元能否合法切完。<code>reach[0] = true</code>，若 <code>reach[j]</code> 為真且 <code>editDist(x, y[j..i)) ≤ k</code> 則 <code>reach[i] = true</code>。<br><b>關鍵剪枝</b>：編輯距離至少是長度差，所以只有長度落在 <code>[|x| − k, |x| + k]</code> 的段才可能合格 ⇒ 每個起點 j 只需往後看 <b>2k + 1 ≤ 101</b> 個位置。<br>對每個起點 j 用滾動的編輯距離 DP 逐欄推進即可，單次判定 O(|y| × |x| × (|x| + k)) ≈ 2500 萬。",
  t: "① 直接對所有子字串算編輯距離是 O(|y|²|x|) = 12 億，<b>長度剪枝是能不能過的關鍵</b>。<br>② 二分搜是合法的：k 越大限制越鬆，可行性<b>單調</b>。<br>③ 段數 ≥ 1（整個 y 當成一段也算合法切法）。<br>④ 編輯距離的 DP 是「x 轉成子字串」，三種操作皆代價 1。<br>⑤ 只從<b>可達</b>的起點 j 往外推，可再省掉大量無用計算。",
  c: `#include <bits/stdc++.h>
using namespace std;

string x, y;

// 檢查：能否把 y 切成若干段，每段與 x 的編輯距離都 <= k
bool feasible(int k) {
    int n = y.size(), m = x.size();
    int maxLen = m + k;                             // 超過這個長度必定 > k
    int minLen = max(1, m - k);
    vector<char> reach(n + 1, 0);
    reach[0] = 1;
    vector<int> prev_(m + 1), cur(m + 1);
    for (int j = 0; j < n; j++) {
        if (!reach[j]) continue;
        for (int i = 0; i <= m; i++) prev_[i] = i;  // 子字串長度 0：需刪掉 x 的 i 個字元
        for (int len = 1; len <= maxLen && j + len <= n; len++) {
            char c = y[j + len - 1];
            cur[0] = len;
            for (int i = 1; i <= m; i++) {
                int best = min(prev_[i] + 1, cur[i - 1] + 1);       // 插入 / 刪除
                best = min(best, prev_[i - 1] + (x[i - 1] == c ? 0 : 1));
                cur[i] = best;
            }
            if (len >= minLen && cur[m] <= k) reach[j + len] = 1;
            prev_ = cur;
        }
    }
    return reach[n] != 0;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        cin >> x >> y;
        int lo = 0, hi = x.size();                  // 每段切成 1 字元時距離 <= |x|
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (feasible(mid)) hi = mid; else lo = mid + 1;
        }
        cout << lo << "\\n";
    }
    return 0;
}`
},

1657: {
  q: "數學家遊戲：主持人選兩個<b>相異</b>整數 a、b（1..n），把<b>和</b>告訴玩家 A、<b>積</b>告訴玩家 B。兩人輪流（A 先）說「我不知道這兩個數」。給 n 與「我不知道」被說出的<b>總次數 k</b>，求所有仍然可能的數對。",
  h: "經典的<b>共同知識逐輪淘汰</b>：把所有數對放進候選集合，每一輪依照發言者的資訊淘汰。<br>「我<b>不</b>知道」代表：以他手上的鍵值（和 or 積）去查，<b>目前候選集合中有 ≥ 2 對</b>符合。<br>⇒ 每一輪把「鍵值在候選集合中<b>唯一</b>」的數對全部刪掉（因為那些情況下他就會知道了）。<br>第 1、3、5... 輪看<b>和</b>，第 2、4、6... 輪看<b>積</b>。跑滿 k 輪後剩下的就是答案。<br>數對數 ≤ 200 × 199 / 2 ≈ 2 萬，k ≤ 100 ⇒ 200 萬次操作。",
  t: "① <b>「不知道」提供的是負面資訊</b>——它淘汰的是「本來就會知道」的那些情況，這是所有此類謎題的核心。<br>② 淘汰必須<b>整輪一起做</b>：先統計本輪所有鍵值的出現次數，再一次刪除，不能邊統計邊刪。<br>③ 兩數<b>相異</b>（a &lt; b），別把 (a, a) 算進去。<br>④ 輪流順序是<b>和先積後</b>。<br>⑤ 先輸出剩餘數對的<b>個數</b>，再一行一對。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, k;
    while (cin >> n >> k) {
        vector<pair<int, int> > cand;
        for (int a = 1; a <= n; a++)
            for (int b = a + 1; b <= n; b++) cand.push_back(make_pair(a, b));

        for (int round = 1; round <= k; round++) {
            bool bySum = (round % 2 == 1);          // 奇數輪：知道「和」的人發言
            map<int, int> cnt;
            for (size_t i = 0; i < cand.size(); i++) {
                int key = bySum ? cand[i].first + cand[i].second
                                : cand[i].first * cand[i].second;
                cnt[key]++;
            }
            vector<pair<int, int> > nxt;
            for (size_t i = 0; i < cand.size(); i++) {
                int key = bySum ? cand[i].first + cand[i].second
                                : cand[i].first * cand[i].second;
                if (cnt[key] >= 2) nxt.push_back(cand[i]);   // 唯一 → 他就知道了 → 淘汰
            }
            cand.swap(nxt);
        }

        cout << cand.size() << "\\n";
        for (size_t i = 0; i < cand.size(); i++)
            cout << cand[i].first << " " << cand[i].second << "\\n";
    }
    return 0;
}`
},

240: {
  q: "可變基數霍夫曼編碼：把 n 個來源符號（A..Z 的前 n 個，各有頻率）編成 <b>r 進位</b>（0..r−1）的霍夫曼碼。輸出平均碼長（四捨五入到小數點後兩位）與每個字母的碼。",
  h: "r 元霍夫曼，三個關鍵細節：<br><b>① 補虛擬符號</b>：每次合併把 r 個節點變 1 個，所以符號數必須滿足 <code>(count − 1) % (r − 1) == 0</code>；不足就補<b>頻率為 0 的虛擬符號</b>（不輸出）。<br><b>② 排序與併結規則</b>：每回合取<b>頻率最小的 r 個</b>；頻率相同時取<b>字母序較前</b>的；<b>合併節點的「字母值」取其成員中最前的字母</b>；虛擬符號排在所有字母之後。<br><b>③ 數字指派</b>：組內依 (頻率, 字母值) 由小到大指派 0, 1, …, r−1；每個葉子的最終碼是<b>把歷次拿到的數字反過來串接</b>（最後指派的排最前面）。<br>實作上每個節點記住底下有哪些葉子，合併時把數字 append 到每個葉子的字串，最後整串 reverse。",
  t: "① <b>「反過來串接」</b>是最容易錯的地方——先被指派的數字排在碼的<b>後面</b>。<br>② 補虛擬符號的條件是 <code>(count − 1) % (r − 1) == 0</code>，r = 2 時永遠成立（不用補）。<br>③ 平手比較用的是<b>字母值</b>，而合併節點的字母值 = 成員中最早的字母；虛擬符號視為比 Z 更後面。<br>④ 平均碼長是 <code>Σ(頻率 × 碼長) / Σ頻率</code>，四捨五入到 2 位。<br>⑤ 虛擬符號<b>不能出現在輸出</b>。<br>⑥ 每筆測資後面要空一行；<code>r = 0</code> 結束。<br>（本解已用題目全部 4 組樣例逐步驗算，碼與平均長度皆吻合。）",
  c: `#include <bits/stdc++.h>
using namespace std;

struct Node {
    int freq;
    int val;                        // 字母值：實際字母 0..25，虛擬符號 1000+
    vector<int> leaves;             // 底下所有真實葉子的索引
};

bool cmpNode(const Node &a, const Node &b) {
    if (a.freq != b.freq) return a.freq < b.freq;
    return a.val < b.val;           // 平手取字母序較前者
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int r, n, cs = 1;
    while (cin >> r && r) {
        cin >> n;
        vector<int> f(n);
        long long tot = 0;
        for (int i = 0; i < n; i++) { cin >> f[i]; tot += f[i]; }

        vector<Node> pool;
        for (int i = 0; i < n; i++) {
            Node nd; nd.freq = f[i]; nd.val = i; nd.leaves.push_back(i);
            pool.push_back(nd);
        }
        // 補虛擬符號直到 (count - 1) % (r - 1) == 0
        int fake = 0;
        while ((int)(pool.size() - 1) % (r - 1) != 0) {
            Node nd; nd.freq = 0; nd.val = 1000 + fake++;
            pool.push_back(nd);
        }

        vector<string> code(n);
        while (pool.size() > 1) {
            sort(pool.begin(), pool.end(), cmpNode);
            Node nd; nd.freq = 0; nd.val = INT_MAX;
            for (int d = 0; d < r; d++) {                   // 已排序 → 直接指派 0..r-1
                Node &c = pool[d];
                nd.freq += c.freq;
                nd.val = min(nd.val, c.val);
                for (size_t i = 0; i < c.leaves.size(); i++) {
                    code[c.leaves[i]] += char('0' + d);
                    nd.leaves.push_back(c.leaves[i]);
                }
            }
            pool.erase(pool.begin(), pool.begin() + r);
            pool.push_back(nd);
        }

        long long sum = 0;
        for (int i = 0; i < n; i++) {
            reverse(code[i].begin(), code[i].end());        // 最後指派的排最前面
            sum += (long long)f[i] * code[i].size();
        }
        cout << "Set " << cs++ << "; average length "
             << fixed << setprecision(2) << (double)sum / tot << "\\n";
        for (int i = 0; i < n; i++)
            cout << char('A' + i) << ": " << code[i] << "\\n";
        cout << "\\n";
    }
    return 0;
}`
}
};

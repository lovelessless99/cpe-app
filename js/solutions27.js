/* 二星題庫（第十批 8 題） */
const SOL27 = {
10172: {
  q: "貨運分配：n 個貨站排成<b>環狀</b>，每站有一個<b>佇列</b>（月台 B，容量 Q）裝著要送往別站的貨物。一台容量 C 的搬運車依序繞環，在每站先<b>卸貨</b>再<b>裝貨</b>：<br>卸貨時<b>從堆疊頂端</b>逐一檢查——目的地就是本站就卸下（1 分鐘），否則塞進本站佇列尾端（1 分鐘），<b>佇列滿了就停止卸貨</b>；裝貨則從佇列前端搬到堆疊頂端直到佇列空或堆疊滿（每件 1 分鐘）。站間移動 2 分鐘。求全部送達要幾分鐘。",
  h: "純模擬，但<b>規則的順序與中斷條件必須一字不差</b>：<br>① <b>卸貨是「堆疊」語意</b>——只能看最上面那件，一旦卡住（佇列滿且目的地不是本站）就<b>整個卸貨階段結束</b>，不能跳過去看下面的。<br>② 裝貨是「佇列」語意，從前端取。<br>③ 計時：卸 1 分、裝 1 分、移動 2 分。<br>④ <b>結束時機是「最後一件貨卸到目的地的那一刻」</b>，之後的裝貨與移動都不算。<br>用 <code>vector</code> 當堆疊、<code>queue</code> 當佇列，維護「尚未送達的件數」，歸零就立刻輸出時間並跳出。",
  t: "① <b>卸貨遇到卡住要立刻中止</b>，這是最容易寫錯的地方（不能繼續往下找可以卸的）。<br>② 結束時間<b>不含</b>最後一次移動；判斷要放在「卸下一件成功」之後立即檢查。<br>③ 佇列容量 Q 是<b>每一站都一樣</b>。<br>④ 車子從 <b>1 號站</b>出發、空堆疊、時間 0。<br>⑤ 樣例可完整驗算：n=5, C=2, Q=3 的資料逐步跑完正好 <b>72</b> 分鐘（本解已手動驗算過整條時間軸）。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n, C, Q; cin >> n >> C >> Q;
        vector<queue<int> > plat(n + 1);
        int remain = 0;
        for (int i = 1; i <= n; i++) {
            int k; cin >> k;
            for (int j = 0; j < k; j++) { int d; cin >> d; plat[i].push(d); }
            remain += k;
        }

        vector<int> stk;                                // 搬運車的堆疊
        long long time_ = 0;
        int cur = 1;
        while (remain > 0) {
            // 卸貨：只看堆疊頂端，卡住就整段結束
            while (!stk.empty()) {
                int top = stk.back();
                if (top == cur) {                       // 到站，卸到月台 A
                    stk.pop_back(); time_++; remain--;
                    if (remain == 0) break;
                } else if ((int)plat[cur].size() < Q) { // 轉塞進本站佇列
                    stk.pop_back(); plat[cur].push(top); time_++;
                } else break;                           // 佇列滿 → 停止卸貨
            }
            if (remain == 0) break;
            // 裝貨：從佇列前端搬上堆疊
            while (!plat[cur].empty() && (int)stk.size() < C) {
                stk.push_back(plat[cur].front());
                plat[cur].pop();
                time_++;
            }
            time_ += 2;                                 // 移動到下一站
            cur = cur % n + 1;
        }
        cout << time_ << "\\n";
    }
    return 0;
}`
},

12160: {
  q: "Unlock the Lock：四位數密碼鎖目前顯示 L，要變成 U。有 n 個按鈕，按下第 i 個會讓目前數值<b>加上 <code>bᵢ</code> 並對 10000 取模</b>。求最少按幾次；辦不到輸出 <code>Permanently Locked</code>。",
  h: "狀態只有 <b>0000..9999 共 10000 種</b>、每個狀態最多 10 種轉移、每步成本都是 1 ⇒ 標準的 <b>BFS 最短路</b>。<br>從 L 出發，<code>next = (cur + bᵢ) % 10000</code>，第一次抵達 U 時的層數就是答案；BFS 跑完仍未抵達就是 <code>Permanently Locked</code>。<br>複雜度 O(10000 × n)，每筆測資瞬殺。<br><b>「狀態數有限 + 每步成本相同」就是 BFS</b>——這題是把它從網格搬到「數值狀態」的漂亮範例。",
  t: "① 是<b>模 10000 的整數加法</b>，不是每個數字位獨立進位。<br>② <code>L == U</code> 時答案是 <b>0</b>（不用按）。<br>③ 每筆測資都要重置 <code>dist</code> 陣列。<br>④ 輸出格式 <code>Case k: X</code> 或 <code>Case k: Permanently Locked</code>。<br>⑤ <code>0 0 0</code> 結束；注意這一行不要當成 <code>L=0, U=0</code> 的測資處理。<br>⑥ 驗算樣例：只有按鈕 1000 時，0000 永遠只能停在千位變化 ⇒ 到不了 9999 ✓。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int L, U, n, cs = 1;
    while (cin >> L >> U >> n && (L || U || n)) {
        vector<int> b(n);
        for (int i = 0; i < n; i++) cin >> b[i];

        vector<int> dist(10000, -1);
        queue<int> q; q.push(L); dist[L] = 0;
        while (!q.empty()) {
            int x = q.front(); q.pop();
            if (x == U) break;
            for (int i = 0; i < n; i++) {
                int y = (x + b[i]) % 10000;
                if (dist[y] == -1) { dist[y] = dist[x] + 1; q.push(y); }
            }
        }
        cout << "Case " << cs++ << ": ";
        if (dist[U] < 0) cout << "Permanently Locked\\n";
        else cout << dist[U] << "\\n";
    }
    return 0;
}`
},

11616: {
  q: "Roman Numerals：每行給一個<b>阿拉伯數字或羅馬數字</b>（&lt; 4000），互相轉換後輸出。",
  h: "兩個方向各一個模板，都值得背：<br><b>阿拉伯 → 羅馬</b>：把 13 組數值與符號<b>由大到小</b>列成表（含 900 = CM、400 = CD、90 = XC、40 = XL、9 = IX、4 = IV 這六個<b>減法形式</b>），然後貪心地能減就減、同時輸出符號。<br><b>羅馬 → 阿拉伯</b>：從左往右掃，<b>若目前符號的值小於右邊那個，就減；否則就加</b>（這一條規則就完整處理了所有減法形式）。<br>判斷輸入是哪一種：看<b>第一個字元是不是數字</b>即可。",
  t: "① <b>減法形式一定要放進表裡</b>（CM、CD、XC、XL、IX、IV），否則 942 會輸出成 <code>DCCCCXXXXII</code> 之類的錯誤形式。<br>② 表要<b>由大到小</b>排，貪心才正確。<br>③ 羅馬轉阿拉伯的「小於右邊就減」規則<b>不需要特別列舉</b>六種減法形式。<br>④ n &lt; 4000 ⇒ 最多 MMM，不會用到上劃線表示法。<br>⑤ 讀到 EOF 結束；用 <code>isdigit(s[0])</code> 判斷方向。",
  c: `#include <bits/stdc++.h>
using namespace std;

int val(char c) {
    switch (c) {
        case 'I': return 1;    case 'V': return 5;
        case 'X': return 10;   case 'L': return 50;
        case 'C': return 100;  case 'D': return 500;
        case 'M': return 1000;
    }
    return 0;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int v[] = {1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1};
    const char *s[] = {"M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"};

    string t;
    while (cin >> t) {
        if (isdigit((unsigned char)t[0])) {                 // 阿拉伯 → 羅馬
            int n = atoi(t.c_str());
            string r;
            for (int i = 0; i < 13; i++)
                while (n >= v[i]) { r += s[i]; n -= v[i]; }  // 由大到小貪心
            cout << r << "\\n";
        } else {                                            // 羅馬 → 阿拉伯
            int n = 0;
            for (size_t i = 0; i < t.size(); i++) {
                if (i + 1 < t.size() && val(t[i]) < val(t[i + 1])) n -= val(t[i]);
                else n += val(t[i]);                        // 小於右邊就減
            }
            cout << n << "\\n";
        }
    }
    return 0;
}`
},

10227: {
  q: "Forests：P 位學生、T 棵樹，給出「某學生聽到某棵樹倒下」的所有配對。兩位學生若<b>聽到的樹的集合完全相同</b>就算同一種意見。求共有幾種<b>不同的意見</b>。",
  h: "把每位學生「聽到的樹」整理成一個<b>排序後的集合</b>，再數有幾個相異集合 ⇒ 用 <code>set&lt;set&lt;int&gt; &gt;</code> 或 <code>set&lt;vector&lt;int&gt; &gt;</code> 直接去重，答案就是它的大小。<br>這是<b>「集合正規化 + 去重」</b>的最小範例（跟 11286 選課組合同一招）：只要能把「無序的東西」變成<b>唯一的標準形式</b>，去重就交給 STL 容器。<br>複雜度 O(配對數 × log)。",
  t: "① <b>沒聽到任何樹的學生也算一種意見</b>（空集合），所以要為<b>所有</b> P 位學生建立集合，不能只處理出現在配對裡的。<br>② 用 <code>set&lt;int&gt;</code> 存每位學生聽到的樹，自動排序又自動去重（同一配對可能重複出現）。<br>③ 學生與樹的編號從 1 開始。<br>④ 測資之間要<b>空一行</b>。<br>⑤ 第一行是測資數，接著有空行。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int tc = 0; tc < T; tc++) {
        int p, t; cin >> p >> t;
        vector<set<int> > heard(p + 1);                 // 每位學生聽到的樹
        int a, b;
        while (cin >> a >> b) {
            if (a == 0 && b == 0) break;
            heard[a].insert(b);
        }
        set<set<int> > opinions;
        for (int i = 1; i <= p; i++) opinions.insert(heard[i]);   // 空集合也算

        if (tc) cout << "\\n";
        cout << opinions.size() << "\\n";
    }
    return 0;
}`
},

10063: {
  q: "Knuth's Permutation：依 Knuth 的<b>插入法</b>產生排列——先取第一個字元，之後每加入一個新字元，就把它<b>插進現有每個排列的每一個位置</b>（由最前面開始）。<b>輸出順序必須完全照這個過程</b>。",
  h: "重點不是「產生所有排列」，而是<b>產生的順序</b>——所以<b>不能</b>用 <code>next_permutation</code>（那是字典序）。<br>直接照定義做<b>逐層擴展</b>：<br><code>cur = {第一個字元}</code>；對每個後續字元 c：<br>　<code>next = 對 cur 中每個字串 s、對每個位置 pos（0 到 s.size()），把 c 插進去</code><br>　<code>cur = next</code><br>最後把 cur 全部印出來。<br>驗算 <code>abc</code>：<code>a</code> → <code>ba, ab</code> → <code>cba, bca, bac, cab, acb, abc</code> ✓ 與樣例完全吻合。",
  t: "① <b>順序是本題的全部</b>：外層跑「現有排列」、內層跑「插入位置由 0 遞增」，兩層順序交換就錯。<br>② <b>不能用 <code>next_permutation</code></b>——它產生的是字典序，跟本題的順序不同。<br>③ 字元少於 10 個 ⇒ 最多 9! = 362880 個排列，直接存 vector 沒問題。<br>④ 輸入是<b>字元序列</b>（含英數），保留原始順序處理。<br>⑤ 樣例看不出測資之間有空行，本解不印；若送出後 PE，第一個該試的就是加空行。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string s;
    while (cin >> s) {
        vector<string> cur;
        cur.push_back(string(1, s[0]));
        for (size_t i = 1; i < s.size(); i++) {
            vector<string> nxt;
            for (size_t k = 0; k < cur.size(); k++)          // 外層：現有排列
                for (size_t pos = 0; pos <= cur[k].size(); pos++) {   // 內層：插入位置
                    string t = cur[k];
                    t.insert(t.begin() + pos, s[i]);
                    nxt.push_back(t);
                }
            cur.swap(nxt);
        }
        for (size_t k = 0; k < cur.size(); k++) cout << cur[k] << "\\n";
    }
    return 0;
}`
},

10301: {
  q: "Rings and Glue：平面上 n 個圓環（給圓心與半徑），兩個環若<b>圓周相交</b>就被黏在一起。求最大的連通塊裡有幾個環。",
  h: "兩件事：<b>判定相交</b> + <b>並查集</b>。<br><b>圓周相交的條件</b>（注意是「圓周」不是「圓面」）：<br><code>|r₁ − r₂| ≤ d ≤ r₁ + r₂</code>，其中 d 是圓心距。<br>・<code>d &gt; r₁ + r₂</code> ⇒ 兩圓分離<br>・<code>d &lt; |r₁ − r₂|</code> ⇒ <b>一個完全套在另一個裡面（沒碰到）</b>，也不算黏住<br>後者是本題最容易漏的條件。<br>n &lt; 100 ⇒ 兩兩檢查只有 5000 對，DSU 合併後統計最大集合大小即可。<br>驗算樣例第一組：大環 <code>(−2, 2, 3.5)</code> 與其他三個都相交 ⇒ 最大連通塊 = <b>4</b> ✓。",
  t: "① <b>「內含」不算相交</b>——必須同時檢查 <code>d ≥ |r₁ − r₂|</code>，只寫 <code>d ≤ r₁ + r₂</code> 會把套在裡面的也算進去。<br>② 比較距離時<b>用平方避免開根號</b>，可減少浮點誤差（但兩邊都要平方）。<br>③ 座標與半徑是<b>實數</b>。<br>④ 輸出要處理<b>單複數</b>：<code>1 ring.</code> vs <code>N rings.</code><br>⑤ 輸出句子 <code>The largest component contains N ring(s).</code> 要抄對。",
  c: `#include <bits/stdc++.h>
using namespace std;

vector<int> par;
int find_(int x) { while (par[x] != x) x = par[x] = par[par[x]]; return x; }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<double> x(n), y(n), r(n);
        for (int i = 0; i < n; i++) cin >> x[i] >> y[i] >> r[i];

        par.resize(n);
        for (int i = 0; i < n; i++) par[i] = i;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++) {
                double dx = x[i] - x[j], dy = y[i] - y[j];
                double d = sqrt(dx * dx + dy * dy);
                double lo = fabs(r[i] - r[j]), hi = r[i] + r[j];
                if (d <= hi + 1e-9 && d >= lo - 1e-9) {      // 內含不算相交
                    int a = find_(i), b = find_(j);
                    if (a != b) par[a] = b;
                }
            }
        vector<int> cnt(n, 0);
        int best = 0;
        for (int i = 0; i < n; i++) best = max(best, ++cnt[find_(i)]);
        cout << "The largest component contains " << best
             << (best == 1 ? " ring.\\n" : " rings.\\n");
    }
    return 0;
}`
},

10263: {
  q: "Railway：鐵路是一條<b>折線</b>（由 n 段線段組成），給一個點 M，求折線上<b>離 M 最近</b>的位置座標（各 4 位小數）。",
  h: "拆成 n 個子問題：<b>點到「線段」的最近點</b>（不是到無限長直線！）。<br>標準做法是<b>向量投影 + 夾取</b>：<br>設線段 <code>A → B</code>，令 <code>t = ((M − A) · (B − A)) / |B − A|²</code>，<br>・<code>t &lt; 0</code> ⇒ 最近點是 <b>A</b><br>・<code>t &gt; 1</code> ⇒ 最近點是 <b>B</b><br>・否則最近點是 <code>A + t(B − A)</code><br>對每一段算出最近點與距離，取全域最小。O(n)。<br>「<b>投影參數 t 夾到 [0, 1]</b>」是所有點-線段幾何題的共通模板，務必背熟。",
  t: "① <b>一定要夾取 t</b>——不夾就變成「點到無限直線」的距離，端點附近會算錯。<br>② 線段可能<b>退化成一點</b>（A = B），此時 <code>|B − A|² = 0</code> 會除以零，要特判。<br>③ 比較距離時<b>用平方</b>即可，不必開根號。<br>④ 輸出是<b>兩行</b>（x 一行、y 一行），各 4 位小數。<br>⑤ n 段折線有 <b>n + 1 個頂點</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cout << fixed << setprecision(4);
    double mx, my;
    while (cin >> mx >> my) {
        int n; cin >> n;
        vector<double> px(n + 1), py(n + 1);
        for (int i = 0; i <= n; i++) cin >> px[i] >> py[i];

        double bestD = 1e18, bx = px[0], by = py[0];
        for (int i = 0; i < n; i++) {
            double ax = px[i], ay = py[i], cx = px[i + 1], cy = py[i + 1];
            double dx = cx - ax, dy = cy - ay;
            double len2 = dx * dx + dy * dy;
            double t = 0;
            if (len2 > 1e-18) t = ((mx - ax) * dx + (my - ay) * dy) / len2;
            if (t < 0) t = 0; if (t > 1) t = 1;             // 夾到線段上
            double qx = ax + t * dx, qy = ay + t * dy;
            double d = (qx - mx) * (qx - mx) + (qy - my) * (qy - my);
            if (d < bestD) { bestD = d; bx = qx; by = qy; }
        }
        cout << bx << "\\n" << by << "\\n";
    }
    return 0;
}`
},

12207: {
  q: "That is Your Queue：全國 <code>n ≤ 10⁹</code> 位國民依編號 1..n 排隊。指令 <code>N</code> = 叫下一位（叫完排到隊尾）；<code>E x</code> = 把第 x 位<b>插到隊首</b>（緊急）。指令最多 <code>p ≤ 1000</code> 條。輸出每個 <code>N</code> 叫到誰。",
  h: "n 到 10 億，<b>不可能真的建出佇列</b>。關鍵觀察：<br><b>指令最多 p 條 ⇒ 最多只會叫到 p 個人 ⇒ 自然順序中「排在 p 名以後」的人永遠輪不到。</b><br>所以只要維護一個大小 <code>min(n, p)</code> 的 <code>deque</code>，裝著 <code>1 … min(n, p)</code> 即可：<br>・<code>N</code>：取隊首、輸出、再推回隊尾<br>・<code>E x</code>：若 x 已在 deque 中就先移除，再推到隊首；若 deque 超過上限就把隊尾丟掉（那個人反正也輪不到）<br>複雜度 O(p²)（每次線性搜尋），p ≤ 1000 ⇒ 100 萬次，綽綽有餘。<br><b>「上界由操作次數決定，而不是由資料規模決定」</b>是這類題的通用切入點。",
  t: "① <b>不要建 10⁹ 大小的容器</b>——只留 <code>min(n, p)</code> 個人就夠，這是整題的關鍵。<br>② <code>E x</code> 的 x 可能<b>本來就不在 deque 裡</b>（編號 &gt; p），仍要把他插到隊首。<br>③ 插入後若超過上限，要從<b>隊尾</b>移除以維持大小。<br>④ 編號可達 10⁹ ⇒ 用 <code>long long</code>。<br>⑤ 輸出先印 <code>Case k:</code>，之後每個 <code>N</code> 一行；<code>0 0</code> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll n; int p; int cs = 1;
    while (cin >> n >> p && (n || p)) {
        ll cap = min(n, (ll)p);
        deque<ll> dq;
        for (ll i = 1; i <= cap; i++) dq.push_back(i);      // 只留可能輪到的人

        cout << "Case " << cs++ << ":\\n";
        for (int i = 0; i < p; i++) {
            char c; cin >> c;
            if (c == 'N') {
                ll x = dq.front(); dq.pop_front();
                cout << x << "\\n";
                dq.push_back(x);                            // 叫完排到隊尾
            } else {
                ll x; cin >> x;
                for (size_t k = 0; k < dq.size(); k++)
                    if (dq[k] == x) { dq.erase(dq.begin() + k); break; }
                dq.push_front(x);
                if ((ll)dq.size() > cap) dq.pop_back();     // 超過上限就砍隊尾
            }
        }
    }
    return 0;
}`
}
};

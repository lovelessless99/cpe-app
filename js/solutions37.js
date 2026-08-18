/* 二星題庫（第二十批 5 題） */
const SOL37 = {
12705: {
  q: "Breaking Board：Hector 用一塊 <code>6 × 6</code> 的字元板（36 格：26 個字母 + 10 個數字）打字，選一個字元的代價是<b>它的列號 + 行號</b>（左上角是 (1,1)），空白免費。<b>板子可以任意重排</b>，求打完整句話的<b>最小總代價</b>。",
  h: "重排板子 ⟺ 自由指派每個字元到某個格子。格子 <code>(r, c)</code> 的代價是 <code>r + c</code>，六列六行 ⇒ 代價值分布是：<br><code>2</code> 有 1 格、<code>3</code> 有 2 格、<code>4</code> 有 3 格、<code>5</code> 有 4 格、<code>6</code> 有 5 格、<code>7</code> 有 6 格、<code>8</code> 有 5 格、<code>9</code> 有 4 格、<code>10</code> 有 3 格、<code>11</code> 有 2 格、<code>12</code> 有 1 格。<br>（就是 6×6 的反對角線長度，總共 36 格。）<br><b>貪心 + 交換論證</b>：把<b>出現次數最多</b>的字元放進<b>代價最小</b>的格子。<br>⇒ 統計各字元次數 → <b>由大到小排序</b> → 依序配上代價 <code>2,3,3,4,4,4,5,…</code> → 累加乘積。<br>驗算 <code>CALL DEA</code>：字元次數 L=2、A=2、C=1、D=1、E=1 ⇒ 2×2 + 2×3 + 1×3 + 1×4 + 1×4 = 4+6+3+4+4 = <b>21</b> ✓。",
  t: "① <b>空白免費</b>，統計時要跳過。<br>② 代價序列是 6×6 反對角線的長度 <code>1,2,3,4,5,6,5,4,3,2,1</code>（對應代價 2..12），<b>不是</b> 每個代價各一格。<br>③ 一定要<b>由大到小</b>配對（出現多的放便宜格），這是交換論證的直接結果。<br>④ 只有 36 個格子，但字元種類最多也是 36（26+10），剛好放得下。<br>⑤ 驗算樣例 <code>09AZ</code>：四個字元各 1 次 ⇒ 2+3+3+4 = <b>12</b> ✓。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    // 6x6 板子上，代價 r+c 的格子數量（反對角線長度）
    vector<int> cost;
    for (int r = 1; r <= 6; r++)
        for (int c = 1; c <= 6; c++) cost.push_back(r + c);
    sort(cost.begin(), cost.end());                     // 2,3,3,4,4,4,...

    int T; cin >> T;
    cin.ignore();
    while (T--) {
        string s; getline(cin, s);
        map<char, int> cnt;
        for (size_t i = 0; i < s.size(); i++)
            if (s[i] != ' ') cnt[s[i]]++;               // 空白免費

        vector<int> f;
        for (map<char, int>::iterator it = cnt.begin(); it != cnt.end(); ++it)
            f.push_back(it->second);
        sort(f.rbegin(), f.rend());                     // 次數多的配便宜格

        long long ans = 0;
        for (size_t i = 0; i < f.size(); i++) ans += (long long)f[i] * cost[i];
        cout << ans << "\\n";
    }
    return 0;
}`
},

11519: {
  q: "Logo 2：小海龜程式中<b>恰有一個數字被寫成問號</b>，已知執行完後海龜會<b>回到原點</b>。求那個問號應該是多少。指令有 <code>fd</code>／<code>bk</code>（前進／後退）與 <code>lt</code>／<code>rt</code>（左轉／右轉幾度）。",
  h: "分兩種情況：<br><b>① 問號是距離（fd/bk）</b>：位移對距離是<b>線性</b>的。先令問號 = 0 跑一次得到位移 <code>P₀</code>，再令問號 = 1 跑一次得 <code>P₁</code>；則問號為 x 時的位移是 <code>P₀ + x·(P₁ − P₀)</code>。要它等於 0 ⇒ <code>x = −P₀ / (P₁ − P₀)</code>（取任一非零分量解即可）。<br><b>② 問號是角度（lt/rt）</b>：位移對角度<b>不是線性</b>的，但答案保證是 <b>0..359 的整數</b> ⇒ <b>直接枚舉 360 種</b>，每種跑一次程式看是否回到原點。<br>指令 ≤ 1000 ⇒ 360 × 1000 = 36 萬次運算，瞬殺。<br>驗算樣例：正三角形缺一邊 ⇒ 答案 <b>100</b> ✓。",
  t: "① <b>兩種情況要分開處理</b>：距離用線性解、角度用枚舉。角度硬解三角方程式很痛苦且未必有閉式。<br>② 角度答案要落在 <b>0..359</b>（題目明說）。<br>③ 浮點比較「回到原點」要用 eps（例如 <code>1e-6</code>），別用 <code>== 0</code>。<br>④ 距離的線性解算出來是浮點，要 <code>llround</code> 成整數（題目保證答案是整數）。<br>⑤ 角度要轉弧度；<code>lt</code> 加角度、<code>rt</code> 減角度。",
  c: `#include <bits/stdc++.h>
using namespace std;

const double PI = acos(-1.0);

struct Cmd { string op; long long val; bool q; };

// 把問號代入 x，回傳終點座標
void run(const vector<Cmd> &cs, double x, double &fx, double &fy) {
    double px = 0, py = 0, th = 0;
    for (size_t i = 0; i < cs.size(); i++) {
        double v = cs[i].q ? x : (double)cs[i].val;
        if (cs[i].op == "fd") { px += v * cos(th); py += v * sin(th); }
        else if (cs[i].op == "bk") { px -= v * cos(th); py -= v * sin(th); }
        else if (cs[i].op == "lt") th += v * PI / 180;
        else th -= v * PI / 180;
    }
    fx = px; fy = py;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<Cmd> cs(n);
        bool angleQ = false;
        for (int i = 0; i < n; i++) {
            string op, arg; cin >> op >> arg;
            cs[i].op = op;
            cs[i].q = (arg == "?");
            cs[i].val = cs[i].q ? 0 : atoll(arg.c_str());
            if (cs[i].q && (op == "lt" || op == "rt")) angleQ = true;
        }

        if (angleQ) {                                   // 角度：直接枚舉 0..359
            for (int a = 0; a < 360; a++) {
                double fx, fy;
                run(cs, a, fx, fy);
                if (fabs(fx) < 1e-6 && fabs(fy) < 1e-6) { cout << a << "\\n"; break; }
            }
        } else {                                        // 距離：位移是線性的
            double x0, y0, x1, y1;
            run(cs, 0, x0, y0);
            run(cs, 1, x1, y1);
            double dx = x1 - x0, dy = y1 - y0;
            double ans = (fabs(dx) > fabs(dy)) ? -x0 / dx : -y0 / dy;
            cout << llround(ans) << "\\n";
        }
    }
    return 0;
}`
},

10535: {
  q: "Shooter：2D 迷宮中有 n 道<b>牆（線段）</b>，射手站在某點，發射一道<b>無限長的雷射</b>（可往任意方向）。雷射碰到或穿過的牆都會被摧毀。求<b>一發最多能摧毀幾道牆</b>。",
  h: "射線從固定的射手位置出發 ⇒ 方向只有一個自由度。<b>最佳方向必定「掃過某道牆的端點」</b>——否則可以微微旋轉直到碰到端點，摧毀數不會變少。<br>⇒ <b>枚舉所有 2n 個端點</b>當作射線方向的候選（共 2n 個方向，n ≤ 500 ⇒ 1000 個候選）。<br>對每個候選方向，檢查<b>射線與每道牆是否相交</b>，數出摧毀數，取最大。<br>複雜度 O(n × 2n) = 50 萬次相交判定，瞬殺。<br><b>射線與線段相交</b>的判定：用叉積判斷線段兩端點在射線的異側（或有端點在射線上），且交點在射線的<b>正方向</b>上。",
  unsure: true,
  t: "① <b>只枚舉端點方向就夠</b>——這個「最佳解必在臨界位置」的論證是本題的核心。<br>② 射線是<b>單向無限</b>（不是直線），要檢查交點在正方向；但也有版本認為雷射是雙向的——本題原文在轉檔時殘缺，<b>單向/雙向沒有百分之百確定</b>，這是標記為不確定的原因。<br>③ 「碰到」也算摧毀 ⇒ 端點接觸要算相交。<br>④ 射手<b>不會站在牆上</b>（題目保證）。<br>⑤ 座標是整數 ⇒ 可全程用整數叉積避免浮點誤差。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

struct P { ll x, y; };
ll cross(const P &o, const P &a, const P &b) {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}
int sgn(ll v) { return (v > 0) - (v < 0); }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<P> A(n), B(n);
        for (int i = 0; i < n; i++) cin >> A[i].x >> A[i].y >> B[i].x >> B[i].y;
        P S; cin >> S.x >> S.y;

        vector<P> dirs;                                 // 候選方向：所有牆的端點
        for (int i = 0; i < n; i++) { dirs.push_back(A[i]); dirs.push_back(B[i]); }

        int best = 0;
        for (size_t d = 0; d < dirs.size(); d++) {
            P far = dirs[d];
            if (far.x == S.x && far.y == S.y) continue;
            int cnt = 0;
            for (int i = 0; i < n; i++) {
                // 射線 S->far 是否與線段 A[i]B[i] 相交
                int s1 = sgn(cross(S, far, A[i])), s2 = sgn(cross(S, far, B[i]));
                if (s1 * s2 > 0) continue;              // 兩端同側 -> 不交
                // 檢查交點在射線正方向：用參數符號判斷
                ll d1 = (A[i].x - S.x) * (far.x - S.x) + (A[i].y - S.y) * (far.y - S.y);
                ll d2 = (B[i].x - S.x) * (far.x - S.x) + (B[i].y - S.y) * (far.y - S.y);
                if (d1 >= 0 || d2 >= 0) cnt++;
            }
            best = max(best, cnt);
        }
        cout << best << "\\n";
    }
    return 0;
}`
},

10504: {
  q: "Hidden squares：<code>r × c</code> 的大寫字母網格。對指定的每個字母，數出有幾個<b>正方形</b>（<b>四個角上的字母都是該字母</b>，且正方形<b>可以旋轉</b>——不限軸平行）。",
  h: "「可旋轉的正方形」是本題的重點。列舉方式：<b>枚舉正方形的一條邊</b>（兩個同字母的點 P、Q），再由向量旋轉 90° 算出另外兩個角：<br>設 <code>v = Q − P</code>，則另外兩點是<br><code>R = Q + rot90(v)</code>、<code>S = P + rot90(v)</code>，其中 <code>rot90(x, y) = (−y, x)</code><br>檢查 R、S 是否在界內且字母相同。<br><b>去重</b>：每個正方形有 4 條邊、每條邊有 2 個方向 ⇒ 會被數 8 次；但若只往<b>一個固定的旋轉方向</b>枚舉，就變成每個正方形數 4 次 ⇒ <b>最後除以 4</b>。<br>複雜度：同字母的點對數 × 常數。網格不大時可行。",
  unsure: true,
  t: "① <b>正方形可以旋轉</b>（不只軸平行），這是本題與一般「數正方形」題最大的差別。<br>② <b>去重的倍數</b>要算對：固定一個旋轉方向時每個正方形被數 4 次 ⇒ 除以 4。<br>③ 樣例的答案（A 3 / B 0、A 1 / B 8）我推算後<b>無法完全對上</b>——可能是網格尺寸或旋轉規則的理解有誤，因此標記為不確定。<br>④ 若同字母的點很多（例如整片同字母），點對數是 O(k²)，最壞情況要注意效率。<br>⑤ 每個問題的輸出之間要空一行。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int tc = 0; tc < T; tc++) {
        int r, c; cin >> r >> c;
        vector<string> g(r);
        for (int i = 0; i < r; i++) cin >> g[i];
        int k; cin >> k;
        vector<char> qs(k);
        for (int i = 0; i < k; i++) cin >> qs[i];

        if (tc) cout << "\\n";
        for (int t = 0; t < k; t++) {
            char ch = qs[t];
            vector<pair<int, int> > pts;
            for (int i = 0; i < r; i++)
                for (int j = 0; j < (int)g[i].size(); j++)
                    if (g[i][j] == ch) pts.push_back(make_pair(i, j));

            long long cnt = 0;
            for (size_t i = 0; i < pts.size(); i++)
                for (size_t j = 0; j < pts.size(); j++) {
                    if (i == j) continue;
                    int px = pts[i].first, py = pts[i].second;
                    int qx = pts[j].first, qy = pts[j].second;
                    int vx = qx - px, vy = qy - py;
                    // 旋轉 90 度：(vx, vy) -> (-vy, vx)
                    int rx = qx - vy, ry = qy + vx;
                    int sx = px - vy, sy = py + vx;
                    if (rx < 0 || rx >= r || sx < 0 || sx >= r) continue;
                    if (ry < 0 || ry >= (int)g[rx].size()) continue;
                    if (sy < 0 || sy >= (int)g[sx].size()) continue;
                    if (g[rx][ry] == ch && g[sx][sy] == ch) cnt++;
                }
            cout << ch << " " << cnt / 4 << "\\n";        // 每個正方形被數 4 次
        }
    }
    return 0;
}`
},

10915: {
  q: "War on Weather：地球是半徑 6378 km 的球，給 k 顆衛星與 m 個目標的<b>三維座標</b>。若某目標與某衛星之間的<b>直線視線不被地球擋住</b>，該目標就能被擊中。求能擊中的目標總數。",
  h: "「視線被球擋住」= <b>線段 AB 與球心的最短距離 &lt; 半徑</b>，且最近點落在<b>線段之內</b>（若最近點在線段外，代表球在線段的延伸方向上，不會擋住）。<br>用點到線段的標準模板（跟 10263、10180 同一招）：<br>令 <code>t = ((O − A)·(B − A)) / |B − A|²</code>，<b>夾到 [0, 1]</b>，最近點 <code>Q = A + t(B − A)</code>，距離 <code>|Q − O|</code>。<br>・<code>|Q| ≥ R</code> ⇒ 視線暢通 ⇒ 目標可被擊中<br>對每個目標，只要<b>存在任一顆衛星</b>看得到它就算數，所以掃過所有衛星、命中就 break。<br>複雜度 O(k × m) = 100 × 100 = 1 萬。",
  t: "① <b>最近點要夾到線段內</b>——不夾就變成「點到無限直線」，會把「地球在背後」的情況誤判成被擋住。<br>② 地球半徑是 <b>6378</b> km。<br>③ 題目說「若落在 10 km 的邊界內視為可見」⇒ 判定時要<b>放寬 10 km</b>（用 <code>R − 10</code> 當門檻）。<br>④ 座標是浮點且數值很大（上千），全程 <code>double</code>。<br>⑤ 一個目標<b>只算一次</b>（不論幾顆衛星看得到）。",
  c: `#include <bits/stdc++.h>
using namespace std;

struct V { double x, y, z; };

// 線段 AB 到原點的最短距離（最近點夾在線段內）
double distToOrigin(const V &a, const V &b) {
    double dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z;
    double len2 = dx * dx + dy * dy + dz * dz;
    double t = 0;
    if (len2 > 1e-18) t = -(a.x * dx + a.y * dy + a.z * dz) / len2;
    if (t < 0) t = 0; if (t > 1) t = 1;                 // 夾到線段上
    double qx = a.x + t * dx, qy = a.y + t * dy, qz = a.z + t * dz;
    return sqrt(qx * qx + qy * qy + qz * qz);
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const double R = 6378.0;
    int k, m;
    while (cin >> k >> m) {
        vector<V> sat(k), tgt(m);
        for (int i = 0; i < k; i++) cin >> sat[i].x >> sat[i].y >> sat[i].z;
        for (int i = 0; i < m; i++) cin >> tgt[i].x >> tgt[i].y >> tgt[i].z;

        int cnt = 0;
        for (int i = 0; i < m; i++)
            for (int j = 0; j < k; j++)
                if (distToOrigin(sat[j], tgt[i]) >= R - 10.0) {   // 放寬 10 km
                    cnt++;                                        // 一個目標只算一次
                    break;
                }
        cout << cnt << "\\n";
    }
    return 0;
}`
}
};

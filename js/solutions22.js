/* 二星題庫（第五批 11 題） */
const SOL22 = {
10205: {
  q: "Stack 'em Up：一副新牌依「先花色字母序（Clubs, Diamonds, Hearts, Spades）、再點數 2..Ace」排好。給若干種洗牌方式（每種是 52 個數字的置換），再給實際使用的洗牌順序，輸出最後的牌序（<code>&lt;點數&gt; of &lt;花色&gt;</code>）。",
  h: "重點只有一句：<b>置換的方向要讀對</b>。<br>題目說「第 i 個位置上的數字 j，表示這次洗牌把<b>第 j 張牌搬到第 i 個位置</b>」⇒<br><code>new[i] = old[shuffle[i]]</code><br>方向讀反（<code>new[shuffle[i]] = old[i]</code>）會得到<b>反置換</b>，樣例就對不上。<br>牌名換算：牌號 c（1..52）⇒ <code>花色 = (c−1)/13</code>、<code>點數 = (c−1)%13</code>。<br>樣例可以拿來驗方向：先做「交換 51、52」再做「把 52 搬到第 1 位」⇒ 第一張變成原本的第 51 張 = <b>King of Spades</b> ✓。",
  t: "① <b>置換方向</b>是本題唯一的難點，寫反不會編譯錯只會 WA。<br>② 花色是<b>字母序</b>：Clubs → Diamonds → Hearts → Spades。<br>③ 洗牌編號的清單長度未知，要<b>讀到空行或 EOF</b> 為止（測資之間以空行分隔）。<br>④ 兩筆測資的輸出之間要<b>空一行</b>。<br>⑤ 每次洗牌都要用<b>暫存陣列</b>，不能原地覆蓋。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    const char *val[] = {"2","3","4","5","6","7","8","9","10","Jack","Queen","King","Ace"};
    const char *suit[] = {"Clubs","Diamonds","Hearts","Spades"};

    int T; cin >> T;
    for (int t = 0; t < T; t++) {
        int n; cin >> n;
        vector<vector<int> > sh(n, vector<int>(53));
        for (int i = 0; i < n; i++)
            for (int j = 1; j <= 52; j++) cin >> sh[i][j];
        cin.ignore();

        vector<int> ops;
        string line;
        while (getline(cin, line)) {                       // 讀到空行或 EOF
            if (line.find_first_not_of(" \\t\\r") == string::npos) break;
            ops.push_back(atoi(line.c_str()));
        }

        vector<int> deck(53);
        for (int i = 1; i <= 52; i++) deck[i] = i;
        for (size_t k = 0; k < ops.size(); k++) {
            vector<int> nd(53);
            for (int i = 1; i <= 52; i++) nd[i] = deck[sh[ops[k] - 1][i]];   // 方向！
            deck = nd;
        }
        if (t) cout << "\\n";
        for (int i = 1; i <= 52; i++)
            cout << val[(deck[i] - 1) % 13] << " of " << suit[(deck[i] - 1) / 13] << "\\n";
    }
    return 0;
}`
},

10347: {
  q: "Medians：給三角形<b>三條中線</b>的長度，求三角形面積（3 位小數）。無法構成則輸出 <code>-1.000</code>。",
  h: "一個漂亮的幾何定理：<b>以三條中線為邊長的三角形，面積是原三角形的 3/4</b>。<br>⇒ <code>原面積 = (4/3) × 中線三角形的面積</code>，而後者用<b>海龍公式</b>即可。<br>所以整題只有兩行：<br><code>s = (a+b+c)/2；medArea = √(s(s−a)(s−b)(s−c))；答案 = medArea × 4/3</code><br>驗算：三條中線都是 3 ⇒ 中線三角形是邊長 3 的正三角形，面積 = <code>(√3/4)·9 ≈ 3.897</code>，× 4/3 = <b>5.196</b> ✓。<br>（證明可用向量：三條中線向量相加為零，可平移拼成一個三角形，面積比就是 3/4。）",
  t: "① <b>要記得乘 4/3</b>——直接對中線用海龍公式會少掉這個係數，是本題最常見的錯。<br>② 三條中線本身也要<b>能構成三角形</b>，否則海龍公式裡會出現負數 ⇒ 輸出 <code>-1.000</code>。<br>③ 開根號前先檢查括號內 &gt; 0。<br>④ 輸出<b>固定 3 位小數</b>。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cout << fixed << setprecision(3);
    double a, b, c;
    while (cin >> a >> b >> c) {
        double s = (a + b + c) / 2;
        double t = s * (s - a) * (s - b) * (s - c);
        if (t <= 0) { cout << "-1.000\\n"; continue; }
        cout << sqrt(t) * 4.0 / 3.0 << "\\n";              // 中線三角形面積的 4/3 倍
    }
    return 0;
}`
},

10315: {
  q: "Poker Hands：每行給 10 張牌，前 5 張是 Black 的手牌、後 5 張是 White 的。依標準撲克牌型比大小，輸出 <code>Black wins.</code>／<code>White wins.</code>／<code>Tie.</code>",
  h: "把一手牌<b>壓成一個可比較的鍵</b>：<code>(牌型等級, 比大小用的點數序列)</code>，然後直接用 <code>vector&lt;int&gt;</code> 的字典序比較——這是處理這類「多層比較規則」最乾淨的手法。<br><b>關鍵技巧</b>：把點數依「<b>出現次數多的優先、次數相同則點數大的優先</b>」排序，得到的序列<b>自動就是正確的比大小順序</b>：<br>・葫蘆 <code>(3,K)(2,5)</code> → K, 5 ✓<br>・兩對 <code>(2,J)(2,4)(1,9)</code> → J, 4, 9 ✓<br>・單張 → 由大到小 ✓<br>牌型等級由「次數分布 + 是否同花 + 是否順子」判斷即可。",
  t: "① 用<b>次數優先、再點數優先</b>的排序產生比較序列，可以省掉一大堆 if。<br>② 點數映射：<code>T = 10, J = 11, Q = 12, K = 13, A = 14</code>。<br>③ 順子與同花順的比較鍵只看<b>最大那張</b>。<br>④ <b>A-2-3-4-5 的「小順」</b>本題未提及，多數測資也沒有；若要保險可額外把 <code>A5432</code> 視為以 5 為首的順子。<br>⑤ 兩手完全等值時輸出 <code>Tie.</code>（有句號）。",
  c: `#include <bits/stdc++.h>
using namespace std;

int valOf(char c) {
    if (c >= '2' && c <= '9') return c - '0';
    if (c == 'T') return 10;
    if (c == 'J') return 11;
    if (c == 'Q') return 12;
    if (c == 'K') return 13;
    return 14;                                             // 'A'
}

vector<int> score(vector<string> &h) {
    vector<int> v(5); vector<char> s(5);
    for (int i = 0; i < 5; i++) { v[i] = valOf(h[i][0]); s[i] = h[i][1]; }

    bool flush = true;
    for (int i = 1; i < 5; i++) if (s[i] != s[0]) flush = false;

    vector<int> sorted_ = v;
    sort(sorted_.rbegin(), sorted_.rend());
    bool straight = true;
    for (int i = 1; i < 5; i++) if (sorted_[i] != sorted_[i - 1] - 1) straight = false;

    // 依「次數多優先、點數大優先」排出比較序列
    map<int, int> cnt;
    for (int i = 0; i < 5; i++) cnt[v[i]]++;
    vector<pair<int, int> > g;                             // (次數, 點數)
    for (map<int, int>::iterator it = cnt.begin(); it != cnt.end(); ++it)
        g.push_back(make_pair(it->second, it->first));
    sort(g.rbegin(), g.rend());

    int cat;
    if (straight && flush) cat = 8;
    else if (g[0].first == 4) cat = 7;
    else if (g[0].first == 3 && g[1].first == 2) cat = 6;
    else if (flush) cat = 5;
    else if (straight) cat = 4;
    else if (g[0].first == 3) cat = 3;
    else if (g[0].first == 2 && g[1].first == 2) cat = 2;
    else if (g[0].first == 2) cat = 1;
    else cat = 0;

    vector<int> key(1, cat);
    if (cat == 8 || cat == 4) key.push_back(sorted_[0]);   // 順子只看最大張
    else for (size_t i = 0; i < g.size(); i++) key.push_back(g[i].second);
    return key;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    vector<string> b(5), w(5);
    while (cin >> b[0]) {
        for (int i = 1; i < 5; i++) cin >> b[i];
        for (int i = 0; i < 5; i++) cin >> w[i];
        vector<int> kb = score(b), kw = score(w);
        if (kb > kw) cout << "Black wins.\\n";
        else if (kb < kw) cout << "White wins.\\n";
        else cout << "Tie.\\n";
    }
    return 0;
}`
},

11475: {
  q: "Extend to Palindrome：在字串<b>後面</b>加上最少的字元，使它變成回文。輸出結果。",
  h: "要加的字元最少 ⟺ <b>保留的「回文後綴」最長</b>。找到最長的回文後綴長度 k 後，答案就是<br><code>s + reverse(s 的前 n−k 個字元)</code>。<br>怎麼快速找最長回文後綴？<b>KMP 的失配函式</b>：<br>令 <code>t = reverse(s) + '#' + s</code>，則 <code>f[t 的最後一格]</code> = 「reverse(s) 的前綴」與「s 的後綴」的最長共同長度。<br>而「reverse(s) 的前 k 個字元」= 「s 的後 k 個字元反過來」，兩者相等正好代表<b>後 k 個字元是回文</b> ✓。<br>分隔符 <code>#</code> 是為了避免匹配長度超過原字串。O(n)。",
  t: "① 是<b>回文後綴</b>不是回文前綴（因為只能往後面加字元）。<br>② <b>分隔字元不可省</b>，且要選一個不會出現在輸入中的字元（本題只有英文字母，用 <code>#</code> 安全）。<br>③ 已經是回文時 k = n，不加任何字元（樣例的 <code>aaaa</code>、<code>abba</code>）。<br>④ 驗算 <code>amanaplanacanal</code>：最長回文後綴是 <code>lanacanal</code>（9 個），補上 <code>reverse(\"amanap\") = \"panama\"</code> ⇒ <code>amanaplanacanalpanama</code> ✓。<br>⑤ 讀到 EOF 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string s;
    while (cin >> s) {
        string r(s.rbegin(), s.rend());
        string t = r + "#" + s;                            // 分隔符避免超長匹配
        int m = t.size();
        vector<int> f(m, 0);
        for (int i = 1; i < m; i++) {
            int j = f[i - 1];
            while (j > 0 && t[i] != t[j]) j = f[j - 1];
            if (t[i] == t[j]) j++;
            f[i] = j;
        }
        int k = f[m - 1];                                  // 最長回文後綴長度
        cout << s << r.substr(k) << "\\n";                  // r 的後半 = 前綴反轉
    }
    return 0;
}`
},

11507: {
  q: "Bender 折鐵絲：鐵絲長 L，起初沿 <code>+x</code>。在第 1..L−1 個點依序決定「不折（<code>No</code>）」或「折成平行於 <code>±y</code>／<code>±z</code>」。求<b>最後一段</b>的方向。",
  h: "把方向存成<b>三維整數向量</b>，每次折彎當成一個<b>90° 旋轉</b>：折向 <code>c</code> 的動作，就是把 <code>x̂</code> 轉到 <code>ĉ</code> 的那個旋轉，<b>整段後續方向都跟著轉</b>。<br>四個旋轉寫成座標變換（v = 目前方向）：<br><code>+y : (−v.y, v.x, v.z)</code>　<code>−y : (v.y, −v.x, v.z)</code><br><code>+z : (−v.z, v.y, v.x)</code>　<code>−z : (v.z, v.y, −v.x)</code><br><code>No</code> 就不動。依<b>清單順序</b>逐一套用即可，O(L)。<br>五組樣例全部驗算吻合（例如 <code>+z +y +z</code>：x̂ → ẑ → ẑ → −x̂ = <b>−x</b> ✓）。",
  t: "① <b>不要用「碰到平行就不變、否則換成該方向」的簡化規則</b>——樣例 <code>+z -z → +x</code> 就會錯。折彎是<b>旋轉整段</b>，不是直接指定方向。<br>② 旋轉矩陣的正負號要推對，建議用樣例 <code>+z -z → +x</code> 當單元測試。<br>③ L 可到 100000，用 <code>cin &gt;&gt; string</code> 逐個讀決策，別逐行 getline 再切。<br>④ 決策數量是 <b>L−1</b> 個。<br>⑤ <code>L = 0</code> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    long long L;
    while (cin >> L && L) {
        int x = 1, y = 0, z = 0;                           // 起初沿 +x
        for (long long i = 1; i < L; i++) {
            string c; cin >> c;
            int nx = x, ny = y, nz = z;
            if (c == "+y") { nx = -y; ny = x; nz = z; }    // 把 x̂ 轉到 ŷ 的旋轉
            else if (c == "-y") { nx = y; ny = -x; nz = z; }
            else if (c == "+z") { nx = -z; ny = y; nz = x; }
            else if (c == "-z") { nx = z; ny = y; nz = -x; }
            x = nx; y = ny; z = nz;                        // "No" 則原封不動
        }
        if (x) cout << (x > 0 ? "+x" : "-x") << "\\n";
        else if (y) cout << (y > 0 ? "+y" : "-y") << "\\n";
        else cout << (z > 0 ? "+z" : "-z") << "\\n";
    }
    return 0;
}`
},

11369: {
  q: "Shopaholic：買三送一（三件裡<b>最便宜的免費</b>）。可以自由決定怎麼三件一組送結帳，求<b>最大折扣總額</b>。",
  h: "<b>貪心 + 交換論證</b>：把價格<b>由大到小</b>排序，取第 3、6、9、…（0-based 的 index 2, 5, 8…）加總就是答案。<br>為什麼？免費的一定是組內最便宜的那件。要讓免費的總額最大，就該讓「每組最小值」盡量大 ⇒ 把價格排序後<b>三個一組連續切</b>，每組的第三大（也就是組內最小）加起來最大。<br>若把某個貴的商品跟兩個更貴的湊在一起以外的方式配對，都能用交換論證證明不會更好。<br>O(n log n)。",
  t: "① 一定要<b>由大到小</b>排序後取 index 2, 5, 8…；由小到大取就完全錯了。<br>② 剩下不足 3 件的<b>湊不成一組</b>，自然不會被取到（索引超出範圍）。<br>③ 總額可達 2000 × 20000，用 <code>long long</code> 安全。<br>④ 第一行是測資數，每筆先給件數再給價格。<br>⑤ 驗算：<code>400 100 200 350 300 250</code> → 排序 400 350 300 250 200 100 → 取 300 + 100 = <b>400</b> ✓。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<int> a(n);
        for (int i = 0; i < n; i++) cin >> a[i];
        sort(a.rbegin(), a.rend());                        // 由大到小
        ll ans = 0;
        for (int i = 2; i < n; i += 3) ans += a[i];        // 每三個一組的最小值
        cout << ans << "\\n";
    }
    return 0;
}`
},

11729: {
  q: "Commando War：你要對 n 個士兵下達指令，<b>交代任務需要 B 秒（一次只能交代一個人）</b>，士兵拿到指令後需要 J 秒完成（可同時進行）。求<b>全部完成</b>的最短總時間。",
  h: "<b>經典的排程貪心：執行時間長的先交代</b>。<br>若先交代 J 大的，他就能在你交代其他人的同時慢慢做，總時間才不會被他拖住。<br>證明用<b>交換論證</b>：相鄰兩個交換後比較兩者的完成時間，可證 J 大的排前面不會更差。<br>排好後答案是<br><code>max over i ( 前 i 個人的 B 總和 + J[i] )</code><br>O(n log n)。<br>驗算樣例：<code>(2,5) (3,2) (2,1)</code> ⇒ 2+5=7、5+2=7、7+1=<b>8</b> ✓。",
  t: "① 是依 <b>J（執行時間）由大到小</b>排，不是依 B。<br>② 答案是<b>各人完成時刻的最大值</b>，不是總和。<br>③ 累計的是 <b>B 的前綴和</b>（交代時間必須排隊），J 則是各自並行。<br>④ 輸出格式 <code>Case k: t</code>。<br>⑤ <code>n = 0</code> 結束。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, cs = 1;
    while (cin >> n && n) {
        vector<pair<ll, ll> > v(n);                        // (J 執行, B 交代)
        for (int i = 0; i < n; i++) {
            ll b, j; cin >> b >> j;
            v[i] = make_pair(j, b);
        }
        sort(v.rbegin(), v.rend());                        // 執行時間長的先交代
        ll cur = 0, ans = 0;
        for (int i = 0; i < n; i++) {
            cur += v[i].second;                            // 交代時間要排隊
            ans = max(ans, cur + v[i].first);              // 各自並行執行
        }
        cout << "Case " << cs++ << ": " << ans << "\\n";
    }
    return 0;
}`
},

924: {
  q: "Spreading The News：每個員工每天把消息告訴所有朋友（<b>有向</b>）。給消息來源，求「<b>單日新聽到消息的人數最大值</b>」以及<b>第一次</b>達到該最大值是第幾天。都沒人聽到則輸出 <code>0</code>。",
  h: "就是 <b>BFS 分層</b>：第 1 層（第 1 天）是來源的朋友、第 2 層是他們的朋友…每一層的人數就是那天的新增人數。<br>實作上用「一次處理一整層」的寫法最直觀：記下目前佇列大小，把這一層全部彈出並展開，該層大小就是當天人數。<br>維護最大值時<b>只在嚴格更大時更新</b>，就自動得到「第一次達到最大值的那天」。<br>n ≤ 2500、每人朋友 &lt; 15 ⇒ 邊數 ≤ 37500，BFS 瞬殺；查詢最多 60 筆，每筆重跑一次 BFS 也完全沒問題。",
  t: "① 邊是<b>有向</b>的（我告訴我的朋友，不代表他會告訴我）。<br>② 來源自己<b>不算</b>在任何一天的新增人數裡。<br>③ 沒有任何人聽到（來源沒朋友或朋友都已知道）時，輸出<b>單一個 0</b>，不是 <code>0 0</code>。<br>④ 「第一次達到最大值」⇒ 更新條件用<b>嚴格大於</b>。<br>⑤ 每筆查詢都要<b>重置 visited</b>。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    vector<vector<int> > adj(n);
    for (int i = 0; i < n; i++) {
        int k; cin >> k;
        adj[i].resize(k);
        for (int j = 0; j < k; j++) cin >> adj[i][j];
    }
    int T; cin >> T;
    while (T--) {
        int s; cin >> s;
        vector<char> vis(n, 0);
        queue<int> q; q.push(s); vis[s] = 1;
        int bestCnt = 0, bestDay = 0, day = 0;
        while (!q.empty()) {
            int sz = q.size();
            day++;
            int add = 0;
            for (int i = 0; i < sz; i++) {                 // 一次處理一整層
                int u = q.front(); q.pop();
                for (size_t j = 0; j < adj[u].size(); j++) {
                    int v = adj[u][j];
                    if (!vis[v]) { vis[v] = 1; q.push(v); add++; }
                }
            }
            if (add > bestCnt) { bestCnt = add; bestDay = day; }   // 嚴格大於
        }
        if (bestCnt == 0) cout << "0\\n";
        else cout << bestCnt << " " << bestDay << "\\n";
    }
    return 0;
}`
},

10299: {
  q: "Relatives：給 <code>n ≤ 10⁹</code>，求小於 n 且與 n <b>互質</b>的正整數個數（<b>歐拉函數 φ(n)</b>）。",
  h: "歐拉函數的乘積公式：<br><code>φ(n) = n × ∏(1 − 1/p)</code>，p 跑過 n 的所有<b>相異質因數</b>。<br>做法：<b>試除法分解質因數</b>，只要除到 <code>√n ≈ 31623</code>；每找到一個質因數 p，就做 <code>ans = ans / p × (p − 1)</code>，並把 n 中所有 p 除乾淨。迴圈結束後若 <code>n &gt; 1</code>，代表剩下一個<b>大質因數</b>，也要處理一次。<br>複雜度 O(√n)。<br>（推導來自排容原理：不與 n 互質的數就是「至少被某個質因數整除」的數。）",
  t: "① <b>迴圈結束後別忘了處理剩下的大質因數</b>——這是最常見的漏洞（例如 n 是質數時整個迴圈都不會進去）。<br>② <b>先除再乘</b>（<code>ans / p * (p − 1)</code>）避免溢位；因為 ans 一定是 p 的倍數，整除不會失真。<br>③ 試除只到 <code>i * i &lt;= n</code>，且 n 要隨著除法縮小。<br>④ 輸入以 <code>0</code> 結束。<br>⑤ φ(1) = 1（依慣例），本題 n ≥ 1。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll n;
    while (cin >> n && n) {
        ll ans = n, m = n;
        for (ll p = 2; p * p <= m; p++) {
            if (m % p) continue;
            ans = ans / p * (p - 1);                       // 先除再乘，避免溢位
            while (m % p == 0) m /= p;
        }
        if (m > 1) ans = ans / m * (m - 1);                // 剩下的大質因數
        cout << ans << "\\n";
    }
    return 0;
}`
},

10523: {
  q: "Very Easy !!!：給 N 與 A（<code>N ≤ 150</code>、<code>A ≤ 15</code>），求 <code>Σ (i × Aⁱ)</code>，i 從 1 到 N。",
  h: "數學上沒難度，難的是<b>數字大小</b>：<code>150 × 15¹⁵⁰ ≈ 10¹⁷⁹</code> ⇒ 一定要<b>大數</b>。<br>實作只需要兩個運算：<b>大數 × 小數</b>與<b>大數 + 大數</b>（不需要大數乘大數）：<br>維護 <code>p = Aⁱ</code>（每輪 <code>p × A</code>），再把 <code>p × i</code> 累加進答案。<br>用 base 10⁹ 存放，每輪的乘法都是 O(位數)，總共 O(N × 位數) ≈ 150 × 20，瞬殺。<br>驗算：<code>N = 3, A = 3</code> ⇒ 3 + 18 + 81 = <b>102</b> ✓；<code>N = 4, A = 4</code> ⇒ 4 + 32 + 192 + 1024 = <b>1252</b> ✓。",
  t: "① 10¹⁷⁹ ⇒ <b>long long 差得非常遠</b>，一定要大數。<br>② 只需要「大數 × 小數」與「大數 + 大數」，<b>不用寫大數乘法</b>。<br>③ 乘小數時中間值要用 <code>long long</code>（10⁹ × 15 已超過 int）。<br>④ base 10⁹ 輸出<b>補零</b>的老問題。<br>⑤ A 可能是 0 或 1，答案分別是 0 與 <code>N(N+1)/2</code>，通用寫法自然涵蓋。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

const int BASE = 1000000000, W = 9;
typedef vector<int> Big;

Big mulSmall(const Big &a, ll k) {
    Big r; ll carry = 0;
    for (size_t i = 0; i < a.size() || carry; i++) {
        ll v = carry + (i < a.size() ? (ll)a[i] * k : 0);
        r.push_back((int)(v % BASE));
        carry = v / BASE;
    }
    if (r.empty()) r.push_back(0);
    return r;
}

Big add(const Big &a, const Big &b) {
    Big r; int carry = 0;
    for (size_t i = 0; i < a.size() || i < b.size() || carry; i++) {
        int v = carry;
        if (i < a.size()) v += a[i];
        if (i < b.size()) v += b[i];
        r.push_back(v % BASE);
        carry = v / BASE;
    }
    if (r.empty()) r.push_back(0);
    return r;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    ll n, a;
    while (cin >> n >> a) {
        Big sum(1, 0), p(1, 1);                            // p = A^0 = 1
        for (ll i = 1; i <= n; i++) {
            p = mulSmall(p, a);                            // p = A^i
            sum = add(sum, mulSmall(p, i));                // 累加 i * A^i
        }
        cout << sum.back();
        for (int i = (int)sum.size() - 2; i >= 0; i--)
            cout << setw(W) << setfill('0') << sum[i];
        cout << setfill(' ') << "\\n";
    }
    return 0;
}`
},

11586: {
  q: "Train Tracks：每段軌道的兩端各是公頭 <code>M</code> 或母頭 <code>F</code>（如 <code>MF</code>、<code>MM</code>、<code>FF</code>）。公頭只能接母頭。問<b>所有</b>軌道能否接成<b>一個環</b>。",
  h: "把它看成圖論問題：每個接點都是一個「M 接 F」的配對，繞成一圈時<b>每個 M 恰好配一個 F</b> ⇒ <b>M 的總數必須等於 F 的總數</b>。<br>反過來，只要 M 總數 = F 總數，就一定排得出一個環（可以把 <code>MM</code> 與 <code>FF</code> 交錯插進 <code>MF</code> 串成的鏈裡），所以這個條件是<b>充分且必要</b>的。<br>⇒ 整題就是<b>數 M 和 F 的個數</b>，一行搞定。<br>驗算樣例：<code>MF MF</code>（2:2 ✓）、<code>FM FF MF MM</code>（4:4 ✓）、<code>MM FF</code>（2:2 ✓）、<code>MF×4 FF</code>（4:6 ✗）⇒ LOOP, LOOP, LOOP, NO LOOP ✓。",
  t: "① 別被「要真的排出環」嚇到——<b>先猜一個簡單的必要條件，再驗證它也充分</b>，是這類題最快的路。<br>② 單獨一段 <code>MF</code> 也算合法的環（自己頭尾相接）。<br>③ 每筆測資是<b>一整行</b>，段數 1..50 ⇒ 用 <code>getline</code> + <code>istringstream</code> 拆。<br>④ 第一行是測資數，讀完要 <code>cin.ignore()</code>。<br>⑤ 輸出是 <code>LOOP</code> / <code>NO LOOP</code>（全大寫）。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int T; cin >> T; cin.ignore();
    while (T--) {
        string line; getline(cin, line);
        istringstream is(line);
        string piece;
        int m = 0, f = 0;
        while (is >> piece)
            for (size_t i = 0; i < piece.size(); i++)
                if (piece[i] == 'M') m++; else f++;
        cout << (m == f ? "LOOP" : "NO LOOP") << "\\n";
    }
    return 0;
}`
}
};

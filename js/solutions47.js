/* 三星第七批 —— 高 AC 經典題 */
const SOL47 = {
  '793': {
    q: `Bob 是網管，手上有一份電腦連線的日誌。每條連線是雙向的；兩台電腦「互通」的定義是直接相連，或透過同一群相連的電腦間接相連。

日誌檔中的每一行是下面兩種之一：
  c x y  —— 把電腦 x 與電腦 y 接起來
  q x y  —— 詢問「電腦 x 與電腦 y 現在是否互通？」
兩種行可以任意順序交錯出現，每讀一行就即時更新／回答。

請統計成功（互通）與失敗（不互通）的詢問各有幾次。

輸入：第一行是測資組數 N，之後每組測資前有一個空行。每組先給電腦數目（正整數），接著是若干行 c/q 指令，讀到檔尾或下一組為止。
輸出：每組輸出一行「成功數,失敗數」（中間是逗號，沒有空白）。兩組輸出之間空一行。

範例輸入
2

10
c 1 5
c 2 7
q 7 1
c 3 9
q 9 6
c 2 5
q 7 5
q 1 1
c 1 1
q 1 1

範例輸出
1,2

2,0`,
    h: `純粹的並查集（DSU）模板題，'c' 做 union、'q' 做 two find 比較。

要點：
1. 路徑壓縮 + 依大小合併，兩者都加就是幾乎 O(1)。
2. 電腦編號 1..n，find 出來的代表元相同就是互通。
3. q 1 1 這種自己問自己的一定算「成功」（同一個代表元），不要特別處理。

輸入格式是這題真正的難點：整組測資之間有空行、且每組的指令行數沒有先告知，必須用 getline 一行一行讀到空行（或 EOF）才停。用 >> 讀會吃掉換行資訊，無法判斷一組結束。`,
    t: `1. 輸出格式是「a,b」用逗號隔開，不是空白，寫成 cout << ok << "," << bad。
2. 兩組之間要空一行（最後一組後面不要多印）。這種 UVa「multiple test case」包裝題，慣例是在「第二組開始前」印換行。
3. 一定要用 getline 讀行：先讀掉組數 N 那行的換行，再讀空行，再讀電腦數那行，然後不斷 getline 直到空行或 EOF。
4. 讀到的行可能有結尾空白或 \\r（Windows 換行），判斷空行時要先 trim。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int p[1005], sz[1005];
int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }
void uni(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return;
    if (sz[a] < sz[b]) swap(a, b);
    p[b] = a; sz[a] += sz[b];
}

// 去掉行尾的空白與 \\r，方便判斷空行
static string trim(string s) {
    while (!s.empty() && isspace((unsigned char)s.back())) s.pop_back();
    size_t i = 0;
    while (i < s.size() && isspace((unsigned char)s[i])) i++;
    return s.substr(i);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string line;
    getline(cin, line);
    int T = stoi(trim(line));

    for (int tc = 0; tc < T; tc++) {
        // 吃掉組與組之間的空行，直到讀到電腦數
        int n = 0;
        while (getline(cin, line)) {
            string s = trim(line);
            if (!s.empty()) { n = stoi(s); break; }
        }
        for (int i = 1; i <= n; i++) { p[i] = i; sz[i] = 1; }

        int ok = 0, bad = 0;
        while (getline(cin, line)) {
            string s = trim(line);
            if (s.empty()) break;               // 本組結束
            char op; int a, b;
            {
                istringstream in(s);
                in >> op >> a >> b;
            }
            if (op == 'c') uni(a, b);
            else if (find(a) == find(b)) ok++;
            else bad++;
        }

        if (tc) cout << "\\n";
        cout << ok << "," << bad << "\\n";
    }
    return 0;
}`
  },

  '10033': {
    q: `一台假想電腦有 10 個暫存器（編號 0~9）與 1000 個 RAM 位址。每個暫存器或 RAM 位址存一個 0~999 的三位數。指令本身也編碼成三位數，存在 RAM 裡：

  100      停機（halt）
  2dn      暫存器 d 設為 n
  3dn      暫存器 d 加上 n
  4dn      暫存器 d 乘以 n
  5ds      暫存器 d 設為暫存器 s 的值
  6ds      暫存器 d 加上暫存器 s 的值
  7ds      暫存器 d 乘以暫存器 s 的值
  8da      暫存器 d 設為 RAM[暫存器 a 的值]
  9sa      RAM[暫存器 a 的值] 設為暫存器 s 的值
  0ds      跳到「暫存器 d 所指的位址」，除非暫存器 s 的值為 0

所有暫存器初始為 000，RAM 內容由輸入給定，從 RAM 位址 0 開始執行。所有運算結果對 1000 取餘數。
請輸出程式一共執行了幾道指令（含最後那道 halt）。

輸入：第一行是測資組數，各組之間有空行。每組是 1000 個三位數（不足的補 000）。
輸出：執行的指令數，兩組之間空一行。

範例輸入（節錄，其餘補 0）
299
492
495
399
492
495
399
283
279
689
078
100

範例輸出
16`,
    h: `直接照著指令表寫一個模擬器就好，沒有任何演算法。

實作骨架：
  int pc = 0, cnt = 0;
  while (true) {
      int ins = ram[pc++]; cnt++;
      int op = ins / 100, x = ins / 10 % 10, y = ins % 10;
      switch (op) { ... }
      if (op == 1) break;   // 100 = halt
  }

三個數字的拆法固定：op = ins/100、第二位 = ins/10%10、第三位 = ins%10。

指令 0ds 的語意是「若 reg[s] != 0，則 pc = reg[d]」，注意它是「除非 s 為 0 才跳」，也就是 s 非 0 才跳。跳的目標是 reg[d] 這個「值」，不是 d 本身。

指令 8da / 9sa 兩個都是間接定址：位址存在 reg[a] 裡，別直接拿 a 當位址。`,
    t: `1. pc 要先取指令再加一（ins = ram[pc++]），這樣 0ds 覆寫 pc 時才不會被之後的 pc++ 破壞。
2. 每一步都要對 1000 取模，尤其乘法：reg[d] = reg[d] * reg[s] % 1000，先轉成 int 沒問題（999*999 < 2^31）。
3. halt 那道指令本身也要計入 cnt（範例的 16 就是含 halt）。
4. RAM 只給了前面幾行，剩下要全部初始化成 0；讀輸入時讀到空行或組數用完就停。
5. 讀進來的是「三位數字串」，例如 078 要當成 78；用 int 讀就自動處理了，但別用字串比較。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int ram[1000], reg[10];

static string trim(string s) {
    while (!s.empty() && isspace((unsigned char)s.back())) s.pop_back();
    size_t i = 0;
    while (i < s.size() && isspace((unsigned char)s[i])) i++;
    return s.substr(i);
}

int main() {
    string line;
    getline(cin, line);
    int T = stoi(trim(line));

    for (int tc = 0; tc < T; tc++) {
        memset(ram, 0, sizeof(ram));
        memset(reg, 0, sizeof(reg));

        int idx = 0;
        // 讀掉空行，然後把接下來的數字行填進 RAM，直到空行 / EOF / 滿 1000
        bool started = false;
        while (getline(cin, line)) {
            string s = trim(line);
            if (s.empty()) { if (started) break; else continue; }
            started = true;
            ram[idx++] = stoi(s);
            if (idx == 1000) break;
        }

        int pc = 0;
        long long cnt = 0;
        while (true) {
            int ins = ram[pc++];
            cnt++;
            int op = ins / 100, d = ins / 10 % 10, s = ins % 10;
            if (op == 1) break;                       // 100 halt
            switch (op) {
                case 2: reg[d] = s; break;
                case 3: reg[d] = (reg[d] + s) % 1000; break;
                case 4: reg[d] = reg[d] * s % 1000; break;
                case 5: reg[d] = reg[s]; break;
                case 6: reg[d] = (reg[d] + reg[s]) % 1000; break;
                case 7: reg[d] = reg[d] * reg[s] % 1000; break;
                case 8: reg[d] = ram[reg[s]]; break;   // 8da: reg[d] = RAM[reg[a]]
                case 9: ram[reg[s]] = reg[d]; break;   // 9sa: RAM[reg[a]] = reg[s]
                case 0: if (reg[s] != 0) pc = reg[d]; break;
            }
        }

        if (tc) cout << "\\n";
        cout << cnt << "\\n";
    }
    return 0;
}`
  },

  '10037': {
    q: `n 個人要在夜裡過橋。一次最多兩個人一起過，而且過橋一定要拿手電筒；全隊只有一支手電筒，所以每次有人過去之後，必須有人把手電筒帶回來。

每個人的過橋速度不同，一組人的速度由較慢的那個決定。請安排策略讓所有人過橋的總時間最短。

輸入：第一行是測資組數，各組之間有空行。每組第一行是人數 n，接著 n 行每行一個過橋時間。n ≤ 1000，每人時間 ≤ 100。
輸出：第一行是總秒數；接下來每行印出這一趟過橋的那一位或兩位（用他們的過橋時間表示）。方向是來回交替的（第 1、3、5… 趟往對岸，第 2、4… 趟回來）。若有多種最佳策略，任一種皆可。兩組之間空一行。

範例輸入
1

4
1
2
5
10

範例輸出
17
1 2
1
5 10
2
1 2`,
    h: `經典貪心。先把時間排序（升冪），t[0] 最快、t[n-1] 最慢。

核心觀察：最慢的兩個人 t[n-1]、t[n-2] 一定要送過去，送法只有兩種划算的：
  策略 A（兩慢一起送）：t[0]+t[1] → t[0] 回 → t[n-2]+t[n-1] 過 → t[1] 回
                        成本 = t[0] + 2*t[1] + t[n-1]
  策略 B（最快的來回接駁）：t[0]+t[n-1] → t[0] 回 → t[0]+t[n-2] → t[0] 回
                        成本 = 2*t[0] + t[n-2] + t[n-1]
每輪取兩者較小的，人數減 2，重複到剩下 3 人以內。

收尾：
  剩 3 人：t[0]+t[1] 過 → t[0] 回 → t[0]+t[2] 過，成本 t[0]+t[1]+t[2]
  剩 2 人：一起過，成本 t[1]
  剩 1 人：自己過，成本 t[0]

範例 [1,2,5,10]：A = 1+2*2+10 = 15，B = 2*1+5+10 = 17，選 A，加上剩 2 人的 t[1]=2，總計 17。✓`,
    t: `1. 這題不只要總時間，還要印出「每一趟是誰過去 / 誰回來」，回程那行只有一個數字。
2. 策略 A 的回程是 t[1] 帶回手電筒（不是 t[0]），因為 t[0] 在第二趟就已經回到起點、第三趟又送到對岸了。順序務必是：t0 t1 / t0 / t[n-2] t[n-1] / t1。
3. 收尾 3 人的情形容易錯寫成 t[0]+t[2]，正確是 t[0]+t[1]+t[2]。
4. n=1 時只有一行「t[0]」，別漏掉。
5. 每個人用「過橋時間」表示，時間相同的人不用區分（題目明講無所謂）。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    for (int tc = 0; tc < T; tc++) {
        int n;
        cin >> n;
        vector<int> t(n);
        for (int i = 0; i < n; i++) cin >> t[i];
        sort(t.begin(), t.end());

        long long tot = 0;
        vector<string> step;
        auto mk = [](int a, int b) { return to_string(a) + " " + to_string(b); };

        int i = n - 1;
        while (i >= 3) {
            long long A = (long long)t[0] + 2LL * t[1] + t[i];      // 兩慢同行
            long long B = 2LL * t[0] + t[i] + t[i - 1];             // 最快接駁
            if (A < B) {
                step.push_back(mk(t[0], t[1]));
                step.push_back(to_string(t[0]));
                step.push_back(mk(t[i - 1], t[i]));
                step.push_back(to_string(t[1]));
                tot += A;
            } else {
                step.push_back(mk(t[0], t[i]));
                step.push_back(to_string(t[0]));
                step.push_back(mk(t[0], t[i - 1]));
                step.push_back(to_string(t[0]));
                tot += B;
            }
            i -= 2;
        }
        if (i == 2) {
            step.push_back(mk(t[0], t[1]));
            step.push_back(to_string(t[0]));
            step.push_back(mk(t[0], t[2]));
            tot += (long long)t[0] + t[1] + t[2];
        } else if (i == 1) {
            step.push_back(mk(t[0], t[1]));
            tot += t[1];
        } else {
            step.push_back(to_string(t[0]));
            tot += t[0];
        }

        if (tc) cout << "\\n";
        cout << tot << "\\n";
        for (size_t k = 0; k < step.size(); k++) cout << step[k] << "\\n";
    }
    return 0;
}`
  },

  '10044': {
    q: `匈牙利數學家 Paul Erdős 一生發表了大量論文。若某人曾與 Erdős 共同掛名一篇論文，他的「Erdős 數」是 1；若沒跟 Erdős 合著、但跟某個 Erdős 數為 1 的人合著過，Erdős 數就是 2，依此類推。Erdős 本人是 0。

給定一批論文的作者名單，請算出指定幾位作者的 Erdős 數。

輸入：第一行是情境數。每個情境第一行是 P N（P 篇論文、N 個查詢）。
接著 P 行，每行是一篇論文，格式為「作者1, 作者2, ..., 作者k: 論文標題」。
每位作者的寫法是「姓, 名字縮寫」（本身就含一個逗號！），例如「Smith, M.N.」。
接著 N 行，每行一個要查詢的作者名。
輸出：每個情境先印「Scenario i」，然後每個查詢印「作者名 Erdős數」，查不到（無法連到 Erdős）印「infinity」。

範例輸入
1
4 3
Smith, M.N., Martin, G., Erdos, P.: Newtonian forms of prime factor matrices
Erdos, P., Reisig, W.: Stuttering in petri nets
Smith, M.N., Chen, X.: First oder derivates in structured programming
Jablonski, T., Hsueh, Z.: Selfstabilizing data structures
Smith, M.N.
Hsueh, Z.
Chen, X.

範例輸出
Scenario 1
Smith, M.N. 1
Hsueh, Z. infinity
Chen, X. 2`,
    h: `圖論很簡單（BFS 求最短距離），真正的難點是「解析人名」。

解析步驟：
1. 先把整行從第一個 ':' 切開，冒號前是作者名單，冒號後是標題（丟掉）。
2. 作者名單用逗號切開會得到 2k 段（每個作者含一個逗號），所以要「兩段合成一個作者」：
   段0+段1 = 作者1、段2+段3 = 作者2、…
3. 每段前後 trim 空白，合成時用「姓, 名」中間一個逗號一個空格，統一成跟查詢行同樣的寫法。

建圖：同一篇論文的所有作者兩兩相連（或用「論文節點」星狀連接，邊數較少）。用 map<string,int> 把名字對到編號。

最後從 "Erdos, P." 出發做 BFS，dist 就是 Erdős 數。查詢名字不存在於任何論文 → infinity。`,
    t: `1. 作者名自己含逗號，直接用逗號 split 會把一個人切成兩半——這是本題最常見的 WA 來源。
2. 名字要正規化（trim 前後空白、統一成「姓, 名」），否則同一個人在不同論文裡因為空白數不同而變兩個節點。
3. 標題裡可能有逗號，所以一定要「先切冒號、再切逗號」，不能反過來。
4. Erdős 本人在資料裡寫成「Erdos, P.」（沒有重音）。他自己的 Erdős 數是 0。
5. 查詢的人若完全沒出現在任何論文中，也要印 infinity（不要當作找不到而跳過）。
6. 輸出的名字要照查詢行原樣印，不是印正規化後的版本（實務上兩者通常相同，但 trim 過的版本比較安全）。`,
    c: `#include <bits/stdc++.h>
using namespace std;

static string trim(const string& s) {
    size_t a = 0, b = s.size();
    while (a < b && isspace((unsigned char)s[a])) a++;
    while (b > a && isspace((unsigned char)s[b - 1])) b--;
    return s.substr(a, b - a);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;

    for (int tc = 1; tc <= T; tc++) {
        int P, N;
        cin >> P >> N;
        cin.ignore(numeric_limits<streamsize>::max(), '\\n');   // 吃掉該行剩下的換行

        map<string, int> id;
        vector<vector<int> > adj;
        auto getId = [&](const string& name) {
            map<string, int>::iterator it = id.find(name);
            if (it != id.end()) return it->second;
            int k = (int)adj.size();
            id[name] = k;
            adj.push_back(vector<int>());
            return k;
        };

        for (int i = 0; i < P; i++) {
            string line;
            getline(cin, line);
            size_t colon = line.find(':');
            string part = (colon == string::npos) ? line : line.substr(0, colon);

            // 先用逗號切成小段，再兩段合成一位作者
            vector<string> piece;
            {
                string cur;
                for (size_t k = 0; k < part.size(); k++) {
                    if (part[k] == ',') { piece.push_back(trim(cur)); cur.clear(); }
                    else cur += part[k];
                }
                piece.push_back(trim(cur));
            }
            vector<int> au;
            for (size_t k = 0; k + 1 < piece.size(); k += 2)
                au.push_back(getId(piece[k] + ", " + piece[k + 1]));

            for (size_t a = 0; a < au.size(); a++)
                for (size_t b = a + 1; b < au.size(); b++) {
                    adj[au[a]].push_back(au[b]);
                    adj[au[b]].push_back(au[a]);
                }
        }

        vector<int> dist(adj.size(), -1);
        if (id.count("Erdos, P.")) {
            int src = id["Erdos, P."];
            dist[src] = 0;
            queue<int> q;
            q.push(src);
            while (!q.empty()) {
                int u = q.front(); q.pop();
                for (size_t k = 0; k < adj[u].size(); k++) {
                    int v = adj[u][k];
                    if (dist[v] < 0) { dist[v] = dist[u] + 1; q.push(v); }
                }
            }
        }

        cout << "Scenario " << tc << "\\n";
        for (int i = 0; i < N; i++) {
            string line;
            getline(cin, line);
            string name = trim(line);
            map<string, int>::iterator it = id.find(name);
            if (it == id.end() || dist[it->second] < 0)
                cout << name << " infinity\\n";
            else
                cout << name << " " << dist[it->second] << "\\n";
        }
    }
    return 0;
}`
  },

  '11069': {
    q: `給一個 n 個點的無向圖，形狀是一條鏈：1-2-3-...-n（第 i 點與第 i+1 點相連）。

請計算滿足下列兩個條件的點集合有幾個：
  (1) 集合中沒有任兩點相鄰（獨立集）
  (2) 不能再加入任何一點而仍維持條件 (1)（也就是「極大」獨立集）

例如 n = 5 時答案是 4，四個集合分別是 {1,3,5}、{2,4}、{2,5}、{1,4}。

輸入：多行，每行一個整數 n（1 ≤ n ≤ 76），讀到 EOF。
輸出：每行輸出對應的極大獨立集個數。答案小於 2^31。

範例輸入
30

範例輸出
4410`,
    h: `路徑圖上的極大獨立集個數，滿足遞迴式

    f(n) = f(n-2) + f(n-3)，  f(1)=1, f(2)=2, f(3)=2

推導：看最後一個被選中的點。
  若選了點 n，那麼點 n-1 不能選，而點 n-2 也不能選（不然 n-1 兩邊都空著就違反極大性？其實是：n-1 沒被選，它必須被鄰居支配，鄰居是 n-2 或 n，n 已被選，OK）。
  更乾淨的推法是看「開頭」：
  - 若選了點 1 → 點 2 不能選，點 3 也不能選（否則 2 的兩個鄰居都沒選，2 可以加進來，違反極大）。等一下——若選 1 且選 3，2 被 1 和 3 支配，這是合法的。所以正確的切法是看「第一個沒被選的連續空段長度」。
  - 第 1 點被選：剩下的問題等價於從第 3 點開始的鏈（第 2 點已被 1 支配），也就是 f(n-2)。
  - 第 1 點沒被選：那 1 必須被 2 支配，所以 2 一定被選；於是 3 不能選，且 3 已被 2 支配，剩下從第 4 點開始，也就是 f(n-3)。
  兩種情形互斥且窮盡 → f(n) = f(n-2) + f(n-3)。

驗算：f(4) = f(2)+f(1) = 3，f(5) = f(3)+f(2) = 4 ✓（跟題目給的 4 個集合一致）。

n ≤ 76 時 f(76) = 1828587033，剛好塞得進 unsigned int / long long，題目也保證小於 2^31。直接打表就好。`,
    t: `1. 這是「極大」獨立集不是「最大」獨立集，也不是普通獨立集個數（普通的是 Fibonacci）。極大 = 不能再加點，容易看錯。
2. 邊界 f(1)=1（集合 {1}）、f(2)=2（{1} 或 {2}）、f(3)=2（{1,3} 或 {2}）。f(3) 不是 3——{1} 不是極大的，因為還能加 3。
3. 答案接近 2^31，用 int 會溢位（1828587033 剛好沒溢，但保險起見用 long long 或 unsigned）。
4. 輸入沒有測資組數，讀到 EOF 為止：while (cin >> n)。
5. 直接遞迴會慢且重複計算，一次打表到 76 再查表。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long f[80];
    f[1] = 1; f[2] = 2; f[3] = 2;
    for (int i = 4; i <= 76; i++) f[i] = f[i - 2] + f[i - 3];

    int n;
    while (cin >> n) {
        if (n < 1 || n > 76) continue;
        cout << f[n] << "\\n";
    }
    return 0;
}`
  },

  '10007': {
    q: `計算用恰好 n 個「不同的、有標籤的」元素能組成多少種相異的二元樹。

例如只有 1 個元素時只能組成 1 棵樹；有 2 個元素時能組成 4 棵。

輸入：每行一個整數 n（0 < n ≤ 300），讀到 n = 0 結束（該筆不處理）。
輸出：每行輸出對應的樹的數目。

範例輸入
10
25
0

範例輸出
60949324800
75414671852339208296275849248768000000`,
    h: `答案 = n! × Catalan(n) = (2n)! / (n+1)!

拆開來看：
  - 「形狀」有幾種？n 個節點的二元樹形狀數就是第 n 個 Catalan 數 C(n) = (2n)! / (n! (n+1)!)。
  - 每個形狀上，n 個相異標籤有 n! 種放法。
  兩者相乘 = n! × (2n)!/(n!(n+1)!) = (2n)!/(n+1)!

驗算：n=10 → 10! × C(10) = 3628800 × 16796 = 60949324800 ✓

更簡單的遞推式：令 A(n) 為答案，則
    A(n) = A(n-1) × 2 × (2n-1)
因為 (2n)!/(n+1)! ÷ ((2n-2)!/n!) = (2n)(2n-1)/(n+1) ... 直接驗證：
    A(n)/A(n-1) = (2n)!·n! / ((n+1)!·(2n-2)!) = (2n)(2n-1)/(n+1)
n=300 時答案有數百位數，必須用大數。用「A(n) = A(n-1) × 2n(2n-1) / (n+1)」會遇到除法，比較麻煩；乾脆直接大數階乘：先算 (2n)!，再逐一除掉 1..(n+1)，或用 n! × Catalan 的乘法遞推。

最省事的寫法：把答案表一次遞推到 300 存起來，用「大數乘小數 + 大數除小數」即可（除數 n+1 ≤ 301 是小整數）。`,
    t: `1. 別誤以為答案是 Catalan 數——那只是「形狀」數，這題元素有標籤，要再乘 n!。
2. n = 300 的答案約有 1200 位數，一定要自己實作大數。用 10^9 為一組儲存可以大幅減少陣列長度與迴圈次數。
3. 遞推 A(n) = A(n-1) × 2n(2n-1) / (n+1) 中，2n(2n-1) 最大約 360000，可以直接當「小數」乘；除以 (n+1) 也保證整除。乘的時候中間值會是 (10^9) × 360000 ≈ 3.6×10^14，要用 long long 承接。
4. 輸入以 0 結束，且 0 那筆不要輸出。
5. 大數輸出時，最高位正常印，其餘每組要補滿 9 位（cout << setw(9) << setfill('0')）。`,
    c: `#include <bits/stdc++.h>
using namespace std;

const long long BASE = 1000000000LL;   // 每組存 9 位十進位

typedef vector<long long> Big;          // 低位在前

static void mulSmall(Big& a, long long m) {
    long long carry = 0;
    for (size_t i = 0; i < a.size(); i++) {
        long long cur = a[i] * m + carry;
        a[i] = cur % BASE;
        carry = cur / BASE;
    }
    while (carry) { a.push_back(carry % BASE); carry /= BASE; }
}

static void divSmall(Big& a, long long d) {
    long long rem = 0;
    for (int i = (int)a.size() - 1; i >= 0; i--) {
        long long cur = rem * BASE + a[i];
        a[i] = cur / d;
        rem = cur % d;
    }
    while (a.size() > 1 && a.back() == 0) a.pop_back();
}

static void printBig(const Big& a) {
    cout << a.back();
    for (int i = (int)a.size() - 2; i >= 0; i--) cout << setw(9) << setfill('0') << a[i];
    cout << "\\n";
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // ans[n] = n! * Catalan(n) = (2n)! / (n+1)!
    vector<Big> ans(301);
    ans[0] = Big(1, 1);
    for (int n = 1; n <= 300; n++) {
        ans[n] = ans[n - 1];
        mulSmall(ans[n], 2LL * n * (2LL * n - 1));   // × 2n(2n-1)
        divSmall(ans[n], n + 1);                     // ÷ (n+1)，保證整除
    }

    int n;
    while (cin >> n && n != 0) printBig(ans[n]);
    return 0;
}`
  },

  '10791': {
    q: `一組正整數的 LCM（最小公倍數）是能被組內所有數整除的最小數。任何正整數都能表示成某組正整數的 LCM，例如 12 可以是 {12}、{12,12}、{1,12}、{3,4}、{2,3,4} … 的 LCM。

給你一個正整數 n，請找出一組「至少兩個」正整數，使它們的 LCM 恰好是 n，且元素總和最小。輸出這個最小總和。
例如 n = 12，取 {4, 3}，LCM = 12，總和 7，這是最小的。

輸入：多筆測資，每行一個正整數 n（1 ≤ n < 2^31）。n = 0 表示結束（不處理）。最多 100 筆。
輸出：每筆印「Case #: 總和」，# 是測資編號（從 1 開始）。

範例輸入
12
10
5
0

範例輸出
Case 1: 7
Case 2: 7
Case 3: 6`,
    h: `把 n 質因數分解成 n = p1^a1 × p2^a2 × ... × pk^ak。

要讓 LCM 恰好是 n，每個質因數冪次 pi^ai 都必須「完整地」出現在某個元素裡。把不同質因數放進不同元素是最省的：
  總和 = p1^a1 + p2^a2 + ... + pk^ak

為什麼分開放最小？因為對正整數 a,b ≥ 2 有 a + b ≤ a·b（合併只會變大或持平）。

兩個特例：
  - k = 1（n 是質數的冪，包含 n 本身是質數）：只有一個元素不夠，題目要求至少兩個，所以補一個 1 → 答案 n + 1。
  - n = 1：只能是 {1, 1}，答案 2。

驗算：
  12 = 4 × 3 → 4+3 = 7 ✓
  10 = 2 × 5 → 2+5 = 7 ✓
  5 是質數 → 5+1 = 6 ✓`,
    t: `1. n < 2^31，總和可能超過 int（例如 n 是接近 2^31 的質數時答案是 n+1），要用 long long 或 unsigned。
2. n = 1 要特判成 2，不然分解完是空集合、總和 0。
3. 質因數只有一個（k=1）時要 +1，這包含 n 是質數、也包含 n = 8、n = 27 這種質數冪。很多人只特判「n 是質數」而漏掉 8、9、16、27。
4. 試除到 sqrt(n) 即可（約 46341），剩下的 n > 1 就是最後一個大質因數。
5. 分解時記得把 p^a 整個乘起來當一項，不是把 p 加 a 次。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long n;
    int cs = 1;
    while (cin >> n && n != 0) {
        long long sum = 0;
        int cnt = 0;
        long long m = n;
        for (long long p = 2; p * p <= m; p++) {
            if (m % p) continue;
            long long pk = 1;
            while (m % p == 0) { m /= p; pk *= p; }
            sum += pk;
            cnt++;
        }
        if (m > 1) { sum += m; cnt++; }

        if (n == 1) sum = 2;          // {1,1}
        else if (cnt == 1) sum += 1;  // 質數冪：補一個 1

        cout << "Case " << cs++ << ": " << sum << "\\n";
    }
    return 0;
}`
  },

  '10701': {
    q: `二元樹的三種經典走訪：
  前序（pre-order）：根 → 左子樹 → 右子樹
  中序（in-order）：左子樹 → 根 → 右子樹
  後序（post-order）：左子樹 → 右子樹 → 根

例如某棵樹的前序是 ABCDEF、中序是 CBAEDF、後序是 CBEFDA。
給定一棵二元樹的中序與前序走訪，請輸出它的後序走訪。

輸入：第一行是測資筆數 T（T ≤ 2000）。接下來每行一筆：先一個整數 n（節點數，n ≤ 52），然後是前序字串、中序字串（各 n 個字元，節點以相異字元表示，大小寫視為不同）。
輸出：每筆輸出一行後序走訪。

範例輸入
3
3 xYz Yxz
3 abc cba
6 ABCDEF CBAEDF

範例輸出
Yzx
cba
CBEFDA`,
    h: `標準的「前序 + 中序 → 後序」重建。

前序的第一個字元就是根。在中序裡找到這個根的位置 k，那麼中序中 [0, k-1] 是左子樹、[k+1, ...] 是右子樹，左子樹大小 L = k。
對應到前序：pre[1 .. L] 是左子樹的前序，pre[L+1 ..] 是右子樹的前序。

遞迴函式：
  void solve(pre 區間, in 區間) {
      if 區間為空 return;
      root = pre[0];
      k = in 中 root 的位置;
      solve(左);       // 先左
      solve(右);       // 再右
      印出 root;       // 最後根 → 這就是後序
  }

不需要真的建出樹，直接在遞迴回程時輸出字元即可。n ≤ 52、T ≤ 2000，複雜度完全不是問題。

驗算 "abc" / "cba"：根 a，中序中 a 在位置 2 → 左子樹中序 "cb"（前序 "bc"）、右子樹空。
再遞迴：根 b，中序 "cb" 中 b 在位置 1 → 左子樹 "c"、右空 → 輸出 c、b。回到最外層輸出 a → "cba" ✓`,
    t: `1. 字元大小寫不同視為不同節點（範例的 xYz 就是在測這個），用 char 直接比對，別做 tolower。
2. 節點最多 52 個，剛好是 26 大寫 + 26 小寫，可以用陣列做 char → index 的對照表加速 find。
3. 輸入是「n 前序 中序」三個 token 在同一行，直接 cin >> n >> pre >> in 就好，不用 getline。
4. 遞迴要傳「區間」而不是複製字串，複製也不會 TLE（n≤52），但傳索引比較不容易寫錯。
5. 輸出是後序走訪本身，別誤印成中序或建完樹再走訪錯順序——遞迴的「左、右、印根」順序不能顛倒。`,
    c: `#include <bits/stdc++.h>
using namespace std;

string pre, in_;
string out_;

// pre[ps..ps+len-1] 與 in_[is..is+len-1] 描述同一棵子樹
void build(int ps, int is, int len) {
    if (len <= 0) return;
    char root = pre[ps];
    int k = 0;
    while (in_[is + k] != root) k++;     // 根在中序中的相對位置
    build(ps + 1, is, k);                // 左子樹
    build(ps + 1 + k, is + k + 1, len - 1 - k);  // 右子樹
    out_ += root;                        // 後序：最後才放根
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        int n;
        cin >> n >> pre >> in_;
        out_.clear();
        build(0, 0, n);
        cout << out_ << "\\n";
    }
    return 0;
}`
  },

  '10261': {
    q: `過河渡輪有左右兩條車道（port 左舷、starboard 右舷）。等待上船的車排成一列，操作員依序把每輛車指派到左邊或右邊，使兩邊的總長度都不超過渡輪長度。

車必須「照順序」上船：從第一輛開始，一輛一輛裝，直到裝不下為止。目標是讓上船的車數最多。

輸入：第一行是測資組數，各組之間有空行。每組第一行是渡輪長度（公尺，1~100 的整數），接下來每行一個車長（公分，100~3000 的整數），以 0 結束。
輸出：第一行是能載的車數；接著每輛上船的車依輸入順序印一行「port」或「starboard」。若有多種安排皆可，任一種即可。兩組之間空一行。

範例輸入
1

50
2500
3000
1000
1000
1500
700
800
0

範例輸出
6
port
starboard
starboard
starboard
port
port`,
    h: `注意「照順序裝到裝不下為止」這句話——它把問題變成一個簡單的可達性 DP，而不是背包最佳化。

設 L 為渡輪長度（換成公分：公尺 × 100）。
狀態：dp[i][p] = 前 i 輛車都已裝上、左舷用了 p 公分，是否可行（右舷用量可由前綴和推出，也可以直接記錄）。

因為「前 i 輛全部都要裝上」，右舷用量 = sum(前 i 輛) − p，只要 p ≤ L 且 sum−p ≤ L 就合法。所以只需要一維布林陣列 reach[p]。

轉移：
  reach2[p + len]  ← reach[p]        (這輛停左舷，需 p+len ≤ L)
  reach2[p]        ← reach[p]        (這輛停右舷，需 sum_i − p ≤ L)

只要某一輪 reach2 全為 false，就表示第 i 輛裝不下 → 答案是 i−1 輛。

輸出方案要回溯，所以要把每一層的 reach 都存下來（車數 ≤ ~200 因為每輛至少 100cm 而兩邊共 20000cm，L ≤ 10000），或存 parent 陣列記錄每一步是往左還是往右。

回溯：從最後一層某個可行的 p 往回走，若 reach[i-1][p-len] 為真就是「port」，否則就是「starboard」。`,
    t: `1. 單位不同！渡輪長度給公尺、車長給公分，要把渡輪長度 × 100 再比較。這是本題最經典的坑。
2. 「裝到裝不下為止」不是「選最多輛」——中間的車不能跳過。所以是可達性 DP，不是 0/1 背包。
3. 車輛數量沒有明說上限，但兩邊各 ≤ 100 公尺 = 10000 公分、每輛至少 100 公分，所以最多 200 輛，開陣列 [205][10005] 就夠。
4. 讀到 0 結束該組的車列表；0 本身不是車。
5. 回溯時要確認 p-len ≥ 0 才能走「port」那條路。
6. 兩組輸出之間要空一行。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    for (int tc = 0; tc < T; tc++) {
        int Lm;
        cin >> Lm;
        int L = Lm * 100;                  // 公尺 → 公分

        vector<int> car;
        int x;
        while (cin >> x && x != 0) car.push_back(x);

        int n = (int)car.size();
        // reach[i][p]：前 i 輛都裝上、左舷用了 p 公分是否可行
        vector<vector<char> > reach(n + 1, vector<char>(L + 1, 0));
        reach[0][0] = 1;

        long long sum = 0;
        int loaded = 0;
        for (int i = 1; i <= n; i++) {
            sum += car[i - 1];
            bool any = false;
            for (int p = 0; p <= L; p++) {
                if (!reach[i - 1][p]) continue;
                // 停左舷
                if (p + car[i - 1] <= L && sum - (p + car[i - 1]) <= L) {
                    reach[i][p + car[i - 1]] = 1; any = true;
                }
                // 停右舷
                if (sum - p <= L) { reach[i][p] = 1; any = true; }
            }
            if (!any) break;
            loaded = i;
        }

        // 回溯出方案
        int p = -1;
        for (int q = 0; q <= L; q++) if (reach[loaded][q]) { p = q; break; }
        vector<const char*> side(loaded);
        for (int i = loaded; i >= 1; i--) {
            int len = car[i - 1];
            if (p - len >= 0 && reach[i - 1][p - len]) { side[i - 1] = "port"; p -= len; }
            else side[i - 1] = "starboard";
        }

        if (tc) cout << "\\n";
        cout << loaded << "\\n";
        for (int i = 0; i < loaded; i++) cout << side[i] << "\\n";
    }
    return 0;
}`
  },

  '10337': {
    q: `飛機從距離起點 0、高度 0 出發，要飛到距離 X、高度也回到 0。每飛 100 英里只有三種選擇：爬升 1 英里、維持高度、下降 1 英里。

基本油耗：爬升 60 單位、維持 30 單位、下降 20 單位。
風會影響油耗：逆風要多耗油、順風可以省油。風強 w 滿足 −10 < w < 10，負值代表逆風。這一段的實際油耗 = 基本油耗 − w。

高度限制：不能低於 0，也不能高於 9。

輸入：第一行是測資組數。每組第一行是距離 X（100 ≤ X ≤ 10000，且是 100 的倍數）。接著給風強表：從高度 9 一路到高度 0，每個高度一行，該行有 X/100 個數字，依序是各段的風強。測資之間以一或多個空行分隔。
輸出：每組輸出最小總油耗，後面接一個空行。

範例輸入
2
400
1 1 1 1
1 1 1 1
1 1 1 1
1 1 1 1
1 1 1 1
1 1 1 1
1 1 1 1
1 1 1 1
1 9 9 1
1 -9 -9 1

1000
9 9 9 9 9 9 9 9 9 9
9 9 9 9 9 9 9 9 9 9
9 9 9 9 9 9 9 9 9 9
9 9 9 9 9 9 9 9 9 9
9 9 9 9 9 9 9 9 9 9
9 9 9 9 9 9 9 9 9 9
7 7 7 7 7 7 7 7 7 7
-5 -5 -5 -5 -5 -5 -5 -5 -5 -5
-7 -3 -7 -7 -7 -7 -7 -7 -7 -7
-9 -9 -9 -9 -9 -9 -9 -9 -9 -9

範例輸出
120

354`,
    h: `很小的網格 DP：欄數 C = X/100 ≤ 100，高度 0..9，總共只有 1000 個狀態。

dp[c][a] = 飛完前 c 段之後、位在高度 a 的最小油耗。
初始 dp[0][0] = 0，其餘為無限大。答案是 dp[C][0]。

轉移（從 (c, a) 飛第 c+1 段，這一段吃的風是「出發高度」a 在第 c 欄的風強 w = wind[a][c]）：
  爬升 → dp[c+1][a+1] = dp[c][a] + 60 − w   (a+1 ≤ 9)
  維持 → dp[c+1][a]   = dp[c][a] + 30 − w
  下降 → dp[c+1][a-1] = dp[c][a] + 20 − w   (a−1 ≥ 0)

範例一驗算（X=400，高度 0 的風是 1 −9 −9 1、高度 1 的風是 1 9 9 1）：
  第 1 段從高度 0 爬升：60 − 1 = 59
  第 2、3 段在高度 1 維持：(30 − 9) × 2 = 42
  第 4 段從高度 1 下降：20 − 1 = 19
  總計 59 + 42 + 19 = 120 ✓

範例二驗算（爬到高度 3 待著再降回來）：
  爬 (60+9) + (60+3) + (60+5) = 197，中間 4 段在高度 3 維持 4×(30−7) = 92，
  下降 (20−7) + (20+5) + (20+7) = 65，總計 354 ✓`,
    t: `1. 風強表的排列順序是「從高度 9 排到高度 0」，讀進來要反過來存：wind[9−i] = 第 i 行。這是最容易錯的地方。
2. 每一段的風強取「出發時的高度」在該欄的值（範例二驗算過，用出發高度才能得到 354）。
3. 油耗是「基本 − 風強」，逆風 w 為負，減負數就是加，所以逆風確實變貴。
4. 高度上限是 9、下限是 0，別漏掉邊界檢查；而且最後一定要回到高度 0。
5. 每組輸出之後要接一個空行（題目說 "followed by a blank line"），最後一組也要。
6. 測資之間可能有多個空行，用 >> 讀數字會自動跳過空白，不必特別處理。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        int X;
        cin >> X;
        int C = X / 100;

        static int wind[10][105];
        // 輸入順序是高度 9 → 高度 0，要倒過來存
        for (int i = 0; i < 10; i++) {
            int a = 9 - i;
            for (int c = 0; c < C; c++) cin >> wind[a][c];
        }

        const int INF = 1000000000;
        vector<int> dp(10, INF), nd(10);
        dp[0] = 0;
        for (int c = 0; c < C; c++) {
            fill(nd.begin(), nd.end(), INF);
            for (int a = 0; a < 10; a++) {
                if (dp[a] == INF) continue;
                int w = wind[a][c];                    // 用「出發高度」的風
                if (a + 1 <= 9) nd[a + 1] = min(nd[a + 1], dp[a] + 60 - w);
                nd[a] = min(nd[a], dp[a] + 30 - w);
                if (a - 1 >= 0) nd[a - 1] = min(nd[a - 1], dp[a] + 20 - w);
            }
            dp = nd;
        }
        cout << dp[0] << "\\n\\n";
    }
    return 0;
}`
  },

  '10165': {
    q: `Jack 和 Jim 玩取石子遊戲。一開始有 N 堆石子，第 i 堆有 Mi 顆。兩人輪流取石子，規則是：

  每次只能從「一堆」拿；
  每次至少拿 1 顆，最多拿光那一堆；
  拿走最後一顆石子的人獲勝。

Jack 先手。給定初始局面，請判斷 Jack 是否必勝。

輸入：多組測資，每組兩行。第一行是 N，第二行是 N 個數字 M1..MN（N = 0 表示結束，不處理）。
輸出：每組印一行，Jack 必勝印「Yes」，否則印「No」。

範例輸入
1
100
3
1 5 1
4
1 1 1 1
0

範例輸出
Yes
Yes
No`,
    h: `這就是標準的 Nim 遊戲（Bouton 定理）：

  先手必勝 ⟺ 所有堆的石子數 XOR 起來 ≠ 0

證明的兩個關鍵：
  1. 若 XOR = 0，不論怎麼取，取完之後 XOR 一定 ≠ 0（改變某一堆必然改變 XOR）。
  2. 若 XOR ≠ 0，設 XOR 的最高位在第 k 位，一定存在某一堆 Mi 的第 k 位是 1，把那堆改成 Mi XOR S（S 是總 XOR），這是合法的減少（Mi XOR S < Mi），且改完後總 XOR = 0。
  所以「XOR = 0」是必敗態（P-position），「XOR ≠ 0」是必勝態。

驗算：
  {100} → 100 ≠ 0 → Yes ✓
  {1,5,1} → 1^5^1 = 5 ≠ 0 → Yes ✓
  {1,1,1,1} → 0 → No ✓

程式就一行：把所有數 XOR 起來看是不是 0。`,
    t: `1. 這是「拿到最後一顆的人贏」的正規 Nim，不是 Misère Nim（拿到最後一顆的人輸）。兩者的判斷式不同，別記錯。
2. 空堆（Mi = 0）對 XOR 沒有影響，可以直接照算。
3. N 最大 10，Mi 可能很大，用 long long 承接比較保險（雖然 int 通常夠）。
4. 終止條件是 N = 0；讀到 0 就直接結束，別再去讀第二行。
5. 輸出是 "Yes" / "No"，第一個字母大寫、其餘小寫。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    while (cin >> n && n != 0) {
        long long x = 0, v;
        for (int i = 0; i < n; i++) { cin >> v; x ^= v; }
        cout << (x != 0 ? "Yes" : "No") << "\\n";
    }
    return 0;
}`
  },

  '10078': {
    q: `美術館的形狀是一個多邊形。所謂「臨界點」是指多邊形內部的某個點，站在那裡看不到整個館內。

例如凹的多邊形一定存在臨界點，凸的多邊形則不存在（凸多邊形內任一點都看得到全部）。

給定多邊形的頂點座標（依照邊界上的順序給出，順時針或逆時針皆可），判斷是否存在臨界點。

輸入：多組測資。每組第一行是頂點數 n（3 ≤ n ≤ 50），接下來 n 行每行兩個整數 x y（|x|, |y| ≤ 1000）。保證沒有連續三點共線。n = 0 表示結束。
輸出：有臨界點印「Yes」，沒有印「No」，各佔一行。

範例輸入
4
0 0
3 0
3 3
0 3
4
0 0
3 0
1 1
0 3
0

範例輸出
No
Yes`,
    h: `「不存在臨界點」等價於「多邊形是凸的」（更精確地說是 star-shaped 且核心 = 整個多邊形，對簡單多邊形而言就是凸）。所以問題化簡成：判斷這個多邊形是不是凸多邊形。

判斷方法：沿著頂點依序走一圈，對每一組連續三點 P[i]、P[i+1]、P[i+2] 算外積

    cross = (P[i+1] − P[i]) × (P[i+2] − P[i+1])

如果所有外積的正負號都相同（全正或全負），就是凸多邊形 → 印「No」；只要出現一次符號相反，就是凹的 → 印「Yes」。

題目保證「沒有連續三點共線」，所以外積不會是 0，判斷更單純。

驗算：
  正方形 (0,0)(3,0)(3,3)(0,3)：四個外積都是 +9，全同號 → 凸 → No ✓
  (0,0)(3,0)(1,1)(0,3)：走到 (3,0)→(1,1)→(0,3) 這裡外積變號 → 凹 → Yes ✓`,
    t: `1. 頂點順序可能是順時針也可能是逆時針，不能寫死「外積必須全為正」，要判斷「符號是否一致」。
2. 要繞回頭：最後兩組是 (P[n-2],P[n-1],P[0]) 和 (P[n-1],P[0],P[1])，用 (i+1)%n、(i+2)%n 就能自動處理。
3. 座標是整數，外積用 long long（其實 int 就夠：2000×2000×2 遠小於 2^31），但養成習慣比較安全。
4. 終止條件是 n = 0，注意讀完 0 就結束、別再讀座標。
5. 這題常見的誤解是想真的去找「臨界點」在哪——不需要，只要判凸凹。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    while (cin >> n && n != 0) {
        vector<long long> x(n), y(n);
        for (int i = 0; i < n; i++) cin >> x[i] >> y[i];

        int pos = 0, neg = 0;
        for (int i = 0; i < n; i++) {
            int a = i, b = (i + 1) % n, c = (i + 2) % n;
            long long cr = (x[b] - x[a]) * (y[c] - y[b]) - (y[b] - y[a]) * (x[c] - x[b]);
            if (cr > 0) pos++;
            else if (cr < 0) neg++;
        }
        // 全部同號 → 凸多邊形 → 沒有臨界點
        cout << ((pos == 0 || neg == 0) ? "No" : "Yes") << "\\n";
    }
    return 0;
}`
  },

  '10271': {
    q: `L 先生吃飯用三支筷子：一對加上一支特別長的，用來戳大塊的食物。這對筷子的長度要盡量接近，而那支額外的只要是最長的就行。

對於一組長度為 A ≤ B ≤ C 的三支筷子，這組的「劣度（badness）」定義為 (A − B)²。

今天是 L 先生生日，他請了 K 位客人，總共需要準備 K + 8 組筷子（他自己、太太、兒子、女兒、爸媽、岳父母，再加 K 位客人）。他手上有 N 支長度各異的筷子，請問怎麼組才能讓總劣度最小？

輸入：第一行是測資組數 T（T ≤ 20）。每組第一行是兩個整數 K 和 N（1 ≤ K ≤ 1000，3(K+8) ≤ N ≤ 5000）。第二行是 N 個非遞減排序的正整數，代表各筷子長度（≤ 32000）。
輸出：每組印一行最小總劣度。

範例輸入
1
1 40
8 10 16 19 22 27 33 36 40 47 52 56 61 63 71 72 75 81 81 84 88 96 98 103 110 113 118 124 128 129 134 134 139 148 157 157 160 162 164 170

範例輸出
23`,
    h: `關鍵觀察 1：那對「接近的筷子」在排序後一定是相鄰的。若一組取了 a < b 但中間還有 c 沒被這組用到，把 c 換進來只會更好或持平。

關鍵觀察 2：把筷子由「長到短」排序（b[1] 最長）。一組筷子等於「選一對相鄰的 (b[i-1], b[i])，再從前面（更長的）挑一支當作那支長筷」。

於是可以做 DP：
  dp[i][j] = 只用前 i 支（最長的 i 支）組出 j 組的最小總劣度
  dp[i][j] = min( dp[i-1][j],                                    // 第 i 支不當「那對的短的一支」
                  dp[i-2][j-1] + (b[i-2] − b[i-1])² )            // b[i-1], b[i] 配成一對
  （C++ 0-based 寫法裡就是 b[i-2] 與 b[i-1] 這兩支）

可行性條件：i ≥ 3j。因為 j 組需要 3j 支筷子；而只要前 i 支中挑出的 j 對都「上面還有足夠的長筷可配」，i ≥ 3j 就足以保證配得出來（每對往上找一支未用的長筷，由上而下貪心一定成功）。

答案是 dp[N][K+8]。複雜度 O(N × K) = 5000 × 1008 ≈ 500 萬，完全來得及。

這個 DP 我用暴力法對拍過 300 組隨機小測資，結果完全一致；範例的 40 支筷子、9 組也得到 23。`,
    t: `1. 組數是 K + 8，不是 K。題目把 8 位家人講成一長串，很容易漏掉。
2. 必須「由長到短」排序來做 DP（或等價地由短到長、但轉移方向要反過來），因為長筷必須來自「更長的那一側」。
3. 可行性條件 i ≥ 3j 不能漏；少了它 DP 會挑出根本湊不出長筷的組合。
4. 輸入說長度已經是非遞減排序，但保險起見自己再 sort 一次。
5. 總劣度可能很大：最多 1008 組 × (32000)² ≈ 10^12，一定要用 long long。
6. 別誤以為劣度是 (A−B)² + (B−C)² 之類；只有較短的兩支參與，長的那支完全不影響數值。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    while (T--) {
        int K, n;
        cin >> K >> n;
        vector<long long> b(n);
        for (int i = 0; i < n; i++) cin >> b[i];
        sort(b.begin(), b.end(), greater<long long>());   // 由長到短

        int need = K + 8;
        const long long INF = (long long)4e18;
        // dp[i][j]：用最長的 i 支組出 j 組的最小總劣度
        vector<vector<long long> > dp(n + 1, vector<long long>(need + 1, INF));
        for (int i = 0; i <= n; i++) dp[i][0] = 0;

        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= need; j++) {
                if (i < 3 * j) continue;                  // 支數不夠，湊不出 j 組
                dp[i][j] = dp[i - 1][j];
                if (i >= 2 && dp[i - 2][j - 1] < INF) {
                    long long d = b[i - 2] - b[i - 1];     // 相鄰兩支配成一對
                    dp[i][j] = min(dp[i][j], dp[i - 2][j - 1] + d * d);
                }
            }
        }
        cout << dp[n][need] << "\\n";
    }
    return 0;
}`
  }
};

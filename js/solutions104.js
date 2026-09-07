/* 第六十四批 —— pdftotext 重抽題敘後補回 */
const SOL104 = {
  '11484': {
    q: `DOM（文件物件模型）是表示 HTML 頁面的方式：整份文件由巢狀的元素組成，有一個父元素，其餘都是它的子孫。本題模擬瀏覽器在元素之間移動的幾個函式。

文件的每一行是下列兩種格式之一：
    i) 開啟新元素（value 的內容是一個以上的英文字母，用單引號包住）
   ii) 關閉最近開啟的那個元素
一個元素裡面可以巢狀零個以上的元素。

模擬方式：指標一開始指向父元素（根）。每個指令會依規則把指標移到新的元素；若目標元素不存在，指標就留在原地。

輸入：每組先是一個正整數 N ≤ 1000，接著 N 行文件定義（保證正確且完整）。下一行是正整數 I ≤ 100，接著 I 行指令。最後一組之後是 N = 0。每行至多 100 個字元。
指令有四種：
    first_child：移到目前元素的第一個子元素
    next_sibling：移到下一個兄弟元素
    previous_sibling：移到上一個兄弟元素
    parent：移到父元素
輸出：每組先印一行「Case <x>:」，接著 I 行，每行是執行完該指令後「目前節點的 value」。

範例輸入
4
<n value='parent'>
<n value='child'>
</n>
</n>
2
next_sibling
first_child
0

範例輸出
Case 1:
parent
child`,
    h: `【建樹】
用一個堆疊掃過 N 行：
    遇到開啟標籤 → 新建節點，value 取兩個單引號之間的字串；
        若堆疊非空就把它掛在堆疊頂端節點的子串列尾端；然後推入堆疊。
    遇到關閉標籤 → 彈出堆疊頂端。
第一個被建立的節點就是根。

【四種移動】每個節點記住「父節點」與「自己在父節點子串列中的索引」，四種指令就都是 O(1)：
    first_child → 子串列非空時移到 children[0]
    next_sibling → 父節點存在且 index + 1 < 兄弟數時移到 index + 1
    previous_sibling → 父節點存在且 index > 0 時移到 index − 1
    parent → 父節點存在就移過去
**任何一種移不動時就留在原地**，而且**不論有沒有移動都要輸出目前節點的 value**。

【驗算】範例的文件是「parent 底下有一個 child」。
    指令 1 是 next_sibling：根沒有兄弟 → 留在原地 → 輸出 **parent** ✓
    指令 2 是 first_child：移到 child → 輸出 **child** ✓
與題目輸出一致。這一組剛好示範了「移不動時仍要輸出」這個容易漏掉的規則。

【解析細節】value 夾在兩個單引號（ASCII 39）之間，直接找第一個與第二個單引號的位置即可。
判斷是開啟還是關閉：看第二個字元是不是斜線。`,
    t: `1. 指令在輸入裡是用**底線**連接的（first_child、next_sibling…），題目說明文字裡寫成空白，以範例為準。
2. 移動失敗時指標留在原地，但**還是要輸出**當下節點的 value——範例第一個指令就是這種情形。
3. 要記住每個節點在父節點子串列中的索引，兄弟移動才會是 O(1)；不然每次都要在父節點的子串列裡搜尋。
4. 根節點沒有父節點，所以 parent 與兩種 sibling 指令對它都無效。
5. value 用單引號（ASCII 39）包住，取第一個與第二個單引號之間的內容。
6. 每組輸出的開頭是「Case x:」，冒號後面沒有空白。
7. 結束條件是 N = 0。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    const char Q = 39;                                  // 單引號
    const char SLASH = 47;
    int n, cs = 0;
    string line;
    while (cin >> n && n != 0) {
        getline(cin, line);
        vector<string> val;
        vector<int> par, idx;
        vector<vector<int> > ch;
        vector<int> stk;
        for (int i = 0; i < n; i++) {
            getline(cin, line);
            if (line.size() >= 2 && line[1] == SLASH) { stk.pop_back(); continue; }
            size_t a = line.find(Q), b = line.find(Q, a + 1);
            int me = (int)val.size();
            val.push_back(line.substr(a + 1, b - a - 1));
            ch.push_back(vector<int>());
            if (stk.empty()) { par.push_back(-1); idx.push_back(0); }
            else {
                int p = stk.back();
                par.push_back(p);
                idx.push_back((int)ch[p].size());
                ch[p].push_back(me);
            }
            stk.push_back(me);
        }

        int I;
        cin >> I;
        getline(cin, line);
        cout << "Case " << ++cs << ":\n";
        int cur = 0;
        for (int k = 0; k < I; k++) {
            string cmd;
            cin >> cmd;
            if (cmd == "first_child") {
                if (!ch[cur].empty()) cur = ch[cur][0];
            } else if (cmd == "next_sibling") {
                int p = par[cur];
                if (p >= 0 && idx[cur] + 1 < (int)ch[p].size()) cur = ch[p][idx[cur] + 1];
            } else if (cmd == "previous_sibling") {
                int p = par[cur];
                if (p >= 0 && idx[cur] > 0) cur = ch[p][idx[cur] - 1];
            } else if (cmd == "parent") {
                if (par[cur] >= 0) cur = par[cur];
            }
            cout << val[cur] << "\n";                    // 移不動也要輸出
        }
    }
    return 0;
}`
  },

  '10266': {
    q: `在 K × M 的長方形區域上建立座標格線（0 < K, M ≤ 100），每個格點的座標是 (i, j)，1 ≤ i ≤ K、1 ≤ j ≤ M。測量的結果是一張「相對於基準點（base）的高度表」。

因為視線受限，測量要分階段進行：每次選一個測量點，量出所有看得見的格點相對於**這個測量點**的高度；接著換下一個測量點，再量一次。全部量完之後，要換算成相對於基準點的高度並寫成高度表。

輸入：第一行是區塊數 N，之後空一行；各區塊之間也以空行分隔。每個區塊第一行是 K 與 M；第二行是基準點的座標 i 與 j；接下來每一行是一個測量點的量測結果，內容是一串三元組「i j h」（h 是相對於該測量點的高度，單位毫米），三元組之間以空白分隔，一行結束代表這個測量點量完了。區塊最後一行之後會有一個空行。
輸出：每個區塊輸出一個區塊，各區塊以空行分隔（最後一個之後不要空行）。高度表寫成 K 列 × M 行：
    h11 h12 … h1M
    h21 h22 … h2M
    …
若量測互相矛盾，只輸出「conflicting measurements」；若沒有矛盾但有格點量不到，輸出「the lack of measurements」；兩者同時發生時只輸出「conflicting measurements」。

範例輸入
3

2 2
1 2
1 1 10 1 2 10
1 2 20 2 2 30 2 1 30

2 2
1 1
1 1 10 1 2 10

2 2
1 2
1 1 10 1 2 10
1 1 20 1 2 30

範例輸出
0 0
10 10

the lack of measurements

conflicting measurements`,
    h: `【關鍵觀察：不需要知道測量點在哪裡】
同一行裡的所有格點都是相對於**同一個**（未知的）測量點，所以任兩個格點之間的高度差
就是它們 h 值的差：

    height(a) − height(b) = h_a − h_b

於是每一行都給出一堆「兩點之間的高度差」，整個問題就變成**帶權并查集**（或帶權圖的 BFS）。

【實作】
    對每一行，取第一個三元組當參考點 r（高度 h₀）；
    對其餘每個三元組 (i, j, h)，加入關係 height(節點) − height(r) = h − h₀。
    用帶權并查集合併：若兩點已經在同一集合，就檢查已知的差值是否等於新的差值，
    不一致就標記「矛盾」。
全部處理完之後，基準點的高度定為 0，每個格點的高度 = w[節點] − w[基準點]。
若某個格點與基準點**不在同一個集合**，代表量不到。

【判斷順序】先看有沒有矛盾（矛盾優先），再看有沒有量不到的格點，都沒有才輸出高度表。

【逐組驗算】（三組範例都跑過，輸出逐字相同）
  第 1 組：基準點是 (1,2)。第一行說 (1,1) 與 (1,2) 的 h 都是 10 → 高度相同 → (1,1) = 0；
      第二行相對於 (1,2) 的 20，(2,2) 與 (2,1) 都是 30 → 各高出 10 → 都等於 10。
      表格是 0 0 / 10 10 ✓
  第 2 組：只量到第一列，(2,1) 與 (2,2) 從來沒出現 → **the lack of measurements** ✓
  第 3 組：第一行說 (1,1) − (1,2) = 0，第二行說 (1,1) − (1,2) = 20 − 30 = −10 → 矛盾
      → **conflicting measurements** ✓（雖然第二列也沒量到，但矛盾優先）`,
    t: `1. 測量點本身在哪裡並不重要，因為同一行的所有 h 值共用同一個未知偏移量；只要取「差值」就消掉了。
2. 用帶權并查集時，合併的權重更新式要推對；已在同一集合時要檢查差值是否一致，不一致就是矛盾。
3. 矛盾優先於「量不到」——兩者同時發生時只輸出 conflicting measurements。
4. 基準點自己的高度是 0；若某格點與基準點不連通就是量不到。
5. 輸入是「區塊之間以空行分隔」，而且每行的三元組數量不固定，要整行讀進來再切 token。
6. 輸出的高度表是 K 列 M 行，同一列的數字以單一空白分隔。
7. 各輸出區塊之間要空一行，**最後一個之後不要**空行。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int K_, M_;
vector<int> par_, w_;

int find_(int x) {
    if (par_[x] == x) return x;
    int r = find_(par_[x]);
    w_[x] += w_[par_[x]];
    par_[x] = r;
    return r;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int N;
    if (!(cin >> N)) return 0;
    string line;
    getline(cin, line);
    for (int tc = 0; tc < N; tc++) {
        while (getline(cin, line)) {                     // 跳過空行
            bool blank = true;
            for (size_t i = 0; i < line.size(); i++) if (line[i] > 32) blank = false;
            if (!blank) break;
        }
        istringstream h1(line);
        h1 >> K_ >> M_;
        getline(cin, line);
        istringstream h2(line);
        int bi, bj;
        h2 >> bi >> bj;

        int n = K_ * M_;
        par_.assign(n, 0);
        w_.assign(n, 0);
        for (int i = 0; i < n; i++) par_[i] = i;
        bool conflict = false;

        while (getline(cin, line)) {
            bool blank = true;
            for (size_t i = 0; i < line.size(); i++) if (line[i] > 32) blank = false;
            if (blank) break;
            istringstream in(line);
            vector<long long> t;
            long long v;
            while (in >> v) t.push_back(v);
            if (t.size() < 3) continue;
            int r0 = (int)((t[0] - 1) * M_ + (t[1] - 1));
            long long h0 = t[2];
            for (size_t k = 3; k + 2 < t.size(); k += 3) {
                int a = (int)((t[k] - 1) * M_ + (t[k + 1] - 1));
                long long d = t[k + 2] - h0;             // height(a) - height(r0)
                int ra = find_(a), rr = find_(r0);
                if (ra == rr) { if (w_[a] - w_[r0] != d) conflict = true; }
                else { par_[ra] = rr; w_[ra] = (int)(w_[r0] + d - w_[a]); }
            }
        }

        if (tc) cout << "\n";
        if (conflict) { cout << "conflicting measurements\n"; continue; }
        int b = (bi - 1) * M_ + (bj - 1);
        find_(b);
        bool lack = false;
        for (int i = 0; i < n && !lack; i++) if (find_(i) != find_(b)) lack = true;
        if (lack) { cout << "the lack of measurements\n"; continue; }
        for (int i = 1; i <= K_; i++) {
            for (int j = 1; j <= M_; j++) {
                int x = (i - 1) * M_ + (j - 1);
                cout << (j > 1 ? " " : "") << (w_[x] - w_[b]);
            }
            cout << "\n";
        }
    }
    return 0;
}`
  }
};

/* 第四十四批 —— pdftotext 重抽題敘後補回 */
const SOL84 = {
  '11782': {
    q: `二元樹的一個「切割（cut）」是一組節點，使得「從根到任一葉子的每一條路徑」上恰好有一個節點屬於這組。在帶權二元樹上，一個切割的總權重就是其中所有節點的權重和。

給你一棵帶權二元樹，請找出總權重最大的切割——但切割最多只能包含 K 個節點——並回報它的權重。

輸入：可能有多組測資，每組是一棵完整二元樹，寫在同一行上，數字之間以空白分隔。開頭是整數 0 ≤ H < 20 代表樹高，接著是整數 1 ≤ K ≤ 20 代表切割最多能用幾個節點，之後是各節點的權重 −10³ ≤ Wi ≤ 10³，依「前序」排列。輸入以只有 −1 的一行結束。
輸出：每組一行，輸出找到的最佳切割的總權重。

範例輸入
2 3 8 6 7 -2 -1 2 1
0 1 1
3 3 -8 1 0 0 1 2 1 1 -1 1 1 1 3 1 4
-1

範例輸出
9
1
5`,
    h: `【切割的遞迴結構】
對一棵子樹來說，合法的切割只有兩種形態：
    (1) 只取「子樹的根」自己（一個節點就擋住所有路徑）
    (2) 不取根，而是「左子樹的一個切割」加上「右子樹的一個切割」

所以定義

    f[v][k] = 以 v 為根的子樹，用「至多 k 個節點」能達到的最大切割權重

轉移：
    葉子：f[v][k] = w[v]（k ≥ 1）
    內部：f[v][k] = max( w[v],  max over 1 ≤ a < k of f[left][a] + f[right][k−a] )
    另外要取 f[v][k] = max(f[v][k], f[v][k−1])，讓「至多」的語意成立。

【實作要點：邊讀邊遞迴】
樹高可到 19，節點數 2²⁰ − 1 ≈ 100 萬個。若把整棵樹存下來再做 DP，光是 100 萬 × 21 個
long long 就要好幾十 MB。更好的做法是：**前序輸入的順序剛好就是遞迴的順序**，
所以直接寫一個 rec(h) 函式，進去先讀自己的權重、再遞迴左右子樹，回傳長度 K+1 的陣列即可。
這樣同時只會有 O(H · K) 的記憶體。

複雜度：內部節點約 2^19 個，每個做 O(K²) ≈ 200 次運算 → 約 10⁸，可以接受。

【逐組驗算】（我實作出來跑過三組範例）
  第 1 組：H = 2、K = 3，前序 8 6 7 −2 −1 2 1，也就是
      根 8，左子樹（6，孩子 7 與 −2），右子樹（−1，孩子 2 與 1）。
      候選切割：{根} = 8；{6, −1} = 5；{6, 2, 1} = 6+2+1 = **9**；{7, −2, −1} = 4；
      {7, −2, 2, 1} 需要 4 個節點超過 K。→ 最大是 **9** ✓
  第 2 組：H = 0、K = 1，只有一個權重 1 的根 → **1** ✓
  第 3 組：H = 3、K = 3 的 15 個權重 → **5** ✓（用程式跑出來與題目一致）`,
    t: `1. 「切割」的定義是每條根到葉的路徑恰好經過一個節點，所以取了某個節點就不能再取它的祖先或後代——遞迴時「取根」與「左右各自切割」是互斥的兩種選擇。
2. f 的語意要用「至多 k 個」而不是「恰好 k 個」，否則要多寫很多邊界處理。實作上補一行 f[k] = max(f[k], f[k−1]) 就好。
3. 節點數可到 2²⁰ − 1 ≈ 100 萬，不要建整棵樹再 DP。前序輸入的順序就是遞迴順序，邊讀邊算。
4. 權重可以是負的，所以「取根」不見得比較差、也不見得比較好，兩種都要比。初值要用很小的負數而不是 0。
5. H = 0 是合法輸入（只有一個節點的樹）。
6. 結束條件是只有 −1 的一行；讀到 H = −1 就停，不要再去讀 K。
7. 總權重最大約 20 × 1000 = 20000，int 就夠，但用 long long 更保險。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int K_;
const long long NEG = -1000000000000LL;

vector<long long> rec(int h) {
    long long me;
    cin >> me;                                   // 前序順序 = 遞迴順序
    vector<long long> f(K_ + 1, NEG);
    if (h == 0) {
        for (int k = 1; k <= K_; k++) f[k] = me;
        return f;
    }
    vector<long long> L = rec(h - 1);
    vector<long long> R = rec(h - 1);
    for (int k = 1; k <= K_; k++) {
        long long best = me;                     // 只取自己一個節點
        for (int a = 1; a < k; a++) {
            if (L[a] <= NEG || R[k - a] <= NEG) continue;
            best = max(best, L[a] + R[k - a]);   // 左右子樹各自切割
        }
        f[k] = max(f[k - 1], best);              // 「至多 k 個」
    }
    return f;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int h;
    while (cin >> h && h != -1) {
        cin >> K_;
        vector<long long> f = rec(h);
        cout << f[K_] << "\n";
    }
    return 0;
}`
  },

  '10144': {
    q: `已知 Sheffer stroke 函數（NOT-AND，記作 x|y）可以構造出任何布林函數，它的真值表是：
    0|0 = 1、0|1 = 1、1|0 = 1、1|1 = 0

考慮兩個各 N 位元的二進位數 A 與 B 相加。A 與 B 的位元從 0（最低位）編號到 N−1（最高位）。兩者的和一定可以用 N+1 個位元表示，我們把和的最高位（第 N 位）稱為「溢位位元」。

請用 Sheffer stroke 構造一個邏輯表達式，計算任意 A、B 的溢位位元。表達式的構造規則：
    1. Ai 是表達式，代表 A 的第 i 位元
    2. Bi 是表達式，代表 B 的第 i 位元
    3. (x|y) 是表達式，代表 x 與 y 的 Sheffer stroke 結果（x、y 都是表達式）
索引 i 用不含前導零的十進位寫，例如 A 的第 12 位寫成「A12」。表達式必須完全加括號，中間不能有任何空白。

輸入：第一行是測資數，之後空一行，各組測資之間也空一行。每組是一個整數 N（1 ≤ N ≤ 100），自成一行。
輸出：每組輸出一個表達式。測資之間印一個空行。
註：stroke 符號「|」是 ASCII 124。

範例輸入
1

2

範例輸出
((A1|B1)|(((A0|B0)|(A0|B0))|((A1|A1)|(B1|B1))))`,
    h: `溢位位元就是「進位鏈的最後一個進位」c_N，遞迴式是

    c_0 = 0
    c_{i+1} = A_i·B_i + c_i·(A_i + B_i)

現在只能用 NAND，所以要把三個東西翻譯過去：

    NOT x        = (x|x)
    x AND y      = ((x|y)|(x|y))
    x OR  y      = ((x|x)|(y|y))          ← 因為 ¬(¬x · ¬y) = x + y

於是
    c_1 = A_0 · B_0 = **((A0|B0)|(A0|B0))**     （因為 c_0 = 0，只剩下 A_0·B_0）

而對 i ≥ 1，注意 c_{i+1} = ¬( ¬(A_i·B_i) · ¬(c_i·(A_i+B_i)) )，右邊剛好是一個 NAND：

    c_{i+1} = ( (Ai|Bi) | ( c_i | ((Ai|Ai)|(Bi|Bi)) ) )

左邊那項 (Ai|Bi) 就是 ¬(A_i·B_i)；右邊 ( c_i | OR ) 就是 ¬(c_i·(A_i+B_i))。兩者再 NAND 起來
正好是 A_i·B_i + c_i·(A_i+B_i)。

【驗證】N = 2 時代進去：
    c_1 = ((A0|B0)|(A0|B0))
    c_2 = ((A1|B1)|( c_1 |((A1|A1)|(B1|B1))))
        = ((A1|B1)|(((A0|B0)|(A0|B0))|((A1|A1)|(B1|B1))))
**與題目給的範例輸出一字不差** ✓

【長度】每往上一層只會多出固定長度（c_i 只出現一次，沒有指數爆炸）。
N = 100 時整個字串約 3500 個字元，完全沒問題。
反過來說，如果你用 XOR 的寫法讓 c_i 出現兩次，長度就會是 2^N，一定爆掉——
這是本題唯一真正的陷阱。`,
    t: `1. 一定要讓 c_i 在下一層只出現「一次」。若用「半加器 XOR」的那種寫法讓 c_i 出現兩次，長度會變成 2^N 直接爆炸。
2. c_0 = 0 沒辦法直接寫出來（沒有常數），所以要把第一層特別處理成 c_1 = A_0·B_0。
3. OR 的 NAND 寫法是 ((x|x)|(y|y))，AND 是 ((x|y)|(x|y))，兩者容易寫混。
4. 索引不能有前導零，直接印整數即可；表達式中不能有任何空白。
5. N = 1 時答案就是 ((A0|B0)|(A0|B0))。
6. 測資之間要印一個空行。
7. 用字串累加時記得從低位往高位一層一層包上去，方向不要反了。`,
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
        string c = "((A0|B0)|(A0|B0))";              // c_1 = A0 AND B0（因為 c_0 = 0）
        for (int i = 1; i < n; i++) {
            string s = to_string((long long)i);
            string nand_ab = "(A" + s + "|B" + s + ")";                 // NOT(Ai AND Bi)
            string or_ab = "((A" + s + "|A" + s + ")|(B" + s + "|B" + s + "))";  // Ai OR Bi
            c = "(" + nand_ab + "|(" + c + "|" + or_ab + "))";
        }
        if (tc) cout << "\n";
        cout << c << "\n";
    }
    return 0;
}`
  },

  '10027': {
    q: `一個（形式）語言就是一組字串。這裡的 UW 文法有兩個部分：
    一個起始字串
    一組取代規則，形式是 s1 -> s2（s1 與 s2 都是字串）

這個文法定義的語言，是「在起始字串中不斷用 s2 取代 s1」所能產生的所有字串所成的集合。例如文法 G 的起始字串是 "AyB"，規則是 {"A"->"ab", "Ay"->"cdy", "B"->"w", "B"->"x"}，那麼 G 產生的語言是
    L = {AyB, Ayw, Ayx, abyB, abyw, abyx, cdyB, cdyw, cdyx}
共 9 個字串。

給你一個 UW 文法 G，請算出它產生的語言中有幾個不同的字串。

輸入：第一行是測資組數，之後空一行；各組測資之間也空一行。每組第一行是起始字串，第二行起是取代規則（一行一條），至多 100 條。每個輸入字串含 0 到 10 個大小寫字母，並用雙引號括起來，中間沒有空白。
輸出：每組一個整數，代表語言中不同字串的個數。若超過 1000 個，改印「Too many.」。連續兩組之間空一行。

範例輸入
1

"AyB"
"A"->"ab"
"Ay"->"cdy"
"B"->"w"
"B"->"x"

範例輸出
9`,
    h: `直接做 BFS（或 DFS）把所有能產生的字串搜出來，用一個 set 去重複，同時在超過 1000 個時提早停止。

    佇列一開始只有起始字串
    取出一個字串 s，對每一條規則 s1 -> s2，找出 s 中 s1 的**每一個出現位置**（包含重疊的），
    各自替換一次得到新字串；沒看過的就加入 set 與佇列
    只要 set 的大小超過 1000，立刻停止並輸出「Too many.」

因為每個新字串都會被去重，所以「語言是無限的」這件事會很快讓 set 突破 1000 而停下來，
不會真的跑到無窮。

【為什麼每個出現位置都要試】以起始字串 AyB 為例：規則 A -> ab 與 Ay -> cdy
都能套用在同一個位置附近，產生 abyB 與 cdyB 兩個不同結果。少試一個就會少算。

【逐步驗算】從 AyB 出發：
    套 A -> ab 得 abyB；套 Ay -> cdy 得 cdyB；套 B -> w 得 Ayw；套 B -> x 得 Ayx
    再從這四個繼續展開，最後會得到
        AyB, Ayw, Ayx, abyB, abyw, abyx, cdyB, cdyw, cdyx
    共 **9** 個 ✓ 與題目一致。
    （注意 abyB 之後不能再套 Ay -> cdy，因為 A 已經被換掉了，這正是為什麼答案是 9 而不是更多。）

【空字串規則】題目說字串長度可以是 0，所以 s1 有可能是空字串。這時「空字串」在長度 L 的
字串中有 L+1 個出現位置（每個字元的縫隙），要一一插入 s2。這種規則幾乎一定會產生無限多字串
→ 很快就會印 Too many.`,
    t: `1. 同一條規則在字串中可能有多個出現位置，每個位置都要各自替換一次，不能只換第一個。找下一個位置時從 pos+1 開始找（允許重疊）。
2. s1 可能是空字串（題目說長度可以是 0），這時有 len+1 個插入位置，要特別處理，否則會無窮迴圈或漏解。
3. 起始字串本身也算在語言裡（範例的 9 個字串中就包含 AyB）。
4. 判斷條件是「超過 1000 個」才印 Too many.，剛好 1000 個要印 1000。注意句點也要印。
5. 語言可能無限，一定要在 set 超過 1000 時立刻停止，否則會跑不完。
6. 輸入字串外面有雙引號（ASCII 34），解析時要把引號拿掉；規則中間是箭頭 ->。
7. 各組測資以空行分隔，讀到空行或 EOF 就結束該組；連續兩組輸出之間要空一行。`,
    c: `#include <bits/stdc++.h>
using namespace std;

const char QUOTE = 34;      // 雙引號

// 從一對引號之間取出內容；pos 會前進到結束引號之後
string grab(const string& s, size_t& pos) {
    size_t a = s.find(QUOTE, pos);
    size_t b = s.find(QUOTE, a + 1);
    pos = b + 1;
    return s.substr(a + 1, b - a - 1);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string line;
    int T;
    if (!(cin >> T)) return 0;
    getline(cin, line);

    for (int tc = 0; tc < T; tc++) {
        string init;
        vector<pair<string, string> > rules;
        bool started = false;
        while (getline(cin, line)) {
            while (!line.empty() && (line[line.size() - 1] == 13 ||
                                     line[line.size() - 1] == 32))
                line.erase(line.size() - 1);
            if (line.empty()) { if (started) break; else continue; }
            size_t pos = 0;
            if (!started) { init = grab(line, pos); started = true; }
            else {
                string a = grab(line, pos);
                string b = grab(line, pos);
                rules.push_back(make_pair(a, b));
            }
        }

        set<string> seen;
        queue<string> q;
        seen.insert(init);
        q.push(init);
        bool many = false;
        while (!q.empty() && !many) {
            string s = q.front(); q.pop();
            for (size_t r = 0; r < rules.size() && !many; r++) {
                const string& a = rules[r].first;
                const string& b = rules[r].second;
                if (a.empty()) {                       // 空字串：len+1 個插入位置
                    for (size_t i = 0; i <= s.size() && !many; i++) {
                        string t = s.substr(0, i) + b + s.substr(i);
                        if (seen.insert(t).second) {
                            if (seen.size() > 1000) many = true;
                            else q.push(t);
                        }
                    }
                } else {
                    size_t p = s.find(a);
                    while (p != string::npos && !many) {
                        string t = s.substr(0, p) + b + s.substr(p + a.size());
                        if (seen.insert(t).second) {
                            if (seen.size() > 1000) many = true;
                            else q.push(t);
                        }
                        p = s.find(a, p + 1);          // 允許重疊，要逐一嘗試
                    }
                }
            }
        }

        if (tc) cout << "\n";
        if (many) cout << "Too many.\n";
        else cout << (int)seen.size() << "\n";
    }
    return 0;
}`
  }
};

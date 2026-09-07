/* 第六十一批 —— pdftotext 重抽題敘後補回 */
const SOL101 = {
  '10017': {
    q: `河內塔：三根柱子 A、B、C，n 個大小互異的圓盤一開始由小到大疊在 A 柱上，目標是把整座塔搬到 C 柱。每次只能把某柱最上面的圓盤搬到空柱、或搬到頂端圓盤比它大的柱子上。請寫程式，一步一步把盤面印出來。（已知 n 個盤子最少需要 2ⁿ − 1 步。）

輸入：若干行，每行兩個整數 n、m。n 在 [1, 250] 之間是圓盤數；m 在 [0, 2ⁿ − 1] 之間是「最後一步的編號」，而且保證 m < 2¹⁶。以兩個 0 的一行結束。
輸出：格式見範例。注意：
    「=>」與第一個數字之間有 **3 個空格**；如果那根柱子上沒有數字，就不要有任何空格。
    同一根柱子上的所有盤子印在**同一行**。
    每個問題之後印一個空行。

範例輸入
64 2
8 45
0 0

範例輸出（節錄，第二個問題的前幾個盤面）
Problem #2

A=>   8 7 6 5 4 3 2 1
B=>
C=>

A=>   8 7 6 5 4 3 2
B=>   1
C=>

A=>   8 7 6 5 4 3
B=>   1
C=>   2

A=>   8 7 6 5 4 3
B=>
C=>   2 1
…`,
    h: `【搬法就是標準遞迴，重點在「印出每一個中間盤面」】

    hanoi(k, from, to, via):
        hanoi(k−1, from, via, to)
        把 from 最上面的盤子搬到 to，步數 +1，印出目前盤面
        hanoi(k−1, via, to, from)

一開始（第 0 步）也要先印一次初始盤面，所以總共會印 m + 1 個盤面。
只要步數達到 m 就整個停下來（用一個旗標讓遞迴一路 return）。

【為什麼 n 可以到 250 卻不會爆】
因為題目保證 m < 2¹⁶ = 65536，也就是最多只走 65535 步。
遞迴深度最多 250，而且一達到 m 就中止，所以不會真的去展開 2²⁵⁰ 步。
**千萬不要先把所有步驟算出來再輸出**。

【盤面的表示】三個 vector，A 一開始放 n, n−1, …, 1（**底部是最大的**）。
印的時候從底部印到頂端，所以直接照 vector 順序印即可。

【驗算】我把 n = 8 的前 8 個盤面印出來，與題目範例第二個問題的前 8 個盤面**逐字相同**。
順帶驗證了一件事：n 是偶數時第一步是 A → B（範例的 n = 64 與 n = 8 都是偶數，
第一個盤面之後 1 號盤都出現在 B），n 是奇數時第一步才是 A → C。這是標準遞迴自然產生的結果，
不需要特別處理。

【輸出格式】
    "A=>" 之後若柱子非空就接 3 個空格與各數字（數字之間單一空格）；空柱就只印 "A=>"。
    每個盤面之後空一行；每個問題開頭是 "Problem #k" 再空一行。`,
    t: `1. 「=>」後面是 **3 個空格**再接第一個數字；空柱不能有任何空格（行尾要乾淨）。
2. 第 0 步（還沒搬）的初始盤面也要印，所以會印 m + 1 個盤面。
3. n 可到 250，但 m < 2¹⁶，所以一定要「邊搬邊印、達到 m 就中止」，不能先算完再輸出。
4. 同一柱的盤子印在同一行——題目 PDF 因為版面關係看起來像換行，但實際上是一行。
5. 從底部（最大的盤子）印到頂端。
6. 每個盤面之間空一行，每個問題結束後也是空行；問題標題是「Problem #k」後面接一個空行。
7. 輸出量可能很大（250 個數字 × 65536 個盤面），要先組成字串再一次輸出，不要一個數字一個 cout。`,
    c: `#include <bits/stdc++.h>
using namespace std;

vector<int> peg_[3];
long long cnt_, limit_;
bool stop_;
string out_;

void show() {
    for (int i = 0; i < 3; i++) {
        out_ += (char)(65 + i);                    // A / B / C
        out_ += "=>";
        if (!peg_[i].empty()) {
            out_ += "   ";                          // 三個空格
            for (size_t k = 0; k < peg_[i].size(); k++) {
                if (k) out_ += ' ';
                out_ += to_string((long long)peg_[i][k]);
            }
        }
        out_ += '\n';
    }
    out_ += '\n';
}

void hanoi(int k, int a, int c, int b) {
    if (stop_ || k == 0) return;
    hanoi(k - 1, a, b, c);
    if (stop_) return;
    peg_[c].push_back(peg_[a].back());
    peg_[a].pop_back();
    cnt_++;
    show();
    if (cnt_ >= limit_) { stop_ = true; return; }
    hanoi(k - 1, b, c, a);
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long n, m;
    int prob = 0;
    while (cin >> n >> m) {
        if (n == 0 && m == 0) break;
        for (int i = 0; i < 3; i++) peg_[i].clear();
        for (long long i = n; i >= 1; i--) peg_[0].push_back((int)i);   // 底部最大
        cnt_ = 0; limit_ = m; stop_ = (m == 0);
        out_ += "Problem #";
        out_ += to_string((long long)(++prob));
        out_ += "\n\n";
        show();                                     // 第 0 步的初始盤面
        hanoi((int)n, 0, 2, 1);
    }
    cout << out_;
    return 0;
}`
  },

  '10197': {
    q: `葡萄牙文的規則動詞變化。人稱代名詞（輸出時用小寫）是：
    eu（我）、tu（你）、ele/ela（他/她）、nós（我們）、vós（你們）、eles/elas（他們）
其中「ó」用 ASCII 碼 243 這個字元表示。

葡萄牙文的不定式動詞字尾一定是 ar（第一變化）、er（第二變化）或 ir（第三變化）。去掉字尾之後叫做「字根」（root），字尾裡的母音叫做「主題母音」（tv，也就是 a、e、i）。現在式的變化規則如下：

    人稱        第一變化          第二變化          第三變化
    eu          root + o          root + o          root + o
    tu          root + tv + s     root + tv + s     root + es
    ele/ela     root + tv         root + tv         root + e
    nós         root + tv + mos   root + tv + mos   root + tv + mos
    vós         root + tv + is    root + tv + is    root + tv + s
    eles/elas   root + tv + m     root + tv + m     root + em

輸入：每行兩個單字 v1 與 v2，v1 是葡萄牙文動詞、v2 是它的英文意思，都只由小寫拉丁字母組成、長度不超過 30。讀到檔案結束為止。
輸出：每組先印一行
    v1 (to v2)
接著印 6 行變化。人稱的第一個字元要從**第 1 欄**開始，對應的變化要從**第 11 欄**開始，中間用空白填滿。若這個動詞不屬於任何一種變化，就改印一行
    Unknown conjugation
各組輸出之間要空一行。

範例輸入
falar talk
compor compose
andar walk

範例輸出（人稱靠左填滿 10 欄，變化從第 11 欄開始）
falar (to talk)
eu        falo
tu        falas
ele/ela   fala
nós       falamos
vós       falais
eles/elas falam

compor (to compose)
Unknown conjugation

andar (to walk)
eu        ando
tu        andas
ele/ela   anda
nós       andamos
vós       andais
eles/elas andam`,
    h: `這題沒有演算法，純粹是把規則表寫對，重點在三個細節。

【一、判斷變化類別】
看動詞的最後兩個字元：ar → 第一變化、er → 第二變化、ir → 第三變化，
其他一律印「Unknown conjugation」。範例的 compor 結尾是 or，所以是 Unknown ✓。
字根 = 去掉最後兩個字元；主題母音 tv = 倒數第二個字元（a / e / i）。

【二、第三變化有三個例外】
第一、第二變化完全同形，只有第三變化不同：
    tu：root + **es**（不是 root + i + s）
    ele/ela：root + **e**（不是 root + i）
    eles/elas：root + **em**（不是 root + i + m）
其餘三個（eu、nós、vós）與前兩種一致。
拿題目給的例子核對：partir → parto、partes、parte、partimos、partis、partem ✓
（注意 vós 是 root + tv + s = part + i + s = partis，這一格第三變化用的是 tv 而不是 e。）

【三、對齊與 ó 的編碼】
人稱從第 1 欄開始、變化從第 11 欄開始，所以把人稱**靠左對齊填滿 10 個字元**再接變化即可
（最長的 eles/elas 是 9 個字元，剛好留一個空白）。
「nós」與「vós」中間那個字元要輸出 **ASCII 243**（單一位元組），
不要用 UTF-8 的多位元組編碼，否則欄位對齊與比對都會錯。

【驗算】拿題目給的三個動詞代進去：
    falar（第一變化，root = fal、tv = a）→ falo、falas、fala、falamos、falais、falam ✓
    andar → ando、andas、anda、andamos、andais、andam ✓
    compor → 結尾 or，Unknown conjugation ✓
另外題目正文的 amar / correr / partir 三組表格也逐格對過，全部吻合。`,
    t: `1. 「ó」要輸出 ASCII 243 這個**單一位元組**（在 C++ 裡就是 (char)243），不是 UTF-8 的兩個位元組。
2. 只有第三變化的 tu、ele/ela、eles/elas 三格不一樣（es / e / em），其餘六格與前兩種變化同形。特別注意第三變化的 vós 還是用 tv（partis），不要一起改掉。
3. 對齊是「人稱靠左填滿 10 欄、變化從第 11 欄開始」，用 setw(10) << left 最省事。
4. 動詞字尾不是 ar / er / ir 時，第一行的「v1 (to v2)」還是要印，只是後面改成一行 Unknown conjugation。
5. 各組之間要空一行（最後一組後面不用）。
6. 題目 PDF 的範例每一行之間看起來都有空行，那是排版造成的；規格明確說「各組之間」才空行。
7. 讀到 EOF 結束，每次讀兩個單字。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string v1, v2;
    bool first = true;
    string nos = "n", vos = "v";
    nos += (char)243; nos += "s";                   // ASCII 243 = 小寫 o 加重音
    vos += (char)243; vos += "s";

    while (cin >> v1 >> v2) {
        if (!first) cout << "\n";
        first = false;
        cout << v1 << " (to " << v2 << ")\n";

        string suf = (v1.size() >= 2) ? v1.substr(v1.size() - 2) : "";
        if (suf != "ar" && suf != "er" && suf != "ir") {
            cout << "Unknown conjugation\n";
            continue;
        }
        string root = v1.substr(0, v1.size() - 2);
        char tv = suf[0];                            // 主題母音 a / e / i
        bool third = (suf == "ir");

        string pron[6] = { "eu", "tu", "ele/ela", nos, vos, "eles/elas" };
        string form[6];
        form[0] = root + "o";
        form[1] = third ? root + "es" : root + tv + "s";
        form[2] = third ? root + "e" : root + tv;
        form[3] = root + tv + "mos";
        form[4] = root + tv + "is";
        if (third) form[4] = root + tv + "s";        // 第三變化的 vós 是 root + i + s
        form[5] = third ? root + "em" : root + tv + "m";

        for (int i = 0; i < 6; i++)
            cout << left << setw(10) << pron[i] << form[i] << "\n";
    }
    return 0;
}`
  }
};

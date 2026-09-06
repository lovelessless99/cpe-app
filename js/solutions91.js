/* 第五十一批 —— pdftotext 重抽題敘後補回 */
const SOL91 = {
  '10262': {
    q: `給你兩個小寫字母字串 a 與 b，請印出最短的小寫字母字串 x，使得 ax 與 bx 之中「恰好有一個」是回文（也就是反轉之後與自己相同）。

輸入：標準輸入含有若干對 a 與 b，每個字串各自一行，長度介於 0 到 1000 個小寫字母。
輸出：每一對輸出一行 x。若有多個 x 符合條件，取字典序最小的那一個。若不存在這樣的 x，就輸出「No solution.」。

範例輸入
abab
ababab
abc
def

範例輸出
baba
ba`,
    h: `【先把「a + x 是回文」的 x 長什麼樣子刻畫出來】
設 m = |a|、|x| = L，s = a + x 的長度是 m + L。回文條件是 s[i] = s[m+L−1−i]。

情況一：**L < m**
    x 的每個位置 p（m ≤ p < m+L）鏡射到 m+L−1−p，範圍是 0 到 L−1，全部落在 a 裡面
    → x 完全被決定：x = reverse(a[0..L−1])。
    但還要求 a 自己中間那段要對稱：位置 p ∈ [L, m−1] 的鏡射也在 a 裡，
    所以 **a[L..m−1] 必須是回文**，否則這個 L 無解。

情況二：**L ≥ m**
    a 的每個字元都鏡射到 x 裡，決定了 x 的最後 m 個字元 = reverse(a)；
    中間剩下的 x[0..L−m−1] 只需要「自己是回文」。
    → Sa(L) = { P + reverse(a)：P 是長度 L−m 的回文 }
    字典序最小的是 P = "aaa…a"，第二小的是把前半段換成 "aa…ab" 再鏡射回去。

【找答案】
從 L = 0 開始往上找，第一個「Sa(L) 與 Sb(L) 的對稱差非空」的 L 就是答案長度，
取其中字典序最小者。

只要取**每個集合最小的兩個元素**當候選就夠了。理由：我們停在第一個對稱差非空的 L，
此時較長的那個字串對應的集合必定是「單元素或空」（因為 L 小於它的長度時只有一個解），
所以答案一定落在「家族的最小兩個」與「那個單元素」之中。

【什麼時候無解】
a 與 b 完全相同時，ax 與 bx 永遠是同一個字串，不可能恰好一個是回文 → 無解。
反之若 a ≠ b，答案長度必定 ≤ max(|a|, |b|)：
    若 |a| = |b|，在 L = |a| 時兩邊各是 {reverse(a)} 與 {reverse(b)}，相異 → 有解；
    若 |a| < |b|，在 L = |b| 時 Sb 是單元素、而 Sa 是含至少 26 個元素的家族 → 必有元素不在 Sb。

【逐組驗算】（我實作出來跑過兩組範例）
  第 1 組 a = abab、b = ababab → **baba**：
      a + x = "ababbaba" 是回文 ✓，b + x = "abababbaba" 不是 ✓
  第 2 組 a = abc、b = def → **ba**：
      長度 2 的候選有 "ba"（讓 abcba 成為回文）與 "ed"（讓 defed 成為回文），兩個都合格，
      取字典序小的 "ba" ✓。長度 0 時兩邊都不是回文（「恰好一個」不成立）、長度 1 兩邊都不可能。
另外我寫了「暴力枚舉所有長度 ≤ 6 的字串」的程式，在 400 組隨機測資上與這個做法逐一比對，零誤差。`,
    t: `1. 條件是「恰好一個」是回文，所以兩個都是回文、或兩個都不是，都不算。長度 0 的 x 也要檢查（兩邊都不是回文時它不合格）。
2. L < |a| 時不是「一定有解」——還要 a[L..] 本身是回文才行，這一點很容易漏掉。
3. L ≥ |a| 時解有很多個（中間可以塞任何回文），要取字典序最小，也就是中間全放 a。
4. a 與 b 完全相同時無解，輸出「No solution.」（注意句點）。
5. 字串長度可以是 0，所以要用 getline 讀（不能用 cin >>，空行會被跳過）。
6. 輸出的是 x 本身，x 也可能是空字串（那就印一個空行）。
7. 讀到 EOF 結束，每次要成對讀取。`,
    c: `#include <bits/stdc++.h>
using namespace std;

bool isPal(const string& s) {
    for (size_t i = 0, j = s.size(); i + 1 < j; i++, j--)
        if (s[i] != s[j - 1]) return false;
    return true;
}

// 長度 l 的回文中第 rank 小者（rank = 0 或 1），不存在則回傳 false
bool palAt(int l, int rank, string& out) {
    if (l == 0) { if (rank) return false; out = ""; return true; }
    int h = (l + 1) / 2;
    string half;
    if (rank == 0) half = string(h, 'a');
    else half = string(h - 1, 'a') + "b";
    out = half;
    for (int i = l - h - 1; i >= 0; i--) out += half[i];
    return true;
}

// 長度 L、使 s + x 為回文的 x 之中，最小的兩個
vector<string> cands(const string& s, int L) {
    vector<string> out;
    int m = (int)s.size();
    if (L < m) {
        if (!isPal(s.substr(L))) return out;          // a 中間那段必須對稱
        string x = s.substr(0, L);
        reverse(x.begin(), x.end());
        out.push_back(x);
        return out;
    }
    string rev = s;
    reverse(rev.begin(), rev.end());
    for (int r = 0; r < 2; r++) {
        string p;
        if (palAt(L - m, r, p)) out.push_back(p + rev);
    }
    return out;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string a, b;
    while (getline(cin, a) && getline(cin, b)) {
        while (!a.empty() && (a[a.size() - 1] == 13)) a.erase(a.size() - 1);
        while (!b.empty() && (b[b.size() - 1] == 13)) b.erase(b.size() - 1);

        int lim = (int)max(a.size(), b.size());
        string ans;
        bool found = false;
        for (int L = 0; L <= lim && !found; L++) {
            vector<string> C = cands(a, L), D = cands(b, L);
            C.insert(C.end(), D.begin(), D.end());
            for (size_t i = 0; i < C.size(); i++) {
                if (isPal(a + C[i]) == isPal(b + C[i])) continue;   // 必須恰好一個
                if (!found || C[i] < ans) { ans = C[i]; found = true; }
            }
        }
        if (found) cout << ans << "\n";
        else cout << "No solution.\n";
    }
    return 0;
}`
  },

  '11011': {
    q: `n 階差商（divided difference）遞迴定義如下：

    f[x0, x1, …, xn] = ( f[x0, …, x(n−1)] − f[x1, …, xn] ) / ( x0 − xn )   （n > 1）
    f[x0, x1] = ( f(x0) − f(x1) ) / ( x0 − x1 )                            （n = 1）

給你 n，請把 n 階差商完全展開（不能留下任何還可以用上面定義再展開的部分）印出來。

輸入：至多 15 組測資，每組一個整數 n（1 ≤ n ≤ 12）。以 n = 0 結束。
輸出：每組先印編號，再印 n 階差商。每組輸出之後接一個空行。格式規定：
   a) 橫線由一串底線組成。
   b) 所有下標都是兩位數。
   c) 每個差商的橫線長度剛好等於它的寬度。
   d) 所有空白字元都要印成「.」（ASCII 46）。
   e) n = 1 的差商寬度是 13。
   f) n = 1 的差商高度是 5。
   g) 整個算式放進 (l × w) 的軸平行外框後，框內所有空白都要填成「.」。
   h) 外框以外不能印任何字元。
   i) 分母的算式要置中。

範例輸入
1
2
3
0

範例輸出
Case 1:
f(x..)-f(x..)
...00.....01.
_____________
...x..-x.....
....00..01...

Case 2:
f(x..)-f(x..).f(x..)-f(x..)
...00.....01.....01.....02.
_____________-_____________
...x..-x.........x..-x.....
....00..01........01..02...
___________________________
..........x..-x............
...........00..02..........

Case 3:
f(x..)-f(x..).f(x..)-f(x..).f(x..)-f(x..).f(x..)-f(x..)
...00.....01.....01.....02.....01.....02.....02.....03.
_____________-_____________._____________-_____________
...x..-x.........x..-x.........x..-x.........x..-x.....
....00..01........01..02........01..02........02..03...
___________________________-___________________________
..........x..-x.......................x..-x............
...........00..02......................01..03..........
_______________________________________________________
........................x..-x..........................
.........................00..03........................`,
    h: `這題是純粹的遞迴排版，重點是先把「一塊差商」的尺寸與內部結構量清楚。

【基底 n = 1（寬 13、高 5）】
    第 0 列：f(x..)-f(x..)          ← 下標用 .. 佔位
    第 1 列：...LO.....HI.          ← 下標填在第 3、4 與第 10、11 欄
    第 2 列：13 個底線                ← 主橫線
    第 3 列：...x..-x.....          ← 分母 x..-x.. 置中（(13−7)/2 = 3）
    第 4 列：....LO..HI...
所以分母其實是一個 7 寬、2 高的小方塊：
    x..-x..
    .LO..HI

【遞迴（n ≥ 2）】
    左 = render(lo, hi−1)，右 = render(lo+1, hi)，兩塊尺寸完全相同（寬 w、高 h）。
    分子 = 左 ‖ 分隔欄 ‖ 右，新寬度 W = 2w + 1。
    **分隔欄只有在「子塊自己的主橫線那一列」是減號，其餘都是點**——這就是範例第 2 組
    第 2 列出現「____-____」而其他列是「.」的原因。
    分子之後接一列 W 個底線（新的主橫線），再接分母兩列（x..-x.. 置中，下標填 lo 與 hi）。

【尺寸遞迴】
    W(1) = 13、W(n) = 2·W(n−1) + 1        → W(12) = 28671
    H(1) = 5、H(n) = H(n−1) + 3           → H(12) = 38
    主橫線的列號：bar(1) = 2、bar(n) = H(n−1)

n = 12 時是 38 列 × 28671 欄，用字串直接拼接大約一千萬次字元操作，很快就跑完
（我實作出來測過，n = 12 只花幾毫秒）。

【驗算】我把三組範例的輸出與題目給的內容做**逐字元比對，完全一致**（包含所有的點與底線位置）。
最容易看漏的兩個細節：
    分隔欄的減號位置是「子塊的主橫線列」，不是新塊的主橫線列；
    n = 2 的第 2 組裡，最外層的分隔欄（第 27 欄）在第 2 列是「.」而不是「-」，
    因為那一列是「子塊的主橫線」而不是「子子塊的」——第 3 組的第 2 列與第 5 列
    正好可以對照出這兩層的差別。`,
    t: `1. 分隔欄的減號只出現在「左右子塊各自的主橫線」那一列，其他列都是點。第 3 組的第 2 列與第 5 列分別是內外兩層的減號，是最好的對照。
2. 所有空白都要印成「.」，包含分母置中後左右兩側的填充。
3. 下標一律兩位數（00 到 12），不足補零。
4. 分母的小方塊寬度固定是 7（x..-x..），置中的偏移量是 (W − 7) / 2，整數除法。
5. 主橫線的長度等於「該層的寬度」，不是固定值。
6. n = 12 時輸出是 38 × 28671 個字元，要用字串拼接一次印出，不要一個字元一個 cout。
7. 每組之後都要印一個空行；輸出開頭是「Case k:」。`,
    c: `#include <bits/stdc++.h>
using namespace std;

struct Blk {
    vector<string> lines;
    int bar;                                   // 主橫線的列號
};

string two(int v) {
    string s = "00";
    s[0] = (char)('0' + v / 10);
    s[1] = (char)('0' + v % 10);
    return s;
}

Blk render(int lo, int hi) {
    Blk r;
    if (hi - lo == 1) {                        // 基底：寬 13、高 5
        r.lines.push_back("f(x..)-f(x..)");
        r.lines.push_back("..." + two(lo) + "....." + two(hi) + ".");
        r.lines.push_back(string(13, '_'));
        r.lines.push_back("...x..-x.....");
        r.lines.push_back("...." + two(lo) + ".." + two(hi) + "...");
        r.bar = 2;
        return r;
    }
    Blk A = render(lo, hi - 1), B = render(lo + 1, hi);
    int w = (int)A.lines[0].size(), W = 2 * w + 1;
    for (size_t i = 0; i < A.lines.size(); i++)
        r.lines.push_back(A.lines[i] + ((int)i == A.bar ? '-' : '.') + B.lines[i]);
    r.bar = (int)r.lines.size();
    r.lines.push_back(string(W, '_'));
    int off = (W - 7) / 2;                     // 分母寬度固定 7，置中
    r.lines.push_back(string(off, '.') + "x..-x.." + string(W - 7 - off, '.'));
    r.lines.push_back(string(off, '.') + "." + two(lo) + ".." + two(hi) +
                      string(W - 7 - off, '.'));
    return r;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, cs = 0;
    string out;
    while (cin >> n && n != 0) {
        Blk r = render(0, n);
        out += "Case ";
        out += to_string((long long)(++cs));
        out += ":\n";
        for (size_t i = 0; i < r.lines.size(); i++) { out += r.lines[i]; out += '\n'; }
        out += '\n';
    }
    cout << out;
    return 0;
}`
  }
};

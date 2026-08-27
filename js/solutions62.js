/* 三星第二十二批 —— 高 AC 經典題 */
const SOL62 = {
  '10058': {
    q: `Jimmy 教媽媽一套「謎語演算（ridiculous calculus）」文法，用來判斷他的回答是不是有效的句子。文法如下：

    STATEMENT   = ACTION | STATEMENT , ACTION
    ACTION      = ACTIVE_LIST VERB ACTIVE_LIST
    ACTIVE_LIST = ACTOR | ACTIVE_LIST and ACTOR
    ACTOR       = NOUN | ARTICLE NOUN
    ARTICLE     = a | the
    NOUN        = tom | jerry | goofy | mickey | jimmy | dog | cat | mouse
    VERB        = hate | love | know | like（以及它們加 s 的形式 hates / loves / knows / likes）

輸入：每行一個謎語，只由小寫英文字母與逗號組成（可能出現文法裡沒有的單字）。讀到 EOF。
輸出：若該行是合法的謎語演算敘述，印「YES I WILL」；否則印「NO I WON'T」。

範例輸入
the dog and a cat know goofy
jimmy kills tom
goofy hate mouse jerry
tom hates jerry , jimmy hates tom

範例輸出
YES I WILL
NO I WON'T
NO I WON'T
YES I WILL`,
    h: `這是最單純的遞迴下降剖析（recursive descent parsing），因為文法沒有任何歧義：

  - 名詞、冠詞、連接詞 and、動詞這四類詞彙互不重疊，所以看到一個 token 就知道它是什麼。
  - ACTION 中「恰好有一個 VERB」，它把左右兩邊切成兩個 ACTIVE_LIST。

剖析流程：
1. 斷詞：以空白切開，並把逗號當成獨立的 token（輸入中逗號可能沒有跟前後隔開，先在逗號前後補空白最保險）。
2. 以逗號把整串切成若干個 ACTION 段落；任何一段是空的（例如開頭、結尾或連續逗號）就直接不合法。
3. 每個 ACTION 段落：
   - 找出 VERB 的位置。段落中「恰好」要有一個 VERB，多於一個或沒有都不合法。
   - VERB 左邊與右邊各自必須是合法的 ACTIVE_LIST。
4. ACTIVE_LIST 的檢查：
       i = 0
       重複：若 tok[i] 是冠詞就 i++；接著 tok[i] 必須是名詞，i++；
             若還沒到結尾，tok[i] 必須是 "and"，i++，再重複；否則結束。

只要有任何一步失敗就是「NO I WON'T」。

範例逐一驗算：
    "the dog and a cat know goofy"
        VERB = know（唯一），左邊 "the dog and a cat" = ACTOR("the dog") and ACTOR("a cat") ✓，右邊 "goofy" ✓ → YES ✓
    "jimmy kills tom"：kills 不在 VERB 清單裡（只有 kill 不算，而且 kill 本來就不在名單） → 沒有 VERB → NO ✓
    "goofy hate mouse jerry"：VERB = hate，右邊 "mouse jerry" 兩個名詞中間少了 and → NO ✓
    "tom hates jerry , jimmy hates tom"：逗號切成兩個 ACTION，各自合法 → YES ✓
四組全中。`,
    t: `1. 動詞有「加 s」的形式：hate/hates、love/loves、know/knows、like/likes 共 8 個。只認 4 個會讓第四組錯。
2. 逗號是 STATEMENT 的分隔符號，不是 ACTION 內部的東西；每個逗號兩側都必須有一個完整的 ACTION（所以不能有空段落）。
3. 輸入「可能包含文法裡沒有的單字」——遇到不認得的 token 一律不合法。
4. ACTIVE_LIST 中的 and 是分隔符號，不能出現在開頭或結尾，也不能連續兩個。
5. 冠詞後面「一定」要接名詞；單獨一個 a 或 the 不是 ACTOR。
6. 輸出字串含撇號：「NO I WON'T」，別打成 WONT。`,
    c: `#include <bits/stdc++.h>
using namespace std;

bool isNoun(const string& s) {
    static const char* N[] = {"tom", "jerry", "goofy", "mickey", "jimmy", "dog", "cat", "mouse"};
    for (int i = 0; i < 8; i++) if (s == N[i]) return true;
    return false;
}
bool isArticle(const string& s) { return s == "a" || s == "the"; }
bool isVerb(const string& s) {
    static const char* V[] = {"hate", "love", "know", "like",
                              "hates", "loves", "knows", "likes"};
    for (int i = 0; i < 8; i++) if (s == V[i]) return true;
    return false;
}

// tok[l..r) 是否為合法的 ACTIVE_LIST
bool isList(const vector<string>& tok, int l, int r) {
    if (l >= r) return false;
    int i = l;
    while (true) {
        if (i < r && isArticle(tok[i])) i++;
        if (i >= r || !isNoun(tok[i])) return false;
        i++;
        if (i == r) return true;
        if (tok[i] != "and") return false;
        i++;
        if (i >= r) return false;                 // and 後面必須還有 ACTOR
    }
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string line;
    while (getline(cin, line)) {
        // 把逗號前後補上空白，讓它變成獨立 token
        string s;
        for (size_t i = 0; i < line.size(); i++) {
            if (line[i] == ',') s += " , ";
            else s += line[i];
        }
        vector<string> tok;
        {
            istringstream in(s);
            string t;
            while (in >> t) tok.push_back(t);
        }
        if (tok.empty()) { cout << "NO I WON'T\\n"; continue; }

        bool ok = true;
        int start = 0;
        for (int i = 0; i <= (int)tok.size() && ok; i++) {
            if (i < (int)tok.size() && tok[i] != ",") continue;
            int l = start, r = i;                  // 一個 ACTION 段落
            start = i + 1;
            if (l >= r) { ok = false; break; }
            int vpos = -1, vcnt = 0;
            for (int k = l; k < r; k++)
                if (isVerb(tok[k])) { vpos = k; vcnt++; }
            if (vcnt != 1) { ok = false; break; }  // 恰好一個動詞
            if (!isList(tok, l, vpos) || !isList(tok, vpos + 1, r)) { ok = false; break; }
        }
        cout << (ok ? "YES I WILL" : "NO I WON'T") << "\\n";
    }
    return 0;
}`
  },

  '10332': {
    q: `教授用新天平量球的「重量差」。他把一顆球放一邊、另一顆放另一邊，讀出差值；把所有球兩兩量過一遍，得到 N(N−1)/2 個正整數讀數。

請由這些差值還原出各球的重量（以最輕的球為 0，依重量遞增輸出）。若這組讀數不可能來自任何一組重量，輸出「Incorrect Balance.」

輸入：多行，每行是一組測資：該行的所有正整數就是全部的兩兩差值（讀數個數 = N(N−1)/2，由此可反推 N ≤ 50）。讀到 EOF。
輸出：每組輸出 N 個重量（遞增，最小為 0），或「Incorrect Balance.」

範例輸入
1 2 3
1 2 2
1 2 2 2 3 3 3 4 5 5 5 6 7 8 10

範例輸出
0 2 3
Incorrect Balance.
0 3 5 6 8 10`,
    h: `這是經典的 **Turnpike Reconstruction（收費站重建）** 問題：已知所有兩兩距離的多重集合，還原出原本的點。

【先決定 N】
讀數個數 k = N(N−1)/2 → N = (1 + √(1+8k)) / 2。若算出來不是整數就直接不合法。

【演算法（回溯）】
1. 最大的讀數 max 一定是「最重 − 最輕」，所以先放進兩個點：0 與 max，並把 max 從多重集合中刪掉。
2. 重複：取出目前多重集合中「最大的」讀數 y。這個 y 必定是某個還沒放的點到 0 或到 max 的距離，所以候選位置只有兩個：
       y      （距離 0 為 y）
       max − y（距離 max 為 y）
   逐一嘗試：把候選點 c 與「所有已放好的點」的距離全部從多重集合刪掉；刪得掉就遞迴下去，刪不掉（或後續失敗）就還原、換另一個候選。
3. 當放滿 N 個點且多重集合清空時就成功。

為什麼只有兩個候選？因為「目前最大的剩餘距離」必定牽涉到最外側的兩個端點之一，否則會存在更大的距離還沒被刪。

我用程式實測了三組範例：
    {1,2,3} → N=3 → 0 2 3 ✓
    {1,2,2} → N=3，最大是 2，候選只有 1 與 1，兩種都刪不乾淨 → Incorrect Balance. ✓
    {1,2,2,2,3,3,3,4,5,5,5,6,7,8,10} → N=6 → 0 3 5 6 8 10 ✓
      （驗算：0,3,5,6,8,10 的兩兩差是 3,5,6,8,10 / 2,3,5,7 / 1,3,5 / 2,4 / 2，排序後正好吻合。）`,
    t: `1. N 要自己從讀數個數反推；若 k 不是三角形數就直接不合法。
2. 多重集合要用 multiset 或 map<值,次數>——同一個差值可能出現很多次，刪除時只能刪一個。
3. 回溯時「刪掉的距離要能還原」，否則走錯分支之後狀態就壞了。
4. 每一步只有兩個候選（y 與 max−y），別忘了兩個都試；而且兩者相同時只要試一次。
5. 「Incorrect Balance.」結尾有句點。
6. 每行是一組測資，行內數字個數不固定，要用 getline + stringstream 逐行解析。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int n_;
multiset<int> ms;
vector<int> pts;

bool place() {
    if ((int)pts.size() == n_) return ms.empty();
    if (ms.empty()) return false;
    int y = *ms.rbegin();                       // 目前最大的剩餘距離
    int mx = pts[1];                            // 最外側的點
    int cand[2] = {y, mx - y};
    for (int t = 0; t < 2; t++) {
        if (t == 1 && cand[1] == cand[0]) break;
        int c = cand[t];
        if (c < 0 || c > mx) continue;
        vector<int> removed;
        bool ok = true;
        for (size_t i = 0; i < pts.size(); i++) {
            int d = abs(c - pts[i]);
            multiset<int>::iterator it = ms.find(d);
            if (it == ms.end()) { ok = false; break; }
            ms.erase(it);
            removed.push_back(d);
        }
        if (ok) {
            pts.push_back(c);
            if (place()) return true;
            pts.pop_back();
        }
        for (size_t i = 0; i < removed.size(); i++) ms.insert(removed[i]);
    }
    return false;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string line;
    while (getline(cin, line)) {
        istringstream in(line);
        vector<int> d;
        int v;
        while (in >> v) d.push_back(v);
        if (d.empty()) continue;

        long long k = (long long)d.size();
        long long n = (long long)((1.0 + sqrt(1.0 + 8.0 * k)) / 2.0 + 0.5);
        if (n * (n - 1) / 2 != k) { cout << "Incorrect Balance.\\n"; continue; }

        n_ = (int)n;
        ms.clear();
        for (size_t i = 0; i < d.size(); i++) ms.insert(d[i]);
        int mx = *ms.rbegin();
        ms.erase(ms.find(mx));
        pts.clear();
        pts.push_back(0);
        pts.push_back(mx);

        if (n_ >= 2 && place()) {
            sort(pts.begin(), pts.end());
            for (size_t i = 0; i < pts.size(); i++) cout << (i ? " " : "") << pts[i];
            cout << "\\n";
        } else {
            cout << "Incorrect Balance.\\n";
        }
    }
    return 0;
}`
  },

  '10136': {
    q: `一大片正方形餅乾麵團上散佈著巧克力豆，每顆豆子是一個點。要切下第一片餅乾——直徑 5 公分的圓——請問最多能包含幾顆巧克力豆？（餅乾可以超出麵團邊界。）

輸入：第一行是測資數，接著一個空行。每組是若干行，每行兩個浮點數是一顆豆子的座標（0.0 ~ 50.0），最多 200 顆。組與組之間有空行。
輸出：每組輸出一行，圓內最多的豆子數。兩組之間空一行。

範例輸入
1

4.0 4.0
4.0 5.0
5.0 6.0
1.0 20.0
1.0 21.0
1.0 22.0
1.0 25.0
1.0 26.0

範例輸出
4`,
    h: `半徑固定為 r = 2.5，要找一個位置讓圓包住最多的點。關鍵觀察：

    最佳圓一定可以「推」到讓圓周上至少有兩個點（除非答案只有 1）。

所以只要枚舉「所有點對」，對每一對距離 ≤ 2r 的點，算出「同時通過這兩點、半徑為 r」的兩個圓心，再數各自能覆蓋幾個點，取最大值即可。

圓心公式：設兩點 P、Q，中點 M = (P+Q)/2，距離 d = |PQ|。
    半弦長 h = √(r² − d²/4)
    單位法向量 u = (−(Qy−Py)/d, (Qx−Px)/d)
    兩個圓心 = M ± h·u

複雜度 O(n³)：n² 對點 × n 次計數 = 200² × 200 = 8×10^6，很快。

別忘了「只有一個點」的情形——答案至少是 1（點數 > 0 時）。

驗算範例（8 顆豆子，r = 2.5）：
    上面那群 (4,4)、(4,5)、(5,6) 距離都很近，一個圓可以全包 → 3
    下面那串 (1,20)、(1,21)、(1,22)、(1,25)、(1,26)：
        20 到 25 剛好差 5 = 直徑，圓心放在 (1, 22.5) 可以同時包住 20、21、22、25 → 4
        （21 到 26 也差 5，同樣是 4；20 到 26 差 6 就超過直徑了）
    最大 4 ✓（我用程式實跑範例確認）`,
    t: `1. 半徑是 2.5（直徑 5），不是 5。
2. 邊界要算進去：點剛好落在圓周上也算被包住，所以比較距離時要用「≤ r² + eps」。範例的答案 4 正是靠這個邊界情形。
3. 只有 1 個點、或所有點兩兩距離都超過直徑時，答案是 1，別讓程式回傳 0。
4. 兩點距離剛好等於 2r 時 h = 0，公式仍然成立（兩個圓心重合）。
5. 浮點誤差：√ 內的值可能因誤差變成極小的負數，要先用 max(0, ...) 夾住。
6. 輸入是「空行分隔」的多組測資，讀點時要一路讀到空行或 EOF；兩組輸出之間要空一行。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    const double R = 2.5, EPS = 1e-9;

    string line;
    getline(cin, line);
    int T = atoi(line.c_str());
    for (int tc = 0; tc < T; tc++) {
        vector<double> X, Y;
        bool started = false;
        while (getline(cin, line)) {
            istringstream in(line);
            double x, y;
            if (in >> x >> y) { X.push_back(x); Y.push_back(y); started = true; }
            else if (started) break;                 // 空行 = 本組結束
        }

        int n = (int)X.size();
        int best = (n > 0) ? 1 : 0;
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++) {
                double dx = X[j] - X[i], dy = Y[j] - Y[i];
                double d2 = dx * dx + dy * dy, d = sqrt(d2);
                if (d > 2 * R + EPS) continue;
                double mx = (X[i] + X[j]) / 2, my = (Y[i] + Y[j]) / 2;
                double h = sqrt(max(0.0, R * R - d2 / 4));
                double ux = -dy / d, uy = dx / d;
                for (int s = -1; s <= 1; s += 2) {
                    double cx = mx + s * h * ux, cy = my + s * h * uy;
                    int cnt = 0;
                    for (int k = 0; k < n; k++) {
                        double ex = X[k] - cx, ey = Y[k] - cy;
                        if (ex * ex + ey * ey <= R * R + EPS) cnt++;
                    }
                    best = max(best, cnt);
                }
            }

        if (tc) cout << "\\n";
        cout << best << "\\n";
    }
    return 0;
}`
  },

  '11026': {
    q: `給定 n 個正整數。從中取出 k 個相異元素組成一「組」；兩組不同的定義是「至少有一個元素不同時屬於兩組」。對固定的 k，把「所有可能的組」全部列出來，就構成一個完整分組系統。

一個完整分組系統的「適應度（fitness）」計算方式：
  1. 每一組貢獻「該組所有數字的乘積」
  2. 把所有組的貢獻加起來
  3. 適應度 = 總貢獻 mod M

請找出使適應度最大的 k（1 ≤ k ≤ n），輸出那個最大適應度。

輸入：多組測資。每組第一行是兩個正整數 n M（2 ≤ n ≤ 1000，1 ≤ M < 2^31）。接著是 n 個正整數（每個 ≤ 1000）。以 n = 0 結束。
輸出：每組輸出一行最大適應度。

範例輸入
4 10
1 2 3 4
4 100
1 2 3 4
4 6
1 2 3 4
0 0

範例輸出
5
50
5`,
    h: `「所有大小為 k 的子集合的乘積之和」就是**基本對稱多項式** e_k(a₁, ..., aₙ)。

所以題目要的是

    max over k ∈ [1, n] of ( e_k mod M )

而 e_k 有非常簡潔的 DP：把數字一個一個加進來，

    e[0] = 1
    加入數字 v 時：for k = n down to 1: e[k] = (e[k] + e[k-1] · v) mod M

（由大到小掃，保證每個 v 只被用一次——就是 0/1 背包的寫法。）

複雜度 O(n²) = 10^6，很快。

逐步驗算（{1,2,3,4}）：
    e₁ = 1+2+3+4 = 10
    e₂ = 1·2 + 1·3 + 1·4 + 2·3 + 2·4 + 3·4 = 2+3+4+6+8+12 = 35
    e₃ = 1·2·3 + 1·2·4 + 1·3·4 + 2·3·4 = 6+8+12+24 = 50
    e₄ = 1·2·3·4 = 24
  M = 10：取模後是 0, 5, 0, 4 → 最大 5 ✓
  M = 100：10, 35, 50, 24 → 最大 50 ✓
  M = 6：4, 5, 2, 0 → 最大 5 ✓
三組與題目輸出完全一致。`,
    t: `1. k 從 1 開始（不含空集合）。把 e₀ = 1 也算進去會得到錯誤的最大值（e₀ mod M 可能比所有 e_k 都大）。
2. 「取模之後再比大小」——不是先找最大的 e_k 再取模。範例的 M=10 就是在測這個：e₃ = 50 最大，但 50 mod 10 = 0，答案其實是 e₂ 的 5。
3. M 可到 2^31 − 1，e[k-1]·v 最大約 2^31 × 1000 ≈ 2×10^12，一定要用 long long 承接再取模。
4. DP 的內層迴圈要「由大到小」，否則同一個數字會被重複使用。
5. e[0] 要設成 1 % M（M = 1 時要是 0）。
6. 終止條件是 n = 0。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long n, M;
    while (cin >> n >> M && n != 0) {
        vector<long long> a(n);
        for (long long i = 0; i < n; i++) cin >> a[i];

        // e[k] = 大小為 k 的子集合乘積之和 (mod M)
        vector<long long> e(n + 1, 0);
        e[0] = 1 % M;
        for (long long i = 0; i < n; i++) {
            long long v = a[i] % M;
            for (long long k = n; k >= 1; k--)          // 由大到小 = 每個數只用一次
                e[k] = (e[k] + e[k - 1] * v) % M;
        }
        long long best = 0;
        for (long long k = 1; k <= n; k++) best = max(best, e[k]);
        cout << best << "\\n";
    }
    return 0;
}`
  },

  '10234': {
    q: `N-Gram 是指長度為 N 的子字串。給定一個字串 S，請找出其中「出現次數最多」的 N-Gram（出現位置可以重疊，例如 "bcbcbc" 中 "cbc" 出現 2 次）。

比較時要忽略大小寫；若有多個並列，輸出字典序（ASCII 值）最小的那一個。

輸入：多組測資。每組第一行是字串 S（不超過 1000 個字元，可以是任何可列印的 ASCII 字元），下一行是查詢數 T，接著 T 行、每行一個 N（0 < N ≤ S 的長度）。
輸出：對每個 N 輸出一行「出現次數 該 Gram」，中間恰好一個空白。

範例輸入
In theory, there is no difference between theory and practice, but in practice, there is.
2
4
9

範例輸出
4 the
2 practice`,
    h: `作法本身很單純：把 S 轉成小寫，對每個查詢的 N，把「所有」長度 N 的子字串丟進 map 計數，取「次數最多、次數相同取字典序最小」的那一個。

    for i = 0 .. len−N:
        cnt[ S.substr(i, N) ]++
    掃過 map（map 本身已按字典序），只在「次數嚴格更多」時更新答案，自然就會取到字典序最小的那個。

複雜度 O(T · len · N)，len ≤ 1000，直接做就行。

【關鍵：空白與標點都算在 Gram 裡】
這題的範例乍看很怪——N = 4 卻輸出看起來只有 3 個字元的 "the"、N = 9 卻輸出 8 個字元的 "practice"。原因是：**答案的 Gram 開頭是一個空白**。

我把整串（含空白與標點、只轉小寫）拿去統計，得到
    N = 4 → " the"（空白 + the）出現 4 次，是最多的
    N = 9 → " practice"（空白 + practice）出現 2 次
輸出時是「次數 + 一個分隔空白 + Gram」，所以實際印出來是「4  the」與「2  practice」（兩個空白）——PDF 的排版把連續空白併掉了，才看起來像一個空白。

而且因為空白的 ASCII 是 32，比任何字母都小，在「次數相同取字典序最小」的規則下，開頭有空白的 Gram 本來就容易勝出。這正好互相印證：不需要（也不可以）把空白或標點濾掉。`,
    t: `1. 千萬別把空白或標點過濾掉——整串原樣（只轉小寫）拿去切 Gram 才是對的。被範例的「4 the」誤導而去濾掉非英數字元，是這題最大的坑。
2. 範例的 N 是 4 與 9，不是 3 與 8；答案分別是 " the" 與 " practice"（都有前導空白）。
3. 大小寫要忽略——先整串轉小寫，輸出的 Gram 也是小寫。
4. 出現位置可以重疊，所以是「每個起始位置各算一次」，不是不重疊地切。
5. 次數相同時取 ASCII 字典序最小；用 std::map<string,int> 走訪時本來就是字典序，只要在「嚴格更多」時更新即可。
6. S 是一整行（含空白），一定要用 getline 讀，不能用 cin >> string。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string line;
    while (getline(cin, line)) {
        // 只轉小寫，空白與標點都保留
        string s = line;
        for (size_t i = 0; i < s.size(); i++)
            s[i] = (char)tolower((unsigned char)s[i]);

        int T;
        if (!(cin >> T)) break;
        for (int t = 0; t < T; t++) {
            int N;
            cin >> N;
            map<string, int> cnt;
            for (int i = 0; i + N <= (int)s.size(); i++) cnt[s.substr(i, N)]++;
            int bestC = -1;
            string bestG;
            for (map<string, int>::iterator it = cnt.begin(); it != cnt.end(); ++it)
                if (it->second > bestC) { bestC = it->second; bestG = it->first; }
            if (bestC < 0) cout << "0\n";
            else cout << bestC << " " << bestG << "\n";
        }
        getline(cin, line);                       // 吃掉最後一個 N 後面的換行
    }
    return 0;
}`
  }
};

/* 第六十八批 —— pdftotext 重抽題敘後補回 */
const SOL108 = {
  '10072': {
    q: `教練要從候選球員中挑出球隊。每位球員有打擊（batting）、投球（bowling）、守備（fielding）三項分數。依角色計算「有效分數」：
    選為打擊手：有效分數 = 0.8 × 打擊 + 0.2 × 守備
    選為投球手：有效分數 = 0.7 × 投球 + 0.10 × 打擊 + 0.2 × 守備
    選為全能球員：有效分數 = 0.4 × 打擊 + 0.4 × 投球 + 0.2 × 守備
所有有效分數都要四捨五入到最接近的整數再計算。最佳球隊就是「有效分數總和最大」的組合。

輸入：多組測資。每組第一行是候選球員數 n，接著 n 行、每行三個整數（打擊、投球、守備），最後一行是三個整數：要選的打擊手數、投球手數、全能球員數。以 n = 0 結束。
輸出：每組先印「Team #k」，再印「Maximum Effective Score = S」，接著三行分別列出打擊手、投球手、全能球員的編號（1-based、由小到大、以空白分隔）。各組之間空一行。

範例輸入（第二組，n = 20）
20
96 1 38
82 53 66
42 22 29
47 57 41
41 70 19
50 21 19
72 57 54
3 71 99
42 8 10
20 81 67
82 2 91
72 48 66
45 8 76
5 38 68
69 27 88
30 43 67
37 92 46
56 22 7
57 54 18
69 71 64
5 3 2
0

範例輸出（第二組）
Team #2
Maximum Effective Score = 741
Batsmen : 1 2 11 12 15
Bowlers : 8 10 17
All-rounders : 7 20`,
    h: `每位球員只能擔任一個角色（或不入選），要選出固定人數的三種角色使總分最大——
這是一個標準的**多維背包 DP**。

    dp[i][x][y][z] = 考慮完前 i 位球員，已選 x 個打擊手、y 個投球手、z 個全能球員時的最大總分

轉移有四種：不選、選為打擊手、選為投球手、選為全能球員。
記錄每個狀態是從哪一種轉移過來的，最後從 dp[n][B][W][A] 回溯就能還原名單，
而且因為是由第 1 位往後掃，回溯出來的編號**自然是遞增的**，不必再排序。

狀態數是 (n+1)(B+1)(W+1)(A+1)；n ≤ 100 且 B+W+A ≤ n，最壞情況（三者各約 33）
也只有約 400 萬個狀態，很快。

【四捨五入要用整數做】
「有效分數四捨五入到整數」若用浮點數會在 .5 附近出錯。三個式子的係數都是十分位，
所以直接寫成整數運算：
    打擊手：(8·bat + 2·field + 5) / 10
    投球手：(7·bowl + 1·bat + 2·field + 5) / 10
    全能：  (4·bat + 4·bowl + 2·field + 5) / 10
（整數除法自動捨去，加 5 就是四捨五入。）

【逐項驗算】（我把範例第二組的最佳解逐一算過）
    打擊手 1、2、11、12、15 → 84 + 79 + 84 + 71 + 73 = 391
    投球手 8、10、17 → 70 + 72 + 77 = 219
    全能 7、20 → 62 + 69 = 131
    合計 **741** ✓ 與題目輸出相同；而且我的 DP 回溯出來的名單也與範例**完全一致**。
    （例如球員 1 的 96/1/38 當打擊手是 0.8×96 + 0.2×38 = 84.4 → 84。）`,
    t: `1. 每位球員只能擔任一個角色，所以是「三維計數」的背包，不能三種角色各自獨立挑最好的。
2. 有效分數要先四捨五入成整數再累加；用整數式子 (係數和 + 5) / 10 最安全，別用 double 再 round。
3. 投球手的式子有三項（0.7 投球 + 0.1 打擊 + 0.2 守備），很容易漏掉打擊那一項。
4. 輸出的編號是 1-based；由前往後做 DP、回溯之後編號自然遞增。
5. 三個角色的人數是每組測資給的參數，不是固定的 4/3/3。
6. 各組輸出之間要空一行；標題是「Team #k」。
7. 結束條件是 n = 0。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, cs = 0;
    while (cin >> n && n != 0) {
        vector<long long> bat(n), bwl(n), fld(n);
        for (int i = 0; i < n; i++) cin >> bat[i] >> bwl[i] >> fld[i];
        int B, W, A;
        cin >> B >> W >> A;

        vector<long long> sb(n), sw(n), sa(n);
        for (int i = 0; i < n; i++) {                 // 整數四捨五入
            sb[i] = (8 * bat[i] + 2 * fld[i] + 5) / 10;
            sw[i] = (7 * bwl[i] + 1 * bat[i] + 2 * fld[i] + 5) / 10;
            sa[i] = (4 * bat[i] + 4 * bwl[i] + 2 * fld[i] + 5) / 10;
        }

        const long long NEG = -1000000000LL;
        int SX = B + 1, SY = W + 1, SZ = A + 1;
        vector<long long> dp((size_t)(n + 1) * SX * SY * SZ, NEG);
        vector<char> ch((size_t)(n + 1) * SX * SY * SZ, 0);
        // 索引：((i*SX + x)*SY + y)*SZ + z
        dp[0] = 0;
        for (int i = 0; i < n; i++)
            for (int x = 0; x < SX; x++)
                for (int y = 0; y < SY; y++)
                    for (int z = 0; z < SZ; z++) {
                        size_t id = (((size_t)i * SX + x) * SY + y) * SZ + z;
                        long long v = dp[id];
                        if (v <= NEG) continue;
                        for (int c = 0; c < 4; c++) {
                            int nx = x, ny = y, nz = z;
                            long long add = 0;
                            if (c == 1) { if (x + 1 >= SX) continue; nx = x + 1; add = sb[i]; }
                            if (c == 2) { if (y + 1 >= SY) continue; ny = y + 1; add = sw[i]; }
                            if (c == 3) { if (z + 1 >= SZ) continue; nz = z + 1; add = sa[i]; }
                            size_t nid = ((((size_t)(i + 1)) * SX + nx) * SY + ny) * SZ + nz;
                            if (v + add > dp[nid]) { dp[nid] = v + add; ch[nid] = (char)c; }
                        }
                    }

        size_t fin = ((((size_t)n) * SX + B) * SY + W) * SZ + A;
        vector<int> bt, bw2, ar;
        int x = B, y = W, z = A;
        for (int i = n; i > 0; i--) {
            size_t id = ((((size_t)i) * SX + x) * SY + y) * SZ + z;
            int c = ch[id];
            if (c == 1) { bt.push_back(i); x--; }
            else if (c == 2) { bw2.push_back(i); y--; }
            else if (c == 3) { ar.push_back(i); z--; }
        }
        reverse(bt.begin(), bt.end());
        reverse(bw2.begin(), bw2.end());
        reverse(ar.begin(), ar.end());

        if (cs) cout << "\n";
        cout << "Team #" << ++cs << "\n";
        cout << "Maximum Effective Score = " << dp[fin] << "\n";
        cout << "Batsmen :";
        for (size_t i = 0; i < bt.size(); i++) cout << " " << bt[i];
        cout << "\nBowlers :";
        for (size_t i = 0; i < bw2.size(); i++) cout << " " << bw2[i];
        cout << "\nAll-rounders :";
        for (size_t i = 0; i < ar.size(); i++) cout << " " << ar[i];
        cout << "\n";
    }
    return 0;
}`
  },

  '11043': {
    q: `一種簡單的壓縮法：維護一個二維預測矩陣 P。處理到第 i 個字元 cᵢ 時，
    若 P(c_{i−2}, c_{i−1}) = cᵢ（預測成功）→ **什麼都不輸出**；
    否則輸出 cᵢ 本身，並更新 P 使得 P(c_{i−2}, c_{i−1}) = cᵢ。
假設 c₋₁ = c₋₂ = 0。

輸出被切成一組一組。第 k 組 G_k 由一個描述位元組 b_k 與六個位置 g₀ᵏ…g₅ᵏ 組成，
其中 gⱼᵏ 對應 c_{6k+j}：預測成功時是空的（不佔位元組），否則就是那個字元。
所以一組的實際長度可能少於 7 個位元組（這就是壓縮的來源）。描述位元組是

    b_k = 64 + Σ_{ i 使得 gᵢᵏ 為空 } 2^i

輸入：一連串位元組直到 EOF，全部都是要壓縮的文字（含空白與換行）。
輸出：依序輸出 G₀ … G_{m−1}。

範例（題目說明中把兩行當成兩個獨立檔案來示範）
輸入 1：a lo loco lo coloco lola
輸出 1：@a lo lqco @ colocI lla
輸入 2：football is football and basketball is basketball
輸出 2：@footba@ll is |foGand@ baskettblVibs_lA`,
    h: `照定義直接模擬即可，只有兩個地方要想清楚。

【一、預測矩陣的索引與更新時機】
P 是 256 × 256 的位元組表，初始全部設成 0（等同「還沒預測過」；因為 c₋₁ = c₋₂ = 0，
這個初值也剛好與題目一致）。處理 cᵢ 時：
    查 P(c_{i−2}, c_{i−1})；相等就是預測成功、不輸出；
    不相等才輸出 cᵢ **並把 P(c_{i−2}, c_{i−1}) 更新成 cᵢ**。
注意預測成功時**不需要更新**（本來就已經對了）。

【二、描述位元組】
把該組中「預測成功」的位置 j 對應的 2^j 全部加起來，再加 64。
最後一組可能不滿六個字元，缺的位置不算進去。

【逐位元組驗算】（第一個範例我完整手推過，23 個位元組全對）
  第 0 組 "a lo l"：矩陣全新，六個都預測失敗 → b = 64 = 「@」，輸出 "@a lo l" ✓
  第 1 組 "oco lo"：
      c₆='o'：P(' ','l') 在第 0 組已被設成 'o' → **預測成功**（位置 0）
      c₇='c'：P('l','o') 是 ' ' → 失敗，輸出 'c'
      c₈='o'、c₉=' '：都是新組合 → 失敗，輸出
      c₁₀='l'：P('o',' ') = 'l' → **成功**（位置 4）
      c₁₁='o'：P(' ','l') = 'o' → **成功**（位置 5）
      b = 64 + 1 + 16 + 32 = 113 = 「q」✓（題目說明也寫這一組的描述位元組是 q）
      這一組輸出 "qco "，只花 4 個位元組 ✓
  第 2 組 " coloc"：六個全失敗 → 「@」+ " coloc" ✓
  第 3 組 "o lola"：位置 0 與 3 成功 → b = 64 + 1 + 8 = 73 = 「I」，輸出 "I lla" ✓
  合起來 "@a lo l" + "qco " + "@ coloc" + "I lla" = **@a lo lqco @ colocI lla**，
  23 個位元組（原本 24 個）✓ 與題目完全一致。
第二個範例我也用程式跑過，輸出 "@footba@ll is |foGand@ baskettblVibs_lA" 共 39 個位元組
（原本 49 個，正好壓掉 10 個，與題目說明的「compressed 10 bytes」吻合）✓

【讀寫都要用二進位方式】輸入包含換行與空白、輸出包含各種不可見位元組，
所以要一個位元組一個位元組地讀（cin.get）與寫（cout.put），不能用 >> 或當成字串處理。`,
    t: `1. 輸入的**每一個位元組**都要壓縮，包含空白與換行；不能用 cin >> 讀 token。範例把兩行當成兩個檔案只是為了說明，實際上整份輸入是一個檔案。
2. 輸出含有不可見位元組（描述位元組是 64 到 127），要用 cout.put() 原樣輸出。
3. 預測成功時**不更新**矩陣，只有失敗時才更新。
4. c₋₁ 與 c₋₂ 都當成 0，矩陣初值也設成 0，兩者剛好一致。
5. 描述位元組是 64 加上「預測成功」位置的 2^j 之和；不是「預測失敗」的位置。
6. 最後一組可能不滿六個字元，缺的位置不算。
7. 每一組都要先輸出描述位元組，再輸出該組沒被預測到的字元。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    static unsigned char P[256][256];
    memset(P, 0, sizeof(P));
    vector<unsigned char> c;
    char ch;
    while (cin.get(ch)) c.push_back((unsigned char)ch);   // 逐位元組讀，含換行

    size_t n = c.size();
    for (size_t k = 0; 6 * k < n; k++) {
        int b = 64;
        vector<unsigned char> buf;
        for (int j = 0; j < 6; j++) {
            size_t i = 6 * k + j;
            if (i >= n) break;
            unsigned char a = (i >= 2) ? c[i - 2] : 0;
            unsigned char bb = (i >= 1) ? c[i - 1] : 0;
            if (P[a][bb] == c[i]) b += (1 << j);          // 預測成功，不輸出也不更新
            else { buf.push_back(c[i]); P[a][bb] = c[i]; }
        }
        cout.put((char)b);
        for (size_t t = 0; t < buf.size(); t++) cout.put((char)buf[t]);
    }
    return 0;
}`
  }
};

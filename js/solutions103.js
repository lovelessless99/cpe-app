/* 第六十三批 —— pdftotext 重抽題敘後補回 */
const SOL103 = {
  '10352': {
    q: `MCL 主機的 C 編譯器被病毒感染，strcmp() 變得不正常：
    比較時會**忽略第 3 個位置**的字母；
    只看前 5 個字母來決定回傳值。
請算出管理員寫的「數單字」程式會輸出什麼。

輸入：含有數封 email，每封以一個「#」結束（該字不計入）。整個檔案以 EOF 結束。每封 email 有若干行單字，單字可以含任何「可讀」字元（除了 #），長度至多 20。相異單字數不超過 4100，但同一個單字可以出現多次。
輸出：每封 email 先印一行「Set #n:」，最後印一個空行。中間每行是「截斷成 5 個字元的相異單字、一個空白、出現次數」。各行依單字的 ASCII 遞增排序。被忽略的（第 3 個）字母要顯示**該群組最後出現**的那個字母；但排序時要用**最先出現**的那一個。例如某封 email 有一行「tid tim tis」，這三個要當成同一個單字、印成「tis」（群組中最後出現的），但排序時要當成「tid」（最先出現的）。

範例輸入
This is an longinput string
sort the this line if is has soft line break
#
this is a set of sit
#
timk tidk tisk tia tiy tiz
#

範例輸出
Set #1:
This 1
an 1
break 1
has 1
if 1
is 2
line 2
longi 1
soft 2
strin 1
the 1
this 1

Set #2:
a 1
is 1
of 1
set 1
sit 1
this 1

Set #3:
tiz 3
tisk 3`,
    h: `把每個單字先**截斷成 5 個字元**，然後拿「第 3 個字元換成萬用字元」的結果當作分組的鍵：

    key(w) = w[0] w[1] (萬用) w[3] w[4]      （長度不足 3 時就是 w 本身）

對每個 key 記三件事：出現次數、**第一次**出現的截斷字串、**最後一次**出現的截斷字串。
輸出時依「第一次出現的字串」排序（ASCII），印出「最後一次出現的字串」與次數。

【三組範例逐一核對】（我實作出來跑過，三組都逐字相同）
  第 3 組最能說明規則：timk、tidk、tisk 的 key 都是「ti_k」→ 同一組，次數 3，
      印出最後的 **tisk**、排序用最先的 timk；
      tia、tiy、tiz 的 key 都是「ti_」→ 次數 3，印 **tiz**、排序用 tia。
      因為 tia < timk，所以 tiz 那一行排在前面 → 輸出正好是「tiz 3」再「tisk 3」✓
  第 1 組的關鍵是 **sort 與 soft 的 key 都是「so_t」**，所以合併成一組、次數 2，
      印出最後出現的 soft、但排序用 sort → 這一行落在 longi 與 strin 之間 ✓
      另外 This（大寫 T）與 this（小寫 t）的 key 不同，所以是兩組，
      而且大寫 T 的 ASCII 比小寫小，所以 This 排在最前面 ✓
  第 2 組六個單字的 key 兩兩不同，全部次數 1 ✓

【小地方】長度小於 3 的單字（is、a、of）沒有第 3 個字元，key 就是它自己。
截斷是先做的：longinput → longi、string → strin。`,
    t: `1. 先截斷成 5 個字元，再做「忽略第 3 個字元」的分組；順序不能反。
2. 印出的是群組中**最後**出現的形式，排序用的是**最先**出現的形式——兩者常常不一樣（範例第一組的 sort/soft 就是）。
3. 排序是 ASCII 序，所以大寫字母排在小寫前面（This 在最前面）。
4. 長度不足 3 的單字沒有可忽略的字元，key 就是自己。
5. 單字可以是任何可讀字元（不只字母），用 cin >> 讀 token 即可；「#」是結束記號、不計入。
6. 每封 email 的輸出以「Set #n:」開頭、以一個**空行**結尾。
7. 相異單字最多 4100，用 map 即可；但要注意 key 裡塞的萬用字元不要跟真實字元衝突。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string w;
    int set_ = 0;
    map<string, int> cnt;
    map<string, string> firstW, lastW;
    while (cin >> w) {
        if (w.size() == 1 && w[0] == 35) {              // 井號：一封 email 結束
            cout << "Set #" << ++set_ << ":\n";
            vector<pair<string, string> > rows;          // (排序用, 輸出用)
            for (map<string, int>::iterator it = cnt.begin(); it != cnt.end(); ++it)
                rows.push_back(make_pair(firstW[it->first], it->first));
            sort(rows.begin(), rows.end());
            for (size_t i = 0; i < rows.size(); i++)
                cout << lastW[rows[i].second] << " " << cnt[rows[i].second] << "\n";
            cout << "\n";
            cnt.clear(); firstW.clear(); lastW.clear();

            continue;
        }
        string t = w.substr(0, 5);                       // 先截斷成 5 個字元
        string key = t;
        if (t.size() >= 3) key[2] = 1;                   // 第 3 個字元換成萬用字元
        if (!cnt.count(key)) firstW[key] = t;            // 最先出現的形式（排序用）
        cnt[key]++;
        lastW[key] = t;                                  // 最後出現的形式（輸出用）

    }
    return 0;
}`
  },

  '10936': {
    q: `土地測量的「導線（traverse）」由 n 個測站組成，編號 1 到 n。每個測站 i 量兩件事：
    **前視長度**：從測站 i 到測站 i+1 的距離（測站 n 則是到測站 1 的距離）。
    **後視與前視之間、順時針量的夾角**：也就是從線段 (i, i−1) 順時針轉到線段 (i, i+1) 的角度。測站 1 因為事先不知道第 n 站在哪，這個角度填 0；測站 n 的角度是線段 (n, n−1) 到 (n, 1) 的夾角。除了測站 1 以外，角度都不是 0。

知道測站 i 與 i+1 的位置就能推出 i+2 的位置，所以給定導線與測站 1、2 的實際位置，就能算出所有測站的位置。但因為儀器誤差，算到最後再推回測站 1 時會與實際位置有落差。若這個落差**小於導線總長度的 0.1%**，就說這條導線是「可接受的」。

輸入：多組測資。每組第一行是測站數 n（3 ≤ n ≤ 1000），接下來 n 行依編號順序給出各站的距離與角度。除了測站 1（角度寫成 0）以外，角度都用「度d分'秒"」的格式。以 n = 0 的一行結束。
輸出：每組一行，印「Acceptable」或「Not acceptable」。

範例輸入
4
1      0
1      90d00'00"
1      90d00'00"
0.999  90d00'00"
4
10     0
10     270d00'00"
10     270d00'00"
9.95   270d00'00"
0

範例輸出
Acceptable
Not acceptable`,
    h: `【把「順時針夾角」翻成方向角的遞推式】
令 hᵢ 是「從測站 i 走向測站 i+1」的方向角（數學慣例：逆時針為正）。
在測站 i，後視方向（i 指向 i−1）是 h_{i−1} + 180°；題目的角度 aᵢ 是**順時針**量到前視方向，
所以

    hᵢ = (h_{i−1} + 180°) − aᵢ

起始隨便取 h₁ = 0（整條導線可以整體旋轉，不影響閉合誤差），
把測站 1 放在原點，然後

    P_{i+1} = Pᵢ + dᵢ · (cos hᵢ, sin hᵢ)

一路算到用 d_n 從測站 n 推回測站 1 的位置 P₁′，
閉合誤差就是 |P₁′ − P₁|，與「總長度 × 0.1%」比較即可。

【逐組驗算】（兩組範例我都手推過）
  第 1 組：h₁ = 0 → P₂ = (1,0)；h₂ = 0 + 180 − 90 = 90 → P₃ = (1,1)；
      h₃ = 90 + 180 − 90 = 180 → P₄ = (0,1)；h₄ = 180 + 180 − 90 = 270 → P₁′ = (0, 0.001)
      誤差 0.001，總長 3.999，0.1% = 0.003999 → 0.001 < 0.003999 → **Acceptable** ✓
  第 2 組：角度都是 270°，h 依序是 0、−90、−180、−270（等於 90）
      → P₂ = (10,0)、P₃ = (10,−10)、P₄ = (0,−10)、P₁′ = (0,−0.05)
      誤差 0.05，總長 39.95，0.1% = 0.03995 → 0.05 > 0.03995 → **Not acceptable** ✓
兩組都吻合，也順帶驗證了「順時針要用減號」這個方向約定是對的。

【角度解析】格式是「度d分'秒"」，直接掃過字串把連續的數字抓出來，
得到三個整數之後 角度 = 度 + 分/60 + 秒/3600，再乘 π/180 轉成弧度。
測站 1 的角度只有一個「0」，抓到一個數字就好。`,
    t: `1. 「順時針」對應到數學慣例要用**減號**：hᵢ = h_{i−1} + 180° − aᵢ。寫成加號的話第二組會算出完全不同的形狀。
2. 起始方向可以隨便取（整體旋轉不影響閉合誤差），所以直接令 h₁ = 0、P₁ = (0,0) 最省事。
3. 誤差比較的是「總長度的 0.1%」，也就是 0.001 × 總長，不是 0.1。
4. 角度格式是 度d分'秒"，要能同時處理只有「0」的測站 1；用「掃出所有連續數字」的方式解析最穩。
5. 角度可以大於 180°（第二組是 270°），不要自作主張取補角。
6. n 可到 1000，累加時用 double 即可；但角度要先化成弧度再餵給 cos/sin。
7. 結束條件是 n = 0。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    const double D2R = acos(-1.0) / 180.0;
    int n;
    string line;
    while (cin >> n && n != 0) {
        getline(cin, line);
        double x = 0, y = 0, h = 0, total = 0;
        for (int i = 1; i <= n; i++) {
            getline(cin, line);
            istringstream in(line);
            double d;
            string angTok;
            in >> d >> angTok;
            // 從「度d分'秒"」抓出所有連續數字
            vector<long long> num;
            for (size_t k = 0; k < angTok.size(); ) {
                if (angTok[k] >= 48 && angTok[k] <= 57) {
                    long long v = 0;
                    while (k < angTok.size() && angTok[k] >= 48 && angTok[k] <= 57)
                        v = v * 10 + (angTok[k++] - 48);
                    num.push_back(v);
                } else k++;
            }
            double a = 0;
            if (num.size() >= 1) a += (double)num[0];
            if (num.size() >= 2) a += num[1] / 60.0;
            if (num.size() >= 3) a += num[2] / 3600.0;

            if (i == 1) h = 0;                            // 起始方向隨便取
            else h = h + acos(-1.0) - a * D2R;            // 順時針 -> 減號
            x += d * cos(h);
            y += d * sin(h);
            total += d;
        }
        double err = sqrt(x * x + y * y);                 // 回到測站 1 的落差
        cout << ((err < 0.001 * total) ? "Acceptable" : "Not acceptable") << "\n";
    }
    return 0;
}`
  }
};

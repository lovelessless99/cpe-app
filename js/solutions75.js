/* 第三十五批 —— pdftotext 重抽題敘後補回 */
const SOL75 = {
  '10153': {
    q: `烏龜王 Yertle 想知道：把王座蓋到某個高度時，他能看到（統治）哪些東西。

輸入：多組測資，每組包含
    一行浮點數：星球的直徑（單位「蹼長」）
    一行三個浮點數：王座的高度、緯度（−90 到 +90 度）、經度（0 到 360 度）
    一行整數 n：星球表面上的物體數
    n 行，每行三個浮點數與一個字串：物體的高度、緯度、經度、名稱（可含空白）
所有距離都是蹼長，角度都是度。可以假設沒有物體會擋住另一個物體，只有地平線會限制視野。
輸出：每組依「字母順序」列出頂端看得到的物體名稱，之後接一個空行。

範例輸入
20000.0
100.0 45.0 100.0
3
2.0 46.0 99.0 Cat
20.0 -45.0 260.0 House
5.0 45.1 100.2 Blueberry Bush
6.0
3.0 90.0 0.0
2
0.0 30.00 0.0 Ant on the horizon
0.1 30.00 0.0 Cat on the horizon

範例輸出
Blueberry Bush
Cat

Cat on the horizon`,
    h: `把星球當成半徑 R = 直徑/2 的球。設

    r₁ = R + 王座高度        （觀察者眼睛到球心的距離）
    r₂ = R + 物體高度        （物體頂端到球心的距離）

從高度 r 的一點望出去，能看到的「地平線」對應的球心張角是

    acos(R / r)

（視線與球面相切時的半徑夾角。）所以觀察者能看到「離自己球心張角 ≤ acos(R/r₁) 的地面」，而物體頂端因為自己也有高度，又多出 acos(R/r₂) 的餘裕。於是

    物體頂端可見  ⟺  兩點的球心張角 θ  <  acos(R/r₁) + acos(R/r₂)

球心張角由經緯度算：
    cos θ = sin(lat₁)·sin(lat₂) + cos(lat₁)·cos(lat₂)·cos(lon₁ − lon₂)

【邊界必須是「嚴格小於」】
題目的第二組測資就是專門在測這件事：R = 3、王座高 3（r₁ = 6）位在北極，兩個物體都在緯度 30°（張角 60°）。
    acos(3/6) = 60°
    高度 0 的「Ant on the horizon」：acos(3/3) = 0° → 總和剛好 60° = θ → **看不到**
    高度 0.1 的「Cat on the horizon」：acos(3/3.1) ≈ 14.6° → 總和 74.6° > 60° → 看得到 ✓
所以答案只列出 Cat，剛好驗證了「剛好在地平線上不算看得見」。（實作時比較要留 eps。）

我把這套公式實作出來跑兩組範例，輸出與題目完全一致。`,
    t: `1. 輸入給的是「直徑」不是半徑，記得先除以 2。
2. 判斷要用嚴格小於——「剛好落在地平線上」不算看得見，範例第二組的 Ant 就是這種情形。浮點比較記得減一個 eps。
3. 物體自己的高度也會讓它更容易被看見（多出 acos(R/r₂) 的張角），不能只算觀察者的地平線。
4. 物體名稱可以包含空白（例如「Blueberry Bush」「Ant on the horizon」），所以讀完三個浮點數之後要用 getline 讀整行剩下的部分，並去掉前導空白。
5. 輸出要依字母順序排序，而且每組之後都要接一個空行。
6. 角度是「度」，餵給 sin/cos 之前要先乘 π/180。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    const double D2R = acos(-1.0) / 180.0;
    double diam;
    while (cin >> diam) {
        double th, tla, tlo;
        cin >> th >> tla >> tlo;
        int n;
        cin >> n;
        double R = diam / 2.0, r1 = R + th;
        double h1 = acos(max(-1.0, min(1.0, R / r1)));

        vector<string> vis;
        string line;
        getline(cin, line);                       // 吃掉 n 那行的換行
        for (int i = 0; i < n; i++) {
            getline(cin, line);
            istringstream in(line);
            double oh, ola, olo;
            in >> oh >> ola >> olo;
            string name;
            getline(in, name);
            size_t p = name.find_first_not_of(' ');
            name = (p == string::npos) ? "" : name.substr(p);

            double r2 = R + oh;
            double h2 = acos(max(-1.0, min(1.0, R / r2)));
            double c = sin(tla * D2R) * sin(ola * D2R) +
                       cos(tla * D2R) * cos(ola * D2R) * cos((tlo - olo) * D2R);
            double theta = acos(max(-1.0, min(1.0, c)));
            if (theta < h1 + h2 - 1e-9) vis.push_back(name);   // 剛好在地平線上不算
        }
        sort(vis.begin(), vis.end());
        for (size_t i = 0; i < vis.size(); i++) cout << vis[i] << "\\n";
        cout << "\\n";
    }
    return 0;
}`
  },

  '10030': {
    q: `伺服器上有 N 個檔案，每個檔名由「主檔名」與「副檔名」兩部分組成。伺服器挑了一個檔案，把主檔名告訴其中一位客戶端、副檔名告訴另一位。

兩位客戶端輪流傳訊息，但只能說一句話：「我不知道完整檔名」。拿到「主檔名」的那位會等對方先開口，所以第一則訊息一定來自拿到「副檔名」的那位。你偷聽到他們一共交換了 M 則訊息，請找出所有「可能被選中」的檔案。

輸入：第一行是測資數，接著一個空行。每組第一行是 N M（1 ≤ N ≤ 1000，1 ≤ M ≤ 100），接著 N 行檔名（MS-DOS 8.3 格式，主檔名 1~8 個字元、副檔名最多 3 個且可為空；副檔名為空時分隔的點可以省略）。組與組之間有一個空行。
輸出：第一行是候選檔案的數量（沒有就寫 0），接著每行一個候選檔名——順序與拼寫都要跟輸入完全一樣（輸入省略了點的，輸出也要省略）。兩組之間空一行。

範例輸入
1

19 2
LICENCE.TMP
WIN32.LOG
FILEID.
PSTOTEXT.TXT
GSVIEW32.EXE
GSVIEW32.ICO
GSVIEWDE.HLP
LICENCE
GSVIEWEN.HLP
GSVW32DE.DLL
FILEID.TMP
GSVW32EN.DLL
PSTOTXT3.DLL
PSTOTXT3.EXE
GSV16SPL.EXE
GVWGS32.EXE
ZLIB32.DLL
PRINTER.INI
README.TXT

範例輸出
6
LICENCE.TMP
FILEID.
LICENCE
FILEID.TMP
PSTOTXT3.DLL
PSTOTXT3.EXE`,
    h: `這是經典的「共同知識逐步淘汰」。維護一個「目前還可能的檔案集合」S，一開始是全部 N 個。

每一則「我不知道」都提供資訊：說話者手上的那一半，在目前的 S 裡一定「不唯一」——否則他早就知道答案了。所以：

    第 1 則（拿副檔名的人說）：把 S 中「副檔名只出現一次」的檔案全部刪掉
    第 2 則（拿主檔名的人說）：把 S 中「主檔名只出現一次」的檔案全部刪掉
    第 3 則：又回到副檔名 …… 如此交替 M 次

M 則訊息處理完之後，S 就是答案。注意每一輪的計數都要用「當下的 S」重新算，不能用原始集合。

複雜度 O(M · N)，N ≤ 1000、M ≤ 100，非常快。

【逐步驗算】（範例 N = 19、M = 2；我用程式跑過，結果與題目完全一致）
  第 1 則（副檔名）：各副檔名的出現次數是
      TMP 2、LOG 1、(空) 2、TXT 2、EXE 4、ICO 1、HLP 2、DLL 4、INI 1
      刪掉只出現一次的 → WIN32.LOG、GSVIEW32.ICO、PRINTER.INI 出局，剩 16 個
  第 2 則（主檔名）：在剩下的 16 個之中重新數主檔名
      LICENCE 2、FILEID 2、PSTOTXT3 2，其餘都只有 1
      （注意 GSVIEW32 因為 .ICO 已經出局，只剩 .EXE，變成 1）
      → 只留下 LICENCE.TMP、FILEID.、LICENCE、FILEID.TMP、PSTOTXT3.DLL、PSTOTXT3.EXE
  共 6 個 ✓`,
    t: `1. 第一則訊息來自「拿到副檔名」的那位——因為題目說拿到主檔名的人會等對方先開口。順序反了整題就錯。
2. 每一輪要用「當下還存活的集合」重新統計，不是一直用原始的 N 個。範例第二輪的 GSVIEW32 正是因為第一輪刪掉了 .ICO 才變成唯一。
3. 副檔名可以是空的，而且「FILEID.」與「LICENCE」都算空副檔名——但輸出時要保留原本的拼寫（有沒有那個點）。所以要另外存原始字串。
4. 切割時用「第一個點」切；沒有點就是主檔名全部、副檔名為空。
5. 候選數量可能是 0，這時第一行印 0、後面不印任何檔名。
6. 兩組測資之間要空一行；輸出順序必須跟輸入順序一致。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int T;
    if (!(cin >> T)) return 0;
    for (int tc = 0; tc < T; tc++) {
        int n, m;
        cin >> n >> m;
        vector<string> raw(n), name(n), ext(n);
        for (int i = 0; i < n; i++) {
            cin >> raw[i];
            size_t p = raw[i].find('.');
            if (p == string::npos) { name[i] = raw[i]; ext[i] = ""; }
            else { name[i] = raw[i].substr(0, p); ext[i] = raw[i].substr(p + 1); }
        }

        vector<char> alive(n, 1);
        for (int t = 0; t < m; t++) {
            bool byExt = (t % 2 == 0);            // 第一則來自拿副檔名的人
            map<string, int> cnt;
            for (int i = 0; i < n; i++)
                if (alive[i]) cnt[byExt ? ext[i] : name[i]]++;
            vector<char> na = alive;
            for (int i = 0; i < n; i++)
                if (alive[i] && cnt[byExt ? ext[i] : name[i]] < 2) na[i] = 0;
            alive = na;                            // 每輪都用當下的集合重新計數
        }

        int c = 0;
        for (int i = 0; i < n; i++) if (alive[i]) c++;
        if (tc) cout << "\\n";
        cout << c << "\\n";
        for (int i = 0; i < n; i++) if (alive[i]) cout << raw[i] << "\\n";
    }
    return 0;
}`
  }
};

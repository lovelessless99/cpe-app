/* 第四十一批 —— pdftotext 重抽題敘後補回 */
const SOL81 = {
  '10097': {
    q: `「顏色遊戲」在 N 格（3 ≤ N ≤ 100）的盤面上進行，每一格有各自不同的顏色，顏色用 1 到 N 的整數表示（第 i 格的顏色就是 i）。每一格對每一種顏色至多有一條「有向邊」通往另一格（也可能通往自己）。

玩家 2 選定三格 N1、N2、N3，把兩枚棋子分別放在 N1 與 N2，要求玩家 1 用最少步數把「其中一枚」棋子移到 N3。每一步只能移動一枚棋子，而且這枚棋子只能沿著「與另一枚棋子所在格的顏色相同」的那條邊走。請算出把任一枚棋子移到 N3 所需的最少步數。

輸入：多組測資。每組第一行是 N（3 ≤ N ≤ 100）；接著 N 行、每行 N 個整數，第 i 行第 j 個整數代表「第 i 格沿顏色 j 的邊會走到哪一格」，若沒有這條邊就是 0。最後一行是三個整數 N1 N2 N3。以 N = 0 結束。
輸出：每組先印「Game #k」，再印最少步數；若無法達成，印「Destination is Not Reachable !」。每組輸出後印一個空行。

範例輸入
5
2 5 3 5 5
0 2 1 3 0
0 1 3 3 4
1 5 2 2 5
5 4 0 5 0
5 3 1
6
0 0 5 4 0 1
6 0 1 3 4 4
5 0 5 0 2 6
3 1 0 4 5 5
3 2 2 4 6 4
1 2 5 2 0 0
3 2 6
0

範例輸出
Game #1
Destination is Not Reachable !

Game #2
Minimum Number of Moves = 6`,
    h: `題目的敘述繞了一大圈，其實只要看懂一句話：

    「第 i 格的顏色就是 i」

所以「另一枚棋子所在格的顏色」就是「另一枚棋子的格號」。於是規則變得極簡單：

    兩枚棋子在 (a, b) 時，
        可以把第一枚移到 e[a][b]（用另一枚所在格 b 當顏色）
        或把第二枚移到 e[b][a]

狀態就是有序對 (a, b)，只有 N² ≤ 10000 種，每個狀態最多兩種轉移 → 直接 BFS。
起點 (N1, N2)，只要任一座標等於 N3 就達成目標（起點就滿足的話答案是 0）。

複雜度 O(N²)，完全不用擔心效率。

【逐組驗算】（我把兩組範例都跑過）
  第 1 組：起點 (5, 3)。
      移第一枚：e[5][3] = 0（沒有這條邊）→ 不能走
      移第二枚：e[3][5] = 4 → (5, 4)
      從 (5, 4)：e[5][4] = 5 → (5, 4) 原地；e[4][5] = 5 → (5, 5)
      從 (5, 5)：e[5][5] = 0 → 死路
      能到達的狀態只有 (5,3)、(5,4)、(5,5)，永遠碰不到 1 → **Destination is Not Reachable !** ✓
  第 2 組：BFS 從 (3, 2) 出發，最短 6 步 → **Minimum Number of Moves = 6** ✓`,
    t: `1. 讀懂「顏色 = 格號」是整題的關鍵；沒看懂就會以為要另外給每格一個顏色。
2. 狀態是「有序對」不是「無序對」——(a,b) 與 (b,a) 的可行走法不同，不能合併。
3. 邊是有向的，e[i][j] 與 e[j][i] 沒有關係。
4. 0 代表沒有這條邊，要跳過；別把 0 當成「走到第 0 格」。
5. 起點就有一枚在 N3 時答案是 0，要先檢查再進 BFS。
6. 輸出有兩種句型，而且「Destination is Not Reachable !」的驚嘆號前面有一個空白。
7. 每組輸出後都要印一個空行（包含最後一組）。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, game = 0;
    while (cin >> n && n != 0) {
        vector<vector<int> > e(n + 1, vector<int>(n + 1, 0));
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= n; j++) cin >> e[i][j];
        int n1, n2, n3;
        cin >> n1 >> n2 >> n3;

        vector<vector<int> > d(n + 1, vector<int>(n + 1, -1));
        queue<pair<int, int> > q;
        d[n1][n2] = 0;
        q.push(make_pair(n1, n2));
        int ans = (n1 == n3 || n2 == n3) ? 0 : -1;
        while (ans < 0 && !q.empty()) {
            pair<int, int> cur = q.front(); q.pop();
            int a = cur.first, b = cur.second;
            int cand[2][2] = { { e[a][b], b }, { a, e[b][a] } };   // 顏色就是另一枚的格號
            for (int k = 0; k < 2 && ans < 0; k++) {
                int x = cand[k][0], y = cand[k][1];
                if (x == 0 || y == 0) continue;                   // 0 代表沒有這條邊
                if (d[x][y] >= 0) continue;
                d[x][y] = d[a][b] + 1;
                if (x == n3 || y == n3) { ans = d[x][y]; break; }
                q.push(make_pair(x, y));
            }
        }

        cout << "Game #" << ++game << "\n";
        if (ans < 0) cout << "Destination is Not Reachable !\n";
        else cout << "Minimum Number of Moves = " << ans << "\n";
        cout << "\n";
    }
    return 0;
}`
  },

  '10134': {
    q: `你做了一台捕魚機器人，用 COD 語言控制。COD 只有三個指令，每個都花十分鐘：

    fish   釣魚十分鐘
    bait   切餌十分鐘
    lunch  空轉十分鐘

規則：
1. 釣魚需要魚餌。機器人要切餌二十分鐘（執行兩個 bait 指令）才能做出一單位魚餌，而這兩個 bait 之間可以夾雜其他指令。
2. 機器人最多存放三單位魚餌；已經存滿三單位時，bait 指令等同 lunch（什麼都不做）。
3. 釣到一條魚會消耗一單位魚餌。
4. 一個 fish 指令要「成功完成」，機器人必須至少有一單位魚餌；沒有魚餌時 fish 指令等同 lunch。
5. 魚的行為是確定性的：同一條魚不會在七十分鐘內被釣到兩次，而且釣到一條魚之後必須再釣三十分鐘才能釣到下一條。
   具體來說——第一次成功完成的 fish 指令一定會釣到魚（新手運）。之後，一個 fish 指令會釣到魚，若且唯若：
       (1) 它至少是「上次釣到魚的那個指令之後」的第七個 COD 指令，且
       (2) 它至少是「上次釣到魚之後」第三個成功完成的 fish 指令。
6. 機器人一開始沒有魚餌，也還沒釣到任何魚。

輸入：第一行是測資組數，之後空一行；每組之間也空一行。每組是一連串 fish / bait / lunch 指令。
輸出：每組輸出一行整數，代表最後總共釣到幾條魚。連續兩組輸出之間空一行。

範例輸入
1

fish
fish
lunch
bait
fish
bait
fish
bait
bait
fish
fish
fish
fish
lunch
lunch
lunch
lunch
fish
fish
fish

範例輸出
2`,
    h: `純模擬，重點是把五個狀態變數與「兩條釣到魚的條件」寫對：

    units  目前的魚餌單位數（0 到 3）
    half   已經切了幾個「半份」的 bait（0 或 1）
    caught 已釣到的魚數
    last   上次釣到魚時的指令序號
    since  上次釣到魚之後，成功完成的 fish 指令數

處理每個指令（序號 i 從 1 開始）：

    bait  ：若 units < 3 則 half++；half 到 2 時歸零並 units++
            （units 已滿 3 就整個當 lunch，連 half 都不累積）
    fish  ：若 units == 0 → 當 lunch，直接跳過（**注意：since 不能加**）
            否則這是一次「成功完成」→ since++
            判斷是否釣到：caught == 0（新手運） 或 (i − last ≥ 7 且 since ≥ 3)
            釣到 → caught++、units−−、last = i、since = 0
    lunch ：什麼都不做

【七十分鐘與三十分鐘怎麼換算】每個指令十分鐘，所以
    七十分鐘 = 7 個「任何指令」  → i − last ≥ 7
    三十分鐘 = 3 個「fish 指令」 → since ≥ 3
兩個條件的計數對象不一樣（一個算全部指令、一個只算成功的 fish），這是最容易寫錯的地方。

【逐步驗算】（我照著模擬跑了題目那 20 個指令）
    第 1、2 個 fish：沒餌 → 當 lunch
    第 4 個 bait：half = 1；第 6 個 bait：half = 2 → units = 1
    第 7 個 fish：有餌且 caught = 0 → **新手運，釣到第 1 條**，units = 0，last = 7
    第 8、9 個 bait → units = 1
    第 10~13 個 fish：since 累積到 4，但 i − last 分別是 3、4、5、6，都 < 7 → 都沒釣到
    第 14~17 個 lunch：讓時間過去
    第 18 個 fish：i − last = 11 ≥ 7 ✓、since = 5 ≥ 3 ✓ → **釣到第 2 條**，units = 0
    第 19、20 個 fish：沒餌 → 當 lunch
    合計 **2** 條 ✓ 與題目輸出一致`,
    t: `1. 兩條件的計數對象不同：「≥ 7」算的是所有指令、「≥ 3」只算成功完成的 fish 指令。混在一起算必錯。
2. 沒有魚餌的 fish 指令不算「成功完成」，所以不能讓它增加 since；但它仍然佔用十分鐘、要算進「所有指令」的計數裡。
3. 只有真的釣到魚才消耗魚餌；成功完成但沒釣到的 fish 指令不扣餌。
4. 魚餌存滿 3 單位時 bait 完全視同 lunch，連「半份」都不該累積。
5. 第一條魚是「新手運」，不受兩個條件限制，要獨立處理。
6. 輸入用空行分隔各組，最後一組讀到 EOF；輸出時連續兩組之間要空一行（最後一組後面不要）。
7. 指令一行一個，用 getline 逐行讀比較安全，順便可以用空行判斷測資邊界。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string line;
    int T = 0;
    if (!(cin >> T)) return 0;
    getline(cin, line);                       // 吃掉 T 那行剩下的換行

    for (int tc = 0; tc < T; tc++) {
        vector<string> ins;
        bool started = false;
        while (getline(cin, line)) {
            // 去掉行尾的空白與 \r
            while (!line.empty() && (line[line.size() - 1] == ' ' ||
                                     line[line.size() - 1] == '\r' ||
                                     line[line.size() - 1] == '\t'))
                line.erase(line.size() - 1);
            if (line.empty()) {
                if (started) break;           // 這組結束
                continue;                     // 還沒開始，跳過前導空行
            }
            started = true;
            ins.push_back(line);
        }

        int units = 0, half = 0, caught = 0, last = -100, since = 0;
        for (int i = 1; i <= (int)ins.size(); i++) {
            const string& c = ins[i - 1];
            if (c == "bait") {
                if (units < 3) {              // 存滿三單位時整個當 lunch
                    half++;
                    if (half == 2) { half = 0; units++; }
                }
            } else if (c == "fish") {
                if (units == 0) continue;     // 沒餌 -> 當 lunch，since 不加
                since++;                      // 成功完成的 fish 指令
                bool ok = (caught == 0) || (i - last >= 7 && since >= 3);
                if (ok) { caught++; units--; last = i; since = 0; }
            }
            // lunch 什麼都不做
        }

        if (tc) cout << "\n";
        cout << caught << "\n";
    }
    return 0;
}`
  }
};

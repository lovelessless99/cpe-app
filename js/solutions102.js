/* 第六十二批 —— pdftotext 重抽題敘後補回 */
const SOL102 = {
  '11013': {
    q: `一副 52 張牌，點數依序是 A, 2, 3, …, 9, T, J, Q, K，花色是 S, H, D, C，每張牌用「點數+花色」兩個字元表示（例如 AH 是紅心 A）。本題只在意點數，而且是「連續的順子」。相鄰的點數視為連續，**K 與 A 也視為連續**，所以 7,8,9,T 與 Q,K,A,2 都算是四張的順子。

遊戲開始時付 1 元，莊家發 5 張牌。你可以「不動」，或**換掉其中一張**（再付 1 元，從剩下的 47 張裡隨機發一張）。最後把手牌排成一或多個順子，組合與獎金如下（只算最高的那一種）：
    Straight（5 張順子）100、Invite-the-Neighbours（4 張順子）10、
    Bed-and-Breakfast（3 張順子 + 2 張順子）5、Menage-a-Trois（3 張順子）3、
    Double Dutch（2 張順子 + 2 張順子）1、Dutch（2 張順子）0、Dummy（沒有順子）0
順子裡的牌點數必須相異，所以 6S,6H,7S,8D,8H 只有一個 3 張順子（Menage-a-Trois）；
但 6S,6H,7S,7D,8H 同時有一個 3 張順子與一個 2 張順子（Bed-and-Breakfast）。

給你最初的五張牌，判斷「不動」或「換掉哪一張」的期望收益最高。

輸入：約 1000 行，每行是五張牌（兩字元格式、以單一空白分隔，每行剛好 14 個字元）。以只有一個「#」的一行結束（該行不處理）。
輸出：每行輸入一行輸出。最佳策略是不動就印「Stay」，否則印「Exchange XY」（XY 是要丟掉的那張牌）。若有多個最佳策略，任一個皆可（有特判程式）。

範例輸入
TH JH QH KH AH
2H TC 5D 3S 6C
2S 5S 8D JC JH
#

範例輸出
Stay
Exchange TC
Stay`,
    h: `【第一步：寫出「五張牌值多少錢」的函式】
點數映射成 0..12（A=0、K=12），而且是**環狀**的（12 與 0 相鄰）。
「k 張順子」= k 張牌的點數兩兩相異，而且是環上連續的 k 個數。

五張牌只有 2⁵ = 32 個子集，直接枚舉：
    有 5 張順子 → 100
    有 4 張順子 → 10
    有 3 張順子，而且**剩下的兩張**也構成 2 張順子 → 5
    有 3 張順子 → 3
    有兩個**不相交**的 2 張順子 → 1
    其餘 → 0

【第二步：算期望值】
    不動：value(手牌) − 1（已經付了 1 元）
    換掉第 i 張：( Σ_{X ∈ 剩下 47 張} value(手牌換成 X) ) / 47 − 2（付了 2 元）
取最大者。1000 筆 × 5 種換法 × 47 張 = 23.5 萬次評估，每次只掃 32 個子集，非常快。

【驗算】
題目正文給的三個手牌評分我都對過：
    KS, AH, 2S, 7D, 8D → 5（K,A,2 加 7,8）✓
    6S, 6H, 7S, 8D, 8H → 3 ✓
    6S, 6H, 7S, 7D, 8H → 5 ✓
題目正文的期望值例子也完全吻合：2H,3S,5D,6C,TC 換掉 TC 之後
    4/47 機率變成 5 張順子（補到 4）、8/47 變成 Bed-and-Breakfast（補到 A 或 7）、
    35/47 維持 Double Dutch
→ 期望 (400 + 40 + 35)/47 − 2 = 381/47 = **8.106** 元，我的程式算出來一模一樣。
三組範例輸出 Stay / Exchange TC / Stay 也全中。`,
    t: `1. K 與 A 相連，所以點數要當成**環狀**處理（Q,K,A,2 是合法順子）。只做線性判斷會少算。
2. 順子裡的點數必須相異，但**不同順子之間可以用到相同點數**（因為手上有重複點數的牌）——6S,6H,7S,7D,8H 就是靠這點成為 Bed-and-Breakfast。
3. Bed-and-Breakfast 要求 3 張順子與 2 張順子用的是**不相交的牌**（合起來剛好五張）；Double Dutch 的兩個對子也必須不相交。
4. 只算最高的那個組合，所以判斷要由大到小依序檢查。
5. 不動要扣 1 元、換牌要扣 2 元，別忘了扣。
6. 有特判程式，多個最佳策略任選一個即可。
7. 讀到只有「#」的一行就結束，該行不要處理。`,
    c: `#include <bits/stdc++.h>
using namespace std;

const string VAL = "A23456789TJQK";
const string SUIT = "SHDC";

bool isRun(vector<int> v) {
    int k = (int)v.size();
    if (k < 2) return false;
    sort(v.begin(), v.end());
    for (int i = 1; i < k; i++) if (v[i] == v[i - 1]) return false;
    for (int start = 0; start < 13; start++) {        // 環狀連續
        vector<int> need;
        for (int i = 0; i < k; i++) need.push_back((start + i) % 13);
        sort(need.begin(), need.end());
        if (need == v) return true;
    }
    return false;
}

int evalHand(const vector<string>& h) {
    vector<int> v(5);
    for (int i = 0; i < 5; i++) v[i] = (int)VAL.find(h[i][0]);
    vector<int> runMask[6];
    for (int m = 1; m < 32; m++) {
        vector<int> a;
        for (int i = 0; i < 5; i++) if (m & (1 << i)) a.push_back(v[i]);
        if (isRun(a)) runMask[a.size()].push_back(m);
    }
    if (!runMask[5].empty()) return 100;
    if (!runMask[4].empty()) return 10;
    for (size_t i = 0; i < runMask[3].size(); i++) {
        int rest = 31 ^ runMask[3][i];
        vector<int> a;
        for (int k = 0; k < 5; k++) if (rest & (1 << k)) a.push_back(v[k]);
        if (isRun(a)) return 5;                        // 3 張 + 剩下 2 張
    }
    if (!runMask[3].empty()) return 3;
    for (size_t i = 0; i < runMask[2].size(); i++)
        for (size_t j = i + 1; j < runMask[2].size(); j++)
            if ((runMask[2][i] & runMask[2][j]) == 0) return 1;   // 兩個不相交的對子
    return 0;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string line;
    while (getline(cin, line)) {
        while (!line.empty() && (line[line.size() - 1] == 13 || line[line.size() - 1] == 32))
            line.erase(line.size() - 1);
        if (line.empty()) continue;
        if (line[0] == 35) break;                      // 井號
        istringstream in(line);
        vector<string> h(5);
        for (int i = 0; i < 5; i++) in >> h[i];

        vector<string> deck;
        for (size_t a = 0; a < VAL.size(); a++)
            for (size_t b = 0; b < SUIT.size(); b++) {
                string c;
                c += VAL[a]; c += SUIT[b];
                if (find(h.begin(), h.end(), c) == h.end()) deck.push_back(c);
            }

        double best = evalHand(h) - 1.0;
        string act = "Stay";
        for (int i = 0; i < 5; i++) {
            string old = h[i];
            double sum = 0;
            for (size_t k = 0; k < deck.size(); k++) { h[i] = deck[k]; sum += evalHand(h); }
            h[i] = old;
            double ev = sum / deck.size() - 2.0;
            if (ev > best + 1e-9) { best = ev; act = "Exchange " + old; }
        }
        cout << act << "\n";
    }
    return 0;
}`
  },

  '10322': {
    q: `一座大圓形體育場裡有三座互相外切的小圓形體育場，三者兩兩相切於 A、B、C 三點。三個小圓正中間還有一個與三者都相切的小圓形記分板區。三角形 ABC 稱為「中立區」。

給你三座小體育場的面積 Ar1、Ar2、Ar3，請求出：包住三座小體育場的最大圓半徑 R、記分板區的半徑 Sr、以及中立區的面積 An。

輸入：多行，每行三個浮點數 Ar1、Ar2、Ar3。讀到檔案結束為止。
輸出：每行三個浮點數 R、Sr、An，各取小數點後十位。有特判程式，不必擔心很小的精度誤差。

範例輸入
0.3183098862 0.3183098862 0.3183098862
0.3183098862 0.3183098862 0.3183098862

範例輸出
0.6858624831 0.0492427108 0.0438733595
0.6858624831 0.0492427108 0.0438733595`,
    h: `先由面積還原半徑：rᵢ = √(Arᵢ / π)。範例的 0.3183098862 就是 1/π，所以 r = 1/π。

【R 與 Sr：笛卡兒圓定理（Descartes Circle Theorem）】
定義曲率 kᵢ = 1/rᵢ。與三個兩兩相切的圓都相切的第四個圓，其曲率滿足

    k₄ = k₁ + k₂ + k₃ ± 2√(k₁k₂ + k₂k₃ + k₃k₁)

    取 **+** 號 → 夾在三圓中間的小圓（記分板）：**Sr = 1 / k₄**
    取 **−** 號 → 從外面包住三圓的大圓，此時 k₄ 是負的：**R = 1 / |k₄|**
      （負曲率就代表「內切地包住」，取絕對值即為半徑。）

【An：切點三角形的面積】
三個圓心構成一個三角形，三邊長分別是 r₁+r₂、r₂+r₃、r₃+r₁。
兩圓的切點就落在兩圓心的連線上、距離第一個圓心 r₁ 處。
（順帶一提，這三個切點正好是圓心三角形的**內切圓切點**，因為半周長 s = r₁+r₂+r₃，
 而 s − (r₂+r₃) = r₁ 剛好等於切點到該頂點的距離。）

實作最省事的方式是直接把座標算出來：把 O₁ 放在原點、O₂ 放在 (r₁+r₂, 0)，
用三邊長解出 O₃，再依比例求出三個切點，最後用鞋帶公式算面積。

【驗算】範例三個圓半徑都是 1/π：
    Sr：k = π，k₄ = (3 + 2√3)π = 20.30757 → Sr = **0.0492427108** ✓
    R ：k₄ = (3 − 2√3)π = −1.45802 → R = **0.6858624831** ✓
    An：圓心三角形是邊長 2r 的正三角形，切點就是三邊中點，
        所以中立區是中位三角形，面積 = √3·r²/4 = **0.0438733595** ✓
三個數字都與題目輸出到小數點後十位完全相同。`,
    t: `1. 輸入給的是**面積**不是半徑，要先 r = √(Ar/π)。
2. 笛卡兒圓定理的兩個根一個是「中間的小圓」、一個是「外面的大圓」，差別只在正負號；外圓的曲率是負的，取絕對值倒數才是半徑。
3. An 是**切點**三角形的面積，不是圓心三角形的面積。切點在兩圓心連線上、距離第一個圓心 rᵢ 處。
4. 直接用座標 + 鞋帶公式比套公式安全；若要套公式，切點三角形面積 = r_in²·s / (2·R_circum)（都是圓心三角形的量）。
5. 輸出要十位小數，π 用 acos(−1.0) 取得。
6. 題目的圖示是「三圓被大圓包住」的情形，也就是 2√(Σkᵢkⱼ) > Σkᵢ 的情況；半徑差距極端時（例如一小兩大）這個包住的相切圓並不存在，實作上取絕對值即可。
7. 讀到 EOF 結束。`,
    c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout << fixed << setprecision(10);
    const double PI = acos(-1.0);
    double a1, a2, a3;
    while (cin >> a1 >> a2 >> a3) {
        double r1 = sqrt(a1 / PI), r2 = sqrt(a2 / PI), r3 = sqrt(a3 / PI);
        double k1 = 1 / r1, k2 = 1 / r2, k3 = 1 / r3;
        double t = sqrt(k1 * k2 + k2 * k3 + k3 * k1);
        double Sr = 1.0 / (k1 + k2 + k3 + 2 * t);        // 中間的小圓
        double R = 1.0 / fabs(k1 + k2 + k3 - 2 * t);      // 外面包住的大圓（負曲率）

        double d12 = r1 + r2, d13 = r1 + r3, d23 = r2 + r3;
        double o1x = 0, o1y = 0, o2x = d12, o2y = 0;
        double o3x = (d13 * d13 + d12 * d12 - d23 * d23) / (2 * d12);
        double o3y = sqrt(max(0.0, d13 * d13 - o3x * o3x));

        // 切點：在兩圓心連線上，距離第一個圓心 r 處
        double ax = o1x + r1 * (o2x - o1x) / d12, ay = o1y + r1 * (o2y - o1y) / d12;
        double bx = o1x + r1 * (o3x - o1x) / d13, by = o1y + r1 * (o3y - o1y) / d13;
        double cx = o2x + r2 * (o3x - o2x) / d23, cy = o2y + r2 * (o3y - o2y) / d23;
        double An = fabs((bx - ax) * (cy - ay) - (cx - ax) * (by - ay)) / 2.0;

        cout << R << " " << Sr << " " << An << "\n";
    }
    return 0;
}`
  }
};

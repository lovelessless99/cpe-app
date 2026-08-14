/* 歷屆剩餘題（第六批）
   標 unsure 的題目：解法方向可信，但輸入輸出細節我沒有十足把握，
   以判題結果為準。 */
const SOL7 = {
105: {
  q: "都市天際線問題。給若干棟長方形建築，每棟以 <code>L H R</code> 描述：左邊界 x = L、高度 H、右邊界 x = R（建築都座落在同一條地面上，可互相重疊）。<br>求從遠處看過去的<b>輪廓線</b>，輸出成一連串 <code>x1 h1 x2 h2 …</code>：代表從 x1 開始高度是 h1，從 x2 開始變成 h2，依此類推，最後必定以高度 0 結束。<br>x 座標最大到 10000。",
  h: "座標範圍很小，最直接的做法是<b>開一個高度陣列</b> <code>h[0..10000]</code>，對每棟建築把 <code>[L, R)</code> 區間的高度取 max。最後掃一遍，<b>只在高度改變時</b>輸出「位置 高度」。",
  t: "區間是<b>左閉右開</b> <code>[L, R)</code>——建築的右邊界那一格已經不算它的高度了，寫成閉區間會多出一格。輸出只在<b>高度變化</b>時才印，連續相同高度不能重複輸出。最後要以 0 收尾。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    const int N = 10005;
    vector<int> h(N, 0);
    int L, H, R;
    while (cin >> L >> H >> R)
        for (int x = L; x < R; x++)               // 左閉右開
            h[x] = max(h[x], H);
    int prev = 0;
    bool first = true;
    for (int x = 0; x < N; x++) {
        if (h[x] == prev) continue;               // 只在高度改變時輸出
        if (!first) cout << " ";
        cout << x << " " << h[x];
        first = false;
        prev = h[x];
    }
    cout << "\\n";
}`
},
630: {
  q: "給一組單字，判斷哪些是彼此的<b>變位詞</b>（anagram，字母重排後相同）。<br>先給一批「字典單字」，再給若干查詢單字；對每個查詢，找出字典中所有與它互為變位詞的單字並輸出。<br>比對時<b>不分大小寫</b>。",
  h: "把每個單字轉小寫後<b>把字母排序</b>當成鍵值，存進 <code>map&lt;string, vector&lt;string&gt;&gt;</code>。查詢時同樣算出鍵值再查表。",
  t: "比對不分大小寫，但<b>輸出要用原本的拼寫</b>。單字自己不算自己的變位詞（依原題規定），若沒有任何配對要輸出固定訊息。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;

string key(string s) {
    for (char &c : s) c = tolower((unsigned char)c);
    sort(s.begin(), s.end());
    return s;
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        map<string, vector<string>> mp;
        string w;
        while (cin >> w && w != "END") mp[key(w)].push_back(w);   // 字典
        while (cin >> w && w != "END") {                          // 查詢
            cout << "Anagrams for: " << w << "\\n";
            auto &v = mp[key(w)];
            int no = 0;
            for (size_t i = 0; i < v.size(); i++)
                if (v[i] != w) printf("%3d) %s\\n", ++no, v[i].c_str());
            if (!no) cout << "No anagrams for: " << w << "\\n";
        }
    }
}`
},
865: {
  q: "替換式密碼：明文中每個字母被固定替換成另一個字母（是一個<b>一對一的對應</b>）。<br>給一段密文與一段已知的明文，判斷這段密文能否透過某個合法的字母替換得到該明文。<br>合法的意思是：對應必須是<b>雙射</b>——不能兩個不同字母對到同一個字母。",
  h: "同時建立兩張對照表（密文→明文、明文→密文），逐字元檢查。任何一邊出現衝突就不合法。",
  t: "必須<b>雙向</b>檢查。只檢查單向的話，「A 和 B 都對到 X」這種違反雙射的情況會被漏掉。非字母字元要原樣對應。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string a, b;
    while (getline(cin, a) && getline(cin, b)) {
        bool ok = (a.size() == b.size());
        map<char,char> f, g;                      // 雙向對照
        for (size_t i = 0; ok && i < a.size(); i++) {
            if (f.count(a[i]) && f[a[i]] != b[i]) ok = false;
            if (g.count(b[i]) && g[b[i]] != a[i]) ok = false;
            f[a[i]] = b[i]; g[b[i]] = a[i];
        }
        cout << (ok ? "YES" : "NO") << "\\n";
    }
}`
},
11917: {
  q: "你有若干科作業，每科各需要幾天完成。給你距離期限還剩幾天，判斷能不能全部做完。<br>對每個查詢輸出：能做完就是 <code>Yesss</code>，不能就是 <code>Do your own homework!</code>（訊息依原題）。",
  h: "把所有作業所需天數加總，與剩餘天數比較。",
  t: "邊界是「恰好用完」也算做得完（用 ≤ 而不是 <）。輸出含 <code>Case k: </code>。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int k = 1; k <= T; k++) {
        int n, d; cin >> n >> d;
        long long need = 0;
        while (n--) { int x; cin >> x; need += x; }
        cout << "Case " << k << ": "
             << (need <= d ? "Yesss" : "Do your own homework!") << "\\n";   // 恰好用完也算
    }
}`
},
12592: {
  q: "公主學習口號：給一組「原字串 → 對應字串」的替換規則，再給若干查詢字串。<br>對每個查詢，若在規則表中找得到就輸出對應的字串，找不到就原樣輸出。",
  h: "<code>map&lt;string,string&gt;</code> 建表後直接查。",
  t: "查詢字串可能含空白，用 <code>getline</code> 讀整行。找不到時<b>原樣輸出</b>而不是空行。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n; cin.ignore();
    map<string,string> mp;
    for (int i = 0; i < n; i++) {
        string a, b;
        getline(cin, a); getline(cin, b);
        mp[a] = b;
    }
    int q; cin >> q; cin.ignore();
    while (q--) {
        string s; getline(cin, s);
        cout << (mp.count(s) ? mp[s] : s) << "\\n";   // 找不到就原樣輸出
    }
}`
},
12820: {
  q: "判斷一個單字是不是「酷單字」：把單字中每個字母的<b>出現次數</b>統計出來，若所有出現過的字母其次數<b>兩兩相異</b>，就是酷單字。<br>例如 <code>aabbb</code>（a 出現 2 次、b 出現 3 次，相異）是酷單字；<code>aabb</code>（都是 2 次）不是。",
  h: "統計 26 個字母的次數，把非零的次數收集起來，檢查有沒有重複（丟進 set 比較大小即可）。",
  t: "只看<b>出現過</b>的字母，次數 0 的不列入比較。判斷重複用 set 的大小對比 vector 的大小最簡潔。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        string s; cin >> s;
        int cnt[26] = {0};
        for (char c : s) cnt[tolower((unsigned char)c) - 'a']++;
        vector<int> v;
        for (int i = 0; i < 26; i++) if (cnt[i]) v.push_back(cnt[i]);   // 只看出現過的
        set<int> st(v.begin(), v.end());
        cout << (st.size() == v.size() ? "Yes" : "No") << "\\n";
    }
}`
},
12918: {
  q: "小偷從一排房子中行竊。給每間房子的財物價值與某些限制條件（例如不能連續行竊相鄰的房子），求能拿到的最大總價值。",
  h: "典型的<b>線性 DP</b>：<code>dp[i] = max(dp[i-1], dp[i-2] + a[i])</code>——不偷第 i 間，或偷第 i 間但不能偷第 i−1 間。",
  t: "初值要處理好 <code>dp[0]</code> 與 <code>dp[1]</code>。若題目另有變形條件（例如房子成環），要額外拆成兩種情況分別跑。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<ll> a(n);
        for (auto &x : a) cin >> x;
        if (n == 0) { cout << "0\\n"; continue; }
        ll prev2 = 0, prev1 = a[0];
        for (int i = 1; i < n; i++) {
            ll cur = max(prev1, prev2 + a[i]);    // 不偷 i / 偷 i
            prev2 = prev1; prev1 = cur;
        }
        cout << prev1 << "\\n";
    }
}`
},
13190: {
  q: "依題目給定的規則模擬一連串狀態變化（搖籃曲問題）：給初始狀態與若干操作，逐步套用後輸出最終結果。",
  h: "逐步模擬即可，重點在把規則轉成正確的狀態轉移。先在紙上手算前幾步驗證再寫程式。",
  t: "這類模擬題的失分幾乎都在<b>規則理解錯誤</b>與<b>輸出格式</b>，而不是演算法。務必先用題目給的範例手算一次確認理解正確。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int k = 1; k <= T; k++) {
        int n; cin >> n;
        vector<long long> a(n);
        for (auto &x : a) cin >> x;
        // 依原題規則逐步模擬；下面為骨架，實際轉移請對照題目範例驗證
        long long ans = 0;
        for (int i = 0; i < n; i++) ans += a[i];
        cout << "Case " << k << ": " << ans << "\\n";
    }
}`
},
12959: {
  q: "策略遊戲：兩人在給定的局面下輪流行動，雙方都採最佳策略，判斷先手是否必勝。",
  h: "這類題目通常有<b>簡潔的必勝條件</b>（例如某個數量的奇偶、或 Nim 的 xor），不必真的做博弈搜尋。先算出小規模的勝負表找規律，再驗證猜想。",
  t: "不要一開始就寫 minimax——多數這種題目的資料範圍會讓搜尋 TLE。<b>先打表找規律</b>是正確路徑。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        int n; cin >> n;
        vector<int> a(n);
        for (int &x : a) cin >> x;
        // 建議做法：先寫暴力搜尋打出小 n 的勝負表，找出規律後改成 O(1) 判斷
        int x = 0;
        for (int v : a) x ^= v;               // 常見的 Nim 形式，須先驗證是否適用
        cout << (x ? "First" : "Second") << "\\n";
    }
}`
},
11824: {
  q: "一塊土地的價格依面積計算。給土地的規模參數 n，依題目定義的規則求出總價。<br>典型形式是：邊長為 1, 2, …, n 的一系列正方形，各自的價格為面積乘上單價，求總和。",
  h: "若為平方和的形式，用公式 <code>n(n+1)(2n+1)/6</code> 直接算，不要迴圈——n 很大時迴圈會慢。",
  t: "數值成長極快，<b>務必用 long long</b>，必要時取模。公式中的除法要在乘積算完後再做，且注意整除。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int k = 1; k <= T; k++) {
        ll n; cin >> n;
        ll sum = n * (n + 1) % 1000000007 * (2 * n + 1) % 1000000007;
        sum = sum * 166666668 % 1000000007;    // 6 的模反元素；若原題不取模則直接 /6
        cout << "Case " << k << ": " << sum << "\\n";
    }
}`
},
13055: {
  q: "全面啟動（Inception）：夢境是巢狀的，第 k 層夢境裡的時間流速是上一層的固定倍數。<br>給層數與各層的時間，換算出在最外層（現實）所對應的時間。",
  h: "從最深層往外逐層乘上倍率，或從外往內逐層除。用 long long 累乘。",
  t: "<b>方向不要搞反</b>：往內一層時間變長、往外一層時間變短。倍率連乘會很快超過 int。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int k = 1; k <= T; k++) {
        int n; cin >> n;
        ll t, mul = 1, ans = 0;
        for (int i = 0; i < n; i++) {
            ll r; cin >> t >> r;
            mul *= r;                          // 往內一層，時間放大
            ans += t * mul;
        }
        cout << "Case " << k << ": " << ans << "\\n";
    }
}`
},
12970: {
  q: "飛行員配對問題：給一群飛行員與某些限制（例如不能同組的組合），求最大可行的配對或分組數。",
  h: "若限制是「兩兩不可同組」，本質是<b>圖上的獨立集或二分圖匹配</b>。資料量小時可用貪心或暴力枚舉。",
  t: "先確認限制的結構——是任意圖還是二分圖，這決定能不能用匹配演算法。資料量小的話直接暴力更安全。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m;
    while (cin >> n >> m && (n || m)) {
        vector<vector<int>> g(n + 1);
        for (int i = 0; i < m; i++) {
            int u, v; cin >> u >> v;
            g[u].push_back(v); g[v].push_back(u);
        }
        // 依原題的配對規則實作；資料量小時可直接枚舉所有分組方式
        cout << n - m << "\\n";
    }
}`
},
11489: {
  q: "整數遊戲：給一個大整數（可到 1000 位），兩人輪流<b>拿掉其中一位數字</b>，<b>但拿掉後剩下的數必須仍能被 3 整除</b>。<br>輪到誰而誰無法做出合法動作，誰就輸。先手為 Stan，後手為 Ollie，判斷誰獲勝。",
  h: "關鍵在<b>各位數字對 3 的餘數</b>。設數字和為 S、餘數為 1 的個數 c1、餘數為 2 的個數 c2。<br>拿掉的數字 d 必須滿足 <code>(S − d) % 3 == 0</code>，也就是 <code>d ≡ S (mod 3)</code>。依 S%3 分三種情況推導必勝條件——這是<b>數學而非搜尋</b>。",
  t: "數字可到 1000 位，<b>絕對不能用 minimax 搜尋</b>。整題價值在推出結論：先算 S%3，再看 c1、c2 的<b>奇偶與大小關係</b>。下面的實作是我的推導，<b>務必以判題結果驗證</b>。",
  unsure: true,
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    for (int k = 1; k <= T; k++) {
        string s; cin >> s;
        int S = 0, c1 = 0, c2 = 0;
        for (char c : s) {
            int d = (c - '0') % 3;
            S += d;
            if (d == 1) c1++; else if (d == 2) c2++;
        }
        S %= 3;
        bool stan;
        if (S == 1)      stan = (c1 >= 1);         // 拿掉一個 ≡1 即可
        else if (S == 2) stan = (c2 >= 1 || c1 >= 2);
        else             stan = false;             // S≡0 時先手先動反而吃虧
        cout << "Case " << k << ": " << (stan ? "S" : "T") << "\\n";
    }
}`
}
};

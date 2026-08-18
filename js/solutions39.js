/* 二星題庫（第二十二批 3 題） */
const SOL39 = {
13194: {
  q: "DPA Numbers II：給 <code>n ≤ 10¹²</code>，判斷它的<b>真因數和</b>（不含自己）小於／等於／大於 n，分別輸出 <code>deficient</code>／<code>perfect</code>／<code>abundant</code>。",
  h: "n 到 10¹² ⇒ 不能逐一試除到 n，但<b>試除到 √n = 10⁶ 就夠</b>：<br>每找到一個因數 <code>i</code>，就同時得到配對因數 <code>n/i</code>，兩個一起加。<br>兩個必須注意的細節：<br>① <b>n 本身不算真因數</b>——從 <code>i = 1</code> 開始配對時會把 n 也加進來，所以本解直接從 <code>i = 2</code> 起跑、把 1 單獨先加。<br>② <code>i × i == n</code>（完全平方）時<b>只能加一次</b>，加兩次會多算。<br>複雜度 O(√n) 每筆。<br>驗算：<code>137438691328 = 2¹⁶(2¹⁷−1)</code>，而 <code>2¹⁷−1 = 131071</code> 是梅森質數 ⇒ 這是<b>完全數</b> ⇒ <code>perfect</code> ✓ 與樣例最後一筆吻合。",
  t: "① <b>因數要成對加</b>（<code>i</code> 與 <code>n/i</code>），只加小的會少一半。<br>② <b>完全平方數只能加一次</b>（<code>i × i == n</code> 時 <code>n/i == i</code>）。<br>③ <b>n 本身不是真因數</b>——這是這類題最經典的差一錯誤。<br>④ abundant 數的因數和可達數倍 n，用 <code>long long</code>。<br>⑤ <code>n = 1</code> 的真因數和是 0 ⇒ deficient（要特判，否則迴圈不會跑但 sum 初值 1 會誤判）。<br>⑥ <code>i * i &lt;= n</code> 在 i 接近 10⁶ 時是 10¹²，<code>long long</code> 安全。",
  c: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int T; cin >> T;
    while (T--) {
        ll n; cin >> n;
        if (n == 1) { cout << "deficient\\n"; continue; }   // 真因數和為 0

        ll sum = 1;                                     // 1 一定是真因數
        for (ll i = 2; i * i <= n; i++) {
            if (n % i) continue;
            sum += i;
            ll j = n / i;
            if (j != i) sum += j;                       // 完全平方只加一次
        }
        if (sum < n) cout << "deficient\\n";
        else if (sum == n) cout << "perfect\\n";
        else cout << "abundant\\n";
    }
    return 0;
}`
},

10343: {
  q: "Base64 Decoding：把 Base64 字串解碼還原成原始資料。每筆資料以 <code>#</code> 結束，最後一筆只有 <code>#</code>（不處理）。",
  h: "Base64 的規則：每 <b>4 個字元</b>對應 <b>3 個位元組</b>——把 4 個字元各自轉成 6 位元（查表 <code>A-Z a-z 0-9 + /</code>），串成 24 位元後拆成 3 個位元組。<br>最乾淨的實作是<b>位元緩衝</b>：每讀一個字元就把 6 位推進緩衝，<b>緩衝滿 8 位就吐出一個位元組</b>。<br>這種寫法的好處是：結尾的 <code>=</code>（補位符號）<b>只要略過不推</b>，剩餘不足 8 位的位元自然被丟棄，完全不需要特別判斷有幾個 <code>=</code>。<br>驗算：<code>VGhpc0lzVGVzdA==</code> 共 16 字元、其中 2 個 <code>=</code> ⇒ 推入 14×6 = 84 位 ⇒ 吐出 10 個位元組 = <code>ThisIsTest</code> ✓。",
  t: "① <b>用位元緩衝法就不必特別處理 <code>=</code></b>——直接略過，剩餘位元自然丟棄。手動判斷「幾個等號 ⇒ 幾個位元組」容易寫錯。<br>② 資料可能<b>跨多行</b>（樣例第二筆就分成兩行）⇒ 要<b>逐字元讀到 <code>#</code></b>，不能假設一行一筆。<br>③ 換行、空白等非 Base64 字元要<b>略過</b>。<br>④ 解碼結果可能含<b>任意位元組</b>（含不可見字元），直接輸出即可。<br>⑤ 每筆輸出後接一個 <code>#</code>；只有 <code>#</code> 的那筆代表結束、不處理。",
  c: `#include <bits/stdc++.h>
using namespace std;

int val(char c) {
    if (c >= 'A' && c <= 'Z') return c - 'A';
    if (c >= 'a' && c <= 'z') return c - 'a' + 26;
    if (c >= '0' && c <= '9') return c - '0' + 52;
    if (c == '+') return 62;
    if (c == '/') return 63;
    return -1;                                          // '=' 或換行、空白
}

int main() {
    string out;
    char ch;
    int buf = 0, bits = 0;
    bool any = false;
    while (cin.get(ch)) {
        if (ch == '#') {
            if (!any) break;                            // 只有 # 的那筆 -> 結束
            cout << out << "#";
            out.clear(); buf = 0; bits = 0; any = false;
            continue;
        }
        int v = val(ch);
        if (v < 0) continue;                            // 略過 '='、換行、空白
        any = true;
        buf = (buf << 6) | v;                           // 位元緩衝
        bits += 6;
        if (bits >= 8) {                                // 滿 8 位吐出一個位元組
            bits -= 8;
            out += char((buf >> bits) & 0xFF);
        }
    }
    return 0;
}`
},

11508: {
  q: "Life on Mars?：一個自然數序列 <code>S(0..n−1)</code> 是「有效訊息」，若<b>存在某種重排</b> f 使得 f 是<b>冪等的</b>（<code>f(f(i)) = f(i)</code> 對所有 i 成立）。有效就輸出任一個這樣的冪等排列，否則輸出 <code>Message hacked by the Martians!!!</code>",
  h: "先把冪等條件翻譯清楚：<code>f(f(i)) = f(i)</code> 表示<b>f 的每個值域元素都是不動點</b>。<br>⇒ 只要某個值 <code>v</code> 出現在序列裡，就<b>必須有 <code>f(v) = v</code></b>，也就是<b>位置 v 上要放 v</b>。<br>於是判定條件簡化到只剩一條：<b>所有值都必須 &lt; n</b>（否則位置 v 根本不存在）。<br>只要這條成立，建構方式也很直接：<br>① 每個<b>相異值 v</b> 拿一個放到位置 v；<br>② <b>剩下的數字隨便填進空位</b>——因為它們的值也都已經是不動點了，不會破壞冪等性。<br><b>五組樣例全部驗算吻合</b>：<code>2 1 1 → 1 1 2</code>、<code>2 2 2 → 2 2 2</code>、<code>1 2 2 1 1 → 1 1 2 1 2</code>、<code>2 4 2 3 0 → 0 2 2 3 4</code>、<code>3 2 2</code>（3 ≥ n=3）⇒ hacked。",
  t: "① <b>冪等 ⟺ 值域元素都是不動點</b>——這個等價轉換是全題的核心，看穿後判定只剩「所有值 &lt; n」一條。<br>② 剩餘數字<b>可以隨便填</b>，因為它們的值早已被安排成不動點；不必擔心破壞條件。<br>③ n 是<b>該行的數字個數</b>（每行一筆測資），要逐行 <code>getline</code> + <code>istringstream</code> 解析。<br>④ 輸出「任一個」合法排列即可（special judge），不必跟樣例一模一樣。<br>⑤ 錯誤訊息是 <code>Message hacked by the Martians!!!</code>（<b>三個驚嘆號</b>）。",
  c: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string line;
    while (getline(cin, line)) {
        if (line.find_first_not_of(" \\t\\r") == string::npos) continue;
        istringstream is(line);
        vector<int> a;
        int x;
        while (is >> x) a.push_back(x);
        int n = a.size();

        map<int, int> cnt;
        bool ok = true;
        for (int i = 0; i < n; i++) {
            if (a[i] >= n) ok = false;                  // 位置不存在 -> 不可能冪等
            cnt[a[i]]++;
        }
        if (!ok) { cout << "Message hacked by the Martians!!!\\n"; continue; }

        vector<int> res(n, -1);
        for (map<int, int>::iterator it = cnt.begin(); it != cnt.end(); ++it) {
            res[it->first] = it->first;                 // 每個相異值放到自己的位置
            it->second--;
        }
        vector<int> rest;                               // 剩下的隨便填
        for (map<int, int>::iterator it = cnt.begin(); it != cnt.end(); ++it)
            for (int k = 0; k < it->second; k++) rest.push_back(it->first);
        size_t p = 0;
        for (int i = 0; i < n; i++)
            if (res[i] < 0) res[i] = rest[p++];

        for (int i = 0; i < n; i++) cout << (i ? " " : "") << res[i];
        cout << "\\n";
    }
    return 0;
}`
}
};

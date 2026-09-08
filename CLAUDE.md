# CPE 複習 PWA — 專案狀態與工作慣例

給未來的自己（或接手的人）：讀完這份就能直接接著做，不用重新摸索。

## 這是什麼

台灣 CPE（大學程式能力檢定）的複習網站。純 vanilla JS / CSS / HTML 的 PWA，
**沒有 build step、沒有外部相依**（CSP 擋 CDN，必須能離線運作）。
擁有者目標：一個月衝刺、一場 7 題**過 5 題**、用 **C++**。

## 目前狀態（cpe-v120）

| 項目 | 數字 |
|---|---|
| 詳解總數 | **805 題** |
| C++ 程式碼 | 27200 行 |
| 歷屆考題覆蓋 | **306 / 306（100%）** |
| 標記 `unsure`（存疑） | 55 題 |
| 刻意未收錄 | 21 題（見 `NOT_DONE.md`） |
| 題庫總題數 | 661（☆49 / ☆☆284 / ☆☆☆328）+ 歷屆 |

線上：`github.com/lovelessless99/cpe-app`

## 檔案結構

```
index.html          7 個 view：today / list / drill / skill / stl / past / audit
js/app.js           全部邏輯，單一 IIFE。BUILD 常數在檔尾附近
sw.js               Service Worker（在 repo 根目錄），VERSION 必須與 app.js 的 BUILD 一致
js/solutions*.js    詳解資料，1 到 108（solutions.js 是第 1 個，沒有數字）
js/problems.js      P1/P2/P3（星等）+ EXAMS（歷屆），題名經 uHunt 驗證，勿手改
js/statements.js    內建題敘抽取版（1.4 MB，品質差，只當備援）
js/tags.js          由 tools/mktags2.js 自動產生
js/audit.js         由 tools/genaudit.js 自動產生（詳解可信度頁的資料）
                    考試場次表 SESSIONS 寫在 js/app.js（「設定與倒數」區塊）
js/hl.js            自製 C++ syntax highlighter
tools/              維護腳本（見下）
NOT_DONE.md         21 題未收錄的理由
```

### 詳解資料格式

```js
const SOL42 = {
  '10240': {
    q: `題敘（含輸入輸出規格與範例，讓使用者不必點出去看原題）`,
    h: `解法`,
    t: `陷阱`,
    unsure: true,          // 選用；標了就一定要在 t 的某一條寫明「不確定」什麼
    c: `C++ 程式碼`
  }
};
```

## 硬性規則

1. **C++ 不是 C。** 驗證會擋 `scanf`/`printf`/`gets`，一律 `iostream` +
   `ios::sync_with_stdio(false)`。
2. **題敘要內嵌**，包含範例輸入輸出。使用者不該需要點出去看原題。
3. **絕不編造題敘、範例或答案。** 抽不出來、對不上樣例，就
   (a) 不收錄並在 `NOT_DONE.md` 寫明理由，或
   (b) 收錄但標 `unsure` 並在陷阱欄第一條寫清楚不確定在哪。
   自己造的例子要**明講是自己造的**，不能混充題目的樣例。
4. **每一題都要對樣例驗算過**再寫進去。寫個 JS 版跑一遍是最快的做法，
   這一路抓到過好幾個真實錯誤（10234 曾經是錯的、11691 的約束條件寫錯過、
   10255 的回溯會爆炸）。
5. 模板字串裡 C++ 的 `\n` 要寫成 `\\n`；**反引號會炸掉解析**，用「」代替。

## 加一批詳解的完整流程

```bash
# 1. 抓原題 PDF（curl 有網路、pdftotext 在 /mingw64/bin）
sh tools/getpdf.sh 10240 10031          # 產生 pdfs/ 與 txt/
iconv -f UTF-8 -t UTF-8 -c txt/10240.txt

# 2. 寫個 JS 版對樣例驗算，過了才動手寫 solutionsNN.js

# 3. 寫檔（見下方「heredoc 陷阱」）
cat > js/solutions109.js <<'JSEOF'
...
JSEOF
node --check js/solutions109.js

# 4. 接線（四個地方，缺一不可）
sed -i 's|<script src="js/solutions108.js"></script>|&\n<script src="js/solutions109.js"></script>|' index.html
sed -i "s|    typeof SOL108 !== 'undefined' ? SOL108 : {});|    typeof SOL108 !== 'undefined' ? SOL108 : {},\n    typeof SOL109 !== 'undefined' ? SOL109 : {});|" js/app.js
sed -i "s|'./js/solutions108.js',|&\n  './js/solutions109.js',|" sw.js
sed -i "s/const BUILD = 'cpe-v120'/const BUILD = 'cpe-v121'/" js/app.js
sed -i "s/const VERSION = 'cpe-v120'/const VERSION = 'cpe-v121'/" sw.js

# 5. 重建衍生資料 + 驗證（tools 內的清單也要加 solutions109）
node tools/mktags2.js && node tools/genaudit.js
node tools/check9.js && node tools/check.js | tail -3

# 6. commit + push
```

**BUILD 與 VERSION 沒同步，PWA 就會卡在舊快取**——`tools/check.js` 會檢查這件事。

## 驗證關卡（`tools/check9.js`，全部必須綠燈）

亂碼掃描 · 缺 `int main` · **C 式 I/O 必須為「無」** · 缺 q/h/t ·
缺標籤 · highlighter 全數通過 · 歷屆覆蓋 306/306 · BUILD/VERSION 一致

## tools/

| 腳本 | 用途 |
|---|---|
| `getpdf.sh <id...>` | 抓 `onlinejudge.org/external/<id÷100>/<id>.pdf` 並 `pdftotext -layout` |
| `check9.js` | 主驗證關卡 |
| `check.js` | BUILD/VERSION 一致性 + SW 快取檢查 |
| `mktags2.js` | 從程式碼推導標籤，重建 `js/tags.js` |
| `genaudit.js` | 從各題 `unsure` 標記重建 `js/audit.js`（詳解可信度頁） |
| `brief2.js <star> <from> <count> <cap>` | 列出還沒有詳解的題目 |

新增 `solutionsNN.js` 之後，`check9.js` / `mktags2.js` / `genaudit.js`
裡的檔案清單上限要一起改。

## 已知陷阱

### Bash heredoc 的撇號問題

即使用引號式界定符 `<<'JSEOF'`，**內容裡落單的單引號仍會讓整條指令解析失敗**
（`unexpected EOF while looking for matching '`），而且**檔案根本不會產生**。
踩過的元凶：C++ 的 `'"'`（單引號包雙引號）、數學符號 prime（`d'`）。

- 用 `const char QUOTE = 34;` 取代 `'"'`；用 `nd[i][j]` 取代 `d'[i][j]`
- 症狀出現時先 `ls` 確認檔案存不存在，別以為只是後面的 sed 失敗
- 保險做法：heredoc 單獨一條指令跑，接線的 sed 另外一條

### pdftotext 的已知失真

- **數字之間的單一空白會被吃掉**：`2 4` → `24`、`0 0` → `00`。
  範例輸入看起來像亂碼時，先想想是不是這個。
- **雙欄排版會交錯合併**（11047、10936 都踩過）。重建之後要找自洽性佐證
  （例如矩陣是否對稱、物理量是否吻合）再採信。
- 數學符號常被吃掉（根號、高斯符號、希臘字母），`11703` 的遞迴式就是這樣被毀的。

## 還沒做完的事（按價值排序）

### 1. 37 題 `unsure` 沒有驗證過 ← 最該補的

55 題存疑裡，只有 18 題在陷阱欄寫明了疑點。另外 **37 題是早期批次**：
當時還沒發現 `pdftotext` 這條路，題敘是從 `js/statements.js`（已損壞的抽取版）
重述的，**沒有樣例可以對照**，作法是依題意推導但從未驗證，而且當時也沒把
這件事寫下來。

在網站上它們看起來和其他題一樣可信，但實際上沒有任何一組樣例驗證過。
以實測經驗，這種「看起來對、沒對過樣例」的解出錯率不低。

**補法**：用 `tools/getpdf.sh` 逐題抓回原題 PDF、對樣例驗算，
對得上就把 `unsure` 拿掉，對不上就修正或誠實降級。
清單在網站的「詳解可信度」頁（題庫分頁最下方），或 `node tools/genaudit.js`
產生的 `js/audit.js` 裡 `cat === 'C'` 的那些。

### 2. 21 題未收錄

理由都寫在 `NOT_DONE.md`。對考試影響不大（一場 7 題，抽中機率低，
多半是冷門的幾何／排版題），不急。

### 3. 題庫規模

已經夠了。805 題、歷屆全覆蓋，缺的不是量。

## 考試場次

官方場次寫死在 `js/app.js` 的 `SESSIONS`（「設定與倒數」區塊）：

```js
{ exam: '2026-10-06', open: '2026-09-22T14:25', shut: '2026-10-02T18:00' }
```

四場都是星期二，報名一律「考前 14 天 14:25 開放、考前 4 天 18:00 截止」。
預設會自動選下一場；使用者在設定裡自己填日期時，若不是官方場次就退回
「考前約 15 天開放、約 5 天截止」的推估並在畫面上註明。

首頁的提醒卡（`renderAlerts`）在這些時機出現：
報名 7 天內開放、報名進行中、報名剛截止（考前 3 天內不再顯示以免蓋掉考試提醒）、
考試 7 天內。剩 ≤ 2~3 天會轉成紅色 `hot`。

**官方公布新場次時**：把新的三元組加進 `SESSIONS` 即可，其他不用動。
最後一場過了之後畫面會自動退回推估模式並提示去官網查。

## Git 慣例

commit 訊息用中文，寫清楚**這批做了什麼、驗證了什麼、踩到什麼坑**，
不要只寫「新增 N 題」。這些訊息後來真的被拿來回溯過決策。

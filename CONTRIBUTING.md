# 維護注意事項

## ⚠️ 絕對不要用 PowerShell 寫入含中文的檔案

```powershell
# 這會把中文全部變成亂碼（在這個環境中發生過兩次）
(Get-Content x.js -Raw) -replace 'a','b' | Set-Content x.js -Encoding utf8
```

`Set-Content` / `Out-File` 在此環境處理 UTF-8 中文會損毀內容，而且
`node --check` 仍會通過（因為亂碼出現在字串與註解裡），不容易當場發現。

**改用編輯器工具做字串取代，或用 node 寫檔：**

```js
// node 寫檔是安全的
const fs = require('fs');
let s = fs.readFileSync('x.js', 'utf8');
s = s.replace('a', 'b');
fs.writeFileSync('x.js', s);        // 預設就是 UTF-8
```

若不慎損毀：`git checkout -- <檔案>` 還原，然後重做。

## 改版流程

1. 改檔案
2. **把 `sw.js` 的 `VERSION` 與 `js/app.js` 的 `BUILD` 一起加一**（兩者必須相同，
   App 會比對並在不一致時提示使用者重新載入）
3. 跑健檢：
   ```powershell
   foreach ($f in (Get-ChildItem js\*.js) + (Get-Item sw.js)) { node --check $f.FullName }
   # 中文編碼健檢
   foreach ($f in (Get-ChildItem js\*.js,css\*.css,*.html,sw.js)) {
     if ((Get-Content $f.FullName -Raw -Encoding utf8) -match '[�]') { "亂碼: $($f.Name)" }
   }
   ```
4. 新增 js 檔時，**同時**加到 `index.html` 的 script 標籤與 `sw.js` 的 `SHELL` 陣列

## 資料來源

| 檔案 | 來源 | 可否手改 |
|---|---|---|
| `js/problems.js` | 自動產生。題庫來自公開整理站；`EXAMS` 來自 CPE 官方 `test_data`（經 Wayback 存檔），題名一律以 [uHunt API](https://uhunt.onlinejudge.org/api/p) 覆蓋驗證 | ❌ 勿手改 |
| `js/stats.js` | 自動產生。uHunt 官方統計（AC 人數 / AC 率 / WA-AC 比） | ❌ 勿手改 |
| `js/solutions*.js` | 手寫詳解 | ✅ |
| `js/io.js` | 手寫的輸入輸出格式與範例 | ✅ |
| `js/data.js` `js/stl.js` | 手寫課表、陷阱卡、STL 導讀 | ✅ |

**新增題目資料前，題名一律先經 uHunt 驗證**。從整理站抓的題名有可辨識的錯位
（124 被標成 Dungeon Master、11060 被標成 Ultra-QuickSort），直接採用會讓
使用者點進完全不同的題目。

## 詳解的撰寫原則

只寫**有把握**的題目。不確定輸入格式、邊界條件或輸出規則時，
**寧可不寫**——這份東西是給人拿去背的，錯的詳解比沒有更糟。

已有的 147 題中，撰寫過程共撤掉 5 題、修正 4 題，全部來自自我複查。

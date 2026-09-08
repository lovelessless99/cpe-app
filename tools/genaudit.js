const fs=require('fs');
const R=require('path').join(__dirname,'..') + '/';
const S=[];for(let i=1;i<=108;i++)S.push(i===1?'solutions':'solutions'+i);
const nm=S.map(f=>f==='solutions'?'SOL':'SOL'+f.replace('solutions',''));
const A=new Function(S.map(f=>fs.readFileSync(R+'js/'+f+'.js','utf8')).join('\n')+
 ';return Object.assign({},'+nm.join(',')+');')();
const meta=new Function(fs.readFileSync(R+'js/problems.js','utf8')+
 ';var o={};function add(a,s){a.forEach(function(p){if(!o[p.uva])o[p.uva]={t:p.title,s:s};});}'+
 'add(P1,1);add(P2,2);add(P3,3);'+
 'EXAMS.forEach(function(e){e.ps.forEach(function(p){if(!o[p.uva])o[p.uva]={t:p.title||"",s:0};});});'+
 'return o;')();

const UNSURE=[];
for(const id of Object.keys(A).filter(k=>A[k].unsure)){
 const v=A[id];
 const t=v.t.replace(/<br>/g,'\n'), h=v.h.replace(/<br>/g,'\n');
 const hasSample=/範例輸入|樣例輸入|範例輸出/.test(v.q);
 const seg=(t+'\n'+h).split(/\n/).find(l=>l.includes('不確定'));
 let reason=seg?seg.replace(/<[^>]+>/g,'').replace(/^[①-⑳]\s*/,'').replace(/^\d+\.\s*/,'').replace(/^【[^】]*】/,'').replace(/\*\*/g,'').trim():'';
 const m=meta[id]||{t:'',s:0};
 UNSURE.push({id:Number(id),title:m.t,star:m.s,
  cat: reason? 'A' : (hasSample? 'B' : 'C'),
  why: reason});
}
UNSURE.sort((a,b)=>(a.cat<b.cat?-1:a.cat>b.cat?1:a.id-b.id));

const NOTDONE=[
 ['10159','A','48 個三角格與 12 條線 A~L 的對應完全畫在 PDF 的圖上，文字抽不出來。'],
 ['11200','A','路徑的定義依賴圖。試過「沿對角線走」的模型，3×3 範例算出 3 條但答案是 2，各種邊界排除規則都湊不出自洽解釋。'],
 ['10353','A','5 個與 8 個圓在正六邊形內的最佳排列方式只存在於圖上。'],
 ['10345','A','1~6 個正方形在圓內的最佳排列方式只存在於圖上。'],
 ['10289','A','7 種三角形排法在圖上。只能從範例的 4 位有效數字反推常數，t1 = sec15° 認得出來，其餘 5 個不行。'],
 ['10478','A','倒下柱子的幾何與「不穩定」的判定條件都在圖上。'],
 ['11092','A','試過 6×6×12 的所有螺旋方向，都對不上範例。'],
 ['10151','A','程式清單被抽取破壞，無法確認。'],
 ['10109','B','矩陣輸入區塊被排版打散成錯位數字，且輸出要精確分數（x[1] = 10/3）。'],
 ['11403','B','直式乘法的欄寬、破折號長度、空行位置在抽取後互相矛盾。'],
 ['10333','B','零件高度的選法已推導出來（左右各取「相異正整數和為 H、個數最多、字典序最大」，H=10 驗出 (4,3,2,1) 與 (7,2,1)），但塔的範例圖縮排不一致，還原不出確切排版。'],
 ['10155','B','數學式 ASCII 排版器，預期輸出橫跨三頁且被毀。'],
 ['10053','B','需要同時猜「105 9 還是 10 59」與一個未記載的旋轉規則。'],
 ['10108','C','基本遞推 n → n(n+1)/2 由範例 (4,1)→10 確認，但「每個 weekday 只留下開根號的數量」何時套用完全不明，而範例只有這一組。'],
 ['10076','C','公式與參數順序的 4 種組合全試過：最好的一組算出 110.5、另一組 156，題目答案是 112。第一組範例的 failed 每種讀法都對，所以連錯在哪都定位不出來。'],
 ['10135','C','推不出範例的 10.83。'],
 ['11053','C','96 / 698177783 / 999999994 這組在任何讀法下都重現不了。'],
 ['10541','C','理由記錄在當時的 commit 訊息裡。'],
 ['10520','C','理由記錄在當時的 commit 訊息裡。'],
 ['10468','C','理由記錄在當時的 commit 訊息裡。'],
 ['10248','D','已化簡成 10 個節點的有向鄉村郵差問題（2 位數 ab 是邊 a→b、1 位數是必訪節點，答案 = 最短覆蓋走訪的節點數）。需同時處理度數平衡與連通性；題目又允許任一解，單一範例無法驗證實作是否真的最佳。']
].map(([id,cat,why])=>({id:Number(id),title:(meta[id]||{t:''}).t,star:(meta[id]||{s:0}).s,cat,why}));

const out='/* 自動產生 — 詳解可信度清單。改動請改 scratchpad/genaudit.js 後重跑 */\n'+
 'const AUDIT_UNSURE = '+JSON.stringify(UNSURE)+';\n'+
 'const AUDIT_NOTDONE = '+JSON.stringify(NOTDONE)+';\n';
fs.writeFileSync(R+'js/audit.js',out);
console.log('unsure',UNSURE.length,'A/B/C =',
 UNSURE.filter(r=>r.cat==='A').length,UNSURE.filter(r=>r.cat==='B').length,UNSURE.filter(r=>r.cat==='C').length);
console.log('notdone',NOTDONE.length,'缺題名:',NOTDONE.filter(r=>!r.title).map(r=>r.id).join(' ')||'無');

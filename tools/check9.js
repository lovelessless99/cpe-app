const fs = require('fs');
const R = require('path').join(__dirname,'..') + '/';
const S = [];
for (let i = 1; i <= 108; i++) S.push('solutions' + (i === 1 ? '' : i));
const names = S.map(f => 'SOL' + (f === 'solutions' ? '' : f.slice(9)));
const src = S.map(f => fs.readFileSync(R + 'js/' + f + '.js', 'utf8'));
const A = new Function(src.join('\n') + ';return Object.assign({},' + names.join(',') + ');')();
const TAGS = new Function(fs.readFileSync(R + 'js/tags.js', 'utf8') + ';return TAGS;')();

const ids = Object.keys(A);
console.log('詳解總數:', ids.length);

// 1) 亂碼掃描
let moji = 0;
src.concat([fs.readFileSync(R + 'js/tags.js', 'utf8')]).forEach((s, i) => {
  if (/[\uFFFD]|å|æ|ç¨|ä¸/.test(s)) { console.log('  亂碼! ' + (S[i] || 'tags')); moji++; }
});
console.log('亂碼掃描:', moji === 0 ? '乾淨 ✓' : moji + ' 個檔案有問題');

// 2) C++ 基本檢查
const noMain = ids.filter(k => !/int\s+main\s*\(/.test(A[k].c));
const cio = ids.filter(k => /\b(printf|scanf|puts|gets|fgets|malloc|calloc|free)\s*\(/.test(A[k].c));
const noQ = ids.filter(k => !A[k].q || !A[k].h || !A[k].t);
console.log('缺 int main:', noMain.length ? noMain.join(',') : '無 ✓');
console.log('C 式 I/O   :', cio.length ? cio.join(',') : '無 ✓');
console.log('缺 q/h/t   :', noQ.length ? noQ.join(',') : '無 ✓');
console.log('標記 unsure:', ids.filter(k => A[k].unsure).length, '題');
const noTag = ids.filter(k => !TAGS[k]);
console.log('缺標籤     :', noTag.length ? noTag.join(',') : '無 ✓');

// 3) highlighter 往返
global.window = {};
eval(fs.readFileSync(R + 'js/hl.js', 'utf8'));
let bad = 0;
ids.forEach(k => {
  const out = window.highlightCpp(A[k].c);
  const o = (out.match(/<span/g) || []).length, c = (out.match(/<\/span>/g) || []).length;
  const plain = out.replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&amp;/g, '&');
  if (o !== c || plain !== A[k].c) { console.log('  highlighter 失敗:', k, o, c); bad++; }
});
console.log('highlighter:', bad === 0 ? ids.length + ' 題全部通過 ✓' : bad + ' 題失敗');

// 4) 歷屆覆蓋率
const D = new Function(fs.readFileSync(R + 'js/problems.js', 'utf8') + ';return EXAMS;')();
const set = new Set(); D.forEach(e => e.ps.forEach(p => set.add(String(p.uva))));
const done = [...set].filter(u => A[u]).length;
console.log('歷屆覆蓋   : ' + done + ' / ' + set.size + ' (' + (done * 100 / set.size).toFixed(0) + '%)');
const lines = ids.reduce((s, k) => s + A[k].c.split('\n').length, 0);
console.log('C++ 總行數 :', lines);

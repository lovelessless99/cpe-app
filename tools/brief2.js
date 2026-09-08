/* 二／三星題庫：列出尚無詳解者，依 uHunt AC 人數由多到少（越經典越前面） */
const fs = require('fs');
const R = require('path').join(__dirname,'..') + '/';
const S = []; for (let i = 1; i <= 108; i++) S.push('solutions' + (i === 1 ? '' : i));
const names = S.map(f => 'SOL' + (f === 'solutions' ? '' : f.slice(9)));
const D = new Function([...S, 'problems', 'statements', 'stats'].map(f =>
  fs.readFileSync(R + 'js/' + f + '.js', 'utf8')).join('\n') +
  ';return {A:Object.assign({},' + names.join(',') + '), P2, P3, STMT, UST};')();

const star = +(process.argv[2] || 2);
const from = +(process.argv[3] || 0), cnt = +(process.argv[4] || 12);
const CAP = +(process.argv[5] || 340);
const list = (star === 2 ? D.P2 : D.P3).filter(p => !D.A[p.uva]);
list.sort((a, b) => ((D.UST[b.uva] || {}).d || 0) - ((D.UST[a.uva] || {}).d || 0));
console.log(star + '星缺詳解 ' + list.length + ' 題，顯示 ' + (from + 1) + '–' + Math.min(from + cnt, list.length) + '\n');
list.slice(from, from + cnt).forEach((p, i) => {
  const st = D.STMT[p.uva], u = D.UST[p.uva] || {};
  console.log('#' + (from + i + 1) + ' UVa ' + p.uva + ' | ' + p.title + ' | AC ' + (u.d || '?') + ' 人 · ' + (u.r || '?') + '%');
  if (!st) { console.log('  (無原文)\n'); return; }
  const body = st.filter(s => !s.h || !/^Sample/.test(s.h));
  const desc = body.filter(s => !s.h).map(s => s.t).join(' ').slice(0, CAP);
  const inp = body.filter(s => s.h === 'Input').map(s => s.t).join(' ').slice(0, 170);
  const out = body.filter(s => s.h === 'Output').map(s => s.t).join(' ').slice(0, 170);
  const si = st.find(s => s.h === 'Sample Input'), so = st.find(s => s.h === 'Sample Output');
  if (desc) console.log('  ' + desc);
  if (inp) console.log('  IN: ' + inp);
  if (out) console.log('  OUT: ' + out);
  if (si) console.log('  SI: ' + (si.pre || '').replace(/\n/g, ' | ').slice(0, 120));
  if (so) console.log('  SO: ' + (so.pre || '').replace(/\n/g, ' | ').slice(0, 120));
  console.log('');
});

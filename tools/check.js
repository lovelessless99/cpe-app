const fs = require('fs');
const R = require('path').join(__dirname,'..') + '/';
const html = fs.readFileSync(R + 'index.html', 'utf8');
const app = fs.readFileSync(R + 'js/app.js', 'utf8');

const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
const used = [...new Set([...app.matchAll(/\$\('#([A-Za-z0-9_-]+)'\)/g)].map(m => m[1]))];
const miss = used.filter(i => !ids.has(i));
console.log('app.js 引用 id:', used.length, '→', miss.length ? '缺: ' + miss.join(', ') : '全部存在 ✓');

// index 載入的 js 檔是否都存在，且 sw.js SHELL 是否涵蓋
const srcs = [...html.matchAll(/src="(js\/[^"]+)"/g)].map(m => m[1]);
const sw = fs.readFileSync(R + 'sw.js', 'utf8');
const shell = [...sw.matchAll(/'\.\/([^']+)'/g)].map(m => m[1]);
console.log('index 載入', srcs.length, '個 js');
srcs.forEach(s => {
  const exists = fs.existsSync(R + s);
  const inShell = shell.includes(s);
  console.log(' ', s, exists ? '存在✓' : '缺檔✗', inShell ? 'SW已快取✓' : 'SW未列✗');
});

// BUILD 與 sw VERSION 是否一致
const build = app.match(/BUILD = '([^']+)'/)[1];
const ver = sw.match(/VERSION = '([^']+)'/)[1];
console.log('---');
console.log('app BUILD =', build, '/ sw VERSION =', ver, build === ver ? '一致 ✓' : '不一致 ✗');

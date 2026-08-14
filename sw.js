/* Service Worker
   策略：程式碼與樣式一律「網路優先」，快取只當離線後備。
   圖示這類永不變動的資源才用快取優先。

   為什麼不用快取優先：先前版本對 js/css 用 stale-while-revalidate
   （return hit || net），造成每次改版後使用者第一次開啟拿到的是舊程式碼，
   要重載兩次才正常——會出現「index.html 是新的、app.js 是舊的」這種
   難以察覺的半更新狀態。這個 App 只有幾百 KB，freshness 遠比省那幾十毫秒重要。 */

const VERSION = 'cpe-v8';
const SHELL = [
  './',
  './index.html',
  './css/style.css',
  './js/problems.js',
  './js/solutions.js',
  './js/solutions2.js',
  './js/solutions3.js',
  './js/solutions4.js',
  './js/stats.js',
  './js/data.js',
  './js/stl.js',
  './js/hl.js',
  './js/app.js',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// 讓頁面能查詢目前實際執行的版本
self.addEventListener('message', e => {
  if (e.data === 'version' && e.source) e.source.postMessage({ version: VERSION });
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;      // 外部連結不攔截

  const isCode = req.mode === 'navigate' ||
    url.pathname.endsWith('/') ||
    /\.(js|css|html|webmanifest)$/.test(url.pathname);

  if (isCode) {
    // 網路優先：永遠拿最新的，離線才回落快取
    e.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(VERSION).then(c => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req).then(hit => hit || caches.match('./index.html')))
    );
    return;
  }

  // 圖示等不會變動的資源：快取優先
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && res.status === 200) {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(req, copy));
      }
      return res;
    }))
  );
});

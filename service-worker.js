const CACHE_NAME = "portfolio-cache-v1";

const urltoCache = [
    "service-worker.js",
    "offline.html",
];

let lastKnownOnline = true;

const OFFLINE_PATH = '/offline.html';
const INDEX_PATH = '/index.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await Promise.all(
        urltoCache.map(async (url) => {
          try {
            const request = new Request(url, { cache: 'no-cache' });
            const response = await fetch(request);
            if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
            await cache.put(url, response.clone());
          } catch (err) {
            console.warn('Resource failed to cache:', url, err);
          }
        })
      );
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

async function notifyClients(source) {
  const allClients = await self.clients.matchAll({ includeUncontrolled: true });
  for (const client of allClients) {
    client.postMessage({ source });
  }
}

async function navigateAllClients(path) {
  try {
    const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of allClients) {
      try {
        const clientUrl = new URL(client.url);
        const targetUrl = new URL(path, self.location.origin).href;
        if (clientUrl.href !== targetUrl) {
          await client.navigate(targetUrl).catch(() => {});
        } else {
          client.postMessage({ action: 'reload' });
        }
      } catch (e) {
        console.warn('navigateAllClients client navigation failed', e);
      }
    }
  } catch (e) {
    console.warn('navigateAllClients failed', e);
  }
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    (async () => {
      const request = event.request;
      try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.status === 200) {
          const cache = await caches.open(CACHE_NAME);
          try {
            const reqUrl = new URL(request.url);
            if (reqUrl.protocol === 'http:' || reqUrl.protocol === 'https:') {
              cache.put(request, networkResponse.clone()).catch((e) => console.warn('Cache put failed', e));
            }
          } catch (e) {
            console.warn('Skipping cache.put due to invalid URL', request.url, e);
          }
          if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
            notifyClients('network');
            if (!lastKnownOnline) {
              lastKnownOnline = true;
              navigateAllClients(INDEX_PATH);
            }
          }
        }
        return networkResponse;
      } catch (err) {
        const cached = await caches.match(request);
        if (cached) {
          if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
            notifyClients('cache');
          }
          return cached;
        }

        if (request.mode === 'navigate') {
          const fallback = await caches.match('offline.html');
          if (fallback) {
            notifyClients('cache');
            if (lastKnownOnline) {
              lastKnownOnline = false;
              navigateAllClients(OFFLINE_PATH);
            }
            return fallback;
          }
        }

        throw err;
      }
    })()
  );
});

self.addEventListener('message', (event) => {
  try {
    if (event.data && event.data.type === 'CHECK_ONLINE_STATUS') {
      const isOnline = (self.navigator && typeof self.navigator.onLine === 'boolean') ? self.navigator.onLine : true;
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({ online: isOnline });
      } else if (event.source && typeof event.source.postMessage === 'function') {
        event.source.postMessage({ online: isOnline });
      }
    }
  } catch (e) {
    console.warn('Service worker message handler error', e);
  }
});
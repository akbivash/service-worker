let cacheName = 'v4';

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(cacheName);
  await cache.addAll(resources);
};

self.addEventListener('install', (event) => {
  console.log('installed');
  event.waitUntil(
    addResourcesToCache([
      // './index.html',
      './style.css',
    ])
  );
});

self.addEventListener('activate', (e) => {
  console.log('activated', caches);
  e.waitUntil(caches.keys().then(cacheNames => {
    return Promise.all(cacheNames.map(cache => {
      if (cache !== cacheName) {
        console.log('clearing old cache');
        return caches.delete(cache);
      }
    }));
  }));
  return self.clients.claim();
});

const cacheFirst = async (request) => {
  const responseFromCache = await caches.match(request);

  if (responseFromCache) {
    return responseFromCache;
  }

  return fetch(request).then(res => {
    const resClone = res.clone()
    caches.open(cacheName).then(cache => {
      cache.put(request, resClone)
    })
    return res
  })
};

self.addEventListener('fetch', (event) => {
  event.respondWith(cacheFirst(event.request));
});


self.addEventListener('message', async (event) => {
  if (event.data && event.data.type === 'heavy-calculation-request') {
    // Perform your heavy calculation here
    console.log('msg')
    self.clients.matchAll().then(clients => {
      clients.forEach(client => client.postMessage({msg: 'Hello from SW', type:'heavy-calculation-request'}));
  })
  }
});

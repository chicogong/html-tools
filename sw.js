// Service Worker for WebUtils PWA
const CACHE_NAME = 'webutils-v1';
const OFFLINE_URL = './offline.html';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/favicon.svg',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/apple-touch-icon.png',
  '/manifest.json'
];

// Install event - precache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Precaching core assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests (like fonts from Google)
  if (url.origin !== location.origin) {
    // For external resources, try network first, then cache
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // For HTML pages - Network first strategy
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful HTML responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          // Try cache first
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;
          
          // If not in cache, show offline page
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // For other assets (JS, CSS, images) - Cache first strategy
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Return cached response and update cache in background
          fetch(request).then(response => {
            if (response.ok) {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(request, response);
              });
            }
          }).catch(() => {});
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetch(request).then(response => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
  );
});

// Handle messages from clients
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

const CACHE_NAME = 'english-game-library-v1'
const scopeUrl = new URL(self.registration.scope)
const fromScope = (path = '') => new URL(path, scopeUrl).toString()
const APP_SHELL = [
  fromScope(),
  fromScope('favicon.svg'),
  fromScope('site.webmanifest'),
  fromScope('images/optimized/memory-cover-new.webp'),
  fromScope('images/optimized/quest-cover-new.webp'),
  fromScope('images/optimized/storyboard-cover-new.webp'),
  fromScope('images/optimized/storyboard-cards.webp'),
  fromScope('images/optimized/back-card.webp'),
  fromScope('images/optimized/victory-screen.webp'),
]

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(async (cache) => {
    await cache.addAll(APP_SHELL)
    const pageResponse = await fetch(fromScope())
    const pageHtml = await pageResponse.clone().text()
    await cache.put(fromScope(), pageResponse)
    const builtAssets = [...pageHtml.matchAll(/(?:src|href)="([^"]+)"/g)]
      .map((match) => new URL(match[1], scopeUrl).toString())
      .filter((url) => new URL(url).origin === scopeUrl.origin)
    await cache.addAll([...new Set(builtAssets)])
  }))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET' || new URL(request.url).origin !== scopeUrl.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone()
          void caches.open(CACHE_NAME).then((cache) => cache.put(fromScope(), copy))
          return response
        })
        .catch(() => caches.match(fromScope())),
    )
    return
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok) {
        const copy = response.clone()
        void caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
      }
      return response
    })),
  )
})

const CACHE_NAME = 'cloudready-static-v1'
const QUESTION_BANK_URL = '/data/questions.json'

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      const shellResponse = await fetch('/')

      if (!shellResponse.ok) {
        throw new Error(
          `Could not cache the app shell (${shellResponse.status}).`,
        )
      }

      await cache.put('/', shellResponse.clone())
      const shellHtml = await shellResponse.text()
      const assetUrls = Array.from(
        shellHtml.matchAll(
          /<script[^>]+src="([^"]+\.js)"|<link[^>]+href="([^"]+\.css)"/g,
        ),
        (match) => match[1] || match[2],
      )

      await Promise.all(
        assetUrls.map(async (assetUrl) => {
          const response = await fetch(assetUrl)
          if (!response.ok) {
            throw new Error(`Could not cache app asset ${assetUrl}.`)
          }
          await cache.put(assetUrl, response)
        }),
      )

      try {
        const questionResponse = await fetch(QUESTION_BANK_URL)
        const contentType =
          questionResponse.headers.get('content-type')?.toLowerCase() || ''
        if (questionResponse.ok && contentType.includes('application/json')) {
          await cache.put(QUESTION_BANK_URL, questionResponse)
        } else if (questionResponse.status !== 404) {
          throw new Error(
            `Question bank was not valid JSON (${questionResponse.status}).`,
          )
        }
      } catch (error) {
        console.warn(
          'Question bank could not be cached for offline use.',
          error,
        )
      }

      await self.skipWaiting()
    })(),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      )
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  const requestUrl = new URL(request.url)

  if (
    request.method !== 'GET' ||
    requestUrl.origin !== self.location.origin ||
    requestUrl.pathname.startsWith('/api/')
  ) {
    return
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME)

      if (request.mode === 'navigate') {
        try {
          const response = await fetch(request)
          if (response.ok) await cache.put(request, response.clone())
          return response
        } catch (error) {
          const cachedPage = await cache.match(request)
          if (cachedPage) return cachedPage
          const cachedHome = await cache.match('/')
          if (cachedHome) return cachedHome
          throw error
        }
      }

      if (requestUrl.pathname === QUESTION_BANK_URL) {
        try {
          const response = await fetch(request)
          if (response.ok) await cache.put(request, response.clone())
          return response
        } catch (error) {
          const cachedQuestions = await cache.match(request)
          if (cachedQuestions) return cachedQuestions
          throw error
        }
      }

      const cachedResponse = await cache.match(request)
      if (cachedResponse) return cachedResponse

      const response = await fetch(request)
      if (response.ok) await cache.put(request, response.clone())
      return response
    })(),
  )
})

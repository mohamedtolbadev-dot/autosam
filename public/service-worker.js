/**
 * Service Worker for AutoSam PWA
 * Handles caching for offline functionality
 * ⚠️ SECURITY: Never cache auth or admin endpoints
 */

const CACHE_NAME = 'autosam-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon_app.jpg'
];

// API endpoints to cache - ONLY public endpoints
const API_CACHE_NAME = 'autosam-api-v2';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((err) => {
        console.log('[Service Worker] Cache failed:', err);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== API_CACHE_NAME)
          .map((name) => {
            console.log('[Service Worker] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // 🚨 SECURITY: Never cache auth or admin endpoints
  if (url.pathname.includes('/auth/') || 
      url.pathname.includes('/admin/') ||
      url.pathname.includes('/bookings') ||
      url.pathname.includes('/profile')) {
    console.log('[Service Worker] Skipping cache for sensitive endpoint:', url.pathname);
    return;
  }

  // Only cache public /api/cars endpoint (not /api/admin/cars)
  if (url.pathname === '/api/cars' || url.pathname.startsWith('/api/cars/')) {
    // Make sure it's not an admin endpoint
    if (!url.pathname.includes('/admin/')) {
      event.respondWith(handleAPIRequest(request));
      return;
    }
  }

  // Handle static assets
  if (request.mode === 'navigate' || 
      request.destination === 'style' || 
      request.destination === 'script' ||
      request.destination === 'image' ||
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith('.svg')) {
    event.respondWith(handleStaticRequest(request));
  }
});

// Handle API requests with caching
async function handleAPIRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Clone and cache the response
      const responseToCache = networkResponse.clone();
      await cache.put(request, responseToCache);
      console.log('[Service Worker] API data cached:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    console.log('[Service Worker] Network failed, trying cache:', request.url);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('[Service Worker] Serving cached API data:', request.url);
      return cachedResponse;
    }
    
    // No cached data available
    console.log('[Service Worker] No cached data available:', request.url);
    return new Response(
      JSON.stringify({ 
        error: 'Offline',
        message: 'No cached data available. Please connect to the internet.'
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle static assets
async function handleStaticRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  
  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    // Update cache in background
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse.ok) {
          cache.put(request, networkResponse.clone());
        }
      })
      .catch(() => {
        // Network failed, but we have cached version
      });
    return cachedResponse;
  }

  // Not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok && networkResponse.type === 'basic') {
      // Cache the new response
      const responseToCache = networkResponse.clone();
      await cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[Service Worker] Fetch failed:', error);
    
    // Return offline fallback for navigation requests
    if (request.mode === 'navigate') {
      return cache.match('/index.html');
    }
    
    throw error;
  }
}

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('[Service Worker] Background sync triggered');
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'Nouvelle notification',
    icon: '/icons/icon_app.jpg',
    badge: '/icons/icon_app.jpg',
    vibrate: [100, 50, 100],
    data: {
      url: '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification('AutoSam', options)
  );
});

// Message handler from main thread
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

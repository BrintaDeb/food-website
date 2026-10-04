// CurryCraft Progressive Web App Service Worker
const CACHE_NAME = 'currycraft-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Push notification handling
self.addEventListener('push', (event) => {
  let data = {
    title: 'CurryCraft Update 🍛',
    body: 'Your royal order status has advanced!',
    url: '/portal'
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/images/kolkata-biryani.jpg',
    badge: '/images/kolkata-biryani.jpg',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/portal'
    }
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click navigation
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/portal';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

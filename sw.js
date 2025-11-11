const CACHE_NAME = 'peta-cache-v1';

self.addEventListener('install', event => {
  console.log('[SW] Install event');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[SW] Activate event');
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        if (response) {
          console.log('[Cache] Hit:', event.request.url);
          return response;
        }

        return fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
            console.log('[Cache] Stored:', event.request.url);
          }
          return networkResponse;
        }).catch(err => {
          console.log('[Offline] Fetch failed:', event.request.url);
          return cache.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return new Response('Offline - Resource not available', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
        });
      });
    })
  );
});

self.addEventListener('push', event => {
  console.log('[Push] Push event received:', event);

  let notificationData = {
    title: 'Notifikasi Peta Dunia',
    body: 'Anda menerima pesan baru',
    icon: '/favicon.png'
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        title: data.title || notificationData.title,
        body: data.body || notificationData.body,
        icon: data.icon || notificationData.icon
      };
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }

  console.log('[Push] Showing notification:', notificationData);

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      tag: 'peta-notification',
      requireInteraction: false
    })
  );
});

self.addEventListener('notificationclick', event => {
  console.log('[Notification] Clicked:', event.notification.title);
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (let i = 0; i < clientList.length; i++) {
        if (clientList[i].url === '/' && 'focus' in clientList[i]) {
          return clientList[i].focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
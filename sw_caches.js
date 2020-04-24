const cacheVersion = "version1";

self.addEventListener("install", (e) => {
  console.log("service worker installed");
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== cacheVersion) {
            console.log("deleting old caches");
            caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const resClone = res.clone();
        caches
          .open(cacheVersion)
          .then((cache) => cache.put(e.request, resClone));
        return res;
      })
      .catch((err) =>
        caches.open(cacheVersion).then((cache) => cache.match(e.request))
      )
  );
});

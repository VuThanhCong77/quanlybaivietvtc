const CACHE_NAME = "vtc-cache-v1";

const urlsToCache = [
  "/quanlybaivietvtc/",
  "/quanlybaivietvtc/index.html",
  "/quanlybaivietvtc/posts_data.json"
];

// Cài đặt cache
self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })

  );

});

// Lấy dữ liệu
self.addEventListener("fetch", event => {

  event.respondWith(

    caches.match(event.request)
      .then(response => {

        return response || fetch(event.request);

      })

  );

});
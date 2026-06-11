const CACHE_NAME = "vtc-cache-v1";

const urlsToCache = [
   "/quanlybaivietvtc/",
  "/quanlybaivietvtc/index.html",
  "/quanlybaivietvtc/tai-nguyen/seo/offline.html",
  "/quanlybaivietvtc/du-lieu/bai-viet.json"
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

    fetch(event.request)

      .catch(() => {

        return caches.match(
        "/quanlybaivietvtc/tai-nguyen/seo/offline.html"
        );

      })

  );

});
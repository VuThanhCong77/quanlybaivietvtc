const CACHE_NAME = "vtc-cache-v1";

const urlsToCache = [
   "https://vuthanhcong77.github.io/quanlybaivietvtc/",
  "https://vuthanhcong77.github.io/quanlybaivietvtc/index.html",
  "https://vuthanhcong77.github.io/quanlybaivietvtc/tai-nguyen/seo/offline.html",
  "https://vuthanhcong77.github.io/quanlybaivietvtc/du-lieu/bai-viet.json"
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
        "https://vuthanhcong77.github.io/quanlybaivietvtc/tai-nguyen/seo/offline.html"
        );

      })

  );

});

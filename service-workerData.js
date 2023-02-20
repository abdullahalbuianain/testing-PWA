var cachName = 'my-lesson-booking-v1';
var cachedFiles = [
  'index.html',
  'lessons.js',
  'assets/english.jpg',
  'assets/math.jpg',
  'assets/musical-notes.jpg',
  'assets/Science.jpg',
  'assets/Social-Studies.jpg',
];

self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(cachName).then(function(cache) {
          console.log('Opened cache');
          return cache.addAll(cachedFiles);
        })
    );
  });

  self.addEventListener("fetch", function(event) {
    event.respondWith(
      caches.match(event.request).then(function (cachedFiles) {

        if (cachedFiles) {
          console.log("[service worker] Resource fetched from the cache for:" + event.request.url);
          
          return cachedFiles;

        } else {
          return fetch(event.request).then(function (response) {
            
            return caches.open(cachName).then(function (cache) {
             
              cache.put(event.request, response.clone());
              console.log("[service worker] Resource fetched and saved in the cache for:" + event.request.url);
              
              return response;
            });
          });
        }
      })
    );
  });
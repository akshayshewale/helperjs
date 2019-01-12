const cacheVersion = "v1"

const cacheFiles = [
    "css/custom.css",
    "js/jquery.js",
    "css/material.css",
    "js/material.js",
    "js/app.js",
]

const installStart = function (req) {
    req.waitUntil(
        caches.open(cacheVersion)
        .then(function (cache) {
            return cache.addAll(cacheFiles)
        })
        .catch(function (e) {
            return e;
        })
    )
}


const fetchStart = function (res) {
    res.respondWith(
        //check cache for files
        caches.open(cacheVersion).then(function (cache) {
            //if match return cached files
            return cache.match(res.request)
                .then(function (response) {
                    return response || fetch(res.request)
                        .then(function (response) {
                            //if not data.php or query.php get files from server and store in cache
                            let resCopy = response.clone().url.toString();
                            if (!(resCopy.indexOf("index.html") > -1 || resCopy.indexOf("query.php") > -1)) {
                                console.log(resCopy);
                                cache.put(res.request, response.clone());
                            }
                            //return the files
                            return response.clone();
                        });
                });
        })
    );
}

self.addEventListener("install", installStart)
//self.addEventListener("activate", activateStart)
self.addEventListener("fetch", fetchStart)

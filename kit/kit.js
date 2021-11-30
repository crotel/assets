// const caches = CacheStorage;
const hj = {
    method: 'GET',
    mode: 'no-cors',
    // cache: 'default',
    headers: {
        "content-type": "application/json; charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*"
        // "Access-Control-Allow-Methods": "GET",/*HEAD,POST,OPTIONS",*/
        // "Access-Control-Max-Age": "86400",
        // Link: "</http2_push/h2p/test.css>; rel=preload; as=style",
    },
};
const hjs = {
    method: 'GET',
    mode: 'no-cors',
    cache: 'default',
    headers: {
        "content-type": "application/javascript; charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*"
        // "Access-Control-Allow-Methods": "GET",/*HEAD,POST,OPTIONS",*/
        // "Access-Control-Max-Age": "86400",
        // Link: "</http2_push/h2p/test.css>; rel=preload; as=style",
    },
};
const hcss = {
    method: 'GET',
    mode: 'no-cors',
    cache: 'default',
    headers: {
        "content-type": "text/css; charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*"
        // "Access-Control-Allow-Methods": "GET",/*HEAD,POST,OPTIONS",*/
        // "Access-Control-Max-Age": "86400",
        // Link: "</http2_push/h2p/test.css>; rel=preload; as=style",
    },
};

async function handleRequest(request) {
    const {headers, method, url} = request;
    const {pathname, search, searchParams} = new URL(url);
    console.log(pathname, search, searchParams);
    switch (pathname) {
        case '/': {
            return await fetch("index.html");
            break;
        }
        case '/kit.css': {
            return await fetch("kit.css", hcss);
            // return new Response("kit.css",hcss);
            break;
        }
        // case '/kit.js':{
        //     return new Response("kit.js",hjs);
        //     // return await fetch("kit_01.js");
        //     break;
        // }
        case '/kit_01.js': {
            // return new Response("kit_01.js",hjs);
            return await fetch("kit_01.js", hjs);
            break;
        }
        case '/api' : {
            switch (method) {
                case 'GET': {
                    // console.log("api/get");
                    switch (search) {
                        case '': {
                            console.log("api/get/list");
                            const value = await fetch("https://kit.sbs/api", hj);
                            // const value = await KV_KIT.list({"prefix": "kit:index:","limit": 10, "cacheTtl": 3600});
                            // console.log(value);
                            // console.log(JSON.stringify(value.keys,null,2));
                            return new Response(JSON.stringify(await value.keys, null, 2), hj);
                            break;
                        }
                        default: {
                            console.log("api/get/id");
                            // console.log(decodeURIComponent(search).slice(1).trim())
                            const value = await fetch("https://kit.sbs/api" + decodeURIComponent(search), hj);
                            return new Response(JSON.stringify(await value, null, 2), hj);
                            break;
                        }
                    }
                    break;
                }
                case 'POST': {
                    // console.log("api/post")
                    let key = decodeURIComponent(search).slice(1).trim();
                    console.log(key);
                    // console.log(key);
                    // console.log(KV_KIT.get(key))
                    // let test = await KV_KIT.get(key);
                    // // console.log(test)
                    // if (test !== null) {
                    //     return new Response("KEY already exists, use \'PUT\' or \'DELETE\' before \'POST\'");
                    // }
                    /* request two times and mask as force */
                    // let xkey =  request.headers.get("x-key"); //searchParams.get("id")
                    // let key = ['kit','index',xkey].join(":");//(`kit:index:${xkey}`);
                    // let value = await request.text();//request.clone().text();
                    // console.log(key,value)
                    // return await KV_KIT.put(key,value,{expirationTtl: 60});
                    break;
                }

            }
            // switch (method){
            //     case 'GET':{
            //         console.log(pathname);
            //         switch (pathname){
            //
            //             case '/api':{
            //                 console.log("got API");
            //                 return await fetch("https://kit.sbs/api",headers);
            //                 break;
            //             }
            //             default :{
            //                 console.log("not API");
            //                 break;
            //             }
            //         }
            //         break;
            //     }
            //     case 'POST':{
            //         break;
            //     }
            // }
            // if (request.method === 'GET') {
            //     console.log("here");
            // }
            break;
        }
    }
}

self.addEventListener('install', function (event) {
    /*Put offline.html page into cache*/
    // var offlineRequest = new Request('offline.html');
    var offlineRequest = new Request('index.html');
    event.waitUntil(
        fetch(offlineRequest).then(function (response) {
            return caches.open('offline').then(function (cache) {
                console.log('[oninstall] Cached offline page', response.url);
                return cache.put(offlineRequest, response);
            });
        })
    );
});
self.addEventListener('fetch', function (event) {
    /*Only fall back for HTML documents.*/
    // var request = event.request;
    return event.respondWith(handleRequest(event.request));
    /*&& request.headers.get(‘accept’).includes(‘text/html’)*/
    // if (request.method === 'GET') {
    //     event.respondWith(handleRequest(event.request))
    //     /*fetch() will use the cache when possible, to this examples depends on cache-busting URL parameter to avoid the cache.*/
    //   event.respondWith(
    //     fetch(request).catch(function(error) {
    //         /*fetch() throws an exception when the server is unreachable but not for valid HTTP responses, even 4xx or 5xx range.*/
    //       console.error(
    //         '[onfetch] Failed. Serving cached offline fallback ' +
    //         error
    //         );
    //       return caches.open('offline').then(function(cache) {
    //         return cache.match('offline.html');
    //       });
    //     })
    //     );
    // }
    /*Any other handlers come here. Without calls to event.respondWith() the request will be handled without the ServiceWorker.*/
}, true);

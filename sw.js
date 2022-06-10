/*Asignamos nombre a nuestro Almacenamiento Cache*/

const CACHE_NAME = 'panerita-v3';
const urlsToCache = [
    '/panerita/public/libraries/bootstrap/css/bootstrap.min.css',
    '/panerita/public/css/style.css',
    '/panerita/public/libraries/alertify/css/alertify.min.css',
    '/panerita/public/libraries/croppie/croppie.css',
    '/panerita/public/libraries/bootstrap/js/bootstrap.min.js',
    '/panerita/public/js/navbar-plus.js',
    '/panerita/public/libraries/page.js',
    '/panerita/public/libraries/croppie/croppie.js',
    '/panerita/public/libraries/alertify/alertify.min.js',
    '/panerita/public/js/app.js',
    '/panerita/public/img/icon.svg',
    '/panerita/public/img/panerita-sm.svg',
    '/panerita/views/sections/carga-masiva.html',
    '/panerita/views/sections/cargas.html',
    '/panerita/views/sections/cierre.html',
    '/panerita/views/sections/clientes.html',
    '/panerita/views/sections/comprobantes.html',
    '/panerita/views/sections/editar-comprobante.html',
    '/panerita/views/sections/foto-perfil.html',
    '/panerita/views/sections/notas.html',
    '/panerita/views/sections/nuevo-comprobante.html',
    '/panerita/views/sections/perfil.html',
    '/panerita/views/sections/productos.html',
    '/panerita/views/sections/usuarios.html',
    '/panerita/views/sections/ventas.html',
    '/panerita/views/partials/footer.html',
    '/panerita/views/partials/head.html',
    '/panerita/views/partials/header-empleado.html',
    '/panerita/views/partials/header.html',
    '/panerita/views/partials/impresion.html',
    '/panerita/views/partials/login-head.html',
    '/panerita/views/partials/login.html',
    '/panerita/views/partials/main.html',
    '/panerita/views/partials/sin-conexion.html'
];

//durante la fase de instalacion, almacena en cache los archivos estaticos del sitio
self.addEventListener('install', (e)=>{
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache)=>{
            return cache.addAll(urlsToCache)
            .then(()=>self.skipWaiting())
        })
        .catch(e=>{console.log(e)})
    )
});

//nos permite, activar nuestro ServiceWorker, cuando perdemos la conexiones por ejemplo
self.addEventListener('activate', (e)=>{
    const cacheWhiteList = [CACHE_NAME];
    e.waitUntil(
        caches.keys()
        .then(cachesNames =>{
            cachesNames.map(cacheName =>{//evalua en el cache que cambio o que recurso es diferente
                if(cacheWhiteList.indexOf(cacheName) === -1){
                    return caches.delete(cacheName);
                }
            })
    })
    .then(()=>{self.clients.claim()})
    )
});

//Fetech, recupera todos los recursos del navegador (cuando restablesca la conexion)
self.addEventListener('fetch', (e)=>{
    e.respondWith(
        caches.match(e.request)
        .then(res => {
            if(res){//recuperando del cache
                return res;
            }
            return fetch(e.request)
        })
    )
});
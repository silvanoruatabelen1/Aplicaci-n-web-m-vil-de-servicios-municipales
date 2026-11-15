'use strict';
const CACHE='sf-cerca-demo-v1';
const FILES=['/','/index.html','/styles.css','/app.js','/assets/icon.svg','/manifest.webmanifest'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',event=>{
  const req=event.request;if(req.method!=='GET'||new URL(req.url).pathname.startsWith('/api/'))return;
  event.respondWith(fetch(req).then(res=>{if(res.ok&&new URL(req.url).origin===self.location.origin){const c=res.clone();caches.open(CACHE).then(cache=>cache.put(req,c));}return res;}).catch(()=>caches.match(req).then(r=>r||caches.match('/index.html'))));
});
// Recepción preparada para un proveedor Web Push real: el backend DEMO no incluye
// suscripciones VAPID ni envío remoto; las notificaciones mostradas en el TP son locales.
self.addEventListener('push',event=>{
  let p={title:'San Francisco Cerca',body:'Nuevo aviso de demostración'};
  try {if(event.data)p={...p,...event.data.json()};} catch {}
  event.waitUntil(self.registration.showNotification(p.title,{body:p.body,icon:'/assets/icon.svg',tag:'sf-demo-push',data:{url:'/#/avisos'}}));
});
self.addEventListener('notificationclick',event=>{event.notification.close();event.waitUntil(self.clients.openWindow(event.notification.data?.url||'/#/avisos'));});

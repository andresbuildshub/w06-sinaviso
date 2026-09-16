// Service worker mínimo: solo para mostrar la notificación local del "toque" y volver a la página al tocarla.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()))
self.addEventListener('notificationclick', e => {
  e.notification.close()
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    const c = cs.find(x => x.url.includes('/ensayo'))
    return c ? c.focus() : self.clients.openWindow('/ensayo')
  }))
})

import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let datos = {
    titulo: "FocusFlow",
    mensaje: "Terminó tu temporizador.",
  };

  if (event.data) {
    try {
      datos = event.data.json();
    } catch {
      datos.mensaje = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(datos.titulo, {
      body: datos.mensaje,
      icon: "/pwa-192x192.png",
      badge: "/pwa-192x192.png",
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const accion = event.action;

  event.waitUntil(
    self.clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then(async (clientes) => {
        console.log("CLIENTES ENCONTRADOS:", clientes.length);
        console.log("ACCIÓN:", accion);

        if (clientes.length > 0) {
          const cliente = clientes[0];

          await cliente.focus();

          cliente.postMessage({
            tipo: "accion-notificacion",
            accion,
          });
        }
      }),
  );
});

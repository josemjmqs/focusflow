import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);

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

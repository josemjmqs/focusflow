# Requisitos No Funcionales

## RNF-01: Rendimiento

La aplicación debe responder de forma fluida a las acciones del usuario y mantener el temporizador funcionando correctamente mientras la aplicación está activa o en segundo plano.

El tiempo mostrado por el temporizador se recalcula utilizando marcas de tiempo, en lugar de depender únicamente de la cantidad de ejecuciones del intervalo de JavaScript.

---

## RNF-02: Persistencia de datos

La información de usuarios y sesiones debe almacenarse de forma persistente en PostgreSQL.

Determinados estados y configuraciones del temporizador se mantienen localmente mediante `localStorage` para mejorar la continuidad de la experiencia del usuario.

---

## RNF-03: Usabilidad

La interfaz debe ser sencilla e intuitiva, permitiendo al usuario:

- Registrarse e iniciar sesión.
- Iniciar, pausar, reanudar y finalizar una sesión.
- Configurar los períodos de trabajo y descanso.
- Consultar su historial y estadísticas.

---

## RNF-04: Diseño responsive

La aplicación debe adaptarse a distintos tamaños de pantalla, incluyendo:

- Dispositivos móviles.
- Tablets.
- Computadores.

---

## RNF-05: Disponibilidad

El sistema debe permitir utilizar las funcionalidades disponibles mientras el frontend, backend y servicio de base de datos se encuentren operativos.

La aplicación debe gestionar los errores de comunicación con el backend y mostrar información al usuario cuando una operación no pueda completarse.

---

## RNF-06: Mantenibilidad

El código debe estar organizado en componentes y módulos con responsabilidades separadas.

El proyecto separa:

- Componentes y servicios del frontend.
- Rutas, middleware y controladores del backend.
- Configuración de la conexión a PostgreSQL.
- Documentación técnica del proyecto.

Esta organización facilita realizar cambios y añadir nuevas funcionalidades.

---

## RNF-07: Compatibilidad

La aplicación debe funcionar en navegadores modernos compatibles con las tecnologías utilizadas por React, Vite, Service Workers y las APIs del navegador requeridas por la aplicación.

Las funcionalidades PWA y notificaciones pueden depender del soporte del navegador y de los permisos otorgados por el usuario.

---

## RNF-08: Seguridad

La aplicación debe proteger los datos de cada usuario y evitar el acceso no autorizado.

Para ello:

- Las contraseñas se almacenan mediante hashes con bcrypt.
- Las rutas protegidas utilizan JWT.
- El backend identifica al usuario autenticado antes de acceder a sus sesiones y estadísticas.
- Las variables de entorno y credenciales no se almacenan en el repositorio.
- El repositorio utiliza `.gitignore` para excluir archivos `.env`.

---

## RNF-09: Escalabilidad

La separación entre frontend, API REST y base de datos permite ampliar cada parte del sistema de forma independiente.

El backend utiliza una conexión mediante pool de PostgreSQL, permitiendo gestionar múltiples solicitudes sin crear una conexión nueva para cada operación.

---

## RNF-10: Instalabilidad

La aplicación puede instalarse como Progressive Web App (PWA) en navegadores compatibles.

Esto permite acceder a la aplicación desde un dispositivo como una aplicación instalada, manteniendo la arquitectura web del proyecto.

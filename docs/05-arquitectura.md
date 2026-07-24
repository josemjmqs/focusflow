# Arquitectura

## Arquitectura general

FocusFlow seguirá una arquitectura cliente-servidor de tres capas:

* **Frontend:** React.
* **Backend:** Node.js con Express.
* **Base de datos:** PostgreSQL.

El frontend será el encargado de la interfaz de usuario y de enviar solicitudes HTTP al backend.

El backend implementará una API REST responsable de procesar las solicitudes, aplicar la lógica de negocio y comunicarse con la base de datos.

PostgreSQL almacenará de forma permanente la información de las sesiones de concentración.

---

## Flujo de la aplicación

```text
Usuario
    │
    ▼
React (Frontend)
    │
HTTP
    ▼
Express (API REST)
    │
SQL
    ▼
PostgreSQL
```

---

## Responsabilidades

### Frontend

* Mostrar el temporizador.
* Permitir iniciar una sesión.
* Mostrar el historial de sesiones.
* Consumir la API del backend.

### Backend

* Exponer la API REST.
* Registrar nuevas sesiones.
* Consultar el historial.
* Eliminar sesiones.
* Comunicarse con PostgreSQL.

### Base de datos

* Almacenar las sesiones.
* Consultar sesiones registradas.
* Eliminar sesiones.

---

## Comunicación

La comunicación entre el frontend y el backend se realizará mediante una API REST utilizando el protocolo HTTP y datos en formato JSON.

---

## Estructura del proyecto

```text
focusflow/

├── backend/
│   ├── src/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── services/
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── docs/
```

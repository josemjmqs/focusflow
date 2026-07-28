# API REST

## Sesiones

---

## GET /api/sesiones

Obtiene el historial de sesiones registradas.

### Descripción

Retorna todas las sesiones ordenadas desde la más reciente hasta la más antigua.

### Respuesta

Código:

```
200 OK
```

Ejemplo:

```json
[
  {
    "id": 10,
    "inicio": "2026-07-28T18:39:26.631Z",
    "fin": "2026-07-28T18:40:04.687Z",
    "duracion": 38,
    "estado": "completada"
  }
]
```

### Campos

| Campo    | Tipo      | Descripción                       |
| -------- | --------- | --------------------------------- |
| id       | integer   | Identificador único de la sesión  |
| inicio   | timestamp | Fecha y hora de inicio            |
| fin      | timestamp | Fecha y hora de finalización      |
| duracion | integer   | Duración de la sesión en segundos |
| estado   | varchar   | Estado actual de la sesión        |

### Estados posibles

* `en_progreso`
* `completada`
* `cancelada`

---

## POST /api/sesiones

Inicia una nueva sesión de concentración.

### Descripción

Crea una sesión con estado `en_progreso` y registra la fecha y hora de inicio.

### Respuesta

Código:

```
201 Created
```

Ejemplo:

```json
{
  "id": 10,
  "inicio": "2026-07-28T18:39:26.631Z",
  "fin": null,
  "duracion": null,
  "estado": "en_progreso"
}
```

---

## PUT /api/sesiones/:id

Finaliza una sesión de concentración.

### Descripción

Actualiza una sesión en progreso registrando la fecha y hora de finalización, calculando la duración y cambiando el estado a `completada`.

### Respuesta

Código:

```
200 OK
```

Ejemplo:

```json
{
  "id": 10,
  "inicio": "2026-07-28T18:39:26.631Z",
  "fin": "2026-07-28T18:40:04.687Z",
  "duracion": 38,
  "estado": "completada"
}
```

---

## PATCH /api/sesiones/:id/cancelar

Cancela una sesión de concentración.

### Descripción

Permite cancelar una sesión que se encuentra en progreso. La sesión mantiene su registro y cambia su estado a `cancelada`.

### Respuesta

Código:

```
200 OK
```

Ejemplo:

```json
{
  "id": 6,
  "estado": "cancelada"
}
```

---

## GET /api/estadisticas

Obtiene estadísticas de concentración del usuario.

### Descripción

Retorna información resumida sobre el tiempo dedicado a sesiones completadas.

### Respuesta

Código:

```
200 OK
```

Ejemplo:

```json
{
  "tiempoHoy": 0,
  "tiempoSemana": 21855,
  "tiempoMes": 30133,
  "sesionesCompletadas": 8
}
```

### Reglas de negocio

* Solo se consideran sesiones con estado `completada`.
* El tiempo se calcula en segundos.
* Las estadísticas utilizan la fecha almacenada en la base de datos.

---
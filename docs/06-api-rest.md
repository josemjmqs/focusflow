# API REST

## GET /sesiones
Obtiene el historial de sesiones registradas.

### Respuesta
[
  {
    "id": 1,
    "hora_inicio": "2026-07-23T15:00:00",
    "hora_fin": "2026-07-23T15:25:00",
    "duracion": 1500,
    "estado": "COMPLETADA"
  }
]

---

## POST /sesiones
Registra una nueva sesión completada.

### Request
{
  "hora_inicio": "2026-07-23T15:00:00",
  "hora_fin": "2026-07-23T15:25:00",
  "duracion": 1500,
  "estado": "COMPLETADA"
}

### Respuesta
{
  "mensaje": "Sesión registrada correctamente"
}

---

## DELETE /sesiones/:id
Elimina una sesión del historial.

### Respuesta
{
  "mensaje": "Sesión eliminada correctamente"
}
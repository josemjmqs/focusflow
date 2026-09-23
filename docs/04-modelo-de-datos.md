# Modelo de Datos

## Entidades

Concentra utiliza dos entidades principales:

- **Usuario:** almacena las credenciales y datos básicos de cada usuario.
- **Sesión:** registra las sesiones de concentración realizadas por cada usuario.

---

## Usuario

Representa a una persona registrada en la aplicación.

| Campo | Tipo | Nulo | Descripción |
|---|---|---|---|
| id | integer | No | Identificador único del usuario |
| nombre | varchar | No | Nombre del usuario |
| email | varchar | No | Correo electrónico utilizado para registrarse e iniciar sesión |
| password | varchar | No | Contraseña almacenada mediante un hash |

La contraseña no se almacena en texto plano. El backend utiliza **bcrypt** para generar y verificar el hash.

---

## Sesión

Representa una sesión de concentración asociada a un usuario.

| Campo | Tipo | Nulo | Descripción |
|---|---|---|---|
| id | integer | No | Identificador único de la sesión |
| usuario_id | integer | No | Identificador del usuario propietario de la sesión |
| inicio | timestamp with time zone | No | Fecha y hora en que comenzó la sesión |
| fin | timestamp with time zone | Sí | Fecha y hora en que terminó la sesión |
| duracion | integer | Sí | Duración real de la sesión, expresada en segundos |
| estado | varchar | No | Estado actual de la sesión |
| duracion_objetivo | integer | Sí | Duración configurada como objetivo para la sesión |

### Estados utilizados por la aplicación

- `en_progreso`
- `completada`
- `cancelada`

Estos estados son gestionados por la lógica de la aplicación.

---

## Relación entre las entidades

Un usuario puede tener múltiples sesiones de concentración.

Una sesión pertenece a un único usuario.

```text
Usuario
   │
   │ 1:N
   ▼
Sesión
```

La relación se establece mediante el campo `usuario_id` de la tabla `sesiones`.

En PostgreSQL, `sesiones.usuario_id` tiene una **clave foránea** que referencia `usuarios.id`.

Además, la relación utiliza `ON DELETE CASCADE`: si se elimina un usuario, sus sesiones asociadas también se eliminan.

---

## Reglas de integridad y negocio

- Cada sesión debe estar asociada a un usuario.
- Una sesión nueva comienza con estado `en_progreso`.
- Una sesión finalizada pasa a estado `completada`.
- Una sesión en progreso puede cancelarse.
- Una sesión completada puede cancelarse y posteriormente restaurarse.
- Una sesión cancelada puede restaurarse y volver a estado `completada`.
- Las sesiones canceladas no se consideran en las estadísticas.
- Un mismo usuario no puede tener más de una sesión en progreso simultáneamente.
- Las consultas de sesiones y estadísticas se filtran por el usuario autenticado.

La restricción de una sola sesión en progreso se refuerza en PostgreSQL mediante el índice único parcial `una_sesion_en_progreso_por_usuario`, aplicado a `usuario_id` cuando el estado es `en_progreso`.

El backend también comprueba esta condición al crear una sesión.

---

## Seguridad

La autenticación utiliza **JSON Web Tokens (JWT)**.

Después de iniciar sesión, el backend genera un token que identifica al usuario. Las rutas protegidas utilizan este token para determinar qué sesiones y estadísticas puede consultar o modificar cada usuario.

Las contraseñas se almacenan mediante hashes generados con **bcrypt**.

---

## Uso en la aplicación

El modelo permite separar los datos de cada usuario y evita que un usuario pueda acceder a las sesiones pertenecientes a otra cuenta mediante las consultas protegidas del backend.

Las estadísticas se calculan utilizando únicamente las sesiones completadas del usuario autenticado.

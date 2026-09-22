# Modelo de Datos

## Entidades

Concentra utiliza dos entidades principales:

- **Usuario:** almacena las credenciales y datos básicos de cada usuario.
- **Sesión:** registra las sesiones de concentración realizadas por cada usuario.

---

## Usuario

Representa a una persona registrada en la aplicación.

| Campo | Descripción |
|---|---|
| id | Identificador único del usuario |
| nombre | Nombre del usuario |
| email | Correo electrónico utilizado para registrarse e iniciar sesión |
| password | Contraseña almacenada mediante un hash |

La contraseña no se almacena en texto plano. El backend utiliza **bcrypt** para generar y verificar el hash.

---

## Sesión

Representa una sesión de concentración asociada a un usuario.

| Campo | Descripción |
|---|---|
| id | Identificador único de la sesión |
| usuario_id | Identificador del usuario propietario de la sesión |
| inicio | Fecha y hora en que comenzó la sesión |
| fin | Fecha y hora en que terminó la sesión |
| duracion | Duración real de la sesión, expresada en segundos |
| duracion_objetivo | Duración configurada como objetivo para la sesión |
| estado | Estado actual de la sesión |

### Estados posibles

- en_progreso
- completada
- cancelada

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

La relación se establece mediante el campo usuario_id de la entidad sesiones.

---

## Reglas de integridad y negocio

- Cada sesión debe estar asociada a un usuario.
- Una sesión nueva comienza con estado en_progreso.
- Una sesión finalizada pasa a estado completada.
- Una sesión en progreso puede cancelarse.
- Una sesión completada puede cancelarse y posteriormente restaurarse.
- Las sesiones canceladas no se consideran en las estadísticas.
- El sistema evita que un mismo usuario mantenga más de una sesión en progreso.
- Las consultas de sesiones y estadísticas se filtran por el usuario autenticado.

---

## Seguridad

La autenticación utiliza **JSON Web Tokens (JWT)**.

Después de iniciar sesión, el backend genera un token que identifica al usuario. Las rutas protegidas utilizan este token para determinar qué sesiones y estadísticas puede consultar o modificar cada usuario.

Las contraseñas se almacenan mediante hashes generados con **bcrypt**.

---

## Uso en la aplicación

El modelo permite separar los datos de cada usuario y evita que un usuario pueda acceder a las sesiones pertenecientes a otra cuenta.

Las estadísticas se calculan utilizando únicamente las sesiones completadas del usuario autenticado.

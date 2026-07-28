# Requisitos Funcionales

## RF-01: Iniciar sesión de concentración

El usuario debe poder iniciar una sesión de concentración presionando el botón **"Iniciar"**.

**Flujo básico:**

1. El usuario presiona el botón **"Iniciar"**.
2. El sistema inicia un temporizador de 25 minutos.
3. El sistema registra la fecha y hora de inicio.
4. El sistema crea una sesión con estado `en_progreso`.

---

## RF-02: Finalizar automáticamente la sesión

Al completarse el tiempo del temporizador, el sistema debe finalizar automáticamente la sesión.

**Flujo básico:**

1. El temporizador llega a cero.
2. El sistema registra la fecha y hora de finalización.
3. El sistema calcula la duración de la sesión.
4. El sistema cambia el estado de la sesión a `completada`.

---

## RF-03: Registrar la sesión

El sistema debe almacenar automáticamente la siguiente información de cada sesión:

- Fecha y hora de inicio.
- Fecha y hora de finalización.
- Duración de la sesión.
- Estado de la sesión.

---

## RF-04: Consultar historial

El usuario debe poder visualizar el historial de sesiones registradas.

Cada registro debe mostrar como mínimo:

- Fecha y hora de inicio.
- Fecha y hora de finalización.
- Duración.
- Estado.

---

## RF-05: Cancelar una sesión

El usuario debe poder cancelar una sesión completada para que no sea considerada en las estadísticas.

**Flujo básico:**

1. El usuario selecciona una sesión completada.
2. El usuario presiona el botón **"Cancelar"**.
3. El sistema cambia el estado de la sesión a `cancelada`.

---

## RF-06: Consultar estadísticas

El usuario debe poder visualizar estadísticas de concentración.

Como mínimo el sistema deberá mostrar:

- Tiempo de concentración de hoy.
- Tiempo de concentración de esta semana.
- Tiempo de concentración de este mes.
- Cantidad de sesiones completadas.

---

# Reglas de negocio

- Solo puede existir una sesión con estado `en_progreso`.
- Una sesión se crea con estado `en_progreso`.
- Una sesión finalizada cambia automáticamente a `completada`.
- Solo una sesión `completada` puede cambiar a `cancelada`.
- Las sesiones `cancelada` no se consideran en las estadísticas.
- Las estadísticas diarias, semanales y mensuales consideran que una sesión pertenece al período en el que fue iniciada (`inicio`).
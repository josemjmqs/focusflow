# Requisitos Funcionales

## RF-01: Iniciar sesión de concentración

El usuario debe poder iniciar una sesión de concentración presionando el botón **"Iniciar"**.

**Flujo básico:**

1. El usuario presiona el botón **"Iniciar"**.
2. El sistema inicia un temporizador de 25 minutos.
3. El sistema registra la hora de inicio.

---

## RF-02: Finalizar automáticamente la sesión

Al completarse los 25 minutos, el sistema debe detener automáticamente el temporizador.

**Flujo básico:**

1. El temporizador llega a cero.
2. El sistema finaliza la sesión.
3. El sistema registra la hora de finalización.

---

## RF-03: Registrar la sesión

Al finalizar una sesión, el sistema debe almacenar automáticamente la siguiente información:

* Fecha.
* Hora de inicio.
* Hora de finalización.
* Duración total de la sesión (25 minutos).

---

## RF-04: Consultar historial

El usuario debe poder visualizar el historial de sesiones registradas.

Cada registro debe mostrar como mínimo:

* Fecha.
* Hora de inicio.
* Hora de finalización.
* Duración.

---

## RF-05: Eliminar una sesión

El usuario debe poder eliminar una sesión registrada del historial.

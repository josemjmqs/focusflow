import { useEffect, useRef, useState } from "react";
import {
  crearSesion,
  finalizarSesion,
  obtenerSesionEnProgreso,
} from "../services/api";
import "./Temporizador.css";

function Temporizador({ actualizarDatos }) {
  // Temporizador
  const [tiempoRestante, setTiempoRestante] = useState(() => {
    const duracionTrabajo = Number(localStorage.getItem("duracionTrabajo"));

    return duracionTrabajo ? duracionTrabajo * 60 : 25 * 60;
  });
  const [inicioTiempoExtra, setInicioTiempoExtra] = useState(null);
  const activoRef = useRef(false);
  const idSesionRef = useRef(null);
  const inicioTemporizadorRef = useRef(null);
  const contextoAudio = useRef(null);
  const oscilador = useRef(null);
  const ganancia = useRef(null);

  // Estado
  const [modo, setModo] = useState("trabajo");
  const [activo, setActivo] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [tiempoTerminado, setTiempoTerminado] = useState(false);
  const [alarmaActiva, setAlarmaActiva] = useState(false);
  const [error, setError] = useState("");

  // Sesión
  const [inicioSesion, setInicioSesion] = useState(null);
  const [inicioTemporizador, setInicioTemporizador] = useState(null);
  const [duracionActual, setDuracionActual] = useState(0);
  const [tiempoAcumulado, setTiempoAcumulado] = useState(0);
  const [tiempoExtraAcumulado, setTiempoExtraAcumulado] = useState(0);
  const [idSesion, setIdSesion] = useState(null);
  const [iniciando, setIniciando] = useState(false);
  const [iniciandoDescanso, setIniciandoDescanso] = useState(false);
  const [terminando, setTerminando] = useState(false);
  const [sesionesCompletadasCiclo, setSesionesCompletadasCiclo] = useState(
    () => {
      const guardadas = localStorage.getItem("sesionesCompletadasCiclo");

      return guardadas ? Number(guardadas) : 0;
    },
  );

  // Funciones auxiliares
  function formatearTiempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;

    return `${String(minutos).padStart(2, "0")}:${String(segundosRestantes).padStart(2, "0")}`;
  }

  async function probarNotificacion() {
    console.log("=== PRUEBA NOTIFICACIÓN ===");
    console.log("Permiso:", Notification.permission);
    console.log("Service Worker:", "serviceWorker" in navigator);

    try {
      const registro = await navigator.serviceWorker.ready;

      console.log("Service Worker listo:", registro);

      await registro.showNotification("FocusFlow", {
        body: "Prueba de notificación",
        icon: "/pwa-192x192.png",
        badge: "/pwa-192x192.png",
        tag: "focusflow-prueba",
      });

      console.log("=== NOTIFICACIÓN ENVIADA ===");
    } catch (error) {
      console.error("=== ERROR NOTIFICACIÓN ===", error);
    }
  }

  async function mostrarNotificacion(titulo, mensaje, modoNotificacion) {
    if (Notification.permission !== "granted") {
      return;
    }

    if (!("serviceWorker" in navigator)) {
      return;
    }

    const registro = await navigator.serviceWorker.ready;

    const acciones =
      modoNotificacion === "trabajo"
        ? [
            {
              action: "iniciar-descanso",
              title: "🧘 Iniciar descanso",
            },
            {
              action: "seguir-concentrado",
              title: "🧑‍💻 Seguir concentrado",
            },
          ]
        : [
            {
              action: "iniciar-trabajo",
              title: "🧑‍💻 Iniciar concentración",
            },
            {
              action: "seguir-descansando",
              title: "🧘 Seguir descansando",
            },
          ];

    await registro.showNotification(titulo, {
      body: mensaje,
      icon: "/pwa-192x192.png",
      badge: "/pwa-192x192.png",
      tag: "focusflow-temporizador",
      actions: acciones,
    });
  }

  async function mostrarNotificacionSistema(titulo, mensaje) {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    const registro = await navigator.serviceWorker.ready;

    await registro.showNotification(titulo, {
      body: mensaje,
      icon: "/pwa-192x192.png",
      badge: "/pwa-192x192.png",
      tag: "focusflow-temporizador",
    });
  }

  function obtenerConfiguracionPomodoro() {
    return {
      duracionTrabajo: Number(localStorage.getItem("duracionTrabajo")) || 25,

      duracionDescansoCorto:
        Number(localStorage.getItem("duracionDescansoCorto")) || 5,

      duracionDescansoLargo:
        Number(localStorage.getItem("duracionDescansoLargo")) || 15,

      sesionesAntesDescansoLargo:
        Number(localStorage.getItem("sesionesAntesDescansoLargo")) || 4,
    };
  }

  function guardarEstadoDescanso({
    inicioTemporizadorActual = inicioTemporizador,
    duracionActualActual = duracionActual,
    tiempoAcumuladoActual = tiempoAcumulado,
    activoActual = activo,
    pausadoActual = pausado,
    tiempoTerminadoActual = tiempoTerminado,
    inicioTiempoExtraActual = inicioTiempoExtra,
    tiempoExtraAcumuladoActual = tiempoExtraAcumulado,
  } = {}) {
    let fechaFinalizacion = null;

    if (
      activoActual &&
      !pausadoActual &&
      !tiempoTerminadoActual &&
      inicioTemporizadorActual
    ) {
      const tiempoRestante = duracionActualActual - tiempoAcumuladoActual;

      fechaFinalizacion = new Date(Date.now() + tiempoRestante * 1000);
    }

    localStorage.setItem(
      "estadoDescanso",
      JSON.stringify({
        inicioTemporizador: inicioTemporizadorActual
          ? inicioTemporizadorActual.toISOString()
          : null,

        fechaFinalizacion: fechaFinalizacion
          ? fechaFinalizacion.toISOString()
          : null,

        duracionActual: duracionActualActual,
        tiempoAcumulado: tiempoAcumuladoActual,
        activo: activoActual,
        pausado: pausadoActual,
        tiempoTerminado: tiempoTerminadoActual,

        inicioTiempoExtra: inicioTiempoExtraActual
          ? inicioTiempoExtraActual.toISOString()
          : null,

        tiempoExtraAcumulado: tiempoExtraAcumuladoActual,
      }),
    );
  }

  function borrarEstadoDescanso() {
    localStorage.removeItem("estadoDescanso");
  }

  function calcularSegundosTranscurridos(inicio = inicioTemporizador) {
    if (!inicio) {
      return tiempoAcumulado;
    }

    return tiempoAcumulado + Math.floor((Date.now() - inicio.getTime()) / 1000);
  }

  function calcularSegundosExtraTranscurridos() {
    if (!inicioTiempoExtra) {
      return tiempoExtraAcumulado;
    }

    return (
      tiempoExtraAcumulado +
      Math.floor((Date.now() - inicioTiempoExtra.getTime()) / 1000)
    );
  }

  function terminarTemporizador(momentoFinalizacion) {
    setTiempoRestante(0);
    setTiempoTerminado(true);
    setAlarmaActiva(true);
    setInicioTiempoExtra(momentoFinalizacion);

    if (modo === "descanso") {
      localStorage.setItem(
        "estadoDescanso",
        JSON.stringify({
          inicioTemporizador: inicioTemporizador
            ? inicioTemporizador.toISOString()
            : null,
          duracionActual,
          tiempoAcumulado,
          activo: true,
          pausado: false,
          tiempoTerminado: true,
          inicioTiempoExtra: momentoFinalizacion.toISOString(),
          tiempoExtraAcumulado: 0,
        }),
      );
    }

    if (document.hidden) {
      mostrarNotificacion(
        "FocusFlow",
        modo === "trabajo"
          ? "Terminó tu tiempo de concentración 🧑‍💻"
          : "Terminó tu descanso 🧘",
        modo,
      );
    }
  }

  function reiniciarEstadoTemporizador() {
    setTiempoTerminado(false);
    setTiempoExtraAcumulado(0);
    setInicioTiempoExtra(null);
    setAlarmaActiva(false);
  }

  function reproducirAlarma() {
    if (contextoAudio.current) {
      return;
    }

    contextoAudio.current = new AudioContext();

    oscilador.current = contextoAudio.current.createOscillator();
    ganancia.current = contextoAudio.current.createGain();

    oscilador.current.connect(ganancia.current);
    ganancia.current.connect(contextoAudio.current.destination);

    oscilador.current.frequency.value = 800;
    oscilador.current.type = "sine";

    ganancia.current.gain.value = 0.3;

    oscilador.current.start();
  }

  function detenerAlarma() {
    if (!contextoAudio.current) {
      return;
    }

    oscilador.current.stop();

    contextoAudio.current.close();

    contextoAudio.current = null;
    oscilador.current = null;
    ganancia.current = null;
  }

  // Funciones relacionadas con sesiones
  async function iniciarTrabajo() {
    const fechaInicio = new Date();

    const configuracion = obtenerConfiguracionPomodoro();

    const duracion = configuracion.duracionTrabajo * 60;

    const sesion = await crearSesion(duracion);

    borrarEstadoDescanso();
    localStorage.removeItem("modoTemporizador");

    setIdSesion(sesion.id);
    idSesionRef.current = sesion.id;

    setInicioSesion(fechaInicio);
    setInicioTemporizador(fechaInicio);
    inicioTemporizadorRef.current = fechaInicio;
    setTiempoAcumulado(0);
    setDuracionActual(duracion);

    setModo("trabajo");
    setTiempoRestante(duracion);

    reiniciarEstadoTemporizador();

    setActivo(true);
    activoRef.current = true;
    setPausado(false);
  }

  async function terminarTrabajo() {
    console.log("terminarTrabajo");
    console.log("idSesion:", idSesion);
    console.log("inicioSesion:", inicioSesion);
    if (!idSesion || !inicioSesion) {
      console.log("No se puede terminar la sesión");
      return;
    }

    const duracion = calcularSegundosTranscurridos();
    console.log("Duración:", duracion);
    console.log("Finalizando sesión...");
    await finalizarSesion(idSesion, duracion);
    console.log("Sesión finalizada correctamente");
    setInicioSesion(null);
    setInicioTemporizador(null);
    setTiempoAcumulado(0);
    setDuracionActual(0);
    setIdSesion(null);
    idSesionRef.current = null;
    inicioTemporizadorRef.current = null;

    actualizarDatos();
    console.log("terminarTrabajo terminado");
  }

  async function terminarSesionManual() {
    setTerminando(true);

    try {
      setError("");
      setAlarmaActiva(false);

      await terminarTrabajo();

      setActivo(false);
      activoRef.current = false;
      reiniciarEstadoTemporizador();
    } catch (error) {
      setError(error.message);
    } finally {
      setTerminando(false);
    }
  }

  function terminarDescansoManual() {
    setTerminando(true);

    try {
      setError("");
      setAlarmaActiva(false);

      // Detener el descanso
      setActivo(false);
      activoRef.current = false;

      // Limpiar estado del descanso
      borrarEstadoDescanso();
      localStorage.removeItem("modoTemporizador");

      setModo("trabajo");
      setPausado(false);
      setTiempoTerminado(false);

      setInicioTemporizador(null);
      setInicioTiempoExtra(null);

      setTiempoAcumulado(0);
      setTiempoExtraAcumulado(0);

      setDuracionActual(0);

      // Preparar el próximo trabajo
      const configuracion = obtenerConfiguracionPomodoro();
      const duracionTrabajo = configuracion.duracionTrabajo * 60;

      setTiempoRestante(duracionTrabajo);

      actualizarDatos();
    } catch (error) {
      setError(error.message);
    } finally {
      setTerminando(false);
    }
  }

  // Manejo del temporizador
  async function iniciarTemporizador() {
    setIniciando(true);

    try {
      setError("");

      await iniciarTrabajo();
    } catch (error) {
      if (error.message === "Ya existe una sesión en progreso") {
        try {
          const sesion = await obtenerSesionEnProgreso();

          if (!sesion) {
            setError("No se encontró la sesión en progreso.");
            return;
          }

          const inicio = new Date(sesion.inicio);
          const duracion = sesion.duracion_objetivo;

          setIdSesion(sesion.id);
          setInicioSesion(inicio);
          setInicioTemporizador(inicio);
          inicioTemporizadorRef.current = inicio;
          setTiempoAcumulado(0);
          setDuracionActual(duracion);
          setModo("trabajo");
          setPausado(false);
          setActivo(true);

          const transcurrido = Math.floor(
            (Date.now() - inicio.getTime()) / 1000,
          );

          const restante = duracion - transcurrido;

          if (restante <= 0) {
            const momentoFinalizacion = new Date(
              inicio.getTime() + duracion * 1000,
            );

            terminarTemporizador(momentoFinalizacion);
          } else {
            setTiempoRestante(restante);
          }
        } catch (error) {
          setError(error.message);
        }

        return;
      }

      setError(error.message);
    } finally {
      setIniciando(false);
    }
  }

  function pausarTemporizador() {
    activoRef.current = false;

    if (tiempoTerminado) {
      const transcurrido = calcularSegundosExtraTranscurridos();

      setTiempoExtraAcumulado(transcurrido);
      setInicioTiempoExtra(null);

      if (modo === "descanso") {
        guardarEstadoDescanso({
          inicioTemporizadorActual: null,
          activoActual: false,
          pausadoActual: true,
          tiempoTerminadoActual: true,
          inicioTiempoExtraActual: null,
          tiempoExtraAcumuladoActual: transcurrido,
        });
      }
    } else {
      const transcurrido = calcularSegundosTranscurridos();

      setTiempoAcumulado(transcurrido);
      setInicioTemporizador(null);

      if (modo === "descanso") {
        guardarEstadoDescanso({
          inicioTemporizadorActual: null,
          tiempoAcumuladoActual: transcurrido,
          activoActual: false,
          pausadoActual: true,
          tiempoTerminadoActual: false,
          inicioTiempoExtraActual: null,
          tiempoExtraAcumuladoActual: 0,
        });
      }
    }

    setActivo(false);
    setPausado(true);
    setAlarmaActiva(false);
  }

  function reanudarTemporizador() {
    const ahora = new Date();

    if (tiempoTerminado) {
      setInicioTiempoExtra(ahora);

      if (modo === "descanso") {
        localStorage.setItem(
          "estadoDescanso",
          JSON.stringify({
            inicioTemporizador: null,
            duracionActual,
            tiempoAcumulado,
            activo: true,
            pausado: false,
            tiempoTerminado: true,
            inicioTiempoExtra: ahora.toISOString(),
            tiempoExtraAcumulado,
          }),
        );
      }
    } else {
      setInicioTemporizador(ahora);

      if (modo === "trabajo") {
        localStorage.removeItem("estadoTrabajo");
      }

      if (modo === "descanso") {
        const tiempoRestanteActual = duracionActual - tiempoAcumulado;

        const fechaFinalizacion = new Date(
          ahora.getTime() + tiempoRestanteActual * 1000,
        );

        localStorage.setItem(
          "estadoDescanso",
          JSON.stringify({
            inicioTemporizador: ahora.toISOString(),
            fechaFinalizacion: fechaFinalizacion.toISOString(),
            duracionActual,
            tiempoAcumulado,
            activo: true,
            pausado: false,
            tiempoTerminado: false,
            inicioTiempoExtra: null,
            tiempoExtraAcumulado: 0,
          }),
        );
      }
    }

    activoRef.current = true;
    setActivo(true);
    setPausado(false);
  }

  // Decisiones del usuario
  function seguirTrabajando() {
    setAlarmaActiva(false);
  }

  function seguirDescansando() {
    setAlarmaActiva(false);
  }

  async function iniciarDescanso() {
    console.log("=== INICIANDO DESCANSO ===");

    setIniciandoDescanso(true);
    setError("");
    setAlarmaActiva(false);

    try {
      const duracion = calcularSegundosTranscurridos(
        inicioTemporizadorRef.current,
      );

      console.log("Duración trabajo:", duracion);
      console.log("Finalizando sesión:", idSesionRef.current);

      await finalizarSesion(idSesionRef.current, duracion);

      actualizarDatos();

      console.log("Sesión finalizada");

      // Limpiar sesión anterior
      setInicioSesion(null);
      setInicioTemporizador(null);
      setTiempoAcumulado(0);
      setDuracionActual(0);
      setIdSesion(null);
      idSesionRef.current = null;
      inicioTemporizadorRef.current = null;

      // Calcular qué descanso corresponde
      const configuracion = obtenerConfiguracionPomodoro();

      const nuevasSesionesCompletadas = sesionesCompletadasCiclo + 1;

      const esDescansoLargo =
        nuevasSesionesCompletadas >= configuracion.sesionesAntesDescansoLargo;

      if (esDescansoLargo) {
        setSesionesCompletadasCiclo(0);

        localStorage.setItem("sesionesCompletadasCiclo", "0");
      } else {
        setSesionesCompletadasCiclo(nuevasSesionesCompletadas);

        localStorage.setItem(
          "sesionesCompletadasCiclo",
          String(nuevasSesionesCompletadas),
        );
      }

      // Calcular duración del descanso
      const duracionDescanso = esDescansoLargo
        ? configuracion.duracionDescansoLargo * 60
        : configuracion.duracionDescansoCorto * 60;

      const ahora = new Date();

      // Nueva fecha absoluta de finalización
      const fechaFinalizacion = new Date(
        ahora.getTime() + duracionDescanso * 1000,
      );

      console.log("Duración descanso:", duracionDescanso);
      console.log("Iniciando descanso a:", ahora);
      console.log("Fecha finalización:", fechaFinalizacion);

      // Configurar temporizador
      setModo("descanso");
      setTiempoTerminado(false);
      setTiempoExtraAcumulado(0);
      setInicioTiempoExtra(null);
      setAlarmaActiva(false);

      setInicioTemporizador(ahora);
      setTiempoAcumulado(0);
      setDuracionActual(duracionDescanso);
      setTiempoRestante(duracionDescanso);

      setPausado(false);
      setActivo(true);
      activoRef.current = true;

      // Guardar estado del descanso
      localStorage.setItem(
        "estadoDescanso",
        JSON.stringify({
          inicioTemporizador: ahora.toISOString(),
          fechaFinalizacion: fechaFinalizacion.toISOString(),
          duracionActual: duracionDescanso,
          tiempoAcumulado: 0,
          activo: true,
          pausado: false,
          tiempoTerminado: false,
          inicioTiempoExtra: null,
          tiempoExtraAcumulado: 0,
        }),
      );

      localStorage.setItem("modoTemporizador", "descanso");

      console.log("=== DESCANSO INICIADO ===");
    } catch (error) {
      console.error("Error iniciando descanso:", error);

      setError(error.message);
    } finally {
      setIniciandoDescanso(false);
    }
  }

  // Effects
  useEffect(() => {
    if (!activo || tiempoTerminado || !inicioTemporizador) {
      return;
    }

    const intervalo = setInterval(() => {
      if (!activoRef.current) {
        return;
      }
      const transcurrido = calcularSegundosTranscurridos();
      const restante = duracionActual - transcurrido;

      if (restante <= 0) {
        const exceso = transcurrido - duracionActual;

        const momentoFinalizacion = new Date(Date.now() - exceso * 1000);

        terminarTemporizador(momentoFinalizacion);
        return;
      }

      setTiempoRestante(restante);
    }, 1000);

    return () => {
      clearInterval(intervalo);
    };
  }, [activo, tiempoTerminado, inicioTemporizador, duracionActual]);

  useEffect(() => {
    if (!activo || !tiempoTerminado || !inicioTiempoExtra) {
      return;
    }

    const actualizarTiempoExtra = () => {
      setTiempoExtraAcumulado(calcularSegundosExtraTranscurridos());
    };

    actualizarTiempoExtra();

    const intervalo = setInterval(actualizarTiempoExtra, 1000);

    return () => clearInterval(intervalo);
  }, [activo, tiempoTerminado, inicioTiempoExtra]);

  useEffect(() => {
    async function recuperarSesion() {
      try {
        // --------------------------------------------------
        // 1. RECUPERAR DESCANSO
        // --------------------------------------------------

        const estadoDescansoGuardado = localStorage.getItem("estadoDescanso");

        if (estadoDescansoGuardado) {
          const estado = JSON.parse(estadoDescansoGuardado);

          const inicio = estado.inicioTemporizador
            ? new Date(estado.inicioTemporizador)
            : null;

          const inicioExtra = estado.inicioTiempoExtra
            ? new Date(estado.inicioTiempoExtra)
            : null;

          const fechaFinalizacion = estado.fechaFinalizacion
            ? new Date(estado.fechaFinalizacion)
            : null;

          setModo("descanso");
          setDuracionActual(estado.duracionActual);
          setTiempoAcumulado(estado.tiempoAcumulado || 0);
          setTiempoExtraAcumulado(estado.tiempoExtraAcumulado || 0);
          setPausado(estado.pausado);
          setActivo(estado.activo);
          setTiempoTerminado(estado.tiempoTerminado);
          setInicioTemporizador(inicio);
          setInicioTiempoExtra(inicioExtra);
          setAlarmaActiva(false);

          activoRef.current = estado.activo;

          // --------------------------------------------------
          // DESCANSO PAUSADO
          // --------------------------------------------------

          if (estado.pausado) {
            if (estado.tiempoTerminado) {
              setTiempoRestante(0);
            } else {
              setTiempoRestante(
                Math.max(
                  estado.duracionActual - (estado.tiempoAcumulado || 0),
                  0,
                ),
              );
            }

            return;
          }

          // --------------------------------------------------
          // DESCANSO TERMINADO, CON TIEMPO EXTRA
          // --------------------------------------------------

          if (estado.tiempoTerminado && inicioExtra) {
            const tiempoExtra =
              (estado.tiempoExtraAcumulado || 0) +
              Math.floor((Date.now() - inicioExtra.getTime()) / 1000);

            setTiempoExtraAcumulado(tiempoExtra);

            if (estado.activo) {
              setAlarmaActiva(true);
            }

            return;
          }

          // --------------------------------------------------
          // DESCANSO ACTIVO
          // --------------------------------------------------

          if (estado.activo && inicio) {
            let restante;

            if (fechaFinalizacion) {
              // Usamos la hora absoluta de finalización.
              restante = Math.ceil(
                (fechaFinalizacion.getTime() - Date.now()) / 1000,
              );
            } else {
              // Compatibilidad con estados antiguos que no
              // tenían fechaFinalizacion.
              const transcurrido =
                (estado.tiempoAcumulado || 0) +
                Math.floor((Date.now() - inicio.getTime()) / 1000);

              restante = estado.duracionActual - transcurrido;
            }

            // El descanso terminó mientras la página estaba
            // cerrada o suspendida.
            if (restante <= 0) {
              const momentoFinalizacion = fechaFinalizacion
                ? fechaFinalizacion
                : new Date(
                    inicio.getTime() +
                      (estado.duracionActual - (estado.tiempoAcumulado || 0)) *
                        1000,
                  );

              setTiempoRestante(0);
              setTiempoTerminado(true);
              setAlarmaActiva(true);
              setInicioTiempoExtra(momentoFinalizacion);

              localStorage.setItem(
                "estadoDescanso",
                JSON.stringify({
                  ...estado,
                  activo: true,
                  pausado: false,
                  tiempoTerminado: true,
                  inicioTiempoExtra: momentoFinalizacion.toISOString(),
                  tiempoExtraAcumulado: 0,
                }),
              );

              return;
            }

            setTiempoRestante(restante);
          }

          return;
        }

        // --------------------------------------------------
        // 2. RECUPERAR TRABAJO PAUSADO
        // --------------------------------------------------

        const estadoTrabajoGuardado = localStorage.getItem("estadoTrabajo");

        if (estadoTrabajoGuardado) {
          const estadoTrabajo = JSON.parse(estadoTrabajoGuardado);

          const sesion = await obtenerSesionEnProgreso();

          if (!sesion) {
            localStorage.removeItem("estadoTrabajo");
            return;
          }

          setIdSesion(sesion.id);
          setInicioSesion(new Date(sesion.inicio));
          setInicioTemporizador(null);
          setTiempoAcumulado(estadoTrabajo.tiempoAcumulado || 0);
          setDuracionActual(estadoTrabajo.duracionActual);
          setModo("trabajo");
          setTiempoTerminado(false);
          setTiempoExtraAcumulado(0);
          setAlarmaActiva(false);
          setPausado(true);
          setActivo(false);

          activoRef.current = false;

          setTiempoRestante(
            Math.max(
              estadoTrabajo.duracionActual -
                (estadoTrabajo.tiempoAcumulado || 0),
              0,
            ),
          );

          return;
        }

        // --------------------------------------------------
        // 3. RECUPERAR TRABAJO ACTIVO DESDE LA BD
        // --------------------------------------------------

        const sesion = await obtenerSesionEnProgreso();

        if (!sesion) {
          return;
        }

        const inicio = new Date(sesion.inicio);
        const duracion = sesion.duracion_objetivo;

        setIdSesion(sesion.id);
        setInicioSesion(inicio);
        setInicioTemporizador(inicio);
        setTiempoAcumulado(0);
        setDuracionActual(duracion);
        setModo("trabajo");
        setTiempoTerminado(false);
        setTiempoExtraAcumulado(0);
        setAlarmaActiva(false);
        setPausado(false);
        setActivo(true);

        activoRef.current = true;

        const transcurrido = Math.floor((Date.now() - inicio.getTime()) / 1000);

        const restante = duracion - transcurrido;

        if (restante <= 0) {
          const momentoFinalizacion = new Date(
            inicio.getTime() + duracion * 1000,
          );

          setTiempoRestante(0);
          setTiempoTerminado(true);
          setAlarmaActiva(true);
          setInicioTiempoExtra(momentoFinalizacion);

          return;
        }

        setTiempoRestante(restante);
      } catch (error) {
        setError(error.message);
      }
    }

    recuperarSesion();
  }, []);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Alarma
  useEffect(() => {
    if (alarmaActiva) {
      reproducirAlarma();
    } else {
      detenerAlarma();
    }
  }, [alarmaActiva]);

  useEffect(() => {
    function actualizarAlVolver() {
      if (!activo) {
        return;
      }

      if (tiempoTerminado && inicioTiempoExtra) {
        setTiempoExtraAcumulado(calcularSegundosExtraTranscurridos());
        return;
      }

      if (!inicioTemporizador || tiempoTerminado) {
        return;
      }

      const transcurrido = calcularSegundosTranscurridos();
      const restante = duracionActual - transcurrido;

      if (restante <= 0) {
        terminarTemporizador();
        return;
      }

      setTiempoRestante(restante);
    }

    document.addEventListener("visibilitychange", actualizarAlVolver);

    return () => {
      document.removeEventListener("visibilitychange", actualizarAlVolver);
    };
  }, [
    activo,
    inicioTemporizador,
    inicioTiempoExtra,
    tiempoTerminado,
    duracionActual,
  ]);

  useEffect(() => {
    function manejarMensaje(event) {
      if (event.data?.tipo !== "accion-notificacion") {
        return;
      }

      console.log("ACCIÓN DE NOTIFICACIÓN:", event.data.accion);
      console.log("ID SESIÓN ACTUAL:", idSesionRef.current);
      console.log("INICIO TEMPORIZADOR ACTUAL:", inicioTemporizadorRef.current);

      if (event.data.accion === "iniciar-descanso") {
        iniciarDescanso();
      }

      if (event.data.accion === "seguir-concentrado") {
        seguirTrabajando();
      }

      if (event.data.accion === "iniciar-trabajo") {
        iniciarTemporizador();
      }

      if (event.data.accion === "seguir-descansando") {
        seguirDescansando();
      }
    }

    navigator.serviceWorker?.addEventListener("message", manejarMensaje);

    return () => {
      navigator.serviceWorker?.removeEventListener("message", manejarMensaje);
    };
  }, []);

  const esTrabajo = modo === "trabajo";

  const textoBotonPrincipal = esTrabajo
    ? "🧘 Iniciar descanso"
    : "🧑‍💻 Iniciar concentración";

  const accionBotonPrincipal = esTrabajo
    ? iniciarDescanso
    : iniciarTemporizador;

  const textoBotonSecundario = esTrabajo
    ? "🧑‍💻 Seguir concentrado"
    : "🧘 Seguir descansando";

  const accionBotonSecundario = esTrabajo
    ? seguirTrabajando
    : seguirDescansando;

  return (
    <div>
      <div className="temporizador-modo">
        <h2>{esTrabajo ? "🧑‍💻 Trabajo" : "🧘 Descanso"}</h2>
      </div>
      <div className="temporizador-tiempo">
        {tiempoTerminado ? (
          <div className="tiempo-extra">
            <span>Tiempo extra</span>
            <h1>+{formatearTiempo(tiempoExtraAcumulado)}</h1>
          </div>
        ) : (
          <h1>{formatearTiempo(tiempoRestante)}</h1>
        )}
      </div>

      <button onClick={probarNotificacion}>Probar notificación</button>

      <div className="acciones-temporizador">
        {!activo && !pausado && (
          <button onClick={iniciarTemporizador} disabled={iniciando}>
            {iniciando ? "Iniciando..." : "Iniciar"}
          </button>
        )}

        {activo && !tiempoTerminado && (
          <button onClick={pausarTemporizador}>⏸ Pausar</button>
        )}

        {!activo && pausado && !tiempoTerminado && (
          <button onClick={reanudarTemporizador}>▶ Reanudar</button>
        )}
      </div>

      {error && <p className="temporizador-error">{error}</p>}

      {tiempoTerminado && (
        <div className="acciones-tiempo-terminado">
          <button
            onClick={accionBotonPrincipal}
            disabled={iniciando || iniciandoDescanso}
          >
            {iniciandoDescanso
              ? "Iniciando descanso..."
              : iniciando
                ? "Iniciando concentración..."
                : textoBotonPrincipal}
          </button>

          <button onClick={accionBotonSecundario}>
            {textoBotonSecundario}
          </button>
        </div>
      )}

      {(idSesion || modo === "descanso") && (
        <div className="accion-terminar-sesion">
          <button
            onClick={
              modo === "descanso"
                ? terminarDescansoManual
                : terminarSesionManual
            }
            disabled={terminando}
          >
            {terminando ? "Terminando..." : "Terminar sesión"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Temporizador;

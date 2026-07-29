const API_URL = "http://localhost:3000/api";

export const obtenerEstadisticas = async () => {
  const respuesta = await fetch(`${API_URL}/estadisticas`);

  return respuesta.json();
};

export const obtenerSesiones = async () => {
  const respuesta = await fetch(`${API_URL}/sesiones`);

  return respuesta.json();
};

export const crearSesion = async (sesion) => {
  const respuesta = await fetch(`${API_URL}/sesiones`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sesion),
  });

  return respuesta.json();
};

export const finalizarSesion = async (id) => {
  const respuesta = await fetch(`${API_URL}/sesiones/${id}`, {
    method: "PUT",
  });

  return respuesta.json();
};
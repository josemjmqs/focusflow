const API_URL = "http://localhost:3000/api";

export const obtenerEstadisticas = async () => {
  const respuesta = await fetch(`${API_URL}/estadisticas`);

  return respuesta.json();
};

export const obtenerSesiones = async () => {
  const respuesta = await fetch(`${API_URL}/sesiones`);

  return respuesta.json();
};
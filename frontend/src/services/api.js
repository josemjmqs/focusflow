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

export const finalizarSesion = async (id, duracion) => {
  const respuesta = await fetch(`${API_URL}/sesiones/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      duracion,
    }),
  });

  return respuesta.json();
};

export const cancelarSesion = async (id) => {
  const respuesta = await fetch(
    `${API_URL}/sesiones/${id}/cancelar`,
    {
      method: "PATCH",
    }
  );

  return respuesta.json();
};

export const restaurarSesion = async (id) => {
  const respuesta = await fetch(
    `${API_URL}/sesiones/${id}/restaurar`,
    {
      method: "PATCH",
    }
  );

  return respuesta.json();
};
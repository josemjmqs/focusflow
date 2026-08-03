const API_URL = "http://localhost:3000/api";

const obtenerToken = () => {
  return localStorage.getItem("token");
};

const manejarRespuesta = async (respuesta) => {
  if (respuesta.status === 401) {
    localStorage.removeItem("token");
    window.location.reload();
    return;
  }

  return respuesta.json();
};

export const obtenerEstadisticas = async () => {
  const respuesta = await fetch(`${API_URL}/estadisticas`, {
    headers: {
      Authorization: `Bearer ${obtenerToken()}`,
    },
  });

  return manejarRespuesta(respuesta);
};

export const obtenerSesiones = async () => {
  const respuesta = await fetch(`${API_URL}/sesiones`, {
    headers: {
      Authorization: `Bearer ${obtenerToken()}`,
    },
  });

  return manejarRespuesta(respuesta);
};

export const crearSesion = async (sesion) => {
  const respuesta = await fetch(`${API_URL}/sesiones`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${obtenerToken()}`,
    },
    body: JSON.stringify(sesion),
  });

  return manejarRespuesta(respuesta);
};

export const finalizarSesion = async (id, duracion) => {
  const respuesta = await fetch(`${API_URL}/sesiones/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${obtenerToken()}`,
    },
    body: JSON.stringify({
      duracion,
    }),
  });

  return manejarRespuesta(respuesta);
};

export const cancelarSesion = async (id) => {
  const respuesta = await fetch(`${API_URL}/sesiones/${id}/cancelar`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${obtenerToken()}`,
    },
  });

  return manejarRespuesta(respuesta);
};

export const restaurarSesion = async (id) => {
  const respuesta = await fetch(`${API_URL}/sesiones/${id}/restaurar`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${obtenerToken()}`,
    },
  });

  return manejarRespuesta(respuesta);
};

export const login = async (email, password) => {
  const respuesta = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return manejarRespuesta(respuesta);
};

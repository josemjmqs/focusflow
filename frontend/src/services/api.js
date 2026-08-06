const API_URL = import.meta.env.VITE_API_URL;

const obtenerToken = () => {
  return localStorage.getItem("token");
};

const manejarRespuesta = async (respuesta) => {
  if (respuesta.status === 401) {
    localStorage.removeItem("token");
    window.location.reload();
    return;
  }

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.mensaje || "Error en la petición");
  }

  return datos;
};

async function realizarPeticion(url, opciones = {}) {
  try {
    const respuesta = await fetch(url, opciones);

    return manejarRespuesta(respuesta);
  } catch {
    throw new Error("No fue posible conectarse con el servidor.");
  }
}

export const obtenerEstadisticas = async () => {
  return realizarPeticion(`${API_URL}/estadisticas`, {
    headers: {
      Authorization: `Bearer ${obtenerToken()}`,
    },
  });
};

export const obtenerSesiones = async () => {
  return realizarPeticion(`${API_URL}/sesiones`, {
    headers: {
      Authorization: `Bearer ${obtenerToken()}`,
    },
  });
};

export const crearSesion = async () => {
  return realizarPeticion(`${API_URL}/sesiones`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${obtenerToken()}`,
    },
  });
};

export const finalizarSesion = async (id, duracion) => {
  return realizarPeticion(`${API_URL}/sesiones/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${obtenerToken()}`,
    },
    body: JSON.stringify({
      duracion,
    }),
  });
};

export const cancelarSesion = async (id) => {
  return realizarPeticion(`${API_URL}/sesiones/${id}/cancelar`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${obtenerToken()}`,
    },
  });
};

export const cancelarSesionEnProgreso = async (id) => {
  return realizarPeticion(`${API_URL}/sesiones/${id}/cancelar-en-progreso`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${obtenerToken()}`,
    },
  });
};

export const restaurarSesion = async (id) => {
  return realizarPeticion(`${API_URL}/sesiones/${id}/restaurar`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${obtenerToken()}`,
    },
  });
};

export const login = async (email, password) => {
  return realizarPeticion(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

export const register = async (nombre, email, password) => {
  return realizarPeticion(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre,
      email,
      password,
    }),
  });
};

export const obtenerSesionEnProgreso = async () => {
  return realizarPeticion(`${API_URL}/sesiones/en-progreso`, {
    headers: {
      Authorization: `Bearer ${obtenerToken()}`,
    },
  });
};

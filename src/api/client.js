// URL base del backend. Es recomendable usar variables de entorno en producción.
export const API_URL = "http://localhost:8085/api";

/**
 * Interceptor de Solicitudes: Agrega configuración global antes de enviar la petición.
 */
const requestInterceptor = (options) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return options;
};

/**
 * Interceptor de Respuestas: Centraliza el manejo de errores y códigos HTTP.
 */
const responseInterceptor = async (response) => {
  if (response.status === 401) {
    // TODO: Aquí podrías implementar la llamada al endpoint /api/auth/refresh
    console.error("Sesión no autorizada o token expirado.");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: `Error HTTP ${response.status}` }));
    throw new Error(errorData.message || "Ocurrió un error en la comunicación con el servidor.");
  }

  // Si la respuesta es exitosa pero no tiene contenido (Ej: un DELETE), evitamos parsear JSON
  if (response.status === 204) return null;

  return response.json();
};

/**
 * Cliente HTTP genérico para reutilizar en toda la aplicación.
 * @param {string} endpoint - La ruta del endpoint (ej. "/auth/login").
 * @param {RequestInit} options - Opciones de fetch (method, body, etc.).
 * @returns {Promise<Object>} La respuesta procesada.
 */
export const apiClient = async (endpoint, options = {}) => {
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  // Unimos los headers por defecto con los que vengan en las opciones
  let requestOptions = {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
  };

  // 1. Ejecutar interceptor de solicitud
  requestOptions = requestInterceptor(requestOptions);

  // 2. Realizar la petición HTTP
  const response = await fetch(`${API_URL}${endpoint}`, requestOptions);

  // 3. Ejecutar interceptor de respuesta
  return responseInterceptor(response);
};

/**
 * Objeto utilitario con métodos HTTP simplificados para no repetir configuración.
 */
export const api = {
  get: (endpoint, headers) => apiClient(endpoint, { method: "GET", headers }),
  post: (endpoint, body, headers) => apiClient(endpoint, { method: "POST", body: JSON.stringify(body), headers }),
  put: (endpoint, body, headers) => apiClient(endpoint, { method: "PUT", body: JSON.stringify(body), headers }),
  delete: (endpoint, headers) => apiClient(endpoint, { method: "DELETE", headers }),
};
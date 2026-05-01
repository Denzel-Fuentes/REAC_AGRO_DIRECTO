import { api } from "./client";

/**
 * Servicio para interactuar con los endpoints de autenticación.
 */
export const authApi = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  refresh: (refreshToken) => api.post("/auth/refresh", { refreshToken }),
  logout: (refreshToken) => api.post("/auth/logout", { refreshToken }),
  getProfile: () => api.get("/auth/me"),
};
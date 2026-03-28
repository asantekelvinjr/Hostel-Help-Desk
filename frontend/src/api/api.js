import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("hd_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth (User) ──────────────────────────────────────────────
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const getMe = () => api.get("/auth/me");

// ── Auth (Admin) ─────────────────────────────────────────────
export const loginAdmin = (data) => api.post("/admin/login", data);

// ── Reports (User) ───────────────────────────────────────────
export const submitReport = (formData) =>
  api.post("/reports", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const getMyReports = (params) => api.get("/reports", { params });
export const getReportById = (id) => api.get(`/reports/${id}`);
export const deleteMyReport = (id) => api.delete(`/reports/${id}`);

// ── Reports (Admin) ──────────────────────────────────────────
export const getAllReports = (params) => api.get("/admin/reports", { params });
export const updateReport = (id, data) => api.patch(`/admin/reports/${id}`, data);
export const adminDeleteReport = (id) => api.delete(`/admin/reports/${id}`);

// ── Users (Admin) ────────────────────────────────────────────
export const getAllUsers = () => api.get("/admin/users");
export const getUserById = (id) => api.get(`/admin/users/${id}`);
export const toggleUserStatus = (id) => api.patch(`/admin/users/${id}/toggle`);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);

export default api;

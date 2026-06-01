import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 30000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mrvilz_admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    if (status === 401 && !url.includes("/auth/login")) {
      localStorage.removeItem("mrvilz_admin_token");
      localStorage.removeItem("mrvilz_admin_user");
      if (!window.location.pathname.startsWith("/admin/login")) {
        window.location.assign("/admin/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;

export async function fetchSiteData() {
  const { data } = await api.get("/public/site");
  return data;
}

export async function submitContact(payload) {
  const { data } = await api.post("/public/contact", payload);
  return data;
}

export async function adminLogin(credentials) {
  const { data } = await api.post("/auth/login", credentials);
  return data;
}

export async function fetchCareers() {
  const { data } = await api.get("/public/careers");
  return data;
}

export async function fetchGallery() {
  const { data } = await api.get("/public/gallery");
  return data;
}

export async function submitJoinTeam(payload) {
  const { data } = await api.post("/public/join-team", payload);
  return data;
}

export async function submitJobApplication(formData) {
  const { data } = await api.post("/public/careers/apply", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
}

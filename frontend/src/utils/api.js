import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000";

const api = axios.create({ baseURL: `${API_BASE}/api` });

api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null;
  if (userInfo?.access) {
    config.headers.Authorization = `Bearer ${userInfo.access}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const userInfo = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null;
      if (userInfo?.refresh) {
        try {
          const { data } = await axios.post(`${API_BASE}/api/users/refresh/`, { refresh: userInfo.refresh });
          const updated = { ...userInfo, access: data.access };
          localStorage.setItem("userInfo", JSON.stringify(updated));
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch (_) {
          localStorage.removeItem("userInfo");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;



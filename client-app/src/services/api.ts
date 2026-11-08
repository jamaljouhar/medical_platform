import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const publicRoutes = ["/login", "/patients", "/user-accounts/user"];

api.interceptors.request.use(
  (config) => {
    const url = (config.url ?? "").replace(/\/+$/, "");

    const method = (config.method ?? "get").toLowerCase();

    const isPublicRoute = publicRoutes.some(
      (route) => url === route || url.startsWith(`${route}/`),
    );

    if (
      isPublicRoute &&
      (url === "/patients" ||
        url.startsWith("/patients/") ||
        url === "/user-accounts/user" ||
        url.startsWith("/user-accounts/user/")) &&
      method !== "post"
    ) {};

    if (isPublicRoute && method === "post") {
      config.headers.delete("Authorization");
      return config;
    }

    const token = localStorage.getItem("token");

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers.delete("Authorization");
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;

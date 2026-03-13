import axios from "axios";

export const adminApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

// Attach token to every request
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle unauthorized responses
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");

      // redirect to login
      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  },
);

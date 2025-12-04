import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://auth-service-pmo0.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT if stored
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;

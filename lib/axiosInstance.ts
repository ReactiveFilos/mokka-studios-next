import axios from "axios";

const axiosInstance = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable for cookie-based auth
});

export default axiosInstance;

// Interceptor to add the token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    // Try token from localStorage first (JWT approach)
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Cookie-based auth will be handled automatically with withCredentials: true
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle auth errors (e.g., redirect to login if 401)
    if (error.response && error.response.status === 401) {
      // Optional: Redirect to login or clear tokens
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    }
    return Promise.reject(error);
  }
);
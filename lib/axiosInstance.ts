import axios from "axios";

const axiosInstance = axios.create({
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false, // DummyJSON non lo supporta
});

export default axiosInstance;

// Interceptor per aggiungere il token a ogni richiesta
axiosInstance.interceptors.request.use(
    (config) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor per gestire errori globali
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);
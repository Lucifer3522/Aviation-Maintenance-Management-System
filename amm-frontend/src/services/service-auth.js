// Import API Service
import { apiService } from "./service-api";

// Auth Service
export const authService = {
    userRegister: async (userData) => {
        return await apiService('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    userLogin: async (credentials) => {
        return await apiService('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    },

    userLogout: () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        sessionStorage.removeItem("authToken");
    },

    isAuth: () => {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        return !!token;
    },

    getToken: () => {
        return localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    },

    getUser: () => {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    },

    setAuth: (token, user) => {
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
    }
};

// Export Service
export default authService;
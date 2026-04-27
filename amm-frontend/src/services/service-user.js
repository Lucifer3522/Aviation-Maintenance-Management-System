// Import API Service
import { apiService } from "./service-api";

// User Service
export const userService = {

    getAllUsers: async () => {
        return await apiService('/api/get/users', {
            method: 'GET'
        });
    },

    getUser: async (id) => {
        return await apiService(`/api/get/users/${id}`, {
            method: 'GET'
        });
    },

    updateUser: async (id, data) => {
        return await apiService(`/api/put/users/edit/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    deleteUser: async (id) => {
        return await apiService(`/api/users/delete/${id}`, {
            method: 'DELETE'
        });
    }
};

// Export Service
export default userService;
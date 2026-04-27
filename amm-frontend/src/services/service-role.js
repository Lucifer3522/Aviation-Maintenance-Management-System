// Import API Service
import { apiService } from "./service-api";

// User Role Service
export const roleService = {

    getAllRoles: async () => {
        return await apiService('/api/get/roles', {
            method: 'GET'
        });
    },

    getRole: async (id) => {
        return await apiService(`/api/get/roles/${id}`, {
            method: 'GET'
        });
    },

    createRole: async (data) => {
        return await apiService('/api/post/roles/create', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    updateRole: async (id, data) => {
        return await apiService(`/api/put/roles/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    deleteRole: async (id) => {
        return await apiService(`/api/delete/roles/delete/${id}`, {
            method: 'DELETE'
        });
    }
};

// Export Service
export default roleService;
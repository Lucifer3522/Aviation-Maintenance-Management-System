// Import API Service
import { apiService } from "./service-api";


// Service Bulletin Service
export const sbService = {
    getAllServiceBulletins: async () => {
        return await apiService('/api/get/sbList', {
            method: 'GET'
        });
    },

    createServiceBulletin: async (data) => {
        return await apiService('/api/post/sbList/create', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    updateServiceBulletin: async (id, data) => {
        return await apiService(`/api/put/sbList/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    deleteServiceBulletin: async (id) => {
        return await apiService(`/api/delete/sbList/delete/${id}`, {
            method: 'DELETE'
        });
    }
};

// Export Service
export default sbService;
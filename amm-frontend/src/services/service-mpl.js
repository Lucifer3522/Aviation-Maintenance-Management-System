// Import API Service
import { apiService } from "./service-api";

// Aircraft Maintenance Program List Service
export const mplService = {
    getAllMPL: async () => {
        return await apiService('/api/get/mpList', {
            method: 'GET'
        });
    },

    getMPL: async (id) => {
        return await apiService(`/api/get/mpList/${id}`, {
            method: 'GET'
        });
    },

    createMPL: async (data) => {
        return await apiService('/api/post/mpList/create', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    updateMPL: async (id, data) => {
        return await apiService(`/api/put/mpList/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    sendMPLtoMRO: async (id, mroOrganization) => {
        return await apiService(`/api/post/mpList/${id}/send`, {
            method: 'POST',
            body: JSON.stringify({ mroOrganization })
        });
    },

    deleteMPL: async (id) => {
        return await apiService(`/api/delete/mpList/delete/${id}`, {
            method: 'DELETE'
        });
    }
};

// Export Service
export default mplService;
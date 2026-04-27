// Import API Service
import { apiService } from "./service-api";

// Aircraft Maintenance Package Document Service
export const mpdService = {
    getAllMPD: async () => {
        return await apiService('/api/get/mpd', {
            method: 'GET'
        });
    },

    getAllMPDs: async () => {
        return await apiService('/api/get/mpd', {
            method: 'GET'
        });
    },

    createMPD: async (aircraftModelId, data) => {
        return await apiService('/api/post/mpd/create', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    updateMPD: async (id, data) => {
        return await apiService(`/api/put/mpd/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    deleteMPD: async (id) => {
        return await apiService(`/api/delete/mpd/delete/${id}`, {
            method: 'DELETE'
        });
    }
};

// Export Service
export default mpdService;
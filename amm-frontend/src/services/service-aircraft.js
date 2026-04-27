// Import API Service
import { apiService } from "./service-api";

// Aircraft Service
export const aircraftService = {

    getAllAircraft: async () => {
        return await apiService('/api/get/aircraftList', {
            method: 'GET'
        });
    },

    getAircraft: async (id) => {
        return await apiService(`/api/get/aircraftList/${id}`, {
            method: 'GET'
        });
    },

    getAllAircraftMPD: async (id) => {
        return await apiService(`/api/get/aircraftList/${id}/mpd`, {
            method: 'GET'
        });
    },

    getAllAircraftMP: async (id) => {
        return await apiService(`/api/get/aircraftList/${id}/mp`, {
            method: 'GET'
        });
    },

    createAircraft: async (data) => {
        return await apiService('/api/post/aircraftList/create', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    updateAircraft: async (id, data) => {
        return await apiService(`/api/put/aircraftList/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    deleteAircraft: async (id) => {
        return await apiService(`/api/delete/aircraftList/delete/${id}`, {
            method: 'DELETE'
        });
    }
};

// Export Service
export default aircraftService;
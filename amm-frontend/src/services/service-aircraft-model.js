// Import API Service
import { apiService } from "./service-api";

// Aircraft Model Service
export const aircraftModelService = {

    getAllAircraftModels: async () => {
        return await apiService('/api/get/aircraftModels', {
            method: 'GET'
        });
    },

    getAircraftModel: async (id) => {
        return await apiService(`/api/get/aircraftModels/${id}`, {
            method: 'GET'
        });
    },

    getAircraftModelMPD: async (id) => {
        return await apiService(`/api/get/aircraftModels/${id}/mpd`, {
            method: 'GET'
        });
    },

    createAircraftModel: async (data) => {
        return await apiService('/api/post/aircraftModels/create', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    updateAircraftModel: async (id, data) => {
        return await apiService(`/api/put/aircraftModels/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    deleteAircraftModel: async (id) => {
        return await apiService(`/api/delete/aircraftModels/delete/${id}`, {
            method: 'DELETE'
        });
    },

    createAircraftModelMPD: async (id, data) => {
        return await apiService(`/api/post/aircraftModels/${id}/mpd/create`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
};

// Export Service
export default aircraftModelService;
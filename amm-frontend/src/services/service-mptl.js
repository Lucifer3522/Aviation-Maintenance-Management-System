// Import API Service
import { apiService } from "./service-api";

// Aircraft Maintenance Program Task List Service
export const mptlService = {
    
    getAllMPTL: async () => {
        return await apiService('/api/get/mptList', {
            method: 'GET'
        });
    },

    getMPTLByAircraft: async (aircraftId) => {
        const allMPTL = await apiService('/api/get/mptList', {
            method: 'GET'
        });
        return allMPTL.filter(mptl => mptl.aircraftId?._id === aircraftId || mptl.aircraftId === aircraftId);
    },

    getMPTL: async (id) => {
        return await apiService(`/api/get/mptList/${id}`, {
            method: 'GET'
        });
    },

    createMPTL: async (data) => {
        return await apiService('/api/post/mptList/create', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    updateMPTL: async (id, data) => {
        return await apiService(`/api/put/mptList/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    updateTask: async (id, taskId, data) => {
        return await apiService(`/api/patch/mptList/${id}/tasks/${taskId}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    },

    addWorkLog: async (id, taskId, data) => {
        return await apiService(`/api/post/mptList/${id}/tasks/${taskId}/worklogs`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    issueCRS: async( id, crsData ) => {
        return await apiService(`/api/post/mptList/${id}/issue`, {
            method: 'POST',
            body: JSON.stringify(crsData)
        });
    }
};

// Export Service
export default mptlService;

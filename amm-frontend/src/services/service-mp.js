// Import API Service
import { apiService } from "./service-api";

// Aircraft Maintenance Package Service
export const mpService = {
    getMP: async ( id ) => {
        return await apiService( `/api/get/mp/${id}`, {
            method: 'GET'
        });
    },
};

// Export Service
export default mpService;
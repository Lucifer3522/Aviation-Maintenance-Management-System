// Service API URL
const API_BASE_URL = "http://localhost:5000";

// API Service
export const apiService = async (endpoint, options = {}) => {
    try {
        const authToken = localStorage.getItem("authToken") || sessionStorage.getItem("authToken") || "";

        const headers = {
            "Content-Type": "application/json",
            ...options.headers
        };

        if (authToken) {
            headers["Authorization"] = `Bearer ${authToken}`;
        }

        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers,
            ...options
        });

            if (!res.ok) {
                let errorData = {};
                try {
                    errorData = await res.json();
                } catch (e) {
                    errorData = { message: `HTTP ${res.status} | ${res.statusText}` };
                }
                
                const error = new Error(errorData.message || `HTTP ${res.status} | ${res.statusText}`);
                error.status = res.status;
                error.retryAfter = errorData.retryAfter;
                throw error;
            }

            try {
                return await res.json();
            } catch (errorParse) {
                const text = await res.text();
                return text;
            }
    } catch (error) {
        console.error("API Call Error:", error);
        throw error;
    }
}

export default API_BASE_URL;
import axios from 'axios';

/**
 * Base URL for the backend API.
 * The backend is running on HTTPS port 5001 for secure communication.
 */
const API_URL = 'https://localhost:5001';

/**
 * Axios request interceptor for debugging API requests.
 * Logs request details including URL, method, data, and headers.
 */
axios.interceptors.request.use(request => {
    console.log('Starting Request:', {
        url: request.url,
        method: request.method,
        data: request.data,
        headers: request.headers
    });
    return request;
});

/**
 * Axios response interceptor for debugging API responses.
 * Logs response details including status and data.
 * Also handles and logs error responses.
 */
axios.interceptors.response.use(
    response => {
        console.log('Response:', {
            status: response.status,
            statusText: response.statusText,
            data: response.data
        });
        return response;
    },
    error => {
        console.error('Request Failed:', {
            error: error.message
        });
        if (error.response) {
            console.error('Response Error:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data
            });
        }
        return Promise.reject(error);
    }
);

/**
 * API client for supplier-related operations.
 * Provides methods for CRUD operations on suppliers.
 */
const supplierApi = {
    /**
     * Retrieves a list of suppliers with optional filtering.
     * @returns {Promise<Object>} Response containing suppliers and total count
     */
    getSuppliers: async (params = {}) => {
        try {
            const response = await axios.get(`${API_URL}/suppliers`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            throw error;
        }
    },

    /**
     * Retrieves a single supplier by ID.
     * @param {string} id - The unique identifier of the supplier
     * @returns {Promise<Object>} Response containing the supplier details
     */
    getSupplier: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/suppliers/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching supplier with ID ${id}:`, error);
            throw error;
        }
    },
    
    /**
     * Creates a new supplier in the system.
     * @returns {Promise<Object>} Response indicating success/failure and containing the created supplier
     */
    createSupplier: async (supplierData) => {
        try {
            const requestData = {
                SupplierName: supplierData.SupplierName,
                Email: supplierData.Email,
                PhoneNumber: supplierData.PhoneNumber,
                AddressLineOne: supplierData.AddressLineOne,
                AddressLineTwo: supplierData.AddressLineTwo,
                City: supplierData.City,
                State: supplierData.State,
                ZipCode: supplierData.ZipCode,
                Country: supplierData.Country
            };

            console.log('Sending supplier data:', requestData);

            const response = await axios.post(`${API_URL}/suppliers`, requestData);
            return response.data;
        } catch (error) {
            console.error('Error creating supplier:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            }
            throw error;
        }
    },

    /**
     * Updates an existing supplier's information.
     * @returns {Promise<Object>} Response indicating success/failure and containing the updated supplier
     */
    updateSupplier: async (supplierData) => {
        try {
            const id = supplierData.Id;
            const requestData = {
                Id: id,
                SupplierName: supplierData.SupplierName,
                Email: supplierData.Email,
                PhoneNumber: supplierData.PhoneNumber,
                AddressLineOne: supplierData.AddressLineOne,
                AddressLineTwo: supplierData.AddressLineTwo,
                City: supplierData.City,
                State: supplierData.State,
                ZipCode: supplierData.ZipCode,
                Country: supplierData.Country
            };

            console.log('Updating supplier data:', requestData);

            const response = await axios.put(`${API_URL}/suppliers/${id}`, requestData);
            return response.data;
        } catch (error) {
            console.error('Error updating supplier:', error);
            throw error;
        }
    },

    /**
     * Deletes a supplier from the system.
     * @param {string} id - The unique identifier of the supplier to delete
     * @returns {Promise<Object>} Response indicating success/failure of the deletion
     */
    deleteSupplier: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/suppliers/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting supplier with ID ${id}:`, error);
            throw error;
        }
    }
};

export default supplierApi;
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
    return request; // Make sure to return the request
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
 * API endpoints for customer operations.
 * These functions handle all CRUD operations for customers.
 */
const customerApi = {
    /**
     * Retrieves a list of customers with optional filtering and pagination.
     * Let backend handle all filtering, sorting, and pagination
     * @param {Object} params - Query parameters including searchTerm, sortBy, sortDesc, skip, take
     * @returns {Promise<Object>} Response containing customers and total count
     */
    getCustomers: async (params = {}) => {
        try {
            // Set reasonable defaults
            const queryParams = {
                searchTerm: params.searchTerm || '',
                sortBy: params.sortBy || '',
                sortDesc: params.sortDesc || false,
                skip: params.skip || 0,
                take: params.take || 20
            };
            
            console.log('Making API request with params:', queryParams);
            const response = await axios.get(`${API_URL}/customers`, { params: queryParams });
            console.log('Raw API response data:', response.data);
            
            // Ensure we have a valid response with customers array
            if (response.data && Array.isArray(response.data.customers)) {
                //console.log('Processing customers from response:', response.data.customers);
                
                const processedCustomers = response.data.customers.map(customer => {
                    //console.log('Processing customer:', customer);
                    // Normalize property names to ensure consistent capitalization
                    return {
                        // Prioritize capitalized keys, then lowercase keys
                        Id: customer.Id || customer.id,
                        Name: customer.Name || customer.name,
                        Email: customer.Email || customer.email,
                        Created_At: customer.Created_At || customer.created_At,
                        // Convert string numbers to actual numbers
                        Orders: Number(customer.Orders || customer.orders || 0),
                        Total_Spent: Number(customer.Total_Spent || customer.total_Spent || 0)
                    };
                });
                
                console.log('Processed customers:', processedCustomers);
                
                return {
                    customers: processedCustomers,
                    totalCount: response.data.totalCount || 0
                };
            }
            
            // Handle case where response doesn't have expected structure
            console.warn('Unexpected API response format:', response.data);
            return { customers: [], totalCount: 0 };
        } catch (error) {
            console.error('Error fetching customers:', error);
            throw error;
        }
    },

    /**
     * Retrieves a single customer by ID.
     * @param {string} id - The unique identifier of the customer
     * @returns {Promise<Object>} Response containing the customer details
     */
    getCustomer: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/customers/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching customer with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Deletes a customer from the system.
     * @param {string} id - The unique identifier of the customer to delete
     * @returns {Promise<Object>} Response indicating success/failure of the deletion
     */
    deleteCustomer: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/customers/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting customer with ID ${id}:`, error);
            throw error;
        }
    }
};

export default customerApi;

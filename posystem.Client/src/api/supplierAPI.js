import axios from 'axios';

const API_URL = 'https://localhost:5001'; // Backend is running on HTTPS port 5001

// Configure axios for better debugging
axios.interceptors.request.use(request => {
    console.log('Starting Request:', {
        url: request.url,
        method: request.method,
        data: request.data,
        headers: request.headers
    });
    return request;
});

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
    // Get all suppliers with optional filtering
    getSuppliers: async (params = {}) => {
      const response = await axios.get('/suppliers', { params });
      return response.data;
    },

    // Get a single supplier by ID
    getSupplier: async (id) => {
      const response = await axios.get(`/suppliers/${id}`);
      return response.data;
    },
    
    // Create a new supplier
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
            // Log more detailed error information
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            }
            throw error;
        }
    },

    // Update an existing supplier
    updateSupplier: async (supplierData) => {
      const id = supplierData.Id;
      const requestData = { ...supplierData };
      const response = await axios.put(`/suppliers/${id}`, requestData);
      return response.data;
    },

    // Delete a supplier
    deleteSupplier: async (id) => {
      const response = await axios.delete(`/suppliers/${id}`);
      return response.data;
    }
  };
  
  export default supplierApi;
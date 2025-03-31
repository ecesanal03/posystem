import axios from './axiosInstance';

/**
 * API endpoints for customer operations using shared axios instance.
 * Handles CRUD operations, login, and registration for customers.
 */
const customerApi = {

  getCustomers: async (params = {}) => {
    try {
      const queryParams = {
        searchTerm: params.searchTerm || '',
        sortBy: params.sortBy || '',
        sortDesc: params.sortDesc || false,
        skip: params.skip || 0,
        take: params.take || 20
      };

      const response = await axios.get('/customers', { params: queryParams });

      if (response.data && Array.isArray(response.data.customers)) {
        const processedCustomers = response.data.customers.map(customer => ({
          Id: customer.Id || customer.id,
          Name: customer.Name || customer.name,
          Email: customer.Email || customer.email,
          Created_At: customer.Created_At || customer.created_At,
          Orders: Number(customer.Orders || customer.orders || 0),
          Total_Spent: Number(customer.Total_Spent || customer.total_Spent || 0)
        }));

        return {
          customers: processedCustomers,
          totalCount: response.data.totalCount || 0
        };
      }

      return { customers: [], totalCount: 0 };
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },


  getCustomer: async (id) => {
    try {
      const response = await axios.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer with ID ${id}:`, error);
      throw error;
    }
  },

  deleteCustomer: async (id) => {
    try {
        const response = await axios.delete(`/customers/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting customer with ID ${id}:`, error);
        throw error;
    }
  },

  login: async (email, password) => {
    try {
      const response = await axios.post('/customers/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (formData) => {
    try {
      const response = await axios.post('/customers/registration', formData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
};

export default customerApi;

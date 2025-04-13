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

  getMyProfile: async () => {
    try {
      console.log('Fetching profile data...');
      const response = await axios.get('/customers/me');
      console.log('Received profile:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error.response?.data || error.message);
      throw error;
    }
  },
  
  updateProfile: async (formData) => {
    try {
      const response = await axios.put('/customers/me', formData);
      return response.data;
    } catch (error) {
      console.error('Error updating customer profile:', error);
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
      console.log('Attempting login for:', email);
      const response = await axios.post('/customers/login', { email, password });
      console.log('Login response:', response.data);
      if (response.data.success) {
        console.log('Setting token:', response.data.token);
        localStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error details:', error.response?.data);
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
  },

  updateMyProfile: async (profileData) => {
    try {
      console.log('Updating profile with data:', profileData);
      const response = await axios.put('/customers/me', {
        firstName: profileData.firstName,
        middleName: profileData.middleName,
        lastName: profileData.lastName,
        phoneNumber: profileData.phoneNumber,
        dateOfBirth: profileData.dateOfBirth,
        addressLineOne: profileData.addressLineOne,
        addressLineTwo: profileData.addressLineTwo,
        city: profileData.city,
        state: profileData.state,
        zipCode: profileData.zipCode,
        country: profileData.country
      });
      console.log('Profile update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      throw error;
    }
  },

  getMyOrders: async (params = {}) => {
    try {
      console.log('Fetching orders from orders service...');
      const queryParams = {
        skip: params.skip || 0,
        take: params.take || 100,
        sortBy: 'Order_Date',
        sortDesc: true
      };
      const response = await axios.get('/orders', { params: queryParams });
      console.log('Orders response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error.response?.data || error.message);
      throw error;
    }
  },

  getMyInvoices: async (params = {}) => {
    try {
      console.log('Fetching invoices from invoices service...');
      const queryParams = {
        skip: params.skip || 0,
        take: params.take || 100,
        sortBy: 'Invoice_Date',
        sortDesc: true
      };
      const response = await axios.get('/invoices', { params: queryParams });
      console.log('Invoices response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching invoices:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default customerApi;

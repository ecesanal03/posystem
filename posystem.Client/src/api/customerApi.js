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

  getMyInvoices: async (skip = 0, take = 10) => {
    try {
      console.log('Fetching invoices through customer orders...');
      // Get the customer's orders using the authenticated endpoint
      const ordersResponse = await axios.get('/customers/me/orders', {
        params: {
          skip: 0,
          take: 1000 // Get more orders to ensure we have all potential invoices
        }
      });

      if (ordersResponse.data && (ordersResponse.data.Orders || ordersResponse.data.orders)) {
        const orders = ordersResponse.data.Orders || ordersResponse.data.orders;
        
        // Create invoice-like objects from orders
        const invoices = orders.map(order => ({
          id: order.id || order.Id,
          order_Id: order.id || order.Id,
          invoice_Date: order.order_Date || order.Order_Date,
          due_Date: new Date(new Date(order.order_Date || order.Order_Date).getTime() + (30 * 24 * 60 * 60 * 1000)), // 30 days after order
          status: order.payment_Status || order.Payment_Status || 
                 (order.order_Status === 'Delivered' ? 'Paid' : 'Pending'),
          total_Amount: order.total_Amount || order.Total_Amount || 0
        }));

        // Sort invoices by date descending
        invoices.sort((a, b) => new Date(b.invoice_Date) - new Date(a.invoice_Date));

        // Apply pagination
        const startIndex = skip;
        const endIndex = skip + take;
        const paginatedInvoices = invoices.slice(startIndex, endIndex);

        return {
          invoices: paginatedInvoices,
          totalCount: invoices.length
        };
      }
      return { invoices: [], totalCount: 0 };
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }
};

export default customerApi;

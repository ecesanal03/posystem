import axios from './axiosInstance';

const supplierApi = {

    getSuppliers: async (params = {}) => {
      const response = await axios.get('/suppliers', { params });
      return response.data;
    },

    getSupplier: async (id) => {
      const response = await axios.get(`/suppliers/${id}`);
      return response.data;
    },
    
    createSupplier: async (supplierData) => {
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
      const response = await axios.post('/suppliers', requestData);
      return response.data;
    },

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

    updateSupplier: async (supplierData) => {
      const id = supplierData.Id;
      const requestData = { ...supplierData };
      const response = await axios.put(`/suppliers/${id}`, requestData);
      return response.data;
    },


    deleteSupplier: async (id) => {
      const response = await axios.delete(`/suppliers/${id}`);
      return response.data;
    }
  };
  
  export default supplierApi;
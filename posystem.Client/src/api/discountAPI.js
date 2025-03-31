import axios from './axiosInstance';

const discountApi = {
    getDiscounts: async (params = {}) => {
        try {
            console.log('⬆️ GET /discounts - Request Params:', params);
            const response = await axios.get('/discounts', { params });
            console.log('⬇️ GET /discounts - Response Data:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ GET /discounts - Error:', error.response?.data || error.message);
            throw error;
        }
    },
    getDiscount: async (id) => {
        try {
            console.log(`⬆️ GET /discounts/${id} - Request ID:`, id);
            const response = await axios.get(`/discounts/${id}`);
            console.log(`⬇️ GET /discounts/${id} - Response Data:`, response.data);
            return response.data;
        } catch (error) {
            console.error(`❌ GET /discounts/${id} - Error:`, error.response?.data || error.message);
            throw error;
        }
    },
    createDiscount: async (discountData) => {
        try {
            console.log('⬆️ POST /discounts - Request Data:', discountData);
            const response = await axios.post('/discounts', discountData);
            console.log('⬇️ POST /discounts - Response Data:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ POST /discounts - Error:', error.response?.data || error.message);
            throw error;
        }
    },
    updateDiscount: async (id, discountData) => {
        try {
            console.log(`⬆️ PUT /discounts/${id} - Request Data:`, { id, ...discountData });
            const response = await axios.put(`/discounts/${id}`, discountData);
            console.log(`⬇️ PUT /discounts/${id} - Response Data:`, response.data);
            return response.data;
        } catch (error) {
            console.error(`❌ PUT /discounts/${id} - Error:`, error.response?.data || error.message);
            throw error;
        }
    },
    deleteDiscount: async (id) => {
        try {
            console.log(`⬆️ DELETE /discounts/${id} - Request ID:`, id);
            const response = await axios.delete(`/discounts/${id}`);
            console.log(`⬇️ DELETE /discounts/${id} - Response Data:`, response.data);
            return response.data;
        } catch (error) {
            console.error(`❌ DELETE /discounts/${id} - Error:`, error.response?.data || error.message);
            throw error;
        }
    }
};

export default discountApi;

import axios from './axiosInstance';

const discountApi = {
    getDiscounts: async (params = {}) => {
        try {
            const response = await axios.get('/discounts', { params });
            return response.data;
        } catch (error) {
            console.error('❌ GET /discounts - Error:', error.response?.data || error.message);
            throw error;
        }
    },
    getDiscount: async (id) => {
        try {
            const response = await axios.get(`/discounts/${id}`);
            return response.data;
        } catch (error) {
            console.error(`❌ GET /discounts/${id} - Error:`, error.response?.data || error.message);
            throw error;
        }
    },
    createDiscount: async (discountData) => {
        try {
            const response = await axios.post('/discounts', discountData);
            return response.data;
        } catch (error) {
            console.error('❌ POST /discounts - Error:', error.response?.data || error.message);
            throw error;
        }
    },
    updateDiscount: async (id, discountData) => {
        try {
            const response = await axios.put(`/discounts/${id}`, discountData);
            return response.data;
        } catch (error) {
            console.error(`❌ PUT /discounts/${id} - Error:`, error.response?.data || error.message);
            throw error;
        }
    },
    deleteDiscount: async (id) => {
        try {
            const response = await axios.delete(`/discounts/${id}`);
            return response.data;
        } catch (error) {
            console.error(`❌ DELETE /discounts/${id} - Error:`, error.response?.data || error.message);
            throw error;
        }
    },

    applyToAllBooks: async (discountId) => {
        const response = await axios.post('/books/apply-discount', { DiscountId: discountId });
        return response.data;
    },

    removeDiscountFromAllBooks: async (discountId) => {
        const response = await axios.post(`/discounts/remove-from-all/${discountId}`);
        return response.data;
      },

      
};

export default discountApi;

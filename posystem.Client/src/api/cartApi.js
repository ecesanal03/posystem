import axios from './axiosInstance';

const cartApi = {
    //Get current cart
    getCart: async () => {
        const response = await axios.get('/cart');
        return response.data;
    },

    //Add item to cart
    addToCart: async (bookId, quantity = 1) => {
        const response = await axios.post('/cart/add', { bookId, quantity });
        return response.data;

    },

    //Update quantity of item in cart
    updateCartQuantity: async (bookId, quantity) => {
        const response = await axios.post(`/cart/update`, { bookId, quantity });
        return response.data;
    },

    //Remove item from cart
    removeFromCart: async (bookId) => {
        const response = await axios.post('/cart/remove', { bookId });
        return response.data;
    }
};

export default cartApi;


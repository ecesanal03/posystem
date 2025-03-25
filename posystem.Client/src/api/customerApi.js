import axios from './axiosInstance';

const customerApi = {
  login: async (email, password) => {
    const response = await axios.post('/customers/login', { email, password });
    return response.data;
  },

  register: async (formData) => {
    const response = await axios.post('/customers/registration', formData);
    return response.data;
  }
};

export default customerApi;

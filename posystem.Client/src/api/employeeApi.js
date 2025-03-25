import axiosInstance from './axiosInstance';

const employeeApi = {
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/employee/employeeLogin', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  },
};

export default employeeApi;

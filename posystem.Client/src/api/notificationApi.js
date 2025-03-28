import axios from './axiosInstance';

const notificationApi = {

    getNotifications: async () => {
        const response = await axios.get('/notifications');
        return response.data;
    },

    markNotificationAsRead: async (id) => {
        const response = await axios.put(`/notifications/${id}/read`);
    }
}
export default notificationApi;
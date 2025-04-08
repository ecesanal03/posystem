import { Description } from '@mui/icons-material';
import axios from './axiosInstance';

const reviewApi = {
    getReviews: async (bookId) => {
        const response = await axios.get(`/reviews/retrieve`, {
          params: { BookId: bookId }
        });
        return response.data;
      },
    
      createReview: async (bookId, rating, description) => {
        const response = await axios.post(`/reviews/create`, {
          BookId: bookId,
          Rating: rating,
          Description: description,
          ReviewDate: new Date().toISOString(),
        });
        return response.data;
      }
};

export default reviewApi;
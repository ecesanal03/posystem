import axios from './axiosInstance';

const reportApi = {
  generateReport: async (report_Name, startDate, endDate) => {
    const response = await axios.post('/report/generate', {
      report_Name,
      startDate,
      endDate,
    });
    return response.data;
  }
};

export default reportApi;

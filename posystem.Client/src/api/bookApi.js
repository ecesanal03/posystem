import axios from './axiosInstance'; // 👈 Use the shared instance

const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
  });
};

const bookApi = {
  getBooks: async (params = {}) => {
    const response = await axios.get('/books', { params });
    return response.data;
  },

  getBook: async (id) => {
    const response = await axios.get(`/books/${id}`);
    return response.data;
  },

  createBook: async (bookData) => {
    const requestData = {
      Title: bookData.title,
      Author: bookData.author,
      ISBN: bookData.isbn,
      Price: parseFloat(bookData.price),
      Units: parseInt(bookData.units),
      Description: bookData.description || '',
      Supplier_Id: bookData.supplierId || null,
      Discount_Id: bookData.discountId || null
    };

    if (bookData.image instanceof File) {
      requestData.Cover_Image = await convertFileToBase64(bookData.image);
    }

    const response = await axios.post('/books', requestData);
    return response.data;
  },

  updateBook: async (id, bookData) => {
    const requestData = {
      Id: id,
      Title: bookData.title,
      Author: bookData.author,
      ISBN: bookData.isbn,
      Price: parseFloat(bookData.price),
      Units: parseInt(bookData.units),
      Description: bookData.description || '',
      Supplier_Id: bookData.supplierId || null,
      Discount_Id: bookData.discountId || null
    };

    if (bookData.image instanceof File) {
      requestData.CoverImage = await convertFileToBase64(bookData.image);
    }

    const response = await axios.put(`/books/${id}`, requestData);
    return response.data;
  },

  deleteBook: async (id) => {
    const response = await axios.delete(`/books/${id}`);
    return response.data;
  }
};

export default bookApi;


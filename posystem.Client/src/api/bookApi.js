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
    try {
      const response = await axios.get('/books', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  },

  getBook: async (id) => {
    try {
      const response = await axios.get(`/books/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching book with ID ${id}:`, error);
      throw error;
    }
  },

  createBook: async (bookData) => {
    try {
      // Create a request object that matches the CreateBookDTO structure
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

      // Handle image conversion separately if it exists
      if (bookData.image instanceof File) {
        // Convert file to base64 for sending to API
        const base64Image = await convertFileToBase64(bookData.image);
        requestData.Cover_Image = base64Image;
      }

      const response = await axios.post('/books', requestData);
      return response.data;
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  },

  updateBook: async (id, bookData) => {
    try {
      // Create a request object that matches the UpdateBookDTO structure
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

      // Handle image conversion separately if it exists
      if (bookData.image instanceof File) {
        // Convert file to base64 for sending to API
        const base64Image = await convertFileToBase64(bookData.image);
        requestData.CoverImage = base64Image;
      }

      const response = await axios.put(`/books/${id}`, requestData);
      return response.data;
    } catch (error) {
      console.error(`Error updating book with ID ${id}:`, error);
      throw error;
    }
  },

  deleteBook: async (id) => {
    try {
      const response = await axios.delete(`/books/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting book with ID ${id}:`, error);
      throw error;
    }
  },
  
};

export default bookApi;


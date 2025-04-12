import axios from './axiosInstance'; // 👈 Use the shared instance

// Helper function to process book data returned from API
const processBookData = (book) => {
  if (!book) return null;

  // Create a processed book object with consistent field naming
  return {
    ...book,
    // Make sure we have a fallback for CoverImage
    coverImage: book.Cover_Image || book.coverImage || null,
    supplier_Id: book.Supplier_Id || book.supplier_Id,
    category_Id: book.Category_Id || book.category_Id,
    discount_Id: book.Discount_Id || book.discount_Id,
  };
};

// Helper function to format book data for API requests
const formatBookDataForRequest = (bookData, isUpdate = false, id = null) => {
  const requestData = {
    Title: bookData.title,
    Author: bookData.author,
    ISBN: bookData.isbn,
    Price: parseFloat(bookData.price),
    Units: parseInt(bookData.units),
    Description: bookData.description || '',
    Supplier_Id: bookData.supplier_Id || null,
    Discount_Id: bookData.discount_Id || null
  };
  
  // Add ID if updating
  if (isUpdate && id) {
    requestData.Id = id;
  }

  // Handle Category_Id specially to ensure consistent formatting
  if (bookData.category_Id) {
    const categoryId = bookData.category_Id.toString().trim();
    requestData.Category_Id = categoryId;
  } else {
    requestData.Category_Id = null;
  }

  // Handle cover image
  if (typeof bookData.coverImage === 'string' && bookData.coverImage.trim() !== '') {
    requestData.Cover_Image = bookData.coverImage;
  } else if (bookData.coverImage instanceof File) {
    requestData.Cover_Image = bookData.coverImage;
  }

  return requestData;
};

const bookApi = {
  getBooks: async (params = {}) => {
    try {
      const response = await axios.get('/books', { params });

      // Process the books data to ensure consistent field naming
      const processedData = {
        ...response.data,
        books: response.data.books?.map(book => processBookData(book)) || []
      };

      return processedData;
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  },

  getBook: async (id) => {
    try {
      const response = await axios.get(`/books/${id}`);

      // Process the book data
      if (response.data.book) {
        response.data.book = processBookData(response.data.book);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching book with ID ${id}:`, error);
      throw error;
    }
  },

  createBook: async (bookData) => {
    try {
      const requestData = formatBookDataForRequest(bookData);
      const response = await axios.post('/books', requestData);
      return response.data;
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  },

  updateBook: async (id, bookData) => {
    try {
      const requestData = formatBookDataForRequest(bookData, true, id);
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
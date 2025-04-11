import axios from './axiosInstance'; // 👈 Use the shared instance

// Helper function to process book data returned from API
const processBookData = (book) => {
  if (!book) return null;

  // Log what we're processing
  console.log("Processing book:", book.title, {
    originalCoverImage: book.CoverImage,
    originalCover_Image: book.Cover_Image
  });

  // Create a processed book object with consistent field naming
  return {
    ...book,
    // Make sure we have a fallback for CoverImage
    CoverImage: book.Cover_Image || book.coverImage || null,
  };
};

const bookApi = {
  getBooks: async (params = {}) => {
    try {
      const response = await axios.get('/books', { params });

      // Log the raw response data
      console.log("Raw API response:", JSON.stringify(response.data, null, 2));

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

      // Handle cover image - this could now be a URL string
      if (typeof bookData.coverImage === 'string' && bookData.coverImage.trim() !== '') {
        requestData.Cover_Image = bookData.coverImage;
      } else if (bookData.coverImage instanceof File) {
        // If it's a file, handle it appropriately
        // This would need to be changed if you're moving to storing only URLs
        requestData.Cover_Image = bookData.coverImage;
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

      // Handle cover image - this could now be a URL string
      if (typeof bookData.coverImage === 'string' && bookData.coverImage.trim() !== '') {
        requestData.Cover_Image = bookData.coverImage;
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
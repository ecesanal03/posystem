import axios from 'axios';

const API_URL = 'https://localhost:5001'; // Backend is running on HTTPS port 5001

// Configure axios for better debugging
axios.interceptors.request.use(request => {
  console.log('Starting Request:', {
    url: request.url,
    method: request.method,
    data: request.data,
    headers: request.headers
  });
  return request;
});

axios.interceptors.response.use(
  response => {
    console.log('Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('Request Failed:', {
      error: error.message
    });
    if (error.response) {
      console.error('Response Error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    return Promise.reject(error);
  }
);

/**
 * API client for book-related operations.
 * Provides methods for CRUD operations and server status checking.
 */
const bookApi = {
  // Get all books with optional filtering
  getBooks: async (params = {}) => {
    const response = await axios.get('/books', { params });
    return response.data;
  },

  // Get a single book by ID
  getBook: async (id) => {
    const response = await axios.get(`/books/${id}`);
    return response.data;
  },

  // Create a new book
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

  // Update an existing book
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

  // Delete a book
  deleteBook: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/books/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting book with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Test connection to the API to check for CORS issues
   * @returns {Promise<Object>} Result of the connection test
   */
  async testConnection() {
    try {
      console.log('Testing CORS connection with HTTPS...');
      // Try with HTTPS first
      const response = await fetch('https://localhost:5001/books', {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'GET'
        }
      });
      
      return {
        success: true,
        protocol: 'HTTPS',
        status: response.status,
        headers: {
          'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
          'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
          'access-control-allow-headers': response.headers.get('access-control-allow-headers'),
        }
      };
    } catch (err) {
      console.log('HTTPS connection failed, trying HTTP...', err);
      
      try {
        // If HTTPS fails, try HTTP
        const response = await fetch('http://localhost:5001/books', {
          method: 'OPTIONS',
          headers: {
            'Origin': window.location.origin,
            'Access-Control-Request-Method': 'GET'
          }
        });
        
        return {
          success: true,
          protocol: 'HTTP',
          status: response.status,
          headers: {
            'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
            'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
            'access-control-allow-headers': response.headers.get('access-control-allow-headers'),
          }
        };
      } catch (error) {
        console.error('Both HTTPS and HTTP connections failed', error);
        return {
          success: false,
          error: error.message,
          isCorsError: error.message.includes('CORS'),
          suggestions: [
            'Ensure the server is running',
            'Check that CORS is configured correctly on the server',
            'Try accessing the API directly in the browser to accept any SSL certificates'
          ]
        };
      }
    }
  },

  /**
   * Comprehensive check of server status by trying multiple endpoints and protocols
   * @returns {Promise<Object>} Detailed server status information
   */
  async checkServerStatus() {
    const endpoints = [
      { url: 'https://localhost:5001', protocol: 'HTTPS', port: 5001 },
      { url: 'http://localhost:54904', protocol: 'HTTP', port: 54904 }
    ];
    
    const results = {
      success: false,
      attempts: [],
      workingEndpoint: null,
      suggestion: ''
    };
    
    for (const endpoint of endpoints) {
      try {
        // Try root endpoint
        console.log(`Checking ${endpoint.protocol} root endpoint...`);
        const rootResponse = await fetch(`${endpoint.url}`);
        
        // Try books endpoint
        console.log(`Checking ${endpoint.protocol} books endpoint...`);
        const booksResponse = await fetch(`${endpoint.url}/books`);
        
        results.attempts.push({
          endpoint: endpoint.url,
          rootStatus: rootResponse.status,
          booksStatus: booksResponse.status,
          success: true
        });
        
        if (!results.workingEndpoint) {
          results.workingEndpoint = endpoint;
          results.success = true;
        }
      } catch (error) {
        results.attempts.push({
          endpoint: endpoint.url,
          error: error.message,
          success: false
        });
      }
    }
    
    if (!results.success) {
      results.suggestion = 'Server appears to be unavailable. Check that the backend is running and listening on the expected ports.';
    } else {
      results.suggestion = `Server is available at ${results.workingEndpoint.protocol} on port ${results.workingEndpoint.port}.`;
    }
    
    return results;
  },

  /**
   * Detect and report detailed information about the backend server
   * @returns {Promise<Object>} Information about the server configuration
   */
  async detectServerDetails() {
    const endpoints = [
      { url: 'https://localhost:5001', protocol: 'HTTPS', port: 5001 },
      { url: 'http://localhost:54904', protocol: 'HTTP', port: 54904 }
    ];
    
    const details = {
      detected: false,
      serverInfo: {},
      headers: {},
      cors: {
        allowOrigin: null,
        allowMethods: null,
        allowHeaders: null
      },
      suggestions: []
    };
    
    // Try to find a working endpoint
    let workingEndpoint = null;
    for (const endpoint of endpoints) {
      try {
        // Test basic connectivity to root endpoint
        const response = await fetch(`${endpoint.url}`, {
          method: 'HEAD'  // Use HEAD to just get headers without body
        });
        
        workingEndpoint = endpoint;
        details.detected = true;
        
        // Capture server headers that might be useful for diagnostics
        details.headers = {
          server: response.headers.get('server'),
          'content-type': response.headers.get('content-type'),
          'x-powered-by': response.headers.get('x-powered-by')
        };
        
        break;
      } catch (error) {
        console.log(`Failed to detect server at ${endpoint.url}:`, error.message);
      }
    }
    
    if (!workingEndpoint) {
      details.suggestions.push(
        'Backend server appears to be offline or not accessible',
        'Check that your ASP.NET Core application is running',
        'Verify your launch settings have the correct URLs and ports configured'
      );
      return details;
    }
    
    // Get more detailed information if we found a working endpoint
    try {
      // Test CORS configuration
      const corsResponse = await fetch(`${workingEndpoint.url}/books`, {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });
      
      details.cors = {
        allowOrigin: corsResponse.headers.get('access-control-allow-origin'),
        allowMethods: corsResponse.headers.get('access-control-allow-methods'),
        allowHeaders: corsResponse.headers.get('access-control-allow-headers')
      };
      
      // Check if CORS is properly configured
      if (!details.cors.allowOrigin) {
        details.suggestions.push(
          'CORS headers are missing in the server response',
          'Add proper CORS configuration to your ASP.NET Core application in Startup.cs or Program.cs'
        );
      } else if (details.cors.allowOrigin !== '*' && details.cors.allowOrigin !== window.location.origin) {
        details.suggestions.push(
          `Current origin (${window.location.origin}) is not allowed by the server's CORS policy`,
          `Server's Access-Control-Allow-Origin is set to: ${details.cors.allowOrigin}`
        );
      }
    } catch (error) {
      details.suggestions.push(
        'CORS check failed',
        `Error: ${error.message}`,
        'Make sure your server allows OPTIONS requests and has CORS properly configured'
      );
    }
    
    // Check for common API endpoints
    try {
      // Try to get version or environment info if available
      const infoResponse = await fetch(`${workingEndpoint.url}/info`);
      if (infoResponse.ok) {
        const contentType = infoResponse.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          details.serverInfo = await infoResponse.json();
        }
      }
    } catch (error) {
      // Info endpoint might not exist, which is fine
      console.log('Info endpoint not available:', error.message);
    }
    
    if (Object.keys(details.serverInfo).length === 0) {
      details.suggestions.push(
        'Consider adding an /info endpoint to your API that returns version and environment details',
        'This can be helpful for diagnostics'
      );
    }
    
    return details;
  }
};

// Helper function to convert File object to base64 string
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Get base64 string without the prefix (data:image/jpeg;base64,)
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

export default bookApi;


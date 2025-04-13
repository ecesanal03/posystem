import axios from './axiosInstance';

// In-memory cache for categories
let categoriesCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

const categoryApi = {
  getCategories: async (params = {}, useCache = true) => {
    try {
      // Check cache first if useCache is true
      const now = Date.now();
      if (useCache && categoriesCache && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
        return categoriesCache;
      }

      const response = await axios.get('/categories', { params });
      
      // Update cache
      categoriesCache = response.data;
      cacheTimestamp = now;
      
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      
      // Return cache if available even on error
      if (categoriesCache) {
        return categoriesCache;
      }
      
      return { categories: [] };
    }
  },
  
  // Force refresh the categories cache
  refreshCategories: async () => {
    try {
      const response = await axios.get('/categories');
      categoriesCache = response.data;
      cacheTimestamp = Date.now();
      return response.data;
    } catch (error) {
      console.error('Error refreshing categories:', error);
      return { categories: [] };
    }
  }
};

export default categoryApi; 
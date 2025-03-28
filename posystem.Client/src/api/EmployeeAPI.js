import axios from 'axios';

/**
 * Base URL for the backend API.
 * The backend is running on HTTPS port 5001 for secure communication.
 */
const API_URL = 'https://localhost:5001';

/**
 * Axios request interceptor for debugging API requests.
 * Logs request details including URL, method, data, and headers.
 */
axios.interceptors.request.use(request => {
    console.log('Starting Request:', {
        url: request.url,
        method: request.method,
        data: request.data,
        headers: request.headers
    });
    return request; // Make sure to return the request
});

/**
 * Axios response interceptor for debugging API responses.
 * Logs response details including status and data.
 * Also handles and logs error responses.
 */
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
 * API endpoints for employee operations.
 * These functions handle all CRUD operations for employees.
 */
const employeeApi = {
    /**
     * Retrieves a list of employees with optional filtering and pagination.
     * @param {Object} params - Query parameters including searchTerm, sortBy, sortDesc, skip, take
     * @returns {Promise<Object>} Response containing employees and total count
     */
    getEmployees: async (params = {}) => {
        try {
            // Set reasonable defaults
            const queryParams = {
                searchTerm: params.searchTerm || '',
                sortBy: params.sortBy || '',
                sortDesc: params.sortDesc || false,
                skip: params.skip || 0,
                take: params.take || 20
            };
            
            const response = await axios.get(`${API_URL}/employees`, { params: queryParams });
            
            // Ensure we have a valid response with employees array
            if (response.data && Array.isArray(response.data.employees)) {
                console.log('Processing employees from response:', response.data.employees);
                
                const processedEmployees = response.data.employees.map(employee => {
                    // Normalize property names to ensure consistent capitalization
                    return {
                        // Prioritize capitalized keys, then lowercase keys
                        Id: employee.Id || employee.id,
                        Name: employee.Name || employee.name,
                        Email: employee.Email || employee.email,
                        Role: employee.Role || employee.role,
                        Start_Date: employee.Start_Date || employee.start_Date,
                        Status: employee.Status || employee.status
                    };
                });
                
                console.log('Processed employees:', processedEmployees);
                
                return {
                    employees: processedEmployees,
                    totalCount: response.data.totalCount || 0
                };
            }
            
            // Handle case where response doesn't have expected structure
            console.warn('Unexpected API response format:', response.data);
            return { employees: [], totalCount: 0 };
        } catch (error) {
            console.error('Error fetching employees:', error);
            throw error;
        }
    },

    /**
     * Retrieves a single employee by ID.
     * @param {string} id - The unique identifier of the employee
     * @returns {Promise<Object>} Response containing the employee details
     */
    getEmployee: async (id) => {
        try {
            console.log('Fetching employee with ID:', id);
            
            // Ensure the id is sent properly as a valid GUID string
            // ServiceStack requires the id parameter to match the case of the DTO property
            const params = { Id: id };
            console.log('Using params:', params);
            
            const response = await axios.get(`${API_URL}/employee`, { params });
            
            console.log('Raw API response:', response);
            console.log('Response data:', response.data);
            
            if (response.data && response.data.employee) {
                console.log('Employee data found:', response.data.employee);
                return response.data.employee;
            }
            
            console.log('No employee data found in response');
            return null;
        } catch (error) {
            console.error(`Error fetching employee with ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * Creates a new employee in the system.
     * @param {Object} employeeData - The employee data to create
     * @returns {Promise<Object>} Response indicating success/failure of the creation
     */
    createEmployee: async (employeeData) => {
        try {
            console.log('Creating employee with data:', employeeData);
            
            // Create a copy of the data to avoid modifying the original object
            const formattedData = { ...employeeData };
            
            // Format DateOfBirth - required field that must be a valid date
            if (formattedData.DateOfBirth) {
                try {
                    const date = new Date(formattedData.DateOfBirth);
                    if (!isNaN(date.getTime())) {
                        formattedData.DateOfBirth = date.toISOString();
                        console.log('Formatted DateOfBirth:', formattedData.DateOfBirth);
                    } else {
                        // If it's an invalid date, default to today
                        console.warn('Invalid date detected in DateOfBirth, using current date');
                        formattedData.DateOfBirth = new Date().toISOString();
                    }
                } catch (err) {
                    console.error('Error formatting DateOfBirth:', err);
                    // If parsing fails, use current date as fallback
                    formattedData.DateOfBirth = new Date().toISOString();
                }
            } else {
                // DateOfBirth is required in database, default to today
                formattedData.DateOfBirth = new Date().toISOString();
                console.log('No DateOfBirth provided, defaulting to current date');
            }
            
            // Add EmploymentStartDate if not present (required field)
            if (!formattedData.EmploymentStartDate) {
                formattedData.EmploymentStartDate = new Date().toISOString();
                console.log('Set EmploymentStartDate:', formattedData.EmploymentStartDate);
            } else {
                try {
                    const date = new Date(formattedData.EmploymentStartDate);
                    if (!isNaN(date.getTime())) {
                        formattedData.EmploymentStartDate = date.toISOString();
                    } else {
                        formattedData.EmploymentStartDate = new Date().toISOString();
                    }
                } catch (err) {
                    console.error('Error formatting EmploymentStartDate:', err);
                    formattedData.EmploymentStartDate = new Date().toISOString();
                }
            }
            
            // Remove Id field if it's empty (backend will generate one)
            if (!formattedData.Id || formattedData.Id === '') {
                delete formattedData.Id;
            }
            
            // Log the final request before sending
            console.log('Sending formatted data to API:', formattedData);
            
            const response = await axios.post(`${API_URL}/employee/employeeRegistration`, formattedData);
            return response.data;
        } catch (error) {
            console.error('Error creating employee:', error);
            throw error;
        }
    },

    /**
     * Updates an existing employee in the system.
     * @param {Object} employeeData - The employee data to update
     * @returns {Promise<Object>} Response indicating success/failure of the update
     */
    updateEmployee: async (employeeData) => {
        try {
            console.log('Updating employee with ID:', employeeData.Id, 'Data:', employeeData);
            
            // Create a copy of the data to avoid modifying the original object
            const formattedData = { ...employeeData };
            
            // Format DateOfBirth to a string that can be parsed by C# DateTime
            if (formattedData.DateOfBirth) {
                try {
                    // Parse the date string to ensure it's valid
                    const date = new Date(formattedData.DateOfBirth);
                    if (!isNaN(date.getTime())) {
                        // Use yyyy-MM-dd format for update DTO which expects a string
                        formattedData.DateOfBirth = date.toISOString().split('T')[0];
                        console.log('Formatted DateOfBirth for update:', formattedData.DateOfBirth);
                    } else {
                        console.warn('Invalid date detected, removing DateOfBirth field');
                        delete formattedData.DateOfBirth;
                    }
                } catch (err) {
                    console.error('Error formatting DateOfBirth:', err);
                    delete formattedData.DateOfBirth;
                }
            }
            
            console.log('Sending formatted data to API for update:', formattedData);
            const response = await axios.put(`${API_URL}/employee`, formattedData);
            return response.data;
        } catch (error) {
            console.error(`Error updating employee:`, error);
            throw error;
        }
    },

    /**
     * Deletes an employee from the system.
     * @param {string} id - The unique identifier of the employee to delete
     * @returns {Promise<Object>} Response indicating success/failure of the deletion
     */
    deleteEmployee: async (id) => {
        try {
            console.log('Deleting employee with ID:', id);
            // Ensure the id is sent properly as a valid GUID string
            // ServiceStack requires the id parameter to match the case of the DTO property
            const params = { Id: id };
            console.log('Using params:', params);
            
            const response = await axios.delete(`${API_URL}/employee`, { params });
            return response.data;
        } catch (error) {
            console.error(`Error deleting employee with ID ${id}:`, error);
            throw error;
        }
    }
};

export default employeeApi;

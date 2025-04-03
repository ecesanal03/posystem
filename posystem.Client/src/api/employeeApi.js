import axios from './axiosInstance';


const employeeApi = {
  login: async (email, password) => {
    try {
      const response = await axios.post('/employee/employeeLogin', { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  },


  getEmployees: async (params = {}) => {
    try {
      const queryParams = {
        skip: params.skip || 0,
        take: params.take || 20
      };

      const response = await axios.get('/employee/getall', { params: queryParams });

      if (response.data && Array.isArray(response.data.employees)) {
        const processedEmployees = response.data.employees.map(employee => ({
          Id: employee.Id || employee.id,
          Name: employee.Name || employee.name,
          Email: employee.Email || employee.email,
          Role: employee.Role || employee.role,
          Start_Date: employee.Start_Date || employee.start_Date,
          Status: employee.Status || employee.status
        }));

        return {
          employees: processedEmployees,
          totalCount: response.data.totalCount || 0
        };
      }

      console.warn('Unexpected API response format:', response.data);
      return { employees: [], totalCount: 0 };
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  getEmployee: async (id) => {
    try {
      const response = await axios.get('/employee', {
        params: { Id: id }
      });

      return response.data?.employee || null;
    } catch (error) {
      console.error(`Error fetching employee with ID ${id}:`, error);
      throw error;
    }
  },


  createEmployee: async (employeeData) => {
    try {
      const formattedData = { ...employeeData };

      // Ensure valid DateOfBirth
      formattedData.DateOfBirth = formatToIsoDate(formattedData.DateOfBirth);

      // Set EmploymentStartDate if not provided
      formattedData.EmploymentStartDate = formatToIsoDate(formattedData.EmploymentStartDate);

      // Remove empty Id to allow backend to generate it
      if (!formattedData.Id) delete formattedData.Id;

      const response = await axios.post('/employee/employeeRegistration', formattedData);
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  updateEmployee: async (employeeData) => {
    try {
      const formattedData = { ...employeeData };

      if (formattedData.DateOfBirth) {
        const date = new Date(formattedData.DateOfBirth);
        if (!isNaN(date.getTime())) {
          formattedData.DateOfBirth = date.toISOString().split('T')[0];
        } else {
          delete formattedData.DateOfBirth;
        }
      }

      const response = await axios.put('/employee', formattedData);
      return response.data;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  },


  deleteEmployee: async (id) => {
    try {
      const response = await axios.delete('/employee', {
        params: { Id: id }
      });
      return response.data;
    } catch (error) {
      console.error(`Error deleting employee with ID ${id}:`, error);
      throw error;
    }
  }
};


function formatToIsoDate(value) {
  try {
    const date = new Date(value);
    if (!isNaN(date.getTime())) return date.toISOString();
  } catch (error) {
    console.warn('Error formatting date:', error);
  }
  return new Date().toISOString();
}

export default employeeApi;

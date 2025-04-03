import { useState, useEffect } from 'react';
import { 
  Box, 
  TextField,
  Button,
  Paper,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';

// Import the separated components
import CustomersTable from './CustomersTable';
import EmployeeTable from './EmployeeTable';
import EmployeeForm from './EmployeeForm';
import customerApi from '../../../../api/customerApi';
import employeeApi from '../../../../api/employeeApi';

const AccountsSection = () => {
  // State management for data
  const [activeTab, setActiveTab] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form state
  const [customerFilter, setCustomerFilter] = useState('');
  const [debouncedCustomerFilter, setDebouncedCustomerFilter] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [debouncedEmployeeFilter, setDebouncedEmployeeFilter] = useState('');
  const [newEmployee, setNewEmployee] = useState({
    FirstName: '',
    MiddleName: '',
    LastName: '',
    Email: '',
    DateOfBirth: '',
    PhoneNumber: '',
    Password: '',
    AddressLineOne: '',
    AddressLineTwo: '',
    City: '',
    State: '',
    ZipCode: '',
    Country: '',
    Role: 'cashier',
    IsActive: true
  });

  // UI state
  const [deleteCustomerDialog, setDeleteCustomerDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const [deleteEmployeeDialog, setDeleteEmployeeDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditingEmployee, setIsEditingEmployee] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Debounced filter changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCustomerFilter(customerFilter);
    }, 500); // 500ms debounce
    
    return () => {
      clearTimeout(handler);
    };
  }, [customerFilter]);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedEmployeeFilter(employeeFilter);
    }, 500); // 500ms debounce
    
    return () => {
      clearTimeout(handler);
    };
  }, [employeeFilter]);

  // Effect to fetch data when tab changes or debounced filter changes
  useEffect(() => {
    if (activeTab === 0) {
      fetchCustomers();
    } else {
      fetchEmployees();
    }
  }, [activeTab, debouncedCustomerFilter, debouncedEmployeeFilter]);

  // Apply client-side filtering after customers are loaded
  useEffect(() => {
    if (!customers.length) {
      setFilteredCustomers([]);
      return;
    }
    
    const searchTerm = customerFilter.trim().toLowerCase();
    
    if (!searchTerm) {
      setFilteredCustomers(customers);
      return;
    }
    
    const filtered = customers.filter(customer => 
      (customer.Id?.toString().toLowerCase().includes(searchTerm)) ||
      (customer.Name?.toLowerCase().includes(searchTerm)) ||
      (customer.Email?.toLowerCase().includes(searchTerm))
    );
    
    setFilteredCustomers(filtered);
  }, [customers, customerFilter]);

  // Apply client-side filtering for employees after they are loaded
  useEffect(() => {
    if (!employees.length) {
      setFilteredEmployees([]);
      return;
    }
    
    const searchTerm = employeeFilter.trim().toLowerCase();
    
    if (!searchTerm) {
      setFilteredEmployees(employees);
      return;
    }
    
    const filtered = employees.filter(employee => 
      (employee.Id?.toString().toLowerCase().includes(searchTerm)) ||
      (employee.Name?.toLowerCase().includes(searchTerm)) ||
      (employee.Email?.toLowerCase().includes(searchTerm)) ||
      (employee.Role?.toLowerCase().includes(searchTerm))
    );
    
    setFilteredEmployees(filtered);
  }, [employees, employeeFilter]);

  // Let the backend handle filtering, pagination, and data transformation
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        skip: 0,
        take: 100 // Get more records for client-side filtering
      };

      const response = await customerApi.getCustomers(params);
      
      if (response.customers) {
        setCustomers(response.customers);
        // Initial filtering will be done by the useEffect
      } else {
        setError('Failed to load customers. Unexpected response format.');
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err);
      setError('Failed to load customers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees with pagination but without relying on backend filtering
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        skip: 0,
        take: 100 // Get more records for client-side filtering
      };

      const response = await employeeApi.getEmployees(params);
      
      if (response.employees) {
        setEmployees(response.employees);
        // Initial filtering will be done by the useEffect
      } else {
        setError('Failed to load employees. Unexpected response format.');
      }
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      setError('Failed to load employees. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerFilterChange = (e) => {
    setCustomerFilter(e.target.value);
  };

  const handleDeleteCustomer = (customer) => {
    setSelectedCustomer(customer);
    setDeleteCustomerDialog(true);
  };

  const confirmDeleteCustomer = async () => {
    if (selectedCustomer) {
      try {
        setLoading(true);
        const response = await customerApi.deleteCustomer(selectedCustomer);

        if (response && response.success) {
          setNotification({
            open: true,
            message: 'Customer deleted successfully',
            severity: 'success'
          });
          // Refresh the customer list
          fetchCustomers();
        } else {
          setNotification({
            open: true,
            message: response.message || 'Failed to delete customer',
            severity: 'error'
          });
        }
      } catch (err) {
        console.error('Failed to delete customer:', err);
        setNotification({
          open: true,
          message: 'Failed to delete customer. Please try again.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
        setDeleteCustomerDialog(false);
      }
    }
  };

  // Employee Functionality
  const handleEmployeeFilterChange = (e) => {
    setEmployeeFilter(e.target.value);
  };

  const handleDeleteEmployee = (employee) => {
    setSelectedEmployee(employee);
    setDeleteEmployeeDialog(true);
  };

  const handleEditEmployee = async (employee) => {
    try {
      setLoading(true);
      //console.log('Editing employee with ID:', employee.Id);
      const employeeDetails = await employeeApi.getEmployee(employee.Id);
      
      //console.log('Received from API:', employeeDetails);
      
      if (!employeeDetails) {
        console.error('No employee details returned from API');
        throw new Error("Failed to retrieve employee details - empty response");
      }
      
      // Since the API seems to return a mix of camelCase and snake_case, we'll handle it flexibly
      const normalizedData = {
        Id: employeeDetails.Id || employeeDetails.id || '',
        FirstName: employeeDetails.First_Name || employeeDetails.first_Name || employeeDetails.firstName || employeeDetails.FirstName || '',
        MiddleName: employeeDetails.Middle_Name || employeeDetails.middle_Name || employeeDetails.middleName || employeeDetails.MiddleName || '',
        LastName: employeeDetails.Last_Name || employeeDetails.last_Name || employeeDetails.lastName || employeeDetails.LastName || '',
        Email: employeeDetails.Email || employeeDetails.email || '',
        PhoneNumber: employeeDetails.PhoneNumber || employeeDetails.phoneNumber || '',
        Password: '', // Don't populate password
        // Format date properly or set to empty string if undefined
        DateOfBirth: employeeDetails.DateOfBirth || employeeDetails.dateOfBirth ? 
          (typeof (employeeDetails.DateOfBirth || employeeDetails.dateOfBirth) === 'string' ? 
            (employeeDetails.DateOfBirth || employeeDetails.dateOfBirth).split('T')[0] : 
            new Date(employeeDetails.DateOfBirth || employeeDetails.dateOfBirth).toISOString().split('T')[0]) : 
          '',
        AddressLineOne: employeeDetails.AddressLineOne || employeeDetails.addressLineOne || '',
        AddressLineTwo: employeeDetails.AddressLineTwo || employeeDetails.addressLineTwo || '',
        City: employeeDetails.City || employeeDetails.city || '',
        State: employeeDetails.State || employeeDetails.state || '',
        ZipCode: employeeDetails.ZipCode || employeeDetails.zipCode || '',
        Country: employeeDetails.Country || employeeDetails.country || '',
        Role: employeeDetails.Role || employeeDetails.role || 'cashier',
        IsActive: employeeDetails.IsActive !== undefined ? employeeDetails.IsActive : 
                  employeeDetails.isActive !== undefined ? employeeDetails.isActive : true
      };
      
      //console.log("Normalized employee data:", normalizedData);
      setNewEmployee(normalizedData);
      setIsEditingEmployee(true);
      setShowAddEmployeeForm(true);
    } catch (err) {
      console.error('Failed to load employee details:', err);
      setNotification({
        open: true,
        message: 'Failed to load employee details. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteEmployee = async () => {
    if (selectedEmployee) {
      try {
        setLoading(true);
        const response = await employeeApi.deleteEmployee(selectedEmployee.Id);

        if (response && response.success) {
          setNotification({
            open: true,
            message: 'Employee deleted successfully',
            severity: 'success'
          });
          // Refresh the employee list
          fetchEmployees();
        } else {
          setNotification({
            open: true,
            message: response.message || 'Failed to delete employee',
            severity: 'error'
          });
        }
      } catch (err) {
        console.error('Failed to delete employee:', err);
        setNotification({
          open: true,
          message: 'Failed to delete employee. Please try again.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
        setDeleteEmployeeDialog(false);
      }
    }
  };

  const handleEmployeeCancel = () => {
    setShowAddEmployeeForm(false);
    setIsEditingEmployee(false);
    setNewEmployee({
      FirstName: '',
      MiddleName: '',
      LastName: '',
      Email: '',
      DateOfBirth: '',
      PhoneNumber: '',
      Password: '',
      AddressLineOne: '',
      AddressLineTwo: '',
      City: '',
      State: '',
      ZipCode: '',
      Country: '',
      Role: 'cashier',
      IsActive: true
    });
  };

  const addEmployee = async (formData) => {
    // If formData is provided, we're submitting the form
    if (formData) {
      try {
        setLoading(true);
        //console.log('Received form data from EmployeeForm:', formData);
        
        // Save the form data to state for potential future use
        setNewEmployee(formData);
        
        let response;
        
        if (isEditingEmployee) {
          // Update existing employee
          //console.log('Updating employee with data:', formData);
          response = await employeeApi.updateEmployee(formData);
          if (response && response.success) {
            setNotification({
              open: true,
              message: 'Employee updated successfully',
              severity: 'success'
            });
          } else {
            throw new Error(response?.message || 'Failed to update employee');
          }
        } else {
          // Add new employee
          //console.log('Creating new employee with data:', formData);
          response = await employeeApi.createEmployee(formData);
          if (response && response.result === 'Success') {
            setNotification({
              open: true,
              message: 'Employee added successfully',
              severity: 'success'
            });
          } else {
            throw new Error(response?.message || 'Failed to add employee');
          }
        }
        
        // Reset form and refresh list
        handleEmployeeCancel();
        fetchEmployees();
      } catch (err) {
        console.error('Employee operation failed:', err);
        setNotification({
          open: true,
          message: err.message || 'Operation failed. Please try again.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    } 
    // If no formData, we're just showing the form (from the Add Employee button)
    else {
      // Show the form for adding a new employee
      setIsEditingEmployee(false);
      setShowAddEmployeeForm(true);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Tabs */}
      <Paper 
        elevation={0} 
        sx={{ 
          width: '40%', 
          maxWidth: '300px', 
          mb: 3, 
          bgcolor: '#1E1E1E',
          borderBottom: '1px solid #61677A',
          overflow: 'hidden'
        }}
      >
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="inherit"
          variant="fullWidth"
          centered
          sx={{
            '& .MuiTab-root': { 
              color: '#D8D9DA',
              fontSize: '1rem',
              fontWeight: 500,
              '&.Mui-selected': { 
                color: '#FFFFFF'
              }
            },
            '& .MuiTabs-indicator': { 
              backgroundColor: '#4dabf5',
              height: 3
            }
          }}
        >
          <Tab label="CUSTOMERS" />
          <Tab label="EMPLOYEES" />
        </Tabs>
      </Paper>

      {/* Employee Add Form (Only in Employee Tab) */}
      {activeTab === 1 && showAddEmployeeForm && (
        <Paper elevation={0} sx={{ 
          p: 3, 
          mb: 3, 
          bgcolor: '#1E201E',
          borderRadius: 1,
          width: '100%',
          maxWidth: '800px',
          mx: 'auto'
        }}>
          <EmployeeForm 
            employee={newEmployee}
            onSave={addEmployee}
            onCancel={handleEmployeeCancel}
          />
        </Paper>
      )}

      {/* Search Controls */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          width: '60%', 
          maxWidth: '1200px', 
          mb: 3 
        }}
      >
        <TextField
          placeholder={activeTab === 0 ? "Search Customers" : "Search Employees"}
          size="small"
          value={activeTab === 0 ? customerFilter : employeeFilter}
          onChange={activeTab === 0 ? handleCustomerFilterChange : handleEmployeeFilterChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'white' }} />
              </InputAdornment>
            ),
            style: { color: 'white' }
          }}
          sx={{ 
            width: activeTab === 0 ? '100%' : '70%',
            bgcolor: '#2A2D2A',
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
              borderColor: '#61677A',
              '& fieldset': {
                borderColor: '#61677A',
              },
            },
            '& .MuiOutlinedInput-input': {
              color: 'white'
            }
          }}
        />
        {activeTab === 1 && (
          <Box sx={{ display: 'flex', gap: 0, ml: 2 }}>
            {showAddEmployeeForm && (
              <Button
                variant="outlined"
                size="medium"
                onClick={handleEmployeeCancel}
                sx={{ 
                  minWidth: 100,
                  borderColor: '#61677A',
                  color: '#D8D9DA',
                  '&:hover': {
                    borderColor: '#6D7386',
                    bgcolor: 'rgba(109, 115, 134, 0.1)'
                  }
                }}
              >
                CANCEL
              </Button>
            )}
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => addEmployee()}
              sx={{ 
                minWidth: 180,
                bgcolor: '#61677A',
                color: 'white',
                '&:hover': {
                  bgcolor: '#6D7386'
                },
                ml: 2
              }}
            >
              {isEditingEmployee ? 'UPDATE EMPLOYEE' : 'ADD EMPLOYEE'}
            </Button>
          </Box>
        )}
      </Box>

      {loading && !showAddEmployeeForm && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Content based on active tab */}
      {activeTab === 0 ? (
        <CustomersTable 
          customers={filteredCustomers} 
          onDelete={handleDeleteCustomer} 
        />
      ) : (
        <EmployeeTable 
          employees={filteredEmployees} 
          onEdit={handleEditEmployee} 
          onDelete={handleDeleteEmployee} 
        />
      )}

      {/* Delete Customer Dialog */}
      <Dialog
        open={deleteCustomerDialog}
        onClose={() => setDeleteCustomerDialog(false)}
        PaperProps={{ style: { backgroundColor: '#2A2D2A', color: 'white' } }}
      >
        <DialogTitle>Delete Customer Account</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'white' }}>
            Delete account for {selectedCustomer?.Email}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteCustomerDialog(false)}
            sx={{ color: '#90caf9' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDeleteCustomer} 
            disabled={loading}
            sx={{ 
              color: '#ff6b6b',
              '&:hover': { bgcolor: 'rgba(255, 107, 107, 0.1)' }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Employee Dialog */}
      <Dialog
        open={deleteEmployeeDialog}
        onClose={() => setDeleteEmployeeDialog(false)}
        PaperProps={{ style: { backgroundColor: '#2A2D2A', color: 'white' } }}
      >
        <DialogTitle>Delete Employee Account</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'white' }}>
            Are you sure you want to delete the employee account for {selectedEmployee?.Name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteEmployeeDialog(false)}
            sx={{ color: '#90caf9' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDeleteEmployee} 
            disabled={loading}
            sx={{ 
              color: '#ff6b6b',
              '&:hover': { bgcolor: 'rgba(255, 107, 107, 0.1)' }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountsSection;

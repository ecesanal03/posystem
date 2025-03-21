import { useState } from 'react';
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
  Tab
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';

// Import the separated components
import CustomersTable from './CustomersTable';
import EmployeeTable from './EmployeeTable';
import EmployeeForm from './EmployeeForm';

const AccountsSection = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState(0);
  
  // Customer accounts data state
  const [customers, setCustomers] = useState([
    { 
      id: 1,
      user_id: "CUS1001", 
      name: "John Doe", 
      email: "john.doe@example.com",
      phone: "555-123-4567",
      address: "123 Main St, Anytown, USA",
      registration_date: "2023-01-15",
      orders_count: 12,
      total_spent: 678.45
    },
    { 
      id: 2,
      user_id: "CUS1002", 
      name: "Sarah Johnson", 
      email: "sarah.j@example.com",
      phone: "555-987-6543",
      address: "456 Oak Ave, Somewhere, USA",
      registration_date: "2023-02-28",
      orders_count: 5,
      total_spent: 321.75
    },
    { 
      id: 3,
      user_id: "CUS1003", 
      name: "Michael Brown", 
      email: "mike.brown@example.com",
      phone: "555-555-5555",
      address: "789 Pine St, Nowhere, USA",
      registration_date: "2023-03-10",
      orders_count: 8,
      total_spent: 492.30
    }
  ]);
  
  // Employee accounts data state
  const [employees, setEmployees] = useState([
    { 
      id: 1,
      employee_id: "EMP001", 
      name: "Robert Smith", 
      email: "robert.smith@posystem.com",
      phone: "555-111-2222",
      address: "123 Admin St, Management, USA",
      role: "admin",
      start_date: "2022-01-10",
      active: true
    },
    { 
      id: 2,
      employee_id: "EMP002", 
      name: "Jennifer Williams", 
      email: "jennifer.w@posystem.com",
      phone: "555-333-4444",
      address: "456 Manager Ave, Direction, USA",
      role: "manager",
      start_date: "2022-03-15",
      active: true
    },
    { 
      id: 3,
      employee_id: "EMP003", 
      name: "David Johnson", 
      email: "david.j@posystem.com",
      phone: "555-666-7777",
      address: "789 Register St, Sales, USA",
      role: "cashier",
      start_date: "2022-06-20",
      active: false
    }
  ]);
  
  // Form state
  const [customerFilter, setCustomerFilter] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: '',
    department: '',
    status: 'Active'
  });

  // UI state
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const [employeeValidationErrors, setEmployeeValidationErrors] = useState({});
  const [deleteCustomerDialog, setDeleteCustomerDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deleteEmployeeDialog, setDeleteEmployeeDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditingEmployee, setIsEditingEmployee] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCustomerFilterChange = (e) => {
    setCustomerFilter(e.target.value);
  };

  const handleEmployeeFilterChange = (e) => {
    setEmployeeFilter(e.target.value);
  };

  const handleNewEmployeeChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmployee = (employee) => {
    const errors = {};
    
    if (!employee.name.trim()) errors.name = 'Name is required';
    if (!employee.email.trim()) errors.email = 'Email is required';
    if (!employee.phone.trim()) errors.phone = 'Phone is required';
    if (!employee.role.trim()) errors.role = 'Role is required';
    if (!employee.department.trim()) errors.department = 'Department is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (employee.email && !emailRegex.test(employee.email)) {
      errors.email = 'Valid email is required';
    }
    
    return errors;
  };

  const handleEditEmployee = (employee) => {
    setEmployeeToEdit(employee);
    setNewEmployee({
      name: employee.name,
      email: employee.email,
      phone: employee.phone || '',
      address: employee.address || '',
      role: employee.role || '',
      department: employee.department || '',
      status: employee.status || 'Active'
    });
    setIsEditingEmployee(true);
    setShowAddEmployeeForm(true);
    setEmployeeValidationErrors({});
  };

  const handleDeleteCustomer = (customer) => {
    setSelectedCustomer(customer);
    setDeleteCustomerDialog(true);
  };

  const confirmDeleteCustomer = () => {
    if (selectedCustomer) {
      setCustomers((prev) => prev.filter((customer) => customer.id !== selectedCustomer.id));
      setDeleteCustomerDialog(false);
      setSelectedCustomer(null);
    }
  };

  const handleDeleteEmployee = (employee) => {
    setSelectedEmployee(employee);
    setDeleteEmployeeDialog(true);
  };

  const confirmDeleteEmployee = () => {
    if (selectedEmployee) {
      setEmployees((prev) => prev.filter((employee) => employee.id !== selectedEmployee.id));
      setDeleteEmployeeDialog(false);
      setSelectedEmployee(null);
    }
  };

  const handleEmployeeCancel = () => {
    setShowAddEmployeeForm(false);
    setIsEditingEmployee(false);
    setEmployeeToEdit(null);
    setNewEmployee({
      name: '',
      email: '',
      phone: '',
      address: '',
      role: '',
      department: '',
      status: 'Active'
    });
    setEmployeeValidationErrors({});
  };

  const addEmployee = () => {
    if (showAddEmployeeForm) {
      // Validate required fields
      const errors = validateEmployee(newEmployee);
      setEmployeeValidationErrors(errors);
      
      // If there are validation errors, don't add/update the employee
      if (Object.keys(errors).length > 0) {
        return;
      }
      
      // All validation passed, add or update the employee
      if (isEditingEmployee && employeeToEdit) {
        // Update existing employee
        const updatedEmployee = {
          ...employeeToEdit,
          name: newEmployee.name,
          email: newEmployee.email,
          phone: newEmployee.phone,
          address: newEmployee.address,
          role: newEmployee.role,
          department: newEmployee.department,
          status: newEmployee.status,
          updated_at: new Date()
        };
        
        setEmployees((prev) => prev.map((employee) => 
          employee.id === employeeToEdit.id ? updatedEmployee : employee
        ));
        setIsEditingEmployee(false);
        setEmployeeToEdit(null);
      } else {
        // Add new employee
        const employeeToAdd = {
          id: employees.length + 1 + 100,
          employee_id: `EMP${Math.floor(1000 + Math.random() * 9000)}`,
          name: newEmployee.name,
          email: newEmployee.email,
          phone: newEmployee.phone,
          address: newEmployee.address,
          hire_date: new Date().toISOString(),
          role: newEmployee.role,
          department: newEmployee.department,
          status: newEmployee.status,
          added_at: new Date()
        };
        
        setEmployees((prev) => [...prev, employeeToAdd]);
      }
      
      // Reset form
      setNewEmployee({
        name: '',
        email: '',
        phone: '',
        address: '',
        role: '',
        department: '',
        status: 'Active'
      });
      setEmployeeValidationErrors({});
      setShowAddEmployeeForm(false);
    } else {
      // Show the form for adding a new employee
      setIsEditingEmployee(false);
      setEmployeeToEdit(null);
      setShowAddEmployeeForm(true);
      setEmployeeValidationErrors({});
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(customerFilter.toLowerCase()) ||
    customer.email.toLowerCase().includes(customerFilter.toLowerCase()) ||
    customer.user_id.toLowerCase().includes(customerFilter.toLowerCase())
  );

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(employeeFilter.toLowerCase()) ||
    employee.email.toLowerCase().includes(employeeFilter.toLowerCase()) ||
    employee.employee_id.toLowerCase().includes(employeeFilter.toLowerCase()) ||
    employee.role.toLowerCase().includes(employeeFilter.toLowerCase()) ||
    employee.department.toLowerCase().includes(employeeFilter.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
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
            newEmployee={newEmployee}
            handleNewEmployeeChange={handleNewEmployeeChange}
            employeeValidationErrors={employeeValidationErrors}
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
              onClick={addEmployee}
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
            Are you sure you want to delete the account for {selectedCustomer?.name}? This action cannot be undone.
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
            sx={{ color: '#ff6b6b' }} 
            autoFocus
          >
            Delete
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
            Are you sure you want to delete the employee account for {selectedEmployee?.name}? This action cannot be undone.
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
            sx={{ color: '#ff6b6b' }} 
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountsSection;

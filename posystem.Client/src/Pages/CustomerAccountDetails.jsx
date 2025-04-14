import * as React from 'react';
import { Container, Grid, Paper, Typography, TextField, Button, Tabs, Tab, Box, AppBar, Toolbar, IconButton, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, TablePagination } from '@mui/material';
import { AccountCircle, ArrowBack, Edit as EditIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import customerApi from '../api/customerApi';
import invoicesApi from '../api/invoicesApi';

const AccountDetails = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, password } = location.state || {};
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    FirstName: '',
    MiddleName: '',
    LastName: '',
    Email: email,
    Password: password,
    PhoneNumber: '',
    AddressLineOne: '',
    AddressLineTwo: '',
    City: '',
    State: '',
    ZipCode: '',
    Country: '',
    DateOfBirth: null
  });
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [userID, setUserID] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [invoicesLoading, setInvoicesLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    fetchData();
    if (activeTab === 1) {
      fetchOrders();
    } else if (activeTab === 2) {
      fetchInvoices();
    }
  }, [navigate, location.pathname, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching profile data...');
      const customerProfile = await customerApi.getMyProfile();
      console.log('Received profile:', customerProfile);
      
      if (customerProfile) {
        setFormData({
          FirstName: customerProfile.first_Name || '',
          MiddleName: customerProfile.middle_Name || '',
          LastName: customerProfile.last_Name || '',
          Email: customerProfile.email || '',
          PhoneNumber: customerProfile.phoneNumber || '',
          AddressLineOne: customerProfile.addressLineOne || '',
          AddressLineTwo: customerProfile.addressLineTwo || '',
          City: customerProfile.city || '',
          State: customerProfile.state || '',
          ZipCode: customerProfile.zipCode || '',
          Country: customerProfile.country || '',
          DateOfBirth: customerProfile.dateOfBirth ? new Date(customerProfile.dateOfBirth) : null
        });
      }
    } catch (error) {
      console.error("Error fetching customer profile:", error);
      if (error.response?.status === 401) {
        // Token might be expired or invalid
        localStorage.removeItem('authToken');
        navigate('/login', { state: { from: location.pathname } });
      } else {
        setNotification({
          open: true,
          message: 'Failed to load profile information',
          severity: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      console.log('Starting to fetch orders...');
      
      const response = await customerApi.getMyOrders(page * rowsPerPage, rowsPerPage);
      
      if (response && (response.Orders || response.orders)) {
        const ordersArray = response.Orders || response.orders;
        const userEmail = formData.Email; // Get the logged-in user's email from formData
        
        // Filter orders to only show those matching the user's email
        const filteredOrders = ordersArray.filter(order => 
          (order.Customer_Email || order.customer_Email)?.toLowerCase() === userEmail?.toLowerCase()
        );
        
        const mappedOrders = filteredOrders.map(order => ({
          id: order.Id || order.id,
          order_Date: order.Order_Date || order.order_Date,
          delivery_Date: order.Delivery_Date || order.delivery_Date,
          order_Status: order.Order_Status || order.order_Status,
          total_Amount: order.Total_Amount || order.total_Amount,
          customer_Email: order.Customer_Email || order.customer_Email
        }));
        
        console.log(`Found ${mappedOrders.length} orders for user ${userEmail}`);
        setOrders(mappedOrders);
        setTotalCount(response.totalCount);
      } else {
        console.log('No orders found, setting empty array');
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setNotification({
        open: true,
        message: 'Failed to load order history',
        severity: 'error'
      });
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      setInvoicesLoading(true);
      console.log('Starting to fetch invoices...');
      
      const response = await invoicesApi.getMyInvoices({
        skip: page * rowsPerPage,
        take: rowsPerPage,
        sortBy: 'Invoice_Date',
        sortDesc: true
      });
      
      if (response && response.invoices) {
        console.log(`Found ${response.invoices.length} invoices`);
        setInvoices(response.invoices);
        setTotalCount(response.totalCount);
      } else {
        console.log('No invoices found, setting empty array');
        setInvoices([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setNotification({
        open: true,
        message: 'Failed to load invoice history',
        severity: 'error'
      });
    } finally {
      setInvoicesLoading(false);
    }
  };

  // Update useEffect to refetch when pagination changes
  useEffect(() => {
    if (activeTab === 2) {
      fetchInvoices();
    }
  }, [activeTab, page, rowsPerPage]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Format the data to match UpdateMyProfileDTO
      const updateData = {
        firstName: formData.FirstName,
        middleName: formData.MiddleName,
        lastName: formData.LastName,
        phoneNumber: formData.PhoneNumber,
        dateOfBirth: formData.DateOfBirth,
        addressLineOne: formData.AddressLineOne,
        addressLineTwo: formData.AddressLineTwo,
        city: formData.City,
        state: formData.State,
        zipCode: formData.ZipCode,
        country: formData.Country
      };

      await customerApi.updateMyProfile(updateData);
      setIsEditing(false);
      setNotification({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success'
      });
      
      // Navigate to homepage after successful update
      setTimeout(() => {
        navigate('/');
      }, 1500); // Wait 1.5 seconds so user can see the success message
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Failed to update profile',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const goBack = () => {
    navigate('/'); // Navigate back to the previous page
  };

  // Helper function to safely format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      // Parse the date string from the backend
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error('Invalid date string:', dateString);
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'Invalid Date';
    }
  };

  const states = [
    { code: 'CA', name: 'California' },
    { code: 'NY', name: 'New York' },
    { code: 'TX', name: 'Texas' },
    { code: 'FL', name: 'Florida' },
    { code: 'IL', name: 'Illinois' },
    { code: 'OH', name: 'Ohio' },
    { code: 'MI', name: 'Michigan' },
    { code: 'PA', name: 'Pennsylvania' },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const orderColumns = [
    { field: 'id', headerName: 'Order ID', flex: 1 },
    { field: 'order_Date', headerName: 'Order Date', flex: 1,
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleDateString();
      }
    },
    { field: 'total_Amount', headerName: 'Total Amount', flex: 1,
      valueFormatter: (params) => {
        return `$${params.value.toFixed(2)}`;
      }
    },
    { field: 'status', headerName: 'Status', flex: 1 }
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
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

      {/* Top Bar */}
      <AppBar sx={{ backgroundColor: '#8499D9' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back" onClick={goBack}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Account Details
          </Typography>
          {activeTab === 0 && (
            <IconButton color="inherit" onClick={() => setIsEditing(!isEditing)}>
              <EditIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ paddingTop: 10 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
            <Typography variant="h6" sx={{ ml: 2 }}>Loading profile information...</Typography>
          </Box>
        ) : (
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={3} sx={{ padding: 2 }}>
            <Paper sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src="/logo.png" alt="png" style={{ width: '150px', marginBottom: '20px' }} />
              <Typography variant="h6">{formData.FirstName ? `${formData.FirstName} ${formData.LastName}` : 'Loading...'}</Typography>
              <Typography variant="body2">{formData.Email || 'Loading...'}</Typography>
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9}>
            <Paper sx={{ padding: 3, minHeight: '100%' }}>
              <Typography variant="h4" gutterBottom>
                Account Details
              </Typography>

              {/* Tabs */}
              <Tabs value={activeTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
                <Tab label="Personal Information" />
                <Tab label="Order History" />
                <Tab label="Invoices" />
              </Tabs>

              {/* Personal Information Tab */}
              {activeTab === 0 && (
                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={formData.FirstName}
                      onChange={(e) => setFormData({ ...formData, FirstName: e.target.value })}
                      variant="outlined"
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Middle Name"
                      value={formData.MiddleName}
                      onChange={(e) => setFormData({ ...formData, MiddleName: e.target.value })}
                      variant="outlined"
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={formData.LastName}
                      onChange={(e) => setFormData({ ...formData, LastName: e.target.value })}
                      variant="outlined"
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={formData.Email}
                      variant="outlined"
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={formData.PhoneNumber}
                      onChange={(e) => setFormData({ ...formData, PhoneNumber: e.target.value })}
                      variant="outlined"
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address Line 1"
                      value={formData.AddressLineOne}
                      onChange={(e) => setFormData({ ...formData, AddressLineOne: e.target.value })}
                      variant="outlined"
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address Line 2"
                      value={formData.AddressLineTwo}
                      onChange={(e) => setFormData({ ...formData, AddressLineTwo: e.target.value })}
                      variant="outlined"
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="City"
                      value={formData.City}
                      onChange={(e) => setFormData({ ...formData, City: e.target.value })}
                      variant="outlined"
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>State</InputLabel>
                      <Select
                        label="State"
                        value={formData.State}
                        onChange={(e) => setFormData({ ...formData, State: e.target.value })}
                        disabled={!isEditing}
                      >
                        {states.map((state) => (
                          <MenuItem key={state.code} value={state.code}>
                            {state.code} - {state.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Zip Code"
                      value={formData.ZipCode}
                      onChange={(e) => setFormData({ ...formData, ZipCode: e.target.value })}
                      variant="outlined"
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Country"
                      value={formData.Country}
                      onChange={(e) => setFormData({ ...formData, Country: e.target.value })}
                      variant="outlined"
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Date of Birth"
                        value={formData.DateOfBirth}
                        onChange={(newDate) => setFormData({ ...formData, DateOfBirth: newDate })}
                        disabled={!isEditing}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  {isEditing && (
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        onClick={handleSave}
                        sx={{ marginRight: 2 }}
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setIsEditing(false);
                          fetchData(); // Reload the original data
                        }}
                      >
                        Cancel
                      </Button>
                    </Grid>
                  )}
                </Grid>
              )}

              {/* Order History Tab */}
              {activeTab === 1 && (
                <Box sx={{ marginTop: 2 }}>
                  {ordersLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" padding={4}>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      <Typography variant="h6">Loading order history...</Typography>
                    </Box>
                  ) : orders.length === 0 ? (
                    <Box display="flex" flexDirection="column" alignItems="center" padding={4}>
                      <Typography variant="h6" sx={{ mb: 2 }}>No order history found</Typography>
                      <Button 
                        variant="outlined" 
                        onClick={fetchOrders}
                      >
                        Refresh
                      </Button>
                    </Box>
                  ) : (
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Order Date</TableCell>
                            <TableCell>Delivery Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell>Customer Email</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell>{order.id || 'N/A'}</TableCell>
                              <TableCell>{formatDate(order.order_Date)}</TableCell>
                              <TableCell>{formatDate(order.delivery_Date)}</TableCell>
                              <TableCell>
                                <Box 
                                  component="span" 
                                  sx={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontWeight: 'medium',
                                    backgroundColor: 
                                      order.order_Status === 'Delivered' ? '#e8f5e9' :
                                      order.order_Status === 'Shipped' ? '#e3f2fd' :
                                      order.order_Status === 'Processing' ? '#fff8e1' : '#f5f5f5',
                                    color: 
                                      order.order_Status === 'Delivered' ? '#2e7d32' :
                                      order.order_Status === 'Shipped' ? '#1565c0' :
                                      order.order_Status === 'Processing' ? '#f57c00' : '#616161',
                                  }}
                                >
                                  {order.order_Status || 'Processing'}
                                </Box>
                              </TableCell>
                              <TableCell align="right">
                                ${typeof order.total_Amount === 'number' ? Number(order.total_Amount).toFixed(2) : '0.00'}
                              </TableCell>
                              <TableCell>{order.customer_Email || 'N/A'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <TablePagination
                        component="div"
                        count={totalCount}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </TableContainer>
                  )}
                </Box>
              )}

              {/* Invoices Tab */}
              {activeTab === 2 && (
                <Box sx={{ marginTop: 2 }}>
                  {invoicesLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" padding={4}>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      <Typography variant="h6">Loading invoices...</Typography>
                    </Box>
                  ) : invoices.length === 0 ? (
                    <Box display="flex" flexDirection="column" alignItems="center" padding={4}>
                      <Typography variant="h6" sx={{ mb: 2 }}>No invoices found</Typography>
                      <Button 
                        variant="outlined" 
                        onClick={fetchInvoices}
                      >
                        Refresh
                      </Button>
                    </Box>
                  ) : (
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Invoice ID</TableCell>
                            <TableCell>Invoice Date</TableCell>
                            <TableCell>Customer ID</TableCell>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Payment ID</TableCell>
                            <TableCell align="right">Total Amount</TableCell>
                            <TableCell>Generated At</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {invoices.map((invoice) => (
                            <TableRow key={invoice.id}>
                              <TableCell>{invoice.id}</TableCell>
                              <TableCell>{formatDate(invoice.invoice_Date)}</TableCell>
                              <TableCell>{invoice.customer_Id}</TableCell>
                              <TableCell>{invoice.order_Id}</TableCell>
                              <TableCell>{invoice.payment_Id || 'Pending'}</TableCell>
                              <TableCell align="right">
                                ${typeof invoice.total_Amount === 'number' ? invoice.total_Amount.toFixed(2) : '0.00'}
                              </TableCell>
                              <TableCell>{formatDate(invoice.generated_At) || 'N/A'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <TablePagination
                        component="div"
                        count={totalCount}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </TableContainer>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
        )}
      </Container>
    </Box>
  );
};

export default AccountDetails;
import * as React from 'react';
import { Container, Grid, Paper, Typography, TextField, Button, Tabs, Tab, Box, AppBar, Toolbar, IconButton, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert } from '@mui/material';
import { AccountCircle, ArrowBack, Edit as EditIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom'; // Using useNavigate for React Router v6
import { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // Import DatePicker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import customerApi from '../api/customerApi';

const AccountDetails = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  const navigate = useNavigate(); // Initialize useNavigate hook to navigate
  const location = useLocation();
  const { email, password } = location.state || {}; // Retrieve the email and password from the state
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
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    fetchData();
  }, [navigate, location.pathname]);

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
      await fetchData(); // Refresh the data after successful update
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

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Full height
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
      <AppBar  sx={{ backgroundColor: '#8499D9' }}>
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
            <Typography variant="h6">Loading profile information...</Typography>
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

              {/* Tab Panels */}
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
                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                  <Typography variant="h6">No recent orders</Typography>
                </Grid>
              )}

              {/* Payment Methods Tab */}
              {activeTab === 2 && (
                <Grid container spacing={2} sx={{ marginTop: 2 }}>
                  <Typography variant="h6">No payment methods saved</Typography>
                </Grid>
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

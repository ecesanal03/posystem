import * as React from 'react';
import { Container, Grid, Paper, Typography, TextField, Button, Tabs, Tab, Box, AppBar, Toolbar, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { AccountCircle, ArrowBack } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom'; // Using useNavigate for React Router v6
import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // Import DatePicker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const AccountDetails = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  const navigate = useNavigate(); // Initialize useNavigate hook to navigate
  const location = useLocation();
  const { email, password } = location.state || {}; // Retrieve the email and password from the state
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
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (newDate) => {
    setFormData((prevData) => ({
      ...prevData,
      DateOfBirth: newDate,
    }));
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
      {/* Top Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#8499D9' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back" onClick={goBack}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Account Details
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ paddingTop: 5 }}>
        <Grid container spacing={3}>
          {/* Sidebar */}
          <Grid item xs={12} md={3} sx={{ padding: 2 }}>
            <Paper sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src="src/assets/logo.png" alt="logo" style={{ width: '150px', marginBottom: '20px' }} />
              <Typography variant="h6">John Doe</Typography>
              <Typography variant="body2">johndoe@example.com</Typography>
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
                  <Grid item xs={12} >
                    <TextField fullWidth label="Email" value="johndoe@example.com" variant="outlined" disabled />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Address Line 1" value="123 Main Street" variant="outlined" disabled />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Address Line 2" value="" variant="outlined" disabled />
                  </Grid>
                    <Grid item xs={12} >
                        <TextField fullWidth label="City" value="Anytown" variant="outlined" disabled />
                    </Grid>
                    <Grid item xs={12} >
                        <FormControl fullWidth required>
                        <InputLabel>State</InputLabel>
                        <Select
                            label="State"
                            name="State"
                            value={formData.State}
                            onChange={handleChange}
                        >
                            {states.map((state) => (
                            <MenuItem key={state.code} value={state.code}>
                                {state.code} - {state.name}
                            </MenuItem>
                            ))}
                        </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} >
                        <TextField fullWidth label="Country" value="United States" variant="outlined" disabled />
                    </Grid>
                    {/* Date of Birth Picker */}
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Date of Birth"
                            value={formData.DateOfBirth}
                            onChange={handleDateChange}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                        </LocalizationProvider>
                    </Grid>
                  <Grid item xs={12}></Grid>
                  <Grid item xs={12}>
                    <Button variant="contained">Save Changes</Button>
                  </Grid>
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
      </Container>
    </Box>
  );
};

export default AccountDetails;

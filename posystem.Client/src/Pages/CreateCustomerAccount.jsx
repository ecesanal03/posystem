import * as React from 'react';
import { TextField, Button, Box, Typography, Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AccountDetailsPage() {
  const navigate = useNavigate();
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.Email || !formData.Password ) {
        alert('Please enter email and password.');
        return;
      }

    console.log('Account Details Submitted:', formData);

    // Send the data to the backend using fetch
    try {
      const response = await fetch('https://localhost:5001/customers/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to register customer');
      }

      const result = await response.json();
      console.log('Customer registered:', result);
      alert(result.Message || 'Customer registered successfully');
      
      // Store the JWT token in localStorage 
      if (result.Token) {
        localStorage.setItem('authToken', result.Token);  // Store the token
      }

      navigate('/');

    } catch (error) {
      console.error('Error:', error);
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


  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f6f8',
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 600, padding: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            Enter Account Details
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <TextField
                  label="First Name"
                  name="FirstName"
                  value={formData.FirstName}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Middle Name"
                  name="MiddleName"
                  value={formData.MiddleName}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Last Name"
                  name="LastName"
                  value={formData.LastName}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Phone Number"
                  name="PhoneNumber"
                  value={formData.PhoneNumber}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address Line 1"
                  name="AddressLineOne"
                  value={formData.AddressLineOne}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address Line 2"
                  name="AddressLineTwo"
                  value={formData.AddressLineTwo}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="City"
                  name="City"
                  value={formData.City}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Zip Code"
                  name="ZipCode"
                  value={formData.ZipCode}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Country"
                  name="Country"
                  value={formData.Country}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  required
                />
              </Grid>
              {/* State Dropdown */}
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  sx={{ marginTop: 2 }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

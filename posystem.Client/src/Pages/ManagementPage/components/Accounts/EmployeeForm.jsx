import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  FormHelperText,
  Grid
} from '@mui/material';

const EmployeeForm = ({ employee, onSave, onCancel }) => {
  const isEditing = !!employee?.Id;
  
  const [formData, setFormData] = useState({
    Id: '',
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
    Role: 'associate',
    IsActive: true
  });
  
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (employee) {
      console.log("Setting form data with employee:", employee);
      
      // Ensure all fields have defined values to prevent uncontrolled/controlled switch
      setFormData({
        Id: employee.Id || '',
        FirstName: employee.FirstName || '',
        MiddleName: employee.MiddleName || '',
        LastName: employee.LastName || '',
        Email: employee.Email || '',
        DateOfBirth: employee.DateOfBirth || '',
        PhoneNumber: employee.PhoneNumber || '',
        Password: '', // Don't populate password field when editing
        AddressLineOne: employee.AddressLineOne || '',
        AddressLineTwo: employee.AddressLineTwo || '',
        City: employee.City || '',
        State: employee.State || '',
        ZipCode: employee.ZipCode || '',
        Country: employee.Country || '',
        Role: employee.Role || 'Associate',
        IsActive: typeof employee.IsActive === 'boolean' ? employee.IsActive : true
      });
    }
  }, [employee]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.FirstName) newErrors.FirstName = 'First name is required';
    if (!formData.LastName) newErrors.LastName = 'Last name is required';
    if (!formData.Email) newErrors.Email = 'Email is required';
    if (!isEditing && !formData.Password) newErrors.Password = 'Password is required';
    if (!formData.AddressLineOne) newErrors.AddressLineOne = 'Address is required';
    if (!formData.City) newErrors.City = 'City is required';
    if (!formData.State) newErrors.State = 'State is required';
    if (!formData.ZipCode) newErrors.ZipCode = 'Zip Code is required';
    if (!formData.Country) newErrors.Country = 'Country is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Prepare form data for submission
    const submitData = { ...formData };
    
    // Add EmploymentStartDate field (required by the backend)
    if (!isEditing) {
      submitData.EmploymentStartDate = new Date().toISOString();
    }
    
    onSave(submitData);
  };
  
  return (
    <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {isEditing ? 'Edit Employee' : 'Add New Employee'}
      </Typography>
      
      <Grid container spacing={1}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="First Name"
            name="FirstName"
            value={formData.FirstName}
            onChange={handleChange}
            error={!!errors.FirstName}
            helperText={errors.FirstName}
            required
            variant="outlined"
            size="small"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Middle Name"
            name="MiddleName"
            value={formData.MiddleName || ''}
            onChange={handleChange}
            variant="outlined"
            size="small"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Last Name"
            name="LastName"
            value={formData.LastName}
            onChange={handleChange}
            error={!!errors.LastName}
            helperText={errors.LastName}
            required
            variant="outlined"
            size="small"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            name="Email"
            type="email"
            value={formData.Email}
            onChange={handleChange}
            error={!!errors.Email}
            helperText={errors.Email}
            required
            variant="outlined"
            size="small"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
            <TextField
                fullWidth
                label="Date of Birth"
                name="DateOfBirth"
                type="date"
                value={formData.DateOfBirth ? String(formData.DateOfBirth).split('T')[0] : ''}
                onChange={handleChange}
                variant="outlined"
                size="small"
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
            />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Phone"
            name="PhoneNumber"
            value={formData.PhoneNumber || ''}
            onChange={handleChange}
            variant="outlined"
            size="small"
            margin="normal"
          />
        </Grid>      
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Password"
            name="Password"
            type="password"
            value={formData.Password}
            onChange={handleChange}
            error={!!errors.Password}
            helperText={errors.Password || (isEditing ? 'Leave blank to keep current password' : '')}
            required={!isEditing}
            variant="outlined"
            size="small"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Address Line 1"
            name="AddressLineOne"
            value={formData.AddressLineOne || ''}
            onChange={handleChange}
            variant="outlined"
            size="small"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Address Line 2"
            name="AddressLineTwo"
            value={formData.AddressLineTwo || ''}
            onChange={handleChange}
            variant="outlined"
            size="small"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="City"
            name="City"
            value={formData.City || ''}
            onChange={handleChange}
            variant="outlined"
            size="small"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="State"
            name="State"
            value={formData.State || ''}
            onChange={handleChange}
            variant="outlined"
            size="small"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Zip Code"
            name="ZipCode"
            value={formData.ZipCode || ''}
            onChange={handleChange}
            variant="outlined"
            size="small"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Country"
            name="Country"
            value={formData.Country || ''}
            onChange={handleChange}
            variant="outlined"
            size="small"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth margin="normal" size="small" error={!!errors.Role}>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              name="Role"
              value={formData.Role || 'Associate'}
              onChange={handleChange}
              label="Role"
              required
            >
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="associate">Associate</MenuItem>
            </Select>
            {errors.Role && <FormHelperText>{errors.Role}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" color="inherit" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {isEditing ? 'Update Employee' : 'Add Employee'}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

EmployeeForm.propTypes = {
  employee: PropTypes.shape({
    Id: PropTypes.string,
    FirstName: PropTypes.string,
    MiddleName: PropTypes.string,
    LastName: PropTypes.string,
    Email: PropTypes.string,
    DateOfBirth: PropTypes.string,
    PhoneNumber: PropTypes.string,
    AddressLineOne: PropTypes.string,
    AddressLineTwo: PropTypes.string,
    City: PropTypes.string,
    State: PropTypes.string,
    ZipCode: PropTypes.string,
    Country: PropTypes.string,
    Role: PropTypes.string,
    IsActive: PropTypes.bool
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default EmployeeForm; 
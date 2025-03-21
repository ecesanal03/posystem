import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  FormHelperText,
  Grid,
  Switch,
  FormControlLabel
} from '@mui/material';
import { Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';

const EmployeeForm = ({ employee, onSave, onCancel }) => {
  const isEditing = !!employee;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'cashier',
    phone: '',
    address: '',
    password: '',
    active: true
  });
  
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
        password: '' // Don't populate password field when editing
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
  
  const handleSwitchChange = (e) => {
    setFormData(prev => ({
      ...prev,
      active: e.target.checked
    }));
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!isEditing && !formData.password.trim()) {
      newErrors.password = 'Password is required for new employees';
    } else if (!isEditing && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSave({
        ...formData,
        // If editing and password is empty, don't update the password
        password: isEditing && !formData.password ? undefined : formData.password
      });
    }
  };
  
  return (
    <Paper
      elevation={0}
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 3,
        width: '100%',
        maxWidth: '800px',
        mx: 'auto'
      }}
    > 
      <Grid container spacing={1}>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Fname"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            required
            variant="outlined"
            size="small"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={1}>
          <TextField
            fullWidth
            label="M"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            required
            variant="outlined"
            size="small"
            margin="normal"
          />
        </Grid>       
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Lname"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            required
            variant="outlined"
            size="small"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={5}>
            <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
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
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                variant="outlined"
                size="small"
                margin="normal"
            />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            variant="outlined"
            size="small"
            margin="normal"
          />
        </Grid>      
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password || (isEditing ? 'Leave blank to keep current password' : '')}
            required={!isEditing}
            variant="outlined"
            size="small"
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            variant="outlined"
            size="small"
            margin="normal"
            multiline
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Address2"
            name="address2"
            value={formData.address2 || ''}
            onChange={handleChange}
            variant="outlined"
            size="small"
            margin="normal"
            multiline
          />
        </Grid>
        <Grid item xs={12} sm={3}>
            <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                variant="outlined"
                size="small"
                margin="normal"
            />
        </Grid>
        <Grid item xs={12} sm={2}>
            <TextField
                fullWidth
                label="State"
                name="state"
                value={formData.state}
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
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                variant="outlined"
                size="small"
                margin="normal"
            />
        </Grid>
        <Grid item xs={12} sm={4}>
            <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                variant="outlined"
                size="small"
                margin="normal"
            />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth margin="normal" size="small" error={!!errors.role}>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Role"
              required
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="cashier">Cashier</MenuItem>
            </Select>
            {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.active}
                onChange={handleSwitchChange}
                name="active"
                color="primary"
              />
            }
            label="Active"
            sx={{ mt: 2 }}
          />
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          startIcon={<SaveIcon />}
          sx={{
            bgcolor: '#4caf50',
            '&:hover': { bgcolor: '#388e3c' }
          }}
        >
          {isEditing ? 'Update Employee' : 'Add Employee'}
        </Button>
        
        <Button
          variant="outlined"
          onClick={onCancel}
          startIcon={<CloseIcon />}
          sx={{
            color: '#ff6b6b',
            borderColor: '#ff6b6b',
            '&:hover': {
              bgcolor: 'rgba(255, 107, 107, 0.1)',
              borderColor: '#ff6b6b'
            }
          }}
        >
          Cancel
        </Button>
      </Box>
    </Paper>
  );
};

EmployeeForm.propTypes = {
  employee: PropTypes.shape({
    id: PropTypes.number,
    employee_id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    active: PropTypes.bool,
    start_date: PropTypes.string
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default EmployeeForm; 
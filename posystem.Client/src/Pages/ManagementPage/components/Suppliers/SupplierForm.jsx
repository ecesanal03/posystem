import PropTypes from 'prop-types';
import { 
  Grid, 
  TextField,
} from '@mui/material';

const SupplierForm = ({ newSupplier, handleNewSupplierChange, supplierValidationErrors }) => {
  return (
    <Grid container spacing={1.5} md={10} sx={{ mx: 'auto', width: '100%', maxWidth: '800px' }}>
      <Grid item xs={12}>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          name="SupplierName"
          label="Supplier Name"
          value={newSupplier.SupplierName} 
          onChange={handleNewSupplierChange}
          fullWidth
          required
          error={!!supplierValidationErrors.SupplierName}
          helperText={supplierValidationErrors.SupplierName}
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: '#2A2D2A',
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#61677A'
              }
            }
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          name="Email"
          label="Email"
          type="email"
          value={newSupplier.Email}
          onChange={handleNewSupplierChange}
          fullWidth
          required
          error={!!supplierValidationErrors.Email}
          helperText={supplierValidationErrors.Email}
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: '#2A2D2A',
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#61677A'
              }
            }
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          name="PhoneNumber"
          label="Phone Number"
          value={newSupplier.PhoneNumber}
          onChange={handleNewSupplierChange}
          fullWidth
          required
          error={!!supplierValidationErrors.PhoneNumber}
          helperText={supplierValidationErrors.PhoneNumber}
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: '#2A2D2A',
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#61677A'
              }
            }
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          name="AddressLineOne"
          label="Address Line 1"
          value={newSupplier.AddressLineOne}
          onChange={handleNewSupplierChange}
          fullWidth
          required
          error={!!supplierValidationErrors.AddressLineOne}
          helperText={supplierValidationErrors.AddressLineOne}
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: '#2A2D2A',
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#61677A'
              }
            }
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          name="AddressLineTwo"
          label="Address Line 2"
          value={newSupplier.AddressLineTwo}
          onChange={handleNewSupplierChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: '#2A2D2A',
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#61677A'
              }
            }
          }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          name="City"
          label="City"
          value={newSupplier.City}
          onChange={handleNewSupplierChange}
          fullWidth
          required
          error={!!supplierValidationErrors.City}
          helperText={supplierValidationErrors.City}
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: '#2A2D2A',
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#61677A'
              }
            }
          }}
        />
      </Grid>
      <Grid item xs={12} md={2}>
        <TextField
          name="State"
          label="State"
          value={newSupplier.State}
          onChange={handleNewSupplierChange}
          fullWidth
          required
          error={!!supplierValidationErrors.State}
          helperText={supplierValidationErrors.State}
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: '#2A2D2A',
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#61677A'
              }
            }
          }}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          name="ZipCode"
          label="Zip Code"
          value={newSupplier.ZipCode}
          onChange={handleNewSupplierChange}
          fullWidth
          required
          error={!!supplierValidationErrors.ZipCode}
          helperText={supplierValidationErrors.ZipCode}
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: '#2A2D2A',
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#61677A'
              }
            }
          }}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          name="Country"
          label="Country"
          value={newSupplier.Country}
          onChange={handleNewSupplierChange}
          fullWidth
          required
          error={!!supplierValidationErrors.Country}
          helperText={supplierValidationErrors.Country}
          InputLabelProps={{ shrink: true }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: '#2A2D2A',
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#61677A'
              }
            }
          }}
        />
      </Grid>
    </Grid>
  );
};

SupplierForm.propTypes = {
  newSupplier: PropTypes.shape({
    SupplierName: PropTypes.string,
    Email: PropTypes.string,
    PhoneNumber: PropTypes.string,
    AddressLineOne: PropTypes.string,
    AddressLineTwo: PropTypes.string,
    City: PropTypes.string,
    State: PropTypes.string,
    ZipCode: PropTypes.string,
    Country: PropTypes.string
  }).isRequired,
  handleNewSupplierChange: PropTypes.func.isRequired,
  supplierValidationErrors: PropTypes.object.isRequired
};

export default SupplierForm; 
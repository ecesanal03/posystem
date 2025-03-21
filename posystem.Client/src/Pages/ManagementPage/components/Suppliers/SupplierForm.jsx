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
      <Grid item xs={12} md={4}>
        <TextField
          name="name"
          label="Supplier Name"
          value={newSupplier.name} 
          onChange={handleNewSupplierChange}
          fullWidth
          required
          error={!!supplierValidationErrors.name}
          helperText={supplierValidationErrors.name}
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
          name="contact_person"
          label="Contact Person"
          value={newSupplier.contact_person}
          onChange={handleNewSupplierChange}
          fullWidth
          required
          error={!!supplierValidationErrors.contact_person}
          helperText={supplierValidationErrors.contact_person}
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
          name="email"
          label="Email"
          type="email"
          value={newSupplier.email}
          onChange={handleNewSupplierChange}
          fullWidth
          required
          error={!!supplierValidationErrors.email}
          helperText={supplierValidationErrors.email}
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
          name="phone"
          label="Phone Number"
          value={newSupplier.phone}
          onChange={handleNewSupplierChange}
          fullWidth
          required
          error={!!supplierValidationErrors.phone}
          helperText={supplierValidationErrors.phone}
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
      <Grid item xs={12} md={8}>
        <TextField
          name="address"
          label="Address"
          value={newSupplier.address}
          onChange={handleNewSupplierChange}
          fullWidth
          required
          error={!!supplierValidationErrors.address}
          helperText={supplierValidationErrors.address}
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
          name="city"
          label="City"
          value={newSupplier.city}
          onChange={handleNewSupplierChange}
          fullWidth
          required
          error={!!supplierValidationErrors.city}
          helperText={supplierValidationErrors.city}
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
          name="state"
          label="State/Province"
          value={newSupplier.state}
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
      <Grid item xs={12} md={3}>
        <TextField
          name="zip"
          label="Zip/Postal Code"
          value={newSupplier.zip}
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
      <Grid item xs={12} md={3}>
        <TextField
          name="country"
          label="Country"
          value={newSupplier.country}
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
    </Grid>
  );
};

SupplierForm.propTypes = {
  newSupplier: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    contact_person: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zip: PropTypes.string,
    country: PropTypes.string
  }).isRequired,
  handleNewSupplierChange: PropTypes.func.isRequired,
  supplierValidationErrors: PropTypes.object.isRequired
};

export default SupplierForm; 
import PropTypes from 'prop-types';
import { 
  Grid, 
  TextField, 
  Box,
  InputAdornment,
  Button
} from '@mui/material';

const DiscountForm = ({ discount, handleInputChange, validationErrors = {}, onApplyToAll, onRemoveFromAll }) => {
  return (
    <Grid container spacing={2} sx={{ pt: 2 }}>
      <Grid item xs={9}>
        <TextField
          fullWidth
          label="Discount Name"
          name="name"
          value={discount.name}
          onChange={handleInputChange}
          required
          error={!!validationErrors.name}
          helperText={validationErrors.name}
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

      <Grid item xs={3}>
        <TextField
          fullWidth
          label="Percentage"
          name="discountPercentage"
          type="number"
          value={discount.discountPercentage}
          onChange={handleInputChange}
          required
          error={!!validationErrors.discountPercentage}
          helperText={validationErrors.discountPercentage}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
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

      <Grid item xs={10} sm={6}>
        <TextField
          fullWidth
          label="Start Date"
          name="startDate"
          type="date"
          value={discount.startDate}
          onChange={handleInputChange}
          required
          error={!!validationErrors.startDate}
          helperText={validationErrors.startDate}
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

      <Grid item xs={10} sm={6}>
        <TextField
          fullWidth
          label="End Date"
          name="endDate"
          type="date"
          value={discount.endDate}
          onChange={handleInputChange}
          required
          error={!!validationErrors.endDate}
          helperText={validationErrors.endDate}
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

      {discount.employeeName && (
        <Grid item xs={12}>
          <Box sx={{ 
            p: 0, 
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.875rem'
          }}>
            Created by: {discount.employeeName}
          </Box>
        </Grid>
      )}

      {discount.id && (
        <Grid item xs={12}>
          <Button 
            variant="outlined"
            onClick={() => onApplyToAll(discount.id)}
            sx={{ fontWeight: 'bold', color: '#fff', borderColor: '#ccc' }}
          >
            Apply to All Books
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => onRemoveFromAll(discount.id)}
            sx={{ mt: 2 }}
          >
            Remove Discount from All Books
          </Button>
        </Grid>
      )}
    </Grid>
  );
};

DiscountForm.propTypes = {
  discount: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    discountPercentage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    employeeName: PropTypes.string
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  validationErrors: PropTypes.object,
  onApplyToAll: PropTypes.func.isRequired,
  onRemoveFromAll: PropTypes.func.isRequired,
};

export default DiscountForm;

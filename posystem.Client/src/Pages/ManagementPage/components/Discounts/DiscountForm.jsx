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
      {discount.id && (
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button 
              variant="outlined"
              onClick={() => onApplyToAll(discount.id)}
              sx={{ 
                p: 0.4,
                fontWeight: 'bold', 
                color: '#fff', 
                bgcolor: '#2a5885',
                borderColor: '#61677A',
                '&:hover': {
                  bgcolor: '#3a6ea8',
                  borderColor: '#4a8bc7',
                }
              }}
            >
              Apply All Books
            </Button>
          </Box>
        </Grid>
      )}
      {discount.id && (
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button 
              variant="outlined"
              onClick={() => onRemoveFromAll(discount.id)}
              sx={{ 
                p: 0.4,
                fontWeight: 'bold', 
                color: '#fff', 
                bgcolor: '#8B0000',
                borderColor: '#61677A',
                '&:hover': {
                  bgcolor: '#B22222',
                  borderColor: '#CD5C5C',
                }
              }}
            >
              Deactivate All
            </Button>
          </Box>
        </Grid>
      )}
      {discount.employeeName && (
        <Grid item xs={12} sm={6}>
          <Box sx={{ 
            p: 0, 
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.875rem'
          }}>
            Created by: {discount.employeeName}
          </Box>
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

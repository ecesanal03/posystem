import PropTypes from 'prop-types';
import { 
  Grid, 
  TextField, 
  Box,
  InputAdornment,
  Button
} from '@mui/material';
import { useState, useEffect } from 'react';

const DiscountForm = ({ discount, handleInputChange, validationErrors = {}, onApplyToAll, onRemoveFromAll }) => {
  const [discountApplied, setDiscountApplied] = useState(false);
  
  // Reset the state when discount changes
  useEffect(() => {
    setDiscountApplied(false);
  }, [discount.id]);
  
  const handleToggleDiscount = () => {
    if (discountApplied)
      onRemoveFromAll(discount.id);
    else
      onApplyToAll(discount.id);

    setDiscountApplied(!discountApplied);
  };

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

      <Grid item xs={10} sm={4.5}>
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

      <Grid item xs={10} sm={4.5}>
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
        <Grid item xs={12} sm={3}>
          <Button 
            variant="outlined"
            onClick={handleToggleDiscount}
            color={discountApplied ? "error" : "primary"}
            sx={{ 
              p: 0.4,
              fontWeight: 'bold', 
              color: '#fff', 
              bgcolor: discountApplied ? '#d32f2f' : '#2a5885',
              borderColor: discountApplied ? '#f44336' : '#3a7ab7',
              '&:hover': {
                bgcolor: discountApplied ? '#e33e3e' : '#3a6ea8',
                borderColor: discountApplied ? '#f55a4e' : '#4a8bc7',
              }
            }}
          >
            {discountApplied ? 'Deactivate All Books' : 'Apply All Books'}
          </Button>
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

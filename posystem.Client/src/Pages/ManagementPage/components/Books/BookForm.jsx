import PropTypes from 'prop-types';
import { 
  Grid, 
  TextField, 
  Box, 
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Paper
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import ImageIcon from '@mui/icons-material/Image';

const BookForm = ({ newBook, handleNewBookChange, validationErrors, suppliers = [] }) => {
  return (
    <Grid container spacing={3}>
      {/* Image Preview Section */}
      <Grid item xs={12} md={6}>
        <Paper elevation={0} sx={{ 
          bgcolor: 'rgba(42, 45, 42, 0.8)', 
          borderRadius: 1, 
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{ 
            flex: 1,
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            pt: 1,
            bgcolor: 'rgba(97, 103, 122, 0.1)'
          }}>
            {newBook.Cover_Image ? (
              <Box sx={{ position: 'relative', width: '100%', textAlign: 'center' }}>
                <img 
                  src={newBook.Cover_Image} 
                  alt={newBook.Title || 'Book cover'} 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: 250, 
                    objectFit: 'contain',
                    borderRadius: '4px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                  }} 
                  onError={(e) => {
                    console.error('Error loading image:', e);
                    e.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22600%22%20viewBox%3D%220%200%20400%20600%22%3E%3Crect%20fill%3D%22%23323232%22%20width%3D%22400%22%20height%3D%22600%22%2F%3E%3Ctext%20fill%3D%22%23A0A0A0%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2220%22%20dy%3D%2220%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3EImage%20Not%20Found%3C%2Ftext%3E%3C%2Fsvg%3E';
                  }}
                />
              </Box>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                p: 3,
                border: '2px dashed rgba(97, 103, 122, 0.5)',
                borderRadius: '4px'
              }}>
                <ImageIcon sx={{ fontSize: 60, color: 'rgba(255,255,255,0.5)', mb: 2 }} />
                <Typography variant="body1" color="white" align="center" gutterBottom>
                  Book Cover Preview
                </Typography>
              </Box>
            )}
          </Box>
          
          {/* Image URL input */}
          <Box sx={{ p: 2, borderTop: '1px solid rgba(97, 103, 122, 0.3)' }}>
            <TextField
              name="Cover_Image_URL"
              label="Image URL"
              value={newBook.Cover_Image || ''}
              onChange={handleNewBookChange}
              fullWidth
              required
              error={!!validationErrors.Cover_Image_URL}
              InputLabelProps={{ shrink: true }}
              placeholder="https://example.com/book-cover.jpg"
              InputProps={{
                startAdornment: <LinkIcon sx={{ mr: 1, color: 'rgba(255,255,255,0.5)' }} />
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#2A2D2A',
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#61677A'
                  }
                }
              }}
            />
          </Box>
        </Paper>
      </Grid>

      {/* Form Fields */}
      <Grid item xs={12} md={6}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="Title"
              label="Title"
              value={newBook.Title}
              onChange={handleNewBookChange}
              fullWidth
              required
              error={!!validationErrors.Title}
              helperText={validationErrors.Title}
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
          <Grid item xs={12}>
            <TextField
              name="Author"
              label="Author"
              value={newBook.Author}
              onChange={handleNewBookChange}
              fullWidth
              required
              error={!!validationErrors.Author}
              helperText={validationErrors.Author}
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
          <Grid item xs={12} sm={6}>
            <TextField
              name="ISBN"
              label="ISBN"
              value={newBook.ISBN}
              onChange={handleNewBookChange}
              fullWidth
              required
              error={!!validationErrors.ISBN}
              helperText={validationErrors.ISBN}
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
          <Grid item xs={12} sm={6}>
            <FormControl 
              fullWidth
              error={!!validationErrors.Supplier_Id}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#2A2D2A',
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#61677A'
                  }
                }
              }}
            >
              <InputLabel id="supplier-select-label" shrink>Supplier</InputLabel>
              <Select
                labelId="supplier-select-label"
                id="supplier-select"
                name="Supplier_Id"
                value={newBook.Supplier_Id || ''}
                onChange={handleNewBookChange}
                displayEmpty
                label="Supplier"
                sx={{
                  '& .MuiSelect-icon': {
                    color: '#61677A'
                  }
                }}
              >
                <MenuItem value="">
                  <em>N/A</em>
                </MenuItem>
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.supplierName}
                  </MenuItem>
                ))}
              </Select>
              {validationErrors.Supplier_Id && (
                <FormHelperText>{validationErrors.Supplier_Id}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="Price"
              label="Price"
              type="number"
              value={newBook.Price}
              onChange={handleNewBookChange}
              fullWidth
              required
              error={!!validationErrors.Price}
              helperText={validationErrors.Price}
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
          <Grid item xs={12} sm={6}>
            <TextField
              name="Units"
              label="Units"
              type="number"
              value={newBook.Units}
              onChange={handleNewBookChange}
              fullWidth
              required
              error={!!validationErrors.Units}
              helperText={validationErrors.Units}
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
          <Grid item xs={12}>
            <TextField
              name="Description"
              label="Description"
              value={newBook.Description}
              onChange={handleNewBookChange}
              fullWidth
              multiline
              rows={4}
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
      </Grid>
    </Grid>
  );
};

BookForm.propTypes = {
  newBook: PropTypes.shape({
    Title: PropTypes.string,
    Author: PropTypes.string,
    ISBN: PropTypes.string,
    Supplier_Id: PropTypes.string,
    Price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    Units: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    Description: PropTypes.string,
    Discount_Id: PropTypes.string,
    Cover_Image: PropTypes.string
  }).isRequired,
  handleNewBookChange: PropTypes.func.isRequired,
  validationErrors: PropTypes.object.isRequired,
  suppliers: PropTypes.array
};

export default BookForm; 
import PropTypes from 'prop-types';
import { 
  Grid, 
  TextField, 
  Box, 
  Typography,
  Button
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const BookForm = ({ newBook, handleNewBookChange, handleImageChange, validationErrors }) => {
  return (
    <Grid container spacing={2}>
      {/* Image Upload Section */}
      <Grid item xs={12} md={6}>
        <Box sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          border: '1px dashed #61677A',
          borderRadius: 1,
          bgcolor: 'rgba(97, 103, 122, 0.1)'
        }}>
          {newBook.Cover_Image ? (
            <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
              <img 
                src={typeof newBook.Cover_Image === 'string' ? newBook.Cover_Image : URL.createObjectURL(newBook.Cover_Image)} 
                alt={newBook.Title || 'Book cover'} 
                style={{ 
                  width: '100%', 
                  maxHeight: 250, 
                  objectFit: 'contain',
                  borderRadius: '4px'
                }} 
              />
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 2,
                gap: 2 
              }}>
                <Button 
                  component="label" 
                  variant="outlined" 
                  size="small"
                  sx={{ 
                    color: 'white',
                    borderColor: '#61677A',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Change
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              p: 3
            }}>
              <Typography variant="body1" color="white" gutterBottom>
                Book Cover Image
              </Typography>
              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadFileIcon />}
                sx={{ 
                  mt: 1,
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              <Typography variant="caption" color="rgba(255,255,255,0.7)" display="block" sx={{ mt: 1 }}>
                or Drag and Drop
              </Typography>
            </Box>
          )}
        </Box>
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
            <TextField
              name="Supplier_Id"
              label="Supplier ID (Optional)"
              value={newBook.Supplier_Id}
              onChange={handleNewBookChange}
              fullWidth
              error={!!validationErrors.Supplier_Id}
              helperText={validationErrors.Supplier_Id || "Format: 00000000-0000-0000-0000-000000000000"}
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
    Cover_Image: PropTypes.any
  }).isRequired,
  handleNewBookChange: PropTypes.func.isRequired,
  handleImageChange: PropTypes.func.isRequired,
  validationErrors: PropTypes.object.isRequired
};

export default BookForm; 
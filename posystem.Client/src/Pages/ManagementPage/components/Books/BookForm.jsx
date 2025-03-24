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
          {newBook.image ? (
            <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
              <img 
                src={typeof newBook.image === 'string' ? newBook.image : URL.createObjectURL(newBook.image)} 
                alt={newBook.title || 'Book cover'} 
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
              name="title"
              label="Title"
              value={newBook.title}
              onChange={handleNewBookChange}
              fullWidth
              required
              error={!!validationErrors.title}
              helperText={validationErrors.title}
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
              name="author"
              label="Author"
              value={newBook.author}
              onChange={handleNewBookChange}
              fullWidth
              required
              error={!!validationErrors.author}
              helperText={validationErrors.author}
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
              name="isbn"
              label="ISBN"
              value={newBook.isbn}
              onChange={handleNewBookChange}
              fullWidth
              required
              error={!!validationErrors.isbn}
              helperText={validationErrors.isbn}
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
              name="supplier_id"
              label="Supplier ID"
              value={newBook.supplier_id}
              onChange={handleNewBookChange}
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
          <Grid item xs={12} sm={6}>
            <TextField
              name="price"
              label="Price"
              type="number"
              value={newBook.price}
              onChange={handleNewBookChange}
              fullWidth
              required
              error={!!validationErrors.price}
              helperText={validationErrors.price}
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
              name="units"
              label="Units"
              type="number"
              value={newBook.units}
              onChange={handleNewBookChange}
              fullWidth
              required
              error={!!validationErrors.units}
              helperText={validationErrors.units}
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
              name="description"
              label="Description"
              value={newBook.description}
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
    title: PropTypes.string,
    author: PropTypes.string,
    distributor: PropTypes.string,
    isbn: PropTypes.string,
    supplier_id: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    units: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string,
    discount_id: PropTypes.string,
    image: PropTypes.any
  }).isRequired,
  handleNewBookChange: PropTypes.func.isRequired,
  handleImageChange: PropTypes.func.isRequired,
  validationErrors: PropTypes.object.isRequired
};

export default BookForm; 
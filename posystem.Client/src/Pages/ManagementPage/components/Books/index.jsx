import { useState, useEffect } from 'react';
import { 
  Box, 
  TextField,
  Button,
  Paper,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Search as SearchIcon,
} from '@mui/icons-material'; 

import BookForm from './BookForm';
import BookTable from './BookTable';
import bookApi from '../../../../api/bookApi';

const BookSection = () => {
  // Books data state
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // We'll leave totalCount for future pagination implementation
  const [, setTotalCount] = useState(0);
  
  // Form state
  const [filter, setFilter] = useState('');
  const [newBook, setNewBook] = useState({ 
    Title: '', 
    Author: '', 
    Price: '', 
    Units: '', 
    Description: '', 
    ISBN: '',
    Supplier_Id: '',
    Discount_Id: '',
    Cover_Image: null 
  });

  // UI state
  const [showAddForm, setShowAddForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isEditingBook, setIsEditingBook] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Fetch books on component mount and when filter changes
  useEffect(() => {
    fetchBooks();
  }, [filter]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {};
      if (filter) {
        params.searchTerm = filter;
      }
      
      const response = await bookApi.getBooks(params);
      
      if (response.books) {
        setBooks(response.books);
        setTotalCount(response.totalCount);
      }
    } catch (err) {
      console.error('Failed to fetch books:', err);
      setError('Failed to load books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleNewBookChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewBook((prev) => ({ ...prev, Cover_Image: e.target.files[0] }));
    }
  };

  const validateBook = (book) => {
    const errors = {};
    
    if (!book.Title?.trim()) errors.Title = 'Title is required';
    if (!book.Author?.trim()) errors.Author = 'Author is required';
    if (!book.ISBN?.trim()) errors.ISBN = 'ISBN is required';
    if (!book.Price || isNaN(parseFloat(book.Price)) || parseFloat(book.Price) <= 0) 
      errors.Price = 'Valid price is required';
    if (!book.Units || isNaN(parseInt(book.Units)) || parseInt(book.Units) < 0) 
      errors.Units = 'Valid units count is required';
    
    // Validate Supplier_Id format if provided
    if (book.Supplier_Id && book.Supplier_Id.trim() !== '') {
      if (formatGuid(book.Supplier_Id) === null) {
        errors.Supplier_Id = 'Invalid Supplier ID format';
      }
    }
    
    return errors;
  };

  const handleEditBook = async (book) => {
    try {
      setLoading(true);
      // Fetch the complete book details for editing
      const response = await bookApi.getBook(book.id);
      
      if (response && response.book) {
        const bookDetails = response.book;
        
        setBookToEdit(bookDetails);
        setNewBook({
          Title: bookDetails.title,
          Author: bookDetails.author,
          Price: bookDetails.price.toString(),
          Units: bookDetails.units.toString(),
          Description: bookDetails.description || '',
          ISBN: bookDetails.isbn || '',
          Supplier_Id: bookDetails.supplierId || '',
          Discount_Id: bookDetails.discountId || '',
          Cover_Image: bookDetails.coverImage || null
        });
        setIsEditingBook(true);
        setShowAddForm(true);
        setValidationErrors({});
      }
    } catch (err) {
      console.error('Failed to fetch book details:', err);
      setNotification({
        open: true,
        message: 'Failed to load book details for editing.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = (book) => {
    setItemToDelete(book);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteBook = async () => {
    if (itemToDelete) {
      try {
        setLoading(true);
        const response = await bookApi.deleteBook(itemToDelete.id);
        
        if (response && response.success) {
          setNotification({
            open: true,
            message: 'Book deleted successfully',
            severity: 'success'
          });
          // Refresh the book list
          fetchBooks();
        } else {
          setNotification({
            open: true,
            message: response.message || 'Failed to delete book',
            severity: 'error'
          });
        }
      } catch (err) {
        console.error('Failed to delete book:', err);
        setNotification({
          open: true,
          message: 'Failed to delete book. Please try again.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      }
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setIsEditingBook(false);
    setBookToEdit(null);
    setNewBook({ 
      Title: '', 
      Author: '', 
      Price: '', 
      Units: '', 
      Description: '', 
      ISBN: '',
      Supplier_Id: '',
      Discount_Id: '',
      Cover_Image: null 
    });
    setValidationErrors({});
  };

  // Helper function to validate and format GUID
  const formatGuid = (input) => {
    if (!input || input.trim() === '') return null;
    
    // If it's already a valid GUID with hyphens, return it
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input)) {
      return input;
    }
    
    // If it's a valid GUID without hyphens, format it
    if (/^[0-9a-f]{32}$/i.test(input)) {
      return `${input.substring(0, 8)}-${input.substring(8, 12)}-${input.substring(12, 16)}-${input.substring(16, 20)}-${input.substring(20)}`;
    }
    
    // For "00000000" type inputs, expand to full zero GUID
    if (/^0+$/.test(input) && input.length <= 8) {
      return "00000000-0000-0000-0000-000000000000";
    }
    
    // If not a recognizable GUID format, return null
    return null;
  };

  const handleAddOrUpdateBook = async () => {
    if (showAddForm) {
      // Validate required fields
      const errors = validateBook(newBook);
      setValidationErrors(errors);
      
      if (Object.keys(errors).length > 0) {
        return;
      }
      
      // Prepare book data
      const bookData = {
        title: newBook.Title,
        author: newBook.Author,
        isbn: newBook.ISBN,
        price: parseFloat(newBook.Price),
        units: parseInt(newBook.Units),
        description: newBook.Description || '',
        supplierId: formatGuid(newBook.Supplier_Id),
        discountId: formatGuid(newBook.Discount_Id),
        image: newBook.Cover_Image
      };
      
      try {
        setLoading(true);
        let response;
        
        if (isEditingBook && bookToEdit) {
          // Update existing book
          response = await bookApi.updateBook(bookToEdit.id, bookData);
          if (response && response.success) {
            setNotification({
              open: true,
              message: 'Book updated successfully',
              severity: 'success'
            });
          } else {
            setNotification({
              open: true,
              message: response.message || 'Failed to update book',
              severity: 'error'
            });
          }
        } else {
          // Add new book
          response = await bookApi.createBook(bookData);
          if (response && response.success) {
            setNotification({
              open: true,
              message: 'Book added successfully',
              severity: 'success'
            });
          } else {
            setNotification({
              open: true,
              message: response.message || 'Failed to add book',
              severity: 'error'
            });
          }
        }
        
        // Refresh the book list
        fetchBooks();
        
        // Reset form
        setNewBook({ 
          Title: '', 
          Author: '', 
          Price: '', 
          Units: '', 
          Description: '', 
          ISBN: '',
          Supplier_Id: '',
          Discount_Id: '',
          Cover_Image: null 
        });
        setValidationErrors({});
        setShowAddForm(false);
        setIsEditingBook(false);
        setBookToEdit(null);
      } catch (err) {
        console.error('Failed to save book:', err);
        setNotification({
          open: true,
          message: 'Failed to save book. Please try again.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Show the form for adding a new book
      setIsEditingBook(false);
      setBookToEdit(null);
      setShowAddForm(true);
      setValidationErrors({});
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ p: 2 }}> 
      {/* Notification Snackbar */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Book Add Form */}
      {showAddForm && (
        <Paper elevation={0} sx={{ 
          p: 3, 
          mb: 3, 
          bgcolor: '#1E201E',
          borderRadius: 1
        }}>
          <BookForm 
            newBook={newBook}
            handleNewBookChange={handleNewBookChange}
            handleImageChange={handleImageChange}
            validationErrors={validationErrors}
          />
        </Paper>
      )}

      {/* Search controls and Table */}
      <Paper elevation={0} sx={{ mb: 3, bgcolor: '#1E201E' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <TextField
            placeholder="Search Books"
            size="small"
            value={filter}
            onChange={handleFilterChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'white' }} />
                </InputAdornment>
              ),
              style: { color: 'white' }
            }}
            sx={{ 
              width: '60%',
              '& .MuiOutlinedInput-root': {
                bgcolor: '#2A2D2A',
                borderRadius: 1,
                borderColor: '#61677A',
                color: 'white'
              },
              '& .MuiOutlinedInput-input': {
                color: 'white'
              }
            }}
          />
          <Box sx={{ display: 'flex', gap: 0, ml: 2 }}>
            {showAddForm && (
              <Button
                variant="outlined"
                size="medium"
                onClick={handleCancel}
                disabled={loading}
                sx={{ 
                  minWidth: 100,
                  borderColor: '#61677A',
                  color: '#D8D9DA',
                  '&:hover': {
                    borderColor: '#6D7386',
                    bgcolor: 'rgba(109, 115, 134, 0.1)'
                  }
                }}
              >
                CANCEL
              </Button>
            )}
            <Button
              variant="contained"
              size="medium"
              onClick={handleAddOrUpdateBook}
              disabled={loading}
              sx={{ 
                ml: 2,
                minWidth: 120,
                bgcolor: '#61677A',
                color: 'white',
                '&:hover': {
                  bgcolor: '#6D7386'
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                isEditingBook ? 'UPDATE BOOK' : 'ADD BOOK'
              )}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Loading state */}
      {loading && !showAddForm && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Book Table */}
      {!loading && !error && (
        <BookTable 
          books={books} 
          onEdit={handleEditBook} 
          onDelete={handleDeleteBook} 
        />
      )}

      {/* Delete Book Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: '#2A2D2A',
            color: '#D8D9DA',
            borderRadius: 1,
            border: '1px solid #61677A'
          }
        }}
      >
        <DialogTitle>Are You Sure?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#D8D9DA' }}>
            Deleting &ldquo;{itemToDelete?.title}&rdquo; cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            disabled={loading}
            sx={{ 
              color: '#D8D9DA',
              '&:hover': { bgcolor: 'rgba(216, 217, 218, 0.1)' }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDeleteBook}
            disabled={loading}
            sx={{ 
              color: '#ff6b6b',
              '&:hover': { bgcolor: 'rgba(255, 107, 107, 0.1)' }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookSection; 
import { useState } from 'react';
import { 
  Box, 
  TextField,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  UploadFile as UploadFileIcon,
} from '@mui/icons-material'; 

import BookForm from './BookForm';

const BookSection = () => {
  // Books data state
  const [books, setBooks] = useState([
    { 
      id: 1, 
      title: 'To Kill a Mockingbird', 
      author: 'Harper Lee', 
      isbn: '9780061120084', 
      supplier_id: '1', 
      price: 12.99, 
      units: 42, 
      description: 'A classic novel about racial injustice in the American South.',
      added_at: new Date('2023-09-15'),
      image: 'https://m.media-amazon.com/images/I/71FxgtFKcQL._AC_UF1000,1000_QL80_.jpg'
    },
    { 
      id: 2, 
      title: 'The Great Gatsby', 
      author: 'F. Scott Fitzgerald', 
      isbn: '9780743273565', 
      supplier_id: '2', 
      price: 14.50, 
      units: 28, 
      description: 'A portrait of the Jazz Age in all of its decadence and excess.',
      added_at: new Date('2023-10-22'),
      image: 'https://m.media-amazon.com/images/I/71FxgtFKcQL._AC_UF1000,1000_QL80_.jpg'
    },
    { 
      id: 3, 
      title: 'Harry Potter and the Sorcerer\'s Stone', 
      author: 'J.K. Rowling', 
      isbn: '9780590353427', 
      supplier_id: '3', 
      price: 24.99, 
      units: 67, 
      description: 'The first book in the Harry Potter series, introducing young wizard Harry Potter.',
      added_at: new Date('2023-11-10'),
      image: 'https://m.media-amazon.com/images/I/71FxgtFKcQL._AC_UF1000,1000_QL80_.jpg'
    },
  ]);
  
  // Form state
  const [filter, setFilter] = useState('');
  const [newBook, setNewBook] = useState({ 
    title: '', 
    author: '', 
    distributor: '', 
    price: '', 
    units: '', 
    description: '', 
    isbn: '',
    supplier_id: '',
    discount_id: '',
    image: null 
  });

  // UI state
  const [showAddForm, setShowAddForm] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isEditingBook, setIsEditingBook] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleNewBookChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewBook((prev) => ({ ...prev, image: e.target.files[0] }));
    }
  };

  const validateBook = (book) => {
    const errors = {};
    
    // Check required fields based on Book model
    if (!book.title.trim()) errors.title = 'Title is required';
    if (!book.author.trim()) errors.author = 'Author is required';
    if (!book.isbn.trim()) errors.isbn = 'ISBN is required';
    if (!book.price || isNaN(parseFloat(book.price)) || parseFloat(book.price) <= 0) 
      errors.price = 'Valid price is required';
    if (!book.units || isNaN(parseInt(book.units)) || parseInt(book.units) < 0) 
      errors.units = 'Valid units count is required';
    
    return errors;
  };

  const handleEditBook = (book) => {
    setBookToEdit(book);
    setNewBook({
      title: book.title,
      author: book.author,
      distributor: book.distributor || '',
      price: book.price.toString(),
      units: book.units.toString(),
      description: book.description || '',
      isbn: book.isbn || '',
      supplier_id: book.supplier_id || '',
      discount_id: book.discount_id || '',
      image: book.image || null
    });
    setIsEditingBook(true);
    setShowAddForm(true);
    setValidationErrors({});
  };

  const handleDeleteBook = (book) => {
    setItemToDelete(book);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteBook = () => {
    if (itemToDelete) {
      setBooks((prev) => prev.filter((book) => book.id !== itemToDelete.id));
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setIsEditingBook(false);
    setBookToEdit(null);
    setNewBook({ 
      title: '', 
      author: '', 
      distributor: '', 
      price: '', 
      units: '', 
      description: '', 
      isbn: '',
      supplier_id: '',
      discount_id: '',
      image: null 
    });
    setValidationErrors({});
  };

  const addBook = () => {
    if (showAddForm) {
      // Validate required fields
      const errors = validateBook(newBook);
      setValidationErrors(errors);
      
      // If there are validation errors, don't add/update the book
      if (Object.keys(errors).length > 0) {
        return;
      }
      
      // All validation passed, add or update the book
      const numericPrice = parseFloat(newBook.price);
      const numericUnits = parseInt(newBook.units);
      
      if (isEditingBook && bookToEdit) {
        // Update existing book
        const updatedBook = {
          ...bookToEdit,
          title: newBook.title,
          author: newBook.author,
          distributor: newBook.distributor || 'Unknown',
          price: numericPrice,
          units: numericUnits,
          description: newBook.description,
          isbn: newBook.isbn,
          supplier_id: newBook.supplier_id,
          discount_id: newBook.discount_id,
          image: newBook.image,
          updated_at: new Date()
        };
        
        setBooks((prev) => prev.map((book) => 
          book.id === bookToEdit.id ? updatedBook : book
        ));
        setIsEditingBook(false);
        setBookToEdit(null);
      } else {
        // Add new book
        const bookToAdd = {
          id: books.length + 1,
          title: newBook.title,
          author: newBook.author,
          distributor: newBook.distributor || 'Unknown',
          price: numericPrice,
          units: numericUnits,
          description: newBook.description,
          isbn: newBook.isbn,
          supplier_id: newBook.supplier_id,
          discount_id: newBook.discount_id,
          added_at: new Date()
        };
        
        setBooks((prev) => [...prev, bookToAdd]);
      }
      
      // Reset form
      setNewBook({ 
        title: '', 
        author: '', 
        distributor: '', 
        price: '', 
        units: '', 
        description: '', 
        isbn: '',
        supplier_id: '',
        discount_id: '',
        image: null 
      });
      setValidationErrors({});
      setShowAddForm(false);
    } else {
      // Show the form for adding a new book
      setIsEditingBook(false);
      setBookToEdit(null);
      setShowAddForm(true);
      setValidationErrors({});
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(filter.toLowerCase()) ||
    book.author.toLowerCase().includes(filter.toLowerCase()) ||
    (book.distributor && book.distributor.toLowerCase().includes(filter.toLowerCase())) ||
    (book.isbn && book.isbn.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <Box sx={{ p: 2 }}> 
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
              onClick={addBook}
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
              {isEditingBook ? 'UPDATE BOOK' : 'ADD BOOK'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Table with lighter background */}
      <Paper elevation={2} sx={{ bgcolor: '#2A2D2A', borderRadius: 1, border: '1px solid #61677A' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }}>
          <Table stickyHeader>
            <TableHead sx={{ borderBottom: '3px solid #61677A' }}>
              <TableRow>
                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Title</TableCell>
                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Author</TableCell>
                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>ISBN</TableCell>
                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Supplier ID</TableCell>
                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Price</TableCell>
                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Units</TableCell>
                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Added Date</TableCell>
                <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBooks.map((book) => (
                <TableRow key={book.id} sx={{ 
                  '&:last-child td, &:last-child th': { 
                    border: 0 
                  },
                  '& td': {
                    borderColor: '#61677A'
                  }
                }}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.isbn || 'N/A'}</TableCell>
                  <TableCell>{book.supplier_id || 'N/A'}</TableCell>
                  <TableCell>${book.price.toFixed(2)}</TableCell>
                  <TableCell>{book.units}</TableCell>
                  <TableCell>{book.added_at ? new Date(book.added_at).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleEditBook(book)}
                        sx={{ 
                          color: '#6D7386',
                          mr: 1,
                          '&:hover': { 
                            bgcolor: 'rgba(109, 115, 134, 0.1)' 
                          }
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteBook(book)}
                        sx={{ 
                          color: '#ff6b6b',
                          '&:hover': { 
                            bgcolor: 'rgba(255, 107, 107, 0.1)' 
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {filteredBooks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No books found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

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
            sx={{ 
              color: '#D8D9DA',
              '&:hover': { bgcolor: 'rgba(216, 217, 218, 0.1)' }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDeleteBook}
            sx={{ 
              color: '#ff6b6b',
              '&:hover': { bgcolor: 'rgba(255, 107, 107, 0.1)' }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookSection; 
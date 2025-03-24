import PropTypes from 'prop-types';
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

const BookTable = ({ books, onEdit, onDelete }) => {
  return (
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
            {books.length > 0 ? (
              books.map((book) => (
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
                  <TableCell>{book.supplier_Id ? book.supplier_Id.substring(0, 8) : 'N/A'}</TableCell>
                  <TableCell>${book.price.toFixed(2)}</TableCell>
                  <TableCell>{book.units}</TableCell>
                  <TableCell>{book.added_At ? new Date(book.added_At).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      <IconButton 
                        size="small" 
                        onClick={() => onEdit(book)}
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
                        onClick={() => onDelete(book)}
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
              ))
            ) : (
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
  );
};

BookTable.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      isbn: PropTypes.string,
      supplierId: PropTypes.string,
      price: PropTypes.number.isRequired,
      units: PropTypes.number.isRequired,
      addedAt: PropTypes.string
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default BookTable; 
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
              <TableCell sx={{ py: 1.0, bgcolor: '#2A2D2A' }}>Title</TableCell>
              <TableCell sx={{ py: 1.0, bgcolor: '#2A2D2A' }}>Author</TableCell>
              <TableCell sx={{ py: 1.0, bgcolor: '#2A2D2A' }}>ISBN</TableCell>
              <TableCell sx={{ py: 1.0, bgcolor: '#2A2D2A' }}>Supplier</TableCell>
              <TableCell sx={{ py: 1.0, bgcolor: '#2A2D2A' }}>Genre</TableCell>
              <TableCell sx={{ py: 1.0, bgcolor: '#2A2D2A' }}>Price</TableCell>
              <TableCell sx={{ py: 1.0, bgcolor: '#2A2D2A' }}>Units</TableCell>
              <TableCell sx={{ py: 1.0, bgcolor: '#2A2D2A' }}>Added Date</TableCell>
              <TableCell sx={{ py: 1.0, bgcolor: '#2A2D2A' }}></TableCell>
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
                  <TableCell>{book.supplierName || 'N/A'}</TableCell>
                  <TableCell>{book.categories || 'N/A'}</TableCell>
                  <TableCell>${book.price.toFixed(2)}</TableCell>

                  <TableCell sx={{ color: book.units <= 10 ? '#FF3333' : 'inherit'}}>
                    {book.units}
                  </TableCell>
                  <TableCell>{book.added_At ? new Date(book.added_At).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        onClick={() => onEdit(book)}
                        sx={{ color: '#61677A' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => onDelete(book)}
                        sx={{ color: '#EF4040' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
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
  books: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default BookTable; 
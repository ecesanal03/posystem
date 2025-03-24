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

const SupplierTable = ({ suppliers, onEdit, onDelete }) => { 
  return (
    <Paper elevation={2} sx={{ bgcolor: '#2A2D2A', borderRadius: 1, border: '1px solid #61677A' }}>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
        <Table stickyHeader>
          <TableHead sx={{ borderBottom: '3px solid #61677A' }}>
            <TableRow>
              <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Name</TableCell>
              <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Primary Contact</TableCell>
              <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Email</TableCell>
              <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Phone</TableCell>
              <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Address</TableCell>
              <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Added Date</TableCell>
              <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <TableRow key={supplier.id} sx={{ 
                  '&:last-child td, &:last-child th': { 
                    border: 0 
                  },
                  '& td': {
                    borderColor: '#61677A'
                  }
                }}>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.contact_person}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>
                    {[
                      supplier.address, 
                      supplier.city, 
                      supplier.state, 
                      supplier.zip,
                      supplier.country
                    ].filter(Boolean).join(', ') || 'N/A'}
                  </TableCell>
                  <TableCell>{supplier.added_at ? new Date(supplier.added_at).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      <IconButton 
                        size="small" 
                        onClick={() => onEdit(supplier)}
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
                        onClick={() => onDelete(supplier)}
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
                <TableCell colSpan={7} align="center">
                  No suppliers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

SupplierTable.propTypes = {
  suppliers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      contact_person: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
      address: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      zip: PropTypes.string,
      country: PropTypes.string,
      added_at: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default SupplierTable; 
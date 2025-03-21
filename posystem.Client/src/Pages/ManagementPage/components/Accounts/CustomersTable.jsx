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
  Chip,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const CustomersTable = ({ customers, onDelete }) => {
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Paper elevation={2} sx={{ 
      bgcolor: '#2A2D2A', 
      borderRadius: 1, 
      border: '1px solid #61677A',
      width: '100%'
    }}>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
        <Table stickyHeader>
          <TableHead sx={{ borderBottom: '3px solid #61677A' }}>
            <TableRow>
              <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Customer ID</TableCell>
              <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Name</TableCell>
              <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Email</TableCell>
              <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Registration Date</TableCell>
              <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Orders</TableCell>
              <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Total Spent</TableCell>
              <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <TableRow 
                  key={customer.id} 
                  hover
                  sx={{ 
                    '&:last-child td, &:last-child th': { 
                      border: 0 
                    },
                    '& td': {
                      borderColor: '#61677A'
                    },
                    '&:hover': {
                      bgcolor: 'rgba(97, 103, 122, 0.1)'
                    }
                  }}
                >
                  <TableCell>{customer.user_id}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{formatDate(customer.registration_date)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={customer.orders_count}
                      size="small"
                      variant="outlined"
                      sx={{
                        bgcolor: 'rgba(33, 150, 243, 0.1)',
                        color: '#2196f3',
                        borderColor: '#2196f3',
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }}
                    />
                  </TableCell>
                  <TableCell>{formatCurrency(customer.total_spent)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      <IconButton 
                        size="small" 
                        onClick={() => onDelete(customer)}
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
                  No customers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

CustomersTable.propTypes = {
  customers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      user_id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string,
      address: PropTypes.string,
      registration_date: PropTypes.string.isRequired,
      orders_count: PropTypes.number.isRequired,
      total_spent: PropTypes.number.isRequired
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired
};

export default CustomersTable;

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
import { useMemo } from 'react';

const CustomersTable = ({ customers, onDelete }) => {
  // Log the incoming customer props for debugging
  //console.log('CustomersTable received customers:', customers);

  // Memoized formatters to prevent unnecessary re-renders
  const formatCurrency = useMemo(() => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    });
    return (amount) => {
      // Handle NaN, undefined or null values
      if (amount === undefined || amount === null || isNaN(amount)) {
        console.log('formatCurrency: Invalid amount value:', amount);
        return '$0.00';
      }
      return formatter.format(amount);
    };
  }, []);

  // Table is already using customer data directly from API
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
              customers.map((customer, index) => {
                //console.log(`Rendering customer ${index}:`, customer);
                return (
                <TableRow 
                  key={customer.Id || customer.id || `customer-${index}`} 
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
                  <TableCell>{customer.Id || customer.id || 'N/A'}</TableCell>
                  <TableCell>{customer.Name || customer.name || 'N/A'}</TableCell>
                  <TableCell>{customer.Email || customer.email || 'N/A'}</TableCell>
                  <TableCell>{customer.Created_At || customer.created_At || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={Number.isFinite(Number(customer.Orders || customer.orders)) ? Number(customer.Orders || customer.orders) : 0}
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
                  <TableCell>{formatCurrency(Number(customer.Total_Spent || customer.total_Spent || 0))}</TableCell>
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
              )})
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
      Id: PropTypes.string,
      Name: PropTypes.string,
      Email: PropTypes.string,
      Created_At: PropTypes.string,
      Orders: PropTypes.number,
      Total_Spent: PropTypes.number
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired
};

export default CustomersTable;

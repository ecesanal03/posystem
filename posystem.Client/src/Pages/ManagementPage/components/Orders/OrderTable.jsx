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
  Chip
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const OrderTable = ({ orders, onView, onDelete }) => {
  // Function to determine status chip color
  const getStatusColor = (status) => {
    if (!status) return {
      bgcolor: 'rgba(158, 158, 158, 0.1)',
      color: '#9e9e9e',
      borderColor: '#9e9e9e'
    };

    const statusColors = {
      delivered: {
        bgcolor: 'rgba(76, 175, 80, 0.1)',
        color: '#4caf50',
        borderColor: '#4caf50'
      },
      processing: {
        bgcolor: 'rgba(33, 150, 243, 0.1)',
        color: '#2196f3',
        borderColor: '#2196f3'
      },
      shipped: {
        bgcolor: 'rgba(255, 152, 0, 0.1)',
        color: '#ff9800',
        borderColor: '#ff9800'
      },
      cancelled: {
        bgcolor: 'rgba(244, 67, 54, 0.1)',
        color: '#f44336',
        borderColor: '#f44336'
      }
    };

    return statusColors[status.toLowerCase()] || statusColors.processing;
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Pending';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <Paper elevation={2} sx={{ bgcolor: '#2A2D2A', borderRadius: 1, border: '1px solid #61677A' }}>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
        <Table stickyHeader>
          <TableHead sx={{ borderBottom: '3px solid #61677A' }}>
            <TableRow>
              <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Order ID</TableCell>
              <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Customer Email</TableCell>
              <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Order Date</TableCell>
              <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Delivery Date</TableCell>
              <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Status</TableCell>
              <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Total</TableCell>
              <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(orders) && orders.length > 0 ? (
              orders.map((order) => (
                <TableRow 
                  key={order.id || `order-${Math.random()}`}
                  hover
                  onClick={() => onView(order)}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    '& td': { borderColor: '#61677A' },
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'rgba(97, 103, 122, 0.1)' }
                  }}
                >
                  <TableCell>#{order.id || 'N/A'}</TableCell>
                  <TableCell>{order.customer_Email || 'N/A'}</TableCell>
                  <TableCell>{formatDate(order.order_Date)}</TableCell>
                  <TableCell>{formatDate(order.delivery_Date)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={order.order_Status || 'Processing'}
                      size="small"
                      variant="outlined"
                      sx={{
                        ...getStatusColor(order.order_Status),
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }}
                    />
                  </TableCell>
                  <TableCell>{formatCurrency(order.total_Amount || 0)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(order);
                        }}
                        sx={{ 
                          color: '#ff6b6b',
                          '&:hover': { bgcolor: 'rgba(255, 107, 107, 0.1)' }
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
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

OrderTable.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      customer_Email: PropTypes.string,
      order_Date: PropTypes.string,
      delivery_Date: PropTypes.string,
      order_Status: PropTypes.string,
      total_Amount: PropTypes.number,
    })
  ).isRequired,
  onView: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default OrderTable;

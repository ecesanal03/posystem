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
import { Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';

const OrderTable = ({ orders, onView, onDelete }) => {
  // Function to determine color based on status
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return {
          bgcolor: 'rgba(76, 175, 80, 0.1)',
          color: '#4caf50',
          borderColor: '#4caf50'
        };
      case 'processing':
        return {
          bgcolor: 'rgba(33, 150, 243, 0.1)',
          color: '#2196f3',
          borderColor: '#2196f3'
        };
      case 'shipped':
        return {
          bgcolor: 'rgba(255, 152, 0, 0.1)',
          color: '#ff9800',
          borderColor: '#ff9800'
        };
      case 'cancelled':
        return {
          bgcolor: 'rgba(244, 67, 54, 0.1)',
          color: '#f44336',
          borderColor: '#f44336'
        };
      default:
        return {
          bgcolor: 'rgba(158, 158, 158, 0.1)',
          color: '#9e9e9e',
          borderColor: '#9e9e9e'
        };
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow 
                  key={order.id} 
                  hover
                  onClick={() => onView(order)}
                  sx={{ 
                    '&:last-child td, &:last-child th': { 
                      border: 0 
                    },
                    '& td': {
                      borderColor: '#61677A'
                    },
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'rgba(97, 103, 122, 0.1)'
                    }
                  }}
                >
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>{order.customer_email}</TableCell>
                  <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {order.delivery_date 
                      ? new Date(order.delivery_date).toLocaleDateString() 
                      : 'Pending'}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={order.status}
                      size="small"
                      variant="outlined"
                      sx={{
                        ...getStatusColor(order.status),
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {formatCurrency(order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                  </TableCell>
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

export default OrderTable; 
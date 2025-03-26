import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  FormControl,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';

const OrderDetailDialog = ({ order, open, onClose, onStatusChange }) => {
  if (!order) return null;
  
  console.log("Order passed to dialog:", order); // Debug the order object

  // Calculate order totals - using the pre-calculated values from the backend
  const subtotal = order.Subtotal || 0;
  const tax = order.Tax || 0;
  const total = order.Total || 0;
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const getStatusColor = (status) => {
    if (!status) return 'text.primary'; // Default color for undefined or null status
  
    switch (status.toLowerCase()) {
      case 'delivered':
        return '#4caf50';
      case 'processing':
        return '#2196f3';
      case 'shipped':
        return '#ff9800';
      case 'cancelled':
        return '#f44336';
      default:
        return 'text.primary';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#25292A',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          color: 'white',
          borderRadius: 2,
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          m: { xs: 1, sm: 2, md: 3 },
          overflowY: 'auto'
        }
      }}
    >
      <DialogTitle sx={{ 
        pt: 2,
        pb: 1,
        px: 4,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 400, letterSpacing: '0.5px', mb: 0.5 }}>
            INVOICE #{order.Id}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150, mr: 2 }}>
            <Select
              value={order.Order_Status || "Processing"} // Default to "Processing" if undefined
              onChange={(e) => onStatusChange(order.Id, e.target.value)}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                '& .MuiSelect-select': { py: 1 },
                borderRadius: 1
              }}
            >
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={onClose} sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, mb: 4 }}>
          {/* Customer Information */}
          <Box sx={{ flex: 1, mr: { xs: 0, sm: 4 }, mb: { xs: 3, sm: 0 } }}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1, fontSize: '0.85rem' }}>
              BILLED TO
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
              {order.Customer_Name} <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>ID# {order.Customer_Id}</Typography>
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              {order.Customer_Phone}<br />
              {order.Customer_Email}<br />
              {order.Customer_Address}
            </Typography>
          </Box>
          
          {/* Invoice Details */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1, fontSize: '0.85rem' }}>
              INVOICE DETAILS
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Invoice Date:</Typography>
              <Typography variant="body2">
                {new Date(order.Order_Date).toLocaleDateString()}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Status:</Typography>
              <Typography variant="body2" sx={{ color: getStatusColor(order.Order_Status), fontWeight: 500 }}>
                {order.Order_Status}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Payment Method:</Typography>
              <Typography variant="body2">
                {order.Payment_Method}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Card Last 4-Digits:</Typography>
              <Typography variant="body2">
                {order.Card_Number}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* Order Items */}
        <TableContainer sx={{ mb: 4, bgcolor: 'rgba(0, 0, 0, 0.15)', borderRadius: 1 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ 
                bgcolor: 'rgba(0, 0, 0, 0.4)',
                '& th': { 
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  letterSpacing: '0.5px'
                }
              }}>
                <TableCell>ITEM</TableCell>
                <TableCell align="center">QTY</TableCell>
                <TableCell align="right">PRICE</TableCell>
                <TableCell align="right">TOTAL</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(order.Items || []).map((item) => ( // Fallback to empty array if items is undefined
                <TableRow key={item.id} sx={{ '& td': { borderColor: 'rgba(255, 255, 255, 0.05)' } }}>
                  <TableCell sx={{ py: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      ISBN: {item.isbn}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                  <TableCell align="right">{formatCurrency(item.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Total Summary */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-end',
          p: 3,
          borderRadius: 1,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          bgcolor: 'rgba(0, 0, 0, 0.15)',
          mb: 3
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: { xs: '100%', sm: '50%', md: '40%' }, mb: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Subtotal:</Typography>
            <Typography variant="body2">{formatCurrency(subtotal)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: { xs: '100%', sm: '50%', md: '40%' }, mb: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Tax (8.5%):</Typography>
            <Typography variant="body2">{formatCurrency(tax)}</Typography>
          </Box>
          <Divider sx={{ width: { xs: '100%', sm: '50%', md: '40%' }, my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: { xs: '100%', sm: '50%', md: '40%' } }}>
            <Typography variant="subtitle2">Total:</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{formatCurrency(total)}</Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

OrderDetailDialog.propTypes = {
  order: PropTypes.shape({
    Id: PropTypes.string.isRequired,
    Order_Date: PropTypes.string.isRequired,
    Delivery_Date: PropTypes.string,
    Order_Status: PropTypes.string.isRequired,
    Customer_Id: PropTypes.string.isRequired,
    Customer_Email: PropTypes.string.isRequired,
    Customer_Name: PropTypes.string.isRequired,
    Customer_Phone: PropTypes.string.isRequired,
    Customer_Address: PropTypes.string.isRequired,
    Items: PropTypes.arrayOf(
      PropTypes.shape({
        Id: PropTypes.string.isRequired,
        BookId: PropTypes.string.isRequired,
        Name: PropTypes.string.isRequired,
        ISBN: PropTypes.string.isRequired,
        Quantity: PropTypes.number.isRequired,
        Price: PropTypes.number.isRequired,
        Total: PropTypes.number.isRequired
      })
    ).isRequired,
    Subtotal: PropTypes.number.isRequired,
    Tax: PropTypes.number.isRequired,
    Total: PropTypes.number.isRequired,
    Payment_Method: PropTypes.string.isRequired,
    Card_Number: PropTypes.string.isRequired
  }).isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired
};

export default OrderDetailDialog; 
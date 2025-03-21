import { useState } from 'react';
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
  DialogTitle
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

// Import the separated components
import OrderTable from './OrderTable';
import OrderDetailDialog from './OrderDetailDialog';

const OrdersSection = () => {
  // Orders data state
  const [orders, setOrders] = useState([
    { 
      id: 1001, 
      customer_id: "CUST2458", 
      customer_name: "Emily Rodriguez", 
      customer_email: "emily.rodriguez@gmail.com",
      customer_phone: "713-555-1234",
      customer_address: "1200 Smith St, Houston, TX 77002",
      order_date: "2023-11-10T14:30:00",
      delivery_date: "2023-11-15T12:00:00", 
      order_status: "Delivered",
      status: "Delivered",
      order_total: 85.97,
      total: 85.97,
      payment_method: "Credit Card",
      card_number: "4111111111111234",
      items: [
        { id: 101, book_id: 1, book_title: "To Kill a Mockingbird", name: "To Kill a Mockingbird", quantity: 2, price: 12.99, discount: 0, isbn: "9780061120084" },
        { id: 102, book_id: 3, book_title: "Harry Potter and the Sorcerer's Stone", name: "Harry Potter and the Sorcerer's Stone", quantity: 2, price: 24.99, discount: 0, isbn: "9780590353427" }
      ]
    },
    { 
      id: 1002, 
      customer_id: "CUST1975", 
      customer_name: "Michael Chen", 
      customer_email: "mchen@outlook.com",
      customer_phone: "512-555-8976",
      customer_address: "4801 La Crosse Ave, Austin, TX 78739",
      order_date: "2023-12-05T09:15:00",
      delivery_date: "2023-12-09T14:30:00", 
      order_status: "Processing",
      status: "Processing",
      order_total: 57.48,
      total: 57.48,
      payment_method: "PayPal",
      card_number: "",
      items: [
        { id: 103, book_id: 2, book_title: "The Great Gatsby", name: "The Great Gatsby", quantity: 1, price: 14.50, discount: 0, isbn: "9780743273565" },
        { id: 104, book_id: 3, book_title: "Harry Potter and the Sorcerer's Stone", name: "Harry Potter and the Sorcerer's Stone", quantity: 1, price: 24.99, discount: 0, isbn: "9780590353427" },
        { id: 105, book_id: 1, book_title: "To Kill a Mockingbird", name: "To Kill a Mockingbird", quantity: 1, price: 12.99, discount: 0, isbn: "9780061120084" }
      ]
    },
    { 
      id: 1003, 
      customer_id: "CUST3642", 
      customer_name: "Sophia Williams", 
      customer_email: "sophia.w@yahoo.com",
      customer_phone: "469-555-7890",
      customer_address: "8687 N Central Expy, Dallas, TX 75231",
      order_date: "2023-12-12T16:45:00",
      delivery_date: "2023-12-18T10:30:00", 
      order_status: "Shipped",
      status: "Shipped",
      order_total: 102.95,
      total: 102.95,
      payment_method: "Credit Card",
      card_number: "5555555555554444",
      items: [
        { id: 106, book_id: 3, book_title: "Harry Potter and the Sorcerer's Stone", name: "Harry Potter and the Sorcerer's Stone", quantity: 2, price: 24.99, discount: 0, isbn: "9780590353427" },
        { id: 107, book_id: 1, book_title: "To Kill a Mockingbird", name: "To Kill a Mockingbird", quantity: 3, price: 12.99, discount: 0, isbn: "9780061120084" },
        { id: 108, book_id: 2, book_title: "The Great Gatsby", name: "The Great Gatsby", quantity: 1, price: 14.50, discount: 10, isbn: "9780743273565" }
      ]
    },
    { 
      id: 1004, 
      customer_id: "CUST8927", 
      customer_name: "James Johnson", 
      customer_email: "jamesjohnson@gmail.com",
      customer_phone: "210-555-3456",
      customer_address: "1604 E Highland Blvd, San Antonio, TX 78210",
      order_date: "2023-12-14T11:20:00",
      delivery_date: null, 
      order_status: "Cancelled",
      status: "Cancelled",
      order_total: 74.97,
      total: 74.97,
      payment_method: "Debit Card",
      card_number: "4444333322221111",
      items: [
        { id: 109, book_id: 3, book_title: "Harry Potter and the Sorcerer's Stone", name: "Harry Potter and the Sorcerer's Stone", quantity: 3, price: 24.99, discount: 0, isbn: "9780590353427" }
      ]
    }
  ]);
  
  // Filter state
  const [orderFilter, setOrderFilter] = useState('');
  
  // UI state
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteOrderDialogOpen, setDeleteOrderDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const handleOrderFilterChange = (e) => {
    setOrderFilter(e.target.value);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOrderDetailOpen(true);
  };

  const handleStatusChange = (orderId, newStatus) => {
    // Update order status
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, order_status: newStatus, status: newStatus } : order
    );
    setOrders(updatedOrders);
    
    // Also update the selected order if it's open
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, order_status: newStatus, status: newStatus });
    }
  };

  const handleDeleteOrder = (order) => {
    setOrderToDelete(order);
    setDeleteOrderDialogOpen(true);
  };

  const confirmDeleteOrder = () => {
    if (orderToDelete) {
      setOrders(orders.filter(order => order.id !== orderToDelete.id));
      setDeleteOrderDialogOpen(false);
      setOrderToDelete(null);
      
      // If the deleted order is currently open in detail view, close it
      if (selectedOrder && selectedOrder.id === orderToDelete.id) {
        setOrderDetailOpen(false);
        setSelectedOrder(null);
      }
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.customer_name.toLowerCase().includes(orderFilter.toLowerCase()) ||
    order.customer_id.toLowerCase().includes(orderFilter.toLowerCase()) ||
    order.order_status.toLowerCase().includes(orderFilter.toLowerCase()) ||
    (order.id.toString()).includes(orderFilter)
  );

  return (
    <Box sx={{ p: 2 }}> 
      {/* Search controls */}
      <Paper elevation={0} sx={{ mb: 3, bgcolor: '#1E201E' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            p: 0
          }}
        >
          <TextField
            placeholder="Search Orders"
            size="small"
            value={orderFilter}
            onChange={handleOrderFilterChange}
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
        </Box>
      </Paper>

      {/* Orders Table - Now using the OrderTable component */}
      <OrderTable 
        orders={filteredOrders} 
        onView={handleViewOrder} 
        onDelete={handleDeleteOrder} 
      />

      {/* Order Detail Dialog - Now using the OrderDetailDialog component */}
      {selectedOrder && (
        <OrderDetailDialog 
          order={selectedOrder}
          open={orderDetailOpen}
          onClose={() => setOrderDetailOpen(false)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Delete Order Confirmation Dialog */}
      <Dialog
        open={deleteOrderDialogOpen}
        onClose={() => setDeleteOrderDialogOpen(false)}
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
            Deleting order #{orderToDelete?.id} for {orderToDelete?.customer_name} cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteOrderDialogOpen(false)}
            sx={{ 
              color: '#D8D9DA',
              '&:hover': { bgcolor: 'rgba(216, 217, 218, 0.1)' }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDeleteOrder}
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

export default OrdersSection; 
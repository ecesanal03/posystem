import { useState, useEffect, useMemo, useCallback } from 'react';
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
  DialogTitle,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import ordersApi from '../../../../api/ordersAPI';

// Import the separated components
import OrderTable from './OrderTable';
import OrderDetailDialog from './OrderDetailDialog';

/**
 * OrdersSection Component
 * 
 * A comprehensive component for managing orders in the system.
 * Provides functionality for:
 * - Viewing a list of orders in a table format
 * - Searching/filtering orders by various criteria
 * - Viewing detailed order information
 * - Updating order status
 * - Deleting orders
 * - Handling loading states and error messages
 * 
 * The component uses Material-UI for styling and includes:
 * - A search bar for filtering orders
 * - A table displaying order information with status indicators
 * - A detailed dialog for viewing complete order information
 * - Confirmation dialogs for destructive actions
 * - Snackbar notifications for operation feedback
 */
const OrdersSection = () => {
  // Orders data state
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter state
  const [orderFilter, setOrderFilter] = useState('');
  
  // UI state
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteOrderDialogOpen, setDeleteOrderDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  /**
   * Memoized filtered orders list based on search term.
   * Filters orders by customer email, status, or order ID.
   */
  const filteredOrders = useMemo(() => {
    if (!orderFilter.trim()) return orders;
    
    const searchTerm = orderFilter.toLowerCase().trim();
    return orders.filter((order) => {
      // Check both camelCase and snake_case property names to handle API inconsistencies
      const customerEmail = order.customerEmail || order.customer_Email || '';
      const status = order.status || order.order_Status || '';
      const id = order.id || order.Id || '';
      
      return customerEmail.toLowerCase().includes(searchTerm) ||
             status.toLowerCase().includes(searchTerm) ||
             id.toString().includes(searchTerm);
    });
  }, [orders, orderFilter]);

  /**
   * Fetches orders from the API.
   * Updates the orders state and handles loading/error states.
   */
  const fetchOrders = useCallback(async () => {
    try {
        setLoading(true);
        setError(null);
        
        const response = await ordersApi.getOrders({
            skip: 0,
            take: 100 // Fetch more records for client-side filtering
        });
        
        if (response && Array.isArray(response.orders)) {
            // Check if we need to map property names
            const firstOrder = response.orders[0];
            if (firstOrder) {
                // If the properties are in snake_case or PascalCase, map them to camelCase
                if (firstOrder.Id || firstOrder.Order_Date || firstOrder.Customer_Email) {
                    const mappedOrders = response.orders.map(order => ({
                        id: order.Id || order.id,
                        orderDate: order.Order_Date || order.orderDate,
                        deliveryDate: order.Delivery_Date || order.deliveryDate,
                        customerId: order.Customer_Id || order.customerId,
                        customerEmail: order.Customer_Email || order.customerEmail,
                        status: order.Order_Status || order.status,
                        total: order.Total_Amount || order.total
                    }));
                    setOrders(mappedOrders);
                } else {
                    // Properties are already in the expected format
                    setOrders(response.orders);
                }
            } else {
                // Empty array
                setOrders([]);
            }
        } else {
            console.error('Invalid response format:', response);
            setError('Invalid response format from server');
        }
    } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load orders. Please try again later.');
    } finally {
        setLoading(false);
    }
}, []); // Remove orderFilter dependency since we're filtering client-side now


  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /**
   * Handles changes to the search filter input.
   * Updates the filter state for client-side filtering without API calls.
   * @param {Event} e - The change event
   */
  const handleOrderFilterChange = (e) => {
    setOrderFilter(e.target.value);
    // No need to call fetchOrders() since we're filtering client-side
  };

  /**
   * Handles viewing detailed order information.
   * Fetches complete order details from the API.
   * @param {Object} order - The order to view
   */
  const handleViewOrder = async (order) => {
    try {
      setLoading(true);
      const detailedOrder = await ordersApi.getOrder(order.id); // Fetch order details
      setSelectedOrder(detailedOrder); // Pass the detailed order to the dialog
      setOrderDetailOpen(true); // Open the dialog
    } catch (err) {
      console.error('Failed to fetch order details:', err);
      setNotification({
        open: true,
        message: 'Failed to fetch order details',
        severity: 'error'
      });
    } finally {
        setLoading(false);
    }
  };

  /**
   * Handles updating the status of an order.
   * Makes API call and updates local state on success.
   * @param {string} orderId - The ID of the order to update
   * @param {string} newStatus - The new status to set
   */
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setLoading(true);
      const result = await ordersApi.updateOrderStatus(orderId, newStatus);
      
      if (result.success) {
        // Update local state after successful API call
        const updatedOrders = orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
        
        // Update selected order if it's open
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }

        setNotification({
          open: true,
          message: 'Order status updated successfully',
          severity: 'success'
        });
      } else {
        throw new Error(result.message || 'Failed to update order status');
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
      setNotification({
        open: true,
        message: err.message || 'Failed to update order status',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initiates the order deletion process.
   * Opens confirmation dialog.
   * @param {Object} order - The order to delete
   */
  const handleDeleteOrder = (order) => {
    setOrderToDelete(order);
    setDeleteOrderDialogOpen(true);
  };

  /**
   * Confirms and executes order deletion.
   * Makes API call and updates local state on success.
   */
  const confirmDeleteOrder = async () => {
    if (orderToDelete) {
      try {
        setLoading(true);
        const result = await ordersApi.deleteOrder(orderToDelete.id);
        
        if (result.success) {
          setOrders(orders.filter(order => order.id !== orderToDelete.id));
          setDeleteOrderDialogOpen(false);
          setOrderToDelete(null);
          
          // If the deleted order is currently open in detail view, close it
          if (selectedOrder && selectedOrder.id === orderToDelete.id) {
            setOrderDetailOpen(false);
            setSelectedOrder(null);
          }

          setNotification({
            open: true,
            message: 'Order deleted successfully',
            severity: 'success'
          });
        } else {
          throw new Error(result.message || 'Failed to delete order');
        }
      } catch (err) {
        console.error('Failed to delete order:', err);
        setNotification({
          open: true,
          message: err.message || 'Failed to delete order',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  /**
   * Closes the notification snackbar.
   */
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

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

      {/* Loading state */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Orders Table */}
      {!loading && !error && (
        <OrderTable 
          orders={filteredOrders} 
          onView={handleViewOrder} 
          onDelete={handleDeleteOrder} 
        />
      )}

      {/* Order Detail Dialog */}
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
            Deleting order #{orderToDelete?.Id} for {orderToDelete?.Customer_Name} cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteOrderDialogOpen(false)}
            disabled={loading}
            sx={{ 
              color: '#D8D9DA',
              '&:hover': { bgcolor: 'rgba(216, 217, 218, 0.1)' }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDeleteOrder}
            disabled={loading}
            sx={{ 
              color: '#ff6b6b',
              '&:hover': { bgcolor: 'rgba(255, 107, 107, 0.1)' }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrdersSection; 
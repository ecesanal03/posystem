import axios from './axiosInstance';

/**
 * API client for order-related operations.
 * Provides methods for retrieving and managing orders.
 */
const ordersApi = {

    getOrders: async (params = {}) => {
        try {
            // Simplify parameters to avoid 500 errors
            const queryParams = {
                skip: params.skip || 0,
                take: params.take || 100 // Fetch more records for client-side filtering
            };
            
            const response = await axios.get('/orders', { params: queryParams });
            
            if (response.data && response.data.orders && Array.isArray(response.data.orders)) {
                return {
                    orders: response.data.orders,
                    totalCount: response.data.totalCount || 0
                };
            } else if (response.data?.Orders && Array.isArray(response.data.Orders)) {
                return {
                    orders: response.data.Orders.map(order => ({
                        id: order.Id,
                        orderDate: order.Order_Date,
                        deliveryDate: order.Delivery_Date,
                        customerId: order.Customer_Id,
                        customerEmail: order.Customer_Email,
                        status: order.Order_Status,
                        total: order.Total_Amount
                    })),
                    totalCount: response.data.TotalCount || 0
                };
            } else if (Array.isArray(response.data)) {
                return {
                    orders: response.data,
                    totalCount: response.data.length
                };
            }
            throw new Error('Invalid response format from server');
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },

    getOrder: async (id) => {
        try {
            const response = await axios.get(`/orders/${id}`);
    
            if (response.data && response.data.order) {
                const order = response.data.order;
                return {
                    id: order.id,
                    orderDate: order.orderDate,
                    deliveryDate: order.deliveryDate,
                    status: order.status || "Processing",
                    customerId: order.customerId,
                    customerEmail: order.customerEmail,
                    customerName: order.customerName,
                    customerPhone: order.customerPhone,
                    customerAddress: order.customerAddress,
                    items: (order.items || []).map(item => ({
                      id: item.id,
                      bookId: item.bookId,
                      name: item.name,
                      isbn: item.isbn,
                      quantity: item.quantity,
                      price: item.price,
                      total: item.total
                    })),
                    subtotal: order.subtotal || 0,
                    tax: order.tax || 0,
                    total: order.total || 0,
                    paymentMethod: order.paymentMethod || "N/A",
                    cardNumber: order.cardNumber || "N/A"
                  };
                  
                  
            }
            throw new Error('Invalid response format');
        } catch (error) {
            console.error('Error fetching order:', error);
            throw error;
        }
    },

    updateOrderStatus: async (id, status) => {
        try {
            const response = await axios.put(`/orders/${id}/status`, { 
                Id: id,
                Order_Status: status
            });
            
            if (response.data) {
                // Normalize case for response properties to handle both camelCase and PascalCase
                return {
                    success: response.data.success ?? response.data.Success ?? false,
                    message: response.data.message ?? response.data.Message ?? 'Status updated',
                    order: response.data.order ?? response.data.Order
                };
            }
            return {
                success: false,
                message: 'Invalid response format from server'
            };
        } catch (error) {
            console.error('Error updating order:', error);
            // Return a structured error instead of throwing
            return {
                success: false,
                message: error.response?.data?.message || error.message || 'Failed to update order status'
            };
        }
    },

    deleteOrder: async (id) => {
        try {
          const response = await axios.delete(`/orders/${id}`);
          const data = response.data;
      
          // Normalize response to camelCase
          return {
            success: data.success ?? data.Success ?? false,
            message: data.message ?? data.Message ?? 'Unknown response'
          };
        } catch (error) {
          console.error(`Error deleting order with ID ${id}:`, error);
      
          // Return normalized failure
          return {
            success: false,
            message: error?.response?.data?.message || error.message || 'Failed to delete order'
          };
        }
      },
      

    placeOrder: async (orderData) => {
        const response = await axios.post('/orders/create', orderData);
        return response.data;
    }
};

export default ordersApi;

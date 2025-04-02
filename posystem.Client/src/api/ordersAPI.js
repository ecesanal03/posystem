import axios from './axiosInstance';

/**
 * API client for order-related operations.
 * Provides methods for retrieving and managing orders.
 */
const ordersApi = {
    /**
     * Retrieves a list of orders with pagination.
     * @param {Object} params - Query parameters for pagination
     * @returns {Promise<Object>} Response containing orders and total count
     */
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
            }
            
            // Fallback for other formats
            if (response.data) {
                // If response.data has Orders property (ServiceStack convention)
                if (response.data.Orders && Array.isArray(response.data.Orders)) {
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
                }
                // If response.data is already an array
                else if (Array.isArray(response.data)) {
                    return {
                        orders: response.data,
                        totalCount: response.data.length
                    };
                }
            }
            
            console.error("Unexpected response format:", response.data);
            throw new Error('Invalid response format from server');
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },

    /**
     * Retrieves detailed information about a single order.
     * @param {string} id - The unique identifier of the order
     * @returns {Promise<Object>} Response containing order details
     */
    getOrder: async (id) => {
        try {
            const response = await axios.get(`/orders/${id}`);
    
            if (response.data && response.data.order) {
                const order = response.data.order;
    
                // Ensure Items is included in the mapped object
                return {
                    id: order.id,
                    orderDate: order.order_Date,
                    deliveryDate: order.delivery_Date,
                    status: order.order_Status || "Processing", // Default to "Processing" if undefined
                    customerId: order.customer_Id,
                    customerEmail: order.customer_Email,
                    customerName: order.customer_Name,
                    customerPhone: order.customer_Phone,
                    customerAddress: order.customer_Address,
                    items: order.items.map(item => ({
                        id: item.id,
                        bookId: item.bookId,
                        name: item.name,
                        isbn: item.isbn,
                        quantity: item.quantity,
                        price: item.price,
                        total: item.total
                    })),
                    subtotal: order.subtotal || 0, // Default to 0 if undefined
                    tax: order.tax || 0, // Default to 0 if undefined
                    total: order.total || 0, // Default to 0 if undefined
                    paymentMethod: order.payment_Method || "N/A", // Default to "N/A" if undefined
                    cardNumber: order.card_Number || "N/A" // Default to "N/A" if undefined
                };
            }
    
            throw new Error('Invalid response format');
        } catch (error) {
            console.error('Error fetching order:', error);
            throw error;
        }
    },

    /**
     * Updates the status of an order.
     * @param {string} id - The unique identifier of the order
     * @param {string} status - The new status for the order
     * @returns {Promise<Object>} Response indicating success/failure
     */
    updateOrderStatus: async (id, status) => {
        try {
            const response = await axios.put(`/orders/${id}/status`, { 
                Id: id,
                Order_Status: status
            });

            // Handle the response based on the updated DTO structure
            if (response.data) {
                return {
                    success: response.data.Success,
                    message: response.data.Message,
                    order: response.data.Order ? {
                        id: response.data.Order.Id,
                        orderDate: response.data.Order.Order_Date,
                        deliveryDate: response.data.Order.Delivery_Date,
                        customerId: response.data.Order.Customer_Id,
                        customerEmail: response.data.Order.Customer_Email,
                        status: response.data.Order.Order_Status,
                        total: response.data.Order.Total_Amount,
                        items: (response.data.Order.Items || []).map(item => ({
                            id: item.Id,
                            bookId: item.BookId,
                            name: item.Name,
                            isbn: item.ISBN,
                            quantity: item.Quantity,
                            price: item.Price,
                            total: item.Total,
                            discount: item.Discount
                        }))
                    } : null
                };
            }                

            return response.data;
        } catch (error) {
            console.error('Error updating order:', error);
            throw error;
        }
    },

    /**
     * Deletes an order from the system.
     * @param {string} id - The unique identifier of the order to delete
     * @returns {Promise<Object>} Response indicating success/failure of the deletion
     */ 
    deleteOrder: async (id) => {
        try {
            const response = await axios.delete(`/orders/${id}`);

            // Handle the response based on the updated DTO structure
            if (response.data) {
                return {
                    success: response.data.Success,
                    message: response.data.Message
                };
            }

            return response.data;
        } catch (error) {
            console.error(`Error deleting order with ID ${id}:`, error);
            throw error;
        }
    }
};

export default ordersApi;
    
    


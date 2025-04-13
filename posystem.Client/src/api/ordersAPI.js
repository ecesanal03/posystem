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
                    orderDate: order.order_Date,
                    deliveryDate: order.delivery_Date,
                    status: order.order_Status || "Processing",
                    customerId: order.customer_Id,
                    customerEmail: order.customer_Email,
                    customerName: order.customer_Name,
                    customerPhone: order.customer_Phone,
                    customerAddress: order.customer_Address,
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
                    paymentMethod: order.payment_Method || "N/A",
                    cardNumber: order.card_Number || "N/A"
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
    },

    placeOrder: async (orderData) => {
        const response = await axios.post('/orders/create', orderData);
        return response.data;
    }
};

export default ordersApi;

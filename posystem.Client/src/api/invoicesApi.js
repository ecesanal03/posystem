import axios from './axiosInstance';

/**
 * API endpoints for invoice operations using shared axios instance.
 * Handles fetching and managing invoice data.
 */
const invoicesApi = {
  
  // Get all invoices for the authenticated customer with pagination and sorting
  getMyInvoices: async (params = {}) => {
    try {
      console.log('Fetching invoices...');
      const queryParams = {
        skip: params.skip || 0,
        take: params.take || 10,
        sortBy: params.sortBy || 'Invoice_Date',
        sortDesc: params.sortDesc || true
      };

      const response = await axios.get('/customers/me/invoices', { params: queryParams });
      console.log('Invoices response:', response.data);

      if (response.data && Array.isArray(response.data.invoices)) {
        const processedInvoices = response.data.invoices.map(invoice => ({
          id: invoice.id,
          invoice_Date: invoice.invoice_Date,
          customer_Id: invoice.customer_Id,
          total_Amount: invoice.total_Amount,
          order_Id: invoice.order_Id,
          payment_Id: invoice.payment_Id,
          generated_At: invoice.generated_At
        }));

        return {
          invoices: processedInvoices,
          totalCount: response.data.totalCount || 0
        };
      }

      return { invoices: [], totalCount: 0 };
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }
  /*
  // Get invoices by order ID
  getInvoicesByOrderId: async (orderId) => {
    try {
      console.log(`Fetching invoices for order: ${orderId}`);
      const response = await axios.get(`/customers/me/invoices`, {
        params: {
          orderId: orderId
        }
      });

      if (response.data && Array.isArray(response.data.Invoices)) {
        return response.data.Invoices.map(invoice => ({
          id: invoice.Id || invoice.id,
          invoice_Date: invoice.Invoice_Date || invoice.invoice_Date,
          customer_Id: invoice.Customer_Id || invoice.customer_Id,
          total_Amount: invoice.Total_Amount || invoice.total_Amount,
          order_Id: invoice.Order_Id || invoice.order_Id,
          payment_Id: invoice.Payment_Id || invoice.payment_Id,
          generated_At: invoice.Generated_At || invoice.generated_At
        }));
      }

      return [];
    } catch (error) {
      console.error(`Error fetching invoices for order ${orderId}:`, error);
      throw error;
    }
  }
    */
};

export default invoicesApi;

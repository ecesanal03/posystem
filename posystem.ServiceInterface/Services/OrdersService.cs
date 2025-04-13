using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ServiceStack;
using ServiceStack.Data;
using ServiceStack.OrmLite;
using posystem.ServiceModel;
using posystem.ServiceModel.Types;
using posystem.ServiceModel.Models;

namespace posystem.ServiceInterface.Services
{
    public class OrdersService : Service
    {

        private readonly IDbConnectionFactory _dbConnectionFactory;

        public OrdersService(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        public async Task<GetOrdersResponse> Get(GetOrdersDTO request)
        {
            using var db = _dbConnectionFactory.OpenDbConnection();
            
            // Create a join query between Orders and Customers
            var query = db.From<Orders>();

            if(!string.IsNullOrEmpty(request.SearchTerm))
            {
                query = query.Where(o =>
                o.Id.ToString().Contains(request.SearchTerm) ||
                o.Customer_Id.ToString().Contains(request.SearchTerm) ||
                o.Order_Date.ToString().Contains(request.SearchTerm));
            }

            if(!string.IsNullOrEmpty(request.SortBy))
            {
                query = request.SortDesc
                    ? query.OrderByDescending(request.SortBy)
                    : query.OrderBy(request.SortBy);
            } else {
                query = query.OrderByDescending(o => o.Order_Date);
            }

            var totalCount = await db.CountAsync(query);

            if(request.Skip > 0)
            {
                query = query.Skip(request.Skip);
            }

            if(request.Take > 0)
            {
                query = query.Take(request.Take);
            }

            var orders = await db.SelectAsync(query);
            
            string sql = @"
                SELECT 
                    o.Id, 
                    o.Order_Date, 
                    o.Delivery_Date, 
                    o.Customer_Id, 
                    o.Order_Status,
                    c.Email AS CustomerEmail,
                    (SELECT SUM(b.Price * oi.Quantity) 
                    FROM OrderItems oi 
                    JOIN Books b ON oi.Book_Id = b.Id 
                    WHERE oi.Order_Id = o.Id) AS Total_Amount
                FROM ({0}) o
                LEFT JOIN Customers c ON o.Customer_Id = c.Id
            ";

            sql = string.Format(sql, query.ToSelectStatement());

            var OrderDetails = await db.SqlListAsync<dynamic>(sql);

            var orderListItems = OrderDetails.Select(o => new OrderListItemDTO
                {
                    Id = o.Id,
                    Order_Date = o.Order_Date,
                    Delivery_Date = o.Delivery_Date,
                    Customer_Id = o.Customer_Id,
                    Order_Status = o.Order_Status,
                    Customer_Email = o.CustomerEmail ?? "N/A",
                    Total_Amount = o.Total_Amount
                }).ToList();

            return new GetOrdersResponse
            {
                Orders = orderListItems,
                TotalCount = (int)totalCount
            };

        }

        public async Task<GetOrderResponse> Get(GetOrderDTO request)
        {
            using var db = _dbConnectionFactory.OpenDbConnection();

            var order = await db.SingleByIdAsync<Orders>(request.Id);
            if (order == null)
                return new GetOrderResponse { Order = null };

            var customer = await db.SingleByIdAsync<Customers>(order.Customer_Id);

            var orderItems = await db.SelectAsync<OrderItems>(oi => oi.Order_Id == order.Id);
            var items = new List<OrderItemDTO>();
            foreach (var item in orderItems)
            {
                var book = await db.SingleByIdAsync<Books>(item.Book_Id);
                if (book != null)
                {
                    items.Add(new OrderItemDTO
                    {
                        Id = item.Id,
                        BookId = book.Id,
                        Name = book.Title,
                        ISBN = book.ISBN,
                        Quantity = item.Quantity,
                        Price = book.Price,
                        Total = item.Quantity * book.Price
                    });
                }
            }

            var invoice = await db.SingleAsync<Invoices>(i => i.Order_Id == order.Id);
            var payment = invoice != null
                ? await db.SingleByIdAsync<Payments>(invoice.Payment_Id)
                : null;

            var subtotal = items.Sum(i => i.Total);
            var taxRate = 0.085m;
            var tax = subtotal * taxRate;
            var total = subtotal + tax;

            return new GetOrderResponse
            {
                Order = new OrderDTO
{
                    Id = order.Id,
                    OrderDate = invoice?.Invoice_Date ?? order.Order_Date, 
                    DeliveryDate = order.Delivery_Date,

                    CustomerId = customer.Id,                              
                    CustomerName = $"{customer.First_Name} {customer.Last_Name}",
                    CustomerEmail = customer.Email,
                    CustomerPhone = customer.PhoneNumber,
                    CustomerAddress = $"{customer.AddressLineOne}, {customer.City}, {customer.State} {customer.ZipCode}",

                    OrderStatus = order.Order_Status,                      
                    Items = items,

                    Subtotal = subtotal,
                    Tax = tax,
                    Total = total,

                    PaymentMethod = payment?.Payment_Method ?? "N/A"
                }
            };
        }

        public async Task<UpdateOrderResponse> Put(UpdateOrderDTO request)
        {
            using var db = _dbConnectionFactory.OpenDbConnection();

            var order = await db.SingleByIdAsync<Orders>(request.Id);
            if (order == null)
            {
                return new UpdateOrderResponse
                {
                    Success = false,
                    Message = "Order not found"
                };
            }

            try
            {
                // Update order status
                order.Order_Status = request.Order_Status;
                await db.UpdateAsync(order);

                // Get customer info to build a complete response
                var customer = await db.SingleByIdAsync<Customers>(order.Customer_Id);
                if (customer == null)
                    Console.WriteLine($"[UpdateOrder] Warning: Customer not found with ID: {order.Customer_Id}");

                Console.WriteLine($"[UpdateOrder] Order status updated successfully for ID: {order.Id}");
                
                return new UpdateOrderResponse
                {
                    Success = true,
                    Message = "Order status updated successfully",
                    Order = new OrderDTO
                    {
                        Id = order.Id,
                        OrderDate = order.Order_Date,
                        DeliveryDate = order.Delivery_Date,
                        CustomerId = order.Customer_Id,
                        CustomerName = customer != null ? $"{customer.First_Name} {customer.Last_Name}" : "Unknown",
                        CustomerEmail = customer?.Email ?? "unknown@example.com",
                        CustomerPhone = customer?.PhoneNumber ?? "N/A",
                        CustomerAddress = customer != null ? $"{customer.AddressLineOne}, {customer.City}, {customer.State} {customer.ZipCode}" : "N/A",
                        OrderStatus = order.Order_Status,
                        Items = new List<OrderItemDTO>(),
                        Subtotal = 0,
                        Tax = 0,
                        Total = 0,
                        PaymentMethod = "N/A"
                    }
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[UpdateOrder] Exception during update: {ex}");
                return new UpdateOrderResponse
                {
                    Success = false,
                    Message = $"Error updating order status: {ex.Message}"
                };
            }
        }

        public async Task<DeleteOrderResponse> Delete(DeleteOrderDTO request)
        {
            using var db = _dbConnectionFactory.OpenDbConnection();

            Console.WriteLine($"[DeleteOrder] Request to delete order ID: {request.Id}");

            var order = await db.SingleByIdAsync<Orders>(request.Id);
            if (order == null)
            {
                Console.WriteLine("[DeleteOrder] Order not found.");
                return new DeleteOrderResponse {
                    Success = false,
                    Message = "Order not found"
                };
            }

            try
            {
                using var trx = db.OpenTransaction();

                Console.WriteLine("[DeleteOrder] Found order. Proceeding with cascading delete...");

                // Step 1: Find the invoice linked to this order
                var invoice = await db.SingleAsync<Invoices>(i => i.Order_Id == request.Id);
                if (invoice != null)
                {
                    Console.WriteLine($"[DeleteOrder] Found Invoice ID: {invoice.Id}");

                    // Step 2: Delete InvoiceItems
                    var invoiceItemsDeleted = await db.DeleteAsync<InvoiceItems>(x => x.Invoice_Id == invoice.Id);

                    // Step 3: Delete related Payment
                    var paymentDeleted = await db.DeleteAsync<Payments>(x => x.Id == invoice.Payment_Id);

                    // Step 4: Attempt to delete invoice
                    var invoiceDeleted = await db.ExecuteSqlAsync(
                        "DELETE FROM Invoices WHERE Id = @id",
                        new { id = invoice.Id } // just in case
                    );
                }
                else
                {
                    Console.WriteLine("[DeleteOrder] No invoice found for this order.");
                }

                // Step 5: Delete OrderItems
                var orderItemsDeleted = await db.DeleteAsync<OrderItems>(x => x.Order_Id == request.Id);

                // Step 6: Delete Order
                var orderDeleted = await db.DeleteAsync<Orders>(x => x.Id == order.Id);

                trx.Commit();

                return new DeleteOrderResponse {
                    Success = true,
                    Message = "Order and related records deleted successfully"
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[DeleteOrder] Exception during deletion: {ex}");
                return new DeleteOrderResponse {
                    Success = false,
                    Message = $"Error during deletion: {ex.Message}"
                };
            }
        }



    }
}
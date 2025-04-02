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
    public class PlaceOrderService : Service
    {

        private readonly IDbConnectionFactory _dbConnectionFactory;

        public PlaceOrderService(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        [Authenticate]
        public async Task<PlaceOrderResponse> Post(CreateOrderDTO request)
        {
            using var db = _dbConnectionFactory.OpenDbConnection();
            using var trx = db.OpenTransaction();

            try
            {
                // STEP 1: Get logged-in customer's email from the JWT token
                var email = base.GetSession().Email;
                var customer = await db.SingleAsync<Customers>(c => c.Email == email);
                var cart = await db.SingleAsync<Cart>(c => c.Customer_Id == customer.Id);

                if (customer == null)
                    throw HttpError.NotFound("Customer not found");

                var orderId = Guid.NewGuid();
                var invoiceId = Guid.NewGuid();
                var paymentId = Guid.NewGuid();

                // STEP 2: Insert Order
                var order = new Orders
                {
                    Id = orderId,
                    Order_Date = DateTime.UtcNow,
                    Customer_Id = customer.Id,
                    Order_Status = request.Order_Status ?? "Pending"
                };
                await db.InsertAsync(order);

                // 2. Insert OrderItems
                foreach (var item in request.CartItems)
                {
                    var orderItem = new OrderItems
                    {
                        Id = Guid.NewGuid(),
                        Order_Id = orderId,
                        Book_Id = item.BookId,
                        Quantity = item.Quantity
                    };
                    await db.InsertAsync(orderItem);

                    //Subtract from inventory
                    await db.ExecuteSqlAsync(@"
                        UPDATE Books 
                        SET Units = Units - @qty 
                        WHERE Id = @bookId",
                        new { qty = item.Quantity, bookId = item.BookId });
                }

                // STEP 4: Calculate total amount
                var bookIds = request.CartItems.Select(c => c.BookId).ToList();
                var cartId = cart.Id;

                var sql = $@"SELECT SUM(b.Price * ci.Quantity) 
                            FROM CartItems ci
                            JOIN Books b ON b.Id = ci.Book_Id
                            WHERE ci.Cart_Id = @cartId 
                            AND ci.Book_Id IN ({string.Join(",", bookIds.Select((_, i) => $"@id{i}"))})";

                var sqlParams = new Dictionary<string, object>
                {
                    { "cartId", cartId }
                };
                for (int i = 0; i < bookIds.Count; i++)
                    sqlParams.Add($"id{i}", bookIds[i]);

                var totalAmount = await db.ScalarAsync<decimal>(sql, sqlParams);


                // STEP 5: Insert Payment
                var payment = new Payments
                {
                    Id = paymentId,
                    Payment_Method = request.Payment_Method,
                    Payment_Status = "Completed",
                    Payment_Date = DateTime.UtcNow
                };
                await db.InsertAsync(payment);

                // STEP 6: Insert Invoice
                var invoice = new Invoices
                {
                    Id = invoiceId,
                    Invoice_Date = DateTime.UtcNow,
                    Customer_Id = customer.Id,
                    Order_Id = orderId,
                    Payment_Id = paymentId,
                    Total_Amount = totalAmount,
                    Generated_At = DateTime.UtcNow
                };
                await db.InsertAsync(invoice);

                // STEP 7: Insert Invoice Items
                foreach (var item in request.CartItems)
                {
                    var invoiceItem = new InvoiceItems
                    {
                        Id = Guid.NewGuid(),
                        Invoice_Id = invoiceId,
                        Book_Id = item.BookId,
                        Quantity = item.Quantity
                    };
                    await db.InsertAsync(invoiceItem);
                }

                // STEP 8: Clear cart
                if (cart != null)
                {
                    await db.DeleteAsync<CartItems>(ci => ci.Cart_Id == cart.Id);
                }

                trx.Commit();

                return new PlaceOrderResponse
                {
                    Success = true,
                    Message = "Order placed successfully.",
                    OrderId = orderId,
                    InvoiceId = invoiceId
                };
            }
            catch (Exception ex)
            {
                trx.Rollback();
                return new PlaceOrderResponse
                {
                    Success = false,
                    Message = $"Error placing order: {ex.Message}"
                };
            }
        }

    }
}

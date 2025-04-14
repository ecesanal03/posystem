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
    [Authenticate]
    public class InvoicesService : Service
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;

        public InvoicesService(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        public async Task<GetInvoicesResponse> Get(GetMyInvoicesDTO request)
        {
            using var db = _dbConnectionFactory.OpenDbConnection();
            
            var email = base.GetSession().Email;
            if (string.IsNullOrEmpty(email))
                throw HttpError.Unauthorized("User email not found in session");

            // Get the customer ID first
            var customer = await db.SingleAsync<Customers>(c => c.Email == email);
            if (customer == null)
                throw HttpError.NotFound("Customer not found");

            // Create the base query for invoices
            var query = db.From<Invoices>()
                .Where(i => i.Customer_Id == customer.Id);

            // Apply sorting if specified
            if (!string.IsNullOrEmpty(request.SortBy))
            {
                query = request.SortDesc
                    ? query.OrderByDescending(request.SortBy)
                    : query.OrderBy(request.SortBy);
            }
            else
            {
                // Default sort by Invoice_Date descending
                query = query.OrderByDescending(i => i.Invoice_Date);
            }

            // Get total count for pagination
            var totalCount = await db.CountAsync(query);

            // Apply pagination
            if (request.Skip > 0)
                query = query.Skip(request.Skip);
            if (request.Take > 0)
                query = query.Take(request.Take);

            // Execute the query
            var invoices = await db.SelectAsync(query);

            // Map to DTOs
            var invoiceDTOs = invoices.Select(i => new InvoiceDTO
            {
                Id = i.Id,
                Invoice_Date = i.Invoice_Date,
                Customer_Id = i.Customer_Id,
                Total_Amount = i.Total_Amount,
                Order_Id = i.Order_Id,
                Payment_Id = i.Payment_Id,
                Generated_At = i.Generated_At
            }).ToList();

            return new GetInvoicesResponse
            {
                Invoices = invoiceDTOs,
                TotalCount = (int)totalCount
            };
        }
    }
}

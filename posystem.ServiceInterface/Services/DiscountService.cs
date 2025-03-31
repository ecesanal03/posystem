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
    public class DiscountService : Service
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;

        public DiscountService(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        public async Task<GetDiscountsResponse> Get(GetDiscountsDTO request)
        {
            using var db = _dbConnectionFactory.OpenDbConnection();

            var query = db.From<Discounts>();

                        // Applt filtering by search term if provided
            if(!string.IsNullOrEmpty(request.SearchTerm))
            {
                query = query.Where(d => 
                d.Discount_Name.Contains(request.SearchTerm) ||
                d.Start_Date.ToString().Contains(request.SearchTerm) ||
                d.Employee_id.ToString().Contains(request.SearchTerm));
            }

            // Apply sorting
            if(!string.IsNullOrEmpty(request.SortBy))
            {
                query = request.SortDesc
                    ? query.OrderByDescending(request.SortBy)
                    : query.OrderBy(request.SortBy);
            } else {
                query = query.OrderByDescending(d => d.Start_Date);
            }

            // Get total count for pagination
            var totalCount = await db.CountAsync(query);

            if(request.Skip > 0)
                query = query.Skip(request.Skip);
            
            if(request.Take > 0)
                query = query.Take(request.Take);

            var discounts = await db.SelectAsync(query);

            // Map to DTOs
            string sql = @"
                SELECT 
                    d.Id, 
                    d.Percentage, 
                    d.Start_Date, 
                    d.End_Date, 
                    CONCAT(e.First_Name, ' ', e.Last_Name) AS Employee_Name, 
                    d.Discount_Name
                FROM Discounts d
                LEFT JOIN Employees e ON d.Employee_id = e.Id
                ORDER BY d.End_Date DESC";

            var discountDtos = await db.SelectAsync<DiscountDTO>(sql);

            // Log the results
            Console.WriteLine("Query returned {0} discounts", discountDtos.Count);
            foreach (var discount in discountDtos)
            {
                Console.WriteLine("{0}, {1}, {2}, {3}, {4}, {5}",
                    discount.Id,
                    discount.Percentage,
                    discount.Start_Date,
                    discount.End_Date,
                    discount.Employee_Name,
                    discount.Discount_Name);
            }
            
            return new GetDiscountsResponse
            {
                Discounts = discountDtos,
                TotalCount = (int)totalCount
            };
        }
        public async Task<GetDiscountResponse> Get(GetDiscountDTO request)
        {
            using var db = _dbConnectionFactory.OpenDbConnection();

            string sql = @"
                SELECT 
                    d.Id, 
                    d.Percentage, 
                    d.Start_Date, 
                    d.End_Date, 
                    CONCAT(e.First_Name, ' ', e.Last_Name) AS Employee_Name, 
                    d.Discount_Name
                FROM Discounts d
                LEFT JOIN Employees e ON d.Employee_id = e.Id
                WHERE d.Id = @Id";

            var discountDto = await db.SingleAsync<DiscountDTO>(sql, new { Id = request.Id });

            if(discountDto == null)
                throw HttpError.NotFound("Discount not found");

            return new GetDiscountResponse { Discount = discountDto };
        }

        public async Task<CreateDiscountResponse> Post(CreateDiscountDTO request)
        {
            using var db = _dbConnectionFactory.OpenDbConnection();
            
            var existingDiscount = await db.SingleAsync<Discounts>(x => x.Discount_Name == request.Discount_Name);

            if(existingDiscount != null)
            {
                return new CreateDiscountResponse { 
                    Success = false,
                    Message = "Discount name already exists." 
                };
            }

            var newDiscount = new Discounts
            {
                Id = Guid.NewGuid(),
                Percentage = request.Percentage,
                Start_Date = request.Start_Date,
                End_Date = request.End_Date,
                Employee_id = request.Employee_id,
                Discount_Name = request.Discount_Name
            };

            await db.InsertAsync(newDiscount);

            Console.WriteLine($"Discount created: {newDiscount.Discount_Name}");

            // Create DTO for response
            var employee = await db.SingleByIdAsync<Employees>(newDiscount.Employee_id);
            string employeeName = employee != null 
                ? $"{employee.First_Name} {employee.Last_Name}"
                : "Unknown";
                
            var discountDto = new DiscountDTO
            {
                Id = newDiscount.Id,
                Percentage = newDiscount.Percentage,
                Start_Date = newDiscount.Start_Date,
                End_Date = newDiscount.End_Date,
                Employee_id = newDiscount.Employee_id,
                Discount_Name = newDiscount.Discount_Name
            };

            return new CreateDiscountResponse { 
                Success = true, 
                Message = "Discount created successfully.",
                Discount = discountDto
            };
        }

        public async Task<UpdateDiscountResponse> Put(UpdateDiscountDTO request)
        {
            using var db = _dbConnectionFactory.OpenDbConnection();

            Console.WriteLine($"Attempting to update discount with ID: {request.Id}");
            var discount = await db.SingleByIdAsync<Discounts>(request.Id);

            if(discount == null)
            {
                Console.WriteLine($"Discount with ID {request.Id} not found");
                return new UpdateDiscountResponse { 
                    Success = false,
                    Message = "Discount not found" 
                };
            }

            // Update discount properties with fields from request
            discount.Percentage = request.Percentage;
            discount.Start_Date = request.Start_Date;
            discount.End_Date = request.End_Date;
            discount.Discount_Name = request.Discount_Name;

            await db.UpdateAsync(discount);

            Console.WriteLine($"Discount updated successfully: {discount.Discount_Name}");

            // Get employee name for the updated discount
            var employee = await db.SingleByIdAsync<Employees>(discount.Employee_id);
            string employeeName = employee != null 
                ? $"{employee.First_Name} {employee.Last_Name}"
                : "Unknown";

            // Create DTO for response with the correct property mappings
            var discountDto = new DiscountDTO
            {
                Id = discount.Id,
                Percentage = discount.Percentage,
                Start_Date = discount.Start_Date,
                End_Date = discount.End_Date,
                Employee_id = discount.Employee_id,
                Discount_Name = discount.Discount_Name
            };

            return new UpdateDiscountResponse { 
                Success = true, 
                Message = "Discount updated successfully.",
                Discount = discountDto
            };
        }
        
        public async Task<DeleteDiscountResponse> Delete(DeleteDiscountDTO request)
        {
            using var db = _dbConnectionFactory.OpenDbConnection();

            var discount = await db.SingleByIdAsync<Discounts>(request.Id);
            
            if(discount == null)
            {
                return new DeleteDiscountResponse { 
                    Success = false, 
                    Message = "Discount not found" 
                };
            }

            await db.DeleteByIdAsync<Discounts>(request.Id);

            return new DeleteDiscountResponse { 
                Success = true, 
                Message = "Discount deleted successfully" 
            };
        }
    }
}
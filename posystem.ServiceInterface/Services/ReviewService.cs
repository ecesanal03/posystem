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
using ServiceStack.OrmLite.Legacy;

namespace posystem.ServiceInterface.Services
{
    public class ReviewService : Service
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;

        public ReviewService(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        public async Task<CreateReviewResponse> Post(CreateReviewDTO request)
        {
            var email = base.GetSession().Email;
            
            using var db = _dbConnectionFactory.OpenDbConnection();

            var customer = db.Single<Customers>(c => c.Email == email);
            
            if (customer == null)
            {
                return new CreateReviewResponse
                {
                    Result = "Failed",
                    Message = "Customer not found"
                };
            }

            var review = new Reviews
            {
                Id = Guid.NewGuid(),
                Customer_Id = customer.Id,
                Book_Id = request.BookId,
                Rating = request.Rating,
                Description = request.Description,
                Review_Date = request.ReviewDate
            };

            await db.InsertAsync(review);

            return new CreateReviewResponse
            {
                Result = "Success",
                Message = "Review created successfully"
            };
        }

        public async Task<RetrieveReviewsResponse> Get(RetrieveReviewsDTO request)
        {
            using var db = _dbConnectionFactory.OpenDbConnection();

            var reviews = await db.SelectAsync<Reviews>(r => r.Book_Id == request.BookId);

            // Get unique customer IDs from reviews
            var customerIds = reviews.Select(r => r.Customer_Id).Distinct().ToList();

            // Get customer names
            var customers = await db.SelectAsync<Customers>(c => Sql.In(c.Id, customerIds));
            var customerMap = customers.ToDictionary(c => c.Id, c => c.First_Name + " " + c.Last_Name);

            // Map to DTOs
            var response = new RetrieveReviewsResponse
            {
                Reviews = reviews.Select(r => new ReviewItem
                {
                    Rating = r.Rating,
                    Description = r.Description,
                    ReviewDate = r.Review_Date,
                    ReviewerName = customerMap.TryGetValue(r.Customer_Id, out var name) ? name : "Anonymous"
                }).ToList()
            };

            return response;
        }


    }
}
using System;
using System.Linq;
using System.Threading.Tasks;
using ServiceStack;
using ServiceStack.Data;
using ServiceStack.OrmLite;
using posystem.ServiceModel.Types;
using posystem.ServiceModel.Models;

namespace posystem.ServiceInterface.Services
{
    public class CategoryService : Service
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;

        public CategoryService(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        public async Task<GetCategoriesResponse> Get(GetCategoriesDTO request)
        {
            using var db = _dbConnectionFactory.OpenDbConnection();

            var categories = await db.SelectAsync<Categories>();

            // Map to DTOs
            var categoryDtos = categories.Select(c => new CategoryDTO
            {
                Id = c.Id,
                Name = c.Name
            }).ToList();

            return new GetCategoriesResponse
            {
                Categories = categoryDtos
            };
        }
    }
} 
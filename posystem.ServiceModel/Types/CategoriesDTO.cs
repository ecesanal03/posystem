using ServiceStack;
using System;
using System.Collections.Generic;

namespace posystem.ServiceModel.Types
{
    #region Request/Response DTOs
    [Route("/categories", "GET")]
    public class GetCategoriesDTO : IReturn<GetCategoriesResponse>
    {
        public string? SearchTerm { get; set; }
    }
    public class GetCategoriesResponse
    {
        public List<CategoryDTO> Categories { get; set; } = new List<CategoryDTO>();
    }

    #endregion

    #region DTO Models
    public class CategoryDTO
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
    }

    #endregion
} 
using ServiceStack;
using ServiceStack.DataAnnotations;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace posystem.ServiceModel.Types
{
    #region request/Response DTOs

    [Route("/discounts", "GET")]
    public class GetDiscountsDTO : IReturn<GetDiscountsResponse>
    {
        public string? SearchTerm { get; set; }
        public string? SortBy { get; set; }
        public bool SortDesc { get; set; }
        public int Skip { get; set; }
        public int Take { get; set; }
    }

    public class GetDiscountsResponse
    {
        public List<DiscountDTO> Discounts { get; set; } = new List<DiscountDTO>();
        public int TotalCount { get; set; }
    }

    [Route("/discounts/{Id}", "GET")]
    public class GetDiscountDTO : IReturn<GetDiscountResponse>
    {
        public Guid Id { get; set; }
    }

    public class GetDiscountResponse
    {
        public DiscountDTO Discount { get; set; }
    }

    [Route("/discounts", "POST")]
    public class CreateDiscountDTO : IReturn<CreateDiscountResponse>
    {
        public float Percentage { get; set; }
        public DateTime? Start_Date { get; set; }
        public DateTime? End_Date { get; set; }
        public string Discount_Name { get; set; }
        public Guid Employee_id { get; set; }
    }

    public class CreateDiscountResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public DiscountDTO Discount { get; set; }
    }

    [Route("/discounts/{Id}", "PUT")]
    public class UpdateDiscountDTO : IReturn<UpdateDiscountResponse>
    {
        public Guid Id { get; set; }
        public float Percentage { get; set; }
        public DateTime? Start_Date { get; set; }
        public DateTime? End_Date { get; set; }
        public string Discount_Name { get; set; }
        public Guid Employee_id { get; set; }
    }

    public class UpdateDiscountResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public DiscountDTO Discount { get; set; }
    }

    [Route("/discounts/{Id}", "DELETE")]
    public class DeleteDiscountDTO : IReturn<DeleteDiscountResponse>
    {
        public Guid Id { get; set; }
    }

    public class DeleteDiscountResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }
    
    #endregion

    #region DTO Models

    public class DiscountDTO
    {
        public Guid Id { get; set; }
        public float Percentage { get; set; }
        public DateTime? Start_Date { get; set; }
        public DateTime? End_Date { get; set; }
        public string Discount_Name { get; set; }
        public Guid Employee_id { get; set; }
        
        [Alias("name")]
        public string Employee_Name { get; set; }    
    }

    #endregion
}
    
    


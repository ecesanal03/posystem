using ServiceStack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace posystem.ServiceModel.Types
{
    [Route("/cart/add", "POST")]
    public class AddToCartRequest : IReturn<CartResponse>
    {
        public Guid BookId { get; set; }
        public int Quantity { get; set; } = 1;
        public Guid? DiscountId { get; set; }
    }

    
    [Route("/cart", "GET")]
    public class GetCartRequest : IReturn<GetCartResponse> { }

    
    [Route("/cart/remove", "POST")]
    public class RemoveFromCartRequest : IReturn<CartResponse>
    {
        public Guid BookId { get; set; }
    }

    [Route("/cart/update", "POST")]
    public class UpdateCartRequest : IReturn<CartResponse>
    {
        public Guid BookId { get; set; }
        public int Quantity { get; set; }
    }

    public class GetCartItemsDTO
    {
        public Guid Id { get; set; }
        public Guid BookId { get; set; }
        public string? BookTitle { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }

        public Guid? Discount_Id { get; set; }
        public string? Discount_Name { get; set; } // For display
        public decimal? Discount_Value { get; set; } // For showing discount amount
    }

    public class CartResponse
    {
        public string? Result { get; set; }
        public bool Success { get; set; }
        public string? Message { get; set; }
    }

    public class GetCartResponse
    {
        public List<GetCartItemsDTO>? Items { get; set; }
        public decimal Total { get; set; }
    }
}

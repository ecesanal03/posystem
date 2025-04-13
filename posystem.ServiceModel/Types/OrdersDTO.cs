using ServiceStack;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace posystem.ServiceModel.Types
{
    #region request/Response DTOs

    [Route("/orders", "GET")]
    public class GetOrdersDTO : IReturn<GetOrdersResponse>
    {
        public string? SearchTerm { get; set; }
        public string? SortBy { get; set; }
        public bool SortDesc { get; set; }
        public int Skip { get; set; }
        public int Take { get; set; }
    }
    
    public class GetOrdersResponse
    {
        public List<OrderListItemDTO> Orders { get; set; } = new List<OrderListItemDTO>();
        public int TotalCount { get; set; }
    }

    [Route("/orders/{Id}", "GET")]
    public class GetOrderDTO : IReturn<GetOrderResponse>
    {
        public Guid Id { get; set; }
    }

    public class GetOrderResponse
    {
        public OrderDTO Order { get; set; }
    }


    [Route("/orders/create", "POST")]
    public class CreateOrderDTO : IReturn<PlaceOrderResponse>
    {
        public DateTime Order_Date { get; set; }
        public DateTime? Delivery_Date { get; set; }
        public string Order_Status { get; set; }
        
        public List<CartItemDTO> CartItems { get; set; }
        public string Payment_Method { get; set; }
    }

    public class CartItemDTO
    {
        public Guid BookId { get; set; }
        public int Quantity { get; set; }
    }


    public class CreateOrderResponse : BaseResponse
    {
        public OrderDTO Order { get; set; }
    }

    public class PlaceOrderResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public Guid OrderId { get; set; }
        public Guid InvoiceId { get; set; }
    }


    [Route("/orders/{Id}/status", "PUT")]
    public class UpdateOrderDTO : IReturn<UpdateOrderResponse>
    {
        public Guid Id { get; set; }
        public string Order_Status { get; set; }
    }


    public class UpdateOrderResponse : BaseResponse
    {
        public OrderDTO Order { get; set; }
    }

    [Route("/orders/{Id}", "DELETE")]
    public class DeleteOrderDTO : IReturn<DeleteOrderResponse>
    {
        public Guid Id { get; set; }
    }

    public class DeleteOrderResponse : BaseResponse{}

    public class BaseResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    #endregion

    #region DTO Models

    public abstract class BaseOrderDTO
    {
        public Guid Id { get; set; }
        public DateTime Order_Date { get; set; }
        public DateTime? Delivery_Date { get; set; }
        public Guid Customer_Id { get; set; }
        public string Customer_Email { get; set; }
        public string Order_Status { get; set; }
        public decimal Total_Amount { get; set; }
    }

    public class OrderItemDTO
    {
        public Guid Id { get; set; }
        public Guid BookId { get; set; }
        public string Name { get; set; }
        public string ISBN { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Total { get; set; }
        public decimal? Discount { get; set; }
    }


    public class OrderListItemDTO : BaseOrderDTO
    {
        // Inherits all properties from BaseOrderDTO
        // Add any additional properties specific to list views here
    }

    public class OrderDTO : BaseOrderDTO
    {
        public Guid Id { get; set; }

        public DateTime OrderDate { get; set; }
        public DateTime? DeliveryDate { get; set; }

        public Guid CustomerId { get; set; }          
        public string CustomerName { get; set; }      
        public string CustomerEmail { get; set; }
        public string CustomerPhone { get; set; }
        public string CustomerAddress { get; set; }

        public string OrderStatus { get; set; }       
        public List<OrderItemDTO> Items { get; set; } = new();

        public decimal Subtotal { get; set; }
        public decimal Tax { get; set; }
        public decimal Total { get; set; }

        public string PaymentMethod { get; set; }
        public string CardNumber { get; set; }
    }

    public class OrderDetailDTO
    {
        public Guid Id { get; set; }
        public DateTime Order_Date { get; set; }
        public DateTime? Delivery_Date { get; set; }
        public Guid Customer_Id { get; set; }
        public string CustomerEmail { get; set; }
        public string Order_Status { get; set; }
        public decimal Total_Amount { get; set; }
    }

    #endregion
}

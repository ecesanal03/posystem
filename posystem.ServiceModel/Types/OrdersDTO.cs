using ServiceStack;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace posystem.ServiceModel.Types
{
    #region request/Response DTOs

    /// <summary>
    /// DTO for retrieving a list of orders with filtering, sorting, and pagination options.
    /// Maps to GET /orders endpoint.
    /// </summary>
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

    /// <summary>
    /// DTO for retrieving a single order by ID.
    /// Maps to GET /orders/{Id} endpoint.
    /// </summary>
    [Route("/orders/{Id}", "GET")]
    public class GetOrderDTO : IReturn<GetOrderResponse>
    {
        public Guid Id { get; set; }
    }

    /// <summary>
    /// Response DTO containing detailed information about a single order.
    /// </summary>
    public class GetOrderResponse
    {
        public OrderDTO Order { get; set; }
    }

    /// <summary>
    /// DTO for creating a new order.
    /// Maps to POST /orders endpoint.
    /// </summary>
    [Route("/orders", "POST")]
    public class CreateOrderDTO : IReturn<CreateOrderResponse>
    {
        public DateTime Order_Date { get; set; }
        public DateTime? Delivery_Date { get; set; }
        public Guid Customer_Id { get; set; }
        public string Order_Status { get; set; }
    }

    /// <summary>
    /// Response DTO indicating success/failure of order creation and containing the created order.
    /// </summary>
    public class CreateOrderResponse : BaseResponse
    {
        public OrderDTO Order { get; set; }
    }

    /// <summary>
    /// DTO for updating an existing order.
    /// Maps to PUT /orders/{Id}/status endpoint.
    /// </summary>
    [Route("/orders/{Id}/status", "PUT")]
    public class UpdateOrderDTO : IReturn<UpdateOrderResponse>
    {
        public Guid Id { get; set; }
        public string Order_Status { get; set; }
    }

    /// <summary>
    /// Response DTO indicating success/failure of order update and containing the updated order.
    /// </summary>
    public class UpdateOrderResponse : BaseResponse
    {
        public OrderDTO Order { get; set; }
    }

    /// <summary>
    /// DTO for deleting an order.
    /// Maps to DELETE /orders/{Id} endpoint.
    /// </summary>
    [Route("/orders/{Id}", "DELETE")]
    public class DeleteOrderDTO : IReturn<DeleteOrderResponse>
    {
        public Guid Id { get; set; }
    }

    /// <summary>
    /// Response DTO indicating success/failure of order deletion.
    /// </summary>
    public class DeleteOrderResponse : BaseResponse{}

    public class BaseResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    #endregion

    #region DTO Models

    /// <summary>
    /// Base order DTO with common properties
    /// </summary>
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

    /// <summary>
    /// DTO for individual order items, containing book details and quantities
    /// </summary>
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

    /// <summary>
    /// DTO for displaying orders in list views (e.g., tables, grids).
    /// Contains order information needed for display in lists.
    /// </summary>
    public class OrderListItemDTO : BaseOrderDTO
    {
        // Inherits all properties from BaseOrderDTO
        // Add any additional properties specific to list views here
    }

    /// <summary>
    /// DTO for detailed order information, used in edit forms and detailed views.
    /// </summary>
    public class OrderDTO : BaseOrderDTO
    {
        public string Customer_Email { get; set; }
        public string Customer_Name { get; set; }
        public string Customer_Phone { get; set; }
        public string Customer_Address { get; set; }
        public List<OrderItemDTO> Items { get; set; } = new List<OrderItemDTO>();
        public decimal Subtotal { get; set; }
        public decimal Tax { get; set; }
        public decimal Total { get; set; }
        public string Payment_Method { get; set; }
        public string Card_Number { get; set; }
    }

    /// <summary>
    /// DTO for capturing SQL query results with order details
    /// </summary>
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

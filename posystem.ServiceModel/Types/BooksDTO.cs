using ServiceStack;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace posystem.ServiceModel.Types
{

    #region request/Response DTOs

    /// <summary>
    /// DTO for retrieving a list of books with filtering, sorting, and pagination options.
    /// Maps to GET /books endpoint.
    /// </summary>
    [Route("/books", "GET")]
    public class GetBooksDTO : IReturn<GetBooksResponse>
    {
        public string? SearchTerm { get; set; }
        public string? SortBy { get; set; }
        public bool SortDesc { get; set; }
        public int Skip { get; set; }
        public int Take { get; set; }
        public string? Category { get; set; }
    }

    /// <summary>
    /// Response DTO containing the list of books and total count for pagination.
    /// </summary>
    public class GetBooksResponse
    {
        public List<BookListItemDTO> Books { get; set; } = new List<BookListItemDTO>();
        public int TotalCount { get; set; }
    }

    /// <summary>
    /// DTO for retrieving a single book by ID.
    /// Maps to GET /books/{Id} endpoint.
    /// </summary>
    [Route("/books/{Id}", "GET")]
    public class GetBookDTO : IReturn<GetBookResponse>
    {
        public Guid Id { get; set; }
    }

    /// <summary>
    /// Response DTO containing detailed information about a single book.
    /// </summary>
    public class GetBookResponse
    {
        public BookDetailsDTO Book { get; set; }
    }

    /// <summary>
    /// DTO for creating a new book.
    /// Maps to POST /books endpoint.
    /// </summary>
    [Route("/books", "POST")]
    public class CreateBookDTO : IReturn<CreateBookResponse>
    {
        public string Title { get; set; }
        public string Author { get; set; }
        public string ISBN { get; set; }
        public decimal Price { get; set; }
        public int Units { get; set; }
        public string Description { get; set; }
        public string Cover_Image { get; set; }
        public Guid? Supplier_Id { get; set; }
        public Guid? Discount_Id { get; set; }
        public Guid? Created_By { get; set; }
    }

    /// <summary>
    /// Response DTO indicating success/failure of book creation and containing the created book.
    /// </summary>
    public class CreateBookResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public BookDetailsDTO Book { get; set; }
    }

    /// <summary>
    /// DTO for updating an existing book.
    /// Maps to PUT /books/{Id} endpoint.
    /// </summary>
    [Route("/books/{Id}", "PUT")]
    public class UpdateBookDTO : IReturn<UpdateBookResponse>
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string ISBN { get; set; }
        public decimal Price { get; set; }
        public int Units { get; set; }
        public string Description { get; set; }
        public string Cover_Image { get; set; }
        public Guid? Supplier_Id { get; set; }
        public Guid? Discount_Id { get; set; }
        public Guid? Updated_By { get; set; }
    }

    /// <summary>
    /// Response DTO indicating success/failure of book update and containing the updated book.
    /// </summary>
    public class UpdateBookResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public BookDetailsDTO Book { get; set; }
    }

    /// <summary>
    /// DTO for deleting a book.
    /// Maps to DELETE /books/{Id} endpoint.
    /// </summary>
    [Route("/books/{Id}", "DELETE")]
    public class DeleteBookDTO : IReturn<DeleteBookResponse>
    {
        public Guid Id { get; set; }
    }

    /// <summary>
    /// Response DTO indicating success/failure of book deletion.
    /// </summary>
    public class DeleteBookResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    #endregion

    #region DTO Models

    /// <summary>
    /// DTO for displaying books in list views (e.g., tables, grids).
    /// Contains only essential information needed for display.
    /// </summary>
    public class BookListItemDTO
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string ISBN { get; set; }
        public decimal Price { get; set; }
        public int Units { get; set; }
        public string? Description { get; set; }
        public string? CoverImage { get; set; }
        public Guid Supplier_Id { get; set; }
        
        [JsonPropertyName("discountId")]
        public Guid Discount_Id { get; set; }

        public decimal? DiscountPercentage { get; set; }
        public DateTime Added_At { get; set; }
        public string? SupplierName { get; set; }
        public List<string>? Categories { get; set; }

    }

    /// <summary>
    /// DTO for detailed book information, used in edit forms and detailed views.
    /// Contains all book properties including optional fields and metadata.
    /// </summary>
    public class BookDetailsDTO
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string ISBN { get; set; }
        public decimal Price { get; set; }
        public int Units { get; set; }
        public string? Description { get; set; }
        public string? CoverImage { get; set; }
        public Guid? Supplier_Id { get; set; }

        [JsonPropertyName("discountId")]
        public Guid? Discount_Id { get; set; }

        public DateTime Added_At { get; set; }
        public DateTime Updated_At { get; set; }
        public string? SupplierName { get; set; }
        public decimal? DiscountPercentage { get; set; }
    }

    [Route("/books/apply-discount", "POST")]
    public class ApplyDiscountToAllBooks : IReturn<ApplyDiscountResponse>
    {
        public Guid DiscountId { get; set; }
    }

    public class ApplyDiscountResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }


    #endregion
}
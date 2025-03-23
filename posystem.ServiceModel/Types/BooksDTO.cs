using ServiceStack;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace posystem.ServiceModel.Types
{

    #region request/Response DTOs

    [Route("/books", "GET")]
    public class GetBooksDTO : IReturn<GetBooksResponse>
    {
        public string? SearchTerm { get; set; }
        public string? SortBy { get; set; }
        public bool SortDesc { get; set; }
        public int Skip { get; set; }
        public int Take { get; set; }
    }

    public class GetBooksResponse
    {
        public List<BookListItemDTO> Books { get; set; } = new List<BookListItemDTO>();
        public int TotalCount { get; set; }
    }

    [Route("/books/{Id}", "GET")]
    public class GetBookDTO : IReturn<GetBookResponse>
    {
        public Guid Id { get; set; }
    }

    public class GetBookResponse
    {
        public BookDetailsDTO Book { get; set; }
    }

    [Route("/books", "POST")]
    public class CreateBookDTO : IReturn<CreateBookResponse>
    {
        public string Title { get; set; }
        public string Author { get; set; }
        public string ISBN { get; set; }
        public decimal Price { get; set; }
        public int Units { get; set; }
        public string Description { get; set; }
        public byte[] Cover_Image { get; set; }
        public Guid? Supplier_Id { get; set; }
        public Guid? Discount_Id { get; set; }
        public Guid? Created_By { get; set; }
    }

    public class CreateBookResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public BookDetailsDTO Book { get; set; }
    }

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
        public byte[] Cover_Image { get; set; }
        public Guid? Supplier_Id { get; set; }
        public Guid? Discount_Id { get; set; }
        public Guid? Updated_By { get; set; }
    }

    public class UpdateBookResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public BookDetailsDTO Book { get; set; }
    }

    [Route("/books/{Id}", "DELETE")]
    public class DeleteBookDTO : IReturn<DeleteBookResponse>
    {
        public Guid Id { get; set; }
    }

    public class DeleteBookResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
    }

    #endregion

    #region DTO Models

    /// <summary>
    /// DTO for book list items in the table
    /// </summary>
    public class BookListItemDTO
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string ISBN { get; set; }
        public decimal Price { get; set; }
        public int Units { get; set; }

        public Guid Supplier_Id { get; set; }
        public Guid Discount_Id { get; set; }
        public DateTime Added_At { get; set; }
        

    }

    /// <summary>
    /// DTO for book details when editing
    /// </summary>
    public class BookDetailsDTO
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string ISBN { get; set; }
        public decimal Price { get; set; }
        public int Units { get; set; }
        public string Description { get; set; }
        public byte[] Cover_Image { get; set; }
        public Guid? Supplier_Id { get; set; }
        public Guid? Discount_Id { get; set; }
        public DateTime Added_At { get; set; }
        public DateTime Updated_At { get; set; }
    }

    #endregion
}
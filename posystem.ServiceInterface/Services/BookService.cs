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
    /// <summary>
    /// Service responsible for handling all book-related operations in the system.
    /// This includes CRUD operations (Create, Read, Update, Delete) for books.
    /// Uses ServiceStack's ORM Lite for database operations.
    /// </summary>
    public class BookService : Service
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;

        public BookService(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        /// <summary>
        /// Retrieves a list of books with optional filtering, sorting, and pagination.
        /// </summary>
        /// <param name="request">GetBooksDTO containing search parameters, sorting options, and pagination settings</param>
        /// <returns>GetBooksResponse containing the list of books and total count</returns>
        public async Task<GetBooksResponse> Get(GetBooksDTO request)
        {
            using var db = _dbConnectionFactory.OpenDbConnection();
            
            var query = db.From<Books>();

            // Filter by search term if provided
            if(!string.IsNullOrEmpty(request.SearchTerm))
            {
                query = query.Where(b => 
                b.Title.Contains(request.SearchTerm) || 
                b.Author.Contains(request.SearchTerm) ||
                b.ISBN.Contains(request.SearchTerm));
            }

            // Apply Sorting
            if(!string.IsNullOrEmpty(request.SortBy))
            {
                query = request.SortDesc
                    ? query.OrderByDescending(request.SortBy)
                    : query.OrderBy(request.SortBy);
            } else {
                query = query.OrderByDescending(b => b.Added_At);
            }

            // Get total count for pagination
            var totalCount = await db.CountAsync(query);

            // Apply Pagination
            if (request.Skip > 0)
            {
                query = query.Skip(request.Skip);
            }

            if (request.Take > 0)
            {
                query = query.Take(request.Take);
            }

            // Execute Query
            var books = await db.SelectAsync(query);

            // Map to DTOs
            var bookDtos = books.Select(b => new BookListItemDTO
            {
                Id = b.Id,
                Title = b.Title,
                Author = b.Author,
                ISBN = b.ISBN,
                Price = b.Price,
                Units = b.Units,
                Description = b.Description,
                CoverImage = b.Cover_Image,
                Supplier_Id = b.Supplier_Id ?? Guid.Empty,
                Discount_Id = b.Discount_Id ?? Guid.Empty,
                Added_At = b.Added_At
            }).ToList();

            return new GetBooksResponse
            {
                Books = bookDtos,
                TotalCount = (int)totalCount
            };
        }

        /// <summary>
        /// Retrieves a single book by its ID.
        /// </summary>
        /// <param name="request">GetBookDTO containing the book ID</param>
        /// <returns>GetBookResponse containing the detailed book information</returns>
        /// <exception cref="HttpError">Throws 404 if book is not found</exception>
        public async Task<GetBookResponse> Get(GetBookDTO request)
        {
            using var db = _dbConnectionFactory.OpenDbConnection();

            var book = await db.SingleByIdAsync<Books>(request.Id);

            if (book == null)
                throw HttpError.NotFound("Book not found");

            var bookDto = new BookDetailsDTO
            {
                Id = book.Id,
                Title = book.Title,
                Author = book.Author,
                ISBN = book.ISBN,
                Price = book.Price,
                Units = book.Units,
                Description = book.Description,
                CoverImage = book.Cover_Image ,
                Supplier_Id = book.Supplier_Id,
                Discount_Id = book.Discount_Id,
                Added_At = book.Added_At,
                Updated_At = book.Updated_At
            };

            return new GetBookResponse { Book = bookDto };
        }

        /// <summary>
        /// Creates a new book in the system.
        /// Validates ISBN uniqueness before creation.
        /// </summary>
        /// <param name="request">CreateBookDTO containing the new book's information</param>
        /// <returns>CreateBookResponse indicating success/failure and containing the created book</returns>
        public async Task<CreateBookResponse> Post(CreateBookDTO request)
        {
            try
            {
                using var db = _dbConnectionFactory.OpenDbConnection();

                // Check if ISBN already exists
                if (!string.IsNullOrEmpty(request.ISBN))
                {
                    var existingBook = await db.SingleAsync<Books>(b => b.ISBN == request.ISBN);
                    
                    if (existingBook != null)
                    {
                        return new CreateBookResponse
                        {
                            Success = false,
                            Message = "ISBN already exists"
                        };
                    }
                }

                var newBook = new Books
                {
                    Id = Guid.NewGuid(),
                    Title = request.Title,
                    Author = request.Author,
                    ISBN = request.ISBN,
                    Price = request.Price,
                    Units = request.Units,
                    Description = request.Description,
                    Cover_Image = request.Cover_Image,
                    Supplier_Id = request.Supplier_Id,
                    Discount_Id = request.Discount_Id,
                    Created_By = request.Created_By,
                    Added_At = DateTime.UtcNow,
                    Updated_At = DateTime.UtcNow
                };

                await db.SaveAsync(newBook);

                var createdBook = await db.SingleByIdAsync<Books>(newBook.Id);

                var bookDto = new BookDetailsDTO
                {
                    Id = createdBook.Id,
                    Title = createdBook.Title,
                    Author = createdBook.Author,
                    ISBN = createdBook.ISBN,
                    Price = createdBook.Price,
                    Units = createdBook.Units,
                    Description = createdBook.Description,
                    CoverImage = createdBook.Cover_Image ,
                    Supplier_Id = createdBook.Supplier_Id,
                    Discount_Id = createdBook.Discount_Id,
                    Added_At = createdBook.Added_At,
                    Updated_At = createdBook.Updated_At
                };

                return new CreateBookResponse
                {
                    Success = true,
                    Message = "Book created successfully",
                    Book = bookDto
                };
            }
            catch (Exception ex)
            {
                return new CreateBookResponse
                {
                    Success = false,
                    Message = $"Error creating book: {ex.Message}"
                };
            }
        }

        /// <summary>
        /// Updates an existing book's information.
        /// Validates ISBN uniqueness if being changed.
        /// </summary>
        /// <param name="request">UpdateBookDTO containing the updated book information</param>
        /// <returns>UpdateBookResponse indicating success/failure and containing the updated book</returns>
        public async Task<UpdateBookResponse> Put(UpdateBookDTO request)
        {
            try
            {
                using var db = _dbConnectionFactory.OpenDbConnection();

                var existingBook = await db.SingleByIdAsync<Books>(request.Id);

                if (existingBook == null)
                {
                    return new UpdateBookResponse
                    {
                        Success = false,
                        Message = "Book not found"
                    };
                }

                // Check if ISBN is being changed and if it already exists
                if (!string.IsNullOrEmpty(request.ISBN) && 
                    request.ISBN != existingBook.ISBN)
                {
                    var bookWithSameISBN = await db.SingleAsync<Books>(x => 
                        x.ISBN == request.ISBN && x.Id != request.Id);
                    
                    if (bookWithSameISBN != null)
                    {
                        return new UpdateBookResponse
                        {
                            Success = false,
                            Message = $"Book with ISBN {request.ISBN} already exists"
                        };
                    }
                }

                // Update book properties
                existingBook.Title = request.Title;
                existingBook.Author = request.Author;
                existingBook.ISBN = request.ISBN;
                existingBook.Price = request.Price;
                existingBook.Units = request.Units;
                existingBook.Description = request.Description;
                existingBook.Supplier_Id = request.Supplier_Id;
                existingBook.Discount_Id = request.Discount_Id;
                existingBook.Updated_By = request.Updated_By;
                existingBook.Updated_At = DateTime.UtcNow;

                // Only update cover image if provided
                if (request.Cover_Image != null && request.Cover_Image.Length > 0)
                {
                    existingBook.Cover_Image = request.Cover_Image;
                }

                await db.UpdateAsync(existingBook);

                var updatedBook = await db.SingleByIdAsync<Books>(existingBook.Id);

                var bookDto = new BookDetailsDTO
                {
                    Id = updatedBook.Id,
                    Title = updatedBook.Title,
                    Author = updatedBook.Author,
                    ISBN = updatedBook.ISBN,
                    Price = updatedBook.Price,
                    Units = updatedBook.Units,
                    Description = updatedBook.Description,
                    CoverImage = updatedBook.Cover_Image,
                    Supplier_Id = updatedBook.Supplier_Id ?? Guid.Empty,
                    Discount_Id = updatedBook.Discount_Id ?? Guid.Empty,
                    Added_At = updatedBook.Added_At,
                    Updated_At = updatedBook.Updated_At
                };

                return new UpdateBookResponse
                {
                    Success = true,
                    Message = "Book updated successfully",
                    Book = bookDto
                };
            }
            catch (Exception ex)
            {
                return new UpdateBookResponse
                {
                    Success = false,
                    Message = $"Error updating book: {ex.Message}"
                };
            }
        }

        /// <summary>
        /// Deletes a book from the system.
        /// </summary>
        /// <param name="request">DeleteBookDTO containing the ID of the book to delete</param>
        /// <returns>DeleteBookResponse indicating success/failure of the deletion</returns>
        public async Task<DeleteBookResponse> Delete(DeleteBookDTO request)
        {
            try
            {
                using var db = _dbConnectionFactory.OpenDbConnection();

                var existingBook = await db.SingleByIdAsync<Books>(request.Id);

                if (existingBook == null)
                {
                    return new DeleteBookResponse
                    {
                        Success = false,
                        Message = "Book not found"
                    };
                }

                await db.DeleteByIdAsync<Books>(request.Id);

                return new DeleteBookResponse
                {
                    Success = true,
                    Message = "Book deleted successfully"
                };
            }
            catch (Exception ex)
            {
                return new DeleteBookResponse
                {
                    Success = false,
                    Message = $"Error deleting book: {ex.Message}"
                };
            }
        }
    }
}

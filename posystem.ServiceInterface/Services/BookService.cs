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
    public class BookService : Service
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;

        public BookService(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }


        /// Retrieves a list of books with optional filtering, sorting, and pagination.
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

            if (!string.IsNullOrEmpty(request.Category))
            {
                query.Join<BookCategories>((book, bc) => book.Id == bc.Book_Id)
                    .Join<BookCategories, Categories>((bc, cat) => bc.Category_Id == cat.Id)
                    .Where<Categories>(c => c.Name == request.Category);
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

            // Get unique Supplier_Ids from books
            var supplierIds = books
                .Where(b => b.Supplier_Id != null)
                .Select(b => b.Supplier_Id!.Value)
                .Distinct()
                .ToList();

            // Fetch all suppliers in one query
            var suppliers = await db.SelectAsync<Suppliers>(s => Sql.In(s.Id, supplierIds));

            // Build dictionary for quick lookup
            var supplierMap = suppliers.ToDictionary(s => s.Id, s => s.SupplierName);

            // Get unique Category_Ids from books
            var bookIds = books.Select(b => b.Id).ToList();

            var bookCategories = await db.SelectAsync<BookCategories>(bc => Sql.In(bc.Book_Id, bookIds));
            var categoryIds = bookCategories.Select(bc => bc.Category_Id).Distinct().ToList();

            var categories = await db.SelectAsync<Categories>(c => Sql.In(c.Id, categoryIds));

            var categoryMap = bookCategories
                .Join(categories, bc => bc.Category_Id, c => c.Id, (bc, c) => new { bc.Book_Id, c.Name })
                .GroupBy(x => x.Book_Id)
                .ToDictionary(g => g.Key, g => g.Select(x => x.Name ?? "").ToList());

            // Get unique Discount_Ids
            var discountIds = books
                .Where(b => b.Discount_Id != null)
                .Select(b => b.Discount_Id!.Value)
                .Distinct()
                .ToList();

            var discounts = await db.SelectAsync<Discounts>(d => Sql.In(d.Id, discountIds));
            var discountMap = discounts.ToDictionary(d => d.Id, d => d.Percentage);


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
                Added_At = b.Added_At,
                SupplierName = b.Supplier_Id != null && supplierMap.ContainsKey(b.Supplier_Id.Value)
                                ? supplierMap[b.Supplier_Id.Value]
                                : null, 
                Categories = categoryMap.ContainsKey(b.Id) ? categoryMap[b.Id] : new List<string>(),
                DiscountPercentage = b.Discount_Id != null && discountMap.ContainsKey(b.Discount_Id.Value)
                                ? discountMap[b.Discount_Id.Value]
                                : null
            }).ToList();

            return new GetBooksResponse
            {
                Books = bookDtos,
                TotalCount = (int)totalCount
            };
        }


        /// Retrieves a single book by its ID.
        public async Task<GetBookResponse> Get(GetBookDTO request)
        {
            using var db = _dbConnectionFactory.OpenDbConnection();

            var book = await db.SingleByIdAsync<Books>(request.Id);

            if (book == null)
                throw HttpError.NotFound("Book not found");

            // Fetch the supplier if Supplier_Id is not null
            string? supplierName = null;
            if (book.Supplier_Id != null)
            {
                var supplier = await db.SingleByIdAsync<Suppliers>(book.Supplier_Id.Value);
                supplierName = supplier?.SupplierName;
            }


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
                Updated_At = book.Updated_At,
                SupplierName = supplierName
            };

            return new GetBookResponse { Book = bookDto };
        }

        /// Creates a new book in the system.
        /// Validates ISBN uniqueness before creation.
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

        /// Updates an existing book's information.
        /// Validates ISBN uniqueness if being changed.
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

        /// Deletes a book from the system.
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

        public object Post(ApplyDiscountToAllBooks request)
        {
            using var db = base.Db;

            var discountExists = db.Exists<Discounts>(x => x.Id == request.DiscountId);
            if (!discountExists)
            {
                return new ApplyDiscountResponse { Success = false, Message = "Discount not found." };
            }

            // Apply discount to all books
            db.UpdateOnly(
                () => new Books { Discount_Id = request.DiscountId },
                where: x => true // apply to all books
            );

            return new ApplyDiscountResponse
            {
                Success = true,
                Message = "Discount successfully applied to all books."
            };
        }
    }
}

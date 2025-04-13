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
                // Ensure case-insensitive search
                var searchTerm = request.SearchTerm.ToLower();
                
                // Search by direct book properties - using case-insensitive comparison
                query = query.Where(b => 
                    b.Title.ToLower().Contains(searchTerm) || 
                    b.Author.ToLower().Contains(searchTerm) ||
                    b.ISBN.ToLower().Contains(searchTerm));
                    
                // Search by supplier name - using case-insensitive comparison
                var matchingSupplierIds = await db.ColumnAsync<Guid>(
                    db.From<Suppliers>()
                    .Where(s => s.SupplierName.ToLower().Contains(searchTerm))
                    .Select(s => s.Id));
                
                if (matchingSupplierIds.Count > 0)
                {
                    query = query.Or(b => Sql.In(b.Supplier_Id, matchingSupplierIds));
                }
                
                // Search by category name - using case-insensitive comparison
                var bookIdsWithMatchingCategories = await db.ColumnAsync<Guid>(
                    db.From<Books>()
                    .Join<BookCategories>((book, bc) => book.Id == bc.Book_Id)
                    .Join<BookCategories, Categories>((bc, cat) => bc.Category_Id == cat.Id)
                    .Where<Categories>(c => c.Name.ToLower().Contains(searchTerm))
                    .Select<Books>(b => b.Id));
                    
                if (bookIdsWithMatchingCategories.Count > 0)
                {
                    query = query.Or(b => Sql.In(b.Id, bookIdsWithMatchingCategories));
                }
            }

            // Filter by specific category if provided - this is for exact category matching
            if (!string.IsNullOrEmpty(request.Category))
            {
                // Get books that have this exact category name
                var bookIdsWithExactCategory = await db.ColumnAsync<Guid>(
                    db.From<Books>()
                    .Join<BookCategories>((book, bc) => book.Id == bc.Book_Id)
                    .Join<BookCategories, Categories>((bc, cat) => bc.Category_Id == cat.Id)
                    .Where<Categories>(c => c.Name == request.Category)
                    .Select<Books>(b => b.Id));
                
                if (bookIdsWithExactCategory.Count > 0)
                {
                    // Create a new query that only includes books with this category
                    query = db.From<Books>().Where(b => Sql.In(b.Id, bookIdsWithExactCategory));
                }
                else
                {
                    // No books found with this exact category, return empty result
                    query = db.From<Books>().Where(b => b.Id == Guid.Empty); // Will return no results
                }
            }

            // Apply Sorting
            query = !string.IsNullOrEmpty(request.SortBy)
                ? (request.SortDesc ? query.OrderByDescending(request.SortBy) : query.OrderBy(request.SortBy))
                : query.OrderByDescending(b => b.Added_At);

            // Get total count for pagination
            var totalCount = await db.CountAsync(query);

            // Apply Pagination
            if (request.Skip > 0) query = query.Skip(request.Skip);
            if (request.Take > 0) query = query.Take(request.Take);

            // Execute Query
            var books = await db.SelectAsync(query);
            var bookIds = books.Select(b => b.Id).ToList();

            // Get supplier data in one efficient query
            var supplierMap = new Dictionary<Guid, string>();
            var supplierIds = books.Where(b => b.Supplier_Id.HasValue)
                                .Select(b => b.Supplier_Id.Value)
                                .Distinct()
                                .ToList();
            
            if (supplierIds.Count > 0)
            {
                var suppliers = await db.SelectAsync<Suppliers>(s => Sql.In(s.Id, supplierIds));
                supplierMap = suppliers.ToDictionary(s => s.Id, s => s.SupplierName);
            }

            // Get category data in one efficient query
            var categoryMap = new Dictionary<Guid, List<string>>();
            if (bookIds.Count > 0)
            {
                var categoryData = await db.SelectAsync<dynamic>(
                    db.From<BookCategories>()
                    .Join<Categories>((bc, c) => bc.Category_Id == c.Id)
                    .Where(bc => Sql.In(bc.Book_Id, bookIds))
                    .Select<BookCategories, Categories>((bc, c) => new { BookId = bc.Book_Id, CategoryName = c.Name }));
                    
                foreach (var item in categoryData)
                {
                    var bookId = (Guid)item.BookId;
                    var categoryName = (string)item.CategoryName;
                    
                    if (!categoryMap.ContainsKey(bookId))
                        categoryMap[bookId] = new List<string>();
                        
                    categoryMap[bookId].Add(categoryName);
                }
            }

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
                SupplierName = b.Supplier_Id.HasValue && supplierMap.ContainsKey(b.Supplier_Id.Value)
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

            // Fetch the book's category
            Guid? categoryId = null;
            string? categoryName = null;
            var bookCategories = await db.SelectAsync<BookCategories>(bc => bc.Book_Id == book.Id);
            if (bookCategories.Count > 0)
            {
                var bookCategory = bookCategories[0];
                categoryId = bookCategory.Category_Id;
                var category = await db.SingleByIdAsync<Categories>(bookCategory.Category_Id);
                categoryName = category?.Name;
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
                CoverImage = book.Cover_Image,
                Supplier_Id = book.Supplier_Id,
                Discount_Id = book.Discount_Id,
                Category_Id = categoryId,
                Added_At = book.Added_At,
                Updated_At = book.Updated_At,
                SupplierName = supplierName,
                CategoryName = categoryName
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

                // Create book-category relationship if a category was provided
                if (request.Category_Id.HasValue)
                {
                    var bookCategory = new BookCategories
                    {
                        Book_Id = newBook.Id,
                        Category_Id = request.Category_Id.Value
                    };
                    
                    await db.SaveAsync(bookCategory);
                }

                var createdBook = await db.SingleByIdAsync<Books>(newBook.Id);

                // Fetch the category information if available
                string? categoryName = null;
                if (request.Category_Id.HasValue)
                {
                    var category = await db.SingleByIdAsync<Categories>(request.Category_Id.Value);
                    categoryName = category?.Name;
                }

                var bookDto = new BookDetailsDTO
                {
                    Id = createdBook.Id,
                    Title = createdBook.Title,
                    Author = createdBook.Author,
                    ISBN = createdBook.ISBN,
                    Price = createdBook.Price,
                    Units = createdBook.Units,
                    Description = createdBook.Description,
                    CoverImage = createdBook.Cover_Image,
                    Supplier_Id = createdBook.Supplier_Id,
                    Discount_Id = createdBook.Discount_Id,
                    Category_Id = request.Category_Id,
                    Added_At = createdBook.Added_At,
                    Updated_At = createdBook.Updated_At,
                    CategoryName = categoryName
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

                // Update book categories
                // First, check if there's an existing book category
                var existingBookCategories = await db.SelectAsync<BookCategories>(bc => bc.Book_Id == request.Id);
                var existingBookCategory = existingBookCategories.Count > 0 ? existingBookCategories[0] : null;
                
                // If category has changed
                if (request.Category_Id.HasValue)
                {
                    // If there's no existing book category, create a new one
                    if (existingBookCategory == null)
                    {
                        var newBookCategory = new BookCategories
                        {
                            Book_Id = request.Id,
                            Category_Id = request.Category_Id.Value
                        };
                        await db.SaveAsync(newBookCategory);
                    }
                    // If category exists but has changed, recreate it (delete and add)
                    // This approach is more reliable than updating for GUID comparison issues
                    else if (existingBookCategory.Category_Id.ToString() != request.Category_Id.Value.ToString())
                    {
                        // Delete the old relationship
                        await db.DeleteAsync(existingBookCategory);
                        
                        // Create a new relationship
                        var newBookCategory = new BookCategories
                        {
                            Book_Id = request.Id,
                            Category_Id = request.Category_Id.Value
                        };
                        await db.SaveAsync(newBookCategory);
                    }
                }
                // If category was removed (set to null), delete the book category relation
                else if (existingBookCategory != null)
                {
                    await db.DeleteAsync(existingBookCategory);
                }

                var updatedBook = await db.SingleByIdAsync<Books>(existingBook.Id);

                // Fetch the category information if available
                string? categoryName = null;
                Guid? categoryId = null;
                
                // Refresh our view of the book categories to ensure we have the most up-to-date data
                var refreshedBookCategories = await db.SelectAsync<BookCategories>(bc => bc.Book_Id == updatedBook.Id);
                if (refreshedBookCategories.Count > 0)
                {
                    var bookCategory = refreshedBookCategories[0];
                    categoryId = bookCategory.Category_Id;
                    var category = await db.SingleByIdAsync<Categories>(bookCategory.Category_Id);
                    categoryName = category?.Name;
                }
                else if (request.Category_Id.HasValue)
                {
                    // This should not happen, but if for some reason the category association wasn't properly created
                    // but we did have a category ID in the request, use that as a fallback
                    categoryId = request.Category_Id;
                    var category = await db.SingleByIdAsync<Categories>(request.Category_Id.Value);
                    categoryName = category?.Name;
                }

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
                    Category_Id = categoryId,
                    Added_At = updatedBook.Added_At,
                    Updated_At = updatedBook.Updated_At,
                    CategoryName = categoryName
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

                // Delete any book category relationships first
                await db.DeleteAsync<BookCategories>(bc => bc.Book_Id == request.Id);

                // Then delete the book
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

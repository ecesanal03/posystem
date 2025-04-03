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
using ServiceStack.OrmLite.Legacy;

namespace posystem.ServiceInterface.Services
{
    [Authenticate]
    public class CartService : Service
    {
        private readonly IDbConnectionFactory _dbConnectionFactory;

        public CartService(IDbConnectionFactory dbConnectionFactory)
        {
            _dbConnectionFactory = dbConnectionFactory;
        }

        public object Post(AddToCartRequest request)
        {
            var email = base.GetSession().Email; // JWT claim (email)

            using (var db = _dbConnectionFactory.OpenDbConnection())
            {
                var customer = db.Single<Customers>(c => c.Email == email);

                if (customer == null)
                {
                    return new CartResponse
                    {
                        Success = false,
                        Message = "Customer not found"
                    };
                }

                // 2. Check for existing cart or create new
                var cart = db.Single<Cart>(c => c.Customer_Id == customer.Id);
                if (cart == null)
                {
                    cart = new Cart
                    {
                        Id = Guid.NewGuid(),
                        Customer_Id = customer.Id,
                        Updated_At = DateTime.UtcNow
                    };
                    db.Insert(cart);
                }
                else
                {
                    cart.Updated_At = DateTime.UtcNow;
                    db.Update(cart);
                }

                try
                {
                    // 3. Add book to cart
                    var existingItem = db.Select<CartItems>(
                        x => x.Cart_Id == cart.Id && x.Book_Id == request.BookId
                    ).FirstOrDefault();

                    if (existingItem == null)
                    {
                        // Book is not in cart — add new
                        var newItem = new CartItems
                        {
                            Id = Guid.NewGuid(),
                            Cart_Id = cart.Id,
                            Book_Id = request.BookId,
                            Quantity = request.Quantity,
                            Added_At = DateTime.UtcNow,
                            Discount_Id = request.DiscountId.HasValue && request.DiscountId != Guid.Empty
                                        ? request.DiscountId
                                        : null
                        };
                        db.Insert(newItem);

                        // Simulate low stock in background
                        _ = SimulateLowStockAfterDelay(request.BookId); // Fire-and-forget
                    }
                    else
                    {
                        // Book already in cart — update quantity
                        existingItem.Quantity += request.Quantity;
                        existingItem.Added_At = DateTime.UtcNow;
                        db.Update(existingItem);
                    }

                    return new CartResponse 
                    { 
                        Result = "Book added to cart" ,
                        Success = true
                    };
                }
                catch (Exception)
                {
                    return new CartResponse
                    {
                        Success = false,
                    };
                }
            }
        }

        public object Get(GetCartRequest request)
        {
            var email = base.GetSession().Email; // JWT claim (email)

            using (var db = _dbConnectionFactory.OpenDbConnection())
            {
                var customer = db.Single<Customers>(c => c.Email == email);
                if (customer == null)
                {
                    return new CartResponse
                    {
                        Success = false,
                        Message = "Customer not found"
                    };
                }

                var cart = db.Single<Cart>(c => c.Customer_Id == customer.Id);
                if (cart == null)
                {
                    return new GetCartResponse { Items = new List<GetCartItemsDTO>(), Total = 0 };
                }

                var query = db.From<CartItems>()
                            .Where(ci => ci.Cart_Id == cart.Id)
                            .Join<CartItems, Books>((ci, b) => ci.Book_Id == b.Id)
                            .LeftJoin<CartItems, Discounts>((ci, d) => ci.Discount_Id == d.Id);

                var results = db.SelectMulti<CartItems, Books, Discounts>(query);

                var items = results.Select(row =>
                {
                    var cartItem = row.Item1;
                    var book = row.Item2;
                    var discount = row.Item3;

                    return new GetCartItemsDTO
                    {
                        Id = cartItem.Id,
                        BookId = cartItem.Book_Id,
                        BookTitle = book.Title,
                        Price = book.Price,
                        Quantity = cartItem.Quantity,
                        Discount_Id = discount?.Id,
                        Discount_Name = discount?.Discount_Name,
                        Discount_Value = discount?.Percentage
                    };
                }).ToList();

                return new GetCartResponse
                {
                    Items = items,
                    Total = items.Sum(i =>
                    {
                        var price = i.Price;
                        if (i.Discount_Value.HasValue)
                        {
                            price -= price * i.Discount_Value.Value / 100;
                        }
                        return price * i.Quantity;
                    })
                };
            }
        }

        public object Post(RemoveFromCartRequest request)
        {
            var email = base.GetSession().Email; // JWT claim (email)
            using (var db = _dbConnectionFactory.OpenDbConnection())
            {
                var customer = db.Single<Customers>(c => c.Email == email);
                if (customer == null)
                {
                    return new CartResponse
                    {
                        Success = false,
                        Message = "Customer not found"
                    };
                }
                
                var cart = db.Single<Cart>(c => c.Customer_Id == customer.Id);
                if (cart == null)
                {
                    return new CartResponse
                    {
                        Success = false,
                        Message = "Cart not found"
                    };
                }
                
                var cartItem = db.Single<CartItems>(ci => ci.Cart_Id == cart.Id && ci.Book_Id == request.BookId);
                if (cartItem == null)
                {
                    return new CartResponse
                    {
                        Success = false,
                        Message = "Item not found in cart"
                    };
                }
                
                db.DeleteById<CartItems>(cartItem.Id);
                
                return new CartResponse
                {
                    Result = "Item removed from cart",
                    Success = true
                };
            }
        }

        public object Post(UpdateCartRequest request)
        {
            if (request.Quantity <= 0)
            {
                return new CartResponse { Success = false, Message = "Quantity must be at least 1" };
            }

            var email = base.GetSession().Email; // JWT claim (email)
            
            using (var db = _dbConnectionFactory.OpenDbConnection())
            {
                var customer = db.Single<Customers>(c => c.Email == email);
                if (customer == null)
                {
                    return new CartResponse
                    {
                        Success = false,
                        Message = "Customer not found"
                    };
                }

                var cart = db.Single<Cart>(c => c.Customer_Id == customer.Id);
                if (cart == null)
                {
                    return new CartResponse
                    {
                        Success = false,
                        Message = "Cart not found"
                    };
                }

                var cartItem = db.Single<CartItems>(ci => ci.Cart_Id == cart.Id && ci.Book_Id == request.BookId);
                if (cartItem == null)
                {
                    return new CartResponse
                    {
                        Success = false,
                        Message = "Item not found in cart"
                    };
                }

                cartItem.Quantity = request.Quantity;
                cartItem.Added_At = DateTime.UtcNow;
                
                db.Update(cartItem);

                return new CartResponse
                {
                    Result = "Cart updated",
                    Success = true
                };
            }
        }

        //simulate quantity drop
        public async Task SimulateLowStockAfterDelay(Guid bookId)
        {
            await Task.Delay(10);
            using (var db = _dbConnectionFactory.OpenDbConnection())
            {
                var book = db.SingleById<Books>(bookId);
                
                if (book == null)
                {
                    return;
                }

                if (book.Units > 10)
                {
                    book.Units = 10;
                    db.Update(book);
                }
            }
        }
    }
}

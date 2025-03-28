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
                            Added_At = DateTime.UtcNow
                        };
                        db.Insert(newItem);
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
                    .Select<CartItems, Books>((ci, b) => new { ci.Id, ci.Quantity, b.Title, b.Price });

                var results = db.SelectMulti<CartItems, Books>(query);

                var items = results.Select(row => new GetCartItemsDTO
                {
                    Id = row.Item1.Id,
                    BookId = row.Item1.Book_Id,
                    BookTitle = row.Item2.Title,
                    Price = row.Item2.Price,
                    Quantity = row.Item1.Quantity
                }).ToList();

                return new GetCartResponse
                {
                    Items = items,
                    Total = items.Sum(i => i.Price * i.Quantity)
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
    }
}

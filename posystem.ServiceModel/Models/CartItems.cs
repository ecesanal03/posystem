using ServiceStack.DataAnnotations;

namespace posystem.ServiceModel.Models
{
    [Alias("CartItems")]
    public class CartItems
    {
        [PrimaryKey]
        public Guid Id { get; set; }

        [References(typeof(Cart))]
        public Guid Cart_Id { get; set; }

        [References(typeof(Books))]
        public Guid Book_Id { get; set; }

        public int Quantity { get; set; }
        public DateTime? Added_At { get; set; }

        [References(typeof(Discounts))]
        public Guid? Discount_Id { get; set; }

    }
}


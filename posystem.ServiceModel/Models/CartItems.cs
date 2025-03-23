using ServiceStack.DataAnnotations;

namespace posystem.ServiceModel.Models
{
    [Alias("CartItems")]
    public class CartItems
    {
        [PrimaryKey]
        public Guid Id { get; set; }

        [References(typeof(Cart))]
        public Guid CartId { get; set; }

        [References(typeof(Books))]
        public Guid BookId { get; set; }

        public int Quantity { get; set; }
        public DateTime? AddedAt { get; set; }

    }
}


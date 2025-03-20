using ServiceStack.DataAnnotations;

namespace posystem.ServiceModel.Models
{
    [Alias("OrderItems")]
    public class OrderItems
    {
        [PrimaryKey]
        public Guid Id { get; set; }

        [References(typeof(Orders))]
        public Guid OrderId { get; set; }

        [References(typeof(Books))]
        public Guid BookId { get; set; }

        public int Quantity { get; set; }
    }
}


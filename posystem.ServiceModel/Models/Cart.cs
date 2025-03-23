using ServiceStack.DataAnnotations;

namespace posystem.ServiceModel.Models
{
    [Alias("Cart")]
    public class Cart
    {
        [PrimaryKey]
        public Guid Id { get; set; }

        [References(typeof(Customers))]
        public Guid CustomerId { get; set; }

        public DateTime? UpdatedAt { get; set; }

    }
}


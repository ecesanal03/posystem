using ServiceStack.DataAnnotations;

namespace posystem.ServiceModel.Models
{
    [Alias("Cart")]
    public class Cart
    {
        [PrimaryKey]
        public Guid Id { get; set; }

        [References(typeof(Customers))]
        public Guid Customer_Id { get; set; }

        public DateTime? Updated_At { get; set; }

    }
}


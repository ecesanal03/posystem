using ServiceStack.DataAnnotations;

namespace posystem.ServiceModel.Models
{
    [Alias("Orders")]
    public class Orders
    {
        [PrimaryKey]
        public Guid Id { get; set; }

        public DateTime OrderDate { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public Guid CustomerId { get; set; }
        public string OrderStatus { get; set; }

        [References(typeof(Customers))]
        public Guid Customer { get; set; }
    }
}


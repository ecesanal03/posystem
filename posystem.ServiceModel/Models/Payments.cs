using ServiceStack.DataAnnotations;

namespace posystem.ServiceModel.Models
{
    [Alias("Payments")]
    public class Payments
    {
        [PrimaryKey]
        public Guid Id { get; set; }

        public string PaymentMethod { get; set; }
        public string PaymentStatus { get; set; }
        public DateTime PaymentDate { get; set; }
    }
}

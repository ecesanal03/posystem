using ServiceStack.DataAnnotations;

namespace posystem.ServiceModel.Models
{
    [Alias("Payments")]
    public class Payments
    {
        [PrimaryKey]
        public Guid Id { get; set; }

        public string Payment_Method { get; set; }
        public string Payment_Status { get; set; }
        public DateTime Payment_Date { get; set; }
    }
}

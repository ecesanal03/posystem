using ServiceStack;
using ServiceStack.DataAnnotations;

namespace posystem.ServiceModel.Models
{
    [Alias("Notifications")]
    public class Notifications
    {
        [PrimaryKey]
        [Required]
        public Guid Id { get; set; }

        [References(typeof(Customers))]
        public Guid Customer_Id { get; set; }

        public string? Message { get; set; }
        public DateTime Created_At { get; set; }
        public bool Is_Read { get; set; }

    }
}
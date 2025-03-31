using ServiceStack.DataAnnotations;

namespace posystem.ServiceModel.Models
{
    [Alias("Discounts")]
    public class Discounts
    {
        [PrimaryKey]
        public Guid Id { get; set; }

        public float Percentage { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Discount_Name { get; set; }
        
        [References(typeof(Employees))]
        public Guid Employee_id { get; set; }
    }
}


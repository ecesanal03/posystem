using ServiceStack.DataAnnotations;

namespace posystem.ServiceModel.Models
{
    [Alias("Reviews")]
    public class Reviews
    {
        [PrimaryKey]
        public Guid Id { get; set; }

        [References(typeof(Customers))]
        public Guid Customer_Id { get; set; }

        [References(typeof(Books))]
        public Guid Book_Id { get; set; }
        
        public int Rating { get; set; }
        public string? Description { get; set; }
        public DateTime Review_Date { get; set; }
    }
}


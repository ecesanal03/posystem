using ServiceStack.DataAnnotations;

namespace posystem.ServiceModel.Models
{
    [Alias("Reviews")]
    public class Reviews
    {
        [PrimaryKey]
        public Guid Id { get; set; }

        public Guid CustomerId { get; set; }
        public Guid BookId { get; set; }
        public int Rating { get; set; }
        public string? Description { get; set; }
        public DateTime ReviewDate { get; set; }

        [References(typeof(Customers))]
        public Guid Customer { get; set; }

        [References(typeof(Books))]
        public Guid Book { get; set; }
    }
}


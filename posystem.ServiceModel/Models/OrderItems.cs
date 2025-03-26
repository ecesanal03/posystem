using ServiceStack.DataAnnotations;

namespace posystem.ServiceModel.Models
{
    [Alias("OrderItems")]
    public class OrderItems
    {
        [PrimaryKey]
        public Guid Id { get; set; }

        [References(typeof(Orders))]
        public Guid Order_Id { get; set; }

        [References(typeof(Books))]
        public Guid Book_Id { get; set; }

        public int Quantity { get; set; }
    }
}


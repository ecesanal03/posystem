using ServiceStack.DataAnnotations;

namespace posystem.ServiceModel.Models
{
    [Alias("Invoices")]
    public class Invoices
    {
        [PrimaryKey]
        public Guid Id { get; set; }

        public DateTime Invoice_Date { get; set; }

        [References(typeof(Customers))]
        public Guid Customer_Id { get; set; }
        public decimal Total_Amount { get; set; }

        [References(typeof(Orders))]
        public Guid Order_Id { get; set; }
        
        [References(typeof(Payments))]
        public Guid Payment_Id { get; set; }

        public DateTime? Generated_At { get; set; }


    }
}

